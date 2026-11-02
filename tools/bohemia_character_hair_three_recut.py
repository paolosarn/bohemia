#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [hair three] -> the crowd: THE REPEATED HEADS GET THE NEW CUTS, AND THE HATS COME OFF

The valley's 156 rolled people (records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json, RUN TWO's roll off CHARACTER's book) wore 21
cuts, three of them on twelve people each, so a crowd of forty showed the same shaved skull or the same braids four times.
HAIR 3 adds twelve cuts. This step re-cuts the people past a cap of six a cut onto the new twelve (his gang's own cuts first,
the emptiest cut first), keeps everything else about each person (his skin, face, beard, mark, clothes; one id, one whole
person: his body, his walk and his portrait are rendered again from the same roll line), and takes the hat off everybody but
a few knit caps on shaved heads (his 'give them hairstyles'). Women keep their cut (her own body is ANIMATION's).

    python3 tools/bohemia_character_hair_three_recut.py plan        what would change, and the crowd numbers before and after
    python3 tools/bohemia_character_hair_three_recut.py apply       write the roll and clear the re-cut people's render stamps
    python3 tools/bohemia_character_hair_three_recut.py measure     the crowd numbers on the roll as it stands -> the record's json
then RUN TWO's own steps, unedited: batch (renders whoever's stamp is clear), fight-batch, fight-pack, bake, index.
"""
import collections, json, os, random, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_hair_three as H3  # noqa: E402

ROLL = os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')
MIX = os.path.join(ROOT, 'engine/bohemia_people_mix.js')
OUT = os.path.join(ROOT, 'records/target/character/BOHEMIA_HAIR_THREE_THE_CROWD.json')
CAP = 6            # no cut on more than six of the valley's people
HATS_KEPT = 3      # a knit cap stays on a few shaved heads, nowhere else
STAMP = 'hair-three-11-3'


def flags():
    """who is in your company and who stands on the fight's board, read off the mix the screens read"""
    out = {}
    for line in open(MIX):
        line = line.strip().rstrip(',')
        if line.startswith('{"look"'):
            p = json.loads(line); out[p['look']] = p
    return out


def crowd_numbers(R, n=40, seeds=200):
    """a crowd of forty dealt the way engine/bohemia_rig_bodies.js cast() deals one (a shuffle of the valley's people, your
    company out), over many places: how many different cuts it shows, how many heads repeat a cut already on the street, the
    most heads on one cut, and how many wear a hat"""
    F = flags(); pool = [p for p in R if not F.get('person_' + p['id'].lower(), {}).get('company')]
    rng = random.Random(7); d, rep, top, hats = [], [], [], []
    for _ in range(seeds):
        c = rng.sample(pool, n); cc = collections.Counter(p['hair_cut'] for p in c)
        d.append(len(cc)); rep.append(n - len(cc)); top.append(max(cc.values())); hats.append(sum(1 for p in c if p.get('hat')))
    m = lambda a: round(sum(a) / len(a), 1)
    cuts = collections.Counter(p['hair_cut'] for p in R)
    return dict(people=len(R), cuts_worn=len(cuts), most_on_one_cut=max(cuts.values()), hats=sum(1 for p in R if p.get('hat')),
                crowd_of=n, crowd_different_cuts=m(d), crowd_repeated_heads=m(rep), crowd_most_on_one_cut=m(top), crowd_hats=m(hats))


def plan(R):
    F = flags()
    def rank(p):   # who is re-cut first: a man of the place who only stands, then one off the board, then the board's
        f = F.get('person_' + p['id'].lower(), {})
        return (1 if f.get('company') else 0, 1 if f.get('fight') else 0, p['id'])
    cuts = collections.Counter(p['hair_cut'] for p in R)
    new = collections.Counter({n: 0 for n in H3.CARD_ORDER})
    change = {}
    for cut, k in cuts.most_common():
        if k <= CAP: continue
        mine = sorted([p for p in R if p['hair_cut'] == cut and p.get('sex') != 'f'], key=rank, reverse=True)
        # keep CAP of them, your company's and the board's first (they stay as they are), re-cut the rest
        keep = sorted(mine, key=rank, reverse=True)[:CAP]
        for p in mine:
            if p in keep: continue
            g = p['gang'] if p['gang'] != 'Body' else 'Trades'
            opts = sorted(new, key=lambda n: (0 if g in H3.CUTS[n]['worn_by'] else 1, new[n], H3.ORDER.index(n)))
            n = opts[0]; new[n] += 1
            q = dict(p); q['hair_cut'] = n; q['recut'] = '%s (HAIR 3 11/3, was %s)' % (STAMP, cut)
            if H3.CUTS[n]['balding']:
                r = random.Random('hair3:' + p['id']).random()
                q['hair'] = ['tape_grey', 1] if r < 0.6 else ['cloth_black', 1] if r < 0.9 else ['clay_mustard', 0]
            if not H3.CUTS[n]['short']: q.pop('hat', None)
            change[p['id']] = q
    kept = 0
    for p in R:   # the hats come off, but for a few knit caps on shaved heads
        q = change.get(p['id'], p)
        if not q.get('hat'): continue
        if q['hair_cut'] in ('RAZOR SKULL', 'SALT SKULL', 'MANGE') and kept < HATS_KEPT:
            kept += 1; continue
        q = dict(q); q.pop('hat'); q['recut'] = q.get('recut', STAMP + ' (HAIR 3 11/3, the hat off)'); change[p['id']] = q
    return change, new


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'plan'
    R = json.load(open(ROLL))
    if cmd == 'measure':
        print(json.dumps(crowd_numbers(R), indent=1)); return
    change, new = plan(R)
    after = [change.get(p['id'], p) for p in R]
    F = flags()
    board = [i for i in change if F.get('person_' + i.lower(), {}).get('fight')]
    print('re-cut or hat off: %d people (%d of them on the fight\'s board)' % (len(change), len(board)))
    print('new cuts:', dict(new))
    b, a = crowd_numbers(R), crowd_numbers(after)
    print('before', json.dumps(b)); print('after ', json.dumps(a))
    if cmd == 'apply':
        json.dump(after, open(ROLL, 'w'), indent=1)
        for pid in change:   # RUN TWO's batch and fight-batch remake whoever's stamp is not theirs
            for d in ('records/target/character/barber', 'records/target/combat/rig'):
                f = os.path.join(ROOT, d, 'person_' + pid.lower(), 'made.txt')
                if os.path.exists(f): os.remove(f)
        rec = json.load(open(OUT)) if os.path.exists(OUT) else {}
        rec.update(what='HAIR 3 in the crowd: the repeated heads re-cut, the hats off (CHARACTER 11/3)', draft=True, cap=CAP,
                   hats_kept=HATS_KEPT, new_cuts=dict(new), changed={i: change[i]['recut'] for i in sorted(change)},
                   on_the_board=sorted(board), before=b, after=a)
        json.dump(rec, open(OUT, 'w'), indent=1)
        print('wrote', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
