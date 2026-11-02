/* ==========================================================================
   A NEW VALLEY EVERY GAME (WORLD 6, 11/2/26, rule 318, ask line 315).

   PAOLO 11/2: "I am not getting really generated vibes right now playing on the map. The Remnants are on the same part
   of the map... I don't even know if you have a number seed system in place... I'm not getting big procedurally
   generated map vibes at all."

   MEASURED BEFORE: the fourteen home bases were baked at fixed blocks (CT_BASES_BAKED in slices/BOHEMIA_CITY_WORLD.html,
   read by ctBases()), so every new game put every faction in the same place; only the start corner moved, off the clock;
   there was no campaign seed at all (a WORLD_SEED name was read in one place and never set).

   THE CALL (the coordinator's, realism first; Battle Brothers is the school): THE LAND STAYS REAL (the valley generator's
   own fixed land seed 'bohemia': the streets, the freeways, the mountains, the real places, the passes). WHO STANDS ON IT
   comes from ONE CAMPAIGN SEED, a short code shown on the new-game screen, saved with the game, typed in to share a world.
   Each faction's home base stands at one of the real places that fit it (records/target/bb/world_seed.json: the Caravans
   at the truck stop and the yards, the Church at the chapels, the Remnants at the air base and the prisons), picked by the
   seed, weighted by how much town is around it, never two bases in one neighbourhood.

   ONE MODULE, BOTH SURFACES: node requires the data file; the page inlines the same JSON as BOHEMIA_WORLD_SEED_DATA and
   this file as-is (the gate refuses a drift). Pure: no clock, no Math.random, no storage. The page's boot decides the
   code (resolve) and hands this the map's districts (engine/bohemia_towns.js districtsOf: the real town blocks that front
   a road, the same list the old placer read, so every candidate is a block a town can stand on).
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = typeof module !== 'undefined' && module.exports && typeof require === 'function';

  function data() {
    if (root && root.BOHEMIA_WORLD_SEED_DATA) return root.BOHEMIA_WORLD_SEED_DATA;
    if (HASREQ) { try { return require('../records/target/bb/world_seed.json'); } catch (_e) {} }
    return null;
  }

  /* FNV-1a, 32 bits: the same number on every phone for the same text */
  function hash(text) {
    var h = 2166136261, s = String(text == null ? '' : text);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  /* mulberry32: small, fast, the same stream everywhere */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function codeRules(D) {
    var c = (D && D.code) || {};
    return { alphabet: c.alphabet || 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', length: c.length || 6,
             min: c.min_typed || 3, max: c.max_typed || 12 };
  }
  /* what he typed, made a code: capitals; the dash, spaces and anything outside the alphabet dropped (a code never
     holds 0, O, 1, I or L, so dropping them loses nothing a code had). '' when too short or too long to be a code. */
  function norm(text, D) {
    var C = codeRules(D || data()), s = String(text == null ? '' : text).toUpperCase(), out = '';
    for (var i = 0; i < s.length; i++) { var ch = s.charAt(i); if (C.alphabet.indexOf(ch) >= 0) out += ch; }
    return (out.length >= C.min && out.length <= C.max) ? out : '';
  }
  function show(code) {
    var s = String(code || ''); if (!s) return '';
    var parts = []; for (var i = 0; i < s.length; i += 3) parts.push(s.slice(i, i + 3));
    return parts.join('-');
  }
  /* a fresh code from whatever entropy the caller has (the page passes the clock and its own random) */
  function roll(entropy, D) {
    var C = codeRules(D || data()), R = rng(hash('roll:' + entropy)), out = '';
    for (var i = 0; i < C.length; i++) out += C.alphabet.charAt(Math.floor(R() * C.alphabet.length) % C.alphabet.length);
    return out;
  }

  /* THE BOOT'S ONE DECISION, pure so the gate can walk every branch:
     the bench (the dark lifted) and a game saved before the seed keep the old valley (''); a saved game keeps its own
     code; a new game takes the code he typed, else a fresh roll. */
  function resolve(o) {
    o = o || {};
    if (o.bench) return { code: '', from: 'bench' };
    if (o.liveSave) {
      if (o.stored && typeof o.stored.code === 'string') return { code: o.stored.code, from: o.stored.code ? 'saved' : 'old_valley' };
      return { code: '', from: 'old_save' };
    }
    var typed = o.staged ? norm(o.staged, o.data) : '';
    if (typed) return { code: typed, from: 'typed' };
    return { code: roll(o.entropy == null ? 0 : o.entropy, o.data), from: 'rolled' };
  }

  /* every real place each faction could stand on: the town blocks of its kinds, with the kind's weight */
  function sites(districts, D) {
    D = D || data(); var F = (D && D.factions) || {}, out = {}, byKind = {}, i;
    for (i = 0; i < (districts || []).length; i++) {
      var d = districts[i]; if (!d) continue;
      var x = d.x != null ? d.x : (d.pos && d.pos[0]), y = d.y != null ? d.y : (d.pos && d.pos[1]);
      if (x == null || y == null) continue;
      (byKind[d.kind] = byKind[d.kind] || []).push({ x: x | 0, y: y | 0, kind: d.kind });
    }
    for (var f in F) {
      if (!Object.prototype.hasOwnProperty.call(F, f)) continue;
      var ks = F[f].kinds || {}, list = [];
      for (var k in ks) { var w = +ks[k] || 0; if (w <= 0 || !byKind[k]) continue;
        for (i = 0; i < byKind[k].length; i++) list.push({ x: byKind[k][i].x, y: byKind[k][i].y, kind: k, w: w }); }
      out[f] = list;
    }
    return out;
  }

  /* THE PLACER. districts: the map's real town blocks; code: the campaign seed; opts.classic: the old valley's bases,
     the last fallback for a faction with nowhere left to stand. Returns { code, bases: { Faction: { x, y, kind, why,
     sites } }, order, relaxed }. The same districts and the same code give the same bases, always. */
  function place(districts, code, opts) {
    opts = opts || {};
    var D = opts.data || data(); if (!D || !D.factions) return null;
    var S = D.spread || {}, minA = S.min_apart || 9, floorA = S.floor_apart || 6, inset = S.edge_inset == null ? 5 : S.edge_inset,
        rad = S.density_radius || 8, pw = S.density_power == null ? 1 : S.density_power;
    var all = sites(districts, D), size = 0, i, f;
    for (i = 0; i < (districts || []).length; i++) { var dd = districts[i]; if (!dd) continue;
      var dx0 = dd.x != null ? dd.x : (dd.pos && dd.pos[0]), dy0 = dd.y != null ? dd.y : (dd.pos && dd.pos[1]);
      if (dx0 + 1 > size) size = dx0 + 1; if (dy0 + 1 > size) size = dy0 + 1; }
    size = opts.n || size || 96;
    /* how much town is around a block: a summed-area table over the districts, a square of `rad` each way */
    var W = size + 1, sat = new Int32Array(W * W);
    var cnt = new Int32Array(size * size);
    for (i = 0; i < (districts || []).length; i++) { var q = districts[i]; if (!q) continue;
      var qx = q.x != null ? q.x : (q.pos && q.pos[0]), qy = q.y != null ? q.y : (q.pos && q.pos[1]);
      if (qx >= 0 && qy >= 0 && qx < size && qy < size) cnt[qy * size + qx]++; }
    for (var yy = 0; yy < size; yy++) for (var xx = 0; xx < size; xx++)
      sat[(yy + 1) * W + xx + 1] = cnt[yy * size + xx] + sat[yy * W + xx + 1] + sat[(yy + 1) * W + xx] - sat[yy * W + xx];
    var dens = function (x, y) {
      var x0 = Math.max(0, x - rad), y0 = Math.max(0, y - rad), x1 = Math.min(size, x + rad + 1), y1 = Math.min(size, y + rad + 1);
      return sat[y1 * W + x1] - sat[y0 * W + x1] - sat[y1 * W + x0] + sat[y0 * W + x0];
    };
    var maxD = 1; for (f in all) for (i = 0; i < all[f].length; i++) maxD = Math.max(maxD, dens(all[f][i].x, all[f][i].y));

    /* ONE PLACE IS ONE PLACE, HOWEVER MANY BLOCKS IT COVERS. Measured on the first cut: the prison is three blocks
       (86,48 86,49 87,49), so the Remnants' prison drew three tickets to the air base's one and stood in the east in 8 seeds of
       10, which is his own complaint again. Blocks of one kind that touch are one place (8 neighbours); a seed picks the place
       first, then a block of it. */
    var comp = {}, nComp = 0;
    var byKindBlocks = {}; for (f in all) for (i = 0; i < all[f].length; i++) { var bb = all[f][i]; (byKindBlocks[bb.kind] = byKindBlocks[bb.kind] || {})[bb.x + ',' + bb.y] = bb; }
    for (var kk in byKindBlocks) { var setK = byKindBlocks[kk];
      for (var key in setK) { if (comp[kk + '@' + key] != null) continue;
        var id = nComp++, st = [setK[key]]; comp[kk + '@' + key] = id;
        while (st.length) { var cur = st.pop();
          for (var ox = -1; ox <= 1; ox++) for (var oy = -1; oy <= 1; oy++) { var nk = (cur.x + ox) + ',' + (cur.y + oy);
            if (setK[nk] && comp[kk + '@' + nk] == null) { comp[kk + '@' + nk] = id; st.push(setK[nk]); } } } } }
    var placeOf = function (s) { return comp[s.kind + '@' + s.x + ',' + s.y]; };
    var placesOf = {}; for (f in all) { var seenP = {}; for (i = 0; i < all[f].length; i++) seenP[placeOf(all[f][i])] = 1; placesOf[f] = Object.keys(seenP).length; }

    var names = Object.keys(all).sort();
    if ((S.order || 'fewest_sites_first') === 'fewest_sites_first')
      names.sort(function (a, b) { return (placesOf[a] - placesOf[b]) || (all[a].length - all[b].length) || (a < b ? -1 : 1); });

    var placed = [], taken = {}, bases = {}, relaxed = [];
    var cheb = function (a, b) { return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); };
    var inland = function (s) { return s.x >= inset && s.y >= inset && s.x <= size - 1 - inset && s.y <= size - 1 - inset; };
    var apart = function (s, m) { for (var j = 0; j < placed.length; j++) if (cheb(s, placed[j]) < m) return false; return true; };
    var tiers = [
      { why: 'fits', ok: function (s) { return apart(s, minA) && inland(s); } },
      { why: 'fits, a little crowded', ok: function (s) { return apart(s, floorA) && inland(s); } },
      { why: 'fits, at the edge', ok: function (s) { return apart(s, floorA); } },
      { why: 'fits, crowded', ok: function (s) { return apart(s, 2); } }
    ];
    var c = String(code || '');
    for (var ni = 0; ni < names.length; ni++) {
      f = names[ni];
      var R = rng(hash(c + ':base:' + f)), list = all[f], pick = null, why = null;
      for (var t = 0; t < tiers.length && !pick; t++) {
        /* the places with a block that passes, each weighed once: its kind's weight times its busiest passing block's town */
        var byP = {}, order = [];
        for (i = 0; i < list.length; i++) { var s = list[i];
          if (taken[s.x + ',' + s.y] || !tiers[t].ok(s)) continue;
          var pid = placeOf(s), dv = Math.pow(dens(s.x, s.y) / maxD, pw) + 1e-6;
          if (!byP[pid]) { byP[pid] = { w: 0, blocks: [] }; order.push(pid); }
          byP[pid].w = Math.max(byP[pid].w, s.w * dv); byP[pid].blocks.push([s, dv]); }
        if (!order.length) continue;
        var sum = 0; for (i = 0; i < order.length; i++) sum += byP[order[i]].w;
        var r = R() * sum, P0 = null;
        for (i = 0; i < order.length; i++) { r -= byP[order[i]].w; if (r <= 0) { P0 = byP[order[i]]; break; } }
        if (!P0) P0 = byP[order[order.length - 1]];
        var bs2 = 0; for (i = 0; i < P0.blocks.length; i++) bs2 += P0.blocks[i][1];
        var r2 = R() * bs2;
        for (i = 0; i < P0.blocks.length; i++) { r2 -= P0.blocks[i][1]; if (r2 <= 0) { pick = P0.blocks[i][0]; break; } }
        if (!pick) pick = P0.blocks[P0.blocks.length - 1][0];
        why = tiers[t].why; if (t) relaxed.push(f);
      }
      if (!pick && opts.classic && opts.classic[f]) { pick = { x: opts.classic[f].x | 0, y: opts.classic[f].y | 0, kind: null }; why = 'the old valley\'s place: nowhere of its kind was free'; relaxed.push(f); }
      if (!pick) continue;
      taken[pick.x + ',' + pick.y] = 1; placed.push(pick);
      bases[f] = { x: pick.x, y: pick.y, kind: pick.kind, why: why, sites: list.length, places: placesOf[f] || 0,
                   place: pick.kind ? pick.kind + '#' + placeOf(pick) : null };
    }
    /* keys in the old order (alphabetical), so a caller that reads 'the first base' reads the same faction it always did */
    var out = {}; Object.keys(bases).sort().forEach(function (k) { out[k] = bases[k]; });
    return { code: c, bases: out, order: names, relaxed: relaxed, n: size };
  }

  var API = { data: data, hash: hash, rng: rng, norm: norm, show: show, roll: roll, resolve: resolve, sites: sites, place: place };
  if (HASREQ) module.exports = API;
  if (root) root.BohemiaWorldSeed = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
