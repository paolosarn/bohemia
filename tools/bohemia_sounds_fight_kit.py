#!/usr/bin/env python3
"""THE FIGHT'S KIT (SOUNDS [the fight's music you can hear] + [three intensities in every song], rules 166(e), 167, 168).

PAOLO 10/25, playing a fight: 'I only hear the sound effects... I'm not hearing any music... it doesn't have tempo,
doesn't have BPM, doesn't intensify'; 'all this music so far is great ambience but it's not great combat music'.

MEASURED FIRST (tools/bohemia_sounds_fight_music_measure.js, the demo, a road fight on AUTO): the song played the whole
fight, 9.4 dB UNDER the effects, and its 120 BPM pulse read 1.03 (the 500 ms fold against two periods that are not the
beat: no beat at all). The reason is in his engine's own kit: drumV 'thud' is a 70 to 48 Hz sine for 70 ms and 'boom'
the same family, a kick a phone speaker cannot play, and the hats are 15 to 45 ms ticks at 0.03 to 0.05. On a phone his
songs have no drum.

SO THE FIGHT GETS A REAL KIT, AND IT IS RECORDED (166(e): 'more instruments, from real material', NO SAND). Every hit
below is a real drum struck in a room: the Versilian Studios Chamber Orchestra 2, Community Edition (VSCO-2-CE, Sam
Gossner and Simon Dalzell, CC0 1.0, github.com/sgossner/VSCO-2-CE): a muted concert bass drum, two orchestral snares, two
tenor drums, a giant hand drum, a shaker, a tambourine, a brake drum, an anvil, claves, timpani, a clash and a suspended
cymbal. The bass drum's beater and body sit at 80 Hz to 4 kHz, where a phone plays.

ANALOG HORROR AT THE SOURCE (rule 9/20), never a filter over the song: each hit through the same worn tape once, baked
(a soft tanh drive, a head bump at 110 Hz, the top rolled off at 8.5 kHz). No noise is added. Nothing else.

  python3 tools/bohemia_sounds_fight_kit.py [--src <a VSCO-2-CE checkout>]
writes slices/music_kit/fight_kit.mp3 (the sprite) and slices/music_kit/fight_kit.json (where each hit starts, its
length, and the pitch of the tuned ones), and keeps the trimmed hits as FLAC in reference/library/sound_bank/vsco2ce_cc0/
with the CC0 notice, so the sprite rebuilds with no network.
"""
import json, os, subprocess, sys, tempfile
import numpy as np
import soundfile as sf
from scipy.signal import butter, lfilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference/library/sound_bank/vsco2ce_cc0')
OUT = os.path.join(ROOT, 'slices/music_kit')
SR = 44100

