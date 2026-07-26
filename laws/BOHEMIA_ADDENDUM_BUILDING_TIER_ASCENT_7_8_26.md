# BOHEMIA — ADDENDUM: BUILDING TIER ASCENT (ACT CEILING × ECONOMY)
*7.8.26 — completes the tier model. The CITYBUILDER MODEL addendum (7.1.26) locked that buildings are ACT-gated and carry three texture states (apocalypse → recovering → modern, GDD v2 §20). This addendum locks the SECOND half Paolo specified: within an act's ceiling, a building's actual state is driven by the player's ECONOMY. Act sets the ceiling; economy decides if a building reaches it. This is the rule that makes two Act-3 cities look completely different.*

---

## THE MODEL (LOCKED, Paolo 7.8.26)

Every building has a **current_tier** in {1, 2, 3} and the world has a **max_tier** set by the current act.

```
current_tier = min(act_ceiling, economy_paid_tier)
```

- **Act sets the CEILING.** Act 1 ceiling = 1. Act 2 ceiling = 2. Act 3 ceiling = 3. You can never push a building above the act you're in.
- **Economy drives the ASCENT toward that ceiling.** Resource spend (the three-currency system: medicine, electricity, resources) is what actually lifts a building from its current tier toward the act's ceiling.

### What this produces
- **Rich Act 1 city:** a hardcore resource-base / industrialist run can shove *select* buildings to tier 2's texture-limited-by-act... no — corrected: in Act 1 the ceiling is 1, so early upgrading means bringing tier-1 buildings from *ruined/founding* condition up to their *best Act-1 form*. The tier-2 SPRITE is act-locked until Act 2. **Ascent inside an act = condition/quality; act advance = new tier ceiling unlocked.**
- **Act 2:** ceiling rises to 2. Buildings your accumulated economy can afford flip to their tier-2 sprite. A strong economy sees "a lot of buildings become Act 2 type." A weak one stays mostly tier 1 even in Act 2 — the city visibly lagged because you earned less.
- **Act 3:** ceiling rises to 3. The strongest economies unlock the showpiece tier-3 buildings — civilized Vegas. Poor economies reach Act 3 still looking half-rebuilt.

### Two Act-3 cities never look alike
Because ascent is economy-gated, two players who both reach Act 3 arrive with structurally different-looking cities depending on how hard and how well they ran the economy. **This is the roguelite replay value expressed in the skyline itself.**

---

## DATA MODEL (LOCKED — trivial to store, hard to narrate)

- Per building: **one byte** — `current_tier` (1/2/3).
- Global: `act_ceiling` (1/2/3), advances with the dynasty generation / act turn.
- Resource spend pushes `current_tier` up toward `min(act_ceiling, affordable)`.
- The 100-years-of-economics flavor is narrative dressing on top of a one-byte-per-building enum. **Hard to EXPLAIN, trivial to STORE.**

### Prefab cooker consequence (updates FACTORY LAW spec)
Every building is now a **triptych**: the cooker outputs three cooked sprites per structure —
```
<building>_a1  (ruined / founding / salvage-era)
<building>_a2  (stabilized / recovering / growing)
<building>_a3  (established / civilized / modern)
```
Instead of cooking one house, the cooker cooks `house_a1`, `house_a2`, `house_a3`. This **triples cook volume** and means the building factory (currently [PENDING Paolo's art-direction pick]) is now blocked on either three picks per building OR one crowned style with three defined decay/upgrade states. The asset-pack intake feeds all three eras: Act 1 pulls rusted salvage grit, Act 3 pulls cleaner rebuilt tiles.

---

## HOW IT STACKS WITH ALREADY-LOCKED CANON
- **Sits under the Mayor Arc:** mayor status controls WHERE/how cheaply you may zone/build; act-ceiling × economy controls what TIER each built thing reaches.
- **Sits under the CITYBUILDER MODEL (7.1):** that doc locked act-gating + "everything can genuinely be rubble." This doc locks the economy-driven ascent *within* the ceiling. Rubble is just `current_tier` never lifted off its floor because you never paid.
- **Three texture states (GDD v2 §20)** = the three cooked sprites here. Same three, now formally bound to `current_tier`.
- **Persistent consequence:** neglect persists — an un-upgraded building stays ruined for real, the same way violence and destruction persist.

## THE LIFE-LESSON TWANG (underneath, never preached)
A society's built environment is a frozen record of its economy. You can't fake wealth you didn't accumulate — the buildings tell the truth about how you ran things. Rich cities look rich because they *were*. Rome to Detroit: the skyline is economic history you can walk through.

---
## NO CLAWBACK — EARLY UPGRADES COMPOUND (LOCKED, Paolo 7.8.26)
Resource spent to upgrade a building is **never wasted and never reset**. If you push a building up an act early (the industrialist rush), it **stays up** and **carries forward** as a head start into the next act. Spend once, it sticks, it compounds.

- Act advance **raises the ceiling; it never claws back** what you already paid for.
- A building upgraded early is a permanent advantage into later acts — "whatever that head start turns out to be" (cheaper next-tier lift, prestige bonus, an unlock — the exact carry-forward payoff is [PENDING Paolo, but the PRINCIPLE is locked: early = only upside]).
- This kills the "re-spend each tier after an act turn" model entirely. There is no re-spend. `current_tier` only ever goes UP and stays.

Rewrites the ascent formula's spirit: `current_tier` is a **high-water mark**, never lowered by an act turn, only raised by act ceiling + your spend.

---
## STILL PENDING (Paolo's call)
- Building factory art-direction pick — now a pick of ONE style with three era-states, or three picks per building. **[PENDING, creative direction, Paolo's call.]**
- The exact carry-forward payoff of an early upgrade (cheaper next tier / prestige / unlock). Principle locked (early = upside), specific reward PENDING.
- The building catalog itself (which structures, their names, which act each tier-sprite unlocks) — inherited PENDING from the 7.1 citybuilder doc.

*Status: tier-ascent model LOCKED (act ceiling × economy = current_tier high-water mark, no clawback, early upgrades compound, one byte, triptych cooker). Art picks, carry-forward payoff, and catalog PENDING Paolo.*
