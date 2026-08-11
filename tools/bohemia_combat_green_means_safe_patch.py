#!/usr/bin/env python3
"""V146 GREEN MEANS SAFE. IT HAS NEVER MEANT SAFE.

Paolo 8/12 [T22]: "I noticed that even when I popped out and it was green, I
still took damage, which is literally the opposite of popping out when it's
green, you're not supposed to take damage it's supposed to be a safe time so you
need to fix that."

--------------------------------------------------------------------------
HE IS RIGHT, AND THE GUARANTEE WAS HOLLOW BY CONSTRUCTION
--------------------------------------------------------------------------
V48 wrote the promise like this:

    if(G._poppedGreen)pool=pool.filter(e=>G._popKnownThreats.has(e.i));
    /* a green pop only answers to threats that were ALREADY visible */

So a green pop protects you from men who came up AFTER you committed. Now read
what GREEN actually means, from the button's own state machine:

    outN === 0            -> ENGAGE   (nobody out at all)   not green
    firingN >= 2          -> red
    firingN === 1 or crowd-> amber
    else                  -> GREEN    <- guns ARE up, none are FIRING yet

*** GREEN IS THE STATE WHERE PEEKERS EXIST AND NONE HAVE FIRED. *** Those
peekers are, by definition, "already visible when you committed" -- so the
filter keeps every single one of them, and they are the only men green ever has.
The protection removes nobody. It has never once stopped a bullet.

That is worse than no promise. The button paints itself GREEN, he reads it as
the safe moment he waited for, he pops, and he gets shot by the exact men the
colour was telling him about.

--------------------------------------------------------------------------
THE RULE, IN HIS WORDS: GREEN IS A SAFE TIME
--------------------------------------------------------------------------
A green pop takes NO return fire. Not filtered, not softened -- none. That is
what the colour has been promising him since V48 and it is the whole point of
reading the peek cycle: you wait for the lull, and the lull is worth waiting for.

AND GREEN CANNOT LIE ABOUT A BLADE. Return fire is what POPPING costs you --
blades swing whether you popped or not, so nulling the volley cannot honestly
cover them. Instead the button stops claiming a lull that is not one: if a blade
is within its own striking reach, the moment is not green, whatever the guns are
doing. A man with a knife on you is not a safe time, and now the colour says so
instead of the damage saying it afterwards.

WHY NOT JUST MAKE GREEN RARER: because the bug is not the frequency, it is that
the word means nothing. A rare lie is still a lie, and he has to be able to
trust one colour on one button.

REUSE CHECK: cooks NO graphic pixels. It reuses _poppedGreen, _popKnownThreats
and the existing melee reach data on the archetypes. No bank is opened because
nothing is authored.

TASTE CHECK: authors no art. The taste rule is trust: a UI that promises safety
and then takes health teaches the player to ignore the UI, and every other
signal in the fight gets quieter with it.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V146 GREEN MEANS SAFE'
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
        print('v146 already in; nothing to do')
        return

    # ---- 1. a green pop takes NO return fire ---------------------------
    old = """  if(G._poppedGreen)pool=pool.filter(e=>G._popKnownThreats&&G._popKnownThreats.has(e.i));   /* V48: a green pop only answers to threats that were ALREADY visible when you committed */"""
    new = """  /* ===== V146 GREEN MEANS SAFE ==================================
     Paolo 8/12: "even when I popped out and it was green, I still took damage,
     which is literally the opposite of popping out when it's green."
     HE IS RIGHT AND THE OLD GUARANTEE WAS HOLLOW BY CONSTRUCTION. V48 filtered
     the volley to threats that were ALREADY VISIBLE when he committed -- but
     GREEN is precisely the state where peekers exist and none have fired yet,
     so every man green ever has IS already visible. The filter removed nobody.
     It never once stopped a bullet, while the button painted itself green and
     told him this was the moment he had been waiting for.
     A GREEN POP TAKES NO RETURN FIRE. Not filtered, not softened. That is what
     the colour has promised since V48 and it is the entire reward for reading
     the peek cycle. */
  if(G._poppedGreen)pool=[];"""
    js = subN(js, old, new)

    # ---- 2. and green cannot lie about a blade -------------------------
    old = """    } else {                  // a clean lull, no guns up -> best moment to pop
      bg='radial-gradient(circle at 50% 40%,#1f8a40,#0c2e18 72%)'; glow='0 0 0 1px #46c466,0 0 26px 5px rgba(95,200,110,.65)'; col='#eafff0'; txt=nearCov?'POP OUT':'ENGAGE'; green=true;
    }"""
    new = """    } else {                  // a clean lull, no guns up -> best moment to pop
      /* V146: GREEN CANNOT LIE ABOUT A BLADE. Return fire is what POPPING costs
         you, so nulling the volley cannot honestly cover a man who swings
         whether you popped or not. Instead the button stops claiming a lull
         that is not one -- a knife inside its own reach is not a safe time, and
         the colour says so now instead of the damage saying it afterwards. */
      const _blade=(G.e||[]).some(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&e.melee
        &&(e.lvl|0)===myLvl()&&(e.edist||99)<=((e.reach||1.8)+1.0));
      if(_blade){ bg='radial-gradient(circle at 50% 40%,#9a6a1e,#2e1f0a 72%)'; glow='0 0 0 1px #d69a3a,0 0 24px 5px rgba(220,150,60,.55)'; col='#fff0d8'; txt=(nearCov?'POP OUT':'ENGAGE')+' \\u00b7 BLADE ON YOU'; }
      else { bg='radial-gradient(circle at 50% 40%,#1f8a40,#0c2e18 72%)'; glow='0 0 0 1px #46c466,0 0 26px 5px rgba(95,200,110,.65)'; col='#eafff0'; txt=nearCov?'POP OUT':'ENGAGE'; green=true; }
    }"""
    js = subN(js, old, new)

    # ---- 3. AND A BUG OF MINE FROM V141: STALE GREEN ---------------------
    # V141 added an OUT OF RANGE early return at the top of updGap and cleared
    # `G._green` -- A NAME THAT EXISTS NOWHERE ELSE IN THE FILE. The real flag is
    # G._greenNow, and doPop reads it to decide whether the safety promise
    # applies. So every OUT OF RANGE turn left the PREVIOUS turn's verdict
    # standing, and the lock could be granted or refused on a stale reading.
    # Found while hunting the green bug, not by the gate; a typo'd assignment is
    # invisible to a string check that never looks for the right name.
    old = """    G._green=false; try{updMoveUI();}catch(_e){}"""
    new = """    G._greenNow=false; try{updMoveUI();}catch(_e){}   /* V146: V141 cleared `G._green`, a name that exists nowhere else, so every OUT OF RANGE turn left the PREVIOUS verdict standing and the lock could be granted on stale data */"""
    js = subN(js, old, new)

    # ---- 4. THE TEN DAMAGE FACES WERE DECODED AND THROWN AWAY ------------
    # Paolo, same message: "when my health was getting reduced, my character's
    # face didn't look like it was taking damage the way it was supposed to."
    # HE IS RIGHT AND IT IS THE inMyRange BUG AGAIN, IN THE ART PIPE. The alpha
    # builds ten damage frames and sends them. The receiver decodes them into
    # SPR._dmgRaw. *** _dmgRaw IS ASSIGNED ONCE AND READ NOWHERE. *** The
    # consumer reads SPR.portraits.dmg, which nothing ever fills, so every frame
    # arrives, is decoded, and is dropped on the floor.
    # A thing built, sent, decoded, and never connected -- twice this week.
    old = """      try{ SPR._dmgRaw=d.portraits.dmg.map(fr=>mkAt(fr,64,64)); }catch(_e){ SPR._dmgRaw=null; } }"""
    new = """      /* V146: this used to land in SPR._dmgRaw, WHICH IS READ NOWHERE. The
         consumer reads SPR.portraits.dmg, so ten decoded damage faces were
         dropped on the floor on every handoff and his face never changed. */
      try{ SPR.portraits=SPR.portraits||{}; SPR.portraits.dmg=d.portraits.dmg.map(fr=>mkAt(fr,64,64)); SPR._dmgRaw=SPR.portraits.dmg; }
      catch(_e){ SPR._dmgRaw=null; if(SPR.portraits)SPR.portraits.dmg=null; } }"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v146: green means safe -- %d chars' % len(js))


if __name__ == '__main__':
    main()