# name: (source path in VSCO-2-CE, seconds kept, tuned?)
KIT = {
  'kick':      ('VSCO 1 Percussion/drums/bass/bdrum_muted_fff_1.wav', 0.42, False),
  'kick_f':    ('VSCO 1 Percussion/drums/bass/bdrum_muted_ff_1.wav', 0.42, False),
  'kick_mf':   ('VSCO 1 Percussion/drums/bass/bdrum_muted_mf_1.wav', 0.40, False),
  'kick_p':    ('VSCO 1 Percussion/drums/bass/bdrum_muted_pp_1.wav', 0.38, False),
  'kick_pp':   ('VSCO 1 Percussion/drums/bass/bdrum_muted_ppp_1.wav', 0.36, False),
  'boom':      ('VSCO 1 Percussion/drums/bass/bdrum_f_1.wav', 1.30, False),
  'snare':     ('VSCO 1 Percussion/drums/snare/drum1/snare1_ff_1.wav', 0.30, False),
  'snare_f':   ('VSCO 1 Percussion/drums/snare/drum1/snare1_f_1.wav', 0.30, False),
  'snare_mp':  ('VSCO 1 Percussion/drums/snare/drum1/snare1_mp_1.wav', 0.24, False),
  'ghost':     ('VSCO 1 Percussion/drums/snare/drum1/snare1_ppp_1.wav', 0.20, False),
  'rimshot':   ('VSCO 1 Percussion/drums/snare/drum1/snare1_rimshot_f.wav', 0.26, False),
  'click':     ('VSCO 1 Percussion/drums/snare/drum1/snare1_click.wav', 0.14, False),
  'click2':    ('VSCO 1 Percussion/drums/snare/drum1/snare1_click2.wav', 0.13, False),
  'snareoff':  ('VSCO 1 Percussion/drums/snare/drum1/snare1_nosnare_f_2.wav', 0.30, True),
  'oldsnare':  ('VSCO 1 Percussion/drums/snare/OldSnare/snare_f.wav', 0.22, False),
  'oldsnare_p':('VSCO 1 Percussion/drums/snare/OldSnare/snare_mf.wav', 0.16, False),
  'oldrim':    ('VSCO 1 Percussion/drums/snare/OldSnare/snare_rim.wav', 0.14, False),
  'snare2':    ('Percussion/Snare2-HitSN_v9_rr1_Sum.wav', 0.26, False),
  'snare2_p':  ('Percussion/Snare2-HitSN_v5_rr1_Sum.wav', 0.20, False),
  'tom_lo':    ('VSCO 1 Percussion/drums/tenor/tenor_lower/tenor_ff_1.wav', 0.55, True),
  'tom_lo_p':  ('VSCO 1 Percussion/drums/tenor/tenor_lower/tenor_mf_1.wav', 0.55, True),
  'tom_hi':    ('VSCO 1 Percussion/drums/tenor/tenor_higher/tenorH_ff_1.wav', 0.50, True),
  'tom_hi_p':  ('VSCO 1 Percussion/drums/tenor/tenor_higher/tenorH_mf_1.wav', 0.50, True),
  'shk1':      ("VSCO 1 Percussion/varWood/Camo's Shaker/shake1.wav", 0.17, False),
  'shk2':      ("VSCO 1 Percussion/varWood/Camo's Shaker/shake2.wav", 0.17, False),
  'shk3':      ("VSCO 1 Percussion/varWood/Camo's Shaker/shake3.wav", 0.22, False),
  'shk4':      ("VSCO 1 Percussion/varWood/Camo's Shaker/shake4.wav", 0.15, False),
  'war':       ('VSCO 1 Percussion/drums/other/ethnic/giant/mallet/EthnicLargeMallet_hit_ff_1.wav', 0.45, True),
  'war_stick': ('VSCO 1 Percussion/drums/other/ethnic/giant/sticks/EthnicLargeSticks_hit_f_1.wav', 0.32, False),
  'war_hand':  ('VSCO 1 Percussion/drums/other/ethnic/giant/hand/EthnicLargeHand_hit_f_1.wav', 0.34, False),
  'crash':     ('VSCO 1 Percussion/varMetal/Cymbals/clash/crash_hit_ff_tight.wav', 1.40, False),
  'crash_p':   ('VSCO 1 Percussion/varMetal/Cymbals/clash/crash_hit_mp_loose.wav', 2.20, False),
  'metal':     ('VSCO 1 Percussion/varMetal/Cymbals/susp/susp_hit_metal_2_mf.wav', 0.70, False),
  'scrape':    ('VSCO 1 Percussion/varMetal/Cymbals/susp/susp_FX_scrape_1.wav', 1.70, False),
  'swell':     ('VSCO 1 Percussion/varMetal/Cymbals/susp/susp_hit_softmall_roll2_cresc.wav', 0.0, False),   # 0: to its peak
  'brake':     ('Percussion/BrakeDrum1_Hammer_v3_Sum.wav', 0.34, False),
  'brake_mf':  ('Percussion/BrakeDrum1_Hammer_v2_Sum.wav', 0.32, False),
  'brake_p':   ('Percussion/BrakeDrum1_Hammer_v1_Sum.wav', 0.30, False),
  'anvil':     ('Percussion/Anvil_Hit1_v2_Sum.wav', 0.42, True),
  'anvil_p':   ('Percussion/Anvil_Hit1_v1_Sum.wav', 0.40, True),
  'clave':     ('Percussion/Claves1_Hit_v1_rr1_Sum.wav', 0.16, False),
  'tamb':      ('Percussion/Tamb1-Hit_v2_rr1_Sum.wav', 0.28, False),
  'tamb_p':    ('Percussion/Tamb1-Hit_v1_rr1_Sum.wav', 0.26, False),
  'tshake':    ('Percussion/Tamb1-Shake_v1_rr1_Sum.wav', 0.30, False),
  'timp_lo':   ('Percussion/Timpani/Timpani2_Hit_v3_rr1_Sum.wav', 1.40, True),
  'timp_hi':   ('Percussion/Timpani/Timpani4_Hit_v3_rr1_Sum.wav', 1.10, True),
  'triangle':  ('Percussion/Triangle3-HitM_v1_rr1_Sum.wav', 0.28, False),
}


def tape(x):
    """the worn tape, once, at the source: a soft drive, a head bump, the top rolled off"""
    pk = np.max(np.abs(x)) + 1e-9
    y = x / pk
    y = np.tanh(1.5 * y) / np.tanh(1.5)
    b, a = butter(2, 8500 / (SR / 2), 'low'); y = lfilter(b, a, y)
    # head bump: a little band at 110 Hz added back
    b, a = butter(2, [80 / (SR / 2), 150 / (SR / 2)], 'band'); y = y + 0.25 * lfilter(b, a, y)
    b, a = butter(1, 30 / (SR / 2), 'high'); y = lfilter(b, a, y)
    return y


