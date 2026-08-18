#!/usr/bin/env python3
"""BOHEMIA CITY ASKING -- the thread becomes pullable on the card he already opens.

engine/bohemia_asking.js holds 14 answers and 4 refusals and, like every table
before it, holds them where nobody can reach them. The worst reach failure this
lane has found was exactly that shape, so the wiring ships in the same turn as
the words, never after.

WHAT IT ADDS TO THE TALK CARD:
  ASK ABOUT <SUBJECT>   one button per subject in your log, up to three, and
                        ONLY for subjects you actually overheard to the end.
  their reply           printed on the card in their own voice, and spoken
                        through the same BOHEMIA_VOICE channel the card already
                        uses for a meeting.
  the thread deepens    if they knew something, a SECOND fact lands in the same
                        log under the same subject, asking a sharper question.

*** THREE BUTTONS, NOT SEVEN. *** There are seven subjects. A card that grows a
button per subject becomes a wall on a 390px phone, and the RUN lane spent 8/16
taking buttons OFF the surface he walks with because he said there were too many.
The three most recent are the ones a player is actually chasing.

*** ASKING THE SAME PERSON TWICE IS NOT A SECOND ANSWER. *** Once a person has
answered a subject the button is gone for that person, so the card cannot become
a machine you mash. Somebody else of a different trade can still answer it, which
is Q014.W4 MULTIPLE KEYS working as intended rather than a loophole.

*** WHERE THE THREAD ENDS IS STILL HIS. *** Nothing here resolves anything. The
deeper facts ask sharper questions and stop, because what is up the hill and who
owns the tank are canon. MECHANISM-MINE / CONTENTS-PAOLO'S.

REUSE CHECK: cooks no pixels and opens no bank. Every row goes through ctRow()
and every button is a plain card button styled by the card's own CSS, so there is
one place to change how the card looks. The reply is spoken through the card's
existing voice post, not a second channel.

  python3 tools/bohemia_city_asking_patch.py
Gate: gates/asking_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MODULE = os.path.join(ROOT, 'engine', 'bohemia_asking.js')

MOD_BEGIN = '/* ==== engine/bohemia_asking.js (ASKING, 8/17) ==== */'
MOD_END = '/* ==== /engine/bohemia_asking.js (ASKING) ==== */'
MOD_ANCHOR = '/* ==== engine/bohemia_known.js (WHAT YOU HEARD, 8/17) ==== */'

RT_BEGIN = '/* ===== BOHEMIA ASKING (generated) ===== */'
RT_END = '/* ===== END BOHEMIA ASKING ===== */'
RT_ANCHOR = '/* ===== BOHEMIA WHAT YOU HEARD (generated) ===== */'

RUNTIME = RT_BEGIN + r'''
/* ---- PULLING THE THREAD ---------------------------------------------------
   The log shipped read-only. Q018.W3 asks for a thread to PULL, and a thread
   you cannot pull is a list. ASK_SAID holds the last reply so the card can
   print it; ASK_DONE remembers who has already answered what, so the card never
   becomes a button you mash. */
var ASK_SAID = null;                 /* { key, subject, text, gave } */
var ASK_DONE = {};                   /* personKey -> { subject: 1 } */

function askDone(key, subject){
  return !!(ASK_DONE[key] && ASK_DONE[key][subject]);
}
/* WHAT HE CAN ASK THIS PERSON. Only subjects he really overheard to the end,
   and only ones this person has not already answered. Three at most: seven
   buttons is a wall on the phone, and the RUN lane spent 8/16 taking buttons
   OFF the surface he walks with. */
function askOffer(key){
  var k = knownLoad(); if (!k || !k.count()) return [];
  var out = [], subs = k.subjects();
  for (var i = 0; i < subs.length && out.length < 3; i++) {
    if (!askDone(key, subs[i].subject)) out.push(subs[i].subject);
  }
  return out;
}
/* ASK. Their TRADE decides the answer, so the same question put to the same
   kind of person always gets the same reply -- a world where the answer depends
   on which body you clicked is not a world with information in it. */
function askAbout(person, key, subject){
  var trade = person && (person.archetype || person.role) || 'worker';
  var a = null;
  try { a = BohemiaAsking.answerFor(subject, trade); } catch (_e) {}
  var text, gave = false;
  if (a) {
    text = a.says;
    gave = true;
    try { var k = knownLoad();
          if (k) { k.note({ id: a.deeper.id, subject: a.deeper.subject,
                            line: a.deeper.line, implies: a.deeper.implies,
                            day: (T && T.day) | 0, min: (T && T.min) | 0 });
                   knownSave(); } } catch (_e) {}
  } else {
    try { text = BohemiaAsking.deflectFor(trade); } catch (_e) { text = ''; }
  }
  if (!ASK_DONE[key]) ASK_DONE[key] = {};
  ASK_DONE[key][subject] = 1;
  ASK_SAID = { key: key, subject: subject, text: text, gave: gave };
  /* THEY SAY IT OUT LOUD, through the channel the card already uses for a
     meeting. One voice path, not a second one bolted on. */
  try {
    if (window.parent && window.parent !== window)
      window.parent.postMessage({ type: 'BOHEMIA_VOICE',
        speaker: 'city:' + (person && person.key || ''), text: text }, '*');
  } catch (_e) {}
  return ASK_SAID;
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
        sys.exit('FAIL: run tools/bohemia_asking_factory.py first')
    s = open(CITY, encoding='utf-8').read()
    before = s

    s, had_mod = cut(s, MOD_BEGIN, MOD_END, '\n', 'the asking module')
    s, had_rt = cut(s, RT_BEGIN, RT_END, '\n', 'the asking runtime')

    mod_src = open(MODULE, encoding='utf-8').read()
    s = insert_before(s, MOD_ANCHOR, MOD_BEGIN + '\n' + mod_src + '\n' + MOD_END + '\n',
                      'known module')
    s = insert_before(s, RT_ANCHOR, RUNTIME + '\n', 'known runtime')

    # ---- the card: their reply, then the buttons ---------------------------
    card_anchor = "  if(ctBtn) body+='<button id=\"ctask\">'+ctBtn+'</button>';"
    card_rows = (
        "  /* __ASK_ABOUT__ -- what they just told you, and what you can still ask.\n"
        "     Their reply is printed BEFORE the buttons so the card reads as an\n"
        "     exchange rather than a menu with a receipt underneath it. */\n"
        "  try {\n"
        "    if (ASK_SAID && ASK_SAID.key === who.key) {\n"
        "      body += ctRow('THEY SAID', '\"' + ASK_SAID.text + '\"');\n"
        "      if (!ASK_SAID.gave) {\n"
        "        var others = BohemiaAsking.whoKnows(ASK_SAID.subject)\n"
        "          .map(function (t) { return BohemiaPeople.ROLE_WORDS[t] || t; });\n"
        "        /* WHO might know, never WHERE they are: Q037.W3 says the log is\n"
        "           the map, and a list of trades is not a waypoint. */\n"
        "        if (others.length) body += ctRow('TRY', 'A ' + others.join(' OR A '));\n"
        "      }\n"
        "    }\n"
        "  } catch (_e) {}\n"
        "  var askOpts = [];\n"
        "  try { askOpts = askOffer(who.key); } catch (_e) {}\n"
        "  for (var ai = 0; ai < askOpts.length; ai++) {\n"
        "    body += '<button class=\"ctaskabout\" data-subject=\"' + askOpts[ai] + '\">'\n"
        "         + 'Ask about ' + askOpts[ai] + '</button>';\n"
        "  }\n")
    if '__ASK_ABOUT__' in s:
        pass
    elif card_anchor in s:
        s = s.replace(card_anchor, card_rows + card_anchor, 1)
    else:
        sys.exit('REFUSING TO WRITE: the talk-card anchor is gone. Look before patching.')

    # ---- and bind them, where every other card button is bound --------------
    bind_anchor = ("  var ask=document.getElementById('ctask');\n"
                   "  if(ask) ask.addEventListener('click',function(){\n"
                   "    CT_MET.ask(who.key, T.day||1); ctSave(); ctDraw(); render(); });")
    bind_new = bind_anchor + (
        "\n  /* __ASK_ABOUT__ -- bound here with every other card button, so there is\n"
        "     one place that knows how this card responds to a press. */\n"
        "  Array.prototype.forEach.call(card.querySelectorAll('.ctaskabout'), function (btn) {\n"
        "    btn.addEventListener('click', function () {\n"
        "      askAbout(who, who.key, btn.getAttribute('data-subject'));\n"
        "      advance(10);\n"
        "      ctDraw(); render();\n"
        "    });\n"
        "  });")
    # THE SENTINEL MUST BE UNIQUE TO *THIS* BLOCK. The first cut guarded on
    # `'ctaskabout' in s`, which the card-rows step immediately above had just
    # inserted, so this always believed it had already run and the binding NEVER
    # LANDED. Measured on the real surface: the three buttons drew perfectly and
    # pressing one did nothing at all. Second time this exact shape has bitten in
    # two days -- a guard that matches something an earlier step wrote is not a
    # guard, it is a coin flip that always lands the same way.
    if 'askAbout(who, who.key,' in s:
        pass
    elif bind_anchor in s:
        s = s.replace(bind_anchor, bind_new, 1)
    else:
        sys.exit('REFUSING TO WRITE: the card button binding anchor is gone.')

    if s == before:
        print('CITY ASKING: already exactly this. Nothing written.')
        return
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY ASKING: module %s, runtime %s'
          % ('moved' if had_mod else 'added', 'moved' if had_rt else 'added'))
    print('  city : %.1f MB' % (os.path.getsize(CITY) / 1e6))


if __name__ == '__main__':
    main()
