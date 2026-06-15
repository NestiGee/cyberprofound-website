// Cyber Profound — Hero 3D scene
// A central faceted "core" (the platform) with orbiting nodes (target firms)
// converging on it. Pulse rings emit outward; orbit lines trace the consolidation.

import * as THREE from 'three';

const canvas = document.getElementById('cp-hero-canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 9);

// =============== Lighting ===============
// Lights tuned to Cyber Profound palette: #0065fc primary + #20808D teal + #F4F2EC bone rim
scene.add(new THREE.AmbientLight(0x0a1b2e, 0.75));
const keyLight = new THREE.PointLight(0x0065fc, 2.6, 30);
keyLight.position.set(4, 3, 5);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0x20808d, 1.8, 25);
fillLight.position.set(-5, -2, 4);
scene.add(fillLight);
const rimLight = new THREE.PointLight(0xf4f2ec, 1.0, 20);
rimLight.position.set(0, 4, -3);
scene.add(rimLight);

// =============== Central Core ===============
// A faceted icosahedron with a wireframe overlay = the platform
const coreGroup = new THREE.Group();
scene.add(coreGroup);

const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
const coreMat = new THREE.MeshPhysicalMaterial({
  color: 0x0a1b2e,
  metalness: 0.75,
  roughness: 0.2,
  clearcoat: 1.0,
  clearcoatRoughness: 0.12,
  emissive: 0x0065fc,
  emissiveIntensity: 0.28,
  envMapIntensity: 1.2,
});
const coreMesh = new THREE.Mesh(coreGeo, coreMat);
coreGroup.add(coreMesh);

// Wireframe shell
const wireGeo = new THREE.IcosahedronGeometry(1.42, 1);
const wireMat = new THREE.LineBasicMaterial({
  color: 0x0065fc,
  transparent: true,
  opacity: 0.7,
});
const wireMesh = new THREE.LineSegments(new THREE.EdgesGeometry(wireGeo), wireMat);
coreGroup.add(wireMesh);

// Outer halo sphere (very soft)
const haloGeo = new THREE.SphereGeometry(1.85, 32, 32);
const haloMat = new THREE.MeshBasicMaterial({
  color: 0x0065fc,
  transparent: true,
  opacity: 0.08,
  side: THREE.BackSide,
});
coreGroup.add(new THREE.Mesh(haloGeo, haloMat));

// =============== Orbit rings ===============
const ringsGroup = new THREE.Group();
scene.add(ringsGroup);

function makeOrbitRing(radius, tilt, color, opacity = 0.18) {
  const segments = 128;
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const line = new THREE.Line(geo, mat);
  line.rotation.x = tilt;
  return line;
}

// Inner orbit = primary blue, mid = teal accent, outer = bone
ringsGroup.add(makeOrbitRing(2.4, Math.PI / 2.2, 0x0065fc, 0.32));
ringsGroup.add(makeOrbitRing(3.1, Math.PI / 2 + 0.18, 0x20808d, 0.22));
ringsGroup.add(makeOrbitRing(3.8, Math.PI / 2 - 0.22, 0xf4f2ec, 0.1));

// =============== Orbiting nodes (target firms) ===============
const nodesGroup = new THREE.Group();
scene.add(nodesGroup);

// Node colors strictly from brand palette: primary blue, teal, bone
const nodeConfigs = [
  { r: 2.4, tilt: Math.PI / 2.2, speed: 0.32, phase: 0.0, size: 0.13, color: 0x0065fc },
  { r: 2.4, tilt: Math.PI / 2.2, speed: 0.32, phase: 2.1, size: 0.1, color: 0xf4f2ec },
  { r: 2.4, tilt: Math.PI / 2.2, speed: 0.32, phase: 4.2, size: 0.11, color: 0x20808d },
  { r: 3.1, tilt: Math.PI / 2 + 0.18, speed: -0.22, phase: 0.6, size: 0.14, color: 0x0065fc },
  { r: 3.1, tilt: Math.PI / 2 + 0.18, speed: -0.22, phase: 2.8, size: 0.1, color: 0x20808d },
  { r: 3.1, tilt: Math.PI / 2 + 0.18, speed: -0.22, phase: 5.0, size: 0.12, color: 0xf4f2ec },
  { r: 3.8, tilt: Math.PI / 2 - 0.22, speed: 0.16, phase: 1.2, size: 0.09, color: 0x0065fc },
  { r: 3.8, tilt: Math.PI / 2 - 0.22, speed: 0.16, phase: 3.6, size: 0.12, color: 0x20808d },
];

