// BOHEMIA SPEEDWAY (7/27/26). LEISURE, on the DISTRICT KIT. 12 valley cells were flat.
//
// Las Vegas Motor Speedway: a 1.5-mile banked tri-oval, and the only district in the
// valley whose entire reason for existing is a shape. Everything else here is arranged
// around the ring — that is what a speedway IS.
//
// REAL REFERENCE (LVMS, and superspeedway site planning generally): a banked asphalt
// OVAL with a painted apron on its inside edge and a SAFER barrier wall on the outside;
// the GRANDSTAND along the front stretch, always on one side only, because the other
// three sides are backstretch and you do not seat people there; the START/FINISH line
// on the front stretch under a flag stand; PIT ROAD inside the oval parallel to the
// front stretch, with the GARAGE row behind it; the infield, which at LVMS holds a road
// course and a huge amount of nothing; light towers for night racing; and the vast
// gravel PARKING that is bigger than the track itself. Spectators reach the infield
// through a TUNNEL under the track, because you cannot cross a live oval.
//
// VEHICULAR VENUE. The WALKABLE-LAND law's own exception, and this is the clearest case
// of it in the game: at a speedway the vehicle surface IS the venue. Declared
// `vehicular:true`, and still dressed everywhere — never a void.
//
// LAWS: street-aware (canonical-south + K.rotateToStreet); ONE car entrance on the
// primary street feeding the parking apron; act-1 DEAD (the cars are still on the grid);
// every tile named, layered and dossiered; zero purple.
//
// LEGEND:
//  0 desert dead-ground   1 parking / drive      2 grandstand           3 dead brush
//  4 infield (dead turf)  5 gate / entrance      6 racing surface       7 track marking
//  8 garage row           9 pit road            10 stall markings      11 catch fence
// 12 light tower         13 tunnel mouth        14 dead race car
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  function buildCanonical(seed) {
    var G = K.grid(seed), g = G.g, W = G.W, H = G.H, x, y, i;
    var set = G.set, get = G.get;

    // ---- desert everywhere, then the parking apron that fills most of the plot ----
    G.rect(0, 0, W - 1, H - 1, 0);
    /* The apron reaches ROW 1 on every side. driveReachFromStreet seeds its flood from
       the drive tiles on the plot border, so an apron inset from the edge is an apron a
       car cannot enter: the first pass measured 0.00 reach with a full car park on it. */
    G.rect(1, 1, W - 2, H - 2, 1);

    /* THE OVAL. Centre it high on the plot so the front stretch and its grandstand sit
       between the track and the entrance, which is how you actually arrive at one. */
    var cx = 64, cy = 52, RX = 54, RY = 40, TRACK = 7;
    function ring(rx, ry, thick, code, over) {
      for (var dy = -ry - thick; dy <= ry + thick; dy++) {
        for (var dx = -rx - thick; dx <= rx + thick; dx++) {
          var o = (dx * dx) / ((rx + thick) * (rx + thick)) + (dy * dy) / ((ry + thick) * (ry + thick));
          var inn = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
          if (o <= 1 && inn > 1) {
            var px = cx + dx, py = cy + dy;
            if (over && over(get(px, py)) === false) continue;
            set(px, py, code);
          }
        }
      }
    }
    // the infield first, then the racing surface as a ring around it
    for (y = -RY; y <= RY; y++) for (x = -RX; x <= RX; x++) {
      if ((x * x) / (RX * RX) + (y * y) / (RY * RY) <= 1) set(cx + x, cy + y, 4);
    }
    ring(RX, RY, TRACK, 6);
    ring(RX + TRACK, RY + TRACK, 2, 11);        // the catch fence outside the wall
    ring(RX - 3, RY - 3, 3, 7);                 // the painted apron on the inside edge

    /* THE FRONT STRETCH: start/finish, pit road behind it, garages behind that. The
       grandstand goes on THIS side only — the other three are backstretch. */
    var fsY = cy + RY + 3;                       // the front stretch, south side of the oval
    for (x = cx - 20; x <= cx + 20; x++) { set(x, fsY, 7); set(x, fsY + 1, 7); }   // start/finish
    G.rect(cx - 46, cy + RY - 16, cx + 46, cy + RY - 9, 9);                        // pit road
    for (i = 0; i < 14; i++) {                                                      // pit stalls
      var sx = cx - 44 + i * 6.6 | 0;
      for (y = cy + RY - 16; y <= cy + RY - 9; y++) set(sx, y, 10);
    }
    G.rect(cx - 40, cy + RY - 30, cx + 40, cy + RY - 18, 8);                        // garage row
    /* THE GAPS START ON THE ROW'S LEFT EDGE. Offset by 2 they left a 2-tile-wide
       sliver of a bay at the end, and a 2-wide building is a footprint no interior can
       honestly fill — the INTERIOR-MATCHES-EXTERIOR law caught it as a 13x2 exterior
       being handed back a 13x3 interior. */
    for (i = 0; i <= 12; i++) {
      var gx2 = cx - 40 + Math.round(i * 6.75);
      for (y = cy + RY - 30; y <= cy + RY - 18; y++) { set(gx2, y, 4); set(gx2 + 1, y, 4); }
    }
    // the grandstand, a long mass outside the front stretch
    G.rect(cx - 50, fsY + TRACK + 3, cx + 50, fsY + TRACK + 16, 2);

    /* THE TUNNEL, and it has to actually PIERCE THE FENCE. The first pass skipped the
       catch fence as well as the track — "it goes under, not through" — which left the
       fence ring unbroken and sealed the whole oval: only 39% of the walkable plot was
       reachable from the street, and the infield, the track and the garages were behind
       a closed ring with no way in. The racing surface and its paint still survive the
       crossing, so the lap stays continuous; the FENCE is what the tunnel opens. */
    for (x = cx - 3; x <= cx + 3; x++) for (y = H - 1; y >= cy + RY - 10; y--) {
      var c = get(x, y);
      if (c === 6 || c === 7) continue;                     // the lap goes over the top
      set(x, y, 13);
    }

    /* LIGHT TOWERS in the four corners of the site, outside the turns, which is where
       they really stand — and the only place they FIT. The first pass put them at
       cx +/- (RX + 14), which on a 128 plot with a 54-radius oval is x = -4 and x = 132:
       all five were placed off the grid and not one tile of them existed. */
    [[9, 11], [W - 10, 11], [9, H - 12], [W - 10, H - 12]].forEach(function (p) {
      for (var a = -2; a <= 2; a++) for (var b = -2; b <= 2; b++) set(p[0] + a, p[1] + b, 12);
    });

    /* THE ROAD COURSE. LVMS runs one inside the oval and its paint is the only thing in
       the infield worth walking to, so the infield stops being a green void. */
    for (i = 0; i < 220; i++) {
      var th = i / 220 * Math.PI * 2;
      var rcx = cx + Math.round(Math.cos(th) * 30 + Math.cos(th * 3) * 9);
      var rcy = cy + Math.round(Math.sin(th) * 20 + Math.sin(th * 2) * 7);
      for (var a2 = -2; a2 <= 2; a2++) for (var b2 = -1; b2 <= 1; b2++) {
        if (get(rcx + a2, rcy + b2) === 4) set(rcx + a2, rcy + b2, 6);
      }
    }

    /* THE PARKING, which really is bigger than the track. Striped across the WHOLE
       apron, not just the strip below the grandstand — the first pass stepped by 7 over
       a band only 3 rows deep, so exactly ONE row of stalls got drawn and the biggest
       surface on the plot read as a flat slab. */
    for (y = 4; y < H - 3; y += 6) {
      for (x = 6; x < W - 6; x++) if (get(x, y) === 1) set(x, y, 10);
    }
    var gx = 64;
    for (i = -5; i <= 5; i++) set(gx + i, H - 1, 5);
    for (y = H - 1; y >= H - 8; y--) for (x = -5; x <= 5; x++) {
      if (get(gx + x, y) === 0) set(gx + x, y, 1);      // punch the entrance into the apron
    }

    // ---- act-1 DEAD: the cars are still on the grid, and brush has taken the infield --
    for (i = 0; i < 11; i++) {
      var rx2 = cx - 34 + i * 6, ry2 = cy + RY - 4 - (i % 2) * 5;
      for (x = 0; x < 4; x++) for (y = 0; y < 2; y++) {
        if (get(rx2 + x, ry2 + y) === 6 || get(rx2 + x, ry2 + y) === 7) set(rx2 + x, ry2 + y, 14);
      }
    }
    for (i = 0; i < 60; i++) {
      var bx = 6 + Math.floor(G.rnd() * (W - 12)), by = 6 + Math.floor(G.rnd() * (H - 12));
      if (get(bx, by) === 4 || get(bx, by) === 0) {
        set(bx, by, 3); set(bx + 1, by, 3); set(bx, by + 1, 3);
      }
    }
    for (i = 0; i < 40; i++) {                     // grit blown across the racing surface
      var sx2 = 6 + Math.floor(G.rnd() * (W - 12)), sy2 = 6 + Math.floor(G.rnd() * (H - 12));
      if (get(sx2, sy2) === 6 && G.rnd() < 0.5) set(sx2, sy2, 0);
    }
    return g;
  }


  /* ONE SPEEDWAY, NOT SIX (8/26). The valley's speedway is a six-cell blob and every cell built
     a COMPLETE track: its own oval, its own infield, its own grandstand, its own pit road and
     garage row. Six ovals inside one fence.

     AND THE SIZE WAS THE REAL INSULT. The single-cell oval is 54 tiles by 40 -- about 81 by
     60 METRES. That is a go-kart circuit. A short track, the smallest thing anyone calls a
     speedway, is a half-mile lap: roughly 250 m across. Across a 3x2 blob the oval is 200 m by
     130 and the lap comes out near half a mile, which is the thing the district is named after.
     Same story as the stadium: the drawing was never wrong, the GROUND it was given was.

     The layout's own proportions are held exactly -- track width, catch fence, pit road and
     garage row are all scaled off the oval rather than re-guessed -- so what changes is the
     scale and nothing else. */
  function clusterOval(seed, opts, b) {
    var A = K.blob(seed, { bounds: b, cellX: opts.cellX, cellY: opts.cellY }), f = A.f;
    var streets = opts.streets || ['S'];
    var i, x, y;

    // ---- desert at the very margins, then the parking apron across the whole site ----
    A.vrect(A.c.x0, A.c.y0, A.c.x1, A.c.y1, 0);
    A.vrect(f.x0 + 1, f.y0 + 1, f.x1 - 1, f.y1 - 1, 1);

    /* THE OVAL, centred high on the site so the front stretch and its grandstand sit between
       the track and the entrance -- which is how you actually arrive at one. */
    var RX = Math.round(Math.min(f.w, f.h) * 0.42), RY = Math.round(RX * 0.74);
    var k = RX / 54;                                   // everything else scales off the oval
    var TRACK = Math.max(5, Math.round(7 * k));
    var ex = f.mx, ey = f.my - Math.round(f.h * 0.06);

    A.vell(ex, ey, RX, RY, 4);                                        // the INFIELD
    /* the racing surface is the band between two ellipses: fill the outer, then punch the
       inner back to infield, which is cheaper and exact where a hand-rolled ring is fiddly */
    A.vell(ex, ey, RX + TRACK, RY + TRACK, 6);
    A.vell(ex, ey, RX, RY, 4);
    A.vell(ex, ey, RX + TRACK + Math.round(2 * k), RY + TRACK + Math.round(2 * k), 11);
    A.vell(ex, ey, RX + TRACK, RY + TRACK, 6);                        // catch fence outside the wall
    A.vring(ex, ey, RX - Math.round(3 * k), RY - Math.round(3 * k), 7, 6, 1);   // apron paint inside

    /* THE FRONT STRETCH: start/finish, pit road behind it, garages behind that. The grandstand
       goes on THIS side only -- the other three are backstretch. */
    var fsY = ey + RY + Math.round(3 * k);
    for (x = ex - Math.round(20 * k); x <= ex + Math.round(20 * k); x++) {
      A.vset(x, fsY, 7); A.vset(x, fsY + 1, 7);
    }
    var pitTop = ey + RY - Math.round(16 * k), pitBot = ey + RY - Math.round(9 * k);
    A.vrect(ex - Math.round(46 * k), pitTop, ex + Math.round(46 * k), pitBot, 9);
    for (i = 0; i < 22; i++) {                                        // the pit stalls
      var sx = ex - Math.round(44 * k) + Math.round(i * (88 * k / 22));
      for (y = pitTop; y <= pitBot; y++) A.vset(sx, y, 10);
    }
    var gTop = ey + RY - Math.round(30 * k), gBot = ey + RY - Math.round(18 * k);
    A.vrect(ex - Math.round(40 * k), gTop, ex + Math.round(40 * k), gBot, 8);
    /* THE GAPS START ON THE ROW'S LEFT EDGE. Offset by two they leave a sliver of a bay at the
       end, and a 2-wide building is a footprint no interior can honestly fill. */
    for (i = 0; i <= 20; i++) {
      var gx2 = ex - Math.round(40 * k) + Math.round(i * (80 * k / 20));
      for (y = gTop; y <= gBot; y++) { A.vset(gx2, y, 4); A.vset(gx2 + 1, y, 4); }
    }
    A.vrect(ex - Math.round(50 * k), fsY + TRACK + Math.round(3 * k),
            ex + Math.round(50 * k), fsY + TRACK + Math.round(16 * k), 2);      // the grandstand

    /* THE TUNNEL, AND IT HAS TO PIERCE THE FENCE. Skipping the catch fence as well as the
       track leaves the ring unbroken and SEALS THE WHOLE OVAL -- infield, track and garages
       behind a closed ring with no way in. The lap survives the crossing; the FENCE is what
       the tunnel opens. */
    for (x = ex - Math.round(3 * k); x <= ex + Math.round(3 * k); x++)
      for (y = f.y1 - 1; y >= ey + RY - Math.round(10 * k); y--) {
        var c = A.vget(x, y);
        if (c === 6 || c === 7) continue;                             // the lap goes over the top
        A.vset(x, y, 13);
      }

    // ---- LIGHT TOWERS in the four corners of the SITE, outside the turns, where they stand
    [[f.x0 + 9, f.y0 + 11], [f.x1 - 10, f.y0 + 11], [f.x0 + 9, f.y1 - 12], [f.x1 - 10, f.y1 - 12]]
      .forEach(function (p) {
        for (var a = -2; a <= 2; a++) for (var b2 = -2; b2 <= 2; b2++) A.vset(p[0] + a, p[1] + b2, 12);
      });

    /* THE ROAD COURSE inside the oval, so the infield stops being a green void -- LVMS runs
       one and its paint is the only thing in there worth walking to. */
    var RCX = Math.round(RX * 0.55), RCY = Math.round(RY * 0.50);
    for (i = 0; i < 520; i++) {
      var th = i / 520 * Math.PI * 2;
      var rcx = ex + Math.round(Math.cos(th) * RCX + Math.cos(th * 3) * (RCX * 0.30));
      var rcy = ey + Math.round(Math.sin(th) * RCY + Math.sin(th * 2) * (RCY * 0.35));
      for (var a2 = -2; a2 <= 2; a2++) for (var b3 = -1; b3 <= 1; b3++)
        if (A.vget(rcx + a2, rcy + b3) === 4) A.vset(rcx + a2, rcy + b3, 6);
    }

    A.dress(14, 30, 1);                                                // dead race cars in the lots
    /* DEAD BRUSH ON THE FENCE LINE, not "on the margins" (8/28). `A.dress(3, 200, 0)` was a
       GUARANTEED NO-OP here and had been since this district was clustered: dress throws its
       darts one tile in from the cell edge -- deliberately, so confetti never lands on a seam
       -- and MEASURED, the only code-0 ground left in a blob speedway is EXACTLY that one-tile
       border, 255 tiles of it and not one inside. 200 darts, 0 hits, in all four cells of a
       2x2. Two correct rules pointing at each other: the dressing keeps off the seam, and the
       only thing left to dress is the seam.
       At blob scale that is the right layout -- an interior cell of a mile-round speedway IS
       all apron, and desert scrub in the middle of it would be wrong. What a speedway in the
       Mojave really collects is tumbleweed piled against the PERIMETER FENCE, which is ground
       that exists here, so the brush goes there. Off the blob hash, so two cells sharing a
       fence run agree on which tiles have weeds without needing the inset to keep them apart. */
    (function(){ var bx, by;
      for(by=A.c.y0; by<=A.c.y1; by++) for(bx=A.c.x0; bx<=A.c.x1; bx++){
        if(A.vget(bx,by)!==12) continue;
        if(A.rnd(bx*3+11,by*5+4)<0.07) A.vset(bx,by,3);
      }
    })();

    var gates = A.gates(streets, 5, 1, [0, 3, 1], 12);
    return { g: A.g, W: A.W, H: A.H, streets: streets, gates: gates, bounds: b,
      footprints: K.footprints(A.g, function (v) { return v === 2 || v === 8; }) };
  }

  function generate(seed, opts) {
    opts = opts || {};
    var streets = opts.streets || ['S'];
    /* A LONE CELL IS UNCHANGED: 96 m of ground holds a small oval, and that art shipped. */
    var __b = opts.bounds;
    if (__b && (__b.x1 > __b.x0 || __b.y1 > __b.y0)) return clusterOval(seed, opts, __b);

    var soft = function (c) { return c === 0 || c === 1 || c === 3 || c === 10; };
    var res = K.rotateToStreet(buildCanonical(seed >>> 0), streets,
                               { gate: 5, pedWalk: 1, pedOver: soft, pedInset: 12 });
    var g = res.g;
    return { g: g, W: g[0].length, H: g.length, streets: streets, gates: res.gates,
             footprints: K.footprints(g, function (v) { return v === 2 || v === 8; }) };
  }
  function driveConnected(res) { return K.driveReachFromStreet(res.g, 1) > 0.85; }

  var PALETTE = {
    0: '#1c1a15', 1: '#3d3a33', 2: '#6f6858', 3: '#4d4a38', 4: '#4a4c33', 5: '#c79a3f',
    6: '#3f3f47', 7: '#b3ab97', 8: '#6a6a72', 9: '#4a4a52', 10: '#8f8676', 11: '#6b6b74',
    12: '#8f8676', 13: '#2b2b31', 14: '#5c5c66'
  };

  var LEGEND = {
    0:  { name: 'desert dead-ground', kind: 'ground',    act1: 'blown grit and bare Mojave dirt at the site edge and across the racing line' },
    1:  { name: 'parking / drive',    kind: 'drive',     act1: 'the gravel parking apron, bigger than the track, empty' },
    2:  { name: 'grandstand',         kind: 'building',  act1: 'the front-stretch grandstand, tier on tier of dead seats, the sponsor panels sun-bleached blank',
          enter: 'grandstand interior: the concourse under the seating bowl, shuttered stands either side' },
    3:  { name: 'dead brush',         kind: 'tree-dead', act1: 'tumbleweed and dry brush, thickest in the infield where nobody mows now', solid: false },
    4:  { name: 'infield (dead turf)',kind: 'ground',    act1: 'the infield, brown to the root, the road-course paint ghosting through it' },
    5:  { name: 'gate / entrance',    kind: 'gate',      act1: 'the spectator entrance off the street, turnstiles standing open' },
    6:  { name: 'racing surface',     kind: 'drive',     act1: 'the banked asphalt oval, rubber still black on the racing line, grit drifting over it' },
    7:  { name: 'track marking',      kind: 'marking',   act1: 'the start/finish line and the painted apron, chalky and worn' },
    8:  { name: 'garage row',         kind: 'building',  act1: 'the garage stalls behind pit road, doors up, every bay stripped',
          enter: 'service bay interior: a bare concrete workshop bay, lift pit open, tool boards stripped' },
    9:  { name: 'pit road',           kind: 'drive',     act1: 'pit road inside the oval, stall boxes still painted on it' },
    10: { name: 'stall markings',     kind: 'marking',   act1: 'faded paint — pit boxes on the road, parking rows across the apron' },
    11: { name: 'catch fence',        kind: 'fence',     act1: 'the catch fence and its cable, leaning where something hit it' },
    12: { name: 'light tower',        kind: 'prop',      act1: 'a race-night light tower, the tallest thing on the site, every head dark' },
    13: { name: 'tunnel mouth',       kind: 'portal',    act1: 'the spectator tunnel under the track — the only way into the infield',
          enter: 'tunnel interior: a concrete underpass beneath the banking, water at the low point' },
    14: { name: 'dead race car',      kind: 'vehicle',   act1: 'a car still sitting on the grid where the race stopped, tyres flat, numbers faded' }
  };

  var NOTES = {
    summary: 'A dead 1.5-mile banked tri-oval: the racing surface with its painted apron and catch fence, the grandstand on the front stretch only, pit road and the garage row inside the oval, the spectator tunnel that is the only way under the track, light towers, and a gravel parking apron bigger than the track itself. Act-1 dead means the cars are still on the grid.',
    reference: [
      'Las Vegas Motor Speedway and superspeedway site planning generally: a banked asphalt oval with a painted apron on the inside and a barrier plus catch fence outside; the grandstand along the FRONT STRETCH ONLY, because the other three sides are backstretch and you do not seat people there; the start/finish line under a flag stand; pit road inside the oval parallel to the front stretch with the garage row behind it; an infield holding a road course and a great deal of nothing; light towers for night racing; and parking that dwarfs the track.',
      'The spectator TUNNEL exists because you cannot cross a live oval on foot. It is the single most speedway-specific piece of circulation there is, and leaving it out would be leaving out the reason the infield feels like another country.'
    ],
    layout: [
      'The oval is centred high on the plot so the front stretch faces the entrance, which is how you actually arrive at one.',
      'Racing surface as a ring of constant thickness around the infield, with the painted apron on its inside edge and the catch fence outside it.',
      'Start/finish across the front stretch; pit road just inside the oval on the same side, its stall boxes painted; the garage row behind pit road with gaps between the bays.',
      'The grandstand is one long mass outside the front stretch, on that side alone.',
      'The tunnel runs from the grandstand side under the banking into the infield, skipping the racing surface rather than cutting it.',
      'Five light towers ring the oval. The rest of the plot is gravel parking, striped in rows, off ONE car entrance on the primary street.'
    ],
    circulation: 'Street-aware via canonical-south + K.rotateToStreet: one car entrance on the primary street opens onto the parking apron, which is continuous, so a car reaches every row from the curb. On foot you cross the apron to the grandstand and take the TUNNEL under the banking to reach the infield — the racing surface is crossable on foot but the tunnel is the way the place was built to be used. A corner cell gains a pedestrian gate on the side street, never a second car entrance.',
    layering: 'GROUND (drive): the parking apron (1), the racing surface (6), pit road (9). GROUND (walk): infield (4), desert (0), and the markings (7, 10). STRUCTURE (solid, ENTERABLE): the grandstand (2) and the garage row (8). FENCE (solid): the catch fence (11). PROPS (solid): light towers (12), dead race cars (14). TREE-DEAD (pass): brush (3). PORTAL: the entrance gate (5) and the spectator TUNNEL (13), which is a real portal into an interior, not a painted arch.',
    decisions: [
      'Paolo 7/26: build the world. 12 valley cells were flat; this is the second-largest buildable landmark type left.',
      'VEHICULAR VENUE, declared: the WALKABLE-LAND law\'s own exception, and the clearest case of it in the game — at a speedway the vehicle surface IS the venue. Still dressed everywhere, never a void.',
      'The grandstand is on ONE side. Ringing the oval with seating would have been easy and wrong: three of the four sides of a superspeedway have no stands.',
      'No sponsor names, no series branding, no track name — Paolo\'s to author if it ever matters. The panels read sun-bleached blank.',
      'ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].'
    ]
  };

  K.register('speedway', { generate: generate, body: function (c) { return c === 2 || c === 8; },
    category: K.category('speedway') || 'leisure', palette: PALETTE, legend: LEGEND, notes: NOTES,
    vehicular: true });

  var API = { generate: generate, driveConnected: driveConnected,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaSpeedway = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
