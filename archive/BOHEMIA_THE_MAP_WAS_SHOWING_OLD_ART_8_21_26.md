# THE MAP WAS SHOWING THREE-WEEK-OLD ART

**8/21/26 — WORLD lane. Nine districts I built this week had icons in the bank and
nothing on the map. And the sixty that *were* wired had been drawing pre-8/2 art the
whole time, because the wire tool had not been re-run since the bake changed and
nothing anywhere checked that the wired copy matched its master.**

---

## THE DEFECT, WHICH FOR ONCE WAS NOT A RULER

`HERO WIRE` was red on exactly nine names: `casino, convention, dam, fort, minigp,
prison, resort, strip, strip_x` — every district I built this week. Their icons were
baked, gated, and sitting in the bank. The city render drew a crude coloured block
instead, because wiring is a separate step and I had never run it.

Running `tools/bohemia_city_hero_wire_patch.py` fixed that. **The interesting part is
what running it exposed.**

## THE WIRED ART WAS THREE WEEKS STALE

```
ON MAIN   wired cityhall sprite = (451, 383)
BANK      master cityhall sprite = (1724, 1744)
```

451 pixels is the pre-8/2 bake — from before Paolo's *"I want them TALLER. I want them
WIDER... BIGGEST AS FUCK"* pass. So the map had been drawing icons from **before** that
ruling, and before every icon fix made this week: the stadium's field, the basin's hole,
the police station's shield, the radio masts, the cemetery's reflecting pool. All of it
was in the bank. None of it was on the map.

**And `hero_wire_gate` was 143/143 green throughout**, because every one of its checks
asks whether *a* sprite is wired. Not one asked whether it was *the* sprite. A wire tool
that was never re-run looks exactly like one that was.

## AND WIRING IT AT BAKE SIZE WOULD HAVE SHIPPED 30 MB

The first run embedded the current masters at full size and took
`slices/BOHEMIA_CITY_TILES.js` from **29 MB to 58 MB** — a file the player downloads
before the map draws.

Then I measured what the map actually draws them at:

```
TW0 = 18                     the city view's tile width
zoomBounds() caps CZOOM at 2.6
18 x 2.6 = 47                the widest a hero is EVER drawn, in CSS pixels
```

**Forty-seven pixels.** On a 3x phone, ~141 device pixels. The wire was shipping a
1,748 px sprite to paint 47 — roughly 1,400 times the pixels anyone can resolve — sixty-
nine times over. Time-to-first-play is the known problem on the demo board, and this
would have been 30 MB of it, self-inflicted, in the same commit that fixed the icons.

The map copy is now resampled to **256 px** (1.8x headroom over the worst case) and the
whole set costs **2.83 MB**. The bake stays 1,748: the bank is the master and the judging
surfaces still show it full size. Only the map copy is resampled, which is what a mipmap
is and why every renderer has one.

Net against main: same file size, nine more districts, and current art instead of art
from three weeks ago.

Two constants died with it. `drawHero` derived the plate as `naturalWidth - 28`, where 28
is the two 14 px margins the bake leaves — **a number that is only correct at one sprite
size.** It now carries the measured plate per district (`HERO_PLATE`). And the wire
embeds `HERO_FROM`, a digest of the bank entry each map copy was resampled from, so
staleness is a thing a machine can see. `hero_wire_gate` recomputes it and fails by name.

## THE PART THAT NEARLY SHIPPED A BROKEN GAME

The tool regenerated its whole `/*HERO_WIRE_START*/ … /*HERO_WIRE_END*/` region:

```python
dec = re.sub(r"/\*HERO_WIRE_START\*/.*?/\*HERO_WIRE_END\*/\n", "", dec, flags=re.S)
```

That is fine exactly once. By 8/21 the block had **acquired 6,100 characters of other
lanes' work**: the 8/15 street-facing mirror (Paolo: *"recognize which direction a street
should be going... and make it face that way properly"*), `function overpassAt`, and a
`drawHero` that had grown a **third argument** for the flip.

Re-running the tool deleted all of it. The page threw
`ReferenceError: overpassAt is not defined`.

`walked_surface_gate` caught it — and it only caught it because I re-ran the gates after
my change instead of trusting the green I had ten minutes earlier. **My own commit
message from yesterday says the same thing about the same class of bug, and I still
nearly shipped it.**

### the rule that comes out of it

This is the **third time in two days** a patch tool has destroyed or split a region it
does not own. The furnish patch cut `bohemia_floorplan.js` in half; the interior-ground
patch inherited that bad anchor; now the hero wire ate a region other lanes had grown
into.

> **A patch tool may CREATE a region, and may UPDATE THE DECLARATIONS IT WRITES. It may
> never re-emit the whole region, because it cannot know what else has moved in since.**

The wire now edits `HERO_ANCH`, `HERO_PLATE` and `HERO_FROM` in place and swaps one
expression inside whatever `drawHero` it finds. The flip survives. `overpassAt` survives.
Anything a later lane adds survives. Running it three times in a row leaves the page
byte-identical and both gates green.

I also left a warning in `bohemia_city_furnish_patch.py`: its recovery fallback lands on
the old inside-the-module anchor when the page is already split, which perpetuates the
split silently. Measured, not assumed — I split a page artificially and ran it. It now
says so and names the tool that fixes it.

## THE MEASUREMENTS

```
hero wire        143 red -> 145 passed, 0 failed  (69 districts, 18 failures cleared)
wired art        451 px pre-8/2 masters -> current 1,724 px masters, resampled to 256
tiles file       58 MB (naive) -> 28 MB (resampled) -- same as main, 9 more districts
hero PNGs        2.83 MB for all 69
published        205 MB / 260 MB cap
walked surface   10/0   (caught the ReferenceError before it shipped)
```

Negative-controlled, both directions: faking one `HERO_FROM` digest turns the gate
144/1 and names `cityhall`; restoring returns 145/0.

## THE LESSON

**"Is it wired" and "is it the right thing wired" are different questions, and only one
of them was being asked.** A gate that checks presence will stay green through any amount
of staleness — and staleness is invisible, because the thing it shows you looks like art,
just not the art you made.

The tell was cheap and I nearly missed it: the wired sprite was 451 px and the master was
1,724. **Two numbers that should have been the same, in files nobody diffs.**
