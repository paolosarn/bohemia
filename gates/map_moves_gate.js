/* ============================================================================
   MAP MOVES GATE (9/13/26, QUESTS lane) -- VAMILY [map moves] / BB-TERRITORY-FLAG.

   THE ROW: "TEN QUESTS SAY THE MAP CHANGES HANDS AND NOTHING IS LISTENING."

   PAOLO 7/24, THE PACING LAW: the territory AI "is never a tick -- it fires when
   the narrative calls for it, a quest resolves, a story beat lands."
   PAOLO 9/13, RULE 14: "You offer requests just for me to see them, but nothing
   happens." A card that promises and does nothing is the worst bug in the game.

   WHAT IT HOLDS, AND WHY EACH IS HERE:

   1. THE PROMISE IS KEPT. Ten quests fire @DO advance_territory, and on the real
      walked surface a quest resolving really moves a block to a real faction.

   2. *** WHO TAKES IT IS READ, NOT TYPED. *** Every faction name in every move
      comes out of the quest's own @DO lines. This gate re-derives the answer from
      the .bq corpus and fails if the module disagrees with the files.

   3. THE FINDING, HELD AS A CHECK: the map moves AGAINST you. In all four quests
      that state a posture, the pusher is the faction the same stage just angered.
      If somebody "fixes" this into rewarding the faction you helped, this goes red.

   4. *** ONE NAME FOR ONE FACTION. *** The first live drive moved a block from
      "Mob" to "MOB" -- the files shout, the registry is title case -- which is a
      no-op dressed as a conquest AND writes a name no other system knows. The
      module resolves against the valley's own list (the rule bohemia_loop.js:583
      already used) and REFUSES an unknown name.

   5. THE REFUSALS ARE REAL. A failed job takes nothing. A quest that never said
      the map moves takes nothing. A faction that already holds the block takes
      nothing. And S24, whose stage harms a PERSON (bond owner -40) and no
      faction, names no claimant, so it moves nothing -- which the gate asserts
      against the real file rather than trusting the module.

   6. NOTHING IS INVENTED. No threshold for how far standing must drop, no size
      dial, one block per resolution (EVERYTHING COSTS ONE), and the ledger holds
      ONLY cells a quest took so an empty one leaves the map exactly as it was.

   7. IT NEVER WRITES INTO HIS TABLE. BohemiaTowns.HOLDS is the authored override
      and stays empty; a capture is world state and lives in its own ledger.
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
const G = require(path.join(ROOT, 'engine/bohemia_ground.js'));

const KNOWN = ['Network','Trades','Remnants','Mob','Volunteers','Reds','Blues',
               'Colorful','Church','Anarchists','Cartel','Custom','Homeless','Caravans'];

/* ---- 2 + 3. THE CORPUS DECIDES, AND THE GATE RE-DERIVES IT ---------------- */
const BQDIR = path.join(ROOT, 'quests/bq');
const movers = fs.readdirSync(BQDIR).filter(f => f.endsWith('.bq'))
  .filter(f => /advance_territory/.test(fs.readFileSync(path.join(BQDIR, f), 'utf8')));
ok('1a ten quests in the corpus fire the verb (' + movers.length + ')', movers.length === 10);

/* pull the stage that fires the verb, and what it does to factions */
function stageOf(file) {
  const t = fs.readFileSync(path.join(BQDIR, file), 'utf8');
  const lines = t.split('\n');
  let cur = null, blocks = {};
  for (const L of lines) {
    const m = L.match(/^@STAGE\s+(\S+)(.*)$/);
    if (m) { cur = m[1] + ' ' + m[2].trim(); blocks[cur] = []; continue; }
    if (cur) blocks[cur].push(L);
  }
  for (const k of Object.keys(blocks)) {
    const b = blocks[k].join('\n');
    if (!/advance_territory/.test(b)) continue;
    return {
      name: k, body: b,
      faction: [...b.matchAll(/@DO faction\s+([A-Za-z_]+)\s*([+-]?\d+)/g)]
                 .map(x => ({ id: x[1], n: parseInt(x[2], 10) })),
      posture: [...b.matchAll(/@DO faction_posture\s+([A-Za-z_]+)\s*([+-]?\d+)/g)]
                 .map(x => ({ id: x[1], n: parseInt(x[2], 10) })),
      bond:    [...b.matchAll(/@DO bond\s+([A-Za-z_]+)\s*([+-]?\d+)/g)]
                 .map(x => ({ id: x[1], n: parseInt(x[2], 10) }))
    };
  }
  return null;
}

