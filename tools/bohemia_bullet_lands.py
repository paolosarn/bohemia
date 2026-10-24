#!/usr/bin/env python3
"""
BOHEMIA - THE BULLET LANDS (SOUNDS 10/24/26, row [the bullet lands], rule 120: guns first; rule 126(c): every hit, kill and
fall is heard; rule 127: no card, he hears it in his next fight).

The other half of the gun. [the guns heard] (10/19) made the shot from nine real guns; this makes where the bullet goes,
from real recordings, through the same street, the same camcorder and the same tape:

  flesh_<gun>     the bullet in a man          a clap's slap (the meat), a wet bare foot on tile (the wet), a heavy door's
                                               knock under it (the body's mass); the rifle heavier, the shotgun's pellets
                                               smeared over 18 ms, the machine gun three rounds on 16ths
  armour_<gun>    the bullet on his plate      a wind-up alarm clock's bell struck once (the ping), the train's steel
                                               between two wagons quickened (the plate), the door's knock (the man under it)
  bone            the head (vital): a knuckle on hard wood quickened, laid on the flesh
  cover_<what>    a miss into cover            wood (a door knocked, a shed, a fence), stone (asphalt under a heel, the
                                               gravel's grit), metal (the wagons' steel), a car (the steel and its glass)
  ground_far      a miss in the dirt over there (a step in gravel, its grit and its thump)
  ground_near     a miss in the dirt at your feet (the same gravel, closer, heavier)
  pellets         the shotgun's spray into the ground, nine grit hits over 40 ms
  crack_rifle     a miss PAST YOUR EAR: the bullet's own supersonic crack, recorded by a microphone downrange of a real
                  rifle (the library's far and mid mics stand in front of the shooter: the crack reaches them 12 to 33 ms
                  before the gun's report does, so it is cut out whole, before the bang arrives)
  crack_mg        the machine gun's sweep past you: three real cracks on 16ths
  ricochet        off stone or steel: the clock bell's strike, then a real bluebottle fly quickened four times and
                  dropping as it passes (varispeed: the Doppler of a thing going by and away)
  down_dead       a man shot dead goes down: a knee (a heavy step on a factory floor), the body (a heavy door closing),
                  his gear (the wagons' steel, small), the dirt, and the last breath out (a real man's breath)
  down_hurt       struck down, alive: the same fall and a frightened breath in
  gun_mg_<side>   the machine gun itself: real full-auto bursts (AK-47, PPSh, Carl Gustav M45), every round re-laid
                  on the 16th or 32nd grid, the near mic for yours, the mid mic for theirs

THE SOURCES, all real recordings, all CC0:
  The Free Firearm Sound Library (Still North Media, CC0 1.0, github.com/buddingmonkey/FreeFirearmsSFXLibrary): the cracks
  and the bursts, banked as FLAC windows in reference/library/sound_bank/ffsl_cc0/ (LICENCES.json carries every window).
  ESC-50 (github.com/karolpiczak/ESC-50): only clips whose Freesound author released them CC0, frozen through
  tools/bohemia_from_a_recording.py (it refuses anything else), banked in reference/library/sound_bank/esc50_cc0/.

THE CHAIN (tools/bohemia_guns_heard.py's own stages, REUSE-FIRST): the layers summed > the street canyon (an echo every
16th, the impact at 20 m) > the camcorder's automatic gain (held to +12 dB here: a landing is quiet, and the full +24
lifts the room of every clip into a wash under a firefight) > tape > the VHS band > one cut length, a 16th's fade > one
loudness per voice under the shotgun's shot.

OUT: slices/fight_heard/lands.mp3 (ONE sprite, every take of every voice; one request on a phone) and manifest.json (the
offset and length of every take). The game's player is engine/bohemia_bullet_lands.js.

  python3 tools/bohemia_bullet_lands.py --bank     # cut the windows from the masters and the clips (needs the clones)
  python3 tools/bohemia_bullet_lands.py            # render from the bank (no network)
  python3 tools/bohemia_bullet_lands.py --check    # re-read the sprite and verify the pass criteria
"""
import json, math, os, sys
import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.environ.setdefault('ESC50_AUDIO', '/tmp/claude-0/ext/esc50/audio')
os.environ.setdefault('FFSL', '/tmp/claude-0/ext/ffsl')
import bohemia_from_a_recording as FR   # REUSE-FIRST: freeze_sources (CC0 only), ensure_bank, speed, hp, lp, gain_db, limit, write_mp3
import bohemia_guns_heard as GH          # REUSE-FIRST: the street, the camcorder, the tape, the VHS band, the loudness, the masters

ROOT = os.path.dirname(HERE)
SR = FR.SR
OUT = os.path.join(ROOT, 'slices', 'fight_heard')
FFSL_BANK = GH.BANK
BEAT = 0.5
SLOT = 1.0            # every take sits in a one-second slot; a down sits in two
LEAD = 0.02
CUT = 0.75            # a landing is a beat and a half
DOWN_CUT = 2.0        # a man going down is four beats
N = 5                 # takes per voice: an odd count against 4/4, never the same take twice running (the player)
AGC_MAX = 6.0         # a landing: the camcorder lifts the quiet 6 dB at most (12 put the street's 16th echo 2 dB under the
                      # hit itself, measured 10/24: every landing read twice)
