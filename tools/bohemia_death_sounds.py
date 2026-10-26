#!/usr/bin/env python3
"""
BOHEMIA - DEATH SOUNDS THAT TERRIFY (SOUNDS 10/26/26, row [death sounds that terrify], rule 235).

PAOLO 10/26 (LOCKED): 'during combat when people die, I wanna hear terrible, terrible noises that are scary, like people
are literally dying... something that fits the theme of all the noises we got going, but terrifying... get creative...
many types, like broken bones, the whole enchilada.'

HOW BATTLE BROTHERS DOES IT (rule 33; recall, marked as recall): every actor type carries its own list of death sounds and
hurt sounds (several per type, one drawn at random, so the same scream does not come twice running), every actor gets its
own pitch at birth (a few percent up or down, so two men of one type do not share a throat), the killing blow plays the
weapon's own flesh sound under the cry, and a fatality (a head taken off, a skull smashed, a man opened) adds its own wet
crunch. A beast dies with the animal's own voice. You know who died before you look.
HOW HORROR MAKES A DEATH FRIGHTENING (recall, marked): the voice is cut off rather than finished (the scream that stops is
worse than the scream that ends); the body keeps making sounds after the voice has gone (the choke, the rattle, the last
breath out); the microphone is too close and does not look away; the silence after is lifted, not left empty. Found
footage adds the machine that heard it: the camcorder's automatic gain that slams down on the scream and drags the room
back up under the rattle (the analog horror bible's sound rules 4 to 8, records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md).
THE FOLEY TRADITION (recall, marked): film and game death foley is built from things that are not people dying: a pig's
scream lowered for a man's, celery and wet towels for bone and meat, gravel for a drag. Every layer below is that: a real
recording of a real thing, never a generator, never a noise recipe (the second votes: no sand).

THE KINDS (rule 235(b)); the killing blow picks the kind (engine/bohemia_death_sounds.js reads it off the fight's message):
  bone     a blunt blow (mace, hammer, flail, a sling's stone, a brute's sweep): the thud, the bone that snaps twice and
           grinds, the crush, then the man
  blade    a cut or a stab (sword, cleaver, axe, spear, a knife): the steel's quick stroke, the wet of it, the spray, the
           blood that runs, the breath that goes out of him
  gun      a gun (pistol, shotgun, rifle, a bow's arrow): the shout the round knocks out of him, the knee, the body, his
           gear on the asphalt, the choke
  beast    killed by a beast: the snarl, the bite (wet, and the bone under it), the scream it closes on, the drag over gravel
           and the thing breathing over him
  slow     finished off, already dying (the killing blow a small one): no blow to hear, only the man: the gasps, the
           choke, the rattle, the last breath out
  armour   the killing blow broke the last of his plate: the metal giving (a car door's steel, a can crushed, the plate's
           ring, a visor's glass), then the man
  skull    laid on top of any kind when the blow took the head (the fatality's crunch)
  animal_canine, animal_big, animal_cat   a beast's own death (rule 235(e)): the yelp and the dying whine of a dog, the
           bellow of a big animal, the yowl of a big cat
EACH KIND HAS TWO SIDES (rule 235(e)): YOURS (one of his own men: the worst sound in the game: the camera ten metres off and
too close, the scream that is cut into a choke, the rattle, the last breath, six beats) and THEIRS (an enemy: still
horrible, thirty metres off down the street, four beats).

THE SOURCES, all real recordings, all CC0: ESC-50 (github.com/karolpiczak/ESC-50) clips whose Freesound author released
them CC0, frozen through tools/bohemia_from_a_recording.py (it refuses anything else), banked as FLAC in
reference/library/sound_bank/esc50_cc0/. Every take's layers (clip, window, speed, place, level) are in manifest.json.

THE CHAIN (REUSE-FIRST, the bullets' own: tools/bohemia_bullet_lands.py chain() over tools/bohemia_guns_heard.py's
stages): the layers summed > the street canyon (an echo every 16th) > the camcorder's automatic gain (up to +12 dB: the
quiet after him dragged up) > tape > the VHS band > the cut, a 16th's fade > one loudness per voice under the shotgun's shot.
ON THE BEAT (rule 221(b)): every layer sits on the 16th grid from the take's start (the blow on 0, the body on the beat,
the rattle on the next beat, the last breath on the beat after); the player starts the take on the song's next 16th.

OUT: slices/fight_death/death.mp3 (ONE sprite, every take) and manifest.json; tools/bohemia_death_sounds_level.js then
writes index.json (the gains through the game's own chain), the only file the game reads beside the sprite.

  python3 tools/bohemia_death_sounds.py --bank     # freeze the licences and bank the clips (needs the ESC-50 clone)
  python3 tools/bohemia_death_sounds.py            # render from the bank (no network)
  python3 tools/bohemia_death_sounds.py --check    # re-read the sprite and verify the pass criteria
"""
import json, math, os, sys
import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.environ.setdefault('ESC50_AUDIO', '/tmp/claude-0/ext/esc50/audio')
import bohemia_bullet_lands as BL       # REUSE-FIRST: grab, L, mix, norm, chain, fit, top_db, and its sources
FR, GH = BL.FR, BL.GH

