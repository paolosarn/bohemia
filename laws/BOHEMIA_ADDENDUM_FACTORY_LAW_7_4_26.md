# BOHEMIA ADDENDUM — FACTORY LAW (7/4/26, LOCKED CANON, Paolo)

## THE LAW
Everything built into this engine is a FACTORY, never a one-off. Every new
system, every new menu, every new asset class is a mass-production line that
stamps out volume from parameters. If a thing exists once, the factory that
makes a thousand of it must exist too. One-offs are banned.

## WHY
The game is huge: three dynasty generations, ~100 years of rebuild, three Acts
worth of terrain/buildings/roads, 14 factions of music, mass-produced
hairstyles, clothing, enemy archetypes, props. Hand-making each asset does not
scale. Paolo is creative director and sets the DIRECTION; the factory PRODUCES
the volume. This is already how the engine works and it is now law for
everything new.

## WHAT A FACTORY MEANS (the required shape of every new system)
1. PARAMETERS IN: a small typed spec (data structure) describes ONE instance.
   Not pixels, not hand-placement. Numbers, tags, enums.
2. GENERATOR: code that turns a spec (or a random/seeded spec) into a finished
   asset at the game's real fidelity (Scale2x/EPX, palette-locked, on the grid).
3. VOLUME: the generator runs in batches. One call makes N variations.
4. TAGGING / METADATA: each output carries its tags (tier, category, cover-type,
   act, faction, etc.) so the game can POOL and pick from it later.
5. KILL / APPROVE PIPELINE: every batch is judged. Thumbs up = canon, thumbs
   down = graveyard with a post-mortem. Same verdict workflow as music + juice.
   Nothing ships to the game unjudged.
6. GATES: the factory has its own regression check (like golden frames / smoke /
   parity) so a batch can't silently break.

## FACTORIES THAT ALREADY EXIST (the pattern to copy)
- MUSIC: synthV voice bank (383 voices) + FACTIONS/MLOOPS specs -> the studio +
  combat engine stamp every faction song and vibe from parameters. Dual-rank
  tiers + vibe categories + MUS.pool()/pickFromPool() = the pooling metadata.
  SONG2_VER remake counter = versioned batch replacement. mm shortcut = batch
  judge command.
- CHARACTER: the Skinner + rig + garment layers bake a person from specs
  (body/hair/clothing/tints/skin ramp) across 8 dirs + all clips. NPCFactory
  bakes 8 randomized enemy looks. HAIR_COVER_TYPE = per-style coverage tag for
  mass-producing hairstyles.
- ENEMIES: ARCH archetypes (hp/armor/acc/dmg/melee flag) -> makeEnemy stamps
  combatants from a spec; demo spawn layouts roll placement.
- DIAL: 52 Dead Eye patterns with difficulty tiers + package system.

## THE LAW APPLIED TO WHAT'S NEXT
Every one of these ships AS A FACTORY, each with a spec, a generator, batch
output, tagging, and a kill/approve pass:
- MENU(S): whatever a menu is, it's a menu factory (a menu spec -> generated
  screen). New menus stamp from the same line.
- TERRAIN: a terrain-tile factory. Spec in, tiles out, tagged by Act (x3
  versions) + biome. Animal-view tile AND its pulled-out city-view read.
- BUILDINGS: a building factory. Spec -> structure, x3 Act versions, animal +
  city view.
- ROADS: a road factory. Spec -> segment/connector set, x3 Act versions, animal
  + city view.
- PROPS / CLOTHING / HAIRSTYLES: production lines off their specs, tagged.
- All three (terrain/buildings/roads) run the zoomed-in animal-view kill/approve
  thumbs pipeline, and each approved asset carries its city-view representation.

## NOT A CREATIVE CALL
The factory is plumbing + production. Paolo still DECIDES every direction (look,
vibe, palette, which batch members are canon). The factory just makes it
possible to give him a hundred to judge instead of one. [Any direction not yet
set = PENDING Paolo's call, as always.]
