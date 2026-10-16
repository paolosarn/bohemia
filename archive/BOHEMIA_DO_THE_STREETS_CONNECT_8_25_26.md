# DO THE STREETS ACTUALLY CONNECT? MEASURED, AND THE ANSWER IS YES
### 8/25/26, RUN lane. Written so nobody spends a day chasing a bug that is not there.

## WHAT HE SAID

> "also in the run all streets should connect and you should be smarter with all
> the chats about proper street placement. it looks so bad"

Two claims in one sentence, and they turn out to be different problems with
different owners. One of them is already true.

## 1. CONNECTIVITY, AT THE DISTRICT GRID — 100%

Every district cell whose type carries road (arterial, freeway, beltway, strip,
interchange, road, street), flood-filled over 4-neighbours across the whole
valley:

```
valley            96 x 96
street cells      3,483
components        1
largest           3,483   (100%)
stranded          0
dead ends         150     (4.3%, and cul-de-sacs are real Sun Belt suburbs —
                           see the 7/21 landlocked law)
average degree    2.51
```

**The street network is a single connected component. Nothing is stranded.**

## 2. CONNECTIVITY, AT THE DRAWN SURFACE — 0 BREAKS

The grid promising connection is not the same as the drawn road delivering it, so
this was measured separately: for every road cell sitting exactly on a district
boundary, does road continue on the other side?

```
window                     301 x 301 fine cells around the player (FN = 128)
road cells                 37,386
boundary crossings tested  354
ROAD STOPS AT A BOUNDARY   0        (0%)
```

**Zero.** Where two road-bearing districts meet, the road always continues.

## *** AND MY FIRST NUMBER WAS WRONG, WHICH IS WHY THIS FILE EXISTS ***

The first cut of that measurement reported **46% broken, 298 of 652** — and I was
one step from handing that to the WORLD lane as a defect in their generator.

It was counting every road cell that reached a district edge, including the ones
whose neighbour is a **park, a suburb interior, or bare desert**. A road that ends
where the road district ends is not a broken road. It is a road that ends.

Narrowed to boundaries where **both sides are road-bearing districts**, the 298
"breaks" are 298 legitimate terminations and the real number is 0 of 354.

The 7 disconnected "road pieces" in the same first measurement are the same class
of artefact: a 301-cell window cuts parallel arterials that join further out, and
the whole-valley scan above already says the network is one component.

**A measurement that names the wrong owner costs somebody a day.** The check that
saved it was asking what the neighbouring district is *supposed* to be.

## SO WHAT IS HE ACTUALLY SEEING?

Not connectivity. His own second clause is the real one: **"proper street
placement… it looks so bad."** That is how the streets are laid out and drawn, not
whether they join up — and it belongs to:

- **WORLD**, who owns the overmap and the district generators that place road.
- **MAP LAW**, which reserves layout to him: *Claude never designs map layouts.
  Plumbing only. Paolo places canon.*

So the RUN lane records the numbers and routes it, rather than rewriting another
lane's generator on a hunch — and rather than "fixing" a connectivity bug that
measurement says does not exist.

## WHAT WOULD ANSWER HIM

Somebody has to look at a street and say what is wrong with it in words, because
"it looks so bad" is an art judgement and there is no number in this file that
disagrees with him. The honest next step is a LOOK shot of a few junctions in
front of him, not another sweep.

## REPRODUCE

The probes are in this turn's scratch work; the two questions are:
- district grid: flood-fill `om.at(x,y).district` over the road types, count components.
- drawn surface: for each cell with `gArtPool === 'street'` on a district boundary,
  check the cell across it — **and only count it when both districts carry road.**
