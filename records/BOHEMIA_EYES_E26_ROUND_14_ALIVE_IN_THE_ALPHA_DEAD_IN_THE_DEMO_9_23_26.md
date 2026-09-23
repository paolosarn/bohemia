# E26 ROUND 14: THE SIX WERE NOT BROKEN BUTTONS. THEY WERE A DEMO WITH THE PANELS CUT OUT.

EYES AND EARS, lane 17, E26 [five minutes], round 14. 9/23/26.
Walked on the deployed cut made fresh this round, **BUILD 9/24e**, and on the alpha.

---

## THE CORRECTION, FIRST, BECAUSE IT IS ABOUT MY OWN HEADLINE

For four rounds this lane's front-page list has led with dead controls on the demo's first
screen: `BUILD HERE`, `STANDING`, `RAY`, `DENISE`, `MARCO`, `Marry`, each pressed twice with the
panel still open and nothing moving that the world does not move by itself. That measurement of
the DEMO stands; it reproduced on four cuts with every planted control green.

**In the alpha, those same controls are alive.** Pressed by name in the alpha's RUN tab, with the
world's own noise floor measured first in this run (worst window: 0 words):

```
  STANDING    27 novel words on press one   and a full panel opened, photographed
  BUILD HERE   4 then 5 novel words
  Marry        5 then 0
  RAY          5 then 2
  DENISE       1 and 1
  MARCO        1 and 1
  SCAVENGE 8H  0 and 0                      the only one that still does nothing
```

The photograph is the proof that matters: pressing `STANDING` in the alpha opens a whole sheet
(YOUR RUNG, TERRITORY, THE VALLEY 0 of 16 factions with you, RENT TONIGHT, WHO IS OUT THERE,
CLOSE). That is not a dead button.

**So the defect was never the buttons, it was the cut**: the demo carried the chips and not the
panels they open. That is also why RUN's subtraction this round is the right shape of fix.

**What I am NOT claiming.** The alpha probe presses and watches words; it does not run the
14(h) panel-survival test, so `DENISE` and `MARCO` at one novel word each are the weak end of
this table and could be a card opening and closing. `STANDING` and `BUILD HERE` are not in
doubt.

---

## AND ON THE STRIPPED CUT THEY ARE SIMPLY GONE

```
  BUILD 9/24e, the deployed cut, freshly made
  things the first screen offers        2      (was 11 on 9/23e)
  things pressed in five minutes        5      (was 26)
  dead affordances                      0
  a stranger's first tappable thing     25.8 s
  a fight in five minutes               never
  real page errors                      0
```

**A zero here is a much smaller claim than it looks**, and this lane says so rather than banking
it: with two things on the first screen there is almost nothing left to be dead. The six are not
fixed in the demo, they are removed from it, and they are alive in the alpha where they still
live.

---

## TWO FALSE-DEAD CLASSES FOUND IN ONE ROUND, BOTH IN MY OWN INSTRUMENT

**1. A TAB ANSWERS ONCE.** The alpha walk reported `VOTE`, `3D`, `LOOK` and `WORDS` as dead
controls. All four open real tabs. The cause was my own repeat rule from round 11: evidence that
lands outside the control's panel had to appear on BOTH presses, and a tab paints a new screen on
press one and is a genuine no-op on press two, because you are already standing on it.

The discriminator is size, and it is measured rather than picked: the worst null window this run
is the world's own noise floor, and evidence elsewhere now counts on ONE press when it is at
least three times that floor and at least five novel words. A screenful, not a flicker. A fifth
planted control was added and it is the one that would have caught this: a button that fills a
different panel on the first press and does nothing on the second. It must read ALIVE.

**2. THE TAB YOU ARE STANDING ON IS NOT A DEAD BUTTON.** After the fix, one item remained:
`VOTE`, and the alpha opens on VOTE. Pressing the tab you are on correctly does nothing. The walk
now asks the page, in the language accessibility audits use: aria-selected, aria-current, or an
on/active/selected/current class.

**AND MY FIRST VERSION OF THAT EXCUSE WAS TOO WIDE, CAUGHT IN ONE RUN.** It walked three
ancestors, so it excused a cutscene headline, a line of card prose and a TILE badge, none of
which are controls. An excuse that wide erases real dead calls, which is worse than the wrong
dead call it was built to stop. It is now a tab strip or it is nothing: the mark must sit on the
pressed element or its immediate parent, that element must have siblings sharing its class, and
exactly one of them may carry the mark. After tightening, only VOTE is excused and the three
non-controls fall back to "inert", which is the right bucket.

```
  the alpha, after both fixes:  dead 0   |  21 pressed of 25 on the first screen
```

---

## AND ONE TAP AT ONE MOMENT IS A COIN TOSS ON THE NEW LOADING SCREEN

A walk of a cut placed outside its own folder sat on the title screen for the whole five minutes:
the splash looks ready in about a second, the walk tapped at 7.6 s, and the door handler refuses
every tap until the game is loaded, which is rule 18a working as designed. **The door control
caught it and the run was thrown away**, which is what it is for, and the wasted five minutes is
the part worth fixing. The walk now KNOCKS until the splash is gone, up to a budget, and records
how many knocks it took, which is also a number worth having: it is how long a stranger stares at
a loading screen. RUN made the same fix in their own driver this round, independently.

(That particular cut also never finished loading because I had copied it away from the chunk
files it fetches. My own filing, not the game's defect, and the door control is why it never
became a finding.)

## THE HORROR CHECK, STANDING, FIFTH CUT RUNNING, ZERO FINDINGS

R3 the long hold 2.7% of the frame in the worst four-beat window against a 10% bar, 0 of 8 over.
R8 128 full-frame draws on the world canvas, all opaque clears, 0 see-through overlays.
R10 0 filters and 0 composites on the world. Seven rules still unmeasured with what each waits on
named.

## PROOF

- `tools/bohemia_eyes_five_minutes.js`, eleven controls, every failed version written into it
- `records/BOHEMIA_EYES_E26_WALK_DEPLOY_9_14_26.json` and `..._WALK_ALPHA_9_14_26.json`
- `records/eyes_e26_alpha_six/standing.png`, the panel that a dead button does not open
- `records/eyes_e26_alpha_tabs/`, the tab strip pressed one tab at a time
