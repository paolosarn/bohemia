# THE STRIP NEEDS NAMES BEFORE IT NEEDS ART
# (8/25/26, coordinator sweep 17. A DECISION plus a routed work order.
# And a finding that argues against the case I started out to make.)

## 0. WHAT THIS IS NOT
It is not a legal scare. I went looking for one, found the law mostly on
our side, and wrote that down in §4 instead of using a scary-sounding
half-truth to win an argument. The real reason is craft, and it is the
same reason Obsidian had.

## 1. THE MEASUREMENT, STATED HONESTLY INCLUDING THE PART THAT SHRINKS IT
Real Las Vegas venue trademarks appear in the build 23 times across
engine/ and the shipped city world. Broken down truthfully:
- **MOST ARE RESEARCH CITATIONS IN COMMENTS** — Golden Nugget, Binion's,
  the Four Queens, Wynn/Encore, Paris Las Vegas, Circa, Circus Circus.
  Those are the REUSE-FIRST and research-first discipline WORKING, they
  are why bohemia_casino.js knows a downtown casino has no setback and a
  Strip resort has a 100 m arrival drive, and **NOTHING IN THIS RECORD
  ASKS ANYONE TO DELETE THEM.** They are not player-facing.
- **THREE ARE STRUCTURAL AND THEY ARE THE POINT:** `LUXOR:'luxor'`,
  `SPHERE:'sphere'` and `ALLEGIANT` live in the DISTRICT enum in
  engine/bohemia_overmap.js — and that same enum is copied into
  slices/BOHEMIA_CITY_WORLD.html, the surface that ships. LUXOR is a
  landmark with a footprint placed on the real Strip position, commented
  "the pyramid on the strip south."
- **THE PLAYER SEES NONE OF IT TODAY.** I checked: those strings are
  internal type ids, not labels; engine/bohemia_landmarks.js has no
  Luxor entry. Exposure today is approximately zero.
**SO WHY IS THIS A SWEEP ITEM AT ALL?** Because of what happens next, and
because it is currently FREE. There is no law about real names anywhere
in laws/, no gate, no backlog row. The Strip and the resorts have not
been built yet. A rename today is a find-and-replace on an enum. A rename
after the Strip has art, quests, dialogue and save blobs keyed to those
ids is a migration.

## 2. AND IT IS THE SAME GAP HE ALREADY HIT, FROM THE OTHER SIDE
On 8/20 he killed the casino and resort map icons outright — the only two
NOs in that whole ballot. The post-mortem quoted WORLD's own commit:
**"THE STRIP AND THE RESORTS DO NOT EXIST AS PLACES — THAT IS WHY THEY
HAVE NO ART."**
That is exactly right and it names the cause without naming the cure. A
place does not exist because nobody has decided what it IS, and **the
first decision anybody makes about a place is its name.** The art failed
because it was drawing a category, not a building. So this is not a new
problem I found; it is the unbuilt half of a rejection he already made.

## 3. THE GAMES AISLE, AND THE PRECEDENT IS ALMOST EMBARRASSINGLY EXACT
**FALLOUT: NEW VEGAS IS OUR PREMISE.** Post-collapse Las Vegas, the
Strip still lit while the valley outside is ruin. Obsidian renamed every
single casino. The Tops, Gomorrah, the Ultra-Luxe, the Lucky 38. Every
one has a real-world counterpart and, in the wiki's own framing, the
designers "took the most artistic license with the casinos" — the places
are recognisably where they are, and they are not the same places.
**WHAT IT BOUGHT THEM IS THE ARGUMENT.** Those names are now more famous
to a generation of players than several of the real casinos they came
from, some of which have since been demolished. A fictional name let them
put a cannibal aristocracy inside the Ultra-Luxe. A real name would have
owed the player the real building.
GTA does the same thing at industrial scale, and Rockstar's own habit is
instructive: it alters the name AND the look and keeps the FEELING.

## 4. THE REAL-WORLD AISLE — AND HERE IS THE FINDING THAT ARGUES
## AGAINST MY OWN THESIS
I expected the law to be the reason. **IT MOSTLY IS NOT, AND I AM SAYING
SO RATHER THAN LETTING A SCARIER VERSION STAND.**
- **E.S.S. Entertainment 2000 v. Rock Star Videos (9th Cir. 2008)** is
  the controlling video-game case and it is a WIN for us. A real strip
  club, the Play Pen, sued over GTA: San Andreas' "Pig Pen." The Ninth
  Circuit extended the **Rogers v. Grimaldi** balance from titles to
  marks used INSIDE an expressive work and held Rockstar protected: the
  use was artistically relevant and not explicitly misleading, because no
  reasonable consumer thinks a strip club made the video game.
- **Jack Daniel's Properties v. VIP Products (S. Ct. 2023)** narrowed
  Rogers — but narrowly, and NOT against us. It holds Rogers does not
  apply when a mark is used as a **source identifier** for your own
  goods. Commentary on the decision is explicit that for expressive works
  including video games, it should usually be easy to show the mark is
  not being used to identify the game's source, so Rogers still applies.
