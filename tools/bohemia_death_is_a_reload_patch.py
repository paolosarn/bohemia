#!/usr/bin/env python3
"""
DEATH IS A RELOAD, AND ON THE SURFACE HE PLAYS IT WAS NOTHING AT ALL
(8/22/26, RUN lane. Migration, not invention.)

MEASURED, driving the real alpha and feeding the consumer the EXACT object combat
builds (ALPHA:7936), not a synthetic one:

    REAL LOSS -> playerHP 0, alive 3, result 'loss'
    the world said: "It went badly in there. You walked out anyway."

He is on the floor and the game tells him he strolled out. That line was MY
placeholder from yesterday -- honest while the mechanism was missing, and wrong
the moment there is a mechanism to have.

THE DESIGN IS ALREADY PAOLO'S AND ALREADY WRITTEN. From the run slice, verbatim:

    /* DEATH IS A RELOAD, NOT A RESET (Paolo 7/26): you go back to the closest
       previous save. Never a wipe, never start-from-the-beginning. */
    if(!d.victory){
      sfx('went_down');   /* HIS 8/16 SURVIVOR: the one of thirty-five he kept. */
      if(loadClosest()) toast('You went down. Back to your last save.');
      else toast('You went down, and there was no save to go back to.');
      return; }

So this INVENTS NOTHING. It carries a named ruling from the surface nobody sees
to the surface he plays, which is the whole job of this lane and exactly what the
integration ledger's `death_reload` row has been owed since the game moved house.

AND IT REUSES THE MACHINERY WHOLE. The city already has the entire restore path
built and running -- it is how a returning player gets his day back:

    city  -> {bohemiaCityNeedRestore:1}
    shell -> CITYSAVE.load()
          -> {bohemiaCityRestore: st}      or  {bohemiaCityRestoreNone:1}
    city  -> applyRestore(st)              or  carries on with no save

Going down asks the same question the boot asks. No second save system, no new
message, no private copy of applyRestore. A death path that grew its own restore
would be the third copy of the same thing and the exact drift this repo keeps
paying for.

THE SOUND IS HIS, AND IT IS APPROVED: `went_down`, "the one of thirty-five he
kept" (8/16). It is in records/BOHEMIA_SFX_FINGERPRINTS and the alpha already
knows how to play it; the city already has the channel (bohemiaCitySfx). Fired
BEFORE the rollback, because the sound belongs to going down and not to the save
that answers it -- that ordering is the run slice's own note and it is right.

STILL NO DAMAGE BEFORE THE DIAL. This does not invent health, wounds, or a
threshold. It reads the outcome combat ALREADY REPORTS (`victory:false`) and
answers it. What makes you lose a fight is combat's business and the dial is his;
what happens AFTER you have lost one is a ruling he already made in July.

Idempotent.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'

OLD = """  var line = won
    ? 'You walked out of that one.'                       /* draft:true */
    : 'It went badly in there. You walked out anyway.';   /* draft:true */
  try{ if(typeof DAY!=='undefined'&&DAY.happened) DAY.happened(line,'fight'); }catch(_e){}"""

NEW = """  /* __DEATH_IS_A_RELOAD__ (8/22). Yesterday this said "It went badly in there.
     You walked out anyway." for a LOSS -- measured against the real outcome
     object, that fires with playerHP 0 and three of them still standing, so the
     game told a man on the floor that he strolled out. That line was an honest
     placeholder while there was no mechanism; it is wrong the moment there is
     one.
     DEATH IS A RELOAD, NOT A RESET (Paolo 7/26): "you go back to the closest
     previous save. Never a wipe, never start-from-the-beginning." Carried here
     from the run slice, which has had it since July on a surface nobody sees.
     NOTHING NEW IS BUILT: going down asks the SAME question the boot asks --
     bohemiaCityNeedRestore -> the shell's CITYSAVE.load() -> bohemiaCityRestore
     or bohemiaCityRestoreNone -> applyRestore. A death path with its own restore
     would be the third copy of one thing. */
  var line = won
    ? 'You walked out of that one.'                       /* draft:true */
    : 'You went down. Back to your last save.';           /* draft:true */
  try{ if(typeof DAY!=='undefined'&&DAY.happened) DAY.happened(line,'fight'); }catch(_e){}
  if(!won){
    /* HIS SOUND, AND IT IS APPROVED: went_down, "the one of thirty-five he kept"
       (8/16). FIRED BEFORE THE ROLLBACK, because the sound belongs to going down
       and not to the save that answers it -- the run slice's own note, and right. */
    try{ window.parent.postMessage({bohemiaCitySfx:{ev:'went_down'}},'*'); }catch(_e){}
    try{ window.__WENT_DOWN={at:d.at||null,asked:true}; }catch(_e){}
    /* and the shell answers on the channel the boot already uses. If there is no
       save it replies bohemiaCityRestoreNone and he keeps standing where he is --
       which is the run slice's "there was no save to go back to", not a crash. */
    try{ window.parent.postMessage({bohemiaCityNeedRestore:1},'*'); }catch(_e){}
  }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if '__DEATH_IS_A_RELOAD__' in s:
        print('NOOP: going down already asks for the closest save')
        return
    if OLD not in s:
        sys.exit('FAIL: the fight-comes-home consumer is not where it was')

    # the machinery this REUSES must already exist, or it is not a migration
    for needle, why in (
            ('bohemiaCityNeedRestore', 'the restore request the boot already sends'),
            ('function applyRestore(', 'the restore the shell answers with'),
            ('bohemiaCityRestoreNone', 'the no-save answer'),
            ('bohemiaCitySfx', 'the sound channel')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s) -- this is supposed to REUSE the '
                     'built path, not grow a second one' % (needle, why))

    open(CITY, 'w', encoding='utf8').write(s.replace(OLD, NEW, 1))
    print('PATCHED %s -- going down plays his sound and asks for the closest save' % CITY)


if __name__ == '__main__':
    main()
