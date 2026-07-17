#!/usr/bin/env python3
"""
BOHEMIA MASTER DOWNLOAD (7/16/26)

Born from the 7/16 explosion: the chat died, "download all" moved 113 files and
ZERO HTML, and Paolo spent three hours hand-carrying 100+ files one at a time.
Never again.

THE RULE: one zip, one tap. Every session ends by regenerating it. It only ever
GROWS, because /mnt/user-data/outputs accumulates everything Claude ships and
the canon files ride along. A new chat needs exactly one upload: this zip.

WHAT GOES IN
  - everything Claude has shipped this session (outputs/)
  - every engine .js, gate .py/.js, registry, and addendum .md in the workspace
  - every verdict/repo .txt bank (the cooked art IS the record)
  - the live slices and the four proofs that matter
WHAT STAYS OUT (and why it is safe out)
  - one-shot judging tools (*_TOOL_*, *JUDGING*, *SWEEP*, *PICKER* interactives
    except batch-2 which still awaits verdicts): their verdicts are already
    banked as .txt, the tools are disposable — established 7/16
  - the HD tile repos and the 29MB alpha: they live in PROJECT STORAGE, which
    survives every chat. The master carries the working state, not the museum.

THE PROOF: the manifest prints a BY-EXTENSION table. If html = 0, the build
FAILS HARD. That is the exact failure mode of the download-all button, and this
script refuses to reproduce it.

  python3 bohemia_master.py            -> BOHEMIA_MASTER_<date>.zip in outputs
  python3 bohemia_master.py --parts    -> same content as N standalone zips, each
                                          under 23MB, because GitHub's web upload
                                          caps at 25MB/file. Every part carries
                                          the SAME full manifest; unzip all parts
                                          into one folder and verify against it.
"""
import zlib
import os, zipfile, hashlib, sys, time, collections, fnmatch

WORK = os.environ.get('BOHEMIA_WORK', os.path.dirname(os.path.abspath(__file__)))  # repo-relative (7/16 merge): chat-era hardcoded /home/claude/bohemia is dead
OUT = os.environ.get('BOHEMIA_OUT', WORK)
DATE = os.environ.get('BOHEMIA_DATE') or time.strftime('%m_%d_%y')
DEST = os.path.join(OUT, 'BOHEMIA_MASTER_%s.zip' % DATE)

# disposable one-shot judging interactives (verdicts already banked as .txt)
SKIP_HTML = ['*_TOOL_*', '*JUDGING*', '*SWEEP_*', '*SWEEP.*', '*SPOTCHECK*',
             '*VERDICT_SESSION*', '*SEAM_SCHOOL*', '*CLUSTER_NAMING*',
             '*FAMILY_SORT*', '*CATEGORY_AUDIT*', '*PLAYGROUND*',
             '*JUNCTION_LAB*', '*COVERAGE_ATLAS*', '*GREAT_SWEEP*']
# heavy art that lives in project storage
# REPO-ERA CORRECTION (7/16 merge): the old rule skipped the alpha and the HD
# repos because "they live in project storage." IN THE REPO ERA THERE IS NO
# PROJECT STORAGE. The repo is the one home: if it does not ride, it does not
# exist. Both are now too big for the 25MB web-upload door, so they travel as
# chunks (bohemia_chunk.py) and are skipped HERE, not skipped ENTIRELY.
# Their .chunk files and .chunkmanifest.txt DO ride and rejoin at the far end.
SKIP_ALWAYS = ['BOHEMIA_HD_TILE_REPO_part?.txt', 'BOHEMIA_ALPHA_0_9.html', '*.chunk[0-9][0-9]', '*.pyc', '*.prev',
               '*.incoming', '*.bak', 'BOHEMIA_MASTER_*.zip']
