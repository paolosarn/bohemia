#!/usr/bin/env python3
"""
BOHEMIA -- YOU CAN SEE WHY SHE DID IT (9/6/26, UI lane 11)
VAMILY row [reactions explained] / BB-WHY.

THE ROW, IN ITS OWN WORDS: "THE PLAYER MUST BE ABLE TO SEE WHY HIS SIDE DID WHAT
IT DID. This is the documented failure mode that actually kills automated-ally
systems: not that the AI is bad, but that when the player cannot tell WHY it chose
what it chose, the whole system reads as broken instead of clever. With no manual
control there is no recourse mid-fight, so legibility is not polish here, it is the
safety rail. It is a LOOK problem: what does an intent look like on screen, and how
do you show one body's reason without a debug dump."

MEASURED BEFORE BUILDING. The companion is REAL and already decides well: ROSA runs
a fixed four-rung ladder in allyTurn() -- a blade on you first, then the man who
gave away your cover, then whoever is nearest to dropping, then one step onto the
safest ground. And she already SPEAKS: allySay() puts a line in the readout.

SO THE GAP IS NOT THAT SHE IS SILENT. IT IS THAT SHE SAYS WHAT, NEVER WHY, AND SHE
SAYS IT IN THE WRONG PLACE.
  - 'FIRING' is a description of a trigger pull. It contains no reason at all.
  - 'GOT THE BLADE' happens to imply one, by luck of phrasing, not by design.
  - every line carries the same fixed subtitle, "she is fighting her own turn",
    which is the same sentence whether she just saved you or wandered off.
  - and all of it lands in a text readout at the edge of the screen, while the
    thing it is about is a body in the middle of it. The row says this is a LOOK
    problem; a line of text somewhere else is not a look.

WHAT THIS PATCH DOES. Every rung of the ladder already HAS a reason -- the code is
built out of them -- so the reason is recorded where the decision is made, and then
DRAWN ON THE BODY IT IS ABOUT: a thin line from Rosa to the man she chose, and three
or four plain words sitting on him, for one beat, then gone.

  rung 1  a blade already on you        -> "KNIFE ON YOU"
  rung 2  the man who gave you away     -> "HE GAVE YOU AWAY"
  rung 3  the one nearest to dropping   -> "CLOSEST TO DROPPING"
  rung 4  nothing she can reach         -> "NOTHING IN RANGE"
          too far from you              -> "TOO FAR FROM YOU"

NOT A DEBUG DUMP, AND THAT IS THE HARD PART OF THE ROW. No numbers, no scores, no
list of what she considered and rejected. One line, one short reason, on one body,
for one beat. If she is out of reasons -- everything dead -- it draws nothing at
all, because a board that lights up every turn is furniture (this file's own words).

THE WORDS ARE ENGLISH ON PURPOSE. gates/language_gate.js: "LANGUAGE NEVER GATES
REQUIRED INFORMATION." Why your only ally did the thing she did is required
information. They are attempts, draft:true -- Paolo edits them live.

ON THE BEAT: the line and the words live exactly one beat and fade with it, so this
obeys the 120 BPM law like everything else on this screen.

    python3 tools/bohemia_combat_you_can_see_why_she_did_it_patch.py
"""
import base64, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ALPHA = ROOT / 'slices' / 'BOHEMIA_ALPHA_0_9.html'

html = ALPHA.read_text(encoding='utf-8')
m = re.search(r"(const COMBAT_B64\s*=\s*')([^']+)(')", html)
if not m:
    sys.exit('COMBAT_B64 not found')
src = base64.b64decode(m.group(2)).decode('utf-8')
before = src

def once(old, new, what):
    global src
    n = src.count(old)
    if n != 1:
        sys.exit('ANCHOR %s appears %d times, expected 1' % (what, n))
    src = src.replace(old, new)

# ---- 1. the reason is recorded WHERE THE DECISION IS MADE ---------------------
once(
"""function allySay(t){ const A=G.ally; if(!A)return;
  if(A.say===t)return; A.say=t; A.sayT=performance.now();""",
"""/* WHY, NOT JUST WHAT (9/6, [reactions explained] / BB-WHY). The reason is recorded
   at the rung that produced it, because that is the only place it is actually known.
   Reconstructing it later from the board state would be a second, guessing copy of
   the ladder -- and a guess that disagrees with the real one is worse than silence.
   Words are draft:true and English by rule: language never gates required
   information, and why your only ally did that is required information. */
function allyWhy(words, target){
  const A=G.ally; if(!A)return;
  A.why={ words:words, t:target||null, at:performance.now() };
  /* AND THE READOUT SAYS THE SAME THING THE BODY SAYS. It used to carry one fixed
     subtitle, "she is fighting her own turn", whether she had just taken a knife off
     you or wandered out of range. Two places explaining the same act must not give
     two different explanations. */
  try{ setRead(ALLY_NAME+': '+(A.say||'ACTING'), String(words).toLowerCase(), '#8fe89a'); }catch(_e){}
}
function allySay(t){ const A=G.ally; if(!A)return;
  if(A.say===t)return; A.say=t; A.sayT=performance.now();""",
'allySay')

