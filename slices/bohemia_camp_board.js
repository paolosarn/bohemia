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
    if (B.fv && L) return fvFit(L, sq);   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: the fight's own camera, never the camp's own size */
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
    if (B.fv) return fvPick(grid, C);   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: the square on the glass the fight was seen through */
    var p = C.pitchOn(grid, B.sq, B.need); if (!p) return null;
    var N = B.need, cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    var x0 = Math.max(0, Math.floor(cx - N.l - 0.5)), x1 = Math.min(grid.w, Math.ceil(cx + N.r + 0.5));
    var y0 = Math.max(0, Math.floor(cy - N.t - 0.5)), y1 = Math.min(grid.h, Math.ceil(cy + N.b + 0.5));
    p.win = { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) }; p.need = N;
    return p;
  }

  /* ---------------------------------------------------------------- the bake, in a hidden copy of the fight page */
  function keyOf(ask, sq) { return JSON.stringify([ask && ask.at, ask && ask.district, ask && ask.__deal, sq.w, sq.h, ask && ask.sig || null, ask && ask.dead ? ask.dead.length : 0]); }   /* never the hour: the board is baked by day and by night at once */
  /* ==== MOTION 3 __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ (rule 444(a)): THE CAMP'S PAGE WARMED ON THE LOOT SCREEN. Measured on the demo
     (MAKE CAMP after a won fight, the board held on the glass until the camp's first frame): 8.1 s from the camp made to its first frame,
     3.7 s of it the hidden copy of the fight page loading. A won fight's loot screen (the shell) asks warm(): the hidden page is opened
     then with a camp's options that bake nothing (campBoard.warm: its own campBoardBake finds no square and stops, the page loaded and
     idle); the camp's want() takes it (warmTake) and hands it the real options (its boot reads them if it is still loading, or its own
     campBoardBake is run again once it has stopped). A warm page nobody takes is let go (LEAVE, or WARM_MS). window.__CAMP_WARM_OFF = the
     way it was. ==== */
  var WARM_MS = 90000;
  function warmHome() { var home = document; try { if (root.top && root.top !== root && root.top.document && root.top.document.getElementById('cityFrame')) home = root.top.document; } catch (e) { home = document; } return home; }
  function warm() {
    if (root.__CAMP_WARM_OFF || (root.top && root.top.__CAMP_WARM_OFF) || B.warm || B.frame) return false;
    var home = warmHome(), f = home.createElement('iframe'); f.title = 'the camp\'s board'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; f.id = 'campboardframe';
    f.style.cssText = 'position:fixed;left:-12000px;top:0;width:480px;height:320px;border:0;visibility:hidden;pointer-events:none;z-index:-5';
    var W0 = { campBoard: { warm: true }, odds: false, deploy: false }, set = function () { try { var cw = f.contentWindow; if (cw && cw.location && /BOHEMIA_FIGHT/.test(cw.location.href) && !cw.FIGHT_OPTS) cw.FIGHT_OPTS = W0; } catch (e) {} };
    var iv = setInterval(set, 4); f.addEventListener('load', function () { set(); clearInterval(iv); });
    B.warm = { f: f, t0: Date.now(), timer: setTimeout(warmDrop, WARM_MS) }; B.warms = (B.warms | 0) + 1;
    f.src = 'BOHEMIA_FIGHT.html'; (home.body || home.documentElement).appendChild(f);
    return true;
  }
  function warmTake() { var w = B.warm; if (!w || !w.f || !w.f.isConnected) { B.warm = null; return null; } clearTimeout(w.timer); B.warm = null; B.warmTaken = (B.warmTaken | 0) + 1; B.warmAge = Date.now() - w.t0; return w.f; }
  function warmGo(f, opts) {   /* the real options: read by its boot if it is still loading; else its own bake run again */
    var cw = null; try { cw = f.contentWindow; } catch (e) { cw = null; } if (!cw) return;
    var done = false; try { done = cw.__CAMP_BOARD !== undefined; } catch (e) { done = false; }
    try { cw.FIGHT_OPTS = opts; } catch (e) {}
    B.warmWas = done ? 'loaded' : 'loading';
    if (done) { try { cw.__CAMP_BOARD = undefined; cw.campBoardBake(); } catch (e) { fail('the warmed page: ' + (e && e.message || e)); } }
  }
  function warmDrop() { var w = B.warm; B.warm = null; if (!w) return; clearTimeout(w.timer); try { var cw = w.f.contentWindow; if (cw && cw.__fightLetGo) cw.__fightLetGo(); } catch (e) {} try { w.f.remove(); } catch (e) {} B.warmDropped = (B.warmDropped | 0) + 1; }
  /* ==== end (the warm page) ==== */
  function want(ask, plan, kit) {
    var C = CL(); if (!C || !ask || !plan || !kit) return B.state;
    B.kit = kit; B.plan = plan;
    var fv = root.__CAMP_NO_FIGHT_VIEW || (root.parent && root.parent.__CAMP_NO_FIGHT_VIEW) ? null : fvRead(ask);   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: the fight's own camera */
    var sq = C.square(plan), key = keyOf(ask, sq) + (fv ? '|F' + fv.sig : '');
    if (key === B.key && B.state !== 'failed') return B.state;
    drop();
    B.fv = fv; B.fvLay = {}; B.fvSet = {}; B.fvShown = null; B.fvLeft = [];
    B.key = key; B.ask = ask; B.sq = sq; B.n = sq.n; B.need = fv ? {} : reach(plans(plan, kit, sq));
    B.state = 'baking'; B.t0 = Date.now(); B.err = null; B.bakes++;
    var fits = fv ? [] : plans(plan, kit, sq), tmin = fits.length ? Math.min.apply(null, fits.map(function (f) { return f.T; })) : 515;
    /* rule 406(f): a camp made from the end screen takes the fight's own options whole (the very board it was fought on), and its dead */
    var opts = ask.fightOpts ? JSON.parse(JSON.stringify(ask.fightOpts)) : shellOpts(ask);
    if (ask.fightOpts) { if (ask.__deal != null) opts.deal = ask.__deal >>> 0; opts.keep = false; opts.resume = false; opts.odds = false; opts.teach = false; }
    /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: COMBAT TWO's seam (__THE_BOARD_HANDED_WHOLE__): the board the fight ended on, stood again tile for
       tile with no deal at all, when the shell kept it (the same fight, by its fingerprint) */
    if (fv) { try { var T0 = root.top, CF = T0 && T0.__CAMP_FROM_FIGHT; if (CF && CF.sig === ask.sig && CF.boardDef) { opts.boardDef = JSON.parse(JSON.stringify(CF.boardDef)); B.handed = true; } else B.handed = false; } catch (e) { B.handed = false; } }
    var wide = fits.filter(function (f) { return !f.tall; })[0] || fits[0];
    opts.campBoard = { pick: pick, tw: fv ? fvTw(fv) : Math.round(Math.max(200, Math.min(515, tmin))), dead: ask.dead || [],
      manPx: fv ? Math.round(fv.v.man / fv.gw * 1e4) / 1e4 : wide ? Math.round(PERSON / wide.T * 1e4) / 1e4 : 0 };   /* the dead at the fight's own man size */
    B.fromFight = !!ask.fightOpts; B.wantSig = ask.sig || null;
    B.opts = { kind: opts.kind || null, district: opts.district || null, cell: opts.cell || null, night: !!opts.night, deal: opts.deal != null ? opts.deal : null };
    var Wm = warmTake(), f = Wm || document.createElement('iframe');   /* MOTION 3 __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__: the page warmed on the loot screen, if there is one */
    if (!Wm) { f.title = 'the camp\'s board'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; f.id = 'campboardframe';
      f.style.cssText = 'position:fixed;left:-12000px;top:0;width:480px;height:320px;border:0;visibility:hidden;pointer-events:none;z-index:-5'; }
    var mine = key, set = function () { try { var cw = f.contentWindow; if (cw && cw.location && /BOHEMIA_FIGHT/.test(cw.location.href) && (!cw.FIGHT_OPTS || (cw.FIGHT_OPTS.campBoard && cw.FIGHT_OPTS.campBoard.warm))) cw.FIGHT_OPTS = opts; } catch (e) {} };
    var iv = Wm ? 0 : setInterval(set, 4);
    if (!Wm) f.addEventListener('load', function () { set(); clearInterval(iv); });
    B.heard = function (ev) { var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_CAMP_BOARD' || ev.source !== f.contentWindow) return; landed(f, mine, d); };
    /* the page sits where a fight's page sits, beside the map (the shell): the fight finds the map there and lays the board from the
       map's own block (COMBAT TWO's __THE_BOARD_IS_THE_CITY_AT_THAT_SPOT__ asks its parent for #cityFrame); its word comes to the shell */
    var home = document, hw = root; try { if (root.top && root.top !== root && root.top.document && root.top.document.getElementById('cityFrame')) { home = root.top.document; hw = root.top; } } catch (e) { home = document; hw = root; }
    B.hw = hw; hw.addEventListener('message', B.heard);
    B.timer = setTimeout(function () { if (B.key === mine && B.state === 'baking') fail('the board did not come in ' + (WAIT_MS / 1000) + ' s'); }, WAIT_MS);
    B.frame = f;
    if (Wm) { warmGo(f, opts); return B.state; }
    f.src = 'BOHEMIA_FIGHT.html';
    (home.body || home.documentElement).appendChild(f);
    return B.state;
  }
  function ask0(key) { return B.key === key && B.ask ? B.ask.dead : null; }
  function copy(c) { if (!c || !c.width) return null; var d = document.createElement('canvas'); d.width = c.width; d.height = c.height; d.getContext('2d').drawImage(c, 0, 0); return d; }
  function landed(f, key, d) {
    if (B.key !== key) return;
    var cw = f.contentWindow, R = null; try { R = cw.__CAMP_BOARD; } catch (e) { R = null; }
    if (!d.ok || !R || R.err || !R.day || !R.night) { fail((R && R.err) || d.err || 'no board'); return; }
    if (B.fv) { fvLanded(f, key, cw, R); return; }   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__ */
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
    if (B.fv) { var PF = B.plates[L.tall ? 'F|T' : 'F|W']; return PF && PF.ready ? PF : null; }   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: one picture, both ways */
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
    if (B.fv) return bodiesAll().filter(function (q) { return fvSeen(q.x, q.y, 30); });   /* the fight's view: the dead he can see, where they fell */
    return B.out.dead.map(function (d, i) { return { i: i, side: d.side, x: Math.round(f.c[0] + (d.x + 0.5 + d.st - cx) * f.T), y: Math.round(f.c[1] + (d.y + 0.9 - cy) * th) }; })
      .filter(function (q) { return q.x > 40 && q.x < f.PW - 40 && q.y > 60 && q.y < f.PH - 20; });
  }
  /* ==== __THE_CAMP_AFTER_A_FIGHT__ (MOTION 3, 11/9/26, rule 440(e), rule 406(g) AMENDED 11/6; Paolo: 'once you finish a battle and
     you camp there, you actually camp on the combat tiles you were just on, and your company is interacting with their kills or the
     buildings nearby'). The board already knew what stands on it (the fight's own grid, campBoardGrid: 0 a wall, a roof, water, a raised
     tile); nothing used it but the pitch. THE WALLS A MAN CAN LEAN ON: every side of an open tile on the camp's square or the ring one
     tile round it that touches a HOUSE, a 0 tile with 4 or more 0 tiles in the 3 by 3 round it (never a one-tile wall line or a kerb:
     measured on the phone, a man at one read as a man standing in the open; never the board's edge), the more house the better, as the camp's picture shows it (the same mapping as the dead, bodies()
     above), the spot just inside the open tile against that side, and the way he faces so the wall is at his RIGHT HAND (ANIMATION's
     flirt o.wall, the hand up on it, rule 430: the rig's own clip). A wall behind him reads best (N, then W, then S, then E: his back
     to the glass last). ==== */
  var SIDE_COST = { N: 0, W: 0.25, S: 0.5, E: 0.9 }, WALL_FACE = { N: 'W', W: 'S', E: 'N', S: 'E' };
  function walls(L) {
    if (B.state !== 'in' || !B.out || !B.out.grid || !B.pitch || !L) return [];
    var f = fit(L, B.kit, B.sq); if (!f) return [];
    var G = B.out.grid, ok = G.ok || [], P = B.pitch, cx = P.x + P.w / 2, cy = P.y + P.h / 2, th = f.T * AR, out = [];
    var at = function (x, y) { return ok[y] && ok[y][x] != null ? ok[y][x] : 0; };
    var SIDES = [[0, -1, 'N'], [-1, 0, 'W'], [1, 0, 'E'], [0, 1, 'S']];
    /* how much house stands behind a wall tile: its 0 tiles in the 3 by 3 round it (a block of a house 7 to 9, a one-tile wall line 3) */
    var mass = function (x, y) { var n = 0; for (var j = -1; j <= 1; j++) for (var i = -1; i <= 1; i++) if (at(x + i, y + j) === 0 && x + i >= 0 && y + j >= 0 && x + i < G.w && y + j < G.h) n++; return n; };
    var RG = B.fv ? 2 : 1;   /* the fight's view: a tile is a house and a man stands taller than one, so the houses two tiles out are his neighbours */
    for (var y = P.y - RG; y < P.y + P.h + RG; y++) for (var x = P.x - RG; x < P.x + P.w + RG; x++) {   /* the camp's tiles and the ring one tile round them */
      if (x < 0 || y < 0 || x >= G.w || y >= G.h || !at(x, y)) continue;
      for (var k = 0; k < 4; k++) {
        var d = SIDES[k], wx = x + d[0], wy = y + d[1];
        if (wx < 0 || wy < 0 || wx >= G.w || wy >= G.h || at(wx, wy) !== 0) continue;
        var u = x + 0.5 + d[0] * 0.3, v = y + 0.62 + d[1] * 0.28;
        var px = f.c[0] + (u - cx) * f.T, py = f.c[1] + (v - cy) * th;
        if (B.fv) { if ((B.fv.r0 || 0) > 0.01 || !fvOk(x, y)) continue; var pS = fvPicS(u, v); px = pS[0]; py = pS[1]; }   /* the fight's view: a house's wall beside the camp's own ground (no house stands on a deck) */
        if (B.fv ? !fvSeen(px, py, 40) : (px < 40 || px > f.PW - 40 || py < 80 || py > f.PH - 30)) continue;   /* on the camp's picture, as the dead are (the fight's view: on the glass) */
        var ms = mass(wx, wy), roof = !!(B.fv && B.fv.roof && B.fv.roof[wy] && B.fv.roof[wy][wx]); if (ms < 4 && !roof) continue;   /* the fight's view: one roof tile is one house */   /* a house, never a one-tile wall line or a kerb (measured: a man at a 1-wide raised line read as a man standing in the open) */
        out.push({ x: Math.round(px), y: Math.round(py), face: WALL_FACE[d[2]], side: d[2], tile: [x, y], wall: [wx, wy], mass: ms, roof: roof,
          cost: Math.abs(x + 0.5 - cx) + Math.abs(y + 0.5 - cy) + SIDE_COST[d[2]] - 0.15 * ms - (roof ? 0.6 : 0) });
      }
    }
    return out.sort(function (a, b) { return a.cost - b.cost; });
  }
  /* ==== end __THE_CAMP_AFTER_A_FIGHT__ ==== */
  /* ==== __THE_CAMP_IS_THE_FIGHTS_BOARD__ (MOTION 3, 11/10/26, rule 442(a) and 441; Paolo voted NO on 11/9l: 'This did not look like it
     was on the combat map'). MEASURED (the demo, phone upright, a suburb fight won, MAKE CAMP): the fight showed its whole street, a
     tile 44 px on the glass and a man 56 px; the camp opened on one tile drawn 1,122 picture px wide (a tile 488 px on the glass, from
     a 231 px picture: a blur of asphalt) with the same 56 px men: eleven times closer on the ground than the fight, no house on it.
     NOW A CAMP MADE OFF A FIGHT IS THE FIGHT'S OWN VIEW: the shell keeps the camera the fight was seen through at its last moment
     (its zoom, where the board stood on the glass, a man's height; campFromFightKeep, read through the fight page's own globals),
     and this file draws the camp's ground as that view: the board baked by the fight's own bake with the same options and die (the
     same tiles, the same houses, the dead where they fell at the fight's man size), the map round it by the fight's own ringCanvas
     (the same blocks the fight showed past the board's edge, its night by the fight's own nightPass), cut on a square round the
     glass's middle (the glass both ways: a turn shows the same board), so the settlement's camera puts every tile where the fight
     had it: a tile the same size on the glass, a man the same height. The camp's square is pitched ON THE GLASS (its tiles on what
     the fight showed, clear of the bars and the phone, by the dead), the fire on it, the camp's pieces at the men's size packed on
     the open ground round it (never on a house, a wall or water: the board's own grid), his men started where they stood when the
     fight ended. window.__CAMP_NO_FIGHT_VIEW = the old way. COMBAT TWO's files are read, never changed. ==== */
  var FV_KEY = 'bohemia.camp.fightview.v1', FV_IMG = 1800, FV_DPR = 2.25, FV_RING_TW = 160, FV_GROUND = '#0d0b09', FV_PACK = 0.5;
  function fvRead(ask) {
    if (!ask || !ask.fightOpts || !ask.sig) return null;
    var c = null; try { var T = root.top; c = T && T.__CAMP_FROM_FIGHT && T.__CAMP_FROM_FIGHT.sig === ask.sig && T.__CAMP_FROM_FIGHT.view ? T.__CAMP_FROM_FIGHT : null; } catch (e) { c = null; }
    if (!c) { try { var j = JSON.parse(localStorage.getItem(FV_KEY) || 'null'); if (j && j.sig === ask.sig && j.view) c = j; } catch (e) { c = null; } }   /* a camp opened again after a reload */
    var v = c && c.view; if (!v || !(v.z > 0) || !(v.man > 0) || !(v.tw > 0) || !(v.th > 0) || !(v.W > 0) || !(v.H > 0)) return null;
    return fvGeom(v, c.men || [], ask.sig);
  }
  function fvGeom(v, men, sig) {
    /* the square round the middle of the phone's whole glass (in the fight frame's px), as wide as the glass is long: either way he
       holds the phone, and whatever part of it the fight's frame took (measured: on its side the fight's frame was once 680 of 844) */
    var gW = v.gW > 0 ? v.gW : v.W, gH = v.gH > 0 ? v.gH : v.H, S = Math.max(v.W, v.H, gW, gH);
    var gw = v.tw * v.z, gh = v.th * v.z, q = PERSON / v.man, ox0 = gW / 2 - (v.fx || 0) - S / 2, oy0 = gH / 2 - (v.fy || 0) - S / 2;
    return { v: v, men: men, sig: String(sig || ''), gw: gw, gh: gh, S: S, q: q, ox0: ox0, oy0: oy0, T: gw * q, PW: Math.round(S * q), PH: Math.round(S * q),
      rhoT: Math.min(FV_DPR, FV_IMG / S), rho: 1,
      u0: (ox0 - v.sx0) / gw, v0: (oy0 - v.sy0) / gh, wT: S / gw, hT: S / gh };   /* the square's top left in tiles, and the tiles it shows */
  }
  function fvTw(F) { return Math.round(Math.max(160, Math.min(515, F.gw * F.rhoT))); }   /* the bake no sharper than the picture it makes */
  function fvPic(u, w) { var F = B.fv; return [(F.v.sx0 + u * F.gw - F.ox0) * F.q, (F.v.sy0 + w * F.gh - F.oy0) * F.q]; }
  function fvTile(x, y) { var F = B.fv; return [(x / F.q + F.ox0 - F.v.sx0) / F.gw, (y / F.q + F.oy0 - F.v.sy0) / F.gh]; }
  /* what the camp's own screen shows of that glass, in the fight's css px: the fight's glass cut to the camp screen's scene (on a phone on
     its side the camp screen keeps a band of its own under its scene: measured, 80 px of a 390 px glass) */
  function fvShown() {
    var now = root.performance ? performance.now() : Date.now(); if (B.fvShown && now - B.fvShownAt < 300) return B.fvShown;   /* read once a beat at most: the placing asks it thousands of times */
    B.fvShown = fvShownNow(); B.fvShownAt = now; return B.fvShown;
  }
  function fvShownNow() {
    var F = B.fv, v = F.v, r = { l: 0, t: 0, r: v.W, b: v.H };
    try { var sc = document.getElementById('scene'); if (sc) { var q = sc.getBoundingClientRect(), x = 0, y = 0, w = root;
      while (w && w !== w.top && w.frameElement) { var e = w.frameElement.getBoundingClientRect(); x += e.left; y += e.top; w = w.parent; }
      if (q.width > 40 && q.height > 40) r = { l: Math.max(0, x + q.left - v.fx), t: Math.max(0, y + q.top - v.fy), r: Math.min(v.W, x + q.right - v.fx), b: Math.min(v.H, y + q.bottom - v.fy) }; } } catch (e) {}
    return r;
  }
  /* the glass the fight was seen through, as the camp's screen shows it, in the camp's picture px (and the phone on it) */
  function fvGlass() {
    var F = B.fv, v = F.v, sh = fvShown(), g = { x0: (sh.l - F.ox0) * F.q, y0: (sh.t - F.oy0) * F.q, x1: (sh.r - F.ox0) * F.q, y1: (sh.b - F.oy0) * F.q, ph: null };
    if (v.phone) g.ph = { l: (v.phone.l - F.ox0) * F.q, t: (v.phone.t - F.oy0) * F.q, r: (v.phone.r - F.ox0) * F.q, b: (v.phone.b - F.oy0) * F.q };
    return g;
  }
  function fvSeen(x, y, m) {
    var g = fvGlass(), top = 70 * B.fv.q;   /* clear of the bar on the glass's top */
    if (x < g.x0 + m || x > g.x1 - m || y < g.y0 + top || y > g.y1 - m) return false;
    return !(g.ph && x > g.ph.l - m && x < g.ph.r + m && y > g.ph.t - m * 1.5);
  }
  function fvFit(L, sq) {
    var F = B.fv, P = B.pitch, c = P ? fvPic(P.x + P.w / 2, P.y + P.h / 2) : [F.PW / 2, F.PH / 2];
    return { T: F.T, c: c, PW: F.PW, PH: F.PH, feet: null, sq: sq || B.sq, tall: !!(L && L.tall), lift: 0, fv: true };
  }
  /* the camp's square on what the fight showed: a tile whose middle is on the glass, clear of its edges, the bar and the phone; by the dead */
  function fvPick(grid, C) {
    var F = B.fv, v = F.v, ph = v.phone, m = [], sh = fvShown();
    /* which of the board's never-tiles are a building's roof (the fight's own isRoof): on the fight's scale one tile is one house */
    try { var cw0 = B.frame && B.frame.contentWindow, Fo = cw0 ? cw0.eval('typeof FIGHT!=="undefined"?FIGHT:null') : null, rz = cw0 && typeof cw0.riseAt === 'function' ? cw0.riseAt : null; F.roof = []; F.lv = []; F.rise = [];
      for (var yy = 0; yy < grid.h; yy++) { var rr = [], ll = [], zz = []; for (var xx = 0; xx < grid.w; xx++) { rr.push(Fo && Fo.isRoof && Fo.isRoof(xx, yy) ? 1 : 0); ll.push(Fo && Fo.level ? Fo.level(xx, yy) | 0 : 0); zz.push(rz ? +rz(xx, yy) || 0 : 0); } F.roof.push(rr); F.lv.push(ll); F.rise.push(zz); } } catch (e) { F.roof = null; F.lv = null; F.rise = null; }   /* the fight's own riseAt: a man on a roof stands that much higher */
    /* THE GROUND THEY FOUGHT ON: CAMP THREE's grid keeps a camp off every raised tile; a fight fought on a raised road (the freeway's
       deck) has only that under the glass, so on the fight's view a raised tile a man walks on that is no roof (a deck, a rise of
       ground) is ground too, at its own height (measured: on the freeway on its side the fire found no open ground on the glass) */
    F.okS = grid.ok.map(function (row, y) { return row.map(function (o, x) { if (o) return o;
      try { if (Fo && Fo._t && Fo._t.passable(x, y) && Fo.rowAt(x, y) !== 'obstacles' && !(F.roof && F.roof[y][x]) && F.lv && F.lv[y][x] > 0) return Fo.S.cover && Fo.S.cover[y] && Fo.S.cover[y][x] ? 1 : 2; } catch (e) {}
      return 0; }); });
    for (var y = 0; y < grid.h; y++) { var r = []; for (var x = 0; x < grid.w; x++) {
      var gx = v.sx0 + (x + 0.5) * F.gw, gy = v.sy0 + (y + 0.62) * F.gh;
      var sw = sh.r - sh.l, shh = sh.b - sh.t;
      var on = gx > sh.l + sw * 0.12 && gx < sh.r - sw * 0.12 && gy > sh.t + Math.max(90, shh * 0.16) && gy < sh.b - shh * 0.16 && !(ph && gx > ph.l - 24 && gx < ph.r + 24 && gy > ph.t - 40);
      r.push(on && F.okS[y] ? F.okS[y][x] : 0); } m.push(r); }
    /* first where a house of the fight stands two tiles off or nearer (a man leans on it), then anywhere on the glass, then anywhere */
    var m2 = F.roof ? m.map(function (r, y) { return r.map(function (o, x) { if (!o) return 0;
      for (var j = -2; j <= 2; j++) for (var i = -2; i <= 2; i++) if (F.roof[y + j] && F.roof[y + j][x + i]) return o; return 0; }); }) : null;
    /* where the dead lie first (CAMP THREE's rule 406(f)(g)): a square by a house only when it is as near the dead as the best on the glass */
    var pA = m2 ? C.pitchOn(Object.assign({}, grid, { ok: m2 }), B.sq, {}) : null, pB = C.pitchOn(Object.assign({}, grid, { ok: m }), B.sq, {});
    var p = (pA && (!pB || (pA.dead | 0) >= (pB.dead | 0)) ? pA : pB) || C.pitchOn(Object.assign({}, grid, { ok: F.okS }), B.sq, {}); if (!p) return null;
    F.r0 = F.rise && F.rise[p.y] ? +F.rise[p.y][p.x] || 0 : 0;   /* the camp stands on its square's own height */
    var x0 = Math.max(0, Math.floor(F.u0)), y0 = Math.max(0, Math.floor(F.v0)), x1 = Math.min(grid.w, Math.ceil(F.u0 + F.wT)), y1 = Math.min(grid.h, Math.ceil(F.v0 + F.hT));
    p.win = { x: Math.min(x0, grid.w - 1), y: Math.min(y0, grid.h - 1), w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) }; p.need = {}; p.fv = true;
    return p;
  }
  /* the map round the board as the fight drew it (its own ringCanvas, the light asked for, at the fight's own ring size) */
  function fvRing(cw, night) {
    var Fo = null, U = null, K = null;
    try { Fo = cw.eval('typeof FIGHT!=="undefined"?FIGHT:null'); U = cw.FIGHT_UI; K = cw.eval('[DB.ground.block_tiles, SURROUND_BLOCKS, RING_K]'); } catch (e) { return null; }
    if (!Fo || !Fo.S || !U || !K || typeof cw.ringCanvas !== 'function') return null;
    var keep = { n: Fo.S.night, tw: U.tw, th: U.th, c: U.ringC, k: U.ringCKey };
    try {
      Fo.S.night = !!night; U.th = FV_RING_TW * keep.th / keep.tw; U.tw = FV_RING_TW; U.ringC = null; U.ringCKey = null;
      var c = cw.ringCanvas(); if (!c || !c.width) return null;
      return { c: c, bt: K[0], R: K[1], kx: U.tw * K[2], ky: U.th * K[2] };
    } catch (e) { return null; }
    finally { Fo.S.night = keep.n; U.tw = keep.tw; U.th = keep.th; U.ringC = null; U.ringCKey = null; }
  }
  function fvCompose(win, ring) {
    var F = B.fv, v = F.v, rho = F.rho, n = Math.max(1, Math.round(F.S * rho)), O = B.out.win;
    var c = document.createElement('canvas'); c.width = n; c.height = n; var g = c.getContext('2d');
    g.fillStyle = FV_GROUND; g.fillRect(0, 0, n, n);   /* past the map's ring: the fight's own dark (it never shows on a fight's glass) */
    var X = function (u) { return (v.sx0 + u * F.gw - F.ox0) * rho; }, Y = function (w) { return (v.sy0 + w * F.gh - F.oy0) * rho; };
    g.imageSmoothingEnabled = true; try { g.imageSmoothingQuality = 'high'; } catch (e) {}
    if (ring && ring.c) { var r0 = -ring.R * ring.bt; g.drawImage(ring.c, X(r0), Y(r0), ring.c.width / ring.kx * F.gw * rho, ring.c.height / ring.ky * F.gh * rho); }
    g.drawImage(win, X(O.x), Y(O.y), O.w * F.gw * rho, O.h * F.gh * rho);
    return c;
  }
  var FV_TYPE = null;
  function fvType() { if (FV_TYPE) return FV_TYPE; try { var t = document.createElement('canvas'); t.width = t.height = 1; FV_TYPE = /^data:image\/webp/.test(t.toDataURL('image/webp')) ? 'image/webp' : 'image/jpeg'; } catch (e) { FV_TYPE = 'image/jpeg'; } return FV_TYPE; }
  function fvBlob(c, done) {   /* written off the main thread where the browser can (a picture the size of the glass, never a stall) */
    try { c.toBlob(function (b) { done(b ? URL.createObjectURL(b) : enc(c)); }, fvType(), 0.9); } catch (e) { done(enc(c)); }
  }
  /* the board landed: the two pictures made a step at a time (each step one short task, never a stall over half a second) */
  function fvLanded(f, key, cw, R) {
    var F = B.fv, t0 = Date.now(), step = function (fn) { setTimeout(function () { if (B.key !== key) return; try { fn(); } catch (e) { fail('the fight\'s view: ' + (e && e.message || e)); } }, 0); };
    B.out = { day: null, night: null, win: R.win, tw: R.tw, th: R.th, dealt: R.dealt, grid: R.grid, sameBoth: R.sameBoth, t: R.t || null, bodies: R.bodies | 0, fv: true,
      dead: (ask0(key) || []).map(function (d) { return { x: d.x, y: d.y, st: d.st || 0, side: d.side }; }) };
    B.pitch = { x: R.pitch.x, y: R.pitch.y, w: R.pitch.w, h: R.pitch.h, n: R.pitch.n, score: R.pitch.score, rough: R.pitch.rough, short: R.pitch.short, dead: R.pitch.dead | 0 };
    AR = R.th / R.tw || AR;
    F.rho = Math.min(F.rhoT, Math.max(1, R.tw / F.gw));
    B.state = 'composing';
    var pics = {}, rings = {};
    /* MOTION 3 __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ (rule 444(a)): the light the camp stands in now first, its picture written and the
       camp in on it (he watches the set-up while the other light is made); the other light after, laid on the same plate when written */
    var nightNow = false; try { nightNow = !!(B.ask && B.ask.fightOpts && B.ask.fightOpts.night); } catch (e) {}
    var A1 = nightNow ? 'night' : 'day', A2 = nightNow ? 'day' : 'night', first = root.__CAMP_BOTH_LIGHTS_FIRST ? null : A1;
    var plate = function (u1, u2, both) {
      var n = (pics[A1] || pics[A2]).width;
      var P = { key: both ? 'F|W+' : 'F|W', ready: true, url: A1 === 'day' ? u1 : u2, nurl: A1 === 'day' ? u2 : u1, px: [F.PW, F.PH], T: F.T, tall: false, lift: 0, w: n, h: n, ms: Date.now() - t0, fv: true };
      B.plates['F|W'] = P; B.plates['F|T'] = Object.assign({}, P, { key: both ? 'F|T+' : 'F|T', tall: true });   /* both lights: a new key, so the screen takes the night's own picture */
    };
    step(function () { rings[A1] = fvRing(cw, A1 === 'night'); pics[A1] = fvCompose(R[A1], rings[A1]); if (rings[A1]) rings[A1].c.width = 0;
      var then = function (u1) {
        step(function () { rings[A2] = fvRing(cw, A2 === 'night'); pics[A2] = fvCompose(R[A2], rings[A2]); if (rings[A2]) rings[A2].c.width = 0;
          F.ringed = !!(rings.day && rings.night); F.composeMs = Date.now() - t0;
          unframe(cw);   /* the hidden page and every picture it made, let go */
          fvBlob(pics[A2], function (u2) {
            if (B.key !== key) { try { URL.revokeObjectURL(u2); if (u1) URL.revokeObjectURL(u1); } catch (e) {} return; }
            if (!u1) { fvBlob(pics[A1], function (u1b) { if (B.key !== key) return; plate(u1b, u2, false); pics[A1].width = 0; pics[A2].width = 0; B.state = 'in'; B.ms = Date.now() - B.t0; B.made++; tell(); }); return; }
            plate(u1, u2, true); pics[A1].width = 0; pics[A2].width = 0; B.bothAt = Date.now() - B.t0; tell(); });
        });
      };
      if (!first) { then(null); return; }
      fvBlob(pics[A1], function (u1) {   /* the light he stands in, on the glass now; the other light's own picture stands in for it until written */
        if (B.key !== key) { try { URL.revokeObjectURL(u1); } catch (e) {} return; }
        plate(u1, u1, false); B.state = 'in'; B.ms = Date.now() - B.t0; B.firstLight = A1; B.made++; tell();
        then(u1);
      });
    });
  }
  /* ---- the camp on the board's own ground: what stands where (the board's grid: 2 open, 1 cover on it, 0 never) */
  function fvR(u, w) { var Z = B.fv && B.fv.rise; return Z && Z[w] ? +Z[w][u] || 0 : 0; }
  function fvOk(u, w) {   /* open ground of the camp's own height (the fight's view): 2 open, 1 cover on it, 0 never */
    var G = B.out && B.out.grid, F = B.fv; if (!G || u < 0 || w < 0 || u >= G.w || w >= G.h) return 0;
    var ok = F && F.okS ? F.okS : G.ok, o = ok[w] ? ok[w][u] | 0 : 0; if (!o) return 0;
    return Math.abs(fvR(u, w) - ((F && F.r0) || 0)) < 0.01 ? o : 0; }
  function fvPicS(u, w) { return fvPic(u, w - ((B.fv && B.fv.r0) || 0)); }   /* a point of the camp's own ground, at its height */
  function fvTileS(x, y) { var t = fvTile(x, y); return [t[0], t[1] + ((B.fv && B.fv.r0) || 0)]; }
  function fvClear(r, strict) {   /* a footprint (picture px) on the board's open ground, every tile of it */
    var a = fvTileS(r[0], r[1]), b = fvTileS(r[2], r[3]);
    for (var w = Math.floor(a[1]); w <= Math.floor(b[1] - 1e-6); w++) for (var u = Math.floor(a[0]); u <= Math.floor(b[0] - 1e-6); u++) { var o = fvOk(u, w); if (!o || (strict && o !== 2)) return false; }
    return true;
  }
  function hit(a, b, m) { return a[0] < b[2] + m && a[2] > b[0] - m && a[1] < b[3] + m && a[3] > b[1] - m; }
  function fvFoot(p) {   /* a piece's footprint on the picture at the men's size (the camp's walk reads the same) */
    var z = PERSON / ZK, ppm = (B.kit && B.kit.ppm) || 57, mx = ppm * z, my = ppm * 0.7071 * z, f = footOf(p, B.kit);
    return [f[0] * mx, -f[3] * my, f[2] * mx, -f[1] * my];
  }
  /* the nearest spot to (x, y) where the footprint stands clear: on open ground, off every rect taken, on the glass when it can be */
  function fvNear(x, y, d, taken, strict, R) {
    var at = function (px, py, glass, st) { var r = [px + d[0], py + d[1], px + d[2], py + d[3]];
      if (glass && !fvSeen(px, py, 24)) return null; if (!fvClear(r, st)) return null;
      for (var i = 0; i < taken.length; i++) if (hit(r, taken[i], 6)) return null; return r; };
    var tries = [[true, strict], [true, false], [false, false]];
    for (var k = 0; k < tries.length; k++) {
      for (var rr = 0; rr <= (R || 420); rr += 12) {
        var n = rr ? Math.max(8, Math.round(2 * Math.PI * rr / 14)) : 1;
        for (var j = 0; j < n; j++) { var a = j / n * 2 * Math.PI, px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.75, r = at(px, py, tries[k][0], tries[k][1]); if (r) return { x: Math.round(px), y: Math.round(py), r: r }; }
      }
    }
    return { x: Math.round(x), y: Math.round(y), r: [x + d[0], y + d[1], x + d[2], y + d[3]], none: true };   /* nowhere clear: said (none), never laid on a house */
  }
  function fvDeadRects() { return bodiesAll().map(function (q) { return [q.x - 44, q.y - 16, q.x + 44, q.y + 10]; }); }
  function bodiesAll() {
    if (!B.out || !B.out.dead || !B.pitch) return [];
    return B.out.dead.map(function (d, i) { var p = fvPic(d.x + 0.5 + (d.st || 0), d.y + 0.9 - fvR(d.x, d.y)); return { i: i, side: d.side, x: Math.round(p[0]), y: Math.round(p[1]) }; });   /* each where he fell, at its height */
  }
  /* CAMP TWO's camp laid on the board: the fire on the camp's square, every other piece at the men's size, packed on the open ground
     round it a half of its own spread, the nearest clear spot (strict first: no cover under a tent), the slain left out (his dead are
     the board's own) */
  function onBoard(L) {
    if (!B.fv || B.state !== 'in' || !B.pitch || !L || L.fv) return L;
    var k = (L.tall ? 'T|' : 'W|') + L.pieces.map(function (p) { return p.key; }).join(',');
    if (!B.fvLay[k]) {
      var P = B.pitch, fc = fvPicS(P.x + P.w / 2, P.y + P.h * 0.62), f0 = L.fire, taken = fvDeadRects().concat(fromFight().map(function (m) { return [m.x - 26, m.y - 12, m.x + 26, m.y + 8]; })), out = [];   /* never on the dead, never under a man where he stood */
      var pieces = L.pieces.filter(function (p) { return p.kind !== 'slain'; }).map(function (p) { return Object.assign({}, p); });
      var rank = { fire: 0, tent: 1, carrier: 2, supplies: 3, seats: 4, follower: 5 };
      pieces.sort(function (a, b) { return (rank[a.kind] || 6) - (rank[b.kind] || 6) || Math.hypot(a.x - f0.x, a.y - f0.y) - Math.hypot(b.x - f0.x, b.y - f0.y); });
      pieces.forEach(function (p) {
        var d = fvFoot(p), s = p.kind === 'fire' ? fvNear(fc[0], fc[1], d, taken, true, 380) : fvNear(fc[0] + (p.x - f0.x) * FV_PACK, fc[1] + (p.y - f0.y) * FV_PACK, d, taken, p.kind === 'tent' || p.kind === 'carrier');
        /* MOTION 3 __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ (rule 444(b), Paolo 11/10: 'never putting any of our camp shit on top of any
           buildings'): a piece with no open ground clear for it is left out (counted in B.fvLeft), never laid on a house, a roof or a wall */
        if (s.none) s = fvNear(s.x, s.y, p.kind === 'fire' ? [-8, -4, 8, 3] : d, taken, false, 1200);   /* farther out on the board before it is left out */
        if (s.none && p.kind === 'fire') s = fvNear(fc[0], fc[1], [-4, -2, 4, 2], [], false, 2400);   /* the fire on open ground, wherever that is */
        if (s.none) { B.fvLeft = (B.fvLeft || []).concat([p.key]); return; }
        p.x = s.x; p.y = s.y; taken.push(s.r); out.push(p); });
      var fire = out.filter(function (p) { return p.kind === 'fire'; })[0] || { x: fc[0], y: fc[1] };
      B.fvLay[k] = { pieces: out, fire: { x: fire.x, y: fire.y } };
    }
    var M = B.fvLay[k];
    return Object.assign({}, L, { pieces: M.pieces.map(function (p) { return Object.assign({}, p); }), fire: { x: M.fire.x, y: M.fire.y }, pic: { w: B.fv.PW, h: B.fv.PH }, lift: 0, fv: true });
  }
  /* every man's spot on the open ground: the watch brought in to the camp's edge (the camp's own edges are a whole street off on the
     fight's scale), every spot off the pieces, the dead and each other; a man at a wall stays at his wall */
  function settle(P, L, A) {
    if (!B.fv || !L || !L.fv || !P) return P;
    var taken = L.pieces.map(function (p) { var d = fvFoot(p); return [p.x + d[0], p.y + d[1], p.x + d[2], p.y + d[3]]; }), dead = fvDeadRects(), out = {}, f = L.fire;
    (A || []).slice().sort(function (a, b) { return (a.act === 'lean' ? 0 : 1) - (b.act === 'lean' ? 0 : 1); }).forEach(function (e) {
      var sp = P[e.i]; if (!sp) return; var q = Object.assign({}, sp);
      if (e.act === 'lean') { out[e.i] = q; taken.push([q.x - 18, q.y - 8, q.x + 18, q.y + 4]); return; }
      if (e.act === 'watch') { q.x = f.x + (q.x - f.x) * 0.42; q.y = f.y + (q.y - f.y) * 0.42; }
      var lying = e.act === 'lie' || e.act === 'sleep', d = lying ? [-62, -14, 62, 6] : [-18, -8, 18, 4];
      var t2 = e.act === 'loot' ? taken : taken.concat(dead);   /* a man going through a body kneels at it; nobody else stands on the dead */
      var s = fvNear(q.x, q.y, d, t2, false, 300);
      if (s.none) s = fvNear(q.x, q.y, [-6, -3, 6, 2], [], false, 900);   /* __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ (rule 444(b)): crowded, he still stands on open ground, never on a house */
      q.x = s.x; q.y = s.y; out[e.i] = q; taken.push(s.r); });
    return out;
  }
  /* what a man walks round on the fight's view: every house, wall and pool of the board on the picture, and the board's edge */
  function houses() {
    if (!B.fv || !B.out || !B.out.grid) return [];
    var F = B.fv, G = B.out.grid, out = [];
    var u0 = Math.max(0, Math.floor(F.u0)), w0 = Math.max(0, Math.floor(F.v0)), u1 = Math.min(G.w, Math.ceil(F.u0 + F.wT)), w1 = Math.min(G.h, Math.ceil(F.v0 + F.hT));
    var stood = {}; (F.men || []).forEach(function (m) { stood[m.x + ',' + m.y] = 1; });   /* a man who ended the fight on a roof climbs down from where he stood */
    for (var w = w0; w < w1; w++) for (var u = u0; u < u1; u++) if (!fvOk(u, w) && !stood[u + ',' + w]) { var a = fvPicS(u, w), b = fvPicS(u + 1, w + 1); out.push([Math.round(a[0]), Math.round(a[1]), Math.round(b[0]), Math.round(b[1])]); }
    var A = fvPicS(0, 0), Z = fvPicS(G.w, G.h), BIG = 1e5;
    out.push([-BIG, -BIG, BIG, Math.round(A[1])], [-BIG, Math.round(Z[1]), BIG, BIG], [-BIG, -BIG, Math.round(A[0]), BIG], [Math.round(Z[0]), -BIG, BIG, BIG]);
    return out;
  }
  /* where each of his men stood when the fight ended, on the picture (the pitch walks him from there to his place) */
  function fromFight() {
    if (!B.fv || !B.fv.men) return [];
    var Z = B.fv.rise;
    return B.fv.men.map(function (m) { var up = Z && Z[m.y] ? +Z[m.y][m.x] || 0 : 0, p = fvPic(m.x + 0.5, m.y + 0.9 - up); return { name: m.name, main: !!m.main, x: Math.round(p[0]), y: Math.round(p[1]), tile: [m.x, m.y], up: up }; });
  }
  function fvOn() { return !!(B.fv && B.state === 'in' && B.out && B.out.fv); }
  function fvState() {
    if (!B.fv) return null; var F = B.fv;
    return { on: fvOn(), sig: F.sig, z: F.v.z, gw: Math.round(F.gw * 100) / 100, gh: Math.round(F.gh * 100) / 100, man: Math.round(F.v.man * 10) / 10, q: Math.round(F.q * 1e4) / 1e4, T: Math.round(F.T * 10) / 10,
      handed: !!B.handed, r0: F.r0 || 0, okS: F.okS || null, S: F.S, PW: F.PW, PH: F.PH, ox0: F.ox0, oy0: F.oy0, rho: Math.round(F.rho * 100) / 100, W: F.v.W, H: F.v.H, sx0: F.v.sx0, sy0: F.v.sy0, fx: F.v.fx, fy: F.v.fy, ringed: !!F.ringed, composeMs: F.composeMs || null,
      glass: fvGlass(), men: fromFight(), left: B.fvLeft || [], warm: { taken: B.warmTaken | 0, was: B.warmWas || null, age: B.warmAge || null, made: B.warms | 0, dropped: B.warmDropped | 0 }, bothAt: B.bothAt || null };
  }
  /* MOTION 3 __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ (rule 444(b)): where the camp stands, tile by tile (the gate's read, nothing drawn):
     every piece's footprint and every man's feet on the board's tiles, and what each tile is: open ground of the camp's height (the
     fight's own grid: 2 open, 1 cover on it), or a house (a roof), a wall, water or a drop (0). pieces: [{ key, kind, sprite, x, y }],
     men: [{ name, x, y, act }] in the camp's picture px */
  function fvWhere(pieces, men) {
    if (!B.fv || !B.out || !B.out.grid) return null; var F = B.fv, out = [];
    var tileInfo = function (u, w) { var roof = !!(F.roof && F.roof[w] && F.roof[w][u]); return { t: [u, w], ok: fvOk(u, w), roof: roof }; };
    (pieces || []).forEach(function (p) { if (p.kind === 'slain') return; var d = fvFoot(p), a = fvTileS(p.x + d[0], p.y + d[1]), b = fvTileS(p.x + d[2], p.y + d[3]), tiles = [];
      for (var w = Math.floor(a[1]); w <= Math.floor(b[1] - 1e-6); w++) for (var u = Math.floor(a[0]); u <= Math.floor(b[0] - 1e-6); u++) tiles.push(tileInfo(u, w));
      out.push({ what: 'piece', key: p.key, kind: p.kind, tiles: tiles, open: tiles.length > 0 && tiles.every(function (q) { return q.ok > 0 && !q.roof; }) }); });
    (men || []).forEach(function (m) { if (m.act === 'lean') { var t0 = fvTileS(m.x, m.y + 4), q0 = tileInfo(Math.floor(t0[0]), Math.floor(t0[1])); out.push({ what: 'man', key: m.name, act: m.act, tiles: [q0], open: q0.ok > 0 && !q0.roof }); return; }
      var t = fvTileS(m.x, m.y), q = tileInfo(Math.floor(t[0]), Math.floor(t[1])); out.push({ what: 'man', key: m.name, act: m.act, tiles: [q], open: q.ok > 0 && !q.roof }); });
    return out;
  }
  /* ==== end __THE_CAMP_IS_THE_FIGHTS_BOARD__ ==== */
  function state() {
    return { state: B.state, key: B.key, n: B.n, sq: B.sq || null, need: B.need, pitch: B.pitch, ms: B.ms, err: B.err, bakes: B.bakes, made: B.made, opts: B.opts || null, t: B.out ? B.out.t : null,   /* FIXES 11/10: the bake page's own clock and its steps (read only) */
      board: B.out && B.out.dealt ? { name: B.out.dealt.name, kinds: B.out.dealt.kinds, w: B.out.dealt.w, h: B.out.dealt.h, cols: B.out.dealt.cols, ground: B.out.dealt.ground,
        from: B.out.dealt.from, district: B.out.dealt.district, kind: B.out.dealt.kind, sig: B.out.dealt.sig, laid: !!B.out.dealt.laid, die: B.out.dealt.die } : null,
      win: B.out ? B.out.win : null, tw: B.out ? B.out.tw : null, sameBoth: B.out ? B.out.sameBoth : null, t: B.out ? B.out.t : null,
      fromFight: !!B.fromFight, wantSig: B.wantSig || null, bodies: B.out ? B.out.bodies : 0, dead: B.out && B.out.dead ? B.out.dead.length : 0,
      plates: Object.keys(B.plates).map(function (k) { var P = B.plates[k]; return { key: k, ready: !!P.ready, T: P.T, w: P.w, h: P.h, ms: P.ms }; }), fv: fvState() };
  }
  root.BohemiaCampBoard = { want: want, state: state, plate: plate, variantOf: variantOf, handOver: handOver, drop: drop, bodies: bodies, walls: walls, onBoard: onBoard, settle: settle, houses: houses, fromFight: fromFight, fvOn: fvOn, fvState: fvState, fvWhere: fvWhere, warm: warm, warmDrop: warmDrop, warmOn: function () { return !!B.warm; }, fvGlass: function () { return B.fv ? fvGlass() : null; }, fit: function (L) { return B.kit && B.sq ? fit(L, B.kit, B.sq) : null; },
    onChange: function (fn) { if (typeof fn === 'function' && B.fns.indexOf(fn) < 0) B.fns.push(fn); }, _B: B };
})(typeof window !== 'undefined' ? window : this);
