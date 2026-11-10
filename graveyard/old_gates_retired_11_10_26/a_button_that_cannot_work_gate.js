/* ============================================================================
   A BUTTON THAT CANNOT WORK DOES NOT LOOK LIKE ONE (9/13/26, LIFE + CITY lane)
   Answering EYES E26's stranger walk, item 2, on this lane's own surface.

     "TWO REAL BUTTONS THAT DO NOTHING: 'BUILD' (cbbuild, 69x29) at 01:08 and
      'BUILD BIG 2x2' (cbbig, 112x28) at 01:10. Driven tap, no change in words or
      pixels for 1.2 s."

   I DROVE IT BEFORE BELIEVING IT, AND THEY ARE NOT DEAD -- AND THEY WERE RIGHT
   ANYWAY, which is the part worth keeping. A driven tap on a DESERT plot (the only
   kind that gets BUILD; a built cell gets DEMOLISH, and my own first attempt tapped
   one of those and nearly filed "the button is missing") does change the words:
   cbAfford() returns {ok:false, have:0, price:1, CANNOT_AFFORD} and the price line
   rewrites to "that costs one battery and you have none. Finish a job and come back."

   BUT THE PANEL ALREADY SAID THAT BEFORE HE PRESSED. #cbprice opens reading "costs
   one battery, you have none, so not yet", and the press REPLACES that sentence with
   a reworded copy of itself. The first press tells him what he had already read and
   every press after changes nothing at all. To a thumb that is a dead button, and
   their instrument was measuring the truth even though the word "nothing" was not
   literally right.

   PAOLO 9/13, rule 14(d): "A card that promises something and does nothing is the
   worst bug in the game: deliver it or remove it."

   MEASURED BOTH WAYS, because a control that is ALWAYS off is a different lie:
       broke     disabled true,  opacity 0.45, title "you have none of it"
       credited  disabled false, opacity 1,    title ""        (afford ok, have 5)
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('A BUTTON THAT CANNOT WORK — off when the purse cannot meet it, on when it can');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. THE MONEY AND THE PRICE COME FROM ONE PLACE. The tag, the till and now the
   button all quote cbAfford(), so they cannot name different money. */
ok('A1 the button asks cbAfford(), the same single source the price tag and the till '
   + 'already quote, so the control cannot disagree with the sentence beside it',
   /const _a=cbAfford\(\), _off=!\(_a&&_a\.ok\);/.test(CITY));

/* A2. BOTH BUTTONS, not just the one EYES happened to name first. */
ok('A2 both BUILD and BUILD BIG are covered, not only the one the walk named first',
   /for\(const _id of \['#cbbuild','#cbbig'\]\)/.test(CITY));

/* A3. IT ADDS NO NEW VOICE. The refusal sentence was already correct and already in
   the panel; this round only stops the control lying about itself. */
