#!/usr/bin/env python3
"""COOK [the bosses dressed] 11/3 (rule 337, ask line 345): each boss his own VOTE card, MOVING. An animated picture, off what ships:
his fight sheet (slices/fight_rig/boss_<x>_0.webp: he turns through the eight facings standing, walks, SWINGS his weapon twice,
takes a blow) at three times the fight's pixels, his face talking (records/target/portrait/crew/boss_<x>_0/, rest and the four
mouths, the card's face), and BEFORE: the man he was last round (his 11/2 stills and face, out of git, never redrawn).
    python3 tools/bohemia_cook_the_bosses_dressed_cards_11_3_26.py [old_sha]
writes records/target/cook_bosses_dressed/COOK_BOSS_<NAME>.webp (moving) and COOK_BOSS_<NAME>_FIRST.png (its first frame)."""
import io, json, os, subprocess, sys, textwrap
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records/target/cook_bosses_dressed')
OLD = sys.argv[1] if len(sys.argv) > 1 else '6515a3f2'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
BOSSES = [('pot', 'THE POT', 'the kitchen\'s captain', ['stained chef\'s whites, a chef\'s toque', 'a riot vest cut down to his chest',
                                                          'the copper pot\'s lid on his arm', 'the butcher\'s cleaver']),
          ('tap', 'THE TAP', 'the pump-house boss', ['oil-black coveralls', 'a red valve wheel for a badge', 'a fire hose across him',
                                                     'the valve wrench, his hammer']),
          ('filter', 'THE FILTER', 'the mechanic', ['a respirator on two hoses', 'a filter pack on his back', 'his robots\' parts on him',
                                                    'a chopper cut from a robot'])]
Z = 3
BG, PANEL, INK, DIM = (34, 30, 26), (58, 52, 44), (216, 204, 176), (160, 146, 120)


def git_png(path):
    try: return Image.open(io.BytesIO(subprocess.check_output(['git', 'show', '%s:%s' % (OLD, path)], cwd=ROOT))).convert('RGBA')
    except Exception: return None


def main():
    I = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    dirs, clips = I['dirs'], I['clips']
    f_big = ImageFont.truetype(FONT, 22); f_mid = ImageFont.truetype(FONT, 15); f_sm = ImageFont.truetype(FONT, 13)
    os.makedirs(OUT, exist_ok=True)
    for key, name, who, lines in BOSSES:
        lk = 'boss_%s_0' % key; L = I['looks'][lk]
        sheet = Image.open(os.path.join(ROOT, 'slices/fight_rig', L['file'])).convert('RGBA'); w, h = L['w'], L['h']
        cell = lambda col, d: sheet.crop((col * w, dirs.index(d) * h, col * w + w, dirs.index(d) * h + h))
        # the moves: turning standing (each facing held), a walk, the swing twice, a blow taken, stand
        seq = []
        for d in dirs: seq += [(clips['stand'][0], d, 260)]
        for _ in range(2): seq += [(c, 'SE', 110) for c in clips['walk']]
        for _ in range(2): seq += [(clips['stand'][0], 'SE', 220)] + [(c, 'SE', 150) for c in clips['swing']]
        seq += [(c, 'SE', 170) for c in clips['hit']] + [(clips['stand'][0], 'SE', 300)]
        for _ in range(2): seq += [(c, 'SW', 150) for c in clips['swing']]
        face_d = os.path.join(ROOT, 'records/target/portrait/crew', lk)
        faces = {k: Image.open(os.path.join(face_d, '%s_128.png' % k)).convert('RGBA') for k in ('rest', 'A', 'E', 'O', 'M')}
        talk = ['rest', 'A', 'E', 'rest', 'O', 'M', 'A', 'rest', 'rest', 'E', 'O', 'rest']
        old = git_png('records/target/character/bosses/%s/rig_SE.png' % lk); old_face = git_png('records/target/character/bosses/%s/face/rest_128.png' % lk)
        # the frame: BEFORE (small) | NOW, MOVING (3x) | HIS FACE, TALKING
        bw = 150; mw = 96 * Z; fw = 200; W = bw + mw + fw + 40; H = 60 + h * Z - 120 + 120
        H = max(H, 470)
        frames, durs = [], []
        foot_x, foot_y = L['foot']
        for i, (col, d, ms) in enumerate(seq):
            im = Image.new('RGBA', (W, H), BG + (255,)); dr = ImageDraw.Draw(im)
            dr.text((12, 10), name, font=f_big, fill=INK); dr.text((12 + 14 * len(name) + 10, 16), '- ' + who, font=f_mid, fill=DIM)
            # BEFORE
            dr.rectangle((10, 50, 10 + bw - 10, H - 12), fill=PANEL); dr.text((18, 56), 'LAST ROUND', font=f_sm, fill=DIM)
            if old:
                o = old.resize((old.width * 1, old.height * 1), Image.NEAREST); im.alpha_composite(o, (10 + (bw - 10 - o.width) // 2, 80))
            if old_face:
                of = old_face.resize((96, 96), Image.LANCZOS); im.alpha_composite(of, (10 + (bw - 10 - 96) // 2, 80 + (old.height if old else 120) + 10))
            # NOW, MOVING: his fight cell at 3x, his feet on one line
            x0 = bw + 10; dr.rectangle((x0, 50, x0 + mw, H - 12), fill=(74, 66, 54)); dr.text((x0 + 8, 56), 'NOW, IN THE FIGHT (3x)', font=f_sm, fill=INK)
            c = cell(col, d); cz = c.resize((w * Z, h * Z), Image.NEAREST)
            fx = x0 + mw // 2 - foot_x * Z; fy = H - 40 - foot_y * Z
            layer = Image.new('RGBA', (W, H)); layer.paste(cz, (fx, fy), cz)
            box = (x0, 74, x0 + mw, H - 12); im.alpha_composite(layer.crop(box), box[:2])
            # 1:1, the fight's own size, in the corner
            im.alpha_composite(c, (x0 + mw - w + 18, 70))
            # HIS FACE, TALKING
            x1 = x0 + mw + 12; dr.rectangle((x1, 50, x1 + fw, H - 12), fill=PANEL); dr.text((x1 + 8, 56), 'HIS CARD', font=f_sm, fill=INK)
            fc = faces[talk[(i // 2) % len(talk)]].resize((168, 168), Image.LANCZOS); im.alpha_composite(fc, (x1 + 16, 80))
            yy = 268
            for t in lines:
                for ln in textwrap.wrap(t, 22): dr.text((x1 + 8, yy), ln, font=f_sm, fill=DIM); yy += 15
                yy += 6
            frames.append(im.convert('RGB')); durs.append(ms)
        out = os.path.join(OUT, 'COOK_BOSS_%s.webp' % name.split()[-1])
        frames[0].save(out, 'WEBP', save_all=True, append_images=frames[1:], duration=durs, loop=0, quality=88, method=4)
        frames[0].save(os.path.join(OUT, 'COOK_BOSS_%s_FIRST.png' % name.split()[-1]))
        # a still sheet too: the eight facings and the swing at 3x (for the record and the twin check)
        print(name, len(frames), 'frames', W, 'x', H, os.path.getsize(out) // 1024, 'KB ->', os.path.relpath(out, ROOT))


if __name__ == '__main__':
    main()
