# BOHEMIA — BIG BRAIN RESEARCH: WHAT MAKES TURN-BASED GRID COMBAT FUN (7/26/26)

> "Can you do big brain research to see how fun we can make that, I don't know,
> whatever games you feel like you wanna study that do this like turn base grid
> base combat and we can try to work with that and stuff, please"
> — Paolo, 7/26/26

Six games studied. **NOTHING HERE IS BUILT.** Every recommendation is ranked, and
the ones that touch canon are marked as his call. Read the seven headers; each is
one idea and what it would cost.

Games: **Into the Breach**, **Slay the Spire**, **XCOM 2**, **Crypt of the
NecroDancer**, **Divinity: Original Sin 2**, plus the game-feel literature on
hitstop and screen shake. Sources at the bottom.

---

## 0. THE ONE THAT MATTERS MOST: A FIGHT SHOULD HAVE A CLOCK

**Into the Breach battles last exactly FIVE TURNS.** After that, every surviving
enemy retreats back underground. The player does not have to kill anything.

That single rule does four things at once:

1. **It stops the fight being "kill everyone."** The objective in ITB is
   protecting buildings; you can win a mission having killed nobody. The player's
   turn is spent "preventing damage, be it by moving units out of harm's way,
   blocking attacks, moving enemies so their attacks miss, or just killing
   enemies" — killing is ONE of four verbs, not the only one.
2. **It makes every turn expensive.** With five turns, turn 3 is objectively
   half the fight. Nothing is filler.
3. **It bounds the design.** ITB's grid is 8x8 and it was cheaper to
   hand-author 100 maps than build a procedural system.
4. **And this is the Bohemia-specific one:** a fight with a fixed turn count is a
   fixed length in BARS.

**THE IDEA I WOULD PUSH HARDEST: LET THE TURNS BE THE SONG'S SECTIONS.**

Your 7/3 form is 16 sections. A five-turn fight could advance the arrangement one
section per turn instead of one per 8 seconds:

```
turn 1  section A      the fight opens
turn 2  section B      the lift, melody enters
turn 3  section C      the strip, kick and bass breathe
turn 4  section B      it drives again
turn 5  section D      the FULL section, everything, the last turn
```

You told me you never hear past the first forty seconds. **This gets you to the
payoff on the last turn of every single fight, and it costs you nothing** — no
persistence across encounters, NEW ENCOUNTER still changes the song, nothing is
locked behind kills. The music stops being a timer running underneath the fight
and becomes the fight's own structure. A slow, careful player and a fast one both
hear the whole arrangement, because the form advances on TURNS, not seconds.

This is the most Bohemia-specific idea in the whole research, because it only
works in a game that already quantizes everything to a beat.

**COST:** real work. A turn counter, a fight-ends-at-N rule, and the arrangement
driven by turn instead of step. Also a genuine design change: fights end whether
or not everyone is dead. **[PENDING Paolo]** — that is a rules decision, yours.

---

## 1. PERFECT INFORMATION IS THE KILLER FEATURE, AND YOU HAVE IT SWITCHED OFF

Into the Breach and Slay the Spire both show you **exactly what every enemy is
about to do, before you move.** ITB's designers describe it as *"a puzzle game
wrapped up in a strategy game"*, and note they were *"requiring players to unlearn
something that's been taught by almost every other strategy game."*

Slay the Spire does the same with intent icons: every enemy telegraphs its next
action and its exact damage. The analysis is blunt about why: *"Revealing what
enemies are about to do unlocks a tremendous amount of tactical and strategic
depth"* and *"makes each turn into its own mini-puzzle."*

**Bohemia already has this and it is a PERK that is OFF by default.** FORESIGHT
shows their next move. Windups always show, but the intent does not.

**RECOMMENDATION: make full enemy intent the DEFAULT, not a perk.** Every enemy
shows what it will do and where. What FORESIGHT then buys is something else
(two turns of intent, or intent through walls). Nothing about the difficulty
drops — ITB is brutally hard WITH perfect information, because the difficulty
moves from "guess right" to "solve it."

**COST:** low. The information already exists in the AI. It is a UI job.
**This is the highest fun-per-hour item in the document.**

---

## 2. THE NECRODANCER WARNING, AND IT IS AIMED AT ME

Crypt of the NecroDancer is the closest game in the world to what you are
building, and its own designer's conclusion cuts against what I have been
shipping you:

