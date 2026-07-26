# BOHEMIA — ADDENDUM: TWELVE MORE PLAYABLE CANON QUESTS (S10-S21)
### 7.26.26 — QUESTS lane, autonomy doctrine GO. Backlog QUESTS #1 executed: "10+ new playable .bq quests in the locked canon style." Twelve shipped. Corpus: 9 -> 21 playable.

---

## WHAT SHIPPED
Twelve new `quests/bq/*.bq` files, every one parsed, validated at the canon bar
(zero errors AND zero warnings), exhaustively path-explored, and played to a real
COMPLETE ending on the actual judge surface in a real browser. They are live in
the phone (the slice embeds the same bytes the gate proves) and reachable for
judging from inside the alpha: LIFE tab -> THE 12 NEW CANON QUESTS.

| # | Quest | Shape | Wires | The real thing under it |
|---|-------|-------|-------|--------------------------|
| S10 | THE COUNT THAT DOES NOT ADD | the census | NETWORK / VOLUNTEERS | every aid system allocates by headcount, and every headcount is also a list |
| S11 | SIXTY SECONDS OF RAIN | the clock | BLUES / HOMELESS | the wash floods from rain twenty miles off that you never see fall |
| S12 | THE LAST GOOD DOCTOR | triage | VOLUNTEERS / CARTEL | a split course of antibiotics cures nobody and breeds a bug that laughs at the next one |
| S13 | THE PAPER THAT SAYS SO | the property claim | REDS / TRADES | title versus possession, in a valley with no court to ask |
| S14 | WHAT THE DOG KNOWS | grief, nothing to win | REMNANTS / HOMELESS | working dogs guard a body because they do not understand death |
| S15 | THE LIGHTS GO OUT AT NINE | leverage | MOB / TRADES | a strike is paid for first by the people striking |
| S16 | THE VOICE AT THREE | the signal | ANARCHISTS / NETWORK | two bearings cross on one roof; short and mobile is the only defense there has ever been |
| S17 | THE SEED THAT DOES NOT COME BACK | this winter vs every winter | BLUES / CARAVANS | hybrid seed does not breed true, and pollen does not respect a fence |
| S18 | THE PATCH UNDER THE COLLAR | the crew problem | TRADES / VOLUNTEERS | the identity groups are social forces INSIDE factions, so they arrive as a person already on your crew |
| S19 | THE MIDWIFE'S HOUR | two kinds of care, one room | CHURCH / VOLUNTEERS | clean hands and boiled water are the medicine; light is the comfort; one hour of fuel does one |
| S20 | THE NAME ON THE COUNTERFEIT | trust | REDS / CARTEL | a currency dying takes everything from whoever was too poor to hold anything but money |
| S21 | THE ONE WHO CAME BACK | the rumor | REMNANTS / CARAVANS | in an information blackout, hope is the commodity, and it is paid for by whoever acts first |

## THE CRAFT RULES HELD (all of them, machine-checked where a machine can check)
- **CLOUT is emergent, never a label.** Same quest, different loudness of DEED,
  different tag. Every file forks across at least two of #quiet/#notable/#risky/#reckless.
- **No stat/karma gates.** Branches gate only on what the player DID (knows/flag/role).
- **No proper names.** Every character is a `@ROLE` cast at runtime; the casting
  bridge lands each quest on ground its faction really holds.
- **The theme is in the first exchange**, never in an optional node (the ~18x flaw).
- **A TRAP option in every quest**: the reasonable-sounding question that costs.
  S12's is the humane-sounding split; S11's is asking her to be certain; S20's is
  what happens when people stop taking the token.
- **Silence is the premium option** (opening-craft law 12), present in all twelve.
- **Systems ARE the mechanic**: the food allocation, the one hour of fuel, the one
  course, the deed, the marquee, the seed sacks, the tokens. Faction standing and
  posture really move; three quests (S15, S18, S20) mark themselves
  `@DO advance_territory` because they are real story beats, per the PACING LAW.
- **Two quests deliberately refuse to answer.** S21 never resolves whether the man
  is telling the truth about the outside world, because what is out there is
  Paolo's canon to set, not a side quest's (MECHANISM-MINE / CONTENTS-PAOLO'S).
  S18 never argues the creed, because the crew would not argue it either.
- **S14 carries no loot at all**, by design (named-body spirit): nothing in that
  stairwell is a reward.

## THE MACHINE (FACTORY LAW — the gate got HARDER, not wider)
`gates/bohemia_canon_quests_gate.js` keeps its original five proofs and adds five,
all of which the original nine ALSO pass, so nothing was grandfathered:
6. **NO PHANTOM ENDING** — every declared terminal stage must actually be REACHED
   by the explorer. (This caught three real defects in this batch during authoring:
   endings that existed on paper with no option wired to them. Declaring endings
   nobody can play is the cheapest way to fake a branch count.)
7. **THE FORK IS LOUDNESS** — at least two distinct CLOUT tags per quest.
8. **SILENCE IS ALWAYS AN OPTION** — at least one SILENCE option per quest.
9. **NO DEAD OBJECTIVE** — every `@OBJ` is actually raised by a `show_objective`.
10. **UNIQUE QUEST ID** across the corpus (a collision silently shadows a quest in
    `ctx.quests`).

**426 passed / 0 failed across 21 quest files. Full suite: ALL GATES GREEN (102s).**

## VERIFIED ON THE REAL SURFACE (not self-attestation)
A headless browser opened the real judge page, clicked PLAY IT on all twelve cards,
walked each one through the real `bohemia_bq.js` + `bohemia_quest_runtime.js`, and
every one reached a real ending with a real clout tag. Zero page errors. The live
phone slice boots with 21 quests embedded and zero page errors.

## TOOLING CHANGE (UNJUDGED-IS-DEAD, applied)
`tools/bohemia_quest_judge.py` is now BATCHED: it builds exactly one sitting's page
(`first` = S01-S09, the 7/25 record, byte-unchanged; `fresh` = S10-S21, the new
sitting). A judge page only ever carries candidates Paolo has never seen, and the
LIFE hub points at the fresh one.

## PENDING, PAOLO'S CALL (not decided, not invented)
- WHERE each quest sits in the world beyond the mechanical faction cast (MAP LAW).
- Whether any of these graduate into the numbered `.md` quest bible.
- Tuning: faction/bond magnitudes are placeholder sizes; the ORDERING is the design.
- Whether the flags these plant (`looked_under_the_rock`-class: `opened_the_deep`,
  `aired_the_method`, `killed_the_token`, `walked_them_out`) should trigger later
  world beats. Canon supports it; nothing was built on it.

---
*BOHEMIA — Twelve More Playable Canon Quests — 7.26.26*
*Nine could be played. Twenty-one can be played.*
