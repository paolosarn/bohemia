#!/usr/bin/env node
/* BOHEMIA -- ANIMATION [the crawl] (rule 390): THE CRAWL ON ITS REAL SURFACE (DIRECTION's recipe step 7: a picture from the
   game's own camera where he meets it, on his phone's size). The real fight (slices/BOHEMIA_FIGHT.html, the demo's own fight
   page) on the phone's profile (390 x 844, three device pixels a CSS pixel), opened through the shared driver: a man of HIS
   in the bare-armed crewman's look (cast_barearms, the golden piece's man) struck down the fight's way (down, alive, his fall
   played), a thug (tier_thug, the bar's body) standing over him where he fell; the fight left waiting on his turn, the camera
   held on them at the fight's own zoom (a pinch holds it, rule 288(c)); every quarter second for the whole arc his drawn crawl
   is read off the page (UI.crawlAt, the block's own record) and pictures are cut at the keys that show each weight.
     node tools/bohemia_animation_the_crawl_capture.js            pictures into records/target/animation/crawl_shots/
     node tools/bohemia_animation_the_crawl_capture.js --gate     no pictures; prints CRAWL {...} for gates/the_crawl_gate.py W4
   REUSE CHECK: the driver is PLUMBER's (tools/bohemia_drive_the_demo.js open); the fight, its camera and its fall are COMBAT's,
   untouched (the man is put down with the same four fields its 'down' note sets). REFERENCE CHECK: the bar's thug beside him. */
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const GATE = process.argv.includes('--gate');
const OUT = path.join(ROOT, 'records/target/animation/crawl_shots');
const LOOK = 'cast_barearms', THUG = 'tier_thug';

