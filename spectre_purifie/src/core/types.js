"use strict";
// src/core/types.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ÉtapeStatus = exports.ÉtapeType = void 0;
var ÉtapeType;
(function (ÉtapeType) {
    ÉtapeType["CD"] = "CD";
    ÉtapeType["EXECUTE"] = "EXECUTE";
    ÉtapeType["QUESTION"] = "QUESTION";
    ÉtapeType["ANALYSE"] = "ANALYSE";
    ÉtapeType["APPLY_EDITS"] = "APPLY_EDITS";
    ÉtapeType["SAVE_MEMORY"] = "SAVE_MEMORY";
    ÉtapeType["UPDATE_REFLECT"] = "UPDATE_REFLECT";
    ÉtapeType["CONDUCT_RITUAL"] = "CONDUCT_RITUAL";
    ÉtapeType["GENERATE_SCRY_ORB"] = "GENERATE_SCRY_ORB";
    ÉtapeType["VIEW_SCRY_ORB"] = "VIEW_SCRY_ORB";
})(ÉtapeType || (exports.ÉtapeType = ÉtapeType = {}));
var ÉtapeStatus;
(function (ÉtapeStatus) {
    ÉtapeStatus["PENDING"] = "PENDING";
    ÉtapeStatus["COMPLETED"] = "COMPLETED";
    ÉtapeStatus["FAILED"] = "FAILED";
})(ÉtapeStatus || (exports.ÉtapeStatus = ÉtapeStatus = {}));
//# sourceMappingURL=types.js.map