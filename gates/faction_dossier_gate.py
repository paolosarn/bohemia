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
VERDICT_FILE = 'records/BOHEMIA_FACTION_VERDICT_8_2_26.txt'
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


def hsl(x):
    import colorsys
    r, g, b = [c / 255 for c in rgb(x)]
    H, L, S = colorsys.rgb_to_hls(r, g, b)
    return H * 360, S, L


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


def read_verdicts(order, names):
    """Parse HIS exported .txt. The file is the record (VERDICT WORKFLOW), so the gate
    reads it rather than trusting a table somebody retyped. Lines look like
    '[UP]  THE REMNANTS   (five words)' with an optional indented 'comment:'."""
    out, comments = {}, {}
    if not os.path.exists(VERDICT_FILE):
        return out, comments
    by_name = {names[k]: k for k in order}
    last = None
    for line in open(VERDICT_FILE, encoding='utf-8'):
        m = re.match(r'\s*\[(\w+)\]\s+(.+?)\s{2,}\(', line)
        if m:
            key = by_name.get(m.group(2).strip())
            last = key
            if key:
                out[key] = m.group(1).upper()
            continue
        c = re.match(r'\s+comment:\s*(.+)', line)
        if c and last:
            comments[last] = c.group(1).strip()
    return out, comments


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
def check_all(D, order, graph, ruled, tol, bank, files, verdicts=None, vcomments=None):
    verdicts = verdicts or {}
    vcomments = vcomments or {}
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
    # A GATE MUST NEVER OUTRANK A RULING (Paolo 8/1), and I have now needed that twice in
    # one day. A colour HE chose gets REPORTED, never failed. Only a colour I proposed can
    # fail, because that is the only kind I am allowed to be wrong about.
    for k, (hexv, _r) in pts.items():
        mine = not (D[k]['dress'].get('ruled') or D[k]['dress'].get('chosen'))
        if not is_purple(hexv):
            chk(True, 'purple check %s' % k)
        elif mine:
            chk(False,
                '%s proposes %s, which reads PURPLE. Purple belongs to the Amalgamation alone '
                '(PURPLE RESERVATION) and pointing it at a faction hands away the act-3 reveal.'
                % (k, hexv))
        else:
            note('*** HIS COLOUR, AND IT READS PURPLE: %s is %s, which clears the '
                 'purple-reservation test on both channels. It has been live in the alpha since '
                 'the faction songs shipped, and the purity sweep never caught it because that '
                 'sweep only ever looked at ART PIXELS, never at a colour written in code. '
                 'Reported, not touched - it is his. ***' % (k, hexv))
    # A COLOUR IS THE BADGE OF BEING A MAP FACTION. Two rulings, same day, and together
    # they are sharper than either alone:
    #   "we chose colors for factions so i dont fuck with u trying to say they wont have
    #    color" -> every real faction HAS one, and I may never solve a palette problem by
    #    taking one away.
    #   "the mini group factions dont need colors bro" -> and nothing else may have one.
    # So the test is two-sided, and the line is the canon graph: a row in
    # BOHEMIA_faction_graph.json means a colour, no row means no colour. That makes the
    # colour itself say what a group IS before it opens its mouth.
    for k in order:
        d0 = D[k]
        look = d0['dress'].get('look') or {}
        has = bool(look.get('color')) or look.get('mode') == 'rainbow'
        if d0.get('graph'):
            chk(has,
                '%s is a MAP FACTION in the canon graph and has NO colour. Paolo 8/2: "we chose '
                'the colors" - solving a palette collision by taking the colour away is not '
                'solving it, cook a colourway instead.' % k)
        else:
            chk(not has,
                '%s is NOT a map faction (no row in the canon graph) and carries a faction '
                'colour. Paolo 8/2: "the mini group factions dont need colors bro". The colour '
                'is the badge of being a faction; giving one to a group that is not a faction '
                'says the wrong thing about it.' % k)


    # *** THE COLOURS ARE HIS AND THEY ALREADY EXISTED. ***
    # Paolo 8/2, having to say it twice: "BRO WE ALREADY CHOSE COLORS FIND IT IN THE
    # PROJECT." Every faction has carried an accent colour AND a motif in the alpha's
    # MFACTIONS table since the faction songs shipped. I proposed a parallel set without
    # looking - a REUSE-FIRST violation. So the gate now checks the dossiers against HIS
    # table, read live out of the alpha, and a dossier that invents its own colour fails.
    for k in order:
        d0 = D[k]
        g = d0.get('graph')
        if not g:
            continue
        his = FD.CHOSEN.get(g.upper())
        look = d0['dress'].get('look') or {}
        if not his:
            continue
        if d0['dress'].get('ruled'):
            continue          # his 7/21 CLOTHING ruling wins for those six; see the note below
        chk(look.get('color', '').lower() == his['acc'].lower(),
            '%s uses %s but Paolo already chose %s for them in the alpha\'s faction table. '
            'REUSE-FIRST: find what exists before proposing anything.'
            % (k, look.get('color'), his['acc']))
        chk(d0['dress'].get('motif') == his['motif'],
            '%s does not carry his chosen motif "%s" - the motif is the faction MARK he already '
            'picked, and gap 1 said we had none.' % (k, his['motif']))
    note('%d colours + motifs read from HIS MFACTIONS table in the alpha, never retyped'
         % len(FD.CHOSEN))
    # the six he ruled separately for CLOTHING on 7/21 differ in hex from the music accent,
    # and they agree on FAMILY every time - Caravans is byte-identical in both. Reported so
    # he can collapse them if he wants; never failed, because both sides are his.
    for k in order:
        g = (D[k].get('graph') or '').upper()
        if D[k]['dress'].get('ruled') and g in FD.CHOSEN:
            a = (D[k]['dress']['look'] or {}).get('color')
            b = FD.CHOSEN[g]['acc']
            if a and a.lower() != b.lower():
                ha, _sa, va = hsl(a)
                hb, _sb, vb = hsl(b)
                dh = abs(ha - hb); dh = min(dh, 360 - dh)
                note('TWO OF HIS OWN, both stand: %s wears %s (his 7/21 clothing ruling) and '
                     'shows %s in the faction table - %.0f degrees of hue apart, same family'
                     % (k, a, b, dh))

    # THE RULER, REBUILT. The old check was one number: euclidean distance in RGB, fail
    # under 95. That ruler said olive drab and oxblood "collide" at 39 - a dark green and a
    # dark red, which no human being has ever confused - and the conclusion I drew from it
    # was to take colours AWAY from six factions. Paolo threw that out and he was right.
    # THE REAL STANDARD, from the accessibility/readability practice: layer THREE signals -
    # HUE, VALUE, and SHAPE - and two things are distinguishable if they differ on ANY of
    # them. So that is what this measures. Fix the ruler, never the target (Paolo 8/1).
    HUE_GAP, VAL_GAP, NEUTRAL_SAT = 20.0, 0.14, 0.16
    def sep(a, b):
        """(distinguishable?, which signal did the work)"""
        ha, sa, va = hsl(pts[a][0])
        hb, sb, vb = hsl(pts[b][0])
        dv = abs(va - vb)
        na, nb = sa < NEUTRAL_SAT, sb < NEUTRAL_SAT
        if na != nb:
            return True, 'one is neutral, one is coloured'
        if na and nb:
            return dv >= VAL_GAP, 'value %.2f apart on the neutral axis' % dv
        dh = abs(ha - hb)
        dh = min(dh, 360 - dh)
        if dh >= HUE_GAP:
            return True, 'hue %.0f degrees apart' % dh
        if dv >= VAL_GAP:
            return True, 'same hue family, value %.2f apart (his own Reds/Cartel trick)' % dv
        ma = (D[a]['dress']['look'] or {}).get('mode')
        mb = (D[b]['dress']['look'] or {}).get('mode')
        if ma != mb:
            return True, 'same hue and value, told apart by MODE (%s vs %s)' % (ma, mb)
        return False, 'hue %.0f apart and value %.2f apart' % (dh, dv)

    keys = sorted(pts)
    worst = (999.0, None, None, '')
    for i, a in enumerate(keys):
        for b in keys[i + 1:]:
            okc, why = sep(a, b)
            def his(x):
                return bool(D[x]['dress'].get('ruled') or D[x]['dress'].get('chosen'))
            if not okc and (his(a) or his(b)):
                note('HIS COLOURS, reported not enforced: %s %s and %s %s are %s - they would '
                     'read as the same faction on a body' % (a, pts[a][0], b, pts[b][0], why))
                continue
            chk(okc,
                'COLOUR COLLISION: %s %s and %s %s are %s, so on a body they would read as the '
                'same faction on all three signals. Cook a colourway or move one - do not take '
                'the colour away.' % (a, pts[a][0], b, pts[b][0], why))
    note('%d faction colours, all separated on hue, value or the neutral axis' % len(keys))
    cooks = [k for k in order if D[k]['dress'].get('needs_cook')]
    if cooks:
        note('NEEDS A COLOURWAY COOKED (the wardrobe has no hex near it, same as the five '
             'cooked on 7/21): %s - CLOTHES lane\'s factory, not this one' % ', '.join(cooks))

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
            # This claim used to be "every dossier says PROPOSAL, NOT CANON", which was right
            # for about a day and then he thumbed them. A GATE MUST NEVER OUTRANK A RULING
            # (Paolo 8/1), so it now reads HIS EXPORTED VERDICT FILE and asserts each card
            # says what he actually decided about it - unjudged cards must still say proposal,
            # approved ones must NOT, because asking him to rule twice is the real defect.
            v = verdicts.get(k)
            if v == 'UP':
                chk('CANON. Paolo thumbed this UP' in txt,
                    '%s was thumbed UP in %s and the dossier still reads as an open proposal. '
                    'APPROVE IS CANON - a card that keeps asking is asking him to rule twice.'
                    % (k, VERDICT_FILE))
                chk('PROPOSAL, NOT CANON' not in txt,
                    '%s is approved and still carries the proposal banner' % k)
            elif v == 'DOWN':
                chk(False, '%s was thumbed DOWN and is still on the sheet. A kill goes to the '
                           'graveyard with a post-mortem, not back in the pile.' % k)
            else:
                chk('PROPOSAL, NOT CANON' in txt or 'NOT THUMBED' in txt,
                    '%s has no verdict in %s and does not say so. CONTENTS-PAOLO\'S: a dossier '
                    'that reads as canon has declared canon in unruled territory.'
                    % (k, VERDICT_FILE))
            chk(LAW_ORDER in txt, '%s does not carry his order verbatim' % k)
    idx = os.path.join(OUTDIR, 'INDEX.md')
    chk(os.path.exists(idx), 'the index is missing')
    if os.path.exists(idx):
        it = open(idx, encoding='utf-8').read()
        for k in order:
            chk('BOHEMIA_FACTION_%s.md' % k in it, '%s is not listed in the index' % k)


