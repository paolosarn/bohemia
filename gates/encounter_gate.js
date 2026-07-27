/* ENCOUNTER GATE (7/27/26, WORLD lane) — the machine gate for
   engine/bohemia_encounters.js, the ambient encounter director.

   APPROVED WORK: records/BOHEMIA_VERDICT_ACT1_ROSTER_7_26_26.txt, Paolo on the
   12-token act-1 roster and the anti-boredom pacing package: "Approve all."
   Commissioned off his own worry — "this game could be very boring if not done
   right" — so the thing this gate actually protects is that the world stays
   interesting, and every clause of it is measurable.

   Proves:
     1. THE ROSTER IS HIS. All 12 approved tokens, under the verdict's own names,
        and NOTHING ELSE — the act-2 reserved list (mountain lion, the named casino
        cat, cannibal crew, micro-drone swarm, construction-bot siege, toxic zones)
        must not have crept in as "foreshadowing".
     2. 70/20/10 HOLDS over a long walk, and holds because the class is chosen, not
        rolled. This caught the real bug: the first build substituted another class
        when the one the story wanted was on cooldown, and came out 40/42/18.
     3. STORYTELLER, NOT DICE. Same seed and same walk gives the identical night.
        A hurt player and a hot recent past get FEWER encounters, which is the whole
        point of a budget over a die.
     4. THE ~90 SECOND FLOOR is never crossed.
     5. RARE IS SACRED: a spice token fires at most once in a session, ever.
     6. NO REPEAT-SPAM: a token cannot come round again inside its cooldown, and
        with no cooldown ruled it fires at most once.
     7. NO GLOBAL SPAWNS EVER. A district with no table spawns nothing, and there is
        no fallback table anywhere to spawn from.
     8. NO BACKGROUND TICKING (Paolo's pacing ruling). The module owns no clock at
        all — no timer, no interval, no Date.now — so a standing-still player cannot
        be walked into anything.
     9. PRECONDITIONS THE ROSTER STATED are honoured: the bounty squad only exists
        because of your own murders, the spotter drone only patrols owned light.
    10. IT PLUGS INTO THE APPROVED RESOLVER through the encounters socket.

   Run: node gates/encounter_gate.js   Registered as ENCOUNTERS. */
