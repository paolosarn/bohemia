#!/usr/bin/env python3
"""Builds reference/BOHEMIA_MASTER_FOR_GROK.md: the whole current canon in one file, for an outside helper that
must know everything (Paolo 9/30: 'Grok gotta know everything'). Run from the repo root every VAMILY.
Order: how to work, the front page of the board, the game document, the laws master, the canon index, every
law (newest first), every one of his rulings verbatim, the Battle Brothers library, the translation table, the
beasts and the board pages. The repo is public; every section names its source file so Grok can open it."""
import glob, os, re, datetime
out=[]
def add(title, path, text=None):
    out.append('\n\n' + '='*100 + '\n# ' + title + '\n# source: ' + path + '\n' + '='*100 + '\n')
    out.append(text if text is not None else open(path, encoding='utf-8', errors='replace').read())
def date_key(p):
    m=re.search(r'_(\d{1,2})_(\d{1,2})_26', p); return (int(m.group(1)), int(m.group(2))) if m else (0,0)
out.append('# BOHEMIA: THE MASTER FOR GROK (everything current, one file; built ' + datetime.date.today().isoformat() + ')\n'
           '# Public repo: https://github.com/paolosarn/bohemia . Raw file: https://raw.githubusercontent.com/paolosarn/bohemia/main/reference/BOHEMIA_MASTER_FOR_GROK.md\n'
           '# NEWEST DATE WINS on any conflict. Paolo decides; the coordinator files; Grok researches and never rules.\n')
add('HOW THE STUDIO WORKS (CLAUDE.md)', 'CLAUDE.md')
v=open('VAMILY.md', encoding='utf-8', errors='replace').read(); i=v.index('\n## THE TWENTY CHATS')
add('THE FRONT PAGE OF THE BOARD (VAMILY.md, rules 0 and up; the lanes\' sections are in the repo)', 'VAMILY.md', v[:i])
add('THE GAME DOCUMENT (GDD v5)', 'laws/BOHEMIA_GDD_v5.md')
add('THE LAWS MASTER (9/4/26)', 'laws/BOHEMIA_LAWS_MASTER_9_4_26.md')
add('THE CANON INDEX (every addendum, newest wins)', 'BOHEMIA_CANON_INDEX.md')
laws=sorted(glob.glob('laws/*_26.md'), key=date_key, reverse=True)
for p in laws:
    if 'GDD' in p or 'LAWS_MASTER' in p: continue
    add('LAW ' + os.path.basename(p), p)
for p in sorted(glob.glob('records/BOHEMIA_PAOLO_*.md'), key=date_key, reverse=True):
    add('HIS WORDS ' + os.path.basename(p), p)
for p in sorted(glob.glob('reference/library/battle_brothers/*.md')):
    add('BATTLE BROTHERS LIBRARY ' + os.path.basename(p), p)
for p in ['records/BOHEMIA_THE_BATTLE_BROTHERS_TRANSLATION_TABLE_9_29_26.md',
          'records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_BESTIARY_COUNT_9_29_26.md',
          'records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_SEVENTEEN_BEAST_MECHANICS_9_29_26.md',
          'records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_WEAPON_CLASSES_AND_OUR_ARSENAL_9_29_26.md',
          'records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_DE_EXTINCTION_ROUND_ZERO_9_29_26.md',
          'records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_ONE_THE_INVASIVE_LENS_9_29_26.md',
          'records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_TWO_DINOSAURS_INSECTS_PLANTS_BIRDS_MICROBES_9_29_26.md',
          'records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_SEVENTEEN_9_29_26.md',
          'records/BOHEMIA_THE_COMBAT_BOARD_ASSETS_WHAT_WE_HAVE_AND_WHAT_WE_NEED_9_29_26.md',
          'records/BOHEMIA_THE_REVAMP_LIST_9_24_26.md',
          'reference/BOHEMIA_GROK_ASKS.md']:
    if os.path.exists(p): add('PAGE ' + os.path.basename(p), p)
s=''.join(out); open('reference/BOHEMIA_MASTER_FOR_GROK.md','w',encoding='utf-8').write(s)
print('master bytes', len(s), 'laws', len(laws))
