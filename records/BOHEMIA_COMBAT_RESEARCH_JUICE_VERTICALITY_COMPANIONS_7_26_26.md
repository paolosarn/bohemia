# BOHEMIA — BIG BRAIN RESEARCH PART TWO: JUICE, VERTICALITY, COMPANIONS, AI

> "I would want to ideally continue on pushing how to make this game feel a lot
> better combat wise. We haven't even introduced companions into this. We haven't
> even introduced combat that could take place across two stories where there's
> stairs and shit, maybe even three stories, an actual arena map or something
> where we test out different AI and the feel of it. Look online and do some big
> brain research. **I want more juice. I want this to be juicy and fun and just
> like wow.**"
> — Paolo, 7/26/26

**NOTHING HERE IS BUILT.** This is part two; part one is
`BOHEMIA_COMBAT_RESEARCH_TURN_BASED_GRID_7_26_26.md`. **The merged pick-list is
at the bottom — one list, not two competing ones.**

Studied: **Vlambeer's "The Art of Screenshake"**, **XCOM 2's map design**,
**Tactical Breach Wizards**, the **utility-AI** literature, the **companion-AI**
post-mortem consensus, and standard **greybox** practice. Sources at the bottom.

---

## 1. JUICE, AND THE ONE RULE THAT MAKES IT WORK IN *THIS* GAME

Vlambeer's talk is the canonical text and it is about thirty small techniques
stacked on one shooter until it feels incredible. The list that matters here:
**hit animations, gun kickback, muzzle flash, bigger bullets, screen shake on
fire, permanence (killed enemies stay on screen), a camera that leads the
action, falling shell casings, smoke, and a "sleep" of about 0.2 seconds
whenever a bullet hits** — which he describes as barely visible and completely
transformative.

The framing that matters more than the list: **juice is added on top of a thing
that already works. It is never load-bearing.** Bohemia's dial already works.
That is exactly the moment to juice it.

**BUT BOHEMIA CANNOT JUST COPY THE LIST, BECAUSE OF THE 120 BPM LAW.** Vlambeer's
0.2s sleep is an arbitrary duration. Drop that into Bohemia and it desyncs the
metronome, the dial and the music ladder in one frame.

### THE RULE: EVERY JUICE DURATION IS A NOTE VALUE

```
1/16 note   0.125s     graze, step, a shell hitting the floor
1/8  note   0.250s     a solid hit, a shove, a body dropping
1/4  note   0.500s     a KILLSHOT: one whole beat, the world stops
1 bar       2.000s     the last man down: the room holds for a bar
```

Now the freeze is not fighting the clock, **it IS the clock.** The world stops
dead on a kill, the music keeps running underneath, and everything drops back in
exactly on the grid. **A killshot becomes a rest in the music.**

No other game can do this, because no other game quantizes everything to a beat.
This is the single most Bohemia-specific idea in either research doc.

### THE JUICE LIST, ORDERED BY WOW-PER-HOUR, ALL QUANTIZED

1. **QUANTIZED HITSTOP** (above). The headline.
2. **PERMANENCE.** Vlambeer rates it as one of the biggest, and it is nearly
   free: shell casings stay on the floor, impact scars stay on the wall they hit,
   blood stays on the tile, spent grenades leave scorch. **By the end of a fight
   the arena should read as a record of what happened in it.** Bohemia already
   keeps bodies (downed men crawl); it throws away everything else.
3. **RECOIL AND KICKBACK.** The shooter's sprite kicks 1 to 2 pixels against the
   shot and snaps back on the next 16th. Costs almost nothing, sells everything.
4. **DIRECTIONAL SCREEN SHAKE**, along the axis of the hit, with an exponential
   decay that finishes **inside** the hitstop window so readability is back
   before the next beat.
5. **MUZZLE FLASH + A DIRECTIONAL IMPACT BURST.** Particles erupt along the
   vector of the shot, not in a symmetrical puff.
6. **A CAMERA THAT LEADS.** On a shot the camera nudges toward the target and
   settles by the next beat. You already have AIM CAM: GLIDE, so the machinery
   exists.
7. **A ONE-FRAME SCREEN FLASH ON A KILLSHOT ONLY.** Reserve it. If everything
   flashes, nothing does.

**COST:** low across the board, and none of it changes a rule. This is the
"just like wow" he asked for.

---

## 2. VERTICALITY: STAIRS ARE GOOD, BUT THE *DROP* IS THE PRIZE

**XCOM 2's lesson is about ACCESS.** Its buildings have very accessible rooftops
with multiple climb points spaced around the edges, and being near a building
virtually always means you are within one dash of its roof. Its predecessor's
failure is the warning: **slopes that looked like cover but were not, creating
trap areas** players learned to distrust. If a floor is hard to reach or lies
about what it does, the verticality is decoration.

**TACTICAL BREACH WIZARDS' LESSON IS THE BETTER ONE, AND IT IS THE ONE FOR
BOHEMIA.** Its signature is not sightlines. It is **punching a man out of a
fourth-story window.** Height is not a stat bonus, it is **a kill you set up.**