**SO THE HONEST LEGAL PICTURE: a fictionalised casino inside our game
world is very likely protected, and even a real name inside the world is
probably defensible.** The risks that remain are the practical ones, and
they are the ones that actually matter to a solo developer:
  1. **"DEFENSIBLE" IS NOT "FREE."** E.S.S. took years and appellate
     lawyers. Rockstar could afford that. A win you cannot afford to
     collect is not a win.
  2. **THE REAL MECHANISM IS NOT A COURTROOM, IT IS A FORM.** Storefronts
     act on complaints administratively. A takedown does not require
     anybody to be right, and the game comes down while it is sorted out.
  3. **TRADE DRESS IS THE SHARPER EDGE THAN THE NAME.** E.S.S. was about
     the LOGO AND LOOK, not just the word. A photographic Luxor pyramid
     with the sky beam, or the Sphere's actual exterior, is closer to the
     line than the word "luxor" in an enum.

## 5. THE DECISION (mine, EVERYTHING IS A THUMB — and it is a rule, not
## a set of names, because NAMES ARE HIS)
**REAL GEOGRAPHY STAYS. REAL BUSINESSES BECOME OURS. THE SKYLINE STAYS
RECOGNISABLE.**
1. **GEOGRAPHY IS FACT AND IT IS UNTOUCHED.** Las Vegas, Clark County,
   the Strip's shape and orientation, Fremont, the freeway, the dam, the
   wash, the mountains, the airport's position, the Mormon Fort, the
   Springs. Streets and places are facts, nobody owns them, and REALISM
   FIRST keeps everything it currently has here. **This decision costs
   the realism law almost nothing, which is why it is the right shape.**
2. **REAL BUSINESS NAMES GET REPLACED — the three structural ones first**
   (`LUXOR`, `SPHERE`, `ALLEGIANT`), while it is still an enum rename and
   not a migration.
3. **THE SILHOUETTES STAY.** A black pyramid on the south Strip with a
   light going up. A giant lit sphere east of the middle. A stadium by
   the freeway. That is the skyline and the skyline is what makes it
   Vegas. ALTERED, never photographic — which is precisely the line
   E.S.S. was decided on.
4. **RESEARCH COMMENTS ARE LEGAL AND STAY.** Nobody deletes a citation.
   Knowing a downtown casino meets the sidewalk is why our downtown
   casino is good.
5. **THE NAMES THEMSELVES ARE HIS.** Identity and names are reserved and
   this record does not name a single building. BUT AN EMPTY FIELD IS A
   BLANK PAGE (8/11): the lane ships a REAL ATTEMPT per venue, tagged
   `draft:true`, written as if it ships, so he EDITS instead of inventing
   from nothing. That is the whole 8/11 law and it is what turned the
   quests loose.

## 6. ROUTED
- **WORLD — NAMES-1: THE STRIP GETS NAMES BEFORE IT GETS ART.** Rename
  the three structural ids; ship a drafted name per venue (`draft:true`)
  for every Strip and downtown venue the overmap already places; keep
  every research comment; keep every position. This is also the unblock
  for the two icons he killed on 8/20 — art can draw a named building and
  cannot draw a category.
- **SHARED — NAMES-GATE, same turn (a law without a machine gate is not
  enforced).** Two claims: (a) no real venue trademark appears in a
  DISTRICT id, a landmark name, a player-facing label, or authored
  dialogue; (b) research comments are EXPLICITLY EXEMPT and the gate
  proves it by keeping the citation block in bohemia_casino.js green.
  A gate that punishes research would do more damage than the thing it
  prevents. Mutation test: put "Bellagio" in a landmark label -> red;
  leave it in a comment -> green.
- **NOT ROUTED, DELIBERATELY:** any audit of the questbook corpus. Those
  152 studied quests are STUDY MATERIAL, cited by id and title the way a
  bibliography works, and that is not the same act at all.

## 7. CONFIDENCE, PER CLAIM
- The 23 hits and the three structural ids: greps, read in place.
  **HIGH.**
- That the player sees none of it today: checked the landmark table and
  the labels. **MEDIUM-HIGH** — I did not exhaustively trace every render
  path, and I am saying so instead of rounding up.
- New Vegas renamed everything and it worked: wiki and press. **HIGH.**
- E.S.S./Rogers and the Jack Daniel's narrowing: published decisions and
  law-firm analyses. **HIGH** on what the cases say. **I AM NOT A LAWYER
  AND THIS IS NOT LEGAL ADVICE** — it is why the design call is cheap
  insurance rather than a fire drill.
- That fictional names make the Strip BETTER, not just safer: a
  **PREDICTION**, argued from one very close precedent.

## SOURCES
E.S.S. Entertainment 2000, Inc. v. Rock Star Videos, Inc., 547 F.3d 1095
(9th Cir. 2008), and Rogers v. Grimaldi; Jack Daniel's Properties, Inc.
v. VIP Products LLC (S. Ct. 2023) plus Davis Wright Tremaine, Jenner &
Block and Harvard JSEL analyses of its effect on expressive works;
Fallout Wiki and Fallout: New Vegas press coverage on the casinos and
their real counterparts. In-repo: engine/bohemia_overmap.js (the DISTRICT
enum and the landmark placements), engine/bohemia_casino.js and
engine/bohemia_resort.js (the research citations), slices/
BOHEMIA_CITY_WORLD.html, records/BOHEMIA_VERDICT_DISTRICT_MAP_ICONS_
8_20_26.txt.
