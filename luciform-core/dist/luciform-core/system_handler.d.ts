import { CommandOutcome, RitualContext } from './types/base.js';
/**
 * Exécute une commande système avec un répertoire courant facultatif.
 * @param input La commande shell à exécuter (ex: "ls -l").
 * @param cwd Le chemin absolu du répertoire depuis lequel exécuter.
 */
export declare function handleSystemCommand(input: string, cwd: string, context: RitualContext, _execAsync?: (command: string, options: any) => Promise<{
    stdout: string;
    stderr: string;
}>): Promise<CommandOutcome>;
