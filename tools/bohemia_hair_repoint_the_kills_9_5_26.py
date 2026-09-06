#!/usr/bin/env python3
"""
BOHEMIA -- REPOINT THE PEOPLE OFF THE THIRTEEN DEAD HAIRCUTS  (COOK, 9/5/26)

WHAT CAME BEFORE THIS. tools/bohemia_hair_graveyard_enforce_9_5_26.py flipped the
thirteen haircuts Paolo killed on 8/20 from st:'canon' to st:'dead' and rewrote
their graveyard tokens into the form the code actually uses. The kills had been
shipping as canon for sixteen days because the registry spelled them
`n:'HAIR - SUN CROP'` (the judging tool's DISPLAY name) while the build has always
said `n:'SUN CROP'` -- THE GATE WAS GUARDING A STRING THAT NEVER EXISTED.

WHAT THE FIXED TOKENS THEN FOUND, WHICH IS THE ACTUAL POINT OF A GRAVEYARD GATE.
bohemia_graveyard_gate.py's own docstring names this exact failure:

    "The failure mode is not somebody lovingly resurrecting a killed asset. It is
     a config file three docs deep still POINTING at one, months later, because
     the kill happened somewhere else and nothing swept for the pointers."

NINETEEN AUTHORED PEOPLE ARE WEARING THE CORPSES BY NAME:
    3  FAMILY_CAST      RAY (father), DENISE (mother), NINA (sister)
   11  FACTION_LOOKS    Caravans, Anarchists, Homeless, Church, Reds, Cartel,
                        Trades, Volunteers, and the rest
    5  CITY_CAST_LOOKS  longcoat, barearms, pack, skirt, widebrim
And they RENDER. The draw path is `GARMENTS.find(x => x.n === nm)` -- it resolves
by NAME and never looks at `st`. So flipping the rows to dead removed the cuts
from the crowd (BOH_PERSONLOOK filters st==='canon') and from the face maker, and
left nineteen hand-authored characters still standing there in a dead shape.

HOW THE REPLACEMENT IS CHOSEN, AND IT IS NOT TASTE. A cut in this generator IS its
dials. Nearest living cut by the dials that decide the silhouette:

    dist = |side diff| + |front diff| + 0.08 * |vol diff|

side is length, front is the fringe line, vol is height; the 0.08 puts vol (0..3)
on the same footing as the others (0..2.4). AND THE TEXTURE FAMILY MUST MATCH --
a plain cut may not become locs or a braid, because that is a different shape, not
a nearer one. Candidates are the canon pool read out of the build at run time, so
this tool cannot go stale against a wardrobe that grows.

*** THE HOLE THIS EXPOSES, AND I AM NOT PAPERING OVER IT. ***
Every GREY and every WHITE haircut in the game is dead. ASH SWEEP and SALT CROWN
were H_GRY, GREY WISPS was H_WHT, LOW BUN was H_GRY and died 8/2. All eleven
surviving canon cuts are H_BLK, H_BRN or H_SND. A worn hair garment draws in its
OWN baked ramp -- there is no recolour on the G_WORN path -- so RAY the father,
the Church and the old wide-brim citizen lose their grey when they are repointed.
I am NOT cooking grey recolours to hide it: "I want DIVERSE LOOKS, not recolors"
(Paolo 7/18), and a fresh hair SHAPE is blocked until the east/west facings render
correctly (the 8/20 record: "cooking new hair into a broken render is how you get
a fourteenth kill"). It goes in the handoff as a ruling, not a guess.

WHAT IT DELIBERATELY DOES NOT DO: touch the dead rows themselves. They stay in the
build as tombstones exactly like every other dead garment, which is what the
CLOTHES board's "DOWN (graveyard)" label reads.

    python3 tools/bohemia_hair_repoint_the_kills_9_5_26.py
"""
import os, re, sys

REPO  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html')

# His thirteen, 8/20, records/BOHEMIA_VERDICT_HAIR_ROUND4_8_20_26.txt
KILLED = ["SUN CROP", "DUSK SHAG", "ASH SWEEP", "SALT CROWN", "BUZZ CUT", "CROP",
          "SLICK BACK", "BOWL CUT", "FRINGE", "SHOULDER LENGTH", "LONG LOOSE",
          "WOLF CUT", "GREY WISPS"]

