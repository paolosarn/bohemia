#!/usr/bin/env python3
"""BOHEMIA ANSWER SHEET — every pixel on the plot, written down, where he can see it.

PAOLO 7/31: "Commercial rebuilt is like 65 % mall is like 40% i need you to be able to
write about everything u draw at all times not a single pixel on screen answered for bro"
Law: laws/BOHEMIA_ADDENDUM_EVERY_PIXEL_ANSWERED_7_31_26.md

WHY A PAGE AND NOT A DOSSIER. The write-ups already existed — records/tilespec/ has a sheet
per district and the DISTRICT DOSSIER LAW has demanded one since 7/19. Both were green when
he scored these 65% and 40%. He does not dig in files (CLAUDE.md, first section), so a
dossier he never opens is not an answer, it is an alibi. This puts the render and the
written account of every colour in it ON ONE SCREEN, so a colour with no line is a bug you
can SEE instead of a bug you have to audit.

WHAT IT SHOWS, per district:
  - the plot as the game paints it, eave pass and all (the REAL surface, 7/18)
  - every code in the grid: swatch, name, what it IS in act 1, its layer, whether it
    blocks you, what is inside it if you can go in, its tile count and its share of the plot
  - THE MONOBLOCK BAR: the share of the plot taken by its single biggest code. That number
    is the one that scored 40% — a mall that is 39.5% "parking asphalt" is a district where
    two-fifths of the pixels have one flat sentence between them.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): this tool cooks ZERO new graphic pixels. It opens
no art bank because it authors no art — it renders the district generators' own grids
through their own palettes, using K.buildingEdges for the eave exactly like
engine/bohemia_valleymap.js does, so the picture on the sheet is the picture in the game.

  python3 tools/bohemia_answer_sheet.py            # every registered district
  python3 tools/bohemia_answer_sheet.py mall       # one
"""
import base64
import io
import json
import os
import subprocess
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)
OUT = 'slices/BOHEMIA_ANSWER_SHEET_7_31_26.html'
SCALE = 3

DUMP = """
const K = require('./engine/bohemia_district_kit.js');
const fs = require('fs');
for (const f of fs.readdirSync('engine')) {
  if (!/^bohemia_.*\\.js$/.test(f) || /test|kit/.test(f)) continue;
  try { require('./engine/' + f); } catch (e) {}
}
const out = {};
for (const n of K.types()) {
  const d = K.get(n);
  if (!d || !d.generate || !d.legend || !d.palette) continue;
  let r; try { r = d.generate(11, { streets: ['S'] }); } catch (e) { continue; }
  const counts = {};
  for (const row of r.g) for (const c of row) counts[c] = (counts[c] || 0) + 1;
  const legend = {};
  for (const c of Object.keys(d.legend)) {
    const e = d.legend[c], L = K.tileLayer(e);
    legend[c] = { name: e.name, kind: e.kind, act1: e.act1 || '',
                  layer: L.layer, solid: L.solid, enter: L.enter };
  }
  out[n] = { g: r.g, pal: d.palette, legend: legend, counts: counts,
             edges: Object.keys(K.buildingEdges(r.g, d.legend)),
             notes: d.notes || null, category: K.category(n) };
}
process.stdout.write(JSON.stringify(out));
"""


def lighten(hx, f=0.28):
    v = [int(hx[i:i + 2], 16) for i in (1, 3, 5)]
    return tuple(round(n + (255 - n) * f) for n in v)


def render(g, pal, edges, scale=SCALE):
    n = len(g)
    im = Image.new('RGB', (n * scale, n * scale))
    px = im.load()
    for y in range(n):
        for x in range(n):
            v = str(g[y][x])
            hx = '#463f30' if v == '0' else pal.get(v, '#ff00ff')
            c = lighten(hx) if ('%d,%d' % (x, y)) in edges else (
                int(hx[1:3], 16), int(hx[3:5], 16), int(hx[5:7], 16))
            for dy in range(scale):
                for dx in range(scale):
                    px[x * scale + dx, y * scale + dy] = c
    b = io.BytesIO()
    im.save(b, 'PNG')
    return base64.b64encode(b.getvalue()).decode('ascii')


