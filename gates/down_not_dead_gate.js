const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   BOHEMIA DOWN NOT DEAD GATE (9/12/26, PEOPLE lane).
   VAMILY [down not dead] -- row YOUR-PEOPLE-DO-NOT-DIE-FOR-GOOD.

   PAOLO 9/11, LOCKED: "I don't want anyone to permanently die, or even have
   permanent debuffs. There could be debuffs that are a lot longer than others."

   MEASURED BEFORE ANY OF THIS: no company roster, no companion state, no downed
   state, no injury model, nothing that could kill a person you keep. THE LAW WAS
   TRUE BY ACCIDENT, which is the worst way for a law to hold: the first system
   that can hurt a companion breaks it silently and no check says a word. This is
   that check.

   WHAT IT HOLDS:
   A. *** THERE IS NO WAY TO MAKE A KEPT PERSON DEAD. *** It tries: no flag, no
      option, no length that runs forever. The claim is proved by ATTEMPTING the
      thing the law forbids, not by reading a comment that says it cannot happen.
   B. every injury heals, for every id and every day, by arithmetic
   C. the lengths are HIS OWN EXAMPLES: a season, a year, and a week so that "a
      lot longer than others" has a bottom rung to mean anything against
   D. being down is a QUESTION against the clock, so a save left on a shelf comes
      back healed with nothing to tidy
   E. and he MEETS it: the seam COMBAT will call, the card he already opens, and
      the morning -- driven on the real demo

   node gates/down_not_dead_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const DEMO = 'file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0; const fail = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function head(t) { console.log('\n' + t); }

const D = require(path.join(ROOT, 'engine/bohemia_down.js'));

