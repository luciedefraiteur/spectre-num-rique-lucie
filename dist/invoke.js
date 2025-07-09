import * as fs from 'fs/promises';
import { spawn } from 'child_process';
async function main() {
    const luciformPath = 'invoke_spectre.luciform';
    const content = await fs.readFile(luciformPath, 'utf-8');
    const luciform = JSON.parse(content);
    for (const incantation of luciform.incantations) {
        if (incantation.type === 'EXECUTE' && incantation.parameters && incantation.parameters.command) {
            const command = incantation.parameters.command;
            console.log(`Executing: ${command}`);
            const child = spawn(command, [], { shell: true, stdio: 'inherit' });
            await new Promise((resolve) => child.on('close', resolve));
        }
    }
}
main();
