import { Parser } from '../permissive_parser/parser.js';
import { Tokenizer } from '../permissive_parser/tokenizer.js';
import { Operation } from '../types.js';

export function parseJsonData(jsonContent: string, operations: Operation[]): any | null {
    let luciePresenceData: any | null = null;
    if (jsonContent.trim().length > 0) {
        try {
            const tokens = Tokenizer.tokenize(jsonContent);
            const parser = new Parser(tokens);
            const parsedData = parser.parse();
            if (parsedData && parsedData.luciePresence) {
                luciePresenceData = parsedData.luciePresence;
            }
            operations.push({ type: 'json_data', data: parsedData });
        } catch (e) {
            console.error(`Error parsing JSON data from luciform: ${e}`);
        }
    }
    return luciePresenceData;
}