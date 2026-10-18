#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the rig round six]: THE CLIPS AND THE FIRST RUNWAY BODY (rule 115c, 115g; research round two
Section D, checks 9 and 10, tells R11 and R12; his YES on rig round five, 'the robot finished by hand').

Reads what tools/bohemia_direction_master_rig.py round seven rendered into records/target/direction_rig_round_six/
(the robot: eight stills, Idle 12 and Walking 6 in eight facings, the object-ID pass on every frame, the motion
table and the movers' light; the Mob, CHARACTER's model rebuilt byte for byte, eight stills and its walk) and writes:
  1. THE HOLD CHECK (research D9, R12, 'pixel creep'): for every key against the key before (the clip loops), every
     pixel whose colour or alpha changed is counted; the MOVING MASK is the pixels of every part whose furthest vertex
     moved half a pixel or more on the screen (the rig's motion table, from the model's own vertices), in either frame,
     grown by one pixel, plus the movers' light (the rig's riglight_ pass: their cast shadow and bounce on the parts
     that hold); what changed OUTSIDE it is boil. The idle is the declared hold: under 3 percent of the opaque
     pixels. A second count only takes changes of more than 3 values (what an eye can see), so the record can say how
     much of the boil is the renderer's own noise.
  2. DROPOUTS (research R11): a part's pixel count per key from the object-ID pass; zero in a key and not zero in the
     keys either side is a dropout; zero allowed. The thinnest part's smallest count is printed.
  3. THE HOLE (round five's R2 note on the robot NW): every transparent region the body closes round, per facing, with
     the parts (object-ID) and the materials (material-ID) that touch it.
  4. THE TEN CHECKS (PLUMBER's tools/bohemia_not_vibe_coded.py, read through the gate's held_verdict, with his three
     new readings: D6 on the 8x8 box, D7 on the 1st to 99th percentile, D8 against the packs' band) on every S still,
     and D8's own numbers beside the prop packs' band.
  5. THE PLAYER (slices/vote/DIRECTION_THE_RIG_ROUND_SIX.webp + _TABLE.js, played by DIRECTION_THE_RIG_ROUND_SIX.html):
     the robot's idle and walk in eight facings and the Mob's walk in eight, on the 120 beat, three keys a beat,
     each frame laid on its own shadow layer, one art pixel to one phone pixel.
  6. THE SHEET (DIRECTION_THE_RIG_ROUND_SIX.png): the idle's twelve keys and the walk's six at S and SE, the hold map of
     the worst pair (red = changed outside the mask), the robot beside the Mob in eight at 1:1 on his ground and
     at 2x, the report's rows under it in the project's font.

    <venv>/bin/python tools/bohemia_direction_rig_round_six.py        (numpy, pillow, scipy)
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools')); sys.path.insert(0, os.path.join(ROOT, 'gates'))
import bohemia_not_vibe_coded as N  # noqa: E402

D = os.path.join(ROOT, 'records/target/direction_rig_round_six')
VOTE = os.path.join(ROOT, 'slices/vote')
F = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
T = json.load(open(os.path.join(ROOT, 'gates/not_vibe_coded_thresholds.json')))
BANDS = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_NOT_VIBE_CODED_BANDS.json')))
G = N.guide()
FONT = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, DIM, RED, GREEN = (24, 23, 22, 255), (226, 214, 190, 255), (150, 140, 124, 255), (214, 74, 60, 255), (126, 178, 120, 255)
BOARD = os.path.join(ROOT, 'reference/art_bank/fight_board/COMBAT2_BOARD_SMALL_10_16.webp')
HOLD_MAX, VISIBLE = 3.0, 3   # research D9: under 3 percent of the opaque pixels; 'visible' = more than 3 values on a channel


def rgba(p): return np.asarray(Image.open(p).convert('RGBA')).astype(np.int16)


def labels(subj, name, rig):
    """the object-ID picture as part names; a colour-opaque pixel the one-sample pass left empty takes its nearest part"""
    a = rgba(os.path.join(D, subj, name)); tab = rig['obj_table']
    names = sorted(tab); cols = np.array([[int(tab[n][i:i + 2], 16) for i in (1, 3, 5)] for n in names])
    enc = lambda c: np.where(c <= 0.0031308, 12.92 * c, 1.055 * np.power(c, 1 / 2.4) - 0.055)
    op = a[..., 3] > 127; lab = np.full(op.shape, -1, int); px = a[..., :3][op]
    best = None
    for pal in (cols, np.round(enc(cols / 255.0) * 255)):   # a table written before the rig's sRGB fix holds the linear value
        d = ((px[:, None, :] - pal[None]) ** 2).sum(2); e = float(d.min(1).mean())
        if best is None or e < best[0]: best = (e, d.argmin(1))
    lab[op] = best[1]
    return lab, names


def fill(lab, body):
    """every body pixel gets a part: the empty ones take the nearest labelled pixel"""
    if (lab[body] >= 0).all(): return lab
    idx = ndimage.distance_transform_edt(lab < 0, return_distances=False, return_indices=True)
    out = lab[tuple(idx)]; return np.where(body, out, -1)


def hold(subj, clip, rig):
    c = rig['clips'][clip]; keys = c['keys']; mot = c['motion_px']; thr = c.get('moving_px', 0.5)
    per, worst = [], None
    for f in F:
        frames = [rgba(os.path.join(D, subj, 'rig_%s_%s_k%02d.png' % (clip, f, j))) for j in range(keys)]
        labs = []
        for j in range(keys):
            l, names = labels(subj, 'rigobj_%s_%s_k%02d.png' % (clip, f, j), rig); labs.append(fill(l, frames[j][..., 3] > 127))
        counts = [{n: int((l == i).sum()) for i, n in enumerate(names)} for l in labs]
        drops, hidden = [], []
        for j in range(keys):
            movers = [names.index(n) for n, v in mot[f][j].items() if v >= thr]
            for n in names:
                if counts[j][n] == 0 and counts[j - 1][n] > 0 and counts[(j + 1) % keys][n] > 0:
                    was = labs[j - 1] == names.index(n)   # R11 is a thin part lost to sampling; a part a moving part now covers is hidden, not dropped
                    (hidden if np.isin(labs[j][was], movers).mean() > 0.5 else drops).append((n, j))
        for j in range(keys):
            A, B = frames[j], frames[j - 1]; body = (A[..., 3] > 127) | (B[..., 3] > 127)
            moving = [names.index(n) for n, v in mot[f][j].items() if v >= thr]
            mask = np.isin(labs[j], moving) | np.isin(labs[j - 1], moving)
            lp = os.path.join(D, subj, 'riglight_%s_%s_k%02d.png' % (clip, f, j))   # the movers' light (their shadow, their bounce): motion, not boil
            light = (np.asarray(Image.open(lp)) > 127) if os.path.exists(lp) else np.zeros_like(mask)
            mask = ndimage.binary_dilation(mask, np.ones((3, 3), bool)) | light
            diff = np.abs(A - B); changed = diff.max(2) > 0; seen = diff[..., :3].max(2) > VISIBLE
            alpha = (A[..., 3] > 127) != (B[..., 3] > 127)
            out = changed & ~mask & body; out_seen = (seen | alpha) & ~mask & body
            n = int(body.sum())
            row = dict(facing=f, key=j, moving=[names[i] for i in moving], opaque=n, changed_pct=round(100.0 * (changed & body).sum() / n, 2),
                       outside_pct=round(100.0 * out.sum() / n, 2), outside_seen_pct=round(100.0 * out_seen.sum() / n, 2),
                       outside_alpha_px=int((alpha & ~mask).sum()), mask_pct=round(100.0 * (mask & body).sum() / n, 1), light_pct=round(100.0 * (light & body).sum() / n, 1),
                       repeat=j in set(c.get('repeated_keys', {}).get(f, [])))
            per.append(row)
            if worst is None or row['outside_pct'] > worst[0]['outside_pct']: worst = (row, A, B, mask, out, out_seen)
        per.append(dict(facing=f, dropouts=drops, hidden=hidden, thinnest=min(((n, min(cn[n] for cn in counts)) for n in names if any(cn[n] for cn in counts)), key=lambda x: x[1])))
    rows = [r for r in per if 'key' in r]
    return dict(clip=clip, keys=keys, declared_hold=(clip == 'Idle'), max_outside_pct=max(r['outside_pct'] for r in rows),
                mean_outside_pct=round(float(np.mean([r['outside_pct'] for r in rows])), 2), max_outside_seen_pct=max(r['outside_seen_pct'] for r in rows),
                mean_changed_pct=round(float(np.mean([r['changed_pct'] for r in rows])), 1),
                dropouts=[x for r in per if 'dropouts' in r for x in r['dropouts']], hidden_by_a_mover=[(r['facing'],) + tuple(x) for r in per if 'hidden' in r for x in r['hidden']], thinnest=[(r['facing'],) + tuple(r['thinnest']) for r in per if 'thinnest' in r],
                ok=max(r['outside_pct'] for r in rows) < HOLD_MAX, rows=rows), worst


def holes(subj, rig):
    """every transparent region the body closes round, and what touches it"""
    found = []
    mat = rig.get('id_table') or {}
    def enc(c): return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
    mnames = sorted(mat); mcols = np.array([[int(round(enc(int(mat[n][i:i + 2], 16) / 255.0) * 255)) for i in (1, 3, 5)] for n in mnames]) if mat else None
    for f in F:
        a = rgba(os.path.join(D, subj, 'rig_%s.png' % f)); op = a[..., 3] > 127
        lab, n = ndimage.label(~op)
        edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
        ol, onames = labels(subj, 'rigobj_%s.png' % f, rig); ol = fill(ol, op)
        mi = rgba(os.path.join(D, subj, 'rigid_%s.png' % f)) if mat else None
        for i in range(1, n + 1):
            if i in edge: continue
            hole = lab == i; ring = ndimage.binary_dilation(hole, np.ones((3, 3), bool)) & op
            parts = sorted(set(onames[x] for x in ol[ring] if x >= 0))
            mats = []
            if mi is not None:
                px = mi[..., :3][ring & (mi[..., 3] > 127)]
                if len(px): mats = sorted(set(mnames[k] for k in ((px[:, None, :] - mcols[None]) ** 2).sum(2).argmin(1)))
            ys, xs = np.nonzero(hole)
            found.append(dict(facing=f, px=int(hole.sum()), at=[int(xs.min()), int(ys.min())], parts=parts, materials=mats))
    return found


def ten(subj, cls, pre='rig'):
    from not_vibe_coded_gate import held_verdict
    p = os.path.join(D, subj, '%s_S.png' % pre)
    rep = N.sprite_report(p, 'character', 'upper-left', None, T)
    hv = held_verdict(rep, 'prop' if cls != 'person' else 'all', BANDS, cls, p, G)
    out = {d: [hv[d][0], hv[d][1]] for d in ('D1', 'D2', 'D3', 'D4', 'D5')}
    for d in ('D6', 'D7'): out[d] = [rep[d]['ok'], rep[d]['why']]
    bv = N.band_verdict(rep, 'prop', BANDS)['D8']; out['D8'] = [bv['ok'], bv['why'] or 'inside the prop packs\' band']
    rgb, a = N.load(p); m = N.d9_mirror(rgb, a, T); out['D9'] = [m['ok'], m['why']]
    out['D10'] = [None, 'the UI leg; a sprite carries no CSS']
    paths = [os.path.join(D, subj, '%s_%s.png' % (pre, f)) for f in F]
    r2 = [N.r2_alpha(*N.load(q), T) for q in paths]
    rig = json.load(open(os.path.join(D, subj, 'rig.json')))
    return dict(subject=subj, cls=cls, held=out, d8_numbers=N.numbers(rep).get('D8'), d8_band=BANDS['families']['prop']['band'].get('D8'),
                R2=[all(x['ok'] for x in r2), '; '.join(sorted(set(x['why'] for x in r2 if x['why']))) or 'ok'],
                card=rig['card_guide']['verdict'], card_out=[r for r in rig['card_guide']['rows'] if r.startswith('OUT')])


def body(subj, name):
    a = Image.open(os.path.join(D, subj, 'rig_%s.png' % name)).convert('RGBA')
    sp = os.path.join(D, subj, 'shadow_%s.png' % name)
    out = Image.new('RGBA', a.size, (0, 0, 0, 0))
    if os.path.exists(sp): out.alpha_composite(Image.open(sp).convert('RGBA'))
    out.alpha_composite(a); return out


def player(subjects):
    """the atlas the VOTE page plays: one row per (subject, facing), the clips side by side, every cell one size, the
    ground on one row; lossless webp so not one pixel moves"""
    cells = []
    for subj, clip, keys, beats in subjects:
        for f in F: cells.append((subj, clip, keys, beats, f))
    ims = {(s, c, f, j): body(s, '%s_%s_k%02d' % (c, f, j)) for s, c, k, b, f in cells for j in range(k)}
    gy = {}
    for s, c, k, b, f in cells:
        rig = json.load(open(os.path.join(D, s, 'rig.json'))); gy[s] = rig['ground_px'][1]
    CW = max(i.width for i in ims.values()) + 4; up = max(gy.values()); down = max(i.height - gy[k[0]] for k, i in ims.items())
    CH = up + down + 4
    cols = {}; x = 0
    for s, c, k, b in subjects:
        if (s, c) not in cols: cols[(s, c)] = x; x += k
    rows = {}
    for s, c, k, b, f in cells: rows.setdefault((s, f), len(rows))
    atlas = Image.new('RGBA', (x * CW, len(rows) * CH), (0, 0, 0, 0))
    for (s, c, f, j), im in ims.items():
        ox = (cols[(s, c)] + j) * CW + (CW - im.width) // 2; oy = rows[(s, f)] * CH + 2 + up - gy[s]
        atlas.alpha_composite(im, (ox, oy))
    wp = os.path.join(VOTE, 'DIRECTION_THE_RIG_ROUND_SIX.webp'); atlas.save(wp, lossless=True, quality=100)
    table = dict(cell=[CW, CH], ground_y=up + 2, clips=[dict(subject=s, clip=c, col=cols[(s, c)], keys=k, beats=b) for s, c, k, b in subjects],
                 rows={'%s %s' % k: v for k, v in rows.items()}, facings=F, bpm=120, keys_per_beat=3)
    open(os.path.join(VOTE, 'DIRECTION_THE_RIG_ROUND_SIX_TABLE.js'), 'w').write('window.RIG6_TABLE = ' + json.dumps(table) + ';\n')
    return wp, table


def font(n): return ImageFont.truetype(FONT, n)


def sheet(rep, worst):
    board = Image.open(BOARD).convert('RGBA')
    rows = [('THE ROBOT\'S IDLE, TWELVE KEYS (four beats), S', [body('robot', 'Idle_S_k%02d' % j) for j in range(12)]),
            ('THE ROBOT\'S IDLE, TWELVE KEYS, SE', [body('robot', 'Idle_SE_k%02d' % j) for j in range(12)]),
            ('THE ROBOT\'S WALK, SIX KEYS (two beats), S AND SE', [body('robot', 'Walking_S_k%02d' % j) for j in range(6)] + [body('robot', 'Walking_SE_k%02d' % j) for j in range(6)]),
            ('THE ROBOT IN EIGHT (the still, the recipe he said YES to)', [body('robot', f) for f in F]),
            ('THE FIRST RUNWAY BODY: THE MOB (CHARACTER\'s model: charcoal shoulder mantle, pinstripe, cropped trousers, stacked soles) IN EIGHT', [body('mob', f) for f in F]),
            ('BESIDE EACH OTHER AT 1:1, S AND SE', [body('robot', 'S'), body('mob', 'S'), body('robot', 'SE'), body('mob', 'SE')])]
    W = 2400; pad = 16; y = 60
    heights = [max(i.height for i in ims) for _, ims in rows]
    H = 60 + sum(h * 5 + 120 for h in heights) + 700 + 22 * 40
    out = Image.new('RGBA', (W, H), BG); dr = ImageDraw.Draw(out)
    dr.text((pad, 14), 'THE RIG, ROUND SIX: THE CLIPS AND THE FIRST RUNWAY BODY. 57 PX A METRE, ONE SUN FROM THE UPPER LEFT (155.4 DEG ON SCREEN), PALETTE records/target/BOHEMIA_STYLE_PALETTE.json. 1:1 ON HIS GROUND, THEN 2X', font=font(16), fill=INK)
    for (title, ims), h in zip(rows, heights):
        dr.text((pad, y), title, font=font(15), fill=INK); y += 24
        gw = min(W - 2 * pad, sum(i.width + 6 for i in ims) + 6)
        out.paste(board.crop((1640, 1860, 1640 + gw, 1860 + h + 8)), (pad, y))
        xx = pad + 6
        for i in ims: out.alpha_composite(i, (xx, y + 4 + h - i.height)); xx += i.width + 6
        y += h + 20; x2 = pad
        for i in ims:
            big = i.resize((i.width * 2, i.height * 2), Image.NEAREST); tile = Image.new('RGBA', big.size, (78, 72, 64, 255)); tile.alpha_composite(big)
            if x2 + big.width > W - pad: x2 = pad; y += h * 2 + 8
            out.paste(tile, (x2, y + (h * 2 - big.height))); x2 += big.width + 8
        y += h * 2 + 40
    # the hold map of the worst pair: the frame, grey = the moving mask, red = changed outside it, amber = visible change outside
    row, A, B, mask, o, os_ = worst
    dr.text((pad, y), 'THE HOLD MAP, THE WORST IDLE PAIR (%s, key %d against %d): grey = the parts that moved, red = any change outside them, amber = a change over 3 values outside them; %.2f%% outside (bar 3%%)' % (row['facing'], row['key'], (row['key'] - 1) % 12, row['outside_pct']), font=font(15), fill=INK); y += 26
    base = Image.fromarray(np.clip(A, 0, 255).astype(np.uint8), 'RGBA'); vis = np.zeros(A.shape, np.uint8)
    vis[mask & (A[..., 3] > 127)] = (120, 120, 120, 150); vis[o] = (214, 74, 60, 255); vis[os_] = (232, 170, 40, 255)
    m = Image.new('RGBA', base.size, (40, 38, 34, 255)); m.alpha_composite(base); m.alpha_composite(Image.fromarray(vis, 'RGBA'))
    big = m.resize((m.width * 4, m.height * 4), Image.NEAREST); out.paste(big, (pad, y)); y += big.height + 30
    mark = {True: 'ok', False: 'NO', None: '--'}
    for h in rep['holds']:
        line = '%-10s %-8s hold %s  changed outside the moving parts: worst %.2f%%, mean %.2f%%, visible (over %d values) worst %.2f%%;  dropouts %d' % (
            h['subject'], h['clip'], ('DECLARED' if h['declared_hold'] else 'not a hold, read only'), h['max_outside_pct'], h['mean_outside_pct'], VISIBLE, h['max_outside_seen_pct'], len(h['dropouts']))
        dr.text((pad, y), line, font=font(14), fill=(GREEN if (h['ok'] or not h['declared_hold']) and not h['dropouts'] else RED)); y += 22
    for r in rep['ten']:
        hv = r['held']
        line = '%-10s ' % r['subject'] + ' '.join('%s %s' % (d, mark[hv[d][0]]) for d in ('D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10')) + '  R2 %s   %s' % (mark[r['R2'][0]], r['card'])
        bad = [d for d in ('D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9') if hv[d][0] is False] + (['R2'] if not r['R2'][0] else [])
        dr.text((pad, y), line, font=font(14), fill=RED if bad else GREEN); y += 22
        for d in bad[:3]:
            why = hv[d][1] if d in hv else r['R2'][1]
            dr.text((pad + 30, y), '%s: %s' % (d, str(why)[:150]), font=font(13), fill=DIM); y += 20
    for hl in rep['holes']['robot']:
        dr.text((pad, y), 'robot hole %s: %d px at %s, between %s (materials %s)' % (hl['facing'], hl['px'], hl['at'], ', '.join(hl['parts']), ', '.join(hl['materials'])), font=font(13), fill=DIM); y += 20
    out = out.crop((0, 0, W, y + 20))
    p = os.path.join(D, 'DIRECTION_THE_RIG_ROUND_SIX.png'); out.convert('RGB').save(p, optimize=True); return p


def main():
    robot = json.load(open(os.path.join(D, 'robot', 'rig.json')))
    holds, worst = [], None
    for clip in ('Idle', 'Walking'):
        h, w = hold('robot', clip, robot); h['subject'] = 'robot'; holds.append(h)
        if clip == 'Idle': worst = w
    ana = os.path.join(D, 'mob', 'rig.json')   # the first runway body (the Anarchists' coat reads purple: routed to CHARACTER)
    subjects = [('robot', 'Idle', 12, 4), ('robot', 'Walking', 6, 2)]
    tens = [ten('robot', 'person')]
    hls = dict(robot=holes('robot', robot))
    if os.path.exists(ana):
        arig = json.load(open(ana))
        h, _ = hold('mob', 'Anim_0', arig); h['subject'] = 'mob'; holds.append(h)
        subjects.append(('mob', 'Anim_0', 6, 2)); tens.append(ten('mob', 'person')); hls['mob'] = holes('mob', arig)
    rep = dict(round=6, made='10/18', tool='tools/bohemia_direction_rig_round_six.py', rig='tools/bohemia_direction_master_rig.py round 7',
               checks='tools/bohemia_not_vibe_coded.py (PLUMBER) through gates/not_vibe_coded_gate.py held_verdict; D8 against the prop packs\' band',
               hold_bar_pct=HOLD_MAX, visible_values=VISIBLE, holds=holds, ten=tens, holes=hls)
    wp, table = player(subjects)
    rep['player'] = dict(atlas=os.path.relpath(wp, ROOT), cell=table['cell'])
    json.dump(rep, open(os.path.join(D, 'report.json'), 'w'), indent=1, default=lambda o: o.item() if hasattr(o, 'item') else str(o))
    if 'mob' in hls: print(sheet(rep, worst))
    for h in holds:
        print('%-10s %-8s outside worst %.2f mean %.2f seen %.2f changed %.1f dropouts %s thinnest %s ok %s' % (h['subject'], h['clip'], h['max_outside_pct'], h['mean_outside_pct'], h['max_outside_seen_pct'], h['mean_changed_pct'], h['dropouts'][:4], min(h['thinnest'], key=lambda x: x[2]), h['ok']))
    for r in tens:
        print(r['subject'], ' '.join('%s:%s' % (d, r['held'][d][0]) for d in r['held']), 'R2', r['R2'][0], '|', r['card'], '| D8', r['d8_numbers'], 'band', r['d8_band'])
    for s, hl in hls.items():
        for x in hl: print('hole', s, x)


if __name__ == '__main__':
    main()
