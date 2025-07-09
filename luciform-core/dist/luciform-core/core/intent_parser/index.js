// This is a placeholder for a more sophisticated intent parser.
// For now, it will just extract the JSON from markdown code blocks.
function extractJsonFromMarkdown(text) {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    return match ? match[1] : null;
}
export function parseIntent(text) {
    const jsonString = extractJsonFromMarkdown(text);
    if (!jsonString) {
        console.error("[IntentParser] Aucun bloc de code JSON trouvé dans la réponse.");
        return null;
    }
    try {
        // We can use the old permissive parser here if we want to be more robust
        // For now, we'll just use the standard JSON.parse
        const parsed = JSON.parse(jsonString);
        // Basic validation to ensure it looks like a PlanRituel
        if (parsed && Array.isArray(parsed.incantations)) {
            return parsed;
        }
        console.error("[IntentParser] Le JSON extrait ne ressemble pas à un RitualPlan valide.", parsed);
        return null;
    }
    catch (error) {
        console.error(`[IntentParser] Erreur d'analyse JSON: ${error}. Input: "${jsonString}"`);
        return null;
    }
}
