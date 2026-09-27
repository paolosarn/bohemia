#!/usr/bin/env node
/* ============================================================================
   ONE GAME MODE, NO TELEPORT   (COMBAT lane, [one mode], rule 24)

   *** PAOLO 9/21 IN THE VOTE TAB, LOCKED: "teleporting shit not part of the universe,
   THE BUTTONS CHANGING, no consistency... one game mode, not teleporting to different
   game modes" and "a UI that's not consistent for every second of the game." ***

   THE ROW'S OWN SHIP TEST IS WHAT THIS HOLDS: the walk meets a fight and his screen
   does not become somebody else's screen. So this gate walks into a real fight the way
   he does and measures WHAT SURVIVED, rather than checking that a constant is spelled
   right somewhere in a blob.

   IT IS RED ON PURPOSE AND IT SAYS WHICH HALF. The row is claimed and unfinished; a
   gate that only holds the finished half is a gate that forgets the rest. Every leg
   below is either a thing his rulings already demand and the build now does, or a thing
   his rulings demand and the build does NOT do yet, WITH THE NUMBER. Nothing here is
   loosened to go green.

   RULE 14(g), AND IT IS THE THIRD ROUND THIS LANE ASKED FOR IT: this gate is built ON
   tools/bohemia_drive_the_demo.js rather than carrying its own copy of the front door.
   Two of this lane's older gates read a loading screen and an unsized frame for rounds
   because they each rolled their own; that is the whole argument, and this is the first
   new gate on the right side of it.
   ========================================================================== */
const { open } = require('../tools/bohemia_drive_the_demo.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? ' (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? ' (' + note + ')' : ''))); };

/* WHO IS THE FIGHT AND WHO IS THE WALK. Both are frames of the same page; the fight is
   the one that has G and a #fire button, the walk is the one that can tell you whether
   you tapped a foe. Asked by what the document can DO, never by a name: the demo's
   iframes have no name at all, which this lane measured on 9/18 and which is probably
   the single reason a gate can be right about the alpha and wrong about what he plays. */
const findFrames = async (page) => {
  const out = { city: null, fight: null };
  for (const f of page.frames()) {
    let kind = null;
    try {
      kind = await f.evaluate(() => (typeof streetTapFoe === 'function') ? 'city'
        : (typeof G !== 'undefined' && document.getElementById('fire')) ? 'fight' : null);
    } catch (e) { continue; }
    if (kind && !out[kind]) out[kind] = f;
  }
  return out;
};

/* WHAT HE CAN READ, in whichever document is in front of him. offsetParent is in here
   because getComputedStyle cannot see a hidden ANCESTOR -- this lane paid two wrong
   answers for that on 9/16 and the photograph was right both times. */
const READ = (f) => f.evaluate(() => {
  const out = [], seen = {};
  for (const el of Array.from(document.querySelectorAll('div,button,span'))) {
    if (el.children.length > 2) continue;
    const t = (el.textContent || '').trim();
    if (!t || t.length > 28 || seen[t]) continue;
    if (el.offsetParent === null) continue;
    const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    if (r.width < 8 || r.height < 8) continue;
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    seen[t] = 1; out.push(t);
  }
  return out;
});

