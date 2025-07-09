import { Token } from './lexer.js';
export declare abstract class ASTNode {
}
export declare class IdentifierNode extends ASTNode {
    name: string;
    constructor(name: string);
}
export declare class StringLiteralNode extends ASTNode {
    value: string;
    constructor(value: string);
}
export declare class NumericLiteralNode extends ASTNode {
    value: number;
    constructor(value: number);
}
export declare class BinaryExpressionNode extends ASTNode {
    left: ASTNode;
    operator: Token;
    right: ASTNode;
    constructor(left: ASTNode, operator: Token, right: ASTNode);
}
export declare class VariableDeclarationNode extends ASTNode {
    keyword: Token;
    identifier: IdentifierNode;
    initializer?: ASTNode | undefined;
    constructor(keyword: Token, identifier: IdentifierNode, initializer?: ASTNode | undefined);
}
export declare class FunctionDeclarationNode extends ASTNode {
    name: IdentifierNode;
    params: IdentifierNode[];
    body: ASTNode[];
    constructor(name: IdentifierNode, params: IdentifierNode[], body: ASTNode[]);
}
export declare class IfStatementNode extends ASTNode {
    condition: ASTNode;
    thenBranch: ASTNode[];
    elseBranch?: ASTNode[] | undefined;
    constructor(condition: ASTNode, thenBranch: ASTNode[], elseBranch?: ASTNode[] | undefined);
}
export declare class ReturnStatementNode extends ASTNode {
    argument?: ASTNode | undefined;
    constructor(argument?: ASTNode | undefined);
}
export declare class WhileStatementNode extends ASTNode {
    condition: ASTNode;
    body: ASTNode[];
    constructor(condition: ASTNode, body: ASTNode[]);
}
export declare class ForStatementNode extends ASTNode {
    initializer: ASTNode | undefined;
    condition: ASTNode | undefined;
    increment: ASTNode | undefined;
    body: ASTNode[];
    constructor(initializer: ASTNode | undefined, condition: ASTNode | undefined, increment: ASTNode | undefined, body: ASTNode[]);
}
export declare class ExpressionStatementNode extends ASTNode {
    expression: ASTNode;
    constructor(expression: ASTNode);
}
export declare class CallExpressionNode extends ASTNode {
    callee: ASTNode;
    args: ASTNode[];
    constructor(callee: ASTNode, args: ASTNode[]);
}
export declare class PropertyAccessNode extends ASTNode {
    expression: ASTNode;
    name: IdentifierNode;
    constructor(expression: ASTNode, name: IdentifierNode);
}
export declare class AssignmentExpressionNode extends ASTNode {
    left: ASTNode;
    operator: Token;
    right: ASTNode;
    constructor(left: ASTNode, operator: Token, right: ASTNode);
}
export declare class ImportDeclarationNode extends ASTNode {
    imports: (IdentifierNode | {
        alias: IdentifierNode;
        name: IdentifierNode;
    })[];
    moduleSpecifier: StringLiteralNode;
    constructor(imports: (IdentifierNode | {
        alias: IdentifierNode;
        name: IdentifierNode;
    })[], moduleSpecifier: StringLiteralNode);
}
export declare class UnaryExpressionNode extends ASTNode {
    operator: Token;
    right: ASTNode;
    constructor(operator: Token, right: ASTNode);
}
