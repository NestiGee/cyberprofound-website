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
