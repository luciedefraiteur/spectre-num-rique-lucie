// 🔍 Types pour le vérificateur d'APIs
export var APIType;
(function (APIType) {
    APIType["OPENAI"] = "openai";
    APIType["ANTHROPIC"] = "anthropic";
    APIType["GOOGLE"] = "google";
    APIType["MISTRAL"] = "mistral";
    APIType["OLLAMA"] = "ollama";
    APIType["CUSTOM"] = "custom";
})(APIType || (APIType = {}));
