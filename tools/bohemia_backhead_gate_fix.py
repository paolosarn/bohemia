#!/usr/bin/env python3
"""BOHEMIA THE BACK OF HIS HEAD IS NOT MISSING ART (8/17/26, CHARACTER lane)

Two gates have been red for weeks and BOTH of them were demanding a FACE ON THE
BACK OF A SKULL. Every handoff since has carried it forward as "STILL HIS, STILL
OPEN: NE and NW have no face painted" -- a debt filed against PAOLO for art that is
correct.

MEASURED, painted pixels per part per facing, off his real rig:

    dir    head   FACE
    S       24     76
    SE      31     64
    E       26     48
    NE      92      0     <- flagged
    N       92     12
    NW      92      0     <- flagged
    W       26     48
    SW      31     64

NE, N and NW carry a NINETY-TWO PIXEL head against 24-31 on the front views. That
is not a head with its face deleted, it is THE BACK OF A SKULL -- three times the
mass, because on a rear three-quarter you see the whole cranium and no features.
Rendered all eight facings and looked: the face turns toward you through S/SE/E and
away through NE/N/NW, exactly as a rotation should read. THE ART IS RIGHT.

*** WHAT WAS ACTUALLY WRONG, and it is the same mistake in both files: a fixed list
of twelve parts demanded on all eight facings. ***

    parts_are_painted:  for (let q = 1; q <= 12; q++)   // on every direction
    bodyvar:            const PARTS = keys(BAKED.layers.S)   // S IS A FRONT VIEW

bodyvar's is the sharper one: it derives "the parts that must exist" from SOUTH,
the one facing that shows the most face, and then requires that set everywhere. A
back view can never satisfy it.

THE FIX, and neither half is an exemption you can hide behind:

  1. bodyvar now asks the RIGHT QUESTION. Its rule is "a dial must not EMPTY a
     part", and emptying means the rig painted something and the dial removed it.
     So it compares each facing against ITS OWN neutral rig instead of against
     South's part list. This is STRICTER, not looser: it still catches every real
     emptying on every facing, and it no longer reports a part as emptied that was
     never there to empty.

  2. parts_are_painted keeps demanding all twelve parts, with ONE anatomical
     carve-out that HAS TO EARN ITSELF: the FACE may be absent only on a facing
     that PROVES it is a rear view, by carrying a head at least twice the size of
     the front-view head. Delete a face from S, SE, E, W or SW and the gate still
     fails. Delete the back of a skull as well as its face and it fails, because
     the proof evaporates with it. The carve-out cannot be satisfied by removing
     art, which is the only property that makes an exemption safe.

Both are mutation-tested in tools/bohemia_backhead_mutation_check.js.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): edits GATES, never art. It does not open,
  read or write his rig -- what it changes is the QUESTION two rulers ask about it,
  from "are all twelve parts on all eight facings" to "is anything missing that
  anatomy says should be there". Not one painted pixel, joint or bone is touched,
  and the rig it is defending is the same rig it started with.
  built on: BAKED, BAKED.layers
  joints: none named
  parts: 2=face, 1=head

    python3 tools/bohemia_backhead_gate_fix.py
"""
import sys

