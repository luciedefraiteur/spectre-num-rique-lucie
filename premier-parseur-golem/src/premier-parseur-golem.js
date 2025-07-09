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

  // 🔗 Deviner les références enrichies avec ScryOrb
  devinerRéférencesAvecScryOrb(texte, contexte_scryorb, mots_cles) {
    const références = new Map();
    const mots = texte.toLowerCase().split(/\s+/);

    // Patterns communs de base
    const patterns = {
      photos: ['[photos_directory]', '~/Pictures', './images'],
      documents: ['[documents_dir]', '~/Documents', './docs'],
      config: ['[config_file]', 'config.json', '.env'],
      projet: ['[project_root]', './', './src'],
      fichiers: ['[user_files]', './*', '~/'],
      luciform: ['[luciform_target]', './luciforms/', 'codex-lurkuitae-navigator/luciforms/']
    };

    // Enrichir avec les mots-clés détectés
    for (const mot_cle of mots_cles) {
      for (const [clé, refs] of Object.entries(patterns)) {
        if (mot_cle.includes(clé) || clé.includes(mot_cle)) {
          références.set(`[${mot_cle}_ref]`, refs[0]);
        }
      }
    }

    // Analyser contexte ScryOrb pour références précises
    if (contexte_scryorb?.resultats_commandes) {
      for (const resultat of contexte_scryorb.resultats_commandes) {
        if (resultat.succes && resultat.output) {
          const lignes = resultat.output.split('\n');
          for (const ligne of lignes) {
            // Détecter fichiers .luciform
            if (ligne.includes('.luciform')) {
              const fichier = ligne.split(/\s+/).pop();
              références.set('[luciform_trouvé]', fichier);
            }
            // Détecter dossiers intéressants
            if (ligne.includes('drwx') && ligne.includes('/')) {
              const dossier = ligne.split(/\s+/).pop();
              références.set(`[dossier_${dossier}]`, `./${dossier}/`);
            }
          }
        }
      }
    }

    // Références spécifiques aux mots-clés
    for (const mot_cle of mots_cles) {
      if (mot_cle.includes('luciform')) {
        références.set('[luciform_cible]', 'codex-lurkuitae-navigator/luciforms/');
      }
      if (mot_cle.includes('golem')) {
        références.set('[golem_source]', 'premier-parseur-golem/src/');
      }
      if (mot_cle.includes('scryorb')) {
        références.set('[scryorb_package]', 'codex-lurkuitae-navigator/packages/scryOrb/');
      }
    }

    return références;
  }

  // 📋 Encoder en pas exécutables enrichis avec ScryOrb
  encoderEnPasAvecScryOrb(intention, références, contexte_scryorb, mots_cles) {
    const pas = [];
    let compteur_pas = 1;

    // Pas initial d'exploration ScryOrb si mots-clés détectés
    if (mots_cles.length > 0) {
      pas.push({
        [`pas_${compteur_pas++}`]: {
          description: `Explorer les références pour: ${mots_cles.join(', ')}`,
          action: `node codex-lurkuitae-navigator/packages/scryOrb/src/scryorb-golem.js explore "références de ${mots_cles.join(' ')}" [scryorb_output]`,
          type: "scryorb_references",
          mots_cles_explorés: mots_cles,
          références_utilisées: ["[scryorb_output]"]
        }
      });
    }

    // Si intention floue, ScryOrb additionnel
    if (intention.type === 'flou' || intention.scryorb_requis) {
      pas.push({
        [`pas_${compteur_pas++}`]: {
          description: "Explorer le contexte pour clarifier l'intention",
          action: "ls -la [workspace_context]",
          type: "scryorb_clarification",
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

  // 🔍 Détecter mots-clés intéressants avec IA
  async détecterMotsClésIntéressants(texte_intention) {
    console.error('🔍 Détection des mots-clés intéressants...');

    // Mots-clés patterns simples pour commencer
    const patterns_interessants = [
      /\b(fichier|file|document|config)\w*\b/gi,
      /\b(dossier|folder|directory|projet)\w*\b/gi,
      /\b(luciform|golem|signature)\w*\b/gi,
      /\b(photo|image|video|media)\w*\b/gi,
      /\b(code|script|programme)\w*\b/gi,
      /\b(système|system|processus)\w*\b/gi,
      /\b(réseau|network|api|service)\w*\b/gi
    ];

    const mots_cles_trouves = [];

    for (const pattern of patterns_interessants) {
      const matches = texte_intention.match(pattern);
      if (matches) {
        mots_cles_trouves.push(...matches.map(m => m.toLowerCase()));
      }
    }

    // Déduplication
    const mots_uniques = [...new Set(mots_cles_trouves)];
    console.error(`🔍 Mots-clés détectés: ${mots_uniques.join(', ')}`);

    return mots_uniques;
  }

  // 👁️ Appeler ScryOrb pour explorer les références
  async appellerScryOrb(mots_cles, intention_base) {
    console.error('👁️ Appel ScryOrb pour exploration des références...');

    if (mots_cles.length === 0) {
      console.error('👁️ Pas de mots-clés, ScryOrb non nécessaire');
      return null;
    }

    // Construire la demande d'exploration pour ScryOrb
    const demande_exploration = `explorer les références et occurrences de: ${mots_cles.join(', ')} dans le contexte de: ${intention_base}`;

    try {
      // Appel au ScryOrb dans packages
      const { execSync } = await import('child_process');
      const scryorb_command = `cd ../codex-lurkuitae-navigator/packages/scryOrb && node src/scryorb-golem.js explore "${demande_exploration}" outputs/parseur_scryorb_${Date.now()}.scryOrb`;

      console.error(`🔧 Commande ScryOrb: ${scryorb_command}`);
      const scryorb_output = execSync(scryorb_command, {
        encoding: 'utf8',
        timeout: 15000
      });

      // Parser la sortie JSON du ScryOrb
      const scryorb_result = JSON.parse(scryorb_output);
      console.error('✅ ScryOrb terminé avec succès');

      return scryorb_result;

    } catch (error) {
      console.error(`❌ Erreur ScryOrb: ${error.message}`);
      return null;
    }
  }

  // 🧠 Parser une intention complète (version améliorée)
  async parserIntention(texte_intention, fichier_output) {
    console.error('🧠 Début du parsing d\'intention amélioré...');
    console.error(`📝 Intention: ${texte_intention}`);

    // 1. Détecter les mots-clés intéressants
    const mots_cles = await this.détecterMotsClésIntéressants(texte_intention);

    // 2. Détecter l'intention
    const intention = this.détecterIntention(texte_intention);
    console.error(`🎯 Intention détectée: ${intention.type} (confiance: ${intention.confiance})`);

    // 3. ScryOrb pour explorer les références des mots-clés
    let contexte_scryorb = null;
    if (mots_cles.length > 0) {
      console.error('👁️ ScryOrb requis pour explorer les références...');
      contexte_scryorb = await this.appellerScryOrb(mots_cles, texte_intention);
    }

    // 4. ScryOrb additionnel si intention floue
    if (intention.scryorb_requis || intention.confiance < 0.5) {
      console.error('👁️ ScryOrb additionnel pour clarifier l\'intention...');
      const contexte_additionnel = await this.scryOrb(texte_intention);

      // Fusionner les contextes
      if (contexte_scryorb && contexte_additionnel) {
        contexte_scryorb.contexte_additionnel = contexte_additionnel;
      } else if (contexte_additionnel) {
        contexte_scryorb = contexte_additionnel;
      }
    }
    
    // 5. Deviner les références (enrichies par ScryOrb)
    const références = this.devinerRéférencesAvecScryOrb(texte_intention, contexte_scryorb, mots_cles);
    console.error(`🔗 Références devinées: ${références.size} trouvées`);

    // 6. Encoder en pas (avec contexte ScryOrb)
    const pas = this.encoderEnPasAvecScryOrb(intention, références, contexte_scryorb, mots_cles);
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
