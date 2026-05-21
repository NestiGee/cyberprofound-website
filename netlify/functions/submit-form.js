/* Netlify Function: submit-form
 * Receives multipart/form-data submissions from the cyberprofound.com forms
 * (Contact, Careers with optional resume, Newsletter) and emails them to
 * Ngjinaj@cyberprofound.com via Resend. Supports file attachments up to ~10MB.
 *
 * Environment variables required:
 *   RESEND_API_KEY  – API key from https://resend.com/api-keys
 *   TO_EMAIL        – default: Ngjinaj@cyberprofound.com
 *   FROM_EMAIL      – default: onboarding@resend.dev (works without DNS verify)
 */

const Busboy = require('busboy');

const TO_EMAIL = process.env.TO_EMAIL || 'Ngjinaj@cyberprofound.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Cyber Profound Website <onboarding@resend.dev>';
// Read from Netlify environment variable. Set via Site settings → Environment variables.
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const headers = {};
    for (const k in event.headers) headers[k.toLowerCase()] = event.headers[k];
    const contentType = headers['content-type'] || headers['Content-Type'];
    if (!contentType || contentType.indexOf('multipart/form-data') === -1) {
      // Try parsing as urlencoded / JSON
      try {
        const body = event.isBase64Encoded
          ? Buffer.from(event.body, 'base64').toString('utf8')
          : (event.body || '');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return resolve({ fields: JSON.parse(body || '{}'), files: [] });
        }
        const fields = {};
        body.split('&').forEach((p) => {
          if (!p) return;
          const [k, v] = p.split('=');
          fields[decodeURIComponent(k.replace(/\+/g, ' '))] = decodeURIComponent((v || '').replace(/\+/g, ' '));
        });
        return resolve({ fields, files: [] });
      } catch (e) {
        return reject(e);
      }
    }

    const busboy = Busboy({ headers: { 'content-type': contentType }, limits: { fileSize: 10 * 1024 * 1024, files: 3 } });
    const fields = {};
    const files = [];

    busboy.on('field', (name, val) => { fields[name] = val; });
    busboy.on('file', (name, fileStream, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      let truncated = false;
      fileStream.on('data', (d) => chunks.push(d));
      fileStream.on('limit', () => { truncated = true; });
      fileStream.on('end', () => {
        if (!filename) return;
        const buf = Buffer.concat(chunks);
        if (buf.length === 0) return;
        files.push({ fieldName: name, filename, contentType: mimeType, content: buf, truncated });
      });
    });
    busboy.on('error', reject);
    busboy.on('finish', () => resolve({ fields, files }));

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body || '', 'utf8');
    busboy.end(body);
  });
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function buildEmail(fields, files) {
  const formType = fields['form-name'] || fields.formType || 'submission';
  const subjectMap = {
    careers: 'Career Application',
    contact: 'Contact Inquiry',
    newsletter: 'Newsletter Signup',
  };
  const subjectBase = subjectMap[formType] || 'Website Submission';
  const senderName = fields.name || fields.Name || '';
  const subject = subjectBase + (senderName ? ' — ' + senderName : '');

  const rows = Object.keys(fields)
    .filter((k) => k !== 'bot-field' && k !== 'form-name' && k !== 'access_key' && k !== 'formType' && fields[k] && String(fields[k]).trim())
    .map((k) => {
      const label = k.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return `<tr><td style="padding:6px 12px;background:#f5f7fa;font-weight:600;vertical-align:top;">${esc(label)}</td><td style="padding:6px 12px;">${esc(fields[k]).replace(/\n/g, '<br>')}</td></tr>`;
    }).join('');

  const fileNote = files.length
    ? `<p style="margin-top:16px;color:#0a3a5c;"><strong>${files.length} attachment(s)</strong> included: ${files.map((f) => esc(f.filename)).join(', ')}</p>`
    : '';

  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#1a2332;">
    <h2 style="color:#051C2C;border-bottom:2px solid #051C2C;padding-bottom:8px;">${esc(subjectBase)}</h2>
    <p style="color:#555;">New submission from <a href="https://cyberprofound.com" style="color:#0a6cb0;">cyberprofound.com</a></p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e1e6ed;margin-top:12px;">${rows}</table>
    ${fileNote}
    <p style="margin-top:24px;font-size:12px;color:#888;">Sent automatically by the Cyber Profound website form handler.</p>
  </body></html>`;

  const text = Object.keys(fields)
    .filter((k) => k !== 'bot-field' && k !== 'form-name' && fields[k])
    .map((k) => `${k}: ${fields[k]}`).join('\n');

  return { subject, html, text };
}

async function sendViaResend({ subject, html, text, files, replyTo }) {
  const attachments = files.map((f) => ({
    filename: f.filename,
    content: f.content.toString('base64'),
  }));

  const payload = {
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    subject,
    html,
    text,
    attachments,
  };
  if (replyTo) payload.reply_to = replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error('Resend ' + res.status + ': ' + body);
  }
  return body;
}

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };

  if (!RESEND_API_KEY) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ success: false, error: 'Email service not configured (missing RESEND_API_KEY).' }) };
  }

  try {
    const { fields, files } = await parseMultipart(event);

    // Honeypot
    if (fields['bot-field']) {
      return { statusCode: 200, headers: cors, body: JSON.stringify({ success: true }) };
    }

    const { subject, html, text } = buildEmail(fields, files);
    const replyTo = fields.email || fields.Email || undefined;

    await sendViaResend({ subject, html, text, files, replyTo });

    return { statusCode: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('submit-form error:', err);
    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: (err && err.message) || 'Server error' }),
    };
  }
};
