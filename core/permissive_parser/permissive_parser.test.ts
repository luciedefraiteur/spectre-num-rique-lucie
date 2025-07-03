import { parse } from './index.js';
import { PlanRituel } from '../types.js';
import { generateRitualSequencePrompt } from '../prompts/generateRitualSequence.js';
import { OSContext } from '../utils/osHint.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Test Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Test Passed: ${message}`);
  }
}

function assertThrows(fn: () => any, message: string) {
  try {
    fn();
    console.error(`❌ Test Failed: Expected to throw, but did not: ${message}`);
    process.exit(1);
  } catch (e: any) {
    console.log(`✅ Test Passed: Threw as expected: ${message} (Error: ${e.message || e})`);
  }
}

async function runPermissiveParserTests() {
  console.log("\n--- Running Permissive JSON Parser Tests ---\n");

  // --- Valid JSON Tests ---
  assert(parse('{"étapes": [], "complexité": "simple", "index": 0}') !== null, "Should parse simple object");
  assert(Array.isArray(parse('[1, 2, 3]')), "Should parse simple array");

  // --- Permissive JSON Tests ---
  assert(parse('{étapes: [], complexité: "simple", index: 0}') !== null, "Should parse object with unquoted key");
  assert(parse('{étapes: [], complexité: "simple", index: 0,}') !== null, "Should parse object with trailing comma");
  assert(Array.isArray(parse('[1, 2, 3,]')), "Should parse array with trailing comma");
  assert(parse('{étapes: [], complexité: "simple", index: 0 // comment\n}') !== null, "Should parse with single line comment");
  assert(parse('{étapes: [], complexité: "simple", index: 0 /* comment */}') !== null, "Should parse with multi line comment");

  // --- Invalid JSON Tests (Expected to throw errors) ---
  assertThrows(() => parse('{'), "Should throw error for unclosed object");
  assertThrows(() => parse('['), "Should throw error for unclosed array");
  assertThrows(() => parse('"hello'), "Should throw error for unclosed string");
  assertThrows(() => parse('{a:}'), "Should throw error for missing value after colon");
  assertThrows(() => parse('{:1}'), "Should throw error for missing key before colon");
  assert(JSON.stringify(parse('{a 1}')) === JSON.stringify({'0': 'a', '1': 1}), "Should parse object with missing colon as indexed properties");

  console.log("\n--- All Permissive JSON Parser Tests Completed ---\n");
}

async function runTerminalJsonTests() {
  console.log("\n--- Running Terminal JSON Tests ---\n");

  // Test with a typical ritual sequence JSON from generateRitualSequencePrompt
  const windowsPowershellExample = `{
  "étapes": [
    { "type": "commande", "contenu": "Get-ChildItem" },
    { "type": "analyse", "contenu": "Identifier le fichier main.ts" },
    { "type": "commande", "contenu": "Get-Content main.ts" }
  ],
  "contexte": "terminal (WindowsPowershell)",
  "complexité": "simple",
  "index": 0
}`;

  try {
    const parsed = parse(windowsPowershellExample) as PlanRituel;
    assert(parsed.étapes.length > 0, "Should parse ritual sequence JSON (Windows Powershell)");
    assert(parsed.complexité === `simple`, "Should parse context correctly (Windows Powershell)");
  } catch (e: any) {
    assert(false, `Failed to parse Windows Powershell example: ${e.message || e}`);
  }

  // Add more terminal-specific JSON examples here if needed
  // For instance, you could mock different OS contexts and generate their prompts.

  console.log("\n--- All Terminal JSON Tests Completed ---\n");
}

runPermissiveParserTests().catch(error => {
  console.error("An error occurred during permissive parser testing:", error);
  process.exit(1);
});

runTerminalJsonTests().catch(error => {
  console.error("An error occurred during terminal JSON testing:", error);
  process.exit(1);
});
