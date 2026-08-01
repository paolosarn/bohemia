#!/usr/bin/env python3
"""V110 EXPOSURE HAS A PRICE, AND THE WORLD STEPS BACK FOR A KILL.

Paolo's T9 list, worked item by item. Two of these are things I shipped and
he is rejecting; those get pulled, not re-argued.

--------------------------------------------------------------------------
1. "IT SHOULD BE REALLY HARD TO GET THAT GREEN"
--------------------------------------------------------------------------
"if I'm currently not don't have cover and I'm fully exposed... as long as I
press the green action button when people are popping in and out I don't know
it's a little strange I feel like it should be more punishing... if there's
three or four enemies with cover like I'm fully exposed no cover like it
should be really hard to get that green like really hot depending on how many
enemies obviously it slides with how many enemies have cover trying to shoot
at you"

He is right and the hole is embarrassing: standing in the open against four
covered guns pulled the SAME dial as standing behind a wall against one. The
dial already had a floor mechanism (v95's chain ramp) and nothing was using
it for the most basic tactical fact in the game.

PRESSURE IS A FLOOR, exactly like the chain ramp, so point blank still eases
the dial as he ruled on 7/27 but can never fully cancel the cost of standing
in the open. It counts only guns that are BEHIND COVER, have a line on you,
and that you have NO cover from -- the precise situation he described.
  1 gun    no floor      it is a duel, the dial is the dial
  2 guns   HARD floor
  3 guns   V.HARD floor
  4+ guns  BOHEMIAN floor
The numbers are DIALS.

--------------------------------------------------------------------------
2. "AND THAT THIRD SHOT... STRAIGHT UP BOHEMIAN"
--------------------------------------------------------------------------
"if the default of the killshot that you normally have available is two, then
that third shot, I want it to be a Bohemian difficulty pattern not even very
hard just straight up Bohemian difficulty pattern"

chainRampDial() ramped CHAIN_RAMP_BASE + (over-1)*STEP. His ruling deletes
the ramp: past the allowance is BOHEMIAN, flat, from the first extra shot.

--------------------------------------------------------------------------
3. THE ORANGE, SEVENTH REPORT -- AND THIS TIME IT IS NOT THE DIAL
--------------------------------------------------------------------------
Instrumented again. What is warm on screen during a kill now:
    232x  stroke rgba(232,214,172,0.92)  drawField   the deck KICK RAIL
     29x  fillRect rgba(232,214,172,0.95) drawField  the STAIR TREAD lips
    145x  stroke rgba(186,170,132,0.5)    draw       the dial's tick marks
The ghost fans v107 killed are gone and stayed gone. What is lighting up the
kill now is THE TWO-STOREY -- the brightest warm object in the game.

AND THE CAUSE IS DRAW ORDER, NOT COLOUR. The killshot already dims the world
(the v94 _mk pass), but it fires inside the FLOOR block -- and the deck, the
stairs and the cars all draw AFTER it, at full brightness, straight over the
top. So the one thing the dim exists to push back was the one thing exempt
from it.
THE DIM MOVES TO THE END OF THE ENVIRONMENT. Floor, deck, stairs, cars, all
of it steps back together and the bodies and the bullet stay bright. One
relocation, and it fixes every future member of this family instead of the
three I can currently name.

--------------------------------------------------------------------------
4. "THIS OPAQUE BLACK TRANSPARENT SHADOW RECTANGLE THAT POPS UP NOWHERE"
--------------------------------------------------------------------------
Found by instrument, and it is exactly what he called it: a grid of
    fillRect rgba(0,0,0,0.28)  rect -41,566,74,74   (and 12 more)
That is the deck's shadow, one solid 74x74 square per tile. Adjacent squares
merge into ONE HARD BLACK RECTANGLE, and the killshot camera zoom slides it
into frame from off-screen -- "pops up out of nowhere", precisely.
The code's own comment says "a scaffold throws a BROKEN shadow, because it
has gaps" and then draws a solid slab. The comment was right and the code was
lying: the shadow is slatted now, matching the boards that cast it.

--------------------------------------------------------------------------
5. "THERE'S INVISIBLE PILLARS SOMETIMES"
--------------------------------------------------------------------------
MEASURED: 10 of 588 cars across 300 rolled arenas (1.7%) have NO NOSE CELL --
solid cover with no sprite. Invisible pillars, exactly as reported.
THE CAUSE IS MINE. A car is six pillar cells and only the flagged NOSE cell
draws the sprite (v104). The deck is built after the cars and evicts pillars
under its slab CELL BY CELL -- so a deck landing on a car's corner deletes
the nose and leaves five invisible solid cells behind. A per-cell filter on a
multi-cell object was always going to do this.
A CAR IS EVICTED WHOLE OR NOT AT ALL.

--------------------------------------------------------------------------
6. "I'M NOT SEEING THE BEADS ANYMORE"
--------------------------------------------------------------------------
"they're really thin, red or orange transparent lines. I want them to come
back for now."
They are still drawn -- they were dialled DOWN TWICE on his own instruction
(7/3 "an indicator, never a dominator", 7/4 "down another 40%") and the
second pass took red to 0.30 alpha and amber to 0.18 on a 430px phone. That
is a ruling reversal, not a bug, and "I want them to come back" is the new
ruling. Red and amber come back up; the ORDERING he set (danger outranks its
warning, tucked stays nearly invisible) is untouched.

--------------------------------------------------------------------------
7. "SPRINTING MOVING TWO TILES TO ONE TILE"
--------------------------------------------------------------------------
"I'm not a big fan of it moving two tiles and you still get to move for free
before the turn... sprinting basically just means you get to take movement
action without your [turn] ending."
His ruling, and it makes sprint a clean verb instead of a distance cheat.

--------------------------------------------------------------------------
8. "THE WAREHOUSE ARENA IS DOG SHIT... THE ONLY ONE I'M COMFORTABLE PLAYING
   ON IS STREET"
--------------------------------------------------------------------------
That is a rejection, not a note, and it is the second time the two-storey
arena has come back at me. THE WAREHOUSE IS OFF. Every arena is the street
until the thing is worth playing. The generator is not deleted (it is not
graveyarded without his word) -- it is unreachable, and the record says so.

--------------------------------------------------------------------------
9. "IF THEY'RE CRAWLING THEN THEY STAND UP WHEN I GET NEXT TO THEM"
--------------------------------------------------------------------------
    if(e.edist<=BohemiaMelee.SHOVE_RANGE&&L.handsup112)return L.handsup112;
handsup112 is a STANDING hands-up pose. The v32 intent was "KNEEL AND BEG";
the clip that got wired is a man on his feet. So a dying man on the floor
stood up the moment you walked over to finish him. A DOWNED MAN IS ON THE
FLOOR AND STAYS THERE -- handsup belongs to the BROKEN, who never fell.

AND "WHEN I DO FINISH THEM OFF THEY DON'T DO ANY ANIMATION". finishHim set
_deadAt to 1200ms in the PAST, which starts the 12-frame death clip at frame
8 -- four frames, from a body that is already lying flat, into an end pose
that is also lying flat. There was nothing to see because there was nothing
moving. It starts at frame 5 now so the body visibly goes, and a purpose-cut
execution beat is written up as an art request rather than faked here.

--------------------------------------------------------------------------
10. "TWO BULLETS... YOU GOT TO ADD TWO GUNSHOT SOUND EFFECTS"
--------------------------------------------------------------------------
Second time he has said this, so the v107 answer (165ms, own voice) was not
enough and I am not going to re-tune a number and call it fixed. The real
defect is that the sound and the picture were never connected: the report
fired on a setTimeout while the second bullet spawns off the killshot's own
travel fraction. Two clocks, so they agreed only by luck.
THE SECOND REPORT NOW FIRES WHEN THE SECOND BULLET LEAVES THE MUZZLE, off
the same fraction that draws it. If you see two rounds you hear two shots,
by construction.

REUSE CHECK: cooks NO graphic pixels. It moves an existing dim pass, slats an
existing shadow, re-times an existing synthesised report, changes numbers, and
selects among clips already baked and approved. No bank is opened because no
art is authored here.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry and reshapes
  nothing. It changes which already-baked clip a downed body plays and where
  its clip clock starts.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V110 EXPOSURE HAS A PRICE'


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
        print('v110 already in; nothing to do')
        return

    # ===== 1 + 2. PRESSURE, AND BOHEMIAN PAST THE ALLOWANCE ============
    old = """function chainRampDial(){ const o=chainOver();
  return o<=0?0:Math.max(0,Math.min(4,CHAIN_RAMP_BASE+(o-1)*CHAIN_RAMP_STEP)); }"""
    new = """/* ===== V110 EXPOSURE HAS A PRICE ==================================
   Paolo 8/1: "if there's three or four enemies with cover like I'm fully
   exposed no cover like I don't know it should be really hard to get that
   green like really hot depending on how many enemies obviously it slides
   with how many enemies have cover trying to shoot at you".
   He is right and the hole is embarrassing: standing in the open against
   four covered guns pulled the SAME dial as standing behind a wall against
   one. The dial has had a FLOOR mechanism since v95 and the most basic
   tactical fact in the game was not using it.
   IT COUNTS ONLY THE SITUATION HE DESCRIBED: a gun that is behind cover,
   has a line on you, and that you have NO cover from. A gun in the open is
   not pressure, it is a target; a gun you are covered from is not shooting
   at you. Numbers are DIALS. */
