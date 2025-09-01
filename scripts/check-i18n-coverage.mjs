#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const dePath = path.join(root, 'LibreChat_fresh', 'client', 'src', 'locales', 'de', 'translation.json');
const enPath = path.join(root, 'LibreChat_fresh', 'client', 'src', 'locales', 'en', 'translation.json');

function readJson(p) {
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

function flatten(obj, prefix = '') {
  const out = {};
  for (const [key, val] of Object.entries(obj)) {
    const k = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(out, flatten(val, k));
    } else {
      out[k] = val;
    }
  }
  return out;
}

function filterLandingKeys(map) {
  return Object.keys(map).filter((k) => k.startsWith('marketing.landing.'));
}

try {
  const de = readJson(dePath);
  const en = readJson(enPath);
  const deFlat = flatten(de);
  const enFlat = flatten(en);
  const deKeys = new Set(filterLandingKeys(deFlat));
  const enKeys = new Set(filterLandingKeys(enFlat));

  const missingInEn = [...deKeys].filter((k) => !enKeys.has(k)).sort();
  const missingInDe = [...enKeys].filter((k) => !deKeys.has(k)).sort();

  const summary = {
    checked: {
      de: dePath,
      en: enPath,
    },
    total: {
      de: deKeys.size,
      en: enKeys.size,
    },
    missingInEn,
    missingInDe,
  };

  const hasIssues = missingInEn.length || missingInDe.length;
  if (hasIssues) {
    console.log('[i18n-coverage] Differences found for marketing.landing.*');
    console.log(JSON.stringify(summary, null, 2));
    process.exitCode = 1;
  } else {
    console.log('[i18n-coverage] OK: de/en marketing.landing.* are aligned');
  }
} catch (err) {
  console.error('[i18n-coverage] Error:', err.message);
  process.exitCode = 2;
}
