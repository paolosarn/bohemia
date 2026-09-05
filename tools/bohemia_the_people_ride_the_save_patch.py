#!/usr/bin/env python3
"""
THE PEOPLE RIDE THE SAVE  [people saved]
(9/4/26, RUN lane. VAMILY job BB-THE-PEOPLE-RIDE-THE-SAVE.)

    "DAY 21. THE WORLD IS INSIDE THE HARDENED SAVE AND THE PEOPLE ARE OUTSIDE IT."

engine/bohemia_save.js is the second-best-built thing in this repo: two slots
with a generation counter, an FNV-1a checksum, a probe the SIZE of the real save,
poisoning on write failure so a stale save can never be resurrected, a version
chain with migrations, and the whole phone path. save_iphone_gate drives it
against a hostile fake browser, 44 passed 0 failed. NOTHING ABOUT IT IS BROKEN.

THE GAP: the walked city makes ten localStorage writes. Four are dev tools. THE
OTHER FIVE ARE THE GAME'S MEMORY OF PEOPLE, and every one of them goes to raw
localStorage AROUND the hardened save:

    boh.city.minds        familiarity, per block, accruing across days
    boh.city.known        what he has been told and by whom
    boh.city.met          the met-ledger and every name he earned
    boh.city.belong       standing, commitments, debts
    boh.city.deedweight   the deed table the DIRECT tab tunes

MEASURED: all five appear ZERO times in citySnapshot. One slot each, no checksum,
no migration on four of five, and a silent catch on write failure -- THE EXACT
FOUR FAILURE MODES bohemia_save.js WAS WRITTEN TO KILL, REPRODUCED OUTSIDE ITS
WALLS.

WHAT IT COST, IN THE ROW'S OWN WORDS: export does not carry the people; a restore
gives you yesterday's world with today's population; and the two-slot rollback
DESYNCS -- the world rolls back one generation and the people do not. A TORN SAVE
ACROSS TWO SYSTEMS IS WORSE THAN A LOST ONE BECAUSE YOU CANNOT SEE THAT IT IS
WRONG, which is the belonging code's own comment one function above the break.

AND A CLEAN SLATE ONLY CLEANED TWO OF FIVE: __CT.wipe removed met and belong;
minds, known and deedweight survived it, under a comment that already read "A
WIPE THAT LEAVES HALF THE SAVE IS NOT A WIPE".

=== THIS IS WIRING, NOT INVENTION ==========================================

All five already serialise themselves. Nothing new is written here:
    met     CT_MET.serialize()            / BohemiaPeople.makeLedger(raw)
    minds   CT_MINDS (a plain object)     / assign
    known   knownLoad().serialize()       / BohemiaKnown.make(data)
    belong  window.__CT_BELONG.meta       / ctBelongPersist()
    deed    BohemiaStanding.DEED_WEIGHT   / ctDialApply(raw, save)

ENGINE SYNC LAW, one canonical body: the snapshot READS the live objects and the
restore WRITES them, and each one keeps its own key in step. No second copy of a
ledger exists anywhere in this patch.

=== WHY THE SAVE VERSION IS NOT BUMPED, WHICH IS A DECISION AND NOT AN OMISSION

`people` is an OPTIONAL block. An old save has no `people` and the restore skips
it, which is correct -- that save never had them. A new save read by an older
build is ignored rather than refused.

BUMPING WOULD BE WORSE. migrateCity refuses anything with v > CITY_SAVE_V by
name, so a bump makes every save written today UNREADABLE by any build that has
not shipped yet, to describe a field that is safely absent. The version chain
exists for changes that BREAK the old shape; adding an optional block does not.

=== AND THE DEED TABLE RIDES TOO, WHICH IS THE ONE JUDGMENT CALL ===========

The other four are unambiguously the world's memory. The deed table is a DIAL HE
TUNES in the DIRECT tab, so carrying it means importing a save also imports its
dials. THAT IS THE RIGHT ANSWER AND NOT AN ACCIDENT: a save that cannot reproduce
the numbers it was played under cannot reproduce the bug it was sent to show, and
the DIRECT tab pushes his live weights across the frame the moment he touches one,
so his own tuning re-lands the instant he changes anything. The row names five and
this carries five.

REUSE CHECK: cooks NO pixels and opens no banks/. It adds no storage key, no
serialiser and no format -- it moves five existing ones inside the save that was
already hardened.

Idempotent (marker __THE_PEOPLE_RIDE_THE_SAVE__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_PEOPLE_RIDE_THE_SAVE__'

# ------------------------------------------------------- 1. into the snapshot
SNAP_OLD = """    market:MKT_LEDGER?{ledger:MKT_LEDGER,bought:MKT_BOUGHT}:null   /* __THE_TRADING_HUB__ */ };"""

SNAP_NEW = """    market:MKT_LEDGER?{ledger:MKT_LEDGER,bought:MKT_BOUGHT}:null,   /* __THE_TRADING_HUB__ */
    /* """ + MARK + """ -- THE WORLD WAS INSIDE THE HARDENED SAVE AND THE PEOPLE
       WERE OUTSIDE IT. Five keys -- minds, known, met, belong, deedweight -- wrote
       to raw localStorage AROUND bohemia_save.js: one slot each, no checksum, no
       migration on four of five, and a silent catch on write failure, which is the
       exact four failure modes that module was written to kill. They appeared ZERO
       times here. So export did not carry the people, a restore gave yesterday's
       world with today's population, and the two-slot rollback DESYNCED. */
    people:(function(){ try{ return ctPeopleSave(); }catch(_e){ return null; } })() };"""

# ------------------------------------------------------- 2. out of the restore
REST_OLD = """  /* __KEEP_THIS_RUN__ */
  if(st.installAsked){ try{ INSTALL_ASKED=true; }catch(_e){} }"""

REST_NEW = """  /* __KEEP_THIS_RUN__ */
  if(st.installAsked){ try{ INSTALL_ASKED=true; }catch(_e){} }
  /* """ + MARK + """ -- AND THE PEOPLE COME WITH IT. Absent on any save written
     before today, which is correct: that save never had them. */
  if(st.people){ try{ ctPeopleLoad(st.people); }catch(_e){} }"""

# --------------------------------------------------------- 3. the two functions
FN_OLD = """function ctSave(){
  try{ localStorage.setItem('boh.city.met', JSON.stringify(CT_MET.serialize())); }catch(_e){}
  ctBelongPersist();          /* __CITY_BELONGSAVE__ */
}"""

FN_NEW = """function ctSave(){
  try{ localStorage.setItem('boh.city.met', JSON.stringify(CT_MET.serialize())); }catch(_e){}
  ctBelongPersist();          /* __CITY_BELONGSAVE__ */
}

