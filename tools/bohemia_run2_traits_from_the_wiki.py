#!/usr/bin/env python3
"""
THE TRAIT BEFORE YOU HIRE: BATTLE BROTHERS' TRAITS, READ OFF THE WIKI'S OWN PAGES (RUN TWO, 10/24/26, row [the trait before you
hire], rule 133, TUNING's change 9: 'a recruit's card shows his face, his 3 best things as stars, his one trait in plain words,
his price and his nightly cost... HARDCORE KEPT: a bad trait is still a bad trait').

PEOPLE's rule: never a trait from memory. Last round's note said the library held one trait page (Asthmatic); that was the loose
folder (reference/library/grok/wiki/pages/, 196 pages). The library's own tarball (reference/library/grok/wiki/PAGES_ALL.tar.gz,
2,256 pages, bb_all/) holds every one of the 74 the wiki's Traits page lists (its {{:Name}} transclusions, CORE_WIKITEXT.md
'# PAGE Traits'). This tool reads each page's <onlyinclude> row, its Effects cell, and writes records/target/bb/traits.json:
  - every trait: its name, the wiki's Effects cell verbatim (the quote), each effect parsed (a stat and a number, flat or percent,
    or 'special' for a sentence), whether the wiki files it as a Trait or a Status, and whether a recruit can be dealt it;
  - FOR THE HIRE: the ones a recruit at the post can carry whose every effect is a flat number on the eight stats the fight reads
    (hp, fatigue, resolve, initiative, melee and ranged skill and defence), so the card's promise is the fight's arithmetic. A
    trait with a percent of damage, a share of experience, a sight or a sentence is NAMED and left out until the fight reads it
    (a number printed and never applied would lie).
  - excluded from the deal by the wiki's own words: a Status (Old), a trait 'suffered through events' (the Traits page names Fat),
    the cult's and the arena's and the player character's (Davkul, Glorious, Arena, Pit Fighter, Player Character), and the
    fears and hatreds of things this valley does not have (greenskins, undead); fear and hate of beasts stay in the table (the
    valley has its lab beasts, rule 134) but carry no flat number, so they are out of the deal too.

  python3 tools/bohemia_run2_traits_from_the_wiki.py          # writes records/target/bb/traits.json, prints the table
"""
import json, os, re, tarfile, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAR = os.path.join(ROOT, 'reference', 'library', 'grok', 'wiki', 'PAGES_ALL.tar.gz')
CORE = os.path.join(ROOT, 'reference', 'library', 'grok', 'wiki', 'CORE_WIKITEXT.md')
OUT = os.path.join(ROOT, 'records', 'target', 'bb', 'traits.json')

STAT = {'Health': 'hp', 'Fatigue': 'fatigue', 'Resolve': 'resolve', 'Initiative': 'initiative', 'Melee_skill': 'melee_skill',
        'Ranged_skill': 'ranged_skill', 'Melee_defense': 'melee_defense', 'Ranged_defense': 'ranged_defense'}
OTHER = {'Damage_dealt': 'damage', 'Xp_received': 'xp', 'Vision': 'vision', 'Action_points': 'ap', 'Bravery': 'resolve'}
NOT_DEALT = re.compile(r'Davkul|Glorious|Player Character|Arena|Pit Fighter|Greenskins|Undead')
EVENT_ONLY = {'Fat'}   # the Traits page: 'new traits (such as "Fat") can be suffered through events'

# OUR WORDS (draft:true, words get an attempt, 8/11): what a man is, in plain words, the way a stranger at the post would say it;
# the numbers after it are the wiki's, printed by the card from the parsed effects, never typed here
WORDS = {
  'Athletic': 'Never winded.', 'Brave': 'Does not scare easy.', 'Brute': 'Hits like a truck.', 'Clumsy': 'All thumbs.',
  'Craven': 'Runs first.', 'Dastard': 'A coward, and he knows it.', 'Determined': 'Will not quit.', 'Dexterous': 'Good hands.',
  'Drunkard': 'Drinks before a fight.', 'Eagle Eyes': 'Sees far.', 'Fainthearted': 'Shakes when it starts.', 'Fearless': 'Nothing scares him.',
  'Fragile': 'Breaks easy.', 'Gluttonous': 'Always hungry.', 'Greedy': 'Wants more batteries.', 'Hesitant': 'Slow to move.',
  'Huge': 'Big as a door.', 'Impatient': 'First one in.', 'Iron Jaw': 'Takes a hit.', 'Iron Lungs': 'Never out of breath.',
  'Lucky': 'Bullets miss him.', 'Night Blind': 'Blind after dark.', 'Night Owl': 'Sees in the dark.', 'Optimist': 'Thinks it will be fine.',
  'Pessimist': 'Thinks it will go wrong.', 'Quick': 'Moves first.', 'Short Sighted': 'Cannot see far.', 'Strong': 'Carries more.',
  'Sure Footing': 'Hard to knock down.', 'Survivor': 'Hard to kill.', 'Swift': 'Hard to hit from far.', 'Tiny': 'Small and quick.',
  'Tough': 'Takes a beating.', 'Asthmatic': 'Wheezes.', 'Bloodthirsty': 'Likes it.', 'Cocky': 'Thinks he is the best.',
  'Disloyal': 'Will walk out.', 'Loyal': 'Stays.', 'Insecure': 'Needs a pat on the back.', 'Irrational': 'Hard to read.',
  'Paranoid': 'Watches his back.', 'Spartan': 'Eats little.', 'Superstitious': 'Believes in the bad stuff.', 'Team Player': 'Good in a crew.',
  'Weasel': 'Slips away.', 'Ailing': 'Sick a lot.', 'Bleeder': 'Bleeds bad.', 'Clubfooted': 'Bad foot.', 'Dumb': 'Slow to learn.',
  'Bright': 'Learns fast.', 'Deathwish': 'Wants to die out there.', 'Hate for Beasts': 'Hates the lab beasts.', 'Fear of Beasts': 'Afraid of the lab beasts.',
  'Mad': 'Not right in the head.', 'Addict': 'Needs his fix.',
}


