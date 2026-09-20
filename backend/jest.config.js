export default {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};
