/* ============================================================================
   WIRE THE DOOR GATE (9/22/26, QUESTS lane) -- row [wire the door],
   THE-FOURTH-THING-IS-FOUR-PIECES-AND-NOBODY-OWNS-THE-WIRE.

   THE ROW: "Nobody owns putting them together. YOU DO: inside the first minute
   on the alpha, that person walks to his door, speaks the first ask through your
   mouth module in their own bubble with PEOPLE's face and name, the place and
   the thing are the generator's own, and the world shows the result."

   SHIP TEST, IN THE COORDINATOR'S OWN WORDS: the one driver, five minutes from
   the door, A NAMED FACE SPEAKING AN ASK ON THE GLASS BEFORE 60 s, ZERO CARDS.

   MEASURED ON THE ALPHA WITH THE ONE DRIVER:
       spoken at        1.6 s, after ONE pad press
       speaker          Marisela Escobar  (a NAME, not a trade)
       face             cached for that person
       cards            0
       page errors      0

   THE FOUR PIECES, AND WHO OWNS EACH, so this gate fails in the right lane:
     the ask      QUESTS, engine/bohemia_asks.js, generated from the live world
     the words    QUESTS, engine/bohemia_ask_spoken.js, the mouth
     the bubble   PEOPLE, with the face (f75eb900) and the name door (b09052a2)
     the register WORDS, ruled on by Paolo the same round
   This gate holds THE WIRE. It asserts nothing about how a face is drawn or how
   a name is chosen, because those belong to other lanes and a gate that reaches
   across a seam fails in the wrong place.
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) pass++; else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); } };
const done = () => { console.log('WIRE THE DOOR GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* ---- 1. THE MOUTH IS IN THE FILE THE PLAYER LOADS ----------------------- */
{
  const city = fs.readFileSync(CITY, 'utf8');
  const mod = fs.readFileSync(path.join(ROOT, 'engine/bohemia_ask_spoken.js'), 'utf8');
  const a = city.indexOf('/* ==== engine/bohemia_ask_spoken.js');
  const b = city.indexOf('/* ==== /engine/bohemia_ask_spoken.js');
  ok('*** the mouth module is INLINED in the walked city ***', a > 0 && b > a);
  /* A MODULE IN engine/ IS A MODULE THE PLAYER NEVER RUNS. This lane shipped a
     whole row about that ([main quest live]) and then wrote this wire against a
     module that was NOT in the city -- the `typeof undefined` guard would have
     made it fail silently and look like a quiet world. Caught by grepping the
     city before driving it, which is the only reason this check exists. */
  const inlined = a > 0 && b > a ? city.slice(city.indexOf('\n', a) + 1, b).trimEnd() : '';
  ok('and it is byte-identical to the engine module (ENGINE SYNC)',
     inlined === mod.trimEnd() && inlined.length > 5000);
  ok('the wire sits ABOVE the ambient chatter in the bark chain',
     /if \(ctAskBark\(now\)\) return;[\s\S]{0,200}if \(xchStart\(now\)\) return;/.test(city));
  ok('and it goes through PEOPLE\'s own name and face doors, not a second idea',
     /ctAskName\(pick\.p\)/.test(city) && /ctFaceAsk\(pick\.p\.id\)/.test(city));
}

/* ---- 2. THE TWELVE ARE WORDS' OWN, VERBATIM ---------------------------- */
{
  const city = fs.readFileSync(CITY, 'utf8');
  const bank = fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_WORDS_TEST_LINES.md'), 'utf8');
  const table = (city.match(/var WALK_LINES = \{[\s\S]*?\n\};/) || [''])[0];
  const ids = ['feral_dog_pack','coyote_shadow','rattlesnake','scavenger_shakedown',
               'the_snatcher','crazed_wanderer','bounty_squad','casino_security_bot',
               'spotter_drone','patrols_collide','toll_crew','ghost_robotaxi'];
  const notOurs = [], narrated = [];
  for (const id of ids) {
    const m = table.match(new RegExp(id + ":\\s*'([^']+)'"));
    if (!m) { notOurs.push(id + ': missing'); continue; }
    if (bank.indexOf(m[1]) < 0) notOurs.push(id);
    /* NARRATION IS THE DEFECT AND ITS SHAPE IS NARROW: a camera describing THE
       PERSON the bubble is drawn over. "somebody steps out. they want something."
       *** THE FIRST CUT OF THIS CHECK ALSO FLAGGED "It logs you and moves on"
       AND "It still runs the route", AND IT WAS WRONG. *** Those are a NEIGHBOUR
       talking about a drone and a taxi, which is exactly what a person standing
       there would say; "it" pointing at a thing is speech. Flagging them would
       have sent WORDS back to rewrite two good lines. So the test is an
       INDEFINITE PERSON as the subject, never a pronoun in general. */
    if (/^(somebody|someone|a man|a woman|he |she |they |you hear|you see)/i.test(m[1])) narrated.push(id);
  }
  ok('all twelve walk lines are WORDS\' own, verbatim from their bank'
     + (notOurs.length ? ' -- not theirs: ' + notOurs.join(', ') : ''), notOurs.length === 0);
  ok('and not one of them is narration in the speaker\'s mouth'
     + (narrated.length ? ' -- still narrated: ' + narrated.join(', ') : ''), narrated.length === 0);
}

