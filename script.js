// script.js
document.addEventListener('DOMContentLoaded', () => {

  // Cache DOM nodes
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  const yearEl = document.getElementById('year');
  const projectButtons = document.querySelectorAll('[data-project]');
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.querySelector('.modal-close');
  const backToTop = document.getElementById('back-to-top');
  const typedTarget = document.getElementById('typed-target');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // Feature 1: Year update in footer
  yearEl.textContent = new Date().getFullYear();

  // Feature 2: Mobile nav toggle (accessible)
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('open');
    // set state on nav for mobile CSS
    if (!expanded) {
      nav.setAttribute('aria-expanded', 'true');
    } else {
      nav.removeAttribute('aria-expanded');
    }
  });

  // Feature 3: Smooth internal scrolling (for anchor links)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav on link click
        if (window.innerWidth < 680 && nav.getAttribute('aria-expanded')) {
          nav.removeAttribute('aria-expanded');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Feature 4: Back-to-top visibility & click
  const obsOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const hero = document.getElementById('home');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        backToTop.classList.remove('hidden');
      } else {
        backToTop.classList.add('hidden');
      }
    });
  }, obsOptions);
  if (hero) obs.observe(hero);

  if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


  // Feature 5: Simple typed effect for the hero heading
  (function typingEffect() {
    const text = "Hi, I'm Nafisah Amani.";
    let i = 0;
    typedTarget.textContent = '';
    const speed = 50;
    function type() {
      if (i < text.length) {
        typedTarget.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  })();

  // Feature 6: Project modal popup (shows project details)
  function openModal(projectId) {
    const data = {
      1: {
        title: 'Project One — PAINT PROGRAM',
        content: `<p><strong>Overview:</strong>Using a C++ language in creating a simple paint program with different sizes, shapes, and colors.</p>
                `
      },
      2: {
        title: 'Project Two — ART APP',
        content: `<p><strong>Overview:</strong> End-to-end UI/UX design for a mobile app, with user flows, wireframes and prototype for Kuching Utara Transportation System using Figma.</p>`
      },
      3: {
        title: 'Project Three — CAR RENTAL Database',
        content: `<p><strong>Overview:</strong> Design and implementation of normalized database schema, queries using XAMPP and MySQL in developing a car rental website.</p>`
      }
    };
    const p = data[projectId];
    if (!p) return;

    modalBody.innerHTML = `<h3>${p.title}</h3>${p.content}`;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';

    // focus trap simple: focus close button
    modalClose.focus();
  }

  projectButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-project')));
  });

  // Close modal handlers
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  }

  // Feature 7: Intersection observer animations for project cards (fade-in)
  const cards = document.querySelectorAll('.project-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.style.transform = 'translateY(18px)';
    card.style.opacity = '0';
    card.style.transition = 'all 450ms ease';
    cardObserver.observe(card);
  });

  // Extra: keyboard accessibility for opening project via Enter when focused
  cards.forEach((card, idx) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const btn = card.querySelector('[data-project]');
        if (btn) btn.click();
      }
    });
  });

  // Feature 8: Contact form front-end validation + fake submit
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    // simple validation
    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill all fields.';
      formStatus.style.color = 'crimson';
      return;
    }
    if (!validateEmail(email)) {
      formStatus.textContent = 'Please enter a valid email.';
      formStatus.style.color = 'crimson';
      return;
    }

    // fake submit - demonstrates UX
    formStatus.textContent = 'Sending...';
    formStatus.style.color = 'black';
    setTimeout(() => {
      formStatus.textContent = 'Thank you! The form is front-end only — please email directly at fromnafisah@gmail.com';
      formStatus.style.color = 'green';
      contactForm.reset();
    }, 900);
  });

  function validateEmail(email) {
    // Basic email pattern (sufficient for demo)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  projectButtons.forEach(btn => {
  btn.addEventListener('click', () =>
    openModal(btn.getAttribute('data-project'))
  );
});


  // Remove focus outline for mouse users but keep for keyboard
  (function focusStyleToggle() {
    function handleFirstTab(e) {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('show-focus');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }
    window.addEventListener('keydown', handleFirstTab);
  })();
});
