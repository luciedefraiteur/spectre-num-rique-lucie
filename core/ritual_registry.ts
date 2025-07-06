import * as fs from 'fs/promises';
import * as path from 'path';
import {Operation} from './types.js';
import {parseLuciformAction} from './luciform_parser.js';

export interface Ritual
{
    name: string;
    description: string;
    examples: string[];
    golemPrompt: string;
    operation: Operation | null;
    filePath: string;
}

function parseRitualContent(content: string, filePath: string): Ritual | null
{
    const nameMatch = content.match(/\[Name\]\n(.*?)\n/);
    const descriptionMatch = content.match(/\[Description\]\n(.*?)\n/);
    const examplesMatch = content.match(/\[Examples\]\n([\s\S]*?)(?=\n\[|$)/);
    const golemPromptMatch = content.match(/\[Golem Prompt\]\n(.*?)\n/);

    const pasSeparator = '---PAS---';
    const pasContentIndex = content.indexOf(pasSeparator);
    const pasContent = pasContentIndex !== -1 ? content.substring(pasContentIndex + pasSeparator.length) : '';

    const operation = parseLuciformAction(pasContent);

    if(!nameMatch || !descriptionMatch || !golemPromptMatch || !operation)
    {
        return null;
    }

    const examples = examplesMatch ? examplesMatch[1].split('\n').map(e => e.replace(/^- /, '').trim()).filter(e => e) : [];

    return {
        name: nameMatch[1].trim(),
        description: descriptionMatch[1].trim(),
        examples,
        golemPrompt: golemPromptMatch[1].trim(),
        operation,
        filePath
    };
}

export class RitualRegistry
{
    private rituals: Map<string, Ritual> = new Map();

    async initialize(directory: string): Promise<void>
    {
        const files = await fs.readdir(directory);
        for(const file of files)
        {
            if(file.endsWith('.luciform'))
            {
                const filePath = path.join(directory, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const ritual = parseRitualContent(content, filePath);
                if(ritual)
                {
                    this.rituals.set(ritual.name.toLowerCase(), ritual);
                    console.log(`Registered ritual: ${ ritual.name }`);
                }
            }
        }
    }

    findRitual(command: string): Ritual | undefined
    {
        const commandLower = command.toLowerCase();
        // Simple keyword matching for now. This will be replaced by LLM logic.
        for(const ritual of this.rituals.values())
        {
            if(commandLower.includes(ritual.name.toLowerCase()))
            {
                return ritual;
            }
            for(const example of ritual.examples)
            {
                if(commandLower.includes(example.toLowerCase()))
                {
                    return ritual;
                }
            }
        }
        return undefined;
    }
}