/* BOHEMIA WOUND FACES -- THE FACE SHOWS THE WOUND (PORTRAIT [the face shows the wound], rule 234(c), 10/26/26).
   PAOLO 10/26: 'let's get creative with how it's gonna affect their portrait... to be able to visually tell that like either an
   eye patch or a serious brain shit or like blood somewhere like a band-aid there like the ear cut off there like the nose'
   (records/BOHEMIA_PAOLO_STRUCK_DOWN_HE_STILL_FIGHTS_AND_HIS_FACE_SHOWS_IT_10_26_26.md).
   Every injury row has a MARK (records/target/portrait/wounds/BOHEMIA_WOUND_MARKS.json), and every mark is a PATCH rendered from
   the man's own model under the rig's sun (tools/bohemia_portrait_the_face_shows_the_wound.py, on the free runner): what the
   mark ADDS to his face, and what it CUTS away (the ear gone off the head's edge). Battle Brothers' bust is layers, the head and
   an injury layer over it; this is the same: his face is drawn as it always is, then each of his marks over it, in the data's
   order, at the size the face is drawn (the 128 for big boxes, the 64 for the thumbs), on every mouth he talks with.
   WHAT HE CARRIES is CAMP's (engine/bohemia_condition.js injuryOf, engine/bohemia_long_injury.js look): his marks for life and
   his fresh wound today. A fresh wound shows BLOOD and a BAND-AID while over half its days are left, the BAND-AID alone after,
   nothing once it has closed; a mark for life never comes off.
     BohemiaWoundFaces.marksOf(look)            the mark ids to draw for the man wearing this look today ([] when he is whole)
     BohemiaWoundFaces.marksFor(injury)          the same from an injury ({marks, fresh:'blood'|'bandage'|null, injuries:[{id, left}]})
     BohemiaWoundFaces.set(look, injury)         a screen that knows the man says so (null clears it)
     BohemiaWoundFaces.over(ctx, look, key, size, again)   his marks drawn over the face just painted; again() once the patches land
     BohemiaWoundFaces.has(look)                 the runner has made this face's patches
   engine/bohemia_crew_faces.js calls over() after every face it paints, so the crew screen, the town, the spoils and the map all
   show the marks with no line of their own. Words are attempts, draft:true. */
