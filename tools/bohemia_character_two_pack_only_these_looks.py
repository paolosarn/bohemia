#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER 2 [the cone comes off] (11/26, rule 470(f)): PACK ONLY THESE LOOKS INTO THE SHEETS AS THEY STAND.

WHY THIS EXISTS, MEASURED ON A FRESH BOX: the master rig's renders are .gitignore'd (records/target/combat/rig/,
records/target/animation/idles/), so a fresh session holds only the renders it made itself. Two owners' pack steps rebuild
their whole output from the renders on disk:
  COMBAT    tools/bohemia_combat_the_fight_wears_the_rig.py pack     rebuilds slices/fight_rig/fight_rig.json and faces.webp
            from the looks it finds rendered: run here it keeps the two looks re-made and DROPS the other named looks
  ANIMATION tools/bohemia_animation_everybody_idles.py pack          first deletes every .webp and .json in slices/rig_idles,
            then packs what is rendered: run here it wipes every other man's idles and the map's sheet
So a lane that re-renders two looks cannot call either pack as written. This tool runs each owner's pack UNEDITED, imported,
with its output folder pointed at a scratch folder (only these looks' renders exist there), then copies only these looks'
files into the real folder and writes only these looks' entries into the real index; every other line and file stays as it
was, byte for byte. (ANIMATION's hold and melee packs and COMBAT's guns pack already update in place and take a look list;
call them directly.)

    python3 tools/bohemia_character_two_pack_only_these_looks.py fight faction_caravans cast_widebrim
    python3 tools/bohemia_character_two_pack_only_these_looks.py idles faction_caravans cast_widebrim
"""
import json, os, shutil, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))


def fight(looks):
    import bohemia_combat_the_fight_wears_the_rig as CM
    from PIL import Image
    real = os.path.join(ROOT, CM.OUT); ip = os.path.join(real, 'fight_rig.json'); idx = json.load(open(ip))
    tmp = tempfile.mkdtemp(prefix='fight_rig_', dir=os.path.join(ROOT, 'records/target/combat'))
    try:
        mine = [l for l in CM.looks() if l[0] in looks]
        CM.looks = lambda mine=mine: mine   # the owner's pack, unedited, over these looks only
        CM.OUT = os.path.relpath(tmp, ROOT)
        CM.pack()
        t = json.load(open(os.path.join(tmp, 'fight_rig.json')))
        faces = Image.open(os.path.join(real, idx['faces']['file'])).convert('RGBA'); order = idx['faces']['order']; F = idx['faces']['size']
        for name, kind, src in mine:
            if name not in t['looks']: raise SystemExit('NOT RENDERED: %s' % name)
            e = dict(idx['looks'].get(name, {})); e.update(t['looks'][name])   # his guns line (the guns pack's) stays
            idx['looks'][name] = e
            shutil.copyfile(os.path.join(tmp, t['looks'][name]['file']), os.path.join(real, t['looks'][name]['file']))
            if name in order:
                i = order.index(name); f = CM.face_of(name, kind, src)
                if f.size != (F, F): f = f.resize((F, F), Image.BOX)
                faces.paste(Image.new('RGBA', (F, F), (0, 0, 0, 0)), (i * F, 0)); faces.paste(f, (i * F, 0))
            print('MERGED', name, t['looks'][name]['file'])
        faces.save(os.path.join(real, idx['faces']['file']), 'WEBP', quality=85, alpha_quality=100, method=6)
        json.dump(idx, open(ip, 'w'), indent=1)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def idles(looks):
    import bohemia_animation_everybody_idles as ID
    real = os.path.join(ROOT, ID.OUT); ip = os.path.join(real, 'rig_idles.json'); idx = json.load(open(ip))
    tmp = tempfile.mkdtemp(prefix='rig_idles_', dir=os.path.join(ROOT, 'records/target/animation'))
    rd = os.path.join(ROOT, ID.RENDERS)
    try:
        # only these looks' renders in a scratch renders folder (links), so the owner's pack sees these looks and nothing else
        rtmp = os.path.join(tmp, '_renders'); os.makedirs(rtmp)
        for l in looks: os.symlink(os.path.join(rd, l), os.path.join(rtmp, l))
        ID.RENDERS = os.path.relpath(rtmp, ROOT); out = os.path.join(tmp, 'out'); os.makedirs(out); ID.OUT = os.path.relpath(out, ROOT)
        ID.pack_map = lambda index: None   # the map's sheet is not ours and its renders are not here: it stays as it is
        ID.pack()
        t = json.load(open(os.path.join(out, 'rig_idles.json')))
        for l in looks:
            if l not in t['looks']: raise SystemExit('NOT PACKED: %s' % l)
            for fn in os.listdir(out):
                if fn == l + '.json' or (fn.startswith(l + '_') and fn.endswith('.webp') and fn[len(l) + 1:-5] in ('bare', 'carry', 'guns')):
                    shutil.copyfile(os.path.join(out, fn), os.path.join(real, fn)); print('MERGED', fn)
            idx['looks'][l] = t['looks'][l]
        json.dump(idx, open(ip, 'w'), separators=(',', ':'))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def faces(looks):
    """PORTRAIT's hand-off (crew_faces, then the face-is-the-body's-face masks) for these looks' files only: the 64 and 128 of
    the rest face, the four mouths and the three moods, and the mask, cut by PORTRAIT's own window from the frames just
    rendered. The manifest (records/target/portrait/crew/BOHEMIA_CREW_FACES.json) is not rewritten: its rows and the paths
    in them stay as they are (the gangs' faces load by file name, engine/bohemia_crew_faces.js)"""
    import bohemia_portrait_the_head_from_the_model as HT
    from PIL import Image
    man = json.load(open(os.path.join(ROOT, 'records/target/portrait/crew/BOHEMIA_CREW_FACES.json')))
    for look in looks:
        fr = os.path.join(ROOT, 'records/target/portrait/rig/crew', look)
        mr = os.path.join(ROOT, 'records/target/portrait/rig/mask', look)
        pj = json.load(open(os.path.join(fr, 'portrait.json')))
        src = dict(rest=pj['files'][0], **pj['expression_files'])
        od = os.path.join(ROOT, 'records/target/portrait/crew', look)
        keys = man.get('keys') or ['rest', 'A', 'E', 'O', 'M', 'Angry', 'Sad', 'Surprised']
        rest = Image.open(os.path.join(ROOT, src['rest'])).convert('RGBA'); box = HT.hand_off_window(rest, pj['head_px'])
        for k in keys:
            if k not in src: continue
            sq = Image.open(os.path.join(ROOT, src[k])).convert('RGBA').crop(HT.hand_off_window(Image.open(os.path.join(ROOT, src[k])).convert('RGBA'), pj['head_px']))
            for n in (64, 128): sq.resize((n, n), Image.BOX).save(os.path.join(od, '%s_%d.png' % (k, n)))
        mk = Image.open(os.path.join(mr, 'rig_portrait_S.png')).convert('RGBA').crop(box)
        for n in (64, 128): mk.resize((n, n), Image.NEAREST).save(os.path.join(od, 'mask_%d.png' % n))
        print('FACES', look, len(keys), 'and the mask')


if __name__ == '__main__':
    cmd, looks = sys.argv[1], sys.argv[2:]
    {'fight': fight, 'idles': idles, 'faces': faces}[cmd](looks)
