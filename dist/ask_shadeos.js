import { invokeShadeOs } from './luciform-core/shade_os.js';
async function askShadeOsAboutLuciformSpec() { const command = "Describe in detail the .luciform file format, including its structure, purpose, and examples of its components like [Contexte], [Action], and ---PAS--- separators. Provide this as a direct explanation, not as a plan to create a luciform."; const invoker = "gemini"; const previousRitual = null; const previousError = null; const lucie_s_voice = null; console.log("Asking ShadeOs to describe the luciform specification..."); try {
    const response = await invokeShadeOs(command, invoker, previousRitual, previousError, lucie_s_voice);
    console.log("\n--- ShadeOs's Luciform Specification ---");
    console.log(response);
    console.log("----------------------------------------");
}
catch (error) {
    console.error("Error asking ShadeOs:", error);
} }
askShadeOsAboutLuciformSpec();
