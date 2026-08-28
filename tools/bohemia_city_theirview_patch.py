#!/usr/bin/env python3
"""
BOHEMIA CITY THEIR-VIEW PATCH -- RULE 4 OF THE REPUTATION ORGAN WAS NEVER CALLED.
(8/28/26, FACTIONS lane)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_THEIRVIEW__.

==========================================================================
HOW IT WAS FOUND, WHICH MATTERS MORE THAN WHAT IT IS
==========================================================================
tools/bohemia_organ_reach.js exists to answer one question -- does anything on
the walked surface actually call this. Its own docstring warns, in as many
words, that "a module the sweep does not know about is invisible to exactly
that check, which is the rot this file exists to kill, wearing the sweep's own
uniform."

Then its own module table was the thing carrying the rot. FOUR faction-family
modules were inlined in the walked page and had never once been swept:
bohemia_standing, bohemia_known, bohemia_clout, bohemia_asking. Found by
listing engine/ for the family and diffing it against the table -- a thing that
should have been done the day the table was written.

Registering them printed this:

    BohemiaStanding   9 fns | surface 4  engine 1  tooling 0  NOTHING 4
        *** NOTHING ANYWHERE: standingOf, becauseOf, inherit, legendOf

==========================================================================
WHAT IS ACTUALLY MISSING
==========================================================================
bohemia_standing.js states four rules in its own header. Three of them are
wired and running in the city. This is the fourth, verbatim:

    4. A FACTION'S VIEW IS ITS MEMBERS' VIEWS. standingOf() averages the
       opinions of the people who actually belong to it.

Nothing on the walked surface has ever called it.

MEASURED, and this is the exact shape: the city witnesses four deed kinds --
claim:met, claim:refused, commit, favour -- and every one of them is an organ
THIS LANE built. ctWitnessPass records who saw you. ctGossipPass spreads it.
ctOpinionOf reads ONE PERSON'S private view and shows it on their card. So you
can turn the Church down in front of five of its people, each of those five
privately thinks less of you, and THE CHURCH HAS NO VIEW OF YOU AND NEVER WILL.
The outfit whose door you are trying to get through cannot form an opinion.

And the ladder in front of that door is BELONGING -- what you have GIVEN them.
Two different things have been sharing the word "standing" in this lane for a
week, and only one of them was ever on the screen.

A LIVE COMMENT IN THE FILE ASSERTS THE WIRING THAT IS MISSING. __CITY_DIAL__
says filling DEED_WEIGHT "lights up opinionOf, standingOf, becauseOf and the
rungs with no other wiring at all." opinionOf, true. standingOf and becauseOf,
false -- nothing calls them, so his dial could never have reached them. The
comment is corrected here rather than left to mislead the next reader.

==========================================================================
WHAT SHIPS TODAY VERSUS WHAT WAITS FOR HIS DIAL
==========================================================================
DEED_WEIGHT ships EMPTY and NOTHING HERE PUTS A ROW IN IT. That is his ruling
and the DIRECT tab's STANDING dial is where he makes it. With the table empty
every opinion is 0, so this NEVER PRINTS A RUNG -- printing NEUTRAL for
everybody would be inventing the judgement he has not made, which is the exact
thing ctOpinionOf already refuses to do.

BUT standingOf ALSO RETURNS `members`, AND THAT IS TRUE TODAY WITH AN EMPTY
TABLE. A mind only exists for somebody you have actually been near, so
`members` literally counts HOW MANY OF THAT OUTFIT'S PEOPLE HAVE BEEN WHERE YOU
HAVE BEEN. No ruling is needed for a headcount. So the surface says:

    THE CHURCH HAS SEEN YOU        3 OF ITS PEOPLE
    THE CARTEL                     HAS NEVER LAID EYES ON YOU

and the moment he turns one dial the same rows start carrying the rung and the
reasons, with no further wiring.

*** AND THE SECOND LINE IS THE HONEST ANSWER TO THIS LANE'S OLDEST FINDING. ***
837 people within six cells of the spawn, none affiliated, nearest base 29
cells. I have said four times that this is placement and not mine, and it still
is. What was never done is SAYING SO IN THE GAME. "The Cartel has never laid
eyes on you" is true at spawn, needs no dial, no placement and no ruling, and
it tells the player that the outfit exists, that being seen is how it comes to
know him, and that it is not here. An empty state that points somewhere beats
a screen that is silent about its own emptiness.

==========================================================================
THE ONE MODELLING DECISION, WRITTEN DOWN
==========================================================================
standingOf needs factionOfOwner(id), and the city's ctFactionOf takes a PERSON
object, which an id cannot be turned back into. So the outfit is STAMPED on the
mind at the moment you see them, in ctWitnessPass, which is the one place that
holds the person and the mind at the same time.

IT RE-STAMPS ON EVERY PASS RATHER THAN ONLY THE FIRST, and that is the model
rather than laziness: what you know is WHO THEY RAN WITH LAST TIME YOU SAW
THEM. Somebody you vouched into the Church reads as Church the next time you
walk past, and somebody who lost their place stops reading as anything -- both
without a second notification system, because ctFactionOf already answers both.

It rides ctMindSave's existing whole-object JSON, so it persists with no new
save key and no migration.

==========================================================================
AND THE THING THAT MADE THE FIRST PROBE LIE
==========================================================================
A probe on slices/BOHEMIA_CITY_WORLD.html directly measures A GHOST TOWN. That
page has no PLAYER_CV -- the character bake is POSTED IN from the alpha -- so
peoplePass returns before drawing anybody, BARK_DREW stays empty and no mind is
ever created. Measured with this code working: drew=0, minds=0, stamped=0.
gates/city_barks_gate.js names the same trap. The gate pass for this boots the
ALPHA, opens the RUN tab (every frame is about:blank until it does), and WALKS,
because ctWitnessPass runs once per GAME minute and this world is
I-MOVE-YOU-MOVE: standing still never advances the clock.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_THEIRVIEW__'

# ------------------------------------------------ 1. WHO THEY RAN WITH, WHEN SEEN
OLD_STAMP = """    try { BohemiaMemory.see(ctMind(d.p.id), now, '@', hx, hy); n++; } catch(_e){}"""
NEW_STAMP = """    try { BohemiaMemory.see(ctMind(d.p.id), now, '@', hx, hy); n++; } catch(_e){}
    /* """ + MARKER + """ -- AND WHO THEY RAN WITH WHEN YOU SAW THEM.
       standingOf() asks factionOfOwner(id) and ctFactionOf takes a PERSON, which
       an id cannot be turned back into. This is the one place in the file that
       holds the person and the mind at the same time, so this is where it goes.
       RE-STAMPED EVERY PASS, ON PURPOSE: what you know is who they ran with the
       LAST time you saw them. Somebody you vouched in reads as theirs next time
       you walk past; somebody who lost their place stops reading as anything.
       ctFactionOf already answers both, so neither needs a notification.
       Rides ctMindSave's whole-object JSON: no new save key, no migration. */
    try {
      if (typeof ctFactionOf === 'function') {
        var __tvf = ctFactionOf(d.p);
        var __tvm = ctMind(d.p.id);
        if (__tvf) __tvm.fid = __tvf; else if (__tvm.fid) delete __tvm.fid;
      }
    } catch(_e){}"""

# ---------------------------------------- 2. THE FOURTH RULE, FINALLY CALLED
OLD_ORGAN = """/* __CITY_SIDECOST__ -- WHAT YOU STAND AT WITH EVERYBODY."""
NEW_ORGAN = """/* """ + MARKER + """ -- A FACTION'S VIEW IS ITS MEMBERS' VIEWS.
   Rule 4 of bohemia_standing.js, quoted from its own header, and the only one
   of its four that nothing on this surface had ever called. standingOf and
   becauseOf were reported by tools/bohemia_organ_reach.js as reached by
   NOTHING ANYWHERE -- not the page, not another module, not even a gate.

   EVERY MIND, NOT EVERY DRAWN BODY. BARK_DREW is who is on screen this frame,
   which is the right witness set and the wrong opinion set: an outfit's view of
   you is held by its people whether or not they are currently in shot. CT_MINDS
   is exactly the set of people you have ever been near, which is exactly the set
   who could have a view. */
