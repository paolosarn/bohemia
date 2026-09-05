#!/usr/bin/env python3
"""BOHEMIA THE CROWD CARRIES THE SIGN (9/5/26, PEOPLE lane).
VAMILY [who is hostile], row THE-CROWD-CARRIES-THE-SIGN.

THE ROW: "the between-ledger already computes who is hostile to you (sorted
hostile-first, they charge more, 'only enemies watch you'). None of that reaches
the street. Make the sign visible in the crowd: they watch, they follow, they
block a door, they refuse."

*** MEASURED ON THE REAL SURFACE BEFORE ANY OF THIS WAS WRITTEN. ***
  - 0 of 61 people within three neighbourhoods of the spawn run with ANYBODY.
    The nearest base is 29 cells out and a base's pull reaches 12.
  - Of fourteen outfits only THREE can ever be at odds with you (Cartel,
    Caravans, Remnants) and their bases sit 48, 60 and 62 cells from the spawn.
  - Your own outfit starts with NO enemies and earns them the second you side
    with somebody: side with the Caravans and the Cartel is against you.
  - 82 deed weights load at runtime off his quest files, and all 82 are QUEST
    deeds -- the four street deeds (claim:met, claim:refused, commit, favour)
    are UNWEIGHTED, so street behaviour moves nobody's opinion yet.
So hostility toward the player is REAL and it is FAR, and person-level hostility
is one ruling away. Building the sign on either channel alone would have shipped
a feature that is dark everywhere a demo player walks. It reads BOTH.

WHAT LANDS ON THE STREET, all four signs the row names:
  WATCH   pplFace turns an enemy's head to you inside SEE_RANGE. One line, in
          the function that already decides which way a body looks.
  FOLLOW  WORLD MOVERS LAW (7/5): nothing moves until you do. One step of theirs
          per step of yours, out of stepOnce, stopping at two cells because the
          gossip pass already ruled that two cells is arm's length plus one.
  BLOCK   at WAR level they take the cell you are about to walk into -- a
          DOORWAY when this valley has one (stepOnce's own measurement says it
          mostly does not: 7 painted doors, ten of fourteen district types with
          none) and otherwise the cell in front of you. Same sentence, and it is
          the OCCUPANCY LAW this game already has.
  REFUSE  the card leads with it, and the ask/give offers are withdrawn.

  python3 tools/bohemia_city_against_patch.py

Gate: gates/against_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_AGAINST__'

MOD_OPEN = '/* ==== engine/bohemia_against.js (THE CROWD CARRIES THE SIGN, inlined verbatim) ==== */'
MOD_CLOSE = '/* ==== /engine/bohemia_against.js (THE CROWD CARRIES THE SIGN) ==== */'
MOD_SRC = 'engine/bohemia_against.js'

# ---------------------------------------------------------------------------
# 1. THE MODULE, INLINED, right after the deed ledger it reads from.
STANDING_CLOSE = '/* ==== /engine/bohemia_standing.js (THE DEED LEDGER) ==== */'
INLINE = STANDING_CLOSE + '\n\n' + MOD_OPEN + '\n' + MOD_CLOSE + '\n'

# ---------------------------------------------------------------------------
# 2. THE JOIN. One question, asked of a body.
FACTION_ANCHOR = 'function ctFactionOf(p){'

FACTION_NEW = r"""/* ==== __CITY_AGAINST__ : IS THIS PERSON AGAINST ME =========================
   TWO CHANNELS, ONE QUESTION. Their outfit's position on yours, and their own
   opinion of you. Both already existed and neither had ever reached a body on
   the street -- which is the row's entire complaint, word for word.

   NEITHER LADDER IS RE-IMPLEMENTED HERE. The rung word comes out of
   BohemiaStanding.rungFor and the sign comes off the BohemiaBetween edge; this
   function only hands both to BohemiaAgainst.read and returns what it says.

   MEMOISED, BECAUSE peoplePass ASKS IT FOR EVERY VISIBLE BODY EVERY FRAME.
   ctFactionOf walks the base list and hashes a seat; opinionOf walks a mind.
   Neither is expensive once and both are wasteful sixty times a second. The key
   carries the two things that really change the answer -- a bump the writers
   ring, and the hour, so a decaying opinion is re-read without a timer.
   ========================================================================== */
