# BOHEMIA — ADDENDUM: THE SUCCESSION SYSTEM + BUNKER GUY QUEST
*7.1.26 — locks Bohemia's SIGNATURE MECHANIC (the world routes around the body across generations) and the first grounded quest line. Extends Persistent Consequence & Mayor addendum, the Entities/delta model, and the generational fold.*

---

## 1. THE SUCCESSION SYSTEM — BOHEMIA'S SIGNATURE MECHANIC (LOCKED)

**What it is:** you can kill or remove anyone (already locked, GDD combat canon: nobody is plot-armored). When you do, the world does NOT freeze or silently reassign, it runs a POWER STRUGGLE to fill the vacancy, and the struggle plays out over REAL TIME (turns, even decades), resolving on the LOD forward-compute while you're elsewhere. Who wins depends on faction standing, economics, and everything else you've done. Society survived the apocalypse but CHANGED, and it keeps changing around the holes you tear in it.

**Why it's nobody else's (researched this session):**
- The Nemesis System (Shadow of Mordor) is PATENTED by Warner Bros through 2036, and it's a fast-combat enemy-memory toy: its own critics note "the best players get the least out of it" because if you kill the orc instantly he never comes back changed. Bohemia is the OPPOSITE, slow, turn-based, 100 years, so it's the perfect home for the reactive-world idea Nemesis couldn't fully use, because we have the one thing it lacked: TIME for consequence to compound. Kill a faction's fixer in gen 1 and the hole is still shaping who your grandkid deals with in gen 3.
- Bohemia's version is not an enemy-army hierarchy, it's a whole SOCIETY reorganizing around vacancies across generations, driven by faction economics and roles, not personal grudges. Different animal. That difference is the moat. Paolo is interested in self-patenting this (provisional application + a real patent attorney is the move; dated design docs like this one support a priority date; Claude is not a lawyer, this is not legal advice).

**The architecture (three proven pieces stacked, researched this session):**
1. **Roles, not NPC-pointers (Bethesda alias model).** A thread/role stores REQUIREMENTS + conditions, not a hardcoded person. Actors get matched into roles at runtime. Killing one writes a delta (corpse-delta system already built); the role re-queries. This is what prevents soft-locks.
2. **Vacancy = a contested EVENT with a winner (Nemesis insight).** Filling a role isn't silent reassignment, it's a power struggle. Kill the moderate leader and the vacuum might get filled by a hardliner who now hates you, or the faction fractures, or a rival faction absorbs its territory.
3. **The generational fold makes it MATTER.** The succession echoes for 100 years. The routing and the endgame ("kill-everything endpoint" where the world runs out of people to send and just stops) are the SAME system.

**Anti-soft-lock rule (from the research):** a role with no fallback and no closed-state is a soft-lock generator (Skyrim's radiant quests literally ship with this bug). Bohemia requires BOTH: a fallback path (roles try living NPCs first, can pull a spawned replacement over time IF the faction still has bodies to send, Dwarf Fortress migrant logic) AND a graceful closed-state (when a faction is bled dry enough that nobody can fill a role, the thread CLOSES with a consequence ripple, never an error, and that closure IS the kill-everything endpoint expressed locally).

**Timing (LOCKED, Paolo):** the struggle PLAYS OUT over time, not instant. The crazy story consequences intentionally bloom in decade 2 and 3, because that's when the holes you tore have festered into new power. Fused-consequence system (Camera/Timestep addendum) drives the reveal: the struggle has a fuse, warns you, and zooms in when it resolves.

**Julius/Augustus framing (Paolo):** the ambition is that gen 2 can be greater than gen 1 the way Augustus surpassed Julius, by inheriting the unfinished work and consequences and not squandering them. Do something better than Julius Caesar. The life-lesson: the people who finish the work are rarely the ones who started it; greatness is often inheriting a mess and not wasting it.

## OPEN FORKS (Paolo's call)
- Does a CLOSED/failed thread ever REOPEN if a faction recovers over a generation? (permanent-delta vs fold-aware). Bohemia is 100 years, so a thread that hard-closes in gen 1 could feel dead forever, OR be exactly the thing a grandchild reopens when the faction rebuilds. Changes whether threads are permanent-delta or fold-aware.
- Can roles pull a SPAWNED replacement, or only be filled by NPCs already alive? (Leaning: both + graceful closed-state, ties to kill-everything endpoint.)

---

## 2. THE BUNKER GUY QUEST — the "why no nukes" explainer (LOCKED, recorded 7.1.26)

**The character:** a rough, seen-it-all realist. Chilling, no drama.

**What he explains (diegetic delivery of core canon: the apocalypse was ECONOMIC, not nuclear):** his logic, roughly, "you think the Chinese wanna die? you think the Russians don't wanna live anymore either? Even North Korea couldn't destroy the whole world, and nobody would support North Korea." Grounded real geopolitics, mutually-assured-survival instinct is exactly why the collapse came economic, not nuclear. This lets a CHARACTER carry the premise instead of a lore dump.

**The twist / the sad beat:** he then shows you his BUNKER, a failed investment, built for an apocalypse that came in a form he never predicted. He's fine, he's chilling, but the bunker is pointless now and it quietly makes him sad.

**The life-lesson (never preached):** people armor against the dramatic disaster they imagine and get blindsided by the slow quiet one that actually arrives. He prepped for fire and drowned instead.

**Why it's load-bearing:** it's how the game explains its own founding premise (economic-not-nuclear apocalypse) through a person, grounded, a little funny, a little sad, and it teaches the world's rules without a wiki page.

**[PENDING Paolo:** where he sits (which district/act), his name, whether this is a standalone side quest or ties into a faction, and whether the bunker becomes a usable location afterward.]

---
*Status: Succession system LOCKED in architecture (build pending). Bunker Guy LOCKED in concept (placement/name pending).*
