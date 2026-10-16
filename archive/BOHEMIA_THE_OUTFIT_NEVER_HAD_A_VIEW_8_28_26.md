# THE SWEEP THAT FINDS DEAD ORGANS HAD NEVER LOOKED AT FIVE OF THEM
## 8/28/26, FACTIONS lane

TAB: **RUN**. Walk up to somebody who runs with an outfit and read their card.
Then open the ⚔ OUTFIT board.

---

## 1. HOW IT WAS FOUND, WHICH MATTERS MORE THAN WHAT IT IS

`tools/bohemia_organ_reach.js` exists to answer one question: does anything on
the walked surface actually call this. It was built on 8/20 after this lane
found the same bug seven times in one week — an organ computes something
correctly, its unit test is green, its gate is green, and nothing the player
can reach ever calls it.

Its own docstring warns about the failure mode it would have:

> a module the sweep does not know about is invisible to exactly that check,
> which is the rot this file exists to kill, wearing the sweep's own uniform.

Then its module table was the thing carrying the rot. **Five faction-family
modules were inlined in the walked page and had never once been swept:**
`bohemia_standing`, `bohemia_known`, `bohemia_clout`, `bohemia_asking`,
`bohemia_deeds`.

Found in about ninety seconds, by `ls engine/` for the family and diffing it
against the table. That is a thing that should have been done the day the table
was written. **An unregistered organ is not merely unchecked — the sweep
actively certifies it as fine**, because the summary line prints only what it
knows about and a green sweep reads as "everything is wired."

The first sweep with them registered:

```
BohemiaStanding   9 fns | surface 4  engine 1  tooling 0  NOTHING 4
    *** NOTHING ANYWHERE: standingOf, becauseOf, inherit, legendOf
BohemiaDeeds      9 fns | surface 2  engine 3  tooling 1  NOTHING 3
    *** NOTHING ANYWHERE: publishStage, sayWhy, labels
```

---

## 2. WHAT WAS MISSING: RULE 4

`engine/bohemia_standing.js` states four rules in its own header. Three are
wired and running in the city. This is the fourth, verbatim:

> **4. A FACTION'S VIEW IS ITS MEMBERS' VIEWS.** standingOf() averages the
> opinions of the people who actually belong to it.

Nothing on the walked surface had ever called it.

**The exact shape.** The city witnesses four deed kinds — `claim:met`,
`claim:refused`, `commit`, `favour` — and every one of them is an organ this
lane built. `ctWitnessPass` records who saw you. `ctGossipPass` spreads it.
`ctOpinionOf` reads ONE PERSON'S private view and puts it on their card. So you
could turn the Church down in front of five of its people, each of those five
would privately think less of you, and **the Church, as an outfit, had no view
of you and never would.** The organisation whose door you are trying to get
through could not form an opinion.

And the ladder in front of that door is BELONGING — what you have GIVEN them.
**Two different things have been sharing the word "standing" in this lane for a
week, and only one of them was ever on the screen.**

### A live comment asserted the wiring that was missing

`__CITY_DIAL__` in the walked page says that filling `DEED_WEIGHT`

> lights up opinionOf, standingOf, becauseOf and the rungs with no other wiring
> at all.

`opinionOf` — true. `standingOf` and `becauseOf` — false. Nothing called them,
so his dial could fill the table perfectly and neither would ever run. The
comment is corrected in place rather than deleted, because a comment that
promised wiring it did not have is worth one warning to the next reader.

---

## 3. WHAT SHIPS TODAY VERSUS WHAT WAITS FOR HIS DIAL

`DEED_WEIGHT` ships **EMPTY** and nothing here puts a row in it. That is his
ruling, and the DIRECT tab's STANDING dial is where he makes it. With the table
empty every opinion is 0, so this **never prints a rung** — printing NEUTRAL
for everybody would be inventing the judgement he has not made, which is
exactly what `ctOpinionOf` already refuses to do.

**But `standingOf` also returns `members`, and that is true today with an empty
table.** A mind exists only for somebody you have actually been near, so
`members` literally counts how many of that outfit's people have been where you
have been. A headcount needs no ruling from anybody.

Measured on the real surface, table empty (what ships):

```
RUNS WITH                 CARTEL
THE CARTEL HAS SEEN YOU   1 OF ITS PEOPLE
  That is how many of them have been close enough to you to remember it.
  Being seen is the only way an outfit comes to know anything about you.

BOARD: WHO HAS LAID EYES ON YOU
       CARTEL     1 OF THEIR PEOPLE HAS SEEN YOU
```

