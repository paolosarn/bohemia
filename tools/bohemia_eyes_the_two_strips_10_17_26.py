#!/usr/bin/env python3
"""EYES' TWO VOTE PICTURES FOR 10/17 (rule 110's big swing for this lane): the eight red cards' before-and-after
read, and [the map's four numbers] beside Battle Brothers'.

Both strips are 1170 px wide: his phone's own width in device pixels (390 pt at 3x), so when the VOTE tab shows
them at its 366 pt they are within 6% of one strip pixel to one phone pixel (rule 89). Every crop in them is cut
from the card's OWN file (never redrawn) and shown at the size the TAB gives it on his phone (the card's width
against the tab's 1098 device px), with a 1:1 detail beside it where the change is.

    python3 tools/bohemia_eyes_the_two_strips_10_17_26.py
      -> slices/vote/EYES_THE_EIGHT_RED_CARDS_READ.png
      -> slices/vote/EYES_THE_MAPS_FOUR_NUMBERS.png
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
os.chdir(ROOT)
import importlib
BA = importlib.import_module('bohemia_eyes_before_and_after_check_10_10_26')
R8 = importlib.import_module('bohemia_eyes_the_eight_red_cards_read_10_17_26')

W = 1170
BG = (14, 12, 10); INK = (232, 220, 196); GOLD = (214, 170, 80); DIM = (150, 140, 120); RED = (220, 90, 70); GREEN = (120, 200, 110)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FONTB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def F(sz, b=False): return ImageFont.truetype(FONTB if b else FONT, sz)

def wrap(draw, text, font, maxw):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=font) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def text_block(draw, x, y, text, font, fill, maxw, lh=None):
    lh = lh or int(font.size * 1.35)
    for ln in wrap(draw, text, font, maxw):
        draw.text((x, y), ln, font=font, fill=fill); y += lh
    return y

def scaled(im, s):
    return im.resize((max(1, int(round(im.size[0] * s))), max(1, int(round(im.size[1] * s)))), Image.LANCZOS)

def detail_crop(before, after, size=(300, 220)):
    """the 1:1 window where the change is densest (the diff mask summed in a sliding box)"""
    mask, _ = BA.visible_fraction(before, after)
    H, Wd = mask.shape; bw, bh = min(size[0], Wd), min(size[1], H)
    m = mask.astype(np.float64) * (0.2 + 0.8 * (BA.luma(np.asarray(after.convert('RGB'), dtype=np.float64)) / 255.0))
    cs = np.cumsum(np.cumsum(np.pad(m, ((1, 0), (1, 0))), axis=0), axis=1)
    ys = np.arange(0, H - bh + 1, 8); xs = np.arange(0, Wd - bw + 1, 8)
    best, bx, by = -1, 0, 0
    for y in ys:
        for x in xs:
            v = cs[y + bh, x + bw] - cs[y, x + bw] - cs[y + bh, x] + cs[y, x]
            if v > best: best, bx, by = v, x, y
    box = (int(bx), int(by), int(bx + bw), int(by + bh))
    return before.crop(box), after.crop(box)

# ---------------------------------------------------------------- STRIP ONE: THE EIGHT RED CARDS ----
def strip_eight():
    rep = json.load(open('records/eyes_eight_red_cards/report.json'))
    byid = {c['id']: c for c in rep['cards']}
    rows = []
    # (id, verdict word, the one line, [pairs], note on the pair shown)
    pairs = {}
    for cid, title, fn in R8.CARDS:
        card, prs, note = fn(); pairs[cid] = (card, prs, note)
    V = [
        ('cook4-the-straight-roof-10-13', 'VISIBLE', 'A person sees it: the pointed ends are gone and the roof is one straight run, on the whole ranch, and it still reads at the size the tab gives the card (0.77 of 1:1).', 'the ranch, before (triangle ends) and after (straight), at the tab\'s size'),
        ('cook2-stretch-the-pack-47-10-13', 'VISIBLE', 'A person sees it: the raised curb and the rounded corners read on every edge, even on the one-square island, at 0.66 of 1:1.', 'the same sidewalk plan as hard squares, then from the 47 cells'),
        ('cook-the-whole-bank-10-13', 'NOT A PICTURE', 'There is no before picture to see, only words; and the table\'s letters are about 4 points tall on his phone, so he cannot read the count without pinching. A text item (his 9/21: text items are boring).', 'the card as the tab shows it'),
        ('run-the-map-people-come-baked-10-13', 'VISIBLE, A CHART', 'The three bars are a 2-to-1 difference anyone sees. This lane re-measured the same build with the first-load instrument at 4x: NEW GAME is ready at 14.6 s after the link, which sits under the card\'s 16.1 s to the first block, so the two instruments agree this time (rule 90).', 'the card as the tab shows it'),
        ('ui-the-flip-off-the-face-10-11', 'VISIBLE', 'A person sees it: the three family cards are gone from the bottom of the phone (27% of the phone\'s face changed) and the feed fills the space, at 0.89 of 1:1.', 'the phone before and after, at the tab\'s size'),
        ('animation-the-party-walks-as-one-10-11', 'VISIBLE, SMALL', 'The party is one small thing on a 160-point frame: 2.6% of the frame changes, 16% inside the party\'s own box. The pole and the yellow flag are gone and the two walk closer; you see it only if you look at the party, which the page\'s label tells you to.', 'one frame, before and now, at the game\'s own size'),
        ('combat-both-teams-the-map-not-black-10-11', 'VISIBLE, TOO SMALL', 'The black around the board is gone (80% of the picture changes), and that reads; but the card is 2,910 px wide and the tab shows it at 0.38, so the men are about 11 px tall on his phone and nothing but the black-to-map reads.', 'the upright phone before and after, at the tab\'s size'),
    ]
    blocks = []
    for cid, word, line, pairnote in V:
        card, prs, _ = pairs[cid]; c = byid[cid]; s = 1.0 if 'party-walks' in cid else c['tab_scale_on_his_phone']
        blocks.append((cid, word, line, pairnote, card, prs, s, c))
    # sound
    ins = json.load(open('records/eyes_eight_red_cards/insects_measured.json'))
    d = np.fromfile('records/eyes_eight_red_cards/insects.f32', dtype=np.float32)

    # measure heights first
    img = Image.new('RGB', (W, 9000), BG); dr = ImageDraw.Draw(img)
    y = 16
    dr.text((16, y), 'EYES READS THE EIGHT RED CARDS: CAN YOU SEE IT?', font=F(30, True), fill=GOLD); y += 44
    y = text_block(dr, 16, y, 'Every picture here is cut from the card\'s own file and shown at the size the VOTE tab gives it on your phone. The 1:1 box is the place where the change is. The number is the real share of pixels a person could notice (the published eye formula, not a raw subtraction).', F(18), INK, W - 32); y += 12
    for cid, word, line, pairnote, card, prs, s, c in blocks:
        dr.line((16, y, W - 16, y), fill=(60, 54, 44), width=2); y += 12
        dr.text((16, y), c['title'], font=F(24, True), fill=INK)
        dr.text((W - 16 - dr.textlength(word, font=F(24, True)), y), word, font=F(24, True), fill=GREEN if word == 'VISIBLE' else (GOLD if word.startswith('VISIBLE') else RED)); y += 34
        if prs:
            b, a = prs[0]
            # before | after at the tab's size, side by side within 760 px; the 1:1 detail at the right
            bs, as_ = scaled(b, s), scaled(a, s)
            maxw = 350
            if bs.size[0] > maxw:
                k = maxw / bs.size[0]; bs, as_ = scaled(bs, k), scaled(as_, k); shown = s * k
            else: shown = s
            db, da = detail_crop(b, a, (180, 150))
            x = 16; img.paste(bs, (x, y)); img.paste(as_, (x + bs.size[0] + 10, y))
            dx = x + bs.size[0] * 2 + 30
            if dx + 380 > W: dx = W - 380
            img.paste(db, (dx, y)); img.paste(da, (dx + 190, y))
            dr.text((dx, y + 154), '1:1, where the change is: before | after', font=F(15), fill=DIM)
            y += max(bs.size[1], 176)
            y = text_block(dr, x, y, 'before  |  after, shown at %.2f of 1:1 (%s)' % (shown, pairnote), F(15), DIM, W - 32) + 6
        else:
            cs = scaled(card, s); k = min(1.0, 700 / cs.size[0]); cs = scaled(cs, k)
            img.paste(cs, (16, y))
            # a 1:1 crop of its smallest text
            crop = card.crop((16, 220, 436, 400)) if 'bank' in cid else card.crop((30, 120, 450, 300))
            img.paste(crop, (W - 16 - 420, y))
            dr.text((16, y + cs.size[1] + 4), 'the card at %.2f of 1:1 (%s)' % (s * k, pairnote), font=F(15), fill=DIM)
            dr.text((W - 16 - 420, y + 184), '1:1 crop of its words', font=F(15), fill=DIM)
            y += max(cs.size[1], 184) + 26
        y = text_block(dr, 16, y, line, F(19), INK, W - 32)
        proof = 'proof: card %d x %d px; the tab shows it at %.2f of 1:1 on a 390 pt phone' % (c['card_px'][0], c['card_px'][1], s)
        if c['pairs']: proof += '; %s changed %s%%' % ('mean of %d frames' % c['pairs'] if c['pairs'] > 1 else 'pixels', c['changed_pct_mean'])
        dr.text((16, y + 2), proof, font=F(15), fill=DIM); y += 30
    # the sound row
    dr.line((16, y, W - 16, y), fill=(60, 54, 44), width=2); y += 12
    dr.text((16, y), 'THE NIGHT HAS INSECTS', font=F(24, True), fill=INK)
    word = 'AUDIBLE'; dr.text((W - 16 - dr.textlength(word, font=F(24, True)), y), word, font=F(24, True), fill=GREEN); y += 34
    # waveform: before = silence (flat), after = 1 second of the clip
    wv = Image.new('RGB', (W - 32, 160), (20, 18, 14)); wd = ImageDraw.Draw(wv)
    wd.line((0, 40, W - 32, 40), fill=DIM, width=1); wd.text((6, 4), 'BEFORE: silence (night travel had no sound)', font=F(14), fill=DIM)
    sr = 44100; seg = d[:sr]; n = W - 32; step = len(seg) // n
    wd.text((6, 84), 'AFTER: one second of the insects, 720 clicks in 8 s', font=F(14), fill=DIM)
    for i in range(n):
        v = float(np.abs(seg[i * step:(i + 1) * step]).max()) if step else 0
        wd.line((i, 120 - v * 36, i, 120 + v * 36), fill=GOLD, width=1)
    img.paste(wv, (16, y)); y += 170
    k_i, k_h = ins['insects']['kurtosis'], ins['hiss_control']['kurtosis']
    y = text_block(dr, 16, y, 'Against silence anyone hears it. And it is many clicks, not a hiss: a hiss put through the same 3 to 6 kHz band measures %.1f on the click-vs-hiss scale (a hiss sits at 3), the insects measure %.1f, and %d%% of every second is quiet between the clicks.' % (k_h, k_i, round(100 * ins['insects']['quiet_1ms_share'])), F(19), INK, W - 32)
    y = text_block(dr, 16, y + 2, 'proof: the clip rendered from SOUNDS\' own one copy (engine/bohemia_horror_sounds.js nightInsects, 8 s, 90 a second); kurtosis %.1f vs hiss %.1f; crest %.0f dB vs %.0f dB' % (k_i, k_h, ins['insects']['crest_db'], ins['hiss_control']['crest_db']), F(15), DIM, W - 32) + 10
    dr.line((16, y, W - 16, y), fill=(60, 54, 44), width=2); y += 12
    y = text_block(dr, 16, y, 'THE ONE THING UNDER ALL EIGHT: the tab shrinks any card wider than 1,098 px before you see it. Four of these seven pictures are wider (the fight card by 2.6 times), so they never reach you at one art pixel to one phone pixel. The maker\'s picture was right; the glass between you and it is not.', F(19), GOLD, W - 32)
    y += 16
    out = img.crop((0, 0, W, y)); out.save('slices/vote/EYES_THE_EIGHT_RED_CARDS_READ.png')
    print('strip one', out.size)

# ---------------------------------------------------------------- STRIP TWO: THE MAP'S FOUR NUMBERS ----
def strip_four():
    N = json.load(open('records/eyes_map_four_numbers/numbers.json'))
    S = json.load(open('records/eyes_map_four_numbers/steps_skyoff.json'))
    far = Image.open('records/eyes_map_four_numbers/step_0.1072_skyoff.png').convert('RGB')
    near = Image.open('records/eyes_map_four_numbers/near_stop.png').convert('RGB')
    moon = Image.open('records/eyes_map_four_numbers/far_stop.png').convert('RGB')
    valley = Image.open('records/eyes_map_four_numbers/step_0.2234_skyoff.png').convert('RGB')
    img = Image.new('RGB', (W, 4200), BG); dr = ImageDraw.Draw(img)
    y = 16
    dr.text((16, y), 'THE MAP\'S FOUR NUMBERS, OURS BESIDE BATTLE BROTHERS\'', font=F(30, True), fill=GOLD); y += 44
    y = text_block(dr, 16, y, 'Measured on the demo on your phone\'s profile with real pinches, by this lane\'s own instrument, not by the map chat\'s own printout. Battle Brothers\' numbers come from the library and the public record; where the public record has no number it says so.', F(18), INK, W - 32); y += 10
    # four screens at phone size: valley stop, region far stop, the moon one squeeze later, the near stop
    shots = [(valley, 'the old far stop: the valley fits (97 blocks across)'), (far, 'the region\'s far stop: 202 blocks across (the valley is the square)'), (moon, 'ONE MORE SQUEEZE: the moon. The finger leaves the map.'), (near, 'the near stop: 4.6 blocks across, one block at 85 pt')]
    sw = (W - 16 * 2 - 10 * 3) // 4; sh = int(2382 * sw / 1170)
    for i, (im, lab) in enumerate(shots):
        x = 16 + i * (sw + 10); t = im.resize((sw, sh), Image.LANCZOS); img.paste(t, (x, y))
        for j, ln in enumerate(wrap(dr, lab, F(14), sw)): dr.text((x, y + sh + 4 + j * 18), ln, font=F(14), fill=DIM)
    y += sh + 66
    # TO SCALE: at the region's far stop, one block is 1.94 pt = 5.8 device px. Draw his glass, the valley, the region, and BB's 140 map at the same px per tile
    dr.text((16, y), 'AT THE SAME PIXELS PER TILE (the region\'s far stop: one block = 5.8 of your phone\'s pixels)', font=F(20, True), fill=INK); y += 30
    ppt = 1170 / 202.1  # device px per block across the glass at the far stop
    k = 0.2             # drawing scale so the whole group fits the strip
    region_w = 496 * ppt * k; region_h = region_w / 2
    bb = 140 * ppt * k
    glass_w = 1170 * k; glass_h = 2382 * k
    group_w = bb + 40 + region_w; x0 = (W - group_w) / 2
    cy = y + int(glass_h / 2) + 30; cx = x0 + bb + 40 + region_w / 2
    def diamond(cxx, cyy, wpx, hpx, col, wdt=2):
        dr.polygon([(cxx, cyy - hpx / 2), (cxx + wpx / 2, cyy), (cxx, cyy + hpx / 2), (cxx - wpx / 2, cyy)], outline=col, width=wdt)
    diamond(cx, cy, region_w, region_h, (190, 150, 90), 3)
    valley_w = 96 * ppt * k; diamond(cx, cy, valley_w, valley_w / 2, (230, 200, 120), 3)
    dr.rectangle((x0, cy - bb / 2, x0 + bb, cy + bb / 2), outline=(120, 190, 230), width=3)
    dr.text((x0, cy + bb / 2 + 6), 'Battle Brothers: 140 x 140', font=F(15), fill=(120, 190, 230))
    dr.rectangle((cx - glass_w / 2, cy - glass_h / 2, cx + glass_w / 2, cy + glass_h / 2), outline=(240, 240, 240), width=2)
    dr.text((cx - glass_w / 2 + 4, cy - glass_h / 2 + 4), 'your glass', font=F(14), fill=(240, 240, 240))
    dr.text((cx + region_w / 2 - 230, cy - region_h / 2 - 22), 'our region: 496 x 496 blocks', font=F(15), fill=(190, 150, 90))
    dr.text((cx + valley_w / 2 + 8, cy + 4), 'the valley: 96 x 96', font=F(15), fill=(230, 200, 120))
    y = int(cy + glass_h / 2 + 24)
    y = text_block(dr, 16, y, 'Read it plainly: by the count our region is 3.5 times Battle Brothers\' width. But a block is crossed in 10.8 minutes and a Battle Brothers tile in about 20 to 40 (its 140 tiles take 2 to 4 days), so IN WALKING TIME our 496 blocks are worth about 125 to 250 of their tiles: about their map, not three and a half of it. The number that matters is days, and it is in the table.', F(18), INK, W - 32); y += 14
    # THE TABLE
    rows = [
        ('tiles across (in all)', '496 (246,016) blocks', 'about 140 (19,600) hex tiles [modders\' world.nut 140x140 = vanilla; Map Data Tool counts 19,400]', 'MET', GREEN),
        ('days to cross, walking', '%.1f on a road, %.1f on open ground, rim to rim; the far towns 0.8 to 2.0 days from the city' % (N['runsOwnNumbers']['daysAcrossRoad'], N['runsOwnNumbers']['daysAcrossOpen']), '2 to 4 days [players on the Steam forum: "less than 3, sometimes less than 2"; "three or four"]; one day is 1 min 45 s real time [wiki]', 'MET on open ground, SHORT on a road (1.9 < 2)', GOLD),
        ('settlements', '26 (14 in the valley, 12 towns out in the region)', 'about 17 [wiki: 2 cities, 3 towns, 6 villages, 2 strongholds, 2 castles, 2 manors; up to 22 seen]', 'MET', GREEN),
        ('locations (camps, ruins, legendary places)', '0 on the region; none to walk to', 'dozens per map, no published count [each sends parties; 7+ legendary places]', 'SHORT', RED),
        ('zoom, near stop', '4.6 blocks across the glass; one block 85 pt, the man at his own pixels', 'not published; the data does not say [Grok ask 26 still unanswered]', 'NO NUMBER TO MEET', DIM),
        ('zoom, far stop', '202 blocks across the glass (1.44 of BB\'s whole width), then ONE MORE SQUEEZE leaves the map for the moon', 'part of the map, you pan; the camera never leaves the map [the library; the exact tile count is not published]', 'MET on width; the moon is past it', GOLD),
    ]
    dr.line((16, y, W - 16, y), fill=(60, 54, 44), width=2); y += 10
    colx = [16, 300, 640, 980]
    for i, h in enumerate(['', 'OURS (measured)', 'BATTLE BROTHERS (source)', 'VERDICT']):
        dr.text((colx[i], y), h, font=F(16, True), fill=GOLD)
    y += 28
    for name, ours, bb, verdict, col in rows:
        h = 0; ys = y
        for i, (t, f, c) in enumerate([(name, F(17, True), INK), (ours, F(16), INK), (bb, F(15), DIM), (verdict, F(16, True), col)]):
            maxw = (colx[i + 1] - colx[i] - 12) if i < 3 else (W - 16 - colx[i])
            yy = text_block(dr, colx[i], ys, t, f, c, maxw); h = max(h, yy - ys)
        y = ys + h + 12; dr.line((16, y - 6, W - 16, y - 6), fill=(40, 36, 30), width=1)
    y += 6
    y = text_block(dr, 16, y, 'THE ONE THING TO FIX: at the far stop your next pinch does not stop, it goes through the clouds to the moon (the 8/15 moon zoom). Battle Brothers\' camera never leaves its map. Under rule 109 the map\'s zoom range is Battle Brothers\', so the region\'s stop should be where the finger stops, and the moon a different door. Not this lane\'s call to make; this lane\'s job to show.', F(19), GOLD, W - 32)
    y += 8
    dr.text((16, y), 'proof: tools/bohemia_eyes_the_maps_four_numbers_10_17_26.js and _the_far_stop_steps_; records/eyes_map_four_numbers/; sources in the record page', font=F(14), fill=DIM); y += 30
    out = img.crop((0, 0, W, y)); out.save('slices/vote/EYES_THE_MAPS_FOUR_NUMBERS.png')
    print('strip two', out.size)

if __name__ == '__main__':
    strip_eight(); strip_four()