### WHAT THAT MEANS HERE

Part one's item 4 recommended making SHOVE a real one-tile PUSH with collision
damage. **On a two- or three-storey map, that same verb becomes defenestration.**
Shove a man off a landing and the floor kills him. One verb, two systems, and it
turns your map into a weapon.

Three things that would make it work:

- **Stairs and landings are CHOKEPOINTS.** One body per cell is already law, so a
  man on a stair is a cork. That is free tactics from a rule you already have.
- **Height beats cover, and exposes you.** Standing high sees over everything and
  is seen by everything.
- **Ledges are marked and honest.** Whatever is lethal is drawn as lethal. XCOM's
  trap-slope problem is a readability failure and it is avoidable by decision.

**AND THE DATA MODEL IS ALREADY THERE.** Your LAYERING law resolves every tile to
ground / structure / overhead / prop / portal, and INTERIOR-MATCHES-EXTERIOR
already says decks and levels are a separate 3D axis with each level exactly the
footprint. **Bohemia's tile spec already speaks multi-storey.** Combat is the
part that does not.

**COST:** high, and it is the biggest of everything in either document. It is
also the one that would change what a fight IS.

---

## 3. COMPANIONS: THE RESEARCH IS UNANIMOUS AND SLIGHTLY SURPRISING

The consensus across post-mortems and player threads is not "make the AI
smarter." It is three things:

1. **CONFIGURABLE BEATS CLEVER.** Dragon Age: Origins is repeatedly named as the
   best companion system ever shipped, and its trick was letting the player
   **pre-program behaviour** so companions acted as a team doing what the player
   wanted. Players forgive a simple ally they can direct; they hate a smart one
   they cannot.
2. **MICROMANAGEMENT IS THE KILLER.** The named failure is late game, where you
   are clicking the same attacks and buffs every turn until it is "dumb and
   repetitive."
3. **THE BOND BEATS THE STATS.** Players forgive flaws in endearing characters
   and abandon powerful but unlikeable ones.

### THE RECOMMENDATION: STANCES, NOT ORDERS

Give an ally a **STANCE**, set once, changed with one tap, never per-turn:

```
HOLD       stay on this cover, shoot what shows
PUSH       advance on the nearest man, take ground
COVER ME   mirror my position, suppress what is shooting at me
GET OUT    break contact, get behind me
```

That is the Dragon Age lesson without the Dragon Age spreadsheet, and it fits a
phone. **And the ally acts ON THE BEAT like everything else** (your v71 ruling),
so a companion is one more body dancing rather than a second turn to sit through.

Bohemia already has the RULED foundation in the backlog: allies spawn, target
correctly, go down, and **never permanently die.** That last part is exactly
right and matches Into the Breach's insight that a unit you can lose without
losing the run frees the player to be bold.

**THE EMOTIONAL HALF IS YOURS.** Who joins, what they say, what they remember.
Mechanism mine, contents yours. I will not invent a single one.

**COST:** medium. The AI already targets; stances are a policy layer on top.

---

## 4. AI: MAKE THEM DIFFERENT, AND MAKE THEM AUDIBLE

The utility-AI literature says the thing that stops enemies feeling homogeneous
is **archetype-specific utility functions, not weight tweaks** — a berserker
whose aggression *rises* as its health drops, a cautious unit whose function
*heavily penalises risk*. Each action scores 0 to 1 through a different lens per
archetype.

The level-design consensus adds the other half: an enemy is only interesting if
you can **read** it. Part one already recommended enemy intent on by default,
which both Into the Breach and Slay the Spire are built on.

### THE BOHEMIA VERSION: EVERY ARCHETYPE HAS A RHYTHMIC SIGNATURE

Four or five named archetypes, each with its own utility lens **and its own
rhythm**:

- one that acts on the downbeat, every bar, relentless
- one that acts on the offbeat, so it always catches you between your moves
- one that acts every other bar but hits twice as hard
- one that only acts when you do

Now **reading an enemy is reading a rhythm.** It is NecroDancer's "every enemy
type has a different movement and attack strategy that you have to figure out",
except in your game the tell is *musical*. Combined with the intent display, you
would both see and hear what is coming.

**COST:** medium. And it is the item that most directly serves the rhythm game
you are actually building.

---

## 5. THE ARENA HE ASKED FOR: THE PROVING GROUND

He asked for "an actual arena map where we test out different AI and the feel of
it," and that is a real, standard, named practice: **greyboxing**. Build the
level as plain blocks first, because a greybox prototype exists to *"give you
insight about your game ideas so that you can make an informed decision before
committing time and energy"*, and it is used specifically **to develop game
feel**. Just about every major studio does it.

### THE RECOMMENDATION: ONE ARENA, BUILT AS AN INSTRUMENT, NOT A LEVEL

A single greybox arena in the combat tab containing one of everything worth
testing:

```
a two-storey block with a staircase and an open ledge   (verticality + the drop)
hard cover (pillars) and soft cover (crates)            (cover that degrades)
one long sightline lane                                 (range and suppression)
one tight interior room                                 (point blank, shove)
one open middle                                         (the kill floor)
```

