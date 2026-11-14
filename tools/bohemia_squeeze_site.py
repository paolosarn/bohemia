#!/usr/bin/env python3
"""THE SITE'S PNGs, SQUEEZED AT DEPLOY (PLUMBER 8, 11/14/26; the coordinator's rule 447 round: 'get the published set well under the
cap ... recompress ... without deleting anything a slice loads').

Every PNG copied into the site folder is recompressed LOSSLESSLY (oxipng, the same pixels, every chunk kept) and the smaller of the two
is what ships. The repo is never touched (rewriting 11,000 PNGs in git would add their whole weight to the history again, ask row 562).
MEASURED on main 843a15e1 (oxipng level 2): a random 150 of the published PNGs 3.7 -> 3.3 MB (11%), 25 of the 300 biggest 13.7 -> 12.3 MB
(11%), the pixels the same on every one read back (RGBA compared). The WebP sheets were measured too: a lossless re-encode saves 0%.

It never fails a deploy: no oxipng, a file it cannot read, or the time budget spent, and that file ships as it was. A cache of squeezed
files by their content (--cache) means a deploy squeezes only what changed since the last one.

  python3 tools/bohemia_squeeze_site.py _site [--cache DIR] [--budget SECONDS] [--check]
    --check   squeeze a copy in memory, verify the pixels are the same on every file (Pillow), write nothing
"""
import hashlib, os, sys, time
from multiprocessing import Pool

LEVEL = 2


def squeeze(job):
    path, cache = job
    try:
        import oxipng
        d = open(path, 'rb').read()
        h = hashlib.sha1(d).hexdigest()
        c = os.path.join(cache, h + '.png') if cache else None
        if c and os.path.exists(c):
            o = open(c, 'rb').read()
        else:
            o = oxipng.optimize_from_memory(d, level=LEVEL)
            if len(o) >= len(d): o = d
            if c:
                tmp = c + '.%d.tmp' % os.getpid()
                open(tmp, 'wb').write(o); os.replace(tmp, c)
        if len(o) < len(d):   # written beside it and swapped in whole: a budget that stops the pool mid-write never ships half a file
            tmp = path + '.sq%d' % os.getpid()
            open(tmp, 'wb').write(o); os.replace(tmp, path)
        return len(d), len(o), None, h
    except Exception as e:
        try: n = os.path.getsize(path)
        except Exception: n = 0
        return n, n, str(e)[:120], None


def same_pixels(path):
    import io, oxipng
    from PIL import Image
    d = open(path, 'rb').read()
    o = oxipng.optimize_from_memory(d, level=LEVEL)
    a, b = Image.open(io.BytesIO(d)), Image.open(io.BytesIO(o))
    return a.size == b.size and a.convert('RGBA').tobytes() == b.convert('RGBA').tobytes(), len(d), len(o)


def main():
    a = sys.argv[1:]
    if not a: print(__doc__); return 0
    site = a[0]
    cache = a[a.index('--cache') + 1] if '--cache' in a else None
    budget = float(a[a.index('--budget') + 1]) if '--budget' in a else 420.0
    try:
        import oxipng  # noqa: F401
    except Exception as e:
        print('THE SQUEEZE: no oxipng (%s); the site ships as copied' % e); return 0
    pngs = []
    for root, _, files in os.walk(site):
        for f in files:
            if f.lower().endswith('.png'): pngs.append(os.path.join(root, f))
    if '--check' in a:
        bad, b0, b1 = [], 0, 0
        for p in pngs:
            ok, x, y = same_pixels(p); b0 += x; b1 += min(x, y)
            if not ok: bad.append(p)
        print('THE SQUEEZE --check: %d PNGs, %.1f -> %.1f MB, pixels different on %d %s' % (len(pngs), b0 / 1048576, b1 / 1048576, len(bad), bad[:3]))
        return 1 if bad else 0
    if cache: os.makedirs(cache, exist_ok=True)
    t0, b0, b1, errs, done, used = time.time(), 0, 0, [], 0, set()
    with Pool(os.cpu_count() or 2) as pool:
        it = pool.imap_unordered(squeeze, [(p, cache) for p in pngs], chunksize=8)
        for x, y, e, h in it:
            b0 += x; b1 += y; done += 1; used.add(h)
            if e: errs.append(e)
            if time.time() - t0 > budget:
                pool.terminate(); break
    pruned = 0
    if cache and done == len(pngs):   # the cache keeps only what this site ships, so it never grows past one site's PNGs
        for f in os.listdir(cache):
            if f.endswith('.png') and f[:-4] not in used: os.remove(os.path.join(cache, f)); pruned += 1
    import re as _re
    for root, _, files in os.walk(site):   # a write the budget cut short leaves only its side file: none ships
        for f in files:
            if _re.search(r'\.png\.sq\d+$', f): os.remove(os.path.join(root, f))
    print('THE SQUEEZE: %d of %d PNGs, %.1f -> %.1f MB (%.1f MB saved) in %.0f s%s%s' % (done, len(pngs), b0 / 1048576, b1 / 1048576,
          (b0 - b1) / 1048576, time.time() - t0, ('; the budget ran out, the rest ship as copied' if done < len(pngs) else ''),
          ('; %d could not be read and ship as copied (%s)' % (len(errs), errs[0])) if errs else '') + ('; %d old cache files pruned' % pruned if pruned else ''))
    return 0


if __name__ == '__main__':
    sys.exit(main())
