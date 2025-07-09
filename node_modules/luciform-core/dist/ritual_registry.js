import * as fs from 'fs/promises';
import * as path from 'path';
import { parseLuciformDocument } from './luciform_parser/parser.js';
function parseRitualContent(content, filePath) {
    const nameMatch = content.match(/\[Name\]\n(.*?)\n/);
    const descriptionMatch = content.match(/\[Description\]\n(.*?)\n/);
    const examplesMatch = content.match(/\[Examples\]\n([\s\S]*?)(?=\n\[|$)/);
    const golemPromptMatch = content.match(/\[Golem Prompt\]\n(.*?)\n/);
    const pasSeparator = '---PAS---';
    const pasContentIndex = content.indexOf(pasSeparator);
    const pasContent = pasContentIndex !== -1 ? content.substring(pasContentIndex + pasSeparator.length) : '';
    let operation = null;
    try {
        const luciformDoc = parseLuciformDocument(pasContent, async (message, logFileName) => { console.log(message); });
        if (luciformDoc.pas.length > 0 && luciformDoc.pas[0].action) {
            const action = luciformDoc.pas[0].action;
            if (action.type === 'json_action') {
                // Check if the operation is an ExecutableOperation
                if (action.operation.type === 'shell_command' ||
                    action.operation.type === 'execute_typescript_file' ||
                    action.operation.type === 'create_file' ||
                    action.operation.type === 'promenade' ||
                    action.operation.type === 'ask_lucie' ||
                    action.operation.type === 'message') {
                    operation = action.operation;
                }
                else {
                    console.warn(`[WARN] Non-executable operation type found in JSON action: ${action.operation.type}`);
                }
            }
            else if (action.type === 'promenade') {
                operation = { type: 'promenade', description: action.description };
            }
            else if (action.type === 'message') {
                operation = { type: 'message', message: action.message };
            }
        }
    }
    catch (e) {
        console.error(`Error parsing luciform content for ritual ${filePath}:`, e);
        return null;
    }
    if (!nameMatch || !descriptionMatch || !golemPromptMatch || operation === null) {
        return null;
    }
    const examples = examplesMatch ? examplesMatch[1].split('\n').map(e => e.replace(/^- /, '').trim()).filter(e => e) : [];
    return {
        name: nameMatch[1].trim(),
        description: descriptionMatch[1].trim(),
        examples,
        golemPrompt: golemPromptMatch[1].trim(),
        operation: operation,
        filePath
    };
}
export class RitualRegistry {
    rituals = new Map();
    async initialize(directory) {
        const files = await fs.readdir(directory);
        for (const file of files) {
            if (file.endsWith('.luciform')) {
                const filePath = path.join(directory, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const ritual = parseRitualContent(content, filePath);
                if (ritual) {
                    this.rituals.set(ritual.name.toLowerCase(), ritual);
                    console.log(`Registered ritual: ${ritual.name}`);
                }
            }
        }
    }
    findRitual(command) {
        const commandLower = command.toLowerCase();
        // Simple keyword matching for now. This will be replaced by LLM logic.
        for (const ritual of this.rituals.values()) {
            if (commandLower.includes(ritual.name.toLowerCase())) {
                return ritual;
            }
            for (const example of ritual.examples) {
                if (commandLower.includes(example.toLowerCase())) {
                    return ritual;
                }
            }
        }
        return undefined;
    }
}
