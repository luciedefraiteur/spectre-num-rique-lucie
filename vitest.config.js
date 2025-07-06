import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/compiler/parser/data_pact.test.ts'], // Exécute uniquement ce test
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
        },
    },
});
//# sourceMappingURL=vitest.config.js.map