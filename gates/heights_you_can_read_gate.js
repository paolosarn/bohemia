#!/usr/bin/env node
/* HEIGHTS YOU CAN READ (COMBAT [eyes: heights you can read], EYES line 67; rule 164 item 14, Paolo 10/24: 'one-story versus
   two-story or even a three-story building, I don't know how that helps me and it's hard to tell visually';
   records/BOHEMIA_EYES_EVERY_ASK_CHECKED_ON_THE_LIVE_DEMO_10_25_26.md, pictures k06, k07).
   EYES 10/25 on BUILD 10/25o: on five boards every house read one storey, and a pointer resting on a house before the fight said
   no word of height, cover or sight. Measured 10/26: the rules already stand roofs at two storeys on every board kind but the
   landfill and the shore (the suburb has three-storey ones too); only the drawing did not say it.
   Legs, on the real page:
   H1 every roof wears one chevron a storey over its ladder, on boards that carry one, two and three storey roofs (the suburb, the
      ruin, the strip), and the drawn marks count true: a three-storey roof's chevrons cover half again a two-storey's pixels;
   H2 his computer (1440 x 900): before FIGHT, the mouse resting on a two-storey roof says what its height gives (its storeys, the
      hit, the reach, the sight), and resting on that building's wall says how high it stands and the way up; in his turn the
      same over a wall he cannot walk to;
   H3 his phone (390 x 844 at 3x): a finger held on the building says it;
   H4 nothing threw.
   Run: node gates/heights_you_can_read_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== HEIGHTS YOU CAN READ GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const boot = (profile, o) => open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS=' + JSON.stringify(Object.assign({ speed: 1, formation: null, band: ['brigand_thug'], teach: false, odds: false }, o)) });
const ready = p => p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round !== undefined && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });

/* the roofs of a storey count, the camera on one, its ladder's chevrons counted in the bone colour they are drawn in.
   The roof measured is the first of its storey his men see with nobody standing at its ladder: the fog's dark (his men's sight)
   and a man drawn in front both cover the chevrons, and that is the fog and the man, not the count (measured 10/26 when rule 256
   opened the lines a tile wider: suburb 1's first three-storey roof stood dark at the bell and a man of theirs stood at the
   ladder of the next, 0 and 28 bone pixels; with a clear view every one-storey roof drew 20, two 40, three 60). So the boards are
   read on his lineup, where he reads the roofs before anyone climbs them and nothing is dark (rule 110b). */
async function marks(p, lv) {
  return p.evaluate(lv => new Promise(res => {
    const all = (FIGHT_UI.roofs || []).filter(q => q.lv === lv);
    const S = FIGHT.S, A = FIGHT_UI.fogA, lit = (x, y) => y < 0 || !A || A[y * S.w + x] < .01;   /* the tiles the ladder and its chevrons rise over */
    const clear = q => lit(q.x, q.y) && lit(q.x, q.y - 1) && lit(q.x, q.y - 2) && !S.units.some(v => FIGHT.onField(v) && Math.abs(v.x - q.x) <= 1 && Math.abs(v.y - q.y) <= 2);
    const r = all.filter(clear)[0] || all[0]; if (!r) return res(null);
    FIGHT_UI.cx = (r.x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (r.y + .5) * FIGHT_UI.th; FIGHT_UI.zoom = FIGHT_UI.near || FIGHT_UI.zoom; hud();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const L = (FIGHT_UI.ladders || []).filter(q => q.x === r.x && q.y === r.y)[0]; if (!L) return res({ lv, drawn: false });
      const cv = document.getElementById('cv'), d = window.devicePixelRatio || 1, x0 = Math.max(0, Math.round((L.X - 30) * d)), y0 = Math.max(0, Math.round((L.top - 120) * d));
      const w = Math.round(60 * d), h = Math.round(122 * d), px = cv.getContext('2d').getImageData(x0, y0, w, h).data;
      let n = 0; for (let i = 0; i < px.length; i += 4) if (Math.abs(px[i] - 0xd8) < 6 && Math.abs(px[i + 1] - 0xc9) < 6 && Math.abs(px[i + 2] - 0xa8) < 6) n++;
      res({ lv, drawn: true, marks: L.marks, bone: n });
    }));
  }), lv);
}

