# BOHEMIA ADDENDUM — THE BUILDING IS THE ICON
**8/2/26. LOCKED. Machine: `gates/big_icons_gate.py`.**

> "the city builder vibe is supposed to be... **more of a visual than it being 100%
> realistic**... my biggest concern right now is that all these icons **they're a little
> too small. I want them taller. I want them wider.** I want them to be able to be more
> viewable from the city builder menu — you know in Pocket City 2 you can see the building
> even if it's on the other [side]... if we from all the icons, we **remove all the parking
> lots** cause I honestly I'm not really fucking with that anymore. I just really want the
> **main building to be biggest as fuck**. I understand some things are gonna be like a
> composition of a couple buildings but that's OK — it just needs to **fill up the square**."
> — Paolo, 8/2/26

---

## THE LAW

**THE BUILDING IS THE ICON.** Not the plot it stands on. Not its parking. The icon is a
**portrait of the building**, framed like one, and the building fills the square.

1. **NO PARKING IN ANY ICON.** Lots and driveways are gone from all 28. At map zoom asphalt
   is a grey smear that tells you nothing about what a building is, and it was eating a
   third of every square.
2. **THE PAD IS FITTED TO THE BUILDING, never declared by hand.** Every builder used to pass
   a plot rectangle it guessed at — usually `(-3,-3,15,15)` regardless of what it actually
   built — so the sprite framed on the *guess* and the building sat small in the middle of
   it. The pad is drawn **after** the scene exists now, hugging the real footprint.
3. **TALLER AND WIDER.** Buildings carry their real storey counts, and the frame is tight.
4. **A COMPOSITION IS FINE.** "Some things are gonna be a composition of a couple buildings
   and that's OK." Ancillary pieces stay — they just hug the building instead of sprawling
   beside it.
5. **THE VIBE IS A CITY BUILDER, NOT A SURVEY.** It still matches the walkable district —
   same palette, same parts, same reference — but it is a *visual*, and legibility at map
   zoom beats site-plan accuracy every time they disagree.

## WHAT REMOVING THE PARKING COST, AND WHO PAID IT

The asphalt was doing work nobody had noticed: **it was carrying silhouette variety.** With
the lots gone and the frame tight, seven pairs of districts collapsed into lookalikes at
16×16 — commercial/school, park/storage, solar/swapmeet, rail/solar, battery/park,
downtown/park, park/speedway.

**The fix was never to add the asphalt back.** Each district got **the one vertical it
actually has**, which is also exactly what "taller" asked for:

| district | its vertical |
|---|---|
| school | the stair core over the entrance, and the gym at full height |
| storage | the office — the only tall thing on a self-storage lot |
| solar | the switchgear stack |
| rail | the wayside signal mast |
| commercial | the pylon sign — what a power centre is known by |
| park | a stand of big dead crowns. A park's silhouette is its **trees**; light masts made it a twin of the speedway |

**SILHOUETTE DEBT: 13 → 2.** Only `storage/warehouse` (rows of units against rows of units)
and `swapmeet/truckstop` remain.

## THE PATTERN, A FOURTH TIME

The hand-passed plot rectangle is the same bug as the hand-passed door plane, the hand-passed
window fraction, and the hand-passed prism cap: **a value passed by hand where a value could
be DERIVED.** Four different symptoms, one cause, all four found by him and not by me.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins. Indexed in
`BOHEMIA_CANON_INDEX` and in `laws/BOHEMIA_PAOLO_FEEDBACK_MASTER.md`.*
