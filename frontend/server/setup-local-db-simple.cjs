const Database = require('better-sqlite3');
const { randomUUID } = require('crypto');

console.log('🔄 Iniciando setup da base de dados SQLite...');

// Criar/conectar à base de dados
const db = new Database('./local-dev.db');

// Criar tabelas básicas
db.exec(`
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
`);

// Limpar dados existentes
db.prepare('DELETE FROM teams').run();

// Inserir equipas
const team1Id = randomUUID();
const team2Id = randomUUID();

db.prepare(`
  INSERT INTO teams (id, name, tag, description, country, city)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(team1Id, 'Lusitano Gaming', 'LUS', 'Equipa portuguesa de CS2 de elite', 'pt', 'Lisboa');

db.prepare(`
  INSERT INTO teams (id, name, tag, description, country, city)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(team2Id, 'Iberian Force', 'IBF', 'Força ibérica unida no CS2', 'es', 'Madrid');

// Verificar dados
const teams = db.prepare('SELECT * FROM teams').all();
console.log('\n🏆 Equipas na base de dados:');
teams.forEach(team => {
  console.log(`   - ${team.name} (${team.tag}) - ${team.country.toUpperCase()}`);
});

console.log(`\n✅ Total de equipas: ${teams.length}`);

db.close();
console.log('🔒 Base de dados fechada.'); 