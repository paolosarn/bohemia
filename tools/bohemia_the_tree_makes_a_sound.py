#!/usr/bin/env python3
"""
THE TREE MAKES A SOUND (8/30/26, SOUND lane) - SFX-12's seven moments get callers.

A COOK WITHOUT A CALLER IS NOT A SHIPPED SOUND, IT IS A CANDIDATE ON A JUDGING
SHEET. silent_moments_gate has the rule in as many words and this lane wrote it
after shipping six moments with no callers on 8/20. So SFX-12's seven recipes
get their call sites in the same turn they are cooked.

WHAT IT WIRES, all inside COMBAT_B64, all on functions that already exist:

    treeEarn(n)   -> xp_lands    experience off a body
                  -> level_up    WHEN treeLevel() CROSSES. See below.
    treeBuy(id)   -> perk_taken  a point spent, the perk applied
    keyWin(id)    -> key_taken   a boss hands you a verb
                  -> held_back   the branch where you already hold it

*** I WAS ABOUT TO WRITE A LEVEL-UP DETECTOR THAT ALREADY EXISTED. *** SFX-12's
own docstring says "a level-up is not even an event yet", read off
bohemia_combat_the_tree_patch.py. THE SHIPPED MODULE IS NEWER THAN THAT TOOL:
V189 added the crossing, with the comment "a level is a MOMENT, not a number
that quietly ticks over", and it already puts a line on screen. The moment was
built; it just had no sound.

A PATCH TOOL IS NOT THE BUILD. Reading the tool that created a thing tells you
what it looked like on the day it was written, and four versions have landed
since. Decoding COMBAT_B64 and reading what is actually there is the only way to
know, and it is the same VERIFY ON THE REAL SURFACE rule with the surface being
source rather than pixels. So this wire is smaller than planned: it hangs a
sound on the branch V189 already provides and invents nothing.

IT USES sfxAsk, THE CHANNEL THAT IS ALREADY THERE. Combat has posted
{type:'BOHEMIA_SFX'} to the parent since 7/31 so there is ONE AudioContext, the
music studio's, with its limiter. This tool invents no second channel.

WHAT IT DOES NOT WIRE, AND WHY THAT IS SAID OUT LOUD RATHER THAN LEFT BLANK:
`boss_here` and `boss_falls` have no single call site. `rollBoss` returns a boss
long before the player is told about one, and a boss's death runs through the
same kill path as everybody else's with no branch that knows he was named. Both
want a hook that does not exist yet, and inventing one would be this lane
writing combat rather than wiring it. They are cooked, judgeable, and carry a
written reason in silent_moments_gate instead of a caller.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel. It adds five calls
to sounds SFX-12 already cooked, through a channel that already exists.

  python3 tools/bohemia_the_tree_makes_a_sound.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_TREE_MAKES_A_SOUND__'

WIRES = [
    # (what, anchor, replacement)
    ('xp_lands, on the experience landing',
     "  TREE.xp=(TREE.xp||0)+n; treeSave();\n"
     "  /* V189: a level is a MOMENT, not a number that quietly ticks over. */",
     "  TREE.xp=(TREE.xp||0)+n; treeSave();\n"
     "  try{ sfxAsk('xp_lands'); }catch(_e){}   /* __THE_TREE_MAKES_A_SOUND__ */\n"
     "  /* V189: a level is a MOMENT, not a number that quietly ticks over. */"),

    ('level_up, on the crossing V189 already detects',
     "  if(treeLevel()>_was)try{ setRead('LEVEL '+treeLevel(),",
     "  if(treeLevel()>_was)try{ sfxAsk('level_up'); }catch(_e){}\n"
     "  if(treeLevel()>_was)try{ setRead('LEVEL '+treeLevel(),"),

    ('perk_taken, where the point is actually spent',
     "  TREE.spent.push(id); treeSave();",
     "  TREE.spent.push(id); treeSave();\n"
     "  try{ sfxAsk('perk_taken'); }catch(_e){}   /* __THE_TREE_MAKES_A_SOUND__ */"),

    ('key_taken, on the boss key landing',
     "  KEYS.taken.push(id); keysSave();",
     "  KEYS.taken.push(id); keysSave();\n"
     "  try{ sfxAsk('key_taken'); }catch(_e){}   /* __THE_TREE_MAKES_A_SOUND__ */"),

    ('held_back, on the branch where you already hold it',
     "  if(keyHas(id)){ try{ setRead(b.n+' AGAIN','you already hold this one','#8a7d66'); }catch(_e){} return false; }",
     "  if(keyHas(id)){ try{ sfxAsk('held_back'); }catch(_e){}\n"
     "    try{ setRead(b.n+' AGAIN','you already hold this one','#8a7d66'); }catch(_e){} return false; }"),
]


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i0 = src.index(key) + len(key)
    j0 = src.index("'", i0)
    demo = base64.b64decode(src[i0:j0]).decode('utf8')
    print('=== THE TREE MAKES A SOUND ===')
    print('  decoded COMBAT_B64: %d bytes' % len(demo))

    if MARK in demo:
        print('  already installed (idempotent, nothing to do)')
        return 0

    if 'function sfxAsk(' not in demo:
        print('FAIL: sfxAsk is not in this combat module -- the channel this '
              'wire uses does not exist, and inventing a second one would mean '
              'a second AudioContext')
        return 1

    for what, anchor, rep in WIRES:
        if anchor not in demo:
            print('FAIL: anchor missing for %s' % what)
            return 1
        if demo.count(anchor) != 1:
            print('FAIL: anchor for %s is not unique (%d)' % (what, demo.count(anchor)))
            return 1
        demo = demo.replace(anchor, rep, 1)
        print('  WIRED  %s' % what)

    enc = base64.b64encode(demo.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(src[:i0] + enc + src[j0:])
    print('  re-encoded, %d bytes' % len(demo))
    print('  NOT WIRED, with a written reason: boss_here and boss_falls have no '
          'single call site -- rollBoss returns a boss long before the player is '
          'told, and a boss dies through the same path as everybody else. Both '
          'want a hook that does not exist, and inventing one would be this lane '
          'writing combat rather than wiring it.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
