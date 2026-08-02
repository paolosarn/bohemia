# BOHEMIA ADDENDUM — REPAIR A DISTRICT AND PEOPLE MOVE IN (Paolo 8/1/26)

Paolo, verbatim:

> "I'll be introducing game mode ideas where when you fully repair a district
> kind of like let's say Stardew Valley like you get rid of all the junk cars and
> make sure the electricity is on solar panels everywhere. It will be a very big
> undertaking. No doubt you can't just complete it like first day in the game,
> but let's just say that then like more people will want to move in and live in
> the recovered ruins you know maybe we'll be like towards the end or middle end
> of act one or something that you'll be able to fully do this but yeah"

STATUS: **DIRECTION, not yet locked.** He said "I'll be introducing" and "let's
just say" — this is him telling the fleet where the city-builder half is going,
not commissioning it. Recorded now because it is the first concrete statement of
a payoff loop the coordinator called the single largest undesigned system in the
game (THE BIG MISSING, item 2: "the city-builder half is lore, not gameplay").

## THE SHAPE OF IT

1. **A district is a repairable object.** Clear the junk cars, get the power on,
   solar panels everywhere.
2. **It is a big undertaking.** Not a first-day task. Middle-to-end of Act 1
   before a whole district can be finished.
3. **THE PAYOFF IS PEOPLE.** More people want to move in and live in the
   recovered ruins. Population is the score.

That third clause is the important one and it is new: it makes population a
CONSEQUENCE OF PLAY rather than a number in a config. Every other lever in the
game so far is something a designer types. This one the player earns.

## GROUNDED IN THE REAL, and it says he is right

Studies of 63 post-disaster infrastructure recoveries find that returning
population is contingent on critical service provision — electricity, potable
water, sanitation — and that those systems are mutually interdependent. People
come back when the lights and the taps work. Japan's post-2011 recovery
prioritised exactly this and repopulated faster where it landed first.

So "fix the power, people come back" is not a game conceit. It is what actually
happens, and the game gets to be honest and satisfying at the same time.

## THE HOLES, pulled rather than smoothed over

**1. WATER IS MISSING FROM HIS LIST AND IT IS AS BIG AS POWER.** He named junk
cars, electricity, solar. The research puts potable water and sanitation level
with electricity, and Bohemia's own GDD already calls water "THE survival event"
— cities that lose sewage die of cholera in months, and the valley's canon has
Intake 3 and the reclaim plant kept running for exactly that reason. A district
with power and no water should not repopulate. **Is water part of a full repair?**

**2. WHERE DO THE NEW PEOPLE COME FROM?** The valley holds ~1,100 survivors
(measured 8/1). If a repaired district gains fifty, did fifty walk in from
outside the map, or did fifty leave somewhere else? Both are legitimate and they
are completely different games: one is growth, the other is a zero-sum tug of war
between districts. **The zero-sum version is the more interesting one** and it
costs nothing extra to build, but it is his call.

**3. CAN IT GO BACKWARDS?** If the player stops maintaining a district — or a
faction cuts the power — do the people leave again? A one-way ratchet is simpler;
a reversible one gives the world teeth and gives raiders something worth doing.

**4. WHAT STOPS IT BEING A CHORE?** Stardew's Community Center works because each
bundle is small and the reward is immediate and visible. "Clear every junk car in
a district" is a big flat list. The thing that keeps it alive is probably
PARTIAL CREDIT — power on gets you some people, water gets you more — rather than
one all-or-nothing completion. He said "fully repair", so this may already be
answered as all-or-nothing; flagging it because the difference decides whether it
feels like Stardew or like homework.

**5. IT COLLIDES WITH THE ZONE MAP.** His 7/29 ruling says population lands as
clusters AND no man's lands, from the valley's food carrying capacity. If repair
adds people, does a repaired no-man's-land become a cluster — and does the
carrying capacity still cap it? A valley that can be repaired past what it can
feed is a different world from one that cannot.

## WHAT WAS BUILT FOR IT TODAY (mechanism only, no content)

`bohemia_population` gained a PER-DISTRICT dial on top of the global one:

    cellDial(x,y) / setCellDial(x,y,v) / dialAt(x,y) / clearCellDials()

One cell can now be more populated than its neighbours, which is the whole
mechanical requirement of his idea. Measured: repairing one cell moved it from 3
people to 10 while the cell next door stayed at 0. The global dial still wins at
zero, so a ghost valley is still a ghost valley however much you repaired.

`REPAIR_WORTH` — what counts as repaired and how much population each repair is
worth — **SHIPS EMPTY AND STAYS EMPTY.** That table is the design, and the design
is his. No session may decide that hauling ten junk cars is worth thirty people.

## WHAT IS NOT BUILT, DELIBERATELY
No repair tracking, no junk-car counter, no completion state, no UI. Those are
the city-builder half and they need his design first. This is the socket the idea
plugs into, nothing more.

## SOURCES
- Post-disaster infrastructure restoration: a comparison of events for future
  planning (63 recoveries, global median recovery curves)
- Resilience-driven post-disaster restoration of interdependent infrastructure
  systems
