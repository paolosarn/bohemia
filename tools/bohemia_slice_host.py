#!/usr/bin/env python3
"""BOHEMIA SLICE HOST GENERATOR (7/18/26)

Builds slices/BOHEMIA_CURRENT_SLICE.html — the STABLE URL the alpha's
live-slice tab points at. It reads slices/SLICES_MANIFEST.json (the single
source of truth) and inlines it, so the loader works on file:// AND on
GitHub Pages with no fetch/CORS dance. It shows the current slice's
title/note with an ENTER button that loads the slice full-bleed in an
iframe; a thin back bar returns to the card. Designed to sit inside the
alpha as an iframe panel (one new tab) OR stand alone.

Why a loader + manifest instead of linking the slice directly: updating
the slice becomes a one-line manifest edit + a regen here — the 31 MB
alpha never has to change again. No catalog now (just the current
pointer); when the game ships, manifest.entries can grow into a real
catalog and this page can list them.

Run from repo root: python3 tools/bohemia_slice_host.py
"""
import json
import sys

MAN = 'slices/SLICES_MANIFEST.json'
OUT = 'slices/BOHEMIA_CURRENT_SLICE.html'


def main():
    man = json.load(open(MAN))
    cur = next((e for e in man['entries'] if e['id'] == man['current']), None)
    if cur is None:
        print("SLICE HOST REFUSES: manifest 'current' (%r) has no entry" % man['current'])
        return 1
    data = json.dumps(man)
    html = TEMPLATE.replace('/*MANIFEST*/', data)
    open(OUT, 'w', encoding='utf-8').write(html)
    print('slice host: current=%s (%s) -> %s' % (cur['id'], cur['file'], OUT))
    return 0


TEMPLATE = r"""<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BOHEMIA — LIVE SLICE</title><style>
html,body{margin:0;height:100%;background:#0d0d12;color:#e8e4da;
 font-family:-apple-system,system-ui,sans-serif}
#card{padding:16px;max-width:560px;margin:0 auto}
h1{font-size:16px;color:#b39ddb;font-weight:800;margin:6px 0 2px;letter-spacing:1px}
.date{font-size:12px;color:#8f8676;margin-bottom:10px}
.note{font-size:14px;line-height:1.5;background:#1a1a22;border:2px solid #3a3a44;
 border-radius:10px;padding:12px;margin-bottom:14px}
button{font:800 15px -apple-system,system-ui,sans-serif;padding:14px 18px;border-radius:12px;
 border:2px solid #6a3fb5;background:#2a2a34;color:#e8e4da;width:100%}
.more{font-size:12px;color:#8f8676;margin-top:14px}
.more b{color:#b39ddb}
#stage{position:fixed;inset:0;display:none;flex-direction:column;background:#0d0d12}
#bar{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:2px solid #3a3a44;flex:0 0 auto}
#bar button{width:auto;padding:8px 12px;font-size:13px;border-color:#3a3a44}
#bar span{font-size:13px;color:#b39ddb;font-weight:800}
iframe{border:0;flex:1 1 auto;width:100%}
</style></head><body>
<div id="card">
<div class="date" id="hdate"></div>
<h1 id="htitle"></h1>
<div class="note" id="hnote"></div>
<button onclick="enter()">ENTER THE SLICE &#9654;</button>
<div class="more" id="hmore"></div>
</div>
<div id="stage"><div id="bar"><button onclick="leave()">&#9664; BACK</button><span id="stitle"></span></div><iframe id="frame"></iframe></div>
<script>
var MAN=/*MANIFEST*/;
var cur=MAN.entries.filter(function(e){return e.id===MAN.current;})[0];
document.getElementById('htitle').textContent=cur.title;
document.getElementById('hdate').textContent=cur.date+'  ·  live dev slice';
document.getElementById('hnote').textContent=cur.note;
document.getElementById('stitle').textContent=cur.title;
var n=MAN.entries.length;
document.getElementById('hmore').innerHTML=(n>1?('<b>'+n+'</b> slices archived. '):'')+
 'This is the current build. The catalog grows as the game does.';
function enter(){var f=document.getElementById('frame');
 if(!f.src)f.src=cur.file;
 document.getElementById('stage').style.display='flex';}
function leave(){document.getElementById('stage').style.display='none';}
</script></body></html>
"""


if __name__ == '__main__':
    sys.exit(main())
