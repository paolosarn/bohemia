#!/usr/bin/env python3
"""
V211 -- NO TAPE, NO PLATE  (COMBAT lane, [plates cost] BB-THE-FIGHT-EATS-TAPE)

THE ROW: "THE PLATE YOU WEAR AT EVERY BELL IS FREE, AND IT SHOULD COST TAPE. Day 10
measured `G.pp=PLATE_START` every bell -- armour is a consumable that resets for
nothing. In the game he named, TOOLS drain after every fight to fix what the fight
broke, which is the single resource players manage most, and it is spent by the VERB
of fighting, never from a menu. His duct-tape icon IS that resource. So: the plate
reset at the bell is paid in tape from the purse, at 1; no tape, no plate."
SHIP TEST, the row's own: "the bell debits one tape AND a purse at zero rings with no
plate."

*** MEASURED ON THE REAL SURFACE FIRST, AND HALF THE ROW WAS ALREADY BUILT BY
    ANOTHER LANE. *** Driven through the shipped door with the pocket emptied:
      the purse's verb    fight:plate spends `resources`, amount 1
      at zero             REFUSED: {applied:false, reason:INSUFFICIENT, have:0,
                          wanted:1, short:1} -- the refusal machinery exists
      the debit           ALREADY HAPPENS, in the city's own handler when the fight
                          comes home ("the plate you wore at the bell is spent", live
                          since 8/21, and four_verbs_gate asserts the city posts it)
      THE BELL            *** pp:1 WITH AN EMPTY POCKET. *** PLATE_START=1,
                          G.pp=PLATE_START in cleanSlate, unconditional
      the fight blob      ZERO mentions of purse, tape or fight:plate. It has never
                          been able to ask.
SO THE HALF THAT WAS MISSING IS THE HALF THAT MAKES IT A COST RATHER THAN A TAX: the
plate was handed over whether you could pay for it or not. A bill you always pay and
never fail is not a resource you manage.

*** AND THE BELL DELIBERATELY DOES NOT DEBIT, WHICH IS A DEPARTURE FROM THE ROW'S
    OWN SENTENCE AND IS NAMED HERE RATHER THAN HIDDEN. *** The debit is built,
    shipped, owned by the purse lane and held by its own gate. A second debit at the
    bell would charge you TWICE for one plate, which is a worse bug than charging at
    the wrong end of the fight. THE BELL READS, THE EXISTING HANDLER SPENDS. The
    row's intent -- the plate is not free, and no tape means no plate -- is met whole.

*** THE AMOUNT IS NEVER WRITTEN DOWN ANYWHERE IN THIS PATCH. *** The door does not
    ask "is have >= 1", because that would copy his 8/15 ONE into a second place and
    a copy is a thing that drifts. It builds a THROWAWAY purse holding exactly what
    you hold, runs the purse's OWN upkeep('fight:plate') on it, and reads the answer.
    The real purse is never touched. If he ever tunes the one to a two, the bell's
    refusal follows by itself and nothing here has to be edited -- and the gate
    proves that by tuning it and watching the bell change its mind.

WHAT HAPPENS AT THE BELL, and every branch is a state the game already reaches:
    CAN PAY          nothing changes. The plate is exactly what it always was.
    CANNOT PAY       G.pp=0. Not a new number: a plate that cracks already leaves 0
                     and the fight has a readout for it ("PLATE GONE").
    NO STAMP         nothing changes. A fight that did not come from the city cannot
                     know your purse, and inventing "no plate" on the test bench
                     would punish the bench for a wire it has no access to.
    THE LESSON       nothing changes. The teaching fight is never made harder by an
                     empty pocket -- the same stand-down V207 wrote for the same
                     reason.

*** AND THE RESET THE ROW ASSUMED ALREADY EXISTED DOES NOT. MEASURED ON CLEAN MAIN,
    BEFORE ANY OF THIS, SO IT IS NOT MINE. *** The row quotes day 10: "G.pp=PLATE_START
    runs at the top of every fight, so plates crack and come back full at the next
    bell." THAT IS ONLY TRUE ON THE TEST BENCH. The line lives in resetFightState,
    which V107 wrote for exactly this class of bug -- its own comment is "EVERY
    PER-FIGHT FIELD LIVES HERE NOW, and both doors call it" -- and THE CITY IS A THIRD
    DOOR THAT CALLS NEITHER.
    DRIVEN TWICE through a real street bump with the plate cracked to 0 in between:
      fight 2 from the city   pp 0, against PLATE_START 1, kit sentinel SURVIVED
      NEW ENCOUNTER (bench)   pp 1, kit cleared -- the reset works where it is called
    So armour has never come back at a real bell, and "the plate you wear at every
    bell is FREE" describes the bench, not the game. YOU HAVE TO BUILD THE RESET TO BE
    ABLE TO CHARGE FOR IT, which is why this row carries both halves.
    AND THE SAME HOLE IS LEAKING MORE THAN THE PLATE: the kit survives a city bell and
    so does power. Those are measured and ROUTED, not quietly fixed inside a row about
    armour -- power is a number this lane does not get to move on the way past.

AND THE PLATE PERKS GO WITH IT, WHICH IS A DECISION AND NOT AN OVERSIGHT. applyPerks
runs one line after G.pp=PLATE_START and PLATE CARRIER ("you walk in wearing two")
and WALK IT OFF ("one back at the top of every fight") each add one. Three reasons
they are cancelled too: the row's words are absolute; PLATE CARRIER is the first BODY
perk at level 1, so sparing perks would stop this row biting almost immediately and
leave it decoration; and "no tape, no armour" is a rule a player can say out loud.
The perk is not taken away, it is unpayable for this one fight -- buy one tape and it
is back. AND THE READOUT SAYS HOW MANY YOU LOST, because a thing he cannot know about
does not exist (V210's rule, same lane, last round).

NO DAMAGE BEFORE THE DIAL: no damage value, no hit chance and no roll is authored.
PLATE_START, PP_MAX, applyDamage and every archetype are untouched; the only thing
that moves is how many plates you are handed, between two numbers the game already
uses. The gate fingerprints the damage side and asserts it is identical.
"""
import re
import sys
import base64

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__PLATE_COSTS_TAPE__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:160]))
    return src.replace(old, new, n)


