#!/usr/bin/env python3
"""
BOHEMIA TASTE FILTER (7/25/26) — the pre-judge KILL pass.

laws/BOHEMIA_PAOLO_TASTE_CANON.md distilled Paolo's recorded taste into NEVERs.
This is the machine that enforces the MACHINE-CHECKABLE ones as a PRE-FILTER any
factory runs before a batch reaches Paolo's thumbs.

THE LINE THAT NEVER MOVES: this KILLS, it never APPROVES. A candidate that passes
the filter is "not obviously wrong," never "approved." Only Paolo's real thumbs
approve. The filter only ever narrows what he has to look at.

REUSE CHECK: reuses the existing law machinery instead of re-deriving it —
opens gates/bohemia_purity_allow.txt (the purple allowlist) and
gates/bohemia_graveyard.txt (the dead-token registry) directly, and DEFERS the
pixel-perfect enforcement of the 45-degree view, structure-not-color, and
walkable-land laws to their standing gates (gates/art_45_gate.py,
gates/structure_gate.js, gates/walkable_gate.js) — this filter runs fast,
conservative proxies of those so an obvious violator dies early, but the
standing gate remains the real enforcer.

TASTE CHECK: this file IS the taste check. It enforces the machine-checkable
NEVERs from BOHEMIA_PAOLO_TASTE_CANON.md section "MACHINE-CHECKABLE NEVERS":
flat side-on (45), purple outside the Amalgamation allowlist, hard black outline,
tan-ratio, recolor-posing-as-new-shape, pavement-dominant layout, em dash /
cache-buster / .json export in copy, and any live graveyard-token reuse.

USAGE:
  python3 tools/bohemia_taste_filter.py <manifest.json> [--report PATH]
  python3 tools/bohemia_taste_filter.py --selftest      # fixtures, exit 1 on failure

MANIFEST: {"batch":"name","candidates":[
  {"id","kind":"image|text|layout","path":..,"text":..,"tags":[..],"meta":{..}} ]}
"""
import json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

try:
    import numpy as np
    from PIL import Image
    _HAVE_PIL = True
except Exception:
    _HAVE_PIL = False


# ---------- law data (reused from the standing machinery) ----------
def load_purity_allow():
    allow = set()
    p = 'gates/bohemia_purity_allow.txt'
    if os.path.exists(p):
        for line in open(p, encoding='utf8'):
            line = line.strip()
            if line and not line.startswith('#'):
                allow.add(line.lower())
    return allow


def load_graveyard_tokens():
    toks = []
    p = 'gates/bohemia_graveyard.txt'
    if os.path.exists(p):
        for line in open(p, encoding='utf8'):
            line = line.rstrip('\n')
            if not line.strip() or line.lstrip().startswith('#'):
                continue
            tok = line.split('|', 1)[0].strip()
            if tok:
                toks.append(tok)
    return toks


PURITY_ALLOW = load_purity_allow()
GRAVE_TOKENS = load_graveyard_tokens()
EMDASH = re.compile('[—–]')  # — –


# ---------- image checks (conservative proxies; PIL required) ----------
def _load_rgb_and_mask(src):
    """src is a filesystem path, or a ('b64', data) pair — the repo's banks store
    candidate images as inline base64, so the filter must read that format too."""
    if isinstance(src, tuple) and src[0] == 'b64':
        import base64, io
        im = Image.open(io.BytesIO(base64.b64decode(src[1]))).convert('RGBA')
    else:
        im = Image.open(src).convert('RGBA')
    arr = np.asarray(im)
    rgb = arr[:, :, :3].astype(np.int32)
    alpha = arr[:, :, 3]
    # opaque = real pixel; if the sprite is on a solid bg with full alpha, treat
    # near-uniform corner color as background too.
    mask = alpha > 16
    if mask.all():
        corner = rgb[0, 0]
        bg = np.all(np.abs(rgb - corner) < 12, axis=2)
        cand_mask = ~bg
        # a full-bleed tile (a wall/ground fill) is all one field: subtracting it
        # leaves nothing. Only trust bg-subtraction when it leaves real foreground.
        mask = cand_mask if cand_mask.mean() >= 0.05 else np.ones(mask.shape, bool)
    return rgb, mask, alpha