let loud = 0, complete = 0, angered = 0, postured = 0;
movers.forEach(f => {
  const st = stageOf(f);
  if (!st) return;
  if (/#reckless/.test(st.name)) loud++;
  if (/COMPLETE/.test(st.name)) complete++;
  if (st.posture.length) {
    postured++;
    /* THE FINDING: the faction pushed is the faction angered, in the same stage */
    const push = st.posture.filter(p => p.n > 0).map(p => p.id);
    const hurt = st.faction.filter(p => p.n < 0).map(p => p.id);
    if (push.length && hurt.length && push.every(p => hurt.indexOf(p) >= 0)) angered++;
  }
});
ok('1b every one of them fires it in a COMPLETE stage (' + complete + '/' + movers.length + ')',
   complete === movers.length);
ok('1c *** and every one is tagged #reckless: the map only moves when you did it'
   + ' loud *** (' + loud + '/' + movers.length + ')', loud === movers.length);
ok('3a *** the faction that PUSHES is the faction you just ANGERED, in every'
   + ' quest that states a posture *** (' + angered + '/' + postured + ')',
   postured === 4 && angered === 4);

/* the module must agree with the corpus, quest by quest */
let agreed = 0, refused = 0;
movers.forEach(f => {
  const st = stageOf(f); if (!st) return;
  const state = { posture: {}, faction: {}, advanceTerritory: true, done: true,
                  outcome: 'COMPLETE', doneTags: ['reckless'] };
  st.posture.forEach(p => { state.posture[p.id] = (state.posture[p.id] || 0) + p.n; });
  st.faction.forEach(p => { state.faction[p.id] = (state.faction[p.id] || 0) + p.n; });
  const who = G.pusher(state);
  const hurt = st.faction.filter(p => p.n < 0);
  const push = st.posture.filter(p => p.n > 0);
  if (!hurt.length && !push.length) { if (who === null) refused++; return; }
  const expect = push.length ? push[0].id
                             : hurt.reduce((a, b) => (a.n <= b.n ? a : b)).id;
  if (who && who.faction === expect) agreed++;
});
ok('2a the module names the same faction the files do, quest by quest ('
   + agreed + ' of ' + (movers.length - 1) + ')', agreed === movers.length - 1);
ok('5a *** the one quest whose stage harms a PERSON and no faction names nobody,'
   + ' so it moves nothing *** (' + refused + ')', refused === 1);

/* and that quest is the one we think it is, checked against the real file */
const s24 = stageOf('S24_FIFTY_FIVE_GALLONS_A_FOOT.bq');
ok('5b and it is S24, whose stage carries a bond hit and no negative faction',
   !!s24 && s24.bond.some(b => b.n < 0) && !s24.faction.some(p => p.n < 0));

/* ---- 4. ONE NAME FOR ONE FACTION ---------------------------------------- */
ok('4a the shouted name in the files resolves to the valley\'s own spelling',
   G.resolve('MOB', KNOWN) === 'Mob' && G.resolve('TRADES', KNOWN) === 'Trades');
ok('4b *** a name the valley never heard of is REFUSED, not written ***',
   G.resolve('Ghosts', KNOWN) === null &&
   /does not know a faction/.test(G.refuse({ said: true, done: true, outcome: 'COMPLETE',
     faction: 'Ghosts', where: '1,1', held: 'Mob', known: KNOWN })));
ok('4c and the same faction under two spellings is not a conquest',
   G.refuse({ said: true, done: true, outcome: 'COMPLETE', faction: 'Mob',
              where: '1,1', held: 'Mob', known: KNOWN }) === 'they already hold it');

/* ---- 5. THE REFUSALS, one at a time -------------------------------------- */
const base = { said: true, done: true, outcome: 'COMPLETE', faction: 'Mob',
               where: '1,1', held: 'Network', known: KNOWN };
ok('5c a real move is accepted', G.refuse(base) === null);
ok('5d a quest that never said the map moves is refused',
   G.refuse({ ...base, said: false }) === 'the quest did not say the map moves');
ok('5e an unfinished quest is refused',
   G.refuse({ ...base, done: false }) === 'the quest is not finished');
ok('5f *** a job that FAILED takes no ground ***',
   G.refuse({ ...base, outcome: 'FAIL' }) === 'a job that failed takes no ground');
ok('5g a quest that crossed nobody is refused',
   G.refuse({ ...base, faction: null }) === 'nobody was crossed, so nobody has a claim');
ok('5h a quest that happened nowhere is refused',
   G.refuse({ ...base, where: null }) === 'the quest happened nowhere');

/* ---- 6. NOTHING INVENTED, AND ONE BLOCK ---------------------------------- */
const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_ground.js'), 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
ok('6a no faction name is typed into the module',
   !KNOWN.some(f => new RegExp('[\'"]' + f + '[\'"]').test(code)));
/* 6b CAUGHT ITSELF FIRST, and the check was the thing that was wrong: it read
   `indexOf('reckless') >= 0` as a threshold. That is a membership test, so the
   comparisons that are plainly not thresholds are named and removed one kind at
   a time -- and then the check is PROVED to still bite, because a check loosened
   until it passes is not a check. */
function thresholds(t) {
  return t.replace(/indexOf\([^)]*\)\s*[<>]=?\s*-?\d+/g, '')   /* membership */
          .replace(/\.length\s*[<>=!]=?\s*-?\d+/g, '')          /* how many */
          .replace(/[<>]\s*0\b/g, '')                           /* sign of a delta */
          .match(/[<>]=?\s*-?\d+/g) || [];
}
ok('6b no threshold number is typed into the module ('
   + (thresholds(code).join(',') || 'none') + ')', thresholds(code).length === 0);
