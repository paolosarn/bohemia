#!/usr/bin/env node
/* AUTO NEVER LEAVES A MAN (COMBAT 7, 11/3; EYES 11/3 items 1 and 2, rows 96, 109, 319, 331, 332; the open asks page's 139).
   EYES, fight three: one RUNNER beside RAUL's roof stabbing him for three rounds; YOU (splitting maul, AUTO on) walked away east,
   climbed an empty roof, walked back, and swung only after RAUL was struck down. MEASURED (records/BOHEMIA_COMBAT_7_AUTO_NEVER_LEAVES_A_MAN_11_3_26.md):
   another man of theirs had broken and was running, and to AUTO a runner was a full target: the walk hunted him, the roof was
   climbed for 'next turn's blow' on him, and he was gone by then. Now his men hunt the men of theirs who still stand; a runner is
   walked after only when no standing man can be reached, or for a kill on offer this turn; next turn never counts a runner.

   Legs (N1, N2 headless on the live fight's rules; N3 to N5 in the page, the upright phone 390 x 844 by touch, and sideways):
   N1 THE FIGHT-THREE REPRO: 25 set-ups (a runner of theirs beside a friend's roof hitting him, a second man of theirs running, his
      splitting maul 4 to 6 tiles off): no turn of his walks him farther from the standing man without striking him, and no turn
      climbs a roof that is not beside the standing man; and the brain before this round fails it (the leg can bite)
   N2 A KILL ON OFFER STILL WINS: a runner of theirs on his last hitpoint two tiles off, a standing man farther: he walks and finishes him
   N3 THE BREAK IS ASKED ON AUTO (row 139): every man of theirs breaks with AUTO on: the line says so, WAIT reads RUN THEM DOWN and
      RETREAT reads SPARE THEM, nothing moves for the ask's beats; a finger on RUN THEM DOWN and the chase goes on (AUTO never ends it)
   N4 SIDEWAYS: the same two buttons on the glass with their words, phone on its side
   N5 THE ROUND SWING SAYS THREE (row 332): his finger on ROUND SWING: the line says the three in front, never 'every man around you'
   Run: node gates/auto_never_leaves_a_man_gate.js [--headless-only] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const { proofShot } = require(path.join(__dirname, '..', 'tools', 'bohemia_proof_shot.js'));   /* PLUMBER 8 11/10: a gate run changes nothing git tracks (PROOF SHOTS STAY PUT); BOHEMIA_SHOOT=1 or --shoot writes the tracked picture on purpose */
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const WP = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapons.json'), 'utf8'));
const row = id => WP.rows.filter(r => r.id === id)[0];
const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

/* N1: the repro, on this brain and on the brain before (the three hunks of this round taken out in a memory copy) */
const BEFORE = rules => rules
  .replace("const all = foes(u), stand = u.side === 'you' ? all.filter(function (f) { return f.morale !== 'Fleeing'; }) : all;", "const all = foes(u), stand = all;")
  .replace(/!\(next && t\.morale === 'Fleeing'\)/g, 'true').replace(/\|\| \(next && t\.morale === 'Fleeing'\)/g, '');