DOWN_AGC = 12.0       # a man going down: the silence after him is the point, the machine pulls it up
STREET_R0 = 20.0

# ----------------------------------------------------------------------------------------------------------------------
# THE REAL MATERIAL
# ----------------------------------------------------------------------------------------------------------------------
ESC = {   # stem: what it is, as its author named it (the licence line is frozen by FR.freeze_sources: CC0 or refused)
    '2-76408-B-22': 'a single clap, close (therabidfrog, Clap.mp3)',
    '2-76408-C-22': 'a single clap, close (therabidfrog, Clap.mp3)',
    '2-76408-D-22': 'a single clap, close (therabidfrog, Clap.mp3)',
    '2-25293-A-22': 'claps, sharp (freesound, Clap_ses2.wav)',
    '1-51147-A-25': 'wet bare feet in a small shower cabin (RutgerMuller)',
    '2-133889-A-30': 'knocking on a large wood door (aroth4)',
    '2-118624-A-30': 'a door opened and closed, close mic (E-Audio)',
    '1-155858-B-25': 'footsteps in a factory hall, wood and concrete (RutgerMuller)',
    '1-103999-A-30': 'wood knocks (RutgerMuller)',
    '4-186518-A-30': 'a wooden door knocked, close (ragamuffin)',
    '4-165845-A-45': 'on a train in Argentina, between two wagons, metal (felix.blume)',
    '4-165845-B-45': 'on a train in Argentina, between two wagons, metal (felix.blume)',
    '2-131943-A-38': 'a wind-up clock with a twin bell alarm (AngryAdam)',
    '1-62849-A-38': 'a clock tick, close (life_interconnected)',
    '3-94344-A-25': 'footsteps on gravel (Ryding, Fotsteg pa grus)',
    '4-218304-B-25': 'sneakers on gravel and leaves (MentalSanityOff)',
    '3-94343-A-25': 'footsteps on asphalt (Ryding, Fotsteg pa asfalt)',
    '3-203373-A-39': 'glass shattering (C_Rogers)',
    '4-204777-A-39': 'breaking glass (ngruber)',
    '5-195518-A-7': 'a bluebottle fly, foley (jamesrodavidson)',
    '5-232816-A-23': 'a contained breath (xavimuse)',
    '3-166125-A-23': 'scared breathing (Adam_N)',
    '3-171041-A-38': 'an old electromechanical clock ticking, "Yantar" (ST303)',
}
# the cracks: (folder, track, shot index) on a downrange mic; every one measured 10/24 with the crack 1 to 6 dB under the
# report and the report arriving 12 to 16 ms later (the far mics), the floor between them 40 to 54 dB down
CRACKS = [('1917', 'B_21', 0), ('1917', 'B_21', 1), ('Mosin Nagant', 'M_26', 0), ('Mosin Nagant', 'M_26', 1), ('Mosin Nagant', 'M_26', 2),
          ('Tikka', 'W_23', 0), ('Tikka', 'W_23', 1), ('Tikka', 'W_25', 0), ('Tikka', 'W_25', 1), ('AR-15', 'D_25', 0), ('AR-15', 'D_25', 1),
          ('AK-47', 'C_17', 0), ('AK-47', 'C_17', 1)]
MIC = {   # the library's Master Sheet, word for word: where each microphone stood (every crack mic is in FRONT of the shooter)
    'B_21': 'far distance, front of shooter', 'M_26': 'mid distance, front of shooter', 'W_23': 'far distance, front of shooter',
    'W_25': 'far distance, front of shooter', 'D_25': 'far distance, front of shooter', 'C_17': 'far distance, front of shooter',
    'C_29': 'near distance, front of shooter', 'P_32': 'near distance, front of shooter', 'G_33': 'near distance, front of shooter',
    'C_32': 'mid distance, front of shooter', 'P_18': 'far distance, front of shooter', 'G_22': 'mid distance, front of shooter'}
# the machine gun's bursts: (folder, track) near (yours) and mid (theirs), short bursts
BURSTS = {'yours': [('AK-47', 'C_29'), ('PPSh', 'P_32'), ('Carl Gustav M45_Swedish K', 'G_33')],
          'theirs': [('AK-47', 'C_32'), ('PPSh', 'P_18'), ('Carl Gustav M45_Swedish K', 'G_22')]}
BURST_GRID = {'AK-47': 0.125, 'PPSh': 0.0625, 'Carl Gustav M45_Swedish K': 0.0625}   # an AK's 600 a minute onto 16ths, the two
                                                                              # sub-machine guns' 1,000 onto 32nds

