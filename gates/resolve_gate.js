/* ============================================================================
   RESOLVE GATE (7/26/26) — the first port out of the reference lab, locked.

   engine/bohemia_resolve.js carries four mechanisms learned by rebuilding
   Stardew's fishing, farming and marriage from its own source and standing them
   in one walkable world. A ported mechanism with no gate is a mechanism that
   quietly rots back into whatever it replaced, so this file holds the exact
   properties that made each one worth porting:

     RESOLVE  one moment, declared order, and NO system able to see another.
              A step that throws must not eat the player's night.
     RATION   a limit by COUNT, per day and per week, with a bypass that
              overrides both. The third gift of a week is refused no matter how
              rich you are, because there is no price in it at all.
     CEILING  points cannot pass the CURRENT state's cap, and the ONLY thing
              that moves the cap is a state change. Grinding cannot skip a beat.
     REACH    one declared number, one facing rule, one predicate.

   AND THE LAW THAT KEEPS IT HONEST: this module is MECHANISM ONLY. The gate
   fails if it ever ships a default limit, threshold, cost or reach number for a
   real Bohemia system — that is content, and content is Paolo's.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const R = require(path.join(ROOT, 'engine/bohemia_resolve.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const throws = (fn) => { try { fn(); return false; } catch (e) { return true; } };

console.log('='.repeat(74));
console.log('RESOLVE GATE — the lab port: one moment, rationing, moving ceilings, reach');
console.log('='.repeat(74));

/* ==========================================================================
   1. RESOLVE — one moment, declared order, zero coupling
   ========================================================================== */
(function () {
  const r = R.makeResolver();
  const seen = [];
  r.register('feed', 'FEED', () => { seen.push('feed'); return { posts: 1 }; });
  r.register('crops', 'PLACES', () => { seen.push('crops'); return { grew: 2, stalled: 1 }; });
  r.register('weather', 'WORLD', () => { seen.push('weather'); return { rain: false }; });
  r.register('people', 'PEOPLE', () => { seen.push('people'); return { decayed: 3 }; });

  const out = r.resolve({ day: 4 }, { moment: 'NIGHT' });
  ok('R1 the order is the DECLARED phase order, not registration order',
     out.order.join(',') === 'weather,crops,people,feed');
  ok('R2 every step ran once (' + seen.length + ')', seen.length === 4);
  ok('R3 each step reported under its own name',
     out.reports.crops.grew === 2 && out.reports.people.decayed === 3);
  ok('R4 the moment is named', out.moment === 'NIGHT');
  ok('R5 nothing failed', out.ok === true && out.failures.length === 0);

  /* zero coupling, enforced two ways */
  const r2 = R.makeResolver();
  let sawOther = 'unset';
  r2.register('first', 'WORLD', () => ({ secret: 42 }));
  r2.register('second', 'WORLD', (ctx) => { sawOther = ctx.reports ? 'LEAKED' : 'no'; return null; });
  r2.resolve({ day: 1 });
  ok('R6 a step CANNOT see another step\'s report', sawOther === 'no');

  const r3 = R.makeResolver();
  let regFailed = false;
  r3.register('sneaky', 'WORLD', () => {
    try { r3.register('late', 'FEED', () => null); } catch (e) { regFailed = true; }
    return null;
  });
  r3.resolve({});
  ok('R7 a step CANNOT register another step mid-resolve', regFailed === true);

  /* one bad system must never eat the night */
  const r4 = R.makeResolver();
  const ran = [];
  r4.register('a', 'WORLD', () => { ran.push('a'); return 1; });
  r4.register('boom', 'PLACES', () => { throw new Error('territory sim exploded'); });
  r4.register('z', 'FEED', () => { ran.push('z'); return 1; });
  const out4 = r4.resolve({});
  ok('R8 a thrown step does not stop the moment', ran.join(',') === 'a,z');
  ok('R9 and the failure is reported BY NAME, not swallowed',
     out4.ok === false && out4.failures.length === 1 && out4.failures[0].step === 'boom');
  ok('R10 the broken step still gets a null report slot', out4.reports.boom === null);

  /* the guardrails */
  ok('R11 an unknown phase is a build error', throws(() => R.makeResolver().register('x', 'WHENEVER', () => null)));
  ok('R12 a duplicate step name is a build error', throws(() => {
    const q = R.makeResolver(); q.register('dup', 'WORLD', () => null); q.register('dup', 'FEED', () => null);
  }));
  ok('R13 a step with no function is a build error', throws(() => R.makeResolver().register('x', 'WORLD', null)));
  ok('R14 resolving inside a resolve is refused', (function () {
    const q = R.makeResolver(); let caught = false;
    q.register('re', 'WORLD', () => { try { q.resolve({}); } catch (e) { caught = true; } return null; });
    q.resolve({}); return caught;
  })());
})();