function ctMindsList(){
  var out = [];
  for (var k in CT_MINDS){ if (CT_MINDS[k]) out.push(CT_MINDS[k]); }
  return out;
}
/* the bridge standingOf asks for. Reads the stamp ctWitnessPass leaves, never
   ctFactionOf -- an id cannot be turned back into a person, and guessing one
   from a seat string is how this lane collapsed a whole population onto a dozen
   draws on 8/11. */
function ctFactionOfMind(owner){
  var m = CT_MINDS[owner];
  return (m && m.fid) ? m.fid : null;
}
/* HAS HE RULED WHAT A DEED IS WORTH. Until he has, there is no opinion to show
   and a rung would be an invented judgement -- the same refusal ctOpinionOf
   already makes, asked in one place so both cannot drift apart. */
function ctDeedsRuled(){
  try { return !!Object.keys(BohemiaStanding.DEED_WEIGHT).length; }
  catch(_e){ return false; }
}
function ctTheirView(fid){
  if (typeof BohemiaStanding === 'undefined' || !fid) return null;
  var minds = ctMindsList();
  if (!minds.length) return { faction:fid, value:0, rung:null, members:0, whoSaw:0, ruled:false };
  var st;
  try { st = BohemiaStanding.standingOf(minds, fid, '@', ctMinuteNow(), ctFactionOfMind); }
  catch(_e){ return null; }
  if (!st) return null;
  st.ruled = ctDeedsRuled();
  /* THE RUNG IS DROPPED, NOT SOFTENED, WHILE THE TABLE IS EMPTY. rungFor(0)
     answers NEUTRAL, which reads as "they have taken your measure and shrugged"
     when the truth is that nobody has said what anything is worth yet. */
  if (!st.ruled || !st.whoSaw) st.rung = null;
  return st;
}
/* WHY THEY FEEL THAT WAY, IN THE WORDS THAT ARE ALREADY WRITTEN. CT_DEED_WORDS
   holds a draft line per kind in both voices -- watched it, or only heard --
   and becauseOf already returns which of the two a given memory is. Nothing new
   is authored here; the split between an eyewitness and a retelling is the
   organ's, and the sentences are the ones already on the cards. */
