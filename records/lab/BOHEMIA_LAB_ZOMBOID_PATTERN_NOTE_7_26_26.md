# LAB 04 — PATTERN NOTE: WHAT MAKES RUMMAGING A HOUSE FEEL LIKE RUMMAGING

Lane: LAB. Law: `laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md`
Playable: `slices/lab/BOHEMIA_LAB_ZOMBOID_HOUSE_7_26_26.html`
Numbers: `records/lab/BOHEMIA_LAB_ZOMBOID_TEARDOWN_7_26_26.txt`
Gate: `gates/lab_gate.js`

Backlog LAB-2, Paolo's words: "containers, search, weight, the tension of
rummaging a house."

---

## 1. THE PLAIN-ENGLISH VERSION

The tension he asked about is three cheap ideas stacked, and none of them is a
search minigame.

1. **What is in a container depends on what KIND of container it is, not just
   which room.** A kitchen counter and a kitchen crate pull from completely
   different lists. Put a crate in a bedroom and it pulls a third list. So a
   container is a promise, and the player learns to read furniture.
2. **Every table rolls junk separately, on purpose.** A dead mouse comes out of
   the canned-food cupboard because the canned-food table has its own junk roll.
   The game is deliberately spending your time on nothing. That is the whole
   feeling of rummaging, and it is one extra roll.
3. **Time is charged by weight.** A pot costs three times what a can costs and
   thirty times what a bandaid costs, capped so nothing takes forever. There is
   no search timer. The clock is the loot.

And the one I got wrong on the first read, which is the best finding in the file:
**the game charges you for ORGANISING, not for GRABBING.** Snatching something
off a shelf is a flat cost no matter how loaded you are. Deciding what to keep,
moving it into your bag, is where the fullness tax lands, up to two and a half
times slower when the bag is nearly full. Snatching is cheap, curating is
expensive. That is exactly the right way round for a looting game and it is a
single if-branch.

---

## 2. THE PATTERNS, NAMED

### P1. THE CONTAINER IS THE CONTRACT
Loot is keyed on (room, container type). Not on a level, not on a rarity tier.
Furniture becomes readable, and placing furniture becomes content authoring.

### P2. JUNK IS A SEPARATE ROLL
Not a low-value entry in the good list: its own list with its own roll count.
Cheap to author, and it is the entire texture of searching.

### P3. RARITY IS JUST A SMALL NUMBER IN THE SAME LIST
A skill book at 0.005 next to towels at 8, in one weighted list. No rarity
system, no separate pass. Five orders of magnitude in one array.

### P4. ONE TABLE, MANY PLACES, DIFFERENT ODDS
The same canned-food table appears in four container types at four different
chances. Authoring effort scales with the number of TABLES, not the number of
places.

### P5. WEIGHT IS TIME, AND IT IS CAPPED
Cost = min(weight, 3). The cap is what keeps a heavy haul from becoming a
punishment.

### P6. CHARGE FOR ORGANISING, NOT FOR GRABBING
The fullness multiplier only applies between two containers on your body.

### P7. DROPPING IS ALMOST FREE
x0.1 to dump from your hands. Encumbrance is a decision because the escape hatch
is always open.

### P8. ONE TRAIT NUMBER RESHAPES EVERY INTERACTION
0.5 or 2.0 on the whole time economy. A character trait that touches everything,
authored once.

---

## 3. WHAT BOHEMIA SHOULD TAKE (recommendations)

We are not adding survival looting. These are the shapes.

1. **THE CONTAINER IS THE CONTRACT (P1) — for our SEARCH verb.** A dead Vegas is
   full of furniture. Keying what you find on (district, container kind) instead
   of on a global loot level makes the city readable: a motel nightstand should
   promise something a warehouse crate does not. This lands on our existing
   tilespec dossiers, which already name every tile's kind.
2. **JUNK IS A SEPARATE ROLL (P2).** The cheapest possible way to make searching
   feel like searching instead of shopping. It also fits the fiction: a picked
   over city is mostly junk.
3. **CHARGE FOR ORGANISING, NOT GRABBING (P6) — and this one is nearly free for
   us.** Paolo has already ruled that the world moves when you spend time on an
   action. Making a grab cheap and a sort expensive gives that ruling teeth
   immediately, and it needs no new UI: it is two numbers in the action cost
   table he has not written yet.
4. **WEIGHT IS TIME, CAPPED (P5).** If we ever price carrying, price it in time
   rather than in a speed penalty. Speed penalties feel like punishment; time
   costs feel like a decision, because the player can always choose to spend it.
5. **ONE TRAIT NUMBER (P8).** A single multiplier per character on the whole
   interaction economy is the cheapest characterisation we can buy.

## 4. WHAT NOT TO PORT

- **Survival looting itself.** No hunger, no weight-based stamina, no container
  capacities. Not asked for.
- **Their content.** The tables in the emulation are theirs, embedded verbatim
  and declared, purely so the mechanism can be felt with real data. Bohemia's
  contents are Paolo's.
- **The movement penalty for being overloaded.** It is Java-side, I did not read
  it, and I am not going to guess at it.
- **A search minigame.** There isn't one. That is the point.

## 5. HONEST LIMITS

- Three mechanics, each closing. No zombies, no noise, no attention, no combat,
  no hunger, no crafting, no item condition.
- Item weights, the hands and bag sizes, and the ticks-per-second conversion are
  OURS and declared. Everything else is cited to file:line.
- `ignoreZombieDensity` exists in the real tables and is read and cited but not
  modelled, because zombie density is not in this emulation.
- THE VIEW IS A WHOLE-HOUSE FLOOR PLAN, not a camera on the player. That is a
  deliberate choice for a looting reference (you can see the room-to-container
  layout, which IS the mechanic) but it leaves dead space on a phone, and it is
  not the shape a real Bohemia surface should copy.
- Section 1 and 2 are facts about their code. Section 3 is my opinion.
- I got the encumbrance rule wrong on the first read and the record says so
  rather than quietly shipping the corrected version.
