#!/usr/bin/env python3
"""BOHEMIA CITY EXCHANGES -- put the two-person conversations on the street.

engine/bohemia_exchanges.js holds 31 conversations and, like every table before
it, holds them where nobody can hear them. THE WORST REACH FAILURE THIS LANE HAS
FOUND was exactly this shape on 8/14: linesFor() was called ZERO TIMES in
BOHEMIA_CITY_WORLD.html, the frame the player actually looks at when they tap
RUN, while 244 barks sat inlined and correct in that same file. So this tool
exists before the content is called finished, not after.

WHAT IT ADDS, and it is deliberately small because the bubble already exists:
  xchPick(now)     find TWO people who are both drawn, both in earshot of the
                   player, and standing near EACH OTHER.
  xchStart(now)    begin a conversation between them, entered at its `join`
                   turn, never at turn 0.
  xchAdvance(now)  the other one answers on the next beat.
REUSE-FIRST: it draws NO pixels of its own. barkPass already renders a bubble
over a person's head, clamped on screen, in the surface's palette, and every
turn here is handed to that same drawer by setting BARK. One bubble, one lesson
learned (8/14), one place to fix it if it is ever wrong.

*** A CONVERSATION IS NOT TWO BARKS FOUR SECONDS APART. *** The ambient bark
cooldown is 1500ms of breath plus a 4000ms wait before anybody else speaks,
which is right for two unrelated people on a street and completely wrong inside
one exchange: a four second gap between a question and its answer reads as two
strangers who happen to be near each other. So a turn IN an exchange hands
straight to the next speaker after ONE BEAT (120 BPM LAW, BEAT=500ms), and only
when the exchange ENDS does the ordinary ambient cooldown come back.

*** IT NEVER REPLACES THE SOLO BARK, IT ONLY PRE-EMPTS IT. *** The population
dial ships at 1, where a pair on one screen is rare, so if xchPick finds nobody
the frame falls through to barkPick exactly as before. This is additive: a
street that could not hold a conversation before this still sounds the way it
did.

Q030.X3 REPETITION is enforced here as well as in the module: XCH.spent is kept
PER PAIR, so the same two people work through their whole pool before anything
comes round again, and a different pair starts fresh.

LANE NOTE: PEOPLE-lane code in the CITY lane's file, additive, between markers,
touching no city logic.

REUSE CHECK: cooks no pixels and opens no bank. It draws nothing: every line is
handed to the existing barkPass bubble. Numbers come from engine/
bohemia_exchanges.js and from BARK_DREW, the list peoplePass really blitted.

  python3 tools/bohemia_city_exchange_patch.py
Gate: gates/exchange_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MODULE = os.path.join(ROOT, 'engine', 'bohemia_exchanges.js')

MOD_BEGIN = '/* ==== engine/bohemia_exchanges.js (EXCHANGES, 8/17) ==== */'
MOD_END = '/* ==== /engine/bohemia_exchanges.js (EXCHANGES) ==== */'
MOD_ANCHOR = 'var BARK = { p: null, text: '

RT_BEGIN = '/* ===== BOHEMIA STREET EXCHANGES (generated) ===== */'
RT_END = '/* ===== END BOHEMIA STREET EXCHANGES ===== */'
RT_ANCHOR = 'function barkTick(now){'

RUNTIME = RT_BEGIN + r'''
/* ---- TWO PEOPLE TALKING TO EACH OTHER, AND YOU WALK IN ON THE MIDDLE -------
   Q043.W4 AMBIENT BANTER AS CHARACTERIZATION asks for OVERHEARD RELATIONSHIPS.
   The 8/12 barks gave the world 244 lines in which everybody talks to nobody,
   because a valley that draws ONE body per screen cannot hold a conversation.
   The population dial (8/16) fixed that; this is the half that was waiting. */
var XCH = { on: false, turns: [], i: 0, a: null, b: null, atA: null, atB: null,
            key: '', spent: {}, id: '' };

/* WHO IS TALKING TO WHOM. Both must be DRAWN (BARK_DREW is the list peoplePass
   really blitted, so the renderer and the mouth can never disagree), both in
   earshot of the player, and near EACH OTHER -- two people shouting across a
   car park are not having a conversation you overhear, they are two barks. */
function xchPick(){
  var drew = BARK_DREW, best = null, bestD = 99;
  if (!drew || drew.length < 2) return null;
  for (var i = 0; i < drew.length; i++) {
    var A = drew[i]; if (!A.at) continue;
    if (A.at[0] === hx && A.at[1] === hy) continue;         /* OCCUPANCY: that is you */
    var dA = Math.abs(A.at[0] - hx) + Math.abs(A.at[1] - hy);
    if (dA > 7) continue;                                    /* earshot, not telepathy */
    for (var j = i + 1; j < drew.length; j++) {
      var B = drew[j]; if (!B.at) continue;
      if (B.at[0] === hx && B.at[1] === hy) continue;
      var dB = Math.abs(B.at[0] - hx) + Math.abs(B.at[1] - hy);
      if (dB > 7) continue;
      /* NEAR ENOUGH TO BE TALKING. Three fine cells is about two metres at the
         valley scale (one cell is 0.75m), which is a conversation distance. */
      var apart = Math.abs(A.at[0] - B.at[0]) + Math.abs(A.at[1] - B.at[1]);
      if (apart > 4 || apart === 0) continue;
      var score = dA + dB + apart;
      if (score < bestD) { bestD = score; best = { A: A, B: B }; }
    }
  }
  return best;
}

function xchKey(a, b){
  var ka = String(a.key || a.id || 'a'), kb = String(b.key || b.id || 'b');
  return ka < kb ? ka + '|' + kb : kb + '|' + ka;
}

/* START ONE. Returns true if a conversation is now running, in which case the
   caller must NOT also fire a solo bark this tick. */
function xchStart(now){
  var pair = xchPick();
  if (!pair) return false;
  var a = pair.A.p, b = pair.B.p;
  var key = xchKey(a, b);
  if (XCH.key !== key) { XCH.spent = {}; XCH.key = key; }   /* a new pair starts fresh */
  var x;
  try {
    x = BohemiaExchanges.nextFor(key, a.archetype || 'any', b.archetype || 'any',
                                 XCH.spent, Math.floor(now / 1000) | 0);
  } catch (_e) { return false; }
  if (!x) return false;
  var heard;
  try { heard = BohemiaExchanges.heard(x); } catch (_e) { return false; }
  if (!heard || !heard.length) return false;
  XCH.on = true; XCH.turns = heard; XCH.i = 0; XCH.id = x.id;
  XCH.a = a; XCH.b = b; XCH.atA = pair.A.at; XCH.atB = pair.B.at;
  XCH.spent[x.id] = 1;
  return xchSay(now);
}

/* PUT THE CURRENT TURN IN THE EXISTING BUBBLE. Draws nothing itself. */
function xchSay(now){
  if (!XCH.on || XCH.i >= XCH.turns.length) { XCH.on = false; return false; }
  var t = XCH.turns[XCH.i++];
  var speakerIsA = (t.speaker === 0);
  BARK.p = speakerIsA ? XCH.a : XCH.b;
  BARK.at = speakerIsA ? XCH.atA : XCH.atB;
  BARK.text = t.text;
  BARK.until = now + barkHold(BARK.text);
  return true;
}

/* THE OTHER ONE ANSWERS ON THE NEXT BEAT, not after the ambient cooldown. */
function xchAdvance(now){
  if (!XCH.on) return false;
  if (XCH.i >= XCH.turns.length) { XCH.on = false; return false; }
  return xchSay(now + 500);
}
''' + RT_END


def cut(text, begin, end, tail, label):
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
        sys.exit('FAIL: run tools/bohemia_exchange_factory.py first')
    s = open(CITY, encoding='utf-8').read()
    before = s

    # ---- the module, inlined verbatim (ENGINE SYNC LAW: one canonical body) --
    s, had_mod = cut(s, MOD_BEGIN, MOD_END, '\n', 'the exchanges module')
    s, had_rt = cut(s, RT_BEGIN, RT_END, '\n', 'the exchanges runtime')

    mod_src = open(MODULE, encoding='utf-8').read()
    s = insert_before(s, MOD_ANCHOR, MOD_BEGIN + '\n' + mod_src + '\n' + MOD_END + '\n',
                      'BARK state')
    s = insert_before(s, RT_ANCHOR, RUNTIME + '\n', 'barkTick')

    # ---- two surgical edits to barkTick, so a conversation flows -----------
    old_breath = ("  if (BARK.p) { BARK.p = null; BARK.next = now + 1500; return; }"
                  "   /* a breath after */")
    new_breath = (
        "  if (BARK.p) {\n"
        "    BARK.p = null;\n"
        "    /* MID-CONVERSATION? The other one answers on the next beat rather than\n"
        "       after the ambient cooldown. Four seconds between a question and its\n"
        "       answer is not a conversation, it is two strangers standing near each\n"
        "       other. Only when the exchange RUNS OUT does the ordinary breath and\n"
        "       cooldown come back. */\n"
        "    if (xchAdvance(now)) return;\n"
        "    BARK.next = now + 1500; return;   /* a breath after */\n"
        "  }")
    if old_breath in s:
        s = s.replace(old_breath, new_breath, 1)
    elif 'if (xchAdvance(now)) return;' not in s:
        sys.exit('REFUSING TO WRITE: the barkTick breath anchor is gone and the '
                 'advance call is not already in. Look before patching.')

    old_pick = "  var pick = barkPick();\n  if (!pick) return;"
    new_pick = (
        "  /* A CONVERSATION BEATS A MONOLOGUE. If two people are standing together\n"
        "     in earshot, we overhear THEM; only if nobody is paired does the street\n"
        "     fall back to one person saying one thing, exactly as it did before this\n"
        "     shipped. At dial 1 a pair is rare, so this is additive and never a\n"
        "     regression. */\n"
        "  if (xchStart(now)) return;\n"
        "  var pick = barkPick();\n  if (!pick) return;")
    # ASK "IS IT ALREADY IN?" BEFORE "DOES THE ANCHOR MATCH?", NOT AFTER.
    # This edit INSERTS BEFORE its anchor and leaves the anchor intact, so the
    # anchor still matches on the next run and the block went in a second time.
    # Caught by md5 on run two, which is the only reason idempotence gets
    # claimed at all here rather than assumed.
    if 'if (xchStart(now)) return;' in s:
        pass
    elif old_pick in s:
        s = s.replace(old_pick, new_pick, 1)
    else:
        sys.exit('REFUSING TO WRITE: the barkTick pick anchor is gone and the start '
                 'call is not already in. Look before patching.')

    if s == before:
        print('CITY EXCHANGES: already exactly this. Nothing written.')
        return
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY EXCHANGES: module %s, runtime %s'
          % ('moved' if had_mod else 'added', 'moved' if had_rt else 'added'))
    print('  city : %.1f MB' % (os.path.getsize(CITY) / 1e6))


if __name__ == '__main__':
    main()
