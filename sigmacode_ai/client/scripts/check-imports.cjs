#!/usr/bin/env node
/*
  Guards against importing from the Sections barrel in PitchDeck components.
  Fails if it finds any of the following patterns:
   - from '@/components/pitchdeck/Sections/index'
   - from "@/components/pitchdeck/Sections/index"
   - from '@/components/pitchdeck/Sections' (bare directory import)
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

/** @type {RegExp[]} */
const PATTERNS = [
  /from\s+['"]@\/components\/pitchdeck\/Sections\/index['"]/g,
  /from\s+['"]@\/components\/pitchdeck\/Sections['"]/g,
];

/** @param {string} p */
function isCodeFile(p) {
  return /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(p);
}

/** @param {string} dir */
function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // skip build output dirs just in case
      if (e.name === 'dist' || e.name === 'node_modules') continue;
      yield* walk(full);
    } else if (e.isFile() && isCodeFile(full)) {
      yield full;
    }
  }
}

let violations = [];
for (const file of walk(SRC)) {
  const content = fs.readFileSync(file, 'utf8');
  for (const rx of PATTERNS) {
    rx.lastIndex = 0;
    if (rx.test(content)) {
      violations.push(file);
      break;
    }
  }
}

if (violations.length > 0) {
  console.error('\nForbidden barrel imports detected in the following files:\n');
  for (const v of violations) {
    console.error(' - ' + path.relative(ROOT, v));
  }
  console.error('\nPlease import explicit files with extension, e.g.');
  console.error("  import Roadmap from '@/components/pitchdeck/Sections/Roadmap.tsx';\n");
  process.exit(1);
} else {
  console.log('No forbidden barrel imports found.');
}
