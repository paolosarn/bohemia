# ONE STREAM, THREE SOURCES — and the second producer hid behind a rename
(9/5/26, LIFE + CITY lane. VAMILY job `[feed posts] THE-FEED-STREAM`.)

## THE LAW SPLIT THIS IN TWO AND THE OTHER HALF WAS ALREADY SHIPPED

`laws/BOHEMIA_ADDENDUM_THE_FEED_ON_THE_CITY_SCREEN_9_4_26.md` routes the **surface**
to UI (the phone screen in CITY mode, the scroll, the beat — shipped) and **the
stream** here. UI's own header says it out loud:

> *"this is a reader, not a source ... it consumes whatever the game already writes"*

and names the seam it left open:

> *"WORLD/PEOPLE own the faction event stream; when it lands it calls this ... Until
> then that source is EMPTY, on purpose."*

This is that source landing.

## WHAT WAS MEASURED BEFORE A LINE WAS WRITTEN

    BOHEMIA_FACTION_GRAPH   present
    BohemiaTowns            present, ZERO CALLERS on this surface
    POWER                   358 live cells
    prices                  water 1, food 1, meds 1, fuel 1 (the shop's own quotes)
    the world source        0 posts, ever

**Everything the world needed to talk about was already in the page and nothing read
it.** The stream is the first thing on the walked surface ever to call
`BohemiaTowns` — 14 faction seats, FORTRESS / TOWN / CAMP, straight off the graph
WORLD shipped.

## AN EVENT STREAM MEANS DIFFS, NOT A DESCRIPTION

A source that re-states the world every beat is a status bar; he asked for a feed —
**things that happened**. So every world source keeps its last-seen value and speaks
only when it moves, and the first drain is a silent baseline.

> "the grid is at 358" is not news. **"the grid just lost a block" is.**

Four things really move on the walked surface, and each one talks when it changes:
the **lights** (light is territory), **what things cost** (the sim's own quote, never
a number typed here), **who holds what** (a seat changing tier), and **what you put
up** (this lane's century record, so the valley notices a building the round it lands).

## THE BUG MY OWN FIRST CUT HAD

The drain capped its **return** at three while the sources had already advanced their
cursors. So on a busy beat the fourth thing that happened was **gone for good** — a
faction taking a seat, silently eaten by a price change and two blackouts.

> **AN EVENT STREAM THAT LOSES EVENTS IS A STATUS BAR WITH EXTRA STEPS.**

The cap now delays into a pending queue. It never drops.

## THE SECOND PRODUCER HID BEHIND A RENAME

The surface was carrying two stopgaps while the stream did not exist: an inline
ledger drain and a fixed `LIFE[]` list. Both are now the stream's, because **one feed
with two producers** is the bug this repo keeps writing post-mortems about.

I replaced the every-8-beats life call, opened the panel — and the first three posts
were **still the old fixed list**. There was a *second* life producer in the same
file: a seed-on-open batch, written for a good reason (an empty phone reads as
broken) and therefore not where I was looking.

> **Two producers is the bug. Two producers where one has been quietly renamed is the
> same bug wearing a disguise.** Found by reading the panel, not the diff.

## AND THE FIRST AMBIENT SET READ AS A LOOP

At six in the morning exactly two ambient lines were true, so the feed alternated the
same two sentences forever — **worse than a fixed list, because it is a fixed list
that took an hour to build.** The fix was not more lines, it was more of the world:
the faction seats and the size of the grid are things the valley can always talk
about, and they differ between one valley and another.

A dark midnight valley and a lit morning one now say different things, and nothing
repeats back to back.

## WHAT HE READS

    @thevalley    still no moving the Remnants off their fortress. everybody knows it.
    @nightcount   5 outfits holding a fortress between them. that is a lot of walls for one valley.
    @thecircuit   most of the valley is still dark. 358 blocks with anything in them at all.
    @thecircuit   another 6 blocks came up on the grid tonight.
    @nobodysgas   water is up to 2 batteries. it was one battery last week.

Every line `draft:true` — ALWAYS MAKE AN ATTEMPT (8/11), and WORDS owns the voice.
Faction names come from the graph; nothing here types one. **Which faction says what
about whom is canon and is not decided here:** posts report what moved, in the
valley's mouth, and never put an opinion in a named faction's mouth.

## AND I BROKE ANOTHER LANE'S GATE ON THE WAY

Routing the deed source through the stream put it behind the **ambient cadence** —
one drain in eight beats — so a finished quest waited up to seven beats to appear.
UI's own feed gate publishes next-beat latency as its contract, and it went red on
exactly that, plus the catalogue leg behind it.

**THE CADENCE BELONGS TO THE SOURCE, NOT TO THE CALLER.** Events drain every beat;
ambient life is one in eight and that rule now lives inside the stream; and filling
an empty panel is a **third** case that obeys neither, because a blank phone reads as
broken — which is why the surface seeded three lines in the first place. Gating the
seed too dropped it to one post and turned their gate red a second time.

Fixing their gate is not enough. **A10 and A11 are in my gate now so it stays fixed.**

## THE GATE

`gates/feed_stream_gate.js`, **19 pass / 0 fail**, walked surface and cut demo.
UI's own `feed_gate.js` is back to **15 ok / 0 failed**.

| mutation | legs that went red |
|---|---|
| make the cap drop instead of delay | A3b |
| remove the baseline (describe instead of report) | A1 |
| point the seed back at the retired list | B2 (3 leaked) |

## THE STANDING NOTES

**A REPLACEMENT IS NOT DONE UNTIL YOU LOOK AT THE THING, NOT THE DIFF.** I removed
the producer I could see, the diff looked complete, and the old source was still on
screen through a path with a different name and a good reason to exist. The panel
told me in two seconds what reading the file had not.

**AND WHEN YOU TAKE OVER A SOURCE, YOU INHERIT ITS TIMING, NOT JUST ITS CONTENT.** I
moved three sources into one stream and gave all three the cadence of the slowest,
because the cadence lived in the caller where it was invisible. The other lane's gate
noticed within a minute. That is what another lane's gate is for, and the right
response was to hold their contract in mine rather than to be careful next time.
