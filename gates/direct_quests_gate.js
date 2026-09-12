/* ============================================================================
   DIRECT COVERS QUESTS GATE (9/12/26, QUESTS lane) -- VAMILY [edit quests],
   DIRECT-COVERS-QUESTS, against the 8/12 law HE MUST BE ABLE TO DIRECT IT.

   HIS WORDS, 8/11: "Bro this is the same fucking problem we had with the
   questing shit! I CANT DIRECT QUESTS OR CUTSCENES RN WTF IS WRONG WITH YOU."

   THE LAW NAMES EIGHT VERBS for anything ordered -- SEE, ADD, DELETE, MOVE,
   RETARGET, RELOCATE, PLAY IT IMMEDIATELY, KEEP IT -- and one test:
   "where does he change this himself? If the answer is 'he tells me and I edit a
   file', the system is not shipped yet."

   MEASURED ON THE REAL ALPHA BEFORE ANY OF THIS WAS BUILT. A cutscene got all
   eight. A quest got five and a half:
     - dirWhere() opened with `if(DIR_MODE!=='cutscene') return;` so a quest had
       NO WHERE CONTROL AT ALL: 1142 bytes of controls on a scene, 0 on a quest
     - dirPlay() said it in the alpha's own words: "Quests do not play in here yet"
     - the ADD row offered + LINE, + CHOICE, + JOURNAL, so the half of a quest
       that decides HOW IT ENDS -- COMPLETE or FAIL, how loud, what it pays --
       was not in the tab in any form
   And the reason was honest, which is why the fix is what it is: the old row
   reader said of itself "deliberately not a full parser ... pretending to edit
   something that DOES NOT ROUND-TRIP would be worse than not showing it."

   WHAT IT HOLDS:

   1. THE ROWS ARE LOSSLESS. A quest nobody edited rebuilds BYTE-IDENTICAL from
      its rows, across every quest in the corpus. Not "close enough": the same
      bytes, because an untouched row gives back the line it came from.

   2. AND A REBUILT LINE IS STILL A REAL LINE. Every row of every quest is forced
      to rebuild from its fields, and the result must still parse and validate
      with ZERO errors and ZERO warnings through the real parser -- because a
      rebuilder tested only on the lines nobody touched is tested on nothing.

   3. THE STAGE IS EDITABLE, AND IT IS THE THING HE COULD NOT TOUCH. Whether an
      ending COMPLETES or FAILS, how loud it was (his 7/21 clout ruling), and what
      it pays (shipped 9/11). Driven on the real surface, then read back out of
      the rebuilt file.

   4. HE CAN ADD THE TWO THINGS A QUEST IS MADE OF. A stage and an objective, not
      only words.

   5. *** IT PLAYS. *** Through the SAME parser and the SAME runtime the city
      plays it with, in the tab, with pressable options that actually advance.
      The law's word is IMMEDIATELY and its phrase is "the thing he built, not a
      preview of a plan".

   6. AND IT PLAYS WHAT HE BUILT, NOT WHAT SHIPPED. An edit made in the tab has to
      show up in the thing that runs. This is the check the whole row is for.

   7. A BROKEN QUEST IS REPORTED, NEVER REPAIRED. If his edit does not parse he is
      told, in the machine's own words. A tab that quietly fixes him is a tab that
      decides what he meant.

   8. RELOCATE, HONESTLY. A cutscene has a room. A QUEST DOES NOT: its people are
      @ROLEs cast at runtime and where it happens IS the condition on the role.
      Giving a quest a room picker would have been inventing a field the language
      does not have, so the gate demands the control that edits the real one.
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
const D  = require(path.join(ROOT, 'engine/bohemia_direct_bq.js'));
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));
const RT = require(path.join(ROOT, 'engine/bohemia_quest_runtime.js'));

const BQDIR = path.join(ROOT, 'quests/bq');
const files = fs.readdirSync(BQDIR).filter(f => /\.bq$/.test(f)).sort();
ok('0a there are canon quests to direct (' + files.length + ')', files.length > 10);

/* ---- 1. LOSSLESS, BYTE FOR BYTE ------------------------------------------ */
let same = 0, drift = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(BQDIR, f), 'utf8').replace(/\r\n/g, '\n');
  if (D.text(D.rows(src)) === src) same++; else drift.push(f);
}
ok('1a every quest rebuilds BYTE-IDENTICAL from its rows (' + same + '/' + files.length + ')',
   same === files.length, drift.slice(0, 3).join(', '));
