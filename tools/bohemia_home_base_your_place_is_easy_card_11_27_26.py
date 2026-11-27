# HOME BASE 6, 11/27/26: YOUR PLACE IS EASY: the VOTE card's clip (run by tools/bohemia_home_base_your_place_is_easy_card_11_27_26.js,
# which passes the films as JSON in argv[1]). Upright, then sideways, each frame held as long as it was on the glass (real time,
# played at 1.5x), on one square so the clip never jumps size; a gold ring where each finger went, for half a second.
import sys, json, os, subprocess
from PIL import Image, ImageDraw, ImageFont
a = json.loads(sys.argv[1])
S, SPEED, FPS = 960, 1.5, 12
try: fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 28)
except Exception: fnt = ImageFont.load_default()
seq = os.path.join(a['tmp'], 'seq'); os.makedirs(seq, exist_ok=True)
for f in os.listdir(seq): os.remove(os.path.join(seq, f))
k = 0; first = None
for fp in a['films']:
    F = json.load(open(fp)); fr = F['frames']; taps = F['taps']; side = F['prof'] == 'phone_landscape'
    if not fr: continue
    end = fr[-1]['t'] + 300
    t = fr[0]['t']; i = 0
    while t <= end:
        while i + 1 < len(fr) and fr[i + 1]['t'] <= t: i += 1
        im = Image.open(fr[i]['f']).convert('RGB'); W, H = im.size
        sc = min((S - 8) / W, (S - 44) / H); im = im.resize((round(W * sc), round(H * sc)), Image.LANCZOS)
        C = Image.new('RGB', (S, S), (18, 14, 10)); ox, oy = (S - im.width) // 2, 40 + (S - 40 - im.height) // 2
        C.paste(im, (ox, oy)); d = ImageDraw.Draw(C)
        d.text((10, 8), ('SIDEWAYS' if side else 'UPRIGHT') + ': YOUR PLACE, A NEW GAME, REAL TAPS', font=fnt, fill=(226, 196, 120))
        for tp in taps:
            if 0 <= t - tp['t'] <= 500:
                x, y = ox + tp['x'] * sc, oy + tp['y'] * sc; r = 16 + (t - tp['t']) / 500 * 14
                d.ellipse((x - r, y - r, x + r, y + r), outline=(230, 196, 117), width=4)
        C.save(os.path.join(seq, '%05d.jpg' % k), quality=88); k += 1
        if side and first is None and t > fr[0]['t'] + 20000: first = C.copy()
        t += 1000 * SPEED / FPS
cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(seq, '%05d.jpg'), '-vf', 'scale=720:720', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
       '-crf', '31', '-preset', 'slow', '-movflags', '+faststart', a['out']]
subprocess.run(cmd, check=True)
if first is not None: first.resize((720, 720), Image.LANCZOS).save(a['first'], 'WEBP', quality=80, method=6)
print(json.dumps({'frames': k, 'seconds': round(k / FPS, 1), 'mb': round(os.path.getsize(a['out']) / 1e6, 2)}))
