/* BOHEMIA CAMP LIFE -- HIS CAMP, WHAT IT HOLDS AND WHAT EACH MAN DOES IN IT (CAMP TWO, 10/26/26: [the camp is your own settlement],
   [you see your men at camp], [the camp grows], [the compass of danger], [they pitch the camp]; rules 259, 260, 269).
   PAOLO 10/26: 'the camp screen is gonna be the camp, a settlement vibe, it's very important to me... if it's one person, one tent,
   maybe two people fit in a tent, and maybe there's a shopping cart... an evolution of a bunch of things and icons'; 'if I enter
   camp mode and time is passing I should see my whole team... healing up, depending on their stats and what's happening, or helping
   other members if they're healthy'; 'all eight compass directions, part of the edge of the screen... red as they get closer if
   they're very dangerous'; 'I wanna see me set the camp up with all my camp stuff, depending on my caravan size... starting off with
   a shopping cart... really quickly before it gets into the action, like a loading screen'.
   ONE PLACE THAT KNOWS THE CAMP'S SHAPE. Pure: no screen, no storage written; the condition is READ (engine/bohemia_condition.js is
   CAMP's, never written here). The camp screen (slices/bohemia_camp_look.js) and the map draw what this says.
     BohemiaCampLife.tents(men)                 a tent for each two men, rounded up (one man, one tent)
     BohemiaCampLife.carrier(level, smart)      what hauls the camp: the hand-hauled shopping cart first (laws/BOHEMIA_ADDENDUM_THE_CART_
                                                AND_CAMP_7_24_26.md), the smart cart once its quest is done, then the bigger carriers
                                                as the cart is bought up (engine/bohemia_camp.js's steps)
     BohemiaCampLife.layout(o)                  every piece of the camp on the camp picture (2060 x 1092): the fire, the tents, the
                                                carrier, the supplies, the seats by the fire, each follower's piece, the slain;
                                                o = { men, level, smart, followers:[ids], kills, seed }
     BohemiaCampLife.manOf(m, cond)             one man's blood and armour now, 0..1, from the condition's record of him
     BohemiaCampLife.acts(men, o)               what each man does now, by his condition and the hour: 'lie' (badly hurt, bandaged),
                                                'rest' (hurt, by the fire binding a cut), 'mend' (his armour broken: at the cart or
                                                the blacksmith's anvil), 'tend' (healthy, kneeling by a man lying hurt), 'cook',
                                                'clean' (a gun), 'watch' (the camp's edge), 'sleep' (at night); o = { hour, night, seed }
     BohemiaCampLife.spots(acts, layout)        where each man is for his act, and which way he faces
     BohemiaCampLife.octant(dx, dy)             the compass piece (0 N, 1 NE ... 7 NW) of a way on the map's glass (x right, y down)
     BohemiaCampLife.compass(threats)           the eight edge pieces: each lit by the nearest party coming that way, brighter as it
                                                closes; the colour is the AUTO calculator's own (COMBAT's oddsTint on ours.json
                                                odds_colour): red deepening to a loss, a weak green for a clean win, barely anything
                                                for an easy one
     BohemiaCampLife.pitch(o)                   the pitching scene's beats: the carrier rolls in, the men pull the camp out of it, the
                                                tents go up one by one, the fire is lit last; o = { men, tents, level, smart }
   Words are attempts, draft:true. */
