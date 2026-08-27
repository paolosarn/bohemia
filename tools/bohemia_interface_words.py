#!/usr/bin/env python3
"""BOHEMIA INTERFACE WORDS -- every word a stranger reads BEFORE anybody speaks.

WHY THIS EXISTS. ALWAYS MAKE AN ATTEMPT (Paolo 8/11, LOCKED) names what counts
as player-facing text, and the list is not only dialogue:

    "UI copy, tooltips, notifications, failure messages"

records/BOHEMIA_WORDS_BOOK.json harvests 2,442 lines from 36 sources and every
one of them is a quest, a scene, or a bark. ZERO are interface. So the wake
card, the objectives, the phone, the buttons and the failure text -- the words
a stranger reads BEFORE they ever meet a person -- were never read as writing,
never counted against the voice card, and HE CANNOT EDIT ANY OF THEM, which is
the half of the 8/11 law that makes the rest of it real.

HOW IT HARVESTS, AND WHY NOT BY GREP. Grepping the source for quoted strings
returns 368 hits in the city world alone, most of them dev labels, name banks
and debug text. A string is player-facing if THE GAME PAINTED IT ON A PHONE, so
this drives the built demo down its own path (the same path demo_build_gate
uses) and reads the rendered text nodes. If a stranger could not have seen it,
it is not in here.

REUSE CHECK: no new graphics cooked. Drives slices/BOHEMIA_DEMO.html with the
playwright already installed for the gates, and hands its output to
tools/bohemia_words_book.py, which owns the WORDS tab bake.

  python3 tools/bohemia_interface_words.py

Writes: records/BOHEMIA_INTERFACE_WORDS.json

Law:  laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md
Card: laws/BOHEMIA_VOICE_CARD_8_26_26.md
Gate: gates/voice_gate.js
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records', 'BOHEMIA_INTERFACE_WORDS.json')
DRIVER = os.path.join(ROOT, 'tools', 'bohemia_interface_words_driver.js')


def main():
    if not os.path.exists(DRIVER):
        sys.exit('missing driver: ' + DRIVER)
    try:
        raw = subprocess.check_output(['node', DRIVER], cwd=ROOT, timeout=600)
    except subprocess.CalledProcessError as e:
        sys.exit('driver failed:\n' + e.output.decode('utf-8', 'replace')[-3000:])
    data = json.loads(raw.decode('utf-8'))

    seen, rows = set(), []
    for r in data['strings']:
        t = ' '.join(r['text'].split())
        if not t or t in seen:
            continue
        seen.add(t)
        rows.add if False else rows.append({
            'id': 'ui#' + r['where'] + '#' + str(len(rows)),
            'text': t, 'where': r['where'], 'screen': r['screen'],
            'draft': True,
        })

    payload = {
        '_meta': {
            'what': 'Every word the built demo actually paints that is NOT dialogue.',
            'why': 'ALWAYS MAKE AN ATTEMPT (8/11) names "UI copy, tooltips, '
                   'notifications, failure messages" as player-facing text he must be '
                   'able to edit. The words book held zero of it.',
            'how': 'Driven, not grepped: the built demo is walked down its own path '
                   'and the RENDERED text nodes are read. If a stranger could not have '
                   'seen it, it is not in here.',
            'generator': 'tools/bohemia_interface_words.py',
            'surface': 'slices/BOHEMIA_DEMO.html',
            'screens': data['screens'],
            'strings': len(rows),
            'draft': True,
        },
        'lines': rows,
    }
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=1, ensure_ascii=False)
    print('INTERFACE WORDS: %d strings the demo actually paints, across %d screens'
          % (len(rows), len(data['screens'])))
    for s in data['screens']:
        print('   %-22s %d' % (s['name'], s['n']))
    print('  -> ' + os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
