(function () {
  function slugify(str) {
    return str.toLowerCase().trim()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function switchTab(target) {
    document.querySelectorAll('[data-auth-tab]').forEach((tab) => tab.classList.remove('is-active'));
    document.querySelectorAll('[data-auth-panel]').forEach((panel) => panel.classList.remove('is-active'));
    const tab = document.querySelector(`[data-auth-tab="${target}"]`);
    const panel = document.querySelector(`[data-auth-panel="${target}"]`);
    if (tab && panel) {
      tab.classList.add('is-active');
      panel.classList.add('is-active');
    }
  }

  function validatePasswords(password, confirmation) {
    if (password !== confirmation) {
      throw new Error('Les mots de passe ne correspondent pas.');
    }
    if (password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
    }
  }

  function handleUserRegistration(form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      if (!form.terms.checked) {
        alert('Veuillez accepter les conditions d\'utilisation.');
        return;
      }
      try {
        validatePasswords(payload.password, payload.password_confirm);
        await window.databaseReady;
        window.AsyzysDB.createUser({
          full_name: payload.full_name,
          phone: payload.phone,
          email: payload.email,
          password: payload.password
        });
        form.reset();
        alert('Bienvenue sur Asyzys ! Votre compte utilisateur est enregistré.');
      } catch (error) {
        alert(error.message || 'Impossible de créer votre compte pour le moment.');
      }
    });
  }

  function handleDeveloperRegistration(form) {
    const categoryList = form.querySelector('[data-category-checkboxes]');
    const addSketchButton = form.querySelector('[data-add-sketch]');
    const sketchesContainer = form.querySelector('[data-sketches]');

    function ensureCategoryLimit() {
      const checked = categoryList.querySelectorAll('input[type="checkbox"]:checked');
      if (checked.length >= 3) {
        categoryList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
          if (!input.checked) {
            input.disabled = true;
          }
        });
      } else {
        categoryList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
          input.disabled = false;
        });
      }
    }

    categoryList.addEventListener('change', ensureCategoryLimit);

    addSketchButton.addEventListener('click', (event) => {
      event.preventDefault();
      const index = sketchesContainer.querySelectorAll('.form-group').length;
      const group = document.createElement('div');
      group.className = 'form-group';
      group.innerHTML = `
        <label for="sketch_${index}">URL du croquis UI ${index + 1}</label>
        <input id="sketch_${index}" name="sketch_${index}" type="url" placeholder="https://" required>
      `;
      sketchesContainer.appendChild(group);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      if (!form.terms.checked) {
        alert('Merci d\'accepter les conditions d\'utilisation avant de continuer.');
        return;
      }
      try {
        validatePasswords(payload.password, payload.password_confirm);
        const selectedCategories = Array.from(categoryList.querySelectorAll('input[type="checkbox"]:checked')).map((input) => parseInt(input.value, 10));
        if (!selectedCategories.length) {
          throw new Error('Choisissez au moins une catégorie.');
        }
        const sketchInputs = sketchesContainer.querySelectorAll('input[type="url"]');
        if (!sketchInputs.length) {
          throw new Error('Ajoutez au moins un croquis UI.');
        }
        const sketches = Array.from(sketchInputs).map((input) => ({
          url: input.value,
          caption: `Croquis ${input.value.split('/').pop()}`
        }));
        await window.databaseReady;
        const developer = {
          full_name: payload.full_name,
          phone: payload.phone,
          country_id: parseInt(payload.country_id, 10),
          portfolio_url: payload.portfolio_url,
          github_url: payload.github_url,
          bio: payload.bio,
          avatar_url: payload.avatar_url || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
          slug: slugify(payload.full_name)
        };
        const application = {
          title: payload.app_title,
          slug: slugify(`${payload.app_title}-${Date.now()}`),
          tagline: payload.app_tagline,
          description: payload.app_description,
          version: payload.app_version,
          published_at: payload.app_published_at,
          updated_at: payload.app_updated_at,
          hero_image: payload.app_hero_image,
          is_paid: payload.app_pricing !== 'free' ? 1 : 0,
          price: payload.app_pricing !== 'free' ? parseFloat(payload.app_price || '0') : 0,
          demo_url: payload.app_demo_url,
          categories: selectedCategories,
          assets: sketches
        };
        window.AsyzysDB.createDeveloper(developer, application);
        form.reset();
        alert('Votre studio Asyzys est prêt ! Application publiée et profil créé.');
      } catch (error) {
        alert(error.message || 'Impossible de valider vos informations.');
      }
    });
  }

  function populateSelects(form, categories) {
    const countries = [
      { id: 1, name: 'Cameroun' },
      { id: 2, name: 'France' },
      { id: 3, name: 'Canada' },
      { id: 4, name: 'États-Unis' },
      { id: 5, name: 'Sénégal' },
      { id: 6, name: 'Maroc' }
    ];
    const select = form.querySelector('[name="country_id"]');
    select.innerHTML = countries.map((country) => `<option value="${country.id}">${country.name}</option>`).join('');
    const categoryWrapper = form.querySelector('[data-category-checkboxes]');
    categoryWrapper.innerHTML = categories.map((cat) => `
      <label class="checkbox">
        <input type="checkbox" name="category_${cat.id}" value="${cat.id}">
        <span><i class="${cat.icon}"></i> ${cat.name}</span>
      </label>
    `).join('');
  }

  function initTabs() {
    document.querySelectorAll('[data-auth-tab]').forEach((tab) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        switchTab(tab.dataset.authTab);
      });
    });
  }

  function initAuthPage() {
    const run = async () => {
      await window.databaseReady;
      const categories = window.AsyzysDB.getCategories();
      const userForm = document.querySelector('[data-user-form]');
      const developerForm = document.querySelector('[data-developer-form]');
      populateSelects(developerForm, categories);
      handleUserRegistration(userForm);
      handleDeveloperRegistration(developerForm);
      initTabs();
      switchTab('login');
    };
    run();
  }

  document.addEventListener('asyzys:db-ready', initAuthPage, { once: true });
})();
