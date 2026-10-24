#!/usr/bin/env node
/* THE FIGHT BY HAND, TIMED (COMBAT [the ten changes: the fight's part], rule 133, Paolo 10/23: 'like Battle Brothers but
   quicker and funner for normies'; TUNING's page records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md:
   'By hand it is 12 to 18 of his turns (3 men, 4 to 6 rounds): NOT MEASURED this round... COMBAT owes that number before
   change 10 is sized').

   The real fight page on his phone's profile (390 x 844 at 3x, touch) through the fleet's one driver, played BY HAND: every
   act is a real tap on the glass (the first tap shows, the second does; the big button for FIGHT and END TURN; RELOAD), the
   way a new player who never read a guide plays: shoot or hit the best odds in reach, else walk to the tile that puts a man
   of theirs in reach with the AP to strike, else as close as the AP allows, else END TURN. A frame sampler in the page books
   every frame to what the screen was doing: the open, the formation, THEIR turn, his men's own motion, the out-of-AP beat,
   and the time the screen waited on his finger (the bot answers in tens of milliseconds, so that time is replaced by a
   person's thinking).

   THE PERSON'S TIME IS A RULER, NOT A GUESS: the Keystroke-Level Model (Card, Moran and Newell, 'The Keystroke-Level Model
   for User Performance Time with Interactive Systems', CACM 23(7), 1980): M, a mental preparation, 1.35 s; P, pointing at a
   target, 1.1 s; K, a press, 0.2 s. A decision (the first tap on a man or a tile, FIGHT, END TURN, RELOAD) is M + P + K =
   2.65 s; the second tap on the same spot is K = 0.2 s. The machine's own time is measured; only the finger is modelled.

     node tools/bohemia_combat_the_fight_by_hand_timed.js [--label before] [--file other.html] [--seeds 11,12,13] [--skip]
       --skip   the player taps the board on their turn (the strip's own 'Tap the board to skip it'); default is a player
                who watches them
       --auto   AUTO from the open (the page's own AUTO button), the number TUNING timed
       --glow   a newcomer who takes the glowing AUTO (change 10(a)): the moment AUTO glows, one tap finishes the fight
       --hand 2 the speed pane at 2x (or 3), the fight's own speed control
     writes records/target/combat_by_hand/<label>.json */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

const KLM = { M: 1.35, P: 1.1, K: 0.2, source: 'Card, Moran and Newell 1980, CACM 23(7) 396-410: M 1.35 s, P 1.1 s, K 0.2 s' };
const DECIDE_S = KLM.M + KLM.P + KLM.K, CONFIRM_S = KLM.K;

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? (process.argv[i + 1] && !/^--/.test(process.argv[i + 1]) ? process.argv[i + 1] : true) : d; };
const LABEL = arg('label', 'now'), FILE = arg('file', null), SKIP = !!arg('skip', false), AUTO = !!arg('auto', false), GLOW = !!arg('glow', false), HAND = Number(arg('hand', 0)) || 0;
const SEEDS = String(arg('seeds', '11,12,13')).split(',').map(Number);
/* the stranger's first fights as TUNING walked them: THE CREW THAT IS LEFT (the door's default origin, three men) against
   three brigands on the road and against two on the first job, on day one */
const ORIGIN = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/origins.json'), 'utf8')).origins.filter(o => o.id === 'rebuild')[0];
const COMPANY = ORIGIN.men.map(m => ({ background: m.background, level: m.level }));
const FIGHTS = [
  { name: 'the road: 3 against 3', party: { count: 3, days: 1, difficulty: 1, faction: 'brigands' } },
  { name: 'the first job: 3 against 2', party: { count: 2, days: 1, difficulty: 1, faction: 'brigands' } },
  { name: 'a tough one: 3 against 5', party: { count: 5, days: 1, difficulty: 1, faction: 'brigands' } }];

