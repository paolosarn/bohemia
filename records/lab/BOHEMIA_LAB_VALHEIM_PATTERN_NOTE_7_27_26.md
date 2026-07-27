# LAB 05 PATTERN NOTE — WHY VALHEIM'S COMFORT LOOP IS THE BEST SURVIVAL IDEA IN GAMES

7/27/26 · LAB lane
page: `slices/lab/BOHEMIA_LAB_VALHEIM_COMFORT_7_27_26.html`
numbers: `records/lab/BOHEMIA_LAB_VALHEIM_TEARDOWN_7_27_26.txt`
commissioned by Paolo 7/27/26, who named the three mechanics himself and said he
will rule Bohemia's survival system off the feel, not off a document.

**This is a MODEL, not a measurement.** Valheim ships as a compiled DLL. Two
constants are real source (from ValheimPlus's Harmony patches, which name the
vanilla values they overwrite); the rest are documented and tagged one by one in
the teardown. That distinction is on the page's own face, and the gate enforces it.

## FEEL STATEMENT, WRITTEN BEFORE THE CODE
Valheim's comfort loop feels like **your camp making you physically stronger**.
You do not fight the survival system, you invest in it: you eat three things, you
sit by your fire for twenty seconds, and the rug you put down last night is why
you can make it to the mountain and back today.

## THE FIVE MECHANISMS WORTH TAKING

### 1. FOOD IS A BUFF, NOT A METER YOU FEED
There is no hunger bar in Valheim. Food does not stop a countdown to death — it
RAISES YOUR CEILING. Three slots, each adding max health and max stamina for tens
of minutes. Empty stomach is 25 health: weak, alive, and free to keep playing.
**For us:** a survival system with no nagging is possible. The punishment for not
eating is that you are small, and being small is felt the moment you try to do
something. Nothing chases you. Nothing beeps.

### 2. THE BUFF DECAYS, SO THE CEILING SAGS
A food's contribution shrinks with its remaining time, so your max health bar
visibly retreats over twenty minutes. You are never told to eat; you just notice
you have got smaller. **For us:** this is the honest version of a timer. A shrinking
ceiling is information, not an alarm.

### 3. THREE SLOTS IS THE WHOLE INVENTORY DECISION
Because you may only carry three buffs, food choice is a real build: 80 health of
serpent stew or 45 stamina of carrot soup. And the top-up-below-half rule stops
you from spamming the best food. **For us:** a hard slot count turns a table of
consumables into a decision without needing a single extra system.

### 4. A TWENTY-SECOND RITUAL, IN A PLACE
Rested is not a button. You have to BE somewhere — near fire, under roof — and
stay there for twenty seconds. It is the cheapest possible way to make a place
matter mechanically. **For us:** the same shape says "your block is your block":
stand in it, in the light, and you leave stronger. It also gives a home a
mechanical reason to exist that is not storage.

### 5. AND THE BIG ONE: COMFORT — DECORATION IS A STAT
`comfort = 1 + the highest item in each CATEGORY within 10 m`, and the comfort
number IS how many minutes Rested lasts (480 s + 60 s per level). A rug is a
minute. A round table is two. A second rug is nothing.
This is the best idea in the whole loop, and it is three lines of code:
- **it makes furniture mechanical without making it a stat stick** — a rug is a
  rug, it just also matters;
- **the CATEGORY rule kills the exploit** — you cannot floor a room in rugs, you
  have to want variety, which is exactly what makes a room look like a room;
- **the radius makes a SPOT** — 10 m means your camp has a heart, and that heart
  is the fire.
**For us:** Bohemia already has districts, interiors that match their footprints,
and a light-is-territory law. A comfort sum inside a radius is the mechanism that
makes DRESSING YOUR OWN PLACE pay you back, and it hands the player a reason to
care about a chair. LIGHT=TERRITORY plus comfort is a very short distance.

## HOW THE THREE SIT TOGETHER, WHICH IS WHY IT IS A LOOP AND NOT THREE SYSTEMS
- **comfort** decides how long **rested** lasts,
- **rested** decides how fast you recover what the trip costs,
- **food** decides how big you are while you are out there,
- and the mountain decides whether all three were enough.

Take any one away and the other two stop mattering. That is the test a survival
system has to pass, and it is the thing our own systems should be checked against.

## WHAT NOT TO PORT
- **Their numbers as canon.** Every food value, the 8 minutes, the 20 seconds, the
  17 cap: all theirs. Bohemia's are Paolo's to rule after playing.
- **The freezing death spiral.** The mountain here drains health because he asked
  for somewhere dangerous. NO DAMAGE BEFORE THE DIAL still stands: our failure
  state is a blackout, not a corpse, and no fight exists on this page.
- **Eitr and the magic axis.** Real, named in the source, deliberately unbuilt.
- **A cooking-station tech tree.** The fire cooks; that is the whole crafting
  surface here, on purpose.
- **Sitting as an input.** Standing still is enough of a ritual on a phone.
- **Hunger.** Valheim does not have one and it is stronger for it. Worth saying
  out loud before anyone adds one to Bohemia.

## HONEST LIMITS
- **It is a MODEL.** Two constants are sourced, forty-odd are documented. If a
  wiki table is wrong about a food, this page is wrong about that food, and no
  gate can catch that. What the gate CAN catch — and does — is a number losing
  its tag, or the page and the record disagreeing.
- The food-decay curve is modelled linear and vanilla's real curve is inside the
  DLL. The base regen rates are mine (declared), for the same reason.
- Placement of furniture is not a mechanic here: items ring the fire
  automatically. Valheim's real building is a whole game and the comfort rule is
  what was asked for.
- Flat top-down placeholder art at 26 px tiles. It says nothing about how any of
  this looks in Bohemia's world, and it is not trying to.
- The mountain is cold and empty. Without wolves it tests the buffs' MATH, not the
  fear that makes Valheim's mountain famous.

## ANSWERED 7/27/26 — HE RULED, AND THE ANSWER WAS YES WITH CHANGES
The question this page asked was whether a camp that makes you stronger belongs in
Bohemia. It does: "awesome so i am in love with the mobile camp idea... i liked
this valheim shit alot."

But he changed five things in the same breath, and they are now law in
`laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md`:
1. **the camp is MOBILE** — carried and set down, never a fixed base;
2. **the timer is TILES MOVED, not seconds** — a buff may not burn while you stand
   still, which is the single biggest departure from the page above;
3. **no food items and no food crafting** — one clumped pool (water + food +
   build), camp actions spend it, loot adds to it;
4. **the magnitudes are tiny** — "plus 1 or 2 or 3 stamina points type shit",
   Rogue Fable IV's register. Valheim's 25 -> 148 health is explicitly out;
5. **the camp is a medical station** — bandage, gauze, and a COMPANION pulling a
   bullet out of you, which is the first ruled mechanical job a companion has.
Verdict: `records/BOHEMIA_LAB_VALHEIM_VERDICT_7_27_26.txt`.
His ruleset is playable at `slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html`,
where every value he did NOT set is a dial rather than a guess.
What is still [PENDING Paolo] is listed in the addendum, clauses (a) to (g).
