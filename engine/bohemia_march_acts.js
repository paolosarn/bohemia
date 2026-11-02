/* BOHEMIA -- THEY MEND ON THE MARCH (ANIMATION, ask line 314, Paolo 11/2: 'I like these animations, let's make this happen... it
   has to look good, that's the main thing... I'm not sure if it needs to be customizable to all the items, I prefer maybe not').
   records/BOHEMIA_ANIMATION_HEALING_AND_MENDING_ON_THE_MARCH_11_2_26.md

   WHILE THE PARTY WALKS THE MAP, A MAN WHO IS HEALING OR MENDING DOES ONE OF HIS FOUR AS HE WALKS; THE WALK GOES ON UNDER IT.
     bind    wraps a bandage round his forearm, biting the end to pull it tight    (he is short of hitpoints, badly)
     pills   shakes pills out of a bottle and swallows them dry                    (he is short of hitpoints, a little)
     tape    duct tapes his cracked plate, tears the tape with his teeth            (his body armour is down and the company has tape)
     helmet  knocks the dent out of his helmet with his knife's butt, puts it on    (his helmet is down and the company has tape;
                                                                                    a real helmet: a hood or a bandana has no dent)
   The map heals and mends on the march (engine/bohemia_condition.js elapse: hitpoints back an hour at a time, armour paid in
   TAPE), so he works on the march itself; with no tape nothing is mended, so nobody tapes.

   WHO AND WHEN (every number in records/target/bb/march_acts.json, a modder's file): picked by what he is short of; one or two
   men at a time across the party, never everyone; an act starts on a bar and lasts its whole bars (two or three); then that
   man rests several bars before he works again; nothing in the march's first bars (nothing happens in the first second).
   Only while walking, and only facing the camera or across it (S SE E SW W): turned away his hands are behind his body, and a
   hand at a mouth seen from behind reads as a scratch at the back of the head (the 9/24 graveyard's lesson). If he stops or
   turns away the act ends where it is.

   THE PICTURES (slices/rig_march, tools/bohemia_animation_they_mend_on_the_march.py): every pose of an act on each of the six
   keys of HIS OWN WALK, so the legs are his map walk's legs; each cell laid in his map walk frame's box; a second sheet holds
   only his arms and what his hands hold, drawn again over the plate the map lays on him; the held helmet's middle per cell.

     BohemiaMarch.load()                              the index and the numbers, once
     BohemiaMarch.frame(who, look, need, face, walkPh, moving, now)
                                                      null, or what to draw for him this frame: {act, pose, key, leg, img,
                                                      cell [sx, sy, sw, sh, cx, cy] (cx, cy: where it sits in his walk
                                                      frame's box), front (the arms sheet, same cells), helm [x, y] (the held
                                                      helmet's middle in the box) or null}
     BohemiaMarch.need(o)                             {hp, head, body, tape}: what he is short of (o: {main:true} | {look})
     BohemiaMarch.force(who, act)                     start an act on him at the next frame (the proof and the vote page)
     BohemiaMarch.acting()                            {who: act} now
     BohemiaMarch.drew                                {act: frames drawn} (the checker's count)
*/
(function (root) {
  'use strict';
  var BASE = root.BOHEMIA_MARCH_BASE || 'rig_march/', DATA_URL = root.BOHEMIA_MARCH_DATA || '../records/target/bb/march_acts.json';   /* a page elsewhere (the vote page) points them home */
  var SEEN = ['S', 'SE', 'E', 'SW', 'W'];
  var IDX = null, NUM = null, state = 0, SHEETS = {}, MEN = {}, FORCED = {}, drew = {};
  var DEF = { men_at_once: 2, start_chance: 0.45, rest_bars_min: 6, rest_bars_max: 12, first_bars: 2, bandage_below: 0.6,
              heal_below: 0.99, mend_min_points: 1, keys_per_beat: 3, beat_ms: 500 };
  var HARD = ['riot_helmet', 'moto_helmet', 'hard_hat', 'brim_helmet', 'welder_mask'];
  function num(k) { var v = NUM && NUM[k]; return v && typeof v.value === 'number' ? v.value : DEF[k]; }
  function hard() { var v = NUM && NUM.helmet_hard_classes; return v && Array.isArray(v.value) ? v.value : HARD; }
  function hash(a, b) { var h = 2166136261 ^ (a | 0); h = Math.imul(h, 16777619) ^ (b | 0); h = Math.imul(h ^ (h >>> 13), 16777619); return ((h >>> 0) % 100000) / 100000; }
  function strHash(s) { var h = 7; s = String(s); for (var i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return h; }
  function load() {
    if (state) return; state = 1;
    var base = BASE;
    try {
      root.fetch(base + 'rig_march.json').then(function (r) { return r.json(); }).then(function (j) { IDX = j; state = 2; }).catch(function () { state = 3; });
      root.fetch(DATA_URL).then(function (r) { return r.json(); }).then(function (j) { NUM = j; }).catch(function () {});
    } catch (e) { state = 3; }
  }
  function sheet(look, act) {
    var k = look + ':' + act, S = SHEETS[k];
    if (S) return S.state === 2 ? S : null;
    var L = IDX && IDX.looks[look]; if (!L || !L.acts[act]) return null;
    S = SHEETS[k] = { state: 1, img: null, front: null };
    var n = 0, done = function () { if (++n === 2) S.state = (S.img && S.front) ? 2 : 3; };
    var a = new Image(), b = new Image();
    a.onload = function () { S.img = a; done(); }; a.onerror = function () { S.img = null; done(); };
    b.onload = function () { S.front = b; done(); }; b.onerror = function () { S.front = null; done(); };
    a.src = BASE + L.acts[act].file; b.src = BASE + L.acts[act].front;
    return null;
  }
  /* what he is short of: his record in the company's condition (his hitpoints, his helmet's and his body piece's points), and
     the company's tape (the march mends only with tape) */
  function need(o) {
    var C = root.BohemiaCondition; if (!C || !C.get) return null;
    var s = C.get(), r = null;
    if (o && o.main) r = s.men.YOU || null;
    else if (o && o.look) for (var k in s.men) { var m = s.men[k]; if (m && m.look === o.look && !m.main) { r = m; break; } }
    if (!r) return null;
    var tape = 0; try { var W = JSON.parse(root.localStorage.getItem('bohemia.supplies.v1') || 'null'); tape = W ? Math.max(0, W.tape | 0) : 0; } catch (e) {}
    var hpF = r.hpMax > 0 ? Math.max(0, 1 - (r.lostHp || 0) / r.hpMax) : 1;
    /* a helmet has a dent to knock out; a hood, a bandana or a rag does not (his head piece's class, CHARACTER's wear table) */
    var W = root.BohemiaWear, hid = r.head || null, cls = null;
    try { if (!hid && W && W.wearOf) { var ww = W.wearOf(o.main ? 'you' : o.look); hid = ww && ww.head; } if (W && W.piece && hid) { var pc = W.piece('head', hid); cls = pc && pc.cls; } } catch (e) {}
    return { hp: hpF, head: r.lostH || 0, body: r.lostB || 0, tape: tape, helmet: cls ? hard().indexOf(cls) >= 0 : false, headCls: cls };
  }
  function choose(who, n, bar) {
    if (!n) return null;
    var out = [], mm = num('mend_min_points');
    if (n.hp < num('heal_below')) out.push(n.hp < num('bandage_below') ? 'bind' : 'pills');
    if (n.tape > 0 && n.body >= mm) out.push('tape');
    if (n.tape > 0 && n.head >= mm && n.helmet) out.push('helmet');
    if (!out.length) return null;
    return out[Math.floor(hash(strHash(who), bar * 7 + 3) * out.length) % out.length];
  }
  function timeline(act) { var A = IDX && IDX.acts[act]; return A ? A.timeline : null; }
  function total(act) { var t = timeline(act), n = 0; if (t) for (var i = 0; i < t.length; i++) n += t[i][1]; return n; }
  function poseAt(act, k) { var t = timeline(act); if (!t) return null; for (var i = 0; i < t.length; i++) { if (k < t[i][1]) return t[i][0]; k -= t[i][1]; } return null; }
  function acting() { var o = {}; for (var w in MEN) if (MEN[w].act) o[w] = MEN[w].act; return o; }
  function busy(but) { var n = 0; for (var w in MEN) if (w !== but && MEN[w].act) n++; return n; }

  function frame(who, look, o, face, walkPh, moving, now) {
    load(); if (state !== 2 || !look) return null;
    var L = IDX.looks[look]; if (!L) return null;
    now = now == null ? (root.performance ? root.performance.now() : Date.now()) : now;
    var keyMs = num('beat_ms') / num('keys_per_beat'), key = Math.floor(now / keyMs), bar = Math.floor(key / 12);
    var M = MEN[who] || (MEN[who] = { act: null, t0: 0, rest: 0, bar: -1, march: null });
    var seen = SEEN.indexOf(face) >= 0;
    if (!moving || walkPh == null) { M.march = null; if (M.act) { M.act = null; M.rest = key + 12 * num('rest_bars_min'); } return null; }
    if (M.march == null) M.march = key;
    if (M.act && !seen) { M.act = null; M.rest = key + 12 * num('rest_bars_min'); return null; }
    if (!M.act && FORCED[who] && seen) { var fa = FORCED[who]; if (sheet(look, fa)) { M.act = fa; M.t0 = key; delete FORCED[who]; } }
    if (!M.act && seen && bar !== M.bar) {
      M.bar = bar;
      if (key >= M.rest && key - M.march >= 12 * num('first_bars') && busy(who) < num('men_at_once')) {
        var act = choose(who, need(o), bar);
        if (act && L.acts[act]) {
          var S = sheet(look, act);   /* asked for the moment he needs it; he starts on the first bar it is in */
          if (S && hash(strHash(who), bar) < num('start_chance')) { M.act = act; M.t0 = bar * 12; }
        }
      }
    }
    if (!M.act) return null;
    var k = key - M.t0, n = total(M.act);
    if (k >= n) { M.act = null; var span = num('rest_bars_max') - num('rest_bars_min'); M.rest = key + 12 * (num('rest_bars_min') + Math.floor(hash(strHash(who), bar + 11) * (span + 1))); return null; }
    var S2 = sheet(look, M.act); if (!S2) return null;
    var pose = poseAt(M.act, k), leg = Math.floor((((walkPh % 1) + 1) % 1) * 6) % 6;
    var C = L.acts[M.act].cells, c = C[face] && C[face][pose] && C[face][pose][leg]; if (!c) return null;
    var H = L.acts[M.act].helm, h = H && H[face] && H[face][pose] && H[face][pose][leg];
    drew[M.act] = (drew[M.act] | 0) + 1;
    return { act: M.act, pose: pose, key: k, leg: leg, img: S2.img, front: S2.front, cell: c, helm: h || null, box: L.box };
  }
  root.BohemiaMarch = { load: load, frame: frame, need: need, acting: acting, drew: drew, SEEN: SEEN,
    ready: function () { return state === 2; }, index: function () { return IDX; },
    force: function (who, act) { FORCED[who] = act; },
    reset: function () { MEN = {}; FORCED = {}; } };
  try { if (root.document) setTimeout(load, 0); } catch (e) {}
})(typeof window !== 'undefined' ? window : this);