> *"a rhythm game that goes to great lengths to require as little rhythm as
> possible"* — after testing, **100 percent leeway felt best**, because *"in
> NecroDancer the challenge comes from the fast tactical combat itself."*

My grading windows are PERFECT at 55ms and GOOD at 110ms. NecroDancer landed on
maximum forgiveness and put the difficulty in the TACTICS.

**RECOMMENDATION: the beat should be where the FUN is, not where the DIFFICULTY
is.** Widen the windows hard. Keep the groove chain as a REWARD for good timing
and never as a punishment for bad timing. The beat is the pleasure; the grid is
the challenge. Right now I have some of that backwards.

The other half of NecroDancer worth stealing: **every enemy movement and every
boss phase is synchronised to the beat**, so the enemies look like they are
dancing with you. You ruled "everything on beat" already (v71) and it landed. The
next step is enemies whose ATTACK PATTERNS are rhythmic figures you learn — this
one comes on 2 and 4, that one on every other bar — so reading an enemy is
reading a rhythm.

**COST:** widening the windows is one number. Rhythmic enemy patterns are real
work but very Bohemia.

---

## 3. XCOM'S LESSON: YOU ALREADY SOLVED THE THING EVERYONE ELSE IS STUCK ON

The single most complained-about thing in tactics games is missing a 95% shot.
XCOM 2's lead designer Jake Solomon on it: *"when players miss an 85 percent
shot, emotionally they're probably strained"*, and Firaxis quietly fudges the
numbers on lower difficulties — *"That 85 percent isn't actually 85 percent."*

They are lying to players to paper over a design they cannot fix.

**Bohemia does not have this problem, because the DEAD EYE DIAL is skill, not
dice.** You do not miss because a number betrayed you; you miss because you hit
the button at the wrong moment. That is the correct answer and it is already
built.

**RECOMMENDATION: protect it.** Never add a hidden hit-percentage roll on top of
the dial. If difficulty needs to rise, make the dial harder to READ (faster,
narrower, syncopated), never make the outcome random after a good press. The
moment a perfect press can miss, you have imported the one thing everybody hates.

**COST:** zero. It is a rule for future sessions, and it should be a law.

---

## 4. THE BEST VERB IN TACTICS IS NOT DAMAGE, IT IS DISPLACEMENT

In Into the Breach, punching knocks an enemy back one tile, and *"enemies pushed
into each other can be damaged"* or pushed off a building they were about to
attack. Players describe the good moments as *"you'll feel like a genius the
first time you move an enemy onto a spawn tile for them to block the next turn
and die in the process."*

The collision damage is small on purpose. **The point is the repositioning, not
the number.** You can even shove your own units, because their HP is renewable.

**Bohemia has SHOVE at point blank already** (always stuns 1, IRON SHOULDER makes
it 2, chance they hit the floor). It is a stun, not a displacement.

**RECOMMENDATION: make SHOVE a real push.** One tile, collision damage if they
hit another body or a pillar, and it works on the drop into cover. Suddenly the
pillars in your arena become weapons, the grid becomes the tactics, and you get
the "I'm a genius" moment that ITB players talk about — from a verb you already
have.

**COST:** medium, and it stacks perfectly with your existing occupancy law (one
body per cell) which is exactly what makes collisions meaningful.

---

## 5. THE ENVIRONMENT IS THE THINNEST PART OF YOUR FIGHT

Divinity: Original Sin 2 is the reference for terrain-as-tactics: *"where you
stand is often as important as the attacks you choose."* Surfaces chain — oil
slows and burns, water conducts, blood freezes, ice trips — and high ground gives
a ranged bonus while low ground takes a penalty.

Bohemia's arena has **pillars and one grenade.** I flagged this at v74 and it is
still true.

**RECOMMENDATION, in the order I would do it and all cheap:**
1. **Elevation.** You already have a ¾ view and a LAYERING law with structure
   tiles. Standing on something = better sightline, worse cover.
2. **Cover that degrades.** Shots eat the pillar. Cover you can destroy makes
   position temporary, which makes it interesting.
3. **Surfaces, but Vegas ones.** Not fantasy elements: broken glass (noise, so
   sneaking breaks), spilled fuel, standing water in a wash, sand that slows.

**COST:** medium to high, and it is the biggest content investment here. But it
is also the difference between a fight in a room and a fight in a PLACE.

---

## 6. MAKING IT PUNCHY, WITHOUT BREAKING YOUR CLOCK

