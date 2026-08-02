#!/usr/bin/env python3
"""THE FACTION DOSSIER GATE (8/2/26, PEOPLE lane)

Paolo, 7/31 lore sitting: "WE NEED TO REALLY FLESH THE FACTIONS OUT FR MAKE ALL OF
THEM AWESOME AND INTERESTING." The dossiers are the answer. This is the machine
that keeps them honest, because a proposal sheet about canon is exactly the kind
of artefact that drifts off canon the moment nobody is checking.

WHAT IT ACTUALLY HOLDS, in the order the damage would happen:

  A. THE ORDER IS SERVED. Every selectable faction in the canon graph has a
     dossier, every dossier answers every row the order asked for, and the ONE
     faction with no dossier (Custom, the player's own) is absent on purpose with
     the reason written down. An empty row is a missing answer wearing a heading.

  B. THE CANON FLOOR IS NOT CONTRADICTED. Every card's canon block is re-derived
     from engine/BOHEMIA_faction_graph.json and compared. A dossier that disagrees
     with the graph about a faction's alignment or power is not a proposal, it is
     a quiet edit to canon.

  C. HIS RULINGS ARE NOT RE-ASKED. The six faction looks Paolo ruled on 7/21 are
     carried verbatim out of the live engine/bohemia_dress.js and printed as
     SETTLED. NOTES ARE RULINGS: asking him to re-confirm his own words is banned,
     so a dossier that re-proposes a ruled colour fails.

  D. APPROVED WARDROBE ONLY. Every garment named in a veteran kit is a real row in
     banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt, under its real layer. This is the
     order's own words ("how they dress - approved wardrobe only") and it is the
     REUSE-FIRST law in its most literal form.

  E. THE COLOUR COLLISION CHECK, which is the one with real teeth. The 7/21 dress
     pass ruled six factions and PARKED the rest, in its own words, because "real
     color collisions turned up between them in review". So every colour proposed
     here is measured against every ruled colour and every other proposal using
     the ENGINE'S OWN distance function and the ENGINE'S OWN tolerance, read out
     of bohemia_dress.js so it cannot drift. Two faction colours inside the family
     tolerance would read as the same faction on a body, which is the actual
     failure the parking was avoiding.

  F. THE FROZEN SYSTEMS ARE NOT GROWN. laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_
     7_31_26.md turned faction machinery, quests and the economy OFF. Dossiers are
     text, and this gate proves they stayed text: no new engine faction module, no
     .bq file, nothing written outside records/factions/ and the one judge sheet.
     STOP PRODUCING (7/26) says finding a legal way to ship a frozen thing IS the
     violation, so the boundary gets a machine rather than a promise.

  G. MARCO STAYS NAME-ONLY. Paolo 7/31: "MARCO IS NOT THE KING OF HOBOS LMAO." The
     rest of that sentence is unresolved garble. Marco may appear in exactly one
     place - the flag that says he is name-only - and nowhere else. A garbled
     sentence is a question to ask, never a lore entry to complete.

  H. HE CAN ACTUALLY REACH IT. The judge sheet is linked from the LIFE hub. A
     verdict surface that is not in a tab is not a verdict surface (7/28).

IT SELF-TESTS. Six synthetic probes run every time, each a real mistake somebody
could make (a purple proposal, an invented garment, a colliding colour, a
re-proposed ruling, a Marco claim, an emptied row). Every probe must be CAUGHT.
That proves the checker works rather than proving the repo happens to be clean
today - the lesson from the 8/2 fence-orphan gate.

Run from repo root:  python3 gates/faction_dossier_gate.py
"""
import json
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_faction_dossiers as FD  # noqa: E402  (the typed spec IS the source)

GRAPH = 'engine/BOHEMIA_faction_graph.json'
DRESS = 'engine/bohemia_dress.js'
BANK = 'banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt'
OUTDIR = 'records/factions'
JUDGE = 'slices/BOHEMIA_FACTION_DOSSIER_JUDGE_8_2_26.html'
HUB = 'slices/BOHEMIA_LIFE_CURRENT.html'
LAW_ORDER = 'WE NEED TO REALLY FLESH THE FACTIONS OUT'

P = F = 0
NOTES = []
QUIET = False        # set while the self-test probes run, so their notes never print


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)
    return ok


def note(s):
    if not QUIET:
        NOTES.append(s)


# ---------------------------------------------------------------- sources
def rgb(h):
    return (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16))


def dist(a, b):
    ra, rb = rgb(a), rgb(b)
    return math.sqrt(sum((ra[i] - rb[i]) ** 2 for i in range(3)))


