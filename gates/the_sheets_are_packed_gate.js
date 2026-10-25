/* ==========================================================================
   THE SHEETS ARE PACKED  (RUN, 10/25/26, VAMILY [the crash before the fight], rule 173(c))

   PAOLO 10/25: "the game keeps crashing at random times, usually right before a fight loads up; maybe it's because of
   the amount of people on the screen." MEASURED: every man in a fight held his look's sheet (17.7 MB decoded) and his
   gun's (33 MB decoded) as full bitmaps though the figures fill a fifth of the one and 2% of the other; the biggest fight
   took the tab from 1.09 GB to 2.07 GB. The fight now holds each sheet's atlas (slices/fight_rig/packed, the same pixels
   cut to the box they fill), and uses it only while it is cut from the sheet on the server.

   A pack goes stale the moment a lane re-renders a sheet: the fight then quietly draws that man from his whole sheet again
   (correct art, the old weight). This gate is how that is seen the same day instead of in a crash.

   LEGS (no browser):
     S1 every look and gun sheet in fight_rig.json has a pack cut from the bytes on disk (the packer's own --check)
     S2 the packs carry the same cells: a sampled set of sheets re-assembled from their atlas equals the sheet, pixel for pixel
     S3 the atlases weigh at most a quarter of the sheets they stand for, decoded
     S4 the fight holds the atlas only through the size check (the HEAD), and falls back to the whole sheet
   node gates/the_sheets_are_packed_gate.js     (python3 tools/bohemia_run_the_sheets_packed.py repacks)
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (why ? ' (' + why + ')' : '')); } };

const chk = spawnSync('python3', [path.join(ROOT, 'tools/bohemia_run_the_sheets_packed.py'), '--check'], { encoding: 'utf8' });
ok('S1 every look and gun sheet is packed from the sheet on disk [' + String(chk.stdout || chk.stderr).trim().slice(0, 220) + ']', chk.status === 0,
  'run: python3 tools/bohemia_run_the_sheets_packed.py');

const S2 = spawnSync('python3', ['-c', `
import json, base64, struct, sys, os
import numpy as np
from PIL import Image
R = sys.argv[1]
ix = json.load(open(os.path.join(R, 'slices/fight_rig/packed/index.json')))['sheets']
names = sorted(ix)[::max(1, len(ix) // 6)][:6] + ['you.webp', 'you_guns.webp']
bad = []
for n in names:
    if n not in ix: continue
    m = json.load(open(os.path.join(R, 'slices/fight_rig/packed', os.path.splitext(n)[0] + '.json')))
    src = np.asarray(Image.open(os.path.join(R, 'slices/fight_rig', n)).convert('RGBA'))
    at = np.asarray(Image.open(os.path.join(R, 'slices/fight_rig/packed', m['atlas'])).convert('RGBA'))
    raw = base64.b64decode(m['cells']); t = struct.unpack('<%dH' % (len(raw) // 2), raw)
    rec = np.zeros_like(src)
    for i in range(m['rows'] * m['cols']):
        ax, ay, tx, ty, tw, th = t[i * 6:i * 6 + 6]
        if not tw: continue
        r, c = divmod(i, m['cols'])
        rec[r * m['ch'] + ty:r * m['ch'] + ty + th, c * m['cw'] + tx:c * m['cw'] + tx + tw] = at[ay:ay + th, ax:ax + tw]
    vis = src[:, :, 3] > 0
    if (rec[:, :, 3] != src[:, :, 3]).any() or (vis.any() and np.abs(rec[vis].astype(int) - src[vis].astype(int)).max() > 0): bad.append(n)
print(json.dumps({'checked': len(names), 'bad': bad}))
`, ROOT], { encoding: 'utf8' });
let s2 = null; try { s2 = JSON.parse(S2.stdout.trim().split('\n').pop()); } catch (e) {}
ok('S2 a sheet re-assembled from its atlas is the sheet, pixel for pixel (' + (s2 ? s2.checked + ' sheets, ' + s2.bad.length + ' differ' + (s2.bad.length ? ': ' + s2.bad.join(' ') : '') : String(S2.stderr).slice(0, 160)) + ')',
  !!s2 && s2.checked >= 6 && s2.bad.length === 0);

let ix = null; try { ix = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_rig/packed/index.json'), 'utf8')); } catch (e) {}
const T = ix && ix.totals;
ok('S3 the atlases weigh at most a quarter of the sheets, decoded (' + (T ? T.decodedMB + ' MB -> ' + T.packedMB + ' MB over ' + T.sheets + ' sheets' : 'no index') + ')',
  !!T && T.sheets >= 100 && T.packedMB <= T.decodedMB / 4);

const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
const blk = (html.match(/__THE_SHEETS_ARE_PACKED__ \(RUN 10\/25[\s\S]*?\/__THE_SHEETS_ARE_PACKED__/) || [''])[0];
ok('S4 the fight holds an atlas only when the sheet on the server is the one it was cut from, else the whole sheet',
  /method: 'HEAD'/.test(blk) && /bytes !== e\.bytes/.test(blk) && /instanceof PackedSheet/.test(blk)
  && /packedLoad\(s\)\.then\(function \(p\) \{ if \(p\) \{ UI\.imgs\[s\] = p; return p; \} PACKED\.whole\+\+; return whole\(s\); \}\)/.test(html));

console.log('THE SHEETS ARE PACKED: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
