import { Operation } from '../types.js';
/**
 * Creates a simple web application with an HTML file and a JavaScript file.
 * @param parameters The parameters for the ritual.
 * @returns A list of operations to be executed by the batch editor.
 */
export declare function perform(parameters: {
    projectName: string;
    title: string;
    entryMessage: string;
}): Promise<Operation[]>;
