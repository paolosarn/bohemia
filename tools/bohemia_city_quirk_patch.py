#!/usr/bin/env python3
"""BOHEMIA CITY QUIRK -- the first laugh lands on the card he already opens.

engine/bohemia_quirk.js holds 304 quirks in two registers and, like every table
this lane has ever built, holds them where nobody can reach them. THE REACH
FAILURE IS THE ONLY FAILURE MODE THIS LANE HAS REPEATED, so the wiring ships in
the same turn as the words, never after.

WHAT IT ADDS TO THE TALK CARD, and it is one row:

  THEY SAID     "Hang on, I'm winding a watch that does not run. You can't
                 interrupt it. It doesn't work if you interrupt it."

...printed the moment you have ASKED THEIR NAME, and never before, because YOU
HAVE TO ASK (7/31) means a stranger has not spoken to you yet. It sits directly
under the NAME row, since the whole finding is that the name-ask IS the delivery
slot (tone research R1: "what a stranger says when you ask their name is where
Undertale would put the first laugh").

*** THE ROW LANDS EVEN WHEN THE NAME DOES NOT. *** Six of the sixteen
introductions refuse a name outright or make you earn it elsewhere -- ask a
Cartel member and you get nothing. Under the old card that was a dead end: you
pressed the one button the game has and the world said no. Now you always get
the person even when you do not get the name, which is the better joke anyway
and which stops half the valley being unmeetable.

*** AND THE LIGHT DECIDES HOW IT SOUNDS. *** dayDark() already answers off the
real 12% clustered power grid, so the same person on a lit corner and the same
person two blocks over where the power stops says the two halves of their own
quirk. Nothing new is computed and no new state exists: it is the map deciding
the tone, which is LIGHT=TERRITORY doing a job it was already doing for danger.

*** NOBODY ON THE BLOCK SHARES IT. *** The card asks spreadOver() for the whole
block rather than quirkOf() for the one person, so the answer is the de-collided
one. Measured: 1.63 duplicate pairs per 32-person block becomes 0.00, with 94.7%
of people keeping their own draw. Asking the one person would have been one line
shorter and would have put two identical bits on one street.

REUSE CHECK: cooks no pixels and opens no bank. The row goes through ctRow() like
every other row on this card, and the line is spoken through the card's existing
BOHEMIA_VOICE post rather than a second audio channel.

  python3 tools/bohemia_city_quirk_patch.py
Gate: gates/quirk_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MODULE = os.path.join(ROOT, 'engine', 'bohemia_quirk.js')

MOD_BEGIN = '/* ==== engine/bohemia_quirk.js (ONE THING THAT IS THEIRS, 8/19) ==== */'
MOD_END = '/* ==== /engine/bohemia_quirk.js (ONE THING THAT IS THEIRS) ==== */'
MOD_ANCHOR = '/* ==== engine/bohemia_asking.js (ASKING, 8/17) ==== */'

RT_BEGIN = '/* ==== BOHEMIA QUIRK RUNTIME (8/19) ==== */'
RT_END = '/* ==== /BOHEMIA QUIRK RUNTIME ==== */'
RT_ANCHOR = 'function ctRow(k,v){'

RUNTIME = RT_BEGIN + r'''
/* ONE THING THAT IS THEIRS, and the map decides how it sounds.

   THE BLOCK, NOT THE PERSON. quirkOf() is the pure per-person answer and it is
   right for everything except a street: 304 combinations drawn 32 times is a
   birthday problem and it lands where the maths says (measured: 1.63 duplicate
   pairs per block, seven on the worst block in three hundred). spreadOver()
   makes that guarantee exact.

   *** AND THE BLOCK IS THE RIGHT SCOPE, WHICH THE GATE HAD TO TEACH ME. *** The
   first cut spread over ctEveryone(), and ctEveryone() is a THREE BY THREE
   NEIGHBOURHOOD -- 458 people at dial 20, against 304 combinations. The gate
   came back with exactly 154 duplicates, which is 458 minus 304: the pool was
   spent and the module fell back to each person's own draw, exactly as it says
   it does. Growing the pool past 458 would have been chasing the wrong number.
   TWO PEOPLE IN A DISTRICT OF FOUR HUNDRED ABSOLUTELY DO SHARE A HABIT -- that
   is a city. What must never happen is two people on the SAME STREET having the
   same bit, because those are the two the player can hold in their head at once.
   So the keys are grouped by their block (bohemia_people keys a person as
   'P:<blockSeed>:<house>-<slot>', so a shared prefix IS a shared street) and
   each block is spread inside itself. Small, exact, and true to how a city
   actually feels. */
var QK_BLOCK = null, QK_BLOCK_AT = null;
function qkSpread(){
  /* Recomputed when the CELL changes, not per draw -- the card redraws on every
     button press and this walks the whole neighbourhood.
     AND ON RULES_V, WHICH IS THE HALF THAT BITES. Keying on the cell alone means
     moving the POPULATION DIAL changes who is standing here without changing
     where here is, so the spread would keep answering for a crowd that no longer
     exists and the new arrivals would fall through to their raw draw -- which is
     the un-de-collided one. That is the exact bug this lane already shipped once
     (PPL_PEOPLE cached across a dial change, 8/16), and bohemia_population bumps
     RULES_V for precisely this reason: its own comment says EVERY CONSUMER KEYS
     ITS CACHE ON RULES_V. This is a consumer. */
  var v = 0;
  try { v = BohemiaPopulation.rulesVersion(); } catch (_e) {}
  var cell = ((typeof ctCell === 'function') ? ctCell().join(',') : '0,0') + '@' + v;
  if (QK_BLOCK && QK_BLOCK_AT === cell) return QK_BLOCK;
  var byBlock = {};
  try {
    var all = ctEveryone();
    for (var i = 0; i < all.length; i++) {
      var w = ctPerson(all[i]);
      if (!w || !w.key) continue;
      var cut = String(w.key).lastIndexOf(':');
      var blk = cut > 0 ? w.key.slice(0, cut) : w.key;
      (byBlock[blk] || (byBlock[blk] = [])).push(w.key);
    }
  } catch (_e) { return null; }
  var out = {};
  try {
    var blocks = Object.keys(byBlock);
    for (var b = 0; b < blocks.length; b++) {
      var sp = BohemiaQuirk.spreadOver(byBlock[blocks[b]]);
      for (var k in sp) if (sp.hasOwnProperty(k)) out[k] = sp[k];
    }
  } catch (_e) { return null; }
  QK_BLOCK = out; QK_BLOCK_AT = cell;
  return QK_BLOCK;
}
function qkOf(key){
  if (typeof BohemiaQuirk === 'undefined' || !key) return null;
  var sp = qkSpread();
  if (sp && sp[key]) return sp[key];
  /* a person who is not on this block right now still HAS one -- the spread is
     a de-collider, never the source of truth. */
  try { return BohemiaQuirk.quirkOf(key); } catch (_e) { return null; }
}
/* WHAT THEY SAY WHEN YOU ASK, IN THE LIGHT YOU ARE ACTUALLY STANDING IN.

   MEASURED ON THE REAL SURFACE BEFORE THIS SHIPPED, AND IT SAVED THE FEATURE
   FROM GOING OUT BACKWARDS. The first cut asked dayDark(), which is purely
   "is this block on a live circuit". Driven for real: 358 of 9,216 valley tiles
   are live (3.9%), and 131 of 5,007 people live on one (2.6%). So dayDark()
   alone would have made 97.4% of every conversation in the game the DREAD
   register, and the joke -- the entire reason this exists, since a character
   nobody laughed with is a character nobody mourns -- would have been
   unreachable. A dial soldered to one end is not a dial.

   THE FIX IS NOT A NEW RULE, IT IS THE CITY'S OWN. An unpowered lot at noon is
   not dark; it is a lot. The renderer has always known this and says so in one
   line when it decides whether a room is dark:
       if (isNight() && !(POWER.at(INSIDE.tx, INSIDE.ty)||{}).live)
   That IS LIGHT=TERRITORY, and it is what the law is actually about -- nobody
   patrols the DARK, and the dark is a time as well as a place. So this asks the
   same question the same way, and there is one definition of dark in this file
   rather than two that will drift.

   WHICH ALSO BUYS THE THING R1 ASKED FOR AND dayDark() COULD NOT GIVE: the
   register MOVES. Night is 11 hours of 24, so roughly half of meetings land in
   each, and the player can cross between them by walking onto a live block OR
   by waiting for morning. Walking between them IS the tone transition. */
function qkLine(key, lang){
  var q = qkOf(key);
  if (!q) return null;
  var dark = false;
  try { dark = !!isNight() && !!dayDark(); } catch (_e) { dark = false; }
  var k = dark ? 'dark' : 'lit';
  /* *** AND IN THE LANGUAGE THEY SPEAK (8/25, THEY SPEAK SPANGLISH). ***
     This is the line somebody says TO YOUR FACE when you ask their name, and it
     was the LAST monolingual line in the game: the ambient barks you overhear
     across the street had registers before the person standing in front of you
     did, which is exactly backwards.
     The register is a THIRD axis on the same person. The shape, the noun and the
     light are untouched -- only the mouth moves. And a shape with no register
     written for it speaks ENGLISH rather than going silent, which is the hard
     rule: language never gates required information. */
  var r = lang && q[lang];
  return (r && r[k]) || q[k];
}
''' + RT_END


def cut(text, begin, end, tail, label):
    """Cut an OLD copy out so the insert can put it back where it belongs. Self-
    healing relocation: run it twice and the file is byte-identical.
    Strips an EXACT tail, never greedily -- an earlier version of this helper in
    this lane ate the following anchor's leading whitespace and moved code into a
    comment."""
    i = text.find(begin)
    if i < 0:
        return text, False
    j = text.find(end, i)
    if j < 0:
        sys.exit('REFUSING TO WRITE: %s has an opening marker and no closing one.' % label)
    k = j + len(end)
    if text[k:k + len(tail)] == tail:
        k += len(tail)
    return text[:i] + text[k:], True


def insert_before(text, anchor, block, label):
    n = text.count(anchor)
    if n != 1:
        sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times, not 1.' % (label, n))
    return text.replace(anchor, block + anchor, 1)


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    if not os.path.exists(MODULE):
        sys.exit('FAIL: run tools/bohemia_quirk_factory.py first')
    s = open(CITY, encoding='utf-8').read()
    before = s
    n_before = s.count('\n')

    s, had_mod = cut(s, MOD_BEGIN, MOD_END, '\n', 'the quirk module')
    s, had_rt = cut(s, RT_BEGIN, RT_END, '\n', 'the quirk runtime')

    mod_src = open(MODULE, encoding='utf-8').read()
    s = insert_before(s, MOD_ANCHOR, MOD_BEGIN + '\n' + mod_src + '\n' + MOD_END + '\n',
                      'asking module')
    s = insert_before(s, RT_ANCHOR, RUNTIME + '\n', 'ctRow')

    # ---- THE ROW. Directly under NAME, because the name-ask IS the slot. ----
    row_anchor = "  body+=ctRow(nameRow[0], nameRow[1]);"
    row_new = row_anchor + (
        "\n  /* __CITY_QUIRK__ -- ONE THING THAT IS THEIRS, and it is the reason the\n"
        "     sibling's death is allowed to land later: a character nobody laughed with\n"
        "     is a character nobody mourns (tone research R1). It sits under NAME because\n"
        "     the ask IS the delivery slot, and it lands even when the introduction\n"
        "     REFUSES the name -- six of the sixteen do, and under the old card those six\n"
        "     factions were people you could never meet at all.\n"
        "     THE LIGHT PICKS THE REGISTER. Same person, same quirk, same object; on a\n"
        "     powered block it is the joke and past the power it is the thing that is\n"
        "     wrong with them. */\n"
        "  if (CT_MET.asked(who.key)) {\n"
        "    var qkSaid = qkLine(who.key);\n"
        "    if (qkSaid) body += ctRow('THEY SAID', '\\u201c' + qkSaid + '\\u201d');\n"
        "  }")
    if '__CITY_QUIRK__' in s:
        pass
    elif row_anchor in s:
        s = s.replace(row_anchor, row_new, 1)
    else:
        sys.exit('REFUSING TO WRITE: the NAME row anchor is gone. Look before patching.')

    # ---- AND IT IS SPOKEN. -------------------------------------------------
    # The card already posts a voice when you meet somebody. A line printed in
    # silence on a surface that speaks reads as a caption, not a person.
    say_anchor = ("  var ask=document.getElementById('ctask');\n"
                  "  if(ask) ask.addEventListener('click',function(){\n"
                  "    CT_MET.ask(who.key, T.day||1); ctSave(); ctDraw(); render(); });")
    say_new = ("  var ask=document.getElementById('ctask');\n"
               "  if(ask) ask.addEventListener('click',function(){\n"
               "    CT_MET.ask(who.key, T.day||1); ctSave();\n"
               "    /* __CITY_QUIRK_VOICE__ -- they answer OUT LOUD. Through the SAME\n"
               "       postMessage channel the card already uses for a meeting and for an\n"
               "       ASK ABOUT reply, never a second path: a first laugh delivered in\n"
               "       silence on a surface that speaks reads as a caption. */\n"
               "    try {\n"
               "      var qkS = qkLine(who.key);\n"
               "      if (qkS && window.parent && window.parent !== window)\n"
               "        window.parent.postMessage({ type: 'BOHEMIA_VOICE',\n"
               "          speaker: 'city:' + (who.key || ''), text: qkS }, '*');\n"
               "    } catch (_e) {}\n"
               "    ctDraw(); render(); });")
    if '__CITY_QUIRK_VOICE__' in s:
        pass
    elif say_anchor in s:
        s = s.replace(say_anchor, say_new, 1)
    else:
        sys.exit('REFUSING TO WRITE: the ask-name binding anchor is gone.')

    # ---- REFUSE TO SHIP A DIFF THAT DELETES SOMEBODY ELSE'S WORK -----------
    # 8/17: a sibling patch tool in this lane removed 2,607 lines of the FACTIONS
    # lane's work because its anchor had moved and its cut ran long. Caught by
    # reading `git diff --numstat` AFTER the fact. This checks BEFORE the write.
    grew = s.count('\n') - n_before
    if grew < 0:
        sys.exit('REFUSING TO WRITE: this patch would REMOVE %d lines from the city. '
                 'A wiring patch only ever adds. Look at the anchors.' % -grew)

    if s == before:
        print('CITY QUIRK: already exactly this. Nothing written.')
        return
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY QUIRK: module %s, runtime %s, +%d lines'
          % ('moved' if had_mod else 'added', 'moved' if had_rt else 'added', grew))
    print('  city : %.1f MB' % (os.path.getsize(CITY) / 1e6))


if __name__ == '__main__':
    main()
