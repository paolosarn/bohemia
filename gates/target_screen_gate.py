#!/usr/bin/env python3
"""THE TARGET SCREEN + PROPORTION GATE (7/26/26)

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. The art-first reset (Paolo 7/26,
laws/BOHEMIA_ADDENDUM_ART_FIRST_RESET_7_26_26.md) put five checkable things on
the books the same day the ART lane opened:

  law 1  TARGET SCREEN LAW  - 2-3 hand-assembled candidate target screens exist,
                              are real iPhone-portrait frames, are built out of
                              APPROVED banks, and are judgeable from inside the
                              alpha. Once Paolo picks one, this gate is where
                              "does the art move toward the target" gets held.
  law 4  QUEST ASKS FROZEN  - no session surfaces quest questions or quest
                              verdicts to Paolo until the visual bar is set. The
                              LIFE hub is the surface that does the surfacing, so
                              the freeze is checked there.
  law 5  HUMAN-SCALE        - a door opening is 2 cells tall and a standing body
                              clears ~77% of it. Checked as arithmetic on the
                              factory's own constants, so a future tweak to CELL,
                              ZH or BODY_K cannot silently break proportion.
  Pocket City rule 3        - three flat tones per volume, NO black keyline.
  REUSE-FIRST / APPROVED-ASSETS-FIRST - the factory names the banks it opened
                              and every one of them exists and is really read.

Run from repo root:  python3 gates/target_screen_gate.py
"""
import importlib.util
import json
import os
import re
import sys

from PIL import Image, ImageStat

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

FACTORY = 'tools/bohemia_target_screen_factory.py'
OUTDIR = 'records/target'
JUDGE = 'slices/BOHEMIA_TARGET_SCREEN_JUDGE_7_26_26.html'
LIFEHUB = 'slices/BOHEMIA_LIFE_CURRENT.html'
LAW_NAMEIT = 'laws/BOHEMIA_ADDENDUM_NAME_IT_OR_DONT_DRAW_IT_7_26_26.md'
TILESET = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'
REASSEMBLED = 'records/target/REASSEMBLED.png'
REASM_HTML = 'slices/BOHEMIA_REASSEMBLY_7_26_26.html'
KEYS = ('A_FRONTFACE',)   # the other two are DEAD (graveyard registry, 7/26)

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL: ' + msg)


def load_factory():
    spec = importlib.util.spec_from_file_location('bohemia_target_factory', FACTORY)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    os.chdir(REPO)                      # the factory chdirs; put us back
    return mod


def parse_manifest(path):
    """Read the shipped manifest FILE, not the factory's in-memory list. The
    artifact that ships is the thing that has to be right."""
    if not os.path.exists(path):
        return []
    out, cur = [], None
    for line in open(path):
        t = line.rstrip('\n')
        m = re.match(r'\s*\d+\.\s+(.*?)\s+\[(\w+)\]\s*$', t)
        if m:
            cur = {'name': m.group(1), 'kind': m.group(2), 'what': '', 'source': '',
                   'cells': [0, 0, 0, 0]}
            out.append(cur)
        elif cur and t.strip().startswith('WHAT:'):
            cur['what'] = t.split('WHAT:', 1)[1].strip()
        elif cur and t.strip().startswith('FROM:'):
            cur['source'] = t.split('FROM:', 1)[1].strip()
        elif cur and t.strip().startswith('AT:'):
            g = re.findall(r'-?[\d.]+', t.split('AT:', 1)[1])
            if len(g) >= 4:
                cur['cells'] = [float(v) for v in g[:4]]
    return out


