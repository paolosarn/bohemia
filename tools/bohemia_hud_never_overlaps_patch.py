#!/usr/bin/env python3
"""
THE ONE SENTENCE THAT TELLS HIM WHAT TO DO WAS PRINTED UNDER THE TOOLBAR
(8/24/26, RUN lane.)

MEASURED ON THE REAL ALPHA, boxes in the city frame's own coordinates, after
taking the day-one job the way a player takes it:

    qline    47..62    "Find why the block browns out"   z-index 7
    topbar   49..80     MUSIC / SAVE / PHONE / wrench     z-index 7

THIRTEEN OF THE OBJECTIVE'S FIFTEEN PIXELS ARE INSIDE THE TOOLBAR, and both sit
at z-index 7, so which one wins is decided by DOM order rather than by anybody's
intent. That line is the only thing in the game that tells a player what he is
supposed to be doing.

AND IT WAS NOT ALONE. The same sweep found two more pairs, all in one corner:

    rungbtn  699..730   note     714..754     16px of overlap
    bikebtn  760..792   sleepbtn 767..798     25px of overlap

*** AND THIS IS A REGRESSION AGAINST A FIX THAT ALREADY SHIPPED, BY MY OWN LANE.
*** On 7/29 the CITY lane found this exact bug in this exact corner and wrote
down the diagnosis:

    "four things live in that corner and every one of them was absolute-
     positioned with its own hardcoded offset, so none of them knows the others
     exist... The layout does the arithmetic instead of me."

It built #blstack, a bottom-left flex column, and moved #note, #bikebtn and
#fitbtn into it. Then the DAY LOOP -- mine -- added THREE MORE absolutely
positioned chips to the same corner with hardcoded offsets:

    #sleepbtn  bottom:6    #mktbtn  bottom:40    #rungbtn  bottom:74

which is the very bug that had just been fixed, committed six days later by the
lane that should have read the note above the CSS it was writing next to. And
the ladder has a hole in it: #mktbtn is display:none, so the 40 rung is empty and
#note (bottom:58) sits in the gap on top of #rungbtn (bottom:74).

THE FIX IS THE ONE ALREADY DESIGNED, APPLIED TO THE CHIPS THAT ARRIVED AFTER IT.
Nothing new is invented: the three day-loop chips JOIN #blstack and lose their
hardcoded offsets, and the top gets the same treatment with #tlstack so the
objective sits UNDER the toolbar and cannot be buried even when a long song title
makes the toolbar wrap to two rows.

THE ORDER IS DECLARED, NOT LEFT TO CREATION TIMING. The old adoption loop did
insertBefore(el, firstChild), so where a chip landed depended on which system
happened to build it first. The bottom-up order is now written down -- SLEEP
nearest the thumb, the transient hint furthest from it -- and re-asserted every
pass, so a rebuilt chip returns to its own place instead of to the front.

AND THE OBJECTIVE FINALLY SAYS WHAT TO DO. hudLine() returned objs[0].text and
threw everything else away. The day's spec DECLARES how the quest advances:

    day 1: advance: { stage: 20, on: 'enter_building', require: 'dark' }

so "Find why the block browns out" is finished by walking into a building with
no power. Nothing on screen said building, and nothing said dark. A friend walks
past every door in the valley. The next step is now DERIVED FROM THAT RULE rather
than written per quest, so it can never drift from the mechanic it describes --
if somebody changes how day one advances, the sentence changes with it. Every
day's quest gets one for free.

REUSE CHECK: no graphic pixels are cooked here. This is a CSS/DOM reflow of chips
that already exist plus one derived sentence, so no banks/ lookup applies --
reuse-first governs cooking NEW art and nothing is drawn.

WORDS: the next-step phrasings are a real attempt, tagged draft:true, per ALWAYS
MAKE AN ATTEMPT (8/11). They are the mechanic in plain English; the mechanic
itself is not mine to change.

Idempotent (marker __HUD_NEVER_OVERLAPS__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__HUD_NEVER_OVERLAPS__'

# ---------------------------------------------------------------- 1. the CSS
A1_OLD = """/* ==== BOTTOM-LEFT STACK (7/29): see tools/bohemia_city_bottomleft_patch.py."""

A1_NEW = """/* ==== TOP-LEFT STACK (8/24, """ + MARK + """) ==========================
   The same answer the bottom-left corner got on 7/29 and the toolbar got on
   7/25, applied to the last corner still doing arithmetic by hand. MEASURED
   BEFORE CHANGING IT, in the frame's own coordinates: #qline 47..62 and #topbar
   49..80, both z-index 7 -- thirteen of the objective's fifteen pixels were
   inside the toolbar, and the winner was decided by DOM order. The objective is
   the only sentence in the game that tells a player what to do.
   A COLUMN, so the toolbar can wrap to two rows on a long song title and the
   objective still lands underneath it instead of behind it. ==== */
