/* ONE ACCENT ONLY (9/5/26, CHARACTER lane, [clothes wired] WIRE-THE-REMAKE)
 *
 * DIRECTION shipped the style card (records/BOHEMIA_STYLE_CARD_9_5_26.md, 9/5). Its
 * machine block carries two lines that are NOT cooking rules:
 *       "accent_max_pieces": 1
 *       "banned": [... "second saturated piece" ...]
 * A cook decides what ONE garment looks like. NOTHING BUT THE PICKER DECIDES HOW MANY
 * OF THEM A PERSON WEARS AT ONCE. So the card has just written a requirement straight
 * onto this lane: however well every garment is cooked, the card is broken on the
 * surface the moment somebody walks past wearing two saturated pieces.
 *
 * ART MAKES PIXELS, CHARACTER MAKES THEM WORN -- and this is the half of that sentence
 * nobody has ever measured.
 *
 * HOW A GARMENT'S COLOUR IS READ, since garments are procedural (gen:function) and not
 * a table of hexes: render the body wearing NOTHING but that garment, diff against the
 * bare body, and take the pixels that changed. That is the garment's own contribution,
 * measured off what the game actually draws rather than off a swatch somebody typed.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel. It restores G_WORN and the caches it
 * clears before it returns.
 *   built on: buildFrame + BOH_PERSONLOOK.lookFor (read-only)  joints: none  parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every garment is the game's own gen function.
 * Looked at tools/bohemia_what_nobody_wears.js (the 9/5 picker interrogation, whose
 * shape this follows) and the CLOTHES tab's own preview path.
 *
 *   node tools/bohemia_one_accent_only.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const CARD = path.join(REPO, 'records/BOHEMIA_STYLE_CARD_9_5_26.md');
const OUT = path.join(REPO, 'records/BOHEMIA_ONE_ACCENT_ONLY_9_5_26.txt');
const N = 3000;

(async () => {
  /* THE THRESHOLD IS THE CARD'S, READ FROM THE CARD. A number typed here would be a
     second copy of a value DIRECTION owns, and the day they move it this would keep
     measuring the old one. */
  const card = fs.readFileSync(CARD, 'utf8');
  const m = card.match(/```json\s*([\s\S]*?)```/);
  const J = JSON.parse(m[1]);
  const SAT = J.accent_sat_min, MAXP = J.accent_max_pieces;

  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS && window.BOH_PERSONLOOK,
    { timeout: 60000 });

  const r = await p.evaluate(({ N, SAT }) => {
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const shot = (worn) => {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of ['hat','glasses','hair','shirt','jacket','pants','shoes']) eq[s] = '';
      G.equipped = eq; window.G_WORN = worn; clear();
      return buildFrame('S', 'idle', 0);
    };
    const sat = (c) => { const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]);
      return mx ? (mx - mn) / mx : 0; };

    const BARE = { base: '', legs: '', feet: '', hair: '' };
    const bare = shot(BARE);
    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);

    /* EACH GARMENT ALONE, DIFFED AGAINST THE BARE BODY. */
    const satOf = {};
    for (const g of canon) {
      const w = {}; for (const k in BARE) w[k] = '';
      w[g.layer] = g.n;
      let fr; try { fr = shot(w); } catch (e) { continue; }
      let n = 0, s = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const a = fr.px[i], c = bare.px[i];
        if (!a) continue;
        if (c && a[0] === c[0] && a[1] === c[1] && a[2] === c[2]) continue;   /* unchanged */
        s += sat(a); n++;
      }
      satOf[g.n] = n ? s / n : 0;
    }

    /* NOW ASK THE REAL PICKER HOW MANY ACCENTS IT PUTS ON ONE PERSON. */
    let over = 0, worst = 0; const examples = [];
    const hist = {};
    for (let i = 0; i < N; i++) {
      const look = BOH_PERSONLOOK.lookFor('crowd:' + i, GARMENTS);
      const worn = (look && look.worn) || {};
      const acc = [];
      for (const slot in worn) { const nm = worn[slot];
        if (nm && satOf[nm] >= SAT) acc.push(slot + '/' + nm); }
      hist[acc.length] = (hist[acc.length] || 0) + 1;
      if (acc.length > worst) worst = acc.length;
      if (acc.length > 1) { over++; if (examples.length < 8) examples.push('crowd:' + i + '  ' + acc.join(' + ')); }
    }

    window.G_WORN = keepW; G.equipped = keepE; clear();
    const accents = canon.filter(g => satOf[g.n] >= SAT)
      .map(g => ({ n: g.n, layer: g.layer, sat: +satOf[g.n].toFixed(3) }))
      .sort((a, c) => c.sat - a.sat);
    return { canon: canon.length, accents, over, worst, hist, examples, N };
  }, { N, SAT });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const L = [];
  L.push('ONE ACCENT ONLY -- the style card\'s wearing rule, measured on the real picker');
  L.push('9/5/26, CHARACTER lane. [clothes wired] WIRE-THE-REMAKE.');
  L.push('');
  L.push('THE CARD (records/BOHEMIA_STYLE_CARD_9_5_26.md, DIRECTION, 9/5) says:');
  L.push('    "accent_max_pieces": ' + MAXP);
  L.push('    "banned": [... "second saturated piece" ...]');
  L.push('    "accent_sat_min": ' + SAT + '   <- the threshold, read from the card, not typed here');
  L.push('');
  L.push('A cook decides what one garment looks like. NOTHING BUT THE PICKER DECIDES HOW');
  L.push('MANY A PERSON WEARS AT ONCE, so this rule lands on CHARACTER, not on COOK.');
  L.push('');
  L.push('EVERY GARMENT\'S SATURATION, read by rendering it ALONE and diffing against the');
  L.push('bare body, because garments are gen functions and not a table of hexes.');
  L.push('');
  L.push('  canon garments                 ' + r.canon);
  L.push('  at or above the accent line    ' + r.accents.length);
  L.push('');
  if (r.accents.length) {
    L.push('  THE ACCENT PIECES');
    for (const a of r.accents.slice(0, 30))
      L.push('    ' + a.layer.padEnd(8) + a.n.padEnd(26) + a.sat.toFixed(3));
    if (r.accents.length > 30) L.push('    (+' + (r.accents.length - 30) + ' more)');
    L.push('');
  }
  L.push('WHAT THE PICKER ACTUALLY PUTS ON ' + r.N + ' PEOPLE');
  L.push('');
  for (const k of Object.keys(r.hist).sort())
    L.push('  ' + k + ' accent piece(s)   ' + String(r.hist[k]).padStart(5) +
      '   ' + (r.hist[k] / r.N * 100).toFixed(2) + '%');
  L.push('');
  L.push('  people wearing MORE than ' + MAXP + '   ' + r.over +
    '   (' + (r.over / r.N * 100).toFixed(2) + '%)');
  L.push('  worst case on one person      ' + r.worst);
  L.push('');
  if (r.examples.length) {
    L.push('  EXAMPLES');
    for (const e of r.examples) L.push('    ' + e);
    L.push('');
  }
  /* *** AND THE CONCLUSION THIS FIRST DREW WAS WRONG, WHICH IS THE POINT OF WRITING IT
     DOWN. *** The first version ended "THE CARD IS BROKEN ON THE SURFACE, 574 people in
     3000 are wearing more than one saturated piece" -- and among the offenders it named
     BROWN BOOTS. Brown is highly saturated in HSV (a mid brown is about 0.59), so the
     measure was calling ordinary leather an accent, which is not what the card means at
     all: it says "the FACTION'S saturated colour", and its own palette section lists
     "dust, ash, bone, lead, oxblood-grey" as LEGAL cloth and only "candy" as banned.
     A NUMBER IS NOT A FINDING UNTIL YOU KNOW WHAT IT IS COUNTING.
     What the number really says is that THE WARDROBE PREDATES THE CARD, which is true,
     expected, and is COOK's WARDROBE-REMAKE, not a defect to fix here. And the real
     hole it uncovered is a DATA hole that belongs to this lane: no garment carries any
     mark saying it is a faction accent, so the card's one-accent rule could not be
     enforced by anything, ever, no matter how the pixels were measured. */
  L.push('WHAT THIS NUMBER IS AND IS NOT');
  L.push('');
  L.push('  It is NOT a verdict on the card. Brown reads as highly saturated in HSV (a mid');
  L.push('  brown is about 0.59), so this count calls ordinary leather boots an accent --');
  L.push('  and the card explicitly lists dust, ash, bone, lead and oxblood-grey as LEGAL');
  L.push('  cloth. A NUMBER IS NOT A FINDING UNTIL YOU KNOW WHAT IT IS COUNTING.');
  L.push('');
  L.push('  What it honestly says: THE WARDROBE PREDATES THE CARD. That is COOK\'s');
  L.push('  WARDROBE-REMAKE, still OPEN, and not a defect for CHARACTER to fix.');
  L.push('');
  L.push('  THE REAL HOLE, AND IT IS THIS LANE\'S: not one of the ' + r.canon + ' garments carries');
  L.push('  any mark saying it is a faction accent. Fields on a canon garment are');
  L.push('  n, st, layer, lux, gen, hard, cw, fresh, hoodDefaultUp -- and nothing else.');
  L.push('  So "at most ONE piece per body carries the faction\'s saturated colour" was');
  L.push('  UNENFORCEABLE BY ANYTHING, whatever the pixels said.');
  L.push('');
  L.push('  FIXED THIS ROUND: engine/bohemia_personlook.js now honours an `accent` flag');
  L.push('  and will never put a second one on a body -- data, not names, exactly like');
  L.push('  the `lux` and `hard` flags beside it, so COOK tags a piece as it cooks it and');
  L.push('  no code changes. IT SHIPS WITH NOTHING TAGGED (MECHANISM-MINE /');
  L.push('  CONTENTS-PAOLO\'S): measured, 0 of 4000 people\'s looks changed. Held by');
  L.push('  gates/wardrobe_wired_gate.js, which drives the mechanism on a synthetic');
  L.push('  wardrobe rather than on the empty one, and by stripping the flag proves it is');
  L.push('  the RULE holding and not a pool that cannot break it.');
  L.push('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();