/* in the page: the sampler books every frame; the planner reads the rules and names the next tap */
const SAMPLER = function () {
  const B = window.__BYHAND = { t: {}, frames: 0, last: 0, taps: [], started: 0, ended: 0, rounds: 0, mine: 0, turnKeys: {} };
  function state() {
    let F = null; try { F = FIGHT; } catch (_e) { return 'load'; }
    const U = window.FIGHT_UI;
    if (!U || !U.board || !F || !F.S || !F.S.round) return 'load';
    const now = performance.now();
    if (F.S.over) return U.anim.length ? 'end' : 'over';
    if (now < U.openUntil) return 'open';
    if (F.S.deploy) return 'deploy_wait';
    const u = F.current(); if (!u) return 'between';
    if (u.side !== 'you' || U.auto || u.morale === 'Fleeing') return U.auto && u.side === 'you' ? 'auto_mine' : 'theirs';
    if (U.anim.length) return 'mine_motion';
    if (U.spent) return 'spent';
    if (U.glide && U.glide.hold) return 'mine_motion';
    const k = u.id + ':' + F.S.round + ':' + F.S.idx; if (!B.turnKeys[k]) { B.turnKeys[k] = 1; B.mine++; }
    return 'mine_wait';
  }
  function loop(now) {
    requestAnimationFrame(loop);
    const s = state();
    if (B.last && s !== 'load' && s !== 'over') { B.t[s] = (B.t[s] || 0) + (now - B.last); if (!B.started) B.started = B.last; }
    if (s === 'over' && !B.ended) { B.ended = now; B.rounds = FIGHT.S.round; B.result = FIGHT.S.result; }
    B.last = now; B.frames++;
  }
  requestAnimationFrame(loop);
};
const PLAN = function (opt) {
  const U = window.FIGHT_UI, F = FIGHT, S = F.S;
  if (S.over) return { k: 'over' };
  if (!U.board || performance.now() < U.openUntil) return { k: 'wait' };
  const btn = id => { const r = document.getElementById(id).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: document.getElementById(id).innerText.replace(/\s+/g, ' ').trim() }; };
  if (S.deploy) return Object.assign({ k: 'fight' }, btn('bend'));
  const u = F.current(); if (!u) return { k: 'wait' };
  if (u.side !== 'you' || U.auto || u.morale === 'Fleeing') return { k: 'theirs' };
  if (U.anim.length || U.spent || (U.glide && U.glide.hold)) return { k: 'wait' };
  /* the newcomer takes the glow: AUTO lit with the odds, one tap */
  /* he looks at the screen before he decides (the 2.65 s the ruler gives him): the odds read in about half a second of it */
  if (opt && opt.glow && typeof ODDS !== 'undefined' && ODDS.F !== false && !ODDS.broke && ODDS.runs < ODDS_SHOW) return { k: 'wait' };
  if (opt && opt.glow && typeof oddsGlow === 'function' && oddsGlow()) return Object.assign({ k: 'finish', pct: oddsPct() }, btn('bauto'));
  const onGlass = (x, y) => { const X = sx((x + .5) * U.tw), Y = sy((y + .5) * U.th); return X > 8 && X < W - 8 && Y > TOPH + 8 && Y < H - BOTH - 8 ? { x: X, y: Y } : null; };
  /* the first tap on a man or a tile shows; the second on the same spot does */
  if (U.pend && U.pend.target) { const q = onGlass(U.pend.target.x, U.pend.target.y); if (q) return Object.assign({ k: 'confirm', what: 'hit' }, q); }
  if (U.pend && U.pend.tile) { const q = onGlass(U.pend.tile.x, U.pend.tile.y); if (q) return Object.assign({ k: 'confirm', what: 'walk' }, q); }
  if (F.emptyGun(u) && F.canReload(u)) return Object.assign({ k: 'reload' }, btn('breload'));
  const theirs = S.units.filter(v => v.side === 'them' && F.onField(v) && F.sideSees('you', v));
  const inReach = theirs.filter(v => F.canStrike(u, v) && !F.dryAt(u, v)).map(v => ({ v: v, c: F.hitChance(u, v).chance })).sort((a, b) => b.c - a.c);
  if (inReach.length) { const q = onGlass(inReach[0].v.x, inReach[0].v.y); if (q) return Object.assign({ k: 'aim', c: inReach[0].c }, q); }
  /* no blow from here: the tile from which a man of theirs is in reach with the AP for the blow, else the closest he can get */
  const f = F.reach(u, null, true), keys = Object.keys(f.best), x0 = u.x, y0 = u.y, ap0 = u.ap;
  const near = (x, y) => theirs.reduce((m, v) => Math.min(m, Math.max(Math.abs(v.x - x), Math.abs(v.y - y))), Infinity);
  let best = null, bs = -Infinity;
  keys.forEach(key => { const p = key.split(',').map(Number), x = p[0], y = p[1]; if (x === x0 && y === y0) return; if (!onGlass(x, y)) return;
    const cost = f.best[key]; u.x = x; u.y = y; u.ap = ap0 - cost;
    const can = theirs.some(v => F.canStrike(u, v)); u.x = x0; u.y = y0; u.ap = ap0;
    const sc = (can ? 1000 : 0) - near(x, y) * 10 - cost * (can ? 1 : 0) + (S.cover[y] && S.cover[y][x] ? 3 : 0);
    if (sc > bs) { bs = sc; best = { x: x, y: y, can: can }; } });
  u.x = x0; u.y = y0; u.ap = ap0;
  if (best && (best.can || near(best.x, best.y) < near(x0, y0))) return Object.assign({ k: 'walk' }, onGlass(best.x, best.y));
  return Object.assign({ k: 'end' }, btn('bend'));
};

