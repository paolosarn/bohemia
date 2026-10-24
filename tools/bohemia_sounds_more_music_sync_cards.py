#!/usr/bin/env python3
"""BOHEMIA -- MORE MUSIC: keep this lane's own registered song cards equal to the card in each song's file (SOUNDS 10/24/26,
row [more music, on the one beat]). A card already in the VOTE tab whose song file changed (its words, never its music:
the song lock holds the row) gets the file's card and the sha of the commit that last touched the file. It touches only
cards whose id is a MORE MUSIC song's and that are already registered; it never adds a card (that is
tools/bohemia_sounds_register_song.py's door) and never edits anybody else's.

  python3 tools/bohemia_sounds_more_music_sync_cards.py [--write]
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json')
SONGS = ['the_meter_reader', 'the_substation_hums_alone', 'the_lobby_piano_still_plays', 'the_cashier_s_cage',
         'the_mall_after_closing', 'the_last_bus_to_henderson']
ORDER = ['id', 'kind', 'lane', 'sha', 'made', 'title', 'why', 'options', 'show', 'draft']


def main():
    raw = open(REG, encoding='utf-8').read()
    reg = json.loads(raw)
    did = []
    for s in SONGS:
        rel = 'slices/vote/songs/%s.json' % s
        card = json.load(open(os.path.join(ROOT, rel), encoding='utf-8')).get('card')
        if not card:
            continue
        i = next((k for k, it in enumerate(reg['items']) if it.get('id') == card['id']), None)
        if i is None:
            continue
        sha = subprocess.run(['git', '-C', ROOT, 'log', '-1', '--format=%h', '--', rel], capture_output=True, text=True).stdout.strip()
        new = dict(card, sha=sha or reg['items'][i].get('sha', ''))
        new = {k: new[k] for k in ORDER if k in new}
        if new != reg['items'][i]:
            reg['items'][i] = new
            did.append(card['id'] + ' @ ' + new['sha'])
    if '--write' in sys.argv and did:
        indent = 1 if raw.startswith('{\n "') else 2
        open(REG, 'w', encoding='utf-8').write(json.dumps(reg, indent=indent, ensure_ascii=False) + ('\n' if raw.endswith('\n') else ''))
    print(('SYNCED ' if '--write' in sys.argv else 'WOULD SYNC ') + str(len(did)) + (': ' + ', '.join(did) if did else ''))


if __name__ == '__main__':
    main()
