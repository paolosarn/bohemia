#!/usr/bin/env python3
"""V168 THE SPOTTER: the man worth crossing the room for. RF4-37, the other half.

RF4-37 is the row the whole document calls the core puzzle, and its diff column
named exactly one missing thing:

  "PRIORITY TARGETS ARE THE CORE PUZZLE. There is almost always a highest
   priority target -- dangerous, or a support type that buffs or heals. Intended
   play: rather than simply blasting away at whichever enemy is closest the
   player often needs to plan a few turns ahead, IGNORE THE NEAREST ENEMIES and
   somehow maneuver himself into position to kill the Priority-Target WHO IS
   OFTEN HIDING IN THE BACK."
  PARTIAL. threatRank / threatWeight mean priority is COMPUTABLE, so the
  information exists. WHAT IS MISSING IS A TARGET WORTH CROSSING THE ROOM FOR.

V167 built the precondition yesterday: every fight now has exactly one sniper and
he is placed on the back slot. That only guarantees somebody IS the priority
target. It does nothing to make him worth the trip, and a priority target who is
merely the highest-damage body is not a puzzle -- he is just the guy you shoot
first if he is convenient.

--------------------------------------------------------------------------
WHAT MAKES RF4's PRIORITY TARGETS WORTH CROSSING FOR: THEY COMPOUND
--------------------------------------------------------------------------
Every one of the examples in that row is a SUPPORT: a shaman placing totems, a
summoner calling allies, a healer healing. None of them is dangerous by damage.
They are worth crossing the room for because IGNORING THEM MAKES THE FIGHT WORSE
OVER TIME. That is the shape, and the shape is what transfers -- not the fantasy
class list, which we do not have and are not importing.

So: what compounds in a game of guns? V165 answered it two days ago without
meaning to. THE SHOUT. A man who can see you tells everyone in earshot where you
are, and they act on it without eyes of their own. That is already the one system
where an enemy's value is not his gun.

--------------------------------------------------------------------------
AND THE REAL VERSION OF THAT MAN EXISTS AND IS EXACTLY THIS GUY
--------------------------------------------------------------------------
RESEARCHED, because I was about to invent a role and the role is real. A sniper
on a fixed OVERWATCH position "carries out surveillance of an objective,
providing the team leader with REAL-TIME INTELLIGENCE", and such a team "can be
highly effective WITHOUT EVER FIRING A SHOT". The other half of the pair, the
spotter, exists to "locate, identify, PRIORITIZE and range targets". And a
designated marksman's stated squad function is to "provide OVERWATCH and covering
fire", which is what lets everybody else move.

The man at the back with the optic is not primarily a damage dealer. HIS JOB IS
SEEING AND TELLING. We had already put him at the back, given him the best
accuracy on the board and the longest reach, and then never given him the one job
his whole archetype exists to do.

--------------------------------------------------------------------------
THE FIRST VERSION WAS DECORATION AND THE MEASUREMENT SAID SO
--------------------------------------------------------------------------
The obvious build was to give his SHOUT infinite reach: while the man on the hill
sees you, he tells the whole board, so breaking line of sight from anyone else
buys nothing. It reads beautifully. MEASURED OVER 30 ARENAS, TWELVE TURNS OF
WALKING EACH, IT DID ALMOST NOTHING:

    spotter ALIVE   22.5% of turns with the whole board blind
    spotter DEAD    25.0%
    flag OFF        20.8%   <- what he already was

Noise. And the reason is arithmetic I should have seen first: a long shout only
matters when the spotter is THE ONLY MAN who can see you, and in a group of three
to six standing within eight tiles of each other, somebody else almost always
can. Killing him changed nothing because he was never the load-bearing pair of
eyes.

A DEAD DIAL IS WORSE THAN NO DIAL, so it is cut rather than shipped as flavour.

--------------------------------------------------------------------------
WHAT SHIPPED INSTEAD: HE DENIES YOU THE THING THE FIGHT IS ABOUT
--------------------------------------------------------------------------
Go back to the research, because it says what the man is actually FOR: a
designated marksman "provides OVERWATCH and covering fire" and by doing so
"FACILITATES SAFE MOVEMENT" for everyone else. Read that from the other side and
it is the whole feature. THE MARKSMAN'S JOB IS TO DENY THE ENEMY MOVEMENT. He
does not kill you; he makes it impossible for you to go anywhere.

And movement is exactly what this fight is about now. V159 made REACHING THE WAY
OUT the win condition. V163 made a step cost your turn and the sprint the one
exception that does not. So:

*** WHILE THE SPOTTER HAS A LINE ON YOU, YOU CANNOT SPRINT. ***

You can still walk -- one tile, and it ends your turn like it always did. What is
gone is the free move, which is the only thing that lets you cover ground while
still fighting. Every turn he lives is ground you do not make toward the exit.
That is TURN DENIAL, it is the marksman's real function, and it attacks the win
condition rather than your health bar.

AND THERE ARE TWO ANSWERS, which is what makes it a puzzle rather than a chore.
Put him down, OR break HIS line -- seesMe already requires a clear line, so
stepping behind stone switches the pin off while he stands there alive and
unharmed. The second answer is cheaper, temporary, and available to a player who
cannot reach him yet. It also teaches the durable thing: COVER GIVES YOU YOUR
LEGS BACK.

NO DAMAGE NUMBER IS TOUCHED. His hp, acc and dmg are exactly what they were, and
the whole feature is one boolean and one guard, which is the spec's own thesis:
almost every system exists to make GEOMETRY more powerful than STATISTICS.

--------------------------------------------------------------------------
AND HE HAS TO BE ABLE TO TELL, OR IT IS A GUESS AND NOT A PUZZLE
--------------------------------------------------------------------------
A priority target you cannot identify is not a decision. Nothing new is DRAWN --
V164's restraint stands, the game does not grow a tutorial arrow -- but the
readout he already reads now says WHY he cannot shake them:

    PINNED BY THE SPOTTER -- break his line or put him down

That is the instruction, in the place he is already looking, only when it is
true. Tapping a body has always named it (TARGET: SNIPER), so the two halves
meet: the line tells him a spotter exists, the board tells him which one.

REUSE CHECK: cooks NO graphic pixels and draws nothing new. Built entirely on
V165's seesMe (which already requires a clear line, so "break his line" needs no
second geometry test) and on V167's guarantee that a sniper is present and on the
back slot. The archetype table gains one boolean beside `ortho`. No new art, no
new UI element, no bank opened.

TASTE CHECK: authors no art. The restraint is that the answer is never spelled
out beyond the one line, and that the SECOND answer -- breaking his line instead
of killing him -- is never mentioned at all. He will find it the first time he
puts a truck between himself and the hill and the shouting stops.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V168 THE SPOTTER'
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
        print('v168 already in; nothing to do')
        return

    # ---- 1. the role, declared beside every other identity ------------
    old = """  sniper:{n:'SNIPER',hp:45, acc:0.72, dmg:[32,48], bot:false, melee:false},"""
    new = """  /* ===== V168 THE SPOTTER (RF4-37, the other half) ============
     His job was never the gun. A sniper on a fixed OVERWATCH position exists to
     carry out surveillance and hand the team real-time intelligence, and such a
     team "can be highly effective WITHOUT EVER FIRING A SHOT"; the spotter half
     of the pair exists to locate, identify, PRIORITIZE and range targets. We had
     already put him at the back with the best accuracy on the board and then
     never given him the one job his whole archetype is for.
     DECLARED, NOT DERIVED, beside ortho and every other identity number. No hp,
     acc or dmg is touched -- the entire feature is this boolean and a radius. */
  sniper:{n:'SNIPER',hp:45, acc:0.72, dmg:[32,48], bot:false, melee:false, spotter:true},"""
    js = subN(js, old, new)

    # ---- 2. is the man on the hill looking at you right now ----------
    old = """function blindHunters(){ return (G.e||[]).filter(e=>e&&!e.dead&&!e.melee&&!seesMe(e)&&e.lkp).length; }"""
    new = """function blindHunters(){ return (G.e||[]).filter(e=>e&&!e.dead&&!e.melee&&!seesMe(e)&&e.lkp).length; }
