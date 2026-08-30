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

/* NAMED, NOT ALIASED. This was `const B` and every call in this file read
   BohemiaBetween.weigh(...) / BohemiaBetween.keys(...). tools/bohemia_organ_reach.js looks for the
   module's real global to decide whether an organ has a caller, and a
   one-letter alias hides that -- keys() read as NOTHING ANYWHERE while
   this very file was calling it. Writing the real name does not change
   what is true, it makes what is true visible to the check. */
const BohemiaBetween = require(path.join(ROOT, 'engine/bohemia_between.js'));
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

  const invented = BohemiaBetween.PAIRS.filter(p =>
    graphPairs[N(p.from) + '|' + N(p.to)] !== p.label);
  ok('A1 EVERY PAIR THE MODULE CARRIES IS IN BOHEMIA_faction_graph.json WITH THE '
    + 'SAME LABEL. MECHANISM-MINE / CONTENTS-PAOLO\'S: who is at war with whom '
    + 'is canon, and a module that could quietly promote a respect to a war '
    + 'would be writing his lore for him',
    invented.length === 0, JSON.stringify(invented));

  const dropped = Object.keys(graphPairs).filter(k =>
    !BohemiaBetween.PAIRS.some(p => N(p.from) + '|' + N(p.to) === k));
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

  const drift = Object.keys(BohemiaBetween.SPEC).filter(k => BohemiaBetween.SPEC[k].init !== engineSpec[k]);
  ok('A4 AND EVERY init MATCHES IT EXACTLY. FactionCanon encoded all six canon '
    + 'labels into standings on 7/2 with a research note explaining why lore '
    + 'invariants are clamps and not starting values. This module PARSES that '
    + 'table rather than retyping it, and this claim is what keeps the two from '
    + 'ever disagreeing',
    drift.length === 0, drift.map(k => k + ': ' + BohemiaBetween.SPEC[k].init + ' vs ' + engineSpec[k]).join(', '));

  const noted = Object.entries(graph.factions)
    .filter(([, d]) => String(d.note || '').toLowerCase().includes('player faction'))
    .map(([fid]) => fid);
  ok('A5 mine() IS READ OFF THE GRAPH\'S OWN NOTE, NEVER TYPED. Paolo 8/26: '
    + '"custom is your own personal faction!!!!!!" and canon already agreed — '
    + 'the graph note on Custom reads "Player faction. No preset philosophy." '
    + 'Read, so the day he renames it or hands the player another one, every '
    + 'surface follows without a code change',
    noted.length === 1 && BohemiaBetween.mine() === noted[0],
    'graph says ' + JSON.stringify(noted) + ', module says ' + BohemiaBetween.mine());
}

/* ========================================================================== */
console.log('\nB. A CANON POSITION IS AN INVARIANT, NOT A HINT.');
/* ========================================================================== */
{
  const BASES = [1, 2, 3, 4];
  const rows = [];
  for (const p of BohemiaBetween.PAIRS) {
    const rel = BohemiaBetween.between(p.from, p.to);
    if (!rel || rel.init == null) continue;
    for (const base of BASES) rows.push({ rel, base, w: BohemiaBetween.weigh(p.to, p.from, base) });
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
    BohemiaBetween.PAIRS.every(p => BohemiaBetween.weigh(p.to, p.from, 0).weighted === 0));

  const prey = BohemiaBetween.weigh('Cartel', 'Caravans', 1);
  ok('B6 THE EXACT CASE THAT WAS BROKEN, PINNED BY NAME. The Caravans are '
    + 'preyed-taxed by the Cartel; at base 1 that must cost more than 1. A '
    + 'regression here is the dead zone coming back',
    prey.weighted > 1, 'weighted ' + prey.weighted);

  const noRel = BohemiaBetween.weigh('Cartel', 'Church', 2);
  ok('B7 AND A PAIR CANON SAYS NOTHING ABOUT IS UNTOUCHED. Most pairs in this '
    + 'valley have no written position and inventing one for them would be '
    + 'inventing lore. null is a real answer here',
    noRel.weighted === 2 && noRel.why === null);
}