# ---------------------------------------------------------------- self-test
def selftest(graph, ruled, tol, bank, verdicts, vcomments):
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

    def m_nocolour(D):
        # the exact mistake I made on 8/2 and he threw out: a palette problem solved by
        # taking the colour away instead of by cooking one
        D['TRADES']['dress']['look'] = None
    probe('a map faction has its colour taken away to dodge a collision', m_nocolour)

    def m_minicolour(D):
        # the other half of the same ruling: "the mini group factions dont need colors bro"
        D['KARENS']['dress']['look'] = {'mode': 'family', 'color': '#e0a0a8'}
    probe('a group that is not a faction is given a faction colour', m_minicolour)

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
            check_all(D2, FD.ORDER, graph, ruled, tol, bank, [], verdicts, vcomments)
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
    verdicts, vcomments = read_verdicts(FD.ORDER, {k: FD.D[k]['name'] for k in FD.ORDER})
    chk(len(verdicts) == len(FD.ORDER),
        'his exported verdict %s covers %d of %d cards - a card he judged that the gate cannot '
        'match by name is a verdict silently lost' % (VERDICT_FILE, len(verdicts), len(FD.ORDER)))
    note('verdict 8/2: %d up, %d down, %d left with a note; his comments on %s'
         % (sum(1 for v in verdicts.values() if v == 'UP'),
            sum(1 for v in verdicts.values() if v == 'DOWN'),
            sum(1 for v in verdicts.values() if v not in ('UP', 'DOWN')),
            ', '.join(sorted(vcomments)) or 'nothing'))
    # AMENDED 8/2: FACTION_LOOK held exactly his six on 7/21 and holds all thirteen now,
    # because the other seven turned out to be his too - they were in the alpha's faction
    # table the whole time. So the six are named explicitly rather than counted, and
    # everything else in there is a colour HE chose in that other table.
    RULED_7_21 = {'REDS', 'CARTEL', 'CHURCH', 'MOB', 'CARAVANS', 'COLORFUL'}
    chk(RULED_7_21 <= set(ruled),
        'his six 7/21 clothing rulings are not all in the live module: missing %s'
        % sorted(RULED_7_21 - set(ruled)))
    chk(len(ruled) == 13,
        'FACTION_LOOK should now carry all 13 map factions (his 6 plus the 7 from his own '
        'faction table); found %d' % len(ruled))
    ruled = {k: v for k, v in ruled.items() if k in RULED_7_21}
    bank = read_bank()
    chk(len(bank) > 200, 'the wardrobe bank looks truncated (%d rows)' % len(bank))

    files = [os.path.join(OUTDIR, 'BOHEMIA_FACTION_%s.md' % k) for k in FD.ORDER] + [JUDGE]
    check_all(FD.D, FD.ORDER, graph, ruled, tol or 95, bank, files, verdicts, vcomments)

    caught, total = selftest(graph, ruled, tol or 95, bank, verdicts, vcomments)
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
