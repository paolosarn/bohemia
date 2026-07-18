#!/usr/bin/env python3
"""BOHEMIA QUESTBOOK GATE (7/17/26) — the BATCH LAW's teeth.

The format law (v2, locked 7/16) and the batch law both ship grep-specified
checks that until today lived in prose. A LAW WITHOUT A MACHINE GATE IS NOT
ENFORCED, so:

HARD CHECKS (fail the gate) — every v2-era mined file (#%d and up):
  - exactly 10 craft points        grep -cE '^W[0-9]+\\.'
  - >0 option lines                grep -cE '^> '  (the conversation machine)
  - CAST + CONVERSATIONS + BRANCH MAP sections present
  - branch COUNT stated in section 4
  - END marker (*END #N*) present and matches the file number
  - every fenced @TALK block parses through the real bohemia_bq.js with zero
    unrecognized lines (a port that cannot be pasted into the lab is a wish)

CORPUS CHECKS (fail the gate) — the whole questbook:
  - no number gaps, no collisions (carry gate also audits; two locks, one law)

INFO (reported, never fails) — the backfill ledger:
  - which files below the v2 era still lack option lines (the backfill queue)
  - how many legacy files lack an END marker (the *END #N* convention starts
    around #125; the pile before that just stops. Recorded, not punished.)

Run: python3 gates/questbook_gate.py  (cwd-independent, repo-aware)
"""
import os
import re
import subprocess
import sys

V2_ERA = 139   # first file cooked under this gate. 126-138 predate it: 126 is
               # the exemplar, 127-138 are the dead chat's fresh mines and sit
               # in the backfill queue (reported below, never failed here).

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
QB = os.path.join(ROOT, 'questbook')

p = f = 0
def ok(name, cond):
    global p, f
    if cond: p += 1
    else:
        f += 1
        print('  > FAIL ' + name)


def bq_parse_check(path, text):
    """Every fenced block containing @TALK must parse clean in the real parser."""
    blocks = [b for b in re.findall(r'```\n?(.*?)```', text, re.S) if '@TALK' in b]
    if not blocks:
        return None  # caller decides whether absence is legal
    import json
    js = (
        "const BQ=require(%r);let raw='';process.stdin.on('data',d=>raw+=d);"
        "process.stdin.on('end',()=>{const blocks=JSON.parse(raw);let bad=0;"
        "for(const b of blocks){const q=BQ.parse(b);"
        "for(const w of q.warnings){const m=w.msg||String(w);"
        "if(/unrecognized/.test(m)){bad++;console.error(m);}}}"
        "console.log(JSON.stringify({blocks:blocks.length,bad}));});"
    ) % os.path.join(ROOT, 'engine', 'bohemia_bq.js')
    r = subprocess.run(['node', '-e', js], input=json.dumps(blocks),
                       capture_output=True, text=True)
    if r.returncode != 0:
        return {'blocks': len(blocks), 'bad': -1, 'err': r.stderr[:200]}
    import json as j
    out = j.loads(r.stdout.strip().splitlines()[-1])
    out['err'] = r.stderr[:200]
    return out


files = {}
for fn in os.listdir(QB):
    m = re.match(r'BOHEMIA_QUESTBOOK_(\d+)_.*\.md$', fn)
    if m:
        files.setdefault(int(m.group(1)), []).append(fn)

# corpus: numbers audit
dupes = {n: v for n, v in files.items() if len(v) > 1}
ok('questbook: no number collisions', not dupes)
if dupes: print('    collisions:', dupes)
nums = sorted(files)
gaps = [i for i in range(nums[0], nums[-1] + 1) if i not in files]
ok('questbook: no gaps in %d-%d' % (nums[0], nums[-1]), not gaps)
if gaps: print('    gaps:', gaps)

backfill = []
no_end = []
full_machine = []   # THE OFFICIAL >90 COUNTER (Paolo ruling 7/17: full machine
                    # only — laws/BOHEMIA_ADDENDUM_QUESTBOOK_FULL_MACHINE_TARGET_7_17_26.md)
