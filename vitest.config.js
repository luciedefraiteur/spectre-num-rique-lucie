import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/compiler/parser/data_pact.test.ts'], // Exécute uniquement ce test
    },
});
//# sourceMappingURL=vitest.config.js.map