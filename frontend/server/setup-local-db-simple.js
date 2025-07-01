const Database = require('better-sqlite3');
const { randomUUID } = require('crypto');

console.log('🔄 Iniciando setup da base de dados SQLite...');

// Criar/conectar à base de dados
const db = new Database('./local-dev.db');

// Criar tabelas básicas
db.exec(`
  -- Tabela de utilizadores
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    steam_id TEXT,
    discord_id TEXT,
    faceit_username TEXT,
    faceit_elo INTEGER DEFAULT 1000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabela de equipas
  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT UNIQUE NOT NULL,
    tag TEXT UNIQUE NOT NULL,
    description TEXT,
    logo TEXT,
    banner TEXT,
    country TEXT DEFAULT 'pt',
    city TEXT,
    founded DATETIME,
    website TEXT,
    socials TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabela de torneios
  CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'league',
    status TEXT DEFAULT 'upcoming',
    start_date DATETIME,
    end_date DATETIME,
    max_teams INTEGER DEFAULT 16,
    prize_pool INTEGER DEFAULT 0,
    rules TEXT,
    format TEXT DEFAULT 'bo3',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabela de notícias
  CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    slug TEXT UNIQUE NOT NULL,
    featured_image TEXT,
    category TEXT DEFAULT 'news',
    status TEXT DEFAULT 'published',
    author_id TEXT,
    views INTEGER DEFAULT 0,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Inserir dados iniciais
try {
  // Inserir utilizador admin
  const adminId = randomUUID();
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, username, password, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(adminId, 'admin@cs2beta.com', 'admin', '$2b$10$hashexample', 'admin');

  // Inserir equipas
  const team1Id = randomUUID();
  const team2Id = randomUUID();
  
  db.prepare(`
    INSERT OR REPLACE INTO teams (id, name, tag, description, country, city)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(team1Id, 'Lusitano Gaming', 'LUS', 'Equipa portuguesa de CS2 de elite', 'pt', 'Lisboa');

  db.prepare(`
    INSERT OR REPLACE INTO teams (id, name, tag, description, country, city)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(team2Id, 'Iberian Force', 'IBF', 'Força ibérica unida no CS2', 'es', 'Madrid');

  // Inserir torneio
  const tournamentId = randomUUID();
  db.prepare(`
    INSERT OR REPLACE INTO tournaments (id, name, description, type, status, start_date, max_teams, prize_pool)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(tournamentId, 'Liga Portuguesa CS2 2024', 'Campeonato nacional de Counter-Strike 2', 'league', 'active', new Date().toISOString(), 16, 5000);

  // Inserir notícia
  const newsId = randomUUID();
  db.prepare(`
    INSERT OR REPLACE INTO news (id, title, content, excerpt, slug, category, author_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(newsId, 'CS2Beta Platform Lançada', 'A nova plataforma CS2Beta está oficialmente online!', 'Plataforma de esports portuguesa agora disponível', 'cs2beta-platform-lancada', 'news', adminId);

  console.log('✅ Base de dados SQLite criada com sucesso!');
  console.log('📊 Dados inseridos:');
  console.log('   - 1 utilizador admin');
  console.log('   - 2 equipas (Lusitano Gaming, Iberian Force)');
  console.log('   - 1 torneio (Liga Portuguesa CS2 2024)');
  console.log('   - 1 notícia');

  // Verificar dados
  const teams = db.prepare('SELECT * FROM teams').all();
  console.log('\n🏆 Equipas na base de dados:');
  teams.forEach(team => {
    console.log(`   - ${team.name} (${team.tag}) - ${team.country.toUpperCase()}`);
  });

} catch (error) {
  console.error('❌ Erro ao inserir dados:', error);
}

db.close();
console.log('🔒 Base de dados fechada.'); 