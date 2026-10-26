#!/usr/bin/env python3
# BUILD THE FEED'S WORDS BANK (WORDS, 10/26/26, rows [the feed's words] and [the usernames tell the story]).
# The source is the three files beside this one; the output is banks/BOHEMIA_WORDS_THE_FEED_BANK.json.
# Never edit the JSON by hand: edit a source file and run `python3 tools/words_feed/build_feed_bank.py`.
# gates/feed_words_gate.js checks what this writes (THE FEED'S WORDS in the suite).
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from feed_accounts import ACCOUNTS
from feed_posts_part1 import MINE, WORLD
from feed_posts_part2 import LIFE, BOTS, PAGES, REPLIES, FOLLOWUPS

ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, 'banks', 'BOHEMIA_WORDS_THE_FEED_BANK.json')

FILLS = {
    '{company}': 'his company\'s name as he typed it (rule 212)',
    '{companyhandle}': 'his company\'s name, lower case, no spaces: the handle of his page',
    '{man}': 'one of his men, by name',
    '{town}': 'a place as the map names it, title case (Henderson, Primm, Boulder City)',
    '{place}': 'where on the map it happened, as a person says it: the freeway, the wash, the landfill, the Strip',
    '{road}': 'a road as people say it: the 15, the 95, Boulder Highway, Lamb',
    '{enemy}': 'who was fought: the faction_says plural (the road crews, the eye\'s men)',
    '{faction}': 'a faction: the faction_says plural (the water people, the block watch boys)',
    '{good}': 'what the price is for, a plain word: water, food, ammo, medicine',
    '{now}': 'the price now, in the shop\'s own words for it (one battery, 3 batteries)',
    '{was}': 'the price before, the same way',
    '{rare}': 'the rare man\'s kind with its article: a road knight, a gun for hire, a blade master',
    '{count}': 'a small number the event carries: blocks, minutes, men',
    '{high}': 'the weather bot\'s high, a number',
    '{low}': 'the weather bot\'s low, a number',
}

# HOW A PERSON SAYS EACH FACTION, AS A PLURAL. {enemy} and {faction} are always one of these, so every
# line's verb agrees ('the House's men have the depot', never 'the House have'). Keyed by the ids in
# records/target/bb/factions.json; the gate refuses a faction without one.
FACTION_SAYS = {
    'brigands': 'the road crews',
    'noble_houses': 'the House\'s men',
    'zombies': 'the keeper\'s machines',
    'beasts': 'the lab animals',
    'nomads': 'the water people',
    'mercenaries': 'the hired guns',
    'bounty_hunters': 'the head takers',
    'cultists': 'the flock\'s people',
    'barbarians': 'the keepers',
    'city_states': 'the eye\'s men',
    'militia': 'the block watch boys',
    'goblins': 'the runners',
}

def stamp(words):
    for w in words:
        w['draft'] = True
        if w.get('es') is None:
            w.pop('es', None)
        if not w.get('tags'):
            w.pop('tags', None)
    return words

def main():
    kinds = MINE + WORLD + LIFE + BOTS + PAGES
    for k in kinds:
        stamp(k['words'])
    for r in REPLIES + FOLLOWUPS:
        stamp(r['words'])
    bank = {
        '_about': ('THE FEED\'S WORDS (WORDS lane, 10/26/26; VAMILY [the feed\'s words] rule 215(f) and '
                   '[the usernames tell the story] rule 217). Every post the phone\'s FEED app can show, as rows a '
                   'modder reads: a KIND is one sort of post (its trigger, who may post it, how often, how soon, '
                   'the words with five or more variants, what it teaches); an ACCOUNT is a handle that tells who '
                   'posts (217: a post is its handle and its words, the face field empty until faces exist). FEED '
                   'owns the triggers, the pacing and its one data file and reads or copies these rows; the '
                   'suggest block on each kind is WORDS\' suggestion, never FEED\'s decision. Every line is '
                   'draft:true (8/11). Built by tools/words_feed/build_feed_bank.py, never by hand; checked by '
                   'gates/feed_words_gate.js. Record: records/BOHEMIA_WORDS_THE_FEED_TALKS_AND_THE_HANDLES_10_26_26.md.'),
        'draft': True,
        'how_to_speak': {
            'value': ('a variant has en (plain English, no Spanish word in it) and, often, es (its Spanglish twin). '
                      'Pick the form per post with BohemiaSpanglish.regFor(account, kind id): \'en\' takes en; '
                      'anything else takes es when there is one, else BohemiaSpanglish.flavour(en, account). The '
                      'dial is the house rate (10 to 15 in 100, rule 143a), so the bank holds the twins and never '
                      'decides the share. The company page is the player (player:true) and a bot is a machine '
                      '(machine:true): both always en, the dial skipped.'),
            'source': 'engine/bohemia_spanglish.js', 'ours': True},
        'who': {
            'value': ('a kind\'s who is a list of pools, first match wins: town = a person whose home is the '
                      'event\'s town (else valley), valley = any person, scanner = the scanner page, company = his '
                      'page, stranger = a burner, faction:<id> = that faction\'s page (records/target/bb/factions.json '
                      'ids), or an account id (sal, benny, yolanda, chuy, lyle, a bot).'),
            'ours': True},
        'faction_says': {'value': FACTION_SAYS, 'ours': True, 'draft': True,
                         'rule': ('{enemy} and {faction} are filled from here, always a plural, lower case; '
                                  'the lines are written with plural verbs to match')},
        'casing': {'value': ('a person writes in lower case and a fill keeps its own case inside it; a page\'s, '
                             'the scanner\'s and the company\'s post opens every sentence with a capital, so when a '
                             'fill opens one of their sentences its first letter is raised. {company} is his name '
                             'without a leading "the" (the lines say "the {company}" where people would).'),
                   'ours': True},
        'tags': {'saw': 'the poster saw it (hop 0)', 'heard': 'it reached the poster second hand (hop 1 or more)',
                 'ah': 'the analog horror is in what they noticed (for EYES\' read)'},
        'fills': FILLS,
        'accounts': ACCOUNTS,
        'kinds': kinds,
        'replies': REPLIES,
        'followups': FOLLOWUPS,
    }
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(bank, f, ensure_ascii=False, indent=1)
        f.write('\n')
    n = sum(len(k['words']) for k in kinds) + sum(len(r['words']) for r in REPLIES + FOLLOWUPS)
    es = sum(1 for k in kinds for w in k['words'] if 'es' in w) + \
         sum(1 for r in REPLIES + FOLLOWUPS for w in r['words'] if 'es' in w)
    print('wrote %s: %d accounts, %d kinds, %d reply rows, %d follow-up rows, %d lines, %d Spanglish twins'
          % (os.path.relpath(OUT, ROOT), len(ACCOUNTS), len(kinds), len(REPLIES), len(FOLLOWUPS), n, es))

if __name__ == '__main__':
    main()
