#!/usr/bin/env python3
"""V123 THREE THINGS HE CAUGHT, AND TWO OF THEM ARE MINE FROM THIS WEEK.

Paolo 8/3: "I NEED YOU TO HAVE SPRINT OFF THE TOP MENU BC ITS IN THE GAMEPLAY UI
NOW. THE UI MENU SLIDER DOESNT WORK ON PC WHATS UP WITH THAT!!! I HAVE TO USE
LEFT AND RIGHT MOUSE BUTTON. BRO IF I HAVE CIVER TIO MY NORTH OF ME BUT THERES
NO ENEMIES TO THE NORTH OF ME BUT ENEMIES ARE TO THE SOUTH OF ME THE ACTION
BUTTON SHOULD NOT BE SAYING POP OUT WHATS WRONG WITH YOU"

--------------------------------------------------------------------------
1. SPRINT COMES OFF THE TOP MENU
--------------------------------------------------------------------------
He is right and this is a v122 miss. v122 removed DASH and VAULT because he
named them, and left SPRINT because he had not -- I wrote in the record that
removing it "would be me deciding something he did not". He has now decided.
RUN is the movement verb and it is on the ring with his thumb, so a second
movement toggle at the top of the screen is the exact clutter he asked to be
rid of.
The FUNCTION is not deleted (nothing dies without his word): G.sprintArm and
the sprint branch in doMove stay callable, exactly like doDash and doVault.

--------------------------------------------------------------------------
2. THE SLIDER DOES NOT WORK ON PC, AND THAT IS MY BUG FROM v119
--------------------------------------------------------------------------
v119 made the button row `flex-wrap:nowrap; overflow-x:auto` so thirteen verbs
would stop wrapping onto three rows and shoving the picture down a 430px phone.
Then it hid the scrollbar -- `scrollbar-width:none` plus a webkit rule -- so
the phone would not get a grey bar across the HUD.

ON A PHONE YOU SWIPE IT AND IT WORKS. ON A PC THERE IS NOTHING TO SWIPE WITH.
A mouse wheel scrolls VERTICALLY; a horizontal container ignores it. There is
no visible scrollbar because I removed it. So the only thing left that moves
the row is press-and-drag, which is literally what "I HAVE TO USE LEFT AND
RIGHT MOUSE BUTTON" describes -- he was drag-selecting the strip to shove it
along. I built a phone control and shipped it to a desktop.

THE FIX IS NOT A BETTER SLIDER. IT IS NO SLIDER. A PC has a wide window and
vertical room to spare; the whole reason for the sideways strip was a 430px
phone. On a non-touch machine the row goes back to WRAPPING, which is what it
did before v119 and what it should have kept doing there. G.isTouch already
exists (v53, from his own "detect when im on my computer vs phone") so the
detection is not invented here.
AND ON TOUCH IT ALSO GETS BETTER: a wheel/trackpad gesture now maps to
horizontal scroll, so a laptop with a touchscreen -- which reports as touch and
would still get the strip -- is not stuck either. Belt and braces, because the
thing that broke here was assuming one input model.

--------------------------------------------------------------------------
3. POP OUT WAS NEVER ASKING WHO IT WAS COVER FROM
--------------------------------------------------------------------------
This is the real one. The action button reads:

    const nearCov=playerNearCover();
    function playerNearCover(){ return (G.pillars||[]).some(P=>P.edist<1.8); }

IS THERE ANY STONE WITHIN 1.8 TILES OF ME, IN ANY DIRECTION, FULL STOP. It
never asks whether that stone is between you and a single living man. So cover
to your north with every gun to your south says POP OUT, exactly as he
describes, and it has been wrong that way since v52.

It is wrong twice over, because the file already knows the answer.
myCoverAgainst(ang,dist,lvl) is the real geometry test -- it is what the volley
uses, what the exposure floor uses, what the acquisition bead uses. The action
button was the one place still asking the cheap question.

NOW: POP OUT means you are behind something THAT SHIELDS YOU FROM SOMEBODY WHO
CAN SHOOT YOU. If the stone covers you from nobody alive, you are not popping
out of anything -- you are just standing in the open next to a rock, and the
button says ENGAGE, which is the truth.
Same door for both: dead, downed, broken and fleeing men do not count as
threats, because cover from a corpse is not cover.

REUSE CHECK: cooks NO graphic pixels. It deletes a button, flips two CSS
properties behind an existing device flag, and re-points one predicate at a
function that already exists. No bank is opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V123 COVER FROM WHOM'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in s:
        print('v123 already in; nothing to do')
        return

    # ---- 1. SPRINT OFF THE TOP MENU -------------------------------------
    old = """    <button id="sprintbtn" class="cbtn">SPRINT: OFF</button>   <!-- V44 -->