#tlstack{position:absolute;left:6px;right:6px;top:8px;z-index:7;
  display:flex;flex-direction:column;align-items:stretch;gap:6px;
  pointer-events:none}
#tlstack>*{position:static !important;left:auto !important;right:auto !important;
  top:auto !important;bottom:auto !important;transform:none !important;
  margin:0 !important;width:auto !important}

/* ==== BOTTOM-LEFT STACK (7/29): see tools/bohemia_city_bottomleft_patch.py."""

# ------------------------------------------------- 2. the stacks own the chips
A2_OLD = """  ['bikebtn','fitbtn','note'].forEach(function(id){
    const el=document.getElementById(id);
    if(el&&el.parentNode!==s&&getComputedStyle(el).display!=='none')s.insertBefore(el,s.firstChild);
  });
  return s;
}
blStack(); setInterval(blStack,600);"""

A2_NEW = """  /* """ + MARK + """ (8/24): THE DAY LOOP ADDED THREE MORE CHIPS TO THIS
     CORNER AND NEVER JOINED THE COLUMN -- #sleepbtn bottom:6, #mktbtn bottom:40,
     #rungbtn bottom:74, each an absolute hardcoded offset, which is word for word
     the bug the note above this function describes fixing. Measured: bikebtn
     760..792 under sleepbtn 767..798, and note 714..754 under rungbtn 699..730.
     The ladder also has a HOLE -- #mktbtn is display:none, so the 40 rung is
     empty and the hint falls into the gap.
     AND THE ORDER IS DECLARED NOW. insertBefore(el, firstChild) meant a chip's
     position depended on which system happened to build it first; this list is
     bottom-up (the column is column-reverse, so DOM order runs bottom to top) and
     is re-asserted every pass, so a rebuilt chip goes back to its own place. */
  ['sleepbtn','bikebtn','fitbtn','mktbtn','rungbtn','note'].forEach(function(id){
    const el=document.getElementById(id);
    if(!el) return;
    if(getComputedStyle(el).display==='none'){
      /* a hidden chip leaves the column rather than holding an empty rung open */
      if(el.parentNode===s) s.removeChild(el);
      return; }
    s.appendChild(el);          /* appendChild REORDERS, which is what keeps the order true */
  });
  return s;
}
/* """ + MARK + """ -- the top-left column, same pattern, same reason. The
   toolbar goes in first and the objective under it, so a toolbar that wraps
   pushes the sentence down instead of covering it. */
