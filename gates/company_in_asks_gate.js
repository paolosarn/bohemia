/* ============================================================================
   COMPANY IN ASKS GATE (9/13/26, QUESTS lane) -- VAMILY [company in asks],
   YOUR-PEOPLE-SHOW-UP-IN-THE-ASKING.

   PAOLO 9/11: "people in your company just get incorporated into quests
   autonomously, that's very cool."

   AND THE ROW'S OWN LAST SENTENCE IS THE DESIGN AND THIS GATE'S SPINE:
   *** THEY ARE PEOPLE WITH LEDGERS, NOT A ROSTER. ***

   MEASURED BEFORE A LINE WAS WRITTEN: engine/bohemia_down.js (PEOPLE, 9/12) had
   already checked and said it in its own words -- "There is no company roster, no
   companion state, no downed state." True. And the temptation that follows is to
   build the roster, which is the wrong half: a roster is a list somebody has to
   maintain, and the moment it exists it can disagree with the world.

   WHAT IT HOLDS:

   1. *** THERE IS NO LIST, AND DELETING THE RECORD DELETES THE MEMBER. *** This
      is the check the row is for. Membership is recomputed from the snapshot
      every call, so removing the bond or the witness row removes the person in
      the same instant. A module that kept a list would pass every other check
      here and fail this one.

   2. NOBODY IS YOURS BY DEFAULT. A person with no record is a stranger, refused
      with a reason, and that is the normal case -- it is what makes yours mean
      anything.

   3. A LEDGER THAT CANNOT NAME SOMEBODY NEVER PRODUCES A PERSON. The century
      household stamp is a COUNT per act, not a list, so it can say how many of
      your people are here and never which. The honest limit is enforced, not
      commented: a count can never become a face on somebody's ask.

   4. A ROLE IS NOT A PERSON. Bonds are keyed by the role a quest declared, and
      the cast is what turns a role into somebody. A bond with nobody cast into it
      names nobody and is skipped, rather than reported as a person called
      "lineman".

   5. THE TWO WAYS AN ASK CAN BE YOURS ARE DIFFERENT STORIES: one of yours is
      asking, or a stranger's ask is ABOUT one of yours. The second is the
      autonomous incorporation he described.

   6. IT CHANGES NO ASK AND WRITES NO RECORD. It reads and hands back a tag.

   7. NO CONTENT, NO THRESHOLD. A bond of any size is a bond; "how much counts" is
      a number nobody has ruled, so there is not one in the file.
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};

global.window = global;
const K = require(path.join(ROOT, 'engine/bohemia_company.js'));
const A = require(path.join(ROOT, 'engine/bohemia_asks.js'));
const src  = fs.readFileSync(path.join(ROOT, 'engine/bohemia_company.js'), 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
                .replace(/'[^']*'/g, "''").replace(/"[^"]*"/g, '""');

function snapOf() {
  return {
    bonds: { lineman: 15, fixer: 8, ghost: 3 },
    cast: { lineman: { who: 'P:12', where: 'b7' }, fixer: { who: 'P:31', where: 'b9' } },
    witnesses: [{ who: 'P:44', where: 'b7', kind: 'quiet_fix' }],
    housed: 6
  };
}

/* ---- 1. *** NO LIST: DELETE THE RECORD, LOSE THE MEMBER *** ------------- */
{
  const snap = snapOf();
  const before = K.yours(snap).map(m => m.who).sort();
  ok('1a the ledgers produce people (' + before.join(', ') + ')', before.length === 3);

  /* take the bond away */
  const noBond = snapOf(); delete noBond.bonds.lineman;
  ok('1b *** deleting the bond deletes the member, in the same instant ***',
     !K.isYours(noBond, 'P:12') && !!K.isYours(snapOf(), 'P:12'));
  /* take the cast away, leaving the bond: a role with nobody in it */
  const noCast = snapOf(); delete noCast.cast.lineman;
  ok('1c and so does deleting the cast, because a role is not a person',
     !K.isYours(noCast, 'P:12'));
  /* take the witness row away */
  const noWit = snapOf(); noWit.witnesses = [];
  ok('1d deleting the witness row deletes that member too',
     !K.isYours(noWit, 'P:44') && !!K.isYours(snapOf(), 'P:44'));
  /* AND THE STRUCTURAL HALF: the module cannot be holding a list. */
  ok('1e an empty world has nobody in it at all',
     K.yours({}).length === 0 && K.isYours({}, 'P:12') === null);
  ok('1f the same snapshot twice gives the same answer, and a changed one does not',
     JSON.stringify(K.yours(snapOf())) === JSON.stringify(K.yours(snapOf()))
     && JSON.stringify(K.yours(noBond)) !== JSON.stringify(K.yours(snapOf())));
  ok('1g the module keeps no mutable state of its own',
     !/\bvar\s+(MEMBERS|ROSTER|LIST|CACHE)\b/.test(code)
     && !/\.push\(\s*who\s*\)/.test(code));
}

