import {Operation} from '../types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import {spawn} from 'child_process';
import {Lexer} from '../ts_parser/lexer.js';
import {Parser} from '../ts_parser/parser.js';
import {ASTNode, FunctionDeclarationNode} from '../ts_parser/types.js';

interface HealingParameters
{
    output: string;
}

interface ErrorLocation
{
    filePath: string;
    line: number;
}

function parseTscOutput(output: string): ErrorLocation[]
{
    const locations: ErrorLocation[] = [];
    const lines = output.split('\n');
    const seen = new Set<string>();

    for(const line of lines)
    {
        if(line.includes(' - error TS'))
        {
            const parts = line.split('(');
            if(parts.length < 2) continue;

            const filePath = parts[0].trim();
            const lineAndCol = parts[1].split(')')[0];
            const lineNum = parseInt(lineAndCol.split(',')[0], 10);

            if(filePath && !isNaN(lineNum))
            {
                const key = `${ filePath }:${ lineNum }`;
                if(!seen.has(key))
                {
                    locations.push({filePath, line: lineNum});
                    seen.add(key);
                }
            }
        }
    }
    return locations;
}

async function compileProject(): Promise<string>
{
    return new Promise((resolve) =>
    {
        const tsc = spawn('npx', ['tsc'], {shell: true});
        let output = '';
        tsc.stdout.on('data', (data) =>
        {
            output += data.toString();
        });
        tsc.stderr.on('data', (data) =>
        {
            output += data.toString();
        });
        tsc.on('close', () =>
        {
            resolve(output);
        });
    });
}

function findNodeAtLine(node: ASTNode, line: number): ASTNode | null
{
    // This is a simplified implementation. A real implementation would need to
    // track line numbers for all nodes.
    if(node instanceof FunctionDeclarationNode)
    {
        // A real implementation would check if the line is within the function body.
        return node;
    }
    for(const key in node)
    {
        if(node.hasOwnProperty(key))
        {
            const child = (node as any)[key];
            if(child instanceof ASTNode)
            {
                const result = findNodeAtLine(child, line);
                if(result)
                {
                    return result;
                }
            } else if(Array.isArray(child))
            {
                for(const item of child)
                {
                    if(item instanceof ASTNode)
                    {
                        const result = findNodeAtLine(item, line);
                        if(result)
                        {
                            return result;
                        }
                    }
                }
            }
        }
    }
    return null;
}

export async function perform(parameters: HealingParameters): Promise<Operation[]>
{
    const {output} = parameters;

    const tscOutput = await compileProject();
    const locations = parseTscOutput(tscOutput);
    let healingOrbContent = `--- Healing Orb generated at ${ new Date().toISOString() } ---\n\n`;

    for(const loc of locations)
    {
        try
        {
            const fileContent = await fs.readFile(loc.filePath, 'utf-8');
            const lexer = new Lexer(fileContent);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            const ast = parser.parse();

            let contextualSnippet = `Error in ${ loc.filePath } at line ${ loc.line }\n`;
            for(const node of ast)
            {
                const foundNode = findNodeAtLine(node, loc.line);
                if(foundNode)
                {
                    // A real implementation would pretty-print the AST node.
                    contextualSnippet += JSON.stringify(foundNode, null, 2);
                    break;
                }
            }

            healingOrbContent += `--- file: ${ loc.filePath }:${ loc.line } ---\n`;
            healingOrbContent += contextualSnippet;
            healingOrbContent += `\n\n`;
        } catch(error)
        {
            healingOrbContent += `--- file: ${ loc.filePath }:${ loc.line } ---\n`;
            healingOrbContent += `[ERROR] Could not read or parse file: ${ (error as Error).message }\n\n`;
        }
    }

    const operations: Operation[] = [
        {
            type: 'create_file',
            filePath: output,
            content: healingOrbContent,
        },
    ];

    return operations;
}