const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   BOHEMIA FAMILY EVENTS GATE (9/7/26, PEOPLE lane).
   VAMILY [family events] -- row FAMILY-EVENTS.

   THE ROW: "something writes a child, a marriage, an ageing into family.tree;
   selectHeir has zero callers."

   THE ROW WAS TRUE AND WORSE THAN IT SAID. The RUN lane put the family CAST in
   the walked world on 9/4 and that is real. But nothing could ever CHANGE it,
   in a game whose spine is three generations.

   WHAT THIS GATE HOLDS, AND WHY EACH ONE IS HERE:
   A. the row's own measurement, re-run every time, with comments stripped --
      because a comment is a block and not a line, and the first count of this
      lane's own claims was wrong three separate times for exactly that reason
   B. the tree does not RE-DECIDE who was lost; it uses the shell's answer
   C. the module cannot invent a spouse, which is the one thing Paolo reserved
   D. the counts are HIS CANON's, not a dial somebody picked
   E. ageing uses real age bands -- the first cut made a teen an ELDER in one
      thirty-year fold and only driving it caught that
   F. THE ONE RULE, TWICE, PROVEN: heirOf and the engine bundle's selectHeir
      agree over hundreds of randomised families. The duplicate exists because
      the bundle is a handoff artifact a browser slice cannot import, and a
      duplicate that is merely HOPED to agree is the bug this repo keeps paying
   G. and he can reach all of it: the real card, the real button, pressed

   node gates/family_events_gate.js
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

/* COMMENTS ARE BLOCKS. Strip them before counting anything, or a file that only
   TALKS about a symbol reads as a file that USES it -- which is how this lane
   miscounted its own claims three times in one session. */
function code(src) {
  return src.replace(/<!--[\s\S]*?-->/g, ' ')
            .replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/^[ \t]*\/\/.*$/gm, ' ');
}
function countIn(file, term) {
  return code(fs.readFileSync(path.join(ROOT, file), 'utf8')).split(term).length - 1;
}

