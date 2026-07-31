# BOHEMIA — HOW THE GREAT GAMES GIVE EVERY NPC AN *INDIVIDUAL* SCHEDULE
### Independent research, 7/31/26, on Paolo's ask. NO CODE.

> "Have u done research on how other greate games make everyone have their own
>  INDIVIDUAL SCHEDULE"

**HONEST ANSWER FIRST: NO, I HAD NOT.** The schedules the run and the CITY tab
now use came from the 7/19 session and I wired them without studying the field
myself. That session's bank
(records/BOHEMIA_LIFE_PLUMBING_RESEARCH_7_19_26.md) is real and good, but it
answers a **different question**: it covers the SIMULATION ARCHITECTURE — the
two-plane STALKER pattern, needs + smart objects, jobs-as-data, virtual
populations. It does not cover the AUTHORING problem, which is what he actually
asked about and which is the one we currently fail.

**OUR ACTUAL PROBLEM, stated plainly.** We have 297 people and **four**
archetypes: worker, scav, keeper, watch. Everyone in the valley is one of four
molds with a jittered wake time. That is not an individual schedule, it is four
schedules wearing 297 coats, and after ten minutes of watching a block you will
see it.

---

# PART 1 — THE FIVE WAYS IT HAS ACTUALLY BEEN DONE

## 1. ULTIMA VII — THE TIERED TEMPLATE (the origin, and still the right shape)
Ultima V introduced NPC schedules to RPGs; Ultima VII industrialised them.
Schedules live in one data file, `STATIC/SCHEDULE.DAT`, and **each NPC has at
least one and at most eight** schedule entries.

The design lesson is the one that matters most to us, and it is explicitly the
lesson their own developers describe: **shopkeepers share a base schedule, and
individuality comes from the FEW UNIQUE IDENTIFIERS attached to it** — this
NPC's home, this NPC's workplace — **plus per-NPC idle and weekend variants**,
where some wander the town and talk to other NPCs. The base is shared. The
*addresses* and the *edges* are personal.

**Why it works:** you are not authoring 300 schedules, you are authoring ~8
and 300 sets of coordinates. It is a template with a per-person address book.

## 2. KINGDOM COME: DELIVERANCE — EIGHT ACTIVITIES, ONE FILE, PER NPC
KCD is the modern benchmark for "everyone has a routine." Each NPC's `soul.xml`
carries **up to eight activities, each with its own start time**. Same ceiling
as Ultima VII, twenty-five years later, which is itself a finding: **eight
blocks is enough to read as a life.**

KCD2 quadrupled the population to ~2,400 NPCs with half of them in one city,
and solved it with **LOD for the AI simulation** — the same two-plane idea our
7/19 bank already named, but the important part is what they did NOT do: they
did not reduce the number of activities per person. They kept the routines and
made the *simulation* cheaper.

KCD2 also adds **DYNAMIC routines** — the day changes in response to events,
some player-driven, some not.

## 3. MAJORA'S MASK — HAND-AUTHORED, AND THE SCHEDULE IS THE CONTENT
The extreme opposite: a small cast, each with a **minute-by-minute
hand-written three-day schedule**, and the game hands you the **Bombers'
Notebook** — a 20-entry tracker showing when each person can be found and when
notable events fire.

Two findings, and the second is the bigger one:
- **The schedule is not flavour, it is the puzzle.** Anju and Kafei's quest
  chains multiple characters across the full three days; you solve it by
  knowing where people are.
- **THEY GAVE THE PLAYER THE SCHEDULE AS A UI.** A routine nobody can observe
  might as well not exist. Majora's Mask ships the notebook because the whole
  system is worthless if you cannot see it.

## 4. STARDEW VALLEY — CONDITIONAL SCHEDULES, KEYED AND ORDERED
Each character has a schedule file; each schedule has a **key** deciding when
it applies, and **the first matching key wins**. Keys cover season, day,
weather, marriage, friendship level, mail received, quest state.