zero_dialogue = {99, 110, 114}   # zero-dialogue-by-design registry: never "fix".
                                 # RULED 7/17 (Paolo): they COUNT toward the 90 —
                                 # "that's okay if they genuinely have no talking."
                                 # Genuine silence satisfies the conversation-machine
                                 # requirement; every other element still required.

# SYSTEM/DESIGN STUDIES — full-machine teardowns of a game's SYSTEM / MODEL /
# ENGINE / DESIGN-PHILOSOPHY, NOT individual-quest deep-dives. Paolo ruled 7/17
# (verbatim: "WE NEED 150 INDIVIDUAL QUESTS BRO WITH THE WHOLE ENCHILADA"): the
# 150 target counts INDIVIDUAL QUESTS ONLY (the Bloody Baron kind). These files
# are still VALID full-machine teardowns (they feed the PORTS master) but do NOT
# count toward the 150 (which feeds CONVERSATIONS/CRAFT: how quests get written).
# Honest classification by title/subject; BORDERLINE calls noted; Paolo-auditable
# (flip any number to reclassify). Policy: a main-story ARC or character/companion
# ARC IS an individual quest (FFX pilgrimage, Ranni, Arthur Morgan, Shadowheart);
# a structural/mechanical STUDY is not, even riding a specific game's story.
# See laws/BOHEMIA_ADDENDUM_QUESTBOOK_FULL_MACHINE_TARGET_7_17_26.md.
system_studies = {
    5,      # Disco Elysium — the whole-game quest MODEL (#112/#97/#62 are Disco QUESTS)
    6,      # Mass Effect 2 — the Suicide Mission + LOYALTY SYSTEM (#137 is the QUEST)
    8,      # Kingdom Come — the immersive-sim quest MODEL (#106 is a KCD QUEST)
    12,     # Planescape — the central-question whole-game study (#120 Deionarra is the QUEST)
    13,     # Yakuza — the substory MODEL
    114,    # Yakuza 0 — the substory ENGINE (a system study; also zero-dialogue-by-design)
    15,     # Divinity — Fort Joy escape + the SURFACE SYSTEM
    17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,  # reactivity/deduction/no-marker/etc. engines
    32,33,34,35,  # KOTOR/BioShock/SOMA/SH2 twists + whole-game studies (#115/#118 are the QUESTS)
    36,37,38,39,  # GLaDOS voice / Morrowind directions / Fallout CRPG / Bloodlines system (#74/#99 QUESTS)
    41,42,43,44,45,46,47,48,49,50,51,52,  # stress/origin/party/storyteller/emergence/dynasty/nemesis/etc.
    53,54,55,56,57,58,59,60,61,  # Inscryption/Golden-Idol/Kenshi/Qud/DDLC/Hellblade/Celeste/ItB/M&B
    65,66,67,69,  # Citizen Sleeper / Sunless Sea / Phantasy Star III / DQ5 — survival & generational-saga STRUCTURE studies
    85,88,89,90,92,93,  # STALKER/Zomboid/Death Stranding/Subnautica/Bloodborne/Rust — sandbox/system studies
                        # (BORDERLINE, sandbox-leaning; Paolo may flip 85/92 toward quest)
}
# INDIVIDUAL QUESTS held as such despite a systemy title (main-story / character arcs):
# 40 Sinnerman, 62 Phasmid ending, 63 Judy arc, 64 MotB finale, 68 FFX pilgrimage,
# 70 Hearts of Stone, 71 Ranni, 72 Dead Money, 73 Arthur Morgan, 74 Morrowind main,
# 75 Dark Brotherhood, 76 Shadowheart, 77 Phantom Liberty, 78 Tranquility Lane,
# 79 Come Fly With Me, 80 FF12, 81 FF Tactics, 82 Vagrant Story, 83 Ultima VII,
# 84 Dragon's Dogma, 86 Arcanum, 87 Outward, 91 Dark Souls, 94 EVE, 95-152.
for n in nums:
    fn = files[n][0]
    text = open(os.path.join(QB, fn), encoding='utf-8').read()
    lines = text.split('\n')
    wc = sum(1 for l in lines if re.match(r'^W[0-9]+\.', l))
    # OPTION LINES MATCH THE LAW, NOT COLUMN 0: the format law's own node-tree
    # template indents '> ' inside the node. The 7/16 backfills followed the law;
    # this gate's original '^> ' anchor hid 49 of them (found 7/17, law-vs-gate
    # contradiction, mechanical fix: the law wins).
    optc = sum(1 for l in lines if re.match(r'^\s*> ', l))
    if ('*END #%d*' % n) not in text:
        no_end.append(n)
    # Files 01-16 run 11-13 craft points BY DESIGN (early format, banked lesson:
    # not damage, do not fix). The counter honors that; everything after is 10 exact.
    w_ok = (wc == 10) or (n <= 16 and 11 <= wc <= 13)
    machine_ok = optc > 0 or n in zero_dialogue
    if (w_ok and machine_ok
            and 'CAST + WHAT EACH ONE WANTS' in text
            and 'THE BRANCH MAP' in text):
        full_machine.append(n)

    if n >= V2_ERA:
        ok('#%d: exactly 10 craft points (has %d)' % (n, wc), wc == 10)
        ok('#%d: conversation machine has option lines (%d)' % (n, optc), optc > 0)
        for sec in ('CAST + WHAT EACH ONE WANTS', 'THE CONVERSATIONS', 'THE BRANCH MAP'):
            ok('#%d: section present: %s' % (n, sec), sec in text)
        ok('#%d: branch COUNT stated' % n,
           re.search(r'\*\*COUNT[:\s]', text) is not None)
        ok('#%d: END marker matches number' % n, ('*END #%d*' % n) in text)
        bq = bq_parse_check(os.path.join(QB, fn), text)
        ok('#%d: ships @TALK trees in the ports' % n, bq is not None)
        if bq is not None:
            ok('#%d: all %d .bq blocks parse clean (lab-pasteable)' % (n, bq['blocks']),
               bq['bad'] == 0)
            if bq['bad']: print('    ' + bq.get('err', ''))
    elif optc == 0 and n not in zero_dialogue:
        backfill.append(n)

