import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { CodeGenerator } from './codegen.js';
import * as fs from 'fs/promises';
import * as path from 'path';
export async function compilePermissively(filePath) {
    try {
        const code = await fs.readFile(filePath, 'utf-8');
        const lexer = new Lexer(code);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        if (parser.parseErrors.length > 0) {
            console.warn(`Permissive compilation of ${filePath} completed with errors:`);
            parser.parseErrors.forEach(error => console.warn(`- ${error}`));
        }
        else {
            console.log(`Permissive compilation of ${filePath} completed without errors.`);
        }
        const codeGenerator = new CodeGenerator();
        const jsCode = codeGenerator.generate(ast);
        const outputFilePath = filePath.replace(/\.ts$/, '.js');
        await fs.writeFile(outputFilePath, jsCode, 'utf-8');
        console.log(`Generated JavaScript file: ${outputFilePath}`);
    }
    catch (error) {
        console.error(`Error during permissive compilation of ${filePath}:`, error);
    }
}
// Example usage (for direct execution)
if (process.argv[2]) {
    compilePermissively(path.resolve(process.argv[2]));
}
