#!/usr/bin/env node
/* MANDATE GATE (8/11/26, WORLD lane) — territory, then the city's backing, then rule.
 *
 * LOCKED 6/30: laws/BOHEMIA_ADDENDUM_PERSISTENT_CONSEQUENCE_MAYOR_6_30_26.md
 *
 *   "the shining jewel is customizing the city in your friendly territory, and at some point
 *    you become mayor when you've done so much that damn near everyone loves you. The more
 *    the city backs you, the easier building becomes, even in areas whose local faction
 *    doesn't love you, because the whole city has your back."  -- Paolo
 *
 * WHAT THIS PROVES, and each one is either his ruling or a way this system rots:
 *
 *  1. THREE RUNGS, AND THE MIDDLE ONE ACTUALLY CHANGES WHAT YOU CAN DO. Territory means you
 *     build where you are loved; mandate means popular support OVERRIDES local resistance.
 *     If crossing the threshold does not open a cold district, the rung is decoration.
 *  2. THE THRESHOLD IS HIS NUMBER (~49% of factions FWU), used as given.
 *  3. THE RUNG IS DERIVED, NEVER STORED. This answers his own third pending -- "how losing
 *     faction favor can knock you back down a rung" -- without needing a ruling: ask again
 *     after you lose a faction and you are simply lower. A STORED rung would need a demotion
 *     rule and would sit high forever the first time somebody forgot to write one.
 *  4. MAYOR IS A PSEUDO-MAYOR, AND THE LORE DEPENDS ON IT. Core canon says formal government
 *     failed everywhere and is a cautionary tale; Texas tried to reconstitute one and that
 *     failure is told across all three acts; the word "mayor" appears NOWHERE in core canon.
 *     So nothing here may elect anybody or restore an office.
 *  5. THE MAYOR IS A SEAT, SO HE CAN BE KILLED. It hands succession a ROLE, which is what
 *     makes the top of the ladder part of the world rather than an achievement.
 *  6. PATROL IS THE FAUCET AND LOSING IT CLOSES THE FAUCET. Holding ground is a thing you
 *     keep paying for, and LIGHT = TERRITORY means an unlit district cannot be patrolled and
 *     therefore cannot pay.
 *  7. AND EVERY NUMBER HE HAS NOT RULED IS REFUSED BY NAME. A cost multiplier invented here
 *     ships as canon nobody ruled. TWO ITEMS HAVE COME OFF THAT LIST AND THE GATE MOVED BOTH
 *     TIMES, because A GATE MUST NEVER OUTRANK A RULING (8/1): the tax rate, when he ruled
 *     EVERYTHING COSTS ONE on 8/15; and RUNG TWO'S GRANT on 9/6, when BB-THE-RUNG-PAYS found
 *     that his pending only blocked because everybody read "grant" as a NUMBER. His own list
 *     offers "cost multipliers? unlock tiers? restriction removal?" -- the third is a DOOR,
 *     already written in this module's header in his words, and a door is not a dial. So the
 *     assertion is no longer "the table is empty" but the thing actually forbidden: NOTHING
 *     IN THE TABLE IS A NUMBER, only rung two has an entry, and MAYOR still refuses by name.
 *
 *   node gates/mandate_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const M = require(path.join(ROOT, 'engine/bohemia_mandate.js'));
const S = require(path.join(ROOT, 'engine/bohemia_succession.js'));
const SRC = fs.readFileSync('engine/bohemia_mandate.js', 'utf8');
const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
/* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1 law). The banned
   governance words have to be checked against LOGIC, not prose: the module's own sentence
   saying it is "never a restored municipal office" is the law being OBEYED, and a checker
   that reads it as the violation would push us to delete the very line that proves it. So
   strip comments AND string bodies, and look at what the code actually does. */
const logic = code.replace(/'(?:\\.|[^'\\])*'/g, "''").replace(/"(?:\\.|[^"\\])*"/g, '""');

const facs = (n, total) => Array.from({ length: total || 10 }, (_, i) => ({ fwu: i < n }));

// ---- 1 + 2: three rungs, and his threshold --------------------------------------------
ok('the ladder is THREE rungs (' + M.RUNGS.join(' -> ') + ')', M.RUNGS.length === 3);
ok('below his threshold you are on TERRITORY', M.rungOf(facs(4)) === M.TERRITORY);
ok('crossing ~49% of factions FWU puts you on MANDATE (his number)',
   M.rungOf(facs(5)) === M.MANDATE && Math.abs(M.MANDATE_SHARE - 0.49) < 0.02);
