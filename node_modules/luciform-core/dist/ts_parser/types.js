export class ASTNode {
}
export class IdentifierNode extends ASTNode {
    name;
    constructor(name) {
        super();
        this.name = name;
    }
}
export class StringLiteralNode extends ASTNode {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
export class NumericLiteralNode extends ASTNode {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
export class BinaryExpressionNode extends ASTNode {
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
export class VariableDeclarationNode extends ASTNode {
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
export class FunctionDeclarationNode extends ASTNode {
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
export class IfStatementNode extends ASTNode {
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
export class ReturnStatementNode extends ASTNode {
    argument;
    constructor(argument) {
        super();
        this.argument = argument;
    }
}
export class WhileStatementNode extends ASTNode {
    condition;
    body;
    constructor(condition, body) {
        super();
        this.condition = condition;
        this.body = body;
    }
}
export class ForStatementNode extends ASTNode {
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
export class ExpressionStatementNode extends ASTNode {
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
}
export class CallExpressionNode extends ASTNode {
    callee;
    args;
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.args = args;
    }
}
export class PropertyAccessNode extends ASTNode {
    expression;
    name;
    constructor(expression, name) {
        super();
        this.expression = expression;
        this.name = name;
    }
}
export class AssignmentExpressionNode extends ASTNode {
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
export class ImportDeclarationNode extends ASTNode {
    imports;
    moduleSpecifier;
    constructor(imports, moduleSpecifier) {
        super();
        this.imports = imports;
        this.moduleSpecifier = moduleSpecifier;
    }
}
export class UnaryExpressionNode extends ASTNode {
    operator;
    right;
    constructor(operator, right) {
        super();
        this.operator = operator;
        this.right = right;
    }
}
