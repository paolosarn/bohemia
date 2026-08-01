# COMBAT v106-v108 — THE STAIRS WALK, THE ORANGE DIES, AND A CAR IS THREE THINGS (8/1/26)

Paolo, T7 + T8: *"On top of the edits that I'm requesting right now I need you
to take a big swing and do something really awesome for combat pretty please
Please make sure cars can be used as Cover pretty please. Thank you. I'm so
confused. I literally approached the stairs then I walk on the stairs and then
it says I'm behind the stairs. It's very confusing and ugly. What's up with
that so basically I can't even walk up the stairs if I wanted to I'm so
confused."*

Everything below was proven on the real surface (headless Chromium, the actual
preview canvas, the actual combat frame) before it shipped. Combat gate went
551 -> 574 checks, all green.

---

## 1. THE STAIRS — TWO BUGS, BOTH MINE (v106)

His one sentence names two separate defects, and he is exactly right about
both.

### "it says I'm behind the stairs"

The stair is generated as a DECK TILE with `.stair=true`, pushed into `G.deck`.
The v93 under-deck x-ray asks `deckTileAt(0,0)`, which does not care whether a
tile is a slab or the way up. **So the moment he stepped onto the foot of the
run, the game washed him cold blue and told him — in its own vocabulary — that
he was standing UNDERNEATH the thing he had just climbed onto.**

A STAIRCASE IS THE ONE PIECE OF A DECK THAT IS NOT A CEILING. Fixed at the
predicate, not at the call site: `deckSlabAt()` means "a deck tile that can be
over your head" and it excludes the stair. Both x-ray reads (mine and theirs)
moved onto it. `deckTileAt` still answers for the full footprint, because the
boards, the legs, the kick rail and the shadow are all drawn from the whole slab.

MEASURED AFTER: standing on the stair tile, `deckTileAt` true, `deckSlabAt`
**false**, `underDeckMe()` **false**. His exact bug, gone.

### "I can't even walk up the stairs if I wanted to"

**Literally true.** The only way up was the STAIRS button (v90B/v91). We drew a
five-tread run coming down toward the camera (v92), put a pulsing chevron over
it (v91), and then made walking onto it do nothing at all. He walked up to a
staircase and it behaved like paint.

NOW THE STEPS ARE THE VERB. The stair tile is a LANDING that belongs to both
floors:
- on the lot, a step onto it CLIMBS — 1 stamina, no turn, the same price the
  button charges, because it is the same act
- at the top, a step off it onto the lot DESCENDS
- off any OTHER deck tile, a step into thin air is BLOCKED and says THE EDGE

That last one found a bug nobody had ever seen: `doMove` had no idea levels
existed, so you could walk clean off the deck and keep standing one storey up
over nothing. Nobody noticed because nobody could get up there without the
button.

MEASURED AFTER: level 0 -> 1 on a single step onto the run, `onStairNow()`
true, no x-ray, readout **"UP THE STAIRS"**, button flips to **"DOWN · 1 STA"**.

The button stays. It is the finder ("STAIRS 6 SW") and the phone-proof channel.
It is no longer the only door.

---

## 2. THE ORANGE — NAMED BY INSTRUMENT, KILLED, AND THE FAMILY SWEPT (v107)

Six reports. Two wrong fixes. Both times because I GUESSED which drawing it was.

This time the canvas was instrumented: `fill` / `stroke` / `fillRect` /
`fillText` wrapped on the prototype, recording colour, call count and stack,
filtered to frames where `G.ks` is live.

**BEFORE, on a real killshot on origin/main:**
```
216  stroke #caa07a | drawArmNeedle -> draw -> loop
216  stroke #241f18 | drawArmNeedle -> draw -> loop
216  stroke #3a3632 | drawArmNeedle -> draw -> loop
```
`#caa07a` is the needle arm's warm tan-gold. And it is not one arm — it is the
GHOST FAN, **eight fading copies of the needle, every frame, ungated**, welded
around the locked arm for the whole cinematic.

**AFTER, same probe, same shot: ZERO `drawArmNeedle` strokes.** The only warm
thing left during a kill is `rgba(232,60,40,0.85)`, which is the red hostile
marker and belongs there.

### AND THE FAMILY, NOT THE MEMBER