ok('AND THE RUNG ACTUALLY CHANGES WHAT YOU CAN DO: on TERRITORY a cold district is closed',
   M.canBuild(facs(4), false).allowed === false);
ok('and on MANDATE the same cold district OPENS -- popular support overrides local ' +
   'resistance, which is the whole point of the rung',
   M.canBuild(facs(5), false).allowed === true);
ok('a friendly district was always open', M.canBuild(facs(1), true).allowed === true);

// ---- 3: derived, never stored ---------------------------------------------------------
{
  const before = M.rungOf(facs(6));
  const after = M.rungOf(facs(3));
  ok('LOSING FAVOUR KNOCKS YOU BACK DOWN BY CONSTRUCTION (his third pending, answered ' +
     'without needing a ruling)', before === M.MANDATE && after === M.TERRITORY);
  ok('and nothing stores a rung that could get stuck high',
     !/this\.rung\s*=|state\.rung\s*=|\.rung\s*=\s*(TERRITORY|MANDATE|MAYOR)/.test(code));
}

// ---- 4: pseudo-mayor, and the lore holds ----------------------------------------------
{
  ok('the top rung is UNREACHABLE until he rules a number, rather than guessed off a curve',
     M.MAYOR_SHARE === null && M.rungOf(facs(10)) !== M.MAYOR);
  ok('nothing here elects anybody or restores an office -- formal government failed ' +
     'everywhere and that is core canon',
     !/elect|ballot|vote|office|council|\bterm\b/i.test(logic));
  ok('and the module says out loud that this is a city-state strongman, not a restored ' +
     'municipal office', /pseudo-mayor/i.test(SRC) && /strongman/i.test(SRC));
}

// ---- 5: the mayor is a seat, so he can be killed ---------------------------------------
{
  const seat = M.mayorSeat();
  ok('it hands succession a ROLE, not a person', !!seat.role && !seat.who && !seat.name);
  const st = S.create({ day: 0 });
  S.seat(st, seat.role, seat);
  S.claim(st, seat.role, 'you', 9);
  S.tick(st, 999);
  ok('the seat can be held', st.seats[seat.role].holder === 'you');
  S.vacate(st, seat.role, 'assassinated');
  ok('AND THE MAYOR CAN BE KILLED, and the seat contests like any other -- the top of the ' +
     'ladder is part of the world, not an achievement',
     st.seats[seat.role].status === S.VACANT && st.seats[seat.role].holder === null);
}

// ---- 6: patrol is the faucet -----------------------------------------------------------
{
  const h = (over) => Object.assign({ id: 'd', type: 'x', yours: 1, lit: 1, patrolled: 1 }, over);
  const why = (over) => (M.income([h(over)]).unpaid[0] || {}).why || null;
  ok('a district you do not own pays nothing', /not yours/.test(why({ yours: 0 }) || ''));
  ok('LOSING THE PATROL CLOSES THE FAUCET, the same turn',
     /stopped patrolling/.test(why({ patrolled: 0 }) || ''));
  ok('and a DARK district cannot pay, because nobody patrols the dark (LIGHT = TERRITORY)',
     /dark/.test(why({ lit: 0 }) || ''));
  ok('there is no decay curve or grace period softening it -- holding ground costs ' +
     'something continuously', !/decay|grace|falloff/i.test(code));
  /* THERE IS NO MONEY IN THIS GAME (Paolo 7/26 LOCKED, and he had to say it again on 8/15:
     "how many steps I gotta tell you bro, read the lore"). A system that PAYS you every
     day is exactly where money vocabulary sneaks back in, so it is locked here at the
     source rather than caught later in shipped dialogue. */
  ok('what a district hands you is RESOURCES -- one of his three ruled balances, never a ' +
     'fourth thing invented here',
     ['resources', 'electricity', 'clout'].indexOf(M.PAYS_IN) >= 0);
  ok('and every payment says so, so nothing downstream has to guess what the number is',
     M.income([{ id: 'a', type: 'x', yours: 1, lit: 1, patrolled: 1 }]).paid[0].currency
       === M.PAYS_IN);
  ok('THERE IS NO MONEY IN THIS GAME, and the daily-payout system cannot be where it ' +
     'creeps back in', !/\b(money|coin|cash|dollar|rent|wage|salary)\b/i.test(logic));
}

