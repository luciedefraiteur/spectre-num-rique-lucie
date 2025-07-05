import { Operation } from '../types.js';
interface HealingParameters {
    output: string;
    contextLines?: number;
}
export declare function perform(parameters: HealingParameters): Promise<Operation[]>;
export {};
