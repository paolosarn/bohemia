#!/usr/bin/env python3
"""THE WAY IN, BEFORE AND NOW, SIDE BY SIDE (COMBAT FIVE 11/26/26, VAMILY rule 484(b)).
Two recordings made by tools/bohemia_combat_five_the_way_in_record.js (the same phone, the CPU slowed 4x, the same steps) laid
side by side at their real speed: the way in lined up on the ENGAGE tap, the way home lined up on the LEAVE tap.
  python3 tools/bohemia_combat_five_side_by_side.py <before_dir> <now_dir> <out.mp4> [in_seconds] [out_seconds]
"""
import json, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

B, N, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
IN_S = float(sys.argv[4]) if len(sys.argv) > 4 else 16.0
OUT_S = float(sys.argv[5]) if len(sys.argv) > 5 else 9.0
FPS = 30

def load(d):
    J = json.load(open(os.path.join(d, 'frames.json'))); fr = J['frames']; R = J.get('report', {})
    if R.get('engageT') is not None and R.get('leaveT') is not None: return d, fr, R['engageT'], R['leaveT']
    eng = None
    for i in range(1, len(fr)):
        if fr[i - 1]['phase'] == 'card' and fr[i]['phase'] != 'card': eng = fr[i]['t']; break
    lv = next((f['t'] for f in fr if f['phase'].startswith('out')), None)
    return d, fr, eng, lv

def at(rec, t):
    d, fr, _, _ = rec
    best = fr[0]
    for f in fr:
        if f['t'] <= t: best = f
        else: break
    return os.path.join(d, 'frames', best['name']), best['phase']

def font(sz):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf']:
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()

b, n = load(B), load(N)
W, H = 390, 844
F1, F2 = font(20), font(15)
tmp = tempfile.mkdtemp()
k = 0
cache = {}
def img(p):
    if p not in cache:
        if len(cache) > 64: cache.clear()
        cache[p] = Image.open(p).convert('RGB').resize((W, H))
    return cache[p]
def section(tag, b0, n0, secs, bnote, nnote):
    global k
    for i in range(int(secs * FPS)):
        t = i * 1000.0 / FPS - 400
        S = Image.new('RGB', (2 * W + 6, H + 56), (14, 11, 8)); dr = ImageDraw.Draw(S)
        for j, (rec, t0, label, note) in enumerate([(b, b0, 'BEFORE', bnote), (n, n0, 'NOW', nnote)]):
            p, ph = at(rec, t0 + t) if t0 is not None else (None, '')
            x = j * (W + 6)
            if p: S.paste(img(p), (x, 56))
            dr.text((x + 8, 6), label, fill=(236, 208, 140) if j else (200, 120, 100), font=F1)
            dr.text((x + 8, 32), note, fill=(170, 160, 140), font=F2)
        sec = max(0.0, t / 1000.0)
        dr.text((2 * W + 6 - 200, 8), '%s +%4.1f s' % (tag, sec), fill=(236, 228, 206), font=F2)
        S.save(os.path.join(tmp, 'c%05d.jpg' % k), quality=86); k += 1

section('ENGAGE', b[2], n[2], IN_S, 'the way in, phone 4x slower', 'the way in, phone 4x slower')
section('LEAVE', b[3], n[3], OUT_S, 'the way home', 'the way home')
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(tmp, 'c%05d.jpg'),
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '27', '-preset', 'slow', '-movflags', '+faststart', OUT])
print(OUT, os.path.getsize(OUT), 'bytes', k, 'frames')