EDITS = [
    # ------------------------------------------------------- parts are painted
    ('gates/parts_are_painted_gate.js',
     'the face is not required on the back of a head, and the carve-out earns itself',
     """{
  let missing = [];
  for (const d of DIRS) for (let q = 1; q <= 12; q++) {
    const L = B.layers[d][q];
    if (!L || !L.length) missing.push(d + '/' + q);
  }
  ok('no part is empty on any facing' + (missing.length ? ' [' + missing.slice(0, 6).join(', ') + ']' : ''), !missing.length);""",
     """{
  /* *** A REAR VIEW HAS NO FACE, AND THAT IS ANATOMY, NOT MISSING ART. ***
     This demanded all twelve parts on all eight facings and so flagged NE/2 and
     NW/2 forever -- and every handoff since carried it as a debt owed by PAOLO.
     Measured on his rig: NE, N and NW carry a NINETY-TWO pixel head against 24-31
     on the front views. Three times the mass, because a rear three-quarter shows
     the whole cranium and no features. Rendered all eight and looked: the face
     turns toward you through S/SE/E and away through NE/N/NW. The art is right.

     THE CARVE-OUT HAS TO EARN ITSELF, or it is just a hole. The face may be
     absent ONLY where the head PROVES the facing is a rear view, by carrying at
     least twice the front-view head mass. Consequences, all deliberate:
       - delete the face from S/SE/E/W/SW and this still fails (small head there)
       - delete a back-of-skull as well as its face and this fails, because the
         proof disappears with the art
     An exemption that cannot be satisfied by REMOVING art is the only kind that
     is safe to grant. */
  const headOf = d => ((B.layers[d] || {})[1] || []).length;
  const faceOf = d => ((B.layers[d] || {})[2] || []).length;
  const frontHeads = DIRS.filter(d => faceOf(d) > 0).map(headOf).filter(n => n > 0);
  const frontHead = frontHeads.length ? Math.min.apply(null, frontHeads) : 0;
  const isRearView = d => faceOf(d) === 0 && frontHead > 0 && headOf(d) >= frontHead * 2;
  const rear = DIRS.filter(isRearView);

  let missing = [];
  for (const d of DIRS) for (let q = 1; q <= 12; q++) {
    if (q === 2 && isRearView(d)) continue;          /* the back of a head */
    const L = B.layers[d][q];
    if (!L || !L.length) missing.push(d + '/' + q);
  }
  ok('no part is empty on any facing, except the FACE on a proven rear view (' +
     (rear.length ? rear.join(',') + ' — head ' + rear.map(headOf).join('/') +
      'px vs ' + frontHead + 'px on the front views' : 'none') + ')' +
     (missing.length ? ' [' + missing.slice(0, 6).join(', ') + ']' : ''), !missing.length);
  ok('and a rear view is PROVEN by its skull, never assumed — a facing with no ' +
     'face and no big head is missing art and still fails',
     DIRS.every(d => faceOf(d) > 0 || isRearView(d)));"""),

    # -------------------------------------------------------------- body variation
    ('gates/bodyvar_gate.js',
     'EMPTIED means the dial removed something that was there',
     """    const got = Object.keys(L).map(Number).sort((a, b) => a - b);
    if (got.join(',') !== PARTS.join(',')) { structBad.push(name + '/' + d + ': part id set changed'); continue; }
    for (const q of PARTS) {
      const arr = L[q];
      if (!arr.length) { structBad.push(name + '/' + d + ' part ' + q + ': EMPTIED'); continue; }""",
     """    const got = Object.keys(L).map(Number).sort((a, b) => a - b);
    if (got.join(',') !== PARTS.join(',')) { structBad.push(name + '/' + d + ': part id set changed'); continue; }
    for (const q of PARTS) {
      const arr = L[q];
      /* *** EMPTIED MEANS THE DIAL TOOK SOMETHING AWAY. *** PARTS is derived from
         SOUTH -- a FRONT view, the facing that shows the most face -- and was then
         required on every facing, so NE and NW could never pass: they are rear
         three-quarters and carry no face at all (92px of back-of-skull instead of
         24-31px of front head). That reported his correct art as a dial bug.
         Comparing against each facing's OWN neutral rig is STRICTER, not looser:
         every real emptying on every facing is still caught, and a part that was
         never painted there cannot be reported as removed. */
      const base = ((BAKED.layers[d] || {})[q] || []).length;
      if (!arr.length && base) { structBad.push(name + '/' + d + ' part ' + q + ': EMPTIED (rig paints ' + base + 'px here)'); continue; }
      if (!arr.length) continue;                    /* nothing there to empty */"""),
]


def main():
    files, applied, missed = {}, [], []
    for path, label, old, new in EDITS:
        src = files.get(path)
        if src is None:
            src = files[path] = open(path, encoding='utf8').read()
        if new in src:
            applied.append('(already) %s [%s]' % (label, path)); continue
        n = src.count(old)
        if n != 1:
            missed.append('%s [%s] -- expected exactly 1 match, found %d' % (label, path, n)); continue
        files[path] = src.replace(old, new, 1)
        applied.append('%s [%s]' % (label, path))

    for l in applied: print('  ok   ' + l)
    for l in missed:  print('  MISS ' + l)
    if missed:
        print('BACKHEAD GATE FIX: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        return 1
    for path, src in files.items():
        open(path, 'w', encoding='utf8').write(src)
    print('BACKHEAD GATE FIX: rewrote %d gate(s). Mutation-test before believing them.' % len(files))
    return 0


if __name__ == '__main__':
    sys.exit(main())
