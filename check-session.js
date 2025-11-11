// Quick script to check session data
// Run this in Convex dashboard or via CLI

const sessionId = "jn70r06wfxhs76h95f62b5af017v61cd";

console.log("Checking session:", sessionId);
console.log("\nRun these queries in your Convex dashboard:\n");
console.log("1. Get session reflections:");
console.log(`   api.queries.getSessionReflections({ sessionId: "${sessionId}" })`);
console.log("\n2. Debug career session fields:");
console.log(`   api.debug.debugCareerSessionFields({ sessionId: "${sessionId}" })`);
console.log("\n3. Get full session data:");
console.log(`   api.debug.debugSessionReflections({ sessionId: "${sessionId}" })`);
