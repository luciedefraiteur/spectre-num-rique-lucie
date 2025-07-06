// src/core/log_writers.ts

import {appendFileSync} from 'fs';

import path from 'path';

export function logToFile(filename: string, message: string): void
{
    try
    {
        const logFilePath = path.join(__dirname, '..', '..', 'logs', filename);
        appendFileSync(logFilePath, `${ new Date().toISOString() } - ${ message }\n`);
    } catch(error)
    {
        console.error(`Failed to write to log file ${ filename }:`, error);
    }
}

