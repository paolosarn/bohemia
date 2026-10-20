/* ANIMATION [the aura of the one you control], ROUND ONE, 10/19 (rule 120(c); his 10/18: 'when you're controlling a person
   there should be some aura, fifth dimension, electric Amalgamation vibes, analog horror... around that character, even on
   the big map, not just a portrait'). THREE CANDIDATES, ONE FILE, for DIRECTION's judgement and then his VOTE; nothing here
   is wired into the fight or the map (rule 100: nothing art goes in before his FINAL). The VOTE page hooks it onto the real
   fight from outside (the fight's own blitMan is wrapped in the page, never edited), and RUN takes the 'map' size for the
   party marker the day he says YES (RUN [the aura on the map]).

   THE CANON IT ANSWERS, AND THE LINE IT DOES NOT CROSS: the fifth dimension is the thing above time the Amalgamation brushed
   after a hundred years of data (GDD v2, 'The Fifth Dimensional Element'); its gameplay form is the second bar, where
   'enemy movement trajectories become visible -- where they are going' (GDD v2 s15); its ambiguity is permanent (GDD v3,
   Prince Hobo: 'must never be explained'). So the aura is a LOOK and never a word. Purple stays the Amalgamation's alone
   (PURPLE RESERVATION 7/10, NEUROLINK 7/10): no candidate carries it, every added pixel is a step of the style palette's
   chrome, glass or cloth ramps (records/target/BOHEMIA_STYLE_PALETTE.json).

   WHAT EVERY CANDIDATE OBEYS:
   * NEVER A COLOURED OUTLINE (his 10/17 NO on the blue and orange lines round people): nothing traces his silhouette.
   * ON THE BEAT, HELD LIKE STOP-MOTION (rule 115(d), CRASHBOX; the style guide's field 15): every change lands on a twelfth
     of a second, six slots a beat at 120 BPM (the feral dog pack's grid); between two slots nothing moves.
   * THE RIG'S LOOK (rule 115): no glow, no blur, no gradient, no filter and no composite mode on the world canvas (the
     horror reading's R10), nothing see-through laid over the frame (R8): the echo is his own pixels on every other row,
     the tear is the world's own pixels moved, the current is wire and foil modelled in Blender through DIRECTION's rig.
   * ONE PIXEL SIZE PER THING (rule 114, mixels): everything the aura adds sits on the man's own art pixel (o.k css px).
   * EIGHT DIRECTIONS (rule 107): the echo walks along his facing, the current is rendered in all eight facings.

   THE THREE:
   A. THE ECHO (the fifth dimension, 'above time'): two copies of him a beat out of step, one ahead along his facing in the
      pose he is about to take, one behind where he was; his own pixels re-inked in the cold chrome-and-glass ramp, on every
      other row like a broadcast ghost. On every beat they snap out of him and fall back in three held steps; the bar's first
      beat throws them furthest. Drawn BEHIND him, so his body is never covered.
   B. THE TEAR (analog horror): the picture cannot hold him. SECOND PASS 10/20 (COMBAT, his 'Not final'): one jagged rip
      runs down the picture through him, over his head to under his feet; the far side, him with it, is knocked sideways and
      through the split there is the dead channel's black and snow; it opens on every beat and finds a new line each beat;
      the torn side keeps the paused tape's comb and a tear that rolls up through him once a bar. Never a ring or a box.
   C. THE CURRENT (electric): bent wire and crumpled foil arcs crawl over him and jump to the ground, a new set every key
      (three a beat), the biggest on the bar's first beat; modelled in Blender and rendered by DIRECTION's master rig in all
      eight facings (tools/bohemia_animation_the_aura_current_prep.py), the arcs behind his body hidden by a body.

   USE: BOHEMIA_AURA.draw(kind, layer, g, o) with layer 'behind' (before the man is drawn) and 'front' (after).
     o.k      css px per art pixel of the man (the fight: manH() / figure height)
     o.X, o.feet   where his feet stand, in g's css space
     o.frame  {img, sx, sy, sw, sh, dx, dy, dw, dh}: the man's own blit, exactly as the game made it
     o.future (optional) the same for the pose he is about to take (the echo's ahead copy)
     o.face   'N'..'NW' (the fight's two rows read SE and SW)
     o.t      ms on the beat clock (zero on a beat), o.beat ms a beat (500 at 120)
     o.size   'fight' (default) or 'map' (the party marker: the same aura, the throws and the band in proportion) */
