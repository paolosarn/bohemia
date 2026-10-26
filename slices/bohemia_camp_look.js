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
   Words are attempts, draft:true. */
(function (root) {
  'use strict';
  var CL = root.BohemiaCampLife;
  var K = { kit: null, img: null, rig: {}, ready: false, st: null, info: null, compass: null, threats: null, pitch: null, lastMade: null,
    men: null, folkKey: null, folk: [], hide: false, peekBtn: null, reads: 0, ghost: null };
  var BASE = 'camp_two/';
  try { fetch(BASE + 'kit.json').then(function (r) { return r.json(); }).then(function (j) { K.kit = j;
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
    c.forEach(function (m) { if (m && m.look && m.look !== 'you') out.push({ name: m.name || '', look: m.look, main: false }); });
    return out;
  }
  function build(info) {
    if (!CL) return null;
    var C = up('BohemiaCamp'), cart = C ? C.cart().level : 0, ret = C ? C.retinue() : [];
    var men = companyOf(info), cond = up('BohemiaCondition');
    var block = info && info.block ? info.block : [0, 0];
    var L = CL.layout({ men: men.length, level: cart, smart: smart(), followers: ret, kills: (info && info.kills) | 0, seed: block[0] * 7 + block[1] * 13 });
    var M = men.map(function (m) {
      var r = CL.manOf(m, cond);
      if (K.men) {   /* the map's read of each man by his look (the names the marker's list does not carry) */
        var g = null; for (var key in K.men) { var e = K.men[key]; if ((m.main && key === 'YOU') || (!m.main && e && e.look && e.look === m.look)) { g = e; break; } }
        if (g) { r.blood = g.blood; r.armour = g.armour; if (!m.main && g.name) r.name = m.name = g.name; }
      }
      return r; });
    var min = (info && info.min) | 0, hour = Math.floor(min / 60), night = !!(info && info.night);
    var A = CL.acts(M, { hour: hour, night: night, seed: (block[0] + block[1]) % 5 });
    var P = CL.spots(A, L);
    return { layout: L, men: M, acts: A, spots: P, hour: hour, night: night, cart: cart, retinue: ret, key: A.map(function (e) { return e.act; }).join(',') + '|' + L.pieces.length + '|' + cart + '|' + ret.join(',') };
  }
  function open(info, S) {
    K.info = info || {};
    K.st = build(K.info);
    /* the pitch plays when the map made a new camp (its own count of camps made), never on a reopen or a peek back */
    var made = null; try { made = root.parent && root.parent.__CAMP ? root.parent.__CAMP.made | 0 : null; } catch (e) {}
    if (made != null && made !== K.lastMade && K.st) { K.lastMade = made; pitchNow(); }
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
  }
  function variant() {
    if (!K.kit) return null;
    var p = K.kit.plate;
    return { src: p.src, night_src: p.night_src, dir: BASE, px: p.px.slice(), hotspots: {}, lights: 1, camp2: true };
  }
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
    if (!K.st) return order;
    K.st.layout.pieces.forEach(function (p) {
      if (!p.tap) return; var r = pieceRect(p, z); if (!r) return;
      VAR.boxes[p.key] = r.map(Math.round); order.push(p.key);
    });
    return order;
  }
  var FW = { cook: 'THE COOK', blacksmith: 'THE BLACKSMITH', surgeon: 'THE SURGEON', lookout: 'THE LOOKOUT', scout: 'THE SCOUT', paymaster: 'THE PAYMASTER' };
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
  var SAYS = { lie: 'is down, bandaged', rest: 'binds a cut by the fire', mend: 'mends his armour', tend: 'sits with the hurt', cook: 'cooks', clean: 'cleans a gun', watch: 'keeps watch', sleep: 'sleeps' };
  function doing() {
    if (!K.st) return [];
    return K.st.acts.map(function (e) { return (e.main ? 'YOU' : (e.name || 'ONE OF YOURS')) + ' ' + (SAYS[e.act] || 'rests'); });
  }

  /* ---------------------------------------------------------------- his men, by what they do */
  function folk() {
    if (!K.st) return [];
    var key = K.st.key + '|' + K.st.hour;
    if (K.folkKey === key) return K.folk;
    var out = [], hide = false;
    K.st.acts.forEach(function (e) {
      var sp = K.st.spots[e.i]; if (!sp) return;
      if (e.main) { if (e.act === 'lie' || e.act === 'rest' || e.act === 'mend' || e.act === 'sleep') hide = true; else return; }   /* the main character walks to your taps unless he is hurt */
      out.push({ campMan: true, camp2: true, slot: e.i, look: e.look, name: e.main ? '' : e.name, main: e.main, act: e.act, by: e.by, face: sp.face, loop: [sp.face], beat: e.i % 4, x: sp.x, y: sp.y, ph: 0,
        clip: e.act === 'watch' ? 'smoke' : 'wait', blood: e.blood, armour: e.armour });
    });
    out.sort(function (a, b) { return a.y - b.y; });
    K.folk = out; K.folkKey = key; K.hide = hide;
    return out;
  }
  function hideLead() { return !!K.hide; }
  /* the main character, when he is whole enough to walk: where his job is (he still walks to whatever you tap) */
  function leadSpot() {
    if (!K.st) return null;
    var me = K.st.acts.filter(function (e) { return e.main; })[0]; if (!me) return null;
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
    return out;
  }
  var ACT_PIC = { rest: 'sit', clean: 'sit', tend: 'sit', mend: 'stall', cook: 'stall', watch: 'smoke' };
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
    var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; var x = c.getContext('2d'); x.drawImage(im, 0, 0);
    try { var D = x.getImageData(0, 0, c.width, c.height), a = D.data;
      for (var i = 0; i < a.length; i += 4) { var l = a[i] * .3 + a[i + 1] * .59 + a[i + 2] * .11; a[i] = (l + (a[i] - l) * .8) * .62; a[i + 1] = (l + (a[i + 1] - l) * .8) * .62; a[i + 2] = (l + (a[i + 2] - l) * .8) * .66; }
      x.putImageData(D, 0, 0); } catch (e) {}
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
    if (!K.ready || !K.st) return;
    var s = ctx.s, z = ctx.personH / ZK, view = ctx.view, cx = ctx.cx, now = ctx.now;
    if (K.pitch && K.pitch.on && now - K.pitch.t0 > K.pitch.plan.ms) { K.pitch.on = false; K.pitch.done = now; }
    K.st.layout.pieces.forEach(function (p) {
      var v = pieceVisible(p, now); if (!v.show) return;
      var sx = view.ox + (p.x + (v.dx || 0)) * s, sy = view.oy + p.y * s, zz = z * s;
      list.push({ y: p.y - (p.kind === 'tent' ? 40 : 0), piece: p.key, draw: function () {
        if (p.kind === 'fire') { drawSprite(cx, p, sx, sy, zz, null, null, v.cold ? 'fire_cold' : 'fire_' + fireKey(now)); return; }
        drawSprite(cx, p, sx, sy, zz, null, v.squash);
        if (p.kind === 'carrier' && p.trailer) {}   /* the trailer's render (12 m) is too long for the camp's picture: drawn when COOK cuts a camp trailer (NOTE) */
        if (v.dust) { cx.save(); cx.globalAlpha = 0.35 * (1 - v.dust); cx.fillStyle = '#c9b48d'; cx.beginPath(); cx.ellipse(sx, sy, 70 * zz * (0.6 + v.dust), 18 * zz, 0, 0, 7); cx.fill(); cx.restore(); }
      } });
    });
    /* his men: in the pitch they come out of the carrier to their places; after it, each at his act */
    var F = folk(), B = ctx.B, I = ctx.I, k = ctx.k, H = ctx.personH * s;
    var car = K.st.layout.pieces.filter(function (p) { return p.kind === 'carrier'; })[0];
    F.forEach(function (m, j) {
      var x = m.x, y = m.y, walking = false;
      if (K.pitch && K.pitch.on) { var pl = K.pitch.plan, t = now - K.pitch.t0, a0 = pl.roll[1] + j * 90, a1 = pl.unload[1] + j * 110;
        var u = Math.max(0, Math.min(1, (t - a0) / Math.max(1, a1 - a0))); if (u < 1) { walking = true; x = car.x + 40 + (x - car.x - 40) * u; y = car.y + 30 + (y - car.y - 30) * u; } }
      m.drawX = x; m.drawY = y;
      list.push({ y: y + (m.act === 'lie' || m.act === 'sleep' ? 6 : 0), man: m.slot, draw: function () { drawMan(cx, ctx, m, x, y, walking, now, s, k, H, B, I, z); } });
    });
  }
  function drawMan(cx, ctx, m, x, y, walking, now, s, k, H, B, I, z) {
    var fx = ctx.view.ox + x * s, fy = ctx.view.oy + y * s, night = K.st.night;
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
    var face = Math.max(0, TURNS.indexOf(m.face)), q = null, act = walking ? null : ACT_PIC[m.act];
    if (act && I && I.activity) q = I.activity(m.look, 'camp:' + (m.name || m.look), now, face, { act: act, n: m.slot });
    if (!q && I && I.frame && I.has && I.has(m.look)) q = I.frame(m.look, 'camp:' + (m.name || m.look), now, face, { set: 'bare', idles: m.act === 'watch' ? ['look', 'smoke'] : null });
    cx.fillStyle = 'rgba(0,0,0,.3)'; cx.beginPath(); cx.ellipse(fx, fy, H * .17, H * .05, 0, 0, 7); cx.fill();
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
    if (!K.st || !K.ready) return;
    var f = K.st.layout.fire, s = ctx.s, x = ctx.view.ox + f.x * s, y = ctx.view.oy + f.y * s;
    if (K.pitch && K.pitch.on && ctx.now - K.pitch.t0 < K.pitch.plan.fire) return;
    var fl = 0.82 + 0.18 * Math.sin(ctx.now / 500 * Math.PI) * Math.sin(ctx.now / 173);
    var R = (K.st.night ? 520 : 260) * s * fl, a = K.st.night ? 0.30 : 0.08;
    var g = cx.createRadialGradient(x, y - 20 * s, 10 * s, x, y, R);
    g.addColorStop(0, 'rgba(255,160,70,' + (a * 1.2).toFixed(3) + ')'); g.addColorStop(0.45, 'rgba(230,110,40,' + (a * 0.55).toFixed(3) + ')'); g.addColorStop(1, 'rgba(120,40,10,0)');
    cx.save(); cx.globalCompositeOperation = 'lighter'; cx.fillStyle = g; cx.beginPath(); cx.ellipse(x, y, R, R * 0.6, 0, 0, 7); cx.fill(); cx.restore();
    ghostDraw(cx, ctx);
  }
  /* THE COMPASS (rule 269(b)) and the pitch's hint, over everything */
  var EDGE = [[0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5], [0, 0]];
  var DIRWORD = ['NORTH', 'NORTH-EAST', 'EAST', 'SOUTH-EAST', 'SOUTH', 'SOUTH-WEST', 'WEST', 'NORTH-WEST'];
  function over(cx, ctx) {
    var W = ctx.view.W, H = ctx.view.H, now = ctx.now;
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
    return plan;
  }
  function tap() { if (K.pitch && K.pitch.on) { K.pitch.on = false; K.pitch.skipped = true; return true; } return false; }

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
  function ghostDraw(cx, ctx) {
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
    if (!K.st) return null;
    var P = root.BohemiaPhone, r = phone(), key = (r ? r.side : 'none') + '|' + W + 'x' + H + '|' + (K.info && K.info.block ? K.info.block.join(',') : '');
    if (K.composed === key) return null; K.composed = key;
    var oc = P && P.openCentre ? P.openCentre() : null, f = K.st.layout.fire;
    var ocx = oc ? oc.x - (scene ? scene.left : 0) : W / 2, ocy = oc ? oc.y - (scene ? scene.top : 0) : H / 2;
    return { cx: f.x + (W / 2 - ocx) / view.s, cy: f.y + (H / 2 - ocy) / view.s, key: key };
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
  function close() { peekPlate(false); K.pitch = null; K.compass = null; K.ghost = null; K.st = null; K.composed = null; placePlates(); }
  root.addEventListener('message', function (ev) { var d = ev && ev.data; if (d && d.type === 'BOHEMIA_CAMP_LOOK') { reads(d); if (K.st && K.info) { var was = K.st.key; time(K.info); } } });
  function state() {
    return { ready: K.ready, open: !!K.st, tents: K.st ? K.st.layout.tents : null, men: K.st ? K.st.men.length : 0, carrier: K.st ? K.st.layout.carrier.id : null,
      pieces: K.st ? K.st.layout.pieces.map(function (p) { return { key: p.key, kind: p.kind, sprite: p.sprite, x: p.x, y: p.y, follower: p.follower || null }; }) : [],
      acts: K.st ? K.st.acts.map(function (e) { return { name: e.main ? 'YOU' : e.name, look: e.look, act: e.act, blood: Math.round(e.blood * 1000) / 1000, armour: Math.round(e.armour * 1000) / 1000, by: e.by }; }) : [],
      hour: K.st ? K.st.hour : null, night: K.st ? K.st.night : null, pitch: K.pitch ? { on: K.pitch.on, ms: K.pitch.plan.ms, skipped: K.pitch.skipped, carrier: K.pitch.plan.carrier } : null,
      compass: K.compass, warned: K.warned || null, reads: K.reads, menRead: K.men, hideLead: K.hide, ghost: K.ghost ? K.ghost.marks.length : 0, peek: !!(K.peekBtn && K.peekBtn.style.display !== 'none') };
  }
  root.BohemiaCampLook = { ready: function () { return K.ready && !!CL; }, variant: variant, open: open, time: time, boxes: boxes, names: names, sheetKey: sheetKey, sleepers: sleepers, doing: doing,
    folk: folk, hideLead: hideLead, leadSpot: leadSpot, phone: phone, phoneOn: phoneOn, compose: compose, blocks: blocks, items: items, lit: lit, under: under, over: over, tap: tap, pitchNow: pitchNow, reads: reads, peek: peek, close: close, state: state, ZK: ZK };
})(typeof window !== 'undefined' ? window : this);
