/* THE COMPANY INHERITS -- DYNASTY row [heirs], rule 39d (Paolo 9/28): "do the people you
   hire also belong to the dynasty each act? 36 instead of 12?" and his hole, "what
   happens if they die earlier in an earlier act... does that mean the one in the past
   doesn't and I just have to do some extra recruiting in the future".

   THE SHIP TEST IN ONE SENTENCE: each act starts with the heirs of the last act's
   company, derived from the ledger every time and never stored; a man who dies early in
   act 1 leaves no line in acts 2 and 3; a death in act 2 touches nothing in act 1; a
   change in the past re-derives who is there and never undoes what the future did.

   THE FIVE RULES OF THE LAW'S s12, EACH ONE A LEG BELOW:
     1 a death in act 1 removes that line from acts 2 and 3 (no kid, no heir)
     2 a death in act 2 or 3 touches nothing in the past
     3 a change in the past re-derives the roster and never un-does the future's deeds
     4 a man recruited later in act 1 appears as an heir on the next flip
     5 the main character never dies, so he is never in this at all

   WHAT THIS CANNOT PROVE, SAID PLAINLY: the walked game cannot kill anybody (down,
   not dead, a 9/11 law his 9/27 words replaced and nobody has built), has no hire day,
   no gear, and no family flag. So the death, day and family clauses are proved on the
   ledger's INPUT shape, and the glass proves the survivors' line off a REAL company the
   game itself wrote (a real job, finished, its own bond fired). Nothing is faked on the
   glass except the one call nothing in the game makes yet, a death, and that is said. */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(ROOT + '/tools/bohemia_drive_the_demo.js');
const H = require(ROOT + '/engine/bohemia_heirs.js');
const A = require(ROOT + '/engine/bohemia_acts.js');
const P = require(ROOT + '/engine/bohemia_people.js');
let pass = 0, fail = 0;
const ok = (what, cond) => { if (cond) { pass++; } else { fail++; console.log('  > FAIL ' + what); } };
const done = () => { console.log('HEIRS GATE: ' + pass + ' passed, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const J = (x) => JSON.stringify(x);
const deepFreeze = (o) => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o);
  Object.keys(o).forEach(k => deepFreeze(o[k])); } return o; };

/* a company in act 1: the kinds of man the walked game really produces */
const company = () => [
  { key: 'P:city:1', name: 'Estella Gaines', role: 'lineman', look: 11, strength: 15,
    was: { id: 'nurse', keeps: 'CAN KEEP SOMEBODY ALIVE' }, traits: ['steady'], gear: ['pipe wrench'] },
  { key: 'P:city:2', name: 'Lourdes Park', look: 22, strength: 8, was: { id: 'dealer', keeps: null } },
  { key: 'P:city:3', name: null, look: 33, strength: 3, was: { id: 'driver', keeps: 'KNOWS EVERY ROAD IN THE VALLEY' } },
  { key: 'P:city:4', name: 'Amos Ellison', look: 44, strength: 5 }
];
const ledger = (members) => { const l = H.fresh(); l.acts[1].members = members || company(); return l; };

/* THE FIRST SECTIONS TEST THE LINES, SO EVERY LINE CARRIES (carryShare 1). His 10/2 ruling, that
   about 42% carry, is section 1b, and the glass uses the shipped default. */
