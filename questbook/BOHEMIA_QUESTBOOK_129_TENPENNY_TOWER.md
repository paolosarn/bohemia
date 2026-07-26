# BOHEMIA QUESTBOOK #129 — "TENPENNY TOWER"
**Game:** Fallout 3 (2008)
**Studio:** Bethesda Game Studios
**Quest:** A gated luxury tower won't admit ghouls; the ghouls want in; the "good" resolution — negotiating integration — ends, weeks later, with every human resident murdered offscreen and the negotiator holding good karma for brokering it.
**Type:** INDIVIDUAL-QUEST DEEP DIVE — FORMAT v2. Mined from the whole-game pool.
**Filed:** 7/16/26

---

## 0 CORE IDEA

**The quest builds a diplomacy option, lets you work hardest for it, pays you good karma for achieving it — and then has the oppressed party massacre the bigots you vouched for, and never dockets you a single point.**

Three doors: help Roy Phillips' ghouls tunnel in and slaughter the residents; help Chief Gustavo wipe out the ghouls; or the hard road — argue resident by resident, evict the irreconcilables, and talk Allistair Tenpenny into integration. The third door is the SPEECH-CHECK GAUNTLET, the most effortful path, the one the karma system stamps GOOD.

Weeks later, return: the humans are gone. Roy, now a resident in good standing, is breezily unbothered. Bodies in the basement. The karma meter says nothing. The quest is COMPLETE.

**Two readings, both live for seventeen years:** (1) masterpiece — the game teaching that grievance doesn't evaporate on move-in day, that integration brokered over the heads of the wronged is a lobby renovation, not justice; (2) botch — a bugged-feeling gut-punch that punishes the player for choosing effortful decency, with cut content suggesting a stabler outcome was planned. **The corpus banks BOTH, because the design lesson lives in the gap: if your subversion is indistinguishable from your bug, you have not finished the subversion.**

The life lesson underneath: **you cannot negotiate other people's forgiveness.**

---

## 1 CAST + WHAT EACH ONE WANTS

**ROY PHILLIPS** — wants IN, and underneath it, wants the people who spat on him to know how it feels. Will trade: caps for the tunnel route; gratitude for the diplomatic one — briefly. Will never say (until after): that admission was never going to be enough. FUNCTION: the wronged party with a second agenda the quest hides in plain sight — every line of his seethes if you listen.
**ALLISTAIR TENPENNY** — wants his view, his tower, his quiet; genuinely does not care much either way, which is its own indictment. Will trade: policy for peace. FUNCTION: power as indifference — the bigotry is the residents'; he just owns the building.
**CHIEF GUSTAVO** — wants the ghoul problem gone; pays for extermination. FUNCTION: door one, priced.
**THE RESIDENTS (the Wellingtons, Susan Lancaster, et al.)** — want the property values of the soul: comfort uncontaminated by reminder. Each has a persuasion node; some move, some must be REMOVED for the deal to close (evictions the player engineers — including via exposing an affair). FUNCTION: the gauntlet — bigotry itemized into individually arguable people.
**BESSIE LYNN & THE QUIET GHOULS** — want a home; follow Roy. FUNCTION: the mass in whose name the massacre happens, who were not consulted either.

## 2 FULL EVENT FLOW (STAGE BY STAGE)

