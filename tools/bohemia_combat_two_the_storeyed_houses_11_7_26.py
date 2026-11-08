#!/usr/bin/env python3
"""THE HOUSES OF TWO AND THREE STOREYS (COMBAT TWO, 11/7/26; VAMILY rule 423(d), ask line 487)

Paolo 11/7: 'if it's one story I can still be on top of it, that's a defense boost, but not a range offense boost... converted to
two or three story houses... there's no ladder system, the ladder system is not realistic... I like the new assets for the
houses.' Rule 423(d): a house is one, two or three storeys, most two or three.

THE HOUSES HE LIKES ARE COOK'S FIVE RANCHES (tools/bohemia_cook_model_buildings.py: ranch_plain, _porch, _wing, _garage,
_carport, built in Blender to COOK FOUR's family, 2.7 m to the eave, rendered through the master rig). This tool makes the same
five with one or two more storeys and nothing else new: it calls COOK's own builder, then for each storey above the first it
repeats the main body's walls and windows 2.7 m higher (a real storey: the same wall, the same windows) and lifts the main roof
and the chimney onto the top storey; the porch, the wing, the garage and the carport stay one storey at the side, as on a real
two-storey ranch. Then COOK's own render (the master rig's source pass, dents, one sun, the 45 degree camera at 57 px a metre,
the S facing, its own cast shadow, the snap toward his settlement family, the ring). NEW NAMES ONLY: bld_ranch_<kind>_<n>s.glb and
records/target/master_rig/cook_bld_ranch_<kind>_<n>s/; the approved one-storey houses are never touched.

  /tmp/claude-0/v/bin/python tools/bohemia_combat_two_the_storeyed_houses_11_7_26.py [ranch_plain_2s ...] [--samples N]   (about 75 s each)
  python3 tools/bohemia_combat_two_the_storeyed_houses_11_7_26.py --cut      (the renders cut to the fight's ruler, storeys.json)
  (venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy)

REFERENCE CHECK (the 9/4 standing duty): COOK's own reference (a 1960s Las Vegas ranch, 2.7 m to the eave, a 4:12 roof);
a two-storey Las Vegas tract house is the same stucco box a storey taller, its garage or carport one storey beside it.
REUSE CHECK (REUSE-FIRST): COOK's builder and render, the master rig; nothing new is modelled but the copies of a storey.
STAND-IN (rule 408(c)): no DIRECTION pass yet; the one-storey ranches are the look he liked, these are made from their recipe.
"""
import os, sys, json
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
CUT = '--cut' in sys.argv
if not CUT:
    import bohemia_cook_model_buildings as CM

STOREY = 2.7          # COOK's ranch_body h: the eave of a 1960s ranch
# looked at on the sheet, 11/7: the wing's one-storey wing stands in FRONT of the main body (south of its wall), so beside two or
# three storeys it reads as a tower; rendered, kept in master_rig, never cut for the board (the board's taller houses: four models)
CUT_SKIP = {'ranch_wing'}
KINDS = {'ranch_plain': 'rp', 'ranch_porch': 'ro', 'ranch_wing': 'rw', 'ranch_garage': 'rg', 'ranch_carport': 'rc'}


def stack(bpy, p, n):
    """the main body (p_walls and p_win*) repeated n - 1 times a storey up; the main roof (p_roof*) and chimney (p_chim*) on top"""
    up = (n - 1) * STOREY
    objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    body = [o for o in objs if o.name == p + '_walls' or o.name.startswith(p + '_win')]
    lift = [o for o in objs if o.name.startswith(p + '_roof') or o.name.startswith(p + '_chim')]
    for o in lift:
        o.location.z += up
    for k in range(1, n):
        for o in body:
            c = o.copy()
            if o.data: c.data = o.data.copy()
            c.name = '%s_s%d' % (o.name, k + 1)
            c.location.z += k * STOREY
            bpy.context.scene.collection.objects.link(c)
    bpy.context.view_layer.update()