def esc(s):
    return (s or '').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    raw = subprocess.run(['node', '-e', DUMP], capture_output=True, text=True, check=True).stdout
    data = json.loads(raw)
    names = sorted(k for k in data if not only or k == only)

    cards = []
    for n in names:
        d = data[n]
        area = len(d['g']) * len(d['g'][0])
        counts = {int(k): v for k, v in d['counts'].items()}
        rows = sorted(counts, key=lambda c: -counts[c])
        biggest = rows[0] if rows else 0
        mono = 100.0 * counts.get(biggest, 0) / area
        img = render(d['g'], d['pal'], set(d['edges']))

        lines = []
        for c in rows:
            e = d['legend'].get(str(c)) or {}
            pct = 100.0 * counts[c] / area
            unanswered = len(e.get('act1') or '') < 40
            lines.append(
                '<tr class="%s"><td><i style="background:%s"></i></td>'
                '<td class="c">%d</td><td class="n">%s</td>'
                '<td class="a">%s</td><td class="l">%s%s</td>'
                '<td class="p">%s</td><td class="t">%d</td></tr>' % (
                    'bad' if unanswered else '',
                    d['pal'].get(str(c), '#ff00ff'), c,
                    esc(e.get('name') or '?? UNNAMED'),
                    esc(e.get('act1') or 'NOTHING WRITTEN — this is the bug'),
                    esc(e.get('layer') or '?'),
                    ' · blocks' if e.get('solid') else '',
                    ('%.1f%%' % pct), counts[c]))

        enters = [str(e.get('enter')) for e in d['legend'].values() if e.get('enter')]
        cards.append(
            '<section><h2>%s <span class="cat">%s</span></h2>'
            '<div class="row"><img src="data:image/png;base64,%s" alt="%s">'
            '<div class="side">'
            '<div class="mono %s">BIGGEST SINGLE CODE: <b>%.1f%%</b> of the plot '
            '&mdash; %s</div>'
            '<div class="meta">%d codes on this plot &middot; %d of them you can go inside</div>'
            '<table><tr><th></th><th>#</th><th>name</th><th>what it is, act 1</th>'
            '<th>layer</th><th>plot</th><th>tiles</th></tr>%s</table>'
            '</div></div></section>' % (
                esc(n).upper(), esc(d.get('category') or ''), img, esc(n),
                'hot' if mono >= 30 else '', mono,
                esc((d['legend'].get(str(biggest)) or {}).get('name') or '?'),
                len(rows), len(enters), ''.join(lines)))

    html = """<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BOHEMIA — THE ANSWER SHEET</title>
<style>
body{margin:0;background:#131118;color:#e8e0cc;font:14px/1.5 ui-monospace,Menlo,monospace}
header{padding:18px 14px;border-bottom:1px solid #2a2433}
h1{margin:0 0 6px;font-size:19px;letter-spacing:1px;color:#f0e6c8}
.q{color:#b9a97e;font-style:italic;margin:0 0 4px}
.sub{color:#8a8070;font-size:12px}
section{padding:20px 14px;border-bottom:1px solid #221d2b}
h2{margin:0 0 12px;font-size:16px;letter-spacing:1px;color:#f0e6c8}
.cat{color:#7a7160;font-size:11px;letter-spacing:2px;margin-left:8px}
.row{display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start}
img{image-rendering:pixelated;width:384px;max-width:100%;border:1px solid #2a2433;flex:0 0 auto}
.side{flex:1 1 460px;min-width:300px}
.mono{padding:7px 10px;border:1px solid #2a2433;border-radius:4px;margin-bottom:8px;color:#c9bd94}
.mono.hot{border-color:#7a3a34;background:#2a1a18;color:#e9b9ae}
.meta{color:#8a8070;font-size:12px;margin-bottom:10px}
table{border-collapse:collapse;width:100%}
th{text-align:left;font-size:10px;letter-spacing:1px;color:#7a7160;border-bottom:1px solid #2a2433;padding:4px 6px}
td{padding:5px 6px;border-bottom:1px solid #1d1926;vertical-align:top;font-size:12px}
i{display:block;width:15px;height:15px;border:1px solid #000;border-radius:2px}
.c{color:#6f6857}.n{color:#e8e0cc;white-space:nowrap}.a{color:#a99f86}
.l{color:#7f8f9a;white-space:nowrap}.p{color:#d8cb9c;text-align:right;white-space:nowrap}
.t{color:#6f6857;text-align:right}
tr.bad td{background:#2a1a18}
tr.bad .a{color:#e9a89e}
@media(max-width:760px){img{width:100%}}
</style>
<header><h1>THE ANSWER SHEET</h1>
<p class="q">"i need you to be able to write about everything u draw at all times
not a single pixel on screen answered for" &mdash; Paolo, 7/31/26</p>
<p class="sub">Every district as the game paints it, beside every colour in it and what
that colour IS. A swatch with no sentence is the bug. The red bar means one single code
owns 30%+ of the plot &mdash; that is area nobody has answered for yet, and it is what
scored the mall a 40.</p></header>
""" + ''.join(cards)

    open(OUT, 'w', encoding='utf-8').write(html)
    print('answer sheet -> %s (%d districts, %d KB)' % (OUT, len(names), len(html) // 1024))


if __name__ == '__main__':
    main()
