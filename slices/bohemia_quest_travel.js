/* ============================================================================
   TAP A QUEST, YOUR PEOPLE GO: THE MAP'S HALF (WORLD 8, 11/3/26; rule 376, ask line 404)

   PAOLO 11/3: 'I should be able to click the quest on my phone and my people auto move towards it... Auto zooms in as much as I
   can... when you get to quest you hop on the settlement... if multiple markers, like I have to hunt down animals, it will just
   take me to the closest one.'

   THE ONE CALL (UI 7 wires the phone's quest card to it; this file never touches the phone):

     window.BOH_TRAVEL_TO_QUEST(questId [, opts])  ->  { ok, why, id, kind, act, name, to: [x, y], town, mins, blocks, of, follow }

     questId  the quest's id: a job he holds (LOOP.held[].id) or an offer the phone shows (__PHONE_BOARD.shown[].id).
     opts     { follow: false } to leave the camera alone (default: it comes in close).
     ok false with why: 'no quest' | 'nowhere to go' (the quest is waiting on nothing he can walk to) | 'no road' | 'in a town'
              (a town's screen is up; the phone's own job) | 'a fight' (one is on).

   (a) The party sets off on the map toward the quest the Battle Brothers way: the map's own road walk (BohemiaJobKinds.walkGo, the
       road the quest's time was said on), the clock running, the road's events still stopping it.
   (b) MANY MARKERS, THE NEAREST BY THE ROAD: a hunt's packs, a patrol's posts: each is timed on the map's roads (walkRoute's
       minutes, never a straight line) and the shortest goes first; standing at one already, the next tap goes to the next closest.
       An offer he has not taken goes to the town that gives it (its board). Every other quest: where it sends him next (nextOf).
   (c) THE CAMERA COMES IN CLOSE: the map eases in (0.9 s of its own progress, a small step a frame, holding still while the map
       paints the ground round the party, so it never shows a blurred stretch; a slow painter only makes it arrive later; the trip
       ending ends it) to the quest's travel stop (a block FOLLOW_TW CSS px: the houses stand as the
       studio's models and the walk reads, about a block and a half a second; the street stop is a pinch away) and holds the party
       in the middle as it goes (the map's own camera hold). A pinch, a wheel or a touch on the map takes the camera back at once:
       the easing stops where it is and never comes back on its own. On arrival it stays.
   (d) ON ARRIVAL: a quest at a town opens that town's settlement screen (the walk's own door); a quest in the open (a pack in
       the desert) is the meeting itself when he reaches it.
   Gate: gates/tap_a_quest_your_people_go_gate.js. Hook: tools/bohemia_world_8_map_houses_patch.py (the script tag).
   ============================================================================ */
