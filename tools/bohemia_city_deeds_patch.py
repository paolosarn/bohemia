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
# THE ORDER OF THESE THREE IS LOAD ORDER AND IT IS NOT ARBITRARY. bohemia_deeds
# reads root.BohemiaStanding for SEE_RANGE/MAX_HOPS and root.BohemiaClout for the
# weights, so both must already be defined when it evaluates.
CLOUT = os.path.join(ROOT, 'engine', 'bohemia_clout.js')
DEEDS = os.path.join(ROOT, 'engine', 'bohemia_deeds.js')

BEGIN = '/* ==== engine/bohemia_standing.js (THE DEED LEDGER, inlined verbatim) ==== */'
END = '/* ==== /engine/bohemia_standing.js (THE DEED LEDGER) ==== */'
# *** ONE BANNER PER MODULE, AND IT MUST SAY `engine/`. ***
# This tool used to emit ONE banner naming both modules and no engine/ prefix:
#     /* ==== bohemia_clout.js + bohemia_deeds.js (HOW LOUD, inlined verbatim) ==== */
# The ENGINE SYNC LAW's scanner (tools/bohemia_city_module_resync.py) accepts a
# line that startswith('/* ==== engine/') and endswith('==== */'), so it read that
# as ZERO modules and both bodies dropped out of the sweep. A module the sweep
# cannot see can drift a week behind its engine file with every gate green -- the
# same hole that hid the floorplan and the overmap before it. A banner is not a
# comment here; IT IS THE INDEX.
#
# *** AND FIXING THE OUTPUT DID NOT FIX IT. *** The RUN lane caught this on 8/21
# and wrote tools/bohemia_unhide_two_banners_patch.py, which repairs the banners in
# slices/BOHEMIA_CITY_WORLD.html. But THIS tool GENERATES that region, so the next
# run of it put the hole straight back, and BANNER was red again on 8/25 naming the
# same two modules. A generator and its output are not two places to fix a bug;
# the generator is the only one that stays fixed. Repaired here, at the source.
CLOUT_BEGIN = '/* ==== engine/bohemia_clout.js (HOW LOUD, inlined verbatim) ==== */'
CLOUT_END = '/* ==== /engine/bohemia_clout.js (HOW LOUD) ==== */'
DEEDS_BEGIN = '/* ==== engine/bohemia_deeds.js (WHO SAW IT, inlined verbatim) ==== */'
DEEDS_END = '/* ==== /engine/bohemia_deeds.js (WHO SAW IT) ==== */'
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
   *** AND HOW LOUD IT WAS DECIDES HOW FAR IT GOES. ***
   The deeds header names TWO failures and the first pass only fixed one. "The
   number moved and nobody had seen anything" is closed. The other half -- "a
   back-yard handshake and a public humiliation in front of a whole block are
   worth the same" -- stayed true, because every deed took the default reach and
   the default hop budget. bohemia_deeds.js says so about itself: "until now
   NOTHING IN THE GAME PRODUCED THE DIFFERENCE: every deed got the same hop
   budget, so quiet and notorious were the same word."
   reachOf/hopsFor derive both from HIS 7/21 CLOUT_WEIGHTS, so nothing here is a
   number I picked: reach = SEE_RANGE * sqrt(w/NEUTRAL), which is the geometry of
   people standing outdoors, and an untagged deed lands bit-for-bit on the old
   behaviour. Measured from his live table: quiet 7 tiles / 1 hop, untagged 9 / 2,
   notable 12 / 3, risky 17 / 4, reckless 24 / 5. */