/* ========================================================================== */
console.log('\nC. THE BOARD READS ONCE PER OUTFIT.');
/* ========================================================================== */
{
  const all = BohemiaBetween.keys();
  let dupes = [];
  for (const f of all) {
    const seen = {};
    for (const r of BohemiaBetween.ripples(f)) {
      const k = N(r.to);
      if (seen[k]) dupes.push(f + ' -> ' + r.to);
      seen[k] = 1;
    }
  }
  ok('C1 ONE ROW PER OTHER OUTFIT. The graph writes BOTH SEATS of the pairs '
    + 'somebody bothered to write twice, so a naive walk listed the Remnants '
    + 'twice on the Cartel\'s board and it read as two separate wars',
    dupes.length === 0, dupes.join(', '));

  const cartel = BohemiaBetween.ripples('Cartel');
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
    BohemiaBetween.myRipples().length === 0);
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

  const watched = C.whoHears('Cartel', roster, { x: 0, y: 0 }, { ties: TIES, watching: BohemiaBetween });
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
  const mixed = C.whoHears('Cartel', tieRoster, { x: 0, y: 0 }, { ties: TIES, watching: BohemiaBetween });
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
  const priced = Object.keys(BohemiaBetween.SPEC);
  const missing = priced.filter(l => !BohemiaBetween.WORDS[l]);
  ok('E1 EVERY PRICED LABEL HAS ENGLISH. A canon war printing the raw slug '
    + '"permanent-war" at a player is the machine leaking through the world',
    missing.length === 0, missing.join(', '));

  const notDraft = Object.entries(BohemiaBetween.WORDS).filter(([, w]) => !w.draft);
  ok('E2 AND EVERY LINE IS draft:true. ALWAYS MAKE AN ATTEMPT (Paolo 8/11): a '
    + 'real attempt ships playable and tagged, so he can find every word he has '
    + 'not approved and edit it rather than face a blank page',
    notDraft.length === 0, notDraft.map(x => x[0]).join(', '));

  const emdash = Object.entries(BohemiaBetween.WORDS).filter(([, w]) =>
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
console.log('\nH. WHAT YOUR OWN OUTFIT EARNS, AND THE ONE RULE THAT DECIDES IT.');
/* ========================================================================== */
{
  const MINE = BohemiaBetween.mine();
  const sv = () => ({ meta: {} });

  const a = sv();
  const made = BohemiaBetween.earn(a, 'Cartel', 'sided', 1);
  const hostileOfCartel = BohemiaBetween.ripples('Cartel')
    .filter(r => r.sign === 'hostile').map(r => N(r.to));
  ok('H1 SIDING WITH AN OUTFIT MAKES ITS ENEMIES YOUR OUTFIT\'S ENEMIES. DAVIS '
    + '1967, WEAK STRUCTURAL BALANCE: the triad you just made is you(+)them, '
    + 'them(-)their enemies, you(?)their enemies, and a POSITIVE third edge is '
    + 'the ONE shape weak balance forbids. So it resolves negative. The enemy '
    + 'of my friend is my enemy, derived rather than picked',
    made.length === hostileOfCartel.length
      && made.every(m => m.sign === 'hostile' && hostileOfCartel.indexOf(N(m.to)) >= 0),
    JSON.stringify(made.map(m => m.sign + ' ' + m.to)) + ' vs canon ' + JSON.stringify(hostileOfCartel));

  /* TESTED ON AN OUTFIT THAT ACTUALLY HAS A FRIEND TO GIVE, and the first
     version was not. It asserted "no warm edge" while siding with the CARTEL,
     whose canon positions are two hostile and one hands-off -- there is no
     warm relation anywhere near them, so the claim passed no matter what the
     rule did. Proven by mutation: deleting the burned requirement entirely
     left this green. A claim that cannot fail is not a claim.
     The Remnants hold a professional respect with the Mob, so they can answer
     both halves, and both halves are asserted on THE SAME OUTFIT -- sided
     gives nothing, burned gives the Mob. */
  const warmSource = BohemiaBetween.keys().filter(f =>
    BohemiaBetween.ripples(f).some(r => r.sign === 'warm'))[0];
  ok('H2a THERE IS AN OUTFIT WITH A FRIEND TO GIVE, so the two claims below '
    + 'are answerable at all', !!warmSource, 'no outfit has a warm canon position');
  const wSided  = BohemiaBetween.earn(sv(), warmSource, 'sided', 1);
  const wBurned = BohemiaBetween.earn(sv(), warmSource, 'burned', 1);
  ok('H2 AND A MERE SIDING BUYS YOU NO FRIENDS. Being hated by your friend\'s '
    + 'enemies is free; being liked by your friend\'s friends is not. Negative '
    + 'ties are sparser, more consequential and more reliably transmitted than '
    + 'positive ones, so a warm edge costs BURNED -- you have to have actually '
    + 'paid something. The cheap half of this system only ever makes enemies',
    made.every(m => m.sign !== 'warm')
      && wSided.every(m => m.sign !== 'warm')
      && wBurned.some(m => m.sign === 'warm'),
    JSON.stringify({ outfit: warmSource,
                     sided: wSided.map(m => m.sign + ' ' + m.to),
                     burned: wBurned.map(m => m.sign + ' ' + m.to) }));

  const b = sv();
  const burned = BohemiaBetween.earn(b, 'Remnants', 'burned', 1);
  ok('H3 BURNING A BRIDGE DOES BUY THEM. The Remnants hold a professional '
    + 'respect with the Mob in canon, so an outfit that cost itself something '
    + 'for the Remnants is regarded differently by the Mob',
    burned.some(m => m.sign === 'warm'),
    JSON.stringify(burned.map(m => m.sign + ' ' + m.to)));

  /* THE REFUSAL, AND IT IS THE REASON WEAK BALANCE IS THE RIGHT THEORY. */
  const allEarned = [];
  for (const f of BohemiaBetween.keys()) {
    for (const st of ['sided', 'burned']) {
      const s2 = sv();
      BohemiaBetween.earn(s2, f, st, 1);
      for (const e of BohemiaBetween.allEarned(s2)) allEarned.push({ from: f, st, e });
    }
  }
  ok('H0 THE SWEEP EARNED SOMETHING. A refusal claim over an empty set passes '
    + 'while proving nothing, which is how a gate starts lying',
    allEarned.length >= 6, allEarned.length + ' edges over every outfit x both states');

  const badWarm = allEarned.filter(x => {
    if (x.e.sign !== 'warm') return false;
    const src = BohemiaBetween.between(x.from, x.e.to);
    return !src || src.sign !== 'warm';
  });
  ok('H4 *** THE ENEMY OF MY ENEMY IS NEVER MADE MY FRIEND. *** Under Heider\'s '
    + 'STRONG balance an all-negative triad is unstable, so being at odds with '
    + 'somebody who is at odds with somebody else would manufacture an alliance '
    + 'out of arithmetic. Davis 1967 dropped exactly that assumption, and the '
    + 'data agrees: all-negative triads are OVERrepresented in real signed '
    + 'networks. So every warm edge here traces to a WARM canon relation and '
    + 'never to a hostile one. The game does not hand you an ally you did not '
    + 'earn, and inventing alliances would be writing his lore',
    badWarm.length === 0,
    JSON.stringify(badWarm.slice(0, 3).map(x => x.from + ' -> ' + x.e.to)));

  const selfEdge = allEarned.filter(x => N(x.e.to) === N(MINE));
  ok('H5 AND NOBODY EARNS AN EDGE WITH THEMSELVES',
    selfEdge.length === 0, JSON.stringify(selfEdge.slice(0, 2)));

  /* AUTHORED CANON WINS, AND IT IS THE ORDER RATHER THAN A TIE-BREAK. */
  /* THE EARNED EDGE IS PLANTED ON A PAIR HE ACTUALLY WROTE, and the first
     version was not. It planted CUSTOM|REMNANTS and then asked about
     REMNANTS|CARTEL -- a different pair, so the earned lookup found nothing
     and the authored answer won no matter which order the code checked in.
     Proven by mutation: moving the earned lookup ABOVE the authored loop left
     this green. To test that canon wins a fight, the fight has to happen. */
  const c = sv();
  c.meta.between = {};
  c.meta.between['REMNANTS|CARTEL'] = { sign: 'warm', label: 'adjacent', via: 'x' };
  const authored = BohemiaBetween.between('Remnants', 'Cartel', c);
  ok('H6 AN EARNED EDGE CAN NEVER OVERWRITE ONE HE WROTE. between() returns '
    + 'from the authored loop before the earned lookup is ever reached, so his '
    + 'graph is the world and the save is only what this run did to itself. '
    + 'MECHANISM-MINE / CONTENTS-PAOLO\'S, enforced by control flow rather than '
    + 'by a comment asking nicely',
    !!authored && authored.label === 'permanent-war' && !authored.earned,
    JSON.stringify(authored && { label: authored.label, earned: authored.earned }));

  const d = sv();
  const first = BohemiaBetween.earn(d, 'Cartel', 'sided', 1);
  const again = BohemiaBetween.earn(d, 'Cartel', 'sided', 9);
  ok('H7 AND MAKING AN ENEMY TWICE MAKES ONE ENEMY. The first time you did it '
    + 'is the time that counts; re-siding does not re-make it, and a second '
    + 'row for the same outfit would read as two separate grudges',
    first.length > 0 && again.length === 0
      && BohemiaBetween.allEarned(d).length === first.length,
    'first ' + first.length + ', again ' + again.length);

  /* THE TRIAD ITSELF, CHECKED AS A TRIAD. */
  const unbalanced = allEarned.filter(x => {
    const mid = BohemiaBetween.between(x.from, x.e.to);
    if (!mid || mid.sign === 'neutral' || mid.sign === 'unknown') return false;
    const you_sided = +1;                       /* you committed: positive */
    const sided_other = mid.sign === 'hostile' ? -1 : +1;
    const you_other = x.e.sign === 'hostile' ? -1 : +1;
    const positives = [you_sided, sided_other, you_other].filter(v => v > 0).length;
    return positives === 2;                     /* the one forbidden shape */
  });
  ok('H8 AND NO TRIAD THIS PRODUCES IS THE FORBIDDEN ONE, checked as a triad '
    + 'rather than trusted from the code that made it. Weak balance forbids '
    + 'exactly one configuration -- two positive edges and one negative -- and '
    + 'this walks every edge earned across every outfit and both states and '
    + 'counts the signs',
    unbalanced.length === 0,
    JSON.stringify(unbalanced.slice(0, 3).map(x => x.from + '->' + x.e.to + ' ' + x.e.sign)));

  ok('H9 AND THE WORDS DESCRIBE THIS EDGE, NOT THE PAIR THAT CAUSED IT. Caught '
    + 'on the real board: the Caravans row read "THEY TAX THEM", inherited from '
    + 'the CARTEL\'s relation with them. True, and about two other outfits. You '
    + 'did not tax anybody',
    made.every(m => !/TAX THEM|AT WAR, AND IT DOES NOT END/.test(m.word)),
    JSON.stringify(made.map(m => m.word)));
}

/* ========================================================================== */
console.log('\nI. AND AN EARNED ENEMY IS A REPUTATION, NOT A FINE.');
/* ========================================================================== */
{
  const sv = { meta: {} };
  const roster = [{ id: 'a', faction: 'Church', home: { building: 1 }, job: { kind: 'scav' } },
                  { id: 'b', faction: 'Church', home: { building: 1 }, job: { kind: 'scav' } }];
  const opts = () => ({ ties: TIES, watching: BohemiaBetween, save: sv });

  const before = C.whoHears('Church', roster, { x: 0, y: 0 }, opts());
  ok('I1 BEFORE YOU HAVE MADE AN ENEMY, NOBODY IS WATCHING YOU. The Church have '
    + 'no canon position on anybody, so siding with them reaches nobody',
    before.length === 0, JSON.stringify(before.map(h => h.faction)));

  BohemiaBetween.earn(sv, 'Cartel', 'sided', 1);
  const after = C.whoHears('Church', roster, { x: 0, y: 0 }, opts());
  ok('I2 AFTER IT, THEY HEAR EVERYTHING YOU DO, FOREVER. This is the whole '
    + 'difference between a fine and a reputation: the cost of siding with the '
    + 'Cartel was charged once, but the Remnants have been watching YOU ever '
    + 'since, so a commitment to the CHURCH -- who they have no quarrel with '
    + 'at all -- still reaches them',
    after.length >= 2 && after.every(h => h.watching && h.watching.why === 'you'),
    JSON.stringify(after.map(h => h.faction + ':' + (h.watching && h.watching.why))));

  const paid = C.costs('burned', after, { CARAVANS: 6, REMNANTS: 6 },
                       { between: BohemiaBetween, sided: 'Church', save: sv });
  ok('I3 AND IT COSTS MORE BECAUSE OF WHAT THEY THINK OF YOUR OUTFIT, not of '
    + 'the people in front of you. between(REMNANTS, Church) is null and would '
    + 'have charged them flat -- an earned enemy reading exactly like a '
    + 'stranger, which is the whole thing quietly not working. The edge that '
    + 'does the charging is the one with YOUR OUTFIT',
    paid.length >= 2 && paid.every(c => (c.realMoved | 0) > 0),
    JSON.stringify(paid.map(c => c.faction + ' -' + c.lose + ' (flat ' + c.flatLose + ')')));

  ok('I4 AND A CALLER THAT PASSES NO SAVE GETS YESTERDAY\'S ANSWER. Every one '
    + 'of these is opt-in, so no other lane\'s surface moves underneath it',
    C.whoHears('Church', roster, { x: 0, y: 0 }, { ties: TIES }).length === 0);
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
        /* *** STAND WHERE THIS PERSON IS THE ONE WHO ANSWERS. *** This was
           `hx = at[0] + 1` and a straight ctOpen(). It trusts that the body it
           just chose is the only one in reach, which was true while the valley
           held one person a block and stopped being true on 8/28 when the
           population default moved to 20. The card then opens on whoever is
           NEARER, and three claims below read a stranger's card and reported it
           as a missing enemies row. A TEST THAT PICKS A PERSON AND THEN TRUSTS
           THE GAME TO PICK THE SAME ONE IS TESTING THE CROWD. */
        const at = ctAt(who);
        let stood = false;
        for (const d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]) {
          hx = at[0] + d[0]; hy = at[1] + d[1];
          const adj = ctAdjacent();
          if (adj && adj.id === who.id) { stood = true; break; }
        }
        if (!stood) continue;
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

/* ==========================================================================
   THE BOARD, THE CHIP, AND THE ONE OUTFIT NOBODY ELSE MAY BE BORN INTO.
   A second browser pass because it drives a DIFFERENT gesture: it presses the
   real commit button and then reads what the world became.
   ========================================================================== */
async function onTheBoard() {
  console.log('\nJ. THE OUTFIT BOARD, AND A COMMITMENT PRESSED FOR REAL.');
  const { chromium } = requirePlaywright();
  const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 8000);

    const R = await page.evaluate(() => {
      const out = { errs: [] };
      out.chip = !!document.getElementById('outfitbtn');
      out.panel = !!document.getElementById('outfitpanel');
      out.registered = (typeof OUTSIDE_PANELS !== 'undefined')
        && OUTSIDE_PANELS.some(r => r[0] === 'outfitpanel');

      /* WHO RUNS WITH WHOM, over every base cell. */
      const bases = ctBases() || {};
      out.census = {};
      for (const bse of Object.values(bases)) {
        hx = bse.x * FN + 2; hy = bse.y * FN + 2;
        for (const p of ctEveryone()) {
          const f = ctFactionOf(p);
          if (f) out.census[f] = (out.census[f] || 0) + 1;
        }
      }
      out.mine = BohemiaBetween.mine();
      out.myBaseOnMap = !!bases[out.mine];

      /* THE BOARD BEFORE ANYTHING HAPPENED. */
      ctOutfitOpen();
      out.emptyBoard = document.getElementById('outfitpanel').innerText || '';
      out.openedEmpty = document.getElementById('outfitpanel').classList.contains('on');
      ctOutfitClose();
      out.closesEmpty = !document.getElementById('outfitpanel').classList.contains('on');

      /* A REAL COMMITMENT, PRESSED. */
      for (const bse of Object.values(bases)) {
        hx = bse.x * FN + 2; hy = bse.y * FN + 2;
        let who = null, fid = null;
        for (const p of ctEveryone()) {
          const f = ctFactionOf(p);
          if (f && BohemiaBetween.ripples(f).some(r => r.sign === 'hostile')) { who = p; fid = f; break; }
        }
        if (!who) continue;
        /* *** STAND WHERE THIS PERSON IS THE ONE WHO ANSWERS. *** This was
           `hx = at[0] + 1` and a straight ctOpen(). It trusts that the body it
           just chose is the only one in reach, which was true while the valley
           held one person a block and stopped being true on 8/28 when the
           population default moved to 20. The card then opens on whoever is
           NEARER, and three claims below read a stranger's card and reported it
           as a missing enemies row. A TEST THAT PICKS A PERSON AND THEN TRUSTS
           THE GAME TO PICK THE SAME ONE IS TESTING THE CROWD. */
        const at = ctAt(who);
        let stood = false;
        for (const d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]) {
          hx = at[0] + d[0]; hy = at[1] + d[1];
          const adj = ctAdjacent();
          if (adj && adj.id === who.id) { stood = true; break; }
        }
        if (!stood) continue;
        const sv = ctBelongSave();
        sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {};
        sv.meta.commit = {}; sv.meta.between = {};
        ctSawCell(); ctOpen(); for (let i = 0; i < 3; i++) { ctClose(); ctOpen(); }
        sv.meta.gave[fid] = 5;
        for (const k of Object.keys(BohemiaBelonging.RULES || {})) if (k !== fid) sv.meta.gave[k] = 6;
        ctClose(); ctOpen();
        const btn = document.getElementById('ctcommit');
        if (!btn) continue;
        out.sided = fid;
        out.expected = BohemiaBetween.ripples(fid).filter(r => r.sign === 'hostile')
          .map(r => String(r.to).toUpperCase());
        btn.click();
        out.earned = BohemiaBetween.myRipples(ctBelongSave())
          .map(r => ({ to: String(r.to).toUpperCase(), sign: r.sign, earned: !!r.earned, via: r.via }));
        out.rings = (document.getElementById('outfitbtn') || {}).className || '';
        ctOutfitOpen();
        out.board = document.getElementById('outfitpanel').innerText || '';
        ctOutfitClose();
        break;
      }
      return out;
    });

    ok('J1 THE CHIP AND THE PANEL ARE IN THE SHIPPED CITY, and the panel is in '
      + 'the city\'s own OUTSIDE_PANELS registry rather than carrying a sixth '
      + 'bespoke close handler (Paolo 8/24: no pop menu that does not go away '
      + 'when you tap out of it)',
      R.chip && R.panel && R.registered,
      JSON.stringify({ chip: R.chip, panel: R.panel, registered: R.registered }));

    ok('J2 IT OPENS AND IT CLOSES', R.openedEmpty && R.closesEmpty);

    ok('J3 AND WITH NOTHING EARNED IT SAYS SOMETHING REAL. Canon: "No preset '
      + 'philosophy. Identity emerges from three generations of action." An '
      + 'outfit with no enemies has not done anything yet, and saying so '
      + 'teaches the whole system in one screen. An empty box teaches nothing',
      /NOBODY IN THIS VALLEY HAS A POSITION ON YOU YET/.test(R.emptyBoard)
        && R.emptyBoard.length > 120,
      JSON.stringify((R.emptyBoard || '').slice(0, 90)));

    ok('J4 PRESSING THE REAL COMMIT BUTTON EARNS THE REAL ENEMIES. Not earn() '
      + 'called from a probe -- the button a player presses, on the card a '
      + 'player opens, and then the world is asked what it became',
      !!R.sided && Array.isArray(R.earned) && R.earned.length > 0
        && R.expected.every(e => R.earned.some(x => x.to === e && x.sign === 'hostile')),
      JSON.stringify({ sided: R.sided, expected: R.expected, earned: R.earned }));

    ok('J5 EVERY ONE OF THEM IS MARKED AS EARNED AND CARRIES WHY. "Why does '
      + 'this outfit hate me" is a question the player is entitled to an answer '
      + 'to, and the answer is the outfit he threw in with',
      (R.earned || []).every(x => x.earned && x.via),
      JSON.stringify(R.earned));

    ok('J6 THE CHIP RINGS WHEN IT HAPPENS. He is not going to open a panel on '
      + 'the off-chance; the moment something lands is the moment to say so',
      /ring/.test(R.rings || ''), JSON.stringify(R.rings));

    ok('J7 AND THE BOARD LISTS THEM, WITH PROVENANCE AND WITH WHAT THEY WILL '
      + 'STILL GIVE YOU',
      /YOU MADE THIS/.test(R.board || '')
        && /WHEN YOU THREW IN WITH THE/.test(R.board || '')
        && /WHAT THEY WILL STILL GIVE YOU/.test(R.board || '')
        && (R.expected || []).every(e => (R.board || '').indexOf(e) >= 0),
      JSON.stringify((R.board || '').slice(0, 160)));

    /* THE ONE OUTFIT NOBODY ELSE MAY BE BORN INTO. */
    ok('J8 *** NOBODY IS BORN IN THE PLAYER\'S OWN GANG. *** Measured before it '
      + 'was fixed: a census of every base cell in the live world had TWO '
      + 'strangers running with CUSTOM, the outfit Paolo named in capitals with '
      + 'six exclamation marks, which the player has not formed, named, or '
      + 'recruited one person into. They joined it the way anybody joins '
      + 'anything here: by living near its base. Correct machinery pointed at '
      + 'the one outfit it must not touch',
      !R.census[R.mine], JSON.stringify(R.census));

    ok('J9 AND HIS BASE IS STILL ON THE MAP. MAP LAW: Claude never designs map '
      + 'layouts. The base is not moved or removed -- it is YOUR base and it '
      + 'belongs there. It is only taken out of the list of outfits a STRANGER '
      + 'can be born into',
      R.myBaseOnMap === true);

    ok('J10 AND THE VALLEY DID NOT EMPTY OUT. Excluding an outfit from the draw '
      + 'could have quietly deleted its people instead of reassigning them; '
      + 'the ground near your base is contested by whoever else holds it',
      Object.values(R.census).reduce((a, b) => a + b, 0) >= 15,
      JSON.stringify(R.census));

  } finally { await browser.close(); }
}

