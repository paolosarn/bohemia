/* ============================================================================
   THE JOB PAYS GATE (9/6/26, QUESTS lane) -- VAMILY [jobs pay], BB-THE-JOB-PAYS.

   THE MEASUREMENT THE ROW WAS WRITTEN FROM: across every playable canon quest
   there were 786 @DO calls and @DO pay appeared ZERO TIMES. The verb has existed
   in the .bq language since 8/11, built on HIS OWN RULING ("whatever currency the
   quest decides to give"), and nobody had ever written one. The purse was built,
   the payday bridge was built, payForQuest is genuinely called on the walked
   surface with a live quest runtime -- and not one job in the valley paid a
   thing, because the last line was never typed.

   WHAT THIS GATE HOLDS:

   1. THE VERB IS ACTUALLY USED, and it reaches a real reward through the real
      runtime rather than sitting in a file. The explorer walks every reachable
      path of every quest, the same shape the canon gate uses, and reads what the
      runtime actually put in state.reward at each ending.

   2. *** ONE, AND ONLY ONE. *** EVERYTHING COSTS ONE until he tunes it, so every
      amount in every quest is exactly 1 and the gate fails on any other number.
      The amounts are his to change; this holds the placeholder honest so nobody
      quietly invents an economy.

   3. THE CURRENCY IS ONE OF HIS THREE. resources, electricity, clout, locked
      7/26. A fourth currency is a ruling, not a commit.

   4. *** A FAILED JOB PAYS NOTHING. *** The reward rides the COMPLETE endings
      only. This is the check that stops the reward becoming an attendance prize.

   5. *** AND EVERY QUEST EITHER PAYS OR SAYS WHY IT DOES NOT. *** This is the one
      that matters most. Twelve quests here pay nothing ON PURPOSE: nobody pays
      you for burying your sibling, the doctor's own words are "no charge, no
      interest, no paper", and the quest about forgiveness says cheap forgiveness
      is just a debt paid on time. A game where everything pays is a game where
      nothing means anything. So an unpaid quest must carry a written reason, and
      a quest that carries neither a payment nor a reason is an oversight, which
      is exactly what this row found in the first place.

   6. AND IT CREDITS A REAL PURSE, ON THE REAL SURFACE. The row's own ship test is
      "at least one canon quest credits the purse end to end on the walked
      surface", so the gate opens the game, walks a real quest to COMPLETE in the
      frame the player looks at, hands it to the real payday bridge, and reads
      the balance back.
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};

global.window = global;
const BQ   = require(path.join(ROOT, 'engine/bohemia_bq.js'));
const BQRT = require(path.join(ROOT, 'engine/bohemia_quest_runtime.js'));

const CURRENCIES = ['resources', 'electricity', 'clout'];
const DIR = path.join(ROOT, 'quests/bq');
const files = fs.readdirSync(DIR).filter(f => /\.bq$/.test(f)).sort();
ok('0a there are canon quests to pay for (' + files.length + ')', files.length > 10);

/* THE EXPLORER. Same shape as the canon quests gate's, because that one already
   owns the measurement of what is reachable and re-deriving it differently would
   give this repo two rulers for one thing. The only addition is that it reads
   state.reward at every ending. */
function endings(text) {
  const seen = {}, out = []; let steps = 0; const MAX = 200000;
  const snap = rt => JSON.stringify([rt.node ? rt.node.id : null, rt.state.stage,
    rt.state.flags, rt.state.knows, rt.state.has, rt.state.roles, rt.state.locked, rt.state.done]);
  const clone = rt => { const r = BQRT.Runtime.load(rt.Q, JSON.parse(rt.serialize()));
    r.node = rt.node ? r._talkById[rt.node.id] : null; return r; };
  const Q = BQ.parse(text);
  const stack = [new BQRT.Runtime(Q).start()];
  while (stack.length) {
    if (++steps > MAX) break;
    const rt = stack.pop(); const k = snap(rt); if (seen[k]) continue; seen[k] = true;
    try {
      if (rt.state.done) { out.push({ outcome: rt.state.outcome, stage: rt.state.stage,
                                      reward: rt.state.reward || null }); continue; }
      if (!rt.node) { const a = rt.available(); if (!a.length) continue;
                      a.forEach(id => { const c = clone(rt); c.begin(id); stack.push(c); }); continue; }
      const view = rt.view();
      if (!view.options.length) { const c0 = clone(rt); c0.node = null; stack.push(c0); continue; }
      view.options.forEach(o => { const c = clone(rt); c.choose(o.i); stack.push(c); });
    } catch (e) { /* the canon gate owns the "never throws" check */ }
  }
  return out;
}

