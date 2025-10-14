(function () {
  function renderHero(apps) {
    const container = document.querySelector('[data-hero-apps]');
    if (!container) return;
    container.innerHTML = apps.map((app, index) => `
      <article class="hero-card" data-animate style="--delay:${index * 0.1}s">
        <div class="hero-card__visual">
          <img src="${app.hero_image}" alt="${app.title} UI" loading="lazy">
          <span class="hero-card__badge">${app.average_rating.toFixed(1)} ★</span>
        </div>
        <div class="hero-card__content">
          <h3>${app.title}</h3>
          <p class="hero-card__tagline">${app.tagline}</p>
          <div class="hero-card__meta">
            <div><i class="fa-solid fa-code"></i> ${app.developer_name}</div>
            <div><i class="fa-solid fa-download"></i> ${app.download_count.toLocaleString('fr-FR')} téléchargements</div>
          </div>
          <div class="hero-card__cta">
            <a class="btn btn--primary" href="app.html?slug=${app.slug}">
              <i class="fa-solid fa-rocket"></i> Explorer l'application
            </a>
            <button class="btn btn--ghost" data-share data-title="${app.title}" data-link="https://asyzys.com/app/${app.slug}" data-text="Découvre ${app.title} sur Asyzys">
              <i class="fa-solid fa-share-nodes"></i> Partager
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderCategories(categories) {
    const list = document.querySelector('[data-category-grid]');
    if (!list) return;
    list.innerHTML = categories.map((cat, index) => `
      <a href="apps.html?category=${cat.slug}" class="category-card" data-animate style="--delay:${index * 0.08}s">
        <span class="category-card__icon"><i class="${cat.icon}"></i></span>
        <span class="category-card__name">${cat.name}</span>
        <span class="category-card__count">${cat.app_count} apps</span>
        <i class="fa-solid fa-arrow-right category-card__arrow"></i>
      </a>
    `).join('');
  }

  function renderDiscover(apps) {
    const container = document.querySelector('[data-discover-list]');
    if (!container) return;
    container.innerHTML = apps.slice(0, 6).map((app, index) => `
      <article class="app-card" data-animate style="--delay:${index * 0.06}s">
        <div class="app-card__media">
          <img src="${app.hero_image}" alt="${app.title}" loading="lazy">
          <span class="app-card__badge">${app.is_paid ? 'Payant' : 'Gratuit'}</span>
        </div>
        <div class="app-card__body">
          <h3>${app.title}</h3>
          <p>${app.tagline}</p>
          <div class="app-card__meta">
            <span><i class="fa-solid fa-star"></i> ${app.average_rating.toFixed(1)}</span>
            <span><i class="fa-solid fa-download"></i> ${app.download_count.toLocaleString('fr-FR')}</span>
          </div>
        </div>
        <div class="app-card__footer">
          <a href="app.html?slug=${app.slug}" class="btn btn--pill">Voir les détails</a>
          <button class="btn btn--icon" data-copy-link data-link="https://asyzys.com/app/${app.slug}">
            <i class="fa-solid fa-copy"></i>
          </button>
        </div>
      </article>
    `).join('');
  }

  function initSearch(apps) {
    const searchInput = document.querySelector('[data-search-apps]');
    if (!searchInput) return;
    searchInput.addEventListener('input', (event) => {
      const keyword = event.target.value.trim().toLowerCase();
      const filtered = keyword ? apps.filter((app) => `${app.title} ${app.tagline} ${app.description}`.toLowerCase().includes(keyword)) : apps;
      renderDiscover(filtered);
    });
  }

  function initLiveCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-counter'), 10);
      let current = 0;
      const increment = Math.ceil(target / 120);
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        counter.textContent = current.toLocaleString('fr-FR');
      }, 24);
    });
  }

  function initHome() {
    const run = async () => {
      await window.databaseReady;
      const db = window.AsyzysDB;
      const categories = db.getCategories();
      const heroApps = db.getHeroApps();
      const apps = db.searchApps();
      renderHero(heroApps);
      renderCategories(categories);
      renderDiscover(apps);
      initSearch(apps);
      initLiveCounters();
    };
    run();
  }

  document.addEventListener('asyzys:db-ready', initHome, { once: true });
})();
