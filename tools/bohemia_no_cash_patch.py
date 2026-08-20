#!/usr/bin/env python3
"""
BOHEMIA — THERE IS NO PAPER AND THERE ARE NO COINS (8/20/26, SOUND lane).

REUSE CHECK: cooks one recipe out of his rack and nothing else. Voices are all
already-measured entries in INST_VOICE. No new voice, no new synthesis.

PAOLO, ON THE hands_pass.4 VERDICT LINE:

    "THERE IS NO PAPER NO COINS COINS GET MELTED DOWN TO RESOURCE PARTS
     WHAT DONT U UNDERSTAND"

Locked in laws/BOHEMIA_ADDENDUM_NO_PAPER_NO_COINS_8_20_26.md. It matches canon
that has been standing since 7/8: the three-currency system is medicine,
electricity and resources. There has never been cash in this game.

WHAT IT KILLS, AND WHY IT IS NOT A SOUND FAILURE. The MONEY MOVES moment has
been offered to him three times under three ids and fifteen candidates, across
three different sound sources, and every single one died:

    money       "cash changes hands"                    0 UP / 5 DOWN
    cash_count  "paper and coin counted off"            0 UP / 5 DOWN
    hands_pass  "paper and coin counted off"            0 UP / 5 DOWN

The synthesis was never the problem. THE BRIEF WAS. Every candidate was cooked
to be paper and coin in a world that has neither, so the better it was at being
what it was asked to be, the more wrong it was. A perfect coin sound was always
going to die. All three ids are graveyarded for their BRIEF.

THE LESSON THIS LANE SHOULD KEEP: a moment that dies with every candidate across
multiple SOURCES is not a cooking failure, it is a brief that does not describe
his world. I re-cooked this one twice before asking what it actually is.

WHAT REPLACES IT. `parts_pass` -- resource parts changing hands. Metal with mass,
several pieces, handed or tipped rather than counted, no ring and no chime. It is
nearer to a bag of scrap being set down than to a till, which is why it borrows
from the same weight-and-grit family as `set_down`, a sound he approved.

  python3 tools/bohemia_no_cash_patch.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ENGINE = 'engine/bohemia_sfx.js'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# 1. the three dead ids get their death written into the label, the way the
#    engine already marks a retired moment, so nobody re-cooks them.
DEAD = {
    "{ ev: 'money',       label: 'MONEY MOVES',":
        "{ ev: 'money',       label: 'MONEY MOVES [DEAD 8/20 -- NO CASH]',",
    "{ ev: 'cash_count',   label: 'MONEY MOVES',":
        "{ ev: 'cash_count',  label: 'MONEY MOVES [DEAD 8/20 -- NO CASH]',",
    "{ ev: 'hands_pass',  label: 'IT CHANGES HANDS',":
        "{ ev: 'hands_pass',  label: 'IT CHANGES HANDS [DEAD 8/20 -- NO CASH]',",
}

EVENT = """    /* ---- 8/20: THERE IS NO PAPER AND THERE ARE NO COINS (Paolo, on the
       hands_pass.4 line). money, cash_count and hands_pass are dead for their
       BRIEF, not their sound -- fifteen candidates across three sources, all
       cooked to be paper and coin in a world that has neither. This is the
       moment written from what actually moves. ---- */
    { ev: 'parts_pass',  label: 'PARTS CHANGE HANDS',    why: 'resource parts, metal with mass, handed over or tipped out. what actually moves when something changes hands in this valley' },
"""

RECIPE = """
    parts_pass: {
      /* METAL WITH MASS, SEVERAL PIECES, NO RING. The dead versions were a till:
         bright, small, counted, one event per coin. This is the opposite -- low,
         gritty, uneven, and it lands rather than chimes. Same weight-and-grit
         family as `set_down`, which he approved. */
      base: { synth: 'instrument', inst: 'boneplate', mat: 'metal', hz: 132,
              modes: 5, bright: 0.62, decay: 0.1875, damp: 2.3, warble: 0.5,
              atk: 0, trans: 0.6, transHz: 1800, transQ: 1.1, grit: 0.7,
              gritHz: 1200, space: 0.16, room: 0.1875, refl: 1, dark: 1400,
              width: 0.5, drive: 0.14, mkup: 0.86, gain: 0.32,
              hits: [0, 0.0625, 0.1875] },
      jit:  { hz: [104, 190], decay: [0.125, 0.3125], width: [0.4, 0.66],
              dark: [1000, 2100], grit: [0.55, 0.85] },
      instSets: ['boneplate', 'ratchet', 'anvil', 'reelclick', 'ironstep'],
      hitSets: [[0, 0.0625, 0.1875], [0, 0.125], [0, 0.0625, 0.125, 0.25],
                [0, 0.1875], [0, 0.0625, 0.25]]
    },
"""

# 2. the wires I added on 8/19 point at ids that are now permanently dead.
OLD_WIRE = """          try{ if(window.playSFX){ playSFX('money'); playSFX('cash_count'); } }catch(e2){}"""
NEW_WIRE = """          /* 8/20: `money` and `cash_count` are DEAD -- there is no paper and
             there are no coins, coins get melted into resource parts. What
             moves is PARTS. See laws/BOHEMIA_ADDENDUM_NO_PAPER_NO_COINS. */
          try{ if(window.playSFX)playSFX('parts_pass'); }catch(e2){}"""


def main():
    changed = []
    s = open(ENGINE, encoding='utf8').read()

    if "ev: 'parts_pass'" not in s:
        for a, b in DEAD.items():
            if a in s:
                s = s.replace(a, b, 1)
        mark = "    /* ---- end batch SFX-05 events ---- */"
        if mark not in s:
            print('FAIL: could not find the end of the events list')
            return 1
        tail = "for every porch, deck and floorboard in the game' }"
        if tail in s and (tail + ',') not in s:
            s = s.replace(tail, tail + ',', 1)
        s = s.replace(mark, EVENT + mark, 1)

        ranchor = '\n    walk_more: {'
        if ranchor not in s:
            print('FAIL: could not find the recipe table')
            return 1
        s = s.replace(ranchor, '\n' + RECIPE.rstrip() + ranchor, 1)
        open(ENGINE, 'w', encoding='utf8').write(s)
        changed.append('money / cash_count / hands_pass marked DEAD for their brief')
        changed.append('parts_pass added: resource parts, metal with mass, no ring')
    else:
        print('  engine already patched')

    a = open(ALPHA, encoding='utf8').read()
    if 'parts_pass' in a and OLD_WIRE not in a:
        print('  the alpha wire is already repointed')
    elif OLD_WIRE in a:
        open(ALPHA, 'w', encoding='utf8').write(a.replace(OLD_WIRE, NEW_WIRE, 1))
        changed.append('the purse-credit wire repointed off the dead ids')

    w = open('tools/bohemia_silent_moments_wire_patch.py', encoding='utf8').read()
    if OLD_WIRE in w:
        open('tools/bohemia_silent_moments_wire_patch.py', 'w', encoding='utf8').write(
            w.replace(OLD_WIRE, NEW_WIRE, 1))
        changed.append('and in the tool that owns that wire')

    for c in changed:
        print('  ' + c)
    if changed:
        print('  NEXT: measure any new voices, rebuild, re-run the wire tool')
    return 0


if __name__ == '__main__':
    sys.exit(main())