const nodes = [];
nodeConfigs.forEach((cfg) => {
  const g = new THREE.Group();
  // Node mesh (small octahedron — sharper than a sphere)
  const geo = new THREE.OctahedronGeometry(cfg.size, 0);
  const mat = new THREE.MeshPhysicalMaterial({
    color: cfg.color,
    metalness: 0.4,
    roughness: 0.3,
    emissive: cfg.color,
    emissiveIntensity: 0.6,
  });
  const m = new THREE.Mesh(geo, mat);
  g.add(m);

  // Glow sprite around each node
  const glowMat = new THREE.SpriteMaterial({
    map: makeGlowTexture(),
    color: cfg.color,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(glowMat);
  sprite.scale.setScalar(cfg.size * 6);
  g.add(sprite);

  nodesGroup.add(g);
  nodes.push({ group: g, mesh: m, ...cfg });
});

function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(244,242,236,1)');
  grad.addColorStop(0.4, 'rgba(77,146,255,0.55)');
  grad.addColorStop(1, 'rgba(0,101,252,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// =============== Connecting lines (node -> core) ===============
const linesGroup = new THREE.Group();
scene.add(linesGroup);

const lineGeoms = nodes.map((n) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 0]), 3)
  );
  // Lines inherit each node's brand color
  const mat = new THREE.LineBasicMaterial({
    color: n.color,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
  });
  const line = new THREE.Line(g, mat);
  linesGroup.add(line);
  return { g, line, mat };
});

// =============== Pulse rings (emitting from core) ===============
const pulses = [];
function spawnPulse() {
  const geo = new THREE.RingGeometry(1.5, 1.55, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x0065fc,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  pulses.push({ mesh: ring, mat, life: 0 });
}

// =============== Particle starfield ===============
const starCount = 380;
const starPositions = new Float32Array(starCount * 3);
const starSizes = new Float32Array(starCount);
for (let i = 0; i < starCount; i++) {
  const r = 8 + Math.random() * 12;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 2 - 1);
  starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  starPositions[i * 3 + 2] = r * Math.cos(phi) - 4; // push back
  starSizes[i] = Math.random() * 0.04 + 0.01;
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({
  color: 0xf4f2ec,
  size: 0.04,
  transparent: true,
  opacity: 0.5,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
scene.add(new THREE.Points(starGeo, starMat));

// =============== Mouse parallax ===============
const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = (e.clientY / window.innerHeight) * 2 - 1;
  target.x = nx * 0.3;
  target.y = -ny * 0.2;
});

// =============== Resize ===============
function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;

  // Pull camera back on mobile so core fits
  camera.position.z = w < 720 ? 11 : 9;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// =============== Animate ===============
const clock = new THREE.Clock();
let lastPulse = 0;

function tick() {
  const t = clock.getElapsedTime();
  const dt = clock.getDelta();

  // Smooth parallax
  current.x += (target.x - current.x) * 0.05;
  current.y += (target.y - current.y) * 0.05;
  scene.rotation.y = current.x * 0.6;
  scene.rotation.x = current.y * 0.4;

  // Core slow rotation + breathing
  coreGroup.rotation.y = t * 0.18;
  coreGroup.rotation.x = Math.sin(t * 0.3) * 0.15;
  const breath = 1 + Math.sin(t * 1.4) * 0.025;
  coreGroup.scale.setScalar(breath);
  coreMat.emissiveIntensity = 0.22 + Math.sin(t * 1.8) * 0.08;

  // Orbit rings counter-rotate slightly
  ringsGroup.rotation.y = t * 0.05;

  // Orbiting nodes
  nodes.forEach((n, i) => {
    const angle = t * n.speed + n.phase;
    const x = Math.cos(angle) * n.r;
    const z = Math.sin(angle) * n.r;
    // Apply orbit tilt around X axis
    const y = z * Math.cos(n.tilt - Math.PI / 2);
    const z2 = z * Math.sin(n.tilt - Math.PI / 2);
    n.group.position.set(x, y, z2);
    n.mesh.rotation.x = t * 1.2;
    n.mesh.rotation.y = t * 0.8;

    // Update connecting line
    const arr = lineGeoms[i].g.attributes.position.array;
    arr[0] = x;
    arr[1] = y;
    arr[2] = z2;
    arr[3] = 0;
    arr[4] = 0;
    arr[5] = 0;
    lineGeoms[i].g.attributes.position.needsUpdate = true;

    // Pulse line opacity based on phase — feels like data flowing in
    const pulse = (Math.sin(t * 1.5 + i * 1.3) + 1) / 2;
    lineGeoms[i].mat.opacity = 0.08 + pulse * 0.32;
  });

  // Pulse rings — spawn every ~1.8s
  if (!reduceMotion && t - lastPulse > 1.8) {
    spawnPulse();
    lastPulse = t;
  }
  for (let i = pulses.length - 1; i >= 0; i--) {
    const p = pulses[i];
    p.life += dt;
    const scale = 1 + p.life * 1.4;
    p.mesh.scale.set(scale, scale, scale);
    p.mat.opacity = Math.max(0, 0.55 * (1 - p.life / 3.2));
    if (p.life > 3.2) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mat.dispose();
      pulses.splice(i, 1);
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
