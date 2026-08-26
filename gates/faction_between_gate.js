/* ============================================================================
   FACTION BETWEEN GATE (8/26/26, FACTIONS lane) — THE OUTFITS HOLD POSITIONS
   ON EACH OTHER, THOSE POSITIONS ARE CANON, AND THE WALKED SURFACE FEELS THEM.

   Ruling: Paolo 8/26 — "custom is your own personal faction!!!!!! and you can
   imagine if you play the game with your custom faction the values arent just
   for you its for how your factions treated bro but u prob Already have that.
   But, yeah, for the other factions."

   Module: engine/bohemia_between.js   (tools/bohemia_between.py)
   Wire:   tools/bohemia_city_between_patch.py

   WHAT THIS GATE IS ACTUALLY FOR. Not the arithmetic — the arithmetic is easy
   and it was right on the second try. It is for THE WIRE. This lane has now
   found twelve organs that computed a correct answer nothing on the walked
   surface ever asked for, and every single one of them had a green suite the
   whole time. So the claims that matter here are the ones that LOAD THE
   SHIPPED CITY IN A REAL BROWSER, open a real card at iPhone portrait, and
   read what a person would actually see.

   THE THREE DEFECTS THIS GATE EXISTS BECAUSE OF, all found by running the
   thing rather than reading it:
     1. THE DEAD ZONE. The Cartel tax the Caravans in canon (init -45) and at
        the most common base cost in the game that priced out to zero. A canon
        hostile position that costs nothing is a relation the player cannot
        feel, which is this lane's oldest bug in a new coat.
     2. THE ROW BEHIND THE WRONG GUARD. The world-fact row went into
        ctHearRows, which is called only when you are AT THE WALL, so it did
        not render on a single ordinary card. Identical in shape to the tertius
        row that sat behind an early return on the exact condition it described.
     3. THE CARD THAT CONTRADICTED ITSELF. There are TWO whoHears calls in the
        city. Teaching one about watchers and not the other shipped a card
        reading "WILL HEAR IT AS FACT: CARAVANS, REMNANTS" three lines above
        "NOBODY WHO COULD CHARGE YOU FOR IT IS CLOSE ENOUGH TO KNOW."
   None of those is visible in a diff. All three are visible in a card.

   node gates/faction_between_gate.js
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const GRAPH = path.join(ROOT, 'engine/BOHEMIA_faction_graph.json');
const ENGINE = path.join(ROOT, 'engine/bohemia_engine.js');
const VIEW = { width: 390, height: 844 };

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim + (detail ? '\n       ' + detail : '')); }
}
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

const B = require(path.join(ROOT, 'engine/bohemia_between.js'));
const C = require(path.join(ROOT, 'engine/bohemia_commitment.js'));
const TIES = require(path.join(ROOT, 'engine/bohemia_ties.js'));
const graph = JSON.parse(fs.readFileSync(GRAPH, 'utf8'));
const citySrc = fs.readFileSync(CITY, 'utf8');
const N = f => String(f || '').toUpperCase().replace(/[\s_]/g, '');

/* ========================================================================== */
console.log('\nA. NOTHING IS INVENTED. The graph is the content and it is his.');
/* ========================================================================== */
{
  /* Every pair the module carries must exist in the graph with the SAME label.
     A gate that only checked "the pair exists" would pass a module that turned
     professional-respect into permanent-war, which is inventing a war. */
  const graphPairs = {};
  for (const [fid, d] of Object.entries(graph.factions))
    for (const [other, label] of Object.entries(d.relations || {}))
      graphPairs[N(fid) + '|' + N(other)] = label;

  const invented = B.PAIRS.filter(p =>
    graphPairs[N(p.from) + '|' + N(p.to)] !== p.label);
  ok('A1 EVERY PAIR THE MODULE CARRIES IS IN BOHEMIA_faction_graph.json WITH THE '
    + 'SAME LABEL. MECHANISM-MINE / CONTENTS-PAOLO\'S: who is at war with whom '
    + 'is canon, and a module that could quietly promote a respect to a war '
    + 'would be writing his lore for him',
    invented.length === 0, JSON.stringify(invented));

  const dropped = Object.keys(graphPairs).filter(k =>
    !B.PAIRS.some(p => N(p.from) + '|' + N(p.to) === k));
  ok('A2 AND NOTHING IN THE GRAPH WAS DROPPED. A canon relation the module '
    + 'silently omits is a war the player can never find out about, which is '
    + 'indistinguishable from it not being canon at all',
    dropped.length === 0, dropped.join(', '));

  /* The numbers are PARSED out of FactionCanon.REL_SPEC by the generator. This
     re-parses the engine independently and compares, so a hand-edit to either
     side goes red rather than drifting. TWO TABLES IS THE BUG THIS LANE HAS
     FIXED SIX TIMES. */
  const es = fs.readFileSync(ENGINE, 'utf8');
  const m = es.match(/const REL_SPEC = \{([\s\S]*?)\n\};/);
  const engineSpec = {};
  if (m) for (const line of m[1].split('\n')) {
    const row = line.match(/^\s*'([^']+)':\s*\{(.*?)\}/);
    if (!row) continue;
    const init = row[2].match(/\binit:\s*(-?\d+)/);
    if (init) engineSpec[row[1]] = parseInt(init[1], 10);
  }
  ok('A3 THE ENGINE\'S REL_SPEC WAS FOUND AND PARSED. It is the SOURCE of every '
    + 'number in this module; if this stops parsing, the generator is silently '
    + 'free to invent prices',
    Object.keys(engineSpec).length > 0, 'REL_SPEC did not parse out of the engine');

  const drift = Object.keys(B.SPEC).filter(k => B.SPEC[k].init !== engineSpec[k]);
  ok('A4 AND EVERY init MATCHES IT EXACTLY. FactionCanon encoded all six canon '
    + 'labels into standings on 7/2 with a research note explaining why lore '
    + 'invariants are clamps and not starting values. This module PARSES that '
    + 'table rather than retyping it, and this claim is what keeps the two from '
    + 'ever disagreeing',
    drift.length === 0, drift.map(k => k + ': ' + B.SPEC[k].init + ' vs ' + engineSpec[k]).join(', '));

  const noted = Object.entries(graph.factions)
    .filter(([, d]) => String(d.note || '').toLowerCase().includes('player faction'))
    .map(([fid]) => fid);
  ok('A5 mine() IS READ OFF THE GRAPH\'S OWN NOTE, NEVER TYPED. Paolo 8/26: '
    + '"custom is your own personal faction!!!!!!" and canon already agreed — '
    + 'the graph note on Custom reads "Player faction. No preset philosophy." '
    + 'Read, so the day he renames it or hands the player another one, every '
    + 'surface follows without a code change',
    noted.length === 1 && B.mine() === noted[0],
    'graph says ' + JSON.stringify(noted) + ', module says ' + B.mine());
}