(async () => {
  head('A. THE ROW, RE-MEASURED, IN THE FILES THAT ARE THE GAME');
  const PLAYED = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_CITY_WORLD.html',
                  'slices/BOHEMIA_DEMO.html'];
  /* THE HALF THAT MUST NOW BE NON-ZERO. Before this row the walked city had no
     tree at all; the claim is that it does, in the file a player actually runs. */
  const treeInCity = countIn('slices/BOHEMIA_CITY_WORLD.html', 'famTree');
  /* *** THE FIRST CUT OF THIS CLAIM COUNTED famTree INSIDE BOHEMIA_DEMO.html AND
     READ ZERO, AND THE CLAIM WAS WRONG, NOT THE CODE. *** The demo does not
     inline the walked city; it LOADS it, which is why the browser pass below
     finds a real BOHEMIA_CITY_WORLD frame and drives the tree in it. Counting a
     symbol in a file that only references another file measures nothing. So the
     claim is repointed at what is actually true and actually checkable: the city
     holds it, the demo really loads THAT city, and section H proves a stranger
     opening the demo can reach it. */
  const demoLoadsCity = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'),
    'utf8').split('BOHEMIA_CITY_WORLD.html').length - 1;
  ok('*** THE WALKED CITY NOW HAS A FAMILY TREE *** -- it was ZERO before this row',
    treeInCity > 0, treeInCity + ' mentions in code');
  ok('and the demo a stranger opens really loads that same city file, so what is '
    + 'proved in the city is what he gets', demoLoadsCity > 0,
    demoLoadsCity + ' references');
  const heirInCity = countIn('slices/BOHEMIA_CITY_WORLD.html', 'heirOf');
  ok('and the heir rule is CALLED in the played file, which is the half of the '
    + 'row that said selectHeir has zero callers', heirInCity > 0,
    heirInCity + ' calls');

  head('B. THE MODULE IS SWEPT, SO IT CANNOT DRIFT FROM engine/');
  const city = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const mod = fs.readFileSync(path.join(ROOT, 'engine/bohemia_family.js'), 'utf8');
  ok('the city carries the module inside the resync FENCE, which is the only '
    + 'thing bohemia_city_module_resync looks for -- an unfenced copy drifts '
    + 'silently, which is the exact rot that tool exists to kill',
    city.indexOf('/* ==== engine/bohemia_family.js') >= 0
    && city.indexOf('/* ==== /engine/bohemia_family.js') >= 0);
  ok('and the copy in the city is byte-identical to engine/bohemia_family.js',
    city.indexOf(mod) >= 0);

  head('C. THE HEIR RULE, TWICE, PROVEN -- NOT HOPED');
  const F = require(path.join(ROOT, 'engine/bohemia_family.js'));
  const E = require(path.join(ROOT, 'engine/bohemia_engine.js'));
  let bundlePick = null;
  for (const k of Object.keys(E)) {
    if (E[k] && typeof E[k].selectHeir === 'function') { bundlePick = E[k].selectHeir; break; }
  }
  ok('the engine bundle\'s own selectHeir is reachable to compare against -- if '
    + 'this ever fails the comparison below is VACUOUS and must not be trusted',
    typeof bundlePick === 'function');
  if (typeof bundlePick === 'function') {
    let rnd = 1, differ = 0, n = 0, sawKid = 0, sawNep = 0, sawNone = 0;
    const r = () => { rnd = (rnd * 1103515245 + 12345) & 0x7fffffff; return rnd / 0x7fffffff; };
    for (let t = 0; t < 600; t++) {
      const tree = [];
      const kids = (r() * 5) | 0, nep = (r() * 4) | 0;
      for (let i = 0; i < kids; i++) tree.push({ id: 'kid:' + i, rel: 'child', alive: r() > 0.3 });
      for (let j = 0; j < nep; j++) tree.push({ id: 'nep:' + j, rel: 'sibling_child', alive: r() > 0.3 });
      tree.push({ id: 'p', rel: 'parent', alive: true });
      const seed = 's' + ((r() * 10000) | 0), gen = 1 + ((r() * 3) | 0);
      const mine = F.heirOf(tree, seed, gen);
      const theirs = bundlePick({ tree: tree }, seed, gen);
      n++;
      if (mine !== theirs) differ++;
      if (mine && mine.indexOf('kid:') === 0) sawKid++;
      else if (mine && mine.indexOf('nep:') === 0) sawNep++;
      else sawNone++;
    }
    ok('*** heirOf AND THE ENGINE BUNDLE AGREE ON EVERY ONE OF ' + n + ' RANDOM '
      + 'FAMILIES *** -- the played game cannot import a handoff bundle, so the '
      + 'copy is unavoidable and proven agreement is the only honest form of one',
      differ === 0, differ + ' disagreements');
    /* AND THE COMPARISON ACTUALLY EXERCISED ALL THREE ANSWERS. A sweep where
       every family happened to have a living child would prove almost nothing
       and would still read as 600 green. */
    ok('and the sweep really hit all three answers, so it is not 600 easy cases',
      sawKid > 0 && sawNep > 0 && sawNone > 0,
      sawKid + ' child, ' + sawNep + ' sibling\'s child, ' + sawNone + ' nobody');
  }

  head('D. WHAT THE MODULE REFUSES TO DO, WHICH IS THE PART THAT IS HIS');
  const RAW = [{ role: 'FATHER', name: 'RAY', survivesIf: 'always', age: 'adult' },
               { role: 'MOTHER', name: 'DENISE', survivesIf: 'always', age: 'adult' },
               { role: 'BROTHER', name: 'MARCO', survivesIf: 'male', age: 'teen' },
               { role: 'SISTER', name: 'NINA', survivesIf: 'female', age: 'child' }];
  let threw = false;
  try { F.marry(F.seedTree(RAW, 'male'), null); } catch (_e) { threw = true; }
  ok('*** marry() THROWS RATHER THAN INVENT A PARTNER *** -- the coordinator '
    + 'ruled 9/5 that WHO YOU CAN MARRY IS PAOLO\'S, and a silent default here '
    + 'would BE the decision he reserved', threw);
  /* *** THE FIRST CUT LOOKED FOR A "NAME POOL" WITH A REGEX FOR TWO QUOTED CAPS
     IN A ROW, AND IT FAILED ON ITS OWN ORDINALS ARRAY *** -- FIRSTBORN, SECOND,
     THIRD are player-facing WORDS, not people. A regex that cannot tell a word
     list from a cast list is not measuring the claim. So this asks the thing the
     claim actually means: every single `name:` this module writes is either null
     or a field off an object somebody else handed in. It never authors one. */
  const nameWrites = [...code(mod).matchAll(/name\s*:\s*([^,\n}]+)/g)]
    .map(m => m[1].trim());
  const authored = nameWrites.filter(v => /['"]/.test(v));
  ok('*** EVERY `name:` IN THE MODULE IS null OR READ OFF SOMETHING HANDED IN, '
    + 'NEVER A LITERAL *** -- so it cannot author a person even by accident',
    nameWrites.length > 0 && authored.length === 0,
    nameWrites.length + ' writes, ' + authored.length + ' literal: '
      + (authored.join(' | ') || 'none'));

  head('E. THE COUNTS ARE HIS CANON\'S, NOT A DIAL');
  ok('three to four children, straight off GDD v2 line 245 ("Has three to four '
    + 'children from this marriage")', F.KIDS_MIN === 3 && F.KIDS_MAX === 4,
    F.KIDS_MIN + '..' + F.KIDS_MAX);
  let lo = 0, hi = 0;
  for (let i = 0; i < 400; i++) {
    const c = F.howManyKids('seed' + i);
    if (c === 3) lo++; else if (c === 4) hi++; else hi = -9999;
  }
  ok('and every seed lands inside that range, both values reachable',
    lo > 0 && hi > 0 && lo + hi === 400, lo + ' threes, ' + hi + ' fours');

  head('F. AGEING USES REAL AGE BANDS, WHICH THE FIRST CUT DID NOT');
  const t2 = F.seedTree(RAW, 'male');
  F.marry(t2, { name: null, draft: true, pending: true });
  while (F.bear(t2, 'seedX', {})) { }
  F.agePeople(t2, 30);
  const marco = F.byId(t2, 'cast:BROTHER');
  const ray = F.byId(t2, 'cast:FATHER');
  const kid1 = F.byId(t2, 'kid:1');
  ok('*** A TEEN PLUS THIRTY YEARS IS AN ADULT, NOT AN ELDER *** -- the first cut '
    + 'added a flat three rungs and made MARCO an elder, which reads fine and is '
    + 'false. A ladder position is not a number of years',
    marco && marco.age === 'adult', marco ? marco.age + ' at ' + marco.years : 'no marco');
  ok('an adult plus thirty is an elder', ray && ray.age === 'elder',
    ray ? ray.age + ' at ' + ray.years : 'no ray');
  ok('and a newborn plus thirty is an adult', kid1 && kid1.age === 'adult',
    kid1 ? kid1.age + ' at ' + kid1.years : 'no child');
  ok('the dead do not age', (function () {
    const nina = F.byId(t2, 'cast:SISTER');
    return nina && !nina.alive && nina.years === null; })());

  head('G. WHO WAS LOST IS NEVER DECIDED TWICE');
  const RESOLVED = RAW.map(m => ({ role: m.role, name: m.name, age: m.age,
    alive: m.role !== 'BROTHER' }));   /* the shell says the BROTHER is gone */
  const t3 = F.seedTree(RESOLVED, 'male');   /* sex would say the SISTER */
  const gone = t3.filter(n => !n.alive).map(n => n.name).join(',');
  ok('*** THE SHELL\'S ANSWER WINS OVER RE-DERIVING IT *** -- the walked city '
    + 'already carries `alive`, resolved from his 7/19 ruling at the cold open, '
    + 'and the game must never disagree with itself about which sibling died',
    gone === 'MARCO', 'lost: ' + gone);
  const t4 = F.seedTree(RAW, 'male');
  ok('and a caller holding only the RAW cast still gets the ruling applied',
    t4.filter(n => !n.alive).map(n => n.name).join(',') === 'NINA');

  head('H. AND HE CAN REACH ALL OF IT -- THE REAL CARD, THE REAL BUTTON, PRESSED');
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
        const txt = () => { const el = document.getElementById('daycardIn');
                            return el ? String(el.textContent || '') : ''; };
        o.wired = typeof BohemiaFamily === 'object' && typeof famTree === 'function';
        o.arrived = (famHydrate() || []).length;
        o.builtFromShell = (famTree() || []).length;
        o.heirWithNoChildren = famHeir(1);
        try { showStanding(); } catch (e) { o.threw = String(e.message).slice(0, 120); }
        o.saysNotMarried = txt().indexOf('NOT MARRIED') >= 0;
        o.button = !!document.getElementById('fammarry');
        const b = document.getElementById('fammarry'); if (b) b.click();
        try { cardHide(); showStanding(); } catch (e) { }
        o.afterPressMarried = txt().indexOf('MARRIED') >= 0
                           && txt().indexOf('NOT MARRIED') < 0;
        o.afterPressButtonGone = !document.getElementById('fammarry');
        for (let n = 0; n < 8; n++) { try { famBorn(); } catch (e) { } }
        try { cardHide(); showStanding(); } catch (e) { }
        o.showsChildren = txt().indexOf('YOUR CHILDREN') >= 0;
        o.showsWhoInherits = txt().indexOf('WHO INHERITS') >= 0;
        o.kids = BohemiaFamily.kidsOf(famTree()).length;
        o.canon = BohemiaFamily.howManyKids(famSeedText());
        o.heir = famHeir(1);
        o.persisted = (() => { try {
          return !!localStorage.getItem('boh.city.famtree'); } catch (e) { return false; } })();
        FAMTREE = null;                       /* the way a fresh boot arrives */
        o.heirAfterRehydrate = famHeir(1);
        return o;
      });
      ok('the module and the tree are live in the played file', m.wired);
      ok('the family arrived from the shell (' + m.arrived + ') and the tree was '
        + 'built from it (' + m.builtFromShell + ')',
        m.arrived === 4 && m.builtFromShell === 4);
      ok('*** A DYNASTY WITH NO CHILDREN HAS NO HEIR, AND THAT IS A REAL STATE *** '
        + '-- the engine calls it a dynasty in crisis and it is not an error',
        m.heirWithNoChildren === null);
      ok('nothing threw building the card' + (m.threw ? ': ' + m.threw : ''), !m.threw);
      ok('the card says NOT MARRIED and offers the button', m.saysNotMarried && m.button);
      ok('*** PRESSING IT MARRIES, ON THE CARD HE ALREADY OPENS ***',
        m.afterPressMarried);
      ok('and the offer is gone afterwards, because canon calls it a PERMANENT '
        + 'act one decision', m.afterPressButtonGone);
      ok('nights pass and the children are written into the tree, stopping at his '
        + 'canon count', m.showsChildren && m.kids === m.canon,
        m.kids + ' of a canon ' + m.canon);
      ok('*** AND THE CARD SAYS WHO INHERITS, WHICH IS selectHeir\'S RULE RUNNING '
        + 'SOMEWHERE A PLAYER CAN SEE IT ***', m.showsWhoInherits && !!m.heir,
        String(m.heir));
      ok('the tree survives a reload AND THE HEIR DOES NOT CHANGE -- GDD v4 58: '
        + '"Same family + seed = same heir forever, regardless of reload timing"',
        m.persisted && m.heirAfterRehydrate === m.heir,
        m.heir + ' -> ' + m.heirAfterRehydrate);
    }
    ok('nothing threw on the page' + (errs.length ? ': ' + errs[0] : ''),
      errs.length === 0);
  } finally { await browser.close(); }

  console.log('\nFAMILY EVENTS GATE: ' + pass + ' pass / ' + fail.length + ' fail');
  process.exit(fail.length ? 1 : 0);
})();
