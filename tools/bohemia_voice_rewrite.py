#!/usr/bin/env python3
"""BOHEMIA VOICE REWRITE -- one scene, both ways, built by diffing the file.

WHY (Paolo 8/26, the WORDS lane brief): "one scene rewritten both ways, side by
side, so the difference is visible instead of described."

THE ONE DESIGN DECISION: the BEFORE side is read out of git, never retyped.
A hand-copied 'before' column is a claim about what the file used to say, and
the first time somebody edits one side and not the other it becomes a lie. This
reads the pre-pass blob straight out of the commit and pairs it positionally
against the file on disk, so the comparison cannot drift from the truth.

REUSE CHECK: no new graphics cooked. Reads quests/bq/*.bq and git, and hands its
output to tools/bohemia_words_book.py, which already owns the WORDS tab bake.

  python3 tools/bohemia_voice_rewrite.py

Writes: records/BOHEMIA_VOICE_REWRITE_8_26_26.json  (consumed by the WORDS tab)

Card: laws/BOHEMIA_VOICE_CARD_8_26_26.md
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUEST = 'quests/bq/S01_THE_METER_READER.bq'
OUT = os.path.join(ROOT, 'records', 'BOHEMIA_VOICE_REWRITE_8_26_26.json')

LINE_RE = re.compile(r'^\s*@(SAY|OPT|LOG)\s+(.*?)\s*$')
TAG_RE = re.compile(r'\s+#[a-z_]+\s*$')
TALK_RE = re.compile(r'^@TALK\s+(\S+)(?:\s+speaker=(\S+))?')
STAGE_RE = re.compile(r'^@STAGE\s+(\d+)')

# WHICH RULE EACH CHANGE IS AN INSTANCE OF. Hand-assigned, because "which rule
# did this line need" is a judgement and a regex guessing at it would be exactly
# the fake precision the brief warns about. Keyed by the FIRST WORDS of the new
# line so a later edit to the tail does not break the mapping.
RULES = {
    'Nine at night. Every': [1, 4, 5],
    'I tested it myself': [1, 2, 4],
    'So walk it back for me': [1, 3, 5],
    "I'll walk it.": [1],
    'Why not you?': [1, 4],
    'Because everybody on this block': [1, 2, 6],
    "Whoever's drinking that current": [1, 2],
    "Who doesn't like being": [1],
    'If I knew, I': [1, 5, 6],
    'Follow the split.': [1, 4, 6],
    'Yeah. Fair.': [1, 2, 4],
    "Fine. I'll look.": [1],
    'Good. Splits somewhere': [1, 4, 5],
    'Easy. Easy, easy.': [1, 3, 4],
    "I don't steal it.": [1, 4, 6],
    'So. Put it back and go home': [1, 3, 4],
    'Whose current is it?': [1],
    "Huh. That's the one question": [1, 3, 4],
    'It runs down. Not up.': [1, 4],
    'I told you nothing.': [1, 6],
    'Cut it. Let them see.': [1],
    "Light's back.": [1, 2],
    "You didn't make a show": [1, 2, 6],
    'You brought it to us.': [1, 2],
    'We patch it in daylight.': [1, 2, 5],
    'You cut it in front of everybody': [1, 5],
    'They felt that upstream.': [1, 2, 6],
    'Nine at night, every night,': [1, 5],
    'Line tests clean.': [1],
    'Put the current back myself.': [1],
    'Handed the tap to the trades.': [1],
    'Cut the skim line in front': [1, 5],
    'Left it alone.': [1],
}

RULE_NAMES = {
    1: 'THEY TALK LIKE THEY ARE IN A HURRY',
    2: 'CUT THE LAST SENTENCE',
    3: 'SOMEBODY HAS TO ASK, SOMEBODY HAS TO FUMBLE',
    4: 'NINE WORDS, THEN TWO',
    5: 'NAME THE ONE THING ONLY THIS PERSON WOULD NAME',
    6: 'THE LINE IS NOT THE POINT',
}


def harvest(text):
    """Every player-facing line in a .bq, in file order, with its node."""
    out, node, speaker = [], None, None
    for raw in text.split('\n'):
        g = STAGE_RE.match(raw.strip())
        if g:
            # a @LOG belongs to its stage, not to a talk node. Labelling it
            # 'null' in the tab is the kind of small lie that makes a page feel
            # unfinished, and he reads the page, not the parser.
            node, speaker = 'stage ' + g.group(1), None
            continue
        t = TALK_RE.match(raw.strip())
        if t:
            node, speaker = t.group(1), t.group(2) or speaker
            continue
        m = LINE_RE.match(raw)
        if not m:
            continue
        kind, body = m.group(1), m.group(2)
        body = re.sub(r'\s+\[gate:.*$', '', body)
        body = TAG_RE.sub('', body).strip()
        if kind == 'OPT':
            q = re.match(r'^"(.*)"', body)
            body = q.group(1) if q else body
        out.append({'kind': kind.lower(), 'node': node,
                    'speaker': 'PLAYER' if kind == 'OPT' else (speaker or 'JOURNAL'),
                    'text': body})
    return out


def git_show(ref, path):
    return subprocess.check_output(['git', 'show', '%s:%s' % (ref, path)],
                                   cwd=ROOT).decode('utf-8')


def main():
    ref = sys.argv[1] if len(sys.argv) > 1 else 'HEAD'
    # PIN IT. 'HEAD' is true for about one commit. Resolving to the sha means a
    # re-run next month rebuilds the identical comparison instead of an empty one.
    try:
        ref = subprocess.check_output(['git', 'rev-parse', ref], cwd=ROOT).decode().strip()
    except subprocess.CalledProcessError:
        sys.exit('cannot resolve ref ' + ref)
    try:
        before = harvest(git_show(ref, QUEST))
    except subprocess.CalledProcessError:
        sys.exit('cannot read %s:%s -- pass the pre-pass commit as argv[1]' % (ref, QUEST))
    with open(os.path.join(ROOT, QUEST), 'r', encoding='utf-8') as f:
        after = harvest(f.read())

    if len(before) != len(after):
        sys.exit('THE STRUCTURE MOVED: %d lines before, %d after. A voice pass changes '
                 'WORDS ONLY -- same nodes, same beats, same options. Fix the pass.'
                 % (len(before), len(after)))

    pairs, changed = [], 0
    for b, a in zip(before, after):
        if b['kind'] != a['kind'] or b['node'] != a['node']:
            sys.exit('THE STRUCTURE MOVED at node %s / %s' % (b['node'], a['node']))
        rules = []
        for key, rs in RULES.items():
            if a['text'].startswith(key):
                rules = rs
                break
        same = (b['text'] == a['text'])
        if not same:
            changed += 1
        pairs.append({'kind': a['kind'], 'node': a['node'], 'speaker': a['speaker'],
                      'before': b['text'], 'after': a['text'],
                      'changed': not same, 'rules': rules})

    unruled = [p for p in pairs if p['changed'] and not p['rules']]
    if unruled:
        sys.exit('%d rewritten lines carry no rule: %s'
                 % (len(unruled), unruled[0]['after'][:50]))

    payload = {
        '_meta': {
            'what': 'One scene written both ways. The BEFORE side is read out of git, '
                    'never retyped, so the comparison cannot drift.',
            'why': 'The WORDS lane brief (Paolo 8/26): "one scene rewritten both ways, '
                   'side by side, so the difference is visible instead of described."',
            'generator': 'tools/bohemia_voice_rewrite.py',
            'quest': QUEST, 'before_ref': ref,
            'lines': len(pairs), 'changed': changed,
            'card': 'laws/BOHEMIA_VOICE_CARD_8_26_26.md',
            'diagnosis': 'records/BOHEMIA_VOICE_DIAGNOSIS_8_26_26.md',
            'draft': True,
            'note': 'Both columns are drafts. Nothing here is put to him for approval; '
                    'every line is editable in the WORDS tab and the words are his.',
        },
        'rules': RULE_NAMES,
        'pairs': pairs,
    }
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=1, ensure_ascii=False)
    print('VOICE REWRITE: %d lines, %d rewritten, structure identical' % (len(pairs), changed))
    print('  -> ' + os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
