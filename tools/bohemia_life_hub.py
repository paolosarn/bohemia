#!/usr/bin/env python3
"""
BOHEMIA LIFE HUB (7/21/26) - slices/BOHEMIA_LIFE_CURRENT.html is the page the
alpha's LIFE tab iframes. It is now a HUB, not a single demo: LIFE the
simulation is PARKED DORMANT by Paolo's 7/19 ruling (world first, numbers
never surfaced at him), so the tab's job is to route to whatever LIFE-lane
surface is actually live for judgment. Today that is:

  1. HOUSE SKIN JUDGE (7/21 overnight cook) - the morning verdict
  2. THE LIVING BLOCK (7/19 demo) - dormant, kept reachable for reference

This tool OWNS the CUR file. bohemia_life_slice.py writes only its dated
build. One-alpha law: everything stays reached from inside the alpha.

  python3 tools/bohemia_life_hub.py
"""
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
BANK = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
CUR = 'slices/BOHEMIA_LIFE_CURRENT.html'

bank = json.load(open(BANK))
by_id = {t['id']: t for t in bank['tiles']}
teasers = [by_id[i]['b64'] for i in ('roof_shingle_2', 'wall_boarded_15', 'yard_mojavegold_28')]
count = len(bank['tiles'])

html = r"""<title>BOHEMIA LIFE</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div style="padding:14px 12px 30px;max-width:480px;margin:0 auto">
  <div style="font:700 17px/1.3 -apple-system,sans-serif;color:#cdbd8a">LIFE</div>
  <div style="font:12px/1.5 -apple-system,sans-serif;color:#8f8770;margin:4px 0 16px">
    The people-and-economy engine is built and parked (your 7/19 ruling: world first).
    This tab routes to what needs your eyes.
  </div>
  <a href="BOHEMIA_HOUSE_SKIN_JUDGE_7_21_26.html" style="display:block;text-decoration:none;background:#181a12;border:1px solid #3f8c3f;border-radius:12px;padding:14px;margin-bottom:14px">
    <div style="font:700 15px -apple-system,sans-serif;color:#8fd08f">HOUSE SKIN JUDGE <span style="font:600 10px sans-serif;background:#3f8c3f;color:#fff;border-radius:4px;padding:2px 6px;vertical-align:2px">NEW 7/21</span></div>
    <div style="font:12px/1.5 -apple-system,sans-serif;color:#9a9480;margin:4px 0 8px">
      __COUNT__ painted house skins: SHINGLE roofs (Paolo's ruling - "idgaf about the
      material, they look like shingles") plus the researched S-tile batch for the record,
      tan stucco walls, dead dark windows, BOARDED windows, weathered doors, DG gravel
      yards. Each shown on a composed house. Thumb them and export - the canon suburbs
      get real art the moment you rule.
    </div>
    <div style="display:flex;gap:6px">__TEASERS__</div>
  </a>
  <a href="BOHEMIA_LIFE_SLICE_7_19_26.html" style="display:block;text-decoration:none;background:#181a12;border:1px solid #444;border-radius:12px;padding:14px">
    <div style="font:700 15px -apple-system,sans-serif;color:#cdbd8a">THE LIVING BLOCK <span style="font:600 10px sans-serif;background:#444;color:#ccc;border-radius:4px;padding:2px 6px;vertical-align:2px">DORMANT</span></div>
    <div style="font:12px/1.5 -apple-system,sans-serif;color:#9a9480;margin-top:4px">
      The 7/19 demo: the approved block with households living a full day on the 120 BPM
      clock. Parked until the world is built - kept here so nothing gets lost.
    </div>
  </a>
</div>
</body>
"""
imgs = ''.join('<img src="data:image/png;base64,%s" style="width:56px;height:56px;image-rendering:pixelated;border-radius:6px">' % b for b in teasers)
html = html.replace('__TEASERS__', imgs).replace('__COUNT__', str(count))
open(CUR, 'w', encoding='utf8').write(html)
print('LIFE hub -> %s (judge + dormant living block)' % CUR)
