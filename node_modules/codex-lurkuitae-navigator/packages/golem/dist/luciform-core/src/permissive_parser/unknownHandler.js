"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownHandler = unknownHandler;
async function unknownHandler(action, options) {
    console.log(`[UnknownHandler] Processing unknown action type: ${action.type || 'N/A'}`);
    // In a real scenario, this might log to a file, send to a monitoring system, etc.
    return { handled: false, reason: 'Unknown action type', originalAction: action };
}
//# sourceMappingURL=unknownHandler.js.map