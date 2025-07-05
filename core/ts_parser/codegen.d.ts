import { ASTNode } from './types.js';
export declare class CodeGenerator {
    private indentLevel;
    private indent;
    generate(node: ASTNode | ASTNode[]): string;
}