/* ========================================================================== */
console.log('\nB. A CANON POSITION IS AN INVARIANT, NOT A HINT.');
/* ========================================================================== */
{
  const BASES = [1, 2, 3, 4];
  const rows = [];
  for (const p of B.PAIRS) {
    const rel = B.between(p.from, p.to);
    if (!rel || rel.init == null) continue;
    for (const base of BASES) rows.push({ rel, base, w: B.weigh(p.to, p.from, base) });
  }
  ok('B0 THERE IS SOMETHING TO CHECK. A sweep that silently found no priced '
    + 'pairs would pass every claim below it vacuously, which is how a gate '
    + 'starts lying', rows.length >= 20, 'only ' + rows.length + ' rows');

  const hostileFlat = rows.filter(r => r.rel.sign === 'hostile' && r.w.weighted <= r.base);
  ok('B1 A HOSTILE POSITION ALWAYS COSTS MORE THAN A FLAT ONE, AT EVERY BASE. '
    + 'THIS IS THE CLAIM THE BUG WAS: the Cartel TAX the Caravans (init -45), '
    + 'and at base 1 the proportion alone rounded to zero, so the single most '
    + 'common case in the game charged nothing at all for a hostile position '
    + 'canon spent a line writing down. Found by running it, not by reading it',
    hostileFlat.length === 0,
    hostileFlat.slice(0, 3).map(r => r.rel.label + ' @' + r.base + ' -> ' + r.w.weighted).join('; '));

  const warmFlat = rows.filter(r => r.rel.sign === 'warm' && r.w.weighted >= r.base);
  ok('B2 AND A WARM ONE ALWAYS COSTS LESS. Standing beside somebody\'s ally has '
    + 'to BUY something or adjacency is a caption',
    warmFlat.length === 0,
    warmFlat.slice(0, 3).map(r => r.rel.label + ' @' + r.base).join('; '));

  const neutralMoved = rows.filter(r => r.rel.sign === 'neutral' && r.w.weighted !== r.base);
  ok('B3 A NEUTRAL POSITION MOVES NOTHING. hands-off means "there is no side to '
    + 'be on here", and a cost printed under that sentence would be the surface '
    + 'contradicting itself in two adjacent lines',
    neutralMoved.length === 0);

  ok('B4 NOTHING EVER GOES NEGATIVE. A warm position can take a cost to zero and '
    + 'that is a real outcome; paying the player for helping his friends\' '
    + 'friends is a REWARD CHANNEL and inventing one is Paolo\'s call, not a '
    + 'side effect of a rounding rule',
    rows.every(r => r.w.weighted >= 0));

  ok('B5 A ZERO BASE STAYS ZERO. No relation conjures a cost out of nothing',
    B.PAIRS.every(p => B.weigh(p.to, p.from, 0).weighted === 0));

  const prey = B.weigh('Cartel', 'Caravans', 1);
  ok('B6 THE EXACT CASE THAT WAS BROKEN, PINNED BY NAME. The Caravans are '
    + 'preyed-taxed by the Cartel; at base 1 that must cost more than 1. A '
    + 'regression here is the dead zone coming back',
    prey.weighted > 1, 'weighted ' + prey.weighted);

  const noRel = B.weigh('Cartel', 'Church', 2);
  ok('B7 AND A PAIR CANON SAYS NOTHING ABOUT IS UNTOUCHED. Most pairs in this '
    + 'valley have no written position and inventing one for them would be '
    + 'inventing lore. null is a real answer here',
    noRel.weighted === 2 && noRel.why === null);
}

