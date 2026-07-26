"""Generate FEMALE_BAKED from BAKED by an anatomical, DIRECTION-AWARE resample.

WHY v1 AND v2 FAILED (Paolo 7/25: "dogshit... doesn't look like a female body"):
  v1 scaled ONLY the torso, timidly, and left the legs -- which ARE the hips in
  this rig -- fully male, so the hip "flare" shelved out over an unchanged male
  lower body.
  v2 fixed the shelf but still read as a SMALLER PERSON, not a woman, because
  (a) it narrowed the shoulders AND thinned the arms, which just shrinks the
  whole figure toward a child, and (b) it put the hip flare at rows 31-34 --
  exactly where the hanging arms and hands sit, so the one real female cue was
  100% occluded by the arms in every arms-down pose.

WHAT ACTUALLY READS AT 56px, arms down:
  - the outer silhouette from row 17-34 is ARMS, not torso. Nothing you do to
    torso width in that band is visible head-on.
  - so head-on (S/N) the female cues must be: a WAIST PINCH (reads as a visible
    gap opening between torso and the hanging arms) and a THIGH/HIP FLARE placed
    BELOW the hands (row 35+), where nothing occludes it.
  - in PROFILE and the diagonals the depth axis is on screen, so a BUST can read
    as a real silhouette bump on the FRONT edge, and the glute on the BACK edge.
    That is the strongest available cue and v1/v2 used neither.
  - shoulders stay near male width and arms are NOT thinned, so she reads as a
    woman rather than as a smaller copy of the man.
"""
import json, copy, math

import os
ALPHA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'slices', 'BOHEMIA_ALPHA_0_9.html')
SP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'records', '')

# symmetric width scale over the torso span (t=0 shoulder -> t=1 hip)
# v4 numbers come from RESEARCH (7/25, see the record). Anthropometry + the
# Loomis/Proko canon converge hard, and they say the opposite of what v2/v3 did:
#   shoulder-to-hip RATIO is the gender signal   male 1.43-1.48 -> female 1.27-1.33
#   shoulder width  0.86x   (3 independent sources: 0.857 / 0.884 / 0.893)
#   ribcage width   0.86x, volume 0.90x
#   hip width       1.00-1.05x  <-- REAL female hips are barely wider in absolute cm
#   waist width     0.75x stylized / 0.90x realistic
# "At small scale prefer NARROWING THE SHOULDERS over widening the hips. Widening
# hips is what produces the thick failure mode." That is exactly the BBL Paolo saw:
# v2/v3 bought the hourglass with hip mass instead of with ribcage taper.
TORSO_PROFILE = [
    (0.00, 0.86),   # shoulders  0.86x -- the sourced number
    (0.20, 0.87),
    (0.34, 0.88),   # ribcage    0.86-0.90x: the whole upper torso is SMALLER, and
                    #            this is the cue v3 was missing (it sat at 1.00)
    (0.55, 0.72),   # waist      between the 0.75 stylized and 0.90 realistic values
    (0.80, 0.92),
    (1.00, 1.02),   # hip        1.00-1.05x, NOT the 1.20 that read as a BBL
]
# thigh/hip splay, per side in px, by row offset BELOW the torso. Peaks at +3..+6
# i.e. rows ~35-38 -- BELOW the hands (which end row 34), so it is actually seen.
LEG_SPLAY = [(0, 0.3), (2, 0.5), (4, 0.55), (7, 0.35), (10, 0.15), (13, 0.0)]

# front-edge BUST bulge (px) over the torso span -- only on facings with a
# readable depth axis (profiles + diagonals)
# BUST IS A LATE DETAIL, NOT THE GENDER SIGNAL (research, verbatim: "if the
# shoulder-to-hip ratio still reads male, adding a bust reads as a man with
# breasts"). It rides on top of a ribcage that is already female, never instead.
BUST = [(0.16, 0.0), (0.25, 1.0), (0.34, 1.5), (0.45, 1.1), (0.56, 0.0)]
# back-edge GLUTE bulge (px), low torso + first thigh rows
GLUTE = [(0.78, 0.0), (0.92, 0.6), (1.00, 0.8)]
GLUTE_LEG = [(0, 0.8), (2, 0.6), (5, 0.25), (8, 0.0)]   # by row offset below torso

