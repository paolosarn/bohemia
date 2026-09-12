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
  const src = strip(fs.readFileSync(path.join(ROOT, file), 'utf8'));
  const out = {};
  for (const t of TELLS) {
    const m = src.match(t.re);
    out[t.key] = m ? m.length : 0;
  }
  return out;
}

const rows = SURFACES.map(([name, file]) => ({ name, file, n: count(file) }));
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
  console.log('\n  IT READS THE SOURCE, NOT THE PAINTED SCREEN. A tell in a string the game');
  console.log('  never renders counts the same as one he can see, and slop nobody listed is');
  console.log('  invisible to it. A floor under the work, not a verdict on it.\n');
}
