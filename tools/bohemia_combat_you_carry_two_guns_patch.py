#!/usr/bin/env python3
"""V149 YOU CARRY TWO GUNS, AND THE SWAP COSTS YOU THE BEAT.

Paolo 8/12 [T22]: "I actually went in the settings to switch my gun so I can get
a longer range and I think that's important. Maybe this should be a swap you
know switch to secondary or maybe you get an option to carry two guns on you no
matter what they all have their pros and cons."

--------------------------------------------------------------------------
HE ALREADY PLAYED THE MECHANIC. HE JUST HAD TO USE THE SETTINGS MENU TO DO IT
--------------------------------------------------------------------------
He hit a range problem mid-fight and solved it by opening SETTINGS and changing
weapons. That is the strongest possible signal a mechanic is missing: the player
reached past the game to do the thing the game should have offered.

And it is only interesting BECAUSE ranges exist now. A shotgun reaches 5 tiles
and a rifle 20; those are different games. Carrying one means the board decides
whether your gun is useful. Carrying two means YOU decide, and pay for it.

--------------------------------------------------------------------------
THE RESEARCH: A FREE SWAP IS AN EXPLOIT, NOT A FEATURE
--------------------------------------------------------------------------
This is a solved problem and the answer is unanimous: if switching costs
nothing, the correct play is to hold whichever weapon is better THIS INSTANT and
switch back after, every single turn. Tactical designers call it out explicitly
-- attack with the offensive weapon, switch to the defensive one to be tanky
while waiting, switch back on your turn, all for free. The swap has to cost
action economy or it is not a decision.

The other half is also real: SWAPPING TO A SIDEARM IS FASTER THAN RELOADING.
That is why anyone carries one. So the cost should be a beat, not a fumble.

*** SO: THE SWAP IS YOUR TURN. *** Fast enough to be worth doing, expensive
enough that you must see it coming. You swap INSTEAD of shooting, they get their
volley, and you come up next beat holding the right gun. Anticipating the range
you are about to be in, one beat early, IS the skill this adds.

--------------------------------------------------------------------------
WHAT YOU CARRY: ALWAYS A SHORT AND A LONG
--------------------------------------------------------------------------
The pairing is a DIAL and it is deliberately dumb: whatever your primary is, the
secondary is its opposite number, so every loadout has a close answer and a far
answer. Pistol pairs with rifle, shotgun with SMG.

*** WHICH GUNS HE ACTUALLY OWNS IS NOT DECIDED HERE. *** This reads the weapon
he already has and gives it a partner. The real loadout -- what he finds, buys,
loses -- is the run's business and his, and none of it is invented in this file.

REUSE CHECK: cooks NO graphic pixels. It reuses WEAPON, WEAPON_RANGE, maxRange,
myRange, the mk() button factory the toolkit already uses, and endTurnReturn's
tucked path. No bank is opened because no art is authored.

TASTE CHECK: authors no art. The taste rule is his own instinct: he reached into
a menu mid-fight because the fight would not let him solve a problem he could
see. A control the player invents for himself is a control the game owes him.
The restraint is the COST -- a free swap would make every range decision
disappear, which would quietly undo the whole system he has been testing all
week.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V149 YOU CARRY TWO GUNS'
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
        print('v149 already in; nothing to do')
        return

    # ---- 1. the second gun, and the swap -------------------------------
    old = """function doRun(){ if(G.phase!=='cover'||G.over||G.inc)return;"""
    new = """/* ===== V149 YOU CARRY TWO GUNS ===================================
   Paolo [T22]: "I actually went in the settings to switch my gun so I can get a
   longer range and I think that's important. Maybe this should be a swap... or
   maybe you get an option to carry two guns on you no matter what."
   HE ALREADY PLAYED THE MECHANIC -- he hit a range problem mid-fight and solved
   it by opening SETTINGS. A player reaching past the game to do a thing the
   game should offer is the strongest signal a mechanic is missing.
   THE RESEARCH IS UNANIMOUS THAT A FREE SWAP IS AN EXPLOIT: if switching costs
   nothing, the correct play is to hold whichever gun is better this instant and
   switch back after, every turn, forever. The other half is equally real --
   going to a sidearm is FASTER THAN RELOADING, which is why anyone carries one.
   SO THE SWAP IS YOUR TURN. Fast enough to be worth doing, expensive enough
   that you have to see it coming: you swap INSTEAD of shooting, they get their
   volley, and you come up next beat holding the right gun. Anticipating the
   range you are ABOUT to be in, one beat early, is the skill this adds.
   *** WHICH GUNS HE OWNS IS NOT DECIDED HERE. *** This reads the weapon he
   already has and gives it an opposite number so every loadout has a close
   answer and a far answer. The real loadout is the run's business, and his. */
const WEAPON_PAIR={pistol:'rifle',rifle:'pistol',smg:'shotgun',shotgun:'smg'};   /* [DIAL] always a short and a long */
function altWeapon(){ const w=(typeof WEAPON!=='undefined')?WEAPON:'pistol';
  return G.wpnAlt||WEAPON_PAIR[w]||'rifle'; }
function doSwap(){ if(G.phase!=='cover'||G.over||G.inc)return;
  const from=WEAPON, to=altWeapon();
  if(to===from)return;
  audio();
  G.wpnAlt=from; WEAPON=to;
  G.runArm=false; G.grenArm=false; G.sprintArm=false; G.dashArm=false;   /* one thing at a time */
  try{updSwapBtn();}catch(_e){} try{updGrenBtn();}catch(_e){} try{updRunBtn();}catch(_e){}
  const R=maxRange(wpnRange(to));
  setRead('SWAPPED TO '+to.toUpperCase(),'reaches '+Math.round(R)+' tiles \\u2014 the swap was your turn','#c0d0e8');
  /* THE COST: your turn. You stayed tucked, so this is the same exposure WAIT
     takes -- only men you have no cover from can reach you. */
  endTurnReturn(false); }
function updSwapBtn(){ const b=D('swapbtn'); if(!b)return;
  const to=altWeapon();
  b.textContent=(to||'').slice(0,5).toUpperCase();
  b.disabled=(G.phase!=='cover')||!!G.over;
  b.style.opacity=b.disabled?'0.45':'1';
  b.title='swap to '+to; }
function doRun(){ if(G.phase!=='cover'||G.over||G.inc)return;"""
    js = subN(js, old, new)

    # ---- 2. the button, in the thumb row -------------------------------
    old = """  mk('grenbtn2','GREN','#c8a23a',48,()=>{ try{audio();}catch(_e){} doThrow(); });"""
    new = """  mk('grenbtn2','GREN','#c8a23a',48,()=>{ try{audio();}catch(_e){} doThrow(); });
  /* V149: the third thumb button, under GREN, in the corner his hand is already
     in. It names the gun it will put in his hands, not the word SWAP, because
     the useful information is WHICH gun -- he is choosing a range, not an
     action. */
  mk('swapbtn','ALT','#9ab4d0',90,()=>{ try{audio();}catch(_e){} doSwap(); });"""
    js = subN(js, old, new)

    # ---- 3. it disables with the rest of the toolkit --------------------
    old = """  for(const _id of ['suppressbtn','peekbtn','runbtn','grenbtn2']){ const _b=D(_id); if(_b)_b.disabled=aim||G.over; }"""
    new = """  for(const _id of ['suppressbtn','peekbtn','runbtn','grenbtn2','swapbtn']){ const _b=D(_id); if(_b)_b.disabled=aim||G.over; }
  try{updSwapBtn();}catch(_e){}"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v149: two guns, and the swap costs the beat -- %d chars' % len(js))


if __name__ == '__main__':
    main()
