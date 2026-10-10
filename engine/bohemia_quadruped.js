/* BOHEMIA QUADRUPED -- a four-legged body on the 120 beat (ANIMATION [four legs], 10/9).
   Rule 42 (Paolo 9/29): the beasts are LAB-MADE, de-extinct, Ice Age and after; Battle Brothers' bestiary is the
   floor. Its Direwolf is "fast, pack", 12 action points, bites three times if it does not move (the library 09 and
   Grok 01/08). The rig is a biped and nothing in the bank walks on four legs, so this is the smallest quadruped
   that reads at the fight's man size (the 112 frame the fight's people stand in): a dire wolf, shoulder 44 px
   against a man of ~100, nose to tail ~96.

   PURE: no DOM, no canvas. pose(clip, ph) -> a skeleton; raster(skel) -> 112x112 RGBA, palette-indexed, no
   anti-aliasing, a one-pixel border (THE BORDER IS ONE PIXEL), the back the biggest lit surface (45 DEGREE ART
   LAW: you are above it), the far legs in shadow. Facing right (SE); SW is the mirror. Clips:
     idle  4 beats  breath, a tail sway, an ear flick
     walk  2 beats  the four-beat lateral walk: LH, LF, RH, RF, two or three paws down at every moment
     lope  2 beats  the gallop: hinds then fronts, a moment with no paw down, the spine gathering and reaching
     lunge 2 beats  crouch, spring, the jaws open, the bite shuts, recover
     fall  2 beats  the legs go, the body comes down, it lies on its belly, the head last (not a loop)
   DRAWN AT THE MEN'S GRID: three pictures a beat, twelve a bar (POSEHOLD.keys in the alpha, AN ENVELOPE RAMPS
   SLOWER THAN THE GRID). keys(clip) is the list of phases that are ever drawn; nothing between them is. That is why
   the lope is two beats and not one: three pictures cannot hold a gallop, six can, and its suspension is timed to
   fall ON a drawn key (5 of 6), or it would never be seen.
   Ground y = 102. Units: frame pixels. */
