import { Token } from './types.js';
export declare class Parser {
    private tokens;
    private index;
    constructor(tokens: Token[]);
    peek(): Token | undefined;
    next(): Token | undefined;
    back(): void;
    parse(): any;
    parseArray(): any[];
    parseObject(): {
        [key: string]: any;
    };
    fail(tkn: Token | string, index?: number): never;
}