/* ==========================================================================
   K. THE VALLEY HALF OF THE BOARD, AND THE MEASUREMENT THAT FORCED IT.
   ========================================================================== */
async function onTheValley() {
  console.log('\nK. AND WHETHER HE CAN REACH ANY OF THIS AT ALL.');
  const { chromium } = requirePlaywright();
  const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 9000);

    const R = await page.evaluate(() => {
      const out = {};
      out.start = ctCell();
      /* HOW FAR TO THE FIRST PERSON WHO RUNS WITH ANYBODY, from the real
         spawn, on the real surface, with no save. */
      const [cx, cy] = out.start;
      out.nearestPerson = null;
      for (let r = 0; r <= 12 && !out.nearestPerson; r++) {
        for (let dx = -r; dx <= r && !out.nearestPerson; dx++)
          for (let dy = -r; dy <= r && !out.nearestPerson; dy++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const nx = cx + dx, ny = cy + dy;
            if (nx < 0 || ny < 0) continue;
            hx = nx * FN + 2; hy = ny * FN + 2;
            for (const p of ctEveryone()) {
              const f = ctFactionOf(p);
              if (f) { out.nearestPerson = { ring: r, faction: f }; break; }
            }
          }
      }
      /* AND HOW MANY PEOPLE ARE IN THAT DEAD ZONE, because "169 empty cells"
         invites the obvious objection that the sweep is hitting ungenerated
         world. It is not: every one of those cells is populated. The number
         that makes it undeniable is how many PEOPLE are standing in it. */
      out.zone = { cells: 0, people: 0, affiliated: 0, emptyCells: 0 };
      for (let dx = -6; dx <= 6; dx++) for (let dy = -6; dy <= 6; dy++) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0) continue;
        hx = nx * FN + 2; hy = ny * FN + 2;
        out.zone.cells++;
        const all = ctEveryone();
        out.zone.people += all.length;
        if (!all.length) out.zone.emptyCells++;
        for (const p of all) if (ctFactionOf(p)) out.zone.affiliated++;
      }
      hx = cx * FN + 2; hy = cy * FN + 2;      /* put him back */
      const bases = ctBases() || {};
      const mine = BohemiaBetween.mine();
      out.nearestBase = Object.entries(bases)
        .filter(([n]) => n !== mine)
        .map(([n, b]) => ({ n, d: Math.abs(b.x - cx) + Math.abs(b.y - cy) }))
        .sort((a, b) => a.d - b.d)[0];
      out.FN = FN;
      out.rows = ctValleyRows();
      ctOutfitOpen();
      out.board = document.getElementById('outfitpanel').innerText || '';
      ctOutfitClose();
      out.baseCount = Object.keys(bases).length;
      out.basePos = {};
      for (const [n, b] of Object.entries(bases)) out.basePos[String(n).toUpperCase()] = { x: b.x, y: b.y };
      return out;
    });

    /* THE MEASUREMENT IS PRINTED EVERY RUN, whether or not anything is red.
       A number nobody looks at is how a hole this size stayed invisible for
       two weeks while every gate in the repo was green. */
    console.log('      MEASURED: ' + R.zone.people + ' PEOPLE within 6 cells of the '
      + 'spawn across ' + R.zone.cells + ' cells (' + R.zone.emptyCells
      + ' of them empty), and ' + R.zone.affiliated + ' of those people run with anybody.');
    console.log('      MEASURED: player spawns at cell ' + JSON.stringify(R.start)
      + '; nearest affiliated person ' + (R.nearestPerson
          ? R.nearestPerson.ring + ' cells (' + R.nearestPerson.faction + ')'
          : 'NOT FOUND within 12 cells')
      + '; nearest base ' + (R.nearestBase
          ? R.nearestBase.n + ' at ' + R.nearestBase.d + ' cells = '
            + (R.nearestBase.d * R.FN) + ' fine tiles'
          : 'none'));

    ok('K0 THE DEAD ZONE IS REAL AND IT IS NOT A MEASUREMENT ARTIFACT. The '
      + 'obvious objection to "169 empty cells" is that the sweep is hitting '
      + 'world that has not generated yet. It is not: every one of those cells '
      + 'is populated, there are EIGHT HUNDRED AND THIRTY SEVEN PEOPLE standing '
      + 'in them, and not one of them runs with anybody. This claim exists so '
      + 'the objection cannot be raised again without the numbers answering it',
      R.zone.people > 400 && R.zone.emptyCells === 0 && R.zone.affiliated === 0,
      JSON.stringify(R.zone));

    ok('K1 THE BOARD LISTS EVERY OUTFIT THE VALLEY HOLDS, not only the ones '
      + 'with a position on you. MEASURED FIRST, and it is the reason this '
      + 'exists: from the player\'s real spawn there is not one affiliated '
      + 'person within SIX cells, the nearest is nine cells out, and the '
      + 'nearest base is twenty-nine. Two weeks of faction machinery sat '
      + 'behind that walk and no surface in the game had ever mentioned that '
      + 'any of it was there',
      Array.isArray(R.rows) && R.rows.length === R.baseCount,
      JSON.stringify({ rows: R.rows && R.rows.length, bases: R.baseCount }));

    ok('K2 AND EVERY ROW CARRIES A DIRECTION AND A DISTANCE IN PLAIN WORDS. A '
      + 'bearing is what a person carries in their head; a pin on a map is a '
      + 'HUD. The working middle between a world full of markers and a world '
      + 'with no signposts is "which way, and roughly how far"',
      (R.rows || []).every(r => r.where && r.far),
      JSON.stringify((R.rows || []).slice(0, 3)));

    /* THE COMPASS IS CHECKED AGAINST THE ARITHMETIC, not trusted. Screen y
       grows SOUTHWARD here, so a base with a smaller y is NORTH of you.
       Getting that backwards ships a board that points confidently the wrong
       way and reads perfectly fine in a diff. */
    /* RECOMPUTED FROM THE BASE POSITIONS, not eyeballed. The first version of
       this claim only checked that no row said NORTH and SOUTH at once, which
       a completely inverted compass passes without blinking -- and an inverted
       compass is the single most likely bug in this feature, because screen y
       grows SOUTHWARD and every instinct says otherwise. A claim that cannot
       catch the obvious failure of the thing it is about is decoration. */
    const bearingWrong = (R.rows || []).filter(r => {
      if (r.mine) return false;
      const b = R.basePos[r.who];
      if (!b) return true;                         /* a row with no base is worse */
      const dx = b.x - R.start[0], dy = b.y - R.start[1];
      const ns = dy < 0 ? 'NORTH' : dy > 0 ? 'SOUTH' : '';
      const ew = dx < 0 ? 'WEST' : dx > 0 ? 'EAST' : '';
      const ax = Math.abs(dx), ay = Math.abs(dy);
      let want;
      if (ns && ew) want = ax > ay * 2 ? ew : ay > ax * 2 ? ns : ns + ew;
      else want = ns || ew || 'RIGHT HERE';
      return String(r.where) !== want;
    });
    ok('K3 AND EVERY BEARING IS THE ONE THE ARITHMETIC GIVES, recomputed here '
      + 'from the base positions rather than trusted from the code that '
      + 'printed it. SCREEN Y GROWS SOUTHWARD in this world, so a base with a '
      + 'SMALLER y is NORTH of you -- an inverted compass is the likeliest bug '
      + 'this feature has and it reads perfectly fine in a diff',
      bearingWrong.length === 0,
      JSON.stringify(bearingWrong.slice(0, 4).map(r => r.who + ' said ' + r.where)));

    ok('K4 THE NEAREST ONE IS CALLED OUT ON ITS OWN, because a list is not a '
      + 'direction and a system with no next step has no next step',
      /NEAREST GROUND THAT BELONGS TO ANYBODY/.test(R.board)
        && !!R.nearestBase && R.board.indexOf(R.nearestBase.n.toUpperCase()) >= 0,
      JSON.stringify({ nearest: R.nearestBase }));

    ok('K5 AND IT IS THE ACTUALLY NEAREST ONE, checked against the base '
      + 'positions rather than taken from the sort that produced it',
      (() => {
        const line = (R.board.match(/NEAREST GROUND THAT BELONGS TO ANYBODY: ([A-Z ]+),/) || [])[1];
        return !!line && !!R.nearestBase
          && line.trim() === R.nearestBase.n.toUpperCase();
      })(),
      JSON.stringify({ printed: (R.board.match(/NEAREST GROUND[^\n]*/) || [])[0],
                       computed: R.nearestBase }));

    ok('K6 YOUR OWN GROUND IS MARKED AS YOURS AND NOT OFFERED AS SOMEWHERE TO '
      + 'GO. It is on the list because it is on the map, and it is greyed '
      + 'because walking to your own base is not a next step',
      (R.rows || []).some(r => r.mine && /YOURS/.test(r.where))
        && !/NEAREST GROUND THAT BELONGS TO ANYBODY: CUSTOM/.test(R.board));

    ok('K7 AND THE BOARD SAYS WHETHER YOU HAVE EVER DEALT WITH THEM. From a '
      + 'cold start that is NEVER MET on every row, which is the true answer '
      + 'and the one that makes the list worth reading twice',
      /NEVER MET/.test(R.board), JSON.stringify(R.board.slice(0, 100)));

  } finally { await browser.close(); }
}