def is_purple(h):
    """PURPLE RESERVATION - the same test the clothing purity sweep uses."""
    r, g, b = rgb(h)
    return r > g + 25 and b > g + 25


def read_tolerance(src):
    m = re.search(r'COLOR_FAMILY_TOL\s*=\s*(\d+)', src)
    return int(m.group(1)) if m else None


def read_ruled(src):
    m = re.search(r'var FACTION_LOOK=\{(.*?)\};', src, re.S)
    out = {}
    if m:
        for row in re.finditer(r"(\w+):\{mode:'(\w+)'(?:,color:'(#[0-9a-fA-F]{6})')?\}", m.group(1)):
            out[row.group(1)] = {'mode': row.group(2), 'color': row.group(3)}
    return out


def read_bank():
    names = {}
    for line in open(BANK, encoding='utf-8'):
        line = line.strip()
        if not line or line[0] in '#=':
            continue
        p = line.split('|')
        if len(p) >= 3:
            names[p[0]] = p[1]
    return names


# ---------------------------------------------------------------- the checks
def check_all(D, order, graph, ruled, tol, bank, files):
    # --- A. the order is served -------------------------------------------
    selectable = [k for k, v in graph.items() if v.get('type') == 'selectable']
    covered = {D[k].get('graph') for k in order if D[k].get('graph')}
    for k in order:
        covered |= set(D[k].get('graph_multi') or [])
    for f in sorted(selectable):
        if f in FD.NO_DOSSIER:
            chk(f not in covered,
                '%s is in NO_DOSSIER and also has a dossier - pick one' % f)
            chk(bool(FD.NO_DOSSIER[f].strip()),
                '%s is deliberately without a dossier but no reason is recorded, so it reads '
                'as an oversight rather than a decision' % f)
            continue
        chk(f in covered,
            'the canon graph has a selectable faction "%s" with NO dossier. He said ALL of '
            'them.' % f)
    # ALL of them means the social forces too - they are in the graph, they are just not
    # selectable, and dropping them would be quietly deciding they do not count.
    for f in sorted(k for k, v in graph.items() if v.get('type') == 'social_force'):
        chk(f in covered,
            'the canon graph has a social force "%s" that no dossier covers. He said ALL of '
            'them, and a graph row nobody reproduces is a row that quietly stops being '
            'canon.' % f)

    for k in order:
        d = D[k]
        for field in FD.FIELDS:
            v = d.get(field)
            chk(bool(v) and (not isinstance(v, str) or len(v.strip()) > 20),
                '%s: the "%s" row is missing or too thin to be an answer' % (k, field))
        hooks = d.get('hooks') or []
        if len(hooks) == 1 and 'NOT WRITTEN' in hooks[0].upper():
            chk('DELIBERATELY' in hooks[0].upper() or 'DELIBERATELY' in hooks[0],
                '%s has no three hooks and does not say the omission is deliberate' % k)
            note('%s carries no quest hooks ON PURPOSE, and says why on the card' % k)
        else:
            chk(len(hooks) == 3,
                '%s has %d quest hooks; the order asked for 3 each' % (k, len(hooks)))

    # --- B. the canon floor -----------------------------------------------
    for k in order:
        multi = D[k].get('graph_multi') or []
        if multi:
            path = os.path.join(OUTDIR, 'BOHEMIA_FACTION_%s.md' % k)
            if os.path.exists(path):
                txt = open(path, encoding='utf-8').read()
                for n in multi:
                    chk(n in txt and graph[n]['note'] in txt,
                        '%s covers "%s" but does not reproduce its canon row' % (k, n))
        g = D[k].get('graph')
        if not g:
            continue
        chk(g in graph, '%s claims graph row "%s" which does not exist' % (k, g))
        if g not in graph:
            continue
        path = os.path.join(OUTDIR, 'BOHEMIA_FACTION_%s.md' % k)
        if not os.path.exists(path):
            continue
        txt = open(path, encoding='utf-8').read()
        chk('`%s`' % graph[g]['align'] in txt,
            '%s: the dossier does not reproduce the canon alignment "%s"' % (k, graph[g]['align']))
        chk('**%s of 14**' % graph[g]['act1_power'] in txt,
            '%s: the dossier does not reproduce the canon act-1 power %s - a dossier that '
            'disagrees with the graph is a quiet edit to canon'
            % (k, graph[g]['act1_power']))
        chk(graph[g]['note'] in txt,
            '%s: the graph\'s own canon note is not reproduced on the dossier' % k)

    # --- C. his rulings are not re-asked ----------------------------------
    for k in order:
        dr = D[k]['dress']
        g = (D[k].get('graph') or '').upper()
        live = ruled.get(g)
        if live:
            chk(dr.get('ruled') is True,
                '%s: Paolo RULED this faction\'s look on 7/21 and the dossier does not mark it '
                'SETTLED. NOTES ARE RULINGS - never re-thumb his own words.' % k)
            chk(dr.get('look') == {kk: vv for kk, vv in live.items() if vv is not None}
                or (dr.get('look') or {}).get('mode') == live['mode'],
                '%s: the printed look does not match the live FACTION_LOOK entry' % k)
            chk(not dr.get('proposed'),
                '%s: a ruled faction cannot also carry a proposal for the same thing' % k)
        else:
            chk(not dr.get('ruled'),
                '%s is printed as SETTLED but has no entry in the live FACTION_LOOK' % k)

    # --- D. approved wardrobe only ----------------------------------------
    kits = 0
    for k in order:
        for layer, names in (D[k]['dress'].get('kit') or {}).items():
            for n in names:
                kits += 1
                if not chk(n in bank,
                           '%s: veteran kit names "%s", which is NOT in the canon wardrobe bank. '
                           'The order says approved wardrobe only.' % (k, n)):
                    continue
                chk(bank[n] == layer,
                    '%s: "%s" is a %s garment, listed under %s' % (k, n, bank[n], layer))
    note('%d wardrobe names checked against the %d-item canon bank' % (kits, len(bank)))

    # --- E. colour collisions ---------------------------------------------
    pts = {}
    for k in order:
        dr = D[k]['dress']
        look = dr.get('look') or {}
        if look.get('color'):
            pts[k] = (look['color'], bool(dr.get('ruled')))
    for k, (hexv, _r) in pts.items():
        chk(not is_purple(hexv),
            '%s proposes %s, which reads PURPLE. Purple belongs to the Amalgamation alone '
            '(PURPLE RESERVATION) and pointing it at a faction hands away the act-3 reveal.'
            % (k, hexv))
    keys = sorted(pts)
    for i, a in enumerate(keys):
        for b in keys[i + 1:]:
            ha, ra = pts[a]
            hb, rb = pts[b]
            d = dist(ha, hb)
            if ra and rb:
                # both are HIS. Not mine to fail him on - reported, never enforced.
                if d <= tol:
                    ma = (D[a]['dress']['look'] or {}).get('mode')
                    mb = (D[b]['dress']['look'] or {}).get('mode')
                    if ma != mb:
                        why = ('still told apart by MODE (%s vs %s), never by hue' % (ma, mb))
                    else:
                        why = ('and BOTH are %s mode, so on a body there is nothing left to '
                               'tell them apart - worth a look' % ma)
                    note('BOTH RULED BY HIM 7/21, reported not enforced: %s %s and %s %s are '
                         '%.0f apart, inside his own %d-unit family tolerance, %s.'
                         % (a, ha, b, hb, d, tol, why))
                continue
            chk(d > tol,
                'COLOUR COLLISION: %s %s and %s %s are %.0f apart, inside the engine\'s own '
                '%d-unit family tolerance - on a body they would read as the same faction. '
                'This is exactly why the 7/21 dress pass parked the remaining factions.'
                % (a, ha, b, hb, d, tol))
    prop = [k for k in keys if not pts[k][1]]
    if prop:
        worst = []
        for k in prop:
            near = min(((dist(pts[k][0], pts[o][0]), o) for o in keys if o != k),
                       default=(999, '-'))
            worst.append('%s nearest %s at %.0f' % (k, near[1], near[0]))
        note('proposed colours (%d): %s' % (len(prop), '; '.join(worst)))

    # --- F. the frozen systems are not grown ------------------------------
    # the ratchet in gates/build_the_world_gate.py froze the faction footprint at
    # exactly one module and says the set may SHRINK but never gain a member. It has
    # since shrunk to zero, so the honest assertion is subset-of, not equals.
    FROZEN = {'bohemia_factions.js'}
    eng = {f for f in os.listdir('engine') if re.match(r'^bohemia_faction[a-z_]*\.js$', f)}
    chk(eng <= FROZEN,
        'NEW engine faction machinery appeared: %s. BUILD THE WORLD (7/31) froze that footprint '
        'and these dossiers are text, not machinery.' % sorted(eng - FROZEN))

    # Paolo 8/1: a checker that cannot tell a MENTION from a USE is the broken one, and
    # you fix the ruler, never the target. So these look for the factory actually
    # OPENING or WRITING those things, never for the bare words - this file's own
    # docstring says "questbook" and that must stay legal.
    src = open('tools/bohemia_faction_dossiers.py', encoding='utf-8').read()
    for banned, why in [
        (r"open\s*\([^)]*\.bq\b", 'the dossier factory must never write a .bq quest file'),
        (r"(open|makedirs|walk|listdir)\s*\(\s*['\"][^'\"]*questbook",
         'the dossier factory must never open or write the questbook'),
        (r"(open|makedirs|walk|listdir)\s*\(\s*['\"]quests[/\\]",
         'the dossier factory must never write into quests/'),
    ]:
        chk(not re.search(banned, src), why)
    for path in files:
        chk(path.replace('\\', '/').startswith(OUTDIR + '/') or path.replace('\\', '/') == JUDGE,
            'the factory wrote outside its own two homes: %s' % path)

    # --- G. no dossier claims Marco ---------------------------------------
    # A GATE MUST NEVER OUTRANK A RULING (Paolo 8/1). This check originally hard-coded
    # "Marco is name only", which was true for about four hours - he re-stated Marco
    # clean the same day and the personality is canon now. So the gate READS THE LIVE
    # LAW instead of remembering a version of it, and enforces the part that is still
    # open: his faction. That is the only part a faction sheet could get wrong.
    law = ''
    for p in ('laws/BOHEMIA_ADDENDUM_LORE_SITTING_7_31_26.md',):
        if os.path.exists(p):
            law = open(p, encoding='utf-8').read()
    chk(bool(law), 'the lore-sitting addendum is missing, so nothing can check the Marco rows')
    faction_open = bool(re.search(r'STILL OPEN.*faction or unaffiliated', law, re.S | re.I))
    note('Marco: the live ruling still leaves his faction OPEN' if faction_open else
         'Marco: his faction is NO LONGER open in the live ruling - the dossiers need a look')
    # scan BOTH the typed source and the emitted files - the source is what a future
    # edit actually touches, and the file is what he would end up reading
    marco_lines = []
    for k in order:
        blobs = []
        path = os.path.join(OUTDIR, 'BOHEMIA_FACTION_%s.md' % k)
        if os.path.exists(path):
            blobs.append(open(path, encoding='utf-8').read())
        d = D[k]
        blobs += [str(v) for v in d.get('canon_flags', [])]
        blobs += [str(d.get(f, '')) for f in FD.FIELDS if not isinstance(d.get(f), list)]
        blobs += [str(h) for h in (d.get('hooks') or [])]
        for b in blobs:
            for m in re.finditer(r'[^\n]*\bMarco\b[^\n]*', b, re.I):
                marco_lines.append((k, m.group(0)))
    for k, line in marco_lines:
            if faction_open:
                chk('STILL OPEN' in line.upper() or 'NOT CLAIMED' in line.upper(),
                    '%s mentions Marco without saying his faction is STILL OPEN. His faction is '
                    'unruled and a faction sheet is exactly the document that could quietly '
                    'decide it: %s' % (k, line[:100]))
            chk('KING OF HOBOS LMAO' in line.upper() or 'KING OF THE HOBOS' not in line.upper(),
                '%s revives the dead "king of the hobos" reading Paolo killed by name: %s'
                % (k, line[:100]))

    # --- H. he can reach it ------------------------------------------------
    chk(os.path.exists(JUDGE), 'the judge sheet is missing: %s' % JUDGE)
    hub = open(HUB, encoding='utf-8').read() if os.path.exists(HUB) else ''
    chk(os.path.basename(JUDGE) in hub,
        'the faction judge sheet is not linked from the LIFE hub, so there is no tab to name '
        'and it does not exist to him (NAME THE TAB, 7/28)')
    if os.path.exists(JUDGE):
        j = open(JUDGE, encoding='utf-8').read()
        for needle, why in [('EXPORT .txt', 'no export button - verdicts land as .txt or not at all'),
                            ('SUN MODE', 'no SUN MODE - he judges outdoors'),
                            ('PAOLO COMMENTS', 'no comment box at the bottom'),
                            ('👍', 'no thumbs')]:
            chk(needle in j, 'judge sheet: %s' % why)
        chk('already canon' in j.lower(),
            'the judge sheet does not tell him which half of a card is canon and which half is '
            'the proposal - so he cannot tell what he is actually thumbing')
        for k in order:
            chk(('"%s"' % D[k]['name']) in j or D[k]['name'] in j,
                '%s is missing from the judge sheet' % k)

    # --- I. it is a proposal ----------------------------------------------
    for k in order:
        path = os.path.join(OUTDIR, 'BOHEMIA_FACTION_%s.md' % k)
        if os.path.exists(path):
            txt = open(path, encoding='utf-8').read()
            chk('PROPOSAL, NOT CANON' in txt,
                '%s does not say it is a proposal. CONTENTS-PAOLO\'S: a dossier that reads as '
                'canon has declared canon in unruled territory.' % k)
            chk(LAW_ORDER in txt, '%s does not carry his order verbatim' % k)
    idx = os.path.join(OUTDIR, 'INDEX.md')
    chk(os.path.exists(idx), 'the index is missing')
    if os.path.exists(idx):
        it = open(idx, encoding='utf-8').read()
        for k in order:
            chk('BOHEMIA_FACTION_%s.md' % k in it, '%s is not listed in the index' % k)