function repro(ctx) {
  const F = ctx.FIGHT, T = F._t, CREW = [{ background: 'companion_2hand', name: 'YOU' }, { background: 'companion_ranged', name: 'RAUL' }];
  let cases = 0, bad = 0; const why = [];
  for (let sd = 1; sd < 60 && cases < 25; sd++) {
    ctx.setSeed(sd); F.setup({ kind: 'works', company: CREW, cap: 12, deploy: false, formation: null, auto: true, band: ['goblin_wolfrider', 'brigand_thug'] });
    const S = F.S, mine = S.units.filter(v => v.side === 'you'), them = S.units.filter(v => v.side === 'them');
    const you = mine[0], raul = mine[1], run = them[0], fl = them[1];
    if (!you || !raul || !run || !fl) continue;
    let spot = null;
    for (let y = 1; y < S.h - 1 && !spot; y++) for (let x = 1; x < S.w - 1 && !spot; x++) {
      if (!F.isRoof(x, y) || F.level(x, y) < 1 || !T.passable(x, y)) continue;
      const g = [[0, 1], [1, 0], [-1, 0], [0, -1]].map(d => ({ x: x + d[0], y: y + d[1] })).filter(q => T.passable(q.x, q.y) && !F.isRoof(q.x, q.y) && F.level(q.x, q.y) === 0)[0];
      if (!g) continue;
      let yt = null;
      for (let yy = 0; yy < S.h && !yt; yy++) for (let xx = 0; xx < S.w && !yt; xx++) { const d = dist({ x: xx, y: yy }, g); if (d >= 4 && d <= 6 && T.passable(xx, yy) && F.level(xx, yy) === 0 && !F.isRoof(xx, yy)) yt = { x: xx, y: yy }; }
      if (!yt) continue;
      let fx = null;
      for (let yy = 0; yy < S.h && !fx; yy++) for (let xx = 0; xx < S.w && !fx; xx++) { const dd = dist({ x: xx, y: yy }, yt), dr = dist({ x: xx, y: yy }, g); if (dd >= 3 && dd <= 5 && dr > dd + 1 && T.passable(xx, yy) && !(xx === x && yy === y)) fx = { x: xx, y: yy }; }
      if (fx) spot = { r: { x, y }, g, yt, fx };
    }
    if (!spot) continue;
    S.units.forEach(v => { if ([you, raul, run, fl].indexOf(v) < 0) { v.fled = true; v.x = -50; v.y = -50; } });
    you.weapon = Object.assign({}, row('splitting_maul')); you.bag = []; you.ammo = null; you.loaded = true;
    raul.x = spot.r.x; raul.y = spot.r.y; run.x = spot.g.x; run.y = spot.g.y; you.x = spot.yt.x; you.y = spot.yt.y; fl.x = spot.fx.x; fl.y = spot.fx.y;
    you.morale = 'Wavering'; fl.morale = 'Fleeing'; fl.roundsFleeing = 0; raul.hp = raul.hpMax = 400; run.hp = run.hpMax = 400; run.morale = 'Steady';
    S.order = [run.id, raul.id, you.id, fl.id]; S.idx = 0; S.over = false; S.round = 1; S.contact = true;
    cases++;
    let g = 0, hit = false, bads = 0;
    while (!S.over && g < 3000 && S.round < 7 && !hit) {
      const u = F.current(); if (!u) break;
      if (u !== you || you.morale === 'Fleeing' || run.morale === 'Fleeing') { F.aiStep(u); g++; continue; }
      const d0 = dist(you, run), L0 = S.log.length; let r0 = S.round;
      while (F.current() === you && S.round === r0 && g < 3000) { F.aiStep(you); g++; }
      const ev = S.log.slice(L0).filter(e => e.id === you.id);
      hit = ev.some(e => e.t === 'attack' && !e.free && e.to === run.id);
      const climbed = ev.some(e => e.t === 'climbed') && dist(you, run) > 1;
      if (!hit && (dist(you, run) > d0 || climbed)) { bads++; if (why.length < 2) why.push('seed ' + sd + ' r' + r0 + ': ' + d0 + '->' + dist(you, run) + (climbed ? ' climbed' : '')); }
    }
    if (bads) bad++;
  }
  return { cases, bad, why };
}
const now = repro(engine()), was = repro(engine({ patch: BEFORE }));
leg(now.cases >= 20 && now.bad === 0 && was.bad >= 10,
  '*** N1 THE FIGHT-THREE REPRO ***: a runner of theirs beating his friend, another of theirs running: his maul man never walks away from the standing man nor climbs an empty roof (the brain before: ' + was.bad + ' of ' + was.cases + ')',
  now.bad + ' of ' + now.cases + ' set-ups went wrong' + (now.why.length ? ': ' + now.why.join('; ') : '') + (was.why.length ? ' | before: ' + was.why.join('; ') : ''));

