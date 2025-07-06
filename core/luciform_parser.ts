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
    const actionMatch = pasContent.match(/\[Action\]\s*([\s\S]*?)(?=\n\[|$)/);

    if(actionMatch && actionMatch[1])
    {
        const actionContent = actionMatch[1].trim();

        // Try to parse as JSON first for structured operations
        if(actionContent.startsWith('{'))
        {
            try
            {
                const operation = JSON.parse(actionContent);
                if(operation && typeof operation.type === 'string')
                {
                    return operation as Operation;
                }
            } catch(error)
            {
                console.error(`JSON parsing error in [Action] block: ${ error }`);
                console.error(`[Action] content: ${ actionContent }`);
                // Fall through to check for other types if JSON parsing fails
            }
        }

        // Handle non-JSON operations like 'promenade'
        const promenadeMatch = actionContent.match(/^promenade:\s*(.*)/);
        if(promenadeMatch && promenadeMatch[1])
        {
            return {
                type: 'promenade',
                description: promenadeMatch[1].trim()
            };
        }

        // If no other match, treat as a message to shadeOs
        return {
            type: 'message',
            message: actionContent
        };
    }

    // If no [Action] block is found, return null.
    return null;
}