async function fight(file, fd, seed) {
  const o = Object.assign({ seed: seed, company: COMPANY, cap: ORIGIN.field_cap, party: fd.party, kind: 'suburb', formation: null, auto: AUTO }, HAND ? { hand: HAND } : {});
  const d = await open(Object.assign({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) + ';(' + SAMPLER.toString() + ')();' },
    file ? { serve: { '/slices/BOHEMIA_FIGHT.html': file } } : {}));
  const p = d.page, taps = { decide: 0, confirm: 0, skip: 0, by: {} };
  await p.waitForFunction(() => window.FIGHT_UI && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
  const wall0 = Date.now();
  let guard = 0, lastTheirsTap = 0;
  for (; guard < 4000; guard++) {
    const pl = await p.evaluate(PLAN, { glow: GLOW });
    if (pl.k === 'over') break;
    if (pl.k === 'wait') { await p.waitForTimeout(40); continue; }
    if (pl.k === 'theirs') { if (SKIP && Date.now() - lastTheirsTap > 400) { await p.touchscreen.tap(195, 420); taps.skip++; lastTheirsTap = Date.now(); } await p.waitForTimeout(40); continue; }
    if (pl.x === undefined) { await p.waitForTimeout(40); continue; }
    await p.touchscreen.tap(pl.x, pl.y);
    if (pl.k === 'confirm') taps.confirm++; else taps.decide++;
    taps.by[pl.k] = (taps.by[pl.k] || 0) + 1;
    await p.waitForTimeout(60);
  }
  await p.waitForFunction(() => window.__BYHAND.ended, null, { timeout: 60000 });
  const B = await p.evaluate(() => { const B = window.__BYHAND; return { t: B.t, rounds: B.rounds, result: B.result, mine: B.mine, span: B.ended - B.started,
    you: FIGHT.S.units.filter(v => v.side === 'you').length, them: FIGHT.S.units.filter(v => v.side === 'them').length,
    youUp: FIGHT.S.units.filter(v => v.side === 'you' && FIGHT.onField(v)).length, speed: FIGHT_UI.speed }; });
  const errs = d.errs.slice(0, 3);
  await d.close();
  const sec = k => Math.round((B.t[k] || 0)) / 1000;
  const machine = sec('open') + sec('theirs') + sec('mine_motion') + sec('spent') + sec('between') + sec('end') + sec('auto_mine');
  const finger = AUTO ? 0 : taps.decide * DECIDE_S + taps.confirm * CONFIRM_S;
  return { fight: fd.name, seed: seed, result: B.result, rounds: B.rounds, his_turns: B.mine, men: B.you + ' v ' + B.them, his_up_at_end: B.youUp,
    taps: taps, seconds: { open: sec('open'), formation_wait: sec('deploy_wait'), theirs: sec('theirs'), his_motion: sec('mine_motion'), out_of_ap: sec('spent'),
      auto_his: sec('auto_mine'), recap: sec('end'), waited_on_bot: sec('mine_wait') },
    machine_s: Math.round(machine * 10) / 10, finger_s: Math.round(finger * 10) / 10, by_hand_s: Math.round((machine + finger) * 10) / 10,
    bot_wall_s: Math.round((Date.now() - wall0) / 100) / 10, errors: errs };
}