/* N2 */
{
  const ctx = engine(), F = ctx.FIGHT, T = F._t;
  ctx.setSeed(5); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug', 'brigand_thug'] });
  const S = F.S, m = S.units.filter(u => u.side === 'you'), t = S.units.filter(u => u.side === 'them');
  S.units.forEach(u => { u.fled = [m[0], m[1], t[0], t[1]].indexOf(u) < 0; });
  const me = m[0], pal = m[1]; me.weapon = Object.assign({}, row('splitting_maul')); me.bag = []; me.perks = [];
  me.x = 6; me.y = 6; pal.x = 12; pal.y = 6; t[0].x = 8; t[0].y = 6; t[0].morale = 'Fleeing'; t[0].hp = 1; t[0].armB = 0; t[0].armH = 0;
  t[1].x = 13; t[1].y = 6; t[1].morale = 'Steady';
  S.order = [me.id, t[1].id, t[0].id, pal.id]; S.idx = 0; me.ap = me.apTurn; me.fat = 0; me.begun = true; me.morale = 'Steady'; me.turnLog = S.log.length; me.turnFrom = { x: me.x, y: me.y }; me.lastTurn = null;
  const L0 = S.log.length; let g = 0; while (F.current() === me && g++ < 12) F.aiStep(me);
  const ev = S.log.slice(L0).filter(e => e.id === me.id && !e.free);
  leg(ev.some(e => e.t === 'attack' && e.to === t[0].id), '*** N2 A KILL ON OFFER STILL WINS ***: a runner on his last hitpoint two tiles off, a standing man farther: he walks and finishes him',
    ev.map(e => e.t + (e.to ? '>' + e.to : '')).join(', ') + '; weighed ' + JSON.stringify(me.btLast || []));
}