CITY_BLOCK = r"""/* ===== V211 __PLATE_COSTS_TAPE__ -- WHAT A PLATE COSTS, ASKED OF THE PURSE ===
   BB-THE-FIGHT-EATS-TAPE. The fight has never been able to ask: the decoded combat
   source has zero mentions of the purse. This is the question, asked on the city
   side where the purse lives, and stamped on the one door V205 built so all four
   ways into a fight carry it.

   *** THE AMOUNT IS NOT WRITTEN HERE AND MUST NEVER BE. *** Asking "is the balance
   at least one" would copy his 8/15 ONE into a second place, and a copy drifts the
   day he tunes it. So this builds a THROWAWAY purse holding exactly what you hold
   and runs the purse's OWN upkeep('fight:plate') on it. The answer is the purse's,
   the currency is read off the purse's own verb table, and your real purse is never
   touched -- nothing here debits anything. The spend still happens where it already
   happened, in the handler that fires when the fight comes home. */
function cityPlateNow(){
  try{
    if(typeof BohemiaPurse==='undefined'||!BohemiaPurse)return null;
    var v=(BohemiaPurse.VERBS||{})['fight:plate']; if(!v)return null;
    var p=purseGet(); if(!p)return null;
    var have=BohemiaPurse.balance(p, v.currency);
    /* the dry run: the purse's own refusal, on a purse that is not yours */
    var probe=BohemiaPurse.create({id:'plate-dryrun', day:0});
    if(have>0)BohemiaPurse.credit(probe, v.currency, have, 'plate:dryrun', null, 0);
    var r=BohemiaPurse.upkeep(probe, 'fight:plate', null, 0);
    return {can:!!(r&&r.applied), have:have, wanted:(r&&r.wanted!=null)?r.wanted:null,
            short:(r&&r.short!=null)?r.short:null, why:(r&&r.reason)||null,
            currency:v.currency, verb:'fight:plate', about:v.about,
            from:'BohemiaPurse.upkeep', draft:true};
  }catch(_e){ return null; }
}
/* ===== /V211 __PLATE_COSTS_TAPE__ ===== */
"""