/* ==========================================================================
   1b. THE MOMENT IS ANY SPENT BLOCK, NOT JUST SLEEP
   Paolo 7/26, the same turn the port shipped: "sleep can be hangout or eat too
   u know". Law: laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md
   A night, a hangout and a meal are ONE mechanism at three sizes. The names and
   the sizes are canon and therefore his, so the module ships none of them and
   these are a TEST FIXTURE.
   ========================================================================== */
(function () {
  const MOMENTS = [{ name: 'SLEEP', spends: 600 }, { name: 'HANGOUT', spends: 120 }, { name: 'EAT', spends: 30 }];
  const r = R.makeResolver({ moments: MOMENTS });
  const ran = [];
  /* a system declares WHICH moments it answers */
  r.register('crops',  'PLACES', (ctx, m) => { ran.push('crops@' + m.name); return { spent: m.spends }; }, { moments: ['SLEEP'] });
  r.register('bonds',  'PEOPLE', (ctx, m) => { ran.push('bonds@' + m.name); return null; }, { moments: ['SLEEP', 'HANGOUT'] });
  /* and a system that declares nothing answers every one of them */
  r.register('watchers', 'WORLD', (ctx, m) => { ran.push('watchers@' + m.name); return null; });

  ok('R60 the resolver knows its declared moments', r.moments.join(',') === 'SLEEP,HANGOUT,EAT');

  ran.length = 0;
  const eat = r.resolve({}, { moment: 'EAT' });
  ok('R61 a MEAL runs only what answers a meal (' + eat.order.join(',') + ')',
     eat.order.join(',') === 'watchers');
  ok('R62 and it carries the meal\'s size', eat.spends === 30);

  ran.length = 0;
  const hang = r.resolve({}, { moment: 'HANGOUT' });
  ok('R63 a HANGOUT moves more than a meal (' + hang.order.join(',') + ')',
     hang.order.join(',') === 'watchers,bonds');
  ok('R64 THE POINT — hanging out really moves the world, so it is a reason to hang out',
     hang.order.indexOf('bonds') >= 0 && hang.ok === true);

  ran.length = 0;
  const night = r.resolve({}, { moment: 'SLEEP' });
  ok('R65 a NIGHT moves everything (' + night.order.join(',') + ')',
     night.order.join(',') === 'watchers,crops,bonds');
  ok('R66 the size reaches the step that asked for it', night.reports.crops.spent === 600);
  ok('R67 the report names which moment it was', night.moment === 'SLEEP');

  /* the moment is its OWN argument, never smuggled through the shared context,
     so zero coupling survives the change */
  const probe = R.makeResolver({ moments: ['SLEEP'] });
  let leaked = 'unset';
  probe.register('probe', 'WORLD', (ctx, m) => { leaked = (ctx.moment !== undefined) ? 'LEAKED' : 'no'; return null; });
  probe.resolve({}, { moment: 'SLEEP' });
  ok('R68 the moment does not travel through the shared context', leaked === 'no');
  ok('R69 the moment handed to a step is frozen', (function () {
    const q = R.makeResolver({ moments: [{ name: 'SLEEP', spends: 600 }] });
    let mutated = false;
    q.register('m', 'WORLD', (ctx, m) => { try { m.spends = 1; } catch (e) {} mutated = (m.spends !== 600); return null; });
    q.resolve({}, { moment: 'SLEEP' });
    return mutated === false;
  })());

  /* a typo must not silently invent a fourth kind of night */
  ok('R70 resolving an undeclared moment is a build error', throws(() => r.resolve({}, { moment: 'NAP' })));
  ok('R71 subscribing to an undeclared moment is a build error',
     throws(() => R.makeResolver({ moments: ['SLEEP'] }).register('x', 'WORLD', () => null, { moments: ['BRUNCH'] })));
  ok('R72 with moments declared, resolving without naming one is a build error', throws(() => r.resolve({})));
  ok('R73 declaring an empty moment list is a build error', throws(() => R.makeResolver({ moments: [] })));
  ok('R74 a moment without a name is a build error', throws(() => R.makeResolver({ moments: [{ spends: 5 }] })));
  ok('R75 subscribing when nothing was declared is a build error',
     throws(() => R.makeResolver().register('x', 'WORLD', () => null, { moments: ['SLEEP'] })));

  /* MECHANISM-MINE: the module names no moment of its own */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_resolve.js'), 'utf8');
  const codeOnly = src.slice(src.indexOf('const BOH_RESOLVE'))
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  ok('R76 the module ships NO moment names — they are canon and they are his',
     !/\b(SLEEP|HANGOUT|EAT|NIGHT|MEAL|DINNER)\b/.test(codeOnly));
  ok('R77 and no moment sizes', !/spends\s*[:=]\s*[0-9]/.test(codeOnly));
})();

