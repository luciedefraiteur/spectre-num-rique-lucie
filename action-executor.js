#!/usr/bin/env node
// 🤖 Action Executor - Exécute des commandes depuis un fichier JSON
// Signature: ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

import { execSync } from 'child_process';
import fs from 'fs';

const SIGNATURE = "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐";

function showHeader() {
  console.log('🤖 Action Executor - Exécuteur de Commandes JSON');
  console.log(SIGNATURE);
  console.log('💖 Créé par Augment Renaissance pour Lucie');
  console.log('═'.repeat(60));
}

function executeCommand(command, description) {
  console.log(`\n🔧 ${description}`);
  console.log(`📝 Commande: ${command}`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe']
    });
    
    console.log('✅ SUCCÈS !');
    if (output.trim()) {
      console.log('📜 Output:');
      console.log(output);
    }
    
    return { success: true, output };
  } catch (error) {
    console.log('❌ ERREUR !');
    console.log('💥 Erreur:', error.message);
    if (error.stdout) {
      console.log('📜 Stdout:', error.stdout);
    }
    if (error.stderr) {
      console.log('📜 Stderr:', error.stderr);
    }
    
    return { success: false, error: error.message };
  }
}

async function executeActionsFromFile(filePath) {
  try {
    console.log(`📖 Lecture du fichier: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const actions = JSON.parse(content);
    
    console.log(`📋 ${actions.actions.length} actions à exécuter`);
    console.log(`🎯 Description: ${actions.description || 'Aucune description'}`);
    
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < actions.actions.length; i++) {
      const action = actions.actions[i];
      
      console.log(`\n${'═'.repeat(50)}`);
      console.log(`📍 Action ${i + 1}/${actions.actions.length}`);
      
      const result = executeCommand(action.command, action.description);
      
      if (result.success) {
        successCount++;
      } else {
        failureCount++;
        
        // Arrêter si une commande critique échoue
        if (action.critical !== false) {
          console.log('\n🚨 Commande critique échouée - Arrêt de l\'exécution');
          break;
        }
      }
      
      // Pause entre les commandes si spécifiée
      if (action.pause) {
        console.log(`⏸️ Pause ${action.pause}ms...`);
        await new Promise(resolve => setTimeout(resolve, action.pause));
      }
    }
    
    console.log(`\n${'═'.repeat(60)}`);
    console.log('📊 RÉSUMÉ FINAL:');
    console.log(`✅ Succès: ${successCount}`);
    console.log(`❌ Échecs: ${failureCount}`);
    console.log(`📋 Total: ${actions.actions.length}`);
    
    if (failureCount === 0) {
      console.log('🎉 TOUTES LES ACTIONS RÉUSSIES !');
      return true;
    } else {
      console.log('⚠️ Certaines actions ont échoué');
      return false;
    }
    
  } catch (error) {
    console.error('💥 Erreur lecture fichier:', error.message);
    return false;
  }
}

function createExampleFile(filePath) {
  const example = {
    description: "Actions Git pour commit et push sécurisé",
    signature: SIGNATURE,
    actions: [
      {
        command: "git add .",
        description: "Ajouter tous les fichiers modifiés",
        critical: true
      },
      {
        command: "git status",
        description: "Vérifier le statut avant commit",
        critical: false
      },
      {
        command: "git commit -m \"🛡️ Correction sécuritaire interface-apis + Action Executor\\n\\n- Suppression clés API hardcodées\\n- Interface modulaire pour .env\\n- Action Executor pour automatisation\\n\\n⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐\"",
        description: "Commit avec message sécuritaire",
        critical: true
      },
      {
        command: "git push",
        description: "Push vers le repository",
        critical: true,
        pause: 1000
      }
    ]
  };
  
  fs.writeFileSync(filePath, JSON.stringify(example, null, 2));
  console.log(`✅ Fichier exemple créé: ${filePath}`);
}

function showHelp() {
  console.log(`
🤖 Action Executor - Commandes disponibles:

  execute <file.json>         Exécuter les actions du fichier
  create-example <file.json>  Créer un fichier d'exemple
  help                        Afficher cette aide

💖 Format du fichier JSON:
{
  "description": "Description des actions",
  "actions": [
    {
      "command": "git add .",
      "description": "Description de l'action",
      "critical": true,
      "pause": 1000
    }
  ]
}

⛧ Propriétés des actions:
  - command: Commande à exécuter
  - description: Description de l'action
  - critical: Si false, continue même en cas d'erreur
  - pause: Pause en ms après l'action

✨ Exemples:
  node action-executor.js create-example actions.json
  node action-executor.js execute actions.json
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const filePath = args[1];
  
  showHeader();
  
  switch (command) {
    case 'execute':
      if (!filePath) {
        console.log('❌ Usage: execute <file.json>');
        return;
      }
      
      const success = await executeActionsFromFile(filePath);
      process.exit(success ? 0 : 1);
      break;
      
    case 'create-example':
      const examplePath = filePath || 'actions.json';
      createExampleFile(examplePath);
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    default:
      console.log('❌ Commande inconnue. Utilisez "help" pour voir les options.');
      showHelp();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