# ----------------------------------------------------------------------------------------------------------------------
# THE BANK
# ----------------------------------------------------------------------------------------------------------------------
def env_db(x, w_s=0.0005):
    w = max(1, int(SR * w_s)); n = len(x) // w
    return 20 * np.log10(np.abs(x[:n * w]).reshape(n, w).max(1) + 1e-9), w

def crack_windows(x, sr):
    """Every shot on a downrange track: the crack (the first transient) and the report (the next 12 dB rise), in seconds."""
    w = int(sr * 0.0005); n = len(x) // w
    e = 20 * np.log10(np.abs(x[:n * w]).reshape(n, w).max(1) + 1e-9); pk = e.max(); out = []; last = -1e9
    for i in range(4, n):
        if e[i] > pk - 28 and e[i] - e[i - 4] > 18 and i - last > int(0.4 / 0.0005):
            last = i; seg = e[i:i + 160]; mn = seg[0]
            for j in range(8, len(seg)):
                mn = min(mn, seg[j - 1])
                if seg[j] - mn > 12 and seg[j] > pk - 12:
                    out.append((i * w / sr, (i + j) * w / sr)); break
    return out

def make_bank():
    src = FR.freeze_sources(sorted(ESC))
    for s in ESC: FR.ensure_bank(s)
    FR.write_licences(src)
    lic_path = os.path.join(FFSL_BANK, 'LICENCES.json'); lic = json.load(open(lic_path))
    for folder, track, k in CRACKS:
        x, sr = GH.master(folder, track)
        cw = crack_windows(x, sr)
        if k >= len(cw): sys.exit('no crack %d in %s/%s' % (k, folder, track))
        t, tb = cw[k]; a = int((t - 0.002) * sr); b = int((tb - 0.0015) * sr)
        y = GH.to_sr(x[a:b], sr); bid = '%s_%d_crack' % (track, k)
        sf.write(os.path.join(FFSL_BANK, bid + '.flac'), y, SR, subtype='PCM_24')
        lic['windows'][bid] = dict(gun_folder=folder, master_track='Master Tracks/%s/%s.wav' % (folder, track), event=k, kind='crack',
                                   onset_s=round(t, 4), report_s=round(tb, 4), window_s=[round(t - 0.002, 4), round(tb - 0.0015, 4)], source_rate=sr,
                                   clipped_source_samples=int((np.abs(x[a:b]) >= 0.999).sum()), mic=MIC[track],
                                   what="the bullet's supersonic crack on a mic downrange, cut before the gun's report arrives")
    for side, picks in BURSTS.items():
        for folder, track in picks:
            x, sr = GH.master(folder, track)
            on = GH.onsets(x, sr, thr_db=-18.0, gap=0.6)
            t = on[0]; a = int((t - 0.01) * sr); b = min(len(x), int((t + 1.6) * sr))
            y = GH.to_sr(x[a:b], sr); bid = '%s_0_burst' % track
            sf.write(os.path.join(FFSL_BANK, bid + '.flac'), y, SR, subtype='PCM_24')
            lic['windows'][bid] = dict(gun_folder=folder, master_track='Master Tracks/%s/%s.wav' % (folder, track), event=0, kind='burst',
                                       onset_s=round(t, 4), window_s=[round(t - 0.01, 4), round(t + 1.6, 4)], source_rate=sr,
                                       clipped_source_samples=int((np.abs(x[a:b]) >= 0.999).sum()), mic=MIC[track], what='a short full-auto burst, for ' + side)
    json.dump(lic, open(lic_path, 'w'), indent=1, sort_keys=True)
    print('banked %d cracks, %d bursts, %d clips' % (len(CRACKS), sum(len(v) for v in BURSTS.values()), len(ESC)))

def esc(stem):
    x, sr = sf.read(os.path.join(FR.BANK, stem + '.flac'), dtype='float32')
    if x.ndim > 1: x = x.mean(axis=1)
    if sr != SR: x = signal.resample_poly(x, SR, sr).astype(np.float32)
    return x

def ffsl(bid):
    return GH.banked(bid)

# ----------------------------------------------------------------------------------------------------------------------
# A HIT OUT OF A CLIP: the k-th onset, a window from 3 ms before it, a fade at its end
# ----------------------------------------------------------------------------------------------------------------------
_ON = {}
def hits(stem, top=20.0, jump=12.0, gap=0.12):
    if stem in _ON: return _ON[stem]
    x = esc(stem); e, w = env_db(x, 0.002); pk = e.max(); out = []; last = -1e9
    for i in range(3, len(e)):
        if e[i] > pk - top and e[i] - e[i - 3] > jump and (i - last) * w / SR > gap: out.append(i * w / SR); last = i
    _ON[stem] = out
    return out

