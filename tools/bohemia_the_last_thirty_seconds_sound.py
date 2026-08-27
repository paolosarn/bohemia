#!/usr/bin/env python3
"""
THE LAST THIRTY SECONDS MAKE NO SOUND (8/27/26, SOUND lane).

PEOPLE shipped the demo's ending today. It is the best-argued thing on the demo
path -- built on Kahneman and Fredrickson's PEAK-END RULE, which says what a
person keeps of an episode is predicted almost entirely by the most intense
moment and THE LAST ONE. Its centrepiece is the corpus's most repeated craft
device: a reply the player wants to send, sitting there greyed and dead.

MEASURED ON THE REAL SURFACE, not read:

    branch untaken   drew 4 lines   heardOnShow []   heardOnTapDeadVerb []
    branch failed    drew 5 lines   heardOnShow []   heardOnTapDeadVerb []

THE DEMO'S LAST MOMENT MAKES NO SOUND AT ALL, and the thing you are not allowed
to press answers a tap with nothing. That second one is not a missing nicety.
It is the exact failure the demo gap list already named as the sharp one:

    "ui_deny is the sharp one -- A REFUSAL WITH NO SOUND IS INDISTINGUISHABLE
     FROM A BROKEN BUTTON. It does not merely lose information, it teaches the
     wrong thing: the game looks broken rather than strict."

So the demo's designed final beat -- a refusal, on purpose, at the moment that
peak-end says is half of everything -- currently reads to a stranger as a bug.
The whole effect inverts.

*** AND IT IS 64 MOMENTS, NOT 5. *** The withheld verb is not an ending
feature. `@NOVERB` appears 59 TIMES ACROSS THE QUEST CORPUS and renders as
`<div class="noverb">` in every conversation card, plus the ending's 5. Every
one of them is silent. The game's single most repeated craft finding has never
made a sound anywhere.

*** THE CAUSE IS THE SAME TOO-NARROW MATCHER, A FIFTH TIME, IN THE SAME
FUNCTION, AND ITS OWN COMMENT WARNS ABOUT IT. *** __THE_CITY_ANSWERS_A_TAP__
(8/22, this lane) says, verbatim:

    "The first version of this matched only `button` and missed #phonebtn
     entirely -- measured silent on the walk, which is the FOURTH TIME THIS WEEK
     a too-narrow matcher has told me something was missing when it was my
     selector that was."

It was widened for the city's chrome divs and stopped there. A withheld verb is
a div with no class the matcher knows, so `if(!btn) return;` and the tap dies.
Writing the warning down did not make the next selector wide enough. Only
driving the surface did.

WHAT THIS TOOL DOES -- three wires, no pixels, no new sound:

  1. A WITHHELD VERB ANSWERS A TAP WITH ui_deny. `.noverb` and `.endnoverb` join
     the matcher and are refusals BY CONSTRUCTION, never by reading a label:
     the whole point of the element is that the game will not let you say it.
     ui_deny is approved and already in the rack. Nothing is cooked.

  2. THE ENDING'S MESSAGE LANDS AUDIBLY. phone_buzz, which is approved, already
     wired to the morning call, and is literally the same event: a message from
     a person arriving on your phone. REUSE-FIRST answered by using the sound
     the moment already has a twin for, not by cooking a new one.

  3. A STALE COMMENT IN MY OWN LADDER IS CORRECTED. KILLMUS still tells every
     reader that `talking` and `crowd` are UNWIRED and that "this lane does not
     edit that surface". Both were wired one turn ago, from the shell, without
     editing that surface. A doc that describes a system as unbuilt AFTER it was
     built is the exact rot the truth hierarchy exists to kill (the 8/1 fade
     line read [UNBUILT] for nineteen days), and it is mine, one turn old.

REUSE CHECK: cooks NOTHING. No bank opened, no candidate rendered, no voice, no
pixel. It plays two sounds Paolo already approved, at moments that had none.
banks/ was not read because nothing new is made; the rack is the source and both
ids are already in it.

WHAT THIS TOOL DOES NOT DO, deliberately:
  * No sting at the ending. The reckoning one screen earlier already announces
    the day's verdict, and re-announcing it over a friend's text message would
    score a phone call like a boss kill. The ending's sound is a phone and a
    refusal, which is what is actually happening.
  * No pixels. The greyed verb stays exactly as PEOPLE drew it. Whether a
    refusal should also FLINCH is RUN's SILENT-2 row and another lane's call.
  * No new behaviour on the card. The verb still does nothing. It now SOUNDS
    like it does nothing on purpose.

  python3 tools/bohemia_the_last_thirty_seconds_sound.py           # report
  python3 tools/bohemia_the_last_thirty_seconds_sound.py --write   # install
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')

# ---- 1. THE WITHHELD VERB ANSWERS A TAP ---------------------------------
MATCH_OLD = """      var btn=t.closest('button')||t.closest('.dcbtn')||t.closest('.tab')||t.closest('.opt')
             ||t.closest('#topbar>div')||t.closest('#devtray>div');
      if(!btn) return;"""

MATCH_NEW = """      /* __THE_WITHHELD_VERB_ANSWERS__ (8/27, SOUND lane). A FIFTH TOO-NARROW
         MATCHER, IN THE FUNCTION WHOSE OWN COMMENT ABOVE WARNS ABOUT THE FOURTH.
         `@NOVERB` is the corpus's most repeated craft device -- the line the game
         refuses to let you speak -- and it renders as a bare div: 59 across the
         quest corpus and 5 more in the ending. Every one of them was silent,
         because a div matches nothing above and the handler returned.
         AND SILENCE IS THE WORST POSSIBLE ANSWER HERE, not merely a missing one:
         "a refusal with no sound is indistinguishable from A BROKEN BUTTON. It
         does not merely lose information, it teaches the wrong thing." The demo
         now ENDS on one of these, so the last thing a stranger does in this game
         is press something that refuses them -- and if it is silent they file it
         as broken, not as deliberate, and the whole designed effect inverts. */
      var nov=t.closest('.noverb')||t.closest('.endnoverb');
      var btn=nov||t.closest('button')||t.closest('.dcbtn')||t.closest('.tab')||t.closest('.opt')
             ||t.closest('#topbar>div')||t.closest('#devtray>div');
      if(!btn) return;"""

REFUSED_OLD = """      var refused = btn.disabled===true
                 || (btn.classList && (btn.classList.contains('off')
                                    || btn.classList.contains('disabled')));"""

REFUSED_NEW = """      /* A WITHHELD VERB IS A REFUSAL BY CONSTRUCTION, never by reading a label.
         It carries no `disabled` and no `.off` because it is not a disabled
         control -- it is a sentence the game will not let you finish, which is
         the same fact stated in the author's grammar instead of the DOM's. */
      var refused = nov
                 || btn.disabled===true
                 || (btn.classList && (btn.classList.contains('off')
                                    || btn.classList.contains('disabled')));"""

# ---- 2. THE ENDING'S MESSAGE LANDS --------------------------------------
END_OLD = """  window.__ENDING = { key: e.key, from: e.from, says: e.says.slice(), noverb: e.noverb };
  cardShow(h, function(){ /* nothing to press: the day does not come */ });"""

END_NEW = """  window.__ENDING = { key: e.key, from: e.from, says: e.says.slice(), noverb: e.noverb };
  /* __THE_LAST_THIRTY_SECONDS_SOUND__ (8/27, SOUND lane). MEASURED SILENT the
     day this shipped: heardOnShow [] on every branch. Peak-end says the last
     moment is half of what anybody keeps, and half of what anybody keeps was
     arriving with no sound at all.
     phone_buzz, NOT something new: it is approved, it is already the morning
     call's sound in this same file, and this is literally the same event -- a
     message from a person landing on your phone. REUSE-FIRST is answered by
     the moment already having a twin, not by cooking a second one.
     NO STING HERE ON PURPOSE. The reckoning one screen earlier already
     announces the day's verdict; re-announcing it over a friend's text would
     score a phone call like a boss kill. */
  try{ if(window.parent&&window.parent!==window)
    window.parent.postMessage({bohemiaCitySfx:{ev:'phone_buzz'}},'*'); }catch(_e){}
  cardShow(h, function(){ /* nothing to press: the day does not come */ });"""

# ---- 3. MY OWN STALE COMMENT -------------------------------------------
LADDER_OLD = """       talking  UNWIRED -- a conversation begins INSIDE the city frame and no
                           message crosses to the shell today
       crowd    UNWIRED -- nothing counts people talking near you
     The two unwired ones are a ONE-LINE call each from the surface that owns
     them (INTENSITY.talking(true/false), INTENSITY.crowd(true/false)) and this
     lane does not edit that surface -- ONE SYSTEM, ONE SESSION. They are named
     here so the next lane can find them, and they are reported as unwired
     rather than counted as shipped. Built-but-not-triggered is the defect this
     repo has a law about, and half-claiming it is how it hides. */"""

LADDER_NEW = """       talking  WIRED 8/27 -- __INTENSITY_WATCHER__ below reads whether a
                           conversation card is up in the city frame
       crowd    WIRED 8/27 -- the same watcher counts people within five tiles
     *** THIS BLOCK SAID BOTH WERE UNWIRED FOR ONE DAY AFTER THEY WERE WIRED,
     AND IT WAS MINE. *** It also said "this lane does not edit that surface --
     ONE SYSTEM, ONE SESSION", which was true and was ALSO the reason nothing
     happened: the two triggers did not need that surface edited at all. The
     shell already embeds the frame and the city already publishes window.__CT,
     so a same-origin READ across a boundary that already exists closed both.
     A doc that describes a built system as unbuilt is the rot the truth
     hierarchy exists to kill -- the 8/1 fade line read [UNBUILT] for nineteen
     days after it was built. Correcting my own, one turn old, the same turn I
     noticed. Built-but-not-triggered is a defect; BUILT-AND-STILL-DOCUMENTED-AS-
     MISSING is how the next session decides not to look. */"""


# ---- 4. AND THE MUSIC LETS GO WHEN THE DAY DOES -------------------------
WATCH_OLD = """      var talking = false, crowd = false;"""

WATCH_NEW = """      /* __THE_DAY_IS_OVER__ (8/27, SOUND lane). MEASURED: kill two people, end
         the day, and the ladder is STILL AT LEVEL 3 when the ending lands --
         kills 2, level 3, on the real surface. So a friend's text message
         arriving after dark was scored like a firefight, at the exact moment
         peak-end says is half of everything a person keeps.
         `__ENDING` is published by the ending's own code the instant it draws,
         so the shell can see the day end WITHOUT the city being edited -- same
         shape as the other two triggers. ONE-SHOT, on the transition, like
         talking and crowd: nothing can raise the ladder after this anyway
         (no combat, no conversation), and re-resetting four times a second
         would be a system arguing with itself. */
      try{
        if(w.__ENDING && !endSeen){
          endSeen = true; lastTalk = false; lastCrowd = false;
          INTENSITY.reset();
          return;
        }
      }catch(_e){}
      var talking = false, crowd = false;"""

WATCH_VAR_OLD = """  var lastTalk = null, lastCrowd = null;"""
WATCH_VAR_NEW = """  var lastTalk = null, lastCrowd = null, endSeen = false;"""


def apply_all(city, alpha):
    """EVERY STEP CARRIES ITS OWN MARKER, and the marker is what "already done"
    means. The first cut of this asked whether new's FIRST LINE was in the file,
    and new's first line is a line of the ANCHOR, so one step reported "already
    installed" on a file it had never touched and the wire would have been
    silently skipped. That is the same mistake this whole patch is about -- a
    check matching the wrong thing -- committed in the tool that fixes it, which
    is why it is written down instead of quietly corrected. A marker is a claim
    only this tool can have made; an anchor line is not."""
    steps = []
    for name, marker, old, new, which in [
        ('the withheld verb reaches the tap handler',
         '__THE_WITHHELD_VERB_ANSWERS__', MATCH_OLD, MATCH_NEW, 'city'),
        ('and is a refusal by construction',
         'A WITHHELD VERB IS A REFUSAL BY CONSTRUCTION', REFUSED_OLD, REFUSED_NEW, 'city'),
        ("the ending's message lands audibly",
         '__THE_LAST_THIRTY_SECONDS_SOUND__', END_OLD, END_NEW, 'city'),
        ('my own ladder stops claiming it is unwired',
         'WIRED 8/27 -- __INTENSITY_WATCHER__', LADDER_OLD, LADDER_NEW, 'alpha'),
        ('the watcher can remember the day ended',
         'endSeen = false', WATCH_VAR_OLD, WATCH_VAR_NEW, 'alpha'),
        ('and the music lets go when the day does',
         '__THE_DAY_IS_OVER__', WATCH_OLD, WATCH_NEW, 'alpha'),
    ]:
        src = city if which == 'city' else alpha
        if marker in src:
            steps.append((name, 'already installed'))
            continue
        if old not in src:
            steps.append((name, 'FAIL: anchor not found'))
            continue
        if src.count(old) != 1:
            steps.append((name, 'FAIL: anchor is not unique (%d)' % src.count(old)))
            continue
        if which == 'city':
            city = city.replace(old, new, 1)
        else:
            alpha = alpha.replace(old, new, 1)
        steps.append((name, 'wired'))
    return city, alpha, steps


def main():
    write = '--write' in sys.argv
    city = open(CITY, encoding='utf8').read()
    alpha = open(ALPHA, encoding='utf8').read()
    city2, alpha2, steps = apply_all(city, alpha)

    print('=== THE LAST THIRTY SECONDS MAKE NO SOUND ===')
    bad = 0
    for name, status in steps:
        print('  %-8s %s' % (status if status != 'wired' else 'WIRED', name))
        if status.startswith('FAIL'):
            bad += 1
            print('           %s' % status)
    if bad:
        print('\n  refusing to write a partial patch')
        return 1
    print('\n  59 withheld verbs in the quest corpus + 5 in the ending now answer a tap.')
    print('  Nothing is cooked: phone_buzz and ui_deny are both his and both approved.')
    if not write:
        print('\n(--write to install)')
        return 0
    open(CITY, 'w', encoding='utf8').write(city2)
    open(ALPHA, 'w', encoding='utf8').write(alpha2)
    print('  wrote both surfaces')
    return 0


if __name__ == '__main__':
    sys.exit(main())