# SUPERSEDED SLICES: V11 is the live slice; V9 and V10 are its parents and stay
# as lineage. V2-V8 are history the newer slices fully contain — each was the
# previous plus additions, the exploded chat proved it (V10 = V9 verbatim +
# lamps, hash-checked). Carrying seven ancestors costs 26MB per download for
# zero information. bohemia_sync_ignore.txt already declares them superseded.
SKIP_SLICES = ['BOHEMIA_LIVE_SLICE_7_14*', '*SLICE_V2_*', '*SLICE_V3_*',
               '*SLICE_V4_*', '*SLICE_V5_*', '*SLICE_V6_*', '*SLICE_V7_*',
               '*SLICE_V8_*']
# batch-2 still awaits Paolo's thumbs — it rides even though it is a picker
FORCE_KEEP = ['BOHEMIA_WALL_PICKER_BATCH2_7_14_26.html',
              'BOHEMIA_BLOCKGEN_RENDER_PROOF_7_14_26.html',
              'BOHEMIA_NIGHT_BLOCKS_PROOF_7_14_26.html',
              'BOHEMIA_PIPELINE_STATUS_7_14_26.html']
SUPERSEDED_FILE = os.path.join(WORK, 'bohemia_superseded.txt')

def load_superseded():
    """CURATION, NOT HOARDING (Paolo, 7/16: wrong content was lingering).
    The master carries the LIVE state. A stale registry riding next to its
    replacement is misinformation for the next session. Nothing here is
    deleted — outputs, transcripts, and old masters keep the history. It
    just stops being carried forward, and the registry is the audit trail."""
    out = {}
    if os.path.exists(SUPERSEDED_FILE):
        for line in open(SUPERSEDED_FILE, encoding='utf-8'):
            line = line.split('#')[0].strip() if not line.strip().startswith('#') else ''
            if line and '|' in line:
                fn, why = [x.strip() for x in line.split('|', 1)]
                out[fn] = why
    return out

SUPERSEDED = {}

def skip(fn):
    if any(fnmatch.fnmatch(fn, p) for p in FORCE_KEEP):
        return False
    if fn in SUPERSEDED:
        return True
    if any(fnmatch.fnmatch(fn, p) for p in SKIP_ALWAYS):
        return True
    if any(fnmatch.fnmatch(fn, p) for p in SKIP_SLICES):
        return True
    if fn.endswith('.html') and any(fnmatch.fnmatch(fn, p) for p in SKIP_HTML):
        return True
    return False

PROJECT = os.environ.get('BOHEMIA_PROJECT', '')  # repo era: no project layer. set only if reviving a chat-era merge.

def gather():
    files = {}                                   # name -> path (newest layer wins)
    # LAYER 0: the project canon (GDDs, every addendum, quest vault, music repo).
    # Paolo's 7/16 call: the repo is the ONE home — so the full canon rides, not
    # just the graphics working state. Workspace and outputs override on name
    # collision because they are newer.
    if os.path.isdir(PROJECT):
        for fn in os.listdir(PROJECT):
            p = os.path.join(PROJECT, fn)
            if os.path.isfile(p) and not skip(fn) and \
               fn.endswith(('.js', '.py', '.md', '.txt', '.html', '.csv', '.json')):
                files[fn] = p
    for fn in os.listdir(WORK):
        p = os.path.join(WORK, fn)
        if os.path.isfile(p) and not skip(fn) and \
           fn.endswith(('.js', '.py', '.md', '.txt', '.html', '.csv', '.json')):
            files[fn] = p
    for fn in os.listdir(OUT):                   # everything shipped, always
        p = os.path.join(OUT, fn)
        if os.path.isfile(p) and not skip(fn):
            files[fn] = p                        # shipped copy is canonical
    return files

