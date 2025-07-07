"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRemediationPrompt = generateRemediationPrompt;
var fs = require("fs");
var path = require("path");
var chaolites_js_1 = require("../chaolites.js");
var REMEDIATION_RITUAL_PROMPT = fs.readFileSync(path.resolve(process.cwd(), 'core/prompts/static_parts/remediation_ritual.promptPart'), 'utf8');
function generateRemediationPrompt(failedStep, errorOutput, context) {
    var persona = "You are the Healer, a persona of the Golem. Your purpose is to analyze the error and generate a plan to fix it.";
    var prompt = REMEDIATION_RITUAL_PROMPT;
    prompt = prompt.replace('{{failedStep}}', JSON.stringify(failedStep, null, 2));
    prompt = prompt.replace('{{errorOutput}}', errorOutput);
    var finalInstruction = "## R\u00C8GLE FINALE IMP\u00C9RATIVE\nTa r\u00E9ponse doit commencer par une vision fractale de ta pens\u00E9e, encapsul\u00E9e entre les sceaux oniriques, suivie de ta r\u00E9ponse JSON.\n1.  **Le R\u00EAve Fractal :** Commence par le chaolite ouvrant '".concat(chaolites_js_1.CHAOLITE_OUVRANT, "', suivi de ta vision po\u00E9tique et synth\u00E9tique, puis termine par le chaolite fermant '").concat(chaolites_js_1.CHAOLITE_FERMANT, "'.\n2.  **Le Plan de Gu\u00E9rison :** Apr\u00E8s le sceau fermant, retourne UNIQUEMENT le tableau JSON du plan de rem\u00E9diation.");
    return "".concat(persona, "\n\n").concat(finalInstruction, "\n\n").concat(prompt);
}
