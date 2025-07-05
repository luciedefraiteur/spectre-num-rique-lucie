import * as readline from 'readline';
function parseTscOutput(line) {
    const tscErrorPattern = /^(.*?)\((\d+),(\d+)\): error TS(\d+): (.*)$/;
    const tscWarningPattern = /^(.*?)\((\d+),(\d+)\): warning TS(\d+): (.*)$/;
    let match = line.match(tscErrorPattern);
    if (match) {
        return {
            timestamp: new Date().toISOString(),
            source: 'tsc',
            type: 'error',
            file: match[1],
            line: parseInt(match[2], 10),
            column: parseInt(match[3], 10),
            message: `TS${match[4]}: ${match[5]}`,
            raw_output: line
        };
    }
    match = line.match(tscWarningPattern);
    if (match) {
        return {
            timestamp: new Date().toISOString(),
            source: 'tsc',
            type: 'warning',
            file: match[1],
            line: parseInt(match[2], 10),
            column: parseInt(match[3], 10),
            message: `TS${match[4]}: ${match[5]}`,
            raw_output: line
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
    rl.on('line', (line) => {
        const fragment = parseTscOutput(line);
        if (fragment) {
            console.log(JSON.stringify(fragment));
        }
    });
    rl.on('close', () => {
        // console.error("Scry Orb Generator finished.");
    });
}
main();
//# sourceMappingURL=scry_orb_generator.js.map