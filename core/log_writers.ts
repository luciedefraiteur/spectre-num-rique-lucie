import fs from 'fs';
import {RituelContext, Étape, PlanRituel} from './types.js';

function writeLog(filename: string, content: string)
{
    fs.appendFileSync(filename, `${ new Date().toISOString() }\n${ content }\n\n`);
}

export function logAlma(context: RituelContext, userIntent: string)
{
    const content = `
## JOURNAL D'ALMA - LE CŒUR DU SYSTÈME
- **Système Actif:** ${ context.personality }
- **Philosophie:** ${ context.lifeSystem?.philosophy || 'Philosophie par défaut' }
- **Intention Utilisateur:** ${ userIntent }
- **État Émotionnel:** ${ JSON.stringify(context.emotionalState, null, 2) }
- **Contexte Narratif:** ${ JSON.stringify(context.narrativeState, null, 2) }
`;
    writeLog('alma.log', content);
}

export function logEli(context: RituelContext, poeticAnalysis: string, suggestedNextStep: string)
{
    const content = `
## PARCHEMIN D'ELI - L'INTERPRÈTE DES SONGES
- **Système Actif:** ${ context.personality }
- **Analyse Poétique:** ${ poeticAnalysis }
- **Suggestion d'Action Extraite:** ${ suggestedNextStep }
`;
    writeLog('eli.log', content);
}

export function logNova(context: RituelContext, naturalLanguagePlan: string, finalPlan: PlanRituel)
{
    const content = `
## REGISTRE DE NOVA - LE LOGICIEN
- **Système Actif:** ${ context.personality }
- **Plan Rêvé (Langage Naturel):** \n${ naturalLanguagePlan }
- **Plan Traduit (JSON):** \n${ JSON.stringify(finalPlan, null, 2) }
`;
    writeLog('nova.log', content);
}

export function logZed(context: RituelContext, failedStep: Étape, remediationPlan: Étape[])
{
    const content = `
## RAPPORT DE ZED - LE GUÉRISSEUR
- **Système Actif:** ${ context.personality }
- **Étape Échouée:** \n${ JSON.stringify(failedStep, null, 2) }
- **Plan de Remédiation Généré:** \n${ JSON.stringify(remediationPlan, null, 2) }
`;
    writeLog('zed.log', content);
}