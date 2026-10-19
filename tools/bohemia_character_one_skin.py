#!/usr/bin/env python3
"""CHARACTER [one skin, one person] (rule 120(d), 10/19/26). THE BODY'S SKIN IS THE TRUTH.

His words, 10/18: 'the portraits don't even look alike... Black people looking like white people.'

MEASURED BEFORE ANYTHING WAS TOUCHED (records/BOHEMIA_ONE_SKIN_ONE_PERSON_10_19_26.md):
  every one of the 25 bodies the fight sheets bake (the twelve cast, the thirteen gangs) wore THE PLAYER'S skin,
  porcelain, because famPaintBody hands the renderer the person's face (G.faceAs) but never the person's tone, and
  the body's skin ramp reads the global skinTone (skinRampFor). The 64 face beside it rolled its own tone, PORTRAIT's
  fresh face was picked by eye off that 64, and CHARACTER's rig bodies wore one constant (150, 112, 88) for all
  fourteen. Four renderers, four answers, for one person. Nothing ever stored the person's skin.

THIS FILE IS THAT VALUE. One tone per person, named on the game's own eleven-step ladder (SKIN_TONES), with:
  flat       the ramp the flat body and the flat 64 face draw (copied from SKIN_TONES; the gate checks the copy)
  rig        the style-palette step a rig-made model wears as its skin albedo, BODY AND HEAD ALIKE (one table, below:
             a tone always maps to the same step, so a rig body and the head PORTRAIT puts on it cannot disagree)
  heritage   who the person is (PEOPLE's bank where it named him; the census mix where it did not)
  source     where the value came from, in words
The alpha's look tables (CITY_CAST_LOOKS, FACTION_LOOKS) carry the same tone as `skin:`; the gate binds the two.

Writes records/target/character/BOHEMIA_ONE_SKIN.json (published: the game, PORTRAIT and COOK THREE read it).
Run: python3 tools/bohemia_character_one_skin.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records/target/character/BOHEMIA_ONE_SKIN.json')
ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')
PALETTE = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')

# THE RIG TABLE: tone -> style palette step. MEASURED, not picked: PORTRAIT's thirteen crew faces render their cheek at
# 0.50 to 0.62 of their albedo's luminance (one hard sun and the dust pass), so a rig skin can never reach the flat
# ladder's absolute values at the light end. What it can keep is the ORDER: the eleven tones go onto the fifteen steps
# lightest to darkest, hue nearest within a rank (light tones on skin_light's pink, olive and tan on the warmer mid and
# deep steps). PORTRAIT's own picks land where they already were: its skin_light 3 is porcelain (YOU), skin_mid 2 is
# bronze, skin_deep 2 is deep, skin_deep 3 is tan. The light end stops at skin_light 3: the rig's source pass lifts a
# bright base (wear on a base over 0.55 is not darkened), so skin_light 4 on a body read as a white mask, not a pale man.
RIG = {
    'chalk':     ('skin_light', 3),   # was skin_light 4: on the Anarchists' rig body it rendered a white mask (10/19, measured by eye on rig_S); nothing glows
    'porcelain': ('skin_light', 3),
    'fair':      ('skin_deep', 4),
    'olive':     ('skin_mid', 3),
    'pale':      ('skin_light', 2),
    'tan':       ('skin_deep', 3),
    'bronze':    ('skin_mid', 2),
    'brown':     ('skin_light', 1),
    'deep':      ('skin_deep', 2),
    'ebony':     ('skin_mid', 1),
    'onyx':      ('skin_light', 0),
}

# THE MIX (cited): U.S. Census Bureau QuickFacts, Clark County NV, as PEOPLE rounded it for the names
# (records/BOHEMIA_PEOPLE_THE_NAMES_MIX_10_18_26.md): Hispanic 33, white 36, Black 13, Asian 12, two or more 6.
# Las Vegas city 2020 (Census Dots): white 40.4, Hispanic 33.3, Black 12.3, Asian 7.0, multiracial 5.3.
# His 9/21 on the names: 'a little more percentage of white people... keep it natural... this game isn't a Hispanic game'.
MIX = {'hispanic': 33, 'white': 36, 'black': 13, 'asian': 12, 'mixed': 6}

PEOPLE_BANK = "banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json (PEOPLE [a name for every starred face], draft)"

# THE PEOPLE. id is the fight sheet's look id (slices/fight_people/fight_people.json), which is also the id PORTRAIT's
# crew manifest and the roster use. who/heritage for the crew come from PEOPLE's bank; the gangs from the census mix,
# one representative person per gang (no gang has an ethnicity in canon; the Pures, Panthers, La Familia and Triads are
# social forces INSIDE the factions, records/factions/BOHEMIA_FACTION_SOCIAL_FORCES.md, and stay that).
PEOPLE = [
    # id, tone, heritage, who, why
    ('you', 'porcelain', 'the player', 'YOU',
     "his own: the face maker's skin swatch (HE CAN BUILD HIS OWN FACE); porcelain is the game's default (skinTone = SKIN_TONES[1]); "
     "a portrait of YOU follows the save, never this line"),
    ('cast_longcoat', 'tan', 'hispanic', 'Amaury Carrasco', "PEOPLE's bank; a raider out of Hoover Dam, years on the road in the sun"),
    ('cast_barearms', 'fair', 'white', 'Amos Ferris', "PEOPLE's bank; a block watch from Pahrump, bare arms browned at the forearm"),
    ('cast_pack', 'porcelain', 'white', 'Otis Wexler', "PEOPLE's bank; a brawler from THE TUNNELS, where there is no sun"),
    ('cast_skirt', 'deep', 'black', 'Tasha Hargrove', "PEOPLE's bank; a retired soldier from THE YARDS"),
    ('cast_widebrim', 'pale', 'white', 'Wendell Lund', "PEOPLE's bank; a thief from Jean, under a brim"),
    ('cast_cape', 'olive', 'asian', 'Cyrus Truong', "PEOPLE's bank; an old Vietnamese miner from Searchlight"),
    ('cast_apron', 'fair', 'white', 'Wyatt Hatcher', "PEOPLE's bank; an old desert hunter from Primm"),
    ('cast_poncho', 'bronze', 'hispanic', 'Xiomara Delgado', "PEOPLE's bank; an old butcher from THE PARK; PORTRAIT's skin_mid 2 already"),
    ('cast_bedroll', 'olive', 'hispanic', 'Kai Galvan', "PEOPLE's bank; a poacher from THE CHAPEL"),
    ('cast_shorts', 'tan', 'mixed', 'Hoang Serrano', "PEOPLE's bank (Asian and Hispanic); a caravan hand; PORTRAIT's skin_deep 3 already"),
    ('cast_satchel', 'brown', 'hispanic', 'Javier Escobar', "PEOPLE's bank; a gambler from THE DATAFORT"),
    ('cast_shortcoat', 'chalk', 'white', 'Corinne Emery', "PEOPLE's bank; a daytaler from THE SHOPS; the rust hair and the palest skin go together"),
    ('faction_caravans', 'brown', 'hispanic', 'a Caravans trader', 'the census mix; the man who has walked every road'),
    ('faction_colorful', 'bronze', 'mixed', 'a Colorful', "the census mix; the gang that refuses a single flag; PORTRAIT's skin_mid 2 already"),
    ('faction_anarchists', 'chalk', 'white', 'an Anarchist', 'the census mix; lanky, a night creature'),
    ('faction_blues', 'deep', 'black', 'a Blue', "the census mix; PORTRAIT's skin_deep 2 already"),
    ('faction_homeless', 'fair', 'white', 'a Homeless', 'the census mix'),
    ('faction_church', 'porcelain', 'white', 'a Churchman', "the census mix; PORTRAIT's skin_light 3 already"),
    ('faction_reds', 'olive', 'hispanic', 'a Red', 'the census mix; the money faction'),
    ('faction_cartel', 'tan', 'hispanic', 'a Cartel', 'the census mix'),
    ('faction_trades', 'brown', 'black', 'a Tradesman', 'the census mix'),
    ('faction_mob', 'pale', 'white', 'a Mob man', "the census mix; PORTRAIT's skin_light 2 already"),
    ('faction_network', 'fair', 'asian', 'a Network', 'the census mix'),
    ('faction_volunteers', 'bronze', 'hispanic', 'a Volunteer', 'the census mix'),
    ('faction_remnants', 'fair', 'white', 'a Remnant', 'the census mix; Nellis Gate, the old air base'),
    # COOK THREE's two enemy heads (PORTRAIT drew both on COOK THREE's bodies): kept where they are, the poacher is his star
    ('thug', 'tan', 'hispanic', 'Rogelio Kessler', "PEOPLE's bank; COOK THREE's thug body and PORTRAIT's head both wear (150, 112, 88), skin_deep 3's neighbour"),
    ('poacher', 'tan', 'black', 'Odell Kaminski', "PEOPLE's bank; HIS FIRST STAR: the starred head wears skin_deep 3, and this line keeps it"),
]


def alpha_tones():
    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r'const SKIN_TONES=(\[\[.*?\]\]\]\]);', s)
    return dict((n, r) for n, r in json.loads(m.group(1)))


def main():
    tones = alpha_tones()
    pal = json.load(open(PALETTE))['roles']
    hx = lambda h: [int(h[i:i + 2], 16) for i in (1, 3, 5)]
    people = {}
    count = {}
    for pid, tone, her, who, why in PEOPLE:
        role, step = RIG[tone]
        people[pid] = {'tone': tone, 'heritage': her, 'who': who, 'source': why,
                       'flat': tones[tone], 'rig': [role, step], 'rig_rgb': hx(pal[role]['ramp'][step])}
        if pid != 'you':
            count[her] = count.get(her, 0) + 1
    n = sum(count.values())
    out = {
        'what': "CHARACTER [one skin, one person] (rule 120(d)): ONE skin per person. The body and every face of that person read THIS value; nothing rolls a second one.",
        'his_words': "10/18: 'the portraits don't even look alike... Black people looking like white people.'",
        'lane': 'character', 'date': '10/19/26', 'rule': '120(d)', 'draft': True,
        'how_to_read': {
            'flat': "the flat renderer (the alpha's famPaintBody, the fight sheets, the 64 faces): draw SKIN_TONES[tone], which is `flat` [light, mid, dark]",
            'rig': "a rig-made model (CHARACTER's bodies, PORTRAIT's heads, COOK THREE's tiers): the skin albedo is the style palette step `rig` "
                   "(its RGB as rig_rgb), on the body AND the head, so a head on its own body cannot disagree",
            'match': "a face matches its body when both name the same tone; measured off the pixels, the gate (ONE SKIN, ONE PERSON) "
                     "classes each picture on its own renderer's ladder and refuses a face more than one rung off its body",
            'nobody_listed': "everybody not listed (the crowd, the family) has ONE roll: NPC_FACTORY's skinToneName for a citizen, "
                             "faceFor's kin-blended _tone for the family; the body and the face read that same roll (famPaintBody, 10/19)",
        },
        'mix': {'target_census': MIX, 'source': 'U.S. Census Bureau QuickFacts, Clark County NV (as PEOPLE rounded it); Las Vegas city 2020 (Census Dots)',
                'these_people': dict((k, '%d of %d (%d%%)' % (v, n, round(100.0 * v / n))) for k, v in sorted(count.items()))},
        'rig_table': dict((k, list(v)) for k, v in RIG.items()),
        'ladder': [k for k in tones],
        'people_bank': PEOPLE_BANK,
        'people': people,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(out, open(OUT, 'w'), indent=1)
    print('one skin: %d people -> %s' % (len(people), os.path.relpath(OUT, ROOT)))
    print('  mix: ' + ', '.join('%s %s' % kv for kv in sorted(out['mix']['these_people'].items())))


if __name__ == '__main__':
    main()
