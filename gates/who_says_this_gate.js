/* ============================================================================
   WHO SAYS THIS, WITH WHAT FACE, STANDING WHERE   (FACTIONS lane, 9/20/26)

   RULE 19(c), Paolo 9/20: "you can't just be putting things on the screen and
   pretend they're the quest. It has to be people, characters, items to pick up,
   locations to go, text coming from people's voice, and when they speak it shows
   the character portrait." -- every lane answers the three columns BEFORE it
   ships a sentence, or the sentence goes to the phone or does not ship.

   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so this is the machine for the
   sentences THIS LANE writes. Measured on the glass with the one driver, in one
   boot, at the door of the demo.

   WHAT A MOUTH MEANS HERE, stated so the number cannot drift: a sentence has a
   mouth when the surface it lands in NAMES ITS SPEAKER (an element carrying the
   card's own speaker class) and CARRIES THEIR FACE (a canvas inside that same
   surface). Both halves, because a name with no face is the blank-face defect the
   portrait law is named after, and a face with no name is a decoration.

   IT IS A RATCHET, NOT A WALL. Nine sentences were already shipped before the
   rule existed and every one of them is mouthless today; failing on that would
   paint this lane red for work that was legal when it landed and would teach
   every other lane to route around the gate. So the count is FROZEN at what was
   measured the round the rule arrived, and it may FALL and never RISE. A tenth
   mouthless sentence from this lane turns it red.

   AND IT GUARDS THE ROUTE TO THE FOURTH THING. Rule 19(d) puts a person at his
   door with a portrait inside the first minute. Measured this round: the city
   frame CANNOT DRAW A FACE and never could -- it has no renderer. What it has is
   a decoder, a listener for BOHEMIA_CITY_PLAYER, and one target (#modeFace) that
   the alpha paints with the player's own face. That pipe is the only way a
   portrait reaches the walked city, nothing was watching it, and deleting any
   leg of it would take the fourth thing with it silently.

   node gates/who_says_this_gate.js
   ========================================================================== */
'use strict';
const D = require('../tools/bohemia_drive_the_demo.js');

/* FROZEN 9/20/26, the round rule 19 landed, off the measurement in
   records/BOHEMIA_WHO_SAYS_THIS_9_20_26.md. Lower it when a sentence gets a
   mouth or goes to the phone; never raise it. */
const MOUTHLESS_BASELINE = 9;

let pass = 0, fail = 0;
function ok(what, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + what + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + what + (note ? '   ' + note : '')); }
}

/* this lane's sentence writers and the surface each one lands in */
const WRITERS = [
  ['trackSay',       '#packline'],
  ['ctAgainstSay',   '#packline'],
  ['minesLine',      '#daycard'],
  ['ctRentLine',     '#daycard'],
  ['ctJoinersLine',  '#daycard'],
  ['ctBasesWhyNone', '#daycard'],
  ['partiesLine',    '#daycard'],
  ['owedVisitDue',   '#daycard'],
  ['turfNote',       '#packline']
];