/* ---- 2. NOBODY IS YOURS BY DEFAULT -------------------------------------- */
{
  const snap = snapOf();
  ok('2a a person with no record is a stranger', K.isYours(snap, 'P:99') === null);
  ok('2b a candidate naming nobody is refused',
     /names nobody/.test(K.refuse({ from: 'bond' }) || ''));
  ok('2c a candidate with no ledger behind it is refused',
     /no ledger says so/.test(K.refuse({ who: 'P:1' }) || ''));
  ok('2d a ledger that does not exist is refused by name',
     /does not exist/.test(K.refuse({ who: 'P:1', from: 'vibes' }) || ''));
  ok('2e a real member is not refused',
     K.refuse({ who: 'P:1', from: 'bond' }) === null);
}

/* ---- 3. A COUNT NEVER BECOMES A FACE ------------------------------------ */
{
  const snap = snapOf();
  const n = K.howMany(snap);
  ok('3a the roof ledger answers with a number', !!n && n.count === 6);
  ok('3b and says out loud that it can name nobody',
     !!n && n.names === false && /not a list of people/.test(n.cannot || ''));
  ok('3c the roof ledger can never produce a member, however it is asked',
     /cannot name anybody/.test(K.refuse({ who: 'P:1', from: 'roof' }) || ''));
  ok('3d and nobody in yours() came from it',
     K.yours(snap).every(m => m.from !== 'roof'));
  /* A HOUSE FULL OF PEOPLE AND NO BONDS AND NO WITNESSES IS STILL NOBODY. */
  ok('3e a world where the only record is the count has no members at all',
     K.yours({ housed: 40 }).length === 0);
  ok('3f the module declares which ledgers name and which count ('
     + K.naming().length + ' name, ' + K.counting().length + ' count)',
     K.naming().length === 2 && K.counting().length === 1);
  /* AND EVERY LEDGER POINTS AT A FILE THAT REALLY HOLDS IT. */
  const bad = K.ledgers().filter(f => !f.proof
    || !fs.existsSync(path.join(ROOT, f.proof.file))
    || fs.readFileSync(path.join(ROOT, f.proof.file), 'utf8').indexOf(f.proof.symbol) < 0);
  ok('3g every ledger names a real file that really holds it (' + bad.length + ' bad)',
     bad.length === 0, bad.map(f => f.id).join(', '));
}

/* ---- 4. A ROLE IS NOT A PERSON ------------------------------------------ */
{
  const snap = snapOf();
  ok('4a a bond with nobody cast into it names nobody',
     K.yours(snap).every(m => m.who !== 'ghost'));
  ok('4b and the person it does produce is the cast one, not the role name',
     !!K.isYours(snap, 'P:12') && K.isYours(snap, 'lineman') === null);
  ok('4c the bond carries which role it came from, for whoever needs it',
     (K.isYours(snap, 'P:12') || {}).role === 'lineman');
  /* A CAST THAT IS A BARE STRING WORKS TOO, because the city hands both shapes. */
  ok('4d a cast given as a bare id still names somebody',
     !!K.isYours({ bonds: { a: 1 }, cast: { a: 'P:7' } }, 'P:7'));
}

/* ---- 5. THE TWO WAYS AN ASK IS YOURS ------------------------------------ */
{
  const snap = snapOf();
  const mineAsking = K.inAsk({ who: 'P:12', about: 'c3' }, snap);
  ok('5a one of yours asking is tagged as asking',
     !!mineAsking && !!mineAsking.asking && !mineAsking.about);
  ok('5b and the line says so', /one of yours asking/i.test(K.say(mineAsking) || ''));
  const aboutMine = K.inAsk({ who: 'P:99', about: 'P:44' }, snap);
  ok('5c *** a stranger asking ABOUT one of yours is the autonomous one ***',
     !!aboutMine && !aboutMine.asking && !!aboutMine.about);
  ok('5d and it reads as a stranger asking about yours',
     /stranger is asking about one of yours/i.test(K.say(aboutMine) || ''));
  const both = K.inAsk({ who: 'P:12', about: 'P:44' }, snap);
  ok('5e both at once is its own line',
     !!both && !!both.asking && !!both.about
     && /about another one of yours/i.test(K.say(both) || ''));
  ok('5f a stranger about a stranger is not tagged at all, which is most asks',
     K.inAsk({ who: 'P:99', about: 'c3' }, snap) === null
     && K.say(null) === null);
}

