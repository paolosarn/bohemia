# WHY YOU CAN STAND STILL AND KILL EVERYBODY

Paolo 8/8: "combat as a hole is like 25% done and searching rogue fable four
like you know when you play that there's a lot of movement in this floors go
deeper deeper the dungeon and explore the floor you know right now kinda just
feels like I could stand still and kill everybody right now it's kind of weird"

He is right, it is structural, and it is measurable. This is the diagnosis
before anything gets rebuilt, because the fix is an architecture decision and
that is his to make.

---------------------------------------------------------------------------
## THE MEASUREMENT: MOVING IS A COIN FLIP THAT USUALLY DOES NOTHING

220 arenas, 8 guns alive in each, every one of the 8 possible steps evaluated:

    covered from, where you spawn ............ 2.51 of 8 guns
    covered from, at the best adjacent tile .. 3.41 of 8 guns

    steps that IMPROVE your cover ............ 21.8%
    steps that CHANGE NOTHING ................ 55.8%
    steps that MAKE IT WORSE ................. 22.4%

**THE ENTIRE UPSIDE OF MOVING IS ABOUT ONE GUN'S WORTH OF COVER**, and it is a
22% chance of gaining it against a 22% chance of losing it. Expected value is
approximately zero.

AND THE PLAYER CANNOT TELL THE TWO APART. Nothing on screen distinguishes a
good tile from a bad one before you commit. So even the 21.8% is not available
as a decision -- it is a lottery.

**Standing still is not him playing badly. It is correct play.** A rational
player facing a zero-EV, unreadable, stamina-costing action does not take it.

---------------------------------------------------------------------------
## WHAT ROGUE FABLE IV DOES, IN ITS DESIGNER'S OWN WORDS

He named the reference, so I went to its design notes rather than guessing.

**1. IT DELETED THE THING BOHEMIA IS BUILT ON.**
> "Bump to attack and trading basic attacks with enemies is effectively
> nonexistent."

Bohemia's fight IS a trade: you pop, you shoot, they shoot back, repeat. That
exchange is the whole loop. RF4 identified trading as the thing that makes
combat static and removed it outright.

**2. ITS ANTI-DOMINANCE RULE.**
> "The developer intentionally nerfs or removes any ability or action that is
> effective in too many situations, since the more heavily the player can rely
> on a single action for success the less other actions he needs to use and this
> reduces the amount of tactics in the game."

SHOOT-FROM-COVER IS EFFECTIVE IN EVERY SITUATION IN BOHEMIA. By RF4's own rule
that single fact is sufficient to explain a static fight, regardless of how many
verbs exist alongside it. We have RUN, vault, suppress, hand-peek, grenades,
stairs -- and none of them are ever *necessary*.

**3. TWO KINDS OF MOVEMENT, NOT ONE.**
> "Movement to kite away is separate from movement to get into position to
> attack."

Bohemia has one kind: reposition. There is no kiting because nothing chases hard
enough to flee from, and no approach because range costs you nothing to ignore.

**4. THE ENVIRONMENT IS A CONSTANT FACTOR.**
> "dozens of unique terrain effects, traps, clouds and magical auras, with
> different types of cover, choke points and open spaces"

Bohemia has ONE terrain vocabulary: a pillar you are behind or not behind. No
choke points, no hazards, no reason to prefer one part of the lot over another.
That is why the best tile is worth only one gun.

**AND THE FILE ALREADY KNEW.** v74 cites this exact game:
> "Rogue Fable IV's ideal is that 'you should be in a state of near constant
> motion' and that player SKILL matters more than stats."
The citation landed; the lesson did not. We made movement FREE (v74) and cheap
(v122's RUN) without ever making it WORTH ANYTHING.

---------------------------------------------------------------------------
## THE THREE THINGS THAT WOULD ACTUALLY CHANGE IT

Ranked by how much they attack the root, not by how easy they are. NONE ARE
BUILT. This is the fork, and it is his call.

### A. THE FLOOR IS BIGGER THAN THE FIGHT  (his own words: "floors go deeper")
Today the arena IS the encounter: one lot, everyone visible, fight until dead.
Nothing is anywhere else. If the fight sits on a floor you move THROUGH --
rooms, a way in and a way on, enemies you have not met yet -- then movement gets
its purpose back for free, because there is somewhere to be that is not here.
This is the biggest change and the closest to what he described. It reframes
combat from an arena into a place.

### B. KILL THE TRADE  (RF4's actual core move)
Make popping out of cover to shoot NOT the answer to every situation. The
levers already exist and are all currently toothless: return fire is survivable,
so trading is fine; being exposed costs a dial penalty rather than your life;
and no enemy forces you off a tile. Anything that makes ONE spot untenable --
suppression that pins, a melee closer you cannot ignore, a grenade that lands
where you are standing -- converts standing still from optimal to fatal.

### C. MAKE POSITION READABLE AND WORTH MORE
The 21.8% is invisible, which means it is not a tactic. If the field showed
which tiles are covered from whom BEFORE you commit, the existing geometry
becomes playable immediately. And if cover swung 3-4 guns instead of 1, the
decision would be worth making. This is the cheapest of the three and the least
transformative -- it makes the current fight legible rather than making it a
different fight.

---------------------------------------------------------------------------
## WHAT I AM NOT DOING

NOT BUILDING ANY OF THEM YET. "Combat is 25% done" plus a named reference plus
"floors go deeper" is a direction, not a spec, and the last time I turned a
direction into a finished implementation without asking what shape he wanted, he
called it dogshit on sight and it went in the graveyard. The three above are
genuinely different games. He picks.

AND THE GRENADE MINIGAME IS PARKED at his instruction ("I don't wanna get stuck
on this grenade mini game or work on it later").