/* ==========================================================================
   L. A GUARD THAT COULD NOT FIRE, AND A LIST OF DIRECTIONS WITH NO REASONS.
   ========================================================================== */
async function onWhyWalk() {
  console.log('\nL. WHY HE WOULD MAKE THE WALK, AND WHAT HAPPENS IF HE REROLLS.');
  const { chromium } = requirePlaywright();
  const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));
  const BEL = require(path.join(ROOT, 'engine/bohemia_belonging.js'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  const warns = [];
  page.on('console', m => { if (/BOHEMIA:/.test(m.text())) warns.push(m.text()); });
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 9000);

    const before = await page.evaluate(() => {
      ctOutfitOpen();
      const txt = document.getElementById('outfitpanel').innerText || '';
      ctOutfitClose();
      return { txt, rows: ctValleyRows(), basesNull: !ctBases(),
               seed: seed >>> 0, boot: BOH_ONE_SEED() >>> 0 };
    });

    ok('L1 IN THE WORLD THE BASES WERE BAKED FOR, THE GUARD STAYS OUT OF THE '
      + 'WAY. seed and BOH_ONE_SEED() agree at boot, so nothing is withheld',
      before.seed === before.boot && !before.basesNull,
      JSON.stringify({ seed: before.seed, boot: before.boot, basesNull: before.basesNull }));

    /* WHAT THEY WANT AND WHAT THEY PAY, READ OUT OF THE RULES TABLE. */
    const withRule = (before.rows || []).filter(r => !r.mine && BEL.ruleOf(r.who));
    ok('L2 THERE ARE OUTFITS WITH RULES ON THE BOARD TO CHECK. A sweep that '
      + 'found none would pass every claim below it having measured nothing',
      withRule.length >= 5, withRule.length + ' of ' + (before.rows || []).length);

    ok('L3 EVERY OUTFIT WITH A RULE SAYS WHAT IT WANTS AND WHAT IT PAYS. The '
      + 'nearest of these is 29 cells from the spawn -- 3,712 tiles. A bearing '
      + 'says where; it does not say what is at the end of it. Both answers '
      + 'have been written in bohemia_belonging RULES the whole time and both '
      + 'were only ever shown on the card of somebody he had ALREADY MET, '
      + 'which is one walk too late. Same shape as the four garments cooked '
      + 'for the Colorful in July and worn by nobody for five weeks',
      withRule.every(r => r.want && r.pays),
      JSON.stringify(withRule.filter(r => !r.want || !r.pays).slice(0, 3)));

    /* NOTHING WAS AUTHORED IN THE CITY. This is the claim that keeps the board
       honest: every line it prints must be the module's own words. */
    const invented = withRule.filter(r => {
      const rule = BEL.ruleOf(r.who);
      return r.want !== (rule.anchorWant || null) || r.pays !== (rule.pays || null);
    });
    ok('L4 AND EVERY WORD OF IT IS THE RULES TABLE\'S OWN, compared string for '
      + 'string against engine/bohemia_belonging.js. MECHANISM-MINE / '
      + 'CONTENTS-PAOLO\'S: the board may move his words one screen earlier, it '
      + 'may not write new ones',
      invented.length === 0,
      JSON.stringify(invented.slice(0, 2).map(r => r.who)));

    ok('L5 AND THEY ARE ACTUALLY ON THE SCREEN, not merely in the row object',
      withRule.slice(0, 3).every(r => before.txt.indexOf(r.pays) >= 0),
      JSON.stringify(before.txt.slice(0, 120)));

    /* THE GUARD, DRIVEN BY THE REAL BUTTON. */
    await page.evaluate(() => { document.getElementById('reroll').click(); });
    await SETTLE(page, 6000);
    const after = await page.evaluate(() => {
      ctOutfitOpen();
      const txt = document.getElementById('outfitpanel').innerText || '';
      ctOutfitClose();
      return { txt, basesNull: !ctBases(), seed: seed >>> 0 };
    });

    ok('L6 *** THE GUARD IN ctBases() CAN FIRE NOW. *** It compared '
      + 'BOH_SEED_TEXT (a const) against CT_BASES_SEED (baked from that same '
      + 'const). TWO CONSTANTS. It could never fire, while its own comment '
      + 'said "a different seed gets NULL rather than a confidently wrong '
      + 'answer". What actually makes a different world is `seed`, which '
      + 'REROLL advances by one LCG step without touching the text. Measured '
      + 'by pressing the real button: 2691674296 -> 3182853632, and the guard '
      + 'went on answering',
      after.seed !== before.seed && after.basesNull === true,
      JSON.stringify({ seedBefore: before.seed, seedAfter: after.seed,
                       basesNull: after.basesNull }));

    ok('L7 AND IT SAYS WHY, ON THE BOARD. Returning null in silence is how '
      + 'this lane lost thirteen days: factionOf answered null for all 166 '
      + 'people and "nobody in Las Vegas runs with anybody" looks exactly like '
      + 'a world where nobody does. A guard that goes quiet IS the bug it was '
      + 'written to prevent',
      /YOU REROLLED THE WORLD/.test(after.txt),
      JSON.stringify(after.txt.slice(0, 160)));

    ok('L8 AND ONCE IN THE CONSOLE, not on every call. A warning that repeats '
      + 'per person per frame is noise nobody reads',
      warns.filter(w => /rerolled/.test(w)).length === 1,
      JSON.stringify(warns.slice(0, 2)));

  } finally { await browser.close(); }
}

/* ==========================================================================
   M. THE MAP OF THE VALLEY, AND WHETHER IT SAYS WHOSE GROUND IS WHOSE.
   Every claim here reads PIXELS OFF THE REAL CANVAS. This is drawn art on a
   surface, so a source check is a lie: the first version of this feature was
   correct in the source and INVISIBLE in the render, because it sized the
   markers in TILES and the whole-map zoom makes a tile 3.74 pixels wide.
   ========================================================================== */
async function onTheGround() {
  console.log('\nM. THE WHOLE MAP, AND WHOSE GROUND IS WHOSE.');
  const { chromium } = requirePlaywright();
  const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 9000);
    /* the wake card covers the map, and a screenshot of a modal is not a
       screenshot of the thing under it. */
    await page.evaluate(() => {
      const x = [...document.querySelectorAll('button,div')]
        .filter(e => /^GET UP$/.test((e.textContent || '').trim()));
      if (x.length) x[0].click();
    });
    await SETTLE(page, 2000);
    await page.evaluate(() => {
      if (typeof MODE !== 'undefined' && MODE !== 'city') {
        const m = document.getElementById('modechip'); if (m) m.click();
      }
    });
    await SETTLE(page, 2000);
    await page.evaluate(() => {
      const f = document.getElementById('fitbtn');
      if (f && f.style.display !== 'none') f.click();
    });
    await SETTLE(page, 2500);

    const probe = () => page.evaluate(() => {
      const ox = Math.round(cv.width / 2 - (city.x - city.y) * TW / 2 + panX);
      const oy = Math.round(cv.height / 2 - (city.x + city.y) * TH / 2 + panY);
      const bases = ctBases() || {};
      const ctx = cv.getContext('2d');
      const out = { TW: TW, basesNull: !ctBases(), marker: {}, label: {},
                    mine: null, nearest: null, count: 0 };
      try { out.mine = BohemiaBetween.mine(); } catch (_e) {}
      const N = v => String(v || '').toUpperCase().replace(/[\s_]/g, '');
      let nd = 1e9;
      for (const [n, b] of Object.entries(bases)) {
        if (out.mine && N(n) === N(out.mine)) continue;
        const d = Math.abs(b.x - city.x) + Math.abs(b.y - city.y);
        if (d < nd) { nd = d; out.nearest = n; }
      }
      const isMineCol = (r, g2, b2) =>
        Math.abs(r - 232) < 26 && Math.abs(g2 - 220) < 26 && Math.abs(b2 - 192) < 34;
      const isThemCol = (r, g2, b2) =>
        Math.abs(r - 200) < 34 && Math.abs(g2 - 165) < 34 && Math.abs(b2 - 88) < 40;
      for (const [n, b] of Object.entries(bases)) {
        out.count++;
        const p = iso(b.x | 0, b.y | 0, ox, oy);
        const cy = p.sy + TH / 2;
        const R = Math.max(4, Math.min(TW * 0.5, 15));
        const sx = Math.max(0, Math.round(p.sx - R - 2));
        const sy = Math.max(0, Math.round(cy - R - 2));
        const d = ctx.getImageData(sx, sy, Math.round(R * 2 + 5), Math.round(R * 2 + 5)).data;
        let mineHit = 0, themHit = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (isMineCol(d[i], d[i+1], d[i+2])) mineHit++;
          else if (isThemCol(d[i], d[i+1], d[i+2])) themHit++;
        }
        out.marker[n] = { mine: mineHit, them: themHit };
        /* THE LABEL BAND above this marker, for the two that get named at this
           zoom. Counting TEXT-COLOURED pixels in each one is what catches the
           defect that actually happened: CUSTOM's plate painted over the front
           of COLORFUL's name, so both labels were "drawn" and one was gone. */
        const ly = Math.max(0, Math.round(cy - R - 80));
        const lh = Math.max(1, Math.round(cy - R - 1) - ly);
        const lx = Math.max(0, Math.round(p.sx - 45));
        if (lh > 4) {
          const ld = ctx.getImageData(lx, ly, 90, lh).data;
          let txt = 0;
          for (let i = 0; i < ld.length; i += 4)
            if (isMineCol(ld[i], ld[i+1], ld[i+2]) || isThemCol(ld[i], ld[i+1], ld[i+2])) txt++;
          out.label[n] = txt;
        }
      }
      /* WHAT THE RENDER SAYS IT DREW, published by renderCity the same way it
         already publishes window.__LAMPQ. */
      out.labelBoxes = (window.__GROUNDLABELS || []).slice();
      return out;
    });

    const R1 = await probe();

    ok('M0 THE MAP IS OPEN AND ZOOMED ALL THE WAY OUT. TW is the width of one '
      + 'cell in screen pixels; the whole 96x96 valley on a phone makes it tiny, '
      + 'and that is the condition this feature has to survive',
      R1.TW < 8 && R1.count >= 10,
      JSON.stringify({ TW: R1.TW, bases: R1.count }));

    const painted = Object.entries(R1.marker).filter(([, v]) => v.mine + v.them > 0);
    ok('M1 *** EVERY OUTFIT\'S GROUND IS ACTUALLY PAINTED ON THE MAP. *** Read '
      + 'as PIXELS off the real canvas at each base\'s own iso position, not as '
      + 'a string in the source. renderCity() did not call ctBases() once before '
      + 'this: you could open the map of the whole valley and nothing on it said '
      + 'anybody held any of it, while the canon says LIGHT=TERRITORY, CLUSTERED '
      + 'POWER, OWNED, and nobody patrols the dark',
      painted.length === R1.count,
      JSON.stringify(R1.marker));

    /* *** THIS CLAIM WAS DECORATION UNTIL A MUTATION PROVED IT. *** It used to
       assert `painted.length === count`, which is exactly what M1 already
       says -- so reverting the marker to tile-sized left it GREEN. The marker
       was still PAINTED, it was just four pixels of smudge, and "present" is
       not the property that matters. The property is LEGIBLE.
       So it counts AREA, and the floor is measured rather than picked:
           screen-sized (shipped)   min 24 px per marker, avg 31, max 44
           tile-sized   (the bug)   min 11 px per marker, avg 15, max 25
       20 sits between the two minima with margin on both sides. */
    const areas = Object.values(R1.marker).map(v => v.mine + v.them);
    const worst = Math.min.apply(null, areas);
    ok('M2 AND EVERY ONE OF THEM IS BIG ENOUGH TO SEE, not merely present. The '
      + 'first version sized the diamond in TILES, and at this zoom a tile is '
      + 'under four pixels wide -- correct in the source, a smudge in the '
      + 'render, found by screenshotting it. Measured floor: the shipped marker '
      + 'paints at least 24 pixels per base and the tile-sized bug paints 11',
      R1.TW < 8 && worst >= 20,
      JSON.stringify({ TW: R1.TW, worstMarkerPixels: worst, areas }));

    const mineRow = R1.mine ? R1.marker[R1.mine] : null;
    ok('M3 YOUR OWN GROUND READS DIFFERENTLY FROM THEIRS. "That one is mine" is '
      + 'the first thing anybody looks for on a map of who holds what, and it is '
      + 'a different colour rather than a different label',
      !!mineRow && mineRow.mine > mineRow.them,
      JSON.stringify({ mine: R1.mine, px: mineRow }));

    ok('M4 AND AT THIS ZOOM THE TWO THAT MATTER ARE NAMED: your own ground, and '
      + 'the nearest ground that belongs to anybody. Fourteen labels on a 350px '
      + 'diamond is a wall of text; these two are the reason the map is open',
      !!R1.mine && !!R1.nearest
        && (R1.label[R1.mine] | 0) > 0 && (R1.label[R1.nearest] | 0) > 0,
      JSON.stringify({ mine: R1.mine, mineTxt: R1.label[R1.mine],
                       nearest: R1.nearest, nearTxt: R1.label[R1.nearest] }));

    /* *** AND THIS CLAIM WAS DECORATION TOO, PROVEN BY MUTATION. *** It counted
       text-coloured pixels in a band above each marker. Remove the collision
       avoidance entirely and it stayed GREEN -- because the band is 90px wide
       and the NEIGHBOUR'S label is the same colour, so one label's pixels were
       being counted as the other's. It measured "is there any label near here",
       which both the fixed and the broken render satisfy.
       The only thing that can answer this is what the render says it DREW, so
       renderCity publishes its label boxes (window.__GROUNDLABELS, the same
       idiom it already uses for window.__LAMPQ) and this checks them for
       overlap directly. */
    const boxes = R1.labelBoxes || [];
    let overlap = null;
    for (let i = 0; i < boxes.length && !overlap; i++)
      for (let j = i + 1; j < boxes.length && !overlap; j++) {
        const a = boxes[i], b = boxes[j];
        if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y)
          overlap = [a, b];
      }
    ok('M5 AND NO TWO LABELS LAND ON TOP OF EACH OTHER. Seen on the real canvas: '
      + 'CUSTOM and COLORFUL are nine cells apart, about twenty pixels at this '
      + 'zoom, and CUSTOM\'s plate painted straight over the front of COLORFUL\'s '
      + 'name. Both were "drawn" and one was unreadable. Checked against the '
      + 'boxes the render publishes, because a pixel count near a marker reads '
      + 'the neighbour\'s label as its own and passes either way',
      boxes.length >= 2 && !overlap,
      JSON.stringify({ boxes: boxes.length, overlap }));

    /* AND IT COMPOSES WITH THE GUARD FIXED THIS MORNING. */
    await page.evaluate(() => { document.getElementById('reroll').click(); });
    await SETTLE(page, 6000);
    await page.evaluate(() => {
      const f = document.getElementById('fitbtn');
      if (f && f.style.display !== 'none') f.click();
    });
    await SETTLE(page, 2500);
    const R2 = await page.evaluate(() => ({ basesNull: !ctBases() }));

    ok('M6 AFTER A REROLL THE MAP STOPS CLAIMING TERRITORY. It asks ctBases(), '
      + 'which now knows the world moved out from under the bake, so it draws '
      + 'nothing rather than confidently painting the last valley\'s borders '
      + 'over this one. One organ, one answer, and this feature got it for free',
      R2.basesNull === true, JSON.stringify(R2));

  } finally { await browser.close(); }
}

