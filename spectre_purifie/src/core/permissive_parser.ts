// src/core/permissive_parser.ts

// Simplified permissive JSON parser
export function parsePermissiveJSON<T>(jsonString: string): T {
    try {
        // Attempt to parse normally first
        return JSON.parse(jsonString);
    } catch (e) {
        console.warn("Attempting permissive JSON parsing due to error:", e);
        // Basic attempt to fix common LLM JSON issues
        // Remove trailing commas, add missing braces, etc.
        let cleanedString = jsonString.replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        
        // Try to ensure it starts and ends with braces if it looks like an object
        if (!cleanedString.startsWith('{') && cleanedString.includes('{')) {
            cleanedString = '{' + cleanedString.substring(cleanedString.indexOf('{'));
        }
        if (!cleanedString.endsWith('}') && cleanedString.includes('}')) {
            cleanedString = cleanedString.substring(0, cleanedString.lastIndexOf('}') + 1) + '}';
        }

        try {
            return JSON.parse(cleanedString);
        } catch (e2) {
            console.error("Failed permissive JSON parsing:", e2);
            throw new Error("Could not parse JSON even permissively.");
        }
    }
}
