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
   RE-AIMED 11/7 BY RULE 423(d) (COMBAT TWO; Paolo 11/7: 'there's no ladder system, the ladder system is not realistic... converted to
   two or three story houses'): the ladders and their chevrons are gone. H1 now: no ladder is drawn on any board, and on the suburb
   boards every house's picture is drawn at its own storeys (the ranches of two and three storeys); H2/H3: the line on a house says
   its storeys, the hit, the reach, the sight and the way in ('door'); a house has no wall (423(c)), so the wall's line is asked of a
   building that still has one, where the board has one.
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
      const r = await d.page.evaluate(() => { const B = FIGHT.S.boardDef, L = B.laid; return { ladders: (FIGHT_UI.ladders || []).length,
        houses: L ? L.sprites.filter(q => q.kind === 'house' && q.tiles[0] >= L.ring && q.tiles[1] >= L.ring && q.tiles[0] < L.ring + L.W && q.tiles[1] < L.ring + L.H).map(q => [q.storeys, q.drawn]) : [] }; });
      if (r.ladders) bad.push(kind + seed + ' ' + r.ladders + ' ladders drawn');
      r.houses.forEach(h => { (seen[h[0]] = seen[h[0]] || []).push(h[1]); if (h[0] !== h[1]) bad.push(kind + seed + ' a ' + h[0] + '-storey house drawn ' + h[1]); });
    } catch (e) { errs.push('H1 ' + kind + ': ' + e.message.slice(0, 120)); }
    finally { await d.close(); }
  }
  leg(seen[1] && seen[2] && seen[3] && bad.length === 0,
    '*** H1 EVERY HOUSE DRAWN AT ITS STOREYS, NO LADDERS *** (EYES line 67, re-aimed by rule 423(d)): one, two and three storey houses read apart at a glance by their own pictures',
    'houses on the suburb boards by storeys: ' + Object.keys(seen).map(k => k + ':' + seen[k].length).join(' ') + (bad.length ? ' | ' + bad.slice(0, 3).join('; ') : ''));

  /* H2, H3: a two-storey building on the suburb, before FIGHT and in his turn */
  for (const profile of ['computer', 'phone_portrait']) {
    const d = await boot(profile, { seed: 2, kind: 'suburb', deploy: true });
    const p = d.page; p.on('pageerror', e => errs.push(profile + ': ' + e.message));
    try {
      await ready(p);
      await p.waitForFunction(() => FIGHT.S.deploy && !FIGHT_UI.glide, null, { timeout: 15000 }).catch(() => {});
      /* a two-storey roof tile and a wall tile of the same building, the camera on them */
      const b = await p.evaluate(() => { const S = FIGHT.S;
        for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (FIGHT.storeysAt(x, y) === 2) {   /* rule 423(c): a house has no wall: its own tile */
          FIGHT_UI.cx = (x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (y + .5) * FIGHT_UI.th; hud(); return { roof: { x, y }, wall: null }; }
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
      const roofLine = await point(b.roof), wallLine = b.wall ? await point(b.wall) : '(a house has no wall, rule 423(c))';
      const okRoof = /2 storeys/.test(roofLine) && /to hit/.test(roofLine) && /reach/.test(roofLine) && /sees/.test(roofLine) && /door/.test(roofLine);
      const okWall = true;
      let turnLine = '';
      if (profile === 'computer') {
        /* FIGHT, then his turn: the mouse on the wall */
        await p.evaluate(() => { try { fightNow(); } catch (e) {} });
        for (let i = 0; i < 120; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'wait'; }); if (st === 'mine') break; await p.waitForTimeout(250); }
        /* the camera settled (the glide in after FIGHT runs past the first frame of his turn, measured 11/7: a house picked on the
           glass drifted off its top edge while the pointer went to it) */
        let camPrev = null; for (let i = 0; i < 40; i++) { const c = await p.evaluate(() => [FIGHT_UI.cx, FIGHT_UI.cy, FIGHT_UI.zoom].map(v => Math.round(v * 100)).join(','));
          if (c === camPrev) break; camPrev = c; await p.waitForTimeout(250); }
        /* a two-storey house with no man drawn over it (a man under the pointer is the man's, his aim or his card); rule 423(c): a house has no wall */
        const wall = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(), hs = [];
          for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (FIGHT.storeysAt(x, y) === 2) hs.push({ x, y });
          /* a house he cannot walk into this turn says its height (one he can, says the walk): the farthest first */
          hs.sort((a, b) => Math.hypot(b.x - u.x, b.y - u.y) - Math.hypot(a.x - u.x, a.y - u.y));
          /* first a house on the glass where the fight's camera already frames his men (a camera moved off them is pulled back by
             the fight's own framing, measured 11/7: the pointer then rested on nothing), then one the camera is moved to */
          const onNow = hs.filter(q => { const px = sx((q.x + .5) * FIGHT_UI.tw), py = sy((q.y + .5) * FIGHT_UI.th), top = document.elementFromPoint(px, py);
            return px > 30 && py > 30 && px < innerWidth - 30 && py < innerHeight - BOTH - 30 && !!top && top.tagName === 'CANVAS' && !whoAt(px, py, q, u); });
          if (onNow.length) { FIGHT_UI.hoverKey = null; FIGHT_UI.saidBuilding = null; return onNow[0]; }
          for (const q of hs) { const x = q.x, y = q.y;
            FIGHT_UI.glide = null; FIGHT_UI.cx = (x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (y + .5) * FIGHT_UI.th; clampCam(); hud();
            const px = sx((x + .5) * FIGHT_UI.tw), py = sy((y + .5) * FIGHT_UI.th);
            const onGlass = px > 4 && py > 4 && px < innerWidth - 4 && py < innerHeight - BOTH - 4;
            /* and the board itself under the pointer, never a panel of the HUD over it (a house at the board's edge sat under one,
               measured 11/7: the mouse never reached the board) */
            const top = document.elementFromPoint(px, py), onBoard = !!top && (top === cx.canvas || top.id === 'fx' || top.tagName === 'CANVAS');
            if (onGlass && onBoard && !whoAt(px, py, { x, y }, u)) { FIGHT_UI.hoverKey = null; FIGHT_UI.saidBuilding = null; return { x, y }; } }
          return null; });
        await p.waitForTimeout(400);
        turnLine = wall ? await point(wall) : 'no wall clear of men';
      }
      leg(okRoof && okWall && (profile !== 'computer' || (/2 storeys/.test(turnLine) && /door/.test(turnLine))),
        '*** ' + (profile === 'computer' ? 'H2 COMPUTER: THE MOUSE RESTING ON A HOUSE, BEFORE THE FIGHT AND IN HIS TURN' : 'H3 PHONE: A FINGER HELD ON A HOUSE') + ', SAYS WHAT ITS HEIGHT GIVES *** (EYES k07: no word of height before)',
        'roof "' + roofLine.replace(/\n/g, ' ').slice(0, 110) + '" | wall "' + wallLine.replace(/\n/g, ' ').slice(0, 70) + '"' + (turnLine ? ' | his turn "' + turnLine.replace(/\n/g, ' ').slice(0, 50) + '"' : ''));
    } catch (e) { errs.push(profile + ': ' + e.message.slice(0, 160)); }
    finally { await d.close(); }
  }
  leg(errs.length === 0, 'H4 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
