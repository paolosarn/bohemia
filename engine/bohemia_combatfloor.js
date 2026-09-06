// BOHEMIA COMBAT FLOOR — the zoomed-out city, handed to COMBAT as a floor.
// (9/5/26, LIFE + CITY lane. VAMILY job [combat floor] /
//  THE-AERIAL-VIEW-IS-THE-COMBAT-FLOOR: "with COMBAT: the zoomed-out city render is
//  what the fight stands on (9/4 tile law 3b); expose it as a drawable layer COMBAT
//  can centre on a block".)
//
// HIS RULING, LOCKED, AND IT IS THE WHOLE SPEC.
// laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md, 3b:
//   "the size of the 'ground' changes but the player is the same size just what they
//    'walk' on is a more zoomed out city so it really feels like war is spilling in
//    the streets type shit when its a combat shit."
//   - the sprite is drawn at its normal size (the 56 rig, 112 on screen)
//   - THE FLOOR UNDER IT IS THE CITY AT A ZOOMED-OUT SCALE, so a person stands
//     bigger than the houses they are fighting over. Figures on a war map.
//   - "REUSE-FIRST, and it is already built ... The combat floor is that render,
//     centred on the block you are standing on, NOT A NEW BOARD. ONE SEED, same
//     coordinates, so the fight happens on the actual streets you walked to."
//
// SO THE ONE THING THIS FILE MUST NOT DO IS DRAW A CITY. There is one city renderer
// and this is not it: the surface hands over a PAINTER -- its own renderCity, pointed
// somewhere else and put back -- and this module owns the contract around it. A second
// renderer would be byte-different from the streets he walked to get there, which is
// exactly what "ONE SEED, same coordinates" forbids, and it is the two-systems bug
// this lane has now written four post-mortems about.
//
// THE SCALE RULE IS A RULE, NOT A SETTING. "The player is the same size" only reads as
// war on a map if the ground is genuinely smaller than the person: at 112px of sprite
// on the city's own 18px tiles, one figure stands about six houses wide. So a tile
// bigger than the sprite is REFUSED by name rather than drawn -- a floor that zooms IN
// is not this ruling with a different number, it is the opposite of it.
//
// WHAT IS NOT HERE, ON PURPOSE: no fight, no board state, no cover model, no sprite.
// COMBAT owns all of that (NO DAMAGE BEFORE THE DIAL, and the fight is their lane).
// This hands them a floor and answers what is standing on each cell of it.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* HIS NUMBERS, NOT MINE. The rig is 56 and draws at 112 (the 9/4 law names both),
     and the city's own default tile is TW0/TH0 = 18/9 -- the scale the pad already
     moves across at "ninety-six metres and ten minutes" a press. Nothing invented. */
  var SPRITE_PX = 112;
  var TILE_W = 18, TILE_H = 9;

  var painter = null;      /* the surface's own renderer, registered by the surface */
  var ground = null;       /* the surface's own "what is at this cell" */

  function setPainter(fn) { painter = (typeof fn === 'function') ? fn : null; return !!painter; }
  function setGround(fn) { ground = (typeof fn === 'function') ? fn : null; return !!ground; }
  function ready() { return !!painter; }

  /* ---------------------------------------------------------------------------
     THE PLAN. Pure arithmetic: given a block and a viewport, which cells are on
     this floor and where is its centre. COMBAT can ask for this WITHOUT painting
     anything -- placing bodies does not need pixels, and a lane that has to draw a
     frame to find out where the street is will draw a frame every time it asks.
     --------------------------------------------------------------------------- */
  function plan(opts) {
    opts = opts || {};
    var tw = opts.tileW || TILE_W, th = opts.tileH || TILE_H;
    var w = opts.w || 0, h = opts.h || 0;
    var cx = opts.cx | 0, cy = opts.cy | 0;
    /* THE SCALE RULE, ENFORCED RATHER THAN DOCUMENTED. */
    if (tw >= SPRITE_PX || th >= SPRITE_PX)
      return { ok: false, reason: 'FLOOR_BIGGER_THAN_THE_FIGURE',
               about: 'the player stays the same size and only the ground zooms out '
                    + '(9/4 tile law 3b); a tile at or above ' + SPRITE_PX
                    + 'px is a zoom IN, which is the opposite of the ruling',
               tileW: tw, spritePx: SPRITE_PX };
    if (w <= 0 || h <= 0) return { ok: false, reason: 'NO_VIEWPORT', w: w, h: h };

    /* AN ISO FLOOR: half a screen across is w/tw tiles of run and h/th of rise, and
       a cell moves BOTH when you step, so the radius is the larger of the two plus a
       ring so nothing pops in at the edge. */
    var r = Math.ceil(Math.max(w / tw, h / th) / 2) + 2;
    var cells = [], n = (typeof opts.n === 'number') ? opts.n : 96;
    for (var y = cy - r; y <= cy + r; y++) {
      for (var x = cx - r; x <= cx + r; x++) {
        if (x < 0 || y < 0 || x >= n || y >= n) continue;
        if (Math.abs(x - cx) + Math.abs(y - cy) > r * 2) continue;     /* iso diamond */
        cells.push([x, y]);
      }
    }
    return { ok: true, cx: cx, cy: cy, tileW: tw, tileH: th, w: w, h: h,
             radius: r, cells: cells, spritePx: SPRITE_PX,
             /* HOW BIG A PERSON IS AGAINST THE HOUSES -- the number that says whether
                this reads as war on a map. */
             figureTiles: +(SPRITE_PX / tw).toFixed(2) };
  }

  /* WHAT IS STANDING ON A CELL. COMBAT needs cover to be "the buildings that are
     really there", so this answers off the SAME world the walked surface reads --
     the surface hands the reader in, because a module that reached for a page's
     globals could not be tested headless and would be a second opinion about the
     world besides.

     AND THE UNIT IS A BLOCK, NOT A HOUSE, WHICH IS WORTH SAYING BEFORE COMBAT
     BUILDS ON IT. A cell of this floor is an OVERMAP cell -- a district, about
     ninety-six metres, the step the pad already takes -- so at 18px a figure stands
     about six of them wide, which is the "figures on a war map" the ruling asks for.
     The 9/4 law's OTHER clause, "a combat tile is a house", governs the house-scale
     board, not this one. Measured on the real surface: 2,524 of 2,601 cells on a
     suburb floor come back solid, and that is CORRECT for blocks and would be
     nonsense for houses. A number is not honest until its unit is, so every answer
     here carries scope:'block'. */
  function at(x, y) {
    if (!ground) return null;
    var q = null;
    try { q = ground(x | 0, y | 0); } catch (e) { return null; }
    if (q && !q.scope) q.scope = 'block';
    return q;
  }

  function coverOn(pl) {
    if (!pl || !pl.ok || !ground) return null;
    var out = [];
    for (var i = 0; i < pl.cells.length; i++) {
      var c = pl.cells[i], q = at(c[0], c[1]);
      if (q && q.solid) out.push({ x: c[0], y: c[1], district: q.district, scope: 'block' });
    }
    return out;
  }

  /* ---------------------------------------------------------------------------
     THE PAINT. The surface's own renderer, pointed at a block and put back.
     --------------------------------------------------------------------------- */
  function paint(dest, opts) {
    var pl = plan(opts);
    if (!pl.ok) return pl;
    if (!painter) return { ok: false, reason: 'NO_PAINTER',
                           about: 'the surface has not registered its city renderer' };
    if (!dest) return { ok: false, reason: 'NO_DESTINATION' };
    var r = null;
    try { r = painter(dest, pl); }
    catch (e) { return { ok: false, reason: 'PAINTER_THREW', error: String(e).slice(0, 120) }; }
    return { ok: r !== false, plan: pl, from: (r && r.from) || null };
  }

  var API = { SPRITE_PX: SPRITE_PX, TILE_W: TILE_W, TILE_H: TILE_H,
              setPainter: setPainter, setGround: setGround, ready: ready,
              plan: plan, paint: paint, at: at, coverOn: coverOn };
  if (HASREQ) module.exports = API;
  root.BohemiaCombatFloor = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