_ALL = {}
def grab(stem, k, dur, pre=0.003, fo=0.02):
    """One event and only that one: the window stops 4 ms before the next thing the clip does (measured 10/24: a fixed
    window caught a second, louder clap inside the shotgun's pellets and put the peak 100 ms late)."""
    x = esc(stem); on = hits(stem)
    if stem not in _ALL:
        e, w = env_db(x, 0.002); pk = e.max(); _ALL[stem] = [i * w / SR for i in range(3, len(e)) if e[i] > pk - 32 and e[i] - e[i - 3] > 8]
    t = on[k % len(on)]
    nxt = [u for u in _ALL[stem] if u > t + 0.02]
    if nxt: dur = max(0.03, min(dur, nxt[0] - t - 0.004))
    a = max(0, int((t - pre) * SR)); y = x[a:a + int(dur * SR)].copy()
    f = min(len(y), int(fo * SR)); y[-f:] *= np.linspace(1, 0, f, dtype=np.float32) ** 2
    fi = int(0.001 * SR); y[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)
    return y

def norm(y):
    return (y / (np.abs(y).max() + 1e-9)).astype(np.float32)

def lay(out, y, at, db):
    i = int(at * SR); j = min(len(out), i + len(y))
    if j > i: out[i:j] += FR.gain_db(y[:j - i], db)

def L(stem, k, dur, spd=1.0, db=0.0, at=0.0, hp=None, lp=None):
    """One real layer: an event of a clip, sped (a resample, the tape's way), filtered, levelled by its peak."""
    y = grab(stem, k, dur / spd if spd else dur)
    y = FR.speed(y, spd)
    if hp: y = FR.hp(y, hp)
    if lp: y = FR.lp(y, lp)
    return dict(y=norm(y), at=at, db=db, src=stem, k=k, spd=spd)

def mix(layers, length):
    out = np.zeros(int(length * SR), dtype=np.float32)
    for l in layers: lay(out, l['y'], l['at'], l['db'])
    return out, [dict(source=l['src'], event=l['k'], speed=round(l['spd'], 3), at_s=round(l['at'], 4), db=l['db']) for l in layers]

# ----------------------------------------------------------------------------------------------------------------------
# THE VOICES: each a function of the take (0..4) returning its real layers
# ----------------------------------------------------------------------------------------------------------------------
CLAPS = ['2-76408-B-22', '2-76408-C-22', '2-76408-D-22', '2-25293-A-22']
WET, BODY, DOOR, STEP = '1-51147-A-25', '2-133889-A-30', '2-118624-A-30', '1-155858-B-25'
KNOCK, KNOCK2, WAGON = ['1-103999-A-30', '4-186518-A-30'], None, ['4-165845-A-45', '4-165845-B-45']
BELL, TICK, GRAVEL, GRIT, ASPHALT = '2-131943-A-38', '1-62849-A-38', '3-94344-A-25', '4-218304-B-25', '3-94343-A-25'
GLASS = ['3-203373-A-39', '4-204777-A-39']
FLY, BREATH_OUT, BREATH_IN = '5-195518-A-7', '5-232816-A-23', '3-166125-A-23'

SIZE = {   # how big the bullet is: the speed of the meat (faster = smaller), the body under it, the level of the wet
    'pistol': dict(spd=1.18, body=-9.0, wet=-11.0),
    'rifle': dict(spd=0.86, body=-4.0, wet=-8.0),
    'shotgun': dict(spd=1.0, body=-5.0, wet=-9.0),
    'mg': dict(spd=1.05, body=-7.0, wet=-10.0),
}

def flesh_one(gun, k, at=0.0, db=0.0):
    s = SIZE[gun]
    return [L(CLAPS[k % 4], k, 0.16, spd=s['spd'], db=db, at=at, hp=150.0),
            L(WET, k + 1, 0.12, spd=s['spd'] * 1.1, db=db + s['wet'], at=at + 0.002, hp=900.0),
            L(BODY, k, 0.22, spd=s['spd'] * 0.9, db=db + s['body'], at=at + 0.004)]

def v_flesh(gun, k):
    if gun == 'shotgun':   # nine pellets over 18 ms: the meat struck many times at once
        rng = np.random.RandomState(40 + k); out = []
        for i in range(5):
            out += flesh_one('shotgun', k + i, at=float(rng.uniform(0, 0.018)), db=-3.0 if i else 0.0)[:2]
        out.append(L(BODY, k, 0.22, spd=0.85, db=-3.0, at=0.004))
        return out
    if gun == 'mg':        # three rounds into him on 16ths: the sweep
        return sum([flesh_one('mg', k + i, at=i * BEAT / 4, db=-1.5 * i) for i in range(3)], [])
    return flesh_one(gun, k)

def v_armour(gun, k):
    s = SIZE[gun]; n = 3 if gun == 'mg' else 1; out = []
    for i in range(n):
        at = i * BEAT / 4
        out += [L(BELL, k + i, 0.28, spd=1.0 + 0.06 * (k % 3) + (0.15 if gun == 'pistol' else 0.0), db=-1.5 * i, at=at, hp=700.0),
                L(WAGON[k % 2], k + i, 0.25, spd=1.6 if gun != 'rifle' else 1.3, db=-3.0 - 1.5 * i, at=at + 0.001, hp=200.0),
                L(BODY, k + i, 0.2, spd=s['spd'], db=s['body'] - 2.0 - 1.5 * i, at=at + 0.006)]
    if gun == 'shotgun':
        rng = np.random.RandomState(70 + k)
        for i in range(4): out.append(L(TICK, k + i, 0.06, spd=float(rng.uniform(1.2, 1.8)), db=-6.0, at=float(rng.uniform(0.002, 0.02)), hp=1500.0))
    return out

