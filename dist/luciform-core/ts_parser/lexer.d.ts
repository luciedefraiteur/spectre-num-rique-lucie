export declare enum TokenType {
    Keyword = 0,
    Identifier = 1,
    StringLiteral = 2,
    NumericLiteral = 3,
    Operator = 4,
    Punctuation = 5,
    Comment = 6,
    Whitespace = 7,
    EOF = 8
}
export interface Token {
    type: TokenType;
    text: string;
    line: number;
    column: number;
}
export declare class Lexer {
    private readonly source;
    private position;
    private line;
    private column;
    constructor(source: string);
    tokenize(): Token[];
    private scanToken;
    private identifier;
    private numericLiteral;
    private stringLiteral;
    private lineComment;
    private blockComment;
    private isKeyword;
    private isAlpha;
    private isDigit;
    private isAlphaNumeric;
    private advance;
    private peek;
    private peekNext;
    private matchAndAdvance;
    private isAtEnd;
}
