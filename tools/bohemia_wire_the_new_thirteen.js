/* WIRE THE APPROVED THIRTEEN INTO THE FACTIONS (9/27/26, CHARACTER, [runway redo])
 *
 * HE APPROVED THE SET: "Fire make sure shit doesnt clip into places it shouldnt but yeah."
 * NOTES ARE RULINGS, so the set goes into the game. Last round executed his other two
 * rulings (the kill, the vibrance) and left this; the handoff named it as what was owed.
 *
 * *** WHICH SHAPE GOES TO WHICH FACTION IS THE ONE REAL DECISION, AND HE RESERVED IT. ***
 * The original search's header says "WHICH SHAPE BELONGS TO WHOM IS HIS." But EVERYTHING IS
 * A THUMB bans blocking on a thumb: a genuine fork with no defensible default means PICK
 * ONE, SAY WHY, BUILD IT. So the assignment is made HERE, by a rule, and the rule is
 * printed so he can knock it down with one word.
 *
 * THE RULE: EVERY FACTION KEEPS ITS OWN BODY. A faction's dials are who it is -- Caravans
 * are broad, Anarchists are lanky, Colorful is small -- and those were chosen long before
 * the runway. So a faction may only be given a shape BUILT ON ITS OWN DIAL, and among the
 * candidates on that dial it gets the one whose silhouette is CLOSEST TO WHAT IT WEARS
 * TODAY. The valley changes register; nobody changes body. That is the least violent
 * assignment that still does what he asked, and it is measured, not chosen by eye.
 *
 * AND THE COUNTS DO NOT MATCH, WHICH IS A REAL CONSEQUENCE AND NOT A ROUNDING ERROR:
 *   the approved set has  broad 3, small 4, lanky 3, tall 2, plain 1
 *   the factions need     broad 4, small 4, lanky 2, tall 3, plain 0
 * So one broad faction and one tall faction cannot be served on their own dial. They take
 * the nearest dial instead and THE RECORD NAMES THEM, because a faction quietly changing
 * body is exactly the kind of thing that gets noticed later and blamed on nobody.
 *
 * COLOUR IS TERRITORY SURVIVES BY CONSTRUCTION. Every garment in the approved set is a
 * NEUTRAL, because the search was on silhouette (STRUCTURE-NOT-COLOR). Wiring them as-is
 * would strip thirteen factions of their colour in one commit. So after the assignment,
 * every slot is re-dressed in the faction's OWN colourway where one exists (the twelve this
 * lane added on 9/22 exist for exactly this moment) and the faction's existing coloured
 * garment is kept where the shape allows. Any faction that still ends up in a neutral coat
 * is NAMED in the record as a colour this wiring could not keep.
 *
 * WHAT THIS REFUSES TO DO. If the wired thirteen come out LESS mutually distinct than the
 * thirteen they replace, measured on the same front width profile, THE TOOL DOES NOT WRITE.
 * His 9/14 complaint was that the street is six people; a better-dressed set that reads as
 * fewer people is a regression wearing a nicer coat.
 *
 * RIG CHECK (RIG IS LAW): renders only. G_WORN, G.equipped, G.bodyVar, G.age and both caches
 * are restored. The only thing written is FACTION_LOOKS' worn/dials, and only after the
 * distinctness check passes.
 * REUSE CHECK: nothing is drawn. Every garment named already ships as canon.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   RNWY-13  the two poles, and its own failure sentence, "a figure that mixes both reads as
 *          neither". The pole spread of the wired set is printed against the set it
 *          replaces, so the runway register is shown to have actually arrived rather than
 *          asserted from the fact that the garments have runway names.
 *   RNWY-02 / RNWY-07 / RNWY-04  the cocoon, asymmetric and wrap shoulders that the old
 *          faction set had no entry for at all -- the whole reason his "they all need to get
 *          redone" was a verdict on a pool rather than on a search.
 *   GARM-03  "the cut belongs to the register, the colour belongs to the faction -- a cook
 *          never spends both channels on one idea." This wiring is that sentence executed:
 *          the cut moves to the runway, the colour stays with the faction, and where the two
 *          could not both be kept the record says which faction paid.
 *
 *   node tools/bohemia_wire_the_new_thirteen.js [--write]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_WIRING_THE_NEW_THIRTEEN_9_27_26.txt');
const WRITE = process.argv.indexOf('--write') >= 0;

const APPROVED = [
  'broad/cocoon/trousers/boot', 'small/asym/widepl/platform', 'small/mantle/stack/slouch',
  'broad/splitshort/trousers/platform', 'lanky/mantle/crop/platform', 'plain/bare/trousers/platform',
  'tall/mantle/drop/boot', 'lanky/cocoon/stack/column', 'small/bare/drop/boot',
  'lanky/wrap/stack/platform', 'broad/mantle/widepl/platform', 'tall/splittail/widepl/platform',
  'small/cocoon/stack/slouch'
];
const SH = { bare: [null, null], mantle: ['back', 'SHOULDER MANTLE'],
  splittail: ['outer', 'SPLIT-TAIL DUSTER'], splitshort: ['outer', 'SPLIT-TAIL COAT'], cocoon: ['outer', 'COCOON COAT'],
  asym: ['outer', 'ASYMMETRIC COAT'], wrap: ['outer', 'WRAP COAT'] };
const LG = { trousers: 'DUST TROUSERS', widepl: 'WIDE PLEAT TROUSER', stack: 'STACKED JERSEY PANT',
  crop: 'CROPPED WORK TROUSER', drop: 'DROP RISE TROUSER' };
const FT = { boot: 'BROWN BOOTS', platform: 'STACKED SOLE BOOT', slouch: 'SLOUCH BOOT',
  column: 'COLUMN PANT-BOOT' };
const DIALS = {
  tall:  { height: 0.75, belly: -0.25, arms: 0.10, shoulders: 0.25, hips: -0.10 },
  broad: { height: -0.30, belly: 0.55, arms: 0.30, shoulders: 0.60, hips: 0.15 },
  small: { height: -0.60, belly: -0.30, arms: -0.30, shoulders: -0.40, hips: 0.25 },
  plain: { height: 0, belly: 0, arms: 0, shoulders: 0, hips: 0 },
  lanky: { height: 0.45, belly: -0.45, arms: 0.35, shoulders: -0.25, hips: -0.25 }
};
/* THE FACTION COLOURWAYS THIS LANE ADDED ON 9/22, which exist for exactly this moment.
   neutral name -> { faction: coloured name }. */