(function (root) {
  'use strict';
  var PIC = { w: 2060, h: 1092 };
  var FIRE = { x: 1030, y: 640 };
  /* THE TWO SHAPES (rule 289, Paolo 10/26: 'all camps and settlements have to look good when you flip them from portrait to landscape...
     before you can even begin to try to make the phone location look good'): the wide camp on the wide ground (2060 x 1092) and the
     tall camp on the tall ground (1092 x 1940, slices/camp_two/plate_tall.webp): the same pieces, the tents stacked in rows behind
     the fire instead of spread in arcs, every other offset narrowed and lengthened (sx, sy), so a phone held upright fills with it */
  var GEO = { wide: { w: 2060, h: 1092, fx: 1030, fy: 640, sx: 1, sy: 1, cap: [4, 5, 6], rx: [300, 200], ry: [200, 150],
                edges: [[-700, 20, 'SW'], [720, 10, 'SE'], [520, -250, 'NE'], [-520, -240, 'NW']],
                truckAt: { cart: [-640, 40], supplies: [-250, 250], blacksmith: [-120, 300],
                           spots: [[470, 40], [820, 240], [560, -110], [-470, -330], [330, -230], [-430, 300], [200, 230]] } },   /* the watch at the camp's sides, clear of the cart and of the bottom corners (the phone's) */
              tall: { w: 1092, h: 1940, fx: 546, fy: 1000, sx: 0.62, sy: 1.45, cap: [3, 4, 4, 4], rx: [250, 70], ry: [250, 215], ring: [0.12, 0.88],
                /* the upright camp is its own picture, not the wide one squeezed: the tents in rows behind the fire, the carrier and its
                   load on the left, the seats and the hurt in front, the followers down both sides; centred on the glass with no phone
                   (rule 289), lifted in one beat when the phone comes on (lift below) */
                at: { cart: [-300, 40], supplies: [-330, 360], seats: [250, 250], slain: [330, -600],
                      cook: [200, -40], blacksmith: [-120, 420], surgeon: [370, 380], lookout: [420, -385], scout: [-420, -380], paymaster: [400, 90] },
                edges: [[-470, -90, 'SW'], [470, -60, 'SE'], [440, -480, 'NE'], [-440, -520, 'NW']],
                spots: [[-430, -200], [324, -90], [130, 470], [-440, 230], [440, 520], [-130, -620], [180, -640]] } };
  function geo(o) { return o && o.tall ? GEO.tall : GEO.wide; }
  var HURT = 0.87, BAD = 0.35;          /* rule 261(b): under 87 percent he shows; under about a third he is down on a bedroll */
  /* the odds colour, read from ours.json by whoever loads it (the same file COMBAT's AUTO reads), else the 144(e) numbers */
  var ODDS = { turn: 0.8, glow_at: 0.92, alpha_min: 0.18, alpha_max: 0.62 };

  function seedOf(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rnd(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  function tents(men) { men = Math.max(1, men | 0); return Math.ceil(men / 2); }

  /* THE CARRIER (rule 260(c)): the shopping cart, pushed by hand, is where every company starts; the smart cart is the quest's (the
     7/24 law: found as salvage and fitted); the bought steps are engine/bohemia_camp.js's (its words stay its own) */
  var CARRIERS = [
    { id: 'shopping_cart', word: 'THE SHOPPING CART', sprite: 'cart', hauled: true, crates: 1 },
    { id: 'shopping_cart_loaded', word: 'THE SHOPPING CART, LOADED', sprite: 'cart', hauled: true, crates: 2 },
    { id: 'smart_cart', word: 'THE SMART CART', sprite: 'smart_cart', hauled: false, crates: 2 },
    { id: 'pickup', word: 'THE PICKUP', sprite: 'truck', hauled: false, crates: 3 },
    { id: 'pickup_trailer', word: 'THE PICKUP AND ITS TRAILER', sprite: 'truck', trailer: true, hauled: false, crates: 4 }
  ];
  function carrier(level, smart) {
    level = Math.max(0, level | 0);
    if (level >= 3) return CARRIERS[4];
    if (level >= 2) return CARRIERS[3];
    if (smart) return CARRIERS[2];
    return level >= 1 ? CARRIERS[1] : CARRIERS[0];
  }

  /* each follower's piece and where it stands round the fire (picture px from the fire): his own spot when he has one (the cook at
     the fire, the blacksmith by the cart, the lookout at the edge), else the next free place round the camp in the order he came;
     all eighteen of Battle Brothers' have a piece (rule 270), at most five by the fire at once (the retinue's places) */
  var FOLLOWER_AT = {
    cook: { sprite: 'f_cook', dx: 250, dy: 60 }, blacksmith: { sprite: 'f_blacksmith', dx: -560, dy: 150 },
    surgeon: { sprite: 'f_surgeon', dx: 420, dy: 200 }, lookout: { sprite: 'f_lookout', dx: 640, dy: -230 },
    scout: { sprite: 'f_scout', dx: -640, dy: -160 }, paymaster: { sprite: 'f_paymaster', dx: 400, dy: -120 }
  };
  var FOLLOWER_SPOTS = [{ dx: 470, dy: 40 }, { dx: -600, dy: 20 }, { dx: 560, dy: -110 }, { dx: -470, dy: -200 }, { dx: 330, dy: -230 }, { dx: -300, dy: 210 }, { dx: 200, dy: 230 }];

  /* the tents in rows behind the fire, an arc a row, the first tent his */
  function tentSpots(n, R, G) {
    G = G || GEO.wide;
    var out = [], rows = [], left = n, cap = G.cap, ri = 0;
    while (left > 0) { var c = Math.min(left, cap[Math.min(ri, cap.length - 1)]); rows.push(c); left -= c; ri++; }
    rows.forEach(function (c, r) {
      var rx = G.rx[0] + r * G.rx[1], ry = G.ry[0] + r * G.ry[1], span = Math.min(Math.PI * 0.95, 0.42 * Math.max(1, c - 1) + 0.3);
      for (var i = 0; i < c; i++) {
        var t = c === 1 ? 0 : (i / (c - 1) - 0.5), a = -Math.PI / 2 + t * span + (R() - 0.5) * 0.08;
        out.push({ x: Math.round(G.fx + Math.cos(a) * rx + (R() - 0.5) * 20), y: Math.round(G.fy + Math.sin(a) * ry + (R() - 0.5) * 12) });
      }
    });
    return out;
  }
  var CLOTHS = ['tent_olive', 'tent_tarp', 'tent_stripe'];
  /* the highest a piece's foot may stand on the ground, by how tall it is drawn, so its top stays on the picture (a rise never
     piles the back row into the top edge) */
  var MINY = { tent: 220, follower: 200, carrier: 260, slain: 90, fire: 90, supplies: 120, seats: 100 };
  function layout(o) {
    o = o || {};
    var men = Math.max(1, o.men | 0), R = rnd(seedOf('camp:' + (o.seed || 0))), car = carrier(o.level, o.smart), pieces = [], G = geo(o);
    var lift = o.lift | 0;   /* the camp raised on the glass (rule 286 after 289: a phone in the bottom corner of an upright glass) */
    var TK = car.sprite === 'truck' && G.truckAt ? G.truckAt : null;   /* the pickup is five metres of steel: the things it would bury move (rule 289: no overlap) */
    var at = function (dx, dy, id) { var t = id && ((TK && TK[id]) || (G.at && G.at[id])); return t ? { x: G.fx + t[0], y: G.fy + t[1] } : { x: G.fx + dx * G.sx, y: G.fy + dy * G.sy }; };
    pieces.push({ kind: 'fire', key: 'fire', sprite: 'fire', x: G.fx, y: G.fy, tap: 'fire' });
    tentSpots(tents(men), R, G).forEach(function (p, i) {
      pieces.push({ kind: 'tent', key: i ? 'tent_' + (i + 1) : 'tent', sprite: CLOTHS[(i + (seedOf('cloth:' + (o.seed || 0)) % 3)) % 3], x: p.x, y: p.y, tap: 'tent', i: i,
        sleeps: [i * 2, i * 2 + 1].filter(function (k) { return k < men; }) });
    });
    var q1 = at(-470, 70, 'cart'), q2 = at(-330, 140, 'supplies'), q3 = at(300, 150, 'seats');
    pieces.push({ kind: 'carrier', key: 'cart', sprite: car.sprite, carrier: car.id, word: car.word, trailer: !!car.trailer, x: q1.x, y: q1.y, tap: 'cart' });
    pieces.push({ kind: 'supplies', key: 'supplies', sprite: 'supplies', x: q2.x, y: q2.y, tap: 'cart' });   /* the camp kept off the glass's bottom corners, where the phone stands (rule 286) */
    pieces.push({ kind: 'seats', key: 'retinue', sprite: 'seats', x: q3.x, y: q3.y, tap: 'retinue' });
    var freeSpot = 0, taken = {};
    (o.followers || []).forEach(function (id) { if (FOLLOWER_AT[id]) taken[FOLLOWER_AT[id].dx + ',' + FOLLOWER_AT[id].dy] = 1; });
    (o.followers || []).forEach(function (id) {
      var f = FOLLOWER_AT[id];
      var qf;
      if (!f) { var sp = null; while (freeSpot < FOLLOWER_SPOTS.length && !sp) { var q = FOLLOWER_SPOTS[freeSpot++]; if (!taken[q.dx + ',' + q.dy]) sp = q; } if (!sp) return;
        f = { sprite: 'f_' + id, dx: sp.dx, dy: sp.dy }; var ts = (TK && TK.spots && TK.spots[freeSpot - 1]) || (G.spots && G.spots[freeSpot - 1]); qf = ts ? { x: G.fx + ts[0], y: G.fy + ts[1] } : at(f.dx, f.dy); }
      else qf = at(f.dx, f.dy, id);
      pieces.push({ kind: 'follower', key: 'f_' + id, follower: id, sprite: f.sprite, x: qf.x, y: qf.y, tap: 'retinue' }); });
    var k = o.kills | 0;
    var qs = at(-600, -330, 'slain'); if (k > 0) pieces.push({ kind: 'slain', key: 'slain', sprite: k <= 2 ? 'slain_few' : k <= 5 ? 'slain_some' : 'slain_many', n: k, x: qs.x, y: qs.y, tap: null });
    pieces.forEach(function (p) { p.y -= lift; p.x = Math.round(Math.max(100, Math.min(G.w - 100, p.x))); p.y = Math.round(Math.max(MINY[p.kind] || 200, Math.min(G.h - 60, p.y))); });
    return { fire: { x: G.fx, y: G.fy - lift }, pieces: pieces, tents: tents(men), carrier: car, pic: { w: G.w, h: G.h }, tall: G === GEO.tall, geo: G, lift: lift };
  }

  /* ONE MAN'S CONDITION, READ: the share of his blood and armour he has now (1 whole, a man no fight has seen is whole) */
  function canon(C, name, main) { try { return C.canon(name, main); } catch (e) { return main ? 'YOU' : String(name || '').toUpperCase(); } }
  function manOf(m, C) {
    var out = { name: m.name || '', look: m.look, main: !!m.main, blood: 1, armour: 1 };
    if (!C || !C.get) return out;
    var s = null; try { s = C.get(); } catch (e) { s = null; }
    var r = s && s.men ? s.men[canon(C, m.name, m.main)] : null;
    if (!r) return out;
    if (r.hpMax > 0) out.blood = Math.max(0, Math.min(1, 1 - (r.lostHp || 0) / r.hpMax));
    var am = (r.armHMax || 0) + (r.armBMax || 0);
    if (am > 0) out.armour = Math.max(0, Math.min(1, 1 - ((r.lostH || 0) + (r.lostB || 0)) / am));
    return out;
  }

  /* WHAT EACH MAN DOES (rule 259(a)), changing with the hours: the hurt first, then who tends them, then the camp's jobs in turn */
  var DAY_JOBS = ['cook', 'clean', 'watch', 'rest_easy', 'clean', 'cook'];
  function acts(men, o) {
    o = o || {};
    var hour = o.hour | 0, night = !!o.night, out = [], lying = [];
    men.forEach(function (m, i) {
      var a;
      if (m.blood < BAD) a = 'lie';
      else if (m.blood < HURT) a = 'rest';
      else if (m.armour < HURT) a = 'mend';
      else a = null;
      out.push({ i: i, name: m.name, look: m.look, main: !!m.main, blood: m.blood, armour: m.armour, act: a });
      if (a === 'lie') lying.push(i);
    });
    var free = out.filter(function (e) { return !e.act; });
    /* a man lying hurt has a friend kneeling by him while there is a healthy one to spare (the main character tends last) */
    free.sort(function (a, b) { return (a.main ? 1 : 0) - (b.main ? 1 : 0) || a.i - b.i; });
    lying.forEach(function (li) { var f = free.shift(); if (f) { f.act = 'tend'; f.by = li; } });
    /* the rest: one keeps watch all night; by day the jobs go round the hours, each man a step on from the last */
    var watchAt = free.length ? (hour + (o.seed | 0)) % free.length : -1;
    free.forEach(function (e, j) {
      if (night) e.act = j === watchAt ? 'watch' : 'sleep';
      else { var job = DAY_JOBS[(hour + j * 2 + (o.seed | 0)) % DAY_JOBS.length]; e.act = job === 'rest_easy' ? 'rest' : job; }
    });
    return out;
  }

  /* WHERE HE IS FOR WHAT HE DOES, and the way he faces (the eight turns S SE E NE N NW W SW) */
  function dirTo(dx, dy) { var a = Math.atan2(dy * 2, dx), k = Math.round(a / (Math.PI / 4)); return ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'][((k % 8) + 8) % 8]; }
  function spots(list, L) {
    var G = L.geo || GEO.wide, X = function (dx) { return dx * Math.max(G.sx, 0.62); }, Y = function (dy) { return dy * G.sy; };
    var f = L.fire, piece = function (k) { for (var i = 0; i < L.pieces.length; i++) if (L.pieces[i].key === k || L.pieces[i].kind === k) return L.pieces[i]; return null; };
    var used = {}, ring = function (n, rx, ry, a0, a1, i) { var a = n <= 1 ? (a0 + a1) / 2 : a0 + (a1 - a0) * i / (n - 1); return { x: Math.round(f.x + Math.cos(a) * rx), y: Math.round(f.y + Math.sin(a) * ry) }; };
    var by = {}; list.forEach(function (e) { (by[e.act] = by[e.act] || []).push(e); });
    var out = {};
    var put = function (e, x, y, face) { out[e.i] = { x: Math.round(x), y: Math.round(y), face: face, act: e.act }; };
    (by.lie || []).forEach(function (e, j) { var per = G === GEO.tall ? 3 : 6, row = Math.floor(j / per), col = j % per, n = Math.min(per, by.lie.length - row * per);
      put(e, f.x - 160 + col * 170 - ((n - 1) * 85) + 160, f.y + Y(200) + row * 80 + (col % 2) * 30, 'E'); });   /* in front of the fire, a row a few at a time */
    (by.tend || []).forEach(function (e) { var p = out[e.by]; if (p) put(e, p.x + 20, p.y - 46, 'S'); else put(e, f.x, f.y + 120, 'N'); });
    var sitters = (by.rest || []).concat(by.clean || []);
    var arc = G.ring || [0.62, 1.38];   /* the wide camp sits them on the fire's left; the upright one in front of it, backs to us */
    sitters.forEach(function (e, j) { var q = ring(sitters.length, 175, 85, Math.PI * arc[0], Math.PI * arc[1], j); put(e, q.x, q.y, dirTo(f.x - q.x, f.y - q.y)); });
    var smith = piece('f_blacksmith'), cart = piece('cart');
    (by.mend || []).forEach(function (e, j) { var at = smith || cart; put(e, at.x + 70 + j * 46, at.y + 40 + (j % 2) * 18, dirTo(at.x - (at.x + 70 + j * 46), -1)); });
    var pot = piece('f_cook');
    (by.cook || []).forEach(function (e, j) { var at = pot || f; put(e, at.x + (pot ? 95 : X(170)) + j * 50, at.y + (pot ? 45 : -10), 'W'); });   /* beside the pot, never in front of it (the pot stays a door) */
    var edges = G.edges.map(function (q) { return { x: f.x + q[0], y: f.y + q[1], face: q[2] }; });   /* the camp's edge, inside what a phone shows of it */
    (by.watch || []).forEach(function (e, j) { var q = edges[j % edges.length]; put(e, q.x, q.y, q.face); });
    var tl = L.pieces.filter(function (p) { return p.kind === 'tent'; });
    (by.sleep || []).forEach(function (e, j) { var t = tl[Math.floor(e.i / 2) % Math.max(1, tl.length)] || { x: f.x, y: f.y - 200 }; put(e, t.x - 40 + (e.i % 2) * 80, t.y + 95, 'E'); });
    void used;
    return out;
  }

  /* THE COMPASS (rule 269(b)): N is up the glass */
  function octant(dx, dy) { var a = Math.atan2(dx, -dy); var k = Math.round(a / (Math.PI / 4)); return ((k % 8) + 8) % 8; }
  function tint(v) {
    if (v == null) return null;
    var C = ODDS, span = C.alpha_max - C.alpha_min;
    if (v >= C.turn) return { green: true, a: C.alpha_min + span * Math.min(1, (v - C.turn) / Math.max(1e-6, 1 - C.turn)) };
    return { green: false, a: C.alpha_min + span * Math.min(1, (C.turn - v) / Math.max(1e-6, C.turn)) };
  }
  /* threats: [{ dx, dy (the way to them on the glass), blocks (how far), clean (0..1 the AUTO read of a clean win against his crew,
     null while it reads), name, count, hunt }] */
  var NEAR = 1, FAR = 9;
  function compass(threats) {
    var out = []; for (var i = 0; i < 8; i++) out.push({ dir: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][i], lit: 0, rgb: null, a: 0, who: null, blocks: null, clean: null });
    (threats || []).forEach(function (t) {
      if (!t || t.blocks == null || t.blocks > FAR) return;
      var k = octant(t.dx, t.dy), close = Math.max(0, Math.min(1, (FAR - t.blocks) / (FAR - NEAR)));
      var c = tint(t.clean == null ? null : t.clean);
      /* the colour is AUTO's: red for anything under its turn, deepening to a loss; a win reads green and weak; an easy one barely */
      var rgb = c ? (c.green ? [46, 160, 67] : [208, 48, 32]) : [160, 140, 110];
      var a = c ? (c.green ? c.a * 0.45 * (1 - Math.max(0, (t.clean - ODDS.glow_at) / (1 - ODDS.glow_at)) * 0.6) : c.a) : 0.2;
      var lit = close * a / ODDS.alpha_max;
      if (lit > out[k].lit) out[k] = { dir: out[k].dir, lit: lit, rgb: rgb, a: a * (0.35 + 0.65 * close), who: t.name || null, count: t.count || null, blocks: t.blocks, clean: t.clean, hunt: !!t.hunt, loss: !!(c && !c.green) };
    });
    return out;
  }

  /* THE PITCH (rule 269(c)): a few seconds, on the beat (120 BPM: a beat is 500 ms); the carrier rolls in, every man pulls a load
     out of it to a tent, the tents stand in turn, the fire last. Scaled to his crew and his carrier: more men, more hands */
  function pitch(o) {
    o = o || {};
    var men = Math.max(1, o.men | 0), tn = tents(men), car = carrier(o.level, o.smart), beat = 500;
    var roll = car.hauled ? 2 : 1.5, unload = 1 + Math.min(2, (car.crates | 0) * 0.5), stand = Math.max(1, Math.min(4, tn * 0.75));
    var beats = roll + unload + stand + 1;
    var t = { ms: Math.round(beats * beat), roll: [0, roll * beat], unload: [roll * beat, (roll + unload) * beat], tents: [], fire: (beats - 1) * beat, carrier: car.id };
    for (var i = 0; i < tn; i++) t.tents.push(Math.round((roll + unload + stand * (i / Math.max(1, tn))) * beat));
    return t;
  }

  function setOdds(c) { if (c && typeof c.turn === 'number') for (var k in ODDS) if (typeof c[k] === 'number') ODDS[k] = c[k]; }

  root.BohemiaCampLife = { PIC: PIC, FIRE: FIRE, GEO: GEO, MINY: MINY, HURT: HURT, BAD: BAD, CARRIERS: CARRIERS, FOLLOWER_AT: FOLLOWER_AT, tents: tents, carrier: carrier, layout: layout,
    manOf: manOf, acts: acts, spots: spots, octant: octant, tint: tint, compass: compass, pitch: pitch, setOdds: setOdds, odds: function () { return ODDS; }, seedOf: seedOf };
})(typeof window !== 'undefined' ? window : this);