def v_bone(k):
    return [L(KNOCK[k % 2], k, 0.12, spd=1.35, db=0.0, at=0.0, hp=300.0), L(CLAPS[(k + 1) % 4], k + 2, 0.1, spd=0.75, db=-6.0, at=0.003, hp=120.0)]

def v_cover(what, k):
    if what == 'wood':
        return [L(KNOCK[k % 2], k, 0.25, spd=1.1, db=0.0, hp=150.0), L(GRIT, k, 0.18, spd=1.3, db=-8.0, at=0.006, hp=1500.0),
                L(KNOCK[(k + 1) % 2], k + 1, 0.2, spd=0.8, db=-9.0, at=0.002)]
    if what == 'stone':
        return [L(ASPHALT, k, 0.2, spd=1.5, db=0.0, hp=150.0), L(GRAVEL, k, 0.25, spd=1.25, db=-4.0, at=0.004, hp=600.0),
                L(GRIT, k + 2, 0.22, spd=1.15, db=-7.0, at=0.012, hp=1500.0), L(TICK, k, 0.05, spd=1.6, db=-10.0, at=0.0, hp=1500.0)]
    if what == 'metal':
        return [L(WAGON[k % 2], k, 0.35, spd=1.25, db=0.0, hp=150.0), L(BELL, k + 1, 0.22, spd=0.8, db=-7.0, at=0.001, hp=500.0),
                L(TICK, k + 1, 0.05, spd=1.4, db=-8.0, hp=1500.0)]
    if what == 'car':
        return [L(WAGON[(k + 1) % 2], k + 2, 0.3, spd=1.1, db=0.0, hp=150.0), L(GLASS[k % 2], k, 0.45, spd=1.0, db=-4.0, at=0.01, hp=800.0, lp=7000.0),
                L(BELL, k, 0.2, spd=0.7, db=-10.0, at=0.001, hp=500.0)]
    raise ValueError(what)

def v_ground(where, k):
    if where == 'far':
        return [L(GRAVEL, k, 0.22, spd=1.35, db=0.0, hp=180.0, lp=7000.0), L(GRIT, k + 1, 0.2, spd=1.4, db=-5.0, at=0.006, hp=1500.0, lp=7000.0)]
    return [L(GRAVEL, k + 2, 0.3, spd=1.05, db=0.0, hp=80.0), L(GRIT, k + 3, 0.28, spd=1.15, db=-3.0, at=0.004, hp=1200.0),
            L(BODY, k, 0.15, spd=1.2, db=-9.0, at=0.0)]

def v_pellets(k):
    rng = np.random.RandomState(90 + k); out = []
    for i in range(9):
        out.append(L(GRIT if i % 2 else GRAVEL, k + i, 0.12, spd=float(rng.uniform(1.3, 1.9)), db=float(rng.uniform(-6, 0)), at=float(rng.uniform(0, 0.04)), hp=600.0))
    return out

