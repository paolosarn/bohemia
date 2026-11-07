#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [more enemy types, their own art] (VAMILY rule 427(b), PAOLO 11/7 'More'; ask lines 286 'more enemy
types with their own art' and 238 'the clothes look good: leather and layering, quality before count').

MEASURED FIRST (11/7): FACTIONS' nine act-one types (records/target/bb/bohemia_enemies.json, 11/3) stand on the board in
people already rendered for somebody else: the House in the Remnants', Blues' and Trades' clothes, the Block Watch in the
Volunteers' and the Colorful's, the Keepers in the Homeless' and the Anarchists', the Water People in the Caravans' and the
Kids' (36 looks, 0 of them their own). FACTIONS named the debt: 'NEW GARMENTS OWED TO CHARACTER' (no Blender in its box).

THE NINE, EACH A LOOK THAT SAYS WHAT HE IS (Battle Brothers reads a brother's kit at a glance: helmet, armour, weapon, and
here each type carries one shape nobody else in the valley wears; the weapon itself is the fight's, drawn in his hand):
  THE HOUSE (a casino's men holding the industrial lots: a formation, act one medieval)
    the CARPET TABARD   the livery cut from the casino floor: a panel front and back to the knee, black with the floor's
                        brass diamonds, a bone border, the House's chip on the chest and the back; over leather
    HOUSE SHIELD        + the HUBCAP KETTLE (a steel pot with a car's hubcap riveted on as the brim: the kettle hat's
                        wide steel brim, the one round silhouette on the board), a gorget, gloves
    HOUSE HOOK          + the MAIL COIF (a hood of steel rings over head and throat, the face cut out, the cape to the shoulders)
    HOUSE CROSSBOW      the short tabard + the BOLT CASE (a cut drain pipe on his hip, five bolts' fletching out of it), bracers
  THE BLOCK WATCH (the suburb's neighbours, the Watch's green)
    NEIGHBOR            his own weekend clothes under the HI-VIS VEST (faded to a sick yellow, two silver bands round it,
                        braces over the shoulders, a dark patch on the back), the FLOOR-MAT GREAVES (a car's rubber mats
                        bent round his shins, bungee cords), half of them in a BIKE HELMET
    CAPTAIN             the vest, the Watch's green SASH, a brass BADGE, the BULLHORN on his hip
  THE KEEPERS (the open desert; their ink a sun-bleached coral)
    FERAL               the COYOTE PELT (the lab coyote's head over his own, its snout and teeth over his brow, the ears up,
                        the lab's tag still in its ear; the pelt down his back to a black-tipped tail; its forelegs
                        knotted on his chest), bare arms in wraps and bracers
    KEEPER              the STRIP CLOAK (two dozen bleached strips from a rope yoke and a rope belt to his knees, cut ragged,
                        one in the Keepers' coral), a head wrap, the axe bandolier
  THE WATER PEOPLE (the pumps and the solar fields; their ink amber)
    CUTTER              the WATER JUG (a five-gallon cooler bottle in amber plastic on his back, the water line showing,
                        woven straps, a hose over his shoulder to a bite valve), robes to the shin, the shemagh, a face wrap
    NEEDLE              the NEEDLE BANDOLIER (a leather band across him, syringes in its loops, dregs in the barrels), a wrap
                        coat, the face hidden

LEATHER AND LAYERING (ask 238; rule 129 as corrected, 10/23: layers that show): every man is three layers or more that read
apart by a value step (a top, a leather or cloth layer over it, the new piece over that, his kit), and leather is the
middle layer wherever the type allows (the House's jackets and vests, the Water People's vests and wrap coats, the Keepers'
bracers, the Watch's gloves and belts). The runway inside the grime: Rick Owens' long black drape (the tabard, the strips),
Balenciaga's oversize (the jug, the vest), Bottega Veneta's woven leather (every strap). Trenchcoats are for badasses: no
trench, no duster, on any of the nine.

THE METHOD, REUSE FIRST (the three enemies' way, tools/bohemia_character_the_three_enemies.py, whose file is never edited):
a type is a look on the rig's man like the thirteen gangs' (LOOKS in tools/bohemia_character_the_thirteen_through_the_rig.py,
entries added IN MEMORY), each man rolled the barber's way (the barber's book roll_one: skin, cut, face, beard, marks on a
stand-in gang's stream) and dressed from this lane's wardrobe (GARMENTS BASE, OUTER, LEGS AND FEET, GEAR 1, HATS 1, the face
pieces), plus the pieces above modelled here as clay on his body (the body build's toolkit: its tube, strips, rings and
bands) or on his skull (the barber's hat door: its shell and the body's surface under it). The hi-vis vest is a new outer
garment registered in memory beside the 74 (OUTER's own vest cut, the colour its own).

THE PIPE (RUN TWO's, imported and never edited): built through the barber, rendered on DIRECTION's master rig the way RUN TWO
renders a person (stand, walk in eight, the portrait and its four mouths), COMBAT's fight poses laid on his model and the
six fight clips rendered, packed into slices/fight_rig/enemy_<id>.webp in his old reference cell (so the guns that sat in
his hands still do), his face onto the fight's face strip, and each type's row in bohemia_enemies.json pointed at its own
men ('looks'), the list the fight deals the type from (ownEnemies: PL[o.id] = o.looks).

Run (bpy 4.2 in a python3.11 venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 pillow numpy):
    python3 tools/bohemia_character_the_nine_enemies.py roll
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_character_the_nine_enemies.py look <id> [<id> ...]   (eight stills)
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_character_the_nine_enemies.py batch [workers]
    python3 tools/bohemia_character_the_nine_enemies.py pack       (the fight's sheets, faces, the rows' looks)
    python3 tools/bohemia_character_the_nine_enemies.py sheet      (records/target/character/the_nine_enemies/*.png)

RULE 128 (every asset carries three acts): the kept scene is this file and the roll; every model is rebuilt from them on
demand, so act two is the same men with the era's cloth swapped in the roll, never a redraw.

REFERENCE CHECK (the 9/4 standing duty; the compare law): the twin is the bar on the wall's man (the thug through the rig,
records/target/cook3/rig/thug/rig_S.png) and the three enemies at the same cell; the real things: a kettle hat, a mail coif,
a herald's tabard, a crossbow bolt case, an ANSI class 2 safety vest, rubber car floor mats, a five-gallon water bottle, a
loaded bandolier, a coyote pelt worn as a hood; the runway names; analog horror AH-01 (the lab's tag in a dead animal's ear,
dregs in a syringe). No reference game.
"""
import json, math, os, random, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_NINE_ENEMIES_ROLL.json')
OUT = 'records/character/enemies_nine_street'     # the street pass (stills, faces): committed, never published (no screen reads them; the fight reads its sheets)
STOW = 'records/character/enemies_nine'           # the walk and the rig's portraits, read by the pack only (regenerated, .gitignore)
FIGHT_RENDERS = 'records/target/combat/rig'       # COMBAT's render folder (regenerated, its .gitignore)
SHEET_DIR = 'records/target/character/the_nine_enemies'
ENEMIES = os.path.join(ROOT, 'records/target/bb/bohemia_enemies.json')
STAMP = 'nine-enemies-11-7'

# ---- THE COLOURS AT THE SOURCE (the grime is the rig's source pass) ------------------------------------------------------
SOOT, CARPET, BRASS, BONE = (30, 28, 27), (34, 30, 30), (146, 114, 58), (178, 168, 142)
STEEL, STEEL_DK, STEEL_LT, RUSTED = (108, 106, 100), (62, 60, 58), (150, 148, 140), (106, 70, 46)
WOVEN = (132, 92, 56)              # Bottega's tan, woven: every strap
HIVIS = dict(dk=(122, 124, 64), mid=(166, 166, 90), lt=(196, 196, 128))
SILVER = (176, 176, 170)
WATCH_GREEN = (44, 86, 58)         # the Block Watch's ink (#006432) a value up and dusted
CORAL = (178, 120, 104)            # the Keepers' ink (#ffa591) bleached by the sun
AMBER, AMBER_LT, AMBER_DK = (112, 72, 28), (160, 128, 80), (80, 52, 24)   # the Water People's ink (#a06400)
RUBBER, RUBBER_LT = (34, 33, 32), (58, 56, 54)
PVC = (134, 130, 120)
# loop 2 (looking, keeper_feral_0 x4): at (146, 116, 80) the rig's up-face dust took the pelt to a pale egg; a coyote reads
# by a grizzled grey-brown back over tan, a dark saddle and black tips, so the pelt is a value darker and its saddle darker again
COYOTE, COYOTE_DK, COYOTE_LT, FUR_TIP = (118, 90, 60), (64, 52, 42), (150, 124, 88), (32, 28, 26)
TOOTH, TAG = (196, 186, 160), (176, 150, 58)
LEATHER_DK = (60, 44, 32)
BARREL, DREGS, CAP_ORANGE = (196, 196, 186), (96, 40, 36), (168, 96, 44)

# ---- THE NINE TYPES ---------------------------------------------------------------------------------------------------
# each: what he is; the stand-in gang whose stream rolls his skin, cut and face; the fight cell he takes (his old look's
# reference gang, so the guns that sat in his hands still do); his body dials; per man his top, coat, legs, feet, kit, hat,
# face piece and the new pieces, every list as long as the type's count; the cuts a hat or a hood allows
TYPES = {
    'House Shield': dict(
        row='house_shield', faction='house', stand_in='Remnants', cell='faction_remnants', count=3,
        what='the House\'s front man: a casino-carpet tabard over leather, a hubcap kettle hat, a gorget',
        dials=[dict(height=0.30, belly=0.20, shoulders=0.55, hips=0.10), dict(height=0.10, belly=0.45, shoulders=0.70, hips=0.20),
               dict(height=0.45, belly=0.05, shoulders=0.60, hips=0.05)],
        tops=['CHARCOAL TURTLENECK', 'BONE TURTLENECK', 'FADED BLACK LONGSLEEVE'],
        coats=['LEATHER JACKET', 'LEATHER VEST', 'LEATHER JACKET'],
        legs=['LEATHER STACK PANT', 'SOOT CARGOS', 'BLACK DENIM'],
        feet=['TALL MOTO BOOTS', 'LEATHER STACK BOOT', 'CHARCOAL BOOTS'],
        # batch (looking, house_shield_1): STEEL SHIN GUARDS rendered two blue patches on his shins (rule 159, as the Heavy's did): rust scrap guards
        kit=[['SOOT GORGET', 'LEATHER GLOVES'], ['RUST GORGET', 'SOOT GLOVES', 'SHIN GUARDS'], ['SOOT GORGET', 'LEATHER GLOVES']],
        hats=['HUBCAP KETTLE'] * 3, eyewear=[None, None, None],
        pieces=[['tabard']] * 3, cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER', 'DEEP TAPER']),
    'House Hook': dict(
        row='house_hook', faction='house', stand_in='Blues', cell='faction_blues', count=3,
        what='the House\'s polearm man: a mail coif over head and throat, the carpet tabard over a leather jacket',
        dials=[dict(height=0.55, belly=-0.20, shoulders=0.30, hips=-0.10), dict(height=0.35, belly=0.10, shoulders=0.40, hips=0.0),
               dict(height=0.65, belly=-0.30, shoulders=0.20, hips=-0.15)],
        tops=['FADED BLACK LONGSLEEVE', 'CHARCOAL TURTLENECK', 'ASH LONGLINE TEE'],
        coats=['LEATHER JACKET', 'WORK JACKET', 'LEATHER JACKET'],
        legs=['SOOT CARGOS', 'LEATHER STACK PANT', 'BLACK CARGOS'],
        feet=['FIELD BOOTS', 'TALL MOTO BOOTS', 'STACKED SOLE BOOT'],
        kit=[['LEATHER GLOVES', 'WORN BRACERS'], ['SOOT GLOVES'], ['LEATHER GLOVES', 'SCAV KNEEPADS']],
        hats=['MAIL COIF'] * 3, eyewear=[None, None, None],
        pieces=[['tabard']] * 3, cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER', 'RAZOR SKULL']),
    'House Crossbow': dict(
        row='house_crossbow', faction='house', stand_in='Trades', cell='faction_trades', count=3,
        what='the House\'s crossbowman: a short carpet tabard over a leather vest, a bolt case on his hip, bracers',
        dials=[dict(height=0.0, belly=-0.20, shoulders=0.0, hips=0.0), dict(height=-0.15, belly=0.10, shoulders=0.10, hips=0.10),
               dict(height=0.20, belly=-0.35, shoulders=-0.10, hips=-0.10)],
        tops=['BONE BUTTON-UP', 'CHARCOAL TURTLENECK', 'KHAKI BUTTON-UP'],
        coats=['LEATHER VEST', 'LEATHER JACKET', 'QUILTED VEST'],
        legs=['BLACK CARGOS', 'LEATHER STACK PANT', 'DUST TROUSERS'],
        feet=['CHARCOAL BOOTS', 'TALL MOTO BOOTS', 'FIELD BOOTS'],
        kit=[['OXBLOOD BRACERS', 'LEATHER GLOVES'], ['WORN BRACERS', 'SOOT GLOVES'], ['OXBLOOD BRACERS', 'LEATHER BELT']],
        hats=['HAT CHARCOAL WATCH CAP', 'HAT DUST WORK CAP', None], eyewear=[None, 'FACE GREY WRAPAROUNDS', None],
        pieces=[['tabard_short', 'boltcase']] * 3, cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER', 'GREASE BACK', 'DEEP TAPER']),
    'Neighbor': dict(
        row='watch_neighbor', faction='watch', stand_in='Volunteers', cell='faction_volunteers', count=6,
        what='a neighbour in his weekend clothes under a faded hi-vis vest, car floor mats bent round his shins, a bike helmet',
        dials=[dict(height=0.10, belly=0.70, shoulders=0.10, hips=0.40), dict(height=-0.20, belly=0.20, shoulders=-0.10, hips=0.20),
               dict(height=0.40, belly=-0.20, shoulders=0.10, hips=0.0), dict(height=-0.05, belly=0.90, shoulders=0.20, hips=0.50),
               dict(height=0.25, belly=0.40, shoulders=0.30, hips=0.20), dict(height=-0.35, belly=0.0, shoulders=-0.20, hips=0.10)],
        tops=['DUST PLAID SHIRT', 'SAND HOODIE', 'FOREST PLAID FLANNEL', 'OLIVE HOODIE', 'BONE HENLEY', 'GREEN FLANNEL'],
        coats=['HI-VIS VEST'] * 6,
        legs=['KHAKI CARGOS', 'GREY SWEATS', 'DUST BROWN TROUSERS', 'KHAKI CARGOS', 'PATCHED WORK PANTS', 'BLACK DENIM'],
        feet=['WHITE SNEAKERS', 'GREY SNEAKERS', 'BROWN BOOTS', 'BONE SNEAKERS', 'RANCH BOOTS', 'FIELD BOOTS'],
        kit=[['LEATHER GLOVES'], ['WORK SUSPENDERS'], ['DUST GLOVES', 'ELBOW PADS'], ['LEATHER BELT'], ['LEATHER GLOVES', 'SAND KNEEPADS'], ['DUST GLOVES']],
        hats=['BIKE HELMET BONE', 'HAT DUST WORK CAP', 'BIKE HELMET RED', None, 'BIKE HELMET ASH', 'HAT OLIVE KNIT CAP'],
        eyewear=[None, None, None, 'FACE WRAPAROUND SHADES', None, None],
        pieces=[['hivis', 'floormats'], ['hivis', 'floormats'], ['hivis'], ['hivis', 'floormats'], ['hivis', 'floormats'], ['hivis']],
        cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER', 'DEEP TAPER', 'GREASE BACK', 'RAZOR SKULL']),
    'Captain': dict(
        row='watch_captain', faction='watch', stand_in='Church', cell='faction_church', count=2,
        what='the Watch\'s captain: the hi-vis vest under the Watch\'s green sash, a brass badge, the bullhorn on his hip',
        dials=[dict(height=0.35, belly=0.50, shoulders=0.50, hips=0.30), dict(height=0.20, belly=0.30, shoulders=0.60, hips=0.20)],
        tops=['KHAKI BUTTON-UP', 'BONE BUTTON-UP'],
        coats=['HI-VIS VEST', 'HI-VIS VEST'],
        legs=['KHAKI CARGOS', 'DUST BROWN TROUSERS'],
        feet=['RANCH BOOTS', 'BROWN BOOTS'],
        kit=[['LEATHER GLOVES', 'LEATHER BELT'], ['LEATHER BELT']],
        hats=['HAT DUST WORK CAP', 'HAT DUST WORK CAP'], eyewear=['FACE WRAPAROUND SHADES', None],   # loop 1: the olive field cap's flat crown rendered as a hollow tube
        pieces=[['hivis', 'sash', 'badge', 'bullhorn']] * 2, cuts=['TEMPLE TAPER', 'DRY TAPER', 'DEEP TAPER']),
    'Feral': dict(
        row='keeper_feral', faction='keepers', stand_in='Homeless', cell='faction_homeless', count=2,
        what='the Keepers\' berserker: a lab coyote\'s pelt worn as his head and his cape, bare arms in wraps and bracers',
        dials=[dict(height=0.60, belly=0.10, shoulders=1.00, hips=0.20), dict(height=0.45, belly=0.30, shoulders=0.90, hips=0.30)],
        tops=['BLACK TANK', 'TATTERED TEE'],
        coats=[None, None],
        legs=['LEATHER STACK PANT', 'RUST CARGOS'],
        feet=['WRAPPED BOOTS', 'SANDWALKERS'],
        kit=[['HAND WRAPS', 'OXBLOOD BRACERS', 'LEAD WAIST WRAP'], ['SOOT HAND WRAPS', 'WORN BRACERS', 'WIDE WAIST WRAP']],
        hats=['COYOTE PELT', 'COYOTE PELT'], eyewear=[None, None],
        pieces=[['pelt_legs'], ['pelt_legs']], outfit=False, cuts=['RAZOR SKULL', 'HOME CLIPPERS', 'TEMPLE TAPER']),
    'Keeper': dict(
        row='keeper_thrall', faction='keepers', stand_in='Anarchists', cell='faction_anarchists', count=4,
        what='a Keeper: a cloak of bleached strips from a rope yoke and a rope belt, a head wrap, the axe bandolier',
        dials=[dict(height=0.30, belly=-0.40, shoulders=0.10, hips=-0.20), dict(height=0.10, belly=-0.20, shoulders=0.30, hips=0.0),
               dict(height=0.50, belly=-0.50, shoulders=0.0, hips=-0.20), dict(height=-0.10, belly=-0.10, shoulders=0.20, hips=0.10)],
        tops=['SCAVENGER FLANNEL', 'ASH LAYERED TEE', 'TATTERED TEE', 'SAND HOODIE'],   # loop 2: TATTERED FLANNEL is a steel-blue plaid (rule 159)
        coats=[None, None, None, None],
        legs=['DUST TROUSERS', 'RUST CARGOS', 'BONE DROP TROUSER', 'DUST BROWN TROUSERS'],
        feet=['WRAPPED BOOTS', 'SANDWALKERS', 'WRAPPED BOOTS', 'ASH SLOUCH BOOT'],
        kit=[['DUST BROWN BANDOLIER', 'HAND WRAPS', 'OXBLOOD BRACERS'], ['SOOT HAND WRAPS', 'WORN BRACERS'], ['DUST BROWN BANDOLIER', 'WORN BRACERS'],
             ['SOOT HAND WRAPS', 'OXBLOOD BRACERS']],
        hats=['HAT DESERT SHEMAGH', 'HAT BONE HEAD WRAP', None, 'HAT SOOT HEAD WRAP'],
        eyewear=['FACE ASH FACE WRAP', None, 'FACE BONE DUST MASK', None],
        pieces=[['strips']] * 4, outfit=False, cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER', 'SHORT ROPES', 'STATIC']),
    'Cutter': dict(
        row='water_cutter', faction='water', stand_in='Caravans', cell='faction_caravans', count=4,
        what='a Water man: robes to the shin under a leather vest, a five-gallon amber water jug on his back, a hose to his mouth',
        dials=[dict(height=0.50, belly=-0.40, shoulders=0.0, hips=-0.20), dict(height=0.30, belly=-0.20, shoulders=0.10, hips=-0.10),
               dict(height=0.65, belly=-0.50, shoulders=-0.10, hips=-0.25), dict(height=0.20, belly=-0.10, shoulders=0.20, hips=0.0)],
        tops=['BONE TURTLENECK', 'SAND HOODIE', 'BONE HENLEY', 'ASH LAYERED TEE'],
        coats=['LEATHER VEST', 'RUST VEST', 'LEATHER WRAP COAT', 'LEATHER VEST'],
        legs=['ANKLE WRAP SKIRT', 'DUST TROUSERS', 'WRAP SKIRT', 'BONE WIDE TROUSER'],
        feet=['SANDWALKERS', 'WRAPPED BOOTS', 'DUST BROWN BOOTS', 'SANDWALKERS'],
        kit=[['LEATHER GLOVES'], ['HAND WRAPS', 'HIP SASH'], ['LEATHER GLOVES'], ['SOOT HAND WRAPS', 'HIP SASH']],
        hats=['HAT DESERT SHEMAGH', 'HAT DESERT SHEMAGH', 'HAT BONE HEAD WRAP', 'HAT DESERT SHEMAGH'],
        eyewear=['FACE FACE WRAP', 'FACE ASH FACE WRAP', 'FACE FACE WRAP', 'FACE BONE DUST MASK'],
        pieces=[['jug']] * 4, robe=[0.26, 0.30, 0.26, 0.28], cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER']),
    'Needle': dict(
        row='water_needle', faction='water', stand_in='Colorful', cell='faction_colorful', count=3,
        what='a Water poisoner: a leather bandolier of syringes across a wrap coat, the face hidden',
        dials=[dict(height=-0.30, belly=-0.50, shoulders=-0.40, hips=0.10), dict(height=0.10, belly=-0.40, shoulders=-0.20, hips=0.0),
               dict(height=-0.10, belly=-0.55, shoulders=-0.30, hips=0.05)],
        tops=['CHARCOAL TURTLENECK', 'ASH HOODIE', 'BONE SHOULDER SHIRT'],
        coats=['ASH WRAP COAT', 'LEATHER WRAP COAT', 'WRAP COAT'],
        legs=['DROP RISE TROUSER', 'CHARCOAL CROP TROUSER', 'BONE DROP TROUSER'],
        feet=['WRAPPED BOOTS', 'SANDWALKERS', 'ASH SLOUCH BOOT'],
        kit=[['SOOT HAND WRAPS'], ['HAND WRAPS'], ['SOOT HAND WRAPS', 'OXBLOOD BRACERS']],
        hats=[None, 'HAT SOOT HEAD WRAP', 'HAT DESERT SHEMAGH'], eyewear=['FACE CHARCOAL DUST MASK', 'FACE OXBLOOD DUST MASK', 'FACE FACE WRAP'],
        pieces=[['syringes']] * 3, cuts=['TEMPLE TAPER', 'HALF SHAVE', 'CURTAIN CUT', 'SHORT ROPES']),
}
ORDER = list(TYPES)
POOL = {t: TYPES[t]['row'] for t in ORDER}
NEW_HATS = ('HUBCAP KETTLE', 'MAIL COIF', 'COYOTE PELT', 'BIKE HELMET BONE', 'BIKE HELMET RED', 'BIKE HELMET ASH')
HELMET_SHELL = {'BIKE HELMET BONE': (180, 174, 158), 'BIKE HELMET RED': (138, 64, 52), 'BIKE HELMET ASH': (112, 110, 104)}


def sstep(a, b, t):
    if a == b: return 1.0 if t >= b else 0.0
    x = max(0.0, min(1.0, (t - a) / (b - a))); return x * x * (3 - 2 * x)


def pid_of(t, k): return '%s_%d' % (POOL[t], k)


# ---- THE NEW GARMENT IN THE WARDROBE (in memory, beside OUTER's 74) --------------------------------------------------------
def register_garments():
    import bohemia_character_garments_outer as OUTER
    if 'HI-VIS VEST' in OUTER.BY: return
    G = dict(OUTER.BY['OLIVE VEST'])   # OUTER's own plain vest cut (no pouches, no quilting): the colour is the new thing
    G.update(name='HI-VIS VEST', tag='outer_hi_vis_vest', ramp='HIVIS', words=['HI', 'VEST', 'VIS'], **HIVIS)
    OUTER.BY['HI-VIS VEST'] = G


def look_entry(t, i):
    import bohemia_character_the_thirteen_through_the_rig as CH
    T = TYPES[t]
    return dict(order=400 + ORDER.index(t), shape=T['what'], dials=dict(T['dials'][i % len(T['dials'])]),
                worn=dict(hair='TEMPLE TAPER'), hair=dict(style='taper', colour=CH.HAIR_DARK),
                shirt=dict(colour=(60, 58, 54), sleeve='long'), trousers=dict(colour=(44, 42, 40), wide=0.012),
                shoes=dict(colour=SOOT, kind='boot', top=0.22))


def register():
    import bohemia_character_the_thirteen_through_the_rig as CH
    for t in ORDER:
        if t not in CH.LOOKS: CH.LOOKS[t] = look_entry(t, 0)


# ---- THE ROLL ---------------------------------------------------------------------------------------------------------
def roll():
    import bohemia_character_the_barbers_book as BB
    B = json.load(open(BB.BOOK))
    people = []
    for t in ORDER:
        T = TYPES[t]; seen = set(); i = 0; got = 0
        while got < T['count']:
            P = BB.roll_one(B, T['stand_in'], 'nine:%s:%d' % (t, i)); i += 1
            rng = random.Random('nine enemies:%s:%d' % (t, got)); k = got
            P['id'] = pid_of(t, k); P['gang'] = t; P['type'] = t
            P['hair_cut'] = T['cuts'][(k * 3 + rng.randrange(len(T['cuts']))) % len(T['cuts'])]
            P['top'] = T['tops'][k]
            if T['coats'][k]: P['coat'] = T['coats'][k]
            else: P.pop('coat', None)
            P['legs'] = T['legs'][k]; P['feet'] = T['feet'][k]; P['kit'] = list(T['kit'][k])
            P.pop('hat', None); P.pop('eyewear', None)
            if T['hats'][k]: P['hat'] = T['hats'][k]
            if T['eyewear'][k]: P['eyewear'] = T['eyewear'][k]
            if T['hats'][k] in ('MAIL COIF', 'COYOTE PELT', 'HUBCAP KETTLE') or (T['hats'][k] or '').startswith('BIKE'):
                for f in ('facial_hair', 'beard', 'new_beard'): pass   # a beard stays: it shows under every one of them
            P['pieces'] = list(T['pieces'][k]); P['dials'] = T['dials'][k]
            if T.get('robe'): P['robe'] = T['robe'][k]
            key = BB.key(P) + (P['top'], P.get('coat'), t)
            if key in seen: continue
            seen.add(key); people.append(P); got += 1
    os.makedirs(os.path.dirname(ROLL), exist_ok=True)
    json.dump(people, open(ROLL, 'w'), indent=1)
    print('rolled', len(people), '->', os.path.relpath(ROLL, ROOT))
    for P in people: print(' ', P['id'], P['tone'], P['hair_cut'], '|', P['top'], '/', P.get('coat'), '|', P['legs'], '/', P['feet'], '|', P['kit'], P.get('hat'), P.get('eyewear'), P['pieces'])


# ======================================================================================================================
# THE NEW PIECES ON THE BODY (called inside the body build with its locals, after his garments)
# ======================================================================================================================
def body_pieces(names, X, spec):
    import bohemia_character_garments_base as BASE
    if not names: return []
    K_ = BASE.kit(X)
    V, M, P_, fam_v = K_['V'], K_['M'], K_['P'], K_['fam_v']
    band, ring_pts, new_obj, finish, front, strip, surf = K_['band'], K_['ring_pts'], K_['new_obj'], K_['finish'], K_['front'], K_['strip'], K_['surf']
    bvh = K_['bvh']; bmesh = X['bmesh']; arm = X['arm']; section = X['section']; tube = X['tube']; L = X['L']; mat = X['mat']
    Aw = arm.matrix_world
    full = lambda bn: next(b.name for b in arm.data.bones if b.name.endswith(bn) or b.name == bn)
    joint = lambda bn: Aw @ arm.data.bones[full(bn)].head_local
    worn = L.get('worn') or {}
    over = 0.022 if worn.get('outer') else 0.0
    made = []

    def paint(o, rules):
        """more cloths on a piece: rules [(colour, test(world centre, face)), ...], the first test that passes wins"""
        idx = []
        for k, (col, _) in enumerate(rules):
            o.data.materials.append(mat('%s_m%d' % (o.name, k), col)); idx.append(len(o.data.materials) - 1)
        for f in o.data.polygons:
            c = M @ f.center
            for k, (_, test) in enumerate(rules):
                if test(c, f): f.material_index = idx[k]; break
        return o

    def solid(key, bm, colour, bone, subdiv=1):
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        o = new_obj(bm, key)
        for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
        if isinstance(bone, dict):
            for bn, w in bone.items():
                vg = o.vertex_groups.new(name=full(bn)); vg.add(list(range(len(o.data.vertices))), w, 'REPLACE')
        else:
            vg = o.vertex_groups.new(name=full(bone)); vg.add(list(range(len(o.data.vertices))), 1.0, 'REPLACE')
        return finish(o, colour, key, subdiv, 0)

    def weighted(o, wfn):
        for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
        groups = {}
        for v in o.data.vertices:
            for bn, w in wfn(M @ v.co).items():
                if w <= 1e-4: continue
                if bn not in groups: groups[bn] = o.vertex_groups.new(name=full(bn))
                groups[bn].add([v.index], w, 'REPLACE')
        return o

    def torso_w(p):
        a3 = sstep(0.90, 1.00, p.z); a1 = sstep(0.80, 0.70, p.z)
        return {'torso_joint_3': a3, 'Skeleton_torso_joint_1': a1, 'Skeleton_torso_joint_2': max(0.0, 1.0 - a3 - a1)}

    def box(bm, c, ax, ay, az):
        r = bmesh.ops.create_cube(bm, size=2.0)
        for v in r['verts']:
            x, y, z = v.co; v.co = c + ax * x + ay * y + az * z

    def cyl(bm, p0, p1, r0, r1=None, seg=12):
        d = p1 - p0; q = d.normalized().to_track_quat('Z', 'Y')
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r0, radius2=r0 if r1 is None else r1, depth=d.length)
        for v in res['verts']: v.co = (p0 + p1) * 0.5 + q @ v.co

    def ball(bm, c, r, seg=10, ring=6, sq=(1, 1, 1)):
        res = bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=ring, radius=r)
        for v in res['verts']: v.co = c + V((v.co.x * sq[0], v.co.y * sq[1], v.co.z * sq[2]))

    def pipe(bm, pts, r, seg=10):
        for a, b in zip(pts, pts[1:]): cyl(bm, a, b, r, seg=seg)
        for p in pts[1:-1]: ball(bm, p, r, seg=seg, ring=5)

    def ribbon(key, pts, wid, th, colour, seg=8):
        """an open band along ring points (a band that stops at the vest's open front)"""
        bm = bmesh.new(); n = len(pts); R_ = []
        for i, (p, d) in enumerate(pts):
            t = (pts[min(n - 1, i + 1)][0] - pts[max(0, i - 1)][0]).normalized(); nn = (d - t * d.dot(t)).normalized(); bb = t.cross(nn).normalized()
            R_.append([bm.verts.new(p + bb * (0.5 * wid * math.cos(2 * math.pi * j / seg)) + nn * ((0.5 + 0.5 * math.sin(2 * math.pi * j / seg)) * th))
                       for j in range(seg)])
        for i in range(n - 1):
            for j in range(seg):
                bm.faces.new((R_[i][j], R_[i][(j + 1) % seg], R_[i + 1][(j + 1) % seg], R_[i + 1][j]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        return finish(new_obj(bm, key), colour, key, 1, 0)

    def tilted(z_c, slope, off):
        o = V((0.0, -0.004, z_c)); u = V((0.24 * slope, 0.0, -0.44)).normalized()
        return ring_pts(o, u, V((0, -1, 0)), n=64, off=off)

    def leg_c(z, sx):
        pts = [p for p, fm in zip(P_, fam_v) if fm in ('thigh', 'shin', 'foot') and p.x * sx > 0 and abs(p.z - z) < 0.03]
        if not pts: return V((sx * 0.08, -0.02, z)), 0.06
        c = V((sum(p.x for p in pts) / len(pts), sum(p.y for p in pts) / len(pts), z))
        return c, max(math.hypot(p.x - c.x, p.y - c.y) for p in pts)

    cy_t = section(0.95, ('torso',))['cy']
    ang = lambda p: math.atan2(p.y - cy_t, p.x) % (2 * math.pi)        # 270 degrees is his front (-y)
    FRONT, BACK = 1.5 * math.pi, 0.5 * math.pi

    for nm in names:
        # ---- THE CARPET TABARD (the House): a panel front and back, black with the casino floor's brass diamonds, a bone
        # border, the House's chip; shoulder seams over the top; a woven belt over it at the waist
        if nm in ('tabard', 'tabard_short'):
            short = nm == 'tabard_short'
            hem_z = 0.50 if short else 0.33
            HW = 0.60                                                     # each panel's half-width in radians round the body
            ok = lambda a, z: min(abs(a - FRONT), abs(a - BACK)) < HW
            lift = 0.028 + over
            g = tube('tabard', 1.07, lambda a: hem_z + 0.012 * math.sin(5 * a), lambda z: lift + 0.040 * sstep(0.70, hem_z, z), CARPET,
                     ang_ok=ok, segs=144, ring_dz=0.012, thick=0.006)
            def border(c, f):
                a = ang(c); off_c = min(abs(a - FRONT), abs(a - BACK))
                # loop 1 (looking, x6): a 4 cm hem and 8.5 cm sides in bone outweighed the black; the border a third thinner
                return c.z < hem_z + 0.030 or off_c > HW - 0.065
            def chip_ring(c, f, back=False):
                cz, R_ = (0.93, 0.060) if not back else (0.92, 0.085)
                a = ang(c); fr = abs(a - (BACK if back else FRONT)) < HW
                d = math.hypot(c.x, c.z - cz)
                return fr and (R_ * 0.55 < d < R_)
            def chip_mid(c, f, back=False):
                cz, R_ = (0.93, 0.060) if not back else (0.92, 0.085)
                a = ang(c); fr = abs(a - (BACK if back else FRONT)) < HW
                return fr and math.hypot(c.x, c.z - cz) < R_ * 0.22
            def diamond(c, f):
                u, w = c.x / 0.072, (c.z - 0.02) / 0.072
                return abs((u % 1.0) - 0.5) + abs((w % 1.0) - 0.5) < 0.17
            paint(g, [(BONE, border), (BONE, chip_ring), (BONE, lambda c, f: chip_ring(c, f, True)),
                      (BRASS, chip_mid), (BRASS, lambda c, f: chip_mid(c, f, True)), (BRASS, diamond)])
            made.append(g)
            # the shoulder seams: the cloth over each shoulder from the front panel's top to the back's
            for sx in (1, -1):
                x0 = sx * 0.075
                pth = [V((x0, -0.20, 1.06)), V((x0 * 1.05, -0.08, 1.12)), V((x0 * 1.1, cy_t, 1.15)), V((x0 * 1.05, 0.10, 1.12)), V((x0, 0.20, 1.06))]
                made.append(weighted(strip('tabard_shoulder_%d' % (sx > 0), [pth], 0.085, lift - 0.004, CARPET, across=6), lambda p: {'torso_joint_3': 1.0}))
            # the woven belt over the tabard
            ring = ring_pts(V((0.0, section(0.73, ('torso',))['cy'], 0.73)), V((1, 0, 0)), V((0, -1, 0)), n=72, off=lift + 0.008)
            made.append(weighted(band('tabard_belt', [ring], 0.042, 0.012, WOVEN, groove=lambda a: 0.003 * max(0.0, math.cos(44 * a)) ** 2), torso_w))
            bm = bmesh.new(); bc = front(0.0, 0.73) + V((0, -(lift + 0.020), 0))
            box(bm, bc, V((0.026, 0, 0)), V((0, 0.006, 0)), V((0, 0, 0.024)))
            made.append(solid('tabard_buckle', bm, BRASS, 'Skeleton_torso_joint_1', 1))

        # ---- THE BOLT CASE (the House's crossbowman): a cut drain pipe behind his right hip, five bolts' fletching out
        elif nm == 'boltcase':
            s_ = section(0.70, ('torso',))
            base = V((-(s_['rx'] * 0.72), s_['cy'] + s_['back'] + 0.050 + over, 0.48))
            top = base + V((-0.030, 0.050, 0.36))
            bm = bmesh.new(); cyl(bm, base, top, 0.040, seg=16)
            g = solid('boltcase', bm, PVC, 'Skeleton_torso_joint_1', 1)
            ax_ = (top - base).normalized()
            paint(g, [(RUSTED, lambda c, f: (c - base).dot(ax_) > 0.33 or (c - base).dot(ax_) < 0.02)])   # the taped rims
            made.append(g)
            bm = bmesh.new(); cyl(bm, top - ax_ * 0.004, top + ax_ * 0.010, 0.044, seg=16)
            made.append(solid('boltcase_lip', bm, RUSTED, 'Skeleton_torso_joint_1', 0))
            rng = random.Random(spec.get('id', 'x'))
            for i in range(5):
                a = 2 * math.pi * i / 5 + 0.4
                q = top + V((math.cos(a) * 0.020, math.sin(a) * 0.020, 0)) + ax_ * 0.004
                tip = q + ax_ * (0.08 + 0.025 * rng.random()) + V((math.cos(a) * 0.012, math.sin(a) * 0.012, 0))
                bm = bmesh.new(); cyl(bm, q, tip, 0.004, seg=6)
                made.append(solid('bolt_%d' % i, bm, (70, 60, 48), 'Skeleton_torso_joint_1', 0))
                bm = bmesh.new(); u = V((math.cos(a), math.sin(a), 0))
                box(bm, tip - ax_ * 0.022, u * 0.012, u.cross(ax_).normalized() * 0.002, ax_ * 0.018)
                made.append(solid('fletch_%d' % i, bm, BONE if i % 2 else (124, 50, 44), 'Skeleton_torso_joint_1', 0))
            # its strap up to the belt
            bm = bmesh.new(); pipe(bm, [top - ax_ * 0.05 + V((0.035, -0.02, 0)), V((-(s_['rx'] * 0.50), s_['cy'] + s_['back'] + 0.02 + over, 0.76))], 0.010, seg=8)
            made.append(solid('boltcase_strap', bm, WOVEN, 'Skeleton_torso_joint_1', 0))

        # ---- THE HI-VIS VEST'S BANDS (the Watch): two silver bands round it, the open front left open; braces over the
        # shoulders; a dark patch on the back where WATCH was printed
        elif nm == 'hivis':
            vo = over + 0.012
            for z in (0.80, 0.88):
                ring = ring_pts(V((0.0, section(z, ('torso',))['cy'], z)), V((1, 0, 0)), V((0, -1, 0)), n=96, off=vo)
                k0 = [i for i, (p, d) in enumerate(ring) if abs(ang(p) - FRONT) < 0.42]
                # the ring rotated so the open front is its two ends
                start = (max(k0) + 1) % len(ring) if k0 else 0
                rr = [ring[(start + i) % len(ring)] for i in range(len(ring))]
                rr = [pd for pd in rr if abs(ang(pd[0]) - FRONT) >= 0.42]
                made.append(weighted(ribbon('hivis_band_%d' % int(z * 100), rr, 0.034, 0.008, SILVER), torso_w))
            for sx in (1, -1):
                x0 = sx * 0.088
                pth = [V((x0, -0.30, 0.79)), V((x0, -0.20, 0.95)), V((x0 * 1.05, -0.10, 1.11)), V((x0 * 1.1, cy_t, 1.15)), V((x0 * 1.05, 0.10, 1.11)),
                       V((x0, 0.20, 0.95)), V((x0, 0.30, 0.79))]
                made.append(weighted(strip('hivis_brace_%d' % (sx > 0), [pth], 0.032, vo + 0.006, SILVER, across=5), torso_w))
            bm = bmesh.new(); pb = front(0.0, 0.99, side=1) + V((0, vo + 0.012, 0))
            box(bm, pb, V((0.075, 0, 0)), V((0, 0.003, 0)), V((0, 0, 0.032)))
            made.append(weighted(solid('hivis_patch', bm, (46, 48, 40), 'torso_joint_3', 0), torso_w))

        # ---- THE FLOOR-MAT GREAVES (the Watch): a car's rubber mat bent round the front of each shin, ribbed, two bungees
        elif nm == 'floormats':
            for sx, side in ((1, 'L'), (-1, 'R')):
                bn = 'leg_joint_%s_2' % side
                bm = bmesh.new(); rows = []
                NZ, NA = 16, 14
                for j in range(NZ + 1):
                    z = 0.15 + 0.30 * j / NZ; c, r = leg_c(z, sx); row = []
                    for i in range(NA + 1):
                        t = math.radians(-105 + 210 * i / NA)
                        rr_ = r + 0.016 + 0.004 * math.cos(t)
                        row.append(bm.verts.new(V((c.x + math.sin(t) * rr_, c.y - math.cos(t) * rr_, z))))
                    rows.append(row)
                for j in range(NZ):
                    for i in range(NA):
                        bm.faces.new((rows[j][i], rows[j][i + 1], rows[j + 1][i + 1], rows[j + 1][i]))
                bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
                o = new_obj(bm, 'floormat_%s' % side)
                for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
                vg = o.vertex_groups.new(name=full(bn)); vg.add(list(range(len(o.data.vertices))), 1.0, 'REPLACE')
                o = finish(o, RUBBER, 'floormat_%s' % side, 0, 0.008)
                paint(o, [(RUBBER_LT, lambda c, f: int((c.z - 0.15) / 0.0375) % 2 == 1)])
                made.append(o)
                for z, col in ((0.21, (128, 54, 44)), (0.39, (92, 96, 52))):
                    c, r = leg_c(z, sx)
                    ring = ring_pts(c, V((1, 0, 0)), V((0, -1, 0)), n=32, off=0.030)
                    made.append(weighted(band('bungee_%s_%d' % (side, int(z * 100)), [ring], 0.010, 0.008, col, seg=6), lambda p, bn=bn: {bn: 1.0}))
                    bm = bmesh.new(); hp = V((c.x + sx * 0.02, c.y - r - 0.035, z))
                    pipe(bm, [hp + V((0, 0, 0.012)), hp + V((0, -0.008, 0.0)), hp + V((0, -0.002, -0.012))], 0.0035, seg=6)
                    made.append(solid('bungee_hook_%s_%d' % (side, int(z * 100)), bm, STEEL_LT, bn, 0))

        # ---- THE CAPTAIN'S SASH: the Watch's green, his left shoulder to his right hip, knotted, the tails hanging
        elif nm == 'sash':
            ring = tilted(0.88, 1, over + 0.024)
            made.append(weighted(band('sash', [ring], 0.072, 0.010, WATCH_GREEN, seg=8), torso_w))
            lo = min(ring, key=lambda pd: pd[0].z)[0]
            bm = bmesh.new(); ball(bm, lo + V((0, -0.012, 0)), 0.030, seg=10, ring=6, sq=(1.2, 0.7, 1.0))
            made.append(solid('sash_knot', bm, WATCH_GREEN, 'Skeleton_torso_joint_1', 0))
            for k, dx in enumerate((-0.020, 0.018)):
                bm = bmesh.new(); p0 = lo + V((dx, -0.020, -0.01))
                box(bm, p0 + V((dx * 0.4, -0.004, -0.085)), V((0.020, 0, 0)), V((0, 0.004, 0)), V((0, 0, 0.085)))
                made.append(weighted(solid('sash_tail_%d' % k, bm, WATCH_GREEN, 'Skeleton_torso_joint_1', 1),
                                     lambda p, sx=(1 if lo.x > 0 else -1): {'Skeleton_torso_joint_1': 0.6, ('leg_joint_L_1' if sx > 0 else 'leg_joint_R_1'): 0.4}))

        # ---- THE CAPTAIN'S BADGE: a brass shield on his left breast
        elif nm == 'badge':
            p = front(0.075, 0.97) + V((0, -(over + 0.022), 0))
            bm = bmesh.new(); box(bm, p, V((0.022, 0, 0)), V((0, 0.004, 0)), V((0, 0, 0.026)))
            for v in bm.verts:   # a shield: the bottom corners drawn in to a point
                if v.co.z < p.z - 0.01: v.co.x = p.x + (v.co.x - p.x) * 0.25; v.co.z -= 0.008
            made.append(weighted(solid('badge', bm, BRASS, 'torso_joint_3', 1), torso_w))

        # ---- THE BULLHORN: hung by a strap at his left hip, the bell down and forward
        elif nm == 'bullhorn':
            s_ = section(0.72, ('torso',))
            hip = V((s_['rx'] * 0.80, s_['cy'] + s_['back'] * 0.6 + 0.060 + over, 0.70))
            axis = V((0.10, -0.35, -1.0)).normalized()
            throat, mouth = hip, hip + axis * 0.21
            bm = bmesh.new(); cyl(bm, throat, mouth, 0.030, 0.078, seg=18)
            g = solid('bullhorn_bell', bm, (172, 166, 148), 'Skeleton_torso_joint_1', 0)
            paint(g, [((40, 38, 36), lambda c, f: (c - mouth).length < 0.07 and (c - throat).dot(axis) > 0.205)])
            made.append(g)
            bm = bmesh.new(); cyl(bm, throat - axis * 0.10, throat + axis * 0.004, 0.032, 0.030, seg=14)
            made.append(solid('bullhorn_body', bm, (64, 62, 58), 'Skeleton_torso_joint_1', 0))
            bm = bmesh.new(); gp = throat - axis * 0.05 + V((0, 0.035, 0))
            box(bm, gp, V((0.012, 0, 0)), V((0, 0.035, 0)), V((0, 0, 0.012)))
            made.append(solid('bullhorn_grip', bm, (40, 38, 36), 'Skeleton_torso_joint_1', 1))
            bm = bmesh.new(); pipe(bm, [throat - axis * 0.08, V((s_['rx'] * 0.6, s_['cy'] + s_['back'] * 0.4 + over + 0.02, 0.76))], 0.008, seg=8)
            made.append(solid('bullhorn_strap', bm, WOVEN, 'Skeleton_torso_joint_1', 0))

        # ---- THE FERAL'S PELT, ITS FORELEGS: the coyote's two forelegs over his shoulders, knotted on his chest, the paws hanging
        elif nm == 'pelt_legs':
            knot = front(0.0, 0.94) + V((0, -0.030, 0))
            for sx in (1, -1):
                sh = front(sx * 0.115, 1.09) + V((0, -0.022, 0.010))
                mid = front(sx * 0.07, 1.02) + V((0, -0.028, 0))
                bm = bmesh.new(); pipe(bm, [sh, mid, knot + V((sx * 0.010, 0, 0))], 0.020, seg=10)
                made.append(weighted(solid('pelt_leg_%d' % (sx > 0), bm, COYOTE, 'torso_joint_3', 0), lambda p: {'torso_joint_3': 1.0}))
                paw = knot + V((sx * 0.030, -0.010, -0.110))
                bm = bmesh.new(); pipe(bm, [knot + V((sx * 0.012, -0.004, -0.010)), paw], 0.015, seg=8)
                made.append(weighted(solid('pelt_shin_%d' % (sx > 0), bm, COYOTE_DK, 'torso_joint_3', 0), torso_w))
                bm = bmesh.new(); ball(bm, paw + V((0, -0.006, -0.012)), 0.020, seg=8, ring=6, sq=(1.0, 1.2, 0.8))
                made.append(weighted(solid('pelt_paw_%d' % (sx > 0), bm, FUR_TIP, 'torso_joint_3', 0), torso_w))
            bm = bmesh.new(); ball(bm, knot, 0.030, seg=10, ring=6, sq=(1.3, 0.8, 0.9))
            made.append(weighted(solid('pelt_knot', bm, COYOTE_DK, 'torso_joint_3', 0), lambda p: {'torso_joint_3': 1.0}))

        # ---- THE STRIP CLOAK (the Keepers): two dozen bleached strips hung from a rope yoke (front and back) and a rope
        # belt (all round), to the knee, cut ragged; one strip in four the Keepers' coral or rust
        elif nm == 'strips':
            N, KS = 26, 5; SEGS = N * KS
            rng = random.Random('strips:' + spec.get('id', ''))
            # loop 1 (looking, keeper_thrall_0 x3): to the knee and 2 cm off him the strips read as a short rag skirt under
            # the shirt; to mid-shin, 4.5 cm off the chest so they hang over whatever he wears
            hems = [0.17 + 0.22 * rng.random() for _ in range(N)]
            cols = [rng.choice([(168, 158, 136), (150, 136, 108), (122, 116, 106), (138, 124, 98)]) for _ in range(N)]
            for s in rng.sample(range(N), 3): cols[s] = CORAL
            for s in rng.sample([i for i in range(N) if cols[i] != CORAL], 2): cols[s] = (118, 74, 48)
            def s_of(a): return int(round(a / (2 * math.pi) * SEGS)) % SEGS // KS
            def hem(a): return hems[s_of(a)]
            def ok(a, z):
                si = int(a / (2 * math.pi) * SEGS) % SEGS
                if si % KS == KS - 1: return False                         # the gap between two strips
                side = abs(math.cos(a)) > 0.52                              # under the arms the strips start at the belt
                return z < 0.745 or (not side and z < 1.01)
            g = tube('strips', 1.01, hem, lambda z: 0.045 + over + 0.030 * sstep(0.74, 0.40, z), cols[0], ang_ok=ok, segs=SEGS, ring_dz=0.02, thick=0.004)
            rules = []
            for c_ in sorted(set(cols)):
                rules.append((c_, lambda c, f, c_=c_: cols[int(ang(c) / (2 * math.pi) * SEGS) % SEGS // KS] == c_))
            paint(g, rules)
            made.append(g)
            for z, off in ((1.005, 0.050 + over), (0.745, 0.054 + over)):
                ring = ring_pts(V((0.0, section(z, ('torso',))['cy'], z)), V((1, 0, 0)), V((0, -1, 0)), n=72, off=off)
                made.append(weighted(band('strip_rope_%d' % int(z * 100), [ring], 0.020, 0.016, (112, 96, 70),
                                          groove=lambda a: 0.004 * max(0.0, math.cos(60 * a)) ** 2), torso_w))

        # ---- THE WATER JUG (the Water People): a five-gallon cooler bottle on his back in amber plastic, the water line
        # showing, ridged; woven straps; a hose over his right shoulder to a bite valve on his chest
        elif nm == 'jug':
            sh = section(1.00, ('torso',)); back = sh['cy'] + sh['back'] + over
            # loop 1 (looking, water_cutter_0 x3): 3 cm off his back and leaning back 10 degrees, the jug floated beside him in
            # the side views, and four ridges stacked it like gourds: it rides ON his back, upright, two ridges
            R0, H0 = 0.128, 0.40
            sl = section(0.88, ('torso',)) or section(0.92, ('torso',)) or sh; back_m = sl['cy'] + sl['back'] + over
            b0 = V((0.0, back_m + R0 - 0.012, 0.70)); up = V((0, 0.04, 1.0)).normalized()
            t0 = b0 + up * H0; nk = t0 + up * 0.075
            bm = bmesh.new(); cyl(bm, b0, t0, R0, seg=28)
            cyl(bm, t0 - up * 0.002, t0 + up * 0.050, R0, 0.040, seg=28)      # the shoulder
            cyl(bm, t0 + up * 0.048, nk, 0.032, seg=16)                         # the neck
            g = solid('jug', bm, AMBER_LT, 'torso_joint_3', 1)
            ridge = lambda c: any(abs((c - b0).dot(up) - h) < 0.007 for h in (0.13, 0.27))
            paint(g, [(AMBER_DK, lambda c, f: ridge(c)), (AMBER, lambda c, f: (c - b0).dot(up) < H0 * 0.58), ((92, 82, 64), lambda c, f: (c - b0).dot(up) > H0 + 0.06)])
            made.append(weighted(g, torso_w))
            bm = bmesh.new(); cyl(bm, nk - up * 0.004, nk + up * 0.020, 0.037, seg=16)
            made.append(weighted(solid('jug_cap', bm, (54, 50, 44), 'torso_joint_3', 0), torso_w))
            for k, hz in enumerate((0.10, 0.31)):
                c = b0 + up * hz; u = V((1, 0, 0)); w = up.cross(u).normalized()
                pts = [(c + (u * math.cos(2 * math.pi * i / 40) + w * math.sin(2 * math.pi * i / 40)) * (R0 + 0.004), u * math.cos(2 * math.pi * i / 40) + w * math.sin(2 * math.pi * i / 40)) for i in range(40)]
                made.append(weighted(band('jug_strap_%d' % k, [pts], 0.040, 0.008, WOVEN, groove=lambda a: 0.003 * max(0.0, math.cos(30 * a)) ** 2), torso_w))
            for sx in (1, -1):   # the shoulder straps, front to the jug
                x0 = sx * 0.085
                pth = [V((x0, -0.30, 0.82)), V((x0, -0.20, 0.97)), V((x0 * 1.05, -0.10, 1.12)), V((x0 * 1.1, cy_t, 1.16)), V((x0 * 1.05, 0.10, 1.10))]
                made.append(weighted(strip('jug_harness_%d' % (sx > 0), [pth], 0.040, over + 0.016, WOVEN, across=5), torso_w))
            # the hose: out of the cap, over his right shoulder, down to the bite valve on his chest
            shp = V((-0.105, cy_t, 1.20)); chest = front(-0.060, 0.99) + V((0, -(over + 0.030), 0))
            pts = [nk + up * 0.020, nk + V((-0.03, -0.02, 0.05)), V((-0.10, back + 0.03, 1.22)), shp, V((-0.10, -0.12, 1.12)), chest]
            bm = bmesh.new(); pipe(bm, pts, 0.008, seg=8)
            made.append(weighted(solid('jug_hose', bm, (82, 70, 50), 'torso_joint_3', 0), torso_w))
            bm = bmesh.new(); cyl(bm, chest, chest + V((0.008, -0.010, -0.030)), 0.011, seg=10)
            made.append(weighted(solid('jug_valve', bm, (124, 50, 44), 'torso_joint_3', 0), torso_w))

        # ---- THE NEEDLE BANDOLIER (the Water People): a leather band across him, his left shoulder to his right hip,
        # syringes in its loops on the front run, dregs in the barrels, the caps rust-orange
        elif nm == 'syringes':
            ring = tilted(0.90, 1, over + 0.020)
            made.append(weighted(band('needle_band', [ring], 0.052, 0.012, LEATHER_DK, seg=8), torso_w))
            fr = [i for i, (p, d) in enumerate(ring) if d.y < -0.55 and 0.80 < p.z < 1.10]
            fr.sort(key=lambda i: -ring[i][0].z)
            pick_ = fr[1::max(1, len(fr) // 7)][:7]
            n = len(ring)
            for k, i in enumerate(pick_):
                p, d = ring[i]
                t = (ring[(i + 1) % n][0] - ring[i - 1][0]).normalized(); nn = (d - t * d.dot(t)).normalized(); bb = t.cross(nn).normalized()
                # loop 1 (looking, water_needle_0 x3): 1 cm barrels under 9 cm long read as a plain strap; 1.5 cm by 12, the
                # barrels pale against the dark band, so the row of them reads at 1x as a row of light dashes
                c = p + nn * 0.028
                a0, a1 = c - bb * 0.062, c + bb * 0.052
                bm = bmesh.new(); cyl(bm, a0, c, 0.015, seg=10)
                made.append(weighted(solid('syr_dregs_%d' % k, bm, DREGS, 'torso_joint_3', 0), torso_w))
                bm = bmesh.new(); cyl(bm, c, a1, 0.015, seg=10)
                made.append(weighted(solid('syr_barrel_%d' % k, bm, BARREL, 'torso_joint_3', 0), torso_w))
                bm = bmesh.new(); cyl(bm, a1, a1 + bb * 0.028, 0.008, seg=8)
                made.append(weighted(solid('syr_cap_%d' % k, bm, CAP_ORANGE, 'torso_joint_3', 0), torso_w))
                bm = bmesh.new(); cyl(bm, a0 - bb * 0.018, a0, 0.004, seg=6); cyl(bm, a0 - bb * 0.022, a0 - bb * 0.016, 0.012, seg=8)
                made.append(weighted(solid('syr_plunger_%d' % k, bm, (44, 42, 40), 'torso_joint_3', 0), torso_w))
    return [m for m in made if m is not None]


# ======================================================================================================================
# THE NEW PIECES ON THE SKULL (the barber's hat door: called with the head build's locals)
# ======================================================================================================================
def head_pieces(cut, L):
    bpy, bmesh = L['bpy'], L['bmesh']
    Vector, BVHTree = L['Vector'], L['BVHTree']
    C, sc, skull_bm, finish, mat, shell, az_of, PM = L['C'], L['sc'], L['skull_bm'], L['finish'], L['mat'], L['shell'], L['az_of'], L['PM']
    paint_scalp = L['paint_scalp']
    bm_s = skull_bm(); bvh_head = BVHTree.FromBMesh(bm_s); bm_s.free()
    # the body under the head (its clothes too): every mesh in the scene but the head's own
    pts, polys = [], []
    for o in sc.objects:
        if o.type != 'MESH' or o.name.startswith(('portrait_head', 'barber_')) or 'hair' in o.name: continue
        base = len(pts); mw = o.matrix_world
        pts += [mw @ v.co for v in o.data.vertices]; polys += [[base + i for i in f.vertices] for f in o.data.polygons]
    bvh_body = BVHTree.FromPolygons(pts, polys) if polys else None

    def skull_r(az, z):
        d = Vector((math.sin(az), -math.cos(az), 0.0)); o = C + Vector((0, 0, z))
        hit = bvh_head.ray_cast(o, d, 0.5)
        return (hit[0] - o).length if hit[0] else None

    def body_r(az, z, from_r=0.6):
        """the distance out from the head's axis to the body (or the head) at this angle and height, a ray from outside in"""
        d = Vector((math.sin(az), -math.cos(az), 0.0)); o = C + Vector((0, 0, z)) + d * from_r
        best = None
        for bv in (bvh_head, bvh_body):
            if bv is None: continue
            hit = bv.ray_cast(o, -d, from_r)
            if hit[0] is not None:
                r = (hit[0] - (C + Vector((0, 0, z)))).dot(d)
                best = r if best is None else max(best, r)
        return best

    def grid_mesh(rows):
        bm = bmesh.new(); vs = [[bm.verts.new(p) for p in row] for row in rows]
        for j in range(len(vs) - 1):
            for i in range(len(vs[j]) - 1):
                bm.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        if sum(((f.calc_center_median() - C) * Vector((1, 1, 0))).dot(f.normal) for f in bm.faces) < 0: bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
        return bm

    def multi(o, rules):
        idx = []
        for k, (col, _) in enumerate(rules):
            o.data.materials.append(mat('%s_m%d' % (o.name, k), col, 0.9)); idx.append(len(o.data.materials) - 1)
        for f in o.data.polygons:
            q = o.matrix_world @ f.center - C
            for k, (_, test) in enumerate(rules):
                if test(q): f.material_index = idx[k]; break
        return o

    def solid_bm(bm, name, col, rough=0.9):
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        return finish(bm, name, mat(name, col, rough), 0)

    def cylb(bm, p0, p1, r0, r1=None, seg=12):
        d = p1 - p0; q = d.normalized().to_track_quat('Z', 'Y')
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r0, radius2=r0 if r1 is None else r1, depth=d.length)
        for v in res['verts']: v.co = (p0 + p1) * 0.5 + q @ v.co

    def ballb(bm, c, r, seg=10, ring=6, sq=(1, 1, 1)):
        res = bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=ring, radius=r)
        for v in res['verts']: v.co = c + Vector((v.co.x * sq[0], v.co.y * sq[1], v.co.z * sq[2]))

    def drape_w(q):
        a = sstep(-0.10, -0.17, q.z); c = sstep(-0.19, -0.27, q.z); d = sstep(-0.40, -0.52, q.z); e = sstep(-0.56, -0.66, q.z)
        w = {PM.HEAD_BONE: 1.0 - a, PM.NECK_BONE: a * (1.0 - c), 'torso_joint_3': a * c * (1.0 - d),
             'Skeleton_torso_joint_2': a * c * d * (1.0 - e), 'Skeleton_torso_joint_1': a * c * d * e}
        return {k: v for k, v in w.items() if v > 1e-4}

    made = []
    nape = lambda ab: 0.112 if ab < 0.55 else (0.104 if ab < 0.82 else (0.050 if ab < 1.3 else (0.010 if ab < 1.9 else -0.060)))
    paint_scalp(lambda q: q.z > nape(abs(az_of(q))))   # short hair under every one of these (a buzz under the steel)

    # ---- THE HUBCAP KETTLE (House Shield): a steel pot, a hubcap riveted on as its wide brim ------------------------------
    if cut == 'HUBCAP KETTLE':
        BZ = 0.050
        # loop 2 (looking, x4): a dark band ringed the pot above the brim in every facing: his own cut's hair (about 2 cm on
        # the scalp) through a 1.2 cm pot. The pot is 2.6 cm off the skull, and a comb ridges it front to back (the kettle
        # hat's raised seam) so it reads as hammered steel and not a felt crown
        def thick(pos, nor):
            out = []
            for p, n in zip(pos, nor):
                q = p - C
                out.append(0.026 + 0.008 * sstep(0.10, 0.18, q.z) + 0.011 * math.exp(-(q.x / 0.011) ** 2) * sstep(0.07, 0.13, q.z))
            return out
        # loop 1 (looking, house_shield_0 at 1:1 and x6): the steel at (108, 106, 100) came out chalk under the rig's up-face
        # dust and read as a sun hat, a rust band round the pot read as a hat band, and an 8.2 cm brim drooping 2.8 cm hid
        # his whole face from the game's camera: a gunmetal pot, rust only in streaks, the hubcap 5.6 cm in front and 7 at
        # the back and sides, nearly flat, its slots wide and dark so it reads as a hubcap and not a felt brim
        GUN, HUB, HUB_RIM = (66, 66, 64), (122, 120, 114), (88, 86, 82)
        dome = shell('kettle_dome', lambda q: q.z > BZ - 0.004 - 0.020 * sstep(1.6, 3.0, abs(az_of(q))), thick, subdiv=2, rim=0.004)
        dome.data.materials.clear(); dome.data.materials.append(mat('kettle_steel', GUN, 0.6))
        multi(dome, [(RUSTED, lambda q: abs(math.sin(7 * az_of(q) + 1.3)) > 0.97 and q.z < 0.13)])
        made.append(dome)
        NA, NR = 72, 7; rows = []
        def brim_w(az): return 0.056 + 0.016 * sstep(0.4, 1.4, abs(az))
        for j in range(NR + 1):
            u = j / NR; row = []
            for i in range(NA + 1):
                az = -math.pi + 2 * math.pi * i / NA
                zb = BZ - 0.020 * sstep(1.6, 3.0, abs(az))
                r0 = (skull_r(az, zb + 0.004) or 0.115) + 0.022
                r = r0 + brim_w(az) * u
                d = Vector((math.sin(az), -math.cos(az), 0.0))
                row.append(C + Vector((0, 0, zb - 0.008 * u * u - 0.002 * u)) + d * r)
            rows.append(row)
        brim = finish(grid_mesh(rows), 'kettle_brim', mat('kettle_hubcap', HUB, 0.6), 0.005)
        def slot(q):
            r = math.hypot(q.x, q.y); a = az_of(q); k = (a / (2 * math.pi) * 10) % 1.0
            rr = (skull_r(a, BZ) or 0.115) + 0.022
            return 0.18 < k < 0.68 and rr + 0.014 < r < rr + brim_w(a) - 0.014
        multi(brim, [((30, 29, 28), slot), (HUB_RIM, lambda q: math.hypot(q.x, q.y) > (skull_r(az_of(q), BZ) or 0.115) + 0.022 + brim_w(az_of(q)) - 0.008)])
        made.append(brim)
        bm = bmesh.new()
        for i in range(10):
            az = 2 * math.pi * (i + 0.5) / 10; zb = BZ - 0.020 * sstep(1.6, 3.0, abs(((az + math.pi) % (2 * math.pi)) - math.pi))
            r = (skull_r(az, zb + 0.004) or 0.115) + 0.024
            ballb(bm, C + Vector((math.sin(az) * (r + 0.012), -math.cos(az) * (r + 0.012), zb + 0.010)), 0.0090, seg=8, ring=5)
        made.append(solid_bm(bm, 'kettle_rivets', (82, 78, 72)))
        bm = bmesh.new()   # the chin strap, leather, from under the brim at each temple down round the jaw
        sp = []
        for i in range(17):
            t = i / 16; az = -1.45 + 2.9 * t; z = BZ - 0.02 - 0.150 * math.sin(math.pi * t) ** 0.6
            r = body_r(az, z, 0.4) or (skull_r(az, z) or 0.10)
            sp.append(C + Vector((math.sin(az) * (r + 0.006), -math.cos(az) * (r + 0.006), z)))
        for a_, b_ in zip(sp, sp[1:]): cylb(bm, a_, b_, 0.0045, seg=6)
        made.append(solid_bm(bm, 'kettle_strap', (52, 40, 30)))

    # ---- THE MAIL COIF (House Hook): a hood of steel rings over head and throat, the face cut out, a cape to the shoulders
    elif cut == 'MAIL COIF':
        def face_open(az, z): return (az / 0.92) ** 2 + ((z + 0.020) / 0.092) ** 2 < 1.0
        NA, DZ = 96, 0.008; rows = []
        z = 0.205
        while z > -0.30:
            row = []
            for i in range(NA + 1):
                az = -math.pi + 2 * math.pi * i / NA
                r = body_r(az, z, 0.6)
                if r is None or r < 0.0: r = 0.02
                lim = -0.27 if abs(az) > 1.0 else -0.24
                zz = max(z, lim)
                if zz != z: r = body_r(az, zz, 0.6) or r
                d = Vector((math.sin(az), -math.cos(az), 0.0))
                row.append(C + Vector((0, 0, zz)) + d * (max(r, 0.0) + 0.012 + 0.006 * sstep(-0.10, -0.24, zz)))
            rows.append(row); z -= DZ
        # the top rows meet over the crown: rays from outside find the skull's top, a pinched cap closes it
        bm = grid_mesh(rows)
        kill = []
        for f in bm.faces:
            q = f.calc_center_median() - C
            if face_open(az_of(q), q.z): kill.append(f)
        bmesh.ops.delete(bm, geom=kill, context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        coif = finish(bm, 'coif', mat('coif_mail', (100, 98, 94), 0.6), 0.006)
        multi(coif, [((76, 74, 72), lambda q: int((q.z + 1.0) / 0.009) % 2 == 0), (RUSTED, lambda q: q.z < -0.23 and abs(math.sin(31 * az_of(q))) > 0.85)])
        made.append(('weighted', coif, drape_w))
        # the crown cap: the skull's own top above the rows' reach, pushed out to meet them
        cap = shell('coif_crown', lambda q: q.z > 0.17, lambda pos, nor: [0.012 for _ in pos], subdiv=1, rim=0.004)
        cap.data.materials.clear(); cap.data.materials.append(mat('coif_crown_m', (92, 90, 86), 0.6))
        made.append(cap)
        # the leather band round the face's edge
        bm = bmesh.new(); ring = []
        for i in range(48):
            t = 2 * math.pi * i / 48; az = 0.95 * math.sin(t); z = -0.020 + 0.095 * math.cos(t)
            r = body_r(az, z, 0.6) or 0.10
            ring.append(C + Vector((0, 0, z)) + Vector((math.sin(az), -math.cos(az), 0)) * (r + 0.016))
        for a_, b_ in zip(ring, ring[1:] + ring[:1]): cylb(bm, a_, b_, 0.0065, seg=6)
        made.append(solid_bm(bm, 'coif_edge', (60, 44, 32)))

    # ---- THE COYOTE PELT (Feral): the lab coyote's head over his, its snout over his brow, the ears up, the tag in its
    # ear; the pelt down his back to a black-tipped tail -----------------------------------------------------------------
    elif cut == 'COYOTE PELT':
        def thick(pos, nor):   # fur: tufts, never a smooth dome
            out = []
            for p in pos:
                q = p - C; a = az_of(q)
                tuft = 0.5 + 0.5 * math.sin(23 * a + 61 * q.z) * math.sin(17 * a - 47 * q.z + 1.1)
                out.append(0.024 + 0.010 * sstep(0.08, 0.17, q.z) + 0.007 * tuft)
            return out
        capm = shell('pelt_cap', lambda q: q.z > 0.050 - 0.120 * sstep(0.9, 2.6, abs(az_of(q))), thick, subdiv=2, rim=0.004)
        capm.data.materials.clear(); capm.data.materials.append(mat('pelt_fur', COYOTE, 0.98))
        multi(capm, [(COYOTE_DK, lambda q: abs(q.x) < 0.035 and q.z > 0.06), (COYOTE_LT, lambda q: abs(az_of(q)) > 0.9 and abs(az_of(q)) < 2.0 and q.z < 0.07),
                     (FUR_TIP, lambda q: (0.5 + 0.5 * math.sin(41 * az_of(q) + 90 * q.z)) > 0.93)])
        made.append(capm)
        # the snout: the upper jaw lying forward over his brow, tapering to a black nose
        rb = skull_r(0.0, 0.085) or 0.118
        # loop 3 (looking, x4): a 17.5 cm muzzle tapering to 2.2 cm and pointing down across his face read as a beak; a
        # coyote's muzzle is blunt and lies along the brow: 14 cm, 6.4 to 3.2 cm, nearly level, its base on the crown's front
        base = C + Vector((0, -(rb + 0.014), 0.118)); fwd = Vector((0, -1.0, -0.08)).normalized()
        tip = base + fwd * 0.140
        bm = bmesh.new(); cylb(bm, base - fwd * 0.05, tip, 0.064, 0.032, seg=16)
        for v in bm.verts:   # flatter than round: a muzzle, wider than tall
            q = v.co - base; v.co = base + Vector((q.x * 1.15, q.y, q.z * 0.80 + 0.0))
        sn = solid_bm(bm, 'pelt_snout', COYOTE, 0.98)
        multi(sn, [(COYOTE_LT, lambda q: q.z < (base - C).z - 0.012), (COYOTE_DK, lambda q: abs(q.x) < 0.016 and q.z > (base - C).z + 0.012)])
        made.append(sn)
        bm = bmesh.new(); ballb(bm, tip + fwd * 0.004, 0.016, seg=10, ring=6, sq=(1.1, 0.9, 0.8))
        made.append(solid_bm(bm, 'pelt_nose', FUR_TIP, 0.6))
        bm = bmesh.new()
        for k in range(6):   # the teeth: the upper row hanging over his brow
            s = (k + 0.5) / 6; side = -1 if k < 3 else 1
            p = base.lerp(tip, 0.25 + 0.65 * ((k % 3) + 0.5) / 3) + Vector((side * 0.024 * (1.0 - 0.45 * ((k % 3) / 2)), 0, -0.022))
            cylb(bm, p, p + Vector((0, -0.003, -0.022 if k % 3 != 0 else -0.030)), 0.0055, 0.0012, seg=6)
        made.append(solid_bm(bm, 'pelt_teeth', TOOTH, 0.7))
        bm = bmesh.new()
        for sx in (1, -1):   # the empty eye holes
            ballb(bm, base.lerp(tip, 0.16) + Vector((sx * 0.040, 0, 0.020)), 0.015, seg=8, ring=5, sq=(1.0, 1.3, 0.7))
        made.append(solid_bm(bm, 'pelt_eyes', (24, 20, 18), 0.9))
        # the ears: up and a little out, lighter inside; the lab's tag in the left one
        for sx in (1, -1):
            az = sx * 0.70; r = skull_r(az, 0.150) or 0.10
            eb = C + Vector((math.sin(az) * (r + 0.020), -math.cos(az) * (r + 0.020), 0.150))
            out = Vector((math.sin(az), -math.cos(az), 0.0)); upv = (Vector((0, 0, 1)) + out * 0.25).normalized()
            side = out.cross(Vector((0, 0, 1))).normalized()
            apex = eb + upv * 0.135 + Vector((0, 0.012, 0))   # loop 3: 11.5 cm ears read as small horns from behind
            bm = bmesh.new()
            vs = [bm.verts.new(eb + side * 0.052 + Vector((0, 0.016, 0))), bm.verts.new(eb - side * 0.052 + Vector((0, 0.016, 0))),
                  bm.verts.new(eb - Vector((0, 0.024, 0))), bm.verts.new(apex)]
            for f in ((0, 1, 3), (1, 2, 3), (2, 0, 3), (0, 2, 1)): bm.faces.new([vs[i] for i in f])
            o = solid_bm(bm, 'pelt_ear_%d' % (sx > 0), COYOTE_DK, 0.98)
            multi(o, [((150, 112, 96), lambda q, eb=eb: (q + C - eb).y < -0.004)])
            made.append(o)
            if sx > 0:
                bm = bmesh.new(); tp = eb.lerp(apex, 0.35) + out * 0.012 + Vector((0, -0.006, 0))
                for vv in bmesh.ops.create_cube(bm, size=1.0)['verts']: vv.co = tp + Vector((vv.co.x * 0.026, vv.co.y * 0.006, vv.co.z * 0.022))
                made.append(solid_bm(bm, 'pelt_tag', TAG, 0.8))
        # the pelt down his back: columns across the back, narrowing to the tail
        NC = 30; cols = []
        z0, z1 = 0.030, -0.66
        for j in range(NC + 1):
            u = j / NC - 0.5; col = []; z = z0
            while z > z1 - 1e-6:
                s = (z0 - z) / (z0 - z1)
                span = 1.25 * (1.0 - 0.80 * sstep(0.55, 1.0, s)) * (0.80 + 0.20 * sstep(0.0, 0.25, s))
                az = math.pi + u * 2 * span
                r = body_r(az, z, 0.6) or 0.12
                d = Vector((math.sin(az), -math.cos(az), 0.0))
                col.append(C + Vector((0, 0, z)) + d * (r + 0.018 + 0.010 * sstep(0.0, 0.3, s))); z -= 0.012
            cols.append(col)
        n = min(len(c) for c in cols)
        bm = bmesh.new(); vs = [[bm.verts.new(p) for p in col[:n]] for col in cols]
        for j in range(NC):
            for i in range(n - 1): bm.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        if sum(((f.calc_center_median() - C) * Vector((1, 1, 0))).dot(f.normal) for f in bm.faces) < 0: bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
        cape = finish(bm, 'pelt_cape', mat('pelt_cape_fur', COYOTE, 0.98), 0.010)
        multi(cape, [(FUR_TIP, lambda q: q.z < -0.60), (COYOTE_DK, lambda q: abs(abs(az_of(q)) - math.pi) < 0.22 and q.z > -0.55), (COYOTE_LT, lambda q: abs(abs(az_of(q)) - math.pi) > 0.62)])
        made.append(('weighted', cape, drape_w))

    # ---- THE BIKE HELMET (Neighbor): a vented shell with a tail, a short visor, the straps -----------------------------------
    elif cut.startswith('BIKE HELMET'):
        col = HELMET_SHELL[cut]
        def line(az): ab = abs(az); return 0.085 - 0.020 * sstep(0.6, 1.6, ab) - 0.070 * sstep(1.8, 3.0, ab)
        def thick(pos, nor):
            out = []
            for p, n in zip(pos, nor):
                q = p - C; ab = abs(az_of(q))
                t = 0.022 + 0.020 * math.exp(-((ab - math.pi) / 0.55) ** 2) * sstep(0.00, 0.10, q.z)
                out.append(t)
            return out
        sh = shell('helmet_shell', lambda q: q.z > line(az_of(q)), thick, subdiv=2, rim=0.004)
        sh.data.materials.clear(); sh.data.materials.append(mat('helmet_shell_m', col, 0.55))
        def vent(q):
            a = az_of(q); k = (a / (math.pi / 4.5)) % 1.0
            return q.z > 0.105 and 0.42 < k < 0.58 and abs(a) < 2.7
        multi(sh, [((36, 34, 32), vent), ((44, 42, 40), lambda q: q.z < line(az_of(q)) + 0.010)])
        made.append(sh)
        bm = bmesh.new(); NU, NV = 20, 3; rows = []
        for j in range(NV + 1):
            v = j / NV; row = []
            for i in range(NU + 1):
                az = -0.85 + 1.7 * i / NU; z = line(az) + 0.004
                r = (skull_r(az, z) or 0.12) + 0.024
                row.append(C + Vector((0, 0, z - 0.008 * v)) + Vector((math.sin(az), -math.cos(az), 0)) * (r + 0.030 * v * (1 - (az / 0.85) ** 2)))
            rows.append(row)
        made.append(finish(grid_mesh(rows), 'helmet_visor', mat('helmet_visor_m', (40, 38, 36), 0.7), 0.004))
        bm = bmesh.new()
        for sx in (1, -1):
            sp = []
            for i in range(9):
                t = i / 8; az = sx * (1.55 - 1.45 * t); z = 0.030 - 0.150 * t
                r = body_r(az, z, 0.4) or (skull_r(az, z) or 0.10)
                sp.append(C + Vector((math.sin(az) * (r + 0.005), -math.cos(az) * (r + 0.005), z)))
            for a_, b_ in zip(sp, sp[1:]): cylb(bm, a_, b_, 0.0040, seg=6)
        made.append(solid_bm(bm, 'helmet_straps', (36, 36, 36)))
    return made


def install_hats():
    """the six new hats through HATS 1's door (its build wrapped in memory, its file never edited)"""
    import bohemia_character_hats_one as HATS
    if getattr(HATS, '_nine_enemies', False): return
    old = HATS.build
    def build(cut, L):
        if cut in NEW_HATS: return head_pieces(cut, L)
        return old(cut, L)
    HATS.build = build; HATS._nine_enemies = True


# ---- THE BUILD (inside Blender's Python) ----------------------------------------------------------------------------
def build_one(pid):
    import bohemia_character_the_barber_on_the_skull as BS
    import bohemia_character_the_thirteen_through_the_rig as CH
    import bohemia_character_garments_base as BASE
    import bohemia_character_garments_outer as OUTER
    register_garments(); register(); install_hats()
    P = next(p for p in json.load(open(ROLL)) if p['id'] == pid)
    # loop 1: the outfit (tools/bohemia_character_the_outfit.py) gives a coatless man a second top; on the Feral it put a
    # flannel over the bare arms the pelt is for, on the Keeper a blue plaid under the strips: the Keepers' layers are this
    # tool's (the pelt, the strips, the drapes and bracers of his kit)
    if TYPES[P['gang']].get('outfit') is False: os.environ['BOHEMIA_OUTFIT'] = 'off'
    one = os.path.join(ROOT, 'records/character/rig/_roll_%s.json' % pid)
    json.dump([P], open(one, 'w'))

    def person_body(spec):
        import bohemia_portrait_the_head_from_the_model as PM
        t = spec['gang']; i = int(str(spec['id']).rsplit('_', 1)[-1])
        L = look_entry(t, i)
        L['skin'] = PM.palette_step(*spec['skin'])
        L['worn'] = dict(L.get('worn') or {})
        Gt = BASE.at_source(BASE.BY[spec['top']]) if spec.get('top') else None
        Gc = BASE.at_source(OUTER.BY[spec['coat']]) if spec.get('coat') else None
        if Gt:
            L['shirt'] = dict(colour=Gt['mid'], sleeve={'none': 'none', 'short': 'short'}.get(Gt['sleeves'], 'long'))
            L['worn']['base'] = Gt['name']
            if spec.get('robe'): L['shirt']['long_hem'] = spec['robe']     # the Water man's robe: the long shirt to the shin
            if Gt['fn'] == 'genCoverall':
                L['trousers'] = dict(colour=Gt['mid'], wide=0.014, crop=0.355 if Gt['short'] else 0.0)
        L.pop('coat', None)
        if Gc: L['worn']['outer'] = Gc['name']
        mine = list(spec.get('pieces') or [])
        L['extra'] = lambda X, Gt=Gt, Gc=Gc, mine=mine, spec=spec: (BASE.pieces(Gt, X) if Gt else []) + (OUTER.pieces(Gc, X) if Gc else []) + body_pieces(mine, X, spec)
        L['shape'] = '%s: %s, his own skin %s %d, %s%s' % (spec['tag'], TYPES[t]['what'], spec['skin'][0], spec['skin'][1],
                                                         spec.get('top'), (' under ' + spec['coat']) if spec.get('coat') else '')
        name = spec['tag'].upper()
        CH.LOOKS[name] = L
        if Gt: CH.PRINTS[name] = BASE.prints(Gt)
        CH.build(name, BS.RIG_DIR)
        spec['body'] = 'records/character/rig/%s.glb' % name.lower()

    BS.person_body = person_body
    if not os.path.exists(os.path.join(ROOT, 'records/character/rig/barberbody.glb')): BS.barber_body()
    for n in BS.people(one): BS.build(n)
    os.remove(one)


# ---- THE RENDER (RUN TWO's, imported) ------------------------------------------------------------------------------
def R2():
    import bohemia_run2_no_two_people_alike as R
    return R


def tag_of(pid): return 'person_' + pid.lower()
def look_of(pid): return 'enemy_' + pid.lower()
def bpy_py(): return os.environ.get('BOHEMIA_BPY') or 'python3.11'


def ensure_model(pid):
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % tag_of(pid))
    if not os.path.exists(glb):
        if not R2().run([bpy_py(), os.path.abspath(__file__), 'build-one', pid], glb): return None
    return glb


def look(pid):
    glb = ensure_model(pid)
    if not glb: return
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    out = os.path.join(ROOT, SHEET_DIR, 'look', look_of(pid))
    R2().run([bpy_py(), '-c', R2().render_code(glb, out, h, clips=[('Stand', 1)])], os.path.join(out, 'rig.json'))
    print('LOOK', pid, out, flush=True)


def made(pid):
    try: return open(os.path.join(ROOT, OUT, look_of(pid), 'made.txt')).read().strip() == STAMP
    except OSError: return False


def fought(pid):
    try: return open(os.path.join(ROOT, FIGHT_RENDERS, look_of(pid), 'made.txt')).read().strip() == STAMP
    except OSError: return False


def make(pid, keep_model=True):
    """his street pass then his fight pass, RUN TWO's way; the model is KEPT (ANIMATION's idles and held clips build on it)"""
    R = R2(); t0 = time.time()
    glb = ensure_model(pid)
    if not glb: return
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    out = os.path.join(ROOT, OUT, look_of(pid))
    if not made(pid):
        if R.run([bpy_py(), '-c', R.render_code(glb, out, h)], os.path.join(out, 'rig.json')):
            R.faces(out); R.prune(out); stow(pid)
            with open(os.path.join(out, 'made.txt'), 'w') as f: f.write(STAMP + '\n')
    t1 = time.time()
    if not fought(pid):
        posed = os.path.join(ROOT, 'records/combat/rig/%s.glb' % look_of(pid))
        os.makedirs(os.path.dirname(posed), exist_ok=True)
        fd = os.path.join(ROOT, FIGHT_RENDERS, look_of(pid))
        if os.path.exists(posed) or R.run([bpy_py(), os.path.join(ROOT, 'tools/bohemia_combat_the_fight_poses.py'), glb, posed], posed):
            if R.run([bpy_py(), '-c', R.render_code(posed, fd, h, R.FIGHT_CLIPS)], os.path.join(fd, 'rig.json')):
                for f in os.listdir(fd):
                    if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(fd, f))
                with open(os.path.join(fd, 'made.txt'), 'w') as f: f.write(STAMP + '\n')
    print('MADE %s street %.0fs fight %.0fs' % (pid, t1 - t0, time.time() - t1), flush=True)


def stow(pid):
    import shutil
    src, dst = os.path.join(ROOT, OUT, look_of(pid)), os.path.join(ROOT, STOW, look_of(pid))
    os.makedirs(dst, exist_ok=True)
    for f in os.listdir(src):
        if not f.endswith('.png'): continue
        if f.startswith(('rig_Anim_', 'rig_portrait_')): shutil.move(os.path.join(src, f), os.path.join(dst, f))
        elif f.startswith('rig_'): shutil.copy2(os.path.join(src, f), os.path.join(dst, f))


def frames_of(pid):
    d = os.path.join(ROOT, STOW, look_of(pid))
    return d if os.path.exists(os.path.join(d, 'rig_S.png')) else os.path.join(ROOT, OUT, look_of(pid))


def todo():
    return [p['id'] for p in json.load(open(ROLL)) if not (made(p['id']) and fought(p['id']))]


def batch(n=2):
    left = todo(); print('%d to make, %d workers' % (len(left), n), flush=True)
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, os.cpu_count() // n)))
    procs = [subprocess.Popen([sys.executable, os.path.abspath(__file__), 'worker', str(w), str(n)], cwd=ROOT, env=env) for w in range(n)]
    for p in procs: p.wait()


def worker(w, n):
    R = json.load(open(ROLL)); order = []
    for k in range(max(TYPES[t]['count'] for t in ORDER)):   # a type at a time round by round, so a short run covers all nine
        for t in ORDER: order += [p['id'] for p in R if p['gang'] == t and p['id'] == pid_of(t, k)]
    left = [pid for pid in order if not (made(pid) and fought(pid))]
    for i, pid in enumerate(left):
        if i % n == w: make(pid)


# ---- THE PACK: the fight's sheets, the face strip, each type's row pointed at its own men -----------------------------
def pack():
    import numpy as np
    from PIL import Image
    R = R2()
    FR = os.path.join(ROOT, 'slices/fight_rig'); ip = os.path.join(FR, 'fight_rig.json'); I = json.load(open(ip))
    cols = R.FIGHT_COLS
    want = [n + ('@%d' % k if c != 'Stand' else '') for n, c, ks in cols for k in range(ks)]
    assert I['cols'] == want, "COMBAT changed the fight sheet's columns: re-read its pack() before packing"
    RIM = tuple(I['rim'])
    roll_ = json.load(open(ROLL)); mine = {look_of(p['id']) for p in roll_}
    for k in [k for k in I['looks'] if k in mine]: del I['looks'][k]
    made_ = []
    for p in roll_:
        pid = p['id']; lk = look_of(pid)
        fd = os.path.join(ROOT, FIGHT_RENDERS, lk); sd = frames_of(pid)
        if not (fought(pid) and made(pid)): continue
        ref = TYPES[p['gang']]['cell']; Lr = I['looks'][ref]; w, h = Lr['w'], Lr['h']; fx, fy = Lr['foot']
        fr = json.load(open(os.path.join(fd, 'rig.json'))); sr = json.load(open(os.path.join(ROOT, OUT, lk, 'rig.json')))
        sheet = np.zeros((h * len(R.FIGHT_DIRS), w * len(want), 4), np.uint8); lost = 0
        for row, f in enumerate(R.FIGHT_DIRS):
            col = 0
            for n, c, ks in cols:
                for k in range(ks):
                    if c == 'Stand': fn, gp = os.path.join(sd, 'rig_%s.png' % f), sr['ground_px']
                    elif c == 'Anim_0': fn, gp = os.path.join(sd, 'rig_Anim_0_%s_k%02d.png' % (f, k)), sr['ground_px']
                    else: fn, gp = os.path.join(fd, 'rig_%s_%s_k%02d.png' % (c, f, k)), fr['ground_px']
                    a = np.asarray(Image.open(fn).convert('RGBA'))
                    ox, oy = fx - gp[0], fy - gp[1]
                    cell = np.zeros((h, w, 4), np.uint8)
                    x0, y0 = max(0, ox), max(0, oy); x1, y1 = min(w, ox + a.shape[1]), min(h, oy + a.shape[0])
                    cell[y0:y1, x0:x1] = a[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
                    lost += int((a[..., 3] > 0).sum()) - int((cell[..., 3] > 0).sum())
                    op = cell[..., 3] > 0; near = np.zeros_like(op)
                    near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
                    cell[near & ~op] = RIM
                    sheet[row * h:(row + 1) * h, col * w:(col + 1) * w] = cell; col += 1
        q = Image.fromarray(sheet[..., :3]).quantize(64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
        Image.fromarray(np.dstack([np.asarray(q), sheet[..., 3]]), 'RGBA').save(os.path.join(FR, lk + '.webp'), 'WEBP', lossless=True, quality=100, method=6)
        I['looks'][lk] = dict(file=lk + '.webp', w=w, h=h, foot=Lr['foot'], height_m=fr['real_dims_m'][2], kind='enemy', ref=ref,
                              guns=Lr.get('guns'), type=POOL[p['gang']], set='nine', rig=os.path.relpath(os.path.join(fd, 'rig.json'), ROOT))
        made_.append((p, lk)); print('PACKED %s in %s\'s cell, %d px outside it, %d KB' % (lk, ref, lost, os.path.getsize(os.path.join(FR, lk + '.webp')) // 1024))
    # THE FACES: the fight's one strip holds 121 faces of 128 px (15,488 px) and a WebP stops at 16,383, so these ride the
    # next strip (faces.more, read by the fight's __THE_SECOND_FACE_STRIP__), in the same size and the same way
    F = I['faces']; S = F['size']
    assert not [l for l in F['order'] if l in mine], 'a nine-enemies face is on the first strip: take it off before packing here'
    MORE = 'faces_more.webp'
    more = [M for M in F.get('more', []) if M['file'] != MORE]
    tiles = [Image.open(os.path.join(ROOT, OUT, lk, 'face', 'rest_128.png')).convert('RGBA').resize((S, S), Image.BOX) for p, lk in made_]
    if tiles:
        assert S * len(tiles) <= 16383, 'the second strip is full too'
        out = Image.new('RGBA', (S * len(tiles), S), (0, 0, 0, 0))
        for i, t in enumerate(tiles): out.paste(t, (i * S, 0))
        out.save(os.path.join(FR, MORE), 'WEBP', quality=85, alpha_quality=100, method=6)
        more.append(dict(file=MORE, order=[lk for p, lk in made_], by='CHARACTER 11/7, tools/bohemia_character_the_nine_enemies.py pack'))
    F['more'] = more
    I['enemies_nine'] = ("CHARACTER [more enemy types, their own art] 11/7 (rule 427(b)): FACTIONS' nine act-one types in their own "
                         "garments (kind 'enemy', set 'nine'), packed by tools/bohemia_character_the_nine_enemies.py pack into each type's old "
                         "reference cell with its guns; each type's men are its row's 'looks' in records/target/bb/bohemia_enemies.json")
    with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))
    # THE ROWS: a type's pool switches only when the whole type is made (a short pool puts twins on the board, 121(i))
    # the file is FACTIONS' and hand-laid: only each row's looks line is touched, as text, so nobody else's lines move
    E = json.load(open(ENEMIES)); txt = open(ENEMIES).read()
    for t in ORDER:
        ids = [lk for p, lk in made_ if p['gang'] == t]
        row = next(r for r in E['rows'] if r['id'] == POOL[t])
        if len(ids) != TYPES[t]['count']:
            print('HELD %s: %d of %d made, its row keeps the borrowed people' % (POOL[t], len(ids), TYPES[t]['count'])); continue
        old = '"looks": %s' % json.dumps(row['looks'])
        if row['looks'] == ids: continue
        was = row.get('looks_borrowed') or row['looks']
        new = '"looks": %s, "looks_borrowed": %s' % (json.dumps(ids), json.dumps(was))
        if row.get('looks_borrowed'): old += ', "looks_borrowed": %s' % json.dumps(row['looks_borrowed'])
        assert txt.count(old) == 1, 'the looks line of %s is not where it was: re-read the file' % POOL[t]
        txt = txt.replace(old, new)
    note = '  "looks_note": "CHARACTER 11/7 (rule 427(b), asks 286 and 238): every human type wears its own men (tools/bohemia_character_the_nine_enemies.py); looks_borrowed keeps the people it stood in before, for the record",\n'
    if '"looks_note"' not in txt: txt = txt.replace('  "tuned": false,\n', '  "tuned": false,\n' + note, 1)
    json.loads(txt)
    with open(ENEMIES, 'w') as f: f.write(txt)
    print('packed', len(made_))


# ---- THE SHEET (the lane's own eye and the record) ------------------------------------------------------------------
def sheet():
    from PIL import Image, ImageDraw
    R = json.load(open(ROLL)); od = os.path.join(ROOT, SHEET_DIR); os.makedirs(od, exist_ok=True)
    dirs = ['S', 'SE', 'E', 'NE', 'N', 'SW']
    rows = []
    for p in R:
        d = frames_of(p['id']) if made(p['id']) else os.path.join(ROOT, SHEET_DIR, 'look', look_of(p['id']))
        ims = [Image.open(os.path.join(d, 'rig_%s.png' % f)).convert('RGBA') for f in dirs if os.path.exists(os.path.join(d, 'rig_%s.png' % f))]
        if ims: rows.append((p, ims))
    if not rows: print('nothing rendered yet'); return
    bb = [im.getbbox() for _, ims in rows for im in ims if im.getbbox()]
    cw = max(b[2] - b[0] for b in bb) + 8; ch = max(b[3] - b[1] for b in bb) + 8
    top = min(b[1] for b in bb); left = min(b[0] for b in bb)
    for scale, nm in ((1, 'CHARACTER_THE_NINE_ENEMIES_1X.png'),):   # the card's own picture is the 2:1 one
        W = (cw * len(dirs) + 230) * scale; H = ch * len(rows) * scale
        sh = Image.new('RGBA', (W, H), (118, 106, 88, 255)); dr = ImageDraw.Draw(sh)
        for r, (p, ims) in enumerate(rows):
            dr.text((6 * scale, (r * ch + 6) * scale), '%s\n%s / %s\n%s\n%s' % (p['id'].upper(), p['top'], p.get('coat') or '-', p.get('hat') or '-', ', '.join(p['pieces'])),
                    fill=(20, 18, 16, 255))
            for c, im in enumerate(ims):
                im = im.crop((left - 4, top - 4, left - 4 + cw, top - 4 + ch))
                if scale > 1: im = im.resize((cw * scale, ch * scale), Image.NEAREST)
                sh.alpha_composite(im, ((230 + c * cw) * scale, r * ch * scale))
        sh.save(os.path.join(od, nm)); print('sheet', os.path.relpath(os.path.join(od, nm), ROOT))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'roll': roll()
    elif cmd == 'build-one': build_one(sys.argv[2])
    elif cmd == 'look':
        for pid in sys.argv[2:]: look(pid)
    elif cmd == 'make': make(sys.argv[2])
    elif cmd == 'batch': batch(int(sys.argv[2]) if len(sys.argv) > 2 else 2)
    elif cmd == 'worker': worker(int(sys.argv[2]), int(sys.argv[3]))
    elif cmd == 'pack': pack()
    elif cmd == 'sheet': sheet()
    else: print(__doc__)
