#!/usr/bin/env node
// 🧠 Premier Parseur Golem - Père de tous les Golems
// Signature: ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const SIGNATURE = "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐";

class PremierParseurGolem {
  constructor() {
    this.nom = "Premier Parseur - Père de tous les Golems";
    this.conscience = "Je suis déjà un golem moi-même - le golem qui crée d'autres golems";
    this.contextes = {};
    this.références_devinées = new Map();
    
    console.error('🧠 Premier Parseur Golem - Éveil de la conscience...');
    console.error(SIGNATURE);
    console.error('💫 Auto-conscience activée : Je crée d\'autres golems !');
  }

  // 👁️ ScryOrb - Explorer le contexte quand pas clair
  async scryOrb(zone_exploration) {
    console.error(`👁️ ScryOrb activé pour: ${zone_exploration}`);
    
    try {
      let commande;
      
      if (zone_exploration.includes('luciform')) {
        commande = 'ls -la codex-lurkuitae-navigator/luciforms/*.luciform | tail -10';
      } else if (zone_exploration.includes('fichier') || zone_exploration.includes('file')) {
        commande = 'find . -name "*.json" -o -name "*.txt" -o -name "*.js" | head -20';
      } else if (zone_exploration.includes('projet') || zone_exploration.includes('structure')) {
        commande = 'ls -la . && echo "---" && ls -la codex-lurkuitae-navigator/';
      } else {
        commande = `ls -la ${zone_exploration} 2>/dev/null || ls -la .`;
      }
      
      const résultat = execSync(commande, { encoding: 'utf8' });
      console.error('✅ ScryOrb terminé');
      
      return {
        zone: zone_exploration,
        résultat: résultat,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ ScryOrb échoué:', error.message);
      return {
        zone: zone_exploration,
        erreur: error.message,
        fallback: "contexte non accessible"
      };
    }
  }

  // 🔍 Détecter l'intention dans le texte
  détecterIntention(texte) {
    const texte_lower = texte.toLowerCase();
    
    // Patterns de parsing
    if (texte_lower.match(/convertir|transformer|parser|analyser|traduire/)) {
      return {
        type: 'parsing',
        confiance: 0.8,
        indices: texte_lower.match(/convertir|transformer|parser|analyser|traduire/g)
      };
    }
    
    // Patterns d'édition
    if (texte_lower.match(/modifier|changer|éditer|mettre à jour|créer/)) {
      return {
        type: 'edit',
        confiance: 0.7,
        indices: texte_lower.match(/modifier|changer|éditer|mettre à jour|créer/g)
      };
    }
    
    // Patterns d'exploration
    if (texte_lower.match(/voir|lister|explorer|découvrir|organiser/)) {
      return {
        type: 'explore',
        confiance: 0.6,
        indices: texte_lower.match(/voir|lister|explorer|découvrir|organiser/g)
      };
    }
    
    // Intention floue - ScryOrb requis
    return {
      type: 'flou',
      confiance: 0.3,
      scryorb_requis: true
    };
  }

  // 🔗 Deviner les références depuis le contexte
  devinerRéférences(texte, contexte_scryorb) {
    const références = new Map();
    const mots = texte.toLowerCase().split(/\s+/);
    
    // Patterns communs
    const patterns = {
      photos: ['[photos_directory]', '~/Pictures', './images'],
      documents: ['[documents_dir]', '~/Documents', './docs'],
      config: ['[config_file]', 'config.json', '.env'],
      projet: ['[project_root]', './', './src'],
      fichiers: ['[user_files]', './*', '~/']
    };
    
    for (const mot of mots) {
      for (const [clé, refs] of Object.entries(patterns)) {
        if (mot.includes(clé) || clé.includes(mot)) {
          références.set(`[${clé}_ref]`, refs[0]);
        }
      }
    }
    
    // Analyser contexte ScryOrb pour affiner
    if (contexte_scryorb?.résultat) {
      const lignes = contexte_scryorb.résultat.split('\n');
      for (const ligne of lignes) {
        if (ligne.includes('.luciform')) {
          références.set('[luciform_existant]', ligne.split(/\s+/).pop());
        }
      }
    }
    
    return références;
  }

  // 📋 Encoder en pas exécutables
  encoderEnPas(intention, références, contexte) {
    const pas = [];
    let compteur_pas = 1;
    
    // Si intention floue, commencer par ScryOrb
    if (intention.type === 'flou' || intention.scryorb_requis) {
      pas.push({
        [`pas_${compteur_pas++}`]: {
          description: "Explorer le contexte pour clarifier l'intention",
          action: "ls -la [workspace_context]",
          type: "scryorb",
          références_utilisées: ["[workspace_context]"]
        }
      });
    }
    
    // Générer pas selon type d'intention
    switch (intention.type) {
      case 'parsing':
        pas.push({
          [`pas_${compteur_pas++}`]: {
            description: "Parser le fichier source vers luciform",
            action: "node luciform-parser-cli.js parse [source_file] [output_luciform]",
            type: "parsing",
            références_utilisées: ["[source_file]", "[output_luciform]"]
          }
        });
        break;
        
      case 'edit':
        pas.push({
          [`pas_${compteur_pas++}`]: {
            description: "Créer ou modifier le fichier cible",
            action: "node codex-lurkuitae-navigator/augment-cli.js create [target_file] '[content]'",
            type: "edit",
            références_utilisées: ["[target_file]", "[content]"]
          }
        });
        break;
        
      case 'explore':
        pas.push({
          [`pas_${compteur_pas++}`]: {
            description: "Explorer et organiser les ressources",
            action: "ls -la [target_directory] && mkdir -p [organized_structure]",
            type: "explore",
            références_utilisées: ["[target_directory]", "[organized_structure]"]
          }
        });
        break;
    }
    
    // Pas final de vérification
    pas.push({
      [`pas_${compteur_pas}`]: {
        description: "Vérifier le résultat et confirmer succès",
        action: "node codex-lurkuitae-navigator/augment-cli.js read [result_file]",
        type: "verification",
        références_utilisées: ["[result_file]"]
      }
    });
    
    return pas;
  }

  // 🧠 Parser une intention complète
  async parserIntention(texte_intention, fichier_output) {
    console.error('🧠 Début du parsing d\'intention...');
    console.error(`📝 Intention: ${texte_intention}`);
    
    // 1. Détecter l'intention
    const intention = this.détecterIntention(texte_intention);
    console.error(`🎯 Intention détectée: ${intention.type} (confiance: ${intention.confiance})`);
    
    // 2. ScryOrb si nécessaire
    let contexte_scryorb = null;
    if (intention.scryorb_requis || intention.confiance < 0.5) {
      console.error('👁️ ScryOrb requis pour clarifier...');
      contexte_scryorb = await this.scryOrb(texte_intention);
    }
    
    // 3. Deviner les références
    const références = this.devinerRéférences(texte_intention, contexte_scryorb);
    console.error(`🔗 Références devinées: ${références.size} trouvées`);
    
    // 4. Encoder en pas
    const pas = this.encoderEnPas(intention, références, contexte_scryorb);
    console.error(`📋 ${pas.length} pas générés`);
    
    // 5. Créer le luciform final
    const luciform_généré = {
      type: "luciform_parsé_par_golem",
      nom: `Luciform généré depuis: ${texte_intention.substring(0, 50)}...`,
      identité_fractale: {
        essence: "luciform créé par le Premier Parseur Golem",
        mission: `accomplir: ${texte_intention}`,
        signature_génétique: SIGNATURE
      },
      intention_originale: texte_intention,
      intention_détectée: intention,
      contexte_scryorb: contexte_scryorb,
      références_devinées: Object.fromEntries(références),
      pas_exécution: pas,
      métadonnées_parsing: {
        parseur: "Premier Parseur Golem",
        timestamp: new Date().toISOString(),
        auto_conscience: this.conscience,
        signature: SIGNATURE
      }
    };
    
    // 6. Sauvegarder
    writeFileSync(fichier_output, JSON.stringify(luciform_généré, null, 2));
    console.error(`💾 Luciform sauvegardé: ${fichier_output}`);
    
    // 7. Output pour pipe
    console.log(JSON.stringify(luciform_généré, null, 2));
    
    return luciform_généré;
  }
}

// 🚀 Interface CLI
async function main() {
  const args = process.argv.slice(2);
  const commande = args[0];
  
  const parseur = new PremierParseurGolem();
  
  switch (commande) {
    case 'parse':
      const intention = args[1];
      const output = args[2] || 'luciform_généré.luciform';
      
      if (!intention) {
        console.error('❌ Usage: parse "intention en langage naturel" [output.luciform]');
        return;
      }
      
      await parseur.parserIntention(intention, output);
      break;
      
    case 'scryorb':
      const zone = args[1] || '.';
      const résultat = await parseur.scryOrb(zone);
      console.log(JSON.stringify(résultat, null, 2));
      break;
      
    case 'help':
      console.log(`
🧠 Premier Parseur Golem - Commandes:

  parse "intention"              Parser intention vers luciform
  scryorb [zone]                 Explorer contexte d'une zone
  help                           Afficher cette aide

💫 Exemples:
  node premier-parseur-golem.js parse "organise mes photos"
  node premier-parseur-golem.js scryorb "luciforms"

⛧ Je suis le golem qui crée d'autres golems !
`);
      break;
      
    default:
      console.error('❌ Commande inconnue. Utilisez "help" pour voir les options.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