Plus a dial for **enemy archetype and count**, and a toggle for each juice effect
so any one of them can be A/B'd alone — the same honest-comparison discipline the
PULSE button already gave the music.

**It is not content. It is a measuring instrument**, and it is the thing that
makes everything else in both documents judgeable instead of arguable. It is also
built entirely from blocks, so it costs almost nothing in art.

**COST:** low to medium. **And it unblocks all of the above**, which is why it
ranks where it does.

---

## THE MERGED PICK-LIST (BOTH DOCUMENTS, ONE ORDER)

| # | thing | cost | why it is here |
|---|---|---|---|
| 1 | **THE PROVING GROUND** (arena, greybox) | low-med | makes everything else judgeable; he asked for it by name |
| 2 | **THE JUICE PASS, quantized** (hitstop, permanence, kickback, shake, flash) | low | the "just like wow"; no rules change; only works because of your clock |
| 3 | **ENEMY INTENT ON BY DEFAULT** (part one) | low | what ITB and Slay the Spire are both built on; you already have it, switched off |
| 4 | **SHOVE AS A REAL PUSH** (part one) | med | displacement beats damage; becomes defenestration the moment floors exist |
| 5 | **AI ARCHETYPES WITH RHYTHMIC SIGNATURES** | med | reading an enemy becomes reading a rhythm |
| 6 | **COMPANIONS ON STANCES** | med | the foundation is already RULED; stances dodge the micromanagement trap |
| 7 | **TWO AND THREE STOREY COMBAT** | high | the biggest change; your tile spec already speaks it, combat does not |
| 8 | **THE TURN CLOCK = THE SONG'S FORM** (part one) | high | a rules change, and it would make this game unlike anything else |

**[PENDING Paolo] — pick and I build. My own order would be 1, then 2, then 3.**

---

## APPENDIX: LOGGED, NOT BUILT (his instruction)

> "have the pulse sound effects more combat sounding. Right now it just sounds
> like they're fucking really elementary school hi-hat metronome shit. But
> honestly I don't even want you to continue that, we'll work on some more of
> that later, you can mark it down."

**MARKED. NOT TOUCHED.** The fight pulse currently borrows each song's own kit
voices (`f.kit.k` / `f.kit.h` / `clap`) — chosen at v75 so the floor would sound
like the same record rather than a metronome bolted on. It succeeded at being
part of the record and failed at sounding like a fight.

The fix when he wants it is a **dedicated combat percussion bank**: a floor that
sounds like a room, not a drum machine. Shell casings on concrete, a boot on
gravel, a door slam as the backbeat, a distant generator for the pulse.
**Contents are his** — that bank is a cook and it needs his ear and the REUSE
CHECK against `banks/` before a single new voice is drawn.

---

## SOURCES

- [Jan Willem Nijman (Vlambeer) — "The Art of Screenshake", INDIGO Classes 2013](https://www.youtube.com/watch?v=AJdEqssNZ-U)
- [The Art of Screenshake — technique breakdown](https://ssharancom.wordpress.com/2017/06/28/the-art-of-screenshake-vlambeers-games-2/)
- [The Art of Screenshake — notes](https://victorweidar.wordpress.com/2016/10/06/the-art-of-screenshake/)
- [Game feel on the web: squash, shake, and the art of juice](https://valdemird.com/blog/game-feel-on-the-web/)
- [XCOM 2 Analysis: Map Overview](https://www.vigaroe.com/2021/11/xcom-2-analysis-map-overview.html)
- [XCOM 2: How to climb buildings, ladders and onto roofs](https://twinfinite.net/guides/xcom-2-how-to-climb-up-buildings-ladders-and-onto-roofs/)
- [Tactical Breach Wizards — Steam](https://store.steampowered.com/app/1043810/Tactical_Breach_Wizards/)
- [Tactical Breach Wizards review — Thinky Games](https://thinkygames.com/reviews/tactical-breach-wizards-review/)
- [Designing AI Algorithms For Turn-Based Strategy Games](https://www.gamedeveloper.com/design/designing-ai-algorithms-for-turn-based-strategy-games)
- [Utility-Based AI Systems](https://recited.io/kb/ai-in-game-development/npc-behavior-and-intelligence/utility-based-ai-systems/)
- [Game AI Planning: GOAP, Utility, and Behavior Trees](https://tonogameconsultants.com/game-ai-planning/)
- [Enemy design — The Level Design Book](https://book.leveldesignbook.com/process/combat/enemy)
- [RPGs with good AI companions — discussion](https://rpgcodex.net/forums/threads/rpgs-with-good-ai-companions.129432/)
- [How to Graybox / Blockout a Game Level — Radiator Blog](https://www.blog.radiator.debacle.us/2017/09/how-to-graybox-blockout-3d-video-game.html)
- [Grayboxing — Practical Game Design (O'Reilly)](https://www.oreilly.com/library/view/practical-game-design/9781787121799/7a35ab2c-b96b-447c-9bec-135031af1122.xhtml)
