#!/usr/bin/env python3
"""THE VOICE HOLDS (WORDS THREE 11/20/26; VAMILY rules 454(a)(d), 455, 461; ask rows 628, 637, 643)

PAOLO 11/17: 'every time you have a human talk it's so fucking bad... don't do anything to fix it yet'. Rule 454: nothing is rewritten
until his voice is written down; then 'the game's talk rewritten, mouth by mouth, on his word'. THE VOICE is written
(laws/BOHEMIA_LAW_THE_VOICE_11_17_26.md); his word to start has NOT come. This is the gate that will hold the game to THE VOICE the
day he says go. It is BUILT AND ASLEEP: it rewrites nothing, opens nothing, and today it only keeps the door shut.

THE PARTS
  THE MOUTHS   records/words_two/the_mouths.py: where the 13 counted mouths keep their lines (2,738 lines), the two small ones
               (who you meet at a real place, your second on the map), and his own buttons.
  THE FREEZE   records/words_two/the_voice_freeze.json: every standing line of the 15 mouths as it was on 11/20, the day this
               gate was built (the WAS of every future rewrite). Pinned below by its hash: a lane that re-freezes to make its change
               pass has to change this file too, where everybody sees it.
  THE SWITCH   records/words_two/the_voice_switch.json: 'open' holds one entry per mouth he has said go for, with HIS words and
               where he said them; 'let_go' holds a standing line of a closed mouth that changed for a reason that is not a rewrite
               (a line cut to fit a length cap, rule 355(a); a feature deleted), with why. Both are EMPTY today.
  THE MARKS    records/words_two/the_voice_marks.json: for an OPEN mouth, every new or rewritten line's reading: which scary
               (desperate, a threat, eerie, cold) and the second word. A machine cannot hear scary (WORDS TWO measured a word count
               agreeing with a reader 96 times in 156), so a person marks it and this gate holds the mark to the line.

THE LEGS
  H0  the switch is honest: every open mouth is one of the 15, opened once, with his words found word for word where the entry says
      he said them (a VOTE verdict of his, by card id, or a record); a go a lane typed is caught. Today: 0 of 15 open.
  H1  THE FREEZE HOLDS (454(a)): every standing line of every CLOSED mouth is still in the game word for word, or is on let_go with a
      why; a let_go entry must name a frozen line that is really gone. New lines are allowed (454(a) lets a lane add the fewest it
      can, marked draft) and counted.
  H2  SCARY FIRST (455(b)(e)): in an OPEN mouth, every line that is not a frozen line has a mark whose text is the line, with a kind
      of scary. A line with no scary is the defect.
  H3  SCARY, THEN FUNNY (455(b)): a mark with a second word (funny, happy, a leader...) and no scary is funny alone, and fails.
  H4  NOBODY PRETENDS HELP IS FREE (455(c), his kid and his old woman): in an OPEN mouth, a new line that asks for help names the deal
      (batteries, pay, a tax, work offered, 'for some').
  H5  NO NEW SPANISH (rule 355(a); 9/21 'doesn't mean you will'): an OPEN mouth carries no more lines with Spanish in them than it was
      frozen with; and, LIVE TODAY, none of his own 200 buttons has a Spanish word.
  H6  NOTHING BLEEPED, LIVE TODAY: no f***, s**t, f--k in any line of any counted mouth (his own lines swear in full).
  H7  HIS LINES STAY HIS: a mark that says a line is one of his (by card id) holds that line to his verdict to the letter.
  H8  THE FREEZE IS THE FREEZE: the file's hash is the one pinned here, and its counts are its own lines.
  P   PLANTS on copies, never the real files: a go he never said (H0), a standing line changed (H1), a stale let_go (H1), a mouth
      opened on his word with an unmarked line (H2), a funny-alone mark (H3), a free-help line (H4), a new Spanish line and a Spanish
      button (H5), a bleep (H6), his line with a word changed (H7), the freeze edited (H8); and ONE GOOD REWRITE (an open mouth, a line
      marked scary, the deal said, no Spanish) that passes every leg, so the gate is shown to let a real rewrite through.
WHAT IT DOES NOT DO: write a line of the game, open a mouth, or judge a closed mouth's lines for being scary first.
   python3 gates/the_voice_holds_gate.py            the gate (seconds)
   python3 gates/the_voice_holds_gate.py --freeze   write the freeze from the game as it stands (prints the new pin; used once, 11/20)
"""
import collections, copy, hashlib, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.join(ROOT, 'records', 'words_two'))
from the_mouths import pools  # noqa: E402

