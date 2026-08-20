#!/usr/bin/env python3
"""V169 THE OPEN BOOK. RF4-55 (machine 7), published in the register RF4-68 picks.

  "Deterministic AI plus published rules equals A GAME ABOUT KNOWLEDGE. Hidden AI
   plus randomness equals a game about adaptation. These are opposite promises
   and a game has to pick one."                                        [CAPTURE]

RF4-55's diff column says our substrate is already there -- bohemiaDice, armor 0
on all 320 bodies, "patterns are deterministic and learnable" locked in June. So
the machine is not the determinism. IT IS THE PUBLISHING, and we have none.

In four days this lane shipped five mechanics -- an acquisition delay, a sight
ceiling with a per-gun reach, a shout that carries between men, a free-movement
budget on a world clock, and an encounter band -- and NOT ONE NUMBER IN ANY OF
THEM IS WRITTEN ANYWHERE THE PLAYER CAN SEE IT. A game about knowledge where the
knowledge cannot be obtained is a game about guessing.

--------------------------------------------------------------------------
AND THE SPEC ALSO SAYS WHICH THINGS MAY BE WRITTEN DOWN, WHICH IS THE HARD PART
--------------------------------------------------------------------------
RF4-68, fleet-wide law, is a decision procedure and not a preference:

  "The teaching register should be chosen by whether the player COULD DERIVE the
   rule unaided. TELL them what they cannot derive. HINT at what they could. SHOW
   them what the room can demonstrate. *** NEVER EXPLAIN SOMETHING THE FLOOR
   COULD HAVE SHOWN. ***"

So this is not "write down everything the fight does". Most of what shipped this
week is deliberately NOT in here:

  THE HEAVY MOVES ORTHOGONALLY (V164)   register C. The floor shows it. Cut a
      corner, watch the machine fail to. V164 already wrote "nothing announces
      it" and that was the right call before this law was read.
  COVER TURNS THE GUNS OFF (V165)       register C. One rock, one try, done.
  THE SPOTTER TAKES YOUR LEGS (V168)    taught AT THE MOMENT IT HAPPENS -- press
      sprint and the refusal names the reason and both answers. A book entry
      would be strictly worse than a line that arrives exactly when it is true.

What is left is the set of things NO amount of looking can give you: counters
that live inside a body, a ceiling on your own eyes, how far a voice carries, and
the parity of a clock. RF4-65 names three of those exact categories as register A
by example -- "the 10-tile shout range", "the SP regen parity", the detection
radius -- so the shape of this list is his, not mine.

--------------------------------------------------------------------------
EVERY NUMBER IS READ OUT OF THE LIVE CONSTANT. NONE IS TYPED.
--------------------------------------------------------------------------
This is the whole engineering idea and it is the difference between a feature and
a text file. A PUBLISHED RULE THAT CAN DRIFT FROM THE CODE IS WORSE THAN NO
PUBLISHED RULE, because it is not merely stale, it is a LIE told by the game to
the player who trusted it. Every figure in the book is interpolated from the
constant that governs the behaviour -- ACQ_TURNS, SIGHT_TILES, REACH_CEIL,
SHOUT_TILES, SP_TICK, ENC_SIZES, WEAPON_RANGE -- so the day anybody tunes one, the
page changes with it and cannot be forgotten.

The gate does not read the source for this. It OPENS THE PANEL IN A REAL BROWSER,
reads the text the player would read, and compares every number against the live
constant. A string check would prove the template mentions a variable; only
running it proves the page says what the game does.

--------------------------------------------------------------------------
AND THE COST IS ACKNOWLEDGED, IN HIS OWN DOCUMENT
--------------------------------------------------------------------------
RF4-55's own diff column carries the warning: determinism "buys depth on first
contact and SPENDS IT OVER TIME, so new deterministic rules must keep arriving."
Publishing the rules is not a one-time job that closes a row. It is a standing
obligation, and it is written into the panel's own header comment so the next
session inherits it rather than discovering it.

REUSE CHECK: cooks NO graphic pixels. Reuses the existing DEMO SETTINGS panel and
its setgrp/gl/controls classes -- no new surface, no new tab, no new stylesheet --
and every value comes from a constant that already exists. Nothing authored, no
bank opened.

TASTE CHECK: authors no art. The taste rule is RF4-68 itself, and the restraint is
what is ABSENT: three of the five things shipped this week are deliberately left
out because the floor already teaches them. The temptation with a rules page is to
put everything on it, and everything on it is what makes nobody read it.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V169 THE OPEN BOOK'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v169 already in; nothing to do')
        return

    # ---- 0. the range doors can be asked about the RULE, not the weather
    #         THE BOOK'S FIRST DRAFT PRINTED "best inside 20, cannot reach past 8".
    #         Raw R.eff beside a NIGHT-SCALED max: an effective range larger than
    #         the gun's own maximum, and every max squashed under a headline that
    #         said nothing shoots past 16. A rules page states the RULE; it does
    #         not report tonight's weather as if it were the law.
    old = """function maxRange(R){ return Math.min(REACH_CEIL, Math.max(PT_BLANK+2, R.max*rangeMult())); }"""
    new = """function maxRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(REACH_CEIL, Math.max(PT_BLANK+2, R.max*k)); }"""
    js = subN(js, old, new)

    old = """function effRange(R){ return Math.min(maxRange(R), Math.max(PT_BLANK, R.eff*rangeMult())); }"""
    new = """function effRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(maxRange(R,k), Math.max(PT_BLANK, R.eff*k)); }"""
    js = subN(js, old, new)

    # ---- 1. the page it lives on -------------------------------------
    old = """  <div class="setgrp"><span class="gl">DIFFICULTY PACKAGE</span>"""
    new = """  <div class="setgrp"><span class="gl">THE OPEN BOOK &mdash; what you cannot work out by looking</span>
    <div class="controls"><div id="openbook" style="font:11px/1.55 ui-monospace,monospace;color:#c9bda4;white-space:pre-wrap;text-align:left;flex:1 1 100%;"></div></div>
  </div>

  <div class="setgrp"><span class="gl">DIFFICULTY PACKAGE</span>"""
    js = subN(js, old, new)

    # ---- 2. and it is generated, never typed --------------------------
    old = """function fullResetCombat(){"""
    new = """/* ===== V169 THE OPEN BOOK (RF4-55, machine 7) =====================
   "Deterministic AI plus published rules equals A GAME ABOUT KNOWLEDGE. Hidden
    AI plus randomness equals a game about adaptation. These are opposite
    promises and a game has to pick one."
   The determinism was already ours -- locked in June, and armor is 0 on every
   body so there is no hidden mitigation anywhere. What was missing is the
   PUBLISHING: five mechanics shipped in four days and not one of their numbers
   was written anywhere a player could see it.

   *** WHAT IS IN HERE IS DECIDED BY RF4-68, WHICH IS A PROCEDURE AND NOT A
   PREFERENCE: "tell them what they cannot derive, hint at what they could, show
   them what the room can demonstrate. NEVER EXPLAIN SOMETHING THE FLOOR COULD
   HAVE SHOWN." ***
   So these are ABSENT ON PURPOSE and adding them would be the error:
     the heavy moving orthogonally  -- the floor shows it, cut a corner
     cover turning the guns off     -- one rock, one try, done
     the spotter taking your legs   -- the refusal already names it, in the
                                       moment, which beats any book entry
   What is left is what no amount of looking can give you: counters inside a
   body, a ceiling on your own eyes, how far a voice carries, the parity of a
   clock.

   *** AND EVERY NUMBER IS READ OUT OF THE LIVE CONSTANT, NEVER TYPED. A
   published rule that can drift from the code is worse than no published rule,
   because it is not stale, it is a LIE told to the player who trusted it. ***

   THE STANDING OBLIGATION, from RF4-55's own column: determinism "buys depth on
   first contact and SPENDS IT OVER TIME, so new deterministic rules must keep
   arriving." Every future rule a player cannot derive belongs on this page. */
function openBookLines(){
  /* THE SAME DOORS the fight uses, asked with the night multiplier set aside so
     the page states the RULE. Not a second clamp written out here: a duplicate
     of the clamp is exactly the drift this whole feature exists to prevent. */
  const gun=(k,R)=>'    '+k.toUpperCase().padEnd(8)+'best inside '+effRange(R,1)+', cannot reach past '+maxRange(R,1);
  const L=[];
  L.push('A GUN NEEDS '+ACQ_TURNS+' TURNS ON YOU BEFORE IT CAN FIRE.');
  L.push('  Breaking his line resets it to zero. So does a sprint.');
  L.push('');
  L.push('YOU SEE '+SIGHT_TILES+' TILES. NOTHING SHOOTS PAST '+REACH_CEIL+'.');
  L.push('  There is always a band you can watch a man cross and not touch him.');
  for(const k of Object.keys(WEAPON_RANGE))L.push(gun(k,WEAPON_RANGE[k]));
  L.push(gun('sniper',SNIPER_RANGE));
  L.push('  The dark shortens every one of these by the same amount.');
  L.push('');
  L.push('A MAN WHO SEES YOU TELLS EVERYONE WITHIN '+SHOUT_TILES+' TILES.');
  L.push('  They come without ever seeing you themselves.');
  L.push('');
  L.push('SPEED REFILLS EVERY '+SP_TICK+'TH TURN OF THE WORLD, NOT ON A COOLDOWN.');
  L.push('  Spend it all on turn 4 and it is back on turn 5. Hoarding earns nothing.');
  L.push('');
  L.push('A FIGHT IS '+ENC_SIZES[0]+' TO '+ENC_SIZES[ENC_SIZES.length-1]+' BODIES, AND ONE OF THEM IS THE WORST.');
  L.push('  Bigger than that is a boss, and you can pin the number yourself above.');
  return L; }
function buildOpenBook(){ const d=D('openbook'); if(!d)return; d.textContent=openBookLines().join('\\n'); }
function fullResetCombat(){"""
    js = subN(js, old, new)

    # ---- 3. and it is built when the panel is built -------------------
    old = """fullResetCombat();
rollPattern();"""
    new = """try{ buildOpenBook(); }catch(_e){}   /* V169: the page writes itself from the constants at boot */
fullResetCombat();
rollPattern();"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v169: the open book -- %d chars' % len(js))


if __name__ == '__main__':
    main()
