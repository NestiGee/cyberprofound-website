/* ===== Header Scroll Effect ===== */
(function() {
  var header = document.getElementById('header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
      header.style.borderBottomColor = 'rgba(255,255,255,0.1)';
    } else {
      header.style.borderBottomColor = 'rgba(255,255,255,0.08)';
    }
  }, { passive: true });
})();

/* ===== Mobile Menu ===== */
(function() {
  var openBtn = document.getElementById('mobileOpen');
  var closeBtn = document.getElementById('mobileClose');
  var menu = document.getElementById('mobileMenu');

  if (openBtn && closeBtn && menu) {
    openBtn.addEventListener('click', function() {
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    closeBtn.addEventListener('click', function() {
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ===== Smooth Scroll ===== */
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ===== Stat Counter Animation ===== */
(function() {
  var stats = [
    { el: null, target: 100, suffix: '%' },
    { el: null, target: 400, suffix: '+' },
    { el: null, target: 24, suffix: '/7' },
    { el: null, target: 50, suffix: '+' }
  ];

  var statEls = document.querySelectorAll('.stat-number');
  if (statEls.length < 4) return;

  stats.forEach(function(s, i) { s.el = statEls[i]; });

  var animated = false;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(function(s) {
          animateCounter(s.el, 0, s.target, 1500, s.suffix);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statEls[0].closest('.stats-bar'));

  function animateCounter(el, start, end, duration, suffix) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * (end - start) + start);

      el.innerHTML = current + '<span class="accent">' + suffix + '</span>';

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }
})();

/* ===== Card Plus Toggle (LinkedIn reveal) ===== */
(function() {
  document.querySelectorAll('.card-plus').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var social = btn.closest('.card-social');
      var isOpen = social.classList.contains('open');

      // Close all other open socials
      document.querySelectorAll('.card-social.open').forEach(function(openSocial) {
        if (openSocial !== social) {
          openSocial.classList.remove('open');
        }
      });

      // Toggle current
      social.classList.toggle('open');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.card-social')) {
      document.querySelectorAll('.card-social.open').forEach(function(s) {
        s.classList.remove('open');
      });
    }
  });
})();

/* ===== Bio Modal ===== */
(function() {
  var bioData = {
    davidson: {
      name: 'Mary Ann Davidson',
      role: 'Chair of the Board',
      photo: './assets/headshot-davidson.jpg',
      linkedin: 'https://www.linkedin.com/in/mary-ann-davidson-235ba/',
      bio: 'Mary Ann Davidson is a senior cybersecurity executive with nearly 40 years of experience in software security, engineering governance, and large-scale technology operations. She spent more than 35 years at Oracle Corporation, joining the company in 1988 and holding roles in product management and security before becoming Oracle\'s Chief Security Officer. In that position, she was responsible for software security assurance, secure development lifecycle programs, vulnerability response, and security standards across Oracle\'s global product suite.\n\nHer previous experience includes service as a commissioned officer in the United States Navy Civil Engineer Corps, where she worked on engineering, operations, and infrastructure responsibilities. She holds a Bachelor\'s degree in Mechanical Engineering from the University of Virginia and an MBA from the Wharton School of the University of Pennsylvania.\n\nMary Ann has participated in various U.S. government and industry advisory groups throughout her career. Her involvement includes work with the Defense Science Board, the Center for Strategic and International Studies (CSIS) Cybersecurity Commission, and related technical committees focused on software assurance, critical infrastructure, and cybersecurity standards. She has also provided expert testimony to congressional committees regarding software security and national cybersecurity issues.'
    },
    gjinaj: {
      name: 'Nest Gjinaj',
      role: 'Founder & Managing Director',
      photo: './assets/headshot-gjinaj.jpg',
      linkedin: 'https://www.linkedin.com/in/nest-gjinaj-929b9863/',
      bio: 'Nest Gjinaj is heralded as both strategist and leader, a man whose foundations were laid in the rigour of engineering, and whose career has been tempered by the exacting realms of quality, security, and transformation. He now embarks upon a new strategic mission of consequence: to redefine the cybersecurity market in the United States of America.\n\nFor years, Nest has stood at the confluence of technology and governance, where precision is non-negotiable, discipline is enforced, and vision is demanded at its highest expression. He is esteemed not merely for his individual craft, but for his rare ability to assemble around him men and women of talent who sharpen and elevate his own mettle.\n\nThrough his tenure across the corporate bastions of Mergers & Acquisitions, Finance, and Technology, he has discerned a void; a chasm in the very heart of the American cybersecurity domain. Here lies a market plagued not by lack of capital, but by absence of trust, of enduring relationships, of honed skill, and of decisive leadership.\n\nIt is in answer to this deficiency that Nest has founded Cyber Profound, an Investment Consortium composed of senior business professionals, that have conducted billions of dollars in transactions, across successive years. Their collective mission is neither idle nor tentative: it is to transform the cybersecurity landscape of the United States through the strategic acquisition of small and medium sized enterprises, thereby forging an industry fortified by integrity, mastery, and leadership.'
    },
    banerjea: {
      name: 'Gautam Banerjea',
      role: 'Chief Executive Officer',
      photo: './assets/headshot-banerjea.jpg',
      linkedin: 'https://www.linkedin.com/in/gbanerjea/',
      bio: 'Gautam Banerjea serves as Chief Executive Officer of Cyber Profound, where he leads execution of the company\'s national cybersecurity consolidation strategy, oversees platform integration, and drives enterprise expansion across priority verticals.\n\nMr. Banerjea brings more than three decades of senior leadership experience in enterprise technology, cloud transformation, and large-scale P&L management. Prior to joining Cyber Profound, he held multiple executive roles at IBM over a 17-year tenure, including Vice President and Senior Client Partner.\n\nMr. Banerjea has directed multi-billion-dollar P&Ls, driving consistent growth and delivering complex modernization programs across Retail, CPG, Travel, Transportation, and Healthcare industries. He has pioneered large-scale cloud migrations, integrated AI-driven solutions, and championed agile enterprise models that accelerate innovation and reduce cost. He has worked extensively across North America, Europe, and Asia-Pacific, leading multicultural teams and delivering mission-critical programs in over 50 countries.\n\nHis leadership experience spans hybrid cloud architecture, DevSecOps modernization, AI-enabled automation, enterprise application transformation, and large-scale Agile operating model deployments. Earlier in his career, Mr. Banerjea held senior leadership roles at Ernst and Young, CapGemini, HP, and EDS.\n\nHe holds a Master of Science in Information Systems from The University of Texas at Dallas and a Master of Science in Applied Economics from Birla Institute of Technology and Science.\n\nAt Cyber Profound, Mr. Banerjea is focused on building a disciplined, enterprise-grade cybersecurity platform through structured acquisitions, operational integration, and long-term value creation.'
    },
    singh: {
      name: 'Manvedeep Singh',
      role: 'Non-Executive Director',
      photo: './assets/headshot-singh.jpg',
      linkedin: 'https://www.linkedin.com/in/manvedeepsingh/',
      bio: 'Manvedeep "Manav" Singh, known to most as Manav, is a British entrepreneur whose undertakings extend across healthcare, hospitality, technology, and finance. Possessing both prior and active business interests upon several continents, he unites strategic foresight with a firm, results-oriented execution. His present ventures encompass care villages, cybersecurity, artificial intelligence, telecommunications, and a cigar-themed hotel conceived for those who prize craftsmanship and distinction.\n\nBeyond the sphere of commerce, Mr. Singh acts as founder, adviser, and Non-Executive Director to several enterprises. His declared mission is to assist one hundred individuals, with particular emphasis upon women, to build enterprises of \u00a3100 million and greater value, thereby cultivating a new generation of independent and capable leaders. Grounded alike in enterprise and philanthropy, he continues to advance ventures and causes designed to leave a durable and beneficial mark upon society.'
    },
    loretto: {
      name: 'Jonathan Loretto',
      role: 'Non-Executive Director',
      photo: '',
      linkedin: 'https://www.linkedin.com/in/jloretto/',
      bio: 'Jonathan Loretto serves as Non-Executive Director and Cyber Industry Expert of Cyber Profound, where he provides independent board oversight and strategic guidance across enterprise transformation, cybersecurity strategy, governance, and platform integration as the company executes its long-term acquisition and growth strategy.\n\nMr. Loretto brings more than 25 years of international leadership experience advising boards and executive teams on large scale digital transformation, operating model design, and technology driven organizational change across financial services, telecommunications, utilities, supply chain, and private equity backed enterprises throughout Europe, North America, and Australia.\n\nHe has led complex transformation initiatives focused on improving operational resilience, strengthening risk posture, and enabling secure adoption of emerging technologies within regulated enterprise environments. His work has consistently centered on translating board level strategy into executable delivery structures that produce measurable commercial outcomes.\n\nMr. Loretto is recognized for his expertise in cyber resilience, artificial intelligence governance, and enterprise architecture strategy, advising senior stakeholders on navigating technological disruption while maintaining regulatory alignment and operational discipline.\n\nEarlier in his career, Mr. Loretto held senior enterprise leadership roles delivering large scale technology and transformation programs and served as IBM\'s Oracle Lead, acting as a senior executive point of contact responsible for strategic alignment, enterprise delivery coordination, and executive engagement across complex global client environments.\n\nAt Cyber Profound, Mr. Loretto supports the Board and executive leadership team in establishing a disciplined governance framework and scalable operating foundation as the company builds an enterprise grade cybersecurity platform through structured acquisitions and long-term value creation.'
    }
  };

  var modal = document.getElementById('bioModal');
  var modalPhoto = document.getElementById('bioModalPhoto');
  var modalName = document.getElementById('bioModalName');
  var modalRole = document.getElementById('bioModalRole');
  var modalText = document.getElementById('bioModalText');
  var modalLinkedIn = document.getElementById('bioModalLinkedIn');
  var closeBtn = modal.querySelector('.bio-modal-close');

  function openBio(memberKey) {
    var data = bioData[memberKey];
    if (!data) return;

    modalName.textContent = data.name;
    modalRole.textContent = data.role;
    modalText.innerHTML = data.bio.split('\n\n').map(function(p) { return '<p>' + p + '</p>'; }).join('');
    modalLinkedIn.href = data.linkedin;

    if (data.photo) {
      modalPhoto.src = data.photo;
      modalPhoto.alt = data.name;
      modalPhoto.parentElement.style.display = '';
    } else {
      modalPhoto.parentElement.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBio() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Click on team card photo to open bio
  document.querySelectorAll('.team-card[data-member]').forEach(function(card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
      // Don't open if clicking the + button or LinkedIn link
      if (e.target.closest('.card-plus') || e.target.closest('.social-linkedin')) return;
      var member = card.getAttribute('data-member');
      openBio(member);
    });
  });

  // Close modal
  closeBtn.addEventListener('click', closeBio);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeBio();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeBio();
  });
})();

/* ===== Fallback Scroll Reveal ===== */
(function() {
  if (CSS.supports && CSS.supports('animation-timeline', 'scroll()')) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(function(el) {
    el.style.opacity = '0';
    observer.observe(el);
  });
})();
