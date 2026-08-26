#!/usr/bin/env python3
"""
V184 A PLATE IS A THING YOU CARRY -- his 8/26 correction to V182's armour.

  PAOLO, hours after V182 shipped: "I know in Rogue Fable four, the armor will
  regenerate after a couple of turns or whatever. But if I wanted this to be,
  like, FUN BUT REALISTIC, like, it'd probably have to be, like, ONCE A DAY or
  something. I don't know. YOU CAN ABSORB A FREE SHOT or something."

*** HE INVOKED REALISM FIRST ON HIS OWN, AND ON THE ONE NUMBER I TOOK STRAIGHT
FROM RF4. *** V182 shipped RF4-05's regen verbatim: 5 points back every 5 turns,
on the beat clock. That is correct for RF4 and wrong for Bohemia, because a
ceramic plate is not a shield spell. It stops a round by BREAKING. It does not
knit itself together while you walk to the next rock, and no amount of turns
passing puts it back -- somebody has to hand you another one.

REALISM FIRST (8/4) says the realistic option leads and wins by default, and that
the trade is HIS. He made it, unprompted, against a number I had imported without
questioning it. RF4 IS THE REFERENCE, NOT THE SPEC: "Rogue Fable 4 with 120 BPM
everything" is the brief, and where RF4's fiction and ours disagree, ours wins.

-------------------------------------------------------------------------
WHAT CHANGES
-------------------------------------------------------------------------
"YOU CAN ABSORB A FREE SHOT" is the mechanic, in his words, and it is BETTER than
the pool V182 had:

  BEFORE   a 20 point pool that refilled 5 every 5 turns. A hit of any size was
           eaten whole while a point stood, so the honest reading was "you have
           about four free hits a fight, forever". A sponge on a timer.
  NOW      A PLATE IS ONE OBJECT. It eats ONE hit, entirely, however big, and
           then it is gone. No regen, in a fight or between them. You start with
           one and you find more ON BODIES.

That is more realistic AND it is more RF4-tactical at the same time, which is the
trade he was reaching for. The pool made armour a passive buffer you never thought
about. A single plate is A DECISION EVERY TURN: it is going to eat the next thing
that touches you, so the question becomes WHICH hit you spend it on -- step into
the open now while you still have it, or hold it for the push. That is the
"abilities read the room" shape RF4-18 is about, arriving through the armour.

-------------------------------------------------------------------------
AND IT MAKES HIS OWN LOOT RULING MATTER MECHANICALLY
-------------------------------------------------------------------------
He ruled on 8/25: "YOU GET EXPERIENCE AND LOOT OFF THEIR BODIES." V181 built it
and the loot was FLAVOUR -- a folded twenty, half a pack of smokes -- real words
he can edit, but nothing you would cross open ground for.

A PLATE IS SOMETHING YOU WOULD CROSS OPEN GROUND FOR. Plates now drop on bodies
alongside the rest, so the walk V181 built is worth taking, and the risk V180
measured (56% of open-ground turns have a gun on you) is being paid for something
real. Three of his rulings, from three different days, close into one loop.

"ONCE A DAY" IS NOT BUILT AND IS NOT REFUSED. He said "or something, I don't
know", which is uncertainty, not a ruling -- so the in-fight rule is decided here
and the day-cycle refill waits for the world clock to be wired to combat. A plate
you looted persists; nothing regenerates on its own.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy, hp or armour value moves.
This REMOVES a regen and changes a pool into a count.

REUSE CHECK: cooks no graphic pixels, opens no bank. It rides V181's existing
drop pile and sweep, and V182's existing hurtPlayer door.

TASTE CHECK: no new button, no menu. The readout says what it costs when it goes.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V184 A PLATE IS A THING YOU CARRY'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:160]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v184: already applied')
        return

    # ---- 1. A PLATE IS ONE OBJECT, NOT A POOL ----
    d = sub(d,
        """const PP_MAX=20;      /* [DIAL] the shield above your hp */
const PP_REGEN=5;     /* [DIAL] RF4's number: 5 back every 5 turns, on the beat clock we already have */""",
        """/* ===== V184 A PLATE IS A THING YOU CARRY ===========================
   Paolo 8/26, hours after V182: "I know in Rogue Fable four, the armor will
   regenerate after a couple of turns or whatever. But if I wanted this to be FUN
   BUT REALISTIC... it'd probably have to be ONCE A DAY or something. YOU CAN
   ABSORB A FREE SHOT or something."
   HE INVOKED REALISM FIRST ON THE ONE NUMBER I TOOK STRAIGHT FROM RF4. V182
   shipped RF4-05's regen verbatim -- 5 back every 5 turns -- and that is right
   for RF4 and wrong for us: a ceramic plate is not a shield spell. IT STOPS A
   ROUND BY BREAKING. Nothing puts it back but another plate.
   RF4 IS THE REFERENCE, NOT THE SPEC. Where its fiction and ours disagree, ours
   wins, and he made that trade himself, unprompted.
   AND THE SINGLE PLATE IS THE MORE TACTICAL OBJECT ANYWAY. A 20-point pool on a
   timer is a passive buffer you never think about; ONE plate is a decision every
   turn, because it will eat the next thing that touches you and the question
   becomes WHICH hit you spend it on. */
