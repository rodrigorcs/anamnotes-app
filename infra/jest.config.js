// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  ...tsjPreset,

  rootDir: './',

  transform: {
    ...tsjPreset.transform
  },

  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },

  // This is the only part which you can keep
  // from the above linked tutorial's config:
  cacheDirectory: '.jest/cache',

  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],

  collectCoverage: false,
  coverageReporters: ['text', 'html'],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
}
