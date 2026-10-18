#!/usr/bin/env node
/* ============================================================================
   NOTHING ON THE GROUND BUT THE GROUND   (COMBAT lane, [house tiles back], V234 + V235, rule 46f)

   *** PAOLO 10/1: "combat is soooo fucked up bro holy shit the tiles below the people dont look
   good man its all fucked up." ***
   *** RULE 46f (LOCKED): "NOTHING ON THE GROUND THAT IS NOT THE GROUND. No pads, ovals, diamonds,
   discs, stickers or words painted on the board. Reach lights the SQUARE tile in the ground's own
   colour; the aim cue lives on the HUD ring; names live in the HUD, never on the floor." And: "the
   whole board drawn at CSS size so every painted pixel is a 3x3 block on his phone." ***

   On the one driver at a 3x phone, in real fights, frame by frame, by WATCHING THE DRAW CALLS the
   board makes (a picture can be argued with; a call that paints an oval lid cannot):
     1. the canvas's backing store is the phone's real pixels, and the game still reads screen units
        (the man is still 112 on the glass, a house still 196);
     2. no oval lid on the cover (the #7a94a8 / #94836a ellipses were 13.9% of the board);
     3. no diamonds and no blue discs (the ground read, the hold, the way out);
     4. no words on the board: her name, CLEAR, OUT, HOLD;
     5. the "he can reach you" dot is small (at most 8 px on the glass) and sits on the man;
     6. no oval painted under Rosa's feet.
   V238 (rule 46f, DIRECTION's F5 and F3): cover is a THING, a block wall from his thumbed wall pool
   or a burnt car on the road, with three values and a contact shadow; a parked car is one tile; and
   nothing of a man's is on the street at his feet (the "he sees you" ring, the health bar, the gun
   stick, the car's oval shadow).
   ========================================================================== */
const { open } = require('../tools/bohemia_drive_the_demo.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? ' (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? ' (' + note + ')' : ''))); };

