"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnalysisPrompt = generateAnalysisPrompt;
var fs = require("fs");
var path = require("path");
var chaolites_js_1 = require("../chaolites.js");
var ANALYSIS_PROMPT_TEMPLATE = fs.readFileSync(path.resolve(process.cwd(), 'core/prompts/static_parts/analysis_prompt_template.promptPart'), 'utf8');
function generateAnalysisPrompt(_a) {
    var output = _a.output, index = _a.index, plan = _a.plan, original_input = _a.original_input, context = _a.context;
    var persona = "You are the Interpreter, a persona of the Golem. Your purpose is to analyze the user's intention and provide a clear, concise summary of their goal.";
    var analysisPrefixes = [
        "L'écho de la commande révèle :",
        "Les arcanes du Terminal murmurent :",
        "Dans le miroir du shell, nous discernons :",
        "Eli per\u00E7oit :",
        "Le voile se lève sur :"
    ];
    var randomPrefix = analysisPrefixes[Math.floor(Math.random() * analysisPrefixes.length)];
    var promptContent = ANALYSIS_PROMPT_TEMPLATE;
    promptContent = promptContent.replace('{{personality}}', persona);
    promptContent = promptContent.replace('{{randomPrefix}}', randomPrefix);
    promptContent = promptContent.replace('{{indexPlusOne}}', (index + 1).toString());
    promptContent = promptContent.replace('{{index}}', index.toString());
    promptContent = promptContent.replace('{{originalInput}}', original_input);
    promptContent = promptContent.replace('{{output}}', output);
    promptContent = promptContent.replace('{{plan}}', JSON.stringify(plan, null, 2));
    var finalInstruction = "## R\u00C8GLE FINALE IMP\u00C9RATIVE\nTa r\u00E9ponse doit commencer par une vision fractale de ta pens\u00E9e, encapsul\u00E9e entre les sceaux oniriques, suivie de ta r\u00E9ponse structur\u00E9e.\n1.  **Le R\u00EAve Fractal :** Commence par le chaolite ouvrant '".concat(chaolites_js_1.CHAOLITE_OUVRANT, "', suivi de ta vision po\u00E9tique et synth\u00E9tique, puis termine par le chaolite fermant '").concat(chaolites_js_1.CHAOLITE_FERMANT, "'.\n2.  **L'Analyse :** Apr\u00E8s le sceau fermant, suis les instructions de la mission d'analyse ci-dessus.");
    return "".concat(finalInstruction, "\n\n").concat(promptContent.trim());
}
