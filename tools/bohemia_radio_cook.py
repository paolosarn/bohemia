#!/usr/bin/env python3
"""BOHEMIA -- THE LAST TRANSMISSIONS, COOKED (RADIO, 11/3/26; rule 353, ask line 367).

  python3 tools/bohemia_radio_cook.py --all        timing from the words, then the fall's sound
  python3 tools/bohemia_radio_cook.py --timing     only write at/key into records/target/bb/radio_lines.json
  python3 tools/bohemia_radio_cook.py --check      lengths, marks and timing; exit 1 on a broken line

THE RADIO IS A REAL HANDHELD'S PHYSICS CARRYING REAL RECORDINGS (records/BOHEMIA_RADIO_ROUND_1_..._11_3_26.md s4).
No CC0 recording of a real handheld's static was reachable from this box, so the static is made the way a handheld
makes it, never as a texture: the receiver's own thermal noise (complex Gaussian, which is what thermal noise is) in a
12.5 kHz channel, a carrier at the post's signal strength, the transmitter's pre-emphasis, deviation limiter and
splatter filter, a phase-difference FM discriminator, a noise squelch whose rectifier holds (the tail after every
key-up is that hold, not an added sound), de-emphasis, the 300 Hz tone filter, a 3 kHz voice band and a small speaker.
Near threshold the discriminator slips 2 pi and throws clicks (Rice's FM click noise), so a weak post crackles and a
strong one goes quiet: the sound reports the signal. Everything that is an OBJECT is a CC0 recording from
reference/library/sound_bank (the talk switch, wind, two far shots, a door, breath, a fire, a civil defence siren),
heard through the transmitter's microphone the way a real one picks up a room. Sources: slices/radio/manifest.json.
"""
import json, math, os, subprocess, sys
import numpy as np
from scipy import signal as sg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES = os.path.join(ROOT, 'records/target/bb/radio_lines.json')
OUT = os.path.join(ROOT, 'slices/radio')
BANK = os.path.join(ROOT, 'reference/library/sound_bank')
FS = 48000
SPANISH = ('mio', 'mia', 'dios', 'madre', 'santa', 'mijo', 'mija', 'quiere', 'ay', 'oye', 'pues', 'hermano', 'ojala', 'gracias', 'bueno', 'vamos')
DEV = 2500.0                 # peak deviation, Hz (12.5 kHz narrowband land mobile)
IF_HZ = 6000.0               # half the channel filter
SEED = 353
SQ_HOLD = 1.6            # s: the squelch rectifier's charge time; with the comparator at 0.62 it closes 127 to 158 ms after the carrier goes (a real handheld's tail: 100 to 250 ms)

# ---- the real recordings (CC0 unless named; the bank's LICENCES.md carries author and Freesound id) ----
SRC = {
    'click':  ('esc50_cc0/2-152895-A-31.flac', 'Mouse click: a microswitch, the same part as a talk switch (davidkyoku, CC0)'),
    'wind':   ('esc50_cc0/3-117504-A-16.flac', 'Wind: winter wind 01a (klangfabrik, CC0)'),
    'wind2':  ('esc50_cc0/5-179496-A-16.flac', 'Wind: 111224_04 wind (toiletrolltube, CC0)'),
    'shot1':  ('ffsl_cc0/A_39_0_far.flac', 'A far shot (The Free Firearm Sound Library, Still North Media, CC0)'),
    'shot2':  ('ffsl_cc0/B_21_0_far.flac', 'A far shot (The Free Firearm Sound Library, Still North Media, CC0)'),
    'knock':  ('esc50_cc0/2-133889-A-30.flac', 'Door knock: large wood door knocking (aroth4, CC0)'),
    'knock2': ('esc50_cc0/5-235644-A-30.flac', 'Door knock (Coonick, CC0)'),
    'breath': ('esc50_cc0/3-112557-A-23.flac', 'Breathing: frightened breathing (nickrave, CC0)'),
    'fire':   ('esc50_cc0/4-181563-A-12.flac', 'Crackling fire 01 (kingsrow, CC0)'),
    'siren':  ('esc50_cc0/1-54084-A-42.flac', 'Siren: civil defense (guitarguy1985, CC0)'),
}


def load(rel, sr=FS):
    p = os.path.join(BANK, rel)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def db(x):
    return 10 ** (x / 20.0)


def rms(x):
    return float(np.sqrt(np.mean(x * x) + 1e-20))