(async () => {
  const d = await open({ alpha: true });
  try {
    if (!d.doorIsBehindUs()) {
      ok('the front door opened, so everything below is about the game', false,
         'the door held ' + d.doorMs() + ' ms');
      return;
    }
    ok('the front door opened, so everything below is about the game and not a loading screen',
       true, 'the door held ' + d.doorMs() + ' ms');

    let fr = await findFrames(d.page);
    if (!fr.city) { ok('the walked city came up', false); return; }
    ok('the walked city came up', true);

    /* ---------- THE WALK, BEFORE ---------- */
    const walkWords = await READ(fr.city);
    const walkPad = await fr.city.evaluate(() => {
      const g = id => { const e = document.getElementById(id); if (!e) return null;
        const b = e.getBoundingClientRect();
        return { w: Math.round(b.width), h: Math.round(b.height),
                 fromRight: Math.round(innerWidth - (b.x + b.width / 2)),
                 fromBottom: Math.round(innerHeight - (b.y + b.height / 2)) }; };
      /* AND THE COLOURS OFF THE WALK'S OWN RING, so the fight is compared to HIM and not
         to a value typed into this file, which would drift the day either lane tunes one. */
      const seg = document.querySelector('#padring .pseg'), arr = document.querySelector('#padring .parr');
      const cs = e => e ? getComputedStyle(e) : null;
      const s = cs(seg), a = cs(arr);
      return { nav: g('nav'), face: g('mode'),
               segs: document.querySelectorAll('#padring .pb').length,
               segFill: s ? s.fill : null, segLine: s ? s.stroke : null, arrFill: a ? a.fill : null };
    });

    /* ---------- START A FIGHT THE WAY HE STARTS ONE ---------- */
    let aim = null;
    for (const off of [1, 2, 3]) {
      await fr.city.evaluate((o) => {
        try {
          const list = BohemiaHostiles.near({ seed: (typeof seed !== 'undefined' ? seed : 0),
            at: [hx, hy], radius: 60, probe: hostileProbe, danger: hostDanger(),
            density: HOST_DENSITY, day: (T.day | 0) });
          const c = list.map(x => ({ at: x.at,
            d: Math.max(Math.abs(x.at[0] - hx), Math.abs(x.at[1] - hy)) })).sort((a, b) => a.d - b.d)[0];
          if (c) window.__CITY.human(c.at[0], c.at[1] + o);
        } catch (e) {}
      }, off);
      await d.page.waitForTimeout(1600);
      aim = await fr.city.evaluate(() => {
        const c = document.querySelector('canvas'), r = c.getBoundingClientRect();
        const hits = (typeof HOST_HIT !== 'undefined' && HOST_HIT) || [];
        for (const h of hits) for (const f of [0.5, 0.62, 0.74]) {
          const cx = h.x + h.w / 2, cy = h.y + h.h * f;
          if (!streetTapFoe(cx, cy)) continue;
          const px = r.left + cx * r.width / c.width, py = r.top + cy * r.height / c.height;
          const el = document.elementFromPoint(px, py);
          if (el && el.tagName === 'CANVAS') return { x: px, y: py };
        }
        return { x: null, boxes: hits.length };
      });
      if (aim && aim.x != null) break;
    }
    if (!aim || aim.x == null) { ok('a hostile body to tap, so a real fight can start', false,
      'boxes ' + (aim && aim.boxes)); return; }
    const fb = await (await fr.city.frameElement()).boundingBox();
    await d.page.touchscreen.tap(fb.x + aim.x, fb.y + aim.y);
    await d.page.waitForTimeout(6000);

    fr = await findFrames(d.page);
    const inFight = await d.pageEval(() => {
      const f = document.getElementById('combatFrame');
      if (!f) return false;
      const r = f.getBoundingClientRect();
      return getComputedStyle(f).display !== 'none' && r.width > 40 && r.height > 40;
    });
    if (!inFight || !fr.fight) { ok('the tap started a fight', false); return; }
    ok('the tap started a fight', true);

    const fightWords = await READ(fr.fight);
    const fightPad = await fr.fight.evaluate(() => {
      const ring = document.getElementById('padring'), fire = document.getElementById('fire');
      const box = e => { if (!e) return null; const b = e.getBoundingClientRect();
        return { w: Math.round(b.width), h: Math.round(b.height),
                 fromRight: Math.round(innerWidth - (b.x + b.width / 2)),
                 fromBottom: Math.round(innerHeight - (b.y + b.height / 2)) }; };
      const segs = ring ? ring.querySelectorAll('.pb').length : 0;
      const seg = ring ? ring.querySelector('.pb path') : null;
      const arr = ring ? ring.querySelectorAll('.pb path')[1] : null;
      const cs = e => e ? getComputedStyle(e) : null;
      const s = cs(seg), a = cs(arr);
      /* THE SHAPE HE REJECTED, COUNTED. 9/7: "I don't want them to be independent
         circles." A mover that is a round button is that shape whatever it is called. */
      let loose = 0;
      const wrap = document.getElementById('movering');
      if (wrap) for (const b of Array.from(wrap.querySelectorAll('button'))) {
        const st = getComputedStyle(b), r = b.getBoundingClientRect();
        if (parseFloat(st.borderRadius) >= r.width / 2 - 1 && r.width < 40 && r.width > 4) loose++;
      }
      return { ring: box(ring), fire: box(fire), segs: segs, loose: loose,
               segFill: s ? s.fill : null, segLine: s ? s.stroke : null, arrFill: a ? a.fill : null };
    });

    console.log('  THE WALK  ' + JSON.stringify(walkPad));
    console.log('  THE FIGHT ' + JSON.stringify(fightPad));

    /* ================= HIS 9/7 RULING, IN THE FIGHT ================= */
    ok('*** THE MOVER IS ONE RING, CUT INTO EIGHT, AND NOT EIGHT INDEPENDENT CIRCLES '
       + '(Paolo 9/7, picking option 1 off his own sheet: "I want the action button to be only '
       + 'surrounded by one other circle, and that circle is cut into how many parts of the '
       + 'directions that we need. I do not want them to be independent circles"). The walked '
       + 'city built it that round and the fight did not, so the shape he rejected was the '
       + 'first thing his thumb met when a fight started. ***',
       fightPad.segs === 8 && fightPad.loose === 0,
       fightPad.segs + ' segments, ' + fightPad.loose + ' loose circles');

    ok('and the walk still has the same eight, so this is one control and not two that '
       + 'happen to agree today',
       walkPad.segs === 8, walkPad.segs + ' segments on the walk');

    /* ================= AND IT IS THEIR PAINT, NOT A COPY =================
       Compared frame to frame in one run. A constant typed into a gate goes stale the
       first time either lane tunes a colour, and then the gate is green about two
       controls that no longer match. */
    ok('the fight paints its ring with THE WALK\'S OWN VALUES, measured off both documents '
       + 'in the same run rather than against a number typed into this gate',
       !!walkPad.segFill && fightPad.segFill === walkPad.segFill
       && fightPad.segLine === walkPad.segLine && fightPad.arrFill === walkPad.arrFill,
       'walk ' + walkPad.segFill + '/' + walkPad.segLine + '/' + walkPad.arrFill
       + '  fight ' + fightPad.segFill + '/' + fightPad.segLine + '/' + fightPad.arrFill);

    /* ================= THE HALVES THE ROW HAS NOT REACHED ================= */
    const sizeOk = fightPad.ring && walkPad.nav
      && Math.abs(fightPad.ring.w - walkPad.nav.w) <= 6
      && Math.abs(fightPad.ring.h - walkPad.nav.h) <= 6;
    ok('*** AND IT IS THE SAME SIZE, because a control that doubles when a fight starts IS '
       + 'the buttons changing (rule 24), and he ordered the walked screen halved. *** NOT DONE '
       + 'YET AND THIS IS THE NUMBER: the fight\'s ring carries the fire button, which says '
       + 'words the walk\'s face does not (SHOOT, HOLD, NOTHING TO SHOOT, ENGAGE and a pinned '
       + 'count), so shrinking it to the walk\'s 40 px face is a decision about where those '
       + 'words live, not a size tweak. Next in this row, with UI [one hud].',
       sizeOk, 'walk box ' + (walkPad.nav && walkPad.nav.w) + ', fight ring '
       + (fightPad.ring && fightPad.ring.w));

    const placeOk = fightPad.fire && walkPad.face
      && Math.abs(fightPad.fire.fromRight - walkPad.face.fromRight) <= 10
      && Math.abs(fightPad.fire.fromBottom - walkPad.face.fromBottom) <= 10;
    ok('and his thumb finds the face in the same place, measured from the corner of the glass '
       + 'on both surfaces. NOT DONE YET, and it follows the size above rather than being its '
       + 'own job: the same corner at a different scale puts the centre somewhere else.',
       placeOk, 'walk ' + JSON.stringify(walkPad.face && [walkPad.face.fromRight, walkPad.face.fromBottom])
       + ' fight ' + JSON.stringify(fightPad.fire && [fightPad.fire.fromRight, fightPad.fire.fromBottom]));

    /* ================= THE ROW'S OWN SHIP TEST, AS A RATCHET ================= */
    const survived = walkWords.filter(w => fightWords.indexOf(w) >= 0);
    console.log('  VANISHED : ' + walkWords.filter(w => fightWords.indexOf(w) < 0).join(' | '));
    console.log('  SURVIVED : ' + (survived.join(' | ') || '(nothing)'));
    ok('*** NOTHING ON HIS SCREEN IS REPLACED WHEN A FIGHT STARTS (rule 24: "same screen, same '
       + 'buttons, same UI every second"). *** THIS IS THE ROW AND IT IS NOT BUILT: the fight is '
       + 'still a second document that takes the whole panel, so the walk\'s screen is torn down '
       + 'and another one is put up. The number is what it costs him.',
       survived.length >= 3,
       survived.length + ' of ' + walkWords.length + ' things he could read survived');

    ok('and the walked world is still on the glass behind the fight, rather than hidden',
       await d.pageEval(() => { const c = document.getElementById('cityFrame');
         if (!c) return false; const r = c.getBoundingClientRect();
         return r.width > 40 && r.height > 40; }),
       'the city frame is torn down to 0x0 when the combat panel takes over');

    ok('no page errors through the walk, the tap and the fight', d.errs.length === 0,
       d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== ONE MODE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
