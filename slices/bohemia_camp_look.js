/* BOHEMIA CAMP LOOK -- HIS CAMP ON THE CAMP SCREEN (CAMP TWO, 10/26/26: [the camp is your own settlement], [you see your men at camp],
   [the camp grows], [the compass of danger], [they pitch the camp]; rules 259, 260, 269).
   PAOLO 10/26: 'the camp screen is gonna be the camp, a settlement vibe, it's very important to me'; 'I should see my main character
   and the rest of his team in the camp as time passes'; 'all eight compass directions, part of the edge of the screen'; 'I wanna see
   me set the camp up with all my camp stuff... like a loading screen, my characters taking stuff out, interacting, building the
   camp'; 'this Bohemian Crashbox HBO style, I love it'.
   MEASURED FIRST: the camp screen opened on COOK's squat-camp picture, seven strangers' tents, a market stall, a car and a notice
   board, the same for one man or twelve; his men stood in a ring round a fire that was not his, all doing the same idle; nothing
   grew; nothing said where danger was; the camp was simply there.
   NOW (the settlement screen's camp mode calls this file at marked hooks, __CAMP_TWO__; the screen's own drawing is untouched
   elsewhere): the picture is HIS ground (slices/camp_two/plate.webp, the rig's own sand with nobody's things on it) and his camp is
   drawn on it from engine/bohemia_camp_life.js's layout: a tent for each two men, his carrier (the shopping cart first, the cart
   rendered through DIRECTION's master rig), the supplies out of it, the fire (six keys, two beats, the flames the only thing that
   moves), the seats by the fire, each follower's piece, the slain if the camp was made off a fight; every piece is tappable like a
   town's building (the fire: the hour; a tent: who sleeps there and the company; the cart: the stash and the carrier; the seats and
   every follower: the retinue). Each man is where his condition puts him and does it (the condition is CAMP's, read here only):
   lying bandaged on a bedroll with a friend sitting by him, sitting by the fire binding a cut, working at the cart or the anvil,
   cooking, cleaning a gun, keeping watch at the edge, asleep by his tent at night; ANIMATION's town pictures where they exist
   (sit, stall, smoke), the still turned on its side for a man lying down until ANIMATION's camp acts land. At night the fire lights
   the ground round it on the beat. The eight edges light for a party coming that way (the map hands the reads). Making camp
   plays the pitch: the carrier rolls in, the men pull the camp out of it, the tents go up one by one, the fire last; a tap skips.
   MAP (a plate left of HEAL), a pinch out or the wheel out shows the live map with the camp at its spot and the hours running.
     BohemiaCampLook.ready() / variant() / open(info, S) / boxes(VAR, personH) / names() / folk() / hideLead()
     BohemiaCampLook.items(items, ctx) / lit(cx, key, ctx) / under(cx, ctx) / over(cx, ctx) / tap() / reads(d) / state()
   Words are attempts, draft:true.
   AMENDED 11/6 BY CAMP THREE (rule 406(a)(b), Paolo 11/4, LOCKED: 'the camp only takes place on combat grid maps... anytime you camp
   it's on the combat grid'): HIS GROUND IS THE FIGHT BOARD OF THE BLOCK HE STANDS ON. The quilted sand (plate, plate_night,
   plate_tall, plate_tall_night) is retired, deleted in the same push (rule 405(a)); slices/bohemia_camp_board.js asks the fight for
   the board a fight on that block would deal, pitches the camp's square on it (one house tile, then 2 by 2, bigger with the company)
   and lays this camp on the square. Until the board is in, nothing of the camp is drawn and the pitch waits (the glass stays dark,
   never the old picture). Every door, act, the pitch, the compass, the ghosts and the turn below are CAMP TWO's, unchanged. */
