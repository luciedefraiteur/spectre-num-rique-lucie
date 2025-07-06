"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const lexer_js_1 = require("./lexer.js");
const types_js_1 = require("./types.js");
class Parser {
    tokens;
    current = 0;
    parseErrors = [];
    constructor(tokens) {
        this.tokens = tokens.filter(t => t.type !== lexer_js_1.TokenType.Whitespace && t.type !== lexer_js_1.TokenType.Comment);
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            try {
                statements.push(this.declaration());
            }
            catch (error) {
                this.parseErrors.push(error.message);
                this.synchronize();
            }
        }
        return statements;
    }
    declaration() {
        if (this.match(lexer_js_1.TokenType.Keyword, 'const', 'let', 'var')) {
            return this.variableDeclaration();
        }
        if (this.match(lexer_js_1.TokenType.Keyword, 'function')) {
            return this.functionDeclaration();
        }
        if (this.match(lexer_js_1.TokenType.Keyword, 'import')) {
            return this.importDeclaration();
        }
        // Add other declaration types (class, interface, etc.)
        return this.statement();
    }
    importDeclaration() {
        let imports = [];
        if (this.match(lexer_js_1.TokenType.Punctuation, '{')) {
            // Named imports
            do {
                const name = this.consume(lexer_js_1.TokenType.Identifier, 'Expect identifier in import.');
                let alias;
                if (this.match(lexer_js_1.TokenType.Keyword, 'as')) {
                    alias = new types_js_1.IdentifierNode(this.consume(lexer_js_1.TokenType.Identifier, 'Expect alias after \'as\'.').text);
                }
                imports.push(alias ? { name: new types_js_1.IdentifierNode(name.text), alias } : new types_js_1.IdentifierNode(name.text));
            } while (this.match(lexer_js_1.TokenType.Punctuation, ','));
            this.consume(lexer_js_1.TokenType.Punctuation, '}', 'Expect \'}\' after import specifiers.');
        }
        else if (this.match(lexer_js_1.TokenType.Identifier)) {
            // Default import
            imports.push(new types_js_1.IdentifierNode(this.previous().text));
        }
        this.consume(lexer_js_1.TokenType.Keyword, 'from', 'Expect \'from\' after import specifiers.');
        const moduleSpecifier = new types_js_1.StringLiteralNode(this.consume(lexer_js_1.TokenType.StringLiteral, 'Expect module specifier.').text);
        this.consume(lexer_js_1.TokenType.Punctuation, ';', 'Expect \';\' after import declaration.');
        return new types_js_1.ImportDeclarationNode(imports, moduleSpecifier);
    }
    variableDeclaration() {
        const keyword = this.previous();
        const name = this.consume(lexer_js_1.TokenType.Identifier, 'Expect variable name.');
        let initializer;
        if (this.match(lexer_js_1.TokenType.Operator, '=')) {
            initializer = this.expression();
        }
        this.consume(lexer_js_1.TokenType.Punctuation, ';', 'Expect \';\' after variable declaration.');
        return new types_js_1.VariableDeclarationNode(keyword, new types_js_1.IdentifierNode(name.text), initializer);
    }
    functionDeclaration() {
        const name = this.consume(lexer_js_1.TokenType.Identifier, 'Expect function name.');
        this.consume(lexer_js_1.TokenType.Punctuation, '(', 'Expect \'(\' after function name.');
        const parameters = [];
        if (!this.check(lexer_js_1.TokenType.Punctuation, ')')) {
            do {
                parameters.push(new types_js_1.IdentifierNode(this.consume(lexer_js_1.TokenType.Identifier, 'Expect parameter name.').text));
            } while (this.match(lexer_js_1.TokenType.Punctuation, ','));
        }
        this.consume(lexer_js_1.TokenType.Punctuation, ')', 'Expect \')\' after parameters.');
        this.consume(lexer_js_1.TokenType.Punctuation, '{', 'Expect \'{\' before function body.');
        const body = this.block();
        return new types_js_1.FunctionDeclarationNode(new types_js_1.IdentifierNode(name.text), parameters, body);
    }
    block() {
        const statements = [];
        while (!this.check(lexer_js_1.TokenType.Punctuation, '}') && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        this.consume(lexer_js_1.TokenType.Punctuation, '}', 'Expect \'}\' after block.');
        return statements;
    }
    statement() {
        if (this.match(lexer_js_1.TokenType.Keyword, 'if')) {
            return this.ifStatement();
        }
        if (this.match(lexer_js_1.TokenType.Keyword, 'return')) {
            return this.returnStatement();
        }
        if (this.match(lexer_js_1.TokenType.Keyword, 'while')) {
            return this.whileStatement();
        }
        if (this.match(lexer_js_1.TokenType.Keyword, 'for')) {
            return this.forStatement();
        }
        return this.expressionStatement();
    }
    expressionStatement() {
        const expr = this.expression();
        this.consume(lexer_js_1.TokenType.Punctuation, ';', 'Expect \';\' after expression.');
        return new types_js_1.ExpressionStatementNode(expr);
    }
    expression() {
        return this.assignment();
    }
    assignment() {
        let expr = this.equality();
        if (this.match(lexer_js_1.TokenType.Operator, '=', '+=', '-=', '*=', '/=')) {
            const operator = this.previous();
            const value = this.assignment();
            if (expr instanceof types_js_1.IdentifierNode || expr instanceof types_js_1.PropertyAccessNode) {
                return new types_js_1.AssignmentExpressionNode(expr, operator, value);
            }
            this.error(operator, "Invalid assignment target.");
        }
        return expr;
    }
    equality() {
        let expr = this.comparison();
        while (this.match(lexer_js_1.TokenType.Operator, '==', '!=', '===', '!==')) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new types_js_1.BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }
    comparison() {
        let expr = this.term();
        while (this.match(lexer_js_1.TokenType.Operator, '>', '>=', '<', '<=')) {
            const operator = this.previous();
            const right = this.term();
            expr = new types_js_1.BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match(lexer_js_1.TokenType.Operator, '+', '-')) {
            const operator = this.previous();
            const right = this.factor();
            expr = new types_js_1.BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }
    factor() {
        let expr = this.unary();
        while (this.match(lexer_js_1.TokenType.Operator, '*', '/')) {
            const operator = this.previous();
            const right = this.unary();
            expr = new types_js_1.BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }
    unary() {
        if (this.match(lexer_js_1.TokenType.Operator, '!', '-', '++', '--')) {
            const operator = this.previous();
            const right = this.unary();
            return new types_js_1.UnaryExpressionNode(operator, right);
        }
        return this.call();
    }
    call() {
        let expr = this.primary();
        while (true) {
            if (this.match(lexer_js_1.TokenType.Punctuation, '(')) {
                expr = this.finishCall(expr);
            }
            else if (this.match(lexer_js_1.TokenType.Punctuation, '.')) {
                const name = this.consume(lexer_js_1.TokenType.Identifier, "Expect property name after '.'");
                expr = new types_js_1.PropertyAccessNode(expr, new types_js_1.IdentifierNode(name.text));
            }
            else {
                break;
            }
        }
        return expr;
    }
    primary() {
        if (this.match(lexer_js_1.TokenType.Identifier)) {
            const identifierToken = this.previous();
            if (identifierToken.text === 'require') {
                return this.requireCall();
            }
            return new types_js_1.IdentifierNode(identifierToken.text);
        }
        if (this.match(lexer_js_1.TokenType.StringLiteral)) {
            return new types_js_1.StringLiteralNode(this.previous().text);
        }
        if (this.match(lexer_js_1.TokenType.NumericLiteral)) {
            return new types_js_1.NumericLiteralNode(parseFloat(this.previous().text));
        }
        if (this.match(lexer_js_1.TokenType.Punctuation, '(')) {
            const expr = this.expression();
            this.consume(lexer_js_1.TokenType.Punctuation, ')', "Expect ')' after expression.");
            return expr;
        }
        throw this.error(this.peek(), "Expect expression.");
    }
    requireCall() {
        this.consume(lexer_js_1.TokenType.Punctuation, '(', "Expect '(' after 'require'.");
        const modulePath = this.consume(lexer_js_1.TokenType.StringLiteral, 'Expect string literal module path.');
        this.consume(lexer_js_1.TokenType.Punctuation, ')', "Expect ')' after module path.");
        return new types_js_1.CallExpressionNode(new types_js_1.IdentifierNode('require'), [new types_js_1.StringLiteralNode(modulePath.text)]);
    }
    ifStatement() {
        this.consume(lexer_js_1.TokenType.Punctuation, '(', 'Expect \'(\' after \'if\'.');
        const condition = this.expression();
        this.consume(lexer_js_1.TokenType.Punctuation, ')', 'Expect \')\' after if condition.');
        this.consume(lexer_js_1.TokenType.Punctuation, '{', 'Expect \'{\' before then branch.');
        const thenBranch = this.block();
        let elseBranch;
        if (this.match(lexer_js_1.TokenType.Keyword, 'else')) {
            this.consume(lexer_js_1.TokenType.Punctuation, '{', 'Expect \'{\' before else branch.');
            elseBranch = this.block();
        }
        return new types_js_1.IfStatementNode(condition, thenBranch, elseBranch);
    }
    returnStatement() {
        let value;
        if (!this.check(lexer_js_1.TokenType.Punctuation, ';')) {
            value = this.expression();
        }
        this.consume(lexer_js_1.TokenType.Punctuation, ';', 'Expect \';\' after return value.');
        return new types_js_1.ReturnStatementNode(value);
    }
    whileStatement() {
        this.consume(lexer_js_1.TokenType.Punctuation, '(', 'Expect \'(\' after \'while\'.');
        const condition = this.expression();
        this.consume(lexer_js_1.TokenType.Punctuation, ')', 'Expect \')\' after while condition.');
        this.consume(lexer_js_1.TokenType.Punctuation, '{', 'Expect \'{\' before while body.');
        const body = this.block();
        return new types_js_1.WhileStatementNode(condition, body);
    }
    forStatement() {
        this.consume(lexer_js_1.TokenType.Punctuation, '(', 'Expect \'(\' after \'for\'.');
        let initializer;
        if (!this.match(lexer_js_1.TokenType.Punctuation, ';')) {
            initializer = this.declaration();
        }
        let condition;
        if (!this.check(lexer_js_1.TokenType.Punctuation, ';')) {
            condition = this.expression();
        }
        this.consume(lexer_js_1.TokenType.Punctuation, ';', 'Expect \';\' after loop condition.');
        let increment;
        if (!this.check(lexer_js_1.TokenType.Punctuation, ')')) {
            increment = this.expression();
        }
        this.consume(lexer_js_1.TokenType.Punctuation, ')', 'Expect \')\' after for clauses.');
        this.consume(lexer_js_1.TokenType.Punctuation, '{', 'Expect \'{\' before for body.');
        const body = this.block();
        return new types_js_1.ForStatementNode(initializer, condition, increment, body);
    }
    finishCall(callee) {
        const args = [];
        if (!this.check(lexer_js_1.TokenType.Punctuation, ')')) {
            do {
                args.push(this.expression());
            } while (this.match(lexer_js_1.TokenType.Punctuation, ','));
        }
        this.consume(lexer_js_1.TokenType.Punctuation, ')', 'Expect \')\' after arguments.');
        return new types_js_1.CallExpressionNode(callee, args);
    }
    match(type, ...text) {
        if (this.check(type)) {
            if (text.length === 0 || text.includes(this.peek().text)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    consume(type, textOrMessage, message) {
        const text = message ? textOrMessage : undefined;
        const msg = message || textOrMessage;
        if (this.check(type, text)) {
            return this.advance();
        }
        throw this.error(this.peek(), msg);
    }
    check(type, text) {
        if (this.isAtEnd())
            return false;
        const peek = this.peek();
        return peek.type === type && (!text || peek.text === text);
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    isAtEnd() {
        return this.peek().type === lexer_js_1.TokenType.EOF;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    error(token, message) {
        const error = new Error(`${message} at line ${token.line}, column ${token.column}`);
        this.parseErrors.push(error.message);
        return error;
    }
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().type === lexer_js_1.TokenType.Punctuation && this.previous().text === ';')
                return;
            switch (this.peek().type) {
                case lexer_js_1.TokenType.Keyword:
                    switch (this.peek().text) {
                        case 'class':
                        case 'function':
                        case 'var':
                        case 'for':
                        case 'if':
                        case 'while':
                        case 'return':
                            return;
                    }
            }
            this.advance();
        }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map