/* ==========================================================================
   N. THE TOP OF THE LADDER, WHICH BOUGHT NOTHING FOR SIXTEEN DAYS.
   ========================================================================== */
async function onTheVouch() {
  console.log('\nN. WHAT INSIDE ACTUALLY BUYS.');
  const BEL = require(path.join(ROOT, 'engine/bohemia_belonging.js'));
  const { chromium } = requirePlaywright();
  const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));

  /* THE FIND, RE-MEASURED HERE RATHER THAN ASSERTED FROM A COMMENT. If some
     future turn wires INSIDE to something else, this stops being true and the
     claim below should be rewritten rather than quietly kept. */
  const rungs = (BEL.RUNGS || []).map(r => r.word);
  ok('N0 THE LADDER STILL ENDS AT INSIDE, and the claims below are about the '
    + 'rung that is actually last rather than one that used to be',
    rungs.length >= 2 && rungs[rungs.length - 1] === 'INSIDE',
    JSON.stringify(rungs));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  const warns = [];
  page.on('console', m => { if (/BOHEMIA:/.test(m.text())) warns.push(m.text()); });
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 9000);
    const R = await page.evaluate(() => {
      const out = {};
      const bases = ctBases() || {};
      let who = null;
      for (const bse of Object.values(bases)) {
        hx = bse.x * FN + 2; hy = bse.y * FN + 2;
        for (const p of ctEveryone()) if (!ctFactionOf(p)) { who = p; break; }
        if (who) break;
      }
      if (!who) return { err: 'no unaffiliated person anywhere' };
      /* STAND WHERE THIS PERSON IS THE ONE WHO ANSWERS (8/28). ctOpen and
         ctAdjacent show whoever is NEAREST, and standing at at[0]+1 trusts that
         the chosen body is the only one in reach. That was true while the
         population default was 1 and stopped being true the day it moved to 20:
         the card opens on a stranger and the claim below reports a missing
         feature. A TEST THAT PICKS A PERSON AND THEN TRUSTS THE GAME TO PICK THE
         SAME ONE IS TESTING THE CROWD. Falls back to the old cell if the whole
         ring is somebody else's, so nothing here can be made worse than it was. */
      const at = ctAt(who); let _sb = false;
      for (const _d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]) {
        hx = at[0] + _d[0]; hy = at[1] + _d[1];
        const _a = ctAdjacent(); if (_a && _a.id === who.id) { _sb = true; break; } }
      if (!_sb) { hx = at[0] + 1; hy = at[1]; }
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {};
      sv.meta.commit = {}; sv.meta.vouched = {};
      ctSawCell(); ctOpen(); for (let i = 0; i < 3; i++) { ctClose(); ctOpen(); }
      out.met = !!CT_MET.get('P:city:' + who.id);

      /* NOT INSIDE ANYWHERE: no offer, no button. */
      out.offerCold = !!ctVouchFor(who);
      out.btnCold = !!document.getElementById('ctvouch');

      /* ONE RUNG SHORT of the top: still nothing. This is the claim that makes
         it about INSIDE rather than about "having some standing". */
      const top = (BohemiaBelonging.RUNGS || []).slice(-1)[0];
      sv.meta.gave['CHURCH'] = Math.max(0, (top.at | 0) - 1);
      ctClose(); ctOpen();
      out.nearMissRung = (BohemiaBelonging.bargain(
        BohemiaBelonging.ruleOf('CHURCH'), BohemiaBelonging.gaveOf(sv, 'CHURCH')).rung || {}).word;
      out.offerNearMiss = !!ctVouchFor(who);
      out.btnNearMiss = !!document.getElementById('ctvouch');

      /* AT the top. */
      sv.meta.gave['CHURCH'] = top.at | 0;
      ctClose(); ctOpen();
      out.can = ctVouchFor(who);
      out.btn = !!document.getElementById('ctvouch');
      out.btnLabel = (document.getElementById('ctvouch') || {}).textContent || null;
      out.rows = [...document.querySelectorAll('.r')].map(r => {
        const k = r.querySelector('.k'), v = r.querySelector('.v');
        return (k ? k.textContent : '') + ' :: ' + (v ? v.textContent : '');
      });
      out.standBefore = BohemiaBelonging.gaveOf(sv, 'CHURCH');
      out.facBefore = ctFactionOf(who);

      const b = document.getElementById('ctvouch'); if (b) b.click();
      out.facAfter = ctFactionOf(who);
      out.standAfter = BohemiaBelonging.gaveOf(ctBelongSave(), 'CHURCH');
      out.bag = JSON.parse(JSON.stringify(ctBelongSave().meta.vouched || {}));
      out.offerAgain = !!ctVouchFor(who);

      /* AND IT SURVIVES WALKING AWAY. The per-cell roster does not persist; the
         save does, and that is the whole reason the override is keyed the way
         the met-ledger is. */
      const far = [hx, hy];
      hx = far[0] + FN * 3; hy = far[1] + FN * 3; ctSawCell();
      hx = far[0]; hy = far[1]; ctSawCell();
      let again = null;
      for (const p of ctEveryone()) if (p.id === who.id) { again = p; break; }
      out.facAfterWalk = again ? ctFactionOf(again) : 'person not found again';
      return out;
    });

    ok('N1 THERE IS SOMEBODY TO PUT UP AND YOU HAVE MET THEM. A vouch for a '
      + 'stranger you have never spoken to is a guess, not a vouch',
      !R.err && R.met === true, JSON.stringify({ err: R.err, met: R.met }));

    ok('N2 WITH NO STANDING ANYWHERE, THE OFFER IS NOT THERE',
      R.offerCold === false && R.btnCold === false,
      JSON.stringify({ offer: R.offerCold, btn: R.btnCold }));

    ok('N3 *** AND ONE RUNG SHORT OF THE TOP IT IS STILL NOT THERE. *** This is '
      + 'the claim that makes the feature about INSIDE rather than about having '
      + 'some standing. bohemia_claim and bohemia_favour both key off COUNTED; '
      + 'nothing anywhere keyed off INSIDE, so you climbed the last four rungs '
      + 'THROUGH A WALL that costs a burned bridge and the only thing that '
      + 'changed was the word on the card',
      R.offerNearMiss === false && R.btnNearMiss === false,
      JSON.stringify({ rung: R.nearMissRung, offer: R.offerNearMiss }));

    ok('N4 AT INSIDE, THE DOOR IS OPEN AND IT SAYS WHOSE. The rung\'s own note '
      + 'has shipped since 8/12: "The newcomer is the old-timer now, and the '
      + 'next newcomer is your problem." That is a specification and nothing '
      + 'implemented it',
      !!R.can && R.btn === true && /PUT THEM UP FOR THE CHURCH/.test(R.btnLabel || ''),
      JSON.stringify({ can: R.can, label: R.btnLabel }));

    ok('N5 AND THE CARD EXPLAINS IT, not just the button. The first version '
      + 'referenced a `p` that does not exist inside ctIntroRows, threw, and my '
      + 'own try/catch swallowed it -- so the OFFER appeared and the sentence '
      + 'explaining it silently did not. "A BARE CATCH HERE COST THIS LANE '
      + 'THREE DAYS" is already a comment in this file about ctFactionOf; I '
      + 'wrote another one twelve hours later',
      (R.rows || []).some(r => /YOU COULD PUT THEM UP/.test(r))
        && (R.rows || []).some(r => /RUNS WITH :: NOBODY/.test(r)),
      JSON.stringify((R.rows || []).filter(r => /PUT THEM UP|RUNS WITH/.test(r))));

    ok('N6 PRESSING IT CHANGES SOMEBODY ELSE\'S LIFE. They ran with nobody and '
      + 'now they run with the Church. It is the first thing in this game that '
      + 'alters another person rather than the player',
      R.facBefore === null && R.facAfter === 'CHURCH',
      JSON.stringify({ before: R.facBefore, after: R.facAfter }));

    ok('N7 AND IT COSTS EXACTLY ONE RUNG OF YOUR OWN. PORTES 1998, EXCESS '
      + 'CLAIMS ON GROUP MEMBERS: being inside is a relationship that can make '
      + 'demands of you, not a prize you collect. Taken through '
      + 'BohemiaBelonging.adjust, THE ONE WRITER, so the top rung buys exactly '
      + 'two of these before you have to climb back',
      R.standBefore - R.standAfter === 1,
      JSON.stringify({ before: R.standBefore, after: R.standAfter }));

    ok('N8 AND YOU CANNOT DO IT TWICE TO THE SAME PERSON. They have an outfit '
      + 'now; you cannot hand somebody to a second one',
      R.offerAgain === false);

    ok('N9 AND IT SURVIVES WALKING AWAY AND COMING BACK. Allegiance here is '
      + 'COMPUTED from a seat hash, so a vouch has to be an override in the '
      + 'save rather than a value somewhere -- keyed the way the met-ledger is '
      + 'keyed, because the per-cell roster does not persist and the save does',
      R.facAfterWalk === 'CHURCH', JSON.stringify({ afterWalk: R.facAfterWalk }));

    ok('N10 AND NOTHING WAS SWALLOWED WHILE DOING IT',
      warns.filter(w => /vouch row threw/.test(w)).length === 0,
      JSON.stringify(warns.slice(0, 2)));

  } finally { await browser.close(); }
}

