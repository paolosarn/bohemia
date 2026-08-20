#!/usr/bin/env python3
"""
V173 THE MAN WHO KEEPS LEAVING -- RF4-38 (two stars) and RF4-27.

  "SUPPORT ENEMIES HAVE THEIR OWN AI, AND IT RUNS AWAY FROM YOU. Backliners
   maintain line-of-sight and range with at least one ALLY while biased AGAINST
   being close to, or in line-of-sight of, the PLAYER. Built to be hard to reach,
   which forces the player to either aggro into them or have tools to pick them
   off."

Our own diff column: "ABSENT. No enemy reads another enemy (RF4-25). This is the
concrete version of RF4-27, and it is the mechanism that makes RF4-37 real: THE
THING YOU MUST KILL KEEPS LEAVING."

V171 built the group READ. This is the first body whose entire existence is about
the group rather than about you, which is what RF4-38 asks for by name.

*** AND IT IS AIMED AT YESTERDAY'S DEFECT. *** The 8/20 measurement found firing
your weapon STRICTLY DOMINATED -- six policies, monotonic, fewest shots wins most
and bleeds least -- because a fight has exactly one currency (reach the way out)
and shooting buys none of it. The conclusion recorded that day stands: you do not
fix that by making the door harder to reach. YOU FIX IT BY MAKING THE MEN IN THE
ROOM WORTH SOMETHING. RF4-27's diff column says the same thing in fewer words: "a
single healer or buffer turns a crowd into a priority-target puzzle -- this is
the cheapest possible entry into RF4-25."

WHAT HE DOES: HE STANDS THE DOWNED BACK UP, AND HE RALLIES THE BROKEN.

Both are states this fight already ships and neither is an hp number I chose.
V32's weapon-gated lethality leaves a man DOWNED at hp 1 when the killshot is not
fatal; V71's nerve system breaks or scatters the survivors once half the room is
out of it. Nothing had ever undone either. Now one body does, and it is the RF4
support archetype exactly: "any monster that heals or buffs his allies."

*** HE IS REVIVED AT THE HP THE GAME LEFT HIM, WHICH IS 1. *** The medic sets no
health number at all -- a man he stands up dies to anything. What it costs you is
a TURN, not health: you have to shoot that body a second time. So the puzzle is
not "out-damage the healer", it is KILL HIM FIRST AND YOUR KILLS STICK, which is
RF4-37's priority target and RF4-27's "a single healer turns a crowd into a
priority-target puzzle" in one move.

THE FIRST VERSION OF HIS JOB WAS CUT AFTER MEASURING IT. He un-pinned allies --
undoing the player's SUPPRESS, which reads like a perfect counter to an effective
player action (RF4-28). Two things killed it. SUPP_TURNS is 1, so a pin expires
on its own the next turn anyway and removing it early is worth almost nothing.
And doSuppress pins EVERY exposed man including the medic himself, so one press
of the button switched him off permanently: measured, 480 of 480 pins survived
with him alive and 352 of 352 with him dead -- identical, because he never got a
turn. A counter with a one-button counter is not a counter.

HE IS A GOON WITH A JOB. His hp, accuracy and damage are ARCH.human's, copied,
not chosen. NO DAMAGE BEFORE THE DIAL is untouched by an entire new archetype,
and it also makes the measurement pure: any difference this body makes is
BEHAVIOUR, because there is no other difference to point at.

REUSE CHECK: cooks no graphic pixels, opens no bank. The shyness rides pressScore
-- the scorer the whole press already uses -- rather than a second movement
brain, and it reuses coverAtXY (already the term deciding whether a tile has a
clean angle on you) simply inverted: what a shooter wants, a backliner avoids.

TASTE CHECK: no new button, no new HUD number. He announces himself the only way
anything in this fight does, through the readout, and only when he actually does
something.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.

DRAFT WORDS: his name and his line are a real attempt tagged draft, per ALWAYS
MAKE AN ATTEMPT (8/11) -- an empty field is a blank page and he edits, he does
not write from nothing.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V173 THE MAN WHO KEEPS LEAVING'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:140]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v173: already applied')
        return

    # ---- 1. THE BODY, declared beside every other identity number ----
    d = sub(d,
        "  sniper:{n:'SNIPER',hp:45, acc:0.72, dmg:[32,48], bot:false, melee:false, spotter:true},",
        """  sniper:{n:'SNIPER',hp:45, acc:0.72, dmg:[32,48], bot:false, melee:false, spotter:true},
  /* ===== V173 THE MAN WHO KEEPS LEAVING (RF4-38, two stars) =====
     "Backliners maintain line-of-sight and range with at least one ALLY while
      biased AGAINST being close to, or in line-of-sight of, the PLAYER."
     HE IS A GOON WITH A JOB. hp, acc and dmg are ARCH.human's, COPIED, not
     chosen -- so an entire new archetype sets no damage number at all, and any
     difference he makes is BEHAVIOUR because there is no other difference to
     point at. The role is DECLARED here next to the numbers, the way V164 put
     `ortho` and V168 put `spotter`, rather than derived from a threshold
     somewhere, which would be authoring behaviour behind a formula.
     [draft:true] on the NAME only -- what these people are called is his. */
  medic:{n:'MEDIC', hp:60,  acc:0.55, dmg:[14,26], bot:false, melee:false, medic:true, draft:true},""",
        what='ARCH.medic')

    # ---- 2. HE RUNS FROM YOU AND STAYS WITH HIS PEOPLE ----
    d = sub(d,
        "function pressScore(e,x,y,aim){",
        """/* MEDIC_SHY IS NOT HERE, AND THAT IS A MEASUREMENT, NOT AN OVERSIGHT. A "how
   badly he wants to be away from you" term was written first and mutation
   testing killed it: with it set to zero he still ended 7.5 tiles out against
   7.39 with it, and still had no clean line on him 67% of the time. THE HIDE
   TERM WAS DOING ALL OF IT -- a tile with no angle on you is a tile far from
   you most of the time, so the distance term was buying a thing already bought.
   A DEAD DIAL IS WORSE THAN NO DIAL, third time this month. */
