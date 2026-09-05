#!/usr/bin/env python3
"""
THE FAMILY IS IN THE GAME
(9/4/26, RUN lane. He said one word: FAMILY.)

    laws/BOHEMIA_ADDENDUM_FAMILY_CORE_THEME_7_19_26.md, LOCKED:
    "STRONG FAMILY CAN CONQUER ALL. NOBODY IS ANYTHING WITHOUT FAMILY ... This
     is the life lesson under the whole game."
    And 8/28, when a summary tried to delete the dynasty:
    "YEAH THREE GENERATIONS BRO CMON."

=== WHAT I MEASURED BEFORE WRITING A LINE ==================================

FAMILY IS THE LOAD-BEARING THEME OF THIS GAME AND THERE WAS NO FAMILY IN IT.

    slices/BOHEMIA_ALPHA_0_9.html    runDynasty 0   selectHeir 0   family.tree 0
    slices/BOHEMIA_CITY_WORLD.html   runDynasty 0   selectHeir 0   family.tree 0

Those two files ARE the game. Zero, every term, both files.

A complete dynasty engine exists -- runDynasty, foldGeneration, selectHeir with a
real family tree, deterministic heir selection, district texture, the monument.
It lives in engine/bohemia_engine.js and in two OLD SLICES that nobody opens. The
game he plays has never referenced it.

AND THE WALKED WORLD'S ONLY MENTION OF HIS SIBLING IS A COMMENT QUOTING HIM
ASKING FOR IT: "I want that main quest origin in it when ur sibling dies". Every
other "sibling" in that file is a SIBLING ROAD CELL.

=== AND NONE OF THIS IS INVENTED. IT IS A WIRE. ============================

Everything needed already exists and none of it could reach the run:

    FAMILY_CAST (alpha 3986)   RAY, DENISE, MARCO, NINA. Named, draft:true,
                               dialled, dressed in approved garments, rendering.
                               family_cast_gate: 26 passed, 0 failed.
    survivesIf                 His 7/19 ruling, already implemented: "the
                               surviving sibling is the SAME GENDER as the
                               player. Male player -> older brother survives
                               (sister dies); female -> older sister survives."
    the boot handshake         The city already asks the shell `bohemiaWhoAmI`
                               and the shell already answers with bohemiaIsDemo
                               and bohemiaBuild.

*** THE SHELL KNOWS WHO YOU LOST AND THE WALKED WORLD HAS NEVER BEEN TOLD. ***
That is the identical shape as the build-stamp bug found on 8/27: a fact the
shell holds, a city that cannot read it, and a handshake already running between
them that was carrying something else. So this adds NO new channel. The reply
that already answers "which surface am I on" and "which build am I" now also
answers "who is my family".

=== WHAT IS MINE AND WHAT IS EMPHATICALLY HIS ==============================

MINE: that the run HOLDS a family at all, that it survives a reload, and that he
can reach it. That is mechanism.

HIS, AND UNTOUCHED:
  - WHO they are. Every name comes from FAMILY_CAST, which is his, drafted, and
    edited in one place. NOT ONE NAME IS TYPED IN THIS FILE. Two places holding
    one name is how the mother came back as DENISE from a table the scene module
    had never heard of -- the alpha's own note about that mistake is why this
    reads the table instead of copying it.
  - WHICH SIBLING DIES. Read off survivesIf against the player's gender, which
    is his 7/19 ruling. Nothing here decides it.
  - engine/bohemia_people.js ships KNOWN_AT_START EMPTY and people_gate fails if
    it gains a row. This adds NOTHING to it. The family is not a story person
    pool; it is the cast he already approved.

=== WHERE HE MEETS IT =====================================================

The STANDING card, above the factions, because in this game family comes before
factions and the card is already called WHERE YOU STAND. He never digs, so it
goes on a card he already opens rather than behind a new button.

And it says the thing the theme is actually about. The law: "Grief is the proof
it was real." So the card names who is gone, not only who is left.

REUSE CHECK: cooks NO pixels and opens no banks/. It draws nothing new: the rows
are .rrow/.rk/.rv, the classes the standing card already styles, and every name
and body comes from FAMILY_CAST.

Idempotent (marker __THE_FAMILY_IS_IN_THE_GAME__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_FAMILY_IS_IN_THE_GAME__'

# ------------------------------------------- 1. the shell answers with the family
A_OLD = """      ev.source.postMessage({bohemiaIsDemo:!!window.__BOHEMIA_DEMO_BUILD,
        bohemiaBuild:__bs?String(__bs.textContent||'').trim():null},'*');"""

A_NEW = """      /* """ + MARK + """ (9/4): AND WHO HIS FAMILY IS.
         FAMILY IS THE CORE THEME (7/19, LOCKED) and the walked world had never
         been told there is one: runDynasty, selectHeir and family.tree are all
         ZERO in both files that make up the game. The cast, the names and the
         ruling about which sibling is lost have existed since the cold open
         shipped; only the wire was missing.
         READ OFF FAMILY_CAST, NEVER COPIED. Two places holding one name is how
         the mother came back as DENISE from a table the scene module had never
         heard of -- the note above fillNames is that post-mortem. survivesIf is
         his 7/19 ruling and decides the lost sibling here, once. */
      var _fam = null;
      try {
        var _g = (window.PGENDER || window.__PLAYER_GENDER || 'male');
        _fam = (window.FAMILY_CAST || []).map(function (m) {
          return { role: m.role, name: m.name, age: m.age, draft: !!m.draft,
                   alive: (m.survivesIf === 'always') || (m.survivesIf === _g) };
        });
      } catch (_e) { _fam = null; }
      ev.source.postMessage({bohemiaIsDemo:!!window.__BOHEMIA_DEMO_BUILD,
        bohemiaBuild:__bs?String(__bs.textContent||'').trim():null,
        bohemiaFamily:_fam},'*');"""

# ------------------------------------------------- 2. the city holds and saves it
C_OLD = """  try { if (ev && ev.data && typeof ev.data.bohemiaBuild === 'string')
          CT_BUILD = ev.data.bohemiaBuild; } catch(_e){}"""

C_NEW = """  try { if (ev && ev.data && typeof ev.data.bohemiaBuild === 'string')
          CT_BUILD = ev.data.bohemiaBuild;
    /* """ + MARK + """: and who his family is, on the same reply. */
    if (ev && ev.data && ev.data.bohemiaFamily && ev.data.bohemiaFamily.length)
          famSet(ev.data.bohemiaFamily); } catch(_e){}"""

DECL_OLD = """var CT_BUILD = null;"""

DECL_NEW = """var CT_BUILD = null;

