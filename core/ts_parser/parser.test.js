import { expect } from 'chai';
import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { FunctionDeclarationNode } from './types.js';
describe('Parser', () => {
    it('should parse a simple function declaration', () => {
        const code = 'function myFunction() {}';
        const lexer = new Lexer(code);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        expect(ast).to.have.lengthOf(1);
        expect(ast[0]).to.be.an.instanceof(FunctionDeclarationNode);
    });
});
//# sourceMappingURL=parser.test.js.map