function tlStack(){
  let s=document.getElementById('tlstack');
  if(!s){
    /* THE COLUMN HAS TO BE BORN IN THE TOOLBAR'S OWN PARENT. First cut appended
       it to .wrap, which is NOT what #topbar was positioned against: top:8 put
       the toolbar at y=49, so its offsetParent starts 41px down, below the clock
       bar. Hung off .wrap the same top:8 rendered at y=8 and dragged the whole
       toolbar UP INTO #hud -- five fresh collisions where there had been none,
       caught by this patch's own gate on its first run. Ask the element what it
       was positioned against instead of assuming, and capture it BEFORE adoption
       changes the answer. */
    const bar=document.getElementById('topbar');
    const w=(bar&&bar.offsetParent)||document.querySelector('.wrap')||document.body;
    s=document.createElement('div'); s.id='tlstack'; w.appendChild(s); }
  ['topbar','qline'].forEach(function(id){
    const el=document.getElementById(id);
    if(!el) return;
    if(getComputedStyle(el).display==='none'){ if(el.parentNode===s) s.removeChild(el); return; }
    s.appendChild(el);
  });
  return s;
}
blStack(); setInterval(blStack,600);
tlStack(); setInterval(tlStack,600);"""

# ------------------------------------------- 3. the objective says what to do
A3_OLD = """    D.hudLine = function () {
      if (!D.rt) return '';
      if (D.rt.state.done) return (D.rt.state.outcome === 'COMPLETE' ? 'DONE · ' : 'FAILED · ') + (D.Q.title || '');
      var objs = D.rt.objectives().filter(function (o) { return o.status === 'active'; });
      if (objs.length) return objs[0].text;
      return D.spec ? D.spec.brief : '';
    };"""

A3_NEW = """    /* """ + MARK + """ (8/24). THE OBJECTIVE NEVER SAID WHAT TO DO.
       hudLine returned objs[0].text and dropped everything else, so day one read
       "Find why the block browns out" and nothing on screen mentioned a building
       or the dark -- while the spec RIGHT THERE declares how the thing advances:
           advance: { stage: 20, on: 'enter_building', require: 'dark' }
       A friend walks past every door in the valley.
       DERIVED FROM THE RULE, NEVER WRITTEN PER QUEST, so the sentence cannot
       drift from the mechanic: change how a day advances and its hint changes
       with it, and every day's quest gets one without anybody authoring it.
       Words are a real attempt and his to edit (ALWAYS MAKE AN ATTEMPT, 8/11);
       the mechanic they describe is not mine to change. */
    D.nextStep = function () {
      var sp = D.spec, a = sp && sp.advance;
      if (!a || !D.rt) return '';
      if (!(D.rt.state.stage < a.stage)) return '';   /* the hint is for the step that is actually next */
      if (a.on === 'enter_building')
        return a.require === 'dark'
          ? 'get inside somewhere the power is out'      /* draft:true */
          : 'get inside one of these buildings';         /* draft:true */
      if (a.on === 'enter_district')
        return a.require === 'new'
          ? 'cross into a block you have not walked yet' /* draft:true */
          : 'get out onto another block';                /* draft:true */
      return '';
    };
    D.hudLine = function () {
      if (!D.rt) return '';
      if (D.rt.state.done) return (D.rt.state.outcome === 'COMPLETE' ? 'DONE · ' : 'FAILED · ') + (D.Q.title || '');
      var objs = D.rt.objectives().filter(function (o) { return o.status === 'active'; });
      if (objs.length) {
        var step = '';
        try { step = D.nextStep(); } catch (e) { step = ''; }
        return step ? (objs[0].text + ' · ' + step) : objs[0].text;
      }
      return D.spec ? D.spec.brief : '';
    };"""

EDITS = [
    (A1_OLD, A1_NEW, 'the top-left column exists'),
    (A2_OLD, A2_NEW, 'both stacks own every chip in their corner, in a declared order'),
    (A3_OLD, A3_NEW, 'the objective says what to do next, derived from the advance rule'),
]


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the HUD already lays itself out')
        return

    for needle, why in (
            ('function blStack()', 'the 7/29 bottom-left column this reuses'),
            ('#blstack{position:absolute', 'its CSS'),
            ('id="qline"', 'the objective line'),
            ('id="topbar"', 'the toolbar row')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))

    for old, new, what in EDITS:
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s' % CITY)
    for _o, _n, what in EDITS:
        print('  + ' + what)


if __name__ == '__main__':
    main()