(async () => {
  const errs = [];
  /* H1 */
  const seen = {}, bad = [];
  for (const [kind, seed] of [['suburb', 1], ['suburb', 2], ['ruin', 2], ['strip', 2]]) {
    const d = await boot('computer', { seed, kind, deploy: true });   /* on his lineup, where he reads the roofs before anyone climbs (no dark there, rule 110b) */
    d.page.on('pageerror', e => errs.push('H1 ' + kind + ': ' + e.message));
    try {
      await ready(d.page);
      const all = await d.page.evaluate(() => (FIGHT_UI.roofs || []).map(r => r.lv));
      for (const lv of [1, 2, 3]) {
        if (all.indexOf(lv) < 0) continue;
        const m = await marks(d.page, lv); if (!m || !m.drawn) { bad.push(kind + seed + ' lv' + lv + ' not drawn'); continue; }
        if (m.marks !== lv) bad.push(kind + seed + ' lv' + lv + ' wears ' + m.marks);
        (seen[lv] = seen[lv] || []).push(m.bone);
      }
    } catch (e) { errs.push('H1 ' + kind + ': ' + e.message.slice(0, 120)); }
    finally { await d.close(); }
  }
  const avg = lv => seen[lv] && seen[lv].length ? seen[lv].reduce((a, b) => a + b, 0) / seen[lv].length : 0;
  leg(seen[1] && seen[2] && seen[3] && bad.length === 0 && avg(2) > avg(1) * 1.5 && avg(3) > avg(2) * 1.3,
    '*** H1 ONE CHEVRON A STOREY OVER EVERY LADDER *** (EYES line 67): one, two and three storey roofs read apart at a glance, the drawn marks counting true',
    'bone pixels a roof: 1 storey ' + Math.round(avg(1)) + ', 2 storeys ' + Math.round(avg(2)) + ', 3 storeys ' + Math.round(avg(3)) + ' (' + Object.keys(seen).map(k => k + ':' + seen[k].length).join(' ') + ' roofs)' + (bad.length ? ' | ' + bad.slice(0, 3).join('; ') : ''));

  /* H2, H3: a two-storey building on the suburb, before FIGHT and in his turn */
  for (const profile of ['computer', 'phone_portrait']) {
    const d = await boot(profile, { seed: 2, kind: 'suburb', deploy: true });
    const p = d.page; p.on('pageerror', e => errs.push(profile + ': ' + e.message));
    try {
      await ready(p);
      await p.waitForFunction(() => FIGHT.S.deploy && !FIGHT_UI.glide, null, { timeout: 15000 }).catch(() => {});
      /* a two-storey roof tile and a wall tile of the same building, the camera on them */
      const b = await p.evaluate(() => { const S = FIGHT.S;
        for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (FIGHT.isRoof(x, y) && FIGHT.level(x, y) === 2) {
          for (const dd of [[0, 1], [1, 0], [-1, 0], [0, -1], [1, 1], [-1, 1]]) { const wx = x + dd[0], wy = y + dd[1]; if (FIGHT.rowAt(wx, wy) === 'obstacles' && FIGHT.blockNameAt(wx, wy) === FIGHT.blockNameAt(x, y))
            { FIGHT_UI.cx = (x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (y + .5) * FIGHT_UI.th; hud(); return { roof: { x, y }, wall: { x: wx, y: wy } }; } } }
        return null; });
      if (!b) { leg(false, profile + ': a two-storey building with a wall on the suburb', 'none'); continue; }
      await p.waitForTimeout(500);
      const at = q => p.evaluate(q => ({ x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th) }), q);
      const said = () => p.evaluate(() => { const e = document.getElementById('say'); return e.style.display === 'none' ? '' : e.innerText; });
      const point = async (q) => { let a = await at(q);
        if (profile === 'computer') {
          /* the camera may still be gliding onto the man up: aim again until the pointer rests on the tile asked */
          for (let i = 0; i < 6; i++) { await p.mouse.move(a.x - 30, a.y - 30); await p.mouse.move(a.x, a.y, { steps: 4 }); await p.waitForTimeout(300);
            const on = await p.evaluate(([x, y, q]) => { const t = tileAt(x, y); return t.x === q.x && t.y === q.y; }, [a.x, a.y, q]); if (on) break;
            await p.evaluate(q => { FIGHT_UI.glide = null; FIGHT_UI.cx = (q.x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (q.y + .5) * FIGHT_UI.th; clampCam(); FIGHT_UI.hoverKey = null; FIGHT_UI.saidBuilding = null; hud(); }, q);
            a = await at(q); }
          return said(); }
        const cdp = await p.context().newCDPSession(p);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: a.x, y: a.y }] }); await p.waitForTimeout(800);
        const s = await said(); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(200); return s; };
      const roofLine = await point(b.roof), wallLine = await point(b.wall);
      const okRoof = /2 storeys/.test(roofLine) && /to hit/.test(roofLine) && /reach/.test(roofLine) && /sees/.test(roofLine) && /ladder/.test(roofLine);
      const okWall = /2 storeys high/.test(wallLine) && /ladder/.test(wallLine);
      let turnLine = '';
      if (profile === 'computer') {
        /* FIGHT, then his turn: the mouse on the wall */
        await p.evaluate(() => { try { fightNow(); } catch (e) {} });
        for (let i = 0; i < 120; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'wait'; }); if (st === 'mine') break; await p.waitForTimeout(250); }
        /* a wall of a two-storey building with no man drawn over it (a man under the pointer is the man's, his aim or his card) */
        const wall = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current();
          for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) {
            if (FIGHT.rowAt(x, y) !== 'obstacles' || !buildingAt(x, y) || buildingAt(x, y).lv !== 2) continue;
            FIGHT_UI.glide = null; FIGHT_UI.cx = (x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (y + .5) * FIGHT_UI.th; clampCam(); hud();
            const px = sx((x + .5) * FIGHT_UI.tw), py = sy((y + .5) * FIGHT_UI.th);
            const onGlass = px > 4 && py > 4 && px < innerWidth - 4 && py < innerHeight - BOTH - 4;
            if (onGlass && !whoAt(px, py, { x, y }, u)) { FIGHT_UI.hoverKey = null; FIGHT_UI.saidBuilding = null; return { x, y }; } }
          return null; });
        await p.waitForTimeout(400);
        turnLine = wall ? await point(wall) : 'no wall clear of men';
      }
      leg(okRoof && okWall && (profile !== 'computer' || /2 storeys high/.test(turnLine)),
        '*** ' + (profile === 'computer' ? 'H2 COMPUTER: THE MOUSE RESTING ON A HOUSE, BEFORE THE FIGHT AND IN HIS TURN' : 'H3 PHONE: A FINGER HELD ON A HOUSE') + ', SAYS WHAT ITS HEIGHT GIVES *** (EYES k07: no word of height before)',
        'roof "' + roofLine.replace(/\n/g, ' ').slice(0, 110) + '" | wall "' + wallLine.replace(/\n/g, ' ').slice(0, 70) + '"' + (turnLine ? ' | his turn "' + turnLine.replace(/\n/g, ' ').slice(0, 50) + '"' : ''));
    } catch (e) { errs.push(profile + ': ' + e.message.slice(0, 160)); }
    finally { await d.close(); }
  }
  leg(errs.length === 0, 'H4 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