/* ============================================================================
   """ + MARK + """ (9/4) -- THE RUN HAS A FAMILY NOW.

   MEASURED BEFORE THIS EXISTED: runDynasty 0, selectHeir 0, family.tree 0, in
   BOTH files that make up the game. A full dynasty engine has existed since 7/2
   -- family tree, heir selection, three generational folds -- and the game he
   plays had never referenced it once. FAMILY IS THE CORE THEME (7/19, LOCKED)
   and there was no family in the game.

   NOTHING HERE IS INVENTED. The cast, the names and the ruling about which
   sibling is lost all shipped with the cold open; the shell knew all of it and
   the walked world had never been told. This holds what the shell sends.

   NOT ONE NAME IS TYPED IN THIS FILE. They arrive from FAMILY_CAST, which is
   his and drafted, so renaming her there renames her everywhere -- the mistake
   the alpha's own fillNames note documents.
   ========================================================================== */
var FAMILY = null;
var FAM_KEY = 'boh.city.family';

function famSet(list){
  if(!list || !list.length) return;
  FAMILY = list;
  try{ localStorage.setItem(FAM_KEY, JSON.stringify(list)); }catch(_e){}
}
/* AN UNREADABLE BLOB IS DISCARDED WHOLE, never half applied -- the rule the
   belonging save already sets, because a partly restored family is worse than
   no family: you cannot see that it is wrong. */
function famHydrate(){
  if(FAMILY) return FAMILY;
  try{
    var raw = JSON.parse(localStorage.getItem(FAM_KEY) || 'null');
    if(raw && raw.length && raw[0] && raw[0].role) FAMILY = raw;
  }catch(_e){ FAMILY = null; }
  return FAMILY;
}
function famLost(){
  var f = famHydrate() || [];
  for(var i=0;i<f.length;i++) if(!f[i].alive) return f[i];
  return null;
}
function famLiving(){
  var f = famHydrate() || [];
  return f.filter(function(m){ return m.alive; });
}"""

# ------------------------------------------------------- 3. and he can reach it
S_OLD = """  var h = '';
  h += '<div class="rrow"><span class="rk">YOUR RUNG</span>'
     + '<span class="rv">' + r.rung + '</span></div>';"""

S_NEW = """  var h = '';
  /* """ + MARK + """ (9/4): FAMILY GOES ABOVE THE FACTIONS, because in this game
     family comes before factions and this card is already called WHERE YOU STAND.
     He never digs, so it goes on a card he already opens rather than behind a new
     button nobody finds.
     AND IT NAMES WHO IS GONE, not only who is left. The 7/19 law: "Grief is the
     proof it was real." A family card that lists only survivors is the
     counterfeit family the whole story is against. */
  try{
    var _liv = famLiving(), _lost = famLost();
    if(_liv.length || _lost){
      if(_liv.length)
        h += '<div class="rrow"><span class="rk">YOUR PEOPLE</span><span class="rv">'
           + esc(_liv.map(function(m){ return m.name; }).join(' \\u00b7 '))
           + '</span></div>';
      if(_lost)
        h += '<div class="rrow"><span class="rk">WHO YOU LOST</span><span class="rv">'
           + esc(_lost.name) + '</span></div>';
    }
  }catch(_e){}
  h += '<div class="rrow"><span class="rk">YOUR RUNG</span>'
     + '<span class="rv">' + r.rung + '</span></div>';"""


def main():
    for p in (CITY, ALPHA):
        if not os.path.exists(p):
            sys.exit('FAIL: ' + p + ' not found')
    c = open(CITY, encoding='utf8').read()
    a = open(ALPHA, encoding='utf8').read()
    if MARK in c and MARK in a:
        print('NOOP: the family is already in the game')
        return
    if 'FAMILY_CAST' not in a:
        sys.exit('FAIL: FAMILY_CAST is missing; this wires it, it does not invent it')
    for src, old, what in ((a, A_OLD, 'the shell reply'),
                           (c, C_OLD, 'the city listener'),
                           (c, DECL_OLD, 'where the record goes'),
                           (c, S_OLD, 'the standing card')):
        n = src.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
    a = a.replace(A_OLD, A_NEW, 1)
    for old, new in ((DECL_OLD, DECL_NEW), (C_OLD, C_NEW), (S_OLD, S_NEW)):
        c = c.replace(old, new, 1)
    open(ALPHA, 'w', encoding='utf8').write(a)
    open(CITY, 'w', encoding='utf8').write(c)
    print('PATCHED -- the run knows who his family is, and who he lost')


if __name__ == '__main__':
    main()