The same rows the moment he turns one dial, with no further wiring:

```
WHAT THE CARTEL THINKS    HOSTILE · 1 OF ITS PEOPLE CARRIES SOMETHING
  Somebody in the CARTEL watched you turn an outfit down.

BOARD: CARTEL     HOSTILE · 1 OF THEM CARRIES SOMETHING
```

---

## 4. AND THE HONEST ANSWER TO THIS LANE'S OLDEST FINDING

837 people within six cells of the spawn, none affiliated, nearest base 29
cells. I have reported four times that this is placement and not mine, and it
still is. **What was never done is saying so in the game.**

```
BOARD: REMNANTS   HAS NEVER LAID EYES ON YOU
```

That line is true at the spawn for every outfit in the valley. It needs no
dial, no placement and no ruling. It tells the player that the outfit exists,
that being seen is how it comes to know him, and that it is not here. An empty
state that points somewhere beats a screen that is silent about its own
emptiness.

It appears only where you have skin in it: an outfit gets a row if you have met
one of its people **or** you have given it something. An outfit you have
neither met nor touched is not news, so the board never becomes a wall of
fourteen zeroes.

---

## 5. THE ONE MODELLING DECISION

`standingOf` needs `factionOfOwner(id)`; the city's `ctFactionOf` takes a PERSON
object, which an id cannot be turned back into. So the outfit is **stamped on
the mind at the moment you see them**, in `ctWitnessPass` — the one place in the
file holding the person and the mind at the same time.

It **re-stamps on every pass** rather than only the first, and that is the model
rather than laziness: what you know is who they ran with **the last time you saw
them**. Somebody you vouched into an outfit reads as theirs next time you walk
past; somebody who lost their place stops reading as anything. `ctFactionOf`
already answers both, so neither needs a second notification system. It rides
`ctMindSave`'s existing whole-object JSON — no new save key, no migration.

---

## 6. THE PROBE THAT LIED, AND WHY

The first probe reported `drew=0, minds=0, stamped=0` **with the code working**.

A probe on `slices/BOHEMIA_CITY_WORLD.html` directly measures a ghost town.
That page has no `PLAYER_CV` — the character bake is POSTED IN from the alpha —
so `peoplePass` returns before drawing anybody and no mind is ever created.
`gates/city_barks_gate.js` names the same trap in as many words.

Two more things the probe had to learn, both of which would have produced a
false result:

- **The city frame is lazy.** Every frame is `about:blank` until the **RUN** tab
  is opened. A probe that looks for the world on boot concludes it does not
  exist.
- **You have to walk.** `ctWitnessPass` runs once per GAME minute and this world
  is I-MOVE-YOU-MOVE, so standing still never advances the clock and never
  re-runs it. Forcing `CT_SAW_MIN` open would have been measuring the poke
  rather than the feature.

The gate pass for this boots the alpha, opens RUN, and takes real steps.

---

## 7. A GATE CLAIM THAT FAILED WHILE THE FEATURE WORKED

Three claims went red on the first run reading `document.getElementById('card')`
— an element that does not exist. The card is `#ctcard`. `innerText` was `''`,
so the claims failed while the view object printed right beside them already
said `HOSTILE`.

FIX THE RULER, NEVER THE TARGET. A reader that cannot see the surface is the
broken half.

---

## 8. WHAT IS STILL DEAD, NAMED RATHER THAN QUIETLY LEFT

- `BohemiaStanding.inherit` / `legendOf` — the generational handoff. Reputation
  outliving the person who earned it, which is the dynasty premise. Reached by
  nothing on the walked surface. Not wired here: it needs the story's handoff
  moment, which does not exist in the demo yet.
- `BohemiaDeeds.publishStage` / `sayWhy` / `labels` — the bridge from a quest
  outcome to who actually saw it. **82 faction deltas and 203 clout tags are
  authored across `quests/bq/*.bq` and no running surface has ever read one of
  them.** `reachOf`/`hopsFor` (the loudness half) ARE wired; the publish half is
  not, and the quest sources are not in the city frame at all. Named here rather
  than fixed: that is the quest runtime's surface, not this lane's.
- `BohemiaPeople.peopleOf` — unchanged from the previous sweep.

---

## 9. WHAT IS PENDING HIM

Nothing new. `DEED_WEIGHT` stays empty until he turns the STANDING dial in the
**DIRECT** tab, which is where that decision already lives.
`AFFILIATED_RATE` (0.30) and `REACH_CELLS` (12) remain [PENDING Paolo], and the
spawn/base placement gap remains outside this lane.