function ctDeed(kind, tag, fid){
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
  /* NO TAG IS A LEGAL ANSWER AND IT MEANS THE OLD BEHAVIOUR EXACTLY. Passing
     undefined opts is not the same as passing computed defaults -- it is the
     module's own identity case, and keeping it reachable is what makes the tag
     able to move you OFF the default without ever silently redefining it. */
  var opts;
  if (tag && typeof BohemiaDeeds !== 'undefined') {
    try { opts = { range: BohemiaDeeds.reachOf(tag), maxHops: BohemiaDeeds.hopsFor(tag) }; }
    catch (_e) { opts = undefined; }
  }
  var n = 0;
  try {
    n = BohemiaStanding.witness(minds, now, '@', kind, hx, hy,
                                function (owner) { return pos[owner] || null; }, opts);
  } catch (_e) { return 0; }
  /* *** WHICH OUTFIT IT WAS ABOUT, AND ONLY THE EYEWITNESS KNOWS. ***
     Stamped on the copies this call just created, never carried in the KIND --
     a kind per faction would grow Paolo's DEED_WEIGHT table with the roster, and
     he weighs an ACT once.
     AND GOSSIP DROPS IT ON PURPOSE, WHICH IS THE POINT. bohemia_standing's
     gossip() copies actor/kind/turn/x/y/hops plus the fields it knows (maxHops,
     inherited, of) and NOTHING ELSE, so `fid` does not survive a retelling. That
     is not a limitation to work around, it is exactly what happens to a story:
     THE SPECIFIC DETAIL IS THE FIRST THING A RETELLING LOSES. An eyewitness knows
     who you turned down. Somebody who only heard knows that somebody got turned
     down. The lines below are written to that difference. */
  if (n && fid) {
    for (var q = 0; q < minds.length; q++) {
      var ds = minds[q].deeds; if (!ds || !ds.length) continue;
      var last = ds[ds.length - 1];
      if (last && last.actor === '@' && last.kind === kind && last.turn === now)
        last.fid = fid;
    }
  }
  if (n) ctMindSave();
  return n;
}

/* __CITY_DEEDS__ -- WHICH OF HIS FOUR WORDS EACH ACT EARNS.
   *** THIS IS READ OFF HIS CORPUS, NOT INVENTED. *** The quest corpus carries 203
   clout tags across 27 quests, and it writes the rule down in his own words
   (7/21): "CLOUT rides loudness", "quiet fix -> #quiet, public patch ->
   #notable", "help them finish small and intimate -> #quiet", "draw a real crowd
   -> #notable", "loud AND dangerous -> #risky", "loud spectacle -> #reckless",
   and, decisively, "THE PLAYER DOES NOT PICK A CLOUT NUMBER" -- the ACT does.
   So, applying his own rule to the three acts the walked street actually has:
     claim:met      you did the thing that was asked, between the two of you.
                    Small and intimate. #quiet.
     claim:refused  you turned an outfit down to their face, in the open. Not a
                    spectacle, but it is a break and it happens in public.
                    #notable, his "public patch".
     commit         you threw in with an outfit where anyone can see. The loudest
                    thing available on this street, and it costs you elsewhere.
                    #risky, his "loud AND dangerous".
   These three words are the judgement, and they are the kind of thing he
   overturns with one word if he disagrees. The WEIGHTS behind them are untouched
   and remain his. */
var CT_DEED_CLOUT = {
  'claim:met':     'quiet',      /* draft */
  'claim:refused': 'notable',    /* draft */
  'commit':        'risky',      /* draft */
  'favour':        'quiet'       /* draft */
};

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
                     heard: 'heard you threw in with an outfit' },       /* draft */
  'favour':        { saw: 'watched an outfit do you a favour',           /* draft */
                     heard: 'heard an outfit did you a favour' }         /* draft */
};
/* __CITY_REACT__ -- THEY SAY IT OUT LOUD, WITHOUT YOU OPENING ANYTHING.
   *** A DEED THAT ONLY EXISTS ON A CARD IS A DEED MOST PLAYERS NEVER SEE. ***
   Everything this lane built over four turns -- witnessing, gossip, hearsay
   decay, loudness -- was reachable only by walking up to somebody and opening
   their card. My own note on turn one said why that is fatal: a system the player
   cannot SEE working is indistinguishable from no system at all.
   BACKLOG 0r, THE REACTIVITY MULTIPLIER (8/12, the Hades math): Hades ships ~4
   boss fights but 21,020 voice lines, because roguelite replayability is bought
   with REACTIVITY PER ENCOUNTER, not roster size -- and the row names this
   lane's organs as the channel: "what witnesses say ... flowing through the
   witness organ + memory systems already live". It also names their trick, which
   is copied here: THEIR SYSTEM NEVER REPEATS A LINE UNTIL EVERY UNUSED OPTION IS
   SPENT.
   ADDITIVE, NEVER A REGRESSION, and it borrows the shape of the line above it:
   xchStart preempts the solo bark when two people are talking; this preempts it
   when somebody standing there actually watched you do something. Nobody
   witnessed anything, nothing changes, the street sounds exactly as it did.
   *** SAW AND HEARD SAY DIFFERENT THINGS. *** That is the whole payoff of
   modelling a route the news could take, and it has been invisible outside the
   card until now: an eyewitness is specific, a retelling is vague and hedged.
   THE WORDS ARE DRAFT (ALWAYS MAKE AN ATTEMPT, 8/11), written as if they ship,
   in one table so there is one place to edit them. They are deliberately
   PRONOUN-FREE: who the player is is his, and a bark that guesses is a bark that
   is wrong half the time. */
