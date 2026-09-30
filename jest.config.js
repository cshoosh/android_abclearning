module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: ['domain/**/*.ts'],
  moduleNameMapper: { '^expo-modules-core$': '<rootDir>/node_modules/expo-modules-core' },
};
