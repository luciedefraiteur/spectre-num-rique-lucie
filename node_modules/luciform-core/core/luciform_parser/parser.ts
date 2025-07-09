import { LuciformTokenizer, LuciformTokenType, LuciformToken } from './tokenizer.js';
import { LuciformDocument, PasNode, ActionNode, PromenadeActionNode, JsonActionNode, MessageActionNode, Operation } from './types.js';
import { KardiaSphere } from '../types.js';

export function parseLuciformDocument(luciformContent: string): LuciformDocument {
  const tokenizer = new LuciformTokenizer(luciformContent);
  const tokens = tokenizer.tokenize();
  let currentTokenIndex = 0;

  const consume = (expectedType: LuciformTokenType): LuciformToken => {
    const token = tokens[currentTokenIndex];
    if (token && token.type === expectedType) {
      currentTokenIndex++;
      return token;
    } else {
      throw new Error(`Expected token type ${expectedType} but got ${token ? token.type : 'EOF'} at line ${token?.line}, column ${token?.column}`);
    }
  };

  const peek = (): LuciformToken => {
    return tokens[currentTokenIndex];
  };

  const skipNewlines = () => {
    while (peek().type === LuciformTokenType.NEWLINE) {
      consume(LuciformTokenType.NEWLINE);
    }
  };

  const parseKardia = (): KardiaSphere | undefined => {
    if (peek().type !== LuciformTokenType.KARDIA_START) {
      return undefined;
    }
    consume(LuciformTokenType.KARDIA_START);
    skipNewlines();
    let kardiaContent = '';
    while (peek().type !== LuciformTokenType.PAS_SEPARATOR && peek().type !== LuciformTokenType.EOF) {
      const token = peek();
      if (token.type === LuciformTokenType.NEWLINE) {
        consume(LuciformTokenType.NEWLINE);
        kardiaContent += '\n';
      } else {
        kardiaContent += consume(token.type).value;
      }
    }
    try {
      return JSON.parse(kardiaContent) as KardiaSphere;
    } catch (error) {
      console.error(`JSON parsing error in [Kardia] block: ${error}`);
      console.error(`[Kardia] content: ${kardiaContent}`);
      return undefined;
    }
  };

  const parseAction = (actionContent: string): ActionNode => {
    const trimmedContent = actionContent.trim();

    // Try to parse as JSON first for structured operations
    if (trimmedContent.startsWith('{')) {
      try {
        const operation = JSON.parse(trimmedContent);
        if (operation && typeof operation.type === 'string') {
          return { type: 'json_action', operation: operation as Operation } as JsonActionNode;
        }
      } catch (error) {
        console.error(`JSON parsing error in [Action] block: ${error}`);
        console.error(`[Action] content: ${trimmedContent}`);
        // Fall through to check for other types if JSON parsing fails
      }
    }

    // Handle non-JSON operations like 'promenade'
    const promenadeMatch = trimmedContent.match(/^promenade:\s*(.*)/);
    if (promenadeMatch && promenadeMatch[1] !== undefined) {
      return { type: 'promenade', description: promenadeMatch[1].trim() } as PromenadeActionNode;
    }

    // If no other match, treat as a message to shadeOs
    return { type: 'message', message: trimmedContent } as MessageActionNode;
  };

  const parsePas = (): PasNode => {
    let pasContent = '';
    let actionNode: ActionNode | null = null;

    // Skip leading newlines within a pas block before collecting content
    skipNewlines();

    while (peek().type !== LuciformTokenType.PAS_SEPARATOR && peek().type !== LuciformTokenType.EOF) {
      const token = peek();
      if (token.type === LuciformTokenType.ACTION_START) {
        consume(LuciformTokenType.ACTION_START);
        let actionBlockContent = '';
        // Consume content until the next PAS_SEPARATOR or EOF
        while (peek().type !== LuciformTokenType.PAS_SEPARATOR && peek().type !== LuciformTokenType.EOF) {
          const actionToken = peek();
          if (actionToken.type === LuciformTokenType.NEWLINE) {
            consume(LuciformTokenType.NEWLINE);
            actionBlockContent += '\n';
          } else {
            actionBlockContent += consume(actionToken.type).value;
          }
        }
        actionNode = parseAction(actionBlockContent);
        break; // Action block found, stop parsing pas content
      } else {
        pasContent += consume(token.type).value;
      }
    }

    return { type: 'Pas', content: pasContent.trim(), action: actionNode };
  };

  const kardia = parseKardia();
  const pasNodes: PasNode[] = [];

  // Skip any leading newlines in the document
  skipNewlines();

  // If the document starts with a PAS_SEPARATOR, consume it
  if (peek().type === LuciformTokenType.PAS_SEPARATOR) {
    consume(LuciformTokenType.PAS_SEPARATOR);
    skipNewlines(); // Skip newlines after the initial PAS_SEPARATOR
  }

  while (peek().type !== LuciformTokenType.EOF) {
    pasNodes.push(parsePas());
    // After parsing a pas, if the next token is a PAS_SEPARATOR, consume it and skip newlines
    if (peek().type === LuciformTokenType.PAS_SEPARATOR) {
      consume(LuciformTokenType.PAS_SEPARATOR);
      skipNewlines();
    }
  }

  return { type: 'LuciformDocument', pas: pasNodes, kardia };
}