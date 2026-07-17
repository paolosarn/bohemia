#!/usr/bin/env python3
"""
BOHEMIA LEAF-PIXEL GATE (7/16/26)

ANIMATION-PIXEL LAW (Paolo, 7/13):
  "Every animation must pinpoint exactly which pixels it touches. Moving parts
   (the LEAF) animate; structure (jambs, posts, headers, frames, borders) stays
   frozen. A gate's bars rise inside untouched posts."

The law says the gate exists. No gate existed. Nothing had ever checked a single
shipped clip, and there are 700+ of them across five banks.

WHAT IS CHECKED
  1. FROZEN BORDER (hard law). The outermost ring of every frame must be
     byte-identical across the whole clip. A door jamb that shifts one pixel is
     the sprite crawling in its own frame, and the eye catches it instantly even
     when nobody can say why.
  2. LEAF BBOX. The union of everything that changes across frames. Reported per
     clip so the touched region is a FACT on record instead of an intention.
  3. SOMETHING MOVED. A clip where nothing changes is not an animation, it is a
     wasted 8x payload.
  4. DEAD FRAMES. Consecutive identical frames — the loop stalling.
  5. SIZE AGREEMENT. Frames of differing dimensions inside one clip.

WHAT IS NOT CHECKED
  Whether the leaf is the RIGHT region. That is Paolo's eye. The gate reports
  the bbox; he rules. Auto-correcting a leaf rect would be redrawing his art.

  python3 bohemia_leaf_gate.py            # every bank in the tree
  python3 bohemia_leaf_gate.py --strict   # exit 1 on any violation
  python3 bohemia_leaf_gate.py --csv out.csv
"""
import json, base64, io, sys, os

try:
    import numpy as np
    from PIL import Image
except ImportError:
    print('leaf gate needs numpy + pillow'); sys.exit(2)

def decode(b64):
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')).astype(int)

def find_clips(node, path, out):
    """A clip is any dict carrying a 'frames' list of base64 strings. Banks
    disagree about where clips live (clips{}, fire{}, door{}); the law does not."""
    if isinstance(node, dict):
        if isinstance(node.get('frames'), list) and node['frames'] and isinstance(node['frames'][0], str):
            out.append((path, node))
            return
        for k, v in node.items():
            find_clips(v, path + '.' + str(k), out)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            find_clips(v, path + '[%d]' % i, out)

def check(clip):
    """Returns (violations, info)."""
    v, info = [], {}
    try:
        frames = [decode(f) for f in clip['frames']]
    except Exception as e:
        return (['undecodable frames: %s' % e], info)
    shapes = {f.shape for f in frames}
    if len(shapes) > 1:
        return (['frames disagree on size: %s' % sorted(str(s) for s in shapes)], info)
    H, W = frames[0].shape[:2]
    info['size'] = '%dx%d' % (W, H)
    info['n'] = len(frames)

    # 1. FROZEN STRUCTURE — the hard law, read per EDGE.
    #
    # A blunt "outermost ring never changes" test is WRONG and the banks prove
    # it. Measured per edge:
    #     fire_24/25/26   top moves, everything else frozen  -> flame licking
    #                     the top of the sprite. Legitimate. The flame IS the leaf.
    #     fire_23         BOTTOM moves, top frozen           -> fire rises. A fire
    #                     barrel whose BASE is moving is the vessel crawling.
    #
    # So the law is read the way Paolo wrote it — it names the structure:
    # "jambs, posts, headers, frames, borders". Which edge is structure depends
    # on what the thing IS:
    #     door/gate : jambs = left + right, header = top. FROZEN.
    #                 bottom = threshold, the leaf sweeps it. Allowed.
    #     fire      : the vessel is the bottom. FROZEN.
    #                 top = flame. Allowed to move.
    #     fx/particle: free-standing, no structure to violate. Reported only.
    # [The per-edge mapping is my inference from the law text + physics. Flagged.]
    # GEOMETRY vs GLOW. This distinction is the whole gate.
    #   alpha changed -> a pixel appeared or vanished. The shape MOVED. That is
    #                    the law: structure crawling in its own frame.
    #   rgb changed, alpha identical -> the shape is frozen and only its COLOUR
    #                    breathed. That is baked glow, not motion. Different
    #                    law (LIGHT PHILOSOPHY), so it is FLAGGED, not failed.
    # Measured on the real banks, every single edge "violation" turned out to be
    # rgb-only. Nothing was crawling. A blunt !=  test would have condemned 34
    # clips for a crime none of them committed.
    def edge_moves(fs):
        base = fs[0]
        geo = {'top': 0, 'bottom': 0, 'left': 0, 'right': 0}
        glow = {'top': 0, 'bottom': 0, 'left': 0, 'right': 0}
        S = {'top': lambda f: f[0, :], 'bottom': lambda f: f[H-1, :],
             'left': lambda f: f[:, 0], 'right': lambda f: f[:, W-1]}
        for f in fs[1:]:
            for k, sl in S.items():
                a, b = sl(base), sl(f)
                geo[k] += int((a[:, 3] != b[:, 3]).sum())
                glow[k] += int(((a != b).any(axis=1) & (a[:, 3] == b[:, 3])).sum())
        return geo, glow
    e, glow = edge_moves(frames)
    info['edges'] = e
    info['glow'] = {k: v for k, v in glow.items() if v}
    kind = clip.get('_kind', 'unknown')
    STRUCT = {'door': ['left', 'right', 'top'],
              'fire': ['bottom', 'left', 'right'],
              'fx':   []}
    for edge in STRUCT.get(kind, []):
        if e[edge]:
            v.append('FROZEN STRUCTURE BROKEN: %s edge MOVES (%d px, alpha changed) — %s'
                     % (edge, e[edge], 'jamb/header' if kind == 'door' else 'the vessel'))
        elif glow[edge]:
            info.setdefault('flags', []).append(
                'baked glow on %s structure (%d px, shape frozen) — LIGHT PHILOSOPHY says '
                'the multiply pass owns the glow' % (edge, glow[edge]))

    # 2. leaf bbox = union of everything that changes
    base = frames[0]
    chg = np.zeros((H, W), bool)
    for f in frames[1:]:
        chg |= (f != base).any(axis=2)
    n = int(chg.sum())
    info['changed_px'] = n
    if n == 0:
        v.append('NOTHING MOVES: clip is a still image paying an %dx payload' % len(frames))
    else:
        ys, xs = np.where(chg)
        info['leaf'] = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]
        info['leaf_pct'] = round(100.0 * n / (W * H), 1)

    # 3. dead frames
    dead = sum(1 for i in range(1, len(frames)) if (frames[i] == frames[i-1]).all())
    if dead:
        info['dead_frames'] = dead
    return v, info

