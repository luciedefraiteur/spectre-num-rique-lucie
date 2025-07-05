
import { Lexer } from './core/ts_parser/lexer.js';
import { Parser, FunctionDeclarationNode, ReturnStatementNode, NumericLiteralNode } from './core/ts_parser/parser.js';

function runTest() {
    const code = 'function a() { return 1; }';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    if (ast.length === 0) {
        console.log("Test Failed: AST is empty.");
        return;
    }

    const funcNode = ast[0];
    if (!(funcNode instanceof FunctionDeclarationNode)) {
        console.log("Test Failed: First node is not a FunctionDeclarationNode.");
        return;
    }

    if (funcNode.body.length === 0) {
        console.log("Test Failed: Function body is empty.");
        return;
    }

    const returnNode = funcNode.body[0];
    if (!(returnNode instanceof ReturnStatementNode)) {
        console.log("Test Failed: First statement in function body is not a ReturnStatementNode.");
        return;
    }

    if (!(returnNode.argument instanceof NumericLiteralNode)) {
        console.log("Test Failed: Return statement argument is not a NumericLiteralNode.");
        return;
    }

    if (returnNode.argument.value !== 1) {
        console.log("Test Failed: Return statement argument value is not 1.");
        return;
    }

    console.log("Test Passed: Parser successfully parsed the return statement within a function.");
}

runTest();
