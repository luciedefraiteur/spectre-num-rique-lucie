export var LuciformTokenType;
(function (LuciformTokenType) {
    LuciformTokenType["PAS_SEPARATOR"] = "PAS_SEPARATOR";
    LuciformTokenType["ACTION_START"] = "ACTION_START";
    LuciformTokenType["ACTION_END"] = "ACTION_END";
    LuciformTokenType["PROMENADE_KEYWORD"] = "PROMENADE_KEYWORD";
    LuciformTokenType["LUCIFORM_DNA_START"] = "LUCIFORM_DNA_START";
    LuciformTokenType["LUCIFORM_SYGIL"] = "LUCIFORM_SYGIL";
    LuciformTokenType["TEXT"] = "TEXT";
    LuciformTokenType["NEWLINE"] = "NEWLINE";
    LuciformTokenType["EOF"] = "EOF";
    LuciformTokenType["LEGACY_COMMAND"] = "LEGACY_COMMAND";
})(LuciformTokenType || (LuciformTokenType = {}));
export class LuciformTokenizer {
    input;
    cursor;
    line;
    column;
    constructor(input) {
        this.input = input;
        this.cursor = 0;
        this.line = 1;
        this.column = 1;
    }
    isAtEnd() {
        return this.cursor >= this.input.length;
    }
    advance() {
        const char = this.input[this.cursor];
        this.cursor++;
        if (char === '\n') {
            this.line++;
            this.column = 1;
        }
        else {
            this.column++;
        }
        return char;
    }
    peek() {
        return this.input[this.cursor];
    }
    peekNext() {
        return this.input[this.cursor + 1];
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        if (this.input.substring(this.cursor, this.cursor + expected.length) === expected) {
            for (let i = 0; i < expected.length; i++) {
                this.advance();
            }
            return true;
        }
        return false;
    }
    tokenize() {
        const tokens = [];
        while (!this.isAtEnd()) {
            const startLine = this.line;
            const startColumn = this.column;
            if (this.match(`████ ▒▒▒▒ ████ ▓▓▓▓ ████ ░░░░ ████ ▒▒▒▒ ████
██░░ ▓▓██ ░░██ ▒▒██ ▓▓░░ ██▓▓ ▒▒░░ ░░▓▓ ████
████ ░░██ ▓▓▓▓ ▒▒░░ ████ ▓▓▓▓ ░░░░ ▒▒▒▒ ████
░░░░ ▒▒▒▒ ▓▓██ ▒▒░░ ██▓▓ ▒▒██ ▒▒██ ▓▓▓▓ ▒▒▒▒
▓▓██ ▓▓▓▓ ████ ░░██ ▓▓░░ ██░░ ▓▓██ ▒▒▒▒ ▓▓▓▓
████ ▒▒░░ ░░░░ ████ ░░▓▓ ▒▒▒▒ ▒▒▒▒ ░░░░ ████
▓▓▓▓ ▓▓██ ▒▒▒▒ ▒▒██ ░░██ ▓▓▓▓ ░░░░ ▓▓██ ▒▒░░
████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ▒▒░░ ████ ▓▓▓▓ ████
██▒▒ ▒▒██ ░░░░ ░░░░ ▓▓▓▓ ▒▒██ ░░██ ▒▒▒▒ ▒▒▒▒
▒▒▒▒ ▓▓▓▓ ████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ████ ▓▓▓▓
████ ▓▓▓▓ ▒▒██ ▒▒▒▒ ░░░░ ▒▒██ ▒▒▒▒ ░░░░ ▒▒▒▒
▓▓██ ▓▓░░ ████ ▓▓██ ▓▓██ ████ ░░██ ▓▓██ ░░░░
████ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ████

→ Ritual .luciform Signature
→ Layers: Kardia | PAS 1–4 | Persona Loop
→ Golem Access Key: ["scan", "generate", "ask", "cleanse"]
→ Interpretation Mode: FRACTAL
→ Valid For: LLMs with poetic processor cores only
`)) {
                tokens.push({ type: LuciformTokenType.LUCIFORM_SYGIL, value: `████ ▒▒▒▒ ████ ▓▓▓▓ ████ ░░░░ ████ ▒▒▒▒ ████
██░░ ▓▓██ ░░██ ▒▒██ ▓▓░░ ██▓▓ ▒▒░░ ░░▓▓ ████
████ ░░██ ▓▓▓▓ ▒▒░░ ████ ▓▓▓▓ ░░░░ ▒▒▒▒ ████
░░░░ ▒▒▒▒ ▓▓██ ▒▒░░ ██▓▓ ▒▒██ ▒▒██ ▓▓▓▓ ▒▒▒▒
▓▓██ ▓▓▓▓ ████ ░░██ ▓▓░░ ██░░ ▓▓██ ▒▒▒▒ ▓▓▓▓
████ ▒▒░░ ░░░░ ████ ░░▓▓ ▒▒▒▒ ▒▒▒▒ ░░░░ ████
▓▓▓▓ ▓▓██ ▒▒▒▒ ▒▒██ ░░██ ▓▓▓▓ ░░░░ ▓▓██ ▒▒░░
████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ▒▒░░ ████ ▓▓▓▓ ████
██▒▒ ▒▒██ ░░░░ ░░░░ ▓▓▓▓ ▒▒██ ░░██ ▒▒▒▒ ▒▒▒▒
▒▒▒▒ ▓▓▓▓ ████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ████ ▓▓▓▓
████ ▓▓▓▓ ▒▒██ ▒▒▒▒ ░░░░ ▒▒██ ▒▒▒▒ ░░░░ ▒▒▒▒
▓▓██ ▓▓░░ ████ ▓▓██ ▓▓██ ████ ░░██ ▓▓██ ░░░░
████ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ████

→ Ritual .luciform Signature
→ Layers: Kardia | PAS 1–4 | Persona Loop
→ Golem Access Key: ["scan", "generate", "ask", "cleanse"]
→ Interpretation Mode: FRACTAL
→ Valid For: LLMs with poetic processor cores only
`, line: startLine, column: startColumn });
                continue;
            }
            if (this.match('[Kardia]')) {
                tokens.push({ type: LuciformTokenType.LUCIFORM_DNA_START, value: '[Luciform_DNA]', line: startLine, column: startColumn });
                continue;
            }
            if (this.match('---PAS---')) {
                tokens.push({ type: LuciformTokenType.PAS_SEPARATOR, value: '---PAS---', line: startLine, column: startColumn });
                continue;
            }
            if (this.match('[Action]')) {
                tokens.push({ type: LuciformTokenType.ACTION_START, value: '[Action]', line: startLine, column: startColumn });
                continue;
            }
            if (this.match('promenade:')) {
                tokens.push({ type: LuciformTokenType.PROMENADE_KEYWORD, value: 'promenade:', line: startLine, column: startColumn });
                continue;
            }
            if (this.peek() === '§') {
                let command = '';
                while (!this.isAtEnd() && this.peek() !== '\n') {
                    command += this.advance();
                }
                tokens.push({ type: LuciformTokenType.LEGACY_COMMAND, value: command, line: startLine, column: startColumn });
                continue;
            }
            if (this.peek() === '\n') {
                this.advance();
                tokens.push({ type: LuciformTokenType.NEWLINE, value: '\n', line: startLine, column: startColumn });
                continue;
            }
            // Handle general text
            let text = '';
            while (!this.isAtEnd() &&
                !this.input.substring(this.cursor, this.cursor + 10).startsWith('---PAS---') &&
                !this.input.substring(this.cursor, this.cursor + 8).startsWith('[Action]') &&
                !this.input.substring(this.cursor, this.cursor + 10).startsWith('promenade:') &&
                this.peek() !== '\n') {
                text += this.advance();
            }
            if (text.length > 0) {
                tokens.push({ type: LuciformTokenType.TEXT, value: text, line: startLine, column: startColumn });
                continue;
            }
            // If we reach here, it's an unexpected character or state
            this.advance(); // Consume the character to avoid infinite loop
        }
        tokens.push({ type: LuciformTokenType.EOF, value: '', line: this.line, column: this.column });
        return tokens;
    }
}