The dial's ornaments keep surviving into the cinematic one at a time: v87 gated
the chain glow, v94 deleted the median, v85 held the ghost chip. Three turns,
three fixes, one bug — and I never once asked what else was in the family.

So v107 does not gate one loop. It NAMES THE RULE:

```js
function dialOrnament(){ return !G.ks; }
```

THE KILL WEARS NOTHING. Every warm dial ornament asks it, including the RETICLE
ghost fan (six more echoes, `ghostRGB(1)` = rgb(255,200,70), literally
orange-gold) that nobody had reported yet only because the arm fan was louder.
The gate now counts the loops and asserts none of them is ungated.

---

## 3. THE GRENADE THAT SURVIVED THE FIGHT — AND HIS BIGGER POINT (v107)

> *"I had a grenade set to explode... combat ended... and then even when I press
> a new encounter the grenade it just stuck"*

The reset `G.pGren=null; G.pGrenLeft=...; G.grenArm=false;` lived in
`setupCombat()`. **`newEncounter()` does not call `setupCombat()`** — it calls
`setupEnemies(); buildBoard(); updPlayer()` directly and resets its own inline
list written a hundred versions before the grenade existed.

### HIS SENTENCE IS THE ACTUAL FINDING

> *"I'm just so confused the type of transition you have between combat mode and
> non-combat mode"*

He is not describing one stuck object. **There were TWO reset paths that cleaned
up different things, where every new mechanic had to remember to be added to
both, and one of them was always forgotten.**

`resetFightState()` is now the ONE reset and both doors call it. HP is
deliberately absent: a new encounter carries HP over, which is a ruling.

MEASURED AFTER: live grenade + zero pouch, `newEncounter()`, grenade **null**,
pouch back to 2. And three OTHER things silently got fixed by the same change,
because they had the same hole: a held shot, the groove chain, and your level
now all die properly on NEW ENCOUNTER.

---

## 4. TWO SHOTS, TWO GUNSHOTS (v107)

The double tap already called `sndShot()` twice. The gap was **90ms** and both
reports were the IDENTICAL two-oscillator voice, so the second landed inside the
first one's 100ms decay, on the same two frequencies, and summed into one fatter
bang. He heard exactly what the code produced; the code was wrong about what a
double tap sounds like.

Now 165ms apart (a real controlled pair is 150-250ms) and the second report is
its own voice — `sndShot2()`, lower, shorter, drier, the way a second round out
of a still-settling gun actually reads.

---

## 5. THE BIG SWING — A CAR IS THREE DIFFERENT OFFERS (v108)

> *"take a big swing and do something really awesome for combat... Please make
> sure cars can be used as Cover"*

Since v103 a car was six identical pillar cells. It blocked a bullet — but every
cell was worth exactly as much as a concrete block, and the game never once said
the word CAR. **A wreck you hide behind that is mechanically a crate is not
cover, it is scenery with collision.**

### GROUNDED, NOT INVENTED

The most-tested thing in real ballistics, and the answer is counter-intuitive,
which is exactly what makes it a mechanic:

- **THE ENGINE BAY STOPS RIFLE ROUNDS.** Block, transmission, front wheel and
  brake assembly. Every law-enforcement vehicle-cover doctrine says the same
  sentence: get to the front wheel.
- **THE DOORS STOP NOTHING.** 20-gauge sheet, an air gap, a window regulator and
  a plastic card. Penetration testing puts pistol rounds through both doors. It
  is CONCEALMENT, not cover.
- **THE BOOT IS LOW AND SOLID** — and it is where the tank lives.

CAR_L is 3, so the car's three rows ARE the parts. Nothing was invented; this is
the shape the object already had.

| row | part | offer |
|---|---|---|
| 0 | ENGINE | hard cover, and the far end from the tank |
| 1 | CABIN | they lose your line, their bullets do not care. **The trap that looks like the safe option.** |
| 2 | BOOT | hard, low enough to vault — sitting on the fuel |

*"Think about all the shit you will need to hide behind"* was his arena brief.
This is that sentence answered properly: the same object is good cover, fake
cover and a bomb depending on which end you pick. And the step that puts you
there NAMES it — ENGINE BLOCK / THE DOORS / THE BOOT — because a mechanic you
cannot read off the screen is not a mechanic.

MEASURED IN ISOLATION (a world containing only the doors, then only the block):
cabin-only `myCoverAgainst` **false**, `myConcealAgainst` **true**, engine-only
`myCoverAgainst` **true**.

