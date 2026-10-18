#!/usr/bin/env python3
"""THE BEAST'S OWN WEAPON (COMBAT [the fight holds the grid], rule 117(e), Paolo 10/18: 'how are you even testing these
fights... against animals... a 12-man Lone Wolf squad can go up to 36 or 40 enemies'). Measured before this tool: every
beast fight crashed on its first line, because a beast carries no gear and the fight builds a man around a weapon row.
In Battle Brothers a beast's weapon is a racial skill ('Direwolf Bite does 30-50 Damage with 70% Armor Damage and 20%
Direct Damage', 4 AP, 6 fatigue). This copies those skill pages, exactly as the wiki writes them, into weapon-shaped rows
(rule 63d: the numbers come from the wiki text in the repo, every row cites its page), so the fight reads a bite the way
it reads a knife.

  python3 tools/bohemia_combat_beast_attacks.py            writes records/target/bb/beast_attacks.json
  python3 tools/bohemia_combat_beast_attacks.py --check    exits 1 if the file on disk is not what the archive gives

Rows: every enemy in records/target/bb/enemies.json whose gear holds no weapon with a strike, for each of its skills that
has a page saying 'does A-B Damage'. A skill page that sizes by the beast (Small / Medium / Large Ghoul Claws, Size 1 / 2 /
3 Headbutt) is matched by the enemy id's own size word, and the alias is written on the row. What the page says the
attack also does (bleeding, a stagger, three tiles at once, a reach of two) is copied into the row as words and as a
flag; the fight builds none of it yet and the flag says so (effects_not_built), so a cell that needs it is named, not
faked. A beast whose only skills have no damage page (the Alp, the Hexe, the Kraken's body) gets no row, and the fight
refuses it by name."""
import json, os, re, sys, tarfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARCHIVE = 'reference/library/grok/wiki/PAGES_ALL.tar.gz'
OUT = 'records/target/bb/beast_attacks.json'

SIZE = {'small': ('Small', 'Size 1'), 'medium': ('Medium', 'Size 2'), 'large': ('Large', 'Size 3')}


def pages():
    """every skill page by its title, and every page by its archive path (the unit pages say which skill page they mean)"""
    out, every = {}, {}
    with tarfile.open(os.path.join(ROOT, ARCHIVE)) as t:
        for m in t.getmembers():
            if not m.isfile():
                continue
            text = t.extractfile(m).read().decode('utf8', 'replace')
            every[m.name] = text
            mm = re.match(r'^(\d+)_(.+?) \((\d+) fatigue\)\.txt$', m.name.split('/')[-1])
            if mm:
                out.setdefault(mm.group(2).lower(), []).append((m.name, text))
    return out, every


def cell(row):
    return re.sub(r'<[^>]+>', '', row).strip()


def parse(text):
    """the one skill row of a racial-skill page: | icon | name | AP | fatigue | description"""
    body = text.split('<onlyinclude>')[-1].split('</onlyinclude>')[0]
    cells = [c for c in re.split(r'\n\|\s*align="[a-z]+"\s*\|', '\n' + body) if c.strip()][1:]
    if len(cells) < 4:
        return None
    ap, fat, desc = cells[1].strip(), cells[2].strip(), cells[3]
    # a File link keeps its label ('70% [[File:Armor_damage.png|25px|bottom|Armor Damage]]' -> '70% Armor Damage'); a bare icon goes
    plain = re.sub(r'\[\[File:[^\]]*\]\]', lambda m: '' if re.match(r'^(bottom|center|top|middle|\d+px)$', m.group(0)[2:-2].split('|')[-1].strip())
                   else m.group(0)[2:-2].split('|')[-1], desc)
    plain = re.sub(r'\[\[[^\]|]*\|([^\]]*)\]\]', r'\1', plain)
    plain = re.sub(r'\[\[([^\]]*)\]\]', r'\1', plain)
    plain = re.sub(r'<[^>]+>', '', plain)
    plain = re.sub(r'\s+', ' ', plain).strip()
    dmg = re.search(r'does (\d+)-(\d+)\s*(?:Damage)?', plain)
    if not dmg:
        return None
    arm = re.search(r'(\d+)%\s*Armor Damage', plain)
    dd = re.search(r'(\d+)%\s*Direct Damage', plain)
    head = re.search(r'\+(\d+)%\s*chance to hit the head', plain)
    rng = re.search(r'range of (\d+) tiles', plain)
    shape = 'one'
    if re.search(r'hits 3 tiles in a row', plain):
        shape = 'three_in_a_row'
    elif re.search(r'up to 3 targets next to each other', plain):
        shape = 'three_beside'
    not_built = []
    for word, flag in (('leeding', 'bleeding'), ('tagger', 'stagger'), ('oison', 'poison'), ('knockback', 'knockback'),
                       ('nsnare', 'ensnare'), ('wallow', 'swallow'), ('only once per turn', 'once a turn')):
        if word in plain:
            not_built.append(flag)
    if shape != 'one':
        not_built.append('shape ' + shape)
    return {
        'ap': int(ap) if ap.isdigit() else None, 'fatigue': int(fat) if fat.isdigit() else None,
        'damage_min': int(dmg.group(1)), 'damage_max': int(dmg.group(2)),
        'armor_damage_pct': int(arm.group(1)) if arm else None, 'armor_ignore_pct': int(dd.group(1)) if dd else 0,
        'head_hit_chance': int(head.group(1)) if head else None, 'range_max': int(rng.group(1)) if rng else 1,
        'shape': shape, 'effect': plain, 'effects_not_built': not_built}