def trait_names():
    core = open(CORE, encoding='utf-8').read()
    i = core.index('# PAGE Traits')
    j = core.index('# PAGE ', i + 5)
    return re.findall(r'\{\{:([^}]+)\}\}', core[i:j])


def pages():
    out = {}
    with tarfile.open(TAR) as t:
        for m in t.getmembers():
            mm = re.match(r'^bb_all/\d+_(.+)\.txt$', m.name)
            if mm: out[mm.group(1)] = m
        return out, {k: t.extractfile(v).read().decode('utf-8') for k, v in out.items()}


def effects_of(row):
    """The Effects cell: the second |align="center"| cell of the onlyinclude row."""
    cells = re.split(r'\n\|', row)
    eff = None
    for c in cells:
        c = c.strip()
        if c.startswith('align="center"|') and 'id=' not in c.split('|')[0]:
            eff = c[len('align="center"|'):].strip(); break
    if eff is None: return None, []
    parsed = []
    for m in re.finditer(r'<span style="color:(green|red)">\s*([+-]?\d+)(%?)\s*</span>\s*\[\[File:([A-Za-z_]+)\.png[^\]]*\]\]', eff):
        col, num, pct, f = m.groups()
        n = int(num)
        if col == 'red' and n > 0: n = -n
        key = STAT.get(f) or OTHER.get(f) or f.lower()
        parsed.append({'stat': key, 'n': n, 'pct': bool(pct), 'flat_eight': f in STAT and not pct})
    if 'Special.png' in eff or not parsed:
        txt = re.sub(r'\[\[File:[^\]]*\]\]', '', eff); txt = re.sub(r'<[^>]+>', '', txt); txt = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', txt)
        txt = re.sub(r'\s+', ' ', txt).strip()
        if txt and not re.fullmatch(r'[+\-\d%\s]*', txt): parsed.append({'stat': 'special', 'text': txt})
    return eff, parsed


def main():
    names = trait_names()
    idx, texts = pages()
    rows, missing = [], []
    for n in names:
        s = texts.get(n)
        if s is None: missing.append(n); continue
        m = re.search(r'<onlyinclude>(.*?)</onlyinclude>', s, re.S)
        row = m.group(1) if m else ''
        kind = 'status' if '<!-- Status -->' in row else 'trait'
        eff, parsed = effects_of(row)
        flat = [e for e in parsed if e.get('flat_eight')]
        pure = bool(parsed) and len(flat) == len(parsed)
        dealt = kind == 'trait' and not NOT_DEALT.search(n) and n not in EVENT_ONLY
        why = None
        if not dealt: why = 'a status' if kind == 'status' else 'suffered through events (the Traits page)' if n in EVENT_ONLY else 'not a recruit\'s (the cult, the arena, the player, or a thing the valley lacks)'
        elif not pure: why = 'an effect the fight does not read yet: ' + ', '.join(sorted(set(e['stat'] + ('%' if e.get('pct') else '') for e in parsed if not e.get('flat_eight'))))
        rows.append({'id': re.sub(r'[^a-z]+', '_', n.lower()).strip('_'), 'name': n, 'kind': kind, 'wiki_page': idx[n].name,
                     'effects_cell': eff, 'effects': parsed, 'at_the_post': dealt and pure, 'why_not': why,
                     'says': WORDS.get(n), 'draft': True})
    good = [r for r in rows if r['at_the_post']]
    out = {'_about': ("Battle Brothers' traits, read off the wiki's own pages in the library (reference/library/grok/wiki/PAGES_ALL.tar.gz, "
                      "bb_all/<n>_<Name>.txt, each page's <onlyinclude> row; the list is the Traits page's own, CORE_WIKITEXT.md). "
                      "at_the_post: a recruit can be dealt it and every effect is a flat number on the eight stats the fight reads. "
                      "'says' is ours, draft:true. Made by tools/bohemia_run2_traits_from_the_wiki.py (RUN TWO, 10/24/26)."),
           'source': 'the Battle Brothers wiki (battlebrothers.fandom.com), as held in the library', 'made': '10/24/26', 'lane': 'RUN TWO',
           'recruits': {'value': '0 to 2 randomly selected traits; some backgrounds disallow some', 'quote': 'New recruits to your mercenary company may have 0 to 2 randomly selected traits that affect their stats in positive and/or negative ways. Some backgrounds will disallow certain traits'},
           'card_shows': {'value': 1, 'from': "TUNING's change 9: 'his one trait in plain words'"},
           'traits': rows, 'missing_pages': missing}
    json.dump(out, open(OUT, 'w'), indent=1, ensure_ascii=False)
    for r in rows:
        e = ', '.join(('%+d%s %s' % (x['n'], '%' if x['pct'] else '', x['stat'])) if x['stat'] != 'special' else 'special' for x in r['effects'])
        print('%-4s %-20s %-6s %s%s' % ('POST' if r['at_the_post'] else '', r['name'], r['kind'], e, '' if r['at_the_post'] else '   <- ' + (r['why_not'] or '')))
    print('%d traits read, %d at the post, %d missing pages' % (len(rows), len(good), len(missing)))
    if missing: sys.exit(1)


if __name__ == '__main__':
    main()