**This is the cheapest individuality trick on the list.** One character can
carry a dozen small schedules and the world picks the right one. Individuality
comes from **which conditions a person responds to** — one NPC has a
rain-schedule, another does not, a third changes once you are friends.

## 5. SHADOWS OF DOUBT — PROCEDURAL, AND OUR CLOSEST SIBLING
An entire procedurally generated city where **every citizen gets a name, a job,
an apartment and a daily routine at generation time**, then runs **4 to 10
journeys per day** with paths computed dynamically.

This is the one whose problem is literally ours: nobody hand-authored those
citizens. Individuality is **generated from the person's own facts** — their
job, their address, their favourite bar — not from picking a mold.

## AND THE CAUTIONARY TALE — OBLIVION'S RADIANT AI
Oblivion let NPCs pursue needs (hunger, sleep) autonomously, and it produced
the famous disasters: NPCs killing whole towns, clearing out shops. Bethesda
**toned it down before release**, and Skyrim retreated further — NPCs still
chop wood and mind a forge, but without Oblivion's robust need-driven days.

**The lesson is not "don't simulate."** It is that **unbounded autonomy
destroys authored content**, and the fix everyone converged on is a schedule
that is a CONTRACT (this person is here at this hour) with autonomy only inside
the block.

---

# PART 2 — THE PATTERN UNDERNEATH ALL FIVE

Every one of them separates **the SHAPE of a day** from **the FACTS of a
person**, and gets individuality from the second, not the first.

| game | shared | individual |
|---|---|---|
| Ultima VII | ~8 base schedules | home, workplace, idle + weekend variants |
| KCD | activity vocabulary | up to 8 activities with per-NPC start times |
| Majora's Mask | nothing — all hand-written | everything |
| Stardew | the schedule format | *which conditions* you react to |
| Shadows of Doubt | the journey generator | job, address, favourite places |

**NOBODY AUTHORS 300 DAYS. THEY AUTHOR A GRAMMAR AND 300 ADDRESS BOOKS.**

Three multipliers do the actual work:

1. **PLACES, NOT ACTIVITIES.** "Goes to work" is one activity; it is a
   different life depending on *which* workplace, how far, and what is on the
   way. Ultima VII's insight, and the cheapest.
2. **CONDITIONS.** Weather, day, season, friendship, event state. Stardew's
   insight: two people with identical schedules are different people if one of
   them stays in when it rains.
3. **EDGES, NOT MIDDLES.** Ultima VII gives shopkeepers the same core and
   different *idle* and *weekend* behaviour. The distinctive part of a day is
   the beginning, the end, and the exceptions — not the eight hours of work.

---

# PART 3 — WHERE WE ACTUALLY STAND, MEASURED

`engine/bohemia_agents.js` `scheduleFor(seed, kind, shift)` produces:

- **4 archetypes** — worker / scav / keeper / watch
- **4-6 blocks** per day, within the industry's 8-block ceiling — FINE
- jittered times per person — real, and the reason the block does not surge
  as one, which was a Paolo correction on 7/19 and a good one
- `where: 'home' | 'work' | 'street'` — **three places, for everybody**

Against the table above:

| multiplier | industry | us |
|---|---|---|
| places | a named home + a named workplace + favourites | **home / work / street. Three abstract slots.** |
| conditions | season, weather, friendship, events | **none — the same day, every day, forever** |
| edges | per-NPC idle + weekend variants | **none — the mold is the whole day** |

**THE VERDICT: our SHAPE is industry-correct and our FACTS are empty.** The
block count is right, the jitter is right, the archetypes are a reasonable
grammar. What is missing is everything that makes a person *this* person.

**And the two we already own but do not use:**
- We now have a **person record with stable IDs and one derivation point**
  (7/29, the mass-edit ruling). That is exactly the address book the industry
  pattern needs, and it currently carries `archetype` and nothing else.