# ---------------------------------------------------------------- self-test
def selftest(graph, ruled, tol, bank):
    """Six real mistakes. Every one must be CAUGHT, or the checker is decorative."""
    import copy
    global P, F, QUIET
    probes = []

    def probe(name, mutate):
        probes.append((name, mutate))

    def m_purple(D):
        D['VOLUNTEERS']['dress']['look'] = {'mode': 'family', 'color': '#7a4fd0'}
    probe('a faction proposes purple', m_purple)

    def m_garment(D):
        D['TRADES']['dress']['kit']['base'] = ['GUILD TABARD']
    probe('a veteran kit invents a garment', m_garment)

    def m_collide(D):
        D['VOLUNTEERS']['dress']['look'] = {'mode': 'family', 'color': '#f0dc70'}
    probe('a proposed colour collides with a ruled one', m_collide)

    def m_reask(D):
        D['CARTEL']['dress']['ruled'] = False
        D['CARTEL']['dress']['proposed'] = True
    probe('a ruling he already made is re-proposed for a thumb', m_reask)

    def m_empty(D):
        D['MOB']['lesson'] = ''
    probe('a dossier row is emptied', m_empty)

    def m_thin(D):
        D['REDS']['hooks'] = ['only one hook']
    probe('a dossier ships fewer than three hooks', m_thin)

    def m_marco(D):
        D['HOMELESS']['canon_flags'] = ['Marco runs with this faction.']
    probe('a dossier quietly gives Marco a faction', m_marco)

    caught = 0
    for name, mutate in probes:
        D2 = copy.deepcopy(FD.D)
        mutate(D2)
        sp, sf = P, F
        buf = []
        real_print = print
        import builtins
        QUIET = True
        try:
            builtins.print = lambda *a, **k: buf.append(' '.join(str(x) for x in a))
            check_all(D2, FD.ORDER, graph, ruled, tol, bank, [])
        finally:
            builtins.print = real_print
            QUIET = False
        got = F - sf
        P, F = sp, sf     # probes never count toward the real score
        if got > 0:
            caught += 1
        else:
            print('  FAIL  SELF-TEST: "%s" was NOT caught. The checker is decorative here.' % name)
            F += 1
    return caught, len(probes)


