#!/usr/bin/env python3
"""
BOHEMIA - THE PUNCH HEARD (SOUNDS 11/3/26, ask line 266, Paolo 11/2: 'nothing feels punchy yet, satisfying punchy, not from
the music to the combat to the walking around the city to the camp').

WHAT WAS SILENT OR SYNTHETIC, MEASURED FIRST on the real demo at phone size (tools/bohemia_sounds_every_event_heard.js,
records/BOHEMIA_SOUNDS_THE_PUNCH_11_3_26.md): the guns, the bullet landings and the deaths were already real recordings
(BULLET, DEATH); a blade or a pipe landing, its swing, a swing that misses, a man struck down by a blow, a body hitting the
floor on the fall's last key, the high ground, every robot sound, the road event, the boss found, camp, they come, and every
button on the phone were either SILENT or an oscillator. This cuts all of them from real recordings, CC0 at the source, the
same bank and the same chain as tools/bohemia_from_a_recording.py (REUSE-FIRST: its stages are imported, never copied):

  FIGHT (dry and close, a short tape, the blow first: a punch is a transient, so every take starts on its loudest 5 ms)
    blunt       a pipe or a fist in a man: a carpet step slowed (the body taking it), a clap (the slap of skin), a large
                door knocked far under them (only its mass)
    blade       a cut: one stroke of a real hand saw quickened to a slash, the clap's slap, a wet foot on tile
    swing       the air a swing moves: a real sport breath out, quickened, and the top of a winter wind gust
    scuff       a swing that misses: a foot thrown aside on real gravel
    hurt_body   a blow on one of HIS: the blunt blow close, and his breath knocked out of him
    down        struck down by a blow: a knee on a factory floor, a door's closing thump for the body, a frightened breath in
    thud        the body landing on the fall's last key (COMBAT's kick): the door's thump slowed, gravel under it
    high        he takes the roof: a wood ladder's creak and a boot on concrete
    (no step for a man: his DOWN on REAL SHOES IN THE FIGHT, 10/18, stands; the fight keeps its own)
  THE ROBOT (COORDINATOR note 8: 'the robot he loved goes in the game')
    metal_step  a heavy step on a factory floor, the steel between two train wagons under it, a relay's tick
    servo       a real vacuum motor's whine glided up like a joint turning, a clock's relay at the end
    machine_hit a blow on steel: the wagons' steel struck, a relay inside it, a wind-up clock's bell touched (no can: his DOWN
                on A CAN ON THE COUNTER, 10/5)
    machine_fall the motor winding down to nothing, the coupling slam, glass and steel going everywhere
  THE MAP (nothing loud on the map: the marks sit under the fight's)
    road_stop   the road stops you: a church clock's bell struck once at half speed, a deck's key going down (no tape
                slip: his DOWN on THE TAPE IS SLIPPING, 9/23)
    boss_found  the boss is marked: a real civil-defence siren's wind-up at half speed, far, in a hall, the bell under it
    they_come   they come: two heavy knocks on a wood door, one a beat, and something breathing
    camp_make   the fire catches: real fire crackling coming up
    camp_break  camp breaks, the hours roll: the fire dying, a boot kicking gravel over it, a clock's ticks run fast
  THE PHONE (rule 301, Crashbox: rubber bands, gears, junk; dry, small, close)
    phone_tap   a real mouse button and a clock's gear tooth
    phone_open  a gear train run (the Yantar clock's ticks, quickened), a rubber band plucked (a physical string model:
                Karplus-Strong, a slack band's pitch falling), a button's click
    phone_close the gears slowing, a latch's click

  python3 tools/bohemia_sounds_the_punch.py           # renders slices/fight_punch/punch.mp3 and manifest.json
  then: node tools/bohemia_sounds_the_punch_level.js  # the gain of every voice through the game's own chain -> index.json
"""
import json, os, subprocess, sys, tempfile
import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bohemia_from_a_recording as FR   # noqa: E402  (its stages: load, window, speed, hp, lp, tape, room, limit)

ROOT = FR.ROOT
SR = FR.SR
OUT = os.path.join(ROOT, 'slices', 'fight_punch')
GAP = 0.12
SRC = FR.load_sources()