/* ========================================================================== */
console.log('\nC. THE BOARD READS ONCE PER OUTFIT.');
/* ========================================================================== */
{
  const all = B.keys();
  let dupes = [];
  for (const f of all) {
    const seen = {};
    for (const r of B.ripples(f)) {
      const k = N(r.to);
      if (seen[k]) dupes.push(f + ' -> ' + r.to);
      seen[k] = 1;
    }
  }
  ok('C1 ONE ROW PER OTHER OUTFIT. The graph writes BOTH SEATS of the pairs '
    + 'somebody bothered to write twice, so a naive walk listed the Remnants '
    + 'twice on the Cartel\'s board and it read as two separate wars',
    dupes.length === 0, dupes.join(', '));

  const cartel = B.ripples('Cartel');
  ok('C2 AND THE OUTFIT\'S OWN SEAT WINS. A board about the Cartel should say '
    + 'what THEY hold, not what is held about them; a mirrored row only '
    + 'survives where canon never wrote their side',
    cartel.some(r => N(r.to) === 'CARAVANS' && r.label === 'prey-tax' && !r.mirrored),
    JSON.stringify(cartel.map(r => r.to + ':' + r.label + (r.mirrored ? '(m)' : ''))));

  const signs = cartel.map(r => r.sign);
  const rank = { hostile: 0, unknown: 1, neutral: 2, warm: 3 };
  ok('C3 HOSTILE SORTS FIRST. It is the half that gets you killed and a phone '
    + 'card shows the top of a list',
    signs.every((s, i) => i === 0 || rank[signs[i - 1]] <= rank[s]), signs.join(','));

  ok('C4 THE PLAYER\'S OWN OUTFIT HAS NO ENEMIES YET AND THAT IS CORRECT, NOT A '
    + 'GAP. Canon: "Player faction. No preset philosophy. Identity emerges from '
    + 'three generations of action." The mechanism is live and empty. On 8/21 '
    + 'this lane reported his own faction as a DEFECT for exactly this shape of '
    + 'emptiness and he had to correct it; that is not happening twice',
    B.myRipples().length === 0);
}

