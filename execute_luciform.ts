import * as fs from 'fs/promises';
import { exec } from 'child_process';
import * as path from 'path';
import { Operation, ShellCommand, ExecuteTypescriptFile, CreateFile } from './core/types.js';

// Fonction utilitaire pour exécuter des commandes shell
async function runShellCommand(command: string): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
            resolve({
                stdout,
                stderr,
                exitCode: error?.code ?? null,
            });
        });
    });
}

async function executeOperation(operation: Operation): Promise<void> {
    switch (operation.type) {
        case 'shell_command':
            const shellOp = operation as ShellCommand;
            console.log(`Exécution de la commande shell: ${shellOp.command}`);
            const result = await runShellCommand(shellOp.command);
            console.log(`Stdout: ${result.stdout}`);
            console.error(`Stderr: ${result.stderr}`);
            if (result.exitCode !== 0) {
                throw new Error(`La commande shell a échoué avec le code ${result.exitCode}`);
            }
            break;
        case 'execute_typescript_file':
            const tsFileOp = operation as ExecuteTypescriptFile;
            console.log(`Exécution du fichier TypeScript: ${tsFileOp.filePath}`);
            const tsNodeCommand = `ts-node ${tsFileOp.filePath}`;
            const tsResult = await runShellCommand(tsNodeCommand);
            console.log(`Stdout: ${tsResult.stdout}`);
            console.error(`Stderr: ${tsResult.stderr}`);
            if (tsResult.exitCode !== 0) {
                throw new Error(`L'exécution du fichier TypeScript a échoué avec le code ${tsResult.exitCode}`);
            }
            break;
        case 'create_file':
            const createOp = operation as CreateFile;
            console.log(`Création du fichier: ${createOp.filePath}`);
            await fs.writeFile(createOp.filePath, createOp.content, 'utf-8');
            console.log(`Fichier ${createOp.filePath} créé avec succès.`);
            break;
        default:
            console.warn(`Type d'opération non géré: ${operation.type}`);
            break;
    }
}

export async function executeLuciform(filePath: string): Promise<void> {
    console.log(`--- Exécution du luciform: ${filePath} ---`);
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const fileName = path.basename(filePath);

        if (fileName.startsWith('__temp_pas_')) {
            // C'est un fichier temporaire contenant un seul pas
            console.log(`Traitement d'un pas temporaire: ${fileName}`);
            const actionMatch = content.match(/\n\[Action\]\n([\s\S]*?)(?=\n\[|$)/);
            if (actionMatch && actionMatch[1]) {
                const command = actionMatch[1].trim();
                if (command) {
                    console.log(`Commande détectée: ${command}`);
                    const result = await runShellCommand(command);
                    console.log(`Stdout: ${result.stdout}`);
                    console.error(`Stderr: ${result.stderr}`);
                    if (result.exitCode !== 0) {
                        console.error(`La commande shell a échoué avec le code ${result.exitCode}`);
                        throw new Error(`La commande shell a échoué avec le code ${result.exitCode}`);
                    }
                }
            } else {
                console.warn(`Aucune section [Action] trouvée dans le pas temporaire: ${fileName}`);
            }
        } else {
            // C'est un fichier luciform complet
            console.log(`Traitement d'un fichier luciform complet: ${fileName}`);
            const pasSeparators = content.split('---PAS---');

            for (let i = 1; i < pasSeparators.length; i++) {
                const pasContent = pasSeparators[i];
                console.log(`\n--- Traitement du pas ${i} ---`);

                const actionMatch = pasContent.match(/\n\[Action\]\n([\s\S]*?)(?=\n\[|$)/);
                if (actionMatch && actionMatch[1]) {
                    const command = actionMatch[1].trim();
                    if (command) {
                        console.log(`Commande détectée: ${command}`);
                        const result = await runShellCommand(command);
                        console.log(`Stdout: ${result.stdout}`);
                        console.error(`Stderr: ${result.stderr}`);
                        if (result.exitCode !== 0) {
                            console.error(`La commande shell a échoué avec le code ${result.exitCode}`);
                            throw new Error(`La commande shell a échoué avec le code ${result.exitCode}`);
                        }
                    }
                }
            }
        }

    } catch (error) {
        console.error(`Erreur lors de la lecture ou de l'exécution du luciform: ${error}`);
        throw error; // Re-throw the error to be caught by lucid_lifeform.ts
    }
}