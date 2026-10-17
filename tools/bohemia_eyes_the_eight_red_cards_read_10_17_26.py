#!/usr/bin/env python3
"""EYES READS THE EIGHT RED CARDS' BEFORE-AND-AFTER  (rule 89, rule 110's big swing for this lane, 10/17/26)

THE EIGHT: the VOTE triage's red tags that have no verdict yet (records/target/BOHEMIA_VOTE_TRIAGE.json
against the registry's verdicts[]), the coordinator's sweep AL list: the straight roofs, the 47 corners, the
whole bank, the party baked, the flip, the party walks, both teams, the night's insects.

WHAT THIS LANE ANSWERS, ONE LINE PER CARD: can a person see (or hear) the difference, as he would meet it,
on his phone, in the VOTE tab? Two instruments, both this lane's own, never a lane's self-report:
  (1) the real perceptual change share between each card's OWN before and after (YIQ distance, Kotsarenko
      and Ramos 2010, with the anti-aliasing exclusion; imported unchanged from this lane's own
      tools/bohemia_eyes_before_and_after_check_10_10_26.py, round two of [the before and after]);
  (2) THE TAB'S OWN SCALE: the VOTE tab draws an image card at max-width 100% inside a 680 px wrap with
      12 px padding (slices/BOHEMIA_VOTE_TAB.html .wrap/.stage img), so on his phone (390 css pt, 3x) a
      card W px wide is shown at (390-24)*3 = 1098 device px, i.e. 1098/W device pixels per card pixel.
      Rule 89 asks for ONE art pixel to ONE phone pixel; a card wider than 1098 px is shrunk before he
      sees it, and the text on it shrinks with it. That is measured here per card, not guessed.
For the sound card the before is silence (the card's own words: 'night travel was silent') and the claim
is 'many insects, never a hiss'; the clip is rendered from SOUNDS' own one copy of the generator and
measured beside a hiss put through the same band filter (kurtosis: a click train is heavy-tailed, a hiss
is Gaussian at 3.0).

    python3 tools/bohemia_eyes_the_eight_red_cards_read_10_17_26.py
      -> records/eyes_eight_red_cards/report.json
      -> slices/vote/EYES_THE_EIGHT_RED_CARDS_READ.png  (the strip: each card's before and after AS THE TAB
         SHOWS IT on his phone, a 1:1 detail beside it, and the one line)
"""
import importlib, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
os.chdir(ROOT)
BA = importlib.import_module('bohemia_eyes_before_and_after_check_10_10_26')

OUT_DIR = 'records/eyes_eight_red_cards'
os.makedirs(OUT_DIR, exist_ok=True)
PHONE_DEVICE_PX = (390 - 24) * 3          # the tab's image width on his phone, in device pixels

def tab_scale(card_w):
    return PHONE_DEVICE_PX / float(card_w)

def changed(before, after):
    _mask, pct = BA.visible_fraction(before, after)
    return round(pct, 2)

def same_size(a, b):
    w, h = min(a.size[0], b.size[0]), min(a.size[1], b.size[1])
    return a.crop((0, 0, w, h)), b.crop((0, 0, w, h))

# ---- each card's own before and after, cut from the card's own files (never redrawn) -------------------

def card_flip():
    im = Image.open('slices/vote/UI_THE_FLIP_OFF_THE_FACE_10_11.png').convert('RGB')
    # two phones side by side on the card: left column BEFORE, right column AFTER (the card's own labels)
    before = im.crop((30, 68, 530, 1115)); after = im.crop((557, 68, 1057, 1115))
    return im, [same_size(before, after)], 'a 22 px label on a 1230 px card'

def card_party():
    b = Image.open('slices/vote/ANIMATION_THE_PARTY_WALKS_AS_ONE_BEFORE.webp').convert('RGB')
    n = Image.open('slices/vote/ANIMATION_THE_PARTY_WALKS_AS_ONE_NOW.webp').convert('RGB')
    fw, fh = 480, 330          # 12 x 4 frames of 160 x 110 points at 3x (the page's own comment)
    pairs = []
    for r in range(4):
        for c in range(12):
            box = (c * fw, r * fh, (c + 1) * fw, (r + 1) * fh)
            pairs.append((b.crop(box), n.crop(box)))
    return b, pairs, 'the page plays the two sheets at the game\'s own size (480 px frames at 3x = 160 pt)'

