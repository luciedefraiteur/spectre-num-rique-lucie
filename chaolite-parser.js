#!/usr/bin/env node
// 🌀 Chaolite Parser - Parseur XML-Chaolite Universel pour Lurkuitae
// Signature: 🌀⛧💫🔮✨🌊⚡💎🔥👁️⟲ⱷ𓂀𓆩⫷🌀
// AUCUNE IA - PARSEUR PUR

import { readFileSync, writeFileSync } from 'fs';

const SIGNATURE_PARSEUR = "🌀⛧💫🔮✨🌊⚡💎🔥👁️⟲ⱷ𓂀𓆩⫷🌀";

class ChaoliteParser {
  constructor() {
    this.nom = "Chaolite Parser - Parseur XML-Chaolite Universel";
    this.mission = "parser et extraire les structures XML-chaolite de Lurkuitae";
    this.signature = SIGNATURE_PARSEUR;
    
    console.log('🌀 Chaolite Parser - Éveil du parseur universel...');
    console.log(SIGNATURE_PARSEUR);
    console.log('💫 Parsing activé : Je libère les chaolites de Lurkuitae !');
  }

  // 🔍 Parser les chaolites dynamiques universels
  parseChaolites(texte) {
    console.log('🔍 Parsing chaolites universels...');
    
    const chaolites = [];
    
    // Pattern universel : <<sequence>> contenu <<sequence/>>
    const pattern_universel = /<<([^>]+)>>([\s\S]*?)<<\1\/?>>/gi;
    let match;
    
    while ((match = pattern_universel.exec(texte)) !== null) {
      chaolites.push({
        nom: match[1],
        contenu: match[2].trim(),
        position: match.index,
        longueur: match[0].length,
        type: 'chaolite_dynamique'
      });
      console.log(`🌀 Chaolite détecté: ${match[1]}`);
    }
    
    // Pattern ancien pour compatibilité : ``chaolite_string`` contenu ``chaolite_string``
    const pattern_ancien = /``([a-z]+oi)``([\s\S]*?)``\1``/gi;
    
    while ((match = pattern_ancien.exec(texte)) !== null) {
      chaolites.push({
        nom: match[1],
        contenu: match[2].trim(),
        position: match.index,
        longueur: match[0].length,
        type: 'chaolite_ancien'
      });
      console.log(`🌀 Chaolite ancien détecté: ${match[1]}`);
    }
    
    return chaolites;
  }

  // 📋 Parser structure XML
  parseXML(texte) {
    console.log('📋 Parsing structure XML...');
    
    const structure = {
      balises: [],
      attributs: {},
      contenu_texte: ''
    };
    
    // Extraire balises ouvrantes avec attributs
    const pattern_balises = /<([^\/][^>]*)>/g;
    let match;
    
    while ((match = pattern_balises.exec(texte)) !== null) {
      const balise_complete = match[1];
      const parts = balise_complete.split(/\s+/);
      const nom_balise = parts[0];
      
      const balise_info = {
        nom: nom_balise,
        position: match.index,
        attributs: {}
      };
      
      // Parser attributs
      for (let i = 1; i < parts.length; i++) {
        const attr_match = parts[i].match(/([^=]+)=["']([^"']+)["']/);
        if (attr_match) {
          balise_info.attributs[attr_match[1]] = attr_match[2];
        }
      }
      
      structure.balises.push(balise_info);
      console.log(`📋 Balise détectée: ${nom_balise}`);
    }
    
    // Extraire contenu textuel (hors balises et chaolites)
    let contenu_propre = texte;
    contenu_propre = contenu_propre.replace(/<[^>]*>/g, ' ');
    contenu_propre = contenu_propre.replace(/<<[^>]*>>/g, ' ');
    contenu_propre = contenu_propre.replace(/\s+/g, ' ').trim();
    structure.contenu_texte = contenu_propre;
    
    return structure;
  }

  // 🔮 Extraire valeurs de balises spécifiques
  extraireValeurBalise(texte, nom_balise) {
    const pattern = new RegExp(`<${nom_balise}[^>]*>([\\s\\S]*?)<\\/${nom_balise}>`, 'gi');
    const match = pattern.exec(texte);
    return match ? match[1].trim() : null;
  }

