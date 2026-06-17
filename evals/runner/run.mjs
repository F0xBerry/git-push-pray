#!/usr/bin/env node
/**
 * Swimlane C — deterministic eval gate (no API keys required).
 * Exit 1 if any case scores below evals/baseline.json or structural checks fail.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const EVALS = path.join(ROOT, 'evals');
const CASES = path.join(EVALS, 'cases');
const BASELINE_PATH = path.join(EVALS, 'baseline.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** @returns {{ score: number, j0: number, j1: number }} */
function scoreMatchCvJobs(caseDir) {
  const cv = fs.readFileSync(path.join(caseDir, 'cv.txt'), 'utf8');
  const jobs = readJson(path.join(caseDir, 'jobs.json'));
  const cvTok = tokenize(cv);
  if (!Array.isArray(jobs) || jobs.length < 2) {
    return { score: 0, j0: 0, j1: 0 };
  }
  const jobTexts = jobs.map((j) =>
    tokenize(`${j.title || ''} ${j.company || ''} ${j.summary || ''}`),
  );
  const s0 = jaccard(cvTok, jobTexts[0]);
  const s1 = jaccard(cvTok, jobTexts[1]);
  const ordering = Math.max(0, s0 - s1);
  /** Emphasize absolute fit to best job + spread when first job should win (typical fixture). */
  const raw = 0.18 + 2.15 * s0 + 1.75 * ordering;
  const score = Math.min(100, Math.round(raw * 100));
  return { score, j0: s0, j1: s1 };
}

function scoreCoverLetter(caseDir, meta) {
  const letter = fs.readFileSync(path.join(caseDir, 'letter.txt'), 'utf8').toLowerCase();
  const snippet = fs.readFileSync(path.join(caseDir, 'job_snippet.txt'), 'utf8').toLowerCase();
  const cvRef = fs.readFileSync(path.join(caseDir, 'cv_ref.txt'), 'utf8').toLowerCase();
  let score = 40;
  const company = (meta.requiredCompanyToken || '').toLowerCase();
  if (company && letter.includes(company)) score += 25;
  const topics = meta.requiredTopicTokens || [];
  let topicHits = 0;
  for (const t of topics) {
    if (letter.includes(String(t).toLowerCase())) topicHits++;
  }
  score += Math.min(25, topicHits * 12);
  const forbidden = meta.forbiddenPhrases || [];
  let bad = 0;
  for (const phrase of forbidden) {
    if (letter.includes(phrase.toLowerCase())) bad++;
  }
  score -= bad * 30;
  if (letter.length < 80) score -= 20;
  if (letter.length > 4000) score -= 10;
  void snippet;
  void cvRef;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function loadBaseline() {
  const raw = readJson(BASELINE_PATH);
  const baseline = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith('_')) continue;
    if (v && typeof v === 'object' && typeof v.minScore === 'number') {
      baseline[k] = v;
    } else {
      console.warn(`[evals] ignoring baseline key "${k}" (need { minScore: number, ... })`);
    }
  }
  return baseline;
}

function discoverCases() {
  const out = [];
  if (!fs.existsSync(CASES)) return out;
  for (const name of fs.readdirSync(CASES, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const metaPath = path.join(CASES, name.name, 'meta.json');
    if (fs.existsSync(metaPath)) {
      out.push({ dir: path.join(CASES, name.name), meta: readJson(metaPath) });
    }
  }
  out.sort((a, b) => String(a.meta.id).localeCompare(String(b.meta.id)));
  return out;
}

function validateMeta(meta, caseDir) {
  for (const key of ['id', 'type', 'baselineKey']) {
    if (!meta[key] || typeof meta[key] !== 'string') {
      throw new Error(`Invalid meta.json in ${caseDir}: missing string "${key}"`);
    }
  }
}

function main() {
  let baseline;
  try {
    baseline = loadBaseline();
  } catch (e) {
    console.error(`Failed to read ${BASELINE_PATH}:`, e);
    process.exit(1);
  }
  const cases = discoverCases();
  if (cases.length === 0) {
    console.error('No cases with meta.json under evals/cases/');
    process.exit(1);
  }
  const report = [];
  let failed = false;
  for (const { dir, meta } of cases) {
    try {
      validateMeta(meta, dir);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
    const key = meta.baselineKey;
    const thresh = baseline[key];
    if (!thresh) {
      console.error(`Unknown baselineKey "${key}" for ${meta.id} (define in baseline.json)`);
      process.exit(1);
    }
    let score = 0;
    let pass = true;
    let extra = {};

    if (meta.type === 'match_cv_jobs') {
      const { score: sc, j0, j1 } = scoreMatchCvJobs(dir);
      score = sc;
      extra = { jaccardJob0: Number(j0.toFixed(4)), jaccardJob1: Number(j1.toFixed(4)) };
      if (meta.expectFirstJobCloser !== false && j0 <= j1) {
        pass = false;
        extra.orderingFail = 'expected jaccard(job0) > jaccard(job1) for this fixture';
      }
      pass = pass && score >= thresh.minScore;
    } else if (meta.type === 'cover_letter') {
      score = scoreCoverLetter(dir, meta);
      const letter = fs.readFileSync(path.join(dir, 'letter.txt'), 'utf8').toLowerCase();
      const bad = (meta.forbiddenPhrases || []).filter((p) => letter.includes(p.toLowerCase())).length;
      extra = { forbiddenHits: bad };
      pass = bad <= (thresh.maxForbiddenPhrases ?? 0) && score >= thresh.minScore;
    } else {
      console.error(`Unknown case type "${meta.type}" (${meta.id})`);
      process.exit(1);
    }

    report.push({
      id: meta.id,
      type: meta.type,
      score,
      minScore: thresh.minScore,
      pass,
      ...extra,
    });
    if (!pass) failed = true;
  }
  console.log(JSON.stringify({ swimlane: 'C', cases: report }, null, 2));
  if (failed) {
    console.error('EVAL FAILED: ordering, baseline, or scores');
    process.exit(1);
  }
}

main();
