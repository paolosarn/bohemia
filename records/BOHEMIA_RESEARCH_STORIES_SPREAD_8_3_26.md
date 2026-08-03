# BOHEMIA RESEARCH — HOW A STORY SPREADS (8/3/26)

> "we gotta tie witnesses or people seeing actions and then it could like spread
> maybe like a plague ... people definitely would share those stories ... likely to
> spread easier like a virus ... maybe we can have different degrees of stories ...
> do some online research on how games have previously done that ... people will
> have memory too ... we are essentially also caring about the memory of NPC's as
> well now"
> — Paolo, 8/2/26

He asked for this research by name. This is R21 + R20 of
`records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md`, and it is the LAB
lane's top item because it is the ruling every other consequence ruling feeds.

**NOTHING IS BUILT. NO MECHANISM IS PROPOSED AS FINAL.** This is a survey of what
has actually shipped, what worked, and the one game that already solved the exact
thing he described.

---

## THE ANSWER IN ONE LINE

**DWARF FORTRESS ALREADY BUILT WHAT HE DESCRIBED, AND ITS KEY MOVE IS THAT A RUMOUR
IS AN OBJECT, NOT A NUMBER.**

Not a reputation score that goes up and down. A **thing** — a specific piece of
information about a specific event — that is **created by a witness**, **carried by
whoever holds it**, and **handed to other people**. Reputation is what you get when
you ask a population what it is carrying. That is a completely different data
structure from a meter, and it is why theirs can do things a meter fundamentally
cannot.

---

## 1. DWARF FORTRESS — THE ONE TO EMULATE

The mechanics, from their own wiki:

- **A RUMOUR IS A PIECE OF INFORMATION ABOUT A SPECIFIC HISTORICAL EVENT.** It
  points at a thing that happened, not at a person's score.
- **RUMOURS ORIGINATE WITH WITNESSES OF THE EVENT**, and anyone who has *heard* a
  rumour can then spread it themselves. That is the plague structure exactly:
  witness = patient zero, hearing = infection, telling = transmission.
- **THE PLAYER IS A VECTOR TOO.** You can spread a rumour deliberately by bringing
  an incident up in conversation, or by **bragging in front of witnesses**. And
  the detail I love: **summarising the incident is more effective than bragging
  about it.** Telling the story well spreads it further than showing off does.
- **★ PROPAGATION FIRES WHEN THE SITE OFFLOADS.** The spread starts as you leave
  and the location stops being simulated. This is the cheapest possible
  implementation of a population-wide process: **you do the diffusion at the moment
  you stop rendering the people.** For a phone game that has to hold a 96×96-district
  valley, that is not a detail, that is the whole feasibility argument.
- **★ YOU CAN KILL THE VECTOR.** If witnesses see you murder somebody, you can try
  to kill all of them **before the site offloads** — because offload is the
  requirement for the rumour system to start working. Silence the witnesses in
  time and the story never existed. That is a real, dark, legible player decision
  that falls straight out of the data structure with no extra system, and it is
  worth more than any number of dialogue branches.
- **RUMOURS ARE TRUE.** No false rumours spread. The single exception is
  **identity**: for people with secret identities, the misinformation is about
  *who did it*, never *what happened*.
- **★ THE KEY IS THE IDENTITY, NOT THE PERSON.** Ask about an agent by their true
  name, or by a name they used in a previous town, and people who know a great deal
  about them *under their current alias* will honestly say they have no idea who
  you mean. The population's memory is indexed by identity, not by body.

That last point is the same finding RDR2's witness system produced from the other
end (`records/BOHEMIA_RESEARCH_RDR2_8_1_26.md`: two bits of state, a witness must
physically travel to report you, and a bandana breaks the identification). Two very
different games, same conclusion: **what spreads is a story about a NAME.**

## 2. SHADOW OF MORDOR — AN EVENT RESHAPES THE POPULATION, NOT A METER

The Nemesis system is the most-missed mechanic of its generation and the reason is
structural: orc captains sit in tiers, and **when one kills you it gets promoted**
and gains new strengths. Your defeat does not decrement a number, it **changes who
somebody is** and hands them a permanent story about you.

The transferable rule: the strongest consequence system does not record that
something happened, it **rearranges the cast**. Applied to R21, a story that
spreads should be able to change an NPC's *standing among the others*, not only
their opinion of you.

## 3. CRUSADER KINGS — A RUMOUR IS A TIMED OBJECT WITH AN AUTHOR

CK2 lets a character deliberately **slander** somebody, which attaches a "Vicious
Rumors" modifier: −10 general opinion, **for five years**. Three things worth
having:

