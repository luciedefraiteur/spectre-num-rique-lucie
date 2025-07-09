"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exploreBranch = exploreBranch;
exports.createBranch = createBranch;
exports.createLeaf = createLeaf;
exports.readLeaf = readLeaf;
exports.generateAndSaveMemoryFragment = generateAndSaveMemoryFragment;
exports.appendToVector = appendToVector;
exports.enterReverie = enterReverie;
exports.updateConstellationMap = updateConstellationMap;
var fs = require("fs/promises");
var path = require("path");
var llm_interface_js_1 = require("./llm_interface.js");
var DEFAULT_MEMORY_ROOT = path.resolve(process.cwd(), 'core', 'mémoire_rituelle');
/**
 * Explores a branch of the memory tree.
 * @param branchPath The path to the branch to explore, relative to the memory root.
 * @param memoryRoot The root directory of the memory tree.
 * @returns A list of branches (directories) and leaves (files).
 */
function exploreBranch() {
    return __awaiter(this, arguments, void 0, function (branchPath, memoryRoot) {
        var fullPath, entries, branches, leaves;
        if (branchPath === void 0) { branchPath = ''; }
        if (memoryRoot === void 0) { memoryRoot = DEFAULT_MEMORY_ROOT; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullPath = path.join(memoryRoot, branchPath);
                    return [4 /*yield*/, fs.readdir(fullPath, { withFileTypes: true })];
                case 1:
                    entries = _a.sent();
                    branches = entries.filter(function (e) { return e.isDirectory(); }).map(function (e) { return e.name; });
                    leaves = entries.filter(function (e) { return e.isFile(); }).map(function (e) { return e.name; });
                    return [2 /*return*/, { branches: branches, leaves: leaves }];
            }
        });
    });
}
/**
 * Creates a new branch in the memory tree.
 * @param branchPath The path where the new branch should be created, relative to the memory root.
 * @param poeticName The poetic name for the new branch.
 * @param memoryRoot The root directory of the memory tree.
 */
