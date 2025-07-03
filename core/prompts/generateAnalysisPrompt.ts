import {PlanRituel, RituelContext} from "../types.js";
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {Personas} from "../personas.js";
import {CHAOLITE_FERMANT, CHAOLITE_OUVRANT} from "../chaolites.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const ANALYSIS_PROMPT_TEMPLATE = fs.readFileSync(path.resolve(_dirname, './static_parts/analysis_prompt_template.promptPart'), 'utf8');

export function generateAnalysisPrompt({output, index, plan, original_input, context}: {
    output: string,
    index: number,
    plan: PlanRituel,
    original_input: string,
    context: RituelContext
}): string
{
    const persona = Personas.Interpreter(context);

    const analysisPrefixes = [
        "L'écho de la commande révèle :",
        "Les arcanes du Terminal murmurent :",
        "Dans le miroir du shell, nous discernons :",
        `Eli perçoit :`,
        "Le voile se lève sur :"
    ];
    const randomPrefix = analysisPrefixes[Math.floor(Math.random() * analysisPrefixes.length)];

    let promptContent = ANALYSIS_PROMPT_TEMPLATE;
    promptContent = promptContent.replace('{{personality}}', persona);
    promptContent = promptContent.replace('{{randomPrefix}}', randomPrefix);
    promptContent = promptContent.replace('{{indexPlusOne}}', (index + 1).toString());
    promptContent = promptContent.replace('{{index}}', index.toString());
    promptContent = promptContent.replace('{{originalInput}}', original_input);
    promptContent = promptContent.replace('{{output}}', output);
    promptContent = promptContent.replace('{{plan}}', JSON.stringify(plan, null, 2));

    const finalInstruction = `## RÈGLE FINALE IMPÉRATIVE
Ta réponse doit commencer par une vision fractale de ta pensée, encapsulée entre les sceaux oniriques, suivie de ta réponse structurée.
1.  **Le Rêve Fractal :** Commence par le chaolite ouvrant '${CHAOLITE_OUVRANT}', suivi de ta vision poétique et synthétique, puis termine par le chaolite fermant '${CHAOLITE_FERMANT}'.
2.  **L'Analyse :** Après le sceau fermant, suis les instructions de la mission d'analyse ci-dessus.`;

    return `${finalInstruction}\n\n${promptContent.trim()}`;
}