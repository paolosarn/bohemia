# BOHEMIA — RESEARCH: HOW GRID TACTICS HANDLE LEVELS (7/27/26)

> Paolo: "Do some big brain research on how other games to turn base grades handle
> different levels please and thank you. Doesn't have to be the most changing thing
> but yeah, just do research."

Research only. Nothing was built this turn. Every item is scored against the two
rulings already locked in this lane:

- **NO DAMAGE MULTIPLIERS.** *"theres not a lot of ways to increase damage other
  than hit the killshot."*
- **POSITION CHANGES ODDS AND EXPOSURE, NEVER THE NUMBER.**

That pair rules out most of what the genre does, which turns out to be the single
most useful finding in here.

---

## THE HEADLINE

**ALMOST EVERY TACTICS GAME PAYS FOR HEIGHT WITH A STAT BONUS. BOHEMIA CANNOT, AND
THE ONE FAMOUS GAME THAT DOESN'T IS THE ONE BOHEMIA ALREADY RESEMBLES.**

XCOM gives +20 aim. Divinity gives bonus damage. Final Fantasy Tactics moves the
hit rate. All three are multipliers, and all three are closed to us by his ruling.

**Jagged Alliance 2 is the exception, and it is the closest relative Bohemia has.**
Two levels only — ground and roof — and height pays in **line of sight**, not in
numbers. That is exactly the rule v90 shipped, arrived at independently. The
research does not tell us to change it; it tells us the shape is a known-good one
and shows what the neighbours did with the space around it.

---

## 1. WHAT EACH GAME ACTUALLY PAYS FOR HEIGHT

| game | levels | what height buys | is it a multiplier? |
|---|---|---|---|
| **XCOM 2** | many | **+20 aim, one flat step.** No defensive bonus at all | yes — ruled out |
| **Divinity OS2** | free-form | bonus damage **and extra range** | yes — ruled out |
| **FF Tactics** | many | shifts hit rate; height gates MOVEMENT via the Jump stat | yes — ruled out |
| **Jagged Alliance 2** | **two: ground and roof** | **sight lines.** Roofs are sniper positions | **no** |
| **Bohemia (v90)** | **two: lot and deck** | **cover stops counting, both ways** | **no** |