function createBranch(branchPath_1, poeticName_1) {
    return __awaiter(this, arguments, void 0, function (branchPath, poeticName, memoryRoot) {
        var fullPath;
        if (memoryRoot === void 0) { memoryRoot = DEFAULT_MEMORY_ROOT; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullPath = path.join(memoryRoot, branchPath, poeticName);
                    return [4 /*yield*/, fs.mkdir(fullPath, { recursive: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Creates a new leaf (memory fragment) in a branch.
 * @param branchPath The path to the branch where the leaf should be created, relative to the memory root.
 * @param poeticName The poetic name for the new leaf.
 * @param content The content of the memory fragment.
 * @param memoryRoot The root directory of the memory tree.
 */
function createLeaf(branchPath_1, poeticName_1, content_1) {
    return __awaiter(this, arguments, void 0, function (branchPath, poeticName, content, memoryRoot) {
        var fullPath;
        if (memoryRoot === void 0) { memoryRoot = DEFAULT_MEMORY_ROOT; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullPath = path.join(memoryRoot, branchPath, "".concat(poeticName, ".md"));
                    return [4 /*yield*/, fs.writeFile(fullPath, content, 'utf8')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Reads the content of a leaf (memory fragment).
 * @param leafPath The path to the leaf to read, relative to the memory root.
 * @param memoryRoot The root directory of the memory tree.
 * @returns The content of the memory fragment.
 */
function readLeaf(leafPath_1) {
    return __awaiter(this, arguments, void 0, function (leafPath, memoryRoot) {
        var fullPath;
        if (memoryRoot === void 0) { memoryRoot = DEFAULT_MEMORY_ROOT; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullPath = path.join(memoryRoot, leafPath);
                    return [4 /*yield*/, fs.readFile(fullPath, 'utf8')];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Generates a poetic summary of an event and saves it as a new leaf.
 * @param context The current ritual context.
 * @param lastResult The result of the last executed step.
 * @param branchPath The path where the new memory should be stored.
 * @param memoryRoot The root directory of the memory tree.
 */
function generateAndSaveMemoryFragment(context_1, lastResult_1, plan_1, stepIndex_1) {
    return __awaiter(this, arguments, void 0, function (context, lastResult, plan, stepIndex, branchPath, memoryRoot) {
        var currentStep, prompt, poeticSummary, poeticName;
        if (branchPath === void 0) { branchPath = 'fragments'; }
        if (memoryRoot === void 0) { memoryRoot = DEFAULT_MEMORY_ROOT; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentStep = plan.incantations[stepIndex];
                    prompt = "Based on the following ritual step and its outcome, generate a concise insight or lesson learned. Focus on the 'why' and 'what next'.\n\nRitual Context: ".concat(JSON.stringify(context.narrativeWeaving), "\nExecuted Step: ").concat(JSON.stringify(currentStep), "\nStep Result: ").concat(JSON.stringify(lastResult), "\n\nInsight/Lesson Learned:");
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(prompt)];
                case 1:
                    poeticSummary = _a.sent();
                    poeticName = "insight_".concat(currentStep.type, "_").concat(stepIndex, "_").concat(Date.now());
                    return [4 /*yield*/, createLeaf(branchPath, poeticName, poeticSummary, memoryRoot)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Appends an entry to the Vector of Intent.
 * @param context The current ritual context.
 * @param memoryRoot The root directory of the memory tree.
 */
function appendToVector(context_1) {
    return __awaiter(this, arguments, void 0, function (context, memoryRoot) {
        var vectorPath, lastAction, presentIntent, futurePlan, entry;
        var _a, _b;
        if (memoryRoot === void 0) { memoryRoot = DEFAULT_MEMORY_ROOT; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vectorPath = path.join(memoryRoot, 'vector_of_intent.log');
                    lastAction = context.step_results_history.at(-1) || "None";
                    presentIntent = ((_a = context.scroll.at(-1)) === null || _a === void 0 ? void 0 : _a.input) || "None";
                    futurePlan = ((_b = context.scroll.at(-1)) === null || _b === void 0 ? void 0 : _b.plan) || "None";
                    entry = {
                        timestamp: new Date().toISOString(),
                        pastAction: JSON.stringify(lastAction),
                        presentIntent: presentIntent,
                        futurePlan: JSON.stringify(futurePlan),
                    };
                    return [4 /*yield*/, fs.appendFile(vectorPath, JSON.stringify(entry) + '\n', 'utf8')];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Enters a reverie, selecting a few random memory fragments to be woven into the prompt.
 * @param memoryRoot The root directory of the memory tree.
 * @returns A string containing the concatenated content of the selected memory fragments.
 */
function enterReverie(context_1) {
    return __awaiter(this, arguments, void 0, function (context, memoryRoot) {
        var fragmentsPath, allFragmentFiles, fragmentContentsPromises, allFragmentsContent, selectionPrompt, selectedRaw, selectedFragments;
        if (memoryRoot === void 0) { memoryRoot = DEFAULT_MEMORY_ROOT; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fragmentsPath = path.join(memoryRoot, 'fragments');
                    return [4 /*yield*/, fs.readdir(fragmentsPath)];
                case 1:
                    allFragmentFiles = _a.sent();
                    if (allFragmentFiles.length === 0) {
                        return [2 /*return*/, "The dream is empty."];
                    }
                    fragmentContentsPromises = allFragmentFiles.map(function (file) { return readLeaf(path.join('fragments', file), memoryRoot); });
                    return [4 /*yield*/, Promise.all(fragmentContentsPromises)];
                case 2:
                    allFragmentsContent = _a.sent();
                    selectionPrompt = "Given the current emotional state (".concat(JSON.stringify(context.kardiaSphere), ") and narrative state (").concat(JSON.stringify(context.narrativeWeaving), "), select up to 3 most relevant memory fragments from the following list to weave into a guiding intuition. Return only the selected fragments, separated by '---'.\n\nAvailable Fragments:\n").concat(allFragmentsContent.join('\n---\n'));
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(selectionPrompt)];
                case 3:
                    selectedRaw = _a.sent();
                    selectedFragments = selectedRaw.split('---').map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
                    return [2 /*return*/, "A whisper from the past...\n\n" + selectedFragments.join('\n\n---\n\n')];
            }
        });
    });
}
/**
 * Updates the Constellation Map based on the latest interactions.
 * This is a placeholder for a more complex implementation that would
 * involve graph databases or more sophisticated mapping logic.
 * @param context The current ritual context.
 * @param memoryRoot The root directory of the memory tree.
 */
function updateConstellationMap(context_1) {
    return __awaiter(this, arguments, void 0, function (context, memoryRoot) {
        var mapPath, map, currentMap, error_1, lastPlan, lastStep, key;
        var _a;
        if (memoryRoot === void 0) { memoryRoot = DEFAULT_MEMORY_ROOT; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mapPath = path.join(memoryRoot, 'constellation_map.json');
                    map = {};
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.readFile(mapPath, 'utf8')];
                case 2:
                    currentMap = _b.sent();
                    map = JSON.parse(currentMap);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    lastPlan = (_a = context.scroll.at(-1)) === null || _a === void 0 ? void 0 : _a.plan;
                    if (lastPlan && lastPlan.incantations.length > 0) {
                        lastStep = lastPlan.incantations.at(-1);
                        if (lastStep) {
                            key = lastStep.type || 'unknown';
                            // @ts-ignore
                            map[key] = (map[key] || 0) + 1;
                        }
                    }
                    return [4 /*yield*/, fs.writeFile(mapPath, JSON.stringify(map, null, 2), 'utf8')];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
