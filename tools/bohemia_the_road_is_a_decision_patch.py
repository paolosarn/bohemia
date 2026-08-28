#!/usr/bin/env python3
"""
THE ROAD IS A DECISION
(8/27/26, RUN lane. And it corrects something I wrote this morning.)

    laws/BOHEMIA_ADDENDUM_FAST_TRAVEL_IS_A_JOURNEY_8_24_26.md, its own test:
    "Did something happen between leaving and arriving that COULD HAVE GONE
     DIFFERENTLY, and did what he did beforehand change it?
     If no, it is a loading screen wearing a costume."

    And the approved roster's first principle:
    "VARIETY IS A DIFFERENT VERB, NEVER A BIGGER HP BAR."

THE ROAD INTERRUPTS SHIPPED THIS MORNING AND EVERY ENCOUNTER HAD THE SAME VERB:
read a card, tap KEEP MOVING. Twelve different things happen to you on the way
across the valley and you do the identical thing to all twelve. That is a
notification system, not a journey.

=== I WAS WRONG THIS MORNING AND THIS IS THE CORRECTION ====================

I wrote, in the record and the commit and the handoff:

    "A real fork needs a real downside for pushing through, and the downside of
     walking into a feral dog pack is DAMAGE. NO DAMAGE BEFORE THE DIAL. So this
     does not ship a fake choice."

The reasoning was sound and THE PREMISE WAS WRONG. I had framed the fork as PUSH
THROUGH versus GO AROUND, where one arm is free and the other costs, so the free
arm needs a hidden price to make it a decision -- and that price is damage.

*** BUT A FORK DOES NOT NEED DAMAGE IF BOTH ARMS COST SOMETHING REAL. ***

    PAY THE TOLL       costs SALVAGE, saves TIME
    GO AROUND          costs TIME, saves SALVAGE

Neither arm is free. Neither arm is strictly better. Which one is right depends
on what you are carrying and how much daylight is left, and BOTH currencies
already exist and are already spent by this game. No damage anywhere.

That is not a workaround for the missing dial. It is the trade the locked spec
actually asks for, in its own reference's words: "You can spend money on
SURVIVING THE ROAD, not just on goods: hire guards, upgrade the transport. The
road is a thing you invest against."

The wrong answer would have been to wait for the dial. It was there the whole
time and I talked myself out of it.

=== EVERY OPTION COMES OUT OF THE ROSTER'S OWN `ends` STRING ================

Not invented. The 12 tokens Paolo approved on 7/27 each carry an `ends` field
saying how that encounter resolves, and four of them describe resolutions that
need no combat at all:

  scavenger_shakedown  ends: 'pay / scare / drop'
      -> PAY HIM (1 salvage) or FACE HIM DOWN (15 min).
         'drop' is the third and it is a kill, so it waits for the dial.
  toll_crew            ends: 'pay / fight / detour'
      -> PAY THE CUT (2 salvage) or GO AROUND (20 min).
         'fight' waits for the dial.
  ghost_robotaxi       ends: 'ride or rush'
      -> GET IN. Two cells of travel for nothing, IN THE CAB'S DIRECTION AND NOT
         HIS -- the verb says "empty cabs still crawling PICKUP LOOPS". The gain
         is free distance; the cost is not choosing where, paid later in the walk
         back. My own gate killed the first cut of this, which was free and pure
         gain and therefore a button rather than a fork.
  patrols_collide      ends: 'world on world', verb: 'join, third-party,
                       LOOT AFTER, or walk on'
      -> LOOT AFTER (+3 salvage, 20 minutes) or WALK ON.
         'join' and 'third-party' are both fights and wait for the dial.

THE OTHER EIGHT KEEP ONE BUTTON AND THE CARD SAYS WHY IN ONE LINE. A dog pack
and a dead security bot resolve by fighting, and this build cannot fight. Saying
that out loud on the card beats inventing a fake verb for them.

=== PAYING IS A TRANSFER, NOT A DRAIN ======================================

The purse's own vocabulary, in its own comments:
    drain     destroyed and gone                 (a HARD SINK)
    transfer  moved to or from another holder    (a SOFT SINK)

A toll crew that takes a cut HAS the cut. The salvage did not stop existing, it
changed hands. So a payment posts `transferOut`, and the ledger stays true about
where the valley's material actually went. Getting this wrong would have been
invisible and would have quietly told the economy that matter evaporates.

=== AND IT DOES NOT BREAK "NOTHING IS EVER TAKEN FROM HIM" =================

This morning's gate holds zero debits on the road, and that claim is about THEFT:
the snatcher's approved 'loss without death' is not built, because a loss you
cannot win back is a tax wearing a mechanic's name.

A TOLL HE CHOSE TO PAY IS NOT A THEFT. So payments carry their own ledger ref
(`roadpay:`) distinct from loot (`road:`), the old claim keeps holding exactly
what it always held, and a new one holds that a payment only ever happens on a
press. Two different facts, two different claims, neither weakened.

=== AND AN OPTION HE CANNOT AFFORD IS SHOWN, NOT HIDDEN ====================

If he has no salvage, PAY THE CUT still appears and refuses with the reason. A
hidden option is a lie about the world: it tells him the toll crew does not take
payment, when the truth is he is broke. He should feel broke.

REUSE CHECK: cooks NO pixels and opens no banks/. The rows are .mrow, the class
the market card already styles; the clock is advance(); the ledger is
bohemia_purse.js. Nothing new is drawn and no second mechanism is added.

Idempotent (marker __THE_ROAD_IS_A_DECISION__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_ROAD_IS_A_DECISION__'

TABLE_OLD = "var ROAD_DIR = null, ROAD_LOG = [], ROAD_TAKEN = 0;"

TABLE_NEW = '''var ROAD_DIR = null, ROAD_LOG = [], ROAD_TAKEN = 0;

/* ''' + MARK + ''' (8/27) -- WHAT YOU CAN ACTUALLY DO ABOUT IT.
   Every option below is read off the token's own approved `ends` string, never
   invented. The costs are TIME and SALVAGE, both of which this game already
   spends, and NEITHER ARM OF ANY FORK IS FREE -- which is the whole reason this
   needs no damage dial. `pay` is in salvage, `min` is minutes of his day, `give`
   is salvage gained, `ride` is a free cell of travel.
   THE ARMS THAT ARE MISSING ARE MISSING ON PURPOSE and the card says so: 'drop',
   'fight', 'join' and 'third-party' are all kills, and NO DAMAGE BEFORE THE DIAL. */
var ROAD_CHOICES = {
  scavenger_shakedown: {
    ends: 'pay / scare / drop',
    opts: [ { a:'pay',   t:'GIVE HIM SOMETHING', pay:1,
               say:'He takes it with both hands and is gone before you look up.' },
            { a:'stare', t:'FACE HIM DOWN', min:15,
               say:'You wait. He works up to it twice and then walks off down the wash.' } ],
    /* draft:true */
    why:'Dropping him is the third way out of this and it is a kill.' },
  toll_crew: {
    ends: 'pay / fight / detour',
    opts: [ { a:'pay',    t:'PAY THE CUT', pay:2,
               say:'The one on the cooler counts it, nods, and waves you through.' },
            { a:'around', t:'GO AROUND', min:20,
               say:'You take the frontage road. It adds a mile and nobody watches you do it.' } ],
    why:'Fighting four of them for a ramp is the third way and it is a fight.' },
  ghost_robotaxi: {
    ends: 'ride or rush',
    /* *** THE COST OF THE CAB IS THAT IT IS NOT GOING WHERE YOU ARE GOING. ***
       The first cut of this was GET IN (free, two cells) against LET IT GO
       (nothing), and MY OWN GATE KILLED IT: an arm that is free and pure gain is
       not a fork, it is a button, and I had just written a header claiming I do
       not ship those. The fix is in the roster's own verb -- "empty cabs still
       crawling PICKUP LOOPS" -- so the cab drives ITS loop, not his. Two cells
       for nothing, in a direction he does not choose, which is a real gamble
       paid in the time it takes to walk back. `blind` is the cost, and it needs
       no damage dial. */
    opts: [ { a:'ride', t:'GET IN', ride:2, blind:1,
               say:'The door shuts. It drives the loop it has always driven, and it is not your loop.' },
            { a:'walk', t:'LET IT GO', 
               say:'It waits its ninety seconds for nobody and pulls off.' } ] },
  patrols_collide: {
    ends: 'world on world',
    opts: [ { a:'loot', t:'WAIT, THEN GO THROUGH IT', min:20, give:3,
               say:'You give it twenty minutes. Whoever won is gone and they left in a hurry.' },
            { a:'walk', t:'WALK ON',
               say:'You keep the wall on your left and neither crew ever looks up.' } ],
    why:'Joining a side, or taking both, are the other two ways and both are fights.' }
};

var ROAD_LASTDIR = null;   /* which way he was going, for the ride */

/* THE PRESS. Costs land here and nowhere else, so there is exactly one place
   that can spend his day or his salvage on the road. */
function roadChoose(ev, act){
  var C = ROAD_CHOICES[ev.id]; if(!C) return null;
  var o = null;
  for(var i=0;i<C.opts.length;i++) if(C.opts[i].a===act) o=C.opts[i];
  if(!o) return null;

  /* AN OPTION HE CANNOT AFFORD REFUSES WITH THE REASON. Hiding it would tell
     him the crew does not take payment, when the truth is he is broke. */
  if(o.pay){
    var have = 0;
    try{ have = BohemiaPurse.balance(purseGet(),'resources'); }catch(_e){}
    if(have < o.pay) return { refused:true, need:o.pay, have:have,
      say:'You do not have it. They can see that you do not have it.' };  /* draft:true */
    try{
      /* A TRANSFER, NOT A DRAIN. The purse's own words: a drain is destroyed and
         gone, a transfer moved to another holder. The crew HAS the cut. */
      BohemiaPurse.transferOut(purseGet(),'resources',o.pay,
        'paid on the road: '+ev.id, 'roadpay:'+ev.seq,
        (typeof DAY!=='undefined'&&DAY.day)?DAY.day:0);
    }catch(_e){}
  }
  if(o.give){
    try{ BohemiaPurse.credit(purseGet(),'resources',o.give,
      'taken on the road: '+ev.id, 'road:'+ev.seq+'b',
      (typeof DAY!=='undefined'&&DAY.day)?DAY.day:0); ROAD_TAKEN+=o.give; }catch(_e){}
  }
  if(o.min){ try{ advance(o.min); }catch(_e){} }
  var rode = 0;
  if(o.ride){
    /* *** THE CAB DRIVES ITS LOOP, NOT HIS. *** The roster's verb is "empty cabs
       still crawling PICKUP LOOPS", so the direction is the CAB'S and he does not
       pick it. Two cells for nothing is the gain; not choosing where is the cost,
       and it is paid later in the walk back. Deterministic off the encounter's
       own seq so the same cab always goes the same way and nothing here rolls a
       seeded stream (A FEATURE THAT COSTS A SEEDED STREAM ONE DRAW REWRITES THE
       WHOLE MAP, 8/27). It still obeys the map: a cab cannot drive where there
       is no road, and it stops the moment the road does. */
    try{
      var cd = ((ev.seq|0) * 2 + 1) % 8;              /* the cab's own heading */
      for(var k=0;k<o.ride;k++){
        var d = DIRS[cd], nx = city.x+d[0], ny = city.y+d[1];
        if(!cityWalkable(nx,ny)) break;
        city.x=nx; city.y=ny; rode++;
      }
    }catch(_e){}
  }
  return { ok:true, act:act, say:o.say, paid:o.pay||0, mins:o.min||0,
           got:o.give||0, rode:rode };
}
'''

# ---------------------------------------------------------- remember direction
DIR_OLD = """    if(cityWalkable(nx,ny)){ city.x=nx; city.y=ny; advance(10); moversAdvance();"""
DIR_NEW = """    if(cityWalkable(nx,ny)){ city.x=nx; city.y=ny; advance(10); moversAdvance();
      ROAD_LASTDIR=di;   /* """ + MARK + """: which way the cab would be going */"""

# ------------------------------------------------------------------- the card
CARD_OLD = """  cardShow(
    /* THE HEADER KEEPS ITS HANDS OFF THE CLOSE BUTTON."""

CARD_NEW = """  /* """ + MARK + """: what he can do about it, if anything. */
  var C = ROAD_CHOICES[ev.id];
  var acts = '';
  if(C){
    C.opts.forEach(function(o){
      var tag = o.pay ? (o.pay+' SALVAGE') : o.min ? (o.min+' MIN')
              : o.ride ? 'A LIFT' : 'FREE';
      acts += '<div class="mrow" data-act="ch:'+o.a+'"><span class="mgood">'
           +  esc(o.t) + '</span><span class="mprice">' + tag + '</span></div>';
    });
    if(C.why) acts += '<div class="rwhy" data-draft="true">' + esc(C.why)
           + ' Fighting is not in this build yet.</div>';
  } else {
    acts = '<div class="mrow" data-act="close"><span class="mgood">KEEP MOVING</span>'
         + '<span class="mprice">\\u2192</span></div>';
  }
  cardShow(
    /* THE HEADER KEEPS ITS HANDS OFF THE CLOSE BUTTON."""

OUT_OLD = """    + cost + left
    + '<div class="mrow" data-act="close"><span class="mgood">KEEP MOVING</span>'
      + '<span class="mprice">\\u2192</span></div>');"""

OUT_NEW = """    + cost + left + acts,
    function(act){
      if(!act || act.indexOf('ch:')!==0) return;
      var r = roadChoose(ev, act.slice(3));
      if(!r) return;
      var inn = document.getElementById('daycardIn');
      if(!inn) return;
      /* THE OUTCOME REPLACES THE OPTIONS. Leaving them up after a press invites
         a second payment for one encounter, and it lies about what just
         happened. */
      var rows = inn.querySelectorAll('.mrow');
      for(var i=0;i<rows.length;i++) rows[i].style.display='none';
      var tell = r.refused
        ? esc(r.say) + ' (' + r.need + ' salvage, you have ' + r.have + ')'
        : esc(r.say);
      var meta = [];
      if(r.paid) meta.push('-' + r.paid + ' salvage');
      if(r.got)  meta.push('+' + r.got + ' salvage');
      if(r.mins) meta.push(r.mins + ' min');
      if(r.rode) meta.push('a cell of road for nothing');
      inn.insertAdjacentHTML('beforeend',
        '<div class="rwhy" data-draft="true">' + tell + '</div>'
        + (meta.length ? '<div class="rrow"><span class="rk">THAT COST</span>'
            + '<span class="rv">' + esc(meta.join(' \\u00b7 ')) + '</span></div>' : '')
        + '<div class="mrow" data-act="close"><span class="mgood">KEEP MOVING</span>'
        + '<span class="mprice">\\u2192</span></div>');
      /* A REFUSAL PUTS THE OTHER WAY OUT BACK, because being broke must not
         strand him in front of a card with nothing to press. */
      if(r.refused) for(var j=0;j<rows.length;j++)
        if(rows[j].dataset.act!=='ch:pay') rows[j].style.display='';
    });"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the road is already a decision')
        return
    if '__THE_ROAD_LEAVES_SOMETHING__' not in s:
        sys.exit('FAIL: run the road and loot patches first')
    for old, what in ((TABLE_OLD, 'where the table goes'),
                      (DIR_OLD, 'the city step'),
                      (CARD_OLD, 'the card head'),
                      (OUT_OLD, 'the card tail')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
    for old, new in ((TABLE_OLD, TABLE_NEW), (DIR_OLD, DIR_NEW),
                     (CARD_OLD, CARD_NEW), (OUT_OLD, OUT_NEW)):
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- four of the twelve now ask him something' % CITY)


if __name__ == '__main__':
    main()
