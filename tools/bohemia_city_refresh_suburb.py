#!/usr/bin/env python3
"""
BOHEMIA CITY: REFRESH AN EMBEDDED ENGINE MODULE (8/1/26).

WHY THIS EXISTS, AND IT IS A REAL HOLE IN THE PIPELINE RATHER THAN A CHORE.
The CITY tab carries 38 engine modules VERBATIM inside CITY_B64 - every district
generator, married in 7/20 through 7/23 - and city_tab_gate byte-locks them to
the files on disk ("the approved generator rides the city verbatim"). That lock
is right and should stay: it is what stops the tab drifting from the engine.

But every tool that married one in is ONE-SHOT by design - `if <marker> in
decoded: no-op` - because re-running their WIRING would duplicate it. So the
moment anybody edits one of those engine files, the alpha keeps the OLD copy
forever, the byte-lock goes red, and the only way out is knowing which of 200+
tools to reach for and that it will refuse to help. That happened on 8/1 when the
GATED IS RICH fix changed engine/bohemia_suburb.js.

The marriage patches stay idempotent. This is the missing other half: refresh the
PAYLOAD without re-doing the WIRING.

HOW THE OLD BYTES ARE FOUND, AND THIS IS THE WHOLE SAFETY STORY. Two earlier
drafts of this tool tried to locate the module's body by DELIMITER - "from this
header to the next one" - and both were dangerous:
  draft 1 closed on the `dual traversal proof` marker, which sits after ALL 38,
    and replaced 412KB of thirty-eight modules with the 30KB of one;
  draft 2 closed on the next module header, which is right for every module but
    the LAST, where it swallowed whatever the marriage patch had written after
    it - and took the CITY tab's own `om` binding with it. The alpha booted with
    "ReferenceError: om is not defined".
Both were caught by gates within a minute, which is the system working. But the
lesson is that a boundary GUESSED from delimiters is a knife in a 34MB blob.
So this tool does not guess. It asks GIT what the file looked like at HEAD -
which is exactly what was embedded, because the byte-lock was green at HEAD -
and replaces THAT EXACT STRING. If those bytes are not in the blob exactly once,
it refuses and changes nothing. A replacement that cannot find its target is a
replacement that must not happen.

REUSE CHECK: cooks ZERO pixels and opens no bank. It copies an existing engine
file over an existing embedded copy of that same file. Nothing is created.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.

  python3 tools/bohemia_city_refresh_suburb.py [engine/bohemia_suburb.js ...]
"""
import base64
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MODULES = [a for a in sys.argv[1:] if not a.startswith('-')] or ['engine/bohemia_suburb.js']

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

changed = 0
for path in MODULES:
    now = open(path, encoding='utf8').read()
    try:
        was = subprocess.run(['git', 'show', 'HEAD:' + path], capture_output=True,
                             text=True, check=True).stdout
    except subprocess.CalledProcessError:
        sys.exit('REFRESH: cannot read HEAD:%s from git, so the bytes that were '
                 'embedded are unknown. Refusing to guess.' % path)

    if now == was:
        print('%s is unchanged since HEAD. nothing to refresh.' % path)
        continue
    n = decoded.count(was)
    if n != 1:
        sys.exit('REFRESH: the HEAD body of %s appears %d times in CITY_B64 '
                 '(expected exactly 1). Refusing to cut blindly.' % (path, n))
    decoded = decoded.replace(was, now, 1)
    changed += 1
    print('REFRESHED %s in CITY_B64 (%d -> %d bytes)' % (path, len(was), len(now)))

if not changed:
    print('no-op.')
    sys.exit(0)

alpha = alpha[:a0] + base64.b64encode(decoded.encode('utf8')).decode('ascii') + alpha[a1:]
open(ALPHA, 'w', encoding='utf8').write(alpha)
print('city_tab_gate byte-locks these; run it to confirm.')
