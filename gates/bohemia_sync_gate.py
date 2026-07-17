#!/usr/bin/env python3
"""
BOHEMIA ENGINE SYNC GATE (7/16/26)

ENGINE SYNC LAW: after any engine edit, the inlined engine is synced across all
HTML files. Until now that law was enforced by memory. Memory is not a gate.

This is the gate. It rips every BOH_* module out of every HTML and .js in a
tree, normalizes it (comments and whitespace stripped — a comment edit is not
drift), hashes the body, and fails if any module has more than one distinct
body anywhere.

  python3 bohemia_sync_gate.py [dir ...]        # report + exit 1 on drift
  python3 bohemia_sync_gate.py --list           # show every module and carrier

Anchoring: the newest file carrying a module is treated as canon for the
report's "expected" column. It does NOT auto-fix. Auto-fixing engine code
without Paolo looking at it is exactly how drift becomes canon.
"""
import sys, os, re, hashlib, collections

MODULE_RE = re.compile(r'\bconst\s+(BOH_[A-Z0-9_]+)\s*=')
SKIP_DIRS = {'.git', 'node_modules', '__pycache__'}
IGNORE_FILE = os.path.join('gates', 'bohemia_sync_ignore.txt')
CANON_FILE = os.path.join('gates', 'bohemia_sync_canon.txt')

def load_canon(roots):
    """module -> canonical carrier filename. Canon is DECLARED, never inferred.
    mtime is not authority: re-dropping an old copy of a file makes it the
    newest file on disk and the most wrong file on disk at the same time."""
    canon = {}
    for r in roots:
        p = os.path.join(r, CANON_FILE)
        if os.path.exists(p):
            for line in open(p, encoding='utf-8'):
                line = line.split('#')[0].strip()
                if not line:
                    continue
                parts = line.split()
                if len(parts) >= 2:
                    canon[parts[0]] = parts[1]
    return canon

def load_ignore(roots):
    pats = set()
    for r in roots:
        p = os.path.join(r, IGNORE_FILE)
        if os.path.exists(p):
            for line in open(p, encoding='utf-8'):
                line = line.split('#')[0].strip()
                if line:
                    pats.add(line)
    return pats

def grab(text, start):
    """Balanced-delimiter extraction from `const NAME=` to the closing `;`.
    Skips delimiters inside strings, template literals, comments and regexes
    so a base64 blob or a `//` in a URL can't throw the depth count."""
    i, n = start, len(text)
    depth = 0
    while i < n:
        c = text[i]
        # line comment
        if c == '/' and i + 1 < n and text[i+1] == '/':
            i = text.find('\n', i)
            if i < 0: return None
            continue
        # block comment
        if c == '/' and i + 1 < n and text[i+1] == '*':
            j = text.find('*/', i + 2)
            if j < 0: return None
            i = j + 2
            continue
        # strings
        if c in '\'"`':
            q, i = c, i + 1
            while i < n:
                if text[i] == '\\': i += 2; continue
                if text[i] == q: break
                i += 1
            i += 1
            continue
        if c in '({[':
            depth += 1
        elif c in ')}]':
            depth -= 1
            if depth == 0:
                j = text.find(';', i)
                return text[start:(j + 1) if j > 0 else n]
            if depth < 0:
                return None
        i += 1
    return None

def normalize(body):
    body = re.sub(r'/\*.*?\*/', '', body, flags=re.S)
    body = re.sub(r'//[^\n]*', '', body)
    return re.sub(r'\s+', '', body)

def modules_in(path):
    try:
        text = open(path, encoding='utf-8', errors='replace').read()
    except Exception:
        return {}
    out = {}
    for m in MODULE_RE.finditer(text):
        body = grab(text, m.start())
        if not body:
            continue
        name = m.group(1)
        # a file may inline a module more than once; last wins, and that itself
        # is worth knowing, so record the count
        out.setdefault(name, []).append(body)
    return out

def scan(roots):
    ignore = load_ignore(roots)
    found = collections.defaultdict(list)   # name -> [(path, mtime, hash, body)]
    for root in roots:
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for fn in filenames:
                if not fn.endswith(('.html', '.js')):
                    continue
                if fn in ignore:      # superseded carrier, see bohemia_sync_ignore.txt
                    continue
                p = os.path.join(dirpath, fn)
                for name, bodies in modules_in(p).items():
                    for b in bodies:
                        found[name].append(
                            (p, os.path.getmtime(p), hashlib.md5(normalize(b).encode()).hexdigest(), b))
    return found

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    listing = '--list' in sys.argv
    roots = args or ['.']
    found = scan(roots)
    canon_decl = load_canon(roots)
    if not found:
        print('no BOH_ modules found under: ' + ', '.join(roots))
        return 0

    drift = 0
    print('=' * 78)
    print('BOHEMIA ENGINE SYNC GATE')
    print('=' * 78)
    for name in sorted(found):
        rows = found[name]
        variants = collections.defaultdict(list)
        for p, mt, h, b in rows:
            variants[h].append((p, mt))
        declared = canon_decl.get(name)
        canon, canon_src = None, None
        if declared:
            for p, mt, h, b in rows:
                if os.path.basename(p) == declared:
                    canon, canon_src = h, 'declared: ' + declared
                    break
            if canon is None:
                print(f'{name:20s} WARNING declared canon carrier missing: {declared}')
        if canon is None:
            canon = max(rows, key=lambda r: r[1])[2]
            canon_src = 'inferred by mtime (UNDECLARED — add it to ' + CANON_FILE + ')'
        if len(variants) == 1:
            if listing:
                print(f'\n{name}  IN SYNC across {len(rows)} carrier(s)  [{canon[:12]}]')
                for p, mt in sorted(variants[canon]):
                    print(f'    {os.path.relpath(p)}')
            else:
                print(f'{name:20s} IN SYNC   {len(rows):2d} carrier(s)   {canon[:12]}')
            continue
        drift += 1
        print(f'\n{name:20s} *** DRIFT ***  {len(variants)} distinct bodies across {len(rows)} carrier(s)')
        print(f'    canon {canon_src}')
        for h, ps in sorted(variants.items(), key=lambda kv: -max(m for _, m in kv[1])):
            tag = 'CANON' if h == canon else 'STALE'
            print(f'    [{h[:12]}] {tag}')
            for p, mt in sorted(ps):
                print(f'        {os.path.relpath(p)}')
    print('\n' + '=' * 78)
    if drift:
        print(f'ENGINE SYNC LAW VIOLATED: {drift} module(s) drifted.')
        print('Not auto-fixed on purpose. Re-inline from canon, then re-run.')
    else:
        print(f'ENGINE SYNC LAW HOLDS: {len(found)} module(s), zero drift.')
    return 1 if drift else 0

if __name__ == '__main__':
    sys.exit(main())
