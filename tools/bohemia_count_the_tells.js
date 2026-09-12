/* ============================================================================
   COUNT THE TELLS (UI lane 11, 9/11/26) -- row [no slop].
   laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md

   *** PAOLO 9/11, LOCKED: "I need the UI to run as far away as possible from the standard
   look of vibe-coding with Claude right now. People can look at it and be like, yep, that
   was coded. Do big brain research or whatever you need to do, even down to the font." ***

   THIS IS A RULER, NOT A GATE, AND THE DIFFERENCE IS DELIBERATE. The gate belongs to EYES
   AND EARS on their [slop count] row; building it here would be doing another lane's job.
   What this lane's row asks for is THE TELL COUNT AS THE FIRST MEASUREMENT, and a number
   nobody can re-run is not a measurement, it is a claim. So: one command, per surface,
   per tell, printed as a table, with the baseline frozen in the record beside it. The
   number only has to go down from here.

   WHAT IT COUNTS, taken from the law's own list rather than invented here:
     the named fonts (Inter, Poppins, Space Grotesk, Geist), monospace as a default,
     one-pixel borders used as edges, rounded corners, gradients and glow,
     letter-spaced uppercase labels, and emoji used as icons inside controls.

   WHAT IT CANNOT SEE, said out loud so the number is not read as more than it is: it reads
   the SOURCE, not the painted screen. A tell inside a string the game never renders counts
   the same as one on his screen, and a look that is slop for reasons nobody listed is
   invisible to it. It is a floor under the work, not a verdict on it.

     node tools/bohemia_count_the_tells.js
     node tools/bohemia_count_the_tells.js --json
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);

/* THE TWO FILES THAT DRAW HIS SCREEN, which is what the law counted. */
const SURFACES = [
  ['the walked city', 'slices/BOHEMIA_CITY_WORLD.html'],
  ['the alpha shell', 'slices/BOHEMIA_ALPHA_0_9.html'],
];

/* COMMENTS ARE NOT THE LOOK. This file is written in a repo whose comments discuss the
   tells by name constantly -- this very file names Space Grotesk four times -- so counting
   raw text would make the ruler climb every time somebody explains the rule. Strip the
   comments and count what actually draws. */
