#!/usr/bin/env python3
"""CHARACTER TWO, 11/27: IMPLANTS, HOW THEY LOOK (rule 486: real tech only, black market, among the dearest things in the game).
How a man fitted with one looks, on his face and at the fight's size, grounded and ugly-real, never chrome. The parts are
PORTRAIT's head tool's 'implant' (tools/bohemia_portrait_the_head_from_the_model.py, IMPLANTS): the camera eye and the hearing
implant. Nobody in the game wears one yet: ECONOMY THREE prices it, COMBAT FIVE says what it does; this is the look, on a card.

    <bpy python> tools/bohemia_character_two_implants.py build     the two fitted heads on Old Tavo's body (records/portrait/rig/crew/bodies)
    <bpy python> tools/bohemia_character_two_implants.py render    DIRECTION's master rig, unedited: the stills and the portrait
    python3      tools/bohemia_character_two_implants.py card      the VOTE card
"""
import json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
OUT = 'records/target/character/implants'
FITTED = {'IMPLANT_EYE': ('camera eye',), 'IMPLANT_EAR': ('hearing',)}


def people():
    import bohemia_portrait_the_head_from_the_model as PM
    for k, imp in FITTED.items():
        e = dict(PM.PEOPLE['CAST_WIDEBRIM']); e.update(gear=None, implant=imp, look=k.lower(), twin=None, kit='bare head; ' + ', '.join(imp))
        PM.PEOPLE[k] = e
    return PM


def build():
    PM = people()
    for k in FITTED:
        PM.build(k, os.path.join(ROOT, 'records/portrait/rig/crew/%s_head.glb' % k.lower()))


def render():
    py = os.environ.get('BOHEMIA_BPY', sys.executable)
    for k in FITTED:
        glb = os.path.join(ROOT, 'records/portrait/rig/crew/%s_head.glb' % k.lower()); out = os.path.join(ROOT, OUT, k.lower())
        subprocess.call([py, 'tools/bohemia_direction_master_rig.py', glb, out, '--real-height', '1.72', '--family', 'none', '--still', 'pass',
                         '--portrait', '128', '--class', 'portrait', '--no-id-pass', '--no-calibration'], cwd=ROOT)
        keep = {'rig.json', 'portrait.json', 'rig_portrait_S.png', 'rig_portrait_SE.png', 'rig_portrait_SW.png'} | {'rig_%s.png' % f for f in ('S', 'SE', 'SW', 'E', 'W')}
        for f in os.listdir(out):
            if f not in keep: os.remove(os.path.join(out, f))   # only the pictures the card reads are kept


def card():
    from PIL import Image, ImageDraw, ImageFont
    BG, INK, DIM = (34, 31, 29, 255), (214, 200, 170, 255), (150, 136, 116, 255)
    F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
    rows = [('implant_eye', 'THE CAMERA EYE', 'a camera in an eye shell, a lens, a red light while it records, the lead taped down the temple'),
            ('implant_ear', 'THE HEARING IMPLANT', 'a coil held to the skull by a magnet, a lead to the processor behind the ear')]
    W = 760; card = Image.new('RGBA', (W, 90 + len(rows) * 330), BG); d = ImageDraw.Draw(card)
    d.text((24, 20), 'IMPLANTS: REAL, SALVAGED, BACK-ROOM FITTED', font=F, fill=INK)
    d.text((24, 56), 'how a man with one looks: his face, and the fight\'s own size x2', font=f2, fill=DIM)
    y = 96
    for look, title, line in rows:
        d.text((24, y), title, font=f2, fill=INK); d.text((24, y + 22), line, font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14), fill=DIM)
        p = Image.open(os.path.join(ROOT, OUT, look, 'rig_portrait_S.png')).convert('RGBA'); s = min(p.size)
        face = p.crop(((p.size[0] - s) // 2, p.size[1] - s, (p.size[0] - s) // 2 + s, p.size[1])).resize((256, 256), Image.LANCZOS)
        card.alpha_composite(face, (24, y + 46)); x = 296
        for f in (('S', 'SW', 'W') if look == 'implant_eye' else ('SE', 'E', 'S')):
            st = Image.open(os.path.join(ROOT, OUT, look, 'rig_%s.png' % f)).convert('RGBA'); bb = st.getbbox(); st = st.crop(bb)
            st = st.resize((st.size[0] * 2, st.size[1] * 2), Image.NEAREST)
            card.alpha_composite(st, (x, y + 46 + max(0, 256 - st.size[1]))); x += st.size[0] + 10
        y += 330
    card = card.convert('RGB'); os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    card.save(os.path.join(ROOT, OUT, 'CHARACTER_IMPLANTS_HOW_THEY_LOOK.webp'), 'WEBP', quality=90)
    card.resize((W // 2, card.size[1] // 2), Image.LANCZOS).save(os.path.join(ROOT, OUT, 'CHARACTER_IMPLANTS_HOW_THEY_LOOK_FIRST.webp'), 'WEBP', quality=88)
    print('card', card.size)


if __name__ == '__main__':
    {'build': build, 'render': render, 'card': card}[sys.argv[1]]()