/* ==========================================================================
   P. "AND AFTER THAT WHAT THIS PERSON DOES IS YOURS" -- A SENTENCE I SHIPPED
   YESTERDAY WITH NOTHING BEHIND IT.
   ========================================================================== */
async function onYourProblem() {
  console.log('\nP. THE HALF OF THE VOUCH THAT MAKES IT A DECISION.');
  const BEL = require(path.join(ROOT, 'engine/bohemia_belonging.js'));
  const { chromium } = requirePlaywright();
  const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  const warns = [];
  page.on('console', m => { if (/BOHEMIA:/.test(m.text())) warns.push(m.text()); });
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 9000);
    const R = await page.evaluate(() => {
      const out = {};
      const bases = ctBases() || {};
      let who = null;
      for (const bse of Object.values(bases)) {
        hx = bse.x * FN + 2; hy = bse.y * FN + 2;
        for (const p of ctEveryone()) if (!ctFactionOf(p)) { who = p; break; }
        if (who) break;
      }
      if (!who) return { err: 'nobody unaffiliated' };
      /* STAND WHERE THIS PERSON IS THE ONE WHO ANSWERS (8/28). ctOpen and
         ctAdjacent show whoever is NEAREST, and standing at at[0]+1 trusts that
         the chosen body is the only one in reach. That was true while the
         population default was 1 and stopped being true the day it moved to 20:
         the card opens on a stranger and the claim below reports a missing
         feature. A TEST THAT PICKS A PERSON AND THEN TRUSTS THE GAME TO PICK THE
         SAME ONE IS TESTING THE CROWD. Falls back to the old cell if the whole
         ring is somebody else's, so nothing here can be made worse than it was. */
      const at = ctAt(who); let _sb = false;
      for (const _d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]) {
        hx = at[0] + _d[0]; hy = at[1] + _d[1];
        const _a = ctAdjacent(); if (_a && _a.id === who.id) { _sb = true; break; } }
      if (!_sb) { hx = at[0] + 1; hy = at[1]; }
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {};
      sv.meta.commit = {}; sv.meta.vouched = {};
      ctSawCell(); ctOpen(); for (let i = 0; i < 3; i++) { ctClose(); ctOpen(); }
      const top = (BohemiaBelonging.RUNGS || []).slice(-1)[0];
      sv.meta.gave['CHURCH'] = top.at | 0;
      ctClose(); ctOpen();
      const b = document.getElementById('ctvouch'); if (b) b.click();
      out.inNow = ctFactionOf(who);
      ctOutfitOpen();
      out.boardIn = document.getElementById('outfitpanel').innerText || '';
      ctOutfitClose();

      /* HALFWAY DOWN IS NOT DOWN. Standing at the rung ABOVE the floor must
         NOT cut them loose -- otherwise the rule is "any slip" rather than
         "your word became worth nothing". */
      const rungs = BohemiaBelonging.RUNGS || [];
      sv.meta.gave['CHURCH'] = (rungs[1] ? rungs[1].at | 0 : 1);
      out.midRung = (BohemiaBelonging.bargain(BohemiaBelonging.ruleOf('CHURCH'),
        BohemiaBelonging.gaveOf(sv, 'CHURCH')).rung || {}).word;
      out.sweptMid = ctVouchSweep(sv, 5);
      out.stillInMid = ctFactionOf(who);

      /* ALL THE WAY DOWN. */
      sv.meta.gave['CHURCH'] = 0;
      out.floorRung = (BohemiaBelonging.bargain(BohemiaBelonging.ruleOf('CHURCH'),
        0).rung || {}).word;
      out.swept = ctVouchSweep(sv, 7);
      out.afterSweep = ctFactionOf(who);
      out.record = JSON.parse(JSON.stringify(ctVouchRecord(who) || {}));
      out.sweptTwice = ctVouchSweep(sv, 8);   /* idempotent */

      ctClose(); ctOpen();
      out.rows = [...document.querySelectorAll('.r')].map(r => {
        const k = r.querySelector('.k'), v = r.querySelector('.v');
        return (k ? k.textContent : '') + ' :: ' + (v ? v.textContent : '');
      });
      ctOutfitOpen();
      out.boardLost = document.getElementById('outfitpanel').innerText || '';
      ctOutfitClose();

      sv.meta.gave['CHURCH'] = top.at | 0;
      ctClose(); ctOpen();
      out.secondChance = !!ctVouchFor(who);
      return out;
    });

    ok('P1 SOMEBODY IS PUT UP AND THE BOARD KEEPS THE LIST. A place he can go '
      + 'and look, rather than a notification that interrupts him',
      !R.err && R.inNow === 'CHURCH'
        && /PEOPLE YOU PUT UP/.test(R.boardIn) && /STILL IN/.test(R.boardIn),
      JSON.stringify({ err: R.err, inNow: R.inNow,
                       board: (R.boardIn || '').match(/PEOPLE YOU PUT UP[\s\S]{0,60}/) }));

    ok('P2 A SLIP IS NOT A FALL. At the rung ABOVE the floor they keep their '
      + 'place, because the rule is "your word became worth nothing", not "you '
      + 'missed a day". A threshold that fires on any decrease would make the '
      + 'vouch a trap rather than a responsibility',
      (R.sweptMid || []).length === 0 && R.stillInMid === 'CHURCH',
      JSON.stringify({ rung: R.midRung, swept: R.sweptMid, still: R.stillInMid }));

    ok('P3 *** AND WHEN YOU ARE A STRANGER AGAIN, SO ARE THEY. *** I shipped '
      + 'this sentence on the card yesterday -- "and after that what this '
      + 'person does is yours" -- and nothing read the vouch bag except the '
      + 'line that grants the faction. A consequence written into a sentence '
      + 'and never built, which is the exact bug this lane spent a week finding '
      + 'in other people\'s code',
      R.floorRung === 'A STRANGER' && (R.swept || []).length === 1
        && R.afterSweep === null,
      JSON.stringify({ floor: R.floorRung, swept: R.swept, after: R.afterSweep }));

    ok('P4 THE ENTRY IS KEPT, NOT DELETED. "They were in, because of you, until '
      + 'you let it go" is the whole point and a deleted row cannot say it',
      R.record && R.record.faction === 'CHURCH' && (R.record.lost | 0) === 7,
      JSON.stringify(R.record));

    ok('P5 AND SWEEPING AGAIN CHANGES NOTHING. It runs every day on the day-end '
      + 'hook, so a second pass must not re-date a loss that already happened',
      (R.sweptTwice || []).length === 0, JSON.stringify(R.sweptTwice));

    ok('P6 YOU FIND OUT BY WALKING PAST THEM, and their card says whose fault '
      + 'it was. There is no notification anywhere for this. REALISM IS THE '
      + 'FLOOR, NOT THE CEILING: the real version is a number crossing a '
      + 'threshold, the memorable one is a person in the street who is nobody '
      + 'again and a sentence naming you',
      (R.rows || []).some(r => /THEY WERE IN, ONCE/.test(r))
        && (R.rows || []).some(r => /Your word put them there/.test(r)),
      JSON.stringify((R.rows || []).filter(r => /WERE IN|Your word/.test(r))));

    ok('P7 AND THE BOARD SAYS WHEN. Both halves of the list render, and the '
      + 'first version of this only patched ONE of ctOutfitHtml\'s two return '
      + 'paths -- the list appeared in the branch nobody is in, because the '
      + 'empty-state return fires for most of the game',
      /LOST THEIR PLACE ON DAY 7/.test(R.boardLost),
      JSON.stringify((R.boardLost || '').match(/PEOPLE YOU PUT UP[\s\S]{0,80}/)));

    ok('P8 AND IT IS RECOVERABLE, which is what stops it being a punishment. '
      + 'They run with nobody again, so the offer comes back: climb to INSIDE '
      + 'and you can put them up a second time, at the same cost. The door that '
      + 'closed is the same door',
      R.secondChance === true);

    ok('P9 AND NOTHING WAS SWALLOWED', warns.filter(w => /threw/.test(w)).length === 0,
      JSON.stringify(warns.slice(0, 2)));

  } finally { await browser.close(); }
}