ROOT = os.path.dirname(HERE)
SR = FR.SR
OUT = os.path.join(ROOT, 'slices', 'fight_death')
BEAT = 0.5
S16 = BEAT / 4
LEAD = 0.02
TAKES = 3                 # per voice: an odd count against 4/4; the player never plays the take that just played
CUT = {'yours': 6 * BEAT, 'theirs': 4 * BEAT}
R0 = {'yours': 10.0, 'theirs': 28.0}          # the camera: on top of his man; down the street from theirs
AGC = {'yours': 3.0, 'theirs': 2.0}           # the quiet after him lifted a little, never to the scream: measured 10/26, the
                                              # bullets' camcorder (target -12 dB, up to +14) took the scream down 10 dB and the
                                              # rattle up 6, and the take read as one flat wash; this one holds -6 dB and lifts 3
AGC_TARGET = -6.0
LOUD = {'yours': -4.0, 'theirs': -8.0, 'skull': -11.0, 'animal': -8.0}   # under the shotgun's shot (dB)

# ----------------------------------------------------------------------------------------------------------------------
# THE REAL MATERIAL (ESC-50 stem: what it is, as its author named it; every one CC0 at the source or refused)
# ----------------------------------------------------------------------------------------------------------------------
ESC = {
    # the voice
    '3-233151-A-2': 'a pig screaming, one long scream, 96 kHz (JarredGibb, Pig - Scream 5)',
    '1-260640-A-2': 'a pig squealing (TheAcidRomance, Pig Squealing)',
    '1-260640-B-2': 'a pig squealing (TheAcidRomance, Pig Squealing)',
    '1-260640-C-2': 'a pig squealing (TheAcidRomance, Pig Squealing)',
    '4-132383-B-2': 'black pigs fighting, Alentejo (ideiasemvideo)',
    '3-119459-A-26': 'a man laughing (Eneasz, Male Laughter)',
    '5-263775-B-26': 'a man laughing (scottemoil, Laughing Man)',
    '4-167571-A-26': 'a man\'s evil laugh (dlovere)',
    '4-194808-A-29': 'a sip of coffee, a swallow, then "ah" (odditonic)',
    '4-154443-A-24': 'a cough (ecfike, Cough 2)',
    '3-146873-A-24': 'a man\'s sick cough (tgfcoder)',
    '3-125418-A-24': 'a man coughing (jyoung20)',
    '2-123896-A-24': 'a cough (Sempoo)',
    '3-112557-A-23': 'frightened breathing (nickrave)',
    '3-166125-A-23': 'scared breathing (Adam_N)',
    '2-54961-A-23': 'a human breath (cidchili, Breath Human Sci)',
    '2-54962-A-23': 'a human breath (cidchili, Breath human Sci2)',
    '1-30709-A-23': 'a breath (UncleSigmund)',
    '5-232816-A-23': 'a contained breath (xavimuse)',
    '2-122763-A-29': 'gurgles (alienistcog)',
    '2-122763-B-29': 'gurgles (alienistcog)',
    '5-243635-A-29': 'swallowing (freakinbehemoth)',
    '4-210593-A-29': 'different gulps (Mafon2)',
    '3-151557-B-28': 'a man snoring (Erik Pritzens): the rattle',
    '5-233312-A-28': 'a man snoring (trentbh): the rattle',
    '5-236288-A-28': 'a human snore (mffm): the rattle',
    '5-261464-A-23': 'a werewolf breathing and sniffing, a voice actor (kd_jack)',
    # the blow and the body
    '2-133889-A-30': 'knocking on a large wood door (aroth4)',
    '1-103999-A-30': 'wood knocks (RutgerMuller)',
    '2-118624-A-30': 'a door opened and closed, close mic (E-Audio)',
    '1-155858-B-25': 'footsteps in a factory hall, wood and concrete (RutgerMuller)',
    '2-76408-B-22': 'a single clap, close (therabidfrog, Clap.mp3)',
    '2-76408-C-22': 'a single clap, close (therabidfrog, Clap.mp3)',
    '1-51147-A-25': 'wet bare feet in a small shower cabin (RutgerMuller)',
    '3-94344-A-25': 'footsteps on gravel (Ryding, Fotsteg pa grus)',
    '4-117627-A-25': 'footsteps on gravel pavement (soundmary)',
    '4-218304-A-25': 'sneakers on gravel and leaves (MentalSanityOff)',
    '4-165845-A-45': 'on a train in Argentina, between two wagons, metal (felix.blume)',
    '2-131943-A-38': 'a wind-up clock with a twin bell alarm (AngryAdam)',
    # bone, blade, armour
    '4-181563-A-12': 'a fire crackling, the snaps (kingsrow, Fire Crackling 01)',
    '4-182369-A-12': 'a fire crackling (kingsrow, Fire Crackling 01)',
    '3-103401-C-33': 'a cupboard creaking hard (stijnjobse, kast extreem kraken)',
    '3-94355-A-33': 'a crackling door (Ryding, Knakande dorr)',
    '3-203371-A-39': 'a glass exploding (C_Rogers)',
    '1-9886-A-49': 'a wood saw, one stroke (Pingel)',
    '5-204114-A-29': 'a man eating teriyaki noodles (marcjunker): the wet',
    '3-169907-A-29': 'eating oatmeal (qubodup): the wet',
    '3-164593-A-15': 'a water splash (Adam_N, Water splash 2)',
    '3-164594-A-15': 'a water splash (Adam_N, Water splash 1)',
    '5-207781-A-17': 'a liquid pouring (Dvideoguy)',
    '5-252248-A-34': 'a can opened (Reitanna)',
    '2-144031-A-34': 'a soda can opened (timgormly)',
    # the beasts
    '2-117271-A-0': 'angry dogs barking (polipa)',
    '3-146972-A-5': 'a cat attacking (Zabuhailo, catAttack)',
    '3-146964-A-5': 'a cat howling (Zabuhailo, catHowling1)',
    '4-133047-B-5': 'a mad cat (temawas)',
    '4-133047-C-5': 'a mad cat (temawas)',
    '5-194899-B-3': 'a distressed mother cow and her calves (lolamadeus)',
    '5-194899-C-3': 'a distressed mother cow and her calves (lolamadeus)',
}

