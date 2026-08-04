/* BOHEMIA — WHERE THE CITY LIVES, IN ONE PLACE (8/4/26).

   THE CITY MOVED HOUSE AND TOOK NINETEEN GATES DOWN WITH IT. Until 8/4 the
   walked world was a base64 constant inside the alpha:

       const CITY_B64='PCFET0NUWVBFIGh0bWw+...'      35.76 MB, one line

   The CITY lane extracted it to slices/BOHEMIA_CITY_WORLD.html so the alpha
   opens 29x faster, which is plainly right. But TWENTY-ONE gates read the city
   by hunting for that constant, each with its own hand-rolled extractor copied
   from the last one. Two were migrated with the move. Nineteen were not, and
   they all went red at once - GRAVEYARD, MAP SIZE, STREET SOURCE, FOOTSTEP,
   TRAFFIC SIGNAL, FULL RES, DOORS, INTERIORS, ICON and more.

   THAT IS WORSE THAN IT SOUNDS. "Green or it does not ship" is the law every
   lane works under. When a third of the suite is red for a reason that has
   nothing to do with anybody's code, red stops meaning anything, and the next
   real breakage arrives in a suite nobody is reading any more.

   SO: ONE ANSWER TO "WHERE IS THE CITY", and every gate asks it. The next time
   the world moves - and it will, this is the second home it has had - that is
   ONE edit here instead of nineteen archaeological digs.

   It prefers the standalone file and falls back to the old inline constant, so
   this works on a fresh checkout of main AND on any older tree.

     const citySrc = require('./bohemia_city_src.js');
     const frame = citySrc();          // the city's HTML source, as a string
     const frame = citySrc(null, {optional: true});   // null instead of throwing

   Reads only. Owns nothing. Decides nothing. */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const STANDALONE = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

/* the old inline form, kept so an older checkout still measures.
   BY INDEX, NEVER A REGEX: the alpha was 42 MB and a big quantifier over it
   blows the call stack (learned the hard way on 7/31, and every one of the
   nineteen copies of this loop carries that same comment). */
function fromAlpha(alpha) {
  for (let ci = alpha.indexOf('CITY_B64'); ci >= 0; ci = alpha.indexOf('CITY_B64', ci + 1)) {
    const tail = alpha.slice(ci + 8, ci + 20);
    const eq = tail.indexOf('=');
    if (eq < 0) continue;
    const qi = tail.slice(eq).search(/['"`]/);
    if (qi < 0) continue;
    const start = ci + 8 + eq + qi + 1;
    const end = alpha.indexOf(alpha[start - 1], start);
    if (end - start < 100000) continue;
    return Buffer.from(alpha.slice(start, end), 'base64').toString('utf8');
  }
  return null;
}

/* alphaText: pass one if you already read the alpha, else it is read here.
   opts.optional: return null rather than throwing when the city cannot be found. */
function citySrc(alphaText, opts) {
  opts = opts || {};
  if (fs.existsSync(STANDALONE)) {
    const s = fs.readFileSync(STANDALONE, 'utf8');
    if (s.length > 100000) return s;
  }
  const alpha = alphaText || (fs.existsSync(ALPHA) ? fs.readFileSync(ALPHA, 'utf8') : '');
  const inline = alpha ? fromAlpha(alpha) : null;
  if (inline) return inline;
  if (opts.optional) return null;
  throw new Error(
    'the walked city could not be found. Looked for slices/BOHEMIA_CITY_WORLD.html ' +
    'and for an inline CITY_B64 in the alpha. If the world moved again, this ' +
    'file (gates/bohemia_city_src.js) is the ONE place to teach it the new address.');
}

citySrc.STANDALONE = STANDALONE;
citySrc.where = () => (fs.existsSync(STANDALONE) ? STANDALONE : ALPHA + ' (inline CITY_B64)');
module.exports = citySrc;