const SHIPPED_SHARE = H.ROWS.carryShare;
H.ROWS.carryShare = 1;
/* ---- 1. THE MECHANISM, WITHOUT A BROWSER -------------------------------- */
{
  const l = ledger();
  const r = H.heirs(l, 2);
  ok('every man who survived act 1 has an heir in act 2 (4 of 4)', r.heirs.length === 4 && r.gone.length === 0);
  ok('each heir says whose line they are: the parents are exactly the company, and a line starts at the man',
     r.heirs.map(h => h.parent).sort().join() === company().map(m => m.key).sort().join()
     && r.heirs.every(h => h.line[0] === h.parent && h.line.length === 2 && h.key === 'H2:' + h.parent));
  ok('heirs arrive 15 to 35 years old', r.heirs.every(h => h.age >= 15 && h.age <= 35));
  ok('a name that REMEMBERS them: the parent\'s surname rides down (Gaines, Park, Ellison)',
     r.heirs.filter(h => h.carriesName).map(h => h.name.split(' ').pop()).sort().join() === 'Ellison,Gaines,Park');
  ok('...and the given name is the heir\'s own, from the city\'s own bank',
     r.heirs.filter(h => h.carriesName).every(h => P.GIVEN.indexOf(h.name.split(' ')[0]) >= 0));
  const noName = r.heirs.find(h => h.parent === 'P:city:3');
  ok('a parent you never asked leaves no name to carry: the heir has a whole bank name and says so',
     !!noName && noName.carriesName === false && noName.name.split(' ').length === 2);
  const est = r.heirs.find(h => h.parent === 'P:city:1');
  const allT = ['steady', 'CAN KEEP SOMEBODY ALIVE'];
  ok('an heir carries about half the parent\'s traits and nothing the parent did not have',
     est.traits.length === 1 && est.traits.every(t => allT.indexOf(t) >= 0));
  ok('a trade that died keeps nothing, so its heir inherits no trade (dealer: [])',
     r.heirs.find(h => h.parent === 'P:city:2').traits.length === 0);
  ok('the family\'s gear stays in the family (37g)', J(est.gear) === J(['pipe wrench']) && est.gear !== company()[0].gear);
  ok('PORTRAIT\'s heredity gets the parent\'s look to descend from', est.lookFrom === 11 && typeof est.lookSeed === 'number');
  ok('an heir starts with half what the parent had earned', est.strength === 7.5);

  /* PURE: same ledger, same answer, in any order, and nothing mutated */
  const rev = ledger(company().reverse());
  ok('the same company in a different order derives the same heirs',
     J(H.heirs(rev, 2).heirs.slice().sort((a, b) => a.key < b.key ? -1 : 1)) === J(r.heirs.slice().sort((a, b) => a.key < b.key ? -1 : 1)));
  ok('deriving twice gives the identical answer (a reload cannot change who they are)', J(H.heirs(l, 2)) === J(H.heirs(l, 2)));
  const frozen = deepFreeze(ledger());
  let threw = false; try { H.heirs(frozen, 3); H.roster(frozen, 3); H.orphans(frozen, 2); } catch (_e) { threw = true; }
  ok('the derive never writes to the ledger it reads (a frozen ledger derives all three acts)', threw === false);

  /* THREE GENERATIONS */
  const g3 = H.heirs(l, 3).heirs;
  ok('act 3 has an heir of every act-2 heir (4 of 4), so the company is a line of THREE', g3.length === 4);
  ok('the third carries the first\'s surname and a line of three keys',
     g3.filter(h => h.line[0] !== 'P:city:3').map(h => h.name.split(' ').pop()).sort().join() === 'Ellison,Gaines,Park'
     && g3.every(h => h.line.length === 3 && h.line[0].indexOf('P:city:') === 0));
  ok('...and the line of a man nobody asked carries the name his HEIR was given, so a name once made is kept',
     g3.find(h => h.line[0] === 'P:city:3').name.split(' ').pop() === H.heirs(l, 2).heirs.find(h => h.parent === 'P:city:3').name.split(' ').pop());
  ok('the third descends from the SECOND\'s look, not the first\'s',
     g3.find(h => h.line[0] === 'P:city:1').lookFrom === H.heirs(l, 2).heirs.find(h => h.parent === 'P:city:1').lookSeed);
}

/* ---- 1b. ABOUT 42% CARRY (Paolo 10/2, rule 67) ------------------------------ */
{
  H.ROWS.carryShare = SHIPPED_SHARE;
  ok('the shipped share is his 42%', SHIPPED_SHARE === 0.42);
  const l = ledger();
  const r = H.heirs(l, 2);
  ok('of four lines, ceil(1.68) = 2 carry, and two are left behind', r.heirs.length === 2 && r.left.length === 2 && r.left.every(x => x.why === 'LEFT_BEHIND'));
  ok('the STRONGEST carry (Estella 15, Lourdes 8); the weakest are left (Amos 5, the driver 3)',
     r.heirs.map(h => h.parent).sort().join() === 'P:city:1,P:city:2' && r.left.map(x => x.key).sort().join() === 'P:city:3,P:city:4');
  ok('a one-man company still carries him (a share never ends the dynasty)', H.heirs(ledger([company()[1]]), 2).heirs.length === 1);
  ok('nobody qualifying carries nobody, and does not throw', H.heirs(ledger([]), 2).heirs.length === 0);
  const big = []; for (let i = 0; i < 12; i++) big.push({ key: 'P:b:' + i, name: 'Mia Cole' + i, look: i, strength: i });
  ok('twelve lines: ceil(5.04) = 6 carry', H.heirs(ledger(big), 2).heirs.length === 6);
  ok('the share is a row: 1 carries everybody, 0.1 carries one of four',
     H.heirs(l, 2, { rows: Object.assign({}, H.ROWS, { carryShare: 1 }) }).heirs.length === 4 && H.heirs(l, 2, { rows: Object.assign({}, H.ROWS, { carryShare: 0.1 }) }).heirs.length === 1);
  ok('the left-behind man is still on the act 1 roster (the past is untouched)', H.roster(l, 1).length === 4);
  H.ROWS.carryShare = 1;
  /* OLDER OR YOUNGER */
  A.resetAll(); A.unlock(2);
  ok('act 2 arrives YOUNGER by default and the row says so', A.visible('1')[1].age === 'younger');
  ok('older is a choice while the window is open', A.setAge(2, 'older').ok === true && A.visible('1')[1].age === 'older');
  ok('a bad age is refused and leaves the choice standing', A.setAge(2, 'ancient').ok === false && A.visible('1')[1].age === 'older');
  ok('the START lets him pick older or younger too (his 10/2 words), the face maker\'s window', A.setAge(1, 'older').ok === true && A.visible('1')[0].age === 'older');
  ok('the choice survives save and load', (() => { const b = A.save(); A.resetAll(); A.load(b); return A.visible('1')[1].age === 'older'; })());
  A.confirm(2);
  ok('once he leaves or presses OK the age is closed', A.setAge(2, 'younger').ok === false && A.setAge(2, 'younger').why === 'CLOSED');
  A.resetAll();
}