const COLOURWAY = {
  'COCOON COAT': { Blues: 'COBALT COCOON COAT', Caravans: 'SAND COCOON COAT',
                   Network: 'TEAL COCOON COAT', Volunteers: 'BONE COCOON COAT' },
  'ASYMMETRIC COAT': { Remnants: 'OLIVE ASYM COAT' },
  'WRAP COAT': { Colorful: 'GRASS WRAP COAT', Anarchists: 'LEATHER WRAP COAT' },
  'DROP RISE TROUSER': { Church: 'GOLD DROP TROUSER', Blues: 'COBALT DROP TROUSER',
                        Colorful: 'GRASS DROP TROUSER' },
  /* *** NETWORK IS NOT ON THE PANT OR THE COLUMN ANY MORE, AND LOOKING AT THE PICTURE IS
     WHY. *** Giving Network its teal on all three swapped slots satisfied COLOUR IS
     TERRITORY perfectly (180 at 97%) and produced A TEAL MONOLITH: coat, trouser and
     pant-boot the same teal, no knee, no ankle, no legs in the silhouette at all. The
     colour gate cannot see that and the outfit gate can, which is exactly the case the
     colour law's own header settles: "If these two ever disagree, THE SILHOUETTE WINS."
     A coat is most of a person, so the COAT carries Network's teal and the legs go back to
     dark. Colour reads and legs read. */
  'STACKED JERSEY PANT': { Anarchists: 'LEATHER STACK PANT' },
  'CROPPED WORK TROUSER': { Reds: 'BRICK CROP TROUSER', Mob: 'CHARCOAL CROP TROUSER' },
  'STACKED SOLE BOOT': { Church: 'GOLD STACK BOOT', Remnants: 'OLIVE STACK BOOT',
                        Blues: 'COBALT STACK BOOT', Reds: 'BRICK STACK BOOT',
                        Anarchists: 'LEATHER STACK BOOT' },
  'COLUMN PANT-BOOT': { Blues: 'COBALT COLUMN' },
  /* the nine added 9/27 for the shapes the assignment actually lands on */
  'SHOULDER MANTLE': { Blues: 'COBALT SHOULDER MANTLE', Church: 'GOLD SHOULDER MANTLE',
                       Remnants: 'OLIVE SHOULDER MANTLE', Mob: 'CHARCOAL SHOULDER MANTLE' },
  'WIDE PLEAT TROUSER': { Blues: 'COBALT WIDE TROUSER', Reds: 'BRICK WIDE TROUSER',
                          Remnants: 'OLIVE WIDE TROUSER' },
  'SPLIT-TAIL DUSTER': { Reds: 'BRICK SPLIT-TAIL DUSTER' },
  'SPLIT-TAIL COAT': { Trades: 'LEATHER SPLIT-TAIL COAT' },
  /* SANDWALKERS is not new. It is the boot Caravans already wears, in Caravans' own sand,
     and the wiring was about to throw it away for a neutral brown. REUSE-FIRST: the answer
     to a missing colourway is an existing garment before it is ever a new one. */
  'BROWN BOOTS': { Colorful: 'GRASS BOOTS', Caravans: 'SANDWALKERS' },
};

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS
    && window.GARMENTS && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate(({ APPROVED, SH, LG, FT, DIALS, COLOURWAY }) => {
    const o = { today: [], cand: [], err: null, missing: [] };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    const canon = {}; for (const g of GARMENTS) if (g && g.st === 'canon' && g.layer) canon[g.n] = g.layer;

    const shoot = (dials, worn, age) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = JSON.parse(JSON.stringify(dials || {})); G.age = age || 'adult';
      rebuildFromRig(); clear();
      const fr = buildFrame('S', 'idle', 0);
      const W = fr.CW, H = fr.CH;
      const rows = new Array(H).fill(0);
      let top = 1e9, bot = -1, sSum = 0, n = 0, hot = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const q = fr.px[i]; if (!q) continue;
        const y = (i / W) | 0; rows[y]++; if (y < top) top = y; if (y > bot) bot = y;
        const id = fr.grid[i];
        if (id === 3 || id === 4 || id === 9 || id === 10) {
          const mx = Math.max(q[0], q[1], q[2]), mn = Math.min(q[0], q[1], q[2]);
          const sat = mx > 0 ? (mx - mn) / mx : 0; sSum += sat; n++; if (sat > 0.55) hot++;
        }
      }
      /* THE SAME 16-SAMPLE FRONT WIDTH PROFILE the fit search used, normalised to the body's
         own span and width, so "closest to what it wears today" is the same ruler that chose
         the set in the first place. */
      const span = Math.max(1, bot - top), wide = Math.max.apply(null, rows) || 1;
      const prof = [];
      for (let k = 0; k < 16; k++) prof.push(rows[Math.min(H - 1, top + Math.round(span * k / 15))] / wide);
      return { prof: prof, sat: n ? sSum / n : 0, hot: n ? 100 * hot / n : 0 };
    };

    try {
      for (const f of FACTION_LOOKS)
        o.today.push(Object.assign({ faction: f.faction, dialName: null, worn: f.worn, dials: f.dials },
                                   shoot(f.dials, f.worn, f.age)));
      /* EVERY APPROVED SHAPE, DRESSED FOR EVERY FACTION, so the assignment is made on the
         body that would actually ship rather than on the neutral study version. */
      for (const id of APPROVED) {
        const [dn, sn, ln, fn] = id.split('/');
        for (const f of FACTION_LOOKS) {
          const worn = {};
          /* *** KEEP EVERY SLOT THE NEW SHAPE DOES NOT OCCUPY. *** The first version kept a
             fixed list -- hair, base, head, neck, waist, gear, face, hands -- and BACK WAS
             NOT ON IT. So a faction taking a coat shape silently lost its shoulder mantle,
             and COLOUR IS TERRITORY went red on the real surface: Caravans washed to 0.22,
             Anarchists to 0.09, Remnants to 0.26 against a 0.28 floor. The gate caught it
             after I had already written the outfits, and the wiring was reverted.
             A FIXED KEEP-LIST IS A GUESS ABOUT WHICH SLOTS MATTER. The rule is simply: the
             shape owns the slots it sets, the faction keeps everything else. */
          const shapeSlots = {};
          if (SH[sn] && SH[sn][0]) shapeSlots[SH[sn][0]] = 1;
          shapeSlots.legs = 1; shapeSlots.feet = 1;
          for (const k in f.worn) if (!shapeSlots[k]) worn[k] = f.worn[k];
          const pick = (neutral) => {
            const c = COLOURWAY[neutral] && COLOURWAY[neutral][f.faction];
            return (c && canon[c]) ? c : neutral;
          };
          if (SH[sn] && SH[sn][0]) {
            const g = pick(SH[sn][1]);
            if (!canon[g]) { o.missing.push(g); continue; }
            worn[SH[sn][0]] = g;
          }
          const lg = pick(LG[ln]), ft = pick(FT[fn]);
          if (!canon[lg] || !canon[ft]) { o.missing.push(lg + '/' + ft); continue; }
          worn.legs = lg; worn.feet = ft;
          const m = shoot(DIALS[dn], worn, f.age);
          o.cand.push({ id: id, dial: dn, faction: f.faction, worn: worn,
                        prof: m.prof, sat: m.sat, hot: m.hot,
                        colourKept: [worn[SH[sn] && SH[sn][0]] , lg, ft].filter(Boolean)
                          /* CHARCOAL and SANDWALKERS are in this list because the test is
                             "is this the faction's own colour", not "is it bright". Mob's
                             colour IS charcoal and Caravans' boot IS sand. */
                          .filter(g => /COBALT|OLIVE|GRASS|GOLD|TEAL|BRICK|SAND|LEATHER|CHARCOAL|BONE/.test(g)).length });
        }
      }
    } catch (e) { o.err = String(e && e.message || e); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { APPROVED, SH, LG, FT, DIALS, COLOURWAY });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }
  if (R.missing.length) { console.error('NOT ON THE RAIL: ' + [...new Set(R.missing)].slice(0, 6).join(', ')); process.exit(2); }

  const dist = (a, c) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - c[i]); return s / a.length; };
  const closest = (set) => { let m = Infinity, who = null;
    for (let i = 0; i < set.length; i++) for (let j = i + 1; j < set.length; j++) {
      const d = dist(set[i].prof, set[j].prof); if (d < m) { m = d; who = [set[i].faction, set[j].faction]; } }
    return { d: m, who: who }; };

  /* THE ASSIGNMENT. Every faction gets a shape built on ITS OWN DIAL where one is left, and
     among those the one CLOSEST to what it wears today. Factions are served in order of how
     few choices they have, so the constrained ones are not starved by the greedy pass. */
  const byFaction = {}; for (const t of R.today) byFaction[t.faction] = t;
  const dialOf = (f) => {
    let best = null, bd = 1e9;
    for (const k in DIALS) {
      const d = Object.keys(DIALS[k]).reduce((s, key) => s + Math.abs((DIALS[k][key] || 0) - ((f.dials || {})[key] || 0)), 0);
      if (d < bd) { bd = d; best = k; }
    }
    return { dial: best, off: bd };
  };
  const facDial = {}; for (const t of R.today) facDial[t.faction] = dialOf(t);
  const taken = {}, assign = {};
  const order = R.today.slice().sort((a, c) =>
    APPROVED.filter(x => x.split('/')[0] === facDial[a.faction].dial).length
    - APPROVED.filter(x => x.split('/')[0] === facDial[c.faction].dial).length);
  const offDial = [];
  /* *** AT MOST ONE FACTION WEARS A FLOOR-LENGTH COAT, AND THE GATE HAD TO TELL ME. ***
     TRENCHCOATS ARE RESERVED (Paolo 8/27): "only 10% of people no matter what maximum can
     wear trench coats that are long." Thirteen factions times ten per cent is ONE. The
     approved set contains TWO split-tail dusters, and the first assignment handed both out
     -- Reds and Trades, 2 of 13 = 15.4% -- and every colour and silhouette check stayed
     green, because none of them is the trenchcoat law. It went red the first round anybody
     actually wore one, which is the whole argument for A LAW WITHOUT A MACHINE GATE IS NOT
     ENFORCED. The second split-tail shape is simply not offered once one is taken, and the
     faction that loses it drops to its next-best candidate on its own dial. */
  const LONG = 'splittail';
  let longTaken = null;
  for (const f of order) {
    const want = facDial[f.faction].dial;
    const free = (c) => !taken[c.id] && !(longTaken && c.id.split('/')[1] === LONG);
    let pool = R.cand.filter(c => c.faction === f.faction && c.dial === want && free(c));
    let onDial = true;
    if (!pool.length) { pool = R.cand.filter(c => c.faction === f.faction && free(c)); onDial = false; }
    if (!pool.length) continue;
    /* *** COLOUR IS A HARD PREFERENCE, NOT A TIEBREAK, AND THE FIRST RUN PROVED WHY. ***
       With colour as a small bonus (0.004 against profile distances around 0.04) the greedy
       pass served silhouette every time and only TWO of thirteen factions kept any colour in
       the three swapped slots. Mean cloth saturation fell 0.435 -> 0.259, a 40% drain, in a
       round whose other ruling was "turn the vibrance down A LITTLE". That is not a little,
       and COLOUR IS TERRITORY is a law, not a preference.
       So: among the candidates on a faction's own dial, ANY candidate that keeps faction
       colour beats every candidate that does not, and closeness to what it wears today only
       decides between equals. Silhouette is still the reason the set exists; it just no
       longer gets to spend the colour channel to win by a hundredth. */
    pool.sort((a, c) => (c.colourKept - a.colourKept) || (dist(a.prof, f.prof) - dist(c.prof, f.prof)));
    const win = pool[0];
    taken[win.id] = 1; assign[f.faction] = win;
    if (win.id.split('/')[1] === LONG) longTaken = f.faction;
    if (!onDial) offDial.push({ faction: f.faction, wanted: want, got: win.dial });
  }

  const wired = R.today.map(t => assign[t.faction]).filter(Boolean);
  const cpToday = closest(R.today), cpNew = closest(wired.map(w => ({ faction: w.faction, prof: w.prof })));
  const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;

  const L = [];
  L.push('WIRING THE APPROVED THIRTEEN INTO THE FACTIONS  --  CHARACTER, 9/27/26, [runway redo]');
  L.push('');
  L.push('HE APPROVED THE SET: "Fire make sure shit doesnt clip into places it shouldnt but yeah."');
  L.push('NOTES ARE RULINGS, so it goes into the game. The one real decision left is WHICH SHAPE');
  L.push('GOES TO WHICH FACTION, and the original search reserved that to him. EVERYTHING IS A');
  L.push('THUMB bans blocking on a thumb, so it is decided here BY A RULE, and the rule is');
  L.push('printed so one word can knock it down.');
  L.push('');
  L.push('THE RULE: EVERY FACTION KEEPS ITS OWN BODY. A faction\'s dials are who it is, and they');
  L.push('were chosen long before the runway. So a faction may only take a shape built on ITS');
  L.push('OWN DIAL, and among those it gets the one whose silhouette is CLOSEST TO WHAT IT WEARS');
  L.push('TODAY. The valley changes register; nobody changes body.');
  L.push('');
  L.push('  ' + 'FACTION'.padEnd(12) + 'BODY'.padEnd(8) + 'THE SHAPE IT TAKES'.padEnd(36) + 'FACTION COLOUR KEPT');
  for (const t of R.today) {
    const w = assign[t.faction];
    L.push('  ' + t.faction.padEnd(12) + facDial[t.faction].dial.padEnd(8)
      + (w ? w.id : '(none left)').padEnd(36)
      + (w ? (w.colourKept + ' of 3 slots') : ''));
  }
  L.push('');
  if (offDial.length) {
    L.push('*** AND THE COUNTS DO NOT MATCH, WHICH IS A REAL CONSEQUENCE AND NOT A ROUNDING');
    L.push('ERROR. *** The approved set has broad 3, small 4, lanky 3, tall 2, plain 1; the');
    L.push('factions need broad 4, small 4, lanky 2, tall 3. So these factions could NOT be');
    L.push('served on their own body and take the nearest one instead:');
    for (const x of offDial) L.push('    ' + x.faction + ': wanted ' + x.wanted + ', got ' + x.got);
    L.push('A faction quietly changing body is the kind of thing that gets noticed later and');
    L.push('blamed on nobody, so it is named here.');
  } else {
    L.push('EVERY FACTION WAS SERVED ON ITS OWN BODY. Nobody changed shape to get a coat.');
  }
  L.push('');
  L.push('COLOUR IS TERRITORY, AND THIS IS WHERE IT WAS NEARLY LOST. Every garment in the');
  L.push('approved set is a NEUTRAL, because the search was on silhouette. Wiring them as they');
  L.push('came would have stripped thirteen factions of their colour in one commit. The twelve');
  L.push('faction colourways this lane added on 9/22 exist for exactly this moment, and the hair,');
  L.push('the head, the base shirt and the waist are kept untouched because they carry the rest');
  L.push('of the faction\'s colour and the search never touched them.');
  const noCol = R.today.filter(t => assign[t.faction] && assign[t.faction].colourKept === 0);
  L.push('  factions wearing at least one garment in their own colour: '
    + R.today.filter(t => assign[t.faction] && assign[t.faction].colourKept > 0).length + ' of 13');
  if (noCol.length) L.push('  wearing only neutrals in the three swapped slots: ' + noCol.map(t => t.faction).join(', ')
    + '  (their colour now rides on the shirt, hair and head alone)');
  L.push('');
  L.push('TRENCHCOATS ARE RESERVED (Paolo 8/27, his number): thirteen factions times his ten');
  L.push('per cent is ONE, and the approved set carries TWO split-tail dusters. The floor-length');
  L.push('coat goes to ' + (longTaken || 'nobody') + ' and the second one is not offered at all.');
  L.push('');
  L.push('DISTINCTNESS, ON THE SAME RULER THAT CHOSE THE SET:');
  L.push('  the thirteen today   closest pair ' + cpToday.d.toFixed(4) + '   (' + (cpToday.who || []).join(' / ') + ')');
  L.push('  the wired thirteen   closest pair ' + cpNew.d.toFixed(4) + '   (' + (cpNew.who || []).join(' / ') + ')');
  L.push('  ' + (cpNew.d >= cpToday.d ? 'KEPT OR IMPROVED' : '*** REGRESSED, AND NOTHING IS WRITTEN. ***'));
  L.push('');
  L.push('VIBRANCE after the wiring (his other ruling, executed last round):');
  L.push('  mean cloth saturation   today ' + mean(R.today.map(x => x.sat)).toFixed(3)
    + '   wired ' + mean(wired.map(x => x.sat)).toFixed(3));
  L.push('  share of cloth over 0.55  today ' + mean(R.today.map(x => x.hot)).toFixed(1)
    + '%   wired ' + mean(wired.map(x => x.hot)).toFixed(1) + '%');
  L.push('');
  L.push('HONEST LIMIT: the assignment is greedy, constrained-first. It is not proven to be the');
  L.push('best of the 13! orderings, and it is not claimed to be -- the same honesty the fit');
  L.push('search itself carries about being a floor and not a ceiling.');

  if (cpNew.d < cpToday.d) {
    L.push('');
    L.push('NOTHING WAS WRITTEN. His 9/14 complaint was that the street is six people, and a');
    L.push('better-dressed set that reads as FEWER people is a regression in a nicer coat.');
    fs.writeFileSync(OUT, L.join('\n') + '\n');
    console.log(L.join('\n'));
    process.exit(4);
  }

  if (WRITE) {
    /* WRITE THE OUTFITS. Only worn is replaced, never the faction, the why, the draft flag or
       the dials -- the body is deliberately untouched, which is the whole rule above. */
    let src = fs.readFileSync(ALPHA, 'utf8');
    let done = 0;
    for (const t of R.today) {
      const w = assign[t.faction]; if (!w) continue;
      const order = ['hair', 'base', 'outer', 'back', 'head', 'neck', 'legs', 'feet', 'waist', 'gear', 'face', 'hands'];
      const keys = order.filter(k => w.worn[k]);
      const body = keys.map(k => k + ":'" + w.worn[k] + "'").join(',');
      const re = new RegExp("(\\{ faction:'" + t.faction + "'[\\s\\S]*?worn:\\{)[^}]*(\\})");
      if (!re.test(src)) { console.error('COULD NOT FIND THE WORN BLOCK FOR ' + t.faction + '; nothing written.'); process.exit(5); }
      src = src.replace(re, '$1' + body + '$2');
      done++;
    }
    fs.writeFileSync(ALPHA, src);
    L.push('');
    L.push('WRITTEN: ' + done + ' of 13 faction outfits re-dressed in the alpha. Bodies untouched.');
  } else {
    L.push('');
    L.push('DRY RUN. Re-run with --write to put it in the game.');
  }
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  if (errs.length) console.log('\n  page errors: ' + errs.slice(0, 2).join(' | '));
})();