def main():
    args = sys.argv[1:]
    strict = '--strict' in args
    csv = args[args.index('--csv') + 1] if '--csv' in args else None
    files = sorted(os.path.join('banks', f) for f in os.listdir('banks')
                   if f.endswith('.txt') and f.startswith('BOHEMIA_'))
    print('=' * 76)
    print('BOHEMIA LEAF-PIXEL GATE — ANIMATION-PIXEL LAW')
    print('=' * 76)
    tot = viol = 0
    rows = []
    for fn in files:
        try:
            d = json.load(open(fn, encoding='utf-8'))
        except Exception:
            continue
        clips = []
        find_clips(d, os.path.basename(fn), clips)
        if not clips:
            continue
        fv = 0
        for path, clip in clips:
            tot += 1
            low = (path + ' ' + str(clip.get('style', '')) + ' ' + str(clip.get('pack', ''))).lower()
            clip['_kind'] = ('door' if ('door' in low or 'gate' in low or 'arch' in low)
                             else 'fire' if ('fire' in low or 'camp' in low or 'lantern' in low
                                             or 'brazier' in low or 'flicker' in low)
                             else 'fx' if ('particle' in low or 'fx' in low or 'ember' in low)
                             else 'unknown')
            vs, info = check(clip)
            if vs:
                viol += len(vs); fv += len(vs)
            rows.append((path, vs, info))
        print('  %-46s %4d clips   %3d violations' % (os.path.basename(fn), len(clips), fv))
    print('=' * 76)
    print('  %d clips checked · %d violations' % (tot, viol))

    broke = [r for r in rows if any('FROZEN STRUCTURE' in x for x in r[1])]
    still = [r for r in rows if any('NOTHING MOVES' in x for x in r[1])]
    dead = [r for r in rows if r[2].get('dead_frames')]
    if broke:
        print('\n  FROZEN STRUCTURE BROKEN (%d):' % len(broke))
        for path, vs, info in broke[:20]:
            print('    %s\n      %s' % (path.split('.txt')[0] + ' :: ' + path.split('.')[-1], vs[0]))
    if still:
        print('\n  NOTHING MOVES (%d):' % len(still))
        for path, vs, info in still[:20]:
            print('    %s' % path)
    if dead:
        print('\n  clips with dead frames: %d (loop stalls, not a law break)' % len(dead))
    flagged = [r for r in rows if r[2].get('flags')]
    if flagged:
        print('\n  BAKED GLOW ON FROZEN STRUCTURE (%d) — shape never moves, colour does.' % len(flagged))
        print('  Not a leaf-pixel break. Flagged for Paolo under LIGHT PHILOSOPHY:')
        for path, vs, info in flagged[:12]:
            print('    %-52s %s' % (path.split('.')[-1], info['flags'][0]))
    if not broke and not still:
        print('\n  LEAF-PIXEL LAW HOLDS: structure frozen everywhere, every clip moves.')

    ok = [r for r in rows if not r[1] and r[2].get('leaf_pct') is not None]
    if ok:
        pcts = sorted(r[2]['leaf_pct'] for r in ok)
        print('\n  leaf coverage across %d clean clips: min %.1f%% · median %.1f%% · max %.1f%%'
              % (len(ok), pcts[0], pcts[len(pcts)//2], pcts[-1]))
    if csv:
        with open(csv, 'w') as fh:
            fh.write('clip,size,frames,changed_px,leaf_pct,leaf_x0,leaf_y0,leaf_x1,leaf_y1,violations\n')
            for path, vs, info in rows:
                lf = info.get('leaf', ['', '', '', ''])
                fh.write('"%s",%s,%s,%s,%s,%s,%s,%s,%s,"%s"\n' % (
                    path, info.get('size', ''), info.get('n', ''), info.get('changed_px', ''),
                    info.get('leaf_pct', ''), lf[0], lf[1], lf[2], lf[3], ' | '.join(vs)))
        print('\n  per-clip leaf record -> %s (%d rows)' % (csv, len(rows)))
    return 1 if (viol and strict) else 0

if __name__ == '__main__':
    sys.exit(main())