BLOB_BLOCK = r"""
/* ===== V211 __PLATE_COSTS_TAPE__ -- NO TAPE, NO PLATE =======================
   BB-THE-FIGHT-EATS-TAPE. G.pp=PLATE_START ran at every bell whether you could pay
   for it or not: measured on the real surface at pp:1 with the pocket emptied. The
   purse already refuses (INSUFFICIENT, have 0, wanted 1) and the city already spends
   when the fight comes home. The only thing missing was the fight ASKING.

   Its own message, for V200's and V207's reason: the handoff core is a shared engine
   module and a new field in its contract would make this an engine change. G.plate
   is not in BASE or EMPTY, so cleanSlate leaves it alone, exactly like G.cityRoom
   and G.world. */
try{ addEventListener('message',function(ev){
  var q=ev&&ev.data; if(!q||q.type!=='BOHEMIA_FIGHT_PLATE')return;
  G.plate=q.plate||null; }); }catch(_e){}
/* *** AND THE RESET THE ROW ASSUMED ALREADY EXISTED DOES NOT, MEASURED ON CLEAN
   MAIN BEFORE ANY OF THIS. *** The backlog says "G.pp=PLATE_START runs at the top of
   every fight, so plates crack and come back full at the next bell". IT IS ONLY TRUE
   ON THE TEST BENCH. That line lives in resetFightState, which V107 wrote for exactly
   this class of bug ("EVERY PER-FIGHT FIELD LIVES HERE NOW, and both doors call it"),
   and the CITY IS A THIRD DOOR THAT CALLS NEITHER. Driven twice through a real street
   bump with the plate cracked to 0 in between: fight two started with 0 plates against
   a PLATE_START of 1, while NEW ENCOUNTER on the bench correctly gave it back. So
   armour has never come back at a real bell, and the row's own framing -- "the plate
   you wear at every bell is FREE" -- describes the bench and not the game. You have to
   build the reset to be able to charge for it.
   WHAT A BELL OWES YOU, with no perk list duplicated here: applyPerks is idempotent
   for everything EXCEPT pp and power (it zeroes perkCarry, perkLegs, perkFinish and
   perkKit first, but the plate and power perks ADD), so the base pair plus the game's
   own perk applies IS the answer. Power is put straight back: the same missing reset
   is leaking power, the kit and the grenade too, and those are measured and routed
   rather than quietly changed inside a row about armour. */
function plateOwed(){
  var _pow=G.power;
  G.pp=PLATE_START; G.power=POWER_BASE;
  try{ applyPerks(); }catch(_e){}
  G.power=_pow;
  return G.pp|0; }
/* THE BELL. Every branch below is a state the game already reaches, and the amount
   is never read here -- the door asked the purse and this honours the answer. */
function plateAtBell(){
  var owed=plateOwed();                    /* the reset that never happened at a real bell */
  var q=G.plate;
  /* NO STAMP, NO CHANGE beyond the reset: a fight that did not come from the city
     cannot know your purse, and the bench already ran the real reset anyway, so this
     hands it the same number it was already holding. */
  if(!q||G.teachBeat||q.can){ try{ updPP(); }catch(_e){} return null; }
  G.pp=0;                                  /* NOT a new number: a cracked plate already leaves 0 and the fight says PLATE GONE */
  try{ updPP(); }catch(_e){}
  return {lost:owed, have:(q.have|0)};
}
/* AND HE IS TOLD, because armour that quietly is not there is the same as a bug.
   It names the perk plates it cancelled too -- V210's rule, one round old in this
   same lane: a thing he cannot know about does not exist.
   [draft:true] the words are an attempt; WORDS owns them. */
function plateRead(){
  var r=G._plateCut; if(!r)return false;
  if(G.teachBeat)return false;                      /* the lesson owns the readout (V202) */
  /* AND IT DOES NOT STAND DOWN FOR AN OBJECTIVE, which is where V207 was wrong.
     MEASURED: showObjective writes #objchip and never touches the readout, so an
     objective does not own this line and never did. Every city fight carries a
     label, so that stand-down meant V207's own weather line could not speak on ANY
     of the four real entries -- a row that only ever spoke on the test bench. Fixed
     one line down for V207 too, since the premise was the same and it was mine. */
  var tail=(r.lost>1)?('no tape in the purse, so you go in with none of your '+r.lost)
                     :'no tape in the purse, so you go in unarmoured';
  try{ setRead('NO PLATE', tail, '#e8593a'); }catch(_e){}
  return true; }
/* ===== /V211 __PLATE_COSTS_TAPE__ ===== */
"""


def patch_city(s):
    if MARK in s:
        print('  the city already asks')
        return s, False
    s = sub(s, 'function cityHandOver(msg, skin){',
            CITY_BLOCK + 'function cityHandOver(msg, skin){', 1, 'city/block')
    s = sub(s,
            "  try{ if(msg && !msg.world) msg.world=cityWorldNow(msg.at||null); }catch(_e){}",
            "  try{ if(msg && !msg.world) msg.world=cityWorldNow(msg.at||null); }catch(_e){}\n"
            "  /* V211 " + MARK + ": AND WHAT A PLATE COSTS RIDES THE SAME DOOR, for the\n"
            "     same reason V207 put the hour on it -- one place, and an entry built after\n"
            "     this one gets it without knowing it exists. */\n"
            "  try{ if(msg && !msg.plate) msg.plate=cityPlateNow(); }catch(_e){}",
            1, 'city/stamp')
    return s, True


