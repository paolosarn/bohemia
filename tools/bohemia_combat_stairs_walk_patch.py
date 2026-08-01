#!/usr/bin/env python3
"""V106 THE STAIRS ARE A THING YOU WALK ON.

Paolo 7/31: "I literally approached the stairs then I walk on the stairs and
then it says I'm behind the stairs. It's very confusing and ugly. What's up
with that so basically I can't even walk up the stairs if I wanted to I'm so
confused."

HE IS DESCRIBING TWO SEPARATE BUGS AND BOTH ARE MINE.

BUG 1 -- THE STAIR TILE IS PART OF THE DECK, SO STANDING ON IT MADE YOU
"UNDER THE DECK". The stair is generated as a deck tile with .stair=true and
pushed into G.deck. underDeckMe() is `myLvl()===0 && deckTileAt(0,0)`, and
deckTileAt does not care whether the tile is a slab or the way up. So the
instant he walked onto the foot of the stairs the v93 x-ray fired and drew him
as a cold blue ghost -- the game telling him, in its own vocabulary, that he
was UNDERNEATH the thing he had just climbed onto. That is exactly "it says
I'm behind the stairs", and it is ugly because the x-ray is meant to be a
warning, not a greeting.
A STAIRCASE IS THE ONE PIECE OF A DECK THAT IS NOT A CEILING. Fixed at the
predicate, not at the call site: deckSlabAt() is "a deck tile you can be
underneath", and it excludes the stair. Every x-ray read (mine and theirs)
moves onto it. deckTileAt keeps the full footprint, because the boards, the
legs, the kick rail and the shadow all still need the whole slab.

BUG 2 -- THERE WAS NO WAY TO WALK UP THEM. The only way up was the STAIRS
button (v90B/v91). We drew a beautiful five-tread run coming down toward the
camera (v92), put a pulsing chevron over it (v91), and then made walking onto
it do nothing at all. He walked up to a staircase and it behaved like paint.
"basically I can't even walk up the stairs if I wanted to" is a literally
correct description of the code.
NOW THE STEPS ARE THE VERB:
  * on the lot, a step that lands on the stair tile CLIMBS -- 1 stamina, no
    turn, the same price the button charges, because it is the same act.
  * at the top, a step off the stair tile onto the lot DESCENDS.
  * off any OTHER deck tile, a step into thin air is BLOCKED and says so.
    Before this you could walk clean off the edge and keep standing at deck
    height over nothing, which nobody ever noticed because nobody could get
    up there without the button.
The button stays. It is the finder ("STAIRS 6 SW") and it is the phone-proof
channel; it is no longer the only door.

REUSE CHECK: this patch cooks NO graphic pixels. It changes a predicate and a
movement branch. The staircase art is the existing v92 run, the deck art is
the existing v105 scaffold, and no bank is opened because none is needed.
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V106 THE STAIRS ARE A THING YOU WALK ON'


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
        print('v106 already in; nothing to do')
        return

    # ---- 1. A STAIRCASE IS NOT A CEILING ------------------------------
    old = """function underDeck(o){ if(!o||(o.lvl|0)!==0)return false;
  return !!deckTileAt(Math.cos(o.ea)*o.edist,Math.sin(o.ea)*o.edist); }
function underDeckMe(){ return myLvl()===0 && !!deckTileAt(0,0); }"""
    new = """/* ===== V106 THE STAIRS ARE A THING YOU WALK ON =====================
   deckSlabAt is "a deck tile that can be over your head". The stair tile is
   a deck tile and it is NOT that: it is the way up, and standing on its foot
   means you are ON the steps, not under a floor. Splitting the predicate is
   the whole fix for "I walk on the stairs and then it says I'm behind the
   stairs" -- the x-ray was firing on the one tile it must never fire on.
   deckTileAt still answers for the full footprint, because the boards, the
   legs, the kick rail and the shadow are all drawn from the whole slab. */
function deckSlabAt(wx,wy){ return (G.deck||[]).find(T=>{ if(T.stair)return false;
  const q=pXY(T); return Math.abs(q[0]-wx)<0.6&&Math.abs(q[1]-wy)<0.6; }); }
function onStairNow(){ const S=(G.stairs||[])[0]; if(!S)return false;
  return Math.abs(Math.cos(S.ea)*S.edist)<0.6&&Math.abs(Math.sin(S.ea)*S.edist)<0.6; }
function stairStepAt(wx,wy){ const S=(G.stairs||[])[0]; if(!S)return false;
  return Math.abs(Math.cos(S.ea)*S.edist-wx)<0.6&&Math.abs(Math.sin(S.ea)*S.edist-wy)<0.6; }
function underDeck(o){ if(!o||(o.lvl|0)!==0)return false;
  return !!deckSlabAt(Math.cos(o.ea)*o.edist,Math.sin(o.ea)*o.edist); }
function underDeckMe(){ return myLvl()===0 && !!deckSlabAt(0,0); }"""
    s = subN(s, old, new)

    # ---- 2. THE STEPS ARE THE VERB ------------------------------------
    old2 = """    setRead('BLOCKED',_sprinting?'the sprint path is blocked':'a pillar is there','#8a7d66'); return; }   // OCCUPANCY: solid is solid (V44: sprint checks BOTH tiles in the path)"""
    new2 = old2 + """
  /* V106: WALKING ONTO THE RUN CLIMBS IT. Same price the button charges (1
     stamina, no turn) because it is the same act -- v90B already ruled that
     taking the high ground is the same class of move as closing distance.
     And at the top, walking off the steps takes you down them. */
  if(!roam){
    /* THE LANDING BELONGS TO BOTH FLOORS. Step onto it from the lot and you
       have climbed; step off it onto the lot and you have come down. One pip
       each way, symmetric, and the same price the button charges. */
    const _climb=(myLvl()!==DECK_LVL)&&stairStepAt(sx,sy);
    const _down =(myLvl()===DECK_LVL)&&onStairNow()&&!deckTileAt(sx,sy);
    if(_climb||_down){
      if(!spendStam(1)){ setRead('NO STAMINA','the stairs cost one pip','#8a7d66'); return; }
      worldShift(sx,sy); G.lvl=_climb?DECK_LVL:0;
      G._stepAt=performance.now(); G.moveArm=false; G.steady=0;
      try{updateGeomCover();}catch(_e){} try{updateStanceFacing();}catch(_e){}
      try{updMoveUI();}catch(_e){} try{updStairBtn();}catch(_e){} try{updShoveBtn();}catch(_e){}
      renderBoard(); updGap();
      setRead(_climb?'UP THE STAIRS':'DOWN THE STAIRS',
        _climb?'cover on the lot stops counting \\u2014 both ways':'the stone works again','#e8c88a');
      return; }
    /* THE EDGE. Before v106 you could walk clean off the deck and keep
       standing one storey up over nothing, because doMove had no idea levels
       existed. Nobody ever saw it because nobody could get up there without
       the button. A step off the boards that is not the staircase is refused. */
    if(myLvl()===DECK_LVL&&!deckTileAt(sx,sy)){
      setRead('THE EDGE','nothing under that step \\u2014 the stairs are the way down','#8a7d66'); return; } }"""
    s = subN(s, old2, new2)

    # ---- 3. the boards never thin for the staircase --------------------
    old3 = """      const thin=_below(T);"""
    new3 = """      const thin=!T.stair&&_below(T);   /* V106: the run is not a floor, so it never goes see-through */"""
    s = subN(s, old3, new3)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v106 stairs: walkable, and the run is no longer a ceiling (%d chars)' % len(s))


if __name__ == '__main__':
    main()
