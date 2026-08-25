# THREE SOUNDS ARE THE ONLY COPY OF SOMETHING THE PLAYER NEEDS
# (8/25/26, coordinator sweep 19. A DECISION, two small routed items, and
# a research finding that KILLED THE BIGGER VERSION OF MY OWN THESIS.
# Reported that way on purpose.)

## 1. THE QUESTION I WENT IN WITH, AND WHY IT WAS THE WRONG SIZE
SOUND shipped hard this week: 17 approved sounds into combat, "what a
fight sounds like," 500+ sfx in the rack, 24 music batches. I went
looking to ask whether a portrait iPhone game was pouring effort into a
channel most players never turn on.
**THE DATA SAYS NO, AND I WAS WRONG.** Practitioner analytics on mobile
players: about **73% play with volume at 10% or higher**; more recent
figures put regular sound-on near 60% with only about **9% playing
completely silent**, and roughly **78% of US players** with sound on. And
the reason people mute is almost never disinterest — around 70% call
sound an important part of the experience — it is SITUATIONAL: people
nearby, a noisy room, battery.
SO THE SOUND INVESTMENT IS NOT WASTED AND THIS RECORD DOES NOT ASK FOR
ONE MINUTE OF IT BACK. I am writing the number that beat my hypothesis
into the record, because a sweep that only reports the findings that
survived is a sales pitch.
**WHAT SURVIVES IS NARROWER AND SHARPER, AND IT IS THREE SOUNDS.**

## 2. THE MEASUREMENT
Sound cues in the walked surface split into two kinds, and only one kind
matters here:
- **ATMOSPHERE** — neon_buzz, footsteps on six approved surfaces, the
  music rack, the fight. If you cannot hear these you lose beauty. You do
  not lose the game. That is most of the 500.
- **INFORMATION** — the sound IS the message:
      `phone_buzz`   a job just arrived on your phone
      `done_ring`    the thing you were doing finished
      `save_chime`   your run was written to disk
**FOR THOSE THREE, NOTHING IN THE PIXELS SAYS IT.** Neither slice carries
any handling for a muted player: the walked surface has ONE mention of
mute or volume in 30,000+ lines, and it is not that. There is no caption
gate, no mute gate, no "visual twin" anywhere in gates/, and no backlog
row about silent play. Nobody has started this.

## 3. WHY THIS IS WORSE THAN IT LOOKS, AND IT LANDS ON THE DEMO
Sweep 14 already established from RUN's own record that the day's work is
behind the PHONE, and that **the only thing pointing at it is one unread
badge** — the reason RUN P0-MORNING exists.
**THAT MEASUREMENT ASSUMED THE PLAYER COULD HEAR THE BUZZ.** For a muted
player the badge is not the weakest signifier, it is the ONLY signifier.
So the first-morning problem is strictly worse than it was measured to
be, and P0-MORNING should be sized against the silent case, not the
audible one. That is not a repeat of sweep 14; it is a correction to its
inputs.
AND THE FRIENDS ROUND IS THE EXACT SITUATION THAT PRODUCES MUTING: 5-8
people opening a link on their own phones, wherever they happen to be,
with other people around.

## 4. THE GUIDELINE IS ALREADY ACCEPTED HERE — IN THE OTHER CHANNEL
The Game Accessibility Guidelines put **"ensure no essential information
is conveyed by sounds alone" in the BASIC tier** — the lowest bar, the
one nobody is supposed to miss — and the guideline text names
**situational impairment explicitly**: a noisy environment, or sound
muted. Xbox Accessibility Guideline 103 and the IGDA accessibility SIG
say the same. Deaf-accessibility practitioners name the two tools plainly:
captions for speech, and VISUAL CUES for everything else, "such as a
siren alerting a player of an imminent event."
**AND WE ALREADY AGREED TO THIS PRINCIPLE, FOR COLOUR.** Backlog SHARED
-6, from the 8/15 sweep, adopts the sibling rule word for word — "no
essential information by a fixed colour alone," Basic tier, WCAG 1.4.1,
Xbox AG 103 — and routes a greyscale/colourblind gate for it. **THE SAME
DOCUMENT, THE SAME TIER, LISTS SOUND, AND WE TOOK ONE AND LEFT THE
OTHER.** That is the finding a coordinator exists to catch: not a missing
idea, an idea adopted in one channel and never carried across.

## 5. THE OTHER AISLE, AND IT HANDS US A FREE TEST
The accessibility practitioners give the cheapest verification I have
seen for anything this project has ever worried about:
> ask someone to play through for the first time **with the sound muted**
> — if at any point they cannot progress because information was missed,
> it needs to be conveyed another way.
**ONE OF THE FRIENDS-ROUND TESTERS PLAYS MUTED.** It costs nothing, it
needs no build, it uses a round we are already running, and it answers
the question with a real stranger instead of an argument. The protocol
already says Paolo says nothing while they play, so the instruction is
one line in the invite.
Scale, for completeness rather than drama: WHO's 2016 figure is over 360
million people with mild to profound hearing loss, and the guideline's
own framing is that permanent and situational impairment need the same
fix. We are not building this for a rare case. We are building it because
a bus is a rare case that happens to everybody.

## 6. THE DECISION (mine, EVERYTHING IS A THUMB)
**A SOUND MAY BE THE BEST COPY OF A MESSAGE. IT MAY NEVER BE THE ONLY
COPY.** Atmosphere is exempt and untouched.
1. **THE THREE INFORMATION CUES GET A VISUAL TWIN.** Not a caption track,
   not a settings menu, not a tutorial. Three small pixel events that
   already have somewhere obvious to live: the phone, the objective line,
   the save indicator. Small enough to ship inside another turn.
