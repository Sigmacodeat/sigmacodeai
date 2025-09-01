#!/usr/bin/env node
/*
  Duplicate key checker for JSON i18n files.
  - No external deps
  - Parses objects to detect duplicate keys per object scope
  - Reports JSON path to offending duplicates
*/
import fs from 'node:fs';
import path from 'node:path';

function readFilesRec(dir, pattern = /translation\.json$/i, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) readFilesRec(full, pattern, acc);
    else if (pattern.test(entry.name)) acc.push(full);
  }
  return acc;
}

function findDuplicateKeys(jsonText) {
  const results = [];
  const stack = [];
  let i = 0;
  let inStr = false;
  let esc = false;
  let keyBuffer = null; // holds last key when waiting for colon
  const pathStack = [];

  function pushObj() {
    stack.push({ keys: new Map() });
    pathStack.push('');
  }
  function popObj() {
    stack.pop();
    pathStack.pop();
  }

  // Basic string reader to capture object keys
  while (i < jsonText.length) {
    const ch = jsonText[i];
    if (inStr) {
      if (esc) { esc = false; i++; continue; }
      if (ch === '\\') { esc = true; i++; continue; }
      if (ch === '"') { inStr = false; i++; continue; }
      i++;
      continue;
    }
    if (ch === '"') {
      // Capture string token; could be a key if next non-space non-quote tokens match : and we're inside an object
      let j = i + 1, s = '', e = false;
      while (j < jsonText.length) {
        const cj = jsonText[j];
        if (e) { s += cj; e = false; j++; continue; }
        if (cj === '\\') { e = true; j++; continue; }
        if (cj === '"') break;
        s += cj; j++;
      }
      const end = j;
      const after = jsonText.slice(end + 1).match(/^\s*:/);
      if (after && stack.length) {
        keyBuffer = s;
        // store temporarily; actual dup decision when ':' consumed
      }
      i = end + 1;
      continue;
    }
    if (ch === '{') { pushObj(); i++; continue; }
    if (ch === '}') { popObj(); i++; continue; }
    if (ch === ':') {
      if (keyBuffer !== null && stack.length) {
        const top = stack[stack.length - 1];
        const count = top.keys.get(keyBuffer) || 0;
        if (count >= 1) {
          results.push({ path: [...buildPath(pathStack, keyBuffer)], key: keyBuffer });
        }
        top.keys.set(keyBuffer, count + 1);
        // update last segment in path stack
        pathStack[pathStack.length - 1] = keyBuffer;
      }
      keyBuffer = null;
      i++;
      continue;
    }
    if (ch === ',') { keyBuffer = null; i++; continue; }
    i++;
  }
  return results;
}

function buildPath(stack, key) {
  const arr = stack.filter(Boolean);
  arr.push(key);
  return arr;
}

function main() {
  const root = process.argv[2] || path.join(process.cwd(), 'LibreChat_fresh/client/src/locales');
  const files = readFilesRec(root);
  let hadDupes = false;
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    const dupes = findDuplicateKeys(text);
    if (dupes.length) {
      hadDupes = true;
      console.error(`Duplicate keys in ${f}:`);
      for (const d of dupes) console.error(' -', d.path.join('.'));
    }
  }
  if (hadDupes) {
    process.exitCode = 2;
  } else {
    console.log('No duplicate keys found.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