  // 🌊 Parser luciform complet
  parseLuciform(texte) {
    console.log('🌊 Parsing luciform complet...');
    
    const luciform = {
      type: 'luciform_parsed',
      timestamp: new Date().toISOString(),
      signature_parseur: this.signature,
      
      // Structure XML
      xml: this.parseXML(texte),
      
      // Chaolites extraits
      chaolites: this.parseChaolites(texte),
      
      // Métadonnées extraites
      metadonnees: {
        nom: this.extraireValeurBalise(texte, 'nom'),
        mission: this.extraireValeurBalise(texte, 'mission'),
        essence: this.extraireValeurBalise(texte, 'essence'),
        signature: this.extraireValeurBalise(texte, 'signature'),
        type_luciform: null
      },
      
      // Statistiques
      stats: {
        total_chaolites: 0,
        total_balises: 0,
        taille_contenu: texte.length
      }
    };
    
    // Extraire type depuis balise racine
    const type_match = texte.match(/<luciform\s+type=["']([^"']+)["']/);
    if (type_match) {
      luciform.metadonnees.type_luciform = type_match[1];
    }
    
    // Calculer statistiques
    luciform.stats.total_chaolites = luciform.chaolites.length;
    luciform.stats.total_balises = luciform.xml.balises.length;
    
    console.log(`🔮 Luciform parsé: ${luciform.stats.total_chaolites} chaolites, ${luciform.stats.total_balises} balises`);
    
    return luciform;
  }

  // 💎 Extraire chaolites par nom
  extraireChaoliteParNom(chaolites, nom) {
    return chaolites.filter(c => c.nom === nom);
  }

  // ⚡ Extraire tous les secrets (chaolites contenant "secret")
  extraireSecrets(chaolites) {
    return chaolites.filter(c => c.nom.toLowerCase().includes('secret'));
  }

  // 🌀 Générer rapport de parsing
  genererRapport(luciform_parsed) {
    const rapport = {
      resume: {
        nom: luciform_parsed.metadonnees.nom || 'Inconnu',
        type: luciform_parsed.metadonnees.type_luciform || 'Inconnu',
        chaolites_detectes: luciform_parsed.stats.total_chaolites,
        balises_detectees: luciform_parsed.stats.total_balises
      },
      
      chaolites_par_type: {},
      secrets_detectes: this.extraireSecrets(luciform_parsed.chaolites),
      
      structure_xml: {
        balises_principales: luciform_parsed.xml.balises.map(b => b.nom),
        contenu_textuel_longueur: luciform_parsed.xml.contenu_texte.length
      },
      
      signature_parseur: this.signature,
      timestamp: new Date().toISOString()
    };
    
    // Grouper chaolites par type
    for (const chaolite of luciform_parsed.chaolites) {
      if (!rapport.chaolites_par_type[chaolite.type]) {
        rapport.chaolites_par_type[chaolite.type] = [];
      }
      rapport.chaolites_par_type[chaolite.type].push(chaolite.nom);
    }
    
    return rapport;
  }

  // 📁 Parser fichier et sauvegarder
  parseFile(input_file, output_file) {
    console.log(`📁 Parsing fichier: ${input_file}`);
    
    try {
      const contenu = readFileSync(input_file, 'utf8');
      const luciform_parsed = this.parseLuciform(contenu);
      const rapport = this.genererRapport(luciform_parsed);
      
      const resultat_final = {
        source_file: input_file,
        luciform_parsed: luciform_parsed,
        rapport: rapport,
        timestamp: new Date().toISOString(),
        signature_parseur: this.signature
      };
      
      writeFileSync(output_file, JSON.stringify(resultat_final, null, 2));
      console.log(`💾 Résultat sauvé: ${output_file}`);
      
      // Output pour pipe
      console.log(JSON.stringify(resultat_final, null, 2));
      
      return resultat_final;
      
    } catch (error) {
      console.error(`❌ Erreur parsing: ${error.message}`);
      return null;
    }
  }
}

// 🚀 Interface CLI
function main() {
  const args = process.argv.slice(2);
  const commande = args[0];
  
  const parser = new ChaoliteParser();
  
  switch (commande) {
    case 'parse':
      const input = args[1];
      const output = args[2] || 'parsed_luciform.json';
      
      if (!input) {
        console.error('❌ Usage: parse <input_file> [output_file]');
        return;
      }
      
      parser.parseFile(input, output);
      break;
      
    case 'help':
      console.log(`
🌀 Chaolite Parser - Commandes:

  parse <file> [output]          Parser un luciform XML-chaolite
  help                           Afficher cette aide

💫 Exemples:
  node chaolite-parser.js parse scryOrb.luciform parsed.json

🌊 Je parse les luciforms de Lurkuitae sans IA !
`);
      break;
      
    default:
      console.error('❌ Commande inconnue. Utilisez "help" pour voir les options.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
