/* ============================================================================
   FAVOUR GATE (8/16/26, FACTIONS lane) — THE LADDER FINALLY POINTS AT SOMETHING.

   Law:  laws/BOHEMIA_ADDENDUM_WHAT_YOU_CAN_ASK_OF_THEM_8_16_26.md
   Tool: tools/bohemia_favour.py  (engine/bohemia_favour.js is GENERATED)

   WHAT THIS EXISTS BECAUSE OF. An outfit could COUNT you and start leaning on
   you (bohemia_claim) and could never GIVE YOU ANYTHING. His `pays` lines —
   sixteen real economies thumbed 8/2 — were card text and nothing else.

   THE THINGS A NAME-GREP CANNOT DO:
     1. THE THREE ECONOMIES ARE HIS, read off firstMove, and they must actually
        DIFFER — a they-give-first outfit and a you-give-first outfit answering
        the same way would mean the axis is decorative.
     2. WHAT THEY GIVE IS HIS LINE VERBATIM. Compared byte for byte against the
        dossier, so nothing here can quietly invent a resource.
     3. THE DEBT IS NOT COLLECTED HERE. bohemia_claim owns asking; a second
        opener is how two systems start disagreeing.

   node gates/favour_gate.js
   ============================================================================ */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const GEN = path.join(ROOT, 'engine/bohemia_favour.js');

const F = require(path.join(ROOT, 'engine/bohemia_favour.js'));
const B = require(path.join(ROOT, 'engine/bohemia_belonging.js'));

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim + (detail ? '\n       ' + detail : '')); }
}
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
const sv = () => ({ meta: {} });
const COUNTED = B.RUNGS.findIndex(r => r.word === 'COUNTED');
const AT_COUNTED = B.RUNGS[COUNTED].at;

/* --------------------------------------- A. THE THREE ECONOMIES ARE HIS */
function partA() {
  console.log('A. THREE ECONOMIES, READ OFF HIS OWN firstMove AXIS');

  const byMove = {};
  B.keys().forEach(k => { (byMove[B.RULES[k].firstMove] ||= []).push(k); });
  ok('A1 his canon really does sort the outfits three ways',
    Object.keys(byMove).length === 3 &&
    byMove['they-give-first'] && byMove['you-give-first'] && byMove['never'],
    JSON.stringify(Object.keys(byMove)));

  /* THE AXIS MUST BITE. If both sides answered alike, firstMove would be
     decorative and this whole module would be one economy wearing three hats. */
  const they = B.ruleOf(byMove['they-give-first'][0]);
  const you = B.ruleOf(byMove['you-give-first'][0]);
  const tA = F.askFor(they, 0, sv()), yA = F.askFor(you, 0, sv());
  ok('A2 a they-give-first outfit gives from the VERY FIRST meeting',
    tA.can === true, JSON.stringify({ outfit: they.key, why: tA.why }));
  ok('A3 a you-give-first outfit gives a stranger NOTHING',
    yA.can === false && !!yA.why, JSON.stringify({ outfit: you.key, why: yA.why }));
  ok('A4 …and still nothing at USEFUL, one rung below COUNTED',
    F.askFor(you, B.RUNGS[COUNTED - 1].at, sv()).can === false);
  ok('A5 …then yes once they COUNT you',
    F.askFor(you, AT_COUNTED, sv()).can === true);
  ok('A6 the never outfit refuses at MAXIMUM depth, and says it is not about depth',
    (() => { const n = B.ruleOf(byMove['never'][0]);
      const a = F.askFor(n, 999, sv());
      return a.can === false && /NOT A DEPTH PROBLEM/.test(a.why); })(),
    byMove['never'][0]);
  ok('A7 the threshold is DERIVED from the shipped ladder, not typed',
    F.GIVES['you-give-first'].fromRungIndex === COUNTED,
    F.GIVES['you-give-first'].fromRungIndex + ' vs ' + COUNTED);
}

