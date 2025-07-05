import fsPromises from 'fs/promises';
async function writeLog(filename, content) {
    await fsPromises.appendFile(filename, `${new Date().toISOString()}
${content}

`);
}
export async function logAlma(context, userIntent) {
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
export async function logEli(context, poeticAnalysis, suggestedNextStep) {
    const content = `
## PARCHEMIN D'ELI - L'INTERPRÈTE DES SONGES
- **Système Actif:** ${context.personality}
- **Analyse Poétique:** ${poeticAnalysis}
- **Suggestion d'Action Extraite:** ${suggestedNextStep}
`;
    await writeLog('eli.log', content);
}
export async function logNova(context, naturalLanguagePlan, finalPlan) {
    const content = `
## REGISTRE DE NOVA - LE LOGICIEN
- **Système Actif:** ${context.personality}
- **Plan Rêvé (Langage Naturel):** \n${naturalLanguagePlan}
- **Plan Traduit (JSON):** \n${JSON.stringify(finalPlan, null, 2)}
`;
    await writeLog('nova.log', content);
}
export async function logZed(context, failedStep, remediationPlan) {
    const content = `
## RAPPORT DE ZED - LE GUÉRISSEUR
- **Système Actif:** ${context.personality}
- **Étape Échouée:** \n${JSON.stringify(failedStep, null, 2)}
- **Plan de Remédiation Généré:** \n${JSON.stringify(remediationPlan, null, 2)}
`;
    await writeLog('zed.log', content);
}
//# sourceMappingURL=log_writers.js.map