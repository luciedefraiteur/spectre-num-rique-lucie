import {ASTNode, BinaryExpressionNode, FunctionDeclarationNode, IdentifierNode, NumericLiteralNode, StringLiteralNode, VariableDeclarationNode} from './types.js';

export class Compiler
{
    public compile(nodes: ASTNode[]): string
    {
        return nodes.map(node => this.visit(node)).join('\n');
    }

    private visit(node: ASTNode): string
    {
        if(node instanceof VariableDeclarationNode)
        {
            return this.visitVariableDeclaration(node);
        }
        if(node instanceof FunctionDeclarationNode)
        {
            return this.visitFunctionDeclaration(node);
        }
        if(node instanceof BinaryExpressionNode)
        {
            return this.visitBinaryExpression(node);
        }
        if(node instanceof IdentifierNode)
        {
            return this.visitIdentifier(node);
        }
        if(node instanceof StringLiteralNode)
        {
            return this.visitStringLiteral(node);
        }
        if(node instanceof NumericLiteralNode)
        {
            return this.visitNumericLiteral(node);
        }
        throw new Error(`Unknown node type: ${ node.constructor.name }`);
    }

    private visitVariableDeclaration(node: VariableDeclarationNode): string
    {
        let js = `${ node.keyword.text } ${ node.identifier.name }`;
        if(node.initializer)
        {
            js += ` = ${ this.visit(node.initializer) }`;
        }
        return js + ';';
    }

    private visitFunctionDeclaration(node: FunctionDeclarationNode): string
    {
        const params = node.params.map((p: IdentifierNode) => p.name).join(', ');
        const body = this.compile(node.body);
        return `function ${ node.name.name }(${ params }) {\n${ body }\n}`;
    }

    private visitBinaryExpression(node: BinaryExpressionNode): string
    {
        return `${ this.visit(node.left) } ${ node.operator.text } ${ this.visit(node.right) }`;
    }

    private visitIdentifier(node: IdentifierNode): string
    {
        return node.name;
    }

    private visitStringLiteral(node: StringLiteralNode): string
    {
        return `"${ node.value }"`;
    }

    private visitNumericLiteral(node: NumericLiteralNode): string
    {
        return node.value.toString();
    }
}