(async () => {
  head('A. THE LAW IS QUOTED, AND IT IS HIS');
  const lawPath = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_YOUR_PEOPLE_DO_NOT_DIE_FOR_GOOD_9_11_26.md');
  ok('the law exists where the row says it does', fs.existsSync(lawPath));
  const law = fs.existsSync(lawPath) ? fs.readFileSync(lawPath, 'utf8') : '';
  ok('and his words are in it verbatim, so this is not somebody\'s paraphrase',
    /don't want anyone to permanently die, or even\s+have permanent debuffs/.test(law.replace(/\n#?\s*/g, ' ')) ||
    law.indexOf("don't want anyone to permanently die") >= 0);
  ok('including the part that makes a LADDER of it rather than one timer',
    law.indexOf('debuffs that are a lot longer than others') >= 0);

  head('B. THERE IS NO WAY TO MAKE A KEPT PERSON DEAD, AND THIS TRIES');
  /* THE CLAIM IS PROVED BY ATTEMPTING THE FORBIDDEN THING. A gate that reads the
     comment saying "this cannot happen" proves the comment, not the code. */
  const attempts = [
    ['a fourth argument that might be a length', b => D.fall(b, 'x', 1, 99999)],
    ['an options object asking for permanence', b => D.fall(b, 'x', 1, { permanent: true })],
    ['a kind that does not exist', b => D.fall(b, 'x', 1, 'forever')],
  ];
  let escaped = [];
  attempts.forEach(([why, run]) => {
    const b = {};
    try { run(b); } catch (e) { }
    const r = b['x'];
    if (!r) return;
    if (!isFinite(r.until) || r.until - r.from > 365) escaped.push(why + ' -> ' + JSON.stringify(r));
  });
  ok('*** NO CALLER CAN ASK FOR A PERMANENT INJURY, AND THE TRIES ARE REAL *** '
    + '-- a fourth argument, an options object, an invented kind: none of them '
    + 'reach past the longest length he named',
    escaped.length === 0, escaped.join(' | ') || 'all three refused');
  ok('and fall() takes exactly three arguments, so there is no slot to smuggle '
    + 'one through', D.fall.length === 3, 'arity ' + D.fall.length);
  /* A COMMENT IS A BLOCK, NOT A LINE, and this claim proved it the hard way: the
     first cut grepped the RAW file for "Infinity" and went red on the module's own
     header, which says "no length of Infinity" while explaining that there is
     none. A check that trips on the sentence describing it is measuring prose. */
  const raw = fs.readFileSync(path.join(ROOT, 'engine/bohemia_down.js'), 'utf8');
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^[ \t]*\/\/.*$/gm, ' ');
  ok('the word Infinity appears nowhere in the module\'s CODE', src.indexOf('Infinity') < 0);
  ok('and neither does a dead/died/corpse flag on a kept person',
    !/\bdead\b|\bdied\b|\bcorpse\b/i.test(src));

  head('C. EVERY INJURY HEALS, BY ARITHMETIC, NOT BY PROMISE');
  let notHealed = 0, infinite = 0, n = 0;
  for (let i = 0; i < 5000; i++) {
    const b = {};
    const r = D.fall(b, 'p' + i, i % 500);
    if (!r) continue;
    n++;
    if (!isFinite(r.until)) infinite++;
    if (D.isDown(b, 'p' + i, r.until)) notHealed++;
    if (D.daysLeft(b, 'p' + i, r.until + 1) !== 0) notHealed++;
  }
  ok('*** ' + n + ' FALLS ACROSS EVERY KIND AND EVERY DAY, AND EVERY ONE HEALS ***',
    n > 1000 && notHealed === 0 && infinite === 0,
    notHealed + ' that did not heal, ' + infinite + ' that ran forever');
  ok('and the sweep really hit all three lengths, so it is not 5000 easy cases',
    (function () {
      const seen = {};
      for (let i = 0; i < 500; i++) { const b = {}; const r = D.fall(b, 'q' + i, i); if (r) seen[r.kind] = 1; }
      return Object.keys(seen).length === D.KINDS.length;
    })(), D.KINDS.join(', '));

  head('D. THE LENGTHS ARE HIS OWN EXAMPLES');
  ok('a leg takes A SEASON, which is about ninety days', D.HURT.leg.days === 90,
    D.HURT.leg.days + ' days');
  ok('a hand takes A YEAR of the valley\'s time', D.HURT.hand.days === 365,
    D.HURT.hand.days + ' days');
  ok('*** AND THEY REALLY ARE "A LOT LONGER THAN OTHERS" -- the longest is more '
    + 'than fifty times the shortest, so the ladder means something ***',
    D.HURT.hand.days / D.HURT.knocked.days > 50,
    D.HURT.knocked.days + ' vs ' + D.HURT.hand.days);
  ok('which injury it is comes off the seed, so a reload cannot change how badly '
    + 'somebody was hurt', (function () {
      const a = {}, b = {};
      D.fall(a, 'same', 12); D.fall(b, 'same', 12);
      return a.same.kind === b.same.kind && a.same.until === b.same.until;
    })());

  head('E. BEING DOWN IS A QUESTION AGAINST THE CLOCK, NOT A STATE TO REMEMBER');
  const shelf = {};
  D.fall(shelf, 'left-on-a-shelf', 1);
  ok('*** A SAVE THAT SAT FOR A YEAR COMES BACK HEALED, WITH NOTHING TO TIDY *** '
    + '-- nothing ticks it and nothing has to clear it',
    !D.isDown(shelf, 'left-on-a-shelf', 5000) && D.daysLeft(shelf, 'left-on-a-shelf', 5000) === 0);
  ok('and falling again while already down does not stack a second injury',
    (function () {
      const b = {}; const a1 = D.fall(b, 'z', 5); const a2 = D.fall(b, 'z', 6);
      return a1.until === a2.until; })());
  /* THE RECORD SURVIVES HEALING and say() still answers off it, which is the
     part a surface would ever need. hurtOf() was an export for this and nothing
     called it, so it is gone: see the module's note on the three dead helpers. */
  ok('and say() still answers once they are back up, off the record it kept',
    D.say(shelf, 'left-on-a-shelf', 5000) === 'BACK ON THEIR FEET',
    String(D.say(shelf, 'left-on-a-shelf', 5000)));

  head('F. AND HE MEETS IT -- THE SEAM, THE CARD AND THE MORNING, ON THE DEMO');
  const browser = await playwright().chromium.launch({ args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
    await page.goto(DEMO);
    await SETTLE(page, 15000);
    await page.evaluate(() => {
      const f = document.getElementById('fronttap') || document.getElementById('front');
      if (f) f.click(); });
    await SETTLE(page, 12000);
    await new Promise(r => setTimeout(r, 4000));
    const fr = page.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
    ok('the walked city is on screen', !!fr);
    if (fr) {
      const m = await fr.evaluate(() => {
        const o = {};
        for (let q = 0; q < 6; q++) {
          const gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
        try { cardHide(); } catch (e) { }
        o.wired = typeof BohemiaDown === 'object' && typeof ctFall === 'function'
               && typeof ctDownMine === 'function';
        famMarry(); for (let i = 0; i < 6; i++) famBorn();
        o.kept = BohemiaFamily.kidsOf(famTree()).length
               + (BohemiaFamily.spouseOf(famTree()) ? 1 : 0);
        const card = () => { try { showStanding(); } catch (e) { }
          const el = document.getElementById('daycardIn');
          return el ? String(el.textContent || '') : ''; };
        o.before = ctDownMine().length;
        o.cardBefore = card().indexOf('IS DOWN') >= 0;
        try { cardHide(); } catch (e) { }
        const kid = BohemiaFamily.kidsOf(famTree())[0];
        o.fell = ctFall(kid.id);
        o.after = ctDownMine().length;
        o.says = ctDownSay(kid.id);
        const c = card();
        o.cardSaysDown = c.indexOf('IS DOWN') >= 0;
        o.cardSaysNotGone = c.indexOf('Down, not gone') >= 0;
        o.cardSaysHowLong = /\d+ DAYS/.test(c);
        try { cardHide(); } catch (e) { }
        DAY.sleep(); DAY.nextDay(); daySync();
        try { showWake(); } catch (e) { o.threw = String(e.message).slice(0, 120); }
        const el2 = document.getElementById('daycardIn');
        o.morning = el2 ? String(el2.textContent || '') : '';
        o.morningSaysDown = o.morning.indexOf('IS STILL DOWN') >= 0;
        /* AND THEY COME BACK. THE CLOCK LIVES ON THE DAY LOOP and daySync copies
           it down, so setting T.day then calling daySync would quietly undo the
           jump -- which is exactly how the first cut of this check lied. */
        DAY.day = o.fell.until; try { daySync(); } catch (e) { }
        o.dayNow = T.day;
        o.endDown = ctDownMine().length;
        o.endSays = ctDownSay(kid.id);
        o.persisted = (() => { try { return !!localStorage.getItem('boh.city.down'); }
                               catch (e) { return false; } })();
        return o;
      });
      ok('the module and the seam are live in the played file', m.wired);
      ok('there are people to keep (' + m.kept + ')', m.kept >= 2);
      ok('nobody is down before anything happens, and the card says nothing',
        m.before === 0 && !m.cardBefore);
      ok('*** THE SEAM COMBAT WILL CALL PUTS SOMEBODY DOWN ***',
        !!m.fell && m.after === 1, JSON.stringify(m.fell));
      ok('*** AND THE CARD HE ALREADY OPENS SAYS WHO, AND FOR HOW LONG ***',
        m.cardSaysDown && m.cardSaysHowLong, String(m.says));
      ok('*** AND IT SAYS THE PROMISE OUT LOUD: "Down, not gone" ***',
        m.cardSaysNotGone);
      ok('nothing threw building the morning' + (m.threw ? ': ' + m.threw : ''), !m.threw);
      ok('the morning says it too, beside who is waiting on him', m.morningSaysDown);
      ok('*** AND WHEN THE TIME IS UP THEY COME BACK ***',
        m.dayNow === m.fell.until && m.endDown === 0 && m.endSays === 'BACK ON THEIR FEET',
        'day ' + m.dayNow + ', ' + m.endDown + ' down, ' + String(m.endSays));
      ok('and it survived a save', m.persisted);
    }
    ok('nothing threw on the page' + (errs.length ? ': ' + errs[0] : ''),
      errs.length === 0);
  } finally { await browser.close(); }

  console.log('\nDOWN NOT DEAD GATE: ' + pass + ' pass / ' + fail.length + ' fail');
  process.exit(fail.length ? 1 : 0);
})();