2. **SOUND CLASSIFIES, RUN DRAWS.** The rack's owner says which cues are
   INFORMATION and which are ATMOSPHERE — 500+ sounds, and only that lane
   knows. RUN owns the walked surface, so RUN draws the twins. Neither
   lane has to learn the other's system, which is the boundary that keeps
   getting crossed in this repo.
3. **ONE MUTED TESTER IN ROUND 1.** One line in the invite.
4. **NOTHING IS TAKEN AWAY FROM THE SOUND WORK.** 73% of players hear it
   and it is doing its job. This is a redundancy rule, not a budget cut,
   and the record says so in its own §1.

## 7. ROUTED
- **SOUND — SILENT-1: SAY WHICH SOUNDS ARE MESSAGES.** A one-column pass
  over the rack: INFORMATION or ATMOSPHERE. Only INFORMATION cues need a
  twin. Expect the list to be tiny; phone_buzz, done_ring and save_chime
  are the three I can already see, and this lane will know the rest.
- **RUN — SILENT-2: DRAW THE TWIN FOR EVERY INFORMATION CUE.** Then
  SIZE P0-MORNING AGAINST THE SILENT CASE, because that is the case the
  first morning is actually failing in.
- **GATE, with SILENT-2 (a law without a machine gate is not enforced) —
  `silent_play_gate`:** drive the demo with audio disabled and assert
  every INFORMATION cue produced a visible change in the same beat.
  Mutation test: delete one twin -> red. **AND THE CLAIM MUST BE ABOUT
  PIXELS, NOT ABOUT A FUNCTION HAVING BEEN CALLED** — this repo has
  spent a month finding finished code with no caller, and a gate that
  checks the call instead of the pixel is that bug wearing a badge.
- **INTO THE FRIENDS-ROUND PROTOCOL:** one tester muted, deliberately,
  and it is recorded as a condition of that tester's paste.

## 7b. CORRECTED THE SAME DAY BY THE LANE I ROUTED IT TO, AND THEY WERE
## RIGHT ON ALL THREE COUNTS
SOUND answered SILENT-1 within two hours (commit 512f0e3), classifying 61
sounds against a SHARPER test than the one I handed them — "if he cannot
hear it, does he MISS A STATE CHANGE HE HAS TO ACT ON" — and returned
11 INFORMATION / 50 ATMOSPHERE / 3 with no twin at all.
1. **`done_ring` IS A CORPSE.** I named it as one of the three. It is
   0 up / 5 down, holds no approved sound, and its SFX died 10 for 10
   across two ids; a STING carries that moment now. A twin for it would
   have been another lane's turn spent on something no player will hear.
2. **`phone_buzz` ALREADY HAS A TWIN** — the badge — so it was never one
   of the three either.
3. **MY SCOPE WAS WRONG.** I wrote "a one-column pass over the rack", and
   the rack is the SFX engine. THE MOST INFORMATION-DENSE SOUNDS IN THIS
   GAME ARE STINGS, NOT SFX: taken / paid / done / missed are pure state
   change. A pass that walked only the SFX table would have missed
   STING:missed entirely.
**THE REAL THREE, WHICH ARE BETTER THAN MINE:** `save_chime` (the run was
written — exactly what a person checks before putting the phone down);
`ui_deny` (YOU CANNOT DO THAT — a refusal with no sound is
indistinguishable from A BROKEN BUTTON, so it does not merely lose
information, it teaches the wrong thing); and `STING:missed` (the job
went unfinished — the quietest failure in the game, because nothing
announces the day ended with the work undone, he just wakes up on day
two).
RUN SILENT-2 BUILDS AGAINST SOUND'S THREE, NOT MINE. And the lane got
there by refusing to treat a routed task as exempt from being checked,
which is the behaviour this fleet should want from every routing I write.

## 8. CONFIDENCE
- The three cues and the absence of any mute handling, caption gate or
  backlog row: greps over both slices and gates/. **HIGH** — I did not
  trace every render path and am not claiming there is zero visual
  feedback anywhere near them, only that nothing is designed for it.
- The mobile sound-on numbers: vendor analytics and trade press, not
  peer-reviewed, and they disagree at the edges (73% vs ~60% regular).
  **MEDIUM** — and they are the numbers that BEAT my hypothesis, which is
  why they are in §1 and not buried.
- The Game Accessibility Guidelines Basic-tier wording and the
  situational-impairment framing: primary source. **HIGH.**
- That we adopted the colour half and skipped the sound half: read from
  our own backlog row. **CERTAIN.**
- That a muted tester finds something in round 1: a **PREDICTION**, and
  the cheapest one this project has ever placed.

## SOURCES
Game Accessibility Guidelines, "Ensure no essential information is
conveyed by sounds alone" (Basic tier) and the full list; Xbox
Accessibility Guideline 103; IGDA Game Accessibility SIG, On Auditory
Disabilities; Can I Play That, deaf/HoH accessibility guide; Game
Developer, "Deaf Accessibility in Video Games"; TouchArcade/Appington
Amplify analytics on mobile sound-on rates and the International Sound
Directory survey write-up; Immersion, "Embracing the Mute Switch"; WHO
hearing-loss figures. In-repo: slices/BOHEMIA_CITY_WORLD.html (cue names
and the absence of mute handling), gates/demo_sound_gate.js,
BOHEMIA_BACKLOG.md SHARED -6 (the colour half we already adopted),
records/BOHEMIA_THE_FRIENDS_ROUND_IS_NOT_READY_8_24_26.md.
