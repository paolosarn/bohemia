#!/usr/bin/env node
/* THE WAY IN, RECORDED (COMBAT FIVE 11/26/26, VAMILY rule 484(b); rules 407, 420).
   Paolo 11/26: 'the combat transition still sucks'. The coordinator: record it at phone speed both ways and judge it by eye.
   This films what the glass shows (the compositor's own frames, CDP screencast) from the moment a road party meets him on the
   map, through the meet card's ENGAGE (pressed after 2.5 s, the time a player reads it), the dive down into the fight, a few
   seconds of the fight, a forced win, the end screen's LEAVE and the climb back to the map. Every frame carries its time, so
   the clip plays at the real speed: a held frame is held on the clip as long as it was held on the phone.
   node tools/bohemia_combat_five_the_way_in_record.js <outdir> [--profile phone_portrait|phone_landscape] [--alpha] [--cpu 4]
   Writes <outdir>/frames/*.jpg, <outdir>/frames.json (time, phase), <outdir>/way_in.mp4 (in, then out), <outdir>/sheet_in.jpg,
   <outdir>/sheet_out.jpg (every 6th frame with its time and what the dive said it was doing), and prints the gaps. */
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const args = process.argv.slice(2);
const OUT = args[0] && !/^--/.test(args[0]) ? path.resolve(args[0]) : path.join(require('os').tmpdir(), 'way_in_' + process.pid);
const opt = (k, dflt) => { const i = args.indexOf('--' + k); return i < 0 ? dflt : (args[i + 1] && !/^--/.test(args[i + 1]) ? args[i + 1] : true); };
const PROFILE = opt('profile', 'phone_portrait'), CPU = +opt('cpu', 4), ALPHA = !!opt('alpha', false), HOLD_FIGHT = +opt('fightms', 3500);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true });
  for (const f of fs.readdirSync(path.join(OUT, 'frames'))) fs.unlinkSync(path.join(OUT, 'frames', f));
  const d = await D.open({ profile: PROFILE, alpha: ALPHA });
  const errs = []; d.page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const REQS = new Set(); d.page.on('request', q => REQS.add(q.url().replace(/^https?:\/\/[^/]+/, ''))); d.page.on('requestfinished', q => REQS.delete(q.url().replace(/^https?:\/\/[^/]+/, ''))); d.page.on('requestfailed', q => { REQS.delete(q.url().replace(/^https?:\/\/[^/]+/, '')); errs.push('REQFAIL ' + q.url().slice(-80)); });
  const LWAIT = +opt('leavewait', 30000);
  const M = (fn, a) => d.page.evaluate(fn, a);
  for (let i = 0; i < 200; i++) { if (await d.fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'city' && typeof cityHandOver === 'function' && !!(window.om && om.n)).catch(() => false)) break; await sleep(500); }
  await sleep(3000);
  /* where he is when they meet him: on the open map (the usual way, off the town's ground, its screen shut), or in a town (--where town) */
  const WHERE = opt('where', 'map');
  if (WHERE === 'map') {
    await d.fr.evaluate(D.offTheTown).catch(() => null);
    await d.fr.evaluate(() => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} }).catch(() => null);
    await sleep(2500);
    const shut = await d.fr.evaluate(() => !(LOOP.frame && LOOP.frame.style.display !== 'none')).catch(() => null);
    console.log('  on the open map: town screen shut ' + shut + ', zoom ' + await d.fr.evaluate(() => CZOOM.toFixed(2)).catch(() => '?'));
  }
  const ZOOM = opt('zoom', null);
  if (ZOOM) { await d.fr.evaluate((z) => { CZOOM = +z; TW = TW0 * CZOOM; TH = TH0 * CZOOM; try { centerCam(); } catch (e) {} render(); }, ZOOM).catch(() => null); await sleep(1500); }
  await M(() => { window.__DIVE_MARKS = true; });
  if (CPU > 1) await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  await sleep(1500);

  /* the film: every frame the compositor sends, with its own time and what the dive and the door said at that moment */
  const frames = []; let phase = 'map', seq = 0, t0 = null;
  const vp = PROFILE === 'phone_landscape' ? { w: 844, h: 390 } : { w: 390, h: 844 };
  d.cdp.on('Page.screencastFrame', async (f) => {
    try { await d.cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
    const ts = f.metadata && f.metadata.timestamp; if (t0 == null) t0 = ts;
    const name = 'f' + String(seq++).padStart(5, '0') + '.jpg';
    fs.writeFileSync(path.join(OUT, 'frames', name), Buffer.from(f.data, 'base64'));
    frames.push({ name, t: Math.round((ts - t0) * 1000), phase, wall: Date.now() });
  });
  const state = () => M(() => { let st = '?', nfc = '?', ff = false, meet = false, spoils = false;
    try { st = BohemiaMotion.dive.state(); } catch (e) {} try { nfc = NFC.state; } catch (e) {}
    try { ff = !!document.getElementById('fightFrame'); } catch (e) {}
    try { meet = !!document.getElementById('cityFrame').contentWindow.MEET.up; } catch (e) {}
    try { spoils = !!(window.SPOILS && SPOILS.frame); } catch (e) {}
    return { st, nfc, ff, meet, spoils }; });
  /* a sampler of the dive's state on the page's own clock, folded into the frame list after */
  const stTimes = [];
  const poll = setInterval(async () => { try { const s = await state(); stTimes.push({ t: Date.now(), s }); const ph = s.meet ? 'card' : s.st !== 'off' ? 'dive:' + s.st : s.spoils ? 'spoils' : s.ff ? 'fight' : 'map'; if (!/^(in|out)/.test(phase) || ph !== 'map') phase = (phase.startsWith('out') && ph !== 'spoils' ? 'out ' : '') + ph; } catch (e) {} }, 60);
  await d.cdp.send('Page.startScreencast', { format: 'jpeg', quality: 72, maxWidth: vp.w * 2, maxHeight: vp.h * 2, everyNthFrame: 1 });
  await sleep(1200);

  /* the meeting: a road crew two blocks off his crew, through the map's one door (the card first, as he meets it) */
  const z0 = await d.fr.evaluate(() => ({ z: CZOOM, city: [city.x, city.y] }));
  const at = { gx: z0.city[0] + 2, gy: z0.city[1] + 1 };
  const CARD = !opt('nocard', false);
  await d.fr.evaluate(([at, card]) => { const pm = partyMath('job', { skulls: 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
    const go = () => cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why: 'party:way-in-record', at });
    if (card && typeof meetWalk === 'function') meetWalk(go); else go(); }, [at, CARD]);
  let carded = false;
  for (let i = 0; i < 30; i++) { if ((await state()).meet) { carded = true; break; } await sleep(100); }
  let engageWall = null; if (carded) { await sleep(+opt("read", 2500)); engageWall = Date.now(); await d.fr.evaluate(() => { try { MEET_DONE(true); } catch (e) {} }); }
  const tIn = Date.now();
  /* in: until the fight is his and the dive is done, then the fight a few seconds */
  while (Date.now() - tIn < 60000) { const s = await state(); if (s.ff && s.st === 'off' && s.nfc === 'off') break; await sleep(100); }
  const inMs = Date.now() - tIn;
  await sleep(HOLD_FIGHT);
  const down = await M(() => { try { return JSON.parse(JSON.stringify(BohemiaMotion.dive.log.filter(r => r.kind === 'down').pop() || null)); } catch (e) { return null; } });
  /* the fight won by force, the end screen, then LEAVE as he taps it */
  const h = await d.page.$('#fightFrame'), f = h && await h.contentFrame();
  if (f) await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} }).catch(() => {});
  for (let k = 0; k < 160 && !(await state()).spoils; k++) await sleep(250);
  /* the film rests while the end screen loads (its own load is not the way home; filming it at 60 a second starved this box's one
     server and the screen's tables never came), and rolls again before LEAVE */
  await d.cdp.send('Page.stopScreencast').catch(() => {});
  /* LEAVE pressed the way a thumb presses it: once it is on the glass, on top, and still (FIXES 2's tool) */
  const { leaveAt } = require(path.join(ROOT, 'tools/bohemia_leave_the_end_screen.js'));
  let lv = null, lvLast = null; const tW = Date.now();
  while (Date.now() - tW < LWAIT) { const a = await leaveAt(d.page); if (!a.why) { if (lvLast && Math.abs(lvLast.x - a.x) < 1 && Math.abs(lvLast.y - a.y) < 1) { lv = a; break; } lvLast = a; } else lvLast = null; await sleep(120); }
  if (!lv) { const sf = d.page.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    const why = sf ? await sf.evaluate(() => { try { const S = BohemiaSpoilsScreen.state; return { ready: !!S.ready, pending: !!S.pending, failed: !!S.failed, opened: S.opened | 0, live: document.documentElement.classList.contains('sp-live'), C: typeof C, cload: !!(window.C && C.load) }; } catch (e) { return 'ERR ' + e.message; } }).catch(e => 'EVAL ' + e.message) : 'no end screen frame';
    const sh = await M(() => ({ sent: window.SPOILS && SPOILS.sent, seq: window.SPOILS && SPOILS.seq, frame: !!(window.SPOILS && SPOILS.frame) }));
    console.log('  THE END SCREEN NEVER OFFERED LEAVE: ' + JSON.stringify(why) + ' shell ' + JSON.stringify(sh) + ' open requests ' + JSON.stringify([...REQS].slice(0, 12))); }
  await sleep(+opt('look', 1200));   /* he reads what the fight paid */
  phase = 'out';
  await d.cdp.send('Page.startScreencast', { format: 'jpeg', quality: 72, maxWidth: vp.w * 2, maxHeight: vp.h * 2, everyNthFrame: 1 });
  await sleep(300);
  const tOut = Date.now();
  const leaveWall = Date.now();
  if (lv) await d.page.touchscreen.tap(lv.x, lv.y); else await M(() => { try { spoilsLeave(); } catch (e) {} });
  console.log('  LEAVE ' + (lv ? 'tapped at ' + Math.round(lv.x) + ',' + Math.round(lv.y) + ' after ' + (Date.now() - tW) + ' ms' : 'NOT ON THE GLASS: spoilsLeave()'));
  while (Date.now() - tOut < 40000) { const s = await state(); if (!s.ff && s.st === 'off' && s.nfc === 'off' && Date.now() - tOut > 800) break; await sleep(100); }
  const outMs = Date.now() - tOut;
  await sleep(1800);
  clearInterval(poll);
  await d.cdp.send('Page.stopScreencast').catch(() => {});
  const up = await M(() => { try { return JSON.parse(JSON.stringify(BohemiaMotion.dive.log.filter(r => r.kind === 'up').pop() || null)); } catch (e) { return null; } });
  await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
  await d.close();

  /* the gaps: a frame the glass held, how long */
  const gaps = (lo, hi) => { const g = []; for (let i = 1; i < frames.length; i++) { const a = frames[i - 1], b = frames[i]; if (b.t >= lo && b.t <= hi) g.push({ ms: b.t - a.t, at: a.t, phase: a.phase }); } return g; };
  const first = (re) => (frames.find(x => re.test(x.phase)) || {}).t;
  const tAtWall = (w) => { if (w == null) return null; const f = frames.find(x => x.wall >= w); return f ? f.t : null; };
  const inA = tAtWall(engageWall) != null ? tAtWall(engageWall) : first(/^card|^dive/), outA = tAtWall(leaveWall) != null ? tAtWall(leaveWall) : first(/^out/);
  const lastIn = frames.filter(x => !/^out/.test(x.phase)).pop(), lastT = frames.length ? frames[frames.length - 1].t : 0;
  const sum = (g) => { const ms = g.map(x => x.ms).sort((a, b) => a - b); return { n: ms.length, med: ms[ms.length >> 1] || 0, p90: ms[Math.floor(ms.length * 0.9)] || 0, worst: ms[ms.length - 1] || 0, over100: ms.filter(x => x > 100).length, over250: ms.filter(x => x > 250).length }; };
  const gIn = gaps(inA || 0, outA || lastT), gOut = gaps(outA || lastT, lastT);
  const report = { engageT: tAtWall(engageWall), leaveT: tAtWall(leaveWall), profile: PROFILE, cpu: CPU, alpha: ALPHA, carded, inMs, outMs, frames: frames.length, in: sum(gIn), out: sum(gOut),
    worstIn: gIn.slice().sort((a, b) => b.ms - a.ms).slice(0, 6), worstOut: gOut.slice().sort((a, b) => b.ms - a.ms).slice(0, 6),
    down, up, errs };
  fs.writeFileSync(path.join(OUT, 'frames.json'), JSON.stringify({ report, frames }, null, 1));
  console.log(JSON.stringify(Object.assign({}, report, { down: down && { phases: down.phases, buildAt: down.buildAt, built: down.built, renders: down.renders, comeMs: down.comeMs, retimed: down.retimed, step: down.step, drawMs: down.drawMs, firstFrame: down.firstFrame, pushAt: down.pushAt, exposure: down.exposure }, up: up && { phases: up.phases } })));

  /* the clip at the real speed: each frame held until the next one came */
  const list = [];
  for (let i = 0; i < frames.length; i++) { const dur = i + 1 < frames.length ? (frames[i + 1].t - frames[i].t) / 1000 : 0.5;
    list.push("file 'frames/" + frames[i].name + "'"); list.push('duration ' + Math.max(0.001, dur).toFixed(3)); }
  if (frames.length) list.push("file 'frames/" + frames[frames.length - 1].name + "'");
  fs.writeFileSync(path.join(OUT, 'concat.txt'), list.join('\n') + '\n');
  try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'concat.txt'), '-vsync', 'cfr', '-r', '30',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-movflags', '+faststart', path.join(OUT, 'way_in.mp4')], { cwd: OUT });
    console.log('clip: ' + path.join(OUT, 'way_in.mp4'));
  } catch (e) { console.log('ffmpeg failed: ' + String(e).slice(0, 200)); }
})().catch(e => { console.error(e); process.exit(1); });
