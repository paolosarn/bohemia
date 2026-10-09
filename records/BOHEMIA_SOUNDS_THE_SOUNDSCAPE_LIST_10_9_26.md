# THE SOUNDSCAPE LIST (SOUNDS, 10/9, row [the soundscape], rule 80a)

Paolo, 10/9, with VAMILY: "there's so many sounds in Battle Brothers, from ambience to
when you're in the city and you're in the clinking of someone making disorder... we're
not even touching the surface." ('the clinking of someone making disorder' = the smith's
hammer, the armourer at work.)

The row's own FIRST step asks for "the list before the sounds," with Grok ask 23's
catalogue of every Battle Brothers sound as the floor. **Grok ask 23 has not landed yet**
(checked reference/library/grok/ and reference/BOHEMIA_GROK_ASKS.md fresh: ask 23 is
queued, no GROK_NNN_ASK_23 file exists). Per rule 12 (a dependency on a line is a premise,
not a gate), this list is built now from what is actually measurable: our own screens and
buildings, this lane's own already-shipped sound bank, and Battle Brothers' own named,
approved design (rule 54a: BB is already a named reference for the campaign layer, so
citing its public, well-known sound design is not "a game he has not named"). When ask 23
lands it is the floor to re-check this list against, not a blocker to building it.

Every row below: SCREEN/BUILDING | WHAT PLAYS TODAY | GAP | REAL MATERIAL FOR THE GAP.
"How loud under the song" is given wherever a real number already exists (AMB_TRIM,
ROOM.REL, NIGHT_TRIM); everything else has no number yet because nothing plays yet.

## TITLE
Plays today: nothing. Cooked, not wired: titleTheme (the detuned theme, round one of [the
title's music], 10/5) -- unjudged = silent, waiting on his vote.
Gap: the theme is built and simply has no door yet; once voted, RUN wires it to the title
screen and hands off to the map's song on NEW GAME/CONTINUE (this row's own NEXT item).

## MAP (by ground and hour)
Plays today: the ambience bed (wind_gust, generator, dog_far, sign_alive) on both the RUN
and MAP tabs (round two of [the map's sounds], 10/5); the city's one music bus.
Cooked, not wired: travelRoadBed, travelDirtBed, nightInsects (round one of [the map's
sounds]) -- wired to nothing because the map frame posts no travel state to hang them on
yet (RUN's [the map hears], still OPEN).
Gap: the party's own footsteps on the road, arriving at a settlement (a dog, a generator),
the fight's approach -- all built, all waiting on RUN's bridge.
Real material: already built, see above; nothing new needed here.

## SETTLEMENT (by tier and trait)
Plays today: the clinic's door_open/door_shut, quieter at night (NIGHT_TRIM 0.5, round two
of [the settlement's sounds], 10/9); the wardrobe's 'equip' on the roster screen (wired
live THIS round, see below -- technically its own screen, grouped here for his words).
Cooked, not wired, waiting on his vote: barberClippers, canOnWood (the stall's can),
boardNail, paperRustle (the posts), smithHammer, armourerRivets (both NEW this round).
Gap, named plainly, standing lane limitation: the bar's murmur (a voice; this lane's whole
palette is struck, resonant and particle material).
Gap, not yet cooked: a sound on BUYING at the stall, the smith or the armourer -- checked
the file fresh, post('buy', ...) only posts a state message, no sfx call at all. Named for
a future round, not built this round to keep this round's batch honest.
Real material for the gaps: covered above; for the buy gap, a coin/battery-cell clink is
the obvious real object and is unbuilt.

## MARKET / SHOPS (smith, armourer, stall)
Same screen as settlement above in this codebase (no separate market file); see its row.
Battle Brothers' own shop sound (a bell or a till) has no equivalent yet; see the buy gap.

## BAG / ROSTER
Plays today, as of this round: 'equip' ("CLOTHES GO ON") on wearing or removing gear --
already an approved, frozen bank event that nothing on slices/BOHEMIA_ROSTER_SCREEN.html
ever posted until this round. Zero new content, wired live, no vote needed (same precedent
as the clinic's door): gates/roster_screen_gate.js new claim, 13/0.
Gap: none left that this lane can see on this screen; dragging a man between the lines
plays nothing, which may be fine (silent reordering, not an object touched).

## FIGHT (by board kind)
Plays today: shot, swing_air, hit, melee_hit, vital, hurt, miss, kill, went_down, clear --
all ten wired through the fight's own sfx() bridge (round two of [one song and the
volumes], 10/4).
Cooked, not wired: endTurnClick (sounds-the-turn-closes-10-4) -- UNJUDGED, not DOWN (checked
the registry's verdicts fresh: no verdict recorded either way), so it waits on his vote same
as every other new sound, not on a rejection.
Gap: none of the ten named moments are silent; what Battle Brothers adds beyond this (armour
deflecting differently from a bare hit, a shield block, a weapon-specific swing) is real and
uncooked, named for the jump list, not this round's batch.

## RECAP
Plays today: 'clear' on open ("the fight is over, the room goes quiet").
Gap: none named by him yet.

## HOME / CITY (the walked street, RUN tab)
Plays today: the same ambience bed as the map (wind_gust, generator, dog_far, sign_alive),
the street's one music source, the valley's broadcast (theBroadcast, cooked, wired to
nothing live yet -- no live instance exists for it to attach to).
Gap: named by this lane every round since round two of [one song and the volumes]; nothing
new to add here this round.

## WHAT THIS ROUND ADDS
Two new cooked sounds, settlement-first as the row asks (he hears it most): smithHammer (an
anvil's own low, short ring, the free-free bar series struckMetal already uses for a held
pipe, lower and far shorter because the mass is a bolted anvil, not a thing held in a hand)
and armourerRivets (the same tiny, stiff pipe mode boardNail already uses for a tack, raised
higher, struck four times at a rivet gun's own working cadence). Both REUSE-FIRST, zero new
engine math beyond the two wrapper functions. One live wire, zero new content: the bag
screen's 'equip' sound, already approved and never posted until now.

## NEXT, IN ORDER
1. Re-check this list against Grok ask 23's catalogue once it lands (the floor this list was
   built ahead of).
2. The buy sound at the stall/smith/armourer (named, not built, this round).
3. Continue cooking the settlement's remaining named sounds once a vote frees them to wire
   live, then move to the market, the bag and the fight's own still-thin spots.
