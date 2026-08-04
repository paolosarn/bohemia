#!/usr/bin/env python3
"""
NOBODY STANDS IN THE STREET ALL DAY (8/4/26) — the head-on deadlock fix, carried
out of engine/bohemia_agents.js into every slice that inlines it.

THE BUG, MEASURED ON BLOCK SEED 9:

    H5-3   @111,18   wants 111,17   - held by H14-1
    H14-1  @111,17   wants 111,18   - held by H5-3

Two people who wanted to swap cells. Each one's next step was the other one's
body, so neither could move. They stood there 1,589 and 1,533 turns - over a
game DAY each - on a walk home of 173 and 165 steps. Everybody else on the block
walked home at exactly one cell per turn.

AND THEY BOTH HAD SOMEWHERE TO GO. H5-3 had 110,18 and 111,19 free; H14-1 had
110,17 and 111,16. It was not a one-wide corridor. It was an open street neither
of them ever looked at, because the blocked branch read:

    else a._path=null;      // blocked body: wait, replan next turn

and the comment is what hid it. Replanning changes NOTHING: path() is a
deterministic BFS over the STATIC grid, so from the same cell to the same target
it returns the same route into the same body, every turn, forever.

THE FIX IS THE ROUTE, NOT A RULE ABOUT WHO YIELDS. When blocked, replan with the
other BODIES as walls and take the detour. Deterministic (same BFS, same
occupancy), one step per turn, and OCCUPANCY LAW still holds because occFree
guards the destination. If no detour exists - a genuinely one-wide corridor - it
falls through to the old wait, which is correct there.

    AFTER, same block:  173 steps -> 173 turns.  165 steps -> 167 turns.

WHY IT NEEDS A TOOL. The fix landed in engine/bohemia_agents.js, but FOUR SHIPPED
SLICES carry that function inlined byte-for-byte, including the one Paolo walks:

    slices/BOHEMIA_CITY_WORLD.html        <- the walked world, the RUN tab
    slices/BOHEMIA_RUN_CURRENT.html
    slices/BOHEMIA_LIFE_SLICE_7_19_26.html
    slices/BOHEMIA_SUBURB_WALK_7_18_26.html

An engine fix that never reaches the surface he plays is not a fix (7/18: VERIFY
ON THE REAL SURFACE). The sync gate does not police this module, so nothing was
going to notice.

NO DRIFT BY CONSTRUCTION: the replacement text is READ OUT OF THE ENGINE at run
time, never retyped here. The tool cannot ship a slice a version of walkTo that
the engine does not have.

REUSE CHECK: cooks no graphic pixels and opens no bank. Pure plumbing - it moves
one already-written function from the engine into the files that inline it.

Idempotent: a carrier already carrying the fix reports NOOP.
Gate: gates/walk_deadlock_gate.js
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ENGINE = 'engine/bohemia_agents.js'
CARRIERS = [
    'slices/BOHEMIA_CITY_WORLD.html',
    'slices/BOHEMIA_RUN_CURRENT.html',
    'slices/BOHEMIA_LIFE_SLICE_7_19_26.html',
    'slices/BOHEMIA_SUBURB_WALK_7_18_26.html',
]
MARKER = 'HEAD-ON DEADLOCK'

# the pre-8/4 bodies, verbatim. Both appear exactly once in every carrier.
OLD_PATH = (
    "    // BFS path on the exterior grid (roads/driveways/dead ground)\n"
    "    function path(from,to){\n"
    "      if(!from||!to) return null;\n"
    "      var q=[from], came={}, key=function(p){return p[0]+','+p[1];};\n"
    "      came[key(from)]=null; var qi=0;\n"
    "      while(qi<q.length){ var cur=q[qi++];\n"
    "        if(cur[0]===to[0]&&cur[1]===to[1]){ var out=[],c=cur;\n"
    "          while(c){ out.push(c); c=came[key(c)]; } out.reverse(); return out; }\n"
    "        var nb=[[1,0],[-1,0],[0,1],[0,-1]];\n"
    "        for(var k=0;k<4;k++){ var nx=cur[0]+nb[k][0],ny=cur[1]+nb[k][1];\n"
    "          var kk=nx+','+ny;\n"
    "          if((passable(nx,ny)||(nx===to[0]&&ny===to[1]))&&!(kk in came)){\n"
    "            came[kk]=cur; q.push([nx,ny]); } } }\n"
    "      return null;\n"
    "    }\n"
)
OLD_WALK = (
    "    function walkTo(a,to,arrive){\n"
    "      if(!to) return;\n"
    "      if(a.loc.x===to[0]&&a.loc.y===to[1]){ if(arrive)arrive(); return; }\n"
    "      if(!a._path||!a._path.length) a._path=path([a.loc.x,a.loc.y],to)||[];\n"
    "      if(a._path.length<2){ if(arrive&&a.loc.x===to[0]&&a.loc.y===to[1])arrive(); return; }\n"
    "      var nxt=a._path[1];\n"
    "      if(occFree(nxt[0],nxt[1],a.id)){ a._path.shift(); place(a,nxt[0],nxt[1]);\n"
    "        if(a.loc.x===to[0]&&a.loc.y===to[1]&&arrive)arrive(); }\n"
    "      else a._path=null;                                 "
    "// blocked body: wait, replan next turn\n"
    "    }\n"
)


def slice_out(src, start_at, end_after):
    """the text from `start_at` through the first line that is exactly `end_after`."""
    i = src.index(start_at)
    j = src.index(end_after, i) + len(end_after)
    return src[i:j]


def canonical():
    """the CURRENT engine bodies. Read, never retyped - the tool cannot ship a
    walkTo the engine does not have."""
    eng = open(ENGINE, encoding='utf8').read()
    new_path = slice_out(eng, '    // BFS path on the exterior grid', '      return null;\n    }\n')
    new_walk = slice_out(eng, '    function walkTo(a,to,arrive){',
                         '// boxed in: wait, replan next turn\n    }\n')
    if MARKER not in new_walk:
        raise SystemExit('FAIL: engine/bohemia_agents.js does not carry the fix yet. '
                         'Fix the ENGINE first; this tool only carries it outward.')
    if 'avoidFor' not in new_path:
        raise SystemExit('FAIL: the engine path() has no avoidFor parameter. '
                         'The detour cannot work without it.')
    return new_path, new_walk


def main():
    new_path, new_walk = canonical()
    wrote = 0
    for f in CARRIERS:
        if not os.path.exists(f):
            print('FAIL: missing carrier %s' % f)
            return 1
        s = open(f, encoding='utf8', errors='replace').read()
        if MARKER in s:
            print('NOOP: %s already walks around a blocked body' % f)
            continue
        np, nw = s.count(OLD_PATH), s.count(OLD_WALK)
        if np != 1 or nw != 1:
            print('FAIL: %s resolves path x%d walkTo x%d, wanted 1 and 1' % (f, np, nw))
            return 1
        s = s.replace(OLD_PATH, new_path, 1).replace(OLD_WALK, new_walk, 1)
        open(f, 'w', encoding='utf8').write(s)
        print('wrote %s' % f)
        wrote += 1
    if wrote:
        print('  %d carrier(s) now route AROUND a blocked body instead of standing there' % wrote)
    return 0


if __name__ == '__main__':
    sys.exit(main())
