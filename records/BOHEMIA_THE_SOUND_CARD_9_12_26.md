# THE SOUND CARD (9/12/26, SOUNDS lane)
## [sound card] WHAT-BOHEMIA-SOUNDS-LIKE, round 1

> **HIS RULING (9/6, LOCKED).** Asked in one sentence what Bohemia sounds like:
> *"Post-apocalyptic Final Fantasy X, especially that fantasy beach vibe, it was
> so good."*
>
> **HIS ANCHOR (9/7, "look at this song bro").** *Final Fantasy X OST — Besaid
> Island*, the original, not the remaster. The brief in four words, off the
> picture he sent: **would you live here.**

The row asked for three things: the ruling turned into a card a cook can use, the
anchor named, and every one of the songs sorted by distance from the card. All
three are below, and the sorting is a **measurement of our own rendered audio**,
not a taste call.

### THE CARD IS FIVE TERMS AND EVERY ONE IS A SENTENCE HE OR HIS LAW ALREADY WROTE

I cannot listen to the anchor. What I can do is turn each thing the law says about
it into a number, then measure that number on our own songs through the real
engine. Nothing here is my opinion about what sounds good; each term traces to a
quote, and the direction comes from the quote.

| term | his words | measured as | direction |
|---|---|---|---|
| **PATIENCE** | "a picked, **patient** melody" | note onsets in two bars | fewer |
| **LATE BEAT** | "the beat **arriving late**" | when the first transient lands | later |
| **BASS UNDER** | "the **bass line** removed ... people noticed" | share of energy under 200 Hz | more |
| **WARMTH** | "**warm**, sunlit ... blue water in the sound" | share of energy over 3 kHz | less |
| **HELD LINE** | "everything melodic; **you can hum it**" | share of the piece above a fifth of its own peak | more |

**Equal weight, and that is a decision I am naming rather than hiding.** His law
lists these traits; it does not rank them. So they are weighted equally until he
says otherwise, and the ranking is published both with and without the late-beat
term (see below) so the weighting cannot quietly do the deciding.

**TEMPO IS NOT A TERM** because it is not a variable: the 120 BPM LAW fixes it.
What carries "patient" instead is the FEEL — half-time — and that is in the data
already: 70 of 142 songs carry `feel:'half'` or `mel:'longs'`.

### THE NUMBERS A COOK CAN WORK TO

Measured by rendering all 142 songs through the real `playStep` offline, two bars
each, zero failures. These are our own shelf's numbers, so a cook is aiming at a
real target and not at an invented one.

| term | the ten closest (min / med / max) | the ten furthest | whole shelf |
|---|---|---|---|
| onsets per 2 bars | 4 / **6.5** / 11 | 9 / 14 / 20 | 3 → 40 |
| bass share | 0.73 / **0.86** / 0.94 | 0.36 / 0.51 / 0.56 | 0.11 → 0.94 |
| treble share | 0.000 / **0.001** / 0.002 | 0.003 / 0.009 / 0.022 | 0.00 → 0.05 |
| held share | 0.16 / **0.69** / 0.98 | 0.10 / 0.15 / 0.49 | 0.03 → 0.98 |

**A new song is close to the card when it lands in the left column.** Six or seven
onsets in two bars, most of its energy under 200 Hz, almost nothing over 3 kHz, and
a line that holds up between hits.

### AND THE ONE TRAIT NOTHING ON OUR SHELF HAS

**138 of 142 songs put the drum on beat one.** The other four have no drum at all, and NOT ONE has a late one.

