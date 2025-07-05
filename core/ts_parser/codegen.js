import { IdentifierNode, StringLiteralNode, NumericLiteralNode, BinaryExpressionNode, VariableDeclarationNode, FunctionDeclarationNode, IfStatementNode, ReturnStatementNode, WhileStatementNode, ForStatementNode, ExpressionStatementNode, CallExpressionNode, PropertyAccessNode, AssignmentExpressionNode, ImportDeclarationNode } from './types.js';
export class CodeGenerator {
    indentLevel = 0;
    indent() {
        return '    '.repeat(this.indentLevel);
    }
    generate(node) {
        if (Array.isArray(node)) {
            return node.map(n => this.generate(n)).join('\n');
        }
        switch (node.constructor) {
            case IdentifierNode:
                return node.name;
            case StringLiteralNode:
                return `"${node.value}"`;
            case NumericLiteralNode:
                return node.value.toString();
            case BinaryExpressionNode:
                const binExpr = node;
                return `${this.generate(binExpr.left)} ${binExpr.operator.text} ${this.generate(binExpr.right)}`;
            case VariableDeclarationNode:
                const varDecl = node;
                let initializer = varDecl.initializer ? ` = ${this.generate(varDecl.initializer)}` : '';
                return `${this.indent()}${varDecl.keyword.text} ${this.generate(varDecl.identifier)}${initializer};`;
            case FunctionDeclarationNode:
                const funcDecl = node;
                const params = funcDecl.params.map((p) => this.generate(p)).join(', ');
                const body = funcDecl.body.map((b) => this.indent() + this.generate(b)).join('\n');
                this.indentLevel++;
                const indentedBody = funcDecl.body.map((b) => this.generate(b)).join('\n');
                this.indentLevel--;
                return `${this.indent()}function ${this.generate(funcDecl.name)}(${params}) {
${indentedBody}
${this.indent()}}`;
            case IfStatementNode:
                const ifStmt = node;
                this.indentLevel++;
                const thenBranch = ifStmt.thenBranch.map((s) => this.generate(s)).join('\n');
                this.indentLevel--;
                let elseBranch = '';
                if (ifStmt.elseBranch) {
                    this.indentLevel++;
                    elseBranch = ` else {
${ifStmt.elseBranch.map((s) => this.generate(s)).join('\n')}
${this.indent()}}`;
                    this.indentLevel--;
                }
                return `${this.indent()}if (${this.generate(ifStmt.condition)}) {
${thenBranch}
${this.indent()}}${elseBranch}`;
            case ReturnStatementNode:
                const retStmt = node;
                const arg = retStmt.argument ? this.generate(retStmt.argument) : '';
                return `${this.indent()}return ${arg};`;
            case WhileStatementNode:
                const whileStmt = node;
                this.indentLevel++;
                const whileBody = whileStmt.body.map((s) => this.generate(s)).join('\n');
                this.indentLevel--;
                return `${this.indent()}while (${this.generate(whileStmt.condition)}) {
${whileBody}
${this.indent()}}`;
            case ForStatementNode:
                const forStmt = node;
                this.indentLevel++;
                const forInitializer = forStmt.initializer ? this.generate(forStmt.initializer).replace(/;$/, '') : '';
                const forCondition = forStmt.condition ? this.generate(forStmt.condition) : '';
                const forIncrement = forStmt.increment ? this.generate(forStmt.increment) : '';
                const forBody = forStmt.body.map((s) => this.generate(s)).join('\n');
                this.indentLevel--;
                return `${this.indent()}for (${forInitializer}; ${forCondition}; ${forIncrement}) {
${forBody}
${this.indent()}}`;
            case ExpressionStatementNode:
                const exprStmt = node;
                return `${this.indent()}${this.generate(exprStmt.expression)};`;
            case CallExpressionNode:
                const callExpr = node;
                const callee = this.generate(callExpr.callee);
                const args = callExpr.args.map((arg) => this.generate(arg)).join(', ');
                return `${callee}(${args})`;
            case PropertyAccessNode:
                const propAccess = node;
                return `${this.generate(propAccess.expression)}.${this.generate(propAccess.name)}`;
            case AssignmentExpressionNode:
                const assignExpr = node;
                return `${this.indent()}${this.generate(assignExpr.left)} ${assignExpr.operator.text} ${this.generate(assignExpr.right)};`;
            case ImportDeclarationNode:
                const importDecl = node;
                const modulePath = this.generate(importDecl.moduleSpecifier);
                if (importDecl.imports.length === 0) {
                    return `import ${modulePath};`;
                }
                else {
                    const imports = importDecl.imports.map((imp) => {
                        if ('alias' in imp) {
                            return `${this.generate(imp.name)} as ${this.generate(imp.alias)}`;
                        }
                        else {
                            return this.generate(imp);
                        }
                    }).join(', ');
                    return `import { ${imports} } from ${modulePath};`;
                }
            default:
                return `// Unknown AST Node: ${node.constructor.name}`;
        }
    }
}
//# sourceMappingURL=codegen.js.map