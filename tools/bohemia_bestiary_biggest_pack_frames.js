#!/usr/bin/env node
/* THE BIGGEST PACK ON A SLOWED PHONE (BESTIARY 2, 11/26, VAMILY rule 480(c)(d): 'make sure fps is never choppy for nothing'; the
   round BESTIARY wrote: 'a fight with the biggest pack holds its frames on a slowed phone (390x844, CPU slowed 4x)').
   The biggest band the dealer makes: a band is asked at most 13 (records/target/bb/party_math.json job and roaming max) and a
   faction's count_scale sizes it (bohemia_enemies.json): the block watch at 1.3 is the biggest, 13 asked is 17 men on the board;
   the coyotes at 1.0 are the biggest pack of animals, 13. On the demo (or ALPHA=1), the phone upright (or WAY=sideways), the map
   up, then the CPU slowed four times (Emulation.setCPUThrottlingRate 4, the rule's own slowed phone), and the band handed through
   the one door every encounter uses (cityHandOver): the fight's first frame, FIGHT and AUTO tapped on the phone's own buttons, AUTO
   played (his three men five times as hard to drop, so seventeen do not end it in a round; nothing else of the fight changes) for
   AUTO_MS or to its end, the win, the end screen, LOOT ALL, LEAVE, the map again.
   Every painted frame of the page is counted (a 1-pixel canvas drawn each frame on the top page: one main thread for the page and
   its fights, so a long task anywhere is a late frame here), and a MARK at every step (never a screenshot: it stalls frames itself).
   Per stretch between two marks: frames a second, the longest frame, every frame past 50 ms (rule 480(d)'s hitch).
   PROFILE=1: a CPU profile of the AUTO stretch, self time by function, so a hitch can be named (the fight's drawing is COMBAT
   FOUR's; a BESTIARY move's own drawing, drawCalled, drawFire, the smoke, is this lane's). PROFILE_LOOT=1: the same, from LOOT ALL
   through the 10 s after it (the end screen's long frame).
   GPU=1: the driver's gpu (the canvas drawn by a GPU process, as a phone draws it; this box otherwise paints every canvas in
   software on the page's own thread, which no phone does).
   node tools/bohemia_bestiary_biggest_pack_frames.js [watch|coyotes|brigands|<faction>] [13] [days]  -> prints RESULT {...} */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; }
