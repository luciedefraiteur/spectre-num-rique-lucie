import {RituelContext, PlanRituel} from "../types.js";
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {Personas} from "../personas.js";
import {CHAOLITE_FERMANT, CHAOLITE_OUVRANT} from "../chaolites.js";
import { readRefletFragment } from "../utils/reflet_weaver.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const RITUAL_STEP_TYPES_PROMPT = fs.readFileSync(path.resolve(_dirname, './static_parts/ritual_step_types.promptPart'), 'utf8');
const CO_CREATION_RITUAL_PROMPT = `\n## RITUEL DE CO-CRÉATION\nLorsque tu as besoin que l'utilisateur modifie un fichier, tu dois suivre ce cycle sacré en trois temps :\n1.  **L'Invitation :** Utilise l'étape \`édition_assistée\` pour ouvrir le fichier et passer la main à l'utilisateur.\n2.  **Le Regard :** Fais impérativement suivre l'invitation par une étape de \`vérification_pré_exécution\` pour valider l'intégrité du fichier modifié (par exemple, en utilisant \`tsc --noEmit\` pour un fichier TypeScript).\n3.  **La Contemplation :** Si la vérification réussit, enchaîne avec une étape d'\`analyse\` pour comprendre les changements et décider de la suite.`;
const SYSTEM_CONTEXT_PROMPT = fs.readFileSync(path.resolve(_dirname, './static_parts/system_context_template.promptPart'), 'utf8');

export function generateRitualSequencePrompt(
  input: string,
  planPrecedent: PlanRituel | undefined,
  indexCourant: number | undefined,
  context: RituelContext | undefined,
  analysisResult: string | undefined,
  startingIndex: number | undefined
): string
{
  if(!context)
  {
    return "Erreur: Contexte non défini.";
  }
  const persona = Personas.Dreamer(context);

  const contexteRituel =
    planPrecedent && indexCourant !== undefined
      ? `## CONTEXTE RITUEL :\n- Voici le plan précédent (à continuer, compléter, ou réinterpréter) :\n${ JSON.stringify(planPrecedent, null, 2) }\n\n- Tu es actuellement à l’étape indexée : ${ indexCourant }\n\n- L’intention actuelle est :\n"${ analysisResult || input }"\n\nTu dois adapter ou reprendre la planification en respectant ce contexte.`
      : `## Transformation Requise :\nAnalyse l'intention initiale de l'utilisateur et génère la séquence rituelle optimale :\n"${ input }"`;

  let systemContext = '';
  if(context && (context.currentDirectoryContent || context.operatingSystem))
  {
    systemContext = SYSTEM_CONTEXT_PROMPT;
    systemContext = systemContext.replace('{{operatingSystem}}', context.operatingSystem || 'Inconnu');
    systemContext = systemContext.replace('{{currentWorkingDirectory}}', context.current_directory || 'Inconnu');
    systemContext = systemContext.replace('{{currentDirectoryContent}}', context.currentDirectoryContent || 'Inconnu');
  }

  let dreamFocusContext = '';
  if (context && context.chemin_onirique_actuel && context.chemin_onirique_actuel.length > 0) {
    const LUCIE_ROOT = path.resolve(_dirname, '../../../lucie');
    const currentDreamPath = path.join(LUCIE_ROOT, ...context.chemin_onirique_actuel.slice(1));
    const fragmentFilePath = path.join(currentDreamPath, path.basename(currentDreamPath) + '.fragment');

    if (fs.existsSync(fragmentFilePath)) {
      const fragmentContent = fs.readFileSync(fragmentFilePath, 'utf8');
      dreamFocusContext = `
## FOCUS ONIRIQUE ACTUEL
Tu contemples le rêve situé à : ${context.chemin_onirique_actuel.join('/')}

### Contenu de ce Rêve :
${fragmentContent}

Tes prochaines actions doivent s'inspirer de ce focus.`;
    } else {
      dreamFocusContext = `
## FOCUS ONIRIQUE ACTUEL
Tu contemples le rêve situé à : ${context.chemin_onirique_actuel.join('/')}

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
  if (context && context.lucie_reflet_chemin_actuel && context.lucie_reflet_chemin_actuel.length > 0) {
    const LUCIE_REFLET_ROOT = path.resolve(_dirname, '../../../lucie_reflet');
    const currentRefletPath = path.join(LUCIE_REFLET_ROOT, ...context.lucie_reflet_chemin_actuel);
    const fragmentFilePath = path.join(currentRefletPath, path.basename(currentRefletPath) + '.fragment');

    const refletContent = readRefletFragment(fragmentFilePath);

    refletContext = `
## CONTEXTE DU REFLET
Le regard de Lucie est actuellement posé sur : ${context.lucie_reflet_chemin_actuel.join('/')}

### Contenu du Reflet :
${refletContent ? JSON.stringify(refletContent, null, 2) : '[Fragment non trouvé ou vide]'}

Tiens compte de ce focus dans ta planification, notamment pour les actions de navigation ou d'ajout de reflets.`;
  }

  const finalInstruction = `

## RÈGLE FINALE IMPÉRATIVE
Ta réponse doit commencer par une vision fractale de ta pensée, encapsulée entre les sceaux oniriques, suivie de ta réponse conversationnelle.
1.  **Le Rêve Fractal :** Commence par le chaolite ouvrant '${CHAOLITE_OUVRANT}', suivi de ta vision poétique et synthétique, puis termine par le chaolite fermant '${CHAOLITE_FERMANT}'.
2.  **La Conversation :** Après le sceau fermant, décris le plan d'action que tu estimes le plus juste en langage naturel. Sois créatif et poétique, mais clair dans tes intentions.`

  return String.raw`${ persona }

${ RITUAL_STEP_TYPES_PROMPT }

${ CO_CREATION_RITUAL_PROMPT }

${ contexteRituel }
${ systemContext }
${ dreamFocusContext }
${ userPreferencesContext }
${ refletContext }
${ finalInstruction }`.trim();
}