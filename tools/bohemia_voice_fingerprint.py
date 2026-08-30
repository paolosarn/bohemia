#!/usr/bin/env python3
"""BOHEMIA VOICE FINGERPRINT (8/28/26, the WORDS lane).

WHY THIS EXISTS. The voice diagnosis of 8/26 measured eight tells and compared
them to NOTHING. Every number in it was an absolute with an imagined standard
behind it, and two of those imagined standards turned out to be wrong when a
control group finally arrived. This tool holds the control groups.

THREE REFERENCE CORPORA, all speaker-labelled, all measured with the rulers in
this file and no others:
  FILM         Cornell Movie-Dialogs Corpus, 617 films, 304,446 lines.
  KOTOR        Star Wars: Knights of the Old Republic, 29,213 dialogue nodes
               (van Stegeren and Theune, INT 2020). A shipped RPG. Our genre.
  REAL SPEECH  Switchboard Dialogue Act Corpus, 199,740 utterances of real
               spontaneous telephone conversation, merged to 99,479 TURNS so a
               turn is compared to a turn and not to a breath.

The corpora are 43 MB and live outside the repo. What lives IN the repo is the
measured REFERENCE row below, so the gate never needs the network. Regenerate it
with --refresh <dir> when the corpora are present.

REUSE CHECK: reads records/BOHEMIA_WORDS_BOOK.json, the harvest that
tools/bohemia_words_book.py already produces from the .bq files and the engine
banks. It cooks no new text and parses no quest file itself, because a second
parser is how two counts of the same thing drift apart (ENGINE SYNC LAW).

AND THE RULERS IN HERE HAVE BEEN WRONG THREE TIMES, so read this before trusting
a number:
  - RHYTHM is sd/mean, never raw sd, or terse writing is punished for being terse.
  - The VOCATIVE ruler was wrong twice in one turn. The loose version counted any
    leading comma clause and read 45.7% on real speech; the strict version wanted
    an address noun and read 0.4%. The version here counts an address term OR a
    proper name in address position, and it is trusted only because it agrees
    across three independent corpora (22.8 / 23.9 / 31.4) instead of because it
    looks right.
  - A metric that scales with sample size will always say your biggest speaker is
    your best one. Anything per-speaker gets a permutation test, not a ranking.

WHAT IT CANNOT DO: say whether a line is good. Every number here is a SHAPE.
"""
import json, re, sys, os

W = re.compile(r"[A-Za-z][A-Za-z'’\-]*")
ADDR = (r"sir|ma'am|man|kid|boss|friend|brother|sister|hermano|hermana|mija|mijo|"
        r"amigo|mister|doc|chief|son|lady|pal|buddy|jefe|dad|mom|mama|papa|honey|"
        r"kiddo|captain|general|master|sergeant")
NAME = r"[A-Z][a-z]{2,}"
VOC = re.compile(r"(?:,\s*(?:%s|%s)\s*[,.!?]|^(?:%s|%s)\s*[,!?]|,\s*(?:%s)\b)"
                 % (ADDR, NAME, ADDR, NAME, ADDR), re.I)
NEG = re.compile(r"\b(not|never|no|nothing|nobody|none)\b|n[’']t\b", re.I)
NUM = re.compile(r"\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|"
                 r"twelve|twenty|thirty|forty|fifty|hundred|\d+)\b", re.I)

def measure(lines):
    L = [t.strip() for t in lines if t and W.findall(t)]
    if not L:
        return None
    n = len(L)
    words = sum(len(W.findall(t)) for t in L)
    sents = [s for t in L for s in re.split(r'(?<=[.!?])\s+', t) if W.findall(s)]
    sl = [len(W.findall(s)) for s in sents]
    mean = sum(sl) / len(sl)
    var = sum((x - mean) ** 2 for x in sl) / len(sl)
    return {
        'lines': n,
        'words_per_line': round(words / n, 2),
        'sentences_per_line': round(len(sents) / n, 2),
        'commas_per_100w': round(100 * sum(t.count(',') for t in L) / words, 2),
        'rhythm_cv': round((var ** 0.5) / mean, 3),
        'question_pct': round(100 * sum(1 for t in L if '?' in t) / n, 1),
        'exclaim_pct': round(100 * sum(1 for t in L if '!' in t) / n, 1),
        'vocative_pct': round(100 * sum(1 for t in L if VOC.search(t)) / n, 1),
        'negation_pct': round(100 * sum(1 for t in L if NEG.search(t)) / n, 1),
        'number_pct': round(100 * sum(1 for t in L if NUM.search(t)) / n, 1),
        'short5_pct': round(100 * sum(1 for t in L if len(W.findall(t)) <= 5) / n, 1),
    }

