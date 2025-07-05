import * as assert from 'assert';
import * as ts from 'typescript';
import { parse } from '../../../core/compiler/parser.js';

describe('Data Pact Parsing', () => {

    it('devrait supprimer un pacte de données simple', () => {
        const code = "@pact({\"name\":\"User\",\"fields\":{\"id\":\"number\"}})\nclass User {}";
        const ast = parse(code, 'test.lucidScript', true);

        assert.ok(ast, 'L\'AST ne devrait pas être nul');
        assert.strictEqual(ast.statements.length, 1, 'Il devrait y avoir une seule déclaration (la classe User)');

        const statement = ast.statements[0] as ts.ClassDeclaration;
        assert.strictEqual(statement.kind, ts.SyntaxKind.ClassDeclaration, 'La déclaration devrait être une ClassDeclaration');
        assert.strictEqual(statement.name?.text, 'User', 'Le nom de la classe devrait être User');
    });

    it('devrait supprimer un pacte de données avec des arguments complexes', () => {
        const code = "@pact({\"version\":\"1.0\",\"config\":{\"strict\":true}})\ninterface Product {}";
        const ast = parse(code, 'test.lucidScript', true);

        assert.ok(ast, 'L\'AST ne devrait pas être nul');
        assert.strictEqual(ast.statements.length, 1, 'Il devrait y avoir une seule déclaration (l\'interface Product)');

        const statement = ast.statements[0] as ts.InterfaceDeclaration;
        assert.strictEqual(statement.kind, ts.SyntaxKind.InterfaceDeclaration, 'La déclaration devrait être une InterfaceDeclaration');
        assert.strictEqual(statement.name?.text, 'Product', 'Le nom de l\'interface devrait être Product');
    });

    it('devrait gérer un pacte de données mal formé sans planter', () => {
        const code = "@pact({name:User,fields:{id:number}})\nclass User {}"; // JSON invalide
        const ast = parse(code, 'test.lucidScript', true);

        assert.ok(ast, 'L\'AST ne devrait pas être nul');
        // Le pacte mal formé devrait être ignoré ou supprimé, la classe devrait rester
        assert.strictEqual(ast.statements.length, 1, 'Il devrait y avoir une seule déclaration (la classe User)');

        const statement = ast.statements[0] as ts.ClassDeclaration;
        assert.strictEqual(statement.kind, ts.SyntaxKind.ClassDeclaration, 'La déclaration devrait être une ClassDeclaration');
        assert.strictEqual(statement.name?.text, 'User', 'Le nom de la classe devrait être User');
    });

});