/* BOHEMIA IDLES -- ANIMATION [everybody idles] (rule 130(a), Paolo 10/23, LOCKED: 'we need a lot of idle animations; right
   now everyone's standing still, making my brain fry; it's looking like a chess man and I don't want that vibe at all').
   NOBODY STANDS LIKE A CHESS PIECE: one player for every screen with a person on it.

   THE PICTURES: slices/rig_idles/<look>_<set>.webp, every distinct idle pose of that man in eight facings (a sheet per set:
   bare, carry, beast), rendered on the rig the
   way the fight renders him (tools/bohemia_animation_everybody_idles.py, the source records/target/animation/
   BOHEMIA_EVERYBODY_IDLES.json); slices/rig_idles/<look>_guns.webp, the three guns in his hands on the gun-held poses.
   Each cell is cut to what is drawn; [x, y, w, h, dx, dy] puts it back where it stood in the fight sheet's cell, so his feet
   are where they were (foot = the fight sheet's foot). A rolled person of the valley (RUN TWO's 152) has no fight cell: his
   cells sit in his render's full frame, and feet[f] is where his still stands in that frame, facing by facing.

   THE PLAY: time is cut into SLOTS of two bars (24 keys, three a beat at 120). A slot is one slow breath with the weight on
   one leg (the next breath on the other; slow, short or a sigh, his roll), or one of his idles; every slot starts and ends standing square, so any follows
   any. Each person has his own offset (no two in step), his own handful of idles (one a habit he does more), his own
   fidget (how often), all from his seed; nothing is stored, the same seed at the same time is the same pose.

     BohemiaIdles.load(cb)                    the index, once (cb(true|false))
     BohemiaIdles.ready()                     the index is in
     BohemiaIdles.has(look)                   this look has idle pictures
     BohemiaIdles.at(seed, now, o)            {slot, kind, pose}: o.set 'bare'|'carry'|'beast' (default bare), o.idles (a filter),
                                              o.since (when he began to stand: that slot stays a breath, so a man who
                                              stops walking does not land in the middle of a stretch), o.beatMs (500)
     BohemiaIdles.cell(look, set, pose, f)    {img, x, y, w, h, dx, dy, foot} for facing f (0..7, S SE E NE N NW W SW), once
                                              the sheet is in (null and it starts loading)
     BohemiaIdles.gun(look, gun, pose, f)     the same for his gun ('pistol'|'rifle'|'shotgun') on a gun-held pose; {hidden: true}
                                              where his body hides all of it
     BohemiaIdles.frame(look, seed, now, f, o)   at() and cell() in one: the cell to draw now, or null
     BohemiaIdles.image(file)                 one of the sheets once it is in (null and it starts loading)
     BohemiaIdles.map()                       the map's own models, their cells and poses, once in (null and it starts loading)
     BohemiaIdles.mapPeople()                 the same for the map's rolled people (RUN TWO's sheets in slices/rig_mix): a look's
                                              mix (the map sheet he stands on), file and poses; files[file] its cells
     BohemiaIdles.meta()                      the index: the timelines, the sets, the idles, which looks have pictures
     BohemiaIdles.DIRS                        S SE E NE N NW W SW */
