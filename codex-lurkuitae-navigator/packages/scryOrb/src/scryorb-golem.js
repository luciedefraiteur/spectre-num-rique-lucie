#!/usr/bin/env node
// 👁️ ScryOrb Golem - Explorateur Spécialisé
// Signature: ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { spawn } from 'child_process';

const SIGNATURE = "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐";

class ScryOrbGolem {
  constructor() {
    this.nom = "ScryOrb - Golem Explorateur Spécialisé";
    this.mission = "examiner, analyser et révéler les contextes cachés";
    
    console.error('👁️ ScryOrb Golem - Éveil de l\'œil cosmique...');
    console.error(SIGNATURE);
    console.error('🔮 Vision activée : Je révèle les contextes cachés !');
  }

  // 🤖 Appel RÉEL à Gemini pour générer exploration
  async appelGeminiPourExploration(demande_exploration) {
    console.error('🤖 Appel Gemini RÉEL pour génération ScryOrb...');
    
    // Charger le prompt depuis scryOrb.luciform
    const luciform = JSON.parse(readFileSync('scryOrb.luciform', 'utf8'));
    const prompt_base = luciform.prompt_génération_scryorb.invocation_gemini;
    
    const prompt_complet = `${prompt_base}

DEMANDE D'EXPLORATION:
${demande_exploration}

Génère un JSON avec commandes_exploration, auto_réflexion, et commandes_suivantes pour cette exploration.`;

    try {
      // Appel curl direct à Gemini
      const api_key = execSync('grep GEMINI_API_KEY ../../.env | cut -d"=" -f2', { encoding: 'utf8' }).trim();
      
      // Échapper proprement le prompt pour curl
      const prompt_escaped = prompt_complet.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/'/g, "\\'");
      const curl_command = `curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}" -H "Content-Type: application/json" -d '{"contents":[{"parts":[{"text":"${prompt_escaped}"}]}]}'`;
      
      console.error('🌐 Envoi requête à Gemini...');
      const response_raw = execSync(curl_command, { encoding: 'utf8' });
      
      console.error('✅ Réponse Gemini reçue !');
      
      // Parser la réponse Gemini
      const response_json = JSON.parse(response_raw);
      const gemini_text = response_json.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!gemini_text) {
        throw new Error('Pas de texte dans la réponse Gemini');
      }
      
      // Extraire le JSON de la réponse
      const json_match = gemini_text.match(/\{[\s\S]*\}/);
      if (!json_match) {
        throw new Error('Pas de JSON trouvé dans la réponse');
      }
      
      const exploration_generee = JSON.parse(json_match[0]);
      
      console.error('🔮 Exploration générée par Gemini !');
      return exploration_generee;
      
    } catch (error) {
      console.error('❌ Erreur appel Gemini:', error.message);
      
      // Fallback intelligent
      return this.generateFallbackExploration(demande_exploration);
    }
  }

  // 🔧 Fallback si Gemini échoue
  generateFallbackExploration(demande) {
    console.error('🔧 Génération fallback ScryOrb...');
    
    const mots_cles = demande.toLowerCase();
    let commandes = [];
    
    if (mots_cles.includes('fichier') || mots_cles.includes('document')) {
      commandes = [
        'find . -name "*.txt" -o -name "*.json" -o -name "*.md" | head -10',
        'ls -la *.* | head -20',
        'du -sh * | sort -hr | head -10'
      ];
    } else if (mots_cles.includes('dossier') || mots_cles.includes('structure')) {
      commandes = [
        'ls -la',
        'find . -type d | head -15',
        'du -sh */ 2>/dev/null | sort -hr'
      ];
    } else {
      commandes = [
        'ls -la',
        'pwd',
        'whoami && date'
      ];
    }
    
    return {
      exploration_demandée: demande,
      commandes_exploration: commandes,
      auto_réflexion: {
        objectif: `Explorer: ${demande}`,
        hypothèses: "Découvrir la structure et le contenu",
        métriques: "Fichiers trouvés, taille, organisation",
        zones_incertitude: "Contenu détaillé des éléments trouvés"
      },
      commandes_suivantes: {
        si_fichiers_trouvés: ["cat [fichier_intéressant]", "head -20 [fichier]"],
        si_dossiers_vides: ["echo 'Zone vide détectée'"],
        si_erreurs: ["ls -la ..", "pwd"]
      },
      source: "fallback_scryorb",
      signature: SIGNATURE
    };
  }

  // 🔍 Exécuter l'exploration générée
  async executerExploration(exploration, output_file) {
    console.error('🔍 Exécution de l\'exploration ScryOrb...');
    
    const resultats = {
      exploration_source: exploration,
      resultats_commandes: [],
      auto_reflexion_resultats: {},
      timestamp: new Date().toISOString(),
      signature: SIGNATURE
    };
    
    // Exécuter chaque commande d'exploration
    for (let i = 0; i < exploration.commandes_exploration.length; i++) {
      const commande = exploration.commandes_exploration[i];
      console.error(`🔧 Exécution commande ${i + 1}: ${commande}`);
      
      try {
        const output = execSync(commande, { 
          encoding: 'utf8',
          timeout: 10000,
          maxBuffer: 1024 * 1024 
        });
        
        resultats.resultats_commandes.push({
          commande: commande,
          succes: true,
          output: output,
          timestamp: new Date().toISOString()
        });
        
        console.error(`✅ Commande ${i + 1} réussie`);
        
      } catch (error) {
        resultats.resultats_commandes.push({
          commande: commande,
          succes: false,
          erreur: error.message,
          timestamp: new Date().toISOString()
        });
        
        console.error(`❌ Commande ${i + 1} échouée: ${error.message}`);
      }
    }
    
    // Auto-réflexion sur les résultats
    resultats.auto_reflexion_resultats = {
      commandes_reussies: resultats.resultats_commandes.filter(r => r.succes).length,
      commandes_echouees: resultats.resultats_commandes.filter(r => !r.succes).length,
      donnees_collectees: resultats.resultats_commandes.some(r => r.output && r.output.trim()),
      zones_a_approfondir: exploration.auto_réflexion.zones_incertitude,
      recommandations: this.genererRecommandations(resultats.resultats_commandes)
    };
    
    // Sauvegarder les résultats
    writeFileSync(output_file, JSON.stringify(resultats, null, 2));
    console.error(`💾 Résultats sauvegardés: ${output_file}`);
    
    // Output pour pipe
    console.log(JSON.stringify(resultats, null, 2));
    
    return resultats;
  }

  // 💡 Générer recommandations basées sur les résultats
  genererRecommandations(resultats_commandes) {
    const recommandations = [];
    
    const commandes_reussies = resultats_commandes.filter(r => r.succes);
    const fichiers_trouves = commandes_reussies.some(r => 
      r.output && (r.output.includes('.txt') || r.output.includes('.json'))
    );
    
    if (fichiers_trouves) {
      recommandations.push("Examiner le contenu des fichiers trouvés");
      recommandations.push("Analyser la structure des données");
    }
    
    if (commandes_reussies.length > 0) {
      recommandations.push("Approfondir l'exploration des zones découvertes");
    }
    
    if (resultats_commandes.some(r => !r.succes)) {
      recommandations.push("Vérifier les permissions et chemins d'accès");
    }
    
    return recommandations;
  }
}

// 🚀 Interface CLI
async function main() {
  const args = process.argv.slice(2);
  const commande = args[0];
  
  const scryorb = new ScryOrbGolem();
  
  switch (commande) {
    case 'explore':
      const demande = args[1];
      const output = args[2] || 'outputs/exploration_results.json';
      
      if (!demande) {
        console.error('❌ Usage: explore "demande d\'exploration" [output.json]');
        return;
      }
      
      console.error(`🔮 Génération exploration pour: ${demande}`);
      const exploration = await scryorb.appelGeminiPourExploration(demande);
      
      console.error('🔍 Exécution de l\'exploration...');
      await scryorb.executerExploration(exploration, output);
      break;
      
    case 'help':
      console.log(`
👁️ ScryOrb Golem - Commandes:

  explore "demande"              Générer et exécuter exploration
  help                           Afficher cette aide

💫 Exemples:
  node src/scryorb-golem.js explore "analyser les fichiers du projet"
  node src/scryorb-golem.js explore "explorer la structure des dossiers"

🔮 Je génère des explorations intelligentes via Gemini !
`);
      break;
      
    default:
      console.error('❌ Commande inconnue. Utilisez "help" pour voir les options.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
