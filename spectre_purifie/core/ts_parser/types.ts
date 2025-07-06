import {Token} from './lexer.js';

export abstract class ASTNode
{
    // Base class for all AST nodes
}

export class IdentifierNode extends ASTNode
{
    constructor(public name: string)
    {
        super();
    }
}

export class StringLiteralNode extends ASTNode
{
    constructor(public value: string)
    {
        super();
    }
}

export class NumericLiteralNode extends ASTNode
{
    constructor(public value: number)
    {
        super();
    }
}

export class BinaryExpressionNode extends ASTNode
{
    constructor(public left: ASTNode, public operator: Token, public right: ASTNode)
    {
        super();
    }
}

export class VariableDeclarationNode extends ASTNode
{
    constructor(public keyword: Token, public identifier: IdentifierNode, public initializer?: ASTNode)
    {
        super();
    }
}

export class FunctionDeclarationNode extends ASTNode
{
    constructor(public name: IdentifierNode, public params: IdentifierNode[], public body: ASTNode[])
    {
        super();
    }
}

export class IfStatementNode extends ASTNode
{
    constructor(public condition: ASTNode, public thenBranch: ASTNode[], public elseBranch?: ASTNode[])
    {
        super();
    }
}

export class ReturnStatementNode extends ASTNode
{
    constructor(public argument?: ASTNode)
    {
        super();
    }
}

export class WhileStatementNode extends ASTNode
{
    constructor(public condition: ASTNode, public body: ASTNode[])
    {
        super();
    }
}

export class ForStatementNode extends ASTNode
{
    constructor(public initializer: ASTNode | undefined, public condition: ASTNode | undefined, public increment: ASTNode | undefined, public body: ASTNode[])
    {
        super();
    }
}

export class ExpressionStatementNode extends ASTNode
{
    constructor(public expression: ASTNode)
    {
        super();
    }
}

export class CallExpressionNode extends ASTNode
{
    constructor(public callee: ASTNode, public args: ASTNode[])
    {
        super();
    }
}

export class PropertyAccessNode extends ASTNode
{
    constructor(public expression: ASTNode, public name: IdentifierNode)
    {
        super();
    }
}

export class AssignmentExpressionNode extends ASTNode
{
    constructor(public left: ASTNode, public operator: Token, public right: ASTNode)
    {
        super();
    }
}

export class ImportDeclarationNode extends ASTNode
{
    constructor(public imports: (IdentifierNode | {alias: IdentifierNode, name: IdentifierNode})[], public moduleSpecifier: StringLiteralNode)
    {
        super();
    }
}

export class UnaryExpressionNode extends ASTNode
{
    constructor(public operator: Token, public right: ASTNode)
    {
        super();
    }
}