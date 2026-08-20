#!/usr/bin/env python3
"""
V174 YOU CAN SHOOT THE CAR (Paolo, 8/20: "how do i shoot a car?")

HE ASKED, AND THE HONEST ANSWER WAS THAT HE COULD NOT. Checked on the real
surface rather than answered from memory: `carHeat` had exactly two callers in
the whole file -- a round of THEIRS that your cover ate (V108), and your grenade
landing inside CAR_BLAST (V104). There was no way to point a gun at a car. The
turn before this one told him a burning car was "something the fight already
rewards you for shooting", and that sentence was false.

*** EVERYTHING ELSE WAS ALREADY BUILT. *** That is what makes this a missing verb
rather than a feature:
  - cars are placed with a `tank` part (`tank:(part==='boot')`), so the fuel end
    is already a distinct cell
  - heat already accumulates per car and cooks off at CAR_COOK
  - the heat is ALREADY DRAWN -- a rim that brightens and reddens as the metal
    cooks, plus a bloom on the tank end and nowhere else
  - cookOff already does the whole payoff: 46-60 inside a tile and 20-30 out to
    CAR_BLAST to EVERYONE including you, the shell becomes permanent low hard
    cover, and V170 throws the smoke that blinds both sides
A complete mechanic with its display, its payoff and its geometry, and no door
into it. He found the missing door by trying to use it.

WHAT SHIPS: TAP A CAR AND YOU SHOOT IT. No new button -- the field tap already
places cover on a ring cell, already picks a man, and already eats a tap for an
armed grenade. A car was the one thing on the board you could see, walk behind,
hide from and not touch. It reuses tapTile, the same tap-to-world conversion the
grenade has used since V104, rather than a second hit test that could disagree
with it.

AND THE TANK IS THE WHOLE SKILL IN IT. A body hit is worth CAR_SHOT_HEAT and the
tank is worth CAR_TANK_HEAT, so three rounds into the boot cook it and ten into
the bonnet barely do -- and the game has been drawing which end is which since
V108. That is RF4-02 exactly: "critical info presented in the world and on the
field of battle", not in a menu. Aim at the glow.

IT COSTS THE TURN, like every other shot (RF4-49), and it never rolls to hit: a
car is a stationary object the size of a car. The dial is for people.

IT IS SYMMETRIC WITH V170. Smoke between you and the car refuses the shot for the
same reason it refuses a man -- you cannot shoot what you cannot see, and the
screen you made is a screen you are also behind.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy or hp number is touched.
CAR_SHOT_HEAT and CAR_TANK_HEAT are heat, which is CAR_COOK's existing [DIAL]
family, and what the explosion does when it comes is V108's number, unchanged.

REUSE CHECK: cooks no graphic pixels and opens no bank -- there is nothing new to
draw, because the heat rim and the tank bloom were already there waiting for a
reason to climb. It reuses tapTile (V104), carHeat and cookOff (V108),
smokeBetween (V170), maxRange/myRange, sndShot and fxShot.

TASTE CHECK: no new button, no new HUD, no tutorial. A tap on the thing, and the
readout he already reads tells him what happened and how far along the metal is.
The one place it speaks unprompted is when he taps a car he cannot reach, because
"nothing happened" is the answer that made him ask the question in the first
place.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V174 YOU CAN SHOOT THE CAR'


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
        print('v174: already applied')
        return

    # ---- 1. THE VERB ----
    d = sub(d,
        "function carCells(cid){ return (G.pillars||[]).filter(P=>P.car===cid); }",
        """function carCells(cid){ return (G.pillars||[]).filter(P=>P.car===cid); }
/* ===== V174 YOU CAN SHOOT THE CAR ==================================
   Paolo, 8/20: "how do i shoot a car?" -- and the honest answer was that he
   could not. carHeat had two callers in the entire file: a round of THEIRS your
   cover ate, and your grenade landing beside it. Everything else was built --
   the tank part, the climbing heat, the rim that reddens, the bloom on the fuel
   end, and cookOff's whole payoff -- with no door into it. He found the missing
   door by trying to walk through it.
   THE TANK IS THE SKILL. Three rounds into the boot cook it; ten into the bonnet
   barely do. The game has been drawing which end is which since V108, so the
   thing you need to know is on the field and not in a menu (RF4-02). */
const CAR_SHOT_HEAT=1;   /* [DIAL] a round into the body: same as one of theirs */
const CAR_TANK_HEAT=4;   /* [DIAL] and into the fuel end, where it counts */
function carAtTile(tx,ty){
  return (G.pillars||[]).find(P=>{ if(!P.car||P.burnt)return false;
    const q=pXY(P); return Math.abs(q[0]-tx)<0.6 && Math.abs(q[1]-ty)<0.6; }); }
function shootCar(P){
  if(!P||G.phase!=='cover'||G.over||G.inc)return false;
  const q=pXY(P), d=Math.hypot(q[0],q[1]);
  if(d>maxRange(myRange())){
    setRead('TOO FAR','that is past what this gun reaches','#8a7d66'); return false; }
  /* SYMMETRIC WITH V170: you cannot shoot what you cannot see, and the screen
     you made is a screen you are standing behind too. */
  if(typeof smokeBetween==='function' && smokeBetween(q[0],q[1],P.lvl|0)){
    setRead('THE SMOKE IS IN THE WAY','you cannot see it either','#b9b2a6'); return false; }
  audio(); try{sndShot();}catch(_e){} try{fxShot();}catch(_e){} G.recoil=0.5;
  /* NO ROLL TO HIT. A car is a stationary object the size of a car; the dial is
     for people. */
  const was=(G._carHeat||{})[P.car]||0;
  carHeat(P.car, P.tank?CAR_TANK_HEAT:CAR_SHOT_HEAT);
  const now=(G._carHeat||{})[P.car]||0;
  if(now<CAR_COOK){   /* if it cooked, cookOff has already said so, and louder */
    const left=Math.max(1,Math.ceil((CAR_COOK-now)/CAR_TANK_HEAT));
    setRead(P.tank?'INTO THE TANK':'INTO THE METAL',
      P.tank?(left+' more in the fuel end and it goes')
            :'the body soaks it up \\u2014 the glowing end is the one that goes',
      P.tank?'#e8b04a':'#8a7d66'); }
  G.steady=0;
  return true; }""",
        what='shootCar')

    # ---- 2. THE DOOR: the field tap, after the men so a tap on a man is a man ----
    d = sub(d,
        """      setRead('TARGET: '+e.n, e.melee?'the blade goes down first':'he eats the next dial','#e8b04a');
      renderBoard(); updGap(); return; } }
});""",
        """      setRead('TARGET: '+e.n, e.melee?'the blade goes down first':'he eats the next dial','#e8b04a');
      renderBoard(); updGap(); return; } }
  /* V174: AND A CAR IS A THING YOU CAN SHOOT. Last, so a tap on a man is always
     a man -- this only ever claims a tap nothing else wanted. It runs in AUTO as
     well as MANUAL, because it is not overriding the game's choice of WHO to
     shoot, it is a different verb entirely: the auto-target rule (V35) exists so
     a curious tap cannot silently re-pick your victim, and this picks nobody. */
  { const t4=tapTile(x,y);
    if(t4){ const P4=carAtTile(t4[0],t4[1]);
      if(P4){ if(shootCar(P4)) return endTurnReturn(false);
        renderBoard(); updGap(); return; } } }
});""",
        what='the field tap')

    # ---- 3. AND IT GOES ON THE OPEN BOOK, because the floor cannot show a verb ----
    d = sub(d,
        "  L.push('SPEED REFILLS EVERY '+SP_TICK+'TH TURN OF THE WORLD, NOT ON A COOLDOWN.');",
        """  L.push('SPEED REFILLS EVERY '+SP_TICK+'TH TURN OF THE WORLD, NOT ON A COOLDOWN.');
  /* V174: RF4-68 says never explain what the floor could have shown, and the
     floor shows the heat, the glowing tank end and the explosion. What it cannot
     show is that the TAP EXISTS AT ALL -- an affordance nobody tries is
     invisible, which is exactly how this one went missing. So the book states
     the verb and says nothing about which end to hit, because the game is
     already drawing that. */
  L.push('YOU CAN SHOOT A CAR: TAP IT. '+CAR_COOK+' ROUNDS OF HEAT AND THE TANK GOES,'
    +' AND A ROUND IN THE FUEL END IS WORTH '+CAR_TANK_HEAT+' OF THEM.');""",
        what='open book')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v174: you can shoot the car -- %d chars' % len(d))


if __name__ == '__main__':
    main()