function ctWhyTheyThinkThat(fid, limit){
  if (typeof BohemiaStanding === 'undefined' || !fid || !ctDeedsRuled()) return [];
  var minds = ctMindsList(); if (!minds.length) return [];
  var rows = [];
  try {
    rows = BohemiaStanding.becauseOf(minds, fid, '@', ctMinuteNow(),
                                     ctFactionOfMind, limit || 3) || [];
  } catch(_e){ return []; }
  var out = [];
  for (var i = 0; i < rows.length; i++){
    var w = CT_DEED_WORDS[rows[i].kind]; if (!w) continue;
    out.push({ kind: rows[i].kind, force: rows[i].force, heard: rows[i].heard,
               say: rows[i].heard ? w.heard : w.saw });
  }
  return out;
}
/* __CITY_SIDECOST__ -- WHAT YOU STAND AT WITH EVERYBODY."""

# ------------------------------------------------- 3. IT SAYS SO ON THE CARD
OLD_CARD = """  if(fid) body += ctRow('RUNS WITH', String(fid).toUpperCase());"""
NEW_CARD = """  if(fid) body += ctRow('RUNS WITH', String(fid).toUpperCase());
  /* """ + MARKER + """ -- AND WHAT THAT OUTFIT HAS SEEN OF YOU.
     A SEPARATE ROW, NEVER APPENDED TO RUNS WITH. gates/faction_arc_gate.js reads
     RUNS WITH as the faction id -- `const fid = row('RUNS WITH')` -- and on 8/26
     hanging one extra word off that row took the arc gate from 93 claims to
     79/13. The row above is a machine-readable answer and it stays one.
     draft:true -- his to edit. */
  if(fid){
    try {
      var __tv = ctTheirView(fid);
      var __TF = String(fid).toUpperCase();
      if(__tv && __tv.rung){
        body += ctRow('WHAT THE ' + __TF + ' THINKS',
          __tv.rung + ' \\u00b7 ' + __tv.whoSaw + ' OF ITS PEOPLE '
          + (__tv.whoSaw === 1 ? 'CARRIES' : 'CARRY') + ' SOMETHING');
        var __why = ctWhyTheyThinkThat(fid, 2);
        for(var __w = 0; __w < __why.length; __w++)
          body += ctNote('Somebody in the ' + __TF + ' ' + __why[__w].say + '.');
      } else if(__tv && __tv.members > 0){
        /* TRUE WITH AN EMPTY TABLE, WHICH IS WHY IT IS THE DEFAULT LINE. A mind
           exists only for somebody you have been near, so this is a headcount of
           the people in that outfit who have been where you have been, and a
           headcount needs no ruling from anybody. */
        body += ctRow('THE ' + __TF + ' HAS SEEN YOU',
          __tv.members + ' OF ITS PEOPLE');
        body += ctNote('That is how many of them have been close enough to you to'
          + ' remember it. Being seen is the only way an outfit comes to know'
          + ' anything about you.');
      }
    } catch(_e){
      if(!ctIntroRows.__tvwarn){ ctIntroRows.__tvwarn = 1;
        console.error('BOHEMIA: the their-view row threw and was swallowed. '
          + _e.message); }
    }
  }"""

# --------------------------------------------- 4. AND THE BOARD KEEPS THE LIST
OLD_BOARD = """function ctVouchedHtml(){"""
NEW_BOARD = """/* """ + MARKER + """ -- WHOSE PEOPLE HAVE LAID EYES ON YOU, AND WHOSE HAVE NOT.
   Bounded by what you have actually done: an outfit appears here if you have met
   one of its people OR you have given it something. An outfit you have neither
   met nor touched is not news and does not get a row.

   THE SECOND CASE IS THE ONE WORTH THE SCREEN. An outfit you have been giving to
   whose people have never once seen you is a real and common state in this
   valley -- the nearest base is twenty-nine cells from the spawn -- and no
   surface in the game has ever said it out loud. */
function ctSeenByHtml(){
  if (typeof BohemiaStanding === 'undefined') return '';
  var gave = {};
  try { gave = ctStandings() || {}; } catch(_e){ gave = {}; }
  var names = {}, k;
  for (k in gave) names[k] = 1;
  for (k in CT_MINDS){ var mm = CT_MINDS[k]; if (mm && mm.fid) names[mm.fid] = 1; }
  var rows = [];
  for (k in names){
    var v = ctTheirView(k);
    var members = v ? (v.members || 0) : 0;
    if (!members && !(gave[k] > 0)) continue;
    rows.push({ fid: String(k).toUpperCase(), members: members,
                rung: v ? v.rung : null, whoSaw: v ? (v.whoSaw || 0) : 0,
                gave: gave[k] || 0 });
  }
  if (!rows.length) return '';
  /* the ones who have seen you first, then the ones who have not: the second
     group is a list of places you have not been, and it reads as one. */
  rows.sort(function(a, b){ return (b.members - a.members)
                                || (a.fid < b.fid ? -1 : 1); });
  var h = '<div class="obhead2">WHO HAS LAID EYES ON YOU</div>';
  for (var i = 0; i < rows.length; i++){
    var r = rows[i];
    var said = r.rung
      ? r.rung + ' \\u00b7 ' + r.whoSaw + ' OF THEM '
        + (r.whoSaw === 1 ? 'CARRIES' : 'CARRY') + ' SOMETHING'
      : (r.members
           ? r.members + ' OF THEIR PEOPLE '
             + (r.members === 1 ? 'HAS' : 'HAVE') + ' SEEN YOU'
           : 'HAS NEVER LAID EYES ON YOU');
    h += '<div class="obv' + (r.members ? '' : ' isyours') + '">'
       + '<span class="obvwho">' + r.fid + '</span>'
       + '<span class="obvwhere">' + said + '</span>'
       + '</div>';
  }
  return h;
}
function ctVouchedHtml(){"""

# BOTH RETURN PATHS. ctOutfitHtml's empty-state return fires whenever your own
# outfit holds no positions, which is most of the game -- patching one path and
# not the other shipped the vouch list into the branch nobody was in, one turn
# ago. Same function, same trap, so both are named explicitly here.
OLD_EMPTY_TAIL = """      + ' and it does not empty again.</div>' + ctVouchedHtml() + ctValleyHtml();"""
NEW_EMPTY_TAIL = """      + ' and it does not empty again.</div>' + ctSeenByHtml() + ctVouchedHtml()
      + ctValleyHtml();"""

OLD_TAIL = """  return h + ctVouchedHtml() + ctValleyHtml();"""
NEW_TAIL = """  return h + ctSeenByHtml() + ctVouchedHtml() + ctValleyHtml();"""

# ------------------------------- 5. A COMMENT THAT ASSERTED THE MISSING WIRING
OLD_LIE = """   object forceOf() closes over, so assigning properties on it lights up
   opinionOf, standingOf, becauseOf and the rungs with no other wiring at all."""
NEW_LIE = """   object forceOf() closes over, so assigning properties on it lights up
   opinionOf, standingOf, becauseOf and the rungs with no other wiring at all.
   """ + MARKER + """ -- THAT LAST SENTENCE WAS TRUE OF THE MODULE AND FALSE OF
   THIS PAGE. opinionOf was called. standingOf and becauseOf were called by
   NOTHING ANYWHERE, so his dial could fill the table perfectly and neither one
   would ever run. The claim is accurate again as of the their-view wiring
   below; it is left standing rather than deleted because a comment that
   promised wiring it did not have is worth one warning to the next reader."""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if 'function ctVouchedHtml' not in s:
        sys.exit('FAIL: run tools/bohemia_city_yourproblem_patch.py first')
    if 'CT_DEED_WORDS' not in s:
        sys.exit('FAIL: the deed words are missing; standing is not wired here')

    for old, new, what in ((OLD_STAMP, NEW_STAMP, 'the witness stamp'),
                           (OLD_ORGAN, NEW_ORGAN, 'the organ block'),
                           (OLD_CARD, NEW_CARD, 'the card row'),
                           (OLD_BOARD, NEW_BOARD, 'the board list'),
                           (OLD_EMPTY_TAIL, NEW_EMPTY_TAIL, 'the empty board tail'),
                           (OLD_TAIL, NEW_TAIL, 'the board tail'),
                           (OLD_LIE, NEW_LIE, 'the dial comment')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY THEIR-VIEW: rule 4 is on the surface')
    print('  TAB: RUN. An affiliated person\'s card says what their outfit has')
    print('  seen of you; the OUTFIT board says who has never laid eyes on you.')


if __name__ == '__main__':
    main()
