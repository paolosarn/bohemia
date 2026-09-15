#!/usr/bin/env python3
"""
A SIDEWALK SOUNDS LIKE CONCRETE (9/15/26, SOUNDS lane) -- the defect this lane
measured on the demo he played and wrote down rather than half-fix.

*** MEASURED, with an ear on the real demo for five real minutes (9/14,
tools/bohemia_ears_five_minutes.js): the city posted 28 step_dirt and ONE
step_concrete, and the live step bank the game had loaded held THREE surfaces --
step_dirt 5, step_asphalt 5, step_gravel 5. Nothing else. ***

So every concrete footfall in the game plays the DIRT sample, through a fallback:

    var ev = 'step_' + ({asphalt:'asphalt',dirt:'dirt',gravel:'gravel'})[surface] || 'dirt'

A map of three, an `|| 'dirt'`, and every other ground in the valley lands on dirt.

AND IT IS NOT A MISSING COOK. He approved these. The newest approved bank
(banks/BOHEMIA_SFX_APPROVED_8_20_26.json, 65 keys) carries SIX footstep surfaces:

    step_asphalt   5 variants     in the game
    step_dirt      5 variants     in the game
    step_gravel    5 variants     in the game
    step_concrete  1 variant      APPROVED AND UNREACHABLE
    step_sand      1 variant      APPROVED AND UNREACHABLE
    step_wood      2 variants     approved, and unreachable FOR A REASON (below)

The game embeds a footstep block with three keys, from before those were thumbed.
THE BANK HE APPROVED AND THE BANK THE GAME LOADS ARE DIFFERENT BANKS, and the
difference is silent: the fallback means nobody ever hears a missing surface, they
hear the wrong one.

*** AND THIS LANE'S OWN STATE LINE ON THE BOARD SAYS THE OPPOSITE. Its words: "all
five reachable footstep surfaces are walked onto and fired (dirt, concrete,
asphalt, gravel, sand)". That is FALSE for the shipped alpha and has been since it
was written. The 9/5 round that wrote it measured the CITY'S CLASSIFIER -- which
really does name five surfaces -- and never checked that the shell could play them.
A CENSUS OF WHAT IS ASKED FOR IS NOT A CENSUS OF WHAT CAN SOUND. ***

WHY IT MATTERS IN HIS FIVE MINUTES: a sidewalk is concrete. He walks on sidewalks
constantly, and "even the streets and the sidewalks, it's all looking fucked up" is
on his own break list. This does not fix a picture, but the sidewalk he is
complaining about has been telling his ears it is a dirt path.

TWO CHANGES, ONE MARK EACH.

1. __THE_STEP_BANK_IS_THE_APPROVED_BANK__  the embedded footstep block is rebuilt
   from the newest approved bank, so what he thumbed is what the game can play.
   CONTENTS-PAOLO'S is not violated, it is finally OBEYED: every variant added here
   is one he approved on 8/12 or 8/20, copied byte for byte, and nothing unapproved
   is added. WOOD IS DELIBERATELY LEFT OUT and the reason is already on this lane's
   board: no wooden ground exists in the valley, measured across 18 districts. An
   unreachable sound in the bank is dead weight that makes the census lie.

2. __A_SURFACE_PLAYS_ITSELF__  the three-key map becomes the identity for every
   surface the bank can answer, with dirt as the last resort for a ground nobody
   has named yet. The fallback stays -- an unknown ground must still make a sound --
   but it stops swallowing two surfaces that have their own.

REUSE CHECK: cooks nothing. No bank candidate, no pixel, no new sound, no new
event, no new number. Two surfaces he already approved get their callers back.

  python3 tools/bohemia_a_sidewalk_sounds_like_concrete.py
"""
import glob
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
M_BANK = '__THE_STEP_BANK_IS_THE_APPROVED_BANK__'
M_MAP = '__A_SURFACE_PLAYS_ITSELF__'

# every footstep surface the city's own classifier can name AND the bank can answer.
# wood is approved and left out on purpose: no wooden ground exists in the valley.
WANT = ['step_dirt', 'step_asphalt', 'step_gravel', 'step_concrete', 'step_sand']

