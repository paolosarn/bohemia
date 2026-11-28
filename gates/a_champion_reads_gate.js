#!/usr/bin/env node
/* ============================================================================
   GATE: A CHAMPION READS (FIGHT SCREEN 4, 11/27/26; VAMILY rules 493(c), 482, 495; the coordinator's order of 11/27: 'a champion reads
   on the fight screen (his name, his face, why he is dangerous, the prize on him) without a pop-up').
   MEASURED BEFORE (tools/bohemia_fight_screen_the_champion.js BEFORE=1): the bell said 'EL TUERTO: We have followed your cart...' and
   nothing said he was a champion; the phone's card read him like any man of theirs; his sheet carried his title in small type and
   nothing on why he is dangerous; no prize existed.
   THE ONE PLACE: engine/bohemia_champion.js reads each champion once when the band is dealt (u.champRead); the card, his sheet, the bell
   and the spoils read that. The words are records/target/bb/bohemia_enemies.json champions.read (drafts for WORDS).
     C1  THE READ, no browser: a champion against his own men: the edges that clear their bar, biggest first, in the table's words; none
         clears -> the plain word; the prize from his kind's row is the weapon he carries; a man who is not a champion reads null; the
         words follow the person (MAMA LOCA: HER MEN, IF SHE FALLS; the fight's own sex wins over the name)
     C2  THE PRIZE IS TRUE, no browser: what the read names is what the spoils' champion rule gives (engine/bohemia_spoils.js found(),
         BESTIARY 4's): his weapon whole, once, on every one of 60 dice, and his pockets' batteries paid; a fled champion leaves nothing
     C3  THE BELL (the demo, upright and on its side, a road crew led by a champion through the map's own door): his name carries his title;
         once his sentence has typed, why he is dangerous and the prize on him stand under it, on the glass
     C4  THE CARD: him on the phone's card: his name in gold, the skull drawn (its words his title and why), the prize's picture pinned on
         his photo, nothing off the card; a plain man of theirs wears no skull and no prize
     C5  THE WORST ROW: every mark, the skull and a gun's cases in one card row: nothing off the card, no two pieces on top of each other;
         the same row on a plain man of theirs (the row is the card's)
     C6  HIS SHEET: his title, why he is dangerous, the prize with its picture; on the glass; nothing spills out of the weapon's well
     C7  THE PRIZE RIDES HOME: the fight's own spoils report for him (a champion, his weapon, his pockets' batteries) is the prize the card names
     errors  no page error
     planted: the champion's mark taken out of the card's painter (PLANT): C4 red
   Run: node gates/a_champion_reads_gate.js      (about 4 min, one browser at a time)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const CH = require(path.join(ROOT, 'engine/bohemia_champion.js')), SP = require(path.join(ROOT, 'engine/bohemia_spoils.js'));
const EN = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/bohemia_enemies.json'), 'utf8')), C = EN.champions;
/* ---- C1: the read ---- */
{
  const man = (o) => Object.assign({ side: 'them', hpMax: 55, armHMax: 20, armBMax: 40, mskill: 55, rskill: 45, resolve: 40, initiative: 100, weapon: { id: 'pipe', name: 'Pipe' } }, o);
  const champ = man({ id: 'e2', kind: 'brigand_leader_champion', name: 'EL TUERTO', champion: true, champTitle: "the road crew's champion", hpMax: 182, armHMax: 200, armBMax: 300, resolve: 105, initiative: 143, mskill: 86, weapon: { id: 'fighting_axe', name: 'Fighting Axe' }, prize: { batteries: 30 } });
  const band = [champ, man({ id: 'e1' }), man({ id: 'e3' }), man({ id: 'e4', beast: true, hpMax: 900 })];
  const R = CH.read(champ, band, C, { weapons: [{ id: 'fighting_axe', class: 'axe', durability: 80 }], ranged: () => false, nameOf: () => 'HATCHET' });
  const order = R && R.edges.map(e => e.k).join(',');
  const plain = CH.read(man({ champion: true, kind: 'brigand_leader_champion', name: 'X' }), [man({}), man({})], C, {});
  /* the words follow the person: MAMA LOCA is she (her name's first word), the fight's own sex wins over the name */
  const her = CH.read(Object.assign({}, champ, { name: 'MAMA LOCA' }), band, C, { nameOf: () => 'HATCHET' }), him = CH.read(Object.assign({}, champ, { name: 'MAMA LOCA', sex: 'm' }), band, C, { nameOf: () => 'HATCHET' });
  const sheOk = !!her && /HER MEN/.test(her.why) && !/HIS/.test(her.why) && /ON HER: HER HATCHET AND 30 BATTERIES\. YOURS IF SHE FALLS/.test(her.prizeLine) && !!him && /HIS MEN/.test(him.why) && /IF HE FALLS/.test(him.prizeLine);
  const words = R && /THE ARMOUR OF HIS MEN/.test(R.why) && /THE BLOOD OF HIS MEN/.test(R.why) && R.edges.length === (C.read.shown || 2);
  check(!!R && words && R.edges[0].x >= R.edges[1].x && R.prize && R.prize.part === 'weapon' && R.prize.id === 'fighting_axe' && R.prize.name === 'HATCHET' && R.prize.durability === 80 && R.prize.batteries === 30
    && /ON HIM: HIS HATCHET AND 30 BATTERIES/.test(R.prizeLine) && plain && plain.why === C.read.plain && CH.read(man({}), band, C, {}) === null && sheOk,
    'C1', 'the read: ' + JSON.stringify(R && { why: R.why, edges: order, prize: R.prize, line: R.prizeLine }) + '; no edge clears: ' + JSON.stringify(plain && plain.why) + '; the beast in the band was never his men; MAMA LOCA: ' + JSON.stringify(her && [her.why, her.prizeLine]) + ', with the fight\'s own sex m: ' + JSON.stringify(him && him.prizeLine));
}
/* ---- C2: the prize is true: the spoils' champion rule (engine/bohemia_spoils.js found(), BESTIARY 4's) gives what the read names ---- */
{
  const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/loot.json'), 'utf8'));
  let tape = null; try { tape = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/tape_income.json'), 'utf8')); } catch (e) {}
  const D = Object.assign({}, L, tape ? { tape_income: tape } : {});
  const die = (seed) => { let a = seed | 0; return function () { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  const body = (o) => Object.assign({ name: 'THUG', kind: 'brigand_thug', dead: true, weapon: { id: 'pipe', cls: 'mace', durability: 60 }, body: { id: 'padded_vest', now: 40, max: 60 }, head: null, shield: null }, o);
  const unit = { side: 'them', id: 'e2', name: 'EL TUERTO', kind: 'brigand_leader_champion', champion: true, champTitle: "the road crew's champion", hpMax: 182, weapon: { id: 'fighting_axe', name: 'Fighting Axe' }, prize: { batteries: 30 } };
  const R = CH.read(unit, [unit], C, { weapons: [{ id: 'fighting_axe', class: 'axe', durability: 80 }], nameOf: () => 'HATCHET' }), P = R && R.prize;
  let whole = 0, paid = 0; const N = 60;
  for (let s = 1; s <= N; s++) {
    const a = SP.found({ bodies: [body({ name: 'EL TUERTO', kind: 'brigand_leader_champion', champion: true, weapon: { id: P.id, cls: P.cls, durability: P.durability }, prize: { batteries: P.batteries } }), body({}), body({ name: 'RAIDER' })] }, D, die(s));
    const b = SP.found({ bodies: [body({ name: 'EL TUERTO', kind: 'brigand_leader_champion', weapon: { id: P.id, cls: P.cls, durability: P.durability } }), body({}), body({ name: 'RAIDER' })] }, D, die(s));
    const mine = a.items.filter(i => i.from === 'EL TUERTO' && i.id === P.id && i.kind === P.part);
    if (mine.length === 1 && mine[0].cond === P.durability && mine[0].max === P.durability) whole++;
    if (a.counts.batteries - b.counts.batteries === P.batteries) paid++;
  }
  const fled = SP.found({ bodies: [body({ name: 'EL TUERTO', dead: false, fled: true, champion: true, weapon: { id: P.id, cls: P.cls, durability: P.durability }, prize: { batteries: 30 } })] }, D, die(7));
  check(!!P && whole === N && paid === N && !fled.items.some(i => i.from === 'EL TUERTO') && fled.counts.batteries === 0,
    'C2', 'the prize is true: the read names ' + JSON.stringify(R && R.prizeLine) + '; the spoils find his ' + (P && P.id) + ' whole, once, on ' + whole + '/' + N + ' dice and pay ' + (P && P.batteries) + ' batteries on ' + paid + '/' + N
    + '; a fled champion leaves ' + fled.items.length + ' pieces and ' + fled.counts.batteries + ' batteries');
}
/* ---- the page, upright and on its side ---- */
const run = (way, env) => { const out = fs.mkdtempSync(path.join(os.tmpdir(), 'champ-'));
  spawnSync('node', [path.join(ROOT, 'tools/bohemia_fight_screen_the_champion.js'), 'demo', way, out], { env: Object.assign({}, process.env, env || {}), stdio: 'ignore', timeout: 300000 });
  let T = null; try { T = JSON.parse(fs.readFileSync(path.join(out, 'champion.json'), 'utf8')); } catch (e) {} try { fs.rmSync(out, { recursive: true, force: true }); } catch (e) {} return T; };
const W = [['upright', run('upright')], ['sideways', run('sideways')]];
const ok = (fn) => W.every(([, T]) => { try { return !!T && !!T.champ && fn(T); } catch (e) { return false; } });
const say = (fn) => W.map(([w, T]) => w + ' ' + (T && T.champ ? fn(T) : 'NO CHAMPION')).join(' | ');
const c3 = (T) => T.bell.up && T.bell.said && T.bell.said.byId === T.champ.id && T.bell.name.indexOf(String(T.champ.title).toUpperCase()) >= 0 && !!T.bell.champ && !T.bell.champ.off
  && T.bell.champ.text.indexOf(T.champ.read.why) >= 0 && T.bell.champ.text.indexOf(T.champ.read.prizeLine) >= 0;
check(ok(c3), 'C3', 'the bell: ' + say(T => T.bell.name + ' / ' + (T.bell.champ ? T.bell.champ.text + ' at ' + T.bell.champ.box.join(',') : 'NOTHING UNDER IT')));
const c4 = (T) => T.card.champ && T.card.mark && /^url\(/.test(T.card.mark.drawn) && T.card.mark.says.indexOf(String(T.champ.title).toLowerCase()) >= 0 && T.card.mark.says.indexOf(T.champ.read.why.toLowerCase()) >= 0
  && T.card.prize && /^url\(/.test(T.card.prize.drawn) && T.card.nameColour === 'rgb(224, 160, 64)' && !T.card.off.length && T.plainCard && !T.plainCard.champ && !T.plainCard.mark && !T.plainCard.prize;
const c4say = (T) => T.card.name + ' ' + T.card.nameColour + ', marks ' + T.card.marks.join('+') + ', skull ' + (T.card.mark ? 'drawn' : 'NONE') + ', prize ' + (T.card.prize ? '"' + T.card.prize.says + '"' : 'NONE') + ', off ' + T.card.off.length + '; plain ' + (T.plainCard ? T.plainCard.name + (T.plainCard.mark || T.plainCard.prize ? ' WEARS IT' : ' none') : '-');
check(ok(c4), 'C4', 'the card: ' + say(c4say));
const c5 = (T) => T.worst && !T.worst.off.length && !T.worst.over.length && T.worstPlainRow && !T.worstPlainRow.off.length && !T.worstPlainRow.over.length;
check(ok(c5), 'C5', 'the worst row: ' + say(T => (T.worst ? T.worst.pieces.join(' ') + ' off ' + T.worst.off.length + ' over ' + JSON.stringify(T.worst.over) : '-') + '; plain over ' + (T.worstPlainRow ? JSON.stringify(T.worstPlainRow.over) : '-')));
const c6 = (T) => T.sheet.shown && T.sheet.onGlass && T.sheet.champ && T.sheet.champ.text.indexOf(String(T.champ.title).toUpperCase()) >= 0 && T.sheet.champ.text.indexOf(T.champ.read.why) >= 0
  && T.sheet.champ.prize && !!T.sheet.champ.pic && T.sheet.fits && T.sheet.fits.fits && !(T.sheet.spill || []).length;
check(ok(c6), 'C6', 'his sheet: ' + say(T => (T.sheet.champ ? T.sheet.champ.text : 'NO CHAMPION BLOCK') + ', picture ' + (T.sheet.champ && T.sheet.champ.pic ? T.sheet.champ.pic.join(',') : 'none') + ', fits ' + (T.sheet.fits && T.sheet.fits.fits) + ' at step ' + (T.sheet.fits && T.sheet.fits.step) + ', spill ' + JSON.stringify(T.sheet.spill)));
const c7 = (T) => T.prizeTrue && T.prizeTrue.body && T.prizeTrue.body.champion && T.prizeTrue.read && T.prizeTrue.body.weapon === T.prizeTrue.read.id && ((T.prizeTrue.body.prize || {}).batteries | 0) === (T.prizeTrue.read.batteries | 0);
check(ok(c7), 'C7', 'the prize rides home: ' + say(T => JSON.stringify(T.prizeTrue)));
check(ok(T => !(T.errors || []).length), 'errors', say(T => (T.errors || []).length + ' page errors'));
const PL = run('upright', { PLANT: '1' });
check(!!PL && !!PL.champ && !c4(PL), 'planted', 'the champion\'s mark taken out of the painter: C4 reads ' + (PL && PL.card ? c4say(PL) : 'nothing') + ' (red)');
console.log('\nA CHAMPION READS: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
