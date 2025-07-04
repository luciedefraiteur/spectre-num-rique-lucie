import {Token, TokenType} from './lexer.js';

export abstract class ASTNode
{
    // Base class for all AST nodes
}

export class IdentifierNode extends ASTNode
{
    constructor(public name: string)
    {
        super();
    }
}

export class StringLiteralNode extends ASTNode
{
    constructor(public value: string)
    {
        super();
    }
}

export class NumericLiteralNode extends ASTNode
{
    constructor(public value: number)
    {
        super();
    }
}

export class BinaryExpressionNode extends ASTNode
{
    constructor(public left: ASTNode, public operator: Token, public right: ASTNode)
    {
        super();
    }
}

export class VariableDeclarationNode extends ASTNode
{
    constructor(public keyword: Token, public identifier: IdentifierNode, public initializer?: ASTNode)
    {
        super();
    }
}

export class FunctionDeclarationNode extends ASTNode
{
    constructor(public name: IdentifierNode, public params: IdentifierNode[], public body: ASTNode[])
    {
        super();
    }
}

export class Parser
{
    private readonly tokens: Token[];
    private current: number = 0;

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
        // Add other declaration types (class, interface, etc.)
        return this.statement();
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
            statements.push(this.declaration());
        }
        this.consume(TokenType.Punctuation, '}', 'Expect \'}\' after block.');
        return statements;
    }

    private statement(): ASTNode
    {
        // For now, just consume expressions
        const expr = this.expression();
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after expression.');
        return expr;
    }

    private expression(): ASTNode
    {
        // This is a very simplified expression parser. A real one would handle precedence.
        let expr = this.primary();

        while(this.match(TokenType.Operator))
        {
            const operator = this.previous();
            const right = this.primary();
            expr = new BinaryExpressionNode(expr, operator, right);
        }

        return expr;
    }

    private primary(): ASTNode
    {
        if(this.match(TokenType.Identifier))
        {
            return new IdentifierNode(this.previous().text);
        }
        if(this.match(TokenType.StringLiteral))
        {
            return new StringLiteralNode(this.previous().text);
        }
        if(this.match(TokenType.NumericLiteral))
        {
            return new NumericLiteralNode(parseFloat(this.previous().text));
        }
        // Add other primary expression types
        throw new Error(`Unexpected token: ${ this.peek().text }`);
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
        throw new Error(`${ msg } at line ${ this.peek().line }, column ${ this.peek().column }`);
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