var CT_REACT = {
  'claim:refused': {
    theirs: ['Said no. To us. Standing right there.',        /* draft */
             'That was our ask. Got told no.'],              /* draft */
    rival:  ['Turned them down. Good.',                      /* draft */
             'Somebody finally said no to that lot.'],       /* draft */
    saw:    ['Told them no. Right to their face.',           /* draft */
             'Saw that. Turned them down flat.'],            /* draft */
    heard:  ['Heard somebody turned them down.',             /* draft */
             'Word going round, somebody said no to them.']  /* draft */
  },
  'claim:met': {
    theirs: ['Did what we asked. Noted.',                    /* draft */
             'That got done. For us.'],                      /* draft */
    rival:  ['Doing their errands now.',                     /* draft */
             'Running for that lot, apparently.'],           /* draft */
    saw:    ['Did what was asked. No fuss about it.',        /* draft */
             'Saw that one come through for them.'],         /* draft */
    heard:  ['Heard somebody came through for them.',        /* draft */
             'Word is that got done.']                       /* draft */
  },
  'favour': {
    theirs: ['We handed that over. Remember it.',            /* draft */
             'That came out of our stock.'],                 /* draft */
    rival:  ['Taking from them now. That is a choice.',      /* draft */
             'On their books already.'],                     /* draft */
    saw:    ['They handed something over. Saw it.',          /* draft */
             'Saw them do a favour there.'],                 /* draft */
    heard:  ['Heard they did somebody a favour.',            /* draft */
             'Word is something got handed over.']           /* draft */
  },
  'commit': {
    theirs: ['One of ours now. In the open.',                /* draft */
             'Threw in with us. Everybody saw.'],            /* draft */
    rival:  ['Picked them. Remember that.',                  /* draft */
             'Threw in with that lot. In the open.'],        /* draft */
    saw:    ['Threw in with them. Right in the open.',       /* draft */
             'Saw that. Picked a side.'],                    /* draft */
    heard:  ['Heard somebody threw in with them.',           /* draft */
             'Word is a side got picked.']                   /* draft */
  }
};
/* HADES' RULE, LITERALLY: never repeat a line until every unused option in that
   pool is spent. Per pool, not per person, because the player hears the STREET,
   not one man -- two neighbours saying the same sentence back to back is the
   repetition this is meant to kill. */
var CT_REACT_USED = {};
/* *** WHO IS SPEAKING DECIDES WHAT THE ACT MEANT. ***
   Backlog 0r's multiplier done properly: not MORE lines of the same thing, which
   is filler, but lines that depend on WHO SAW IT. The corpus has always authored
   this -- S17 stage 32 is `faction CARAVANS +12` AND `faction BLUES -6`, one act
   that is a good turn to the traders and a betrayal to the growers -- and
   bohemia_standing ships opts.only for exactly this reason, saying "one act can
   mean opposite things to two factions and nothing at all to a third".
   FOUR AUDIENCES: the outfit it was done to, somebody who runs with anybody else,
   an unaffiliated bystander, and anyone who only heard. A retelling has no
   audience at all, because gossip drops which outfit it was -- so the vaguest
   line is also the only one available second-hand, which is right. */
function ctReactLine(kind, heard, audience){
  var pool = CT_REACT[kind]; if (!pool) return null;
  var band = heard ? 'heard' : (audience || 'saw');
  var arr = pool[band] || pool.saw;
  if (!arr || !arr.length) return null;
  var key = kind + ':' + band;
  var used = CT_REACT_USED[key] || (CT_REACT_USED[key] = []);
  if (used.length >= arr.length) { used.length = 0; }
  for (var i = 0; i < arr.length; i++) {
    if (used.indexOf(i) < 0) { used.push(i); return arr[i]; }
  }
  return arr[0];
}
/* SAID ONCE, BY THAT PERSON, ABOUT THAT DEED. A witness who repeats the same
   sighting every time you walk past is not reactive, he is a broken record. */
