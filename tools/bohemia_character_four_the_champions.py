#!/usr/bin/env python3
"""CHARACTER 4, 11/27/26: THE CHAMPIONS' LOOK (VAMILY rule 493(c): 'champions in the hard jobs and the roaming forces, each with a
name, a look, kit a tier up and a prize on him'; the routine's words: 'each named leader reads as the boss of his band at fight
size: his own runway clothes, kit a tier up, his face on his card, inside PLUMBER 8's iPhone budget').

MEASURED FIRST (CHARACTER 3, main e7eb11a12, handoffs/CHARACTER.md): three champion kinds are dealt (bohemia_enemies.json
'champions': the road crew's, the kids', the heavies'), and none has a look of his own: the fight picks a man's pool at
slices/BOHEMIA_FIGHT.html (ours.bestiary.look_pools[id], else ours.people_looks.band[id], else band.default), so the road crew's
champion was dealt band.default (hall men of other gangs), the kids' the runners, the heavies' the heavies: his band's ordinary
man under a name.

HOW BATTLE BROTHERS DOES IT (records/target/bb/enemies.json, the champion rows; BESTIARY 3's research record): a champion is
the band's own kind in the best kit his band can carry (the brigand leader's champion in a coat of plates, 'Black and Gold
Armor', a feathered helmet; the orc warrior's in looted plate and a metal plate helmet; the goblin skirmisher's with a
reinforced shield), so you pick him out before the lines meet. OURS, ONE IDEA PER BAND, SO THE EYE LEARNS IT ONCE:
  THE ROAD CREW'S CHAMPION   the band is drab hall clothes in tans and browns, scarves, no armour. He is the one long black
                             column: a black leather split-tail duster to the ankle (Rick Owens' drape; TRENCHCOATS ARE FOR
                             BADASSES, and a road crew's champion is the killer that law reserves them for), a black felt
                             gambler's hat banded in the road crews' own orange, dusted (COLOUR IS TERRITORY), and plate a
                             tier over his band's nothing: a rust chest plate or a spiked pauldron.
  THE KIDS' CHAMPION         the band is pale (bone and ash coats, face wraps). He is the Balenciaga oversize turned to
                             black: a black cocoon coat over a pale hood or shirt, grey sweats, chunky soles, the runners'
                             own green as a trailing scarf, and his face shows (they hide theirs). (The rig sets every man's
                             height, about 1.72 to 1.79 m: a dial does not make a boss taller, so he reads by colour and shape.)
  THE HEAVIES' CHAMPION      the band is big men in olive and khaki under steel exo frames with crash-bar shields. He is the
                             one in black: a black leather smith's apron or vest under the same frame and bar, a rust
                             chest plate or a spiked pauldron over it (Battle Brothers' looted plate), and the welder's
                             mask down over his face: the one with no face.
Every one keeps his band's tools (the frame and the bar the heavies' own pieces, tools/bohemia_character_the_three_enemies.py),
so he reads as THEIR boss, not a stranger. The weapon in his hand is the fight's.

THE METHOD, REUSE FIRST (rule 495: one thing, one place): the nine enemies' pipe (tools/bohemia_character_the_nine_enemies.py:
the barber's roll, the body build and its garments, RUN TWO's render on DIRECTION's master rig, COMBAT's fight poses, its
pack), imported; three types added IN MEMORY with their own roll file, the way the powered arm's tool adds its type; the
heavies' frame and bar are the three enemies' own pieces, called through the same door. New in memory, each a copy of an
existing cut in a new cloth (the way the nine add the hi-vis vest): the black leather duster, the black cocoon coat, the black
smith's apron, the black leather vest, the runners' green scarf, and the road crews' gambler's hat.

    python3 tools/bohemia_character_four_the_champions.py roll
    BOHEMIA_BPY=/tmp/v/bin/python python3 tools/bohemia_character_four_the_champions.py model [pid ...]  (the glb)
    BOHEMIA_BPY=/tmp/v/bin/python python3 tools/bohemia_character_four_the_champions.py look [pid ...]   (eight stills, to look at)
    BOHEMIA_BPY=/tmp/v/bin/python python3 tools/bohemia_character_four_the_champions.py make [pid ...]   (the street and fight passes)
    python3 tools/bohemia_character_four_the_champions.py pack     (the fight's sheets, the champions' face strip)
    python3 tools/bohemia_character_four_the_champions.py data     (ours.json: each champion kind dealt his own men)
    python3 tools/bohemia_character_four_the_champions.py card     (the VOTE card)

[bb Battle Brothers' champion is a named man in better kit than his band; you pick him out before the line meets.]
[analog horror: the one in the long black coat, standing still while the rest of them move.]
"""
import json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_the_nine_enemies as NE   # noqa: E402
import bohemia_character_three_the_powered_arm as PA   # noqa: E402,F401  (its arm through the pieces' door; it sets NE.ROLL, ours is set below)

ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_CHAMPIONS_ROLL.json')
OUT = os.path.join(ROOT, 'records/target/character/the_champions')
OURS = os.path.join(ROOT, 'records/target/bb/ours.json')
STRIP = 'faces_champions.webp'
# pack 1 (measured on the sheets): a median cut to 64 colours over 200 frames merged every warm pixel away (the powered arm's
# battery, the hat's orange band: 0 px warmer than r-b 45 left, the still had 54); the champions' marks are small warm pieces
COLOURS, KEEP = 128, 8   # and 8 of them held for the sheet's most coloured pixels (the nine's pack, keep_marks)   # the champions' faces ride their own strip (faces.more), so the nine's strip is never rewritten

