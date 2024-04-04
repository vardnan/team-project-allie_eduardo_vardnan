module.exports = {
  transformIgnorePatterns: ['node_modules/(?!@?axios)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/cssStub.js',
  },
  testEnvironment: 'jsdom',
};
