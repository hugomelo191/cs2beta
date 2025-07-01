import { db } from './src/db/connection.js';
import { users, teams, players, tournaments, news, casters } from './src/db/schema.js';
import { eq, ne } from 'drizzle-orm';

async function clearFakeData() {
  console.log('🧹 Limpando dados falsos da base de dados...');

  try {
    // Clear all fake data tables
    console.log('🗑️ Removendo dados de teste...');
    
    await db.delete(players);
    console.log('✅ Players limpos');
    
    await db.delete(teams);
    console.log('✅ Teams limpos');
    
    await db.delete(tournaments);
    console.log('✅ Tournaments limpos');
    
    await db.delete(news);
    console.log('✅ News limpos');
    
    await db.delete(casters);
    console.log('✅ Casters limpos');
    
    // Keep only admin user, remove test users
    const adminUsers = await db.select().from(users).where(eq(users.role, 'admin'));
    
    // Delete non-admin users
    await db.delete(users).where(ne(users.role, 'admin'));
    console.log('✅ Utilizadores de teste removidos (admin mantido)');

    console.log('🎉 Base de dados limpa com sucesso!');
    console.log('📋 Apenas utilizadores admin foram mantidos');
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  clearFakeData()
    .then(() => {
      console.log('✅ Limpeza concluída');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na limpeza:', error);
      process.exit(1);
    });
}

export { clearFakeData }; 