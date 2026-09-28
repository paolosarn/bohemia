# WORDS [naming screen] -- YOUR THREE, THE ONE SCREEN BEFORE ACT ONE

**LANE** WORDS (12). **ROW** `[naming screen]`, THREE-NAMES-MALE-OR-FEMALE, rule
31 section 5 (Paolo 9/23). Claimed and pushed before the work (rule 5); the
blocker it waited on was DYNASTY's `[three names]`, which shipped 9/27 and
routed the job here by name.

---

## 1. THE MEASUREMENT, BEFORE A LINE WAS WRITTEN

DYNASTY's record said this exactly: *"ctActSetName/ctActSetSex are real and
gated, waiting for the naming screen's own control to call them."*

Read the mechanism it built (`engine/bohemia_acts.js`):
`roster(seed)`, `reshuffle(act)`, `setName(act, name)`, `setSex(act, sex)`,
gated 31/0 in `gates/three_names_gate.js`. All four are pure state functions,
already wired to city-level globals (`ctActSetName`, `ctActSetSex`,
`ctActReshuffle`) on the phone's own flip strip, but not called by anything
with an actual name field or sex picker. **Nothing existed for a player to
type into.** That was the whole gap.

## 2. WHAT WAS BUILT: A REAL SCREEN, NOT A MOCKUP

`slices/BOHEMIA_THE_THREE_BEFORE_ACT_ONE_9_28_26.html`. It is standalone
(loads `engine/bohemia_people.js` and `engine/bohemia_acts.js` the same
relative way other standalone slices already do -- REUSE-FIRST, no second
copy of the name bank or the acts module) and it is real: every control on
the page calls the live, gated engine, not a fake.

Three cards, one per act (ANIMAL/NOW, HUMAN/+35Y, ANGEL/+70Y, the eras and gap
already canon per `bohemia_acts.js`), each with:
- a prepared name, filled from `BohemiaActs.roster()` on the first frame
- a reshuffle glyph, the same `⟳` the flip strip already uses
- a text field, a real `<input>`, that calls `setName` on blur/Enter
- a MALE / FEMALE toggle that calls `setSex`
- a line that says whether the name came prepared or is his, typed

A BEGIN button confirms the roster is complete and states, honestly, what
happens after: nothing yet. That handoff is RUN's/UI's wiring into the boot
sequence, not this page's, and the record does not paper over that.

## 3. PROVEN ON THE REAL GLASS, WITH A REAL FINGER AND A REAL KEYBOARD

Not a description of the page: driven, exactly the way DYNASTY's own gate
holds `[three names]`'s reshuffle to the real glass.

```
first frame        : all three slots named, all three sexed        (rule 32d)
tap the reshuffle   : ONE slot changed (Rashad Salcedo -> Lourdes Chu),
  on slot 2           the other two exactly where they were
tap MALE on slot 1  : sets it, on the real control
type "Guadalupe"     : sticks after Enter, tagged "yours, typed",
  into slot 3, Enter    never bled into slot 1 or 2
```

## 4. SWEPT, NOT ASSUMED

- **Rule 27** (the player does not speak Spanglish): every visible word on
  the page checked against the real closed Spanish set in
  `engine/bohemia_people.js` (274 words). **0 hits across 43 words swept.**
- **The banned-phrase list**: checked against `gates/voice_gate.js`'s own
  list, not a reimplementation. **0 hits.**
- **No em dash.** **`draft:true`** present on the page itself, not only
  claimed in this record.

## 5. THE GATE

`gates/naming_screen_gate.js`, registered in the suite. 19 legs: the page
loads the real engine files, rule 27 and the banned-phrase sweep, four legs
on the real glass matching DYNASTY's own reshuffle ship test, and a leg that
**states what this does not claim** -- it checks the alpha does NOT yet
reference this page, so a green here can never be misread as "it ships
wired," and the gate would fail itself the day that note goes stale.

**MUTATION-PROVED.** Rewired the reshuffle button to always hit slot 1:
`RED: 17 passed, 2 failed`, naming both the broken slot-2 change and the
falsely-touched slot 1. Restored: `GREEN: 19 passed, 0 failed`.

## 6. WHAT THIS DOES NOT CLAIM

- **This is not wired into the alpha's boot sequence.** It is a real,
  working, gated screen that nothing calls yet. Rule 18 says the demo does
  not change; this is alpha work, and the alpha's own boot flow is RUN's.
- **The face is a placeholder**, on purpose, for the same reason DYNASTY
  named in its own record: the face-follows-name gap is CHARACTER's and
  PORTRAIT's heredity work, and inventing a second face-roll here would be
  a second answer to a question this lane does not own.
- All copy is `draft:true`. Nothing here is a name he has not typed himself.

## ROUTED
- **RUN / UI** -- the integration: calling this page (or folding its markup
  into the alpha) at the point a fresh run begins, before act 1.
- **CHARACTER / PORTRAIT** -- the face-follows-name gap DYNASTY already
  named stands here too, unchanged.
