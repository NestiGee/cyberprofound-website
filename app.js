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

/* ===== Dropdown Nav ===== */
(function() {
  var dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  var overlay = document.getElementById('dropdownOverlay');
  var activeItem = null;

  function closeAll() {
    dropdownItems.forEach(function(item) { item.classList.remove('active'); });
    if (overlay) overlay.classList.remove('visible');
    activeItem = null;
  }

  dropdownItems.forEach(function(item) {
    var link = item.querySelector('.nav-link');
    link.addEventListener('click', function(e) {
      e.preventDefault();
      if (activeItem === item) {
        closeAll();
      } else {
        closeAll();
        item.classList.add('active');
        if (overlay) overlay.classList.add('visible');
        activeItem = item;
      }
    });
  });

  if (overlay) {
    overlay.addEventListener('click', closeAll);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAll();
  });

  // Close on scroll
  window.addEventListener('scroll', function() {
    if (activeItem) closeAll();
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

/* ===== Search Overlay ===== */
(function() {
  var searchToggle = document.getElementById('searchToggle');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchClose = document.getElementById('searchClose');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');

  if (!searchToggle || !searchOverlay) return;

  /* -- Search index: curated content from all pages -- */
  var searchIndex = [
    /* HOME */
    { page: 'Home', title: 'Acquire. Integrate. Scale. Protect.', desc: 'Cyber Profound is building America\'s preeminent cybersecurity platform through disciplined M&A.', url: './index.html' },
    { page: 'Platform', title: 'One Platform. Total Protection.', desc: 'Enterprise-grade cybersecurity through strategic acquisition and integration of best-in-class U.S. firms.', url: './index.html#platform' },
    { page: 'Approach', title: 'Disciplined Acquisition', desc: 'Revenue-positive firms with strong client relationships and recurring contracts. Long-term ownership, not flip-and-exit.', url: './index.html#solutions' },
    { page: 'Approach', title: 'Platform Value Creation', desc: 'Shared SOC, threat intelligence, compliance tooling, and national-scale delivery from day one.', url: './index.html#solutions' },
    { page: 'Approach', title: 'Operational Excellence', desc: 'Centralized shared services, unified reporting, and performance governance across the portfolio.', url: './index.html#solutions' },
    { page: 'Approach', title: 'Risk Management', desc: 'Formal due diligence, cybersecurity audits, regulatory review, and integration risk controls.', url: './index.html#solutions' },
    { page: 'Why Cyber Profound', title: 'Permanent Capital. Disciplined Governance. National Reach.', desc: 'Investment consortium with 400+ years combined leadership in cybersecurity, enterprise tech, and M&A.', url: './index.html#threat' },
    { page: 'Acquisition Focus', title: 'Target Profiles', desc: 'Managed security service providers, identity and access management, cloud security, GRC, and incident response firms.', url: './index.html#targets' },
    /* LEADERSHIP */
    { page: 'Leadership', title: 'Mary Ann Davidson — Chair of the Board', desc: 'Former CSO of Oracle with nearly 40 years in software security, engineering governance, and cybersecurity standards.', url: './index.html#leadership' },
    { page: 'Leadership', title: 'Nest Gjinaj — Founder & Managing Director', desc: 'Strategist and leader focused on redefining the U.S. cybersecurity market through strategic acquisition.', url: './index.html#leadership' },
    { page: 'Leadership', title: 'Gautam Banerjea — Chief Executive Officer', desc: 'Over 30 years of enterprise technology and cloud transformation leadership, including 17 years at IBM.', url: './index.html#leadership' },
    { page: 'Leadership', title: 'Manvedeep Singh — Non-Executive Director', desc: 'British entrepreneur with interests spanning healthcare, hospitality, technology, and finance across multiple continents.', url: './index.html#leadership' },
    { page: 'Leadership', title: 'Jonathan Loretto — Non-Executive Director', desc: '25+ years advising boards on digital transformation, cyber resilience, and AI governance across financial services and telecom.', url: './index.html#leadership' },
    /* ABOUT */
    { page: 'About', title: 'Our Mission', desc: 'To acquire, support, and unify high-quality U.S. cybersecurity firms under one operationally excellent, nationally scaled platform.', url: './about.html#mission' },
    { page: 'About', title: 'Our Vision', desc: 'To become the most trusted cybersecurity consolidation platform in the United States.', url: './about.html#mission' },
    { page: 'About', title: 'The Opportunity — Market Fragmentation', desc: 'The U.S. cybersecurity market includes thousands of small and mid-size firms operating independently without scale.', url: './about.html#opportunity' },
    { page: 'About', title: 'Our Approach — Permanent Capital', desc: 'Selective acquisition, operational integration, value creation, and long-term ownership.', url: './about.html#approach' },
    { page: 'About', title: 'Who We Are', desc: 'Led by operators, not financial engineers. Senior professionals across cybersecurity, enterprise technology, and M&A.', url: './about.html#team' },
    /* NEWS */
    { page: 'News', title: 'Mary Ann Davidson Appointed Chair of the Board', desc: 'Former Oracle Chief Security Officer joins Cyber Profound to lead board oversight and cybersecurity governance.', url: './news.html' },
    { page: 'News', title: 'Why U.S. Cybersecurity Consolidation Is Accelerating', desc: 'Market dynamics driving the wave of cybersecurity M&A and platform-based security models.', url: './news.html' },
    { page: 'News', title: 'How Integrated Security Platforms Improve Outcomes', desc: 'The benefits of unified cybersecurity delivery versus fragmented point solutions.', url: './news.html' },
    { page: 'News', title: 'What Cybersecurity Business Owners Should Know Before Selling', desc: 'Key considerations for cybersecurity firm founders evaluating acquisition opportunities.', url: './news.html' },
    /* CAREERS */
    { page: 'Careers', title: 'Join Cyber Profound', desc: 'Build the future of cybersecurity. Senior leadership and advisory roles available.', url: './careers.html' },
    { page: 'Careers', title: 'Chief Financial Officer', desc: 'Lead financial strategy, M&A deal structuring, capital allocation, and investor relations.', url: './careers.html#positions' },
    { page: 'Careers', title: 'Chief Operating Officer', desc: 'Oversee platform operations, post-acquisition integration, and shared services buildout.', url: './careers.html#positions' },
    { page: 'Careers', title: 'Chief Legal Officer', desc: 'Direct legal affairs including M&A transaction structuring, regulatory compliance, and corporate governance.', url: './careers.html#positions' },
    { page: 'Careers', title: 'Investment Banker', desc: 'Source, evaluate, and execute cybersecurity acquisitions across the United States.', url: './careers.html#positions' },
    { page: 'Careers', title: 'Tax Partner', desc: 'Advise on tax-efficient deal structuring and multi-entity tax planning across acquisitions.', url: './careers.html#positions' },
    { page: 'Careers', title: 'Submit Your Resume', desc: 'Share your background for confidential executive and advisory positions at Cyber Profound.', url: './careers.html#apply' },
    /* LEGAL */
    { page: 'Legal', title: 'Privacy Policy', desc: 'How Cyber Profound collects, uses, and protects your information.', url: './privacy.html' },
    { page: 'Legal', title: 'Terms of Service', desc: 'Terms and conditions governing use of the Cyber Profound website.', url: './terms.html' },
    /* CONTACT */
    { page: 'Contact', title: 'Get in Touch', desc: 'Email nest.gjinaj@cyberprofound.com or call +(888) 900-7343 to discuss acquisition opportunities.', url: './index.html#contact' }
  ];

  function openSearch() {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { searchInput.focus(); }, 200);
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  searchToggle.addEventListener('click', openSearch);
  searchClose.addEventListener('click', closeSearch);

  // Close on background click
  searchOverlay.addEventListener('click', function(e) {
    if (e.target === searchOverlay) closeSearch();
  });

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) closeSearch();
  });

  // Keyboard shortcut: Ctrl/Cmd + K
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchOverlay.classList.contains('active')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
  });

  // Search on input
  searchInput.addEventListener('input', function() {
    var query = searchInput.value.trim().toLowerCase();
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    var terms = query.split(/\s+/);
    var matches = searchIndex.filter(function(item) {
      var haystack = (item.title + ' ' + item.desc + ' ' + item.page).toLowerCase();
      return terms.every(function(term) { return haystack.indexOf(term) !== -1; });
    });

    if (matches.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found for \u201c' + escapeHtml(searchInput.value.trim()) + '\u201d</div>';
      return;
    }

    var html = '';
    matches.forEach(function(item) {
      html += '<a class="search-result-item" href="' + item.url + '">';
      html += '<div class="search-result-label">' + escapeHtml(item.page) + '</div>';
      html += '<div class="search-result-title">' + highlightMatch(item.title, terms) + '</div>';
      html += '<div class="search-result-desc">' + highlightMatch(item.desc, terms) + '</div>';
      html += '</a>';
    });
    searchResults.innerHTML = html;

    // Close search when clicking a result
    searchResults.querySelectorAll('.search-result-item').forEach(function(link) {
      link.addEventListener('click', function() {
        closeSearch();
      });
    });
  });

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function highlightMatch(text, terms) {
    var escaped = escapeHtml(text);
    terms.forEach(function(term) {
      var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      escaped = escaped.replace(regex, '<mark style="background:rgba(224,30,38,0.25);color:inherit;border-radius:2px;padding:0 2px;">$1</mark>');
    });
    return escaped;
  }
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

/* ===== Cookie Consent ===== */
(function() {
  var banner = document.getElementById('cookieConsent');
  var acceptBtn = document.getElementById('cookieAccept');
  var declineBtn = document.getElementById('cookieDecline');

  if (!banner) return;

  // Check if already responded
  if (localStorage.getItem('cp_cookie_consent')) return;

  // Show banner after 1.5s delay
  setTimeout(function() {
    banner.classList.add('visible');
  }, 1500);

  function hideBanner(value) {
    localStorage.setItem('cp_cookie_consent', value);
    banner.classList.remove('visible');
  }

  if (acceptBtn) acceptBtn.addEventListener('click', function() { hideBanner('accepted'); });
  if (declineBtn) declineBtn.addEventListener('click', function() { hideBanner('declined'); });
})();

/* ===== Back to Top ===== */
(function() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== FAQ Accordion ===== */
(function() {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function(item) {
    var btn = item.querySelector('.faq-question');
    btn.addEventListener('click', function() {
      var isActive = item.classList.contains('active');
      // Close all
      items.forEach(function(i) { i.classList.remove('active'); });
      // Toggle clicked
      if (!isActive) item.classList.add('active');
    });
  });
})();
