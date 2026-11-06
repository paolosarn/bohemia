/* BOHEMIA CAMP BOARD -- THE CAMP IS PITCHED ON THE FIGHT BOARD (CAMP THREE, 11/6/26, rule 406(a)(b), ask line 449).
   PAOLO 11/4, AN EXECUTIVE DECISION, LOCKED: 'it's not feeling natural at all... the camp only takes place on combat grid maps... the
   camp could take up one tile or four tiles in a square and keep getting bigger... it'll make it a lot easier for you, so you don't
   have to make two different types of camps... anytime you camp it's on the combat grid... that's why we need more awesome combat
   streets'.
   MEASURED BEFORE (main ce14b189): making camp on any block of the map opened the same picture, CAMP TWO's quilted sand
   (slices/camp_two/plate.webp, plate_night, plate_tall, plate_tall_night), the block he stood on shown nowhere; a crew that found him
   there opened a fight on a board dealt for that block, a different picture with no camp on it. Two camps, as he said.
   NOW ONE CAMP, ON THE BOARD: the camp screen's ground IS the fight board of the block he stands on. This file asks the fight for it
   the way a fight there asks (the shell's own door, nfOpts, on the hand-over the map would send from that block, with the die the
   camp keeps), in a hidden copy of the fight page set beside the map where a fight's page sits (slices/BOHEMIA_FIGHT.html
   __THE_CAMP_ON_THE_BOARD__; COMBAT TWO's board laid from the map's own block is found from there): the fight's own dealer deals
   it, the camp's tiles are pitched on it (engine/bohemia_camp_life.js square and pitchOn: one house tile while the company is three or
   fewer, two side by side to eight, a 2 by 2 square past that, never more than four connected tiles, rule 406(h)), the fight's own
   bake draws the ground round them by day and by night,
   and this file lays CAMP TWO's camp on the square: the camp's footprint (every piece's footprint_m, as the camp's walk reads it)
   fills the square, so the board under it is drawn at the size that holds it (one tile is one house; a bigger company shows more of
   the street round it). Every rule CAMP and CAMP TWO built stays where it was (the hours, the healing, the doors, the acts, the
   pitch, the compass, the ghosts, the turn); only WHERE the camp is drawn changed. Nothing here deals a board.
     BohemiaCampBoard.want(ask, plan, kit)  start (or keep) this camp's board. ask: the map's hand-over for the block (BohemiaMapCamp
                                            .boardAsk()); plan: CAMP TWO's layout options { men, level, smart, followers, kills, seed };
                                            kit: slices/camp_two/kit.json
     BohemiaCampBoard.state()               { state: 'none' | 'baking' | 'in' | 'failed', key, pitch, board, ms, ... } for the gate
     BohemiaCampBoard.plate(L)              the board's picture for one of CAMP TWO's layouts (its shape and its lift), composed once:
                                            { src, night_src, px, T, key } when it is ready, else the nearest ready one of that shape,
                                            else null (it is being made; onChange fires when it lands)
     BohemiaCampBoard.handOver(L)           the camp as the fight at camp draws it (rule 406(c)): { x, y, n, k, pieces, board, die }
     BohemiaCampBoard.onChange(fn)          fn() when the board or a picture lands
     BohemiaCampBoard.drop()                let the pictures go (the camp is over)
   Words are attempts, draft:true (none here). */
