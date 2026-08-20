#!/usr/bin/env python3
"""
BOHEMIA VERDICT-FROZEN GATE (8/16/26, SOUNDS lane) -- ONCE HE HAS JUDGED A
SOUND, THAT SOUND CAN NEVER CHANGE AGAIN.

PAOLO, THE TURN THIS WAS WRITTEN: "I didn't see the new sound effect."

He was right, and the cause was worse than the symptom. SFX-07 rebuilt six
moments out of his instrument rack and shipped them under the SAME EVENT IDS
the six raw-synthesis versions had used -- round_land, cover_chew, car_heat,
man_moves, nerve_break, wake_up -- all of which he had killed 5 of 5 hours
earlier on his 400/400 sweep. Two failures fell out of that one mistake:

  1. HE COULD NOT SEE THE BATCH. The judge sheet bakes his committed verdicts
     and opens a decided moment COLLAPSED, on purpose, so he is never asked
     twice. Thirty brand-new candidates were therefore hidden behind his own
     DOWN thumbs. He judged nothing because he was shown nothing.

  2. THIRTY OF HIS THUMBS WERE SILENTLY REASSIGNED. A candidate in this engine
     is a pure function of (event, index) through the recipe. The verdict file
     line `DOWN round_land.0` is only TRUE while round_land.0 still cooks the
     sound he actually heard. Re-pointing that id at a templeblock made the
     record a lie -- and nothing in the machine noticed.

The repo already had the principle written down, in ENVELOPE's own comment:
"narrowing a jitter range CHANGES WHAT casing.1 IS -- and 130 of his thumbs
are attached to those exact vectors." It was a COMMENT. A LAW WITHOUT A MACHINE
GATE IS NOT ENFORCED, and this is the gate.

HOW IT WORKS. Every judged candidate's cooked vector is fingerprinted and the
fingerprints are committed to records/BOHEMIA_SFX_VERDICT_FINGERPRINTS.json.
On every run the gate re-cooks and re-fingerprints, and any drift on an id he
has already judged is a FAILURE. The fix for a red is never to re-bless the
file: it is to give the new sound a NEW EVENT ID, which is what this engine
already does every time (miss -> miss_past, step_glass -> glass_crunch,
swing -> swing_air, and now round_land -> dirt_take).

An UNJUDGED event may change freely. That is the whole point: cooking is free
until he spends a thumb on it, and frozen the instant he does.

Run from repo root:  python3 gates/verdict_frozen_gate.py
Re-bless (ONLY for ids that have never been judged):
                     python3 gates/verdict_frozen_gate.py --bless
"""
import glob
import hashlib
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
STORE = 'records/BOHEMIA_SFX_VERDICT_FINGERPRINTS.json'
# THE ONLY DOOR OUT OF A FROZEN VERDICT (8/19). A judged sound sometimes HAS to
# change -- on 8/19 four candidates turned out to be built on two voices Paolo
# had graveyarded on 7/19 ("Do not re-add"), which also happened to render
# SILENT through this engine, so his thumbs were sitting on sounds with no body
# in them. Refusing forever would have meant shipping a retired voice; allowing
# it quietly would have meant his verdict drifting under him, which is the exact
# thing this gate exists to stop. So the exception is a COMMITTED FILE with a
# written reason per id, and the gate reads it, names every line in its output
# every run, and refuses any drift that is not in it.
REOPEN = 'records/BOHEMIA_SFX_VERDICT_REOPENED.txt'

DERIVE = r'''
const path=require('path');
const S=require(path.join(process.argv[2],'engine','bohemia_sfx.js'));
const out={};
for(const E of S.EVENTS) for(const c of S.cook(E.ev,5)){
  const v={}; for(const k of Object.keys(c).sort()) if(k!=='id'&&k!=='ev') v[k]=c[k];
  out[c.id]=JSON.stringify(v);
}
console.log(JSON.stringify(out));
'''


def judged_ids():
    """Every candidate id he has ever spent a thumb on, from his own files."""
    seen = {}
    for f in sorted(glob.glob('records/BOHEMIA_SFX_VERDICT_*.txt')):
        for verdict, cid in re.findall(r'^\s*(UP|DOWN)\s+(\S+\.\d+)\s*$',
                                       open(f, encoding='utf8').read(), re.M):
            seen[cid] = verdict
    return seen


def fingerprints():
    fn = '/tmp/_vf_derive.js'
    open(fn, 'w').write(DERIVE)
    try:
        r = subprocess.run(['node', fn, ROOT], capture_output=True, text=True, timeout=180)
    finally:
        os.unlink(fn)
    line = [x for x in r.stdout.strip().split('\n') if x.startswith('{')]
    if not line:
        print('  > the engine would not cook:\n' + (r.stderr or '')[-900:])
        return None
    raw = json.loads(line[-1])
    return {k: hashlib.sha1(v.encode()).hexdigest()[:16] for k, v in raw.items()}