def onsets(x, n, gap=0.18, jump=9.0):
    """The n strongest attacks in a clip (10 ms frames: the jump over the 40 ms before it), at least `gap` s apart."""
    w = int(SR * 0.01); m = len(x) // w
    db = 20 * np.log10(np.sqrt((x[:m * w].reshape(m, w) ** 2).mean(1)) + 1e-9)
    cand = []
    for i in range(4, m):
        j = db[i] - db[i - 4:i].mean()
        if j > jump: cand.append((db[i] + 0.5 * j, i * 0.01))
    cand.sort(reverse=True); out = []
    for _, t in cand:
        if all(abs(t - u) > gap for u in out): out.append(t)
        if len(out) >= n: break
    return sorted(out)


def hit(stem, k, dur, spd=1.0, pre=0.004, n=6, jump=9.0):
    """The k-th strongest attack of a clip, cut at its attack, at a speed (the tape way: slower is heavier)."""
    x = FR.load(stem); on = onsets(x, n, jump=jump)
    if not on: raise SystemExit('no attack found in ' + stem)
    t = on[k % len(on)]
    y = FR.window(x, max(0.0, t - pre), min(len(x) / SR, t + dur / spd + 0.01), fi=0.0015, fo=min(0.06, dur * 0.4))
    return FR.speed(y, spd)


def slam(stem, dur, spd=1.0, pre=0.004):
    """The clip's loudest moment (a door's closing thump is its slam, not the latch before it), cut at its attack."""
    x = FR.load(stem); i = int(np.abs(x).argmax()); t = i / SR
    y = FR.window(x, max(0.0, t - pre), min(len(x) / SR, t + dur / spd), fi=0.0015, fo=min(0.06, dur * 0.4))
    return FR.speed(y, spd)


def span(stem, a, b, spd=1.0, fi=0.01, fo=0.08):
    x = FR.load(stem)
    return FR.speed(FR.window(x, a, b, fi=fi, fo=fo), spd)


def glide(x, r0, r1):
    """A time-varying resample: the speed runs from r0 to r1 over the clip (a motor turning, a tape stopping)."""
    n = len(x); out_len = int(n / ((r0 + r1) / 2.0))
    rate = np.linspace(r0, r1, out_len)
    pos = np.cumsum(rate); pos = pos[pos < n - 1]
    return np.interp(pos, np.arange(n), x).astype(np.float32)


def band(f0, f1, dur, damp=0.996, bright=0.5, seed=7):
    """A rubber band plucked: Karplus-Strong (a string's travelling wave in a delay line, averaged as it loses energy),
    the delay lengthening as the slack band's pitch falls. Physics, not an oscillator: the tone is the string's own."""
    rng = np.random.default_rng(seed); n = int(dur * SR)
    L0 = SR / f0; buf = (rng.uniform(-1, 1, int(SR / min(f0, f1)) + 4) * 0.5).astype(np.float64)
    out = np.zeros(n, dtype=np.float32); ptr = 0.0; size = len(buf); prev = 0.0
    for i in range(n):
        f = f0 + (f1 - f0) * min(1.0, i / (0.35 * n)); L = SR / f
        r = ptr - L
        while r < 0: r += size
        i0 = int(r) % size; fr = r - int(r)
        y = buf[i0] * (1 - fr) + buf[(i0 + 1) % size] * fr
        z = damp * (bright * y + (1 - bright) * prev); prev = y
        buf[int(ptr) % size] = z; ptr = (ptr + 1) % size
        out[i] = y
    out *= np.exp(-np.arange(n) / (0.12 * SR)).astype(np.float32)
    return out


def mix(layers):
    """[(audio, at_s, db)] summed onto one take."""
    end = max(int(at * SR) + len(y) for y, at, _ in layers)
    out = np.zeros(end, dtype=np.float32)
    for y, at, db in layers: FR.place(out, y, at, db)
    return out


