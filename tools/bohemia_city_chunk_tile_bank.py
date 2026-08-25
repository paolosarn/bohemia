#!/usr/bin/env python3
"""
CHUNK THE TILE BANK SO A BROWSER WILL ACTUALLY KEEP IT (8/24/26, WORLD lane).

    "we have a demo to ship"                                        -- Paolo, repeatedly

WHAT THIS IS FOR. Measured 8/24 over real HTTP, cold cache, tapping the splash like a
person: a friend downloads 40.48 MB before the world appears, and 32.38 MB of that lands
AFTER the only gesture they make -- 10.4 s of dead wait on LOCALHOST, minutes on cellular.
28.04 MB of it is slices/BOHEMIA_CITY_TILES.js, one file holding 8,674 tile sprites.

THE ATTEMPTED FIX THAT FAILED, AND WHY IT POINTS HERE. Warming the cache during the splash
did not move the number at all, because CHROMIUM WILL NOT KEEP A RESPONSE THAT LARGE: the
warm-up downloaded the bank and the iframe downloaded it AGAIN. Proved from the server log
-- props (1.7 MB) warmed and was reused, tiles (28 MB) was requested twice, both 200.

WHERE THE LIMIT ACTUALLY IS, measured rather than assumed (that probe is the reason this
tool picks the size it does):

    1 MB  cached      6 MB  cached
    2 MB  cached      8 MB  RE-DOWNLOADED
    4 MB  cached     12 MB  RE-DOWNLOADED   ... and everything larger

So the ceiling sits between 6 and 8 MB. This tool targets 4 MB a chunk, which leaves real
margin and is why `misc` -- 6.81 MB on its own, comfortably inside the "cacheable" column --
still gets split. A chunk that only just fits is a chunk that stops fitting the next time
somebody cooks a sprite.

WHAT IT EMITS. slices/BOHEMIA_CITY_TILES_NN.js, in load order:

    _01  every small declaration whole (HERO_SRC, SA_TILES, SIG_TILES, JAMB_W, JAMB_E,
         DOOR_ANIM, IN_DOOR_B64) plus `const TP_TILES={}` for the rest to fill
    _02+ TP_TILES families, binned to fit, a family too big for one chunk split across
         several and re-joined with .concat IN LOAD ORDER so indices never move

Scripts without async/defer execute in document order, so chunk N always sees what chunk
N-1 declared. That ordering is the only thing holding this together and it is guaranteed by
the HTML spec, not by luck.

WHY THIS IS THE 8/6 MOVE ONE LEVEL DEEPER. tools/bohemia_city_split_tile_bank.py pulled this
bank OUT of the world page for REPO SIZE. This splits the bank itself for LOAD TIME. Same
insight -- a huge stable thing welded to something that has to be handled -- one level down.

EQUIVALENCE IS PROVED, NOT ASSERTED. The tool re-reads what it wrote, evaluates the chunks
in load order, and deep-compares every declaration against the original: same keys, same
array lengths, same strings, in the same order. It refuses to write anything if that fails.

  python3 tools/bohemia_city_chunk_tile_bank.py
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

SRC = 'slices/BOHEMIA_CITY_TILES.js'
PAGE = 'slices/BOHEMIA_CITY_WORLD.html'
STEM = 'BOHEMIA_CITY_TILES_'
CHUNK_MAX = 4 * 1048576          # see the measured table above; the wall is 6-8 MB
# THE EIGHT NAMES THE BANK OWNS, in the order the original file declared them. Named here
# rather than discovered, because the read-back path (below) has to know what to pull out of
# the evaluated chunks, and "whatever eval left lying around" is not a contract.
HEAD_NAMES = ['HERO_SRC', 'SA_TILES', 'SIG_TILES', 'TP_TILES',
              'JAMB_W', 'JAMB_E', 'DOOR_ANIM', 'IN_DOOR_B64']

# RE-RUNNABLE ON ITS OWN OUTPUT. After the first run the monolith is gone, so a second run
# has to read the CHUNKS -- otherwise the only way to change the emission shape is to dig the
# old file out of git, which is exactly the kind of one-way tool that rots. Chunks are read
# in load order because chunk 1 declares what the rest fill; anything else is not the bank.
import glob
if os.path.exists(SRC):
    src = open(SRC, encoding='utf8').read()
else:
    parts = sorted(glob.glob('slices/%s[0-9][0-9].js' % STEM))
    if not parts:
        sys.exit('CHUNK: neither %s nor any %sNN.js chunk is here. Nothing to split.'
                 % (SRC, STEM))
    print('CHUNK: the monolith is gone; reading the bank back from %d chunks.' % len(parts))
    # AND IT HAS TO BE EVALUATED, NOT SCANNED. After the first run the chunks are mostly
    # MUTATIONS -- `TP_TILES["misc"]=[...]`, a push loop -- and the declaration scan below
    # only understands `kw NAME = <literal>;`. Scanning them would read TP_TILES as the empty
    # object chunk 1 declares and silently throw the whole bank away. So run them.
    import subprocess as _sp
    # ONE eval, extraction included. `const` declared inside an eval is scoped to THAT eval,
    # so pulling the names out in a second eval cannot see them -- which is exactly the
    # ReferenceError this first tripped over. Same shape the equivalence probe below uses.
    _probe = ('const fs=require("fs");\n'
              'const O={};\n'
              'eval(%s.map(f=>fs.readFileSync(f,"utf8")).join("\\n") + "\\n;" + '
              '%s.map(n=>`O[${JSON.stringify(n)}]=${n};`).join(""));\n'
              'process.stdout.write(JSON.stringify(O));\n') % (json.dumps(parts),
                                                                json.dumps(HEAD_NAMES))
    _t = '/tmp/_bohemia_chunk_readback.js'
    open(_t, 'w', encoding='utf8').write(_probe)
    _r = _sp.run(['node', '--stack-size=8000', '--max-old-space-size=6144', _t],
                 capture_output=True, text=True)
    if _r.returncode != 0 or not _r.stdout:
        sys.exit('CHUNK: could not evaluate the existing chunks to read the bank back: %s'
                 % (_r.stderr or '')[:300])
    _vals = json.loads(_r.stdout)
    src = None      # the declaration scan is skipped; decls are built directly below
    decls = [(('var' if n == 'HERO_SRC' else 'const'), n, _vals[n]) for n in HEAD_NAMES]

# ---------------------------------------------------------------- 1. read the bank
# Every declaration is `kw NAME = <json literal>;` at column 0. Walk the literal with a
# brace/bracket counter rather than a regex: 28 MB of base64 contains every character a
# regex would trip on, and a greedy match here would silently swallow the next declaration.
if src is not None:
  decls = []          # (keyword, name, python value) in source order
  for m in re.finditer(r'^(var|const|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*', src, re.M):
    kw, name = m.group(1), m.group(2)
    i = m.end()
    open_ch = src[i]
    close_ch = {'{': '}', '[': ']'}.get(open_ch)
    if not close_ch:
        sys.exit('CHUNK: %s is not an object or array literal. Refusing to guess.' % name)
    depth, j, in_str = 0, i, False
    while j < len(src):
        c = src[j]
        if in_str:
            if c == '\\':
                j += 2
                continue
            if c == '"':
                in_str = False
        elif c == '"':
            in_str = True
        elif c == open_ch:
            depth += 1
        elif c == close_ch:
            depth -= 1
            if depth == 0:
                break
        j += 1
    decls.append((kw, name, json.loads(src[i:j + 1])))

names = [d[1] for d in decls]
print('CHUNK: read the bank -- %.2f MB of values, %d declarations: %s'
      % (sum(len(json.dumps(d[2], separators=(',', ':'))) for d in decls) / 1048576.0,
         len(decls), ', '.join(names)))
if 'TP_TILES' not in names:
    sys.exit('CHUNK: no TP_TILES. This tool exists to split it; refusing to run blind.')

J = lambda v: json.dumps(v, separators=(',', ':'), ensure_ascii=False)

# ---------------------------------------------------------------- 2. plan the chunks
# EVERYTHING GETS BINNED, not just TP_TILES. The first cut put all seven "small"
# declarations in chunk 1 and it came out at 7.12 MB -- over the wall, because HERO_SRC
# (2.83) plus DOOR_ANIM (2.54) plus the rest is not small. The tool's own guard caught it
# and refused to write, which is what that guard is for: a packer that can produce an
# un-cacheable chunk has not done the one job this tool exists to do.
#
# So: build a flat list of UNITS, each already known to fit, then bin them. The only
# ordering constraint is that `const TP_TILES={}` precedes anything that fills it, and that
# a split family's parts stay in order -- both handled by emitting units in this order and
# never reordering them across chunks.
units = []          # (source_string, byte_len)
tp = dict((d[1], d[2]) for d in decls)['TP_TILES']

# EVERY NAME IS DECLARED IN CHUNK 1, AND NOTHING AFTER CHUNK 1 EVER RE-BINDS ONE. Two
# separate things depend on that, and neither is obvious:
#
# 1. THE WORLD SURVIVES A MISSING BANK. Measured 8/25: block the whole bank and the city is
#    a BLACK VOID with `ReferenceError: HERO_SRC is not defined` -- the page reads these
#    names at module scope, so an absent bank kills the script before a pixel is drawn.
#    Bootstrap the eight names as empty containers and the SAME blocked build renders a
#    playable world: ground, the character, the HUD, the cold open, the quest card, the
#    movement pad, ZERO errors. Only the texture is missing. That one property is the whole
#    prerequisite for progressive loading, so chunk 1 owns the declarations and can never be
#    the chunk that fails to arrive.
#
# 2. FIVE GATES AND FOUR TOOLS READ THE DECLARATION FORM. city_tab, full_res, interiors and
#    street_source all grep for `const SA_TILES=` / `const IN_DOOR_B64=` and friends against
#    the assembled document. Switching the bank wholesale to bare assignment would have
#    broken every one of them -- which is why the shape here is DECLARE ONCE, MUTATE AFTER
#    rather than the simpler-looking rewrite.
#
# A declaration small enough to sit in chunk 1 is filled there, so those greps still find
# real content. The three big ones are declared EMPTY and filled by later chunks through
# mutation (Object.assign / a push loop), never re-assignment.
INLINE_MAX = 1048576        # a declaration up to this size is filled in chunk 1 outright

# SIZE AN ELEMENT BY WHAT IT SERIALISES TO, never by len(item). `len` on a base64 string is
# its byte length, which is right -- and `len` on a NESTED array is its element COUNT, which
# is not. DOOR_ANIM is a list of frame lists, so it sized itself at 0.00 MB while actually
# being 2.54 MB, and the binner cheerfully packed it into a chunk that came out at 5.37 MB.
# The 6 MB guard did not fire because 5.37 is under the measured wall -- so the tool would
# have shipped a chunk with almost no margin, which is the exact thing its own comments say
# not to do. A sizing function that is right for one type and silently wrong for another is
# the same shape of bug as a sampler that steps over half a boundary.
def item_len(x):
    return len(J(x)) + 1

def push_loop(name, items):
    """append items to an existing array without spreading (a 2.5 MB spread blows the stack)"""
    return '(function(a){for(var i=0;i<a.length;i++)%s.push(a[i]);})(%s);' % (name, J(items))

head, small_len = [], 0
big = []
for kw, name, val in decls:
    body = J(val)
    if name != 'TP_TILES' and len(body) <= INLINE_MAX:
        head.append('%s %s=%s;' % (kw, name, body))       # declared AND filled, form preserved
        small_len += len(body)
    else:
        head.append('%s %s=%s;' % (kw, name, '{}' if isinstance(val, dict) else '[]'))
        if name != 'TP_TILES':
            big.append((name, val))
if small_len > CHUNK_MAX:
    sys.exit('CHUNK: the always-declared head is %.2f MB, over the %.2f MB chunk size. Lower '
             'INLINE_MAX -- chunk 1 must stay cacheable like every other chunk.'
             % (small_len / 1048576.0, CHUNK_MAX / 1048576.0))
# ONE DECLARATION PER LINE, exactly as the original file had them. Joining the head with
# spaces put all eight on one line and broke street_source_gate, which finds
# `const SA_TILES=` and then reads TO THE END OF THE LINE -- so it swallowed the following
# declarations and the street table stopped parsing. The consumers were written against a
# line-per-declaration file; keep that shape.
units.append(('\n'.join(head), small_len))

# the big non-TP declarations, filled by mutation
for name, val in big:
    if isinstance(val, dict):
        units.append(('Object.assign(%s,%s);' % (name, J(val)), len(J(val))))
        continue
    part, part_len = [], 0
    for item in val:
        if part and part_len + item_len(item) > CHUNK_MAX:
            units.append((push_loop(name, part), part_len))
            part, part_len = [], 0
        part.append(item)
        part_len += item_len(item)
    if part:
        units.append((push_loop(name, part), part_len))

# TP_TILES FAMILIES IN THEIR ORIGINAL ORDER, and this is not a stylistic choice. The first
# version emitted them biggest-first to pack the bins tighter, and the equivalence check
# refused it: JSON.stringify walks an object in INSERTION order, so a size-sorted TP_TILES
# is a different object even though every family in it is identical. Nothing in the renderer
# should care -- it looks families up by name -- but "should" is not a thing to bet the
# world's art on when preserving the order costs a few hundred KB of packing efficiency.
for fam, arr in tp.items():
    body = J(arr)
    if len(body) + 40 <= CHUNK_MAX:
        units.append(('TP_TILES[%s]=%s;' % (J(fam), body), len(body)))
        continue
    # A FAMILY TOO BIG FOR ONE CHUNK. Split it by element and re-join with .concat in load
    # order, so TP_TILES[fam][i] is the same sprite it always was. Index stability is the
    # whole contract: the renderer picks by index.
    first = True
    part, part_len = [], 0
    for item in arr:
        if part and part_len + item_len(item) > CHUNK_MAX:
            units.append((('TP_TILES[%s]=%s;' % (J(fam), J(part))) if first else
                          ('TP_TILES[%s]=TP_TILES[%s].concat(%s);' % (J(fam), J(fam), J(part))),
                          part_len))
            part, part_len, first = [], 0, False
        part.append(item)
        part_len += item_len(item)
    if part:
        units.append((('TP_TILES[%s]=%s;' % (J(fam), J(part))) if first else
                      ('TP_TILES[%s]=TP_TILES[%s].concat(%s);' % (J(fam), J(fam), J(part))),
                      part_len))

chunks, cur, cur_len = [], [], 0
for body, n in units:
    if cur and cur_len + n > CHUNK_MAX:
        chunks.append(cur)
        cur, cur_len = [], 0
    cur.append(body)
    cur_len += n
if cur:
    chunks.append(cur)

BANNER = ('/* BOHEMIA TILE BANK, chunk %d of %d. Generated by '
          'tools/bohemia_city_chunk_tile_bank.py -- DO NOT EDIT BY HAND.\n'
          '   One file of 28 MB could not be cached by any browser (the wall is 6-8 MB, '
          'measured), so it\n'
          '   was re-downloaded on every cold visit. These chunks are cacheable, they '
          'download in parallel,\n'
          '   and they can be warmed while the player reads the splash. Load order is '
          'load-bearing: chunk 1\n'
          '   declares the containers and later chunks fill them, joining split families '
          'with .concat so no\n'
          '   sprite index ever moves. */\n')

paths = []
for n, parts in enumerate(chunks, 1):
    p = 'slices/%s%02d.js' % (STEM, n)
    open(p, 'w', encoding='utf8').write(BANNER % (n, len(chunks)) + '\n'.join(parts) + '\n')
    paths.append(p)
    print('  %-38s %6.2f MB' % (os.path.basename(p), os.path.getsize(p) / 1048576))

big = [p for p in paths if os.path.getsize(p) > 6 * 1048576]
if big:
    sys.exit('CHUNK: %s is over the measured 6 MB cache wall. The packing is wrong; '
             'refusing to ship a chunk a browser will not keep.' % ', '.join(big))

# ---------------------------------------------------------------- 3. PROVE it reassembles
# Not "looks right" -- evaluate the chunks in load order in a real JS engine and deep-compare
# every declaration with the original file's. Anything less is a claim, not a check.
import subprocess
# THE EXPECTED VALUES ARE WRITTEN OUT, not re-read from the original file. On a re-run the
# original file no longer exists -- the bank came back from the chunks themselves -- so
# comparing against SRC would only work the very first time, which is precisely when a
# check like this is least needed. Compare against what was READ, whichever way it was read.
EXPECT = '/tmp/_bohemia_chunk_expect.json'
open(EXPECT, 'w', encoding='utf8').write(
    json.dumps(dict((d[1], d[2]) for d in decls), separators=(',', ':'), ensure_ascii=False))
probe = (
    'const fs=require("fs");\n'
    'const files=%s;\n'
    'let js=files.map(f=>fs.readFileSync(f,"utf8")).join("\\n");\n'
    'const B=JSON.parse(fs.readFileSync(%s,"utf8"));\n'
    'const A={};\n'
    'eval(js + "\\n;" + %s.map(n=>`A[${JSON.stringify(n)}]=${n};`).join(""));\n'
    'const a=JSON.stringify(A), b=JSON.stringify(B);\n'
    'if(a===b){ console.log("IDENTICAL"); } else {\n'
    '  for(const k of Object.keys(B)){ if(JSON.stringify(A[k])!==JSON.stringify(B[k])) '
    'console.log("DIFFERS: "+k); }\n'
    '  console.log("MISMATCH"); }\n'
) % (json.dumps(paths), json.dumps(EXPECT), json.dumps(names))
tmp = '/tmp/_bohemia_chunk_probe.js'
open(tmp, 'w', encoding='utf8').write(probe)
out = subprocess.run(['node', '--stack-size=8000', tmp], capture_output=True, text=True)
verdict = (out.stdout or '') + (out.stderr or '')
print('  EQUIVALENCE: ' + verdict.strip().replace('\n', ' | ')[:400])
if 'IDENTICAL' not in verdict:
    for p in paths:
        os.remove(p)
    sys.exit('CHUNK: the chunks do NOT reassemble to the original. Nothing written.')

# ---------------------------------------------------------------- 4. wire the page
# THE TAGS LIVE INSIDE A NAMED REGION, and that is not decoration. The single tag this
# replaces was itself an ANCHOR for another tool -- bohemia_city_props_patch.py inserts the
# props bank immediately after `<script src="BOHEMIA_CITY_TILES.js"></script>` -- so
# splitting the bank silently broke a patch tool that had nothing to do with this change.
# A run of N script tags is a worse anchor than the one tag was, because N moves. A named
# region does not: other tools anchor on the END marker and stay correct however many chunks
# there turn out to be, and re-running this tool replaces the region exactly instead of
# regex-matching a tag run.
page = open(PAGE, encoding='utf8').read()
one = '<script src="BOHEMIA_CITY_TILES.js"></script>'
many = ('<!-- __TILE_BANK__ the art bank, in cacheable chunks. Generated by '
        'tools/bohemia_city_chunk_tile_bank.py -- anchor on the END marker below, never on a '
        'chunk name: the count changes. -->\n'
        + '\n'.join('<script src="%s"></script>' % os.path.basename(p) for p in paths)
        + '\n<!-- __TILE_BANK_END__ -->')
if '<!-- __TILE_BANK__' in page:
    i = page.index('<!-- __TILE_BANK__')
    j = page.index('<!-- __TILE_BANK_END__ -->') + len('<!-- __TILE_BANK_END__ -->')
    page = page[:i] + many + page[j:]
elif one in page:
    page = page.replace(one, many, 1)
else:
    sys.exit('CHUNK: the page carries neither the single tile-bank tag nor the __TILE_BANK__ '
             'region. It changed shape; refusing to guess where the art loads.')
open(PAGE, 'w', encoding='utf8').write(page)

if os.path.exists(SRC):
    os.remove(SRC)

# ---------------------------------------------------------------- 5. warm them on the splash
# NOW that every chunk is under the cache wall, warming them during the splash finally does
# something: the browser keeps what it pulls, so the iframe's script tags are served from
# cache instead of re-downloading. This exact code was written and REVERTED on 8/24 because
# against the 28 MB monolith it downloaded the bank TWICE. Same code, different file sizes,
# opposite result -- which is the whole reason the chunking had to come first.
#
# THE TOOL OWNS THE LIST. Hardcoding eight filenames in the alpha would drift the moment
# anybody re-chunks, and a warm-up that fetches a file that no longer exists is a 404 on
# every boot. One owner, regenerated here, checked by time_to_play_gate.
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK0 = '/* ==== __TILE_WARM__ ==== */'
MARK1 = '/* ==== __TILE_WARM_END__ ==== */'
warm = (MARK0 + '\n'
        '  /* WARM THE WORLD WHILE HE READS THE SPLASH (8/24). Every byte of the city used to\n'
        '     wait for the tap, because the tap is what CREATES the iframe -- 32 MB serialised\n'
        '     after the only gesture a player makes. The splash is dead time a human is already\n'
        '     spending, so spend it downloading.\n'
        '     fetch(), NOT <link rel=prefetch>: Safari does not implement prefetch and he plays\n'
        '     this on an iPhone, and a hint the target browser ignores is a comment, not an\n'
        '     optimisation. Failures are swallowed on purpose -- a warm-up that can break the\n'
        '     boot is a worse bug than the wait it saves.\n'
        '     GENERATED by tools/bohemia_city_chunk_tile_bank.py. Do not hand-edit the list. */\n'
        '  (function warmTheWorld(){\n'
        '    var CHUNKS=%s;\n'
        '    var warm=function(){ for(var i=0;i<CHUNKS.length;i++){\n'
        '      try{ fetch(CHUNKS[i]).then(function(r){return r.arrayBuffer();}).catch(function(){}); }catch(e){} } };\n'
        '    if(document.readyState===\'complete\') setTimeout(warm,0);\n'
        '    else addEventListener(\'load\',function(){ setTimeout(warm,0); });\n'
        '  })();\n'
        '  ' + MARK1) % json.dumps([os.path.basename(p) for p in paths] + ['BOHEMIA_CITY_PROPS.js'])

alpha = open(ALPHA, encoding='utf8').read()
anchor = "  const CITY_SRC='BOHEMIA_CITY_WORLD.html';"
if MARK0 in alpha:
    i, j = alpha.index(MARK0), alpha.index(MARK1) + len(MARK1)
    alpha = alpha[:i] + warm + alpha[j:]
elif anchor in alpha:
    alpha = alpha.replace(anchor, anchor + '\n  ' + warm, 1)
else:
    sys.exit('CHUNK: could not find CITY_SRC in the alpha to hang the warm-up on. The page '
             'changed shape; the chunks are written but nothing warms them.')
open(ALPHA, 'w', encoding='utf8').write(alpha)

print('CHUNK: %d chunks written, %s deleted, %s wired, %s warms them.'
      % (len(paths), SRC, PAGE, ALPHA))
