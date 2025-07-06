import { ASTNode } from './types.js';
export declare class Compiler {
    compile(nodes: ASTNode[]): string;
    private visit;
    private visitVariableDeclaration;
    private visitFunctionDeclaration;
    private visitIfStatement;
    private visitReturnStatement;
    private visitWhileStatement;
    private visitForStatement;
    private visitExpressionStatement;
    private visitBinaryExpression;
    private visitCallExpression;
    private visitPropertyAccessNode;
    private visitAssignmentExpression;
    private visitImportDeclaration;
    private visitUnaryExpression;
    private visitIdentifier;
    private visitStringLiteral;
    private visitNumericLiteral;
}