# ---- THE COLOURS AT THE SOURCE (the rig's source pass lays the grime and the light) -------------------------------------
BLACK_LEATHER = dict(dk=(22, 20, 20), mid=(40, 36, 34), lt=(66, 60, 56))
BLACK_CLOTH = dict(dk=(24, 23, 25), mid=(42, 41, 43), lt=(68, 67, 69))
ROAD_ORANGE = (176, 96, 40)          # the road crews' banner (factions.json brigands #ff6a00) a value down and dusted
RUNNER_GREEN = dict(dk=(52, 78, 46), mid=(82, 118, 68), lt=(118, 150, 96))   # the runners' banner (#5fd25a) dusted

# ---- THE THREE KINDS (each the champion kind's own pool: ours.json people_looks.band[row], look_pools[kind] -> row) -------
KINDS = {'Road Champion': 'brigand_leader_champion', 'Kids Champion': 'goblin_skirmisher_champion',
         'Heavy Champion': 'orc_warrior_champion'}
TYPES = {
    'Road Champion': dict(
        row='champion_road', faction='road', stand_in='Cartel', cell='faction_cartel', count=2,
        what='the road crew\'s champion: a black leather duster to the ankle, a black gambler\'s hat banded in the road crews\' orange, plate a tier over his band',
        # pack 1: at height 0.50 and 0.35 his hat's crown stood past the fight cell's top (110 px over the foot, the cell his guns
        # are drawn in): 957 and 2,069 px cut off, a flat-topped crown in 69 and 111 of 200 frames; a little shorter, the hat whole
        dials=[dict(height=0.10, belly=0.05, shoulders=0.70, hips=0.05), dict(height=-0.10, belly=0.30, shoulders=0.80, hips=0.15)],
        tops=['BONE HENLEY', 'RUST HENLEY'],
        coats=['BLACK LEATHER DUSTER', 'BLACK LEATHER DUSTER'],
        legs=['LEATHER STACK PANT', 'DUST TROUSERS'],
        feet=['TALL MOTO BOOTS', 'LEATHER STACK BOOT'],
        kit=[['SCRAP CHEST PLATE', 'LEATHER GLOVES', 'LEATHER BELT'], ['SPIKED PAULDRON', 'OXBLOOD GLOVES', 'LEATHER BELT']],
        hats=['GAMBLER HAT ROAD', 'GAMBLER HAT ROAD'], eyewear=[None, 'FACE WRAPAROUND SHADES'],
        pieces=[[], []], outfit=False, cuts=['TEMPLE TAPER', 'GREASE BACK', 'DEEP TAPER', 'RAZOR SKULL']),
    'Kids Champion': dict(
        row='champion_kids', faction='runners', stand_in='Colorful', cell='faction_colorful', count=2,
        what='the kids\' champion: a black oversize cocoon coat over a pale hood or shirt, the runners\' green scarf, his face showing',
        dials=[dict(height=-0.20, belly=-0.40, shoulders=-0.20, hips=0.0), dict(height=-0.30, belly=-0.35, shoulders=-0.25, hips=0.05)],
        tops=['HOOD-UP ASH HOODIE', 'BONE SHOULDER SHIRT'],
        coats=['BLACK COCOON COAT', 'BLACK COCOON COAT'],
        legs=['DROP RISE TROUSER', 'GREY SWEATS'],
        feet=['STACKED SOLE BOOT', 'WHITE SNEAKERS'],
        kit=[['RUNNER SCARF', 'CHEST RIG', 'SOOT HAND WRAPS'], ['RUNNER SCARF', 'SHELL BANDOLIER', 'HAND WRAPS']],
        hats=[None, 'HAT CHARCOAL WATCH CAP'], eyewear=['FACE WRAPAROUND SHADES', None],
        pieces=[[], []], outfit=False, cuts=['SHAG', 'HEAVY FRINGE', 'SPRING CURLS', 'SHORT ROPES', 'HALF SHAVE']),
    'Heavy Champion': dict(
        row='champion_heavy', faction='heavies', stand_in='Remnants', cell='faction_remnants', count=2,
        what='the heavies\' champion: in black leather under the band\'s exo frame and crash bar, rust plate over it, a welder\'s mask down over his face',
        dials=[dict(height=0.70, belly=0.90, shoulders=1.00, hips=0.35), dict(height=0.55, belly=1.00, shoulders=1.00, hips=0.40)],
        tops=['CHARCOAL TURTLENECK', 'OLIVE DRAB TEE'],
        coats=['BLACK SMITH\'S APRON', 'BLACK LEATHER VEST'],
        legs=['SOOT CARGOS', 'KHAKI CARGOS'],   # loop 2: the slate work pants rendered a hot blue under the rig's cool fill (rule 159)
        feet=['TALL MOTO BOOTS', 'CHARCOAL BOOTS'],
        # loop 1 (looking, both at 1:1 and x3, beside heavy_0, 1 and 3): a scrap helm took the rig's up-face dust to a pale egg as
        # the band's own does, and a soot plate on black leather drew nothing: he read as a darker heavy, not their boss. The
        # heavies' champion wears the WELDER'S MASK (the three enemies' own, its pivot now turns both ways): DOWN over his face
        # (a black box head, a lens); a rust plate on the black
        kit=[['SCRAP CHEST PLATE', 'OXBLOOD GLOVES'], ['SPIKED PAULDRON', 'SOOT GLOVES']],
        # pack 1: worn UP the mask stood 10 cm over his crown, past the fight cell's top (3,184 px cut off in 73 of 200 frames): both DOWN
        hats=['WELDER DOWN', 'WELDER DOWN'], eyewear=[None, None],
        # the second wears the POWERED ARM (rule 486, CHARACTER 3's piece) on his right forearm, his left under the crash bar: a black
        # market part on a man rich and feared enough to own one (486(e): a status), and a part that can be taken off him (486(b))
        pieces=[['exo', 'crashbar'], ['exo', 'crashbar', 'powered_arm_right']], outfit=False, cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER', 'DEEP TAPER']),
}
THREE = ('exo', 'crashbar', 'sling')   # the three enemies' own pieces (the heavies' frame and bar, the kids' sling)

for t, T in TYPES.items():
    NE.TYPES[t] = T
    if t not in NE.ORDER: NE.ORDER.append(t)
    NE.POOL[t] = T['row']
NE.ROLL = ROLL
# loop 1 (looking, both at 1:1 and x3): a black quill on the black felt read as an aerial on his hat; Battle Brothers' brigand
# leader champions wear a feathered helmet, so the feather is the road crews' orange with dark bars, a pheasant's tail
# pack 1: the fight's cell holds 110 px over the foot and the 25 cm plume's tip stood past it; a 17 cm one
NE.GAMBLER['GAMBLER HAT ROAD'] = dict(felt=(30, 28, 27), band=ROAD_ORANGE, quill=(190, 112, 52), bar=(58, 36, 24), plume=0.17)
if 'GAMBLER HAT ROAD' not in NE.NEW_HATS: NE.NEW_HATS = tuple(NE.NEW_HATS) + ('GAMBLER HAT ROAD',)


# ---- THE NEW CLOTHS IN THE WARDROBE (in memory, each a copy of an existing cut, as the nine add the hi-vis vest) ---------
_REGISTER = NE.register_garments


def register_garments():
    _REGISTER()
    import bohemia_character_the_three_enemies as TE
    TE.install_hat()   # the welder's mask through HATS 1's door, as the Mechanic wears it
    import bohemia_character_garments_outer as OUTER
    import bohemia_character_garments_gear as GEAR
    def coat(name, cut, words, **cloth):
        if name in OUTER.BY: return
        G = dict(OUTER.BY[cut]); G.update(name=name, tag='outer_' + name.lower().replace(' ', '_').replace("'", ''), words=words, **cloth)
        OUTER.BY[name] = G
    coat('BLACK LEATHER DUSTER', 'SPLIT-TAIL DUSTER', ['BLACK', 'DUSTER', 'LEATHER'], ramp='BLACKLEATHER', **BLACK_LEATHER)
    coat('BLACK COCOON COAT', 'COCOON COAT', ['BLACK', 'COAT', 'COCOON'], ramp='BLACKCLOTH', **BLACK_CLOTH)
    coat('BLACK SMITH\'S APRON', 'SMITH\'S APRON', ['APRON', 'BLACK', 'SMITH'], ramp='BLACKLEATHER', **BLACK_LEATHER)
    coat('BLACK LEATHER VEST', 'LEATHER VEST', ['BLACK', 'LEATHER', 'VEST'], ramp='BLACKLEATHER', **BLACK_LEATHER)
    if 'RUNNER SCARF' not in GEAR.BY:
        S = dict(GEAR.BY['TRAILING SCARF']); S.update(name='RUNNER SCARF', tag='kit_runner_scarf', ramp='RUNNERGREEN', words=['RUNNER', 'SCARF'], **RUNNER_GREEN)
        GEAR.BY['RUNNER SCARF'] = S


NE.register_garments = register_garments

# ---- THE HEAVIES' OWN PIECES THROUGH THE SAME DOOR -------------------------------------------------------------------
_PIECES = NE.body_pieces


def body_pieces(names, X, spec):
    names = list(names or [])
    theirs = [n for n in names if n in THREE]
    rest = [n for n in names if n not in THREE]
    out = _PIECES(rest, X, spec) if rest else []
    if theirs:
        import bohemia_character_the_three_enemies as TE
        out += TE.body_pieces(theirs, X)
    return out


NE.body_pieces = body_pieces


# ---- THE STEPS --------------------------------------------------------------------------------------------------------
def roll():
    if not os.path.exists(ROLL):
        os.makedirs(os.path.dirname(ROLL), exist_ok=True); json.dump([], open(ROLL, 'w'))
    have = {p['gang'] for p in json.load(open(ROLL))}
    for t in TYPES:
        if t in have: print('rolled already:', t); continue
        NE.roll_more(t)


def pids():
    return [p['id'] for p in json.load(open(ROLL))]


def model(pid):
    """the glb through THIS file's build (its types and cloths in memory), so the nine's make finds it built"""
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % NE.tag_of(pid))
    if os.path.exists(glb) and not os.environ.get('BOHEMIA_REBUILD'): return glb
    if os.path.exists(glb): os.remove(glb)
    log = os.path.join(OUT, 'logs', pid + '_build.log'); os.makedirs(os.path.dirname(log), exist_ok=True)
    with open(log, 'w') as lf:   # in the open: RUN TWO's run() hides a failed step behind a manifest it wrote first
        subprocess.call([NE.bpy_py(), os.path.abspath(__file__), 'build-one', pid], cwd=ROOT, stdout=lf, stderr=subprocess.STDOUT)
    ok = os.path.exists(glb)
    if ok: os.remove(log)
    print('MODEL', pid, 'built' if ok else 'FAILED, see ' + os.path.relpath(log, ROOT), flush=True)
    return glb if ok else None


