/* BOHEMIA -- THE CRAWL'S PLAYER (ANIMATION [the crawl], rule 390, Paolo 11/4: 'make an animation of people crawling on the
   floor... a fucked up scary sad murders type of crawl'). One golden piece (rule 408(b)): a man struck down who lives rolls
   off his back and drags himself away along the ground, three weights (the drag: legs dead, one arm pulling, the other
   reaching; the elbows: low, slow, the head down; the last: a few inches, a stop, a hand that opens), eight facings, three
   keys a beat at 120, every key held (Crashbox stop-motion, rule 115(d)).

   The pictures: slices/rig_crawl (tools/bohemia_animation_the_crawl.py: COMBAT's posed man, the town's pose step, DIRECTION's
   master rig, the same camera, sun and colours as his fight sheet). Each key carries HOW FAR HE HAS COME (model units along
   the way he crawls); this player turns it into rig pixels on the master rig's 45 degree camera, so a hand put down stays on
   its pixel while his body comes up to it (the low crawl, WALK-04: the body pulled to the hand, never a hand that skates).

   BohemiaCrawl.at(look, k, face) -> the cell to draw at key k of his arc (k from the first key of the roll; past the end, the
   last key held: he lies there with the hand open), or null until his pictures are in:
     { img, x, y, w, h, dx, dy, sx, sy, pose, clip, slide, smear }
     dx, dy: the cell's top left from his fight cell's origin (rig px); sx, sy: the slide to add (rig px);
     smear: [x0, y0] the rig-px offset where the drag mark starts (the roll's end), or null before he has pulled.
   face is the CRAWL's facing, the fight's 8-way index (S SE E NE N NW W SW): the fall's + 4 (his head lies where his back
   was, so he crawls away from the man he faced; WALK-05: away from the fire, toward cover and his own).
   BohemiaCrawl.want(look) asks for a look's pictures (nothing is fetched until a man of that look is down).
   Pure where it can be: under node, require() it and hand it the index and a look's json with BohemiaCrawl.feed(...). */
(function (root) {
  'use strict';
  const DIR = (function () {
    try { const s = document.currentScript && document.currentScript.src; if (s) return s.replace(/engine\/bohemia_crawl\.js.*$/, 'slices/rig_crawl/'); } catch (e) {}
    return '../slices/rig_crawl/';
  })();
  const K = { index: null, looks: {}, imgs: {}, flat: null, asked: {}, failed: {} };

  /* the arc, one entry a key: [pose, units come so far, clip]; the program's clips laid end to end */
  function flatten(I) {
    const out = []; let run = 0, rollEnd = 0;
    I.program.forEach(function (name) {
      const tl = I.timelines[name];
      tl.forEach(function (e) { for (let i = 0; i < e[1]; i++) out.push([e[0], run + e[2], name]); });
      run += I.advance[name] || 0;
      if (name === 'roll') rollEnd = out.length;
    });
    out.rollEnd = rollEnd;
    return out;
  }
  function feed(index, look, entry, img) {
    if (index) { K.index = index; K.flat = flatten(index); }
    if (look && entry) K.looks[look] = entry;
    if (look && img) K.imgs[look] = img;
  }
  function fetchJson(u) { return fetch(u, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); }); }
  function want(look) {
    if (K.asked[look] || typeof fetch !== 'function') return;
    K.asked[look] = true;
    const idx = K.index ? Promise.resolve(K.index) : fetchJson(DIR + 'rig_crawl.json').then(function (I) { feed(I); return I; });
    idx.then(function (I) {
      if (!I.looks[look]) { K.failed[look] = 'no crawl for this look'; return; }
      return fetchJson(DIR + I.looks[look].json).then(function (e) {
        const im = new Image(); im.decoding = 'async';
        im.onload = function () { feed(null, look, e, im); };
        im.onerror = function () { K.failed[look] = 'sheet'; };
        im.src = DIR + e.file;
      });
    }).catch(function (e) { K.failed[look] = String(e); });
  }
  function has(look) { return !!(K.flat && K.looks[look] && K.imgs[look]); }
  function length() { return K.flat ? K.flat.length : 0; }
  /* rig px along the crawl's facing on the master rig's camera: a quarter turn is 45 degrees, the ground's depth foreshortened
     by sin 45 (the towns gate's screen(), the same camera) */
  function onScreen(u, ppu, face) {
    const th = face * Math.PI / 4;
    return [u * ppu * Math.sin(th), u * ppu * Math.cos(th) * Math.SQRT1_2];
  }
  function at(look, k, face) {
    if (!has(look)) return null;
    const E = K.looks[look], F = K.flat, i = Math.max(0, Math.min(F.length - 1, k | 0)), e = F[i];
    const row = E.poses[e[0]]; if (!row) return null;
    const ci = row[face & 7]; if (ci === null || ci === undefined) return null;
    const c = E.cells[ci], u = E.base + e[1], s = onScreen(u, E.ppu, face & 7);
    const pulled = i >= F.rollEnd;
    return { img: K.imgs[look], x: c[0], y: c[1], w: c[2], h: c[3], dx: c[4], dy: c[5], sx: s[0], sy: s[1], pose: e[0], clip: e[2],
             slide: u, key: i, done: k >= F.length - 1, smear: pulled ? onScreen(E.base, E.ppu, face & 7) : null };
  }
  const api = { at: at, want: want, has: has, feed: feed, length: length, onScreen: onScreen, flatten: flatten, _K: K };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BohemiaCrawl = api;
})(typeof window !== 'undefined' ? window : globalThis);