# ----------------------------------------------------------------------------------------------------------------------
# A LAYER BY ITS WINDOW (seconds into the clip): for the voices, which are long sounds, never onsets
# ----------------------------------------------------------------------------------------------------------------------
def expand(y, below=30.0, att=0.004, rel=0.12):
    """A downward expander (1:3) on the layer's own envelope: what sits more than `below` dB under its peak is pushed down, so
    a breath's room tone is not summed twelve times over (the recording kept, its hiss between the sounds taken out)."""
    a = np.abs(y).astype(np.float64); env = np.empty_like(a); e = 0.0
    ka = math.exp(-1.0 / (att * SR)); kr = math.exp(-1.0 / (rel * SR))
    for i in range(len(a)):
        v = a[i]; k = ka if v > e else kr; e = k * e + (1 - k) * v; env[i] = e
    thr = env.max() * 10 ** (-below / 20.0)
    g = np.where(env >= thr, 1.0, (env / (thr + 1e-12)) ** 2)
    return (y * g).astype(np.float32)

def W(stem, t0, dur, spd=1.0, db=0.0, at=0.0, hp=None, lp=None, fi=0.004, fo=0.04, cut=None, gate=24.0):
    """A real window of a clip from t0 for dur seconds of the SOURCE, sped (a resample, the tape's way), filtered, faded,
    levelled by its peak. cut=(t, ms, db): the voice cut off (the scream that stops) at t seconds of the OUTPUT."""
    x = BL.esc(stem); a = max(0, int(t0 * SR)); y = x[a:a + int(dur * SR)].astype(np.float32).copy()
    n = len(y); f = min(n // 2, int(fi * SR)); g = min(n // 2, int(fo * SR))
    if f > 0: y[:f] *= np.linspace(0, 1, f, dtype=np.float32)
    if g > 0: y[-g:] *= np.linspace(1, 0, g, dtype=np.float32) ** 2
    y = FR.speed(y, spd)
    if hp: y = FR.hp(y, hp)
    if lp: y = FR.lp(y, lp)
    if gate: y = expand(y, gate)
    if cut:
        t, ms, cdb = cut; i = int(t * SR); m = max(1, int(ms / 1000 * SR))
        if i < len(y):
            env = np.ones(len(y), np.float32); lo = 10 ** (cdb / 20.0)
            env[i:i + m] = np.linspace(1, lo, len(env[i:i + m]), dtype=np.float32); env[i + m:] = lo
            y = y * env
    return dict(y=BL.norm(y), at=at, db=db, src=stem, k='%.2f+%.2f' % (t0, dur), spd=spd)

def E(stem, k, dur, spd=1.0, db=0.0, at=0.0, hp=None, lp=None):
    """An event of a clip by its onset (BL.L: a knock, a snap, a clap)."""
    return BL.L(stem, k, dur, spd=spd, db=db, at=at, hp=hp, lp=lp)

def jitter(k, side):
    """Every man his own throat (Battle Brothers' pitch per actor, recall): the voice a few percent up or down by take."""
    return [0.97, 1.0, 1.04, 0.94][(k + (1 if side == 'theirs' else 0)) % 4]

# ----------------------------------------------------------------------------------------------------------------------
# THE MAN: the cry, the choke, the rattle, the last breath (shared by every kind; YOURS gets all of it, close)
# ----------------------------------------------------------------------------------------------------------------------
SCREAMS = [('3-233151-A-2', 0.05, 0.62), ('1-260640-A-2', 0.30, 0.62), ('1-260640-C-2', 0.70, 0.66), ('1-260640-B-2', 1.66, 0.58),
           ('3-233151-A-2', 0.70, 0.62)]
LAUGHS = [('3-119459-A-26', 2.04, 0.30), ('5-263775-B-26', 0.86, 0.38), ('4-167571-A-26', 0.10, 0.45), ('3-119459-A-26', 0.36, 0.30)]
SHOUTS = [('4-154443-A-24', 0.03, 0.12), ('2-123896-A-24', 0.09, 0.2), ('3-146873-A-24', 0.11, 0.18), ('3-125418-A-24', 0.0, 0.16)]
GASPS = [('3-112557-A-23', 2.56, 0.36), ('3-112557-A-23', 3.32, 0.26), ('3-166125-A-23', 1.44, 0.48), ('3-166125-A-23', 3.26, 0.44)]
GURGLES = [('2-122763-B-29', 1.50, 0.32), ('2-122763-A-29', 0.14, 0.12), ('5-243635-A-29', 1.36, 0.22), ('4-210593-A-29', 2.56, 0.22),
           ('2-122763-B-29', 2.16, 0.22)]
WETCOUGH = [('3-146873-A-24', 0.33, 0.12), ('3-146873-A-24', 0.53, 0.12), ('3-125418-A-24', 0.29, 0.16), ('3-125418-A-24', 0.67, 0.14)]
RATTLES = [('3-151557-B-28', 1.50, 1.30), ('5-233312-A-28', 3.24, 1.10), ('5-236288-A-28', 1.88, 0.66), ('3-151557-B-28', 1.90, 1.00)]
LASTBREATH = [('5-232816-A-23', 0.56, 1.40), ('2-54961-A-23', 0.62, 1.50), ('2-54962-A-23', 0.10, 1.55), ('1-30709-A-23', 0.08, 0.90)]

def pick(lst, k, off=0):
    return lst[(k + off) % len(lst)]

def scream(k, side, at, length, cut_at, db=0.0):
    """The cry: a pig's scream lowered to a man's (the foley tradition), a man's own voice under it for the throat, cut
    off into a choke at cut_at (seconds after it starts)."""
    j = jitter(k, side); spd = 0.70 * j
    st, t0, dur = pick(SCREAMS, k, 0 if side == 'yours' else 2)
    ls, l0, ld = pick(LAUGHS, k)
    out = [W(st, t0, min(dur, length * spd + 0.05), spd=spd, db=db, at=at, hp=180.0, lp=4200.0, fi=0.012, cut=(cut_at, 28, -24.0)),
           W(ls, l0, ld, spd=0.74 * j, db=db - 9.0, at=at + 0.01, hp=120.0, lp=3800.0, fi=0.01, cut=(cut_at, 28, -24.0))]
    return out

def the_man(k, side, at0, kind):
    """Everything his body does after the blow; at0 is where the cry starts. YOURS: the cry, the choke, the rattle, the
    last breath. THEIRS: the cry, the choke, one breath out."""
    j = jitter(k, side); L = []
    s0, t0, d0 = pick(SHOUTS, k, 1 if side == 'theirs' else 0)
    L.append(W(s0, t0, d0, spd=0.92 * j, db=-3.0, at=at0, hp=150.0))                       # the blow knocks it out of him
    if side == 'yours':
        L += scream(k, side, at0 + S16, 0.75, cut_at=0.5 + 0.06 * (k % 3))                  # the cry, cut into
        g, gt, gd = pick(GURGLES, k); L.append(W(g, gt, gd, spd=0.88 * j, db=-7.0, at=at0 + 5 * S16, hp=90.0, lp=3000.0))
        c, ct, cd = pick(WETCOUGH, k); L.append(W(c, ct, cd, spd=0.86 * j, db=-9.0, at=at0 + 7 * S16, hp=120.0, lp=3500.0))
        r, rt, rd = pick(RATTLES, k); L.append(W(r, rt, rd, spd=0.86 * j, db=-13.0, at=at0 + 8 * S16, hp=100.0, lp=2400.0, fi=0.08, fo=0.4))
        g2, gt2, gd2 = pick(GURGLES, k, 2); L.append(W(g2, gt2, gd2, spd=0.8 * j, db=-13.0, at=at0 + 11 * S16, hp=90.0, lp=2600.0))
        b, bt, bd = pick(LASTBREATH, k); L.append(W(b, bt, bd, spd=0.9 * j, db=-15.0, at=at0 + 14 * S16, hp=110.0, lp=3200.0, fi=0.05, fo=0.6))
    else:
        L += scream(k, side, at0 + S16, 0.45, cut_at=0.3 + 0.05 * (k % 3), db=-2.0)
        g, gt, gd = pick(GURGLES, k, 1); L.append(W(g, gt, gd, spd=0.9 * j, db=-9.0, at=at0 + 4 * S16, hp=90.0, lp=3000.0))
        b, bt, bd = pick(LASTBREATH, k, 1); L.append(W(b, bt, min(bd, 0.9), spd=0.92 * j, db=-15.0, at=at0 + 8 * S16, hp=110.0, lp=3000.0, fi=0.04, fo=0.4))
    return L

def the_drop(k, at, heavy=False):
    """The body: a knee, the weight (a door's slam quickened into the low mids), meat on the ground (a clap slowed), his gear
    on the asphalt (the wagons' steel, small), the grit. The fall on the beat."""
    return [E('1-155858-B-25', k, 0.18, spd=0.85, db=-9.0, at=at - S16, hp=60.0),
            E('2-118624-A-30', k, 0.4, spd=1.25, db=0.0, at=at),
            E('2-76408-B-22' if k % 2 else '2-76408-C-22', k + 1, 0.2, spd=0.6, db=-3.0, at=at + 0.004, hp=120.0),
            E('4-165845-A-45', k + 3, 0.22, spd=1.5 if heavy else 1.9, db=-6.0 if heavy else -11.0, at=at + 0.03, hp=300.0),
            E('3-94344-A-25', k + 1, 0.25, spd=1.0, db=-9.0, at=at + 0.01, hp=300.0)]

# ----------------------------------------------------------------------------------------------------------------------
# THE KINDS: the blow's own matter, then the man
# ----------------------------------------------------------------------------------------------------------------------
SNAPS = '4-181563-A-12'
def snap(k, at, spd=0.75, db=0.0):
    return E(SNAPS, k, 0.09, spd=spd, db=db, at=at, hp=250.0)

def crunch(k, at, spd=0.42, db=0.0):
    """A glass bursting, slowed to a crush: 70 ms of it (measured 10/26: 160 ms slowed was half a second of wash, never a crunch)."""
    return W('3-203371-A-39', 0.02 + 0.05 * (k % 3), 0.07, spd=spd, db=db, at=at, hp=120.0, lp=2600.0, fi=0.002, fo=0.03)

def k_bone(k, side):
    L = [E('2-133889-A-30', k, 0.3, spd=0.8, db=0.0, at=0.0),                         # the blunt thing lands
         E('1-103999-A-30', k + 1, 0.12, spd=0.85, db=-5.0, at=0.002, hp=150.0),
         E('2-76408-B-22', k, 0.16, spd=0.62, db=-4.0, at=0.004, hp=120.0),          # the meat under it
         snap(k, 0.008, spd=0.72), snap(k + 2, 0.026, spd=0.9, db=-4.0),             # the bone goes, twice
         crunch(k, 0.012, db=-5.0),                                                   # and crushes
         W('3-103401-C-33', 0.54 + 0.2 * (k % 3), 0.3, spd=1.3, db=-12.0, at=S16, hp=300.0, lp=4000.0)]   # and grinds
    return L + the_man(k, side, S16, 'bone') + the_drop(k, BEAT * (2 if side == 'yours' else 1.5))

def k_blade(k, side):
    L = [W('1-9886-A-49', 0.15 + 0.92 * (k % 3), 0.16, spd=1.8, db=-7.0, at=0.0, hp=1200.0, lp=7000.0, fi=0.002, fo=0.03),   # the steel's stroke
         E('5-204114-A-29', k, 0.2, spd=0.72, db=0.0, at=0.006, hp=120.0),          # the wet of it
         E('3-169907-A-29', k + 1, 0.14, spd=0.8, db=-4.0, at=0.012, hp=150.0),
         E('1-51147-A-25', k + 2, 0.12, spd=0.8, db=-5.0, at=0.01, hp=300.0),
         E('2-76408-C-22', k, 0.12, spd=0.85, db=-7.0, at=0.004, hp=150.0),
         W('3-164593-A-15' if k % 2 else '3-164594-A-15', 0.1 if k % 2 else 0.14, 0.14, spd=0.85, db=-9.0, at=S16, hp=200.0, lp=4500.0),   # the spray
         W('5-207781-A-17', 0.24 + 0.2 * (k % 3), 0.8, spd=0.8, db=-16.0, at=3 * S16, hp=100.0, lp=1300.0, fi=0.08, fo=0.3)]   # it runs
    return L + the_man(k, side, S16, 'blade') + the_drop(k, BEAT * (2 if side == 'yours' else 1.5))

def k_gun(k, side):
    L = [E('2-76408-C-22' if k % 2 else '2-76408-B-22', k + 2, 0.12, spd=0.75, db=-8.0, at=0.0, hp=150.0),   # the round still in him
         E('1-51147-A-25', k, 0.1, spd=0.9, db=-10.0, at=0.003, hp=600.0)]
    return L + the_man(k, side, 0.0, 'gun') + the_drop(k, BEAT * (1.5 if side == 'yours' else 1.0))

def k_beast(k, side):
    L = [W('3-146972-A-5', 0.15, 0.45, spd=0.6 - 0.04 * (k % 3), db=-1.0, at=0.0, hp=120.0, lp=4000.0, fi=0.003),   # the lunge, a big cat's snarl lowered
         E('2-117271-A-0', k, 0.16, spd=0.62, db=-5.0, at=0.012, hp=120.0),            # a dog's bark lowered under it
         E('5-204114-A-29', k + 1, 0.22, spd=0.6, db=0.0, at=S16, hp=100.0),            # the bite: the wet
         snap(k + 1, S16 + 0.012, spd=0.68, db=-2.0), crunch(k + 1, S16 + 0.016, spd=0.34, db=-5.0),   # and the bone under it
         W('5-261464-A-23', 0.02 + 0.3 * (k % 3), 1.5, spd=0.78, db=-9.0, at=4 * S16, hp=90.0, lp=3000.0, fi=0.05, fo=0.4)]   # breathing over him
    drag = 6 * S16 if side == 'yours' else 5 * S16
    for i, (st, t0) in enumerate([('4-117627-A-25', 0.18), ('4-218304-A-25', 0.54), ('4-117627-A-25', 0.6)][:3 if side == 'yours' else 2]):
        L.append(W(st, t0 + 0.04 * k, 0.28, spd=0.55, db=-7.0 - i, at=drag + i * 2 * S16, hp=150.0, lp=5000.0, fi=0.02, fo=0.08))   # the drag
    return L + the_man(k, side, 2 * S16, 'beast') + [E('2-118624-A-30', k, 0.4, spd=1.25, db=-3.0, at=BEAT * 1.5)]

def k_slow(k, side):
    """Finished off, already dying: no blow to hear, only the man."""
    j = jitter(k, side); L = []
    g1, t1, d1 = pick(GASPS, k); g2, t2, d2 = pick(GASPS, k, 1)
    L.append(W(g1, t1, d1, spd=0.92 * j, db=0.0, at=0.0, hp=150.0, lp=6000.0))          # a gasp
    L.append(W(g2, t2, d2, spd=0.88 * j, db=-2.0, at=3 * S16, hp=150.0, lp=6000.0))     # a second, worse
    L += [E('2-118624-A-30', k, 0.4, spd=1.35, db=-7.0, at=BEAT, hp=80.0), E('3-94344-A-25', k, 0.25, spd=1.0, db=-12.0, at=BEAT + 0.01, hp=300.0)]   # he slumps
    gu, gt, gd = pick(GURGLES, k, 3); L.append(W(gu, gt, gd, spd=0.85 * j, db=-5.0, at=5 * S16, hp=90.0, lp=3000.0))   # the choke
    c, ct, cd = pick(WETCOUGH, k, 1); L.append(W(c, ct, cd, spd=0.84 * j, db=-8.0, at=7 * S16, hp=120.0, lp=3500.0))
    if side == 'yours':
        r, rt, rd = pick(RATTLES, k, 1); L.append(W(r, rt, rd, spd=0.84 * j, db=-11.0, at=8 * S16, hp=100.0, lp=2400.0, fi=0.08, fo=0.4))   # the rattle
        L += scream(k, side, 12 * S16, 0.4, cut_at=0.22, db=-14.0)                     # one last sound in his throat
        b, bt, bd = pick(LASTBREATH, k, 2); L.append(W(b, bt, bd, spd=0.88 * j, db=-16.0, at=14 * S16, hp=110.0, lp=3200.0, fi=0.05, fo=0.6))
    else:
        r, rt, rd = pick(RATTLES, k, 2); L.append(W(r, rt, min(rd, 0.7), spd=0.86 * j, db=-12.0, at=8 * S16, hp=100.0, lp=2400.0, fi=0.08, fo=0.3))
        b, bt, bd = pick(LASTBREATH, k, 3); L.append(W(b, bt, min(bd, 0.8), spd=0.9 * j, db=-15.0, at=11 * S16, hp=110.0, lp=3000.0, fi=0.04, fo=0.4))
    return L

def k_armour(k, side):
    L = [W('5-252248-A-34' if k % 2 == 0 else '2-144031-A-34', 0.6 if k % 2 == 0 else 0.24, 0.3 if k % 2 == 0 else 0.12, spd=0.5, db=0.0, at=0.0, hp=150.0),   # the plate crushed
         E('4-165845-A-45', k, 0.3, spd=1.2, db=-3.0, at=0.002, hp=150.0),             # the steel
         E('2-131943-A-38', k + 1, 0.4, spd=0.66, db=-10.0, at=0.004, hp=400.0),       # its ring
         W('3-203371-A-39', 0.02, 0.3, spd=0.55, db=-9.0, at=0.008, hp=300.0, lp=5000.0, fi=0.002, fo=0.08),   # the visor's glass
         E('2-133889-A-30', k, 0.3, spd=0.9, db=-4.0, at=0.004)]                       # the man inside it
    return L + the_man(k, side, S16, 'armour') + the_drop(k, BEAT * (2 if side == 'yours' else 1.5), heavy=True)

def k_skull(k):
    return [snap(k + 3, 0.0, spd=0.62), snap(k + 5, 0.014, spd=0.8, db=-3.0), crunch(k + 2, 0.004, spd=0.36, db=-1.0),
            E('5-204114-A-29', k + 2, 0.16, spd=0.66, db=-4.0, at=0.008, hp=120.0), E('1-103999-A-30', k, 0.1, spd=0.7, db=-6.0, at=0.0, hp=150.0)]

def k_animal(kind, k):
    if kind == 'canine':
        return [E('2-117271-A-0', k + 1, 0.14, spd=1.28, db=0.0, at=0.0, hp=300.0),      # the yelp
                E('2-117271-A-0', k + 4, 0.12, spd=1.36, db=-4.0, at=2 * S16, hp=300.0),
                W('3-146964-A-5', 0.4 + 0.5 * k, 1.1, spd=0.82, db=-7.0, at=BEAT, hp=300.0, lp=4000.0, fi=0.05, fo=0.4),   # the dying whine
                E('2-118624-A-30', k, 0.4, spd=1.4, db=-4.0, at=BEAT), E('3-94344-A-25', k, 0.25, spd=1.1, db=-10.0, at=BEAT + 0.01, hp=300.0),
                W('5-261464-A-23', 2.42 + 0.3 * k, 1.0, spd=1.0, db=-9.0, at=5 * S16, hp=100.0, lp=3000.0, fi=0.04, fo=0.4)]
    if kind == 'big':
        cw = [('5-194899-B-3', 0.4), ('5-194899-B-3', 1.44), ('5-194899-C-3', 0.84)][k % 3]
        return [W(cw[0], cw[1], 0.9, spd=0.66, db=0.0, at=0.0, hp=60.0, lp=3500.0, fi=0.02, fo=0.25),   # the bellow
                E('2-133889-A-30', k, 0.4, spd=0.55, db=-1.0, at=BEAT + S16),          # it goes down, heavy
                W('4-132383-B-2', 1.28, 0.26, spd=0.58, db=-7.0, at=3 * BEAT / 2 + S16, hp=80.0, lp=3000.0),
                W('5-261464-A-23', 0.02 + 0.4 * k, 1.2, spd=0.6, db=-8.0, at=5 * S16, hp=60.0, lp=2500.0, fi=0.05, fo=0.4)]
    if kind == 'cat':
        cw = [('4-133047-B-5', 2.42, 0.72), ('4-133047-C-5', 1.40, 0.9), ('4-133047-C-5', 0.14, 0.44)][k % 3]
        return [W(cw[0], cw[1], cw[2], spd=0.64, db=0.0, at=0.0, hp=120.0, lp=4500.0, fi=0.01, fo=0.2),   # the yowl
                W('3-146972-A-5', 0.15, 0.4, spd=0.55, db=-6.0, at=2 * S16, hp=120.0, lp=4000.0),
                E('2-118624-A-30', k, 0.4, spd=1.2, db=-3.0, at=BEAT + S16),
                W('3-146964-A-5', 1.6 + 0.3 * k, 0.9, spd=0.7, db=-9.0, at=BEAT + 2 * S16, hp=200.0, lp=3500.0, fi=0.05, fo=0.4)]
    raise ValueError(kind)

KINDS = {'bone': k_bone, 'blade': k_blade, 'gun': k_gun, 'beast': k_beast, 'slow': k_slow, 'armour': k_armour}
ANIMALS = ('canine', 'big', 'cat')

def voices():
    """name -> (builder(k), cut seconds, side for the chain, loudness under the shotgun)"""
    V = {}
    for kind, fn in KINDS.items():
        for side in ('yours', 'theirs'):
            V['%s_%s' % (kind, side)] = (lambda k, fn=fn, side=side: fn(k, side), CUT[side], side, LOUD[side])
    V['skull'] = (k_skull, 0.75, 'theirs', LOUD['skull'])
    for a in ANIMALS:
        V['animal_' + a] = (lambda k, a=a: k_animal(a, k), 4 * BEAT, 'theirs', LOUD['animal'])
    return V

def stems_used():
    return sorted(ESC)

# ----------------------------------------------------------------------------------------------------------------------
def chain(x, cut, side):
    """The bullets' chain (BL.chain's stages in its order), its camcorder gentler: the scream on top, the choke and the
    rattle under it, the silence after him a silence."""
    y = np.concatenate([x, np.zeros(int(0.3 * SR), np.float32)])
    y = (y * (0.5 / (np.abs(y).max() + 1e-9))).astype(np.float32)   # into the machine at -6 dBFS: twelve layers summed peaked
                                                                      # at +9, and the tape's tanh flattened the scream into its tail
    y = GH.street(y, R0[side])
    y, _g = GH.camcorder_agc(y, target_db=AGC_TARGET, max_db=AGC[side])
    y = GH.tape(y); y = GH.vhs_band(y)
    n = int(cut * SR); y = y[:n] if len(y) >= n else np.concatenate([y, np.zeros(n - len(y), np.float32)])
    f = int(S16 * SR); y[-f:] *= np.linspace(1, 0, f, dtype=np.float32) ** 2
    fi = int(0.001 * SR); y[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)
    return FR.limit(y, -1.0)

def make_bank():
    src = FR.freeze_sources(stems_used())
    for s in stems_used(): FR.ensure_bank(s)
    FR.write_licences(src)
    print('banked %d clips (all CC0)' % len(stems_used()))

def render():
    os.makedirs(OUT, exist_ok=True)
    G = BL.top_db(); takes = []; man_voices = {}
    for name, (fn, cut, side, rel) in voices().items():
        want = G + rel
        man_voices[name] = dict(cut_s=cut, loud_100ms_db=round(want, 2), side=side, takes=[])
        for k in range(TAKES):
            x, info = BL.mix(fn(k), cut + 0.4)
            y = chain(x, cut, side)
            y = BL.fit(y, want)
            takes.append((name, k, y, info))
    t = 0.0; parts = []
    for name, k, y, info in takes:
        slot = round(len(y) / SR + LEAD + 0.05, 3)
        buf = np.zeros(int(slot * SR), np.float32); buf[int(LEAD * SR):int(LEAD * SR) + len(y)] = y
        parts.append(buf)
        man_voices[name]['takes'].append(dict(k=k, at_s=round(t + LEAD, 4), dur_s=round(len(y) / SR, 4), layers=info, **GH.measure(y)))
        t += slot
    sprite = np.concatenate(parts)
    pk = FR.write_mp3(os.path.join(OUT, 'death.mp3'), sprite, 56)
    lic = FR.load_sources()
    used = sorted({l['source'] for v in man_voices.values() for tk in v['takes'] for l in tk['layers']})
    man = dict(_readme='DEATH SOUNDS THAT TERRIFY (SOUNDS 10/26/26, row [death sounds that terrify], rule 235): every death in a fight, '
                       'from real recordings, through the bullets\' own street, camcorder and tape (tools/bohemia_death_sounds.py). '
                       'Every take\'s layers: the CC0 clip, the window in it, the speed, the place on the 16th grid, the level. '
                       'The game reads index.json (tools/bohemia_death_sounds_level.js).',
               made='10/26/26', lane='sounds', bpm=120, file='death.mp3', kbps=56, peak_db_decoded=round(pk, 2), seconds=round(len(sprite) / SR, 2),
               top_loud_100ms_db=G, chain='layers (each through a 1:3 expander 24 dB under its peak) > street canyon (yours 10 m, theirs 28 m; an echo every 16th) > camcorder AGC (target -6 dB, yours up to +3, theirs +2) > tape > VHS band 100 Hz to 10 kHz > cut, a 16th fade > one loudness per voice',
               kinds=dict(bone='a blunt blow', blade='a cut or a stab', gun='a gun', beast='killed by a beast', slow='finished off, already dying',
                          armour='the killing blow broke the last of his plate', skull='laid on top when the blow took the head',
                          animal_canine='a dog or wolf dying', animal_big='a big beast dying', animal_cat='a big cat dying'),
               sources={s: dict(what=ESC.get(s, ''), author=lic[s]['author'], freesound=lic[s]['url'], licence=lic[s]['licence'],
                                category=lic[s]['category'], source=lic[s]['source']) for s in used if s in lic},
               voices=man_voices)
    json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print('death.mp3: %d takes, %.1f s, peak %.2f dB' % (len(takes), len(sprite) / SR, pk))
    for name, v in man_voices.items():
        print('  %-16s %s' % (name, [round(tk['loud_100ms_db'], 1) for tk in v['takes']]))

def check():
    man = json.load(open(os.path.join(OUT, 'manifest.json'))); bad = []
    x, sr = sf.read(os.path.join(OUT, man['file']), dtype='float32')
    if 20 * math.log10(np.abs(x).max() + 1e-12) > -0.9: bad.append('the sprite peaks over -1 dBFS')
    kinds = set(n.rsplit('_', 1)[0] for n in man['voices'] if n.endswith('_yours') or n.endswith('_theirs'))
    if len(kinds) < 6: bad.append('fewer than six kinds: %s' % sorted(kinds))
    for name, v in man['voices'].items():
        if len(v['takes']) < 3: bad.append(name + ' has fewer than three takes')
        for tk in v['takes']:
            a = int(tk['at_s'] * sr); b = a + int(tk['dur_s'] * sr); y = x[a:b]
            end = 20 * math.log10(np.abs(y[-int(0.002 * sr):]).max() + 1e-12)
            if end > -50: bad.append('%s take %d ends at %.1f dB (a click)' % (name, tk['k'], end))
            loud = GH.short_loud_db(y)
            if abs(loud - v['loud_100ms_db']) > 1.5: bad.append('%s take %d is %.1f dB, wants %.1f' % (name, tk['k'], loud, v['loud_100ms_db']))
            if GH.band_share(y, 10000) > 0.05: bad.append('%s take %d: %.3f of its energy above 10 kHz (the VHS band)' % (name, tk['k'], GH.band_share(y, 10000)))
            for l in tk['layers']:
                if l['source'] not in man['sources'] or man['sources'][l['source']]['licence'] != 'CC0':
                    bad.append(name + ': a source with no CC0 line ' + l['source'])
                if (l['at_s'] * 1000) % (S16 * 1000) > 40 and (S16 * 1000 - (l['at_s'] * 1000) % (S16 * 1000)) > 40:
                    bad.append('%s take %d: a layer at %.3f s is off the 16th grid' % (name, tk['k'], l['at_s']))
        # two takes of one voice are not the same sound
        ys = []
        for tk in v['takes']:
            a = int(tk['at_s'] * sr); ys.append(x[a:a + int(min(t['dur_s'] for t in v['takes']) * sr)])
        for i in range(len(ys)):
            for j in range(i + 1, len(ys)):
                c = float(np.dot(ys[i], ys[j]) / (np.linalg.norm(ys[i]) * np.linalg.norm(ys[j]) + 1e-9))
                if c > 0.9: bad.append('%s takes %d and %d are the same sound (r %.2f)' % (name, i, j, c))
    # his men's deaths are the worst sound: louder and longer than theirs
    for kind in kinds:
        y, t = man['voices'][kind + '_yours'], man['voices'][kind + '_theirs']
        if not (y['loud_100ms_db'] > t['loud_100ms_db'] and y['cut_s'] > t['cut_s']): bad.append(kind + ': his man is not worse than theirs')
    print('PASS' if not bad else 'FAIL\n  ' + '\n  '.join(bad))
    return not bad

if __name__ == '__main__':
    if '--bank' in sys.argv: make_bank()
    elif '--check' in sys.argv: sys.exit(0 if check() else 1)
    else: render()
