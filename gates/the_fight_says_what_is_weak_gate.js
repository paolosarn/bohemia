#!/usr/bin/env node
/* THE FIGHT SAYS WHAT IS WEAK (COMBAT [the fight says your weapon is weak], rule 120(b), Paolo 10/18: 'the game doesn't
   explain to you at all that your weapon sucks'). Before a shot or a swing, under his finger: the hit chance and what the
   blow does to that man's armour and body, and one plain line when the weapon is bad for him; after it, what it did.
   Battle Brothers hides this in a tooltip; we show it (rule 80). Rule 117: few numbers, big and clear.

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. the preview IS the hit: one body blow at the weapon's middle damage takes exactly the armour and the health the real
      resolveAttack takes with the same roll, for every arm of the company against a thug, a raider and a marauder;
   2. the blows to drop him are what the blows do: playing the preview's blows one by one with the real hit drops him on the
      blow it says;
   3. the line is earned: no man of A NEW CREW needs ours.weapon_says_weak's blows for a day-one thug (the first fight is not a
      lecture), and a pipe against a marauder in plate does;
   and on his phone's profile (390 x 844 at 3x), the real page, real taps:
   4. a finger on a thug in reach: the receipt says the chance and the health and the armour of one blow, inside the glass
      above the bar, the numbers matching the rules';
   5. a finger on a man his arm is bad for: the plain line, in the words of what he wears, and the man of his who does better;
   6. a gun beside a man says it clubs;
   7. the second tap: the receipt says what the blow did, within the beat.
   Run: node gates/the_fight_says_what_is_weak_gate.js   (--no-glass skips the phone) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const ctx = engine(), F = ctx.FIGHT, T = F._t, DB = ctx.DB;
const WEAK = DB.ours.weapon_says_weak.value.blows_at_least;

/* 1 and 2 */
let bad1 = [], bad2 = [], n1 = 0;
['brigand_thug', 'lower_brigand_raider', 'brigand_marauder'].forEach(k => {
  ctx.setSeed(5); F.setup({ kind: 'suburb', formation: null, deploy: false, band: [k] });
  const t = F.S.units.filter(u => u.side === 'them')[0], seen = {};
  F.S.units.filter(u => u.side === 'you').forEach(a => {
    const nm = a.weapon.of ? 'pistol' : a.job; if (seen[nm]) return; seen[nm] = 1;
    [2, 1].forEach(d => {
      a.x = t.x - d; a.y = t.y;
      const p = F.preview(a, t);
      const keep = { hp: t.hp, armB: t.armB, armH: t.armH };
      const r = (() => { const w = T.armIn(a, t), k0 = a.weapon; a.weapon = w; try { return F.resolveAttack(a, t, F.strikeSkill(w), { roll: 1, head: false, base: (w.damage_min + w.damage_max) / 2 }); } finally { a.weapon = k0; } })();
      n1++;
      if (r.hp !== p.hp || r.armour !== p.armour) bad1.push(nm + '@' + d + ' v ' + k + ': preview ' + p.hp + '/' + p.armour + ', hit ' + r.hp + '/' + r.armour);
      if (isFinite(p.blows)) {
        let blows = 0; const w = T.armIn(a, t), k0 = a.weapon;
        a.weapon = w;
        try { while (t.hp > 0 && blows < 99) { const q = F.resolveAttack(a, t, F.strikeSkill(w), { roll: 1, head: false, base: (w.damage_min + w.damage_max) / 2 }); t.armB = Math.max(0, t.armB - q.armour); t.hp -= q.hp; blows++; } }
        finally { a.weapon = k0; }
        if (blows !== p.blows) bad2.push(nm + '@' + d + ' v ' + k + ': says ' + p.blows + ', took ' + blows);
      }
      Object.assign(t, keep);
    });
  });
});
leg(!bad1.length, '*** THE PREVIEW IS THE HIT ***: one body blow at the middle damage takes the armour and the health the real hit takes, every arm, shot and club, three kinds of man', bad1.length ? bad1.slice(0, 3).join(' | ') : n1 + ' pairs');
leg(!bad2.length, '  the blows to drop him are the blows the real hit takes', bad2.length ? bad2.slice(0, 3).join(' | ') : 'all');

