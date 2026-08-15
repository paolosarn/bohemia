#!/usr/bin/env python3
"""BOHEMIA SURFACE AUDIT -- which of the 30 INTEGRATED rows are on the surface he
walks, and which are on the one he never sees (8/15/26, FACTIONS lane)

WHY THIS EXISTS. On 8/14 I found that four turns of my own player-facing work was
on slices/BOHEMIA_RUN_CURRENT.html -- preloaded on every visit and NEVER DISPLAYED
since the coordinator ruled the CITY WORLD the walked surface. I migrated my three
systems and fixed my three ledger rows.

THEN I READ THE LEDGER AND COUNTED. It has 30 rows claiming INTEGRATED, and
gates/integration_gate.js reads BOHEMIA_RUN_CURRENT.html for ALL of them. Three of
those rows now name their surface. TWENTY-SEVEN DO NOT. Every one of them is a
green claim whose evidence comes from a file nobody sees, and no reader can tell
which of them are also true where he plays.

The ledger's own header has said this since 8/4:

  "Every probe below reads slices/BOHEMIA_RUN_CURRENT.html. The RUN tab does not
   display that file. ... This does not mean the rows are lies. They are true about
   the file they name. It means the greens below are not evidence about the surface
   he plays, and NO READER CAN TELL WHICH ONES ARE."

A warning nobody can act on is not a warning, it is a disclaimer. This turns it
into a LIST.

*** WHAT THIS IS NOT. *** It is not a verdict on another lane's work, and it does
not touch another lane's code. ONE SYSTEM, ONE SESSION. The honest claim it makes
is narrow and stated on every row:

    THE EVIDENCE THIS ROW'S OWN PROBE LOOKS FOR IS / IS NOT PRESENT ON THE
    WALKED SURFACE.

A system can be live in the city under a DIFFERENT SPELLING -- the ledger header
says so outright ("most ARE on his surface ... each under its own spelling"), and
the city is a separate renderer that shares almost no drawing code with the run. So
NOT FOUND means GO AND LOOK, addressed to the lane that owns the row. It never
means BROKEN, and this file says that on the row, on the page, and in the gate.

REUSE CHECK (7/22 law):
  - gates/integration_gate.js ..... OPENED IN CODE. The probes are read out of it
    and their literal search strings extracted, so this audit can never test for
    evidence a row's probe does not actually use. Nothing is retyped.
  - records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md ... OPENED IN CODE for the
    rows, their statuses and their probe names.
  - slices/BOHEMIA_CITY_WORLD.html, BOHEMIA_RUN_CURRENT.html ... OPENED IN CODE and
    searched. Both, so a row that is on NEITHER is distinguishable from one that
    merely moved.
  - slices/BOHEMIA_WHAT_THEY_WANT_8_12_26.html ... COPIED BY HAND as the page FORM.
    No bytes of it are opened.
  - nothing is drawn, nothing is cooked, no lane's code is edited.

  python3 tools/bohemia_surface_audit.py

Writes: records/BOHEMIA_SURFACE_AUDIT_8_15_26.md
        slices/BOHEMIA_WHICH_SURFACE_8_15_26.html   (LIFE tab)

Law:  laws/BOHEMIA_ADDENDUM_THE_WALKED_SURFACE_IS_THE_GAME_8_14_26.md
Gate: gates/walked_surface_gate.js
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
GATE = os.path.join(ROOT, 'gates/integration_gate.js')
LEDGER = os.path.join(ROOT, 'records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md')
RUN = os.path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html')
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
OUT_MD = os.path.join(ROOT, 'records/BOHEMIA_SURFACE_AUDIT_8_15_26.md')
OUT_HTML = os.path.join(ROOT, 'slices/BOHEMIA_WHICH_SURFACE_8_15_26.html')


def read(p):
    if not os.path.exists(p):
        sys.exit('MISSING: ' + p)
    with open(p, 'r', encoding='utf-8') as f:
        return f.read()


def probes(src):
    """every probe in integration_gate, and the literal strings it searches for.

    Read out of the gate rather than retyped, so this audit can never test for
    evidence a probe does not actually use. A probe that searches nothing (it only
    reads a module, or calls a helper) is reported as UNSEARCHABLE rather than
    guessed at -- a probe this tool cannot read is a probe it must not judge.
    """
    out = {}
    # name: () => ...  up to the next top-level probe or the closing brace
    for m in re.finditer(r'^  ([a-z_][a-z_0-9]*): \(\) =>(.*?)(?=^  [a-z_][a-z_0-9]*: \(\) =>|^\};)',
                         src, re.M | re.S):
        name, body = m.group(1), m.group(2)
        # only the strings tested against the RUN document; a probe that reads an
        # engine module or the alpha is asking a different question entirely.
        lits = []
        for lm in re.finditer(r"RUN\.(?:indexOf|includes)\(\s*('([^']*)'|\"([^\"]*)\")", body):
            lits.append(lm.group(2) if lm.group(2) is not None else lm.group(3))
        # a regex tested against RUN counts too, but only when it is a plain literal
        for lm in re.finditer(r'/([^/\n]{6,})/\s*\.test\(RUN\)', body):
            pat = lm.group(1)
            if not re.search(r'[\\\[\](){}|+*?^$]', pat):
                lits.append(pat)
        # DOES THE PROBE READ THE WALKED SURFACE AT ALL? A probe that never touches
        # CITY cannot prove anything about where he plays, whatever its strings
        # happen to also match. That is the question this audit is asking, so it is
        # asked directly rather than inferred from a string search.
        out[name] = {'lits': lits, 'reads_run': 'RUN' in body,
                     'reads_city': bool(re.search(r'\bCITY\b', body)),
                     'body': re.sub(r'\s+', ' ', body).strip()[:400]}
    return out


def rows(src):
    """the ledger's table rows: name | status | probe | notes."""
    out = []
    for line in src.split('\n'):
        if not line.startswith('| '):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) < 3:
            continue
        if cells[1].upper() not in ('INTEGRATED', 'PARTIAL', 'NOT YET'):
            continue
        out.append({'name': cells[0], 'status': cells[1], 'probe': cells[2],
                    'notes': cells[3] if len(cells) > 3 else ''})
    return out


