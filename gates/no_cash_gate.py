#!/usr/bin/env python3
"""
BOHEMIA NO-CASH GATE (8/20/26) — there is no paper and there are no coins.

PAOLO, ON THE hands_pass.4 VERDICT LINE:

    "THERE IS NO PAPER NO COINS COINS GET MELTED DOWN TO RESOURCE PARTS
     WHAT DONT U UNDERSTAND"

Locked in laws/BOHEMIA_ADDENDUM_NO_PAPER_NO_COINS_8_20_26.md, and it agrees with
canon standing since 7/8: the three-currency system is medicine, electricity and
resources. There has never been cash in this game.

WHY A GATE AND NOT JUST A NOTE. The MONEY MOVES moment was offered to him THREE
TIMES under three ids -- money, cash_count, hands_pass -- fifteen candidates
across three different sound sources, and every one died. The synthesis was never
the problem. Every candidate was cooked to be paper and coin in a world that has
neither, so the better it was at being what it was asked to be, the more wrong it
was. Nothing in the machine could see that, because nothing was reading the
BRIEFS against his canon. Two of those three rounds were mine.

WHAT IT ASSERTS:

  1. NO BRIEF DESCRIBES CASH        no live game moment's label or `why` uses
                                    paper/coin/cash/till language. A dead moment
                                    keeps its words -- a tombstone is allowed to
                                    say what it died of.
  2. THE DEAD STAY DEAD             money, cash_count and hands_pass are marked
                                    dead and hold no approved sound.
  3. THE REPLACEMENT EXISTS         parts_pass is declared, so the moment is
                                    answered rather than merely deleted.
  4. NOTHING PLAYS THE DEAD IDS     no wire anywhere calls them.

Run from repo root:  python3 gates/no_cash_gate.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# the words his ruling rules out. `change` is deliberately NOT here: "changes
# hands" is fine and only the currency itself is banned.
CASH = re.compile(r'\b(paper|coins?|cash|till|banknotes?|bills?|wallet|purse of)\b', re.I)
DEAD = ('money', 'cash_count', 'hands_pass')

P = F = 0


def ok(msg, cond):
    global P, F
    if cond:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print('=== NO-CASH GATE — there is no paper and there are no coins ===')
    eng = open('engine/bohemia_sfx.js', encoding='utf8').read()

    law = 'laws/BOHEMIA_ADDENDUM_NO_PAPER_NO_COINS_8_20_26.md'
    ok('the ruling is written down (%s)' % law, os.path.exists(law))

    # 1. no LIVE brief may describe cash. A tombstone may.
    evs = re.findall(r"\{ ev: '([a-z_]+)',\s*label: '([^']*)',\s*why: '([^']*)'", eng)
    ok('the engine still declares its moments (%d)' % len(evs), len(evs) >= 95)
    bad = []
    for ev, label, why in evs:
        if 'DEAD' in label:
            continue                      # a tombstone may say what it died of
        m = CASH.search(label + ' ' + why)
        if m:
            bad.append('%s ("%s")' % (ev, m.group(0)))
    ok('no live moment describes money as paper or coin (%s)'
       % (', '.join(bad) or '%d briefs clean' % len(evs)), not bad)

    # 2. the dead stay dead
    for d in DEAD:
        row = [x for x in evs if x[0] == d]
        ok('%s is marked dead in its own label' % d,
           bool(row) and 'DEAD' in row[0][1])
    bank_path = sorted(f for f in os.listdir('banks')
                       if f.startswith('BOHEMIA_SFX_APPROVED_'))[-1]
    bank = json.load(open(os.path.join('banks', bank_path), encoding='utf8'))
    alive = [d for d in DEAD if bank.get(d)]
    ok('no dead cash moment holds an approved sound (%s)'
       % (', '.join(alive) or 'none, in ' + bank_path), not alive)

    # 3. the moment is ANSWERED, not merely deleted
    ok('parts_pass exists, so what actually changes hands has a sound',
       "ev: 'parts_pass'" in eng)
    row = [x for x in evs if x[0] == 'parts_pass']
    ok('and its brief is written from parts, not currency',
       bool(row) and not CASH.search(row[0][1] + ' ' + row[0][2]))

    # 4. nothing plays the dead ids. Reads the SHIPPED alpha, not a tool.
    alpha = open('slices/BOHEMIA_ALPHA_0_9.html', encoding='utf8').read()
    played = [d for d in DEAD
              if re.search(r"(playSFX|sfx|sfxAsk|sfxAt)\(\s*'%s'" % d, alpha)]
    ok('no wire in the shipped build plays a dead cash id (%s)'
       % (', '.join(played) or 'none'), not played)

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  Coins get melted down into resource parts. The sound is parts.')
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