(async () => {
  const d = await open({ alpha: true });
  try {
    await d.page.click('[data-p="combat"]').catch(() => {});
    await d.page.waitForTimeout(7000);
    let fr = null;
    for (let i = 0; i < 40 && !fr; i++) {
      for (const f of d.page.frames()) {
        try { if (await f.evaluate(() => typeof setupCombat === 'function' && typeof draw === 'function' && typeof litTile === 'function')) { fr = f; break; } } catch (e) {}
      }
      if (!fr) await d.page.waitForTimeout(500);
    }
    if (!fr) { ok('the fight answers, with the floor helpers in it', false); return; }
    ok('the fight answers, with the floor helpers in it', true);

    const R = await fr.evaluate(async () => {
      const out = { frames: 0, lids: 0, blue: 0, words: {}, pipMax: 0, allyOval: 0 };
      const rect = cv.getBoundingClientRect();
      out.css = [Math.round(rect.width), Math.round(rect.height)];
      out.game = [cv.width, cv.height];
      out.real = realPx(cv);
      out.dpr = window.devicePixelRatio; out.FD = FD;
      const BAD_WORDS = [ALLY_NAME, 'CLEAR', 'OUT', 'HOLD', 'AMMO', 'PLATE', 'TAKE', 'KEY'];
      const proto = CanvasRenderingContext2D.prototype;
      const orig = { ellipse: proto.ellipse, arc: proto.arc, fillText: proto.fillText, fill: proto.fill, stroke: proto.stroke, strokeRect: proto.strokeRect, fillRect: proto.fillRect, drawImage: proto.drawImage };
      out.things = {}; out.eyesRing = 0; out.carOval = 0; out.feetBar = 0; out.stub = 0; out.carCells = 0; out.cars = 0;
      let pend = null;
      for (let s = 1; s <= 16; s++) {
        try { BohemiaArena.set(s); setupCombat(); } catch (e) { continue; }
        if (G.arenaKind !== 'street') continue;
        await new Promise(r => setTimeout(r, 250));
        const uz = uzEff();
        proto.ellipse = function (...a) { pend = { k: 'ellipse', r: Math.max(a[2], a[3]), ctx: this }; return orig.ellipse.apply(this, a); };
        proto.arc = function (...a) { pend = { k: 'arc', r: a[2], ctx: this }; return orig.arc.apply(this, a); };
        proto.fill = function (...a) {
          if (pend) { const c = String(this.fillStyle).toLowerCase();   /* any canvas: the lids were baked into sprites */
            if (pend.k === 'ellipse' && (c === '#7a94a8' || c === '#94836a')) out.lids++; }
          if (pend && this === ctx && pend.k === 'ellipse' && /^rgba\(0,\s*0,\s*0,\s*0\.3\)$/.test(String(this.fillStyle))) out.carOval++;
          if (pend && this === ctx) { const c = String(this.fillStyle).toLowerCase();
            if (/^rgba\((120,\s*170,\s*232|106,\s*168,\s*232)/.test(c)) out.blue++;
            if (pend.k === 'arc' && /^rgba\(240,\s*70,\s*48/.test(c)) out.pipMax = Math.max(out.pipMax, pend.r * uz);
            if (pend.k === 'arc' && /^rgba\((95,\s*200,\s*110|232,\s*60,\s*40)/.test(c)) out.discs = (out.discs || 0) + 1; }
          pend = null; return orig.fill.apply(this, a); };
        proto.strokeRect = function (...a) { if (this === ctx) out.frames_ = (out.frames_ || 0) + 1, out.rects = (out.rects || 0) + 1; return orig.strokeRect.apply(this, a); };
        proto.stroke = function (...a) {
          if (this === ctx && String(this.strokeStyle).replace(/\s/g, '') === 'rgba(120,108,86,0.4)') out.grid = (out.grid || 0) + 1;
          if (pend && this === ctx && pend.k === 'ellipse' && /^rgba\(143,\s*232,\s*154/.test(String(this.strokeStyle))) out.allyOval++;
          if (pend && this === ctx && pend.k === 'ellipse' && /^rgba\((240,\s*232,\s*208|24,\s*20,\s*16)/.test(String(this.strokeStyle))) out.eyesRing++;   /* its dark seat is stroked first */
          if (this === ctx && String(this.strokeStyle).toLowerCase() === '#242220' && this.lineWidth === 3) out.stub++;
          pend = null; return orig.stroke.apply(this, a); };
        proto.fillRect = function (...a) { if (this === ctx && /^rgba\(232,\s*60,\s*40,\s*0\.85\)$/.test(String(this.fillStyle)) && a[3] === 2) out.feetBar++;
          return orig.fillRect.apply(this, a); };
        proto.drawImage = function (im, ...a) { if (this === ctx && im && im.__v238) out.things[im.__v238] = (out.things[im.__v238] || 0) + 1;
          return orig.drawImage.call(this, im, ...a); };
        { const per = {}; for (const P of G.pillars) if (P.car) per[P.car] = (per[P.car] || 0) + 1;
          for (const k in per) { out.cars++; out.carCells = Math.max(out.carCells, per[k]); } }
        const _seen = window.seesMe; try { seesMe = () => true; } catch (e) {}   /* every man sees him, so the ring would draw if it still existed */
        proto.fillText = function (t, ...a) { if (this === ctx && BAD_WORDS.includes(String(t))) out.words[t] = (out.words[t] || 0) + 1;
          return orig.fillText.call(this, t, ...a); };
        try { _COVER_SPR = {}; _COVER_SPRN = 0; } catch (e) {}
        G.drops = [{ ea: 0, edist: 1, lvl: 0, n: 3 }, { ea: 2, edist: 1.4, lvl: 0, key: true }];
        G.grenade = { ea: 1, edist: 1.5, fuse: 2, lvl: 0 };
        for (const P of G.pillars) if (!P.house && !P.car) out.coverR = Math.max(out.coverR || 0, P.r || 0);
        try { G.phase = 'cover'; draw(); draw(); out.frames += 2; } catch (e) { out.err = String(e); }
        Object.assign(proto, orig); G.drops = []; G.grenade = null; try { seesMe = _seen; } catch (e) {}
      }
      /* F5, measured on the sprite itself: a tall wall from the pool, at this phone's pixels */
      /* COMBAT 2's wall (rule 55), as the board bakes it: its values, and its own shadow (the darkest band, under a third) */
      try { const S = coverPieceSprite('wall', 196), c = S.c, g = c.getContext('2d');
        const D = g.getImageData(0, 0, c.width, c.height).data, bins = new Array(8).fill(0); let n = 0, shadow = 0;
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4, a = D[i + 3];
          if (a < 128) continue; const L = D[i] * 0.3 + D[i + 1] * 0.59 + D[i + 2] * 0.11; n++;
          bins[Math.min(7, Math.floor(L / 32))]++; if (L < 70) shadow++; }
        out.f5 = { values: bins.filter(b => b >= n * 0.05).length, shadow: shadow, w: c.width, h: c.height }; } catch (e) { out.f5 = { err: String(e) }; }
      out.body = +(112 * bodyRule()).toFixed(2);
      out.valve = typeof fdWatch === 'function'; out.drop = G._fdDrop || [];
      return out;
    });
    console.log('  ' + JSON.stringify(R));

    ok('*** THE FIGHT DRAWS AT THE PHONE\'S REAL PIXELS: the backing store is the screen size times the '
       + 'device ratio, so a painted pixel is one of the phone\'s, not a 3x3 block ***',
       R.FD === Math.max(1, Math.min(3, Math.round(R.dpr))) && R.real[0] === R.css[0] * R.FD,
       'real ' + R.real.join('x') + ' for a ' + R.css.join('x') + ' screen at ratio ' + R.dpr);
    ok('the safety valve is there, and it only ever stepped down for a measured reason (under 40 fps in a settled fight)',
       R.valve && R.drop.every(x => x.fps < 40), R.drop.length ? JSON.stringify(R.drop) : 'no step-down');
    ok('and every rule still reads screen units: the game sees the screen size and the man is still 112',
       R.game[0] === R.css[0] && Math.abs(R.body - 112) < 0.5, 'game ' + R.game.join('x') + ', man ' + R.body);
    ok('the board was really drawn while watching', R.frames >= 10 && !R.err, R.frames + ' frames' + (R.err ? ', ' + R.err : ''));
    ok('*** NO OVAL LIDS ON THE COVER (the blue and tan ellipses, 13.9% of the board) ***', R.lids === 0, R.lids + ' painted');
    ok('*** NO DIAMONDS AND NO BLUE DISCS on the floor (the ground read, the hold, the way out) ***', R.blue === 0, R.blue + ' painted');
    ok('*** NO WORDS ON THE BOARD: her name, CLEAR, OUT, HOLD live in the HUD ***',
       Object.keys(R.words).length === 0, JSON.stringify(R.words));
    ok('the "he can reach you" dot is small and on the man, never a disc on the street (at most 8 px on the glass)',
       R.pipMax <= 8, R.pipMax.toFixed(1) + ' px');
    ok('*** NO GRID: the eight outlined squares drawn round him every frame are gone, and a lit tile has no frame ***',
       !R.grid && !R.rects, (R.grid || 0) + ' grid strokes, ' + (R.rects || 0) + ' outlined squares');
    ok('*** NO DISCS FOR THE GRENADE OR THE PICKUPS, and no AMMO / PLATE / TAKE / KEY on the floor: each is its tile, lit, with the thing on it ***',
       !R.discs, (R.discs || 0) + ' discs');
    ok('*** COVER NO WIDER THAN A HOUSE: on the house board no piece rolls an r over 0.56 (half-width 0.9r) ***',
       (R.coverR || 0) > 0 && R.coverR <= 0.56 + 1e-9, 'widest r ' + (R.coverR || 0).toFixed(3));
    ok('no oval painted under Rosa\'s feet', R.allyOval === 0, R.allyOval + ' painted');
    ok('*** COVER IS A THING (V238, F5, rule 55): the board draws COMBAT 2\'s block walls and dead cars, never a tan box ***',
       (R.things.wall || 0) > 0 && (R.things.wreck || 0) > 0, JSON.stringify(R.things));
    ok('a wall piece has at least three values and its own contact shadow (DIRECTION\'s F5 bar)',
       R.f5 && R.f5.values >= 3 && R.f5.shadow > 0, JSON.stringify(R.f5));
    ok('*** A CAR IS ONE TILE ON THE HOUSE BOARD: his 2 by 3 was on the 1.5 m tile, and a combat tile is a house (no 24 m cars) ***',
       R.cars > 0 && R.carCells === 1, R.cars + ' cars, the biggest ' + R.carCells + ' tile(s)');
    ok('*** NOTHING OF A MAN\'S ON THE STREET AT HIS FEET: no "he sees you" ring, no health bar, no gun stick, no oval car shadow ***',
       R.eyesRing === 0 && R.feetBar === 0 && R.stub === 0 && R.carOval === 0,
       R.eyesRing + ' rings, ' + R.feetBar + ' bars, ' + R.stub + ' sticks, ' + R.carOval + ' car ovals');
    ok('no page errors', d.errs.length === 0, d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== NOTHING ON THE GROUND GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
