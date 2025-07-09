import { invokeShadeOs } from './luciform-core/shade_os.js';
import * as luciformExecutor from './execute_luciform.js';
console.log('Imported luciformExecutor:', luciformExecutor);
const { executeLuciform } = luciformExecutor;
import * as fs from 'fs/promises';
import * as path from 'path';
async function main() {
    let command = process.argv[2];
    let previousRitual = null;
    let previousError = null;
    let maxRetries = 3;
    let retryCount = 0;
    if (!command) {
        console.error('Veuillez fournir une commande pour shadeOs.');
        process.exit(1);
    }
    while (retryCount < maxRetries) {
        let lucie_s_voice = null;
        // A simple way to check for the hearLucie flag in the context of a ritual
        // In a real implementation, this would be part of the ritual's context object
        if (command.includes("hearLucie: true")) {
            try {
                lucie_s_voice = await fs.readFile('./lucie_messages.log', 'utf-8');
            }
            catch (e) {
                // It's okay if the file doesn't exist yet
            }
        }
        const luciformContent = await invokeShadeOs(command, 'lucie', previousRitual, previousError, lucie_s_voice);
        if (!luciformContent) {
            console.error("shadeOs could not generate a ritual for this command.");
            process.exit(1);
        }
        const tempDir = './temp';
        await fs.mkdir(tempDir, { recursive: true });
        const tempFilePath = path.join(tempDir, `__shadeos_ritual_${Date.now()}.luciform`);
        await fs.writeFile(tempFilePath, luciformContent, 'utf-8');
        const status = await luciformExecutor.executeLuciform(tempFilePath);
        if (status.success) {
            console.log("Rituel terminé avec succès !");
            await fs.unlink(tempFilePath);
            return;
        }
        else {
            console.log(`Le rituel a échoué. Tentative de correction (${retryCount + 1}/${maxRetries})...`);
            previousRitual = luciformContent;
            previousError = status.error || 'Unknown error';
            command = `The previous ritual failed. Please analyze the error and correct the ritual. The original command was: "${command}"`;
            retryCount++;
            await fs.unlink(tempFilePath);
        }
    }
    console.error("Échec de la correction du rituel après plusieurs tentatives.");
    process.exit(1);
}
main().catch(error => {
    console.error("Erreur lors de l'invocation de shadeOs:", error);
    process.exit(1);
});