ok('1b and a row carries its own line, which is why', (() => {
  const r = D.rows('@STAGE 30 COMPLETE #quiet')[0];
  return r.raw === '@STAGE 30 COMPLETE #quiet' && r.k === 'stage';
})());

/* ---- 2. A REBUILT LINE IS STILL A REAL LINE ------------------------------ */
let good = 0, broke = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(BQDIR, f), 'utf8');
  const rs = D.rows(src); rs.forEach(r => { r.edited = true; });
  const out = D.text(rs);
  const Q = BQ.parse(out), v = BQ.validate(Q, {});
  const bad = Q.warnings.length + (v.errors || []).length + (v.warnings || []).length;
  if (!bad) good++; else broke.push(f + ' (' + bad + ')');
}
ok('2a a FORCED rebuild of every line of every quest still parses and validates '
   + 'with zero errors and zero warnings (' + good + '/' + files.length + ')',
   good === files.length, broke.slice(0, 3).join(', '));

/* *** AND VALID IS NOT THE SAME AS UNCHANGED, WHICH THE NEGATIVE CONTROLS PROVED
   ON THIS VERY GATE. *** Deleting COMPLETE from a stage produces a stage that is
   still perfectly legal .bq -- so check 2a stayed green while the rebuilder was
   quietly throwing away whether the job succeeded, and only an unrelated check
   about the clout tag noticed. A rebuilder that loses meaning without losing
   legality is the worst possible failure here: his file would come back looking
   fine and playing differently. So the rebuild is compared to the original for
   what it MEANS, through the real parser, quest by quest. */
function meaning(text) {
  const Q = BQ.parse(text);
  return JSON.stringify({
    id: Q.id, act: Q.act, faction: Q.faction, once: Q.once,
    roles: (Q.roles || []).map(r => [r.name, r.req, r.cond || '']),
    stages: (Q.stages || []).map(st => [st.n, (st.flags || []).slice().sort(),
                                        (st.tags || []).slice().sort(),
                                        (st.dos || []).map(d => d.text), st.log]),
    objs: (Q.objs || []).map(o => [o.n, o.text]),
    talks: (Q.talks || []).map(t => [t.id, t.speaker, t.entry || '',
      (t.says || []).map(x => x.text),
      (t.opts || []).map(o => [o.text, o.gate, o.to || '', !!o.silence, !!o.trap])])
  });
}
let sameMeaning = 0, changed = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(BQDIR, f), 'utf8');
  const rs = D.rows(src); rs.forEach(r => { r.edited = true; });
  try {
    if (meaning(src) === meaning(D.text(rs))) sameMeaning++; else changed.push(f);
  } catch (e) { changed.push(f + ' (threw)'); }
}
ok('2b *** and a forced rebuild MEANS THE SAME THING *** -- same stages, same '
   + 'outcomes, same clout tags, same effects, same routes (' + sameMeaning + '/'
   + files.length + ')', sameMeaning === files.length, changed.slice(0, 3).join(', '));