(function (root) {
  'use strict';
  var PERSON = 134, ZK = 98;              /* the camp screen's man, picture px (slices/bohemia_camp_look.js PERSON), and the rig's ruler */
  var AR = 364 / 515;                     /* a tile's depth on the picture over its width (slices/fight_ground/fight_ground.json tile_px) */
  var TMIN = 300, TMAX = 1500, FILL = 1.1;   /* picture px a tile, either side of what holds the camp; the square holds the camp with a tenth to spare */
  var LIFT_MAX = 440;                     /* CAMP TWO's highest rise of the upright camp over the phone (bohemia_camp_look.js liftFor) */
  var WAIT_MS = 30000;
  var B = { key: null, state: 'none', frame: null, out: null, plates: {}, making: {}, t0: 0, ms: null, err: null, bakes: 0, ask: null, plan: null, kit: null,
    n: 1, need: null, pitch: null, fns: [], heard: null, made: 0 };

  function CL() { return root.BohemiaCampLife || null; }
  function tell() { B.fns.forEach(function (f) { try { f(); } catch (e) {} }); }

  /* ---------------------------------------------------------------- the camp's ground, from CAMP TWO's own layout */
  function footOf(p, kit) {
    if (p.sprite === 'cart') return [-0.5, -0.32, 0.5, 0.32];
    if (p.sprite === 'truck') return [-1.4, -2.6, 1.4, 2.6];
    var e = kit && kit.pieces && kit.pieces[p.sprite === 'fire' ? 'fire_0' : p.sprite];
    return e && e.footprint_m ? e.footprint_m : [-0.6, -0.4, 0.6, 0.4];
  }
  /* every piece's footprint on the picture (the camp's walk reads the same: bohemia_camp_look.js blocks) */
  function feet(L, kit) {
    var z = PERSON / ZK, ppm = (kit && kit.ppm) || 57, mx = ppm * z, my = ppm * 0.7071 * z, b = null;
    (L && L.pieces || []).forEach(function (p) {
      var f = footOf(p, kit), r = [p.x + f[0] * mx, p.y - f[3] * my, p.x + f[2] * mx, p.y - f[1] * my];
      b = b ? [Math.min(b[0], r[0]), Math.min(b[1], r[1]), Math.max(b[2], r[2]), Math.max(b[3], r[3])] : r;
    });
    return b;
  }
  /* the square holds the camp: the picture px a tile is the camp's ground over the square's side */
  function fit(L, kit, sq) {
    var F = feet(L, kit); if (!F) return null;
    var w = Math.max(1, F[2] - F[0]), h = Math.max(1, F[3] - F[1]);
    var T = Math.max(TMIN, Math.min(TMAX, Math.max(w / sq.w, h / (sq.h * AR)) * FILL));
    return { T: Math.round(T * 10) / 10, c: [(F[0] + F[2]) / 2, (F[1] + F[3]) / 2], PW: L.pic.w, PH: L.pic.h, feet: F, sq: sq, tall: !!L.tall, lift: L.lift | 0 };
  }
  /* how far the camp's pictures reach past the square's middle, in tiles, each way (the wide, the upright, the upright risen) */
  function reach(fits) {
    var o = { l: 0, r: 0, t: 0, b: 0 };
    fits.forEach(function (f) { if (!f) return; var th = f.T * AR;
      o.l = Math.max(o.l, f.c[0] / f.T); o.r = Math.max(o.r, (f.PW - f.c[0]) / f.T); o.t = Math.max(o.t, f.c[1] / th); o.b = Math.max(o.b, (f.PH - f.c[1]) / th); });
    for (var k in o) o[k] = Math.round(o[k] * 100) / 100;
    return o;
  }
  function plans(plan, kit, sq) {
    var C = CL(); if (!C) return [];
    return [false, true, 'risen'].map(function (s) { return fit(C.layout(Object.assign({}, plan, { tall: !!s, lift: s === 'risen' ? LIFT_MAX : 0 })), kit, sq); }).filter(Boolean);
  }

  /* ---------------------------------------------------------------- the fight's own door, for the block he camps on */
  function shellOpts(ask) {
    var T = null; try { T = root.top; } catch (e) { T = null; }
    var o = null;
    try {
      if (T && T !== root && typeof T.nfOpts === 'function') {
        /* the door is asked, never walked through: what it leaves on the shell for the fight's gates is put back as it was */
        var keep = { h: T.__NF_HANDED, c: T.__NF_COND, a: T.__NF_ARENA, d: T.NF ? T.NF.day : undefined };
        try { o = T.nfOpts(JSON.parse(JSON.stringify(ask))); }
        finally { T.__NF_HANDED = keep.h; T.__NF_COND = keep.c; T.__NF_ARENA = keep.a; if (T.NF && keep.d !== undefined) T.NF.day = keep.d; }
      }
    } catch (e) { o = null; }
    if (!o) o = { district: ask.district || null, cell: ask.at || null, night: !!(ask.world && ask.world.night) };   /* the camp screen on its own bench */
    o = JSON.parse(JSON.stringify(o));
    if (ask.__deal != null) o.deal = ask.__deal >>> 0;
    o.keep = false; o.resume = false; o.odds = false; o.teach = false;
    return o;
  }
  function pick(grid) {
    var C = CL(); if (!C) return null;
    var D = B.ask && B.ask.dead && B.ask.dead.length ? B.ask.dead : null;   /* rule 406(f)(g): the camp beside the dead of the fight just won */
    if (D) { grid.near = { x: D.reduce(function (t, d) { return t + d.x + 0.5; }, 0) / D.length, y: D.reduce(function (t, d) { return t + d.y + 0.5; }, 0) / D.length };
      grid.dead = D.map(function (d) { return [d.x, d.y]; }); }
    var p = C.pitchOn(grid, B.sq, B.need); if (!p) return null;
    var N = B.need, cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    var x0 = Math.max(0, Math.floor(cx - N.l - 0.5)), x1 = Math.min(grid.w, Math.ceil(cx + N.r + 0.5));
    var y0 = Math.max(0, Math.floor(cy - N.t - 0.5)), y1 = Math.min(grid.h, Math.ceil(cy + N.b + 0.5));
    p.win = { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) }; p.need = N;
    return p;
  }

  /* ---------------------------------------------------------------- the bake, in a hidden copy of the fight page */
  function keyOf(ask, sq) { return JSON.stringify([ask && ask.at, ask && ask.district, ask && ask.__deal, sq.w, sq.h, ask && ask.sig || null, ask && ask.dead ? ask.dead.length : 0]); }   /* never the hour: the board is baked by day and by night at once */
  function want(ask, plan, kit) {
    var C = CL(); if (!C || !ask || !plan || !kit) return B.state;
    B.kit = kit; B.plan = plan;
    var sq = C.square(plan), key = keyOf(ask, sq);
    if (key === B.key && B.state !== 'failed') return B.state;
    drop();
    B.key = key; B.ask = ask; B.sq = sq; B.n = sq.n; B.need = reach(plans(plan, kit, sq));
    B.state = 'baking'; B.t0 = Date.now(); B.err = null; B.bakes++;
    var fits = plans(plan, kit, sq), tmin = Math.min.apply(null, fits.map(function (f) { return f.T; }));
    /* rule 406(f): a camp made from the end screen takes the fight's own options whole (the very board it was fought on), and its dead */
    var opts = ask.fightOpts ? JSON.parse(JSON.stringify(ask.fightOpts)) : shellOpts(ask);
    if (ask.fightOpts) { if (ask.__deal != null) opts.deal = ask.__deal >>> 0; opts.keep = false; opts.resume = false; opts.odds = false; opts.teach = false; }
    var wide = fits.filter(function (f) { return !f.tall; })[0] || fits[0];
    opts.campBoard = { pick: pick, tw: Math.round(Math.max(200, Math.min(515, tmin))), dead: ask.dead || [], manPx: wide ? Math.round(PERSON / wide.T * 1e4) / 1e4 : 0 };
    B.fromFight = !!ask.fightOpts; B.wantSig = ask.sig || null;
    B.opts = { kind: opts.kind || null, district: opts.district || null, cell: opts.cell || null, night: !!opts.night, deal: opts.deal != null ? opts.deal : null };
    var f = document.createElement('iframe'); f.title = 'the camp\'s board'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; f.id = 'campboardframe';
    f.style.cssText = 'position:fixed;left:-12000px;top:0;width:480px;height:320px;border:0;visibility:hidden;pointer-events:none;z-index:-5';
    var mine = key, set = function () { try { var cw = f.contentWindow; if (cw && cw.location && /BOHEMIA_FIGHT/.test(cw.location.href) && !cw.FIGHT_OPTS) cw.FIGHT_OPTS = opts; } catch (e) {} };
    var iv = setInterval(set, 4);
    f.addEventListener('load', function () { set(); clearInterval(iv); });
    B.heard = function (ev) { var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_CAMP_BOARD' || ev.source !== f.contentWindow) return; landed(f, mine, d); };
    /* the page sits where a fight's page sits, beside the map (the shell): the fight finds the map there and lays the board from the
       map's own block (COMBAT TWO's __THE_BOARD_IS_THE_CITY_AT_THAT_SPOT__ asks its parent for #cityFrame); its word comes to the shell */
    var home = document, hw = root; try { if (root.top && root.top !== root && root.top.document && root.top.document.getElementById('cityFrame')) { home = root.top.document; hw = root.top; } } catch (e) { home = document; hw = root; }
    B.hw = hw; hw.addEventListener('message', B.heard);
    B.timer = setTimeout(function () { if (B.key === mine && B.state === 'baking') fail('the board did not come in ' + (WAIT_MS / 1000) + ' s'); }, WAIT_MS);
    f.src = 'BOHEMIA_FIGHT.html';
    (home.body || home.documentElement).appendChild(f);
    B.frame = f;
    return B.state;
  }
  function ask0(key) { return B.key === key && B.ask ? B.ask.dead : null; }
  function copy(c) { if (!c || !c.width) return null; var d = document.createElement('canvas'); d.width = c.width; d.height = c.height; d.getContext('2d').drawImage(c, 0, 0); return d; }
  function landed(f, key, d) {
    if (B.key !== key) return;
    var cw = f.contentWindow, R = null; try { R = cw.__CAMP_BOARD; } catch (e) { R = null; }
    if (!d.ok || !R || R.err || !R.day || !R.night) { fail((R && R.err) || d.err || 'no board'); return; }
    B.out = { day: copy(R.day), night: copy(R.night), win: R.win, tw: R.tw, th: R.th, dealt: R.dealt, grid: R.grid, sameBoth: R.sameBoth, t: R.t || null, bodies: R.bodies | 0, dead: (ask0(key) || []).map(function (d) { return { x: d.x, y: d.y, st: d.st || 0, side: d.side }; }) };
    B.pitch = { x: R.pitch.x, y: R.pitch.y, w: R.pitch.w, h: R.pitch.h, n: R.pitch.n, score: R.pitch.score, rough: R.pitch.rough, short: R.pitch.short, dead: R.pitch.dead | 0 };
    AR = R.th / R.tw || AR;
    unframe(cw);
    B.state = 'in'; B.ms = Date.now() - B.t0; B.made++;
    tell();
  }
  function unframe(cw) {
    try { if (cw && cw.__fightLetGo) cw.__fightLetGo(); } catch (e) {}   /* RUN's __THE_FIGHT_LETS_GO__: every bitmap and canvas the page made, let go at once */
    try { if (B.frame) B.frame.remove(); } catch (e) {}
    B.frame = null; clearTimeout(B.timer);
    if (B.heard) { try { (B.hw || root).removeEventListener('message', B.heard); } catch (e) {} B.heard = null; }
  }
  function fail(why) { B.state = 'failed'; B.err = String(why || 'failed'); B.ms = Date.now() - B.t0; var cw = null; try { cw = B.frame && B.frame.contentWindow; } catch (e) {} unframe(cw); tell(); }
  function drop() {
    var cw = null; try { cw = B.frame && B.frame.contentWindow; } catch (e) {} unframe(cw);
    for (var k in B.plates) { var P = B.plates[k]; try { if (/^blob:/.test(P.url || '')) URL.revokeObjectURL(P.url); if (/^blob:/.test(P.nurl || '')) URL.revokeObjectURL(P.nurl); } catch (e) {} }
    if (B.out) { [B.out.day, B.out.night].forEach(function (c) { if (c) { c.width = 0; c.height = 0; } }); }
    B.plates = {}; B.making = {}; B.out = null; B.pitch = null; B.state = 'none'; B.key = null;
  }

  /* ---------------------------------------------------------------- the camp's ground, laid under one of CAMP TWO's layouts */
  function at(f) {   /* the board tile at the picture's top left, and the tiles it shows */
    var cx = B.pitch.x + B.pitch.w / 2, cy = B.pitch.y + B.pitch.h / 2;
    return { u0: cx - f.c[0] / f.T, v0: cy - f.c[1] / (f.T * AR), wT: f.PW / f.T, hT: f.PH / (f.T * AR) };
  }
  function composeOne(src, f) {
    var O = B.out, W = O.win, A = at(f), cw = Math.max(1, Math.round(A.wT * O.tw)), ch = Math.max(1, Math.round(A.hT * O.th));
    var c = document.createElement('canvas'); c.width = cw; c.height = ch; var g = c.getContext('2d');
    g.fillStyle = '#2a2219'; g.fillRect(0, 0, cw, ch);   /* the fight's own ground colour where the board would end (the pitch keeps the camp clear of it) */
    g.imageSmoothingEnabled = false;
    g.drawImage(src, Math.round((W.x - A.u0) * O.tw), Math.round((W.y - A.v0) * O.th));
    return c;
  }
  /* the picture as a file the settlement screen's ground loader can read: WebP where the browser writes it, else JPEG (never PNG:
     the slowest of the three to write, measured) */
  function enc(c) { var u = ''; try { u = c.toDataURL('image/webp', 0.92); } catch (e) { u = ''; } if (!/^data:image\/webp/.test(u)) u = c.toDataURL('image/jpeg', 0.93); return u; }
  function keyFor(f) { return (f.tall ? 'T' : 'W') + '|' + f.lift + '|' + Math.round(f.T); }
  function plate(L) {
    if (B.state !== 'in' || !B.out || !L) return null;
    var f = fit(L, B.kit, B.sq); if (!f) return null;
    var k = keyFor(f), P = B.plates[k];
    if (P && P.ready) return P;
    if (!P && !B.making[k]) {
      B.making[k] = true;
      var P2 = B.plates[k] = { key: k, ready: false, px: [f.PW, f.PH], T: f.T, tall: f.tall, lift: f.lift, fit: f };
      /* made at once, in the same beat (measured 11/6 on the phone on its side: an image file written in the background took 6.5 s
         to come back while the camp's clock ran, the glass dark all that time; written here, 0.2 s for both, the board on the glass 2.1 s after HEAL) */
      var t0 = Date.now(), day = composeOne(B.out.day, f), night = composeOne(B.out.night, f);
      P2.w = day.width; P2.h = day.height;
      P2.url = enc(day); P2.nurl = enc(night); day.width = 0; night.width = 0;
      P2.ms = Date.now() - t0; P2.ready = true; delete B.making[k];
      setTimeout(tell, 0);
      return P2;
    }
    /* while it is made: the same shape's last picture (a rise of the upright camp), never the old sand */
    var best = null; for (var q in B.plates) { var R = B.plates[q]; if (R.ready && R.tall === f.tall && (!best || Math.abs(R.lift - f.lift) < Math.abs(best.lift - f.lift))) best = R; }
    return best;
  }
  /* the variant the settlement screen draws (its ground loader reads dir + src: the picture's 'data:' is the dir, the rest the src) */
  function split(u) { var i = u.indexOf(':'); return [u.slice(0, i + 1), u.slice(i + 1)]; }
  function variantOf(P) {
    var a = split(P.url), b = split(P.nurl);
    return { src: a[1], night_src: b[1], dir: a[0], px: P.px.slice(), hotspots: {}, lights: 1, camp2: true, tall: !!P.tall, board: true, boardKey: P.key, lift: P.lift };
  }
  /* the camp the fight at camp stands on its tiles (rule 406(c)): each piece's foot in board tiles, and its size against a tile */
  function handOver(L) {
    if (B.state !== 'in' || !L) return null;
    var f = fit(L, B.kit, B.sq); if (!f) return null;
    var cx = B.pitch.x + B.pitch.w / 2, cy = B.pitch.y + B.pitch.h / 2, th = f.T * AR;
    return { x: B.pitch.x, y: B.pitch.y, w: B.pitch.w, h: B.pitch.h, n: B.pitch.n, k: Math.round((PERSON / ZK) / f.T * 1e6) / 1e6, tall: f.tall,
      pieces: L.pieces.filter(function (p) { return p.kind !== 'slain'; }).map(function (p) { return { sprite: p.sprite, key: p.key, kind: p.kind,
        u: Math.round((cx + (p.x - f.c[0]) / f.T) * 1000) / 1000, v: Math.round((cy + (p.y - f.c[1]) / th) * 1000) / 1000 }; })
        .sort(function (a, b) { return a.v - b.v; }),
      board: B.out.dealt ? B.out.dealt.name : null, sig: B.out.dealt ? B.out.dealt.sig : null, die: B.ask ? B.ask.__deal : null };
  }
  /* rule 406(g): the bodies where they fell, on the camp's picture for one of its layouts (picture px), for the men who go through them */
  function bodies(L) {
    if (B.state !== 'in' || !B.out || !L || !B.out.dead || !B.out.dead.length) return [];
    var f = fit(L, B.kit, B.sq); if (!f) return [];
    var cx = B.pitch.x + B.pitch.w / 2, cy = B.pitch.y + B.pitch.h / 2, th = f.T * AR;
    return B.out.dead.map(function (d, i) { return { i: i, side: d.side, x: Math.round(f.c[0] + (d.x + 0.5 + d.st - cx) * f.T), y: Math.round(f.c[1] + (d.y + 0.9 - cy) * th) }; })
      .filter(function (q) { return q.x > 40 && q.x < f.PW - 40 && q.y > 60 && q.y < f.PH - 20; });
  }
  function state() {
    return { state: B.state, key: B.key, n: B.n, sq: B.sq || null, need: B.need, pitch: B.pitch, ms: B.ms, err: B.err, bakes: B.bakes, made: B.made, opts: B.opts || null,
      board: B.out && B.out.dealt ? { name: B.out.dealt.name, kinds: B.out.dealt.kinds, w: B.out.dealt.w, h: B.out.dealt.h, cols: B.out.dealt.cols, ground: B.out.dealt.ground,
        from: B.out.dealt.from, district: B.out.dealt.district, kind: B.out.dealt.kind, sig: B.out.dealt.sig, laid: !!B.out.dealt.laid, die: B.out.dealt.die } : null,
      win: B.out ? B.out.win : null, tw: B.out ? B.out.tw : null, sameBoth: B.out ? B.out.sameBoth : null, t: B.out ? B.out.t : null,
      fromFight: !!B.fromFight, wantSig: B.wantSig || null, bodies: B.out ? B.out.bodies : 0, dead: B.out && B.out.dead ? B.out.dead.length : 0,
      plates: Object.keys(B.plates).map(function (k) { var P = B.plates[k]; return { key: k, ready: !!P.ready, T: P.T, w: P.w, h: P.h, ms: P.ms }; }) };
  }
  root.BohemiaCampBoard = { want: want, state: state, plate: plate, variantOf: variantOf, handOver: handOver, drop: drop, bodies: bodies, fit: function (L) { return B.kit && B.sq ? fit(L, B.kit, B.sq) : null; },
    onChange: function (fn) { if (typeof fn === 'function' && B.fns.indexOf(fn) < 0) B.fns.push(fn); }, _B: B };
})(typeof window !== 'undefined' ? window : this);