SWITCH = 'records/words_two/the_voice_switch.json'
FREEZE = 'records/words_two/the_voice_freeze.json'
MARKS = 'records/words_two/the_voice_marks.json'
REG = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
FREEZE_PIN = 'e638b1f1ca3790fdba2117f661b13308e9f29f5248289376927e126599a21adb'   # sha256 of the freeze's mouths, canonical
BUTTONS = 'road: his own buttons'
# the kinds of scary WORDS TWO read in the game; EERIE hangs on his answer to homework card 3.5 ('is eerie scary?'): if he says no,
# it comes out of this list the same commit, and every eerie-only mark in an open mouth goes red
SCARY_KINDS = ('desperate', 'a threat', 'eerie', 'cold')

PLEA = re.compile(r"\b(please|help (me|us|my|our)|can you (guys )?help|need your help|we need you)\b", re.I)
DEAL = re.compile(r"\b(batter(y|ies)|cells?|pay\w*|paid|owe[sd]?|tax\w*|toll|price\w*|trade\w*|for some|in return|i know how to|i can (clean|fix|cook|carry|work|shine)|work for|i'?ll (give|pay|work))\b", re.I)
SPAN = re.compile(r"\b(mijo|mija|jefe|jefa|carnal|pues|órale|orale|mira|bueno|ni modo|gracias|oye|compa|cabr[oó]n|hijo|hija|ay|s[ií]|ya sabes|bienvenido|todo|mano|amigo|lana|verga|d[oó]nde|qu[eé]|nada|dios|se[ñn]or[a]?|hermano|güey|guey|ándale|andale|verdad|cuidado|mucho|ahorita|vámonos|vamos|chingado|pinche|nadie|abuela)\b", re.I)
BLEEP = re.compile(r"\b[fs](?:\*+|-{2,})\w*|\b\w\*{2,}\w*", re.I)