/* ---- 3 and 4. THE STAGE AND WHAT HE CAN ADD (headless half) -------------- */
{
  const src = fs.readFileSync(path.join(BQDIR, 'S01_THE_METER_READER.bq'), 'utf8');
  const rs = D.rows(src);
  const si = rs.findIndex(r => r.k === 'stage' && r.outcome === 'COMPLETE');
  ok('3a a stage row knows whether it completes the job', si >= 0);
  rs[si].outcome = 'FAIL'; rs[si].edited = true;
  ok('3b turning a completion into a failure lands in the file',
     /@STAGE\s+\d+\s+FAIL/.test(D.text(rs)));
  rs[si].clout = 'reckless'; rs[si].edited = true;
  ok('3c and so does how loud it was', /FAIL #reckless/.test(D.text(rs)));
  const before = D.payOf(rs, si);
  ok('3d the stage knows what it pays ("' + (before ? before.currency : '') + '")', !!before);
  /* READ THE STAGE HE CHANGED, NOT THE WHOLE FILE. My first cut asserted no
     `@DO pay electricity` survived anywhere, and S01 has FOUR completions that
     each pay one -- so the check demanded that editing one ending silently
     rewrite the other three. The gate was wrong about honest code. */
  function payAt(rows, idx) { const p = D.payOf(rows, idx); return p ? p.currency : null; }
  const otherStage = rs.findIndex((r, n) => r.k === 'stage' && n !== si);
  const otherWas = payAt(rs, otherStage);
  D.setPay(rs, si, 'clout');
  ok('3e changing what it pays rewrites that stage\'s own pay line, and pays ONE',
     payAt(rs, si) === 'clout' && /@DO pay clout 1/.test(D.text(rs)));
  ok('3e2 and it leaves the other endings alone', payAt(rs, otherStage) === otherWas);
  D.setPay(rs, si, '');
  ok('3f and taking the pay away takes the line away, not the amount to zero',
     payAt(rs, si) === null && payAt(rs, otherStage) === otherWas);
  /* AND IT ALL STILL PARSES AFTERWARDS. */
  const Q2 = BQ.parse(D.text(rs));
  ok('3g the quest he just re-ended is still a quest', Q2.warnings.length === 0 && !!Q2.id);

  const rs2 = D.rows(src);
  const n = D.nextStage(rs2), o = D.nextObj(rs2);
  ok('4a the next stage number is read off his own file, never counted from one',
     n > 30, 'got ' + n);
  rs2.push(D.newStage(n), D.newLog('A new way for it to end.'));
  rs2.push(D.newObj(o, 'Go and look'));
  const Q3 = BQ.parse(D.text(rs2));
  ok('4b a stage he adds is a real stage the parser sees ('
     + Q3.stages.length + ' stages)',
     Q3.stages.some(s => String(s.n) === String(n)));
  ok('4c an objective he adds is a real objective (' + Q3.objs.length + ')',
     Q3.objs.some(ob => String(ob.n) === String(o)));
}

/* ---- 5 and 7. THE RUNTIME, HEADLESS FIRST -------------------------------- */
{
  const src = fs.readFileSync(path.join(BQDIR, 'S01_THE_METER_READER.bq'), 'utf8');
  const Q = BQ.parse(D.text(D.rows(src)));
  const rt = RT.Runtime.load(Q, null);
  rt.start(Q.stages[0].n);
  const av = rt.available();
  ok('5a a rebuilt quest opens a real node on the real runtime', av.length > 0);
  const view = rt.begin(av[0]);
  ok('5b with the quest\'s own words and its own options ('
     + (view.says || []).length + ' said, ' + (view.options || []).length + ' to press)',
     (view.says || []).length > 0 && (view.options || []).length > 0);
  const after = rt.choose(view.options[0].i);
  ok('5c and pressing one actually moves', after.node !== view.node);
}

/* ---- THE SURFACE --------------------------------------------------------- */
const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
ok('6a the rows module ships in the alpha, verbatim',
   alpha.indexOf('BOHEMIA DIRECT BQ -- A QUEST AS ROWS HE CAN CHANGE') >= 0);
ok('6b and so do the real parser and the real runtime it plays on',
   /==== engine\/bohemia_bq\.js \(THE REAL PARSER/.test(alpha)
   && /==== engine\/bohemia_quest_runtime\.js \(THE REAL RUNTIME/.test(alpha));
/* READ THE CODE, NOT THE PROSE. The sentence "Quests do not play in here yet" is
   now QUOTED in the inlined module's header as the measurement this row was
   written from, so searching the raw file for it finds an honest comment and
   calls the fix missing -- the same prose-read-as-code bug this lane fixed in the
   pay gate on 9/11. What matters is that nothing ASSIGNS it any more. */
const alphaCode = alpha.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
ok('6c the alpha no longer TELLS HIM quests do not play in here',
   !/note\.innerHTML\s*=\s*'Quests do not play/.test(alphaCode)
   && alphaCode.indexOf('Quests do not play in here yet') < 0);
ok('6d the array carries his source, not a generated copy of part of it',
   /var BOHEMIA_QUESTS = \[\{"file":/.test(alpha) && /"src":/.test(alpha.slice(alpha.indexOf('var BOHEMIA_QUESTS'), alpha.indexOf('var BOHEMIA_QUESTS') + 4000)));

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
        .find(e => (e.textContent || '').trim() === 'DIRECT');
      if (!t) return false; t.click(); return true;
    });
    ok('R1 the DIRECT tab is tappable', tapped === true);
    await SETTLE(page, 2500);
    await page.evaluate(() => {
      const c = Array.from(document.querySelectorAll('button,span,div'))
        .filter(e => (e.textContent || '').trim() === 'QUESTS' && e.children.length === 0)[0];
      if (c) c.click();
    });
    await SETTLE(page, 1200);

    const seen = await page.evaluate(() => ({
      mode: (typeof DIR_MODE !== 'undefined') ? DIR_MODE : '?',
      rows: (document.getElementById('dirList') || { children: [] }).children.length,
      stageSel: document.querySelectorAll('.dirStageSel').length,
      roleSel: document.querySelectorAll('.dirRoleSel').length,
      adds: Array.from(document.querySelectorAll('#dirAdd .opt, #dirAdd button'))
              .map(e => (e.textContent || '').trim()),
      clean: (() => { try { const c = dirCur();
        return dirQuestText(c) === String(c.src).replace(/\r\n/g, '\n'); } catch (e) { return 'ERR'; } })(),
      edited: (() => { try { return dirEdited(); } catch (e) { return 'ERR'; } })()
    }));
    ok('R2 a quest opens as an editable list (' + seen.rows + ' rows)',
       seen.mode === 'quest' && seen.rows > 10);
    ok('R3 *** the stage is a control now *** (' + seen.stageSel + ' stage pickers)',
       seen.stageSel >= 3);
    ok('R4 RELOCATE: the role condition is a control, which is a quest\'s real where ('
       + seen.roleSel + ')', seen.roleSel >= 2);
    ok('R5 ADD covers what a quest is made of (' + seen.adds.join(' ') + ')',
       seen.adds.indexOf('+ STAGE') >= 0 && seen.adds.indexOf('+ OBJECTIVE') >= 0);
    ok('R6 and an untouched quest still IS his file, on the surface',
       seen.clean === true && seen.edited === false);

    /* *** PLAY, AND PLAY WHAT HE BUILT. *** */
    const played = await page.evaluate(() => {
      try { dirPlay(); } catch (e) { return { threw: String(e.message) }; }
      const n = document.getElementById('dirNote');
      return { txt: (n.textContent || '').replace(/\s+/g, ' ').slice(0, 400),
               opts: n.querySelectorAll('.dirQOpt').length };
    });
    ok('R7 *** a quest PLAYS in the tab, with options he can press *** ('
       + played.opts + ')', !played.threw && played.opts > 0, played.threw);
    ok('R8 and it is the quest\'s own words, not a summary of them',
       !!played.txt && /STAGE/.test(played.txt) && played.txt.length > 60);

    const walked = await page.evaluate(() => {
      const n = document.getElementById('dirNote');
      const before = (n.textContent || '');
      const b0 = n.querySelector('.dirQOpt');
      if (!b0) return { ok: false };
      b0.click();
      return { ok: true, moved: (n.textContent || '') !== before,
               after: (n.textContent || '').replace(/\s+/g, ' ').slice(0, 160) };
    });
    ok('R9 pressing one walks the quest on the real runtime', walked.ok && walked.moved);

    /* THE CHECK THE WHOLE ROW IS FOR: his edit has to reach the thing that runs. */
    const his = await page.evaluate(() => {
      const c = dirCur();
      const rows = c.data.rows;
      const i = rows.findIndex(r => r.k === 'say');
      if (i < 0) return { ok: false };
      rows[i].text = 'PAOLO WROTE THIS LINE IN DIRECT'; rows[i].edited = true;
      try { dirSave(); } catch (e) {}
      const inFile = dirQuestText(c).indexOf('PAOLO WROTE THIS LINE IN DIRECT') >= 0;
      try { dirPlay(); } catch (e) { return { ok: true, inFile: inFile, threw: String(e.message) }; }
      const n = document.getElementById('dirNote');
      return { ok: true, inFile: inFile, edited: dirEdited(),
               onStage: (n.textContent || '').indexOf('PAOLO WROTE THIS LINE IN DIRECT') >= 0 };
    });
    ok('R10 his edit lands in the file his rows rebuild', his.ok && his.inFile === true);
    ok('R11 and the tab knows it is his version now, not the shipped one', his.edited === true);
    ok('R12 *** AND WHAT PLAYS IS THE LINE HE WROTE, not the one that shipped ***',
       his.onStage === true, his.threw);

    /* A BROKEN QUEST IS REPORTED, NEVER REPAIRED. */
    const broke = await page.evaluate(() => {
      const c = dirCur();
      const rows = c.data.rows;
      const i = rows.findIndex(r => r.k === 'opt');
      if (i < 0) return { ok: false };
      rows[i].goto = 'a_node_that_does_not_exist'; rows[i].edited = true;
      try { dirSave(); dirPlay(); } catch (e) { return { ok: true, threw: String(e.message) }; }
      const n = document.getElementById('dirNote');
      return { ok: true, said: (n.textContent || '').replace(/\s+/g, ' ').slice(0, 200) };
    });
    ok('R13 a quest he breaks is REPORTED in the machine\'s own words, not repaired',
       broke.ok && !broke.threw && /will not run|will not parse/i.test(broke.said || ''),
       broke.said);

    ok('R14 nothing threw while directing a quest (' + errs.length + ')',
       errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('DIRECT QUESTS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
