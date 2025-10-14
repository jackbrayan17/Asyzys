(function () {
  const DB_STORAGE_KEY = 'asyzys-db';
  const SEED_SQL = `
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS countries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
  INSERT INTO countries (name) VALUES
    ('Cameroun'), ('France'), ('Canada'), ('États-Unis'), ('Sénégal'), ('Maroc');

  CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    country_id INTEGER NOT NULL,
    portfolio_url TEXT,
    github_url TEXT,
    bio TEXT,
    avatar_url TEXT,
    slug TEXT UNIQUE,
    followers INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT
  );

  INSERT INTO categories (name, slug, icon) VALUES
    ('Éducation', 'education', 'fa-solid fa-graduation-cap'),
    ('Jeux', 'jeux', 'fa-solid fa-gamepad'),
    ('Musique', 'musique', 'fa-solid fa-music'),
    ('Productivité', 'productivite', 'fa-solid fa-chart-line'),
    ('Créativité', 'creativite', 'fa-solid fa-palette'),
    ('Santé & Fitness', 'sante', 'fa-solid fa-heart-pulse');

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    developer_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    tagline TEXT,
    description TEXT,
    version TEXT,
    published_at TEXT,
    updated_at TEXT,
    hero_image TEXT,
    is_paid INTEGER DEFAULT 0,
    price REAL DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    average_rating REAL DEFAULT 0,
    vote_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    demo_url TEXT,
    FOREIGN KEY (developer_id) REFERENCES developers(id)
  );

  CREATE TABLE IF NOT EXISTS application_categories (
    application_id INTEGER,
    category_id INTEGER,
    PRIMARY KEY (application_id, category_id),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS application_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    asset_url TEXT NOT NULL,
    caption TEXT,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    reviewer_name TEXT NOT NULL,
    reviewer_email TEXT,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    user_identifier TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(application_id, user_identifier),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    developer_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(developer_id, user_email),
    FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE
  );

  INSERT INTO developers (full_name, phone, country_id, portfolio_url, github_url, bio, avatar_url, slug, followers) VALUES
    ('Mélissa Owono', '+237650000001', 1, 'https://melissaowono.design', 'https://github.com/melissaowono', 'Designer et développeuse front-end passionnée par les expériences immersives sur mobile.', 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80', 'melissa-owono', 3200),
    ('Idriss Benali', '+212650000002', 6, 'https://idrissbenali.dev', 'https://github.com/idrissbenali', 'Ingénieur full-stack qui crée des outils productifs pour les équipes distribuées.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', 'idriss-benali', 4120),
    ('Claire Dubois', '+33160000003', 2, 'https://clairedubois.app', 'https://github.com/clairedubois', 'Développeuse iOS qui imagine des expériences musicales intuitives.', 'https://images.unsplash.com/photo-1521579971123-1192931a1452?auto=format&fit=crop&w=400&q=80', 'claire-dubois', 2680);

  INSERT INTO applications (developer_id, title, slug, tagline, description, version, published_at, updated_at, hero_image, is_paid, price, download_count, average_rating, vote_count, share_count, demo_url) VALUES
    (1, 'LinguaSpark', 'linguaspark', 'Apprenez et pratiquez avec la communauté Asyzys', 'LinguaSpark combine coaching vocal, challenges culturels et intelligence conversationnelle pour accélérer votre apprentissage des langues africaines.', '2.6.1', '2024-02-12', '2024-09-22', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', 0, 0, 58240, 4.8, 1384, 1260, 'https://www.youtube.com/watch?v=ysz5S6PUM-U'),
    (2, 'FlowCraft', 'flowcraft', 'Gérez vos sprints avec sérénité', 'FlowCraft orchestre vos sprints, OKR et feedbacks dans un hub immersif intégrant IA et automatisations low-code.', '1.9.0', '2023-11-08', '2024-08-29', 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80', 1, 12.99, 41200, 4.6, 942, 880, 'https://www.youtube.com/watch?v=jNQXAC9IVRw'),
    (3, 'Resonance', 'resonance', 'Composez sans limite', 'Resonance est un studio musical tactile qui aide les créateurs à enregistrer, mixer et partager des morceaux en déplacement.', '4.2.3', '2024-03-15', '2024-09-30', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80', 1, 7.49, 95800, 4.9, 2104, 1720, 'https://www.youtube.com/watch?v=ScMzIvxBSi4');

  INSERT INTO application_categories (application_id, category_id) VALUES
    (1, 1), (1, 3), (1, 5),
    (2, 4), (2, 5),
    (3, 3), (3, 5);

  INSERT INTO application_assets (application_id, asset_url, caption) VALUES
    (1, 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80', 'Tableau de bord immersif pour suivre ses progrès linguistiques'),
    (1, 'https://images.unsplash.com/photo-1529336953121-4970a1ffad75?auto=format&fit=crop&w=1000&q=80', 'Écran de discussion avec coach IA multilingue'),
    (1, 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1000&q=80', 'Interface de mission quotidienne avec animations'),
    (2, 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80', 'Kanban cinématique avec transitions fluides'),
    (2, 'https://images.unsplash.com/photo-1523473827534-86c166f0b22e?auto=format&fit=crop&w=1000&q=80', 'Synthèse automatique de vos rituels de sprint'),
    (2, 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1000&q=80', 'Timeline collaborative animée'),
    (3, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=80', 'Console de mixage à gestes'),
    (3, 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1000&q=80', 'Palette de boucles et pads tactiles'),
    (3, 'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=1000&q=80', 'Studio minimaliste pour enregistrer en live');

  INSERT INTO reviews (application_id, reviewer_name, reviewer_email, rating, comment) VALUES
    (1, 'Sophie', 'sophie@asysyz.com', 5, 'Des animations splendides et un coach IA bluffant !'),
    (1, 'Nathan', 'nathan@asysyz.com', 4, 'Interface ultra soignée, quelques lenteurs sur Android Go.'),
    (2, 'Mickael', 'mickael@asysyz.com', 5, 'Les automatisations me font gagner 4h par semaine, bravo !'),
    (3, 'Dora', 'dora@asysyz.com', 5, 'Enfin un studio mobile qui sonne pro, interface délicieuse.'),
    (3, 'Lucas', 'lucas@asysyz.com', 4, 'Il manque juste un export FLAC mais le workflow est magique.');
  `;

  function base64ToUint8Array(base64) {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  function uint8ArrayToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function initialize() {
    if (!window.initSqlJs) {
      throw new Error('sql.js library not loaded');
    }
    const SQL = await window.initSqlJs({
      locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });
    let db;
    const stored = localStorage.getItem(DB_STORAGE_KEY);
    if (stored) {
      try {
        const uints = base64ToUint8Array(stored);
        db = new SQL.Database(uints);
      } catch (error) {
        console.error('Failed to restore database, reseeding…', error);
        db = new SQL.Database();
        db.run(SEED_SQL);
        persist(db);
      }
    } else {
      db = new SQL.Database();
      db.run(SEED_SQL);
      persist(db);
    }
    return { SQL, db };
  }

  function persist(db) {
    const binaryArray = db.export();
    const base64 = uint8ArrayToBase64(binaryArray);
    localStorage.setItem(DB_STORAGE_KEY, base64);
  }

  function mapRows(result) {
    const rows = [];
    if (!result || !result.length) return rows;
    const { columns, values } = result[0];
    values.forEach((row) => {
      const entry = {};
      columns.forEach((col, idx) => {
        entry[col] = row[idx];
      });
      rows.push(entry);
    });
    return rows;
  }

  function query(db, sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      rows.push(row);
    }
    stmt.free();
    return rows;
  }

  function run(db, sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.run(params);
    stmt.free();
    persist(db);
  }

  async function setup() {
    const { SQL, db } = await initialize();
    const api = {
      SQL,
      db,
      persist: () => persist(db),
      query: (sql, params = []) => query(db, sql, params),
      run: (sql, params = []) => run(db, sql, params),
      getCategories() {
        return query(db, `SELECT id, name, slug, icon,
          (SELECT COUNT(*) FROM application_categories ac WHERE ac.category_id = categories.id) AS app_count
          FROM categories ORDER BY name ASC`);
      },
      getHeroApps() {
        return query(db, `SELECT applications.*, developers.full_name AS developer_name, developers.slug AS developer_slug
          FROM applications JOIN developers ON applications.developer_id = developers.id
          ORDER BY download_count DESC LIMIT 3`);
      },
      searchApps(keyword = '') {
        const like = `%${keyword}%`;
        return query(db, `SELECT applications.*, developers.full_name AS developer_name, developers.slug AS developer_slug
          FROM applications JOIN developers ON applications.developer_id = developers.id
          WHERE title LIKE ? OR description LIKE ? OR tagline LIKE ?
          ORDER BY average_rating DESC`, [like, like, like]);
      },
      getAppsByCategory(slug) {
        return query(db, `SELECT applications.*, developers.full_name AS developer_name, developers.slug AS developer_slug
          FROM applications
          JOIN developers ON applications.developer_id = developers.id
          JOIN application_categories ac ON ac.application_id = applications.id
          JOIN categories ON categories.id = ac.category_id
          WHERE categories.slug = ?
          ORDER BY download_count DESC`, [slug]);
      },
      getAppBySlug(slug) {
        const apps = query(db, `SELECT applications.*, developers.full_name AS developer_name,
            developers.slug AS developer_slug, developers.avatar_url AS developer_avatar,
            developers.bio AS developer_bio
          FROM applications JOIN developers ON applications.developer_id = developers.id
          WHERE applications.slug = ?`, [slug]);
        if (!apps.length) return null;
        const app = apps[0];
        app.categories = query(db, `SELECT categories.* FROM categories
          JOIN application_categories ac ON ac.category_id = categories.id
          WHERE ac.application_id = ?`, [app.id]);
        app.assets = query(db, `SELECT * FROM application_assets WHERE application_id = ?`, [app.id]);
        app.reviews = query(db, `SELECT * FROM reviews WHERE application_id = ? ORDER BY created_at DESC`, [app.id]);
        app.like_count = query(db, `SELECT COUNT(*) AS likes FROM likes WHERE application_id = ?`, [app.id])[0].likes;
        return app;
      },
      getDeveloperBySlug(slug) {
        const devs = query(db, `SELECT developers.*, countries.name AS country_name
          FROM developers JOIN countries ON countries.id = developers.country_id
          WHERE developers.slug = ?`, [slug]);
        if (!devs.length) return null;
        const dev = devs[0];
        dev.apps = query(db, `SELECT applications.* FROM applications WHERE developer_id = ? ORDER BY updated_at DESC`, [dev.id]);
        dev.categories = query(db, `SELECT DISTINCT categories.* FROM categories
          JOIN application_categories ac ON ac.category_id = categories.id
          JOIN applications ON applications.id = ac.application_id
          WHERE applications.developer_id = ?`, [dev.id]);
        dev.subscriber_count = query(db, `SELECT COUNT(*) AS total FROM subscriptions WHERE developer_id = ?`, [dev.id])[0].total;
        return dev;
      },
      likeApplication(applicationId, identifier) {
        try {
          run(db, `INSERT OR IGNORE INTO likes (application_id, user_identifier) VALUES (?, ?)`, [applicationId, identifier]);
          const total = query(db, `SELECT COUNT(*) AS likes FROM likes WHERE application_id = ?`, [applicationId])[0].likes;
          return total;
        } catch (error) {
          console.error('likeApplication error', error);
          throw error;
        }
      },
      addReview(applicationId, reviewerName, reviewerEmail, rating, comment) {
        run(db, `INSERT INTO reviews (application_id, reviewer_name, reviewer_email, rating, comment) VALUES (?, ?, ?, ?, ?)`,
          [applicationId, reviewerName, reviewerEmail, rating, comment]);
        const stats = query(db, `SELECT AVG(rating) AS avgRating, COUNT(*) AS totalVotes FROM reviews WHERE application_id = ?`, [applicationId])[0];
        run(db, `UPDATE applications SET average_rating = ?, vote_count = ? WHERE id = ?`, [stats.avgRating, stats.totalVotes, applicationId]);
        return stats;
      },
      createUser(user) {
        run(db, `INSERT INTO users (full_name, phone, email, password) VALUES (?, ?, ?, ?)`,
          [user.full_name, user.phone, user.email, user.password]);
      },
      createDeveloper(developer, application) {
        run(db, `INSERT INTO developers (full_name, phone, country_id, portfolio_url, github_url, bio, avatar_url, slug, followers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
          [developer.full_name, developer.phone, developer.country_id, developer.portfolio_url, developer.github_url, developer.bio, developer.avatar_url, developer.slug]);
        const devRow = query(db, `SELECT id FROM developers WHERE slug = ?`, [developer.slug])[0];
        run(db, `INSERT INTO applications (developer_id, title, slug, tagline, description, version, published_at, updated_at, hero_image, is_paid, price, download_count, average_rating, vote_count, share_count, demo_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, ?)`,
          [devRow.id, application.title, application.slug, application.tagline, application.description, application.version,
            application.published_at, application.updated_at, application.hero_image, application.is_paid, application.price, application.demo_url]);
        const appRow = query(db, `SELECT id FROM applications WHERE slug = ?`, [application.slug])[0];
        application.categories.slice(0, 3).forEach((catId) => {
          run(db, `INSERT INTO application_categories (application_id, category_id) VALUES (?, ?)`, [appRow.id, catId]);
        });
        application.assets.forEach((asset) => {
          run(db, `INSERT INTO application_assets (application_id, asset_url, caption) VALUES (?, ?, ?)`, [appRow.id, asset.url, asset.caption]);
        });
        return { developerId: devRow.id, applicationId: appRow.id };
      },
      subscribe(developerId, email) {
        run(db, `INSERT OR IGNORE INTO subscriptions (developer_id, user_email) VALUES (?, ?)`, [developerId, email]);
        return query(db, `SELECT COUNT(*) AS total FROM subscriptions WHERE developer_id = ?`, [developerId])[0].total;
      }
    };
    window.AsyzysDB = api;
    window.dispatchEvent(new CustomEvent('asyzys:db-ready'));
    return api;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (window.AsyzysDB) {
      return;
    }
    window.databaseReady = setup();
  });
})();
