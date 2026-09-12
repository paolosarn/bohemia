# THE CASINO HAS NO BACK (9/13/26, WORLD lane) — board row [back of house]

Ship: `engine/bohemia_backhouse.js` (new), `engine/bohemia_floorplan.js` (the dry
store), `engine/bohemia_work.js` (the room decides), the walked surface, and
`gates/back_of_house_gate.js` (38 checks, registered as **BACK OF HOUSE**).
Tab: **CITY**, inside any building, on the work button. Also in the demo.

---

## THE ROW, HARVESTED FROM ECONOMY ROUND 6

> "Our own economy module has said since 7/19 that downtown matters for its 'deep
> casino/resort dry stores', and there is no dry store, no laundry, no boiler, no
> loading dock in any building in this game. Every job the city offers happens in a
> room that does not exist. Build the back of house as a real place you can enter,
> work in, and steal from. **Needs COOK for the rooms.**"

## MEASURED FIRST, AND THE ROW IS HALF WRONG IN THE MOST USEFUL WAY

**The rooms exist.** `bohemia_floorplan` generates twelve zones of real rooms. A
casino is zone `leisure` and already laid out concourse, counter, kitchen, locker,
restroom and service. A shop already gets a **stockroom**. A warehouse already gets
a **dock**. `bohemia_furnish` already fills a stockroom wall to wall with racking
and pallet stacks. 67 tiles across the engine declare an `enter` line and the walked
surface reads them, so you could already go in.

**So "needs COOK for the rooms" is not true**, and front-page rule 12 says measure a
named blocker rather than wait on it. The rooms are generated and furnished by
**code**. Not one piece of art was needed for this row.

## WHAT WAS REALLY MISSING WAS TWO THINGS

**ONE: the one room the economy asks for by name was the one room it never got.**
`bohemia_economy`'s header, since 7/19: *"deep casino/resort dry stores — THE reason
downtown matters."* `leisure` was the goods-heavy zone with no store in its list.

It has one now, and it is the **stockroom that already existed** — already assigned
to retail, already furnished. REUSE-FIRST: a new name would have been a new thing to
draw, and that is the only thing that would have needed COOK.

**TWO, and this is the whole row: nothing that pays you could see any room at all.**

```
bohemia_economy.YIELD = { site: {salvage:3.0, ...}, scav: {salvage:1.2, ...} }
bohemia_work          — zero occurrences of "room", "zone" or "interior"
```

Two flat numbers, and the room never entered the arithmetic. **A sweep through the
back of a casino paid exactly what a sweep across a car park paid.** Every interior
in the valley — built, furnished, walkable — was invisible to the only thing that
rewards you for being in it.

That is what "every job the city offers happens in a room that does not exist"
really meant: not that the room is missing, but that **nothing could see it**.

## THE FIX INVENTS NO NUMBER, BECAUSE THE GAME ALREADY RULED THIS

The economy has exactly two kinds of work and already says what separates them: SITE
is working a real place that holds something, SCAV is sweeping. That difference is
already 3.0 against 1.2, already untuned, and already his.

**A DRY STORE IS A SITE. A CONCOURSE IS NOT.**

So the room decides **which of the two kinds the economy already has**, and no third
number is introduced anywhere. And the room wins **both ways**: a dry store on a
nothing block is still a site, a casino concourse on a job district is still a sweep.

## WHICH ROOMS HOLD GOODS IS DERIVED, NOT LISTED

`bohemia_furnish` already says what is in every room, in its own vocabulary. A room
holds goods when the game already puts **racking, pallet stacks or a fridge** in it.

A list typed in the module would be a second opinion about the same fact and would
be wrong the day somebody adds a room. The gate proves the join by **emptying the
furniture out of a stockroom and watching it stop holding goods.**

Six rooms qualify today, all derived: `dock, floor_open, kitchen, records, service,
stockroom`.

## MEASURED END TO END, INSIDE A REAL CASINO

```
entered: "the casino floor: dark, stripped, carpet lifting, banks of dead
          machines pushed into rows"     zone leisure, 61 rooms

  concourse  -> scav
  counter    -> scav
  locker     -> scav
  restroom   -> scav
  kitchen    -> site   the kitchen, and whatever is left in the cold store
  service    -> site   the service room behind the floor
  stockroom  -> site   the dry store, racking still stacked

THE BUTTON:  "WORK · 8H · THE DRY STORE, RACKING STILL STACKED"
in a concourse: "SCAVENGE · 8H"
```

## AND THE FIRST RUN OF THAT PROBE HAD NO DRY STORE IN IT

I added the room to `bohemia_floorplan.js` and the casino came back without one. The
walked surface carries its **own inlined copy** of every engine module, and my
splicer only re-inlines the nine modules it owns — the floorplan is kept fresh by
the engine resync. **A source edit is not a shipped edit on this surface.** One
resync and the dry store appeared.

## TWO FAULTS IN MY OWN INSTRUMENTS

**A GUESS AT A FIELD NAME IS NOT A READ.** The first cut asked the furnisher's pieces
for `.what`, `.name` and `.piece`; the real field is `.id`. Every piece came back
null, so every room came back empty, so **every room came back a sweep** — a silent
no-op that looks exactly like a world with nothing in it.

**AND THE GATE WAS WRITTEN GREEN AND HAD TO BE PROVED.** Five mutations, five reds,
including the one that matters most: hard-coding the room list instead of deriving it
fails the "empty the furniture out" check.

## A REPAIR I MADE ON THE WAY, AND IT WAS NOT MINE

My own control-character check from `[debt carried]` went red on arrival: **the
walked surface had two corrupt bytes in it**, from another lane and from me.

- A NUL used as a map key separator (`_o.faction + '\0' + rung`), the *exact* mistake
  this lane made and fixed in its own module one round earlier. Repaired to `'::'`.
- A backspace inside a comment where two word-boundary escapes were meant.

Either one stops a 4.8 MB file being a text file: `grep` calls it binary and every
gate that reads the city with a regex is one step from quietly lying about it.

**And my own check was written with the very bytes it forbids.** Its regex escapes
landed as literal bytes, so `gates/debt_carried_gate.js` was itself binary — the
fault it exists to catch, in the file doing the catching. It is built from character
codes now: no escapes, nothing for a writer to mangle, and it says *where*. It also
checks itself.

## PROOF

- `node gates/back_of_house_gate.js` → **38 passed, 0 failed**, registered, driven on
  the walked surface AND the demo by walking into a real casino
- red **five** ways: take the dry store back out → 2; make the room stop deciding →
  6; hard-code the room list → 1; stop the button naming the room → 1; count every
  room as a store → 5
- A DAY'S WORK 37/0 and DEBT CARRIED 49/0, both unchanged by this

## WHAT THIS ROW STILL OWES

"Enter, work in, **and steal from**." Enter and work in are shipped. Taking goods
that belong to somebody is an act against a faction, not a yield, and it belongs
with the deed machinery rather than the work button. Named here rather than glossed.