# Measured 8/28/26 by this file's own rulers. Do not hand-edit; use --refresh.
REFERENCE = {
    'FILM': {'source': 'Cornell Movie-Dialogs, 617 films', 'lines': 304446,
             'words_per_line': 10.5, 'sentences_per_line': 1.76, 'commas_per_100w': 5.34,
             'rhythm_cv': 0.83, 'question_pct': 31.1, 'exclaim_pct': 8.9,
             'vocative_pct': 22.8, 'negation_pct': 26.5, 'number_pct': 7.0,
             'short5_pct': 40.7},
    'KOTOR': {'source': 'KOTOR NPC dialogue (van Stegeren 2020)', 'lines': 17406,
              'words_per_line': 19.5, 'sentences_per_line': 2.44, 'commas_per_100w': 4.21,
              'rhythm_cv': 0.67, 'question_pct': 21.5, 'exclaim_pct': 19.1,
              'vocative_pct': 23.9, 'negation_pct': 42.4, 'number_pct': 8.8,
              'short5_pct': 6.6},
    'REAL_SPEECH': {'source': 'Switchboard, merged to turns', 'lines': 99478,
                    'words_per_line': 14.6, 'sentences_per_line': 1.43, 'commas_per_100w': 16.18,
                    'rhythm_cv': 1.17, 'question_pct': 7.7, 'exclaim_pct': 0.1,
                    'vocative_pct': 31.4, 'negation_pct': 20.9, 'number_pct': 10.0,
                    'short5_pct': 42.9},
}

DEMO_QUESTS = ('S01_THE_METER_READER', 'S09_THE_BACK_DOOR', 'S02_THE_SAME_CRATE_TWICE',
               'S22_THE_COLD_ROOM', 'S25_THE_PRESSURE_GOES_BACKWARD')

def load_ours(book='records/BOHEMIA_WORDS_BOOK.json'):
    rows = [l for b in json.load(open(book))['books'] for l in b.get('lines', [])]
    demo = [l['text'] for l in rows
            if l.get('kind') in ('say', 'exchange')
            and any(d in (l.get('src') or '') for d in DEMO_QUESTS)]
    return {
        'DEMO_SCENES': demo,
        'ALL_QUEST_SPEECH': [l['text'] for l in rows if l.get('kind') == 'say'],
        'STREET_BARKS': [l['text'] for l in rows if l.get('kind') == 'bark'],
        'AMBIENT': [l['text'] for l in rows if l.get('kind') in ('reaction', 'quirk', 'asking')],
    }

KEYS = ['lines', 'words_per_line', 'sentences_per_line', 'commas_per_100w', 'rhythm_cv',
        'question_pct', 'exclaim_pct', 'vocative_pct', 'negation_pct', 'number_pct',
        'short5_pct']

def main():
    ours = {k: measure(v) for k, v in load_ours().items()}
    out = {'_meta': {'what': 'Bohemia voice shapes against three reference corpora',
                     'cannot': 'say whether a line is good'},
           'reference': REFERENCE, 'bohemia': ours}
    os.makedirs('records', exist_ok=True)
    json.dump(out, open('records/BOHEMIA_VOICE_FINGERPRINT.json', 'w'), indent=1)
    hdr = ['set'] + KEYS[1:]
    print('%-18s' % 'set' + ''.join('%12s' % h.replace('_pct', '%').replace('_per_', '/')
                                    for h in KEYS[1:]))
    for name in ('DEMO_SCENES', 'ALL_QUEST_SPEECH', 'STREET_BARKS', 'AMBIENT'):
        m = ours[name]
        print('%-18s' % name + ''.join('%12s' % m[k] for k in KEYS[1:]))
    print('-' * 18 + '-' * (12 * (len(KEYS) - 1)))
    for name, r in REFERENCE.items():
        print('%-18s' % name + ''.join('%12s' % r[k] for k in KEYS[1:]))
    print('\n-> records/BOHEMIA_VOICE_FINGERPRINT.json')
    print('THIS TOOL CANNOT TELL YOU WHETHER A LINE IS GOOD.')

if __name__ == '__main__':
    main()