VERDICTS = {
    'walked':   'ON THE WALKED SURFACE',
    'legacy':   'ONLY ON THE ONE HE NEVER SEES',
    'neither':  'ON NEITHER, BY ITS OWN EVIDENCE',
    'unknown':  'CANNOT TELL FROM ITS PROBE',
}


def audit():
    gate, led = read(GATE), read(LEDGER)
    run, city = read(RUN), read(CITY)
    P, R = probes(gate), rows(led)
    out = []
    for r in R:
        p = P.get(r['probe'])
        if p and p.get('reads_city'):
            # it checks itself where he looks. That IS the claim, and no string
            # search can overrule a probe that already asks the right question.
            v, hit, tot = 'walked', 1, 1
        elif not p or not p['lits']:
            v, hit, tot = 'unknown', 0, 0
        else:
            tot = len(p['lits'])
            hit = sum(1 for s in p['lits'] if s in city)
            inrun = sum(1 for s in p['lits'] if s in run)
            if hit == tot:
                v = 'walked'
            elif inrun and not hit:
                v = 'legacy'
            elif not inrun and not hit:
                v = 'neither'
            else:
                v = 'legacy'          # partial: some evidence missing where he plays
        r.update(verdict=v, hit=hit, tot=tot,
                 says_surface=bool(re.search(r'WALKED SURFACE|CITY WORLD', r['notes'], re.I)))
        out.append(r)
    return out