def J(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return json.load(f)


def norm(s):
    return re.sub(r'\s+', ' ', str(s)).strip()


def pin_of(freeze_mouths):
    return hashlib.sha256(json.dumps(freeze_mouths, sort_keys=True, ensure_ascii=False).encode('utf-8')).hexdigest()


def game_now():
    return pools(J, buttons=True, small=True)


def judge(game, freeze, switch, marks, reg, pin=FREEZE_PIN):
    R = {h: [] for h in ('H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8')}
    info = {}
    FM = freeze.get('mouths') or {}
    verdict = {v.get('id'): (v.get('said') or '') for v in (reg.get('verdicts') or []) if isinstance(v, dict)}
    # H8 the freeze is the freeze
    if pin_of(FM) != pin:
        R['H8'].append('the freeze is not the pinned freeze (somebody re-froze or edited it)')
    for m, L in FM.items():
        if (freeze.get('counts') or {}).get(m) != len(L):
            R['H8'].append(m + ': its count is not its own lines')
    # H0 the switch
    opened = collections.Counter()
    for g in switch.get('open') or []:
        m, said, src = g.get('mouth'), norm(g.get('said') or ''), g.get('from') or ''
        opened[m] += 1
        if m not in FM:
            R['H0'].append('opens a mouth that is not one of the frozen mouths: ' + str(m))
        if len(said.split()) < 2:
            R['H0'].append(str(m) + ': no words of his')
            continue
        if not g.get('date'):
            R['H0'].append(str(m) + ': no date')
        if '/' in src:
            try:
                txt = norm(open(os.path.join(ROOT, src), encoding='utf-8').read())
            except OSError:
                txt = ''
            if said not in txt:
                R['H0'].append(str(m) + ": his go is not in " + src + " word for word")
        elif norm(said) not in norm(verdict.get(src, '')):
            R['H0'].append(str(m) + ": his go is not his note on the card " + src)
    R['H0'] += [m + ' is opened twice' for m, n in opened.items() if n > 1]
    open_m = set(m for m in opened if m in FM)
    info['open'] = sorted(open_m)
    # H1 the freeze holds for every closed mouth
    let_go = collections.Counter((x.get('mouth'), x.get('line')) for x in (switch.get('let_go') or []))
    for x in switch.get('let_go') or []:
        if len(norm(x.get('why') or '').split()) < 3:
            R['H1'].append('a let_go with no why: ' + str(x.get('line'))[:40])
    new_total, gone_total = 0, 0
    for m, L in FM.items():
        F, G = collections.Counter(L), collections.Counter(game.get(m) or [])
        gone, new = F - G, G - F
        new_total += sum(new.values())
        if m in open_m:
            continue
        for line, n in gone.items():
            ok = min(n, let_go.get((m, line), 0))
            if n - ok > 0:
                gone_total += n - ok
                R['H1'].append(m + ': a standing line changed with no word from him: "' + line[:60] + '"')
    for (m, line), n in let_go.items():
        if m in open_m:
            R['H1'].append('a let_go in an open mouth (a rewrite needs no let_go): ' + str(m))
        elif m not in FM or line not in FM[m]:
            R['H1'].append('a let_go for a line that was never frozen: "' + str(line)[:50] + '"')
        elif collections.Counter(game.get(m) or [])[line] >= collections.Counter(FM[m])[line]:
            R['H1'].append('a let_go for a line that is still in the game: "' + str(line)[:50] + '"')
    info['new_lines'] = new_total
    info['changed_without_word'] = gone_total
    # H2 to H5 and H7: only an open mouth's new or rewritten lines
    MK = {m: {norm(x.get('line')): x for x in (marks.get(m) or [])} for m in marks if not m.startswith('_')}
    for m in sorted(open_m):
        F, G = collections.Counter(FM[m]), collections.Counter(game.get(m) or [])
        fresh = list((G - F).elements())
        for line in fresh:
            mk = MK.get(m, {}).get(norm(line))
            if not mk:
                R['H2'].append(m + ': a line with no scary-first mark: "' + line[:60] + '"')
            elif mk.get('scary') not in SCARY_KINDS:
                (R['H3'] if mk.get('second') else R['H2']).append(m + (': funny alone, a second word with no scary' if mk.get('second') else ': a mark with no kind of scary') + ': "' + line[:50] + '"')
            if PLEA.search(line) and not DEAL.search(line):
                R['H4'].append(m + ': asks for help and names no deal: "' + line[:60] + '"')
        span_then = sum(1 for l in FM[m] if SPAN.search(l))
        span_now = sum(1 for l in (game.get(m) or []) if SPAN.search(l))
        if span_now > span_then:
            R['H5'].append('%s: %d lines with Spanish, frozen with %d (no new Spanish line, rule 355(a))' % (m, span_now, span_then))
    for m, rows in MK.items():
        for t, mk in rows.items():
            if m not in open_m:
                R['H2'].append('a mark for a mouth that is not open: ' + m)
                break
            if mk.get('his'):
                h = verdict.get(mk['his'])
                if h is None or norm(h) != t:
                    R['H7'].append(m + ': a line marked as his is not his verdict on ' + str(mk['his']) + ' to the letter')
    # H5 live: his buttons, H6 live: nothing bleeped
    R['H5'] += ['a button of yours with Spanish in it: "' + b[:50] + '"' for b in (game.get(BUTTONS) or []) if SPAN.search(b)]
    R['H6'] += ['%s: "%s"' % (m, l[:50]) for m, L in game.items() for l in L if BLEEP.search(l)]
    info['buttons'] = len(game.get(BUTTONS) or [])
    info['lines'] = sum(len(v) for k, v in game.items() if k != BUTTONS)
    return R, info


def main():
    if '--freeze' in sys.argv:
        g = game_now()
        FM = collections.OrderedDict((m, L) for m, L in g.items() if m != BUTTONS)
        out = collections.OrderedDict([('draft', False), ('made', '11/20'), ('by', 'WORDS THREE, gates/the_voice_holds_gate.py --freeze'),
                                       ('_about', 'THE FREEZE (rule 454(a)): every standing line of the 13 counted mouths and two small ones as it was when THE VOICE HOLDS was built. '
                                                  'Nothing in a closed mouth changes until he says go for that mouth (records/words_two/the_voice_switch.json). '
                                                  'When a mouth is rewritten on his word, these lines are its WAS.'),
                                       ('counts', collections.OrderedDict((m, len(L)) for m, L in FM.items())), ('mouths', FM)])
        with open(os.path.join(ROOT, FREEZE), 'w', encoding='utf-8') as f:
            json.dump(out, f, indent=1, ensure_ascii=False)
            f.write('\n')
        print('frozen: %d mouths, %d lines; pin %s' % (len(FM), sum(len(L) for L in FM.values()), pin_of(FM)))
        return 0
    passed, failed = [0], [0]

    def ok(name, good, why=''):
        print(('  ok   ' if good else '  FAIL ') + name + (('  [' + why + ']') if why else ''))
        (passed if good else failed)[0] += 1

    game, freeze, switch, marks, reg = game_now(), J(FREEZE), J(SWITCH), J(MARKS), J(REG)
    R, info = judge(game, freeze, switch, marks, reg)
    nm = len(freeze.get('mouths') or {})
    ok('H0 the switch is honest: %d of %d mouths open, every go his own words where it says he said them' % (len(info['open']), nm), not R['H0'], '; '.join(R['H0'][:3]))
    ok('H1 THE FREEZE HOLDS: every standing line of every closed mouth is still in the game word for word (%d new lines added, allowed)' % info['new_lines'], not R['H1'], '; '.join(R['H1'][:3]))
    ok('H2 SCARY FIRST: every new line of an open mouth is marked with its scary', not R['H2'], '; '.join(R['H2'][:3]))
    ok('H3 SCARY, THEN FUNNY: no second word without a scary first', not R['H3'], '; '.join(R['H3'][:3]))
    ok('H4 NOBODY PRETENDS HELP IS FREE: a new line that asks for help names the deal', not R['H4'], '; '.join(R['H4'][:3]))
    ok('H5 NO NEW SPANISH: no open mouth gains a Spanish line, and none of your %d buttons speaks it' % info['buttons'], not R['H5'], '; '.join(R['H5'][:3]))
    ok('H6 NOTHING BLEEPED in %d lines of %d mouths' % (info['lines'], nm), not R['H6'], '; '.join(R['H6'][:3]))
    ok('H7 HIS LINES STAY HIS: a line marked his is his verdict to the letter', not R['H7'], '; '.join(R['H7'][:3]))
    ok('H8 THE FREEZE IS THE FREEZE: pinned, and its counts are its own lines', not R['H8'], '; '.join(R['H8'][:3]))

    # ---------- the plants, on copies ----------
    M = 'town: job givers at the board'
    his_id = next((v['id'] for v in reg['verdicts'] if str(v.get('id', '')).startswith('words-two-hw01-04') and v.get('said')), None)
    def fresh():
        return copy.deepcopy(game), copy.deepcopy(freeze), copy.deepcopy(switch), copy.deepcopy(marks), copy.deepcopy(reg)
    def opened(sw, rg):   # a mouth opened on HIS word: a go planted in a copy of the registry as his verdict, and cited
        rg['verdicts'].append({'id': 'plant-his-go', 'said': 'go, rewrite the job board'})
        sw['open'] = [{'mouth': M, 'said': 'go, rewrite the job board', 'from': 'plant-his-go', 'date': '11/20'}]
    caught = []
    g, f, s, mk, rg = fresh(); s['open'] = [{'mouth': M, 'said': 'yeah go ahead and rewrite all of it', 'from': 'records/BOHEMIA_PAOLO_SCARY_FIRST_THE_GRINDER_AND_THE_CAR_CAMPS_11_17_26.md', 'date': '11/20'}]
    caught.append(('a go he never said', bool(judge(g, f, s, mk, rg)[0]['H0'])))
    g, f, s, mk, rg = fresh(); g[M][0] = g[M][0] + ' Please.'
    caught.append(('a standing line changed in a closed mouth', bool(judge(g, f, s, mk, rg)[0]['H1'])))
    g, f, s, mk, rg = fresh(); s['let_go'] = [{'mouth': M, 'line': g[M][1], 'why': 'cut to fit the card, rule 355(a)'}]
    caught.append(('a let_go for a line still in the game', bool(judge(g, f, s, mk, rg)[0]['H1'])))
    good = 'My grandson came home from the stew cart with a finger bone in his teeth. Find out who they cook. Some batteries, please.'
    g, f, s, mk, rg = fresh(); opened(s, rg); g[M].append(good)
    caught.append(('an unmarked line in an open mouth', bool(judge(g, f, s, mk, rg)[0]['H2'])))
    g, f, s, mk, rg = fresh(); opened(s, rg); g[M].append(good); mk[M] = [{'line': good, 'scary': None, 'second': 'funny'}]
    caught.append(('a funny-alone mark', bool(judge(g, f, s, mk, rg)[0]['H3'])))
    free = 'Please help us. They took the water.'
    g, f, s, mk, rg = fresh(); opened(s, rg); g[M].append(free); mk[M] = [{'line': free, 'scary': 'desperate'}]
    caught.append(('a line that asks for free help', bool(judge(g, f, s, mk, rg)[0]['H4'])))
    sp = 'Mijo, my water is gone and they come back tonight. For some batteries?'
    g, f, s, mk, rg = fresh(); opened(s, rg); g[M].append(sp); mk[M] = [{'line': sp, 'scary': 'desperate'}]
    caught.append(('a new Spanish line in an open mouth', bool(judge(g, f, s, mk, rg)[0]['H5'])))
    g, f, s, mk, rg = fresh(); g[BUTTONS][0] = 'Gracias, mijo. ' + g[BUTTONS][0]
    caught.append(('a button of yours in Spanish', bool(judge(g, f, s, mk, rg)[0]['H5'])))
    g, f, s, mk, rg = fresh(); g['feed: the valley'].append('f*** this heat')
    caught.append(('a bleep', bool(judge(g, f, s, mk, rg)[0]['H6'])))
    if his_id:
        hl = norm(next(v['said'] for v in reg['verdicts'] if v.get('id') == his_id)).replace('some batteries', 'a few batteries')
        g, f, s, mk, rg = fresh(); opened(s, rg); g[M].append(hl); mk[M] = [{'line': hl, 'scary': 'desperate', 'his': his_id}]
        caught.append(('his line with a word changed', bool(judge(g, f, s, mk, rg)[0]['H7'])))
    g, f, s, mk, rg = fresh(); f['mouths'][M][0] = f['mouths'][M][0] + ' '
    caught.append(('the freeze edited', bool(judge(g, f, s, mk, rg)[0]['H8'])))
    missed = [n for n, c in caught if not c]
    ok('P  the plants are caught (%d of %d): ' % (len(caught) - len(missed), len(caught)) + ', '.join(n for n, _ in caught), not missed and len(caught) >= 11, ('MISSED: ' + ', '.join(missed)) if missed else '')
    g, f, s, mk, rg = fresh(); opened(s, rg); g[M].append(good); mk[M] = [{'line': good, 'scary': 'desperate', 'second': 'asking'}]
    Rg = judge(g, f, s, mk, rg)[0]; bad = [h + ': ' + '; '.join(v[:1]) for h, v in Rg.items() if v]
    ok('P  ONE GOOD REWRITE passes every leg: an open mouth, a new line marked scary, the deal said, no Spanish', not bad, ' | '.join(bad))
    print('\n=== THE VOICE HOLDS: %d passed, %d failed (asleep: %d of %d mouths open) ===' % (passed[0], failed[0], len(info['open']), nm))
    return 1 if failed[0] else 0


if __name__ == '__main__':
    sys.exit(main())