/* *** THE SEAT BUG, FOUND BY RUNNING IT, AND IT WAS ALREADY SHIPPED. ***
   The obvious way to ask this is between(theirOutfit, myOutfit) and IT RETURNS
   NULL FOR EVERY ENEMY YOU EARNED. Measured: side with the Remnants and the
   save holds CUSTOM -> CARTEL, war, exactly as it should -- and
   between('Cartel','Custom') is null, because an EARNED edge is written in one
   seat while his AUTHORED pairs happen to be written in both. So the one case
   that matters most, the enemy the player made with their own hands, was
   invisible from the side the street asks from.
   ripples() is the function that already knows this: it walks both seats and
   flips the far one. myRipples() is that, from your own outfit, and it had ZERO
   CALLERS anywhere in the repo -- a finished organ nobody was using, sitting
   next to a question it answers exactly. So this asks it. */
function ctRelToMine(fid){
  if (!fid || typeof BohemiaBetween === 'undefined') return null;
  var want = String(fid).toUpperCase().replace(/[\s_]/g,'');
  var rip = [];
  try { rip = BohemiaBetween.myRipples(ctBelongSave()) || []; } catch(_e){ return null; }
  for (var i = 0; i < rip.length; i++)
    if (String(rip[i].to).toUpperCase().replace(/[\s_]/g,'') === want) return rip[i];
  return null;
}
var CT_AGAINST = {}, CT_AGAINST_BUMP = 0;
/* RUNG BY THE THINGS THAT CHANGE THE ANSWER: a commitment that earns you an
   enemy, his STANDING dial landing new weights, and a vouch that moves somebody
   into an outfit. Anything that forgets to ring this goes stale for an hour,
   which is why it is one function and not three copies of a delete. */
function ctAgainstBump(){ CT_AGAINST_BUMP++; CT_AGAINST = {}; }
function ctAgainstMe(p){
  if (typeof BohemiaAgainst === 'undefined' || !p || p.id == null) return null;
  var key = p.id + '|' + CT_AGAINST_BUMP + '|' + Math.floor(ctMinuteNow() / 60);
  if (Object.prototype.hasOwnProperty.call(CT_AGAINST, key)) return CT_AGAINST[key];
  var rel = null, rung = null;
  try { rel = ctRelToMine(ctFactionOf(p)); } catch(_e){}
  try { var op = ctOpinionOf(p.id); if (op) rung = op.rung; } catch(_e){}
  var ans = null;
  try { ans = BohemiaAgainst.read({ rel: rel, rung: rung }); } catch(_e){ ans = null; }
  CT_AGAINST[key] = ans;
  return ans;
}
/* HOW FAR AN ENEMY CAN SEE YOU. BohemiaStanding's own constant, asked rather
   than copied: nine tiles, "because that is how far you can SEE it happen". */
function ctSeeRange(){
  try { return BohemiaStanding.SEE_RANGE | 0; } catch(_e){ return 9; }
}

