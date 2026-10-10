#!/usr/bin/env node
/* A RAISED HAND IS NEVER CUT BY THE FRAME (ANIMATION [hands in the box], 10/10).

   The rig draws every body inside a 112 box: feet on the ground line, the head top 12 px down (9 on the tall
   bodies), an arm 32 px long. Measured over every outfit x clip x facing x drawn key (26 x 107 x 8 x 12): 1,209
   (outfit, clip, facing) sets had pixels cut at the top edge, 945 of them a raised hand (cheer, hands-up, stretch,
   jumping-jacks, hail, heave, flee-sprint) on every outfit, the player's own included. Every surface that bakes
   from the rig (the fight's sheets, the town's, the map's cast) carried the cut.

   THE RULE IS IN THE RIG (slices/BOHEMIA_ALPHA_0_9.html, __HANDS_IN_THE_BOX__): buildFrame builds with no ceiling;
   only if an ARM part (5-8 in the part grid) is in the top row does it swing the arm out under a ceiling 1 px
   below that hand and build again. Asked here of the rig's own frames (buildFrame, its part grid and its pixels),
   rule on against rule off, on every outfit, the seven hand clips, eight facings, twelve drawn keys:
     - no arm part in the top row, anywhere;
     - CONTROL: with the rule off there ARE cut hands (a ruler that sees none would pass by being blind);
     - every frame that was not cut is the same picture to the byte (the rule touches only what it fixes);
     - a raised hand stays raised: it still reaches the standing head's top on 95%+ of the sets that did, and on
       99%+ outside the church, whose cap already fills the box standing (that is the outfit, not a pose: routed);
     - and it moves no arm more than 6 px from where it was drawn.
   This gate opens the alpha in chromium through the one driver (playwright). */
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const fs = require('fs');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const CLIPS = ['cheer', 'hands-up', 'stretch', 'jumping-jacks', 'hail', 'heave', 'flee-sprint'];
let pass = 0, fail = 0;
const ok = (n, c, why) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n + (why ? '  [' + why + ']' : ''))); };
const done = () => { console.log('\nA RAISED HAND IS NEVER CUT GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const src = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');
ok('the rule is in the rig: handsInBox and the frame builder that reads its own top row',
  /function handsInBox\(P\)/.test(src) && /function buildFrame\(d,clip,ph,_noOutline\)\{\s*if\(!HANDBOX\.on\)return buildFrameCore/.test(src));
ok('  and the pose every frame is built from passes through it', /const P=handsInBox\(_hp\?_hp\.sk:armHoldApply\(d,clip,ph,_ps\.sk\)\)/.test(src));

(async () => {
  const d = await open({ alpha: true });
  let ready = false;
  for (let i = 0; i < 240 && !ready; i++) { ready = await d.page.evaluate(() => typeof handsInBox === 'function' && typeof buildFrameCore === 'function'
    && !!window.FACTION_LOOKS && !!window.CITY_CAST_LOOKS).catch(() => false); if (!ready) await d.page.waitForTimeout(500); }
  if (!ready) { ok('the alpha boots and exposes its rig', false); await d.browser.close(); return done(); }
  const r = await d.page.evaluate((CLIPS) => {
    const K = 12, DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const ids = ['you'].concat(CITY_CAST_LOOKS.map(l => 'cast_' + l.id), FACTION_LOOKS.map(l => 'faction_' + l.faction.toLowerCase()));
    const set = (id) => { const m = id === 'you' ? null : (id.startsWith('cast_') ? CITY_CAST_LOOKS.filter(x => 'cast_' + x.id === id)[0]
      : FACTION_LOOKS.filter(x => 'faction_' + x.faction.toLowerCase() === id)[0]);
      if (m) { window.G_WORN = m.worn; G.bodyVar = m.dials; G.age = m.age || 'adult'; } rebuildFromRig(); FRAME_CACHE.map.clear(); };
    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age, keepOn = HANDBOX.on;
    const armRow = (f, y) => { for (let x = 0; x < f.CW; x++) if (HANDBOX.ARM[f.grid[y * f.CW + x]]) return true; return false; };
    const armTop = (f) => { for (let y = 0; y < f.CH; y++) if (armRow(f, y)) return y; return 999; };
    const pxTop = (f) => { for (let i = 0; i < f.px.length; i++) if (f.px[i]) return Math.floor(i / f.CW); return 999; };
    const same = (a, b) => { if (a.px.length !== b.px.length) return false; for (let i = 0; i < a.px.length; i++) { const p = a.px[i], q = b.px[i];
      if (!p !== !q) return false; if (p && (p[0] !== q[0] || p[1] !== q[1] || p[2] !== q[2])) return false; } return true; };
    const res = { looks: ids.length, frames: 0, cutOff: 0, cutOn: [], wholeChanged: [], raisedOff: 0, raisedOn: 0, raisedOffX: 0, raisedOnX: 0, maxDrop: 0, dropAt: '' };
    try {
      for (const id of ids) { set(id);
        const idleTop = {}; HANDBOX.on = true;
        for (const dir of DIRS) { let t = 999; for (let k = 0; k < K; k++) t = Math.min(t, pxTop(buildFrame(dir, 'idle', (k + 0.5) / K))); idleTop[dir] = t; }
        for (const c of CLIPS) for (const dir of DIRS) { let rOff = false, rOn = false;
          for (let k = 0; k < K; k++) { const ph = (k + 0.5) / K; res.frames++;
            HANDBOX.on = false; const a = buildFrame(dir, c, ph); HANDBOX.on = true; const b = buildFrame(dir, c, ph);
            const ca = armRow(a, 0); if (ca) res.cutOff++; if (armRow(b, 0)) res.cutOn.push(id + '/' + c + '/' + dir + '/' + k);
            if (!ca) { if (!same(a, b)) res.wholeChanged.push(id + '/' + c + '/' + dir + '/' + k); }
            else { const dr = armTop(b) - armTop(a); if (dr > res.maxDrop) { res.maxDrop = dr; res.dropAt = id + '/' + c + '/' + dir + '/' + k; } }
            if (armTop(a) <= idleTop[dir]) rOff = true; if (armTop(b) <= idleTop[dir]) rOn = true; }
          if (rOff) { res.raisedOff++; if (rOn) res.raisedOn++; if (id !== 'faction_church') { res.raisedOffX++; if (rOn) res.raisedOnX++; } } } }
    } finally { HANDBOX.on = keepOn; window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA; rebuildFromRig(); FRAME_CACHE.map.clear(); }
    return res;
  }, CLIPS);
  console.log('         ' + r.looks + ' outfits x ' + CLIPS.length + ' clips x 8 facings x 12 keys = ' + r.frames + ' frames, each built with the rule off and on');
  ok('CONTROL: with the rule off the ruler sees cut hands (' + r.cutOff + ' frames with an arm in the top row)', r.cutOff >= 1000);
  ok('NO RAISED HAND IS CUT: no arm part in the top row of any frame, rule on (' + r.cutOn.length + ')', r.cutOn.length === 0, r.cutOn.slice(0, 4).join(', '));
  ok('THE RULE TOUCHES ONLY WHAT IT FIXES: every frame that was not cut is the same picture to the byte (' + r.wholeChanged.length + ' changed)',
    r.wholeChanged.length === 0, r.wholeChanged.slice(0, 4).join(', '));
  const all = r.raisedOn / Math.max(1, r.raisedOff), out = r.raisedOnX / Math.max(1, r.raisedOffX);
  ok('A RAISED HAND STAYS RAISED: it still reaches the standing head\'s top on ' + r.raisedOn + ' of ' + r.raisedOff + ' sets (' + (100 * all).toFixed(1)
    + '%), and ' + r.raisedOnX + ' of ' + r.raisedOffX + ' outside the church (' + (100 * out).toFixed(1) + '%)', all >= 0.95 && out >= 0.99);
  ok('  and no arm comes down more than 6 px from where it was drawn (most ' + r.maxDrop + ', ' + r.dropAt + ')', r.maxDrop <= 6);
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
