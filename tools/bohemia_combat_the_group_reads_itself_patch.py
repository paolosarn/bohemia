#!/usr/bin/env python3
"""
V171 THE GROUP READS ITSELF -- RF4-25, and it is a THREE-STAR row.

  "Enemies synergize when in groups, with each new enemy treated differently
   depending on what group it spawns with, creating EXPONENTIAL GROWTH IN
   COMPLEXITY... THE SAME ENEMY ADDED TO 5 VERY DIFFERENT GROUPS SHOULD PRODUCE
   5 VERY DIFFERENT COMBAT ENCOUNTERS."

OUR OWN DIFF COLUMN, WRITTEN BEFORE ANY OF THIS SHIPPED, ANSWERED PAOLO'S
COMPLAINT WORD FOR WORD:

  "ABSENT. 5 real types exist and none of them read each other. This is the
   actual answer to why the fight feels flat."

MEASURED 8/20 RATHER THAN REPEATED: every enemy brain in the blob does loop the
roster -- pressAI, coverSeekAI, enterAim, grenadeTurn, meleeTurnRun -- and every
one of those loops is OCCUPANCY, marked `one body per spot` in the source. Not
one enemy's decision depended on what another enemy IS or is DOING. Five
archetypes, five solo actors sharing a room. That is why V167 could put six
bodies on the board and each extra body made the fight EASIER: more actors, zero
interaction. Adding a sixth man to five men who ignore each other adds one man,
not a group.

WHAT SHIPS: ONE read of the roster, `squadRead()`, computed once per turn and
consulted at exactly TWO decision points -- never sprayed through the brains,
because six copies of "what is the group doing" is five future places to forget
it. That is machine 4's discipline (vision as one variable) applied to the
roster instead of to sight.

THE THREE RULES, all of them about DISTANCE and TIMING, none about damage:

  1. THE ANVIL. While a friendly BLADE is closing on the player, the gunmen stop
     closing and hold their firing distance. The blade is the hammer and they
     are the anvil; walking into their own knife-man's lane is how a group
     shoots itself. Same goon, with and without a blade beside him, plays two
     different fights -- which IS the row.
  2. THE MARKSMAN'S LANE. While a living SPOTTER has a line on the player, the
     others hold further back and let him work. Put him down and the whole group
     presses in. This gives V168's priority target a SECOND consequence beyond
     his own pin, so ignoring him now costs you the whole room's pressure.
  3. *** CUT BEFORE SHIPPING, AND THAT IS THE POINT. *** A third rule was
     written and measured: a man does not give up stone for open ground unless a
     friendly has a bead on you. Over 20 arenas and ~200 steps a side it moved
     the number it exists to move by ZERO -- 30 cover-leaving steps with it and
     29-31 without, in every arm. It was not confounded and it was not
     mis-gated: the condition it reads is live (somebody holds a bead on 12.2%
     of real turns, so the rule was armed on the other 87.8%). It simply did not
     change a decision, because the standoff rules above already decide where
     these men stand. A DEAD DIAL IS WORSE THAN NO DIAL (V168, where the first
     version of the spotter was cut for measuring inside the noise rather than
     shipped as flavour). Shipping an unmeasurable rule inside a measured
     feature is how the measured parts stop being believed.

REUSE CHECK: cooks no graphic pixels, opens no bank. It reuses the predicates
the fight already owns rather than writing new ones -- `acquired`, `seesMe`,
`pinned`, `pillarAtXY`, and pressAI's own `standoff` variable, which was already
the single number deciding how close a man is willing to get. No new geometry,
no second copy of any rule. `pillarAtXY` was reused by the cut third rule only,
and went with it.

TASTE CHECK: no new button, no new HUD number, no readout of its own. The player
learns it the way RF4-68 demands the floor teach things -- the goons behave
differently when the knife-man is up, and he finds that out by killing the
knife-man. NEVER EXPLAIN SOMETHING THE FLOOR COULD HAVE SHOWN, so this is
deliberately NOT going on the OPEN BOOK page.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.

NO DAMAGE BEFORE THE DIAL: not one damage number, accuracy number or hp number
is touched. All three dials are DISTANCES and the third is a boolean about
cover. A group that reads itself is allowed to be scarier by standing in better
places, never by hitting harder.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V171 THE GROUP READS ITSELF'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:120]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v171: already applied')
        return

    # ---- 1. THE READ ITSELF, beside the constants that drive the press ----
    d = sub(d,
        "const PRESS_PULL=2.2;",
        """/* ===== V171 THE GROUP READS ITSELF (RF4-25, three stars) ==========
   "The same enemy added to 5 very different groups should produce 5 very
    different combat encounters."
   ONE READ OF THE ROSTER, once a turn, consulted in three places. Every enemy
   brain in this file already looped G.e and every one of those loops was
   OCCUPANCY -- do not stand where somebody is standing. Nobody ever asked what
   anybody else WAS. This is that question, asked once, cached on the turn, so a
   sixth body changes what the other five do instead of just adding a sixth
   target. Six copies of it in six brains would be five places to forget it,
   which is exactly what machine 4 exists to prevent. */
