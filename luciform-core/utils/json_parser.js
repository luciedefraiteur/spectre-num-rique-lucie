"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePermissive = parsePermissive;
var JSON5 = require("json5");
var zod_1 = require("zod");
/**
 * Analyse une chaîne JSON de manière permissive en utilisant JSON5.
 * Valide le résultat par rapport à un schéma Zod optionnel.
 *
 * @template T
 * @param {string} jsonString La chaîne JSON à analyser.
 * @param {z.ZodType<T>} [schema] Le schéma Zod optionnel pour la validation.
 * @returns {T} L'objet analysé et validé.
 * @throws {Error} Si l'analyse échoue ou si la validation du schéma échoue.
 */
function parsePermissive(jsonString, schema) {
    try {
        var parsed = JSON5.parse(jsonString);
        if (schema) {
            return schema.parse(parsed);
        }
        return parsed;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw new Error("Erreur de validation du sch\u00E9ma JSON : ".concat(error.errors.map(function (e) { return "".concat(e.path.join('.'), ": ").concat(e.message); }).join(', ')));
        }
        // Pour les erreurs d'analyse JSON5 ou autres erreurs inattendues
        var errorMessage = (error instanceof Error) ? error.message : String(error);
        throw new Error("\u00C9chec de l'analyse JSON permissive : ".concat(errorMessage));
    }
}
