import * as fs from 'fs/promises';
import {Operation} from '../core_types.js';
import {Parser} from '../permissive_parser/parser.js';
import {Tokenizer} from '../permissive_parser/tokenizer.js';
import {parseJsonData} from './json_parser_helper.js';

type ParserState = 'idle' | 'in_search' | 'in_replace' | 'in_insert' | 'in_append' | 'in_create' | 'in_json';

export async function parseLuciform(filePath: string, args: string[]): Promise<{operations: Operation[], luciePresenceData: any | null}>
{
    const content = await fs.readFile(filePath, 'utf-8'); const lines = content.replace(/\r\n/g, '\n').split('\n'); const operations: Operation[] = []; let state: ParserState = 'idle'; let currentFilePath: string | undefined; let searchContent = ''; let newContent = ''; let lineNumber: number | undefined; let startLine: number | undefined; let endLine: number | undefined; let currentSearchStartLine: number | undefined; let jsonContent = ''; let luciePresenceData: any | null = null;

    for(const line of lines)
    {
        if(line.startsWith('---'))
        {
            // Process content accumulated before the separator
            if(state === 'in_json')
            {
                const parsedLucieData = parseJsonData(jsonContent, operations);
                if(parsedLucieData)
                {
                    luciePresenceData = parsedLucieData;
                }
            }
            // Reset state and content after separator
            state = 'idle';
            jsonContent = '';
            continue;
        }

        let processedLine = line;
        // Replace arguments in the line
        for(let i = 0; i < args.length; i++)
        {
            processedLine = processedLine.replace(new RegExp(`\\$${ i + 1 }`, 'g'), args[i]);
        }
        processedLine = processedLine.replace(/\s*\$\d+/g, ''); // Remove any unmatched argument placeholders

        if(processedLine.startsWith('§F:'))
        {
            currentFilePath = processedLine.substring(3).trim();
            state = 'idle';
        }
        else if(processedLine.startsWith('§S:'))
        {
            searchContent = processedLine.substring(3);
            state = 'in_search';
        }
        else if(processedLine.startsWith('§R:'))
        {
            newContent = processedLine.substring(3);
            state = 'in_replace';
            if(currentFilePath && searchContent)
            {
                operations.push({type: 'search_and_replace', filePath: currentFilePath, search: searchContent, replace: newContent});
                searchContent = '';
                newContent = '';
            }
        }
        else if(processedLine.startsWith('§I:'))
        {
            newContent = processedLine.substring(3);
            state = 'in_insert';
            if(currentFilePath)
            {
                operations.push({type: 'insert', filePath: currentFilePath, lineNumber: 0, newContent: newContent});
                newContent = '';
            }
        }
        else if(processedLine.startsWith('§A:'))
        {
            newContent = processedLine.substring(3);
            state = 'in_append';
            if(currentFilePath)
            {
                operations.push({type: 'append', filePath: currentFilePath, newContent: newContent});
                newContent = '';
            }
        }
        else if(processedLine.startsWith('§C:'))
        {
            currentFilePath = processedLine.substring(3).trim();
            state = 'in_create';
            if(currentFilePath)
            {
                operations.push({type: 'create_file', filePath: currentFilePath, content: ''});
            }
        }
        else if(processedLine.startsWith('§L:'))
        {
            const parts = processedLine.substring(3).split('-');
            startLine = parseInt(parts[0]);
            endLine = parts.length > 1 ? parseInt(parts[1]) : startLine;
            state = 'idle';
            if(currentFilePath && startLine !== undefined && endLine !== undefined)
            {
                operations.push({type: 'read_lines', filePath: currentFilePath, startLine, endLine});
            }
        }
        else if(processedLine.startsWith('§J:'))
        {
            state = 'in_json';
            jsonContent += processedLine.substring(3) + '\n';
        }
        else if(processedLine.startsWith('§X:'))
        {
            const command = processedLine.substring(3).trim();
            operations.push({type: 'shell_command', command});
            state = 'idle';
        }
        else if(processedLine.startsWith('§D:'))
        {
            const deletePath = processedLine.substring(3).trim();
            operations.push({type: 'delete', filePath: deletePath, startLine: 0, endLine: 0});
            state = 'idle';
        }
        else if(processedLine.startsWith('§RI:'))
        {
            const ritualContent = processedLine.substring(4).trim();
            try
            {
                const parsedRitual = JSON.parse(ritualContent);
                operations.push({type: 'ritual_modification_instruction', fichier_a_modifier: parsedRitual.fichier_a_modifier, instruction: parsedRitual.instruction});
            } catch(e)
            {
                console.error(`Erreur de parsing de l'instruction de modification rituelle: ${ e }. Contenu: ${ ritualContent }`);
            }
            state = 'idle';
        }
        else if(processedLine.startsWith('§M:'))
        {
            const arcaneContent = processedLine.substring(3).trim();
            try
            {
                const parsedArcane = JSON.parse(arcaneContent);
                operations.push({type: 'arcane_instruction', fichier_a_modifier: parsedArcane.fichier_a_modifier, instruction: parsedArcane.instruction});
            } catch(e)
            {
                console.error(`Erreur de parsing de l'instruction arcane: ${ e }. Contenu: ${ arcaneContent }`);
                // Fallback to old behavior if JSON parsing fails
                operations.push({type: 'arcane_instruction', fichier_a_modifier: '', instruction: arcaneContent});
            }
            state = 'idle';
        }
        else if(processedLine.startsWith('§P:'))
        {
            const prompt = processedLine.substring(3).trim();
            operations.push({type: 'prompt', prompt});
            state = 'idle';
        }
        else if(processedLine.startsWith('§G:'))
        {
            const globPattern = processedLine.substring(3).trim();
            operations.push({type: 'glob', pattern: globPattern});
            state = 'idle';
        }
        else if(processedLine.startsWith('§W:'))
        {
            const webUrl = processedLine.substring(3).trim();
            operations.push({type: 'web_fetch', url: webUrl});
            state = 'idle';
        }
        else if(processedLine.startsWith('§T:'))
        {
            const testCommand = processedLine.substring(3).trim();
            operations.push({type: 'test', command: testCommand});
            state = 'idle';
        }
        else if(processedLine.startsWith('§O:'))
        {
            const output = processedLine.substring(3).trim();
            operations.push({type: 'output', content: output});
            state = 'idle';
        }
        else if(processedLine.startsWith('§E:'))
        {
            const error = processedLine.substring(3).trim();
            operations.push({type: 'error', message: error});
            state = 'idle';
        }
        else if(processedLine.startsWith('§V:'))
        {
            const variableName = processedLine.substring(3).trim();
            operations.push({type: 'variable', name: variableName});
            state = 'idle';
        }
        else if(processedLine.startsWith('§U:'))
        {
            const updateInstruction = processedLine.substring(3).trim();
            operations.push({type: 'update', instruction: updateInstruction});
            state = 'idle';
        }
        else if(processedLine.startsWith('§H:'))
        {
            const helpTopic = processedLine.substring(3).trim();
            operations.push({type: 'help', topic: helpTopic});
            state = 'idle';
        }
        else if(processedLine.startsWith('§Z:'))
        {
            const debugMessage = processedLine.substring(3).trim();
            operations.push({type: 'debug', message: debugMessage});
            state = 'idle';
        }
        else if(processedLine.startsWith('§Y:'))
        {
            const yamlContent = processedLine.substring(3).trim();
            operations.push({type: 'yaml', content: yamlContent});
            state = 'idle';
        }
        else if(processedLine.startsWith('§K:'))
        {
            const key = processedLine.substring(3).trim();
            operations.push({type: 'key', key: key});
            state = 'idle';
        }
        else if(processedLine.startsWith('§Q:'))
        {
            const query = processedLine.substring(3).trim();
            operations.push({type: 'query', query: query});
            state = 'idle';
        }
        else if(processedLine.startsWith('§B:'))
        {
            const batch = processedLine.substring(3).trim();
            operations.push({type: 'batch', batch: batch});
            state = 'idle';
        }
        else if(processedLine.startsWith('§N:'))
        {
            const note = processedLine.substring(3).trim();
            operations.push({type: 'note', note: note});
            state = 'idle';
        }
        else if(processedLine.startsWith('§R:'))
        {
            const raw = processedLine.substring(3).trim();
            operations.push({type: 'raw', raw: raw});
            state = 'idle';
        }
        else if(processedLine.startsWith('§C:'))
        {
            const code = processedLine.substring(3).trim();
            operations.push({type: 'code', code: code});
            state = 'idle';
        }
        else if(processedLine.startsWith('§D:'))
        {
            const data = processedLine.substring(3).trim();
            operations.push({type: 'data', data: data});
            state = 'idle';
        }
        else if(processedLine.startsWith('§F:'))
        {
            const file = processedLine.substring(3).trim();
            operations.push({type: 'file', file: file});
            state = 'idle';
        }
        else if(processedLine.startsWith('§G:'))
        {
            const git = processedLine.substring(3).trim();
            operations.push({type: 'git', git: git});
            state = 'idle';
        }
        else if(processedLine.startsWith('§H:'))
        {
            const hash = processedLine.substring(3).trim();
            operations.push({type: 'hash', hash: hash});
            state = 'idle';
        }
        else if(processedLine.startsWith('§I:'))
        {
            const info = processedLine.substring(3).trim();
            operations.push({type: 'info', info: info});
            state = 'idle';
        }
        else if(processedLine.startsWith('§J:'))
        {
            const json = processedLine.substring(3).trim();
            operations.push({type: 'json', json: json});
            state = 'idle';
        }
        else if(processedLine.startsWith('§L:'))
        {
            const log = processedLine.substring(3).trim();
            operations.push({type: 'log', log: log});
            state = 'idle';
        }
        else if(processedLine.startsWith('§M:'))
        {
            const message = processedLine.substring(3).trim();
            operations.push({type: 'message', message: message});
            state = 'idle';
        }
        else if(processedLine.startsWith('§N:'))
        {
            const name = processedLine.substring(3).trim();
            operations.push({type: 'name', name: name});
            state = 'idle';
        }
        else if(processedLine.startsWith('§O:'))
        {
            const option = processedLine.substring(3).trim();
            operations.push({type: 'option', option: option});
            state = 'idle';
        }
        else if(processedLine.startsWith('§P:'))
        {
            const path = processedLine.substring(3).trim();
            operations.push({type: 'path', path: path});
            state = 'idle';
        }
        else if(processedLine.startsWith('§Q:'))
        {
            const question = processedLine.substring(3).trim();
            operations.push({type: 'ask_lucie', question: question});
            state = 'idle';
        }
        else if(processedLine.startsWith('§R:'))
        {
            const result = processedLine.substring(3).trim();
            operations.push({type: 'result', result: result});
            state = 'idle';
        }
        else if(processedLine.startsWith('§S:'))
        {
            const status = processedLine.substring(3).trim();
            operations.push({type: 'status', status: status});
            state = 'idle';
        }
        else if(processedLine.startsWith('§T:'))
        {
            const text = processedLine.substring(3).trim();
            operations.push({type: 'text', text: text});
            state = 'idle';
        }
        else if(processedLine.startsWith('§U:'))
        {
            const url = processedLine.substring(3).trim();
            operations.push({type: 'url', url: url});
            state = 'idle';
        }
        else if(processedLine.startsWith('§V:'))
        {
            const value = processedLine.substring(3).trim();
            operations.push({type: 'value', value: value});
            state = 'idle';
        }
        else if(processedLine.startsWith('§W:'))
        {
            const warning = processedLine.substring(3).trim();
            operations.push({type: 'warning', warning: warning});
            state = 'idle';
        }
        else if(processedLine.startsWith('§X:'))
        {
            const xml = processedLine.substring(3).trim();
            operations.push({type: 'xml', xml: xml});
            state = 'idle';
        }
        else if(processedLine.startsWith('§Y:'))
        {
            const yes = processedLine.substring(3).trim();
            operations.push({type: 'yes', yes: yes});
            state = 'idle';
        }
        else if(processedLine.startsWith('§Z:'))
        {
            const zip = processedLine.substring(3).trim();
            operations.push({type: 'zip', zip: zip});
            state = 'idle';
        }
        else if(state === 'in_search')
        {
            searchContent += processedLine + '\n';
        }
        else if(state === 'in_replace' || state === 'in_insert' || state === 'in_append' || state === 'in_create')
        {
            newContent += processedLine + '\n';
        }
        else if(state === 'in_json')
        {
            jsonContent += processedLine + '\n';
        }
    }
    return {operations, luciePresenceData};
}