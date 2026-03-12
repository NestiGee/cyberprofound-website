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
      bio: 'Mary Ann Davidson is one of the most recognized figures in global cybersecurity, having served as Chief Security Officer at Oracle Corporation for nearly 40 years, where she led the company\'s software security assurance program and championed the principle that security must be engineered into products from the ground up. During her tenure, she represented Oracle on the Board of Directors of the IT Information Sharing and Analysis Center (IT-ISAC) and served on the international board of the Information Systems Security Association (ISSA), where she was later inducted into the ISSA Hall of Fame. She has served on the U.S. Defense Science Board and as a member of the Center for Strategic and International Studies Commission on Cybersecurity for the 44th Presidency, and has testified on cybersecurity matters before multiple committees of the U.S. House of Representatives and the Senate. A U.S. Navy veteran and recipient of the Navy Achievement Medal, Ms. Davidson holds a B.S. in Mechanical Engineering from the University of Virginia and an MBA from the Wharton School of the University of Pennsylvania. As Chair of the Board at Cyber Profound, she brings unparalleled governance experience and decades of national security expertise to guide the company\'s mission of building a trusted, unified national cybersecurity platform.'
    },
    gjinaj: {
      name: 'Nest Gjinaj',
      role: 'Founder & Managing Director',
      photo: './assets/headshot-gjinaj.jpg',
      linkedin: 'https://www.linkedin.com/in/nest-gjinaj-929b9863/',
      bio: 'Nest Gjinaj is the Founder and Managing Director of Cyber Profound, a U.S. cybersecurity consolidation platform he established to address the fragmentation and lack of trust he identified as the defining challenge in the American cybersecurity market. His professional foundations were built in the automotive technology sector, where he held quality engineering and compliance roles at Valeo, Aptiv, and Magna International, developing deep expertise in Automotive SPICE, ISO 26262, and IATF-aligned process governance\u2014disciplines that directly inform his rigorous approach to building and scaling organizations. He holds an intacs\u2122 Certified Provisional Assessor credential in Automotive SPICE from KUGLER MAAG CIE by UL Solutions, and currently also serves as Quality Engineering Lead for North America at Magna International. Recognizing a market plagued by absent leadership and eroded trust, Gjinaj founded Risk Intelligence Technologies\u2014a consortium of senior M&A professionals\u2014as the vehicle to acquire and unify high-quality U.S. cybersecurity firms, which evolved into Cyber Profound. He brings to the role a rare combination of engineering discipline, strategic vision, and the transactional expertise required to execute a national cybersecurity consolidation strategy.'
    },
    banerjea: {
      name: 'Gautam Banerjea',
      role: 'Chief Executive Officer',
      photo: './assets/headshot-banerjea.jpg',
      linkedin: 'https://www.linkedin.com/in/gbanerjea/',
      bio: 'Gautam Banerjea serves as Chief Executive Officer of Cyber Profound, where he leads the execution of the company\'s national cybersecurity consolidation strategy. He brings more than 17 years of executive experience at IBM, where he held senior leadership positions including Vice President and Senior Client Partner, developing deep expertise in enterprise technology consulting, business transformation, and client engagement across complex, large-scale programs. During his IBM tenure, he earned recognition as an IBM Consulting Thought Leader and IBM Design Thinking Practitioner, reflecting a career built at the intersection of strategic advisory and technology delivery. His experience managing enterprise relationships and driving business outcomes for clients across multiple industries provides the operational and commercial foundation for scaling Cyber Profound\'s acquisition-led growth model.'
    },
    singh: {
      name: 'Manvedeep Singh',
      role: 'Advisory Board',
      photo: './assets/headshot-singh.jpg',
      linkedin: 'https://www.linkedin.com/in/manvedeepsingh/',
      bio: 'Manvedeep Singh, known professionally as Manav, is a British entrepreneur and multi-sector investor whose business interests span cybersecurity, healthcare, technology, and finance across the United Kingdom, the United States, and multiple international markets. He serves as Co-Founder and Non-Executive Director of Diamond Cyber Group (The Cyberology), a UK-based cybersecurity acquisition consortium, bringing direct expertise in consolidation strategy and the governance of cybersecurity enterprises to his advisory role at Cyber Profound. As Principal of The Private Office of Manvedeep Singh, he oversees a portfolio of advisory mandates and investment relationships, having participated in transactions across healthcare, e-commerce, and professional services. His declared focus is on supporting founders and operators in building enterprises of significant scale, with an emphasis on disciplined M&A, capital origination, and strategic governance. At Cyber Profound, Mr. Singh contributes transactional experience and board-level perspective to the company\'s U.S. cybersecurity roll-up strategy.'
    },
    loretto: {
      name: 'Jonathan Loretto',
      role: 'Cybersecurity Industry Expert',
      photo: '',
      linkedin: 'https://www.linkedin.com/in/jloretto/',
      bio: 'Jonathan Loretto is a senior technology executive with a career spanning global cybersecurity leadership, digital transformation, and enterprise architecture across major financial institutions and technology organizations including HSBC, IBM, Capgemini, and Telstra. At HSBC Digital, he served as Global Head of Digital Security, where he led the creation of a new foundational security architecture and directed security strategy across one of the world\'s largest financial institutions. He has held roles including European Head of Blockchain Delivery and Chief Digital Officer, with professional experience across Europe, North America, North Asia, Southeast Asia, India, Australia, and New Zealand. He holds a degree in International Business from Henley Business School and brings expertise in enterprise and business architecture, program management, digital security, and strategic transformation. At Cyber Profound, Mr. Loretto contributes frontline cybersecurity industry knowledge and global enterprise experience to inform the company\'s acquisition strategy and operational standards.'
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
    modalText.textContent = data.bio;
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