function pressureGuns(){ return (G.e||[]).filter(e=>!e.dead&&!e.downed&&!e.broken
  &&!e.fleeing&&!e.melee&&!pinned(e)&&e.stun<=0
  &&e.gcov&&(e.acq||0)>=1&&!myCoverAgainst(e.ea,e.edist,e.lvl)).length; }
function pressurePkg(){ const n=pressureGuns(); return n<2?0:Math.min(4,n); }
/* V110 (Paolo 8/1): "that third shot, I want it to be a Bohemian difficulty
   pattern not even very hard just straight up Bohemian difficulty pattern."
   The ramp is dead. Past the allowance is BOHEMIAN, flat, from the first
   extra shot -- which is also the cleaner promise: the allowance is the
   whole negotiation, and beyond it there is one answer. */
function chainRampDial(){ return chainOver()<=0?0:4; }"""
    s = subN(s, old, new)

    old = """      G.pkgDiff=Math.max(0,Math.min(4,Math.max(
        distPkg(tgt)+(tgt.elite?1:0)+(tgt.gcov?1:-1)+(G.handPeek?1:0),
        chainRampDial()))); } }"""
    new = """      G.pkgDiff=Math.max(0,Math.min(4,Math.max(
        distPkg(tgt)+(tgt.elite?1:0)+(tgt.gcov?1:-1)+(G.handPeek?1:0),
        chainRampDial(),
        pressurePkg())));   /* V110: exposure is a FLOOR, same shape as the chain ramp, so point blank still eases the dial exactly as he ruled on 7/27 but can never fully cancel the cost of standing in the open */
      } }"""
    s = subN(s, old, new)

    # the readout says WHY the dial got mean
    old = """    setRead(_ov?'PUSHING':(isChain?'CHAIN':'AIM'),
      (_ov?'SHOT '+(G._chainN||1)+' OF '+chainAllowance()+' · ':'')"""
    new = """    const _pg=pressureGuns();
    setRead(_ov?'PUSHING':(_pg>=2?'IN THE OPEN':(isChain?'CHAIN':'AIM')),
      (_ov?'SHOT '+(G._chainN||1)+' OF '+chainAllowance()+' · ':'')
      +(!_ov&&_pg>=2?_pg+' COVERED GUNS ON YOU · ':'')   /* V110: he must be able to SEE why the dial went mean */"""
    s = subN(s, old, new)

    # ===== 3. THE KILL DIMS THE WHOLE WORLD ============================
    old = """    const _mk=(G.ks&&G._ksAt)?Math.max(0,1-(visNow()-G._ksAt)/260):1;
    if(_mk<1){ x.fillStyle='rgba(0,0,0,'+((1-_mk)*0.42).toFixed(3)+')';
      x.fillRect(0,0,W,H); }
  }"""
    new = """    /* V110: THE DIM MOVED. It used to fire HERE, inside the floor block, and
       the deck, the stairs and the cars all draw after it at full brightness
       straight over the top -- so the one thing the dim exists to push back
       was the one thing exempt from it. See THE KILL DIMS THE WORLD below. */
  }"""
    s = subN(s, old, new)

    old = """  /* V99 YOUR grenade, in warm amber. Two fused objects on one field that look
     the same would be unreadable, and the one thing you must never be confused
     about is which of them is about to hurt YOU. */"""
    new = """  /* ===== V110 THE KILL DIMS THE WORLD, ALL OF IT =====================
     Paolo's SEVENTH report of the orange. Instrumented again, and this time
     it is not the dial: the ghost fans v107 killed stayed dead, and what is
     warm on screen during a kill is THE TWO-STOREY --
        232x stroke rgba(232,214,172,0.92)   the deck's kick rail
         29x fillRect rgba(232,214,172,0.95) the stair tread lips
     the brightest warm objects in the game, drawn AFTER the v94 kill dim and
     therefore exempt from it. Draw order, not colour.
     Now the dim lands here, after the whole environment, so the floor, the
     deck, the stairs and the cars all step back TOGETHER and only the bodies
     and the bullet stay bright. That is what the dim was always for, and it
     covers every future piece of scenery instead of the three I can name. */
  if(!aimo){ const _mk2=(G.ks&&G._ksAt)?Math.max(0,1-(visNow()-G._ksAt)/260):1;
    if(_mk2<1){ x.fillStyle='rgba(0,0,0,'+((1-_mk2)*0.42).toFixed(3)+')';
      x.fillRect(0,0,W,H); } }
  /* V99 YOUR grenade, in warm amber. Two fused objects on one field that look
     the same would be unreadable, and the one thing you must never be confused
     about is which of them is about to hurt YOU. */"""
    s = subN(s, old, new)

    # AND THE TWO-STOREY'S OWN HIGHLIGHTS GO DARK, not merely dimmed
    old = """    x.strokeStyle='rgba(232,214,172,0.92)'; x.lineWidth=Math.max(2,t2*0.08);"""
    new = """    /* V110: MEASURED at 100 strokes of rgba(232,214,172,0.92) during one kill
       -- the single brightest warm thing on screen. A 0.42 black overlay only
       takes it to ~135 luminance, and he has reported this orange SEVEN times,
       so the highlight goes dark AT THE SOURCE and the overlay is the backstop
       rather than the whole answer. The rail is a HIGHLIGHT, not structure:
       the deck still reads by its boards, legs and bracing. */
    x.strokeStyle=dialOrnament()?'rgba(232,214,172,0.92)':'rgba(120,110,88,0.30)'; x.lineWidth=Math.max(2,t2*0.08);"""
    s = subN(s, old, new)

    old = """      x.fillStyle='rgba(232,214,172,0.95)';
      x.fillRect(ox2-wx*0.5, oy2, wx, Math.max(1,tread*0.34)); } }"""
    new = """      x.fillStyle=dialOrnament()?'rgba(232,214,172,0.95)':'rgba(120,110,88,0.32)';   /* V110: the stair tread lips, same family, same rule */
      x.fillRect(ox2-wx*0.5, oy2, wx, Math.max(1,tread*0.34)); } }"""
    s = subN(s, old, new)

    # the dial's own tick marks join the v107 family
    old = """    ctx.strokeStyle=major?'rgba(186,170,132,0.5)':'rgba(140,128,100,0.26)'; ctx.lineWidth=(major?1.6:1)*S;"""
    new = """    ctx.strokeStyle=major?(dialOrnament()?'rgba(186,170,132,0.5)':'rgba(186,170,132,0.12)'):'rgba(140,128,100,0.26)'; ctx.lineWidth=(major?1.6:1)*S;   /* V110: the major ticks are warm tan and 145 of them fired during a kill -- same family as v107's ghost fans, same rule */"""
    s = subN(s, old, new)

    # ===== 4. THE SCAFFOLD'S SHADOW HAS GAPS ===========================
    old = """    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy);
      x.fillStyle='rgba(0,0,0,0.28)'; x.fillRect(p[0]-t2*0.5,p[1]-t2*0.5,t2+1,t2+1); }"""
    new = """    /* V110 (Paolo 8/1): "this like opaque, black transparent, shadow rectangle
       that pops up nowhere". Found by instrument and it is exactly that -- a
       grid of solid rgba(0,0,0,0.28) 74x74 squares that MERGE into one hard
       black rectangle, slid into frame by the killshot camera zoom.
       The code's own comment two lines up says a scaffold throws a BROKEN
       shadow because it has gaps, and then it drew a slab. The comment was
       right. The shadow is slatted now, from the same NBOARD the deck is. */
    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy);
      x.fillStyle='rgba(0,0,0,0.26)';
      const _sw=(t2+1)/4;
      for(let _b=0;_b<4;_b++)x.fillRect(p[0]-t2*0.5+_b*_sw,p[1]-t2*0.5,_sw*0.78,t2+1); }"""
    s = subN(s, old, new)

    # ===== 5. A CAR IS EVICTED WHOLE OR NOT AT ALL =====================
    old = """      G.pillars=G.pillars.filter(P=>{ const q=pXY(P); return !deckTileAt(q[0],q[1]); }); }"""
    new = """      /* V110 NO INVISIBLE COVER (Paolo 8/1: "there's invisible pillars
         sometimes in the arena"). MEASURED: 10 of 588 cars across 300 rolled
         arenas -- 1.7% -- had NO NOSE CELL, which is solid cover with no
         sprite, because only the flagged nose draws (v104) and this filter
         evicted pillars CELL BY CELL. A deck corner landing on a car deleted
         its nose and left five invisible solid cells behind.
         A PER-CELL FILTER ON A MULTI-CELL OBJECT WAS ALWAYS GOING TO DO THIS.
         A car is evicted WHOLE or not at all. */
      { const _doomed={};
        for(const P of G.pillars){ if(!P.car)continue; const q=pXY(P);
          if(deckTileAt(q[0],q[1]))_doomed[P.car]=1; }
        G.pillars=G.pillars.filter(P=>{ if(P.car)return !_doomed[P.car];
          const q=pXY(P); return !deckTileAt(q[0],q[1]); }); } }"""
    s = subN(s, old, new)

    # ===== 6. THE BEADS COME BACK ======================================
    old = """    let col,w; if(red){col='rgba(232,60,40,0.30)';w=2;} else if(acqing){col='rgba(232,140,40,0.18)';w=2;}   /* V22: danger outranks its warning */ else if(out){col='rgba(222,150,60,0.09)';w=1.4;} else {col='rgba(120,108,86,0.04)';w=1;}"""
    new = """    /* V110 THE BEADS COME BACK (Paolo 8/1: "I'm not seeing the beads anymore.
       You know they're really thin, red or orange transparent lines. I want
       them to come back for now."). They were never removed -- they were
       dialled DOWN TWICE on his own instruction (7/3 "an indicator, never a
       dominator", 7/4 "down another 40%") and the second pass left red at
       0.30 and amber at 0.18 on a 430px phone. That is a ruling he has now
       reversed. His ORDERING is untouched: danger still outranks its warning
       and a tucked man still draws almost nothing. */
    let col,w; if(red){col='rgba(232,60,40,0.62)';w=2.8;} else if(acqing){col='rgba(232,140,40,0.42)';w=2.4;}   /* V22: danger outranks its warning */ else if(out){col='rgba(222,150,60,0.16)';w=1.5;} else {col='rgba(120,108,86,0.05)';w=1;}"""
    s = subN(s, old, new)

    # ===== 7. SPRINT IS ONE TILE =======================================
    old = """  const _mult=_sprinting?2:1;   /* V44 SPRINT: two tiles, not one */"""
    new = """  const _mult=1;   /* V110 (Paolo 8/1, ruling): "I want to change it to sprinting moving two tiles to one tile... sprinting basically just means you get to take movement action without your turn ending." The distance cheat is gone; the VERB is the whole point. */"""
    s = subN(s, old, new)

    old = """  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'two tiles — 1 pip, no turn spent, nobody gets a shot','#8fe89a');"""
    new = """  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'one tile — 1 pip, no turn spent, nobody gets a shot','#8fe89a');"""
    s = subN(s, old, new)

    # ===== 8. THE WAREHOUSE IS OFF =====================================
    old = """  G.arenaKind=(Math.random()<0.5)?'warehouse':'street';"""
    new = """  /* V110 (Paolo 8/1): "The warehouse arena is dog shit it gives me anxiety
     looking at it like it looks really bad. The only one I'm comfortable
     playing on is street." That is a REJECTION and it is the second time the
     two-storey arena has come back at me, so it is off -- not argued, not
     re-tuned, off. buildWarehouse() is NOT deleted (nothing is graveyarded
     without his word) and is simply unreachable until the arena is worth
     playing. Every fight is the street. */
  G.arenaKind='street';"""
    s = subN(s, old, new)

    # ===== 9. A DYING MAN STAYS DOWN, AND THE FINISH PLAYS =============
    old = """    if(e.edist<=BohemiaMelee.SHOVE_RANGE&&L.handsup112)return L.handsup112;   /* V32 KNEEL AND BEG: close the distance and he begs YOU specifically */"""
    new = """    /* V110 (Paolo 8/1): "I don't like how when people are ready to die first
       off if they're like crawling then they stand up when I get next to them
       to finish them off". EXACTLY RIGHT AND IT IS THIS LINE. handsup112 is a
       STANDING hands-up pose; the v32 intent was "KNEEL AND BEG" and the clip
       that got wired is a man on his feet. So walking over to finish a dying
       man stood him up. A DOWNED MAN IS ON THE FLOOR AND HE STAYS THERE --
       handsup belongs to the BROKEN, who surrendered without ever falling. */"""
    s = subN(s, old, new)

    old = """  t._deathVar=deathFall(t,fallSrc(),0); t._deadAt=performance.now()-1200;   /* V109: point blank by definition */   /* already on the floor: no second fall */"""
    new = """  /* V110 (Paolo 8/1): "when I do finish them off, they don't do any animation.
     They just like go instantly until like a straight death picture."
     -1200ms starts the 12-frame clip at frame 8 -- four frames, from a body
     already lying flat, into an end pose that is also lying flat. There was
     nothing to see because nothing moved. Frame 5 now, so the body visibly
     goes. A purpose-cut EXECUTION beat is an art request, not something to
     fake here. */
  t._deathVar=deathFall(t,fallSrc(),0); t._deadAt=performance.now()-750;   /* V109: point blank by definition */"""
    s = subN(s, old, new)

    # ===== 10. TWO BULLETS, TWO BANGS ==================================
    old = """  if(dbl)setTimeout(()=>{try{sndShot2();fxShot();G.recoil=Math.max(G.recoil,0.7);flash=Math.max(flash,0.55);if(navigator.vibrate)navigator.vibrate(12);}catch(_e){}},165);"""
    new = """  /* V110: the second report is NOT on a timer any more. He has said this
     twice, so re-tuning the number again would be the fourth-version mistake.
     THE REAL DEFECT: the sound fired on setTimeout while the second bullet
     spawns off the killshot's own travel fraction -- two clocks that agreed
     only by luck. It now fires FROM the killshot, when the round leaves the
     muzzle. See drawKillshotWorld. */"""
    s = subN(s, old, new)

    old = """  if(ks._dbl){ const bp2=Math.min(1,Math.max(0,(p-0.06)/travel));"""
    new = """  if(ks._dbl){ const bp2=Math.min(1,Math.max(0,(p-0.06)/travel));
    /* V110 TWO BULLETS, TWO BANGS, ON THE SAME CLOCK. If you can see the
       second round you can hear it, by construction, not by coincidence. */
    if(p>=0.06&&!ks._dblSnd){ ks._dblSnd=true;
      try{sndShot2();fxShot();G.recoil=Math.max(G.recoil,0.7);
        if(navigator.vibrate)navigator.vibrate(12);}catch(_e){} }"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v110: pressure, bohemian third shot, the world dims, no invisible cover (%d chars)' % len(s))


if __name__ == '__main__':
    main()
