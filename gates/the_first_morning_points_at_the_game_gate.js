const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE FIRST MORNING HAS TO POINT AT THE GAME (8/25/26, RUN lane)
   Backlog row P0-MORNING. Demo blocker.

   THE ROW, from this lane's own demo record on 8/24: "tapping ONLY the obvious
   primary button goes GET UP -> SLEEP -> DAY 2 and never plays anything. The
   day's work is behind the PHONE, and the thing pointing at it is one unread
   badge. A TESTER CAN FINISH THE DEMO WITHOUT EVER MEETING THE GAME."

   I BUILT A COLD HAND -- a probe that scores every control by what its pixels
   actually do (fill weighted hardest, then border, then text, then area), refuses
   anything it could not reach with a thumb, presses the winner and never reads a
   word. On a cold boot, BEFORE:

       1. WATCH      gold, score 89   (correct)
       2. GET UP     score 43         (correct)
       3. DROP IN    score 33         <-- and the game ends here
       4. CITY       score 33
       5..12  DROP IN / CITY / DROP IN / CITY ...

       phone opened 0 · job taken 0 · clock 06:00 at tap 1 and 06:00 at tap 12

   HE NEVER EVEN REACHES SLEEP. He flips the camera between the street and the
   map until he puts the phone down. And __OFFER_RANG was 1 the whole time: THE
   PHONE HAD RUNG and the hand never heard it, because a ringing phone was a dark
   chip with a hairline border and a 14px dot in the corner.

   DON NORMAN, whom the row already cites: AFFORDANCES are what actions are
   possible, SIGNIFIERS are what tells you where the action goes, and WHEN YOU
   HAVE TO PUT A SIGN ON A DOOR, THE DESIGN ALREADY FAILED. The badge is a sign
   on a door. So none of this gate asserts that a word was added anywhere -- it
   asserts an ORDER OF LOUDNESS, which is the thing a thumb actually reads.

   *** AND THE COLD HAND FOUND A SECOND ONE THE ROW DID NOT KNOW ABOUT. ***
   With the phone OPEN and covering 378x763 of a 390x844 screen, three world
   buttons were still the topmost element at their own centres: sleepbtn, bikebtn,
   rungbtn. SLEEP ENDS THE DAY. He opens the phone, his thumb is already at the
   bottom of the screen, and the button under it finishes day one with the job
   never taken. That was MY regression: __HUD_NEVER_OVERLAPS__ (8/24) put the
   day-loop chips in a column at z-index 39 and #phonewrap had been 30 since it
   was built.

   WHAT THIS GATE HOLDS, and why each claim is shaped the way it is:

     A. THE ORDER OF LOUDNESS on the first morning, computed off real computed
        styles, not a hardcoded list of what should be brightest.
     B. NOTHING PUNCHES THROUGH A TAKEOVER PANEL -- swept over every panel it can
        open, not just the phone, because the next one to have this bug should be
        caught by the machine and not by my noticing.
     C. THE CHAIN ACTUALLY WORKS when driven: phone -> notification -> TAKE IT ->
        the job is his and the day has an objective.
     D. AND IT GOES QUIET AGAIN once the job is taken, because a permanent shout
        is just a louder sign on the same door.

   node gates/the_first_morning_points_at_the_game_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== THE FIRST MORNING: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* HOW LOUD IS A CONTROL. Deliberately NOT a list of ids I think should be bright
   -- that would just be me asserting my own patch back at myself. It reads what
   the browser computed, so a lane that dims the phone tomorrow turns this red
   without touching the gate. Reachability is part of loudness: a bright button
   under a modal is not shouting at anybody. */
