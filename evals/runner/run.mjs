#!/usr/bin/env node
/**
 * Swimlane C — deterministic eval gate (no API keys required).
 * Exit 1 if any case scores below evals/baseline.json.
 *
 * Optional LLM judge: EVALS_LLM_JUDGE=1 + OPENAI_API_KEY → runs judge-llm.mjs per case (future).
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

/** Score 0–100: best match of CV tokens to any job title+summary vs second job. */
function scoreMatchCvJobs(caseDir) {
  const cv = fs.readFileSync(path.join(caseDir, 'cv.txt'), 'utf8');
  const jobs = readJson(path.join(caseDir, 'jobs.json'));
  const cvTok = tokenize(cv);
  if (!Array.isArray(jobs) || jobs.length < 2) return 0;
  const jobTexts = jobs.map((j) =>
    tokenize(`${j.title || ''} ${j.company || ''} ${j.summary || ''}`),
  );
  const s0 = jaccard(cvTok, jobTexts[0]);
  const s1 = jaccard(cvTok, jobTexts[1]);
  const best = Math.max(s0, s1);
  const spread = Math.abs(s0 - s1);
  const raw = best * 70 + spread * 30;
  return Math.min(100, Math.round(raw * 100));
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
  const words = new Set([...tokenize(letter), ...tokenize(snippet), ...tokenize(cvRef)]);
  const forbidden = meta.forbiddenPhrases || [];
  let bad = 0;
  for (const phrase of forbidden) {
    if (letter.includes(phrase.toLowerCase())) bad++;
  }
  score -= bad * 30;
  if (letter.length < 80) score -= 20;
  if (letter.length > 4000) score -= 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function loadBaseline() {
  return readJson(BASELINE_PATH);
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
  return out;
}

function main() {
  const baseline = loadBaseline();
  const cases = discoverCases();
  if (cases.length === 0) {
    console.error('No cases with meta.json under evals/cases/');
    process.exit(1);
  }
  const report = [];
  let failed = false;
  for (const { dir, meta } of cases) {
    const key = meta.baselineKey;
    const thresh = baseline[key];
    if (!thresh) {
      console.error(`Unknown baselineKey ${key} for ${meta.id}`);
      process.exit(1);
    }
    let score = 0;
    if (meta.type === 'match_cv_jobs') score = scoreMatchCvJobs(dir);
    else if (meta.type === 'cover_letter') score = scoreCoverLetter(dir, meta);
    else {
      console.error(`Unknown case type ${meta.type} (${meta.id})`);
      process.exit(1);
    }
    let pass = true;
    if (meta.type === 'cover_letter') {
      const letter = fs.readFileSync(path.join(dir, 'letter.txt'), 'utf8').toLowerCase();
      const bad = (meta.forbiddenPhrases || []).filter((p) => letter.includes(p.toLowerCase())).length;
      pass = bad <= (thresh.maxForbiddenPhrases ?? 0) && score >= thresh.minScore;
      report.push({ id: meta.id, type: meta.type, score, minScore: thresh.minScore, forbiddenHits: bad, pass });
      if (!pass) failed = true;
      continue;
    }
    pass = score >= thresh.minScore;
    report.push({ id: meta.id, type: meta.type, score, minScore: thresh.minScore, pass });
    if (!pass) failed = true;
  }
  console.log(JSON.stringify({ swimlane: 'C', cases: report }, null, 2));
  if (failed) {
    console.error('EVAL FAILED: one or more cases below baseline');
    process.exit(1);
  }
}

main();