function ctFactionOf(p){"""

# ---------------------------------------------------------------------------
# 3. WATCH. The function that already decides which way a body looks.
FACE_OLD = """function pplFace(p, at) {
  if (at[0] === p.home[0] && at[1] === p.home[1]) return _DIRS8[p.face % 8];
  return dirOf(at[0] - p.home[0], at[1] - p.home[1]);
}"""

FACE_NEW = r"""function pplFace(p, at) {
  /* __CITY_AGAINST__ -- AND AN ENEMY LOOKS AT YOU. bohemia_between has carried
     the comment "only enemies watch you" since 8/26 and no body in this game
     had ever turned its head. This is that sentence, on the glass.
     IT WINS OVER THE WALK because it is a stronger fact about this second than
     which way they came from: somebody who has stopped to watch you is not
     still facing their commute. */
  try {
    var ag = ctAgainstMe(p);
    if (ag && ag.signs.watch && !(at[0] === hx && at[1] === hy)
        && BohemiaAgainst.inSight(at, [hx, hy], ctSeeRange()))
      return dirOf(hx - at[0], hy - at[1]);
  } catch (_e) {}
  if (at[0] === p.home[0] && at[1] === p.home[1]) return _DIRS8[p.face % 8];
  return dirOf(at[0] - p.home[0], at[1] - p.home[1]);
}"""

# ---------------------------------------------------------------------------
# 4. FOLLOW + BLOCK. The schedule still decides where everybody else is.
AT_OLD = """function pplAt(p) {
  const b = BohemiaAgents.whereAt(p, T.min | 0);"""

AT_NEW = r"""/* __CITY_AGAINST__ -- WHERE THE SCHEDULE SAYS THEY ARE, kept separate from
   where they actually ARE. A follower is off their schedule by definition, and
   ctFollowStep needs the spot they would be standing on if they were not
   following you -- so the two answers are two functions and can never be
   confused for one another. */
function pplAtSched(p) {
  const b = BohemiaAgents.whereAt(p, T.min | 0);"""

AT_TAIL_OLD = """  if (BohemiaPopulation.atFavourite(p, T.min | 0)) return p.favSpot || p.outSpot;
  return p.outSpot;
}"""

AT_TAIL_NEW = r"""  if (BohemiaPopulation.atFavourite(p, T.min | 0)) return p.favSpot || p.outSpot;
  return p.outSpot;
}
/* WHERE THEY ACTUALLY ARE. Their schedule, unless they have walked off it to
   stay near you -- which is the only thing in this world that overrides the
   address book, and it takes an enemy to do it. */
function pplAt(p) {
  var f = CT_FOLLOW[p.id];
  if (f) return f;
  return pplAtSched(p);
}

/* ==== __CITY_AGAINST__ : THEY FOLLOW, AND THEY STAND IN THE DOORWAY ========
   WORLD MOVERS LAW (Paolo 7/5/26): "NOTHING moves until you do." So this is not
   a chase loop and there is no timer: it runs once per step the player takes,
   out of stepOnce, and every enemy in sight takes exactly one step. Walk away
   and they walk after you; get far enough and they go back to their day.

   ONLY BODIES THAT WERE ON THE GLASS. BARK_DREW is the render's own list of who
   was actually drawn, the same list the witness pass and the gossip pass read.
   Somebody the camera has never contained cannot be following you, and building
   a second idea of "who is near" is how two surfaces start disagreeing.
   ========================================================================== */
var CT_FOLLOW = {};
function ctFollowStep(){
  if (typeof BohemiaAgainst === 'undefined') return 0;
  var drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
  var live = {}, moved = 0, range = ctSeeRange();
  /* *** OCCUPANCY LAW, AND THE FIRST CUT BROKE IT IN FRONT OF ME. *** Three
     Cartel bodies followed the player for six hundred steps and every one of
     them converged on the SAME CELL, because each asked "one step toward him"
     with no idea the other two existed -- three men standing inside each other.
     The law is one body per cell, player included. So the pass keeps the cells
     it has handed out and a follower who wants an occupied one holds where it
     is; the next step it tries again from there, so they fan out behind you
     instead of stacking. */
  var taken = {}; taken[hx + ',' + hy] = 1;
  for (var i = 0; i < drew.length; i++) {
    var p = drew[i] && drew[i].p; if (!p || p.id == null) continue;
    var ag = null; try { ag = ctAgainstMe(p); } catch(_e){}
    if (!ag || !ag.signs.follow) continue;
    var was = CT_FOLLOW[p.id] || pplAtSched(p);
    if (!BohemiaAgainst.inSight(was, [hx, hy], range)) continue;   /* lost you */
    /* GETTING IN YOUR WAY COMES FIRST, because a body that has stepped into
       your path is not also drifting toward you -- it is already exactly where
       it wants to be. WAR ONLY; a merely hostile follower never does this. */
    var door = (ag.signs.block) ? ctBlockCell(was) : null;
    var free = function (sx, sy) { return !taken[sx + ',' + sy] && pplStandable(sx, sy); };
    var now = door ? door : BohemiaAgainst.follow(was, [hx, hy], free);
    /* *** AND HOLDING IS NOT A FREE PASS THROUGH THE LAW. *** The first fix
       only guarded the cell a follower STEPPED to, so the two that had nowhere
       to go both fell back to `was` -- and if somebody was already standing
       there, they stacked anyway. Measured: six collisions in three hundred
       steps, which is five more than zero. A boxed-out follower steps ASIDE,
       which is what a person does, and only holds when every neighbour is
       taken too. */
    if (taken[now[0] + ',' + now[1]]) now = ctStepAside(was, taken, free);
    if (!now) continue;      /* boxed in on all sides: they are not going anywhere */
    if (now[0] !== was[0] || now[1] !== was[1]) moved++;
    taken[now[0] + ',' + now[1]] = 1;
    CT_FOLLOW[p.id] = now; live[p.id] = 1;
  }
  /* AND EVERYBODY ELSE GOES BACK TO THEIR DAY. A follower who is no longer in
     sight, no longer an enemy, or no longer drawn stops being a special case
     entirely rather than freezing where they stood -- a body parked forever off
     its own schedule is a ghost, and this game has shipped enough of those. */
  for (var k in CT_FOLLOW) if (!live[k]) delete CT_FOLLOW[k];
  return moved;
}

/* WHERE A BOXED-OUT FOLLOWER GOES. Two rounds of this were wrong before it was
   right, and both were the same mistake in a smaller coat: guarding the cell
   somebody STEPPED to while letting the cell they HELD collide. Measured on the
   real surface, three Cartel bodies over three hundred steps: 6 collisions,
   then 2, then 0.
   THE ORDER IS THE POINT. A crowded follower would rather keep its distance
   than shove, so it prefers a free neighbour no closer than KEEP; it takes a
   closer one only when the polite ring is full, because being crowded a cell
   nearer is a real thing that happens and two men inside each other is not; and
   it never, ever takes the cell the player is standing on. If everything is
   taken it stays out of the pass entirely rather than pretending to move. */
function ctStepAside(was, taken, free){
  var ring = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
  var near = null;
  for (var v = 0; v < ring.length; v++) {
    var ax = was[0] + ring[v][0], ay = was[1] + ring[v][1];
    if (ax === hx && ay === hy) continue;              /* never onto the player */
    if (!free(ax, ay)) continue;
    if (Math.max(Math.abs(hx - ax), Math.abs(hy - ay)) >= BohemiaAgainst.KEEP)
      return [ax, ay];
    if (!near) near = [ax, ay];
  }
  if (near) return near;
  /* their own cell, only if it really is theirs alone and is not yours */
  if (!taken[was[0] + ',' + was[1]]) return was;
  return null;
}

/* WHERE A BLOCKER PUTS ITSELF. THE ROW SAYS "THEY BLOCK A DOOR" AND THE MAP
   SAYS THERE ARE ALMOST NO DOORS: stepOnce's own measurement, written in this
   file, is "39,706 solid cells admit you, 7 painted doors exist ... TEN OF
   FOURTEEN district types have zero of either", and this gate found NO door
   within forty cells of the ground the Cartel actually live on. A sign wired
   only to doorways would have been correct and invisible, which is the failure
   this whole job was measured to avoid.
   SO A DOORWAY IS THE SPECIAL CASE AND THE GENERAL ONE IS THE CELL YOU ARE
   ABOUT TO WALK INTO. That is the same sentence -- they get in your way -- and
   it is the OCCUPANCY LAW this game already has: one body per cell, and if the
   body is at war with you it is not moving for you.
   THE DOOR STILL WINS WHEN THERE IS ONE, because standing in a doorway reads
   better than standing in a street and because that is the row's own word.
   pplStandable refuses a threshold on purpose ("a doorway is a threshold, not a
   place to stand"); a blocker is the one exception, which is exactly what makes
   it read as blocking rather than as loitering. */
function ctBlockCell(from){
  var reach = function (cx, cy) {
    return Math.max(Math.abs(cx - from[0]), Math.abs(cy - from[1])) <= 1
        && !(cx === hx && cy === hy);
  };
  /* 1. A DOORWAY BESIDE YOU, if this valley has one here at all. */
  if (typeof isDoorCell === 'function' && typeof cellAt === 'function') {
    for (var dy = -1; dy <= 1; dy++)
    for (var dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      var cx = hx + dx, cy = hy + dy, c = cellAt(cx, cy);
      if (c && c.enter && isDoorCell(c) && reach(cx, cy)) return [cx, cy];
    }
  }
  /* 2. OTHERWISE THE CELL IN FRONT OF YOU. HFACE is the way the player is
     already facing -- the direction the next step would go -- so this is
     literally getting in your way rather than a guess at where you are headed. */
  var v = (typeof PPL_DIRV !== 'undefined' && PPL_DIRV[HFACE]) || null;
  if (!v) return null;
  var nx = hx + v[0], ny = hy + v[1];
  if (!reach(nx, ny) || !pplStandable(nx, ny)) return null;
  return [nx, ny];
}

/* IS SOMEBODY AT WAR WITH YOU STANDING IN THIS CELL. Read by stepOnce before it
   moves you into it. */
function ctBlocked(cx, cy){
  for (var k in CT_FOLLOW) {
    var f = CT_FOLLOW[k];
    if (f && f[0] === cx && f[1] === cy) return k;
  }
  return null;
}

/* AND IT SAYS SO, IN THE STREET'S OWN MOUTH. #packline is where a walked
   encounter already puts its one line; a bounced step that says nothing reads
   as broken controls, and a SECOND line element would be a second place to look
   for the same kind of sentence. draft:true.
   IT DOES NOT SAY "DOORWAY", because most of the time it is not one -- this
   valley has seven painted doors. Saying the specific thing when the general
   thing happened is how a surface starts lying quietly. */
var CT_AGAINST_SAY = 'somebody steps into your way. they meant to.';  /* draft:true */
function ctAgainstSay(){
  var l = document.getElementById('packline');
  if (!l) return 0;
  l.textContent = CT_AGAINST_SAY;
  l.style.display = 'block';
  return 1;
}"""

# ---------------------------------------------------------------------------
# 5. THE STEP. One of theirs per one of yours.
WALKBLOCK_OLD = """      if(!(c&&c.walk))break;"""
WALKBLOCK_NEW = """      /* __CITY_AGAINST__ -- AND A BODY AT WAR WITH YOU DOES NOT MOVE FOR YOU.
         OCCUPANCY LAW is one body per cell and this is the first thing in the
         game that enforces it against the player. Before the walkability test,
         because a blocked cell is blocked whatever the ground is.
         THIS CANNOT TRAP YOU AND THE GATE PROVES IT: a blocker holds ONE cell
         and only the one you are facing, so seven directions are untouched, and
         they only hold it while they can see you. */
      if(typeof ctBlocked === 'function' && ctBlocked(nx,ny)){
        HFACE=dirOf(dx,dy);
        try{ ctAgainstSay(); }catch(_e){}
        break;
      }
      if(!(c&&c.walk))break;"""

STEP_OLD = """      try { walkInterrupt(5.04); } catch(_e){}"""
STEP_NEW = """      try { walkInterrupt(5.04); } catch(_e){}
      /* __CITY_AGAINST__ -- AND EVERY ENEMY IN SIGHT TAKES A STEP. WORLD MOVERS
         LAW: nothing moves until you do, so this is here and nowhere else. */
      try { ctFollowStep(); } catch(_e){}"""

# and the door refuses while somebody is in it
DOOR_OLD = """          if(isDoorCell(c)){
            if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; }
          }"""
DOOR_NEW = """          if(isDoorCell(c)){
            /* __CITY_AGAINST__ -- UNLESS SOMEBODY IS STANDING IN IT. A body at
               WAR with your outfit takes the doorway and the doorway stops
               being a way in while they are there. THIS CANNOT TRAP YOU: it is
               one cell, every other direction is untouched, and they only hold
               it while you are beside it. */
            if(typeof ctBlocked === 'function' && ctBlocked(nx,ny)){
              HFACE=dirOf(dx,dy);
              try{ ctAgainstSay(); }catch(_e){}
              return false;
            }
            if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; }
          }"""

# ---------------------------------------------------------------------------
# 6. REFUSE. The card leads with it and the offers are withdrawn.
# THE PERSON CARD, NOT THE OTHER ONE. This exact block appears TWICE, twenty
# lines apart, and the first copy belongs to a different branch -- so the anchor
# carries the row that follows it, which only the person card has. A NAME YOU
# GUESSED IS NOT A MEASUREMENT and neither is an anchor.
CARD_OLD = """  try {
    var kd = ctKnownDeeds(p.id, 2);
    for (var kdi = 0; kdi < kd.length; kdi++)
      body += ctRow(kd[kdi].heard ? 'HEARD' : 'SAW', kd[kdi].say);
  } catch(_e){}
  /* __CITY_FACTIONS__ -- THE SIXTEEN INTRODUCTIONS DECIDE THIS ROW."""
CARD_NEW = r"""  /* __CITY_AGAINST__ -- AND IT LEADS, because a person who is against you is
     not a person you are having a normal conversation with, and every row below
     reads differently once you know. Their behaviour on the street is said out
     loud here too: a body that turned to watch you and then followed you down
     the block is doing something the player can SEE, and a card that does not
     explain it leaves them guessing at a bug. draft:true, all of it. */
  var CT_AG = null;
  try { CT_AG = ctAgainstMe(p); } catch(_e){}
  if (CT_AG) {
    body += ctRow('THEY ARE AGAINST YOU', CT_AG.word);
    try {
      var sg = BohemiaAgainst.signsOf(CT_AG);
      for (var sgi = 0; sgi < sg.length; sgi++) body += ctRow('AND', sg[sgi].say);
    } catch(_e){}
  }
  try {
    var kd = ctKnownDeeds(p.id, 2);
    for (var kdi = 0; kdi < kd.length; kdi++)
      body += ctRow(kd[kdi].heard ? 'HEARD' : 'SAW', kd[kdi].say);
  } catch(_e){}
  /* __CITY_FACTIONS__ -- THE SIXTEEN INTRODUCTIONS DECIDE THIS ROW."""

ASK_OLD = """  if(ctBtn) body+='<button id="ctask">'+ctBtn+'</button>';"""
ASK_NEW = """  /* __CITY_AGAINST__ -- THEY REFUSE. An enemy does not answer your questions,
     and offering a button that is going to be a lie is worse than not offering
     it. The sentence stays so the door is visibly shut rather than missing. */
  if(ctBtn && CT_AG && CT_AG.signs.refuse) body += ctNote('They are not going to '
    + 'answer you.');
  else if(ctBtn) body+='<button id="ctask">'+ctBtn+'</button>';"""

GIVE_OLD = """  if(ctAct && !ctFavIsAct) body+='<button id="ctgive">'+ctAct.label+'</button>';"""
GIVE_NEW = """  /* __CITY_AGAINST__ -- AND THEY WILL NOT TAKE ANYTHING OFF YOU EITHER. */
  if(ctAct && !ctFavIsAct && CT_AG && CT_AG.signs.refuse)
    body += ctNote('They will not take anything off you.');
  else if(ctAct && !ctFavIsAct) body+='<button id="ctgive">'+ctAct.label+'</button>';"""

# ---------------------------------------------------------------------------
# 7. RING THE BUMP where the answer really changes.
BUMP_OLD = """          CT_EARNED = BohemiaBetween.earn(sv, ctFid, r.state, (T && T.day) || 1);
          if(CT_EARNED && CT_EARNED.length) ctOutfitBadge();"""
BUMP_NEW = """          CT_EARNED = BohemiaBetween.earn(sv, ctFid, r.state, (T && T.day) || 1);
          if(CT_EARNED && CT_EARNED.length) ctOutfitBadge();
          /* __CITY_AGAINST__ -- YOU JUST MADE ENEMIES AND THE STREET HAS TO
             KNOW THIS SECOND, not when the memo cache happens to roll over. */
          try{ ctAgainstBump(); }catch(_e){}"""

DIAL_OLD = """  if (save !== false) ctDialSave();
  try { if (CT_OPEN) ctDraw(); } catch(_e){}
  return n;"""
DIAL_NEW = """  if (save !== false) ctDialSave();
  /* __CITY_AGAINST__ -- his STANDING dial changes who is against you. */
  try{ ctAgainstBump(); }catch(_e){}
  try { if (CT_OPEN) ctDraw(); } catch(_e){}
  return n;"""

# ---------------------------------------------------------------------------
# 8. THE SAME SEAT BUG, IN A ROW THAT ALREADY SHIPPED. "AND THEY ARE UP AGAINST
# YOU" was written for exactly the case it could never see: its own comment says
# "an outfit YOU made an enemy of shows its own history too", and it asked
# between(fid, mine), which is null for every earned edge. Fixed at the root
# rather than worked around, and both callers now ask the one function.
SEAT_OLD = """        var ctMineRel = BohemiaBetween.between(fid, BohemiaBetween.mine(),
                                               ctBelongSave());"""
SEAT_NEW = """        /* __CITY_AGAINST__ -- ASKED FROM THE SEAT THE ANSWER IS WRITTEN IN.
           This was between(fid, mine), which returns null for every enemy the
           player EARNED -- an earned edge is stored in one seat and this row
           asked from the other, so the row written for "an outfit you made an
           enemy of" was the one thing it could never show. ctRelToMine goes
           through myRipples, which walks both seats and flips the far one. */
        var ctMineRel = ctRelToMine(fid);"""


def refresh_block(html, opener, closer, src):
    """Copy the inlined module forward EVERY run. A one-shot patch that no-ops on
    its own marker will happily leave a stale copy inlined while the engine file
    on disk is correct -- the invisible-hats shape, which bit this lane twice in
    one hour on 8/30."""
    a = html.find(opener)
    if a < 0:
        sys.exit('FAILED: the inlined module opener is not in %s.' % CITY)
    b = html.find(closer, a + len(opener))
    if b < 0:
        sys.exit('FAILED: the inlined module closer is not in %s.' % CITY)
    cur = html[a + len(opener):b]
    fresh = '\n' + open(src, encoding='utf-8').read()
    if not fresh.endswith('\n'):
        fresh += '\n'
    if cur == fresh:
        return html, False
    return html[:a + len(opener)] + fresh + html[b:], True


STEPS = [
    ('the inlined module fence', STANDING_CLOSE, INLINE),
    ('the join', FACTION_ANCHOR, FACTION_NEW),
    ('they watch', FACE_OLD, FACE_NEW),
    ('the schedule spot', AT_OLD, AT_NEW),
    ('they follow', AT_TAIL_OLD, AT_TAIL_NEW),
    ('one step of theirs per step of yours', STEP_OLD, STEP_NEW),
    ('the blocked doorway', DOOR_OLD, DOOR_NEW),
    ('the blocked step', WALKBLOCK_OLD, WALKBLOCK_NEW),
    ('the card leads with it', CARD_OLD, CARD_NEW),
    ('they will not answer', ASK_OLD, ASK_NEW),
    ('they will not take anything', GIVE_OLD, GIVE_NEW),
    ('the bump on a commitment', BUMP_OLD, BUMP_NEW),
    ('the bump on his dial', DIAL_OLD, DIAL_NEW),
    ('the seat bug in the up-against row', SEAT_OLD, SEAT_NEW),
]


def main():
    html = open(CITY, encoding='utf-8').read()
    notes = []
    if MARK not in html:
        for name, anchor, _rep in STEPS:
            if html.count(anchor) != 1:
                sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                         % (name, html.count(anchor), CITY))
        for _name, anchor, rep in STEPS:
            html = html.replace(anchor, rep, 1)
        notes.append('the crowd carries the sign')
    html, fresh = refresh_block(html, MOD_OPEN, MOD_CLOSE, MOD_SRC)
    if fresh:
        notes.append('the inlined against module, which was older than the file')
    if not notes:
        print('  already applied  ' + CITY)
        return
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  [' + '; '.join(notes) + ']')


if __name__ == '__main__':
    main()
