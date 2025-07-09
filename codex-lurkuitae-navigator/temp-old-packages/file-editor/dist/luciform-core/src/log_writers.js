"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAlma = logAlma;
exports.logEli = logEli;
exports.logNova = logNova;
exports.logZed = logZed;
exports.logGolem = logGolem;
exports.logGolemClient = logGolemClient;
exports.logPersonaAction = logPersonaAction;
exports.logRitual = logRitual;
const fsPromises = __importStar(require("fs/promises"));
async function writeLog(filename, content) {
    const logEntry = `${new Date().toISOString()}\n${content}\n\n`;
    await fsPromises.appendFile(filename, logEntry);
    console.log(logEntry); // Also output to console
}
async function logAlma(context, userIntent) {
    const content = `
## JOURNAL D'ALMA - LE CŒUR DU SYSTÈME
- **Système Actif:** ${context.personality}
- **Philosophie:** ${context.lifeSystem?.philosophy || 'Philosophie par défaut'}
- **Intention Utilisateur:** ${userIntent}
- **État Émotionnel:** ${JSON.stringify(context.kardiaSphere, null, 2)}
- **Contexte Narratif:** ${JSON.stringify(context.narrativeWeaving, null, 2)}
`;
    await writeLog('alma.log', content);
}
async function logEli(context, poeticAnalysis, suggestedNextStep) {
    const content = `
## PARCHEMIN D'ELI - L'INTERPRÈTE DES SONGES
- **Système Actif:** ${context.personality}
- **Analyse Poétique:** ${poeticAnalysis}
- **Suggestion d'Action Extraite:** ${suggestedNextStep}
`;
    await writeLog('eli.log', content);
}
async function logNova(context, naturalLanguagePlan, finalPlan) {
    const content = `
## REGISTRE DE NOVA - LE LOGICIEN
- **Système Actif:** ${context.personality}
- **Plan Rêvé (Langage Naturel):** \n${naturalLanguagePlan}
- **Plan Traduit (JSON):** \n${JSON.stringify(finalPlan, null, 2)}
`;
    await writeLog('nova.log', content);
}
async function logZed(context, failedStep, remediationPlan) {
    const content = `
## RAPPORT DE ZED - LE GUÉRISSEUR
- **Système Actif:** ${context.personality}
- **Étape Échouée:** \n${JSON.stringify(failedStep, null, 2)}
- **Plan de Remédiation Généré:** \n${JSON.stringify(remediationPlan, null, 2)}
`;
    await writeLog('zed.log', content);
}
async function logGolem(message, level = 'info') {
    const content = `
## GOLEM SERVER LOG
- **Level:** ${level.toUpperCase()}
- **Message:** ${message}
`;
    await writeLog('golem.log', content);
}
async function logGolemClient(message, level = 'info') {
    const content = `
## GOLEM CLIENT LOG
- **Level:** ${level.toUpperCase()}
- **Message:** ${message}
`;
    await writeLog('golem_client.log', content);
}
async function logPersonaAction(persona, command, ritual) {
    const content = `
## ${persona.toUpperCase()} ACTION
- **Command:** ${command}
- **Generated Ritual:**
---
${ritual || 'No ritual generated.'}
---
`;
    await writeLog(`${persona}.log`, content);
}
async function logRitual(message, logFileName = 'ritual.log') {
    await writeLog(logFileName, message);
}
//# sourceMappingURL=log_writers.js.map