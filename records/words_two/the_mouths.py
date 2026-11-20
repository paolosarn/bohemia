"""WORDS THREE 11/20: THE MOUTHS, the one place that says where every counted mouth of the game keeps its lines.
   pools(J) -> an ordered dict {mouth: [line, ...]} read out of the game's own data files, the same thirteen mouths WORDS TWO counted
   (records/words_two/measure_every_mouth.py, rule 454(b)); with small=True two small mouths more (who you meet at a real place,
   your second on the map); with buttons=True the player's own buttons (the road cards' choices).
   J is a function that reads a JSON file by its repo path, so a caller can read the files on disk or at an older commit.
   Used by records/words_two/measure_every_mouth.py and gates/the_voice_holds_gate.py. It reads; it writes nothing."""
import collections


def _says_under(o, out):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == 'say' and isinstance(v, str):
                out.append(v)
            else:
                _says_under(v, out)
    elif isinstance(o, list):
        for v in o:
            _says_under(v, out)


def pools(J, buttons=False, small=False):
    P = collections.OrderedDict()
    ev = J('records/target/BOHEMIA_ROAD_EVENTS.json')['events']
    P['road: what the stranger says'] = [e['says'] for e in ev]
    a = []
    [_says_under(e.get('opts'), a) for e in ev]
    P['road: the answer after his choice'] = a
    sq = J('records/target/BOHEMIA_SIDE_QUESTS.json')['quests']
    a = []
    for q in (sq.values() if isinstance(sq, dict) else sq):
        for n in (q.get('nodes') or {}).values():
            for s in n.get('says') or []:
                a.append(s)
    P['road: side quest talk'] = a
    bs = J('records/target/BOHEMIA_BOARD_SHELF.json')['offers']
    jk = J('records/target/BOHEMIA_JOB_KINDS.json')['board_people']['rows']
    P['town: job givers at the board'] = [o['says'] for o in bs] + [o['says'] for o in jk]
    tr = J('records/target/settlement_traits.json')['traits']
    a = []
    for t in tr:
        for v in t['says'].values():
            a.append(v)
    ru = J('records/target/settlement_rumours.json')
    a += [r['says'] for r in ru['rumours']]
    for v in ru['news']['lines'].values():
        a += v
    P['town: keepers, the Elder, the bar'] = a
    rr = J('records/target/bb/rare_recruits.json')['men']
    rt = J('records/target/bb/retinue.json')['followers']['value']
    P['hires: rare men and the retinue'] = [m['line'] for m in rr] + [f['ask'] for f in rt]
    cv = J('records/target/bb/crew_voices.json')
    fight, after = [], []
    for t in cv['types'].values():
        for m, v in t['lines'].items():
            tgt = after if m in ('win', 'lost', 'ran', 'wipe') else fight

            def grab(x, tgt=tgt):
                if isinstance(x, dict):
                    for k, y in x.items():
                        if k == 'sp':
                            continue
                        grab(y)
                elif isinstance(x, list):
                    for y in x:
                        if isinstance(y, str):
                            tgt.append(y)
            grab(v)
    P['fight: his men mid-fight'] = fight
    P['fight: the survivor after'] = after
    fr = J('records/target/bb/fight_reasons.json')['rules']
    a = []
    for r in fr:
        a += (r.get('them') or []) + (r.get('ours') or [])
    P['fight: the why line'] = a
    ba = J('records/target/bb/boss_act_one.json')['bosses']
    a = []
    for b in ba:   # a boss made after 11/17 may carry no words at all (rule 454(a): BOSSES' 13th is 'a boss of no words')
        L = (b.get('lead') or {}).get('asker') or {}
        a += [x for x in [L.get('says'), L.get('yes_says'), L.get('no_says'), ((b.get('lead') or {}).get('thing') or {}).get('says'), (b.get('after') or {}).get('valley')] if x]
    P['bosses: the asker and after'] = a
    fk = J('records/target/bb/feed_kinds.json')
    a = []
    for k in fk['kinds'] + fk['replies'] + fk['followups']:
        for w in k.get('words', []):
            if isinstance(w, dict) and w.get('en'):
                a.append(w['en'])
    P['feed: the valley'] = a
    fw = J('records/target/bb/feed_world.json')
    a = []
    for k in fw['kinds']:
        for w in k.get('words', []):
            if w.get('en'):
                a.append(w['en'])
    P['feed: far away'] = a
    rl = J('records/target/bb/radio_lines.json')
    a = []
    for t in rl['towns'].values():
        a += [l['say'] for l in t['lines']]
    P['feed: a town falling'] = a
    if small:   # 11/20: two small mouths WORDS TWO counted but did not measure (gates/the_voice_holds_gate.py freezes them; the measure does not)
        rp = J('records/target/bb/real_places.json')['places']
        a = []
        for p in rp:
            v = p.get('visit') or {}
            if isinstance(v.get('says'), str) and '{' not in v['says'][:1]:
                a.append(v['says'])
            for w in v.get('line') or []:
                if isinstance(w, dict) and isinstance(w.get('says'), str):
                    a.append(w['says'])
            _says_under(v.get('opts'), a)
        P['places: who you meet at a real place'] = [x for x in a if x and x != '{says}']
        sl = J('records/target/words/the_second_speaks.json')['lines']
        P['map: your second'] = [v['line'] for v in sl.values() if isinstance(v, dict) and isinstance(v.get('line'), str) and v['line'].strip()]
    if buttons:   # the player's own words: the choices under every road card (rule: the player never speaks Spanglish)
        P['road: his own buttons'] = [o['t'] for e in ev for o in (e.get('opts') or []) if isinstance(o, dict) and isinstance(o.get('t'), str)]
    return P