ok('6b-self and that check really bites on a threshold',
   thresholds('if (fac[f] < -10) take();').length === 1);
const L = G.fresh();
G.take(L, base);
ok('6c one resolution takes exactly one block', G.count(L) === 1);
G.take(L, { ...base, where: '2,2' });
ok('6d a second resolution takes one more, never a sweep', G.count(L) === 2);
ok('6e an empty ledger answers nothing, so the map reads as it always did',
   G.holderOf(G.fresh(), '1,1') === null);
ok('6f and a taken cell answers the new holder', G.holderOf(L, '1,1') === 'Mob');
ok('6g the ledger survives a save and a reload',
   G.holderOf(G.restore(G.serialize(L)), '2,2') === 'Mob');

/* ---- 7. HIS TABLE IS NEVER WRITTEN -------------------------------------- */
ok('7a the module never touches HOLDS', !/HOLDS/.test(code));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
ok('7b and his authored override is still empty', Object.keys(T.HOLDS).length === 0);

/* ---- the seam is in the walked surface ---------------------------------- */
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const cityCode = CITY.replace(/\/\*[\s\S]*?\*\//g, '');
ok('8a the module is carried by the walked city', /BohemiaGround/.test(cityCode));
ok('8b the capture sits behind at(), so every reader gets it and none opts in',
   /g\.at=function\(x,y\)/.test(cityCode));
ok('8c it fires where a quest RESOLVES, which is his pacing law, not on a tick',
   /state\.done\) ctGroundTake\(\)/.test(cityCode));
ok('8d there is no timer anywhere near it',
   !/setInterval\([^)]*ctGroundTake/.test(cityCode));
ok('8e and it fires once per quest, not once per draw', /CT_GROUND_DONE/.test(cityCode));

console.log('MAP MOVES GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (' + movers.length + ' quests move the map, ' + postured + ' state a posture)');
process.exit(fail ? 1 : 0);
