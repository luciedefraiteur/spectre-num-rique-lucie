/**
 * @file claude_interface.ts
 * @description Ce module gère la communication avec l'API d'Anthropic (Claude).
 */

import fetch from 'node-fetch';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Interroge l'API de Claude avec un prompt donné.
 * 
 * @param prompt Le prompt à envoyer à Claude.
 * @returns La réponse textuelle de Claude.
 */
export async function askClaude(prompt: string): Promise<string>
{
    const apiKey = process.env.CLAUDE_API_KEY;

    if(!apiKey)
    {
        throw new Error('La clé API Claude (CLAUDE_API_KEY) n\'est pas définie dans le fichier .env');
    }

    try
    {
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: "claude-3-opus-20240229",
                max_tokens: 4096,
                messages: [
                    {role: "user", content: prompt}
                ]
            }),
        });

        if(!response.ok)
        {
            const errorBody = await response.text();
            throw new Error(`Erreur de l'API Claude: ${ response.status } ${ response.statusText } - ${ errorBody }`);
        }

        const data = await response.json() as any;
        return data.content[0].text;

    } catch(error)
    {
        console.error("[Erreur Claude Interface]", error);
        throw error;
    }
}