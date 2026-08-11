#!/usr/bin/env python3
"""V134 THE FIGHT IS WARM, AND IT CANNOT WEAR THE WRONG CLOTHES.

Paolo 8/8: "re-land the handoff warming without the stale-clothing bug (first
fight can't stall)"

--------------------------------------------------------------------------
WHY IT WAS KILLED, AND WHY THAT WAS THE RIGHT CALL AT THE TIME
--------------------------------------------------------------------------
7/26, in the file's own words:
    "WARM THE FIGHT: REVERTED 7/26 (Paolo: the fight showed the wrong character
     with no clothing). Pre-building the combat frame at app open also pre-BAKES
     the player's sprites, so any part of his look that restores late would get
     baked stale and the fight would wear it."
That is one cause producing two effects, and the revert killed BOTH because at
the time they were welded together. The cost of that is what he is naming now:
the first fight builds a ~1 MB iframe AND bakes every player direction AND every
enemy AND the portraits, at the exact moment he wants to be fighting. It stalls.

--------------------------------------------------------------------------
THE TWO THINGS WERE NEVER ACTUALLY ONE THING
--------------------------------------------------------------------------
WARMING is building the iframe -- parse the document, boot the demo, get it
listening. Expensive, and it has NOTHING to do with his clothes.
BAKING is rendering his look into sprites. Cheap to redo, and it is the only
half that can ever go stale.
So warming is safe if and only if EVERY DOOR INTO A FIGHT re-checks the look
before the fight starts.

AND ONE OF THOSE DOORS ALREADY DID. Clicking the COMBAT tab has re-validated
since 7/20:
    if(tb.dataset.p==='combat'){ const look=lookKey();
      if(G._sentLook!==look){ ...combatSendSprites()... } }
lookKey() is a full fingerprint -- equipped, tints, skin tint, the face spec,
the face offsets, skin tone and eye colour -- so it catches a late restore of
any part of him.

*** THE HOLE IS THE HANDOFF, WHICH IS THE DOOR HE IS ASKING ABOUT. ***
startEncounter() drops a quest straight into combat WITHOUT a tab click, so it
never ran that check. That path could serve a stale look TODAY, warming or no
warming -- the 7/26 revert never fixed it, it just made it rare by ensuring the
first bake happened late. So this patch is not only re-landing a feature, it is
closing a bug that has been live the whole time and would have bitten harder the
moment quests started handing fights over.

--------------------------------------------------------------------------
WHAT SHIPS
--------------------------------------------------------------------------
1. WARM ON IDLE, AFTER THE APP OPENS. requestIdleCallback so it never competes
   with the first paint, and only once. It builds the frame; if the browser has
   no idle callback it falls back to a timeout.
2. THE HANDOFF RE-CHECKS THE LOOK, exactly like the tab does. One guard, at the
   top of startEncounter, so no fight can begin on a stale bake regardless of
   which door it came through.
3. A LOOK CHANGE WHILE WARM IS NOT LEFT TO ROT: the guard compares and rebakes
   rather than assuming the warm bake is current.

WHY THIS CANNOT REPRODUCE THE 7/26 BUG: the bug was "the bake that happens at
warm time is the one the fight uses". After this, the bake that happens at warm
time is only ever a HEAD START -- every entry compares lookKey() against what
was actually sent and rebakes on any difference. The stale bake is unreachable.

REUSE CHECK: cooks NO graphic pixels. It reuses lookKey(), G._sentLook,
combatSendSprites() and ensureCombatFrame(), all of which already exist, and
adds no new baking machinery. No bank is opened because no art is authored.

TASTE CHECK: authors no art. The taste question is his: "first fight can't
stall". A game that hitches on the first punch reads as broken no matter how
good the punch is. This spends idle time -- time that is free by definition --
so the cost lands where he is not looking instead of where he is.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region. It changes WHEN the existing bake runs, never
  what it produces.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V134 WARM, AND IT CANNOT WEAR THE WRONG CLOTHES'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    if MARK in html:
        print('v134 already in; nothing to do')
        return

    # ---- 1. THE HANDOFF DOOR GETS THE SAME CHECK THE TAB HAS -----------
    old = """function startEncounter(spec){
  spec=spec||{};"""
    new = """function startEncounter(spec){
  spec=spec||{};
  /* ===== V134 WARM, AND IT CANNOT WEAR THE WRONG CLOTHES ==========
     THE HANDOFF WAS THE HOLE. Clicking the COMBAT tab has re-validated the look
     since 7/20, but startEncounter drops a quest straight into a fight with no
     tab click, so it never ran that check -- meaning this path could serve a
     stale look TODAY, warming or not. The 7/26 revert never closed it; it only
     made it rare by forcing the first bake to happen late.
     lookKey() fingerprints equipped, tints, skin tint, the face spec, the face
     offsets, skin tone and eye colour, so this catches a late restore of any
     part of him. */
  try{ const _lk=lookKey();
    if(G._sentLook!==_lk&&document.getElementById('combatFrame')){
      if(combatSendSprites())G._sentLook=_lk; } }catch(_e){}"""
    html = subN(html, old, new)

    # ---- 2. WARM ON IDLE ------------------------------------------------
    old = """/* WARM THE FIGHT: REVERTED 7/26 (Paolo: the fight showed the wrong character
   with no clothing). Pre-building the combat frame at app open also pre-BAKES
   the player's sprites, so any part of his look that restores late would get
   baked stale and the fight would wear it. The frame is built on demand, the
   way it always was; the cold boot is 14ms since the font fix anyway. */
"""
    new = """/* ===== V134 WARM THE FIGHT, RE-LANDED SAFELY =====================
   Paolo 8/8: "re-land the handoff warming without the stale-clothing bug (first
   fight can't stall)."
   THE 7/26 REVERT KILLED TWO THINGS BECAUSE THEY WERE WELDED TOGETHER:
     WARMING = building the iframe. Expensive, and nothing to do with clothes.
     BAKING  = rendering his look into sprites. Cheap to redo, and the ONLY half
               that can ever go stale.
   Warming is safe if and only if every door into a fight re-checks the look.
   The COMBAT tab already did. The HANDOFF did not -- that guard is added in
   startEncounter above, which also closes a bug that has been live all along.
   So the warm bake is now only ever a HEAD START: every entry compares
   lookKey() against what was actually sent and rebakes on any difference, which
   makes the stale bake unreachable rather than unlikely.
   ON IDLE, so it never competes with the first paint, and once only. */
(function warmTheFight(){
  let done=false;
  const warm=()=>{ if(done)return; done=true;
    try{ if(!document.getElementById('combatFrame'))ensureCombatFrame(); }catch(_e){} };
  const kick=()=>{ if(typeof requestIdleCallback==='function')requestIdleCallback(warm,{timeout:4000});
                   else setTimeout(warm,1500); };
  try{ const f=document.getElementById('front');
    if(f)f.addEventListener('click',()=>setTimeout(kick,600),{once:true});
    else kick(); }catch(_e){ kick(); }
})();
"""
    html = subN(html, old, new)

    ALPHA.write_text(html)
    print('v134: the fight warms on idle, and every door re-checks the look')


if __name__ == '__main__':
    main()