var CT_REACT_SAID = {};
function ctDeedBark(now){
  if (typeof BohemiaMemory === 'undefined') return false;
  var drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
  for (var i = 0; i < drew.length; i++) {
    var d = drew[i]; if (!d || !d.p || !d.at) continue;
    /* CLOSE ENOUGH TO OVERHEAR, the same test the solo bark applies. */
    if (Math.abs(d.at[0] - hx) + Math.abs(d.at[1] - hy) > 6) continue;
    var m = CT_MINDS[d.p.id]; if (!m || !m.deeds || !m.deeds.length) continue;
    for (var j = m.deeds.length - 1; j >= 0; j--) {
      var dd = m.deeds[j];
      if (dd.actor !== '@') continue;
      if (!CT_REACT[dd.kind]) continue;
      var sk = String(d.p.id) + '|' + dd.kind + '|' + dd.turn;
      if (CT_REACT_SAID[sk]) continue;
      /* THEIR OWN ALLEGIANCE, from the surface's own answer -- never a second
         idea of who somebody runs with. A person with no outfit is a bystander,
         which is the honest reading and not a gap. */
      var aud = 'saw';
      if (dd.fid) {
        var wf = null;
        try { wf = ctFactionOf(d.p); } catch(_e){}
        if (wf) aud = (String(wf) === String(dd.fid)) ? 'theirs' : 'rival';
      }
      var line = ctReactLine(dd.kind, (dd.hops || 0) > 0, aud);
      if (!line) continue;
      CT_REACT_SAID[sk] = 1;
      BARK.p = d.p; BARK.at = d.at; BARK.text = line;
      BARK.until = now + barkHold(line);
      return true;
    }
  }
  return false;
}

/* __CITY_DIAL__ -- HIS DIAL, AND THE PLACE IT LANDS.
   *** WHERE DOES HE CHANGE THIS HIMSELF? *** (HE MUST BE ABLE TO DIRECT IT, 8/12.)
   This lane shipped three turns of a reputation system whose entire judgement
   layer -- DEED_WEIGHT -- is deliberately empty and waiting on his ruling, and
   the only way he could fill it was to tell me and I edit a file. His own law
   says in as many words that a system in that state IS NOT SHIPPED YET. Not
   inventing his numbers was right. Leaving him no controls was not, and they are
   two different mistakes.
   So the DIRECT tab has a STANDING dial and this is where its numbers land.
   MECHANISM-MINE / CONTENTS-PAOLO'S IS UNTOUCHED AND IS ACTUALLY NOW HONOURED
   PROPERLY: the table still ships EMPTY, nothing here writes a row of its own,
   and the only thing that ever fills it is him turning a dial. The gate still
   asserts it is empty until he does.
   MUTATED IN PLACE, NEVER REPLACED. BohemiaStanding.DEED_WEIGHT is the same
   object forceOf() closes over, so assigning properties on it lights up
   opinionOf, standingOf, becauseOf and the rungs with no other wiring at all.
   Swapping the reference instead would leave forceOf reading the old empty one,
   which is the kind of bug that looks like "the dial does nothing". */
