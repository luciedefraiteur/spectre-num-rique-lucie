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
exports.readRefletFragment = readRefletFragment;
exports.weaveReflet = weaveReflet;
exports.loadAllReflectFragments = loadAllReflectFragments;
var fs = require("fs");
var path = require("path");
var llm_interface_js_1 = require("../llm_interface.js");
var LUCIE_REFLET_ROOT = path.resolve(process.cwd(), 'lucie_reflet');
function getRefletPath(refletText) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, pathResponse, cleanedPath, _i, _a, char;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prompt = "\u00C0 partir du texte de reflet suivant, g\u00E9n\u00E8re un chemin po\u00E9tique et fractal de 2 \u00E0 4 niveaux, commen\u00E7ant par 'lucie_reflet/'. Chaque niveau est un mot ou une courte expression. Ne retourne que le chemin, rien d'autre.\n\nReflet: \"".concat(refletText, "\"\n\nExemple de sortie: lucie_reflet/mon_amour/reflet_sombre");
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(prompt)];
                case 1:
                    pathResponse = _b.sent();
                    cleanedPath = '';
                    for (_i = 0, _a = pathResponse.trim(); _i < _a.length; _i++) {
                        char = _a[_i];
                        if (/[a-zA-Z0-9/]/.test(char)) {
                            cleanedPath += char;
                        }
                        else {
                            cleanedPath += '_';
                        }
                    }
                    // Ensure it starts with lucie_reflet/ and remove any trailing slash
                    if (!cleanedPath.startsWith('lucie_reflet/')) {
                        cleanedPath = 'lucie_reflet/' + cleanedPath;
                    }
                    if (cleanedPath.endsWith('/')) {
                        cleanedPath = cleanedPath.slice(0, -1);
                    }
                    return [2 /*return*/, cleanedPath];
            }
        });
    });
}
function updateParentRefletFragment(fragmentPath, newSubRefletTitle) {
    var parentDir = path.dirname(fragmentPath);
    var parentFragmentPath = path.join(path.dirname(parentDir), path.basename(path.dirname(parentDir)) + '.fragment');
    if (fs.existsSync(parentFragmentPath)) {
        var content = fs.readFileSync(parentFragmentPath, 'utf8');
        if (content.includes('sous_reflets:')) {
            content = content.replace('sous_reflets:', "sous_reflets: ".concat(newSubRefletTitle, ", "));
        }
        else {
            content += "\nsous_reflets: ".concat(newSubRefletTitle, ",");
        }
        fs.writeFileSync(parentFragmentPath, content);
    }
}
function readRefletFragment(fragmentPath) {
    if (!fs.existsSync(fragmentPath)) {
        return null;
    }
    var content = fs.readFileSync(fragmentPath, 'utf8');
    var contentMatch = content.match(/content: ([^]*)\nsous_reflets:/);
    if (contentMatch && contentMatch[1]) {
        try {
            return JSON.parse(contentMatch[1]);
        }
        catch (e) {
            console.error("Error parsing JSON from fragment ".concat(fragmentPath, ":"), e);
            return null;
        }
    }
    return null;
}
function weaveReflet(refletText) {
    return __awaiter(this, void 0, void 0, function () {
        var refletPath, pathParts, currentPath, i, fragmentContent, fragmentPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getRefletPath(refletText)];
                case 1:
                    refletPath = _a.sent();
                    pathParts = refletPath.split('/').slice(1);
                    currentPath = LUCIE_REFLET_ROOT;
                    for (i = 0; i < pathParts.length; i++) {
                        currentPath = path.join(currentPath, pathParts[i]);
                        if (!fs.existsSync(currentPath)) {
                            fs.mkdirSync(currentPath, { recursive: true });
                        }
                    }
                    fragmentContent = "timestamp: ".concat(new Date().toISOString(), "\ncontent: ").concat(JSON.stringify({ reve: refletText }), "\nsous_reflets:");
                    fragmentPath = path.join(currentPath, path.basename(currentPath) + '.fragment');
                    fs.writeFileSync(fragmentPath, fragmentContent);
                    if (pathParts.length > 1) {
                        updateParentRefletFragment(fragmentPath, path.basename(currentPath));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function loadAllReflectFragments() {
    return __awaiter(this, void 0, void 0, function () {
        var fragments, files, _i, files_1, file, fragmentPath, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fragments = [];
                    return [4 /*yield*/, fs.promises.readdir(LUCIE_REFLET_ROOT, { withFileTypes: true })];
                case 1:
                    files = _a.sent();
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        file = files_1[_i];
                        if (file.isFile() && file.name.endsWith('.fragment')) {
                            fragmentPath = path.join(LUCIE_REFLET_ROOT, file.name);
                            content = readRefletFragment(fragmentPath);
                            if (content) {
                                fragments.push(content);
                            }
                        }
                    }
                    return [2 /*return*/, fragments];
            }
        });
    });
}