MAP_OLD = ("  var ev = 'step_' + (({asphalt:'asphalt',dirt:'dirt',gravel:'gravel'})"
           "[surface] || 'dirt');")
MAP_NEW = """  /* __A_SURFACE_PLAYS_ITSELF__ (9/15, SOUNDS lane) -- A MAP OF THREE WAS
     SWALLOWING TWO SURFACES HE APPROVED. This read
     ({asphalt,dirt,gravel})[surface] || 'dirt', so concrete and sand -- both
     thumbed, both cooked, both named by the city's own classifier -- came out as
     the DIRT sample, and the fallback meant nobody could ever hear that they were
     missing. MEASURED on the demo with an ear for five real minutes: 28 dirt steps
     and one concrete step posted, and a live bank holding only three surfaces.
     A SIDEWALK IS CONCRETE, and his own break list says the sidewalks are wrong.
     The identity for anything the bank can answer, and dirt only for a ground
     nobody has named yet -- an unknown surface must still make a sound. */
  var _s = String(surface||'');
  var ev = 'step_' + ((STEP_BANK && STEP_BANK['step_'+_s]) ? _s : 'dirt');"""


def main():
    print('=== A SIDEWALK SOUNDS LIKE CONCRETE ===')
    src = open(ALPHA, encoding='utf8').read()
    if M_BANK in src and M_MAP in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    banks = sorted(glob.glob('banks/BOHEMIA_SFX_APPROVED_*.json'))
    if not banks:
        print('FAIL: no approved sfx bank on disk')
        return 1
    newest = banks[-1]
    appr = json.load(open(newest, encoding='utf8'))
    print('  READ     %s (%d keys)' % (newest, len(appr)))

    have = {k: appr[k] for k in WANT if isinstance(appr.get(k), list) and appr[k]}
    missing = [k for k in WANT if k not in have]
    if missing:
        print('FAIL: the approved bank does not carry %s, so this cannot deliver '
              'them; re-measure before trusting this tool' % missing)
        return 1
    for k in sorted(have):
        print('  HAVE     %-15s %d approved variant(s)' % (k, len(have[k])))

    m = re.search(r'(id="sfxApproved"[^>]*>)(.*?)(</script>)', src, re.S)
    if not m:
        print('FAIL: the embedded approved block is not where this expects it')
        return 1
    cur = json.loads(m.group(2))
    print('  IN GAME  %s' % sorted(cur.keys()))

    # EVERY VARIANT MUST COME FROM HIS BANK, byte for byte. Nothing is authored here.
    for k, v in have.items():
        if k in cur and cur[k] != v:
            print('  NOTE     %s already in the game with %d variant(s); the '
                  'approved bank has %d, and HIS bank wins'
                  % (k, len(cur[k]), len(v)))
    block = json.dumps(have, indent=1, ensure_ascii=False)
    mark = ('\n/* ' + M_BANK + ' (9/15, SOUNDS lane) -- REBUILT FROM THE BANK HE\n'
            '   THUMBED. The block used to carry three surfaces while the approved bank\n'
            '   carried six, so step_concrete and step_sand were approved, cooked and\n'
            '   unplayable, and the fallback in stepSfx handed both of them the DIRT\n'
            '   sample instead. Every variant below is copied out of\n'
            '   ' + newest + ' byte for byte; nothing here is authored.\n'
            '   WOOD IS LEFT OUT ON PURPOSE: no wooden ground exists in the valley,\n'
            '   measured across 18 districts, and an unreachable sound in the bank is\n'
            '   dead weight that makes the census lie. */\n')
    src = src[:m.start(2)] + mark + block + '\n' + src[m.end(2):]
    print('  REBUILT  the embedded block now carries %d surfaces' % len(have))

    if src.count(MAP_OLD) != 1:
        print('FAIL: the surface map is not where this expects it (%d)'
              % src.count(MAP_OLD))
        return 1
    src = src.replace(MAP_OLD, MAP_NEW, 1)
    print('  FIXED    a surface plays itself; dirt is the last resort, not the rule')

    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  A sidewalk has been telling his ears it is a dirt path.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