def card_both_teams():
    im = Image.open('slices/vote/COMBAT_BOTH_TEAMS_THE_MAP_NOT_BLACK_10_11.jpg').convert('RGB')
    W, H = im.size
    # the card's own three rows: UPRIGHT (left before | right after), SIDEWAYS (top before / bottom after), COMPUTER (left | right)
    up_b = im.crop((0, 130, W // 2 - 10, 2650)); up_a = im.crop((W // 2 + 10, 130, W, 2650))
    sw_b = im.crop((0, 2780, W, 3990)); sw_a = im.crop((0, 4000, W, 5210))
    pc_b = im.crop((0, 5290, W // 2 - 10, H)); pc_a = im.crop((W // 2 + 10, 5290, W, H))
    return im, [same_size(up_b, up_a), same_size(sw_b, sw_a), same_size(pc_b, pc_a)], 'a 30 px label on a 2910 px card'

def card_roof():
    b = Image.open('records/target/COOK4_A_HOUSE_A_MAN_CAN_LIVE_IN.png').convert('RGB')
    a = Image.open('records/target/COOK4_THE_STRAIGHT_ROOF.png').convert('RGB')
    box = (300, 100, 1350, 505)         # the ranch at 1:1 on both cards (same layout, same place)
    return a, [(b.crop(box), a.crop(box))], 'the before is the card it redoes (cook4-a-house-a-man-can-live-in-10-11)'

def card_47():
    im = Image.open('records/target/COOK2_STRETCH_THE_PACK_47.png').convert('RGB')
    before = im.crop((0, 45, 820, 695)); after = im.crop((840, 45, 1660, 695))
    return im, [same_size(before, after)], 'the card\'s own left (hard squares) and right (from the 47)'

def card_bank():
    im = Image.open('records/target/COOK_THE_WHOLE_BANK.png').convert('RGB')
    return im, [], 'no before picture exists: the card says the before was four unopened files'

def card_baked():
    im = Image.open('slices/vote/RUN_THE_MAP_PEOPLE_COME_BAKED_10_13.png').convert('RGB')
    return im, [], 'a bar chart: the before and after are the two bars (32.5 s and 16.1 s)'

CARDS = [
    ('cook4-the-straight-roof-10-13', 'THE STRAIGHT ROOFS', card_roof),
    ('cook2-stretch-the-pack-47-10-13', 'THE 47 CORNERS', card_47),
    ('cook-the-whole-bank-10-13', 'THE WHOLE BANK', card_bank),
    ('run-the-map-people-come-baked-10-13', 'THE PARTY BAKED', card_baked),
    ('ui-the-flip-off-the-face-10-11', 'THE FLIP OFF THE FACE', card_flip),
    ('animation-the-party-walks-as-one-10-11', 'THE PARTY WALKS AS ONE', card_party),
    ('combat-both-teams-the-map-not-black-10-11', 'BOTH TEAMS, THE MAP NOT BLACK', card_both_teams),
]

def main():
    report = {'made': '10/17', 'lane': 'eyes-and-ears', 'phone_device_px_for_a_card': PHONE_DEVICE_PX, 'cards': []}
    for cid, title, fn in CARDS:
        card, pairs, note = fn()
        pcts = [changed(b, a) for b, a in pairs]
        entry = {'id': cid, 'title': title, 'card_px': list(card.size), 'tab_scale_on_his_phone': round(tab_scale(card.size[0]), 3),
                 'pairs': len(pairs), 'changed_pct': pcts, 'changed_pct_mean': round(float(np.mean(pcts)), 2) if pcts else None,
                 'changed_pct_min': min(pcts) if pcts else None, 'note': note}
        report['cards'].append(entry)
        print(cid, entry['tab_scale_on_his_phone'], pcts[:6], entry['changed_pct_mean'])
    # the sound card: measured by tools/bohemia_eyes_the_insects_render_10_17_26.js and the numbers beside it
    ins = json.load(open(os.path.join(OUT_DIR, 'insects_measured.json')))
    gen = json.load(open(os.path.join(OUT_DIR, 'insects.json')))
    report['cards'].append({'id': 'sounds-the-night-has-insects-10-5', 'title': 'THE NIGHT HAS INSECTS', 'before': 'silence (the card\'s own words)',
                            'clip': gen, 'measured': ins,
                            'note': 'kurtosis 3.0 is a Gaussian hiss; a click train is far above it; quiet share = 1 ms windows under -40 dBFS'})
    json.dump(report, open(os.path.join(OUT_DIR, 'report.json'), 'w'), indent=1)
    return report

if __name__ == '__main__':
    main()