let paidQuests = 0, unpaidQuests = 0, totalPayLines = 0;
const problems = [];

/* *** A GATE THAT READS A COMMENT AS CODE IS THE BROKEN ONE (9/11). ***
   This scanned the RAW file for /@DO pay .../, and a .bq header that EXPLAINS
   why it does not use the pay verb -- the sentence "not written with the @DO pay
   verb here" -- was read as a pay line paying the currency "verb" the amount
   "here,". Third time this lane has been bitten by prose-read-as-code (round 20's
   rollBoss sentence, round 24's quoted research figures), and the fix is the same
   one both times: strip the comments before you scan. A .bq comment is a whole
   line starting with # -- the language has no trailing comment -- so this is
   exact, not a guess. Self-tested at the bottom of this file both ways: a real
   pay line still counts, and a commented one never does. */
function codeOf(text) {
  return String(text).split('\n').filter(l => !/^\s*#/.test(l)).join('\n');
}

files.forEach(f => {
  const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
  const text = codeOf(raw);
  const tag = f.slice(0, 3);
  const payLines = (text.match(/@DO pay\s+\S+\s+\S+/g) || []);
  totalPayLines += payLines.length;

  /* ---- 2 and 3: one, and one of his three ------------------------------- */
  payLines.forEach(l => {
    const m = /@DO pay\s+(\S+)\s+(\S+)/.exec(l);
    if (!m) { problems.push(f + ': unparseable ' + l); return; }
    if (CURRENCIES.indexOf(m[1]) < 0) problems.push(f + ': currency ' + m[1] + ' is not one of his three');
    if (m[2] !== '1') problems.push(f + ': amount ' + m[2] + ' is not ONE');
  });

  /* ---- 4: a failed job pays nothing ------------------------------------ */
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/^@STAGE\s+\d+\s+FAIL\b/.test(lines[i])) continue;
    for (let j = i + 1; j < lines.length && !/^@STAGE|^@OBJ|^@TALK/.test(lines[j]); j++) {
      if (/@DO pay/.test(lines[j])) problems.push(f + ': a FAIL stage pays');
    }
  }

  /* ---- 1 and 5: it reaches the runtime, or it says why not -------------- */
  const ends = endings(text);
  const complete = ends.filter(e => e.outcome === 'COMPLETE');
  const failed   = ends.filter(e => e.outcome !== 'COMPLETE');
  const paidSets = [...new Set(complete.map(e => JSON.stringify(e.reward || {})))];

  if (payLines.length) {
    paidQuests++;
    ok(tag + ' pays through the real runtime on every COMPLETE ending ('
       + paidSets.join(' ') + ')',
       complete.length > 0 && complete.every(e => e.reward && Object.keys(e.reward).length === 1));
    ok(tag + ' and a failed ending carries no reward',
       failed.every(e => !e.reward || Object.keys(e.reward).length === 0));
  } else {
    unpaidQuests++;
    /* *** THE OVERSIGHT CHECK. An unpaid quest must say so in writing. *** */
    ok(tag + ' pays nothing and says why, in the file',
       /WHAT THIS JOB PAYS[^\n]*NOTHING, ON PURPOSE/.test(raw),
       'no written reason');
    ok(tag + ' and really pays nothing at runtime',
       complete.every(e => !e.reward || Object.keys(e.reward).length === 0));
  }
});

ok('2a every amount is ONE and every currency is one of his three ('
   + problems.length + ' problems)', problems.length === 0, problems.slice(0, 4).join(' | '));
ok('1a the verb is actually used now (' + totalPayLines + ' pay lines across '
   + paidQuests + ' quests)', totalPayLines > 0 && paidQuests > 0);
ok('5a and the ones that pay nothing are a deliberate list, not a gap ('
   + unpaidQuests + ' unpaid)', unpaidQuests > 0);
ok('5b every quest is accounted for (' + (paidQuests + unpaidQuests) + ' of '
   + files.length + ')', paidQuests + unpaidQuests === files.length);

console.log('  [the till] ' + paidQuests + ' quests pay, ' + unpaidQuests
  + ' pay nothing on purpose, ' + totalPayLines + ' pay lines, every amount 1');

