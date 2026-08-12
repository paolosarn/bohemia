/* ============================================================================
   THE PHONE RINGS GATE (8/12/26)

   The phone was in his pocket and it knew where he was, and it was still a
   VIEWER: nothing ever arrived on it and nothing he did on it changed the day. A
   phone that only reports is a HUD with extra taps. Every phone feature so far
   could have been deleted and the game would have played identically.

   THE SHAPE IS NOT INVENTED. engine/bohemia_loop.js has modelled it since it was
   written, in its own comment:

       THE FEED OFFERS: the quests you can pick up OVER THE PHONE right now -- the
       'feed' channel, live, not done. In-person quests (the phoneless: homeless)
       are deliberately EXCLUDED ... "you can't get their quest over the phone."

   The demo was skipping the channel entirely by handing him the day's job on the
   wake card, done deal, before he had touched anything.

   WHAT THIS GATE HOLDS, driven by tapping the real buttons in a real browser:
     1. THE DAY STARTS WITH NO JOB. Wake, and there is no objective -- only word
        that something came in.
     2. THE OFFER IS THE QUEST'S OWN WORDS, verbatim against quests/bq/*.bq. Same
        law as the resolution buttons: I show his prose, I do not write prose
        about it.
     3. TAKING IT ON THE PHONE MAKES IT REAL IN THE RUN. The objective goes live
        on the HUD, and it went live because of a tap on the phone.
     4. NOT TAKING A JOB IS NOT FAILING IT. This is the distinction the old code
        could not express -- an auto-started quest could only be resolved or
        FAILED. An untaken job leaves the quest unrun, and the reckoning says
        "never taken", because that is what happened.
     5. AN ACCEPTED JOB THAT RUNS OUT OF LIGHT STILL FAILS, in the quest author's
        own words. The teeth stay.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PHONE_SRC = path.join(ROOT, 'slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html');
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('PHONE RINGS GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const S01 = fs.readFileSync(path.join(ROOT, 'quests/bq/S01_THE_METER_READER.bq'), 'utf8');

/* ---- 1. it is in the surfaces he plays --------------------------------- */
{
  const c = fs.readFileSync(CITY, 'utf8');
  ok('the offer is in the run', c.indexOf('__THE_PHONE_RINGS__') >= 0);
  ok('the wake card no longer opens the quest for him',
     !/function showWake\(\)\{\s*DAYOPEN=DQ\.openDay/.test(c));
  ok('the run listens for a yes from the phone', c.indexOf('bohemiaPhoneAccept') >= 0);
  const p = fs.readFileSync(PHONE_SRC, 'utf8');
  ok('and the phone can say it, in its SOURCE so a rebuild cannot delete it',
     p.indexOf('__PHONE_OFFER__') >= 0 && p.indexOf('phoneTake') >= 0);
}

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }

  /* one boot, driven as a player, reused by both scenarios below */
  async function boot() {
    const b = await chromium.launch();
    const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/^https?:/, r => r.abort());
    await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 120000 });
    for (let i = 0; i < 120; i++) { if (await pg.$('#daycardIn .dcgo')) break; await pg.waitForTimeout(200); }
    return { b, pg, errs };
  }
  async function openPhone(pg) {
    await pg.$eval('#phonebtn', el => el.click());
    let fr = null;
    for (let i = 0; i < 80; i++) {
      fr = pg.frames().find(f => /CURRENT_SLICE/.test(f.url()));
      if (fr) { try { if (await fr.evaluate(() => typeof LIVE !== 'undefined')) break; } catch (e) {} }
      await pg.waitForTimeout(500);
    }
    await pg.waitForTimeout(1200);
    return fr;
  }

  /* ================= SCENARIO A: he takes the job ===================== */
  {
    const { b, pg, errs } = await boot();
    const wake = await pg.evaluate(() => ({
      card: document.getElementById('daycardIn').textContent,
      qline: document.getElementById('qline').textContent,
      rang: window.__OFFER_RANG || 0,
      badge: (document.getElementById('phonebadge') || {}).textContent || ''
    }));
    ok('THE DAY STARTS WITH NO JOB -- no objective on the HUD at 06:00 ("'
       + wake.qline + '")', wake.qline === '');
    ok('but the wake card says something came in', /came in on your phone/i.test(wake.card));
    ok('and the phone is wearing a badge (' + wake.badge + ')', wake.badge === '1');
    ok('the offer really rang', wake.rang >= 1);

    await pg.$eval('#daycardIn .dcgo', el => el.click());
    await pg.waitForTimeout(300);
    const fr = await openPhone(pg);
    ok('the phone opens', !!fr);
    const off = fr ? await fr.evaluate(() => ({
      offer: LIVE && LIVE.offer,
      strip: (document.querySelector('.live-strip') || {}).textContent || '',
      take: !!document.querySelector('.lv-take')
    })) : {};
    ok('THE JOB IS ON THE PHONE, with a way to take it', !!off.offer && off.take === true);
    {
      const Q = BQ.parse(S01);
      const st = (Q.stages || []).filter(s => s.n === 10)[0];
      ok('and it is in THE QUEST\'S OWN WORDS, verbatim out of the .bq',
         !!off.offer && off.offer.text === st.log && S01.indexOf(off.offer.text) >= 0);
      ok('under the quest\'s real title', !!off.offer && off.offer.title === Q.title);
    }

    await fr.evaluate(() => document.querySelector('.lv-take').click());
    await pg.waitForTimeout(700);
    const after = await pg.evaluate(() => ({
      taken: window.__OFFER_TAKEN || 0,
      qline: document.getElementById('qline').textContent,
      badge: (document.getElementById('phonebadge') || {}).textContent || '',
      open: !!DAYOPEN
    }));
    ok('TAKING IT ON THE PHONE MAKES IT REAL IN THE RUN -- the objective goes live ("'
       + after.qline + '")', after.taken >= 1 && after.open === true && after.qline.length > 3);
    ok('and the badge clears', after.badge === '');

    /* accepted + ran out of light = the quest author's own FAIL stage */
    const night = await pg.evaluate(() => {
      advance(20 * 60);
      return { out: DQ.outcome(), notes: DAY.summary().notes,
               txt: document.getElementById('daycardIn').textContent };
    });
    const failLog = BQ.parse(S01).stages.filter(s => s.n === 33)[0].log;
    ok('AN ACCEPTED JOB THAT RUNS OUT OF LIGHT STILL FAILS -- the teeth stay',
       night.out === 'FAIL');
    ok('and it fails in its AUTHOR\'S words',
       (night.notes || []).indexOf(failLog) >= 0);

    await b.close();
    ok('no page error taking a job' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  }

  /* ============ SCENARIO B: he never takes it ========================== */
  {
    const { b, pg, errs } = await boot();
    await pg.$eval('#daycardIn .dcgo', el => el.click());
    await pg.waitForTimeout(300);
    const night = await pg.evaluate(() => {
      advance(20 * 60);                       /* walk the whole day out, job untouched */
      return { taken: window.__OFFER_TAKEN || 0, out: DQ.outcome(),
               done: DQ.done(), txt: document.getElementById('daycardIn').textContent };
    });
    ok('NOT TAKING A JOB IS NOT FAILING IT -- an untaken job leaves the quest unrun',
       night.taken === 0 && night.out === null && night.done === false);
    ok('and the reckoning says so, in as many words ("never taken")',
       /never taken/i.test(night.txt));
    ok('the reckoning still came up', /NIGHTFALL|TURNED IN/.test(night.txt));
    await b.close();
    ok('no page error leaving a job alone' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  }

  done();
})();
