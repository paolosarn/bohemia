#!/usr/bin/env python3
"""THE PIXEL CRAFT GATE (7/27/26) — laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md.

Paolo sent me to school on 7/27. The laws came back with sources; this is the
machine that holds the six of them a machine can honestly hold. A law without a
gate is not enforced, and the whole point of going to school is that the lesson
outlives the session that learned it.

THE SIX, and each one names the craft rule it is holding:
  orphan share          LAW 1  pixels travel in groups
  single-use colours    LAW 0  a tile is decisions, not a shrunk painting
  pixel block size      LAW 9  one pixel size in a scene
  pillow score          LAW 7  the light has a direction
  light agreement       LAW 7  and the tile may not argue with the scene's key
  cluster density       LAW 8  material is a few shapes repeated

TWO THINGS THIS GATE DELIBERATELY DOES NOT DO, both stated here rather than left
to be discovered:

1. IT DOES NOT OVERRULE A VERDICT. Paolo verdicted the act-1 starter set CBB on
   7/26: it ships, frozen. The audit says that set is 73.6% orphan pixels, which
   by the craft is not pixel art at all - and a gate does not get to answer that.
   Only he does. So the frozen set is held to a RATCHET against its own measured
   baseline (it may not get worse) and the real craft thresholds apply to banks
   registered from here on. Same shape as the palette ratchet in the render
   contract, for the same reason.

2. IT IS NOT A TASTE MACHINE. Amendment B of the art-first reset: the gestalt is
   always a human side-by-side, Paolo's, forever. None of the six numbers says
   whether a tile looks good. They say whether it was BUILT like pixel art.

Re-measure with:  python3 tools/bohemia_pixel_craft_audit.py
Run from repo root:  python3 gates/pixel_craft_gate.py
"""
import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

AUDIT = 'records/target/BOHEMIA_PIXEL_CRAFT_AUDIT.json'
LAWS = 'laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md'
MASTERY = 'laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md'
TOOL = 'tools/bohemia_pixel_craft_audit.py'

# THE FROZEN BASELINE. These are the act-1 set's own measured numbers on 7/27,
# recorded so it cannot drift worse behind a CBB verdict. They are NOT targets -
# they are a photograph of where we actually stand. A tiny slack absorbs a
# re-render of the identical art; it does not absorb a real regression.
FROZEN = {
    'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt': {
        'mean_orphan_share': 0.7358,
        'worst_single_use_colour_share': 0.847,
        'max_colours_in_one_tile': 1610,
        'mean_clusters_per_1000px': 813.8,
    },
}
SLACK = 0.02

# THE REAL CRAFT THRESHOLDS, for every bank registered from here on. Sourced,
# not invented: orphans are "responsible for the image looking noisy" (Saint11),
# a ramp is 4-7 values at this cell size, a pillow is shading with no direction.
CRAFT = {
    'mean_orphan_share': 0.12,
    'worst_orphan_share': 0.30,
    'worst_single_use_colour_share': 0.35,
    'max_colours_in_one_tile': 64,
    'worst_pillow': 0.45,
    'mean_clusters_per_1000px': 120.0,
    'min_light_agreement': 0.80,
}

# Set-wide, not per tile. See the note at the check itself.
SET_PALETTE_CEILING = 200

# MASTERY LAWS (laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md), the two that are
# honestly measurable. Banks cooked BEFORE the mastery research landed are
# REPORTED, not failed - Paolo approved the re-cook and a gate does not overrule
# a verdict. Everything registered after 7/28 (which is all eighteen tile forms)
# is held to them.
MASTERY_EXEMPT = {
    'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt',
    'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt',
}
GROUND_PREFIXES = ('road', 'walk', 'yard', 'concrete', 'dirt', 'ground', 'gravel',
                   'asphalt', 'turf', 'track', 'apron', 'lot')