/* ======================================================================== */
/*  6. THE REAL SURFACE: THE ROW'S OWN SHIP TEST                             */
/* ======================================================================== */
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    const tapped = await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (!t) return false; t.click(); return true;
    });
    ok('R1 the RUN tab exists and was tapped', tapped === true);
    await SETTLE(page, 16000);

    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof BohemiaPayday !== 'undefined'
                                     && typeof BohemiaPurse !== 'undefined')) { city = f; break; } }
      catch (_e) {}
    }
    ok('R2 the purse and the payday bridge are in the frame the player looks at', !!city);

    if (city) {
      /* Walk a REAL quest to COMPLETE in the browser, using the corpus the game
         carries, then hand it to the real bridge and read the balance back. */
      const run = await city.evaluate(() => {
        /* DEMO_BQ is the copy the city actually PLAYS. Deliberately not the
           alpha's BOHEMIA_QUESTS, which lives in a different frame and feeds the
           DIRECT tab: the point of this check is the quest a player finishes. */
        if (typeof DEMO_BQ !== 'object' || !DEMO_BQ) return { err: 'the city has no quest sources' };
        const key = Object.keys(DEMO_BQ).find(k => /METER_READER/.test(k));
        if (!key) return { err: 'the meter reader is not in the city copy' };
        const text = DEMO_BQ[key];
        const spec = { id: 'bq_meter_reader' };
        if (!/@DO pay/.test(text)) return { err: 'the city copy is STALE: no pay line in it' };
        const Q = BQ.parse(text);
        /* drive it the same way the gate does, first option each time */
        const seen = {}; let rt = new BQRuntime.Runtime(Q).start(), guard = 0, done = null;
        const stack = [rt];
        while (stack.length && guard++ < 20000) {
          const cur = stack.pop();
          const k = JSON.stringify([cur.node ? cur.node.id : null, cur.state.stage,
                                    cur.state.flags, cur.state.done]);
          if (seen[k]) continue; seen[k] = true;
          if (cur.state.done) { if (cur.state.outcome === 'COMPLETE') { done = cur; break; } continue; }
          const clone = r => { const c = BQRuntime.Runtime.load(r.Q, JSON.parse(r.serialize()));
                               c.node = r.node ? c._talkById[r.node.id] : null; return c; };
          if (!cur.node) { const a = cur.available(); if (!a.length) continue;
                           a.forEach(id => { const c = clone(cur); c.begin(id); stack.push(c); }); continue; }
          const v = cur.view();
          if (!v.options.length) { const c0 = clone(cur); c0.node = null; stack.push(c0); continue; }
          v.options.forEach(o => { const c = clone(cur); c.choose(o.i); stack.push(c); });
        }
        if (!done) return { err: 'no COMPLETE path found in the browser' };
        const purse = BohemiaPurse.create();
        const before = BohemiaPurse.balances(purse);
        const res = BohemiaPayday.payForQuest(purse, done.state, 1, spec.id, Q);
        const after = BohemiaPurse.balances(purse);
        return { reward: done.state.reward, res: res, before: before, after: after };
      });
      console.log('  [on the surface] ' + JSON.stringify(run).slice(0, 260));
      ok('R3 a real quest reaches COMPLETE in the browser and carries a reward',
         !run.err && !!run.reward && Object.keys(run.reward).length === 1, run.err);
      ok('R4 the real payday bridge applied it', !run.err && run.res && run.res.applied === true,
         run.res && run.res.reason);
      ok('R5 *** AND THE PURSE ACTUALLY WENT UP, END TO END ON THE WALKED SURFACE ***',
         !run.err && (() => {
           const c = Object.keys(run.reward)[0];
           const b = (run.before && run.before[c]) || 0, a = (run.after && run.after[c]) || 0;
           return a === b + run.reward[c];
         })());
    }
    ok('R6 nothing threw while the job was paid', errs.length === 0, errs.slice(0, 3).join(' | '));

  /* *** THE SELF-TEST FOR THE COMMENT FIX, BOTH WAYS. *** A stripper that ate too
     much would hide every real pay line and this gate would go quietly green on a
     game where nothing pays -- the exact disease it was written to catch. So it is
     fired at a string it MUST see and a string it MUST NOT. */
  ok('S1 the comment stripper still sees a real pay line',
     /@DO pay\s+\S+\s+\S+/.test(codeOf('@STAGE 30 COMPLETE #quiet\n  @DO pay clout 1')));
  ok('S2 and never sees one inside a comment',
     !/@DO pay\s+\S+\s+\S+/.test(codeOf('# it is not written with the @DO pay verb here, on purpose')));
  ok('S3 and an indented comment is still a comment',
     !/@DO pay\s+\S+\s+\S+/.test(codeOf('   #   @DO pay resources 1')));
  ok('S4 and a pay line that follows a comment survives it',
     (codeOf('# @DO pay nothing here\n  @DO pay clout 1').match(/@DO pay\s+\S+\s+\S+/g) || []).length === 1);
  } finally {
    await b.close();
  }

  console.log('THE JOB PAYS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