/* ---- 6. IT CHANGES NOTHING ---------------------------------------------- */
{
  const snap = snapOf();
  const ask = { who: 'P:12', about: 'P:44', changes: 'light_comes_back' };
  const copy = JSON.stringify(ask), snapCopy = JSON.stringify(snap);
  K.inAsk(ask, snap);
  ok('6a tagging an ask does not change the ask', JSON.stringify(ask) === copy);
  ok('6b and does not change the world', JSON.stringify(snap) === snapCopy);
  ok('6c the module writes into no other system',
     !/Bohemia[A-Za-z]+\s*\.[A-Za-z]+\s*=[^=]/.test(code));
  ok('6d and it publishes, credits and moves nothing',
     !/publish|credit|transferOut|setOwner|\.set\(/.test(code));
  /* AND IT COMPOSES WITH THE GENERATOR RATHER THAN REPLACING IT. */
  const offer = A.offer({ circuits: [{ live: false, who: 'P:12', where: 'b7', id: 3 }] });
  ok('6e a real ask from the generator can be tagged', !!offer && !!K.inAsk(offer, snap));
  ok('6f and the generator still produced its own visible change',
     !!offer && offer.visible && offer.does);
}

/* ---- 7. NO CONTENT, NO THRESHOLD ---------------------------------------- */
{
  /* EVERY NUMBER ALLOWED IN THE CODE IS NAMED HERE WITH WHAT IT IS FOR. */
  const ALLOWED = { '0': 'zero, an index and an empty test', '1': 'one, a step' };
  const stray = (code.match(/\b\d+(\.\d+)?\b/g) || []).filter(n => !ALLOWED[n]);
  ok('7a not one stray number in the code (' + stray.length + ' stray: '
     + [...new Set(stray)].slice(0, 6).join(',') + ')', stray.length === 0);
  ok('7b a bond of any size counts, because how much counts is nobody\'s ruling',
     !!K.isYours({ bonds: { a: 1 }, cast: { a: 'P:1' } }, 'P:1')
     && !!K.isYours({ bonds: { a: 999 }, cast: { a: 'P:1' } }, 'P:1'));
  ok('7c including a bond that went negative, which is still a record of you two',
     !!K.isYours({ bonds: { a: -40 }, cast: { a: 'P:1' } }, 'P:1'));
  ok('7d no randomness', !/Math\.random/.test(code));
}

/* ---- THE REAL SURFACE ---------------------------------------------------- */
const city = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
ok('S1 the module ships in the walked city, verbatim',
   city.indexOf('BOHEMIA COMPANY -- YOUR PEOPLE SHOW UP IN THE ASKING') >= 0);
ok('S2 and the seam reads the same snapshot the ask does',
   /ctCompanySnapshot/.test(city) && /ctAskSnapshot/.test(city));

const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await SETTLE(page, 16000);

    let cityF = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof ctCompanySnapshot === 'function')) { cityF = f; break; } }
      catch (_e) {}
    }
    ok('R1 the company seam reached the frame the player walks in', !!cityF);

    if (cityF) {
      const got = await cityF.evaluate(() => {
        const out = {};
        try { out.snap = ctCompanySnapshot(); } catch (e) { out.err = String(e.message); }
        try { out.mine = ctYours(); } catch (e) { out.err2 = String(e.message); }
        try { out.howMany = ctCompanyCount(); } catch (e) {}
        try { out.tagged = ctAskMine(); } catch (e) { out.err3 = String(e.message); }
        /* AND THE LIVE PROOF, driven through the real seam with a record the world
           does not have: give the snapshot a bond and a cast and see a member
           appear, then take it away and see them gone. */
        const fake = { bonds: { x: 5 }, cast: { x: { who: 'P:TEST', where: '1,1' } } };
        out.appears = BohemiaCompany.yours(fake).length;
        delete fake.bonds.x;
        out.gone = BohemiaCompany.yours(fake).length;
        return out;
      });
      console.log('  [on the street] ' + JSON.stringify({
        bonds: got.snap && Object.keys(got.snap.bonds || {}).length,
        witnesses: got.snap && (got.snap.witnesses || []).length,
        housed: got.snap && got.snap.housed,
        yours: (got.mine || []).length }));
      ok('R2 the seam answers without throwing', !got.err && !got.err2 && !got.err3,
         got.err || got.err2 || got.err3);
      ok('R3 it hands the module the three ledgers in its own shape',
         !!got.snap && 'bonds' in got.snap && 'witnesses' in got.snap && 'housed' in got.snap);
      ok('R4 *** on the real surface, a record makes a member and removing it '
         + 'removes them ***', got.appears === 1 && got.gone === 0);
      ok('R5 and the live answer is a real list, however long (' + (got.mine || []).length + ')',
         Array.isArray(got.mine));
      /* AND THE HONEST STATE, CONDITIONAL SO IT NEVER PUNISHES PROGRESS. */
      const anyLedger = !!got.snap
        && (Object.keys(got.snap.bonds || {}).length + (got.snap.witnesses || []).length) > 0;
      ok('R6 members only when a ledger has somebody: the world holds '
         + (anyLedger ? 'records' : 'none') + ', so yours is '
         + ((got.mine || []).length) + ' and that is ' + (anyLedger ? 'required' : 'correct'),
         anyLedger ? (got.mine || []).length > 0 : (got.mine || []).length === 0);

      /* ===================================================================
         *** AND THE WHOLE THING, LIVE, WITH NOTHING FAKED. ***
         Take the day's job, let it cast real people into its roles, finish it so
         its own @DO bond fires, and read the seam: somebody the player actually
         worked with is now one of theirs, by name, off a record the game wrote
         itself. This is the row's own sentence -- they get incorporated
         autonomously -- happening without anybody scripting it.
         IT IS ALSO WHAT CAUGHT THE SEAM'S REAL BUG. ctDayCast() returns null the
         moment a quest is done, and the bond is earned AT the ending, so at the
         exact instant somebody becomes yours the only thing that can turn their
         ROLE into a PERSON disappeared. Measured: cast {lineman, fixer} while
         live, null one line later with bonds {lineman:15} sitting there and a
         company of nobody. The seam reads the recorded cast now.
         =================================================================== */
      const live = await cityF.evaluate(() => {
        const out = { steps: [] };
        try { out.took = ctOfferAccept(); } catch (e) { out.err = String(e.message); }
        out.steps.push('took the job: ' + out.took);
        /* the cast exists while the job is live -- read it, as the city does */
        try { const dc = ctDayCast(); out.cast = dc && dc.cast ? Object.keys(dc.cast) : null; }
        catch (e) {}
        out.steps.push('cast while live: ' + (out.cast || []).join(','));
        out.before = (ctYours() || []).length;
        /* finish it, which is what fires the quest's own @DO bond */
        try {
          const ends = (DQ.Q.stages || []).filter(st => (st.flags || []).indexOf('COMPLETE') >= 0);
          if (ends.length) DQ.rt.setStage(ends[0].n);
          out.ended = DQ.rt.state.stage;
          out.bonds = Object.keys(DQ.rt.state.bonds || {});
        } catch (e) { out.err2 = String(e.message); }
        out.after = ctYours() || [];
        out.castAfter = (typeof ctDayCast === 'function' && ctDayCast()) ? 'still there' : 'gone';
        return out;
      });
      console.log('  [live] ' + JSON.stringify({
        cast: live.cast, bonds: live.bonds, before: live.before,
        after: (live.after || []).length,
        castAfterTheJob: live.castAfter }));
      ok('R8 the day\'s job can be taken and it casts real people into its roles',
         live.took === true && (live.cast || []).length > 0, live.err);
      ok('R9 finishing it fires the quest\'s own bond',
         (live.bonds || []).length > 0, live.err2);
      ok('R10 *** and somebody the player actually worked with is now one of '
         + 'theirs, by name, off a record the game wrote itself ***',
         (live.after || []).length > live.before
         && !!(live.after || [])[0] && typeof live.after[0].who === 'string'
         && live.after[0].from === 'bond');
      ok('R11 *** including after the job ended, which is when the cast used to '
         + 'vanish *** (ctDayCast is ' + live.castAfter + ')',
         (live.after || []).length > 0);
      ok('R12 and the member is a person, never the role name',
         !!(live.after || [])[0] && (live.cast || []).indexOf(live.after[0].who) < 0
         && live.after[0].who.indexOf('P:') === 0);
    }
    ok('R13 nothing threw on the walked surface (' + errs.length + ')',
       errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('COMPANY IN ASKS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