def main():
    bless = '--bless' in sys.argv
    print('=== VERDICT-FROZEN GATE - a sound he has judged can never change ===')
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  FAIL ' + name)

    judged = judged_ids()
    now = fingerprints()
    if now is None:
        print('  0 passed, 1 FAILED')
        return 1
    ok('his verdict files still read (%d judged candidates)' % len(judged),
       len(judged) >= 300)
    ok('the engine still cooks every candidate (%d)' % len(now), len(now) >= 400)

    old = {}
    if os.path.exists(STORE):
        old = json.load(open(STORE))

    # a line is `id | date | swap | why`, and the why has to be real
    reopened = {}
    if os.path.exists(REOPEN):
        for ln in open(REOPEN, encoding='utf8'):
            if '|' not in ln or ln.lstrip().startswith('#'):
                continue
            head = ln.split('|')[0].strip()
            if re.match(r'^[a-z_]+\.[0-9]+$', head) and len(ln.split('|')) >= 4:
                reopened[head] = ln.split('|', 3)[3].strip()

    # ---- THE ONE THAT MATTERS -------------------------------------------
    # Only ids he has ACTUALLY JUDGED are frozen. Everything else is free.
    drifted, vanished, excused = [], [], []
    for cid in sorted(judged):
        if cid not in now:
            vanished.append(cid)
            continue
        if cid in old and old[cid] != now[cid]:
            (excused if cid in reopened else drifted).append(cid)

    if excused:
        print('  NOTE  %d judged sounds were REOPENED ON THE RECORD (%s). Each '
              'one is a thumb he spent that no longer points at what he heard, '
              'and each carries a written reason in %s:'
              % (len(excused), ', '.join(excused), REOPEN))
        for cid in excused:
            print('          %-14s %s' % (cid, reopened[cid][:96]))

    ok('NO SOUND HE HAS JUDGED HAS CHANGED (%s)'
       % (', '.join(drifted[:6]) + (' +%d more' % (len(drifted) - 6) if len(drifted) > 6 else '')
          or 'all %d stable' % len(judged)),
       not drifted)
    if drifted:
        print('        A judged id changed what it sounds like. Do NOT re-bless.')
        print('        Give the new sound a NEW EVENT ID, the way this engine')
        print('        already does: miss->miss_past, swing->swing_air,')
        print('        round_land->dirt_take. His thumb belongs to the sound he')
        print('        actually heard.')

    # A judged id that stops cooking at all is the same failure wearing a
    # different hat: his verdict now points at nothing.
    ok('every candidate he judged still exists (%s)'
       % (', '.join(vanished[:6]) or 'all present'), not vanished)

    # ---- and the sheet must be able to SHOW him what is new --------------
    fresh = [c for c in now if c not in judged]
    fresh_ev = sorted({c.rsplit('.', 1)[0] for c in fresh})
    print('  NOTE  %d candidates across %d moments are UNJUDGED and will open '
          'EXPANDED for him: %s'
          % (len(fresh), len(fresh_ev), ', '.join(fresh_ev) or 'none'))
    # THE SYMPTOM HE REPORTED, ASSERTED DIRECTLY. If a batch was cooked this
    # turn and every one of its ids is already judged, he cannot see it, and
    # "I didn't see the new sound effect" happens again.
    alpha = open('slices/BOHEMIA_ALPHA_0_9.html', encoding='utf8').read()
    m = re.search(r'var SETTLED=(\{.*?\});', alpha)
    ok('the shipped judge sheet bakes his verdicts', m is not None)
    if m:
        baked = json.loads(m.group(1))
        hidden = [e for e in fresh_ev
                  if all(('%s.%d' % (e, i)) in baked for i in range(5))]
        ok('no unjudged moment is hidden behind a decided one (%s)'
           % (', '.join(hidden) or 'none hidden'), not hidden)

    if bless:
        merged = dict(old)
        for cid, fp in now.items():
            if cid in old and cid in judged and old[cid] != fp and cid not in reopened:
                continue  # never quietly re-bless a judged drift
            merged[cid] = fp
        json.dump(merged, open(STORE, 'w'), indent=0, sort_keys=True)
        print('  blessed %d fingerprints (judged drifts refused)' % len(merged))
        return 0

    if not old:
        json.dump(now, open(STORE, 'w'), indent=0, sort_keys=True)
        print('  first run: wrote %d fingerprints' % len(now))

    print('  %d passed, %d FAILED' % (p, f))
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
