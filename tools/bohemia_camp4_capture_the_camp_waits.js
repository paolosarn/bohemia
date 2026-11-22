/* THE CAMP WAITS FOR YOU -- the VOTE card's sheet (CAMP FOUR, 11/22/26, VAMILY rule 472). The demo as he plays it, the phone upright and on
   its side: a fight won, MAKE CAMP tapped, the glass shot from the tap (the hold, the camp's first frame on the fight's own street, his men
   setting it up, the hours while they mend, the clock stopped with the phone saying HIT THE ROAD, two fingers in on one of his men), then
   his thumb on HIT THE ROAD and the map. Each shot carries its time from the tap and the camp's clock. Writes PNGs and a JSON index; the
   sheet is laid out by tools/bohemia_camp4_lay_the_sheet.py.
     node tools/bohemia_camp4_capture_the_camp_waits.js OUTDIR [--alpha] [--way upright|side] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const K = require(path.join(ROOT, 'tools/bohemia_camp_is_the_board.js'));
const OUT = process.argv[2]; if (!OUT) { console.error('usage: OUTDIR'); process.exit(2); }
const ALPHA = process.argv.indexOf('--alpha') > 0, WAY = (() => { const i = process.argv.indexOf('--way'); return i > 0 ? process.argv[i + 1] : null; })();
fs.mkdirSync(OUT, { recursive: true });
const WAYS = [{ name: 'upright', profile: 'phone_portrait' }, { name: 'side', profile: 'phone_landscape' }].filter(w => !WAY || w.name === WAY);
(async () => {
  const index = [];
  for (const way of WAYS) {
    const d = await D.open({ profile: way.profile, door: 180000, engage: true, alpha: ALPHA || undefined });
    const p = d.page, fr = d.fr; await p.waitForTimeout(2500);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} });
    await fr.evaluate(D.offTheTown);
    /* his men hurt before the fight, so the camp has something to mend (the healing gate's own cut) */
    await fr.evaluate(() => { const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null') || { men: {}, dead: [] }; s.men = s.men || {}; s.dead = s.dead || [];
      BohemiaCondition.company().names.forEach(k => { s.men[k] = Object.assign(s.men[k] || {}, { shown: (s.men[k] && s.men[k].shown) || k, main: k === 'YOU', hpMax: 60, lostHp: 24, armHMax: 20, lostH: 8, armBMax: 80, lostB: 30, wound: null }); });
      localStorage.setItem(KEY, JSON.stringify(s)); const W = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}'); W.tape = 400; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(W)); });
    const r = await K.oneFight(d, { fam: '^suburb$', end: 'won', watch: true, lootMs: 2500 });
    /* the camp driver holds the map's campDone off for the old gates' measures; the game's own stop is what this sheet shows */
    await fr.evaluate(() => { if (window.__GATE_HELD) { campDone = window.__GATE_HELD; window.__GATE_HELD = null; } });
    const clockOf = (t) => { let c = null; (r.watch && r.watch.samples || []).forEach(q => { if (q.t <= t && q.clock != null) c = q.clock; }); return c; };
    const keep = (png, label, t, clock) => { const f = path.join(OUT, way.name + '_' + String(index.length).padStart(2, '0') + '.png'); fs.writeFileSync(f, png); index.push({ way: way.name, file: f, label, t, clock }); };
    const S = (r.watch && r.watch.shots) || [], Sm = (r.watch && r.watch.samples) || [], first = Sm.find(q => q.campShown && q.first), setOn = Sm.filter(q => q.pitch === 'on');
    const at = (t) => S.reduce((b, q) => (!b || Math.abs(q.t - t) < Math.abs(b.t - t)) ? q : b, null);
    if (r.fightShot) keep(r.fightShot, 'THE FIGHT WON (ITS LAST FRAME)', null, clockOf(0));
    const hold = Sm.find(q => q.hold); if (hold && at(hold.t + 150)) { const q = at(hold.t + 150); keep(q.png, 'MAKE CAMP TAPPED: THE LOOT SCREEN FOLDS AWAY, THE STREET HELD', q.t, clockOf(q.t)); }
    if (first && at(first.t)) { const q = at(first.t + 100); keep(q.png, 'THE CAMP\'S FIRST FRAME', q.t, clockOf(q.t)); }
    if (setOn.length) { const mid = setOn[Math.floor(setOn.length * 0.55)]; const q = at(mid.t); if (q) keep(q.png, 'THEY SET IT UP, THE CLOCK STOPPED', q.t, clockOf(q.t)); }
    /* the hours while they mend, then the stop */
    let t0 = Date.now(), shotMend = false;
    for (let k = 0; k < 120; k++) { const st = await fr.evaluate(() => ({ on: CAMP.on, whole: !!CAMP.whole, hours: CAMP.hours, clock: T.day * 1440 + T.min }));
      if (!shotMend && st.hours >= 2 && !st.whole) { shotMend = true; keep(await p.screenshot(), 'THE HOURS RUN WHILE THEY MEND', null, st.clock); }
      if (st.whole || !st.on) break; await p.waitForTimeout(250); }
    await p.waitForTimeout(2500);
    const wc = await fr.evaluate(() => T.day * 1440 + T.min);
    keep(await p.screenshot(), 'WHOLE: THE CLOCK STOPS, THE PHONE SAYS IT', null, wc);
    await p.waitForTimeout(9000);
    keep(await p.screenshot(), '9 S LATER: THE SAME MINUTE, THEY MOVE ABOUT', null, await fr.evaluate(() => T.day * 1440 + T.min));
    /* two fingers in, on the middle of the camp */
    if (way.profile === 'phone_portrait') {
      const box = await p.evaluate(() => { const f = document.getElementById('cityFrame').getBoundingClientRect(); return [f.left + f.width / 2, f.top + f.height * 0.42]; });
      const cdp = await p.context().newCDPSession(p), pts = (dx) => [{ x: box[0] - 30 - dx, y: box[1], id: 1 }, { x: box[0] + 30 + dx, y: box[1], id: 2 }];
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts(0) });
      for (let k = 1; k <= 12; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pts(k * 22) }); await p.waitForTimeout(40); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(800);
      keep(await p.screenshot(), 'TWO FINGERS IN: SEE THEM CHILLING', null, await fr.evaluate(() => T.day * 1440 + T.min));
    }
    /* his thumb on HIT THE ROAD */
    const xy = await p.evaluate(() => { const b = document.querySelector('#bohphone .bpctx .rd'); if (!b || !b.offsetWidth) return null; const q = b.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; });
    if (xy) { await p.touchscreen.tap(xy[0], xy[1]); await p.waitForTimeout(2600); keep(await p.screenshot(), 'HIS THUMB ON HIT THE ROAD: THE MAP, ON PAUSE', null, await fr.evaluate(() => T.day * 1440 + T.min)); }
    await d.close();
  }
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1));
  console.log('shots: ' + index.length + ' -> ' + OUT);
})().catch(e => { console.error(e); process.exit(1); });
