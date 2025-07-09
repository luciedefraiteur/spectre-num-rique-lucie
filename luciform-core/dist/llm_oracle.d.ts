import { Operation } from './core_types.js';
export declare function queryLlm(model: string, prompt: string): Promise<string>;
export declare function applyLlmOperation(op: Operation, variables: Map<string, string>): Promise<void>;