function strip(src) {
  return src
    .replace(/<!--[\s\S]*?-->/g, ' ')       // html comments
    .replace(/\/\*[\s\S]*?\*\//g, ' ')      // css and js block comments
    .replace(/^[ \t]*\/\/.*$/gm, ' ');      // js line comments
}

/* *** A TOKEN IS NOT A CURE, AND THIS RULER COULD NOT TELL THE DIFFERENCE (round four). ***
   Found before touching the tracking work, which is what makes it worth writing down. The
   spaced-caps row only matched a value that starts with a digit, so `letter-spacing:2px`
   counted and `letter-spacing:var(--track,2px)` did not -- same painted pixel, half the
   score. Eighty hits could have gone to zero in one pass of find-and-replace, the screen
   unchanged, the record claiming the slop was cut. THAT IS THE EXACT MOVE THIS LANE HAS
   BANNED ITSELF FROM: never tune the ruler so a number falls. So the ruler now resolves
   what a var would paint before it counts. Innermost first, repeatedly, because a fallback
   can hold another var; a var with no fallback paints nothing, so it becomes nothing.

   THE REPO'S OWN TOTAL DID NOT MOVE WHEN THIS LANDED, and the first draft of this comment
   claimed it had gone up, which would have been a lie sitting in the evidence. It did not
   move because the one var-wrapped tracking value in the tree today is .4px, under the
   threshold either way. The hole is real anyway and is proved on a probe, not asserted:
   three labels written 2px, var(--t,2px) and var(--t,var(--u,3px)) paint three spaced
   labels; the old ruler counted ONE, this one counts THREE. A hole you can only demonstrate
   on a probe is still a hole -- it is the one the next round would have fallen into, since
   the next round is the one that moves tracking onto tokens. */
function inline(src) {
  /* *** AND THE FALLBACK IS NOT THE VALUE EITHER. *** Resolving var(--track,.4px) to .4px
     is only right while the token is DECLARED .4px. Set --track-casing:2px at the top of
     the file and every label on screen goes wide while the ruler keeps reading the stale
     .4px written at the call sites and reports nothing. That is the same hole one level up,
     so the declarations are read first and they win. Where a token is declared more than
     once with different values -- the skin does this on purpose, one act per value -- there
     is no single answer from the source alone, so the fallback is kept and that limit is
     named here rather than guessed at. */
  const declared = new Map(), seen = new Map();
  const DECL = /(--[\w-]+)\s*:\s*([^;{}]+)/g;
  let d;
  while ((d = DECL.exec(src))) {
    const k = d[1], v = d[2].trim().replace(/!important$/, '').trim();
    if (!seen.has(k)) seen.set(k, new Set());
    seen.get(k).add(v);
  }
  for (const [k, vs] of seen) if (vs.size === 1) declared.set(k, [...vs][0]);

  let out = src, n = 0;
  for (;;) {
    const next = out
      .replace(/var\(\s*(--[\w-]+)\s*,([^()]*)\)/g,
               (m, k, fb) => (declared.has(k) ? declared.get(k) : fb))
      .replace(/var\(\s*(--[\w-]+)\s*\)/g,
               (m, k) => (declared.has(k) ? declared.get(k) : ''));
    if (next === out || ++n > 12) return next;
    out = next;
  }
}

const TELLS = [
  { key: 'named fonts',        note: 'Inter / Poppins / Space Grotesk / Geist',
    re: /\b(Inter|Poppins|Space\s+Grotesk|Geist)\b/gi },
  { key: 'monospace',          note: 'monospace as the default for everything',
    re: /monospace/gi },
  { key: '1px borders',        note: 'a hairline used as an edge',
    re: /border(?:-[a-z]+)?\s*:\s*1px\s+solid/gi },
  { key: 'rounded corners',    note: 'the rounded card as the way to group',
    re: /border-radius\s*:\s*(?!50%|999)/gi },
  /* *** THE FIRST CUT OF THIS LINE COUNTED THE CURE AS THE DISEASE. *** It matched any
     box-shadow carrying an rgba, which is most of them -- and DIRECTION's 9/11 object
     language RULES that every panel must show its body with "a shadowed lower edge or a
     visible side, one or the other, always". A ruler that counts the ordered fix as the
     tell would push the work back toward the flat hairline it is trying to leave, and the
     number would fall by doing the wrong thing. The tell is "dark plus GLOW equals
     premium": a halo with no offset, or a wide coloured blur. A shadow with a vertical
     offset and a tight blur is an object having a bottom edge. So glow is counted and an
     edge is not, and the two are separate rows because they are separate things. */
  { key: 'gradients',          note: 'the gradient fill as the way to make a surface',
    re: /linear-gradient|radial-gradient/gi },
  { key: 'glow',               note: 'a halo with no offset, or a wide coloured blur',
    re: /box-shadow\s*:[^;]*?(?:\b0\s+0\s+\d|\b(?:1[2-9]|[2-9]\d)px\s+rgba?\()/gi },
  { key: 'spaced caps',        note: 'small uppercase letter-spaced labels',
    re: /letter-spacing\s*:\s*(?:[1-9]\d*(?:\.\d+)?)(?:px|em)/gi },
  { key: 'emoji in controls',  note: 'emoji used as an icon',
    re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu },
];

function count(file) {
  const src = inline(strip(fs.readFileSync(path.join(ROOT, file), 'utf8')));
  const out = {};
  for (const t of TELLS) {
    const m = src.match(t.re);
    out[t.key] = m ? m.length : 0;
  }
  return out;
}

/* *** WHERE, NOT JUST HOW MANY (round three). *** "62 one-pixel borders" is a number
   nobody can act on: it does not say whose panel, so it cannot be cut and it cannot be
   routed. Every hit is attributed to the nearest ANCHOR above it, and the hits are grouped,
   so the count stops being a score and starts being a list of jobs.
   AN ANCHOR IS NOT ANY WORD STARTING WITH A HASH -- that cut is dead and the block below
   says what killed it. It is exactly two things: an id written in the MARKUP, or an id that
   OPENS A CSS RULE. Everything else is skipped, so a hex colour and a word inside quest text
   can no longer be credited with somebody's panel.
   It is still nearest-above, so a hit inside a bare `.fp .txt` rule lands on the last real
   anchor before it. Good enough to route by, not evidence. */
function locate(file) {
  const raw = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const src = inline(strip(raw));
  /* *** AN ANCHOR MUST BE A SELECTOR OR AN ID, NOT ANY WORD THAT STARTS WITH A HASH. ***
     Two wrong cuts before this one, and the second nearly sent other lanes a list of jobs
     that did not exist:
       1. a HEX COLOUR read as an id -- six hits attributed to "#c9a24a", a shade of gold.
       2. a WORD INSIDE QUEST DATA read as an id -- "#namedbody" and "#dread" are strings in
          the embedded .bq text, not panels, and they were credited with 17 borders, 19 radii
          and 18 monospace between them. Nothing with those names exists in the stylesheet.
     A CLEAN ANSWER FROM THE WRONG ORACLE LOOKS EXACTLY LIKE A FACT, which is why this was
     caught by opening the top two names and finding no rule behind either.
     So an anchor is now one of exactly two things: an id written in the MARKUP, or an id
     that OPENS A CSS RULE (followed by a brace with no semicolon or brace in between). */
  const anchors = [];
  const push = (at, id) => anchors.push({ at, id });
  let m;
  const IDATTR = /\bid="([A-Za-z][\w-]*)"/g;
  while ((m = IDATTR.exec(src))) push(m.index, '#' + m[1]);
  const SEL = /(#[A-Za-z][\w-]*)(?=[^{};<>"']*\{)/g;
  while ((m = SEL.exec(src))) push(m.index, m[1]);
  anchors.sort((a, b) => a.at - b.at);

  const where = t => {
    const out = {};
    const re = new RegExp(t.re.source, t.re.flags.replace('g', '') + 'g');
    let hit;
    while ((hit = re.exec(src))) {
      let lo = 0, hi = anchors.length - 1, found = '(no id near it)';
      while (lo <= hi) { const mid = (lo + hi) >> 1;
        if (anchors[mid].at <= hit.index) { found = anchors[mid].id; lo = mid + 1; } else hi = mid - 1; }
      out[found] = (out[found] || 0) + 1;
      if (re.lastIndex === hit.index) re.lastIndex++;
    }
    return out;
  };
  const by = {};
  for (const t of TELLS) by[t.key] = where(t);
  return by;
}

const rows = SURFACES.map(([name, file]) => ({ name, file, n: count(file), by: locate(file) }));
const totals = {};
for (const t of TELLS) totals[t.key] = rows.reduce((a, r) => a + r.n[t.key], 0);
const grand = Object.values(totals).reduce((a, b) => a + b, 0);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ card: 'THE_TELL_COUNT', rows, totals, grand }, null, 1));
} else {
  const w = Math.max(...TELLS.map(t => t.key.length));
  console.log('\nCOUNT THE TELLS -- ' + new Date().toISOString().slice(0, 10));
  console.log('(the source that draws his screen, comments stripped)\n');
  console.log('  ' + 'tell'.padEnd(w) + rows.map(r => r.name.padStart(17)).join('') + '    total');
  for (const t of TELLS) {
    console.log('  ' + t.key.padEnd(w)
      + rows.map(r => String(r.n[t.key]).padStart(17)).join('')
      + String(totals[t.key]).padStart(9));
  }
  console.log('  ' + ''.padEnd(w) + rows.map(() => ''.padStart(17)).join('') + '  -------');
  console.log('  ' + 'ALL TELLS'.padEnd(w)
    + rows.map(r => String(Object.values(r.n).reduce((a, b) => a + b, 0)).padStart(17)).join('')
    + String(grand).padStart(9));
  console.log('\n  what each one is:');
  for (const t of TELLS) console.log('    ' + t.key.padEnd(w) + t.note);
  /* THE TOP OWNERS, so the next round knows what it is opening and whose it is. */
  if (process.argv.includes('--where')) {
    for (const r of rows) {
      console.log('\n  WHERE THEY ARE -- ' + r.name);
      for (const t of TELLS) {
        const e = Object.entries(r.by[t.key]).sort((a, b) => b[1] - a[1]).slice(0, 6);
        if (!e.length) continue;
        console.log('    ' + t.key);
        for (const [id, n] of e) console.log('        ' + String(n).padStart(4) + '  ' + id);
      }
    }
  } else {
    console.log('\n  run with --where to see WHOSE PANEL each hit is in.');
  }

  console.log('\n  IT READS THE SOURCE, NOT THE PAINTED SCREEN. A tell in a string the game');
  console.log('  never renders counts the same as one he can see, and slop nobody listed is');
  console.log('  invisible to it. A floor under the work, not a verdict on it.\n');
}
