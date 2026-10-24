#!/usr/bin/env node
/* WHAT YOUR CREW CAN'T SEE READS DARK (COMBAT [what the crew can't see reads dark], rule 157, Paolo 10/24: 'during combat I
   see you trying to implement a vision system; some enemies behind the line don't get shown; if you want a vision system in
   combat you have to do a lot better: if there are tiles that our team, with their vision all together, can't see, you've
   gotta be able to tell; a different opacity, maybe a grey darkness to it... it's gotta be done a lot better').

   Legs, on his phone's profile (390 x 844), the real fight page, slices/BOHEMIA_FIGHT.html:
   1. ONE SIGHT FOR THE WHOLE CREW: the dark tiles are exactly the tiles no man of his on the field sees by the rules' own test
      (inside his vision, nothing that blocks sight between), counted again here tile by tile; every man's own tile is light;
   2. IT READS AT A GLANCE, AND IT IS NOT BLACK: a dark tile on the glass loses a third of its light or more against the same
      tile with the dark off, and keeps a static in it (its pixels vary; never one flat colour, never black);
   3. IT LIFTS THE MOMENT ONE OF HIS SEES IT: a man stepped to look at a dark tile clears it within half a beat;
   4. A MAN OF THEIRS ON A DARK TILE IS NOT DRAWN, AND THE LAST SEEN STAYS: hidden, he is not drawn; seen and then lost, a ring
      stays where he was last seen; seen again, the ring is gone;
   5. SIGHT BY BATTLE BROTHERS' RULES (the library's Vision): 7; Eagle Eyes +1, Short Sighted -1; a helmet's own vision
      (-1 on the nasal helmet); the night -2 unless the tile looked at is lit; Night Owl +1 only at night; Bow Mastery +1;
      higher ground sees farther toward lower ground only; never under 1 before the height;
   6. nothing while he sets his line (both lines show), and the page threw nothing.
   Run: node gates/what_the_crew_cant_see_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== WHAT THE CREW CAN\'T SEE GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  /* 6a: the line set first (deploy on): nothing dark */
  {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, kind: 'suburb', teach: false, odds: false }) });
    const p = d.page; p.on('pageerror', e => errs.push(String(e)));
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
      await p.waitForTimeout(600);
      const r = await p.evaluate(() => ({ deploy: !!FIGHT.S.deploy, dark: FIGHT_UI.fogA ? Array.from(FIGHT_UI.fogA).filter(a => a > .01).length : 0, shown: FIGHT.S.units.filter(v => v.side === 'them' && FIGHT.onField(v) && FIGHT.shown(v)).length, them: FIGHT.S.units.filter(v => v.side === 'them' && FIGHT.onField(v)).length }));
      leg(r.deploy && r.dark === 0 && r.shown === r.them, '  while he sets his line nothing is dark and both lines show (rule 110b)', JSON.stringify(r));
    } catch (e) { leg(false, 'the line-set page ran', String(e.message).slice(0, 200)); }
    errs.push.apply(errs, d.errs); await d.close();
  }
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, kind: 'suburb', deploy: false, formation: null, teach: false, odds: false }) });
  const p = d.page; p.on('pageerror', e => errs.push(String(e)));
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
    await p.evaluate(() => { FIGHT_UI.auto = false; FIGHT_UI.pinched = true; });
    await p.waitForTimeout(500);
    /* 1 */
    const one = await p.evaluate(() => {
      const S = FIGHT.S, T = FIGHT._t, mine = S.units.filter(v => v.side === 'you' && FIGHT.onField(v)); let wrong = 0, dark = 0, ownDark = 0;
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) {
        const t = { x, y }, seen = mine.some(u => Math.max(Math.abs(u.x - x), Math.abs(u.y - y)) <= T.vision(u, t) && T.sees(u, t));
        const isDark = FIGHT_UI.fogA[y * S.w + x] > .5; if (isDark) dark++; if (isDark === seen) wrong++; }
      mine.forEach(u => { if (FIGHT_UI.fogA[u.y * S.w + u.x] > .01) ownDark++; });
      return { wrong, dark, ownDark, n: S.w * S.h, men: mine.length };
    });
    leg(one.wrong === 0 && one.dark > 0 && one.ownDark === 0, '*** ONE SIGHT FOR THE WHOLE CREW ***: the dark tiles are exactly the tiles none of his men sees by the rules\' own test; every man\'s own tile light',
      one.dark + ' of ' + one.n + ' tiles dark for ' + one.men + ' men; ' + one.wrong + ' disagree; ' + one.ownDark + ' of his own tiles dark');
    /* 2: a dark tile on the glass, the dark on and off, the same frame of everything else */
    const two = await p.evaluate(() => {
      const S = FIGHT.S; let pick = null;
      for (let i = 0; i < S.w * S.h && !pick; i++) { if (FIGHT_UI.fogA[i] < .99) continue; const x = i % S.w, y = Math.floor(i / S.w);
        const X = sx((x + .5) * FIGHT_UI.tw), Y = sy((y + .5) * FIGHT_UI.th); if (X > 30 && X < W - 30 && Y > TOPH + 30 && Y < H - BOTH - 30 && !FIGHT.S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y)) pick = { x, y, X, Y }; }
      if (!pick) { FIGHT_UI.zoom = FIGHT_UI.far; for (let i = 0; i < S.w * S.h && !pick; i++) { if (FIGHT_UI.fogA[i] < .99) continue; const x = i % S.w, y = Math.floor(i / S.w);
        const X = sx((x + .5) * FIGHT_UI.tw), Y = sy((y + .5) * FIGHT_UI.th); if (X > 10 && X < W - 10 && Y > TOPH + 10 && Y < H - BOTH - 10) pick = { x, y, X, Y }; } }
      if (!pick) return null;
      const r = Math.max(3, Math.round(Math.min(FIGHT_UI.tw, FIGHT_UI.th) * FIGHT_UI.zoom * .3));
      const grab = () => { const g = cv.getContext('2d'), px = g.getImageData(Math.round((pick.X - r) * DPR), Math.round((pick.Y - r) * DPR), Math.round(2 * r * DPR), Math.round(2 * r * DPR)).data; let L = [];
        for (let i = 0; i < px.length; i += 4) L.push(.299 * px[i] + .587 * px[i + 1] + .114 * px[i + 2]); return L; };
      const stats = L => { const m = L.reduce((a, b) => a + b, 0) / L.length; return { mean: m, sd: Math.sqrt(L.reduce((a, b) => a + (b - m) * (b - m), 0) / L.length), min: Math.min(...L), distinct: new Set(L.map(v => Math.round(v))).size }; };
      const now = performance.now(); FIGHT_UI.glide = null;
      draw(now); const on = stats(grab());
      const keep = window.drawFog; window.drawFog = function () {}; draw(now); const off = stats(grab()); window.drawFog = keep; draw(now);
      return { pick, on, off };
    });
    leg(two && two.on.mean <= two.off.mean * (2 / 3) && two.on.min > 4 && two.on.distinct >= 8,
      '*** IT READS AT A GLANCE, AND IT IS NOT BLACK ***: a dark tile loses a third of its light or more, and keeps a static in it (never one flat colour, never black)',
      two ? 'tile ' + two.pick.x + ',' + two.pick.y + ': light ' + two.off.mean.toFixed(0) + ' -> ' + two.on.mean.toFixed(0) + ' (' + Math.round(100 * (1 - two.on.mean / two.off.mean)) + '% darker), darkest ' + two.on.min.toFixed(0) + ', ' + two.on.distinct + ' shades in it' : 'no dark tile on the glass');
    /* 3: a dark tile, a man of his set to look at it; the clock to light */
    const three = await p.evaluate(async () => {
      const S = FIGHT.S, T = FIGHT._t, mine = S.units.filter(v => v.side === 'you' && FIGHT.onField(v));
      let goal = null;
      for (let i = 0; i < S.w * S.h && !goal; i++) { if (FIGHT_UI.fogA[i] < .99) continue; const x = i % S.w, y = Math.floor(i / S.w);
        if (S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y)) continue;
        for (const u of mine) { for (let dy = -2; dy <= 2 && !goal; dy++) for (let dx = -2; dx <= 2 && !goal; dx++) { const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= S.w || ny >= S.h || !T.passable(nx, ny) || S.units.some(v => FIGHT.onField(v) && v.x === nx && v.y === ny)) continue;
          const ox = u.x, oy = u.y; u.x = nx; u.y = ny; const ok = T.sees(u, { x, y }) && Math.max(Math.abs(nx - x), Math.abs(ny - y)) <= T.vision(u, { x, y }); u.x = ox; u.y = oy;
          if (ok) goal = { u, nx, ny, x, y }; } if (goal) break; } }
      if (!goal) return null;
      const t0 = performance.now(); goal.u.x = goal.nx; goal.u.y = goal.ny; const i = goal.y * S.w + goal.x;
      while (FIGHT_UI.fogA[i] > .01 && performance.now() - t0 < 3000) await new Promise(r => requestAnimationFrame(r));
      return { ms: performance.now() - t0, half: beatMs() / 2, a: FIGHT_UI.fogA[i], at: goal.x + ',' + goal.y };
    });
    leg(three && three.a <= .01 && three.ms <= three.half + 50, '*** IT LIFTS THE MOMENT ONE OF HIS SEES IT ***: a man stepped to look at a dark tile clears it within half a beat',
      three ? 'tile ' + three.at + ' light in ' + Math.round(three.ms) + ' ms (half a beat ' + Math.round(three.half) + ')' : 'no dark tile a man could step to see');
    /* 4: a man of theirs walked into the dark, then into sight */
    const four = await p.evaluate(async () => {
      const S = FIGHT.S, T = FIGHT._t, frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const v = S.units.filter(x => x.side === 'them' && FIGHT.onField(x) && FIGHT.shown(x))[0]; if (!v) return null;
      const drawn = () => { const ids = []; const o = window.drawMan; window.drawMan = function (m) { ids.push(m.id); return o.apply(this, arguments); }; draw(performance.now()); window.drawMan = o; return ids.indexOf(v.id) >= 0; };
      await frame(); const d0 = drawn();
      let dark = null; for (let i = 0; i < S.w * S.h && !dark; i++) { const x = i % S.w, y = Math.floor(i / S.w); if (!FIGHT.sideSees('you', { x, y }) && T.passable(x, y) && !S.units.some(o => FIGHT.onField(o) && o.x === x && o.y === y)) dark = { x, y }; }
      if (!dark) return null;
      const was = { x: v.x, y: v.y }; v.x = dark.x; v.y = dark.y; await frame(); await frame();
      const hidden = !FIGHT.shown(v), d1 = drawn(), ring = FIGHT_UI.fogLost, ringAt = v._lastSeen ? v._lastSeen.x + ',' + v._lastSeen.y : null;
      v.x = was.x; v.y = was.y; await frame(); await frame();
      return { d0, hidden, d1, ring, ringAt, was: was.x + ',' + was.y, back: FIGHT.shown(v), ringAfter: FIGHT_UI.fogLost };
    });
    leg(four && four.d0 && four.hidden && !four.d1 && four.ring >= 1 && four.ringAt === four.was && four.back && four.ringAfter === 0,
      '*** HIDDEN IS NOT DRAWN, AND THE LAST SEEN STAYS ***: a man of theirs in the dark is not drawn, a ring stays where he was last seen, and goes when he is seen again',
      four ? 'drawn ' + four.d0 + ' -> ' + four.d1 + ' in the dark; ring ' + four.ring + ' at ' + four.ringAt + ' (he was at ' + four.was + '); seen again ' + four.back + ', rings ' + four.ringAfter : 'no man of theirs in sight to walk');
    /* 5: the library's sight */
    const five = await p.evaluate(() => {
      const S = FIGHT.S, T = FIGHT._t, u = S.units.filter(v => v.side === 'you' && FIGHT.onField(v) && !v.main)[0];
      const keep = { traits: u.traits, headRow: u.headRow, perks: u.perks.slice(), night: S.night, lit: S.lit, x: u.x, y: u.y };
      const far = { x: u.x, y: u.y }, V = () => T.vision(u, far);
      u.traits = []; u.headRow = null; u.perks = u.perks.filter(k => k !== 'bow_mastery'); S.night = false;
      const base = V(); u.traits = ['eagle_eyes']; const eagle = V(); u.traits = ['Short Sighted']; const short = V(); u.traits = ['night_owl']; const owlDay = V(); u.traits = [];
      u.headRow = DB.armor.head.filter(h => h.id === 'nasal_helmet')[0]; const helm = V(); u.headRow = null;
      u.perks.push('bow_mastery'); const bow = V(); u.perks = u.perks.filter(k => k !== 'bow_mastery');
      S.night = true; S.lit = S.lit ? S.lit.map(r => r.map(() => false)) : null; const night = V(); u.traits = ['night_owl']; const owlNight = V(); u.traits = ['night_blind']; const blind = V(); u.traits = [];
      S.night = false;
      /* the height: a man on a high tile looking at a low one, and the other way */
      let hi = null, lo = null; for (let y = 0; y < S.h && !(hi && lo); y++) for (let x = 0; x < S.w; x++) { if (T.level(x, y) > 0 && !hi) hi = { x, y }; if (T.level(x, y) === 0 && !lo) lo = { x, y }; }
      let down = null, up = null;
      if (hi && lo) { u.x = hi.x; u.y = hi.y; down = T.vision(u, lo); u.x = lo.x; u.y = lo.y; const v = T.vision(u, hi); up = v; }
      Object.assign(u, { traits: keep.traits, headRow: keep.headRow, perks: keep.perks, x: keep.x, y: keep.y }); S.night = keep.night; S.lit = keep.lit;
      return { base, eagle, short, owlDay, helm, bow, night, owlNight, blind, down, up, per: R('ours.sight').per_level };
    });
    leg(five.base === 7 && five.eagle === 8 && five.short === 6 && five.owlDay === 7 && five.helm === 6 && five.bow === 8 && five.night === 5 && five.owlNight === 6 && five.blind === 4 && (five.down === null || (five.down === 7 + five.per && five.up === 7)),
      '*** SIGHT BY BATTLE BROTHERS\' RULES ***: 7; Eagle Eyes 8, Short Sighted 6; the nasal helmet 6; Bow Mastery 8; the night 5, Night Owl 6 only at night, Night Blind 4; higher ground sees farther down, never up',
      JSON.stringify(five));
  } catch (e) { leg(false, 'the fight\'s page ran', String(e.message).slice(0, 200)); }
  errs.push.apply(errs, d.errs); await d.close();
  leg(!errs.length, 'the page threw nothing', errs.slice(0, 2).join(' | '));
  done();
})();