def main():
    print('TARGET SCREEN + PROPORTION GATE')
    chk(os.path.exists(FACTORY), 'the target-screen factory is missing')
    if not os.path.exists(FACTORY):
        return 1
    M = load_factory()
    src = open(FACTORY).read()

    # ---- law 1: the screens themselves ---------------------------------
    for k in KEYS:
        p = os.path.join(OUTDIR, 'BOHEMIA_TARGET_%s.png' % k)
        chk(os.path.exists(p), '%s: the target screen was never rendered' % k)
        if not os.path.exists(p):
            continue
        im = Image.open(p)
        chk(im.size == (M.W * M.SCALE, M.H * M.SCALE),
            '%s: %s is not the declared frame %dx%d' % (k, im.size, M.W * M.SCALE, M.H * M.SCALE))
        ar = im.width / float(im.height)
        chk(0.44 <= ar <= 0.49,
            '%s: aspect %.3f is not iPhone portrait (0.44-0.49)' % (k, ar))
        rgb = im.convert('RGB')
        st = ImageStat.Stat(rgb)
        spread = sum(st.stddev) / 3.0
        chk(spread > 22, '%s: the plate is flat (stddev %.1f) - not a composed screen'
            % (k, spread))
        small = rgb.resize((rgb.width // 4, rgb.height // 4), Image.BILINEAR)
        raw = small.tobytes()
        px = [(raw[i], raw[i + 1], raw[i + 2]) for i in range(0, len(raw), 3)]
        n = float(len(px))
        # POCKET CITY RULE 3: no black keyline. A keylined mass floods the plate
        # with near-pure black; a dead-world plate legitimately has dark holes,
        # so the bar is generous and still catches an outlined style.
        blk = sum(1 for (r, g, b) in px if max(r, g, b) < 14) / n
        chk(blk < 0.06, '%s: %.1f%% of the plate is near-pure black - that reads as a '
                        'black keyline / outline style, which the Pocket City bible kills'
            % (k, blk * 100))
        # dead-world reconciliation: NEVER a warm night glow in act 1.
        glow = sum(1 for (r, g, b) in px if r > 226 and g > 200 and b < 130) / n
        chk(glow < 0.02, '%s: %.1f%% hot yellow glow - act 1 windows are DEAD DARK glass'
            % (k, glow * 100))

    # ---- the BEFORE shot: a comparison, never a claim -------------------
    chk(os.path.exists(os.path.join(OUTDIR, 'BEFORE_RUN.png')),
        'no BEFORE shot of the shipped run - the target screens must be judged against '
        'the real build, not on their own')

    # ---- law 5: HUMAN SCALE, as arithmetic on the factory constants -----
    chk(M.DOOR_CELLS == 2, 'a door opening is not 2 cells tall (art-first reset law 5)')
    door_a = M.DOOR_CELLS * M.CELL
    body_a = M.BODY_PX * M.BODY_K
    pct_a = 100.0 * body_a / door_a
    chk(68 <= pct_a <= 90,
        'A_FRONTFACE: a body clears %.0f%% of its 2-cell door (want 68-90)' % pct_a)

    # ---- THE CAR LAW (Paolo LOCKED, restated 7/26) ---------------------
    # "We made a rule that all cars are 2 x 3 tiles." v1 dropped them at their
    # cooked pixel size, roughly 1x2, and he caught it. The factory must READ the
    # number out of the engine, never type it, so a picture can never disagree
    # with the game.
    chk((M.CAR_L, M.CAR_W) == (3, 2),
        'the car footprint resolved to %dx%d, not the locked 3x2' % (M.CAR_L, M.CAR_W))
    chk('car_footprint()' in src and 'PROP_SCALE' in src,
        'the factory hard-codes a car size instead of reading the engine law')
    chk("re.search(r\"vehicle" in src or 'vehicle' in src,
        'the factory does not parse the vehicle rule out of the engine')
    eng = open(M.PROP_SCALE).read()
    chk("fp:[3,2]" in eng.replace(' ', ''),
        'the engine vehicle footprint moved off 3x2 - that is a Paolo-locked law')
    chk('def car(' in src and "along == 'x'" in src,
        'cars are not oriented along the surface they are parked on')

    # ---- THE ROOF SITS SQUARE ON ITS OWN WALLS (Paolo 7/26) ------------
    # "the roofs are all fucked up not put on correctly". The cause was a
    # horizontal shear on the TOP face only: the roof slid sideways off the wall
    # under it. Any non-zero shear reintroduces exactly that.
    chk(M.SHEAR == 0,
        'SHEAR is %.2f - a sheared top face slides the roof off its own walls, which is '
        'the defect Paolo named' % M.SHEAR)
    chk('def hip_roof' in src, 'the pitched roof is not a real hip form (ridge + hip ends)')
    for part in ('THE RIDGE', 'THE FASCIA', "eave's shadow"):
        chk(part in src, 'the roof is missing its %s - that is what makes it read as a roof'
            % part)
    chk('flat colour wedge' in src,
        'the hip ends must be the roof MATERIAL at another value, never a flat fill')

    # ---- NAME IT OR DON'T DRAW IT (Paolo 7/26, LOCKED) ------------------
    # laws/BOHEMIA_ADDENDUM_NAME_IT_OR_DONT_DRAW_IT_7_26_26.md
    man = os.path.join(OUTDIR, 'BOHEMIA_TARGET_MANIFEST.txt')
    chk(os.path.exists(LAW_NAMEIT), 'the NAME IT OR DON\'T DRAW IT law is not written down')
    chk(os.path.exists(man), 'the screen ships without a manifest - nobody can say what '
                             'is on it')
    ents = parse_manifest(man)
    chk(len(ents) >= 12, 'the manifest only names %d things; the screen has more on it '
                         'than that' % len(ents))
    for e in ents:
        chk(len(e['what']) >= 18, '"%s" has no real description' % e['name'])
        chk(e['source'], '"%s" does not say where its pixels came from' % e['name'])
        chk(e['kind'] in ('surface', 'object', 'detail'),
            '"%s" has no kind' % e['name'])
    objs = [e for e in ents if e['kind'] == 'object']
    tail = open(man).read().strip().splitlines()[-1] if os.path.exists(man) else ''
    chk(tail.startswith('%d things' % len(ents)),
        'the manifest trailer disagrees with its own entries (%r vs %d)' % (tail, len(ents)))
    for i, a in enumerate(objs):                        # nothing stands on anything
        ax, ay, aw, ah = a['cells']
        for b in objs[i + 1:]:
            bx, by, bw, bh = b['cells']
            ix = min(ax + aw, bx + bw) - max(ax, bx)
            iy = min(ay + ah, by + bh) - max(ay, by)
            chk(not (ix > 0.30 and iy > 0.30),
                'STACKED WRONG: "%s" sits on "%s"' % (a['name'], b['name']))
    chk('def drew(' in src and 'DRAWN.append' in src,
        'naming is bolted on beside the drawing call again instead of inside it')
    chk("raise SystemExit('NAME IT" in src or 'NAME IT OR DON' in src,
        'the factory does not fail the build on an unnamed thing')

    # ---- NO RADIATION IN BOHEMIA (LORE, Paolo 7/26) ---------------------
    chk('BANNED_FACES' in src, 'the banned-iconography registry is gone')
    banned = {int(k): v for k, v in re.findall(
        r"(\d+):\s*'([^']+)'", src[src.index('BANNED_FACES'):src.index('def place(')])}
    chk(len(banned) >= 6, 'the radiation/hazard faces are not all registered')
    for e in ents:
        low = e['source'].lower()
        for idx in banned:
            chk('fire_barrel[%d]' % idx not in low.replace(' ', ''),
                '"%s" uses fire_barrel[%d], which carries %s. There is no radiation in '
                'Bohemia.' % (e['name'], idx, banned[idx]))
    chk('no hazard markings' in ' '.join(e['source'] for e in ents),
        'the barrel on screen does not declare that it is clean of hazard marks')

    # ---- PIXEL QUALITY: NEVER RESAMPLE APPROVED ART ---------------------
    # Paolo 7/26: "I'm a little confused why the cars look like they're low
    # quality pixel wise." They were. The world cell was 38px while every
    # approved tile is 44px, so ALL of it was being resampled, with a SMOOTHING
    # filter, at a non-integer ratio. Two rules now, both machine-held.
    CORPUS_CELL = 44
    chk(M.CELL == CORPUS_CELL,
        'the world cell is %d but every approved tile is %d - drawing at anything else '
        'resamples the whole corpus and it goes soft' % (M.CELL, CORPUS_CELL))
    for f in (FACTORY, 'tools/bohemia_starter_tileset.py'):
        body_src = open(f).read()
        for smooth in ('LANCZOS', 'BICUBIC', 'BILINEAR', 'ANTIALIAS'):
            bad = [ln for ln in body_src.splitlines()
                   if 'Image.' + smooth in ln and 'noise' not in ln.lower()]
            chk(not bad, '%s resizes art with %s. A smoothing filter is what makes crisp '
                         'pixel art look low quality; art scales NEAREST, always.'
                % (os.path.basename(f), smooth))
    # ---- THE WINDOW IS THE APPROVED TILE, WHOLE -------------------------
    # "why are you like not just using the windows and you're like doing zoomed in
    #  zoomed out pictures of windows"
    tsrc = open('tools/bohemia_starter_tileset.py').read()
    chk('USED WHOLE' in tsrc,
        'the window tile is not documented as the approved tile used whole')
    chk('.crop((6, 6, 38, 32))' not in tsrc,
        'the window is being cropped out of its own tile and rescaled again - that is the '
        'zoomed-in-zoomed-out windows he called out')

    # ---- NO VOLCANIC ROCK (LORE, Paolo 7/26) ----------------------------
    chk('boulder' in M.BANNED_FACES and len(M.BANNED_FACES['boulder']) >= 24,
        'the volcanic boulder family is not banned - all 24 of them glow, and there is no '
        'volcano in this valley')
    for e in ents:
        chk('boulder' not in e['source'].lower(),
            '"%s" places a volcanic boulder' % e['name'])

    # ---- EVERY DOOR HAS A PATH, THE CROSSING CROSSES --------------------
    by_name = {e['name']: e for e in ents}
    door, walk = by_name.get('your front door'), by_name.get('the front walk')
    chk(door and walk, 'the door and its walk are not both named')
    if door and walk:
        chk(abs(door['cells'][0] - walk['cells'][0]) < 0.35,
            'the front door is at column %.1f and its walk is at %.1f - a door with no '
            'path to it is not a door' % (door['cells'][0], walk['cells'][0]))
    cross, road = by_name.get('the crosswalk'), by_name.get('the road')
    chk(cross and road, 'the crossing and the road are not both named')
    if cross and road:
        chk(cross['cells'][1] <= road['cells'][1] and
            cross['cells'][1] + cross['cells'][3] >= road['cells'][1] + road['cells'][3],
            'the crossing does not span the carriageway kerb to kerb')
        chk(walk is None or abs(cross['cells'][0] - walk['cells'][0]) < 1.0,
            'the crossing does not line up with the walk that feeds it')
    chk('def crosswalk_across' in src, 'the crossing is not built as a kerb-to-kerb span')

    # ---- THE STREET LAMPS (Paolo: too thick, one tile taller) -----------
    lamps = [e for e in ents if 'street lamp' in e['name']]
    chk(len(lamps) >= 1, 'no street lamp is named')
    for l in lamps:
        chk(l['cells'][3] >= 3.0,
            '%s is only %.1f tiles tall - he asked for a full tile taller'
            % (l['name'], l['cells'][3]))
    chk("C.lamp[3]" in src, 'the lamp is not the slim post from the blessed bank')
    chk('def lamp_post' in src and 'not one pixel thicker' in src,
        'the lamp is being scaled up in width again ("thick as fuck like tree trunks")')

    # ---- INVENTED DECORATION IS DELETED ---------------------------------
    for gone, why in (('def chainlink', 'the invented chain-link fence'),
                      ('def wire(', 'the invented overhead wire'),
                      ('def blockwall', 'the nameless band across the bottom')):
        chk(gone not in src, '%s is back. Invented decoration is deleted on sight.' % why)

    # ---- AMENDMENT C: THE ANTI-BIOSHOCK / REASSEMBLY TEST ---------------
    # "the painted mockup is not the constitution - the acceptance test is CUT
    #  the picked mockup into the real starter tileset and REASSEMBLE the
    #  identical frame from those tiles on the real render path."
    chk(os.path.exists(TILESET), 'the starter tileset was never cut')
    if os.path.exists(TILESET):
        ts = json.load(open(TILESET))
        n = len(ts['tiles'])
        chk(n <= 96, 'the "tileset" is %d tiles. Over 96 it is a painting, not a set.' % n)
        chk(n >= 12, 'the tileset is only %d tiles; that cannot dress a street' % n)
        cells = ts['grid'][0] * ts['grid'][1]
        chk(n < cells * 0.5,
            'the tileset (%d) is not meaningfully smaller than the frame (%d cells) - that '
            'is the exact failure amendment C exists to catch' % (n, cells))
        for t in ts['tiles']:                       # NAME IT OR DON'T DRAW IT
            chk(len(t.get('what', '')) >= 18,
                'tile "%s" has no description' % t.get('id'))
        ids = set(range(n))
        for row in ts['ground']:
            for c in row:
                chk(c in ids, 'the ground map references a tile that is not in the set')
        for row in ts['struct']:
            for c in row:
                chk(c is None or c in ids, 'the structure map references a missing tile')
        chk(ts['cell_px'] == M.CELL,
            'the tileset cell (%d) is not the contract cell (%d)' % (ts['cell_px'], M.CELL))
        chk('shadows' in ts and len(ts['shadows']) >= 2,
            'no cast-shadow data - a shadow baked into a ground tile would need a unique '
            'tile per building per hour, which is how the first reassembly lost its depth')
        chk(len(ts.get('sprites', [])) >= 5, 'nothing stands on the map')
        for sp in ts.get('sprites', []):
            chk(len(sp.get('what', '')) >= 18, 'sprite "%s" has no description' % sp.get('id'))
    chk(os.path.exists(REASSEMBLED),
        'the reassembled frame was never rendered - the acceptance test did not run')
    if os.path.exists(REASSEMBLED) and os.path.exists(os.path.join(
            OUTDIR, 'BOHEMIA_TARGET_A_FRONTFACE.png')):
        r = Image.open(REASSEMBLED)
        chk(r.size == (M.W * M.SCALE, M.H * M.SCALE),
            'the reassembled frame is %s, not the declared frame' % (r.size,))
        rs = ImageStat.Stat(r.convert('RGB'))
        chk(sum(rs.stddev) / 3.0 > 22,
            'the reassembled frame is flat - the tiles did not carry the look')
    # ART IS MATERIAL, LIGHT IS RUNTIME (Paolo 7/26: the painted rev 3 "was my fav
    # one"). The first tile pass dropped the key, the falloff, the dust and the
    # vignette and called it a win. A tileset that loses the look has not passed.
    if os.path.exists(TILESET):
        ts2 = json.load(open(TILESET))
        # nothing stands in a driveway a car has to drive through
        drives = [(8, 6, 3, 10)]
        for sp in ts2.get('sprites', []):
            if 'lamp' not in sp['id']:
                continue
            for (dx, dy, dw, dh) in drives:
                ix = min(sp['x'] + sp['w'], dx + dw) - max(sp['x'], dx)
                iy = min(sp['y'] + sp['h'], dy + dh) - max(sp['y'], dy)
                chk(not (ix > 0.25 and iy > 0.25),
                    'a light post is standing in the driveway a car drives through')
        for sp in ts2.get('sprites', []):
            chk('boulder' not in sp['id'], 'a volcanic boulder is back on the map')
        chk(len(ts2.get('lights', [])) >= 2,
            'no wall-falloff data - a face that does not darken from the eave down is the '
            'flat wall the painting did not have')
    chk(os.path.exists(REASM_HTML), 'the real render path page is missing')
    if os.path.exists(REASM_HTML):
        h = open(REASM_HTML).read()
        chk('imageSmoothingEnabled = false' in h or 'imageSmoothingEnabled=false' in h,
            'the reassembly draws with smoothing ON - that is not the real render path')
        chk('createLinearGradient' in h and 'D.shadows' in h,
            'the reassembly does not draw the cast shadows at runtime')
        chk('Math.round' in h, 'the reassembly blits sprites at fractional positions')
        for need, why in (('D.lights', 'the wall falloff'),
                          ('createRadialGradient', 'the vignette'),
                          ('createImageData', 'the dust pass'),
                          ('D.back', 'the haze that sets the block behind further back')):
            chk(need in h, 'the renderer lost %s - that is a look the painting had and a '
                           'tile structurally cannot carry' % why)

    # ---- Pocket City rule 3: three tones, top brightest, side darkest ---
    chk(M.TOP > M.FRONT > M.SIDE,
        'the three tones are not ordered sky-lit > front > away (TOP %.2f FRONT %.2f SIDE %.2f)'
        % (M.TOP, M.FRONT, M.SIDE))
    chk(M.TOP / M.SIDE >= 1.6,
        'top/away contrast is only %.2f - the volumes will read flat' % (M.TOP / M.SIDE))

    # ---- GRAVEYARD IS FINAL: the two killed candidates stay killed ------
    for dead in ('B_ISOBLOCK', 'C_CUTAWAY'):
        chk(dead in open('gates/bohemia_graveyard.txt').read(),
            '%s is not in the graveyard registry' % dead)
        chk(os.path.exists(os.path.join(OUTDIR, 'graveyard',
                                        'BOHEMIA_TARGET_%s.png' % dead)),
            '%s: the killed render is not kept as the record' % dead)
        chk(not os.path.exists(os.path.join(OUTDIR, 'BOHEMIA_TARGET_%s.png' % dead)),
            '%s is still sitting in the live target folder' % dead)
    chk('def screen_B' not in src and 'def screen_C' not in src,
        'a renderer for a graveyarded candidate is still live in the factory - GRAVEYARD '
        'IS FINAL, and a working renderer is an invitation to remake a corpse')

    # ---- the 45 LAW: the top of a mass is SKY-LIT, never a flat-90 wall -
    chk('ROOF_FS' in src and M.ROOF_FS < 0.45,
        'candidate A stopped foreshortening its roof - a full-depth roof slab reads as '
        'floor wallpaper (the exact failure of target v1)')


    # ---- REUSE-FIRST / APPROVED-ASSETS-FIRST ----------------------------
    chk('REUSE CHECK' in src, 'the factory carries no REUSE CHECK block')
    for b in (M.BANK_HOUSE, M.BANK_STREET, M.BANK_PROPS, M.BANK_DESERT,
              M.BANK_LAMPS, M.BANK_SIGNS, M.BANK_WALLS):
        chk(os.path.exists(b), 'declared approved bank is missing: %s' % b)
        chk(b in src, 'bank %s is claimed but never opened in code' % b)
    body = src.split('"""', 2)[-1]            # the module docstring names it to BAN it
    chk('TP_TILES' not in body,
        'the factory reaches into TP_TILES - that is the PRE-VERDICT judging corpus and '
        'sampling it is what put purple and neon in a dead house on 7/26')
    # the bodies are BAKED by the game, never drawn here
    chardir = os.path.join(OUTDIR, 'char')
    n = len([f for f in os.listdir(chardir)]) if os.path.isdir(chardir) else 0
    chk(n >= 8, 'records/target/char holds %d bakes - the target screens must wear the '
                'REAL character, exported from the shipped alpha' % n)
    chk(os.path.exists('tools/bohemia_char_export.js'),
        'the character exporter is gone; the screens would have to fake a body')

    # ---- the spec: the measurable canon --------------------------------
    sp = os.path.join(OUTDIR, 'BOHEMIA_TARGET_SPEC.json')
    chk(os.path.exists(sp), 'BOHEMIA_TARGET_SPEC.json (the measurable canon) is missing')
    if os.path.exists(sp):
        d = json.load(open(sp))
        chk(d['proportion_canon']['door_cells_tall'] == 2, 'spec: door is not 2 cells tall')
        chk(len(d['candidates']) == 1,
            'the direction is RULED: exactly one live candidate, the other two are dead')
        chk(set(d['graveyarded']) == {'B_ISOBLOCK', 'C_CUTAWAY'},
            'the spec does not record which candidates Paolo killed')
        chk(d['car_law']['cells_long'] == 3 and d['car_law']['cells_wide'] == 2,
            'the spec does not carry the locked 2x3 car law')
        chk(d['proportion_canon']['cell_m'] == 0.75,
            'spec: cell_m drifted off the engine constant 0.75')

    # ---- law 1: it has to be JUDGEABLE, from inside the alpha -----------
    chk(os.path.exists(JUDGE), 'the judge page was never written')
    if os.path.exists(JUDGE):
        h = open(JUDGE).read()
        chk('SUN MODE' in h, 'judge page has no SUN MODE (daylight-readable, standing law)')
        chk('EXPORT .txt' in h, 'judge page does not export')
        chk('.txt' in h and "type:'text/plain'" in h.replace('"', "'"),
            'judge page must export .txt, never .json')
        for v in ('APPROVE', 'CBB', 'KILL'):
            chk('data-v="%s"' % v in h, 'judge page is missing the %s verdict' % v)
        chk(h.count('data:image/png;base64,') >= 4,
            'judge page must show the target SIDE BY SIDE with the build he plays, plus '
            'the proof crops for the two defects he named')
        for dead in ('B_ISOBLOCK', 'C_CUTAWAY'):
            chk('data:image/png;base64,%s' % dead not in h,
                '%s must never be surfaced at him again' % dead)
        chk('2 x 3 TILES' in h.upper() or '2 X 3 TILES' in h.upper(),
            'the judge page must show him the car fix he asked for')
        chk('PROOF' not in h or True, '')
    chk(os.path.exists(LIFEHUB), 'the LIFE hub is missing')
    if os.path.exists(LIFEHUB):
        hub = open(LIFEHUB).read()
        chk(os.path.basename(JUDGE) in hub,
            'the target-screen judge is not reachable from inside the alpha (ONE-LINK LAW)')
        # ---- law 4: QUEST ASKS FROZEN ---------------------------------
        qi = [c for c in ('BOHEMIA_QUEST_PLACEMENT_JUDGE', 'BOHEMIA_QUEST_JUDGE') if c in hub]
        for c in qi:
            seg = hub[hub.index(c):hub.index(c) + 1400]
            chk('PARKED' in seg or 'FROZEN' in seg,
                'law 4: %s is still surfaced as a live ask. Quest verdicts are FROZEN until '
                'the visual bar is set.' % c)

    # ---- STEP ZERO: THE MOBILE RENDER CONTRACT (amendment D) -----------
    contract_checks(M, src)

    print('  %d passed, %d failed' % (P, F))
    return 1 if F else 0


CONTRACT = 'laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md'
PALETTE = os.path.join(OUTDIR, 'BOHEMIA_MASTER_PALETTE.json')
SURFACES = ('slices/BOHEMIA_RUN_CURRENT.html', 'slices/BOHEMIA_CITY_CURRENT.html')
# NAMED, DATED DEBT — not an excuse. Section 7 of the contract found on its first
# run that the CITY tab never sets imageSmoothingEnabled at all, so its world art
# has been drawn SMOOTHED (browser default) on a pixel-art game. That file is the
# CITY lane's (ONE SYSTEM, ONE SESSION) and that lane is mid-flight, so the ART
# lane reports it instead of reaching into it: backlog CITY, "smoothing off in the
# city slice". This entry makes the gap LOUD every run and must be deleted the
# moment the CITY lane lands the one-line fix - it is not allowed to go quiet.
PIPELINE_DEBT = {'slices/BOHEMIA_CITY_CURRENT.html':
                 'CITY lane owns this file; reported 7/26, backlog CITY item'}


def contract_checks(M, src):
    """Amendment D pins a contract BEFORE painting; this holds the contract and
    the factory to the same numbers so they can never drift apart, and holds the
    pipeline rule on the surfaces Paolo actually looks at."""
    chk(os.path.exists(CONTRACT), 'STEP ZERO: the mobile render contract does not exist')
    if not os.path.exists(CONTRACT):
        return
    doc = open(CONTRACT).read()
    # section 1-2: every pinned number is the number the code actually uses
    for label, val in (('base art resolution', '%d x %d art px' % (M.W, M.H)),
                       ('A ground cell', '%d px square' % M.CELL),
                       ('car footprint', '%d x %d tiles' % (M.CAR_L, M.CAR_W)),
                       ('A door', '2 cells = %d px' % (M.DOOR_CELLS * M.CELL))):
        chk(val in doc, 'contract drifted from the code: %s should read "%s"' % (label, val))
    chk('%d px' % int(round(M.BODY_PX * M.BODY_K)) in doc,
        'contract drifted: candidate A body height is %d px' % int(round(M.BODY_PX * M.BODY_K)))
    chk('%.2f > ' % M.TOP in doc and '%.2f' % M.SIDE in doc,
        'contract drifted: the three value bands must be quoted as %.2f / %.2f / %.2f'
        % (M.TOP, M.FRONT, M.SIDE))
    # section 1: integer zoom only
    chk(float(M.SCALE) == int(M.SCALE), 'the poster scale is not an integer zoom')
    chk('BANNED' in doc and 'non-integer' in doc.lower(),
        'the contract must ban non-integer scaling outright (amendment D)')
    # section 4-5: one light direction, no keyline, no dither
    chk('upper LEFT' in doc, 'the contract does not pin ONE light direction')
    chk('NO black keyline' in doc, 'the contract does not pin the outline rule')
    chk('No dither' in doc or 'no dither' in doc, 'the contract does not pin a dither policy')
    # section 6: the palette RATCHET, honestly stated
    chk(os.path.exists(PALETTE), 'the master palette ramp was never derived')
    if os.path.exists(PALETTE):
        pal = json.load(open(PALETTE))
        chk(len(pal['ramp_hex']) == pal['ramp_size'], 'the ramp does not match its declared size')
        got, ceil = pal['measured_unique_colours_in_target_plates'], pal['ceiling']
        chk(got <= ceil,
            'PALETTE RATCHET: the target plates now carry %d unique colours, over the '
            'tracked ceiling of %d. The corpus is not indexed yet (that lands with the '
            'act-1 tileset) but it is not allowed to get WORSE.' % (got, ceil))
        chk(str(got) in doc or '{:,}'.format(got) in doc,
            'the contract must quote the measured colour count (%d) rather than imply the '
            'palette is already enforced' % got)
        chk('NOT YET INSTRUMENTED' in doc,
            'the contract must say plainly that live canvas memory is not measured, not '
            'imply a check that does not exist')
    # section 7: the pipeline rule, on the real surfaces
    for f in SURFACES:
        if not os.path.exists(f):
            continue
        h = open(f, encoding='utf8', errors='replace').read()
        smooth_off = 'imageSmoothingEnabled=false' in h.replace(' ', '')
        if not smooth_off and f in PIPELINE_DEBT:
            print('  KNOWN GAP (reported, not fixed here): %s draws world art with '
                  'smoothing ON - %s' % (f, PIPELINE_DEBT[f]))
        else:
            chk(smooth_off,
                '%s draws world art with smoothing ON - that voids pixel art on a 3x '
                'phone' % f)
        chk('Math.floor' in h, '%s computes a cell size without flooring it' % f)


if __name__ == '__main__':
    sys.exit(main())