(function (root) {
  'use strict';
  var F = 112, GROUND = 102;
  /* the lab dire wolf: dust-grey over brown, a pale chest, a dark muzzle, a yellow ear tag (it was numbered) */
  var PAL = [null, '#141416', '#2a2622', '#3d3832', '#554d42', '#6f6656', '#8f8574', '#9c907a', '#1f1c19', '#c9b458',
             '#d7c04a', '#7a3a34', '#d8d2c4', '#46403a'];
  var C = { line: 1, shade: 2, dark: 3, mid: 4, light: 5, high: 6, chest: 7, muzzle: 8, eye: 9, tag: 10, gum: 11, tooth: 12, far: 13 };
  var BEATS = { idle: 4, walk: 2, lope: 2, lunge: 2, fall: 2 }, KEYS_PER_BEAT = 3;
  var LEN = { fore: [15, 17, 9], hind: [17, 16, 12] };   /* upper, lower, the pastern / metatarsus */

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }

  /* two-bone IK: from joint J to target W, lengths l1 l2, the knee bent toward side s (+1 forward, -1 back) */
  function ik(J, W, l1, l2, s) {
    var dx = W[0] - J[0], dy = W[1] - J[1], d = Math.max(1e-3, Math.min(l1 + l2 - 0.01, Math.hypot(dx, dy)));
    var a = Math.atan2(dy, dx), c = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), b = Math.acos(c);
    var ang = a - s * b;
    return [J[0] + Math.cos(ang) * l1, J[1] + Math.sin(ang) * l1];
  }

  /* one leg: where its paw is, from the gait. Stance: the paw planted, sliding back under the body; swing: up and
     forward. off = the leg's place in the cycle, st = the share of the cycle on the ground. */
  function pawOf(p, off, st, stride, lift, baseX) {
    var u = ((p - off) % 1 + 1) % 1, x, y;
    if (u < st) { var k = u / st; x = baseX + stride / 2 - stride * k; y = GROUND; }
    else { var w = (u - st) / (1 - st); x = baseX - stride / 2 + stride * ease(w); y = GROUND - Math.sin(Math.PI * w) * lift; }
    return [x, y];
  }

  function pose(clip, ph) {
    var t = clip === 'fall' ? clamp(ph, 0, 1) : ((ph % 1) + 1) % 1;   /* the fall is not a loop: t = 1 is lying, never standing again */
    var S = { hip: [29, 60], sh: [66, 57], headUp: 0, jaw: 0, earBack: 0, tail: 0.25, eyeShut: 0, lying: 0, roll: 0 };
    var feet = {};   /* paw targets: LH LF RH RF */
    var bx = 0, by = 0;   /* the whole body's shift */
    var stand = { LH: [27, GROUND], RH: [33, GROUND], LF: [64, GROUND], RF: [70, GROUND] };
    if (clip === 'idle') {
      var br = Math.sin(t * 2 * Math.PI);
      by = br * 0.8; S.tail = 0.25 + 0.15 * Math.sin(t * 4 * Math.PI); S.headUp = 0.05 * Math.sin(t * 2 * Math.PI + 1);
      S.earBack = (t > 0.6 && t < 0.7) ? 1 : 0;   /* one ear flick a bar */
      feet = stand;
    } else if (clip === 'walk') {
      /* the lateral walk: LH 0, LF .25, RH .5, RF .75; 62% of each leg's cycle on the ground, so two or three paws
         are always down. The body rides a little lower as each hind pushes. */
      var stW = 0.62, sw = 20, lw = 5;
      feet = { LH: pawOf(t, 0, stW, sw, lw, 29), LF: pawOf(t, 0.25, stW, sw, lw, 66),
               RH: pawOf(t, 0.5, stW, sw, lw, 31), RF: pawOf(t, 0.75, stW, sw, lw, 68) };
      by = Math.abs(Math.sin(t * 4 * Math.PI)) * 1.2; S.headUp = -0.04 * Math.sin(t * 4 * Math.PI); S.tail = 0.2;
    } else if (clip === 'lope') {
      /* the gallop: the hinds land (.92, 0), then the fronts (.32, .40); each leg 40% down, so between the fronts
         leaving (.80) and the hinds landing (.92) NOTHING touches the ground: the suspension, on drawn key 5 of 6.
         The spine gathers when the hinds land under it and reaches when the fronts do. */
      var stL = 0.40, sl = 26, ll = 9;   /* 26 not 34, 40% not 34: at six keys a longer stride put the fore knee's reach on ONE key (12 px out, 12 back, measured 10/9) */
      feet = { LH: pawOf(t, -0.08, stL, sl, ll, 31), RH: pawOf(t, 0.0, stL, sl, ll, 33),
               LF: pawOf(t, 0.32, stL, sl, ll, 66), RF: pawOf(t, 0.40, stL, sl, ll, 68) };
      var gather = Math.cos(t * 2 * Math.PI);   /* +1 gathered, -1 reaching */
      S.hip = [29 + 4 * gather, 60]; S.sh = [66 - 2 * gather, 57 + 2 * Math.sin(t * 2 * Math.PI)];
      by = -3 * Math.max(0, Math.sin((t - 0.7) * 2 * Math.PI)); S.headUp = -0.12; S.tail = 0.05; S.earBack = 1;
    } else if (clip === 'lunge') {
      /* on the six drawn keys (.08 .25 .42 .58 .75 .92): crouching, crouched, the spring with the jaws open, the
         bite SHUT on the man, recovering, back. crouch .00-.33, spring .33-.50, the bite .50-.67, recover .67-1 */
      var cr = ease(seg(t, 0, 0.3)) * (1 - ease(seg(t, 0.33, 0.48))), sp = ease(seg(t, 0.3, 0.5)) * (1 - ease(seg(t, 0.67, 1)));
      bx = 11 * sp; by = 7 * cr - 7 * sp * (1 - seg(t, 0.5, 0.67));
      S.headUp = -0.25 * cr + 0.12 * sp; S.earBack = cr > 0.3 || sp > 0.2 ? 1 : 0; S.tail = 0.1 - 0.15 * cr;
      S.jaw = (t > 0.34 && t < 0.5) ? 1 : (t >= 0.5 && t < 0.67 ? 0.15 : 0);
      var reach = sp * (1 - seg(t, 0.5, 0.6));
      feet = { LH: [27 + 6 * cr + bx * 0.6, GROUND], RH: [33 + 6 * cr + bx * 0.6, GROUND],
               LF: [64 + bx + 8 * reach, GROUND - 10 * reach], RF: [70 + bx + 9 * reach, GROUND - 8 * reach] };
      S.hip = [29 + bx * 0.7, 60]; S.sh = [66 + bx, 57]; bx = 0;
    } else if (clip === 'fall') {
      /* the legs go at once, the body comes down onto its side and the head last; it does not get up (not a loop) */
      var dn = ease(seg(t, 0.05, 0.6)), hd = ease(seg(t, 0.35, 0.9));
      by = 27 * dn; S.lying = dn; S.earBack = dn > 0.5 ? 1 : 0;   /* lying, the ears go back flat: nothing on it rises again */ S.headUp = -0.2 * dn - 0.25 * hd; S.tail = 0.25 - 0.4 * dn; S.eyeShut = hd > 0.8 ? 1 : 0;
      S.roll = dn;
      /* the near legs splay toward you on the ground, the far ones fold under */
      feet = { LH: [27 - 2 * dn, GROUND], RH: [33 - 16 * dn, GROUND - 1 * dn], LF: [64 + 6 * dn, GROUND],
               RF: [70 + 16 * dn, GROUND - 1 * dn] };
    }
    var hip = [S.hip[0] + bx, S.hip[1] + by], sh = [S.sh[0] + bx, S.sh[1] + by];
    var legs = {};
    ['LH', 'RH', 'LF', 'RF'].forEach(function (k) {
      var hind = k[1] === 'H', L = hind ? LEN.hind : LEN.fore, J = hind ? [hip[0] + (k[0] === 'R' ? 3 : 0), hip[1] + 4] : [sh[0] + (k[0] === 'R' ? 3 : 0), sh[1] + 7];
      var P = feet[k] || stand[k];
      /* the last segment: a hind's metatarsus slopes up and back from the paw; a fore's pastern stands nearly
         upright, a little forward. Lying, both lie flat. */
      var la = hind ? (-Math.PI / 2 - 0.55) : (-Math.PI / 2 + 0.15);
      if (S.lying > 0) la = la * (1 - S.lying) + (hind ? -0.15 : -Math.PI + 0.15) * S.lying;   /* flat along the ground, the paw outward */
      var W = [P[0] + Math.cos(la) * L[2], P[1] + Math.sin(la) * L[2]];
      /* a hind's stifle points FORWARD, its hock back; a fore's elbow points BACK */
      var K = ik(J, W, L[0], L[1], hind ? 1 : -1);
      if (K[1] > GROUND - 1) K[1] = GROUND - 1;   /* no joint under the ground, lying or standing */
      legs[k] = { J: J, K: K, W: W, P: P, near: k[0] === 'R' };
    });
    var neck = [sh[0] + 6, sh[1] - 4], ha = -0.35 + S.headUp + (S.lying ? -0.1 * S.lying : 0);
    var head = [neck[0] + Math.cos(ha) * 14, neck[1] + Math.sin(ha) * 14 + (S.lying ? 13 * S.lying : 0)];
    return { clip: clip, ph: t, hip: hip, sh: sh, neck: neck, head: head, headAng: S.headUp, jaw: S.jaw, earBack: S.earBack,
             tail: S.tail, eyeShut: S.eyeShut, lying: S.lying, legs: legs };
  }

  /* ---- raster: integer pixels only ---- */
  function Canvas() { this.id = new Uint8Array(F * F); }
  Canvas.prototype.put = function (x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < F && y < F) this.id[y * F + x] = c; };
  Canvas.prototype.poly = function (pts, colorAt) {
    var y0 = Math.max(0, Math.floor(Math.min.apply(null, pts.map(function (p) { return p[1]; })))), y1 = Math.min(F - 1, Math.ceil(Math.max.apply(null, pts.map(function (p) { return p[1]; }))));
    for (var y = y0; y <= y1; y++) {
      var yc = y + 0.5, xs = [];
      for (var i = 0; i < pts.length; i++) { var a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) xs.push(a[0] + (yc - a[1]) / (b[1] - a[1]) * (b[0] - a[0])); }
      xs.sort(function (p, q) { return p - q; });
      for (var j = 0; j + 1 < xs.length; j += 2) for (var x = Math.ceil(xs[j] - 0.5); x <= Math.floor(xs[j + 1] - 0.5); x++)
        if (x >= 0 && x < F) this.id[y * F + x] = typeof colorAt === 'function' ? colorAt(x, y) : colorAt;
    }
  };
  Canvas.prototype.limb = function (a, b, w0, w1, c) {   /* a tapered thick line as a quad, round at the joints */
    var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    this.poly([[a[0] + nx * w0 / 2, a[1] + ny * w0 / 2], [b[0] + nx * w1 / 2, b[1] + ny * w1 / 2], [b[0] - nx * w1 / 2, b[1] - ny * w1 / 2], [a[0] - nx * w0 / 2, a[1] - ny * w0 / 2]], c);
    this.disc(a, w0 / 2, c); this.disc(b, w1 / 2, c);
  };
  Canvas.prototype.disc = function (p, r, c) {
    for (var y = Math.floor(p[1] - r); y <= Math.ceil(p[1] + r); y++) for (var x = Math.floor(p[0] - r); x <= Math.ceil(p[0] + r); x++)
      if ((x + 0.5 - p[0]) * (x + 0.5 - p[0]) + (y + 0.5 - p[1]) * (y + 0.5 - p[1]) <= r * r && x >= 0 && y >= 0 && x < F && y < F) this.id[y * F + x] = typeof c === 'function' ? c(x, y) : c;
  };

  function raster(sk) {
    var cv = new Canvas();
    var lie = sk.lying || 0;
    /* FAR LEGS first, in shadow (the 45 law: the far side falls into shadow) */
    ['LH', 'LF'].forEach(function (k) { var g = sk.legs[k]; cv.limb(g.J, g.K, 6, 4, C.far); cv.limb(g.K, g.W, 4, 3, C.far); cv.limb(g.W, g.P, 3, 3, C.far);
      cv.disc([g.P[0] + 1, g.P[1] - 1], 2, C.shade); });
    /* THE TAIL: a bushy chain off the hip, hanging and swaying */
    var ta = Math.PI - 0.6 - sk.tail * 1.2, t0 = [sk.hip[0] - 3, sk.hip[1] - 2], t1 = [t0[0] + Math.cos(ta) * 10, t0[1] - Math.sin(ta) * 10 * -1 + 6],
        t2 = [t1[0] - 9, Math.min(GROUND - 2, t1[1] + 8 - sk.tail * 6)];   /* lying, the tail lies on the ground, not in it */
    cv.limb(t0, t1, 6, 6, C.mid); cv.limb(t1, t2, 6, 3, C.dark); cv.disc(t2, 1.5, C.shade);
    /* THE BODY: a deep chest, a tucked waist, the back lit from above, the far flank and the belly darker */
    var hp = sk.hip, sp = sk.sh, mid = [(hp[0] + sp[0]) / 2, (hp[1] + sp[1]) / 2 - 1];
    var top = [[hp[0] - 7, hp[1] - 4], [hp[0] - 2, hp[1] - 7], [mid[0], mid[1] - 7], [sp[0] + 3, sp[1] - 10], [sp[0] + 10, sp[1] - 3]];
    var bot = [[sp[0] + 9, sp[1] + 10], [sp[0] + 1, sp[1] + 16], [sp[0] - 8, sp[1] + 14], [mid[0] - 2, mid[1] + 7], [hp[0] + 2, hp[1] + 7], [hp[0] - 7, hp[1] + 5]];
    var body = top.concat(bot);
    var yTop = function (x) { return mid[1] - 7 + (x < mid[0] ? (mid[0] - x) / 20 * 2 : (x - mid[0]) / 20 * -1); };
    var shadeBody = function (x, y) { var v = (y - yTop(x)) / 18; if (lie) v -= 0.15 * lie;
      return v < 0.18 ? C.high : v < 0.42 ? C.light : v < 0.78 ? C.mid : (x > mid[0] + 4 ? C.chest : C.dark); };
    cv.poly(body, shadeBody);
    /* THE NECK AND THE HEAD: the skull, the long muzzle, the jaw that opens to bite */
    var nk = sk.neck, hd = sk.head, ang = Math.atan2(hd[1] - nk[1], hd[0] - nk[0]);
    cv.poly([[sp[0], sp[1] - 9], [nk[0] + 1, nk[1] - 8], [hd[0] - 2, hd[1] - 6], [hd[0] - 2, hd[1] + 6], [nk[0] + 3, nk[1] + 11], [sp[0] + 10, sp[1] + 9]],
      function (x, y) { return y < nk[1] - 2 + (x - nk[0]) * Math.tan(ang) ? C.light : C.mid; });
    cv.disc(hd, 7.5, function (x, y) { return y < hd[1] - 2 ? C.light : C.mid; });
    var sa = ang + 0.35, sn = [hd[0] + Math.cos(sa) * 12, hd[1] + Math.sin(sa) * 12];
    var nu = [Math.cos(sa + Math.PI / 2), Math.sin(sa + Math.PI / 2)];
    cv.poly([[hd[0] + 2 - nu[0] * 5, hd[1] - nu[1] * 5 - 1], [sn[0] - nu[0] * 2, sn[1] - nu[1] * 2], [sn[0] + nu[0] * 2, sn[1] + nu[1] * 2], [hd[0] + 2 + nu[0] * 4, hd[1] + nu[1] * 4]],
      function (x, y) { return Math.hypot(x - sn[0], y - sn[1]) < 4 ? C.muzzle : C.mid; });
    /* the lower jaw: shut along the muzzle; open, swung down; teeth and gum show when it is */
    var ja = sa + 0.55 * sk.jaw, jw = [hd[0] + Math.cos(ja) * 11 + nu[0] * 2, hd[1] + Math.sin(ja) * 11 + nu[1] * 2];
    cv.limb([hd[0] + nu[0] * 3, hd[1] + nu[1] * 3], jw, 4, 2, C.dark);
    if (sk.jaw > 0.3) { cv.limb([hd[0] + 4 + nu[0] * 1, hd[1] + nu[1] * 1 + 1], [(jw[0] + sn[0]) / 2, (jw[1] + sn[1]) / 2], 3, 2, C.gum);
      cv.put(sn[0] - 2 + nu[0] * 2, sn[1] - 1 + nu[1] * 2, C.tooth); cv.put(jw[0] - 1, jw[1] - 2, C.tooth); }
    /* the ears: up and forward, or pinned back (the crouch, the lope); the near ear carries the lab's yellow tag */
    var eb = sk.earBack ? -0.9 : 0, e0 = [hd[0] - 1, hd[1] - 5];
    cv.poly([[e0[0] - 3, e0[1] + 1], [e0[0] + Math.cos(-1.9 + eb) * 8, e0[1] + Math.sin(-1.9 + eb) * 8], [e0[0] + 2, e0[1] + 1]], C.far);
    var e1 = [hd[0] + 2, hd[1] - 5];
    cv.poly([[e1[0] - 3, e1[1] + 1], [e1[0] + Math.cos(-1.7 + eb) * 8, e1[1] + Math.sin(-1.7 + eb) * 8], [e1[0] + 2, e1[1] + 1]], C.light);
    cv.put(e1[0], e1[1] - 1, C.tag); cv.put(e1[0] + 1, e1[1] - 1, C.tag); cv.put(e1[0], e1[1], C.tag); cv.put(e1[0] + 1, e1[1], C.tag);
    /* the eye: a dull lamp; shut, a line */
    cv.put(hd[0] + 3, hd[1] - 2, sk.eyeShut ? C.line : C.eye);
    /* NEAR LEGS last, in front of the body, lit */
    ['RH', 'RF'].forEach(function (k) { var g = sk.legs[k]; var hind = k[1] === 'H';
      cv.limb(g.J, g.K, hind ? 8 : 6, 5, C.mid); cv.limb(g.K, g.W, 5, 3, C.dark); cv.limb(g.W, g.P, 3, 3, C.mid);
      cv.disc([g.P[0] + 1, g.P[1] - 1], 2, C.dark); });
    /* THE BORDER IS ONE PIXEL: the silhouette's outer edge, drawn on the empty pixels around it */
    var out = new Uint8Array(cv.id);
    for (var y = 0; y < F; y++) for (var x = 0; x < F; x++) {
      if (cv.id[y * F + x]) continue;
      var n = (x > 0 && cv.id[y * F + x - 1]) || (x < F - 1 && cv.id[y * F + x + 1]) || (y > 0 && cv.id[(y - 1) * F + x]) || (y < F - 1 && cv.id[(y + 1) * F + x]);
      if (n) out[y * F + x] = C.line;
    }
    return out;
  }
  /* indices to RGBA; mirror for SW */
  function rgba(ids, mirror) {
    var o = new Uint8ClampedArray(F * F * 4);
    for (var y = 0; y < F; y++) for (var x = 0; x < F; x++) {
      var c = ids[y * F + (mirror ? F - 1 - x : x)]; if (!c) continue;
      var h = PAL[c], i = (y * F + x) * 4;
      o[i] = parseInt(h.slice(1, 3), 16); o[i + 1] = parseInt(h.slice(3, 5), 16); o[i + 2] = parseInt(h.slice(5, 7), 16); o[i + 3] = 255;
    }
    return o;
  }
  /* paws on the ground at this moment (within a pixel of it): the gait's own signature */
  function pawsDown(sk) { var n = 0; for (var k in sk.legs) if (sk.legs[k].P[1] >= GROUND - 1) n++; return n; }

  /* the phases that are ever drawn: a loop from its start, a fall ending ON the ground (its last key is t = 1) */
  function keys(clip) { var n = BEATS[clip] * KEYS_PER_BEAT, o = [];
    for (var i = 0; i < n; i++) o.push(clip === 'fall' ? (i + 1) / n : clip === 'lunge' ? (i + 0.5) / n : i / n); return o; }
  var api = { F: F, GROUND: GROUND, PAL: PAL, C: C, BEATS: BEATS, KEYS_PER_BEAT: KEYS_PER_BEAT, keys: keys, pose: pose, raster: raster, rgba: rgba, pawsDown: pawsDown,
              frame: function (clip, ph, dir) { return rgba(raster(pose(clip, ph)), dir === 'SW'); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.BohemiaQuadruped = api;
})(typeof window !== 'undefined' ? window : this);
