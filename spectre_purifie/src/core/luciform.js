"use strict";
// src/core/luciform.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLuciform = createLuciform;
function createLuciform(type, content, previousLuciform, context) {
    const id = `luciform_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
        id,
        timestamp: new Date().toISOString(),
        type,
        content,
        previousLuciformId: previousLuciform ? previousLuciform.id : null,
        inventory: previousLuciform ? [...previousLuciform.inventory] : [], // Inherit inventory
        currentWorkingDirectory: context.currentWorkingDirectory,
        contextSnapshot: {
            osHint: context.osHint,
            model: context.model,
            emotionalState: context.emotionalState,
            persona: context.persona,
            // history will be managed by linking Luciforms
        },
    };
}
//# sourceMappingURL=luciform.js.map