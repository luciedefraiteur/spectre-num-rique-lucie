import { Operation } from '../types/base.js';
interface HealingParameters {
    output: string;
}
export declare function perform(parameters: HealingParameters): Promise<Operation[]>;
export {};
