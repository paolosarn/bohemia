/* ==========================================================================
   __A_REAL_FOG_OF_WAR__ (WORLD 15, 11/22; VAMILY rule 470(c), ask row 703; rule 441; rule 454(a): no words)

   PAOLO 11/22, on the trucker's card ('...I can't find a town without paying THE SURVEYOR for a piece of his map'): 'until you kill
   the surveyor you don't even get to see the rest of the map... I know you can like see the whole map technically right now and I
   hate that. How about there's like a real fog of war you know where you can't see anything underneath it and it can be whatever
   sort of aesthetic you want it to be... maybe if you kill the surveyor then like you can see the faint map as it is right now that
   you haven't discovered, cause right now you can see everything, it's just dark kind of vibes'.

   MEASURED 11/22 on a stranger's new game (the demo, fog on): the ground he had never seen showed the whole city faint under the
   static (WORLD TWO's faint city, slices/bohemia_his_map.js fogDraw, rule 243(b)1: its blocks, its freeways, its towers), and on top
   of the fog the map still drew the road shields (95, US 95), the mountains' names, a checkpoint's name, the camps' smoke, a building
   and a party. That is 'you can see everything, it's just dark'.

   NOW: UNTIL THE SURVEYOR FALLS, what he has never seen is HIDDEN: after the map has drawn the whole frame (names, smoke and parties
   included), one cover of tape static is laid over every block RUN's fog marks unseen, OPAQUE, nothing under it: a dead channel,
   near-black grain and scanlines, two frames trading places on the beat with a tracking band (analog horror, rule 9/20). Where he has been stays
   seen and stays drawn, the soft edge of RUN's fog kept. The region past the valley's square is the same dead channel.
   WHEN THE SURVEYOR FALLS (his map is copied, rule 330's boss; slices/bohemia_bosses.js THE SURVEYOR's hole) the cover lifts for good
   and the undiscovered map shows faint, the way it showed before this (WORLD TWO's faint city), kept with the game (his fall is).
   The bench (bohemia.fog.off, every older gate's valley) and a game from before the fog (FOG.all) are untouched.
     BohemiaRealFog.on          the switch (the page test's, never the game's)
     BohemiaRealFog.lifted()    true once THE SURVEYOR has fallen in this game
     BohemiaRealFog.last        the last frame: {drew, ms, why}
   One seam: window.render is wrapped; the cover is drawn after the frame with the frame's own camera (MAP_DEPTH.ox/oy, set where
   he is drawn) and the frame's own base transform. No word, no tap, no rule of its own.
   ========================================================================== */
