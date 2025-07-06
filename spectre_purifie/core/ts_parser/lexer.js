"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Keyword"] = 0] = "Keyword";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["StringLiteral"] = 2] = "StringLiteral";
    TokenType[TokenType["NumericLiteral"] = 3] = "NumericLiteral";
    TokenType[TokenType["Operator"] = 4] = "Operator";
    TokenType[TokenType["Punctuation"] = 5] = "Punctuation";
    TokenType[TokenType["Comment"] = 6] = "Comment";
    TokenType[TokenType["Whitespace"] = 7] = "Whitespace";
    TokenType[TokenType["EOF"] = 8] = "EOF";
})(TokenType || (exports.TokenType = TokenType = {}));
class Lexer {
    source;
    position = 0;
    line = 1;
    column = 1;
    constructor(source) {
        this.source = source;
    }
    tokenize() {
        const tokens = [];
        while (!this.isAtEnd()) {
            const token = this.scanToken();
            if (token) {
                tokens.push(token);
            }
        }
        tokens.push({ type: TokenType.EOF, text: '', line: this.line, column: this.column });
        return tokens;
    }
    scanToken() {
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
            case '(': return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column - 1 };
            case ')': return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column - 1 };
            case '{': return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column - 1 };
            case '}': return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column - 1 };
            case '[': return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column - 1 };
            case ']': return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column - 1 };
            case ';': return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column - 1 };
            case ',': return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column - 1 };
            case '.': return { type: TokenType.Punctuation, text: char, line: this.line, column: this.column - 1 };
            case '+':
                if (this.matchAndAdvance('+'))
                    return { type: TokenType.Operator, text: '++', line: this.line, column: this.column - 2 };
                if (this.matchAndAdvance('='))
                    return { type: TokenType.Operator, text: '+=', line: this.line, column: this.column - 2 };
                return { type: TokenType.Operator, text: char, line: this.line, column: this.column - 1 };
            case '-':
                if (this.matchAndAdvance('-'))
                    return { type: TokenType.Operator, text: '--', line: this.line, column: this.column - 2 };
                if (this.matchAndAdvance('='))
                    return { type: TokenType.Operator, text: '-=', line: this.line, column: this.column - 2 };
                return { type: TokenType.Operator, text: char, line: this.line, column: this.column - 1 };
            case '*':
                if (this.matchAndAdvance('='))
                    return { type: TokenType.Operator, text: '*=', line: this.line, column: this.column - 2 };
                return { type: TokenType.Operator, text: char, line: this.line, column: this.column - 1 };
            case '/':
                if (this.matchAndAdvance('='))
                    return { type: TokenType.Operator, text: '/=', line: this.line, column: this.column - 2 };
                return { type: TokenType.Operator, text: char, line: this.line, column: this.column - 1 };
            case '=':
                if (this.matchAndAdvance('=')) {
                    if (this.matchAndAdvance('='))
                        return { type: TokenType.Operator, text: '===', line: this.line, column: this.column - 3 };
                    return { type: TokenType.Operator, text: '==', line: this.line, column: this.column - 2 };
                }
                return { type: TokenType.Operator, text: char, line: this.line, column: this.column - 1 };
            case '!':
                if (this.matchAndAdvance('=')) {
                    if (this.matchAndAdvance('='))
                        return { type: TokenType.Operator, text: '!==', line: this.line, column: this.column - 3 };
                    return { type: TokenType.Operator, text: '!=', line: this.line, column: this.column - 2 };
                }
                return { type: TokenType.Operator, text: char, line: this.line, column: this.column - 1 };
            case '>':
                if (this.matchAndAdvance('='))
                    return { type: TokenType.Operator, text: '>=', line: this.line, column: this.column - 2 };
                return { type: TokenType.Operator, text: char, line: this.line, column: this.column - 1 };
            case '<':
                if (this.matchAndAdvance('='))
                    return { type: TokenType.Operator, text: '<=', line: this.line, column: this.column - 2 };
                return { type: TokenType.Operator, text: char, line: this.line, column: this.column - 1 };
            case '&':
                if (this.matchAndAdvance('&'))
                    return { type: TokenType.Operator, text: '&&', line: this.line, column: this.column - 2 };
                break; // Fall through for single '&' if needed later
            case '|':
                if (this.matchAndAdvance('|'))
                    return { type: TokenType.Operator, text: '||', line: this.line, column: this.column - 2 };
                break; // Fall through for single '|' if needed later
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
                // Error handling for unexpected characters
                throw new Error(`Unexpected character: ${char} at line ${this.line}, column ${this.column - 1}`);
        }
    }
    identifier() {
        const start = this.position - 1;
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }
        const text = this.source.substring(start, this.position);
        const type = this.isKeyword(text) ? TokenType.Keyword : TokenType.Identifier;
        return { type, text, line: this.line, column: this.column - text.length };
    }
    numericLiteral() {
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
    stringLiteral(quote) {
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
    lineComment() {
        const start = this.position - 1;
        while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
        }
        const text = this.source.substring(start, this.position);
        return { type: TokenType.Comment, text, line: this.line, column: this.column - text.length };
    }
    blockComment() {
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
    isKeyword(text) {
        const keywords = ['const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'function', 'class', 'import', 'export', 'from', 'async', 'await', 'require'];
        return keywords.includes(text);
    }
    isAlpha(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
    }
    isDigit(char) {
        return char >= '0' && char <= '9';
    }
    isAlphaNumeric(char) {
        return this.isAlpha(char) || this.isDigit(char);
    }
    advance() {
        this.column++;
        return this.source.charAt(this.position++);
    }
    peek() {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.position);
    }
    peekNext() {
        if (this.position + 1 >= this.source.length)
            return '\0';
        return this.source.charAt(this.position + 1);
    }
    matchAndAdvance(expected) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.position) !== expected)
            return false;
        this.position++;
        this.column++;
        return true;
    }
    isAtEnd() {
        return this.position >= this.source.length;
    }
}
exports.Lexer = Lexer;
//# sourceMappingURL=lexer.js.map