for base, p in ([] if CUT else KINDS.items()):
    for n in (2, 3):
        name = '%s_%ds' % (base, n)
        CM.BUILDERS[name] = (lambda b, pp, nn: (lambda bpy, mu: (CM.BUILDERS[b](bpy, mu), stack(bpy, pp, nn))))(base, p, n)
        CM.TWINS[name] = CM.TWINS[base]

def cut():
    """each render cut to the fight's ruler (57 -> 42.9 px a metre) over its own cast shadow, exactly as the one-storey ranches
    were cut for the street board (tools/bohemia_combat_two_the_street_board_kit_11_6_26.py cut_rig): slices/fight_ground/
    street_board/storeys/ and storeys.json {2: {model: piece}, 3: {...}}, each piece stage stand_in"""
    from PIL import Image
    G = json.load(open(os.path.join(R, 'slices/fight_ground/fight_ground.json')))
    PPMF = G['px_per_metre']; out = os.path.join(R, 'slices/fight_ground/street_board/storeys'); os.makedirs(out, exist_ok=True)
    res = {'2': {}, '3': {}}
    for base in [k for k in KINDS if k not in CUT_SKIP]:
        for n in (2, 3):
            d = os.path.join(R, 'records/target/master_rig/cook_bld_%s_%ds' % (base, n))
            if not os.path.exists(os.path.join(d, 'rig.json')): print('missing', d); continue
            meta = json.load(open(os.path.join(d, 'rig.json')))
            body = Image.open(os.path.join(d, 'rig_S.png')).convert('RGBA'); shade = Image.open(os.path.join(d, 'shadow_S.png')).convert('RGBA')
            k = PPMF / float(meta['ppm']); bb = body.split()[3].getbbox()
            sh = Image.new('RGBA', body.size, (0, 0, 0, 0)); sh.alpha_composite(shade); sh.alpha_composite(body)
            full = sh.getbbox(); im = sh.crop(full)
            W, H = max(1, round(im.width * k)), max(1, round(im.height * k)); im = im.resize((W, H), Image.LANCZOS)
            f = 'bld_%s_%ds.webp' % (base, n); im.save(os.path.join(out, f), quality=86, alpha_quality=90, method=6)
            res[str(n)][base] = dict(src='storeys/' + f, w=W, h=H, foot=[round(((bb[0] + bb[2]) / 2 - full[0]) * k, 1), round((bb[3] - full[1]) * k, 1)],
                                     dims_m=meta['real_dims_m'], storeys=n, model=meta['model'], rig='records/target/master_rig/cook_bld_%s_%ds/rig_S.png' % (base, n),
                                     stage='stand_in', made_from='COOK\'s ' + base + ' (tools/bohemia_cook_model_buildings.py), a storey repeated')
    json.dump(dict(version='storeys-11-7', lane='combat 2', rule='423(d) (ask line 487)', made_by='tools/bohemia_combat_two_the_storeyed_houses_11_7_26.py',
                   storey_m=STOREY, houses=res), open(os.path.join(R, 'slices/fight_ground/street_board/storeys.json'), 'w'), indent=1)
    print('cut', sum(len(v) for v in res.values()), 'pieces,', round(sum(os.path.getsize(os.path.join(out, x)) for x in os.listdir(out)) / 1024), 'KB')


if __name__ == '__main__' and CUT:
    cut(); sys.exit(0)

if __name__ == '__main__':
    a = sys.argv[1:]
    smp = int(a[a.index('--samples') + 1]) if '--samples' in a else None
    want = [x for x in a if x in CM.BUILDERS and x.endswith('s') and x[-2:-1].isdigit()] or ['%s_%ds' % (b, n) for b in KINDS for n in (2, 3)]
    for name in want:
        CM.render(name, smp)
    sys.stdout.flush(); os._exit(0)
