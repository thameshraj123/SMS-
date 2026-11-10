/**
 * SVMS CONSTRUCTIONS - Interactive Scripts & Scroll Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Scroll Reveal Animations (Intersection Observer)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, trigger counter animation if it exists inside
        const counterEl = entry.target.querySelector('.counter-number');
        if (counterEl && !counterEl.dataset.counted) {
          animateCounter(counterEl);
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 2. Animated Counter for Metrics & Stats Section
  // --------------------------------------------------------------------------
  const statCounters = document.querySelectorAll('.stat-counter');
  let statsTriggered = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        statCounters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth easeOutCubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * target);

            counter.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, {
    threshold: 0.25
  });

  const statsSection = document.querySelector('.stats-counter-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateCounter(el) {
    el.dataset.counted = "true";
    const target = parseInt(el.getAttribute('data-target'), 10) || 100;
    const duration = 1600;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(target * (1 - Math.pow(1 - progress, 4)));
      el.textContent = current;

      if (frame >= totalFrames) {
        el.textContent = target;
        clearInterval(counter);
      }
    }, frameRate);
  }

  // --------------------------------------------------------------------------
  // Scroll to Top Button functionality
  // --------------------------------------------------------------------------
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      if (scrollTopBtn) scrollTopBtn.classList.add('visible');
    } else {
      if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Sticky Navbar with blur & Shrink
  // --------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // --------------------------------------------------------------------------
  // 4. Mobile Menu Toggle & Mobile Dropdown
  // --------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navDropdown = document.querySelector('.nav-dropdown');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      if (navMenu.classList.contains('open')) {
        mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      } else {
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });

    // Toggle dropdown on mobile
    if (navDropdown) {
      const dropdownLink = navDropdown.querySelector('.nav-link');
      if (dropdownLink) {
        dropdownLink.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            navDropdown.classList.toggle('open');
          }
        });
      }
    }

    // Close menu when clicking normal links
    navMenu.querySelectorAll('a:not(.nav-dropdown > .nav-link)').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Testimonial Carousel Data & Controls
  // --------------------------------------------------------------------------
  const testimonials = [
    {
      quote: "SMS Constructions did an amazing job with our home tiles and granite work. The finish is perfect and the team was very professional. Highly recommended!",
      name: "Priya Sharma",
      role: "Homeowner",
      avatar: "avatar-priya.png",
      rating: 5
    },
    {
      quote: "The precision in their Italian marble installation and leveling is unmatched. They transformed our entire commercial lobby within the promised deadline.",
      name: "Rajesh Varma",
      role: "Commercial Developer",
      avatar: "avatar-priya.png",
      rating: 5
    },
    {
      quote: "Their granite reworking service made our 15-year-old kitchen countertops look brand new with mirror finish polish. Very courteous craftsmen!",
      name: "Ananya Iyer",
      role: "Villa Owner",
      avatar: "avatar-priya.png",
      rating: 5
    }
  ];

  let currentTestimonialIndex = 0;
  const quoteTextEl = document.querySelector('.testimonial-quote-p');
  const authorNameEl = document.querySelector('.author-name');
  const authorRoleEl = document.querySelector('.author-role');
  const authorAvatarEl = document.querySelector('.author-avatar');
  const prevBtn = document.querySelector('.arrow-circle-btn.prev-btn');
  const nextBtn = document.querySelector('.arrow-circle-btn.next-btn');

  function updateTestimonial(index) {
    if (!quoteTextEl) return;
    const data = testimonials[index];
    
    // Smooth fade transition
    quoteTextEl.style.opacity = '0';
    quoteTextEl.style.transform = 'translateY(6px)';
    
    setTimeout(() => {
      quoteTextEl.textContent = `"${data.quote}"`;
      if (authorNameEl) authorNameEl.textContent = data.name;
      if (authorRoleEl) authorRoleEl.textContent = data.role;
      if (authorAvatarEl && data.avatar) authorAvatarEl.src = data.avatar;
      
      quoteTextEl.style.transition = 'all 0.3s ease';
      quoteTextEl.style.opacity = '1';
      quoteTextEl.style.transform = 'translateY(0)';
    }, 200);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      updateTestimonial(currentTestimonialIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      updateTestimonial(currentTestimonialIndex);
    });
  }

  // --------------------------------------------------------------------------
  // 6. Modal Handlers: Get a Quote, Watch Video, and Project Lightbox
  // --------------------------------------------------------------------------
  const quoteModal = document.getElementById('quoteModal');
  const videoModal = document.getElementById('videoModal');
  const lightboxModal = document.getElementById('lightboxModal');

  // Open Quote Modal
  document.querySelectorAll('.open-quote-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (quoteModal) quoteModal.classList.add('active');
    });
  });

  // Open Video Modal
  document.querySelectorAll('.open-video-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (videoModal) videoModal.classList.add('active');
    });
  });

  // Close modals
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(closer => {
    closer.addEventListener('click', (e) => {
      if (e.target === closer || closer.classList.contains('modal-close-btn')) {
        document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
        // Stop video if closing
        const iframe = document.querySelector('#videoPlayer');
        if (iframe) {
          const src = iframe.src;
          iframe.src = src;
        }
      }
    });
  });

  // Prevent click on modal-box from closing overlay
  document.querySelectorAll('.modal-box').forEach(box => {
    box.addEventListener('click', (e) => e.stopPropagation());
  });

  // --------------------------------------------------------------------------
  // 7. Interactive Instant Cost Estimator
  // --------------------------------------------------------------------------
  const calcService = document.getElementById('calcService');
  const calcArea = document.getElementById('calcArea');
  const calcResult = document.getElementById('calcResult');

  function calculateEstimate() {
    if (!calcService || !calcArea || !calcResult) return;
    const ratePerSqFt = parseFloat(calcService.value) || 75;
    const area = parseFloat(calcArea.value) || 0;
    if (area > 0) {
      const estimatedCost = Math.round(area * ratePerSqFt);
      calcResult.innerHTML = `Estimated Range: <strong>₹${(estimatedCost * 0.95).toLocaleString()} - ₹${(estimatedCost * 1.1).toLocaleString()}</strong> <br><small style="color:#718096; font-size:0.75rem;">*Includes installation, premium adhesive, and laser leveling</small>`;
    } else {
      calcResult.innerHTML = 'Enter area in sq ft for an instant estimate';
    }
  }

  if (calcService && calcArea) {
    calcService.addEventListener('change', calculateEstimate);
    calcArea.addEventListener('input', calculateEstimate);
  }

  // Quote Form Submission simulation
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Submitting Request...';
      submitBtn.disabled = true;

      setTimeout(() => {
        quoteForm.innerHTML = `
          <div style="text-align: center; padding: 25px 10px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #E6FBF2; color: #10B981; font-size: 26px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">✓</div>
            <h3 style="color: #12161A; font-size: 1.3rem; margin-bottom: 8px;">Quote Request Received!</h3>
            <p style="color: #5B626C; font-size: 0.9rem; line-height: 1.5;">Our master technician will contact you within 2 hours with a detailed breakdown and schedule a free site measurement.</p>
            <button onclick="document.getElementById('quoteModal').classList.remove('active')" class="btn btn-primary" style="margin-top: 18px;">Close Window</button>
          </div>
        `;
      }, 1000);
    });
  }

  // --------------------------------------------------------------------------
  // 8. Project Lightbox Image Viewer
  // --------------------------------------------------------------------------
  const projectCards = document.querySelectorAll('.project-card');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.project-img');
      const title = card.querySelector('.project-info-title');
      if (lightboxModal && lightboxImg && img) {
        lightboxImg.src = img.src;
        if (lightboxTitle && title) lightboxTitle.innerHTML = title.innerHTML;
        lightboxModal.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. Button Click Ripple Effect
  // --------------------------------------------------------------------------
  document.querySelectorAll('.btn-primary, .btn-dark, .btn-cta-contact').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;

      const rect = this.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const ripple = this.querySelector('.ripple');
      if (ripple) ripple.remove();

      this.appendChild(circle);
    });
  });

  // ESC key to close any modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
    }
  });
});