def crack(bid, at, db):
    y = ffsl(bid); y = FR.hp(y, 200.0)
    f = int(0.003 * SR); y[-f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return dict(y=norm(y), at=at, db=db, src='ffsl:' + bid, k=0, spd=1.0)

def crack_ids():
    return ['%s_%d_crack' % (t, k) for _f, t, k in CRACKS]

def v_crack(kind, k):
    ids = crack_ids()
    rifle = [i for i in ids if not i.startswith('C_')]
    if kind == 'rifle':
        return [crack(rifle[(k * 2) % len(rifle)], 0.0, 0.0)]
    pool = ids[:]   # the sweep: three different real cracks on 16ths, the AK's own among them
    return [crack(pool[(k * 3 + i) % len(pool)], i * BEAT / 4, -1.0 * i) for i in range(3)]

def v_ricochet(k):
    """The strike, then the whine: a real fly quickened about four times (two octaves), its speed falling as it goes by
    and away (a time-varying resample, the Doppler of a passing thing). A recording, varispeed, never an oscillator."""
    x = esc(FLY)
    t0 = 0.2 + 0.4 * k            # the fly buzzes steadily for its first 3.7 s (measured); each take from its own place
    a = max(0, int(t0 * SR)); seg = x[a:a + int(3.0 * SR)].astype(np.float64)
    # about eight times its speed: the wings' 180 Hz becomes a 1.4 kHz whine, falling to 1 kHz as it goes (measured 10/24
    # at four times: 750 Hz, a buzz more than a whine)
    out_n = int(0.32 * SR); r0, r1 = 8.5 - 0.3 * k, 5.5
    rate = r0 + (r1 - r0) * (np.linspace(0, 1, out_n) ** 1.4)
    pos = np.cumsum(rate); pos = pos[pos < len(seg) - 2]
    i = pos.astype(int); fr = pos - i
    y = ((1 - fr) * seg[i] + fr * seg[i + 1]).astype(np.float32)
    y = FR.hp(y, 600.0)
    env = np.minimum(1.0, np.linspace(0, 1, len(y)) * 25) * (1 - np.linspace(0, 1, len(y))) ** 1.6
    y = (y * env).astype(np.float32)
    strike = L(BELL, k + 2, 0.12, spd=1.5, db=0.0, hp=900.0)
    stone = L(ASPHALT, k + 1, 0.12, spd=1.7, db=-6.0, hp=300.0)
    return [strike, stone, dict(y=norm(y), at=0.008, db=-5.0, src=FLY + ' (varispeed %.1f to %.1f)' % (r0, r1), k=0, spd=round(float(rate.mean()), 2))]

def v_down(dead, k):
    rng = np.random.RandomState(110 + k + (0 if dead else 50))
    knee = 0.0; body = 0.18 + float(rng.uniform(0, 0.06)); gear = body + 0.03
    # a phone plays nothing under about 300 Hz, so the body is heard in its middle: the door's slam quickened into the low
    # mids and a clap slowed to a meat-on-dirt slap (measured 10/24: at the door's own speed the VHS band's 100 Hz floor
    # left the knee louder than the body)
    out = [L(STEP, k, 0.18, spd=0.85, db=-8.0, at=knee, hp=60.0),
           L(DOOR, k, 0.4, spd=1.3, db=0.0, at=body),
           L(CLAPS[k % 4], k + 1, 0.2, spd=0.62, db=-3.0, at=body + 0.004, hp=120.0),
           L(WAGON[k % 2], k + 3, 0.22, spd=1.9, db=-11.0, at=gear, hp=400.0),
           L(GRAVEL, k + 1, 0.25, spd=1.0, db=-9.0, at=body + 0.01, hp=300.0)]
    if dead:   # the last breath out, a beat after he lands, under the camcorder lifting the quiet
        out.append(L(BREATH_OUT, k, 0.9, spd=0.92, db=-8.0, at=body + BEAT, hp=120.0))
    else:      # alive: a frightened breath in
        out.append(L(BREATH_IN, k, 0.6, spd=1.0, db=-7.0, at=body + 0.4, hp=120.0))
    return out

def burst(side, k):
    """The machine gun: a real burst, every round lifted out at its own onset and laid again on the grid."""
    folder, track = BURSTS[side][k % 3]
    x = ffsl('%s_0_burst' % track); e, w = env_db(x, 0.001); pk = e.max(); on = []; last = -1e9
    for i in range(3, len(e)):
        if e[i] > pk - 14 and e[i] - e[i - 3] > 6 and (i - last) * w / SR > 0.04: on.append(i * w / SR); last = i
    g = BURST_GRID[folder]; n_rounds = min(len(on), 6 if g < 0.1 else 4)
    out = np.zeros(int(1.6 * SR), dtype=np.float32)
    for r in range(n_rounds):
        a = int(max(0, on[r] - 0.002) * SR); length = 0.5 if r == n_rounds - 1 else g + 0.08
        y = x[a:a + int(length * SR)].copy(); f = int(0.03 * SR); y[-f:] *= np.linspace(1, 0, f, dtype=np.float32) ** 2
        lay(out, y, r * g, 0.0)
    return out, dict(gun=folder, track=track, rounds=n_rounds, grid_s=g, source_rounds_s=[round(t, 4) for t in on[:n_rounds]])

# THE COUNT-UP (TUNING's change 6, 'a win is a moment'; UI posts the moment, this plays it): the battery number counting
# up where it lives is an electromechanical counter, so every step of it is one real tick of an old Soviet electromechanical
# clock (the 'Yantar', ST303, CC0; the machine party's own hat), and the number landing is a battery dropped into a steel
# crate (the wagons' steel) with an alarm clock's bell struck once over it. Counting DOWN (a lost fight, 'what it cost'):
# the same ticks and a dull drop, no bell.
YANTAR = '3-171041-A-38'

def v_tick(k):
    return [L(YANTAR, k, 0.08, spd=1.0 + 0.04 * (k % 3), db=0.0, hp=300.0)]

def v_tally(up, k):
    if up:
        return [L(WAGON[k % 2], k + 4, 0.3, spd=1.2, db=-2.0, hp=180.0), L(BELL, k + 3, 0.6, spd=1.0, db=0.0, at=0.004, hp=600.0),
                L(YANTAR, k + 1, 0.08, spd=1.0, db=-6.0)]
    return [L(WAGON[(k + 1) % 2], k + 2, 0.3, spd=0.8, db=0.0, hp=150.0), L(DOOR, k, 0.3, spd=1.4, db=-4.0, at=0.003)]

# the voices: name -> (builder, cut length, loudness under the shotgun's shot in dB)
FEW = 3   # the rarer voices (the head, cover, the spray, the ricochet, the falls) carry three takes, still never one twice running

def voices():
    V = {}
    for g in ('pistol', 'rifle', 'shotgun', 'mg'):
        V['flesh_' + g] = (lambda k, g=g: v_flesh(g, k), CUT, -9.0 + (1.0 if g == 'rifle' else 0.0))
        V['armour_' + g] = (lambda k, g=g: v_armour(g, k), CUT, -9.0)
    V['bone'] = (v_bone, CUT, -12.0)
    for c in ('wood', 'stone', 'metal', 'car'):
        V['cover_' + c] = (lambda k, c=c: v_cover(c, k), CUT, -10.0)
    V['ground_far'] = (lambda k: v_ground('far', k), CUT, -13.0)
    V['ground_near'] = (lambda k: v_ground('near', k), CUT, -9.0)
    V['pellets'] = (v_pellets, CUT, -11.0)
    V['crack_rifle'] = (lambda k: v_crack('rifle', k), CUT, -5.5)
    V['crack_mg'] = (lambda k: v_crack('mg', k), CUT, -6.0)
    V['ricochet'] = (v_ricochet, CUT, -9.0)
    V['down_dead'] = (lambda k: v_down(True, k), DOWN_CUT, -7.0)
    V['down_hurt'] = (lambda k: v_down(False, k), DOWN_CUT, -7.0)
    V['tick'] = (v_tick, 0.25, -17.0)
    V['tally_up'] = (lambda k: v_tally(True, k), CUT, -9.0)
    V['tally_down'] = (lambda k: v_tally(False, k), CUT, -11.0)
    return V

def chain(x, cut, agc_max=AGC_MAX, r0=STREET_R0):
    y = np.concatenate([x, np.zeros(int(0.3 * SR), np.float32)])
    y = GH.street(y, r0)
    y, _g = GH.camcorder_agc(y, max_db=agc_max)
    y = GH.tape(y); y = GH.vhs_band(y)
    n = int(cut * SR); y = y[:n] if len(y) >= n else np.concatenate([y, np.zeros(n - len(y), np.float32)])
    f = int(BEAT / 4 * SR); y[-f:] *= np.linspace(1, 0, f, dtype=np.float32) ** 2
    fi = int(0.001 * SR); y[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)
    return FR.limit(y, -1.0)

def chain_hand(x, cut):
    """The count-up is the number in your hands, not a thing out in the street: the tape and the machine's band, no canyon."""
    y = GH.tape(x.astype(np.float32)); y = GH.vhs_band(y)
    n = int(cut * SR); y = y[:n] if len(y) >= n else np.concatenate([y, np.zeros(n - len(y), np.float32)])
    f = min(n // 3, int(BEAT / 4 * SR)); y[-f:] *= np.linspace(1, 0, f, dtype=np.float32) ** 2
    fi = int(0.001 * SR); y[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)
    return y

def fit(y, want):
    """To its loudness and no further: a plain gain, then, only if a peak would pass -1 dBFS, the whole take comes down
    (FR.limit is pedalboard's limiter, which adds its own make-up gain: measured 10/24, it lifted every landing 4.8 dB over
    its mark, so it is never used after the level is set)."""
    y = FR.gain_db(y, want - GH.short_loud_db(y)); ceil = 10 ** (-1.05 / 20.0); pk = float(np.abs(y).max())
    return (y * (ceil / pk)).astype(np.float32) if pk > ceil else y

def top_db():
    return json.load(open(os.path.join(GH.OUT, 'manifest.json')))['loudness']['top_loud_100ms_db']

def render():
    os.makedirs(OUT, exist_ok=True)
    G = top_db(); takes = []; man_voices = {}
    for name, (fn, cut, rel) in voices().items():
        cuts = []
        for k in range(N if name.split('_')[0] in ('flesh', 'armour', 'ground', 'crack', 'tick') else FEW):
            layers = fn(k); x, info = mix(layers, cut + 0.1)
            y = chain_hand(x, cut) if name in ('tick', 'tally_up', 'tally_down') else chain(x, cut, agc_max=DOWN_AGC if name.startswith('down_') else AGC_MAX)
            cuts.append((y, info))
        want = G + rel
        man_voices[name] = dict(cut_s=cut, loud_100ms_db=round(want, 2), takes=[])
        for k, (y, info) in enumerate(cuts):
            y = fit(y, want)
            takes.append((name, k, y, info))
    for side in ('yours', 'theirs'):
        name = 'gun_mg_' + side; want = G - 2.0 + GH.PERSP[side]['db']
        man_voices[name] = dict(cut_s=GH.LEN, loud_100ms_db=round(want, 2), takes=[])
        for k in range(3):
            x, info = burst(side, k)
            y = GH.street(np.concatenate([x, np.zeros(int(0.3 * SR), np.float32)]), GH.PERSP[side]['r0'])
            y, _g = GH.camcorder_agc(y); y = GH.tape(y); y = GH.vhs_band(y)
            y = GH.two_beats(y, int(0.0 * SR), pre=0.0)
            y = fit(y, want)
            takes.append((name, k, y, info))
    # ONE SPRITE: every take at its own offset, a 20 ms lead, slots of whole seconds
    t = 0.0; parts = []
    for name, k, y, info in takes:
        slot = round(len(y) / SR + LEAD + 0.05, 3)
        buf = np.zeros(int(slot * SR), np.float32); buf[int(LEAD * SR):int(LEAD * SR) + len(y)] = y
        parts.append(buf)
        man_voices[name]['takes'].append(dict(k=k, at_s=round(t + LEAD, 4), dur_s=round(len(y) / SR, 4), layers=info, **GH.measure(y)))
        t += slot
    sprite = np.concatenate(parts)
    pk = FR.write_mp3(os.path.join(OUT, 'lands.mp3'), sprite, 64)
    lic_esc = FR.load_sources(); lic_ffsl = json.load(open(os.path.join(FFSL_BANK, 'LICENCES.json')))['windows']
    used_esc = sorted({l['source'] for v in man_voices.values() for tk in v['takes'] for l in (tk['layers'] if isinstance(tk['layers'], list) else []) if not l['source'].startswith('ffsl:') and l['source'] in lic_esc})
    used_esc += sorted({l['source'].split(' ')[0] for v in man_voices.values() for tk in v['takes'] for l in (tk['layers'] if isinstance(tk['layers'], list) else []) if ' (varispeed' in l['source']})
    man = dict(_readme='THE BULLET LANDS (SOUNDS 10/24/26, row [the bullet lands], rule 120): where the bullet goes, from real recordings, through the guns\' own street, camcorder and tape (tools/bohemia_bullet_lands.py). ONE sprite, lands.mp3: every take of every voice at its own at_s, dur_s long. The game\'s player is engine/bohemia_bullet_lands.js.',
               made='10/24/26', lane='sounds', bpm=120, file='lands.mp3', kbps=64, peak_db_decoded=round(pk, 2), seconds=round(len(sprite) / SR, 2),
               top_loud_100ms_db=G, chain='layers > street canyon %.0f m (an echo every 16th) > camcorder AGC (2 ms / 500 ms / up to +%.0f dB) > tape > VHS band 100 Hz to 10 kHz > cut, a 16th fade > one loudness per voice' % (STREET_R0, AGC_MAX),
               sources=dict(ffsl=dict(library=GH.LIBRARY, windows={b: lic_ffsl[b] for b in sorted(set(crack_ids() + ['%s_0_burst' % t for v in BURSTS.values() for _f, t in v]))}),
                            esc50_cc0={s: dict(what=ESC.get(s, ''), author=lic_esc[s]['author'], freesound=lic_esc[s]['url'], licence=lic_esc[s]['licence']) for s in sorted(set(used_esc)) if s in lic_esc}),
               voices=man_voices)
    json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print('lands.mp3: %d takes, %.1f s, peak %.2f dB' % (len(takes), len(sprite) / SR, pk))
    for name, v in man_voices.items():
        print('  %-16s %s' % (name, [round(tk['loud_100ms_db'], 1) for tk in v['takes']]))

def check():
    man = json.load(open(os.path.join(OUT, 'manifest.json'))); bad = []
    x, sr = sf.read(os.path.join(OUT, man['file']), dtype='float32')
    if 20 * math.log10(np.abs(x).max() + 1e-12) > -0.9: bad.append('the sprite peaks over -1 dBFS')
    for name, v in man['voices'].items():
        if len(v['takes']) < 3: bad.append(name + ' has fewer than three takes')
        for tk in v['takes']:
            a = int(tk['at_s'] * sr); b = a + int(tk['dur_s'] * sr); y = x[a:b]
            end = 20 * math.log10(np.abs(y[-int(0.002 * sr):]).max() + 1e-12)
            if end > -50: bad.append('%s take %d ends at %.1f dB (a click)' % (name, tk['k'], end))
            loud = GH.short_loud_db(y)
            if abs(loud - v['loud_100ms_db']) > 1.5: bad.append('%s take %d is %.1f dB, wants %.1f' % (name, tk['k'], loud, v['loud_100ms_db']))
            if GH.band_share(y, 10000) > 0.05: bad.append('%s take %d: %.3f of its energy above 10 kHz (the VHS band)' % (name, tk['k'], GH.band_share(y, 10000)))
            for l in (tk['layers'] if isinstance(tk['layers'], list) else []):
                s = l['source']
                if s.startswith('ffsl:'):
                    if s[5:] not in man['sources']['ffsl']['windows']: bad.append(name + ': an unbanked window ' + s)
                elif s.split(' ')[0] not in man['sources']['esc50_cc0']: bad.append(name + ': a source with no CC0 line ' + s)
    print('PASS' if not bad else 'FAIL\n  ' + '\n  '.join(bad))
    return not bad

if __name__ == '__main__':
    if '--bank' in sys.argv: make_bank()
    elif '--check' in sys.argv: sys.exit(0 if check() else 1)
    else: render()
