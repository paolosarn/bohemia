#!/usr/bin/env python3
"""BOHEMIA PATROL WIRING — PATROL INTO THE SLICE (7/17/26)

Wires bohemia_patrol.js into V11's walkable loop. The module goes in VERBATIM
(the sync gate treats an identical inline body as the same canon; V11 already
carries BOH_LIGHT / BOH_DAYCYCLE / BOH_SLICE the same way). The ROSTER is
computed here at build time with the real modules, exactly like V10 computed
its powerMap truth at bake time:

    BOH_OVERMAP.buildOvermap(12345) -> BOH_POWERGRID.powerMap -> per-cell owner
    BOH_PATROL.patrolsFor(block, cell, power, seed) -> patrols, routes in
    block-local coords -> mapped to slice rows here.

Today every one of V11's four cells is DEAD, so the roster is EMPTY. That is
not a stub: NOBODY PATROLS THE DARK is the law, and the slice gate proves the
empty roster is what the modules dictate. The walkers, the occupancy checks
and the I-MOVE-YOU-MOVE advance are all live code waiting for the first slice
that contains a lit circuit.

Idempotent: re-running replaces the previous injection.
Run from repo root: python3 tools/bohemia_patrol_v11.py [--dry]
"""
import json
import re
import subprocess
import sys

V11 = 'slices/BOHEMIA_LIVE_SLICE_V11_7_16_26.html'
PATROL_MODULE = 'engine/bohemia_patrol.js'
SEED = 12345

# (top_row, height, lanes, sidewalk_rows_per_side, overmap cell) — the anatomy
# verified against the bake by tools/bohemia_lamps_v11.py, same table.
BLOCKS = [
    (3,  7,  1, 1, (33, 6)),
    (12, 7,  1, 1, (34, 6)),
    (21, 21, 3, 2, (35, 6)),
    (44, 19, 3, 1, (36, 6)),
]


def fail(msg):
    print('PATROL WIRING REFUSES: ' + msg)
    sys.exit(1)


def roster():
    """Ask the real modules for the roster, block by block."""
    blocks_js = json.dumps([
        {'top': top, 'H': H, 'sw': sw, 'cell': list(cell)}
        for top, H, lanes, sw, cell in BLOCKS])
    js = """
const OM=require('./engine/bohemia_overmap.js');
const PG=require('./engine/bohemia_powergrid.js');
const PT=require('./engine/bohemia_patrol.js');
const pm=PG.powerMap(OM.buildOvermap(%d),%d);
const out=[];
for(const b of %s){
  // synthetic block grid: row-uniform cells, 'side' on the sidewalk rows —
  // the exact shape routeFor/patrolsFor read (they only look at cell.g).
  const grid=[];
  for(let y=0;y<b.H;y++){const side=(y<b.sw||y>=b.H-b.sw);
    grid.push(Array.from({length:24},()=>({g:side?'side':'lane'})));}
  const ps=PT.patrolsFor({W:24,H:b.H,grid},b.cell,pm,%d);
  out.push({cell:b.cell,power:pm.at(b.cell[0],b.cell[1]),
    patrols:ps.map(p=>({owner:p.owner,i:p.i,dir:p.dir,paused:p.paused,id:p.id,
      style:p.style,walkCells:p.walkCells,
      route:p.route.map(([x,y])=>[x,y+b.top])}))});   // block-local -> slice rows
}
console.log(JSON.stringify(out));
""" % (SEED, SEED, blocks_js, SEED)
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        fail('module query failed: ' + r.stderr[:300])
    return json.loads(r.stdout)


