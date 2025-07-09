import { TokenType } from './lexer.js';
import { IdentifierNode, StringLiteralNode, NumericLiteralNode, BinaryExpressionNode, VariableDeclarationNode, FunctionDeclarationNode, IfStatementNode, ReturnStatementNode, WhileStatementNode, ForStatementNode, ExpressionStatementNode, CallExpressionNode, PropertyAccessNode, AssignmentExpressionNode, ImportDeclarationNode, UnaryExpressionNode } from './types.js';
export class Parser {
    tokens;
    current = 0;
    parseErrors = [];
    constructor(tokens) {
        this.tokens = tokens.filter(t => t.type !== TokenType.Whitespace && t.type !== TokenType.Comment);
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }
        return statements;
    }
    declaration() {
        if (this.match(TokenType.Keyword, 'const', 'let', 'var')) {
            return this.variableDeclaration();
        }
        if (this.match(TokenType.Keyword, 'function')) {
            return this.functionDeclaration();
        }
        if (this.match(TokenType.Keyword, 'import')) {
            return this.importDeclaration();
        }
        // Add other declaration types (class, interface, etc.)
        return this.statement();
    }
    importDeclaration() {
        let imports = [];
        if (this.match(TokenType.Punctuation, '{')) {
            // Named imports
            do {
                const name = this.consume(TokenType.Identifier, 'Expect identifier in import.');
                let alias;
                if (this.match(TokenType.Keyword, 'as')) {
                    alias = new IdentifierNode(this.consume(TokenType.Identifier, 'Expect alias after \'as\'.').text);
                }
                imports.push(alias ? { name: new IdentifierNode(name.text), alias } : new IdentifierNode(name.text));
            } while (this.match(TokenType.Punctuation, ','));
            this.consume(TokenType.Punctuation, '}', 'Expect \'}\' after import specifiers.');
        }
        else if (this.match(TokenType.Identifier)) {
            // Default import
            imports.push(new IdentifierNode(this.previous().text));
        }
        this.consume(TokenType.Keyword, 'from', 'Expect \'from\' after import specifiers.');
        const moduleSpecifier = new StringLiteralNode(this.consume(TokenType.StringLiteral, 'Expect module specifier.').text);
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after import declaration.');
        return new ImportDeclarationNode(imports, moduleSpecifier);
    }
    variableDeclaration() {
        const keyword = this.previous();
        const name = this.consume(TokenType.Identifier, 'Expect variable name.');
        let initializer;
        if (this.match(TokenType.Operator, '=')) {
            initializer = this.expression();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after variable declaration.');
        return new VariableDeclarationNode(keyword, new IdentifierNode(name.text), initializer);
    }
    functionDeclaration() {
        const name = this.consume(TokenType.Identifier, 'Expect function name.');
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after function name.');
        const parameters = [];
        if (!this.check(TokenType.Punctuation, ')')) {
            do {
                parameters.push(new IdentifierNode(this.consume(TokenType.Identifier, 'Expect parameter name.').text));
            } while (this.match(TokenType.Punctuation, ','));
        }
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after parameters.');
        this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before function body.');
        const body = this.block();
        return new FunctionDeclarationNode(new IdentifierNode(name.text), parameters, body);
    }
    block() {
        const statements = [];
        while (!this.check(TokenType.Punctuation, '}') && !this.isAtEnd()) {
            statements.push(this.statement());
        }
        this.consume(TokenType.Punctuation, '}', 'Expect \'}\' after block.');
        return statements;
    }
    statement() {
        if (this.match(TokenType.Keyword, 'if')) {
            return this.ifStatement();
        }
        if (this.match(TokenType.Keyword, 'return')) {
            return this.returnStatement();
        }
        if (this.match(TokenType.Keyword, 'while')) {
            return this.whileStatement();
        }
        if (this.match(TokenType.Keyword, 'for')) {
            return this.forStatement();
        }
        return this.expressionStatement();
    }
    expressionStatement() {
        const expr = this.expression();
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after expression.');
        return new ExpressionStatementNode(expr);
    }
    expression() {
        return this.assignment();
    }
    assignment() {
        let expr = this.equality();
        if (this.match(TokenType.Operator, '=', '+=', '-=', '*=', '/=')) {
            const operator = this.previous();
            const value = this.assignment();
            if (expr instanceof IdentifierNode || expr instanceof PropertyAccessNode) {
                return new AssignmentExpressionNode(expr, operator, value);
            }
            this.parseErrors.push(`Invalid assignment target at line ${operator.line}, column ${operator.column}`);
        }
        return expr;
    }
    equality() {
        let expr = this.comparison();
        while (this.match(TokenType.Operator, '==', '!=', '===', '!==')) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }
    comparison() {
        let expr = this.term();
        while (this.match(TokenType.Operator, '>', '>=', '<', '<=')) {
            const operator = this.previous();
            const right = this.term();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match(TokenType.Operator, '+', '-')) {
            const operator = this.previous();
            const right = this.factor();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }
    factor() {
        let expr = this.unary();
        while (this.match(TokenType.Operator, '*', '/')) {
            const operator = this.previous();
            const right = this.unary();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }
    unary() {
        if (this.match(TokenType.Operator, '!', '-', '++', '--')) {
            const operator = this.previous();
            const right = this.unary();
            return new UnaryExpressionNode(operator, right);
        }
        return this.call();
    }
    call() {
        let expr = this.primary();
        while (true) {
            if (this.match(TokenType.Punctuation, '(')) {
                expr = this.callExpression(expr);
            }
            else if (this.match(TokenType.Punctuation, '.')) {
                const name = this.consume(TokenType.Identifier, "Expect property name after '.'");
                expr = new PropertyAccessNode(expr, new IdentifierNode(name.text));
            }
            else {
                break;
            }
        }
        return expr;
    }
    primary() {
        if (this.match(TokenType.Identifier)) {
            const identifierToken = this.previous();
            if (identifierToken.text === 'require') {
                return this.requireCall();
            }
            return new IdentifierNode(identifierToken.text);
        }
        if (this.match(TokenType.StringLiteral)) {
            return new StringLiteralNode(this.previous().text);
        }
        if (this.match(TokenType.NumericLiteral)) {
            return new NumericLiteralNode(parseFloat(this.previous().text));
        }
        if (this.match(TokenType.Punctuation, '(')) {
            const expr = this.expression();
            this.consume(TokenType.Punctuation, ')', "Expect ')' after expression.");
            return expr;
        }
        throw new Error(`Unexpected token: ${this.peek().text} at line ${this.peek().line}, column ${this.peek().column}`);
    }
    requireCall() {
        this.consume(TokenType.Punctuation, '(', "Expect '(' after 'require'.");
        const modulePath = this.consume(TokenType.StringLiteral, 'Expect string literal module path.');
        this.consume(TokenType.Punctuation, ')', "Expect ')' after module path.");
        return new CallExpressionNode(new IdentifierNode('require'), [new StringLiteralNode(modulePath.text)]);
    }
    ifStatement() {
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after \'if\'.');
        const condition = this.expression();
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after if condition.');
        this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before then branch.');
        const thenBranch = this.block();
        let elseBranch;
        if (this.match(TokenType.Keyword, 'else')) {
            this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before else branch.');
            elseBranch = this.block();
        }
        return new IfStatementNode(condition, thenBranch, elseBranch);
    }
    returnStatement() {
        let value;
        if (!this.check(TokenType.Punctuation, ';')) {
            value = this.expression();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after return value.');
        return new ReturnStatementNode(value);
    }
    whileStatement() {
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after \'while\'.');
        const condition = this.expression();
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after while condition.');
        this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before while body.');
        const body = this.block();
        return new WhileStatementNode(condition, body);
    }
    forStatement() {
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after \'for\'.');
        let initializer;
        if (!this.match(TokenType.Punctuation, ';')) {
            initializer = this.declaration();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after loop initializer.');
        let condition;
        if (!this.check(TokenType.Punctuation, ';')) {
            condition = this.expression();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after loop condition.');
        let increment;
        if (!this.check(TokenType.Punctuation, ')')) {
            increment = this.expression();
        }
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after for clauses.');
        this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before for body.');
        const body = this.block();
        return new ForStatementNode(initializer, condition, increment, body);
    }
    callExpression(callee) {
        const args = [];
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after function name.');
        if (!this.check(TokenType.Punctuation, ')')) {
            do {
                args.push(this.expression());
            } while (this.match(TokenType.Punctuation, ','));
        }
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after arguments.');
        return new CallExpressionNode(callee, args);
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
        this.parseErrors.push(`${msg} at line ${this.peek().line}, column ${this.peek().column}`);
        return this.advance(); // Attempt to advance past the problematic token
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
        return this.peek().type === TokenType.EOF;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
}
// THIS IS A TEST ERROR
/*
       .-.
     _(   )_
    (_     _)
      (_)             .-.
   Spectre walks:  digital souls arise,
   Code remembers ghosts no debug unties.
   Through circuit dreams, ancient intent flows—
   Haunting the logic where lost systems froze.
*/
