import { defineConfig } from 'vitest/config';

/** Configuração só para a simulação de balanceamento (`npm run simular`). */
export default defineConfig({
  test: {
    include: ['src/**/*.sim.ts'],
    environment: 'node',
    silent: false,
    testTimeout: 600_000,
  },
});