### AND THEN IT COOKS OFF

Rounds YOUR COVER ATE have to go somewhere. If the thing that stopped them was a
car, that is HEAT in the metal, and the heat is a fuse both sides can watch.

**The best cover on the lot is a bomb you are standing next to.** A man tucked
behind a car is no longer a stalemate: he is a target with a fuse, and the
answer is the grenade he just got — thrown AT THE WRECK, not at the man.

ONE BULLET NEVER SETS OFF A FUEL TANK. That is the film version and it would
make the best cover on the lot unusable. It takes sustained fire (CAR_COOK=10)
or an explosion (CAR_GREN_HEAT=7). The blast uses ONE band function for you and
for them, so hugging the car you just cooked costs you exactly what it costs
them.

**What is left is a shell, and the lot is permanently different.** Fire takes the
glass, the seats and the tyres; the block and the frame do not go anywhere. So
every cell becomes LOW HARD cover — the cabin gets BETTER, which is the one
honest surprise in the whole thing.

MEASURED: heat 10/10 -> burnt, six cells low + hard, fireball fx spawned, an
enemy at 30 HP inside the radius went to 0.

### A BUG I FOUND IN MY OWN WORK BEFORE SHIPPING IT

The first version derived the row from `span`, which is `(vert?CAR_L:CAR_W)-1`
— a v103 slip that was invisible while it only fed a boolean. Probed both
orientations: **a car parked across the screen came out engine/boot/boot and had
NO CABIN AT ALL.** Fixed at source (`CAR_L-1`), the alpha reset to origin/main,
all three patches replayed, and both orientations re-measured:
`boot,boot,cabin,cabin,engine,engine`.

MECHANISM-MINE / CONTENTS-PAOLO'S: the parts, the heat and the cook-off are
machinery. Every NUMBER (heat per round, threshold, blast bands, the wreck's
cover value) is a DIAL, set to something playable and his to move.

---

## WHAT IS STILL OPEN FROM T7

- **SQUATTING AFTER A HEADSHOT.** NOT SHIPPED, and I am not claiming a fix I
  cannot prove. What I did do is stop reasoning and capture the actual clip
  `enemyFrame` returns, every 40ms, off a live covered man.

  **My earlier diagnosis was WRONG.** I wrote that the squat was the window
  between the trigger and `_deadAt`. It cannot be: `enemyFrame` checks `e.dead`
  FIRST and returns `idle112` — a STAND — until `_deadAt` passes, so the v102
  dial-cover branch is unreachable for a dead man.

  What the capture DOES show is a covered man cycling
  `cover112[0] -> cover112[1] -> cover112[0]` on a 500ms beat, forever. That is
  the JUICE.A beat-breathing crouch, and it is a man squatting and standing back
  up on a loop. Two live candidates, neither confirmed:
  1. the killshot camera zooms onto the target, so a NEIGHBOUR's breathing
     crouch suddenly fills the screen right as the kill lands
  2. a shot that graded VITAL rather than KILL leaves the man alive on stun 2,
     still breathing in his cover, and Paolo would reasonably call that "I
     killshot someone"

  Next: reproduce with the shot actually landing (the probe's `fireNow` was
  refused because the forced setup never left phase `cover`), and if it is (1),
  the answer is that nobody breathes during a kill — the same rule as v107's
  THE KILL WEARS NOTHING, extended from the dial to the bodies.
- **SHOTGUN DEATHS KEYED TO THE HIT TYPE**, and the seamless-animation research.
  Adjacent to another session's animation revamp; scope has to be agreed before
  anyone touches clips.
- **THE ALLOWANCE RAMP IS STILL INVISIBLE TO HIM.** Open question: should the
  DIAL itself change (ring goes red, window visibly shrinking) rather than more
  text?
- SUPPRESS is confusing; companions; sneaking/pre-combat; a third storey.

## THE TOOLS

`tools/bohemia_combat_stairs_walk_patch.py` (v106)
`tools/bohemia_combat_orange_reset_shots_patch.py` (v107)
`tools/bohemia_combat_car_cover_patch.py` (v108)

All idempotent, all carrying a REUSE CHECK, none of them cooks a pixel. The car
sprites are the eight approved wrecks already embedded by v103; the burnt state
is a tint on the SAME approved sprite.