once("""if(blade){ allySay('GOT THE BLADE'); allyShoot(blade); return; }""",
     """if(blade){ allySay('GOT THE BLADE'); allyWhy('KNIFE ON YOU', blade); allyShoot(blade); return; }""",
     'rung 1 blade')

once("""if(sp&&allyCanReach(sp)){ allySay('ON THE SPOTTER'); allyShoot(sp); return; }""",
     """if(sp&&allyCanReach(sp)){ allySay('ON THE SPOTTER'); allyWhy('HE GAVE YOU AWAY', sp); allyShoot(sp); return; }""",
     'rung 2 spotter')

once("""    allySay('FIRING'); allyShoot(t); return; }""",
     """    allySay('FIRING'); allyWhy('CLOSEST TO DROPPING', t); allyShoot(t); return; }""",
     'rung 3 weakest')

once("""    allySay(home?'COMING BACK':'MOVING UP'); } }""",
     """    allySay(home?'COMING BACK':'MOVING UP');
    allyWhy(home?'TOO FAR FROM YOU':'NOTHING IN RANGE', home?null:near); } }""",
     'rung 4 move')

# nothing left to explain when the room is clear
once("""  if(!live.length){ allySay('CLEAR'); return; }""",
     """  if(!live.length){ allySay('CLEAR'); const _A=G.ally; if(_A)_A.why=null; return; }""",
     'clear')

# ---- 2. DRAW IT ON THE BODY IT IS ABOUT ---------------------------------------
# G._field is written after every enemy position is known, which is the only point
# where the line has both ends.
once("""  G._field={cx,cy,ring,pos};""",
"""  G._field={cx,cy,ring,pos};
  /* ===== YOU CAN SEE WHY SHE DID IT (9/6, [reactions explained] / BB-WHY) ======
     Drawn here and nowhere earlier, because this is the first point in the frame
     where BOTH ends of the line exist: G._allyDraw is written by the ally block
     above, and pos[] is only complete now. Reading a position before it is written
     is how this file's own note says seven attempts were burned.
     ONE BEAT AND GONE. The reason is not a label that lives on a man; it is the
     answer to "why did she do that", and that question has a lifetime of about one
     beat. After that it is furniture, and this screen has been asked five times to
     have less of it. */
  (function(){
    const A=G.ally; if(!A||!allyOn()||A.dead||A.downed)return;
    const W=A.why; if(!W||!W.words)return;
    const AD=G._allyDraw; if(!AD)return;
    const life=(typeof BPM_MS==='number'&&BPM_MS>0)?BPM_MS:500;
    const age=nowMs-W.at; if(age<0||age>life)return;
    const fade=1-(age/life);
    /* the body it is about, if it is about one */
    let tx=null, ty=null;
    if(W.t){ try{ const q=epos(W.t); if(q&&isFinite(q[0])&&isFinite(q[1])){
      tx=q[0]; ty=q[1]; } }catch(_e){} }
    x.save();
    x.globalAlpha=fade;
    if(tx!==null){
      /* THE LINE IS THE SENTENCE. It says "her -> him" without a word, which is the
         half of the answer that words are worst at. Thin, her own green, under the
         text so it never cuts a letter. */
      x.strokeStyle='rgba(143,232,154,0.55)';
      x.lineWidth=1.5;
      x.setLineDash([5,4]);
      x.beginPath(); x.moveTo(AD.x, AD.top+6); x.lineTo(tx, ty-52*(AD.S||1)); x.stroke();
      x.setLineDash([]);
    }
    const px = (tx!==null)? tx : AD.x;
    const py = (tx!==null)? (ty-64*(AD.S||1)) : (AD.label-14);
    x.font='bold 10px Space Grotesk,sans-serif';
    x.textAlign='center'; x.textBaseline='middle';
    const w=x.measureText(W.words).width+10;
    x.fillStyle='rgba(12,16,12,0.82)';
    x.fillRect(px-w/2, py-8, w, 15);
    x.strokeStyle='rgba(143,232,154,0.45)'; x.lineWidth=1;
    x.strokeRect(px-w/2, py-8, w, 15);
    x.fillStyle='#8fe89a';
    x.fillText(W.words, px, py);
    x.textAlign='left'; x.textBaseline='alphabetic';
    x.restore();
    /* THE REAL SURFACE, WRITTEN DOWN, same pattern the ally block uses: a checker
       that recomputes this from a centre and a ratio it does not have is measuring
       its own arithmetic. */
    G._whyDraw={words:W.words, x:px, y:py, fade:fade,
                line:(tx!==null)?{x1:AD.x,y1:AD.top+6,x2:tx,y2:ty-52*(AD.S||1)}:null};
  })();""",
     'the draw')

if src == before:
    sys.exit('nothing changed')

html = html[:m.start(2)] + base64.b64encode(src.encode('utf-8')).decode('ascii') + html[m.end(2):]
ALPHA.write_text(html, encoding='utf-8')
print('patched COMBAT_B64: %d -> %d bytes of combat source' % (len(before), len(src)))
