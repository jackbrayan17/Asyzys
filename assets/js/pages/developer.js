(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  function renderDeveloper(dev) {
    const container = document.querySelector('[data-developer-profile]');
    if (!container) return;
    if (!dev) {
      container.innerHTML = '<p class="empty-state">Développeur introuvable.</p>';
      return;
    }
    document.title = `${dev.full_name} · Asyzys`;
    const session = window.AsyzysSession ? window.AsyzysSession.get() : null;
    const manageMarkup = (session && session.type === 'developer' && session.slug === dev.slug)
      ? `
        <div class="profile-manage">
          <p>Publiez vos nouveautés en direct sur le catalogue.</p>
          <a class="btn btn--secondary" href="apps.html#publier"><i class="fa-solid fa-plus"></i> Ajouter une application</a>
        </div>
      `
      : '';
    container.innerHTML = `
      <section class="profile-hero" data-animate>
        <div class="profile-hero__avatar">
          <img src="${dev.avatar_url}" alt="${dev.full_name}">
        </div>
        <div class="profile-hero__content">
          <h1>${dev.full_name}</h1>
          <p>${dev.bio || 'Créateur visionnaire sur Asyzys.'}</p>
          <div class="profile-hero__meta">
            <span><i class="fa-solid fa-earth-africa"></i> ${dev.country_name}</span>
            <span><i class="fa-solid fa-phone"></i> ${dev.phone}</span>
            <span><i class="fa-solid fa-users"></i> <span data-follower-count>${dev.followers + dev.subscriber_count}</span> abonnés</span>
          </div>
          <div class="profile-hero__cta">
            <a class="btn btn--primary" href="${dev.portfolio_url}" target="_blank" rel="noopener">
              <i class="fa-solid fa-globe"></i> Portfolio
            </a>
            <a class="btn btn--secondary" href="${dev.github_url}" target="_blank" rel="noopener">
              <i class="fa-brands fa-github"></i> GitHub
            </a>
            <button class="btn btn--ghost" data-share data-title="${dev.full_name}" data-link="https://asyzys.com/developer/${dev.slug}" data-text="Suis ${dev.full_name} sur Asyzys !">
              <i class="fa-solid fa-share-nodes"></i> Partager
            </button>
            <button class="btn btn--icon" data-copy-link data-link="https://asyzys.com/developer/${dev.slug}">
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
          <div class="profile-hero__chips">
            ${dev.categories.map((cat) => `<span class="chip"><i class="${cat.icon}"></i> ${cat.name}</span>`).join('')}
          </div>
          ${manageMarkup}
        </div>
      </section>
      <section class="profile-subscribe" data-animate>
        <h2>Abonnez-vous à ${dev.full_name}</h2>
        <p>Recevez les nouveaux lancements, croquis UI exclusifs et codes promo directement dans votre boîte mail.</p>
        <form data-subscribe-form>
          <input type="hidden" name="developer_id" value="${dev.id}">
          <div class="form-group">
            <label for="subscription_email">Email</label>
            <input id="subscription_email" name="subscription_email" type="email" placeholder="vous@exemple.com" required>
          </div>
          <button class="btn btn--primary" type="submit">Je m'abonne</button>
        </form>
      </section>
      <section class="profile-apps" data-animate>
        <div class="section-heading">
          <h2>Applications de ${dev.full_name}</h2>
          <p>${dev.apps.length} créations disponibles sur Asyzys</p>
        </div>
        <div class="profile-apps__grid">
          ${dev.apps.map((app, index) => `
            <article class="profile-app-card" style="--delay:${index * 0.06}s">
              <div class="profile-app-card__media">
                <img src="${app.hero_image}" alt="${app.title} UI" loading="lazy">
                <span class="profile-app-card__badge">${app.is_paid ? 'Payant' : 'Gratuit'}</span>
              </div>
              <div class="profile-app-card__body">
                <h3><a href="app.html?slug=${app.slug}">${app.title}</a></h3>
                <p>${app.tagline}</p>
                <ul>
                  <li><i class="fa-solid fa-code-branch"></i> Version ${app.version}</li>
                  <li><i class="fa-solid fa-calendar-day"></i> Publiée le ${new Date(app.published_at).toLocaleDateString('fr-FR')}</li>
                  <li><i class="fa-solid fa-arrows-rotate"></i> Mise à jour le ${new Date(app.updated_at).toLocaleDateString('fr-FR')}</li>
                </ul>
              </div>
              <div class="profile-app-card__footer">
                <a class="btn btn--pill" href="app.html?slug=${app.slug}">Découvrir</a>
                <button class="btn btn--icon" data-copy-link data-link="https://asyzys.com/app/${app.slug}">
                  <i class="fa-solid fa-copy"></i>
                </button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  function initSubscribe() {
    const form = document.querySelector('[data-subscribe-form]');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await window.databaseReady;
      const developerId = parseInt(form.querySelector('[name="developer_id"]').value, 10);
      const email = form.subscription_email.value;
      window.AsyzysDB.subscribe(developerId, email);
      const countHolder = document.querySelector('[data-follower-count]');
      if (countHolder) {
        const updated = window.AsyzysDB.getDeveloperBySlug(slug);
        countHolder.textContent = updated.followers + updated.subscriber_count;
      }
      form.reset();
      form.classList.add('is-success');
      const existing = form.querySelector('.form-success');
      if (existing) existing.remove();
      form.insertAdjacentHTML('beforeend', '<p class="form-success">Merci ! Vous êtes maintenant abonné.</p>');
    });
  }

  function initDeveloperPage() {
    if (!slug) {
      renderDeveloper(null);
      return;
    }
    const run = async () => {
      await window.databaseReady;
      const dev = window.AsyzysDB.getDeveloperBySlug(slug);
      renderDeveloper(dev);
      initSubscribe();
    };
    run();
  }

  document.addEventListener('asyzys:db-ready', initDeveloperPage, { once: true });
})();
