/**
 * @file parser.ts
 * @description Phase 1 du compilateur : Le Parser Universel (L'Œil).
 * Ce module transforme le code source en Arbre Syntaxique Abstrait (AST).
 */

import * as ts from 'typescript';
import { normalizeLineEndings, detectDialect, Dialect } from './prelude';
import { detectLucidExtensionsInLine, LucidExtensionKind, SymbolicInvocationExtension, DataPactExtension } from './lucid_extensions';

/**
 * Échappe les caractères spéciaux d'une chaîne pour l'utiliser dans une expression régulière.
 * @param text La chaîne à échapper.
 * @returns La chaîne échappée.
 */
function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Parse le code source et retourne l'AST.
 * @param source Le code source à parser.
 * @param filePath Le chemin du fichier pour la détection du dialecte.
 * @param verbose Active le mode verbeux pour le débogage.
 * @returns L'AST généré par le compilateur TypeScript.
 */
export function parse(source: string, filePath: string, verbose: boolean = false): ts.SourceFile {
    const normalizedSource = normalizeLineEndings(source);
    const dialect = detectDialect(filePath);

    let transformedSource = '';
    let currentOffset = 0;

    const lines = normalizedSource.split(/\r?\n/);

    if (verbose) {
        console.log(`[Parser] Début du parsing pour: ${filePath} (Dialecte: ${dialect})`);
        console.log(`[Parser] Source normalisée:\n${normalizedSource}`);
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const extensions = detectLucidExtensionsInLine(line, i, currentOffset);
        let processedLine = line;

        if (extensions.length > 0 && verbose) {
            console.log(`[Parser] Ligne ${i + 1}: Détection d'extensions LucidScript.`);
        }

        for (const ext of extensions) {
            if (verbose) {
                console.log(`[Parser]   - Extension détectée: ${ext.kind} (Texte: '${ext.text}')`);
            }

            if (ext.kind === LucidExtensionKind.SymbolicInvocation) {
                const symbolicInvocation = ext as SymbolicInvocationExtension;
                // Sérialise les arguments en une chaîne JSON pour l'injection
                const argsJson = JSON.stringify(symbolicInvocation.args || []);
                const replacement = `__lucid_invoke__('${symbolicInvocation.name}', ...${argsJson});`;
                
                // Échapper la chaîne de recherche pour éviter l'interprétation comme regex
                const escapedSearchText = escapeRegExp(symbolicInvocation.text);
                processedLine = processedLine.replace(new RegExp(escapedSearchText, 'g'), replacement);

                if (verbose) {
                    console.log(`[Parser]     -> Transformé en: '${replacement}'`);
                }
            } else if (ext.kind === LucidExtensionKind.DataPact) {
                const dataPact = ext as DataPactExtension;
                const escapedSearchText = escapeRegExp(dataPact.text);

                if (verbose) {
                    console.log(`[Parser Debug] DataPact - processedLine before replace: '${processedLine}'`);
                    console.log(`[Parser Debug] DataPact - dataPact.text: '${dataPact.text}'`);
                    console.log(`[Parser Debug] DataPact - escapedSearchText: '${escapedSearchText}'`);
                }

                processedLine = processedLine.replace(new RegExp(escapedSearchText, 'g'), '');

                if (verbose) {
                    console.log(`[Parser Debug] DataPact - processedLine after replace: '${processedLine}'`);
                }
            }
        }
        transformedSource += processedLine + '\n';
        currentOffset += line.length + 1; // +1 pour le caractère de nouvelle ligne
    }

    if (verbose) {
        console.log(`[Parser] Source transformée finale:\n${transformedSource}`);
        console.log(`[Parser] Fin du parsing pour: ${filePath}`);
    }

    // Pour l'instant, nous utilisons le parser TypeScript pour tous les dialectes.
    // Nous étendrons cela plus tard pour gérer la syntaxe LucidScript.
    return ts.createSourceFile(
        filePath,
        transformedSource,
        ts.ScriptTarget.Latest,
        true, // setParentNodes
        getScriptKind(dialect)
    );
}

function getScriptKind(dialect: Dialect): ts.ScriptKind {
    switch (dialect) {
        case 'javascript':
            return ts.ScriptKind.JS;
        case 'typescript':
            return ts.ScriptKind.TS;
        case 'lucidscript':
            // Pour l'instant, on traite le lucidscript comme du typescript
            return ts.ScriptTarget.Latest;
        default:
            return ts.ScriptKind.Unknown;
    }
}
