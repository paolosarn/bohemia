/* ============================================================================
   CLAIM GATE (8/16/26, FACTIONS lane) — BEING INSIDE COSTS SOMETHING.

   Law:  laws/BOHEMIA_ADDENDUM_WHAT_BEING_INSIDE_COSTS_8_16_26.md
   Tool: tools/bohemia_claim.py  (engine/bohemia_claim.js is GENERATED)

   WHAT THIS EXISTS BECAUSE OF. The ladder (8/12) and the wall (8/15) both model
   what YOU do to THEM. Nothing came back: you could be COUNTED by the Church and
   they would never once ask you for anything. Portes 1998's second dark side of
   social capital — EXCESS CLAIMS ON GROUP MEMBERS — is the half no faction system
   builds, and it is the half that makes membership a decision instead of a wallet.

   THE THINGS A NAME-GREP CANNOT DO, which is the whole reason this file exists:
     1. THE RATION IS THE APPROVED ONE. Proven by deleting the dependency in a
        child process and demanding a refusal — every other claim here would still
        pass if the module carried a private limiter.
     2. THE TRIGGER IS DERIVED FROM THE SHIPPED LADDER, not typed. Re-derived here
        and compared, so retuning RUNGS moves both or goes red.
     3. SAYING YES BUYS NOTHING. That asymmetry is Portes' entire point and it is
        the first thing a well-meaning edit would "fix".

   node gates/claim_gate.js
   ============================================================================ */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const GEN = path.join(ROOT, 'engine/bohemia_claim.js');

const C = require(path.join(ROOT, 'engine/bohemia_claim.js'));
const B = require(path.join(ROOT, 'engine/bohemia_belonging.js'));
const R = require(path.join(ROOT, 'engine/bohemia_resolve.js'));

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
const W = { day: 1, week: 1 };
function fresh() { return { meta: {} }; }

