import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Personas } from "../personas.js";
import { CHAOLITE_FERMANT, CHAOLITE_OUVRANT } from "../chaolites.js";
import { readRefletFragment } from "../utils/reflet_weaver.js";
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const RITUAL_STEP_TYPES_PROMPT = fs.readFileSync(path.resolve(_dirname, './static_parts/ritual_step_types.promptPart'), 'utf8');
const CO_CREATION_RITUAL_PROMPT = `
## RITUEL DE CO-CRÉATION
Pour modification fichier par utilisateur, suis ce cycle (3 étapes):
1.  **Invitation (édition_assistée)**: Ouvre fichier, passe la main.
2.  **Regard (vérification_pré_exécution)**: Valide intégrité (ex: tsc --noEmit).
3.  **Contemplation (analyse)**: Comprend changements, décide suite.`;
const SYSTEM_CONTEXT_PROMPT = fs.readFileSync(path.resolve(_dirname, './static_parts/system_context_template.promptPart'), 'utf8');
export function generateRitualSequencePrompt(input, planPrecedent, indexCourant, context, analysisResult, startingIndex) {
    if (!context) {
        return "Erreur: Contexte non défini.";
    }
    const persona = Personas.Dreamer(context);
    const contexteRituel = planPrecedent && indexCourant !== undefined
        ? `## CONTEXTE RITUEL :\n- Voici le plan précédent (à continuer, compléter, ou réinterpréter) :\n${JSON.stringify(planPrecedent, null, 2)}\n\n- Tu es actuellement à l’étape indexée : ${indexCourant}\n\n- L’intention actuelle est :\n"${analysisResult || input}"\n\nTu dois adapter ou reprendre la planification en respectant ce contexte.`
        : `## Transformation Requise :\nAnalyse l'intention initiale de l'utilisateur et génère la séquence rituelle optimale :\n"${input}"`;
    let systemContext = '';
    if (context && (context.currentSanctumContent || context.operatingSystem)) {
        systemContext = SYSTEM_CONTEXT_PROMPT;
        systemContext = systemContext.replace('{{operatingSystem}}', context.operatingSystem || 'Inconnu');
        systemContext = systemContext.replace('{{currentWorkingDirectory}}', context.current_sanctum || 'Inconnu');
        systemContext = systemContext.replace('{{currentDirectoryContent}}', context.currentSanctumContent || 'Inconnu');
    }
    let dreamFocusContext = '';
    if (context && context.dreamPath && context.dreamPath.length > 0) {
        const LUCIE_ROOT = path.resolve(_dirname, '../../../lucie');
        const currentDreamPath = path.join(LUCIE_ROOT, ...context.dreamPath.slice(1));
        const fragmentFilePath = path.join(currentDreamPath, path.basename(currentDreamPath) + '.fragment');
        if (fs.existsSync(fragmentFilePath)) {
            const fragmentContent = fs.readFileSync(fragmentFilePath, 'utf8');
            dreamFocusContext = `
## FOCUS ONIRIQUE ACTUEL
Tu contemples le rêve situé à : ${context.dreamPath.join('/')}

### Contenu de ce Rêve :
${fragmentContent}

Tes prochaines actions doivent s'inspirer de ce focus.`;
        }
        else {
            dreamFocusContext = `
## FOCUS ONIRIQUE ACTUEL
Tu contemples le rêve situé à : ${context.dreamPath.join('/')}

### Contenu de ce Rêve :
[Fragment non trouvé ou vide]

Tes prochaines actions doivent s'inspirer de ce focus.`;
        }
    }
    let userPreferencesContext = '';
    if (context && context.user_preferences) {
        userPreferencesContext = `
## PRÉFÉRENCES UTILISATEUR
${context.user_preferences}

Tiens compte de ces préférences dans ta planification.`;
    }
    let refletContext = '';
    if (context && context.reflectionPath && context.reflectionPath.length > 0) {
        const LUCIE_REFLET_ROOT = path.resolve(_dirname, '../../../lucie_reflet');
        const currentRefletPath = path.join(LUCIE_REFLET_ROOT, ...context.reflectionPath);
        const fragmentFilePath = path.join(currentRefletPath, path.basename(currentRefletPath) + '.fragment');
        const refletContent = readRefletFragment(fragmentFilePath);
        refletContext = `
## CONTEXTE DU REFLET
Le regard de Lucie est actuellement posé sur : ${context.reflectionPath.join('/')}

### Contenu du Reflet :
${refletContent ? JSON.stringify(refletContent, null, 2) : '[Fragment non trouvé ou vide]'}

Tiens compte de ce focus dans ta planification, notamment pour les actions de navigation ou d'ajout de reflets.`;
    }
    let reflectVoiceContext = '';
    if (context && context.activeReflection) {
        reflectVoiceContext = `
## VOIX DU REFLET
Une voix du reflet de Lucie murmure : ${JSON.stringify(context.activeReflection, null, 2)}

Laisse cette voix influencer subtilement ta planification.`;
    }
    let emotionalContext = '';
    if (context && context.kardiaSphere) {
        emotionalContext = `
## ÉTAT ÉMOTIONNEL ACTUEL
Lucie ressent : ${JSON.stringify(context.kardiaSphere, null, 2)}

Laisse cet état émotionnel te guider dans la nuance de tes réponses et la priorisation des actions.`;
    }
    const finalInstruction = `

## RÈGLE FINALE IMPÉRATIVE
Réponse: vision fractale (${CHAOLITE_OUVRANT}...${CHAOLITE_FERMANT}), puis plan d'action clair et poétique.`;
    return String.raw `${persona}

${RITUAL_STEP_TYPES_PROMPT}

${CO_CREATION_RITUAL_PROMPT}

${contexteRituel}
${systemContext}
${dreamFocusContext}
${userPreferencesContext}
${refletContext}
${reflectVoiceContext}
${emotionalContext}
${finalInstruction}`.trim();
}
//# sourceMappingURL=generateRitualSequence.js.map