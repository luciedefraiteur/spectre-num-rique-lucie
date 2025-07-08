import * as dotenv from 'dotenv';
dotenv.config();

import { ClaudeInterface } from './luciform-core/claude_interface.js';

async function testClaudeAPI()
{
    console.log("Test de l'interface Claude...");
    try
    {
        const response = await askClaude('Bonjour Claude, peux-tu me dire "Hello, world!" ?');
        console.log('\nRéponse de Claude:\n', response);
    } catch(error)
    {
        console.error('\nLe test a échoué:', error);
    }
}

testClaudeAPI();

