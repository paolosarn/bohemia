# NOTHING FLIPS BEFORE THE FIRST CRISIS
DYNASTY, row [the flip unlocks at the crisis], rule 85 (Paolo 10/10). 10/10/26. MODE: BUILD.

## WHAT SHIPPED
engine/bohemia_acts.js: `crisis(day)` is the one door for act 2. It sets the crisis flag, unlocks act 2, says which day, and answers ALREADY (keeping the first day) the second time. `crisisStarted()`. A base the player takes NO LONGER opens act 2; unlockFromBases returns nothing until the crisis has started, and after it only opens act 3 from a base taken in act 2. The crisis day is saved and loaded (a hand-edited save with a crisis but no act 2 drops it; a bad day is 0, never NaN). The city carries the module verbatim and gains ctActCrisis(day), the hook WORLD's crisis clock calls (it writes window.__ACT_CRISIS for the gate). Before the crisis the phone shows one face and the flip is refused (the existing LOCKED answer), which already reads dark and silent.
Gates: ONE THEN HEIRS legs rewritten for the new door (headless against the real home-base ledger, and on the glass: one face and no flip before, the crisis grows the second face, a second crisis is refused); HEIRS 83/0; THE FLIP 23/0; THREE NAMES 31/0 (they unlock acts directly, as before).

## MEASURED
Nothing in the walked game calls the crisis, because no crisis clock exists yet. So today a fresh game has NO flip at all, which is exactly his sentence ('you can't even flip until it's unlocked in the first endgame crisis'): the alpha's flip is dark until WORLD's clock calls ctActCrisis around day 80 to 100 (the VIA GROK clock; my 10/9 lore test found the crisis outlasts a 130-day act, so the default is that it ends the act).

## NOT DONE, SAID PLAINLY
DIRECTION's four-beat card (the unlock's look) is not built; flip() reports `first` and the crisis reports `first` for it to key on. The crisis clock itself is WORLD's.
**A RED NOT MINE:** the ONE THEN HEIRS glass gate has 13 red legs after the glyph tap (the reshuffle glyph, field focus, OLD, OK, save), and the same 13 are red on UNMODIFIED main (checked with my changes stashed). A glyph on the phone is now 61 by 24 pixels at the tap point; something in a recent UI change on main broke the offer row's taps. My new crisis legs pass. Left for PLUMBER/UI, named here.

## ROUTED
WORLD: call ctActCrisis(day) when the first crisis starts. DIRECTION/UI/SOUNDS: the four-beat card. PLUMBER/UI: the glass gate's 13 reds on main.