(function () {
  'use strict';
  const SLOTS = 6;   /* slots a beat: a twelfth of a second at 120 */
  /* the cold ramp, darkest to lightest: glass_eye's two dark steps, chrome's three and glass_eye's glint (the palette) */
  const COLD = ['#13161a', '#3a4447', '#57595c', '#8c9094', '#b9bdc1', '#dff0eb'];
  const SNOW = ['#141313', '#ebeae4'];   /* the runway black (cloth_black's darkest) and tape grey's lightest: dead channel */
  /* his facing on the screen: the rig's camera looks north tilted 45, so north-south is foreshortened by cos 45 */
  const FACE = { N: [0, -0.707], NE: [0.707, -0.5], E: [1, 0], SE: [0.707, 0.5], S: [0, 0.707], SW: [-0.707, 0.5], W: [-1, 0], NW: [-0.707, -0.5] };
  const SIZE = { fight: { throw: 16, band: 2.3, tearSpan: 4, shiftMax: 8 }, map: { throw: 14, band: 2.0, tearSpan: 2, shiftMax: 3 } };

  function clock(o) {
    const per = (o.beat || 500) / SLOTS, n = Math.floor(Math.max(0, o.t) / per);
    return { n: n, slot: n % SLOTS, beat: Math.floor(n / SLOTS) % 4, bar: Math.floor(n / (SLOTS * 4)) };
  }
  /* a seeded number per slot and row: the same slot always tears the same way (a held pose, not noise per frame) */
  function rnd(a, b) { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

  /* ---------- A. THE ECHO ---------- */
  const ids = new WeakMap(); let nextId = 1;
  const inked = new Map();
  function idOf(img) { if (!ids.has(img)) ids.set(img, nextId++); return ids.get(img); }
  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  const COLD_RGB = COLD.map(hex);
  /* his frame re-inked: value only, laid along the cold ramp between his own darkest and lightest so a dark coat and a
     pale one both read (his first to ninety-ninth hundredth), on the even rows (par 0) or the odd (par 1); cached per frame and parity. ALONG the ramp, never
     snapped to its six steps: a snap to a short list is the style guide's own NEVER (field 5, the truck at 58 colours) and
     the NOT VIBE CODED read caught it (the top eight colours carried 25 to 50 percent, the guide's line 11.1) */
  function ink(f, par) {
    const key = idOf(f.img) + '|' + f.sx + ',' + f.sy + ',' + f.sw + ',' + f.sh + '|' + par;
    if (inked.has(key)) return inked.get(key);
    const w = Math.round(f.sw), h = Math.round(f.sh), c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(f.img, f.sx, f.sy, f.sw, f.sh, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h), p = d.data, lum = [];
    for (let i = 0; i < p.length; i += 4) if (p[i + 3] > 127) lum.push(0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]);
    lum.sort(function (a, b) { return a - b; });
    const q = function (k) { return lum.length ? lum[Math.min(lum.length - 1, Math.floor(lum.length * k))] : 128; };
    const lo = q(0.01), hi = Math.max(lo + 1, q(0.99));   /* his whole range: a clamped tenth at each end was two flat colours */
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (p[i + 3] <= 127 || (y & 1) !== par) { p[i + 3] = 0; continue; }
      const L = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
      const u = 1 + 4 * Math.max(0, Math.min(1, (L - lo) / (hi - lo)));   /* 1..5 on the ramp: never its darkest, never black */
      const a = Math.min(4, Math.floor(u)), f = u - a, A = COLD_RGB[a], B = COLD_RGB[a + 1];
      p[i] = Math.round(A[0] + (B[0] - A[0]) * f); p[i + 1] = Math.round(A[1] + (B[1] - A[1]) * f); p[i + 2] = Math.round(A[2] + (B[2] - A[2]) * f); p[i + 3] = 255;
    }
    g.putImageData(d, 0, 0); inked.set(key, c); return c;
  }
  /* the throw over a beat, six held slots: out on the beat, held, back in two steps, gone on the last */
  const ECHO_ENV = [1, 1, 0.66, 0.66, 0.33, 0];
  function echo(layer, g, o) {
    if (layer !== 'behind' || !o.frame) return;
    const c = clock(o), Z = SIZE[o.size || 'fight'], v = FACE[o.face] || FACE.S;
    const reach = Z.throw * ECHO_ENV[c.slot] * (c.beat === 0 ? 1.5 : 1);
    if (reach <= 0) return;
    const par = c.n % 2;   /* the scan lines crawl one row a slot */
    [[1, o.future || o.frame, par], [-1, o.frame, 1 - par]].forEach(function (e) {
      const f = e[1], ox = Math.round(v[0] * reach * e[0]) * o.k, oy = Math.round(v[1] * reach * e[0]) * o.k;
      g.imageSmoothingEnabled = false;
      g.drawImage(ink(f, e[2]), Math.round(o.frame.dx + ox), Math.round(o.frame.dy + oy), o.frame.dw, o.frame.dh);
    });
  }

  /* ---------- B. THE TEAR, SECOND PASS (COMBAT [the floor, not final], 10/20; his YES on B with 'Not final looks like dog
     shit', and the row: 'the tear reads as a real fifth-dimension tear around your man, not a glow'). A glow is a light; a
     tear is a cut. ONE RIP runs down the picture through him, from over his head to under his feet, slanting, jagged, never
     a curve, an oval or a ring: the picture on its far side is knocked sideways and a pixel down, the man torn with it, and
     through the split there is nothing, the dead channel's black with its snow, the world's torn lip a pixel of the glass's
     glint. The split opens on every beat, widest on the bar's one, and narrows through the beat but never shuts; the rip
     finds a new line on every beat and holds it between (stop-motion, six slots a beat). The torn side keeps the first
     pass's paused-tape comb and the band that rolls up through him once a bar, and its far edge is ragged. Only the world's
     own pixels move; the void and the lip are the palette's. (The first pass, a band of slipping rows the width of a house,
     is in git: 10/19 c40ec268.) ---------- */
  const OPEN = [6, 5, 4, 4, 3, 3];   /* the split's width in his art pixels, slot by slot through a beat */
  let off = null;
  function tear(layer, g, o) {
    if (layer !== 'front' || !o.frame) return;
    const c = clock(o), Z = SIZE[o.size || 'fight'], m = g.getTransform(), S = m.a;   /* device px per css px */
    const u = Math.max(1, Math.round(o.k * S));                                        /* one art pixel of his, on the glass */
    const fw = o.frame.dw * 0.42, top = o.frame.dy + o.frame.dh * 0.02 - 3 * o.k, bot = o.feet + 5 * o.k;   /* his figure, a little over and under */
    const half = fw * Z.band / 2;
    const bx = Math.round((o.X - half) * S + m.e), by = Math.round(top * S + m.f), bw = Math.round(2 * half * S), bh = Math.round((bot - top) * S);
    if (bw < 8 || bh < 8) return;
    if (!off) off = document.createElement('canvas');
    if (off.width < bw || off.height < bh) { off.width = Math.max(off.width, bw); off.height = Math.max(off.height, bh); }
    const og = off.getContext('2d'); og.imageSmoothingEnabled = false;
    og.clearRect(0, 0, bw, bh); og.drawImage(g.canvas, bx, by, bw, bh, 0, 0, bw, bh);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = false;
    const cols = Math.floor(bw / u), rows = Math.floor(bh / u), mid = cols / 2, body = fw * S / u;
    const bt = c.n - c.slot;                                         /* the rip's line holds a whole beat */
    const open = OPEN[c.slot] + (c.beat === 0 && c.slot < 2 ? 1 : 0);   /* widest on the bar's one */
    /* where it enters over his head and leaves under his feet: a slant through his body, a new one every beat, and which side
       is torn away turns over every beat */
    const x0 = mid + (rnd(bt + 21, 1) - 0.5) * body * 0.9, x1 = mid + (rnd(bt + 23, 2) - 0.5) * body * 0.9, away = (c.beat + c.bar) % 2 ? 1 : -1;
    const drop = c.slot < 2 ? 1 : 0, lineAt = rows - 1 - Math.floor(((c.n % (SLOTS * 4)) / (SLOTS * 4)) * (rows + 2 * Z.tearSpan)) + Z.tearSpan;
    const comb = c.slot % 2 ? 1 : -1;
    for (let r = 0; r < rows; r++) {
      const t = (r + 0.5) / rows, grp = Math.floor(r / 2);             /* the cut steps every two rows: jagged, never a curve */
      const seam = Math.round(x0 + (x1 - x0) * t + (rnd(bt + 3, grp) * 2 - 1) * 1.8);
      const gap = Math.max(1, Math.round(open * (0.5 + 0.5 * Math.sin(Math.PI * t))));
      /* the torn side: from the seam out to a ragged edge, knocked away by the split, a pixel down on the beat */
      const span = Math.round(body * (0.55 + 0.45 * rnd(bt + 11, grp)));
      let sh = gap + ((r & 1) ? comb : 0);
      if (Math.abs(r - lineAt) <= Z.tearSpan) sh += Math.round(rnd(c.n, r) * Z.shiftMax);
      const sr = Math.max(0, r - drop);
      if (away > 0) { const a0 = seam, a1 = Math.min(cols, seam + span); if (a1 - a0 > sh) g.drawImage(off, a0 * u, sr * u, (a1 - a0 - sh) * u, u, bx + (a0 + sh) * u, by + r * u, (a1 - a0 - sh) * u, u); }
      else { const a1 = seam, a0 = Math.max(0, seam - span); if (a1 - a0 > sh) g.drawImage(off, (a0 + sh) * u, sr * u, (a1 - a0 - sh) * u, u, bx + a0 * u, by + r * u, (a1 - a0 - sh) * u, u); }
      /* the split: the dead channel through it, and the world's torn lip on the side that stayed */
      const g0 = away > 0 ? seam : seam - gap;
      for (let x = g0; x < g0 + gap; x++) {
        const q = rnd(c.n * 13 + x, r);
        g.fillStyle = q > 0.86 ? SNOW[1] : q > 0.72 ? COLD[1] : SNOW[0];
        g.fillRect(bx + x * u, by + r * u, u, u);
      }
      if (rnd(bt + 9, r) > 0.35) { g.fillStyle = COLD[5]; g.fillRect(bx + (away > 0 ? g0 - 1 : g0 + gap) * u, by + r * u, u, u); }
    }
    g.restore();
  }

  /* ---------- C. THE CURRENT ---------- */
  let sheet = null;
  function current(layer, g, o) {
    const T = window.AURA_CURRENT;
    if (layer !== 'front' || !T) return;
    if (!sheet) { sheet = new Image(); sheet.src = T.src || 'ANIMATION_THE_AURA_CURRENT.webp'; }
    if (!sheet.complete || !sheet.naturalWidth) return;
    const c = clock(o), per = SLOTS / T.keys_per_beat;                        /* a key holds two slots */
    const key = Math.floor(c.n / per) % T.keys, row = T.rows[o.face] !== undefined ? T.rows[o.face] : T.rows.S;
    const cw = T.cell[0], ch = T.cell[1], org = T.origin[o.face] || T.origin.S, k = o.k * (T.scale || 1);
    g.imageSmoothingEnabled = false;
    g.drawImage(sheet, key * cw, row * ch, cw, ch, Math.round(o.X - org[0] * k), Math.round(o.feet - org[1] * k), cw * k, ch * k);
  }

  const KINDS = { echo: echo, tear: tear, current: current };
  window.BOHEMIA_AURA = {
    kinds: ['echo', 'tear', 'current'],
    names: { echo: 'A. THE ECHO', tear: 'B. THE TEAR', current: 'C. THE CURRENT' },
    slots: SLOTS, face: FACE, size: SIZE, cold: COLD,
    draw: function (kind, layer, g, o) { const f = KINDS[kind]; if (f) f(layer, g, o); }
  };
})();
