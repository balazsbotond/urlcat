import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.ts'],
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
    },
  },
});