(function (root) {
  'use strict';
  var BASE = '../records/target/portrait/wounds/';
  /* the data file's rows -> marks, inlined for a page that cannot fetch (the gate holds the copy to the file) */
  var ROW_MARK = {"brain_damage":"skull_stitches","broken_arm":"sling","broken_elbow_joint":"sling","broken_knee":"tag","broken_leg":"tag","broken_nose":"nose_tape","broken_ribs":"tag","bruised_leg":"tag","burnt_face":"burn","burnt_hands":"sling","burnt_leg":"tag","crushed_finger":"sling","crushed_windpipe":"neck_wrap","cut_achilles_tendon":"tag","cut_arm":"sling","cut_arm_sinew":"sling","cut_artery":"tag","cut_leg_muscles":"tag","cut_neck_vein":"neck_wrap","deep_abdominal_cut":"tag","deep_chest_cut":"tag","deep_face_cut":"face_stitches","dislocated_shoulder":"sling","exposed_ribs":"tag","fractured_elbow":"sling","fractured_hand":"sling","fractured_ribs":"tag","fractured_skull":"head_bandage","grazed_eye_socket":"eye_pad","grazed_kidney":"tag","grazed_neck":"neck_wrap","infected_wound":"tag","inhaled_flames":"burn","injured_knee_cap":"tag","injured_shoulder":"sling","maimed_foot":"tag","missing_ear":"ear_gone","missing_eye":"eye_patch","missing_finger":"tag","missing_nose":"nose_gone","partly_collapsed_lung":"trach_scar","pierced_arm_muscles":"sling","pierced_cheek":"face_stitches","pierced_chest":"tag","pierced_hand":"sling","pierced_leg_muscles":"tag","pierced_lung":"tag","pierced_side":"tag","ripped_ear":"ear_bandage","severe_concussion":"head_bandage","sick":"tag","smashed_hand":"sling","split_hand":"sling","split_nose":"nose_tape","split_shoulder":"sling","sprained_ankle":"tag","stabbed_guts":"tag","traumatized":"haunted","weakened_heart":"heart_scar"};
  var ORDER = ["haunted","ear_gone","nose_gone","heart_scar","trach_scar","skull_stitches","burn","face_stitches","neck_wrap","sling","tag","eye_patch","ear_bandage","eye_pad","nose_tape","head_bandage","blood","bandaid"];
  var FRESH = { blood: ['blood', 'bandaid'], bandage: ['bandaid'] };
  var COVERED = 'tag';
  var IDX = {}, IMG = {}, ASK = {}, WAIT = {}, SET = {};

  function json(k) { try { return JSON.parse(root.localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function data() {
    if (ASK.data || typeof fetch === 'undefined') return; ASK.data = 1;
    fetch((root.BOHEMIA_WOUNDS_BASE || BASE) + 'BOHEMIA_WOUND_MARKS.json').then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.rows) { var m = {}; Object.keys(j.rows).forEach(function (k) { m[k] = j.rows[k].mark; }); ROW_MARK = m; }
      if (j && Array.isArray(j.order)) ORDER = j.order.slice();
    }).catch(function () {});
  }
  /* the marks from what he carries: each mark for life, each temporary injury still healing, the fresh wound's stage */
  function marksFor(inj) {
    if (!inj) return [];
    var on = {};
    var L = root.BohemiaLongInjury;
    var lk = inj.look || ('fresh' in inj ? inj : null) || (L && L.look && inj.marks ? L.look(inj.marks, inj.wound) : null) || inj;
    (lk.marks || []).forEach(function (id) { var m = ROW_MARK[id && id.id || id]; if (m) on[m] = 1; });
    (inj.injuries || []).forEach(function (j) { if (j && ROW_MARK[j.id] && !(j.left <= 0)) on[ROW_MARK[j.id]] = 1; });
    (FRESH[lk.fresh] || []).forEach(function (m) { on[m] = 1; });
    return ORDER.filter(function (m) { return on[m]; });
  }
  /* who wears this look today: a screen's word first, then CAMP's book of what each man carries */
  function injuryOf(look) {
    if (Object.prototype.hasOwnProperty.call(SET, look)) return SET[look];
    var C = root.BohemiaCondition, s = json('bohemia.condition.v1');
    if (!s || !s.men) return null;
    for (var k in s.men) {
      var m = s.men[k]; if (!m || (m.look || (k === 'YOU' ? 'you' : null)) !== look) continue;
      if (C && C.injuryOf) { try { var r = C.injuryOf(m.shown || k, k === 'YOU'); if (r) return r; } catch (e) {} }
      if (m.marks || m.wound) {   /* CAMP's book without its module on the page: the same reading */
        var L = root.BohemiaLongInjury, w = m.wound && m.wound.left > 0 ? m.wound : null;
        return { marks: m.marks || [], wound: w, look: L && L.look ? L.look(m.marks || [], w) : { marks: m.marks || [], fresh: w ? (w.left / Math.max(1e-9, w.of) > 0.5 ? 'blood' : 'bandage') : null } };
      }
      /* before CAMP's [struck down] carries the marks in its book: the crew screen's own book of the same man by his name
         (slices/BOHEMIA_ROSTER_SCREEN.html saveClimb: mark {id}, hurt {days, of}) */
      var cl = json('bohemia.climb.v1'), nm = String(m.shown || k), c = cl && (cl[nm] || cl[nm.toUpperCase()]);
      if (c && (c.mark || c.hurt)) {
        var h = c.hurt && c.hurt.days > 0 ? c.hurt : null;
        return { marks: c.mark && c.mark.id ? [c.mark.id] : [], look: { marks: c.mark && c.mark.id ? [c.mark.id] : [], fresh: h ? (h.days / Math.max(1, h.of || h.days) > 0.5 ? 'blood' : 'bandage') : null } };
      }
    }
    return null;
  }
  function marksOf(look) { return marksFor(injuryOf(look)); }
  function set(look, inj) { if (inj == null) delete SET[look]; else SET[look] = inj; }

  function load(look, cb) {
    if (IDX[look] === false) return;
    if (IDX[look] && IMG[look] && IMG[look].complete && IMG[look].naturalWidth) { cb(); return; }
    (WAIT[look] = WAIT[look] || []).push(cb);
    if (ASK[look] || typeof fetch === 'undefined') return; ASK[look] = 1;
    var b = root.BOHEMIA_WOUNDS_BASE || BASE;
    var fail = function () { IDX[look] = false; WAIT[look] = []; };
    fetch(b + look + '.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      IDX[look] = j; var im = IMG[look] = new Image();
      im.onload = function () { var w = WAIT[look] || []; WAIT[look] = []; w.forEach(function (f) { try { f(); } catch (e) {} }); };
      im.onerror = fail; im.src = b + look + '.png';
    }).catch(fail);
  }
  function piece(x, im, q, k, size) {
    var n = size > 64 ? 128 : 64, s = size / n;
    x.drawImage(im, q[0], q[1], q[2], q[3], q[4] * s, q[5] * s, q[2] * s, q[3] * s);
  }
  /* his marks over the face just painted into x (size x size): each mark's CUT cleared, then its ADD drawn */
  function draw(x, look, key, size, marks) {
    var J = IDX[look], im = IMG[look]; if (!J || !im) return false;
    var n = String(size > 64 ? 128 : 64), done = 0, shown = [];
    var at = function (m) { var r = J.rows && J.rows[m]; return r ? ((r[key] && r[key][n]) || (r.rest && r.rest[n]) || null) : null; };
    /* a mark his own gear hides at this size (a collar over the surgeon's scar, a hood over the ear: the full batch, measured,
       13 of 2,754 at 128, 17 at 64) is the surgeon's tag in his ear instead, once, so a hurt man never reads whole */
    var list = [];
    marks.forEach(function (m) { var u = at(m) ? m : (COVERED !== m && at(COVERED) ? COVERED : null); if (u && list.indexOf(u) < 0) list.push(u); });
    x.save(); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    list.forEach(function (m) {
      var q = at(m);
      if (q.cut) { x.globalCompositeOperation = 'destination-out'; piece(x, im, q.cut, key, size); }
      if (q.add) { x.globalCompositeOperation = 'source-over'; piece(x, im, q.add, key, size); }
      done++; shown.push(m);
    });
    x.restore();
    if (x.canvas && x.canvas.dataset) { x.canvas.dataset.wounds = marks.join(' '); x.canvas.dataset.shown = shown.join(' '); }
    return done > 0;
  }
  function over(x, look, key, size, again, marks) {
    marks = marks || marksOf(look);
    if (x && x.canvas && x.canvas.dataset) x.canvas.dataset.wounds = marks.join(' ');
    if (!marks.length) return false;
    if (IDX[look] && IMG[look] && IMG[look].complete && IMG[look].naturalWidth) return draw(x, look, key || 'rest', size, marks);
    load(look, function () { if (again) again(); else draw(x, look, key || 'rest', size, marks); });
    return false;
  }
  function has(look) { return !!IDX[look]; }

  /* ==== EVERY FACE BREATHES (PORTRAIT [every face breathes], rule 246, Paolo 10/26: 'I wanna see my crew, anytime they're on the
     screen, or anytime anyone's on the screen with a portrait, just slightly moving, like breathing... if they have a serious
     wound maybe they could be reacting to it') ====
     ONE CLOCK for every face on the page, on the game's grid: three keys a beat at 120 BPM, and nothing between two keys is ever
     drawn (AN ENVELOPE RAMPS SLOWER THAN THE GRID). A breath every eight beats (15 a minute, inside a resting man's 12 to 20):
     the face rises a pixel at 128 (half at the 64 thumb) and settles; a blink every 3 to 6 seconds, one key (the lids' own Blink
     key, rendered); the eyes to one side now and then (each eyeball turned on its own centre, rendered); and a man carrying a
     wound winces (his face's own Angry key, the lids narrowed, rendered) with the breath catching, every few seconds while it is
     fresh, less often as it heals, now and then for a mark for life. The frames are renders of his own model beside his marks
     (the '_blink', '_look_l', '_look_r', '_wince' rows of his atlas); a face with none still breathes. While a face talks its
     mouth is the talker's (engine/bohemia_crew_faces.js talk) and this clock leaves it alone. */
  var KEY_MS = 60000 / 120 / 3, LIVE = [], CLOCK = null, K = 0, STILL = false;
  function seed(look, salt) { var h = 2166136261 >>> 0, t = String(look) + '|' + salt; for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return (h >>> 0) / 4294967296; }
  /* how hurt he is, for the wince: 3 fresh (the blood), 2 mending (the band-aid), 1 a mark for life, 0 whole */
  function hurt(marks) {
    if (marks.indexOf('blood') >= 0) return 3;
    if (marks.indexOf('bandaid') >= 0) return 2;
    return marks.length ? 1 : 0;
  }
  function lifeAt(e, k) {
    var amp = e.size / 128, ph = ((k + e.off) % 24) / 24;
    var dy = -amp * (0.5 - 0.5 * Math.cos(2 * Math.PI * ph));      /* in for twelve keys, out for twelve */
    var h = hurt(marksOf(e.look)), frame = null;
    var pw = h === 3 ? 30 : h === 2 ? 48 : h === 1 ? 84 : 0;          /* a wince every 5 s fresh, 8 s mending, 14 s for life */
    var pb = 18 + Math.floor(seed(e.look, 'b') * 18), pl = 40 + Math.floor(seed(e.look, 'l') * 30);
    if (pw && (k + e.off * 3) % pw < 3) { frame = '_wince'; dy = -amp * 0.9; }   /* the breath catches */
    else if ((k + e.off) % pb === 0) frame = '_blink';
    else if ((k + e.off * 2) % pl < 4) frame = (Math.floor((k + e.off * 2) / pl) % 2) ? '_look_l' : '_look_r';
    return { dy: Math.round(dy * 2) / 2, frame: frame };
  }
  /* the life frame over the face just painted: the same ADD and CUT as a mark */
  function lifeOver(x, look, frame, size) {
    var J = IDX[look], im = IMG[look]; if (!frame || !J || !im || !J.rows || !J.rows[frame]) return false;
    var q = J.rows[frame].rest && J.rows[frame].rest[String(size > 64 ? 128 : 64)]; if (!q) return false;
    x.save(); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    if (q.cut) { x.globalCompositeOperation = 'destination-out'; piece(x, im, q.cut, 'rest', size); }
    if (q.add) { x.globalCompositeOperation = 'source-over'; piece(x, im, q.add, 'rest', size); }
    x.restore(); return true;
  }
  function tick() {
    if (STILL) return;
    K++;
    for (var i = LIVE.length - 1; i >= 0; i--) {
      var e = LIVE[i], c = e.c;
      if (!c.isConnected) { if (e.seen || K - e.born > 30) LIVE.splice(i, 1); continue; }
      e.seen = true;
      if (c.__talk) { e.last = ''; continue; }
      var f = lifeAt(e, K), key = (f.frame || '') + '|' + f.dy;
      if (f.frame && !has(e.look)) load(e.look, function () {});
      if (key === e.last) continue;
      e.last = key; c.dataset.life = key;
      try { e.repaint(f.dy, f.frame); } catch (err) {}
    }
    if (!LIVE.length && CLOCK) { clearInterval(CLOCK); CLOCK = null; }
  }
  function live(c, look, size, repaint) {
    if (!c || !repaint || typeof setInterval === 'undefined') return false;
    for (var i = 0; i < LIVE.length; i++) if (LIVE[i].c === c) { LIVE[i].look = look; LIVE[i].size = size; LIVE[i].repaint = repaint; return true; }
    LIVE.push({ c: c, look: look, size: size, repaint: repaint, off: Math.floor(seed(look, 'o') * 24), last: '', born: K, seen: false });
    if (!CLOCK) CLOCK = setInterval(tick, KEY_MS);
    return true;
  }
  /* still(true): every face holds its resting picture (a gate comparing pixels, a screen that wants a still face); still(false)
     lets them breathe again */
  function still(on) {
    STILL = !!on;
    if (STILL) LIVE.forEach(function (e) { if (e.last !== '|0') { e.last = '|0'; if (e.c.dataset) e.c.dataset.life = '|0'; try { e.repaint(0, null); } catch (err) {} } });
    return STILL;
  }
  /* ==== end EVERY FACE BREATHES ==== */
  root.BohemiaWoundFaces = { ROW_MARK: ROW_MARK, ORDER: ORDER, marksOf: marksOf, marksFor: marksFor, injuryOf: injuryOf, set: set,
    over: over, has: has, load: load, live: live, lifeAt: lifeAt, lifeOver: lifeOver, KEY_MS: KEY_MS, hurt: hurt, still: still };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.BohemiaWoundFaces;
  data();
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