/* ---- 1c. WHAT OF A MAN PASSES (row [the company inherits]) ---------------------- */
{
  const man = { key: 'P:r:1', name: 'Dolores Vance', look: 3, strength: 9, level: 7, perks: ['a', 'b', 'c', 'd', 'e'], stars: { hp: 2, resolve: 1 },
    stats: { hp: 62, melee_skill: 55 }, injured: 'leg', age: 52, house: 'the Vance place', debt: 10,
    gear: { main: { n: 'pipe' }, off: null, body: { n: 'vest' }, head: null } };
  const l = ledger([man]); const h2 = H.heirs(l, 2).heirs[0];
  ok('level: half the parent\'s, rounded up (7 -> 4)', h2.level === 4);
  ok('perks: the first half in the order he took them (5 -> 2: a, b)', J(h2.perks) === J(['a', 'b']));
  ok('stars carry, the talent runs in the family', J(h2.stars) === J({ hp: 2, resolve: 1 }) && h2.stars !== man.stars);
  ok('gear stays in the family and a crew man\'s slots are flattened (2 items)', h2.gear.length === 2);
  ok('the house passes', h2.house === 'the Vance place');
  ok('a debt crosses at standing\'s own 0.45 (10 -> 4.5)', h2.debt === 4.5);
  ok('THE BODY NEVER CARRIES: no stats, wound or age of the parent on the heir', h2.stats === undefined && h2.injured === undefined && h2.age >= 15 && h2.age <= 35);
  const g3 = H.heirs(l, 3).heirs[0];
  ok('the grandchild compounds it: level 7 -> 4 -> 2 (a quarter), perks 2 -> 1', g3.level === 2 && J(g3.perks) === J(['a']) && g3.debt === 2.03);
  ok('a level-1 man still has a level-1 heir', H.heirs(ledger([{ key: 'x', name: 'A B', level: 1 }]), 2).heirs[0].level === 1);
  ok('a man with none of these fields still derives (the old shape holds)', H.heirs(ledger(), 2).heirs.every(h => h.level === 1 && h.perks.length === 0 && h.debt === 0 && h.house === null));
}

