#!/usr/bin/env python3
"""
V220 -- THE WORKSHOP COMES OFF THE FIGHT  (COMBAT lane, VAMILY [eyes: dev strip])

EYES E26 round 7 walked THE DEPLOY CUT -- what he actually opens, not the committed
demo file -- reproduced it on two walks and photographed it
(records/eyes_e26_walk_deploy/04_04_cards.png):

    a real fight arrives at about 02:05, and ACROSS THE TOP OF IT, ABOVE THE HEALTH
    BAR: WAIT, SUPPRESS, HAND-PEEK: OFF, NEW ENCOUNTER, WAY OUT 14T -- and the gear's
    own chip pushed off the corner, reading as the fragment "TTINGS".

PAOLO 9/13: "this glitchy buggy AI experience where nothing's complete."
THE FIRST FIGHT IN THE GAME ARRIVES WITH THE TOOLS USED TO BUILD IT LEFT ON SCREEN.

*** MEASURED FIRST, IN A REAL FIGHT STARTED THE WAY HE STARTS ONE. *** Pressed on a
real encounter with the rule 14(h) test (the panel had to stay open and something the
fight owns had to move):

    WAIT            WORKS   readout "A FIGHT HAS STARTED" -> "STEADY +5%"
    SUPPRESS        WORKS   readout -> "PINNED 1"
    HAND-PEEK: OFF  WORKS   label flips to HAND-PEEK: ON
    NEW ENCOUNTER   WORKS   it restarts the fight, which is the developer action
    ARENA           WORKS   label STREET #72978 -> STREET #93429

SO THEY ARE NOT DEAD BUTTONS, AND THAT IS WORSE: they are LIVE DEVELOPER CONTROLS
over a stranger's fight. NEW ENCOUNTER really does throw away the fight he is in and
ARENA really does re-roll the ground under him. The row read four of five as doing
nothing; measured, every one of them acts.

*** AND I GOT THIS WRONG TWICE BEFORE THE MEASUREMENT WAS RIGHT, BOTH TIMES THE SAME
    WAY. *** My first probe reported WAGER, PATTERN, the kit row and STAIRS with a
bounding box of [0,0,0,0] and I wrote two confident sentences off it: that WAGER was
dead, and then that the strip was so overloaded it clipped its own controls off the
screen. BOTH ARE FALSE. The probe asked getComputedStyle(el).display, and a node
inside a display:none ANCESTOR keeps its own display value -- so "inside the closed
settings panel" and "clipped off the screen" read identically. Asked properly, with
offsetParent and getClientRects, on clean main, in a real fight:

    ON HIS SCREEN      WAIT, SUPPRESS, the kit row, SHOVE, HAND-PEEK, NEW ENCOUNTER, ARENA
    ALREADY NOT        the comment box, WAGER, PATTERN, the perk tree, STAIRS

WHICH IS EXACTLY WHAT EYES PHOTOGRAPHED. Their picture shows HAND-PEEK and NEW
ENCOUNTER and nothing else from the workshop. The photograph was right and my
instrument was wrong, twice, and the corrected list below is three controls and not
six.

AND THE STRIP IS A FIFTH OF HIS SCREEN: measured, #chud is 181 px of an 890 px
viewport, all of it above the board.

WHAT THIS DOES, AND IT IS THE MOVE HE HAS ALREADY MADE FIVE TIMES HIMSELF. The top
row's own comments are a history of him clearing it out: DASH and VAULT (V122, "I
never use them"), SPRINT (V123, "I NEED YOU TO HAVE SPRINT OFF THE TOP MENU BC ITS IN
THE GAMEPLAY UI NOW"), GRENADE (V124, "bro i needed you to get rid of the grenade
button too bro wtf"), the stamina pips (V129). Same complaint every time, and every
time THE FUNCTION WAS KEPT AND THE BUTTON MOVED. This is the sixth, and it is the
workshop's turn.

THE THREE WORKSHOP CONTROLS THAT ARE ON HIS SCREEN MOVE INTO THE WORKSHOP PANEL HE
ALREADY HAS: the gear, whose own heading is DEMO SETTINGS and which already holds
FOES, RESET FIGHT, THE OPEN BOOK, the tile dials and the boss list -- and which, it
turns out, already houses the comment box, WAGER and PATTERN. They are MOVED, not
rebuilt and not deleted:

    peekbtn       HAND-PEEK, a display preference
    newenc        NEW ENCOUNTER, the one whose own name says developer
    arenabtn      ARENA, re-roll the ground under him

WHAT STAYS ON THE STRIP IS THE GAME: WAIT, SUPPRESS, the kit charges, the perk tree,
SHOVE and STAIRS. Every one of those is a verb, and the two the row accused are
measured working.

*** MOVED, NOT REWIRED, WHICH IS THE WHOLE REASON THIS IS SAFE. *** appendChild moves
a live node and its listeners with it, so not one handler is re-bound, not one control
is duplicated, and there is no second copy to drift. Nothing is deleted either:
GRAVEYARD IS FINAL cuts both ways, and nothing dies without his word. Everything is
one tap behind the gear, on every surface, with no run-versus-bench flag to get wrong.

NO DAMAGE BEFORE THE DIAL: this moves DOM nodes. Not one number in a fight is touched.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_WORKSHOP_IS_BEHIND_THE_GEAR__'

OLD_GRP = """      <button id="reset2" class="cbtn">RESET FIGHT</button>
    </div>
  </div>
