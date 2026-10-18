#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the look bible]: THE HAND-FINISH, AS BIG AS IT REALLY IS (research round two, Sections B and E:
'hand-finish the robot's eight rest frames yourself with B4 to B9 ... and register raw-next-to-finished in the VOTE tab,
so what he votes on is the exact size of the hand pass, not a theory of it').

Adapted to OUR look (style guide field 7: smooth clay, not a stepped toon ramp, so B3's quantise and B4's sliver merge
have nothing to do and are skipped by name). The steps that run, in the research's order:
  B2  HARDEN THE ALPHA      the body is 0 or 255 already (the rig thresholds at the guide's 127); checked, counted.
  B5  SPECKLE OUT           a body pixel more than 48 values off the median of its own material's 3x3 neighbours, with no
                            4-neighbour of its material within 16 of it, is a render firefly, not wear: it takes the
                            median. The grain is two pixels a run on purpose and survives (a lone pixel is not grain).
  B6  SELOUT                the ring the rig darkened 8 is coloured by the light: on the half of the silhouette that faces
                            the measured screen light (the calibration's angle) the ring goes back up to its inside
                            neighbour's colour; on the shadow half it goes 10 further down. The edge is dark only where the
                            light would leave it dark.
  B7  STAIRCASES (flag)     non-monotonic runs on the silhouette are counted for the eye, not moved by the script.
  B8  HIGHLIGHTS            at most 3 clusters of 2 px, on the clay facing the light: the brightest local maxima of the
                            main material at least 6 px apart, lifted halfway to the palette role's top step. Clay stays
                            matte (a lift, never a white).
  B9  THE EYES (the eye's   on every facing that shows a face (S, SE, SW, E, W), the two largest clusters of the eye
      step, by coordinates  material in the top half of the sprite each get ONE glint pixel, the glass_eye role's glint,
      the script finds)     on the cluster's pixel nearest the light. The analog-horror stare (bible R6): the eyes must
                            read at 1x on a phone.
Writes fin_<facing>.png beside the rig's files and finish.json with every count, so the sheet can say how many pixels
the hand moved.

    python3 tools/bohemia_direction_hand_finish.py <rig_dir> [--main Main --eye Black --role clay_mustard]
"""
import json, math, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAL = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']
FACE_FACINGS = ('S', 'SE', 'SW', 'E', 'W')


def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)


def ids_from(rgbid, table):
    """the material-ID render to a label image: nearest of the table's colours, -1 where transparent"""
    names = list(table); cols = np.array([hexrgb(table[n]) for n in names])
    a = rgbid[..., :3].astype(float); d = ((a[..., None, :] - cols[None, None]) ** 2).sum(-1)
    lab = d.argmin(-1); lab[rgbid[..., 3] < 128] = -1
    return lab, names


def finish(png, idpng, table, light_deg, main, eye, role, facing):
    a = np.asarray(Image.open(png).convert('RGBA')).astype(float)
    idim = np.asarray(Image.open(idpng).convert('RGBA'))
    lab, names = ids_from(idim, table)
    H, W = a.shape[:2]
    body = (a[..., 3] == 255)
    rep = dict(facing=facing)
    rep['B2_soft_alpha_on_body'] = int(((a[..., 3] > 0) & (a[..., 3] < 255) & (a[..., :3].sum(-1) > 0)).sum())
    before = a.copy()
    val = a[..., :3].mean(-1)
    # B5: fireflies
    fixed = 0
    for y in range(1, H - 1):
        for x in range(1, W - 1):
            if not body[y, x] or lab[y, x] < 0: continue
            win = (slice(y - 1, y + 2), slice(x - 1, x + 2))
            same = body[win] & (lab[win] == lab[y, x]); same[1, 1] = False
            if same.sum() < 4: continue
            med = np.median(val[win][same])
            if abs(val[y, x] - med) <= 48: continue
            n4 = [(y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)]
            if any(body[p] and lab[p] == lab[y, x] and abs(val[p] - val[y, x]) <= 16 for p in n4): continue
            pix = a[win][..., :3][same]; a[y, x, :3] = np.median(pix, 0); fixed += 1
    rep['B5_fireflies'] = fixed
    # B6: selout by the measured light
    p = np.pad(body, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    ring = body & ~inner
    lx, ly = math.cos(math.radians(light_deg)), -math.sin(math.radians(light_deg))   # image coords: y down
    m = body.astype(float); gy, gx = np.gradient(m)   # points into the body; the outward normal is minus this
    lit = dark = 0
    ys, xs = np.nonzero(ring)
    for y, x in zip(ys, xs):
        nx, ny = -gx[y, x], -gy[y, x]; n = math.hypot(nx, ny)
        if n == 0: continue
        facing_light = (nx * lx + ny * ly) / n
        nb = [(y + dy, x + dx) for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)) if 0 <= y + dy < H and 0 <= x + dx < W and inner[y + dy, x + dx]]
        if facing_light > 0.25 and nb:
            a[y, x, :3] = np.mean([a[q][:3] for q in nb], 0); lit += 1
        elif facing_light < -0.25:
            a[y, x, :3] = np.clip(a[y, x, :3] - 10, 0, 255); dark += 1
    rep['B6_ring_lit'] = lit; rep['B6_ring_darker'] = dark; rep['B6_ring'] = int(ring.sum())
    # B7: staircase flags (a run on the silhouette's edge that grows then shrinks then grows again, per row step)
    edge_x = [np.nonzero(body[y])[0][0] for y in range(H) if body[y].any()]
    runs = [edge_x[i + 1] - edge_x[i] for i in range(len(edge_x) - 1)]
    flags = sum(1 for i in range(1, len(runs) - 1) if runs[i] != 0 and runs[i - 1] != 0 and runs[i + 1] != 0 and abs(runs[i]) < abs(runs[i - 1]) and abs(runs[i]) < abs(runs[i + 1]) and np.sign(runs[i]) == np.sign(runs[i - 1]) == np.sign(runs[i + 1]))
    rep['B7_staircase_flags_left_edge'] = int(flags)
    # B8: up to three highlight clusters on the main clay facing the light
    hl = 0
    if main in names:
        mi = names.index(main); mm = body & inner & (lab == mi)
        v = a[..., :3].mean(-1); top = hexrgb(PAL[role]['ramp'][-1])
        cand = sorted(((v[y, x], y, x) for y, x in zip(*np.nonzero(mm))), reverse=True)
        picked = []
        for vv, y, x in cand:
            if len(picked) == 3: break
            if all(math.hypot(y - py, x - px) >= 6 for py, px in picked): picked.append((y, x))
        for y, x in picked:
            for q in ((y, x), (y, x + 1)):
                if 0 <= q[1] < W and mm[q]: a[q][:3] = a[q][:3] + (top - a[q][:3]) * 0.5; hl += 1
    rep['B8_highlight_px'] = hl
    # B9: the eyes, one glint each, on the facings that show a face
    gl = 0
    if eye in names and facing in FACE_FACINGS:
        ei = names.index(eye); top_half = np.zeros_like(body); ys0 = np.nonzero(body.any(1))[0]
        top_half[ys0.min(): ys0.min() + (ys0.max() - ys0.min()) // 2] = True
        em = body & (lab == ei) & top_half
        from collections import deque
        seen = np.zeros_like(em); clusters = []
        for y, x in zip(*np.nonzero(em)):
            if seen[y, x]: continue
            q = deque([(y, x)]); seen[y, x] = True; c = []
            while q:
                cy, cx = q.popleft(); c.append((cy, cx))
                for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                    ny_, nx_ = cy + dy, cx + dx
                    if 0 <= ny_ < H and 0 <= nx_ < W and em[ny_, nx_] and not seen[ny_, nx_]: seen[ny_, nx_] = True; q.append((ny_, nx_))
            clusters.append(c)
        clusters = sorted((c for c in clusters if len(c) >= 6), key=len, reverse=True)[:2]
        glint = hexrgb(PAL['glass_eye']['glint'])
        for c in clusters:
            # a brow and a lens can share the eye material (the robot's do): the lens is the lower part of the cluster
            c0 = min(y for y, x in c); c1 = max(y for y, x in c); c = [t for t in c if t[0] >= c0 + 0.45 * (c1 - c0)] or c
            mv = np.median([val[t] for t in c]); c = [t for t in c if val[t] <= mv] or c   # the glass is the darker half; the brow's lit top is not
            cy = np.mean([y for y, x in c]); cx = np.mean([x for y, x in c])
            y, x = max(c, key=lambda t: (t[1] - cx) * lx + (t[0] - cy) * ly - 0.0)   # the pixel of the eye nearest the light
            # one pixel in from the cluster's edge so the glint sits on the glass, not on the rim
            y = int(round(y + (cy - y) * 0.4)); x = int(round(x + (cx - x) * 0.4))
            a[y, x, :3] = glint; gl += 1
    rep['B9_eye_glints'] = gl
    changed = (np.abs(a - before).sum(-1) > 0)
    rep['pixels_changed'] = int(changed.sum()); rep['body_pixels'] = int(body.sum()); rep['changed_share_pct'] = round(100 * changed.sum() / max(1, body.sum()), 2)
    out = os.path.join(os.path.dirname(png), os.path.basename(png).replace('rig_', 'fin_', 1)); Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA').save(out)
    return out, rep


if __name__ == '__main__':
    d = sys.argv[1]; arg = sys.argv[2:]
    opt = lambda k, dflt: arg[arg.index(k) + 1] if k in arg else dflt
    main, eye, role = opt('--main', 'Main'), opt('--eye', 'Black'), opt('--role', 'clay_mustard')
    rig = json.load(open(os.path.join(d, 'rig.json')))
    light = rig['calibration']['screen_light_deg']
    reps = []
    for f, idf in zip(rig['files'], rig['id_files']):
        facing = os.path.basename(f)[4:-4]
        o, r = finish(os.path.join(ROOT, f), os.path.join(ROOT, idf), rig['id_table'], light, main, eye, role, facing)
        r['file'] = os.path.relpath(o, ROOT); reps.append(r); print(json.dumps(r))
    tot = dict(pixels_changed=sum(r['pixels_changed'] for r in reps), body_pixels=sum(r['body_pixels'] for r in reps))
    tot['changed_share_pct'] = round(100 * tot['pixels_changed'] / max(1, tot['body_pixels']), 2)
    json.dump(dict(rig=os.path.relpath(os.path.join(d, 'rig.json'), ROOT), light_deg=light, main=main, eye=eye, role=role, steps_skipped={'B3': 'no quantise: the clay keeps its smooth light (guide field 7)', 'B4': 'no sliver bands without a stepped ramp'},
                   facings=reps, total=tot, tool='tools/bohemia_direction_hand_finish.py'), open(os.path.join(d, 'finish.json'), 'w'), indent=1)
    print('TOTAL', tot)
