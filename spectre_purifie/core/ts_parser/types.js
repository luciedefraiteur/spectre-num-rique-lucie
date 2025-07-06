"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryExpressionNode = exports.ImportDeclarationNode = exports.AssignmentExpressionNode = exports.PropertyAccessNode = exports.CallExpressionNode = exports.ExpressionStatementNode = exports.ForStatementNode = exports.WhileStatementNode = exports.ReturnStatementNode = exports.IfStatementNode = exports.FunctionDeclarationNode = exports.VariableDeclarationNode = exports.BinaryExpressionNode = exports.NumericLiteralNode = exports.StringLiteralNode = exports.IdentifierNode = exports.ASTNode = void 0;
class ASTNode {
}
exports.ASTNode = ASTNode;
class IdentifierNode extends ASTNode {
    name;
    constructor(name) {
        super();
        this.name = name;
    }
}
exports.IdentifierNode = IdentifierNode;
class StringLiteralNode extends ASTNode {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
exports.StringLiteralNode = StringLiteralNode;
class NumericLiteralNode extends ASTNode {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
exports.NumericLiteralNode = NumericLiteralNode;
class BinaryExpressionNode extends ASTNode {
    left;
    operator;
    right;
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
exports.BinaryExpressionNode = BinaryExpressionNode;
class VariableDeclarationNode extends ASTNode {
    keyword;
    identifier;
    initializer;
    constructor(keyword, identifier, initializer) {
        super();
        this.keyword = keyword;
        this.identifier = identifier;
        this.initializer = initializer;
    }
}
exports.VariableDeclarationNode = VariableDeclarationNode;
class FunctionDeclarationNode extends ASTNode {
    name;
    params;
    body;
    constructor(name, params, body) {
        super();
        this.name = name;
        this.params = params;
        this.body = body;
    }
}
exports.FunctionDeclarationNode = FunctionDeclarationNode;
class IfStatementNode extends ASTNode {
    condition;
    thenBranch;
    elseBranch;
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
}
exports.IfStatementNode = IfStatementNode;
class ReturnStatementNode extends ASTNode {
    argument;
    constructor(argument) {
        super();
        this.argument = argument;
    }
}
exports.ReturnStatementNode = ReturnStatementNode;
class WhileStatementNode extends ASTNode {
    condition;
    body;
    constructor(condition, body) {
        super();
        this.condition = condition;
        this.body = body;
    }
}
exports.WhileStatementNode = WhileStatementNode;
class ForStatementNode extends ASTNode {
    initializer;
    condition;
    increment;
    body;
    constructor(initializer, condition, increment, body) {
        super();
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }
}
exports.ForStatementNode = ForStatementNode;
class ExpressionStatementNode extends ASTNode {
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
}
exports.ExpressionStatementNode = ExpressionStatementNode;
class CallExpressionNode extends ASTNode {
    callee;
    args;
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.args = args;
    }
}
exports.CallExpressionNode = CallExpressionNode;
class PropertyAccessNode extends ASTNode {
    expression;
    name;
    constructor(expression, name) {
        super();
        this.expression = expression;
        this.name = name;
    }
}
exports.PropertyAccessNode = PropertyAccessNode;
class AssignmentExpressionNode extends ASTNode {
    left;
    operator;
    right;
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
exports.AssignmentExpressionNode = AssignmentExpressionNode;
class ImportDeclarationNode extends ASTNode {
    imports;
    moduleSpecifier;
    constructor(imports, moduleSpecifier) {
        super();
        this.imports = imports;
        this.moduleSpecifier = moduleSpecifier;
    }
}
exports.ImportDeclarationNode = ImportDeclarationNode;
class UnaryExpressionNode extends ASTNode {
    operator;
    right;
    constructor(operator, right) {
        super();
        this.operator = operator;
        this.right = right;
    }
}
exports.UnaryExpressionNode = UnaryExpressionNode;
//# sourceMappingURL=types.js.map