import {Token, TokenType} from './lexer.js';
import {ASTNode, IdentifierNode, StringLiteralNode, NumericLiteralNode, BinaryExpressionNode, VariableDeclarationNode, FunctionDeclarationNode, IfStatementNode, ReturnStatementNode, WhileStatementNode, ForStatementNode, ExpressionStatementNode, CallExpressionNode, PropertyAccessNode, AssignmentExpressionNode, ImportDeclarationNode, UnaryExpressionNode} from './types.js';



export class Parser
{
    private readonly tokens: Token[];
    private current: number = 0;
    public parseErrors: string[] = [];

    constructor(tokens: Token[])
    {
        this.tokens = tokens.filter(t => t.type !== TokenType.Whitespace && t.type !== TokenType.Comment);
    }

    public parse(): ASTNode[]
    {
        const statements: ASTNode[] = [];
        while(!this.isAtEnd())
        {
            statements.push(this.declaration());
        }
        return statements;
    }

    private declaration(): ASTNode
    {
        if(this.match(TokenType.Keyword, 'const', 'let', 'var'))
        {
            return this.variableDeclaration();
        }
        if(this.match(TokenType.Keyword, 'function'))
        {
            return this.functionDeclaration();
        }
        if(this.match(TokenType.Keyword, 'import'))
        {
            return this.importDeclaration();
        }
        // Add other declaration types (class, interface, etc.)
        return this.statement();
    }

    private importDeclaration(): ASTNode
    {
        let imports: (IdentifierNode | {alias: IdentifierNode, name: IdentifierNode})[] = [];
        if(this.match(TokenType.Punctuation, '{'))
        {
            // Named imports
            do
            {
                const name = this.consume(TokenType.Identifier, 'Expect identifier in import.');
                let alias: IdentifierNode | undefined;
                if(this.match(TokenType.Keyword, 'as'))
                {
                    alias = new IdentifierNode(this.consume(TokenType.Identifier, 'Expect alias after \'as\'.').text);
                }
                imports.push(alias ? {name: new IdentifierNode(name.text), alias} : new IdentifierNode(name.text));
            } while(this.match(TokenType.Punctuation, ','));
            this.consume(TokenType.Punctuation, '}', 'Expect \'}\' after import specifiers.');
        } else if(this.match(TokenType.Identifier))
        {
            // Default import
            imports.push(new IdentifierNode(this.previous().text));
        }

        this.consume(TokenType.Keyword, 'from', 'Expect \'from\' after import specifiers.');
        const moduleSpecifier = new StringLiteralNode(this.consume(TokenType.StringLiteral, 'Expect module specifier.').text);
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after import declaration.');

        return new ImportDeclarationNode(imports, moduleSpecifier);
    }

