module.exports = {
  preset: 'ts-jest/presets/default-esm',  
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__test__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,  
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',  
  },
  extensionsToTreatAsEsm: ['.ts'],
};