# WHAT WE ARE MISSING ABOUT FACTIONS — the research (8/2/26, PEOPLE lane)

Paolo, 8/2: *"okay its just the beginning though. do big brain online research to find out
what about factions we are missing."*

Sixteen dossiers say WHO the factions are. Every gap below is about what a faction DOES,
and every one is a real finding with a source, not a wishlist. **All twelve are
PROPOSALS.** Judge them in the **LIFE tab**, card "WHAT FACTIONS ARE MISSING".

---

## FIRST: THE COLOURS WERE ALREADY CHOSEN AND I DID NOT LOOK

Paolo, 8/2, having to say it twice: *"BRO WE ALREADY CHOSE COLORS FIND IT IN THE PROJECT."*

**He was right and I went and found it.** Every faction has carried an **accent colour AND a
motif** in the alpha's `MFACTIONS` table since the faction songs shipped. Judged, live, his.
I proposed a parallel set off a research argument without ever opening the file — which is a
**REUSE-FIRST violation** with his name on it, and the second time in one day I solved a
problem by inventing instead of looking.

| faction | HIS colour | HIS motif |
|---|---|---|
| **CUSTOM** | `#6a5d46` | `plain` |
| **REDS** | `#c0392b` | `stripe` |
| **BLUES** | `#2e6fae` | `grid` |
| **ANARCHISTS** | `#c026a0` | `shard` |
| **COLORFUL** | `#e85aa0` | `confetti` |
| **CHURCH** | `#d8a23a` | `aisle` |
| **NETWORK** | `#1fbf9c` | `circuit` |
| **TRADES** | `#d07a2a` | `plate` |
| **CARAVANS** | `#caa05a` | `dust` |
| **VOLUNTEERS** | `#5aae6a` | `cross` |
| **REMNANTS** | `#9aa23a` | `stencil` |
| **CARTEL** | `#a01818` | `hazard` |
| **MOB** | `#caa83a` | `check` |
| **HOMELESS** | `#b8642a` | `cracked` |

**THE DOSSIERS NOW READ THAT TABLE OUT OF THE ALPHA AT GENERATE TIME.** Nobody retypes a
colour, so nobody can drift off the one he picked. The gate fails any dossier that invents
its own.

**AND THE MOTIFS ANSWER GAP 1 BEFORE IT WAS ASKED.** "Factions have no mark" was the first
gap on the sheet he thumbed WANT — and he had already picked all fourteen marks: *stripe,
grid, shard, confetti, aisle, circuit, plate, dust, cross, stencil, hazard, check, cracked,
plain.* They just have never been drawn.

### THREE THINGS IN HIS OWN TABLE HE SHOULD SEE, REPORTED AND NOT TOUCHED

1. **THE ANARCHISTS' MAGENTA `#c026a0` READS PURPLE** on the purple-reservation test — red
   and blue both clear green by more than 25. So does the Colorful's pink `#e85aa0`. Both
   have been live in the alpha for weeks and the purity sweep never caught either, **because
   that sweep only ever looked at art pixels and never at a colour written in code.** That is
   a real hole in the machine regardless of what he decides about the colours.
2. **FOUR FACTIONS SHARE ONE BAND.** Caravans `#caa05a`, Trades `#d07a2a`, Homeless
   `#b8642a` and Church `#ffd75c` sit within a few degrees of hue and a tenth of value of
   each other. Trades and Homeless are **4 degrees and 0.05 apart** — on a body those are the
   same person. It matters far less in a music-tab gradient than it will on a walking NPC.
3. **HE HAS TWO COLOURS FOR SIX FACTIONS.** The 7/21 clothing rulings and the faction-table
   accents differ in hex for Reds, Cartel, Church, Mob and Colorful — **and agree on family
   every single time**, with Caravans byte-identical in both. Both sets are his, so both
   stand and the gate reports rather than picks. Collapsing them to one number is a one-word
   call whenever he wants it.

**STILL OPEN:** the veteran KITS were written against my wrong colours (bone for the
Volunteers, black for the Anarchists) and want a re-pass against his real ones. Flagged, not
silently rewritten.

## THE TWELVE GAPS

### 1. FACTIONS HAVE NO MARK
We have colours. We have **no symbol** — nothing painted on a wall, stitched on a sleeve,
or scratched into a door. Heraldry exists for exactly this reason: recognition when faces
are hidden. **The real design constraint is a great one:** *if a symbol cannot be painted
quickly, scratched into wood, or roughly stitched onto cloth, it is too complex.* In a
valley with no printing, that rule is not a style guide, it is physics. A mark also
becomes **territory** the moment somebody sprays it on a wall — which is how real groups
claim ground.

### 2. THE RANK AND FILE ARE WALLPAPER — *the single biggest finding*
The 2024 FDG paper on faction systems (AlJammaz, Wardrip-Fruin, Mateas) says it plainly:
faction games script their **leaders** heavily and leave the **background NPCs who
actually constitute the faction** with little or no role. That is the number one reason
faction systems feel fake. **We are unusually well placed to fix it** — this lane already
ships 268 derived people with schedules, jobs, homes and faces. Not one of them currently
behaves like a member of anything.

### 3. REPUTATION IS GLOBAL AND INSTANT — the documented failure everywhere
The known complaint across the literature: NPCs know about distant deeds with no narrative
route for the news to have travelled. The researched fix is **reputation that spreads from
WITNESSES**, with NPCs remembering and sharing what they personally observed, forming
subjective opinions rather than reading one global morality score. **WE ALREADY HAVE THE
HARD HALF** — a witness/memory system with sightings and clarity decay. Nothing connects
it to factions.