(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:3,speed:1,kind:"strip",deploy:false}' });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length && !FIGHT.S.deploy, null, { timeout: 90000 });
  await p.waitForTimeout(1500);
  const set = await p.evaluate(([LOOK, THUG]) => {
    const S = FIGHT.S, ours = S.units.filter(v => v.side === 'you' && FIGHT.onField(v) && !v.main && !v.beast);
    const man = ours[0] || S.units.filter(v => v.side === 'you' && FIGHT.onField(v))[0];
    if (!man || !DB.rig.looks[LOOK]) return null;
    man.look = LOOK; rigLater('fight_rig/' + DB.rig.looks[LOOK].file);
    /* an open patch of street: nothing solid, no wall and no roof on his tile or the two rows round it (a roof south of a man
       is laid over him, THE LAYERS), nobody within two tiles; the nearest such tile to the board's middle */
    const clear = (x, y) => x >= 0 && y >= 0 && x < S.w && y < S.h && !S.solid[y][x] && FIGHT.rowAt(x, y) !== 'obstacles' && !FIGHT.isRoof(x, y);
    let best = null;
    for (let y = 1; y < S.h - 2; y++) for (let x = 2; x < S.w - 2; x++) {
      let okk = true;
      for (let j = -1; j <= 2 && okk; j++) for (let i = -2; i <= 2 && okk; i++) if (!clear(x + i, y + j)) okk = false;
      if (!okk || S.units.some(u => u !== man && FIGHT.onField(u) && Math.max(Math.abs(u.x - x), Math.abs(u.y - y)) <= 2)) continue;
      const d = Math.hypot(x - S.w / 2, y - S.h / 2); if (!best || d < best.d) best = { x: x, y: y, d: d };
    }
    if (best) { man.x = best.x; man.y = best.y; man._at = undefined; }
    /* the thug: the man of theirs nearest him, in the bar's body, stood on the next tile toward his own side's front */
    const them = S.units.filter(v => v.side === 'them' && FIGHT.onField(v) && !v.beast)
      .sort((a, b) => Math.hypot(a.x - man.x, a.y - man.y) - Math.hypot(b.x - man.x, b.y - man.y))[0];
    let face = 2;
    if (them) { them.look = THUG; rigLater('fight_rig/' + DB.rig.looks[THUG].file);
      const nx = man.x + 1, ny = man.y;
      if (nx < S.w && !S.solid[ny][nx]) { them.x = nx; them.y = ny; them._at = undefined; }
      face = dirOf(them.x - man.x, them.y - man.y); }
    /* struck down the fight's way: the fields its 'down' note sets (rule 156's man who lives), facing the man who dropped him */
    man._face = face; man.hp = 0; man.down = true; man.laidUp = 20; man._fallAt = performance.now(); man.seenFall = true; man._seen = true;
    UI.pinched = true; UI.cx = (man.x + .5) * UI.tw; UI.cy = (man.y + .5) * UI.th;   /* the camera held on him at the fight's own zoom */
    window.__crawlMan = man.id;
    return { id: man.id, look: man.look, x: man.x, y: man.y, face: face, thug: them && them.id, zoom: UI.zoom };
  }, [LOOK, THUG]);
  if (!set) { console.log('CRAWL ' + JSON.stringify({ err: 'no man of his to put down', errors: errs })); await d.browser.close(); process.exit(1); }
  const track = [], shots = [], want = { RO2: 'roll', D_reach1: 'drag_reach', D_pull2: 'drag_pull', E_rest: 'elbows', EL_p2: 'elbows_pull', LA4: 'last_stop', LA6: 'last_open' };
  if (!GATE) fs.mkdirSync(OUT, { recursive: true });
  const t0 = Date.now();
  while (Date.now() - t0 < 52000) {
    const r = await p.evaluate(() => { const v = FIGHT.byId(window.__crawlMan), c = UI.crawlAt && UI.crawlAt[window.__crawlMan];
      UI.pinched = true; UI.cx = (v.x + .5) * UI.tw; UI.cy = (v.y + .5) * UI.th;
      const cv = document.getElementById('cv'), rc = cv.getBoundingClientRect(), k = rc.width / cv.width;   /* canvas px to the page's px */
      const X = rc.left + sx((dx(v) + .5) * UI.tw) * DPR * k, F = rc.top + sy((dy(v) + .9) * UI.th) * DPR * k;
      return { c: c || null, X: X, F: F, s: rigScale() * k, over: FIGHT.S.over }; });
    track.push(r);
    if (!GATE && r.c && want[r.c.pose] && !shots.includes(want[r.c.pose])) {
      const name = want[r.c.pose]; shots.push(name);
      const cx = r.X + r.c.sx * r.s, cy = r.F + r.c.sy * r.s, w = Math.round(150 * r.s), h = Math.round(95 * r.s);
      await p.screenshot({ path: path.join(OUT, 'crawl_' + name + '.png'), clip: { x: Math.max(0, cx - w / 2), y: Math.max(0, cy - h * .62), width: w, height: h } });
      if (name === 'drag_pull') await p.screenshot({ path: path.join(OUT, 'crawl_in_the_fight_phone.png') });
    }
    if (r.c && r.c.key >= 160 && (GATE || shots.length >= Object.keys(want).length)) break;
    await p.waitForTimeout(GATE ? 250 : 120);
  }
  const drawn = track.filter(r => r.c).length, keys = track.filter(r => r.c).map(r => r.c.key);
  const first = track.find(r => r.c), last = [...track].reverse().find(r => r.c);
  const moved = first && last ? Math.hypot(last.c.sx - first.c.sx, last.c.sy - first.c.sy) : 0;
  const along = first && last ? (() => { const th = first.c.face * Math.PI / 4, ux = Math.sin(th), uy = Math.cos(th) * Math.SQRT1_2, n = Math.hypot(ux, uy);
    return ((last.c.sx - first.c.sx) * ux + (last.c.sy - first.c.sy) * uy) / n; })() : 0;
  const R = { set: set, drawn: drawn, keys: keys.length ? [Math.min(...keys), Math.max(...keys)] : null, moved: Math.round(along * 10) / 10,
    poses: [...new Set(track.filter(r => r.c).map(r => r.c.pose))].length, shots: shots, errors: errs };
  console.log('CRAWL ' + JSON.stringify(R));
  try { await d.browser.close(); } catch (e) {}
  process.exit(0);
})().catch(e => { console.log('CRAWL ' + JSON.stringify({ err: String(e && e.stack || e) })); process.exit(1); });