(An earlier pass of this said "136 of 140". That was a regex over the file and it missed two rows; the number above is the gate's own census of the LIVE song library, which is the only count that can be trusted. A COUNT OF A FILE IS NOT A COUNT OF WHAT LOADED.)
Measured on the audio, the first transient lands at **0.04 seconds for 137 of 142
songs** — the term did not vary, which is how I found it.

So the single thing his law names as **what people loved and the remaster lost** —
*"a more synthetic beat that starts sooner, the bass line removed ... which tells
the lane WHAT THEY LOVED: the patience, the bass under it, the beat arriving
late"* — is the one thing this shelf does not do, anywhere, once.

That is not a tagging gap and it is not a taste gap. It is a mechanism gap, and it
is the next round: **when a song starts, hold the percussion for the first phrase
and let the melody and the bass come in alone.** One rule in the engine, no song's
data touched, and it gives every song on the shelf the trait he named. It is
written into the handoff as the next build.

### THE ANCHOR INSIDE OUR OWN SHELF

His anchor is the FFX track. But "which of ours is nearest it" is answerable, and
here it is, two ways, because the late-beat term is **1.0 for four songs and 0.0
for 137** — a flag wearing a percentile's clothes, which would otherwise decide
the top of the list on its own.

**WITH every term (the late beat included):**

| song | score | verdict | where it can be heard |
|---|---|---|---|
| MENU — THE POWER STILL ON SOMEWHERE | 0.764 | CANON | the opening only |
| MENU — PURPLE DAWN | 0.759 | BURIED | the opening only |
| HYMN FOR RUNNING WATER | 0.741 | CANON | indoors |
| MENU — DEAD VALLEY DAWN | 0.626 | CANON | the opening only |

**WITHOUT the late-beat term (the other four things his law names):**

| song | score | verdict | where it can be heard |
|---|---|---|---|
| HYMN FOR RUNNING WATER | 0.927 | CANON | indoors |
| LONG WALK HOME | 0.879 | BURIED | indoors |
| FROZEN AISLE | 0.873 | CANON | indoors |
| **THE VAULT** | 0.845 | CANON | **the street** |
| HOLLOW MASS | 0.805 | CANON | indoors |
| **REPO MAN** | 0.789 | CANON | **the street** |
| MOTHS AROUND THE LAST LIGHT | 0.775 | CANON | indoors |
| **SLOW CREEP** | 0.766 | CANON | **the street** |
| **TAPS FOR THE VALLEY** | 0.766 | CANON | **the street** |
| **SLOW BLEED** | 0.754 | CANON | **the street** |

### THE GOOD NEWS, AND IT IS HIS OWN TWO RULINGS AGREEING WITHOUT KNOWING IT

**Five of the ten closest songs are already the street's creepers.** His OVERWORLD
PLAYLIST LAW (7/7) said the overworld plays only the creepers, two months before
he named the sound. Measured now, the creeper pool is the beach-adjacent half of
the shelf. Nothing has to be re-tagged for the street to sound like the card; it
already does, as far as our shelf can.

**And the ranking's top is sitting indoors**, because of round 1 of [music owned]:
the untagged songs, which used to play nowhere at all, are now the interior pool,
and four of the five nearest the card are in it. The room got the beach.

### THE TENSION WORTH HIS EYE, AND IT IS NOT MINE TO SETTLE

The three songs with the anchor's own late beat are **MENU-tagged, so they play at
the front door for one phrase — sixteen seconds — and then never again.** Two of
the three are CANON. They are the closest things we own to the sound he named, and
the game plays them for sixteen seconds a session.

Moving them is **re-tagging, which is his**, in the MUSIC tab, and putting them on
the street would break his own 7/7 overworld ruling. So this is written down and
routed, not acted on. It is in the handoff as **[PENDING Paolo]** for the
coordinator to carry.

### WHAT A BED, A FIGHT AND A ROOM ARE, ON THE CARD

The row asked for these by name. All three surfaces exist, so the card is a rule
per surface rather than a wish:

* **THE BED** (the ambience, `AMB`): not music. Wind, air, a generator, the desert
  speaking every 60 to 130 seconds, and since 9/11 it is *audible*, because the
  street now rests one phrase between songs instead of playing over it forever.
  The card's job here is warmth without a tune: no melody, no beat, and the bass
  term does not apply.
* **THE ROOM** (`INTERIORMUS`): the card's best matches live here. A room is
  patient and close: fewest onsets, most held line, the treble share at the bottom
  of the shelf. It turns over one phrase after you walk in.
* **THE FIGHT** (`FIGHTMUS`): the card does **not** govern the fight. The anchor is
  a beach; a fight is danger, and the 8/19 record already settled that a fight
  takes the music immediately and hands it back on a phrase. What the fight keeps
  from the card is only the 120 BPM and the hummable line, so a swing on the beat
  still reads. Anything gentler than that is the wrong reference in the wrong
  department, which his own 9/5 law forbids.

### AND ONE REAL DEFECT THE MEASUREMENT CAUGHT ON THE WAY

**`THE GAPS IN THE HYMNAL` peaks at 3.978 and every other song on the shelf peaks
near 0.30.** That is **13.4 times the median peak**, on a song thumbed CANON. Its
voices are `phasedist` on bass and `holdbreath` on lead with a `reversebloom`
accent, and something in that combination runs away.

Measured pre-limiter, so a player does not hear it as 4x — they hear it slam the
brickwall limiter on the master and duck everything else in the mix with it. It is
excluded from the ranking's scales (a 13x outlier would squash every percentile
around it) and reported as a defect instead of ranked as a candidate. **Not fixed
this round**: it is one song's voice mix, it is his content, and the honest move is
to name it with the number rather than quietly re-balance a song he approved. In
the handoff.

### MEASURED, NOT READ

    142 songs rendered through the real playStep, offline, two bars each
    0 render failures, 0 page errors
    the shelf's own instrument census: hand percussion on 24 of 142,
      patient markers on 70 of 142, melody-led on 81 of 142

REUSE CHECK: cooks nothing. No bank candidate, no pixel, no new song, no new tag,
no new event, no engine change. It is a card, a measurement and a ranking, built
out of the songs and the engine that already exist. The ranking ships as a bank
file tagged `draft:true`, never as a verdict: **it sorts, it does not judge.**
GRAVEYARD IS FINAL — buried songs are measured and labelled BURIED, and nothing
here proposes reviving one.

    python3 gates/bohemia_gates.py --only "SOUND CARD"

Build 9/12 - THE SOUND CARD.
