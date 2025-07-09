/**
 * @file lucid_extensions.ts
 * @description Ce fichier centralise la définition des extensions syntaxiques et sémantiques de LucidScript.
 * Il est conçu pour être introspectable, permettant au compilateur de connaître ses propres capacités.
 */
export var LucidExtensionKind;
(function (LucidExtensionKind) {
    LucidExtensionKind["SymbolicInvocation"] = "SymbolicInvocation";
    LucidExtensionKind["DataPact"] = "DataPact";
    LucidExtensionKind["RitualComment"] = "RitualComment";
})(LucidExtensionKind || (LucidExtensionKind = {}));
/**
 * Détecte les extensions LucidScript dans une ligne de code donnée.
 * Pour l'instant, se concentre sur les commentaires rituels, les invocations symboliques et les pactes de données.
 * @param line La ligne de code à analyser.
 * @param lineNumber Le numéro de la ligne (pour le contexte).
 * @param offset L'offset global du début de la ligne dans le fichier.
 * @returns Un tableau des extensions détectées.
 */
export function detectLucidExtensionsInLine(line, lineNumber, offset) {
    const extensions = [];
    let startIndex; // Déclaration de startIndex à une portée plus élevée
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
        }
        else {
            let rawArgsString = symbolicInvocationMatch[2] || ''; // Get raw arguments string
            // Remove leading/trailing single or double quotes from rawArgsString
            if (rawArgsString.startsWith('\'') && rawArgsString.endsWith('\'')) {
                rawArgsString = rawArgsString.substring(1, rawArgsString.length - 1);
            }
            else if (rawArgsString.startsWith('"') && rawArgsString.endsWith('"')) {
                rawArgsString = rawArgsString.substring(1, rawArgsString.length - 1);
            }
            let parsedArgs = [];
            if (rawArgsString) {
                try {
                    // Tente de parser la chaîne d'arguments comme un tableau JSON
                    parsedArgs = JSON.parse(`[${rawArgsString}]`);
                }
                catch (e) {
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
            });
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
            });
        }
        catch (e) {
            // Gérer l'erreur de parsing JSON pour le pacte
            console.error(`[Lucid Extensions] Erreur de parsing du pacte de données: ${e}`);
        }
    }
    return extensions;
}
