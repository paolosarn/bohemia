# THE SIGNS DIED OF THE CAMERA
FACTIONS lane · [horror signs] ENDS · the post-mortem, and what the real surface says
instead · 9/24/26

## HIS WORDS, AND THEY ARE THE WHOLE POST-MORTEM
Second votes, rule 32:

| item | vote | what he said |
|---|---|---|
| `factions-the-signs-at-night-9-22` (the night re-cook) | UP | **"BRO THIS GAME ISNT IN FIRST PERSON WHEN WOULD i see this????"** |
| `factions-the-dark-institutions-9-22` | DOWN | **"I DONT LIKE THESE BRO WTF"** |
| `factions-the-last-light-9-23` | UP | **"Im confused the numbers look good cool but the picture we wont use that bro"** |

**Two of the three thumbs were UP and all three comments say the same thing.** The thumb was
never the verdict here. The comment was.

## THE FAULT, NAMED IN ONE SENTENCE
**Every sign this lane made for eight rounds was drawn head on, at eye level, from a
standing human's viewpoint. This game is looked down on from above.** He would never once
have seen any of them, at any point, in any part of the game.

That was true of the very first batch on 9/21 and it stayed true through four kills, one
re-cook for lighting, and two rounds of volume. **I re-cooked twice for the wrong reason.**
"Not analog horror enough" got read as a lighting note, so round seven rebuilt them at
night; the night was never the problem and the re-cook could not have fixed it.

It is now law: **rule 32(f), SHOW IT FROM THE GAME'S CAMERA** — *"a VOTE item is a frame off
a play surface or a tile at game scale; studies go in records."*

## WHAT I SHOULD HAVE DONE ON ROUND ONE
Opened the game and looked at it. That is all. One screenshot of the walked street on round
one would have ended this row before it started, and it cost one command this round.

> **BEFORE YOU DRAW SOMETHING FOR A GAME, PHOTOGRAPH THE GAME.**

## THE GRAVEYARD, PER RULE 32(g)
`factions-the-dark-institutions-9-22` is **KILLED** and goes to the graveyard, on his
instruction ("the shirt that is not cloth and the dark institutions: graveyard").

**The picture dies. The measurement under it does not**, and this is the second time this
row has proved it: the 21 civic blocks being dark, and never changing hands across a
century, is a fact about this valley that survives its frame. It is in
`records/BOHEMIA_THE_ONES_NOBODY_CAME_FOR_9_24_26.md` and on this lane's handoff.

**Do not re-cook any of the four killed signs**, at any angle, under any lighting. A dead
shape does not come back under a new name.

## WHAT THE REAL SURFACE SAYS, MEASURED THIS ROUND
Photographed on the running alpha with the one driver, at the game's own camera. No art was
made.

**ON THE STREET:** the only thing that tells you whose ground you are standing on is **one
thin orange line**. It is correct, it is the border law working, and it is all there is.
The other things that read as signs in frame (HOME, a shop name) belong to buildings.

**FROM THE CITY VIEW:** you can see **nothing at all**. Fourteen crews, 9,216 owned blocks,
fourteen published colours measured off his own wardrobe, and the valley from above is blank
sand.

> **COLOUR IS TERRITORY is a law, and on the two surfaces he plays on, territory is one
> orange line and then nothing.**

A sign was never going to fix that. A sign is one building; this is the whole valley.

## AND THE PHONE IS ALREADY DOING THIS LANE'S JOB
The city-view feed in the same frames was carrying, unprompted:

- *"@thecircuit — most of the valley is still dark. 358 blocks with anything in them at all."*
- *"@thevalley — still no moving the Church off their town. everybody knows it."*
- *"5 outfits holding a fortress between them, that is a lot of walls for one valley."*

**358 is this lane's own round-seven measurement, already in the game, in a mouth, at the
game's camera.** So his "the numbers look good" already has a home that works, and it is not
a picture. That is the surface faction facts belong on (THE FEED ON THE CITY SCREEN, Paolo
9/4: "what the world did, faction and territory events"), and UI and WORLD own the pipe.

## THREE NEAR-MISSES, ALL THE SAME SHAPE, NONE OF WHICH THREW
1. **`window.POWER`** is undefined (last round) — a bare `const` never lands on `window`.
2. **`LOT` and `PX` do not exist.** My sweep read `typeof PX === 'number' ? PX : 48` and
   `hx / (typeof LOT !== 'undefined' ? LOT : 275)`. Both fallbacks fired. The 275 one put
   the player on cell **22,22** and I was one paragraph from telling him his own block
   changes hands.
3. **The real divisor is `FN` (128)**, which the walked city uses on its own line 68846.
   `6218 / 128 = 48`, so the cell **is 48,48** and last round's claim stands.

**Last round was right by luck: the fallback constant happened to equal the true value.** A
correction written without checking would itself have been wrong.

> **A FALLBACK CONSTANT IS NOT A MEASUREMENT, AND A RIGHT ANSWER FROM A GUESSED CONSTANT IS
> STILL A GUESS.**

## AND A FOURTH: A HASH DIFF ON A LIVE SCENE PROVES NOTHING
Two street frames one act apart came back with different md5s and I nearly filed *"the
street does not redraw territory after the act flips."* The frames are identical to the eye;
**two pedestrians had each moved one pixel.**

Measured properly with the game's own arithmetic: **0 of the 49 cells within three houses of
him change hands between act 1 and act 3.** The nearest one that does is **four houses
away** (52,44, Church to Blues). So the identical frame was correct and there was no bug.

## THE COOK
`slices/vote/FACTIONS_YOU_CANNOT_SEE_TERRITORY_9_24.html`, registered
`factions-you-cannot-see-territory-9-24`. **It draws nothing.** Every picture in it is a
photograph of the running game at its own camera, which is rule 32(f)'s first option.

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**He rejected the viewpoint and I heard a lighting note.** "Not analog horror enough" was
read three times as a note about the pixels because that was the axis I was working on, and
the actual complaint was about where the camera stood. **When a rejection repeats and the
fix does not land, the thing being rejected is not the thing you are changing.**