"""

NEW_GRP = """      <button id="reset2" class="cbtn">RESET FIGHT</button>
    </div>
  </div>

  <!-- V220 __THE_WORKSHOP_IS_BEHIND_THE_GEAR__ (COMBAT, [eyes: dev strip]).
       EYES E26 round 7 photographed the first fight of the game arriving with the
       tools used to build it across the top of it. This group is where they live
       now. It is filled at boot by MOVING the live nodes out of the fight's top
       row, so every listener comes with them and nothing is rebuilt. -->
  <div class="setgrp" id="workshopgrp"><span class="gl">THE WORKSHOP &mdash; the tools this was built with, not the game</span>
    <div class="controls" id="workshoprow"></div>
  </div>
"""

OLD_CALL = """D('newenc').addEventListener('click',()=>{ audio(); newEncounter(); });"""

NEW_CALL = """D('newenc').addEventListener('click',()=>{ audio(); newEncounter(); });
/* ===== V220 __THE_WORKSHOP_IS_BEHIND_THE_GEAR__ (COMBAT, [eyes: dev strip]) ======
   PAOLO 9/13: "this glitchy buggy AI experience where nothing's complete."
   EYES E26 round 7 walked the DEPLOY CUT, reproduced it twice and photographed it:
   the first fight of the game arrives with WAIT, SUPPRESS, HAND-PEEK: OFF and NEW
   ENCOUNTER across the top, above the health bar, and the gear's own chip pushed off
   the corner reading "TTINGS". Measured here: #chud is 181 px of an 890 px viewport.
   A FIFTH OF HIS SCREEN, above the board, before the fight starts.
   AND THEY ARE NOT DEAD BUTTONS, WHICH IS WORSE. Pressed in a real fight under the
   rule 14(h) test: WAIT works (readout goes to STEADY +5%), SUPPRESS works (PINNED
   1), HAND-PEEK works (the label flips), NEW ENCOUNTER works -- it THROWS AWAY THE
   FIGHT HE IS IN -- and ARENA works, re-rolling the ground under him. Every one acts.
   THE LIST IS THREE AND NOT SIX, AND GETTING THERE COST ME TWO WRONG ANSWERS. A probe
   reading getComputedStyle(el).display cannot tell "inside the closed settings panel"
   from "clipped off the screen", because a node under a display:none ancestor keeps
   its own display value. Asked with offsetParent on clean main: the comment box,
   WAGER, PATTERN, the perk tree and STAIRS were ALREADY not on his screen, and what
   was up there is WAIT, SUPPRESS, the kit row, SHOVE, HAND-PEEK, NEW ENCOUNTER and
   ARENA -- exactly what EYES photographed. The picture was right and my instrument
   was wrong.
   THIS IS THE SIXTH TIME THIS ROW HAS BEEN CLEARED AND THE OTHER FIVE WERE HIS:
   DASH and VAULT (V122, "I never use them"), SPRINT (V123, "I NEED YOU TO HAVE SPRINT
   OFF THE TOP MENU BC ITS IN THE GAMEPLAY UI NOW"), GRENADE (V124, "bro i needed you
   to get rid of the grenade button too bro wtf"), the stamina pips (V129). Every time
   the FUNCTION was kept and the BUTTON moved. Same here.
   MOVED, NOT REWIRED: appendChild moves a live node and its listeners with it, so no
   handler is re-bound, nothing is duplicated, there is no second copy to drift, and
   nothing is deleted -- it is all one tap behind the gear, whose own heading already
   says DEMO SETTINGS. What stays on the strip is the game: WAIT, SUPPRESS, the kit
   charges, the perk tree, SHOVE and STAIRS, every one of them a verb. */
