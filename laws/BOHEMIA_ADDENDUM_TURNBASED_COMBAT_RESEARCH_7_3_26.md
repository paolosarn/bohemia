# BOHEMIA ADDENDUM: TURN-BASED COMBAT RESEARCH
7/3/26. Paolo asked for the big-brain pass on great turn-based combat and
what it buys Bohemia right now, pre-grid. Grounded in shipped games and
mapped to systems that already exist in the dial and the engine. Every
adoption is [PENDING, Paolo's call]; this file argues, it does not decide.

## WHAT THE DIAL ALREADY IS, named honestly
The Dead Eye Dial is a SKILL-SHOT turn resolver: the closest shipped
cousins are SteamWorld Heist (manual ricochet aiming inside a turn
structure) and the Mario RPG action-command lineage (timing inputs decide
outcome quality inside a turn). Bohemia's twist nobody else has: the 120
BPM grid making timing MUSICAL, and greed as a held-risk multiplier. The
research below is about the TURN SHELL around that resolver.

## THE FIVE LESSONS FROM THE GREATS

1. INTO THE BREACH: perfect information beats hidden rolls. Every enemy
   telegraphs exactly what it will do next turn; the player's turn is a
   puzzle of prevention. BOHEMIA MAPPING: the cover field already
   telegraphs (peek/fire states, now readable as posture and wash). The
   adoptable piece: show WHICH enemies will fire NEXT turn, not just who
   fires now. One icon or posture tell per enemy. Cheap, huge.
   [PENDING adoption]

2. XCOM: the two-action economy (move + act, or act twice) is the whole
   game, and OVERWATCH turns waiting into a weapon. BOHEMIA MAPPING:
   I MOVE YOU MOVE already is an action economy (a grid step IS the
   turn). When the grid lands, combat entry becomes spatial: enemies
   hold overwatch cones on tiles, crossing one triggers the dial as a
   REACTION shot with a harder package. Combat and city stop being
   separate modes; the street IS the encounter. [PENDING adoption]

3. DARKEST DUNGEON: position in the line decides which moves exist, and
   stress is a second health bar the player manages emotionally. BOHEMIA
   MAPPING: range already matters (point-blank vs far changes the dial
   window). The adoptable piece is DISTANCE AS THE POSITION SYSTEM:
   weapon families get range bands where their packages ease or harden
   (shotgun eats point-blank, rifle owns far), making repositioning a
   real turn choice once the grid lands. Stress maps naturally to the
   WOUND system already in the dial (the bleeding arm) rather than a new
   meter. [PENDING adoption]

4. DIVINITY ORIGINAL SIN: the battlefield itself is a weapon (surfaces,
   elements). BOHEMIA MAPPING: the tile DECAL layer from the grid brief
   is exactly this hook: blood slicks, fire, glass. The two-ledger twist
   nobody else can do: environmental kills are QUIETER on the recorded
   ledger than gunfire, so the battlefield becomes the off-ledger weapon.
   That is a Bohemia-only mechanic hiding in existing canon.
   [PENDING adoption]

5. FEAR AND HUNGER / FALLOUT VATS: targeting BODY PARTS makes every shot
   a decision, not a die roll. BOHEMIA MAPPING: the dial's zones already
   ARE body targeting (kill = head, vital = center mass, graze = limbs).
   The adoptable piece: make it explicit and visible: the zone map drawn
   ON the enemy silhouette during aim, since the enemy is now a real
   sprite with real anatomy. Reads instantly, costs one overlay.
   [PENDING adoption]

## THE ONE STRUCTURAL RECOMMENDATION
Everything above shares one spine: THE TURN IS A PROMISE. Great
turn-based combat shows the consequence before the commitment. The dial
already does this inside the shot (the needle, the ghosts, the greed
tell). The next layer of Bohemia combat should do it OUTSIDE the shot:
who fires next, what the tile costs, what the ledger hears. Same law,
three scales.

## BUILD ORDER IMPLIED (all pending the grid, none creative)
1. Next-turn telegraph icons (no grid needed, buildable now).
2. Zone map on the enemy silhouette during aim (no grid needed).
3. Grid lands, then: overwatch cones, range bands, decal surfaces.