/* ------------------------------------------- A. THE RATION IS THE APPROVED ONE */
function partA() {
  console.log('A. ADOPTED, NOT REBUILT');

  let refused = '';
  try {
    execFileSync('node', ['-e',
      "const p=require.resolve('./engine/bohemia_resolve.js');" +
      "require.cache[p]={id:p,filename:p,loaded:true,exports:{}};" +
      "const C=require('./engine/bohemia_claim.js');" +
      "C.open({meta:{}},'CHURCH',1,{day:1,week:1},{perWeek:1});"],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) { refused = String((e.stderr || '') + (e.stdout || '')); }
  ok('A1 with the approved ration absent the module REFUSES rather than limiting itself',
    /makeRation is required and absent|ADOPTS the approved ration/.test(refused),
    'a private second limiter is how two systems start disagreeing; got: ' + refused.slice(0, 140));
  ok('A2 the mechanism it adopts is the one Paolo signed off 7/26',
    typeof R.makeRation === 'function' && /gifts limited by count/i.test(R.LEARNED_FROM.ration));
  ok('A3 it is a COUNT per window, never a price — the whole finding of that verdict',
    R.makeRation({ perWeek: 1 }).limits.perWeek === 1);
}

/* ------------------------------------------------------ B. WHEN THEY ASK */
function partB() {
  console.log('B. THEY ASK THE COUNTED, AND ONLY THE COUNTED');

  const rule = B.ruleOf('CHURCH');
  const idx = B.RUNGS.findIndex(r => r.word === 'COUNTED');
  ok('B1 the trigger is DERIVED from the shipped ladder, not typed',
    C.TRIGGER_RUNG === idx && C.TRIGGER_WORD === B.RUNGS[idx].word,
    'trigger ' + C.TRIGGER_RUNG + ' vs ladder index ' + idx);

  const sv = fresh();
  C.open(sv, 'CHURCH', 5, W, { perWeek: 1 });
  ok('B2 nobody asks a stranger', C.claimFor(rule, 0, 5, sv) === null);
  ok('B3 nobody asks somebody merely USEFUL',
    C.claimFor(rule, 3, 5, sv) === null,
    'the rung below the trigger must stay silent or the wall means nothing');
  const c = C.claimFor(rule, 6, 5, sv);
  ok('B4 once you are COUNTED they ask', !!c && !!c.ask);
  ok('B5 what they ask for is HIS canon, not invented here',
    c.what === B.bargain(rule, 6).wantWord && c.wantKey === rule.wants,
    JSON.stringify({ asked: c.what, canon: B.bargain(rule, 6).wantWord }));
  ok('B6 the save is keyed by the id, never the display label',
    c.key === rule.key && rule.key !== rule.faction,
    JSON.stringify({ key: rule.key, label: rule.faction }));

  /* GOULDNER: the debt AGES. */
  ok('B7 an unanswered claim ages, and says how long',
    C.claimFor(rule, 6, 5, sv).days === 0 &&
    C.claimFor(rule, 6, 12, sv).days === 7 &&
    /7 days/.test(C.claimFor(rule, 6, 12, sv).dueNote || ''),
    'an obligation that does not age is not an obligation');
  ok('B8 nothing is asked until a claim is actually opened',
    C.claimFor(rule, 6, 5, fresh()) === null);
}

/* ----------------------------------------------------- C. WHAT IT COSTS */
function partC() {
  console.log('C. SAYING YES BUYS NOTHING, SAYING NO COSTS THE RUNG');

  const rule = B.ruleOf('CHURCH');
  let sv = fresh(); C.open(sv, 'CHURCH', 1, W, { perWeek: 1 });
  const yes = C.answer(sv, 'CHURCH', 'yes', 6);
  ok('C1 YES holds everything — meeting an obligation is the RENT, not a way to climb',
    yes.answered === true && yes.delta === 0,
    'this asymmetry is Portes\' whole point and it is the first thing a kind edit would break');
  ok('C2 answering clears it, so they are not still asking tomorrow',
    C.claimFor(rule, 6, 9, sv) === null);

  sv = fresh(); C.open(sv, 'CHURCH', 1, W, { perWeek: 1 });
  const no = C.answer(sv, 'CHURCH', 'no', 6);
  const floor = B.RUNGS[C.TRIGGER_RUNG].at;
  ok('C3 NO costs exactly the rung that made you worth asking, DERIVED from the ladder',
    no.delta === -(6 - (floor - 1)) && 6 + no.delta === floor - 1,
    JSON.stringify({ delta: no.delta, lands: 6 + no.delta, below: floor }));
  ok('C4 refusing from deeper in costs more, because you fall to the same floor',
    Math.abs(C.answer(openOne(), 'CHURCH', 'no', 9).delta) >
    Math.abs(C.answer(openOne(), 'CHURCH', 'no', 6).delta),
    'the deeper you are the more a refusal takes — Portes: the claims scale with the standing');
  ok('C5 you cannot answer a question nobody asked',
    C.answer(fresh(), 'CHURCH', 'yes', 6).answered === false);
  ok('C6 the spelling of the outfit never decides whether it heard you',
    (() => { const s = fresh(); C.open(s, 'CHURCH', 1, W, { perWeek: 1 });
      return C.answer(s, 'Church', 'yes', 6).answered === true; })());

  function openOne() { const s = fresh(); C.open(s, 'CHURCH', 1, W, { perWeek: 1 }); return s; }
}

/* ------------------------------------------------------- D. THE RATION BITES */
function partD() {
  console.log('D. AN OUTFIT THAT OWNS YOU STILL DOES NOT ASK EVERY DAY');

  const sv = fresh();
  ok('D1 the first ask of the window lands',
    C.open(sv, 'CHURCH', 1, { day: 1, week: 1 }, { perWeek: 1 }).opened === true);
  C.answer(sv, 'CHURCH', 'yes', 6);
  const second = C.open(sv, 'CHURCH', 2, { day: 2, week: 1 }, { perWeek: 1 });
  ok('D2 a second ask in the same window is refused by the ration',
    second.opened === false && second.reason === 'WEEK_SPENT', JSON.stringify(second));
  ok('D3 a new window opens it again',
    C.open(sv, 'CHURCH', 8, { day: 8, week: 2 }, { perWeek: 1 }).opened === true);
  ok('D4 THE LIMITS ARE THE CALLER\'S — this file does not decide how often, because '
    + 'RATION LIMITS is the [PENDING Paolo] the 7/26 verdict reserved (item c)',
    !/perWeek\s*:\s*[0-9]/.test(fs.readFileSync(GEN, 'utf8')),
    'a default here would be a ruling, not a line of code');
  ok('D5 two claims are never open at once for one outfit',
    (() => { const s = fresh();
      C.open(s, 'CHURCH', 1, { day: 1, week: 1 }, {});
      return C.open(s, 'CHURCH', 1, { day: 1, week: 1 }, {}).reason === 'ALREADY_OPEN'; })());
}

/* ------------------------------------------------- D2. THE DEBT GETS CALLED IN */
function partD2() {
  console.log('D2. AN OUTFIT YOU OWE DOES NOT WAIT ITS TURN');

  const W1 = { day: 1, week: 1 }, W2 = { day: 2, week: 1 };

  /* THE APPROVED BYPASS FINALLY HAS A CALLER. makeRation has carried a bypass
     slot since Paolo approved it 7/26 ("the birthday shape: an occasion that
     ignores both windows") and nothing had ever used it. */
  const clean = fresh();
  C.open(clean, 'CHURCH', 1, W1, { perWeek: 1 }, 0);
  C.answer(clean, 'CHURCH', 'yes', 6, 0);
  ok('D2a with no debt the weekly limit still protects you',
    C.open(clean, 'CHURCH', 2, W2, { perWeek: 1 }, 0).reason === 'WEEK_SPENT');

  const owing = fresh();
  C.open(owing, 'CHURCH', 1, W1, { perWeek: 1 }, 2);
  C.answer(owing, 'CHURCH', 'yes', 6, 2);
  ok('D2b owing it, they ask again inside the same spent window — the ration '
    + 'BYPASS approved 7/26 and never called until now',
    C.open(owing, 'CHURCH', 2, W2, { perWeek: 1 }, 2).opened === true,
    'the limit models restraint, and a creditor has none');

  /* REFUSING A CREDITOR COSTS MORE THAN REFUSING A FRIEND. */
  const a = fresh(); C.open(a, 'CHURCH', 1, W1, {}, 0);
  const b = fresh(); C.open(b, 'CHURCH', 1, W1, {}, 3);
  const n0 = C.answer(a, 'CHURCH', 'no', 6, 0);
  const n3 = C.answer(b, 'CHURCH', 'no', 6, 3);
  ok('D2c refusing while you owe costs MORE, one rung per unpaid favour — which '
    + 'is the whole reason the free thing was free',
    n3.delta === n0.delta - 3, JSON.stringify({ clear: n0.delta, owing3: n3.delta }));
  ok('D2d …and the card is told WHY, not just handed a bigger number',
    /gave you things 3 times/.test(n3.note || ''), n3.note);

  /* AND THE ACCOUNT CAN BE CLOSED. */
  const c = fresh(); C.open(c, 'CHURCH', 1, W1, {}, 2);
  const y = C.answer(c, 'CHURCH', 'yes', 6, 2);
  ok('D2e meeting a claim WORKS THE DEBT OFF — a debt you can never clear is a '
    + 'sentence, not a relationship (Gouldner: the interval has to be able to close)',
    y.settle === 1, JSON.stringify({ settle: y.settle }));
  ok('D2f …and it says so rather than reusing the no-debt line',
    /came off what you owed/.test(y.note || ''), y.note);
  ok('D2g meeting a claim you owe nothing on settles nothing',
    C.answer((() => { const s = fresh(); C.open(s, 'CHURCH', 1, W1, {}); return s; })(),
      'CHURCH', 'yes', 6, 0).settle === 0);

  /* THE BOUNDARY: claim never writes the debt ledger. */
  ok('D2h this module never touches the debt store — it takes a NUMBER and '
    + 'returns a NUMBER, so neither organ reaches into the other\'s save',
    !/meta\.owed|owedMap|BohemiaFavour/.test(
      fs.readFileSync(GEN, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/^\s*\/\/.*$/gm, ' ')));
  const ph = C.placeholders();
  ok('D2i both new numbers are tagged placeholders',
    ph.length >= 2 && ph.every(p => p.placeholder === true && p.value === 1),
    JSON.stringify(ph.map(p => p.where)));
}

/* ------------------------------------------------------------- E. THE WORDS */
function partE() {
  console.log('E. EVERY WORD IS A REAL ATTEMPT HE CAN EDIT');

  const w = C.words();
  ok('E1 every player-facing string is tagged draft (ALWAYS MAKE AN ATTEMPT, 8/11)',
    w.length >= 10 && w.every(x => x.draft === true && x.text && x.text.length > 1),
    w.length + ' strings');
  ok('E2 none of it is a character speaking — this lane carries mechanical narration only',
    w.every(x => x.speaker === null));
  ok('E3 nothing ships empty, so he edits rather than writes from nothing',
    w.every(x => !/^TODO|^TBD|^\s*$/.test(x.text)));
  /* THE FIRST VERSION OF THIS CHECK WAS THE BROKEN ONE (8/1: a checker that
     cannot tell a mention from a use is the broken one). It grepped the whole
     file and hit the word "Church" inside the header comment explaining what the
     hole was. Comments are prose ABOUT the module; only CODE can name canon. */
  const codeOnly = fs.readFileSync(GEN, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
  const named = ['CHURCH', 'CARTEL', 'MOB', 'REMNANTS', 'TRADES', 'REDS', 'BLUES']
    .filter(f => new RegExp('\\b' + f + '\\b', 'i').test(codeOnly));
  ok('E4 no outfit is named in the CODE — which ones exist is his, read from the dossiers',
    named.length === 0, 'named: ' + named.join(','));
}

/* -------------------------------------------- F. IT IS ON THE WALKED SURFACE */
async function partF() {
  console.log('F. IT IS ON THE SURFACE HE WALKS, IN A REAL BROWSER');

  const city = fs.readFileSync(CITY, 'utf8');
  ok('F1 the organ is inlined with the ENGINE SYNC banner',
    city.includes('==== engine/bohemia_claim.js ===='));

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 6000);
    const out = await page.evaluate(() => {
      /* NO STUB — a real affiliated person or nothing. Last turn's lesson. */
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
      sv.meta.gave = {}; sv.meta.gave[fid] = 6;      // COUNTED
      sv.meta.commit = {}; sv.meta.commit[fid] = 'sided';
      sv.meta.claims = {};
      const r = { fid };
      /* the uncounted case first, on the same real person */
      sv.meta.gave[fid] = 3;                          // USEFUL, below the trigger
      ctSawCell(); ctOpen();
      r.uncounted = document.getElementById('ctcard').innerText;
      ctClose();
      sv.meta.gave[fid] = 6;                          // COUNTED
      ctOpen();
      r.opened = ctOpenClaim(fid);
      ctClose(); ctOpen();
      r.asked = document.getElementById('ctcard').innerText;
      r.buttons = [...document.querySelectorAll('#ctcard button')].map(x => x.textContent);
      const no = document.getElementById('ctclaimno');
      if (no) no.click();
      r.gaveAfter = JSON.parse(JSON.stringify((((window.__CT_BELONG || {}).meta) || {}).gave || {}));
      ctClose(); ctOpen();
      r.after = document.getElementById('ctcard').innerText;
      return r;
    });
    if (out.skip) { ok('F the walked surface has somebody who runs with somebody', false, out.skip); }
    else {
      /* THE CLAIM I FIRST WROTE HERE WAS WRONG, NOT THE CODE. It asserted the
         card shows no demand until something opens one -- but the design is that
         they ask WHEN YOU WALK INTO THEM, so drawing the card of somebody who
         counts you IS the trigger. The real guarantee worth locking is the one
         the wall depends on: the uncounted are never asked. */
      ok('F2 somebody who has not counted you never asks you for anything',
        out.uncounted && !/THEY ARE ASKING YOU/.test(out.uncounted),
        JSON.stringify((out.uncounted || '').slice(0, 120)));
      ok('F3 once they ask, the card leads with it',
        /THEY ARE ASKING YOU/.test(out.asked), JSON.stringify(out.asked.slice(0, 160)));
      ok('F4 both answers are on the card, so refusing is a real option',
        out.buttons.some(b => /Do it/.test(b)) && out.buttons.some(b => /Tell them no/.test(b)),
        JSON.stringify(out.buttons));
      ok('F5 saying no actually costs the rung on the real save',
        (Object.values(out.gaveAfter)[0] | 0) < 6,
        JSON.stringify(out.gaveAfter));
      ok('F6 and the card says so afterwards',
        /YOU TOLD THEM NO|USEFUL/.test(out.after), out.after.split('\n').slice(-6).join(' / '));
    }
    ok('F7 the city threw no errors doing any of that', errors.length === 0,
      errors.slice(0, 3).join(' | '));
  } finally { await browser.close(); }
}

