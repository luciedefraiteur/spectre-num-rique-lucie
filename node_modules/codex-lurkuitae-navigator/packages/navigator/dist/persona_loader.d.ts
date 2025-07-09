export interface Persona {
    name: string;
    description: string;
    job?: {
        prompt: string;
    };
    llm_model?: any;
}
export declare function loadPersonas(personasPath: string): Persona[];