def build():
    E = json.load(open(os.path.join(ROOT, 'records/target/bb/enemies.json')))
    W = json.load(open(os.path.join(ROOT, 'records/target/bb/weapons.json')))
    armed = {r['name'] for r in W['rows'] if any(not re.match(r'^Reload', s['name']) for s in r['skills'])}
    P, every = pages()
    rows, by_enemy, refused = {}, {}, {}
    for e in E['rows']:
        if any(g in armed for g in (e.get('gear') or [])):
            continue
        size = next((SIZE[k] for k in SIZE if e['id'].endswith('_' + k)), None)
        # the skill pages the unit's own page links to ('[[Bite (0 fatigue)|Bite]]'): the wiki has two Bites, this says which
        unit = every.get(e.get('source') or '', '')
        linked = re.findall(r'\[\[([^\]|]+?) \((\d+) fatigue\)', unit)
        got = []
        for sk in e.get('skills') or []:
            cands = []
            mine = [l for l in linked if l[0].lower() == sk.lower() or l[0].lower().endswith(' ' + sk.lower())]
            if size and len(mine) > 1:
                mine = [l for l in mine if l[0].startswith(size)] or mine
            for title, fat in mine:
                cands += [(title, p) for p in P.get(title.lower(), []) if '(' + fat + ' fatigue)' in p[0]]
            for title in ([size[0] + ' ' + sk, size[1] + ' ' + sk] if size else []) + [sk]:
                cands += [(title, p) for p in P.get(title.lower(), [])]
            for title, (member, text) in cands:
                a = parse(text)
                if not a:
                    continue
                fat = re.search(r'\((\d+) fatigue\)', member).group(1)
                aid = re.sub(r'[^a-z0-9]+', '_', (title + ' ' + fat).lower()).strip('_')
                if aid not in rows:
                    rows[aid] = dict({'id': aid, 'name': title, 'class': 'natural', 'hands': 0, 'range_min': 1,
                                      'fatigue': 0, 'durability': None, 'value': 0,
                                      'source': ARCHIVE + ':' + member, 'page': title + ' (' + fat + ' fatigue)'}, **a)
                    rows[aid]['range'] = a['range_max']   # the fight reads a weapon's reach from 'range' (weapons.json's shape)
                    rows[aid]['skills'] = [{'name': title, 'ap': a['ap'], 'fatigue': a['fatigue'], 'hit_bonus': None,
                                            'range': None, 'effect': a['effect'], 'source': ARCHIVE + ':' + member}]
                    del rows[aid]['ap']
                    rows[aid]['fatigue'] = 0
                    if title != sk:
                        rows[aid]['alias'] = sk + ' is ' + title + ' for ' + e['id'] + ' (its size word)'
                got.append(aid)
                break
        if got:
            # the first attack that hits one tile leads (the fight's strike); the rest are listed for [weapon shapes]
            got.sort(key=lambda k: rows[k]['shape'] != 'one')
            by_enemy[e['id']] = {'attack': got[0], 'also': got[1:]}
        else:
            refused[e['id']] = 'no skill of ' + json.dumps(e.get('skills') or []) + ' has a page that says it does damage'
    return {
        '_about': ("A beast's weapon is its racial skill (Battle Brothers: a Direwolf carries no gear and bites). Copied from "
                   "the skill pages in the repo, one weapon-shaped row per page (class natural, no hands, reach one unless "
                   "the page says two); by_enemy names each gearless enemy's lead attack. effects_not_built lists what the page "
                   "says the attack also does that the fight does not build yet. refused: a gearless enemy with no damage page."),
        '_source_archive': ARCHIVE, '_built_by': 'tools/bohemia_combat_beast_attacks.py',
        'rows': [rows[k] for k in sorted(rows)], 'by_enemy': dict(sorted(by_enemy.items())), 'refused': dict(sorted(refused.items()))}


if __name__ == '__main__':
    data = build()
    text = json.dumps(data, indent=1, ensure_ascii=False) + '\n'
    path = os.path.join(ROOT, OUT)
    if '--check' in sys.argv:
        same = os.path.exists(path) and open(path).read() == text
        print(('SAME' if same else 'DIFFERENT') + ': ' + OUT)
        sys.exit(0 if same else 1)
    open(path, 'w').write(text)
    print(OUT + ': ' + str(len(data['rows'])) + ' attacks, ' + str(len(data['by_enemy'])) + ' enemies armed, '
          + str(len(data['refused'])) + ' refused')
    for k, v in data['by_enemy'].items():
        r = next(x for x in data['rows'] if x['id'] == v['attack'])
        print('  %-26s %-28s %3d-%-3d arm %s dd %s ap %s reach %s %s' % (k, r['name'], r['damage_min'], r['damage_max'],
              r['armor_damage_pct'], r['armor_ignore_pct'], r['skills'][0]['ap'], r['range_max'], ','.join(r['effects_not_built'])))
    for k, v in data['refused'].items():
        print('  REFUSED ' + k + ': ' + v)
