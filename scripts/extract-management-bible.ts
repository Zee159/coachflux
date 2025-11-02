/**
 * Extract scenarios from Management Bible PDF
 * 
 * This script:
 * 1. Reads the Management Bible PDF
 * 2. Extracts chapters and sections
 * 3. Creates structured knowledge entries
 * 4. Generates embeddings for semantic search
 * 
 * Usage:
 *   npm install pdf-parse
 *   npx ts-node scripts/extract-management-bible.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// You'll need to install: npm install pdf-parse
// import pdf from 'pdf-parse';

interface KnowledgeEntry {
  source: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  pageNumber?: number;
}

/**
 * Parse Management Bible PDF and extract structured content
 */
async function extractManagementBible(): Promise<KnowledgeEntry[]> {
  const pdfPath = path.join(__dirname, '../framework/The Management Bible (Bob Nelson, Peter Economy) (Z-Library).pdf');
  
  console.log('Reading PDF:', pdfPath);
  
  // Check if file exists
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF not found at: ${pdfPath}`);
  }
  
  // TODO: Implement PDF parsing
  // const dataBuffer = fs.readFileSync(pdfPath);
  // const data = await pdf(dataBuffer);
  
  console.log('PDF found! Next steps:');
  console.log('1. Install pdf-parse: npm install pdf-parse');
  console.log('2. Parse PDF content');
  console.log('3. Extract chapters/sections');
  console.log('4. Create knowledge entries');
  
  // Example structure of what we'll extract:
  const exampleEntries: KnowledgeEntry[] = [
    {
      source: 'management_bible',
      category: 'performance_management',
      title: 'Setting Clear Expectations',
      content: `
Setting clear expectations is fundamental to effective management.

Key Principles:
1. Be Specific - "Complete the report by Friday 5pm" not "finish soon"
2. Measurable - Define what success looks like
3. Documented - Write it down, share it
4. Agreed Upon - Get commitment, not just compliance
5. Reviewed Regularly - Check-ins prevent surprises

Common Mistakes:
- Assuming people know what you want
- Being vague to avoid conflict
- Setting expectations once and never revisiting
- Not checking for understanding

Best Practice:
After setting an expectation, ask: "What's your understanding of what I'm asking for?"
This reveals gaps immediately.
      `,
      tags: ['expectations', 'clarity', 'communication', 'performance'],
      pageNumber: 42
    },
    {
      source: 'management_bible',
      category: 'feedback',
      title: 'The Feedback Sandwich Myth',
      content: `
The "feedback sandwich" (positive-negative-positive) is widely taught but often ineffective.

Why It Fails:
1. People learn to ignore the positive (waiting for the "but")
2. The negative gets diluted
3. Feels manipulative when overused
4. Confuses the message

Better Approach: Direct, Kind Feedback
1. State the specific behavior
2. Explain the impact
3. Request the change
4. Offer support

Example:
"In yesterday's meeting, you interrupted Sarah three times. This makes her 
reluctant to share ideas. I need you to let people finish their thoughts. 
Would it help if I gave you a signal when you're interrupting?"

This is clear, kind, and actionable.
      `,
      tags: ['feedback', 'communication', 'difficult_conversations'],
      pageNumber: 156
    }
  ];
  
  return exampleEntries;
}

/**
 * Save extracted entries to JSON for review
 */
async function saveEntries(entries: KnowledgeEntry[]) {
  const outputPath = path.join(__dirname, '../data/management-bible-entries.json');
  
  // Create data directory if it doesn't exist
  const dataDir = path.dirname(outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`\n✅ Saved ${entries.length} entries to: ${outputPath}`);
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🔍 Extracting Management Bible content...\n');
    
    const entries = await extractManagementBible();
    await saveEntries(entries);
    
    console.log('\n📊 Summary:');
    console.log(`Total entries: ${entries.length}`);
    
    // Group by category
    const byCategory = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\nBy category:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
    console.log('\n✅ Next step: Review entries and load into Convex');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
