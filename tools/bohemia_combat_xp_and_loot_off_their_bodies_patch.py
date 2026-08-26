#!/usr/bin/env python3
"""
V181 EXPERIENCE AND LOOT OFF THEIR BODIES -- RF4-36, his ruling, 8/25.

  PAOLO, 8/25/26, asked "when you win a fight, what do you get?":
  "YOU GET EXPERIENCE AND LOOT OFF THEIR BODIES FUCK YOU MEAN?"

That is a RULING and it lands on a machine that was already three quarters built
and had been waiting on exactly this answer:

  * THE GHOST CHIP (Paolo 7/3) is a gold experience mote that already ARCS FROM
    THE BODY INTO YOU, drawn, glowing, trailing. Its own comment says "the green
    meter is XP-bound later; this is its currency in flight."
  * A readout on every walk says, in these words, "yours now -- LOOT COMES LATER".
  * EXEC_XP_PCT is 0.03 -- HIS number from 8/2, "+2% or +3%" for finishing a man
    on the floor -- and it was the ONLY thing in the game that paid experience.
  * dropRounds/sweepDrops already put a pile on the tile a man fell on and hand it
    over when you walk there. "The dead are the supply."
  * `[real XP numbers PENDING Paolo]` is sitting in the receipt code.

So this is not a new system. It is the other end of a wire that has been live
since 7/3.

*** AND "OFF THEIR BODIES" IS THE LOAD-BEARING PHRASE. *** He did not say you get
experience for winning. He said you get it OFF THEIR BODIES. So it sits on the
corpse and you WALK TO IT -- which is what the ghost chip has been drawing all
along, and what dropRounds already does for ammunition. A kill you never walk to
pays nothing. That is a real decision on the floor rather than a number that
lands in a menu, and it is exactly the geometry RF4-18 and RF4-48 are about.

AND IT LOCKS INTO V180, WHICH SHIPPED HOURS AGO. The body is lying where you shot
him -- frequently on open ground, under their eyes, which is the state V180 now
pays you for standing in and 56% of which have a gun that can reach you. Going to
collect is the risk. The loop closes on itself without a single new rule.

*** A DEFECT FOUND ON THE WAY IN: FIVE OF SIX DEATHS DROPPED NOTHING. ***
dropRounds had exactly ONE caller -- the pistol lethality roll. A man killed by a
grenade, by a car cooking off, by an execution, or by an incidental hit left an
empty tile. "The dead are the supply" was true of one death in six. Every death
now goes through ONE owner, bodyFell(), so a body is a body however it fell.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy, hp or armour number moves.
Experience is not damage and loot carries no combat effect.

MECHANISM MINE, CONTENTS HIS: the pile, the walk, the sweep and the ledger are
mechanism. The item NAMES are WORDS, so under the 8/11 amendment they ship as a
real attempt tagged draft:true rather than as a blank list he would have to fill
from nothing. Every number is a [DIAL].

REUSE CHECK: cooks no graphic pixels and opens no bank. The pile is G.drops, the
shape dropRounds already pushes; the walk-over is sweepDrops, already called after
every world move; the marker on the tile is already drawn (V157 reused the grenade
marker byte for byte); the ledger is G.ledger/G.rc, which execXP already fills.
Nothing is drawn and nothing is stored that did not already exist.

TASTE CHECK: no new button, no new HUD, no menu. One readout line when you pick a
body clean, in the same voice as PICKED UP.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V181 EXPERIENCE AND LOOT OFF THEIR BODIES'


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
        print('v181: already applied')
        return

    # ---- 1. THE PILE, THE WORTH, AND ONE OWNER FOR EVERY DEATH ----
    d = sub(d,
        "/* the dead are the supply */\nfunction dropRounds(e){",
        """/* ===== V181 EXPERIENCE AND LOOT OFF THEIR BODIES (RF4-36) ==========
   PAOLO 8/25, asked what a fight is worth: "YOU GET EXPERIENCE AND LOOT OFF
   THEIR BODIES FUCK YOU MEAN?"
   THE WIRE WAS ALREADY LIVE AT THE OTHER END. The ghost chip (7/3) is a gold
   experience mote that ARCS FROM THE BODY INTO YOU and says in its own comment
   "the green meter is XP-bound later"; the walk readout has promised "yours now
   -- LOOT COMES LATER" for weeks; EXEC_XP_PCT is his 8/2 number and was the only
   thing in this game that paid experience at all.
   "OFF THEIR BODIES" IS THE LOAD-BEARING PHRASE. Not experience for winning --
   experience off the corpse, which means you WALK TO IT, which is what the chip
   has been drawing and what the ammunition pile already did. A kill you never
   walk to pays nothing. That is a decision on the floor instead of a number in a
   menu, and it closes a loop with V180 from this morning: the body is lying
   where you shot him, often on open ground under their eyes -- the state V180
   pays for and where 56% of turns have a gun that can reach you.
   MECHANISM MINE, CONTENTS HIS: the pile, the walk and the ledger are mine. The
   NAMES are WORDS, so they ship as a real attempt tagged draft:true (8/11)
   rather than an empty list he would have to write from nothing. */