const WORKSHOP_IDS=['peekbtn','newenc','arenabtn'];   /* the three that are actually on his screen, measured */
function workshopBehindTheGear(){
  const row=D('workshoprow'); if(!row)return 0;
  let moved=0;
  for(const id of WORKSHOP_IDS){
    const e=D(id); if(!e)continue;
    if(e.parentNode===row)continue;
    row.appendChild(e);          /* THE NODE ITSELF, so its listeners ride along */
    moved++;
  }
  return moved;
}
try{ window.__WORKSHOP_MOVED=workshopBehindTheGear(); }catch(_e){}
/* ===== /V220 __THE_WORKSHOP_IS_BEHIND_THE_GEAR__ ===== */"""



OLD_NAME = """  const roster=(spec.roster||[]).map((r,i)=>({eid:i,name:r.name||('hostile_'+i),hp:(r.hp!=null?r.hp:null),arch:r.arch||'human',dead:false}));   /* V203 __CONTACT_FIGHT__: no hp invented at the door -- the archetype's table owns it */"""

NEW_NAME = """  /* V220 __THE_WORKSHOP_IS_BEHIND_THE_GEAR__: *** AND THE LAST DEVELOPER STRING ON HIS
     SCREEN WAS THE MAN'S NAME. *** Photographed in a real fight after the strip was
     cleared, the one control left up there read "SHOVE hostile_0 (stun 1 - 30%)".
     hostile_0 is a variable name on a button a stranger presses.
     IT WAS INVENTED HERE AND NOWHERE ELSE. The door fabricated a name for every man
     the city sent, and applyRoster's own rule is `if(r.name)e.n=r.name` -- it only
     overrides when a name EXISTS. So the fallback was overwriting the archetype's own
     word (SHIV, MEDIC, SNIPER, BREACHER, SEC-BOT, which the bench has always shown)
     with an id. Removing it hands the display name back to the table that already has
     one. NOTHING IS INVENTED AND NOTHING IS RULED: who these people ARE is canon and
     still his, eid is untouched so identity does not move, and this deletes a made-up
     string rather than adding one. [draft:true on the words either way.] */
  const roster=(spec.roster||[]).map((r,i)=>({eid:i,name:r.name||null,hp:(r.hp!=null?r.hp:null),arch:r.arch||'human',dead:false}));   /* V203 __CONTACT_FIGHT__: no hp invented at the door -- the archetype's table owns it */"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES. V214 terminated a JS string and the
    fight stopped defining G; V217's first cut left a block comment open and the last
    script went silent. A guard that checks the text it wrote rather than whether the
    file still runs is not a guard."""
    import os
    import subprocess
    import tempfile
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def sub(s, old, new, what):
    n = s.count(old)
    if n != 1:
        sys.exit('ANCHOR %s: expected 1, found %d' % (what, n))
    return s.replace(old, new, 1)


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the workshop is already behind the gear')
        return
    blob = sub(blob, OLD_GRP, NEW_GRP, 'blob/the settings group')
    blob = sub(blob, OLD_CALL, NEW_CALL, 'blob/the boot call')
    # NOTHING IS DUPLICATED AND NOTHING IS DELETED. Every id that moves must still
    # exist EXACTLY ONCE in the markup -- a second copy is the drift this row is about,
    # and a missing one is a control killed without his word.
    for wid in ['peekbtn', 'newenc', 'arenabtn']:
        n = len(re.findall(r'id="%s"' % wid, blob))
        if n != 1:
            sys.exit('GUARD: id="%s" appears %d times; it must be moved, never copied '
                     'or removed' % (wid, n))
    if blob.count('id="workshoprow"') != 1:
        sys.exit('GUARD: the workshop row is not defined exactly once')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    # AND THE SHELL'S OWN FABRICATED NAME, which is the last developer string left on
    # his screen once the strip is cleared.
    alpha = sub(alpha, OLD_NAME, NEW_NAME, 'shell/the roster name')
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V220 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