function ctDialSave(){
  try { localStorage.setItem('boh.city.deedweight',
        JSON.stringify(BohemiaStanding.DEED_WEIGHT)); } catch(_e){}
}
function ctDialApply(w, save){
  if (typeof BohemiaStanding === 'undefined' || !w) return 0;
  var T0 = BohemiaStanding.DEED_WEIGHT, n = 0;
  /* HIS TABLE IS THE WHOLE TRUTH: a kind he has cleared must actually clear, so
     the old rows go before the new ones land. Merging instead would make a
     weight impossible to take back, and taking it back is half of a dial. */
  for (var k in T0) if (Object.prototype.hasOwnProperty.call(T0, k)) delete T0[k];
  for (var j in w) {
    if (!Object.prototype.hasOwnProperty.call(w, j)) continue;
    var v = Number(w[j]);
    if (!isFinite(v) || v === 0) continue;      /* zero is "unruled", not "worth nothing" */
    T0[j] = v; n++;
  }
  if (save !== false) ctDialSave();
  try { if (CT_OPEN) ctDraw(); } catch(_e){}
  return n;
}
(function(){
  /* restored on boot, so his ruling survives a reload without the alpha */
  try {
    var raw = JSON.parse(localStorage.getItem('boh.city.deedweight') || 'null');
    if (raw && typeof raw === 'object') ctDialApply(raw, false);
  } catch(_e){}
  /* and the DIRECT tab pushes it across the frame the moment he turns it */
  window.addEventListener('message', function(ev){
    var d = ev && ev.data;
    if (d && d.type === 'BOHEMIA_DEED_WEIGHTS' && d.weights)
      ctDialApply(d.weights, true);
    /* *** THE DIAL CANNOT READ THIS MODULE, SO THIS MODULE ANSWERS IT. ***
       MEASURED: the alpha reaching into the frame for BohemiaStanding throws
       SecurityError -- file:// frames are opaque origin "null" -- so a readout
       computed up there could only ever have been a RETYPED copy of the rungs
       and the hearsay penalty. That is the same second-copy drift this lane
       spent yesterday deleting, and it would have been introduced knowingly.
       So the REAL module computes the answer here and posts it. The dial offers
       a fixed ladder of values, which is why one reply covers every button and
       there is no round trip per press. */
    if (d && d.type === 'BOHEMIA_STANDING_ASK' && d.values && d.values.length) {
      var rows = {};
      try {
        for (var i = 0; i < d.values.length; i++) {
          var v = Number(d.values[i]); if (!isFinite(v)) continue;
          var heard = v * BohemiaStanding.HEARSAY_LOSS;
          rows[String(v)] = { saw: BohemiaStanding.rungFor(v),
                              heard: BohemiaStanding.rungFor(heard),
                              heardValue: +heard.toFixed(2) };
        }
      } catch(_e) { return; }
      try { if (window.parent && window.parent !== window)
        window.parent.postMessage({ type:'BOHEMIA_STANDING_FACTS', rows: rows }, '*'); } catch(_e){}
    }
  });
})();

/* __CITY_DIAL__ -- WHAT THEY THINK OF YOU, ONCE HE HAS SAID WHAT IT IS WORTH.
   Silent while the table is empty, which is the honest state: with no ruling
   there is no opinion, and printing NEUTRAL for everybody would be inventing a
   judgement he has not made. The moment one dial moves, this is how he SEES the
   change immediately -- the law's actual requirement, not a preview of one. */
