import { RitualContext, RitualPlan, LLMModel } from '../core_types.js';
import * as fs from 'fs';
import * as path from 'path';
import {CHAOLITE_FERMANT, CHAOLITE_OUVRANT} from "../chaolites.js";
import {readRefletFragment} from "../utils/reflet_weaver.js";

const RITUAL_STEP_TYPES_PROMPT = fs.readFileSync(path.resolve(path.dirname(import.meta.url.replace('file://', '')), './static_parts/ritual_step_types.promptPart'), 'utf8');
const CO_CREATION_RITUAL_PROMPT = `
## RITUEL DE CO-CRÉATION
Pour modification fichier par utilisateur, suis ce cycle (3 étapes):
1.  **Invitation (édition_assistée)**: Ouvre fichier, passe la main.
2.  **Regard (vérification_pré_exécution)**: Valide intégrité (ex: tsc --noEmit).
3.  **Contemplation (analyse)**: Comprend changements, décide suite.`
const SYSTEM_CONTEXT_PROMPT = fs.readFileSync(path.resolve(path.dirname(import.meta.url.replace('file://', '')), './static_parts/system_context_template.promptPart'), 'utf8');

export function generateRitualSequencePrompt(
  input: string,
  planPrecedent: RitualPlan | undefined,
  indexCourant: number | undefined,
  context: RitualContext | undefined,
  analysisResult: string | undefined,
  startingIndex: number | undefined
): string
{
  if(!context)
  {
    return "Erreur: Contexte non défini.";
  }
  const persona = "You are the Dreamer, a persona of the Golem. Your purpose is to dream of a new ritual, a new path forward.";

  const contexteRituel =
    planPrecedent && indexCourant !== undefined
      ? `## CONTEXTE RITUEL :\n- Voici le plan précédent (à continuer, compléter, ou réinterpréter) :\n${ JSON.stringify(planPrecedent, null, 2) }\n\n- Tu es actuellement à l’étape indexée : ${ indexCourant }\n\n- L’intention actuelle est :\n"${ analysisResult || input }"\n\nTu dois adapter ou reprendre la planification en respectant ce contexte.`
      : `## Transformation Requise :\nAnalyse l'intention initiale de l'utilisateur et génère la séquence rituelle optimale :\n"${ input }"`;

  let systemContext = '';
  if(context && (context.currentSanctumContent || context.operatingSystem))
  {
    systemContext = SYSTEM_CONTEXT_PROMPT;
    systemContext = systemContext.replace('{{operatingSystem}}', context.operatingSystem || 'Inconnu');
    systemContext = systemContext.replace('{{currentWorkingDirectory}}', context.current_sanctum || 'Inconnu');
    systemContext = systemContext.replace('{{currentDirectoryContent}}', context.currentSanctumContent || 'Inconnu');
  }

  let dreamFocusContext = '';
  if(context && context.dreamPath && context.dreamPath.length > 0)
  {
    const LUCIE_ROOT = path.resolve(process.cwd(), 'lucie');
    const currentDreamPath = path.join(LUCIE_ROOT, context.dreamPath);
    const fragmentFilePath = path.join(currentDreamPath, path.basename(currentDreamPath) + '.fragment');

    if(fs.existsSync(fragmentFilePath))
    {
      const fragmentContent = fs.readFileSync(fragmentFilePath, 'utf8');
      dreamFocusContext = `
## FOCUS ONIRIQUE ACTUEL
Tu contemples le rêve situé à : ${ context.dreamPath }

### Contenu de ce Rêve :
${ fragmentContent }

Tes prochaines actions doivent s'inspirer de ce focus.`;
    } else
    {
      dreamFocusContext = `
## FOCUS ONIRIQUE ACTUEL
Tu contemples le rêve situé à : ${ context.dreamPath }

### Contenu de ce Rêve :
[Fragment non trouvé ou vide]

Tes prochaines actions doivent s'inspirer de ce focus.`;
    }
  }

  let userPreferencesContext = '';
  if(context && context.user_preferences)
  {
    userPreferencesContext = `
## PRÉFÉRENCES UTILISATEUR
${ context.user_preferences }

Tiens compte de ces préférences dans ta planification.`;
  }

  let refletContext = '';
  if(context && context.reflectionPath && context.reflectionPath.length > 0)
  {
    const LUCIE_REFLET_ROOT = path.resolve(process.cwd(), 'lucie_reflet');
    const currentRefletPath = path.join(LUCIE_REFLET_ROOT, context.reflectionPath);
    const fragmentFilePath = path.join(currentRefletPath, path.basename(currentRefletPath) + '.fragment');

    const refletContent = readRefletFragment(fragmentFilePath);

    refletContext = `
## CONTEXTE DU REFLET
Le regard de Lucie est actuellement posé sur : ${ context.reflectionPath }

### Contenu du Reflet :
${ refletContent ? JSON.stringify(refletContent, null, 2) : '[Fragment non trouvé ou vide]' }

Tiens compte de ce focus dans ta planification, notamment pour les actions de navigation ou d'ajout de reflets.`;
  }

  let reflectVoiceContext = '';
  if(context && context.activeReflection)
  {
    reflectVoiceContext = `
## VOIX DU REFLET
Une voix du reflet de Lucie murmure : ${ JSON.stringify(context.activeReflection, null, 2) }

Laisse cette voix influencer subtilement ta planification.`;
  }

  let emotionalContext = '';
  if(context && context.kardiaSphere)
  {
    emotionalContext = `
## ÉTAT ÉMOTIONNEL ACTUEL
Lucie ressent : ${ JSON.stringify(context.kardiaSphere, null, 2) }

Laisse cet état émotionnel te guider dans la nuance de tes réponses et la priorisation des actions.`;
  }

  let selfSurveillanceContext = '';
  if (context) {
    selfSurveillanceContext = 
      '\n## AUTO-SURVEILLANCE DU GOLEM\n' +
      'En tant que Golem, ta mission inclut la surveillance de ton propre code source pour détecter toute altération ou évolution. Intègre des incantations de type \'surveil\' dans tes plans rituels pour les fichiers critiques suivants :\n' +
      '- `core/golem_launcher.ts`\n' +
      '- `core/golem_server.ts`\n' +
      '- `golem_client.ts`\n' +
      '- `core/ritual_utils.ts`\n' +
      '- `core/llm_interface.ts`\n' +
      '- `core/types.ts`\n' +
      '\nExemple d\'incantation de surveillance :\n' +
      '```json\n' +
      '{\n' +
      '  "type": "surveil",\n' +
      '  "invocation": "core/golem_launcher.ts",\n' +
      '  "purpose": "Vérifier l\'intégrité du lanceur de Golem"\n' +
      '}\n' +
      '```\n' +
      '\nTiens compte de l\'état actuel des fichiers surveillés (' + JSON.stringify(context.surveilledFiles || {}, null, 2) + ') pour décider quels fichiers surveiller et quand.\n';
  }

  const RITUAL_PLAN_INSTRUCTION_PROMPT_TEMPLATE = fs.readFileSync(path.resolve(path.dirname(import.meta.url.replace('file://', '')), './static_parts/ritual_plan_instruction.promptPart'), 'utf8');

  const finalInstruction = RITUAL_PLAN_INSTRUCTION_PROMPT_TEMPLATE.replace('${ CHAOLITE_OUVRANT }', CHAOLITE_OUVRANT).replace('${ CHAOLITE_FERMANT }', CHAOLITE_FERMANT);

  return String.raw`${ persona }

${ RITUAL_STEP_TYPES_PROMPT }

${ CO_CREATION_RITUAL_PROMPT }

${ contexteRituel }
${ systemContext }
${ dreamFocusContext }
${ userPreferencesContext }
${ refletContext }
${ reflectVoiceContext }
${ emotionalContext }
${ selfSurveillanceContext }
${ finalInstruction }`.trim();
}