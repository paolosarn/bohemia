# `[bb fight]` ROUND 1 — WHAT BATTLE BROTHERS HAS THAT ROGUE FABLE 4 LACKS, AND THE MOUND

**Paolo 9/24, an executive decision (rule 33):** the overworld is Battle Brothers; **the
fight is Rogue Fable 4 FIRST and Battle Brothers second**, on house tiles, and *"ONE
terrain effect in the whole fight, a small mound = accuracy bonus, **nothing else on a
tile changes a number**."* Rule 33(f): every chat carries a `[bb ...]` line, school first.
Rule 33(g): *"Battle Brothers is just a bunch of pictures… we can do more and put more
life into it"* — so every `[bb ...]` page ends with **what moves that BB's picture does
not.**

---

## PART 1 — THE MOUND, MEASURED, AND IT HAS NEVER FIRED

The row's build half is *"the only terrain effect in the fight is high ground = accuracy;
remove any other tile effect that exists, gate refuses a new one."*

**First: is there a second one to remove?** The dial's difficulty is built on one line, and
its inputs are: how far he is, whether he is elite, whether he is behind stone, how you are
peeking, how many shots you have taken, how many guns are up, and **whether you are above
him**. That is the whole list. **Exactly one of them is about the ground, and it is the
high ground.** There is no terrain table to delete: this game never grew BB's hills,
forest and swamp in the first place.

**Then: does the one he kept actually happen?** Measured over 120 and again over 160
seeded street fights, on the shipped house board where a tile is a house (12 m):

```
  the raised slab exists in           71 - 74 % of fights
  it is                               9.1 - 9.3 tiles across   =  about 111 metres
  its nearest edge is                 5.4 tiles away           =  about 65 metres
  the nearest way up is               6.3 - 6.5 tiles          =  about 77 metres
  the player starts on it             0 times out of 160
  it changed                          0 of 688 shots at the bell
```

**The one terrain rule in the game has never once fired.** Paolo ruled it on 8/2 (*"if
you're on a second story and you got cover… it should be easier to hit them because you
have that height vantage point"*), it was built correctly, and it is unreachable: you start
on the ground, the stairs are six houses away, and it only pays against a man in cover
below you.

**And it is not a mound.** It is a raised slab about nine houses across — a city block with
a staircase, drawn as a stack of containers. He asked for *a small mound*.

## PART 2 — WHAT BB'S FIGHT HAS THAT RF4 DOES NOT

Read against what this repo already ships, not against a wiki.

| BB has | we have | survives at RF4 speed on the beat? |
|---|---|---|
| **Fatigue as the whole economy** — every swing, step and shield-raise spends it, a little comes back each turn | **stamina pips**, already spent by sprinting, the stairs and the dash | **Already ours.** BB's fatigue IS the pip, smaller. Nothing to add. |
| **Zone of control** — step away from a man next to you and he gets a free swing | nothing: you can walk out of contact for free | **Yes, and it is the cheapest thing on this page.** Rule 23 wants *"stepping in and out of reach is the dance"*; a disengage that costs something is what makes reach a decision instead of a number. One rule, no new screen. |
| **Injuries** — a wound outlives the battle and changes the man for good | nothing; armour is a field on every body and all zero | **Half.** BB shows them on a post-battle screen, which is a menu; at our speed it is one line on a body you already know, and it belongs with `[armour morale]`, not here. |
| **Two armour pools that grind down** — head and body, ablative | the plate, one layer, and it costs tape | **Ours already, smaller.** Adding a second pool is a second number on every hit; the dial owns numbers. Not at this speed. |
| **The line** — a wall of men, flanking, reach weapons striking from the rank behind | one companion who takes her own turn | **No, and it is the honest no.** A line needs a squad; we have you and her. It arrives with the company or not at all. |
| **Named brothers with backgrounds you lose forever** | the companion, who goes **down not dead** and can be walked to and picked up | **Ours, and deliberately not BB's.** Permadeath does not create attachment, it cashes in a bond that already exists (this lane's own 9/12 finding). |

**The one to take is zone of control.** It is one rule, it costs no screen, it is what turns
rule 23's reach from a printed number into a decision, and it is the only row on this page
that RF4 does not already cover and our repo does not already have.

**NOT BUILT THIS ROUND, ON PURPOSE.** Rule 6: only build what is on the board. This row's
build half is the gate; zone of control belongs to `[fight feel]`, and that row is un-held
and behind `[one mode]`. Naming it here is the school's job; building it in a school round
would be inventing work.

## PART 3 — WHAT MOVES THAT BB'S PICTURE DOES NOT (rule 33g)

In Battle Brothers the high ground is **a tint on a hex and a number in a tooltip**. You
read it; nothing tells you.

Ours can be the opposite of a tooltip, and the machinery is already shipped: the fight runs
on the beat at 120 BPM, the camera pulls back through **his cloud** when a fight starts, and
bodies are drawn at the ruled size on the street's own art. A mound is a thing you **see
the camera climb**, a thing the body **stands up on** so his soles leave the road, a shadow
that falls the wrong way for one beat. **The tell that you have the height should be that
the man below you is suddenly worth looking down at, not a plus sign.**

That is the shape for the mound when `[fight feel]` reaches it: **high ground you are
standing on or one step from**, small enough to be one house, not a block across the street.

---

## THE GATE

`gates/one_terrain_effect_gate.js`, **4 passed, 2 failed**, built on the one driver.

It refuses a second terrain effect **without grepping for one**. A gate that searched for
the word "mud" would pass on a terrain effect spelled any other way. So it collects, over
120 seeded arenas, every *(what the game says decides this shot) → (the dial it got)* pair
and asserts **the map is a function**: 519 shots fell into 6 input buckets and every bucket
was internally consistent. Add a tile that moves a number and the same inputs start giving
two answers, whatever the tile is called.

```
  PASS  nothing else on a tile changes a number        no tuple gave two answers
  PASS  the one effect is real                         flat 0, a storey above 2
  FAIL  and it actually fires in a fight he plays      0 of 519, on the ground 120 of 120
  FAIL  and it is a mound, not a city block            9.26 tiles across, about 111 m
```

The two reds are the row, with their numbers, exactly as `one_mode_gate` carries its own.

## AND TWO INSTRUMENT FINDINGS, BECAUSE THEY COST ME TIME

1. **The old harness in this lane's gates is dead on `file://`.** It clicks blind at
   (215,450) and waits; since the loading screen landed it sits behind the splash forever,
   because that screen fetches five things and `file://` blocks a fetch. Every gate in this
   lane still using that pattern is waiting on a door that cannot open. The driver serves
   over http and knocks.
2. **The fight has its own front door too.** The COMBAT tab's frame opens on
   `BOHEMIA / DEAD EYE DIAL / TAP TO START` with a live `G` and a working `setupCombat`
   underneath it. Two finders failed to name that card and I stopped rather than write a
   third; the photograph was taken by **walking into a fight off the street**, the door this
   lane has already proved. It is also a finding for `[one mode]`: **the fight is a second
   document with its own title screen.**

## RULE 22

In the VOTE tab as `combat-the-only-high-ground-9-27`: a real fight walked into off the
street, with the four numbers on the card and the one question that matters.

---

**Gate:** `gates/one_terrain_effect_gate.js` · **Tab:** COMBAT, and any fight you walk into
from CITY; the picture is in VOTE.
