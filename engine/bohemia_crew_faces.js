/* BOHEMIA CREW FACES -- the fresh portrait, for every screen RUN TWO draws a man on
   (RUN TWO [the fresh portraits wired in], 10/18/26, rule 115(h) AMENDED: 'I liked it when it was the portrait, not
   when you zoom in on the creepy model's face... it has to be made fresh portrait').
   PORTRAIT's thirteen (eb12c4a2): YOU and the twelve cast looks, each a head modelled on that look's own body and
   rendered FOR THE PORTRAIT with its own camera, framing and light, handed off at
   records/target/portrait/crew/<look>/<key>_{64|128}.png (keys rest A E O M Angry Sad Surprised; already square).
   A crop or zoom of a body sprite or a body render is never a portrait, not even as a stopgap: the old bank that did
   that (slices/rig_faces/, a rig body's head cut out and scaled x4) is gone, and gates/no_face_from_a_body_gate.js
   fails any screen that draws one again.
     BohemiaCrewFaces.has(look)                 PORTRAIT has made this look's fresh portrait (the thirteen below, and any look
                                                PORTRAIT adds to its manifest BOHEMIA_CREW_FACES.json: read at load, no code to change)
     BohemiaCrewFaces.ready(cb)                 cb() once the manifest is read (or failed); the thirteen work before it
     BohemiaCrewFaces.src(look, key, size)      the file, or null
     BohemiaCrewFaces.draw(ctx, look, size, onMiss)   the resting face into ctx at size x size; onMiss() if it fails
     BohemiaCrewFaces.talk(canvas, look, line)  the mouth says the line, one syllable a half beat (120 BPM), then rests
     BohemiaCrewFaces.sounds(line)              the mouth keys a line is said with, in order */