(function (root) {
  'use strict';
  if (typeof root.render !== 'function' || typeof root.iso !== 'function') return;
  var RF = root.BohemiaRealFog = { on: true, last: { drew: 0, ms: 0, why: '' }, err: null, m: null, c: [null, null], cs: [null, null], at: null, tile: null, K3: 4 };

  function hm() { try { return root.BohemiaHisMap && root.BohemiaHisMap.state ? root.BohemiaHisMap.state() : null; } catch (e) { return null; } }
  /* THE SURVEYOR has fallen in this game: his map is copied (WORLD TWO's ladder keeps the fall with the game) */
  RF.lifted = function () {
    var S = hm(), f = S && S.boss && S.boss.fallen; if (!f) return false;
    for (var k in f) if (f[k] && /SURVEYOR/i.test(k)) return true;
    return false;
  };
  function wanted() {
    try {
      if (!RF.on) return 'off';
      if (typeof FOG === 'undefined' || !FOG.on) return 'the bench';
      if (!FOG.ready || FOG.all || !FOG.cv) return 'no fog';
      if (typeof MODE === 'undefined' || MODE !== 'city') return 'not the map';
      if (typeof SKY !== 'undefined' && SKY) return 'the sky';
      if (typeof root.streetIsOn === 'function' && root.streetIsOn()) return 'the street';
      if (root.__MAP_RESTING) return 'resting under a fight';
      if (RF.lifted()) return 'the surveyor fell';
      return '';
    } catch (e) { return 'error'; }
  }
  /* the dead channel: near-black grain, every other line darker (RUN's own fog tape, opaque) */
  function tile() {
    if (RF.tile) return RF.tile;
    var c = document.createElement('canvas'); c.width = c.height = 96;
    var x = c.getContext('2d'), im = x.createImageData(96, 96), d = im.data, r = 31337;
    for (var j = 0; j < 96; j++) for (var i = 0; i < 96; i++) {
      r = (r * 1103515245 + 12345) >>> 0; var n = (r >>> 24) & 31, scan = (j % 2) ? 0 : 6, k = (j * 96 + i) * 4;
      d[k] = 10 + n - scan; d[k + 1] = 9 + (n * 0.9 | 0) - scan; d[k + 2] = 8 + (n * 0.8 | 0) - scan; d[k + 3] = 255;
    }
    x.putImageData(im, 0, 0); RF.tile = c; return c;
  }

  /* THE COST (measured 11/22: the cover built whole every frame was 11.6 ms on this box, and a pinch rebuilt it every frame): (1) RUN's
     fog made opaque once a fog change (a block seen, a block forgotten); (2) the cover, a margin wider than the glass at a quarter of its
     pixels, carried to each frame's camera (the map's projection is a shift and a scale) while it still covers the glass, built crisp
     again when the camera holds; (3) two frames of grain that trade places on the beat. A frame that changes none of them is one draw. */
  RF.ver = 0;
  function opaque(F) {
    if (F.dirty) { F.dirty = false; RF.ver++; }   /* nobody else reads it: a block seen (fogReveal) or forgotten (THE SURVEYOR's hole) */
    var key = RF.ver + ':' + F.cv.width;
    if (RF.op && RF.opKey === key && RF.opSrc === F.cv) return RF.op;
    if (!RF.op || RF.op.width !== F.cv.width || RF.op.height !== F.cv.height) { RF.op = document.createElement('canvas'); RF.op.width = F.cv.width; RF.op.height = F.cv.height; RF.opx = RF.op.getContext('2d'); }
    /* RUN's dark is 246 of 255 (and THE SURVEYOR's forgotten blocks the same): lifted to full by one additive pass of a twenty-fifth
       of itself (246 + 10 is full); a clear block stays clear and the soft edge round what he has seen moves by a twenty-fifth */
    var o = RF.opx; o.globalCompositeOperation = 'copy'; o.globalAlpha = 1; o.drawImage(F.cv, 0, 0);
    o.globalCompositeOperation = 'lighter'; o.globalAlpha = 0.04; o.drawImage(F.cv, 0, 0); o.globalCompositeOperation = 'source-over'; o.globalAlpha = 1;
    RF.opKey = key; RF.opSrc = F.cv; RF.builds = (RF.builds | 0) + 1; return RF.op;
  }
  function build(W, H, M, WW, HH, ox, oy, m, op, beat) {
    var F = FOG, S = F.S, K = F.K, n = F.N, K3 = RF.K3, q = 1 / K3;
    /* the mask: RUN's fog made opaque (unseen opaque, seen cut out with its soft edge) on the frame's camera, a margin wider than the
       glass, and everything past the region's square */
    var mx = RF.mx; mx.setTransform(1, 0, 0, 1, 0, 0); mx.clearRect(0, 0, WW, HH); mx.globalCompositeOperation = 'source-over'; mx.imageSmoothingEnabled = true;
    mx.setTransform(m.a * q, 0, 0, m.d * q, M, M);
    var c1 = iso(-K, -K, ox, oy), c2 = iso(n + K, -K, ox, oy), c3 = iso(n + K, n + K, ox, oy), c4 = iso(-K, n + K, ox, oy), pad = M * K3 / m.a + 8;
    mx.beginPath(); mx.rect(-pad, -pad, CVW + 2 * pad, CVH + 2 * pad); mx.moveTo(c1.sx, c1.sy); mx.lineTo(c2.sx, c2.sy); mx.lineTo(c3.sx, c3.sy); mx.lineTo(c4.sx, c4.sy); mx.closePath();
    mx.fillStyle = '#000'; mx.fill('evenodd');
    mx.transform(TW / 2 / S, TH / 2 / S, -TW / 2 / S, TH / 2 / S, ox, oy - K * TH);
    mx.drawImage(op, 0, 0);
    mx.setTransform(1, 0, 0, 1, 0, 0);
    RF.c = [null, null]; paint(beat % 2, WW, HH);
    RF.at = { ox: ox, oy: oy, tw: TW, op: RF.opKey, W: W, H: H, a: m.a, M: M, WW: WW, HH: HH }; RF.rebuilds = (RF.rebuilds | 0) + 1; RF.approx = false;
  }
  /* the dead channel through the mask, one of two frames of grain that trade places on the beat (the tape breathes, RUN's own way);
     the other is made the first beat it is wanted */
  function paint(f, WW, HH) {
    var c = RF.cs[f]; if (!c || c.width !== WW || c.height !== HH) { c = RF.cs[f] = document.createElement('canvas'); c.width = WW; c.height = HH; }
    var x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'copy';
    if (!RF.pat) RF.pat = x.createPattern(tile(), 'repeat');
    x.fillStyle = RF.pat; x.save(); x.translate(f * 37, f * 11); x.fillRect(-96, -96, WW + 192, HH + 192); x.restore();
    var bh = Math.max(2, Math.round(HH * 0.025)), by = Math.round(HH * (f ? 0.62 : 0.21));
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = f ? 0.09 : 0.06; x.fillStyle = '#d8d0c0'; x.fillRect(0, by, WW, bh); x.globalAlpha = 1;
    x.globalCompositeOperation = 'destination-in'; x.drawImage(RF.m, 0, 0); x.globalCompositeOperation = 'source-over';
    RF.c[f] = c; return c;
  }
  function cover(base) {
    var t0 = performance.now(), cnv = g.canvas, K3 = RF.K3, GW = cnv.width, GH = cnv.height;
    var W = Math.max(1, Math.ceil(GW / K3)), H = Math.max(1, Math.ceil(GH / K3)), M = Math.round(Math.max(W, H) * 0.15), WW = W + 2 * M, HH = H + 2 * M;
    if (!RF.m || RF.m.width !== WW || RF.m.height !== HH) { RF.m = document.createElement('canvas'); RF.m.width = WW; RF.m.height = HH; RF.mx = RF.m.getContext('2d'); RF.cs = [null, null]; RF.c = [null, null]; RF.pat = null; RF.at = null; }
    var ox = MAP_DEPTH.ox, oy = MAP_DEPTH.oy, beat = 0; try { beat = mapArtBeat(); } catch (e) {}
    var m = base, op = opaque(FOG), A = RF.at, rebuilt = 0, x0 = 0, y0 = 0, sc = 1;
    RF.why = !A ? 'none' : A.op !== RF.opKey ? 'fog' : (A.W !== W || A.H !== H || A.a !== m.a) ? 'size' : '';
    if (A && A.op === RF.opKey && A.W === W && A.H === H && A.a === m.a) {
      /* the cover built last, carried to this frame's camera: the map's own projection is a shift and a scale (a slide while he walks,
         a pinch while he zooms), so the old cover lands exactly where the ground moved to; used while it still covers the whole glass */
      sc = TW / A.tw; x0 = m.a * (ox - sc * A.ox) - sc * M * K3; y0 = m.d * (oy - sc * A.oy) - sc * M * K3;
      var w = WW * K3 * sc, h = HH * K3 * sc, still = RF.cam === ox + ',' + oy + ',' + TW && t0 - RF.camT > 120;   /* the camera has held 120 ms (the map draws more than once a step) */
      RF.why = !(sc > 0.75 && sc < 1.34) ? 'zoom ' + sc.toFixed(2) : !(x0 <= 0 && y0 <= 0 && x0 + w >= GW && y0 + h >= GH) ? 'off the glass ' + [Math.round(x0), Math.round(y0), Math.round(x0 + w - GW), Math.round(y0 + h - GH)].join(',') : (RF.approx && still) || (sc !== 1 && still) ? 'crisp' : '';
      if (!(sc > 0.75 && sc < 1.34 && x0 <= 0 && y0 <= 0 && x0 + w >= GW && y0 + h >= GH) || (RF.approx && still) || (sc !== 1 && still)) A = null;
      else if (sc !== 1) RF.approx = true;
    } else A = null;
    if (!A) { build(W, H, M, WW, HH, ox, oy, m, op, beat); x0 = -M * K3; y0 = -M * K3; sc = 1; rebuilt = 1; }
    var cam = ox + ',' + oy + ',' + TW; if (cam !== RF.cam) { RF.cam = cam; RF.camT = t0; }
    var f = beat % 2, c = RF.c[f] || paint(f, WW, HH);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.imageSmoothingEnabled = false;
    g.drawImage(c, x0, y0, WW * K3 * sc, HH * K3 * sc);
    g.restore();
    RF.last = { drew: 1, ms: Math.round((performance.now() - t0) * 100) / 100, why: 'hidden', at: [ox, oy], rebuilt: rebuilt, sc: Math.round(sc * 1000) / 1000, because: RF.why || '' };
  }
  /* while the cover is up, the faint city under it is never seen: WORLD TWO's faint pass (a copy of the glass, three blends) is not
     run for it, and RUN's dark is not drawn either (the cover is the fog); after THE SURVEYOR falls both are as they were */
  function hookFaint() {
    var H = root.BohemiaHisMap; if (!H || H.__realFog || typeof H.fogDraw !== 'function') return !!(H && H.__realFog);
    var _fd = H.fogDraw; H.fogDraw = function (ox, oy) { if (!wanted()) { RF.skipped = (RF.skipped | 0) + 1; return true; } return _fd.apply(this, arguments); };
    H.__realFog = true; return true;
  }

  var _render = root.render;
  root.render = function () {
    if (!RF.hooked) { try { RF.hooked = hookFaint(); } catch (e) {} }
    var r = _render.apply(this, arguments);
    try {
      var why = wanted();
      if (why) { RF.last = { drew: 0, ms: 0, why: why }; return r; }
      var k = g.canvas.width / CVW;   /* the frame's base: CSS pixels to the glass's own (the phone's pixel ratio) */
      cover({ a: k, b: 0, c: 0, d: g.canvas.height / CVH, e: 0, f: 0 });
    } catch (e) { RF.err = String(e && e.message || e); }
    return r;
  };
})(window);