/* ==========================================================================
   2. RATION — count, never price
   ========================================================================== */
(function () {
  const gifts = R.makeRation({ perDay: 1, perWeek: 2 });
  const day1 = { day: 'd1', week: 'w1' };

  ok('R15 the first of the day is allowed', gifts.spend('emily', day1).allowed === true);
  ok('R16 the second the SAME day is refused', gifts.spend('emily', day1).reason === 'DAY_SPENT');
  const day2 = { day: 'd2', week: 'w1' };
  ok('R17 a new day frees the daily window', gifts.spend('emily', day2).allowed === true);
  const day3 = { day: 'd3', week: 'w1' };
  const third = gifts.spend('emily', day3);
  ok('R18 but the WEEKLY ration refuses the third (' + third.reason + ')', third.reason === 'WEEK_SPENT');
  const week2 = { day: 'd8', week: 'w2' };
  ok('R19 a new week frees it again', gifts.spend('emily', week2).allowed === true);

  ok('R20 the ration is PER KEY, so two people are two rations',
     gifts.spend('joel', week2).allowed === true);

  /* the birthday shape: bypasses BOTH windows and can carry a multiplier */
  const spent = R.makeRation({ perDay: 1, perWeek: 2 });
  spent.spend('emily', day1); spent.spend('emily', day2);
  const bday = spent.spend('emily', day3, { allow: true, multiplier: 8 });
  ok('R21 a bypass overrides both windows', bday.allowed === true && bday.reason === 'BYPASS');
  ok('R22 and can carry a multiplier the caller chose', bday.multiplier === 8);

  /* THE POINT: there is no price in it anywhere */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_resolve.js'), 'utf8');
  const rationBlock = src.slice(src.indexOf('function makeRation'), src.indexOf('3. CEILING'));
  ok('R23 the ration mechanism contains no money, cost or price term',
     !/\b(cost|price|gold|money|cash|afford)\b/i.test(rationBlock));

  ok('R24 check() does not spend', (function () {
    const q = R.makeRation({ perDay: 1 });
    q.check('a', day1); q.check('a', day1);
    return q.spend('a', day1).allowed === true;
  })());
  ok('R25 a missing window is unlimited, which is a real choice', (function () {
    const q = R.makeRation({ perWeek: 2 });
    return q.spend('a', day1).allowed && q.spend('a', day1).allowed && !q.spend('a', day1).allowed;
  })());
  ok('R26 a negative limit is a build error', throws(() => R.makeRation({ perDay: -1 })));
})();

/* ==========================================================================
   3. CEILING — only a commitment moves it
   ========================================================================== */
(function () {
  /* the caller's stages. These names and numbers are a TEST FIXTURE, not canon:
     the module ships none and the gate checks that below. */
  const standing = R.makeCeiling([
    { state: 'KNOWN',   ceiling: 2000, neglect: 2 },
    { state: 'SWORN',   ceiling: 2500, neglect: 8 },
    { state: 'BLOODED', ceiling: 3500, neglect: 20 }
  ]);

  ok('R27 the ceiling belongs to the current state', standing.ceilingFor('KNOWN') === 2000);

  /* THE WALL: 500 additions of +80 cannot pass it */
  let pts = 0;
  for (let i = 0; i < 500; i++) pts = standing.add('KNOWN', pts, 80).points;
  ok('R28 THE WALL — 500 favours cannot push past the current ceiling (' + pts + ')', pts === 2000);
  ok('R29 and the caller is told it was capped', standing.add('KNOWN', 2000, 80).capped === true);
  ok('R30 isWalled says so out loud', standing.isWalled('KNOWN', 2000) === true);

  /* the only way up */
  const notYet = standing.advance('KNOWN', 1999, { requiredPoints: 2000 });
  ok('R31 you cannot commit before you have earned it', notYet.moved === false && notYet.reason === 'NOT_EARNED');
  const moved = standing.advance('KNOWN', 2000, { requiredPoints: 2000 });
  ok('R32 the COMMITMENT is what moves the ceiling', moved.moved === true && moved.state === 'SWORN' && moved.ceiling === 2500);
  ok('R33 a refused commitment does not move it', standing.advance('KNOWN', 9999, { allow: false }).moved === false);
  ok('R34 past the wall, the new ceiling is real', standing.add('SWORN', 2000, 400).points === 2400);
  const last = standing.advance('BLOODED', 99999, {});
  ok('R35 the final stage has nowhere to go and says so', last.moved === false && last.reason === 'FINAL');

  /* neglect is allowed to grow with intimacy — the mechanism just carries it */
  ok('R36 neglect can scale with the state (2 -> 8 -> 20)',
     standing.neglectFor('KNOWN') === 2 && standing.neglectFor('SWORN') === 8 && standing.neglectFor('BLOODED') === 20);

  ok('R37 points never go negative', standing.add('KNOWN', 10, -500).points === 0);
  ok('R38 a ceiling that goes DOWN a stage is a build error', throws(() => R.makeCeiling([
    { state: 'A', ceiling: 100 }, { state: 'B', ceiling: 50 }
  ])));
  ok('R39 an unknown state is a build error', throws(() => standing.ceilingFor('NOPE')));
  ok('R40 no stages is a build error', throws(() => R.makeCeiling([])));
})();