ROW = re.compile(r"\{n:'([^']+)',st:'(canon|dead|cook)',layer:'hair'[^\n]*?genHair\(g,\{([^}]*)\}")


def dials(opts):
    d = {}
    for k in ('side', 'front', 'vol', 'flare'):
        m = re.search(k + r":\s*([0-9.]+)", opts)
        d[k] = float(m.group(1)) if m else 0.0
    m = re.search(r"tex:'([^']+)'", opts)
    d['tex'] = m.group(1) if m else 'solid'
    d['tie'] = bool(re.search(r"tie:'", opts))
    d['strip'] = bool(re.search(r"strip:", opts))
    return d


def main():
    src = open(ALPHA, encoding='utf-8').read()
    rows = {n: (st, dials(o)) for n, st, o in ROW.findall(src)}

    canon = {n: d for n, (st, d) in rows.items() if st == 'canon'}
    if len(canon) < 8:
        sys.exit('ABORT: only %d canon haircuts left; refusing to repoint into a bare pool.' % len(canon))

    print('\n=== REPOINT THE NINETEEN OFF THE THIRTEEN DEAD CUTS (9/5) ===')
    print('  canon pool: %d cuts' % len(canon))

    plan = {}
    for k in KILLED:
        if k not in rows:
            sys.exit('ABORT: %s is not a hair row in the build.' % k)
        if rows[k][0] != 'dead':
            sys.exit('ABORT: %s is still st:%r -- run the enforce tool first.' % (k, rows[k][0]))
        d = rows[k][1]
        best, bd = None, 1e9
        for cn, cd in canon.items():
            if cd['tex'] != d['tex'] or cd['tie'] != d['tie'] or cd['strip'] != d['strip']:
                continue                       # a different shape is not a nearer one
            dist = abs(cd['side'] - d['side']) + abs(cd['front'] - d['front']) \
                 + 0.08 * abs(cd['vol'] - d['vol'])
            if dist < bd:
                best, bd = cn, dist
        if best is None:
            sys.exit('ABORT: no living cut in %s\'s texture family (%s).' % (k, d['tex']))
        plan[k] = (best, bd)

    # ---- CITY_CAST_LOOKS FIRST, UNDER ITS OWN TWO RULES --------------------
    # This one table is not just six people, it is a TEST: "THE TEST IS GREYSCALE:
    # strip the colour and six different outlines must remain", held by
    # gates/city_cast_silhouette_gate.js. Nearest-cut alone breaks it twice over --
    # two pairs land on the same cut (six outlines become four), and the member the
    # table calls "smallest" gets handed LAYERED FALL, the largest untextured cut in
    # the pool, which squeezed the cast's size spread from 11.2% to 9.1% and turned
    # a check that was green red. So inside this table the repoint carries the two
    # properties the table was authored to have:
    #   1. NO TWO MEMBERS SHARE A CUT (assigned greedily, nearest first).
    #   2. A REPOINT MAY NOT OVERTURN THE MEMBER'S OWN WRITTEN BRIEF. `skirt` says
    #      "smallest", so it may not take a cut that draws bigger than the one it
    #      replaces (side x (1 + vol) as the stand-in for drawn bulk).
    # THIS IS NOT TUNING TO A GATE. Both rules are the table's stated purpose, quoted
    # in its own comment; the number is how the machine notices when they are broken.
    i0 = src.index('const CITY_CAST_LOOKS')
    i1 = src.index('];', i0) + 2
    blk = src[i0:i1]
    members = re.findall(r"id:'([^']+)'[\s\S]*?worn:\{hair:'([^']+)'", blk)
    taken = {h for _mid, h in members if h not in KILLED}
    order = sorted([(mid, h) for mid, h in members if h in KILLED],
                   key=lambda mh: plan[mh[1]][1])
    print('  CITY_CAST_LOOKS, six outlines, assigned distinct:')
    for mid, dead_cut in order:
        d = rows[dead_cut][1]
        bulk = d['side'] * (1 + d['vol'])
        cands = []
        for cn, cd in canon.items():
            if cn in taken:
                continue
            if cd['tex'] != d['tex'] or cd['tie'] != d['tie'] or cd['strip'] != d['strip']:
                continue
            if mid == 'skirt' and cd['side'] * (1 + cd['vol']) > bulk:
                continue                       # the brief says smallest
            cands.append((abs(cd['side'] - d['side']) + abs(cd['front'] - d['front'])
                          + 0.08 * abs(cd['vol'] - d['vol']), cn))
        if not cands:
            sys.exit('ABORT: no distinct living cut left for %s.' % mid)
        cands.sort()
        dist, pickd = cands[0]
        taken.add(pickd)
        blk = blk.replace("worn:{hair:'%s'" % dead_cut, "worn:{hair:'%s'" % pickd, 1)
        print('    %-9s %-16s -> %-14s dist %.2f' % (mid, dead_cut, pickd, dist))
    if len(taken) != len(members):
        sys.exit('ABORT: the six city cast outlines did not come out distinct.')
    src = src[:i0] + blk + src[i1:]

    changed = len(order)
    for k, (to, bd) in sorted(plan.items()):
        old, new = "worn:{hair:'%s'" % k, "worn:{hair:'%s'" % to
        n = src.count(old)
        src = src.replace(old, new)
        changed += n
        print('  %-16s -> %-14s  dist %.2f   %d wearer%s'
              % (k, to, bd, n, '' if n == 1 else 's'))

    # GUARDS. A cook that cannot prove what it did is a diff with extra steps.
    left = [k for k in KILLED if ("worn:{hair:'%s'" % k) in src]
    if left:
        sys.exit('ABORT: still worn after the rewrite: ' + ', '.join(left))
    for k, (to, _) in plan.items():
        if rows[to][0] != 'canon':
            sys.exit('ABORT: repointed %s at %s, which is not canon.' % (k, to))
    if changed != 19:
        print('  NOTE: %d wearers moved (19 when this was written; the tables have grown or shrunk).'
              % changed)

    open(ALPHA, 'w', encoding='utf-8').write(src)
    print('  wearers moved off a corpse: %d' % changed)

    # ---- the four stale quotations elsewhere in the tree ---------------------
    # Old patch tools and records quote the pre-kill row text verbatim. They are
    # history, not pointers, but the graveyard gate cannot tell a quotation from a
    # config line -- so say DEAD next to each, which is what the gate reads.
    NOTES = [
      ('records/BOHEMIA_NOBODY_STANDS_IN_THE_STREET_ALL_DAY_8_4_26.md',
       "    {n:'SUN CROP',st:'canon',layer:'hair',lux:true,gen:...}",
       "(SUN CROP is DEAD as of 8/20/26 -- quoted here only as the row FORMAT.)\n"),
      ('tools/bohemia_hair_wave2_patch.py',
       "OLD_SB = \"{n:'SLICK BACK',st:'canon',layer:'hair'",
       "# SLICK BACK was KILLED 8/20/26. This tool is spent history; the string below is\n"
       "# the row as it stood then and no longer matches the build.\n"),
      ('tools/bohemia_hair_factory_patch.py',
       "    {n:'BOWL CUT',st:'canon',layer:'hair'",
       "    /* BOWL CUT, FRINGE and SLICK BACK below were KILLED 8/20/26 -- this is the\n"
       "       spent patch text, kept as the record, not a live catalogue. */\n"),
      ('tools/bohemia_wardrobe_extract.py',
       "#     {n:'SUN CROP',st:'canon',layer:'hair',lux:true,gen:...}",
       "# (SUN CROP is DEAD, KILLED 8/20/26; quoted for its TAG ORDER, not as a live row.)\n"),
    ]
    for rel, anchor, note in NOTES:
        p = os.path.join(REPO, rel)
        t = open(p, encoding='utf-8').read()
        if note.strip().split('\n')[0] in t:
            print('  note already present: %s' % rel); continue
        if anchor not in t:
            print('  ANCHOR GONE, skipped: %s' % rel); continue
        t = t.replace(anchor, note + anchor, 1)
        open(p, 'w', encoding='utf-8').write(t)
        print('  tombstone note added: %s' % rel)

    print('=== done ===\n')


if __name__ == '__main__':
    main()