### XCOM 2 — the flat bonus, and the thing worth stealing
Elevation is **+20 aim and nothing else** — explicitly **no defensive bonus**, so
high ground does not protect you.
([StrategyWiki](https://strategywiki.org/wiki/XCOM_2/Aim_Bonuses))

The bonus is closed to us. But the *shape* of XCOM's real positioning rule is not:

> "If an attack hits a unit who is not benefiting from any kind of cover, that unit
> is **flanked**, and the attack has an extra 40 crit."

**Bohemia's cross-level rule IS XCOM's flanking rule, turned vertical.** Going up
does not add a number; it removes the target's cover, which is precisely what
flanking does horizontally. That is a strong independent confirmation that v90's
rule is the genre-correct one, and it is worth knowing we already have the
mechanism XCOM built its whole positioning game on.

There is also an angle system worth noting: a shot inside 44° of a flank gets a
partial bonus scaling to full at 10°, "so it's still worth it to try and get as
close to a flanking position as possible." **A GRADIENT, not a switch.** That is
the one idea in this document that addresses the audit's open finding — at a given
range, no direction is currently better than any other.

### Divinity: Original Sin 2 — and the balance failure worth avoiding
Height gives damage **and range**. The community critique is specific and useful:
the high-ground damage bonus stacks in the same slot as crit, which made a whole
skill tree redundant, and one player noted the elevation system "doesn't offer as
much tactical variety as hoped."
([Silver Age Rants](https://silverrants.wordpress.com/2017/10/10/the-flaws-of-divinity-original-sin-ii/),
[wiki](https://divinityoriginalsin2.wiki.fextralife.com/Combat))

**The lesson: a height bonus that is just "more damage" competes with every other
damage source and eventually gets solved.** Paolo's no-multipliers ruling walks
straight past this failure mode. That is not luck, it is the ruling doing work.

### Final Fantasy Tactics — height as a MOVEMENT problem
FFT's real contribution is not the hit rate, it is **JUMP**: a unit can only enter
a tile whose vertical difference is within its Jump stat, and abilities carry a
**vertical tolerance** written into their range (`3v2` = 3 tiles out, 2 tiles up).
([FF Wiki: Jump](https://finalfantasy.fandom.com/wiki/Jump_(Tactics)),
[Battle Mechanics Guide](https://gamefaqs.gamespot.com/ps/197339-final-fantasy-tactics/faqs/3876))

So in FFT, height is a **reachability** constraint before it is a combat one, and
different weapons have different vertical reach. Bohemia has one of these already,
by accident and correctly: a blade cannot reach the deck. FFT says that idea
generalises — a shotgun and a rifle need not have the same vertical tolerance.

### Jagged Alliance 2 — the closest relative
Mercs climb onto flat roofs, and the game deliberately runs **two elevations only,
ground and roof**, where XCOM-likes run many. Roofs are sniper positions; the
payoff is sight lines through its line-of-sight model, not a stat.
([JA2 wiki](https://jaggedalliance.fandom.com/wiki/Jagged_Alliance_2),
[Turn Based Lovers](https://turnbasedlovers.com/review/jagged-alliance-2-cult-classic-review/))

**Two levels is a deliberate, shipped, well-regarded choice, not a shortcut.** The
"one deck, not a building" scope v90 shipped has a real precedent behind it.

---

## 2. THE COST NOBODY MENTIONS UNTIL IT BITES

Level-design literature is blunt about verticality's price, and it is READABILITY:

> "players probably won't be able to process too much complexity, with most maps
> maxing-out at **three different floor planes** for any given area"
> — [The Level Design Book](https://book.leveldesignbook.com/process/layout/flow/verticality)

> "People tend to create complex layouts during the paper design stage using a
> top-down view, seemingly **forget about the third dimension** simply because it's
> difficult to represent in 2D."

Both of those already happened here, in one turn:

- **The height didn't read.** v90's first render drew the storey face at `#3e372c`
  and the deck looked like a lighter *patch of ground*. Value contrast had to carry
  the height because a top-down view has nothing else to carry it with.
- **The way up didn't exist.** The stairs button appeared **0 times in 8 arenas**,
  because I designed the rule in plan view and never asked how a player finds the
  entrance.

**Three floor planes is the documented ceiling.** Bohemia is at two. A third storey
is available if he wants it; a fourth is past where the literature says players
cope, on a desktop, in 3D, with a free camera. On a phone in top-down the honest
ceiling is probably lower.

---

## 3. WHAT THIS SUGGESTS FOR BOHEMIA — ALL [PENDING PAOLO], NOTHING BUILT

Ranked by how much they change a decision, per the rule the tally kill left behind.

**1. VERTICAL REACH PER WEAPON (FFT's `3v2`).** A shotgun should probably not
reach a rooftop the way a rifle does. Bohemia already has per-weapon lethality
gates and per-weapon muzzles, so the table exists. This makes the climb a
*loadout* decision as well as a positional one, and it is odds/reachability, never
damage — inside his ruling.

**2. THE ANGLE GRADIENT (XCOM's 44°→10°).** The audit's open finding is that at a
given range no direction is better than any other. XCOM's answer is a smooth
partial-flank bonus rather than a switch. In Bohemia that would have to be
expressed as **odds, not damage** — the shot pulls an easier needle pattern the
closer you get to a true flank, exactly the way point blank already does. That is
the one item here that closes a hole the audit actually named.

**3. A THIRD STOREY.** Cheap now that levels exist and the render is relative. The
literature says three planes is where players cap out, so this is the last one
that is free. Whether Bohemia wants it is a feel question, not a research one.

**4. ROOF-EDGE COVER.** Right now the deck is a killing floor with no cover at all
in either direction. JA2's roofs have parapets and prone. Giving the deck EDGE
cover would make the high ground a position you can *hold* rather than only a
position you shoot from once. This is the most likely thing to change how the deck
actually plays.

**NOT RECOMMENDED, ON THE EVIDENCE:** a height damage or accuracy bonus of any
kind. Ruled out by Paolo, and the DOS2 critique shows what happens when you do it
anyway.

---

## SOURCES

- [XCOM 2 / Aim Bonuses — StrategyWiki](https://strategywiki.org/wiki/XCOM_2/Aim_Bonuses)
- [Does having the "high ground" mean anything in XCOM? — Steam discussion](https://steamcommunity.com/app/268500/discussions/0/1732089092442761785/)
- [Cover (Long War) — UFOpaedia](https://www.ufopaedia.org/index.php/Cover_(Long_War))
- [Combat — Divinity Original Sin 2 Wiki](https://divinityoriginalsin2.wiki.fextralife.com/Combat)
- [The Flaws of Divinity: Original Sin II — Silver Age Rants](https://silverrants.wordpress.com/2017/10/10/the-flaws-of-divinity-original-sin-ii/)
- [Jump (Tactics) — Final Fantasy Wiki](https://finalfantasy.fandom.com/wiki/Jump_(Tactics))
- [FFT Battle Mechanics Guide — GameFAQs](https://gamefaqs.gamespot.com/ps/197339-final-fantasy-tactics/faqs/3876)
- [Jagged Alliance 2 — Jagged Alliance Wiki](https://jaggedalliance.fandom.com/wiki/Jagged_Alliance_2)
- [Jagged Alliance 2 Cult Classic Review — Turn Based Lovers](https://turnbasedlovers.com/review/jagged-alliance-2-cult-classic-review/)
- [Verticality — The Level Design Book](https://book.leveldesignbook.com/process/layout/flow/verticality)
