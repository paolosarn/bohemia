#!/usr/bin/env python3
"""BOHEMIA -- a new song's card goes to VOTE only after EYES AND EARS says yes (SOUNDS, 10/18/26, rule 119(c)).

Rule 119(c), Paolo 10/18: 'Before VOTE the song plays beside two canon songs and EYES AND EARS writes one line: same
game? analog horror? If no, it does not go to VOTE.' SOUNDS never writes that line (verification is never
self-attestation), so the card waits inside the song's own file (slices/vote/songs/<id>.json, 'card') and this tool is
the only door into the tab:

  python3 tools/bohemia_sounds_register_song.py slices/vote/songs/the_rosary_on_channel_3.json          (dry run)
  python3 tools/bohemia_sounds_register_song.py slices/vote/songs/the_rosary_on_channel_3.json --write

It reads VAMILY.md for EYES' line, which names the song and says both answers, for example
  'EYES 10/18 eyes-xyz: THE ROSARY ON CHANNEL 3 beside REPO MAN and THE MARKER ON THE DOOR: same game YES, analog
   horror YES (the reasons)'
and refuses unless BOTH say yes and neither says no or not. Then it appends the card to
records/target/BOHEMIA_VOTE_REGISTRY.json with the sha of the commit that last touched the song's file (rule 118b: the
card id goes on SOUNDS' row in the same push). It never edits anybody else's card.
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json')
VAM = os.path.join(ROOT, 'VAMILY.md')
ANS = r'[\s:=\-]*(yes|no|not)\b'


def eyes_line(name, card_id):
    """the newest EYES line naming this song (by name or card id), and its two answers"""
    hit = None
    for ln in open(VAM, encoding='utf-8').read().split('\n'):
        for piece in re.split(r'\*\*\*', ln):
            if 'EYES' not in piece or (name not in piece and card_id not in piece):
                continue
            g = re.search(r'same game' + ANS, piece, re.I)
            h = re.search(r'analog horror' + ANS, piece, re.I)
            if g and h:
                hit = (piece.strip(), g.group(1).lower(), h.group(1).lower())
    return hit


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    write = '--write' in sys.argv
    songf = os.path.join(ROOT, args[0] if args else 'slices/vote/songs/the_rosary_on_channel_3.json')
    song = json.load(open(songf, encoding='utf-8'))
    card = dict(song['card'])
    hit = eyes_line(song['name'], card['id'])
    if not hit:
        print('NOT REGISTERED: no EYES AND EARS line on the board names ' + song['name'] + ' with both answers (rule 119c).')
        return 2
    line, game, horror = hit
    if game != 'yes' or horror != 'yes':
        print('NOT REGISTERED: EYES said same game ' + game.upper() + ', analog horror ' + horror.upper() + ' -> it does not go to VOTE (rule 119c).')
        print('  ' + line[:300])
        return 3
    raw = open(REG, encoding='utf-8').read()
    reg = json.loads(raw)
    if any(i.get('id') == card['id'] for i in reg['items']) or any(v.get('id') == card['id'] for v in reg['verdicts']):
        print('ALREADY THERE: ' + card['id'])
        return 0
    rel = os.path.relpath(songf, ROOT)
    sha = subprocess.run(['git', '-C', ROOT, 'log', '-1', '--format=%h', '--', rel], capture_output=True, text=True).stdout.strip()
    card['sha'] = sha or card.get('sha', '')
    order = ['id', 'kind', 'lane', 'sha', 'made', 'title', 'why', 'options', 'show', 'draft']
    card = {k: card[k] for k in order if k in card}
    print('EYES: ' + line[:300])
    if not write:
        print('DRY RUN: would register ' + card['id'] + ' at ' + card['sha'] + ' (pass --write)')
        return 0
    reg['items'].append(card)
    indent = 1 if raw.startswith('{\n "') else 2
    open(REG, 'w', encoding='utf-8').write(json.dumps(reg, indent=indent, ensure_ascii=False) + ('\n' if raw.endswith('\n') else ''))
    print('REGISTERED ' + card['id'] + ' at ' + card['sha'] + '. Write the card id on SOUNDS\' row in this same push (rule 118b).')
    return 0


if __name__ == '__main__':
    sys.exit(main())