(function (root) {
  'use strict';
  var LOOKS = ['you', 'cast_longcoat', 'cast_barearms', 'cast_pack', 'cast_skirt', 'cast_widebrim', 'cast_cape',
    'cast_apron', 'cast_poncho', 'cast_bedroll', 'cast_shorts', 'cast_satchel', 'cast_shortcoat'];
  /* RUN TWO [the 3D models on your screens], 10/19 (rule 121(e): a portrait is a render of the rig's own head, never the
     old painted 64 beside a 3D body): PORTRAIT's thirteen gang heads (3d29bd66, rendered on CHARACTER's skins and the gangs'
     own clothes, every key at 64 and 128 on disk) speak for the valley's people; its manifest still lists the crew only */
  ['anarchists', 'blues', 'caravans', 'cartel', 'church', 'colorful', 'homeless', 'mob', 'network', 'reds', 'remnants',
    'trades', 'volunteers'].forEach(function (g) { LOOKS.push('faction_' + g); });
  var BASE = '../records/target/portrait/crew/';   /* the screens live in slices/; Pages publishes records/target */
  var SIZE = 128, SOUND_MS = 250;                   /* half a beat at 120 BPM, the alpha's VISEME_MS */
  var READ = false, WAIT = [];
  /* NO TWO PEOPLE ALIKE (RUN TWO, 10/23, rule 121(i)): a rolled person (engine/bohemia_people_mix.js) talks under the head
     rendered from his own model, rest and the four mouths (records/target/character/barber/person_<id>/face/), so the face
     wears his cut, his beard and his hat (ONE ID, ONE WHOLE PERSON) */
  var PBASE = '../records/target/character/barber/';
  var ROLLED = null;
  function rolled(look) {
    if (!ROLLED) { var M = root.BOHEMIA_PEOPLE_MIX; if (!M) return false; ROLLED = {}; M.people.forEach(function (p) { ROLLED[p.look] = 1; }); }
    return ROLLED[look] === 1;
  }
  function has(look) { return LOOKS.indexOf(look) >= 0 || rolled(look); }
  /* RUN TWO [every speaker has a face], 10/18: a look PORTRAIT adds to its manifest wears its face the moment the file
     says so (the faction looks the street wears are next on PORTRAIT's board) */
  function ready(cb) { if (READ) { if (cb) cb(); } else if (cb) WAIT.push(cb); }
  function read() {
    var done = function () { READ = true; var w = WAIT; WAIT = []; w.forEach(function (f) { try { f(); } catch (e) {} }); };
    if (typeof fetch === 'undefined') return done();
    fetch((root.BOHEMIA_CREW_FACES_BASE || BASE) + 'BOHEMIA_CREW_FACES.json').then(function (r) { return r.json(); }).then(function (j) {
      Object.keys((j && j.faces) || {}).forEach(function (l) { var f = j.faces[l].files || {}; if (f.rest && f.A && f.E && f.O && f.M && LOOKS.indexOf(l) < 0) LOOKS.push(l); });
      done();
    }).catch(done);
  }
  function src(look, key, size) {
    if (!has(look)) return null;
    var file = (key || 'rest') + '_' + ((size || SIZE) > 64 ? 128 : 64) + '.png';
    if (LOOKS.indexOf(look) < 0) return (root.BOHEMIA_PEOPLE_BASE || PBASE) + look + '/face/' + file;
    return (root.BOHEMIA_CREW_FACES_BASE || BASE) + look + '/' + file;
  }
  var cache = {};
  function image(u, cb) {
    var im = cache[u];
    if (!im) { im = cache[u] = new Image(); im.src = u; }
    if (im.complete) { cb(im.naturalWidth ? im : null); return; }
    im.addEventListener('load', function () { cb(im); });
    im.addEventListener('error', function () { cb(null); });
  }
  function paint(x, im, size) {
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.clearRect(0, 0, size, size); x.drawImage(im, 0, 0, size, size);
  }
  function draw(x, look, size, onMiss) {
    size = size || SIZE;
    var u = src(look, 'rest', size);
    if (!u) { if (onMiss) onMiss(); return false; }
    image(u, function (im) { if (im) paint(x, im, size); else if (onMiss) onMiss(); });
    return true;
  }
  /* ONE SYLLABLE, ONE SHAPE, A HALF BEAT EACH: the alpha's rule (visemeFor / visemesOf, slices/BOHEMIA_ALPHA_0_9.html,
     one shape per sound at 250 ms) read onto PORTRAIT's four mouths, counted by the syllable, not the letter: letter by
     letter a client's two sentences took 24 s of flapping (measured, 95 shapes); a syllable is the beat real speech
     keeps (about four a second). A vowel run opens the mouth once (a is A, o u are O, e i y are E); m b p close the lips
     (M); a comma or a stop is the face at rest; every other consonant rides the vowel beside it. */
  function sounds(line) {
    var out = [], prev = null, vow = false, i, ch, v;
    line = String(line || '').toLowerCase();
    function put(k) { if (k !== prev) { out.push(k); prev = k; } else if (k !== 'rest' && k !== 'M') { out.push(k); } }
    for (i = 0; i < line.length; i++) {
      ch = line[i];
      if ('aá'.indexOf(ch) >= 0) v = 'A'; else if ('oóuú'.indexOf(ch) >= 0) v = 'O'; else if ('eéiíy'.indexOf(ch) >= 0) v = 'E'; else v = null;
      if (v) { if (!vow) put(v); vow = true; continue; }
      vow = false;
      if ('mbpñ'.indexOf(ch) >= 0) put('M');
      else if ('.,!?;:—'.indexOf(ch) >= 0) put('rest');
    }
    return out;
  }
  function talk(c, look, line) {
    if (!c || !has(look)) return false;
    if (c.__talk) clearInterval(c.__talk);
    var x = c.getContext('2d'), size = c.width, seq = sounds(line), k = 0, frames = {};
    ['rest', 'A', 'E', 'O', 'M'].forEach(function (key) { image(src(look, key, size), function (im) { frames[key] = im; }); });
    function show(key) { var im = frames[key] || frames.rest; c.dataset.mouth = key; if (im) paint(x, im, size); }
    c.__talk = setInterval(function () {
      if (k >= seq.length || (k > 0 && !c.isConnected)) { clearInterval(c.__talk); c.__talk = null; show('rest'); c.dataset.said = '1'; return; }
      show(seq[k++]);
    }, SOUND_MS);
    return true;
  }
  root.BohemiaCrewFaces = { LOOKS: LOOKS, SIZE: SIZE, SOUND_MS: SOUND_MS, has: has, ready: ready, src: src, draw: draw, talk: talk, sounds: sounds };
  read();
})(typeof window !== 'undefined' ? window : this);
