export enum TokenType {
    Keyword,
    Identifier,
    StringLiteral,
    NumericLiteral,
    Operator,
    Punctuation,
    Comment,
    Whitespace,
    EOF,
}

export interface Token {
    type: TokenType;
    text: string;
    line: number;
    column: number;
}

export class Lexer {
    private readonly source: string;
    private position: number = 0;
    private line: number = 1;
    private column: number = 1;

    constructor(source: string) {
        this.source = source;
    }

    public tokenize(): Token[] {
        const tokens: Token[] = [];
        while (!this.isAtEnd()) {
            const token = this.scanToken();
            if (token) {
                tokens.push(token);
            }
        }
        tokens.push({ type: TokenType.EOF, text: '', line: this.line, column: this.column });
        return tokens;
    }

    private scanToken(): Token | undefined {
        const char = this.advance();
        switch (char) {
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace
                break;
            case '\n':
                this.line++;
                this.column = 1;
                break;
            // Add cases for other characters (operators, punctuation, etc.)
            default:
                if (this.isAlpha(char)) {
                    return this.identifier();
                }
                if (this.isDigit(char)) {
                    return this.numericLiteral();
                }
                if (char === '"' || char === "'") {
                    return this.stringLiteral(char);
                }
                // Handle comments
                if (char === '/' && this.peek() === '/') {
                    return this.lineComment();
                }
                if (char === '/' && this.peek() === '*') {
                    return this.blockComment();
                }
                // For now, just return a generic punctuation token
                return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column };
        }
    }

    private identifier(): Token {
        const start = this.position - 1;
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }
        const text = this.source.substring(start, this.position);
        const type = this.isKeyword(text) ? TokenType.Keyword : TokenType.Identifier;
        return { type, text, line: this.line, column: this.column - text.length };
    }

    private numericLiteral(): Token {
        const start = this.position - 1;
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }
        const text = this.source.substring(start, this.position);
        return { type: TokenType.NumericLiteral, text, line: this.line, column: this.column - text.length };
    }

    private stringLiteral(quote: string): Token {
        const start = this.position;
        while (this.peek() !== quote && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 1;
            }
            this.advance();
        }
        this.advance(); // consume the closing quote
        const text = this.source.substring(start, this.position - 1);
        return { type: TokenType.StringLiteral, text, line: this.line, column: this.column - text.length - 2 };
    }

    private lineComment(): Token {
        const start = this.position - 1;
        while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
        }
        const text = this.source.substring(start, this.position);
        return { type: TokenType.Comment, text, line: this.line, column: this.column - text.length };
    }

    private blockComment(): Token {
        const start = this.position - 1;
        while (!(this.peek() === '*' && this.peekNext() === '/') && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 1;
            }
            this.advance();
        }
        this.advance(); // consume *
        this.advance(); // consume /
        const text = this.source.substring(start, this.position);
        return { type: TokenType.Comment, text, line: this.line, column: this.column - text.length };
    }

    private isKeyword(text: string): boolean {
        const keywords = ['const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'function', 'class', 'import', 'export', 'from', 'async', 'await'];
        return keywords.includes(text);
    }

    private isAlpha(char: string): boolean {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
    }

    private isDigit(char: string): boolean {
        return char >= '0' && char <= '9';
    }

    private isAlphaNumeric(char: string): boolean {
        return this.isAlpha(char) || this.isDigit(char);
    }

    private advance(): string {
        this.column++;
        return this.source.charAt(this.position++);
    }

    private peek(): string {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.position);
    }

    private peekNext(): string {
        if (this.position + 1 >= this.source.length) return '\0';
        return this.source.charAt(this.position + 1);
    }

    private isAtEnd(): boolean {
        return this.position >= this.source.length;
    }
}