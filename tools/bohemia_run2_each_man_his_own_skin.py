#!/usr/bin/env python3
"""RUN TWO [each man his own skin], 10/19/26 (rule 120(d); EYES 6ec3c854 measured 118 faces beside their bodies, 115 BACK,
because every flat body was painted the player's skin; his words 'Black people looking like white people').

From [the 3D models on your screens] (this round) the bodies RUN TWO's screens draw are 3D renders, not the flat sheets
EYES read. This re-reads every face beside the body it now stands beside, ON RUN TWO's SCREENS, with EYES' OWN READ
(tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py, imported, never copied or edited: its 3D portrait read and
its skin verdict, ITA band equal or next and 12 L* or less):
  THE CREW CARD   PORTRAIT's crew rig body (records/target/portrait/rig/crew/<look>/rig_<turn>.png) beside the face
                  rendered from that same model, YOU and the twelve cast looks.
  THE SETTLEMENT  CHARACTER's thirteen gangs standing (records/target/character/rig/<gang>/rig_<turn>.png) beside
                  PORTRAIT's head for the gang. CHARACTER's renders carry no material-ID pass, so the skin is read off
                  PORTRAIT's render of the same gang body (its ID pass names the gang's own '<gang>_skin' material), and
                  this tool first proves the two renders are one setup: every render setting equal and the skin
                  material and its wear the same. A body whose proof fails is NO BODY READ, never a guess.
THE BODY'S SKIN: the pixels whose ID colour is the skin material, pooled over the eight turns, the lit half (EYES' own
rule for a 3D read: the median of the pixels at or over the median lightness).
    python3 tools/bohemia_run2_each_man_his_own_skin.py        # writes records/target/RUN2_EACH_MAN_HIS_OWN_SKIN.json
"""
import importlib.util, json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EYES = 'tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py'
OUT = 'records/target/RUN2_EACH_MAN_HIS_OWN_SKIN.json'
TURNS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
CREW = ['you', 'cast_longcoat', 'cast_barearms', 'cast_pack', 'cast_skirt', 'cast_widebrim', 'cast_cape',
        'cast_apron', 'cast_poncho', 'cast_bedroll', 'cast_shorts', 'cast_satchel', 'cast_shortcoat']
GANGS = ['anarchists', 'blues', 'caravans', 'cartel', 'church', 'colorful', 'homeless',
         'mob', 'network', 'reds', 'remnants', 'trades', 'volunteers']


def P(rel):
    return os.path.join(ROOT, rel)