def main():
    dry = '--dry' in sys.argv
    html = open(V11, encoding='utf-8').read()
    blocks = roster()
    patrols = [p for b in blocks for p in b['patrols']]
    for b in blocks:
        s = b['power']
        print('  cell %s -> %s -> %d patrol(s)' % (
            tuple(b['cell']),
            'LIVE (%s)' % s['owner'] if s['live'] else 'dead',
            len(b['patrols'])))
    print('roster: %d patrol(s) total' % len(patrols))

    module_src = open(PATROL_MODULE, encoding='utf-8').read()
    module_tag = ('<script>/*PATROL-MODULE: verbatim engine/bohemia_patrol.js, '
                  'the sync gate arbitrates*/\n' + module_src + '</script>')
    payload = ('/*PATROL-PAYLOAD*/const PATROLS=%s;'
               'const patrolWalkers=PATROLS.map((p,k)=>BOH_PATROL.makeWalker(p,4242+k*31));'
               '/*/PATROL-PAYLOAD*/' % json.dumps(patrols))
    # patrols are bodies: they block cells like everyone else (OCCUPANCY LAW)
    actor_add = ("/*PATROL-OCC*/"
                 " for(let i=0;i<patrolWalkers.length;i++){const w=patrolWalkers[i];"
                 "if(w.p.id===self)continue;const c=w.cell();"
                 "if(c[0]===nx&&c[1]===ny)return true;}/*/PATROL-OCC*/")
    # I-MOVE-YOU-MOVE: patrols advance on the player's step, occupancy-checked
    step = ("/*PATROL-STEP*/patrolWalkers.forEach(w=>{const n=w.intent();"
            "w.commit(n?WORLD.passable(n[0],n[1],w.p.id):true);});/*/PATROL-STEP*/")
    # owner colors are PLACEHOLDER GRAYS: patrol color canon is Paolo's call,
    # and purple is the Amalgamation's alone. Zero patrols render today anyway.
    draw = ("/*PATROL-DRAW*/const PATROL_TONE={settlement:'#8a7f6a',faction:'#6a5f56',"
            "network:'#9aa0a8'};patrolWalkers.forEach(w=>{const c=w.cell();"
            "const qx=c[0]*CELL,qy=c[1]*CELL;sctx.fillStyle=PATROL_TONE[w.p.owner]||'#777';"
            "sctx.beginPath();sctx.arc(qx+CELL/2,qy+CELL*0.28,CELL*0.17,0,7);sctx.fill();"
            "sctx.fillRect(qx+CELL*0.3,qy+CELL*0.42,CELL*0.4,CELL*0.42);});/*/PATROL-DRAW*/")

    for tag in ('PATROL-PAYLOAD', 'PATROL-OCC', 'PATROL-STEP', 'PATROL-DRAW'):
        html = re.sub(r'/\*%s\*/.*?/\*/%s\*/' % (tag, tag), '', html, flags=re.S)
    html = re.sub(r'<script>/\*PATROL-MODULE.*?</script>', '', html, flags=re.S)

    anchor = '<script>\nconst cv=document.getElementById'
    if anchor not in html:
        fail('main script anchor missing')
    html = html.replace(anchor, module_tag + anchor, 1)

    anchor = "let guy={x:12,y:6,px:12,py:6,fx:1,fy:0};"
    if anchor not in html:
        fail('guy anchor missing')
    html = html.replace(anchor, anchor + payload, 1)

    anchor = " return false;\n}\n"  # end of actorAt
    m = re.search(r'function actorAt\(nx,ny,self\)\{.*?\n return false;\n\}', html, re.S)
    if not m:
        fail('actorAt anchor missing')
    html = html.replace(m.group(0), m.group(0).replace(
        '\n return false;\n}', actor_add + '\n return false;\n}'), 1)

    anchor = ' NPCS.forEach(n=>n.brain.tick(rt,TURN,WORLD));}'
    if anchor not in html:
        fail('step anchor missing')
    html = html.replace(anchor, ' NPCS.forEach(n=>n.brain.tick(rt,TURN,WORLD));' + step + '}', 1)

    anchor = '/*LAMPS-DRAW*/'
    if anchor not in html:
        fail('draw anchor missing (lamps must be injected first)')
    html = html.replace(anchor, draw + anchor, 1)

    n_live = sum(1 for b in blocks if b['power']['live'])
    html = html.replace('</div>\n<script>',
        ' PATROL LAW wired: owners walk what they light, on your beat, one body per '
        'cell. The power grid rules every circuit here dead, so the roster is empty: '
        'an empty street IS the reading. Walk into owned light someday and somebody '
        'will be walking it.</div>\n<script>', 1)

    if dry:
        print('DRY RUN: no write. module %d bytes, payload %d bytes'
              % (len(module_tag), len(payload)))
        return
    open(V11, 'w', encoding='utf-8').write(html)
    print('wired into %s (%d bytes), %d live cells on slice' % (V11, len(html), n_live))


if __name__ == '__main__':
    main()