    private variableDeclaration(): ASTNode
    {
        const keyword = this.previous();
        const name = this.consume(TokenType.Identifier, 'Expect variable name.');
        let initializer;
        if(this.match(TokenType.Operator, '='))
        {
            initializer = this.expression();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after variable declaration.');
        return new VariableDeclarationNode(keyword, new IdentifierNode(name.text), initializer);
    }

    private functionDeclaration(): ASTNode
    {
        const name = this.consume(TokenType.Identifier, 'Expect function name.');
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after function name.');
        const parameters: IdentifierNode[] = [];
        if(!this.check(TokenType.Punctuation, ')'))
        {
            do
            {
                parameters.push(new IdentifierNode(this.consume(TokenType.Identifier, 'Expect parameter name.').text));
            } while(this.match(TokenType.Punctuation, ','));
        }
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after parameters.');
        this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before function body.');
        const body = this.block();
        return new FunctionDeclarationNode(new IdentifierNode(name.text), parameters, body);
    }

    private block(): ASTNode[]
    {
        const statements: ASTNode[] = [];
        while(!this.check(TokenType.Punctuation, '}') && !this.isAtEnd())
        {
            statements.push(this.statement());
        }
        this.consume(TokenType.Punctuation, '}', 'Expect \'}\' after block.');
        return statements;
    }

    private statement(): ASTNode
    {
        if(this.match(TokenType.Keyword, 'if'))
        {
            return this.ifStatement();
        }
        if(this.match(TokenType.Keyword, 'return'))
        {
            return this.returnStatement();
        }
        if(this.match(TokenType.Keyword, 'while'))
        {
            return this.whileStatement();
        }
        if(this.match(TokenType.Keyword, 'for'))
        {
            return this.forStatement();
        }
        return this.expressionStatement();
    }

    private expressionStatement(): ASTNode
    {
        const expr = this.expression();
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after expression.');
        return new ExpressionStatementNode(expr);
    }

    private expression(): ASTNode
    {
        return this.assignment();
    }

    private assignment(): ASTNode
    {
        let expr = this.equality();

        if(this.match(TokenType.Operator, '=', '+=', '-=', '*=', '/='))
        {
            const operator = this.previous();
            const value = this.assignment();
            if(expr instanceof IdentifierNode || expr instanceof PropertyAccessNode)
            {
                return new AssignmentExpressionNode(expr, operator, value);
            }
            this.parseErrors.push(`Invalid assignment target at line ${ operator.line }, column ${ operator.column }`);
        }
        return expr;
    }

    private equality(): ASTNode
    {
        let expr = this.comparison();

        while(this.match(TokenType.Operator, '==', '!=', '===', '!=='))
        {
            const operator = this.previous();
            const right = this.comparison();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }

    private comparison(): ASTNode
    {
        let expr = this.term();

        while(this.match(TokenType.Operator, '>', '>=', '<', '<='))
        {
            const operator = this.previous();
            const right = this.term();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }

    private term(): ASTNode
    {
        let expr = this.factor();

        while(this.match(TokenType.Operator, '+', '-'))
        {
            const operator = this.previous();
            const right = this.factor();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }

    private factor(): ASTNode
    {
        let expr = this.unary();

        while(this.match(TokenType.Operator, '*', '/'))
        {
            const operator = this.previous();
            const right = this.unary();
            expr = new BinaryExpressionNode(expr, operator, right);
        }
        return expr;
    }

    private unary(): ASTNode
    {
        if(this.match(TokenType.Operator, '!', '-', '++', '--'))
        {
            const operator = this.previous();
            const right = this.unary();
            return new UnaryExpressionNode(operator, right);
        }
        return this.call();
    }

    private call(): ASTNode
    {
        let expr = this.primary();

        while(true)
        {
            if(this.match(TokenType.Punctuation, '('))
            {
                expr = this.callExpression(expr);
            } else if(this.match(TokenType.Punctuation, '.'))
            {
                const name = this.consume(TokenType.Identifier, "Expect property name after '.'");
                expr = new PropertyAccessNode(expr, new IdentifierNode(name.text));
            } else
            {
                break;
            }
        }
        return expr;
    }

    private primary(): ASTNode
    {
        if(this.match(TokenType.Identifier))
        {
            const identifierToken = this.previous();
            if(identifierToken.text === 'require')
            {
                return this.requireCall();
            }
            return new IdentifierNode(identifierToken.text);
        }
        if(this.match(TokenType.StringLiteral))
        {
            return new StringLiteralNode(this.previous().text);
        }
        if(this.match(TokenType.NumericLiteral))
        {
            return new NumericLiteralNode(parseFloat(this.previous().text));
        }
        if(this.match(TokenType.Punctuation, '('))
        {
            const expr = this.expression();
            this.consume(TokenType.Punctuation, ')', "Expect ')' after expression.");
            return expr;
        }
        throw new Error(`Unexpected token: ${ this.peek().text } at line ${ this.peek().line }, column ${ this.peek().column }`);
    }

    private requireCall(): ASTNode
    {
        this.consume(TokenType.Punctuation, '(', "Expect '(' after 'require'.");
        const modulePath = this.consume(TokenType.StringLiteral, 'Expect string literal module path.');
        this.consume(TokenType.Punctuation, ')', "Expect ')' after module path.");
        return new CallExpressionNode(new IdentifierNode('require'), [new StringLiteralNode(modulePath.text)]);
    }

    private ifStatement(): ASTNode
    {
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after \'if\'.');
        const condition = this.expression();
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after if condition.');
        this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before then branch.');
        const thenBranch = this.block();
        let elseBranch;
        if(this.match(TokenType.Keyword, 'else'))
        {
            this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before else branch.');
            elseBranch = this.block();
        }
        return new IfStatementNode(condition, thenBranch, elseBranch);
    }

    private returnStatement(): ASTNode
    {
        let value;
        if(!this.check(TokenType.Punctuation, ';'))
        {
            value = this.expression();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after return value.');
        return new ReturnStatementNode(value);
    }

    private whileStatement(): ASTNode
    {
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after \'while\'.');
        const condition = this.expression();
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after while condition.');
        this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before while body.');
        const body = this.block();
        return new WhileStatementNode(condition, body);
    }

    private forStatement(): ASTNode
    {
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after \'for\'.');
        let initializer: ASTNode | undefined;
        if(!this.match(TokenType.Punctuation, ';'))
        {
            initializer = this.declaration();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after loop initializer.');

        let condition: ASTNode | undefined;
        if(!this.check(TokenType.Punctuation, ';'))
        {
            condition = this.expression();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after loop condition.');

        let increment: ASTNode | undefined;
        if(!this.check(TokenType.Punctuation, ')'))
        {
            increment = this.expression();
        }
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after for clauses.');

        this.consume(TokenType.Punctuation, '{', 'Expect \'{\' before for body.');
        const body = this.block();

        return new ForStatementNode(initializer, condition, increment, body);
    }

    private callExpression(callee: ASTNode): ASTNode
    {
        const args: ASTNode[] = [];
        this.consume(TokenType.Punctuation, '(', 'Expect \'(\' after function name.');
        if(!this.check(TokenType.Punctuation, ')'))
        {
            do
            {
                args.push(this.expression());
            } while(this.match(TokenType.Punctuation, ','));
        }
        this.consume(TokenType.Punctuation, ')', 'Expect \')\' after arguments.');
        return new CallExpressionNode(callee, args);
    }

    private match(type: TokenType, ...text: string[]): boolean
    {
        if(this.check(type))
        {
            if(text.length === 0 || text.includes(this.peek().text))
            {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private consume(type: TokenType, message: string): Token;
    private consume(type: TokenType, text: string, message: string): Token;
    private consume(type: TokenType, textOrMessage: string, message?: string): Token
    {
        const text = message ? textOrMessage : undefined;
        const msg = message || textOrMessage;
        if(this.check(type, text))
        {
            return this.advance();
        }
        this.parseErrors.push(`${ msg } at line ${ this.peek().line }, column ${ this.peek().column }`);
        return this.advance(); // Attempt to advance past the problematic token
    }

    private check(type: TokenType, text?: string): boolean
    {
        if(this.isAtEnd()) return false;
        const peek = this.peek();
        return peek.type === type && (!text || peek.text === text);
    }

    private advance(): Token
    {
        if(!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean
    {
        return this.peek().type === TokenType.EOF;
    }

    private peek(): Token
    {
        return this.tokens[this.current];
    }

    private previous(): Token
    {
        return this.tokens[this.current - 1];
    }
}