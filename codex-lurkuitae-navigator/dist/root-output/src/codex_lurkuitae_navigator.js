"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codexLurkuitaeNavigator = codexLurkuitaeNavigator;
const parser_js_1 = require("../packages/luciform-ai-parser/src/parser.js");
const index_js_1 = require("../packages/luciform-executor/src/index.js");
const index_js_2 = require("../packages/luciform-ai-interface/src/index.js");
async function codexLurkuitaeNavigator(luciformContent, context, logRitual, logFileName) {
    console.log("CodexLurkuitaeNavigator: Starting intelligent parsing and execution.");
    let luciformDocument;
    try {
        luciformDocument = (0, parser_js_1.parseLuciformDocument)(luciformContent, logRitual, logFileName);
        console.log("CodexLurkuitaeNavigator: Parsing complete. Starting execution.");
        await (0, index_js_1.executeLuciform)(luciformDocument, logRitual, index_js_2.getAIHelp, logFileName);
        console.log("CodexLurkuitaeNavigator: Execution complete.");
    }
    catch (error) {
        console.error("CodexLurkuitaeNavigator: Error during parsing or execution:", error);
        throw error; // Re-throw the error after logging
    }
}
