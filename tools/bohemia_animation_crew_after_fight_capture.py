#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [crew screen after a fight]: the film for the VOTE card. The browser's own screen recording (film/NNNN.jpg at
the phone's points, now.json: when each frame was painted) packed into ONE moving webp at the game's own speed, the end screen first
(end_screen.png, held 1.6 s: where the tap came from); frames closer than 80 ms to the last kept one are dropped (the scene draws
twelve a second), except through the glide after the finger (every frame painted: the camera's move is drawn every frame). The stills (before_phone.png, end_screen.png) down to the phone's points
by a box of three by three.
    python3 tools/bohemia_animation_crew_after_fight_capture.py
REUSE CHECK: Pillow only; nothing drawn here."""
import glob, json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, 'records/target/animation/crew_after_fight')


def still(name):
    p = os.path.join(DIR, name + '.png')
    if not os.path.exists(p):   # the phone's pixels are not kept once cut (records/target is published): the cut stands
        return Image.open(os.path.join(DIR, name + '.webp')).convert('RGB')
    im = Image.open(p).convert('RGB')
    im = im.resize((im.size[0] // 3, im.size[1] // 3), Image.BOX)
    im.save(os.path.join(DIR, name + '.webp'), 'WEBP', quality=86, method=6)
    return im


def main():
    still('before_phone')
    end = still('end_screen')
    j = json.load(open(os.path.join(DIR, 'now.json')))
    T = j['times']
    files = sorted(glob.glob(os.path.join(DIR, 'film', '*.jpg')))
    n = min(len(files), len(T))
    if n < 2:   # the film's frames are cut once packed (records/target is published): the packed film stands
        print('CREWFIGHT no film to pack: now.webp left as it is'); return
    tap = T[j['tapAt']] if j.get('tapAt') is not None and j['tapAt'] < n else None
    keep = []
    for i in range(n):
        gliding = tap is not None and 0 <= T[i] - tap <= 650   # the camera's own move: every frame the browser painted
        if not keep or T[i] - T[keep[-1]] >= (16 if gliding else 80):
            keep.append(i)
    frames, durs = [end], [1600]
    for k, i in enumerate(keep):
        im = Image.open(files[i]).convert('RGB')
        if im.size != end.size:
            im = im.resize(end.size, Image.BOX)
        frames.append(im)
        durs.append(max(20, (T[keep[k + 1]] - T[i]) if k + 1 < len(keep) else 1200))   # browsers slow a frame under 11 ms, never one of 20
    out = os.path.join(DIR, 'now.webp')
    frames[0].save(out, 'WEBP', save_all=True, append_images=frames[1:], duration=durs, loop=0, quality=72, method=4)
    print('CREWFIGHT film', len(frames), 'frames', round(sum(durs) / 1000, 1), 's', round(os.path.getsize(out) / 1048576, 2), 'MB')


if __name__ == '__main__':
    main()