ok('A3 it adds no second sentence — the refusal text is untouched and the button only '
   + 'stops looking pressable, so the panel still speaks once',
   /_b\.disabled=true;/.test(CITY) && !/cbRefuse\('you have/.test(CITY));

(async () => {
  let d = null;
  try {
    d = await D.open();
    await d.pinchOut();
    const m = await d.fr.evaluate(() => {
      const out = {};
      const c = document.querySelector('canvas');
      const ox = Math.round(c.width / 2 - (city.x - city.y) * TW / 2 + panX);
      const oy = Math.round(c.height / 2 - (city.x + city.y) * TH / 2 + panY);
      /* A DESERT PLOT IS THE ONLY KIND THAT GETS BUILD. Found here rather than
         assumed: a built cell shows DEMOLISH and has no BUILD button at all. */
      const N = om.n; let cell = null;
      for (let x = 0; x < N && !cell; x++) for (let y = 0; y < N && !cell; y++) {
        const t = om.at(x, y); if (!t || t.district !== 'desert') continue;
        const p = iso(x, y, ox, oy);
        if (p.sx < 60 || p.sy < 60 || p.sx > c.width - 60 || p.sy > c.height - 60) continue;
        cell = [x, y];
      }
      if (!cell) { out.err = 'no desert plot on screen'; return out; }
      const read = () => {
        const b = document.getElementById('cbbuild'), g2 = document.getElementById('cbbig');
        const st = e => e ? { there: true, disabled: !!e.disabled,
                              op: +getComputedStyle(e).opacity, title: e.title || '' } : { there: false };
        return { build: st(b), big: st(g2), afford: cbAfford() };
      };
      CB.sel = cell; CBpanel();
      out.broke = read();
      /* AND NOW WITH MONEY, because a control that is always off is a different lie.
         The real API, read not guessed: engine/bohemia_purse.js exports credit(). */
      try { BohemiaPurse.credit(purseGet(), 'electricity', 5, 'gate: prove it comes back on'); }
      catch (e) { out.creditErr = String(e).slice(0, 120); }
      CB.sel = null; CBpanel(); CB.sel = cell; CBpanel();
      out.paid = read();
      out.cell = cell;
      return out;
    });

    if (m.err) { ok('found a desert plot to test on: ' + m.err, false); }
    else {
      /* B1. *** THE THING RULE 14(d) ASKS FOR. *** */
      ok('B1 *** IT DOES NOT PROMISE WHAT IT CANNOT DO *** — with an empty purse BUILD is '
         + 'disabled=' + m.broke.build.disabled + ' at opacity ' + m.broke.build.op
         + ' and says "' + m.broke.build.title + '". Before this round it looked exactly '
         + 'as pressable as a button that works',
         m.broke.build.there && m.broke.build.disabled === true && m.broke.build.op < 0.8);

      ok('B2 and BUILD BIG the same — disabled=' + m.broke.big.disabled + ' at ' + m.broke.big.op,
         m.broke.big.there && m.broke.big.disabled === true && m.broke.big.op < 0.8);

      /* B3. *** AND IT COMES BACK. A control that is always off is a different lie. *** */
      ok('B3 *** AND IT COMES BACK ON WHEN HE CAN PAY *** — after crediting the purse, '
         + 'disabled=' + m.paid.build.disabled + ' at opacity ' + m.paid.build.op
         + ', with cbAfford ok=' + (m.paid.afford && m.paid.afford.ok)
         + ' and ' + (m.paid.afford && m.paid.afford.have) + ' in hand',
         m.paid.build.there && m.paid.build.disabled === false && m.paid.build.op > 0.9
         && m.paid.afford && m.paid.afford.ok === true);

      ok('B4 and BUILD BIG comes back too — disabled=' + m.paid.big.disabled,
         m.paid.big.there && m.paid.big.disabled === false);

      /* B5. THE REASON IS ON THE CONTROL, where the thumb is already going. */
      ok('B5 the reason travels with the button rather than only in a line above it — '
         + '"' + m.broke.build.title + '" when he cannot pay, and nothing once he can',
         /\S/.test(m.broke.build.title) && m.paid.build.title === '');

      console.log('  MEASURED ON THE DEMO, DRIVEN LIKE A PLAYER, at desert plot '
        + JSON.stringify(m.cell) + ':');
      console.log('    empty purse : BUILD disabled=' + m.broke.build.disabled
        + ' op=' + m.broke.build.op + ' title="' + m.broke.build.title + '"');
      console.log('    credited    : BUILD disabled=' + m.paid.build.disabled
        + ' op=' + m.paid.build.op + '   afford=' + JSON.stringify(m.paid.afford));
    }
    ok('B6 nothing threw' + (d.errs.length ? ' -> ' + d.errs[0] : ''), d.errs.length === 0);
  } catch (e) {
    ok('harness ran: ' + e.message, false);
  }
  if (d) await d.close();

  console.log('='.repeat(74));
  console.log('  A BUTTON THAT CANNOT WORK: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
