#!/usr/bin/env python3
"""THE FEED'S ONE FILE (FEED lane 23, row [the feed is alive], rule 215; rule 217).

Joins the two halves into records/target/bb/feed_kinds.json, the one file the game reads at boot:
  WORDS' bank  banks/BOHEMIA_WORDS_THE_FEED_BANK.json  who speaks and what is said: the accounts and their
               handles (and their act two and three names), every line with its Spanglish twin, the replies,
               the follow-ups, the faction plurals, the casing (rule 215(f): WORDS writes the lines)
  FEED's rows  tools/feed/BOHEMIA_FEED_ROWS.json        when and how often: every kind's trigger and pace, the
               map's places and roads, the valley's plurals, and FEED's own kinds for moments WORDS has no row for
Nothing here writes a sentence. A kind WORDS adds without a FEED row is carried with the quiet trigger and a long
cooldown (it posts, rarely, until FEED gives it a moment); a FEED row whose WORDS kind is gone is reported.

  python3 tools/bohemia_feed_build.py          # write the file
  python3 tools/bohemia_feed_build.py --check  # exit 1 if the committed file is not what the two halves make
"""
import collections
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'banks/BOHEMIA_WORDS_THE_FEED_BANK.json')
ROWS = os.path.join(ROOT, 'tools/feed/BOHEMIA_FEED_ROWS.json')
OUT = os.environ.get('FEED_OUT') or os.path.join(ROOT, 'records/target/bb/feed_kinds.json')
OD = collections.OrderedDict

KIND_OF = {'person': 'person', 'page': 'page', 'scanner': 'scanner', 'company': 'company', 'stranger': 'stranger', 'bot': 'bot'}   # WORDS' own words
TAGS_OF = {'person': ['person', 'local'], 'page': ['page', 'faction'], 'scanner': ['scanner'], 'company': ['company'],
           'stranger': ['stranger', 'burner'], 'bot': ['bot']}


def load(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f, object_pairs_hook=OD)


def town_name(home):
    if not home or home == 'valley':
        return None
    return ' '.join(w.capitalize() for w in str(home).replace('_', ' ').split())


def account(a):
    o = OD()
    o['id'] = a['id']
    o['handle'] = a['handle']
    o['kind'] = KIND_OF.get(a.get('kind'), 'local')
    tags = list(TAGS_OF.get(a.get('kind'), ['person', 'local']))
    o['tags'] = tags
    if a.get('faction'):
        o['faction'] = a['faction']
    t = town_name(a.get('home'))
    if t:
        o['town'] = t
    lean = a.get('lean')
    if lean:
        o['lang'] = lean
    if a.get('acts'):
        o['acts'] = a['acts']
    o['face'] = ''                                   # rule 217(a): no portrait yet, the field kept for later
    face = a.get('face')
    if isinstance(face, dict) and face.get('id'):
        o['face_id'] = face['id']
    for k in ('name', 'trade', 'voice'):
        if a.get(k):
            o[k] = a[k]
    o['draft'] = True
    o['from'] = 'WORDS'
    return o


def who(lst, who_map):
    # WORDS' who is pools, first match wins; 'town' is a person of the event's town, else any person (its own words)
    out = []
    for w in lst or []:
        w = str(w)
        for m in (who_map.get(w, w) if isinstance(who_map.get(w, w), list) else [who_map.get(w, w)]):
            if m not in out:
                out.append(m)
    return out


def words(ws):
    out = []
    for w in ws or []:
        o = OD()
        o['en'] = w.get('en') or w.get('text')
        if w.get('es'):
            o['es'] = w['es']
        if w.get('tags'):
            o['tags'] = w['tags']
        if w.get('by'):
            o['by'] = w['by']
        o['draft'] = True
        out.append(o)
    return out