/* ---- 2. THE FIVE RULES OF s12 -------------------------------------------- */
{
  /* 1. a death in act 1 removes the line from acts 2 and 3 */
  const l = ledger();
  H.died(l, 1, 'P:city:3', 8);                                   /* died after 8 days: no life yet */
  ok('RULE 1: a man who dies early in act 1 leaves NO heir in act 2',
     !H.heirs(l, 2).heirs.some(h => h.parent === 'P:city:3') && H.heirs(l, 2).gone.some(g => g.key === 'P:city:3' && g.why === 'DIED_TOO_SOON'));
  ok('RULE 1: and none in act 3 either, the line is gone for good',
     !H.heirs(l, 3).heirs.some(h => h.line[0] === 'P:city:3') && H.heirs(l, 3).heirs.length === 3);
  ok('a man who died is still ON act 1\'s roster, marked, never hidden', (() => {
    const m = H.roster(l, 1).find(x => x.key === 'P:city:3'); return !!m && m.died.day === 8; })());

  /* ...unless he already had a kid */
  const l2 = ledger(); l2.acts[1].members[3].since = 20; H.died(l2, 1, 'P:city:4', 100);
  ok('a man who died after 60 days with the company HAD a life and leaves a kid (80 days)',
     H.heirs(l2, 2).heirs.some(h => h.parent === 'P:city:4' && h.why === 'LONG_ENOUGH' && h.kind === 'KID'));
  const l3 = ledger(); l3.acts[1].members[3].since = 20; H.died(l3, 1, 'P:city:4', 79);
  ok('...and 59 days is not enough (the threshold is a row, read, not a guess)', !H.heirs(l3, 2).heirs.some(h => h.parent === 'P:city:4'));
  const l4 = ledger(); l4.acts[1].members[2].family = true; H.died(l4, 1, 'P:city:3', 1);
  ok('a man who came with a family leaves an heir however soon (FAMILY)',
     H.heirs(l4, 2).heirs.some(h => h.parent === 'P:city:3' && h.why === 'FAMILY' && h.kind === 'KID'));
  ok('the threshold is a TUNING row: change it and the same ledger gives another answer',
     !H.heirs(l2, 2, { rows: Object.assign({}, H.ROWS, { daysWithCompany: 999 }) }).heirs.some(h => h.parent === 'P:city:4')
     && H.heirs(l3, 2, { rows: Object.assign({}, H.ROWS, { daysWithCompany: 10 }) }).heirs.some(h => h.parent === 'P:city:4'));

  /* 2. a death in act 2 touches nothing in the past */
  const m = ledger();
  const before1 = J(H.roster(m, 1)), beforeH2 = J(H.heirs(m, 2).heirs);
  const heirKey = H.heirs(m, 2).heirs.find(h => h.parent === 'P:city:1').key;
  H.died(m, 2, heirKey, 3);
  ok('RULE 2: a death in act 2 leaves act 1 EXACTLY as it was (byte for byte)', J(H.roster(m, 1)) === before1);
  ok('RULE 2: and act 2\'s own derivation is unchanged (he is marked fallen, not erased)',
     J(H.heirs(m, 2).heirs) === beforeH2 && !!H.roster(m, 2).find(x => x.key === heirKey).died);
  ok('RULE 2: act 3 loses that heir\'s line on the next flip forward',
     !H.heirs(m, 3).heirs.some(h => h.line[0] === 'P:city:1') && H.heirs(m, 3).heirs.length === 3);
  ok('...he is not the main man in act 2: the others still carry on (3 living in act 2)', H.living(H.roster(m, 2)).length === 3);
  const b3 = ledger(); const hk = H.heirs(b3, 2).heirs.find(h => h.parent === 'P:city:2').key;
  H.died(b3, 3, 'H3:' + hk, 4);
  ok('RULE 2: a death in act 3 touches neither act 1 nor act 2',
     J(H.roster(b3, 1)) === J(H.roster(ledger(), 1)) && J(H.roster(b3, 2)) === J(H.roster(ledger(), 2)));

  /* 3. a change in the past never un-does the future's deeds */
  const c = ledger();
  const kid = H.heirs(c, 2).heirs.find(h => h.parent === 'P:city:3').key;
  H.note(c, 2, kid, { deed: 'held the water plant', day: 12 });
  const act2Before = J(c.acts[2]);
  H.died(c, 1, 'P:city:3', 5);                                  /* he falls in the PAST, afterwards */
  ok('RULE 3: his heir no longer EXISTS in act 2 (the roster was re-derived)', !H.roster(c, 2).some(x => x.key === kid));
  ok('RULE 3: but what the heir DID is still on act 2\'s ledger, byte for byte (the past rewrites the world, never the hands)',
     J(c.acts[2]) === act2Before && c.acts[2].events[kid].deed === 'held the water plant');
  ok('RULE 3: and the ledger can say exactly what stayed done without a person (orphans)',
     H.orphans(c, 2).length === 1 && H.orphans(c, 2)[0].key === kid && H.orphans(c, 2)[0].event.deed === 'held the water plant');
  ok('RULE 3: a past change re-derives act 3 as well', H.heirs(c, 3).heirs.length === 3);
  /* and the deeds land on different ground: undo the past change and the person is back, deeds attached */
  const c2 = ledger(); const kid2 = H.heirs(c2, 2).heirs.find(h => h.parent === 'P:city:3').key;
  H.note(c2, 2, kid2, { deed: 'held the water plant' });
  ok('RULE 3: with the past as it was, the same deed is on the same person (re-applied on top)',
     H.roster(c2, 2).find(x => x.key === kid2).deed === 'held the water plant');

  /* 4. recruited later in act 1 */
  const r4 = ledger(); const before = H.heirs(r4, 2).heirs.length;
  r4.acts[1].members.push({ key: 'P:city:9', name: 'Rafael Soto', look: 99, strength: 6 });
  ok('RULE 4: a man recruited later in act 1 shows up as an heir on the next flip (' + before + ' -> '
     + H.heirs(r4, 2).heirs.length + ')', H.heirs(r4, 2).heirs.length === before + 1 && H.heirs(r4, 2).heirs.some(h => h.parent === 'P:city:9'));
  H.recruit(r4, 1, { key: 'P:city:10', name: 'Inez Vega', look: 100, strength: 1 });
  ok('RULE 4: a recruit the act\'s own ledger recorded counts the same way',
     H.heirs(r4, 2).heirs.some(h => h.parent === 'P:city:10'));

  /* 5. the main character is never in it */
  ok('RULE 5: the main character is never an heir, however the ledger is read',
     H.line({ key: 'me', main: true }).heir === false && H.line({ key: 'me', main: true, died: { day: 1 } }).why === 'THE_MAIN_LINE'
     && !H.heirs((() => { const x = ledger([{ key: 'me', main: true, name: 'Reyna Soto' }]); return x; })(), 2).heirs.length);
}

