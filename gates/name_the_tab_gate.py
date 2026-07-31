#!/usr/bin/env python3
"""THE NAME-THE-TAB GATE (7/28/26) — laws/BOHEMIA_ADDENDUM_NAME_THE_TAB_7_28_26.md

Paolo, 7/28: "I need you to always tell me what tab I can find this shit in."

He said it after a night in which I shipped constantly and never once told him
where to tap. The judge page went into the LIFE tab and I called it "the top card,
red border" without saying LIFE. The 42 re-cooked tiles are in no tab at all and I
called them "live", which was true about the repository and useless about his
thumb.

WHAT A GATE CAN AND CANNOT HOLD, said up front rather than left to be discovered:
it cannot read my replies, because replies are not files, and a gate that claimed
to check them would be exactly the self-attestation the autonomy doctrine bans. So
it holds the parts that ARE files, and one of them has real teeth.

  1. THE LAW EXISTS, is indexed, and still carries his words verbatim.
  2. CLAUDE.md AND THE AUTONOMY DOCTRINE both carry the clause, so every future
     session meets it in the first two files it opens. That is the only mechanism
     that actually survives me.
  3. EVERY JUDGING SURFACE IS REACHABLE FROM A TAB. This is the teeth. You cannot
     name a tab for a thing that is not in one, so a judge page that no tab links
     to fails the build instead of sitting there being technically shipped. The
     LIFE tab is the hub that routes to what needs his eyes, so that is where the
     check looks.

Run from repo root:  python3 gates/name_the_tab_gate.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

LAW = 'laws/BOHEMIA_ADDENDUM_NAME_THE_TAB_7_28_26.md'
CLAUDEMD = 'CLAUDE.md'
DOCTRINE = 'laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md'
HUB = 'slices/BOHEMIA_LIFE_CURRENT.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
QUOTE = 'I need you to always tell me what tab I can find this shit in'

# A judging surface is a page built to collect a verdict. These are the ones that
# must be reachable; a proof page or a lab is not a verdict surface.
JUDGE_GLOB = re.compile(r'BOHEMIA_.*JUDGE.*\.html$')

# Named, dated exemptions. A judge page that has been SUPERSEDED by a newer one
# is allowed to fall off the hub - the hub is a to-do list for his thumb, not an
# archive. Anything exempted says which page replaced it and when.
SUPERSEDED = {
    'BOHEMIA_TARGET_SCREEN_JUDGE_7_26_26.html':
        'kept on the hub as the CBB record; still linked, listed here only so a '
        'future cleanup knows it is deliberate',
    'BOHEMIA_QUEST_JUDGE_7_25_26.html':
        'superseded by BOHEMIA_QUEST_JUDGE_7_26_26.html (next day, same lane)',
    'BOHEMIA_PALETTE_JUDGE_7_29_26.html':
        'ANSWERED, same day it shipped. Paolo 7/29: "A". The hub is a to-do list for '
        'his thumb, not an archive, and a card asking a question he already answered '
        'is the surface equivalent of asking him to re-confirm his own words - which '
        'NOTES ARE RULINGS bans. The verdict lives in '
        'records/BOHEMIA_PALETTE_VERDICT_7_29_26.txt and the losing side is in the '
        'graveyard; the page stays on disk as the thing he was actually looking at '
        'when he ruled.',
    'BOHEMIA_HOUSE_JUDGE_7_29_26.html':
        'JUDGED AND KILLED the same day. Paolo 7/29: "its ass lowkey... i need you '
        'to care about house shapes and shit bro." The page is deleted with the house '
        'it was judging; this entry exists so the deletion reads as a recorded kill '
        'rather than a page that quietly fell off the hub. Verdict: '
        'records/BOHEMIA_HOUSE_01_VERDICT_7_29_26.txt.',
    'BOHEMIA_HOUSE_SHAPE_JUDGE_7_29_26.html':
        'JUDGED AND KILLED the same day. Paolo 7/29: "Im not gonna lie all of these '
        'looked just horrible tbh" - the second house rejection of the day, which STOP PRODUCING '
        'says ends the feature for the session. Page deleted with the study it showed. Verdict: '
        'records/BOHEMIA_HOUSE_SHAPES_VERDICT_7_29_26.txt.',
    'BOHEMIA_SUBURB_JUDGE_7_18_26.html':
        'DEAD by laws/BOHEMIA_ADDENDUM_UNJUDGED_IS_DEAD_7_26_26.md - it sat ten days '
        'unlinked and unjudged, and bulk silence IS a verdict. Districts are judged '
        'through BOHEMIA_BULK_JUDGE_7_27_26.html now. Putting a ten-day-old page back '
        'on his hub would be surfacing something unasked, which STOP PRODUCING bans; '
        'the honest move is to name it dead, not to resurrect it.',
}

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print('NAME THE TAB GATE — Paolo 7/28')

    chk(os.path.exists(LAW), 'the law is missing: %s' % LAW)
    if not os.path.exists(LAW):
        print('  %d passed, %d FAILED' % (P, F))
        return 1
    law = open(LAW).read()

    # 1. his words, verbatim, in his own law
    chk(QUOTE in law, 'the law no longer quotes him verbatim. A law that paraphrases '
                      'the ruling it came from drifts off it within a week.')
    chk('NOT IN A TAB YET' in law,
        'the law must keep the exact words for the not-in-a-tab case - that is the '
        'half I actually got wrong, not the half I got right')

    # 2. the two files every session reads first
    cm = open(CLAUDEMD).read()
    chk('NAME THE TAB' in cm, 'CLAUDE.md does not carry the clause, so a fresh '
                              'session will not know about it')
    chk(QUOTE in cm, 'CLAUDE.md carries the rule but not his words for it')
    chk(LAW in cm, 'CLAUDE.md does not point at the full law')
    doc = open(DOCTRINE).read()
    chk('NAME THE TAB' in doc, 'the autonomy doctrine\'s reply contract does not carry '
                               'the clause, so JUDGE THIS items can still land tabless')
    chk('NOT IN A TAB YET' in doc,
        'the doctrine must carry the not-in-a-tab wording too')

    # 3. THE TEETH: a verdict surface nobody can tap from a tab is not shipped
    hub = open(HUB, encoding='utf8', errors='replace').read() if os.path.exists(HUB) else ''
    chk(bool(hub), '%s is missing - that hub IS the LIFE tab' % HUB)
    linked = set(re.findall(r'href="([^"]+\.html)"', hub))
    pages = [f for f in os.listdir('slices') if JUDGE_GLOB.match(f)]
    chk(bool(pages), 'no judging surfaces found at all, which is suspicious rather than clean')
    for f in sorted(pages):
        if f in SUPERSEDED and f not in linked:
            print('  NOTE  %s is not on the hub: %s' % (f, SUPERSEDED[f]))
            continue
        chk(f in linked,
            '%s is a judging surface that NO TAB links to. You cannot tell him what '
            'tab to find it in, because it is not in one. Add it to the LIFE hub or '
            'say plainly that it is unreachable - do not ship a verdict surface he '
            'cannot tap.' % f)

    # and the hub itself has to be reachable from the alpha, or the whole chain
    # is a page that links to pages nobody can get to
    if os.path.exists(ALPHA):
        alpha = open(ALPHA, encoding='utf8', errors='replace').read()
        chk('data-p="life"' in alpha,
            'the alpha has no LIFE tab, so the hub every judging surface hangs off '
            'is itself unreachable')

    print('  %d passed, %d FAILED' % (P, F))
    if F == 0:
        print('  %d judging surfaces, all reachable from the LIFE tab' % len(pages))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
