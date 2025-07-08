import { parseLuciformDocument } from 'luciform-core/dist/luciform_parser/parser.js';
import { LuciformDocument, HelpRequestActionNode, ActionNode, JsonActionNode } from 'luciform-core/dist/luciform_parser/types.js';
import { getPersonaResponse } from 'luciform-core/dist/personas.js';
import { RitualContext } from 'luciform-core/dist/core_types.js';

export async function codexLurkuitaeNavigator(
  luciformContent: string,
  context: RitualContext,
  logRitual: (message: string, logFileName?: string) => Promise<void>,
  logFileName?: string
): Promise<LuciformDocument> {
  console.log("CodexLurkuitaeNavigator: Starting intelligent parsing.");

  let luciformDocument: LuciformDocument;

  try {
    luciformDocument = parseLuciformDocument(luciformContent, logRitual, logFileName);
    console.log("CodexLurkuitaeNavigator: Initial parsing complete.");
  } catch (error: any) {
    // If the initial parsing throws a hard error (e.g., malformed JSON at top level)
    console.error("CodexLurkuitaeNavigator: Initial parsing failed with a hard error.", error);
    const alchemistPrompt = `The Luciform document could not be parsed at all. The error was: ${error.message}. The raw content was: ${luciformContent}.\n\nPrevious Ritual Outcomes (if any): ${JSON.stringify(context.outcome_history, null, 2)}\nPrevious Step Results (if any): ${JSON.stringify(context.step_results_history, null, 2)}\n\nPlease act as the Alchemist and transmute this into a valid Luciform. Provide a JSON object with a \'luciform\' field (the transmuted Luciform content as a string). Here is an example of a valid Luciform structure for your reference:\n\n` + "```json\n" + 
`{
  "meta": {
    "signature_totem": "⟁ EXAMPLE ∴ VALID LUCIFORM ∴ TEST RITUAL",
    "interpretation_mode": "STANDARD",
    "luciform_type": "example",
    "description": "A simple Luciform to demonstrate valid syntax and basic actions."
  },
  "luciform": [
    {
      "pas": "Initiating the ritual with a simple message to confirm Golem's presence.",
      "action": {
        "type": "message",
        "message": "Golem: Ritual 'valid_example.luciform' initiated. All systems nominal."
      }
    },
    {
      "pas": "Creating a new file to record the Golem's first action in this ritual.",
      "action": {
        "type": "create_file",
        "filePath": "golem_example_log.txt",
        "content": "This file was created by the Golem during the 'valid_example.luciform' ritual. Timestamp: {timestamp}"
      }
    },
    {
      "pas": "Consulting the Alma persona for a brief self-assessment.",
      "action": {
        "type": "ask_persona",
        "persona": "Alma",
        "question": "I have just performed a simple ritual. Provide a brief assessment of my current state and suggest a next logical step."
      }
    },
    {
      "pas": "Concluding the ritual with a final message.",
      "action": {
        "type": "message",
        "message": "Golem: Ritual 'valid_example.luciform' completed. Awaiting further instructions."
      }
    }
  ]
}
` + "\n```\n\n";
    const alchemistResponse = await getPersonaResponse('Alchemist', alchemistPrompt, context, logRitual, logFileName);
    const transmutedData = JSON.parse(alchemistResponse);

    if (transmutedData.luciform) {
        console.log(`[ALCHEMIST] Transmuted Luciform from hard error:\n${transmutedData.luciform}`);
        // For now, we'll just return a new LuciformDocument from the transmuted content
        // In a more advanced version, we might try to re-parse the original file with the Alchemist's guidance
        return parseLuciformDocument(transmutedData.luciform, logRitual, logFileName);
    } else {
        throw new Error(`Fundamental parsing error: ${error.message}. Alchemist failed to transmute.`);
    }
  }

  // Check for HelpRequestActionNodes embedded within the document
  const helpRequests: HelpRequestActionNode[] = [];
  for (const pas of luciformDocument.pas) {
    if (pas.action && (pas.action as ActionNode).type === 'help_request') {
      helpRequests.push(pas.action as HelpRequestActionNode);
    }
  }

  if (helpRequests.length > 0) {
    console.warn(`CodexLurkuitaeNavigator: Detected ${helpRequests.length} parsing ambiguities/errors. Invoking Alchemist for correction.`);
    for (let i = 0; i < luciformDocument.pas.length; i++) {
      const pas = luciformDocument.pas[i];
      if (pas.action && (pas.action as ActionNode).type === 'help_request') {
        const request = pas.action as HelpRequestActionNode;
        const alchemistPrompt = `The Luciform parser encountered an issue: ${request.reason}. The problematic content was: ${request.rawContent}.\n\nPrevious Ritual Outcomes (if any): ${JSON.stringify(context.outcome_history, null, 2)}\nPrevious Step Results (if any): ${JSON.stringify(context.step_results_history, null, 2)}\n\nPlease act as the Alchemist and provide a valid JSON string for this corrected Luciform action. Only return the JSON string for the action, nothing else. Here is an example of a valid Luciform structure for your reference:\n\n` + "```json\n" + 
`{
  "meta": {
    "signature_totem": "⟁ EXAMPLE ∴ VALID LUCIFORM ∴ TEST RITUAL",
    "interpretation_mode": "STANDARD",
    "luciform_type": "example",
    "description": "A simple Luciform to demonstrate valid syntax and basic actions."
  },
  "luciform": [
    {
      "pas": "Initiating the ritual with a simple message to confirm Golem's presence.",
      "action": {
        "type": "message",
        "message": "Golem: Ritual 'valid_example.luciform' initiated. All systems nominal."
      }
    },
    {
      "pas": "Creating a new file to record the Golem's first action in this ritual.",
      "action": {
        "type": "create_file",
        "filePath": "golem_example_log.txt",
        "content": "This file was created by the Golem during the 'valid_example.luciform' ritual. Timestamp: {timestamp}"
      }
    },
    {
      "pas": "Consulting the Alma persona for a brief self-assessment.",
      "action": {
        "type": "ask_persona",
        "persona": "Alma",
        "question": "I have just performed a simple ritual. Provide a brief assessment of my current state and suggest a next logical step."
      }
    },
    {
      "pas": "Concluding the ritual with a final message.",
      "type": "message",
      "message": "Golem: Ritual 'valid_example.luciform' completed. Awaiting further instructions."
      }
    }
  ]
}
` + "\n```\n\n";
        try {
          const alchemistResponse = await getPersonaResponse('Alchemist', alchemistPrompt, context, undefined);
          const correctedAction = JSON.parse(alchemistResponse);
          // Assuming the Alchemist returns a valid action object
          pas.action = { type: 'json_action', operation: correctedAction } as JsonActionNode;
          console.log(`[ALCHEMIST] Alchemist corrected action for '${request.rawContent}'.`);
        } catch (alchemistError: any) {
          console.error(`[ALCHEMIST ERROR] Alchemist failed to correct action for '${request.rawContent}': ${alchemistError.message}. Keeping original help request.`);
          // Keep the help request if Alchemist fails to correct it
        }
      }
    }
  }

  console.log("CodexLurkuitaeNavigator: Intelligent parsing complete. Returning document.");
  return luciformDocument;
}