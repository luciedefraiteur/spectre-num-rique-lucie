import { BinaryExpressionNode, FunctionDeclarationNode, IdentifierNode, NumericLiteralNode, StringLiteralNode, VariableDeclarationNode } from './parser.js';
export class Compiler {
    compile(nodes) {
        return nodes.map(node => this.visit(node)).join('\n');
    }
    visit(node) {
        if (node instanceof VariableDeclarationNode) {
            return this.visitVariableDeclaration(node);
        }
        if (node instanceof FunctionDeclarationNode) {
            return this.visitFunctionDeclaration(node);
        }
        if (node instanceof BinaryExpressionNode) {
            return this.visitBinaryExpression(node);
        }
        if (node instanceof IdentifierNode) {
            return this.visitIdentifier(node);
        }
        if (node instanceof StringLiteralNode) {
            return this.visitStringLiteral(node);
        }
        if (node instanceof NumericLiteralNode) {
            return this.visitNumericLiteral(node);
        }
        throw new Error(`Unknown node type: ${node.constructor.name}`);
    }
    visitVariableDeclaration(node) {
        let js = `${node.keyword.text} ${node.identifier.name}`;
        if (node.initializer) {
            js += ` = ${this.visit(node.initializer)}`;
        }
        return js + ';';
    }
    visitFunctionDeclaration(node) {
        const params = node.params.map(p => p.name).join(', ');
        const body = this.compile(node.body);
        return `function ${node.name.name}(${params}) {\n${body}\n}`;
    }
    visitBinaryExpression(node) {
        return `${this.visit(node.left)} ${node.operator.text} ${this.visit(node.right)}`;
    }
    visitIdentifier(node) {
        return node.name;
    }
    visitStringLiteral(node) {
        return `"${node.value}"`;
    }
    visitNumericLiteral(node) {
        return node.value.toString();
    }
}
//# sourceMappingURL=compiler.js.map