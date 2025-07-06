import * as fs from 'fs';
import * as path from 'path';

export function config(options?: {path?: string}): void
{
    const dotenvPath = options?.path || path.resolve(process.cwd(), '.env');
    console.log(`[FRACTAL_DOTENV] Attempting to load .env file from: ${ dotenvPath }`);

    try
    {
        const envConfig = fs.readFileSync(dotenvPath, 'utf-8');
        console.log('[FRACTAL_DOTENV] .env file found and read successfully.');
        const lines = envConfig.split('\n');

        for(const line of lines)
        {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if(match)
            {
                const key = match[1];
                let value = match[2] || '';
                // Remove surrounding quotes
                if((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
                {
                    value = value.substring(1, value.length - 1);
                }
                process.env[key] = value;
                console.log(`[FRACTAL_DOTENV] Loaded: ${ key }`); // Obscure value for security
            }
        }
    } catch(error: any)
    {
        console.error(`[FRACTAL_DOTENV] Error loading .env file: ${ error.message }`);
    }
}