// ---- 7: every unruled number refuses by name -------------------------------------------
{
  /* GRANTS WAS THIS GATE'S FIFTH REFUSAL UNTIL BB-THE-RUNG-PAYS RESOLVED HALF OF IT ON
     9/6, AND A GATE MUST NEVER OUTRANK A RULING (8/1). His pending offers three shapes --
     "cost multipliers? unlock tiers? restriction removal?" -- and the row's whole finding is
     that TWO of them are numbers he has not ruled and the THIRD IS A DOOR, already written
     in this module's own header in his own words. So the assertion moves from "the table is
     empty" to the thing that was actually forbidden: NO INVENTED NUMBER, and the rungs he
     has not ruled still refuse by name. */
  ok('RUNG TWO HAS ITS GRANT and it is a DOOR, not a dial -- nothing in it scales anything',
     M.GRANTS.MANDATE && M.GRANTS.MANDATE.dial === false
     && M.GRANTS.MANDATE.grant === 'build:anywhere');
  ok('and it cites his own addendum rather than inventing a source',
     /MAYOR_6_30_26/.test((M.GRANTS.MANDATE || {}).source || ''));
  ok('NOTHING IN THE TABLE IS A NUMBER -- a multiplier here would be canon nobody ruled',
     Object.keys(M.GRANTS).every(k => Object.keys(M.GRANTS[k]).every(
       f => typeof M.GRANTS[k][f] !== 'number')));
  ok('ONLY RUNG TWO GOT ONE -- the row said rung three stays his and must not block it',
     Object.keys(M.GRANTS).length === 1);
  const g = M.grantsAt(M.MAYOR);
  ok('and asking for the MAYOR grant still refuses out loud, naming the table and whose'
     + ' call it is',
     g.reason === M.NO_RULING && g.table === 'GRANTS' && /Paolo/.test(g.about || ''));
  /* THE RATE WAS THIS GATE'S FOURTH REFUSAL UNTIL HE RULED IT ON 8/15, and A GATE MUST
     NEVER OUTRANK A RULING (8/1): EVERYTHING COSTS ONE reaches "any future resource price
     anybody is tempted to invent", and a per-day take is a yield. So the assertion flips
     from "it refuses" to "it pays ONE, loudly" -- with his §4 refusal path intact. */
  const inc = M.income([{ id: 'a', type: 'commercial', yours: 1, lit: 1, patrolled: 1 }]);
  ok('a patrolled district PAYS, and it pays 1 -- his 8/15 ruling, not a number we picked',
     inc.total === 1 && inc.paid.length === 1 && inc.paid[0].amount === 1);
  ok('and the faucet is REALLY exercised rather than bypassed: three districts pay three',
     M.income([1, 2, 3].map(i => ({ id: 'd' + i, type: 'x', yours: 1, lit: 1, patrolled: 1 })))
      .total === 3);
  ok('his own override table is still EMPTY and still wins the day he names a rate',
     Object.keys(M.TAX_RATE).length === 0);
  ok('and §4 holds: something genuinely uncovered still refuses by name instead of ' +
     'defaulting to one',
     M.income([{ id: 'a', yours: 1, lit: 1, patrolled: 1 }]).reason === M.NO_RULING);
  const keys = M.pending().map(p => p.key);
  ok('and all four numbers are still NAMED, ruled or not (' + keys.join(', ') + ')',
     ['MANDATE_SHARE', 'MAYOR_SHARE', 'GRANTS', 'TAX_RATE'].every(k => keys.indexOf(k) >= 0));
  ok('with the rate marked RULED rather than pending, so nobody re-asks him for it',
     /8\/15/.test((M.pending().find(p => p.key === 'TAX_RATE') || {}).ruled || ''));
  ok('no cost multiplier was smuggled in as a "sensible default"',
     !/multiplier\s*[:=]\s*[\d.]/.test(code) && !/discount\s*[:=]\s*[\d.]/.test(code));
}

console.log('MANDATE GATE: ' + pass + ' passed, ' + fail + ' failed  (three rungs, his 49% ' +
            'opens a cold district, the rung is derived so favour loss demotes you, the ' +
            'mayor is a killable seat, a patrolled district pays his ONE, and every number ' +
            'he has NOT ruled still refuses by name)');
process.exit(fail ? 1 : 0);