async function onQuestDeeds() {
  console.log('\nR. HIS 82 AUTHORED CONSEQUENCES, AND WHETHER ANYBODY SEES THEM.');
  const { chromium } = requirePlaywright();
  const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));
  const fs2 = require('fs');

  /* MEASURED OFF HIS FILES FIRST, IN NODE, so the browser claims below are
     compared against the corpus itself rather than against numbers typed here. */
  const D = require(path.join(ROOT, 'engine/bohemia_deeds.js'));
  const BQDIR = path.join(ROOT, 'quests/bq');
  const files = fs2.readdirSync(BQDIR).filter(f => f.endsWith('.bq'));
  let corpusRows = [];
  for (const f of files) {
    try { corpusRows = corpusRows.concat(
      D.scanQuest(fs2.readFileSync(path.join(BQDIR, f), 'utf8'), f.replace(/\.bq$/, ''))); }
    catch (_e) {}
  }
  const corpusMax = Math.max(...corpusRows.map(r => Math.abs(r.delta)));
  const graph = JSON.parse(fs2.readFileSync(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'), 'utf8'));
  const ids = Object.keys(graph.factions || {});
  const exact = new Set(ids);
  const strictHits = corpusRows.filter(r => exact.has(r.faction)).length;
  const foldHits = corpusRows.filter(r => ids.some(i => i.toUpperCase() === r.faction.toUpperCase())).length;

  ok('R1 HIS CORPUS IS READ FROM HIS FILES, not from a number typed in this gate',
    corpusRows.length > 0, corpusRows.length + ' deltas across ' + files.length + ' quests');

  ok('R2 *** EVERY FACTION HE NAMES IS A REAL FACTION. *** The case fix below '
    + 'rescues his spelling, and this is the claim that keeps it a MATCHER fix '
    + 'and not a licence to invent: if a quest ever names an outfit that does '
    + 'not exist, that is content and it must fail here rather than be folded '
    + 'quietly into something that does',
    foldHits === corpusRows.length,
    'match after fold ' + foldHits + '/' + corpusRows.length);

  ok('R3 AND A STRICT COMPARE WOULD HAVE DROPPED MOST OF THEM ON THE FLOOR. He '
    + 'writes `faction TRADES +8`; the canon id is `Trades`. publish() used === '
    + 'so the witness predicate answered false for every person alive, and it '
    + 'returned witnesses:0 -- indistinguishable from nobody being there',
    strictHits < foldHits,
    strictHits + ' of ' + corpusRows.length + ' matched before the fix, '
      + (foldHits - strictHits) + ' were silently lost');

  ok('R4 the fold is in the ENGINE, so every surface gets it, not a patch on a copy',
    typeof D.sameFaction === 'function'
      && D.sameFaction('TRADES', 'Trades') === true
      && D.sameFaction('TRADES', 'Reds') === false);

  const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  const errs = [], warns = [];
  page.on('console', m => { if (/BOHEMIA:/.test(m.text())) warns.push(m.text()); });
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  try {
    await page.goto('file://' + ALPHA);
    await SETTLE(page, 10000);
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('[data-tab],.tab,button')]
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await SETTLE(page, 12000);
    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof DQ !== 'undefined'
                                    && typeof BohemiaDeeds !== 'undefined')) { city = f; break; } }
      catch (_e) {}
    }
    ok('R5 the walked world carries the quest runtime AND the deeds organ', !!city);
    if (!city) return;

    const T = await city.evaluate(() => {
      const out = {};
      out.corpusKeys = Object.keys(DEMO_BQ).length;
      out.rowsLoaded = CT_DEED_ROWS;
      out.weightRows = Object.keys(BohemiaStanding.DEED_WEIGHT).length;
      let maxAbs = 0;
      const src = [];
      for (const k in DEMO_BQ) src.push({ id: k, src: DEMO_BQ[k] });
      for (const r of BohemiaDeeds.loadCorpus(src).deeds) maxAbs = Math.max(maxAbs, Math.abs(r.delta));
      out.maxAbs = maxAbs;
      out.sampleWeights = Object.keys(BohemiaStanding.DEED_WEIGHT).slice(0, 3)
        .map(k => k + '=' + BohemiaStanding.DEED_WEIGHT[k].toFixed(2));
      out.allTraceable = Object.keys(BohemiaStanding.DEED_WEIGHT)
        .every(k => /^q:[A-Za-z0-9_]+:\d+@[A-Za-z_]+$/.test(k));
      return out;
    });

    ok('R6 *** HIS OWN FILES FILL HIS OWN TABLE, ON THE SURFACE HE WALKS. *** '
      + 'bohemia_standing.js ships DEED_WEIGHT EMPTY and its gate asserts that; '
      + 'loadCorpus is the only thing in the codebase that puts a row in it, and '
      + 'until 8/28 nothing on a reachable surface called it, so every opinion in '
      + 'a game about factions weighed exactly zero',
      T.rowsLoaded > 0 && T.weightRows === T.rowsLoaded && T.weightRows === corpusRows.length,
      'rows=' + T.rowsLoaded + ' table=' + T.weightRows + ' corpus=' + corpusRows.length);

    ok('R7 AND NOT ONE OF THOSE ROWS WAS TYPED BY ME. Every key is '
      + 'q:<quest>:<stage>@<FACTION>, which only the scan of his .bq files can '
      + 'produce. MECHANISM-MINE / CONTENTS-PAOLO\'S kept by construction',
      T.allTraceable === true, T.sampleWeights.join('  '));

    ok('R8 THE WHOLE CORPUS IS LOADED, NOT THE FIVE THE DEMO PLAYS, and that is a '
      + 'correctness claim rather than a completeness one: loadCorpus normalises '
      + 'every weight by the LARGEST deed in whatever it is given, so the five '
      + 'that used to be inlined (max 12) would have inflated every weight in the '
      + 'game by 20/12 and moved every rung boundary with it',
      T.corpusKeys === files.length && T.maxAbs === corpusMax,
      'inlined=' + T.corpusKeys + '/' + files.length + ' max=' + T.maxAbs + ' corpus=' + corpusMax);

    /* ---- NOW PLAY ONE, AND SEE WHETHER ANYBODY NOTICES ------------------ */
    /* THE DAY HAS TO BE STARTED FIRST, and the first cut of this did not do it:
       the day card blocks the sim, so nothing rendered, ctWitnessPass never ran,
       and it measured minds=0 -- a world with no people in it, which would have
       failed or passed for reasons that have nothing to do with the feature.
       Same family as the ghost-town trap city_barks_gate names. */
    await city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo'); if (g) g.click();
    });
    await SETTLE(page, 800);
    await city.evaluate(() => { try { offerAccept(); } catch (_e) {} });
    await SETTLE(page, 1000);

    const P = await city.evaluate(() => {
      const out = {};
      const spec = DQ.specForDay(1);
      out.spec = spec ? spec.id : null;
      if (!spec) return out;
      const rows = BohemiaDeeds.scanQuest(DEMO_BQ[spec.file], spec.id);
      out.stageRows = rows.map(r => ({ stage: r.stage, faction: r.faction, delta: r.delta, clout: r.clout }));
      const pick = rows[0]; if (!pick) return out;
      out.pick = pick;

      /* AND YOU HAVE TO GO WHERE THEY ARE. The spawn has 837 people inside six
         cells and NOT ONE of them is affiliated -- the nearest base is
         twenty-nine cells out. Standing at the spawn and publishing a Trades
         deed measures the placement gap, not the bridge. */
      let placed = false;
      const bases = ctBases() || {};
      for (const [k, bse] of Object.entries(bases)) {
        if (String(k).toUpperCase() !== String(pick.faction).toUpperCase()) continue;
        hx = bse.x * FN + 2; hy = bse.y * FN + 2;
        for (const per of ctEveryone()) {
          const f = ctFactionOf(per);
          if (f && String(f).toUpperCase() === String(k).toUpperCase()) {
            const at = ctAt(per); hx = at[0] + 1; hy = at[1]; placed = true; break;
          }
        }
        if (placed) { out.baseFaction = k; break; }
      }
      out.placed = placed;

      const m0 = ctMinuteNow();
      for (let i = 0; i < 30 && ctMinuteNow() === m0; i++) {
        try { stepOnce(i % 2 ? 6 : 2); } catch (_e) {}
        try { renderHuman(); } catch (_e) {}
      }
      out.minutesMoved = ctMinuteNow() !== m0;
      out.minds = Object.keys(CT_MINDS).length;
      out.fidsHeld = {};
      for (const k in CT_MINDS) { const f = CT_MINDS[k].fid; if (f) out.fidsHeld[f] = (out.fidsHeld[f] || 0) + 1; }
      /* the view is asked with the CITY's id, which is the spelling the minds
         carry; the quest writes its own. That gap is the bug R3 measures. */
      out.cityFid = out.baseFaction || pick.faction;
      out.before = ctTheirView(out.cityFid);

      DQ.openDay(1);
      window.__QUEST_DEEDS = 0; window.__QUEST_WITNESSES = 0;
      out.pub = DQ._witness ? DQ._witness(pick.stage) : null;
      out.deeds = window.__QUEST_DEEDS; out.wit = window.__QUEST_WITNESSES;
      out.after = ctTheirView(out.cityFid);
      out.why = ctWhyTheyThinkThat(out.cityFid, 3);

      out.again = DQ._witness(pick.stage);
      out.deedsAfterRepeat = window.__QUEST_DEEDS;
      return out;
    });

    ok('R9 day one of the demo is a real quest of his with real faction deltas on it',
      !!P.spec && P.stageRows && P.stageRows.length > 0,
      P.spec + ' ' + JSON.stringify((P.stageRows || []).slice(0, 3)));

    ok('R10 *** A RESOLVED STAGE IS PUT INTO THE HEADS OF THE PEOPLE STANDING '
      + 'THERE. *** This is the call that did not exist: publishStage was reached '
      + 'by NOTHING ANYWHERE, so his authored consequence moved a number in a '
      + 'ledger nobody could see',
      P.pub && P.pub.rows && P.pub.rows.length > 0,
      JSON.stringify(P.pub && P.pub.rows ? P.pub.rows[0] : null));

    ok('R11 AND SOMEBODY ACTUALLY SAW IT. witnesses:0 is the answer that used to '
      + 'be indistinguishable from the bug, so it is the number this claim is on',
      P.wit > 0, 'witnesses=' + P.wit + ' minds=' + P.minds + ' placed=' + P.placed
        + ' held=' + JSON.stringify(P.fidsHeld) + ' quest says ' + (P.pick||{}).faction);

    ok('R12 *** SO THE OUTFIT\'S VIEW OF YOU MOVED, ON THE SURFACE HE OPENS. *** '
      + 'The card and the OUTFIT board read standingOf, which reads the minds '
      + 'this just wrote into. A quest consequence he wrote is now something a '
      + 'stranger in the street can tell you about',
      P.before && P.after && P.after.whoSaw > P.before.whoSaw,
      'before ' + JSON.stringify(P.before) + ' after ' + JSON.stringify(P.after));

    ok('R13 AND IT SAYS WHY, IN THE QUEST\'S OWN @LOG LINE. becauseOf returns deed '
      + 'kinds, which are machine ids; the label is his sentence, already written',
      P.why && P.why.length > 0, JSON.stringify((P.why || [])[0] || null));

    ok('R14 *** THE SAME RESOLUTION CANNOT BE WITNESSED TWICE. *** A chosen @OPT '
      + 'can carry `@DO set_stage 20`, which runs the stage through the canonical '
      + 'Runtime.setStage before the UI asks what happened, so _toStage and spoke '
      + 'BOTH have to publish and idempotence is the only way both can be correct. '
      + 'Without it every faction move doubles, invisibly',
      P.again === null && P.deedsAfterRepeat === P.deeds,
      'first=' + P.deeds + ' after repeat=' + P.deedsAfterRepeat);

    ok('R15 NOTHING THREW AND NOTHING WAS SWALLOWED',
      errs.length === 0 && warns.filter(w => /never witnessed|did not load/.test(w)).length === 0,
      JSON.stringify(errs.slice(0, 2)) + JSON.stringify(warns.slice(0, 2)));

  } finally { await browser.close(); }
}