The game-feel literature is specific: **hitstop** (freezing everything for 3 to
12 frames, 0.05 to 0.2s, on a connect) with *"the duration scaled to match the
strength of the attack"*, plus **directional screen shake** along the axis of the
hit with a rapid exponential decay so readability comes straight back.

Bohemia has a problem every other game does not: **freezing the world for an
arbitrary 80ms would break the 120 BPM law.**

**Which is also the opportunity. In a 120 BPM game, hitstop should be a NOTE
VALUE.**

```
graze     1/16 note   0.125s
hit       1/8  note   0.250s
killshot  1/4  note   0.500s   (a whole beat of silence, then the drop back in)
```

Now the impact freeze is not fighting the clock, **it IS the clock** — the world
stops for exactly one sixteenth and comes back on the grid. A kill would take a
whole beat, and the music continuing underneath while the world holds still is
the single punchiest thing you could add to this game. The screen shake decays
inside the freeze so the shot reads and clears before the next beat.

**COST:** low, and it is pure upside. This is my second recommendation after
enemy intent, and unlike everything else here it makes the game feel better
without changing a single rule.

---

## THE RANKING, IF YOU ONLY WANT THREE THINGS

1. **QUANTIZED HITSTOP** (item 6). Cheap, no rules change, makes every shot feel
   twice as heavy, and it is only possible because your game is on a clock.
2. **ENEMY INTENT ON BY DEFAULT** (item 1). Cheap, and it is the mechanic both
   of the best-designed tactics games of the last decade are built on.
3. **THE TURN CLOCK AND THE SONG'S FORM** (item 0). Expensive, a real rules
   change, and it is the one that would make Bohemia's combat *unlike anything
   else* — because the fight and the song would be the same shape.

Items 4 and 5 (push, environment) are the depth work after that. Item 2 (widen
the timing windows) is one number and I would do it the moment you say go. Item 3
(never add a hidden roll on top of the dial) should just become a law.

**[PENDING Paolo] — nothing above is built. Pick and I build it.**

---

## SOURCES

- [Road to the IGF: Subset Games' Into the Breach](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-)
- [Reimagining failure in strategy game design in Into the Breach](https://www.gamedeveloper.com/design/reimagining-failure-in-strategy-game-design-in-i-into-the-breach-i-)
- [Perfect Information: The Killer Feature of Slay the Spire and Into the Breach](https://jeremiahgames.com/2019/03/04/perfect-information-the-killer-feature-of-slay-the-spire-and-into-the-breach/)
- [Into the Breach & Enemy Intentions](https://atomicbobomb.home.blog/2020/05/17/into-the-breach-enemy-intentions/)
- [Into the Breach: Combat guide](https://www.gamepressure.com/into-the-breach/combat/z1aa78)
- [Everything you need to know about Into the Breach](https://www.pcgamer.com/into-the-breach-preview/)
- [Intent — Slay the Spire Wiki](https://slaythespire.wiki.gg/wiki/Intent)
- [Best Design 2019: Slay the Spire](https://www.pcgamer.com/best-design-2019-slay-the-spire/)
- [Jake Solomon explains the careful use of randomness in XCOM 2](https://www.gamedeveloper.com/design/jake-solomon-explains-the-careful-use-of-randomness-in-i-xcom-2-i-)
- [Game Design Deep Dive: Finding the beat in Crypt of the NecroDancer](https://www.gamedeveloper.com/audio/game-design-deep-dive-finding-the-beat-in-i-crypt-of-the-necrodancer-i-)
- [Gameplay — Crypt of the NecroDancer Wiki](https://crypt-of-the-necrodancer.fandom.com/wiki/Gameplay)
- [Environmental Effects — Divinity Original Sin 2 Wiki](https://divinityoriginalsin2.wiki.fextralife.com/Environmental+Effects)
- [I'm playing Divinity: Original Sin 2 at last — its terrain-based tactical battles](https://www.techradar.com/gaming/pc-gaming/im-playing-divinity-original-sin-ii-at-last-i-cant-get-enough-of-its-terrain-based-tactical-battles)
- [Maximizing Game Feel in Action Game Development](https://salivity.github.io/game-development/article/maximizing-game-feel-in-action-game-development)
- [Research on the Mechanism of Screen Shake and Hit Stop Effects on Game Impact](https://www.oreateai.com/blog/research-on-the-mechanism-of-screen-shake-and-hit-stop-effects-on-game-impact/decf24388684845c565d0cc48f09fa24)
