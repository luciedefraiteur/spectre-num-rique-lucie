// src/core/log_writers.ts

import { appendFileSync } from 'fs';

export function logToFile(filename: string, message: string): void {
    try {
        appendFileSync(filename, `${new Date().toISOString()} - ${message}\n`);
    } catch (error) {
        console.error(`Failed to write to log file ${filename}:`, error);
    }
}

