"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var fs = require("fs/promises");
var path = require("path");
function generateLuciformDocumentation() {
    return __awaiter(this, void 0, void 0, function () {
        var typesFilePath, docOutputPath, typesContent, markdownContent, interfaceRegex, match, typeOrInterface, name_1, body, propertyRegex, propMatch, hasProperties, propName, propType, typeAliasRegex, name_2, definition, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typesFilePath = path.join(__dirname, 'luciform-core', 'luciform_parser', 'types.ts');
                    docOutputPath = path.join(__dirname, 'LUCIFORM_SPEC.md');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fs.readFile(typesFilePath, 'utf-8')];
                case 2:
                    typesContent = _a.sent();
                    markdownContent = "# Luciform Language Specification\n\n";
                    markdownContent += "This document is automatically generated from ";
                    luciform - core / luciform_parser / types.ts(templateObject_1 || (templateObject_1 = __makeTemplateObject([".\n\n"], [".\\n\\n"])));
                    interfaceRegex = /export (interface|type) (\w+) {(.*?)}/gs;
                    match = void 0;
                    while ((match = interfaceRegex.exec(typesContent)) !== null) {
                        typeOrInterface = match[1];
                        name_1 = match[2];
                        body = match[3];
                        markdownContent += "## ";
                        $;
                        {
                            name_1;
                        }
                        " (".concat(typeOrInterface, ")\n\n");
                        markdownContent += ""(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
                        typescript;
                        n$;
                        {
                            typeOrInterface;
                        }
                        $;
                        {
                            name_1;
                        }
                        {
                            n$;
                            {
                                body;
                            }
                        }
                        n(templateObject_3 || (templateObject_3 = __makeTemplateObject([""], [""])))(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\n"], ["\\n\\n"])));
                        propertyRegex = /(\w+): (.*?);/g;
                        propMatch = void 0;
                        markdownContent += "### Properties:\n\n";
                        hasProperties = false;
                        while ((propMatch = propertyRegex.exec(body)) !== null) {
                            hasProperties = true;
                            propName = propMatch[1];
                            propType = propMatch[2];
                            markdownContent += "- ";
                            $;
                            {
                                propName;
                            }
                            ": ";
                            $;
                            {
                                propType;
                            }
                            "\n";
                        }
                        if (!hasProperties) {
                            markdownContent += "(No explicit properties or properties defined in referenced types)\n";
                        }
                        markdownContent += "\n";
                    }
                    typeAliasRegex = /export type (\w+) = (.*?);/g;
                    while ((match = typeAliasRegex.exec(typesContent)) !== null) {
                        name_2 = match[1];
                        definition = match[2];
                        markdownContent += "## ";
                        $;
                        {
                            name_2;
                        }
                        " (type alias)\n\n";
                        markdownContent += ""(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
                        typescript;
                        nexport;
                        $;
                        {
                            definition;
                        }
                        ;
                        n(templateObject_6 || (templateObject_6 = __makeTemplateObject([""], [""])))(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n\n"], ["\\n\\n"])));
                        markdownContent += "**Definition**: ".concat(definition, "\n\n");
                    }
                    return [4 /*yield*/, fs.writeFile(docOutputPath, markdownContent, 'utf-8')];
                case 3:
                    _a.sent();
                    console.log("Luciform documentation generated at: ".concat(docOutputPath));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error generating Luciform documentation:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
generateLuciformDocumentation();
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
