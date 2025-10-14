(function () {
  const SELECTORS = {
    mobileToggle: '[data-mobile-toggle]',
    nav: '[data-navigation]',
    copyButton: '[data-copy-link]',
    shareButton: '[data-share]' 
  };

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function toggleNav() {
    const nav = document.querySelector(SELECTORS.nav);
    if (nav) {
      nav.classList.toggle('is-open');
    }
  }

  function closeNav() {
    const nav = document.querySelector(SELECTORS.nav);
    if (nav) {
      nav.classList.remove('is-open');
    }
  }

  function handleScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  function initNavigation() {
    const toggles = document.querySelectorAll(SELECTORS.mobileToggle);
    toggles.forEach((btn) => {
      btn.addEventListener('click', toggleNav);
    });
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', closeNav);
    });
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (error) {
      console.error('Clipboard error', error);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }

  function initCopyButtons() {
    document.querySelectorAll(SELECTORS.copyButton).forEach((button) => {
      button.addEventListener('click', async () => {
        const link = button.getAttribute('data-link') || window.location.href;
        const success = await copyToClipboard(link);
        const icon = button.querySelector('i');
        if (success) {
          button.classList.add('copied');
          if (icon) {
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
          }
          setTimeout(() => {
            button.classList.remove('copied');
            if (icon) {
              icon.classList.add('fa-copy');
              icon.classList.remove('fa-check');
            }
          }, 2400);
        }
      });
    });
  }

  function initShareButtons() {
    document.querySelectorAll(SELECTORS.shareButton).forEach((button) => {
      button.addEventListener('click', async () => {
        const data = {
          title: button.dataset.title || document.title,
          text: button.dataset.text || 'Découvrez une pépite sur Asyzys',
          url: button.dataset.link || window.location.href
        };
        if (navigator.share) {
          try {
            await navigator.share(data);
            button.classList.add('shared');
            setTimeout(() => button.classList.remove('shared'), 2000);
          } catch (error) {
            console.warn('Share cancelled', error);
          }
        } else {
          await copyToClipboard(data.url);
          button.classList.add('shared');
          setTimeout(() => button.classList.remove('shared'), 2000);
        }
      });
    });
  }

  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.2
    });

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
  }

  function updateYear() {
    const yearHolder = document.querySelector('[data-current-year]');
    if (yearHolder) {
      yearHolder.textContent = new Date().getFullYear();
    }
  }

  function initNavHighlighting() {
    const path = window.location.pathname;
    document.querySelectorAll('[data-navigation] a').forEach((link) => {
      if (link.pathname === path) {
        link.classList.add('is-active');
      }
    });
  }

  ready(() => {
    initNavigation();
    initCopyButtons();
    initShareButtons();
    initScrollReveal();
    updateYear();
    initNavHighlighting();
  });
})();
