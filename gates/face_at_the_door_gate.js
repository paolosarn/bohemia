/* ============================================================================
   BOHEMIA FACE AT THE DOOR (9/20/26, PEOPLE lane).
   VAMILY [face at the door], row THE-PERSON-WHO-SPEAKS-HAS-A-BODY-AND-A-
   PORTRAIT-ON-SCREEN. Rule 19, and the only row this lane is un-held for.

   PAOLO 9/20: "you can't just be putting things on the screen and pretend
   they're the quest... it has to be people, characters, items to pick up,
   locations to go, text on screen coming from people's voice, and when they
   speak to you it shows the character portrait. The whole game enchilada."
   PAOLO 8/26, quoted by the alpha's own face block: "every time you speak to
   someone, their portrait will pop up on screen so you feel like you're
   relating to them."

   *** MEASURED ON THE WALKED STREET BEFORE A LINE OF THIS WAS WRITTEN: WHEN
   ANYBODY IN THIS GAME TALKED TO YOU, THE ONLY FACE ON SCREEN WAS YOURS. ***
   That whole surface holds exactly two canvases, the world and the player's own
   head in the middle of the D-pad, and the second is the control: a face CAN be
   drawn there, 4,096 lit pixels of it. The cast arrives as ELEVEN BODIES WITH
   EIGHT DIRECTIONS EACH AND NOT ONE FACE.

   AND EVERY PIECE OF THE ANSWER WAS BUILT ON 8/26 AND NEVER CALLED. That block
   says so about itself: the performance "was built and could not be used,
   because only one person in Bohemia had a face", faceFor(id) fixed that, and
   the turn "ended with a gated feature nothing called". This is the call.

   RULE 19(e), DATED THIS ROUND: "A TEXT PROMPT IS NOT AN EVENT. The road and
   walk directors stop opening cards THIS ROUND; a moment fires only if it has a
   body on screen or not at all." So the walk director speaks through a person
   who is actually drawn, with their face beside the words, and fires nothing at
   all when nobody is there.

   *** AND THIS GATE DRIVES THE ALPHA, NOT THE DEMO, WHICH COST A MEASUREMENT TO
   LEARN. *** The one driver opens BOHEMIA_DEMO.html by default and that file is
   a BAKED CUT of the alpha. A city change reaches it by reference; an ALPHA
   change does not. The live dispatcher on the demo had the branch next to mine
   and not mine, and the ask went out to nobody.

   WHAT THIS HOLDS:
   A. the face is baked by the player's own path and asked for once per person
   B. no face, no space: the bubble is unchanged when a head has not arrived
   C. rule 19(e): no card, and no body means no moment at all
   D. on the glass, on the alpha: a real face drawn round in a real bubble

   node gates/face_at_the_door_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const REC = path.join(ROOT, 'records/BOHEMIA_FACE_AT_THE_DOOR_9_20_26.txt');
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function note(t, v) { notes.push('  NOTE  ' + t + (v == null ? '' : '   ' + v)); }
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}
function flat(s) { return String(s).replace(/\s+/g, ' '); }
function bodyOf(src, name) {
  const i = src.indexOf('function ' + name);
  if (i < 0) return '';
  let j = src.indexOf('{', i), d = 0;
  for (let k = j; k < src.length; k++) {
    if (src[k] === '{') d++;
    else if (src[k] === '}') { d--; if (!d) return src.slice(j, k + 1); }
  }
  return '';
}

(async () => {

  /* ======================================================================== */
  head('A. THE FACE IS MADE THE WAY HIS OWN IS, AND ASKED FOR ONCE');
  /* ======================================================================== */
  const alpha = stripComments(fs.readFileSync(ALPHA, 'utf8'));
  const city = fs.readFileSync(CITY, 'utf8');
  const ccode = stripComments(city);

  const disp = bodyOf(alpha, 'combatMsgIn');
  probe('the dispatcher was found and it is the real one',
        disp.length > 3000 && disp.indexOf('BOHEMIA_CITY_NEED_FACTION') >= 0);
  ok('the alpha bakes a face for any person, on demand',
     disp.indexOf("BOHEMIA_CITY_NEED_FACE") >= 0);
  /* THE PLAYER'S OWN PATH, NOT A SECOND ONE. A face made by a different renderer
     or packed by a different packer would be two writers for one thing, which is
     the defect this lane has found in its own work four rounds running. */
  ok('and it uses the same faceFor, renderFace and packIdx the player\'s own '
     + 'portrait travels in, never a second face maker',
     /BOHEMIA_CITY_NEED_FACE[\s\S]{0,700}faceFor\(/.test(disp)
     && /BOHEMIA_CITY_NEED_FACE[\s\S]{0,700}renderFace\(/.test(disp)
     && /BOHEMIA_CITY_NEED_FACE[\s\S]{0,700}packIdx\(/.test(disp));

  const ask = bodyOf(ccode, 'ctFaceAsk');
  probe('the ask was found', ask.length > 100);
  ok('the city asks ONCE per person, because a bake costs a frame and a face is '
     + 'a fact', ask.indexOf('FACE_ASKED') >= 0 && ask.indexOf('FACE_CV[k]') >= 0);
  ok('and it unpacks with the player\'s own decoder',
     /BOHEMIA_CITY_FACE[\s\S]{0,600}decodePlayerFrame/.test(ccode));
  /* ONE ID, ONE WHOLE PERSON. The id asked for is the id the body is drawn from. */
  ok('ONE ID ONE WHOLE PERSON: the face is asked for with the speaker\'s own id, '
     + 'so the head and the body can never be two people',
     /ctFaceAsk\(\s*BARK\.p\.id\s*\)/.test(ccode));

  /* ======================================================================== */
  head('B. NO FACE, NO SPACE');
  /* ======================================================================== */
  const bark = bodyOf(ccode, 'barkPass');
  probe('the bubble was found', bark.length > 1000);
  /* A HEAD THAT HAS NOT ARRIVED MUST CHANGE NOTHING. The widening and the gap are
     both conditional on the face existing, so a person whose portrait is still in
     flight gets exactly the bubble this file drew before today. */
  ok('the bubble only widens when there is really a face to put in it',
     /_fs\s*=\s*_fc\s*\?/.test(bark) && /_fg\s*=\s*_fc\s*\?\s*\d+\s*:\s*0/.test(bark));
  ok('and the head is drawn round and pixelated, like his own in the ring',
     /clip\(\)/.test(bark) && /imageSmoothingEnabled\s*=\s*false/.test(bark));

  /* ======================================================================== */
  head('C. RULE 19(e): NO CARD, AND NO BODY MEANS NO MOMENT');
  /* ======================================================================== */
  const walk = bodyOf(ccode, 'walkInterrupt');
  probe('the walk director was found', walk.length > 500);
  ok('*** THE WALK DIRECTOR NO LONGER OPENS A CARD ***, which is rule 19(e) in '
     + 'its own words and dated this round',
     walk.indexOf('roadCard(') < 0, 'roadCard calls in the walk director: '
     + (walk.match(/roadCard\(/g) || []).length);
  ok('and the moment is spoken by somebody instead', walk.indexOf('walkSpeak(') >= 0);
  const speak = bodyOf(ccode, 'walkSpeak');
  probe('the speaker was found', speak.length > 300);
  ok('it speaks only through a body the game actually DREW',
     speak.indexOf('BARK_DREW') >= 0);
  ok('and it says the line the roster already held, never a new one',
     speak.indexOf('WALK_LINES[') >= 0);
  ok('and it asks for that person\'s face as it speaks',
     speak.indexOf('ctFaceAsk(') >= 0);
  /* *** AND IT SPEAKS ON THE CLOCK THE BARK SLOT ACTUALLY RUNS ON. ***
     barkTick is called with performance.now() and BARK.next is set with
     `now + 4000`, so that organ counts MILLISECONDS SINCE PAGE LOAD. The first
     cut of walkSpeak used ctMinuteNow() -- game minutes, a number like 360
     against a wall clock past 15,000 -- so every moment it spoke expired before
     it could be drawn AND pushed the next bark 1,500 ms away on its way out.
     Silent, and it silenced the next person too. Caught by this lane's own
     [a human being] gate: bubbles went 2, 3, 1 on clean main and 0, 2, 0 here.
     TWO CLOCKS IN ONE FILE is the shape, and the wrong one is the one the rest
     of the street uses for everything except this. */
  ok('and it speaks on the clock the bark slot really runs on, not the game '
     + 'clock, so the moment does not expire before it is drawn',
     speak.indexOf('performance.now()') >= 0 && speak.indexOf('ctMinuteNow') < 0);

  /* ======================================================================== */
  head('D. ON THE GLASS, ON THE ALPHA');
  /* ======================================================================== */
  let drove = false;
  try {
    const { open } = require(DRIVE);
    /* THE ALPHA, NOT THE DEMO. The demo is a baked cut and an alpha change is not
       in it; that cost a measurement to learn and it is written into the header. */
    const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
    await d.clearCards();
    const fr = d.fr;
    drove = true;
    ok('the alpha booted and the walked city answered', true,
       await fr.evaluate(() => (typeof ctFaceAsk === 'function') ? 'ok' : 'no seam'));

    const r = await fr.evaluate(async () => {
      const out = {};
      const g = document.querySelector('canvas').getContext('2d');
      const oDraw = g.drawImage, oArc = g.arc;
      const faces = [], clips = [];
      g.drawImage = function (img, ...a) {
        if (a.length === 4 && a[2] === a[3] && img && img.width === 64 && img.height === 64)
          faces.push({ x: Math.round(a[0]), y: Math.round(a[1]), s: a[2] });
        return oDraw.apply(this, [img, ...a]);
      };
      g.arc = function (x, y, rad) { clips.push(Math.round(rad * 2)); return oArc.apply(this, arguments); };

      const words = [];
      const oText = g.fillText;
      g.fillText = function (t) { words.push(String(t)); return oText.apply(this, arguments); };

      /* make somebody speak, through the organ the game uses.
         *** THE CLOCK IS performance.now(), NOT THE GAME MINUTE, AND THE FIRST
         CUT OF THIS HARNESS HAD IT WRONG. *** ctDeedBark sets BARK.until from
         whatever its caller hands it, and its ONE real caller is barkTick, which
         runs on performance.now(). Handing it ctMinuteNow() (~360 against a wall
         clock past 15,000) meant the bubble was ALREADY EXPIRED when the first
         render ticked it, so the control below passed because NOTHING DREW AT
         ALL -- a claim that cannot fail, which this lane has now shipped twice.
         Measured 9/21 while building [a name]: with the game's own clock the
         same frame draws the heading and the line; with the wrong one, nothing. */
      try { ctDeed('favour', null, null); } catch (e) {}
      ctDeedBark(performance.now());
      out.who = BARK.p ? String(BARK.p.id) : null;
      out.text = BARK.text;
      /* *** THE CONTROL IS NO FACE, NOT NO TIME. *** The first cut waited and
         then claimed "nothing drew before the head arrived", and the moment the
         clock was fixed that read THREE face draws: by the time a probe runs, the
         boot walk has already barked and FACE_CV is holding heads. Time was never
         the variable. So the control takes THIS speaker's head away and proves the
         bubble still draws its words with no face at all, which is NO FACE, NO
         SPACE stated as something that can fail. */
      if (out.who) { delete FACE_CV[out.who]; delete FACE_ASKED[out.who]; }
      words.length = 0; faces.length = 0;
      for (let i = 0; i < 3; i++) { try { render(); } catch (e) {} }
      out.facesBeforeArrival = faces.length;
      out.bubbleDrewBeforeArrival = words.some(t => t === out.text);
      g.fillText = oText;

      await new Promise(res => setTimeout(res, 2500));
      out.arrived = out.who ? !!FACE_CV[out.who] : false;
      for (let i = 0; i < 8; i++) { try { render(); } catch (e) {} await new Promise(res => setTimeout(res, 50)); }
      out.faceDraws = faces.length;
      out.faceAt = faces.length ? faces[faces.length - 1] : null;
      out.roundClip = clips.length ? clips[clips.length - 1] : null;

      /* RULE 19(e) BOTH WAYS, on the real surface */
      const ev = { id: 'scavenger_shakedown', kind: 'interactive', name: 'shakedown' };
      out.spoke = walkSpeak(ev);
      out.spokeText = BARK.text;
      const keep = BARK_DREW; BARK_DREW = [];
      out.spokeWithNobody = walkSpeak(ev);
      BARK_DREW = keep;

      g.drawImage = oDraw; g.arc = oArc;
      return out;
    });
    note('who spoke', r.who);
    note('what they said', r.text);
    note('the face on the glass', r.faceAt ? (r.faceAt.s + 'px at ' + r.faceAt.x + ',' + r.faceAt.y) : 'none');

    probe('somebody really spoke, so the rest is not an empty pass', !!r.who);
    ok('*** THE CONTROL: BEFORE THE HEAD ARRIVES, THE BUBBLE DRAWS WITH NO FACE ***, '
       + 'so what is below is the feature and not something that was always there. '
       + 'AND THE BUBBLE REALLY DREW IN THOSE FRAMES, because the first cut of this '
       + 'control passed on an expired bark that drew nothing at all',
       r.facesBeforeArrival === 0 && r.bubbleDrewBeforeArrival === true,
       r.facesBeforeArrival + ' face draws before it landed, bubble drawn: '
       + r.bubbleDrewBeforeArrival);
    ok('the speaker\'s head is baked and sent back', r.arrived === true);
    ok('*** AND IT IS DRAWN ON THE REAL CANVAS, IN THEIR OWN BUBBLE. *** Watched on '
       + 'the glass, not recomputed here, because a cached face that never reaches '
       + 'the screen is a feature that silently does nothing',
       r.faceDraws > 0 && !!r.faceAt,
       r.faceDraws + ' draw(s), last ' + (r.faceAt ? r.faceAt.s + 'px' : 'none'));
    ok('and it is round, the same shape as his own in the ring',
       r.roundClip != null && r.faceAt && Math.abs(r.roundClip - r.faceAt.s) <= 1,
       'clip ' + r.roundClip + ' against a head of ' + (r.faceAt ? r.faceAt.s : '?'));
    ok('*** A MOMENT IS SPOKEN BY A PERSON WHO IS THERE ***, which is rule 19(e)',
       r.spoke === true && !!r.spokeText, r.spokeText || 'nothing said');
    ok('*** AND WITH NOBODY ON SCREEN IT FIRES NOTHING AT ALL ***, which is the '
       + 'other half of the same rule and the thing he opened the demo and saw',
       r.spokeWithNobody === false);

    ok('and nothing threw while any of it happened', d.errs.length === 0,
       'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
    await d.close();
  } catch (e) {
    ok('the alpha drive finished', false, e.message);
  }
  probe('the drive really ran, so a green above is not an empty pass', drove);

  /* ======================================================================== */
  head('E. THE RECORD SAYS WHAT WAS MEASURED');
  /* ======================================================================== */
  if (fs.existsSync(REC)) {
    const r = flat(fs.readFileSync(REC, 'utf8'));
    ok('the record carries his own sentence',
       /it shows the character portrait/i.test(r));
    /* ASK FOR THE SUBSTANCE, NOT A PHRASE I HOPED I HAD TYPED. The first cut
       wanted 'is your own' and the record says 'was yours', so it went red on a
       record whose whole headline is that sentence. */
    ok('and the measurement that started it',
       /the only face on screen was yours/i.test(r) && /4,096/.test(r));
    ok('and names what is still wrong at the door, for the lane that owns it',
       /RUN/.test(r) && /pop/i.test(r));
  } else {
    ok('the record exists', false, REC);
  }

  notes.forEach(n => console.log(n));
  console.log('\n=== FACE AT THE DOOR: ' + pass + ' pass / ' + fail.length + ' fail ===');
  if (fail.length) { fail.forEach(f => console.log('   - ' + f)); process.exit(1); }
})();
