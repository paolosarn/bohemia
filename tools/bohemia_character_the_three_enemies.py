#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [the three enemies' looks]: THE MECHANIC, THE KIDS AND RUNNERS, THE HEAVY ON THE 3D MAN
(the coordinator's round of 10/24, Paolo: 'let's have fun, let's be creative'; COMBAT builds the three as [bestiary] rows,
rule 42a: NECROMANCER -> THE MECHANIC, a man who keeps reviving his robots; GOBLINS -> KIDS AND RUNNERS, slings and nets;
ORCS -> THE HEAVY, exo-suit men with crash-bar shields who push you off the tile; records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_
THE_BESTIARY_COUNT_9_29_26.md). Layered (rule 129: layers that show), grimy (121(j)(k)), the runway inside the grime
(Rick Owens' long drape, Balenciaga's oversize, Bottega Veneta's woven leather), and no two alike (121(i)).

THE METHOD, REUSE FIRST. A type is a look on the rig's man like the thirteen gangs' (LOOKS in this lane's
tools/bohemia_character_the_thirteen_through_the_rig.py, entries added IN MEMORY, its file never edited), and each of its
people is rolled the barber's way (the barber's book roll_one for his skin, cut, hair, face, beard and marks, on a
stand-in gang's stream) and dressed from THIS LANE's wardrobe already made (GARMENTS BASE's tops, OUTER's coats, LEGS AND
FEET's trousers and shoes, GEAR 1's belts, gloves, scarves and pads, the face pieces, the hats), worn as an OUTFIT of
layers (tools/bohemia_character_the_outfit.py). What the wardrobe did not have is modelled here, once, as clay:
  THE MECHANIC   CABLES crossing the coat (two insulated runs on the diagonals over the coat, a plug at each hip, a coil
                 on the right hip, three turns round the left upper arm) and THE WELDING MASK PUSHED UP (a curved shell
                 built down over the face, then turned 95 degrees on its two side pivots so its chin juts over the brow
                 and its dark lens faces the sky, a headband and the pivot knobs under it).
  THE KIDS       THE SLING (two cords out of the right fist, a leather pouch with a stone, hanging along the arm so it
                 dangles to the knee when he stands); the oversized layered cuts, the hoods and the face wraps are the
                 wardrobe's (LAYERED JERSEY, LONGLINE, WIDE SHOULDER, the hoodies, the bandanas and face wraps).
  THE HEAVY      THE EXO FRAME strapped over his work clothes (a bar down the outside of each thigh and shin with a disc at
                 the hip and the knee and a stirrup at the boot, a spine bar with a hip ring and a yoke over both
                 shoulders, bars on the backs of the arms, a car battery strapped to the spine for its power: batteries
                 are the money, 9/4), bound on in tan woven leather straps (the Bottega note), and THE CRASH-BAR SHIELD
                 (a truck's bull bar cut off and strapped to his left forearm: a bent tube frame, two uprights, a
                 diamond-plate panel and a dead Nevada plate riveted on, facing out and forward when his arm hangs).

THE PIPE (RUN TWO's, imported and never edited, tools/bohemia_run2_no_two_people_alike.py): build through the barber
(tools/bohemia_character_the_barber_on_the_skull.py) with this tool's person_body, render on DIRECTION's master rig the way
RUN TWO renders a person (stand, walk in eight, the portrait and its four mouths), COMBAT's fight poses laid on his model
(tools/bohemia_combat_the_fight_poses.py, unedited) and the six fight clips rendered, then packed into the fight's own
sheet folder (slices/fight_rig/enemy_<id>.webp in a reference gang's cell, so that gang's gun sheet sits in his hands),
his face into the fight's face strip, and his type's pool into ours.people_looks.band (records/target/bb/ours.json), the
list the fight deals a band's men from. Kind 'enemy' (never 'person': RUN TWO's fight-pack rebuilds its own kind only).

Run:
    python3 tools/bohemia_character_the_three_enemies.py roll                (records/character/BOHEMIA_THE_THREE_ENEMIES_ROLL.json)
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_character_the_three_enemies.py look <id>   (one model, eight stills: the look check)
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_character_the_three_enemies.py batch [workers 2]   (street and fight, everyone)
    python3 tools/bohemia_character_the_three_enemies.py pack                (into the fight's sheets, faces and pools)
    python3 tools/bohemia_character_the_three_enemies.py sheet               (records/target/character/the_three_enemies/*.png)

RULE 128 (every asset carries three acts): the kept scene is this file and the roll; every model is rebuilt from them
on demand (the glbs are deleted after the render, 25 MB a person, as RUN TWO does), so act two is the same people with the
era's cloth swapped in the roll, never a redraw.

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twin is the game's own fight cast at the same cell (the
thirteen and RUN TWO's people in slices/fight_rig) and real photographs of the garments' kind (a welder's hood flipped
up, a sling, a bull bar, a powered exoskeleton frame; the record); the runway names; analog horror AH-01 (scavenged
plates, a seatbelt for a strap, wire for a buckle, a dead plate). No reference game.
"""
import json, math, os, random, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_THREE_ENEMIES_ROLL.json')
OUT = 'records/target/character/enemies'          # the street pass (stills, walk, portrait), as RUN TWO's barber/person_*
STOW = 'records/character/enemies'                # the walk and the rig's portraits, read by the pack only (never published)
FIGHT_RENDERS = 'records/target/combat/rig'       # COMBAT's render folder (regenerated, its .gitignore)
SHEET_DIR = 'records/target/character/the_three_enemies'
STAMP = 'three-enemies-10-24'
PER_TYPE = 3
COUNT = {'Mechanic': 3, 'Runners': 8, 'Heavy': 5}   # round 2: sized to the bands the fight deals (the Mechanic heads his machines alone)

# ---- THE THREE TYPES ------------------------------------------------------------------------------------------------
# A type is a look like a gang's: its own dials, its colours (the outfit and the gear read a look's cloths as its
# 'gang colours'), the stand-in gang whose stream rolls his skin, cut and face, the reference cell on the fight's sheet
# whose box and guns he takes, and the pools his pieces are drawn from (each person a different draw, never the same mix)
SOOT, OIL, RUST_ = (34, 32, 30), (46, 42, 36), (98, 62, 40)
TYPES = {
    'Mechanic': dict(
        what='a scavenger engineer who keeps reviving his robots: a long split coat over coveralls, tool belt, cables crossing him, the welding mask pushed up',
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.35, belly=-0.15, shoulders=0.10, hips=-0.10), dict(height=0.10, belly=0.30, shoulders=0.25, hips=0.05),
               dict(height=0.55, belly=-0.40, shoulders=-0.10, hips=-0.20)],
        look=dict(shirt=dict(colour=(60, 66, 48), sleeve='long'), coat=dict(colour=(92, 66, 44), hem=0.20, flare=0.03, thick=0.016, v=0.05, front_open=0.45, back_slit=0.55),
                  trousers=dict(colour=OIL, wide=0.012), shoes=dict(colour=SOOT, kind='boot', top=0.22), belt=None),
        # cycle 1 (looking, mechanic_0): the olive coveralls and the brown work coat read as one (63 and 69 of 255), so the
        # outfit put him in a pale barn coat to the hip; the coat is LONG (the Rick Owens drape) and a value away from
        # what is under it: a sand duster on dark coveralls, a soot trench on a bone henley, a black split tail on rust
        tops=['WORK COVERALLS', 'BONE HENLEY', 'RUST HENLEY'],
        coats=['WASTELAND DUSTER', 'SOOT TRENCH', 'SPLIT-TAIL COAT'],
        legs=['PATCHED WORK PANTS', 'SOOT CARGOS', 'DUST TROUSERS'],   # round 2: no slate (rule 159, the cool fill turns it blue)
        feet=['TALL MOTO BOOTS', 'DUST BROWN BOOTS', 'FIELD BOOTS'],
        kit=[['SCAV TOOL BELT', 'SOOT GLOVES'], ['SOOT TOOL BELT', 'LEATHER GLOVES', 'WORK SUSPENDERS'], ['SCAV TOOL BELT', 'SALVAGE SATCHEL', 'SOOT GLOVES']],
        hats=['WELDER UP', 'WELDER UP', 'WELDER UP'], eyewear=[None, None, None],
        pieces=['cables'], cuts=['TEMPLE TAPER', 'RAZOR SKULL', 'HOME CLIPPERS', 'DRY TAPER', 'DEEP TAPER', 'GREASE BACK']),
    'Runners': dict(
        what='teenagers in oversized layered streetwear, hoods up or down, scarves over their faces, a sling in the fist',
        stand_in='Colorful', cell='faction_colorful',
        dials=[dict(height=-0.85, belly=-0.55, shoulders=-0.55, hips=-0.10), dict(height=-0.60, belly=-0.45, shoulders=-0.45, hips=0.10),
               dict(height=-1.00, belly=-0.50, shoulders=-0.60, hips=0.00), dict(height=-0.75, belly=-0.50, shoulders=-0.50, hips=0.05),
               dict(height=-0.90, belly=-0.60, shoulders=-0.65, hips=-0.05), dict(height=-0.55, belly=-0.40, shoulders=-0.40, hips=0.05),
               dict(height=-0.70, belly=-0.55, shoulders=-0.50, hips=0.10), dict(height=-0.95, belly=-0.45, shoulders=-0.55, hips=0.00)],
        look=dict(shirt=dict(colour=(48, 48, 52), sleeve='long'), coat=None,
                  trousers=dict(colour=(70, 72, 78), wide=0.03), shoes=dict(colour=(186, 182, 172), kind='sneaker'), belt=None),
        # round 2: EIGHT, not three. The fight deals a kids' band of up to ten from this one pool (ours.enemy_tiers kids,
        # count_scale 0.6; every goblin kind reads 'runner') and only a pool smaller than the board repeats a face, so three
        # put twins on every board past three (121(i)). Layers that show (rule 129): every kid wears a top under a coat, a
        # vest, a jacket, a poncho or a cape, a value off it. Rule 159: the blue pieces (a denim vest, the outlaw bandana, the
        # slate and storm greys, which render a hot blue under the rig's cool fill) are out; ash, coal, bone, khaki, rust
        tops=['HOOD-UP COAL HOODIE', 'LAYERED JERSEY', 'COAL HOODIE', 'CHARCOAL TURTLENECK', 'LONGLINE JERSEY', 'FADED BLACK LONGSLEEVE',
              'ASH LONGLINE TEE', 'TATTERED TEE'],
        # round 2 (looking, runner_0 at 1:1): one hoodie and a wrap read as one garment, not streetwear layers (rule 129):
        # the hood stays up and the Balenciaga oversize goes over it, a bone cocoon coat a value off the coal (the slate one rendered a hot blue under the rig's cool fill, rule 159)
        coats=['BONE COCOON COAT', 'ASH ASYM COAT', 'BONE VEST', 'LEATHER JACKET', 'KHAKI JACKET', 'HOODED DUST PONCHO', 'COMMA COAT', None],
        legs=['DROP RISE TROUSER', 'GREY SWEATS', 'BLACK CARGOS', 'BONE DROP TROUSER', 'CHARCOAL CROP TROUSER', 'BLACK DENIM',
              'DUST TROUSERS', 'LEATHER STACK PANT'],
        feet=['GREY SNEAKERS', 'WHITE SNEAKERS', 'BONE SNEAKERS', 'COAL MID BOOT', 'ASH SLOUCH BOOT', 'STACKED SOLE BOOT',
              'WRAPPED BOOTS', 'GREY SNEAKERS'],
        kit=[['TRAILING SCARF', 'HAND WRAPS'], ['SALVAGE SATCHEL', 'SOOT HAND WRAPS'], ['OXBLOOD SATCHEL', 'HAND WRAPS'],
             ['CHARCOAL SCARF', 'SOOT HAND WRAPS'], ['DUST SCARF', 'RUCK PACK'], ['HAND WRAPS', 'HIP SASH'],
             ['BONE SCARF', 'SOOT HAND WRAPS'], ['CHARCOAL ROAD CAPE', 'DUST BROWN BANDOLIER', 'HAND WRAPS']],
        hats=[None, None, None, 'HAT OXBLOOD SLOUCH BEANIE', 'HAT CHARCOAL WATCH CAP', None, 'HAT SOOT HEAD WRAP', 'HAT SAND KNIT CAP'],
        eyewear=['FACE ASH FACE WRAP', 'FACE OXBLOOD DUST MASK', 'FACE FACE WRAP', 'FACE CHARCOAL DUST MASK', 'FACE RUST DUST MASK',
                 'FACE OLIVE DUST MASK', 'FACE FACE WRAP', 'FACE CHARCOAL DUST MASK'],
        pieces=['sling'], cuts=['SHAG', 'HEAVY FRINGE', 'SPRING CURLS', 'SHORT ROPES', 'CURTAIN CUT', 'STATIC', 'HALF SHAVE']),
    'Heavy': dict(
        what='an exo-suit frame strapped over his work clothes in woven leather, a battery on the spine, a crash-bar shield on the left arm',
        stand_in='Remnants', cell='faction_remnants',
        dials=[dict(height=0.30, belly=0.85, shoulders=1.00, hips=0.30), dict(height=0.10, belly=1.00, shoulders=0.90, hips=0.40),
               dict(height=0.45, belly=0.60, shoulders=1.00, hips=0.20), dict(height=0.20, belly=0.95, shoulders=0.95, hips=0.35),
               dict(height=0.40, belly=0.70, shoulders=1.00, hips=0.25)],
        look=dict(shirt=dict(colour=(76, 90, 106), sleeve='long'), coat=None,
                  trousers=dict(colour=(66, 66, 68), wide=0.02), shoes=dict(colour=SOOT, kind='boot', top=0.24), belt=None),
        # round 2: FIVE (a heavies' band fields up to five Heavies at count_scale 0.45, orc_warrior and lower_orc_warrior)
        # round 2 (looking, heavy_2 at 1:1): the steel shin guards rendered two blue patches on his shins (rule 159): rust scrap guards
        tops=['WORK COVERALLS', 'BONE BUTTON-UP', 'OLIVE DRAB TEE', 'DUST PLAID SHIRT', 'FADED BLACK LONGSLEEVE'],   # round 2: the steel shirt is blue (rule 159); bone under the olive vest
        coats=['QUILTED VEST', 'TACTICAL VEST', 'LEATHER VEST', 'OLIVE VEST', "SMITH'S APRON"],
        legs=['SLATE WORK PANTS', 'KHAKI CARGOS', 'SOOT CARGOS', 'BONE WORK PANTS', 'DUST BROWN TROUSERS'],
        feet=['FIELD BOOTS', 'TALL MOTO BOOTS', 'RUST BOOTS', 'CHARCOAL BOOTS', 'RANCH BOOTS'],
        kit=[['SCAV KNEEPADS', 'LEATHER GLOVES'], ['SOOT GLOVES', 'SOOT GORGET'], ['SHIN GUARDS', 'LEATHER GLOVES'],
             ['SCRAP PAULDRON', 'SOOT GLOVES'], ['SOOT CHEST PLATE', 'LEATHER GLOVES']],
        hats=[None, 'HAT SCRAP HELM', None, None, 'HAT DUST WORK CAP'], eyewear=['FACE RUBBER GAS MASK', None, 'FACE SHIELD VISOR', 'FACE ASH SHIELD', None],
        # cycle 1 (looking, heavy_0): a bald or shaved crown takes the rig's up-face dust and a deep skin read as a pale
        # egg; the Heavy wears short hair or the helm
        pieces=['exo', 'crashbar'], cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER', 'DEEP TAPER']),
}
ORDER = ['Mechanic', 'Runners', 'Heavy']
POOL = {'Mechanic': 'mechanic', 'Runners': 'runner', 'Heavy': 'heavy'}   # ours.people_looks.band keys (COMBAT's enemy ids, see the note)

# the colours the new pieces wear (the grime is the rig's source pass; these are the cloth and the metal at the source)
CABLE_ORANGE, CABLE_BLACK, CABLE_GREY = (150, 86, 42), (30, 29, 28), (92, 90, 86)
PLUG = (176, 168, 150)
MASK, LENS = (40, 38, 36), (22, 34, 26)
STEEL, STEEL_DK, RUSTED = (112, 108, 100), (64, 62, 58), (104, 70, 46)
WOVEN = (132, 92, 56)            # Bottega's tan, woven: the straps that bind the frame
BATTERY, TERM_RED, TERM_BLK = (44, 44, 46), (150, 46, 38), (30, 30, 30)
PLATE, PLATE_INK = (170, 164, 134), (52, 66, 92)
POUCH, STONE, CORD = (92, 62, 40), (112, 108, 102), (70, 52, 36)


def look_entry(t, i):
    """the type's look for his body (a LOOKS entry like the thirteen's, in memory)"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    T = TYPES[t]; L0 = T['look']
    L = dict(order=300 + ORDER.index(t), shape=T['what'], dials=dict(T['dials'][i % len(T['dials'])]),
             worn=dict(hair='TEMPLE TAPER'), hair=dict(style='taper', colour=CH.HAIR_DARK),
             shirt=dict(L0['shirt']), trousers=dict(L0['trousers']), shoes=dict(L0['shoes']))
    if L0.get('coat'): L['coat'] = dict(L0['coat'])
    return L


def register():
    """the three types as LOOKS (the outfit and the gear read a look's cloths as its gang's colours)"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    for t in ORDER:
        if t not in CH.LOOKS: CH.LOOKS[t] = look_entry(t, 0)


# ---- THE ROLL --------------------------------------------------------------------------------------------------------
def roll():
    import bohemia_character_the_barbers_book as BB
    B = json.load(open(BB.BOOK))
    cut_rows = {c['name']: c for c in B['cuts']}
    people = []
    for t in ORDER:
        T = TYPES[t]; seen = set(); i = 0; got = 0
        while got < COUNT[t]:
            P = BB.roll_one(B, T['stand_in'], 'enemy:%s:%d' % (t, i)); i += 1
            rng = random.Random('three enemies:%s:%d' % (t, got))
            k = got
            P['id'] = '%s_%d' % (POOL[t], got); P['gang'] = t; P['type'] = t
            # his cut from the type's own (a mask or a hood over it wants a short one), his dials by his place in the band
            P['hair_cut'] = T['cuts'][(k * 3 + rng.randrange(len(T['cuts']))) % len(T['cuts'])]
            if t == 'Runners':   # a teenager: no beard, no grey
                for f in ('facial_hair', 'beard', 'new_beard', 'stubble'): P.pop(f, None)
                if P['hair'][0] == 'tape_grey': P['hair'] = ['cloth_black', 0]
            P['top'] = T['tops'][k]
            if T['coats'][k]: P['coat'] = T['coats'][k]
            else: P.pop('coat', None)
            P['legs'] = T['legs'][k]; P['feet'] = T['feet'][k]
            P['kit'] = list(T['kit'][k])
            P.pop('hat', None); P.pop('eyewear', None)
            if T['hats'][k]: P['hat'] = T['hats'][k]
            if T['eyewear'][k]: P['eyewear'] = T['eyewear'][k]
            P['pieces'] = list(T['pieces']); P['dials'] = T['dials'][k]
            key = BB.key(P) + (P['top'], P.get('coat'), t)
            if key in seen: continue
            seen.add(key); people.append(P); got += 1
    os.makedirs(os.path.dirname(ROLL), exist_ok=True)
    json.dump(people, open(ROLL, 'w'), indent=1)
    print('rolled', len(people), '->', os.path.relpath(ROLL, ROOT))
    for P in people: print(' ', P['id'], P['tone'], P['hair_cut'], '|', P['top'], '/', P.get('coat'), '|', P['legs'], '/', P['feet'], '|', P['kit'], P.get('hat'), P.get('eyewear'))


# ---- THE NEW PIECES ON THE BODY (called inside the body tool's build with its locals, after his garments) -------------
def body_pieces(names, X):
    import bohemia_character_garments_base as BASE
    if not names: return []
    K_ = BASE.kit(X)
    V, M, Mi, P_, fam_v = K_['V'], K_['M'], K_['Mi'], K_['P'], K_['fam_v']
    band, ring_pts, surf, new_obj, finish, front, arm_ring = K_['band'], K_['ring_pts'], K_['surf'], K_['new_obj'], K_['finish'], K_['front'], K_['arm_ring']
    bvh = K_['bvh']; bmesh = X['bmesh']; mathutils = X['mathutils']; arm = X['arm']; section = X['section']; L = X['L']
    Aw = arm.matrix_world
    full = lambda bn: next(b.name for b in arm.data.bones if b.name.endswith(bn) or b.name == bn)
    joint = lambda bn: Aw @ arm.data.bones[full(bn)].head_local
    over = (0.022 if (L.get('worn') or {}).get('outer') or isinstance(L.get('coat'), dict) else 0.0)
    made = []

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
        """a piece whose weights follow the height (a strap round the torso rides the torso alone)"""
        for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
        groups = {}
        for v in o.data.vertices:
            for bn, w in wfn(M @ v.co).items():
                if w <= 1e-4: continue
                if bn not in groups: groups[bn] = o.vertex_groups.new(name=full(bn))
                groups[bn].add([v.index], w, 'REPLACE')
        return o

    def torso_w(p):
        a3 = BASE.sstep(0.90, 1.00, p.z); a1 = BASE.sstep(0.80, 0.70, p.z)
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
        """a tube along a polyline: a cylinder per leg, a ball at every bend"""
        for a, b in zip(pts, pts[1:]): cyl(bm, a, b, r, seg=seg)
        for p in pts[1:-1]: ball(bm, p, r, seg=seg, ring=5)

    def torus(bm, c, axis, R, r, n=24, seg=8):
        axis = axis.normalized(); u = axis.orthogonal().normalized(); w = axis.cross(u).normalized()
        rings = []
        for i in range(n):
            a = 2 * math.pi * i / n; d = u * math.cos(a) + w * math.sin(a); o = c + d * R
            rings.append([bm.verts.new(o + (d * math.cos(2 * math.pi * j / seg) + axis * math.sin(2 * math.pi * j / seg)) * r) for j in range(seg)])
        for i in range(n):
            for j in range(seg):
                bm.faces.new((rings[i][j], rings[i][(j + 1) % seg], rings[(i + 1) % n][(j + 1) % seg], rings[(i + 1) % n][j]))

    def tilted(z_c, slope, off):
        o = V((0.0, -0.004, z_c)); u = V((0.24 * slope, 0.0, -0.44)).normalized()
        return ring_pts(o, u, V((0, -1, 0)), n=56, off=off)

    def leg_c(z, sx):
        pts = [p for p, fm in zip(P_, fam_v) if fm in ('thigh', 'shin', 'foot') and p.x * sx > 0 and abs(p.z - z) < 0.03]
        if not pts: return V((sx * 0.08, -0.02, z)), 0.06
        c = V((sum(p.x for p in pts) / len(pts), sum(p.y for p in pts) / len(pts), z))
        return c, max(math.hypot(p.x - c.x, p.y - c.y) for p in pts)

    for nm in names:
        # ---- THE MECHANIC'S CABLES ----
        if nm == 'cables':
            for k, (slope, z_c, col, lift) in enumerate(((-1, 0.900, CABLE_ORANGE, 0.012), (1, 0.880, CABLE_BLACK, 0.024))):
                ring = tilted(z_c, slope, over + lift)
                made.append(weighted(band('cable_%d' % k, [ring], 0.026, 0.024, col, seg=8), torso_w))   # cycle 1: 2 cm read as a pencil line
                # the plug at the hip end of the run (his left for the orange, his right for the black), hanging on its tail
                lo = min(ring, key=lambda pd: pd[0].z)[0]; sx = 1 if lo.x > 0 else -1
                bm = bmesh.new(); pipe(bm, [lo, lo + V((sx * 0.012, -0.010, -0.050)), lo + V((sx * 0.018, -0.018, -0.110))], 0.009)
                made.append(solid('cable_tail_%d' % k, bm, col, 'Skeleton_torso_joint_1', 0))
                bm = bmesh.new(); c = lo + V((sx * 0.020, -0.020, -0.140))
                box(bm, c, V((0.016, 0, 0)), V((0, 0.012, 0)), V((0, 0, 0.026)))
                made.append(solid('cable_plug_%d' % k, bm, PLUG if k == 0 else CABLE_GREY, 'Skeleton_torso_joint_1', 1))
                bm = bmesh.new()
                for dx in (-0.006, 0.006): cyl(bm, c + V((dx, 0, -0.026)), c + V((dx, 0, -0.046)), 0.0025, seg=6)   # the prongs
                made.append(solid('cable_prongs_%d' % k, bm, (150, 140, 110), 'Skeleton_torso_joint_1', 0))
            # the coil on his right hip, hung off the tool belt
            s_ = section(0.60, ('torso',))
            bm = bmesh.new(); cc = V((-(s_['rx'] + 0.040 + over * 0.5), s_['cy'] + 0.010, 0.560))
            for j in range(3): torus(bm, cc + V((0.004 * j, 0, -0.006 * j)), V((1, 0, 0.15)), 0.070 - 0.004 * j, 0.010)
            made.append(solid('cable_coil', bm, CABLE_ORANGE, 'Skeleton_torso_joint_1', 0))
            # three turns of grey round the left upper arm (the run he pulls a robot's power from)
            for i, s_a in enumerate((0.36, 0.46, 0.56)):
                rings = arm_ring(s_a, over * 0.5 + 0.010)
                left = [r for r in rings if r[0][0].x > 0]
                made.append(band('cable_arm_%d' % i, left, 0.016, 0.014, CABLE_GREY, seg=6))
        # ---- THE RUNNER'S SLING ----
        elif nm == 'sling':
            hb, wr, ax, wd, th, ln, width = next(h for h in X['hands'] if h[1].x < 0)   # his right hand
            # cycle 1 (looking, runner_0): 7 mm cords broke into dots at 1:1 and, laid along the fist's own axis, the sling
            # stuck out forward once he stood; it hangs along his FOREARM's line (straight down when the arm hangs), the
            # cords 1.2 cm, the pouch 7 cm
            fa = (joint('Skeleton_arm_joint_R__3_') - joint('Skeleton_arm_joint_R__2_')).normalized()
            wd = (wd - fa * wd.dot(fa)).normalized(); th = fa.cross(wd).normalized()
            grip = wr + fa * (ln * 0.55); pouch = wr + fa * (ln + 0.24)
            bm = bmesh.new()
            for s in (-1, 1):
                pipe(bm, [grip + wd * (0.008 * s), grip + fa * 0.10 + wd * (0.014 * s), pouch - fa * 0.02 + wd * (0.028 * s)], 0.006, seg=6)
            made.append(solid('sling_cords', bm, CORD, hb, 0))
            bm = bmesh.new(); ball(bm, pouch, 1.0, seg=12, ring=7)
            for v in bm.verts:   # the pouch: a cupped leather oval round its stone
                d = v.co - pouch; v.co = pouch + fa * (d.dot(fa) * 0.036) + wd * (d.dot(wd) * 0.046) + th * (d.dot(th) * 0.026)
            made.append(solid('sling_pouch', bm, POUCH, hb, 1))
            bm = bmesh.new(); ball(bm, pouch + th * 0.014, 0.020, seg=8, ring=6)
            made.append(solid('sling_stone', bm, STONE, hb, 0))
        # ---- THE HEAVY'S EXO FRAME ----
        elif nm == 'exo':
            # cycle 1 (looking, heavy_0 at 1:1 and x4): 2.8 cm bars read as wire and he stood no wider than a plain man;
            # the bars are 4 cm, the discs 8, and a motor housing sits on each shoulder and a piston rides each thigh
            R_ = 0.020
            for sx, side in ((1, 'L'), (-1, 'R')):
                hip, knee, ank = joint('leg_joint_%s_1' % side), joint('leg_joint_%s_2' % side), joint('leg_joint_%s_3' % side)
                def out_at(z):
                    c, r = leg_c(z, sx); return V((c.x + sx * (r + 0.030 + 0.6 * T_wide), c.y, z))
                T_wide = (L.get('trousers') or {}).get('wide', 0.0) or 0.0
                h_p, k_p, a_p = out_at(hip.z - 0.06), out_at(knee.z), out_at(ank.z + 0.06)
                bm = bmesh.new(); cyl(bm, h_p, k_p + V((0, 0, 0.030)), R_)
                made.append(solid('exo_thigh_%s' % side, bm, STEEL, 'leg_joint_%s_1' % side, 0))
                bm = bmesh.new(); cyl(bm, k_p - V((0, 0, 0.030)), a_p, R_)
                made.append(solid('exo_shin_%s' % side, bm, STEEL, 'leg_joint_%s_2' % side, 0))
                # the piston: a thinner rod beside the thigh bar, its cylinder fat at the hip end
                bm = bmesh.new(); cyl(bm, h_p + V((0, -0.040, -0.04)), h_p.lerp(k_p, 0.55) + V((0, -0.040, 0)), 0.017, seg=10)
                cyl(bm, h_p.lerp(k_p, 0.50) + V((0, -0.040, 0)), k_p + V((0, -0.040, 0.05)), 0.008, seg=8)
                made.append(solid('exo_piston_%s' % side, bm, STEEL_DK, 'leg_joint_%s_1' % side, 0))
                for nm_, p, bn in (('hip', h_p + V((0, 0, 0.02)), 'leg_joint_%s_1' % side), ('knee', k_p, 'leg_joint_%s_2' % side)):
                    bm = bmesh.new(); cyl(bm, p - V((sx * 0.012, 0, 0)), p + V((sx * 0.018, 0, 0)), 0.042, seg=16)
                    made.append(solid('exo_%s_disc_%s' % (nm_, side), bm, STEEL_DK, bn, 0))
                    bm = bmesh.new(); cyl(bm, p + V((sx * 0.014, 0, 0)), p + V((sx * 0.020, 0, 0)), 0.012, seg=10)
                    made.append(solid('exo_%s_bolt_%s' % (nm_, side), bm, RUSTED, bn, 0))
                # the stirrup: a plate on the outside of the boot, under the ankle
                bm = bmesh.new(); box(bm, a_p + V((-sx * 0.010, -0.010, -0.050)), V((0.006, 0, 0)), V((0, 0.040, 0)), V((0, 0, 0.030)))
                made.append(solid('exo_stirrup_%s' % side, bm, STEEL_DK, 'leg_joint_%s_3' % side, 1))
                # the woven straps round the thigh and the shin (the Bottega note: tan leather, plaited)
                for z_, bn in ((hip.z - 0.16, 'leg_joint_%s_1' % side), (knee.z - 0.15, 'leg_joint_%s_2' % side)):
                    c, r = leg_c(z_, sx)
                    ring = ring_pts(c, V((1, 0, 0)), V((0, -1, 0)), n=32, off=0.012 + 0.6 * T_wide)
                    g = band('exo_strap_%s_%d' % (side, int(z_ * 100)), [ring], 0.040, 0.010, WOVEN, groove=lambda a: 0.003 * max(0.0, math.cos(16 * a)) ** 2)
                    made.append(weighted(g, lambda p, bn=bn: {bn: 1.0}))
            # the spine bar, the hip ring and the yoke over the shoulders
            sh = section(1.00, ('torso',)); back = sh['cy'] + sh['back'] + over + 0.045
            sl = section(0.72, ('torso',)); back_lo = sl['cy'] + sl['back'] + over + 0.040
            bm = bmesh.new(); pipe(bm, [V((0, back_lo, 0.66)), V((0, back, 0.92)), V((0, back - 0.01, 1.14))], R_ * 1.2)
            made.append(weighted(solid('exo_spine', bm, STEEL, 'torso_joint_3', 0), torso_w))
            ring = ring_pts(V((0.0, section(0.66, ('torso',))['cy'], 0.66)), V((1, 0, 0)), V((0, -1, 0)), n=56, off=over * 0.4 + 0.020)
            made.append(weighted(band('exo_hip_ring', [ring], 0.050, 0.020, STEEL_DK), torso_w))
            for sx in (1, -1):
                top = V((sx * 0.060, back - 0.010, 1.140))
                # the top of his shoulder, measured from under the jaw (the 1.2x head is 15 cm wide: from above, the ray
                # found the skull at 1.43 m and the yoke went over his head; the shoulder's top is near 1.11)
                hit = bvh.ray_cast(V((sx * 0.130, sh['cy'], 1.19)), V((0, 0, -1)), 0.5)
                sh_top = (hit[0] if hit[0] else V((sx * 0.125, sh['cy'], 1.15))) + V((0, 0, over + 0.030))
                f1 = front(sx * 0.115, 1.02); f1 = f1 + V((0, -(over + 0.035), 0))
                f2 = front(sx * 0.105, 0.90); f2 = f2 + V((0, -(over + 0.030), 0))
                bm = bmesh.new(); pipe(bm, [V((0, back - 0.01, 1.14)), top, sh_top, f1, f2], R_)
                made.append(weighted(solid('exo_yoke_%d' % (sx > 0), bm, STEEL, 'torso_joint_3', 0), lambda p: {'torso_joint_3': 1.0}))
                # the shoulder motor: a drum on the point of the shoulder, its axis front to back, the yoke through it
                # (cycle 2, looking: a ray cast down at the joint's x hit the skull, the 1.2x head is that wide, and the two
                # drums stood on his head like ears; the drum sits on the joint itself, off it by the shoulder's own flesh)
                SHj = joint('Skeleton_arm_joint_L__4_' if sx > 0 else 'Skeleton_arm_joint_R')
                mc = SHj + V((sx * 0.030, 0, 0.070 + over))
                bm = bmesh.new(); cyl(bm, mc + V((0, -0.060, 0)), mc + V((0, 0.060, 0)), 0.050, seg=16)
                made.append(weighted(solid('exo_motor_%d' % (sx > 0), bm, STEEL_DK, 'torso_joint_3', 0), lambda p: {'torso_joint_3': 1.0}))
                bm = bmesh.new(); cyl(bm, mc + V((0, -0.064, 0)), mc + V((0, -0.058, 0)), 0.034, seg=12)
                made.append(weighted(solid('exo_motor_cap_%d' % (sx > 0), bm, RUSTED, 'torso_joint_3', 0), lambda p: {'torso_joint_3': 1.0}))
                # the hip ring's pivot to each leg bar
                c, r = leg_c(0.66, sx)
                bm = bmesh.new(); cyl(bm, V((sx * (r + abs(c.x) + 0.02), c.y, 0.66)), V((sx * (r + abs(c.x) + 0.045), c.y, 0.66)), 0.030, seg=14)
                made.append(solid('exo_hip_pivot_%d' % (sx > 0), bm, STEEL_DK, 'Skeleton_torso_joint_1', 0))
            # the chest strap across the yoke, woven
            made.append(weighted(band('exo_chest_strap', [ring_pts(V((0.0, section(0.95, ('torso',))['cy'], 0.95)), V((1, 0, 0)), V((0, -1, 0)), n=56, off=over + 0.012)],
                                      0.040, 0.010, WOVEN, groove=lambda a: 0.003 * max(0.0, math.cos(40 * a)) ** 2), torso_w))
            # the battery on the spine (batteries are the money): a car battery, its two terminals, a strap over it
            bm = bmesh.new(); bc = V((0, back + 0.065, 0.84))
            box(bm, bc, V((0.095, 0, 0)), V((0, 0.055, 0)), V((0, 0, 0.075)))
            made.append(weighted(solid('exo_battery', bm, BATTERY, 'torso_joint_3', 1), torso_w))
            for dx, col in ((-0.055, TERM_RED), (0.055, TERM_BLK)):
                bm = bmesh.new(); cyl(bm, bc + V((dx, 0.010, 0.075)), bc + V((dx, 0.010, 0.098)), 0.012, seg=10)
                made.append(weighted(solid('exo_term_%d' % (dx > 0), bm, col, 'torso_joint_3', 0), torso_w))
            bm = bmesh.new(); box(bm, bc + V((0, 0.057, 0)), V((0.100, 0, 0)), V((0, 0.004, 0)), V((0, 0, 0.018)))
            made.append(weighted(solid('exo_battery_strap', bm, WOVEN, 'torso_joint_3', 0), torso_w))
            # the bars on the backs of the arms, a disc at the elbow
            for sx, up, fo in ((1, 'Skeleton_arm_joint_L__4_', 'Skeleton_arm_joint_L__3_'), (-1, 'Skeleton_arm_joint_R', 'Skeleton_arm_joint_R__2_')):
                S0, E0 = joint(up), joint(fo)
                W0 = joint('Skeleton_arm_joint_L__2_' if sx > 0 else 'Skeleton_arm_joint_R__3_')
                def back_of(p):
                    hit = bvh.ray_cast(p + V((0, 0.4, 0)), V((0, -1, 0)), 0.8)
                    return (hit[0] if hit[0] else p + V((0, 0.05, 0))) + V((0, over * 0.5 + 0.022, 0))
                a0, a1 = back_of(S0.lerp(E0, 0.25)), back_of(S0.lerp(E0, 0.92))
                b0, b1 = back_of(E0.lerp(W0, 0.08)), back_of(E0.lerp(W0, 0.80))
                bm = bmesh.new(); cyl(bm, a0, a1, R_ * 0.85)
                made.append(solid('exo_upper_%d' % (sx > 0), bm, STEEL, up, 0))
                bm = bmesh.new(); cyl(bm, b0, b1, R_ * 0.85)
                made.append(solid('exo_fore_%d' % (sx > 0), bm, STEEL, fo, 0))
                bm = bmesh.new(); e = back_of(E0); cyl(bm, e - V((0, 0.010, 0)), e + V((0, 0.012, 0)), 0.026, seg=14)
                made.append(solid('exo_elbow_%d' % (sx > 0), bm, STEEL_DK, fo, 0))
        # ---- THE HEAVY'S CRASH-BAR SHIELD, on the left forearm ----
        elif nm == 'crashbar':
            E0, W0 = joint('Skeleton_arm_joint_L__3_'), joint('Skeleton_arm_joint_L__2_')
            a = (W0 - E0).normalized()                                   # along the forearm (down, when he stands)
            up = (V((0, 0, 1)) - a * a.z).normalized()                    # the arm's top in the rest pose: out from his side when the arm hangs
            n = (up * math.cos(math.radians(50)) + V((0, -1, 0)) * math.sin(math.radians(50))).normalized()   # out and forward
            n = (n - a * n.dot(a)).normalized(); b = n.cross(a).normalized()
            mid = E0.lerp(W0, 0.55)
            hit = bvh.ray_cast(mid + n * 0.4, -n, 0.8); base_p = hit[0] if hit[0] else mid + n * 0.05
            O = base_p + n * (0.050 + over * 0.5)
            H, W = 0.31, 0.24                                               # half the height and the width: 62 by 48 cm
            P2 = lambda u, w, d=0.0: O + a * u + b * w + n * d
            # the frame: a rounded rectangle of 3.6 cm tube, the uprights, the crossbar, the bent push bar standing off it
            rr = 0.05; pts = []
            for cu, cw, a0 in ((H - rr, W - rr, 0), (-(H - rr), W - rr, 90), (-(H - rr), -(W - rr), 180), (H - rr, -(W - rr), 270)):
                for s in range(5):
                    t = math.radians(a0 + 22.5 * s); pts.append(P2(cu + rr * math.cos(t), cw + rr * math.sin(t)))
            pts.append(pts[0])
            bm = bmesh.new(); pipe(bm, pts, 0.018, seg=10)
            for w_ in (-0.09, 0.09): cyl(bm, P2(H - 0.01, w_), P2(-(H - 0.01), w_), 0.014, seg=10)
            cyl(bm, P2(0.10, -(W - 0.01)), P2(0.10, W - 0.01), 0.014, seg=10)
            pipe(bm, [P2(-H + 0.02, -W + 0.05, 0.0), P2(-H + 0.06, -W + 0.08, 0.06), P2(-H + 0.06, W - 0.08, 0.06), P2(-H + 0.02, W - 0.05, 0.0)], 0.016, seg=10)
            made.append(solid('crashbar_frame', bm, STEEL, 'Skeleton_arm_joint_L__3_', 0))
            # the diamond-plate panel behind the bars, bent and dented, rust at its edges
            bm = bmesh.new(); box(bm, P2(-0.05, 0.0, -0.016), a * 0.22, b * (W - 0.03), n * 0.006)
            g = solid('crashbar_panel', bm, STEEL_DK, 'Skeleton_arm_joint_L__3_', 0)
            g.data.materials.append(X['mat']('crashbar_rust', RUSTED)); ri = len(g.data.materials) - 1
            for f in g.data.polygons:
                q = M @ f.center - O
                if abs(q.dot(a)) > 0.19 or abs(q.dot(b)) > W - 0.06: f.material_index = ri
            made.append(g)
            # the dead plate riveted to the panel (pale, its blue letters gone grey; nobody reads it)
            bm = bmesh.new(); box(bm, P2(-0.13, 0.0, -0.008), a * 0.055, b * 0.105, n * 0.004)
            g = solid('crashbar_plate', bm, PLATE, 'Skeleton_arm_joint_L__3_', 0)
            g.data.materials.append(X['mat']('crashbar_plate_ink', PLATE_INK)); ii = len(g.data.materials) - 1
            for f in g.data.polygons:
                q = M @ f.center - P2(-0.13, 0.0)
                if f.normal.length and abs(q.dot(a)) < 0.022 and abs(q.dot(b)) < 0.075 and (M.to_3x3() @ f.normal).normalized().dot(n) > 0.5: f.material_index = ii
            made.append(g)
            # the two arm straps behind it, woven, round the forearm
            for s_a in (0.25, 0.75):
                c = E0.lerp(W0, s_a); u = a.orthogonal().normalized(); w = a.cross(u).normalized()
                made.append(weighted(band('crashbar_strap_%d' % int(s_a * 100), [ring_pts(c, u, w, n=24, off=0.012)], 0.034, 0.010, WOVEN),
                                     lambda p: {'Skeleton_arm_joint_L__3_': 1.0}))
    return [m for m in made if m is not None]


# ---- THE WELDING MASK, PUSHED UP (a hat the barber's head build calls through HATS 1's door) --------------------------
def welder(L):
    bpy, bmesh = L['bpy'], L['bmesh']
    Vector, BVHTree = L['Vector'], L['BVHTree']
    C, sc, skull_bm, finish, mat = L['C'], L['sc'], L['skull_bm'], L['finish'], L['mat']
    bm_s = skull_bm(); bvh = BVHTree.FromBMesh(bm_s); bm_s.free()

    def skull_r(az, z):
        d = Vector((math.sin(az), -math.cos(az), 0.0)); o = C + Vector((0, 0, z))
        hit = bvh.ray_cast(o, d, 0.5)
        return (hit[0] - o).length if hit[0] else 0.11

    made = []
    m_mask = mat('welder_shell', MASK, 0.55); m_lens = mat('welder_lens', LENS, 0.25); m_band = mat('welder_band', (30, 28, 26), 0.8)
    # the shell built DOWN over the face: a grid round the head from cheek to cheek and chin to brow, standing 4 cm off it,
    # the front pushed flat-ish and the chin forward the way a hood is cut
    NA, NZ = 22, 12; A0, A1 = -1.18, 1.18; Z0, Z1 = -0.125, 0.080
    pivot = C + Vector((0.0, 0.0, 0.050))
    bm = bmesh.new(); grid = []
    for j in range(NZ + 1):
        z = Z0 + (Z1 - Z0) * j / NZ; row = []
        for i in range(NA + 1):
            az = A0 + (A1 - A0) * i / NA
            zz = max(-0.08, min(0.07, z))
            r = skull_r(az, zz) + 0.040 + 0.012 * math.cos(az) ** 2 + 0.018 * max(0.0, (-0.03 - z) / 0.095) * math.cos(az)
            row.append(bm.verts.new(C + Vector((math.sin(az) * r, -math.cos(az) * r, z))))
        grid.append(row)
    for j in range(NZ):
        for i in range(NA):
            bm.faces.new((grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]))
    # turn it up on the pivots: the chin swings forward and up over the brow, the lens to the sky
    Rx = __import__('mathutils').Matrix.Rotation(math.radians(-95), 3, 'X')
    for v in bm.verts: v.co = pivot + Rx @ (v.co - pivot)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    made.append(finish(bm, 'welder_shell', m_mask, 0.006))
    # the lens plate proud of the shell (its 6 mm wall either side), so it reads as glass in a frame
    bm = bmesh.new(); quad = []
    for z, az in ((0.002, -0.38), (0.002, 0.38), (0.043, 0.38), (0.043, -0.38)):
        r = skull_r(az, z) + 0.040 + 0.012 * math.cos(az) ** 2 + 0.010
        quad.append(bm.verts.new(pivot + Rx @ (C + Vector((math.sin(az) * r, -math.cos(az) * r, z)) - pivot)))
    bm.faces.new(quad); bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    made.append(finish(bm, 'welder_lens', m_lens, 0.004))
    # the headband round the brow and the two pivot knobs at the temples
    bm = bmesh.new(); seg = 8; pts = []
    for i in range(40):
        az = -math.pi + 2 * math.pi * i / 40; z = 0.050 + 0.030 * (math.cos(az) - 1) * -0.5 * (abs(az) > 2.0)
        r = skull_r(az, z) + 0.010
        pts.append(C + Vector((math.sin(az) * r, -math.cos(az) * r, z)))
    rings = []
    for i, p in enumerate(pts):
        t = (pts[(i + 1) % 40] - pts[i - 1]).normalized(); h = Vector((p.x - C.x, p.y - C.y, 0)).normalized()
        rings.append([bm.verts.new(p + (h * math.cos(2 * math.pi * k / seg) * 0.006 + Vector((0, 0, 1)) * math.sin(2 * math.pi * k / seg) * 0.012)) for k in range(seg)])
    for i in range(40):
        for k in range(seg):
            bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[(i + 1) % 40][(k + 1) % seg], rings[(i + 1) % 40][k]))
    made.append(finish(bm, 'welder_band', m_band, 0))
    for sx in (1, -1):
        bm = bmesh.new(); r = skull_r(sx * math.pi / 2, 0.05)
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=12, radius1=0.020, radius2=0.016, depth=0.030)
        q = Vector((sx, 0, 0)).to_track_quat('Z', 'Y')
        for v in res['verts']: v.co = pivot + Vector((sx * (r + 0.030), 0, 0)) + q @ v.co
        made.append(finish(bm, 'welder_knob_%d' % (sx > 0), m_band, 0))
    return made


def install_hat():
    """the welding mask as a hat the barber's head build can call (HATS 1's build, wrapped in memory, its file never edited)"""
    import bohemia_character_hats_one as HATS
    if getattr(HATS, '_three_enemies', False): return
    old = HATS.build
    def build(cut, L):
        if cut == 'WELDER UP':
            # short hair under it: the scalp painted dark where the band sits
            return welder(L)
        return old(cut, L)
    HATS.build = build; HATS._three_enemies = True


# ---- THE BUILD (inside Blender's Python) ----------------------------------------------------------------------------
def build_one(pid):
    import bohemia_character_the_barber_on_the_skull as BS
    import bohemia_character_the_thirteen_through_the_rig as CH
    import bohemia_character_garments_base as BASE
    import bohemia_character_garments_outer as OUTER
    register(); install_hat()
    P = next(p for p in json.load(open(ROLL)) if p['id'] == pid)
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
            if Gt['fn'] == 'genCoverall':
                L['trousers'] = dict(colour=Gt['mid'], wide=0.014, crop=0.355 if Gt['short'] else 0.0)
        L.pop('coat', None)
        if Gc: L['worn']['outer'] = Gc['name']
        old = L.get('extra')
        mine = list(spec.get('pieces') or [])
        L['extra'] = lambda X, Gt=Gt, Gc=Gc, old=old, mine=mine: ((old(X) or []) if old else []) + \
            (BASE.pieces(Gt, X) if Gt else []) + (OUTER.pieces(Gc, X) if Gc else []) + body_pieces(mine, X)
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


# ---- THE RENDER (RUN TWO's, imported) --------------------------------------------------------------------------------
def R2():
    import bohemia_run2_no_two_people_alike as R
    return R


def tag_of(pid): return 'person_' + pid.lower()      # the barber's own name for a rolled person's model


def look_of(pid): return 'enemy_' + pid.lower()      # his name on the fight's sheet


def bpy_py(): return os.environ.get('BOHEMIA_BPY') or 'python3.11'


def ensure_model(pid):
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % tag_of(pid))
    if not os.path.exists(glb):
        if not R2().run([bpy_py(), os.path.abspath(__file__), 'build-one', pid], glb): return None
    return glb


def look(pid):
    """the look check: one model, the eight stills only"""
    glb = ensure_model(pid)
    if not glb: return
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    out = os.path.join(ROOT, SHEET_DIR, 'look', look_of(pid))
    R2().run([bpy_py(), '-c', R2().render_code(glb, out, h, clips=[('Stand', 1)])], os.path.join(out, 'rig.json'))
    print('LOOK', pid, out)


def made(pid):
    try: return open(os.path.join(ROOT, OUT, look_of(pid), 'made.txt')).read().strip() == STAMP
    except OSError: return False


def fought(pid):
    try: return open(os.path.join(ROOT, FIGHT_RENDERS, look_of(pid), 'made.txt')).read().strip() == STAMP
    except OSError: return False


def make(pid):
    """his street pass (stand, walk in eight, the portrait and its four mouths) then his fight pass, RUN TWO's way"""
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
            if os.path.exists(posed): os.remove(posed)
    for f in (glb, glb.replace('.glb', '.json'), os.path.join(ROOT, 'records/character/rig/%s.glb' % tag_of(pid))):
        if f.endswith('.glb') and os.path.exists(f) and made(pid) and fought(pid): os.remove(f)
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
    # the order deals the types round by round (a short run still covers all three)
    R = json.load(open(ROLL)); order = []
    for k in range(max(COUNT.values())):
        for t in ORDER: order += [p['id'] for p in R if p['gang'] == t and p['id'].endswith('_%d' % k)]
    left = [pid for pid in order if not (made(pid) and fought(pid))]
    for i, pid in enumerate(left):
        if i % n == w: make(pid)


# ---- THE PACK: into the fight's sheets, its face strip and the bands' pools -----------------------------------------
def pack():
    import numpy as np
    from PIL import Image
    R = R2()
    FR = os.path.join(ROOT, 'slices/fight_rig'); ip = os.path.join(FR, 'fight_rig.json'); I = json.load(open(ip))
    cols = R.FIGHT_COLS
    want = [n + ('@%d' % k if c != 'Stand' else '') for n, c, ks in cols for k in range(ks)]
    assert I['cols'] == want, "COMBAT changed the fight sheet's columns: re-read its pack() before packing"
    RIM = tuple(I['rim'])
    for k in [k for k, v in I['looks'].items() if v.get('kind') == 'enemy']: del I['looks'][k]
    made_ = []
    for p in json.load(open(ROLL)):
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
                              guns=Lr.get('guns'), type=POOL[p['gang']], rig=os.path.relpath(os.path.join(fd, 'rig.json'), ROOT))
        made_.append((p, lk)); print('PACKED %s in %s\'s cell, %d px outside it, %d KB' % (lk, ref, lost, os.path.getsize(os.path.join(FR, lk + '.webp')) // 1024))
    # his face on the fight's face strip (the bar and the turn row draw from it), after everyone already on it
    F = I['faces']; strip = Image.open(os.path.join(FR, F['file'])).convert('RGBA'); S = F['size']
    keep = [l for l in F['order'] if not l.startswith('enemy_')]
    tiles = [strip.crop((F['order'].index(l) * S, 0, F['order'].index(l) * S + S, S)) for l in keep]
    for p, lk in made_: tiles.append(Image.open(os.path.join(ROOT, OUT, lk, 'face', 'rest_128.png')).convert('RGBA').resize((S, S), Image.BOX))
    out = Image.new('RGBA', (S * len(tiles), S), (0, 0, 0, 0))
    for i, t in enumerate(tiles): out.paste(t, (i * S, 0))
    out.save(os.path.join(FR, F['file']), 'WEBP', quality=85, alpha_quality=100, method=6)
    F['order'] = keep + [lk for p, lk in made_]
    I['enemies'] = ("CHARACTER [the three enemies' looks] 10/24: the Mechanic, the Kids and Runners and the Heavy (kind 'enemy'), "
                    "packed by tools/bohemia_character_the_three_enemies.py pack into a reference gang's cell with its guns; "
                    "their pools are ours.people_looks.band.mechanic / runner / heavy")
    with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))
    # THE POOLS: one per type, the band the fight deals the type's men from (COMBAT's enemy rows name the key)
    op_ = os.path.join(ROOT, 'records/target/bb/ours.json'); O = json.load(open(op_)); PL = O['people_looks']['value']
    for t in ORDER:
        mine = [lk for p, lk in made_ if p['gang'] == t]
        # a pool switches only when the whole type is made: three Runners for a band of ten would put twins on the board
        # (121(i)), so until then the band keeps the pool it had (COMBAT's fallback, pl[kind])
        if len(mine) == COUNT[t]: PL['band'][POOL[t]] = mine
        else: print('HELD %s: %d of %d made, its pool waits' % (POOL[t], len(mine), COUNT[t]))
    with open(op_, 'w') as f: f.write(json.dumps(O, indent=1, ensure_ascii=False) + '\n')
    print('packed', len(made_), {POOL[t]: PL['band'].get(POOL[t]) for t in ORDER})


# ---- THE SHEET (for the record and the lane's own eye; no card, rule 127) --------------------------------------------
def sheet():
    from PIL import Image, ImageDraw
    R = json.load(open(ROLL)); od = os.path.join(ROOT, SHEET_DIR); os.makedirs(od, exist_ok=True)
    dirs = ['S', 'SE', 'E', 'SW', 'N']
    rows = []
    for p in R:
        d = frames_of(p['id']) if made(p['id']) else os.path.join(ROOT, SHEET_DIR, 'look', look_of(p['id']))
        ims = [Image.open(os.path.join(d, 'rig_%s.png' % f)).convert('RGBA') for f in dirs if os.path.exists(os.path.join(d, 'rig_%s.png' % f))]
        if ims: rows.append((p, ims))
    if not rows: print('nothing rendered yet'); return
    bb = [im.getbbox() for _, ims in rows for im in ims if im.getbbox()]
    cw = max(b[2] - b[0] for b in bb) + 8; ch = max(b[3] - b[1] for b in bb) + 8
    top = min(b[1] for b in bb); left = min(b[0] for b in bb)
    for scale, nm in ((1, 'CHARACTER_THE_THREE_ENEMIES_1X.png'), (3, 'CHARACTER_THE_THREE_ENEMIES_3X.png')):
        W = (cw * len(dirs) + 220) * scale; H = ch * len(rows) * scale
        sh = Image.new('RGBA', (W, H), (118, 106, 88, 255)); dr = ImageDraw.Draw(sh)
        for r, (p, ims) in enumerate(rows):
            dr.text((6 * scale, (r * ch + 6) * scale), '%s\n%s\n%s / %s\n%s' % (p['id'].upper(), p['hair_cut'], p['top'], p.get('coat') or '-', ', '.join(p['kit'])),
                    fill=(20, 18, 16, 255))
            for c, im in enumerate(ims):
                im = im.crop((left - 4, top - 4, left - 4 + cw, top - 4 + ch))
                if scale > 1: im = im.resize((cw * scale, ch * scale), Image.NEAREST)
                sh.alpha_composite(im, ((220 + c * cw) * scale, r * ch * scale))
        sh.save(os.path.join(od, nm))
        print('sheet', os.path.relpath(os.path.join(od, nm), ROOT))


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
