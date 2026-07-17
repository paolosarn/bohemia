#!/usr/bin/env python3
"""
BOHEMIA CHUNK (7/16/26) — carry any file through a 25MB door.

GitHub's web upload caps at 25MB/file. The HD tile repos are ~45MB each. This
splits any file into GitHub-safe chunks and reassembles them byte-exact. It
rides inside the master parts, so ANY session that has the seed can run it.

  python3 bohemia_chunk.py split <file>            -> <file>.chunk01..N + .chunkmanifest.txt
  python3 bohemia_chunk.py join  <file>            -> reassembles from chunks, md5-verified

First Code session joins everything: for m in *.chunkmanifest.txt -> join.
"""
import sys, os, hashlib

CAP = 23_000_000   # 23MB. 7/16: the web door rejects a BIG MULTI-FILE commit, not a big file. One file at a time commits fine at 23MB (Paolo proved it). Aggregate is the wall, not per-file.

def split(path):
    data = open(path, 'rb').read()
    whole = hashlib.md5(data).hexdigest()
    n = (len(data) + CAP - 1) // CAP
    lines = ['BOHEMIA CHUNK MANIFEST', 'file: %s' % os.path.basename(path),
             'md5: %s' % whole, 'bytes: %d' % len(data), 'chunks: %d' % n]
    for i in range(n):
        part = data[i * CAP:(i + 1) * CAP]
        cp = '%s.chunk%02d' % (path, i + 1)
        open(cp, 'wb').write(part)
        lines.append('chunk%02d  %s  %d' % (i + 1, hashlib.md5(part).hexdigest(), len(part)))
        print('  %-46s %5.1f MB' % (os.path.basename(cp), len(part) / 1e6))
    open(path + '.chunkmanifest.txt', 'w').write('\n'.join(lines))
    print('  -> %d chunks + manifest. Upload ALL of them; join verifies the md5.' % n)

def join(path):
    man = path + '.chunkmanifest.txt'
    if not os.path.exists(man):
        print('missing %s' % man); return 1
    meta = dict(l.split(': ', 1) for l in open(man).read().split('\n')[1:5])
    data = b''
    i = 1
    while os.path.exists('%s.chunk%02d' % (path, i)):
        data += open('%s.chunk%02d' % (path, i), 'rb').read()
        i += 1
    got = hashlib.md5(data).hexdigest()
    if got != meta['md5'] or len(data) != int(meta['bytes']):
        print('FATAL: reassembly mismatch (%s vs %s) — a chunk is missing or corrupt.'
              % (got[:8], meta['md5'][:8]))
        return 1
    open(path, 'wb').write(data)
    print('  %s reassembled, %d bytes, md5 EXACT. Chunks can be deleted.' % (path, len(data)))
    return 0

if __name__ == '__main__':
    if len(sys.argv) < 3 or sys.argv[1] not in ('split', 'join'):
        print(__doc__); sys.exit(2)
    sys.exit(split(sys.argv[2]) if sys.argv[1] == 'split' else join(sys.argv[2]))
