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
import sys

from PIL import Image, ImageStat

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

FACTORY = 'tools/bohemia_target_screen_factory.py'
OUTDIR = 'records/target'
JUDGE = 'slices/BOHEMIA_TARGET_SCREEN_JUDGE_7_26_26.html'
LIFEHUB = 'slices/BOHEMIA_LIFE_CURRENT.html'
KEYS = ('A_FRONTFACE', 'B_ISOBLOCK', 'C_CUTAWAY')

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
    door_b = M.DOOR_CELLS * M.ZH
    body_b = M.BODY_PX * 1.20                      # iso_body's default k
    pct_b = 100.0 * body_b / door_b
    chk(68 <= pct_b <= 90,
        'B/C ISO: a body clears %.0f%% of its 2-cell door (want 68-90)' % pct_b)
    chk('def iso_body' in src and 'k=1.20' in src,
        'the iso body scale moved without this gate being told (k must stay declared)')

    # ---- Pocket City rule 3: three tones, top brightest, side darkest ---
    chk(M.TOP > M.FRONT > M.SIDE,
        'the three tones are not ordered sky-lit > front > away (TOP %.2f FRONT %.2f SIDE %.2f)'
        % (M.TOP, M.FRONT, M.SIDE))
    chk(M.TOP / M.SIDE >= 1.6,
        'top/away contrast is only %.2f - the volumes will read flat' % (M.TOP / M.SIDE))

    # ---- the 45 LAW: the top of a mass is SKY-LIT, never a flat-90 wall -
    chk('ROOF_FS' in src and M.ROOF_FS < 0.45,
        'candidate A stopped foreshortening its roof - a full-depth roof slab reads as '
        'floor wallpaper (the exact failure of target v1)')
    chk(M.ZH > M.TH,
        'the iso height unit collapsed to the tile height; masses will read squashed')

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
        chk(len(d['candidates']) >= 2, 'spec: fewer than 2 candidates (law says 2-3)')
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
        for k in KEYS:
            chk('data-k="%s"' % k in h, 'judge page has no pick control for %s' % k)
        chk(h.count('data:image/png;base64,') >= 6,
            'judge page must show each candidate SIDE BY SIDE with the build he plays')
        chk('pick ONE' in h, 'judge page must say this is a PICK, not a thumbs-up pile')
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

    print('  %d passed, %d failed' % (P, F))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
