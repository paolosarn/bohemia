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
      const BAD_WORDS = [ALLY_NAME, 'CLEAR', 'OUT', 'HOLD'];
      const proto = CanvasRenderingContext2D.prototype;
      const orig = { ellipse: proto.ellipse, arc: proto.arc, fillText: proto.fillText, fill: proto.fill, stroke: proto.stroke };
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
          if (pend && this === ctx) { const c = String(this.fillStyle).toLowerCase();
            if (/^rgba\((120,\s*170,\s*232|106,\s*168,\s*232)/.test(c)) out.blue++;
            if (pend.k === 'arc' && /^rgba\(240,\s*70,\s*48/.test(c)) out.pipMax = Math.max(out.pipMax, pend.r * uz); }
          pend = null; return orig.fill.apply(this, a); };
        proto.stroke = function (...a) {
          if (pend && this === ctx && pend.k === 'ellipse' && /^rgba\(143,\s*232,\s*154/.test(String(this.strokeStyle))) out.allyOval++;
          pend = null; return orig.stroke.apply(this, a); };
        proto.fillText = function (t, ...a) { if (this === ctx && BAD_WORDS.includes(String(t))) out.words[t] = (out.words[t] || 0) + 1;
          return orig.fillText.call(this, t, ...a); };
        try { _COVER_SPR = {}; _COVER_SPRN = 0; } catch (e) {}
        try { G.phase = 'cover'; draw(); draw(); out.frames += 2; } catch (e) { out.err = String(e); }
        Object.assign(proto, orig);
      }
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
    ok('no oval painted under Rosa\'s feet', R.allyOval === 0, R.allyOval + ' painted');
    ok('no page errors', d.errs.length === 0, d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== NOTHING ON THE GROUND GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
