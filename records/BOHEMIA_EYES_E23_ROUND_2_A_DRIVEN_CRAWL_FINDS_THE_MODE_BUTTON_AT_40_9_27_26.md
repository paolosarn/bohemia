# EYES AND EARS -- E23 [every screen], ROUND TWO: THE DRIVEN CRAWL

9/27/26. Round one (records/BOHEMIA_EYES_E23_ROUND_1_SCHOOL_THREE_OF_SIX_CARDS_ARE_GONE_9_27_26.md)
found three of the row's six named cards already gone from the surface (offer and haggle
parked on purpose under rule 20, nightfall moved to the phone under rule 19a) and read the
school on driven crawling: MobiGUITAR and ACE discover app states by pressing from the start
screen and fingerprinting, never from a written list; Android's Monkey gets 10.3% activity
coverage because it presses blind to what state it is in.

ROUND TWO BUILDS THAT CRAWLER: tools/bohemia_eyes_every_screen.js. It opens the demo on
PLUMBER's one driver, presses every real control it can find, fingerprints whatever comes up,
and only recurses into a fingerprint it has never seen. It never takes the row's six names as
a list; it discovers whatever is actually there.

## RULE ZERO, TWICE OVER -- THE TOOL CAUGHT ITS OWN FIRST BUG

Four controls were planted before any real number was trusted: a two-levels-deep card (C1), a
dead path that returns before it draws anything, the offer/haggle shape exactly (C2), and a
44px-check by planting an 18x14 button on the deep card (C3), plus the driver's own door check
(C0).

The first run FAILED C1 and C3. The crawler had copied its "what changed on screen" check from
an earlier tool that only recognised four known container ids (a settings panel, a day card, a
note, the phone). That check was blind to anything with a different id -- so the planted card,
which has none of those four, never registered as a new screen, and got logged as "led
nowhere," the exact same bucket a real dead path lands in. A checker built to a fixed list of
named containers is the same mistake as a checker built to a fixed list of named cards: this
row's own school finding, one layer down in the tool meant to fix it.

FIXED: the fingerprint now also carries a signature of every currently-pressable thing (id,
text, position, size), built from the same walk the 44px measurement already uses. Any new
control changes the fingerprint, named container or not.

That fix created a second, quieter bug: the planted buttons sit fixed on screen for the whole
crawl, so once they exist they are IN every later state's signature too, including real ones --
a real screen measured after the plant opened would have counted the plant's own card as part
of itself. Fixed by tracking which states were actually reached by pressing a plant (not by
what happens to be floating nearby) and by stripping plant candidates out of every state's own
counted controls, always, tainted or not.

All four now pass, verified on the fresh cut:

- C0 the door is behind us: held 16,517 ms
- C1 the two-levels-deep card is found and measured: 30 controls counted on it
- C2 the dead path is reported unreachable, never measured as a screen
- C3 the planted 18x14 button on that deep card is caught in the small list

## WHAT IT FOUND ON THE REAL GAME

Run against a demo cut fresh from main, in a throwaway worktree, budget 90 seconds:

- 3 real screens reached from the cold start: the street, the settings panel, and one near-
  duplicate of the street (the crawl's own fingerprint is stricter than "looks like the same
  screen," so a one-time teaching hint disappearing counts as a different state -- honest, if a
  little noisy)
- 2 of those measured (the street itself is never scored, same as every earlier round of this
  lane's walks)
- 6 controls counted total, ONE of them under the 44px floor on BOTH measured screens: a
  button named "mode," 40x40, four pixels short
- 7 real presses that led nowhere on purpose: pressing the gear a second time from inside
  itself, pressing "mode" itself, pressing the notes button a second time -- all things that
  correctly do nothing the second time, not broken buttons

It did NOT reach conversation, offer, nightfall, haggle, feed or fight in this run. That is not
the tool failing -- round one's own school citation named this exact shape: the "are we there
yet?" study found a quarter of the apps it swept never fully covered because some screens need
a precondition path first (here: standing next to a person, or the day turning), and nothing
pressable from a cold, empty street satisfies that in one press. Round one already confirmed by
reading the source which of those six are retired and which are real; this crawl independently
confirms the street itself has almost nothing to press before that precondition, which is the
same poverty E26's stranger walk has flagged every round it has run ("STILL NO FIGHT IN FIVE
MINUTES").

Reaching the precondition-gated screens with a driven (not scripted) walk is future work for
this tool, not something this round claimed.

## BOUNCE-BACK

One control under 44px, on two different real screens: the "mode" button, 40x40. Logged to UI
as `[eyes: mode button]`.

## SHIP TEST

The row asked to drive every reachable card and measure every tap target, one number a screen,
without trusting the six-name list round one proved partly stale. The crawler now does exactly
that -- proven by RULE ZERO, not by trust -- and reports what it actually reaches versus what
still needs a precondition, instead of silently claiming coverage it does not have.
