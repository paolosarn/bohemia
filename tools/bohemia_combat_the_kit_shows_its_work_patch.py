#!/usr/bin/env python3
"""
V194 THE KIT SHOWS ITS WORK -- RF4-14, the row the teardown itself says was never
measured, measured; and the answer is that a third of every fight is a dead turn.

  PAOLO 8/27: "we are trying to create the best funnest DEEPEST videogame ever."

RF4-14 is the row the teardown calls "the single most important line in RF4's
design notes", and its own status cell reads: "NOT MEASURED, AND IT IS THE RIGHT
QUESTION TO ASK OF OUR FIGHT. This is the test for whether a fight is dense or
flat." Wang's rule, verbatim: "there is almost never a turn in which the player is
not either USING AN ABILITY or MOVING INTO POSITION to use an ability in the next
turn or two."

-------------------------------------------------------------------------
MEASURED, 594 REAL TURNS ACROSS 30 FIGHTS, THROUGH THE SHIPPED VERBS
-------------------------------------------------------------------------
  turns with an ability up                 55.7%
  turns with ground worth taking           17.8%
  turns with EITHER                        64.0%   <- RF4 says "almost never" not
  turns with NEITHER                       36.0%      one of these. Ours is a third.
  turns where you could simply shoot       96.1%
  turns that were shoot-or-walk and nothing else  20.2%

*** AND THE CADENCE TABLE IS WORSE THAN THE AVERAGE. *** Turns to charge, measured
per ability from the real firing rate of its own verb:

  READ THE ROOM   3.7      SEND HIM  4.2     LIGHT IT  4.6
  PLATE UP        7.7      STEADY    8.5     PATCH IT  8.9    CALL IT  9.6
  SLIP           18.3
  BREAK CONTACT  23.1  <-- IN A FIGHT THAT LASTS ABOUT TWENTY TURNS

A 6.2x spread, and the slowest ability needs MORE TURNS THAN A FIGHT HAS. BREAK
CONTACT is not rare, it is NOT IN THE GAME -- the sixth thing this month that
shipped, worked, and could not be reached. Its own gate arm exists precisely
because the first write of V185 left its verb with no caller at all; the verb has
a caller now and the ECONOMY still put it out of reach, which no structural check
could ever have seen.

-------------------------------------------------------------------------
AND THE BEST IDEA IN THE KIT HAS ALWAYS BEEN INVISIBLE
-------------------------------------------------------------------------
V185's whole design is "RECHARGE CONDITIONS ARE VERBS, NOT TIMERS -- the kit tells
you how the game wants to be played." *** THE PLAYER HAS NEVER BEEN ABLE TO SEE
IT. *** updKit draws a button only once an ability is READY, so the charge, the
condition and the progress have been a private conversation between the engine
and itself since the day it shipped. You cannot play toward something you cannot
see, which turns every one of those 36% dead turns into a shrug instead of a
choice.

Same shape as every other find this week: the depth was already there and the
screen would not say so.

  * AN ABILITY THAT HAS STARTED CHARGING IS ON THE ROW, dim, with its count and
    THE THING IT WANTS in plain words -- "BREAK CONTACT 2/3 - cover ground".
  * ONE THAT HAS NOT STARTED IS STILL ABSENT. The row is empty at the bell and
    fills as the fight develops; nine buttons at the bell is the furniture he has
    asked five separate times to have taken off this screen.
  * PRESSING A COLD ONE SAYS WHAT IT NEEDS instead of doing nothing, because a
    button that ignores a tap is indistinguishable from a broken button -- the
    demo gap list calls that out by name.
  * AND BREAK CONTACT IS REACHABLE: need 3 -> 1, which is 23.1 turns -> 7.7. NOT
    A GUESS: it is the measured firing rate of its own verb times the cadence the
    rest of the kit already runs at.

NO DAMAGE BEFORE THE DIAL: draws a row and changes one charge threshold. Not one
damage, accuracy, hp, armour, range or resource number moves, and no ability's
EFFECT changes at all.

MECHANISM MINE, CONTENTS HIS: the row and the threshold are mechanism. The verb
phrases are WORDS, so they ship as a real attempt tagged draft:true.

REUSE CHECK: cooks no graphic pixels and opens no bank. It is V185's own kit row,
V185's own charge counter and V185's own kitDef table, drawn instead of hidden.

TASTE CHECK: no new HUD, no new row, no new button. The same row that already
appears and disappears on its own, now with the fight's progress in it.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V194 THE KIT SHOWS ITS WORK'


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
        print('v194: already applied')
        return
    if 'V191 THE KIT GROWS' not in d:
        sys.exit('v194 needs v191 -- run the kit grows patch first')

    # ---- 1. THE ONE THAT WAS OUT OF REACH ----
    d = sub(d,
        "  {id:'smoke', n:'BREAK CONTACT', verb:'move2', need:3, draft:true,",
        """  /* *** V194: need 3 -> 1, AND THE NUMBER IS MEASURED, NOT PICKED. *** Its
     verb fires 0.130 times a turn in real play, so at need 3 this button took
     23.1 TURNS TO CHARGE IN A FIGHT THAT LASTS ABOUT TWENTY. It was not rare,
     it was NOT IN THE GAME -- the sixth thing this month that shipped, worked
     and could not be reached, and the first one no structural check could ever
     have caught, because the defect was in the ECONOMY and not in the wiring.
     At 1 it is 7.7 turns, which is the cadence the rest of the kit already
     runs at. */
  {id:'smoke', n:'BREAK CONTACT', verb:'move2', need:1, draft:true,""",
        what='break contact is reachable')

    # ---- 2. WHAT EACH ONE IS WAITING FOR, IN WORDS ----
    d = sub(d,
        "function kitDef(id){ for(const k of KIT)if(k.id===id)return k; return null; }",
        """/* ===== V194 THE KIT SHOWS ITS WORK ================================
   V185's whole design is "RECHARGE CONDITIONS ARE VERBS, NOT TIMERS -- the kit
   tells you how the game wants to be played", and THE PLAYER HAS NEVER BEEN
   ABLE TO SEE IT: updKit drew a button only once an ability was READY, so the
   condition and the progress were a private conversation between the engine and
   itself from the day it shipped.
   MEASURED, 594 real turns: 36% of turns had NO ability up and NO ground worth
   taking. RF4-14, the row the teardown calls the single most important line in
   RF4's design notes, says "there is almost never a turn in which the player is
   not either using an ability or moving into position to use an ability in the
   next turn or two." A third of our turns is not almost never.
   YOU CANNOT PLAY TOWARD SOMETHING YOU CANNOT SEE. Showing the charge turns a
   dead turn into a choice about which verb to feed, and it costs no new
   mechanic -- the counter has been there since V185, unread.
   [draft:true] on every phrase: these are WORDS. */
const KIT_WANTS={
  hit:   'take a hit',
  move2: 'cover ground',
  cover: 'get behind stone',
  kill:  'put a man down',
  shot:  'fire',
  open:  'stand where they see you',
  quiet: 'break their line on you',
  dark:  'be out after dark',
  close: 'let one get near'
};
function kitWants(verb){ return KIT_WANTS[verb]||'keep playing'; }
function kitCharge(id){ return ((G.kit&&G.kit[id])||0); }
function kitDef(id){ for(const k of KIT)if(k.id===id)return k; return null; }""",
        what='what each one wants')

    # ---- 3. THE ROW DRAWS THE FIGHT'S PROGRESS ----
    d = sub(d,
        """function updKit(){ const row=D('kitrow'); if(!row)return;
  let h='';
  for(const k of KIT) if(kitOwned(k)&&kitReady(k.id))   /* V191 */
    h+='<button class="cbtn kitb" data-kit="'+k.id+'" style="border-color:#8fe89a;color:#8fe89a">'+k.n+'</button>';
  row.innerHTML=h; }""",
        """function updKit(){ const row=D('kitrow'); if(!row)return;
  let h='';
  for(const k of KIT){
    if(!kitOwned(k))continue;                                  /* V191 */
    if(kitReady(k.id)){
      h+='<button class="cbtn kitb" data-kit="'+k.id+'" style="border-color:#8fe89a;color:#8fe89a">'+k.n+'</button>';
      continue; }
    /* ===== V194: AND ONE THAT HAS STARTED IS ON THE ROW, DIM, WITH ITS COUNT
       AND THE THING IT WANTS. One that has NOT started stays absent, so the row
       is empty at the bell and fills as the fight develops -- nine buttons at
       the bell is exactly the furniture he has asked five separate times to have
       taken off this screen. */
    const c=kitCharge(k.id); if(c<=0)continue;
    const need=Math.max(1,k.need-(G.perkKit||0));
    h+='<button class="cbtn kitb" data-kit="'+k.id+'" style="border-color:#4a5c48;color:#7a8a76;opacity:0.85">'
      +k.n+' <span style="opacity:0.8">'+c+'/'+need+'</span>'
      +'<span style="opacity:0.6"> \\u00b7 '+kitWants(k.verb)+'</span></button>'; }
  row.innerHTML=h; }""",
        what='the row shows its work')

    # ---- 4. AND A COLD BUTTON SAYS WHAT IT NEEDS ----
    d = sub(d,
        "function useKit(id){\n  if(G.over||G.inc||!kitReady(id))return false;",
        """function useKit(id){
  if(G.over||G.inc)return false;
  /* V194: A BUTTON THAT IGNORES A TAP IS INDISTINGUISHABLE FROM A BROKEN BUTTON
     -- the demo gap list names that as the sharp one, in those words. A cold
     ability says what it is waiting for instead of doing nothing. */
  if(!kitReady(id)){ const _k=kitDef(id);
    if(_k&&kitOwned(_k)&&kitCharge(id)>0)try{
      setRead(_k.n+'  '+kitCharge(id)+'/'+Math.max(1,_k.need-(G.perkKit||0)),
        'it wants you to '+kitWants(_k.verb),'#8a7d66'); }catch(_e){}
    return false; }""",
        what='a cold button says what it needs')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v194: the kit shows its work -- %d chars' % len(d))


if __name__ == '__main__':
    main()