const KILL_XP_PCT=0.25;   /* [DIAL] a body is worth a quarter of what it took to put down */
const LOOT_CHANCE=0.55;   /* [DIAL] not every man is carrying something */
/* WORDS, NOT CANON. Every one of these is an attempt he can rewrite; the
   mechanism does not care what they are called. Post-crash Vegas, taken off a
   man who was alive ten seconds ago -- small, specific and worth nothing to
   anybody but you. draft:true says he has not approved a syllable of it. */
const LOOT_TABLE=[
  {n:'a folded twenty',            draft:true},
  {n:'half a pack of smokes',      draft:true},
  {n:'a keyring, nobody\\'s house', draft:true},
  {n:'a phone, cracked, still warm',draft:true},
  {n:'painkillers, four left',     draft:true},
  {n:'a photo of somebody\\'s kids', draft:true},
  {n:'un rosario, worn smooth',    draft:true},
  {n:'a casino chip, off-strip',   draft:true}
];
function lootRoll(){
  if(Math.random()>=LOOT_CHANCE)return null;
  return LOOT_TABLE[Math.floor(Math.random()*LOOT_TABLE.length)]; }
/* *** ONE OWNER FOR EVERY DEATH, AND FIVE OF SIX HAD NONE. ***
   dropRounds had exactly ONE caller: the pistol lethality roll. A man killed by a
   grenade, by a car cooking off, by an execution or by an incidental hit left an
   EMPTY TILE. "The dead are the supply" was true of one death in six, and it had
   been that way since V157 shipped. Every death goes through here now, so a body
   is a body however it fell. */
function bodyFell(e){
  if(!e)return;
  try{ dropRounds(e); }catch(_x){}
  G.drops=G.drops||[];
  const worth=Math.max(1,Math.round((e.max||60)*KILL_XP_PCT));
  const it=lootRoll();
  G.drops.push({ea:e.ea, edist:e.edist, lvl:(e.lvl|0), n:0,
                xp:worth, loot:(it?it.n:null), draft:!!(it&&it.draft),
                _at:performance.now()}); }
/* the dead are the supply */
function dropRounds(e){""",
        what='bodyFell')

    # ---- 2. WALKING OVER IT TAKES IT ----
    d = sub(d,
        """    if((d.lvl|0)===myLvl() && d.edist<=PICKUP_R){
      spareRounds(); G.spare+=d.n; got++; rounds+=d.n; }
    else keep.push(d); }
  G.drops=keep;
  if(got){ try{audio();}catch(_e){}
    setRead('PICKED UP',rounds+' round'+(rounds>1?'s':'')+' off the ground','#8fe89a');
    try{updAmmoRead();}catch(_e){} }
  return rounds; }""",
        """    if((d.lvl|0)===myLvl() && d.edist<=PICKUP_R){
      if(d.n){ spareRounds(); G.spare+=d.n; rounds+=d.n; }
      /* V181: THE EXPERIENCE IS ON THE BODY, which is his sentence -- "off their
         bodies" -- and it is what the 7/3 ghost chip has been drawing since long
         before anything caught it at this end. */
      if(d.xp){ G.ledger=G.ledger||{}; G.ledger.xp=(G.ledger.xp||0)+d.xp;
                G.rc=G.rc||{}; G.rc.xp=(G.rc.xp||0)+d.xp; gotXP+=d.xp; }
      if(d.loot){ G.ledger=G.ledger||{}; (G.ledger.loot=G.ledger.loot||[]).push(d.loot);
                  G.rc=G.rc||{}; (G.rc.loot=G.rc.loot||[]).push(d.loot); tookLoot.push(d.loot); }
      got++; }
    else keep.push(d); }
  G.drops=keep;
  if(got){ try{audio();}catch(_e){}
    /* ONE LINE, SAME VOICE AS THE OLD ONE. The rounds half is untouched; the
       body half is added to the end of the same sentence rather than shouting
       from a second readout. */
    const bits=[];
    if(rounds)bits.push(rounds+' round'+(rounds>1?'s':''));
    if(gotXP)bits.push('+'+gotXP+' XP');
    if(tookLoot.length)bits.push(tookLoot.join(', '));
    setRead(tookLoot.length||gotXP?'OFF THE BODY':'PICKED UP',
      (bits.join('  ·  ')||'nothing on him')+(rounds&&!gotXP?' off the ground':''),'#8fe89a');
    try{updAmmoRead();}catch(_e){} }
  return rounds; }""",
        what='sweepDrops payout')

    d = sub(d,
        "function sweepDrops(){ if(!G.drops||!G.drops.length)return 0;\n  let got=0, rounds=0, keep=[];",
        "function sweepDrops(){ if(!G.drops||!G.drops.length)return 0;\n  let got=0, rounds=0, keep=[], gotXP=0, tookLoot=[];",
        what='sweepDrops locals')

    # ---- 3. EVERY DEATH GOES THROUGH THE OWNER ----
    d = sub(d,
        "if(_lethalRoll){ tgt.dead=true; try{dropRounds(tgt);}catch(_e){} }",
        "if(_lethalRoll){ tgt.dead=true; try{bodyFell(tgt);}catch(_e){} }   /* V181: was dropRounds, the only death that dropped anything */",
        what='death: lethal roll')

    d = sub(d,
        "if(e.hp<=0){ e.dead=true; killed++; e._deathVar=deathFall(e,'blast',0);",
        "if(e.hp<=0){ e.dead=true; killed++; try{bodyFell(e);}catch(_x){}   /* V181: a man the blast killed is still a body */\n      e._deathVar=deathFall(e,'blast',0);",
        what='death: blast')

    d = sub(d,
        "if(e.hp<=0){ e.dead=true; killed++;\n",
        "if(e.hp<=0){ e.dead=true; killed++; try{bodyFell(e);}catch(_x){}   /* V181 */\n",
        what='death: no-killshot')

    d = sub(d,
        "t.dead=true; t.downed=false; t.broken=false; t.hp=0;",
        "t.dead=true; t.downed=false; t.broken=false; t.hp=0; try{bodyFell(t);}catch(_x){}   /* V181: an execution leaves a body too -- the 3% token is ON TOP of what he was carrying */",
        what='death: execution')

    d = sub(d,
        "if(tgt.hp<=0){ tgt.dead=true; G._noChain=true;",
        "if(tgt.hp<=0){ tgt.dead=true; try{bodyFell(tgt);}catch(_x){} G._noChain=true;   /* V181 */",
        n=2, what='death: incidental x2')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v181: experience and loot off their bodies -- %d chars' % len(d))


if __name__ == '__main__':
    main()