/* THE DIALS SIT OUTSIDE WHERE HE ALREADY WANTS TO STAND, and that had to be
   MEASURED rather than assumed. A lone goon walks in and settles at 6.0 tiles,
   which is his gun's effective range -- so the first cut of these numbers (anvil
   5.0, lane 6.5) changed NOTHING, because both were at or inside a distance he
   never crosses anyway. Measured: alone 6.0, with a blade closing 6.0, with a
   marksman up 7.0. Three arms, one behaviour. A DEAD DIAL IS WORSE THAN NO DIAL
   (V168) and this is the second time that lesson has had to be learned by
   playing it rather than by reading it. */
const SQ_HAMMER=6.0;    /* [DIAL] how close a blade has to be before the guns become the anvil */
const SQ_ANVIL=8.5;     /* [DIAL] the distance they hold while their knife-man works */
const SQ_LANE=9.5;      /* [DIAL] how far back they stay out of a living marksman's lane */
function squadRead(){
  const t=G.mTurn||0;
  if(G._sq&&G._sq.t===t)return G._sq;
  const live=(G.e||[]).filter(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing);
  /* a blade is only a hammer while it is actually SWINGING toward you */
  const bladeClosing=live.some(e=>e.melee&&(e.edist||99)<=SQ_HAMMER);
  /* the priority target is working, and the room knows it */
  const marksmanUp=live.some(e=>e.E&&e.E.spotter&&seesMe(e));
  return (G._sq={t:t,bladeClosing:bladeClosing,marksmanUp:marksmanUp,n:live.length});
}
const PRESS_PULL=2.2;""",
        what='squadRead')

    # ---- 2. THE ANVIL + THE MARKSMAN'S LANE: one variable, already there ----
    d = sub(d,
        "    const standoff=(_aim||G.hold)?HOLD_PASS:PRESS_STANDOFF;",
        """    let standoff=(_aim||G.hold)?HOLD_PASS:PRESS_STANDOFF;
    /* ===== V171 RF4-25, RULES 1 AND 2 =============================
       standoff was ALREADY the one number deciding how close a man is willing
       to get, so the group's read lands here and nowhere else. A man walking to
       a remembered tile (_aim) is running an objective, not fighting, and is
       left alone by both rules for the same reason V137 left him alone. */
    if(!e.melee&&!_aim){
      const _sq=squadRead();
      /* THE ANVIL: their knife-man is the hammer, so the guns stop closing and
         hold a firing line instead of crowding into his lane. */
      if(_sq.bladeClosing)standoff=Math.max(standoff,SQ_ANVIL);
      /* THE MARKSMAN'S LANE: while the spotter has eyes on you the rest stay
         back and let him work -- so putting him down does not just lift his pin
         (V168), it brings the whole room forward. */
      if(_sq.marksmanUp&&!(e.E&&e.E.spotter))standoff=Math.max(standoff,SQ_LANE);
    }""",
        what='standoff')

    # ---- 3. (CUT. see the docstring: it was measured and it did nothing) ----
    # ---- 4. and the cache dies with the fight ----
    d = sub(d,
        "G.smoke=[]; }   /* V170: new lot, clear air */",
        "G.smoke=[]; G._sq=null; }   /* V171: and the group forgets */   /* V170: new lot, clear air */",
        what='reset')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v171: the group reads itself -- %d chars' % len(d))


if __name__ == '__main__':
    main()