(async () => {
  const file = FILE ? path.resolve(FILE) : null, out = [];
  for (const fd of FIGHTS) for (const s of SEEDS) {
    const r = await fight(file, fd, s); out.push(r);
    console.log('  ' + fd.name + ' seed ' + s + ': ' + r.result + ' in ' + r.rounds + ' rounds, ' + r.his_turns + ' of his turns, ' + r.taps.decide + ' decisions + ' + r.taps.confirm
      + ' confirms; machine ' + r.machine_s + ' s (theirs ' + r.seconds.theirs + ', his motion ' + r.seconds.his_motion + '), finger ' + r.finger_s + ' s, BY HAND ' + r.by_hand_s + ' s'
      + (r.errors.length ? '  ERR ' + r.errors[0] : ''));
  }
  const mean = (a, f) => Math.round(a.reduce((t, r) => t + f(r), 0) / a.length * 10) / 10;
  const sum = FIGHTS.map(fd => { const a = out.filter(r => r.fight === fd.name); return { fight: fd.name, n: a.length, won: a.filter(r => r.result === 'won').length,
    by_hand_s: mean(a, r => r.by_hand_s), machine_s: mean(a, r => r.machine_s), theirs_s: mean(a, r => r.seconds.theirs), his_motion_s: mean(a, r => r.seconds.his_motion),
    finger_s: mean(a, r => r.finger_s), his_turns: mean(a, r => r.his_turns), rounds: mean(a, r => r.rounds), decisions: mean(a, r => r.taps.decide), confirms: mean(a, r => r.taps.confirm) }; });
  sum.forEach(s => console.log('  == ' + s.fight + ': won ' + s.won + '/' + s.n + ', BY HAND ' + s.by_hand_s + ' s (machine ' + s.machine_s + ': theirs ' + s.theirs_s + ', his motion ' + s.his_motion_s + '; finger ' + s.finger_s + '), ' + s.his_turns + ' of his turns, ' + s.rounds + ' rounds'));
  const dir = path.join(ROOT, 'records/target/combat_by_hand'); fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, LABEL + '.json');
  fs.writeFileSync(f, JSON.stringify({ label: LABEL, mode: AUTO ? 'auto' : (SKIP ? 'by hand, skips their turns' : 'by hand, watches their turns') + (GLOW ? ', takes the glowing AUTO' : '') + (HAND ? ', speed ' + HAND + 'x' : ''), file: FILE || 'slices/BOHEMIA_FIGHT.html',
    profile: 'phone_portrait 390 x 844 at 3x, touch', klm: KLM, decide_s: DECIDE_S, confirm_s: CONFIRM_S, company: ORIGIN.id, summary: sum, fights: out }, null, 1));
  console.log('  wrote ' + path.relative(ROOT, f));
})().catch(e => { console.error(e); process.exit(1); });
