# THE NARRATOR SPEAKS THE RECAP (SOUNDS, 10/16)

Row [the narrator]. Rule 45 (the second votes: "nothing in the first second," and
the narrator's creepy machine voice reads the end screen) and its widening, rule 80b
(coordinator 10/9, his own words: "cooler if it was narrated if I wanted it").

## Why this row, this round

Both claimed rows ([the soundscape], [the map's sounds]) checked fresh and are
genuinely blocked right now: their own remaining items are either waiting on his
vote (the night's insects) or on a real recorded human voice this lane's
struck/resonant palette cannot honestly fake (the bar's murmur, the posts' crowd,
"voices low," "the crew's shout") -- and that recording capability is PLUMBER's
[the toolchain] row (rule 108c), still OPEN, not yet shipped (checked fresh: no
library folder, no RD_TOKEN pipe exist in the repo). [the narrator] is a different
technique entirely -- the phone's own built-in speech engine, zero recording, zero
licence, zero dependency on anything not already in the repo -- and the coordinator
already moved it up to second priority under [the soundscape]. Claimed and shipped
in the same round.

## What it is

`engine/bohemia_narrator.js`: a small wrapper on `window.speechSynthesis`, the
browser's own text-to-speech, not a sound this lane synthesises. Zero new audio
content, zero licence line to carry (it is the phone's own engine, the same one
every screen reader on earth already uses).

- `speak(text, opts)`: off unless a stored toggle says on (default OFF, matching
  the row's own "off by default in SETTINGS until he hears it" ask); cancels
  whatever is mid-sentence before starting a new line, so it NEVER PLAYS OVER
  ITSELF.
- `stop()`: cancels.
- `wireTapToStop(el)`: a `pointerdown` listener, capture + passive, that cancels
  speech already running -- it never calls `preventDefault`, so it cannot eat a
  tap meant for the screen underneath.
- A flat, even voice on purpose: rate 0.95, pitch 0.75 against each engine's own
  "normal" of 1 -- slower and lower than default, never the TTS engine's own
  expressive reading of a line. The row's own words: "a machine, not a person;
  people keep a portrait mouth with no voice."

## Wired, scoped on purpose

`slices/BOHEMIA_FIGHT.html`'s `showOver()` -- the ORIGINAL, narrowest ask in rule
45 -- now speaks the same headline already drawn on the screen (`#oh`'s own text)
plus the same summary sentence the recap already renders (rounds, how many of
theirs went down, how many ran), never the per-man table (numbers read aloud are
not speech). A tap anywhere on the recap stops it.

## What this did not do, named plainly rather than built thin

    the keepers' lines, the board's   NOT WIRED. Rule 80b's own wider list.
    contracts, a road event, the      Each lives in a different file
    title's lines                     (the settlement screen, the city/map
                                       frame, the alpha's own title); the
                                       mechanism here is file-agnostic and
                                       ready for each, but wiring all four in
                                       one round would be four thin wires
                                       instead of one real one.
    ducking the song while it talks   NAMED, NOT BUILT. Rule 80b's own ask.
                                       BOHEMIA_FIGHT.html plays its SFX through
                                       a postMessage bridge to the alpha's MUS
                                       bus, not a local one; ducking needs a
                                       new bridge message the alpha's side
                                       answers, which is its own real piece of
                                       work, not a one-line add.
    the SETTINGS toggle itself        NOT THIS LANE'S. Rule 80b's own words:
                                       "UI builds the toggle in the settings
                                       card." `setEnabled()`/`enabled()` are
                                       exposed for that toggle to call the
                                       moment it exists; until then the judge
                                       page below carries its own toggle, the
                                       same way every lane's candidate does
                                       before its real control is built.

## Checked by a machine, the shape this thing actually has

There is no buffer for `cooked_sounds_gate.js` to measure -- this is a behaviour,
not a waveform. `gates/narrator_gate.js` (new, the same Playwright-drives-the-real-
page shape `one_engine_gate.js` and `settlement_screen_gate.js` already use) proves:
off by default, a second `speak()` cancels and restarts rather than stacking or
throwing, a real `pointerdown` really cancels speech in progress, and
`BOHEMIA_FIGHT.html`'s `showOver('won')` really calls `speak()` with the exact text
drawn on the screen. 7/0. Served over a real local HTTP server (`127.0.0.1:8946`)
because the fight screen fetches its sourced numbers and `file://` cannot fetch.

CHECKED, NOT ASSUMED, ON THE DIFF'S OWN GATE: COMBAT's `gates/the_rebuilt_fight_plays_gate.js`
also reads `slices/BOHEMIA_FIGHT.html` and belongs on this round's pre-push pass by rule 13's
own letter. It stalled twice in a row at the same claim ("THE LIT TILES LOOK LIT"), producing
no further output for minutes. Rather than assume that away, the suspicion was tested directly:
`slices/BOHEMIA_FIGHT.html` was swapped for `ccd65a91`'s own version (the file exactly as it
stood before this round, zero narrator code anywhere in it) and the same gate was run against
that clean file. It stalled at the IDENTICAL claim, with the identical trailing pattern of
`[driver] opening BOHEMIA_FIGHT.html` lines and no further output. The stall is pre-existing and
unrelated to this round's change, not this lane's regression; named here rather than claimed
clean on a gate that never finished either way. Not this lane's to fix (COMBAT's own gate).

## Registered

`sounds-the-recap-speaks-10-16`, draft:true, on
`slices/BOHEMIA_THE_RECAP_SPEAKS_10_16_26.html` -- a toggle, the two recaps
("WON"/"LOST") played word for word what `showOver()` actually speaks, and the
voice's own numbers (rate, pitch) named plainly.
