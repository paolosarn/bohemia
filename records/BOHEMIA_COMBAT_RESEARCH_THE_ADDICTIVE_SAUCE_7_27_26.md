# BOHEMIA — COMBAT RESEARCH: THE ADDICTIVE SAUCE (7/27/26)

> Paolo: "Do some big brain research to find what sort of interesting awesome
> addictive juicy sauce you can add to our combat."

Everything here is sourced, and every item is scored on ONE question: **does
Bohemia already have the parts?** Because the best sauce is the one that uses the
casino, the 120 BPM grid and the wager you already built, not a bolt-on from
another game.

---

> **STATUS 7/27/26: ITEM 1 IS DEAD, KILLED AT THE PITCH, NEVER BUILT.** Section 0
> and item 1 below argued for it and were wrong in the one way that matters: a
> tally is not a mechanic. Both are kept unedited because the post-mortem is worth
> more than a tidy document. Items 2-6 were never judged and still stand.

## 0. THE HEADLINE ~~(the argument that got killed)~~

**BOHEMIA IS A CASINO GAME THAT DOES NOT YET PAY OUT LIKE ONE.**

Balatro is the most-studied addiction engine of the last two years, and its
mechanism is not the poker. It is **the tally**: after you commit, the score
*assembles itself in front of you*, one element at a time, with the pitch and the
speed climbing as it goes.

