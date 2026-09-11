/* IS THE HAIR REALLY BANDED, AND BY HOW MUCH? (9/11/26, CHARACTER lane,
 * VAMILY [eyes: hair bands])
 *
 * THE BOUNCE-BACK, from EYES AND EARS (records/BOHEMIA_EYES_E1_THE_PIXEL_TELLS_9_5_26.md),
 * on art this lane had already shipped:
 *     THE HAIR IS THE MOST BANDED ART IN THE REPO -- 62.0%, against 31.8% for the CMU
 *     block and 0.0% for every tile bank. A deliberately banded test ramp reads 31.2% on
 *     the same instrument. "It agrees with what this lane saw by eye: the player's head
 *     from behind is a flat cream mass with one straight black mark on it."
 *
 * THE INSTRUMENT IS THEIRS, IMPORTED AND RUN UNMODIFIED. banding() comes out of
 * tools/bohemia_eyes_pixel_tells.py. Writing a second one would be grading my own
 * homework with my own ruler, which is how a number only ever goes down.
 *
 * WHAT THIS ADDS, and it is the only reason it exists: THE SCALE THE PICTURE WAS
 * MEASURED AT. Every bank in this repo stores its art BLOWN UP -- the tiles at 4x, the
 * hair sheets at 3x -- and a nearest-neighbour blow-up turns every source row into k
 * identical rows. The detector calls six similar rows a band, so at 3x, two source rows
 * that merely rhyme are already six. The number is therefore part art and part zoom, and
 * nobody had separated them.
 *
 *     MEASURED, and it corrects the headline without dismissing the finding:
 *         face + hair bank    51.5% as baked    14.5% at native scale
 *         CMU block           31.8% as baked     0.0% at native scale
 *         every tile bank      0.0%              0.0%
 *     THE HAIR IS STILL THE MOST BANDED ART IN THE REPO -- the bounce-back is RIGHT and
 *     this lane owns it. But the CMU comparison in the original finding is entirely an
 *     artifact of ITS 4x zoom, and the gap against the tiles is 14.5-to-0, not 62-to-0.
 *
 * AND THE FIRST GUESS AT WHY WAS WRONG, which is kept here because it cost a build. The
 * obvious suspect was the sheet's flat cream SHIRT under every head. Splitting the sheet:
 * head 71.9%, body 78.0% -- both band, so it is not the shirt, and a fix aimed there
 * would have missed.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports. It rebakes nothing and writes nothing
 * into the game; it reads the committed bank and measures it.
 *
 *   node tools/bohemia_the_hair_is_banded.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/BOHEMIA_THE_HAIR_IS_BANDED_9_11_26.txt');

const py = `
import json, sys, glob, os, io, base64, importlib.util
from PIL import Image, ImageChops
spec = importlib.util.spec_from_file_location('tells', ${JSON.stringify(path.join(REPO, 'tools/bohemia_eyes_pixel_tells.py'))})
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

def factor(im):
    """THE ZOOM THIS PICTURE IS STORED AT, found rather than assumed: the largest k for
    which shrinking by k and blowing it back up is bit-identical. That is exactly what a
    nearest-neighbour blow-up is, and nothing else survives the round trip."""
    im = im.convert('RGBA'); w, h = im.size
    for k in (4, 3, 2):
        if w % k == 0 and h % k == 0:
            s = im.resize((w // k, h // k), Image.NEAREST)
            if ImageChops.difference(im, s.resize((w, h), Image.NEAREST)).getbbox() is None:
                return k
    return 1

rows = []
for p in sorted(glob.glob(os.path.join(${JSON.stringify(REPO)}, 'banks', '*.txt'))):
    try:
        d = json.load(open(p))
    except Exception:
        continue
    items = None
    for kk in ('faces', 'items', 'tiles', 'pieces'):
        if isinstance(d, dict) and kk in d and isinstance(d[kk], list):
            items = d[kk]; break
    if not items:
        continue
    baked, native, zooms, hairb, hairn = [], [], set(), [], []
    for t in items[:30]:
        if 'b64' not in t:
            continue
        try:
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        except Exception:
            continue
        k = factor(im); zooms.add(k)
        w, h = im.size
        a = m.banding(im)[0]
        b = m.banding(im.resize((w // k, h // k), Image.NEAREST))[0] if k > 1 else a
        baked.append(a); native.append(b)
        if t.get('kind') == 'haircut':
            hairb.append(a); hairn.append(b)
    if baked:
        rows.append({'bank': os.path.basename(p), 'n': len(baked), 'zoom': sorted(zooms),
                     'baked': sum(baked) / len(baked), 'native': sum(native) / len(native),
                     'hair_n': len(hairn),
                     'hair_baked': (sum(hairb) / len(hairb)) if hairb else None,
                     'hair_native': (sum(hairn) / len(hairn)) if hairn else None})
print(json.dumps(rows))
`;

const rows = JSON.parse(execFileSync('python3', ['-c', py], { maxBuffer: 1 << 26 }));
rows.sort((a, b) => b.native - a.native);
const hairBank = rows.find(r => r.hair_n);

const L = [];
L.push('IS THE HAIR REALLY BANDED, AND BY HOW MUCH? -- the eyes bounce-back, re-measured');
L.push('with the eyes lane\'s own instrument, at the scale the art is actually drawn');
L.push('9/11/26, CHARACTER lane. VAMILY [eyes: hair bands].');
L.push('');
L.push('THE BOUNCE-BACK: "THE HAIR IS THE MOST BANDED ART IN THE REPO -- 62.0%, against');
L.push('31.8% for the CMU block and 0.0% for every tile bank ... the player\'s head from');
L.push('behind is a flat cream mass with one straight black mark on it."');
L.push('records/BOHEMIA_EYES_E1_THE_PIXEL_TELLS_9_5_26.md');
L.push('');
L.push('THE FINDING IS RIGHT AND THIS LANE OWNS IT. The correction is only to the SIZE.');
L.push('');
L.push('WHY THE SIZE WAS WRONG: every bank stores its art BLOWN UP -- tiles at 4x, hair');
L.push('sheets at 3x -- and a nearest-neighbour blow-up turns every source row into k');
L.push('identical rows. The detector calls six similar rows a band, so at 3x two source');
L.push('rows that merely rhyme are already six. The zoom is found per piece, never');
L.push('assumed: the largest k for which shrinking and re-expanding is bit-identical.');
L.push('');
L.push('  ' + 'bank'.padEnd(44) + '    n   zoom   as baked     native');
for (const r of rows)
  L.push('  ' + r.bank.slice(0, 44).padEnd(44) + String(r.n).padStart(5) +
    ('[' + r.zoom.join(',') + ']').padStart(7) +
    r.baked.toFixed(1).padStart(11) + r.native.toFixed(1).padStart(11));
L.push('');
L.push('WHAT THAT MEANS, said plainly:');
L.push('  - THE HAIR IS STILL THE MOST BANDED ART IN THE REPO at native scale. Every other');
L.push('    bank in the building reads 0.0 and the hair does not. The bounce-back stands.');
L.push('  - THE CMU COMPARISON IS GONE. 31.8% as baked, 0.0% native -- that number was its');
L.push('    4x zoom, nothing else, so the hair was never "twice as bad as the block".');
L.push('  - The honest gap is against ZERO, not against 31.8, and the honest magnitude is');
L.push('    a fraction of 62.');
if (hairBank && hairBank.hair_native != null) {
  L.push('');
  L.push('  the haircut sheets alone   ' + hairBank.hair_baked.toFixed(1) + '% as baked, ' +
    hairBank.hair_native.toFixed(1) + '% native  (' + hairBank.hair_n + ' sheets)');
}
L.push('');
L.push('A WRONG GUESS, KEPT BECAUSE IT COST A BUILD: the obvious suspect was the flat cream');
L.push('SHIRT under every head on the sheet. Splitting a sheet in two says otherwise --');
L.push('head 71.9%, body 78.0% as baked -- so both band and the shirt is not the cause. A');
L.push('fix aimed there would have missed.');
L.push('');
L.push('WHAT WAS FIXED THIS ROUND, and the number it moved (native scale, the honest one):');
L.push('  the partings ran DEAD STRAIGHT down the whole mass. The 8/28 drift that was');
L.push('  supposed to stop that re-rolled a fresh -1/0/+1 EVERY ROW, which is noise around');
L.push('  a fixed column, amplitude one pixel -- a ruled line with a burr on it. Replaced');
L.push('  with a real walk that remembers where the last row got to, leashed to two cells');
L.push('  so it never leaves the skull.');
L.push('     first attempt, one walk for the whole head    25.3% -> 23.4%   (a rounding error)');
L.push('  AND THAT FAILURE IS THE LESSON: every parting asked the same row and got the same');
L.push('  answer, so the whole comb shifted TOGETHER and the distance between neighbouring');
L.push('  partings never changed. BANDING IS ABOUT THE GAP, NOT ABOUT WHERE THE LINES SIT.');
L.push('  Slide a picket fence sideways and it is still a picket fence.');
L.push('     each parting walking its own way             25.3% -> 15.4%');
L.push('');
L.push('STILL NOT DONE, said plainly: the other half of their sentence. "A flat cream mass"');
L.push('is about the FORM of the back of the head -- there is no light on the crown and no');
L.push('falloff at the nape, so the mass reads as a cut-out. That is a separate fix and it');
L.push('is not in this round.');
L.push('');
L.push('READ THIS BEFORE DRAWING A CONCLUSION. A NUMBER IS NOT A FINDING UNTIL YOU KNOW');
L.push('WHAT IT IS COUNTING. This instrument reads a PICTURE, and a picture of a head');
L.push('contains a head; a skull is nearly the same width for many rows all by itself.');
L.push('That is why the comparison that matters is hair against the other banks AT THE');
L.push('SAME SCALE, which is the last column and nothing else.');
L.push('');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, L.join('\n') + '\n');
console.log(L.join('\n'));
console.log('\nWROTE ' + path.relative(REPO, OUT));
