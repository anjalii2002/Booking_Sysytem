module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  // mongodb-memory-server may need to download/start a replica set on a new machine.
  testTimeout: 30000,
  setupFilesAfterEnv: [],
};
