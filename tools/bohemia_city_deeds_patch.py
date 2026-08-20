#!/usr/bin/env python3
"""BOHEMIA CITY DEEDS -- THE NUMBER MOVED AND NOBODY HAD SEEN ANYTHING.

*** THE FLAW IS NAMED IN THE ENGINE'S OWN HEADER AND THE CITY WAS COMMITTING IT. ***
engine/bohemia_deeds.js opens with it, written 8/6:

    "The faction standing got applied godlike: the number moved, valley-wide,
     instantly, and NOBODY HAD SEEN ANYTHING. So today a back-yard handshake and
     a public humiliation in front of a whole block are worth the same."

That is exactly what ctAnswerClaim did. You are asked for something, you say yes
or no to somebody's face, and `BohemiaBelonging.adjust` moved a valley-wide number
while not one person in Las Vegas observed a thing. The whole outfit knew
instantly; the man standing next to you knew nothing.

engine/bohemia_standing.js was built for precisely this input on 8/2 -- witness,
opinion, gossip, hearsay decay, 35 green claims -- and had no caller. Yesterday
this lane wired the witness ORGAN (bohemia_memory) so people can see you; this
wires the DEED, so what they see you DO is a thing they hold and pass on.

WHAT THIS DOES NOT TOUCH, and the boundary matters: it does not change what a
claim COSTS, who may ask, or how belonging moves. Those are the FACTIONS lane's
(BohemiaClaim, BohemiaBelonging, the __CITY_CLAIM__ and __CITY_STANDING__ blocks)
and every number they compute is left exactly as it was. This adds one sentence
to the world: AND THESE SPECIFIC PEOPLE SAW YOU DO IT.

*** WHAT A DEED IS WORTH IS STILL HIS, AND THAT IS WHY IT SHIPS EMPTY. ***
bohemia_standing's DEED_WEIGHT table is deliberately blank -- "NOTHING IS IN HERE
and nothing in this file invents a row" -- so opinionOf() returns 0 and
standingOf() returns NEUTRAL for everybody. Nothing here fills it. The mechanism
records WHAT HAPPENED and WHO KNOWS; the judgement waits for his dial, and the
moment he sets one row, opinion and standing light up with no further wiring.
That is also why the card reads the deed LEDGER directly rather than through
becauseOf(): becauseOf is a judgement query and filters on force, so it returns
nothing while the table is empty. The fact that somebody saw you is not a
judgement, and it is true today.

*** NEWS TRAVELS AT THE SPEED OF PEOPLE, AND THAT IS THE PART YOU CAN SEE. ***
gossip() moves a deed between two people who are actually together, at a penalty
per retelling, with a hop cap. So the card can say whether this person SAW it or
HEARD it, and that distinction is the thing almost no game shows: in most of them
every NPC knows everything the instant it happens, with no route the news could
have taken. The 45-minute co-location window is the module's own constant, and it
is credited in ELAPSED GAME MINUTES rather than in frames -- the player walking
away for three hours must not stop two neighbours talking to each other.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no pixels and opens no bank. It
inlines engine/bohemia_standing.js verbatim, reuses the minds and the ctMind /
ctMinuteNow / ctMindSave store this lane already put in the city, reads witnesses
from the render's own BARK_DREW exactly as the witness pass does, and adds no
styling -- the card row goes through the card's existing ctRow().

  python3 tools/bohemia_city_deeds_patch.py
Gate: gates/city_deeds_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
STAND = os.path.join(ROOT, 'engine', 'bohemia_standing.js')

BEGIN = '/* ==== engine/bohemia_standing.js (THE DEED LEDGER, inlined verbatim) ==== */'
END = '/* ==== /engine/bohemia_standing.js (THE DEED LEDGER) ==== */'
STORE_END = '/* ==== /__CITY_DEEDS__ store ==== */'

# This lane's own memory block closes with this line. Anchoring here puts the deed
# ledger immediately after the witness organ it is built on, and keeps both inside
# one lane's territory.
INLINE_ANCHOR = '/* ==== /__CITY_MEMORY__ store ==== */'

STORE = r'''
/* __CITY_DEEDS__ -- SOMEBODY DID SOMETHING AND THE PEOPLE THERE SAW IT.
   The witness set is the render's own BARK_DREW, exactly as ctWitnessPass reads
   it: who can see you is who the game actually drew, never a second calculation
   that could disagree with the picture.
   RANGE AND HOPS ARE THE MODULE'S DEFAULTS ON PURPOSE. bohemia_deeds.js can make
   a deed louder or quieter from a quest's own #quiet/#reckless tag, but a claim
   answered on the street carries no such tag and inventing one would be picking a
   number that is his. Default sightline, default two retellings. */
function ctDeed(kind){
  if (typeof BohemiaStanding === 'undefined' || typeof BohemiaMemory === 'undefined')
    return 0;
  var now = ctMinuteNow();
  var drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
  var pos = {}, minds = [];
  for (var i = 0; i < drew.length; i++) {
    var d = drew[i]; if (!d || !d.p || !d.at) continue;
    pos[d.p.id] = { x: d.at[0], y: d.at[1] };
    minds.push(ctMind(d.p.id));
  }
  var n = 0;
  try {
    n = BohemiaStanding.witness(minds, now, '@', kind, hx, hy,
                                function (owner) { return pos[owner] || null; });
  } catch (_e) { return 0; }
  if (n) ctMindSave();
  return n;
}

/* __CITY_DEEDS__ -- AND THEN THEY TELL EACH OTHER.
   *** THE WINDOW IS COUNTED IN GAME MINUTES, NOT IN FRAMES. ***
   bohemia_standing's own constant is GOSSIP_WINDOW: minutes two people must be
   co-located before they talk at all. Counting frames instead would mean two
   neighbours could only ever talk while the PLAYER stood watching them, which is
   both wrong about the world and unreachable in practice: the player walks twelve
   cells a game-minute, so forty-five minutes of watching is five hundred cells of
   staring at the same two people. Elapsed clock time between passes is credited
   instead, so walking away for three hours does not stop anybody talking.
   TOGETHER MEANS CONVERSATIONAL DISTANCE, NOT SIGHTLINE. SEE_RANGE is nine tiles
   because that is how far you can SEE something happen; you cannot swap news with
   somebody nine tiles away. Two cells is arm's length plus one.
   A pair that separates loses its accumulated time rather than banking it, which
   is what stops two people who pass each other daily from eventually counting as
   having had a long conversation. */
var CT_TOGETHER = {}, CT_GOSSIP_MIN = -1;
function ctGossipPass(){
  if (typeof BohemiaStanding === 'undefined') return 0;
  var now = ctMinuteNow();
  if (CT_GOSSIP_MIN < 0) { CT_GOSSIP_MIN = now; return 0; }
  var dt = now - CT_GOSSIP_MIN;
  if (dt <= 0) return 0;
  var drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
  if (!drew.length) return 0;             /* nothing drawn yet: retry, keep the clock */
  CT_GOSSIP_MIN = now;
  var W = BohemiaStanding.GOSSIP_WINDOW, moved = 0, alive = {};
  for (var i = 0; i < drew.length; i++) for (var k = i + 1; k < drew.length; k++) {
    var a = drew[i], b = drew[k];
    if (!a || !b || !a.p || !b.p || !a.at || !b.at) continue;
    if (Math.abs(a.at[0] - b.at[0]) + Math.abs(a.at[1] - b.at[1]) > 2) continue;
    var ka = String(a.p.id), kb = String(b.p.id);
    var key = ka < kb ? ka + '|' + kb : kb + '|' + ka;
    alive[key] = 1;
    CT_TOGETHER[key] = (CT_TOGETHER[key] || 0) + dt;
    if (CT_TOGETHER[key] >= W) {
      try { moved += BohemiaStanding.gossip(ctMind(ka), ctMind(kb), now); } catch (_e) {}
      CT_TOGETHER[key] = 0;
    }
  }
  for (var key2 in CT_TOGETHER) if (!alive[key2]) delete CT_TOGETHER[key2];
  if (moved) ctMindSave();
  return moved;
}

/* __CITY_DEEDS__ -- WHAT THIS PERSON KNOWS ABOUT YOU, and whether they were there.
   *** READ OFF THE LEDGER, NOT THROUGH becauseOf(). *** becauseOf is a JUDGEMENT
   query: it computes force and drops anything weightless, so while DEED_WEIGHT is
   deliberately empty it returns nothing at all. But "he watched you refuse" is a
   FACT, not a judgement, and it is true today. The moment Paolo rules a weight,
   opinionOf and standingOf light up on this same data with no wiring changed.
   NEWEST FIRST, and seeing beats hearing at equal age: what somebody witnessed
   themselves is the thing they would lead with. */
var CT_DEED_WORDS = {
  'claim:met':     { saw: 'watched you come through for an outfit',      /* draft */
                     heard: 'heard you came through for an outfit' },    /* draft */
  'claim:refused': { saw: 'watched you turn an outfit down',             /* draft */
                     heard: 'heard you turned an outfit down' },         /* draft */
  'commit':        { saw: 'watched you throw in with an outfit',         /* draft */
                     heard: 'heard you threw in with an outfit' }        /* draft */
};
function ctKnownDeeds(id, limit){
  var m = CT_MINDS[id];
  if (!m || !m.deeds || !m.deeds.length) return [];
  var out = [];
  for (var i = m.deeds.length - 1; i >= 0; i--) {
    var d = m.deeds[i];
    if (d.actor !== '@') continue;
    var w = CT_DEED_WORDS[d.kind]; if (!w) continue;
    var heard = (d.hops || 0) > 0;
    out.push({ kind: d.kind, turn: d.turn, hops: d.hops || 0, heard: heard,
               say: heard ? w.heard : w.saw });
  }
  out.sort(function (a, b) {
    if (a.heard !== b.heard) return a.heard ? 1 : -1;   /* seeing leads hearing */
    return b.turn - a.turn;                             /* then newest first */
  });
  return out.slice(0, limit || 2);
}
'''

# --- the render pass: gossip runs beside the witness pass, same source, same tick
GOSSIP_ANCHOR = "  try{ ctWitnessPass(); }catch(_e){}   /* __CITY_MEMORY__ */\n"
GOSSIP_NEW = ("  try{ ctWitnessPass(); }catch(_e){}   /* __CITY_MEMORY__ */\n"
              "  try{ ctGossipPass(); }catch(_e){}    /* __CITY_DEEDS__ */\n")

# --- the deed itself. THE FACTIONS LANE'S HANDLER IS NOT OTHERWISE TOUCHED:
# every number it computes is left alone; this only says who watched.
CLAIM_ANCHOR = """    if(r.answered && r.delta) BohemiaBelonging.adjust(sv, ctFid, r.delta);
    advance(60);"""
CLAIM_NEW = """    if(r.answered && r.delta) BohemiaBelonging.adjust(sv, ctFid, r.delta);
    /* __CITY_DEEDS__ -- AND THE PEOPLE STANDING THERE SAW YOU DO IT.
       The adjust() above is the FACTIONS lane's and is untouched; what was
       missing is that it moved a valley-wide number while nobody had observed
       anything, which is the exact failure bohemia_deeds.js was written to name.
       ONLY WHEN IT WAS REALLY ANSWERED: a claim that did not resolve is not a
       thing anybody watched you do.
       THE KIND DOES NOT CARRY THE OUTFIT ON PURPOSE. Paolo weighs an ACT once;
       a kind per faction would make his DEED_WEIGHT table grow with the roster,
       and a bystander who is not in that outfit only knows that you turned
       somebody down anyway. */
    if(r.answered) try{ ctDeed(said==='yes' ? 'claim:met' : 'claim:refused'); }catch(_e){}
    advance(60);"""

COMMIT_ANCHOR = """      for(var ci=0; ci<ctPaid.length; ci++)
        BohemiaBelonging.adjust(sv, ctPaid[ci].faction, -ctPaid[ci].lose);
    }"""
COMMIT_NEW = """      for(var ci=0; ci<ctPaid.length; ci++)
        BohemiaBelonging.adjust(sv, ctPaid[ci].faction, -ctPaid[ci].lose);
      /* __CITY_DEEDS__ -- throwing in with an outfit is the loudest thing you can
         do on this street, and it was equally unobserved. Inside the `moved`
         branch: a commitment that did not move is not a deed. */
      try{ ctDeed('commit'); }catch(_e){}
    }"""

# --- the surface. FIRST ROW ON THE CARD, because what they know about YOU is the
# thing that changed since last time; everything else on the card is true of them
# on any day.
CARD_ANCHOR = ("  var body='<div class=\"who\">'"
               "+(nm?nm.toUpperCase():BohemiaPeople.headingOf(who))+'</div>';")
CARD_NEW = CARD_ANCHOR + """
  /* __CITY_DEEDS__ -- WHAT THEY KNOW ABOUT YOU, and whether they were there.
     Leads the card for the same reason the recognition leads the tell: it is the
     only part that is true of you and them TOGETHER, and the only part that is
     different because of what you have done. A person who knows nothing about
     you gets no row at all rather than an empty one -- a blank labelled row
     reads as a broken feature, and silence is the honest answer. */
  try {
    var kd = ctKnownDeeds(p.id, 2);
    for (var kdi = 0; kdi < kd.length; kdi++)
      body += ctRow(kd[kdi].heard ? 'HEARD' : 'SAW', kd[kdi].say);
  } catch(_e){}"""


def cut_ok(s, needle, label):
    n = s.count(needle)
    if n != 1:
        sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times, not 1.' % (label, n))


def main():
    for f in (CITY, STAND):
        if not os.path.exists(f):
            sys.exit('FAIL: ' + f + ' not found')
    s = open(CITY, encoding='utf-8').read()
    before = s
    n_before = s.count('\n')
    stand = open(STAND, encoding='utf-8').read()

    if '__CITY_MEMORY__' not in s:
        sys.exit('REFUSING TO WRITE: the witness organ is not in the city yet. '
                 'Run python3 tools/bohemia_city_memory_patch.py first -- deeds are '
                 'held in minds and there are none.')

    block = BEGIN + '\n' + stand + '\n' + END + STORE + STORE_END + '\n'

    if BEGIN in s:
        # REPLACED WHOLE, never appended. The region runs BEGIN..STORE_END so the
        # delete half covers everything the insert half writes; proved by md5 over
        # three runs, after the memory tool shipped with exactly this bug.
        cut_ok(s, BEGIN, 'ledger begin')
        cut_ok(s, STORE_END, 'store end')
        i = s.index(BEGIN)
        j = s.index(STORE_END) + len(STORE_END) + 1
        s = s[:i] + block + s[j:]
        open(CITY, 'w', encoding='utf-8').write(s)
        print('CITY DEEDS: refreshed the inlined ledger. %+d lines'
              % (s.count('\n') - n_before))
        return

    cut_ok(s, INLINE_ANCHOR, 'inline')
    s = s.replace(INLINE_ANCHOR, INLINE_ANCHOR + '\n\n' + block, 1)
    cut_ok(s, GOSSIP_ANCHOR, 'gossip pass')
    s = s.replace(GOSSIP_ANCHOR, GOSSIP_NEW, 1)
    cut_ok(s, CLAIM_ANCHOR, 'claim deed')
    s = s.replace(CLAIM_ANCHOR, CLAIM_NEW, 1)
    cut_ok(s, COMMIT_ANCHOR, 'commit deed')
    s = s.replace(COMMIT_ANCHOR, COMMIT_NEW, 1)
    cut_ok(s, CARD_ANCHOR, 'card row')
    s = s.replace(CARD_ANCHOR, CARD_NEW, 1)

    # A WIRING PATCH ONLY EVER ADDS. 8/17 a sibling tool removed 2,607 lines of
    # another lane's work; 8/20 my own opening patch ate 47 more.
    grew = s.count('\n') - n_before
    if grew < 0:
        sys.exit('REFUSING TO WRITE: this would REMOVE %d lines from the city.' % -grew)

    if s == before:
        print('CITY DEEDS: nothing to do.')
        return
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY DEEDS: +%d lines' % grew)
    print('  ledger   : %d' % s.count('root.BohemiaStanding=API'))
    print('  witness  : %d' % s.count('ctDeed('))
    print('  gossip   : %d' % s.count('ctGossipPass()'))
    print('  card     : %d' % s.count('ctKnownDeeds('))
    print('  city     : %.1f MB' % (os.path.getsize(CITY) / 1e6))


if __name__ == '__main__':
    main()
