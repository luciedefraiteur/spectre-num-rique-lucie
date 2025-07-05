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

export class IfStatementNode extends ASTNode
{
    constructor(public condition: ASTNode, public thenBranch: ASTNode[], public elseBranch?: ASTNode[])
    {
        super();
    }
}

export class ReturnStatementNode extends ASTNode
{
    constructor(public argument?: ASTNode)
    {
        super();
    }
}

export class WhileStatementNode extends ASTNode
{
    constructor(public condition: ASTNode, public body: ASTNode[])
    {
        super();
    }
}

export class ForStatementNode extends ASTNode
{
    constructor(public initializer: ASTNode | undefined, public condition: ASTNode | undefined, public increment: ASTNode | undefined, public body: ASTNode[])
    {
        super();
    }
}

export class ExpressionStatementNode extends ASTNode
{
    constructor(public expression: ASTNode)
    {
        super();
    }
}

export class CallExpressionNode extends ASTNode
{
    constructor(public callee: ASTNode, public args: ASTNode[])
    {
        super();
    }
}

export class PropertyAccessNode extends ASTNode
{
    constructor(public expression: ASTNode, public name: IdentifierNode)
    {
        super();
    }
}

export class AssignmentExpressionNode extends ASTNode
{
    constructor(public left: ASTNode, public operator: Token, public right: ASTNode)
    {
        super();
    }
}

export class ImportDeclarationNode extends ASTNode
{
    constructor(public imports: (IdentifierNode | { alias: IdentifierNode, name: IdentifierNode })[], public moduleSpecifier: StringLiteralNode)
    {
        super();
    }
}

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
        let imports: (IdentifierNode | { alias: IdentifierNode, name: IdentifierNode })[] = [];
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
                imports.push(alias ? { name: new IdentifierNode(name.text), alias } : new IdentifierNode(name.text));
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

    private expressionStatement(): ASTNode
    {
        const expr = this.expression();
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after expression.');
        return new ExpressionStatementNode(expr);
    }

    private expression(): ASTNode
    {
        // This is a very simplified expression parser. A real one would handle precedence.
        let expr = this.primary();

        while (true) {
            if (this.match(TokenType.Punctuation, '(')) {
                expr = this.callExpression(expr);
            } else if (this.match(TokenType.Punctuation, '.')) {
                const name = this.consume(TokenType.Identifier, 'Expect property name after \'.\'.');
                expr = new PropertyAccessNode(expr, new IdentifierNode(name.text));
            } else if (this.match(TokenType.Operator)) {
                const operator = this.previous();
                const right = this.primary();
                expr = new BinaryExpressionNode(expr, operator, right);
            } else {
                break;
            }
        }

        if (this.match(TokenType.Operator, '=')) {
            const operator = this.previous();
            const value = this.expression();
            return new AssignmentExpressionNode(expr, operator, value);
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

    private ifStatement(): ASTNode
    {
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

    private returnStatement(): ASTNode
    {
        let value;
        if (!this.check(TokenType.Punctuation, ';')) {
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
        if (!this.match(TokenType.Punctuation, ';')) {
            initializer = this.declaration();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after loop initializer.');

        let condition: ASTNode | undefined;
        if (!this.check(TokenType.Punctuation, ';')) {
            condition = this.expression();
        }
        this.consume(TokenType.Punctuation, ';', 'Expect \';\' after loop condition.');

        let increment: ASTNode | undefined;
        if (!this.check(TokenType.Punctuation, ')')) {
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
        if (!this.check(TokenType.Punctuation, ')')) {
            do {
                args.push(this.expression());
            } while (this.match(TokenType.Punctuation, ','));
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