if (process.argv.indexOf('--headless-only') > 0) { console.log('\n=== AUTO NEVER LEAVES A MAN: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }

/* N3 to N5: the page */
(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const tapOn = async (p, sel) => { const b = await p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 2 ? { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, on: r.right <= innerWidth && r.bottom <= innerHeight && r.left >= 0 && r.top >= 0 } : null; }, sel);
    if (b) await p.touchscreen.tap(b.x, b.y); return b; };
  for (const prof of ['phone_portrait', 'phone_landscape']) {
    const tag = prof === 'phone_portrait' ? '[upright 390 x 844, touch]' : '[sideways 844 x 390, touch]';
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: prof, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 7, speed: 1, kind: 'street', deploy: false, formation: null, auto: true, band: ['brigand_thug', 'brigand_thug', 'brigand_thug'] }) });
    const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && !FIGHT.S.deploy, null, { timeout: 40000 });
      /* every man of theirs breaks (the morale the fight's own checks would give them); the next action of anyone says it */
      await p.evaluate(() => { FIGHT.S.units.filter(v => v.side === 'them' && FIGHT.onField(v)).forEach(v => { v.morale = 'Fleeing'; v.roundsFleeing = 0; }); });
      await p.waitForFunction(() => FIGHT_UI.rout !== null && FIGHT_UI.rout !== undefined || FIGHT.S.over, null, { timeout: 20000 });
      const asked = await p.evaluate(() => ({ wait: document.getElementById('bwait').textContent, flee: document.getElementById('bflee').textContent, say: document.getElementById('say').innerText, over: FIGHT.S.over, n: FIGHT.S.log.length, auto: FIGHT_UI.auto }));
      await p.waitForTimeout(2500);
      const still = await p.evaluate(() => FIGHT.S.log.length), moved = await p.evaluate(n => FIGHT.S.log.slice(n).map(e => e.t + ':' + e.id).join(' '), asked.n);
      const shot = path.join(ROOT, 'records/target/combat7_11_3', 'rout_' + prof + '.png');
      if (prof === 'phone_portrait' && process.env.COMBAT7_SHOTS) { fs.mkdirSync(path.dirname(shot), { recursive: true }); await p.screenshot({ path: proofShot(shot) }); }
      const bw = await tapOn(p, '#bwait'), bf = await p.evaluate(() => { const r = document.getElementById('bflee').getBoundingClientRect(); return { on: r.right <= innerWidth && r.bottom <= innerHeight && r.width > 2 }; });
      await p.waitForTimeout(400);
      const ran = await p.evaluate(() => ({ runDown: !!FIGHT.S.runDown, say: document.getElementById('say').innerText, over: FIGHT.S.over }));
      await p.waitForTimeout(4000);
      const after = await p.evaluate(() => ({ over: FIGHT.S.over, result: FIGHT.S.result, ended: FIGHT.S.log.some(e => e.t === 'over' && e.ended) }));
      if (prof === 'phone_portrait') {
        leg(asked.auto && !asked.over && /RUN THEM DOWN/.test(asked.wait) && /SPARE THEM/.test(asked.flee) && /breaking/i.test(asked.say) && still === asked.n,
          '*** N3 THE BREAK IS ASKED ON AUTO *** ' + tag + ': the line says it, WAIT reads RUN THEM DOWN, RETREAT reads SPARE THEM, nothing moves for 2.5 s',
          'WAIT "' + asked.wait + '", RETREAT "' + asked.flee + '", line "' + asked.say.replace(/\s+/g, ' ').slice(0, 70) + '", ' + (still - asked.n) + ' log lines while asked ' + moved);
        leg(!!bw && ran.runDown && /Run them down/i.test(ran.say) && !after.ended,
          '  N3b a finger on RUN THEM DOWN: the chase goes on, AUTO never ends it as spared', JSON.stringify({ tapped: !!bw, runDown: ran.runDown, after }));
      } else {
        leg(!!bw && bw.on && bf.on && /RUN THEM DOWN/.test(asked.wait) && /SPARE THEM/.test(asked.flee) && ran.runDown,
          '*** N4 SIDEWAYS *** ' + tag + ': RUN THEM DOWN and SPARE THEM on the glass, and the finger takes', JSON.stringify({ wait: asked.wait, flee: asked.flee, onGlass: [bw && bw.on, bf.on], runDown: ran.runDown }));
      }
      /* N5 (upright only): the round swing's words */
      if (prof === 'phone_portrait') {
        const st = await p.evaluate(() => {
          const S = FIGHT.S; S.over = false; S.units.filter(v => v.side === 'them').forEach(v => { v.morale = 'Steady'; v.fled = false; v.dead = false; v.down = false; v.hp = v.hpMax = 999; });
          const u = S.units.filter(v => v.side === 'you' && FIGHT.onField(v))[0], them = S.units.filter(v => v.side === 'them');
          FIGHT_UI.auto = false; FIGHT_UI.rout = null; S.runDown = false;
          let c = null; for (let y = 2; y < S.h - 2 && !c; y++) for (let x = 2; x < S.w - 2 && !c; x++) { let ok = true; for (let yy = y - 1; yy <= y + 1; yy++) for (let xx = x - 1; xx <= x + 1; xx++) if (!FIGHT._t.passable(xx, yy) || FIGHT.level(xx, yy) !== FIGHT.level(x, y)) ok = false; if (ok) c = { x, y }; }
          S.units.forEach(v => { if (v !== u && v.side === 'you') v.fled = true; });
          them.forEach((v, i) => { v.x = c.x + 1; v.y = c.y - 1 + i; });
          u.weapon = Object.assign({}, DB.weapons.rows.filter(r => r.id === 'splitting_maul')[0]); u.x = c.x; u.y = c.y; u.ap = u.apTurn; u.fat = 0; u.begun = true; u.upRound = null;
          S.order = [u.id].concat(them.map(v => v.id)); S.idx = 0; FIGHT_UI.anim = []; FIGHT_UI.pend = null; FIGHT_UI.sweep = null; hud();
          return !!document.querySelector('#skills button[data-sweep="Round Swing"]');
        });
        await p.waitForTimeout(500);
        const sq = await tapOn(p, '#skills button[data-sweep="Round Swing"]');
        await p.waitForTimeout(400);
        const said = await p.evaluate(() => document.getElementById('say').innerText);
        if (process.env.COMBAT7_SHOTS) await p.screenshot({ path: proofShot(path.join(ROOT, 'records/target/combat7_11_3', 'swing_words.png')) });
        leg(st && !!sq && /three in front/i.test(said) && !/every man of theirs around you/i.test(said),
          '*** N5 THE ROUND SWING SAYS THREE *** ' + tag + ': his finger on ROUND SWING, the line says the three in front', '"' + said.replace(/\s+/g, ' ').slice(0, 110) + '"');
      }
      leg(errs.length === 0, '  nothing threw ' + tag, errs.slice(0, 2).join(' | ') || 'none');
    } catch (e) { leg(false, 'the page legs ran ' + tag, String(e.message).slice(0, 200)); }
    await d.close();
  }
  console.log('\n=== AUTO NEVER LEAVES A MAN: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
