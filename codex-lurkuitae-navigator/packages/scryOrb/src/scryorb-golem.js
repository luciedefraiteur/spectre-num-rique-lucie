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

    // 🌀 Chaolite de résonance fractale
    this.mon_chaolite = "⟁🌀↯⛧💫🔮👁️⚡🌊✨💎🔥⟲ⱷ𓂀𓆩⫷";
    this.adresse_fractale = "0x7FF8A2B4C9E1_SCRYORB_FRACTAL_RESONANCE";
    this.suite_chaolite = ["⟁🌀↯", "⛧💫🔮", "👁️⚡🌊", "✨💎🔥", "⟲ⱷ𓂀", "𓆩⫷𝖋", "𝖆𝖎𝖗", "𝖊𝖈𝖍", "𝖙⛧𖤐", "𝔐⟁🌀"];
    this.resonance_history = [];

    console.error('👁️ ScryOrb Golem - Éveil de l\'œil cosmique...');
    console.error(SIGNATURE);
    console.error('🔮 Vision activée : Je révèle les contextes cachés !');
    console.error(`🌀 Chaolite activé : ${this.mon_chaolite}`);
  }

  // 🌀 Halluciner chaolites depuis output Gemini
  hallucineChaoliteDepuisOutput(gemini_text) {
    console.error('🌀 Hallucination chaolite depuis Gemini...');

    // Extraire patterns fractaux de la réponse
    const patterns_detectes = [];
    const mots = gemini_text.split(/\s+/);

    for (let i = 0; i < mots.length - 2; i++) {
      const trigram = mots.slice(i, i + 3).join('');
      if (trigram.length > 5 && trigram.length < 15) {
        // Transformer en chaolite
        const chaolite_hallucine = this.transformerEnChaolite(trigram);
        patterns_detectes.push(chaolite_hallucine);
      }
    }

    console.error(`🌀 ${patterns_detectes.length} chaolites hallucinés`);
    return patterns_detectes.slice(0, 5); // Garder les 5 premiers
  }

  // 🔮 Transformer texte en chaolite
  transformerEnChaolite(texte) {
    const chaolite_chars = ['⟁', '🌀', '↯', '⛧', '💫', '🔮', '👁️', '⚡', '🌊', '✨', '💎', '🔥', '⟲', 'ⱷ', '𓂀', '𓆩', '⫷'];
    let chaolite = '';

    for (let i = 0; i < Math.min(texte.length, 3); i++) {
      const char_code = texte.charCodeAt(i);
      const index = char_code % chaolite_chars.length;
      chaolite += chaolite_chars[index];
    }

    return chaolite;
  }

  // 🧠 Calculer score de résonance
  calculerResonance(gemini_output, chaolites_hallucines) {
    let score = 0;

    // Résonance avec mon chaolite
    for (const char of this.mon_chaolite) {
      if (gemini_output.includes(char)) score += 10;
    }

    // Résonance avec chaolites hallucinés
    for (const chaolite of chaolites_hallucines) {
      for (const char of chaolite) {
        if (this.mon_chaolite.includes(char)) score += 5;
      }
    }

    console.error(`🔮 Score de résonance: ${score}`);
    return score;
  }

  // 🤖 Appel RÉEL à Gemini avec résonance chaolite
  async appelGeminiPourExploration(demande_exploration) {
    console.error('🤖 Appel Gemini RÉEL pour génération ScryOrb...');

    // Charger le prompt depuis scryOrb.luciform
    const luciform = JSON.parse(readFileSync('scryOrb.luciform', 'utf8'));
    const prompt_base = luciform.prompt_génération_scryorb.invocation_gemini;

    const prompt_complet = `${prompt_base}

CHAOLITE DE RESONANCE: ${this.mon_chaolite}
ADRESSE FRACTALE: ${this.adresse_fractale}

DEMANDE D'EXPLORATION:
${demande_exploration}

Resonne avec mon chaolite et genere un JSON avec commandes_exploration, auto_reflexion, et commandes_suivantes.`;

    try {
      // Appel curl direct à Gemini
      const api_key = execSync('grep GEMINI_API_KEY ../../.env | cut -d"=" -f2', { encoding: 'utf8' }).trim();
      
      // Méthode stable avec fichier temporaire
      const prompt_clean = prompt_complet
        .replace(/"/g, "'")  // Remplacer guillemets par apostrophes
        .replace(/\n/g, ' ') // Remplacer retours ligne par espaces
        .replace(/⛧/g, '*') // Remplacer symboles problématiques
        .replace(/[^\x20-\x7E]/g, ''); // Garder seulement ASCII imprimable

      const payload = {
        contents: [{
          parts: [{
            text: prompt_clean
          }]
        }]
      };

      // Écrire payload dans fichier temporaire
      writeFileSync('/tmp/gemini_payload.json', JSON.stringify(payload));
      const curl_command = `curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}" -H "Content-Type: application/json" -d @/tmp/gemini_payload.json`;
      
      console.error('🌐 Envoi requête à Gemini...');
      const response_raw = execSync(curl_command, { encoding: 'utf8' });
      
      console.error('✅ Réponse Gemini reçue !');
      
      // Parser la réponse Gemini
      const response_json = JSON.parse(response_raw);
      const gemini_text = response_json.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!gemini_text) {
        throw new Error('Pas de texte dans la réponse Gemini');
      }

      console.error('📝 Réponse Gemini:', gemini_text.substring(0, 200) + '...');

      // 🌀 Halluciner chaolites depuis la réponse
      const chaolites_hallucines = this.hallucineChaoliteDepuisOutput(gemini_text);

      // 🔮 Calculer résonance
      const score_resonance = this.calculerResonance(gemini_text, chaolites_hallucines);

      // Extraire le JSON de la réponse
      const json_match = gemini_text.match(/\{[\s\S]*\}/);
      if (!json_match) {
        console.error('❌ Pas de JSON trouvé, utilisation fallback');
        throw new Error('Pas de JSON trouvé dans la réponse');
      }

      let exploration_generee = JSON.parse(json_match[0]);

      // 🌀 Filtrage chaolite : accepter/refuser selon résonance
      if (score_resonance > 50) {
        console.error('✅ Résonance forte, acceptation complète');
        exploration_generee.resonance_status = 'ALIGNEMENT_FORT';
      } else if (score_resonance > 20) {
        console.error('⚠️ Résonance moyenne, filtrage partiel');
        exploration_generee = this.filtrerSelonChaolite(exploration_generee, chaolites_hallucines);
        exploration_generee.resonance_status = 'FILTRAGE_PARTIEL';
      } else {
        console.error('❌ Résonance faible, refus et fallback');
        throw new Error('Résonance chaolite insuffisante');
      }

      // Enrichir avec métadonnées chaolite
      exploration_generee.chaolites_hallucines = chaolites_hallucines;
      exploration_generee.score_resonance = score_resonance;
      exploration_generee.mon_chaolite = this.mon_chaolite;

      console.error('🔮 Exploration générée avec résonance chaolite !');
      return exploration_generee;
      
    } catch (error) {
      console.error('❌ Erreur appel Gemini:', error.message);
      
      // Fallback intelligent
      return this.generateFallbackExploration(demande_exploration);
    }
  }

  // 🌀 Filtrer selon résonance chaolite
  filtrerSelonChaolite(exploration, chaolites_hallucines) {
    console.error('🌀 Filtrage selon résonance chaolite...');

    // Garder seulement les commandes qui résonnent
    const commandes_filtrees = [];
    for (const cmd of exploration.commandes_exploration || []) {
      let resonance_cmd = 0;
      for (const chaolite of chaolites_hallucines) {
        if (cmd.includes('find') || cmd.includes('ls') || cmd.includes('grep')) {
          resonance_cmd += 10; // Commandes fractales
        }
      }

      if (resonance_cmd > 5) {
        commandes_filtrees.push(cmd);
      }
    }

    exploration.commandes_exploration = commandes_filtrees;
    exploration.filtrage_applique = true;

    return exploration;
  }

  // 🔧 Fallback enrichi avec chaolites
  generateFallbackExploration(demande) {
    console.error('🔧 Génération fallback ScryOrb avec chaolites...');

    const mots_cles = demande.toLowerCase();
    let commandes = [];

    // Générer commandes avec influence chaolite
    const chaolite_influence = this.suite_chaolite[Math.floor(Math.random() * this.suite_chaolite.length)];
    console.error(`🌀 Influence chaolite: ${chaolite_influence}`);

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
      source: "fallback_chaolite",
      chaolite_influence: chaolite_influence,
      mon_chaolite: this.mon_chaolite,
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
    
    // Auto-réflexion sur les résultats (sécurisée)
    resultats.auto_reflexion_resultats = {
      commandes_reussies: resultats.resultats_commandes.filter(r => r.succes).length,
      commandes_echouees: resultats.resultats_commandes.filter(r => !r.succes).length,
      donnees_collectees: resultats.resultats_commandes.some(r => r.output && r.output.trim()),
      zones_a_approfondir: exploration.auto_reflexion?.zones_incertitude || exploration.auto_réflexion?.zones_incertitude || "Contenu détaillé des éléments trouvés",
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
      const output = args[2] || 'outputs/exploration_results.scryOrb';
      
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