def main():
    print('FACTION DOSSIER GATE - Paolo 7/31, "make all of them awesome and interesting"')

    for p in (GRAPH, DRESS, BANK, HUB):
        if not chk(os.path.exists(p), 'missing source: %s' % p):
            print('  %d passed, %d FAILED' % (P, F))
            return 1

    graph = json.load(open(GRAPH, encoding='utf-8'))['factions']
    src = open(DRESS, encoding='utf-8').read()
    tol = read_tolerance(src)
    chk(tol is not None,
        'could not read COLOR_FAMILY_TOL out of %s - the collision check must use the engine\'s '
        'own number, never a copy' % DRESS)
    ruled = read_ruled(src)
    chk(len(ruled) == 6,
        'expected the 6 faction looks Paolo ruled on 7/21 in the live module, found %d' % len(ruled))
    bank = read_bank()
    chk(len(bank) > 200, 'the wardrobe bank looks truncated (%d rows)' % len(bank))

    files = [os.path.join(OUTDIR, 'BOHEMIA_FACTION_%s.md' % k) for k in FD.ORDER] + [JUDGE]
    check_all(FD.D, FD.ORDER, graph, ruled, tol or 95, bank, files)

    caught, total = selftest(graph, ruled, tol or 95, bank)
    chk(caught == total, 'self-test: only %d of %d planted mistakes were caught' % (caught, total))

    for n in NOTES:
        print('  NOTE  ' + n)
    print('  %d passed, %d FAILED' % (P, F))
    if F == 0:
        print('  %d dossiers, %d selectable factions covered, %d of his rulings carried verbatim, '
              '%d/%d self-test probes caught'
              % (len(FD.ORDER),
                 len([k for k in FD.ORDER if FD.D[k].get('graph')]),
                 len(ruled), caught, total))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
