"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.AssignmentExpressionNode = exports.PropertyAccessNode = exports.CallExpressionNode = exports.ExpressionStatementNode = exports.ForStatementNode = exports.WhileStatementNode = exports.ReturnStatementNode = exports.IfStatementNode = exports.FunctionDeclarationNode = exports.VariableDeclarationNode = exports.BinaryExpressionNode = exports.NumericLiteralNode = exports.StringLiteralNode = exports.IdentifierNode = exports.ASTNode = void 0;
var lexer_js_1 = require("./lexer.js");
var ASTNode = /** @class */ (function () {
    function ASTNode() {
    }
    return ASTNode;
}());
exports.ASTNode = ASTNode;
var IdentifierNode = /** @class */ (function (_super) {
    __extends(IdentifierNode, _super);
    function IdentifierNode(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        return _this;
    }
    return IdentifierNode;
}(ASTNode));
exports.IdentifierNode = IdentifierNode;
var StringLiteralNode = /** @class */ (function (_super) {
    __extends(StringLiteralNode, _super);
    function StringLiteralNode(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    return StringLiteralNode;
}(ASTNode));
exports.StringLiteralNode = StringLiteralNode;
var NumericLiteralNode = /** @class */ (function (_super) {
    __extends(NumericLiteralNode, _super);
    function NumericLiteralNode(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    return NumericLiteralNode;
}(ASTNode));
exports.NumericLiteralNode = NumericLiteralNode;
var BinaryExpressionNode = /** @class */ (function (_super) {
    __extends(BinaryExpressionNode, _super);
    function BinaryExpressionNode(left, operator, right) {
        var _this = _super.call(this) || this;
        _this.left = left;
        _this.operator = operator;
        _this.right = right;
        return _this;
    }
    return BinaryExpressionNode;
}(ASTNode));
exports.BinaryExpressionNode = BinaryExpressionNode;
var VariableDeclarationNode = /** @class */ (function (_super) {
    __extends(VariableDeclarationNode, _super);
    function VariableDeclarationNode(keyword, identifier, initializer) {
        var _this = _super.call(this) || this;
        _this.keyword = keyword;
        _this.identifier = identifier;
        _this.initializer = initializer;
        return _this;
    }
    return VariableDeclarationNode;
}(ASTNode));
exports.VariableDeclarationNode = VariableDeclarationNode;
var FunctionDeclarationNode = /** @class */ (function (_super) {
    __extends(FunctionDeclarationNode, _super);
    function FunctionDeclarationNode(name, params, body) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.params = params;
        _this.body = body;
        return _this;
    }
    return FunctionDeclarationNode;
}(ASTNode));
exports.FunctionDeclarationNode = FunctionDeclarationNode;
var IfStatementNode = /** @class */ (function (_super) {
    __extends(IfStatementNode, _super);
    function IfStatementNode(condition, thenBranch, elseBranch) {
        var _this = _super.call(this) || this;
        _this.condition = condition;
        _this.thenBranch = thenBranch;
        _this.elseBranch = elseBranch;
        return _this;
    }
    return IfStatementNode;
}(ASTNode));
exports.IfStatementNode = IfStatementNode;
var ReturnStatementNode = /** @class */ (function (_super) {
    __extends(ReturnStatementNode, _super);
    function ReturnStatementNode(argument) {
        var _this = _super.call(this) || this;
        _this.argument = argument;
        return _this;
    }
    return ReturnStatementNode;
}(ASTNode));
exports.ReturnStatementNode = ReturnStatementNode;
var WhileStatementNode = /** @class */ (function (_super) {
    __extends(WhileStatementNode, _super);
    function WhileStatementNode(condition, body) {
        var _this = _super.call(this) || this;
        _this.condition = condition;
        _this.body = body;
        return _this;
    }
    return WhileStatementNode;
}(ASTNode));
exports.WhileStatementNode = WhileStatementNode;
var ForStatementNode = /** @class */ (function (_super) {
    __extends(ForStatementNode, _super);
    function ForStatementNode(initializer, condition, increment, body) {
        var _this = _super.call(this) || this;
        _this.initializer = initializer;
        _this.condition = condition;
        _this.increment = increment;
        _this.body = body;
        return _this;
    }
    return ForStatementNode;
}(ASTNode));
exports.ForStatementNode = ForStatementNode;
var ExpressionStatementNode = /** @class */ (function (_super) {
    __extends(ExpressionStatementNode, _super);
    function ExpressionStatementNode(expression) {
        var _this = _super.call(this) || this;
        _this.expression = expression;
        return _this;
    }
    return ExpressionStatementNode;
}(ASTNode));
exports.ExpressionStatementNode = ExpressionStatementNode;
var CallExpressionNode = /** @class */ (function (_super) {
    __extends(CallExpressionNode, _super);
    function CallExpressionNode(callee, args) {
        var _this = _super.call(this) || this;
        _this.callee = callee;
        _this.args = args;
        return _this;
    }
    return CallExpressionNode;
}(ASTNode));
exports.CallExpressionNode = CallExpressionNode;
var PropertyAccessNode = /** @class */ (function (_super) {
    __extends(PropertyAccessNode, _super);
    function PropertyAccessNode(expression, name) {
        var _this = _super.call(this) || this;
        _this.expression = expression;
        _this.name = name;
        return _this;
    }
    return PropertyAccessNode;
}(ASTNode));
exports.PropertyAccessNode = PropertyAccessNode;
var AssignmentExpressionNode = /** @class */ (function (_super) {
    __extends(AssignmentExpressionNode, _super);
    function AssignmentExpressionNode(left, operator, right) {
        var _this = _super.call(this) || this;
        _this.left = left;
        _this.operator = operator;
        _this.right = right;
        return _this;
    }
    return AssignmentExpressionNode;
}(ASTNode));
exports.AssignmentExpressionNode = AssignmentExpressionNode;
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this.current = 0;
        this.parseErrors = [];
        this.tokens = tokens.filter(function (t) { return t.type !== lexer_js_1.TokenType.Whitespace && t.type !== lexer_js_1.TokenType.Comment; });
    }
    Parser.prototype.parse = function () {
        var statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }
        return statements;
    };
    Parser.prototype.declaration = function () {
        if (this.match(lexer_js_1.TokenType.Keyword, 'const', 'let', 'var')) {
            return this.variableDeclaration();
        }
        if (this.match(lexer_js_1.TokenType.Keyword, 'function')) {
            return this.functionDeclaration();
        }
        // Add other declaration types (class, interface, etc.)
        return this.statement();
    };
    Parser.prototype.variableDeclaration = function () {
        var keyword = this.previous();
        var name = this.consume(lexer_js_1.TokenType.Identifier, 'Expect variable name.');
        var initializer;
        if (this.match(lexer_js_1.TokenType.Operator, '=')) {
            initializer = this.expression();
        }
        this.consume(lexer_js_1.TokenType.Punctuation, ';', 'Expect \';\' after variable declaration.');
        return new VariableDeclarationNode(keyword, new IdentifierNode(name.text), initializer);
    };
    Parser.prototype.functionDeclaration = function () {
        var name = this.consume(lexer_js_1.TokenType.Identifier, 'Expect function name.');
        this.consume(lexer_js_1.TokenType.Punctuation, '(', 'Expect \'(\' after function name.');
        var parameters = [];
        if (!this.check(lexer_js_1.TokenType.Punctuation, ')')) {
            do {
                parameters.push(new IdentifierNode(this.consume(lexer_js_1.TokenType.Identifier, 'Expect parameter name.').text));
            } while (this.match(lexer_js_1.TokenType.Punctuation, ','));
        }
        this.consume(lexer_js_1.TokenType.Punctuation, ')', 'Expect \')\' after parameters.');
        this.consume(lexer_js_1.TokenType.Punctuation, '{', 'Expect \'{\' before function body.');
        var body = this.block();
        return new FunctionDeclarationNode(new IdentifierNode(name.text), parameters, body);
    };
    Parser.prototype.block = function () {
        var statements = [];
        while (!this.check(lexer_js_1.TokenType.Punctuation, '}') && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        this.consume(lexer_js_1.TokenType.Punctuation, '}', 'Expect \'}\' after block.');
        return statements;
    };
    Parser.prototype.statement = function () {
        if (this.match(lexer_js_1.TokenType.Keyword, 'if')) {
            return this.ifStatement();
        }
        if (this.match(lexer_js_1.TokenType.Keyword, 'return')) {
            return this.returnStatement();
        }
        // For now, just consume expressions
        var expr = this.expression();
        this.consume(lexer_js_1.TokenType.Punctuation, ';', 'Expect \';\' after expression.');
        return expr;
    };
    Parser.prototype.expression = function () {
        // This is a very simplified expression parser. A real one would handle precedence.
        var expr = this.primary();
        while (this.match(lexer_js_1.TokenType.Operator)) {
            var operator = this.previous();
            var right = this.primary();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.primary = function () {
        if (this.match(lexer_js_1.TokenType.Identifier)) {
            return new IdentifierNode(this.previous().text);
        }
        if (this.match(lexer_js_1.TokenType.StringLiteral)) {
            return new StringLiteralNode(this.previous().text);
        }
        if (this.match(lexer_js_1.TokenType.NumericLiteral)) {
            return new NumericLiteralNode(parseFloat(this.previous().text));
        }
        // Add other primary expression types
        throw new Error("Unexpected token: ".concat(this.peek().text));
    };
    Parser.prototype.ifStatement = function () {
        this.consume(lexer_js_1.TokenType.Punctuation, '(', 'Expect \'(\' after \'if\'.');
        var condition = this.expression();
        this.consume(lexer_js_1.TokenType.Punctuation, ')', 'Expect \')\' after if condition.');
        this.consume(lexer_js_1.TokenType.Punctuation, '{', 'Expect \'{\' before then branch.');
        var thenBranch = this.block();
        var elseBranch;
        if (this.match(lexer_js_1.TokenType.Keyword, 'else')) {
            this.consume(lexer_js_1.TokenType.Punctuation, '{', 'Expect \'{\' before else branch.');
            elseBranch = this.block();
        }
        return new IfStatementNode(condition, thenBranch, elseBranch);
    };
    Parser.prototype.returnStatement = function () {
        var value;
        if (!this.check(lexer_js_1.TokenType.Punctuation, ';')) {
            value = this.expression();
        }
        this.consume(lexer_js_1.TokenType.Punctuation, ';', 'Expect \';\' after return value.');
        return new ReturnStatementNode(value);
    };
    Parser.prototype.match = function (type) {
        var text = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            text[_i - 1] = arguments[_i];
        }
        if (this.check(type)) {
            if (text.length === 0 || text.includes(this.peek().text)) {
                this.advance();
                return true;
            }
        }
        return false;
    };
    Parser.prototype.consume = function (type, textOrMessage, message) {
        var text = message ? textOrMessage : undefined;
        var msg = message || textOrMessage;
        if (this.check(type, text)) {
            return this.advance();
        }
        this.parseErrors.push("".concat(msg, " at line ").concat(this.peek().line, ", column ").concat(this.peek().column));
        return this.advance(); // Attempt to advance past the problematic token
    };
    Parser.prototype.check = function (type, text) {
        if (this.isAtEnd())
            return false;
        var peek = this.peek();
        return peek.type === type && (!text || peek.text === text);
    };
    Parser.prototype.advance = function () {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    };
    Parser.prototype.isAtEnd = function () {
        return this.peek().type === lexer_js_1.TokenType.EOF;
    };
    Parser.prototype.peek = function () {
        return this.tokens[this.current];
    };
    Parser.prototype.previous = function () {
        return this.tokens[this.current - 1];
    };
    return Parser;
}());
exports.Parser = Parser;