/* ============================================================================
   """ + MARK + """ (9/4) -- THE FIVE, GATHERED IN ONE PLACE.

   WIRING, NOT INVENTION: every one of these already serialises itself and keeps
   its own key. This reads the LIVE objects and hands them to the hardened save,
   and the restore writes both the live object AND its key so the two systems can
   never disagree -- which is the desync the row is about.

   EACH ONE IS GUARDED ON ITS OWN. A blob that cannot be read is skipped, never
   half-applied: "a partially restored standing is worse than a fresh one because
   you cannot see that it is wrong" is the belonging code's own rule and it holds
   for all five.
   ========================================================================== */
function ctPeopleSave(){
  var out = {}, n = 0;
  try{ out.met    = CT_MET.serialize();                              n++; }catch(_e){}
  try{ out.minds  = CT_MINDS;                                        n++; }catch(_e){}
  try{ var k = knownLoad(); out.known = k ? k.serialize() : null;    n++; }catch(_e){}
  try{ var b = window.__CT_BELONG; out.belong = (b && b.meta) ? b.meta : null; n++; }catch(_e){}
  try{ out.deed   = BohemiaStanding.DEED_WEIGHT;                     n++; }catch(_e){}
  return n ? out : null;
}

function ctPeopleLoad(p){
  if(!p || typeof p !== 'object') return 0;
  var n = 0;
  /* THE LIVE OBJECT AND ITS KEY MOVE TOGETHER. Setting only the live object
     would leave the key holding yesterday's people, and the next ctSave would
     write the restored one back over it -- a race whose loser is invisible. */
  try{ if(p.met){ CT_MET = BohemiaPeople.makeLedger(p.met);
        localStorage.setItem('boh.city.met', JSON.stringify(p.met)); n++; } }catch(_e){}
  try{ if(p.minds && typeof p.minds === 'object'){ CT_MINDS = p.minds;
        localStorage.setItem('boh.city.minds', JSON.stringify(CT_MINDS)); n++; } }catch(_e){}
  try{ if(p.known){ KNOWN = BohemiaKnown.make(p.known);
        localStorage.setItem('boh.city.known', JSON.stringify(KNOWN.serialize())); n++; } }catch(_e){}
  try{ if(p.belong && typeof p.belong === 'object'){
        window.__CT_BELONG = window.__CT_BELONG || {};
        window.__CT_BELONG.meta = p.belong;
        ctBelongPersist(); n++; } }catch(_e){}
  /* THE DEED TABLE RIDES TOO, and that is deliberate: a save that cannot
     reproduce the numbers it was played under cannot reproduce the bug it was
     sent to show. His live tuning re-lands the moment he touches the DIRECT tab,
     which pushes across the frame. */
  try{ if(p.deed && typeof p.deed === 'object'){ ctDialApply(p.deed, true); n++; } }catch(_e){}
  window.__PEOPLE_RESTORED = n;
  return n;
}

