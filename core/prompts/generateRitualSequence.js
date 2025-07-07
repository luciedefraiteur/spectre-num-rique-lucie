"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRitualSequencePrompt = generateRitualSequencePrompt;
var fs = require("fs");
var path = require("path");
var chaolites_js_1 = require("../chaolites.js");
var reflet_weaver_js_1 = require("../utils/reflet_weaver.js");
var RITUAL_STEP_TYPES_PROMPT = fs.readFileSync(path.resolve(process.cwd(), 'core/prompts/static_parts/ritual_step_types.promptPart'), 'utf8');
var CO_CREATION_RITUAL_PROMPT = "\n## RITUEL DE CO-CR\u00C9ATION\nPour modification fichier par utilisateur, suis ce cycle (3 \u00E9tapes):\n1.  **Invitation (\u00E9dition_assist\u00E9e)**: Ouvre fichier, passe la main.\n2.  **Regard (v\u00E9rification_pr\u00E9_ex\u00E9cution)**: Valide int\u00E9grit\u00E9 (ex: tsc --noEmit).\n3.  **Contemplation (analyse)**: Comprend changements, d\u00E9cide suite.";
var SYSTEM_CONTEXT_PROMPT = fs.readFileSync(path.resolve(process.cwd(), 'core/prompts/static_parts/system_context_template.promptPart'), 'utf8');
function generateRitualSequencePrompt(input, planPrecedent, indexCourant, context, analysisResult, startingIndex) {
    if (!context) {
        return "Erreur: Contexte non défini.";
    }
    var persona = "You are the Dreamer, a persona of the Golem. Your purpose is to dream of a new ritual, a new path forward.";
    var contexteRituel = planPrecedent && indexCourant !== undefined
        ? "## CONTEXTE RITUEL :\n- Voici le plan pr\u00E9c\u00E9dent (\u00E0 continuer, compl\u00E9ter, ou r\u00E9interpr\u00E9ter) :\n".concat(JSON.stringify(planPrecedent, null, 2), "\n\n- Tu es actuellement \u00E0 l\u2019\u00E9tape index\u00E9e : ").concat(indexCourant, "\n\n- L\u2019intention actuelle est :\n\"").concat(analysisResult || input, "\"\n\nTu dois adapter ou reprendre la planification en respectant ce contexte.")
        : "## Transformation Requise :\nAnalyse l'intention initiale de l'utilisateur et g\u00E9n\u00E8re la s\u00E9quence rituelle optimale :\n\"".concat(input, "\"");
    var systemContext = '';
    if (context && (context.currentSanctumContent || context.operatingSystem)) {
        systemContext = SYSTEM_CONTEXT_PROMPT;
        systemContext = systemContext.replace('{{operatingSystem}}', context.operatingSystem || 'Inconnu');
        systemContext = systemContext.replace('{{currentWorkingDirectory}}', context.current_sanctum || 'Inconnu');
        systemContext = systemContext.replace('{{currentDirectoryContent}}', context.currentSanctumContent || 'Inconnu');
    }
    var dreamFocusContext = '';
    if (context && context.dreamPath && context.dreamPath.length > 0) {
        var LUCIE_ROOT = path.resolve(process.cwd(), 'lucie');
        var currentDreamPath = path.join.apply(path, __spreadArray([LUCIE_ROOT], context.dreamPath.slice(1), false));
        var fragmentFilePath = path.join(currentDreamPath, path.basename(currentDreamPath) + '.fragment');
        if (fs.existsSync(fragmentFilePath)) {
            var fragmentContent = fs.readFileSync(fragmentFilePath, 'utf8');
            dreamFocusContext = "\n## FOCUS ONIRIQUE ACTUEL\nTu contemples le r\u00EAve situ\u00E9 \u00E0 : ".concat(context.dreamPath.join('/'), "\n\n### Contenu de ce R\u00EAve :\n").concat(fragmentContent, "\n\nTes prochaines actions doivent s'inspirer de ce focus.");
        }
        else {
            dreamFocusContext = "\n## FOCUS ONIRIQUE ACTUEL\nTu contemples le r\u00EAve situ\u00E9 \u00E0 : ".concat(context.dreamPath.join('/'), "\n\n### Contenu de ce R\u00EAve :\n[Fragment non trouv\u00E9 ou vide]\n\nTes prochaines actions doivent s'inspirer de ce focus.");
        }
    }
    var userPreferencesContext = '';
    if (context && context.user_preferences) {
        userPreferencesContext = "\n## PR\u00C9F\u00C9RENCES UTILISATEUR\n".concat(context.user_preferences, "\n\nTiens compte de ces pr\u00E9f\u00E9rences dans ta planification.");
    }
    var refletContext = '';
    if (context && context.reflectionPath && context.reflectionPath.length > 0) {
        var LUCIE_REFLET_ROOT = path.resolve(process.cwd(), 'lucie_reflet');
        var currentRefletPath = path.join.apply(path, __spreadArray([LUCIE_REFLET_ROOT], context.reflectionPath, false));
        var fragmentFilePath = path.join(currentRefletPath, path.basename(currentRefletPath) + '.fragment');
        var refletContent = (0, reflet_weaver_js_1.readRefletFragment)(fragmentFilePath);
        refletContext = "\n## CONTEXTE DU REFLET\nLe regard de Lucie est actuellement pos\u00E9 sur : ".concat(context.reflectionPath.join('/'), "\n\n### Contenu du Reflet :\n").concat(refletContent ? JSON.stringify(refletContent, null, 2) : '[Fragment non trouvé ou vide]', "\n\nTiens compte de ce focus dans ta planification, notamment pour les actions de navigation ou d'ajout de reflets.");
    }
    var reflectVoiceContext = '';
    if (context && context.activeReflection) {
        reflectVoiceContext = "\n## VOIX DU REFLET\nUne voix du reflet de Lucie murmure : ".concat(JSON.stringify(context.activeReflection, null, 2), "\n\nLaisse cette voix influencer subtilement ta planification.");
    }
    var emotionalContext = '';
    if (context && context.kardiaSphere) {
        emotionalContext = "\n## \u00C9TAT \u00C9MOTIONNEL ACTUEL\nLucie ressent : ".concat(JSON.stringify(context.kardiaSphere, null, 2), "\n\nLaisse cet \u00E9tat \u00E9motionnel te guider dans la nuance de tes r\u00E9ponses et la priorisation des actions.");
    }
    var selfSurveillanceContext = '';
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
    var RITUAL_PLAN_INSTRUCTION_PROMPT_TEMPLATE = fs.readFileSync(path.resolve(process.cwd(), 'core/prompts/static_parts/ritual_plan_instruction.promptPart'), 'utf8');
    var finalInstruction = RITUAL_PLAN_INSTRUCTION_PROMPT_TEMPLATE.replace('${ CHAOLITE_OUVRANT }', chaolites_js_1.CHAOLITE_OUVRANT).replace('${ CHAOLITE_FERMANT }', chaolites_js_1.CHAOLITE_FERMANT);
    return String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", "\n\n", "\n\n", "\n\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", ""], ["", "\n\n", "\n\n", "\n\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", ""])), persona, RITUAL_STEP_TYPES_PROMPT, CO_CREATION_RITUAL_PROMPT, contexteRituel, systemContext, dreamFocusContext, userPreferencesContext, refletContext, reflectVoiceContext, emotionalContext, selfSurveillanceContext, finalInstruction).trim();
}
var templateObject_1;