def pitch(x):
    """the strongest partial under 1 kHz in the first 300 ms after the attack, for retuning a drum to the song's key"""
    seg = x[int(0.02 * SR):int(0.32 * SR)]
    if len(seg) < 2048: return None
    w = np.hanning(len(seg)); F = np.abs(np.fft.rfft(seg * w, 1 << 16)); fr = np.fft.rfftfreq(1 << 16, 1 / SR)
    band = (fr > 40) & (fr < 1000)
    return float(fr[band][np.argmax(F[band])])


def load(src, rel):
    p = os.path.join(src, rel) if src else None
    if p and os.path.exists(p):
        x, sr = sf.read(p, always_2d=True)
        assert sr == SR, (rel, sr)
        return x.mean(1)
    return None


def main():
    src = None
    a = sys.argv[1:]
    if '--src' in a: src = a[a.index('--src') + 1]
    os.makedirs(BANK, exist_ok=True); os.makedirs(OUT, exist_ok=True)
    pieces, index, cur = [], {}, 0.12
    gap = np.zeros(int(0.12 * SR))
    pieces.append(gap)
    for name, (rel, keep, tuned) in KIT.items():
        flac = os.path.join(BANK, name + '.flac')
        x = load(src, rel)
        if x is not None:
            a_ = np.abs(x); on = int(np.argmax(a_ > a_.max() * 0.06)); on = max(0, on - int(0.004 * SR))
            if keep == 0.0:   # the swell: from its start to its loudest moment
                env = np.convolve(a_, np.ones(2048) / 2048, 'same'); keep = (int(np.argmax(env)) - on) / SR + 0.12
            y = x[on:on + int(keep * SR)].copy()
            n = len(y); f = min(int(0.03 * SR), n // 4)
            y[-f:] *= np.linspace(1, 0, f) ** 2
            sf.write(flac, (y / (np.max(np.abs(y)) + 1e-9) * 0.97).astype(np.float32), SR, subtype='PCM_16')
        y, _ = sf.read(flac)
        z = tape(y)
        z = z / (np.max(np.abs(z)) + 1e-9) * 0.89   # -1 dB
        hz = pitch(z) if tuned else None
        index[name] = {'at': round(cur, 5), 'dur': round(len(z) / SR, 4), 'rms': round(float(20 * np.log10(np.sqrt(np.mean(z[:int(0.1 * SR)] ** 2)) + 1e-9)), 2)}
        if hz: index[name]['hz'] = round(hz, 2)
        pieces.append(z); pieces.append(gap); cur += len(z) / SR + len(gap) / SR
    allx = np.concatenate(pieces).astype(np.float32)
    with tempfile.TemporaryDirectory() as td:
        w = os.path.join(td, 'kit.wav'); sf.write(w, allx, SR, subtype='PCM_16')
        mp3 = os.path.join(OUT, 'fight_kit.mp3')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', w, '-ac', '1', '-ar', str(SR), '-codec:a', 'libmp3lame', '-b:a', '112k', mp3], check=True)
    meta = {'what': "the fight's kit: real drums struck in a room (VSCO-2-CE, CC0 1.0), one worn tape at the source",
            'source': 'https://github.com/sgossner/VSCO-2-CE (CC0 1.0 Universal), Sam Gossner and Simon Dalzell',
            'sr': SR, 'seconds': round(len(allx) / SR, 3), 'hits': index,
            'note': 'at = where the hit starts in the decoded sprite (seconds); the player finds the true onset within 60 ms of it'}
    json.dump(meta, open(os.path.join(OUT, 'fight_kit.json'), 'w'), indent=1)
    notice = os.path.join(BANK, 'NOTICE.txt')
    with open(notice, 'w') as fh:
        fh.write('VSCO-2-CE (Versilian Studios Chamber Orchestra 2, Community Edition)\n'
                 'Recorded by Sam Gossner and Simon Dalzell; sample cutting by Elan Hickler/Soundemote.\n'
                 'License: CC0 1.0 Universal (public domain dedication). https://github.com/sgossner/VSCO-2-CE\n'
                 'The files here are trimmed mono cuts of the originals, peak-normalised, for the game\'s fight kit.\n\n')
        for name, (rel, keep, tuned) in KIT.items(): fh.write('%-11s <- %s\n' % (name, rel))
    print(json.dumps({'hits': len(index), 'seconds': meta['seconds'], 'mp3_kb': os.path.getsize(os.path.join(OUT, 'fight_kit.mp3')) // 1024,
                      'tuned': {k: v['hz'] for k, v in index.items() if 'hz' in v}}, indent=1))


if __name__ == '__main__':
    main()