def eyes():
    spec = importlib.util.spec_from_file_location('eyes_face_body', P(EYES))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def hexrgb(h):
    """The ID table's hex is LINEAR and the PNG is sRGB (COOK THREE's finding, 10/19): encode before comparing."""
    c = np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float) / 255.0
    return 255.0 * np.where(c <= 0.0031308, 12.92 * c, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def body_skin(E, folder, material):
    """The lit half of the skin-ID pixels over the eight turns of one PORTRAIT rig render."""
    j = json.load(open(P(folder + '/rig.json')))
    idc = j['id_table'].get(material)
    if not idc:
        return None, 'no %s in the ID table' % material
    want, pix = hexrgb(idc), []
    for t in TURNS:
        rp, ip = P('%s/rig_%s.png' % (folder, t)), P('%s/rigid_%s.png' % (folder, t))   # rigid_: the ID pass cut as the render is
        if not (os.path.exists(rp) and os.path.exists(ip)):
            continue
        r = np.array(Image.open(rp).convert('RGBA')).astype(float)
        i = np.array(Image.open(ip).convert('RGBA')).astype(float)
        if r.shape != i.shape:
            continue
        m = (np.abs(i[..., :3] - want).sum(-1) < 30) & (r[..., 3] > 200)
        if m.any():
            pix.append(r[m][:, :3])
    if not pix:
        return None, 'no skin pixels found'
    px = np.concatenate(pix)[None, :, :]
    L3 = E.lab(np.concatenate([px, np.full(px.shape[:2] + (1,), 255.0)], -1))[0]
    lit = L3[:, 0] >= np.median(L3[:, 0])
    return {'skin_lab': [float(v) for v in np.median(L3[lit], 0)], 'px': int(px.shape[1])}, None


def same_setup(gang):
    """CHARACTER's render of the gang and PORTRAIT's render of the same body: one camera, one light, one skin."""
    a = json.load(open(P('records/target/character/rig/%s/rig.json' % gang)))
    b = json.load(open(P('records/target/portrait/rig/crew/faction_%s/rig.json' % gang)))
    diff = [k for k in set(a['rig_settings']) | set(b['rig_settings']) if a['rig_settings'].get(k) != b['rig_settings'].get(k)]
    mat = gang + '_skin'
    sa, sb = a.get('source_pass') or {}, b.get('source_pass') or {}
    ok_mat = mat in (sb.get('materials') or []) and mat in (sa.get('materials') or [])
    wear = (sa.get('wear_by_material') or {}).get(mat) == (sb.get('wear_by_material') or {}).get(mat)
    return (not diff and ok_mat and wear), {'settings_apart': diff, 'skin_material_in_both': ok_mat, 'skin_wear_same': wear}


def read_all(E, looks=None, face_of=None):
    """One row per person RUN TWO's screens draw. face_of(look) lets a control read another man's face."""
    rows = []
    for look in looks or (CREW + ['faction_' + g for g in GANGS]):
        g = look[8:] if look.startswith('faction_') else None
        screen = 'the settlement' if g else 'the crew card'
        drawn = ('records/target/character/rig/%s' % g) if g else ('records/target/portrait/rig/crew/%s' % look)
        row = {'who': look, 'screen': screen, 'body_drawn': drawn + '/rig_<turn>.png',
               'face': 'records/target/portrait/crew/%s/rest_128.png' % look}
        proof = None
        if g:
            ok, proof = same_setup(g)
            row['one_setup'] = proof
            if not ok:
                row['verdict'] = 'NO BODY READ'; rows.append(row); continue
        mat = (g + '_skin') if g else ('crew_%s_skin' % look)
        body, why = body_skin(E, 'records/target/portrait/rig/crew/' + look, mat)
        face = E.portrait_read(face_of(look) if face_of else look)
        if not body or not face or 'skin_lab' not in face:
            row['verdict'] = 'NO BODY READ' if not body else 'NO FACE READ'
            row['why'] = why or (face or {}).get('problems'); rows.append(row); continue
        legs = E.compare(body, face)
        row.update({'body_skin': E.skin_of(body['skin_lab']), 'body_px': body['px'], 'face_skin': E.skin_of(face['skin_lab']),
                    'legs': legs, 'verdict': E.verdict_of(legs)})
        rows.append(row)
    return rows


def main():
    E = eyes()
    rows = read_all(E)
    counts = {}
    for r in rows:
        counts[r['verdict']] = counts.get(r['verdict'], 0) + 1
    out = {'tool': 'tools/bohemia_run2_each_man_his_own_skin.py', 'lane': 'run 2', 'row': '[each man his own skin]',
           'rule': '120(d)', 'read_with': EYES, 'draft': True, 'counts': counts, 'rows': rows}
    json.dump(out, open(P(OUT), 'w'), indent=1)
    for r in rows:
        s = [l for l in r.get('legs', []) if l['leg'] == 'skin']
        print('%-6s %-20s %-16s %s' % (r['verdict'], r['who'], r['screen'], s[0]['said'] if s else r.get('why', r.get('one_setup', ''))))
    print('\nEACH MAN HIS OWN SKIN on RUN TWO\'s screens: %s' % json.dumps(counts))
    return 0 if set(counts) == {'PASS'} else 1


if __name__ == '__main__':
    sys.exit(main())
