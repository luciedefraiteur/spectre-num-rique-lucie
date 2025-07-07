/**
 * @file lucid_extensions.ts
 * @description Ce fichier centralise la définition des extensions syntaxiques et sémantiques de LucidScript.
 * Il est conçu pour être introspectable, permettant au compilateur de connaître ses propres capacités.
 */

export enum LucidExtensionKind {
    SymbolicInvocation = 'SymbolicInvocation',
    DataPact = 'DataPact',
    RitualComment = 'RitualComment',
}

/**
 * Représente une extension LucidScript détectée dans le code.
 */
export interface LucidExtension {
    kind: LucidExtensionKind;
    text: string;
    start: number;
    end: number;
    // Plus de propriétés spécifiques à l'extension peuvent être ajoutées ici
}

/**
 * Représente une invocation symbolique, comme `@logExecutionTime`.
 */
export interface SymbolicInvocationExtension extends LucidExtension {
    kind: LucidExtensionKind.SymbolicInvocation;
    name: string; // Ex: 'logExecutionTime'
    args?: any[]; // Ex: ['param1', 123]
}

/**
 * Représente un pacte de données, comme `@pact({"name":"MyPact","fields":{"id":"number"}})`.
 */
export interface DataPactExtension extends LucidExtension {
    kind: LucidExtensionKind.DataPact;
    pactDefinition: any; // La définition du pacte (objet JSON parsé)
}

/**
 * Détecte les extensions LucidScript dans une ligne de code donnée.
 * Pour l'instant, se concentre sur les commentaires rituels, les invocations symboliques et les pactes de données.
 * @param line La ligne de code à analyser.
 * @param lineNumber Le numéro de la ligne (pour le contexte).
 * @param offset L'offset global du début de la ligne dans le fichier.
 * @returns Un tableau des extensions détectées.
 */
export function detectLucidExtensionsInLine(line: string, lineNumber: number, offset: number): LucidExtension[] {
    const extensions: LucidExtension[] = [];

    let startIndex: number; // Déclaration de startIndex à une portée plus élevée

    // Détection des commentaires rituels en ligne (//§)
    const inlineRitualCommentMatch = line.match(/\/\/§(.*)/);
    if (inlineRitualCommentMatch) {
        const commentText = inlineRitualCommentMatch[0];
        startIndex = line.indexOf(commentText);
        extensions.push({
            kind: LucidExtensionKind.RitualComment,
            text: commentText,
            start: offset + startIndex,
            end: offset + startIndex + commentText.length,
        });
    }

    // Détection des commentaires rituels multi-lignes (/*§ ... §*/)
    const multiLineRitualCommentStartMatch = line.match(/\/\*§/);
    if (multiLineRitualCommentStartMatch) {
        const commentText = multiLineRitualCommentStartMatch[0];
        startIndex = line.indexOf(commentText);
        extensions.push({
            kind: LucidExtensionKind.RitualComment,
            text: commentText,
            start: offset + startIndex,
            end: offset + startIndex + commentText.length,
        });
    }

    const multiLineRitualCommentEndMatch = line.match(/§\*\//);
    if (multiLineRitualCommentEndMatch) {
        const commentText = multiLineRitualCommentEndMatch[0];
        startIndex = line.indexOf(commentText);
        extensions.push({
            kind: LucidExtensionKind.RitualComment,
            text: commentText,
            start: offset + startIndex,
            end: offset + startIndex + commentText.length,
        });
    }

    // Détection des invocations symboliques (@invocationName(args))
    const symbolicInvocationMatch = line.match(/@([a-zA-Z_][a-zA-Z0-9_]*)(?:\(([^)]*)\))?/);
    if (symbolicInvocationMatch) {
        const fullMatch = symbolicInvocationMatch[0];
        const name = symbolicInvocationMatch[1];

        // Exclure 'pact' de la détection des invocations symboliques pour éviter les conflits avec DataPact
        if (name === 'pact') {
            // Ne pas ajouter cette extension ici, elle sera gérée par la logique DataPact
        } else {
            let rawArgsString = symbolicInvocationMatch[2] || ''; // Get raw arguments string

            // Remove leading/trailing single or double quotes from rawArgsString
            if (rawArgsString.startsWith('\'') && rawArgsString.endsWith('\'')) {
                rawArgsString = rawArgsString.substring(1, rawArgsString.length - 1);
            } else if (rawArgsString.startsWith('"') && rawArgsString.endsWith('"')) {
                rawArgsString = rawArgsString.substring(1, rawArgsString.length - 1);
            }

            let parsedArgs: any[] = [];
            if (rawArgsString) {
                try {
                    // Tente de parser la chaîne d'arguments comme un tableau JSON
                    parsedArgs = JSON.parse(`[${rawArgsString}]`);
                } catch (e) {
                    // Si le parsing JSON échoue, traite-le comme un seul argument string
                    parsedArgs = [rawArgsString];
                }
            }

            startIndex = line.indexOf(fullMatch);
            extensions.push({
                kind: LucidExtensionKind.SymbolicInvocation,
                text: fullMatch,
                start: offset + startIndex,
                end: offset + startIndex + fullMatch.length,
                name: name,
                args: parsedArgs,
            } as SymbolicInvocationExtension);
        }
    }

    // Détection des pactes de données (@pact({...}))
    const dataPactMatch = line.match(/@pact\(([^)]*)\)/);
    if (dataPactMatch) {
        const fullMatch = dataPactMatch[0];
        const pactJsonString = dataPactMatch[1];
        startIndex = line.indexOf(fullMatch);
        try {
            const pactDefinition = JSON.parse(pactJsonString);
            extensions.push({
                kind: LucidExtensionKind.DataPact,
                text: fullMatch,
                start: offset + startIndex,
                end: offset + startIndex + fullMatch.length,
                pactDefinition: pactDefinition,
            } as DataPactExtension);
        } catch (e) {
            // Gérer l'erreur de parsing JSON pour le pacte
            console.error(`[Lucid Extensions] Erreur de parsing du pacte de données: ${e}`);
        }
    }

    return extensions;
}