(function (root) {
  'use strict';
  var Q = { FOLLOW_TW: 240, EASE_MS: 900, STEP_MS: 50, R: 2, ended: null, on: false, p: 0, tl: 0, ts: 0, held: 0, z0: 0, z1: 0, t0: 0, raf: 0, taken: 0, last: null, done: {}, calls: 0 };

  function held() { try { return (root.LOOP && LOOP.held) || []; } catch (e) { return []; } }
  function shown() { try { return (root.__PHONE_BOARD && root.__PHONE_BOARD.shown) || []; } catch (e) { return []; } }
  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  function J() { return root.BohemiaJobKinds || null; }
  function townOf(nm) {
    var N = String(nm || '').toUpperCase(); if (!N) return null; var bs = null; try { bs = ctBases(); } catch (e) {}
    if (bs) for (var k in bs) if (bs[k] && String(k).toUpperCase() === N) return { name: k, x: bs[k].x | 0, y: bs[k].y | 0 };
    try { var p = J().realPlace(nm); if (p) return { name: p.name, x: p.x | 0, y: p.y | 0, region: !!p.region }; } catch (e) {}
    return null;
  }
  /* where a quest can send him now: one place, or several (a hunt's packs, a patrol's posts) */
  function places(job) {
    var out = [];
    if (job.plays === 'hunt-kind' && job.stage === 'hunt') (job.packs || []).forEach(function (p, i) { out.push({ x: p.x | 0, y: p.y | 0, name: String(job.what || 'THEM').toUpperCase(), act: 'HUNT', key: 'pack' + i }); });
    else if (job.plays === 'patrol' && job.stage === 'patrol') (job.posts || []).forEach(function (p, i) { if (!p.done) out.push({ x: p.x | 0, y: p.y | 0, name: p.name ? String(p.name).toUpperCase() : 'POST ' + (i + 1), act: 'PATROL', town: !!p.name, key: 'post' + i }); });
    if (!out.length) { var n = null; try { n = J().nextOf(job); } catch (e) {} if (n && n.x != null) out.push({ x: n.x | 0, y: n.y | 0, name: n.name, act: n.act, town: !!n.town, key: 'next' }); }
    return out;
  }
  /* its time on the roads from where he stands (null: no road) */
  function timed(c) {
    var T = c.town ? townOf(c.name) : null, r = null;
    try { r = J().walkRoute(city.x, city.y, T ? { town: T } : { x: c.x, y: c.y }); } catch (e) { r = null; }
    return r ? { mins: r.mins || 0, blocks: Math.max(0, (r.path || []).length - 1), T: T } : null;
  }
  /* (c) the camera comes in close, eased; any touch of his on the map gives it back */
  var BOUND = false;
  function bindHands() {
    if (BOUND) return; var el = null; try { el = cv; } catch (e) { return; } if (!el || !el.addEventListener) return; BOUND = true;
    var give = function () { if (Q.on) { Q.on = false; Q.given = (Q.given | 0) + 1; if (Q.raf) { cancelAnimationFrame(Q.raf); Q.raf = 0; } } };
    ['pointerdown', 'touchstart', 'wheel'].forEach(function (ev) { el.addEventListener(ev, give, { capture: true, passive: true }); });
  }
  /* the tiles round the party painted at the detail this zoom asks (no tiles at this zoom: nothing to wait for) */
  function ready() {
    try {
      if (typeof VB_ONE_MAP === 'undefined' || !VB_ONE_MAP || TW < VB_TILE_FROM || !VBC.key || VBT.err) return true;
      var S = vbTileS(), R = Q.R, seen = {};
      for (var dy = -R; dy <= R; dy++) for (var dx = -R; dx <= R; dx++) {
        var x = Math.max(0, Math.min(om.n - 1, city.x + dx)), y = Math.max(0, Math.min(om.n - 1, city.y + dy)), tx = Math.floor(x / VB_TILE), ty = Math.floor(y / VB_TILE), k = tx + ',' + ty;
        if (seen[k]) continue; seen[k] = 1; if (!VBT.tiles.has(vbTileKey(tx, ty, S))) return false; }
      return true;
    } catch (e) { return true; }
  }
  function ease() {
    Q.raf = 0; if (!Q.on) return;
    /* the zoom waits for the map (rule 346): it moves by its own progress, never more than STEP_MS of the ease in one frame (a
       slow frame cannot jump it to a zoom nothing is painted for), and it holds still while the tiles it now needs are being
       painted round the party (ready: the tiles within R blocks of him, at the detail this zoom asks; the painter works from the
       middle out, so the rest fills in the way it does on a pinch), so where he looks shows at most a step's worth of the coarser
       picture. The party walks
       on the whole time, held in the middle at a zoom that is already sharp: a slow painter only makes the zoom arrive later, never
       blur (no time limit: a painter that broke, VBT.err, waits for nothing). The trip ending ends it where it is */
    var now = performance.now(), dt = now - (Q.tl || now); Q.tl = now;
    var stop = false;   /* the trip is over (arrived, a road's event, a fight, a town's screen): the zoom stays where it is */
    try { stop = (typeof MODE !== 'undefined' && MODE !== 'city') || !TRAVEL || (typeof CITYFIGHT !== 'undefined' && CITYFIGHT) || (root.LOOP && (LOOP.fighting || (LOOP.frame && LOOP.frame.style.display === 'block'))); } catch (e) {}
    if (stop) { Q.on = false; Q.ended = 'the trip'; return; }
    var wait = !ready();
    if (wait) Q.held += dt; else Q.p += Math.min(dt, Q.STEP_MS);
    var t = Math.min(1, Q.p / Q.EASE_MS), s = t * t * (3 - 2 * t), z = Q.z0 * Math.pow(Q.z1 / Q.z0, s);
    try { setZoomAt(z); camHold(); render(); } catch (e) {}
    if (t < 1) Q.raf = requestAnimationFrame(ease); else { Q.on = false; Q.ended = 'there'; }   /* there it stays: nothing pulls it back */
  }
  function follow() {
    bindHands();
    var z1 = Q.FOLLOW_TW / TW0; try { var zb = zoomBounds(); z1 = Math.max(zb[0], z1); } catch (e) {}
    if (Math.abs(CZOOM - z1) < 1e-3) { try { camHold(); } catch (e) {} return; }
    Q.on = true; Q.z0 = CZOOM; Q.z1 = z1; Q.t0 = Q.ts = Q.tl = performance.now(); Q.held = 0; Q.p = 0; Q.ended = null; if (Q.raf) cancelAnimationFrame(Q.raf); Q.raf = requestAnimationFrame(ease);
  }

  function travelToQuest(id, opts) {
    opts = opts || {}; Q.calls++;
    var out = { ok: false, why: null, id: id };
    try { if (typeof MODE !== 'undefined' && MODE !== 'city') { out.why = 'not on the map'; return (Q.last = out); } } catch (e) {}
    try { if ((typeof CITYFIGHT !== 'undefined' && CITYFIGHT) || (root.LOOP && LOOP.fighting)) { out.why = 'a fight'; return (Q.last = out); } } catch (e) {}
    try { if (LOOP.frame && LOOP.frame.style.display === 'block') { out.why = 'in a town'; return (Q.last = out); } } catch (e) {}
    var job = held().filter(function (j) { return j && String(j.id) === String(id); })[0] || null, list = [];
    if (job) { list = places(job); out.kind = job.plays; }
    else { var o = shown().filter(function (a) { return a && String(a.id) === String(id); })[0];   /* an offer he has not taken: its board */
      if (!o) { out.why = 'no quest'; return (Q.last = out); }
      var T0 = townOf(o.place); if (T0) list = [{ x: T0.x, y: T0.y, name: String(T0.name).toUpperCase(), act: 'TAKE IT', town: true, key: 'board' }]; out.kind = 'offer'; }
    if (!list.length) { out.why = 'nowhere to go'; return (Q.last = out); }
    /* (b) the nearest by the roads; standing at one already, the next */
    var seen = Q.done[id] || (Q.done[id] = {});
    list.forEach(function (c) { if (!c.town && cheb(c.x, c.y, city.x, city.y) <= 1) seen[c.key] = 1; });
    var best = null;
    list.forEach(function (c) { if (seen[c.key] && list.length > 1) return; var t = timed(c); if (!t) return;
      if (!best || t.mins < best.t.mins || (t.mins === best.t.mins && t.blocks < best.t.blocks)) best = { c: c, t: t }; });
    if (!best) { out.why = 'no road'; return (Q.last = out); }
    var c = best.c, ok = false;
    try { ok = !!J().walkGo([c.x, c.y], c.town ? (best.t.T ? best.t.T.name : c.name) : null); } catch (e) { ok = false; }
    var trav = false; try { trav = typeof TRAVEL !== 'undefined' && !!TRAVEL && !!TRAVEL.path; } catch (e) {}
    out.ok = ok || trav; out.act = c.act; out.name = c.name; out.to = [c.x, c.y]; out.town = !!c.town; out.mins = Math.round(best.t.mins); out.blocks = best.t.blocks; out.of = list.length;
    out.timed = list.map(function (q) { var t = timed(q); return { key: q.key, to: [q.x, q.y], mins: t ? Math.round(t.mins) : null }; });
    if (!out.ok) { out.why = 'no road'; return (Q.last = out); }
    if (opts.follow !== false) { follow(); out.follow = Q.FOLLOW_TW; }
    Q.taken++; return (Q.last = out);
  }
  root.BOH_TRAVEL_TO_QUEST = travelToQuest;
  root.BohemiaQuestTravel = { go: travelToQuest, state: function () { return Q; }, places: places, ready: ready };
})(typeof window !== 'undefined' ? window : this);