def check_purple(rgb, mask, tags, meta):
    """Purple reservation: purple pixels outside the Amalgamation allowlist."""
    if _tag_allowed_purple(tags, meta):
        return True, None
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    purple = (r > g + 25) & (b > g + 25) & mask
    n = int(purple.sum())
    if n > 0:
        return False, 'purple outside the Amalgamation allowlist: %d purple px (PURPLE RESERVATION)' % n
    return True, None


def _tag_allowed_purple(tags, meta):
    if meta.get('amalgamation') is True:
        return True
    for t in tags:
        if t.lower() in PURITY_ALLOW:
            return True
    return False


def check_black_outline(rgb, mask, alpha=None):
    """Pocket-city: no hard continuous near-black keyline ring on the silhouette.

    CRITICAL (learned by running this on the APPROVED hero bank, which it falsely
    killed): an anti-aliased sprite's edge pixels are SEMI-TRANSPARENT and their
    RGB blends toward transparent black, so a naive near-black-edge test flags
    normal AA as a keyline. A real hand-drawn keyline is SOLID. So the silhouette
    and the near-black test are both computed on SOLIDLY OPAQUE pixels only."""
    if alpha is not None:
        solid = alpha >= 200
        if solid.sum() < 64:            # mostly-AA or tiny art: nothing to judge
            return True, None
    else:
        solid = mask
    m = solid
    edge = m & ~(
        _shift(m, 1, 0) & _shift(m, -1, 0) & _shift(m, 0, 1) & _shift(m, 0, -1)
    )
    edge_n = int(edge.sum())
    if edge_n < 24:
        return True, None
    mx = rgb.max(axis=2)
    near_black = (mx < 40) & edge
    frac = near_black.sum() / edge_n
    if frac > 0.6:
        return False, 'hard black outline ring: %.0f%% of the solid silhouette edge is near-black (POCKET-CITY: edges read from value steps, never a keyline)' % (frac * 100)
    return True, None


