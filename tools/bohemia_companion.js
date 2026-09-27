/* ============================================================================
   BOHEMIA -- WHO WALKS WITH YOU (9/21/26, PEOPLE lane, [walking companion]).

   PAOLO 9/7: "I don't know about the companion right now, have it on shuffle
   mode." So there is NO FIXED COMPANION AND NO FIXED NAME. Whoever walks with
   you is DRAWN FROM THE PEOPLE ALREADY AROUND YOU, shuffled per save, named
   from the pools that already exist, every word draft:true.

   *** MEASURED ON THE ALPHA BEFORE A LINE OF THIS WAS WRITTEN: NOBODY WALKS
   WITH YOU AND NOBODY EVER HAS. *** 0 of 61 people on his block answer
   "follow", 0 are hostile, 0 are watching, and the follow map is empty and
   stays empty over ten walked steps. THE PIPE ITSELF IS FINE: stub one person
   into answering "follow" and somebody enters the map on the very first pass.
   What is missing is not machinery, it is A REASON FOR A FRIEND TO USE IT --
   today only an enemy is ever allowed to walk after you.

   THIS FILE IS THE REASON, AND IT INVENTS NOTHING. It is pure: no DOM, no game
   globals, no clock. It takes what the world already knows about the people
   around you and answers three questions the row asks:

     WHO      would plausibly walk with you, drawn from the world, shuffled
     WANTS    something of their own that is already in the world
     REFUSES  one thing, set from their own standing

   NOTHING HERE IS ON THE PLAY SURFACE. Rule 18 holds this lane, so no game
   file calls this; the gate and the vote page do. When the hold lifts, the
   walked city calls pick() and hands the answer to the follow pass that this
   round proved already works.

   REALISM FIRST. Nobody in a collapsed valley walks with a stranger for
   nothing. Every reason below is one that would actually move a person:
     OWED        you owe them, and walking with you is how they get paid
     OWING       they owe you, and being useful is cheaper than being hunted
     NO SHIFT    their work is gone, so their day is empty and yours is not
     SAFER       alone is worse than beside somebody, which is why people
                 travelled in pairs in every collapse anybody has recorded
   A person with none of these does not follow you, and that is most people.

   module.exports = { pick, reasons, DIAL }
   ========================================================================== */
'use strict';

/* THE DIAL, draft:true. Paolo has ruled on none of these numbers, so they ship
   as a real attempt in one place he can change with a word, never sprayed
   through the code (MECHANISM-MINE / CONTENTS-PAOLO'S). */
var DIAL = {
  draft: true,
  reach: 9,          /* cells: the game's own ctSeeRange, not a new number */
  shortlist: 4,      /* how many candidates the shuffle considers */
  minScore: 1        /* one real reason is enough; zero reasons is not */
};

/* WHY SOMEBODY WOULD WALK WITH YOU. The order is the strength: a debt moves a
   person harder than an empty afternoon does. */
var REASONS = [
  { key: 'owed',    weight: 4,
    say: 'you owe them, and walking with you is how they get paid' },
  { key: 'owing',   weight: 3,
    say: 'they owe you, and being useful is cheaper than being hunted' },
  { key: 'noshift', weight: 2,
    say: 'their work is gone, so their day is empty and yours is not' },
  { key: 'safer',   weight: 1,
    say: 'alone is worse than beside somebody' }
];

/* WHAT THEY WANT, and every one of these is a thing the world already holds:
   a debt in the ledger, a person in their household, a place they go. Nothing
   here is a new system and nothing here is a number. */
var WANTS = {
  owed:    'to be paid what you owe them',
  owing:   'to clear what they owe you',
  noshift: 'a day\'s work that pays in batteries',
  safer:   'to get home before dark with what they are carrying'
};

/* SAME SEED, SAME ANSWER, FOREVER, ON ANY PHONE, WITH NOTHING STORED. The
   player's own face pipe works this way and so does the name bank; a companion
   that shuffles differently on a reload is not shuffled, it is broken. */
function mix(s) {
  var v = s >>> 0;
  v ^= v >>> 16; v = Math.imul(v, 0x7feb352d);
  v ^= v >>> 15; v = Math.imul(v, 0x846ca68b);
  v ^= v >>> 16;
  return v >>> 0;
}
function seedOf(save, id) {
  var h = mix(save >>> 0), s = String(id);
  for (var i = 0; i < s.length; i++) h = mix(h ^ s.charCodeAt(i));
  return h >>> 0;
}

/* WHY THIS PERSON, ASKED OF FACTS THE WORLD ALREADY HAS.
   Every field read here is one the caller got from the game, never guessed:
     p.owedByYou   you owe them (the lender ledger already answers this)
     p.owesYou     they owe you
     p.work        where their shift is, or nothing
     p.dist        how many cells away they are right now
   A missing field is a NO, never a maybe: an absent fact cannot be a reason. */
function reasons(p) {
  var out = [];
  if (!p) return out;
  if (p.owedByYou) out.push(REASONS[0]);
  if (p.owesYou)   out.push(REASONS[1]);
  if (!p.work)     out.push(REASONS[2]);
  if (p.dist != null && p.dist <= DIAL.reach) out.push(REASONS[3]);
  return out;
}
function score(p) {
  var r = reasons(p), n = 0;
  for (var i = 0; i < r.length; i++) n += r[i].weight;
  return n;
}

