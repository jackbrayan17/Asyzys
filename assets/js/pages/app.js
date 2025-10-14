(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  function renderApp(app) {
    if (!app) {
      document.querySelector('[data-app-detail]').innerHTML = '<p class="empty-state">Application introuvable.</p>';
      return;
    }
    document.title = `${app.title} · Asyzys`;
    const detail = document.querySelector('[data-app-detail]');
    const priceLabel = app.is_paid ? `${app.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}` : 'Gratuit';
    detail.innerHTML = `
      <section class="app-hero">
        <div class="app-hero__visual" data-animate>
          <img src="${app.hero_image}" alt="${app.title} hero">
          <button class="btn btn--icon btn--floating" data-copy-link data-link="https://asyzys.com/app/${app.slug}">
            <i class="fa-solid fa-copy"></i>
          </button>
        </div>
        <div class="app-hero__content" data-animate style="--delay:0.1s">
          <span class="app-hero__badge">${priceLabel}</span>
          <h1>${app.title}</h1>
          <p class="app-hero__tagline">${app.tagline}</p>
          <div class="app-hero__meta">
            <span><i class="fa-solid fa-star"></i> ${app.average_rating.toFixed(1)} (${app.vote_count} votes)</span>
            <span><i class="fa-solid fa-download"></i> ${app.download_count.toLocaleString('fr-FR')} téléchargements</span>
            <span><i class="fa-solid fa-calendar-day"></i> Publiée le ${new Date(app.published_at).toLocaleDateString('fr-FR')}</span>
            <span><i class="fa-solid fa-arrows-rotate"></i> Mise à jour le ${new Date(app.updated_at).toLocaleDateString('fr-FR')}</span>
            <span><i class="fa-solid fa-code"></i> <a href="developer.html?slug=${app.developer_slug}">${app.developer_name}</a></span>
          </div>
          <div class="app-hero__actions">
            <a class="btn btn--primary" href="${app.demo_url}" target="_blank" rel="noopener">
              <i class="fa-solid fa-download"></i> Télécharger / Demo
            </a>
            <button class="btn btn--ghost" data-share data-title="${app.title}" data-link="https://asyzys.com/app/${app.slug}" data-text="Tu dois tester ${app.title} sur Asyzys !">
              <i class="fa-solid fa-share-nodes"></i> Partager
            </button>
            <button class="btn btn--pulse" data-like-button data-id="${app.id}">
              <i class="fa-solid fa-heart"></i> <span data-like-count>${app.like_count}</span>
            </button>
          </div>
          <div class="app-hero__categories">
            ${app.categories.map((cat) => `<span class="chip"><i class="${cat.icon}"></i> ${cat.name}</span>`).join('')}
          </div>
        </div>
      </section>
      <section class="app-description" data-animate>
        <h2>Pourquoi les utilisateurs adorent ${app.title}</h2>
        <p>${app.description}</p>
        <div class="cta-banner">
          <div>
            <h3>Simulation de paiement</h3>
            <p>Choisissez votre offre et visualisez instantanément les bénéfices et bonus.</p>
          </div>
          <button class="btn btn--secondary" data-simulate-payment>
            <i class="fa-solid fa-credit-card"></i> Simuler un achat
          </button>
        </div>
      </section>
      <section class="app-gallery" data-animate>
        <h2>Sketches & prototypes UI</h2>
        <div class="gallery-grid">
          ${app.assets.map((asset, index) => `
            <figure class="gallery-item" style="--delay:${index * 0.05}s">
              <img src="${asset.asset_url}" alt="Croquis ${app.title}">
              <figcaption>${asset.caption}</figcaption>
            </figure>
          `).join('')}
        </div>
      </section>
      <section class="app-reviews" data-animate>
        <div class="reviews-header">
          <h2>Notes & avis (${app.vote_count})</h2>
          <div class="rating-display">
            <span class="rating-display__value">${app.average_rating.toFixed(1)}</span>
            <span class="rating-display__stars" data-star-rating data-value="${app.average_rating}"></span>
          </div>
        </div>
        <div class="reviews-grid">
          <div class="reviews-list">
            ${app.reviews.map((review) => `
              <article class="review-card">
                <header>
                  <h3>${review.reviewer_name}</h3>
                  <span>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                </header>
                <p>${review.comment}</p>
                <time datetime="${review.created_at}">${new Date(review.created_at).toLocaleDateString('fr-FR')}</time>
              </article>
            `).join('')}
          </div>
          <div class="review-form">
            <h3>Laissez un avis</h3>
            <form data-review-form>
              <input type="hidden" name="application_id" value="${app.id}">
              <div class="form-group">
                <label for="reviewer_name">Nom complet</label>
                <input id="reviewer_name" name="reviewer_name" required>
              </div>
              <div class="form-group">
                <label for="reviewer_email">Email</label>
                <input id="reviewer_email" name="reviewer_email" type="email" required>
              </div>
              <div class="form-group">
                <label for="rating">Note</label>
                <select id="rating" name="rating" required>
                  <option value="">Choisir</option>
                  <option value="5">5 - Exceptionnel</option>
                  <option value="4">4 - Excellent</option>
                  <option value="3">3 - Bien</option>
                  <option value="2">2 - Moyen</option>
                  <option value="1">1 - À améliorer</option>
                </select>
              </div>
              <div class="form-group">
                <label for="comment">Commentaire</label>
                <textarea id="comment" name="comment" rows="4" required></textarea>
              </div>
              <button class="btn btn--primary" type="submit">Publier mon avis</button>
            </form>
          </div>
        </div>
      </section>
      <section class="app-faq" data-animate>
        <h2>FAQ</h2>
        <details open>
          <summary>Comment fonctionne la simulation de paiement ?</summary>
          <p>Nous vous proposons un scénario interactif pour estimer le coût final, les réductions éventuelles et les bonus débloqués. Aucune carte n'est débitée.</p>
        </details>
        <details>
          <summary>Puis-je utiliser ${app.title} hors ligne ?</summary>
          <p>Oui, une fois les modules essentiels téléchargés, l'application fonctionne en mode hors ligne avec synchronisation automatique.</p>
        </details>
        <details>
          <summary>Comment signaler un bug ?</summary>
          <p>Rendez-vous sur la page du développeur et utilisez le CTA "Contacter" pour remonter vos suggestions.</p>
        </details>
      </section>
    `;
    initStars();
  }

  function initStars() {
    document.querySelectorAll('[data-star-rating]').forEach((holder) => {
      const value = parseFloat(holder.dataset.value || '0');
      const fullStars = Math.round(value * 2) / 2;
      holder.innerHTML = '';
      for (let i = 1; i <= 5; i += 1) {
        const icon = document.createElement('i');
        if (i <= Math.floor(fullStars)) {
          icon.className = 'fa-solid fa-star';
        } else if (i - 0.5 === fullStars) {
          icon.className = 'fa-solid fa-star-half-stroke';
        } else {
          icon.className = 'fa-regular fa-star';
        }
        holder.appendChild(icon);
      }
    });
  }

  function initReviewForm() {
    const form = document.querySelector('[data-review-form]');
    if (!form) return;
    const session = window.AsyzysSession ? window.AsyzysSession.get() : null;
    if (session && session.type === 'user') {
      if (form.reviewer_name) form.reviewer_name.value = session.full_name;
      if (form.reviewer_email) form.reviewer_email.value = session.email;
    }
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      payload.rating = parseInt(payload.rating, 10);
      if (!payload.rating) {
        alert('Merci de sélectionner une note.');
        return;
      }
      await window.databaseReady;
      const stats = window.AsyzysDB.addReview(parseInt(payload.application_id, 10), payload.reviewer_name, payload.reviewer_email, payload.rating, payload.comment);
      alert('Merci pour votre avis !');
      window.location.reload();
    });
  }

  function initLikeButton() {
    const button = document.querySelector('[data-like-button]');
    if (!button) return;
    const session = window.AsyzysSession ? window.AsyzysSession.get() : null;
    const identifier = (() => {
      if (session) {
        return session.email || `${session.type}-${session.id}`;
      }
      const stored = localStorage.getItem('asyzys-user-id');
      if (stored) return stored;
      const cryptoApi = window.crypto || window.msCrypto;
      const uuid = (cryptoApi && typeof cryptoApi.randomUUID === 'function')
        ? cryptoApi.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const id = `visitor-${uuid}`;
      localStorage.setItem('asyzys-user-id', id);
      return id;
    })();
    button.addEventListener('click', async () => {
      await window.databaseReady;
      const total = window.AsyzysDB.likeApplication(parseInt(button.dataset.id, 10), identifier);
      const counter = button.querySelector('[data-like-count]');
      if (counter) {
        counter.textContent = total;
        button.classList.add('liked');
      }
    });
  }

  function initPaymentSimulation(app) {
    const trigger = document.querySelector('[data-simulate-payment]');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const price = app.is_paid ? app.price : 0;
      const tiers = [
        { label: 'Starter', multiplier: 1, bonus: 'Coaching vocal offert' },
        { label: 'Pro', multiplier: 2.2, bonus: 'UI kit exclusif + masterclass' },
        { label: 'Studio', multiplier: 4.5, bonus: 'Accès premium + consulting personnalisé' }
      ];
      const lines = tiers.map((tier) => {
        const total = (price * tier.multiplier).toFixed(2);
        return `• ${tier.label} : ${app.is_paid ? total + ' €' : 'Toujours gratuit'} (${tier.bonus})`;
      }).join('\n');
      alert(`Simulation pour ${app.title}\n${lines}`);
    });
  }

  function initAppPage() {
    if (!slug) {
      renderApp(null);
      return;
    }
    const run = async () => {
      await window.databaseReady;
      const app = window.AsyzysDB.getAppBySlug(slug);
      renderApp(app);
      initReviewForm();
      initLikeButton();
      if (app) {
        initPaymentSimulation(app);
      }
    };
    run();
  }

  document.addEventListener('asyzys:db-ready', initAppPage, { once: true });
})();
