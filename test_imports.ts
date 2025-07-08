export async function main()
{
    try {
        
    console.log("[TEST] Importing handleSystemCommand...");
    import { handleSystemCommand } from './luciform-core/system_handler.js';
    console.log("✅ OK handleSystemCommand");

    console.log("[TEST] Importing LLMInterface...");
    const { LLMInterface } = await import('./luciform-core/llm_interface.js');
    console.log("✅ OK LLMInterface");

    console.log("[TEST] Importing generateRitualSequencePrompt...");
    const { generateRitualSequencePrompt } = await import('./luciform-core/prompts/generateRitualSequence.js');
    console.log("✅ OK generateRitualSequencePrompt");

    console.log("[TEST] Importing generateAnalysisPrompt...");
    const { generateAnalysisPrompt } = await import('./luciform-core/prompts/generateAnalysisPrompt.js');
    console.log("✅ OK generateAnalysisPrompt");

    console.log("[TEST] Importing types...");
    const types = await import('./luciform-core/types.js');
    console.log("✅ OK types :", Object.keys(types));

    console.log("🎉 Tous les modules ont été importés avec succès.");
    } catch (err) {
    console.error("💥 Erreur lors d’un import :", err);
    }
}

main();