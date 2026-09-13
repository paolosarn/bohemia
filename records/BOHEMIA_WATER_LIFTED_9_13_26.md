# THE PUMPS ARE THE CITY (9/13/26, WORLD lane) — board row [water lifted]

Ship: `engine/bohemia_pumps.js` (new), the walked surface (the valley's day and the
nightfall card), and `gates/water_lifted_gate.js` (44 checks, registered as
**WATER LIFTED**). Tab: **CITY**, on the nightfall card. Also in the demo.

---

## THE ROW, HARVESTED FROM ECONOMY ROUND 7

> "The valley floor is about 2,028 feet and Lake Mead hit 1,040.5, so everything
> Vegas drinks is lifted a thousand feet by 22 vertical pumps and two booster
> stations. **Water is not scarce; PUMPING is.** Wire it: a pump station costs
> power, water costs pumping, thirst costs water, and whoever holds the pumps holds
> the valley. The cleanest real tie between power, territory and need we will ever
> get."

## MEASURED FIRST, AND IT IS WORSE THAN THE ROW SAYS

The valley starts with about 10,365 L of water — water heaters and containers,
grounded house by house — and drinks 4 L per person per day.

**And nothing in this game had ever produced a single litre.**

`advanceDay`'s `produced` comes only from `YIELD`, which is `{site:{salvage,food},
scav:{salvage,food}}`. Every worker in the valley brings back salvage and food and
**nobody ever brings back water**. Measured: falling 160 L a day with 40 people, gone
in about 65 days, and no act anywhere could add to it.

Water was the **only good in the valley with a need and no way to make it.**

And all the infrastructure was already there doing nothing: pump stations, water
treatment plants and reservoirs generate as real districts you can walk to.
`bohemia_dead.js` even has the line already written for a dead one — *"a pipe that
still ran, for a while"*.

## THE ENERGY IS PHYSICS, NOT A DIAL

```
valley floor        2028 ft        (the row)
Lake Mead surface   1040.5 ft      (the row)
LIFT                 987.5 ft  =  301.0 m
one litre of water   1 kg           (the definition of the litre)
gravity              9.81 m/s^2

E = m*g*h = 2,952 J per litre = 0.00082 kWh at perfect efficiency
over 0.75 wire-to-water                = 0.0011 kWh PER LITRE
```

Every number is the row's own real measurement or arithmetic on it. **None of it is
his to rule**, because none of it is a balance choice — it is a fact about Nevada.
The gate refuses any number in the module that is not physics, the row's own
measurement, or one **named** display precision.

**What a station delivers is not a dial either.** A municipal pump station is sized
to the population it serves; that is the definition of the infrastructure, not a
knob. So a running one covers the need and a dark one covers nothing. Binary and
legible, and no invented litres-per-day rating.

## AND THE FIRST CUT WAS DEAD CODE, WHICH ONLY MEASURING CAUGHT

I wrote "a pump on a live circuit runs" and it was **correct and impossible**.

```
POWER.at on every water district's own cell:  live:false, id:-1   (all six)
live cells in the whole valley: 358
what they are: arterial 264, freeway 90, downtown 4
```

Circuits are contiguous **street runs**, and a plant is not a street. That branch
could never have executed. It would have shipped as a feature that is right in every
detail and does nothing, which is the worst kind.

Measured again, and this is why the fix is a fact and not a tuning number: **all six
water districts touch a circuit at distance 1.** Touching is what a service
connection *is* — the plant is wired to the street it fronts, which is exactly what
`[lights bill]` already means by *"a plot fronts a street feeder and that feeder is
his"*.

On the real map that leaves the pump station and both treatment plants running, the
three reservoirs dark, and **the Anarchists holding the valley's water.**

## AND THE POWER IS NOT CHARGED TWICE

The first cut subtracted the lift's kWh from the ledger's `power` stock and drove it
to **-5.249 in ten days**, because that stock starts at zero and nothing in the game
ever fills it. A stock that only goes down past zero is a hidden debt, which is the
exact thing `bohemia_purse` refuses by design.

The power is already paid, the way this game pays for power: **a pump only runs on a
live circuit, and a live circuit costs its holder one battery a night.** Stop paying
and the circuit goes dark and the water stops with it. Charging again would bill the
same electricity twice. The kWh is still computed and carried — it is the physics and
the row's whole point — but as a fact the machine holds, not a second charge.

## MEASURED END TO END ON THE WALKED SURFACE

```
water districts on this map: 6   {reservoir:3, pumpstation:1, watertreat:2}
lit by the street they front: 3   holders: ANARCHISTS
valley: 120 people drinking 480 L/day

ten days:   water 28604 -> 28604,  lifted 480 every night,  3 pumps running
power stock: 0, never driven negative

then the circuits go out:
            0 pumps, lifted 0, water 28604 -> 28124
            "All 6 pump stations are dark. Nothing is being lifted."
```

## WHAT IS NOT BUILT, AND IT IS DELIBERATE

**"Thirst costs water"** for the PLAYER would be a **fifth verb**, and the four that
drain the purse are frozen and his: `day:ate`, `fight:plate`, `night:power`,
`ask:leaned`. The VALLEY's thirst is real, already runs short, and now has a source.
The player's own is a ruling, not a build. It is named in `placeholders()` rather
than quietly added.

## PROOF

- `node gates/water_lifted_gate.js` → **44 passed, 0 failed**, registered, driven on
  the walked surface AND the demo
- red **four** ways: let a dark pump lift anyway → 4; put a fudge factor in the
  physics → 2; ask the plant's own cell again → 4 (and the failure message reads
  `28604 -> 23804`, the countdown restarting); count the water and never credit it → 1
- the physics is re-derived from first principles inside the gate rather than copied
  off the module, so that check is a check and not an echo
