/**
 * @file parser.ts
 * @description Phase 1 du compilateur : Le Parser Universel (L'Œil).
 * Ce module transforme le code source en Arbre Syntaxique Abstrait (AST).
 */
import * as ts from 'typescript';
/**
 * Parse le code source et retourne l'AST.
 * @param source Le code source à parser.
 * @param filePath Le chemin du fichier pour la détection du dialecte.
 * @param verbose Active le mode verbeux pour le débogage.
 * @returns L'AST généré par le compilateur TypeScript.
 */
export declare function parse(source: string, filePath: string, verbose?: boolean): ts.SourceFile;
