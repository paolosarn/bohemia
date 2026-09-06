/* ============================================================================
   LADDER WALK GATE (9/6/26, QUESTS lane) -- VAMILY [spine first],
   THE-LADDER-IS-THE-MAIN-LINE.

   THE PILLAR: 60 mini bosses, each handing you a VERB. The row asks for the
   ladder walked end to end as the story -- each boss A PLACE, A PERSON and THE
   VERB you take from them.

   WHAT WAS ALREADY TRUE, AND IT IS THE GOOD HALF: all 53 written bosses are in
   the running game, parsed verbatim from his record, and every one hands over a
   verb. The VERB column is finished work.

   WHAT THIS GATE HOLDS, BECAUSE THE OTHER TWO COLUMNS WERE EMPTY:

   1. NOBODY TYPED A BOSS. The data module is generated from his ladder and his
      graph, and this gate RE-PARSES BOTH SOURCES AND COMPARES FIELD BY FIELD. A
      boss edited into the generated file instead of into his record goes red.
      ONE RULER: his two files, always.

   2. THE WALK IS LEGAL. A man is offered only when every man his own graph says
      must fall first has fallen. This is the thing the game does not do: the
      fight picks uniformly at random out of everybody you do not hold, so the
      fifty-third man can be the first man you meet.

   3. *** THE PLACE IS WHOLE-WORD, AND THIS IS A REGRESSION TEST FOR A REAL BUG.
      *** The first cut matched substrings both ways and produced confident
      nonsense: THE LOCKSMITH placed at "blockgen" because block contains lock,
      THE CHEMIST at "agents" because reagents contains agents, THE WALL at
      "standing". Every one would have read as canon, because a place is not the
      sort of thing a player checks. Those three are asserted dead here forever.

   4. AND A PLACEMENT MUST NAME THE WORD THAT MADE IT. Every place carries the
      word from his own text that produced it, so a wrong one can be argued with
      by pointing at two files rather than at a judgement.

   5. NOTHING IS INVENTED AND NOTHING IS HIDDEN. A boss whose words name no place
      this city builds gets NO PLACE and is still returned. Dropping him is how a
      ladder gets called finished while most of it stands nowhere.

   6. IT DOES NOT TOUCH THE FIGHT. rollBoss is COMBAT's. This produces the walk
      and writes into nobody else's system.
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
const W = require(path.join(ROOT, 'engine/bohemia_ladderwalk.js'));
const D = require(path.join(ROOT, 'engine/bohemia_ladder_data.js'));
const O = require(path.join(ROOT, 'engine/bohemia_overmap.js'));

/* ---- 1. NOBODY TYPED A BOSS -------------------------------------------- */
const LADDER = path.join(ROOT, 'records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md');
const GRAPH  = path.join(ROOT, 'records/BOHEMIA_LADDER_GRAPH_8_13_26.json');
ok('1a his ladder is in the repo', fs.existsSync(LADDER));
ok('1b his graph is in the repo', fs.existsSync(GRAPH));