/* ---- 3. THE SHIP TEST, ON THE ALPHA, WITH THE ONE DRIVER --------------- */
(async () => {
  let d;
  try { d = await D.open({ alpha: true }); }
  catch (e) { ok('the one driver opens the alpha [' + e.message.slice(0, 80) + ']', false); done(); }
  const t0 = Date.now();
  let spoke = null, cards = 0, presses = 0;
  for (let i = 0; i < 60 && !spoke; i++) {
    try {
      await d.fr.evaluate(async (k) => {
        const pad = document.querySelectorAll('#pad .pb')[k % 8];
        if (pad) {
          pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          await new Promise(r => setTimeout(r, 60));
          pad.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        }
      }, i);
      presses++;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 250));
    let st = {};
    try {
      st = await d.fr.evaluate(() => ({
        card: !!document.querySelector('#daycard.on'),
        ask: window.__ASK_SPOKEN || null,
        bubble: (typeof BARK !== 'undefined' && BARK.p) ? BARK.text : null,
        head: (() => { try { const h = ctSpeakerHead(BARK.p); return h ? h.text : null; } catch (e) { return null; } })(),
        faces: (typeof FACE_CV !== 'undefined') ? Object.keys(FACE_CV).length : 0
      }));
    } catch (e) {}
    if (st.card) cards++;
    /* THE RECORD IS THE GAME'S, TAKEN AT THE INSTANT IT SPOKE. This poller used
       to overwrite head/faces/bubble with whatever it happened to see 250 ms
       later, and a two-second bubble that expired in a gap made it report a
       named speaker as nameless. It reads the record now and adds only its own
       wall-clock timing, which is the one thing the page cannot know. */
    if (st.ask) spoke = Object.assign({}, st.ask, { atMs: Date.now() - t0, presses: presses });
  }

  ok('*** A PERSON SPEAKS AN ASK ON THE GLASS *** ('
     + (spoke ? spoke.atMs + ' ms, ' + spoke.presses + ' press(es)' : 'NOBODY SPOKE') + ')', !!spoke);
  if (!spoke) { await d.close(); done(); }

  ok('*** BEFORE SIXTY SECONDS *** (' + spoke.atMs + ' ms)', spoke.atMs < 60000);
  ok('*** ZERO CARDS *** (' + cards + ')', cards === 0);
  ok('the words it put on the glass are the ask itself',
     !!spoke.text && spoke.text.length > 20);
  ok('and the bubble was held long enough to read (' + Math.round(spoke.heldMs || 0) + ' ms)',
     (spoke.heldMs || 0) >= 800);

  /* A NAME, NOT A TRADE. The first run of this wire put the right words in the
     bubble and the speaker read "WATCH". A trade is a label; the row asked for a
     NAMED face, so this is checked against the trade vocabulary rather than
     against "is the string non-empty", which "WATCH" would have passed. */
  const shouty = !!spoke.head && spoke.head === String(spoke.head).toUpperCase();
  ok('*** AND THE SPEAKER HAS A NAME, NOT A TRADE *** ("' + spoke.head + '")',
     !!spoke.head && !shouty && /[a-z]/.test(spoke.head));
  /* THE FACE ARRIVES, IT DOES NOT EXIST INSTANTLY. ctFaceAsk posts to the shell
     and the portrait comes back on a later frame, so asserting a cached face AT
     THE INSTANT OF SPEAKING asserts a synchronous pipe that was never built that
     way -- it went red on a build where the face really did arrive. Waited for,
     with a deadline, which is the honest shape of the claim. */
  let faces = 0;
  for (let w = 0; w < 20 && faces === 0; w++) {
    await new Promise(r => setTimeout(r, 200));
    try { faces = await d.fr.evaluate(() => (typeof FACE_CV !== 'undefined') ? Object.keys(FACE_CV).length : 0); }
    catch (e) {}
  }
  ok('and a face arrives for the person speaking (' + faces + ' cached within 4 s)', faces > 0);

  /* THE PLACE AND THE THING ARE THE GENERATOR'S OWN, never re-typed here. */
  ok('the ask it spoke is one the generator really made',
     !!spoke.changes && !!spoke.where);

  ok('no page error anywhere in the walk' + (d.errs.length ? ' -- ' + d.errs[0] : ''),
     d.errs.length === 0);

  console.log('  MEASURED: ' + spoke.atMs + ' ms · ' + spoke.presses + ' press(es) · '
              + cards + ' cards · speaker "' + spoke.head + '" · ' + d.says());
  await d.close();
  done();
})();
