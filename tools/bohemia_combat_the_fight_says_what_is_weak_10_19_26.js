#!/usr/bin/env node
/* THE FIGHT SAYS WHAT IS WEAK (COMBAT [the fight says your weapon is weak], rule 120(b), Paolo 10/18: 'the game doesn't
   explain to you at all that your weapon sucks'). Writes slices/vote/COMBAT_THE_FIGHT_SAYS_WHAT_IS_WEAK_10_19.jpg, the VOTE
   sheet, from the REAL fight on his phone's profile (390 x 844 at 3x), real taps: a finger on a thug with the pistol; the
   pistol beside him (it clubs); a pipe on a marauder in plate (the plain line and the better man); what the blow did.
   Run: node tools/bohemia_combat_the_fight_says_what_is_weak_10_19_26.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { open } = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const OUT_JPG = path.join(ROOT, 'slices/vote/COMBAT_THE_FIGHT_SAYS_WHAT_IS_WEAK_10_19.jpg');
const SCRATCH = process.env.BOHEMIA_SCRATCH || path.join(require('os').tmpdir(), 'bohemia_says_weak');

async function fightWith(opts, fn) {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
    await p.waitForTimeout(400);
    return await fn(p);
  } finally { if (d.errs && d.errs.length) console.log('  PAGE ERRORS: ' + d.errs.slice(0, 2).join(' | ')); await d.close(); }
}
/* his man and theirs where the moment wants them, on his turn, the camera on both, then a real finger on the target */
async function aim(p, who, at, dist) {
    /* his turn first: theirs may be mid-move when the page opens (a tap skips it), and a man moved under a playing step goes back */
    for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
      if (st === 'mine') break; if (st === 'theirs') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); }
  await p.evaluate(q => { const S = FIGHT.S, u = S.units.filter(v => v.side === 'you' && new Function('v', 'return ' + q.who)(v))[0], t = S.units.filter(v => v.side === 'them')[0];
    S.units.forEach(v => { if (v.side === 'them' && v !== t) v.fled = true; });
    u.x = q.at[0]; u.y = q.at[1]; t.x = q.at[0] + q.dist; t.y = q.at[1]; S.order = [u.id, t.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true;
    FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.cx = (u.x + q.dist / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .3) * FIGHT_UI.th; }, { who, at, dist });
  await p.waitForTimeout(350);
  const s = await p.evaluate(() => { const t = FIGHT.S.units.filter(v => v.side === 'them')[0]; return { x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th) }; });
  await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(400);
  return s;
}
const say = p => p.evaluate(() => document.getElementById('say').innerText);

(async () => {
  fs.mkdirSync(SCRATCH, { recursive: true });
  const base = { seed: 5, speed: 1, kind: 'suburb', deploy: false, formation: null };
  const frames = [];
  await fightWith(Object.assign({ band: ['brigand_thug'] }, base), async (p) => {
    await aim(p, '!!v.weapon.of', [14, 4], 2);
    frames.push({ name: 'A PISTOL ON A THUG, TWO HOUSES OFF', say: await say(p), file: path.join(SCRATCH, 'aim_thug.png') });
    await p.screenshot({ path: frames[frames.length - 1].file });
    await aim(p, '!!v.weapon.of', [14, 4], 1);
    frames.push({ name: 'THE PISTOL BESIDE HIM', say: await say(p), file: path.join(SCRATCH, 'aim_close.png') });
    await p.screenshot({ path: frames[frames.length - 1].file });
    const s = await aim(p, '!!v.weapon.of', [14, 4], 2);
    await p.touchscreen.tap(s.x, s.y);
    await p.waitForFunction(() => /^(Hit|Missed)/.test(document.getElementById('say').innerText), null, { timeout: 5000 }).catch(() => {});
    frames.push({ name: 'THE SECOND TAP: WHAT IT DID', say: await say(p), file: path.join(SCRATCH, 'after.png') });
    await p.screenshot({ path: frames[frames.length - 1].file });
  });
  await fightWith(Object.assign({ band: ['brigand_marauder'], days: 65 }, base), async (p) => {
    await aim(p, 'v.job === "pipe"', [14, 4], 1);
    frames.push({ name: 'A PIPE ON A MARAUDER IN PLATE', say: await say(p), file: path.join(SCRATCH, 'aim_plate.png') });
    await p.screenshot({ path: frames[frames.length - 1].file });
  });
  /* the order he reads them in */
  const order = ['A PISTOL ON A THUG, TWO HOUSES OFF', 'A PIPE ON A MARAUDER IN PLATE', 'THE PISTOL BESIDE HIM', 'THE SECOND TAP: WHAT IT DID'];
  const spec = path.join(SCRATCH, 'sheet.json');
  fs.writeFileSync(spec, JSON.stringify({ frames: order.map(n => frames.filter(f => f.name === n)[0]).filter(Boolean), out: OUT_JPG }));
  execFileSync('python3', [path.join(__dirname, 'bohemia_combat_the_fight_says_what_is_weak_sheet_10_19_26.py'), spec], { stdio: 'inherit' });
  console.log('  wrote ' + path.relative(ROOT, OUT_JPG));
  frames.forEach(f => console.log('   ' + f.name + ': ' + f.say.replace(/\n/g, ' / ')));
})().catch(e => { console.error(e); process.exit(1); });
