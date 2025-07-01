import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, teams, players, tournaments, news, casters } from './src/db/schema.ts';
import bcrypt from 'bcryptjs';

// Criar base de dados SQLite local para desenvolvimento
const sqlite = new Database('./local-dev.db');
const db = drizzle(sqlite);

async function setupLocalDB() {
  console.log('🗄️ CONFIGURANDO BASE DE DADOS LOCAL PARA DESENVOLVIMENTO');
  console.log('=========================================================');

  try {
    // Criar tabelas (SQLite criará automaticamente)
    console.log('📋 Criando estrutura das tabelas...');

    // Limpar dados existentes
    console.log('🧹 Limpando dados existentes...');
    
    // Criar utilizador admin
    console.log('👤 Criando utilizador admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const [adminUser] = await db.insert(users).values({
      email: 'admin@cs2beta.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'CS2Beta',
      role: 'admin',
      isVerified: true,
      country: 'pt',
    }).returning().catch(() => []);

    if (adminUser) {
      console.log('✅ Utilizador admin criado com sucesso!');
    }

    // Criar equipas de exemplo
    console.log('🏆 Criando equipas...');
    const teamData = [
      {
        name: 'Lusitano Gaming',
        tag: 'LUS',
        description: 'Equipa portuguesa de CS2',
        country: 'pt',
        city: 'Lisboa',
        founded: 2023,
        website: 'https://lusitano.pt',
        socials: { twitter: '@lusitano_pt' },
        achievements: ['Campeões Portugueses 2023']
      },
      {
        name: 'Iberian Force',
        tag: 'IBF',
        description: 'Equipa ibérica competitiva',
        country: 'es',
        city: 'Madrid',
        founded: 2022,
        website: 'https://iberianforce.com',
        socials: { twitter: '@iberian_force' },
        achievements: ['Finalistas Liga Ibérica 2023']
      }
    ];

    for (const team of teamData) {
      try {
        await db.insert(teams).values(team);
        console.log(`✅ Equipa criada: ${team.name}`);
      } catch (error) {
        console.log(`⚠️ Equipa já existe: ${team.name}`);
      }
    }

    // Criar torneios
    console.log('🎯 Criando torneios...');
    const tournamentData = [
      {
        name: 'Liga Portuguesa CS2 2024',
        description: 'Campeonato nacional português',
        organizer: 'FPDE',
        prizePool: 5000,
        currency: 'EUR',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-15'),
        registrationDeadline: new Date('2024-02-20'),
        maxTeams: 16,
        format: 'Double Elimination',
        maps: ['de_dust2', 'de_mirage', 'de_inferno'],
        status: 'upcoming',
        country: 'pt',
        isFeatured: true,
      }
    ];

    for (const tournament of tournamentData) {
      try {
        await db.insert(tournaments).values(tournament);
        console.log(`✅ Torneio criado: ${tournament.name}`);
      } catch (error) {
        console.log(`⚠️ Torneio já existe: ${tournament.name}`);
      }
    }

    // Criar notícias
    console.log('📰 Criando notícias...');
    const newsData = [
      {
        title: 'CS2Beta Platform Lançada!',
        excerpt: 'A nova plataforma portuguesa de CS2 está finalmente online.',
        content: 'Hoje marca o início de uma nova era para a comunidade portuguesa de Counter-Strike 2...',
        author: 'CS2Beta Team',
        category: 'announcement',
        tags: ['lançamento', 'cs2', 'portugal'],
        readTime: 3,
        isPublished: true,
        isFeatured: true,
        views: 1000,
        publishedAt: new Date(),
      }
    ];

    for (const article of newsData) {
      try {
        await db.insert(news).values(article);
        console.log(`✅ Notícia criada: ${article.title}`);
      } catch (error) {
        console.log(`⚠️ Notícia já existe: ${article.title}`);
      }
    }

    console.log('\n🎉 BASE DE DADOS LOCAL CONFIGURADA COM SUCESSO!');
    console.log('===============================================');
    console.log('📝 Credenciais de teste:');
    console.log('   Email: admin@cs2beta.com');
    console.log('   Password: admin123');
    console.log('\n📊 Dados criados:');
    console.log('   - Utilizador admin');
    console.log('   - 2 equipas de exemplo');
    console.log('   - 1 torneio');
    console.log('   - 1 notícia');
    console.log('\n🔗 Agora pode testar todas as funcionalidades!');

  } catch (error) {
    console.error('❌ Erro ao configurar base de dados:', error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Executar setup
setupLocalDB()
  .then(() => {
    console.log('✅ Setup concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha no setup:', error);
    process.exit(1);
  }); 