import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main()
{
    try
    {
        const message = await anthropic.messages.create({
            max_tokens: 1024,
            messages: [{role: 'user', content: 'Bonjour, Claude !'}],
            model: 'claude-3-opus-20240229',
        });

        console.log('Réponse de Claude :', message.content);
    } catch(error)
    {
        console.error('Erreur lors de l\'appel à l\'API Claude :', error);
    }
}

main();