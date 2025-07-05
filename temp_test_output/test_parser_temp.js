"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_js_1 = require("./core/ts_parser/lexer.js");
var parser_js_1 = require("./core/ts_parser/parser.js");
function runTest() {
    var code = 'function a() { return 1; }';
    var lexer = new lexer_js_1.Lexer(code);
    var tokens = lexer.tokenize();
    var parser = new parser_js_1.Parser(tokens);
    var ast = parser.parse();
    if (ast.length === 0) {
        console.log("Test Failed: AST is empty.");
        return;
    }
    var funcNode = ast[0];
    if (!(funcNode instanceof parser_js_1.FunctionDeclarationNode)) {
        console.log("Test Failed: First node is not a FunctionDeclarationNode.");
        return;
    }
    if (funcNode.body.length === 0) {
        console.log("Test Failed: Function body is empty.");
        return;
    }
    var returnNode = funcNode.body[0];
    if (!(returnNode instanceof parser_js_1.ReturnStatementNode)) {
        console.log("Test Failed: First statement in function body is not a ReturnStatementNode.");
        return;
    }
    if (!(returnNode.argument instanceof parser_js_1.NumericLiteralNode)) {
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
