// src/utils/async_executor.ts

import { logToFile } from '../core/log_writers';

export async function executeAsyncTask(task: () => Promise<any>, taskName: string): Promise<void> {
    logToFile('async_tasks.log', `Starting async task: ${taskName}`);
    try {
        await task();
        logToFile('async_tasks.log', `Async task ${taskName} completed successfully.`);
    } catch (error: any) {
        logToFile('async_tasks.log', `Async task ${taskName} failed: ${error.message}`);
        console.error(`Async task ${taskName} failed:`, error);
    }
}