const FAC = process.argv[2] || 'watch', N = +(process.argv[3] || 13), DAYS = +(process.argv[4] || 61);
const WAY = process.env.WAY || 'upright', RATE = +(process.env.RATE || 4), AUTO_MS = +(process.env.AUTO_MS || 90000);
(async () => {
  const d = await D.open({ profile: WAY === 'sideways' ? 'phone_landscape' : 'phone_portrait', alpha: process.env.ALPHA === '1', gpu: process.env.GPU === '1' });
  const fr = d.fr, p = d.page, errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const out = { faction: FAC, asked: N, days: DAYS, way: WAY, rate: RATE, gpu: process.env.GPU === '1', alpha: process.env.ALPHA === '1' };
  const tapAt = async (frame, sel) => { const h = await frame.$(sel); if (!h) return false; const bb = await h.boundingBox(); if (!bb || bb.width < 2) return false; await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); return true; };
  try {
    await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaCarcass && BohemiaCarcass.ready()), 120000);
    await sleep(4000);
    /* the frame counter: one pixel drawn on every frame the top page gets */
    await p.evaluate(() => { window.__FR = []; window.__MK = []; const c = document.createElement('canvas'); c.width = c.height = 1; c.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;z-index:99999;pointer-events:none;opacity:.01';
      document.body.appendChild(c); const g = c.getContext('2d'); let i = 0; const tick = (t) => { g.fillStyle = (i++ & 1) ? '#000' : '#010101'; g.fillRect(0, 0, 1, 1); window.__FR.push(t); requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    const mark = (k) => p.evaluate((k) => window.__MK.push([k, performance.now()]), k);
    const cdp = await p.context().newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE });
    await sleep(3000); await mark('the map, standing');
    await sleep(5000); await mark('the band handed over');
    /* the dealer's own roll first, for its count (the one door does the same roll) */
    out.band = await fr.evaluate((o) => { DAY.day = o.days; const m = { type: 'BOHEMIA_CITY_ENCOUNTER', party: { count: o.n, faction: o.f, days: o.days, difficulty: 0 }, why: 'gate:biggest pack', at: { gx: city.x, gy: city.y } };
      try { BohemiaJobDanger.rollInto(m); } catch (e) {} return m.party.band || null; }, { f: FAC, n: N, days: DAYS });
    await fr.evaluate((o) => { try { travelStop(); } catch (e) {} window.__FIGHT_CAME_HOME = null; DAY.day = o.days;
      cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: o.f, faction: null, draft: true, roster: [{ arch: 'bandit' }], party: { count: o.n, faction: o.f, days: o.days, difficulty: 0 }, street: true, why: 'gate:biggest pack', at: { gx: city.x, gy: city.y }, __met: true }); }, { f: FAC, n: N, days: DAYS });
    const f = await waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 90000);
    if (!f) throw new Error('the fight never opened');
    await mark('the fight\'s first frame');
    await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 30000); await mark('the camera down, the line set');
    out.board = await f.evaluate(() => ({ them: FIGHT.S.units.filter(u => u.side === 'them').length, you: FIGHT.S.units.filter(u => u.side === 'you').length, kinds: FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind), w: FIGHT.S.w, h: FIGHT.S.h }));
    await sleep(3000); await mark('the line set, standing');
    await f.evaluate(() => FIGHT.S.units.forEach(u => { if (u.side === 'you') { u.hpMax = (u.hpMax || u.hp) * 5; u.hp = u.hpMax; } }));
    if (await f.evaluate(() => !!FIGHT.S.deploy)) { await tapAt(p, '#bohphone .fight [data-c="go"]'); await waitFor(() => f.evaluate(() => !FIGHT.S.deploy), 20000); }
    await mark('FIGHT tapped');
    await tapAt(p, '#bohphone .fight [data-c="auto"]'); out.auto = await f.evaluate(() => !!UI.auto);
    await mark('AUTO');
    if (process.env.PROFILE) { await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start'); }
    const t0 = Date.now(); let lastMk = t0;
    while (Date.now() - t0 < AUTO_MS && !(await f.evaluate(() => FIGHT.S.over).catch(() => true))) { await sleep(500); if (Date.now() - lastMk > 15000) { lastMk = Date.now(); await mark('AUTO, ' + Math.round((Date.now() - t0) / 1000) + ' s'); } }
    if (process.env.PROFILE) { const { profile } = await cdp.send('Profiler.stop'); out.profile = selfTimes(profile); }
    out.fight = await f.evaluate(() => ({ over: !!FIGHT.S.over, result: FIGHT.S.result || null, round: FIGHT.S.round, log: FIGHT.S.log.length, skills: FIGHT.S.log.filter(e => e.t === 'skill').reduce((a, e) => { a[e.skill] = (a[e.skill] || 0) + 1; return a; }, {}) }));
    await mark('the AUTO stretch ends');
    await f.evaluate(() => { const S = FIGHT.S; if (S.over) return; S.units.forEach(u => { if (u.side === 'them' && !u.fled) { u.hp = 0; u.dead = true; } }); S.over = true; S.result = 'won'; showOver('won'); });
    await mark('the win');
    const sf = await waitFor(async () => { const e = await p.$('#spoilsdoor iframe'), c = e && await e.contentFrame(); return c && await c.evaluate(() => { const S = window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state; return S && S.ready && S.found ? true : null; }) ? c : null; }, 60000);
    await mark('the end screen up');
    if (sf) { await sleep(3000); await mark('the end screen, standing');
      await waitFor(() => sf.evaluate(() => { const b = document.getElementById('lootall'); return b && !b.disabled && b.getBoundingClientRect().width > 2; }), 15000);
      if (process.env.PROFILE_LOOT) { await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start'); }
      await tapAt(sf, '#lootall'); await mark('LOOT ALL'); await sleep(2500); await mark('the loot taken');
      if (process.env.PROFILE_LOOT) { await sleep(8000); const { profile } = await cdp.send('Profiler.stop'); out.profileLoot = selfTimes(profile); } }
    const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
    await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), c = e && await e.contentFrame(); if (c) { await tapAt(c, '#leave'); await sleep(2000); } return (await gone()) || null; }, 60000);
    await mark('LEAVE, the map again');
    await sleep(4000); await mark('the map, standing again');
    await sleep(3000); await mark('end');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    const T = await p.evaluate(() => ({ fr: window.__FR, mk: window.__MK }));
    out.stretches = [];
    for (let i = 0; i < T.mk.length - 1; i++) {
      const a = T.mk[i][1], b = T.mk[i + 1][1], fs = T.fr.filter(t => t >= a && t <= b), gaps = [];
      for (let j = 1; j < fs.length; j++) gaps.push(fs[j] - fs[j - 1]);
      const head = fs.length ? fs[0] - a : b - a, tail = fs.length ? b - fs[fs.length - 1] : 0; gaps.push(head, tail);   /* a stall at a stretch's edge counts too */
      const hitches = gaps.filter(g => g > 50);
      out.stretches.push({ from: T.mk[i][0], ms: Math.round(b - a), fps: +(fs.length * 1000 / Math.max(1, b - a)).toFixed(1), longest: Math.round(Math.max.apply(null, gaps)), over50: hitches.length, worst5: hitches.sort((x, y) => y - x).slice(0, 5).map(Math.round) });
    }
  } catch (e) { out.err = String(e && e.stack || e).slice(0, 400); }
  out.errs = errs;
  try { await d.close(); } catch (e) {}
  console.log('RESULT ' + JSON.stringify(out));
})();
/* a CPU profile's self time by function (name, file, line), the top 40 */
function selfTimes(profile) {
  const by = {}, nodes = {}; profile.nodes.forEach(n => { nodes[n.id] = n; });
  const dt = profile.timeDeltas || [], ss = profile.samples || [];
  for (let i = 0; i < ss.length; i++) { const n = nodes[ss[i]]; if (!n) continue; const cf = n.callFrame, k = (cf.functionName || '(anon)') + ' ' + String(cf.url || '').split('/').pop() + ':' + (cf.lineNumber + 1); by[k] = (by[k] || 0) + (dt[i] || 0) / 1000; }
  const total = Object.values(by).reduce((a, b) => a + b, 0);
  return { total_ms: Math.round(total), top: Object.keys(by).sort((a, b) => by[b] - by[a]).slice(0, 40).map(k => [k, Math.round(by[k])]) };
}