/* ==========================================================================
   4. REACH — one declared number
   ========================================================================== */
(function () {
  ok('R41 reach must be DECLARED, not defaulted', throws(() => R.makeReach()));
  const reach = R.makeReach(1);
  ok('R42 the faced tile is always actionable',
     reach.canAct({ x: 5, y: 5 }, R.DIRS.UP, { x: 5, y: 4 }) === true);
  ok('R43 so is anything inside the declared slack',
     reach.canAct({ x: 5, y: 5 }, R.DIRS.UP, { x: 6, y: 5 }) === true);
  ok('R44 and nothing outside it is',
     reach.canAct({ x: 5, y: 5 }, R.DIRS.UP, { x: 7, y: 5 }) === false);
  ok('R45 all four facings resolve', (function () {
    const f = (d) => R.facingTile(5, 5, d);
    return f(0).y === 4 && f(1).x === 6 && f(2).y === 6 && f(3).x === 4;
  })());
  ok('R46 a bad facing is a build error', throws(() => R.facingTile(0, 0, 9)));
  ok('R47 reach 0 means the faced tile ONLY', (function () {
    const z = R.makeReach(0);
    return z.canAct({ x: 5, y: 5 }, R.DIRS.UP, { x: 5, y: 4 }) === true &&
           z.canAct({ x: 5, y: 5 }, R.DIRS.UP, { x: 6, y: 5 }) === false;
  })());
})();

/* ==========================================================================
   5. MECHANISM-MINE / CONTENTS-PAOLO'S — the module ships NO content
   ========================================================================== */
(function () {
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_resolve.js'), 'utf8');
  const body = src.slice(src.indexOf('const BOH_RESOLVE'));

  /* every constructor must REFUSE to invent the caller's numbers */
  const bare = R.makeRation({});
  ok('R48 no default ration limits are invented (both windows unlimited)',
     bare.limits.perDay === Infinity && bare.limits.perWeek === Infinity);
  ok('R49 no default stages exist', throws(() => R.makeCeiling()));
  ok('R50 no default reach exists', throws(() => R.makeReach()));

  /* no Bohemia content words anywhere in the mechanism */
  const CONTENT_WORDS = /\b(clout|faction|amalgamation|vegas|cartel|quest|heart|bouquet|pendant|marriage|crop|fish)\b/i;
  const codeOnly = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  ok('R51 the executable mechanism names no Bohemia or Stardew content',
     !CONTENT_WORDS.test(codeOnly));

  /* the phase list is structure, not content: no phase may be a system name */
  ok('R52 the declared phases are structural, not per-system',
     R.PHASES.every(p => !/quest|combat|clout|faction|crop|fish/i.test(p)));

  /* provenance: a ported mechanism says where it came from */
  ok('R53 every mechanism records what it was learned from',
     ['resolve', 'ration', 'ceiling', 'reach'].every(k => typeof R.LEARNED_FROM[k] === 'string' && R.LEARNED_FROM[k].length > 20));
  ok('R54 the module cites the lab records', /records\/lab\//.test(src));
  ok('R55 the module cites the law that let it be ported',
     /BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26\.md/.test(src));
  ok('R56 the law exists', fs.existsSync(path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md')));

  /* headless: no DOM, no engine dependency, so it cannot collide with a lane */
  ok('R57 headless — no DOM', !/\b(document|window|canvas|requestAnimationFrame)\b/.test(codeOnly));
  ok('R58 standalone — requires nothing', !/\brequire\s*\(/.test(codeOnly));
  ok('R59 it does not touch the alpha or any other engine module',
     !/BOHEMIA_ALPHA/.test(src) && !/bohemia_[a-z]+\.js/.test(codeOnly));
})();

console.log('='.repeat(74));
console.log('  RESOLVE GATE: ' + pass + ' pass / ' + fail + ' fail');
process.exit(fail ? 1 : 0);