function ctOpinionOf(id){
  if (typeof BohemiaStanding === 'undefined') return null;
  if (!Object.keys(BohemiaStanding.DEED_WEIGHT).length) return null;
  var m = CT_MINDS[id]; if (!m || !m.deeds || !m.deeds.length) return null;
  var v = 0;
  try { v = BohemiaStanding.opinionOf(m, '@', ctMinuteNow()); } catch(_e){ return null; }
  if (!v) return null;
  var rung = null;
  try { rung = BohemiaStanding.rungFor(v); } catch(_e){}
  return { value: v, rung: rung };
}

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
    if(r.answered) try{ var kD=(said==='yes'?'claim:met':'claim:refused');
                        ctDeed(kD, CT_DEED_CLOUT[kD], ctFid); }catch(_e){}
    advance(60);"""

# THE THIRD ACT ON THAT CARD. Taking a favour is a deed: the favour block cites
# his own Cartel dossier -- "They want you to OWE them... the first thing they
# give you is free" -- so being SEEN taking from an outfit is precisely the thing
# that matters, and until now nobody saw it either. #quiet by his corpus rule:
# it is a hand-off between the two of you, not a scene. GUARDED BY r.took, the
# same way the claim is guarded by r.answered -- a favour that was not granted is
# not a thing anybody watched you take.
FAVOUR_ANCHOR = """    if(r.took && ctFavIsAct) ctGiveCapped(sv, ctFid);
    advance(60);"""
FAVOUR_NEW = """    if(r.took && ctFavIsAct) ctGiveCapped(sv, ctFid);
    /* __CITY_DEEDS__ -- and being SEEN taking from an outfit is the whole point
       of the favour: this block's own citation is "they want you to OWE them".
       Nobody had ever observed it. */
    if(r.took) try{ ctDeed('favour', CT_DEED_CLOUT['favour'], ctFid); }catch(_e){}
    advance(60);"""
FAVOUR_CALL_V1 = None   # never shipped an untagged form; nothing to upgrade from

# *** AN UPGRADE PAIR'S TWO HALVES MUST DESCRIBE THE SAME SPAN. ***
# The first attempt at this paired a NARROW `from` (just the old ctDeed call) with
# a WIDE `to` (the whole anchored region, comment and closing brace included), so
# applying it re-inserted the region around the call: a duplicated advance(60) that
# double-charged an hour of his day, and a duplicated `}` that was a hard syntax
# error taking the entire city frame down. Third time this lane has met the same
# shape -- a replace whose delete half and insert half cover different ground.
# So the UPGRADE pairs below are narrow on BOTH sides (the call line and nothing
# else), and the wide anchor pairs are kept only for a FRESH install.
CLAIM_CALL_V1 = ("    if(r.answered) try{ ctDeed(said==='yes' ? 'claim:met' : "
                 "'claim:refused'); }catch(_e){}")
CLAIM_CALL_V3 = ("    if(r.answered) try{ var kD=(said==='yes'?'claim:met':'claim:refused');\n"
                 "                        ctDeed(kD, CT_DEED_CLOUT[kD], ctFid); }catch(_e){}")
COMMIT_CALL_V1 = "      try{ ctDeed('commit'); }catch(_e){}"
COMMIT_CALL_V3 = "      try{ ctDeed('commit', CT_DEED_CLOUT['commit'], ctFid); }catch(_e){}"

COMMIT_ANCHOR = """      for(var ci=0; ci<ctPaid.length; ci++)
        BohemiaBelonging.adjust(sv, ctPaid[ci].faction, -ctPaid[ci].lose);
    }"""
COMMIT_NEW = """      for(var ci=0; ci<ctPaid.length; ci++)
        BohemiaBelonging.adjust(sv, ctPaid[ci].faction, -ctPaid[ci].lose);
      /* __CITY_DEEDS__ -- throwing in with an outfit is the loudest thing you can
         do on this street, and it was equally unobserved. Inside the `moved`
         branch: a commitment that did not move is not a deed. */
      try{ ctDeed('commit', CT_DEED_CLOUT['commit'], ctFid); }catch(_e){}
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
    /* __CITY_DIAL__ -- AND WHAT THEY MAKE OF IT, once he has said what it is
       worth. Absent entirely while his table is empty: with no ruling there is
       no opinion, and printing NEUTRAL for everybody would be a judgement he
       never made. The moment one dial in the DIRECT tab moves, this row appears
       on the person who watched it, which is the law's "see the change
       immediately" rather than a preview of one. */
    var op = ctOpinionOf(p.id);
    if (op) body += ctRow('THEY THINK', op.rung + ' (' + (op.value > 0 ? '+' : '')
                                       + op.value.toFixed(1) + ')');
  } catch(_e){}"""


BARK_ANCHOR = '  if (xchStart(now)) return;'
BARK_NEW = '  if (xchStart(now)) return;\n  if (ctDeedBark(now)) return;   /* __CITY_REACT__ */'

# *** EVERY FORM THIS TOOL HAS EVER SHIPPED NEEDS AN UPGRADE PATH. ***
# The tool refused outright when the city held V2 (tagged, no outfit) and only
# V1->V3 and anchor->V3 pairs existed. REFUSING IS THE RIGHT FAILURE -- it said
# so and changed nothing, rather than reporting success over a half-wired city --
# but the fix is to keep a pair per shipped form. Each is narrow and span-matched
# on both halves.
CLAIM_CALL_V2 = ("    if(r.answered) try{ var kD=(said==='yes'?'claim:met':'claim:refused');\n"
                 "                        ctDeed(kD, CT_DEED_CLOUT[kD]); }catch(_e){}")
COMMIT_CALL_V2 = "      try{ ctDeed('commit', CT_DEED_CLOUT['commit']); }catch(_e){}"
FAVOUR_CALL_V2 = "    if(r.took) try{ ctDeed('favour', CT_DEED_CLOUT['favour']); }catch(_e){}"
FAVOUR_CALL_V3 = "    if(r.took) try{ ctDeed('favour', CT_DEED_CLOUT['favour'], ctFid); }catch(_e){}"

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
    clout = open(CLOUT, encoding='utf-8').read()
    deeds = open(DEEDS, encoding='utf-8').read()

    if '__CITY_MEMORY__' not in s:
        sys.exit('REFUSING TO WRITE: the witness organ is not in the city yet. '
                 'Run python3 tools/bohemia_city_memory_patch.py first -- deeds are '
                 'held in minds and there are none.')

    block = (BEGIN + '\n' + stand + '\n' + END + '\n\n'
             + CLOUT_BEGIN + '\n' + clout + '\n' + CLOUT_END + '\n\n'
             + DEEDS_BEGIN + '\n' + deeds + '\n' + DEEDS_END
             + STORE + STORE_END + '\n')

    # *** THE WIRING OUTSIDE THE BLOCK HAS TO BE UPGRADEABLE TOO. ***
    # This tool writes in two places: the inlined REGION (BEGIN..STORE_END) and a
    # handful of CALL SITES scattered through the city. The refresh branch only
    # ever rewrote the region, so the day the call sites needed to change -- when
    # ctDeed grew a `tag` argument -- a re-run silently left them on the old form
    # and the feature was half-wired. AN IDEMPOTENT TOOL WHOSE REFRESH PATH COVERS
    # ONLY PART OF WHAT IT WRITES WILL QUIETLY SKIP THE REST.
    # So every call site is a (from, to) pair applied on BOTH paths: already in the
    # new form is a no-op, still in an old form is upgraded, and absent entirely is
    # inserted from its anchor. Each pair is its own narrow anchor, so one moving
    # under another lane's edit cannot take the others down with it.
    WIRING = [
        ('gossip pass',  [(GOSSIP_ANCHOR, GOSSIP_NEW)]),
        ('claim deed',   [(CLAIM_CALL_V2, CLAIM_CALL_V3),
                          (CLAIM_CALL_V1, CLAIM_CALL_V3),
                          (CLAIM_ANCHOR, CLAIM_NEW)]),
        ('commit deed',  [(COMMIT_CALL_V2, COMMIT_CALL_V3),
                          (COMMIT_CALL_V1, COMMIT_CALL_V3),
                          (COMMIT_ANCHOR, COMMIT_NEW)]),
        ('favour deed',  [(FAVOUR_CALL_V2, FAVOUR_CALL_V3),
                          (FAVOUR_ANCHOR, FAVOUR_NEW)]),
        ('card row',     [(CARD_ANCHOR, CARD_NEW)]),
        ('deed bark',    [(BARK_ANCHOR, BARK_NEW)]),
    ]

    def wire(s, label, pairs):
        """Apply the first pair whose `from` is present, unless already current.
        ALREADY-CURRENT IS TESTED AGAINST EVERY TARGET, not just the last one: a
        city wired fresh carries the wide form and a city upgraded in place carries
        the narrow one, and both are correct end states."""
        if any(to in s for _f, to in pairs):
            return s
        for frm, to in pairs:
            if frm in s:
                if s.count(frm) != 1:
                    sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times, '
                             'not 1.' % (label, s.count(frm)))
                return s.replace(frm, to, 1)
        sys.exit('REFUSING TO WRITE: no anchor for %s resolves. Another lane has '
                 'moved the code this hooks into; re-read it before re-running.' % label)

    if BEGIN in s:
        # REPLACED WHOLE, never appended. The region runs BEGIN..STORE_END so the
        # delete half covers everything the insert half writes; proved by md5 over
        # three runs, after the memory tool shipped with exactly this bug.
        cut_ok(s, BEGIN, 'ledger begin')
        cut_ok(s, STORE_END, 'store end')
        i = s.index(BEGIN)
        j = s.index(STORE_END) + len(STORE_END) + 1
        s = s[:i] + block + s[j:]
        for label, pairs in WIRING:
            s = wire(s, label, pairs)
        grew = s.count('\n') - n_before
        if grew < 0:
            sys.exit('REFUSING TO WRITE: this would REMOVE %d lines.' % -grew)
        open(CITY, 'w', encoding='utf-8').write(s)
        print('CITY DEEDS: refreshed the ledger AND the call sites. %+d lines' % grew)
        print('  tagged   : %d' % s.count('CT_DEED_CLOUT['))
        return

    cut_ok(s, INLINE_ANCHOR, 'inline')
    s = s.replace(INLINE_ANCHOR, INLINE_ANCHOR + '\n\n' + block, 1)
    for label, pairs in WIRING:
        s = wire(s, label, pairs)

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
    print('  loudness : %d' % s.count('root.BohemiaDeeds = API'))
    print('  witness  : %d' % s.count('ctDeed('))
    print('  gossip   : %d' % s.count('ctGossipPass()'))
    print('  card     : %d' % s.count('ctKnownDeeds('))
    print('  city     : %.1f MB' % (os.path.getsize(CITY) / 1e6))


if __name__ == '__main__':
    main()