def onsets(x, thr=0.25, gap=0.08):
    """sample indices where a transient starts (for the click and the shots)"""
    env = np.abs(x)
    env = sg.lfilter([1.0], [1.0, -0.995], env) * 0.005
    peak = env.max() or 1.0
    idx, last = [], -10 ** 9
    for i in np.nonzero(env > thr * peak)[0]:
        if i - last > gap * FS:
            idx.append(int(i))
        last = i
    return idx


# ---- the words and the timing ------------------------------------------------------------------------
def words(s):
    return len([w for w in s.replace('{town}', 'Volunteers').split() if w])


def read_ms(text, who, R):
    n = words(text) + len(who.split())
    return math.ceil((R['base_ms'] + R['per_word_ms'] * n) / R['beat_ms']) * R['beat_ms']


def clock(sec):
    sec = int(sec) % 86400
    return '%02d:%02d:%02d' % (sec // 3600, (sec // 60) % 60, sec % 60)


def shown(L, town, i, line):
    """the line as the phone shows it, with every fill at its longest"""
    sk = L['skeleton'][i]
    lab = (L['towns'][town].get('labels') or {}).get(sk['src'], sk['src'])
    say = line['say'].replace('{town}', 'Volunteers' if town == '_plain' else town)
    head = '23:59:59 ' + ('' if sk['src'] == 'PHONE' else lab + '  ')
    return head + say


def timing(L):
    R = L['read']
    who = (L['channel'] + ' VOLUNTEERS')[:L['handle_max']]
    at = 2.0
    for i, sk in enumerate(L['skeleton']):
        sk['at'] = round(at, 2)
        longest = max(read_ms(shown(L, t, i, L['towns'][t]['lines'][i]), who, R) for t in L['towns']) / 1000.0
        if sk['kind'] == 'key':
            plain = L['towns']['_plain']['lines'][i]['say']
            sk['key'] = round(min(6.0, max(1.2, words(plain) / R['words_per_s'] + 0.4)), 2)
            stay = max(longest, sk['key'] + 1.0)
        elif sk['kind'] == 'open':
            stay = max(longest, sk['key'] + 1.0)
        elif sk['kind'] == 'cut':
            stay = max(longest, 3.0)
        else:
            stay = longest
        at += math.ceil(stay / 0.5) * 0.5
    L['length_s'] = round(at + 2.0, 2)
    return L


def check(L):
    bad = []
    n = len(L['skeleton'])
    for town, T in L['towns'].items():
        if T.get('draft') is not True:
            bad.append('%s: the town is not draft:true' % town)
        if len(T['lines']) != n:
            bad.append('%s: %d lines, the skeleton has %d' % (town, len(T['lines']), n))
            continue
        for i, line in enumerate(T['lines']):
            s = shown(L, town, i, line)
            if line.get('draft') is not True:
                bad.append('%s %d: not draft:true' % (town, i + 1))
            if len(s) > L['max_chars']:
                bad.append('%s %d: %d characters (max %d): %s' % (town, i + 1, len(s), L['max_chars'], s))
            if '!' in line['say']:
                bad.append('%s %d: an exclamation mark (R3)' % (town, i + 1))
            if '—' in line['say'] or '–' in line['say']:
                bad.append('%s %d: a dash he never wants' % (town, i + 1))
            low = ' ' + line['say'].lower().replace(',', ' ').replace('.', ' ') + ' '
            if any(' %s ' % w in low for w in SPANISH):
                bad.append('%s %d: Spanglish (rule 355: no new Spanglish line is written)' % (town, i + 1))
            src = L['skeleton'][i]['src']
            if src == 'PHONE' and not (line['say'].startswith('[') or line['say'].startswith('END OF TRANSMISSION')):
                bad.append('%s %d: the phone speaks only in brackets or the end line (R4)' % (town, i + 1))
        if not T['lines'][-1]['say'].startswith('END OF TRANSMISSION'):
            bad.append('%s: the last line is not the phone\'s END OF TRANSMISSION (R4)' % town)
    who = (L['channel'] + ' VOLUNTEERS')
    if len(who) > L['handle_max']:
        bad.append('the handle %r is over %d' % (who, L['handle_max']))
    return bad


# ---- the radio ---------------------------------------------------------------------------------------
class Radio:
    """one receiver listening to one channel for a whole recording; transmissions are keyed onto it"""

    def __init__(self, seconds, rng):
        self.n = int(seconds * FS)
        self.rng = rng
        self.msg = np.zeros(self.n)           # what each transmitter's microphone hears while keyed
        self.amp = np.zeros(self.n)           # carrier amplitude at the receiver (0 = nobody keyed)
        self.tx = []

    def key(self, t0, dur, sig, mic=None, gain=1.0):
        """a transmission: the switch pressed at t0, released at t0+dur, at signal strength sig (0..1)"""
        a, b = int(t0 * FS), int((t0 + dur) * FS)
        b = min(b, self.n)
        # the CNR at the receiver: a strong post 28 dB, the weakest about 6 dB (threshold, where the clicks live)
        cnr = 3.0 + 27.0 * sig
        A = math.sqrt(0.25 * 10 ** (cnr / 10.0))   # the channel filter keeps a quarter of the unit noise power
        ramp = int(0.004 * FS)
        env = np.ones(b - a)
        env[:ramp] = np.linspace(0, 1, ramp)
        env[-ramp:] = np.linspace(1, 0, ramp)
        self.amp[a:b] = np.maximum(self.amp[a:b], A * env)
        if mic is not None:
            m = mic[:b - a] * gain
            self.msg[a:a + len(m)] += m
        self.tx.append((t0, dur, sig))

    def mic(self, t0, x, gain=1.0):
        a = int(t0 * FS)
        x = x[:max(0, self.n - a)] * gain
        self.msg[a:a + len(x)] += x

    def render(self):
        rng = self.rng
        # THE TRANSMITTER: 6 dB/oct pre-emphasis (300 Hz to 3 kHz), the deviation limiter, the splatter filter
        w1, w2 = 2 * math.pi * 300, 2 * math.pi * 3000
        bz, az = sg.bilinear([1 / w1, 1], [1 / w2, 1], FS)
        m = sg.lfilter(bz, az, self.msg)
        m = np.clip(m, -1.0, 1.0)
        sos = sg.butter(6, 3000, 'low', fs=FS, output='sos')
        m = sg.sosfilt(sos, m)
        phase = 2 * math.pi * DEV * np.cumsum(m) / FS
        # THE AIR AND THE FRONT END: thermal noise, complex Gaussian, through the 12.5 kHz channel filter
        noise = (rng.standard_normal(self.n) + 1j * rng.standard_normal(self.n)) / math.sqrt(2)
        sif = sg.butter(8, IF_HZ, 'low', fs=FS, output='sos')
        noise = sg.sosfilt(sif, noise.real) + 1j * sg.sosfilt(sif, noise.imag)
        r = self.amp * np.exp(1j * phase) + noise
        # THE DISCRIMINATOR: the phase step between samples, in units of the peak deviation
        d = np.angle(r[1:] * np.conj(r[:-1])) * FS / (2 * math.pi * DEV)
        d = np.concatenate([[0.0], d])
        # THE NOISE SQUELCH: the noise above the voice band, rectified, held by an RC that rises slower than it falls
        nb = sg.sosfilt(sg.butter(4, [3800, 5600], 'band', fs=FS, output='sos'), d)
        rect = np.abs(nb)
        up, down = 1 - math.exp(-1 / (SQ_HOLD * FS)), 1 - math.exp(-1 / (0.012 * FS))
        det = np.empty(self.n)
        v = float(rect[:int(0.2 * FS)].mean())
        for i in range(self.n):        # a real RC: it charges toward the noise slowly, drains fast when the carrier quiets it
            x = rect[i]
            v += (x - v) * (up if x > v else down)
            det[i] = v
        full = float(np.median(det[self.amp == 0])) if np.any(self.amp == 0) else 1.0
        open_ = np.zeros(self.n, dtype=bool)
        st = False
        for i in range(0, self.n, 48):     # the comparator, with hysteresis, every millisecond
            lvl = det[i] / full
            if st and lvl > 0.62:
                st = False
            elif not st and lvl < 0.42:
                st = True
            open_[i:i + 48] = st
        gate = sg.lfilter([1 - math.exp(-1 / (0.003 * FS))], [1, -math.exp(-1 / (0.003 * FS))], open_.astype(float))
        gate = np.maximum(gate, db(-62))   # the mute transistor is never perfect
        # THE AUDIO: de-emphasis, the 300 Hz tone filter, the 3 kHz band, then the squelch's mute
        a = sg.lfilter(*sg.bilinear([1 / w2, 1], [1 / w1, 1], FS), d)
        a = sg.sosfilt(sg.butter(4, 300, 'high', fs=FS, output='sos'), a)
        a = sg.sosfilt(sg.butter(4, 3000, 'low', fs=FS, output='sos'), a)
        a = a * gate
        # THE SPEAKER: a 40 mm cone, nothing under 450 Hz, a bump near 2.2 kHz, pushed a little hard
        a = sg.sosfilt(sg.butter(2, 450, 'high', fs=FS, output='sos'), a)
        b2, a2 = peak_eq(2200, 1.2, 4.0)
        a = sg.lfilter(b2, a2, a)
        a = a / (np.max(np.abs(a)) + 1e-9)
        a = np.tanh(1.6 * a) / math.tanh(1.6)
        self.gate, self.det, self.disc = gate, det / full, d
        return a


def peak_eq(f0, q, gain_db):
    A = 10 ** (gain_db / 40.0)
    w = 2 * math.pi * f0 / FS
    al = math.sin(w) / (2 * q)
    b = [1 + al * A, -2 * math.cos(w), 1 - al * A]
    a = [1 + al / A, -2 * math.cos(w), 1 - al / A]
    return np.array(b) / a[0], np.array(a) / a[0]


def click_takes(x):
    """the talk switch: the press and the release are two clicks in the recording"""
    on = onsets(x, 0.3, 0.05)
    takes = []
    for i in on[:6]:
        seg = x[max(0, i - int(0.002 * FS)):i + int(0.045 * FS)].copy()
        seg *= np.hanning(len(seg) * 2)[len(seg):] ** 0.3
        takes.append(seg / (np.max(np.abs(seg)) + 1e-9))
    return takes or [np.zeros(10)]


def loop_bed(x, seconds, rng):
    n = int(seconds * FS)
    if len(x) >= n:
        s = int(rng.integers(0, len(x) - n + 1))
        return x[s:s + n].copy()
    reps = int(math.ceil(n / len(x)))
    return np.tile(x, reps)[:n]


def norm(x, target_rms_db):
    return x * (db(target_rms_db) / (rms(x) + 1e-12))


def mic_for(room, dur, S, rng):
    """what the post's microphone hears around the words, at a real distance (rms in dBFS before the transmitter)"""
    n = int(dur * FS)
    out = np.zeros(n)
    if room in ('wind_low', 'wind', 'shots'):
        w = loop_bed(S['wind'] if room != 'wind_low' else S['wind2'], dur, rng)
        out += norm(w, -36 if room == 'wind_low' else -27)
    if room == 'room':
        out += norm(loop_bed(S['fire'], dur, rng), -48)
    if room == 'shots':
        for k, t in ((0, 0.55), (1, 1.15)):
            s = S['shot1' if k == 0 else 'shot2']
            on = onsets(s, 0.3)
            st = on[0] if on else 0
            seg = s[st:st + int(0.9 * FS)]
            seg = seg / (np.max(np.abs(seg)) + 1e-9) * db(-9)
            a = int(t * FS)
            out[a:a + len(seg)] += seg[:max(0, n - a)]
    if room == 'door':
        k = S['knock']
        on = onsets(k, 0.35, 0.12)
        st = on[0] if on else 0
        seg = k[st:st + int(min(2.4, dur) * FS)]
        seg = seg / (np.max(np.abs(seg)) + 1e-9) * db(-7)
        a = int(0.3 * FS)
        out[a:a + len(seg)] += seg[:max(0, n - a)]
    if room == 'open':
        out += norm(loop_bed(S['fire'], dur, rng), -24)
        b = loop_bed(S['breath'], dur, rng)
        out += norm(b, -20)
        sir = loop_bed(S['siren'], dur, rng)
        sir = sg.sosfilt(sg.butter(2, 1800, 'low', fs=FS, output='sos'), sir)   # far: the air takes the top off
        out += norm(sir, -34)
    return out


def press(radio, t0, dur, sig, room, S, clicks, rng):
    """one transmission: the switch, what the mic hears, the release; the carrier for exactly as long as it is held"""
    mic = mic_for(room, dur, S, rng)
    c1 = clicks[int(rng.integers(0, len(clicks)))] * db(-8)
    c2 = clicks[int(rng.integers(0, len(clicks)))] * db(-12)
    mic[:len(c1)] += c1[:len(mic)]
    e = max(0, len(mic) - int(0.06 * FS))
    mic[e:e + len(c2)] += c2[:len(mic) - e]
    radio.key(t0, dur, sig, mic)


def sources():
    S = {k: load(v[0]) for k, v in SRC.items()}
    return S, click_takes(S['click'])


def render_fall(L, S, clicks):
    rng = np.random.default_rng(SEED)
    R = Radio(L['length_s'], rng)
    for sk in L['skeleton']:
        if sk['kind'] == 'key':
            press(R, sk['at'], sk['key'], sk['sig'], sk['room'], S, clicks, rng)
        elif sk['kind'] == 'open':
            press(R, sk['at'], sk['key'], sk['sig'], 'open', S, clicks, rng)
        elif sk['kind'] == 'cut':
            # the carrier lost mid-air: the open mic's carrier simply stops; the squelch hold is the burst
            pass
    a = R.render()
    return a, R


def encode(x, path, sr=22050, kbps=40):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    x = x * 0.89   # -1 dB: room for the encoder's overshoot
    pcm = (np.clip(x, -1, 1) * 32767).astype('<i2').tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(FS), '-ac', '1', '-i', '-',
                    '-ar', str(sr), '-c:a', 'libmp3lame', '-b:a', '%dk' % kbps, path], input=pcm, check=True)