(function (root) {
  'use strict';
  var DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
  var BASE = root.BOHEMIA_IDLES_BASE || 'rig_idles/';
  var META = null, state = 0, waiters = [], IM = {};
  var SLOT = 24;
  function load(cb) {
    if (state === 2 || state === 3) { if (cb) cb(state === 2); return; }
    if (cb) waiters.push(cb);
    if (state === 1) return;
    state = 1;
    function done(ok) { state = ok ? 2 : 3; var w = waiters; waiters = []; w.forEach(function (f) { try { f(ok); } catch (e) {} }); }
    try {
      fetch(BASE + 'rig_idles.json').then(function (r) { return r.ok ? r.json() : null; })
        .then(function (m) { META = m; done(!!(m && m.looks)); }, function () { done(false); });
    } catch (e) { done(false); }
  }
  function ready() { if (!state) load(); return state === 2; }
  /* a look's cells are their own small file, fetched the first time a screen asks for him (the whole cast is 600 KB of
     numbers; a fight needs a dozen men's) */
  var DATA = {};
  function data(name) {
    var e = DATA[name];
    if (!e) {
      e = DATA[name] = { d: null };
      try { fetch(BASE + name).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) { e.d = d; }, function () {}); } catch (x) {}
    }
    return e.d;
  }
  function look_(look) { var L = ready() && META.looks[look]; return L ? data(L.json) : null; }
  function has(look) { return !!look_(look); }
  function map() { return ready() && META.map ? data(META.map.json) : null; }
  function mapPeople() { return ready() && META.map_people ? data(META.map_people.json) : null; }
  /* a small integer hash: the same person, the same numbers, on every screen */
  function hash(a, b) {
    var h = 2166136261 >>> 0, s = String(a) + '|' + (b === undefined ? '' : b);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995) >>> 0; h ^= h >>> 15;
    return h >>> 0;
  }
  function unit(a, b) { return hash(a, b) / 4294967296; }
  /* who he is when he stands: his offset, his idles (a habit first), how often he fidgets */
  var PEOPLE = {};
  function person(seed, set, filter) {
    var key = seed + '|' + set + '|' + (filter ? filter.join(',') : '');
    var p = PEOPLE[key]; if (p) return p;
    var all = (META && META.idles && META.idles[set]) || [];
    if (filter) all = all.filter(function (k) { return filter.indexOf(k) >= 0; });
    var mine = all.slice().sort(function (a, b) { return hash(seed, a) - hash(seed, b); }).slice(0, Math.min(4, all.length));
    if (mine.length) mine.push(mine[0]);   /* his habit, twice as likely */
    p = PEOPLE[key] = { off: hash(seed, 'off') % (SLOT * 2), fidget: 0.45 + 0.4 * unit(seed, 'fidget'), idles: mine };
    return p;
  }
  function timeline(kind) { return META && META.timelines && META.timelines[kind]; }
  function poseIn(tl, k) {
    for (var i = 0; i < tl.length; i++) { if (k < tl[i][1]) return tl[i][0]; k -= tl[i][1]; }
    return 'C';
  }
  function at(seed, now, o) {
    o = o || {};
    var set = o.set || 'bare', bm = o.beatMs || 500, keyMs = bm / 3;
    if (!ready()) return null;
    var p = person(seed, set, o.idles);
    var k = Math.floor(now / keyMs) + p.off, slot = Math.floor(k / SLOT), kin = k - slot * SLOT;
    var odd = ((slot % 2) + 2) % 2;
    var br = (META.breathe && META.breathe[set]) || [['breatheR'], ['breatheL']], side = br[odd];   /* a man's weight on one leg, then the other */
    var kind = side[hash(seed, 'b' + slot) % side.length];   /* which breath, his roll for this slot */
    /* an idle only on his odd slots (never two in a row), never the slot he began to stand in */
    var still = o.since !== undefined && Math.floor((Math.floor(o.since / keyMs) + p.off) / SLOT) === slot;
    if (odd && !still && p.idles.length && unit(seed, slot) < p.fidget) kind = p.idles[hash(seed, 'i' + slot) % p.idles.length];
    var tl = timeline(kind); if (!tl) return null;
    return { slot: slot, kind: kind, pose: poseIn(tl, kin) };
  }
  function sheet(file) {
    var u = BASE + file, e = IM[u];
    if (!e) {
      e = IM[u] = { im: new Image(), ok: false };
      e.im.onload = function () { e.ok = true; };
      e.im.src = u;
    }
    return e.ok ? e.im : null;
  }
  function cell(look, set, pose, f) {
    if (!has(look)) return null;
    var L = look_(look), ps = L.poses[set || 'bare'], col = ps && ps[pose], Sh = L.sheets[set || 'bare'];
    if (!col || !Sh) return null;
    var i = col[((f | 0) % 8 + 8) % 8]; if (i === null || i === undefined) return null;
    var img = sheet(Sh.file); if (!img) return null;   /* a set a sheet: only what this screen plays is loaded */
    var c = Sh.cells[i];
    return { img: img, x: c[0], y: c[1], w: c[2], h: c[3], dx: c[4], dy: c[5], foot: (L.feet && L.feet[((f | 0) % 8 + 8) % 8]) || L.foot, person: !!L.person };
  }
  function gun(look, g, pose, f) {
    if (!has(look)) return null;
    var G = look_(look).guns; if (!G || !G.poses[g] || !G.poses[g][pose]) return null;
    var i = G.poses[g][pose][((f | 0) % 8 + 8) % 8];
    if (i === null) return { hidden: true };   /* his body hides the whole gun in this facing: nothing to lay over him */
    if (i === undefined) return null;
    var img = sheet(G.file); if (!img) return null;
    var c = G.cells[i];
    return { img: img, x: c[0], y: c[1], w: c[2], h: c[3], dx: c[4], dy: c[5] };
  }
  function frame(look, seed, now, f, o) {
    if (!has(look)) return null;
    var a = at(seed, now, o); if (!a) return null;
    var c = cell(look, (o && o.set) || 'bare', a.pose, f); if (!c) return null;
    c.kind = a.kind; c.pose = a.pose; return c;
  }
  root.BohemiaIdles = { load: load, ready: ready, has: has, at: at, cell: cell, gun: gun, frame: frame, hash: hash, DIRS: DIRS,
    image: sheet, map: map, mapPeople: mapPeople,
    meta: function () { return META; },
    /* __THE_TOWN_LETS_GO__ (RUN 10/24, rule 141(e)): a screen that is put away lets go of every sheet it drew from (the town's
       idles were 188 MB decoded across three places and none was ever let go); the next frame() fetches what it needs again */
    release: function () { IM = {}; } };
  if (typeof module !== 'undefined') module.exports = root.BohemiaIdles;
})(typeof window !== 'undefined' ? window : this);
