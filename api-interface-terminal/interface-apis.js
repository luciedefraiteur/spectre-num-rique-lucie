#!/usr/bin/env node
// 🔧 Interface APIs - Charge .env et pipe vers CLIs modulaires
// Signature: ⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

// Charger le .env depuis le parent
function loadEnv() {
  try {
    const envPath = join('..', '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error('❌ Erreur chargement .env:', error.message);
    return {};
  }
}

// Configuration des APIs depuis .env
function getAPIConfig(envVars) {
  return {
    gemini: {
      key: envVars.GEMINI_API_KEY || 'GEMINI_API_KEY_NOT_SET',
      models: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']
    },
    openai: {
      key: envVars.OPENAI_API_KEY || 'OPENAI_API_KEY_NOT_SET',
      models: ['gpt-4', 'gpt-3.5-turbo']
    },
    claude: {
      key: envVars.CLAUDE_API_KEY || 'CLAUDE_API_KEY_NOT_SET',
      models: ['claude-3-sonnet', 'claude-3-haiku']
    }
  };
}

// Pipe vers un CLI avec configuration API
function pipeToCLI(cliCommand, apiConfig, input) {
  return new Promise((resolve, reject) => {
    console.error(`🔧 Interface APIs - Pipe vers ${cliCommand}`);
    console.error(`⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐`);

    // Créer l'objet de configuration à piper
    const configData = {
      api_config: apiConfig,
      input: input,
      timestamp: new Date().toISOString(),
      signature: "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐"
    };

    const configJSON = JSON.stringify(configData, null, 2);

    // Lancer le CLI
    const child = spawn('node', cliCommand.split(' '), {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(data.toString());
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`CLI exited with code ${code}: ${errorOutput}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });

    // Envoyer la configuration via stdin
    child.stdin.write(configJSON);
    child.stdin.end();
  });
}

async function testOpenAI(model = 'gpt-3.5-turbo', prompt = 'Hello from API interface terminal! ⛧') {
  console.log(`🤖 Test OpenAI ${model}...`);
  console.log(`📝 Prompt: ${prompt}`);
  
  try {
    const url = 'https://api.openai.com/v1/chat/completions';
    
    const body = {
      model: model,
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 1000
    };
    
    console.log(`🌐 URL: ${url}`);
    console.log(`📦 Body:`, JSON.stringify(body, null, 2));
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIS.openai.key}`
      },
      body: JSON.stringify(body)
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log(`⏱️ Temps de réponse: ${responseTime}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    if (response.ok) {
      const text = data.choices?.[0]?.message?.content;
      console.log('✅ SUCCÈS !');
      console.log('📜 Réponse:');
      console.log('═'.repeat(50));
      console.log(text || 'Pas de texte dans la réponse');
      console.log('═'.repeat(50));
      
      return { success: true, text, responseTime };
    } else {
      console.log('❌ ERREUR !');
      console.log('📜 Erreur:');
      console.log(JSON.stringify(data, null, 2));
      
      return { success: false, error: data, responseTime };
    }
    
  } catch (error) {
    console.log('💥 EXCEPTION !');
    console.log('Error:', error.message);
    
    return { success: false, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const apiType = args[0] || 'gemini';
  const cliCommand = args[1];
  const input = args.slice(2).join(' ') || 'Hello from interface APIs! ⛧';

  console.error('🔧 Interface APIs - Chargeur .env et Pipe modulaire');
  console.error('⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐');
  console.error('═'.repeat(60));

  // Charger les variables d'environnement
  const envVars = loadEnv();
  const apiConfig = getAPIConfig(envVars);

  if (!cliCommand) {
    console.error('❌ Usage: node interface-apis.js <api> <cli-command> [input]');
    console.error('');
    console.error('APIs supportées: gemini, openai, claude');
    console.error('');
    console.error('Exemples:');
    console.error('  node interface-apis.js gemini "../augment-renaissance-cli.js animate" "Créer un site web"');
    console.error('  node interface-apis.js openai "luciform-parser-cli" "Automatiser mes tâches"');
    console.error('  node interface-apis.js claude "file-editor-cli" "Modifier config.json"');
    console.error('');
    console.error('Le CLI recevra la config API via stdin en JSON:');
    console.error('  { "api_config": {...}, "input": "...", "signature": "..." }');
    process.exit(1);
  }

  // Vérifier que l'API demandée existe
  if (!apiConfig[apiType.toLowerCase()]) {
    console.error(`❌ API "${apiType}" non supportée`);
    console.error('APIs disponibles:', Object.keys(apiConfig).join(', '));
    process.exit(1);
  }

  const selectedAPI = apiConfig[apiType.toLowerCase()];

  // Vérifier que la clé API est configurée
  if (selectedAPI.key.includes('NOT_SET')) {
    console.error(`❌ Clé API ${apiType.toUpperCase()} non configurée dans .env`);
    console.error(`Ajoutez ${apiType.toUpperCase()}_API_KEY=votre_clé dans le fichier .env`);
    process.exit(1);
  }

  console.error(`🔑 API ${apiType} configurée`);
  console.error(`🎯 CLI cible: ${cliCommand}`);
  console.error(`📝 Input: ${input}`);

  try {
    // Pipe vers le CLI
    const result = await pipeToCLI(cliCommand, selectedAPI, input);

    // Output du CLI sur stdout
    console.log(result);

  } catch (error) {
    console.error('💥 Erreur pipe CLI:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
