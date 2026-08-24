#!/usr/bin/env python3
"""
I PUT THE OBJECTIVE HINT IN THE COPY INSTEAD OF THE CANON BODY
(8/24/26, RUN lane. ENGINE SYNC LAW, broken by me and caught by the machine.)

ENGINE SYNC LAW: one canonical body per module. `engine/bohemia_demoquests.js` is
that body; BOHEMIA_CITY_WORLD.html carries an INLINED COPY of it announced by a
banner. Yesterday's objective-hint work edited the copy -- D.nextStep and the new
D.hudLine went straight into the city -- so the copy stopped being the canon.

HOW IT WAS CAUGHT, AND IT IS THE GUARD DOING EXACTLY ITS JOB. INLINED FRESH runs
tools/bohemia_city_module_resync.py, which finds a module's body in the app by
matching a KNOWN historical body. An edited copy matches nothing, so it fell
through to the only path that GUESSES -- cut from this module's banner to the
next module's banner -- and demoquests is followed by DEMO_BQ, five whole quest
files inlined as a string. The cut came out at 59,775 bytes against a 12,296 byte
module and the 8/20 oversize guard refused to write:

    REFUSING: the banner cut for engine/bohemia_demoquests.js is 59775 bytes
    against a 12286 byte module -- that is not one module, it is this one plus
    whatever follows it. NOTHING WAS WRITTEN.

That guard was added for an incident its author could not reproduce and said so
in the file. It just paid for itself: without it the resync would have written
five quest files' worth of bytes over one module in the file the whole game is
played in.

MEASURED, NOT ASSUMED: INLINED FRESH is 3/0 on origin/main's city and 0/1 on
mine, same gate, same commit of the tool. Mine.

WHAT THIS DOES, in the order that matters:
  1. REVERT the city's inlined copy to the canon body it is supposed to be a
     copy of. This has to happen FIRST -- while the copy is edited it matches no
     historical body, and the resync's safe path cannot find it.
  2. APPLY the change to engine/bohemia_demoquests.js, the canon body.
  3. The caller then runs tools/bohemia_city_module_resync.py, which now matches
     the known body and writes the new canon into every surface that inlines it.

NOTHING ABOUT THE FEATURE CHANGES. The same nextStep, the same derived hint, the
same words. What changes is WHICH FILE OWNS IT -- and that is the whole of the
law: a fix that lives in a copy is a fix the next resync silently deletes.

REUSE CHECK: no graphic pixels cooked -- this moves JavaScript between two files,
so no banks/ lookup applies.

Idempotent.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
CANON = 'engine/bohemia_demoquests.js'

# ---- the block that must come OUT of the city's copy -----------------------
CITY_EDITED = """    /* the one line the HUD shows: the live objective, or the outcome */
    /* __HUD_NEVER_OVERLAPS__ (8/24). THE OBJECTIVE NEVER SAID WHAT TO DO.
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

# ---- what the canon body says today, and what the city must go back to -----
CANON_OLD = """    /* the one line the HUD shows: the live objective, or the outcome */
    D.hudLine = function () {
      if (!D.rt) return '';
      if (D.rt.state.done) return (D.rt.state.outcome === 'COMPLETE' ? 'DONE · ' : 'FAILED · ') + (D.Q.title || '');
      var objs = D.rt.objectives().filter(function (o) { return o.status === 'active'; });
      if (objs.length) return objs[0].text;
      return D.spec ? D.spec.brief : '';
    };"""

CANON_NEW = """    /* THE OBJECTIVE NEVER SAID WHAT TO DO (8/24, RUN lane).
       hudLine returned objs[0].text and dropped everything else, so day one read
       "Find why the block browns out" and nothing on screen mentioned a building
       or the dark -- while the day's own spec, declared a few hundred lines up,
       says exactly how the thing advances:
           advance: { stage: 20, on: 'enter_building', require: 'dark' }
       A friend walks past every door in the valley.
       DERIVED FROM THE RULE, NEVER WRITTEN PER QUEST, so the sentence cannot
       drift from the mechanic: change how a day advances and its hint changes
       with it, and every day's quest gets one without anybody authoring it.
       Words are a real attempt and his to edit (ALWAYS MAKE AN ATTEMPT, 8/11);
       the mechanic they describe is not mine to change.
       IT LIVES HERE AND NOT IN THE CITY'S INLINED COPY, which is where I put it
       first: ENGINE SYNC LAW, one canonical body per module. A fix that lives in
       a copy is a fix the next resync silently deletes. */
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
    /* the one line the HUD shows: the live objective, or the outcome */
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


def main():
    for p in (CITY, CANON):
        if not os.path.exists(p):
            sys.exit('FAIL: ' + p + ' not found')

    canon = open(CANON, encoding='utf8').read()
    city = open(CITY, encoding='utf8').read()

    if 'D.nextStep' in canon and 'D.nextStep' not in city:
        print('NOOP: nextStep is in the canon body and out of the copy; run the '
              'resync to put the canon copy back')
        return

    # ---- 1. the copy goes back to being a copy -----------------------------
    if CITY_EDITED in city:
        n = city.count(CITY_EDITED)
        if n != 1:
            sys.exit('FAIL: the edited block appears %d times in the city' % n)
        open(CITY, 'w', encoding='utf8').write(city.replace(CITY_EDITED, CANON_OLD, 1))
        print('REVERTED %s -- the inlined copy is a copy again, so the resync can '
              'find it by its known body' % CITY)
    else:
        print('NOOP: the city copy carries no hand edit')

    # ---- 2. the canon body gets the feature --------------------------------
    if 'D.nextStep' in canon:
        print('NOOP: %s already owns nextStep' % CANON)
        return
    n = canon.count(CANON_OLD)
    if n != 1:
        sys.exit('FAIL: hudLine anchor matched %d times in %s, expected 1' % (n, CANON))
    open(CANON, 'w', encoding='utf8').write(canon.replace(CANON_OLD, CANON_NEW, 1))
    print('PATCHED %s -- nextStep and the derived hint now live in the canon body' % CANON)
    print('NEXT: python3 tools/bohemia_city_module_resync.py')


if __name__ == '__main__':
    main()
