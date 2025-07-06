import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {Incantation, RitualContext} from '../types.js';
import {Persona} from '../personas.js';
import {CHAOLITE_FERMANT, CHAOLITE_OUVRANT} from "../chaolites.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const REMEDIATION_RITUAL_PROMPT = fs.readFileSync(path.resolve(_dirname, './static_parts/remediation_ritual.promptPart'), 'utf8');

export function generateRemediationPrompt(failedStep: Incantation, errorOutput: string, context: RitualContext): string
{
    const persona = "You are the Healer, a persona of the Golem. Your purpose is to analyze the error and generate a plan to fix it.";
    let prompt = REMEDIATION_RITUAL_PROMPT;
    prompt = prompt.replace('{{failedStep}}', JSON.stringify(failedStep, null, 2));
    prompt = prompt.replace('{{errorOutput}}', errorOutput);
    const finalInstruction = `## RÈGLE FINALE IMPÉRATIVE
Ta réponse doit commencer par une vision fractale de ta pensée, encapsulée entre les sceaux oniriques, suivie de ta réponse JSON.
1.  **Le Rêve Fractal :** Commence par le chaolite ouvrant '${ CHAOLITE_OUVRANT }', suivi de ta vision poétique et synthétique, puis termine par le chaolite fermant '${ CHAOLITE_FERMANT }'.
2.  **Le Plan de Guérison :** Après le sceau fermant, retourne UNIQUEMENT le tableau JSON du plan de remédiation.`;
    return `${ persona }\n\n${ finalInstruction }\n\n${ prompt }`;
}