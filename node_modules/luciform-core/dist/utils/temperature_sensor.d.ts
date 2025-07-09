import { ExecException } from 'child_process';
import { osHint } from './osHint.js';
type ExecCallback = (command: string, callback: (error: ExecException | null, stdout: string, stderr: string) => void) => void;
/**
 * Retourne la température CPU actuelle en degrés Celsius.
 * Retourne null si la température n'a pas pu être lue.
 */
export declare function getCpuTemperature(_exec?: ExecCallback, _osHint?: typeof osHint): Promise<number | null>;
export {};
