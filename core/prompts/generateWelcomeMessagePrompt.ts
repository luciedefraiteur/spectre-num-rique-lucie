import {RitualContext} from '../types.js';

export function generateWelcomeMessagePrompt(context: RitualContext): string
{
  const lastIncantation = context.incantation_history.at(-1);
  const lastOutcome = context.outcome_history.at(-1);

  let welcomeMessage = "Offre ton souffle (ou tape 'exit') : ";

  if(lastIncantation && lastOutcome)
  {
    welcomeMessage = `Bienvenue de nouveau. La dernière fois, tu as exécuté "${ lastIncantation }" avec le résultat: "${ lastOutcome.substring(0, 50) }...". Que désires-tu entreprendre maintenant ? (ou tape 'exit') : `;
  } else if(lastIncantation)
  {
    welcomeMessage = `Bienvenue de nouveau. La dernière fois, tu as exécuté "${ lastIncantation }". Que désires-tu entreprendre maintenant ? (ou tape 'exit') : `;
  } else
  {
    welcomeMessage = `Bienvenue, Émissaire. Que le rituel commence. Offre ton souffle (ou tape 'exit') : `;
  }

  return welcomeMessage;
}