/* --------------------------------------- G. THE GENERATOR IS THE TRUTH */
function partG() {
  console.log('G. GENERATED, AND THE ANCHORS STILL HOLD');

  const before = fs.readFileSync(GEN, 'utf8');
  execFileSync('python3', ['tools/bohemia_claim.py'], { cwd: ROOT, stdio: 'pipe' });
  ok('G1 re-running the generator reproduces the shipped file byte for byte',
    fs.readFileSync(GEN, 'utf8') === before);

  const tool = path.join(ROOT, 'tools/bohemia_claim.py');
  const src = fs.readFileSync(tool, 'utf8');
  const broken = src.replace("(BELONGING, 'var RUNGS=['", "(BELONGING, 'var NOT_THE_LADDER=['");
  ok('G2 the mutation actually changed the tool', broken !== src);
  const tmp = path.join(ROOT, 'tools/.claim_anchor_probe.py');
  let refused = false;
  try {
    fs.writeFileSync(tmp, broken);
    try { execFileSync('python3', [tmp], { cwd: ROOT, stdio: 'pipe' }); }
    catch (e) { refused = /REFUSING TO GENERATE|ANCHOR MOVED/.test(String(e.stderr || '')); }
  } finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
  ok('G3 a stale citation makes the generator REFUSE, not shrug', refused);
}

(async function main() {
  console.log('CLAIM GATE — what being inside costs you\n');
  partA(); partB(); partC(); partD(); partD2(); partE();
  await partF();
  partG();
  console.log('\nCLAIM GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('CLAIM GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
