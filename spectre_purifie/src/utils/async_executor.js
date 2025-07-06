"use strict";
// src/utils/async_executor.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAsyncTask = executeAsyncTask;
const log_writers_1 = require("../core/log_writers");
async function executeAsyncTask(task, taskName) {
    (0, log_writers_1.logToFile)('async_tasks.log', `Starting async task: ${taskName}`);
    try {
        await task();
        (0, log_writers_1.logToFile)('async_tasks.log', `Async task ${taskName} completed successfully.`);
    }
    catch (error) {
        (0, log_writers_1.logToFile)('async_tasks.log', `Async task ${taskName} failed: ${error.message}`);
        console.error(`Async task ${taskName} failed:`, error);
    }
}
//# sourceMappingURL=async_executor.js.map