/* ---- 3. RECRUITS, THE CAP, AND THE LEDGER'S MANNERS ------------------------ */
{
  const l = ledger();
  H.recruit(l, 2, { key: 'R:2:1', name: 'Vera Holt', look: 5, strength: 4 });
  ok('recruiting inside act 2 stays an act-2 thing: it is on the roster and is not an heir',
     H.roster(l, 2).some(x => x.key === 'R:2:1' && !x.parent) && !H.heirs(l, 2).heirs.some(h => h.key === 'R:2:1'));
  ok('...and it has an heir in act 3 (a recruit is a line too)', H.heirs(l, 3).heirs.some(h => h.parent === 'R:2:1'));
  H.died(l, 2, 'R:2:1', 2);
  ok('...unless it fell in act 2 (that is act 2\'s own ledger)', !H.heirs(l, 3).heirs.some(h => h.parent === 'R:2:1'));
  ok('recruiting the same man twice is refused', H.recruit(l, 2, { key: 'R:2:1' }).ok === false && H.recruit(l, 2, { key: 'R:2:1' }).why === 'ALREADY');

  /* THE CAP: ~12 men an act */
  const big = []; for (let i = 0; i < 15; i++) big.push({ key: 'P:b:' + (100 + i), name: 'Mia Cole' + i, look: i, strength: i });
  const rb = H.heirs(ledger(big), 2);
  ok('fifteen lines, room for twelve: 12 heirs and 3 crowded out', rb.heirs.length === 12 && rb.crowded.length === 3);
  ok('the strongest lines get the room (the three weakest are the ones crowded out)',
     rb.crowded.map(c => c.key).sort().join() === ['P:b:100', 'P:b:101', 'P:b:102'].join());
  ok('the cut does not depend on the order he was listed in', J(H.heirs(ledger(big.slice().reverse()), 2).crowded.map(c => c.key).sort()) === J(rb.crowded.map(c => c.key).sort()));
  ok('the room is a TUNING row (perAct 2 gives 2)', H.heirs(ledger(big), 2, { rows: Object.assign({}, H.ROWS, { perAct: 2 }) }).heirs.length === 2);
  ok('three generations of twelve is thirty-six lives, and that is the shape the cap makes',
     H.heirs(ledger(big), 3).heirs.length === 12 && H.ROWS.perAct * 3 === 36);

  /* THE LEDGER'S MANNERS */
  ok('a death needs a real act and a real person', H.died(H.fresh(), 9, 'x', 1).ok === false && H.died(H.fresh(), 2, '', 1).ok === false);
  const dd = H.fresh(); H.died(dd, 2, 'x', 1);
  ok('a man cannot die twice', H.died(dd, 2, 'x', 9).ok === false && dd.acts[2].events.x.died.day === 1);
  ok('note() cannot write a death behind died()\'s back', (() => { const q = H.fresh(); H.note(q, 2, 'x', { died: { day: 1 }, deed: 'a' });
    return !q.acts[2].events.x.died && q.acts[2].events.x.deed === 'a'; })());
  ok('act 4 does not exist', H.heirs(ledger(), 4).heirs.length === 0 && H.roster(ledger(), 4).length === 0 && H.heirs(ledger(), 1).heirs.length === 0);
  ok('a null ledger derives nothing and does not throw', H.heirs(null, 2).heirs.length === 0 && H.roster(null, 2).length === 0);
}