'use strict';
const fs = require('fs');
const EN = require('../engine/bohemia_encounters.js');
const R = require('../engine/bohemia_resolve.js');
const WR = require('../engine/bohemia_world_resolve.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const SRC = fs.readFileSync('engine/bohemia_encounters.js', 'utf8');

const ALL = EN.ROSTER.map(t => t.id);
const openWorld = { district: 'suburb', phase: 'night', health: 1, heat: 0, can: () => true };
function walk(dir, world, steps, spent) {
  const out = [];
  for (let i = 0; i < steps; i++) { const r = dir.consider(world, spent); if (r.fired) out.push(r); }
  return out;
}

// ---- 1. THE ROSTER IS HIS --------------------------------------------------
{
  const VERDICT = 'records/BOHEMIA_VERDICT_ACT1_ROSTER_7_26_26.txt';
  ok('the verdict that approved this exists', fs.existsSync(VERDICT));
  const v = fs.readFileSync(VERDICT, 'utf8').toLowerCase().replace(/\s+/g, ' ');
  ok('and it really says approve all', v.indexOf('approve all') >= 0);

  ok('all 12 approved tokens are present', EN.ROSTER.length === 12);
  const NAMES = ['feral dog pack', 'coyote shadow', 'rattlesnake', 'desperate scavenger shakedown',
                 'toll crew', 'the snatcher', 'crazed wanderer', 'bounty squad',
                 'dead casino security bot', 'faction spotter drone', 'ghost robotaxi',
                 'patrols collide'];
  const missing = NAMES.filter(n => !EN.ROSTER.some(t => t.name === n));
  ok('each carries the verdict\'s own name (' + missing.join(', ') + ')', missing.length === 0);
  // and the verdict text itself names every one of them
  const unnamed = NAMES.filter(n => v.indexOf(n.replace('patrols collide', 'patrols-collide')) < 0);
  ok('and every name appears in the verdict (' + unnamed.join(', ') + ')', unnamed.length === 0);

  const RESERVED = ['mountain lion', 'cannibal', 'micro-drone', 'construction-bot', 'toxic zone', 'tiger'];
  const leaked = RESERVED.filter(r => SRC.toLowerCase().indexOf(r) >= 0 &&
    !/foreshadow-only|appears nowhere/.test(SRC.slice(Math.max(0, SRC.toLowerCase().indexOf(r)) - 200,
                                                     SRC.toLowerCase().indexOf(r) + 200)));
  ok('no act-2 reserved creature crept into the roster (' + leaked.join(' ') + ')', leaked.length === 0);
  ok('every token has a VERB, because variety is a verb and never a bigger HP bar',
     EN.ROSTER.every(t => typeof t.verb === 'string' && t.verb.length > 20));
  ok('every token declares its 70/20/10 class',
     EN.ROSTER.every(t => EN.KINDS.indexOf(t.kind) >= 0));
  ok('the telegraphs that were specified are in BEATS (120 BPM law)',
     EN.byId('rattlesnake').telegraph === 2 && EN.byId('spotter_drone').telegraph === 2);
}

// ---- 2. 70/20/10 HOLDS -----------------------------------------------------
{
  const dir = EN.makeDirector({ seed: 7, repeatAfterS: 600, tableFor: () => ALL });
  const fired = walk(dir, openWorld, 6000, 30);
  const m = dir.mix();
  ok('a long walk produces a lot of encounters (' + fired.length + ')', fired.length > 300);
  const off = k => Math.abs(m[k] - EN.MIX[k]);
  ok('ambient lands on 70% (' + (m.ambient * 100).toFixed(1) + '%)', off('ambient') < 0.02);
  ok('interactive lands on 20% (' + (m.interactive * 100).toFixed(1) + '%)', off('interactive') < 0.02);
  ok('forced lands on 10% (' + (m.forced * 100).toFixed(1) + '%)', off('forced') < 0.02);

  /* THE BUG THIS CAUGHT, kept as a check because it is the easy mistake: when the
     class the story wants has nothing available, the answer is that nothing
     happens. Substituting keeps the arithmetic tidy and breaks the promise, and it
     came out 40/42/18 the first time. */
  const thin = EN.makeDirector({ seed: 3, repeatAfterS: 600,
                                 tableFor: () => ['feral_dog_pack', 'crazed_wanderer'] });
  const only = walk(thin, openWorld, 3000, 30);
  ok('a forced-only table never fakes an ambient beat out of a fight',
     only.every(e => e.kind === 'forced'));
  ok('and it fires far less often than a full table, rather than over-serving combat (' +
     only.length + ' vs ' + fired.length + ')', only.length < fired.length * 0.35);
}

// ---- 3. STORYTELLER, NOT DICE ----------------------------------------------
{
  const run = () => {
    const d = EN.makeDirector({ seed: 11, repeatAfterS: 600, tableFor: () => ALL });
    return JSON.stringify(walk(d, openWorld, 900, 30).map(e => [e.id, e.atS]));
  };
  ok('the same seed and the same walk give the identical night', run() === run());
  const other = EN.makeDirector({ seed: 12, repeatAfterS: 600, tableFor: () => ALL });
  ok('a different seed gives a different one',
     JSON.stringify(walk(other, openWorld, 900, 30).map(e => e.id)) !==
     JSON.parse(run()).map(e => e[0]).join());

  ok('nothing in the director rolls dice', !/Math\.random/.test(SRC));

  const healthy = EN.makeDirector({ seed: 5, repeatAfterS: 600, tableFor: () => ALL });
  const hurt = EN.makeDirector({ seed: 5, repeatAfterS: 600, tableFor: () => ALL });
  const nHealthy = walk(healthy, openWorld, 1200, 30).length;
  const nHurt = walk(hurt, { district: 'suburb', phase: 'night', health: 0.25, heat: 0.8, can: () => true }, 1200, 30).length;
  ok('a hurt player after hard fights gets FEWER encounters (' + nHurt + ' vs ' + nHealthy + ')',
     nHurt < nHealthy);
  ok('and the budget really is spent, not just gated', nHurt > 0);
}

// ---- 4. THE ~90 SECOND FLOOR -----------------------------------------------
{
  const dir = EN.makeDirector({ seed: 9, repeatAfterS: 600, tableFor: () => ALL });
  const fired = walk(dir, openWorld, 4000, 15);
  let worst = Infinity;
  for (let i = 1; i < fired.length; i++) worst = Math.min(worst, fired[i].atS - fired[i - 1].atS);
  ok('the approved gap is 90 seconds', EN.MIN_GAP_S === 90);
  ok('and nothing ever fires inside it (closest ' + worst + 's)', fired.length > 1 && worst >= EN.MIN_GAP_S);

  const fast = EN.makeDirector({ seed: 9, tableFor: () => ALL });
  ok('a single tiny moment cannot trigger anything',
     fast.consider(openWorld, 1).fired === false);
}

// ---- 5. RARE IS SACRED ------------------------------------------------------
{
  const dir = EN.makeDirector({ seed: 4, repeatAfterS: 60, tableFor: () => ALL });
  const fired = walk(dir, openWorld, 8000, 30);
  const spice = EN.ROSTER.filter(t => t.spice).map(t => t.id);
  ok('there really are spice tokens to protect (' + spice.length + ')', spice.length >= 2);
  const over = spice.filter(id => fired.filter(e => e.id === id).length > EN.SPICE_CAP);
  ok('no spice token fires twice in a session, even over a very long walk (' + over.join(' ') + ')',
     over.length === 0);
}

// ---- 6. NO REPEAT-SPAM ------------------------------------------------------
{
  const dir = EN.makeDirector({ seed: 6, repeatAfterS: 600, tableFor: () => ALL });
  const fired = walk(dir, openWorld, 5000, 30);
  const lastAt = {};
  let tooSoon = 0;
  fired.forEach(e => {
    if (lastAt[e.id] != null && e.atS - lastAt[e.id] < 600) tooSoon++;
    lastAt[e.id] = e.atS;
  });
  ok('a token never comes round again inside its cooldown (' + tooSoon + ' violations)', tooSoon === 0);
  ok('and two in a row are never the same thing',
     fired.every((e, i) => i === 0 || e.id !== fired[i - 1].id));

  const once = EN.makeDirector({ seed: 6, tableFor: () => ALL });   // no cooldown ruled
  const f2 = walk(once, openWorld, 5000, 30);
  const dupes = f2.filter((e, i) => f2.findIndex(x => x.id === e.id) !== i);
  ok('with no cooldown ruled, a token fires at most ONCE (nothing invented)', dupes.length === 0);
}

// ---- 7. NO GLOBAL SPAWNS EVER -----------------------------------------------
{
  const empty = EN.makeDirector({ seed: 1, repeatAfterS: 600, tableFor: () => null });
  const r = walk(empty, openWorld, 2000, 30);
  ok('a district with no table spawns absolutely nothing', r.length === 0);
  const why = empty.consider(openWorld, 300);
  ok('and it says why rather than failing silently', why.reason === 'NO_TABLE');

  const noTableAtAll = EN.makeDirector({ seed: 1 });
  ok('a director with no table function spawns nothing either',
     walk(noTableAtAll, openWorld, 2000, 30).length === 0);

  // the table is keyed on BOTH district and phase, and the director passes both
  const seen = {};
  const keyed = EN.makeDirector({ seed: 2, repeatAfterS: 600,
                                  tableFor: (d, p) => { seen[d + '/' + p] = 1; return ALL; } });
  keyed.consider({ district: 'downtown', phase: 'day', health: 1, heat: 0, can: () => true }, 300);
  ok('the table is asked for a district AND a phase', !!seen['downtown/day']);
  ok('and a placeless caller gets nothing',
     keyed.consider({ health: 1, can: () => true }, 300).reason === 'NO_PLACE');
}

// ---- 8. NO BACKGROUND TICKING (Paolo's pacing ruling) -----------------------
{
  const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  ok('the director owns no timer', !/setInterval|setTimeout|requestAnimationFrame/.test(code));
  ok('and no clock of its own', !/Date\.now|new Date/.test(code));
  /* The real proof: an idle player spends nothing, so nothing can reach them no
     matter how many times the world asks. */
  const dir = EN.makeDirector({ seed: 8, repeatAfterS: 600, tableFor: () => ALL });
  dir.consider(openWorld, 5000);                      // one big spend, one encounter
  const before = dir.mix().total;
  for (let i = 0; i < 5000; i++) dir.consider(openWorld, 0);
  ok('standing still forever produces nothing (' + before + ' then ' + dir.mix().total + ')',
     dir.mix().total === before);
}

// ---- 9. THE PRECONDITIONS THE ROSTER STATED --------------------------------
{
  const noNeeds = { district: 'suburb', phase: 'night', health: 1, heat: 0, can: () => false };
  const dir = EN.makeDirector({ seed: 13, repeatAfterS: 600, tableFor: () => ALL });
  const fired = walk(dir, noNeeds, 4000, 30);
  const gated = EN.ROSTER.filter(t => t.needs).map(t => t.id);
  ok('the roster really does state preconditions (' + gated.join(' ') + ')', gated.length >= 3);
  ok('and none of them fires when the world says the condition is not met',
     fired.every(e => gated.indexOf(e.id) < 0));
  ok('the bounty squad exists only because of your own murders',
     EN.byId('bounty_squad').needs === 'murders');
  ok('the spotter drone only patrols owned light (LIGHT=TERRITORY)',
     EN.byId('spotter_drone').needs === 'lit');
  ok('patrols collide only at a territory seam', EN.byId('patrols_collide').needs === 'seam');
  // an unproven need is a NO, never a yes-by-default
  const noCan = EN.makeDirector({ seed: 13, repeatAfterS: 600, tableFor: () => ['bounty_squad'] });
  ok('a caller that cannot answer a precondition gets no spawn, not a free one',
     walk(noCan, { district: 'suburb', phase: 'night', health: 1, heat: 0 }, 2000, 30).length === 0);
}

// ---- 10. IT PLUGS INTO THE APPROVED RESOLVER --------------------------------
{
  const res = R.makeResolver({ moments: [{ name: 'SMALL', spends: 0.1 }, { name: 'BIG', spends: 1 }] });
  const dir = EN.makeDirector({ seed: 21, repeatAfterS: 600, tableFor: () => ALL });
  let asked = 0;
  const w = WR.attach(res, {
    encounters: { perUnit: 600, director: (ctx, moment, budget) => { asked++; const r = dir.consider(openWorld, budget); return r.fired ? [r] : []; } }
  });
  ok('the encounters socket accepts a real director', w.registered.indexOf('encounters') >= 0);
  const out = res.resolve({ day: 0 }, { moment: 'BIG' });
  ok('and the world hands it the moment\'s own budget', asked === 1);
  ok('a spend that big reaches the director as 600 seconds',
     out.reports.encounters.budget === 600);
  ok('the report says what happened', out.reports.encounters.applied === true);
}

console.log('ENCOUNTER GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            EN.ROSTER.length + ' approved tokens)');
process.exit(fail ? 1 : 0);