NECK_SCALE = 0.86   # sourced: female neck circumference 33.3 vs 38.7 cm

CLEAN_PARTS = ['4', '9', '10']   # solid blobs: safe to cull nubs. NEVER the neck.

PELVIS_BLEND = 3.0   # rows above the torso's base over which the pelvis picks up
                     # the thigh splay, so torso >= leg width at the junction

ARM_THIN = False     # NEVER: thinning arms shrinks the figure, it does not feminise it


def _lerp(tbl, t):
    if t <= tbl[0][0]: return tbl[0][1]
    if t >= tbl[-1][0]: return tbl[-1][1]
    for k in range(len(tbl) - 1):
        a, va = tbl[k]; b, vb = tbl[k + 1]
        if a <= t <= b:
            f = 0 if b == a else (t - a) / (b - a)
            return va + (vb - va) * f
    return tbl[-1][1]


def load_baked(src):
    i = src.index('const BAKED=')
    s = src.index('{', i)
    d = 0
    for k in range(s, len(src)):
        if src[k] == '{': d += 1
        elif src[k] == '}':
            d -= 1
            if d == 0:
                return json.loads(src[s:k + 1])
    raise RuntimeError('BAKED not found')


def build(src):
    B = load_baked(src)
    CW = B['W']
    F = copy.deepcopy(B)

    for d in B['layers']:
        L = B['layers'][d]
        RESHAPE = ['3', '4', '9', '10']
        # NOTE: parts genuinely OVERLAP in the source (on the hip row the torso and
        # both legs claim the same pixels; draw order resolves it at render time).
        # So membership must be tracked PER PART -- a single {x: part} row map lets
        # the legs clobber the torso and the torso loses its whole bottom row.
        rowsOf = {p: {} for p in RESHAPE}          # part -> y -> [x,...]
        rowExtent = {}                              # y -> [minx, maxx] across all parts
        for p in RESHAPE:
            for idx in L[p]:
                x, y = idx % CW, idx // CW
                rowsOf[p].setdefault(y, []).append(x)
                e = rowExtent.setdefault(y, [x, x])
                if x < e[0]: e[0] = x
                if x > e[1]: e[1] = x

        trows = sorted({idx // CW for idx in L['4']})
        tTop, tBot = trows[0], trows[-1]
        tSpan = (tBot - tTop) or 1
        cx = B['skeleton'][d]['waC'][0]

        # which screen side is the FRONT? the face (part 2) centroid vs the torso's.
        # |bias| small => head-on facing, no readable depth axis => no bust/glute.
        face = L.get('2') or []
        if face:
            fcx = sum(i % CW for i in face) / len(face)
            tcx = sum(i % CW for i in L['4']) / len(L['4'])
            bias = fcx - tcx
        else:
            bias = 0.0
        depth_reads = abs(bias) >= 0.45
        front_right = bias > 0

        # Per-row transform T(x) shared by every part in that row, applied to each
        # part SEPARATELY so membership is preserved. (The first cut built one
        # combined target span and back-sampled it -- on rows where torso and legs
        # overlap the legs overwrote the torso, and the torso silently lost its
        # entire bottom row on S/E/N/W. Garments key off part 4, so that was a real
        # coverage bug, not just a cosmetic one. The gate caught it.)
        out = {p: set() for p in RESHAPE}
        for y in sorted(rowExtent):
            mn, mx = rowExtent[y]

            if y < tTop:
                # NECK (part 3) sits above the torso. 0.86x thickness, the same
                # sourced factor as the shoulders.
                sc = NECK_SCALE
                bust = glute = splay = 0.0
            elif y <= tBot:
                t = (y - tTop) / tSpan
                sc = _lerp(TORSO_PROFILE, t)
                bust = _lerp(BUST, t) if depth_reads else 0.0
                glute = _lerp(GLUTE, t) if depth_reads else 0.0
                # PELVIS CONTINUITY (Paolo 7/25: "the leg looks like it's chopping
                # off from the rest of the body"). ROOT CAUSE: the ANATOMY border
                # rule outlines any body pixel with empty space above it. If the
                # thighs splay WIDER than the torso above them, the exposed leg
                # tops get the dark border tone and a hard line is drawn straight
                # across the hip -- reading as the leg detaching. So the torso's
                # bottom rows must carry AT LEAST the thigh's splay: the pelvis
                # flares before the legs do, exactly like real anatomy.
                near = tBot - y
                splay = _lerp(LEG_SPLAY, 0) * max(0.0, 1.0 - near / PELVIS_BLEND) if near <= PELVIS_BLEND else 0.0
            else:
                off = y - tBot
                sc = 1.0
                bust = 0.0
                glute = _lerp(GLUTE_LEG, off) if depth_reads else 0.0
                splay = _lerp(LEG_SPLAY, off)

            extraR = splay + (bust if front_right else glute)
            extraL = splay + (glute if front_right else bust)
            # The neck must scale about ITS OWN axis, not the waist centre. On the
            # diagonals the neck sits well off waC.x, so scaling it about the waist
            # squashed a 4px neck to 2px -- a 50% cut instead of the intended 0.86.
            ax = cx if y >= tTop else (mn + mx) / 2.0
            spanR = max(1.0, mx - ax)
            spanL = max(1.0, ax - mn)

            def T(x):
                if x >= ax:
                    return ax + (x - ax) * sc + extraR * ((x - ax) / spanR)
                return ax - (ax - x) * sc - extraL * ((ax - x) / spanL)

            # map each part's own pixels, filling the gaps a stretch opens up
            for p in RESHAPE:
                pxs = sorted(rowsOf[p].get(y, []))
                if not pxs: continue
                mapped = [int(math.floor(T(x) + 0.5)) for x in pxs]
                for k, nx in enumerate(mapped):
                    if 0 <= nx < CW: out[p].add(y * CW + nx)
                    if k + 1 < len(mapped) and pxs[k + 1] == pxs[k] + 1:
                        a, b = nx, mapped[k + 1]
                        if b > a + 1:
                            for gx in range(a + 1, b):
                                if 0 <= gx < CW: out[p].add(y * CW + gx)

        # CLEANUP (Paolo 7/25: "stray pixels flying off next to the butt on some
        # of the cardinal directions"). The resample can strand a pixel when a
        # stretched row's edge pixel lands away from its neighbours. The male art
        # has ZERO nubs in these three solid parts, so culling anything with <=1
        # same-part orthogonal neighbour matches his baseline exactly and cannot
        # eat thin art (torso and legs are solid blobs, no thin structures).
        # The cull runs on the SOLID parts only. The neck is thin art (a 4x2 strip
        # whose corner pixels legitimately have one neighbour) and culling it ate
        # the neck's outer column -- the same "never eat thin intentional art" rule
        # the engine's own refineSkin already observes.
        for p in CLEAN_PARTS:
            S = set(out[p])
            # MINIMUM-WIDTH CLAMP: the shoulder scale can squeeze a row the male
            # painted 2px wide down to a single pixel. On the pure profiles that is
            # the torso's apex, and a lone pixel with one neighbour is exactly the
            # "stray flying off" shape. If the male row had >=2, keep >=2.
            male_rows = {}
            for idx in L[p]:
                male_rows.setdefault(idx // CW, []).append(idx % CW)
            fem_rows = {}
            for idx in S:
                fem_rows.setdefault(idx // CW, []).append(idx % CW)
            for y, mxs in male_rows.items():
                if len(set(mxs)) < 2: continue
                fxs = fem_rows.get(y, [])
                if len(set(fxs)) == 1:
                    x0 = fxs[0]
                    nx = x0 - 1 if x0 > cx else x0 + 1
                    if 0 <= nx < CW: S.add(y * CW + nx)
            pre = set(S)          # ROW PRESERVATION: culling must never delete a row
                                  # outright. On the pure profiles the torso's apex is
                                  # a 1-2px stub with a single neighbour, so a naive
                                  # cull ate the top row of the body entirely.
            for _ in range(3):
                drop = set()
                for idx in S:
                    x, y = idx % CW, idx // CW
                    n = 0
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < CW and 0 <= ny < CW and (ny * CW + nx) in S: n += 1
                    if n <= 1: drop.add(idx)
                if not drop: break
                S -= drop
            rows_now = {i // CW for i in S}
            for i in pre:
                if (i // CW) not in rows_now: S.add(i)     # restore any row the cull emptied
            # close 1px holes inside a row's own span (a stretch can skip one)
            rows = {}
            for idx in S: rows.setdefault(idx // CW, []).append(idx % CW)
            for y, xs in rows.items():
                xs = sorted(xs)
                for a, bx in zip(xs, xs[1:]):
                    if bx == a + 2: S.add(y * CW + a + 1)
            out[p] = S

        # PELVIS COVER, made EXPLICIT rather than tuned, and applied AFTER the
        # cleanup so the cull can never eat it. A blend constant only approximated
        # the constraint; the real rule is exact and checkable: the torso's base
        # must span at least as wide as the leg row directly beneath it, or those
        # leg pixels have empty space above them, take the dark ANATOMY border,
        # and draw a hard line across the hip -- the "leg chopping off" Paolo saw,
        # and it was failing on precisely the cardinal facings he named.
        # Covers the last TWO torso rows so every pixel it adds has a vertical
        # neighbour and cannot itself become a stray.
        trowsF = sorted({i // CW for i in out['4']})
        if trowsF:
            tb2 = trowsF[-1]
            legs_below = [i % CW for i in (out['9'] | out['10']) if i // CW == tb2 + 1]
            if legs_below:
                torso_base = [i % CW for i in out['4'] if i // CW == tb2]
                lo = min(legs_below + torso_base)
                hi = max(legs_below + torso_base)
                for yy in (tb2, tb2 - 1):
                    if yy < 0: continue
                    for x in range(lo, hi + 1):
                        out['4'].add(yy * CW + x)

        for p in RESHAPE:
            F['layers'][d][p] = sorted(out[p])

        # arms follow the (barely moved) shoulder line; never thinned
        sc0 = _lerp(TORSO_PROFILE, 0.0)
        shL = B['skeleton'][d]['shL']; shR = B['skeleton'][d]['shR']
        dxL = int(round(cx + (shL[0] - cx) * sc0)) - shL[0]
        dxR = int(round(cx + (shR[0] - cx) * sc0)) - shR[0]
        for parts, dx in ((('5', '7'), dxL), (('6', '8'), dxR)):
            if dx == 0: continue
            for p in parts:
                arr = L.get(p)
                if not arr: continue
                s = set()
                for idx in arr:
                    nx = idx % CW + dx
                    if 0 <= nx < CW: s.add((idx // CW) * CW + nx)
                F['layers'][d][p] = sorted(s)
        for jn, dx in (('shL', dxL), ('elL', dxL), ('handL', dxL),
                       ('shR', dxR), ('elR', dxR), ('handR', dxR)):
            j = B['skeleton'][d][jn]
            F['skeleton'][d][jn] = [j[0] + dx, j[1]]
            if d in B['pose'] and jn in B['pose'][d]:
                pj = B['pose'][d][jn]
                F['pose'][d][jn] = [pj[0] + dx, pj[1]]

    return B, F


def inject(F):
    body = json.dumps(F, separators=(',', ':'))
    lines = open(ALPHA).readlines()
    for i, l in enumerate(lines):
        if l.startswith('const FEMALE_BAKED='):
            lines[i] = 'const FEMALE_BAKED=' + body + ';\n'
            open(ALPHA, 'w').writelines(lines)
            return True
    return False


if __name__ == '__main__':
    B, F = build(open(ALPHA).read())
    if '--inject' in __import__('sys').argv:
        print('injected into the alpha' if inject(F) else 'FEMALE_BAKED line not found')
    CW = B['W']

    def widths(pack, d):
        rows = {}
        for p in ['4', '9', '10']:
            for idx in pack['layers'][d][p]:
                x, y = idx % CW, idx // CW
                rows.setdefault(y, [99, -1])
                rows[y][0] = min(rows[y][0], x); rows[y][1] = max(rows[y][1], x)
        return rows

    for d in ['S', 'E']:
        mw, fw = widths(B, d), widths(F, d)
        print(f'--- {d} ---')
        for y in sorted(set(mw) | set(fw)):
            m, f = mw.get(y), fw.get(y)
            ms = f'{m[1]-m[0]+1:>2}' if m else ' -'
            fs = f'{f[1]-f[0]+1:>2}' if f else ' -'
            dd = f'  {(f[1]-f[0]+1)-(m[1]-m[0]+1):+d}' if (m and f) else ''
            print(f'  y={y:>2} male {ms}  female {fs}{dd}')
