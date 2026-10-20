#!/usr/bin/env node
/* THE RELOAD IS LOUD (COMBAT [the reload is loud], rule 124, Paolo 10/20: 'if I need to reload it needs to be very apparent
   on the screen that I need to reload, it has to be super clear; I don't know the way it is right now... And when I mean
   combat reload, I mean combat reload'). The gun in the fight, never a page reload. The moment the man you control has an
   empty gun the screen says so without reading, on the man, on the button and in the sound; a tap that would fire an empty
   gun never fails silently.

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. EMPTY IS THE RULES' EMPTY: the pistol is empty after its magazine and not a round before; the rifle and the shotgun after
      their one shot; a reload fills them; a pipe and the bottles are never 'empty' (nothing to reload);
   2. THE DRY TAP IS A TAP IN THE GUN'S OWN REACH: an empty pistol two to four tiles from a man is a dry tap; beside him it is
      the club (no dry tap, the club still strikes); loaded, never;
   and on his phone's profile (390 x 844 at 3x), the real page, real taps:
   3. LAST ROUND: a finger on a man with one round left: the receipt shows the gun's bullets and says 'Last round.'; the reload
      square is ringed in amber;
   4. THE LAST SHOT: the line after it says 'Empty: RELOAD.' and the dry click sounds after the shot;
   5. ON THE BUTTON: the strike square gives its place to ONE BIG RELOAD (at least 120 x 44 points, inside the glass, enabled,
      its AP cost on it), blinking on the fight's own beat;
   6. ON THE MAN: a red plate over the man you control, drawn on the board (the warning's red counted in the pixels over his
      head), and none over him while his gun is loaded;
   7. THE TAP THAT WOULD FIRE EMPTY: the dry click, one line naming RELOAD, the big button kicks, and nothing is spent (no AP,
      no shot, his target untouched): never silent, never 'out of reach';
   8. A TAP ON RELOAD: the mag seats ('mag_home'), the magazine is full, the button is a square again, the line says Loaded;
   9. THE SHOTGUN: fired with too few AP left to reload, the big button reads NEXT TURN and is not live; on his next turn the
      click sounds, the line says the gun is empty, and RELOAD is live;
   10. ON ITS SIDE (844 x 390): the big RELOAD fits inside the glass, 44 points or more.
   Run: node gates/the_reload_is_loud_gate.js   (--no-glass skips the phone) */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const ctx = engine(), F = ctx.FIGHT;