- We have **weather ruled in** (7/28: sunny > cloudy > rain) and **a real
  clock**, and no schedule consults either. Stardew's cheapest trick is sitting
  unplugged.

---

# PART 4 — WHAT THIS SAYS TO DO (proposals, not canon)

In cost order, cheapest and highest-impact first:

1. **GIVE EVERY PERSON AN ADDRESS BOOK.** Their home cell (have it), a NAMED
   workplace cell chosen from real nearby districts (the job lookup exists and
   is radius-limited), and one FAVOURITE place. Same four archetypes, instantly
   300 different days, because the walk is different for everyone. This is
   Ultima VII's whole trick and our person record was built for it.
2. **CONDITION THE DAY ON WEATHER AND THE CLUSTER.** Rain is ruled in and
   nobody reacts to it. A `stays-in-when-wet` flag on some people and not
   others is one boolean and two people become different. Same for whether
   their neighbourhood has power.
3. **AUTHOR THE EDGES, NOT THE MIDDLE.** A per-person morning habit and evening
   habit — the one who is always out first, the one who sits outside at dusk.
   Ultima VII's idle/weekend variants, and the part players actually notice.
4. **[PENDING Paolo] SHOW THE SCHEDULE.** Majora's Mask's notebook is the
   finding I did not expect: a routine the player cannot observe is wasted
   work. Whether Bohemia wants a "who is where" surface is a design call and
   his, not mine. But if we build individual schedules and never surface them,
   we will have paid for a system nobody can see.

**WHAT NOT TO DO:** unbounded need-driven autonomy. Oblivion shipped it, it ate
their own content, and every studio since has kept the schedule as a contract
with freedom only *inside* the block. Our I-MOVE-YOU-MOVE / 120 BPM laws
already push us the right way here.

---

## SOURCES
Ultima VII schedule format and the tiered-template design lesson:
[The Codex of Ultima Wisdom — SCHEDULE.DAT](https://wiki.ultimacodex.com/wiki/Ultima_VII_Internal_Formats_-_SCHEDULE.DAT),
[The Digital Lycaeum — NPC Schedules](https://lycaeum.ultimacodex.com/npc-schedules/).
Kingdom Come: Deliverance soul.xml, eight activities, and KCD2's AI LOD at
~2,400 NPCs:
[GDC — Supporting Thousands of NPCs in KCD & KCD2](https://schedule.gdconf.com/session/supporting-thousands-of-npcs-in-kingdom-come-deliverance-kingdom-come-deliverance-ii/915120),
[AI and Games Conference](https://www.aiandgamesconference.com/schedule/supporting-thousands-of-simulated-npcs-in-the-open-world-of-kcd2/),
[wccftech on dynamic routines](https://wccftech.com/kingdom-come-deliverance-2-dev-talks-about-dynamic-npc-routines-and-emergent-storytelling-for-side-quests/).
Majora's Mask Bombers' Notebook as a schedule UI:
[Zelda Wiki](https://zelda.fandom.com/wiki/Bombers'_Notebook),
[Zelda Dungeon](https://www.zeldadungeon.net/wiki/Bombers'_Notebook).
Stardew Valley conditional schedule keys:
[Stardew Valley Wiki — Modding: Schedule data](https://stardewvalleywiki.com/Modding:Schedule_data).
Shadows of Doubt procedural citizens, 4-10 journeys a day:
[ColePowered DevBlog 8 — Simulating a City](https://colepowered.com/shadows-of-doubt-devblog-8-simulating-a-city/),
[Grokipedia](https://grokipedia.com/page/Shadows_of_Doubt).
Oblivion Radiant AI's autonomy problem and Skyrim's retreat:
[What was Radiant AI, anyway? — paavohtl](https://blog.paavo.me/radiant-ai/),
[Grokipedia — Radiant AI](https://grokipedia.com/page/Radiant_AI).
