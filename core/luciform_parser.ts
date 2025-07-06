import {Operation} from './types.js';

/**
 * Parses the content of a luciform step to extract a structured operation.
 * The operation within the [Action] block is expected to be a JSON string.
 * 
 * @param pasContent The content of a single "pas" from a luciform file.
 * @returns An Operation object or null if no valid action is found.
 */
export function parseLuciformAction(pasContent: string): Operation | null
{
    const actionMatch = pasContent.match(/\[Action\]\s*(\{[\s\S]*?\})/);

    if(actionMatch && actionMatch[1])
    {
        const jsonContent = actionMatch[1].trim();
        try
        {
            const operation = JSON.parse(jsonContent);
            if(operation && typeof operation.type === 'string')
            {
                return operation as Operation;
            }
        } catch(error)
        {
            console.error(`Erreur de parsing JSON dans le bloc [Action]: ${ error }`);
            console.error(`Contenu du bloc [Action]: ${ jsonContent }`);
            return null;
        }
    }

    // Si aucun bloc [Action] n'est trouvé ou si le parsing échoue, on retourne null.
    // Les blocs [Note], [Promenade] et [Contexte] sont ainsi ignorés.
    return null;
}