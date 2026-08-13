/* ============================================================================
   REACTION REACH GATE (8/13/26, PEOPLE lane)

   WHY THIS EXISTS AND WHY IT IS A BROWSER GATE.

   The reaction lines were written, cited, gated and GREEN while not one person
   in the game could say one of them. Three separate things were wrong at once
   and every one of them was invisible to a gate that reads files:

     1. THE SCREEN NEVER ASKED. The only call site in the walked run was
        `BohemiaPeople.linesFor(who)` -- no second argument -- so every reaction
        bucket AND every one of the 58 situation buckets was unreachable. The
        table was full and nobody could hear it.
     2. THE COPY HE LOADS WAS STALE. The module was right on disk, which is what
        every other gate reads. The frame the RUN tab actually loads carries an
        INLINED copy, and it was a build behind with no REACTIONS in it at all.
     3. A DEAD KEY. `met:lied` could never fire because the ledger stored one bit
        for honesty and discarded the false case, so "never answered" and "lied"
        were the same record.

   THEN THE FIRST VERSION OF THE CHECK WAS ALSO WRONG, and that is the real
   lesson here. It grepped the source for `RUN.sawList` and `BohemiaStanding`.
   Mutating the code to `if(false){...}` LEFT BOTH STRINGS IN THE FILE and the
   gate stayed green -- a checker that cannot tell a MENTION from a USE is the
   broken one (laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md). So this does
   not read the file. It BOOTS THE SURFACE, plants signals the way the world
   plants them, and asks the page what came out. If the wiring is cut, the answer
   changes, and no amount of leftover text can hide that.

   VERIFY ON THE REAL SURFACE (7/18): a side-door probe is a lie.
   ========================================================================== */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const RUN = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  ok('the run surface exists', fs.existsSync(RUN));
  if (!fs.existsSync(RUN)) { console.log('REACTION REACH GATE: 0 passed, 1 failed'); process.exit(1); }

  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  await page.goto('file://' + RUN);
  await page.waitForTimeout(6000);

  const r = await page.evaluate(() => {
    const out = { steps: [] };
    const P = window.BohemiaPeople;
    out.module = !!P;
    out.reactions = !!(P && P.REACTIONS) && Object.keys(P.REACTIONS).length;
    out.ctxFn = (typeof reactionCtx === 'function');
    if (!out.module || !out.ctxFn) return out;

    const roster = (window.SIM && SIM.agents) ? SIM.agents : [];
    out.agents = roster.length;
    if (!roster.length) return out;
    const a = roster[0], who = { key: 'gate_probe', role: 'worker', faction: 'Trades' };

    /* BASELINE. Nothing has happened, so nothing is known: the honest answer is
       a stranger, and the ambient buckets are what should speak. */
    const base = reactionCtx(a, who);
    out.baseline = base;
    out.baselineQuiet = !base.saw && !base.heard && !base.rung;

    /* PLANT WHAT THE WORLD PLANTS. witnessResolution() writes exactly this shape:
       a clout tag for the deed and a list of who was in reach, each flagged for
       whether they were OUTDOORS (saw it) or behind a wall (heard it). */
    const keepClout = window.RUN.clout, keepSaw = window.RUN.sawList;
    window.RUN.clout = 'reckless';
    window.RUN.sawList = [{ id: a.id, saw: true }];
    out.sawCtx = reactionCtx(a, who);
    window.RUN.sawList = [{ id: a.id, saw: false }];
    out.heardCtx = reactionCtx(a, who);
    /* somebody who was NOT in reach learns nothing, which is the claim that
       separates a real read from a constant. */
    window.RUN.sawList = [{ id: 'nobody-else', saw: true }];
    out.strangerCtx = reactionCtx(a, who);
    window.RUN.clout = keepClout; window.RUN.sawList = keepSaw;

    /* PLANT A STANDING THE WAY THE WORLD PLANTS ONE, and every part of it is his.
       A deed's force comes from DEED_WEIGHT[kind], which SHIPS EMPTY and is filled
       from HIS OWN CORPUS by loadCorpus over the canon quests this page carries --
       so the gate loads the corpus exactly as the run does and then picks the
       heaviest deed kind in each direction OUT OF THAT TABLE. Nothing is invented:
       if he retunes a @DO line, this follows him. */
    if (typeof blockMinds === 'function' && typeof BohemiaStanding !== 'undefined'
        && typeof BohemiaDeeds !== 'undefined') {
      try {
        BohemiaDeeds.loadCorpus((window.CANON_QUESTS || []).map((src, i) => ({ id: 'C' + i, src })));
      } catch (_e) { /* the table stays empty and the claims below say so */ }
      const W = BohemiaStanding.DEED_WEIGHT || {};
      const kinds = Object.keys(W);
      out.deedKinds = kinds.length;
      const worst = kinds.filter(k => W[k] < 0).sort((x, y) => W[x] - W[y])[0];
      const best = kinds.filter(k => W[k] > 0).sort((x, y) => W[y] - W[x])[0];
      out.worstKind = worst; out.bestKind = best;
      const minds = blockMinds();
      let mine = null;
      for (let i = 0; i < minds.length; i++) if (minds[i].owner === a.id) { mine = minds[i]; break; }
      if (mine && worst && best) {
        const keep = mine.deeds, now = (window.SIM ? SIM.turn : 0) | 0;
        mine.deeds = [{ actor: 'PLAYER', kind: worst, turn: now, hops: 0 }];
        out.hostileCtx = reactionCtx(a, who);
        out.worstValue = BohemiaStanding.opinionOf(mine, 'PLAYER', now);
        mine.deeds = [{ actor: 'PLAYER', kind: best, turn: now, hops: 0 }];
        out.warmCtx = reactionCtx(a, who);
        out.bestValue = BohemiaStanding.opinionOf(mine, 'PLAYER', now);
        mine.deeds = keep;
      }
    }

    /* AND THE WORDS THAT COME OUT MUST DIFFER. Four levels of context, four
       different things said, or the precedence is decoration. */
    const said = {
      saw: P.linesFor(who, { saw: 'reckless', heard: 'reckless', rung: 'HOSTILE', met: 'lied' })[0],
      heard: P.linesFor(who, { heard: 'reckless', rung: 'HOSTILE', met: 'lied' })[0],
      rung: P.linesFor(who, { rung: 'HOSTILE', met: 'lied' })[0],
      met: P.linesFor(who, { met: 'lied' })[0],
      ambient: P.linesFor(who, { when: 'night' })[0],
    };
    out.said = said;
    out.distinct = new Set(Object.values(said).filter(Boolean)).size;

    /* EVERY met: STATE THE LEDGER CAN REACH, walked on the live page. */
    const L = P.makeLedger(null), states = [];
    states.push(L.metState('g'));
    L.meet('g', 1); L.meet('g', 2); states.push(L.metState('g'));
    L.meet('g', 3); L.meet('g', 4); states.push(L.metState('g'));
    L.ask('g', 5); states.push(L.metState('g'));
    L.answer('g', 6, false); states.push(L.metState('g'));
    L.answer('g', 7, true); states.push(L.metState('g'));
    out.metStates = states;
    out.metAllSpeak = states.every(s => (P.REACTIONS['met:' + s] || []).length > 0);
    return out;
  });

  await b.close();

  ok('the people module is LIVE in the frame he walks (not just fresh on disk)', !!r.module);
  ok('and the copy in that frame carries the reactions (' + r.reactions + ' buckets)',
    r.reactions >= 10, 'a stale inline copy is the failure this catches');
  ok('reactionCtx exists on the surface', !!r.ctxFn);
  ok('the block has people to react (' + r.agents + ')', (r.agents | 0) >= 1);

  ok('a stranger with no history reads QUIET — nothing is invented about the player',
    !!r.baselineQuiet, JSON.stringify(r.baseline));

  /* THE USE CHECKS. Each one plants a signal and demands the ctx changed. Cutting
     the wiring makes these go red no matter what strings survive in the file. */
  ok('SEEING IT REACHES THE MOUTH: outdoors in reach -> saw = the deed\'s own clout tag',
    r.sawCtx && r.sawCtx.saw === 'reckless' && !r.sawCtx.heard, JSON.stringify(r.sawCtx));
  ok('HEARING IT IS A DIFFERENT THING: behind a wall -> heard, never saw',
    r.heardCtx && r.heardCtx.heard === 'reckless' && !r.heardCtx.saw, JSON.stringify(r.heardCtx));
  ok('and somebody who was not there learns NOTHING — the read is real, not a constant',
    r.strangerCtx && !r.strangerCtx.saw && !r.strangerCtx.heard, JSON.stringify(r.strangerCtx));

  /* the weights are HIS, loaded from the canon quests' own @DO lines, so this
     first claim is really "his corpus reached the module" */
  ok('his deed weights are loaded (' + r.deedKinds + ' kinds, worst=' + r.worstKind +
    ' best=' + r.bestKind + ')', (r.deedKinds | 0) >= 2 && !!r.worstKind && !!r.bestKind);
  ok('STANDING REACHES THE MOUTH: his heaviest deed against you moves the rung off NEUTRAL',
    r.hostileCtx && r.hostileCtx.rung && r.hostileCtx.rung !== 'NEUTRAL',
    JSON.stringify(r.hostileCtx) + ' value=' + r.worstValue);
  ok('and a deed in your favour reads the OTHER WAY — per-person, not the faction average',
    r.warmCtx && r.warmCtx.rung && r.hostileCtx && r.warmCtx.rung !== r.hostileCtx.rung,
    JSON.stringify(r.warmCtx) + ' value=' + r.bestValue);

  ok('THE LEDGER REACHES THE MOUTH: metState answers on the live surface',
    !!(r.baseline && r.baseline.met), JSON.stringify(r.baseline));
  ok('every met: state the ledger can reach has lines (' + (r.metStates || []).join('>') + ')',
    !!r.metAllSpeak);
  ok('and there are six of them — a state nothing produces is a dead bucket',
    new Set(r.metStates || []).size === 6);

  ok('FOUR LEVELS OF CONTEXT, FOUR DIFFERENT THINGS SAID (' + r.distinct + '/5 distinct)',
    r.distinct === 5, JSON.stringify(r.said));

  ok('the surface booted clean', errs.length === 0, errs.slice(0, 3).join(' | '));

  console.log('REACTION REACH GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
    (r.reactions || 0) + ' buckets live in the walked frame, ' +
    (r.agents || 0) + ' people on the block)');
  process.exit(fail ? 1 : 0);
})();
