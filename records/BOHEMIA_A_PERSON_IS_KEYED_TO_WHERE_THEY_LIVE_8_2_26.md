# A PERSON IS KEYED TO WHERE THEY LIVE — 8/2/26, PEOPLE lane

Two of Paolo's locked rulings meet at one line of code, and that line was
breaking both of them at once.

> **7/31, YOU HAVE TO ASK:** "once you ask their name, if you see them again,
> then they would be named."

> **8/1, REPAIR A DISTRICT:** "when you fully repair a district ... more people
> will want to move in and live in the recovered ruins."

Put together, the game promises: repair your street, more neighbours arrive, and
the ones you already know are still the people you knew.

**It did the exact opposite.** Repairing a district turned every neighbour you
had already met into a different human being, while leaving their name attached.

---

## THE BUG

`bohemia_agents.js` builds a block's roster by walking the houses and **skipping
the abandoned ones**. So a person's position in that array is not a fact about
them. It is a fact about how many of their neighbours happen to be home.

`bohemia_population.js` derived every person's character from that position.

Occupancy goes up, one more house is lived in, and everybody after it shifts.
Measured on cell (3,5):

| | before the repair | after |
|---|---|---|
| residents | 2 | 4 |
| **originals still themselves** | — | **0 of 2** |

`H12-1` and `H12-2` **swapped personalities with each other outright.** Archetype,
heat tolerance, morning edge, the whole day.

### Why this was the worst possible version of the bug

The **name** was safe the whole time. `bohemia_people.js` keys names to
`H<house>-<slot>`, which is stable. So the surface effect is not "your neighbour
vanished", which you would notice. It is:

> The name you earned by walking up and asking is still printed on the card, and
> the person behind it has been replaced.

You would spend act one repairing your street, exactly as he described, and every
single person you had ever bothered to ask would quietly become somebody else.

---

## THE FIX

**A person is keyed to WHERE THEY LIVE, never to their place in a list.** The
seat — which house, which place in that household — is already written into every
agent id by the agents module, and `bohemia_people.js` already parses it. The
population module just stopped ignoring it.

| Where | What |
|---|---|
| `engine/bohemia_population.js` | `seatNumberOf(agent)` parses `H<house>-<slot>` into a stable key; `peopleForAgents` derives from that instead of the loop index |
| `engine/bohemia_agents.js` | **`v.homeIndex` deleted.** It was the same bug in miniature: I added it on 8/1 so a commuter's identity would travel with them, but what I made travel was *a roster position*. The visitor is a copy of the home agent, so its seat already travels for free |
| `gates/people_gate.js` | J2 and J4 asserted the old design, so they were defending the bug. Rewritten to check the seat and to find a person **by seat, not by position** |

### The one-time reshuffle, deliberately

Changing the key changes who is who, once. That is legal precisely because
nothing about any individual is approved yet — `KNOWN_AT_START` and `LINES` both
ship empty, no verdict names a person — and the alternative is a world that
reshuffles every time the dial moves.

---

## THE GATE: part K, "YOUR NEIGHBOUR IS STILL YOUR NEIGHBOUR AFTER YOU REPAIR THE STREET"

- **K1** every body has a seat to key by: **268 people across 93 blocks, 0 fell
  back to a list position.** The fallback is counted, not trusted
- **K2** the seat encoding cannot collide (biggest household in the valley is 4,
  encoding holds 8). If `household()` ever grows, two people in different houses
  would silently become one person
- **K3** a district in this valley really does fill up when repaired
- **K4** **the people you already knew are still themselves afterwards**
- **K5** the extra residents are new people moving in, not the old ones renumbered
- **K6** and it holds going down too: when people leave, the ones who stay stayed

### Mutations, all caught

| mutation | result |
|---|---|
| key on array position again (the shipped bug) | K4 red (0 unchanged, 2 became somebody else), K6 red |
| seat encoding too tight, two people share a key | K1 red (66 seatless), K2 red |
| visitor keyed off the cell they stand on | J4 red |

---

## AND A GATE THAT WAS DECIDING BY LUCK

C5 ("you can walk up to a scheduled body") went red on this change, and the
investigation is worth more than the fix.

The nearest person out on the street is routinely **a hundred tiles away**. The
old walker locked onto one of only three candidates, walked at them, and gave up
the instant they stepped indoors. Over a hundred-tile chase somebody almost
always goes inside first.

Measured on both sides of the change: **the same three people were outdoors, at
the same distances.** Nothing moved and nobody vanished. All that changed was
when one of them went in for the morning, and that flipped the gate.

A gate whose answer depends on that is not measuring the thing it names. It now
re-targets every step, the way a player does, and only fails if it genuinely
cannot reach anybody in a full block's worth of walking. **The mutation runs were
repeated afterwards to prove the new walker did not just make the gate easier: it
still goes red on every one.** The dead single-target walker was deleted rather
than left around for somebody to reach for.

---

## WHERE PAOLO CAN SEE IT

**RUN tab.** Ask a neighbour their name. The repair mode is not built yet, so the
thing he can check today is that the street is still populated and people are
still themselves. The value of this one is that the game mode he described on 8/1
now has ground that will hold it.

Gates: PEOPLE 139 -> **146**, RUN PEOPLE 45 held, FRONT DOOR 8, FENCE ORPHAN 9.