/* 3 */
const ORIGINS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/origins.json'), 'utf8')).origins;
const nc = ORIGINS.filter(o => o.id === 'newcrew')[0];
ctx.setSeed(5); F.setup({ kind: 'suburb', formation: null, deploy: false, company: nc.men.map(m => ({ background: m.background, level: m.level })), band: ['brigand_thug'] });
const thug = F.S.units.filter(u => u.side === 'them')[0], fresh = F.S.units.filter(u => u.side === 'you').map(a => { a.x = thug.x - 2; a.y = thug.y; return F.preview(a, thug).blows; });
ctx.setSeed(5); F.setup({ kind: 'suburb', formation: null, deploy: false, band: ['brigand_marauder'] });
const mar = F.S.units.filter(u => u.side === 'them')[0], pipe = F.S.units.filter(u => u.side === 'you' && u.job === 'pipe')[0]; pipe.x = mar.x - 1; pipe.y = mar.y;
const pb = F.preview(pipe, mar).blows;
leg(fresh.every(b => b < WEAK) && pb >= WEAK, '*** THE LINE IS EARNED ***: no man of A NEW CREW needs ' + WEAK + ' blows for a day-one thug (the first fight is not a lecture); a pipe on a marauder in plate does', 'a new crew on a thug: ' + fresh.join(', ') + ' blows; a pipe on ' + mar.armB + ' armour: ' + pb);