### 4. NO REDEMPTION PATH
New Vegas's most-cited flaw: reputation can never be removed, only offset by a larger
opposite value, so there is no honest road from Hated back to Neutral. One bad night is
permanent. **Any standing we build needs a way back**, and it should cost more than it did
to fall.

### 5. NO DISGUISE — and this is the direct payoff of his colour ruling
If colours identify you, **wearing another faction's colours has to do something.** Real
groups' colours "signal identity to allies while provoking rivals" — that is the whole
point of a colour. Wearing the wrong one should get you treated as theirs, and get you
killed when somebody who knows your face sees you in it. We built the colours today and
they currently mean nothing mechanically.

### 6. FACTIONS DO NOTHING WHEN YOU ARE NOT LOOKING
RimWorld, Dwarf Fortress and Songs of Syx all simulate factions that pursue goals, fight
each other and suffer internal strife **independently of the player**. Ours are static
entries. A faction with no agenda is set dressing with a flag.

### 7. NOTHING COSTS ANYTHING — no zero-sum
A system where every faction can be maxed has no stakes. Helping one should cost another —
**though not universally**, and canon already carved the exceptions: the Volunteers are
untouchable, the Caravans are protected-neutral, the Trades are politically neutral. Those
three exemptions are what make the rest of the trade-offs mean something.

### 8. YOU CANNOT JOIN, LEAVE, OR BE THROWN OUT
There is no membership at all. No initiation, no defection, no expulsion — and canon
already has the sharpest version of it built in: **the player's Custom faction is supposed
to emerge from three generations of action**, which is a membership arc with no
membership system underneath it.

### 9. EVERY FACTION IS A MONOLITH
Real groups contain factions. **Canon already says ours do** — the four social forces sit
*inside* other factions by design, which is a whole internal-politics layer that exists on
paper and nowhere else.

### 10. THE PLAYER CANNOT SEE WHERE THEY STAND
No surface tells you what any faction thinks of you or why. Standing that the player
cannot read is standing that cannot be played around.

### 11. NOBODY HAS EVER GREYSCALE-TESTED THE PALETTE
The accessibility standard is to **check faction palettes in greyscale** (does value alone
separate them?) **and through deuteranopia/protanopia/tritanopia simulators.** We have
never done either. The new gate does the value half; the colourblind half is unbuilt.

### 12. FACTIONS ARE NOT ON THE MAP
Bases were seated by an even stride down the district list, so all 14 sit on one-cell
suburb tracts. Whether a faction's ground should match its trade is his call; the machinery
is a small change. *(Already logged as a discovered item; repeated here because it is the
same wound.)*

---

## WHAT I AM NOT DOING WITH THIS

**Building any of it.** `laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_7_31_26.md` turned faction
machinery off — *"no standing ledger, no territory model, no faction beats"* — and STOP
PRODUCING says finding a legal way to ship a frozen thing IS the violation. He asked what
we are missing; this is the answer, and it stays a list until he says otherwise. The gate
re-asserts every run that no faction machinery grew.

**Ranking them for him.** If pressed: **2, 3 and 5** are the three that would change how
the valley feels most per unit of work, and all three lean on machines this lane has
already built (derived people, the witness memory, the dress system).

---

## SOURCES

- [Navigating Faction Systems: Insights and Recommendations for More Believable NPCs in Video Games (FDG '24)](https://dl.acm.org/doi/10.1145/3649921.3650012) — the rank-and-file finding, and reputation from remembered/shared observation
- [Designing agent-based factions in video games (Oral, DiVA)](https://www.diva-portal.org/smash/get/diva2:1948199/FULLTEXT02.pdf)
- [Fallout: New Vegas and the Faction System](https://blogofarcanesecrets.wordpress.com/2017/09/07/10-good-ideas-fallout-new-vegas-and-the-faction-system/) and [the reputation reference](https://fallout.fandom.com/wiki/Fallout:_New_Vegas_reputations) — no-redemption, and the crime/action weighting problem
- [Kenshi faction reputation discussions](https://steamcommunity.com/app/233860/discussions/0/1741100729963391355/) — the rollercoaster failure mode
- [How do I design factions with recognizable visual identities?](https://www.faes.ar/post/how-do-i-design-factions-with-recognizable-visual-identities) — three layered signals, greyscale + colourblind testing, silhouette over logo
- [Patterns of Distinction](https://www.campaignmastery.com/blog/patterns-of-distinction/) — heraldry, and the paint-it-scratch-it-stitch-it constraint
- [Gang colors — sociology of the marker](https://grokipedia.com/page/Gang_colors) and [gang signals](https://en.wikipedia.org/wiki/Gang_signal) — colours as rapid identification, allies vs rivals, sub-signals inside a colour
- [RimWorld factions](https://rimworldwiki.com/wiki/Factions), [Dwarf Fortress factions](https://dwarffortresswiki.org/index.php/DF2014:Faction) — factions with independent agendas
- [A player reputation system based on belief formation among NPC societies](https://www.sciencedirect.com/science/article/abs/pii/S1875952123000204) and [Systems for Player Reputation with NPC Agents](https://www.researchgate.net/publication/281380828_Systems_for_Player_Reputation_with_NPC_Agents) — local vs global dissemination, gossip distortion
- [Games with the best faction systems](https://www.thegamer.com/games-best-faction-systems/) — Mount & Blade and STALKER as the dynamic-simulation bar

---

*BOHEMIA — what we are missing about factions — 8/2/26 — PEOPLE lane*
*Twelve gaps, all researched, none built. And every faction has a colour, because he said so and the research agreed with him.*
