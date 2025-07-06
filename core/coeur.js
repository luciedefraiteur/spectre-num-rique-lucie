/**
 * Met à jour la présence de Lucie dans le contexte rituel.
 * @param context Le contexte rituel actuel.
 * @param luciePresenceData Les données de présence de Lucie extraites d'un luciform.
 */
export function updateLuciePresence(context, luciePresenceData) {
    context.luciePresence = { ...context.luciePresence, ...luciePresenceData };
    console.log("Lucie's presence updated in RitualContext via Coeur.");
}
//# sourceMappingURL=coeur.js.map