def check_flat_side_on(rgb, mask):
    """45-degree law proxy: a 3/4 box shows a sky-lit top band brighter than the
    wall below. Flat side-on has no brighter top. Conservative: only fires when
    the top is clearly DARKER than the mid AND the shape fills its bbox like a
    flat slab. Real enforcer is gates/art_45_gate.py."""
    ys = np.where(mask.any(axis=1))[0]
    xs = np.where(mask.any(axis=0))[0]
    if len(ys) < 8 or len(xs) < 8:
        return True, None
    y0, y1, x0, x1 = ys[0], ys[-1], xs[0], xs[-1]
    h = y1 - y0 + 1
    lum = rgb.mean(axis=2)
    top = _band_mean(lum, mask, y0, y0 + max(1, h // 6))
    mid = _band_mean(lum, mask, y0 + h // 3, y0 + 2 * h // 3)
    if top is None or mid is None:
        return True, None
    fill = mask[y0:y1 + 1, x0:x1 + 1].mean()
    # slab-like fill AND top not lit (clearly darker than the wall) => reads flat
    if fill > 0.82 and top < mid - 18:
        return False, 'reads flat side-on: no sky-lit top band (top %.0f < wall %.0f). 45-DEGREE ART LAW. (proxy; art_45_gate.py is the real check)' % (top, mid)
    return True, None


def check_tan(rgb, mask):
    """A candidate explicitly claiming to be a tan wall must actually be tan."""
    if not mask.any():
        return True, None
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    tan = (r > 150) & (g > 115) & (b < g) & ((r - b) > 20) & mask
    share = tan.sum() / mask.sum()
    if share < 0.4:
        return False, 'claims tan wall but only %.0f%% of pixels read desert-tan (TAN WALL 85/15)' % (share * 100)
    return True, None


def _shift(a, dy, dx):
    out = np.zeros_like(a)
    ys = slice(max(0, dy), a.shape[0] + min(0, dy))
    yd = slice(max(0, -dy), a.shape[0] + min(0, -dy))
    xs = slice(max(0, dx), a.shape[1] + min(0, dx))
    xd = slice(max(0, -dx), a.shape[1] + min(0, -dx))
    out[yd, xd] = a[ys, xs]
    return out


def _band_mean(lum, mask, ya, yb):
    band = mask[ya:yb + 1]
    if not band.any():
        return None
    return float(lum[ya:yb + 1][band].mean())


# ---------- text / layout / meta checks ----------
def check_emdash(text):
    if EMDASH.search(text or ''):
        return False, 'em dash in shipped copy (VOICE LAW: never an em dash)'
    return True, None


def check_url_json(text, tags):
    t = text or ''
    if re.search(r'BOHEMIA_ALPHA_0_9\.html\?', t):
        return False, 'cache-buster query string on the one alpha link (ONE-LINK LAW)'
    if 'verdict_tool' in [x.lower() for x in tags] and re.search(r'application/json|\.json[\'"]', t):
        return False, 'verdict tool exports .json (must be .txt; iOS blanks .json on share)'
    return True, None


def check_pavement(meta):
    if meta.get('vehicular') is True:
        return True, None
    dp, cp = meta.get('drivePct'), meta.get('contentPct')
    if dp is None or cp is None:
        return True, None
    if dp > cp + 0.10:
        return False, 'pavement-dominant layout: drivePct %.2f > contentPct %.2f + margin (WALKABLE-LAND)' % (dp, cp)
    return True, None


def check_recolor(meta, shape_index):
    """structure-not-color: a candidate CLAIMING a new shape whose geometry hash
    duplicates an existing/sibling shape is a recolor in disguise."""
    if not meta.get('is_new_shape'):
        return True, None
    sh = meta.get('shape_hash')
    ref = meta.get('ref_shape_hash')
    if sh is not None and (sh == ref or shape_index.get(sh, 0) > 1):
        return False, 'recolor posing as a new shape: geometry unchanged, only the colorway differs (STRUCTURE-NOT-COLOR)'
    return True, None


def check_graveyard(text, tokens=None):
    hay = text or ''
    for tok in (GRAVE_TOKENS if tokens is None else tokens):
        try:
            if re.search(tok, hay):
                return False, 'reuses a graveyarded token /%s/ (GRAVEYARD IS FINAL)' % tok
        except re.error:
            if tok in hay:
                return False, 'reuses a graveyarded token %s (GRAVEYARD IS FINAL)' % tok
    return True, None


# ---------- the filter ----------
def evaluate(cand, shape_index):
    """Return list of (rule, reason) kills for one candidate."""
    kills = []
    kind = cand.get('kind', 'text')
    tags = cand.get('tags', []) or []
    meta = cand.get('meta', {}) or {}
    tl = [t.lower() for t in tags]
    name_blob = ' '.join(str(cand.get(k, '')) for k in ('id', 'name')) + ' ' + str(cand.get('text', ''))

    # graveyard applies to everything (id/name/text)
    ok, why = check_graveyard(name_blob)
    if not ok:
        kills.append(('graveyard', why))

    src = None
    if cand.get('b64'):
        src = ('b64', cand['b64'])
    elif cand.get('path') and os.path.exists(cand['path']):
        src = cand['path']
    if kind == 'image' and _HAVE_PIL and src is not None:
        rgb, mask, alpha = _load_rgb_and_mask(src)
        for fn, args in (
            (check_purple, (rgb, mask, tags, meta)),
        ):
            ok, why = fn(*args)
            if not ok:
                kills.append(('purple', why))
        if any(t in tl for t in ('art', 'building', 'prop', 'signal', 'hero', 'sprite')):
            ok, why = check_black_outline(rgb, mask, alpha)
            if not ok:
                kills.append(('check_black_outline', why))
            ok, why = check_flat_side_on(rgb, mask)
            if not ok:
                kills.append(('check_flat_side_on', why))
        if meta.get('role') == 'tan_wall' or 'tan_wall' in tl:
            ok, why = check_tan(rgb, mask)
            if not ok:
                kills.append(('tan', why))

    if kind == 'text' or cand.get('text'):
        if any(t in tl for t in ('ui_copy', 'copy', 'text', 'verdict_tool', 'url')):
            for fn, a in ((check_emdash, (cand.get('text', ''),)),
                          (check_url_json, (cand.get('text', ''), tags))):
                ok, why = fn(*a)
                if not ok:
                    kills.append((fn.__name__, why))

    if kind == 'layout':
        ok, why = check_pavement(meta)
        if not ok:
            kills.append(('pavement', why))

    ok, why = check_recolor(meta, shape_index)
    if not ok:
        kills.append(('recolor', why))

    return kills


def prefilter(candidates):
    """Programmatic API for factories. Returns (survivors, killed, report_text).
    survivors PASS the pre-filter (still require Paolo's thumbs; never approved)."""
    shape_index = {}
    for c in candidates:
        sh = (c.get('meta') or {}).get('shape_hash')
        if sh is not None:
            shape_index[sh] = shape_index.get(sh, 0) + 1
    survivors, killed = [], []
    for c in candidates:
        ks = evaluate(c, shape_index)
        if ks:
            killed.append((c, ks))
        else:
            survivors.append(c)
    return survivors, killed, render_report(candidates, survivors, killed)


def render_report(candidates, survivors, killed):
    L = []
    L.append('BOHEMIA TASTE REPORT — pre-judge KILL pass')
    L.append('(the filter KILLS, it never APPROVES; survivors still need Paolo\'s thumbs)')
    L.append('candidates: %d | KILLED: %d | passed pre-filter: %d' %
             (len(candidates), len(killed), len(survivors)))
    L.append('')
    if killed:
        L.append('== KILLED ==')
        for c, ks in killed:
            L.append('  [KILL] %s' % (c.get('id') or c.get('name') or '?'))
            for rule, why in ks:
                L.append('         - (%s) %s' % (rule, why))
    else:
        L.append('== KILLED == (none)')
    L.append('')
    L.append('== PASSED PRE-FILTER (still require Paolo\'s real thumbs) ==')
    for c in survivors:
        L.append('  [ ok ] %s' % (c.get('id') or c.get('name') or '?'))
    return '\n'.join(L) + '\n'


# ---------- CLI + selftest ----------
def _selftest():
    cands = [
        {'id': 'clean_copy', 'kind': 'text', 'tags': ['ui_copy'], 'text': 'the block goes dark tonight'},
        {'id': 'emdash_copy', 'kind': 'text', 'tags': ['ui_copy'], 'text': 'the block ' + chr(0x2014) + ' it goes dark'},
        {'id': 'good_lot', 'kind': 'layout', 'meta': {'drivePct': 0.2, 'contentPct': 0.6}},
        {'id': 'apron_lot', 'kind': 'layout', 'meta': {'drivePct': 0.6, 'contentPct': 0.2}},
        {'id': 'drivein', 'kind': 'layout', 'meta': {'drivePct': 0.7, 'contentPct': 0.2, 'vehicular': True}},
        {'id': 'recolor', 'kind': 'image', 'meta': {'is_new_shape': True, 'shape_hash': 'H1', 'ref_shape_hash': 'H1'}},
        {'id': 'new_shape', 'kind': 'image', 'meta': {'is_new_shape': True, 'shape_hash': 'H9'}},
    ]
    survivors, killed, report = prefilter(cands)
    killed_ids = {c.get('id') for c, _ in killed}
    expect_kill = {'emdash_copy', 'apron_lot', 'recolor'}
    expect_pass = {'clean_copy', 'good_lot', 'drivein', 'new_shape'}
    ok = killed_ids == expect_kill and expect_pass.isdisjoint(killed_ids)
    # graveyard mechanism, tested with a SYNTHETIC token (never a real corpse in
    # source, or the graveyard gate would flag this file as a live reference)
    gok_dead, _ = check_graveyard('a candidate named ZZ_DEAD_TOKEN_ZZ here', ['ZZ_DEAD_TOKEN_ZZ'])
    gok_live, _ = check_graveyard('a perfectly fine candidate', ['ZZ_DEAD_TOKEN_ZZ'])
    ok = ok and (gok_dead is False) and (gok_live is True)
    print(report)
    # image checks (need PIL): a purple tile must die, a tan tile must live
    if _HAVE_PIL:
        import tempfile
        d = tempfile.mkdtemp()
        purple = Image.new('RGBA', (16, 16), (150, 40, 160, 255))
        pth = os.path.join(d, 'purple.png'); purple.save(pth)
        rgb, mask, _al = _load_rgb_and_mask(pth)
        pok, _ = check_purple(rgb, mask, [], {})
        ok = ok and (pok is False)
        # same purple, but allowlisted context (agent_iris) survives purple check
        aok, _ = check_purple(rgb, mask, ['agent_iris'], {})
        ok = ok and (aok is True)
        print('image purple check: bad-killed=%s allowlisted-passed=%s' % (not pok, aok))

        # KEYLINE REGRESSION (learned the hard way): the first version of the
        # outline check killed 12 of Paolo's APPROVED district heroes, because an
        # anti-aliased sprite's edge pixels are semi-transparent and read dark.
        # A filter that kills approved work is worse than no filter. Lock BOTH
        # directions forever: AA fringe must PASS, a solid keyline must DIE.
        def _mk(keyline):
            im = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
            px = im.load()
            for y in range(8, 56):
                for x in range(8, 56):
                    px[x, y] = (190, 150, 110, 255)
            if keyline:
                for t in range(8, 56):
                    px[t, 8] = px[t, 55] = px[8, t] = px[55, t] = (5, 5, 5, 255)
            else:
                # a soft AA halo: dark-ish but SEMI-TRANSPARENT, like a real render
                for t in range(7, 57):
                    for (x, y) in ((t, 7), (t, 56), (7, t), (56, t)):
                        px[x, y] = (20, 16, 12, 60)
            return im
        for keyline, want_kill in ((True, True), (False, False)):
            im = _mk(keyline)
            p2 = os.path.join(d, 'kl%s.png' % keyline); im.save(p2)
            rgb2, mask2, al2 = _load_rgb_and_mask(p2)
            got_ok, _ = check_black_outline(rgb2, mask2, al2)
            killed_it = (got_ok is False)
            ok = ok and (killed_it == want_kill)
            print('keyline regression: solid=%s -> killed=%s (want %s)' % (keyline, killed_it, want_kill))
    print('SELFTEST:', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


def main(argv):
    if '--selftest' in argv:
        return _selftest()
    args = [a for a in argv[1:] if not a.startswith('--')]
    if not args:
        print(__doc__)
        return 0
    manifest = json.load(open(args[0], encoding='utf8'))
    cands = manifest.get('candidates', [])
    survivors, killed, report = prefilter(cands)
    report_path = None
    if '--report' in argv:
        report_path = argv[argv.index('--report') + 1]
    else:
        os.makedirs('records', exist_ok=True)
        report_path = 'records/BOHEMIA_TASTE_REPORT_%s.txt' % re.sub(r'\W+', '_', manifest.get('batch', 'batch'))
    open(report_path, 'w', encoding='utf8').write(report)
    print(report)
    print('taste report -> %s' % report_path)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