function parseLadder(text) {
  const rows = []; let act = 0;
  text.split('\n').forEach(l => {
    const h = l.match(/^##\s*ACT\s*([123])\b/); if (h) { act = +h[1]; return; }
    const m = l.match(/^\|\s*(\d+)\s*\|\s*\*\*([^*]+)\*\*\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/);
    if (!m) return;
    rows.push({ i: +m[1], n: m[2].trim(), holds: m[3].trim(), lock: m[4].trim(),
                grant: m[5].trim(), kind: m[6].trim(), act });
  });
  return rows;
}
const truth = parseLadder(fs.readFileSync(LADDER, 'utf8'));
const truthEdges = JSON.parse(fs.readFileSync(GRAPH, 'utf8')).edges;
ok('1c the ladder still parses (' + truth.length + ' bosses)', truth.length >= 50);
ok('1d the generated module carries exactly his count ('
   + D.BOSSES.length + ' vs ' + truth.length + ')', D.BOSSES.length === truth.length);
ok('1e and exactly his edge count (' + D.EDGES.length + ' vs ' + truthEdges.length + ')',
   D.EDGES.length === truthEdges.length);
const drifted = truth.filter((t, k) => {
  const b = D.BOSSES[k]; if (!b) return true;
  return b.i !== t.i || b.n !== t.n || b.holds !== t.holds || b.lock !== t.lock
      || b.grant !== t.grant || b.kind !== t.kind || b.act !== t.act;
});
ok('1f *** every boss matches his record field for field (' + drifted.length
   + ' drifted) ***', drifted.length === 0, drifted.map(d => d.n).join(' '));
ok('1g every row is marked draft, because they are his words carried across',
   D.BOSSES.every(b => b.draft === true));
ok('1h the walk module carries no ladder data of its own (it cannot drift)',
   (() => { const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_ladderwalk.js'), 'utf8');
            return !/THE POT|THE TAP|THE FILTER/.test(src); })());

/* ---- 2. THE WALK IS LEGAL ---------------------------------------------- */
const B = D.BOSSES, E = D.EDGES;
const gates = W.gatesOf(E);
const rootsNow = W.roots(B, E);
ok('2a something is open with nothing done (' + rootsNow.length + ' roots)', rootsNow.length > 0);
const illegalRoot = rootsNow.filter(b => (gates[b.n] || []).length > 0);
ok('2b nothing with an unmet prerequisite is ever offered (' + illegalRoot.length + ')',
   illegalRoot.length === 0, illegalRoot.map(b => b.n).join(' '));

/* Take the first real edge and prove the gate actually gates. */
const e0 = E.find(e => B.some(b => b.n === e.to) && B.some(b => b.n === e.from));
ok('2c his graph has an edge to test with', !!e0);
if (e0) {
  const closedBefore = W.openNow(B, E, []).every(b => b.n !== e0.to);
  const openAfter    = W.openNow(B, E, [e0.from]).some(b => b.n === e0.to);
  ok('2d a gated man is shut before his prerequisite (' + e0.to + ' behind ' + e0.from + ')',
     closedBefore);
  ok('2e and opens the moment it falls', openAfter);
}
ok('2f a man you already hold is never offered again',
   W.openNow(B, E, [B[0].n]).every(b => b.n !== B[0].n));
/* AND THE CLOSED DOORS SAY WHAT THEY WAIT FOR, in his own sentence. */
const shut = W.behind(B, E, []);
ok('2g every shut door names what it waits on (' + shut.length + ' shut)',
   shut.length > 0 && shut.every(s => s.waitingOn.length > 0));
ok('2h and carries his one-sentence physical reason',
   shut.filter(s => s.why && s.why.length > 5).length > shut.length * 0.5);
ok('2i open plus shut plus held is the whole ladder ('
   + (rootsNow.length + shut.length) + ' of ' + B.length + ')',
   rootsNow.length + shut.length === B.length);

/* ---- 3. THE PLACE IS WHOLE-WORD (THE REGRESSION TEST) ------------------- */
const places = Object.keys(O.DISTRICT).map(k => k.toLowerCase());
ok('3a the city hands over its own place vocabulary (' + places.length + ' districts)',
   places.length > 20);
/* *** THE THREE FALSE MATCHES THAT ALMOST SHIPPED, ASSERTED DEAD. *** */
const bad = [
  { boss: 'THE LOCKSMITH', never: 'blockgen', why: 'block contains lock' },
  { boss: 'THE CHEMIST',   never: 'agents',   why: 'reagents contains agents' },
  { boss: 'THE WALL',      never: 'standing', why: 'standing contains stand' }
];
bad.forEach(t => {
  const b = B.find(x => x.n === t.boss);
  const got = b ? W.placeOf(b, places.concat([t.never])) : null;
  ok('3b ' + t.boss + ' is never placed at "' + t.never + '" (' + t.why + ')',
     !got || got.place !== t.never, got ? got.place : 'null');
});
/* And the positive: an exact word still matches. */
const dam = B.find(b => b.n === 'THE DAM');
ok('3c an exact word still places the man (THE DAM)',
   !!dam && (W.placeOf(dam, places) || {}).place === 'dam');

/* ---- 4. A PLACEMENT NAMES ITS WORD -------------------------------------- */
const sorted = W.placed(B, places);
ok('4a every placement carries the word from his text that produced it',
   sorted.placed.every(p => p.because && p.because.length >= 3));
ok('4b and that word really is in that boss\'s own text',
   sorted.placed.every(p => {
     const b = B.find(x => (x.n) === p.boss);
     return b && (b.holds + ' ' + b.n).toLowerCase().indexOf(p.because) >= 0;
   }));

/* ---- 5. NOTHING INVENTED, NOTHING HIDDEN -------------------------------- */
ok('5a placed plus placeless is the whole ladder ('
   + sorted.placed.length + ' + ' + sorted.placeless.length + ' = ' + B.length + ')',
   sorted.placed.length + sorted.placeless.length === B.length);
ok('5b every placement points at a district this city really builds',
   sorted.placed.every(p => places.indexOf(String(p.place).toLowerCase()) >= 0));
ok('5c a placeless man is returned, not dropped, and says what he holds',
   sorted.placeless.every(p => typeof p.holds === 'string'));
const w0 = W.walk({ bosses: B, edges: E, held: [], places, peopleAt: () => [] });
ok('5d the walk returns placeless men too (' + w0.filter(x => !x.place).length + ' of '
   + w0.length + ' open have no place)', w0.some(x => x.place === null));
ok('5e every open man hands over a verb, which is the half that was already done',
   w0.length > 0 && w0.every(x => !!x.verb));
ok('5f nobody is invented when nobody is standing there',
   w0.every(x => x.person === null));
/* AND A PERSON IS TAKEN FROM THE PEOPLE THE WORLD PUT THERE. */
const w1 = W.walk({ bosses: B, edges: E, held: [], places,
                    peopleAt: () => [{ id: 'a' }, { id: 'b' }] });
const withPlace = w1.filter(x => x.place);
ok('5g when the world has people, a placed man is one of them',
   withPlace.length > 0 && withPlace.every(x => x.person && /^[ab]$/.test(x.person.id)));
ok('5h and the same man is the same man on every load (deterministic)',
   JSON.stringify(w1) === JSON.stringify(
     W.walk({ bosses: B, edges: E, held: [], places, peopleAt: () => [{ id: 'a' }, { id: 'b' }] })));

/* ---- 6. IT DOES NOT TOUCH THE FIGHT ------------------------------------- */
const wsrcRaw = fs.readFileSync(path.join(ROOT, 'engine/bohemia_ladderwalk.js'), 'utf8');
/* STRIP THE COMMENTS FIRST. The module's own header explains at length that it
   does NOT touch rollBoss, and the first cut of this check read that sentence as
   a call and went red. A gate that cannot tell code from prose about code will
   train people to delete the prose, which is the opposite of what this repo
   wants. */
const wsrc = wsrcRaw.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
ok('6a the walk never calls into combat (comments stripped)',
   !/rollBoss|BohemiaArena|setupEnemies/.test(wsrc));
ok('6b and assigns into no other module', !/Bohemia[A-Za-z]+\s*\.[A-Za-z]+\s*=[^=]/.test(wsrc));

/* ---- THE MEASUREMENT, PRINTED ------------------------------------------- */
const r = W.ready({ bosses: B, edges: E, held: [], places, peopleAt: () => [] });
console.log('  [the walk at the start] open ' + r.open + ' · with a verb ' + r.withVerb
  + ' · with a place ' + r.withPlace + ' · with a person ' + r.withPerson);
console.log('  [the whole ladder] placed ' + sorted.placed.length
  + ' · placeless ' + sorted.placeless.length + ' of ' + B.length);

/* ======================================================================== */
/*  THE REAL SURFACE (7/18 VERIFY ON THE REAL SURFACE)                       */
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
      if (!t) return false;
      t.click(); return true;
    });
    ok('R1 the RUN tab exists in the alpha and was tapped', tapped === true);
    await SETTLE(page, 16000);

    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof ctLadderWalk === 'function')) { city = f; break; } }
      catch (_e) {}
    }
    ok('R2 *** the walk reached the frame the player looks at ***', !!city);

    if (city) {
      const live = await city.evaluate(() => ({
        bosses: (typeof BohemiaLadderData !== 'undefined') ? BohemiaLadderData.count : -1,
        edges:  (typeof BohemiaLadderData !== 'undefined') ? BohemiaLadderData.edgeCount : -1,
        places: (ctLadderPlaces() || []).length
      }));
      ok('R3 his whole ladder is in the city (' + live.bosses + ' bosses, '
         + live.edges + ' edges)', live.bosses === B.length && live.edges === E.length);
      ok('R4 and the city hands over its own districts (' + live.places + ')',
         live.places === places.length);

      const walked = await city.evaluate(() => {
        const w = ctLadderWalk(), r = ctLadderReady();
        return { n: w.length, ready: r,
                 sample: w.slice(0, 3).map(x => ({ boss: x.boss, place: x.place,
                          person: !!x.person, verb: !!x.verb })) };
      });
      console.log('  [live walk] ' + JSON.stringify(walked.ready));
      ok('R5 *** the walk runs in the walked city and offers men ('
         + walked.n + ' open) ***', walked.n > 0);
      ok('R6 every man it offers hands over a verb',
         walked.ready && walked.ready.withVerb === walked.ready.open);
      ok('R7 and a man standing in a real district gets a real person from the valley ('
         + (walked.ready ? walked.ready.withPlace : '?') + ' placed, '
         + (walked.ready ? walked.ready.withPerson : '?') + ' with a person)',
         !!walked.ready && walked.ready.withPerson === walked.ready.withPlace);
      ok('R8 the gap is visible rather than hidden (placeless men are still returned)',
         !!walked.ready && walked.ready.withPlace < walked.ready.open);
    }
    ok('R9 nothing threw while the ladder was walked', errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('LADDER WALK GATE: ' + pass + ' passed, ' + fail + ' failed'
    + '  (' + B.length + ' bosses, ' + E.length + ' edges, '
    + sorted.placed.length + ' placed)');
  process.exit(fail ? 1 : 0);
})();