/* ---- 4. THE SAVE ------------------------------------------------------------ */
{
  const l = ledger();
  H.died(l, 1, 'P:city:3', 5); H.note(l, 2, 'H2:P:city:1', { deed: 'x' }); H.recruit(l, 2, { key: 'R:2:1', name: 'Vera Holt' });
  const blob = H.save(l), back = H.load(JSON.parse(JSON.stringify(blob)));
  ok('the save round-trips the events and the recruits', J(back.acts[1].events) === J(l.acts[1].events)
     && J(back.acts[2].events) === J(l.acts[2].events) && back.acts[2].recruits.length === 1);
  ok('*** THE HEIRS ARE NOT IN THE SAVE: only what happened is ***',
     !/heirs/.test(J(blob)) && !/H2:P:city:2/.test(J(blob)) && !/age/.test(J(blob)));
  ok('a loaded ledger derives the same people as the one it came from (members handed in live)', (() => {
    back.acts[1].members = company(); return J(H.heirs(back, 2)) === J(H.heirs(l, 2)); })());
  ok('garbage loads as a fresh ledger, never a throw',
     J(H.load(null)) === J(H.fresh()) && J(H.load('x')) === J(H.fresh()) && J(H.load({ v: 2, acts: {} })) === J(H.fresh()));
  ok('a recruit with no key and an event that is not an object are dropped', (() => {
    const g = H.load({ v: 1, acts: { 2: { recruits: [{ name: 'no key' }, 5, null], events: { a: 7, b: { deed: 'ok' } } } } });
    return g.acts[2].recruits.length === 0 && !g.acts[2].events.a && g.acts[2].events.b.deed === 'ok'; })());
}