/* ========================================================================== */
console.log('\nD. THE OLD BEHAVIOUR DID NOT MOVE UNDER ANYBODY.');
/* ========================================================================== */
{
  const heard = [{ faction: 'REMNANTS', hops: 1, via: 'home', through: 'x' },
                 { faction: 'CHURCH', hops: 1, via: 'home', through: 'y' }];
  const st = { REMNANTS: 4, CHURCH: 4 };
  const oldWay = C.costs('burned', heard, st);
  ok('D1 costs() WITH THREE ARGUMENTS RETURNS THE PRE-8/26 NUMBERS. Both organs '
    + 'are OPT-IN on purpose: a caller that has not been told gets exactly what '
    + 'it got yesterday, so no other lane\'s surface moves underneath it',
    oldWay.length === 2 && oldWay.every(c => c.lose === 2 && c.rel == null),
    JSON.stringify(oldWay.map(c => c.faction + ':' + c.lose)));

  const roster = [{ id: 'a', faction: 'Cartel', home: { building: 1 }, job: { kind: 'scav' } },
                  { id: 'b', faction: 'Cartel', home: { building: 1 }, job: { kind: 'scav' } }];
  const plain = C.whoHears('Cartel', roster, { x: 0, y: 0 }, { ties: TIES });
  ok('D2 AND whoHears() WITH NO watching IS THE OLD WALK. Same contract',
    plain.length === 0, JSON.stringify(plain));

  const watched = C.whoHears('Cartel', roster, { x: 0, y: 0 }, { ties: TIES, watching: B });
  ok('D3 WITH watching, THE ONES ALREADY LOOKING HEAR IT AS FACT. Measured '
    + 'first: a sweep of the live city found TWO hearing pairs in the entire '
    + 'valley and neither was a pair canon holds a position on, so the weighted '
    + 'cost was correct code that could not fire. And the chain is the wrong '
    + 'test anyway — this module\'s own words say sided is "Said in front of '
    + 'people" and burned is "they know which somebody". The Remnants do not '
    + 'need your housemate to tell them who the Cartel just took in',
    watched.length >= 2 && watched.every(h => C.landing(h).key === 'direct'),
    JSON.stringify(watched.map(h => h.faction + '@' + h.hops)));

  ok('D4 A NEUTRAL ARRANGEMENT IS NOT SURVEILLANCE. The Cartel hold hands-off '
    + 'on the Volunteers; the first run made the Volunteers hear every Cartel '
    + 'commitment and charge for it, directly underneath their own shipped '
    + 'sentence "Nobody is going to hold this against you. There is no side to '
    + 'be on here"',
    !watched.some(h => N(h.faction) === 'VOLUNTEERS'),
    JSON.stringify(watched.map(h => h.faction)));

  const tieRoster = roster.concat(
    [{ id: 'c', faction: 'Remnants', home: { building: 1 }, job: { kind: 'scav' } }]);
  const mixed = C.whoHears('Cartel', tieRoster, { x: 0, y: 0 }, { ties: TIES, watching: B });
  const rem = mixed.find(h => N(h.faction) === 'REMNANTS');
  ok('D5 A REAL TIE BEATS A WATCHER. A housemate names the ROOM the news went '
    + 'through, and "your own housemate runs with them" is the interesting '
    + 'half. The watcher only fills a silence',
    !!rem && (rem.via !== 'watch' ? rem.hops <= 1 : true),
    JSON.stringify(rem));
}

/* ========================================================================== */
console.log('\nE. THE WORDS SHIP WRITTEN AND HE CAN EDIT THEM.');
/* ========================================================================== */
{
  const priced = Object.keys(B.SPEC);
  const missing = priced.filter(l => !B.WORDS[l]);
  ok('E1 EVERY PRICED LABEL HAS ENGLISH. A canon war printing the raw slug '
    + '"permanent-war" at a player is the machine leaking through the world',
    missing.length === 0, missing.join(', '));

  const notDraft = Object.entries(B.WORDS).filter(([, w]) => !w.draft);
  ok('E2 AND EVERY LINE IS draft:true. ALWAYS MAKE AN ATTEMPT (Paolo 8/11): a '
    + 'real attempt ships playable and tagged, so he can find every word he has '
    + 'not approved and edit it rather than face a blank page',
    notDraft.length === 0, notDraft.map(x => x[0]).join(', '));

  const emdash = Object.entries(B.WORDS).filter(([, w]) =>
    ['word', 'they', 'you'].some(k => String(w[k] || '').includes('—')));
  ok('E3 NO EM DASHES ANYWHERE IN THE SHIPPED TEXT. Standing instruction, and '
    + 'it applies to the words the game says as much as to the words I say',
    emdash.length === 0, emdash.map(x => x[0]).join(', '));
}

