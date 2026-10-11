#!/usr/bin/env node
/* THE FALL READS (ANIMATION [the fall], 10/11; V2, the last, rule 95). PAOLO 10/10, NO on the fight's clips: 'the
   animation of people ragdolling and falling down is so broken, so dogshit'. What he saw: the fall was floor-rise
   played backwards (the man sank upright into a knot) and the dead were sleep@0, drawn upright and UPSIDE DOWN facing
   you. The rig now has fall-down (2 beats) and take-hit (1 beat), posed per facing (rule 107), the fall drawn upright
   and the finished picture turned so the clothes draw right (rollFrame).
   Asked of the rig's OWN FRAMES (buildFrame: its pixels and its part grid) in the alpha, opened in chromium through
   the one driver (playwright), on the player and four long-garment outfits, all eight facings:
     the dead lie FLAT (wider than tall, low) with the HEAD AT ONE END ON THE GROUND, never on end;
     CONTROL: the old dead (sleep@0) fails the same ruler on most facings, so the ruler can see the defect;
     the fall only goes DOWN; nothing is CUT by the frame; nothing goes MISSING on the way down (the first turned
     picture clipped the shoulders off); eight facings make eight different dead men;
     the hit SNAPS back on its first picture and COMES BACK to stand. */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n + (why ? '  [' + why + ']' : ''))); };
