#!/usr/bin/env python3
"""BOHEMIA CITY MEMORY -- THE BLOCK STARTS TO KNOW YOUR FACE.

*** NOBODY IN THIS GAME HAS EVER REMEMBERED SEEING YOU. ***
engine/bohemia_memory.js is the witness organ: minds hold sightings, familiarity
slows forgetting, clarity decays as 0.5^(age/halflife), all deterministic. It was
written 7/19 and it is in ZERO files a player can reach -- measured 8/20, it
appears in no slice at all. engine/bohemia_standing.js (8/2) sits on top of it and
is equally unreachable. That is 45 green gate assertions about people remembering
you, and not one person in the game who has ever remembered anything.

The city itself already wrote this down and nothing acted on it. In xchWorld's own
comment, 8/18: "bohemia_deeds.js and bohemia_standing.js both exist in engine/ and
NEITHER IS IN THIS FILE (measured 8/18: zero occurrences)". A finding recorded in a
comment is not a finding fixed. Twelfth built-and-gated-and-unreachable capability
this lane has closed.

*** WHO CAN SEE YOU IS WHO THE GAME ACTUALLY DREW. ***
The witnesses are read off BARK_DREW -- the list peoplePass fills with the bodies
it really blitted this frame, positions included. A second visibility calculation
would be a second answer, and the two would drift the first time either changed;
worse, it could credit a sighting to somebody who is not on screen. The render is
the ground truth for who is present, so the render is what this reads. (Same
reason the tell reads qkOf(): one answer per person, not two.)

*** RECOGNITION IS NOT A NAME, SO YOU HAVE TO ASK (7/31) IS UNTOUCHED. ***
nameOf() still returns null for a stranger and nothing here ever prints a name.
But a face is not a name. Somebody can know they have seen you around without
having been introduced, and that is exactly the difference between a crowd and a
neighbourhood. Same reasoning that put the tell on a stranger.

*** AND IT HAD TO BE VISIBLE AT THE MOMENT IT CHANGES OR IT IS NOTHING. ***
The reputation literature (the 2024 FDG belief-formation work the standing module
already cites, and the d20 reputation-check pattern) agrees on one thing: a
recognition system the player cannot SEE working is indistinguishable from no
system at all. So it rides the tell -- already the first thing this game says
about a stranger, already on screen the moment you stand next to somebody -- as a
short leading clause. No new surface, no thirteenth row on the card.

WHAT IS DELIBERATELY NOT HERE. No opinion, no gossip, no standing rung: those are
bohemia_standing.js on top of this organ, and they need DEEDS, which need the
player to be able to DO something the block can judge. Wiring the witness half
first is what makes the rest possible and it is honest on its own. And no
mechanical bonus for being known -- what recognition is WORTH is a dial, and
NO DAMAGE BEFORE THE DIAL.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no pixels and opens no bank. It
inlines engine/bohemia_memory.js verbatim rather than reimplementing any of it,
reads witnesses from the render's own BARK_DREW, takes its clock from T.day/T.min
(the day loop that walking finally moves since the 8/19 fix), and styles nothing
-- the recognition clause rides the existing #cttell element and its palette.

  python3 tools/bohemia_city_memory_patch.py
Gate: gates/city_memory_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MEM = os.path.join(ROOT, 'engine', 'bohemia_memory.js')

BEGIN = '/* ==== engine/bohemia_memory.js (THE WITNESS ORGAN, inlined verbatim) ==== */'
END = '/* ==== /engine/bohemia_memory.js (THE WITNESS ORGAN) ==== */'
# *** THE REGION HAS TO END SOMEWHERE OR THE REFRESH IS AN APPEND. ***
# The first cut replaced BEGIN..END and then wrote STORE after it -- but STORE was
# already sitting there from the previous run, so a second run grew the file by
# 105 lines and every run after that would have grown it again. A whole-region
# replace is a DELETE PLUS AN INSERT, and I had only written the insert half.
# Proved by md5: two runs, two different hashes. Now the marker names where the
# region actually stops.
STORE_END = '/* ==== /__CITY_MEMORY__ store ==== */'

# The quirk block's closing banner: a one-line, stable anchor that this lane owns.
INLINE_ANCHOR = '/* ==== /engine/bohemia_quirk.js (ONE THING THAT IS THEIRS) ==== */'

STORE = r'''
/* __CITY_MEMORY__ -- WHOSE MIND IS WHOSE, AND IT SURVIVES A RELOAD.
   One mind per person, made on first sight rather than for the whole valley:
   makeMind is cheap but 298 of them for people you have never been near is a
   census, not a memory. Keyed by the person's stable id, the same key CT_MET
   uses, so the two ledgers agree about who somebody is.
   PERSISTED beside CT_MET under its own localStorage key. A block that forgets
   you every time the page reloads is not a memory, it is a session variable, and
   the whole point of familiarity is that it accrues across days. */
var CT_MINDS = (function(){
  try {
    var raw = JSON.parse(localStorage.getItem('boh.city.minds') || 'null');
    if (raw && typeof raw === 'object') return raw;
  } catch (_e) {}
  return {};
})();
function ctMindSave(){
  try { localStorage.setItem('boh.city.minds', JSON.stringify(CT_MINDS)); } catch(_e){}
}
function ctMind(id){
  if (!CT_MINDS[id]) CT_MINDS[id] = BohemiaMemory.makeMind(id);
  var m = CT_MINDS[id];
  /* a mind restored from JSON is a plain object; the module only ever reads
     fields, never methods, so this is all the rehydration there is. */
  if (!m.sightings) m.sightings = [];
  if (!m.fam) m.fam = {};
  return m;
}
/* THE CLOCK THE ORGAN COUNTS IN. bohemia_memory measures ages in MINUTES
   (BASE_HALFLIFE is 12*60), and T.min wraps at midnight, so the day has to be
   carried or every sighting looks like it happened moments ago at 00:01 and a
   face you saw yesterday reads as fresh. */
function ctMinuteNow(){ return (T.day|0) * 1440 + (T.min|0); }

/* __CITY_MEMORY__ -- THEY SEE YOU WALK PAST.
   Reads the render's own BARK_DREW so a witness is, by construction, somebody
   who is actually on screen. The player is the subject '@', which is the token
   bohemia_memory's own attach() uses for the player, so the two agree without a
   second convention.
   ONE PASS PER MINUTE, NOT PER FRAME. see() refreshes rather than duplicating
   inside its 30-minute window, so a per-frame call is not WRONG -- but it is 60
   pointless walks of the roster every second, and the familiarity counter only
   moves on a 5-minute gap anyway. Gated on the minute actually changing, which
   costs one integer compare on the frames that do nothing.

   *** AND THE THROTTLE MUST NOT SPEND A MINUTE IT DID NOTHING WITH. ***
   The first cut marked CT_SAW_MIN before reading the roster, and that one line
   cost the whole feature at the only moment it matters. peoplePass returns early
   while PLAYER_CV is still baking -- "no body yet: draw nobody, never a
   placeholder" -- so the boot render leaves BARK_DREW EMPTY. The pass ran,
   recorded nobody, and claimed the minute anyway; every later render in that
   same minute short-circuited. MEASURED on the real surface: minds 0 after
   render, and forcing the gate open recorded immediately. The effect was that
   the neighbour standing TWO CELLS AWAY at spawn never saw you until you had
   walked a full game-minute, which is twelve cells, which is out of his sight.
   A THROTTLE THAT MARKS THE WORK DONE BEFORE DOING IT IS A DROPPED FRAME WITH A
   RECEIPT. The minute is consumed only when there was actually a roster to
   read. */
var CT_SAW_MIN = -1;
function ctWitnessPass(){
  if (typeof BohemiaMemory === 'undefined') return 0;
  var now = ctMinuteNow();
  if (now === CT_SAW_MIN) return 0;
  var R = BohemiaMemory.RADIUS, n = 0;
  var drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
  if (!drew.length) return 0;             /* nothing drawn yet: retry next frame */
  CT_SAW_MIN = now;
  for (var i = 0; i < drew.length; i++) {
    var d = drew[i]; if (!d || !d.p || !d.at) continue;
    /* SEEING IS RECIPROCAL AND IT IS NOT FREE. Manhattan, the same metric the
       organ's own attach() uses, so a body eight cells away is a witness here
       exactly when it would be one there. */
    if (Math.abs(d.at[0] - hx) + Math.abs(d.at[1] - hy) > R) continue;
    try { BohemiaMemory.see(ctMind(d.p.id), now, '@', hx, hy); n++; } catch(_e){}
  }
  if (n) ctMindSave();
  return n;
}

/* __CITY_MEMORY__ -- WHAT THIS PERSON REMEMBERS OF YOU, in the four states the
   organ's own numbers already draw a line between. Nothing is invented: clarity
   is 0.5^(age/halflife) and halflife grows with familiarity, so these are that
   curve read out loud.
   *** DRAFT WORDS (ALWAYS MAKE AN ATTEMPT, 8/11). *** Real attempts, written as
   if they ship, and every one of them is Paolo's to rewrite. They live HERE, in
   one table, so there is exactly one place to edit them. */
var CT_KNOWS = [
  { at: 0.62, fam: 3, say: 'knows you by now' },      /* draft */
  { at: 0.62, fam: 0, say: 'has seen you before' },   /* draft */
  { at: 0.30, fam: 0, say: 'half-remembers you' },    /* draft */
  { at: 0.00, fam: 0, say: 'almost places you' }      /* draft */
];
function ctKnowsMe(id){
  if (typeof BohemiaMemory === 'undefined') return null;
  var m = CT_MINDS[id]; if (!m) return null;                 /* never been near you */
  var r = null;
  try { r = BohemiaMemory.recall(m, '@', ctMinuteNow()); } catch(_e){ return null; }
  if (!r) return null;                                       /* faded past MIN_CLARITY */
  var fam = (m.fam && m.fam['@']) || 0;
  for (var i = 0; i < CT_KNOWS.length; i++) {
    var k = CT_KNOWS[i];
    if (r.clarity >= k.at && fam >= k.fam) return { say: k.say, clarity: r.clarity, fam: fam };
  }
  return null;
}
'''

TELL_ANCHOR = """  window.__CT_TELL=tell||null;
  if(t){
    if(tell){ t.textContent=tell; t.style.display='block'; }
    else t.style.display='none';
  }"""

TELL_NEW = """  /* __CITY_MEMORY__ -- AND WHETHER THEY KNOW YOUR FACE.
     A RECOGNITION IS NOT A NAME. YOU HAVE TO ASK (7/31) governs the name and
     nothing here prints one -- this says only that somebody has seen you around,
     which is a thing you can read off a person without being introduced.
     IT LEADS, because it is the part that changed since last time. The tell is
     true of them on any day; this is true of you and them together, and it is
     the only line in the game that is different because of where you have been.
     Falls back to the bare tell when nobody has ever seen you, so a stranger
     reads exactly as a stranger did before. */
  var knows=null;
  try { knows=ctKnowsMe(p.id); } catch(_e){}
  window.__CT_KNOWS = knows ? knows.say : null;
  var line = tell || null;
  if (knows) line = knows.say + (tell ? ' \\u00b7 ' + tell : '');
  window.__CT_TELL=line||null;
  if(t){
    if(line){ t.textContent=line; t.style.display='block'; }
    else t.style.display='none';
  }"""

# ctVerb hands ctPerson() the adjacency record; the person's stable id lives on
# the record `p`, not on the derived `who`, so the recall is keyed off p.
SEE_ANCHOR = "  peoplePass(ox,oy,C);\n"
SEE_NEW = ("  peoplePass(ox,oy,C);\n"
           "  try{ ctWitnessPass(); }catch(_e){}   /* __CITY_MEMORY__ */\n")


def cut_ok(s, needle, label):
    n = s.count(needle)
    if n != 1:
        sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times, not 1.' % (label, n))


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    if not os.path.exists(MEM):
        sys.exit('FAIL: ' + MEM + ' not found')
    s = open(CITY, encoding='utf-8').read()
    before = s
    n_before = s.count('\n')

    mem = open(MEM, encoding='utf-8').read()

    block = BEGIN + '\n' + mem + '\n' + END + STORE + STORE_END + '\n'

    if BEGIN in s:
        # THE BLOCK IS REPLACED WHOLE, never appended: an insert tool run twice is
        # a duplication tool (the CHARACTER lane's 8/11 lesson). The region runs
        # BEGIN..STORE_END, so the delete half covers everything the insert half
        # writes -- md5-identical on a second run.
        cut_ok(s, BEGIN, 'organ begin')
        cut_ok(s, STORE_END, 'store end')
        i = s.index(BEGIN)
        j = s.index(STORE_END) + len(STORE_END) + 1
        s = s[:i] + block + s[j:]
        open(CITY, 'w', encoding='utf-8').write(s)
        print('CITY MEMORY: refreshed the inlined organ. %+d lines'
              % (s.count('\n') - n_before))
        return

    cut_ok(s, INLINE_ANCHOR, 'inline')
    s = s.replace(INLINE_ANCHOR, INLINE_ANCHOR + '\n\n' + block, 1)
    cut_ok(s, SEE_ANCHOR, 'witness pass')
    s = s.replace(SEE_ANCHOR, SEE_NEW, 1)
    cut_ok(s, TELL_ANCHOR, 'tell recognition')
    s = s.replace(TELL_ANCHOR, TELL_NEW, 1)

    # A WIRING PATCH ONLY EVER ADDS. 8/17: a sibling tool in this lane removed
    # 2,607 lines of another lane's work because an anchor had moved, and 8/20 my
    # own opening patch ate 47 more. The guard is cheap and it is not optional.
    grew = s.count('\n') - n_before
    if grew < 0:
        sys.exit('REFUSING TO WRITE: this would REMOVE %d lines from the city.' % -grew)

    if s == before:
        print('CITY MEMORY: nothing to do.')
        return
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY MEMORY: +%d lines' % grew)
    print('  organ    : %d' % s.count('root.BohemiaMemory=API'))
    print('  witness  : %d' % s.count('ctWitnessPass()'))
    print('  knows    : %d' % s.count('ctKnowsMe('))
    print('  city     : %.1f MB' % (os.path.getsize(CITY) / 1e6))


if __name__ == '__main__':
    main()
