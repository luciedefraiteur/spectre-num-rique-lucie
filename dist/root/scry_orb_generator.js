import * as readline from 'readline';
import * as fs from 'fs/promises';
async function parseTscOutput(line) {
    const tscErrorPattern = /^(.*?)\((\d+),(\d+)\): error TS(\d+): (.*)$/;
    const tscWarningPattern = /^(.*?)\((\d+),(\d+)\): warning TS(\d+): (.*)$/;
    let match = line.match(tscErrorPattern);
    let type = 'info';
    if (match) {
        type = 'error';
    }
    else {
        match = line.match(tscWarningPattern);
        if (match) {
            type = 'warning';
        }
    }
    if (match) {
        const filePath = match[1];
        const lineNumber = parseInt(match[2], 10);
        const columnNumber = parseInt(match[3], 10);
        const message = `TS${match[4]}: ${match[5]}`;
        let codeContext;
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const lines = fileContent.split('\n');
            const startLine = Math.max(0, lineNumber - 1 - 3); // 3 lines before
            const endLine = Math.min(lines.length, lineNumber + 3); // 3 lines after
            codeContext = lines.slice(startLine, endLine);
        }
        catch (e) {
            // If file cannot be read, just proceed without code context
            console.error(`Could not read file ${filePath}:`, e);
        }
        return {
            timestamp: new Date().toISOString(),
            source: 'tsc',
            type: type,
            file: filePath,
            line: lineNumber,
            column: columnNumber,
            message: message,
            raw_output: line,
            codeContext: codeContext
        };
    }
    // Generic info/debug messages
    if (line.trim().length > 0) {
        return {
            timestamp: new Date().toISOString(),
            source: 'tsc',
            type: 'info',
            message: line.trim(),
            raw_output: line
        };
    }
    return null;
}
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', async (line) => {
        const fragment = await parseTscOutput(line);
        if (fragment) {
            console.log(JSON.stringify(fragment));
        }
    });
    rl.on('close', () => {
        // console.error("Scry Orb Generator finished.");
    });
}
main();