/* 1 and 2 */
ctx.setSeed(5); F.setup({ kind: 'suburb', formation: null, deploy: false, band: ['brigand_thug'] });
const S = F.S, mine = S.units.filter(u => u.side === 'you'), them = S.units.filter(u => u.side === 'them');
const of = job => mine.filter(u => (u.weapon.of ? 'pistol' : u.job) === job)[0];
const t = them[0];
const fire = (u, d) => { u.x = t.x - d; u.y = t.y; S.order = [u.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; t.hp = t.hpMax * 99; return F.strike(u, t); };
const pistol = of('pistol'), rifle = of('rifle'), shotgun = of('shotgun'), pipe = of('pipe'), bottles = of('bottles');
const pmag = pistol.weapon.mag, seen = [];
for (let i = 0; i < pmag; i++) { seen.push(F.emptyGun(pistol)); fire(pistol, 2); }
const pEmpty = F.emptyGun(pistol), pR = F.rounds(pistol);
fire(rifle, 3); const rEmpty = F.emptyGun(rifle), rR = F.rounds(rifle);
fire(shotgun, 2); const sEmpty = F.emptyGun(shotgun);
pistol.ap = pistol.apTurn; S.order = [pistol.id]; S.idx = 0; F.reload(pistol);
leg(seen.every(x => !x) && pEmpty && pR.left === 0 && pR.of === pmag && rEmpty && rR.left === 0 && rR.of === 1 && sEmpty && !F.emptyGun(pistol) && F.rounds(pistol).left === pmag,
  '*** EMPTY IS THE RULES\' EMPTY ***: the pistol after its ' + pmag + ' rounds and not before; the rifle and the shotgun after their one shot; a reload fills it',
  'pistol ' + seen.map(x => x ? 'E' : '.').join('') + ' then ' + (pEmpty ? 'EMPTY' : 'loaded') + ', rifle ' + (rEmpty ? 'EMPTY' : 'loaded') + ', shotgun ' + (sEmpty ? 'EMPTY' : 'loaded') + ', reloaded ' + F.rounds(pistol).left + '/' + pmag);
if (bottles) { for (let i = 0; i < 9; i++) fire(bottles, 2); }
leg(!F.emptyGun(pipe) && (!bottles || !F.emptyGun(bottles)), '  a pipe and the bottles are never empty: there is nothing to reload', bottles ? 'bottles left ' + F.rounds(bottles).left : 'no bottles');
for (let i = 0; i < pmag; i++) fire(pistol, 2);
pistol.x = t.x - 3; const dry3 = F.dryAt(pistol, t); pistol.x = t.x - 1; const dry1 = F.dryAt(pistol, t), club1 = F.canStrike(pistol, t);
pistol.ammo = pmag; pistol.x = t.x - 3; const loaded3 = F.dryAt(pistol, t);
leg(dry3 && !dry1 && club1 && !loaded3, '*** THE DRY TAP IS A TAP IN THE GUN\'S OWN REACH ***: empty at three tiles is a dry tap; beside him the club still strikes; loaded, never',
  'three tiles ' + dry3 + ', one tile ' + dry1 + ' (club ' + club1 + '), loaded ' + loaded3);

(async () => {
  if (process.argv.includes('--no-glass')) { done(); return; }
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const run = async (opts, prof, fn) => { const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: prof, arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
    const p = d.page; try { await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 }); await fn(p, d); leg(d.errs.length === 0, '  the page threw nothing', d.errs[0] || ''); } finally { await d.close(); } };
  /* his turn, the man the leg wants on (x, y), one thug d tiles east, the camera on both */
  const stand = async (p, who, at, dist, setup) => {
    for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
      if (st === 'mine') break; if (st === 'theirs') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); }
    await p.evaluate(q => { const S = FIGHT.S, u = S.units.filter(v => v.side === 'you' && new Function('v', 'return ' + q.who)(v))[0], t = S.units.filter(v => v.side === 'them')[0];
      S.units.forEach(v => { if (v.side === 'them' && v !== t) v.fled = true; });
      u.x = q.at[0]; u.y = q.at[1]; t.x = q.at[0] + q.dist; t.y = q.at[1]; S.order = [u.id, t.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true;
      t.hp = t.hpMax * 50; t.hpMax = t.hp;   /* he stands through the leg */
      if (q.setup) new Function('u', q.setup)(u);
      FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.heard = []; FIGHT_UI.cx = (u.x + q.dist / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .3) * FIGHT_UI.th;
      document.getElementById('skills').dataset.key = ''; }, { who, at, dist, setup: setup || '' });
    await p.waitForTimeout(400);
  };
  const tapThem = async p => { const s = await p.evaluate(() => { const t = FIGHT.S.units.filter(v => v.side === 'them')[0]; return { x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th) }; });
    await p.touchscreen.tap(s.x, s.y); };
  const read = p => p.evaluate(() => { const u = FIGHT.current(), br = document.getElementById('breload'), bs = document.getElementById('bstrike'), r = br.getBoundingClientRect(), cs = getComputedStyle(br);
    const t = FIGHT.S.units.filter(v => v.side === 'them')[0];
    return { say: document.getElementById('say').innerText, heard: (FIGHT_UI.heard || []).slice(), cls: br.className, dis: br.disabled, text: br.innerText.replace(/\s+/g, ' ').trim(),
      box: { w: r.width, h: r.height, l: r.left, r: r.right, t: r.top, b: r.bottom }, W: innerWidth, H: innerHeight, strike: bs.style.display !== 'none' && bs.getBoundingClientRect().width > 0,
      anim: cs.animationName, dur: cs.animationDuration, beat: 60000 / R('ours.beat_bpm') / FIGHT_UI.speed, ap: u.ap, ammo: u.ammo, loaded: u.loaded, empty: FIGHT.emptyGun(u), them: { hp: t.hp, armB: t.armB },
      rds: document.querySelectorAll('#say .rds i').length, rdsFull: document.querySelectorAll('#say .rds i:not(.out)').length }; });
  /* the warning's red on the plate over his head (where the fight says it drew it, read off the drawn canvas, never trusted):
     the brightest of six reads across a beat, since the plate blinks; a pixel is the warning's red when red leads and green and
     blue are low (the plate covers the roofs behind it, so their orange is not counted) */
  const redOver = async p => { let best = { n: 0, w: 0, h: 0, dry: null };
    for (let i = 0; i < 6; i++) {
      const r = await p.evaluate(() => { const m = FIGHT_UI.mark; if (!m || performance.now() - m.t > 200) return { n: 0, w: 0, h: 0, dry: null };
        const c = document.getElementById('cv'), d = c.width / innerWidth, im = c.getContext('2d').getImageData(Math.round(m.x * d), Math.round(m.y * d), Math.max(1, Math.round(m.w * d)), Math.max(1, Math.round(m.h * d))).data;
        let n = 0; for (let k = 0; k < im.length; k += 4) if (im[k] > 190 && im[k + 1] < 120 && im[k + 2] < 100) n++;
        return { n: Math.round(n / d / d), w: Math.round(m.w), h: Math.round(m.h), dry: m.dry }; });
      if (r.n >= best.n) best = r; await p.waitForTimeout(90);
    }
    return best; };
  const base = { seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'] };

  await run(base, 'phone_portrait', async (p) => {
    await stand(p, '!!v.weapon.of', [12, 6], 3, 'u.ammo = 1;');
    const red0 = await redOver(p);
    await tapThem(p); await p.waitForTimeout(350);
    const a = await read(p);
    leg(/Last round\./.test(a.say) && a.rds === a.rds && a.rds >= 2 && a.rdsFull === 1 && /\blast\b/.test(a.cls),
      '*** ONE ROUND LEFT READS ***: a finger on him shows the gun\'s bullets on the receipt (one full) and says "Last round."; the reload square ringed in amber', a.say.replace(/\n/g, ' / ') + ' | bullets ' + a.rdsFull + '/' + a.rds + ' | ' + a.cls);
    leg(red0.dry === false && red0.n < 4, '  loaded, his bullets over him and no warning red', red0.n + ' red points on a ' + red0.w + ' x ' + red0.h + ' plate');
    await tapThem(p);
    await p.waitForFunction(() => /Empty: RELOAD/.test(document.getElementById('say').innerText) && FIGHT_UI.heard.indexOf('dry_fire') >= 0, null, { timeout: 4000 }).catch(() => {});
    const b = await read(p);
    leg(/Empty: RELOAD\./.test(b.say) && b.heard.indexOf('shot') >= 0 && b.heard.indexOf('dry_fire') > b.heard.indexOf('shot'),
      '*** THE LAST SHOT SAYS IT ***: the line after it says "Empty: RELOAD." and the dry click sounds after the shot', b.say + ' | heard ' + b.heard.join(' '));
    await p.waitForTimeout(300);
    const c = await read(p);
    const inside = c.box.l >= 0 && c.box.r <= c.W && c.box.t >= 0 && c.box.b <= c.H;
    leg(/\bbig\b/.test(c.cls) && !c.strike && !c.dis && c.box.w >= 120 && c.box.h >= 44 && inside && /RELOAD/.test(c.text) && /\d+ AP/.test(c.text),
      '*** ON THE BUTTON: ONE BIG RELOAD WHERE THE STRIKE WAS ***: at least 120 x 44 points, inside the glass, live, its AP cost on it', Math.round(c.box.w) + ' x ' + Math.round(c.box.h) + ' "' + c.text + '", strike square ' + (c.strike ? 'SHOWN' : 'gone'));
    leg(c.anim.indexOf('rlBlink') >= 0 && Math.abs(parseFloat(c.dur) * (/ms$/.test(c.dur) ? 1 : 1000) - c.beat) < 1, '  it blinks on the fight\'s own beat', c.anim + ' every ' + c.dur + ', the beat ' + c.beat + ' ms');
    const red1 = await redOver(p);
    leg(red1.dry === true && red1.n >= 60 && red1.w >= red0.w * 1.5, '*** ON THE MAN: THE WARNING\'S RED PLATE OVER HIM ***, twice the loaded plate, drawn on the board where the eye already is',
      red1.n + ' red points on a ' + red1.w + ' x ' + red1.h + ' plate (loaded: ' + red0.n + ' on ' + red0.w + ' x ' + red0.h + ')');
    const before = await read(p);
    await p.evaluate(() => { FIGHT_UI.heard = []; });
    await tapThem(p); await p.waitForTimeout(150);
    const d = await read(p);
    leg(d.heard.indexOf('dry_fire') >= 0 && /Empty/.test(d.say) && /RELOAD/.test(d.say) && !/out of reach/.test(d.say) && /\bpoke\b/.test(d.cls)
      && d.ap === before.ap && d.them.hp === before.them.hp && d.them.armB === before.them.armB && d.heard.indexOf('shot') < 0,
      '*** THE TAP THAT WOULD FIRE EMPTY IS NEVER SILENT ***: the dry click, one line naming RELOAD, the big button kicks, nothing spent', d.say + ' | heard ' + d.heard.join(' ') + ' | ' + d.cls + ' | AP ' + before.ap + '->' + d.ap);
    await p.waitForTimeout(600);
    await p.evaluate(() => { FIGHT_UI.heard = []; });
    const bb = await p.evaluate(() => { const r = document.getElementById('breload').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await p.touchscreen.tap(bb.x, bb.y);
    await p.waitForFunction(() => /Loaded/.test(document.getElementById('say').innerText), null, { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(200);
    const e = await read(p);
    leg(e.heard.indexOf('mag_home') >= 0 && !e.empty && e.ammo > 1 && !/\bbig\b/.test(e.cls) && e.strike && /Loaded/.test(e.say),
      '*** A TAP ON RELOAD: THE MAG SEATS ***: the approved mag_home, the magazine full, the strike square back, "Loaded"', e.say + ' | heard ' + e.heard.join(' ') + ' | rounds ' + e.ammo + ' | ' + e.cls);
  });

  await run(base, 'phone_portrait', async (p) => {
    await stand(p, 'v.job === "shotgun"', [12, 6], 2);
    await tapThem(p); await p.waitForTimeout(300); await tapThem(p);
    await p.waitForFunction(() => /\bbig\b/.test(document.getElementById('breload').className), null, { timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(500);
    const a = await read(p);
    leg(a.empty && /\bbig\b/.test(a.cls) && a.dis && /NEXT TURN/.test(a.text) && !/rlBlink/.test(a.anim),
      '*** THE SHOTGUN, FIRED, TOO FEW AP TO RELOAD ***: the big button reads NEXT TURN and is not live', '"' + a.text + '", AP ' + a.ap + ', ' + (a.dis ? 'not live' : 'LIVE'));
    /* his next turn: the turn ends, theirs is skipped, it comes back to him */
    await p.evaluate(() => { FIGHT_UI.heard = []; const u = FIGHT.current(); FIGHT.endTurn(u); take(); });
    let b = null;
    for (let i = 0; i < 120; i++) { await p.waitForTimeout(150);
      const st = await p.evaluate(() => { const u = FIGHT.current(); if (!u || FIGHT_UI.anim.length) return 'busy'; if (u.side === 'them') return 'theirs';
        if (u.job === 'shotgun') return 'his'; FIGHT.endTurn(u); take(); return 'another'; });   /* his other men pass */
      if (st === 'his') { await p.waitForTimeout(400); b = await read(p); break; }
      if (st === 'theirs') await p.touchscreen.tap(200, 300); }
    leg(!!b && b.heard.indexOf('dry_fire') >= 0 && /gun is empty/.test(b.say) && /\bbig\b/.test(b.cls) && !b.dis,
      '*** HIS TURN WITH AN EMPTY GUN ***: the click as it comes to him, the line says the gun is empty, RELOAD is live', b ? b.say + ' | heard ' + b.heard.join(' ') + ' | "' + b.text + '"' : 'his turn never came back');
  });

  await run(base, 'phone_landscape', async (p) => {
    await stand(p, '!!v.weapon.of', [12, 6], 3, 'u.ammo = 0;');
    const a = await read(p);
    leg(/\bbig\b/.test(a.cls) && a.box.l >= 0 && a.box.r <= a.W && a.box.b <= a.H && a.box.t >= 0 && a.box.h >= 44 && a.box.w >= 120,
      '*** ON ITS SIDE (844 x 390) THE BIG RELOAD FITS ***', Math.round(a.box.w) + ' x ' + Math.round(a.box.h) + ' at ' + Math.round(a.box.l) + ',' + Math.round(a.box.t) + ' on ' + a.W + ' x ' + a.H);
  });
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
function done() { console.log('=== THE RELOAD IS LOUD GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }
