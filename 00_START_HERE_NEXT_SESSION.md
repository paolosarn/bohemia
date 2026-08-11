ART (f3eu53): 8/11 (a) LATEST -- *** THE TILE BOARD VERDICT IS IN: 14 FAMILIES
APPROVED (475 TILES), 3 KILLED. "Im so impressed." WIRING IS NOW THE LANE'S
WHOLE JOB. ***
Records: records/BOHEMIA_TILE_BOARD_VERDICT_8_11_26.txt +
records/BOHEMIA_TILE_BOARD_KILLS_POST_MORTEM_8_11_26.md

UP (14, banks now carry the APPROVED law line, volume unlocked): block wall,
corrugated+roll-ups, parking lines, chain-link, sports fields, empty pools,
storefronts, brick, train tracks, freeway, flat roofs, mobile homes, crop
fields, deck stairs. The 9 duplicate forms covered by these banks inherit the
approval.

DOWN (3, GRAVEYARD FINAL, banks + cooks removed, proofs kept as evidence):
- The landfill (55 tiles). TF-WORLD-012's coverage died with it - REOPENED.
- The three money icons: measured laws all passed and he killed them anyway;
  green is never the argument. Fresh cook sources from BOUGHT art.
- The contact shadow: a motion feature judged as a still. A fresh answer gets
  judged WIRED and WALKING. The slot (bodies float) stays real.
Graveyard lines added for all three bank names.

SURFACES: the TILE BOARD page is now the RECORD (14 cards, APPROVED badges, no
thumbs, no export); ART tab banner says VERDICTS IN; the LIFE hub card is
removed (answered questions fall off the to-do list) with the ANSWERED
exemption recorded in name_the_tab_gate.

*** NEXT (the GO list, in order): WIRE THE APPROVED FAMILIES INTO THE WALKED
WORLD. Biggest wins first: flat roofs (86 tiles, every commercial building top),
corrugated skins (warehouse district), chain-link + parking lines (every lot),
train tracks (railyard), deck stairs (needs TF-CMB-004 slab cooked to join).
Each wiring is per-district legend work + its district gate; interior=exterior
and occupancy laws apply. Then fresh cooks for the two live dead slots (icons
from bought art, shadow wired-and-walking). ***

ART (f3eu53): 8/9 (u) -- *** BOARD RESUMED INLINE: +2 COOKS (THE THREE
MONEY ICONS + THE CONTACT SHADOW), +10 DUPLICATE FORMS CLOSED. THE SITTING IS
NOW 17 FAMILIES / 537 TILES. ***
Record: records/BOHEMIA_TILE_BOARD_SITTING_8_9_26.md (second-pass section)

CHARACTER (0lurbs): 8/9 (j) LATEST — *** "THUMB THUMB THUMB EVERYTHING IS A THUMB."
READ laws/BOHEMIA_ADDENDUM_EVERYTHING_IS_A_THUMB_8_9_26.md BEFORE YOUR NEXT REPLY. ***
He said it after I handed him a numbered list of TWELVE things needing his verdict
plus a question asking him to choose how I should approach the next build. Twelve
votes and a process decision, in one reply, from ONE lane, on a day he had already
said five times that he was tired. He never asked to run an approvals process. He
asked for a game, and we turned him into the queue that blocks it.
THE DEFAULT FLIPS: APPROVE-BEFORE becomes CORRECT-AFTER. Claude DECIDES, builds it,
and puts it in the game where he meets it while playing. He reacts to a thing that
EXISTS; he does not authorise a thing into existence. His corrections are better
than his thumbs anyway ("the cornrows is not one pixel of skin two pixels of hair",
"that grenade throwing was dogshit") and they cost him nothing, because he was
PLAYING when he gave them.
ONLY THREE THINGS STILL GO TO HIM: identity/names he reserved (MECHANISM-MINE /
CONTENTS-PAOLO'S is untouched), a genuine fork with no defensible default (pick one,
SAY you picked it and why, build it), and anything he asked to see.
BANNED: a numbered queue of pending verdicts in a reply; asking him HOW to do the
work; blocking on a thumb; and surfacing something half-finished as a "candidate" so
the risk of it being bad becomes his.
THE BAR GOES UP, NOT DOWN. Under APPROVE-BEFORE a lane could ship something mediocre
and let the thumb sort it. Under CORRECT-AFTER, whatever you decide is what he plays,
so the standard for "done" is now the standard for "in the game" — MORE looking at
the real surface, not less. STOP PRODUCING still binds: this is permission to make
ONE version and stand behind it, never four.
THE JUDGE PAGES STAY and stay good. When he WANTS to sweep a batch he is entitled to
a good tool, and the 130-of-130 SFX sitting proves he will. What changes is that they
stop being the GATE. And the already-surfaced backlog does NOT get re-asked: under
STALE UNJUDGED IS DEAD it is ours now, to decide, kill or ship. Do not hand him that
list again.
THE TELL: if a reply ends with a list of things he must rule on, the turn failed no
matter how much shipped. A turn he can answer with "cool" is a good turn.
CLAUDE.md's VERDICT WORKFLOW section carries this at the top now.

I ALSO APPLIED IT IMMEDIATELY RATHER THAN JUST FILING IT: my own open question was
"do I show you family-cast candidates or do you describe them first?" That question
is now withdrawn and answered by me. Canon already fixes the cast (ACT1 OPENING
VISION 7/19: father wakes you, sister is lost, older brother survives, it ends saving
the mother, with the sibling mirrored by player gender). I build the four, put them
in the game, and he corrects them. Names stay his.

# START HERE — NEXT SESSION

**Last written: 8/11/26, COMBAT lane.**
Read `CLAUDE.md` first, then this.

---

## WHERE THE COMBAT LANE IS

Two ships today, both measured on the real surface, both on main.

### 1. THE GUNS MOVE (v136)
There was exactly one piece of code that ever moved a man with a gun, and it
opened with `if(e.gcov)continue;` — every shooter ran to the nearest rock once
and then never moved again for the whole fight. Melee had advanced every turn
since 7/19; only the guns were nailed down. That is why standing still was
correct play, which is what Paolo called out on 8/8.

`pressAI` now scores every tile a shooter could reach against staying put:
getting an angle on the player is the big prize (a shooter you are covered from
has *no* hit chance, not a reduced one), closing is worth what the game's own
range function says, and ending behind stone beats ending in the open. Half the
line bounds per turn, most-to-gain first; the rest hold and shoot.

Measured, 120 distinct arenas, 6 turns of standing still: cover 1.86 → 0.78,
range 10.35 → 7.74 tiles, clean lines 4.41 → 5.49 of 6.27, incoming **+45%**.

### 2. HOLD THE LINE (v137)
v135 shipped the cold open's defend contract and never sent it to the fight, so
a "defence" could not be lost. Now the place is real world state carried by
`worldShift`, derived opposite the threat bearing, and hostiles pull toward it
and are allowed past you to reach it.

Measured, 80 distinct arenas: **ignore them → 77/80 defences lost at 100/100 HP**
(avg 8.6 turns). Kill them → 0/80. The 3 survivors all had a live blade.

### 3. THE LAW
`laws/BOHEMIA_ADDENDUM_STOP_ASKING_IF_IT_IS_FUNNER_AND_REAL_DO_IT_8_11_26.md`
(Paolo 8/11, LOCKED). Two-key test: funner AND realistic = build it, no
question. Never overrules mechanism/contents, MAP LAW, the graveyard, or a
rejection. Gate: `gates/no_bullshit_questions_gate.py`, in the suite.

`gates/combat_lab_gate.js`: 713 → **736** checks.

---

## TWO THINGS THAT BIT ME. DO NOT REPEAT THEM.

**THE ARENA DICE SEED ONCE PER PAGE LOAD.** `BohemiaArena.withDice` reuses one
seed, so a loop calling `setupCombat()` 120 times measures **the same arena 120
times**. The tell is clean whole numbers ("3.00 guns") where random data cannot
produce them. Call `BohemiaArena.set(...)` before every sample. My first v136
numbers were wrong because of this and the record carries the correction.

**A CLIFF IS NOT A MAGNET.** My first hold-the-line scorer gave a bonus once a
man got close, which meant *entering* that zone cost him his angle bonus — every
man stalled exactly on the boundary and it made the feature worse (5/60). The
fix was deleting the boundary, not adding a number on top. Gated now.

---

## STILL OPEN IN THIS LANE

1. **Blades ignore the objective.** Melee runs its own locked 7/19 turn; a knife
   man closes on you, never past you. 3 of 80 defences survive on this. Not
   worth opening a locked law for; worth knowing.
2. **The two-storey other half** — on the deck the lot recedes. Blocked by draw
   order: the deck draws at ~line 85 of `drawField` but blood (~260), pillars
   and cars (~267) and litter (~542) draw after it.
3. **Jumping off the deck**, and a third death fall.
4. **Misses permanently chipping the world** (research proposal #4).
5. **The grenade minigame is PARKED** at Paolo's instruction. Do not restart it.
   The 8/5 fuse-bar version is in the graveyard and no variation may be rebuilt.

---

## PENDING PAOLO — NOTHING IS BLOCKED ON HIM

He has one standing instruction and it is not a question: *"IF IT MAKES THE GAME
FUNNER AND REALISTIC DO IT."* Run the two-key test and build. Do not hand him
lettered menus or build-language questions; the gate will fail the ship.

---

## SHIP FLOW THAT ACTUALLY WORKS HERE

`git fetch origin main` and branch from it BEFORE working. A COMBAT_B64-only
change is cleared by `combat_lab_gate.js`, `combat_runs_smoke.js`,
`alpha_loads_gate.js`, `front_door_gate.js`, `combat_anim_gate.js`,
`taste_gate.py` and `no_bullshit_questions_gate.py` (~90s). Fetch again; if main
moved, take main's alpha wholesale and **replay the patch tools onto it** — they
are all idempotent and that is exactly what they are for. Re-gate, push straight
to main. No pull requests, ever.

`COMBAT_B64` uses SINGLE quotes: `r"const COMBAT_B64\s*=\s*'([^']+)'"`. And the
markers live INSIDE the base64 — grepping the raw HTML for them finds nothing
and means nothing. Decode first.