STAGE 0 — THE INTERCOM: a ghoul argues with a gate speaker; entry is a bouncer conversation. The theme arrives before the quest does.
STAGE 1 — THE THREE CONTRACTS: Gustavo offers extermination pay; Roy offers tunnel pay; the tower's own social web offers the third road to anyone stubborn enough to canvass.
STAGE 2 — THE GAUNTLET [the effortful door]: resident-by-resident persuasion; the movable moved, the immovable evicted by leverage (the affair exposure — decency's path routes through blackmail, unremarked). Tenpenny signs off with a shrug.
STAGE 3 — MOVE-IN DAY: ghouls in the lobby; handshakes; good karma; quest complete. The game lets it sit long enough to be believed.
STAGE 4 — THE RETURN [timed, weeks later]: humans absent; basement full; Roy content; the exterior unchanged. No quest marker announces it. You find it the Deus Ex way (Q116): by walking past what your choice did.
STAGE 5 — THE NON-RECKONING: no karma event, no confrontation node with teeth, no restitution path. Roy can be killed NOW — for no quest, no restoration, nothing but the player's own ledger.

## 3 THE CONVERSATIONS (THE ACTUAL MACHINE)

NODE: ROY_GATE — the intercom, entry: approach
  > "What do you want in there anyway?"       [gate: none] -> R_WANT — "same as anyone": the reasonable sentence, delivered in a tone the quest DARES you to hear
  > "They'll never let you in."               [gate: none] -> R_THEN — the tunnel offer surfaces: "there's another way in"
  > (listen to the whole rant)                 [gate: none] SILENCE -> the tells are ALL HERE on day one — the revenge is pre-announced to anyone who lets him finish. THE FINDING: the massacre is FORESHADOWED IN THE OPEN and seventeen years of players missed it because the karma system's GOOD stamp on door three overrode their own reading. THE METER OUTSHOUTED THE TEXT.

NODE: THE_GAUNTLET — per resident, entry: door three chosen
  > [Speech] "He's a person, same as you."     [gate: stat-in-source; .bq-converts to knows:their_lever] -> some yield
  > (expose Susan's affair)                     [gate: knows:affair] TRAP-THAT-IS-THE-GOOD-PATH -> eviction; the diplomacy road is paved with a blackmail brick and the karma system does not notice. Bank: THE GOOD DOOR'S DIRTY HINGE — audit every "pure" path for the coercion it quietly includes.
  NOVERB: "Roy, will admission be ENOUGH?" — THE ONLY QUESTION THAT MATTERS HAS NO NODE. You can negotiate the tower and never once ask the wronged party what settlement actually settles. The absence IS the quest's argument: the broker never asked. Cross-ref Q121 (the heretics never consulted): 2nd confirmation of the ABSENT-PARTY DECISION — promote to law at compile: THE SETTLEMENT NOBODY ASKED THE WRONGED ABOUT WILL NOT HOLD.

NODE: ROY_AFTER — the lobby, weeks later, entry: the return
  > "What did you do?"            [gate: none] -> R_BREEZY — no denial, no gloat; mild. The register does the horror.
  > "I vouched for you."          [gate: none] -> R_SO — your ledger is not his problem; he never signed YOUR moral paperwork
  > (draw)                        [gate: none] -> the kill with no quest attached: justice as a purely private line-item, unscored either way.
  NOVERB: (turn him in / restore anything) — NO RESTITUTION LAYER EXISTS. The world has no court for it, and the game's refusal to invent one is either its bravest beat or its laziest, and it will not tell you which.

## 4 THE BRANCH MAP

COUNT: 3 doors, 1 convergence.
B1 — EXTERMINATE (Gustavo's contract): ghouls dead, tower unchanged, bad karma, DONE and stable.
B2 — THE TUNNEL (Roy's contract): residents slaughtered on-screen with your key in the door; bad karma; stable.
B3 — DIPLOMACY: good karma, integration, THEN the delayed massacre — converging on B2's body count with a delay, a basement, and your signature on the guest list. THE MAP'S FINDING: the effortful door and the evil door arrive at the same room; only the paperwork and the delay differ (cf. Q126 B2/B3's same-heist-different-paper — here weaponized as indictment).
B-x — kill Roy at any stage: available always, quest-relevant only before; after, it is grief with a trigger.

## 5 HONEST FLAWS (BANKED)

F1 — THE SUBVERSION IS INDISTINGUISHABLE FROM A BUG. Seventeen years of "is this intended?" threads; cut content suggests a stable-integration variant existed. LAW: a gut-punch must carry authorial fingerprints (one line, one note, one witness) or it reads as QA failure.
F2 — THE KARMA SYSTEM SLEEPS THROUGH THE ENDING. Good karma for the setup, zero movement on the massacre: the meter grades intentions and ignores outcomes, confessing its own uselessness. The no-karma tripod (Q121/Q125/Q105) gains a fourth leg: THE METER THAT MISSES THE POINT ENTIRELY.
F3 — THE GOOD PATH REQUIRES BLACKMAIL AND NOBODY NOTICES. The affair-exposure eviction sits inside the diplomacy route unexamined.
F4 — ROY'S GHOULS GET NO VOTE. Bessie and the quiet ones are furniture to BOTH resolutions in their name — wronged-party interiority budget: one character, and he's the killer.
F5 — THE TIMER IS OPAQUE. The massacre fires on a hidden clock; players who never return never learn; the quest's entire point is missable by contentment. THEME-IN-RETURNING.
F6 — NO RESIDENT IS PERSUADABLE ABOUT THE RIGHT THING. Every yielding resident yields to leverage or fatigue, never to argument that lands; the gauntlet proves speech checks move people without CHANGING them — which is the point, and is also never surfaced.
F7 — TENPENNY HIMSELF ESCAPES THE THEME. The owner's indifference is never priced by any branch; the building's god outlives every configuration of its tenants (absent an unrelated sniper option elsewhere).
F8 — THE EVICTED VANISH. Residents pushed out for the deal exit the simulation; the diplomacy route's own displaced have no downstream existence.
F9 — MORAL AFTERSHOCK HAS NO MECHANICAL HOME. The player's only processing tools are a gun and a fast-travel map; companions don't comment; the world doesn't reference it. The loudest silence in the game.
F10 — BOTH READINGS REQUIRE THE OTHER'S EVIDENCE. Masterpiece-read leans on Roy's foreshadowing; botch-read leans on the cut content; neither closes. Bank the undecidability itself as the design datum.

## 6 WHY IT WORKS (W1–W10)

W1. **THE EFFORTFUL DOOR IS THE TRAP.** The quest prices diplomacy highest — most nodes, most legwork, most patience — and detonates it. Effort is not virtue; the corpus's harshest single lesson about player self-congratulation.
W2. **THE MASSACRE IS PRE-ANNOUNCED AND UNHEARD.** Roy tells you, at the gate, on day one, in tone if not in terms. The foreshadowing is drowned out by a UI element (the karma stamp). A meter can make players deaf.
W3. **CONVERGENT BODY COUNTS, DIVERGENT SIGNATURES.** Doors two and three end in the same basement; the only variable is whose name is on the guest ledger and how long the lobby smelled like peace.
W4. **THE WRONGED PARTY DECLINES YOUR ARC.** Roy will not be the grateful beneficiary of your speech build. He had his own quest running the whole time, and yours was a component in it.
W5. **THE RETURN IS UNMARKED.** No objective sends you back; the truth is compensation-free archaeology (Q116's law, executed at settlement scale).
W6. **THE REGISTER OF THE AFTERMATH IS MILD.** Roy's breeziness outperforms any snarl; atrocity discussed in the tone of a satisfied tenant is the file's coldest instrument.
W7. **JUSTICE IS LEFT ENTIRELY PRIVATE.** Kill Roy after and no system blesses or bills it — the one moment the karma engine's silence works FOR the scene: the player's response has no exchange rate.
W8. **BIGOTRY IS ITEMIZED.** The gauntlet decomposes "the tower won't allow it" into fourteen individually arguable humans — prejudice rendered as a canvassing problem, door by door.
W9. **POWER IS INDIFFERENT, NOT HATEFUL.** Tenpenny's shrug — sure, let them in, whatever — is the quest's sharpest political note: the owner never needed the bigotry; he just never needed to oppose it either.
W10. **THE QUEST COMPLETES BEFORE IT ENDS.** "Quest Complete" fires at the handshake; the actual ending arrives weeks later, uncredited. The gap between the game's bookkeeping and the story's truth IS the design (and F1's razor: one fingerprint would have made it undeniable).

## 7 BOHEMIA PORTS

### PORT 1 — THE SETTLEMENT NOBODY ASKED THE WRONGED ABOUT [core, NOVERB law]
**System:** the 13 factions / tribunal / conscience
One Bohemia integration quest per arc where the dynast can broker peace between a wronging faction and a wronged one — and the .bq DELIBERATELY OMITS the "will this be enough for you?" node unless the player has done the listening work ([gate: knows:their_grief] unlocks the one question that changes the outcome). Ask it and the settlement can hold; broker without it and the Tenpenny clock starts. The difference between the two runs is ONE conversation the format hides from the impatient.
### PORT 2 — THE DELAYED DETONATION WITH FINGERPRINTS [F1 fixed]
Bohemia keeps the weeks-later massacre mechanic and fixes F1: the Fold receives ONE dated entry the day it happens ("basement. eleven. R. said it was owed."). Authorial fingerprint, diegetic, missable but findable — the subversion becomes provable without becoming announced.
### PORT 3 — THE METER THAT MISSES THE POINT [F2]
No meter in Bohemia, so the port is a WRITING law: no system stamp (reward, faction number, title) may fire at a settlement's HANDSHAKE — all pricing waits for the hold/collapse check one act later. Payment on OUTCOME, never on ceremony.
### PORT 4 — THE GOOD DOOR'S DIRTY HINGE [F3]
Every "clean" Bohemia resolution gets one audited coercion in its path, VISIBLE — the Fold logs the blackmail brick in the diplomacy road. The player who takes the high road learns what it was paved with.
### PORT 5 — THE QUIET ONES GET ONE SCENE [F4 fixed]
Bessie's fix: the wronged faction's non-violent majority receives exactly one node — after the detonation, one of them asks the dynast: "did you think he spoke for us?" The absent party, present once, exactly too late.

## SOURCES
- Fallout Wiki (Fandom): Tenpenny Tower quest — all three resolutions, the resident persuasion table, the affair eviction, the delayed massacre trigger, Roy's post-quest state. `https://fallout.fandom.com/wiki/Tenpenny_Tower_(quest)`
- Seventeen years of community adjudication (r/Fallout, RPGCodex, retrospectives): the masterpiece-vs-bug split (F1/F10), the karma silence (F2), cut-content citations on a stable variant. FUTURE DEEPER PULL: the strongest essay treatments — this quest has several; pull the two best-argued opposing reads and bank them verbatim-adjacent.
- FUTURE DEEPER PULLS: (1) the resident persuasion table in full — fourteen bigots itemized is PORT 1's cast spec. (2) The cut-content record for the stable-integration variant (F1's evidence). (3) Herbert Dashwood's Argyle backstory as the quest's ghoul-human counter-text elsewhere in the same game.

---
*END #129*
