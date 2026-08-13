# BOHEMIA ADDENDUM — WHAT THEY WANT FROM YOU (8/12/26, FACTIONS lane, LOCKED)

> **Paolo, 8/12: "do big brain online research if you need to then execute... Do
> what you have to do next and know what comes after... we are trying tk create
> the best funnest deepest videogame ever."**

## THE HOLE, AND THIS LANE DUG IT

Two turns built a **door** — `THE SIXTEEN INTRODUCTIONS`, sixteen different ways
to learn a faction member's name. One turn built the **lock** — `WHO KNOWS WHO`,
the Mob will not be asked, somebody inside has to vouch for you.

And then you get through the door and **there is nothing in there.** No reason to
want in. No idea what they want. No idea what it is worth.

Both halves of that answer had been sitting in his dossiers since 8/2, thumbed up,
read by nothing — the same disease as the last two turns, one layer further in:

- **WHAT THEY WANT FROM YOU** — the price of belonging
- **WHAT THEY TRADE / CONTROL** — what belonging is worth

And they are not sixteen paraphrases of "help us". They are sixteen **economies**:

| | his canon, verbatim |
|---|---|
| REMNANTS | "**Not loyalty. INFORMATION ABOUT THE ROAD.** ... They will pay in ammunition and they will remember an accurate report longer than they remember a favour." |
| CARTEL | "They want you to **OWE** them. Not to work for them, not yet. The first thing they give you is free and it is exactly the thing you needed that week." |
| MOB | "You **ACCOUNTED FOR**. Not loyal, not employed — listed." |
| CHURCH | "You inside the structure... **They will help you before you agree to any of that, which is exactly what makes it work.**" |
| VOLUNTEERS | "Hands, and supplies... **They will refuse a gift that would make them worth robbing.**" |
| ANARCHISTS | "For you to show up. **Not sign anything, not join anything** — be there, once, when it matters." |
| KARENS | "For you to either join properly or leave properly. **Ambiguity is the thing they cannot process.**" |
| AMALGAMATION | "Nothing from you until you look at it. **It is the only thing in the valley with no offer.**" |

## THE RESEARCH

**LAVE & WENGER 1991, LEGITIMATE PERIPHERAL PARTICIPATION** (*Situated
Learning*). Nobody **joins** a real community of practice. Newcomers are admitted
to do low-stakes work at the **edge**, and they move inward as they turn out to be
useful, until the newcomer is the old-timer mentoring the next one. Membership is a
**gradient you drift along by doing the peripheral task**, never a switch you flip
by signing something.

That is exactly the shape of his sixteen sentences. Every one names a small,
doable, peripheral thing — show up once, be at the meeting, tell them what the road
looked like, be reachable — and **not one of them is a membership form.** The
Anarchists say the quiet part out loud: *"Not sign anything, not join anything."*

**WHO MOVES FIRST** is the other half, and his own canon settles it for several of
them. The Church "will help you before you agree to any of that, which is exactly
what makes it work." The Cartel's "first thing they give you is free and it is
exactly the thing you needed that week." **Same mechanic, opposite intent** — an
unreciprocated gift creates an obligation, and that is the engine under both a
congregation and a debt trap. The game does not say which one you are in, and it
must not.

## THE LAW

**1. BOTH HALVES ARE HIS, AND THE MACHINE PINS THEM.**
`engine/bohemia_belonging.js` is GENERATED from `records/factions/*.md`. Each rule
carries **two anchors** — verbatim fragments of both dossier sentences — and the
generator **refuses to run** if either has moved. 32 anchors, all checked.

**2. BELONGING IS NOT STANDING.** This lane already has a reputation organ.
Standing is what they **think** of you; belonging is **how many times you did the
thing they want**, and you can be well liked by an outfit you have never once
turned up for. The gradient walks off a **count**, incremented by the world bridge
when an authored `@DO faction X +N` resolves positively. Gated: `+6` then `+1` is
**two deeds, not seven**, and hurting them is not a step toward belonging — that
axis is standing and it already exists.

**3. THE COUNT IS ONLY EVER POSITIVE DEEDS,** and it rides `save.meta.gave`, so
the ladder survives a reload and needs no save migration.

**4. NO OUTFIT, NO BARGAIN.** The ~85% who run with nobody get **nothing** on the
card — not "they want nothing from you", which would be a statement about the
person rather than about an outfit that does not exist.

**5. NOTHING OF HIS IS DECIDED.** The Mob dossier carries an explicit open
question — whether the Mob **is** the Cartel, absorbs it or stands beside it, and
whether they hold the guarantor seat. It is carried through as **PENDING**, printed
on the page as STILL YOURS TO DECIDE, and gated so nobody quietly answers it.

**6. THE RUNGS ARE MINE AND HE CAN HATE THEM.** 1 / 3 / 6 / 10 acts to go from a
stranger to inside. Under EVERYTHING IS A THUMB (8/9) I decide and he corrects, and
they are deliberately small because the whole point of a peripheral task is that it
is doable in the first week.

## THE BUG THE GATE CAUGHT, NAMED SO IT DOES NOT COME BACK

**Three spellings of a faction, again.** The world bridge writes the counter under
the real `FactionWorld` id (`Remnants`); the card asks with whatever
`factionForPerson` produced, which is a quest's `@ROLE` token (`REMNANTS`) or the
derived id. A straight lookup returns **0 forever and the ladder never moves.** My
own hand-check passed because I happened to type the spelling my code expected;
**the gate used the realistic one and failed.** Normalised, and this is the third
time this codebase's three faction vocabularies have bitten — it is now normalised
in all three organs.

## THE MACHINE

`gates/belonging_gate.js`, 37 claims: 32 anchors verbatim plus a regenerate-and-
diff; distinctness measured on what the player actually reads; the named-in-canon
bargains driven; the ladder driven through a **real authored quest** and proven to
be a count rather than the standing number; and the **real built run in a real
browser** reading the real card node.

## WHERE HE LOOKS

**LIFE tab → WHAT THEY WANT FROM YOU.** All sixteen, both of his paragraphs on
each card, what they pay in, what they refuse, who moves first, and a button that
walks the ladder from stranger to inside so every card changes under him. Nothing
to tap in the run, nothing to judge.