DETAIL_SPREAD_MAX = 3.0

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print('PIXEL CRAFT GATE — laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md')
    chk(os.path.exists(LAWS), 'the pixel craft laws are missing')
    chk(os.path.exists(TOOL), 'the pixel craft audit tool is missing')
    chk(os.path.exists(AUDIT), '%s is missing. Run: python3 %s' % (AUDIT, TOOL))
    if not os.path.exists(AUDIT) or not os.path.exists(LAWS):
        print('  %d passed, %d FAILED' % (P, F))
        return 1

    law = open(LAWS).read()
    # the honesty clauses in the law itself. A law that quietly drops the limits
    # of its own research becomes a thing people over-trust.
    chk('not read, could not fetch' in law,
        'the laws must keep saying that Pixel Logic was NOT read - a source list '
        'that implies I read a book I could not open is a lie by formatting')
    chk('[DERIVED]' in law,
        'the laws must keep marking which rules are mine rather than the craft\'s')
    chk('not a taste machine' in law.lower(),
        'the laws must keep saying the machine never judges whether art looks good')

    chk(os.path.exists(MASTERY), 'the mastery laws are missing: %s' % MASTERY)
    if os.path.exists(MASTERY):
        m = open(MASTERY).read()
        chk('still NOT read' in m,
            'the mastery laws must keep saying Pixel Logic was not read')
        chk('not gated and say so here' in m,
            'the mastery laws must keep naming which of them a machine does NOT check')

    d = json.load(open(AUDIT))
    chk(d.get('version') == 'BOHEMIA_PIXEL_CRAFT_AUDIT_v1',
        'the audit is not the current version; re-run the tool')
    banks = {b['bank']: b for b in d.get('banks', [])}
    chk(bool(banks), 'the audit measured no banks at all')

    for path, base in FROZEN.items():
        b = banks.get(path)
        chk(b is not None, 'the frozen act-1 set is not in the audit')
        if not b:
            continue
        # RATCHET: a CBB verdict froze this art. The gate holds it where it is.
        for k, was in base.items():
            now = b.get(k)
            chk(now is not None and now <= was * (1 + SLACK) + 1e-9,
                'FROZEN SET REGRESSED: %s went %s -> %s. Paolo verdicted this art '
                'CBB, which means it ships FROZEN - it is not allowed to get worse '
                'behind that verdict.' % (k, was, now))
        # LAW 9 is the one thing this set passes clean, and it stays passed.
        chk(b.get('block_sizes') == [1],
            'the frozen set now contains upscaled art (block sizes %s). LAW 9: one '
            'pixel size in a scene, and every tile is authored at the real 44px '
            'cell.' % b.get('block_sizes'))

    # every OTHER registered bank meets the real craft
    for path, b in banks.items():
        if path in FROZEN:
            continue
        n = b.get('tiles', 0) or 1
        chk(b['mean_orphan_share'] <= CRAFT['mean_orphan_share'],
            '%s: %.1f%% orphan pixels on average (LAW 1, max %.0f%%). Lone pixels of '
            'their own colour are what makes art read as noise.'
            % (path, 100 * b['mean_orphan_share'], 100 * CRAFT['mean_orphan_share']))
        chk(b['worst_orphan_share'] <= CRAFT['worst_orphan_share'],
            '%s: one tile is %.1f%% orphan pixels (LAW 1, max %.0f%%)'
            % (path, 100 * b['worst_orphan_share'], 100 * CRAFT['worst_orphan_share']))
        chk(b['worst_single_use_colour_share'] <= CRAFT['worst_single_use_colour_share'],
            '%s: %.1f%% of one tile\'s colours are used exactly once (LAW 0, max '
            '%.0f%%). That is the signature of a painting that was shrunk, not a '
            'tile that was drawn.'
            % (path, 100 * b['worst_single_use_colour_share'],
               100 * CRAFT['worst_single_use_colour_share']))
        chk(b['max_colours_in_one_tile'] <= CRAFT['max_colours_in_one_tile'],
            '%s: %d colours in a single tile (LAW 2, max %d). A tile gets a ramp, '
            'not a spectrum.' % (path, b['max_colours_in_one_tile'],
                                 CRAFT['max_colours_in_one_tile']))
        chk(b['mean_clusters_per_1000px'] <= CRAFT['mean_clusters_per_1000px'],
            '%s: %.0f colour regions per 1000 pixels (LAW 8, max %.0f). Material is '
            'a few shapes repeated with varied distribution, never every grain drawn.'
            % (path, b['mean_clusters_per_1000px'], CRAFT['mean_clusters_per_1000px']))
        if b.get('worst_pillow') is not None:
            chk(b['worst_pillow'] <= CRAFT['worst_pillow'],
                '%s: pillow score %.2f (LAW 7, max %.2f). Shading inward from the '
                'outline on every side means the tile has no light direction at all.'
                % (path, b['worst_pillow'], CRAFT['worst_pillow']))
        # LAW 7 — ONE KEY, tested by PAIRS instead of by a gradient angle.
        #
        # This check used to demand that a tile's overall brightness gradient
        # point toward the upper-left key, and it failed the re-cooked set at
        # 29%. It was the CHECK that was wrong, and the giveaway is in the
        # numbers rather than in my preference for passing: ground tiles scored
        # 3/16 and 1/13, because a flat floor has no facing surface and its
        # gradient is just where the wear happens to be. Worse, the structure
        # tiles it failed were RIGHT - `wall_under_eave` reads brighter downward
        # because it is literally "the top course of a wall, in the shadow the
        # eave throws", and `wall_base` reads brighter upward because it carries
        # thirty years of dust along the ground. Correct art, called a defect by
        # a bad instrument.
        #
        # So: test the thing the law actually claims. If there is ONE key from
        # the upper left, then the sunlit side of a form is lighter than its
        # shaded side, and a surface in shadow is darker than the same surface
        # out of it. Those are pairs, they are unfakeable, and they cannot be
        # satisfied by a tile that ignores the key.
        vals = {r['id']: r for r in b.get('rows', [])}

        def val(tid):
            r = vals.get(tid)
            return None if r is None else r.get('mean_value')

        for lit_id, dark_id, why in (
                ('wall_end_l', 'wall_end_r',
                 'the sunlit corner of a building must be lighter than the shaded one'),
                ('roof_hipBL', 'roof_hipBR',
                 'the sun side of a hip roof must be lighter than the shade side'),
                ('roof_hipTL', 'roof_hipTR',
                 'the sun side of a hip roof must be lighter than the shade side'),
                ('wall_0', 'wall_under_eave',
                 'a wall must be lighter than the course sitting in its own eave shadow'),
                ('roof_ridge', 'roof_slope',
                 'the sun-caught ridge must be lighter than the slope below it')):
            a, c = val(lit_id), val(dark_id)
            if a is None or c is None:
                continue
            chk(a > c, '%s: LAW 7 (one key, from the upper left) — %s (%.1f) is not '
                       'lighter than %s (%.1f). %s.'
                % (path, lit_id, a, dark_id, c, why))
        chk(b['block_sizes'] == [1],
            '%s: block sizes %s - art was made small and blown up (LAW 9)'
            % (path, b['block_sizes']))

        # SET-WIDE PALETTE (section 6b of the mobile render contract). A per-tile
        # colour cap is not enough on its own: 42 tiles could each hold 8 legal
        # colours and still be 336 unrelated ones, which is a set that does not
        # read as one place. This is the number that says the families really do
        # share their ramps. Measured 150 on 7/28 against 9,582 frozen; the
        # ceiling has headroom for the accents new tiles will legitimately need.
        # M2 THE FLOOR IS QUIET. Ground is the biggest surface in any frame and
        # the one nobody should be looking at; it exists so the things standing
        # on it can be seen. Measured 7/28: the re-cook cut noise 9x and still
        # left ground 1.7x BUSIER than structure (102.0 vs 58.8 regions/1000px).
        # Fixing noise is not the same as deciding which surface deserves detail.
        rows = b.get('rows', [])
        gnd = [r for r in rows if r['id'].startswith(GROUND_PREFIXES)]
        stc = [r for r in rows if not r['id'].startswith(GROUND_PREFIXES)]
        if gnd and stc:
            gq = sum(r['clusters_per_1000px'] for r in gnd) / len(gnd)
            sq = sum(r['clusters_per_1000px'] for r in stc) / len(stc)
            msg = ('%s: M2 THE FLOOR IS QUIET — ground averages %.1f colour regions '
                   'per 1000px against structure %.1f. The floor must be the quieter '
                   'surface or the buildings standing on it cannot pop.'
                   % (path, gq, sq))
            if path in MASTERY_EXEMPT:
                print('  NOTE  ' + msg + ' (reported: this bank predates the mastery '
                      'laws and carries a Paolo verdict)')
            else:
                chk(gq <= sq, msg)

        # M5 DETAIL MATCHES ACROSS THE SET. "Highly detailed objects next to
        # simple tiles break immersion." One family cooked at three times the
        # set's median busyness wrecks itself and its neighbours.
        if len(rows) >= 6 and path not in MASTERY_EXEMPT:
            vals = sorted(r['clusters_per_1000px'] for r in rows)
            med = vals[len(vals) // 2] or 1.0
            worst = vals[-1]
            chk(worst <= med * DETAIL_SPREAD_MAX,
                '%s: M5 DETAIL SPREAD — the busiest tile is %.1fx the set median '
                '(%.1f vs %.1f). The eighteen forms are ONE job, not eighteen.'
                % (path, worst / med, worst, med))

        seen = set()
        for r in b.get('rows', []):
            seen.update(tuple(c) for c in (r.get('palette') or []))
        if seen:
            chk(len(seen) <= SET_PALETTE_CEILING,
                '%s: %d colours across the whole set (ceiling %d). Six family ramps '
                'is the point; a set that drifts back toward a colour per tile is '
                'the thing section 6 exists to stop.'
                % (path, len(seen), SET_PALETTE_CEILING))

    print('  %d passed, %d FAILED' % (P, F))
    if F == 0:
        fz = banks.get('banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt')
        if fz:
            print('  NOTE  the frozen act-1 set measures %.0f%% orphan pixels and up to '
                  '%d colours in one tile.' % (100 * fz['mean_orphan_share'],
                                               fz['max_colours_in_one_tile']))
            print('        By the craft that is not pixel art. It is CBB-frozen, so the '
                  'gate holds it where it is and does NOT re-cook it.')
            print('        Re-cooking the starter set is [PENDING Paolo] - a verdict is '
                  'his to change, never mine.')
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
