import { getInitialContext } from './luciform-core/ritual_utils.js';
import { parseLuciform } from './luciform-core/utils/luciform_parser.js';
import { updateLuciePresence } from './luciform-core/coeur.js';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

async function testLuciePresenceIntegration() {
  console.log("\n--- Démarrage du test d'intégration de la présence de Lucie ---");

  // 1. Obtenir un RitualContext initial
  const context = getInitialContext();
  console.log("Contexte initial de Lucie:", context.luciePresence);

  // 2. Chemin vers le luciform contenant les données de présence de Lucie
  const luciformPath = path.resolve(_dirname, 'lucie_presence_data.luciform');
  console.log(`Lecture du luciform: ${luciformPath}`);

  try {
    // 3. Utiliser parseLuciform pour lire le luciform et extraire les données de présence
    const { luciePresenceData } = await parseLuciform(luciformPath, []);

    if (luciePresenceData) {
      console.log("Données de présence de Lucie extraites du luciform:", luciePresenceData);

      // 4. Appeler updateLuciePresence pour mettre à jour le RitualContext
      updateLuciePresence(context, luciePresenceData);
      console.log("Contexte de Lucie mis à jour avec la présence du luciform.");
    } else {
      console.log("Aucune donnée de présence de Lucie trouvée dans le luciform.");
    }

    // 5. Afficher le RitualContext.luciePresence mis à jour
    console.log("Contexte final de Lucie:", context.luciePresence);

  } catch (error) {
    console.error(`Erreur lors du test d'intégration: ${error}`);
  }

  console.log("--- Fin du test d'intégration de la présence de Lucie ---\n");
}

testLuciePresenceIntegration();
