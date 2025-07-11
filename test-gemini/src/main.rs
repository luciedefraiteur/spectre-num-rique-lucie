// 🧪 Test isolé pour diagnostiquer Gemini CLI
// Par LUCIFER MORNINGSTAR ⛧

use std::process::Stdio;
use tokio::process::Command;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader, BufWriter};
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    println!("🧪 TEST GEMINI CLI - Diagnostic isolé par LUCIFER MORNINGSTAR");
    println!("═══════════════════════════════════════════════════════════════");
    
    // Test 1: Vérifier que gemini existe
    println!("\n🔍 Test 1: Vérification existence de 'gemini'");
    match std::process::Command::new("which").arg("gemini").output() {
        Ok(output) => {
            if output.status.success() {
                let path = String::from_utf8_lossy(&output.stdout);
                println!("✅ Gemini trouvé: {}", path.trim());
            } else {
                println!("❌ Gemini non trouvé dans PATH");
                println!("💡 Essayons d'autres commandes...");
                
                // Tester d'autres variantes
                for cmd in &["gemini-cli", "google-gemini", "gcloud", "ai"] {
                    if let Ok(output) = std::process::Command::new("which").arg(cmd).output() {
                        if output.status.success() {
                            let path = String::from_utf8_lossy(&output.stdout);
                            println!("✅ Alternative trouvée - {}: {}", cmd, path.trim());
                        }
                    }
                }
                return Ok(());
            }
        }
        Err(e) => {
            println!("❌ Erreur vérification: {}", e);
            return Ok(());
        }
    }
    
    // Test 2: Vérifier les variables d'environnement
    println!("\n🔑 Test 2: Vérification variables d'environnement");
    if let Ok(api_key) = std::env::var("GEMINI_API_KEY") {
        let masked = format!("{}***{}", 
            &api_key[..std::cmp::min(8, api_key.len())],
            &api_key[std::cmp::max(0, api_key.len().saturating_sub(4))..]);
        println!("✅ GEMINI_API_KEY: {}", masked);
    } else {
        println!("⚠️ GEMINI_API_KEY non définie");
    }
    
    // Test 3: Lancer gemini et tester communication
    println!("\n🗣️ Test 3: Démarrage processus Gemini");
    
    let mut child = match Command::new("gemini")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn() {
        Ok(child) => {
            println!("✅ Processus Gemini démarré (PID: {:?})", child.id());
            child
        }
        Err(e) => {
            println!("❌ Erreur démarrage: {}", e);
            return Ok(());
        }
    };
    
    let stdin = child.stdin.take().unwrap();
    let stdout = child.stdout.take().unwrap();
    let stderr = child.stderr.take().unwrap();
    
    let mut writer = BufWriter::new(stdin);
    let mut reader = BufReader::new(stdout);
    let mut error_reader = BufReader::new(stderr);
    
    // Test 4: Attendre un peu que le processus s'initialise
    println!("\n⏳ Test 4: Attente initialisation (2s)");
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
    
    // Vérifier si le processus est encore vivant
    match child.try_wait() {
        Ok(Some(status)) => {
            println!("⚠️ Processus déjà terminé avec status: {}", status);
            
            // Lire stderr pour voir pourquoi
            let mut error_line = String::new();
            if let Ok(_) = error_reader.read_line(&mut error_line).await {
                if !error_line.is_empty() {
                    println!("📋 Erreur stderr: {}", error_line.trim());
                }
            }
            return Ok(());
        }
        Ok(None) => {
            println!("✅ Processus encore en vie");
        }
        Err(e) => {
            println!("❌ Erreur vérification processus: {}", e);
        }
    }
    
    // Test 5: Envoyer un prompt très simple
    println!("\n💬 Test 5: Envoi prompt simple");
    let test_prompt = "Hello";
    
    println!("📤 Envoi: '{}'", test_prompt);
    if let Err(e) = writer.write_all(test_prompt.as_bytes()).await {
        println!("❌ Erreur écriture: {}", e);
        return Ok(());
    }
    
    if let Err(e) = writer.write_all(b"\n").await {
        println!("❌ Erreur écriture newline: {}", e);
        return Ok(());
    }
    
    if let Err(e) = writer.flush().await {
        println!("❌ Erreur flush: {}", e);
        return Ok(());
    }
    
    println!("✅ Prompt envoyé");
    
    // Test 6: Lire la réponse avec timeout progressif
    println!("\n⏰ Test 6: Lecture réponse (timeout 30s)");
    
    let mut response = String::new();
    match tokio::time::timeout(
        tokio::time::Duration::from_secs(30),
        reader.read_line(&mut response)
    ).await {
        Ok(Ok(bytes_read)) => {
            if bytes_read > 0 {
                println!("✅ Réponse reçue ({} bytes): '{}'", bytes_read, response.trim());
            } else {
                println!("⚠️ EOF reçu - processus fermé?");
            }
        }
        Ok(Err(e)) => {
            println!("❌ Erreur lecture: {}", e);
        }
        Err(_) => {
            println!("⏰ Timeout après 30s - Gemini ne répond pas");
            
            // Vérifier stderr
            let mut error_line = String::new();
            if let Ok(Ok(_)) = tokio::time::timeout(
                tokio::time::Duration::from_secs(1),
                error_reader.read_line(&mut error_line)
            ).await {
                if !error_line.is_empty() {
                    println!("📋 Erreur pendant timeout: {}", error_line.trim());
                }
            }
        }
    }
    
    // Test 7: État final du processus
    println!("\n🔍 Test 7: État final du processus");
    match child.try_wait() {
        Ok(Some(status)) => {
            println!("⚠️ Processus terminé avec status: {}", status);
        }
        Ok(None) => {
            println!("✅ Processus encore en vie");
            println!("🧹 Terminaison du processus...");
            let _ = child.kill();
        }
        Err(e) => {
            println!("❌ Erreur vérification processus: {}", e);
        }
    }
    
    println!("\n🎯 DIAGNOSTIC TERMINÉ");
    println!("═══════════════════════════════════════════════════════════════");
    
    Ok(())
}