def finish(x, lo=90.0, hi=9000.0, tape=1.0, rm=None, wet=0.0, tail=0.03):
    y = FR.hp(x, lo); y = FR.tape(y, tape) if tape > 0 else y; y = FR.lp(y, hi)
    if rm: y = FR.room(y, rm, wet)
    # trim the room's silent end, keep a short fade
    a = np.abs(y); idx = np.where(a > a.max() * 0.004)[0]; endi = min(len(y), (idx[-1] if len(idx) else len(y) - 1) + int(tail * SR))
    y = y[:endi].copy(); fo = min(len(y) // 3, int(0.04 * SR)); y[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)
    return FR.norm_peak(FR.limit(y, -1.0), -3.0)


# ---- THE RECIPE: every take is a function of its take number k -----------------------------------------------------------
KNOCK, CLAP, CARPET, SAW, WET = '2-133889-A-30', ['2-76408-B-22', '2-76408-C-22', '2-76408-D-22'], '5-234855-A-25', '1-9886-A-49', '1-51147-A-25'
BREATH_OUT, SPORT, WIND, GRAVEL = '2-54961-A-23', '5-238492-A-23', '3-117504-A-16', '3-94344-A-25'
FACTORY, DOOR_SHUT, FRIGHT, ASPHALT, CREAK = '1-155858-B-25', '2-118624-A-30', '3-112557-A-23', '3-94343-A-25', '4-107120-A-33'
STEEL, RELAY, VACUUM, CAN, CAN_DOWN, ALARM = ['4-165845-A-45', '4-165845-B-45'], '3-171041-A-38', '5-231551-A-36', '2-144031-A-34', '5-252248-A-34', '2-131943-A-38'
GLASS, BELL, SIREN, WOLF, FIRE, CLICK, TOOTH = '4-204777-A-39', '5-219044-A-46', '1-54084-A-42', '5-261464-A-23', '4-181563-A-12', '2-152895-A-31', '1-62849-A-38'


def blunt(k): return finish(mix([(hit(CARPET, k, 0.24, spd=0.66), 0.0, 0), (hit(CLAP[k % 3], 0, 0.12, spd=0.85), 0.002, -1),
                                  (hit(KNOCK, k, 0.26, spd=0.62), 0.004, -7)]), lo=60, tape=1.0)   # the body first; the knock only its mass (his 'wood glass bottle' ruling)
def blade(k): return finish(mix([(hit(SAW, k, 0.16, spd=1.6, jump=6), 0.0, 0), (hit(CLAP[(k + 1) % 3], 0, 0.1), 0.012, -3),
                                  (hit(WET, k, 0.14), 0.02, -6)]), lo=140, tape=1.0)
def swing(k): return finish(mix([(hit(SPORT, k, 0.2, spd=1.7, pre=0.03, jump=5), 0.0, 0),
                                  (FR.hp(span(WIND, 0.6 + k * 1.1, 1.0 + k * 1.1, spd=2.0, fi=0.05, fo=0.08), 600), 0.0, -6)]), lo=300, hi=7500, tape=0.6)
def scuff(k): return finish(hit(GRAVEL, k, 0.18, spd=1.25, jump=5), lo=150, tape=0.8)
def hurt_body(k): return finish(mix([(blunt(k), 0.0, 0), (span(BREATH_OUT, *[(0.0, 0.5), (1.0, 1.5)][k % 2], spd=1.2), 0.05, -7)]), lo=70, tape=0.5)
def down(k): return finish(mix([(hit(FACTORY, k, 0.3, spd=0.85), 0.0, 0), (slam(DOOR_SHUT, 0.4, spd=0.8 - 0.04 * k), 0.14, -1),
                                 (span(FRIGHT, *[(0.0, 0.8), (1.2, 2.0)][k % 2]), 0.28, -8)]), lo=60, tape=1.0, rm='shed', wet=0.12)
def thud(k): return finish(mix([(slam(DOOR_SHUT, 0.25, spd=0.76 - 0.05 * k), 0.0, 0), (hit(GRAVEL, k, 0.1, spd=0.75, jump=5), 0.012, -6)]), lo=50, tape=1.0)
def high(k): return finish(mix([(span(CREAK, 0.25 + 0.7 * k, 0.6 + 0.7 * k, spd=1.2), 0.0, -2), (hit(FACTORY, k + 2, 0.25), 0.22, 0)]), lo=120, tape=1.0)
def metal_step(k): return finish(mix([(hit(FACTORY, k + 3, 0.3, spd=0.7), 0.0, 0), (hit(STEEL[k % 2], k, 0.2, spd=0.85), 0.004, -4),
                                       (hit(RELAY, k, 0.06), 0.09, -10)]), lo=60, tape=1.0)
def servo(k):
    m = FR.hp(span(VACUUM, 0.6 + 0.4 * k, 1.05 + 0.4 * k, fi=0.04, fo=0.08), 250)
    return finish(mix([(glide(m, 0.75 + 0.05 * k, 1.35 + 0.05 * k), 0.0, 0), (hit(RELAY, k + 1, 0.06), 0.33, -6)]), lo=200, tape=0.8)
def machine_hit(k): return finish(mix([(hit(STEEL[k % 2], k, 0.32), 0.0, 0), (hit(RELAY, k + 2, 0.06, spd=0.8), 0.003, -6),
                                        (hit(ALARM, k, 0.4, jump=6), 0.01, -12), (hit(KNOCK, k, 0.2, spd=0.8), 0.0, -6)]), lo=90, tape=1.0, rm='shed', wet=0.15)
def machine_fall(k):
    m = FR.hp(span(VACUUM, 1.5 + 0.6 * k, 2.4 + 0.6 * k, fi=0.02, fo=0.2), 120)
    return finish(mix([(glide(m, 1.0, 0.3), 0.0, -2), (hit(STEEL[k % 2], k + 2, 0.5, spd=0.7), 0.42, 0), (hit(GLASS, k, 0.5), 0.47, -9),
                       (hit(STEEL[(k + 1) % 2], k + 1, 0.3, spd=0.8), 0.62, -5)]), lo=60, tape=1.0, rm='shed', wet=0.15)
def road_stop(k):
    b = span(BELL, 0.15, 1.6, spd=0.5, fi=0.005, fo=0.3)
    return finish(mix([(hit(CLICK, 0, 0.12, spd=0.5), 0.0, -4), (b, 0.06, 0)]), lo=60, hi=5000, tape=1.4, rm='hall', wet=0.3)
def boss_found(k):
    s = FR.lp(span(SIREN, 0.0, 2.2, spd=0.5, fi=0.4, fo=0.6), 2200)
    return finish(mix([(span(BELL, 0.15, 2.0, spd=0.5, fi=0.005, fo=0.4), 0.0, -3), (s, 0.25, 0)]), lo=50, hi=4500, tape=1.4, rm='hall', wet=0.5)
def they_come(k):
    a = hit(KNOCK, 0, 0.4, spd=0.62); b = hit(KNOCK, 1, 0.4, spd=0.6)
    return finish(mix([(a, 0.0, 0), (b, 0.5, 0), (FR.lp(span(WOLF, 0.4, 1.8, spd=0.85), 2500), 0.15, -11)]), lo=50, hi=6000, tape=1.2, rm='bar', wet=0.2)
def camp_make(k):
    f = span(FIRE, 0.5, 2.3, fi=0.6, fo=0.3)
    return finish(mix([(hit(GRAVEL, 0, 0.2, spd=0.8), 0.0, -6), (f, 0.1, 0)]), lo=120, hi=7000, tape=0.8)
def camp_break(k):
    f = span(FIRE, 2.5, 3.6, fi=0.02, fo=0.7)
    ticks = np.concatenate([hit(RELAY, i, 0.05) for i in range(6)]); ticks = FR.speed(ticks, 1.8)
    return finish(mix([(f, 0.0, -2), (hit(GRAVEL, 2, 0.3, spd=0.85), 0.35, 0), (ticks, 0.5, -6)]), lo=120, hi=7000, tape=0.8)
def phone_tap(k): return finish(mix([(hit(CLICK, k, 0.06), 0.0, 0), (hit(TOOTH, k, 0.05, spd=1.2), 0.004, -6)]), lo=300, tape=0.3)
def phone_open(k):
    gears = np.concatenate([hit(RELAY, i, 0.035, spd=1.5) for i in range(5)])
    return finish(mix([(gears, 0.0, -2), (band(118, 92, 0.45), 0.16, -3), (hit(CLICK, 1, 0.06), 0.15, -6)]), lo=150, tape=0.3)
def phone_close(k):
    gears = np.concatenate([np.concatenate([hit(RELAY, i, 0.035, spd=1.5), np.zeros(int(SR * 0.012 * i), dtype=np.float32)]) for i in range(4)])
    return finish(mix([(gears, 0.0, -2), (hit(CLICK, 2, 0.08, spd=0.7), 0.2, -3)]), lo=150, tape=0.3)

VOICES = [  # name, takes, maker, the sources it reads
    ('blunt', 3, blunt, [KNOCK] + CLAP + [CARPET]), ('blade', 3, blade, [SAW, WET] + CLAP), ('swing', 3, swing, [SPORT, WIND]),
    ('scuff', 3, scuff, [GRAVEL]), ('hurt_body', 2, hurt_body, [KNOCK, BREATH_OUT] + CLAP + [CARPET]), ('down', 2, down, [FACTORY, DOOR_SHUT, FRIGHT]),
    ('thud', 3, thud, [DOOR_SHUT, GRAVEL]), ('high', 2, high, [CREAK, FACTORY]),
    ('metal_step', 3, metal_step, [FACTORY, RELAY] + STEEL), ('servo', 3, servo, [VACUUM, RELAY]),
    ('machine_hit', 3, machine_hit, STEEL + [RELAY, ALARM, KNOCK]), ('machine_fall', 2, machine_fall, [VACUUM, GLASS] + STEEL),
    ('road_stop', 1, road_stop, [BELL, CLICK]), ('boss_found', 1, boss_found, [SIREN, BELL]), ('they_come', 1, they_come, [KNOCK, WOLF]),
    ('camp_make', 1, camp_make, [FIRE, GRAVEL]), ('camp_break', 1, camp_break, [FIRE, GRAVEL, RELAY]),
    ('phone_tap', 3, phone_tap, [CLICK, TOOTH]), ('phone_open', 1, phone_open, [RELAY, CLICK]), ('phone_close', 1, phone_close, [RELAY, CLICK]),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    parts, at, man = [], 0.0, {'_readme': 'THE PUNCH HEARD (SOUNDS 11/3/26): every voice\'s takes in punch.mp3 and the CC0 recordings each is cut from (tools/bohemia_sounds_the_punch.py). The game reads index.json (the gains, tools/bohemia_sounds_the_punch_level.js).',
                               'file': 'punch.mp3', 'voices': {}, 'sources': {}}
    for name, n, fn, srcs in VOICES:
        takes = []
        for k in range(n):
            y = fn(k)
            parts.append(y); takes.append({'at_s': round(at, 4), 'dur_s': round(len(y) / SR, 4)})
            gap = np.zeros(int(GAP * SR), dtype=np.float32); parts.append(gap)
            at += (len(y) + len(gap)) / SR
        man['voices'][name] = {'takes': takes, 'sources': sorted(set(srcs))}
        for s in srcs:
            d = SRC.get(s)
            if not d or d.get('licence') != 'CC0': raise SystemExit(s + ' is not a frozen CC0 source: refused')
            man['sources'][s] = {k: d[k] for k in ('category', 'source', 'author', 'url', 'licence')}
        print('  %-13s %d take(s), %.2f s' % (name, n, takes[-1]['dur_s']))
    allx = np.concatenate(parts)
    with tempfile.TemporaryDirectory() as td:
        wav = os.path.join(td, 'punch.wav'); sf.write(wav, allx, SR, subtype='PCM_16')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-ac', '1', '-ar', '44100', '-b:a', '64k', os.path.join(OUT, 'punch.mp3')], check=True)
    json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print('punch.mp3 %.1f s, %d KB' % (at, os.path.getsize(os.path.join(OUT, 'punch.mp3')) // 1024))


if __name__ == '__main__':
    main()
