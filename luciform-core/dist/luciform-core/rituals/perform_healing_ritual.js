import * as fs from 'fs/promises';
import { spawn } from 'child_process';
function parseTscOutput(output) {
    const locations = [];
    const lines = output.split('\n');
    const seen = new Set();
    for (const line of lines) {
        if (line.includes(' - error TS')) {
            const parts = line.split('(');
            if (parts.length < 2)
                continue;
            const filePath = parts[0].trim();
            const lineAndCol = parts[1].split(')')[0];
            const lineNum = parseInt(lineAndCol.split(',')[0], 10);
            if (filePath && !isNaN(lineNum)) {
                const key = `${filePath}:${lineNum}`;
                if (!seen.has(key)) {
                    locations.push({ filePath, line: lineNum });
                    seen.add(key);
                }
            }
        }
    }
    return locations;
}
async function compileProject() {
    return new Promise((resolve) => {
        const tsc = spawn('npx', ['tsc'], { shell: true });
        let output = '';
        tsc.stdout.on('data', (data) => {
            output += data.toString();
        });
        tsc.stderr.on('data', (data) => {
            output += data.toString();
        });
        tsc.on('close', () => {
            resolve(output);
        });
    });
}
export async function perform(parameters) {
    const { output, contextLines = 5 } = parameters;
    const tscOutput = await compileProject();
    const locations = parseTscOutput(tscOutput);
    let healingOrbContent = `--- Healing Orb generated at ${new Date().toISOString()} ---\n\n`;
    for (const loc of locations) {
        try {
            const fileContent = await fs.readFile(loc.filePath, 'utf-8');
            const lines = fileContent.split('\n');
            const startLine = Math.max(0, loc.line - 1 - contextLines);
            const endLine = Math.min(lines.length, loc.line + contextLines);
            const snippet = lines.slice(startLine, endLine).join('\n');
            healingOrbContent += `--- file: ${loc.filePath}:${loc.line} ---\n`;
            healingOrbContent += snippet;
            healingOrbContent += `\n\n`;
        }
        catch (error) {
            healingOrbContent += `--- file: ${loc.filePath}:${loc.line} ---\n`;
            healingOrbContent += `[ERROR] Could not read file: ${error.message}\n\n`;
        }
    }
    const operations = [
        {
            type: 'create_file',
            filePath: output,
            content: healingOrbContent,
        },
    ];
    return operations;
}