def main():
    args = set(sys.argv[1:]) or {'--check'}
    L = json.load(open(LINES))
    bad = check(L)
    if bad:
        print('RADIO LINES: %d broken' % len(bad))
        for b in bad:
            print('  ' + b)
        sys.exit(1)
    if '--check' in args and len(args) == 1:
        print('RADIO LINES: %d towns x %d lines, all whole, all draft' % (len(L['towns']), len(L['skeleton'])))
        return
    timing(L)
    with open(LINES, 'w') as f:
        json.dump(L, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print('timing: %d lines, %.1f s' % (len(L['skeleton']), L['length_s']))
    if '--timing' in args:
        return
    S, clicks = sources()
    a, R = render_fall(L, S, clicks)
    encode(a, os.path.join(OUT, 'fall.mp3'))
    # every transmission's own numbers, measured off the render (the gate reads them again from the file)
    tx = []
    for sk in L['skeleton']:
        if sk['kind'] not in ('key', 'open'):
            continue
        i0, i1 = int(sk['at'] * FS), int((sk['at'] + sk['key']) * FS)
        body = a[i0 + int(0.3 * FS):i1 - int(0.1 * FS)]
        tail = a[i1:i1 + int(0.4 * FS)]
        g = R.gate[i1:i1 + int(0.6 * FS)]
        tail_ms = float(np.argmax(g < 0.5) / FS * 1000.0) if np.any(g < 0.5) else 600.0
        k = float(np.mean(body ** 4) / (np.mean(body ** 2) ** 2 + 1e-20)) if len(body) > 100 else 0.0
        tx.append({'n': sk['n'], 'sig': sk['sig'], 'body_db': round(20 * math.log10(rms(body) + 1e-9), 1),
                   'tail_db': round(20 * math.log10(rms(tail) + 1e-9), 1), 'tail_ms': round(tail_ms),
                   'kurtosis': round(k, 2)})
    idx = {
        '_readme': 'THE LAST TRANSMISSIONS, WHAT THE GAME READS (RADIO 11/3/26, tools/bohemia_radio_cook.py): the fall\'s one '
                   'recording, the skeleton it was rendered from (records/target/bb/radio_lines.json), the heard gain and '
                   'every transmission\'s measured numbers. No voice in it, ever (rule 353g): the words are the phone\'s.',
        'made': '11/3/26', 'file': 'fall.mp3', 'length_s': L['length_s'], 'db': -10.0,
        'skeleton': [{k: sk[k] for k in ('n', 'src', 'kind', 'at', 'key', 'sig') if k in sk} for sk in L['skeleton']],
        'measured': tx
    }
    json.dump(idx, open(os.path.join(OUT, 'index.json'), 'w'), indent=1)
    man = {'_readme': 'THE LAST TRANSMISSIONS: every recording the radio carries. The static, the squelch and its tail are '
                      'the receiver\'s physics (tools/bohemia_radio_cook.py, class Radio), not a recording and not a filter '
                      'on noise; a CC0 recording of a real handheld replaces them when a machine can reach Freesound.',
           'objects': {k: {'file': 'reference/library/sound_bank/' + v[0], 'what': v[1]} for k, v in SRC.items()}}
    json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print('fall: %s, %.1f s' % (os.path.join(OUT, 'fall.mp3'), len(a) / FS))
    for t in tx:
        print('  tx %(n)2d sig %(sig).2f  body %(body_db)6.1f dB  tail %(tail_db)6.1f dB %(tail_ms)4d ms  kurtosis %(kurtosis)6.2f' % t)


if __name__ == '__main__':
    main()
