import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/*.ts'],
    coverage: {
      enabled: true,
      reportsDirectory: './coverage',
      reporter: ['lcov', 'text'],
    }
  },
})
