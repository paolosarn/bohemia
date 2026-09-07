const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   BOHEMIA NEGLECT COSTS GATE (9/7/26, PEOPLE lane).
   VAMILY [neglect costs] -- row BB-OBLIGATION-BURN.

   THE ROW: "THE STAKES TABLE GETS ITS FIRST ENTRY AND IT IS AN OBLIGATION, NOT A
   METER ... ONE thing not five meters; it SCALES WITH SUCCESS so a bigger
   operation is a bigger obligation; the punishment is a person walking away, not
   a bar draining."

   WHAT THIS GATE HOLDS, AND WHY EACH ONE IS HERE:
   A. the STAKES table is no longer empty, and the entry is really IN THE SOCKET
      on the played surface -- not merely defined. The first cut pushed it beside
      `const DAY = ...`, nine thousand lines before the module exists, and the
      guard meant to make that safe swallowed it in silence: no throw, no log, an
      empty table and a reckoning that reported nothing forever. That is the
      failure this claim exists to catch.
   B. it costs nothing until you take somebody on, and it SCALES by counting
   C. the punishment is a PERSON, and showing up is what stops it
   D. *** IT READS NO PLACEHOLDER. *** bohemia_commitment's per-stage `neglect`
      numbers are all tagged "neglectPlaceholder": true, and consuming a number
      tagged as a placeholder is how a guess becomes canon by accident
   E. and he MEETS it -- the morning card, on the real demo

   node gates/neglect_costs_gate.js
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
function code(src) {
  return src.replace(/<!--[\s\S]*?-->/g, ' ')
            .replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/^[ \t]*\/\/.*$/gm, ' ');
}

const O = require(path.join(ROOT, 'engine/bohemia_obligation.js'));
const F = require(path.join(ROOT, 'engine/bohemia_family.js'));
const CAST = [{ role: 'FATHER', name: 'RAY', survivesIf: 'always', age: 'adult' },
               { role: 'MOTHER', name: 'DENISE', survivesIf: 'always', age: 'adult' },
               { role: 'BROTHER', name: 'MARCO', survivesIf: 'male', age: 'teen' },
               { role: 'SISTER', name: 'NINA', survivesIf: 'female', age: 'child' }];

function facts(over) {
  const base = { tree: [], commit: {}, gone: {},
                 deedsFor: () => [], opinionOf: () => null };
  return Object.assign(base, over || {});
}

