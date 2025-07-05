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
var Lexer = /** @class */ (function () {
    function Lexer(source) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.source = source;
    }
    Lexer.prototype.tokenize = function () {
        var tokens = [];
        while (!this.isAtEnd()) {
            var token = this.scanToken();
            if (token) {
                tokens.push(token);
            }
        }
        tokens.push({ type: TokenType.EOF, text: '', line: this.line, column: this.column });
        return tokens;
    };
    Lexer.prototype.scanToken = function () {
        var char = this.advance();
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
    };
    Lexer.prototype.identifier = function () {
        var start = this.position - 1;
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }
        var text = this.source.substring(start, this.position);
        var type = this.isKeyword(text) ? TokenType.Keyword : TokenType.Identifier;
        return { type: type, text: text, line: this.line, column: this.column - text.length };
    };
    Lexer.prototype.numericLiteral = function () {
        var start = this.position - 1;
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }
        var text = this.source.substring(start, this.position);
        return { type: TokenType.NumericLiteral, text: text, line: this.line, column: this.column - text.length };
    };
    Lexer.prototype.stringLiteral = function (quote) {
        var start = this.position;
        while (this.peek() !== quote && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 1;
            }
            this.advance();
        }
        this.advance(); // consume the closing quote
        var text = this.source.substring(start, this.position - 1);
        return { type: TokenType.StringLiteral, text: text, line: this.line, column: this.column - text.length - 2 };
    };
    Lexer.prototype.lineComment = function () {
        var start = this.position - 1;
        while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
        }
        var text = this.source.substring(start, this.position);
        return { type: TokenType.Comment, text: text, line: this.line, column: this.column - text.length };
    };
    Lexer.prototype.blockComment = function () {
        var start = this.position - 1;
        while (!(this.peek() === '*' && this.peekNext() === '/') && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 1;
            }
            this.advance();
        }
        this.advance(); // consume *
        this.advance(); // consume /
        var text = this.source.substring(start, this.position);
        return { type: TokenType.Comment, text: text, line: this.line, column: this.column - text.length };
    };
    Lexer.prototype.isKeyword = function (text) {
        var keywords = ['const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'function', 'class', 'import', 'export', 'from', 'async', 'await'];
        return keywords.includes(text);
    };
    Lexer.prototype.isAlpha = function (char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
    };
    Lexer.prototype.isDigit = function (char) {
        return char >= '0' && char <= '9';
    };
    Lexer.prototype.isAlphaNumeric = function (char) {
        return this.isAlpha(char) || this.isDigit(char);
    };
    Lexer.prototype.advance = function () {
        this.column++;
        return this.source.charAt(this.position++);
    };
    Lexer.prototype.peek = function () {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.position);
    };
    Lexer.prototype.peekNext = function () {
        if (this.position + 1 >= this.source.length)
            return '\0';
        return this.source.charAt(this.position + 1);
    };
    Lexer.prototype.isAtEnd = function () {
        return this.position >= this.source.length;
    };
    return Lexer;
}());
exports.Lexer = Lexer;