# THE ARCHIVE NEVER FALLS BEHIND (7/17): the searchable archive must contain
# an entry for the corpus's newest file. The dead chat's regenerator was lost
# and the archive silently froze at #138 for three batches; this line ends that.
arch = open(os.path.join(QB, 'BOHEMIA_QUESTBOOK_ARCHIVE.html'), encoding='utf-8').read()
ok('archive carries the newest file (#%d)' % nums[-1], ('[%d,"' % nums[-1]) in arch)

# TARGET RAISED 7/17 EVENING (Paolo, FNV-calibrated): "we need 150." Then
# REFINED 7/17 late: "WE NEED 150 INDIVIDUAL QUESTS BRO WITH THE WHOLE
# ENCHILADA" — the 150 counts INDIVIDUAL QUESTS ONLY; system studies excluded.
individual_quests = [n for n in full_machine if n not in system_studies]
system_full = [n for n in full_machine if n in system_studies]
print('\n  === THE OFFICIAL TARGET (Paolo 7/17: individual quests only) ===')
print('  INDIVIDUAL-QUEST COUNT: %d of 150 (the Bloody Baron kind: a specific '
      'quest/arc, full machine)' % len(individual_quests))
print('  ' + ','.join(str(x) for x in individual_quests))
print('\n  full-machine SYSTEM/DESIGN studies (valid teardowns, feed PORTS master, '
      'do NOT count toward 150): %d' % len(system_full))
print('  ' + ','.join(str(x) for x in system_full))
print('\n  FULL-MACHINE COUNT (all valid teardowns, quests + systems): %d'
      % len(full_machine))
print('  zero-dialogue-by-design, COUNTED per Paolo ruling 7/17 (genuine silence '
      'satisfies the machine): ' + ','.join(str(x) for x in sorted(zero_dialogue)))
print('\n  backfill queue (pre-v2-era files with no conversation machine yet): %d files'
      % len(backfill))
print('  ' + ','.join(str(x) for x in backfill))
print('  legacy files without an *END #N* marker: %d (convention starts ~#125; recorded, not punished)'
      % len([x for x in no_end if x < V2_ERA]))
print('\n=== QUESTBOOK GATE: %d passed, %d failed ===' % (p, f))
sys.exit(1 if f else 0)