const PP_MAX=3;       /* [DIAL] how many plates you can carry at once */
const PLATE_START=1;  /* [DIAL] what you walk in with */""",
        what='plate constants')

    # ---- 2. ONE PLATE EATS ONE HIT ----
    d = sub(d,
        """function ppAbsorb(dmg){
  if(dmg<=0)return 0;
  const have=G.pp||0;
  if(have<=0)return dmg;
  G.pp=Math.max(0,have-dmg);
  if(G.pp<=0)try{ setRead('PLATE GONE','the vest is done \\u2014 the next one is yours','#e8593a'); }catch(_e){}
  return 0; }                    /* UNBREACHABLE: nothing spills through in the same hit */""",
        """function ppAbsorb(dmg){
  if(dmg<=0)return 0;
  const have=G.pp||0;
  if(have<=0)return dmg;
  /* ONE PLATE, ONE HIT, HOWEVER BIG. "You can absorb a free shot" -- his words,
     and it keeps RF4-05's unbreachable clause (nothing spills through in the
     same hit) while throwing out the pool. A plate does not partly stop a
     bullet. */
  G.pp=have-1;
  try{ setRead(G.pp>0?'PLATE CRACKED':'PLATE GONE',
    G.pp>0?('that one is spent \\u2014 '+G.pp+' left')
          :'nothing between you and the next one \\u2014 find another on a body','#e8593a'); }catch(_e){}
  return 0; }""",
        what='one plate one hit')

    # ---- 3. NOTHING REGENERATES. THE CLOCK LETS GO OF IT. ----
    d = sub(d,
        """  /* V182: the plate mends on THE SAME CLOCK the legs do. "RF4 with 120 BPM
     everything" means the beat owns every clock in the fight, and there was
     already exactly one -- so this does not get a second, it reads the same tick.
     It sits OUTSIDE the block above on purpose: V163's gate slices that block out
     and RUNS it, so code in there referencing PP_MAX reds a claim about stamina. */
  if(((G.mTurn||0)%SP_TICK)===0){ const _wasPP=G.pp||0;
    G.pp=Math.min(PP_MAX,_wasPP+PP_REGEN);
    if(G.pp>_wasPP){ try{ updPP(); }catch(_e){}
      if(_wasPP<=0)try{ setRead('PLATE BACK','the vest has something in it again','#8fe89a'); }catch(_e){} } }""",
        """  /* V184: *** THE PLATE DOES NOT COME BACK. *** V182 mended it on the same beat
     clock the legs run on, straight out of RF4-05. He overruled that himself on
     realism: armour is not stamina. Your legs come back because you caught your
     breath; a plate comes back because SOMEBODY HANDED YOU ANOTHER ONE. So the
     clock keeps the legs and lets go of the vest, and the only source of a plate
     is a body -- which is what makes the walk V181 built worth taking. */""",
        what='no regen')

    # ---- 4. YOU START WITH ONE ----
    d = sub(d,
        "G.pp=PP_MAX; G.power=POWER_BASE;",
        "G.pp=PLATE_START; G.power=POWER_BASE;",
        what='reset')

    # ---- 5. AND YOU FIND THEM ON BODIES ----
    d = sub(d,
        "const LOOT_CHANCE=0.55;   /* [DIAL] not every man is carrying something */",
        """const LOOT_CHANCE=0.55;   /* [DIAL] not every man is carrying something */
const PLATE_CHANCE=0.22;  /* [DIAL] V184: and some of them are wearing a vest */""",
        what='plate chance')

    d = sub(d,
        """  const worth=Math.max(1,Math.round((e.max||60)*KILL_XP_PCT));
  const it=lootRoll();
  G.drops.push({ea:e.ea, edist:e.edist, lvl:(e.lvl|0), n:0,
                xp:worth, loot:(it?it.n:null), draft:!!(it&&it.draft),
                _at:performance.now()}); }""",
        """  const worth=Math.max(1,Math.round((e.max||60)*KILL_XP_PCT));
  const it=lootRoll();
  /* V184: A PLATE IS SOMETHING YOU WOULD CROSS OPEN GROUND FOR, which is what
     V181's loot was missing. Its items are real words he can edit, but nobody
     walks into a firing line for half a pack of smokes. This is the reward that
     makes the risk V180 measured -- 56% of open-ground turns with a gun on you
     -- worth taking. Three rulings from three days closing into one loop. */
  const plate=(Math.random()<PLATE_CHANCE);
  G.drops.push({ea:e.ea, edist:e.edist, lvl:(e.lvl|0), n:0,
                xp:worth, loot:(it?it.n:null), draft:!!(it&&it.draft),
                plate:plate,
                _at:performance.now()}); }""",
        what='plate on the body')

    d = sub(d,
        """      if(d.loot){ G.ledger=G.ledger||{}; (G.ledger.loot=G.ledger.loot||[]).push(d.loot);
                  G.rc=G.rc||{}; (G.rc.loot=G.rc.loot||[]).push(d.loot); tookLoot.push(d.loot); }""",
        """      if(d.loot){ G.ledger=G.ledger||{}; (G.ledger.loot=G.ledger.loot||[]).push(d.loot);
                  G.rc=G.rc||{}; (G.rc.loot=G.rc.loot||[]).push(d.loot); tookLoot.push(d.loot); }
      /* V184: off his chest and onto yours */
      if(d.plate && (G.pp||0)<PP_MAX){ G.pp=(G.pp||0)+1; gotPlate++; }""",
        what='take the plate')

    d = sub(d,
        "let got=0, rounds=0, keep=[], gotXP=0, tookLoot=[];",
        "let got=0, rounds=0, keep=[], gotXP=0, tookLoot=[], gotPlate=0;",
        what='sweep locals')

    d = sub(d,
        "    if(tookLoot.length)bits.push(tookLoot.join(', '));",
        """    if(gotPlate)bits.push(gotPlate>1?(gotPlate+' PLATES'):'A PLATE');
    if(tookLoot.length)bits.push(tookLoot.join(', '));""",
        what='readout')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v184: a plate is a thing you carry -- %d chars' % len(d))


if __name__ == '__main__':
    main()