def build():
    bank, rows = load(BANK), load(ROWS)
    wmap = rows['who_map']
    notes = []
    out = OD()
    out['_about'] = ('THE FEED, ONE FILE (FEED lane 23, row [the feed is alive], Paolo 10/26 rule 215: \'organize it properly so every time '
                     'we upgrade it gets better\'). Every post the phone\'s FEED app shows comes from a row here; the engine '
                     '(engine/bohemia_feedstream.js engine()) knows no sentence and no account. BUILT by tools/bohemia_feed_build.py '
                     'from WORDS\' bank (banks/BOHEMIA_WORDS_THE_FEED_BANK.json: the accounts, the handles, the lines and their '
                     'Spanglish twins, the replies, the follow-ups, the plurals) and FEED\'s rows (tools/feed/BOHEMIA_FEED_ROWS.json: '
                     'the triggers, the pace, the places, the roads). The game reads only this file; a modder may edit it directly, '
                     'or edit the two halves and run the tool. Rule 217: a post is a username and its words; the face field is '
                     'empty until faces exist. Every line draft:true.')
    out['built_from'] = OD([('words', 'banks/BOHEMIA_WORDS_THE_FEED_BANK.json'), ('feed', 'tools/feed/BOHEMIA_FEED_ROWS.json'),
                            ('tool', 'tools/bohemia_feed_build.py')])
    out['_how_to_add'] = ('A KIND: {id, source (mine = what you did, world = what the world did, life = the city\'s own life), trigger (an '
                          'event the game fires, or quiet), who (account ids, tag:<tag>, town, faction, faction:<id>, toward, same), when '
                          '(hours [from,to), night, act, min_day, is, at_least, below), chance, must (a deed: never dropped), big, '
                          'max_per_window, cooldown_min, delay_min [lo,hi], again_key + again_after_min, alias {fill: event key}, words '
                          '[{en, es (the Spanglish twin), tags, by (one mouth)}], replies [{who, chance, delay_min, words}], follow_up '
                          '[{who, chance, after_min, words}], teaches}. AN ACCOUNT: {id, handle, kind, tags, faction, town, lang, acts '
                          '{"1","2","3"}, face ""}.')
    out['_triggers'] = rows.get('_triggers') or OD()
    out['pace'] = rows['pace']
    out['sentence_case'] = rows.get('sentence_case', ['faction', 'scanner', 'company'])
    says = OD(bank['faction_says']['value'])
    for k, v in rows['says_extra']['value'].items():
        says.setdefault(k, v)
    out['faction_says'] = says
    out['casing'] = bank.get('casing', {}).get('value')
    out['how_to_speak'] = bank.get('how_to_speak', {}).get('value')
    out['places'] = rows['places']
    out['roads'] = rows['roads']
    # accounts: WORDS' first, then FEED's extra (never a second handle alike)
    accts, seen = [], set()
    for a in bank['accounts']:
        o = OD(a)                                     # WORDS' account as WORDS wrote it (the engine reads its kind, home, face, acts)
        o.setdefault('tags', list(TAGS_OF.get(a.get('kind'), [])))
        h = str(o['handle']).lower().lstrip('@')
        if o['id'] in seen or h in seen:
            notes.append('a WORDS account twice: ' + o['id'])
            continue
        seen.add(o['id'])
        seen.add(h)
        accts.append(o)
    for a in rows['accounts_extra']:
        h = str(a['handle']).lower().lstrip('@')
        if a['id'] in seen or h in seen:
            notes.append('FEED account dropped, WORDS has it: ' + a['id'])
            continue
        a = OD(a)
        a['from'] = 'FEED'
        seen.add(a['id'])
        seen.add(h)
        accts.append(a)
    out['accounts'] = accts
    # replies and follow-ups hang on the kinds they answer
    rep, fol = collections.defaultdict(list), collections.defaultdict(list)
    for r in bank.get('replies', []):
        for to in r.get('to', []):
            rep[to].append(OD([('who', list(r.get('who') or [])), ('delay_min', [12, 100]), ('words', words(r.get('words'))), ('from', r['id'])]))
    for f in bank.get('followups', []):
        am = int(f.get('after_min') or 180)
        for to in f.get('to', []):
            fol[to].append(OD([('who', list(f.get('who') or [])), ('after_min', [max(360, am * 3), max(900, am * 6)]),
                               ('words', words(f.get('words'))), ('from', f['id'])]))
    kinds = []
    wk = rows['words_kinds']
    for k in bank['kinds']:
        r = wk.get(k['id'])
        o = OD()
        o['id'] = k['id']
        o['source'] = k.get('kind', 'life')
        if r is None:
            notes.append('WORDS kind with no FEED row yet (posts rarely on quiet): ' + k['id'])
            r = OD([('trigger', 'quiet'), ('must', False), ('max_per_window', 1), ('cooldown_min', 2880)])
        for key, val in r.items():
            o[key] = val
        o['who'] = list(k.get('who') or [])            # WORDS' pools as written: town, valley, scanner, company, stranger, faction:<id>, an id
        if k.get('big'):
            o['big'] = True
        o['teaches'] = k.get('teaches', '')
        o['words'] = words(k.get('words'))
        if rep.get(k['id']):
            o['replies'] = rep[k['id']]
        if fol.get(k['id']):
            o['follow_up'] = fol[k['id']]
        o['kind'] = o['source']                      # WORDS' own name for it, so WORDS' checker reads this file as its bank
        o['fills'] = k.get('fills', [])
        if k.get('suggest'):
            o['suggest'] = k['suggest']               # WORDS' suggestion, kept beside FEED's trigger and pace
        o['from'] = 'WORDS'
        kinds.append(o)
    for k in wk:
        if not any(x['id'] == k for x in bank['kinds']):
            notes.append('FEED row for a kind WORDS no longer has: ' + k)
    for k in rows['kinds_extra']:
        k = OD(k)
        k.pop('_feed', None)
        k['kind'] = k.get('source')
        seen_f = []
        for w in k.get('words', []):
            for m in re.findall(r'\{[a-z_0-9]+\}', w.get('en') or ''):
                if m not in seen_f:
                    seen_f.append(m)
        k['fills'] = seen_f
        k['from'] = 'FEED'
        kinds.append(k)
    out['kinds'] = kinds
    # WORDS' rows as WORDS wrote them (its checker reads these); the engine reads the copies hung on each kind
    out['replies'] = [OD([(k2, v) for k2, v in r.items()]) for r in bank.get('replies', [])]
    out['followups'] = [OD([(k2, v) for k2, v in f.items()]) for f in bank.get('followups', [])]
    for k2 in ('who', 'fills', 'tags', 'draft'):      # WORDS' own keys, under WORDS' own names (the engine reads none of them)
        if k2 in bank and k2 not in out:
            out[k2] = bank[k2]
    fl = OD(out.get('fills') or {})
    for k2, v in (rows.get('fills_extra') or {}).items():
        fl.setdefault(k2, v)                          # FEED's fills, declared beside WORDS'
    out['fills'] = fl
    return out, notes


def main():
    out, notes = build()
    text = json.dumps(out, indent=1, ensure_ascii=False) + '\n'
    if '\u2014' in text:
        print('REFUSED: an em dash in the feed')
        return 2
    if '--check' in sys.argv:
        cur = open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
        if cur != text:
            print('STALE: records/target/bb/feed_kinds.json is not what WORDS\' bank and FEED\'s rows make; run python3 tools/bohemia_feed_build.py')
            return 1
        print('FRESH: the feed\'s one file is the two halves, byte for byte (%d kinds, %d accounts)' % (len(out['kinds']), len(out['accounts'])))
        return 0
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(text)
    print('wrote %s: %d kinds, %d accounts' % (os.path.relpath(OUT, ROOT), len(out['kinds']), len(out['accounts'])))
    for n in notes:
        print('  note: ' + n)
    return 0


if __name__ == '__main__':
    sys.exit(main())