def patch_shell(s):
    if MARK in s:
        print('  the shell already forwards it')
        return s, False
    s = sub(s,
            "      world:(d&&d.world)||null});   /* V207 __FIGHT_KNOWS_DAY__: the hour, the weather and the shade */",
            "      world:(d&&d.world)||null,   /* V207 __FIGHT_KNOWS_DAY__: the hour, the weather and the shade */\n"
            "      plate:(d&&d.plate)||null});   /* V211 " + MARK + ": and whether you can pay for the plate */",
            1, 'shell/forward')
    s = sub(s,
            "  combatPost({type:'BOHEMIA_FIGHT_WORLD',world:(spec.world||null)});",
            "  combatPost({type:'BOHEMIA_FIGHT_WORLD',world:(spec.world||null)});\n"
            "  /* V211 " + MARK + ": the same shape again, and the same reason -- its own\n"
            "     message, so the shared handoff contract stays untouched. */\n"
            "  combatPost({type:'BOHEMIA_FIGHT_PLATE',plate:(spec.plate||null)});",
            1, 'shell/post')
    return s, True


def patch_blob(blob):
    if MARK in blob:
        print('  the fight already asks')
        return blob, False

    # 1. the block, declared beside V207's, whose rail and stand-downs it reuses
    blob = sub(blob, '/* ===== /V207 __FIGHT_KNOWS_DAY__ ===== */',
               '/* ===== /V207 __FIGHT_KNOWS_DAY__ ===== */' + BLOB_BLOCK.rstrip() + '\n',
               1, 'blob/block')

    # 2. the bell, at the TOP of afterSetup so the pip is never drawn wrong and then
    #    corrected, and before the board reads the player
    blob = sub(blob,
               "  afterSetup:function(){\n"
               "    try{updateGeomCover();}catch(_e){}",
               "  afterSetup:function(){\n"
               "    /* V211 " + MARK + ": THE BELL ASKS WHETHER YOU COULD PAY FOR THE PLATE,\n"
               "       first, before anything draws -- a pip that shows one and then changes to\n"
               "       none is a worse lie than no pip. cleanSlate has already handed out\n"
               "       PLATE_START and run applyPerks by this point, which is exactly why this\n"
               "       reads G.pp rather than PLATE_START: what it cancels is what you were\n"
               "       actually holding. */\n"
               "    try{ G._plateCut=plateAtBell(); }catch(_e){ G._plateCut=null; }\n"
               "    try{updateGeomCover();}catch(_e){}",
               1, 'blob/bell')

    # 3a. V207's OWN stand-down was wrong, found while building this row and fixed
    #     here because it is the same premise and the same lane. The objective lives
    #     in #objchip; it never owned the readout. Every city entry carries a label,
    #     so this one condition is why the weather line has never spoken on a real
    #     entry -- measured, not reasoned.
    blob = sub(blob,
               "  if(G._ctx&&G._ctx.objective)return false;         /* his objective owns it */",
               "  /* V211 " + MARK + ": THIS CONDITION WAS WRONG AND IT SILENCED THIS WHOLE\n"
               "     ROW. showObjective writes #objchip and never touches the readout, so an\n"
               "     objective does not own this line. Every city fight carries a label, so\n"
               "     the weather has never spoken on any of the four real entries -- it only\n"
               "     ever spoke on the test bench, which is where I measured it. Found while\n"
               "     building [plates cost], whose own line was being eaten the same way.\n"
               "     The teaching fight's stand-down is the line above and it stays. */",
               1, 'blob/v207read')

    # 3b. the readout, sharing V207's precedence: ONE line, and the louder one wins
    blob = sub(blob,
               "    try{worldRead();}catch(_e){} },",
               "    /* V211 " + MARK + ": and NO PLATE outranks the weather, because it is the\n"
               "       line he can act on (buy a tape) and the weather is one he cannot. Never\n"
               "       two lines: V207's own rule, applied to V207. */\n"
               "    try{ if(!plateRead())worldRead(); }catch(_e){} },",
               1, 'blob/read')
    return blob, True


def main():
    city = open(CITY, encoding='utf-8').read()
    city, c1 = patch_city(city)
    if c1:
        open(CITY, 'w', encoding='utf-8').write(city)

    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('no COMBAT_B64')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    blob, c2 = patch_blob(blob)
    if c2:
        s = s[:m.start(1)] + base64.b64encode(blob.encode('utf-8')).decode('ascii') + s[m.end(1):]

    # the shell check has to ignore the blob, whose own mark is inside the base64
    shell_only = s[:m.start(1)] + s[m.end(1):]
    if MARK in shell_only:
        print('  the shell already forwards it')
        c3 = False
    else:
        s, c3 = patch_shell(s)

    if c2 or c3:
        s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
                   r'\g<1>BUILD 9/13f - NO TAPE, NO PLATE\g<2>', s, count=1)
        open(ALPHA, 'w', encoding='utf-8').write(s)
        print('V211 applied to', ALPHA)
    if c1:
        print('V211 applied to', CITY)


if __name__ == '__main__':
    main()
