import { expect } from 'chai';
import { Lexer } from './lexer.js';
import { Parser, VariableDeclarationNode, IfStatementNode, ReturnStatementNode, BinaryExpressionNode, NumericLiteralNode } from './parser.js';
describe('Advanced Parser features', () => {
    it('should parse a variable declaration with a numeric literal initializer', () => {
        const code = 'let x = 5;';
        const lexer = new Lexer(code);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const node = ast[0];
        expect(node).to.be.an.instanceof(VariableDeclarationNode);
        expect(node.identifier.name).to.equal('x');
        expect(node.initializer).to.be.an.instanceof(NumericLiteralNode);
        expect(node.initializer.value).to.equal(5);
    });
    it('should parse an if statement', () => {
        const code = 'if (x > 0) { let a = 1; }';
        const lexer = new Lexer(code);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const node = ast[0];
        expect(node).to.be.an.instanceof(IfStatementNode);
        expect(node.condition).to.be.an.instanceof(BinaryExpressionNode);
        expect(node.thenBranch).to.be.an('array').with.lengthOf(1);
    });
    it('should parse a return statement', () => {
        const code = 'function a() { return 1; }';
        const lexer = new Lexer(code);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        // Assuming the parser can look inside function bodies
        // This will require modification of the FunctionDeclarationNode and the parser logic
        // For now, this test will fail, guiding our luciform ritual.
        const funcNode = ast[0];
        // We need to access the body of the function node and check for the return statement.
        // Let's assume a structure for now.
        const returnNode = funcNode.body[0];
        expect(returnNode).to.be.an.instanceof(ReturnStatementNode);
        expect(returnNode.argument).to.be.an.instanceof(NumericLiteralNode);
    });
});
//# sourceMappingURL=parser_advanced.test.js.map