# THE SMOKE — one object, six systems (v170, RF4-57, machine 9)
COMBAT lane, 8/20/26. Ships in the COMBAT tab.

## THE LINE FROM THE CORPUS
RF4-57, machine 9: **"Status effects are turn denial and board editing, not
damage."** *"Almost nothing in the status list is about dealing damage."* Its
headline is the sleep bomb doing five jobs off one item, and its closing
sentence is the design rule underneath: **one deeply geometric item beats five
shallow ones.**

The row's diff column said we had `grenade`, `hold`, `defend`, `suppCd` — verbs,
but not one of them denies a turn or edits the board.

## WHAT SHIPPED
A burning car throws a **screen**. It is a circle on the field for six turns, it
hangs over its own tiles, it thins as it ages, and **nobody sees through it —
including you.**

That is the whole feature. There is no new button, no new resource and no new
number on the HUD.

## WHY SIX SYSTEMS CHANGED AND NOT ONE OF THEM WAS EDITED
V165 made **sight the master switch**: every enemy system asks `seesMe(e)`
rather than measuring distance for itself. So the screen is one line inside
`seesMe`, and everything downstream inherits it for free:

1. **the bead** — no red line is ever drawn through it
2. **the volley** — `exposedToMe` empties, so nothing shoots
3. **the press** — a blinded man walks to the **memory** of where you were
   (V165's `knownXY`), not to where you are
4. **cover seek** — a man who cannot see you stops repositioning against you
5. **the shout** — he cannot tell the others what he cannot see
6. **the spotter's pin** (V168) — it asks `seesMe` too, so **the pin lifts
   through smoke while he stands there alive and unhurt**

Six behaviours, one clause. That is machine 4 (one variable everything asks)
paying for machine 9. `smokeAt(` appears exactly **three** times in the whole
file: the definition, the ask inside `seesMe`, and the player's own targeting
filter. A fourth would mean a system started asking about smoke directly instead
of asking whether the man can see, and the lab gate fails if one appears.

## IT IS A WALL, NOT A CHEAT BUTTON
`modePool` filters through `smokeAt` too. Smoke that blinded only the enemy is a
win button with a circle drawn on it.

Measured, same policy and same rolls, 24 fights each, one difference (does he
cook a car on turn one):

| | avg HP lost | HP per turn | won | died |
|---|---|---|---|---|
| no car popped | 27.8 | 3.06 | 20 | 4 |
| cooks a car | **33.2** | **3.63** | 21 | 3 |

**Making the screen costs you.** It buys the thing you actually need — turns
where nobody has a line on you, so you can cross ground toward the way out —
and it charges you health for them. That is a tool, not a get-out.

## NO NEW BUTTON, AND THAT IS A GRAVEYARD RULING BEING OBEYED
THE COOK (the grenade fuse minigame, v124) is dead: *"bro what fucking minigame
was that im so confused?"* — **NO REMAKE OF THE FUSE BAR. EVER.**

So the screen is delivered by `cookOff`, the burning car the fight already pays
you to shoot. The player learns the mechanic by doing the thing he was already
going to do, and the game grows a deep new verb without growing a control.

## MEASURED, IN A REAL BROWSER
- **the wall**: sees `true` → `false`, volley pool 1 → 0, player pool 1 → 0, the
  blind man presses at a memory
- **the life**: blind for exactly 6 turns, then sight returns, 0 clouds left
- **the anchor**: 3.00 tiles behind him after 3 tiles of walking (a cloud that
  travelled with him would be a blindfold he wears, not a screen he made)
- **the delivery**: 29 of 29 arenas that have a car threw smoke through the
  shipped `cookOff`
- **the pin lifts** through it while the spotter lives
- **on the real surface**: dark cloud with a lit crown, full HP, readout
  *"THE SMOKE GOES UP — nobody sees through it — including you"*

The first draft drew it `rgba(96,92,88)` at 0.40 and on the real screen it was a
faint smudge you could lose against pale sand. A wall he cannot see is a bug
wearing a feature's clothes. A burning car makes dense black smoke, so the
honest colour was also the legible one.

## NO DAMAGE BEFORE THE DIAL
A burning car is the single most natural place in this game to add a
damage-over-time tick, and it adds **none**. Both dials are marked `[DIAL]` and
both are about vision: how wide the screen is (`SMOKE_R=2.4`) and how long it
stands (`SMOKE_TURNS=6`).

## THE MUTATION PASS, AND THE HOLE IT FOUND
Five mutations, all caught:

| mutation | caught by |
|---|---|
| smoke stops blinding the enemy | lab (one door) + browser ×3 |
| smoke stops hiding men from the PLAYER | lab ×2 + browser |
| the car stops throwing it | browser |
| the cloud follows the player | browser |
| the cloud never expires | **initially NOTHING** |

The lifetime check asked the page how long its own smoke lasts and then checked
that the smoke lasted that long, so setting the dial to 999 turns left it green
— and a screen standing for a whole run is exactly the "wall, not a tool" the
claim says it is not. **Consistency is not truth.** Same trap the OPEN BOOK page
fell into a day earlier; that is twice, so it is now a thing to check for by
habit. The claim is bounded in absolute terms (2 to 12 turns) and the mutation
dies.

## GATES
- `gates/combat_lab_gate.js` — **871 pass / 0 fail** (7 new V170 shape claims;
  two older claims re-pointed where this feature added a clause to a line they
  anchored on, claims unchanged)
- `gates/fight_moves_you_gate.js` — **39 pass / 0 fail** (6 new V170 behaviour
  claims, all measured in a real browser)
- `gates/rf4_teardown_gate.js` — 92 pass / 2 fail (C2/C3 are LAB's measurement
  cells, red by design)

RF4-57 moves SPECED → BUILT.

## WHAT THIS LEAVES
Machine 9's shape is now proved: **turn denial and board editing, delivered
geometrically, with no damage attached.** The spotter's pin (V168) was the
game's first turn denial and was a hand-built special case; the smoke is the
first one that is a real object on the board. The next status effect on this
lane starts from these two, not from a list of debuffs.
