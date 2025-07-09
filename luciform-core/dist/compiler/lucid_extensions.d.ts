/**
 * @file lucid_extensions.ts
 * @description Ce fichier centralise la définition des extensions syntaxiques et sémantiques de LucidScript.
 * Il est conçu pour être introspectable, permettant au compilateur de connaître ses propres capacités.
 */
export declare enum LucidExtensionKind {
    SymbolicInvocation = "SymbolicInvocation",
    DataPact = "DataPact",
    RitualComment = "RitualComment"
}
/**
 * Représente une extension LucidScript détectée dans le code.
 */
export interface LucidExtension {
    kind: LucidExtensionKind;
    text: string;
    start: number;
    end: number;
}
/**
 * Représente une invocation symbolique, comme `@logExecutionTime`.
 */
export interface SymbolicInvocationExtension extends LucidExtension {
    kind: LucidExtensionKind.SymbolicInvocation;
    name: string;
    args?: any[];
}
/**
 * Représente un pacte de données, comme `@pact({"name":"MyPact","fields":{"id":"number"}})`.
 */
export interface DataPactExtension extends LucidExtension {
    kind: LucidExtensionKind.DataPact;
    pactDefinition: any;
}
/**
 * Détecte les extensions LucidScript dans une ligne de code donnée.
 * Pour l'instant, se concentre sur les commentaires rituels, les invocations symboliques et les pactes de données.
 * @param line La ligne de code à analyser.
 * @param lineNumber Le numéro de la ligne (pour le contexte).
 * @param offset L'offset global du début de la ligne dans le fichier.
 * @returns Un tableau des extensions détectées.
 */
export declare function detectLucidExtensionsInLine(line: string, lineNumber: number, offset: number): LucidExtension[];
