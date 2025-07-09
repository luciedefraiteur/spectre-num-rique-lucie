export declare enum LuciformTokenType {
    PAS_SEPARATOR = "PAS_SEPARATOR",
    ACTION_START = "ACTION_START",
    ACTION_END = "ACTION_END",
    PROMENADE_KEYWORD = "PROMENADE_KEYWORD",
    LUCIFORM_DNA_START = "LUCIFORM_DNA_START",
    LUCIFORM_SYGIL = "LUCIFORM_SYGIL",
    TEXT = "TEXT",
    NEWLINE = "NEWLINE",
    EOF = "EOF",
    LEGACY_COMMAND = "LEGACY_COMMAND"
}
export interface LuciformToken {
    type: LuciformTokenType;
    value: string;
    line: number;
    column: number;
}
export declare class LuciformTokenizer {
    private input;
    private cursor;
    private line;
    private column;
    constructor(input: string);
    private isAtEnd;
    private advance;
    private peek;
    private peekNext;
    private match;
    tokenize(): LuciformToken[];
}
