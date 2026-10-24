#!/usr/bin/env python3
"""THE ROSTER (COMBAT [bestiary], rule 42a, Paolo 9/29: 'research how many combat factions and beasts there are in Battle
Brothers and that's the bare minimum amount we need, and enemy types'; the row's ROSTER AS A DATA FILE, MODS' line: every
content kind in a data file a modder can edit).

Writes records/target/bb/roster.json from what the repo already holds, nothing typed twice:
  - every enemy type in the library (records/target/bb/enemies.json: each row its wiki page), its Lower and Champion variants
    folded under it, sorted into one of Bohemia's families by its Battle Brothers faction;
  - each family's skin and its ONE LESSON from the 9/29 draft (records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_BESTIARY_COUNT_9_29_26.md,
    'his example leads'), the beasts' from the seventeen-mechanics record;
  - each type's name on the board, its act weights and whether the fight fields it, read off records/target/bb/ours.json
    (bestiary.names, act_weights, enemy_tiers.mix, graveyard), so the file can never disagree with the fight;
  - THE FLOOR, his: 12 factions, 75 enemy types, 17 beasts, 3 bosses, champions; the gate counts the file against it.
Names and skins not yet on the board are drafts (draft: true) for WORDS and WORLD; the numbers a man feels stay on his row in
enemies.json (the roster points at it, never copies it).

Run: python3 tools/bohemia_combat_the_roster.py   (idempotent; --check exits 1 if the file on disk is stale)
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BB = os.path.join(ROOT, 'records/target/bb')
OUT = os.path.join(BB, 'roster.json')
DRAFT = 'records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_BESTIARY_COUNT_9_29_26.md'

# Battle Brothers faction -> Bohemia family. Skins and lessons quote the 9/29 draft (section 2) where it has one.
FAMILIES = [
    ('roaming_crews', ['brigands'], 'ROAMING CREWS: scavengers, poachers, marksmen, a leader with a name',
     'Undisciplined: they run at you even when they should shoot; drop the leader and the rest waver.'),
    ('home_base_guards', ['noble_houses'], "THE FACTIONS' HOME-BASE GUARDS (the Mob, the Trades, the Network, the Reds...), armoured, in colour",
     'A shield line with long arms behind it: break the line or go round it.'),
    ('rival_companies', ['mercenaries', 'bounty_hunters', 'oathbringers'], 'OTHER COMPANIES like yours, the rival crew with a runway look',
     'A crew like yours: every man has a job; read his gear before you pick the fight.'),
    ('lab_breakout_keepers', ['barbarians'], 'THE LAB-BREAKOUT PEOPLE: cult-like keepers who walk with beasts',
     'They come with beasts and a drum: the beast hits first, the keeper hits hardest.'),
    ('desert_road_crews', ['nomads'], 'the desert road crews', 'Slings and fast blades from the dunes: they hit and fade into the sand.'),
    ('casino_security', ['city_states'], "THE STRIP'S CASINO SECURITY: the only faction with working heavy guns and a mortar",
     'Guns and a mortar: stay out of the open and close the distance.'),
    ('the_faithful', ['cultists'], "THE AMALGAMATION'S FAITHFUL (act 2 and 3 grow them)", 'They do not run.'),
    ('townsfolk', ['civilians'], 'the militia, the caravans and the townsfolk', 'Many and green: their captain holds them together.'),
    ('kids_and_runners', ['goblins', 'greenskins'], 'KIDS AND RUNNERS on bikes and dirt quads with slings and nets',
     'They throw, net you and run: do not chase them, shoot them.'),
    ('the_heavies', ['orcs'], 'THE HEAVY: exo-suit men, crash-bar shields, they push you off the tile',
     'They shove you off your tile: put your back to a wall and shoot before they reach the line.'),
    ('the_mechanics', ['zombies'], 'THE MECHANIC (his words): a man who keeps reviving his robots; kill him and the machines drop',
     'Kill him first and the machines drop; a head shot keeps one down.'),
    ('old_orders_machines', ['ancient_dead', 'undead_reliquary'],
     "THE OLD ORDER'S MACHINES: security drones and exo-suited remains still running the last order they were given",
     'A line that holds and never breaks: bring armour-breakers and patience.'),
    ('beasts', ['beasts', 'animals'], 'DE-EXTINCT ANIMALS out of the labs when the dollar died (rule 42, laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md)',
     'Each beast its own lesson (below).'),
]
# kinds whose own row sits in another faction than their family (the library files the ghosts with the zombies)
MOVED = {'geist': 'ghosts', 'rachegeist': 'ghosts', 'rachegeist_ghost': 'ghosts', 'lorekeepers_apparition': 'ghosts', 'screaming_skull': 'ghosts'}
GHOSTS = ('ghosts', "THE AMALGAMATION'S HAUNTING as act one sees it (rule 134(e)): the dead who came back, the scream its broadcast",
          'They fight your nerve from range: walk up and hit them, they break like smoke.')
# the seventeen beasts by the draft's count, each its library ids, its skin and its lesson
BEASTS = [
    ('direwolf', ['direwolf'], 'the dire wolf (Colossal\'s real 2025 pups)', 'They flank: keep your line closed.'),
    ('frenzied_direwolf', ['frenzied_direwolf'], 'the frenzied dire wolf', 'Faster and harder: shoot them on the way in.'),
    ('hyena', ['hyena', 'frenzied_hyena'], 'the cave hyena', 'They take the weak at the edge.'),
    ('nachzehrer', ['nachzehrer_small', 'nachzehrer_medium', 'nachzehrer_large'], None, 'They eat the dead and grow: leave no body for them.'),
    ('webknecht', ['webknecht', 'webknecht_eggs'], 'a swarm of lab things (no giant spiders)', 'They net and poison: kill the nest.'),
    ('unhold', ['unhold', 'bog_unhold'], 'the short-faced bear or the ground sloth', 'It regenerates and throws: finish it fast.'),
    ('armoured_unhold', ['armored_unhold'], 'the bear with lab plating', 'Plate first, then the beast.'),
    ('frost_unhold', ['frost_unhold', 'armored_frost_unhold'], None, 'It regenerates and throws: finish it fast.'),
    ('alp', ['alp'], 'a night thing (the horror line, not an animal)', 'It puts your men to sleep and blinks: wake them, then hunt it.'),
    ('hexe', ['hexe'], None, 'She charms your own: kill her and they are yours again.'),
    ('schrat', ['schrat', 'sapling'], 'the mesquite or Joshua-tree walker (a maybe)', 'It spawns saplings: burn or break the trunk.'),
    ('lindwurm', ['lindwurm', 'lindwurm_tail'], 'the big monitor lizards the Vegas exotic-pet trade kept', 'Two bodies and acid blood: hit the head, not the tail.'),
    ('serpent', ['serpent'], None, 'It drags and crushes: never stand alone at the water.'),
    ('ifrit', ['ifrit_small', 'ifrit_medium', 'ifrit_large'], 'the swarm (fought with fire, smoke, water and walls)', 'It splits when hurt: hit it hard once.'),
    ('geist', ['geist'], 'the Amalgamation\'s haunting (rule 134)', 'It screams at your nerve: walk up and hit it.'),
    ('kraken', ['kraken', 'kraken_tentacle', 'kraken_tentacle_enraged'], "the reservoir's thing (Lake Mead)", 'Cut the arms that hold your men, then the body.'),
    ('ijirok', ['the_ijirok'], 'the mammoth (OUT by his fifth votes: every beast survives the Mojave; WORLD replaces it)', 'It freezes and teleports.'),
]
BOSSES = ['kraken', 'the_ijirok', 'the_conqueror', 'the_lorekeeper', 'the_grand_diviner']


def base(i):
    return i.replace('lower_', '').replace('_champion', '')


def build():
    E = json.load(open(os.path.join(BB, 'enemies.json')))['rows']
    O = json.load(open(os.path.join(BB, 'ours.json')))
    names = O['bestiary']['value']['names']
    AW = O['act_weights']['value']
    mix = O['enemy_tiers']['value']['mix']
    heads = O['enemy_tiers']['value'].get('heads', {})
    fielded = {}
    for f, phases in mix.items():
        for ph in phases.values():
            for k in ph: fielded.setdefault(k, set()).add(f)
    for f, k in heads.items(): fielded.setdefault(k, set()).add(f)
    fam_of = {}
    for fid, bbf, skin, lesson in FAMILIES:
        for b in bbf: fam_of[b] = fid
    # a type's family from its normal row's faction (the library files the Lower rows under 'beasts')
    rows_by = {}
    for r in E: rows_by.setdefault(base(r['id']), []).append(r)
    beast_ids = {i for _, ids, _, _ in BEASTS for i in ids}
    types = []
    for k in sorted(rows_by):
        rs = rows_by[k]
        main = [r for r in rs if r['variant'] not in ('lower', 'champion')] or rs
        fac = main[0]['faction']
        fam = MOVED.get(k) or ('beasts' if k in beast_ids else fam_of.get(fac, 'beasts'))
        ids = sorted(r['id'] for r in rs)
        f_ids = sorted(i for i in ids if i in fielded)
        types.append({
            'type': k, 'bb_name': main[0]['name'], 'bb_faction': fac, 'family': fam, 'rows': ids,
            'name': next((names[i] for i in ids if i in names), None),
            'act_weights': next((AW['by_kind'][i] for i in ids if i in AW['by_kind']), AW['default']),
            'fielded': sorted({f for i in f_ids for f in fielded[i]}),
            'champion': any(r['variant'] == 'champion' for r in rs),
            'boss': k in BOSSES,
            'page': main[0].get('source'),
        })
    fams = []
    for fid, bbf, skin, lesson in FAMILIES + [(GHOSTS[0], [], GHOSTS[1], GHOSTS[2])]:
        ts = [t for t in types if t['family'] == fid]
        fams.append({'family': fid, 'bb_factions': bbf, 'skin': skin, 'lesson': lesson, 'types': [t['type'] for t in ts],
                     'in_the_fight': sorted({f for t in ts for f in t['fielded']}), 'draft': True})
    beasts = [{'beast': b, 'rows': ids, 'skin': skin, 'lesson': lesson, 'in_the_fight': any(i in fielded for i in ids),
               'draft': True} for b, ids, skin, lesson in BEASTS]
    count = {'families': len([f for f in fams if f['types']]), 'types': len(types),
             'types_in_the_fight': len([t for t in types if t['fielded']]), 'beasts': len(beasts),
             'bosses': len([t for t in types if t['boss']]), 'champions': len([t for t in types if t['champion']])}
    return {
        '_about': "THE ROSTER (COMBAT [bestiary], rule 42a): every Battle Brothers enemy type in the library, its Bohemia family, the ONE "
                  "lesson the family teaches, its name on the board, its weight in each act, and whether the fight fields it yet. Built by "
                  "tools/bohemia_combat_the_roster.py from enemies.json and ours.json, never by hand; a type's numbers stay on its row in "
                  "enemies.json. Skins, names and lessons not yet in the fight are drafts for WORDS and WORLD (draft: true). A modder adds a "
                  "family to ours.json's enemy_tiers.mix and act_weights and reruns the tool.",
        'floor': {'factions': 12, 'types': 75, 'beasts': 17, 'bosses': 3, 'champions': True,
                  'source': DRAFT, 'quote': 'THE FLOOR FOR BOHEMIA, HIS RULE: at least 12 factions, 75 enemy types, 17 beasts, 3 bosses, and champions.'},
        'count': count,
        'families': fams,
        'beasts': beasts,
        'types': types,
        'source': DRAFT + '; records/target/bb/enemies.json; records/target/bb/ours.json',
    }


if __name__ == '__main__':
    out = json.dumps(build(), indent=1, ensure_ascii=False) + '\n'
    if '--check' in sys.argv:
        ok = os.path.exists(OUT) and open(OUT).read() == out
        print('THE ROSTER: ' + ('fresh' if ok else 'STALE: rerun tools/bohemia_combat_the_roster.py'))
        sys.exit(0 if ok else 1)
    open(OUT, 'w').write(out)
    d = json.loads(out)
    print('THE ROSTER:', json.dumps(d['count']))
