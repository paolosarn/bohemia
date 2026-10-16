# THE VIEW HE HATES IS A PLACEHOLDER, AND HE HAS SAID SO TWICE
FACTIONS lane · THE FIVE MINUTES (rule 14), round seven · 9/15/26

## THE ONE LINE
Paolo, 9/15: *"when I zoom out all the way to the moon it looks like dogshit."*
Paolo, 8/16, about the same view: *"It's really bad."* Between those two the
screen has been printing the words **"placeholder sky · art request AR-005"** at
the bottom of it, the request has sat **OPEN** since 8/12, and no celestial art
has ever been drawn. He has now judged a placeholder twice, a month apart.

## WHY THIS LANE IS THE ONE SAYING IT
DIRECTION's new first line, [far view], names the candidates for what is lying at
the widest zoom: *"the car dots, flat colour cells, **the borders**"*. The borders
are this lane's. So this lane measured its own layer at that zoom before anybody
spends a round hunting it.

## MEASURED ON THE CUT HE PLAYED (9/14p), WITH THE ONE DRIVER

| where | this lane's borders | footprints | lit blocks |
|---|---|---|---|
| on foot | not drawn (correct, it is a map layer) | — | — |
| one zoom out, the city view | **14** | **10** | **205** |
| two zooms out, the widest | **layer never ran** | never ran | never ran |
| three zooms out | identical to two: this IS the widest stop | | |

The data is still there at the widest stop (`turfGrid` returns own=true, n=96) and
the layer simply is not reached. **So the borders are not the lie at the far zoom,
because at the far zoom there are no borders.** Nothing of this lane's paints there
at all. Every published render global was cleared before each read, because the
game sets them and never clears them, so reading one after a different draw
reports the last draw rather than this one.

## WHAT IS ACTUALLY ON THAT SCREEN
A flat brown sphere edge, a starfield, the word PLANET half-covered by the phone
feed, the whole valley reduced to a smudge a few pixels wide on the horizon, and a
caption that admits it: **"placeholder sky · art request AR-005"**. There is no
city on screen to compare against a Las Vegas aerial. Judging that view against a
real aerial, as the row asks, would return "it is a placeholder", which was already
known and filed a month ago.

## THE PAPER TRAIL, ALL OF IT ALREADY IN THE REPO
- `records/BOHEMIA_ONE_ZOOM_TO_THE_MOON_8_12_26.md`: the repository contains **no
  celestial art of any kind** in any bank. That is why it was requested rather than
  invented.
- `records/requests/BOHEMIA_ART_REQUEST_QUEUE.json`, AR-005, filed 8/12 by RUN,
  status **OPEN**. Its marker for "shipped" is `__SKY_ART__`.
- `records/BOHEMIA_VERDICT_ROUGH_DRAFT_8_16_26.md`: his 8/16 verdict on this exact
  view, already routed to AR-005, with the note that *"his verdict is the strongest
  input that request has ever had and should travel with it."*

Checked on this tree: **`__SKY_ART__` appears 0 times**, the placeholder caption is
still drawn once, and **all six requests in the art queue are OPEN with none ever
closed**. So the mechanism that was supposed to carry his 8/16 words to whoever
draws it has carried them nowhere for a month, and he said the same thing again.

## WHAT THIS LANE IS NOT DOING
Not drawing a sky. That is art, it is filed, and inventing celestial pixels would
be exactly the thing the 8/12 record refused to do. This is a measurement and a
hand-over, and it belongs with DIRECTION [far view], COOK [city from above] and
whoever owns the art queue.

## AND ONE NUMBER I MEASURED AND THREW AWAY, WHICH IS WORTH MORE THAN KEEPING IT
I tried to answer a second question in the same run: *can you ever see your
territory whole?* The probe walked all 9,216 valley cells through the game's own
iso projection and counted the ones landing on the canvas. It came back with 34.7%
visible **on foot**, which is absurd on its face: on foot you can see one street.

The bug was mine and it is the same shape as three others this lane has recorded.
The projection needs the camera origin the render used, and I passed
`window.__lastOx` — **a name I made up**. It does not exist anywhere in the file, so
every cell was projected from 0,0 and the count was of a camera the game never has.

Thrown away rather than reported. The honest statement about that question is that
this lane has not answered it. What IS measured stands on its own: at the city view
**all fourteen** outfits' ink is on the glass at once, so territory does read
across the valley there.

## RULE 14, OBSERVED
No demo cut, no alpha touched, no build stamp. Nothing shipped to the game from
this section.

## [PENDING Paolo] — NOTHING NEW
