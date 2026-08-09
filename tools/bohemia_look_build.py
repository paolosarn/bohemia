#!/usr/bin/env python3
"""
BUILD THE LOOK TAB (8/8/26) — the page of pictures, so he never has to go find it.

Paolo 8/8, LOCKED (laws/BOHEMIA_ADDENDUM_SHOW_ME_PICTURES_IN_A_TAB_8_8_26.md):
  "don't say play the run so I can see the art assets and what's wrong ... show me
   pictures put it in one of the tabs ... I can't be exploring and hunting your new
   additions ... just give me pictures and put it in a tab"

tools/bohemia_look_shots.js takes the pictures off the REAL surface. This turns
them into the page the LOOK tab opens: newest first, one picture per thing, each
captioned in plain English with the tab it lives in (NAME THE TAB, 7/28).

THE PICTURES ARE LINKED, NOT INLINED, and that is deliberate. Base64-ing four
phone screenshots would put ~1.3 MB of churn into this page on EVERY reshoot, and
the repo budget (records/BOHEMIA_REPO_BUDGET_8_6_26.md) says the thing that kills
this project on schedule is per-commit weight nobody was watching. As separate
files under slices/look/, git deltas each picture on its own and the page itself
stays a few KB. slices/ is copied wholesale by the Pages workflow, so they publish.

NO JUDGING WIDGET HERE, ON PURPOSE. He asked to SEE things, not to thumb them.
The verdict surfaces already exist and adding thumbs to this page would turn "show
me" into another queue. If he wants to judge a batch, that is a judge tool.

  python3 tools/bohemia_look_build.py
    -> slices/BOHEMIA_LOOK_CURRENT.html
"""
import html
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

MANIFEST = 'records/BOHEMIA_LOOK_MANIFEST.json'
OUT = 'slices/BOHEMIA_LOOK_CURRENT.html'

if not os.path.exists(MANIFEST):
    sys.exit('LOOK: no manifest. Run tools/bohemia_look_shots.js first.')

data = json.load(open(MANIFEST, encoding='utf8'))
shots = data.get('shots') or []
if not shots:
    sys.exit('LOOK: the manifest holds no pictures. Refusing to build an empty tab.')

# newest first: the manifest carries a stamp per shot, and equal stamps keep
# insertion order reversed so the most recently taken picture leads.
shots = list(reversed(shots))

missing = [s for s in shots if not os.path.exists(os.path.join('slices', s['file']))]
if missing:
    sys.exit('LOOK: manifest names pictures that are not on disk: %s'
             % ', '.join(m['file'] for m in missing))

CARDS = []
for s in shots:
    CARDS.append(
        '<figure class="shot">'
        '<figcaption class="t">%s</figcaption>'
        '<img loading="lazy" src="%s" alt="%s">'
        '<figcaption class="c">%s</figcaption>'
        '</figure>' % (html.escape(s['title']), html.escape(s['file']),
                       html.escape(s['title']), html.escape(s['caption'])))

PAGE = """<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — LOOK</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;background:#0d0b09;color:#d8cdb4;
       font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;-webkit-text-size-adjust:100%%}
  header{position:sticky;top:0;z-index:2;background:#120f0c;border-bottom:1px solid #2a2216;
         padding:10px 12px}
  h1{margin:0;font-size:12px;letter-spacing:2px;color:#c8a848}
  .sub{margin-top:3px;font-size:11px;color:#8d8069}
  .wrap{padding:10px;max-width:520px;margin:0 auto}
  .shot{margin:0 0 22px;background:#141110;border:1px solid #2a2216;border-radius:10px;
        overflow:hidden}
  .shot img{display:block;width:100%%;height:auto;image-rendering:pixelated;background:#000}
  .t{padding:9px 11px 8px;font-size:12px;letter-spacing:1px;color:#e6d9b8;
     border-bottom:1px solid #241d14}
  .c{padding:9px 11px 11px;font-size:12px;color:#a89c82;border-top:1px solid #241d14}
  footer{padding:14px 12px 26px;color:#6d6455;font-size:11px;text-align:center}
</style></head><body>
<header>
  <h1>LOOK &mdash; WHAT IS NEW, IN PICTURES</h1>
  <div class="sub">%(n)d picture%(s)s &middot; taken off the real screen &middot; %(built)s</div>
</header>
<div class="wrap">
%(cards)s
</div>
<footer>Nothing to hunt for. If a thing is not pictured here it is NOT IN A TAB YET.</footer>
</body></html>
""" % {'n': len(shots), 's': '' if len(shots) == 1 else 's',
       'built': html.escape(str(data.get('built', ''))),
       'cards': '\n'.join(CARDS)}

open(OUT, 'w', encoding='utf8').write(PAGE)
kb = os.path.getsize(OUT) / 1024.0
print('LOOK TAB BUILT: %s (%.1f KB, %d picture(s), images linked not inlined)' % (OUT, kb, len(shots)))
for s in shots:
    print('   %-16s %s' % (s['id'], s['title']))
