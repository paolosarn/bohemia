# BOHEMIA — I WENT TO SCHOOL, AND THE HOMEWORK CAME BACK ABOUT US (7/27/26)

Paolo: *"i need you to stop being ass and be a great art direction guy... go to
school for me for a couple turns and learn some laws brother."*

## THE SHORT VERSION

I learned the craft, wrote it down with its sources, then pointed it at our own
art. Our art fails it. Not slightly — categorically, and in a way that has a name
in the literature and an exact match to what Paolo has been saying with his own
eyes for two days.

## THE ONE SENTENCE THAT EXPLAINS EVERY REJECTION

From a writeup on why machine-made pixel art looks wrong:

> **"AI learned what pixel art looks like, but never learned what pixel art is.
> Most AI 'pixel art' generators are not really making pixel art at all — they
> generate a normal image in a pixel-ish style and shrink it down, which leaves
> you with blurry edges, stray colors..."**

Paolo, 7/26, looking at my target screen: *"it looks like hallucinated AI slop."*

He was not insulting me. He was **naming the exact failure mode**, correctly,
without having read any of this. And the thing I did on 7/26 was fix the symptoms
he pointed at one at a time — the door, the garage, the barrel, the lamp — while
the actual disease went unnamed and unmeasured.

## THE MEASUREMENT

`tools/bohemia_pixel_craft_audit.py`, run on our own frozen act-1 starter set:

| measure | ours | what the craft says |
|---|---|---|
| **orphan pixels** (a pixel touching nothing of its own colour) | **73.6% average, 99.6% worst** | *"responsible for the image looking noisy and confusing"*; the goal is "as few clusters as I can" |
| **colours in one 44x44 tile** | **up to 1610** (of 1936 pixels) | 4–7 values per material at this size |
| **colour regions per 1000 px** | **814** | a texture is *"a few simple clusters repeated over and over"* |
| **light direction agreement** | **14 of 38 tiles** agree with our own upper-left key | *"decide where your light is coming from before you begin"* |
| **pixel size consistency** | **clean — every tile block size 1** | one pixel size per scene, integer scaling only |

Read the ground tiles again: `concrete_0` is **99.6% orphan pixels**. Effectively
every single pixel in our roads, sidewalks and yards is a lone speck of a unique
colour. That is the definition of noise. It is not a look, and no amount of
fixing individual props was ever going to make it cohere.

Picture of it: `records/target/PIXEL_CRAFT_PROOF.png` — the tile as it ships, and
under it a map of every orphan pixel in red. Real pixel art is nearly black down
there. Ours is nearly solid red.

## WHAT I DID NOT DO, ON PURPOSE

**I did not re-cook anything.** The starter set is byte-locked by Paolo's CBB
verdict on the target screen. STOP PRODUCING is in force. A gate does not get to
overrule a verdict and neither do I — *"finding a legal way to ship anyway IS the
violation."* So:

- the frozen set is held to a **ratchet against its own measured baseline** (it
  may not get worse behind that verdict)
- the **real craft thresholds** apply to every bank registered from here on
- re-cooking the starter set is **[PENDING Paolo]**, and it is the one question
  this turn asks

That is also the honest reading of the doctrine's own tell: *"writing a fourth
version of anything means you already failed — stop and say so instead of fixing
the attempt."* I have now made five versions of a target screen. The fifth was
still built the wrong way. Stopping and saying so is the turn.

## THE LAWS

`laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md` — twelve laws, every one carrying its
source, and the ones I derived myself marked **[DERIVED]** so nobody mistakes my
opinion for the craft's. Headlines:

0. A tile is a decision per pixel, not a picture shrunk down
1. Pixels travel in groups — orphans are noise
2. A tile gets a ramp, not a spectrum; hue-shift the ramp
3. One staircase per line
4. Anti-alias inside, never on a silhouette that meets an unknown neighbour
5. Bands vary in width
6. No dither in act 1 (confirmed by the craft, unchanged)
7. One key, and a tile may not argue with it; pillow shading is shading with no direction
8. Material is a few shapes repeated, not every grain drawn
9. One pixel size in a scene, integer scaling only (the one we pass)
10. Silhouette first, shading last — and it must be nameable
11. **Uniformity beats realism** (the most useful sentence I found) + a door is a hole, not a picture of a door
12. Tile edges match without being identical; high-traffic tiles get 2–5 variants

## HOW HONEST THIS RESEARCH IS

Stated plainly because it matters: this environment's network policy blocks direct
page fetches — every attempt returned 403. Search worked. So the laws are built
from search-returned summaries of the primary sources, not from reading the pages
end to end. **Pixel Logic** by Michael Azzi is the standard book on this subject
and I could not open it. Buying it is a real backlog item, not something to fake.
The gate refuses to pass if the law file ever stops saying so.

## THE GATE

`gates/pixel_craft_gate.py`, 14 checks, registered in the suite. It holds the six
measures a machine can honestly hold, and it says in its own comment what it will
never do: overrule a verdict, or judge whether art looks good. Amendment B stands
— the gestalt is Paolo's, forever. These numbers only say whether a thing was
BUILT like pixel art. Art can pass all six and be ugly. It cannot fail them and
be pixel art.

## WHAT COMES AFTER

1. **[PENDING Paolo]** Re-cook the starter tile set as actual pixel art — real
   ramps, clustered material, one light. That is a new cook against a frozen
   verdict and it needs his word.
2. Buy Pixel Logic (~$9). It is the standard reference and I am working from
   summaries of it.
3. The 47-tile blob/Wang autotile pattern is the industry answer to tile
   transitions and we do not use it. Named, not built.
