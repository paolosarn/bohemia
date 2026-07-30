# BOHEMIA ADDENDUM: MASS-EDIT THE PEOPLE (Paolo 7/29/26, LOCKED)

> "sure just make sure you do the coding right so when its time to mass edit
>  the people you can please"

Given as a condition on making the residents move. It is an ARCHITECTURE
RULING and it binds every future turn that touches people.

---

## THE LAW

**A PERSON IS A RECORD, NOT A SIDE EFFECT.** Every living body in the valley
has a STABLE IDENTITY and a set of NAMED FIELDS that can be read, filtered and
rewritten in bulk from ONE place. If a property of a person exists only as a
local variable inside a render loop, or is recomputed inline where it is used,
it cannot be mass-edited and it is a violation.

Concretely, four things are now required of any code that puts people in the
world:

**1. STABLE IDS.** A person has an id derived from the world seed and their
place, not from array order or spawn order. `nx:ny:i` under the ONE SEED. The
same person is the same person across sessions, across the RUN and the CITY
tab, and across a reload. Without this "mass edit" cannot even be expressed,
because there is nothing to address.

**2. ONE DERIVATION POINT.** Every field a person has — where they live, what
they look like, what archetype they are, what they do all day — comes from ONE
function. Changing that function changes everybody, immediately, everywhere.
No field may be computed at the point of use.

**3. AN OVERRIDES LAYER, AND IT IS THE ONLY PLACE EDITS LIVE.** Mass edits are
applied as RULES: a filter plus a patch. They are data, they are ordered, and
they are applied on read. Editing a person means adding a rule, never touching
the derivation. This is what makes an edit reversible, inspectable and
diff-able, and it is what stops the next change from being twelve scattered
special cases.

**4. IT MUST BE PROVED, NOT PROMISED.** The gate does not check that an
overrides table exists. It performs a REAL mass edit against a REAL filter and
asserts that every matching person changed, that no non-matching person did,
and that the change reaches the SURFACE Paolo looks at. "Mass-editable" is a
claim about behaviour and it gets measured like one.

---

## WHY THIS IS THE RIGHT CONDITION TO HAVE PUT ON IT

The population is ~300 bodies today and it is going to be edited constantly:
looks, clothes, archetypes, factions, schedules, who is armed, who is sick,
who belongs to whom. Every one of those is a bulk change over a filtered set.
Architecture that makes the FIRST version work but makes the TENTH version a
rewrite is the failure this ruling forecloses — and it is the same failure the
FACTORY LAW already names for art (typed spec, generator, batch output,
kill/approve pipeline). This is the FACTORY LAW applied to people.

It also protects a rule already on the books: MECHANISM-MINE /
CONTENTS-PAOLO'S. The overrides table ships EMPTY. The machinery to change
every scavenger in the valley at once is mine to build; what a scavenger IS
stays his.

---

## WHAT IT DOES NOT MEAN

- It does not mean every person is simulated. Density is still a FEELING
  (laws/BOHEMIA_ADDENDUM_HOW_MANY_PEOPLE_7_29_26.md); the record exists for
  everyone the census counts, whether or not a body is currently drawn.
- It does not mean people get names. Names are contents and are his.
- It does not fork the agent sim. engine/bohemia_agents.js still owns
  SCHEDULES; the person record REFERENCES a schedule, it does not reimplement
  one (ENGINE SYNC LAW).

## GATE
`gates/mass_edit_gate.js` — performs a real bulk edit and measures that it
landed, including on the drawn surface. A law without a machine gate is not
enforced.