> "you watch as each individual card is tallied: base chips are added with a
> satisfying click, followed by an ascending ring for the multipliers, each
> consecutive effect added by a Joker slightly increasing the pitch and speed of
> the process as it builds into a breakneck, euphoric crescendo."
> — [Goomba Stomp](https://goombastomp.com/how-balatro-became-one-of-the-most-addictive-roguelikes/)

Its visual language is documented as three states: **calm baseline while you
decide → escalating flash and movement while the chain resolves → a distinct
high-impact moment when it spikes**. Players "do not just see numbers increase;
they feel momentum building."
([halabaojia](https://halabaojia.com/collection/20260212-balatro-visual-design-analysis/))

**Bohemia already owns every part of this and spends none of it:**

| Bohemia has | Balatro uses it as |
|---|---|
| the CASINO RECEIPT | the tally sheet — but it arrives AFTER the fight, all at once, silent |
| the WAGER (locked before the fight) | the blind you have to beat |
| GOLD CHIPS as flying currency | the chips that click in one at a time |
| KILL STREAK / GROOVE / on-beat chain | the Joker chain that multiplies |
| GRADE THE PRESS (PERFECT / GOOD / ±ms) | the per-element bonus |
| **120 BPM, everything quantized** | *the thing Balatro has to fake with a rising pitch ramp* |

That last row is the whole opportunity. **Balatro invents a rhythm to make its
tally feel good. Bohemia already IS one.** A payout that lands each element on a
sixteenth, pitch climbing the faction's own scale, is a DRUM FILL — and it is the
one moment in the fight where the music and the score are literally the same
object.

---

## 1. RANKED PICK-LIST (Paolo picks; nothing is built)

### 1. ~~THE PAYOUT IS A DRUM FILL~~ — **KILLED 7/27/26, UNBUILT**
> Paolo: "this was terrible i hated this this was not a gameplay mechanic this is
> more data to be proud of no one gives a fuck."
>
> He is right and it is the whole failure: **a tally changes no decision the
> player makes.** It happens after the outcome is already fixed. I ranked six
> items by how impressive the research was instead of by whether they change what
> the player DOES, and put the only pure-presentation item first.
>
> **LANE RULE THIS LEAVES: if it does not change a decision the player makes, it
> is not a mechanic.** Anything after the outcome is locked — tally, grade,
> summary, stat, badge, receipt — is FEEDBACK, and never leads a pick-list.
>
> GRAVEYARD FINAL. Post-mortem: `records/BOHEMIA_TALLY_KILL_7_27_26.txt`.
> The five items below were never judged and still stand.

<details><summary>the dead pitch, kept for the record</summary>

The receipt stops being a silent sheet that appears when the shooting stops. When
the fight ends, the tally ASSEMBLES on the beat: kills click in on the sixteenths,
the accuracy bonus lands on the next beat, the wager pays on the downbeat, each
element a semitone higher in the faction's own scale, accelerating into the grade.
Uses: the receipt, the chips, the wager, the ledger, the faction scale. Adds: a
sequencer for the tally.
*Source: Balatro's tally cascade; the 120 BPM LAW makes it native.*
</details>

### 2. THE BANK ★ the risk mechanic he already half-built
Push-your-luck is documented as working because it "hands players a question with
no safe answer and makes them own it," and it needs one thing to function:
**a visible pot you can lose.** GREED already charges. The chain already
compounds. What is missing is the **BANK** — the moment where you can take the
payout or push for one more kill at a worse window.
> "each step raises a multiplier, and each step also raises the chance the whole
> run ends with nothing"
> — [I Slay The Dragon](https://islaythedragon.com/guides/a-guide-to-pressing-your-luck/)
In Bohemia the natural stake is the one he already invented: **the wager**.
*[PENDING Paolo] what a bust costs. Contents are his.*

### 3. ENEMY INTENT ON BY DEFAULT ★ cheapest, biggest fairness win
Slay the Spire's intent system is credited as the thing that made its mistakes
*learnable*; Into the Breach went further and made every enemy attack telegraphed
so that "every death felt like your own fault." Both teams say the same thing: it
is not a hint system, it is what converts a loss into a lesson.
> "We're requiring players to unlearn something taught by almost every other
> strategy game." — Justin Ma
> ([Game Developer](https://www.gamedeveloper.com/design/reimagining-failure-in-strategy-game-design-in-i-into-the-breach-i-))
Bohemia already computes who is about to fire (`firing()`, the red gun-up tint).
It is a READ, not a mechanic. Turning it on by default costs nothing.

### 4. THE BEAT COUNTER, ONE TAP ★ answers "why does the timing feel arbitrary"
Hi-Fi Rush's accessibility answer is documented and simple: for players who cannot
feel the beat, ONE button press adds a plain rhythm-game beat counter at the
bottom of the screen, and the whole world already pulses on the beat as a backup
read.
> "elevators jerk up and down on the beat, computer lights blink with each snare
> hit... one button press presents a traditional rhythm game style beat counter"
> — [Access-Ability](https://access-ability.uk/2023/02/09/hi-fi-rush-and-audio-visual-rhythm-game-feedback/)
Bohemia has the floor pulse and the approach ring (both dialled down to near
nothing at Paolo's own instruction). The missing piece is the **explicit optional
counter**, so nobody has to guess whether the game is broken or they are early.

### 5. THE FIGHT REMEMBERS ★ permanence, extended
Brass now stays for the encounter (v86). The next rung: the **district** remembers.
Blood, brass and holes persist on the tile after the fight ends, so walking back
through a block you cleared is walking through your own history. Vlambeer rates
permanence top-tier juice; here it is also LORE, because Bohemia's whole premise
is a city carrying what happened to it.
*Uses the existing bloodSpots / litter / coverHoles world-state, which already
survives worldShift.*

### 6. THE KILL CAM EARNS ITS LENGTH
Firaxis moved the camera off isometric for Midnight Suns specifically to make
tactics read as spectacle rather than abstraction
([GamesHub](https://www.gameshub.com/news/features/marvels-midnight-suns-interview-with-jake-solomon-garth-deangelis-firaxis-games-34922/)).
Bohemia's killshot already has six styles. What it does not have is a reason for
the LONG ones: today the shuffle rolls a 2-second cinematic on a nobody. Tie the
length to the STAKE — the last man, a wager-saving kill, a 4-chain — and the long
cut becomes an earned reward instead of a tax on the pace.

---

## 2. THE THING THE RESEARCH SAYS NOT TO DO

Every source converges on the same warning, and Bohemia is currently on the wrong
side of it: **layered rewards must not compete for the same second.**

> "Cutting unnecessary downtime and ensuring every second in the loop feels
> valuable" — [Algoryte](https://www.algoryte.com/blogs/action-%E2%86%92-feedback-%E2%86%92-reward-%E2%86%92-motivation-%E2%86%92-repeat-the-compulsive-game-loop-that-hooks-you/)

Paolo said the same thing in his own words on 7/26: *"by the end of my combat
encounters it was like a lot of volume fighting each other."* He was talking about
audio and I fixed it with a master trim. The research says the identical failure
exists VISUALLY, and this session proved it: at a 3-kill streak the game was
painting a full-screen orange wash, a floor pulse, a white punch, a blood burst
and a gold chip on top of each other, several of them welded on by the hit-stop.

**RULE THIS SUGGESTS (not law until Paolo says so): one flourish owns each beat.**
A payout that lands on the sixteenths is only legible if nothing else is fighting
it. The tally in item 1 is worth more than the next five effects combined, and
only if the screen is quiet enough to hear it.

---

## 3. WHAT IS ALREADY DONE, SO NOBODY REBUILDS IT

From the earlier docs plus this session: hitstop as a note value, directional
shake, the flash and punch quantized, recoil on the sixteenth, brass permanence,
the directional impact burst, and every duration in one checked table.
Prior research: `BOHEMIA_COMBAT_RESEARCH_TURN_BASED_GRID_7_26_26.md` and
`BOHEMIA_COMBAT_RESEARCH_JUICE_VERTICALITY_COMPANIONS_7_26_26.md` (greyboxing,
NecroDancer's timing leeway, Divinity terrain, Dragon Age companion stances,
two/three-storey combat).

**NOT researched here on purpose: animation.** Paolo, 7/27: *"right now in my
other chats, I'm in the middle of revamping the animations so don't worry too much
about it."* ONE SYSTEM, ONE SESSION. This lane does not touch a clip.

---

## SOURCES

- [How Balatro Became One of the Most Addictive Roguelikes — Goomba Stomp](https://goombastomp.com/how-balatro-became-one-of-the-most-addictive-roguelikes/)
- [Balatro Art Direction Breakdown](https://halabaojia.com/collection/20260212-balatro-visual-design-analysis/)
- [Balatro Hones the Art of Making Numbers Go Up — AV Club](https://www.avclub.com/balatro-hones-the-art-of-making-numbers-go-up)
- [Reimagining failure in strategy game design in Into the Breach — Game Developer](https://www.gamedeveloper.com/design/reimagining-failure-in-strategy-game-design-in-i-into-the-breach-i-)
- [Road to the IGF: Subset Games' Into the Breach — Game Developer](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-)
- [Why Slay the Spire Still Rules the Roguelike Deckbuilder Genre — VideoGamer](https://www.videogamer.com/features/why-slay-the-spire-still-rules-the-roguelike-deckbuilder-genre/)
- [Hi-Fi Rush and Audio Visual Rhythm Game Feedback — Access-Ability](https://access-ability.uk/2023/02/09/hi-fi-rush-and-audio-visual-rhythm-game-feedback/)
- [A Guide to Pressing Your Luck — I Slay The Dragon](https://islaythedragon.com/guides/a-guide-to-pressing-your-luck/)
- [Why Push-Your-Luck Mechanics Work So Well — Co-op Board Games](https://coopboardgames.com/blog/why-push-your-luck-mechanics-work-so-well-in-co-op-board-games/)
- [Marvel's Midnight Suns: Firaxis talks ditching XCOM — GamesHub](https://www.gameshub.com/news/features/marvels-midnight-suns-interview-with-jake-solomon-garth-deangelis-firaxis-games-34922/)
- [The Compulsive Game Loop That Hooks You — Algoryte](https://www.algoryte.com/blogs/action-%E2%86%92-feedback-%E2%86%92-reward-%E2%86%92-motivation-%E2%86%92-repeat-the-compulsive-game-loop-that-hooks-you/)