MD = """# BOHEMIA — WHICH SURFACE IS EACH ROW TRUE ABOUT? (8/15/26, FACTIONS lane)

The integration ledger has **{total} rows**. `gates/integration_gate.js` reads
`slices/BOHEMIA_RUN_CURRENT.html` for every one of them — the file the alpha
preloads and **never displays** since the coordinator ruled the CITY WORLD the
walked surface on 8/14.

The ledger's own header has said so since **8/4**: *"the greens below are not
evidence about the surface he plays, and no reader can tell which ones are."* A
warning nobody can act on is a disclaimer. This is the list.

## THE CLAIM THIS MAKES, AND THE ONE IT DOES NOT

For each row: **is the evidence that row's own probe looks for present on the
walked surface?**

**NOT FOUND does not mean broken.** The city is a separate renderer that shares
almost no drawing code with the run, and the ledger header says most systems *are*
there "each under its own spelling". So NOT FOUND means **go and look** — addressed
to the lane that owns the row, by the lane that just made this exact mistake with
its own three rows.

## THE COUNT

| | rows |
|---|---|
| {w_label} | **{walked}** |
| {l_label} | **{legacy}** |
| {n_label} | **{neither}** |
| {u_label} | **{unknown}** |

## EVERY ROW

| system | status | probe | its evidence on the walked surface | row names its surface |
|---|---|---|---|---|
{table}

---
*Generated by tools/bohemia_surface_audit.py. No lane's code is touched by this
file; it reads the ledger, the gate's own probes, and the two surfaces.*
"""


def main():
    A = audit()
    counts = {k: sum(1 for r in A if r['verdict'] == k) for k in VERDICTS}
    table = '\n'.join(
        '| %s | %s | `%s` | %s%s | %s |' % (
            r['name'], r['status'], r['probe'], VERDICTS[r['verdict']],
            (' (%d/%d)' % (r['hit'], r['tot'])) if r['tot'] else '',
            'yes' if r['says_surface'] else '**no**')
        for r in A)
    md = MD.format(total=len(A), table=table,
                   walked=counts['walked'], legacy=counts['legacy'],
                   neither=counts['neither'], unknown=counts['unknown'],
                   w_label=VERDICTS['walked'], l_label=VERDICTS['legacy'],
                   n_label=VERDICTS['neither'], u_label=VERDICTS['unknown'])
    with open(OUT_MD, 'w', encoding='utf-8') as f:
        f.write(md)

    payload = json.dumps({'rows': A, 'counts': counts, 'verdicts': VERDICTS},
                         ensure_ascii=False)
    with open(OUT_HTML, 'w', encoding='utf-8') as f:
        f.write(PAGE.replace('__DATA__', payload))

    print('SURFACE AUDIT: %d rows' % len(A))
    for k in ('walked', 'legacy', 'neither', 'unknown'):
        print('  %-32s %d' % (VERDICTS[k], counts[k]))
    print('  wrote %s' % os.path.relpath(OUT_MD, ROOT))
    print('  wrote %s' % os.path.relpath(OUT_HTML, ROOT))