async function onTheirView() {
  console.log('\nQ. A FACTION\'S VIEW IS ITS MEMBERS\' VIEWS -- RULE 4, FINALLY CALLED.');
  const { chromium } = requirePlaywright();
  const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));

  /* ***  THE ALPHA, NOT THE STANDALONE CITY, AND THE REASON IS THE WHOLE CLAIM. ***
     Every browser pass above boots slices/BOHEMIA_CITY_WORLD.html directly, which
     is correct for them: they ask functions questions. This pass asks whether a
     RENDER PASS stamps a mind, and that page has no PLAYER_CV -- the character
     bake is POSTED IN from the alpha -- so peoplePass returns before drawing
     anybody, BARK_DREW stays empty, no mind is ever created and every claim below
     would pass or fail for a reason that has nothing to do with the feature.
     gates/city_barks_gate.js names this exact trap: "a probe there measures a
     ghost town that does not exist." Measured here before writing a line of it:
     drew=0, minds=0, stamped=0 on the standalone page with the code working. */
  const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  const warns = [], errs = [];
  page.on('console', m => { if (/BOHEMIA:/.test(m.text())) warns.push(m.text()); });
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto('file://' + ALPHA);
    await SETTLE(page, 10000);
    /* the city frame is LAZY: every frame is about:blank until RUN is opened */
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('[data-tab],.tab,button')]
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await SETTLE(page, 12000);
    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof pplPeople !== 'undefined'
                                     && typeof ctMind !== 'undefined')) { city = f; break; } }
      catch (_e) {}
    }
    ok('Q1 the walked world is reached through the one link', !!city);
    if (!city) return;
    /* Q2 IS SAMPLED INSIDE THE MEASUREMENT, NOT HERE. The bake is POSTED IN
       across the frame boundary, so it arrives some time after the frame itself
       resolves -- asserting it the instant the frame is found reads false while
       the feature is fine, and the first cut of this pass did exactly that and
       went red beside a Q4 that had already proved a mind was stamped. A claim
       about a precondition has to be read at the moment the precondition is
       used. It is checked in R below, as out.bake. */

    await city.evaluate(() => { const g = document.querySelector('#daycardIn .dcgo'); if (g) g.click(); });
    await SETTLE(page, 600);
    await city.evaluate(() => { try { offerAccept(); } catch (_e) {} });
    await SETTLE(page, 900);

    const R = await city.evaluate(() => {
      const out = {};
      const ctCardText = () => [...document.querySelectorAll('.r')]
        .map(r => {
          const k = r.querySelector('.k'), v = r.querySelector('.v');
          return (k ? k.textContent : '') + ' :: ' + (v ? v.textContent : '');
        }).join('\n');
      /* stand beside somebody who runs with somebody */
      const bases = ctBases() || {};
      let target = null;
      for (const bse of Object.values(bases)) {
        hx = bse.x * FN + 2; hy = bse.y * FN + 2;
        for (const p of ctEveryone()) {
          const f = ctFactionOf(p);
          if (f) { target = { fid: f, id: String(p.id) }; const at = ctAt(p); hx = at[0] + 1; hy = at[1]; break; }
        }
        if (target) break;
      }
      if (!target) return { err: 'nobody affiliated anywhere near a base' };
      out.target = target;
      out.bake = !!PLAYER_CV;      /* read where it is USED, not on frame resolve */

      /* WALK. The witness pass runs once per GAME minute and this world is
         I-MOVE-YOU-MOVE, so standing still never advances the clock and never
         re-runs it. Forcing CT_SAW_MIN open would be measuring the poke. */
      const m0 = ctMinuteNow();
      for (let i = 0; i < 24 && ctMinuteNow() === m0; i++) {
        try { stepOnce(i % 2 ? 6 : 2); } catch (_e) {}
        try { renderHuman(); } catch (_e) {}
      }
      out.minuteMoved = ctMinuteNow() !== m0;
      out.stampedAny = Object.values(CT_MINDS).filter(m => m && m.fid).length;

      /* --- WITH HIS TABLE EMPTY: THE SHIPPING DEFAULT --- */
      out.ruledBefore = ctDeedsRuled();

      /* *** OPEN THE CARD THE WAY A PLAYER DOES, AND USE WHOEVER ACTUALLY
         OPENS. *** Teleporting beside somebody and calling ctOpen() does NOT
         guarantee their card: ctSawCell picks who is in the cell you are
         reading, and the first cut of this pass asserted against a target it
         had chosen itself while the card on screen was a passer-by with no
         outfit at all -- six rows, none of them RUNS WITH. The claim is about
         WHAT IS ON THE CARD, so the card decides who the subject is. */
      let openFid = null;
      const around = [[1,0],[-1,0],[0,1],[0,-1]];
      outer:
      for (const p of ctEveryone()) {
        if (!ctFactionOf(p)) continue;
        const at = ctAt(p);
        for (const d of around) {
          hx = at[0] + d[0]; hy = at[1] + d[1];
          try { ctSawCell(); ctOpen(); } catch (_e) { continue; }
          const f = (typeof CT_OPEN !== 'undefined' && CT_OPEN) ? ctFactionOf(CT_OPEN) : null;
          if (f) { openFid = f; break outer; }
        }
      }
      out.openFid = openFid;
      if (!openFid) return { err: 'no affiliated person could be opened' };
      target.fid = openFid;
      out.viewEmpty = ctTheirView(target.fid);
      /* THE CARD IS READ OFF ITS OWN ROWS, and this reader took two goes to get
         right. First it read #card, which does not exist. Then #ctcard.innerText,
         which returns '' whenever the element is not being rendered -- innerText
         is defined in terms of LAYOUT, so a hidden node answers empty and the
         claim fails while the feature works. Both times the view object printed
         beside the failure already said HOSTILE. textContent over the row divs
         is what the surface actually holds. */
      out.cardEmpty = ctCardText();
      out.cardRows = document.querySelectorAll('.r').length;
      out.cardOpen = !!(typeof CT_OPEN !== 'undefined' && CT_OPEN);
      ctOutfitOpen(); out.boardEmpty = document.getElementById('outfitpanel').innerText || ''; ctOutfitClose();

      /* --- HE TURNS THE DIAL AND ONE OF THEIRS WATCHES YOU --- */
      out.applied = ctDialApply({ 'claim:refused': -4 }, false);
      const now = ctMinuteNow();
      for (const k in CT_MINDS) {
        const m = CT_MINDS[k]; if (!m || m.fid !== target.fid) continue;
        m.deeds = m.deeds || [];
        m.deeds.push({ actor: '@', kind: 'claim:refused', turn: now, x: hx, y: hy, hops: 0, fid: target.fid });
      }
      out.viewRuled = ctTheirView(target.fid);
      out.why = ctWhyTheyThinkThat(target.fid, 3);
      ctClose(); ctOpen();          /* same subject, redrawn with his ruling in */
      out.cardRuled = ctCardText();
      ctOutfitOpen(); out.boardRuled = document.getElementById('outfitpanel').innerText || ''; ctOutfitClose();

      /* --- AN OUTFIT YOU HAVE BEEN GIVING TO AND NEVER MET --- */
      const sv = ctBelongSave();
      const other = Object.keys(BohemiaBelonging.RULES || {}).find(k => k !== target.fid);
      sv.meta.gave = sv.meta.gave || {}; sv.meta.gave[other] = 6;
      out.other = other;
      out.viewUnseen = ctTheirView(other);
      ctOutfitOpen(); out.boardUnseen = document.getElementById('outfitpanel').innerText || ''; ctOutfitClose();

      /* --- AN OUTFIT YOU HAVE NEITHER MET NOR TOUCHED IS NOT NEWS --- */
      const third = Object.keys(BohemiaBelonging.RULES || {})
        .find(k => k !== target.fid && k !== other);
      out.third = third;
      out.thirdListed = third
        ? new RegExp(String(third).toUpperCase() + '\\s*(HAS NEVER|\\d+ OF THEIR)')
            .test(out.boardUnseen) : null;
      return out;
    });

    if (R.err) { ok('Q3 there is somebody affiliated to stand next to', false, R.err); return; }

    ok('Q2 the character bake reached the world frame -- without it peoplePass '
      + 'draws nobody, no mind exists, and every claim below is about a ghost town',
      R.bake === true);

    ok('Q3 the clock actually advanced -- the witness pass is once per GAME minute '
      + 'and this world only moves when you do',
      R.minuteMoved === true);

    ok('Q4 THE OUTFIT IS STAMPED ON THE MIND BY THE REAL RENDER PATH. standingOf '
      + 'asks factionOfOwner(id) and ctFactionOf takes a PERSON; ctWitnessPass is '
      + 'the one place holding both, so if the stamp is not landing there the '
      + 'faction can never have a view of anybody',
      R.stampedAny > 0, 'stamped=' + R.stampedAny);

    ok('Q5 standingOf IS CALLED FROM THE WALKED SURFACE. Rule 4 of '
      + 'bohemia_standing.js, and organ_reach reported it reached by NOTHING '
      + 'ANYWHERE -- not the page, not another module, not even a gate',
      !!R.viewEmpty && R.viewEmpty.members > 0,
      JSON.stringify(R.viewEmpty));

    /* THIS CLAIM WAS REWRITTEN ON 8/28 BECAUSE THE DESIGN MOVED UNDER IT, and
       that is worth saying plainly rather than quietly editing. It used to read
       "with his table EMPTY it never prints a rung", and it was enforcing
       MECHANISM-MINE / CONTENTS-PAOLO'S: do not invent a judgement he has not
       made. That principle is untouched. What changed is where his judgement
       comes from -- DEED_WEIGHT is no longer empty on the walked surface,
       because his own 82 authored `faction NAME +N` lines now fill it from
       quests/bq at boot. The table being empty was never the point; the point
       is that NOBODY IS JUDGED FOR SOMETHING NOBODY SAW. So the emptiness this
       claim is on is now the one that actually means something: an outfit whose
       people have witnessed nothing about you shows NO RUNG, however full the
       weight table is. A gate that had been left asserting the old shape would
       have gone red for the right reason and been "fixed" by loosening it. */
    ok('Q6 AN OUTFIT THAT HAS WITNESSED NOTHING IS NOT JUDGED. rungFor(0) '
      + 'answers NEUTRAL, which reads as "they took your measure and shrugged" '
      + 'when the truth is that not one of them has seen you do anything. No '
      + 'rung on the card, no rung on the board, whatever his weights say',
      R.viewEmpty.whoSaw === 0 && R.viewEmpty.rung === null
        && !/WHAT THE .* THINKS/.test(R.cardEmpty)
        && !/NEUTRAL/.test(R.boardEmpty));

    ok('Q7 BUT THE HEADCOUNT IS TRUE TODAY AND IT IS ON THE CARD. A mind exists '
      + 'only for somebody you have been near, so members counts the people in '
      + 'that outfit who have been where you have been -- and a headcount needs '
      + 'no ruling from anybody',
      /HAS SEEN YOU/.test(R.cardEmpty) && /OF ITS PEOPLE/.test(R.cardEmpty),
      'card=' + JSON.stringify(String(R.cardEmpty).slice(0, 300)));

    ok('Q8 AND ON THE BOARD, which is where he goes to look rather than being '
      + 'interrupted', /WHO HAS LAID EYES ON YOU/.test(R.boardEmpty));

    ok('Q9 THE MOMENT HE RULES, THE SAME ROWS CARRY THE RUNG. His dial is the '
      + 'only thing that fills DEED_WEIGHT and it needed no further wiring',
      R.applied > 0 && R.viewRuled.rung && R.viewRuled.whoSaw > 0
        && /WHAT THE \w+ THINKS/.test(R.cardRuled),
      JSON.stringify(R.viewRuled));

    ok('Q10 becauseOf IS CALLED TOO, AND IT SAYS WHY IN THE WORDS ALREADY '
      + 'WRITTEN. CT_DEED_WORDS holds a draft line per kind in both voices and '
      + 'the organ already knows which of the two a memory is',
      R.why.length > 0 && /watched you/.test(R.why[0].say)
        && /Somebody in the/.test(R.cardRuled),
      JSON.stringify(R.why[0] || null));

    ok('Q11 EYEWITNESS, NOT HEARSAY, WHEN THEY WATCHED IT THEMSELVES',
      R.why[0] && R.why[0].heard === false);

    ok('Q12 *** AN OUTFIT YOU HAVE BEEN GIVING TO WHOSE PEOPLE HAVE NEVER SEEN '
      + 'YOU SAYS SO. *** True for every outfit in this valley at the spawn -- '
      + 'the nearest base is twenty-nine cells -- and no surface in the game had '
      + 'ever said it out loud. Needs no dial, no placement and no ruling',
      R.viewUnseen && R.viewUnseen.members === 0
        && new RegExp(String(R.other).toUpperCase() + '\\s*HAS NEVER LAID EYES ON YOU')
             .test(R.boardUnseen),
      JSON.stringify((R.boardUnseen || '').match(/WHO HAS LAID EYES ON YOU[\s\S]{0,110}/)));

    ok('Q13 AND AN OUTFIT YOU HAVE NEITHER MET NOR TOUCHED IS NOT NEWS. Bounded '
      + 'by what you have actually done, so the board never becomes a wall of '
      + 'fourteen zeroes',
      R.third ? R.thirdListed === false : true, 'third=' + R.third);

    ok('Q14 NOTHING WAS SWALLOWED AND NOTHING THREW',
      warns.filter(w => /threw/.test(w)).length === 0 && errs.length === 0,
      JSON.stringify(warns.slice(0, 2)) + JSON.stringify(errs.slice(0, 2)));

  } finally { await browser.close(); }
}

onTheCard()
  .then(onTheBoard)
  .then(onTheValley)
  .then(onWhyWalk)
  .then(onTheGround)
  .then(onTheVouch)
  .then(onYourProblem)
  .then(onTheirView)
  .then(onQuestDeeds)
  .catch(e => { fail++; console.log('  FAIL browser part threw: ' + e.message); })
  .then(() => {
    console.log('\nFACTION BETWEEN GATE: ' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail ? 1 : 0);
  });
