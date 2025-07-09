import { Operation } from '../types/base.js';
interface HealingParameters {
    output: string;
    contextLines?: number;
}
export declare function perform(parameters: HealingParameters): Promise<Operation[]>;
export {};
