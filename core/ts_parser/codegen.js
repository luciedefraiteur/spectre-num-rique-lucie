"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
var parser_js_1 = require("./parser.js");
var CodeGenerator = /** @class */ (function () {
    function CodeGenerator() {
        this.indentLevel = 0;
    }
    CodeGenerator.prototype.indent = function () {
        return '    '.repeat(this.indentLevel);
    };
    CodeGenerator.prototype.generate = function (node) {
        var _this = this;
        if (Array.isArray(node)) {
            return node.map(function (n) { return _this.generate(n); }).join('\n');
        }
        switch (node.constructor) {
            case parser_js_1.IdentifierNode:
                return node.name;
            case parser_js_1.StringLiteralNode:
                return "\"".concat(node.value, "\"");
            case parser_js_1.NumericLiteralNode:
                return node.value.toString();
            case parser_js_1.BinaryExpressionNode:
                var binExpr = node;
                return "".concat(this.generate(binExpr.left), " ").concat(binExpr.operator.text, " ").concat(this.generate(binExpr.right));
            case parser_js_1.VariableDeclarationNode:
                var varDecl = node;
                var initializer = varDecl.initializer ? " = ".concat(this.generate(varDecl.initializer)) : '';
                return "".concat(this.indent()).concat(varDecl.keyword.text, " ").concat(this.generate(varDecl.identifier)).concat(initializer, ";");
            case parser_js_1.FunctionDeclarationNode:
                var funcDecl = node;
                var params = funcDecl.params.map(function (p) { return _this.generate(p); }).join(', ');
                var body = funcDecl.body.map(function (b) { return _this.indent() + _this.generate(b); }).join('\n');
                this.indentLevel++;
                var indentedBody = funcDecl.body.map(function (b) { return _this.generate(b); }).join('\n');
                this.indentLevel--;
                return "".concat(this.indent(), "function ").concat(this.generate(funcDecl.name), "(").concat(params, ") {\n").concat(indentedBody, "\n").concat(this.indent(), "}");
            case parser_js_1.IfStatementNode:
                var ifStmt = node;
                this.indentLevel++;
                var thenBranch = ifStmt.thenBranch.map(function (s) { return _this.generate(s); }).join('\n');
                this.indentLevel--;
                var elseBranch = '';
                if (ifStmt.elseBranch) {
                    this.indentLevel++;
                    elseBranch = " else {\n".concat(ifStmt.elseBranch.map(function (s) { return _this.generate(s); }).join('\n'), "\n").concat(this.indent(), "}");
                    this.indentLevel--;
                }
                return "".concat(this.indent(), "if (").concat(this.generate(ifStmt.condition), ") {\n").concat(thenBranch, "\n").concat(this.indent(), "}").concat(elseBranch);
            case parser_js_1.ReturnStatementNode:
                var retStmt = node;
                var arg = retStmt.argument ? this.generate(retStmt.argument) : '';
                return "".concat(this.indent(), "return ").concat(arg, ";");
            case parser_js_1.WhileStatementNode:
                var whileStmt = node;
                this.indentLevel++;
                var whileBody = whileStmt.body.map(function (s) { return _this.generate(s); }).join('\n');
                this.indentLevel--;
                return "".concat(this.indent(), "while (").concat(this.generate(whileStmt.condition), ") {\n").concat(whileBody, "\n").concat(this.indent(), "}");
            case parser_js_1.ForStatementNode:
                var forStmt = node;
                this.indentLevel++;
                var forInitializer = forStmt.initializer ? this.generate(forStmt.initializer).replace(/;$/, '') : '';
                var forCondition = forStmt.condition ? this.generate(forStmt.condition) : '';
                var forIncrement = forStmt.increment ? this.generate(forStmt.increment) : '';
                var forBody = forStmt.body.map(function (s) { return _this.generate(s); }).join('\n');
                this.indentLevel--;
                return "".concat(this.indent(), "for (").concat(forInitializer, "; ").concat(forCondition, "; ").concat(forIncrement, ") {\n").concat(forBody, "\n").concat(this.indent(), "}");
            case parser_js_1.ExpressionStatementNode:
                var exprStmt = node;
                return "".concat(this.indent()).concat(this.generate(exprStmt.expression), ";");
            case parser_js_1.CallExpressionNode:
                var callExpr = node;
                var callee = this.generate(callExpr.callee);
                var args = callExpr.args.map(function (arg) { return _this.generate(arg); }).join(', ');
                return "".concat(callee, "(").concat(args, ")");
            case parser_js_1.PropertyAccessNode:
                var propAccess = node;
                return "".concat(this.generate(propAccess.expression), ".").concat(this.generate(propAccess.name));
            case parser_js_1.AssignmentExpressionNode:
                var assignExpr = node;
                return "".concat(this.generate(assignExpr.left), " ").concat(assignExpr.operator.text, " ").concat(this.generate(assignExpr.right));
            default:
                return "// Unknown AST Node: ".concat(node.constructor.name);
        }
    };
    return CodeGenerator;
}());
exports.CodeGenerator = CodeGenerator;
