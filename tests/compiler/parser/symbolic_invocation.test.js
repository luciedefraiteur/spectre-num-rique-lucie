import * as assert from 'assert';
import * as ts from 'typescript';
import { parse } from '../../../core/compiler/parser.js';
describe('Symbolic Invocation Parsing', () => {
    it('devrait transformer une invocation symbolique sans arguments', () => {
        const code = "@logExecutionTime\nconst x = 1;";
        const ast = parse(code, 'test.lucidScript');
        assert.ok(ast, 'L\'AST ne devrait pas être nul');
        assert.strictEqual(ast.statements.length, 2, 'Il devrait y avoir deux déclarations');
        const firstStatement = ast.statements[0];
        assert.strictEqual(firstStatement.expression.kind, ts.SyntaxKind.CallExpression, 'La première déclaration devrait être un appel de fonction');
        const callExpression = firstStatement.expression;
        assert.strictEqual(callExpression.expression.text, '__lucid_invoke__', 'Le nom de la fonction appelée devrait être __lucid_invoke__');
        assert.strictEqual(callExpression.arguments.length, 2, 'Il devrait y avoir deux arguments');
        assert.strictEqual(callExpression.arguments[0].text, 'logExecutionTime', 'Le premier argument devrait être le nom de l\'invocation');
        // Vérifie que le second argument est un SpreadElement
        const spreadElement = callExpression.arguments[1];
        assert.strictEqual(spreadElement.kind, ts.SyntaxKind.SpreadElement, 'Le second argument devrait être un SpreadElement');
        // Vérifie que l'expression du SpreadElement est un ArrayLiteralExpression vide
        const arrayLiteral = spreadElement.expression;
        assert.strictEqual(arrayLiteral.kind, ts.SyntaxKind.ArrayLiteralExpression, 'L\'expression du SpreadElement devrait être un ArrayLiteralExpression');
        assert.strictEqual(arrayLiteral.elements.length, 0, 'L\'ArrayLiteralExpression devrait être vide');
    });
    it('devrait transformer une invocation symbolique avec arguments', () => {
        const code = "@measure('myFunction')\nfunction foo() {}";
        const ast = parse(code, 'test.lucidScript');
        assert.ok(ast, 'L\'AST ne devrait pas être nul');
        assert.strictEqual(ast.statements.length, 2, 'Il devrait y avoir deux déclarations');
        const firstStatement = ast.statements[0];
        assert.strictEqual(firstStatement.expression.kind, ts.SyntaxKind.CallExpression, 'La première déclaration devrait être un appel de fonction');
        const callExpression = firstStatement.expression;
        assert.strictEqual(callExpression.expression.text, '__lucid_invoke__', 'Le nom de la fonction appelée devrait être __lucid_invoke__');
        assert.strictEqual(callExpression.arguments.length, 2, 'Il devrait y avoir deux arguments');
        assert.strictEqual(callExpression.arguments[0].text, 'measure', 'Le premier argument devrait être le nom de l\'invocation');
        // Vérifie que le second argument est un SpreadElement
        const spreadElement = callExpression.arguments[1];
        assert.strictEqual(spreadElement.kind, ts.SyntaxKind.SpreadElement, 'Le second argument devrait être un SpreadElement');
        // Vérifie que l'expression du SpreadElement est un ArrayLiteralExpression avec un élément
        const arrayLiteral = spreadElement.expression;
        assert.strictEqual(arrayLiteral.kind, ts.SyntaxKind.ArrayLiteralExpression, 'L\'expression du SpreadElement devrait être un ArrayLiteralExpression');
        assert.strictEqual(arrayLiteral.elements.length, 1, 'L\'ArrayLiteralExpression devrait contenir un élément');
        // Vérifie le contenu de l'élément
        const argValue = arrayLiteral.elements[0];
        assert.strictEqual(argValue.kind, ts.SyntaxKind.StringLiteral, 'L\'élément de l\'ArrayLiteralExpression devrait être un StringLiteral');
        assert.strictEqual(argValue.text, 'myFunction', 'Le contenu de l\'argument devrait être \'myFunction\'');
    });
    it('devrait ignorer les commentaires rituels lors de la transformation des invocations', () => {
        const code = "//§ This is a ritual comment\n@logExecutionTime\n/*§ Another ritual comment §*/";
        const ast = parse(code, 'test.lucidScript');
        assert.ok(ast, 'L\'AST ne devrait pas être nul');
        // On s'attend à 2 statements: l'invocation transformée et le commentaire multi-lignes (qui est ignoré par ts.createSourceFile)
        // Le commentaire en ligne est aussi ignoré par ts.createSourceFile
        assert.strictEqual(ast.statements.length, 1, 'Il devrait y avoir une seule déclaration (l\'invocation transformée)');
        const firstStatement = ast.statements[0];
        assert.strictEqual(firstStatement.expression.kind, ts.SyntaxKind.CallExpression, 'La première déclaration devrait être un appel de fonction');
    });
});
//# sourceMappingURL=symbolic_invocation.test.js.map