const LOUDNESS = `(function(){
  function lum(c){
    var m=/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/.exec(c||'');
    if(!m) return null;
    if(m[4]!==undefined && parseFloat(m[4])<0.06) return null;
    return (0.2126*+m[1] + 0.7152*+m[2] + 0.0722*+m[3])/255;
  }
  /* A CONTROL IS SOMETHING THAT BEHAVES LIKE ONE. An earlier cut swept a fixed
     selector list and could not see .lv-take -- the button that takes the job --
     because nobody had put its class in the list. Same blind spot the panel gate
     had pressing close buttons BY NAME. */
  var pool=[].slice.call(document.querySelectorAll(
    'button,[role=button],[onclick],[data-act],.dcbtn,.dcgo,.pb,.chip,.mapgo,'
    +'#phonebtn,#mode,#fitbtn,#sleepbtn,#savebtn,#bikebtn,#rungbtn,#mktbtn,#musbtn,#keybtn'));
  [].forEach.call(document.querySelectorAll('div,span,a,li'), function(e){
    if(pool.indexOf(e)<0 && getComputedStyle(e).cursor==='pointer') pool.push(e); });
  var out=[];
  pool.forEach(function(el){
    if(el.tagName==='IFRAME'||el.tagName==='CANVAS') return;
    var r=el.getBoundingClientRect();
    if(r.width<18||r.height<12) return;
    if(r.width>innerWidth*0.94 && r.height>innerHeight*0.5) return;
    if(r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth) return;
    var s=getComputedStyle(el);
    if(s.visibility==='hidden'||s.display==='none'||+s.opacity<0.2) return;
    if(el.querySelector('button,.dcgo,.dcbtn,[data-act],[onclick]')) return;
    var t=document.elementFromPoint(r.left+r.width/2, r.top+r.height/2);
    if(!t || !(t===el || el.contains(t) || t.contains(el))) return;   /* a thumb cannot reach it */
    var bg=lum(s.backgroundColor), fg=lum(s.color), bd=lum(s.borderColor);
    out.push({ id: el.id||'',
               text:(el.innerText||'').trim().replace(/\\s+/g,' ').slice(0,24),
               score: Math.round((bg!=null?bg*100:0)+(bd!=null?bd*22:0)+(fg!=null?fg*8:0)
                      +Math.min(20, r.width*r.height/900)) });
  });
  out.sort(function(a,b){ return b.score-a.score; });
  return out.slice(0,10);
})()`;

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);

    /* ---- 0. THE DOOR, MEASURED BEFORE THE SPLASH IS DISMISSED (P0-DOOR) --- */
    /* *** AND THE ROW WAS NARROWER THAN IT SOUNDED, WHICH I ONLY FOUND BY
       MEASURING BOTH STATES. *** The row says the alpha "opens on the CHARACTER
       workbench", and the markup did say `class="tab on" data-p="char"`. But the
       first cut of these claims read the state AFTER the splash is tapped through
       -- and passed with the markup reverted, because the boot already switches to
       RUN by then. A CLAIM THAT PASSES WITH THE FIX REMOVED IS HOLDING NOTHING,
       and I nearly shipped three of them.
       WHAT IS ACTUALLY TRUE, measured: with the old markup the CHARACTER workbench
       is the tab and panel mounted WHILE THE SPLASH IS UP -- so the workbench is
       what a stranger sees behind it, what boots first, and what he lands on if
       the splash is dismissed early or fails. So the claim is taken HERE, before
       #front is touched, which is the only moment the two differ. */
    const door = await page.evaluate(() => {
      const t = document.querySelector('.tab.on'), p = document.querySelector('.panel.on');
      return { tab: t ? t.getAttribute('data-p') : null, panel: p ? p.id : null,
               charTabStillThere: !!document.querySelector('.tab[data-p="char"]') };
    });
    ok('*** THE DOOR OPENS ONTO THE GAME, NOT THE WORKBENCH *** (mounted behind the '
      + 'splash: tab "' + door.tab + '", panel ' + door.panel + ') -- it was the '
      + 'CHARACTER workbench, which is what boots first and what he lands on if the '
      + 'splash is dismissed early', door.tab === 'run');
    /* THE HALF-FIX IS A VISIBLY BROKEN SCREEN, so both halves are held. The RUN tab
       does not show #p-run: `PANEL = (t.dataset.p==='run') ? 'city' : ...` maps it
       to #p-city, and #p-run is display:none the whole time -- the ambience code
       carries a comment about learning exactly that the hard way. */
    ok('and the panel mounted with it is the one the RUN tab maps to (' + door.panel
      + ') -- marking the tab alone would highlight RUN over the character workbench',
      door.panel === 'p-city');
    ok('and CHARACTER is still a tab like any other, one tap away, nothing removed',
      door.charTabStillThere === true);

    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); done(); }

    /* skip the opening the way a tester does, then leave the wake card */
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    await city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
      if (g) g.click();
    });
    await SETTLE(page, 1800);

    const morning = await city.evaluate(() => ({
      day: DAY.day, clock: DAY.hhmm(DAY.min),
      rang: window.__OFFER_RANG || 0,
      unread: (typeof OFFER !== 'undefined' && !!OFFER) && !OFFER_TAKEN,
    }));
    ok('it is the first morning and the phone has rung (day ' + morning.day + ' '
      + morning.clock + ', rang ' + morning.rang + ')',
      morning.day === 1 && morning.rang >= 1 && morning.unread === true);

    /* ---- A. THE ORDER OF LOUDNESS ---------------------------------------- */
    const loud = await city.evaluate(LOUDNESS);
    const rank = id => loud.findIndex(r => r.id === id);
    const top = loud[0] || {};
    const phone = loud.find(r => r.id === 'phonebtn');
    const mode = loud.find(r => r.id === 'mode');
    console.log('  LOUDEST ON THE FIRST MORNING: '
      + loud.slice(0, 4).map(r => (r.id || r.text) + ' ' + r.score).join('  ·  '));
    ok('*** THE RINGING PHONE IS THE LOUDEST THING HE CAN REACH *** (' + top.id
      + ' ' + top.score + ') -- it was DROP IN at 33 with the phone invisible',
      top.id === 'phonebtn');
    ok('and it out-shouts the camera button that used to win, by a real margin ('
      + (phone ? phone.score : '?') + ' vs ' + (mode ? mode.score : '?') + ')',
      !!phone && !!mode && phone.score >= mode.score + 20);
    /* THE ROW'S OWN CONSTRAINT: GET UP and SLEEP stay exactly where they are. */
    const sleep = loud.find(r => r.id === 'sleepbtn');
    ok('SLEEP was not moved, dimmed or taken away -- it is still on the screen '
      + 'and still reachable, just no longer the loudest thing on it', !!sleep);
    ok('and it does not out-shout the phone (' + (sleep ? sleep.score : '?')
      + ' vs ' + (phone ? phone.score : '?') + ')',
      !!sleep && !!phone && sleep.score < phone.score);

    /* ---- B. NOTHING PUNCHES THROUGH A TAKEOVER PANEL --------------------- */
    /* SWEPT OVER EVERY PANEL, not just the phone. The phone is the one that was
       broken today; an enumerating check that only knows about the broken one
       learns nothing for tomorrow. */
    await city.evaluate(() => { document.getElementById('phonebtn').click(); });
    await SETTLE(page, 2500);
    const through = await city.evaluate(() => {
      var res = [];
      ['phonewrap', 'savepanel', 'keypanel', 'pfpanel', 'buildpanel'].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el || el.offsetParent === null) return;
        var r = el.getBoundingClientRect();
        if (r.width * r.height < innerWidth * innerHeight * 0.4) return;   /* not a takeover */
        var hits = [];
        document.querySelectorAll('#sleepbtn,#mktbtn,#rungbtn,#savebtn,#musbtn,#keybtn,'
          + '#pfbtn,#bikebtn,#fitbtn,#mode,#phonebtn,#devbtn,#underbtn,#reroll').forEach(function (b) {
          var s = getComputedStyle(b);
          if (s.display === 'none' || s.visibility === 'hidden') return;
          var q = b.getBoundingClientRect();
          if (q.width < 8 || q.height < 8) return;
          if (!(q.left < r.right && q.right > r.left && q.top < r.bottom && q.bottom > r.top)) return;
          var t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
          if (t && (t === b || b.contains(t))) hits.push(b.id);
        });
        res.push({ panel: id, through: hits });
      });
      return res;
    });
    const punched = through.filter(r => r.through.length);
    ok('the phone really is taking over the screen for this check',
      through.some(r => r.panel === 'phonewrap'));
    ok('*** NO WORLD BUTTON IS PRESSABLE THROUGH A PANEL THAT OWNS THE SCREEN *** ('
      + (punched.length ? punched.map(r => r.panel + ': ' + r.through.join(',')).join(' | ') : 'none')
      + ') -- SLEEP, BIKE and STANDING all were, and SLEEP ends the day',
      punched.length === 0);

    /* ---- C. THE CHAIN WORKS WHEN DRIVEN ---------------------------------- */
    const ph = page.frames().find(f => f.url().includes('CURRENT_SLICE'));
    ok('the phone opened its own screen', !!ph);
    if (ph) {
      /* the phone opens LOCKED, on a lock screen of notifications -- tapping one
         is the most universally understood gesture on a phone, so it is left
         exactly as it is and simply performed here. */
      await ph.evaluate(() => {
        const nf = [...document.querySelectorAll('.lk-nf')];
        if (nf.length) nf[nf.length - 1].click();
      });
      await SETTLE(page, 1600);
      const phLoud = await ph.evaluate(LOUDNESS);
      const take = phLoud.find(r => /TAKE IT/i.test(r.text));
      console.log('  LOUDEST ON THE PHONE: '
        + phLoud.slice(0, 3).map(r => '"' + (r.text || r.id) + '" ' + r.score).join('  ·  '));
      ok('*** AND THE BUTTON THAT TAKES THE JOB IS THE LOUDEST THING ON THE '
        + 'PHONE *** (' + (take ? take.score : 'NOT FOUND') + ') -- it inherited '
        + 'the map\'s quiet grey GO chip and was the darkest thing on its own screen',
        !!take && take.score >= 70);
      ok('and nothing on that screen out-shouts it',
        !!take && phLoud[0] && phLoud[0].score <= take.score);

      /* A REAL CLICK, because the phone routes taps through a delegated handler
         that wants the whole pointer sequence -- a synthesised click event on
         this button does nothing, which cost four probe runs to learn. */
      const before = await city.evaluate(() => window.__OFFER_TAKEN || 0);
      await ph.click('.lv-take', { timeout: 8000 }).catch(() => { });
      await SETTLE(page, 1800);
      const after = await city.evaluate(() => ({
        taken: window.__OFFER_TAKEN || 0,
        unread: (typeof OFFER !== 'undefined' && !!OFFER) && !OFFER_TAKEN,
        objective: (function () { try { return DQ.hudLine() || ''; } catch (e) { return ''; } })(),
      }));
      ok('*** PRESSING IT TAKES THE JOB *** (' + before + ' -> ' + after.taken + ')',
        after.taken > before);
      ok('and the day now has something to do ("'
        + String(after.objective).slice(0, 44) + '")', !!after.objective);

      /* ---- D. AND IT GOES QUIET AGAIN ------------------------------------ */
      const quiet = await city.evaluate(() => {
        const b = document.getElementById('phonebtn');
        return { ring: !!(b && b.classList.contains('ring')),
                 unread: (typeof OFFER !== 'undefined' && !!OFFER) && !OFFER_TAKEN };
      });
      ok('the call is read', quiet.unread === false);
      ok('*** AND THE PHONE STOPS SHOUTING THE MOMENT THE JOB IS HIS *** -- a '
        + 'permanent shout is just a louder sign on the same door', quiet.ring === false);
    }

    ok('and nothing threw across the whole first morning ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
