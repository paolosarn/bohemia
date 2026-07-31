# BOHEMIA ADDENDUM — NOBODY HAS A NAME UNTIL YOU ASK, AND A ROUTINE IS INVISIBLE
## Paolo, 7/31/26. TWO RULINGS LOCKED, ONE IDEA EXPLICITLY NOT.

This answers a standing question that had been open since the individual-schedule
research landed (records/BOHEMIA_RESEARCH_INDIVIDUAL_SCHEDULES_7_31_26.md, the
Majora's Mask finding): **does the game ever SHOW you somebody's schedule?**

He said no, and then ruled a second thing nobody had asked about.

---

## HIS WORDS, VERBATIM (voice-to-text, transcribed as spoken)

> "No, I talked about it with the other chat. I think the only thing I want you
> know other than dialogue at the very beginning unless it's a story reason or
> request reason like you will not know anyone's name and you'll have to ask
> everyone so everyone will pretty much have generic faction or non-faction you
> know identities and then you can personally ask them for their name and then
> the game will track that so anytime you might see them in the future like their
> name will pop up and I think that'll be cool but yeah no but it will all be
> invisible information. That's extremely useful for us. Yeah I mean it might be
> a cool mechanic though like maybe if you do a full on like network amalgamation
> friendly play through like maybe there's a quest that you know allows you to
> unlock that ability potentially maybe but that's just an idea for now but yeah."

---

## RULING 1 — A ROUTINE IS INVISIBLE INFORMATION. **LOCKED.**

"it will all be invisible information."

The game NEVER displays a person's schedule, routine, day shape, working hours,
or where they will be later. Not on a card, not in a menu, not in a phone screen,
not as a hint. The whole system exists to be FELT — the street is busy at eleven
and dead at two — and never to be READ.

**This overrides the Majora's Mask precedent for Bohemia.** The Bombers' Notebook
was the reference case for "a routine nobody can observe is wasted work"; his
answer is that observing it means WALKING IT, not consulting it. The work is not
wasted, it is diegetic. You learn a neighbour's hours by being on the street at
different hours, which is the only way anybody has ever learned a neighbour's
hours in real life.

WHAT IS STILL LEGAL, because it is not a routine:
  - WHERE SOMEBODY IS **RIGHT NOW**, when you are looking at them. That is
    eyesight, not a timetable.
  - What somebody is DOING right now, for the same reason.
The line is TENSE. Present tense is eyesight. Future or habitual tense is a
timetable and is banned.

## RULING 2 — YOU DO NOT KNOW ANYONE'S NAME UNTIL YOU ASK. **LOCKED.**

"you will not know anyone's name and you'll have to ask everyone."

1. **Everybody starts anonymous.** A person you have not asked is identified by a
   GENERIC IDENTITY ONLY: their faction, or their non-faction role. "The
   scavenger." "An Amalgamation lineman." Never a name.
2. **You ask them, personally.** Asking a name is a thing the player DOES, in
   conversation, one person at a time.
3. **The game tracks it, forever.** Once asked, that name is known.
4. **It pops up on sight.** "anytime you might see them in the future like their
   name will pop up." The name becomes part of how that body reads from then on.

THE TWO EXCEPTIONS, both named by him:
  - **"dialogue at the very beginning"** — the opening may hand you a name, the
    way a real first day does.
  - **"a story reason or request reason"** — a quest that needs you to know a
    name, or one that is about a named person, may give it. A quest ASKING for
    somebody by name is a story reason.
Outside those two, a name is earned by asking. There is no third door.

WHY THIS IS THE RIGHT MECHANIC AND NOT JUST FLAVOUR: it makes the population a
thing you can make PROGRESS against without adding a single system. A city where
you know four names is a different city from one where you know forty, and the
difference is entirely player effort. It also means MECHANISM-MINE /
CONTENTS-PAOLO'S survives intact — the machine can hold the asking, the tracking
and the popping-up while the actual NAMES stay his to write.

## RULING 3 — NOT A RULING. **AN IDEA, EXPLICITLY PARKED.**

"maybe if you do a full on like network amalgamation friendly play through like
maybe there's a quest that you know allows you to unlock that ability potentially
maybe but that's just an idea for now"

An Amalgamation-friendly playthrough might, via a quest, unlock the ability to
SEE the invisible information. He said "maybe" four times and closed with "that's
just an idea for now." **NOTHING IS BUILT FOR THIS.** No hook, no flag, no
placeholder, no "so it is ready when he rules."

TWO THINGS ABOUT IT ARE WORTH RECORDING NOW, because they are what makes it good
if he ever takes it:
  - It is thematically exact. The Amalgamation is the faction with the eerily
    perfect NETWORK (CLUSTERED POWER, LIGHT=TERRITORY). A faction that runs the
    only working infrastructure being the only faction that can hand you a
    surveillance view of everybody's day is the setting arguing for itself.
  - It gives the invisibility a PRICE rather than making it a limitation. Ruling
    1 stops being "you cannot see this" and becomes "seeing this costs you an
    allegiance", which is a different and much better thing.

[PENDING Paolo] AMBIGUITY, STATED RATHER THAN GUESSED: "that ability" reads from
context as SEEING SCHEDULES (it follows immediately from "it will all be
invisible information"), but it could mean knowing names without asking. Not
decided here. Nothing is built either way.

---

## WHAT THIS CHANGES IN THE REPO, TODAY

**A CONFLICT WITH WORK THAT SHIPPED ONE HOUR BEFORE THE RULING**, recorded here
and NOT fixed by this lane, because it is another lane's system (ONE SYSTEM, ONE
SESSION):

  `engine/bohemia_people.js` `cardFor()` renders a row labelled **THEIR DAY**,
  whose value is `dayLineOf()` -> e.g. "OUT 07:15 · HOME 21:30". That is a
  routine, printed, on a card the player opens. Ruling 1 bans it. The PEOPLE
  lane shipped it at 18:38 on 7/31; the ruling arrived after. Nobody did anything
  wrong — the law did not exist yet. It is theirs to remove or to argue.

  The same card's **RIGHT NOW** row is FINE and should stay: present tense is
  eyesight.

  The same card's **NAME** row is already compliant by accident: `nameOf()`
  returns null for everybody and `NAMED_CAST` ships empty, so nothing displays a
  name today. Ruling 2 turns that from "no names exist yet" into "names exist and
  are EARNED", which is new work and a good fit for the `met` ledger that lane
  already built — it is already the right shape, keyed per person and surviving a
  save load.

GATE: `gates/invisible_schedule_gate.js`. It holds ruling 1 going forward and
names the one pre-existing violation above as a DATED WAIVER, so a second one
fails the build and the first cannot rot quietly.

## THE LIFE LESSON UNDERNEATH (never preached in game)
You do not get to know people by looking them up. You get to know them by turning
up, repeatedly, and by asking. The game charges you the same price real life
does, and it never tells you that is what it is doing.
