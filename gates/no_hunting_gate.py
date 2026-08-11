#!/usr/bin/env python3
"""BOHEMIA — NEVER MAKE HIM HUNT (Paolo 8/11/26, LOCKED)

  "you can't have me test shit out in the run app for real like unless you're gonna
   place me right in front of it every time... I'm not hunting bro like how the fuck am
   I supposed to find what you want me to find"

Law: laws/BOHEMIA_ADDENDUM_NEVER_MAKE_HIM_HUNT_8_11_26.md

WHAT EARNED IT. A turn shipped a real feature INTO the run (correct — that is where a
player meets it) and then told him to reach it by playing the block quest and opening
the phone. That is minutes of navigation to confirm one readout, and if a trigger does
not fire he concludes the work is broken. A hunting instruction turns good work into a
false negative, which is worse than not surfacing it at all.

WHAT THIS GATE HOLDS:

  A. NO POINTER SENDS HIM INTO THE RUN TO CHECK SOMETHING. A handoff or record line that
     tells him where to look may not name the RUN as the route AND chain steps to reach
     the thing. Shipping to the run is fine and encouraged; ROUTING HIM THROUGH IT to
     inspect is the ban.

  B. EVERY SURFACE HE IS POINTED AT IS ONE TAP FROM A HUB. A page nobody links is a page
     he cannot reach, which is the same disease one level up (NAME THE TAB, 7/28).

  C. A SURFACE SHIPPED FOR JUDGEMENT RUNS ITSELF. It must not require a button press to
     show its point — checked by looking for a call that paints on load, not for a
     promise in a comment.

IT IS DELIBERATELY NARROW. It does not ban the word "run", does not ban shipping into
the run, and does not police prose about gameplay. It fires on the specific shape that
cost him time: a LOOK-HERE pointer whose route is the run.

  python3 gates/no_hunting_gate.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

LAW = 'laws/BOHEMIA_ADDENDUM_NEVER_MAKE_HIM_HUNT_8_11_26.md'
HANDOFF = '00_START_HERE_NEXT_SESSION.md'
HUBS = ['slices/BOHEMIA_LIFE_CURRENT.html', 'slices/BOHEMIA_ART_CURRENT.html',
        'slices/BOHEMIA_ALPHA_0_9.html']

passed = 0
fails = []
notes = []


def ok(name, cond):
    global passed
    if cond:
        passed += 1
    else:
        fails.append(name)
        print('  FAIL: ' + name)


ok('the law is on disk — a gate whose law was deleted is enforcing nothing',
   os.path.exists(LAW))

# ---------------------------------------------------------------------------
# A. no pointer routes him through the run to inspect something.
#
# THE SHAPE, precisely: a line that is telling him WHERE TO LOOK (it says Tab:, or
# "look at", or "check"), that names the RUN as the place, AND chains a step to get
# there (an arrow, or a play/walk/open verb). All three, or it does not fire — the
# handoff is full of legitimate prose about the run and none of it should trip this.
# ---------------------------------------------------------------------------
POINTER = re.compile(r'\b(tab\s*:|look at|go look|check (?:it |this )?out|judge this)', re.I)
RUNROUTE = re.compile(r'\brun\b\s*(tab|app|slice)?\s*(->|→|:)', re.I)
STEPS = re.compile(r'(->|→).*(->|→)|\b(play|walk|open the phone|trigger|navigate)\b', re.I)


def hunting_lines(path):
    if not os.path.exists(path):
        return []
    out = []
    for i, line in enumerate(open(path, encoding='utf-8', errors='ignore'), 1):
        if not POINTER.search(line):
            continue
        if not RUNROUTE.search(line):
            continue
        if not STEPS.search(line):
            continue
        # a line that explicitly cites this law is talking ABOUT the rule, not breaking it
        if 'NEVER_MAKE_HIM_HUNT' in line or 'never send him into the run' in line.lower():
            continue
        out.append('%s:%d: %s' % (path, i, line.strip()[:150]))
    return out


offenders = hunting_lines(HANDOFF)
for r, _d, fs_ in os.walk('records'):
    for f in fs_:
        if f.endswith('.md'):
            offenders += hunting_lines(os.path.join(r, f))

ok('NO POINTER SENDS HIM INTO THE RUN TO CHECK SOMETHING%s'
   % ('' if not offenders else ' — ' + ' | '.join(offenders[:3])),
   not offenders)

# a self-test: the exact sentence that earned this law must be caught
PROBE = 'Tab: RUN -> play the block quest -> the phone. 27/32 systems now integrated.'
tmp = os.path.join(os.environ.get('TMPDIR', '/tmp'), '_nohunt_probe.md')
open(tmp, 'w', encoding='utf-8').write(PROBE + '\n')
caught = hunting_lines(tmp)
os.unlink(tmp)
ok('the checker actually catches the sentence that earned the law (a rule nothing can '
   'detect is a comment)', len(caught) == 1)

# ---------------------------------------------------------------------------
# B + C. every surface he is pointed at is one tap from a hub, and runs itself.
# ---------------------------------------------------------------------------
hub_text = ''
for h in HUBS:
    if os.path.exists(h):
        hub_text += open(h, encoding='utf-8', errors='ignore').read()

# NOT VACUOUS. The first cut looked for BOHEMIA_*.html filenames inside the handoff,
# found zero, and passed — an empty check that reads exactly like a green one, which is
# the trap this repo keeps re-learning. So the claim is turned around: every page a HUB
# CARD links must actually exist. A hub full of dead links is the same disease as a page
# nobody links, and the set can never be empty because the hubs always have cards.
linked = set()
for h in HUBS:
    if os.path.exists(h):
        for m in re.finditer(r'href="(BOHEMIA_[A-Za-z0-9_]+\.html)"', open(h, encoding='utf-8').read()):
            linked.add(m.group(1))
dead = sorted(p for p in linked if not os.path.exists('slices/' + p))
ok('the hubs have cards to check at all (an empty sweep is not a pass)', len(linked) >= 3)
ok('every page a hub card links ACTUALLY EXISTS — a dead card is a thing he cannot reach%s'
   % ('' if not dead else ' — dead: ' + ', '.join(dead[:4])),
   not dead)
notes.append('%d pages linked from the hubs, %d dead' % (len(linked), len(dead)))

# the surface this law produced must itself obey it
SURF = 'slices/BOHEMIA_WHAT_IT_COST_8_11_26.html'
if os.path.exists(SURF):
    src = open(SURF, encoding='utf-8').read()
    ok('the surface this law produced is linked from a hub', os.path.basename(SURF) in hub_text)
    # it paints on load: the render function is CALLED at top level, not only bound to a button
    body = src.split('<script>')[-1]
    ok('...and it RUNS ITSELF on load rather than waiting for a tap',
       re.search(r'^\s*paint\(\);', body, re.M) is not None)
    # the endings live in the baked DATA blob, not in static markup — count them there
    m = re.search(r'var DATA = (\{.*?\});', src, re.S)
    if m:
        import json as _j
        try:
            d = _j.loads(m.group(1))
            notes.append('WHAT IT COST YOU: %d quests, %d endings, all on load'
                         % (len(d['quests']), sum(len(q['endings']) for q in d['quests'])))
        except Exception:
            pass

for n in notes:
    print('  NOTE  ' + n)
print('=== NO HUNTING GATE: %d passed, %d failed ===' % (passed, len(fails)))
sys.exit(1 if fails else 0)