"""
    new = """    <!-- V123: SPRINT is OFF the top menu (Paolo 8/3: "I NEED YOU TO HAVE
         SPRINT OFF THE TOP MENU BC ITS IN THE GAMEPLAY UI NOW"). v122 took
         DASH and VAULT because he named them and left this one because he had
         not; he has now decided. RUN is the movement verb and it lives on the
         ring with his thumb, so a second movement toggle at the top of the
         screen is the clutter he asked to be rid of. The FUNCTION is not
         deleted -- G.sprintArm and the sprint branch in doMove stay callable,
         exactly like doDash and doVault. -->
"""
    s = subN(s, old, new)

    old = """D('sprintbtn').addEventListener('click',()=>{ G.sprintArm=!G.sprintArm;   /* V44 SPRINT */
  if(G.sprintArm)G.dashArm=false;   /* V67: never two armed moves */
  updMoveMode();
  setRead(G.sprintArm?'SPRINT ARMED':'SPRINT OFF',
    G.sprintArm?'next ring tap runs TWO tiles — 1 pip, your turn KEEPS going, and nobody shoots':'back to a normal one-tile step',
    G.sprintArm?'#e8593a':'#8a7d66'); });"""
    new = """/* V123: the button is gone from the menu, so the wire is null-safe. The VERB
   is untouched -- G.sprintArm and doMove's sprint branch still work, exactly
   like doDash and doVault after v122. Nothing dies without his word. */
{const _sp=D('sprintbtn'); if(_sp)_sp.addEventListener('click',()=>{ G.sprintArm=!G.sprintArm;   /* V44 SPRINT */
  if(G.sprintArm)G.dashArm=false;   /* V67: never two armed moves */
  updMoveMode();
  setRead(G.sprintArm?'SPRINT ARMED':'SPRINT OFF',
    G.sprintArm?'next ring tap runs TWO tiles — 1 pip, your turn KEEPS going, and nobody shoots':'back to a normal one-tile step',
    G.sprintArm?'#e8593a':'#8a7d66'); });}"""
    s = subN(s, old, new)
    # close the guard block: find the end of that listener
    old = """  const sb=D('sprintbtn'), db=D('dashbtn'), lbl=D('movemode');"""
    new = """  const sb=D('sprintbtn'), db=D('dashbtn'), lbl=D('movemode');   /* V123: sb/db are null now; every use below is already guarded */"""
    s = subN(s, old, new)

    # ---- 2. THE STRIP IS A PHONE CONTROL; A PC GETS ITS ROWS BACK -------
    old = """  #chud .crow{flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;
    scrollbar-width:none;-webkit-overflow-scrolling:touch;}
  #chud .crow::-webkit-scrollbar{display:none;}"""
    new = """  /* ===== V123 THE SLIDER WAS A PHONE CONTROL SHIPPED TO A DESKTOP =====
     Paolo: "THE UI MENU SLIDER DOESNT WORK ON PC WHATS UP WITH THAT!!! I HAVE
     TO USE LEFT AND RIGHT MOUSE BUTTON."
     v119 (mine) made this row nowrap + overflow-x:auto so thirteen verbs would
     stop wrapping onto three rows on a 430px phone, and then HID the scrollbar
     so the phone would not carry a grey bar across the HUD. On a phone you
     swipe it. ON A PC THERE IS NOTHING TO SWIPE WITH: a wheel scrolls
     vertically, a horizontal container ignores it, and I removed the only
     visible affordance. The single thing left that moves the strip is
     press-and-drag, which is exactly what he described -- he was drag-selecting
     the row to shove it along. I built a phone control and shipped it to a
     desktop.
     THE FIX IS NOT A BETTER SLIDER, IT IS NO SLIDER. A PC has a wide window
     and vertical room to spare; the strip only ever existed for a 430px
     phone. body.desk (set from G.isTouch, which is v53 and his own "detect
     when im on my computer vs phone") puts the row back to WRAPPING, which is
     what it did before v119 and what it should never have stopped doing
     there. */
  #chud .crow{flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;
    scrollbar-width:none;-webkit-overflow-scrolling:touch;}
  #chud .crow::-webkit-scrollbar{display:none;}
  body.desk #chud .crow{flex-wrap:wrap;overflow-x:visible;}
  body.desk #chud .crow>*{flex:0 0 auto;}"""
    s = subN(s, old, new)

    # the flag, and the wheel fallback for a touchscreen laptop
    old = """G.isTouch=((typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches)||('ontouchstart' in window)||((navigator.maxTouchPoints||0)>0));"""
    new = """G.isTouch=((typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches)||('ontouchstart' in window)||((navigator.maxTouchPoints||0)>0));
/* V123: the same flag that already frames the camera now decides whether the
   verb row is a sideways strip (phone) or plain rows (PC). And a wheel or
   trackpad gesture maps to horizontal scroll, so a TOUCHSCREEN LAPTOP -- which
   reports as touch and would still get the strip -- is not stuck either. The
   thing that broke here was assuming one input model, so this fixes both. */
try{
  if(!G.isTouch)document.body.classList.add('desk');
  document.querySelectorAll('#chud .crow').forEach(r=>{
    r.addEventListener('wheel',ev=>{
      if(r.scrollWidth<=r.clientWidth)return;              /* nothing to slide */
      const dx=Math.abs(ev.deltaX)>Math.abs(ev.deltaY)?ev.deltaX:ev.deltaY;
      if(!dx)return; r.scrollLeft+=dx; ev.preventDefault(); },{passive:false}); });
}catch(_e){}"""
    s = subN(s, old, new)

    # ---- 3. COVER FROM WHOM ---------------------------------------------
    old = """function playerNearCover(){ return (G.pillars||[]).some(P=>P.edist<1.8); }   /* V23: your crouch needs stone too */"""
    new = """function playerNearCover(){ return (G.pillars||[]).some(P=>P.edist<1.8); }   /* V23: your crouch needs stone too */
/* ===== V123 COVER FROM WHOM =======================================
   Paolo 8/3: "BRO IF I HAVE CIVER TIO MY NORTH OF ME BUT THERES NO ENEMIES TO
   THE NORTH OF ME BUT ENEMIES ARE TO THE SOUTH OF ME THE ACTION BUTTON SHOULD
   NOT BE SAYING POP OUT WHATS WRONG WITH YOU"
   HE IS EXACTLY RIGHT AND THE BUG IS ONE LINE ABOVE THIS ONE. playerNearCover
   asks IS THERE ANY STONE WITHIN 1.8 TILES OF ME, IN ANY DIRECTION, FULL STOP.
   It has never once asked whether that stone is between you and a living man,
   so cover to your north with every gun to your south says POP OUT. Wrong
   since v52.
   AND IT IS WRONG TWICE OVER, BECAUSE THE FILE ALREADY KNOWS THE ANSWER.
   myCoverAgainst is the real geometry test -- the volley uses it, the exposure
   floor uses it, the acquisition bead uses it. The action button was the one
   place left asking the cheap question.
   POP OUT NOW MEANS: you are behind something that shields you FROM SOMEBODY
   WHO CAN SHOOT YOU. If the stone covers you from nobody alive you are not
   popping out of anything, you are standing in the open next to a rock, and
   ENGAGE is the truth. Dead, downed, broken and fleeing men are not threats,
   because cover from a corpse is not cover. */
function coveredFromAnyone(){
  return (G.e||[]).some(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing
    && myCoverAgainst(e.ea,e.edist,e.lvl)); }"""
    s = subN(s, old, new)

    old = """    const nearCov=playerNearCover();   /* V52: no pillar near you at all -> nothing to "pop out" of, say so honestly */"""
    new = """    const nearCov=coveredFromAnyone();   /* V52 asked "is any stone near me". V123: it asks WHO IT IS COVER FROM, because cover facing away from every gun is not cover. */"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v123: sprint off the menu, the PC gets its rows back, POP OUT knows who (%d chars)' % len(s))


if __name__ == '__main__':
    main()
