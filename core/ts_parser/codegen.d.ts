import { ASTNode } from './parser.js';
export declare class CodeGenerator {
    private indentLevel;
    private indent;
    generate(node: ASTNode | ASTNode[]): string;
}