const MEDIC_HERD=1.6;   /* [DIAL] per tile: how badly he wants somebody between you and him */
const MEDIC_PULL=2.4;    /* [DIAL] per tile: how hard a body on the floor drags him out of cover */
const MEDIC_HIDE=2.6;    /* [DIAL] what a tile with no clean line to you is worth to him */
function pressScore(e,x,y,aim){
  /* ===== V173 RF4-38, AND IT IS THE FIRST TERM ON PURPOSE =========
     A backliner is not a shooter with a bigger standoff, he is a different
     animal, so his scoring replaces the shooter's rather than adjusting it. It
     runs BEFORE the memory branch too: a man whose job is to be hard to reach
     does not go walking to the last place he saw you, which is precisely the
     behaviour that would deliver him to your feet.
     TWO TERMS, NOT THREE: with at least one ally, and out of the player's line.
     The row's first clause (away from the player) was written as its own term
     and MEASURED TO DO NOTHING -- see the note on MEDIC_SHY above -- because
     being out of your line already puts him far away. The second one reuses
     coverAtXY INVERTED -- the shooter branch below pays +3.0 for a tile with a
     clean angle on you, and this pays for one without. What a shooter wants, a
     backliner avoids. */
  if(e&&e.E&&e.E.medic){
    /* ===== A BODY ON THE FLOOR OUTRANKS HIS OWN SKIN, AND THAT IS THE
       WHOLE FIGHT WITH HIM. Measured without this: he hid so well he could not
       reach anybody -- 10 saves out of 109 knockdowns, because he sat at 7.4
       tiles and his reach is 5. Raising the reach would have let him work the
       room from cover, which is a healer with no counterplay. Instead the
       WOUNDED PULL HIM OUT: knock a man down and the medic breaks cover to get
       to him, which is your window. That is RF4-38's own closing line -- built
       to be hard to reach, "which forces the player to either aggro into them or
       HAVE TOOLS TO PICK THEM OFF" -- except the tool is a body on the ground,
       and you make it yourself. */
    { let dd=99;
      for(const o of (G.e||[])){ if(o===e||!o||o.dead||!o.downed)continue;
        const q=pXY(o); dd=Math.min(dd,Math.hypot(q[0]-x,q[1]-y)); }
      if(dd<90) return -MEDIC_PULL*dd + (coverAtXY(x,y,e.lvl)?MEDIC_HIDE:0); }
    let near=99;
    for(const o of (G.e||[])){ if(o===e||!o||o.dead||o.downed)continue;
      const q=pXY(o); near=Math.min(near,Math.hypot(q[0]-x,q[1]-y)); }
    let ms=0;
    if(near<90)ms-=MEDIC_HERD*Math.min(near,12);
    if(coverAtXY(x,y,e.lvl))ms+=MEDIC_HIDE;
    return ms; }""",
        what='pressScore medic branch')

    # ---- 3. AND HE UNDOES YOUR SUPPRESS ----
    d = sub(d,
        "function tickTurnEnd(){ meleeTurnRun();",
        """const MEDIC_REACH=5.0;   /* [DIAL] how far he will go to get somebody back up */
const MEDIC_CD=1;        /* [DIAL] turns between two of his saves */
/* ===== V173: WHAT HE ACTUALLY DOES ================================
   He stands the DOWNED back up and he rallies the BROKEN. Both states already
   ship and neither is an hp number anybody chose: V32's weapon-gated lethality
   leaves a man downed at hp 1 when the killshot is not fatal, and V71's nerve
   system breaks or scatters the survivors once half the room is out of it.
   Nothing had ever undone either.
   REVIVED AT THE HP THE GAME LEFT HIM, WHICH IS 1, so the medic sets no health
   number at all and a man he stands up dies to anything. What he costs you is a
   TURN, not health -- you shoot that body a second time -- which makes the play
   KILL HIM FIRST AND YOUR KILLS STICK rather than out-damage the healer.
   HE COMES UP WINDED (stun 1): a man does not get off the floor shooting, and it
   is the state the fight already uses for exactly that. */
function medicTurn(){
  if(G.over)return;
  for(const m of (G.e||[])){
    if(!m||m.dead||m.downed||m.broken||m.fleeing)continue;
    if(!(m.E&&m.E.medic))continue;
    if(pinned(m)||(m.stun||0)>0||(m.prone||0)>0)continue;   /* head-down himself, and THAT is the answer to him */
    if((m._medCd||0)>0){ m._medCd--; continue; }
    const p=pXY(m);
    let best=null,bs=0;
    for(const o of (G.e||[])){
      if(o===m||!o||o.dead)continue;
      /* a body on the floor first, then a man who has lost his nerve */
      const need=o.downed?3:((o.broken||o.fleeing)?1:0);
      if(!need)continue;
      const q=pXY(o); if(Math.hypot(q[0]-p[0],q[1]-p[1])>MEDIC_REACH)continue;
      if(need>bs){bs=need;best=o;} }
    if(!best)continue;
    const _wasDown=!!best.downed;
    best.downed=false; best.broken=false; best.fleeing=false;
    best.stun=Math.max(best.stun||0,1);   /* winded: nobody gets off the floor shooting */
    best._medAt=performance.now();
    m._medCd=MEDIC_CD;
    /* [draft:true] his words are an attempt, not canon */
    try{ setRead(_wasDown?'HE GETS HIM BACK UP':'HE TALKS HIM ROUND',
      _wasDown?'that one is standing again \u2014 put the medic down first'
             :'the nerve holds while that one is alive','#e8b04a'); }catch(_e){}
  } }
function tickTurnEnd(){ meleeTurnRun(); medicTurn();""",
        what='medicTurn')

    # ---- 4. AND HE IS IN THE ROOM, BUT NEVER AT A BLADE'S EXPENSE ----
    d = sub(d,
        "  while(out.length<N)out.push('human');                        /* THE REST */",
        """  /* ===== V173 RF4-38: THE MAN WHO KEEPS LEAVING, AFTER THE BLADES =====
     He fills before the plain goons and AFTER his 7/19 melee mix has taken its
     slots. The first cut put him in beside the machine, ahead of the blades, and
     it broke a RULING: at PACK the recipe wants floor(N/2) blades and the medic
     was eating one, so PACK stopped meaning more knives -- measured, PACK and
     the default both came out with two at six. A GATE MUST NEVER OUTRANK A
     RULING and neither may a new archetype: his mix takes what it wants first,
     and this body takes what is left. */
  if(N>=4&&out.length<N)out.push('medic');
  while(out.length<N)out.push('human');                        /* THE REST */""",
        what='roster')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v173: the man who keeps leaving -- %d chars' % len(d))


if __name__ == '__main__':
    main()
