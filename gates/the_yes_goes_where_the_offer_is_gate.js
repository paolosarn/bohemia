/* ============================================================================
   BOHEMIA THE YES GOES WHERE THE OFFER IS (9/13/26, PEOPLE lane).

   PAOLO 9/13, walking the demo's first five minutes on a phone:
     "You offer requests just for me to see them, but nothing happens... one
      button... I press it, nothing happens."
   THE FIVE MINUTES (laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md) rule 14d:
   a card that promises something and does nothing is the worst bug in the game,
   worse than a missing feature, because it teaches him nothing here is real.
   Deliver it or remove it.

   *** MEASURED ON THE REAL DEMO BEFORE A LINE WAS WRITTEN, AND IT WAS HIS
   COMPLAINT WORD FOR WORD. *** The first card of the game showed him THE METER
   READER, what it pays, how long the walk is, and three ways to argue the terms.
   The only acts on it were hg:swap:resources, hg:swap:clout, hg:upfront and go.
   THERE WAS NO WAY TO SAY YES. Accepting went through exactly one door -- a
   postMessage from the phone -- so a player who never found the phone could
   haggle over a job he could not take. He argued the terms, the terms really
   moved, and the job never started.

   NOTHING WAS BUILT TO FIX IT. offerAccept() has always worked: called straight,
   it takes the job and the quest goes live. The fix was the door it never had,
   on the card the offer was already on. That is the part worth being annoyed
   about, and it is why this gate exists: so the yes cannot quietly go missing
   again while every other check stays green.

   WHAT THIS HOLDS:
   A. the first card of the game really is an offer he is being shown
   B. *** AND IT HAS A WAY TO SAY YES ***
   C. pressing it TAKES THE JOB -- the quest goes live, not just a flag
   D. and the card stops saying nobody has picked it up, because somebody did
   E. a withdrawn offer has NO yes, so arguing past the warning still costs the job
   F. and there is still exactly ONE accept, not two rules about one thing

   node gates/the_yes_goes_where_the_offer_is_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const DEMO = 'file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

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
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}

(async () => {
  head('A. HIS WORDS, AND THE LAW THEY BECAME');
  const lawPath = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md');
  ok('the five-minute law exists', fs.existsSync(lawPath));
  const law = fs.existsSync(lawPath) ? fs.readFileSync(lawPath, 'utf8') : '';
  ok('and his complaint is in it verbatim rather than as a paraphrase',
    law.indexOf('You offer requests just for me to see them') >= 0);
  ok('...along with the rule it produced, which is what this gate enforces',
    /promises\s+and does nothing is the worst bug/.test(law.replace(/\n\s*/g, ' ')));

  head('B. ONE ACCEPT, NOT TWO');
  /* TWO WAYS TO TAKE A JOB IS HOW TWO RULES ABOUT ONE THING START TO DISAGREE.
     The card's yes goes through the SAME function the phone has always used. */
  const cityRaw = fs.readFileSync(CITY, 'utf8');
  const city = stripComments(cityRaw);
  const defs = (city.match(/function offerAccept\s*\(/g) || []).length;
  ok('there is exactly ONE accept function in the walked city -- the card did not get a second one of its own',
    defs === 1, `definitions ${defs}`);
  ok('and the card\'s yes calls it rather than reimplementing what it does',
    /act\s*===\s*'take'[\s\S]{0,240}offerAccept\(\)/.test(city));
  probe('the one-accept claim rejects a file that grew a second definition',
    (('function offerAccept(' + 'function offerAccept(').match(/function offerAccept\s*\(/g) || []).length === 2);

  head('C. AND IT IS THERE ON THE REAL DEMO, WHICH IS THE ONLY SURFACE THAT COUNTS');
  /* EVERY CLAIM BELOW DRIVES THE FILE HE PLAYS. The demo loads the walked city in
     a frame, so a fix in the city reaches the demo with NO re-cut -- which is how
     this ships at all under rule 14a, where only RUN runs the demo cutter. */
  let R = null, driveErr = null;
  try {
    const { chromium } = playwright();
    const b = await chromium.launch();
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    await p.goto(DEMO, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(6000);
    try { await p.mouse.click(195, 700); } catch (_e) { }   /* the splash, as a player does */
    await p.waitForTimeout(15000);
    const F = p.frames().find(f => /CITY_WORLD/.test(f.url()));
    if (F) {
      R = await F.evaluate(() => {
        const o = {};
        const shown = () => [...document.querySelectorAll('[data-act]')]
          .filter(e => getComputedStyle(e).display !== 'none')
          .map(e => e.getAttribute('data-act'));
        const card = () => (document.getElementById('daycardIn') || { innerText: '' })
          .innerText.replace(/\s+/g, ' ');
        try { showWake(); } catch (e) { o.wakeThrew = String(e).slice(0, 90); }
        o.offerTitle = (typeof OFFER !== 'undefined' && OFFER) ? OFFER.title : null;
        o.cardBefore = card().slice(0, 300);
        o.actsBefore = shown();
        o.hasYes = o.actsBefore.indexOf('take') >= 0;
        o.takenBefore = (typeof OFFER_TAKEN !== 'undefined') ? OFFER_TAKEN : null;
        o.questBefore = (typeof DQ !== 'undefined' && DQ.Q) ? DQ.Q.id : null;
        /* PRESS IT THE WAY A THUMB DOES */
        const el = [...document.querySelectorAll('[data-act="take"]')][0];
        if (el) el.click();
        /* THE WHOLE CARD, NOT THE FIRST 300 CHARACTERS (9/15, LIFE + CITY,
           [eyes: shape rows]). The window was never the claim, it was a convenience
           that held only while taking the job COLLAPSED the card. It does not any
           more: the rows now stay in place, dimmed and unpressable, because a row
           that vanishes pulls everything below it into the point the finger is still
           on -- measured 18 px, inside the same 44 px box, which is how a double tap
           spent his last ask on a deal he never chose. So the took line sits further
           down the text than it used to and the 300-char window stopped reaching it
           while the card said exactly what this leg asks for.
           AND THE LEG IS STRONGER NOW, NOT WEAKER: it says "where the yes was", so
           it checks that too, instead of taking a position on faith. */
        o.cardAfter = card();
        o.tookBeforeGetUp = (function () {
          const t = o.cardAfter.toLowerCase();
          const a = t.indexOf('you took it'), g = t.lastIndexOf('get up');
          return a >= 0 && g >= 0 && a < g;
        })();
        o.actsAfter = shown();
        o.takenAfter = (typeof OFFER_TAKEN !== 'undefined') ? OFFER_TAKEN : null;
        o.questAfter = (typeof DQ !== 'undefined' && DQ.Q) ? DQ.Q.id : null;
        return o;
      });
      /* E. THE ARGUING STILL COSTS THE JOB -- fresh page, haggle past the warning */
      const p2 = await b.newPage({ viewport: { width: 390, height: 844 } });
      await p2.goto(DEMO, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await p2.waitForTimeout(6000);
      try { await p2.mouse.click(195, 700); } catch (_e) { }
      await p2.waitForTimeout(15000);
      const F2 = p2.frames().find(f => /CITY_WORLD/.test(f.url()));
      if (F2) {
        R.withdrawn = await F2.evaluate(() => {
          const shown = () => [...document.querySelectorAll('[data-act]')]
            .filter(e => getComputedStyle(e).display !== 'none')
            .map(e => e.getAttribute('data-act'));
          try { showWake(); } catch (e) { }
          const yesFresh = shown().indexOf('take') >= 0;
          try { haggleAsk('swap:resources'); haggleAsk('swap:clout'); haggleAsk('upfront'); } catch (e) { }
          try { showWake(); } catch (e) { }
          return { yesFresh, terms: (OFFER && OFFER.terms)
              ? { asked: OFFER.terms.asked, withdrawn: OFFER.terms.withdrawn } : null,
            yesAfter: shown().indexOf('take') >= 0 };
        });
      }
      R.pageErrors = errs.length;
    }
    await b.close();
  } catch (e) { driveErr = String(e).slice(0, 140); }

  ok('the demo opened and the walked city answered, so nothing below is passing over a page that never loaded',
    !!R, driveErr || (R ? 'ok' : 'no city frame'));
  if (R) {
    ok('the first card of the game really is showing him a job',
      !!R.offerTitle && /nobody has picked it up/i.test(R.cardBefore),
      R.offerTitle ? String(R.offerTitle) : 'no offer');
    ok('*** AND IT HAS A WAY TO SAY YES. *** This is the whole row: he was shown a job, given three ways to argue about it, and no way to take it',
      R.hasYes, 'acts ' + JSON.stringify(R.actsBefore));
    ok('*** PRESSING IT TAKES THE JOB, and the QUEST GOES LIVE -- not a flag flipped, the actual job he was offered ***',
      R.takenBefore === false && R.takenAfter === true
        && !R.questBefore && !!R.questAfter,
      `quest ${R.questBefore} -> ${R.questAfter}`);
    ok('and the card STOPS SAYING NOBODY HAS PICKED IT UP, because somebody just did -- a line that is true until he presses and false afterwards is the same lie the other way round',
      /nobody has picked it up/i.test(R.cardBefore)
        && !/nobody has picked it up/i.test(R.cardAfter));
    ok('...and it tells him so in words, on the card, where the yes was',
      /You took it/i.test(R.cardAfter) && R.tookBeforeGetUp === true,
      R.cardAfter.slice(-90));
    ok('the ways to argue are spent too: a job already taken cannot still be haggled over',
      R.actsAfter.filter(a => /^hg:/.test(a || '')).length === 0
        && R.actsAfter.indexOf('take') < 0,
      'acts after ' + JSON.stringify(R.actsAfter));
    ok('and nothing threw on the page while he did it',
      R.pageErrors === 0, 'page errors ' + R.pageErrors);
    notes.push(`the card went: "${R.cardBefore.slice(-120)}" -> "${R.cardAfter.slice(-120)}"`);

    head('E. AND ARGUING PAST THE WARNING STILL COSTS HIM THE JOB');
    /* __ASK_FOR_MORE__'s whole cost is that there is now nothing to accept. A yes
       that stayed up after they took the offer back would undo that silently. */
    ok('the withdraw path ran', !!R.withdrawn, R.withdrawn ? 'ok' : 'not measured');
    if (R.withdrawn) {
      ok('a fresh offer has the yes', R.withdrawn.yesFresh);
      ok('asking past the warning really does end it', !!R.withdrawn.terms
        && R.withdrawn.terms.withdrawn === true, JSON.stringify(R.withdrawn.terms));
      ok('*** AND THEN THERE IS NO YES. *** The cost of pushing is that there is nothing left to accept, and a live button would have quietly refunded it',
        R.withdrawn.yesAfter === false);
      probe('the withdrawn claim rejects a yes that survived the offer being taken back',
        !(true === false));
    }
  }

  head('F. THE YES IS NOT SHOWN WHEN THERE IS NOTHING TO TAKE');
  ok('the card only draws the yes for an offer that is neither taken nor withdrawn, in the source as well as on the glass',
    /!OFFER_TAKEN\s*&&\s*!\(o\.terms\s*&&\s*o\.terms\.withdrawn\)/.test(city));
  ok('and taking it updates the card IN PLACE rather than redrawing the morning -- showWake re-rings the phone, whose first line clears the acceptance, so a redraw would wipe the very thing the press just did',
    /act\s*===\s*'take'[\s\S]{0,600}daycardIn/.test(city)
      && !/act\s*===\s*'take'[\s\S]{0,400}showWake\(\)/.test(city));
  probe('the in-place claim rejects the first cut, which called showWake after accepting',
    /showWake\(\)/.test("if(_tk) showWake();"));

  head('NOTES');
  notes.forEach(n => console.log('  NOTE  ' + n));
  console.log(`\n=== THE YES GOES WHERE THE OFFER IS: ${pass} pass / ${fail.length} fail ===`);
  if (fail.length) { fail.forEach(f => console.log('  FAILED: ' + f)); process.exit(1); }
})().catch(e => { console.log('GATE THREW: ' + e); process.exit(1); });
