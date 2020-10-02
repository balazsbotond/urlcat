module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testMatch: [
    '**/test/**/*.ts'
  ],
  verbose: true,
  collectCoverageFrom: [
    '**/src/**/*.ts'
  ]
}
