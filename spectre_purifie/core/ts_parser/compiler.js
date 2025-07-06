"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const types_js_1 = require("./types.js");
class Compiler {
    compile(nodes) {
        return nodes.map(node => this.visit(node)).join('\n');
    }
    visit(node) {
        if (node instanceof types_js_1.VariableDeclarationNode) {
            return this.visitVariableDeclaration(node);
        }
        if (node instanceof types_js_1.FunctionDeclarationNode) {
            return this.visitFunctionDeclaration(node);
        }
        if (node instanceof types_js_1.IfStatementNode) {
            return this.visitIfStatement(node);
        }
        if (node instanceof types_js_1.ReturnStatementNode) {
            return this.visitReturnStatement(node);
        }
        if (node instanceof types_js_1.WhileStatementNode) {
            return this.visitWhileStatement(node);
        }
        if (node instanceof types_js_1.ForStatementNode) {
            return this.visitForStatement(node);
        }
        if (node instanceof types_js_1.ExpressionStatementNode) {
            return this.visitExpressionStatement(node);
        }
        if (node instanceof types_js_1.BinaryExpressionNode) {
            return this.visitBinaryExpression(node);
        }
        if (node instanceof types_js_1.CallExpressionNode) {
            return this.visitCallExpression(node);
        }
        if (node instanceof types_js_1.PropertyAccessNode) {
            return this.visitPropertyAccessNode(node);
        }
        if (node instanceof types_js_1.AssignmentExpressionNode) {
            return this.visitAssignmentExpression(node);
        }
        if (node instanceof types_js_1.ImportDeclarationNode) {
            return this.visitImportDeclaration(node);
        }
        if (node instanceof types_js_1.UnaryExpressionNode) {
            return this.visitUnaryExpression(node);
        }
        if (node instanceof types_js_1.IdentifierNode) {
            return this.visitIdentifier(node);
        }
        if (node instanceof types_js_1.StringLiteralNode) {
            return this.visitStringLiteral(node);
        }
        if (node instanceof types_js_1.NumericLiteralNode) {
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
        const params = node.params.map((p) => p.name).join(', ');
        const body = this.compile(node.body);
        return `function ${node.name.name}(${params}) {\n${body}\n}`;
    }
    visitIfStatement(node) {
        const thenBranch = this.compile(node.thenBranch);
        let elseBranch = '';
        if (node.elseBranch) {
            elseBranch = ` else {\n${this.compile(node.elseBranch)}\n}`;
        }
        return `if (${this.visit(node.condition)}) {\n${thenBranch}\n}${elseBranch}`;
    }
    visitReturnStatement(node) {
        if (node.value) {
            return `return ${this.visit(node.value)};`;
        }
        return 'return;';
    }
    visitWhileStatement(node) {
        const body = this.compile(node.body);
        return `while (${this.visit(node.condition)}) {\n${body}\n}`;
    }
    visitForStatement(node) {
        const initializer = node.initializer ? this.visit(node.initializer) : ';';
        const condition = node.condition ? this.visit(node.condition) : '';
        const increment = node.increment ? this.visit(node.increment) : '';
        const body = this.compile(node.body);
        return `for (${initializer} ${condition}; ${increment}) {\n${body}\n}`;
    }
    visitExpressionStatement(node) {
        return `${this.visit(node.expression)};`;
    }
    visitBinaryExpression(node) {
        return `${this.visit(node.left)} ${node.operator.text} ${this.visit(node.right)}`;
    }
    visitCallExpression(node) {
        const args = node.args.map(arg => this.visit(arg)).join(', ');
        return `${this.visit(node.callee)}(${args})`;
    }
    visitPropertyAccessNode(node) {
        return `${this.visit(node.object)}.${node.property.name}`;
    }
    visitAssignmentExpression(node) {
        return `${this.visit(node.left)} ${node.operator.text} ${this.visit(node.right)}`;
    }
    visitImportDeclaration(node) {
        const imports = node.imports.map(i => {
            if (i instanceof types_js_1.IdentifierNode) {
                return i.name;
            }
            return `{ ${i.name.name} as ${i.alias.name} }`;
        }).join(', ');
        return `import ${imports} from '${node.moduleSpecifier.value}';`;
    }
    visitUnaryExpression(node) {
        return `${node.operator.text}${this.visit(node.right)}`;
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
exports.Compiler = Compiler;
//# sourceMappingURL=compiler.js.map