def look(pid):
    R = NE.R2(); glb = model(pid)
    if not glb: return
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    out = os.path.join(OUT, 'look', NE.look_of(pid))
    if os.path.exists(out): shutil.rmtree(out)
    log = os.path.join(OUT, 'logs', pid + '_look.log')
    with open(log, 'w') as lf:
        subprocess.call([NE.bpy_py(), '-c', R.render_code(glb, out, h, clips=[('Stand', 1)])], cwd=ROOT, stdout=lf, stderr=subprocess.STDOUT)
    ok = all(os.path.exists(os.path.join(out, 'rig_%s.png' % f)) for f in ('S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'))
    if ok: os.remove(log)
    print('LOOK', pid, os.path.relpath(out, ROOT), 'eight stills' if ok else 'STILLS MISSING, see ' + os.path.relpath(log, ROOT), flush=True)


def make(pid):
    if model(pid): NE.make(pid)


def pack():
    NE.pack(strip=STRIP, by='CHARACTER 4 11/27, tools/bohemia_character_four_the_champions.py pack', set_='champions', colours=COLOURS, keep=KEEP)


def data():
    """ours.json: each champion kind's own pool (people_looks.band[row]) and the kind pointed at it (bestiary.look_pools), as
    text, two lines added and the three pointers set, so nobody else's lines move; a kind is pointed only when all its men are
    on the fight's sheet"""
    I = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    txt = open(OURS).read(); D = json.loads(txt)
    band = D['people_looks']['value']['band']; lp = D['bestiary']['value']['look_pools']
    for t, kind in KINDS.items():
        T = TYPES[t]; row = T['row']; men = [NE.look_of(NE.pid_of(t, k)) for k in range(T['count'])]
        if not all(m in I['looks'] for m in men): print('HELD', row, 'not all on the fight sheet'); continue
        if band.get(row) != men:
            assert row not in band, row + ' is in the band pools already with other men: re-read the file'
            m = re.search(r'\n( +)"heavy": \[\n( +)[^\]]*?\n( +)\]', txt)   # the last pool, in the file's own indent
            assert m, 'the heavy pool is not where it was'
            key, item, close = m.group(1), m.group(2), m.group(3)
            add = ',\n%s"%s": [\n%s\n%s]' % (key, row, ',\n'.join(item + json.dumps(x) for x in men), close)
            txt = txt[:m.end()] + add + txt[m.end():]
        if lp.get(kind) != row:
            if kind in lp:
                old = '"%s": %s' % (kind, json.dumps(lp[kind])); assert txt.count(old) == 1, old
                txt = txt.replace(old, '"%s": "%s"' % (kind, row))
            else:
                m = re.search(r'"look_pools": \{\n( +)', txt); assert m and txt.count('"look_pools": {') == 1
                txt = txt[:m.end()] + '"%s": "%s",\n%s' % (kind, row, m.group(1)) + txt[m.end():]
        print('DEALT', kind, '->', row, men)
    D2 = json.loads(txt)
    assert D2['people_looks']['value']['band'].keys() >= band.keys()
    open(OURS, 'w').write(txt)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'roll': roll()
    elif cmd == 'build-one': NE.build_one(sys.argv[2])
    elif cmd == 'model':
        for p in (sys.argv[2:] or pids()): model(p)
    elif cmd == 'look':
        for p in (sys.argv[2:] or pids()): look(p)
    elif cmd == 'make':
        for p in (sys.argv[2:] or pids()): make(p)
    elif cmd == 'pack': pack()
    elif cmd == 'data': data()
    elif cmd == 'card':
        import bohemia_character_four_the_champions_card as C; C.card()
    else: print(__doc__)
