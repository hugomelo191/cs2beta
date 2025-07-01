import { db } from '../db/connection.js';
import { users, teams, players, tournaments, news, casters } from '../db/schema.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(players);
    await db.delete(teams);
    await db.delete(tournaments);
    await db.delete(news);
    await db.delete(casters);
    await db.delete(users);

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [adminUser] = await db.insert(users).values({
      email: 'admin@cs2hub.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isVerified: true,
      country: 'pt',
    } as any).returning();

    // Create teams
    console.log('🏆 Creating teams...');
    const teamsData = [
      {
        name: 'Madrid Kings',
        tag: 'MAD',
        description: 'Equipa espanhola de elite no CS2',
        country: 'es',
        city: 'Madrid',
        founded: 2020,
        website: 'https://madridkings.com',
        socials: {
          twitter: 'https://twitter.com/madridkings',
          instagram: 'https://instagram.com/madridkings',
          discord: 'https://discord.gg/madridkings',
        },
        achievements: [
          'Campeões Liga Ibérica 2023',
          'Top 4 European Championship 2023',
          'Vencedores Madrid Open 2023',
        ],
      },
      {
        name: 'Nova Five',
        tag: 'NOVA',
        description: 'Equipa portuguesa em ascensão',
        country: 'pt',
        city: 'Lisboa',
        founded: 2021,
        website: 'https://novafive.pt',
        socials: {
          twitter: 'https://twitter.com/novafive',
          instagram: 'https://instagram.com/novafive',
          discord: 'https://discord.gg/novafive',
        },
        achievements: [
          'Vencedores Portuguese Championship 2023',
          'Top 8 European Championship 2023',
        ],
      },
      {
        name: 'Iberian Force',
        tag: 'IBF',
        description: 'Equipa ibérica de topo',
        country: 'es',
        city: 'Barcelona',
        founded: 2019,
        website: 'https://iberianforce.com',
        socials: {
          twitter: 'https://twitter.com/iberianforce',
          instagram: 'https://instagram.com/iberianforce',
          discord: 'https://discord.gg/iberianforce',
        },
        achievements: [
          'Campeões Europeus 2022',
          'Vencedores Iberian Cup 2023',
          'Top 2 World Championship 2023',
        ],
      },
      {
        name: 'Academia CS',
        tag: 'ACS',
        description: 'Academia de talentos portuguesa',
        country: 'pt',
        city: 'Porto',
        founded: 2022,
        website: 'https://academiacs.pt',
        socials: {
          twitter: 'https://twitter.com/academiacs',
          instagram: 'https://instagram.com/academiacs',
          discord: 'https://discord.gg/academiacs',
        },
        achievements: [
          'Vencedores Youth Championship 2023',
          'Top 4 Portuguese Championship 2023',
        ],
      },
      {
        name: 'Ronin PT',
        tag: 'RONIN',
        description: 'Equipa portuguesa de veteranos',
        country: 'pt',
        city: 'Coimbra',
        founded: 2018,
        website: 'https://roninpt.com',
        socials: {
          twitter: 'https://twitter.com/roninpt',
          instagram: 'https://instagram.com/roninpt',
          discord: 'https://discord.gg/roninpt',
        },
        achievements: [
          'Campeões Portugueses 2021',
          'Vencedores Iberian Masters 2022',
          'Top 6 European Championship 2022',
        ],
      },
    ];

    const createdTeams = [];
    for (const teamData of teamsData) {
      const [team] = await db.insert(teams).values(teamData).returning();
      createdTeams.push(team);
    }

    // Create players
    console.log('🎮 Creating players...');
    const playersData = [
      // Madrid Kings Players
      {
        nickname: 'ElRey',
        realName: 'Carlos Rodriguez',
        country: 'es',
        city: 'Madrid',
        age: 23,
        position: 'IGL',
        bio: 'Capitão e líder da Madrid Kings, conhecido pela sua liderança e estratégias inovadoras.',
        teamId: createdTeams[0].id,
        stats: {
          kd: 1.15,
          adr: 85.2,
          maps_played: 156,
          wins: 98,
          losses: 58,
          views: 1250,
        },
        socials: {
          twitter: 'https://twitter.com/elrey_cs',
          instagram: 'https://instagram.com/elrey_cs',
          twitch: 'https://twitch.tv/elrey_cs',
        },
      },
      {
        nickname: 'SniperX',
        realName: 'Miguel Fernandez',
        country: 'es',
        city: 'Valência',
        age: 21,
        position: 'AWP',
        bio: 'AWP principal da Madrid Kings, conhecido pelos seus flicks impossíveis.',
        teamId: createdTeams[0].id,
        stats: {
          kd: 1.28,
          adr: 92.1,
          maps_played: 142,
          wins: 89,
          losses: 53,
          views: 2100,
        },
        socials: {
          twitter: 'https://twitter.com/sniperx_cs',
          instagram: 'https://instagram.com/sniperx_cs',
        },
      },
      {
        nickname: 'FragMaster',
        realName: 'Diego Silva',
        country: 'es',
        city: 'Sevilha',
        age: 19,
        position: 'Rifler',
        bio: 'Entry fragger da Madrid Kings, especialista em abrir sites.',
        teamId: createdTeams[0].id,
        stats: {
          kd: 1.12,
          adr: 88.7,
          maps_played: 134,
          wins: 82,
          losses: 52,
          views: 980,
        },
        socials: {
          twitter: 'https://twitter.com/fragmaster_cs',
          instagram: 'https://instagram.com/fragmaster_cs',
        },
      },

      // Nova Five Players
      {
        nickname: 'PortuGOD',
        realName: 'João Santos',
        country: 'pt',
        city: 'Lisboa',
        age: 22,
        position: 'IGL',
        bio: 'Capitão da Nova Five, conhecido pela sua liderança e calls precisas.',
        teamId: createdTeams[1].id,
        stats: {
          kd: 1.08,
          adr: 82.3,
          maps_played: 178,
          wins: 112,
          losses: 66,
          views: 1650,
        },
        socials: {
          twitter: 'https://twitter.com/portugod_cs',
          instagram: 'https://instagram.com/portugod_cs',
        },
      },
      {
        nickname: 'Lisboeta',
        realName: 'Pedro Costa',
        country: 'pt',
        city: 'Lisboa',
        age: 20,
        position: 'AWP',
        bio: 'AWP da Nova Five, especialista em posições agressivas.',
        teamId: createdTeams[1].id,
        stats: {
          kd: 1.22,
          adr: 89.5,
          maps_played: 156,
          wins: 98,
          losses: 58,
          views: 1850,
        },
        socials: {
          twitter: 'https://twitter.com/lisboeta_cs',
          instagram: 'https://instagram.com/lisboeta_cs',
        },
      },
      {
        nickname: 'PortoRush',
        realName: 'André Ferreira',
        country: 'pt',
        city: 'Porto',
        age: 18,
        position: 'Rifler',
        bio: 'Entry fragger da Nova Five, conhecido pelos seus rushes agressivos.',
        teamId: createdTeams[1].id,
        stats: {
          kd: 1.05,
          adr: 85.8,
          maps_played: 145,
          wins: 87,
          losses: 58,
          views: 1200,
        },
        socials: {
          twitter: 'https://twitter.com/portorush_cs',
          instagram: 'https://instagram.com/portorush_cs',
        },
      },

      // Iberian Force Players
      {
        nickname: 'IberianKing',
        realName: 'Alejandro Martinez',
        country: 'es',
        city: 'Barcelona',
        age: 24,
        position: 'IGL',
        bio: 'Capitão da Iberian Force, veterano da cena ibérica.',
        teamId: createdTeams[2].id,
        stats: {
          kd: 1.18,
          adr: 86.4,
          maps_played: 245,
          wins: 165,
          losses: 80,
          views: 3200,
        },
        socials: {
          twitter: 'https://twitter.com/iberianking',
          instagram: 'https://instagram.com/iberianking',
        },
      },
      {
        nickname: 'CatalanSniper',
        realName: 'Marc Garcia',
        country: 'es',
        city: 'Barcelona',
        age: 21,
        position: 'AWP',
        bio: 'AWP principal da Iberian Force, conhecido pela sua precisão.',
        teamId: createdTeams[2].id,
        stats: {
          kd: 1.31,
          adr: 94.2,
          maps_played: 198,
          wins: 134,
          losses: 64,
          views: 2800,
        },
        socials: {
          twitter: 'https://twitter.com/catalansniper',
          instagram: 'https://instagram.com/catalansniper',
        },
      },
    ];

    for (const playerData of playersData) {
      await db.insert(players).values(playerData);
    }

    // Create tournaments
    console.log('🏆 Creating tournaments...');
    const tournamentsData = [
      {
        name: 'Iberian Championship 2024',
        description: 'O maior torneio ibérico de CS2, reunindo as melhores equipas de Portugal e Espanha.',
        organizer: 'CS2Hub',
        prizePool: 10000,
        currency: 'EUR',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-22'),
        registrationDeadline: new Date('2024-03-10'),
        maxTeams: 16,
        format: 'Double Elimination',
        maps: ['de_dust2', 'de_mirage', 'de_inferno', 'de_overpass', 'de_ancient'],
        rules: 'Regulamento oficial da CS2Hub. Todas as equipas devem ter pelo menos 3 jogadores da península ibérica.',
        status: 'upcoming',
        country: 'pt',
        isFeatured: true,
      },
      {
        name: 'Madrid Open 2024',
        description: 'Torneio aberto em Madrid para equipas espanholas.',
        organizer: 'Madrid Gaming League',
        prizePool: 5000,
        currency: 'EUR',
        startDate: new Date('2024-02-20'),
        endDate: new Date('2024-02-25'),
        registrationDeadline: new Date('2024-02-15'),
        maxTeams: 8,
        format: 'Single Elimination',
        maps: ['de_dust2', 'de_mirage', 'de_inferno'],
        rules: 'Apenas equipas espanholas. Formato BO3 nas finais.',
        status: 'upcoming',
        country: 'es',
        isFeatured: true,
      },
      {
        name: 'Portuguese Masters 2024',
        description: 'Campeonato nacional português de CS2.',
        organizer: 'Federação Portuguesa de Desportos Eletrónicos',
        prizePool: 8000,
        currency: 'EUR',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-01-15'),
        registrationDeadline: new Date('2024-01-05'),
        maxTeams: 12,
        format: 'Swiss System',
        maps: ['de_dust2', 'de_mirage', 'de_inferno', 'de_overpass'],
        rules: 'Apenas equipas portuguesas. Sistema suíço com 5 rondas.',
        status: 'completed',
        country: 'pt',
        isFeatured: false,
      },
    ];

    for (const tournamentData of tournamentsData) {
      await db.insert(tournaments).values(tournamentData);
    }

    // Create news
    console.log('📰 Creating news...');
    const newsData = [
      {
        title: 'Madrid Kings vence Iberian Championship 2023',
        excerpt: 'A equipa espanhola conquistou o título mais importante da península ibérica.',
        content: `A Madrid Kings sagrou-se campeã do Iberian Championship 2023, derrotando a Nova Five na final por 3-1. 

O torneio, que decorreu em Lisboa, reuniu as 8 melhores equipas da península ibérica e ofereceu um prémio total de 15.000€.

A equipa espanhola, liderada por ElRey, mostrou uma performance excecional ao longo de todo o torneio, perdendo apenas um mapa em toda a competição.

"Estamos muito orgulhosos desta conquista", disse ElRey após a final. "A competição foi muito forte e a Nova Five deu-nos uma grande luta."

A Madrid Kings recebeu 8.000€ pelo primeiro lugar, enquanto a Nova Five ficou com 4.000€. A Iberian Force completou o pódio em terceiro lugar.`,
        author: 'CS2Hub Staff',
        category: 'tournament',
        tags: ['Madrid Kings', 'Iberian Championship', 'Nova Five'],
        readTime: 3,
        isPublished: true,
        isFeatured: true,
        views: 1250,
      },
      {
        title: 'Nova Five anuncia novo jogador',
        excerpt: 'A equipa portuguesa reforçou-se com um talento promissor.',
        content: `A Nova Five anunciou hoje a contratação de um novo jogador para a sua equipa principal.

O jogador, que preferiu manter-se anónimo por enquanto, tem 18 anos e vem da academia da equipa, onde se destacou nas últimas competições juvenis.

"Estamos muito entusiasmados com esta contratação", disse PortuGOD, capitão da equipa. "Este jogador tem um potencial incrível e vai trazer uma nova dinâmica à equipa."

A Nova Five está atualmente a preparar-se para o Iberian Championship 2024, que terá lugar em março.`,
        author: 'CS2Hub Staff',
        category: 'team',
        tags: ['Nova Five', 'contratação', 'jovem talento'],
        readTime: 2,
        isPublished: true,
        isFeatured: false,
        views: 850,
      },
      {
        title: 'Iberian Championship 2024: Inscrições abertas',
        excerpt: 'O maior torneio ibérico de CS2 está de volta com um prémio de 10.000€.',
        content: `As inscrições para o Iberian Championship 2024 estão oficialmente abertas!

O torneio, que terá lugar entre 15 e 22 de março, oferece um prémio total de 10.000€ e reunirá as 16 melhores equipas da península ibérica.

As equipas interessadas podem inscrever-se até 10 de março através do site oficial da CS2Hub.

O formato será Double Elimination, com mapas: de_dust2, de_mirage, de_inferno, de_overpass e de_ancient.

"Este é o evento mais importante do calendário ibérico", disse o organizador. "Esperamos uma competição muito forte este ano."`,
        author: 'CS2Hub Staff',
        category: 'tournament',
        tags: ['Iberian Championship', 'inscrições', 'prémios'],
        readTime: 2,
        isPublished: true,
        isFeatured: true,
        views: 2100,
      },
    ];

    for (const newsDataItem of newsData) {
      await db.insert(news).values({
        ...newsDataItem,
        publishedAt: new Date(),
      } as any);
    }

    // Create casters
    console.log('🎤 Creating casters...');
    const castersData = [
      {
        name: 'Carlos "CasterPT" Silva',
        type: 'caster',
        specialty: 'Analista e comentador principal',
        bio: 'Comentador veterano da cena portuguesa, conhecido pela sua análise técnica detalhada.',
        country: 'pt',
        languages: ['pt', 'en'],
        followers: 8500,
        rating: 4.8,
        experience: '5 anos',
        socials: {
          twitter: 'https://twitter.com/casterpt',
          twitch: 'https://twitch.tv/casterpt',
          youtube: 'https://youtube.com/casterpt',
        },
        isLive: false,
        currentGame: null,
      },
      {
        name: 'Maria "GamingGirl" Rodriguez',
        type: 'streamer',
        specialty: 'Streamer e comentadora',
        bio: 'Streamer espanhola especializada em CS2, conhecida pela sua energia e conhecimento do jogo.',
        country: 'es',
        languages: ['es', 'en'],
        followers: 12000,
        rating: 4.9,
        experience: '3 anos',
        socials: {
          twitter: 'https://twitter.com/gaminggirl',
          twitch: 'https://twitch.tv/gaminggirl',
          instagram: 'https://instagram.com/gaminggirl',
        },
        isLive: true,
        currentGame: 'CS2',
      },
      {
        name: 'João "ProCaster" Santos',
        type: 'caster',
        specialty: 'Comentador de eventos',
        bio: 'Comentador profissional especializado em eventos de grande escala.',
        country: 'pt',
        languages: ['pt', 'en', 'es'],
        followers: 6500,
        rating: 4.7,
        experience: '7 anos',
        socials: {
          twitter: 'https://twitter.com/procaster',
          twitch: 'https://twitch.tv/procaster',
        },
        isLive: false,
        currentGame: null,
      },
    ];

    for (const casterData of castersData) {
      await db.insert(casters).values(casterData);
    }

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${teamsData.length} teams`);
    console.log(`   - ${playersData.length} players`);
    console.log(`   - ${tournamentsData.length} tournaments`);
    console.log(`   - ${newsData.length} news articles`);
    console.log(`   - ${castersData.length} casters`);
    console.log(`   - 1 admin user`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
    .then(() => {
      console.log('🎉 Seed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed failed:', error);
      process.exit(1);
    });
}

export { seedData }; 
