(function () {
  let baseApps = [];
  let categoriesCache = [];

  function slugify(str) {
    return str.toLowerCase().trim()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

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

  function enforceCategoryLimit(wrapper) {
    const checked = wrapper.querySelectorAll('input[type="checkbox"]:checked');
    const inputs = wrapper.querySelectorAll('input[type="checkbox"]');
    if (checked.length >= 3) {
      inputs.forEach((input) => {
        if (!input.checked) input.disabled = true;
      });
    } else {
      inputs.forEach((input) => {
        input.disabled = false;
      });
    }
  }

  function populateAddAppCategories(wrapper) {
    if (!wrapper) return;
    wrapper.innerHTML = categoriesCache.map((cat) => `
      <label class="checkbox">
        <input type="checkbox" value="${cat.id}">
        <span><i class="${cat.icon}"></i> ${cat.name}</span>
      </label>
    `).join('');
    enforceCategoryLimit(wrapper);
    if (!wrapper.dataset.bound) {
      wrapper.addEventListener('change', () => enforceCategoryLimit(wrapper));
      wrapper.dataset.bound = 'true';
    }
  }

  function initAddAppAssets(section) {
    const button = section.querySelector('[data-add-app-asset]');
    const container = section.querySelector('[data-add-assets]');
    if (!button || !container || button.dataset.bound) return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const count = container.querySelectorAll('input[type="url"]').length;
      if (count >= 6) {
        alert('Ajoutez jusqu\'à 6 croquis pour garder votre fiche légère.');
        return;
      }
      const group = document.createElement('div');
      group.className = 'form-group';
      group.innerHTML = `
        <label for="add_asset_${count}">URL du croquis ${count + 1}</label>
        <input id="add_asset_${count}" type="url" name="asset_${count}" placeholder="https://" required>
      `;
      container.appendChild(group);
    });
  }

  function resetAddAppForm(section) {
    const form = section.querySelector('[data-add-app-form]');
    form.reset();
    const container = section.querySelector('[data-add-assets]');
    container.innerHTML = `
      <label>Croquis UI & captures</label>
      <p class="muted">Ajoutez au moins un visuel haute résolution présentant vos animations et transitions.</p>
      <div class="form-group">
        <label for="add_asset_0">URL du croquis 1</label>
        <input id="add_asset_0" type="url" name="asset_0" placeholder="https://" required>
      </div>
    `;
    populateAddAppCategories(section.querySelector('[data-add-category-checkboxes]'));
  }

  function initAddAppForm(categories) {
    const section = document.querySelector('[data-add-app-section]');
    if (!section) return;
    categoriesCache = categories;
    const session = window.AsyzysSession ? window.AsyzysSession.get() : null;
    if (!session || session.type !== 'developer') {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    populateAddAppCategories(section.querySelector('[data-add-category-checkboxes]'));
    initAddAppAssets(section);
    const form = section.querySelector('[data-add-app-form]');
    if (form.dataset.initialized) return;
    form.dataset.initialized = 'true';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const pricing = data.get('pricing');
      const selectedCategories = Array.from(section.querySelectorAll('[data-add-category-checkboxes] input:checked'))
        .map((input) => parseInt(input.value, 10));
      if (!selectedCategories.length) {
        alert('Sélectionnez au moins une catégorie.');
        return;
      }
      const assetInputs = section.querySelectorAll('[data-add-assets] input[type="url"]');
      if (!assetInputs.length) {
        alert('Ajoutez au moins un croquis UI.');
        return;
      }
      const assets = Array.from(assetInputs).map((input) => ({
        url: input.value,
        caption: `Croquis ${input.value.split('/').pop() || input.id}`
      }));
      try {
        await window.databaseReady;
        const application = {
          title: data.get('title'),
          slug: slugify(`${data.get('title')}-${Date.now()}`),
          tagline: data.get('tagline'),
          description: data.get('description'),
          version: data.get('version'),
          published_at: data.get('published_at'),
          updated_at: data.get('updated_at'),
          hero_image: data.get('hero_image'),
          is_paid: pricing !== 'free' ? 1 : 0,
          price: pricing !== 'free' ? parseFloat(data.get('price') || '0') : 0,
          demo_url: data.get('demo_url'),
          categories: selectedCategories,
          assets
        };
        const created = window.AsyzysDB.createApplication(session.id, application);
        resetAddAppForm(section);
        alert(`Votre application ${created.title} est maintenant en ligne !`);
        baseApps = window.AsyzysDB.searchApps();
        renderApps(baseApps);
      } catch (error) {
        console.error(error);
        alert('Publication impossible pour le moment. Réessayez dans un instant.');
      }
    });
  }

  function refreshAddAppForm() {
    if (!categoriesCache.length) return;
    initAddAppForm(categoriesCache);
  }

  function initAppsPage() {
    const run = async () => {
      await window.databaseReady;
      const db = window.AsyzysDB;
      const categories = db.getCategories();
      categoriesCache = categories;
      const selectedCategory = getQueryParam('category');
      baseApps = selectedCategory ? db.getAppsByCategory(selectedCategory) : db.searchApps();
      populateFilters(categories);
      renderApps(baseApps);
      initSearch();
      initAddAppForm(categories);
    };
    run();
  }

  document.addEventListener('asyzys:db-ready', initAppsPage, { once: true });
  window.addEventListener('asyzys:session-change', refreshAddAppForm);
})();
