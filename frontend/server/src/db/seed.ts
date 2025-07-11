import { db } from './connection.js';
import { users, teams, players, tournaments, news, casters } from './schema.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Hash password for admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const [adminUser] = await db.insert(users).values({
      email: 'admin@cs2hub.pt',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'CS2Hub',
      role: 'admin',
      isVerified: true,
      country: 'pt'
    } as any).returning();

    console.log('✅ Admin user created');

    // Create regular users
    const [user1] = await db.insert(users).values({
      email: 'player1@cs2hub.pt',
      username: 'player1',
      password: hashedPassword,
      firstName: 'João',
      lastName: 'Silva',
      role: 'user',
      isVerified: true,
      country: 'pt'
    } as any).returning();

    const [user2] = await db.insert(users).values({
      email: 'player2@cs2hub.pt',
      username: 'player2',
      password: hashedPassword,
      firstName: 'Maria',
      lastName: 'Santos',
      role: 'user',
      isVerified: true,
      country: 'pt'
    } as any).returning();

    console.log('✅ Regular users created');

    // Create teams
    const [team1] = await db.insert(teams).values({
      name: 'Lusitano Five',
      tag: 'LUS5',
      description: 'Equipa portuguesa veterana da scene de CS2',
      country: 'pt',
      city: 'Lisboa',
      founded: 2020,
      website: 'https://lusitano5.pt',
      socials: {
        twitter: 'https://twitter.com/lusitano5',
        discord: 'https://discord.gg/lusitano5'
      },
      achievements: [
        'Campeões Winter Championship 2023',
        'Finalistas Iberian Cup 2024'
      ]
    } as any).returning();

    const [team2] = await db.insert(teams).values({
      name: 'Madrid Kings',
      tag: 'MADK',
      description: 'Equipa espanhola promissora da scene local',
      country: 'es',
      city: 'Madrid',
      founded: 2022,
      website: 'https://madridkings.es',
      socials: {
        twitter: 'https://twitter.com/madridkings',
        discord: 'https://discord.gg/madridkings'
      },
      achievements: [
        'Finalistas Winter Championship 2023',
        'Campeões Madrid Cup 2024'
      ]
    } as any).returning();

    console.log('✅ Teams created');

    // Verify entities were created
    if (!adminUser) {
      throw new Error('Failed to create admin user');
    }
    if (!user1 || !user2) {
      throw new Error('Failed to create users');
    }
    if (!team1 || !team2) {
      throw new Error('Failed to create teams');
    }

    // Create players
    await db.insert(players).values([
      {
        userId: user1.id,
        teamId: team1.id,
        nickname: 'Lusitan',
        realName: 'João Silva',
        country: 'pt',
        city: 'Lisboa',
        age: 25,
        role: 'player',
        position: 'IGL',
        bio: 'Capitão da Lusitano Five, experiente IGL com 5 anos de experiência',
        stats: {
          kd: 1.15,
          adr: 85.5,
          maps_played: 150
        },
        socials: {
          steam: 'https://steamcommunity.com/id/lusitan',
          twitter: 'https://twitter.com/lusitan'
        }
      },
      {
        userId: user2.id,
        teamId: team2.id,
        nickname: 'Madrid',
        realName: 'Maria Santos',
        country: 'es',
        city: 'Madrid',
        age: 23,
        role: 'player',
        position: 'AWP',
        bio: 'AWP principal da Madrid Kings, conhecida pela precisão',
        stats: {
          kd: 1.25,
          adr: 92.3,
          maps_played: 120
        },
        socials: {
          steam: 'https://steamcommunity.com/id/madrid',
          twitter: 'https://twitter.com/madrid'
        }
      }
    ] as any);

    console.log('✅ Players created');

    // Create tournaments
    await db.insert(tournaments).values([
      {
        name: 'Iberian Cup 2024',
        description: 'O maior torneio de CS2 da península ibérica',
        organizer: 'CS2Hub',
        prizePool: 5000.00,
        currency: 'EUR',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-15'),
        registrationDeadline: new Date('2024-02-15'),
        maxTeams: 32,
        currentTeams: 16,
        format: 'Single Elimination',
        maps: ['de_dust2', 'de_mirage', 'de_inferno', 'de_overpass', 'de_ancient'],
        status: 'upcoming',
        country: 'pt',
        isFeatured: true
      },
      {
        name: 'Winter Championship 2023',
        description: 'Campeonato de inverno com as melhores equipas',
        organizer: 'CS2Hub',
        prizePool: 3000.00,
        currency: 'EUR',
        startDate: new Date('2023-12-01'),
        endDate: new Date('2023-12-10'),
        maxTeams: 16,
        currentTeams: 16,
        format: 'Double Elimination',
        maps: ['de_dust2', 'de_mirage', 'de_inferno'],
        status: 'completed',
        country: 'pt',
        isFeatured: false
      }
    ] as any);

    console.log('✅ Tournaments created');

    // Create news
    await db.insert(news).values([
      {
        title: 'Iberian Cup 2024: Inscrições Abertas para o Maior Torneio Ibérico',
        excerpt: 'O maior torneio de CS2 da península ibérica está de volta com um prize pool de €5,000 e 32 equipas participantes.',
        content: 'O Iberian Cup 2024, o maior torneio de CS2 da península ibérica, anunciou hoje a abertura das inscrições. Com um prize pool de €5,000 e 32 equipas participantes, o evento promete ser o maior de sempre...',
        author: 'CS2Hub Team',
        category: 'tournament',
        tags: ['Iberian Cup', 'Torneio', 'CS2'],
        views: 15420,
        readTime: 5,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date()
      },
      {
        title: 'Lusitano Five Vence Winter Championship 2023',
        excerpt: 'Equipa portuguesa conquista o título de inverno com performance dominante.',
        content: 'A Lusitano Five conquistou o Winter Championship 2023 com uma performance dominante, vencendo todas as partidas da fase eliminatória...',
        author: 'CS2Hub Team',
        category: 'team',
        tags: ['Lusitano Five', 'Winter Championship', 'Vitória'],
        views: 8920,
        readTime: 3,
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date()
      }
    ] as any);

    console.log('✅ News created');

    // Create casters
    await db.insert(casters).values([
      {
        userId: adminUser.id,
        name: 'Nuno Costa',
        type: 'caster',
        specialty: 'Analista Principal',
        country: 'pt',
        languages: ['pt', 'en'],
        followers: 15420,
        rating: 5,
        experience: '5 anos',
        bio: 'Analista principal da scene portuguesa de CS2',
        socials: {
          twitch: 'https://twitch.tv/nunocosta',
          youtube: 'https://youtube.com/nunocosta',
          discord: 'nunocosta#1234'
        },
        isLive: false
      },
      {
        userId: user1.id,
        name: 'Maria Santos',
        type: 'streamer',
        specialty: 'Streamer',
        country: 'es',
        languages: ['es', 'en'],
        followers: 8920,
        rating: 4.5,
        experience: '3 anos',
        bio: 'Streamer espanhola especializada em CS2',
        socials: {
          twitch: 'https://twitch.tv/mariasantos',
          youtube: 'https://youtube.com/mariasantos',
          discord: 'mariasantos#5678'
        },
        isLive: true
      }
    ] as any);

    console.log('✅ Casters created');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Default credentials:');
    console.log('Admin: admin@cs2hub.pt / admin123');
    console.log('User 1: player1@cs2hub.pt / admin123');
    console.log('User 2: player2@cs2hub.pt / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

export { seed }; 