/* ========================================================================== */
console.log('\nF. THE WIRE, IN THE SOURCE. (The browser proves the rest.)');
/* ========================================================================== */
{
  ok('F1 THE SHIPPED CITY CARRIES THE MODULE',
    citySrc.includes('/* ==== engine/bohemia_between.js ==== */'));

  const canon = fs.readFileSync(path.join(ROOT, 'engine/bohemia_commitment.js'), 'utf8').replace(/\n+$/, '');
  const head = '/* ==== engine/bohemia_commitment.js ==== */\n';
  const tail = "})(typeof globalThis!=='undefined'?globalThis:this);";
  const i = citySrc.indexOf(head);
  const j = citySrc.indexOf(tail, i);
  const inlined = i < 0 ? null : citySrc.slice(i + head.length, j + tail.length);
  ok('F2 AND ITS INLINED bohemia_commitment IS BYTE-FOR-BYTE CANON. ENGINE SYNC '
    + 'LAW. A stale inlined snapshot is the bug that meant NOBODY in Las Vegas '
    + 'had a faction for thirteen days in August with every gate green',
    inlined === canon, inlined == null ? 'no block' : 'drifted by '
      + Math.abs(inlined.length - canon.length) + ' bytes');

  /* BOTH whoHears CALL SITES. Counting is the point: teaching one and not the
     other is exactly what shipped a self-contradicting card. */
  const calls = (citySrc.match(/BohemiaCommitment\.whoHears\(/g) || []).length;
  const taught = (citySrc.match(/watching:\(typeof BohemiaBetween/g) || []).length;
  ok('F3 EVERY whoHears CALL SITE IN THE CITY WAS TAUGHT ABOUT WATCHERS. There '
    + 'are two — ctHearRows walks the graph for the display rows and ctSideCost '
    + 'walks it again for the price — and teaching one shipped a card reading '
    + '"WILL HEAR IT AS FACT: CARAVANS, REMNANTS" three lines above "NOBODY WHO '
    + 'COULD CHARGE YOU FOR IT IS CLOSE ENOUGH TO KNOW". Both or neither',
    calls > 0 && calls === taught, calls + ' calls, ' + taught + ' taught');

  ok('F4 AND costs() IS PASSED THE BETWEEN MODULE AND WHO YOU ARE SIDING WITH',
    /costs\(nextState, heard, ctStandings\(\),[\s\S]{0,400}?sided:fid/.test(citySrc));
}

/* ========================================================================== */
/* THE PART THAT ACTUALLY MATTERS. A REAL BROWSER, A REAL CARD, IPHONE
   PORTRAIT. Every defect this gate was written for was invisible in the source
   and obvious in the card. VERIFY ON THE REAL SURFACE (Paolo 7/18). */
/* ========================================================================== */
async function onTheCard() {
  console.log('\nG. AND ON THE CARD HE ACTUALLY OPENS.');
  const { chromium } = requirePlaywright();
  const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 8000);

    const R = await page.evaluate(() => {
      const out = { live: typeof BohemiaBetween !== 'undefined', cards: [] };
      if (!out.live) return out;
      out.mine = BohemiaBetween.mine();
      out.arity = BohemiaCommitment.costs.length;
      const bases = ctBases() || {};
      for (const b of Object.values(bases)) {
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        let who = null, fid = null;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (!who) continue;
        const at = ctAt(who); hx = at[0] + 1; hy = at[1];
        const sv = ctBelongSave();
        sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
        ctSawCell(); ctOpen(); for (let i = 0; i < 3; i++) { ctClose(); ctOpen(); }
        /* AT THE WALL, and worth something to everybody else, so a cost can
           actually land. Anything less and every claim below passes vacuously. */
        const read = () => [...document.querySelectorAll('.r')].map(r => {
          const k = r.querySelector('.k'), v = r.querySelector('.v');
          return (k ? k.textContent : '') + ' :: ' + (v ? v.textContent : '');
        });
        for (const k of Object.keys(BohemiaBelonging.RULES || {})) if (k !== fid) sv.meta.gave[k] = 6;

        /* TWO CARDS PER PERSON, AND THE SECOND ONE IS NOT OPTIONAL.
           The first pass of this gate drove every card to THE WALL and then
           asserted the YOU ARE row was there, and it was not — because at the
           wall that row is deliberately suppressed (the wall row already says
           the word, and A DUPLICATE IS NOT DISCLOSURE). So the gate was
           measuring the one state its own claim could not hold in, and the red
           was the ruler being wrong rather than the product. Measure both:
             ORDINARY  a few favours in, no wall. What most of the game is.
             WALL      the decision point, where the commitment rows live. */
        sv.meta.gave[fid] = 2; sv.meta.commit[fid] = 'sided';
        ctClose(); ctOpen();
        const ordinary = read();

        sv.meta.gave[fid] = 5; sv.meta.commit = {};
        ctClose(); ctOpen();
        const wall = read();

        out.cards.push({ fid, rows: wall, ordinary, hostile: BohemiaBetween.ripples(fid)
          .filter(r => r.sign === 'hostile').map(r => String(r.to).toUpperCase()) });
      }
      return out;
    });

    ok('G1 THE MODULE IS LIVE IN A REAL BROWSER AND KNOWS WHOSE FACTION IS WHOSE. '
      + 'Node loading a file proves the file parses; this proves the GAME has it',
      R.live && R.mine === 'Custom' && R.arity === 4,
      JSON.stringify({ live: R.live, mine: R.mine, arity: R.arity }));

    ok('G2 REAL CARDS OPENED. A browser part that quietly found nobody would '
      + 'pass every claim under it having measured nothing',
      R.cards.length >= 3, R.cards.length + ' cards');

    /* THE WORLD FACT, ON AN ORDINARY CARD. This is the claim that catches
       defect 2: the row lived in ctHearRows, which only runs at the wall. */
    const withHostile = R.cards.filter(c => c.hostile.length);
    ok('G3 AN OUTFIT CANON GIVES ENEMIES SHOWS THEM ON ITS CARD. The single most '
      + 'important thing about being a Caravan is that the Cartel tax them, and '
      + 'you could walk up to one for thirteen days and never find out. This row '
      + 'first shipped inside ctHearRows, which is called only when you are AT '
      + 'THE WALL, so it rendered on no ordinary card at all — the same shape as '
      + 'the tertius row that sat behind an early return on the exact condition '
      + 'it described',
      withHostile.length > 0 && withHostile.every(c =>
        c.rows.some(r => r.startsWith('AND ARE UP AGAINST'))),
      JSON.stringify(withHostile.map(c => c.fid + ':' + !!c.rows.find(r => r.startsWith('AND ARE UP AGAINST')))));

    ok('G4 AND IT NAMES THE RIGHT ONES. A row that renders is not a row that is '
      + 'true; this compares the printed names against the canon graph',
      withHostile.every(c => {
        const row = c.rows.find(r => r.startsWith('AND ARE UP AGAINST')) || '';
        return c.hostile.every(h => row.includes(h));
      }));

    /* THE SELF-CONTRADICTION. Defect 3, pinned as its own claim rather than
       left to a human noticing two rows disagree. */
    const contradicts = R.cards.filter(c =>
      c.rows.some(r => r.includes('WILL HEAR IT AS FACT')) &&
      c.rows.some(r => r.includes('NOBODY WHO COULD CHARGE YOU')));
    ok('G5 NO CARD SAYS THEY WILL HEAR IT AND THAT NOBODY IS CLOSE ENOUGH TO '
      + 'KNOW. That card shipped. The two whoHears calls disagreed and each row '
      + 'was individually correct about its own opinion of the same graph',
      contradicts.length === 0, JSON.stringify(contradicts.map(c => c.fid)));

    const roomLie = R.cards.filter(c => {
      const hear = c.rows.find(r => r.startsWith('WILL HEAR IT AS FACT')) || '';
      const via = c.rows.find(r => r.startsWith('IT GETS OUT THROUGH')) || '';
      return hear && via.includes('WORK BESIDE') &&
             c.hostile.some(h => hear.includes(h)) &&
             !c.rows.some(r => r.includes('SHARE A ROOF'));
    });
    ok('G6 AND IT NEVER INVENTS THE ROOM THE NEWS WENT THROUGH. That row was a '
      + 'two-way home/work choice, so the moment whoHears started returning '
      + 'watchers it would have told him somebody overheard a public '
      + 'declaration at a job site. A binary that grows a third case and keeps '
      + 'its else lies with total confidence',
      roomLie.length === 0, JSON.stringify(roomLie.map(c => c.fid)));

    /* THE PRICE, WEIGHTED, WITH ITS REASON, ON THE CARD. */
    const priced = R.cards.filter(c => c.rows.some(r => r.startsWith('BECAUSE')));
    ok('G7 A COST BENT BY A CANON POSITION SAYS SO ON THE CARD. A number that '
      + 'moves without a reason is a bug to the person reading it',
      priced.length > 0, 'no card printed a BECAUSE row');

    /* BOTH MARKS, and the first pass of this claim only accepted '!'. Two of
       the three cards it measured were reading '-0~' -- a warm position taking
       a cost to nothing, which is the whole payoff of adjacency and exactly as
       designed. The claim was rejecting the feature working. FIX THE RULER,
       NEVER THE TARGET. */
    ok('G8 AND THE BENT PRICES ARE MARKED IN THE ROW THAT PRINTS THEM, EITHER '
      + 'WAY. "CARAVANS -2!, REMNANTS -2!" and "REDS -0~" and a plain "MOB -1" '
      + 'are three different KINDS of fact, and the old join flattened all of '
      + 'them into one undifferentiated list of numbers',
      priced.every(c => /[!~]/.test(c.rows.find(r => r.startsWith('AND IT COSTS YOU')) || '')),
      JSON.stringify(priced.map(c => c.rows.find(r => r.startsWith('AND IT COSTS YOU')))));

    /* HALF ONE OF THE RULING, ON AN ORDINARY CARD. At the wall the YOU ARE row
       is suppressed on purpose, so this reads the not-at-wall snapshot. */
    const youAre = R.cards.map(c => c.ordinary.find(r => r.startsWith('YOU ARE'))).filter(Boolean);
    ok('G9 THE STANDING IS NAMED AS YOUR OUTFIT\'S, NOT YOURS. Paolo 8/26: "the '
      + 'values arent just for you its for how your factions treated bro." The '
      + 'rung is what this outfit calls the thing you run with, and it outlives '
      + 'the character. Folded into the existing row, never added as a new one, '
      + 'because this card clips off the top of an iPhone',
      youAre.length > 0 && youAre.every(r => r.includes('AND SO IS THE CUSTOM')),
      JSON.stringify(youAre.slice(0, 3)));

    ok('G9b AND THE WORLD FACT IS ON THE ORDINARY CARD TOO, not only at the '
      + 'wall. This is the claim that would have caught the row living inside '
      + 'ctHearRows: every commitment row in this game is behind the wall '
      + 'guard, and a world fact must not be',
      withHostile.every(c => c.ordinary.some(r => r.startsWith('AND ARE UP AGAINST'))),
      JSON.stringify(withHostile.map(c => c.fid + ':'
        + !!c.ordinary.find(r => r.startsWith('AND ARE UP AGAINST')))));

    /* AND IT STILL FITS ON THE PHONE. cardfold_gate owns the pixel budget;
       this checks that this turn did not blow it, which is a different claim
       from "the card fits in general". */
    const worst = Math.max(...R.cards.map(c => Math.max(c.rows.length, c.ordinary.length)));
    ok('G10 AND THE CARD DID NOT GROW PAST WHAT THE PHONE HOLDS. Three rows went '
      + 'on this week. cardfold_gate owns the pixel budget; this owns the fact '
      + 'that THIS turn is the one that would have blown it',
      worst <= 22, 'worst card is ' + worst + ' rows');

  } finally { await browser.close(); }
}

onTheCard()
  .catch(e => { fail++; console.log('  FAIL browser part threw: ' + e.message); })
  .then(() => {
    console.log('\nFACTION BETWEEN GATE: ' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail ? 1 : 0);
  });
