#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const UNSAFE_PATTERNS = [
  { pattern: /:\s*any\b/g, name: 'Type annotation "any"' },
  { pattern: /\bas\s+any\b/g, name: 'Type assertion "as any"' },
  { pattern: /\bas\s+unknown\s+as\b/g, name: 'Double assertion "as unknown as"' },
  { pattern: /@ts-ignore/g, name: '@ts-ignore directive' },
  { pattern: /@ts-expect-error/g, name: '@ts-expect-error directive' },
  { pattern: /@ts-nocheck/g, name: '@ts-nocheck directive' },
  { pattern: /eslint-disable/g, name: 'eslint-disable directive' },
];

const EXCLUDED_DIRS = [
  'node_modules',
  'dist',
  'build',
  '.convex',
  '_generated',
  '.vscode',
  '.git',
  'scripts',
  'tests'
];

const EXCLUDED_FILES = [
  '.eslintrc.cjs',
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js'
];

// Allowlisted patterns for known infrastructure workarounds
const ALLOWED_WORKAROUNDS = [
  {
    // Convex type recursion workaround in coach module
    files: ['convex/coach/base.ts', 'convex/coach/index.ts'],
    reason: 'Necessary workaround for Convex generated type deep recursion',
    patterns: ['Type annotation "any"', '@ts-expect-error directive', 'eslint-disable directive']
  },
  {
    // Non-null assertion for guaranteed fallback
    files: ['convex/safety.ts'],
    reason: 'US emergency resources guaranteed to exist as fallback',
    patterns: ['eslint-disable directive']
  }
];

function isExcluded(path) {
  return EXCLUDED_DIRS.some(dir => path.includes(dir)) || 
         EXCLUDED_FILES.some(file => path.endsWith(file));
}

function isAllowedWorkaround(filePath, patternName) {
  // Normalize path separators for cross-platform compatibility
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  return ALLOWED_WORKAROUNDS.some(workaround => {
    const fileMatches = workaround.files.some(file => normalizedPath.endsWith(file));
    const patternMatches = workaround.patterns.includes(patternName);
    return fileMatches && patternMatches;
  });
}

function scanFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  UNSAFE_PATTERNS.forEach(({ pattern, name }) => {
    lines.forEach((line, index) => {
      const matches = line.match(pattern);
      if (matches) {
        issues.push({
          file: filePath,
          line: index + 1,
          pattern: name,
          code: line.trim()
        });
      }
    });
  });

  return issues;
}

function scanDirectory(dir) {
  let allIssues = [];
  
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    
    if (isExcluded(fullPath)) {
      continue;
    }
    
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      allIssues = allIssues.concat(scanDirectory(fullPath));
    } else if (stat.isFile()) {
      const ext = extname(fullPath);
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        const issues = scanFile(fullPath);
        allIssues = allIssues.concat(issues);
      }
    }
  }
  
  return allIssues;
}

console.log('🔍 Scanning for unsafe code patterns...\n');

const allIssues = scanDirectory(process.cwd());

// Filter out allowed workarounds
const issues = allIssues.filter(issue => !isAllowedWorkaround(issue.file, issue.pattern));
const allowedCount = allIssues.length - issues.length;

if (allowedCount > 0) {
  console.log(`ℹ️  ${allowedCount} known workaround(s) allowed (documented infrastructure constraints)\n`);
}

if (issues.length === 0) {
  console.log('✅ No unsafe patterns found! Your code is clean.\n');
  process.exit(0);
} else {
  console.log(`❌ Found ${issues.length} unsafe pattern(s):\n`);
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.pattern}`);
    console.log(`   File: ${issue.file}:${issue.line}`);
    console.log(`   Code: ${issue.code}`);
    console.log('');
  });
  
  console.log(`\n❌ Safety check failed: ${issues.length} unsafe pattern(s) detected.\n`);
  process.exit(1);
}