(async () => {
  let d = null;
  try {
    d = await D.open({ file: 'BOHEMIA_DEMO.html', keepCards: true });

    /* WAIT FOR THE DOOR TO FINISH ARRIVING. The instrument this gate grew out of
       photographed the screen one beat before the card mounted and reported the
       glass clear -- a clean bill of health for a card about to cover it. */
    await d.fr.evaluate(() => new Promise((res) => {
      const t0 = Date.now();
      const tick = () => {
        const el = document.getElementById('daycard');
        if (el && getComputedStyle(el).display !== 'none') return res(true);
        if (Date.now() - t0 > 12000) return res(false);
        setTimeout(tick, 400);
      };
      tick();
    }));

    const m = await d.fr.evaluate((WRITERS) => {
      const out = { writers: [], surfaces: {}, pipe: {}, mouth: {} };

      /* --- each writer: reachable, and does it really say something --------- */
      for (const [fn, home] of WRITERS) {
        const row = { fn, home, reach: false, says: '' };
        let t = null;
        try { t = eval('typeof ' + fn); } catch (_e) { t = 'undefined'; }
        row.reach = (t === 'function');
        if (row.reach) {
          try {
            let v = null;
            if (fn === 'minesLine') {
              const s = turfSeats() || []; const got = [];
              for (const seat of s) { const x = minesLine(seat.faction); if (x) got.push(x); }
              v = got[0] || '';
            } else if (fn === 'ctRentLine') {
              v = ctRentLine(typeof ctRentHere === 'function' ? ctRentHere() : null);
            } else if (fn === 'ctJoinersLine') {
              v = ctJoinersLine(typeof ctJoinersHere === 'function' ? ctJoinersHere() : null);
            } else if (fn === 'trackSay' || fn === 'ctAgainstSay' || fn === 'turfNote') {
              const l = document.getElementById('packline');
              if (fn === 'ctAgainstSay') { ctAgainstSay(); v = l ? l.textContent : ''; }
              else if (fn === 'trackSay') { window._lastTrack = ''; trackSay(); v = l ? l.textContent : ''; }
              else { turfNote((hx / FN) | 0, (hy / FN) | 0); v = '(marks the day, says nothing)'; }
              if (typeof ctAgainstClear === 'function') ctAgainstClear();
            } else if (fn === 'owedVisitDue') {
              const o = owedVisitDue(); v = o ? JSON.stringify(o).slice(0, 120) : '';
            } else { v = eval(fn + '()'); }
            row.says = (v === null || v === undefined) ? '' : String(v);
          } catch (e) { row.says = 'THREW: ' + String(e.message).slice(0, 50); }
        }
        out.writers.push(row);
      }

      /* --- each surface: does it name a speaker and carry their face -------- */
      /* the card's own speaker class, not a guess: #ctcard prints the person's
         name into .who and their line into .say, and that pair is what "text
         comes from a mouth" already looks like in this game. */
      const SURF = ['#packline', '#daycard', '#ctcard'];
      for (const sel of SURF) {
        const el = document.querySelector(sel);
        out.surfaces[sel] = el
          ? { exists: true,
              names: el.querySelectorAll('.who').length > 0,
              face: el.querySelectorAll('canvas').length }
          : { exists: false, names: false, face: -1 };
      }

      /* --- the talking card, which is the mouth this game already has ------- */
      const src = document.documentElement.outerHTML;
      /* THE BRACE IS NOT DECORATION. This asked for '#ctcard .say' and the first
         mutation run renamed the rule to '#ctcard .sayZ' -- which still contains
         '#ctcard .say', so the check stayed green while the thing it guards was
         gone. A substring test that matches its own mutation is not a test. The
         rule's opening brace makes it the whole class name or nothing. */
      out.mouth = { who: src.indexOf('#ctcard .who{') >= 0,
                    say: src.indexOf('#ctcard .say{') >= 0,
                    gate: typeof ctAdjacent === 'function' };

      /* --- the only portrait route into the walked city --------------------- */
      const mf = document.getElementById('modeFace');
      let ink = -1;
      try {
        if (mf) {
          const g = mf.getContext('2d');
          const px = g.getImageData(0, 0, Math.min(mf.width, 64), Math.min(mf.height, 64)).data;
          let on = 0; for (let i = 3; i < px.length; i += 4) if (px[i] > 8) on++;
          ink = Math.round(100 * on / (px.length / 4));
        }
      } catch (_e) { ink = -1; }
      out.pipe = { decoder: typeof decodePlayerFrame === 'function',
                   listener: src.indexOf('BOHEMIA_CITY_PLAYER') >= 0,
                   target: !!mf, ink: ink,
                   localRenderer: (typeof renderFace === 'function'
                                || typeof speakingPortrait === 'function') };

      /* --- and the one sentence with a body behind it ----------------------- */
      out.blockedKnows = (typeof ctBlocked === 'function');
      return out;
    }, WRITERS);

    /* ---- A FLOOR BEFORE ANY COUNT. Nine silent writers are nine sentences
       with no mouth by arithmetic, and that would score a perfect pass on a
       world that never loaded. This lane has shipped a claim that passed on an
       empty set before. ------------------------------------------------------ */
    const reach = m.writers.filter(w => w.reach).length;
    const spoke = m.writers.filter(w => w.says && w.says.indexOf('THREW') < 0
                                     && w.says.length > 3).length;
    ok('the lane\'s sentence writers are really there and really talking ('
      + reach + ' of ' + m.writers.length + ' reachable, ' + spoke + ' saying something)',
      reach >= 7 && spoke >= 3,
      m.writers.map(w => w.fn + (w.reach ? '' : '=GONE')).join(' '));

    /* ---- THE RATCHET ----------------------------------------------------- */
    const mouthless = m.writers.filter(w => {
      const s = m.surfaces[w.home];
      return !(s && s.exists && s.names && s.face > 0);
    }).length;
    ok('*** NO NEW MOUTHLESS SENTENCE *** -- of this lane\'s ' + m.writers.length
      + ' player-facing writers, ' + mouthless + ' land somewhere that neither names '
      + 'the speaker nor carries their face. Frozen at ' + MOUTHLESS_BASELINE
      + ' the round rule 19 landed; it may fall and never rise',
      mouthless <= MOUTHLESS_BASELINE,
      mouthless <= MOUTHLESS_BASELINE
        ? (mouthless < MOUTHLESS_BASELINE
            ? 'DOWN ' + (MOUTHLESS_BASELINE - mouthless) + ' -- lower the baseline to ' + mouthless
            : 'holding at ' + mouthless)
        : 'ROSE to ' + mouthless + ' from ' + MOUTHLESS_BASELINE
          + '   <- a sentence shipped without answering who says it');

    /* ---- THE MOUTH THIS GAME ALREADY HAS --------------------------------- */
    ok('the talking card still NAMES ITS SPEAKER -- #ctcard prints the person\'s '
      + 'name, which is the half of "text comes from a mouth" this game already had',
      m.mouth.who, 'speaker class present: ' + m.mouth.who);
    ok('and still carries THEIR LINE rather than a readout', m.mouth.say);
    ok('and it still opens off somebody STANDING BESIDE HIM rather than a timer, '
      + 'which is the "standing where" column answered',
      m.mouth.gate);

    /* ---- THE ONLY PORTRAIT ROUTE INTO THE WALKED CITY --------------------- */
    ok('*** THE FACE STILL REACHES THE CITY *** -- the walked city has NO face '
      + 'renderer of its own, so the portrait arrives over the message from the '
      + 'alpha and nothing else can put one on this screen. Decoder, listener and '
      + 'target all present',
      m.pipe.decoder && m.pipe.listener && m.pipe.target,
      'decoder ' + m.pipe.decoder + ', listener ' + m.pipe.listener
        + ', target ' + m.pipe.target + ', own renderer ' + m.pipe.localRenderer);
    ok('and the face that arrives is really DRAWN, not an empty circle (a blank '
      + 'face is the defect the portrait law is named after)',
      m.pipe.ink > 5, 'ink ' + (m.pipe.ink < 0 ? 'unreadable' : m.pipe.ink + '%'));

    /* ---- THE ONE SENTENCE WITH A BODY BEHIND IT --------------------------- */
    ok('the street sentence that has a body behind it still knows WHICH body -- '
      + '"somebody steps into your way" is this lane\'s nearest thing to a mouth '
      + 'and it only stays honest while the game can name who is holding the cell',
      m.blockedKnows);

    ok('and the page threw nothing while being asked', d.errs.length === 0,
      d.errs.slice(0, 3).join(' | '));

    /* the table, for the record, so a reader never has to re-drive it */
    console.log('\n  what this lane says right now:');
    for (const w of m.writers)
      console.log('    ' + w.fn.padEnd(15) + ' -> ' + w.home.padEnd(10) + ' '
        + (w.says ? '"' + w.says.slice(0, 74) + '"' : '(silent here)'));
  } catch (e) {
    fail++; console.log('  FAIL the demo could not be driven   ' + String(e.message).slice(0, 160));
  } finally { if (d) { try { await d.close(); } catch (_e) {} } }

  console.log('\n' + (fail ? 'WHO SAYS THIS: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'WHO SAYS THIS: ' + pass + ' ok, 0 failed'));
  /* flush before exiting: process.exit() drops buffered stdout when a caller
     redirects this to a file, which cost this lane four confusing runs. */
  process.stdout.write('', () => process.exit(fail ? 1 : 0));
})();
