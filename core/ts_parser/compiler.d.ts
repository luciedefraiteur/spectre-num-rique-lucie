import { ASTNode } from './parser.js';
export declare class Compiler {
    compile(nodes: ASTNode[]): string;
    private visit;
    private visitVariableDeclaration;
    private visitFunctionDeclaration;
    private visitBinaryExpression;
    private visitIdentifier;
    private visitStringLiteral;
    private visitNumericLiteral;
}