PAGE = r'''<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>WHICH SURFACE</title>
<style>
:root{--bg:#0d0b09;--ink:#e9e2d2;--dim:#8b8272;--line:#2a251d;--card:#161310;--hot:#cdbd8a;
 --bad:#d98a6a;--ok:#8fbf7a}
body.sun{--bg:#efe9dc;--ink:#1a1712;--dim:#5d564a;--line:#c9c0ac;--card:#fdfaf2;--hot:#6b5a24;
 --bad:#9d3d12;--ok:#3d6b2a}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
 font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;-webkit-text-size-adjust:100%}
header{position:sticky;top:0;z-index:9;background:var(--bg);border-bottom:1px solid var(--line);
 padding:14px 14px 10px}
h1{margin:0;font-size:16px;letter-spacing:.09em}
.sub{color:var(--dim);font-size:11.5px;margin-top:5px;line-height:1.45}
.bar{display:flex;gap:7px;margin-top:10px;flex-wrap:wrap}
button{font:inherit;font-size:11px;letter-spacing:.06em;background:var(--card);color:var(--ink);
 border:1px solid var(--line);border-radius:7px;padding:7px 11px}
button.on{background:var(--hot);color:var(--bg);border-color:var(--hot)}
main{padding:12px 12px 60px;max-width:760px;margin:0 auto}
.tot{display:flex;gap:8px;flex-wrap:wrap;margin:2px 0 10px}
.t{flex:1 1 44%;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:11px}
.t b{display:block;font:700 26px ui-monospace,monospace;letter-spacing:.02em}
.t span{font-size:10.5px;color:var(--dim);letter-spacing:.05em;line-height:1.35;display:block;margin-top:3px}
.c{background:var(--card);border:1px solid var(--line);border-radius:11px;padding:12px;margin:9px 0}
.nm{font-weight:700;letter-spacing:.05em;font-size:12.5px}
.v{font-size:10.5px;letter-spacing:.06em;margin-top:5px}
.v.walked{color:var(--ok)} .v.legacy{color:var(--bad)} .v.neither{color:var(--bad)}
.v.unknown{color:var(--dim)}
.meta{color:var(--dim);font-size:10.5px;margin-top:4px}
.foot{color:var(--dim);font-size:11px;padding:16px 2px;line-height:1.6}
</style></head><body>
<header>
<h1>WHICH SURFACE IS IT ON?</h1>
<div class="sub">The scoreboard has 30 systems marked INTEGRATED, and every one of those checks
reads the app you never see. I found that out the hard way with my own three yesterday. This is
the same question asked of all of them. <b>NOT FOUND does not mean broken</b> &mdash; the city is
a different renderer and a lot of this is there under another name. It means go and look.</div>
<div class="bar"><button id="sun">SUN MODE</button><button id="only">ONLY THE FLAGGED</button></div>
</header>
<main id="m"></main>
<script>
var D=__DATA__;
var ONLY=false;
function esc(s){ return String(s==null?'':s).replace(/[&<>]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }
function draw(){
  var rows=D.rows.filter(function(r){ return !ONLY || r.verdict!=='walked'; });
  var c=D.counts;
  document.getElementById('m').innerHTML =
    '<div class="tot">'
    +'<div class="t"><b style="color:var(--ok)">'+c.walked+'</b><span>'+esc(D.verdicts.walked)+'</span></div>'
    +'<div class="t"><b style="color:var(--bad)">'+c.legacy+'</b><span>'+esc(D.verdicts.legacy)+'</span></div>'
    +'<div class="t"><b style="color:var(--bad)">'+c.neither+'</b><span>'+esc(D.verdicts.neither)+'</span></div>'
    +'<div class="t"><b style="color:var(--dim)">'+c.unknown+'</b><span>'+esc(D.verdicts.unknown)+'</span></div>'
    +'</div>'
    + rows.map(function(r){
        return '<div class="c"><div class="nm">'+esc(r.name)+'</div>'
          +'<div class="v '+r.verdict+'">'+esc(D.verdicts[r.verdict])
          +(r.tot?(' &middot; '+r.hit+' of '+r.tot+' of its own checks'):'')+'</div>'
          +'<div class="meta">'+esc(r.status)+' &middot; '+esc(r.probe)
          +(r.says_surface?'':' &middot; the row does not say which surface')+'</div></div>';
      }).join('')
    +'<div class="foot">Read out of the scoreboard and the checker itself, never retyped, so it '
    +'cannot test for evidence a check does not actually use. A row whose check does not search '
    +'the app at all is counted as CANNOT TELL rather than guessed at. Nothing in this page edits '
    +'anybody\'s code.</div>';
}
document.getElementById('sun').addEventListener('click',function(){
  document.body.classList.toggle('sun'); this.classList.toggle('on'); });
document.getElementById('only').addEventListener('click',function(){
  ONLY=!ONLY; this.classList.toggle('on', ONLY); draw(); });
draw();
</script></body></html>
'''


if __name__ == '__main__':
    main()
