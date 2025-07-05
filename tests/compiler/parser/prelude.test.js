import * as assert from 'assert';
import { normalizeLineEndings, detectDialect } from '../../../core/compiler/prelude.js';
describe('Compiler Prelude', () => {
    describe('normalizeLineEndings()', () => {
        it('devrait convertir CRLF en LF', () => {
            const input = 'const x = 1;\r\nconst y = 2;\r\n';
            const expected = 'const x = 1;\nconst y = 2;\n';
            assert.strictEqual(normalizeLineEndings(input), expected);
        });
        it('ne devrait pas modifier une chaîne déjà en LF', () => {
            const input = 'const x = 1;\nconst y = 2;\n';
            assert.strictEqual(normalizeLineEndings(input), input);
        });
    });
    describe('detectDialect()', () => {
        it('devrait détecter TypeScript pour les fichiers .ts', () => {
            assert.strictEqual(detectDialect('mon/fichier.ts'), 'typescript');
        });
        it('devrait détecter JavaScript pour les fichiers .js', () => {
            assert.strictEqual(detectDialect('mon/fichier.js'), 'javascript');
        });
        it('devrait détecter LucidScript pour les fichiers .lucidScript', () => {
            assert.strictEqual(detectDialect('mon/fichier.lucidScript'), 'lucidscript');
        });
        it('devrait retourner unknown pour les extensions inconnues', () => {
            assert.strictEqual(detectDialect('mon/fichier.txt'), 'unknown');
        });
    });
});
//# sourceMappingURL=prelude.test.js.map