import { ASTNode, IdentifierNode, StringLiteralNode, NumericLiteralNode, BinaryExpressionNode, VariableDeclarationNode, FunctionDeclarationNode, IfStatementNode, ReturnStatementNode, WhileStatementNode, ForStatementNode, ExpressionStatementNode, CallExpressionNode, PropertyAccessNode, AssignmentExpressionNode, ImportDeclarationNode } from './parser.js';

export class CodeGenerator {
    private indentLevel: number = 0;

    private indent(): string {
        return '    '.repeat(this.indentLevel);
    }

    public generate(node: ASTNode | ASTNode[]): string {
        if (Array.isArray(node)) {
            return node.map(n => this.generate(n)).join('\n');
        }

        switch (node.constructor) {
            case IdentifierNode:
                return (node as IdentifierNode).name;
            case StringLiteralNode:
                return `"${(node as StringLiteralNode).value}"`;
            case NumericLiteralNode:
                return (node as NumericLiteralNode).value.toString();
            case BinaryExpressionNode:
                const binExpr = node as BinaryExpressionNode;
                return `${this.generate(binExpr.left)} ${binExpr.operator.text} ${this.generate(binExpr.right)}`;
            case VariableDeclarationNode:
                const varDecl = node as VariableDeclarationNode;
                let initializer = varDecl.initializer ? ` = ${this.generate(varDecl.initializer)}` : '';
                return `${this.indent()}${varDecl.keyword.text} ${this.generate(varDecl.identifier)}${initializer};`;
            case FunctionDeclarationNode:
                const funcDecl = node as FunctionDeclarationNode;
                const params = funcDecl.params.map(p => this.generate(p)).join(', ');
                const body = funcDecl.body.map(b => this.indent() + this.generate(b)).join('\n');
                this.indentLevel++;
                const indentedBody = funcDecl.body.map(b => this.generate(b)).join('\n');
                this.indentLevel--;
                return `${this.indent()}function ${this.generate(funcDecl.name)}(${params}) {
${indentedBody}
${this.indent()}}`;
            case IfStatementNode:
                const ifStmt = node as IfStatementNode;
                this.indentLevel++;
                const thenBranch = ifStmt.thenBranch.map(s => this.generate(s)).join('\n');
                this.indentLevel--;
                let elseBranch = '';
                if (ifStmt.elseBranch) {
                    this.indentLevel++;
                    elseBranch = ` else {
${ifStmt.elseBranch.map(s => this.generate(s)).join('\n')}
${this.indent()}}`;
                    this.indentLevel--;
                }
                return `${this.indent()}if (${this.generate(ifStmt.condition)}) {
${thenBranch}
${this.indent()}}${elseBranch}`;
            case ReturnStatementNode:
                const retStmt = node as ReturnStatementNode;
                const arg = retStmt.argument ? this.generate(retStmt.argument) : '';
                return `${this.indent()}return ${arg};`;
            case WhileStatementNode:
                const whileStmt = node as WhileStatementNode;
                this.indentLevel++;
                const whileBody = whileStmt.body.map(s => this.generate(s)).join('\n');
                this.indentLevel--;
                return `${this.indent()}while (${this.generate(whileStmt.condition)}) {
${whileBody}
${this.indent()}}`;
            case ForStatementNode:
                const forStmt = node as ForStatementNode;
                this.indentLevel++;
                const forInitializer = forStmt.initializer ? this.generate(forStmt.initializer).replace(/;$/, '') : '';
                const forCondition = forStmt.condition ? this.generate(forStmt.condition) : '';
                const forIncrement = forStmt.increment ? this.generate(forStmt.increment) : '';
                const forBody = forStmt.body.map(s => this.generate(s)).join('\n');
                this.indentLevel--;
                return `${this.indent()}for (${forInitializer}; ${forCondition}; ${forIncrement}) {
${forBody}
${this.indent()}}`;
            case ExpressionStatementNode:
                const exprStmt = node as ExpressionStatementNode;
                return `${this.indent()}${this.generate(exprStmt.expression)};`;
            case CallExpressionNode:
                const callExpr = node as CallExpressionNode;
                const callee = this.generate(callExpr.callee);
                const args = callExpr.args.map(arg => this.generate(arg)).join(', ');
                return `${callee}(${args})`;
            case PropertyAccessNode:
                const propAccess = node as PropertyAccessNode;
                return `${this.generate(propAccess.expression)}.${this.generate(propAccess.name)}`;
            case AssignmentExpressionNode:
                const assignExpr = node as AssignmentExpressionNode;
                return `${this.indent()}${this.generate(assignExpr.left)} ${assignExpr.operator.text} ${this.generate(assignExpr.right)};`;
            case ImportDeclarationNode:
                const importDecl = node as ImportDeclarationNode;
                const modulePath = this.generate(importDecl.moduleSpecifier);
                if (importDecl.imports.length === 0) {
                    return `import ${modulePath};`;
                } else {
                    const imports = importDecl.imports.map(imp => {
                        if ('alias' in imp) {
                            return `${this.generate(imp.name)} as ${this.generate(imp.alias)}`;
                        } else {
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
