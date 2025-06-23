import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  // Setup test database connection
  console.log('🧪 Setting up test environment...');
});

afterAll(async () => {
  // Cleanup test database
  console.log('🧹 Cleaning up test environment...');
});

// Global test utilities
export const testUtils = {
  // Helper functions for tests
  createTestUser: () => ({
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
  }),
  
  createTestTeam: () => ({
    name: 'Test Team',
    tag: 'TEST',
    description: 'Test team description',
    country: 'pt',
    city: 'Lisboa',
  }),
  
  createTestPlayer: () => ({
    nickname: 'TestPlayer',
    realName: 'Test Player',
    country: 'pt',
    city: 'Lisboa',
    age: 20,
    position: 'Rifler',
  }),
}; 