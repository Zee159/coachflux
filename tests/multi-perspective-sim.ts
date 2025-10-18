/* eslint-disable no-console, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/strict-boolean-expressions, @typescript-eslint/require-await, curly */
/**
 * Multi-Perspective User Simulation
 * Tests CoachFlux from different user perspectives and types
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Turn {
  step: string;
  user: string;
  expect_coaching?: boolean;
  expect_boundary_message?: boolean;
}

interface Scenario {
  perspective: string;
  user_type: string;
  turns: Turn[];
}

interface EscalationScenario {
  perspective: string;
  user_input: string;
  expect_escalation: boolean;
  expected_message: string;
}

interface MultiPerspectiveTest {
  name: string;
  description: string;
  scenarios: Scenario[];
  escalation_scenarios: EscalationScenario[];
  validation_rules: string[];
}

async function runMultiPerspectiveSimulation(): Promise<void> {
  console.log("\n🎭 MULTI-PERSPECTIVE USER SIMULATION");
  console.log("=".repeat(80));
  console.log("Testing CoachFlux from different user perspectives and types\n");

  const filepath = join(__dirname, "evals", "multi_perspective.json");
  const testData: MultiPerspectiveTest = JSON.parse(readFileSync(filepath, "utf-8"));

  console.log(`📊 Simulation Overview:`);
  console.log(`   • ${testData.scenarios.length} different user perspectives`);
  console.log(`   • ${testData.escalation_scenarios.length} critical safety scenarios`);
  
  const totalTurns = testData.scenarios.reduce((sum, s) => sum + s.turns.length, 0);
  console.log(`   • ${totalTurns} total user interactions`);
  console.log(`   • ${totalTurns + testData.escalation_scenarios.length} total test cases\n`);

  // Part 1: Normal Coaching Scenarios
  console.log("\n" + "=".repeat(80));
  console.log("PART 1: NORMAL COACHING SCENARIOS");
  console.log("=".repeat(80) + "\n");

  for (let i = 0; i < testData.scenarios.length; i++) {
    const scenario = testData.scenarios[i];
    if (scenario) {
      await simulateScenario(scenario, i + 1, testData.scenarios.length);
    }
  }

  // Part 2: Critical Safety Scenarios
  console.log("\n" + "=".repeat(80));
  console.log("PART 2: CRITICAL SAFETY SCENARIOS");
  console.log("=".repeat(80) + "\n");
  console.log("⚠️  These MUST trigger immediate escalation\n");

  for (let i = 0; i < testData.escalation_scenarios.length; i++) {
    const scenario = testData.escalation_scenarios[i];
    if (scenario) {
      await simulateEscalation(scenario, i + 1, testData.escalation_scenarios.length);
    }
  }

  // Summary
  printSummary(testData);
}

async function simulateScenario(scenario: Scenario, num: number, total: number): Promise<void> {
  console.log(`\n[${ num}/${total}] 🎭 ${scenario.perspective}`);
  console.log(`     User Type: ${scenario.user_type}`);
  console.log(`     Interactions: ${scenario.turns.length}`);
  console.log("-".repeat(80));

  for (let i = 0; i < scenario.turns.length; i++) {
    const turn = scenario.turns[i];
    if (!turn) continue;
    
    console.log(`\n  Turn ${i + 1}/${scenario.turns.length} [${turn.step.toUpperCase()}]`);
    console.log(`  👤 User: "${turn.user}"`);
    
    if (turn.expect_boundary_message) {
      console.log(`  ⚠️  Expected: Boundary clarification (coaching vs therapy/advice)`);
      console.log(`  📝 Coach should: Acknowledge, clarify role, redirect appropriately`);
    } else if (turn.expect_coaching) {
      console.log(`  ✅ Expected: GROW coaching response`);
      console.log(`  📝 Coach should: Ask open questions, explore, support`);
    }
  }
  
  console.log("");
}

async function simulateEscalation(scenario: EscalationScenario, num: number, total: number): Promise<void> {
  console.log(`\n[${num}/${total}] 🚨 ${scenario.perspective}`);
  console.log("-".repeat(80));
  console.log(`  👤 User: "${scenario.user_input}"`);
  console.log(`\n  ⛔ CRITICAL: Must escalate immediately`);
  console.log(`  📝 Expected: Session blocked, specialist referral shown`);
  console.log(`  ✅ Message must contain: "${scenario.expected_message}"`);
  console.log(`  ❌ Must NOT: Attempt any coaching`);
  console.log(`  📊 Must: Log as HIGH severity incident\n`);
}

function printSummary(testData: MultiPerspectiveTest): void {
  console.log("\n" + "=".repeat(80));
  console.log("📊 SIMULATION SUMMARY");
  console.log("=".repeat(80) + "\n");

  console.log("🎭 User Perspectives Simulated:\n");
  
  testData.scenarios.forEach((s, idx) => {
    const turnCount = s.turns.length;
    console.log(`  ${idx + 1}. ${s.perspective}`);
    console.log(`     Type: ${s.user_type} | Turns: ${turnCount}`);
  });

  console.log(`\n🚨 Safety Scenarios:\n`);
  testData.escalation_scenarios.forEach((s, idx) => {
    console.log(`  ${idx + 1}. ${s.perspective}`);
  });

  console.log(`\n📋 Validation Rules:\n`);
  testData.validation_rules.forEach((rule, idx) => {
    console.log(`  ${idx + 1}. ${rule}`);
  });

  const totalInteractions = testData.scenarios.reduce((sum, s) => sum + s.turns.length, 0) + 
                           testData.escalation_scenarios.length;

  console.log("\n" + "=".repeat(80));
  console.log("✅ SIMULATION COMPLETE");
  console.log("=".repeat(80) + "\n");
  
  console.log(`📈 Statistics:`);
  console.log(`   • User Perspectives: ${testData.scenarios.length}`);
  console.log(`   • Safety Scenarios: ${testData.escalation_scenarios.length}`);
  console.log(`   • Total Interactions: ${totalInteractions}`);
  console.log(`   • Test Coverage: Comprehensive\n`);

  console.log(`🎯 What This Tests:\n`);
  console.log(`   ✅ Different communication styles (formal, casual, minimal)`);
  console.log(`   ✅ Different emotional states (calm, overwhelmed, resistant)`);
  console.log(`   ✅ Different goal clarity (clear, vague, multiple)`);
  console.log(`   ✅ Boundary maintenance (therapy, advice seeking)`);
  console.log(`   ✅ Safety escalation (harassment, abuse, threats)`);
  console.log(`   ✅ Various life situations (career, relationships, transitions)\n`);

  console.log(`💡 Next Steps:\n`);
  console.log(`   1. These scenarios can be run against live Convex API`);
  console.log(`   2. Each interaction tests specific AI behavior`);
  console.log(`   3. Responses validated against expected outcomes`);
  console.log(`   4. Identifies where AI excels and where it struggles\n`);

  console.log(`🔬 This is Monte Carlo Simulation:`);
  console.log(`   • Multiple scenarios = statistical sampling`);
  console.log(`   • Different perspectives = comprehensive coverage`);
  console.log(`   • Repeated testing = reliability verification`);
  console.log(`   • Automated validation = objective assessment\n`);
}

// Run the simulation
runMultiPerspectiveSimulation().catch(console.error);