/* is the man on the hill the reason you cannot shake them.
   NO `!e.dead` HERE ON PURPOSE. It was written that way first and a mutation
   that deleted it changed nothing, because seesMe ALREADY rejects the dead, the
   downed, the broken and the fleeing on its first line. A guard that cannot
   fail is not caution, it is a second opinion about a rule that already has one
   home -- and the day the two disagree, nobody will know which is the law.
   ONE DOOR: this asks seesMe and nothing else. */
function spotterOnMe(){ return (G.e||[]).some(e=>e&&e.E&&e.E.spotter&&seesMe(e)); }"""
    js = subN(js, old, new)

    # ---- 3. and the readout names the problem, only when it is true ----
    old = """  { const _eyes=G._eyesOn|0, _hunt=blindHunters();
    if(_eyes===0&&_hunt>0)setRead('THEY LOST YOU',_hunt+' walking to where you were','#8fe89a');
    else if(_hunt>0)setRead('PARTLY LOST',_eyes+' still on you, '+_hunt+' hunting','#e8d08a'); }"""
    new = """  { const _eyes=G._eyesOn|0, _hunt=blindHunters();
    /* V168: A PRIORITY TARGET YOU CANNOT IDENTIFY IS A GUESS, NOT A PUZZLE.
       Nothing new is DRAWN -- the game does not grow a tutorial arrow -- but the
       line he already reads says why cover stopped working, and it says it only
       when it is true. The second answer, breaking HIS line instead of killing
       him, is deliberately not mentioned; he will find it the first time he puts
       a truck between himself and the hill and the shouting stops. */
    if(spotterOnMe())setRead('THE SPOTTER HAS YOU','break his line or put him down','#e8593a');
    else if(_eyes===0&&_hunt>0)setRead('THEY LOST YOU',_hunt+' walking to where you were','#8fe89a');
    else if(_hunt>0)setRead('PARTLY LOST',_eyes+' still on you, '+_hunt+' hunting','#e8d08a'); }"""
    js = subN(js, old, new)

    # ---- 4. AND HE TAKES YOUR LEGS, which is what a marksman is for ---
    old = """  if(_sprinting&&(G.stam||0)<1){ setRead('NO STAMINA','sprint needs 1 pip','#8a7d66'); return; }"""
    new = """  /* ===== V168 THE SPOTTER TAKES YOUR LEGS =========================
     A designated marksman "provides OVERWATCH and covering fire" and by doing so
     "FACILITATES SAFE MOVEMENT" for his own side. Read that from the other side
     and it is this: THE MARKSMAN'S JOB IS TO DENY THE ENEMY MOVEMENT. He is not
     there to kill you, he is there to stop you going anywhere.
     And movement is what this fight is about. V159 made reaching the WAY OUT the
     win condition; V163 made a step cost your turn and the sprint the one
     exception that does not. So the free move is exactly the thing he takes.
     YOU CAN STILL WALK -- one tile, ending your turn, as always. What is gone is
     the ability to cover ground while still fighting, so every turn he lives is
     ground you do not make toward the door.
     TWO ANSWERS, AND THE SECOND IS NEVER SPELLED OUT: put him down, or break HIS
     line. seesMe already requires a clear line, so stepping behind stone lifts
     this while he stands there alive and unharmed -- which teaches the durable
     thing, that COVER GIVES YOU YOUR LEGS BACK. */
  if(_sprinting&&spotterOnMe()){ setRead('PINNED BY THE SPOTTER','break his line or put him down','#e8593a'); return; }
  if(_sprinting&&(G.stam||0)<1){ setRead('NO STAMINA','sprint needs 1 pip','#8a7d66'); return; }"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v168: the spotter -- %d chars' % len(js))


if __name__ == '__main__':
    main()