const done = () => { console.log('\nTHE FALL READS GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const src = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');
ok('the clips are in the bank on the grid: fall-down two beats, take-hit one', /'fall-down':2,'take-hit':1/.test(src));
ok('  the rig routes them to their poses, and the fall is not a loop (the frozen-pose resolver once stood the dead back up)',
  /if\(clip==='fall-down'\)return fallPose\(d,ph\);if\(clip==='take-hit'\)return hitPose\(d,ph\);/.test(src) && /const TERMINAL=\{[^}]*'fall-down':1/.test(src));
ok('  the fall turns as a picture, before its border is drawn', /if\(PRES\._roll\)rollFrame\(px,grid,CW,CH,PRES\);[^\n]*\n\s*if\(CHAR_OUTLINE\.on && !_noOutline\) applyCharOutline/.test(src));

(async () => {
  const d = await open({ alpha: true });
  let ready = false;
  for (let i = 0; i < 240 && !ready; i++) { ready = await d.page.evaluate(() => typeof fallPose === 'function' && typeof buildFrame === 'function'
    && !!window.FACTION_LOOKS && !!window.CITY_CAST_LOOKS).catch(() => false); if (!ready) await d.page.waitForTimeout(500); }
  if (!ready) { ok('the alpha boots and exposes its rig', false); await d.browser.close(); return done(); }
  const r = await d.page.evaluate(() => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'], LOOKS = ['you', 'faction_reds', 'cast_longcoat', 'cast_cape', 'faction_church'];
    const HEAD = { 1: 1, 2: 1 };
    const set = (id) => { const m = id === 'you' ? null : (id.startsWith('cast_') ? CITY_CAST_LOOKS.filter(x => 'cast_' + x.id === id)[0]
      : FACTION_LOOKS.filter(x => 'faction_' + x.faction.toLowerCase() === id)[0]);
      if (m) { window.G_WORN = m.worn; G.bodyVar = m.dials; G.age = m.age || 'adult'; } rebuildFromRig(); FRAME_CACHE.map.clear(); };
    const keep = [window.G_WORN, G.bodyVar, G.age];
    const meas = (f) => { let n = 0, mnx = 1e9, mxx = -1, mny = 1e9, mxy = -1, sx = 0, sy = 0, bn = 0, hx = 0, hy = 0, hn = 0, edge = 0;
      for (let i = 0; i < f.px.length; i++) { if (!f.px[i]) continue; const x = i % f.CW, y = (i / f.CW) | 0; n++; sx += x; if (!f.grid || !(f.grid[i] >= 5 && f.grid[i] <= 8)) { sy += y; bn++; }
        if (x < mnx) mnx = x; if (x > mxx) mxx = x; if (y < mny) mny = y; if (y > mxy) mxy = y;
        if (x === 0 || x === f.CW - 1 || y === 0) edge++;
        if (f.grid && HEAD[f.grid[i]]) { hx += x; hy += y; hn++; } }
      return { n, w: mxx - mnx + 1, h: mxy - mny + 1, top: mny, bot: mxy, l: mnx, r: mxx, cx: sx / Math.max(1, n), cy: sy / Math.max(1, bn), hx: hn ? hx / hn : null, hy: hn ? hy / hn : null, edge,
               sig: f.px.map(p => p ? (p[0] << 16 | p[1] << 8 | p[2]) : -1).join(',') }; };
    /* LOW = under 55% of his standing height. First written 48 px: a front-view body lying is its shoulders plus an arm, 52 px (measured 10/11), and the ruler was a guess */
    let standH = 100; const flat = (m) => m.w >= 1.5 * m.h && m.h <= 0.55 * standH;
    const headDown = (m) => m.hx !== null && (Math.min(m.hx - m.l, m.r - m.hx) <= 0.3 * m.w) && (m.hy - m.top >= 0.2 * m.h || m.h <= 30);
    const out = { sets: 0, notFlat: [], notHead: [], ctrlBad: 0, ctrlN: 0, rises: [], cut: [], lost: [], distinct: 0, hitWeak: [], hitStays: [], hitSame: [], minKeep: 9, maxKeep: 0 };
    try {
      for (const L of LOOKS) { set(L);
        const deads = [];
        for (const dir of DIRS) { out.sets++;
          const stand = meas(buildFrame(dir, 'idle', 0.02)); standH = stand.h;
          const keys = [0, 1, 2, 3, 4, 5].map(k => meas(buildFrame(dir, 'fall-down', (k + 0.5) / 6)));
          const dead = meas(buildFrame(dir, 'fall-down', 1)); deads.push(dead.sig);
          if (!flat(dead)) out.notFlat.push(L + '/' + dir + ' ' + dead.w + 'x' + dead.h);
          if (!headDown(dead)) out.notHead.push(L + '/' + dir);
          const old = meas(buildFrame(dir, 'sleep', 0)); out.ctrlN++; if (!(flat(old) && headDown(old))) out.ctrlBad++;
          const seq = keys.concat([dead]);
          /* THE WEIGHT GOES DOWN: the mean height of the body WITHOUT its arms (parts 5-8), not its top. First written on the top, then on every pixel: the arms fly up as he goes over, which is right, and both rose with them */
          /* ALLOWED: the 2 px a body of this width lifts tipping over its own heel (a box tipping over its edge raises its middle by r - h/2, about 1 px here; measured 1.2 to 1.7 on the second picture after three art passes moved it not at all). CAUGHT: anything more, like the 2.6 px pop of the landing overshoot taken out 10/11 */
          for (let i = 1; i < seq.length; i++) if (seq[i].cy < seq[i - 1].cy - 2) out.rises.push(L + '/' + dir + ' ' + seq[i - 1].cy.toFixed(1) + '->' + seq[i].cy.toFixed(1));
          seq.forEach((m, i) => { if (m.edge) out.cut.push(L + '/' + dir + '/' + i);
            const k = m.n / stand.n; out.minKeep = Math.min(out.minKeep, k); out.maxKeep = Math.max(out.maxKeep, k);
            if (k < 0.75 || k > 1.6) out.lost.push(L + '/' + dir + '/' + i + ' ' + k.toFixed(2)); });
          const hit = [1 / 6, 0.5, 5 / 6].map(p => meas(buildFrame(dir, 'take-hit', p)));
          const side = fallSide(dir);
          if ((hit[0].cx - stand.cx) * side < 1.5) out.hitWeak.push(L + '/' + dir + ' ' + (hit[0].cx - stand.cx).toFixed(1));
          if (Math.abs(hit[2].cx - stand.cx) > 3) out.hitStays.push(L + '/' + dir + ' ' + (hit[2].cx - stand.cx).toFixed(1));
          if (new Set(hit.map(m => m.sig)).size < 3) out.hitSame.push(L + '/' + dir);
        }
        out.distinct += new Set(deads).size === 8 ? 1 : 0;
      }
    } finally { window.G_WORN = keep[0]; G.bodyVar = keep[1]; G.age = keep[2]; rebuildFromRig(); FRAME_CACHE.map.clear(); }
    return out;
  });
  console.log('         ' + r.sets + ' (outfit, facing) sets: the player and four long-garment outfits, all eight facings');
  ok('THE DEAD LIE FLAT: the fall\'s last picture is half again as wide as it is tall and under 55% of his standing height, every set', !r.notFlat.length, r.notFlat.slice(0, 4).join(', '));
  ok('  with the HEAD AT ONE END, DOWN ON THE GROUND, never on end and never upside down', !r.notHead.length, r.notHead.slice(0, 4).join(', '));
  ok('CONTROL: the old dead (sleep@0) fails that ruler on most sets (' + r.ctrlBad + ' of ' + r.ctrlN + '): the ruler can see what he called broken', r.ctrlBad >= r.ctrlN / 2);
  ok('THE FALL ONLY GOES DOWN: the body\'s weight (the mean height of everything but the arms) never rises from one drawn picture to the next, past the 2 px of tipping over the heel', !r.rises.length, r.rises.slice(0, 4).join(', '));
  ok('NOTHING IS CUT BY THE FRAME: no picture of the fall touches its left, right or top edge', !r.cut.length, r.cut.slice(0, 4).join(', '));
  ok('NOTHING GOES MISSING ON THE WAY DOWN: every picture keeps 75 percent or more of the standing body\'s pixels (kept ' + r.minKeep.toFixed(2) + ' to ' + r.maxKeep.toFixed(2) + ')', !r.lost.length, r.lost.slice(0, 4).join(', '));
  ok('EIGHT FACINGS, EIGHT DEAD MEN: the eight last pictures are eight different pictures, every outfit', r.distinct === 5);
  ok('THE HIT SNAPS: on its first picture the body is thrown 1.5 px or more away from the blow, every set', !r.hitWeak.length, r.hitWeak.slice(0, 4).join(', '));
  ok('  and COMES BACK: by its last picture the body is within 3 px of standing, with three different pictures', !r.hitStays.length && !r.hitSame.length, r.hitStays.concat(r.hitSame).slice(0, 4).join(', '));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