1. A rumour can be **planted on purpose** by somebody who was not a witness.
2. It carries an **expiry**. Stories die.
3. It is **general** opinion, not one relationship — a rumour is a broadcast.

## 4. SKYRIM — THE ANTI-REFERENCE, AND IT IS INSTRUCTIVE

Disposition plus faction reputation, which was real memory for its era. Two
failures that are famous precisely because they break the fiction:

- **Paying a bounty makes an entire province forget you were ever a murderer.**
- **A guard who caught you red-handed greets you as a stranger** once the meter
  cools down.

Both failures come from the *same* cause: the memory lived in a **decaying number
attached to a faction**, so there was nowhere for "this specific guard personally
saw you do it" to be stored. **A meter cannot remember who was in the room.** That
is the argument for the object model in one sentence, and it is why R21 cannot be
built as a reputation bar no matter how many bars you use.

## 5. RIMWORLD — WITNESSING IS ORDINARY, NOT SPECIAL

Colonists form opinions from **observed social interactions** — the sensing is a
general capability every pawn has, and it is watching other NPCs, not only the
player. That is precisely his R20 instruction: *"witnesses and visible actions tied
to all NPC's."* Not a guard-only feature. Everybody sees, and what they see
includes each other.

## 6. THE FIELD IS OPEN AND THE MODERN ATTEMPTS ARE NOT SOLVING IT

The recent crop of "NPCs that remember you" games is being marketed on reputation
propagating across a gossip network with −100..+100 scores, and the Skyrim
LLM-memory mods bolt a language model onto a conversation. Both are still meters
or transcripts. **Nobody has shipped the object model at scale since Dwarf
Fortress**, which means R21 is a genuinely differentiating feature and not a
me-too. Given his stated goal on this exact ruling — *"I want to be a
multimillionaire off this game"* — that matters.

---

## WHAT I RECOMMEND FOR BOHEMIA

Five rules, all shape, no numbers.

**RULE 1 — A STORY IS AN OBJECT, NOT A SCORE.** `{what happened, who it was about
(by identity), who is carrying it, how well they know it}`. Standing is computed by
asking the population, never stored as a bar. This also keeps R17 honest: the
silent ledger *is* the store, and it never needs a display.

**RULE 2 — WITNESSING IS A GENERAL CAPABILITY OF EVERY NPC** (his R20), and it
sees other NPCs too, not only the player (RimWorld). Cheap, and it makes the city
feel alive without any content.

**RULE 3 — SPREAD RUNS WHEN A DISTRICT UNLOADS.** Dwarf Fortress's trick, and the
only version of this that a phone can afford across a 96×96 valley. The player
walks away and the story moves while nobody is looking.

**RULE 4 — DEGREES OF A STORY ARE DEGREES OF FIDELITY, NOT SEVERITY.** He asked for
"different degrees of stories." The clean axis is not how bad it was, it is **how
much survived the retelling**: the witness knows what you did and who you are;
three tellings later somebody knows something happened to somebody. That gives you
his degrees for free and it is how real rumour actually behaves.

**RULE 5 — THE VECTOR IS KILLABLE, AND THAT IS THE POINT.** Because a story starts
in specific people, silencing them works — and having to decide that is a far
heavier moment than any gore. This is TRAUMATIC NOT GORY doing its job through the
consequence system instead of through pixels. **It is also the single darkest thing
in this document and it needs his ruling before anybody builds it.**

## WHAT I AM NOT DECIDING

- Spread rates, decay, how many degrees, how long an NPC remembers. All his.
- Whether rule 5 exists at all. **[PENDING Paolo]**, flagged loudly — a mechanic
  that rewards killing witnesses is a content decision, not a mechanism one.
- Whether the player can plant a false story (CK2's slander). His.
- Whether identity-breaking (a mask, a change of name) is in Bohemia at all.

## HONEST LIMITS

- **Every primary page 403'd through this environment's proxy**, including the
  Dwarf Fortress wiki itself. All of the above is from search-index summaries of
  those pages, so this is **DOC_ONLY** under the lab tiers: close paraphrase, not
  verbatim citation, and no `file:line` anywhere.
- **The Dwarf Fortress claims are the load-bearing ones and they are the ones I
  would most want to re-read at the source** before anybody builds against them,
  particularly the exact offload trigger.
- I have not played any of these except in the general sense; nothing here is a
  measured mechanic the way the CDDA and Valheim teardowns were.

Sources (search-index summaries; primaries unreachable): the Dwarf Fortress wiki's
Rumor, Reputation, Agent and Visitor pages; the CK2 wiki's Rumours events and
Intrigue focus pages; PC Gamer and IGN on the Nemesis system; RimWorld and Skyrim
community documentation; and the "NPCs that remember you" marketing round-up.
