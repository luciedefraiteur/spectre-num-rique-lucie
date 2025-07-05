import * as fs from 'fs/promises';
async function createHealingRitual() {
    const scryOrbContent = await fs.readFile('compilation_errors.scryOrb', 'utf-8');
    const fragments = scryOrbContent.split('\n').filter(line => line.trim() !== '').map(line => JSON.parse(line));
    let healingRitual = '';
    for (const fragment of fragments) {
        if (fragment.type === 'error' && fragment.message.includes('implicitly has an \'any\' type')) {
            const filePath = fragment.file;
            const line = fragment.line;
            const match = fragment.message.match(/'([^']*)' implicitly has an 'any' type/);
            if (filePath && line && match) {
                const varName = match[1];
                healingRitual += `§F: ${filePath}\n`;
                healingRitual += `<<<<<<< §S\n`;
                healingRitual += `:line:${line}\n`;
                healingRitual += `-------\n`;
                healingRitual += `${varName}\n`;
                healingRitual += `=======\n`;
                healingRitual += `${varName}: any\n`;
                healingRitual += `>>>>>>> §R\n\n`;
            }
        }
        else if (fragment.type === 'error' && fragment.message.includes('Cannot find module')) {
            const match = fragment.message.match(/Cannot find module '([^']*)'/);
            if (match) {
                const moduleName = match[1];
                healingRitual += `§X: npm install ${moduleName}\n`;
            }
        }
    }
    await fs.writeFile('healing_ritual.luciform', healingRitual);
}
createHealingRitual();
//# sourceMappingURL=create_healing_ritual.js.map