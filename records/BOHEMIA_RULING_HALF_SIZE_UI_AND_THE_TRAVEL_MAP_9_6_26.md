# HALF-SIZE UI, AND THE TRAVEL MAP (Paolo 9/6/26, LOCKED)
# "For the run right now make all the UI 50% smaller, I don't give a fuck. And then
# I need a fast travel system extremely similar to Battle Brothers, OK I really
# need that, because the whole encounter system with groups of enemies is going to
# be included in there, and chance encounters and whatever."

## 1. THE UI IS HALVED. NOW. NO DISCUSSION.
Every piece of UI on the walked surface is FIFTY PERCENT SMALLER. He said "I don't
give a fuck", which means do not come back with a proposal, a comparison sheet or a
question about which elements. All of it, half. He looks at it and corrects what he
hates.
- The one thing that is not negotiable in the other direction: TAP TARGETS. UI just
  shipped [phone readable] with a 44 px minimum and a colour-blind pass. A control
  can be drawn half the size while its INVISIBLE touch area stays 44 px. Halve the
  pixels, never the reach. If a control cannot survive that, it shrinks anyway and
  the fact goes in the record for him to see.
- This is the walked surface (the RUN). Tabs, judge pages and tools are not in scope
  unless he says.

## 2. THE TRAVEL MAP: BATTLE BROTHERS, AND IT IS THE ENCOUNTER SYSTEM
He is not asking for a teleport menu. In his named reference, travel IS the
encounter system, and that is exactly why he needs it: the group fights we just
built have nowhere to come from. What the reference actually does, measured from
its own developer material:
- **Everyone moves on one map in pausable real time.** You are an icon among other
  icons. The layout is known from the start; what is hidden is who is out there.
- **Fog of war with a vision circle** around your party and around settlements.
  Other parties appear when they enter your sight.
- **Terrain hides people.** Forest (for us: the built-up blocks, the alleys, the
  ruins) makes a party harder to see, which is what makes ambush possible.
- **Night slows travel and shrinks your sight**, so night is when you get jumped.
- **Everyone leaves tracks**, and different factions leave different ones, so you
  can read at a glance who went through and follow them or avoid them.
- **Being chased depends on relative strength.** The weaker you look, the more
  likely they come for you. Breaking line of sight is how you escape.
- **A camp fire is seen from far away** and attracts company.
- **Parties are bought and sent by places with their own agendas**, so the map is
  populated by the world's own business, not by a spawner aimed at the player.
Sources: [BB dev blog: worldmap reveal and strategic gameplay](https://battlebrothersgame.com/blog-post-7-worldmap/),
[BB worldmap update: tracks, pursuit, line of sight](https://battlebrothersgame.com/worldmap-update-released/),
[BB dev blog 19: worldmap locations and the parties they buy](https://battlebrothersgame.com/dev-blog-19-on-worldmap-locations/),
[BB wiki: global map](https://battlebrothers.fandom.com/wiki/Global_Map),
[BB wiki: game mechanics](https://battlebrothers.fandom.com/wiki/Game_Mechanics).

## 3. WHAT WE ALREADY HAVE, SO NOBODY BUILDS IT TWICE
- A map with travel on it, and road interrupts that fire on map travel (RUN).
- Factions that hold ground, seats, and act1/act3 power (FACTIONS).
- Hostile bodies, a fight that starts where you stand, and a group fight on
  house-sized tiles (RUN, COMBAT).
- Standing, so the world already knows how strong you look to somebody.
- The day and night clock, and the valley's stocks running down.
The missing piece is PARTIES THAT MOVE ON THE MAP WITH THEIR OWN BUSINESS, plus
sight, tracks and pursuit. That is the job.

## 4. THE ONE THING WE MUST NOT COPY
BB's reference is the CAMPAIGN LAYER only (9/5 law: a reference game belongs to one
department). Nothing here touches how a fight plays; that is RF4 on the beat and it
is not up for revision.

## ROUTED
- UI [half size]: everything on the walked surface at 50%, touch areas kept.
- RUN [travel map]: the map you move on, with fog, sight, night and tracks.
- WORLD [parties move]: groups with their own agendas, bought and sent by places.
- COMBAT [contact fight]: touching a hostile party on the map starts the group
  fight, and relative strength decides who chases whom.