/* WHAT THEY WILL NOT DO, AND IT COMES OFF THEIR OWN STANDING, NOT OFF A LIST I
   WROTE. A person who runs with a faction will not cross that faction. A person
   with somebody at home will not rob a house. A person with neither refuses the
   one thing everybody refuses: they will not be the one who starts it.
   THE PERSON IS NAMED BY THE CALLER, NEVER HERE: names are his. */
function refusal(p) {
  if (!p) return null;
  if (p.faction) return { kind: 'faction', who: p.faction,
    say: 'will not cross the ' + p.faction };
  if (p.household) return { kind: 'house',
    say: 'will not rob a house with somebody living in it' };
  return { kind: 'start', say: 'will not be the one who starts it' };
}

/* THE DRAW. Shuffled per save, off the people who actually have a reason.
   NOT "the best one": the strongest reasons make the shortlist, and the save
   picks from inside it, so two saves on the same block get different people
   and neither gets somebody with no reason to be there. */
function pick(people, save) {
  if (!people || !people.length) return null;
  var able = [];
  for (var i = 0; i < people.length; i++) {
    var p = people[i];
    if (!p || p.id == null) continue;
    if (p.dist != null && p.dist > DIAL.reach) continue;   /* out of reach is out */
    var sc = score(p);
    if (sc < DIAL.minScore) continue;
    able.push({ p: p, score: sc });
  }
  if (!able.length) return null;
  able.sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return String(a.p.id) < String(b.p.id) ? -1 : 1;        /* stable, no clock */
  });
  var pool = able.slice(0, Math.max(1, DIAL.shortlist | 0));
  var hit = pool[seedOf(save, 'companion') % pool.length];
  var rs = reasons(hit.p);
  var top = rs.length ? rs[0] : null;
  return {
    id: hit.p.id,
    score: hit.score,
    why: top ? top.say : null,
    whyKey: top ? top.key : null,
    wants: top ? WANTS[top.key] : null,
    refuses: refusal(hit.p),
    outOf: able.length,
    draft: true
  };
}

/* ==========================================================================
   *** WHEN SOMEBODY FALLS IN BESIDE YOU, AND IT IS NEVER AT THE FIRST SECOND.
   (9/24, [bb company]. Rule 32a, and Battle Brothers' own answer.) ***

   pick() above says WHO WOULD. This says WHEN, and the difference is the whole
   of rule 32a. A stranger who attaches himself to you the instant the world
   exists is the thing Paolo has now complained about three times:
   "don't force interactions on the player".

   AND BATTLE BROTHERS AGREES WITH HIM. You do not get a brother by walking
   past one. You stand in front of him, he tells you what he used to be, and
   THEN you take him on. The background is the introduction; the handshake is
   separate and it is yours.

   SO THE RULE IS: THEY TOLD YOU WHO THEY USED TO BE, AND YOU WERE STILL THERE.
   Nothing to press. Walking on is the refusal and it costs nothing, which is
   what "nothing is forced" means when you build it instead of writing it down.

   WHAT THIS IS NOT: it is not the PRICE of keeping somebody. That is ruled and
   it is FACTIONS' row [take them on] -- one battery a night on a handshake --
   and putting a price in here would be doing another lane's job. */
var JOIN = {
  draft: true,
  afterBeats: 2,     /* beats between hearing them and them falling in: long
                        enough that walking on takes you out of it */
  /* *** HOW FAR IS "STILL THERE" IS MEASURED IN PRESSES, NOT IN CELLS, AND THAT
     COST THIS ROUND A MEASUREMENT TO LEARN. *** The first cut of this rule said
     6 cells, copied off the city's speaking-to-you distance. Then the alpha was
     measured: ONE PRESS MOVES THE PLAYER FOURTEEN CELLS, because THE STEP IS A
     HOUSE (Paolo 9/15). A rule written in cells that is smaller than one press
     can never be true after the player moves, so "still there" would have meant
     "did not move at all". One press away is still beside you; two is walking
     away. The SIZE of a press is the world's and is handed in. */
  stayPresses: 1,
  stay: 6            /* the fallback in cells, for a caller that cannot say how
                        big a press is. Never used by the walked city. */
};

/* joins(m) -- m is facts the caller already has, never a person:
     told        did they tell you what they used to be
     beatsSince  beats since they told you
     cells       how far away they are RIGHT NOW
     onePress    how many cells one press of the pad carries the player
     already     is somebody already walking with you
   Returns { yes:true } or { no:'<the reason, in plain words>' }. A reason is
   returned rather than a bare false so a gate and a record read the same
   sentence, and so "nobody joined" can never be confused with "nothing ran". */
function joins(m) {
  if (!m) return { no: 'nothing to read' };
  if (m.already)  return { no: 'somebody is already walking with you' };
  if (!m.told)    return { no: 'they have not told you anything yet' };
  if ((m.beatsSince | 0) < JOIN.afterBeats)
                  return { no: 'you only just heard them' };
  var within = (m.onePress > 0)
    ? (m.onePress | 0) * Math.max(1, JOIN.stayPresses | 0)
    : JOIN.stay;
  if (m.cells == null || m.cells > within)
                  return { no: 'you walked away, which is the refusal' };
  return { yes: true, after: JOIN.afterBeats, within: within, draft: true };
}

var API = { pick: pick, reasons: reasons, refusal: refusal,
            score: score, DIAL: DIAL, REASONS: REASONS, WANTS: WANTS,
            JOIN: JOIN, joins: joins };
module.exports = API;