(async () => {
  if (process.argv.includes('--no-glass')) { done(); return; }
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const run = async (opts, fn) => { const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
    const p = d.page; try { await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 }); return await fn(p, d); } finally { await d.close(); } };
  /* stand the man and the target where the leg wants them, on his turn, the camera on both, then a real finger on the target */
  const aimAt = async (p, who, at, dist) => {
    /* his turn first: theirs may be mid-move when the page opens (a tap skips it), and a man moved under a playing step goes back */
    for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
      if (st === 'mine') break; if (st === 'theirs') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); }
    await p.evaluate(q => { window.tick = window.tick; const S = FIGHT.S, u = S.units.filter(v => v.side === 'you' && new Function('v', 'return ' + q.who)(v))[0], t = S.units.filter(v => v.side === 'them')[0];
      S.units.forEach(v => { if (v.side === 'them' && v !== t) v.fled = true; });   /* his own men stay, so the line can name the better one */
      u.x = q.at[0]; u.y = q.at[1]; t.x = q.at[0] + q.dist; t.y = q.at[1]; S.order = [u.id, t.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true;
      FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.cx = (u.x + q.dist / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .5) * FIGHT_UI.th; }, { who, at, dist });
    await p.waitForTimeout(300);
    const s = await p.evaluate(() => { const t = FIGHT.S.units.filter(v => v.side === 'them')[0]; return { x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th) }; });
    await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(350);
    return p.evaluate(() => { const e = document.getElementById('say'), r = e.getBoundingClientRect(), u = FIGHT.current(), t = FIGHT.S.units.filter(v => v.side === 'them')[0], pv = FIGHT.preview(u, t);
      return { text: e.innerText, shown: e.style.display === 'block', box: { l: r.left, r: r.right, t: r.top, b: r.bottom }, W: innerWidth, bar: innerHeight - BOTH, pv: { chance: pv.chance, hp: pv.hp, armour: pv.armour, blows: pv.blows } }; });
  };
  const inGlass = a => a.box.l >= 0 && a.box.r <= a.W && a.box.b <= a.bar && a.box.t > 0;
  const base = { seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null };
  await run(Object.assign({ band: ['brigand_thug'] }, base), async (p) => {
    const a = await aimAt(p, '!!v.weapon.of', [14, 2], 2);
    leg(a.shown && a.text.indexOf(a.pv.chance + '%') >= 0 && a.text.indexOf('-' + a.pv.hp + ' health') >= 0 && a.text.indexOf('-' + a.pv.armour + ' armour') >= 0 && inGlass(a),
      '*** A FINGER ON HIM SAYS WHAT THE BLOW DOES (rule 120(b)) ***: the chance, the health and the armour of one blow, the rules\' own numbers, inside the glass above the bar (390 x 844)', a.text.replace(/\n/g, ' / '));
    leg(!/barely/.test(a.text), '  a pistol on a day-one thug gets no lecture', a.text.split('\n').length + ' lines');
    const b = await aimAt(p, '!!v.weapon.of', [14, 2], 1);
    leg(/% to hit/.test(b.text) && /left|reload/i.test(b.text) && !/club|Too close/.test(b.text), '*** A GUN BESIDE HIM SHOOTS HIM (rule 185, Paolo 10/25: \'I shouldn\'t be pistol-whipping the tile next to me, I should still be shooting\') ***: the aim says the shot and its rounds, no club', b.text.replace(/\n/g, ' / '));
    /* the WHIP is his pick (rule 185(g)): its square is up while a man of theirs is beside him; armed, the aim says the butt */
    const wq = await p.evaluate(() => { const q = document.querySelector('#skills [data-whip]'); if (!q) return null; const r = q.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, off: q.disabled }; });
    let wt = '';
    if (wq && !wq.off) { await p.touchscreen.tap(wq.x, wq.y); await p.waitForTimeout(250);
      const s2 = await p.evaluate(() => { const t = FIGHT.S.units.filter(v => v.side === 'them')[0]; return { x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th) }; });
      await p.touchscreen.tap(s2.x, s2.y); await p.waitForTimeout(350); wt = await p.evaluate(() => document.getElementById('say').innerText);
      await p.evaluate(() => { const u = FIGHT.current(); if (u) u.whip = false; FIGHT_UI.pend = null; }); }
    leg(!!wq && /whips him/i.test(wt) && !/ left\./.test(wt), '  the WHIP square is up beside him; picked, the aim says he whips him with the butt and no round is counted', wq ? wt.replace(/\n/g, ' / ') : 'no WHIP square');
    /* the second tap: what it did */
    const a2 = await aimAt(p, '!!v.weapon.of', [14, 2], 2);
    const s = await p.evaluate(() => { const t = FIGHT.S.units.filter(v => v.side === 'them')[0]; return { x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th) }; });
    const t0 = await p.evaluate(() => performance.now());
    await p.touchscreen.tap(s.x, s.y);
    const said = await p.waitForFunction(() => /^(Hit|Missed)/.test(document.getElementById('say').innerText), null, { timeout: 4000 }).then(() => true).catch(() => false);
    const r = await p.evaluate(t => ({ text: document.getElementById('say').innerText, ms: performance.now() - t, beat: 60000 / R('ours.beat_bpm') }), t0);
    leg(said && r.ms <= r.beat * 2, '*** AFTER THE BLOW, WHAT IT DID, IN THE BEAT ***', r.text + ' (' + Math.round(r.ms) + ' ms, a beat is ' + r.beat + ')');
    leg(a2.shown, '  the aim line came back for the second man', '');
  });
  await run(Object.assign({ band: ['brigand_marauder'], days: 65 }, base), async (p) => {
    const a = await aimAt(p, 'v.job === "pipe"', [14, 2], 1);
    leg(/barely dents his (plate|mail|leather|padding)/.test(a.text) && /hits to drop him/.test(a.text) && inGlass(a),
      '*** THE WEAPON IS BAD FOR HIM, AND IT SAYS SO ***: a pipe on a marauder: "barely dents his ..." in the words of what he wears, the blows it takes', a.text.replace(/\n/g, ' / '));
    leg(a.text.split('\n').length >= 3 && /hits?\.$/.test(a.text.trim()), '  and it names the man of his who does it in fewer', a.text.split('\n').slice(-1)[0]);
  });
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
function done() { console.log('=== THE FIGHT SAYS WHAT IS WEAK GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }
