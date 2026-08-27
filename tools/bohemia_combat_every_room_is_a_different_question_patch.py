#!/usr/bin/env python3
"""
V187 EVERY ROOM IS A DIFFERENT QUESTION -- RF4-25 and RF4-26, the puzzle he asked
for.

  PAOLO 8/26: "Rogue Fable four isn't necessarily a puzzle game, but IT KIND OF
  IS. You know? And when you drop me in these, like, sample environments, IT
  SHOULD ALMOST BE, LIKE, HOW IS BEST TO SOLVE THIS PUZZLE GIVEN MY STATS AT THE
  TIME and shit."

  RF4-26: "Enemies should generally be more individually powerful, come in MIXED
  GROUPS and be DESIGNED TO WORK TOGETHER, support and compliment each other."
  RF4-25: SYNERGY OVER COUNT.
  Our own column on RF4-26: "The bodies are differentiated; THE GROUPS ARE NOT
  COMPOSED."

*** AND THAT COLUMN WAS HALF RIGHT, WHICH IS WHY THIS IS NOT A REWRITE. ***
composeRoster is NOT random -- it is a "spine at every size" recipe, and it is a
good one: a sniper at three, the machine at four, his 7/19 blades, the medic, the
breacher. THE PROBLEM IS THAT IT IS THE ONLY RECIPE. Five men is ALWAYS sniper +
bot + blade + medic + breacher. Every arena in the game poses THE SAME QUESTION,
so there is nothing to solve -- you learn one answer on fight three and repeat it
forever. A puzzle needs a DIFFERENT question, not a harder one.

-------------------------------------------------------------------------
FIVE SHAPES, AND EACH ONE BREAKS A DIFFERENT HABIT
-------------------------------------------------------------------------
  THE NEST     a sniper and men who hold. YOU ARE PINNED AT RANGE.
               Answer: break his line or close the distance. Punishes camping.
  THE RUSH     blades and no sniper at all. THEY ARE ALREADY COMING.
               Answer: keep moving, spend smoke, never get cornered. Punishes
               standing still -- the exact opposite of THE NEST.
  THE ANVIL    a breacher and a machine. YOUR COVER IS BEING EATEN.
               Answer: put the breacher down or leave the rock early. Punishes
               trusting one stone.
  THE CHOIR    a medic behind bodies. THEY DO NOT STAY DOWN.
               Answer: the medic first, or nothing you do sticks. Punishes
               shooting whatever is closest.
  THE MIX      his 7/19 spine, unchanged, still in the pool.

TWO OF THEM WANT OPPOSITE THINGS FROM YOU. That is the whole design: THE NEST
punishes standing still and THE RUSH punishes moving badly, so no single habit
survives contact with the pool. "Given my stats at the time" is what makes it a
puzzle rather than a quiz -- with a plate in hand THE RUSH is survivable head on;
without one it has to be kited.

-------------------------------------------------------------------------
HIS RULINGS ARE NOT OVERRIDDEN BY A SHAPE
-------------------------------------------------------------------------
G.meleeMix is HIS 7/19 ruling and it still wins: at NO-BLADES no shape puts a
blade on the board, and at PACK every shape gets his floor(N/2). A shape bends
the mix, it never replaces it -- the same mistake V173 made when a new archetype
ate a slot the ruling had already claimed.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy, hp or armour number moves.
This changes WHICH BODIES STAND IN THE ROOM, nothing about what they hit for.

MECHANISM MINE, CONTENTS HIS: the shapes and their composition are mechanism. The
NAMES and the one line each says are WORDS, so they ship as a real attempt tagged
draft:true.

REUSE CHECK: cooks no graphic pixels, opens no bank, adds no archetype. Every body
it places already exists (sniper, bot, shiv/bat/spear, medic, breacher, human) and
it fills through the same composeRoster contract.

TASTE CHECK: no new button, no menu. One readout line at the top of a fight, so
the room announces the question and never the answer.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V187 EVERY ROOM IS A DIFFERENT QUESTION'


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
        print('v187: already applied')
        return

    # ---- composeRoster PICKS A SHAPE; the old recipe becomes composeSpine ----
    d = sub(d,
        "function composeRoster(N){",
        """function composeRoster(N){
  /* ===== V187 EVERY ROOM IS A DIFFERENT QUESTION (RF4-25, RF4-26) =====
     Paolo 8/26: "Rogue Fable four isn't necessarily a puzzle game, but IT KIND OF
     IS... when you drop me in these sample environments, IT SHOULD ALMOST BE,
     LIKE, HOW IS BEST TO SOLVE THIS PUZZLE GIVEN MY STATS AT THE TIME."
     THE SPINE BELOW IS GOOD AND IT WAS THE ONLY RECIPE, WHICH IS THE BUG. Five
     men was ALWAYS sniper + bot + blade + medic + breacher, so every arena asked
     the same question and you learned one answer on fight three and repeated it
     forever. A puzzle needs a DIFFERENT question, not a harder one.
     *** EVERYTHING THIS CALLS IS DECLARED BELOW, INSIDE THIS FUNCTION'S OWN
     SLICE, AND THAT IS DELIBERATE. *** combat_lab's V167 does not read this as a
     string -- it SLICES from `function composeRoster(N){` to `function
     setupEnemies` and EXECUTES it, bound only to G, to prove the recipe really
     makes a mixed group at every size. Declaring the shapes above this line puts
     them outside that slice, the harness throws, and THREE correct claims go red
     at once -- the same trap V163's clock harness set for the plate. */
  const sh=rollShape(N); G.shape=sh;
  return sh.want ? composeShaped(N,sh) : composeSpine(N); }
function composeSpine(N){""",
        what='composeRoster picks a shape')

    # ---- and the shapes are declared AFTER it, still inside the slice ----
    d = sub(d,
        "  while(out.length<N)out.push('human');                        /* THE REST */\n  return out.slice(0,N); }",
        """  while(out.length<N)out.push('human');                        /* THE REST */
  return out.slice(0,N); }
/* *** A SHAPE DECIDES WHAT DOMINATES, NEVER WHAT IS THE ONLY THREAT. *** The
   first cut gave THE NEST a sniper and FOUR PLAIN GOONS, which is blander INSIDE
   a fight than the spine it replaced -- and the spine's own comment warned about
   exactly that: "a three-man fight is three different problems from three
   directions rather than two goons and a stick." Trading variety-within-a-fight
   for variety-between-fights is not a trade worth making.
   AND EVERY SHAPE KEEPS EXACTLY ONE WORST MAN. V167 holds that as RF4-37's
   missing precondition -- you cannot have a priority target in a crowd of
   interchangeable goons -- so no shape doubles its signature body. What differs
   is WHICH body is the worst one and what stands beside it.
   [draft:true] on every name and line: what a shape is CALLED is his. */
const SHAPES=[
  {id:'nest',  n:'THE NEST',  draft:true, says:'somebody has a line on this whole lot',
   want:{sniper:1, bot:2, blades:0, medic:0, breach:0}},
  {id:'rush',  n:'THE RUSH',  draft:true, says:'they are already coming',
   want:{sniper:1, bot:0, blades:3, medic:0, breach:0}},
  {id:'anvil', n:'THE ANVIL', draft:true, says:'the stone will not last',
   want:{sniper:1, bot:1, blades:1, medic:0, breach:1}},
  {id:'choir', n:'THE CHOIR', draft:true, says:'somebody back there is picking them up',
   want:{sniper:1, bot:0, blades:1, medic:2, breach:0}},
  {id:'mix',   n:'THE MIX',   draft:true, says:'a bit of everything, and all of it awake',
   want:null}
];
function rollShape(N){
  if(N<3)return SHAPES[SHAPES.length-1];
  return SHAPES[Math.floor(Math.random()*SHAPES.length)]; }
function composeShaped(N,sh){
  const MM=(G.meleeMix==null)?1:G.meleeMix;
  const out=[]; const w=sh.want;
  /* HIS 7/19 MELEE RULING STILL WINS, WHATEVER THE SHAPE WANTS: OFF means none
     and PACK means his half, in every shape. A shape BENDS the mix, it never
     replaces it -- the mistake V173 made when a new archetype ate a slot a
     ruling had already claimed. */
  const blades = (MM===0) ? 0
               : (MM===2 ? Math.max(1,Math.floor(N/2))
                         : Math.min(Math.max(0,N-2), w.blades));
  if(w.sniper&&out.length<N)out.push('sniper');       /* EXACTLY ONE WORST MAN */
  for(let i=0;i<(w.bot||0)&&out.length<N;i++)out.push('bot');
  const BL=['shiv','bat','spear'];
  for(let i=0;i<blades&&out.length<N;i++)out.push(BL[i%3]);
  for(let i=0;i<(w.medic||0)&&out.length<N;i++)out.push('medic');
  for(let i=0;i<(w.breach||0)&&out.length<N;i++)out.push('breacher');
  while(out.length<N)out.push('human');
  /* *** AND A SMALL ROOM STILL HAS TO BE THREE PROBLEMS. *** V167 holds that
     every size is a MIXED GROUP -- "a three-man fight is three different
     problems from three directions, not two goons and a stick" -- and the first
     cut of these shapes broke it at the bottom: THE NEST at three men came out
     sniper + bot + bot, TWO kinds. A shape may lean, it may not collapse. The
     last duplicate gives way so the floor holds. */
  if(N>=3){ const seen=new Set(out);
    for(let i=out.length-1;i>=0&&seen.size<3;i--){
      const was=out[i]; const c=out.filter(v=>v===was).length;
      if(c>1){ out[i]='human'; seen.clear(); for(const v of out)seen.add(v); } } }
  return out.slice(0,N); }""",
        what='the shapes, inside the slice')

    d = sub(d,
        "G.pp=PLATE_START; G.power=POWER_BASE; G.kit={}; G._steadyShot=false;",
        """G.pp=PLATE_START; G.power=POWER_BASE; G.kit={}; G._steadyShot=false;
  /* V187: the room announces the QUESTION and never the answer. */
  try{ if(G.shape)setRead(G.shape.n,G.shape.says,'#e8c88a'); }catch(_e){}""",
        what='the readout')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v187: every room is a different question -- %d chars' % len(d))


if __name__ == '__main__':
    main()