(function (root) {
  'use strict';
  var CL = root.BohemiaCampLife;
  /* __THE_CAMP_ON_THE_BOARD__ (CAMP THREE): the board's module, beside this file */
  if (!root.BohemiaCampBoard) { try { var bs = document.createElement('script'); bs.src = 'bohemia_camp_board.js'; bs.async = false; (document.head || document.documentElement).appendChild(bs); } catch (e) {} }
  function CB() { return root.BohemiaCampBoard || null; }
  var K = { kit: null, img: null, rig: {}, ready: false, st: null, info: null, compass: null, threats: null, pitch: null, lastMade: null,
    men: null, folkKey: null, folk: [], hide: false, peekBtn: null, reads: 0, ghost: null };
  var BASE = 'camp_two/';
  try { fetch(BASE + 'kit.json').then(function (r) { return r.json(); }).then(function (j) { K.kit = j; try { if (K.st) boardWant(); } catch (e) {}   /* CAMP THREE: a camp opened before the kit asks for its board now */
    var im = new Image(); im.onload = function () { K.img = im; K.ready = true; }; im.src = BASE + 'kit.png'; }).catch(function () {}); } catch (e) {}
  try { fetch('../records/target/bb/ours.json').then(function (r) { return r.json(); }).then(function (j) { var c = j && j.odds_colour; if (c && CL) CL.setOdds(c.value || c); }).catch(function () {}); } catch (e) {}
  /* the carriers DIRECTION's master rig rendered (the cart his law names first, and the truck), at the rig's own 57 ppm */
  var RIGS = { cart: { dir: '../records/target/master_rig/cook_cart/', ground: [34, 53] }, truck: { dir: '../records/target/master_rig/truck/', ground: [158, 124] } };
  function rigImg(id, face) {
    var R = RIGS[id]; if (!R) return null; var k = id + face;
    if (!K.rig[k]) { var im = new Image(); im.src = R.dir + 'rig_' + face + '.png'; K.rig[k] = im; }
    var m = K.rig[k]; return m.complete && m.naturalWidth ? m : null;
  }
  function up(name) { try { return root[name] || (root.parent && root.parent !== root ? root.parent[name] : null) || null; } catch (e) { return root[name] || null; } }
  function smart() { try { return localStorage.getItem('bohemia.camp.smart.v1') === '1'; } catch (e) { return false; } }

  /* ---------------------------------------------------------------- the camp of this visit */
  function companyOf(info) {
    var c = (info && info.company) || [], out = [{ name: 'YOU', look: 'you', main: true }];
    /* ONE COMPANY (PLUMBER 2, rule 327, Paolo 11/2: 'I dismiss someone in the camp... it still thinks they're part of my squad'):
       the map hands this camp its men once, at the visit; a man let go on the crew screen over the camp leaves the fire at once
       (engine/bohemia_hire_lock.js, the one list), and the camp is laid out again the moment it happens */
    var HL = up('BohemiaHireLock'), G = null;
    var sig = function (g) { return Object.keys(g || {}).sort().join('|'); };
    try { if (HL && HL.gone) { G = HL.gone(); K.goneSig = sig(G);
      if (!K.heard && HL.onChange) { K.heard = true; HL.onChange(function () { try { if (!K.info || !K.st || sig(HL.gone()) === K.goneSig) return; time(); } catch (e) {} }); } } } catch (e) { G = null; }   /* laid out again only when the men gone changed, never on every save of the crew screen */
    c.forEach(function (m) { if (m && m.name && G && HL.key && G[HL.key(m.name)]) return; if (m && m.look && m.look !== 'you') out.push({ name: m.name || '', look: m.look, main: false }); });
    return out;
  }
  function build(info) {
    if (!CL) return null;
    var C = up('BohemiaCamp'), cart = C ? C.cart().level : 0, ret = C ? C.retinue() : [];
    var men = companyOf(info), cond = up('BohemiaCondition');
    var block = info && info.block ? info.block : [0, 0];
    var LO = { men: men.length, level: cart, smart: smart(), followers: ret, kills: (info && info.kills) | 0, seed: block[0] * 7 + block[1] * 13, tall: wantTall() };
    K.plan = { men: LO.men, level: LO.level, smart: LO.smart, followers: LO.followers.slice(), kills: LO.kills, seed: LO.seed };   /* __THE_CAMP_ON_THE_BOARD__: the square is the company's, never the glass's */
    var L = CL.layout(LO), FV = fvOn();
    if (FV) L = CB().onBoard(L);   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__ (MOTION 3, rule 442(a)): the camp on the fight's own view of the board */
    else if (L.tall) { var lift = liftFor(L, men.length); if (lift) { LO.lift = lift; L = CL.layout(LO); } }
    var M = men.map(function (m) {
      var r = CL.manOf(m, cond);
      if (K.men) {   /* the map's read of each man by his look (the names the marker's list does not carry) */
        var g = null; for (var key in K.men) { var e = K.men[key]; if ((m.main && key === 'YOU') || (!m.main && e && e.look && e.look === m.look)) { g = e; break; } }
        if (g) { r.blood = g.blood; r.armour = g.armour; if (!m.main && g.name) r.name = m.name = g.name; }
      }
      return r; });
    var min = (info && info.min) | 0, hour = Math.floor(min / 60), night = !!(info && info.night);
    var A = CL.acts(M, { hour: hour, night: night, seed: (block[0] + block[1]) % 5 });
    /* CAMP FOUR __CAMP_WAITS_FOR_HIM__ (rule 472(b), Paolo 11/22: 'I still want the characters to move around as they were, doing whatever,
       just breathing and idling around'): everyone whole and the clock stopped, the hour no longer turns their jobs; so every DRIFT_MS one
       man of his (never YOU: you walk to his taps) gets up from what he was doing and goes to the next thing, the cook to the gun, the
       gun to the fire, a turn on watch; by night they sleep but the one on watch, as they were */
    if (info && info.whole && !night && (K.drift | 0) > 0) {
      var J = ['cook', 'clean', 'rest', 'watch'], fr = A.filter(function (e) { return !e.main && J.indexOf(e.act) >= 0; });
      if (!root.__CAMP_IDLE_PLAIN && !(root.parent && root.parent.__CAMP_IDLE_PLAIN)) livesActs(fr, K.drift | 0, hour);   /* CAMP FOUR __THE_CREW_LIVES__ */
      else for (var dk = 0, dn = (K.drift | 0) % Math.max(1, fr.length * J.length * 3); dk < dn && fr.length; dk++) { var de = fr[dk % fr.length]; de.act = J[(J.indexOf(de.act) + 1 + (dk % 2)) % J.length]; }
    }
    if (K.st && K.st.acts) {   /* a man who lay hurt and is healed gets up once (ANIMATION's 'rise') */
      var was = {}; K.st.acts.forEach(function (e) { was[e.name || e.look] = e.act; });
      var tn = root.performance ? performance.now() : Date.now();
      A.forEach(function (e) { var kk = e.name || e.look; if (was[kk] === 'lie' && e.act !== 'lie' && e.act !== 'sleep') (K.rise || (K.rise = {}))[kk] = tn; });
    }
    var P = livesSpots(A, L);   /* CAMP FOUR __THE_CREW_LIVES__: CL.spots, with the idle acts placed round the fire and the talkers face to face */
    /* __THE_CAMP_ON_THE_BOARD__ (CAMP THREE, rule 406(g), AMENDED 11/6, Paolo: 'your company's interacting with their kills'): a camp
       made on the board just fought on has its dead where they fell; by day the men with an easy job go through them, the nearest body
       first, a man to a body, never more than half the company (the rest keep the fire, the watch and the hurt) */
    try { var BD = CB() && boardIn() ? CB().bodies(L) : []; K.bodiesNow = BD;
      if (BD.length && !night) {
        var free = A.filter(function (e) { return (e.act === 'cook' || e.act === 'clean' || e.act === 'rest') && e.blood >= CL.HURT; }).sort(function (a, b) { return (a.main ? 1 : 0) - (b.main ? 1 : 0); });
        var cap = Math.min(BD.length, FV ? Math.max(1, Math.floor(A.length / 2)) : Math.ceil(A.length / 2)), left = BD.slice();   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: never more than half (three men: one through the dead, one at a house, the fire kept) */
        free.slice(0, cap).forEach(function (e) { var sp = P[e.i]; if (!sp || !left.length) return;
          left.sort(function (a, b) { return Math.hypot(a.x - sp.x, a.y - sp.y) - Math.hypot(b.x - sp.x, b.y - sp.y); });
          var b = left.shift(), side = b.x > L.fire.x ? -1 : 1, px = b.x + side * 46, py = b.y + 6;
          e.act = 'loot'; e.body = b.i; P[e.i] = { x: Math.round(px), y: Math.round(py), face: side > 0 ? 'W' : 'E', act: 'loot' }; });
      } } catch (e) {}
    /* __THE_CAMP_AFTER_A_FIGHT__ (MOTION 3, 11/9, rule 440(e), rule 406(g): 'your company is interacting with their kills or the buildings
       nearby'): by day, on the board, a man with an easy job and no body to go through LEANS ON A WALL that touches the camp's tiles
       (BohemiaCampBoard.walls: the board's own walls, the wall at his right hand, ANIMATION's flirt with o.wall, the hand up on it,
       rule 430: the rig's own clip), never the hurt, never the watch, never YOU (he walks to your taps), a quarter of the company at
       most and at least one when there is a wall; when the dead took every free man (a company of three: two of them), the second of
       them leans instead, so the camp shows the dead gone through, a man at the wall and the fire kept. window.__CAMP_NO_LEAN = the old way. */
    /* MOTION 3 __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ (rule 444(a): 'the fire lit, the bedrolls down, one through the dead, one on watch'):
       on the fight's board one man keeps the watch, a man with an easy job and not hurt (never YOU, never a man at the dead); the lookout
       may keep it from a house's wall (below) */
    if (FV && !root.__CAMP_NO_LOOKOUT && A.length >= 2 && !A.some(function (e) { return e.act === 'watch'; })) {
      var lk = A.filter(function (e) { return !e.main && e.blood >= CL.HURT && (e.act === 'clean' || e.act === 'cook' || e.act === 'rest'); })[0];
      if (lk) { lk.act = 'watch'; lk.lookout = true; delete lk.body; }
    }
    try { var WL = !root.__CAMP_NO_LEAN && !(root.parent && root.parent.__CAMP_NO_LEAN) && CB() && boardIn() && CB().walls ? CB().walls(L) : [];
      /* only a wall he can be SEEN at: the picture is wider than an upright phone (measured: a man at a wall at the picture's left edge
         stood half off the glass), and never under the phone (its columns from its top down) */
      var GV = glassOf(L); if (GV) WL = WL.filter(function (q) { return q.x > GV.x0 + 40 && q.x < GV.x1 - 40 && !(GV.ph && q.x > GV.ph.l - 30 && q.x < GV.ph.r + 30 && q.y > GV.ph.t - 40) && (GV.y0 == null || (q.y > GV.y0 + 110 && q.y < GV.y1 - 30)); });
      K.wallsNow = WL;
      if (WL.length && !night) {
        var ok2 = function (e) { return !e.main && e.blood >= CL.HURT; };
        var pool = A.filter(function (e) { return ok2(e) && (e.act === 'cook' || e.act === 'clean'); });
        if (FV) pool = pool.concat(A.filter(function (e) { return ok2(e) && e.act === 'watch'; }));   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: the lookout keeps his watch from a house's wall */
        var looters = A.filter(function (e) { return ok2(e) && e.act === 'loot'; });
        if (!pool.length && looters.length >= 2) pool = [looters[looters.length - 1]];
        var capL = Math.max(1, Math.floor(A.length / 4)), taken = [];
        A.forEach(function (e) { if (P[e.i]) taken.push(P[e.i]); });
        pool.slice(0, capL).forEach(function (e) {
          var mine = P[e.i];
          var w = WL.filter(function (q) { return Math.hypot(q.x - L.fire.x, q.y - L.fire.y) > 70 &&   /* clear of the fire by a man's width (a camp of three is one tile: every house it touches is near its fire) */ taken.every(function (t) { return t === mine || Math.hypot(t.x - q.x, t.y - q.y) > 64; }); })[0];
          if (!w) return;
          if (e.act === 'watch') e.lookout = true; e.act = 'lean'; e.wall = w.side; delete e.body; P[e.i] = { x: w.x, y: w.y, face: w.face, act: 'lean', wall: w.side }; taken.push(P[e.i]); });
      } } catch (e) {}
    if (FV) { try { P = CB().settle(P, L, A) || P; } catch (e) {} }   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: every man on open ground, never in a house */
    warmLooks(A);
    return { layout: L, men: M, acts: A, spots: P, hour: hour, night: night, cart: cart, retinue: ret, tall: !!L.tall, fv: !!FV, key: (FV ? 'F' : '') + (L.tall ? 'T|' : 'W|') + A.map(function (e) { return e.act; }).join(',') + '|' + L.pieces.length + '|' + cart + '|' + ret.join(',') };
  }
  /* ==== CAMP FOUR __THE_CREW_LIVES__ (VAMILY rule 482 on 472(b), the coordinator 11/27: 'the crew idling looks alive'; Paolo 11/22: 'I
     still want the characters to move around as they were, doing whatever, just breathing and idling around... see them chilling').
     MEASURED (the demo, a camp made whole, its clock stopped): three men in three still poses a camp apart, none turned to another, and
     every six seconds one of them carried to the next of the same four jobs (the pot, the gun, the crate, the watch). ANIMATION drew
     every man of his in five acts the camp never asked for (slices/rig_town: talk, smoke, drink, sit on a crate, light). NOW, once they
     are whole, the men with nothing to do (never YOU, never the hurt, the dead's or the wall's man) live a scene: two face each other and
     talk, one smokes or drinks by the fire, they sit round it on crates; the scene turns one man at a time (DRIFT_MS each, the same
     walk), and the hour picks the scenes: mornings the pot, afternoons talk and smokes, evenings round the fire; by night they sleep and
     one keeps watch, as before. A lone talker talks to the nearest man, who turns to him. window.__CAMP_IDLE_PLAIN: the way it was. ==== */
  var LIVES = {
    morning: [['cook', 'talk', 'talk', 'clean', 'drink', 'watch'], ['talk', 'talk', 'smoke', 'cook', 'talk', 'talk'], ['cook', 'drink', 'clean', 'smoke', 'watch', 'sit'], ['smoke', 'talk', 'talk', 'cook', 'clean', 'drink']],
    day: [['talk', 'talk', 'smoke', 'cook', 'talk', 'talk'], ['smoke', 'drink', 'cook', 'clean', 'watch', 'sit'], ['drink', 'talk', 'talk', 'smoke', 'clean', 'cook'], ['clean', 'smoke', 'talk', 'talk', 'drink', 'watch']],
    evening: [['sit', 'sit', 'sit', 'talk', 'sit', 'sit'], ['drink', 'talk', 'talk', 'smoke', 'sit', 'sit'], ['talk', 'talk', 'sit', 'drink', 'talk', 'talk'], ['sit', 'smoke', 'drink', 'sit', 'talk', 'talk']] };
  var LIVE_ACTS = { talk: 1, smoke: 1, drink: 1, sit: 1 };
  function livesActs(F, d, hour) {
    var n = F.length; if (!n) return;
    var band = LIVES[hour < 11 ? 'morning' : hour < 17 ? 'day' : 'evening'], step = d - 1, cur = Math.floor(step / n), k = step % n;
    F.forEach(function (e, i) { var sc = i <= k ? cur : cur - 1; if (sc < 0) return; var S = band[sc % band.length]; e.act = S[i % S.length]; e.lives = true; });
    K.livesScene = cur;
  }
  function dirOf(dx, dy) { var a = Math.atan2(dy * 2, dx), k = Math.round(a / (Math.PI / 4)); return ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'][((k % 8) + 8) % 8]; }
  function livesSpots(A, L) {
    var real = {}; A.forEach(function (e) { if (LIVE_ACTS[e.act]) { real[e.i] = e.act; e.act = e.act === 'sit' || e.act === 'talk' ? 'clean' : 'rest'; } });   /* the ring round the fire (the sitters') */
    var P = CL.spots(A, L);
    A.forEach(function (e) { if (real[e.i]) { e.act = real[e.i]; if (P[e.i]) P[e.i].act = e.act; } });
    if (!Object.keys(real).length) return P;
    var f = L.fire, T = A.filter(function (e) { return e.act === 'talk' && P[e.i]; }), side = function (q) { return q.x >= f.x ? 1 : -1; };
    var face2 = function (a, b) { a.face = dirOf(b.x - a.x, b.y - a.y); b.face = dirOf(a.x - b.x, a.y - b.y); };
    /* clear of everyone else (and of YOU at his job): a man of the pair never within 100 px (most of a man's height) of another man's spot */
    var others = function (skip) { var o = []; A.forEach(function (e) { if (skip.indexOf(e.i) < 0 && P[e.i]) o.push(P[e.i]); }); return o; };
    var clear = function (pts, skip) { var o = others(skip); return pts.every(function (q) { return o.every(function (r) { return Math.hypot(r.x - q.x, r.y - q.y) >= 100; }); }); };
    /* where two talk: the spot round the fire farthest from every other man (YOU at his job too), every piece of the camp and the fire */
    var obst = function (skip) { var o = others(skip); (L.pieces || []).forEach(function (pc) { if (pc.kind !== 'follower') o.push({ x: pc.x, y: pc.y - (pc.kind === 'tent' ? 30 : 0) }); }); return o; };
    var best2 = function (cands, skip) { var o = obst(skip), bestC = null, bs = -1; cands.forEach(function (c) { var m = 1e9; c.pts.forEach(function (q) { o.forEach(function (r) { m = Math.min(m, Math.hypot(r.x - q.x, r.y - q.y)); }); }); if (m > bs) { bs = m; bestC = c; } }); return bestC; };
    for (var j = 0; j + 1 < T.length; j += 2) {   /* two talk: a stride apart, face to face */
      var a = P[T[j].i], b = P[T[j + 1].i], skip = [T[j].i, T[j + 1].i], C2 = [];
      [[a.x, a.y], [f.x - 230, f.y + 70], [f.x + 230, f.y + 70], [f.x - 200, f.y + 190], [f.x + 200, f.y + 190], [f.x - 40, f.y + 230], [f.x - 260, f.y - 40], [f.x + 260, f.y - 40]].forEach(function (c) {
        [-1, 1].forEach(function (dx) { C2.push({ pts: [{ x: c[0], y: c[1] }, { x: c[0] + dx * 74, y: c[1] + 10 }] }); }); });
      var pk = best2(C2, skip);
      a.x = Math.round(pk.pts[0].x); a.y = Math.round(pk.pts[0].y); b.x = Math.round(pk.pts[1].x); b.y = Math.round(pk.pts[1].y);
      face2(a, b); a.with = T[j + 1].i; b.with = T[j].i; }
    if (T.length % 2) {   /* a lone talker talks to the nearest man (never YOU, never one lying), who turns to him */
      var lt = T[T.length - 1], q = P[lt.i], best = null, bd = 1e9;
      A.forEach(function (e) { if (e === lt || e.main || !P[e.i] || e.act === 'lie' || e.act === 'sleep' || e.act === 'watch') return; var dd = Math.hypot(P[e.i].x - q.x, P[e.i].y - q.y); if (dd < bd) { bd = dd; best = e; } });
      if (best) { var o = P[best.i], skip2 = [lt.i, best.i], c0 = [[side(o) * 70, 8], [-side(o) * 70, 8], [0, 70], [side(o) * 60, 60]];
        var pk = c0.filter(function (t) { return clear([{ x: o.x + t[0], y: o.y + t[1] }], skip2); })[0] || c0[0];
        q.x = Math.round(o.x + pk[0]); q.y = Math.round(o.y + pk[1]); face2(q, o); q.with = best.i; }
    }
    return P;
  }
  /* ==== end __THE_CREW_LIVES__ ==== */
  function open(info, S) {
    K.info = info || {};
    K.st = build(K.info);
    boardWant();   /* __THE_CAMP_ON_THE_BOARD__ (CAMP THREE, rule 406(a)): the board of the block he stands on, asked once a camp */
    /* the pitch plays when the map made a new camp (its own count of camps made), never on a reopen or a peek back */
    var made = null; try { made = root.parent && root.parent.__CAMP ? root.parent.__CAMP.made | 0 : null; } catch (e) {}
    if (made != null && made !== K.lastMade && K.st) { K.lastMade = made; K.leadSent = false; if (boardIn()) pitchNow(); else K.pitchDue = true; }   /* the pitch waits for its ground */
    else if (made == null && !K.pitch) K.lastMade = made;
    K.folkKey = null;
    peekPlate(true);
    return K.st;
  }
  function time(info) {
    K.info = info || K.info;
    var s = build(K.info); if (!s) return;
    var changed = !K.st || s.key !== K.st.key;
    K.st = s; if (changed) K.folkKey = null;
    ghostHour();
    var sw = !!(root.__CAMP_NO_FIGHT_VIEW || (root.parent && root.parent.__CAMP_NO_FIGHT_VIEW));   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: its switch flipped, the board asked again */
    if (changed || sw !== !!K.fvSw) { K.fvSw = sw; boardWant(); }
    if (changed) boardTell();   /* __THE_CAMP_ON_THE_BOARD__: a hire by the fire or a cart bought up can change the square or its picture */
  }
  /* THE SHAPE OF THE GLASS (rule 289): a glass taller than wide gets the tall camp on the tall ground, a wide one the wide camp; a
     turn GLIDES between them (flip below) */
  /* THE PHONE AFTER (rule 289 then 286): an upright glass shows the tall ground's whole height (the screen cannot pan up or down), so
     when the phone stands in its bottom corner the camp itself rises: everything clear of the phone's top and, room allowing, centred
     in what is left; it rises and settles in one beat (the glide). With no phone it sits centred on the glass. */
  /* __THE_CAMP_AFTER_A_FIGHT__ (MOTION 3): the part of the camp's picture on the glass (the settlement's own camera, view.ox and view.s,
     as it stands), and the phone's columns on it */
  function glassOf(L) {
    try { var sc = document.getElementById('scene').getBoundingClientRect(); if (!sc || !sc.width || !sc.height) return null;
      var k = L.pic.h / sc.height, V = K.view, s = V && V.s ? V.s : 1 / k, W0 = sc.width;
      /* the camera as it stands (compose() puts the fire at the middle of what the phone leaves, so with the phone on the right the
         camp sits left of the glass's middle: the composed guess put a man at a wall half off the left edge, measured on the phone strip) */
      var ox = V && isFinite(V.ox) ? V.ox : Math.min(0, Math.max(W0 - L.pic.w * s, W0 / 2 - L.fire.x * s)), g = { x0: -ox / s, x1: (W0 - ox) / s, ph: null, live: !!(V && isFinite(V.ox)) };
      if (L.fv) { var FG = CB().fvGlass(), oy = V && isFinite(V.oy) && g.live ? V.oy : null;   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: the square is taller than the glass */
        if (!g.live && FG) { g.x0 = FG.x0; g.x1 = FG.x1; } g.y0 = oy != null ? -oy / s : FG ? FG.y0 : 0; g.y1 = oy != null ? (sc.height - oy) / s : FG ? FG.y1 : L.pic.h;
        var r0 = phone(); if (r0) g.ph = { l: (r0.left - sc.left - ox) / s, r: (r0.right - sc.left - ox) / s, t: oy != null ? (r0.top - sc.top - oy) / s : FG && FG.ph ? FG.ph.t : (r0.top - sc.top) * k };
        return g; }
      var r = phone(); if (r) g.ph = { l: (r.left - sc.left - ox) / s, r: (r.right - sc.left - ox) / s, t: (r.top - sc.top) * k };
      return g; } catch (e) { return null; }
  }
  var PERSON = 134;   /* the settlement screen's man, picture px (its personH) */
  function liftFor(L, nMen) {
    var r = phone(); if (!r) return 0;
    var sc = null; try { sc = document.getElementById('scene').getBoundingClientRect(); } catch (e) { sc = null; }
    var top0 = sc ? sc.top : 0, left0 = sc ? sc.left : 0, h = sc && sc.height ? sc.height : (root.innerHeight || 844), k = L.pic.h / h, pt = (r.top - top0) * k;
    /* the phone's columns on the picture, with the camp as composed (the fire at the glass's middle), never as dragged: a rise
       that followed the pan moved the camp under a finger between finding a door and pressing it */
    var V = K.view, s = V && V.s ? V.s : 1 / k, W0 = sc && sc.width ? sc.width : (root.innerWidth || 390);
    var ox = Math.min(0, Math.max(W0 - L.pic.w * s, W0 / 2 - L.fire.x * s));
    var pl = (r.left - left0 - ox) / s, pr = (r.right - left0 - ox) / s, M = CL.MINY || {};
    var z = PERSON / ZK, hi = 1e9, lo = -1e9, inCol = -1e9, room = 1e9;
    L.pieces.forEach(function (p) { var q = pieceRect(p, z); if (!q) return; hi = Math.min(hi, q[1]); lo = Math.max(lo, q[3]);
      if (q[2] > pl && q[0] < pr) inCol = Math.max(inCol, q[3]);
      room = Math.min(room, p.y - (M[p.kind] || 200)); });   /* a rise never pushes a piece past the top it may stand at */
    var f = L.fire; hi = Math.min(hi, f.y - 520); lo = Math.max(lo, f.y + (nMen > 1 ? 420 : 200));   /* the men: the watch at the back, the hurt in front */
    inCol = Math.max(inCol, f.y + (nMen > 1 ? 300 : 120));
    var need = inCol - (pt - 16), mid = (hi + lo) / 2 - pt / 2;
    return Math.round(Math.max(0, Math.min(440, room, Math.max(need, Math.min(mid, hi - 150)))));
  }
  /* EVERY TIER BOTH WAYS (rule 289's 'every camp tier, one man and a cart to the full camp'): a company's camp laid out wide and tall
     from the same plan, each piece's box in picture px at the screen's man size; upright with the phone up, the tall one risen */
  function tier(o) {
    if (!CL || !K.kit) return null;
    var z = PERSON / ZK, out = {};
    [false, true].forEach(function (tall) {
      var LO = Object.assign({ seed: 5 }, o || {}, { tall: tall }), L = CL.layout(LO);
      if (tall && wantTall() && phone()) { var lf = liftFor(L, (o && o.men) | 0); if (lf) { LO.lift = lf; L = CL.layout(LO); } }   /* the rise is the upright glass's */
      out[tall ? 'tall' : 'wide'] = { pic: L.pic, lift: L.lift | 0, pieces: L.pieces.map(function (p) { return { key: p.key, r: pieceRect(p, z) }; }) };
    });
    return out;
  }
  function wantTall() { try { var W = root.innerWidth, H = root.innerHeight; return !!CL && H > W * 1.15; } catch (e) { return false; } }
  /* ==== __THE_CAMP_ON_THE_BOARD__ (CAMP THREE, rule 406(a)(b)): the ground is the board's picture under this camp's layout; until it
     is in, a dark glass of the camp's shape (the fight's own ground colour), with nothing drawn on it and no door on it ==== */
  var WAIT = 'image/gif;base64,R0lGODlhAQABAIAAAA0LCQAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';   /* one pixel of #0d0b09 */
  function boardAsk() {
    var M = null; try { M = root.parent && root.parent !== root ? root.parent.BohemiaMapCamp : null; } catch (e) { M = null; }
    /* in the game the map asks, and only while a camp stands (a late hour after the camp broke never asks again: measured 11/6, a
       tick after BREAK CAMP re-asked with no block and dealt a board of nowhere) */
    if (M) { try { return M.boardAsk ? M.boardAsk() : null; } catch (e) { return null; } }
    if (K.info && K.info.block) return { type: 'BOHEMIA_CITY_ENCOUNTER', why: 'camp', at: K.info.block.slice(), district: K.info.district || null, world: { night: !!K.info.night } };   /* a bench with no map: the block alone */
    return null;
  }
  function boardWant() { var C = CB(); if (!C || !K.kit || !K.plan) return null; var a = boardAsk(); if (!a) return null; return C.want(a, K.plan, K.kit); }
  function boardIn() { var C = CB(); return !!(C && C.state().state === 'in'); }
  function boardWait() { var C = CB(); if (!C) return true; var st = C.state().state; return st !== 'in' && st !== 'failed'; }
  function boardPlate() { var C = CB(); return C && K.st && boardIn() ? C.plate(K.st.layout) : null; }
  function variant() {
    var tall = wantTall(), G = CL ? (tall ? CL.GEO.tall : CL.GEO.wide) : { w: 2060, h: 1092 }, P = boardPlate();
    if (P) return CB().variantOf(P);
    return { src: WAIT, night_src: WAIT, dir: 'data:', px: [G.w, G.h], hotspots: {}, lights: 1, camp2: true, tall: tall, wait: true };
  }
  /* the board landed or a picture of it did: the screen picks its ground again (its own turn path), the pitch that waited plays, and
     the map is told where the camp stands, for the fight that finds it there (rule 406(c)) */
  function PICo() { return root.PIC || root.__SETTLE_PIC || null; }   /* CAMP FOUR __THE_NIGHT_LAID_IN__ */
  function boardLanded() {
    if (!K.st) return;
    /* MOTION 3 __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ (rule 444(a)): the other light came in after the camp stood on the first (its plate
       'F|W+'): its picture laid in the screen's own night slot where it stands, never a re-pick (measured: the re-pick moved the camera
       a hundred pixels in the middle of the set-up) */
    try { var P2 = boardPlate(), V2 = root.VAR;
      if (P2 && V2 && V2.board && /\+$/.test(P2.key) && V2.boardKey + '+' === P2.key && PICo()) {   /* CAMP FOUR __THE_NIGHT_LAID_IN__: the page's own slots */
        var vv = CB().variantOf(P2), hc = !!(vv.cv && vv.cv.night), im = hc ? vv.cv.night : new Image(); if (!hc) im.src = vv.dir + vv.night_src;   /* PLUMBER 8 __THE_CAMP_PICTURE_IS_HANDED_NOT_WRITTEN__ */
        if (hc) { V2.cv = vv.cv; if (vv.cv.day) PICo().day = vv.cv.day; }   /* CAMP FOUR: a camp made by night stood on the night alone: the day laid in too */
        else if (vv.src !== V2.src) { var imd = new Image(); imd.src = vv.dir + vv.src; PICo().day = imd; V2.src = vv.src; }
        PICo().night = im; V2.night_src = vv.night_src; V2.boardKey = P2.key; K.nightIn = (K.nightIn | 0) + 1; return; } } catch (e) {}
    try { if (K.info) { K.st = build(K.info); K.folkKey = null; } } catch (e) {}   /* rule 406(g): the bodies the board brought, for the men's jobs */
    try { var BS0 = root.BohemiaSettlement; if (K.st && K.st.fv && !K.leadSent && BS0 && BS0.leadAgain) BS0.leadAgain(); } catch (e) {}   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: he stands on the fight's view, where he fought, never where the dark wait put him */
    if (K.pitchDue && boardIn()) { K.pitchDue = false; pitchNow(); if (K.st && K.st.fv && K.pitch) { K.pitch.t0 = null; K.firstAt = null;
      K.pitch.plan.ms = Math.max(K.pitch.plan.ms, FV_HOLD + FV_WALK + K.st.acts.length * 160 + 200); } }   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: its clock starts on the first frame drawn on the fight's view */
    boardTell();
    K.boardRepick = true;
    try { root.dispatchEvent(new Event('bohemia-phone')); } catch (e) {}   /* the settlement's campCompose: wantsFlip below says yes, flip re-picks */
  }
  function boardTell() { try { var C = CB(), M = root.parent && root.parent !== root ? root.parent.BohemiaMapCamp : null; if (C && M && M.pitched && K.st && boardIn()) M.pitched(C.handOver(K.st.layout), C.state()); } catch (e) {} }
  function boardStale(VAR) { if (!VAR || !VAR.camp2 || !K.st) return false; var P = boardPlate(); if (!P) return false; return !VAR.board || VAR.boardKey !== P.key; }
  try { (function hook(n) { var C = CB(); if (C) { C.onChange(boardLanded); return; } if (n < 200) setTimeout(function () { hook(n + 1); }, 25); })(0); } catch (e) {}
  /* ==== /__THE_CAMP_ON_THE_BOARD__ ==== */
  function platesWarm() {}   /* the sand is retired (rule 406(b)); the board's pictures are made once, in slices/bohemia_camp_board.js */
  /* A TURN GLIDES (rule 289(b)(c), the coordinator's default: the shared-element move): the camp's pieces and his men slide from where
     they stood on the old glass to their new spots in one beat (500 ms at 120 BPM, eased), each man keeping his act; the ground
     swaps under them (the same sand both ways); the last frame holds while the new ground comes in, never a black frame */
  var GLIDE_MS = 500;
  var FV_HOLD = 2000, FV_WALK = 1600;   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: a bar at 120 BPM where they won, then three beats of walking */   /* one beat at 120 BPM (a capture for the VOTE tab may slow it with window.__CAMP2_GLIDE_MS) */
  function wantsFlip(VAR) { return !!(K.st && VAR && VAR.camp2 && (!!VAR.tall !== wantTall() || boardStale(VAR))); }   /* CAMP THREE: or the board's picture came in */
  function flip(cv, view) {
    if (K.boardRepick && K.st && !!K.st.tall === wantTall()) {   /* __THE_CAMP_ON_THE_BOARD__: the same glass, its ground came in: no glide, nothing moves */
      K.boardRepick = false; K.composed = null; K.folkKey = null; return true; }
    K.boardRepick = false;
    var snap = K.lastSnap || null;   /* the glass is cleared by its own resize before this runs: the last beat's copy is the frame to hold */
    K.lastSnap = null;
    /* the beat starts on the first frame the new ground is drawn (a slow phone's first frame after a turn can be late; the glide is
       never eaten by it) */
    K.flips = (K.flips | 0) + 1;
    K.glide = { t0: null, frames: 0, from: Object.assign({}, K.drawnAt || {}), snap: snap, oldView: { ox: view.ox, oy: view.oy, s: view.s }, n: K.flips, kind: 'flip' };
    K.composed = null;
    if (K.info) K.st = build(K.info);
    K.folkKey = null;
    boardTell();   /* CAMP THREE: the camp the fight would find is the one on the glass */
    return true;
  }
  /* ON MOTION'S CURVE (the coordinator's 289 brief: 'one beat at 120 BPM, on MOTION's curve'): the beat from MOTION's clock (the
     music's when it plays), six holds a beat (its stop-motion grid, never a smooth glide), each hold's place on its
     emphasized-decelerate (slices/bohemia_motion.js emphasized(), the same cubic-bezier(0.05, 0.7, 0.1, 1.0)); reduced motion
     (MOTION's own switch) lands at once */
  function motion() { try { return root.top && root.top.BohemiaMotion ? root.top.BohemiaMotion : null; } catch (e) { return null; } }
  function emphasized(x) { var x1 = .05, y1 = .7, x2 = .1, lo = 0, hi = 1, t = x;
    for (var i = 0; i < 20; i++) { t = (lo + hi) / 2; var cx = 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t; if (cx < x) lo = t; else hi = t; }
    return 3 * y1 * t * (1 - t) * (1 - t) + 3 * t * t * (1 - t) + t * t * t; }
  function glideU(now) { var G = K.glide; if (!G) return 1; if (G.t0 == null) G.t0 = now;
    if (G.bm == null) { var M = motion(), c = null; try { c = M && M.clock ? M.clock() : null; } catch (e) {} G.bm = root.__CAMP2_GLIDE_MS || (c && c.beatMs) || GLIDE_MS; try { G.reduced = !!(M && M.reduced && M.reduced()); } catch (e) { G.reduced = false; } }
    var e = now - G.t0;
    if (G.reduced || e >= G.bm) { K.lastGlide = { n: G.n, kind: G.kind, frames: G.frames, ms: Math.round(e), beat: Math.round(G.bm), reduced: !!G.reduced }; if (G.kind === 'flip') K.lastFlip = K.lastGlide; K.glide = null; return 1; }
    var k = Math.floor(e / (G.bm / 6)); return emphasized(Math.min(1, k / 6)); }
  function glidePos(key, x, y, now) {
    (K.drawnNext || (K.drawnNext = {}))[key] = [x, y];
    var G = K.glide; if (!G || !G.from[key]) return [x, y];
    var u = glideU(now), f = G.from[key]; return [f[0] + (x - f[0]) * u, f[1] + (y - f[1]) * u];
  }
  /* while the new ground is not in: the frame before the turn, held (the screen's draw asks before it gives up on a frame) */
  function holdFrame(cx, W, H) { var G = K.glide; if (!G || !G.snap) return false;
    try { var c = cx.canvas, sw = G.snap.width, sh = G.snap.height, k = Math.max(c.width / sw, c.height / sh);   /* the old glass, covering the new one (no stretch) */
      cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); cx.drawImage(G.snap, (c.width - sw * k) / 2, (c.height - sh * k) / 2, sw * k, sh * k); cx.restore(); } catch (e) { return false; } return true; }
  /* the camp has drawn a frame (MOTION's grow hands over to the real screen on it) */
  function drawn() { var n = root.performance ? performance.now() : Date.now(); return !!(K.st && !boardWait() && K.lastDraw && n - K.lastDraw < 1500); }   /* CAMP THREE: the camp has drawn on its board */
  function pieceRect(p, z) {
    var e = sprite(p); if (!e) return null;
    return [p.x - e.foot[0] * z, p.y - e.foot[1] * z, p.x + (e.w - e.foot[0]) * z, p.y + (e.h - e.foot[1]) * z];
  }
  function sprite(p) {
    if (!K.kit) return null;
    if (p.sprite === 'cart' || p.sprite === 'truck') { var R = RIGS[p.sprite], im = rigImg(p.sprite, 'SE'); return { rig: true, im: im, w: im ? im.naturalWidth : (p.sprite === 'cart' ? 73 : 320), h: im ? im.naturalHeight : (p.sprite === 'cart' ? 105 : 306), foot: R.ground }; }
    var key = p.sprite === 'fire' ? 'fire_0' : p.sprite, e = K.kit.pieces[key]; if (!e) return null;
    return { rect: e.rect, w: e.rect[2], h: e.rect[3], foot: e.foot };
  }
  var ZK = 98;   /* the rig's ruler: a man 98 px at 57 ppm; the screen draws a man personH tall, so every piece is drawn at personH / 98 */
  function boxes(VAR, personH) {
    var z = personH / ZK, order = [];
    VAR.boxes = {};
    if (!K.st || VAR.wait) return order;   /* CAMP THREE: no door on a camp not yet on its board */
    K.st.layout.pieces.forEach(function (p) {
      if (!p.tap) return; var r = pieceRect(p, z); if (!r) return;
      VAR.boxes[p.key] = r.map(Math.round); order.push(p.key);
    });
    return order;
  }
  var FW = { cook: 'THE COOK', blacksmith: 'THE BLACKSMITH', surgeon: 'THE SURGEON', lookout: 'THE LOOKOUT', scout: 'THE SCOUT', paymaster: 'THE PAYMASTER' };
  try { var CW = up('BohemiaCamp'); if (CW && CW.WORD) for (var wk in CW.WORD) FW[wk] = CW.WORD[wk]; } catch (e) {}   /* all eighteen by their own word */
  function names() {
    var o = { fire: { name: 'THE FIRE', short: 'the hour, the night' }, tent: { name: 'YOUR TENT', short: 'you and your company' },
      cart: { name: K.st ? K.st.layout.carrier.word : 'THE CART', short: 'the stash' }, retinue: { name: 'BY THE FIRE', short: 'who travels with you' } };
    if (K.st) K.st.layout.pieces.forEach(function (p) {
      if (p.kind === 'tent' && p.i) o[p.key] = { name: 'A TENT', short: 'who sleeps here' };
      if (p.kind === 'follower') o[p.key] = { name: FW[p.follower] || p.follower.toUpperCase(), short: 'travels with you' };
      if (p.kind === 'supplies') o[p.key] = { name: 'THE SUPPLIES', short: 'the stash' };
    });
    return o;
  }
  /* the key a tap opens: every tent opens the tent, the supplies the cart, every follower the retinue */
  function sheetKey(k) { if (/^tent_\d+$/.test(k)) return 'tent'; if (k === 'supplies') return 'cart'; if (/^f_/.test(k)) return 'retinue'; return k; }
  function sleepers(k) {
    if (!K.st) return [];
    var p = K.st.layout.pieces.filter(function (q) { return q.key === k; })[0]; if (!p || !p.sleeps) return [];
    return p.sleeps.map(function (i) { var m = K.st.men[i]; return m ? (m.main ? 'YOU' : m.name || 'ONE OF YOURS') : null; }).filter(Boolean);
  }
  var SAYS = { lean: 'leans on the wall', loot: 'goes through the dead', lie: 'is down, bandaged', rest: 'binds a cut by the fire', mend: 'mends his armour', tend: 'sits with the hurt', cook: 'cooks', clean: 'cleans a gun', watch: 'keeps watch', sleep: 'sleeps', talk: 'shoots the shit', smoke: 'has a smoke', drink: 'takes a pull off the bottle', sit: 'sits by the fire' };   /* CAMP FOUR __THE_CREW_LIVES__: the four new, draft:true */
  function doing() {
    if (!K.st) return [];
    return K.st.acts.map(function (e) { return (e.main ? 'YOU' : (e.name || 'ONE OF YOURS')) + ' ' + (SAYS[e.act] || 'rests'); });
  }

  /* ---------------------------------------------------------------- his men, by what they do */
  function folk() {
    if (!K.st || boardWait()) return [];   /* CAMP THREE: his men come out with the board */
    var key = K.st.key + '|' + K.st.hour;
    if (K.folkKey === key) return K.folk;
    var out = [], hide = false, FM = K.st.fv && CB() ? CB().fromFight() : [];
    var stood = function (e) { var n = String(e.name || '').toUpperCase(); for (var i = 0; i < FM.length; i++) if ((e.main && FM[i].main) || (!e.main && n && FM[i].name === n)) return [FM[i].x, FM[i].y]; return null; };
    K.st.acts.forEach(function (e) {
      var sp = K.st.spots[e.i]; if (!sp) return;
      if (e.main) { if (e.act === 'lie' || e.act === 'rest' || e.act === 'mend' || e.act === 'sleep') hide = true; else return; }   /* the main character walks to your taps unless he is hurt */
      out.push({ campMan: true, camp2: true, slot: e.i, look: e.look, name: e.main ? '' : e.name, main: e.main, act: e.act, by: e.by, face: sp.face, loop: [sp.face], beat: e.i % 4, x: sp.x, y: sp.y, ph: 0,
        clip: e.act === 'watch' ? 'smoke' : 'wait', blood: e.blood, armour: e.armour, from: stood(e) });
    });
    /* __THE_RETINUE__ (RETINUE 11/7, rule 425(c), rule 270(b): 'each sits in the camp at his spot doing his work'): every follower with
       you stands by his own piece as himself (records/target/bb/retinue.json's look: the body his face was made from), turned to the
       fire; a tap on him opens the retinue. Not one of your company: no bars over him, never on the crew screen. */
    try { var CC = up('BohemiaCamp'), FR = K.st.layout.fire, TN = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'], tended = {};
      var faceTo = function (x0, y0, x1, y1) { var t = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI; return TN[(((Math.round((90 - t) / 45)) % 8) + 8) % 8]; };
      if (CC && CC.row) K.st.layout.pieces.forEach(function (p, i) {
        if (p.kind !== 'follower') return; var r = CC.row(p.follower); if (!r || !r.look) return;
        var side = p.x >= FR.x ? 1 : -1, x = Math.round(p.x + side * 52), y = Math.round(p.y + 8);
        var f = faceTo(x, y, FR.x, FR.y), act = FOLLOWER_WORK[p.follower] || 'watch';
        /* STAFF 2 (rule 482): the one who heals kneels by the worst hurt man lying in the camp, at his middle, facing him */
        if (act === 'tend') { var hurt = out.filter(function (e) { return e.campMan && !e.main && !tended[e.slot] && (e.act === 'lie' || e.act === 'rest'); })
            .sort(function (a, b) { return ((a.act === 'lie' ? 0 : 1) - (b.act === 'lie' ? 0 : 1)) || ((a.blood || 0) - (b.blood || 0)); })[0];
          if (hurt) { tended[hurt.slot] = 1; x = Math.round(hurt.x + FOLLOWER_TEND.dx * (hurt.act === 'lie' ? 1 : 0.5)); y = Math.round(hurt.y + FOLLOWER_TEND.dy); f = faceTo(x, y, hurt.x + (hurt.act === 'lie' ? FOLLOWER_TEND.dx : 0), hurt.y - 4); } }
        out.push({ campFollower: true, follower: p.follower, look: r.look, name: r.name || '', act: act, face: f, loop: [f], beat: i % 4, x: x, y: y, ph: 0, slot: 100 + i, clip: 'wait' });
      }); } catch (e) {}
    out.sort(function (a, b) { return a.y - b.y; });
    K.folk = out; K.folkKey = key; K.hide = hide;
    return out;
  }
  function hideLead() { return !!K.hide; }
  /* the main character, when he is whole enough to walk: where his job is (he still walks to whatever you tap) */
  function leadSpot() {
    if (!K.st) return null;
    var me = K.st.acts.filter(function (e) { return e.main; })[0]; if (!me) return null;
    if (K.st.fv && !K.leadSent && CB()) { var fm = CB().fromFight().filter(function (q) { return q.main; })[0]; if (fm) return { x: fm.x, y: fm.y, act: 'stand', from: true }; }   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: he arrives where he stood when it ended */
    var sp = K.st.spots[me.i]; if (sp && me.act !== 'lie' && me.act !== 'rest' && me.act !== 'mend' && me.act !== 'sleep') return { x: sp.x, y: sp.y, act: me.act };
    var f = K.st.layout.fire; return { x: f.x + 150, y: f.y + 40, act: 'stand' };
  }
  /* what stands on the ground (the walk's blocks, his feet never inside one): each piece's footprint, the rig's metres on the picture */
  function blocks(personH) {
    if (!K.st || !K.kit) return [];
    var z = personH / ZK, mx = K.kit.ppm * z, my = K.kit.ppm * 0.7071 * z, out = [];
    K.st.layout.pieces.forEach(function (p) {
      var fp = null; if (p.sprite === 'cart') fp = [-0.5, -0.32, 0.5, 0.32]; else if (p.sprite === 'truck') fp = [-1.4, -2.6, 1.4, 2.6]; else { var e = K.kit.pieces[p.sprite === 'fire' ? 'fire_0' : p.sprite]; fp = e && e.footprint_m; }
      if (!fp) return;
      out.push([Math.round(p.x + fp[0] * mx), Math.round(p.y - fp[3] * my), Math.round(p.x + fp[2] * mx), Math.round(p.y - fp[1] * my) - 8]);
    });
    if (K.st.layout.fv && CB()) { try { out = out.concat(CB().houses()); } catch (e) {} }   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: he walks round the board's houses */
    return out;
  }
  var ACT_PIC = { rest: 'sit', clean: 'sit', tend: 'sit', mend: 'stall', cook: 'stall', watch: 'smoke', loot: 'stall', lean: 'smoke' };
  /* STAFF 2 (VAMILY rule 482, the coordinator 11/27: 'their work at camp and at his place shows (the cook cooking, the medic healing)'):
     a camp person by the fire does his trade in ANIMATION's own camp acts (BohemiaIdles.activity): the cook cooks at her pot, the
     surgeon and the alchemist tend (kneeling by the worst hurt man lying in the camp when there is one: FOLLOWER_TEND, his middle),
     the blacksmith mends (the hammer on the car door, its spark on the beat); the rest watch. A body ANIMATION has not rendered an act
     for stands as before (the act's fallback, then his idle, then his still). */
  var FOLLOWER_WORK = { cook: 'cook', surgeon: 'tend', alchemist: 'tend', blacksmith: 'mend',
    /* STAFF 2 11/27 (rule 482, the coordinator: 'the 14 of 18 camp people who still have no animation, each doing his own job'): the
       scout and the scavenger go through what they found, the lookout smokes on his watch, the paymaster and the trader go over the
       stock, the bounty hunter cleans his gun, the cartographer sits over his maps, the drill sergeant, the negotiator and the agent
       talk, the minstrel and the recruiter work a crowd (the flirt), the quartermaster unpacks; the brigand stands (his body's render
       does not match his still, so ANIMATION's pack keeps nothing of it: he watches until it does) */
    scout: 'loot', scavenger: 'loot', lookout: 'smoke', paymaster: 'stall', trader: 'stall', bounty_hunter: 'clean', cartographer: 'sit',
    drill_sergeant: 'talk', negotiator: 'talk', agent: 'talk', minstrel: 'flirt', recruiter: 'flirt', quartermaster: 'unpack' };
  /* the camp's trades' own cells: a camp person's body that is not one of the town's crew carries only his trade's act (the surgeon's
     body tends, the blacksmith's repairs: ANIMATION's tool, rendered and packed as its crew are), kept out of the town's index (there
     every man has all twenty acts, the town deals any of them: THE TOWN'S ACTIVITIES) and laid into BohemiaIdles' looks once its index
     is in, here, in the frame that draws the camp and his place's footage */
  var STAFF_ACTS = { person_town_44: { json: 'person_town_44.json', acts: ['tend'] }, person_town_23: { json: 'person_town_23.json', acts: ['repair'] },
    person_town_42: { json: 'person_town_42.json', acts: ['loot'] }, person_town_29: { json: 'person_town_29.json', acts: ['smoke'] }, person_town_36: { json: 'person_town_36.json', acts: ['stall'] }, person_town_19: { json: 'person_town_19.json', acts: ['tend'] }, person_town_26: { json: 'person_town_26.json', acts: ['clean'] }, person_town_28: { json: 'person_town_28.json', acts: ['sit'] }, person_town_14: { json: 'person_town_14.json', acts: ['talk'] }, person_town_17: { json: 'person_town_17.json', acts: ['flirt'] }, person_town_39: { json: 'person_town_39.json', acts: ['talk'] }, person_town_9: { json: 'person_town_9.json', acts: ['unpack'] }, person_town_18: { json: 'person_town_18.json', acts: ['stall'] } };
  function staffActs() { var I = root.BohemiaIdles, T = I && I.town ? I.town() : null; if (!T || !T.looks) return false;
    for (var k in STAFF_ACTS) if (!T.looks[k]) T.looks[k] = STAFF_ACTS[k]; return true; }
  (function waitIdles(n) { if (staffActs() || n > 120) return; setTimeout(function () { waitIdles(n + 1); }, 500); })(0);
  var FOLLOWER_TEND = { dx: -40, dy: 26 };
  var TURNS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];

  /* ---------------------------------------------------------------- drawing */
  function drawSprite(cx, p, sx, sy, z, alpha, squash, key) {
    var e = sprite(p); if (!e) return;
    var night = K.st && K.st.night;
    if (e.rig) { if (!e.im) return; var im = night ? dusk(e.im) : e.im;
      cx.save(); if (alpha != null) cx.globalAlpha = alpha;
      if (squash != null && squash !== 1) { cx.translate(sx, sy); cx.scale(1, squash); cx.translate(-sx, -sy); }
      cx.drawImage(im, Math.round(sx - e.foot[0] * z), Math.round(sy - e.foot[1] * z), Math.round(e.w * z), Math.round(e.h * z)); cx.restore(); return; }
    var r = key ? K.kit.pieces[key].rect : e.rect, src = night ? dusk(K.img) : K.img;
    cx.save(); if (alpha != null) cx.globalAlpha = alpha;
    if (squash != null && squash !== 1) { cx.translate(sx, sy); cx.scale(1, squash); cx.translate(-sx, -sy); }
    cx.drawImage(src, r[0], r[1], r[2], r[3], Math.round(sx - e.foot[0] * z), Math.round(sy - e.foot[1] * z), Math.round(r[2] * z), Math.round(r[3] * z));
    cx.restore();
  }
  var DUSK = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  function dusk(im) {
    if (!DUSK) return im; var d = DUSK.get(im); if (d) return d;
    /* PLUMBER 8 __THE_DUSK_IS_WORKED_OUT_ON_THE_CPU__ (rule 472(e)): the sums on a canvas kept on the CPU (no read back off the GPU), then
       copied once onto an ordinary canvas to draw from; the same pixels. window.__DUSK_ON_THE_GPU = the way it was */
    var cpu = !root.__DUSK_ON_THE_GPU, t = document.createElement('canvas'); t.width = im.naturalWidth; t.height = im.naturalHeight;
    var x = t.getContext('2d', cpu ? { willReadFrequently: true } : undefined); x.drawImage(im, 0, 0);
    try { var D = x.getImageData(0, 0, t.width, t.height), a = D.data;
      for (var i = 0; i < a.length; i += 4) { var l = a[i] * .3 + a[i + 1] * .59 + a[i + 2] * .11; a[i] = (l + (a[i] - l) * .8) * .62; a[i + 1] = (l + (a[i + 1] - l) * .8) * .62; a[i + 2] = (l + (a[i + 2] - l) * .8) * .66; }
      x.putImageData(D, 0, 0); } catch (e) {}
    var c = t; if (cpu) { c = document.createElement('canvas'); c.width = t.width; c.height = t.height; c.getContext('2d').drawImage(t, 0, 0); t.width = 0; }
    DUSK.set(im, c); return c;
  }
  function fireKey(now) { return Math.floor(now / (500 / 3)) % 6; }   /* three keys a beat, 120 BPM */
  function pieceVisible(p, now) {
    var P = K.pitch; if (!P || !P.on) return { show: true };
    var t = now - P.t0, pl = P.plan;
    if (p.kind === 'carrier') { var u = Math.min(1, t / Math.max(1, pl.roll[1])); u = 1 - Math.pow(1 - u, 3); return { show: true, dx: -(1 - u) * 900 }; }
    if (p.kind === 'tent') { var t0 = pl.tents[p.i] != null ? pl.tents[p.i] : pl.fire; if (t < t0) return { show: false }; var g = Math.min(1, (t - t0) / 380); return { show: true, squash: 0.15 + 0.85 * (1 - Math.pow(1 - g, 2)), dust: g < 1 ? g : 0 }; }
    if (p.kind === 'fire') { if (t < pl.fire) return { show: true, cold: true }; return { show: true, flare: Math.max(0, 1 - (t - pl.fire) / 600) }; }
    if (p.kind === 'supplies') return t < pl.unload[0] ? { show: false } : { show: true, squash: Math.min(1, 0.3 + (t - pl.unload[0]) / 500) };
    return t < pl.unload[1] ? { show: false } : { show: true };
  }
  function items(list, ctx) {
    if (!K.ready || !K.st || boardWait()) return;   /* CAMP THREE: nothing of the camp before its board */
    platesWarm();
    if (K.drawnNext) { K.drawnAt = K.drawnNext; } K.drawnNext = {};
    var s = ctx.s, z = ctx.personH / ZK, view = ctx.view, cx = ctx.cx, now = ctx.now;
    if (K.pitch && K.pitch.on && K.pitch.t0 != null && !K.firstAt && K.st.fv) K.firstAt = Object.assign({}, K.drawnAt || {});   /* the men as the first frame drew them */
    if (K.pitch && K.pitch.on && K.pitch.t0 != null && K.st.fv && !K.pitch.rolled) { if (motionBusy() && now - K.pitch.t0 < FV_HOLD) K.pitch.t0 = now; else K.pitch.rolled = true; }   /* the walk-in waits for the camp's own grow to land */
    if (K.pitch && K.pitch.on && K.pitch.t0 == null) { var V0 = settleView(); if (!(V0 && V0.board && /^F\|/.test(String(V0.boardKey || '')))) return;
      /* CAMP FOUR __THE_CAMP_COMES_UP_AT_ONCE__ (rule 472(d)): the camp's ground now comes in a second after MAKE CAMP, before YOU are always
         placed on it: its first frame waits for him (MOTION's hold waits for him the same way), never past six beats */
      if (K.st.fv && !root.__CAMP_FIRST_NO_LEAD) { var BSl = root.BohemiaSettlement, LDl = null, hidL = false; try { LDl = BSl && BSl.lead ? BSl.lead() : null; } catch (e) { LDl = null; }
        try { folk(); hidL = !!K.hide; } catch (e) { hidL = false; }   /* hurt, YOU lie by the fire among them (folk), not as the walker: nothing to wait for */
        if (!hidL && !(LDl && LDl.x != null)) { K.leadWaitT0 = K.leadWaitT0 || now; if (now - K.leadWaitT0 < 3000) return; } }
      K.pitch.t0 = now; K.firstFv = now; }   /* nothing of the camp before its own ground is on the glass */
    if (K.pitch && K.pitch.on && now - K.pitch.t0 > K.pitch.plan.ms) { K.pitch.on = false; K.pitch.done = now; }
    if (K.st.fv && !K.leadSent && !(K.pitch && K.pitch.on)) { K.leadSent = true;   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: the pitch done, he walks from where he fought to his job */
      try { var js = leadSpot(), BS = root.BohemiaSettlement; if (js && !js.from && BS && BS.leadTo) BS.leadTo(js.x, js.y); } catch (e) {} }
    K.st.layout.pieces.forEach(function (p) {
      var v = pieceVisible(p, now); if (!v.show) return;
      var gp = glidePos('p:' + p.key, view.ox + (p.x + (v.dx || 0)) * s, view.oy + p.y * s, now), sx = gp[0], sy = gp[1], zz = z * s;   /* a turn glides it (rule 289) */
      list.push({ y: p.y - (p.kind === 'tent' ? 40 : 0), piece: p.key, draw: function () {
        if (p.kind === 'fire') { drawSprite(cx, p, sx, sy, zz, null, null, v.cold ? 'fire_cold' : 'fire_' + fireKey(now)); return; }
        drawSprite(cx, p, sx, sy, zz, null, v.squash);
        if (p.kind === 'carrier' && p.trailer) {}   /* the trailer's render (12 m) is too long for the camp's picture: drawn when COOK cuts a camp trailer (NOTE) */
        if (v.dust) { cx.save(); cx.globalAlpha = 0.35 * (1 - v.dust); cx.fillStyle = '#c9b48d'; cx.beginPath(); cx.ellipse(sx, sy, 70 * zz * (0.6 + v.dust), 18 * zz, 0, 0, 7); cx.fill(); cx.restore(); }
      } });
    });
    /* his men: in the pitch they come out of the carrier to their places; after it, each at his act */
    /* CAMP FOUR __CAMP_WAITS_FOR_HIM__ (rule 472(b)): the clock stopped, the men keep moving about (build's drift, one man a step) */
    var WH = K.info && K.info.whole;
    if (WH && !(K.pitch && K.pitch.on)) { if (K.wholeT0 == null) K.wholeT0 = now; var drn = Math.floor((now - K.wholeT0) / (+root.__CAMP_DRIFT_MS > 0 ? +root.__CAMP_DRIFT_MS : DRIFT_MS));   /* a gate may hurry the drift (never the game) */ if (drn !== (K.drift | 0)) { K.drift = drn; try { K.st = build(K.info); K.folkKey = null; } catch (e) {} } }
    else if (!WH && K.wholeT0 != null) { K.wholeT0 = null; K.drift = 0; }
    var F = folk(), B = ctx.B, I = ctx.I, k = ctx.k, H = ctx.personH * s;
    try { barYou(ctx); } catch (e) {}   /* __THEIR_BARS_AT_A_GLANCE__: YOU, walking */
    var car = K.st.layout.pieces.filter(function (p) { return p.kind === 'carrier'; })[0];
    F.forEach(function (m, j) {
      var x = m.x, y = m.y, walking = false;
      if (K.pitch && K.pitch.on) { var pl = K.pitch.plan, t = now - K.pitch.t0, a0 = pl.roll[1] + j * 90, a1 = pl.unload[1] + j * 110;
        if (m.from) { a0 = FV_HOLD + j * 160; a1 = a0 + FV_WALK; }   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: a bar where they won, then they walk to it */
        var u = Math.max(0, Math.min(1, (t - a0) / Math.max(1, a1 - a0))), o0 = m.from || [car.x + 40, car.y + 30];   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: from where he stood when it ended */
        if (u < 1) { walking = true; x = o0[0] + (x - o0[0]) * u; y = o0[1] + (y - o0[1]) * u; if (m.from && t < a0) { walking = false; m.holding = true; } else m.holding = false; } else m.holding = false; }
      else m.holding = false;
      /* CAMP FOUR __CAMP_WAITS_FOR_HIM__ (rule 472(b), (d): no pop-in): a man whose place changes (a new job, the hour turning, the drift)
         WALKS there from where he stood, at a walking pace, facing the way he goes, never jumping */
      if (!(K.pitch && K.pitch.on) && !root.__CAMP_NO_STROLL) {
        /* only once the clock has stopped: while the hours race (two a second) the camp is the time-lapse it always was, each man at his
           hour's place (a walk there would never end) */
        var wk = m.name || m.look || ('s' + m.slot), WW = K.walk || (K.walk = {}), w0 = WW[wk], strollOn = !!(K.info && K.info.whole);
        if (!w0) w0 = WW[wk] = { tx: x, ty: y, fx: x, fy: y, lx: x, ly: y, t0: 0, ms: 0 };
        if (Math.abs(w0.tx - x) > 4 || Math.abs(w0.ty - y) > 4) { w0.fx = w0.lx; w0.fy = w0.ly; w0.tx = x; w0.ty = y; w0.t0 = now;
          w0.ms = strollOn ? Math.min(4000, 300 + Math.hypot(x - w0.fx, y - w0.fy) * 9) : 0; if (strollOn) K.strolls = (K.strolls | 0) + 1; }
        var wu = w0.ms ? (now - w0.t0) / w0.ms : 1;
        if (wu < 1) { walking = true; var ex = wu < 0.5 ? 2 * wu * wu : 1 - 2 * (1 - wu) * (1 - wu);
          var nx = w0.fx + (x - w0.fx) * ex, ny = w0.fy + (y - w0.fy) * ex, ta = Math.atan2(y - w0.fy, x - w0.fx) * 180 / Math.PI;
          m.wf = TURNS[(((Math.round((90 - ta) / 45)) % 8) + 8) % 8]; x = nx; y = ny; } else m.wf = null;
        w0.lx = x; w0.ly = y;
      }
      m.drawX = x; m.drawY = y;
      var gm = glidePos('m:' + (m.name || m.look), ctx.view.ox + x * s, ctx.view.oy + y * s, now); x = (gm[0] - ctx.view.ox) / s; y = (gm[1] - ctx.view.oy) / s;   /* he slides with the turn, still doing what he does */
      list.push({ y: y + (m.act === 'lie' || m.act === 'sleep' ? 6 : 0), man: m.slot, draw: function () {
        if (m.campFollower) campCart(cx, ctx, m, x, y, s, H, 'back', now);   /* __THE_STAFF_PUSH_A_CART__: his cart by him */
        drawMan(cx, ctx, m, x, y, walking, now, s, k, H, B, I, z);
        if (m.campFollower) campCart(cx, ctx, m, x, y, s, H, 'front', now);
        else barQ(m.main ? 'YOU' : (m.name || m.look), ctx.view.ox + x * s, ctx.view.oy + y * s, (m.act === 'lie' || m.act === 'sleep') ? H * .42 : H, m.blood, m.armour); } });   /* __THEIR_BARS_AT_A_GLANCE__ */
    });
  }
  /* ANIMATION's camp acts (records/BOHEMIA_ANIMATION_THE_CAMPS_ACTS_10_26_26.md, its call BohemiaIdles.activity): what the camp's
     own words for an act are in its pictures. 'rest' is binding a cut on a crate (its 'mend'), 'mend' is the armour at the cart
     (its 'repair', the car door and the hammer); a man who was lying and is healed gets up ONCE ('rise', from the moment he
     healed), then does his job */
  var ANIM_ACT = { lie: 'lie', sleep: 'sleep', rest: 'mend', mend: 'repair', tend: 'tend', cook: 'cook', clean: 'clean', loot: 'loot', lean: 'flirt', talk: 'talk', smoke: 'smoke', drink: 'drink', sit: 'sit' };   /* CAMP FOUR __THE_CREW_LIVES__: ANIMATION's talk, smoke, drink and sit */   /* __THE_CAMP_AFTER_A_FIGHT__: lean is the flirt's wall (the hand up on it) */   /* CAMP THREE: loot, ANIMATION's when his look has it (the aftermath's act) */
  ANIM_ACT.stall = 'stall'; ANIM_ACT.unpack = 'unpack'; ANIM_ACT.flirt = 'flirt';   /* STAFF 2 (rule 482): the camp's people's trades, ANIMATION's own acts by name */
  var RISE_MS = 4000;   /* its one slot: 24 keys, two bars at 120 BPM */
  var DRIFT_MS = 6000;   /* CAMP FOUR: twelve beats at 120 BPM between one man's next thing and the next man's */
  function animCell(m, now, face, I) {
    if (!I || !I.activity) return null;
    var key = m.name || m.look, seed = 'camp:' + key, r = K.rise && K.rise[key];
    if (r && now - r < RISE_MS) { var q0 = I.activity(m.look, seed, now, face, { act: 'rise', n: m.slot, since: r }); if (q0) return q0; }
    var a = ANIM_ACT[m.act]; if (!a) return null;
    return I.activity(m.look, seed, now, face, { act: a, n: m.slot, wall: m.act === 'lean' });
  }
  /* ==== __THE_STAFF_PUSH_A_CART__ (STAFF 2, VAMILY rule 471(c): the cart 'drawn in their hands... in the camp'): every follower by the fire
     stands with the cart his job pushes (engine/bohemia_camp.js cartOf: its kind and what is in it), the fight's own pictures of it
     (slices/fight_rig/staff_cart_<kind>.webp, its index staff_carts.json: the cart in a man's frame, the fight sheet's 98 px a man), laid at
     his feet at his height (personH / 98), facing the way he faces; its back under him, its front over him, dusk at night. ==== */
  var CARTS = { j: null, state: 0, im: {} };
  function campCartMeta() {
    if (!CARTS.state) { CARTS.state = 1; try { fetch('fight_rig/staff_carts.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { CARTS.j = j; CARTS.state = j && j.kinds ? 2 : 3; }, function () { CARTS.state = 3; }); } catch (e) { CARTS.state = 3; } }
    return CARTS.state === 2 ? CARTS.j : null;
  }
  function campCartIm(file) { var im = CARTS.im[file]; if (!im) { im = CARTS.im[file] = new Image(); im.src = 'fight_rig/' + file; } return im.complete && im.naturalWidth ? im : null; }
  function campCart(cx, ctx, m, x, y, s, H, which, now) {
    var CC = up('BohemiaCamp'), c = CC && CC.cartOf ? CC.cartOf(m.follower) : null, J = campCartMeta(); if (!c || !J) return;
    var KD = J.kinds[c.id] || J.kinds.shopping_cart, set = KD && (KD.cells[c.load] || KD.cells.gear), q = set && set[m.face] && set[m.face][which]; if (!q) return;
    var im = campCartIm(KD.file); if (!im) return;
    var src = K.st && K.st.night && ctx.duskOf ? ctx.duskOf({ im: im }) : im, z0 = H / 98, fx = ctx.view.ox + x * s, fy = ctx.view.oy + y * s;
    cx.save(); cx.imageSmoothingEnabled = false;
    cx.drawImage(src, q[0], q[1], q[2], q[3], Math.round(fx + (q[4] - J.foot[0]) * z0), Math.round(fy + (q[5] - J.foot[1]) * z0), Math.round(q[2] * z0), Math.round(q[3] * z0));
    cx.restore();
    (root.__CAMP_CARTS || (root.__CAMP_CARTS = {}))[m.follower] = { kind: c.id, load: c.load, face: m.face, which: which, at: now };
  }
  /* STAFF 2 (rule 482, 'the cart reads from every camera'): the same cart laid anywhere a camp person stands, at screen coordinates
     (his place's feed draws its people itself): his job's cart, his facing, at his height; the screens that call it count it */
  function cartAt(cx, id, face, fx, fy, H, which, dusk) {
    var CC = up('BohemiaCamp'), c = CC && CC.cartOf ? CC.cartOf(id) : null, J = campCartMeta(); if (!c || !J) return false;
    var KD = J.kinds[c.id] || J.kinds.shopping_cart, set = KD && (KD.cells[c.load] || KD.cells.gear), q = set && set[face] && set[face][which]; if (!q) return false;
    var im = campCartIm(KD.file); if (!im) return false;
    var src = dusk ? dusk({ im: im }) : im, z0 = H / 98;
    cx.save(); cx.imageSmoothingEnabled = false;
    cx.drawImage(src, q[0], q[1], q[2], q[3], Math.round(fx + (q[4] - J.foot[0]) * z0), Math.round(fy + (q[5] - J.foot[1]) * z0), Math.round(q[2] * z0), Math.round(q[3] * z0));
    cx.restore();
    (root.__HOME_CARTS || (root.__HOME_CARTS = {}))[id] = { kind: c.id, load: c.load, face: face, which: which, at: root.performance ? performance.now() : Date.now(), h: Math.round(q[3] * z0) };
    return true;
  }
  /* the cell itself, for a screen that lights it its own way (his place's footage): the sheet, the cell, and where it sits off his feet */
  function cartCellOf(id, face, which) {
    var CC = up('BohemiaCamp'), c = CC && CC.cartOf ? CC.cartOf(id) : null, J = campCartMeta(); if (!c || !J) return null;
    var KD = J.kinds[c.id] || J.kinds.shopping_cart, set = KD && (KD.cells[c.load] || KD.cells.gear), q = set && set[face] && set[face][which]; if (!q) return null;
    var im = campCartIm(KD.file); if (!im) return null;
    return { im: im, x: q[0], y: q[1], w: q[2], h: q[3], ox: q[4] - J.foot[0], oy: q[5] - J.foot[1], kind: c.id, load: c.load, H: 98 };
  }
  /* ==== /__THE_STAFF_PUSH_A_CART__ ==== */
  /* ==== CAMP FOUR __THE_HOURS_ON_THE_GROUND__ (rule 482 on rule 472(b), the coordinator 11/26: 'the time passing feels like time'):
     while his men mend the camp's hours run two a second, and the only sign was a clock. Each man's shadow now follows the hour: by day
     it swings from the low morning sun to the low evening one, long at either end and short at noon; by night it falls away from the
     fire. The hour drawn eases toward the camp's own, so the shadows sweep rather than step. window.__CAMP_FLAT_SHADOWS = the way it was. */
  function sunNow(now) {
    var tgt = K.info && typeof K.info.min === 'number' ? ((K.info.min % 1440) + 1440) % 1440 : 720;
    if (K.sunT == null) K.sunT = tgt;
    var dt = K.sunLast != null ? Math.min(100, now - K.sunLast) : 16; K.sunLast = now;
    var d = tgt - K.sunT; if (d > 720) d -= 1440; if (d < -720) d += 1440;
    K.sunT = (K.sunT + d * Math.min(1, dt / 220) + 1440) % 1440;
    return { min: K.sunT, night: !!(K.st && K.st.night), t: (K.sunT - 360) / 720 };   /* t: 0 at six in the morning, 1 at six at night */
  }
  function shadowAt(cx, ctx, fx, fy, H) {
    var rx = H * .17, ry = H * .05, a = .3, dx = 0, dy = 0;
    if (!root.__CAMP_FLAT_SHADOWS) {
      var S = K.sunF && K.sunF.at === ctx.now ? K.sunF : (K.sunF = Object.assign(sunNow(ctx.now), { at: ctx.now }));
      if (S.night || S.t < 0 || S.t > 1) {   /* the fire's light: away from it, short */
        var f = K.st && K.st.layout && K.st.layout.fire;
        if (f) { var vx = fx - (ctx.view.ox + f.x * ctx.s), vy = fy - (ctx.view.oy + f.y * ctx.s), dd = Math.hypot(vx, vy) || 1; dx = vx / dd * H * .16; dy = vy / dd * H * .03; rx = H * .2; a = .26; }
      } else { var len = Math.abs(S.t - .5) * 2; dx = (S.t - .5) * 2 * H * .26; rx = H * .17 * (1 + 1.25 * len); a = .32 - .1 * len; }
      K.shadowDx = Math.round(dx);
    }
    cx.fillStyle = 'rgba(0,0,0,' + a.toFixed(3) + ')'; cx.beginPath(); cx.ellipse(fx + dx * .5, fy + dy, rx, ry, 0, 0, 7); cx.fill();
  }
  /* ==== CAMP FOUR __THEIR_BARS_AT_A_GLANCE__ (rule 482 on rule 472(b), the coordinator 11/26: 'the crew idling and healing reads at a
     glance'): over each of his men the fight's own two bars (its rim, armour grey over blood, his side's green: BOHEMIA_FIGHT.html's
     bars, so a man in camp reads as he does in a fight), filling as the hours mend him: each hour's gain eases in and shines a beat.
     Once everyone is whole the bars stand three seconds, full, and fade: then the camp is only his men idling. YOU too, walking or lying.
     window.__CAMP_NO_BARS = the way it was. ==== */
  var BAR_RIM = '#d9a85a', BAR_ARM = '#9aa6b0', BAR_BLOOD = '#8fae6a', BAR_PT = 3;
  function barQ(key, X, Y, h, b, a) { if (root.__CAMP_NO_BARS || typeof b !== 'number') return; (K.barsQ || (K.barsQ = [])).push({ key: key, X: X, Y: Y, h: h, b: b, a: typeof a === 'number' ? a : 1 }); }
  function barYou(ctx) {   /* YOU, the walker: his bars over the settlement's own lead */
    if (K.hide || !K.st) return;
    var me = K.st.acts && K.st.acts.filter(function (e) { return e.main; })[0]; if (!me) return;
    var BS = root.BohemiaSettlement; if (!BS || !BS.lead) return;
    if (!K.leadAt || ctx.now - K.leadAt.t > 200) { var L = null; try { L = BS.lead(); } catch (e) { L = null; } K.leadAt = { t: ctx.now, x: L && L.x, y: L && L.y, lift: L && L.lift || 0 }; }
    var Lx = K.leadAt.x, Ly = K.leadAt.y; if (Lx == null || Ly == null) return;
    barQ('YOU', ctx.view.ox + Lx * ctx.s, ctx.view.oy + Ly * ctx.s - (K.leadAt.lift || 0), ctx.personH * ctx.s, me.blood, me.armour);
  }
  function barsDraw(cx, now) {
    var Q = K.barsQ; K.barsQ = []; if (!Q || !Q.length) { K.barsShown = 0; return; }
    var V = K.barV || (K.barV = {}), whole = !!(K.info && K.info.whole), al = 1;
    if (whole) { if (K.barWholeT == null) K.barWholeT = now; var tw = now - K.barWholeT; al = tw < 3000 ? 1 : Math.max(0, 1 - (tw - 3000) / 1000); } else K.barWholeT = null;
    K.barsAlpha = al; if (al <= 0) { K.barsShown = 0; return; }
    var dt = K.barLast != null ? Math.min(100, now - K.barLast) : 16, ease = Math.min(1, dt / 260); K.barLast = now;
    var cl = function (v) { return Math.max(0, Math.min(1, v)); }, n = 0, out = {};
    cx.save(); cx.globalAlpha = al;
    Q.forEach(function (q) {
      if (whole) { q.b = Math.max(q.b, .99); q.a = Math.max(q.a, .99); }   /* everyone whole is every man at 99 or more (the map's own line): never a short bar under it while the beat's read catches up */
      var v = V[q.key]; if (!v) v = V[q.key] = { b: q.b, a: q.a, tb: q.b, ta: q.a, gt: 0, pb: q.b, pa: q.a };
      if (q.b > v.tb + 0.004 || q.a > v.ta + 0.004) { v.gt = now; v.pb = v.b; v.pa = v.a; }   /* an hour mended him: it shines */
      v.tb = q.b; v.ta = q.a; v.b += (q.b - v.b) * ease; v.a += (q.a - v.a) * ease;
      var bw = Math.round(Math.max(18, q.h * .42)), bx = Math.round(q.X - bw / 2), by = Math.round(q.Y - q.h - 9);
      for (var tries = 0; tries < 6; tries++) { var hitR = null; for (var rk in out) { var o = out[rk]; if (bx < o.x + o.w + 4 && bx + bw + 4 > o.x && by < o.y + 12 && by + 12 > o.y) { hitR = o; break; } } if (!hitR) break; by = hitR.y - 12; }   /* two men side by side: one's bars stand just above the other's, never on them */
      cx.fillStyle = BAR_RIM; cx.fillRect(bx - 2, by - 2, bw + 4, BAR_PT * 2 + 5);
      cx.fillStyle = 'rgba(0,0,0,.82)'; cx.fillRect(bx - 1, by - 1, bw + 2, BAR_PT * 2 + 3);
      cx.fillStyle = BAR_ARM; cx.fillRect(bx, by, Math.round(bw * cl(v.a)), BAR_PT);
      cx.fillStyle = BAR_BLOOD; cx.fillRect(bx, by + BAR_PT + 1, Math.round(bw * cl(v.b)), BAR_PT);
      var g = now - v.gt;
      if (v.gt && g < 500) {   /* the part this hour gave back, bright, draining over a beat */
        cx.fillStyle = 'rgba(255,246,214,' + (.85 * (1 - g / 500)).toFixed(3) + ')';
        var s0 = Math.round(bw * cl(v.pa)), s1 = Math.round(bw * cl(q.a)); if (s1 > s0) cx.fillRect(bx + s0, by, s1 - s0, BAR_PT);
        var t0 = Math.round(bw * cl(v.pb)), t1 = Math.round(bw * cl(q.b)); if (t1 > t0) cx.fillRect(bx + t0, by + BAR_PT + 1, t1 - t0, BAR_PT);
      }
      out[q.key] = { x: bx, y: by, w: bw, b: Math.round(cl(v.b) * 100) / 100, a: Math.round(cl(v.a) * 100) / 100 }; n++;
    });
    cx.restore(); K.barsShown = n; K.barsAt = out;
  }
  /* ==== /__THEIR_BARS_AT_A_GLANCE__ ==== */
  /* ==== CAMP FOUR __THE_TAPE_RUNS__ (rule 482 on rule 472(b), the coordinator 11/26: 'the time passing feels like time'; the analog
     horror law: a camcorder's own words): while the hours run the camp's glass carries the tape's fast-forward in its top corner, the
     two arrows stepping on the beat, the clock and the hours gone since he sat down; the hour the last man is whole it reads STOP, three
     seconds, and goes. Drawn once an hour into a small picture (a few words, never a font a frame). window.__CAMP_NO_TAPE = off. ==== */
  /* ==== CAMP FOUR __THE_CLOCK_AT_THE_TOP__ (VAMILY rule 487, Paolo 11/27: 'take it off the phone and put it at the top of the screen cause
     I feel like people aren't connecting'; the coordinator 11/27: 'time passing in camp ties to the clock now moving to the top of the
     screen'). The tape above stood in the camp's top corner and went with the stop. NOW it is the camp's clock at the TOP of the screen,
     in the middle, under the map's bar: the day and the time with the sun or the moon, there the whole camp (stopped or running); under
     it, while the hours run, the tape's fast-forward and the hours gone; at the stop 'STOP, EVERYONE WHOLE' three seconds, then only the
     clock stays. The clock is UI FIVE's (rule 487, BUILD 11/27f THE CLOCK UP TOP: the day and the hour at the map's bar's right end, on
     every screen that wears the bar, camp too, the map's own clock read twice a second): when that clock stands (or any clock marked
     data-top-clock above this page), the camp draws no clock of its own, only the tape's line, hung under it, so the one clock at the
     top races while the tape says why; the camp's own clock at the top middle stands in only when there is none. The camp hands its time
     to the top page every hour (top.__CAMP_TIME, the event 'bohemia-camp-time'). window.__CAMP_TAPE_CORNER: the way it was. ==== */
  function topClockEl() {   /* UI FIVE's clock on the map's bar (#bmtb .s.clk, __THE_CLOCK_UP_TOP__) or any clock marked data-top-clock, in a page above this one; its box in this page's own coordinates */
    var w = root, ox = 0, oy = 0;
    for (var k = 0; k < 4; k++) {
      var fe = null; try { fe = w.frameElement; } catch (e) { fe = null; }
      if (!fe || !w.parent || w.parent === w) break;
      var r0 = fe.getBoundingClientRect(); ox += r0.left; oy += r0.top; w = w.parent;
      var el = null; try { el = w.document.querySelector('[data-top-clock], #bmtb .s.clk[data-f=clock]'); } catch (e) { el = null; }
      if (el) { var r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) return { left: r.left - ox, top: r.top - oy, width: r.width, height: r.height, bottom: r.bottom - oy, right: r.right - ox, band: !el.hasAttribute('data-top-clock') }; }
    }
    return null;
  }
  function campTimeTell(t) { try { var T = root.top; if (!T || T === root) return; var key = JSON.stringify(t); if (K.timeTold === key) return; K.timeTold = key; T.__CAMP_TIME = t; T.dispatchEvent(new T.CustomEvent('bohemia-camp-time', { detail: t })); } catch (e) {} }
  function tapeDraw(cx, ctx) {
    if (root.__CAMP_NO_TAPE || !K.st || !K.info || typeof K.info.min !== 'number' || !K.pitch || K.pitch.on || boardWait()) { K.tapeShown = null; return; }   /* once the camp is set up: its hours are what it counts */
    var corner = !!(root.__CAMP_TAPE_CORNER || (root.parent && root.parent.__CAMP_TAPE_CORNER));
    var now = ctx.now, whole = !!K.info.whole, a2 = 1;
    if (whole) { if (K.tapeWholeT == null) K.tapeWholeT = now; var tw = now - K.tapeWholeT; a2 = tw < 3000 ? 1 : Math.max(0, 1 - (tw - 3000) / 600); } else K.tapeWholeT = null;
    var two = function (n) { return (n < 10 ? '0' : '') + n; }, m = ((K.info.min % 1440) + 1440) % 1440, hrs = K.info.hours | 0, day = (K.info.day | 0) || 1, hh = Math.floor(m / 60);
    var clock = two(hh) + ':' + two(m % 60), night = hh >= 18 || hh < 6;
    campTimeTell({ on: true, day: day, min: m, night: night, hours: hrs, running: !whole, whole: whole });
    if (corner) { if (a2 <= 0) { K.tapeShown = null; return; } }
    if (!K.extAt || now - K.extAt > 500 || now < K.extAt) { K.extAt = now; K.ext = corner ? null : topClockEl();   /* UI FIVE's clock at the top, if the shell carries one (read twice a second, never a frame) */
      var ox1 = 0, oy1 = 0; try { var wv = root; while (wv && wv.parent && wv !== wv.parent && wv.frameElement) { var fr0 = wv.frameElement.getBoundingClientRect(); ox1 += fr0.left; oy1 += fr0.top; wv = wv.parent; } } catch (e) {}
      K.extOff = [ox1, oy1]; }
    var ext = K.ext;
    var l0 = corner || ext ? null : 'DAY ' + day + '  ' + clock;   /* the clock line (draft:true) */
    var l1 = corner ? (whole ? 'STOP  ' : '') + clock : (whole ? 'STOP' : '+' + hrs + (hrs === 1 ? ' HOUR' : ' HOURS'));
    var l2 = corner ? (whole ? 'EVERYONE WHOLE' : '+' + hrs + (hrs === 1 ? ' HOUR' : ' HOURS')) : (whole ? 'EVERYONE WHOLE' : null);   /* draft:true */
    var showTape = a2 > 0;
    var key = [l0, l1, l2, night, showTape].join('|');
    var F = 'BohemiaROM,BohemiaCasing,ui-monospace,monospace';
    if (K.tapeKey !== key || !K.tapeC) {
      var c = K.tapeC || (K.tapeC = document.createElement('canvas')), g = c.getContext('2d'), fs0 = 16, fs = 13, lh0 = 21, lh = 17, pad = 26;
      var tapeLine = corner ? null : (whole ? l1 + '  ' + l2 : l1);
      g.font = '700 ' + fs0 + 'px ' + F; var w0 = l0 ? g.measureText(l0).width + 24 : 0;
      g.font = '700 ' + fs + 'px ' + F; var w1 = corner ? Math.max(g.measureText('>> ' + l1).width, g.measureText(l2).width) + 30 : (showTape && tapeLine ? g.measureText(tapeLine).width + pad : 0);
      var w = Math.ceil(Math.max(w0, w1, 40)), h = corner ? lh * 2 + 8 : (l0 ? lh0 : 0) + (showTape && tapeLine ? lh : 0) + 6;
      c.width = w; c.height = Math.max(8, h); g = c.getContext('2d'); g.textBaseline = 'top';
      var ink = function (t, x, y) { g.fillStyle = 'rgba(214,40,32,.55)'; g.fillText(t, x + 2, y); g.fillStyle = 'rgba(70,196,214,.4)'; g.fillText(t, x - 1, y); g.fillStyle = 'rgba(0,0,0,.7)'; g.fillText(t, x + 1, y + 1); g.fillStyle = '#efe7d2'; g.fillText(t, x, y); };
      if (corner) { g.font = '700 ' + fs + 'px ' + F; ink(l1, 26, 2); ink(l2, 26, 2 + lh); K.tapeLay = { corner: true }; }
      else {
        var y = 2, L0 = null, L1 = null;
        if (l0) { g.font = '700 ' + fs0 + 'px ' + F; var tw0 = g.measureText(l0).width, x0c = Math.round((w - tw0 - 24) / 2);
          /* the sun or the moon, before the day */
          g.save(); g.translate(x0c + 8, y + 9);
          if (!night) { g.fillStyle = 'rgba(0,0,0,.6)'; g.beginPath(); g.arc(1, 1, 6, 0, 7); g.fill(); g.fillStyle = '#f0b84a'; g.beginPath(); g.arc(0, 0, 6, 0, 7); g.fill(); }
          else { g.fillStyle = 'rgba(0,0,0,.6)'; g.beginPath(); g.arc(1, 1, 6, 0, 7); g.fill(); g.fillStyle = '#d8dbe6'; g.beginPath(); g.arc(0, 0, 6, 0, 7); g.fill(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(3, -2, 5, 0, 7); g.fill(); }
          g.restore();
          ink(l0, x0c + 24, y); L0 = { x: x0c, y: y, w: tw0 + 24 }; y += lh0; }
        if (showTape && tapeLine) { g.font = '700 ' + fs + 'px ' + F; var tw1 = g.measureText(tapeLine).width, x1c = Math.round((w - tw1 - pad) / 2); ink(tapeLine, x1c + pad, y + 1); L1 = { x: x1c, y: y + 1 }; }
        K.tapeLay = { L0: L0, L1: L1 };
      }
      K.tapeC = c; K.tapeKey = key;
    }
    var W = ctx.cx && ctx.cx.canvas ? ctx.cx.canvas.width / ((root.devicePixelRatio || 1) || 1) : 390;
    try { var VW = root.innerWidth || W; W = VW; } catch (e) {}
    var cw0 = K.tapeC.width, x0, y0;
    if (corner) { x0 = 14; y0 = 58; }
    var ox = (K.extOff || [0, 0])[0], oy = (K.extOff || [0, 0])[1];   /* this page's place in the top page */
    if (corner) {}
    else if (ext) { var Wc = W || 390; x0 = Math.round(Math.max(4, Math.min(Wc - cw0 - 4, (ext.left + ext.width / 2) - cw0 / 2))); y0 = Math.round(Math.max(4, ext.bottom + 4)); }   /* under his clock, on this page's glass */
    else { x0 = Math.round((W - cw0) / 2); y0 = 8; }
    var beatOn = (now % 500) < 300, LY = K.tapeLay || {};
    cx.save(); cx.drawImage(K.tapeC, x0, y0);
    cx.fillStyle = '#efe7d2';
    if (corner) { cx.globalAlpha = 1;
      if (whole) cx.fillRect(x0 + 6, y0 + 4, 10, 10);
      else if (beatOn) { cx.beginPath(); cx.moveTo(x0 + 2, y0 + 3); cx.lineTo(x0 + 10, y0 + 9); cx.lineTo(x0 + 2, y0 + 15); cx.closePath(); cx.moveTo(x0 + 11, y0 + 3); cx.lineTo(x0 + 19, y0 + 9); cx.lineTo(x0 + 11, y0 + 15); cx.closePath(); cx.fill(); } }
    else if (showTape && LY.L1) { var ax = x0 + LY.L1.x + 2, ay = y0 + LY.L1.y + 1; cx.globalAlpha = a2;
      if (whole) cx.fillRect(ax + 4, ay + 2, 10, 10);   /* the stop square */
      else if (beatOn) { cx.beginPath(); cx.moveTo(ax, ay + 1); cx.lineTo(ax + 8, ay + 7); cx.lineTo(ax, ay + 13); cx.closePath(); cx.moveTo(ax + 9, ay + 1); cx.lineTo(ax + 17, ay + 7); cx.lineTo(ax + 9, ay + 13); cx.closePath(); cx.fill(); } }   /* the fast-forward, on the beat */
    cx.restore();
    K.tapeShown = { clock: l0 || clock, l1: showTape ? l1 : null, l2: showTape ? l2 : null, alpha: Math.round(a2 * 100) / 100, x: x0, y: y0, w: cw0, h: K.tapeC.height, top: !corner, under: !!ext, band: !!(ext && ext.band), night: night, pageY: Math.round(y0 + oy) };
  }
  function drawMan(cx, ctx, m, x, y, walking, now, s, k, H, B, I, z) {
    var fx = ctx.view.ox + x * s, fy = ctx.view.oy + y * s, night = K.st.night;
    var who = m.name || m.look, face0 = Math.max(0, TURNS.indexOf(m.face));
    var an = walking || m.holding ? null : animCell(m, now, face0, I);   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: holding where he won, he only stands */
    if (an) {   /* his act in his real gear (ANIMATION): lying, sleeping, binding, hammering, cooking, cleaning, kneeling, getting up */
      (K.drawnBy || (K.drawnBy = {}))[who] = 'anim:' + an.act;
      var im0 = night ? ctx.duskOf({ im: an.img }) : an.img, z0 = k * s;
      shadowAt(cx, ctx, fx, fy, H);
      cx.drawImage(im0, an.x, an.y, an.w, an.h, Math.round(fx - (an.foot[0] - an.dx) * z0), Math.round(fy - (an.foot[1] - an.dy) * z0), Math.round(an.w * z0), Math.round(an.h * z0));
      return;
    }
    (K.drawnBy || (K.drawnBy = {}))[who] = walking ? 'walk' : 'still';
    var lying = !walking && (m.act === 'lie' || m.act === 'sleep');
    if (lying) {
      var roll = K.kit && K.kit.pieces.bedroll;
      if (roll) drawSprite(cx, { sprite: 'bedroll' }, fx, fy, z * s, null, null, 'bedroll');
      var r = B && B.standing ? B.standing(m.look, 'S') : null; if (!r) return;
      var im = night ? ctx.duskOf(r) : r.im, bh = r.foot * 0.94, br = 1 + 0.02 * Math.sin(now / 4000 * Math.PI * 2 + m.slot);   /* he breathes: 15 a minute (rule 246(d)) */
      cx.save(); cx.translate(fx, fy - 6 * z * s); cx.scale(1, 0.62 * br); cx.rotate(-Math.PI / 2);
      cx.drawImage(im, Math.round(-r.mid * k * s), Math.round(-(r.foot - bh / 2) * k * s), Math.round(r.im.naturalWidth * k * s), Math.round(r.im.naturalHeight * k * s));
      if (m.act === 'lie') {   /* the bandage round his middle, a spot coming through */
        var bw = r.im.naturalWidth * 0.42 * k * s, by = (bh * 0.12) * k * s;
        cx.fillStyle = 'rgba(226,220,204,.95)'; cx.fillRect(Math.round(-bw / 2), Math.round(-by), Math.round(bw), Math.max(2, Math.round(7 * k * s)));
        cx.fillStyle = 'rgba(150,24,16,.9)'; cx.fillRect(Math.round(-bw * 0.1), Math.round(-by + 1), Math.max(2, Math.round(5 * k * s)), Math.max(2, Math.round(4 * k * s)));
      }
      cx.restore();
      if (m.act === 'sleep' && roll) {   /* the blanket over him: the bedroll's serape laid back on top, from his chest down */
        var e = K.kit.pieces.bedroll, rc = e.rect, cut = Math.round(rc[2] * 0.36), zz = z * s, src = night ? dusk(K.img) : K.img;
        cx.drawImage(src, rc[0] + cut, rc[1], rc[2] - cut, rc[3], Math.round(fx - (e.foot[0] - cut) * zz), Math.round(fy - e.foot[1] * zz), Math.round((rc[2] - cut) * zz), Math.round(rc[3] * zz));
      }
      return;
    }
    var face = Math.max(0, TURNS.indexOf(walking && m.wf ? m.wf : m.face)), q = null, act = walking || m.holding ? null : ACT_PIC[m.act];   /* CAMP FOUR: walking, he faces the way he goes */
    if (act && I && I.activity) q = I.activity(m.look, 'camp:' + (m.name || m.look), now, face, { act: act, n: m.slot });
    if (!q && I && I.frame && I.has && I.has(m.look)) q = I.frame(m.look, 'camp:' + (m.name || m.look), now, face, { set: 'bare', idles: m.act === 'watch' ? ['look', 'smoke'] : null });
    shadowAt(cx, ctx, fx, fy, H);
    if (q) { var img = night ? ctx.duskOf({ im: q.img }) : q.img, zq = k * s;
      cx.drawImage(img, q.x, q.y, q.w, q.h, Math.round(fx - (q.foot[0] - q.dx) * zq), Math.round(fy - (q.foot[1] - q.dy) * zq + (walking ? -Math.abs(Math.sin(now / 250 * Math.PI)) * 4 : 0)), Math.round(q.w * zq), Math.round(q.h * zq));
    } else {
      var rs = B && B.standing ? (B.standing(m.look, m.face) || B.standing(m.look, 'S')) : null; if (!rs) return;
      var im2 = night ? ctx.duskOf(rs) : rs.im, bob = walking ? -Math.abs(Math.sin(now / 250 * Math.PI)) * 4 : 0;
      cx.drawImage(im2, Math.round(fx - rs.mid * k * s), Math.round(fy - rs.foot * k * s + bob), Math.round(rs.im.naturalWidth * k * s), Math.round(rs.im.naturalHeight * k * s));
    }
    if (m.act === 'mend' && !walking && (Math.floor(now / 500) % 2 === 0) && (now % 500) < 140) {   /* the hammer lands on the beat: a spark */
      cx.fillStyle = 'rgba(255,214,140,.95)'; for (var i = 0; i < 4; i++) cx.fillRect(Math.round(fx + (i - 1.5) * 4 * s + 18 * s), Math.round(fy - 46 * s - (i % 2) * 5 * s), Math.max(1, Math.round(2 * s)), Math.max(1, Math.round(2 * s)));
    }
  }
  function lit(cx, key, ctx, a) {
    if (!K.st) return false;
    var p = K.st.layout.pieces.filter(function (q) { return q.key === key; })[0]; if (!p) return false;
    var s = ctx.s, z = ctx.personH / ZK * s;
    cx.save(); cx.globalCompositeOperation = 'lighter';
    drawSprite(cx, p, ctx.view.ox + p.x * s, ctx.view.oy + p.y * s, z, a, null, p.kind === 'fire' ? 'fire_' + fireKey(ctx.now) : null);
    cx.restore(); return true;
  }
  /* the fire's light on the ground: at night a warm pool that breathes with the flames; by day nothing */
  function under(cx, ctx) {
    if (!K.st || !K.ready || boardWait()) return;
    K.lastDraw = ctx.now;
    if (K.glide) K.glide.frames++;
    else if (!K.snapAt || ctx.now - K.snapAt > 2000) {   /* a quarter-size copy of the ground once a bar (MOTION 3: was a beat; the copy reads the whole glass back), held if a turn ever outruns the new ground */
      K.snapAt = ctx.now;
      try { var c0 = cx.canvas, q = K.lastSnap || (K.lastSnap = document.createElement('canvas')); q.width = Math.max(1, c0.width >> 2); q.height = Math.max(1, c0.height >> 2); q.getContext('2d').drawImage(c0, 0, 0, q.width, q.height); } catch (e) { K.lastSnap = null; }
    }
    var f = K.st.layout.fire, s = ctx.s, x = ctx.view.ox + f.x * s, y = ctx.view.oy + f.y * s;
    if (K.pitch && K.pitch.on && ctx.now - K.pitch.t0 < K.pitch.plan.fire) return;
    var fl = 0.82 + 0.18 * Math.sin(ctx.now / 500 * Math.PI) * Math.sin(ctx.now / 173);
    var R = (K.st.night ? 520 : 260) * s * fl;
    /* MOTION 3 (11/10, measured: the glow's gradient filled fresh every frame, with the hours' ghosts, cost the camp at rest from 45 to
       29 frames a second on the box, 16 on the fight's view where a man is twice as tall): the same glow drawn once into a picture,
       breathing by its size */
    cx.save(); cx.globalCompositeOperation = 'lighter'; cx.drawImage(glowOf(!!K.st.night), x - R, y - R * 0.6, R * 2, R * 1.2); cx.restore();
    if (root.__CAMP_GHOST_EACH) ghostDrawEach(cx, ctx); else ghostDraw(cx, ctx);
  }
  /* THE COMPASS (rule 269(b)) and the pitch's hint, over everything */
  var EDGE = [[0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5], [0, 0]];
  var DIRWORD = ['NORTH', 'NORTH-EAST', 'EAST', 'SOUTH-EAST', 'SOUTH', 'SOUTH-WEST', 'WEST', 'NORTH-WEST'];
  function over(cx, ctx) {
    var W = ctx.view.W, H = ctx.view.H, now = ctx.now;
    try { barsDraw(cx, now); } catch (e) {}   /* __THEIR_BARS_AT_A_GLANCE__: over every man, under the compass */
    try { tapeDraw(cx, ctx); } catch (e) {}   /* __THE_TAPE_RUNS__ */
    /* MAP stands only while no sheet is up (a sheet's buttons are where it stands) */
    if (K.peekBtn && K.st) { var sh = document.getElementById('sheet'), want = sh && sh.classList.contains('on') ? 'none' : 'flex'; if (K.peekBtn.style.display !== want) K.peekBtn.style.display = want; }
    var C = K.compass, PR = null;
    try { var pr = phone(), sc = document.getElementById('scene'), so = sc ? sc.getBoundingClientRect() : { left: 0, top: 0 }; if (pr) PR = { l: pr.left - so.left, r: pr.right - so.left, t: pr.top - so.top, b: pr.bottom - so.top, side: pr.side }; } catch (e) { PR = null; }
    if (C) {
      var best = null;
      C.forEach(function (c, i) {
        if (!c || !(c.lit > 0.02) || !c.rgb) return;
        var e = EDGE[i], ex = e[0] * W, ey = e[1] * H, corner = (i % 2) === 1;
        if (PR && ex >= PR.l - 1 && ex <= PR.r + 1 && ey >= PR.t - 1 && ey <= PR.b + 1) { ex = PR.side === 'left' ? PR.r : PR.l; ey = Math.min(ey, PR.t); }   /* a corner under the phone glows at the phone's own corner */
        var pulse = c.loss ? 0.82 + 0.18 * Math.max(0, Math.sin(now / 500 * Math.PI)) : 1;   /* a loss breathes on the beat */
        var a = Math.min(0.85, c.a * (0.4 + 0.6 * c.lit) * pulse), deep = 26 + 70 * c.lit;
        var rgb = c.rgb.join(',');
        cx.save();
        if (corner) {
          var g = cx.createRadialGradient(ex, ey, 0, ex, ey, deep * 2.4);
          g.addColorStop(0, 'rgba(' + rgb + ',' + a.toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
          cx.fillStyle = g; cx.fillRect(ex - deep * 2.4, ey - deep * 2.4, deep * 4.8, deep * 4.8);
        } else {
          var horiz = e[1] === 0 || e[1] === 1, len = (horiz ? W : H) * 0.42, gx = horiz ? 0 : (e[0] === 0 ? 1 : -1), gy = horiz ? (e[1] === 0 ? 1 : -1) : 0;
          var g2 = cx.createLinearGradient(ex, ey, ex + gx * deep, ey + gy * deep);
          g2.addColorStop(0, 'rgba(' + rgb + ',' + a.toFixed(3) + ')'); g2.addColorStop(1, 'rgba(' + rgb + ',0)');
          cx.fillStyle = g2;
          if (horiz) cx.fillRect(ex - len / 2, e[1] === 0 ? 0 : H - deep, len, deep); else cx.fillRect(e[0] === 0 ? 0 : W - deep, ey - len / 2, deep, len);
        }
        cx.restore();
        if (!best || c.lit > best.c.lit) best = { c: c, i: i };
      });
      /* the warning (267(a)): who, and how far, on the brightest edge; words are drafts */
      if (best && best.c.lit > 0.25 && best.c.who) {
        var t = String(best.c.who).toUpperCase() + ' · ' + best.c.blocks + (best.c.blocks === 1 ? ' BLOCK ' : ' BLOCKS ') + DIRWORD[best.i];
        cx.save(); cx.font = '700 10px BohemiaCasing,ui-monospace,monospace'; var tw = cx.measureText(t).width + 14;
        var e2 = EDGE[best.i], tx = Math.max(6, Math.min(W - tw - 6, e2[0] * W - tw / 2)), ty = Math.max(46, Math.min(H - 84, e2[1] * H + (e2[1] === 0 ? 50 : e2[1] === 1 ? -84 : -9)));
        if (PR && tx + tw > PR.l && tx < PR.r && ty + 18 > PR.t && ty < PR.b) { if (PR.side === 'left') tx = Math.min(W - tw - 6, PR.r + 8); else tx = Math.max(6, PR.l - tw - 8); }   /* words never under the phone (279(c)) */
        cx.fillStyle = 'rgba(14,10,7,.86)'; cx.fillRect(Math.round(tx), Math.round(ty), Math.round(tw), 18);
        cx.fillStyle = 'rgba(' + best.c.rgb.join(',') + ',1)'; cx.fillRect(Math.round(tx), Math.round(ty), 2, 18);
        cx.fillStyle = '#e9dcc4'; cx.textAlign = 'left'; cx.fillText(t, Math.round(tx + 8), Math.round(ty + 13)); cx.restore();
        K.warned = t;
      } else K.warned = null;
    }
    if (K.pitch && K.pitch.on) {
      cx.save(); cx.font = '700 10px BohemiaCasing,ui-monospace,monospace'; cx.textAlign = 'center';
      cx.fillStyle = 'rgba(14,10,7,.7)'; cx.fillRect(Math.round(W / 2 - 52), Math.round(H - 118), 104, 18);
      cx.fillStyle = 'rgba(233,220,196,' + (0.6 + 0.4 * Math.abs(Math.sin(now / 500 * Math.PI))).toFixed(2) + ')'; cx.fillText('TAP TO SKIP', Math.round(W / 2), Math.round(H - 105)); cx.restore();   /* draft:true */
    }
  }
  /* ---------------------------------------------------------------- the pitch */
  function pitchNow() {
    if (!K.st || !CL) return null;
    var plan = CL.pitch({ men: K.st.men.length, level: K.st.cart, smart: smart() });
    K.pitch = { on: true, t0: (root.performance ? performance.now() : Date.now()), plan: plan, skipped: false };
    K.leadWaitT0 = null; K.walk = {};   /* CAMP FOUR: a new camp, nobody mid-walk, YOU waited for again */
    return plan;
  }
  function tap() { if (K.pitch && K.pitch.on) { K.pitch.on = false; K.pitch.skipped = true; return true; } return false; }
  /* __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ (MOTION 3, rule 444(a)): the camp is still being set up (its screen not open yet, its pitch
     waiting for its ground, or playing): the map's clock holds (campHour) until it stands, or he taps it through */
  function settingUp() { return !K.st || !!K.pitchDue || !!(K.pitch && K.pitch.on); }

  /* ---------------------------------------------------------------- THE GHOST TIME-LAPSE (rule 273(c)): while the hours run, the
     places his men stood leave a two-percent trace, a long exposure of the hours passing */
  function ghostHour() {
    if (!K.st) return;
    var G = K.ghost || (K.ghost = { marks: [], hour: null });
    var h = (K.info && typeof K.info.day === 'number' ? K.info.day * 24 : 0) + K.st.hour;
    if (G.hour === h) return; G.hour = h;
    folk().forEach(function (m) { G.marks.push({ x: m.drawX != null ? m.drawX : m.x, y: m.drawY != null ? m.drawY : m.y, look: m.look, act: m.act, face: m.face, h: h }); });
    if (G.marks.length > 360) G.marks.splice(0, G.marks.length - 360);
  }
  /* the fire's glow, once: the same gradient the camp filled every frame (its inner circle 20 and 10 of the camp's px off a glow 260 wide
     by day, 520 at night), held as a picture */
  var GLOW = {};
  function glowOf(night) {
    var k = night ? 'n' : 'd'; if (GLOW[k]) return GLOW[k];
    var W = 256, H = 154, R0 = W / 2, base = night ? 520 : 260, a = night ? 0.30 : 0.08, c = document.createElement('canvas'); c.width = W; c.height = H;
    var g = c.getContext('2d'), gr = g.createRadialGradient(R0, H / 2 - 20 * R0 / base, 10 * R0 / base, R0, H / 2, R0);
    gr.addColorStop(0, 'rgba(255,160,70,' + (a * 1.2).toFixed(3) + ')'); gr.addColorStop(0.45, 'rgba(230,110,40,' + (a * 0.55).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(120,40,10,0)');
    g.fillStyle = gr; g.beginPath(); g.ellipse(R0, H / 2, R0, H / 2, 0, 0, 7); g.fill();
    return (GLOW[k] = c);
  }
  /* the hours' ghosts, drawn once an hour into a picture the size of what they cover (they change on the hour), the picture drawn each
     frame (MOTION 3, 11/10: was every mark every frame) */
  function ghostDraw(cx, ctx) {
    var G = K.ghost; if (!G || !G.marks.length || !ctx.B) return;
    var s = ctx.s, k = ctx.k, B = ctx.B, dpr = 0.5;   /* a long exposure at two percent: half a css px is all it needs */
    var key = G.hour + '|' + G.marks.length + '|' + ctx.view.ox + '|' + ctx.view.oy + '|' + s + '|' + dpr;
    if (K.ghostKey !== key || !K.ghostC) {
      var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, all = true, live = [];
      G.marks.forEach(function (g) { var age = (G.hour - g.h); if (age <= 0 || age > 48) return; var r = B.standing(g.look, g.face) || B.standing(g.look, 'S'); if (!r) { all = false; return; }
        var fx = ctx.view.ox + g.x * s, fy = ctx.view.oy + g.y * s, w = r.im.naturalWidth * k * s, h = r.im.naturalHeight * k * s;
        x0 = Math.min(x0, fx - w); y0 = Math.min(y0, fy - h); x1 = Math.max(x1, fx + w); y1 = Math.max(y1, fy + h); live.push({ g: g, r: r, age: age }); });
      if (!live.length) { K.ghostKey = all ? key : null; K.ghostBox = null; return; }
      var gc = K.ghostC || (K.ghostC = document.createElement('canvas')), cw = Math.max(1, Math.ceil((x1 - x0) * dpr)), ch = Math.max(1, Math.ceil((y1 - y0) * dpr));
      if (gc.width !== cw || gc.height !== ch) { gc.width = cw; gc.height = ch; }
      var q = gc.getContext('2d'); q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, cw, ch); q.setTransform(dpr, 0, 0, dpr, -x0 * dpr, -y0 * dpr);
      live.forEach(function (o) { var g = o.g, r = o.r; q.globalAlpha = 0.02 * (1 - o.age / 48) * 2.2;
        var fx = ctx.view.ox + g.x * s, fy = ctx.view.oy + g.y * s;
        if (g.act === 'lie' || g.act === 'sleep') { q.save(); q.translate(fx, fy); q.scale(1, 0.62); q.rotate(-Math.PI / 2); q.drawImage(r.im, -r.mid * k * s, -(r.foot * 0.53) * k * s, r.im.naturalWidth * k * s, r.im.naturalHeight * k * s); q.restore(); }
        else q.drawImage(r.im, fx - r.mid * k * s, fy - r.foot * k * s, r.im.naturalWidth * k * s, r.im.naturalHeight * k * s); });
      q.globalAlpha = 1; K.ghostBox = [x0, y0, x1 - x0, y1 - y0]; K.ghostKey = all ? key : null;
    }
    if (K.ghostBox) { var sm = cx.imageSmoothingEnabled; cx.imageSmoothingEnabled = true; cx.drawImage(K.ghostC, K.ghostBox[0], K.ghostBox[1], K.ghostBox[2], K.ghostBox[3]); cx.imageSmoothingEnabled = sm; }
    return;
  }
  function ghostDrawEach(cx, ctx) {   /* the way it was drawn, every mark every frame (kept for a check: window.__CAMP_GHOST_EACH) */
    var G = K.ghost; if (!G || !G.marks.length || !ctx.B) return;
    var s = ctx.s, k = ctx.k, B = ctx.B;
    cx.save();
    G.marks.forEach(function (g) {
      var age = (G.hour - g.h); if (age <= 0 || age > 48) return;
      var r = B.standing(g.look, g.face) || B.standing(g.look, 'S'); if (!r) return;
      cx.globalAlpha = 0.02 * (1 - age / 48) * 2.2;
      var fx = ctx.view.ox + g.x * s, fy = ctx.view.oy + g.y * s;
      if (g.act === 'lie' || g.act === 'sleep') { cx.save(); cx.translate(fx, fy); cx.scale(1, 0.62); cx.rotate(-Math.PI / 2); cx.drawImage(r.im, -r.mid * k * s, -(r.foot * 0.53) * k * s, r.im.naturalWidth * k * s, r.im.naturalHeight * k * s); cx.restore(); }
      else cx.drawImage(r.im, fx - r.mid * k * s, fy - r.foot * k * s, r.im.naturalWidth * k * s, r.im.naturalHeight * k * s);
    });
    cx.restore();
  }

  /* ---------------------------------------------------------------- what the map hands (the compass, his men's condition) */
  function reads(d) {
    if (!d) return;
    if (Array.isArray(d.compass)) K.compass = d.compass;
    if (Array.isArray(d.threats)) K.threats = d.threats;
    if (d.men && typeof d.men === 'object') { K.men = d.men; K.reads++; }
  }
  /* ---------------------------------------------------------------- THE CAMP FITS THE PHONE (rule 286(a)(b), CAMP TWO [the camp fits the
     phone]): UI TWO's one phone stands in his corner over the camp too (slices/bohemia_phone.js, BOH_PHONE_RECT() in this frame's
     own pixels). The camp is composed in what the phone leaves (its fire at the open centre), the MAP plate stands beside the phone,
     never under it, and the camp's own BREAK CAMP goes while the phone is on: the phone's HEAL is the camp's one door (no button
     twice) */
  function phone() { try { var f = root.BOH_PHONE_RECT, r = f ? f() : null; return r && r.on ? r : null; } catch (e) { return null; } }
  function phoneOn() { return !!phone(); }
  (function () { try { var st = document.createElement('style'); st.textContent = 'html.camp2-phone #leave{display:none!important}'; (document.head || document.documentElement).appendChild(st); } catch (e) {} })();
  function placePlates() {
    var r = phone(), on = !!(K.st && r);
    try { document.documentElement.classList.toggle('camp2-phone', on); } catch (e) {}
    var b = K.peekBtn; if (!b) return;
    if (r) { b.style.bottom = Math.max(10, Math.round(innerHeight - r.bottom)) + 'px';
      if (r.side === 'left') { b.style.left = Math.round(r.right + 10) + 'px'; b.style.right = ''; } else { b.style.right = Math.round(innerWidth - r.left + 10) + 'px'; b.style.left = ''; } }
    else { b.style.bottom = '17px'; b.style.right = '186px'; b.style.left = ''; }
  }
  root.addEventListener('bohemia-phone', function () { placePlates(); K.composed = null; });
  root.addEventListener('resize', function () { K.composed = null; });
  /* where the camp's middle goes: its fire at the centre of what the phone leaves of the glass (BohemiaPhone.openCentre), as the
     picture pans; once a camp, a side, a size, so a drag of his is never undone */
  function compose(view, scene, W, H) {
    K.view = view;
    if (!K.st) return null;
    var P = root.BohemiaPhone, r = phone(), key = (r ? r.side : 'none') + '|' + W + 'x' + H + '|' + (K.info && K.info.block ? K.info.block.join(',') : '');
    if (K.composed === key) return null; K.composed = key;
    if (K.st.tall && K.info) {   /* the phone came or went on an upright glass: the camp rises or settles, gliding */
      var was = K.st.layout.lift | 0, nb = build(K.info);
      if (nb && Math.abs((nb.layout.lift | 0) - was) > 8) {
        /* a glide already running (a turn) just takes the new spots as its ends; else the rise is its own beat */
        if (!K.glide) K.glide = { t0: null, frames: 0, from: Object.assign({}, K.drawnAt || {}), snap: null, n: K.flips | 0, kind: 'lift' };
        K.st = nb; K.folkKey = null; }
    }
    if (K.st.layout.fv && CB()) { var FS = CB().fvState(); if (FS) {   /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: every tile where the fight had it on the glass */
      var SV = settleView(), A0 = (SV && SV.area) || { x0: 0, x1: W, y0: 0, y1: H }, off = topOf(), fx = FS.fx - off.x - (scene ? scene.left : 0), fy = FS.fy - off.y - (scene ? scene.top : 0);
      var ox = fx + FS.ox0, oy = fy + FS.oy0;
      return { cx: ((A0.x0 + A0.x1) / 2 - ox) / view.s, cy: ((A0.y0 + A0.y1) / 2 - oy) / view.s, key: key, fv: true }; } }
    var oc = P && P.openCentre ? P.openCentre() : null, f = K.st.layout.fire;
    var ocx = oc ? oc.x - (scene ? scene.left : 0) : W / 2, ocy = oc ? oc.y - (scene ? scene.top : 0) : H / 2;
    return { cx: f.x + (W / 2 - ocx) / view.s, cy: f.y + (H / 2 - ocy) / view.s, key: key };
  }
  /* __THE_CAMP_IS_THE_FIGHTS_BOARD__: this frame's top left on the game's glass (the fight's camera was kept in the glass's own px) */
  function topOf() { var x = 0, y = 0, w = root; try { while (w && w !== w.top && w.frameElement) { var r = w.frameElement.getBoundingClientRect(); x += r.left; y += r.top; w = w.parent; } } catch (e) {} return { x: x, y: y }; }
  function fvOn() { var C = CB(); return !!(C && C.fvOn && C.fvOn()); }
  function motionBusy() { try { var M = motion(); return !!(M && M.busy && M.busy()); } catch (e) { return false; } }
  function settleView() { try { var BS = root.BohemiaSettlement; return BS && BS.campView ? BS.campView() : null; } catch (e) { return null; } }
  /* the settlement's camera scale in the fight's view: a man as tall on the glass as he was in the fight */
  function fightScale() { var C = CB(); if (!K.st || !K.st.fv || !C || !C.fvOn()) return 0; var F = C.fvState(); return F && F.q > 0 ? 1 / F.q : 0; }
  /* every man's pictures asked for the moment the camp is laid (while its board bakes), so its first frame has its men: measured, the
     camp's first frame on the fight's board drew none of the three (their stills and walks not in yet) */
  function warmLooks(A) {
    var I = root.BohemiaIdles, Bd = root.BohemiaRigBodies; if (!A || !A.length) return;
    var key = A.map(function (e) { return e.look + ':' + e.act; }).join(','); if (K.warmed === key) return; K.warmed = key;
    /* in the order they are drawn: each man standing, then what he does now, then what a camp after a fight asks of him by day */
    A.forEach(function (e) { try { if (Bd && Bd.standing) TURNS.forEach(function (t) { Bd.standing(e.look, t); }); if (I && I.frame && I.has && I.has(e.look)) I.frame(e.look, 'camp:warm', 0, 0, { set: 'bare' }); } catch (x) {} });
    [function (e) { return ANIM_ACT[e.act]; }, function (e) { return ACT_PIC[e.act]; }, function () { return 'loot'; }, function () { return 'flirt'; }, function () { return 'rise'; }].forEach(function (f) {
      A.forEach(function (e) { try { var a = f(e); if (a && I && I.activity) I.activity(e.look, 'camp:warm', 0, 0, { act: a, n: 0, wall: a === 'flirt' }); } catch (x) {} }); });
  }
  /* MAP: the live map with the camp at its spot and the hours running (rule 260(b)); the map's own call does it */
  function peek() { try { var M = root.parent && root.parent.BohemiaCampMap; if (M && M.peek) return M.peek(true); } catch (e) {} return false; }
  function peekPlate(on) {
    var b = K.peekBtn;
    if (!b && on && document.body) {
      b = K.peekBtn = document.createElement('div'); b.id = 'camppeek'; b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0'); b.setAttribute('aria-label', 'the map: the city goes on');
      b.textContent = 'MAP';   /* draft:true */
      b.setAttribute('style', 'position:fixed;right:186px;bottom:17px;z-index:80;display:none;min-width:52px;height:44px;padding:0 9px;box-sizing:border-box;align-items:center;justify-content:center;border-radius:7px;cursor:pointer;'
        + 'font:700 12px BohemiaCasing,ui-monospace,monospace;letter-spacing:1.5px;color:#e8dcc0;background:linear-gradient(#2e271b,#15110a);box-shadow:inset 0 1px 0 rgba(231,216,187,.20),inset 0 -2px 0 #0b0906,0 2px 0 rgba(0,0,0,.55),0 6px 16px rgba(0,0,0,.45);-webkit-tap-highlight-color:transparent;user-select:none;touch-action:manipulation');
      b.setAttribute('data-morph', 'campmap');
      b.addEventListener('click', function (e) { try { e.stopPropagation(); } catch (x) {} peek(); });
      document.body.appendChild(b);
    }
    if (b) b.style.display = on ? 'flex' : 'none';
    placePlates();
  }
  /* a pinch out or the wheel out on the camp is the map (one pinch, city to street, rule 258's other way) */
  (function () {
    var t0 = null, wheel = 0, wt = 0;
    var on = function () { return !!(K.info && K.st && K.peekBtn && K.peekBtn.style.display !== 'none'); };
    root.addEventListener('touchstart', function (e) { if (e.touches && e.touches.length === 2) { var a = e.touches[0], b = e.touches[1]; t0 = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); } }, { passive: true });
    root.addEventListener('touchmove', function (e) { if (t0 == null || !e.touches || e.touches.length !== 2 || !on()) return; var a = e.touches[0], b = e.touches[1], d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (d < t0 * 0.66) { t0 = null; peek(); } }, { passive: true });
    root.addEventListener('touchend', function () { t0 = null; }, { passive: true });
    root.addEventListener('wheel', function (e) { if (!on()) return; var n = performance.now(); if (n - wt > 600) wheel = 0; wt = n; wheel += e.deltaY; if (wheel > 260) { wheel = 0; peek(); } }, { passive: true });
  })();
  /* __THE_CAMP_LETS_GO_WHEN_HE_LEAVES__ (MOTION 3, ask row 560, found by PLUMBER 8: leaving camp froze 1.4 s on his phone with the
     CPU slowed 4x). MEASURED (a CPU profile of the leave, the demo upright, the CPU slowed 4x): the camp's board page (a hidden copy of
     the fight page beside the map) was let go only when a town opened, so a camp broken before its board came in left the page
     loading and baking behind the map: 650 ms in one piece 3.5 s after the leave (its setup, its deal, its bake), then its landing
     copied the pictures for a camp that was gone. NOW the map calls this the moment the camp breaks (campBreak, a marked line) and the
     settlement screen as the map hides it (townLetGo): the camp broken (the map's own __CAMP.on false; a peek at the map keeps it), a
     board still baking is let go at once (its page never bakes), a board already in lets its pictures go after the map's way back. window.__CAMP_LEAVE_KEEPS_BOARD (here or on the top page) = the way it was. */
  function away() {
    var off = false; try { off = !!(root.__CAMP_LEAVE_KEEPS_BOARD || (root.top && root.top.__CAMP_LEAVE_KEEPS_BOARD)); } catch (e) {}
    if (off) return false;
    var on = null; try { on = root.parent && root.parent !== root && root.parent.__CAMP ? !!root.parent.__CAMP.on : null; } catch (e) {}
    if (on !== false) return false;   /* a peek at the map, or no camp made: the camp stands, its board kept */
    var C = CB(), st = null; try { st = C && C.state ? C.state().state : null; } catch (e) {}
    clearTimeout(K.awayT); K.awayT = 0;
    if (st === 'baking') { close(); K.awayN = (K.awayN | 0) + 1; K.awayHow = 'baking'; return 'now'; }
    if (!K.st && st !== 'in') return false;
    K.awayT = setTimeout(function () { K.awayT = 0; var on2 = null; try { on2 = root.parent && root.parent.__CAMP ? !!root.parent.__CAMP.on : null; } catch (e) {}
      if (on2 === false) { close(); K.awayN = (K.awayN | 0) + 1; K.awayHow = 'in'; } }, AWAY_MS);
    return 'later';
  }
  var AWAY_MS = 1600;
  function close() { peekPlate(false); K.leadSent = false; K.pitch = null; K.compass = null; K.ghost = null; K.st = null; K.composed = null; K.pitchDue = false; placePlates(); try { if (CB()) CB().drop(); } catch (e) {} }   /* CAMP THREE: a town opened, the board's pictures let go */
  root.addEventListener('message', function (ev) { var d = ev && ev.data; if (d && d.type === 'BOHEMIA_CAMP_LOOK') { reads(d); if (K.st && K.info) { var was = K.st.key; time(K.info); } } });
  function state() {
    return { ready: K.ready, open: !!K.st, tents: K.st ? K.st.layout.tents : null, men: K.st ? K.st.men.length : 0, carrier: K.st ? K.st.layout.carrier.id : null,
      pieces: K.st ? K.st.layout.pieces.map(function (p) { return { key: p.key, kind: p.kind, sprite: p.sprite, x: p.x, y: p.y, follower: p.follower || null }; }) : [],
      acts: K.st ? K.st.acts.map(function (e) { return { name: e.main ? 'YOU' : e.name, look: e.look, act: e.act, lookout: !!e.lookout, blood: Math.round(e.blood * 1000) / 1000, armour: Math.round(e.armour * 1000) / 1000, by: e.by }; }) : [],
      hour: K.st ? K.st.hour : null, night: K.st ? K.st.night : null, tall: K.st ? !!K.st.tall : null, fire: K.st ? K.st.layout.fire : null, flips: K.flips | 0, drawnBy: K.drawnBy || {}, rose: Object.keys(K.rise || {}), gliding: !!K.glide, lastGlide: K.lastGlide || null, lastFlip: K.lastFlip || null, lift: K.st ? K.st.layout.lift | 0 : 0, pitch: K.pitch ? { on: K.pitch.on, ms: K.pitch.plan.ms, skipped: K.pitch.skipped, carrier: K.pitch.plan.carrier } : null,
      bodies: K.bodiesNow || [], walls: K.wallsNow || [], drawnAt: K.drawnAt || {}, firstAt: K.firstAt || null, firstFv: K.firstFv || null, spots: K.st ? K.st.acts.map(function (e) { var sp = K.st.spots[e.i]; return sp ? { name: e.main ? 'YOU' : e.name, act: e.act, x: sp.x, y: sp.y, face: sp.face, wall: sp.wall || null } : null; }).filter(Boolean) : [], compass: K.compass, warned: K.warned || null, reads: K.reads, menRead: K.men, hideLead: K.hide, ghost: K.ghost ? K.ghost.marks.length : 0, peek: !!(K.peekBtn && K.peekBtn.style.display !== 'none'),
      /* CAMP FOUR __CAMP_WAITS_FOR_HIM__: the camp at rest, read by THE CAMP WAITS FOR HIM */
      whole: !!(K.info && K.info.whole), drift: K.drift | 0, strolls: K.strolls | 0, lastDraw: K.lastDraw || null,
      nightIn: K.nightIn | 0, tape: K.tapeShown || null, bars: { shown: K.barsShown | 0, alpha: K.barsAlpha == null ? null : Math.round(K.barsAlpha * 100) / 100, at: K.barsAt || {} }, sun: { min: K.sunT == null ? null : Math.round(K.sunT), shadowDx: K.shadowDx == null ? null : K.shadowDx },   /* CAMP FOUR rule 482 */
      walking: Object.keys(K.walk || {}).filter(function (k) { var w = K.walk[k], n = root.performance ? performance.now() : Date.now(); return w.ms && n - w.t0 < w.ms; }),
      drawnPos: (K.folk || []).map(function (m) { return { name: m.name || (m.main ? 'YOU' : m.look), x: m.drawX != null ? Math.round(m.drawX) : null, y: m.drawY != null ? Math.round(m.drawY) : null, act: m.act }; }) };
  }
  root.BohemiaCampLook = { cartAt: cartAt, cartCellOf: cartCellOf, fightScale: fightScale, fightView: function () { var C = CB(); return C && C.fvState ? C.fvState() : null; }, glass: function () { return K.st ? glassOf(K.st.layout) : null; }, ready: function () { return !!CL; }, variant: variant, board: function () { var C = CB(); return C ? C.state() : null; }, boardIn: boardIn, open: open, time: time, boxes: boxes, names: names, sheetKey: sheetKey, sleepers: sleepers, doing: doing,
    folk: folk, hideLead: hideLead, leadSpot: leadSpot, phone: phone, phoneOn: phoneOn, compose: compose, wantTall: wantTall, tier: tier, wantsFlip: wantsFlip, flip: flip, holdFrame: holdFrame, drawn: drawn, blocks: blocks, items: items, lit: lit, under: under, over: over, tap: tap, pitchNow: pitchNow, reads: reads, peek: peek, close: close, away: away, awayN: function () { return { n: K.awayN | 0, how: K.awayHow || null }; }, settingUp: settingUp, state: state, ZK: ZK };
})(typeof window !== 'undefined' ? window : this);