/* ---- 5. THE ENGINE IS THE COPY THE CITY CARRIES --------------------------- */
{
  const city = fs.readFileSync(ROOT + '/slices/BOHEMIA_CITY_WORLD.html', 'utf8');
  const a = city.indexOf('/* ==== engine/bohemia_heirs.js ==== */\n'), b = city.indexOf('/* ==== /engine/bohemia_heirs.js ==== */');
  ok('the city carries bohemia_heirs.js verbatim (ENGINE SYNC LAW)', a >= 0 && b > a
     && city.slice(a + '/* ==== engine/bohemia_heirs.js ==== */\n'.length, b) === fs.readFileSync(ROOT + '/engine/bohemia_heirs.js', 'utf8'));
  ok('and the engine reads no clock and no dice (Date, Math.random)', !/Date\.now|new Date|Math\.random/.test(fs.readFileSync(ROOT + '/engine/bohemia_heirs.js', 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')));
}

/* ---- 6. ON THE GLASS, WITH A REAL FINGER -------------------------------------- */
/* `--headless` skips the browser: it exists so the negative controls (sabotage the engine,
   see the gate go red) run in a second instead of a minute. The suite never passes it. */
if (process.argv.includes('--headless')) { console.log('  (headless: the glass legs were skipped on purpose)'); done(); }
(async () => {
  let d;
  try { d = await D.open({ alpha: true }); }
  catch (e) { ok('the one driver opens the alpha [' + e.message.slice(0, 70) + ']', false); done(); }
  const pg = d.page;
  let ready = false;
  for (let i = 0; i < 400 && !ready; i++) {
    ready = await pg.evaluate(() => !!window.__LOAD_READY).catch(() => false);
    if (!ready) await pg.waitForTimeout(400);
  }
  const front = await pg.evaluate(() => { const f = document.getElementById('front');
    if (!f) return null; const r = f.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (front) await pg.touchscreen.tap(front.x, front.y);
  await pg.waitForTimeout(1200);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('*')]
    .filter(e => e.children.length === 0 && (e.textContent || '').trim() === 'RUN');
    if (t[0]) t[0].click(); });
  await pg.waitForTimeout(1500);
  for (let i = 0; i < 4; i++) { await d.pinchOut(); await pg.waitForTimeout(450); }
  const fb = await (await d.fr.frameElement()).boundingBox();

  const row = () => d.fr.evaluate(() => {
    const box = document.getElementById('actheirs');
    if (!box) return { exists: false };
    const r = box.getBoundingClientRect();
    const chips = [...box.querySelectorAll('.hc')].map(c => { const q = c.getBoundingClientRect();
      return { t: c.textContent, k: c.getAttribute('data-heir'), x: q.x, y: q.y, w: q.width, h: q.height, r: q.right, b: q.bottom }; });
    return { exists: true, on: box.classList.contains('on'), label: (box.querySelector('.hl') || {}).textContent || '',
             chips, aria: box.getAttribute('aria-label') || '', x: r.x, y: r.y, w: r.width, h: r.height, b: r.bottom };
  });
  const rectOf = (sel, idx) => d.fr.evaluate((a) => {
    const els = document.querySelectorAll(a.sel); const e = els[a.idx == null ? 0 : a.idx];
    if (!e) return null; const r = e.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, top: r.top, bottom: r.bottom };
  }, { sel, idx });
  const tap = async (r) => { await pg.touchscreen.tap(fb.x + r.x, fb.y + r.y); await pg.waitForTimeout(700); };
  const coverAt = (r) => pg.evaluate((pt) => { const el = document.elementFromPoint(pt.x, pt.y); return el ? (el.id || el.tagName) : null; },
                                     { x: fb.x + r.x, y: fb.y + r.y });

  /* THE HONEST EMPTY STATE: a fresh game has no company, so it has no heirs */
  await d.fr.evaluate(() => { BohemiaActs.resetAll(); ACTFLIP_BUILT = ''; HEIR_LED = null; HEIR_SEEN.at = -1e9; ctActFlipPaint(); });
  const fresh = await d.fr.evaluate(() => ({ members: ctHeirMembers().length, heirs2: ctHeirRoster(2).length }));
  ok('a fresh game has no company (' + fresh.members + ') and so no heirs (' + fresh.heirs2 + '): nobody is invented', fresh.members === 0 && fresh.heirs2 === 0);
  await d.fr.evaluate(() => { ctActUnlock(2); });
  await pg.waitForTimeout(500);
  const t2e = await rectOf('#actflip .af', 1);
  await tap(t2e);
  const emptyRow = await row();
  ok('standing in act 2 with nobody to inherit shows NO heirs row (an empty row would be a card with nothing on it)',
     emptyRow.exists && emptyRow.on === false && emptyRow.chips.length === 0);

  /* A REAL COMPANY, WRITTEN BY THE GAME: take the day's job, finish it, its own bond fires */
  const live = await d.fr.evaluate(() => {
    const out = {};
    try { out.took = ctOfferAccept(); } catch (e) { out.err = String(e.message); }
    try {
      const ends = (DQ.Q.stages || []).filter(st => (st.flags || []).indexOf('COMPLETE') >= 0);
      if (ends.length) DQ.rt.setStage(ends[0].n);
      out.bonds = Object.keys(DQ.rt.state.bonds || {});
    } catch (e) { out.err2 = String(e.message); }
    HEIR_SEEN.at = -1e9;
    out.yours = (ctYours() || []).map(y => y.who);
    out.members = ctHeirMembers();
    return out;
  });
  ok('the game wrote a real company: a real job taken, finished, its own bond fired (' + (live.yours || []).length + ' of his people)',
     live.took === true && (live.bonds || []).length > 0 && (live.yours || []).length >= 1);
  ok('and the adapter hands the derive a PERSON, never a role (key, a looks seed, and a former trade)',
     (live.members || []).length >= 1 && live.members.every(m => /^P:/.test(m.key) && m.look != null && !!m.was));

  const heirs = await d.fr.evaluate(() => ctHeirs(2));
  ok('*** ACT 2 NOW HAS AN HEIR FOR EVERY ONE OF THEM (' + heirs.heirs.length + ' of ' + live.yours.length + ') ***',
     heirs.heirs.length === live.yours.length && heirs.heirs.every(h => h.age >= 15 && h.age <= 35 && /^H2:P:/.test(h.key)));
  const sameAsEngine = await d.fr.evaluate(() => JSON.stringify(ctHeirs(2)) === JSON.stringify(BohemiaHeirs.heirs(ctHeirLedger(), 2)));
  ok('the page\'s answer is the engine\'s answer, one derive and no second one', sameAsEngine);

  /* a real finger hops into act 2 and the row shows who is coming */
  await d.fr.evaluate(() => { ACTFLIP_BUILT = ''; HEIR_SEEN.at = -1e9; ctActFlipPaint(); });
  await pg.waitForTimeout(500);
  const hopped = await row();
  ok('*** THE PHONE SHOWS THE HEIRS WHEN HE STANDS IN ACT 2 *** (' + hopped.label + ': ' + hopped.chips.map(c => c.t).join(' | ') + ')',
     hopped.on === true && hopped.label === 'HEIRS' && hopped.chips.length === heirs.heirs.length);
  ok('each chip is a real heir: first name and age, exactly the derive\'s',
     heirs.heirs.every(h => hopped.chips.some(c => c.k === h.key && c.t === h.name.split(' ')[0] + ' ' + h.age)));
  ok('the row\'s own label says who they are for a screen reader', /heirs: /.test(hopped.aria) && heirs.heirs.every(h => hopped.aria.indexOf(h.name) >= 0));
  const strip = await rectOf('#actflip');
  ok('the row sits ABOVE the strip and never on it (rows ' + Math.round(hopped.b) + ' / strip ' + Math.round(strip.top) + ')', hopped.b <= strip.top + 0.5);
  ok('no two chips overlap each other',
     hopped.chips.every((a, i) => hopped.chips.every((b, j) => i === j || a.r <= b.x + 0.5 || b.r <= a.x + 0.5 || a.b <= b.y + 0.5 || b.b <= a.y + 0.5)));
  ok('nothing in the shell covers the row (' + await coverAt({ x: hopped.x + hopped.w / 2, y: hopped.y + hopped.h / 2 }) + ')',
     (await coverAt({ x: hopped.x + hopped.w / 2, y: hopped.y + hopped.h / 2 })) === 'cityFrame');
  ok('and no chip runs off the glass (rights within the phone\'s own width)',
     hopped.chips.every(c => c.r <= hopped.x + hopped.w + 0.5));

  /* act 1 has no heirs row: the heirs belong to the acts that come after */
  const t1 = await rectOf('#actflip .af', 0);
  await tap(t1);
  const act1Row = await row();
  ok('flipping back to act 1 takes the row away (the heirs are the later acts\')', act1Row.on === false);
  await tap(await rectOf('#actflip .af', 1));
  ok('...and flipping forward again re-derives it', (await row()).on === true);

  /* THE PAST COSTS THE FUTURE: a man falls early in act 1; his line is gone */
  const who = live.yours[0];
  const fell = await d.fr.evaluate((k) => ctHeirDied(1, k, 3), who);
  await pg.waitForTimeout(400);
  await d.fr.evaluate(() => { HEIR_SEEN.at = -1e9; ctActFlipPaint(); });
  const after = await row();
  const heirs2 = await d.fr.evaluate(() => ctHeirs(2));
  ok('ctHeirDied accepts a fall in act 1', fell === true);
  ok('*** HE FELL EARLY IN ACT 1 AND HIS LINE IS GONE FROM ACT 2: no heir, no chip ***',
     !heirs2.heirs.some(h => h.parent === who) && !after.chips.some(c => c.k === 'H2:' + who)
     && heirs2.gone.some(g => g.key === who && g.why === 'DIED_TOO_SOON'));
  ok('a second death is refused, not repeated', (await d.fr.evaluate((k) => ctHeirDied(1, k, 9), who)) === false);
  ok('and he is still on act 1\'s roster as the fallen, with the day',
     await d.fr.evaluate((k) => { const m = ctHeirRoster(1).find(x => x.key === k); return !!m && !!m.died && m.died.day === 3; }, who));

  /* THE SAVE, ON THE REAL PAGE */
  const snap = await d.fr.evaluate(() => JSON.parse(JSON.stringify(citySnapshot())));
  ok('*** THE CITY\'S OWN SAVE CARRIES WHAT HAPPENED AND NOT THE HEIRS ***',
     !!snap.heirs && snap.heirs.v === 1 && !!snap.heirs.acts[1].events[who] && snap.heirs.acts[1].events[who].died.day === 3
     && !/"H2:/.test(JSON.stringify(snap.heirs)) && !/"members"/.test(JSON.stringify(snap.heirs)));
  await d.fr.evaluate(() => { HEIR_LED = null; HEIR_SEEN.at = -1e9; });
  ok('(control) with the ledger wiped the man is alive again and has his heir back',
     await d.fr.evaluate((k) => ctHeirs(2).heirs.some(h => h.parent === k), who));
  await d.fr.evaluate((s) => { applyRestore(s); }, snap);
  await d.fr.evaluate(() => { HEIR_SEEN.at = -1e9; });
  ok('*** RESTORING THE SAVE CUTS THE LINE AGAIN ***', await d.fr.evaluate((k) => !ctHeirs(2).heirs.some(h => h.parent === k), who));

  /* A THIRD ACT: the heirs of heirs */
  await d.fr.evaluate(() => { HEIR_LED = BohemiaHeirs.fresh(); HEIR_SEEN.at = -1e9; ctActUnlock(3); });
  await pg.waitForTimeout(400);
  await tap(await rectOf('#actflip .af', 2));
  const third = await row();
  const h3 = await d.fr.evaluate(() => ctHeirs(3));
  ok('*** ACT 3 HAS THE HEIRS OF THE HEIRS (' + h3.heirs.length + ': ' + third.chips.map(c => c.t).join(' | ') + ') ***',
     h3.heirs.length === live.yours.length && third.on === true && third.chips.length === h3.heirs.length
     && h3.heirs.every(h => h.line.length === 3));

  ok('no page error anywhere in this round\'s wire' + (d.errs.length ? ' -- ' + d.errs[0] : ''), d.errs.length === 0);
  console.log('  MEASURED: ' + live.yours.length + ' real person(s) -> ' + heirs.heirs.length + ' heir(s) in act 2 -> '
              + h3.heirs.length + ' in act 3 · ' + (heirs.heirs[0] ? heirs.heirs[0].name + ', ' + heirs.heirs[0].age + ', ' + heirs.heirs[0].kind : '')
              + ' · ' + d.says());
  await d.close();
  done();
})();