/* A WIPE THAT LEAVES HALF THE SAVE IS NOT A WIPE -- the comment was already
   there and it was already true of three of the five. """ + MARK + """ */
function ctPeopleWipe(){
  var keys = ['boh.city.met','boh.city.minds','boh.city.known',
              'boh.city.belong','boh.city.deedweight'];
  for(var i=0;i<keys.length;i++){ try{ localStorage.removeItem(keys[i]); }catch(_e){} }
  try{ CT_MET = BohemiaPeople.makeLedger(null); }catch(_e){}
  try{ CT_MINDS = {}; }catch(_e){}
  try{ KNOWN = null; }catch(_e){}
  try{ window.__CT_BELONG = null; }catch(_e){}
  return keys.length;
}"""

# ------------------------------------------------------------- 4. the wipe verb
WIPE_OLD = """              wipe:function(){ try{localStorage.removeItem('boh.city.met');}catch(_e){}
                /* __CITY_BELONGSAVE__ -- A WIPE THAT LEAVES HALF THE SAVE IS NOT A
                   WIPE. This removed only the met-ledger, which would have left a
                   player's standing and commitments behind after they asked for a
                   clean slate. */
                try{localStorage.removeItem(CT_BELONG_KEY); window.__CT_BELONG=null;}catch(_e){}
                               CT_MET=BohemiaPeople.makeLedger(null); } };"""

WIPE_NEW = """              /* """ + MARK + """ (9/4) -- AND IT CLEANS ALL FIVE NOW.
                 __CITY_BELONGSAVE__ wrote "A WIPE THAT LEAVES HALF THE SAVE IS NOT
                 A WIPE" and then fixed two of five: met and belong went, and MINDS,
                 KNOWN and DEEDWEIGHT survived a clean slate. The comment was right
                 and it was describing itself. One list, so there is no sixth key to
                 forget next time. */
              wipe:function(){ try{ return ctPeopleWipe(); }catch(_e){ return 0; } } };"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the people already ride the save')
        return
    for old, what in ((SNAP_OLD, 'the snapshot'),
                      (REST_OLD, 'the restore'),
                      (FN_OLD, 'where the two functions go'),
                      (WIPE_OLD, 'the wipe verb')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
    for old, new in ((SNAP_OLD, SNAP_NEW), (REST_OLD, REST_NEW),
                     (FN_OLD, FN_NEW), (WIPE_OLD, WIPE_NEW)):
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- export, import, restore, rollback and wipe all carry the people' % CITY)


if __name__ == '__main__':
    main()
