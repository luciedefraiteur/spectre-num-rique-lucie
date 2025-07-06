import {ASTNode, BinaryExpressionNode, FunctionDeclarationNode, IdentifierNode, NumericLiteralNode, StringLiteralNode, VariableDeclarationNode, IfStatementNode, ReturnStatementNode, WhileStatementNode, ForStatementNode, ExpressionStatementNode, CallExpressionNode, PropertyAccessNode, AssignmentExpressionNode, ImportDeclarationNode, UnaryExpressionNode} from './types.js';

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
        if(node instanceof IfStatementNode)
        {
            return this.visitIfStatement(node);
        }
        if(node instanceof ReturnStatementNode)
        {
            return this.visitReturnStatement(node);
        }
        if(node instanceof WhileStatementNode)
        {
            return this.visitWhileStatement(node);
        }
        if(node instanceof ForStatementNode)
        {
            return this.visitForStatement(node);
        }
        if(node instanceof ExpressionStatementNode)
        {
            return this.visitExpressionStatement(node);
        }
        if(node instanceof BinaryExpressionNode)
        {
            return this.visitBinaryExpression(node);
        }
        if(node instanceof CallExpressionNode)
        {
            return this.visitCallExpression(node);
        }
        if(node instanceof PropertyAccessNode)
        {
            return this.visitPropertyAccessNode(node);
        }
        if(node instanceof AssignmentExpressionNode)
        {
            return this.visitAssignmentExpression(node);
        }
        if(node instanceof ImportDeclarationNode)
        {
            return this.visitImportDeclaration(node);
        }
        if(node instanceof UnaryExpressionNode)
        {
            return this.visitUnaryExpression(node);
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

    private visitIfStatement(node: IfStatementNode): string
    {
        const thenBranch = this.compile(node.thenBranch);
        let elseBranch = '';
        if(node.elseBranch)
        {
            elseBranch = ` else {\n${ this.compile(node.elseBranch) }\n}`;
        }
        return `if (${ this.visit(node.condition) }) {\n${ thenBranch }\n}${ elseBranch }`;
    }

    private visitReturnStatement(node: ReturnStatementNode): string
    {
        if(node.value)
        {
            return `return ${ this.visit(node.value) };`;
        }
        return 'return;';
    }

    private visitWhileStatement(node: WhileStatementNode): string
    {
        const body = this.compile(node.body);
        return `while (${ this.visit(node.condition) }) {\n${ body }\n}`;
    }

    private visitForStatement(node: ForStatementNode): string
    {
        const initializer = node.initializer ? this.visit(node.initializer) : ';';
        const condition = node.condition ? this.visit(node.condition) : '';
        const increment = node.increment ? this.visit(node.increment) : '';
        const body = this.compile(node.body);
        return `for (${ initializer } ${ condition }; ${ increment }) {\n${ body }\n}`;
    }

    private visitExpressionStatement(node: ExpressionStatementNode): string
    {
        return `${ this.visit(node.expression) };`;
    }

    private visitBinaryExpression(node: BinaryExpressionNode): string
    {
        return `${ this.visit(node.left) } ${ node.operator.text } ${ this.visit(node.right) }`;
    }

    private visitCallExpression(node: CallExpressionNode): string
    {
        const args = node.args.map(arg => this.visit(arg)).join(', ');
        return `${ this.visit(node.callee) }(${ args })`;
    }

    private visitPropertyAccessNode(node: PropertyAccessNode): string
    {
        return `${ this.visit(node.object) }.${ node.property.name }`;
    }

    private visitAssignmentExpression(node: AssignmentExpressionNode): string
    {
        return `${ this.visit(node.left) } ${ node.operator.text } ${ this.visit(node.right) }`;
    }

    private visitImportDeclaration(node: ImportDeclarationNode): string
    {
        const imports = node.imports.map(i =>
        {
            if(i instanceof IdentifierNode)
            {
                return i.name;
            }
            return `{ ${ i.name.name } as ${ i.alias.name } }`;
        }).join(', ');
        return `import ${ imports } from '${ node.moduleSpecifier.value }';`;
    }

    private visitUnaryExpression(node: UnaryExpressionNode): string
    {
        return `${ node.operator.text }${ this.visit(node.right) }`;
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