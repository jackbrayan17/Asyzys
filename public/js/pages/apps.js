(function () {
  let baseApps = [];

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function renderApps(apps) {
    const list = document.querySelector('[data-app-list]');
    if (!list) return;
    if (!apps.length) {
      list.innerHTML = `<p class="empty-state" data-animate>Aucune application ne correspond pour le moment. Revenez bientôt !</p>`;
      return;
    }
    list.innerHTML = apps.map((app, index) => `
      <article class="app-row" data-animate style="--delay:${index * 0.05}s">
        <img class="app-row__cover" src="${app.hero_image}" alt="${app.title} UI" loading="lazy">
        <div class="app-row__content">
          <div class="app-row__header">
            <h3><a href="app.html?slug=${app.slug}">${app.title}</a></h3>
            <span class="app-row__badge ${app.is_paid ? 'app-row__badge--paid' : 'app-row__badge--free'}">${app.is_paid ? `Payant · ${app.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}` : 'Gratuit'}</span>
          </div>
          <p>${app.description}</p>
          <div class="app-row__meta">
            <span><i class="fa-solid fa-code"></i> <a href="developer.html?slug=${app.developer_slug}">${app.developer_name}</a></span>
            <span><i class="fa-solid fa-download"></i> ${app.download_count.toLocaleString('fr-FR')} téléchargements</span>
            <span><i class="fa-solid fa-star"></i> ${app.average_rating.toFixed(1)} (${app.vote_count})</span>
          </div>
          <div class="app-row__actions">
            <a class="btn btn--primary" href="app.html?slug=${app.slug}">Voir la fiche</a>
            <button class="btn btn--icon" data-copy-link data-link="https://asyzys.com/app/${app.slug}" title="Copier le lien">
              <i class="fa-solid fa-copy"></i>
            </button>
            <button class="btn btn--ghost" data-share data-title="${app.title}" data-link="https://asyzys.com/app/${app.slug}" data-text="Je te recommande ${app.title} sur Asyzys !">
              <i class="fa-solid fa-share-nodes"></i> Partager
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function populateFilters(categories) {
    const select = document.querySelector('[data-category-filter]');
    if (!select) return;
    select.innerHTML = `
      <option value="">Toutes les catégories</option>
      ${categories.map((cat) => `<option value="${cat.slug}">${cat.name}</option>`).join('')}
    `;
    const current = getQueryParam('category');
    if (current) {
      select.value = current;
    }
    select.addEventListener('change', (event) => {
      const value = event.target.value;
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set('category', value);
      } else {
        url.searchParams.delete('category');
      }
      window.history.replaceState({}, '', url.toString());
      baseApps = value ? window.AsyzysDB.getAppsByCategory(value) : window.AsyzysDB.searchApps();
      const input = document.querySelector('[data-search-apps]');
      if (input) {
        input.value = '';
      }
      renderApps(baseApps);
    });
  }

  function initSearch() {
    const input = document.querySelector('[data-search-apps]');
    if (!input) return;
    input.addEventListener('input', (event) => {
      const keyword = event.target.value.trim().toLowerCase();
      const filtered = keyword ? baseApps.filter((app) => `${app.title} ${app.tagline} ${app.description}`.toLowerCase().includes(keyword)) : baseApps;
      renderApps(filtered);
    });
  }

  function initAppsPage() {
    const run = async () => {
      await window.databaseReady;
      const db = window.AsyzysDB;
      const categories = db.getCategories();
      const selectedCategory = getQueryParam('category');
      baseApps = selectedCategory ? db.getAppsByCategory(selectedCategory) : db.searchApps();
      populateFilters(categories);
      renderApps(baseApps);
      initSearch();
    };
    run();
  }

  document.addEventListener('asyzys:db-ready', initAppsPage, { once: true });
})();
