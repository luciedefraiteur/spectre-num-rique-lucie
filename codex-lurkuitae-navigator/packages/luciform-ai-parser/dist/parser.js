"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLuciformDocument = parseLuciformDocument;
const tokenizer_1 = require("./tokenizer");
const types_1 = require("./types");
function getAIHelp(rawContent, reason, logRitual, logFileName) {
    logRitual(`AI HELP: Requesting assistance for: ${reason}`, logFileName);
    logRitual(`AI HELP: Raw content: ${rawContent}`, logFileName);
    return { type: 'ai_help_request', rawContent, reason };
}
function parseLuciformDocument(luciformContent, logRitual, logFileName) {
    // Try parsing as JSON (for .spell or complex .luciform files) first
    try {
        const json = JSON.parse(luciformContent);
        if (json.type === 'spell' && json.action) {
            // Convert spell JSON to a LuciformDocument structure
            const actionNode = { type: 'json_action', operation: json.action };
            const pasNode = { type: 'Pas', content: json.description || '', action: actionNode };
            return { type: 'LuciformDocument', pas: [pasNode], sygil: json.sygil || undefined };
        }
        else if (json.luciform && Array.isArray(json.luciform)) {
            // Handle top-level JSON with a 'luciform' array
            const pasNodes = json.luciform.map((item) => {
                if (item.pas && item.action) {
                    return { type: 'Pas', content: item.pas, action: parseAction(JSON.stringify(item.action), logRitual, logFileName) };
                }
                else {
                    throw new Error("Invalid PAS structure in top-level luciform array.");
                }
            });
            return { type: 'LuciformDocument', pas: pasNodes, sygil: json.meta?.signature_totem || undefined };
        }
    }
    catch (e) {
        // Not a JSON spell file or complex luciform, fall through to legacy parser
    }
    const tokenizer = tokenizer_1.Tokenizer.tokenize(luciformContent);
    const tokens = tokenizer;
    let currentTokenIndex = 0;
    const consume = (expectedType) => {
        const token = tokens[currentTokenIndex];
        if (token && token.type === expectedType) {
            currentTokenIndex++;
            return token;
        }
        else {
            throw new Error(`Expected token type ${expectedType} but got ${token ? token.type : 'EOF'} at line ${token?.line}, column ${token?.column}`);
        }
    };
    const peek = () => {
        return tokens[currentTokenIndex];
    };
    const skipNewlines = () => {
        while (peek().type === types_1.TokenType.NEWLINE) {
            consume(types_1.TokenType.NEWLINE);
        }
    };
    let sygil;
    if (peek().type === types_1.TokenType.LUCIFORM_SYGIL) {
        sygil = consume(types_1.TokenType.LUCIFORM_SYGIL).value;
        skipNewlines();
    }
    const parseAction = (actionContent, logRitual, logFileName) => {
        logRitual(`Parser: Parsing action content: ${actionContent.substring(0, 50)}...`, logFileName);
        const trimmedContent = actionContent.trim();
        // Try to parse as JSON first for structured operations
        if (trimmedContent.startsWith('{')) {
            let jsonString = trimmedContent;
            // Check for template literals within the JSON string (e.g., for multi-line strings)
            const templateLiteralRegex = /`([\s\S]*?)`/g;
            jsonString = jsonString.replace(templateLiteralRegex, (match, content) => {
                // Escape newlines and double quotes within the template literal content
                const escapedContent = content.replace(/\n/g, '\n').replace(/"/g, '"');
                return `"${escapedContent}"`;
            });
            try {
                const operation = JSON.parse(jsonString);
                if (operation && typeof operation.type === 'string') {
                    logRitual(`Parser: Parsed JSON action of type: ${operation.type}`, logFileName);
                    return { type: 'json_action', operation: operation };
                }
            }
            catch (error) {
                return getAIHelp(trimmedContent, `JSON parsing failed: ${error.message}`, logRitual, logFileName);
            }
        }
        // Handle non-JSON operations like 'promenade'
        const promenadeMatch = trimmedContent.match(/^promenade:\s*(.*)/);
        if (promenadeMatch && promenadeMatch[1] !== undefined) {
            logRitual(`Parser: Parsed Promenade action: ${promenadeMatch[1].trim()}`, logFileName);
            return { type: 'promenade', description: promenadeMatch[1].trim() };
        }
        // If no other match, treat as a message to shadeOs
        logRitual(`Parser: Parsed Message action: ${trimmedContent}`, logFileName);
        return { type: 'message', message: trimmedContent };
    };
    const parseLegacyCommand = (command, logRitual, logFileName) => {
        logRitual(`Parser: Parsing legacy command: ${command}`, logFileName);
        const match = command.match(/^§(.*?):(.*)$/);
        if (!match) {
            logRitual(`Parser Error: Invalid legacy command format: ${command}`, logFileName);
            return getAIHelp(command, "Invalid legacy command format", logRitual, logFileName);
        }
        const key = match[1];
        const value = match[2].trim();
        switch (key) {
            case 'F':
                logRitual(`Parser: Parsed legacy Create File command: ${value}`, logFileName);
                return { type: 'json_action', operation: { type: 'create_file', filePath: value, content: '' } };
            case 'S':
                logRitual(`Parser: Parsed legacy Search command: ${value}`, logFileName);
                return { type: 'json_action', operation: { type: 'search_and_replace', filePath: '', search: value, replace: '' } };
            case 'R':
                logRitual(`Parser: Parsed legacy Replace command: ${value}`, logFileName);
                return { type: 'json_action', operation: { type: 'search_and_replace', filePath: '', search: '', replace: value } };
            case 'I':
                logRitual(`Parser: Parsed legacy Insert command: ${value}`, logFileName);
                return { type: 'json_action', operation: { type: 'insert', filePath: '', lineNumber: 0, newContent: value } };
            case 'A':
                logRitual(`Parser: Parsed legacy Append command: ${value}`, logFileName);
                return { type: 'json_action', operation: { type: 'append', filePath: '', newContent: value } };
            case 'X':
                logRitual(`Parser: Parsed legacy Shell Command: ${value}`, logFileName);
                return { type: 'json_action', operation: { type: 'shell_command', command: value } };
            // Add other legacy commands here...
            default:
                return getAIHelp(command, `Unknown legacy command key: ${key}`, logRitual, logFileName);
        }
    };
    const parsePas = () => {
        let pasContent = '';
        let actionNode = null;
        // Skip leading newlines within a pas block before collecting content
        skipNewlines();
        while (peek().type !== types_1.TokenType.PAS_SEPARATOR && peek().type !== types_1.TokenType.EOF) {
            const token = peek();
            if (token.type === types_1.TokenType.ACTION_START) {
                consume(types_1.TokenType.ACTION_START);
                let actionBlockContent = '';
                // Consume content until the next PAS_SEPARATOR or EOF
                while (peek().type !== types_1.TokenType.PAS_SEPARATOR && peek().type !== types_1.TokenType.EOF) {
                    const actionToken = peek();
                    if (actionToken.type === types_1.TokenType.NEWLINE) {
                        consume(types_1.TokenType.NEWLINE);
                        actionBlockContent += '\n';
                    }
                    else {
                        actionBlockContent += consume(actionToken.type).value;
                    }
                }
                actionNode = parseAction(actionBlockContent, logRitual, logFileName);
                logRitual(`Parser: Detected and parsed action block.`, logFileName);
                break; // Action block found, stop parsing pas content
            }
            else if (token.type === types_1.TokenType.LEGACY_COMMAND) {
                actionNode = parseLegacyCommand(consume(types_1.TokenType.LEGACY_COMMAND).value, logRitual, logFileName);
                logRitual(`Parser: Detected and parsed legacy command.`, logFileName);
            }
            else {
                pasContent += consume(token.type).value;
            }
        }
        const pasNode = { type: 'Pas', content: pasContent.trim(), action: actionNode };
        logRitual(`Parser: Parsed PAS block: ${pasContent.trim().substring(0, 50)}...`, logFileName);
        return pasNode;
    };
    const pasNodes = [];
    // Skip any leading newlines in the document
    skipNewlines();
    // If the document starts with a PAS_SEPARATOR, consume it
    if (peek().type === types_1.TokenType.PAS_SEPARATOR) {
        consume(types_1.TokenType.PAS_SEPARATOR);
        skipNewlines(); // Skip newlines after the initial PAS_SEPARATOR
    }
    while (peek().type !== types_1.TokenType.EOF) {
        pasNodes.push(parsePas());
        // After parsing a pas, if the next token is a PAS_SEPARATOR, consume it and skip newlines
        if (peek().type === types_1.TokenType.PAS_SEPARATOR) {
            consume(types_1.TokenType.PAS_SEPARATOR);
            skipNewlines();
        }
    }
    return { type: 'LuciformDocument', pas: pasNodes, sygil };
}
//# sourceMappingURL=parser.js.map