/* ------------------------------------- B. WHAT THEY GIVE IS HIS, VERBATIM */
function partB() {
  console.log('B. WHAT THEY GIVE IS HIS LINE, BYTE FOR BYTE');

  let checked = 0, wrong = [];
  B.keys().forEach(k => {
    const rule = B.RULES[k];
    if (rule.firstMove === 'never' || !rule.pays) return;
    const a = F.askFor(rule, 999, sv());
    checked++;
    if (a.what !== rule.pays) wrong.push(k);
  });
  ok('B1 every outfit hands over EXACTLY its own dossier line (' + checked + ' checked)',
    checked >= 10 && wrong.length === 0, 'mismatched: ' + wrong.join(','));
  ok('B2 the module names no outfit in its CODE — which ones exist is his',
    (() => {
      const codeOnly = fs.readFileSync(GEN, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
      return !['CHURCH', 'CARTEL', 'MOB', 'REMNANTS', 'TRADES', 'REDS', 'BLUES', 'AMALGAMATION']
        .some(f => new RegExp('\\b' + f + '\\b', 'i').test(codeOnly));
    })());
  ok('B3 an outfit with nothing to give says so rather than inventing something',
    F.askFor({ key: 'X', faction: 'X', firstMove: 'you-give-first', wants: 'presence', pays: null },
      999, sv()).can === false);
}

/* ------------------------------------------------ C. THE RUNNING ACCOUNT */
function partC() {
  console.log('C. LONG-RANGE CREDIT: A FAVOUR IS CARRIED, NOT PAID FOR');

  const byMove = {};
  B.keys().forEach(k => { (byMove[B.RULES[k].firstMove] ||= []).push(k); });
  const they = B.ruleOf(byMove['they-give-first'][0]);
  const you = B.ruleOf(byMove['you-give-first'][0]);

  const s1 = sv();
  const t = F.take(they, 0, s1);
  ok('C1 a free favour costs NO standing…', t.took === true && t.delta === 0);
  ok('C2 …and puts you in DEBT instead, which is the whole trap',
    t.owes === true && F.owedOf(s1, they.key) === 1);
  F.take(they, 0, s1); F.take(they, 0, s1);
  ok('C3 the account RUNS — it accumulates rather than settling',
    F.owedOf(s1, they.key) === 3 && /3 times/.test(F.owedRow(s1, they.key).note));
  ok('C4 the spelling of the outfit never forks the account',
    F.owedOf(s1, they.key.toLowerCase()) === 3 &&
    Object.keys(s1.meta.owed).length === 1, JSON.stringify(s1.meta.owed));

  const s2 = sv();
  const e = F.take(you, AT_COUNTED, s2);
  ok('C5 an EARNED favour spends standing and owes nothing — the opposite trade',
    e.took === true && e.delta === -F.STANDING_COST && e.owes === false,
    JSON.stringify({ delta: e.delta, owes: e.owes }));
  ok('C6 …and it returns a DELTA rather than writing the count itself',
    !/meta\.gave/.test(fs.readFileSync(GEN, 'utf8')),
    'the count has one writer and it is bohemia_belonging');
  ok('C7 you cannot take what was refused',
    F.take(you, 0, sv()).took === false);
  ok('C8 no debt exists before you take anything',
    F.owedRow(sv(), you.key) === null);

  /* THE BOUNDARY WITH THE CLAIM, asserted rather than trusted. */
  ok('C9 this file never opens a claim — bohemia_claim owns asking, and a second '
    + 'opener is how two systems start disagreeing',
    !/BohemiaClaim|bohemia_claim/.test(fs.readFileSync(GEN, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')));
}

/* -------------------------------------------------- D. NUMBERS AND WORDS */
function partD() {
  console.log('D. NOTHING UNRULED SHIPS UNTAGGED');

  const ph = F.placeholders();
  ok('D1 every unruled number is tagged and enumerable (EVERYTHING COSTS ONE)',
    ph.length >= 2 && ph.every(p => p.placeholder === true && p.value === 1 &&
      /EVERYTHING COSTS ONE/.test(p.law)), JSON.stringify(ph.map(p => p.where)));
  const w = F.words();
  ok('D2 every player-facing string is a real attempt tagged draft',
    w.length >= 6 && w.every(x => x.draft === true && x.text && x.text.length > 1));
  ok('D3 none of it is a character speaking — mechanical narration only',
    w.every(x => x.speaker === null));
}

/* ------------------------------------------ E. ON THE WALKED SURFACE */
async function partE() {
  console.log('E. IT IS ON THE SURFACE HE WALKS, IN A REAL BROWSER');

  ok('E1 the organ is inlined with the ENGINE SYNC banner',
    fs.readFileSync(CITY, 'utf8').includes('==== engine/bohemia_favour.js ===='));

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 6000);
    const out = await page.evaluate(() => {
      /* NO STUB — a real affiliated person or nothing. */
      const bases = ctBases() || {};
      let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return { skip: 'nobody in the valley runs with anybody' };
      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
      const rule = BohemiaBelonging.ruleOf(fid);
      const r = { fid, firstMove: rule.firstMove, pays: rule.pays };
      ctSawCell(); ctOpen();
      r.card = document.getElementById('ctcard').innerText;
      r.buttons = [...document.querySelectorAll('#ctcard button')].map(x => x.textContent);
      const btn = document.getElementById('ctfavour');
      r.hasBtn = !!btn;
      if (btn) { btn.click(); ctClose(); ctOpen(); r.after = document.getElementById('ctcard').innerText; }
      r.owed = JSON.parse(JSON.stringify(((window.__CT_BELONG || {}).meta || {}).owed || {}));
      return r;
    });
    if (out.skip) { ok('E the walked surface has somebody who runs with somebody', false, out.skip); }
    else {
      ok('E2 the card says what this outfit actually holds for you',
        new RegExp(out.pays.slice(0, 18).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(out.card),
        JSON.stringify({ pays: out.pays, card: out.card.slice(-260) }));
      ok('E3 a they-give-first outfit offers a stranger something; a you-give-first one '
        + 'explains why not — the axis is visible on the card',
        out.firstMove === 'they-give-first' ? out.hasBtn === true
          : /NOT YET|NOTHING TO GIVE|NOT A DEPTH/.test(out.card),
        JSON.stringify({ firstMove: out.firstMove, hasBtn: out.hasBtn }));
      if (out.firstMove === 'they-give-first') {
        ok('E4 taking it puts a real debt on the real save',
          (Object.values(out.owed)[0] | 0) === 1, JSON.stringify(out.owed));
        ok('E5 and the card tells you that you owe them',
          /YOU OWE THEM/.test(out.after || ''), (out.after || '').slice(-200));
      } else {
        ok('E4 an unearned ask is refused on the card, not silently missing',
          !out.hasBtn && /NOT YET|NOT A DEPTH|NOTHING TO GIVE/.test(out.card));
        ok('E5 …and no debt is created by being refused',
          Object.keys(out.owed).length === 0, JSON.stringify(out.owed));
      }
    }
    ok('E6 the city threw no errors doing any of that', errors.length === 0,
      errors.slice(0, 3).join(' | '));
  } finally { await browser.close(); }
}

/* ------------------------------------------- F. GENERATED, ANCHORS HOLD */
function partF() {
  console.log('F. GENERATED, AND THE ANCHORS STILL REFUSE WHEN STALE');

  const before = fs.readFileSync(GEN, 'utf8');
  execFileSync('python3', ['tools/bohemia_favour.py'], { cwd: ROOT, stdio: 'pipe' });
  ok('F1 re-running the generator reproduces the shipped file byte for byte',
    fs.readFileSync(GEN, 'utf8') === before);

  const tool = path.join(ROOT, 'tools/bohemia_favour.py');
  const src = fs.readFileSync(tool, 'utf8');
  const broken = src.replace('\'"firstMove": "they-give-first"\'', '\'"firstMove": "NOT-A-REAL-VALUE"\'');
  ok('F2 the mutation actually changed the tool', broken !== src);
  const tmp = path.join(ROOT, 'tools/.favour_anchor_probe.py');
  let refused = false;
  try {
    fs.writeFileSync(tmp, broken);
    try { execFileSync('python3', [tmp], { cwd: ROOT, stdio: 'pipe' }); }
    catch (e) { refused = /REFUSING TO GENERATE|ANCHOR MOVED/.test(String(e.stderr || '')); }
  } finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
  ok('F3 a stale citation makes the generator REFUSE, not shrug', refused);
}

(async function main() {
  console.log('FAVOUR GATE — what you can ask of them\n');
  partA(); partB(); partC(); partD();
  await partE();
  partF();
  console.log('\nFAVOUR GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FAVOUR GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