def build_parts(files):
    md5s, sizes, datas = {}, {}, {}
    for fn in files:
        d = open(files[fn], 'rb').read()
        datas[fn] = d
        md5s[fn] = hashlib.md5(d).hexdigest()
        sizes[fn] = len(zlib.compress(d, 6))
    manifest = ['BOHEMIA MASTER %s — %d files — MULTI-PART (unzip ALL parts into one folder)'
                % (DATE, len(files)), '']
    for fn in sorted(files):
        manifest.append('%s  %8d  %s' % (md5s[fn], len(datas[fn]), fn))
    man = '\n'.join(manifest)
    CAP = 23_000_000   # 23MB parts: fine when uploaded one at a time.
    bins, cur, acc = [], [], 0
    for fn in sorted(files, key=lambda f: -sizes[f]):   # big files first
        if acc + sizes[fn] > CAP and cur:
            bins.append(cur); cur, acc = [], 0
        cur.append(fn); acc += sizes[fn]
    if cur: bins.append(cur)
    out = []
    for i, b in enumerate(bins, 1):
        dest = os.path.join(OUT, 'BOHEMIA_MASTER_%s_part%d.zip' % (DATE, i))
        with zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED) as z:
            for fn in sorted(b):
                z.writestr(fn, datas[fn])
            z.writestr('_MANIFEST.md5.txt', man)
        out.append((dest, os.path.getsize(dest), len(b)))
    print('=' * 70)
    print('BOHEMIA MASTER %s — %d PARTS (GitHub web-upload safe, <15MB each, upload in waves)'
          % (DATE, len(out)))
    print('=' * 70)
    for dest, sz, n in out:
        print('  %-42s %5.1f MB  %3d files' % (os.path.basename(dest), sz / 1e6, n))
        if sz > 25_000_000:
            print('  FATAL: part exceeds the GitHub cap'); return 1
    print('  full md5 manifest inside every part · unzip all into one folder')
    return 0

def main():
    global SUPERSEDED
    SUPERSEDED = load_superseded()
    files = gather()
    if '--parts' in sys.argv:
        # dup rule still applies before splitting
        for fn in list(files):
            base = fn.replace('__1_', '')
            if base != fn and base in files and \
               open(files[fn],'rb').read() == open(files[base],'rb').read():
                del files[fn]
        return build_parts(files)
    # DUP RULE: __1_ upload copies. Byte-identical to the base -> silently cut.
    # DIFFERENT from the base -> keep BOTH and scream, because a real fork needs
    # eyes, not an auto-pick.
    forks = []
    for fn in list(files):
        base = fn.replace('__1_', '')
        if base != fn and base in files:
            a = open(files[fn], 'rb').read(); b = open(files[base], 'rb').read()
            if a == b:
                del files[fn]
            else:
                forks.append((fn, base))
    ext = collections.Counter(os.path.splitext(f)[1] for f in files)
    manifest = ['BOHEMIA MASTER %s — %d files' % (DATE, len(files)), '']
    total = 0
    with zipfile.ZipFile(DEST, 'w', zipfile.ZIP_DEFLATED) as z:
        for fn in sorted(files):
            data = open(files[fn], 'rb').read()
            total += len(data)
            z.writestr(fn, data)
            manifest.append('%s  %8d  %s' %
                            (hashlib.md5(data).hexdigest(), len(data), fn))
        z.writestr('_MANIFEST.md5.txt', '\n'.join(manifest))
    size = os.path.getsize(DEST)
    print('=' * 70)
    print('BOHEMIA MASTER %s' % DATE)
    print('=' * 70)
    print('  %d files, %.1f MB raw -> %.1f MB zipped' %
          (len(files), total / 1e6, size / 1e6))
    print('  by extension (the proof the download-all bug cannot recur):')
    for e, n in ext.most_common():
        print('    %-6s %d' % (e or '(none)', n))
    cut = [f for f in SUPERSEDED if f not in files]
    print('  superseded content NOT riding: %d files (registry: bohemia_superseded.txt)' % len(cut))
    if forks:
        print('  *** REAL FORKS (dup differs from base, BOTH kept, needs eyes):')
        for a, b in forks:
            print('      %s  vs  %s' % (a, b))
    if ext.get('.html', 0) == 0:
        print('\n  FATAL: ZERO HTML IN THE MASTER. That is the download-all bug.')
        os.remove(DEST)
        return 1
    print('\n  -> %s' % DEST)
    print('  One tap. One upload next chat. Nothing to pick up off the floor.')
    return 0

if __name__ == '__main__':
    sys.exit(main())