(async () => {
  head('A. IT COSTS NOTHING UNTIL YOU TAKE SOMEBODY ON');
  const bare = F.seedTree(CAST, 'male');
  ok('*** THE FAMILY YOU WERE BORN INTO IS NOT AN OBLIGATION *** -- act one opens '
    + 'by losing them and the ones who walked out walked out WITH you. What you '
    + 'TOOK ON is the marriage and the children, and that is a reading of the '
    + 'story, not an oversight',
    O.sizeOf(facts({ tree: bare })) === 0, O.sizeOf(facts({ tree: bare })) + ' waiting');
  ok('and an outfit you have said NOTHING to is not an obligation either -- '
    + '"NOTHING SAID" is the commitment ladder\'s own first rung',
    O.sizeOf(facts({ commit: { Cartel: 'none' } })) === 0);

  head('B. IT SCALES WITH SUCCESS, BY COUNTING, NOT BY A CURVE');
  const tree = F.seedTree(CAST, 'male');
  F.marry(tree, { name: null, draft: true, pending: true });
  while (F.bear(tree, 'seedG', {})) { }
  const kids = F.kidsOf(tree).length;
  const withKin = O.sizeOf(facts({ tree: tree }));
  ok('a marriage and the children are ' + (kids + 1) + ' people waiting on you',
    withKin === kids + 1, withKin + ' waiting, ' + kids + ' children');
  const one = O.sizeOf(facts({ tree: tree, commit: { Cartel: 'sided' } }));
  const two = O.sizeOf(facts({ tree: tree, commit: { Cartel: 'sided', Blues: 'burned' } }));
  ok('*** AND EVERY OUTFIT YOU SWEAR TO ADDS EXACTLY ONE *** -- a bigger '
    + 'operation is a bigger obligation, and there is no weighting because '
    + 'weighting is where a number nobody ruled would sneak in',
    one === withKin + 1 && two === withKin + 2, withKin + ' -> ' + one + ' -> ' + two);

  head('C. THE PUNISHMENT IS A PERSON, AND SHOWING UP IS WHAT STOPS IT');
  const against = { tree: tree, commit: { Cartel: 'sided' }, gone: {},
                    deedsFor: () => [], opinionOf: id => id === 'fac:Cartel' ? -1 : null };
  const walked = O.whoWalks(against, 0, 999999).map(p => p.id);
  ok('*** SOMEBODY YOU WRONGED AND THEN IGNORED STOPS WAITING FOR YOU ***',
    walked.length === 1 && walked[0] === 'fac:Cartel', walked.join(',') || 'nobody');
  const showed = Object.assign({}, against,
    { deedsFor: id => id === 'fac:Cartel' ? [{ turn: 100 }] : [] });
  ok('*** AND SHOWING UP FOR THEM THAT DAY IS WHAT STOPS IT *** -- which is the '
    + 'whole mechanic: not a bar you top up, a person you turned up for',
    O.whoWalks(showed, 0, 999999).length === 0);
  const liked = Object.assign({}, against,
    { opinionOf: id => id === 'fac:Cartel' ? 3 : null });
  ok('somebody who thinks well of you gets a quiet day for free, which is true '
    + 'of people and is why this is not a daily tax',
    O.whoWalks(liked, 0, 999999).length === 0);
  ok('and a deed on a DIFFERENT day does not count -- the reckoning is about the '
    + 'day it reckons',
    O.whoWalks(Object.assign({}, against,
      { deedsFor: id => id === 'fac:Cartel' ? [{ turn: 5 }] : [] }), 100, 999).length === 1);

  head('D. IT REFUSES TO GUESS, AND IT READS NO PLACEHOLDER');
  let threwDeeds = false, threwOp = false;
  try { O.showedUpFor({}, 'x', 0, 1); } catch (_e) { threwDeeds = true; }
  try { O.whoWalks({ deedsFor: () => [] }, 0, 1); } catch (_e) { threwOp = true; }
  ok('it THROWS rather than guess how deeds are stored -- guessing a ledger shape '
    + 'is how a check silently starts measuring nothing', threwDeeds);
  ok('and it THROWS rather than decide for itself that somebody has had enough of '
    + 'you; that is the standing web\'s answer', threwOp);
  const mod = code(fs.readFileSync(path.join(ROOT, 'engine/bohemia_obligation.js'), 'utf8'));
  ok('*** IT NEVER READS neglectFor OR THE PLACEHOLDER NUMBERS *** -- every '
    + 'per-stage `neglect` in the commitment ladder is tagged '
    + '"neglectPlaceholder": true, and consuming one would make a guess canon',
    mod.indexOf('neglectFor') < 0 && mod.indexOf('neglect') < 0);
  const commit = fs.readFileSync(path.join(ROOT, 'engine/bohemia_commitment.js'), 'utf8');
  ok('and those placeholders really are still placeholders, so this claim is not '
    + 'guarding a thing that stopped existing',
    (commit.match(/"neglectPlaceholder":\s*true/g) || []).length > 0,
    (commit.match(/"neglectPlaceholder":\s*true/g) || []).length + ' tagged');

  head('E. AND HE MEETS IT -- THE STAKES SOCKET AND THE MORNING CARD, ON THE DEMO');
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
        o.wired = typeof BohemiaObligation === 'object' && typeof ctOblFacts === 'function';
        o.socket = DAY.STAKES.map(s => s.name);
        o.before = BohemiaObligation.sizeOf(ctOblFacts());
        famMarry(); for (let n = 0; n < 6; n++) famBorn();
        try { const sv = ctBelongSave(); sv.meta = sv.meta || {};
              sv.meta.commit = { Cartel: 'sided' }; } catch (e) { }
        o.after = BohemiaObligation.sizeOf(ctOblFacts());
        DAY.sleep();
        const led = DAY.history.length ? DAY.history[DAY.history.length - 1] : DAY.ledger;
        o.reckoned = led && led.obligation ? led.obligation : null;
        /* the write really removes somebody from the list */
        const first = BohemiaObligation.waitingOn(ctOblFacts())[0];
        ctOblApply([first.id]);
        o.afterGone = BohemiaObligation.sizeOf(ctOblFacts());
        DAY.nextDay(); daySync();
        try { showWake(); } catch (e) { o.threw = String(e.message).slice(0, 120); }
        const el = document.getElementById('daycardIn');
        o.card = el ? String(el.textContent || '').replace(/\s+/g, ' ') : '';
        return o;
      });
      ok('the module and the facts are live in the played file', m.wired);
      ok('*** THE STAKES TABLE IS NOT EMPTY ANY MORE, AND THE ENTRY IS REALLY IN '
        + 'THE SOCKET *** -- it was [] from the day the day loop shipped, and a '
        + 'load-order guard once made this look fine while it held nothing',
        m.socket.length === 1 && m.socket[0] === 'obligation', m.socket.join(',') || 'EMPTY');
      ok('nobody is waiting on a player who has taken nobody on', m.before === 0,
        String(m.before));
      ok('a marriage, the children and one outfit sworn to are all waiting',
        m.after > m.before, m.before + ' -> ' + m.after);
      ok('*** AND THE RECKONING REALLY WROTE IT, on the reckoning the game runs '
        + 'when you sleep ***', !!m.reckoned && m.reckoned.waiting === m.after,
        JSON.stringify(m.reckoned));
      ok('somebody who has stopped waiting is off the list for good', m.afterGone === m.after - 1,
        m.after + ' -> ' + m.afterGone);
      ok('nothing threw building the morning' + (m.threw ? ': ' + m.threw : ''), !m.threw);
      ok('*** AND HE READS IT IN THE MORNING, beside what his city made while he '
        + 'slept ***', m.card.indexOf('WAITING ON YOU') >= 0,
        (m.card.match(/[0-9]+ PEOPLE ARE WAITING ON YOU[^.]*/) || ['not on the card'])[0]);
    }
    ok('nothing threw on the page' + (errs.length ? ': ' + errs[0] : ''), errs.length === 0);
  } finally { await browser.close(); }

  console.log('\nNEGLECT COSTS GATE: ' + pass + ' pass / ' + fail.length + ' fail');
  process.exit(fail.length ? 1 : 0);
})();
