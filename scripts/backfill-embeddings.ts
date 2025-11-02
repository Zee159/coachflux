/**
 * Backfill embeddings for all existing closed sessions
 * 
 * Usage:
 *   npx convex run scripts/backfill-embeddings
 */

import { api } from "../convex/_generated/api";

export default async function backfillEmbeddings(
  ctx: { runAction: (action: any, args: any) => Promise<any> }
) {
  console.log("Starting embedding backfill...");
  
  let totalProcessed = 0;
  let totalErrors = 0;
  let round = 1;
  
  while (true) {
    console.log(`\nRound ${round}: Processing batch...`);
    
    const result = await ctx.runAction(api.embeddings.backfillSessionEmbeddings, {
      batchSize: 10
    });
    
    console.log(`  Processed: ${result.processed}`);
    console.log(`  Errors: ${result.errors}`);
    console.log(`  Remaining: ${result.remaining}`);
    
    totalProcessed += result.processed;
    totalErrors += result.errors;
    
    // Stop if no more sessions to process
    if (result.remaining === 0) {
      console.log("\n✅ Backfill complete!");
      console.log(`Total processed: ${totalProcessed}`);
      console.log(`Total errors: ${totalErrors}`);
      break;
    }
    
    round++;
    
    // Safety limit to prevent infinite loops
    if (round > 100) {
      console.log("\n⚠️ Stopped after 100 rounds (safety limit)");
      break;
    }
  }
  
  return {
    totalProcessed,
    totalErrors,
    rounds: round
  };
}
