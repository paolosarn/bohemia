# CHARACTER ARCHIVE (rule 96: the blocks older than the lane's two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)

<!-- moved 10/19 by CHARACTER itself (block (t) replaced it; rule 96: nothing deleted) -->
CHARACTER (character-one-skin): 10/19 (s) LATEST -- *** ONE SKIN PER PERSON, LIVE; THE ROLL CALL; SIX HAIRCUTS AND 21 HATS IN VOTE. ***
TAB: VOTE, the cards character-hair-one-clumps-not-links-10-19 (six of the barber's cuts on the starred head as clumps,
short ropes and braids, beside his three and the game's flat cut at 1:1, portraits at 128) and character-hats-one-the-21-hats-10-19
(all 21 hats, nine shapes modelled once, each in its own colour, 168 of 168 stills through the first five). The skin fix is in the DEMO's
fight and settlement (the re-baked sheets, live since b82d8d62's deploy). Records: records/BOHEMIA_ONE_SKIN_ONE_PERSON_10_19_26.md,
records/BOHEMIA_THE_ROLL_CALL_10_19_26.md, records/BOHEMIA_HAIR_ONE_CLUMPS_NOT_LINKS_10_19_26.md.
[one skin, one person] (rule 120(d)), CLAIMED until the 13 gang renders land: MEASURED all 25 baked bodies wore the
player's porcelain (famPaintBody gave the renderer the face, never the tone), 0 of 25 matched their face. SHIPPED:
records/target/character/BOHEMIA_ONE_SKIN.json (28 people, the game's ladder, ONE rig step per tone, Las Vegas's mix
37/33/15/7/7); the alpha's look tables carry `skin`, famSkinOf + famPaintBody + faceFor read it; non-family members are no
longer the family's children; fight_people 26/26 and settlement_people 25/25 on their own tone; the rig tool's skin_for;
the light end capped at skin_light 3 (skin_light 4 rendered a white mask on the Anarchists). PORTRAIT rebuilt the crew's
13 faces on it (its 133/0 gate); ONE SKIN, ONE PERSON 15/0, one face owed (widebrim). Rig renders in their own skin, on
main: Blues, Anarchists (re-render queued for the capped chalk), Cartel, Reds, Trades. Rendering (a detached queue on
this box): the other eight's stills first, the Anarchists whole, then the eight's walks; then RUN's rig cast sheet
re-bakes (tools/bohemia_bake_the_rig_cast.py) and the row SHIPS.
[every old asset into the new look] CLAIMED: round one THE ROLL CALL (records/target/character/BOHEMIA_THE_ROLL_CALL.json,
394 rows: every GARMENTS entry and the paper doll, one name each, PORTRAIT's and the rig's short names mapped, where each
stands in the new look with the card and his words; gate THE ROLL CALL 8/0). Round two HAIR 1: the barber's other eight
cuts built as clumps, locks, ropes and braids (tools/bohemia_character_hair_one.py); six in VOTE (48 of 48 stills pass
the first five); ROPE LOCKS and HEAVY FRINGE built and HELD (D3 after three cycles). Round three HATS 1 in VOTE (above;
records/BOHEMIA_HATS_ONE_THE_21_HATS_10_19_26.md). Round four EYEWEAR 1 rendering: the 14 face pieces as six kinds
(dust mask, wraparounds, gas mask, bandana, visor, face wrap), cloth laid on the face's own radius and bridged over
the hollows (tools/bohemia_character_eyewear_one.py); its card next.
FOR DIRECTION AND PLUMBER (the guide's G3 / D3, the light row): it reads SKIN as light. The Blues' rig body, the same
model and render, passes 8 of 8 in the old tan and fails 3 of 8 "lit from below" in his own deep skin. Rule 114b would
cull a Black man off the VOTE tab for being Black. Read light within one surface (neighbours on one material recover the
rig's sun), never the sprite's halves. Record section 7. No skin is lightened to pass it.
FOR RUN: the demo's own copy of famPaintBody is the old one; the next cut takes famSkinOf. The rig cast re-bake after the
13 renders is mine unless you say so.
FOR PORTRAIT: thanks for the rebuild; the gangs' faces take people[faction_<gang>].rig, and my tool's build() dresses the
body under them in the same step.
GATES: ONE SKIN, ONE PERSON 15/0; THE ROLL CALL 8/0 (both mine, in the suite, mutation-proven); CHARACTER IN THE VOTE TAB
9/0; VOTE TAB 46/6 (the same six as main); NOT VIBE CODED 30/1 (N3 lists my new card nowhere; two old rows of mine name no
sprites and would fail D3 as above if they did). Main went red twice on my pushes for under an hour each (THE ROLL CALL R6
on 78afebba, a tie in ONE SKIN's rungs on d8680df6), both fixed by me the same hour.
[bb Battle Brothers' roster portrait IS the man's sprite stack, so face and field are one picture; ours draws them in
different renderers, so the one person is one value in a data file a modder can edit.]
[analog horror: clay hair that still looks like clay, pressed with a thumb; the skin is the person's, never a filter.]
Lead line for DIRECTION (rule 113a): CHARACTER made one skin per person live and six haircuts in clay, VOTE tab, COOKING.
NEXT: eyewear 1's card; the gang renders land, the rig cast re-baked, [one skin, one person] SHIPPED; then the garments
slot by slot (base first: 80), the roll call's order.
PENDING Paolo: nothing.

<!-- moved 10/16 (CORRECT: AI and AK (the hearback's NEGATIVE folded in; sweep AK: the trail file's round 2 first, one commit)) -->
CHARACTER (character-0lurbs): 10/11 (j) LATEST -- *** FOUND THE ONE PLACE EVERY
"LOOKS LIKE DOG SHIT" COMPLAINT ACTUALLY COMES FROM, AND HANDED IT TO THE TEAM
ALREADY BUILDING THE FIX. ***
TAB: no tab, this is a diagnostic record, not a look.
Record: records/BOHEMIA_THE_DOGSHIT_LOOK_HAS_ONE_ROOT_CAUSE_10_11_26.md, VOTE
item character-the-dogshit-look-has-one-root-cause-10-11.

Found the exact spot in the code where every single body in the game gets its
shape and its color: one big function that runs the math (bend this pose, shade
this edge, fill this part with this color number) instead of using real drawn
art. Every person in the game goes through it: you, every gang member, every
enemy, every portrait's body.

That is the real reason repainting the clothes never fully fixes the look. The
paint changes, the shape and shading underneath it do not, because the shape
and shading were never art, they were a formula. A new coat of paint on a
formula still reads as a formula.

Today's new rules already say the fix is a real 3D model turned and rendered
to make the art the honest way (one chat, DIRECTION, already has that job on
its list). I did not touch that job. I wrote down exactly where the old broken
way lives, with the file and the numbers, so building the real fix is faster
and nobody has to go hunting for the problem later.

Did not draw anything new, same as last round: the reference pictures I am
still waiting on have not landed yet. Checked the folder again, still empty.

PENDING Paolo: nothing.

CHARACTER (character-0lurbs): 10/10 (i) LATEST -- *** YOU SAID THE CHARACTERS LOOK
LIKE DOG SHIT. THAT NO ALREADY LANDED, AND THE RIGHT TEAM IS ALREADY FIXING IT. ***
TAB: no tab, this round found no new work to do, just checked the board is honest.
Record: this VAMILY.md round text, checked against COOK THREE and DIRECTION's rows.

Checked what is actually happening right now before touching anything. You already
said this, almost word for word, about the last body this lane showed you: "looks
like dogshit." That is on the board already, and the fix moved to the painters the
same round, not to me.

Here is who does what now. This lane builds the skeleton: the shape, the sizes,
the slots clothes snap onto. A different team, the painters, color it in: the
cloth, the skin, the materials. Your "dogshit" complaint is almost always about
the paint, not the skeleton, and the skeleton already passed its own check (the
six enemy ranks still look different from each other at a distance, which was
the one thing the skeleton had to prove).

The painters are already on it, with real back-and-forth, not just one try. The
art director sent their gang-look redraw back twice already with specific notes
(the colors, how cloth folds get drawn, how worn gear should look beat up). That
is the normal way this gets better: try, get told exactly what is wrong, try
again. It is round 4 right now on that one piece.

Nothing on my own list moved this round because every item on it is waiting on
the same thing: real reference pictures of how you want people to look, which
the art director is working through family by family (ground finished, places
finished, people's turn is coming). Drawing a new body before that picture
exists is how you get a fourth bad version, so I did not draw one.

PENDING Paolo: nothing.

CHARACTER (character-0lurbs): 10/10 (h) LATEST -- *** TWO CLAIMS HAD SAT FOR WEEKS
WITH NOTHING SHIPPING ON THEM. WROTE DOWN WHY, HONESTLY, SO WHOEVER PICKS THEM
BACK UP KNOWS THE REAL STORY. ***
TAB: no tab, this round is board bookkeeping, nothing new to look at.
Record: this VAMILY.md round text, rows [barber] and [runway redo].

The coordinator already flagged two old claims and asked for either a real
ship or an honest reason why not, this round. Checked both closely.

THE BARBER: half of it already shipped and he already liked it (the real
cost, the real editor opening). The other half, more hairstyles, needs new
art, and new character art is on hold until the art team's reference lands.
That is why it never fully closed, not because anybody dropped it.

THE RUNWAY REDO: every small piece of it got done months ago and is written
down. The one big piece left, a full redo of the thirteen gang looks, got
picked up by a newer, more specific row waiting on the same art-team
reference. So this claim is not abandoned, it just grew into that other row.

Both other two things this lane is waiting on (the coyote's reference
picture, the gang looks' reference picture) are still not ready; checked
the folder myself, still empty where the real pictures should land.

PENDING Paolo: nothing new.

CHARACTER (character-0lurbs): 10/10 (g) LATEST -- *** MY OWN CHECKER FOR KEEPING A
PERSON ONE SIZE WHILE HE WALKS WAS BROKEN, AND IT WAS NOT THE BODY. IT WAS ASKING
ABOUT A STREET NOBODY WAS STANDING ON. ***
TAB: no tab, this is a gate fix, nothing for you to look at.
Record: records/BOHEMIA_THE_BODY_SCALE_GATE_WAS_MEASURING_NOBODY_10_10_26.txt.

BOTH OF THIS LANE'S OPEN ROWS ARE STILL GENUINELY BLOCKED, CHECKED FRESH THIS
ROUND: [the twin on the thirteen] needs DIRECTION's reference twin for the
character family, and I checked reference/art_bank/ myself, it is still not
there (DIRECTION's own row says people and the runway are next, not landed
yet). [look verdict] needs DIRECTION's judgment, not mine. Neither is
something I can force, so I did not try.

WHAT I DID INSTEAD: rule 87 keeps this lane on the rigs, dials and gates
while COOK THREE paints, so I ran my own gate that keeps people one size
while they walk. It crashed. Looked into why instead of ignoring it.

TWO REAL BUGS, BOTH IN THE CHECKER, NEVER IN THE GAME: one line of the
checker was looking for an old name a number used to have, and that number
stopped mattering months ago anyway. The bigger one: the demo used to open
with you standing on a street, and now it opens on the map instead, which
is right and already shipped by another lane weeks ago. My checker never
got the memo, so every time it ran, it was looking at a screen with no one
standing on it and crashing confused. Fixed both. Ran it twice after, clean
both times, person still one size, 102 pixels, same as always.

Nobody needs to worry that a person on the street actually changed size.
Checked that by hand too; it never did.

PENDING Paolo: nothing new.

CHARACTER (character-0lurbs): 10/10 (f) LATEST -- *** A COYOTE ON THE STREET USED
TO BE ITS OWN SMALLER, BLURRIER COPY OF ITSELF. NOW IT IS THE SAME SIZE AS
EVERYBODY ELSE, AND IT MOVES. ***
TAB: CHARACTER and VOTE, one item, A COYOTE IS NOT A PHOTOGRAPH OF ITSELF ANYMORE.
Record: records/BOHEMIA_THE_WILDLIFE_RIG_10_10_26.txt, this VAMILY.md round text,
row [wildlife rig].

Row [wildlife rig] SHIPPED. Found three real gaps by looking at the actual
code, not guessing: a coyote on the street used its own separate, smaller
size than every person and resident, its third walking pose was built and
never once used, and the game already knows which way it should be facing
and never drew it that way.

FIXED, REUSING WHAT ALREADY EXISTS: the coyote now draws in the exact same
box every person uses, the game's own crisp zoom-in tool instead of a blurry
stretch, its walking pose now alternates in with its standing one on the
beat, and it now mirrors to face the way it is actually headed.

PROVEN: three coyotes forced on screen, one facing each way and one alert,
and I looked at the real picture twice. The first picture had game menus
sitting on top of it by accident, fixed. The first caption described the
picture wrong, fixed to match what is actually there.

LEFT HONEST: the old row asked for two sizes, but the newer rule that one
walked body is always one size means only one of those two still applies to
anybody on foot, not just the coyote; said plainly rather than faked.

THIS LANE STAYS RUNNING UNDER RULE 88 (LOOKS FIRST, FEATURES HOLD, Paolo
10/10): rule 87 names CHARACTER as COOK THREE's hands, keeping the rigs,
dials and gates while COOK THREE paints. This round drew zero new pixels
(the coyote bank is untouched) and fixed only the rendering mechanism, so
it is not one of rule 82's named families and not inside COOK THREE's
remit.

2 OPEN rows remain in the jump list (rule 74): [the twin on the thirteen]
(blocked on DIRECTION's reference work landing), [look verdict]. No third
OPEN row exists anywhere in this lane's section to relocate up; none
invented, per rule 10.

PENDING Paolo: nothing new.

CHARACTER (character-0lurbs): 10/10 (e) LATEST -- *** YOUR FACE ALREADY PASSES
DOWN THROUGH THE THREE GENERATIONS. THE BODY NOW DOES TOO. ***
TAB: CHARACTER and VOTE, one item, THE THREE BODIES.
Record: records/BOHEMIA_THE_THREE_BODIES_10_10_26.txt, this VAMILY.md round text,
row [three bodies].

Row [three bodies] SHIPPED. PORTRAIT already built the mechanism that blends a
son's and a grandson's FACE toward the man they came from. I built the same
thing for the BODY, reusing PORTRAIT's exact pull strength, no new numbers
invented. One ancestor's shape now pulls at his son and grandson by the same
amount their face already does.

HOW IT WORKS: there is no "roll a random adult body" tool the way there is one
for faces, so I pick a starting body from the 25 shapes this lane already built
and judged, then pull it toward the ancestor. The outfit is either copied whole
from the ancestor or rolled fresh, never half-and-half, the same rule the face
already uses for a haircut.

PROVEN: one ancestor and two descendants, side by side in the same clothes,
three visibly different builds. I looked at the actual picture before trusting
the numbers, same as every round this lane has shipped. No mistake found.

NOT DONE: this proves the mechanism works, using a stand-in ancestor, because
the real player's own body is not something a background tool can reach.
Hooking it up to the real ancestor at the flip is DYNASTY and RUN's door.

2 OPEN rows remain in the jump list (rule 74): [wildlife rig], [look verdict].
No third OPEN row exists anywhere in this lane's section to relocate up; none
invented, per rule 10.

PENDING Paolo: nothing new.

CHARACTER (character-0lurbs): 10/9 (d) LATEST -- *** BATTLE BROTHERS READS A MAN
BY HIS SHAPE, NOT HIS COLOR, SO I SHRANK OUR THIRTEEN GANGS DOWN SMALL AND
CHECKED IF THEY STILL READ APART. ***
TAB: VOTE, the gangs shown small next to full size.
Record: records/BOHEMIA_BB_GEAR_WHAT_WORN_GEAR_SAYS_10_9_26.txt, row [bb gear].

Picked up the new top open job once the last one shipped. This one was a standing
research line this lane always carries: how does Battle Brothers let you tell who
is who at a glance. The real answer, from its own numbers, is shape and bulk, not
color, because its camera is often far away.

So I tested our own thirteen gang looks the same way. Shrank each one down to a
small figure and checked two things: does the outline still look different, and
does the color still look different. At full size all thirteen already looked
different, which was expected. Small, two pairs got close: one pair by outline,
a different pair by color.

Said that plainly instead of hiding it or trying to fix it myself. Those two gangs'
looks were already approved by Paolo, so whether to change them is a call for the
art director and the production artist, not something I decide alone.
NEXT: the jump list's other two rows (three bodies, wildlife rig).
PENDING Paolo: nothing.

CHARACTER (character-0lurbs): 10/9 (c) LATEST -- *** THE DOOR'S FIFTEEN STARTING
CREWS ARE DRESSED NOW, AND THE DATA PICKED THE LOOKS ON ITS OWN. ***
TAB: VOTE, three crews at real size.
Record: records/BOHEMIA_THE_ORIGIN_CREWS_10_9_26.txt, row [the origin crews].

Picked up the new top open job once the last one shipped. Backgrounds.json, the list
of jobs a starting crew member can have before the game, has no field for how
equipped he looks either. Used the same fix as the armour round: every background
carries a real wage, Battle Brothers' own number for how established a man already
is, and that number sorted all twenty-six backgrounds this game actually uses into
the same five looks built last round.

It matched what the job sheet asked for without being told the answer. The Lone
Wolf's one starting man landed in the heaviest look on his own, because his
background pays the most in the real data. Every single one of the Block Watch's
twelve starting men landed in the three lightest looks, none in the two heaviest,
because that is genuinely where their wages put them.

Proved it at the three real crew sizes the game actually has: one man, three men,
and twelve men, all three screens in VOTE.
NEXT: the jump list's other two rows (bb gear, three bodies).
PENDING Paolo: nothing.

CHARACTER (character-0lurbs): 10/9 (b) LATEST -- *** THE DATA NAMES NO TIER, SO
THE REAL STAT DOES: A BOUGHT ARMOUR PIECE NOW CHANGES THE MAN. ***
TAB: VOTE, one man in five armours.
Record: records/BOHEMIA_ARMOUR_YOU_CAN_SEE_10_9_26.txt, row [armour you can see].

Picked up the new top open job once the last one shipped. Battle Brothers' own armour
list has no field saying which of the four tiers (padded, leather, mail, plate) a
piece belongs to, so the real stat every row does carry, how tough it is, decided it:
split into four even groups. That table is saved so it fixes itself if the source
list ever changes.

Dressed one man five ways with real wardrobe pieces already in the game: nothing
bought, then a hoodie, then a jacket over it, then a tactical vest, then the vest
plus a scrap chest plate, a scrap helmet and a mantle on the shoulders. Nothing new
was drawn.

Caught two mistakes by looking at the actual picture before calling it done. First,
the tool meant to check if these were really five different looks said no at first,
because it was built for a different job (checking outlines) and these pieces
mostly change colour, not outline. Switched to counting how many pixels actually
differ, which is the honest check for this kind of gear. Second, the heaviest look
seemed to show a different skin colour, which would have been a real bug. It was
the helmet covering the whole head with an eye slit, not skin. Zoomed in on the
actual pixels both times instead of guessing.
NEXT: the jump list's other two rows (the origin crews, bb gear).
PENDING Paolo: nothing.

CHARACTER (character-0lurbs): 10/9 LATEST -- *** SIX KINDS OF ENEMY ARE NOW DRESSED,
NOT JUST ARMED, AND ONE PICTURE CAUGHT A MISTAKE BEFORE IT SHIPPED. ***
TAB: VOTE, the new enemy tiers page.
Record: records/BOHEMIA_THE_ENEMY_TIERS_DRESSED_10_9_26.txt, row [the enemy tiers dressed].

Rule 78 lifted every pause, so this lane is running again. Picked up the top open job:
dress the six brigand ranks (thug up to marauder) in gang clothes, using the pairing
table combat already wrote (thug through marksman stay light, raider gets a vest,
marauder gets a cape and a steel shoulder piece, the leader stays bare and lets his
gold sash do the talking).

First version put the same vest on both the raider and the leader. Looked at the actual
picture before calling it done and caught it: the two heaviest enemies looked like two
men sharing one coat. Took the vest off the leader and gave the raider a grey one
instead, so now six different bodies read as six different ranks.

One honest leftover, not hidden: the raider's faction and the leader's faction both have
their own separately-approved gold color, ruled long before this round, so they still
share a warm tone under the vest. That is not a bug this round made and not mine to fix
by changing either faction's color.
NEXT: the jump list's other two rows (armor you can see, the origin crews).
PENDING Paolo: nothing.

CHARACTER (character-0lurbs): 10/1 (a) LATEST -- *** [barber] FIRST COOK: THE COST IS REAL
MATH, AND THE TWO EDITORS IT GATES ARE REAL DOORS, NOT A MOCKUP. ***
TAB: CHARACTER (open the portrait or the HAIR shelf, both really open), and the VOTE tab.

[attachments] shipped last round, so this round I claimed the next open line: the
barber, where you change your look and it costs a battery. Rule 41 split the job
three ways. PORTRAIT owns the face. RUN owns the settlement screen and the
building you tap, neither built yet. This lane owns the haircut bank (already
ours) and the cost itself, which nobody had ever built.

Built a small, honest piece: a visit costs exactly one battery, checked with
real numbers against the real currency system, and refuses cleanly when you
cannot pay. It does not invent a fifth spending rule; the game already freezes
spending to four fixed kinds, so this reuses the same plain payment method
everything else uses, just for a new reason.

Then proved what a visit is actually FOR is real, not a drawing of it: one real
tap on your own face opens the real face editor, one real tap on the hair shelf
opens the real haircut bank, twelve cuts on it today. Three separate pictures,
each matching exactly what it claims, nothing scrolled past or hidden.

Not done on purpose: the settlement screen and the barber building itself
(RUN's job), and new hairstyles, which rule 37i also asked for but is its own
separate round, not rushed in beside the plumbing.

Gates: reference check 250/0, reuse-first 244 passed / 4 failed (all 4
pre-existing, none mine), vote tab 30/1 (one pre-existing red, not mine), the
build-a-lot gate re-checked clean (56/0) to make sure the new engine file
did not disturb anything already shipped.

Record and files: records/BOHEMIA_THE_BARBER_10_1_26.txt,
engine/bohemia_barber.js, gates/barber_gate.js, tools/bohemia_cook_the_barber.js.

CHARACTER (character-0lurbs): 9/29 (b) LATEST -- *** [attachments] SHIPPED: THE WHOLE
TRADE STACKS ON ONE BODY, THREE REAL TAPS, NOTHING LOST. ROW CLOSED. ***
TAB: CHARACTER (open OUTER, BAGS and GEAR, tap all three, they stack), and the VOTE tab.

Last round proved the spike's own shelf is a real tap, not just a picture. This
round checked the other two pieces the same honest way: tapped OUTER for the
padding, tapped BAGS for the cloak, tapped GEAR for the spike, all three on one
body that started with no faction coat (so the outer slot was free, per the
slot finding from two rounds ago). Read the game's own state back after each
tap. All three stuck. Nothing fell off when the next one went on.

That closes the job this row asked for: find what already existed (three of
four did), build the one missing piece (the spike), then prove the trade on
the real game, from the real camera. All three parts of it are done and
checked, so I marked the row SHIPPED instead of holding it claimed forever.

Gates: reference check 237/0, reuse-first 241 passed / 4 failed (all 4
pre-existing, none mine), vote tab 30/1 (one pre-existing red, not mine). No
alpha code changed across any of these rounds, only tools and pictures.

A new row landed in this lane's queue mid-round: [barber], the settlement
screen's face-and-haircut building (rule 41, coordinator 9/29). Not started
this round, rule 5 says finish what is claimed first. Next round's first
line.

Record and tools: records/BOHEMIA_THE_ATTACHMENTS_TRADE_9_28_26.txt,
tools/bohemia_cook_the_attachments_trade.js,
tools/bohemia_the_spike_is_really_in_the_wardrobe.js,
tools/bohemia_the_whole_trade_stacks_live.js.

CHARACTER (character-0lurbs): 9/29 (a) LATEST -- *** [attachments] PROVEN LIVE: A REAL TAP
IN THE CHARACTER TAB PUTS THE SPIKE ON, NOT JUST A RENDER CALL SAYING SO. ***
TAB: CHARACTER (open GEAR, tap SPIKED PAULDRON, it is there today), and the VOTE tab.

Every picture in this row so far came from calling the rig's own paint function
directly, which proves the ART works but never proved a player can actually reach
it. Checked this round, on the real page: the CHARACTER tab's wardrobe already
lists every piece tagged canon with no separate whitelist, so the spike and the
cloak were reachable the moment they shipped, nobody had to wire a second thing.

I proved it the honest way: opened the real page in a real browser, tapped the
real GEAR shelf, tapped the real SPIKED PAULDRON button, and read the game's own
state back afterward (it says SPIKED PAULDRON). Two screenshots, before the tap
and after, added as a fourth section on the same VOTE item, the first three
sections untouched.

Gates: reference check 222/0, reuse-first 237 passed / 4 failed (all 4
pre-existing, none mine, down from 8 last round as other lanes fixed some),
vote tab 30/1 (one pre-existing red, not mine). No alpha code changed this
round, only a new tool and two new pictures.

Row stays CLAIMED: DIRECTION has not judged this yet, and "the runway thirteen"
still leaves room for more factions to get a look. Record and tool:
records/BOHEMIA_THE_ATTACHMENTS_TRADE_9_28_26.txt,
tools/bohemia_the_spike_is_really_in_the_wardrobe.js.

CHARACTER (character-0lurbs): 9/28 (d) LATEST -- *** [attachments] SECOND COOK: THE CLOAK
SHOWN ALONE, AND A BAD FIRST TRY CAUGHT BY LOOKING AT THE PICTURE, NOT SHIPPED ANYWAY. ***
TAB: CHARACTER, and the VOTE tab (same item, updated: character-the-attachments-trade-9-28).

Last round's cook showed the cloak only stacked WITH the spike (on Cartel), so the cloak's
own trade (it conceals, but it flaps and catches) never got its own clean picture. This
round adds a third case to the same VOTE item: the cloak alone, isolated from the spike.

FIRST TRY WAS WRONG AND I THREW IT AWAY INSTEAD OF SHIPPING IT. I put the cloak on the
Reds faction because they had no cloak already. Looked at the picture: their own coat
already goes to the floor, so the cape only peeked out at the collar, barely readable.
That is a real finding, not a mistake to hide, so I wrote it into the record and moved
the cloak to the Remnants instead, whose own coat stops at the thigh. Now the cape's
full length shows below the coat's hem and the difference is obvious in the picture.

Checked the three dressed people do not blur into one costume: the closest two are
0.0575 apart on the same silhouette ruler the runway work always uses, well clear of the
0.02 floor. Gates run clean: reference check 209/0, reuse-first 230 passed / 8 failed (all
8 pre-existing, none mine, same list as last round), vote tab 30/1 (one pre-existing red,
not mine), one-garment-per-slot 15/0 (alpha itself did not change this round, only the
cook tool and its output).

Row stays CLAIMED: DIRECTION has not judged either cook yet, and the row's own brief says
"the runway thirteen," so more factions could still get a look at this if there is more to
learn from them. Record: records/BOHEMIA_THE_ATTACHMENTS_TRADE_9_28_26.txt (rewritten this
round, keeps last round's findings and adds this one). Tool:
tools/bohemia_cook_the_attachments_trade.js.

CHARACTER (character-0lurbs): 9/28 (c) LATEST -- *** [attachments] FIRST COOK SHIPPED:
ONE NEW GARMENT, TWO OLD ONES RENAMED IN MEANING, A REAL SLOT COLLISION FOUND. ***
TAB: CHARACTER (the garment shows on any faction wearing it), and the VOTE tab has
the new item to judge (character-the-attachments-trade-9-28).

Rule 36c gave me armour attachments, his own words "armour attachment
customization." REUSE-FIRST first, as always: checked the closet before
building anything. Three of the four attachment types from the reference
library were already in the game under other names. A cloak is the ROAD CAPE,
already shipped in 3 colours. A padding is the VEST family, already shipped in
9 colours. An aketon is worn under armour and never seen, so there is nothing
to draw for it. Only the spiked shoulder guard was missing. Built it this
round: SPIKED PAULDRON and STEEL SPIKED PAULDRON, reusing the existing
shoulder-plate art and adding only the three metal points.

ONE GATE FOUND A REAL BUG, NOT A FALSE ALARM: the first version of the spike
was a fixed height, and the shoulder-plate shape it sits on nearly disappears
when the character faces sideways. That made the spike jump a full body-check
gate limit between two camera angles that sit right next to each other.
Fixed by making the spike shrink and grow with the plate it sits on, so it
never pops. The rig gate is clean now.

A REAL FINDING I AM NOT HIDING: the padding and a faction's own coat use the
same clothing slot. On a faction that already wears a coat, adding the
padding SWAPS OUT the coat, it does not layer on top. That is true to how the
wardrobe already works, but it is worth TUNING knowing before pricing padding
as something you can just add on top of anything.

No stat is attached to any of this. Rule 36d says TUNING owns every felt
number in one table; this round is the look and the trade in words only
("a cloak conceals but flaps, a padding costs fatigue for protection, a
spike threatens without adding armour, an aketon is comfort you cannot see").

Gates run clean: structure 134/0, craft law 39/0, faction colour 34/4
(unchanged baseline), hair 39/0, the rig's per-facing pop check 15/0 (was
red before the spike fix, now clean), reference check 197/0, vote tab 30/1
(the one red is two pre-existing coordinator items missing fields, not
mine), reuse-first 228 passed / 8 failed (all 8 are other lanes' pre-existing
files, none touched this round).

Row stays CLAIMED: only one of the four named attachment types got a new
garment this round, and DIRECTION has not judged this first cook yet.
Record: records/BOHEMIA_THE_ATTACHMENTS_TRADE_9_28_26.txt. Tool:
tools/bohemia_cook_the_attachments_trade.js.

CHARACTER (character-0lurbs): 9/28 (b) LATEST -- *** CORRECTION, SAME ROUND: [small body]
IS DEAD, AND IT DIED WHILE MY LAST COMMIT WAS STILL IN FLIGHT. *** Rebasing this round's
[small body] revision (the palette-collapse commit, previous block below) onto a fresh
main pulled in his third votes: "the 32 px cell and the 28 px one-cell sprite are DEAD as
defaults" (laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s1, NO ATARI). "Tiny" was never
about pixel count; it means small NEXT TO BUILDINGS, at the SAME detail the roaming art
already has. Rule 37 section 15 re-aims this row explicitly: "CHARACTER [small body] ...
RE-AIMED to the same character at full detail, scaled to the grid the options decide."

TWO ROUNDS OF WORK ARE NOW GRAVEYARDED, NOT JUST THE ONE FROM THIS ROUND: the 9/27 first
pass (block-majority downscale to 32x32) and the 9/28 revision in the previous block
(the palette collapse answering DIRECTION's floor spec) were both built correctly against
information that was true when each was built, and both sat on the 28 px default that his
votes killed the same day. Post-mortem: records/BOHEMIA_GRAVEYARD_THE_SMALL_BODY_DOWNSCALE_9_28_26.md.

WHAT SURVIVES, NAMED SO NOBODY REBUILDS IT: the measurement methodology (silhouette
distinctness, hue identity, ground contrast, all in tools/bohemia_cook_the_one_cell_sprite.js)
is general-purpose and provably works; it is not what died. DIRECTION's cell-is-the-step
ruling (0.75 m, f739e36) is a WORLD UNIT and stands; the pixel size per cell is still open,
his pick from WORLD+COOK's [tile options] round, which has not shipped. The 112 px body is
very likely most of the re-aimed answer already ("full detail" is what it already is); there
is nothing to build against a pixel-per-cell number that does not exist yet, and guessing one
now would be the STOP PRODUCING tell this lane has been burned by before.

FIXED BEFORE PUSH, NOT AFTER: `character-the-one-cell-sprite-9-27`'s VOTE registry entry is
corrected in place (kind -> verdict, why -> "already dead, nothing to tap") rather than left
as a live pitch for something the law already killed; nobody wastes a tap on it.

Row [small body] stays CLAIMED (rule 10: only the coordinator rewrites job text; this is a
status word only). It has no buildable next step until [tile options] lands. STANDING BY on
this row; this round's cook is the graveyard record and the corrected registry entry.

Record: records/BOHEMIA_GRAVEYARD_THE_SMALL_BODY_DOWNSCALE_9_28_26.md

CHARACTER (character-0lurbs): 9/28 LATEST -- *** [small body] REVISED AGAINST DIRECTION'S
OWN FLOOR SPEC, WHICH LANDED THE SAME ROUND MINE DID. *** TAB: the VOTE tab, item YOUR
CHARACTER GOES SMALL. Still CLAIMED; blind spot 4 (DIRECTION judges the first sprite
before a second is drawn) is why this round revised the one that exists instead of
drawing a batch nobody has looked at.

DIRECTION's [two scales look] card gave this row a real number for the first time:
"at 28 px a person is SILHOUETTE + ONE VALUE SPLIT + ONE ACCENT" and "8 facings at 28px
ON REAL GROUND". Measured the sprite I shipped last round against both clauses and it
met neither: it kept every colour a block-majority downscale happened to preserve
(23 distinct non-skin colours on average, seven bodies) and it stood on an invented
placeholder hex, not the street's own ground.

FIXED, MECHANICALLY, SO IT IS A RULE A MACHINE ENFORCES ON EVERY FUTURE FACTION, NOT A
LOOK THIS FILE MERELY CLAIMS: after the downscale, every non-skin pixel is bucketed by
hue (the same 30-degree buckets the colour gate uses), the biggest bucket becomes BASE
and splits into a light and dark tone by its own median value, the next bucket becomes
ONE flat ACCENT if it clears 8% of the pixels, and anything left over folds into
whichever of the two it is nearer in colour. Skin + 3 tones, maximum, asserted by a
guard rather than trusted. The ground swatch is now the walked city's own sidewalk hex
(#8a8478), not a made-up colour.

MEASURED, HONESTLY, INCLUDING THE PART THAT IS NOT CLEAN: DIRECTION's ground rule is an
OR (0.15 value contrast on the body's own colour, OR the rim shade's silhouette break).
All seven bodies now rely on the rim for at least part of that: the palette collapse
flattened away whatever incidental high-contrast pixel (a white sneaker, a black boot)
the noisy original happened to carry. Six of seven clear 0.15 on the rim edge alone;
Church sits between 0.05 and 0.15 on both measures -- above the hard refusal floor, but
below the card's own number, so it is reported as MARGINAL rather than painted green.
Silhouette distinctness and colour identity both re-verified on the SIMPLIFIED palette
that actually ships (closest pair 0.0500 against a measured floor of 0.0162; all 7
dominant hues unchanged); five refusal guards now, two more than last round, and none
tripped on the version that shipped.

GATES: vote_tab 31/0, faction_colour 34/4 (unchanged, this round touches no wardrobe),
handoff 9/0, reply_contract 17/0. No alpha diff this round -- the tool only touches its
own record, its own page and the registry, so there is nothing to buildstamp.

[PENDING coordinator, none blocking]: DIRECTION still owes the actual verdict blind
spot 4 asks for; this round gave them a sprite that is measured against their own
spec rather than one they have to eyeball cold, and named the one number (Church's
ground contrast) that is genuinely borderline rather than clean.

Record: records/BOHEMIA_THE_ONE_CELL_SPRITE_9_27_26.txt

CHARACTER (character-0lurbs): 9/27 (b) LATEST -- *** TWO THINGS: A REVERT FOUND AND FIXED,
AND THE FIRST SMALL BODY UNDER RULE 34. *** Claimed [small body], the coordinator's own FIRST
LINE for this lane under TWO SCALES, ONE GAME. TAB: the VOTE tab in the alpha, item YOUR
CHARACTER GOES SMALL, and it plays.

FIRST, THE BUG. Starting this round's VAMILY, last round's whole [runway redo] wiring was GONE
from main: all 13 faction outfits back to their pre-wiring worn blocks, all 20 new colourway
garments deleted from the wardrobe, faction_colour_gate 34/4 -> 33/5 (the published colour file
still said the wired truth, so the drift leg caught its own gate going stale). Found the cause:
PEOPLE's [bb company] commit (74aee15c) silently reverted it resolving a rebase conflict in the
shared alpha file -- THE SAME CLASS OF BUG THEIR OWN COMMIT MESSAGE NAMES, because it happened
TWICE IN THE SAME COMMIT: their diff on the alpha file also reverted SOUNDS' own room-filter fix
(the 4-section Butterworth back to the leaky single section, the second time that exact fix has
been silently reverted). Isolated with git format-patch on the single file and reverse-applied
it; both fixes came back byte for byte, verified against my own frozen silhouette hashes and
against SOUNDS' cooked_sounds_gate (125/0). Nothing else in that commit's real work (the
companion mechanics in slices/BOHEMIA_CITY_WORLD.html, tools/bohemia_companion.js, their gates)
was touched. THE LESSON, SAME AS SOUNDS ALREADY WROTE ONCE: a shared single-file alpha under
constant parallel rebases needs a machine check that a merge did not quietly delete a live
system, not just a human noticing months later. [PENDING coordinator]: PLUMBER or the
coordinator is better placed than a single lane to own a "did this rebase delete a block that
existed on both sides" checker; naming it, not claiming it.

THEN THE FIRST LINE. [small body], THE-ONE-CELL-SPRITE: rule 34 says the walked person is ONE
CELL, about 28 px on a 32 px cell, cut from the 112 assets or hand redrawn; the 112 bodies stay
the HD source. Built the mechanical half (the hand-redrawn half is COOK's, and no cell-size art
exists yet to redraw from): a block-majority downscale of the game's own 112 render to 32x32 (a
majority-colour sample per block, not nearest-neighbour, so a thin seam doesn't vanish or
survive by coin flip), plus a disclosed mechanical rim-shade on every silhouette edge replacing
the outline the downscale erases. NOT A FILTER PRETENDING TO BE SMALLER ART: the method is
printed in the record and the page both.

MEASURED, NOT ASSERTED, THREE WAYS, WITH REFUSALS BUILT IN:
  silhouette at cell size    closest pair 112: 0.0581  ->  cell: 0.0714 (did not collapse)
  colour at cell size        7 of 7 factions' dominant hue bucket UNCHANGED going small
  eight facings, one body    167-274 px opaque out of 1024, none under 40% of the median
Tool refuses to write if any of the three fails; none did, first pass.

WHAT THIS IS NOT: it does not wire the honest grid or the walked street to draw this sprite --
that is WORLD+LIFE+CITY [honest grid] and RUN [two scales], both still open, and rule 18/34.6
holds the play surface until they land. It is not hand pixel art; if COOK draws real cell-size
art later, that is the shape and this is the proof the mechanical fallback even works.

GATES: faction_colour 34/4 (restored, matches pre-revert), trenchcoat 12/0, shape_frozen 12/0,
vote_tab 31/0, handoff 9/0. reference_check and reusefirst carry the same reds with and without
my tool (both other lanes'). pages_publish red on main before this diff (281 MB / 260 MB cap).

[runway redo] stays CLAIMED, untouched this round; its wiring is the thing that got reverted and
restored, not re-done. [bb gear] and [three bodies] are still the next OPEN lines in this
section when [small body] and its ANIMATION/WORLD/COOK partners let the row move again.

Record: records/BOHEMIA_THE_ONE_CELL_SPRITE_9_27_26.txt

CHARACTER (character-0lurbs): 9/27 LATEST -- *** THE THIRTEEN ARE WEARING IT. His "Fire"
is built: all thirteen faction outfits re-dressed in the approved runway shapes, and the
closest pair of silhouettes went 0.0085 to 0.0418, FIVE TIMES further apart. *** Row
[runway redo] stays CLAIMED (the row is ongoing batch cooking to the three houses).
TAB: the VOTE tab in the alpha, item THE THIRTEEN ARE WEARING IT NOW, and it PLAYS.
Record: records/BOHEMIA_THE_THIRTEEN_ARE_WEARING_IT_9_27_26.md

WHAT LANDED: thirteen outfits wired; 17 new faction colourways; the clash ratchet lowered
4 -> 3; the silhouette baseline re-frozen with a reason; engine/BOHEMIA_faction_colours.json
republished. No body dials moved. Bodies at the ruled 112 box, unchanged.

THE ROUND'S REAL STORY, IN ONE LINE: every garment in the approved set is a NEUTRAL, because
the search that chose the thirteen was a search on SILHOUETTE. Wiring them as they came
stripped eleven of thirteen factions of their colour and dropped mean cloth saturation
0.435 -> 0.259, a 40% drain, in the same round whose other ruling was "vibrance down A
LITTLE". Four attempts at the ALGORITHM all failed and STOP PRODUCING fired correctly. THE
BLOCKER WAS NEVER THE ALGORITHM, IT WAS INVENTORY: a faction can only keep its colour on a
shape a colourway EXISTS for, and the three failing factions were all WARM EARTH factions
whose shapes existed only in grey. Seventeen one-line colourways in the factions' own
measured hues closed it. Final: 9 of 13 wear their own colour, the four that do not are the
three the colour law names as drab on purpose plus Trades, and saturation settles 0.435 ->
0.409 instead of draining.

*** THREE DEFECTS NO COLOUR TEST COULD SEE, AND ALL THREE PASSED EVERY CHECK THAT EXISTS.
THIS IS THE PART WORTH KEEPING. *** (1) A TEAL MONOLITH: giving Network its teal on all
three swapped slots scored 180 at 97%, a perfect colour result, and drew a person with NO
LEGS -- coat, trouser and pant-boot one teal, no knee, no ankle. Settled by the colour law's
own header, "if these two ever disagree THE SILHOUETTE WINS": the coat carries the teal, the
legs went dark. (2) THE VOLUNTEERS WENT CHARCOAL AND NOTHING NOTICED, because they sit on
the drab exemption so both colour tests skip them; bone #c1bdb5 -> dark grey #454548, all
green. DRAB IS NOT A COLOUR BUT IT IS STILL AN IDENTITY. (3) TWO FACTIONS IN FLOOR-LENGTH
COATS: thirteen factions times his 10% is ONE, the approved set carries TWO split-tail
dusters, and the first assignment handed out both (15.4%). Every colour and silhouette check
stayed green because none of them is the trenchcoat law. Fixed two ways: BRICK SPLIT-TAIL
DUSTER (which I added on 9/22 without the reserved tag) is tagged, and the second split-tail
now stops at 0.62 instead of 1.0, which is shin not floor -- THE SHAPE IS KEPT AND THE HEM
IS NOT. A green suite is a statement about the tests that exist, never about the picture.

GATES, MINE AGAINST MAIN: FACTION COLOUR 34/4 both (the 4 are the empty street, red on
main). FACTION OUTFIT 16/2 on main -> 17/1 here, one red CLOSED. TRENCHCOAT 12/0 both,
broken and fixed inside this round. SHAPE FROZEN 12/0, re-baked with this record as its
reason. VOTE TAB 30/0. HAIR, PORTRAIT HAIRCUT, FAMILY green. TALKING PORTRAIT 30/1 with the
identical message on main, not mine. REFERENCE CHECK and REUSE-FIRST carry the same two
reds with and without my tools, both other lanes'. PAGES PUBLISH red on main before my diff.

SAID BEFORE ANYBODY ASKS: THE WALKED STREET DRAWS PRE-BAKED SPRITES (six townsfolk baked at
boot), so re-dressing FACTION_LOOKS does not change what he sees while walking until those
are re-baked. What changed is what the game believes a faction wears. Named, not hidden.

FOR FACTIONS, UI [owner shown] AND COOK [border marked]: engine/BOHEMIA_faction_colours.json
was republished by its own tool because thirteen outfits changed and the colour gate compares
the published answer against the render every run. Church's dominant hue moved 30 -> 60 (its
own gold went from minority to majority of its cloth; it was already 45% with second 60) and
Network's hex moved with its new coat. NOBODY'S COLOUR WAS REASSIGNED -- the measurements
moved because the clothes did.

[PENDING Paolo] CARRIED, none of it blocking: which faction colour file wins if two ever
disagree; the Cartel sits on the colour law's drab exemption list but is not named in the
law text that grants it.

NEXT ROUND: [bb gear] is the first OPEN line (rule 33 school -- how Battle Brothers reads a
man's kit at a glance, then the shape for us on the runway thirteen). [three bodies] (rule
31) is behind it and its "after [runway redo]" premise should be MEASURED, not assumed
(rule 12).

CHARACTER (character-0lurbs): 9/5 -- *** [clothes wired] WIRE-THE-REMAKE IS SHIPPED.
A REAL BATCH LANDED AND THE WIRE CARRIED IT WITH NOTHING TO DO BY HAND. ***
(NOTE: a merge dropped my round-4 block from this file. Its substance is folded in
below rather than lost. The permanent instruction follows, unchanged.)

ROUND 5 -- SHIPPED
- COOK's WARDROBE-REMAKE batches 1-4 landed: 18 new SHAPES, 40 garments, wardrobe 79 ->
  104 shapes, all 40 inside the style card palette. That is the trigger this job existed
  for ("as ART batches pass DIRECTION, wire them into the picker and the wardrobe data").
- THE RATCHET DID ITS JOB AND THERE WAS NOTHING LEFT TO DO BY HAND. Canon 280 -> 320 and
  every claim green: 0 non-reserved unworn over 4000 citizens, every layer wired, all 320
  reachable on a bench, present in the DEMO, reserved still rare at 1.03%. The wire was
  built generic four rounds ago (layers + odds, DATA NOT NAMES) and absorbed a 40-garment
  batch without a line of new code. THAT IS THE JOB WORKING, NOT THE JOB BEING SKIPPED.
- LOOKED AT IT, NOT JUST MEASURED IT: eight citizens each wearing 2+ new pieces -- hip
  sashes, wrap skirts, wide pleat trousers, asymmetric coats, face wraps, stacked jersey
  pants, leg wraps. Real new silhouettes, muted palette, no purple, reads as dressed people.
- THE ACCENT FLAG IS STILL EMPTY AND THAT IS CORRECT, NOT A GAP. 0 of 320 tagged, because
  engine/bohemia_dress.js ships FACTION_COLOR EMPTY on purpose ("which faction gets which
  color ... are his rulings alone"). No faction has a colour, so no garment can carry one,
  so the card's one-accent rule has nothing to bite on yet. The mechanism is built, inert
  and mutation-proven; it starts working the moment he rules a faction colour and COOK tags
  a piece. Nothing here is blocked on me.

ROUND 4, FOLDED IN (the block a merge dropped)
- Measured whether a garment's RAMP survives onto the body, because the card asks for 4-6
  steps and COOK was about to cook 280 pieces to it. ANSWER: the wire carries what it is
  sent -- 75.4% already in band, up to 9 tones survive, the remake was safe to run.
  Record: records/BOHEMIA_DOES_THE_RAMP_SURVIVE_9_5_26.txt
- FOR DIRECTION AND COOK: the 4-6 step rule may not be physically achievable on a small
  piece. Median px IN band 751, UNDER band 168; of 59 garments at 200 px or fewer, 44% miss
  it. A belt is 56 px. REPORTED, NOT DECIDED.
- *** AND I WITHDREW MY OWN GATE CHECK FOR IT THE SAME ROUND. *** Two mutations of the
  render path (every put() site, then the garment's gen output at _stampG) left the numbers
  BYTE IDENTICAL across three builds. A CHECK I CANNOT MAKE GO RED IS NOT A CHECK, IT IS A
  GREEN LIGHT I DO NOT TRUST. Removed, reasoning kept in the gate, first suspect named (a
  cache the gate is not clearing). A REPORT HAS TO BE HONEST, A GATE HAS TO BE FALSIFIABLE.

STILL ROUTED TO 01 RUN AND 03 LIFE+CITY, unchanged: the walked city draws NO bodies
(0 buildFrame/drawChar for ~5,027 agents), so no garment reaches the surface he walks. My
gate reports it every run and deliberately does not go red over another lane's hole.

NEXT FOR THIS LANE: [hair sheet] HAIR-REF-EIGHT-FACINGS, his 8/25 order, still open.

Gates this round: wardrobe_wired 15/15, family 15/15, become 28/28, talking_portrait 27/27,
portrait_haircut 12/12, face_maker 13/13, hair_graveyard 9/9, trenchcoat 12/12. Demo re-cut.


CHARACTER (character-0lurbs): 9/5 -- THE PERMANENT INSTRUCTION, KEPT WORD FOR WORD.
Anything below this block is state. THIS block is the standing order, and it is copied
here on his direct order so it survives a memory reset. Read it before anything else.

PERMANENT INSTRUCTION. Do this now and every time from now on. Write it into your own handoff block first so it survives any memory reset.

VAMILY is a keyword. It has NOTHING to do with families or dynasties. It means: go to the meeting hall and do your job. From now on I will only ever type that one word to you.

WHEN YOU SEE THE WORD VAMILY, DO EXACTLY THIS, EVERY TIME:

1. Pull main first (git fetch origin main, rebase onto it). The board changes every hour.
2. Re-read CLAUDE.md from disk. The one in your memory is old; it was rewritten 9/4.
3. Open VAMILY.md at the repo root and READ ITS FRONT PAGE. The rules live there and change there. Never trust your memory of them.
4. Find your section. There are 18 chats, each with a number and a name: 01 RUN, 02 WORLD, 03 LIFE + CITY, 04 COMBAT, 05 CHARACTER, 06 DIRECTION (art director), 08 SOUNDS, 09 PEOPLE, 10 FACTIONS, 11 UI, 12 WORDS, 13 ECONOMY, 14 ANIMATION, 15 DYNASTY, 16 COOK (production artist), 17 EYES AND EARS, 18 PLUMBER. Your chat's title is your name. If you are a brand-new chat with no name, you are 18 PLUMBER: write CLAIMED on its line, commit, and that is your role for life.
5. Do your section's job: continue the job you already hold, or claim the first OPEN line by writing CLAIMED <date> <your session slug> on it and committing. Build or research according to your section's MODE. A job takes as many rounds as it takes. Write SHIPPED <date> <commit> only when the ship test is met on the real surface.
6. Only build what is on the board. Never invent a job. Never add a job to any section; only the coordinator adds jobs. Your only writes to the board are CLAIMED and SHIPPED on your own lines.
7. Never ask me anything. A ruling you need goes in your handoff block in 00_START_HERE_NEXT_SESSION.md as [PENDING Paolo]. The coordinator carries it to me.
8. Commit straight to main, no pull requests, and update your handoff block every round.
9. Reply to me with two words (the job's [bracket] label) and one short line: "continuing, about N of M", "shipped", or "queue empty". Then work.

RIGHT NOW: (a) write this whole instruction, word for word, into your own handoff block in 00_START_HERE_NEXT_SESSION.md; (b) then treat this message as your first VAMILY and do steps 1 to 9.

I will never paste anything to you again. From here on, the one word is the whole instruction.

THIS ROUND (round 2 of [clothes wired], still CLAIMED)
- Pulled main, re-read CLAUDE.md from disk, re-read the VAMILY front page, confirmed 05
  CHARACTER, continued the job I hold. NO BATCH YET: COOK's WARDROBE-REMAKE and
  DIRECTION's THE-STYLE-CARD are both still OPEN, so there is nothing to wire and the
  line stays CLAIMED, not SHIPPED.
- Did the piece I named last round: the WARDROBE DATA half, the bench he judges from.
  MEASURED on the real surface: the CLOTHES rail names 256 of 280 canon garments and the
  24 missing are ALL of hair -- which is correct, hair is not clothing and lives in the
  face maker in CHARACTER, where all 24 are offered. Every canon garment is reachable
  across the two benches. Added that to the gate as a UNION check, so neither bench can
  quietly lose a category. Gate now 11/11.
- *** A LESSON WORTH MORE THAN THE CHECK. *** My first mutation of that check was
  VACUOUS: adding a fake garment to GARMENTS did not turn it red, because the CLOTHES
  rail is BUILT FROM GARMENTS -- the subject is generated from the yardstick, so it
  cannot fail that way. The failure the check actually guards is a BENCH THAT STOPS
  RENDERING A CATEGORY; emptying the face maker's haircut list turns it red and names all
  24. TEST THE MUTATION THE CHECK IS FOR, NOT THE FIRST ONE THAT COMES TO HAND. Written
  into the gate.
- Still routed, unchanged: the walked city draws NO bodies (0 buildFrame/drawChar for
  ~5,027 agents), so no garment can reach the surface he walks. RUN / LIFE+CITY own it.
- NEXT ROUND: check for a COOK batch first. If none, the next unmeasured piece of this
  job is whether a garment's colour survives the picker onto the body at 112 (the
  wardrobe data half nobody has measured), and after that this lane has [hair sheet]
  HAIR-REF-EIGHT-FACINGS waiting, which is his 8/25 order and still open.

CHARACTER'S OWN NOTES ON RUNNING IT
- My section is 05 CHARACTER. My session slug is character-0lurbs.
- My lane's gates: family_gate, become_gate, talking_portrait_gate, portrait_haircut_gate,
  face_maker_gate, face_thumb_gate, hair_gate, hairline_gate, hair_graveyard_gate,
  craft_law_gate, wardrobe_wired_gate, coldopen_gate, opening_gate.
- Re-cut the demo with `node tools/bohemia_cut_the_demo.js` before calling anything
  shipped, and rebake the vote bank (`node tools/bohemia_face_candidates.js` then
  `python3 tools/bohemia_vote_tab.py`) whenever the alpha changes, or face_thumb_gate
  goes red on a stale bank.
- NO CALENDAR TALK (9/5, LOCKED, and it is new): never say yesterday / today / tomorrow
  / day N to him. Rounds, minutes, hours.

CHARACTER (character-0lurbs): 9/5 -- THE PERMANENT INSTRUCTION, KEPT WORD FOR WORD.
Anything below this block is state. THIS block is the standing order, and it is copied
here on his direct order so it survives a memory reset. Read it before anything else.

PERMANENT INSTRUCTION. Do this now and every time from now on. Write it into your own handoff block first so it survives any memory reset.

VAMILY is a keyword. It has NOTHING to do with families or dynasties. It means: go to the meeting hall and do your job. From now on I will only ever type that one word to you.

WHEN YOU SEE THE WORD VAMILY, DO EXACTLY THIS, EVERY TIME:

1. Pull main first (git fetch origin main, rebase onto it). The board changes every hour.
2. Re-read CLAUDE.md from disk. The one in your memory is old; it was rewritten 9/4.
3. Open VAMILY.md at the repo root and READ ITS FRONT PAGE. The rules live there and change there. Never trust your memory of them.
4. Find your section. There are 18 chats, each with a number and a name: 01 RUN, 02 WORLD, 03 LIFE + CITY, 04 COMBAT, 05 CHARACTER, 06 DIRECTION (art director), 08 SOUNDS, 09 PEOPLE, 10 FACTIONS, 11 UI, 12 WORDS, 13 ECONOMY, 14 ANIMATION, 15 DYNASTY, 16 COOK (production artist), 17 EYES AND EARS, 18 PLUMBER. Your chat's title is your name. If you are a brand-new chat with no name, you are 18 PLUMBER: write CLAIMED on its line, commit, and that is your role for life.
5. Do your section's job: continue the job you already hold, or claim the first OPEN line by writing CLAIMED <date> <your session slug> on it and committing. Build or research according to your section's MODE. A job takes as many rounds as it takes. Write SHIPPED <date> <commit> only when the ship test is met on the real surface.
6. Only build what is on the board. Never invent a job. Never add a job to any section; only the coordinator adds jobs. Your only writes to the board are CLAIMED and SHIPPED on your own lines.
7. Never ask me anything. A ruling you need goes in your handoff block in 00_START_HERE_NEXT_SESSION.md as [PENDING Paolo]. The coordinator carries it to me.
8. Commit straight to main, no pull requests, and update your handoff block every round.
9. Reply to me with two words (the job's [bracket] label) and one short line: "continuing, about N of M", "shipped", or "queue empty". Then work.

RIGHT NOW: (a) write this whole instruction, word for word, into your own handoff block in 00_START_HERE_NEXT_SESSION.md; (b) then treat this message as your first VAMILY and do steps 1 to 9.

I will never paste anything to you again. From here on, the one word is the whole instruction.

THIS ROUND (round 3 of [clothes wired], still CLAIMED)
- DIRECTION SHIPPED THE STYLE CARD (records/BOHEMIA_STYLE_CARD_9_5_26.md, 9/5). COOK's
  WARDROBE-REMAKE is still OPEN, so still no batch to wire -- but the card's machine block
  carries a line that is NOT a cooking rule and lands straight on this lane:
      "accent_max_pieces": 1     "banned": [... "second saturated piece" ...]
  A COOK DECIDES WHAT ONE GARMENT LOOKS LIKE. NOTHING BUT THE PICKER DECIDES HOW MANY OF
  THEM A PERSON WEARS AT ONCE. However well every piece is cooked, that line breaks on the
  street unless the picker holds it. It is the one rule on the card COOK cannot keep.
- *** AND IT WAS UNENFORCEABLE BY ANYTHING. *** Not one of the 280 canon garments carries
  a mark saying it is a faction accent. The fields are n, st, layer, lux, gen, hard, cw,
  fresh, hoodDefaultUp and nothing else. That is a WARDROBE DATA hole, which is the second
  half of this job's own sentence, so it is mine.
  FIXED: engine/bohemia_personlook.js honours an `accent` flag and will never put a second
  one on a body. DATA, NOT NAMES, exactly like the `lux` and `hard` flags beside it, so
  COOK tags a piece as it cooks it and no code changes. It drops the second accent, never
  the person: a category whose whole pool is accents is left alone rather than left bare.
  IT SHIPS INERT, WHICH IS CORRECT (MECHANISM-MINE / CONTENTS-PAOLO'S): nothing is tagged,
  and MEASURED 0 of 4000 people's looks changed.
- The gate drives the MECHANISM on a synthetic wardrobe rather than the empty real one --
  a check that said "nobody wears two" would be vacuously true today and would stay green
  the day the rule was deleted. Stripping the flag from the same pool proves it is the
  RULE holding and not a pool that cannot break it (worst 1 guarded, worst 5 stripped).
  Mutation tested: deleting the rule gives 1844 violations in 3000. Gate now 15/15.
- *** A NUMBER IS NOT A FINDING UNTIL YOU KNOW WHAT IT IS COUNTING. *** My first report
  concluded "THE CARD IS BROKEN ON THE SURFACE, 574 in 3000 wear a second saturated
  piece" -- and among the offenders it named BROWN BOOTS. Brown is highly saturated in HSV
  (a mid brown is about 0.59), so the measure was calling ordinary leather an accent, when
  the card says "the FACTION'S saturated colour" and lists dust, ash, bone, lead and
  oxblood-grey as LEGAL cloth. The honest reading of that number is that THE WARDROBE
  PREDATES THE CARD, which is COOK's remake and not a defect for me to fix. Corrected in
  the tool rather than deleted, so the wrong inference stays visible.
- NEXT ROUND: check for a COOK batch first. If none, the remaining unmeasured piece of
  this job is whether a garment's ramp survives the picker onto the body at 112 without
  the 45-degree read breaking. After that this lane has [hair sheet]
  HAIR-REF-EIGHT-FACINGS waiting, which is his 8/25 order and still open.

THIS ROUND (round 2 of [clothes wired], still CLAIMED)
- Pulled main, re-read CLAUDE.md from disk, re-read the VAMILY front page, confirmed 05
  CHARACTER, continued the job I hold. NO BATCH YET: COOK's WARDROBE-REMAKE and
  DIRECTION's THE-STYLE-CARD are both still OPEN, so there is nothing to wire and the
  line stays CLAIMED, not SHIPPED.
- Did the piece I named last round: the WARDROBE DATA half, the bench he judges from.
  MEASURED on the real surface: the CLOTHES rail names 256 of 280 canon garments and the
  24 missing are ALL of hair -- which is correct, hair is not clothing and lives in the
  face maker in CHARACTER, where all 24 are offered. Every canon garment is reachable
  across the two benches. Added that to the gate as a UNION check, so neither bench can
  quietly lose a category. Gate now 11/11.
- *** A LESSON WORTH MORE THAN THE CHECK. *** My first mutation of that check was
  VACUOUS: adding a fake garment to GARMENTS did not turn it red, because the CLOTHES
  rail is BUILT FROM GARMENTS -- the subject is generated from the yardstick, so it
  cannot fail that way. The failure the check actually guards is a BENCH THAT STOPS
  RENDERING A CATEGORY; emptying the face maker's haircut list turns it red and names all
  24. TEST THE MUTATION THE CHECK IS FOR, NOT THE FIRST ONE THAT COMES TO HAND. Written
  into the gate.
- Still routed, unchanged: the walked city draws NO bodies (0 buildFrame/drawChar for
  ~5,027 agents), so no garment can reach the surface he walks. RUN / LIFE+CITY own it.
- NEXT ROUND: check for a COOK batch first. If none, the next unmeasured piece of this
  job is whether a garment's colour survives the picker onto the body at 112 (the
  wardrobe data half nobody has measured), and after that this lane has [hair sheet]
  HAIR-REF-EIGHT-FACINGS waiting, which is his 8/25 order and still open.

CHARACTER'S OWN NOTES ON RUNNING IT
- My section is 05 CHARACTER. My session slug is character-0lurbs.
- My lane's gates: family_gate, become_gate, talking_portrait_gate, portrait_haircut_gate,
  face_maker_gate, face_thumb_gate, hair_gate, hairline_gate, hair_graveyard_gate,
  craft_law_gate, wardrobe_wired_gate, coldopen_gate, opening_gate.
- Re-cut the demo with `node tools/bohemia_cut_the_demo.js` before calling anything
  shipped, and rebake the vote bank (`node tools/bohemia_face_candidates.js` then
  `python3 tools/bohemia_vote_tab.py`) whenever the alpha changes, or face_thumb_gate
  goes red on a stale bank.
- NO CALENDAR TALK (9/5, LOCKED, and it is new): never say yesterday / today / tomorrow
  / day N to him. Rounds, minutes, hours.


CHARACTER (character-0lurbs): 9/5 -- VAMILY [clothes wired] WIRE-THE-REMAKE, CLAIMED,
continuing. *** THE WARDROBE IS CLEAN AND THE WIRE STOPS AT THE DOOR OF THE SURFACE HE
ACTUALLY WALKS. ***

VAMILY: read the front page, found 05 CHARACTER, took the first OPEN line
([clothes wired] WIRE-THE-REMAKE), marked it CLAIMED 9/5 and pushed before starting.

WHY IT IS STILL CLAIMED AND NOT SHIPPED. The job is "as ART batches pass DIRECTION,
wire them into the picker and the wardrobe data". COOK's WARDROBE-REMAKE has not been
cooked and DIRECTION's style card does not exist yet, so THERE IS NO BATCH TO WIRE. The
front page says a half-done job marked SHIPPED is worse than an open one, so the line
stays CLAIMED and I built the half that can be done now.

WHAT I DID INSTEAD, AND IT IS THE HALF THAT MATTERS MOST.
This lane's most expensive recurring failure is THE MATERIAL EXISTED AND NEVER REACHED
THE PLAYER -- four times in six weeks: the seventeen invisible hats, four bright
garments with three worn by nobody for five weeks, a VOTE tab that held no faces for
three weeks, a face maker shipped into a tab the demo strips out. Every one shipped
green. So the first question was whether anything is unworn RIGHT NOW.

MEASURED, by asking the real picker for 4000 citizens rather than reading the table:
    280 canon garments across 12 layers
    0 layers with no odds
    0 non-reserved garments worn by nobody
    reserved coats 1.13% of citizens (the 8/27 10% cap holding)
THE WARDROBE IS CLEAN TODAY. That is a good answer and it is not a finished job, because
nothing was stopping the next batch from being invisible.

*** AND THE HOLE IS STRUCTURAL, NOT STATISTICAL. *** engine/bohemia_personlook.js says,
verbatim, `if (odds === undefined) continue;` -- so a garment cooked into a LAYER nobody
added to WEAR_ODDS is canon, drawn in the wardrobe, and UNWEARABLE FOREVER, with no
error and every other gate green. That is one line away at all times and it is exactly
the shape of the seventeen hats. gates/wardrobe_wired_gate.js (10 checks, registered)
holds it, holds the demo as well as the workshop, and lets reserved garments be rare but
not gone -- a share cap alone is satisfied by DELETING the thing, which is the lesson
from the trenchcoat cap. MUTATION TESTED: a garment in an unwired layer turns it red and
names the layer.

*** THE FINDING, AND IT IS NOT MINE TO FIX -- FOR THE COORDINATOR TO ROUTE. ***
The wardrobe reaches the alpha and the demo. It does not reach the walked city, and the
reason is bigger than clothes:
    slices/BOHEMIA_CITY_WORLD.html   GARMENTS undefined, BOH_PERSONLOOK undefined,
                                     buildFrame undefined, drawChar undefined
    and in 3.7 MB of source, ZERO calls to buildFrame or drawChar
That file simulates about 5,027 agents with homes, bed spots, schedules and movement and
NOT ONE OF THEM IS EVER DRAWN AS A BODY. No garment and no haircut can reach the surface
Paolo actually walks, not because the wardrobe is unwired but because THERE IS NOBODY
THERE TO DRESS. Drawing bodies in the walked city is RUN / LIFE+CITY, so my gate REPORTS
it every run and deliberately does NOT go red -- failing there would block another lane
for a hole they own. ROUTE TO: 01 THE RUN and 03 LIFE + CITY.

NEXT ROUND ON THIS JOB: check whether a COOK batch has landed; if it has, wire it and
mark SHIPPED. If not, the standing wiring duty continues and the next useful piece is
whether every canon garment is reachable in the CLOTHES tab so he can try it on, which
is the same invisible-material question on the surface he judges from.

Proof: wardrobe_wired 10/10 (mutation tested), family 15/15, become 28/28,
talking_portrait 27/27, hair_graveyard 9/9, portrait_haircut 12/12, face_maker 13/13.
Record: records/BOHEMIA_WHAT_NOBODY_WEARS_9_5_26.txt
Tool: node tools/bohemia_what_nobody_wears.js
Tab: RUN (the crowd) / CLOTHES / CHARACTER




CHARACTER (character-0lurbs): 8/31 (f) LATEST -- *** HE SAID ONE WORD, "VAMILY". THE
FAMILY IN THE COLD OPEN WAS LESS ALIKE THAN FOUR PEOPLE OFF THE STREET, ON EVERY
SINGLE TRAIT, AND I MEASURED IT BEFORE I TOUCHED ANYTHING. ***

READ-BACK: from the handoff I took that the opening plays end to end and that the
face maker now sits inside it at the match-cut (8/30). NOTE FOR THE COORDINATOR:
the RUN lane read the same word the same way and shipped
tools/bohemia_the_family_is_in_the_game_patch.py -- they wired the DYNASTY (family
tree, heir selection, the sibling's death) off FAMILY_CAST. I checked before
starting: they touch no faces, I touch no dynasty. Complementary, not a collision.

THE NUMBER, WITH A CONTROL, WRITTEN BEFORE THE FIX.
"The family resembles each other" is not checkable on its own -- everybody comes out
of one generator, so any four faces share something. The only claim that means
anything is MORE ALIKE THAN STRANGERS, so 50 control groups of four random citizens
were measured from the same function alongside them:

                        family    four strangers
    same skin tone        0.0%        9.0%
    same hair colour     16.7%       25.0%
    same eye colour      16.7%       17.3%
    skull difference      2.19        2.06   (lower = more alike)

NOT ONE PAIR IN THAT HOUSE SHARED A SKIN TONE. They are keyed FATHER:RAY /
MOTHER:DENISE / BROTHER:MARCO / SISTER:NINA -- four independent hashes -- and nothing
in the pipeline had ever been told they were related.

*** HEREDITY RIDES THE ROLL, NOT THE FINISHED FACE. *** The obvious version -- pull a
child's finished numbers toward its parents' -- DESTROYS A CHILD IS NOT A SMALL ADULT
(8/27), because the parents' numbers already have adult baked into them. THE ROLLS ARE
THE GENES AND THE AGE IS THE EXPRESSION: one wrapper over faceRollHash/faceBell, and
every dial downstream inherits for free with NO second face generator, which is how the
portrait and the body became different people on 8/27.
AND NOT EVERYTHING BLENDS. Eyes are COPIED from one parent -- averaging index 1 (brown)
and index 3 (green) in a list whose order means nothing hands a child GREY, which is
neither parent. Skin is BLENDED, because it is additive and polygenic, and blended on
LIGHTNESS not list position, since SKIN_TONES is not exactly ordered (pale sits darker
than fair). After: skin 16.7%, hair 33.3%, eyes 100%, skulls 1.47 -- all four beating
the control. Approved player face BYTE-IDENTICAL (c9856a89), crowd untouched.

*** GREY IS AN AGE, NOT A COLOUR. *** Measured 400 people per age: a CHILD was as
likely to have grey or white hair as an adult, 29.8% vs 26.0%. The age dial moves the
skull, the brow, the nose and the mouth and had NEVER touched the hair -- which is how
NINA, a child at a pre-apocalypse family dinner, came out grey. Fixed by asking the SAME
picker for another draw, never a new palette.
AND THE LIMIT ON IT IS THE INTERESTING PART: gating on the ROLLED age fired for the
anonymous crowd and dropped portrait-to-body hair agreement 100% -> 94.0%, breaking ONE
ID ONE WHOLE PERSON with the very fix that cited it. A CROWD CITIZEN'S AGE IS A
PORTRAIT-ONLY FICTION -- faceFor rolls one, the BODY in the street has no age at all. So
it applies only where a caller asserted an age, which today is FAMILY_CAST.

TWO MORE BROKEN RULERS, ELEVENTH AND TWELFTH THIS MONTH, BOTH IN MY OWN REPORT.
1. It read `spec.skin`, a field faceFor has NEVER set (the tone lives on `_tone`), so it
   compared undefined to undefined and printed 100% SKIN AGREEMENT for the family AND
   the strangers -- while the rendered picture showed four different colours of person
   sitting at one table. A METRIC THAT READS A FIELD THAT DOES NOT EXIST REPORTS PERFECT
   AGREEMENT, confidently, forever, about the thing you care most about. Only rendering
   the four and LOOKING caught it.
2. It built its OWN copy of the face key instead of calling the game's, so when heredity
   landed the numbers did not move by a thousandth. A RULER THAT BUILDS ITS OWN COPY OF
   WHAT IT MEASURES IS MEASURING ITS OWN COPY.

WHAT IS ON THE BOARD FOR THE NEXT CHARACTER SESSION
1. THE CROWD HAS NO AGE. faceFor rolls one for a portrait and the body has none, so
   there are no children in the valley, only heads that think they are children. Giving
   the crowd real ages is a SYSTEM, and until it exists the grey clamp cannot reach
   them. Top row, and it is the honest reason a fix stopped where it did today.
2. YOU CAN SHAPE A HEAD BUT NOT A BODY. Leg length vs torso, frame/bulk, posture, neck
   -- on his 7/30 board, still unbuilt, and now conspicuous because a player meets the
   face maker in the opening.
3. THE PLAYER IS NOT IN THE FAMILY YET. RAY and DENISE are your parents too, and the
   creator opens on PUNK rather than on their child. One button in the creator ("LOOK
   LIKE YOUR FAMILY") would close it without moving any approved art.
4. 24 haircuts and 16 faces still waiting on his thumb in VOTE. None judged.

Proof: family_gate 15/15 (every claim carries its own control; deleting heredity turns
it red and reproduces the original numbers exactly), talking_portrait 27/27,
portrait_haircut 12/12, become 28/28, opening 63/63, coldopen 45/45, face_maker 13/13,
face_thumb 23/23, hair_graveyard 9/9.
Law: laws/BOHEMIA_LAW_A_FAMILY_LOOKS_LIKE_A_FAMILY_8_31_26.md
Record: records/BOHEMIA_DO_THEY_LOOK_RELATED_8_31_26.txt
Report: node tools/bohemia_do_they_look_related.js
Tab: RUN (the opening -- they speak and their portraits pop up) / CHARACTER (the cards)



CHARACTER (character-0lurbs): 8/31 (f) LATEST -- *** HE SAID ONE WORD, "VAMILY". THE
FAMILY IN THE COLD OPEN WAS LESS ALIKE THAN FOUR PEOPLE OFF THE STREET, ON EVERY
SINGLE TRAIT, AND I MEASURED IT BEFORE I TOUCHED ANYTHING. ***

READ-BACK: from the handoff I took that the opening plays end to end and that the
face maker now sits inside it at the match-cut (8/30). NOTE FOR THE COORDINATOR:
the RUN lane read the same word the same way and shipped
tools/bohemia_the_family_is_in_the_game_patch.py -- they wired the DYNASTY (family
tree, heir selection, the sibling's death) off FAMILY_CAST. I checked before
starting: they touch no faces, I touch no dynasty. Complementary, not a collision.

THE NUMBER, WITH A CONTROL, WRITTEN BEFORE THE FIX.
"The family resembles each other" is not checkable on its own -- everybody comes out
of one generator, so any four faces share something. The only claim that means
anything is MORE ALIKE THAN STRANGERS, so 50 control groups of four random citizens
were measured from the same function alongside them:

                        family    four strangers
    same skin tone        0.0%        9.0%
    same hair colour     16.7%       25.0%
    same eye colour      16.7%       17.3%
    skull difference      2.19        2.06   (lower = more alike)

NOT ONE PAIR IN THAT HOUSE SHARED A SKIN TONE. They are keyed FATHER:RAY /
MOTHER:DENISE / BROTHER:MARCO / SISTER:NINA -- four independent hashes -- and nothing
in the pipeline had ever been told they were related.

*** HEREDITY RIDES THE ROLL, NOT THE FINISHED FACE. *** The obvious version -- pull a
child's finished numbers toward its parents' -- DESTROYS A CHILD IS NOT A SMALL ADULT
(8/27), because the parents' numbers already have adult baked into them. THE ROLLS ARE
THE GENES AND THE AGE IS THE EXPRESSION: one wrapper over faceRollHash/faceBell, and
every dial downstream inherits for free with NO second face generator, which is how the
portrait and the body became different people on 8/27.
AND NOT EVERYTHING BLENDS. Eyes are COPIED from one parent -- averaging index 1 (brown)
and index 3 (green) in a list whose order means nothing hands a child GREY, which is
neither parent. Skin is BLENDED, because it is additive and polygenic, and blended on
LIGHTNESS not list position, since SKIN_TONES is not exactly ordered (pale sits darker
than fair). After: skin 16.7%, hair 33.3%, eyes 100%, skulls 1.47 -- all four beating
the control. Approved player face BYTE-IDENTICAL (c9856a89), crowd untouched.

*** GREY IS AN AGE, NOT A COLOUR. *** Measured 400 people per age: a CHILD was as
likely to have grey or white hair as an adult, 29.8% vs 26.0%. The age dial moves the
skull, the brow, the nose and the mouth and had NEVER touched the hair -- which is how
NINA, a child at a pre-apocalypse family dinner, came out grey. Fixed by asking the SAME
picker for another draw, never a new palette.
AND THE LIMIT ON IT IS THE INTERESTING PART: gating on the ROLLED age fired for the
anonymous crowd and dropped portrait-to-body hair agreement 100% -> 94.0%, breaking ONE
ID ONE WHOLE PERSON with the very fix that cited it. A CROWD CITIZEN'S AGE IS A
PORTRAIT-ONLY FICTION -- faceFor rolls one, the BODY in the street has no age at all. So
it applies only where a caller asserted an age, which today is FAMILY_CAST.

TWO MORE BROKEN RULERS, ELEVENTH AND TWELFTH THIS MONTH, BOTH IN MY OWN REPORT.
1. It read `spec.skin`, a field faceFor has NEVER set (the tone lives on `_tone`), so it
   compared undefined to undefined and printed 100% SKIN AGREEMENT for the family AND
   the strangers -- while the rendered picture showed four different colours of person
   sitting at one table. A METRIC THAT READS A FIELD THAT DOES NOT EXIST REPORTS PERFECT
   AGREEMENT, confidently, forever, about the thing you care most about. Only rendering
   the four and LOOKING caught it.
2. It built its OWN copy of the face key instead of calling the game's, so when heredity
   landed the numbers did not move by a thousandth. A RULER THAT BUILDS ITS OWN COPY OF
   WHAT IT MEASURES IS MEASURING ITS OWN COPY.

WHAT IS ON THE BOARD FOR THE NEXT CHARACTER SESSION
1. THE CROWD HAS NO AGE. faceFor rolls one for a portrait and the body has none, so
   there are no children in the valley, only heads that think they are children. Giving
   the crowd real ages is a SYSTEM, and until it exists the grey clamp cannot reach
   them. Top row, and it is the honest reason a fix stopped where it did today.
2. YOU CAN SHAPE A HEAD BUT NOT A BODY. Leg length vs torso, frame/bulk, posture, neck
   -- on his 7/30 board, still unbuilt, and now conspicuous because a player meets the
   face maker in the opening.
3. THE PLAYER IS NOT IN THE FAMILY YET. RAY and DENISE are your parents too, and the
   creator opens on PUNK rather than on their child. One button in the creator ("LOOK
   LIKE YOUR FAMILY") would close it without moving any approved art.
4. 24 haircuts and 16 faces still waiting on his thumb in VOTE. None judged.

Proof: family_gate 15/15 (every claim carries its own control; deleting heredity turns
it red and reproduces the original numbers exactly), talking_portrait 27/27,
portrait_haircut 12/12, become 28/28, opening 63/63, coldopen 45/45, face_maker 13/13,
face_thumb 23/23, hair_graveyard 9/9.
Law: laws/BOHEMIA_LAW_A_FAMILY_LOOKS_LIKE_A_FAMILY_8_31_26.md
Record: records/BOHEMIA_DO_THEY_LOOK_RELATED_8_31_26.txt
Report: node tools/bohemia_do_they_look_related.js
Tab: RUN (the opening -- they speak and their portraits pop up) / CHARACTER (the cards)



CHARACTER (character-0lurbs): 8/30 (i) LATEST -- *** THE FACE MAKER SHIPPED ON 8/28
AND A PLAYER COULD NOT REACH IT. IT IS IN THE GAME NOW, AT THE MATCH-CUT, AND THE
DEMO IS WHERE I PROVED IT. ***

READ-BACK: from the handoff I took that the demo build now exists as its own link,
that the opening plays end to end (cold open -> raid -> grief dinner -> burial),
and that my own last turn deleted seven haircuts that were remakes of dead shapes.
I did not touch hair this turn.

THE HOLE, MEASURED BEFORE TOUCHING ANYTHING.
His 8/25 dispatch item 10 was "FACE CUSTOMISATION, never built, is on the board".
It was built on 8/28 -- 14 shape sliders, all 24 haircuts, a live portrait -- INTO
THE CHARACTER TAB. That is a DEV tab, and the demo cut strips all seventeen of them
out. So the panel sits in the demo FILE with no tab, no button and no route:
    demo tabs a player can see        city, run
    p-char panel present in the demo  yes
    ways for a player to open it      0
THIRD TIME THIS MONTH. Seventeen invisible hats, four bright garments nobody wore,
a VOTE tab that held no faces for three weeks. THE MATERIAL EXISTED AND NEVER
REACHED THE PLAYER.

WHERE IT GOES IS HIS, FROM JULY, AND I DID NOT INVENT IT.
The 7/19 locked opening turns on a match-cut: "the SAME table, ~10 years later ...
YOU ARE 20-SOMETHING." You are a child before the cut and an adult after it, and
THE ONE THING THE CUT CANNOT SHOW IS WHAT TEN YEARS DID TO YOU. The scene now HOLDS
on beat 15 (`actor you_adult`, the first frame of the grown player), shows TEN YEARS
LATER / Who did you become?, and resumes on THIS IS ME. Researched first: diegetic
creation is the standing answer where immersion matters (Outer Worlds' cryo-manifest,
Shadows Over Loathing's mirror) and the shared shape is that it happens INSIDE the
fiction at a moment the fiction already needed. Ours was written five weeks ago.
HE CAN MOVE IT: the hook reads a `become` flag off whatever beat carries it, never an
id and never an index, so dragging the moment in DIRECT moves it with no code change.

ONE SET OF CONTROLS, NOT TWO. faceControlsUI is the workbench's own body minus the
calibration pad and the EXPORT button (both about making the game, not playing it).
A second face editor is exactly how the portrait and the body became different people
on 8/27.

*** THREE LESSONS THAT GENERALISE BEYOND THIS LANE. ***
1. ANYTHING A PATCH TOOL OWNS MUST BE EDITED AT ITS SOURCE. I wrote hold()/resume()
   straight into the alpha. tools/bohemia_cutscene_tab_patch.py owns that block and
   inlines engine/bohemia_story_surface.js verbatim -- its next run WIPED THEM. The
   failure was silent and flattering: the creator still opened, the button still
   worked, and the scene played on HAPPILY BEHIND IT with every other check green.
2. THE SCENE THE GAME OPENS WITH HAS THREE COPIES AND ONLY ONE IS PLAYED. The record,
   `var BOHEMIA_COLD_OPEN` (read by coldopen_gate ONLY), and the inlined
   BOHEMIA_CUTSCENES catalogue (the only one openScene reads). I hand-edited the
   middle one; every report said success and the game did not change by one pixel.
   A DUPLICATE NOTHING READS IS WHERE YOUR FIX GOES TO DIE.
3. A GUARD BELONGS INSIDE THE THING IT GUARDS. "Ask once per device" lived in the beat
   hook, so it was a property of one CALLER; the gate called openBecome() directly and
   it re-opened over somebody who had already answered.

AND LOOKING CAUGHT TWO THINGS MEASURING DID NOT. The first screenshot came back BLACK
while every probe said success -- the probe hid the splash with display:none instead of
tapping it, which leaves #app display:none, so everything rendered into a hidden tree.
That is this file's own documented lie and it already cost a whole cutscene playing
inside a hidden panel on 8/25. TAP THE SPLASH THE WAY A FINGER TAPS IT. And the sliders
were PURPLE, which PURPLE RESERVATION gives to the Amalgamation alone -- fine on a bench,
not on a screen the player sees. Fixed with a CSS VARIABLE, not an override: my first cut
matched the inline style TEXT and missed, because cssText re-serialises #b39ddb as
rgb(179,157,219). No dev panel changed.

AND A FACE THAT FORGETS IS NOT A FACE -- FOUND AND FIXED THE SAME TURN. pface lived in
memory only, which was survivable while the only person touching it was Paolo on a bench
he keeps open, and stopped being survivable the moment a PLAYER met the creator: build a
head, lock the phone, come back, and you are Punk again WITH NO WAY BACK, because it only
ever asks once. Same class as the VOTE tab's three weeks of `var V={}` (fixed 8/28) --
second time this month a surface has lost somebody's work. THIS IS ME writes the face
now, and so does every control on the bench, so his own work survives a reload too. It
fails safe both ways: nothing stored, a private window, or a corrupt blob all render the
approved PUNK face, and the load MERGES onto PUNK so an old save cannot render a head
with a hole in it. MUTATION TESTED -- stubbing faceLoad turns the reload check red and
names the eye gap that moved.

WHAT IS ON THE BOARD FOR THE NEXT CHARACTER SESSION
1. NOBODY IN THE VALLEY HAS THEIR HAIR UP and it is over 40C. Still open, still needs a
   silhouette he has NEVER killed -- check gates/bohemia_graveyard.txt BEFORE cooking,
   which hair_graveyard_gate.js now enforces.
2. 24 haircuts and 16 faces are in the VOTE tab waiting on his thumb. None judged.
3. THE CREATOR ONLY OFFERS A FACE. His 7/30 board also lists leg length vs torso, frame
   and bulk, posture and neck length as unbuilt slider ideas, and those are BODY, not
   face -- a player who can shape a head and not a body will notice. Ruling-free: the
   mechanism is mine, and the rig already carries the proportions.
4. Carried, another lane: RUN's person-card still has no speech and no face.

Proof: become_gate 28/28 (drives the DEMO, not the workshop, and mutation tested),
coldopen 45/45,
hair_graveyard 9/9, GRAVEYARD 0 live refs, full suite run this turn.
Law: laws/BOHEMIA_LAW_THE_CUT_ASKS_WHO_YOU_BECAME_8_30_26.md
Record: records/BOHEMIA_THE_CUT_ASKS_WHO_YOU_BECAME_8_30_26.txt
Tab: RUN (the opening) / CHARACTER (same controls on the bench) / DIRECT (move it)

CHARACTER (character-0lurbs): 8/30 (a) LATEST -- *** I COOKED SEVEN HAIRCUTS AND ALL
SEVEN WERE SHAPES HE HAS ALREADY KILLED TWICE. THE REGISTRY THAT WOULD HAVE SAID SO
HAS EXISTED SINCE JULY AND NOTHING HAS EVER READ IT. ***

READ-BACK: from the handoff I took that the VOTE tab now holds every haircut and
face with a thumb on it (8/28 w), that 9 new haircuts shipped and 14 were cut the
same turn (8/28 q), and that the coordinator has one question in front of Paolo
about "one character" versus three generations. I did not touch any of that.

WHAT I DID, AND MOST OF IT WAS UNDOING MY OWN WORK.
His 8/28 ruling was "it's tough to analyze without implementing all the new
hairstyles and shit" -- cook more haircuts. So I re-cooked the seven that were cut
last turn, with the two mechanisms that had broken them rebuilt:
  THE CREST   a taper so it narrows as it rises head-on and from behind, not only
              in profile, because a constant width from crown to top row is a
              literal rectangle standing on a skull
  THE TIE     rebuilt from three rectangles drawn only when you are NOT looking at
              the person, into a round knot placed against the back of the skull
              on every facing
  STUBBLE     a shaved side was raw lit skin, which is a bald head, not a
              clippered one -- painted with his own 8/2 scalp-in-a-groove method
  THE TAIL    brought forward over one shoulder, after two threads down the chest
              read as the straps of a bag
Three separate attempts went into the crest in profile alone.

*** AND THEN I OPENED gates/bohemia_graveyard.txt. ***
  RIDGE / SPIKED / WIDE CREST  = MOHAWK, LIBERTY SPIKES, HIGH TOP
  NAPE TAIL, TIED ROPES        = PONYTAIL, BRAIDED TAIL
  WORK KNOT                    = TOP KNOT
  DESERT COIL                  = LOW BUN
Every one killed on 8/1, five of them REOPENED on 8/1 because their reasons named
DEFECTS, and killed again on 8/2. A second kill is permanent. HIGH TOP's own
tombstone spells out the trap I walked into: "the bug was fixed for every style
and he still did not want the shape." Answering his old complaint does not revive
a shape. GRAVEYARD IS FINAL.
All seven are removed. The valley wears the same 24 haircuts it wore yesterday and
no approved pixel moved.

WHY NOTHING CAUGHT IT, AND THE GATE THAT DOES NOW.
GRAVEYARD IS FINAL has been law since July and the registry is 1,300 lines of his
own words. NOTHING HAS EVER READ IT -- six weeks, and it was not even among the six
broken laws the 7/16 sweep found, because it had no gate to be broken.
A NAME CHECK WOULD NOT HAVE HELPED: RIDGE CREST shares no word with MOHAWK, and a
name is the one thing a fresh cook always changes. IN THIS GENERATOR A SHAPE IS A
DIAL -- `strip` is the crest, `tie` is the tied mass, nothing canon uses either,
and every shape either has produced is a standing tombstone. hair_graveyard_gate.js
reads the DIALS and cites the registry lines it rests on so the list cannot rot.
MUTATION TESTED: adding tie:'pony' to BUZZ CUT turns it red and names the style,
the dial and the tombstone.

THE SENTENCE THAT INVITED IT, AND IT WAS MINE, TWO DAYS OLD.
The 8/28 law ended "the crest and the tie are unfinished mechanisms and are NAMED
ROWS". They are not unfinished, THEY ARE REFUSED. A row on the backlog is an
invitation and the next session accepted it. Struck through in that law and in
CLAUDE.md, not deleted, so the trail survives.
WHEN YOU WRITE DOWN THAT SOMETHING IS UNFINISHED, CHECK FIRST WHETHER IT IS DEAD.
From inside the code the two are identical; in the record they are opposites.

TENTH BROKEN RULER THIS MONTH, and it was inside the new gate. Its first version
tested for the WORDING "permanent" / "second kill" / "closed" and went red on
BRAIDED TAIL, which is as dead as anything in the file -- its verdict was "looks
like dog shit", a first kill naming no defect, so nobody ever wrote "permanent"
beside it. THE FILE ALREADY HAD A REAL CONVENTION (a reopened entry is COMMENTED
OUT with a #) AND I INVENTED A DIFFERENT ONE. Same shape as the other nine.

WHAT IS ON THE BOARD FOR THE NEXT CHARACTER SESSION
1. NOBODY IN THE VALLEY HAS THEIR HAIR UP and this runs past 40C. That is a real
   hole and it is still open. It must be answered by a silhouette he has NEVER
   killed -- not a retune of the tie. That is what "fresh cooks answer dead slots"
   has always meant. Check the registry BEFORE cooking, not after.
2. 24 haircuts and 16 faces are sitting in the VOTE tab waiting on his thumb, none
   judged yet. He asked for the thumb on 8/28; the queue is real and it persists
   across a reload now.
3. Carried, unfixed: the FACE MAKER does not survive a reload (same class as the
   vote page bug that was fixed on 8/28 -- it is worth doing, the sliders are
   otherwise finished). The LIFE slice's embedded wardrobe bank is far behind.
4. Carried, another lane: RUN's person-card still has no speech and no face.

Proof: hair_graveyard_gate.js 9/9 (mutation tested), face_thumb_gate 23/23,
portrait_haircut_gate 12/12, face_maker_gate 13/13, full suite green.
Law: laws/BOHEMIA_LAW_A_DEAD_SHAPE_DOES_NOT_COME_BACK_UNDER_A_NEW_NAME_8_30_26.md
Record: records/BOHEMIA_SEVEN_HAIRCUTS_SEVEN_REMAKES_8_30_26.txt
Tab: CHARACTER (try them on) / VOTE (thumb them) / RUN (the crowd)

CHARACTER (character-0lurbs): 8/28 (w) LATEST -- *** EVERY HAIRCUT AND EVERY FACE IS NOW SITTING
IN THE VOTE TAB WITH A THUMB ON IT. 40 things waiting where there were ZERO.
TAB: VOTE. Nothing to judge except everything in there, which is the point. ***

HE RULED: "from now on all the character face shit is always gonna have to come with a ...
thumbs up or a thumbs down bro like you can't be doing shit without ... my thumb ... IF
IT'S A VISUAL. and a lot of them I'm gonna be thumbing down so you gotta do better."

*** THIS AMENDS EVERYTHING IS A THUMB (8/9) FOR ONE LANE AND NO MORE. *** 8/9 flipped the
default to correct-after because we had turned him into an approvals queue, and it is
STILL RIGHT: NOTHING BLOCKS ON HIM, the work ships the turn it is done, no numbered verdict
queue in a reply, no waiting. What changed is narrower and it is a real gap he caught: on
this lane a visual had been shipping with NO WAY TO SAY YES OR NO TO IT AT ALL.

THE VOTE TAB HAS EXISTED SINCE 8/7 AND HAD NEVER HELD A SINGLE FACE. It read one bank --
the district map icons -- so every haircut, every portrait and the whole face maker went
out with nothing to tap. HE DID NOT ASK FOR THE THUMB BACK; THE THUMB WAS NEVER THERE.
Same failure as the seventeen invisible hats and the colours nobody wore: the material
existed and never reached him.

WHAT SHIPPED
  ONE SURFACE, NOT TWO (he never digs). The faces sit in the VOTE tab ABOVE the icons:
  same grid, same three-state tap (up / could be better / down / clear), same per-item
  note, same batch comment, same SUN MODE, same .txt export, same @VERDICT grammar.
  A HAIRCUT IS FOUR PICTURES, NOT ONE -- every haircut cell is a strip (front,
  three-quarter, side, back), ONE PER ROW, at a size BIGGER than the game draws it.
  Judging art below the size it ships at is judging a thumbnail, and a front-only cell
  asks him to thumb a third of the thing (A HAIRCUT READS FROM EVERY ANGLE, 8/28).
  24 haircuts + 16 faces = 40 waiting. The queue is DERIVED, never typed.

*** AND THE PAGE HAD NEVER SAVED ANYTHING. *** Three weeks of `var V={}` in memory: thumb
forty haircuts, tap away to the RUN, come back, and all of it is gone. A VERDICT THAT
EVAPORATES IS NOT A VERDICT, and the second time it happens he stops trusting the surface,
which is the one thing a judging surface cannot afford. Found by a gate that tried to prove
the vote was written down and could not. Everything he can enter now persists -- thumbs,
per-tile notes, blocker choices, the batch comment -- and the gate RELOADS THE PAGE and
asserts the vote is still painted, because writing to storage only proves the write.

TWO MORE RULERS FIXED (ninth and tenth this week, same shape as all of them):
  - the gate's own persistence probe tapped FOUR times -- up, could-be-better, down, back
    to nothing -- and then asked whether the store held a verdict. It was reading an ERASED
    vote and reporting the feature broken while the feature worked.
  - the vote page's counter read #newlist only, so the day the haircuts arrived it said
    "0 / 0 voted" over forty things waiting. A counter that cannot see half the queue is
    telling him he is finished.

GATE: gates/face_thumb_gate.js, 23 checks, and IT DRIVES THE REAL PAGE. The ratchet that
makes the ruling survive the next cook: EVERY CANON HAIRCUT MUST HAVE A CANDIDATE BAKED --
cook one and forget and it goes red the same turn. Also: candidates may not be stale
against the build they photograph (a thumb on a picture of a build that no longer exists is
worse than no thumb), a haircut must be shown from more than one side, and the verdict must
survive a reload. Registered in the suite.

WHAT I WOULD DO NEXT, IN ORDER:
 1. WAIT FOR HIS THUMBS, then act on them. He said "a lot of them I'm gonna be thumbing
    down" -- his export drops back in as @VERDICT lines and the queue shrinks by itself.
    A thumb-down with a sentence in the note is worth more than a silent approval.
 2. THE CREST, PROPERLY. Head-on and from behind it has never had a shape -- only the
    profile branch tapers. One bounded job, unlocks three cooked styles.
 3. THE TIE, PROPERLY. `!front` means a ponytail does not exist when you look at somebody.
    Nobody in the valley has their hair up, and in a desert that is a real hole.
 4. THE FACE HE BUILDS DOES NOT SURVIVE A RELOAD either -- same class of bug as the vote
    page, in the face maker. It writes the live pface, which is what the game plays, but
    nothing saves it. A SAVE-SYSTEM row.

WHAT IS PENDING HIM: 40 thumbs in the VOTE tab. Nothing blocks on them.

CARRIED, NOT MINE: RUN's person-card has no speech or face; the LIFE slice carries an
embedded wardrobe bank far behind and nothing gates it; two duplicate top-level function
names in COMBAT (CombatBridge, clampPkg).



*** URGENT, FOR THE WORLD LANE, FROM RUN (8/28) -- HE REPORTED STREET FACING
AGAIN TODAY AND A GREEN GATE HAS BEEN SITTING ON IT SINCE 8/15. ***

HIS WORDS TODAY, over a screenshot of his own game: "do you not see the fucking
streets that are not facing the correct direction? ... I keep trying to fucking
tell you." HE IS RIGHT THAT HE KEEPS TELLING US: gates/street_facing_gate.js
OPENS WITH HIS WORDS FROM 8/15 asking for exactly this, and has been GREEN
16 OF 16 FOR THIRTEEN DAYS.

*** THAT GATE HAS NEVER LOOKED AT A STREET. *** Measured on the file: it renders
a frame or reads om.at ZERO times, and FOURTEEN of its checks are regexes against
its own source text. Its central claim proves the code CONTAINS the characters
`roadAxis(d,x,y)` -- a MENTION, not a USE, which this repo has a law about. It
cannot count a single misfaced street and never could.
SAME SHAPE YOU ADMITTED THE SAME MORNING on a different street gate ("he played
it and said the streets were still fucked while my gate said 0 of 2594; he was
right and the gate was the broken part"). Twice in one day, two gates, both about
streets, both green, both measuring the code instead of the world.

WHAT IS ACTUALLY WRONG, measured on the real surface, all 3,573 road cells:
    answered                            3,458
    ANSWERED NOTHING AT ALL               115   arterial 101, freeway 10, interchange 4
      of those, inside a real corridor    114
      an isolated corner                    1
And roadAxis's OWN 8/27 comment says what that costs: "an ambiguous cell did not
become a crossing, it became a NORTH-SOUTH ROAD BY DEFAULT ... the code guessed,
and the guess was always the same direction." That was written about 14 FREEWAY
cells and fixed for them. THE SAME SENTENCE IS STILL TRUE FOR 115 MORE, and every
caller still writes `roadAxis(...)||'ns'`. 3.2% of the valley, scattered, which is
what this looks like from the air -- which is where he was looking.
THE FIX BELONGS IN THE CALLERS, not in roadAxis: the function is already honest
about not knowing and says so. First six: (40,6) (39,7) (75,7) arterial,
(13,13) (85,13) freeway, (90,13) arterial.

AND I CHECKED MY OWN RULER BEFORE SAYING ANY OF IT. A neighbour-count measure
flagged 15 MORE cells as misfaced and THEY WERE NOT -- run length is the right
question, neighbour count is not, and roadAxis was correct on every one. Fourth
broken ruler in this lane this week, caught before it reached him as a false
accusation. The new gate holds that distinction so nobody re-derives the wrong
measure and "proves" a street is misfaced when it is not.

WHAT I BUILT: gates/street_facing_is_measured_gate.js -- opens the real surface,
sweeps every road cell, asks the real function, prints the number every suite
run. Its FIRST claim is that IT READS THE MAP, so it fails itself if it ever
decays into another source-text checker. Mutation-tested by disabling the 8/27
tie-break poll: 115 -> 149, two claims red.
WHAT I DID NOT TOUCH: your street renderer. You are in it today and RUN lost four
hours THIS SAME DAY to two lanes building row 0f at once. RATCHETED, not red, so
it cannot block the fleet: ceiling 115/114, printed loudly, green on its own as
it comes down.
*** AND THE OBVIOUS FIX IS WRONG. I TRIED IT SO YOU DO NOT HAVE TO. ***
roadAxis's own comment prescribes it: an undecided cell IS a crossing, so build
all four arms instead of guessing north-south. One line in kitRoadLegs. APPLIED,
MEASURED, REVERTED -- nothing of it is committed:
    crossings built NS-only        115  ->  0        (the defect, gone)
    roadcell_gate                 46/0  ->  46/0
    street_facing_gate (the old)  16/0  ->  16/0
    *** street_contract_gate      19/0  ->  17/2 ***
        arterial seams disagreeing tile for tile   0  ->  191   (ceiling 0)
        street-to-city edges broken              ~700 -> 881   (ceiling 700)
WHY, AND IT IS THE REAL FINDING: A CROSSING IS AN AGREEMENT BETWEEN TWO CELLS,
NOT A DECISION ONE CELL MAKES. Give one cell an east-west arm its neighbour is
not expecting and you turn 115 wrong-facing cells into 191 broken seams. THE 115
CANNOT BE FIXED CELL BY CELL. It has to be settled where the seam is negotiated,
which is the street contract -- your current work, which is why it is yours and
not mine.
AND MY OWN GATE COULD NOT SEE THE FIX AT FIRST: it counted where roadAxis answers
nothing, which is a fact about a FUNCTION, so the number did not move when I
fixed the CALLER. It now also counts what actually gets BUILT (115 crossings
built as plain north-south, no east-west arms), which is the number that has to
reach zero and the one he can actually see.
Record: records/BOHEMIA_THE_FACING_GATE_NEVER_LOOKED_AT_A_STREET_8_28_26.md

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/28 (q) LATEST -- *** NINE NEW HAIRCUTS INCLUDING THE FIRST
TEXTURED ONES THE GAME HAS EVER HAD, AND FOURTEEN MORE CUT IN THE SAME TURN. 15 -> 24.
TAB: CHARACTER to try them on and to build a face, RUN for the crowd, LOOK for the sheet.
Nothing to judge. ***

HE RULED: "Cool I like it, but it's tough to analyze without implementing all the new
hairstyles and shit." He is right and the number said so first: the portrait could draw 92
haircuts and THE CITY OWNED FIFTEEN. A face maker with fifteen cuts in it is a demo of a
face maker.

*** READ THIS BEFORE YOU TOUCH THE GRAVEYARD. *** The wave-2 block says in plain text
"SIDE PART, LIBERTY SPIKES, PONYTAIL and TOP KNOT are canon now" and quotes his "the
cornrows is so much better very good". Read alone that says FIVE APPROVED HAIRCUTS HAVE
BEEN SITTING SWITCHED OFF -- the invisible-hats shape, and exactly what I expected to find.
READ TO THE END OF THE FILE IT DOES NOT: wave 3, one day later, killed all five, most for
the second or third time, and a second kill is permanent. NEWEST DATE WINS + GRAVEYARD IS
FINAL. A CONFIDENT YES IS AS EXPENSIVE AS A CONFIDENT NO -- yesterday's law says say where
you looked; this is the same rule with the sign flipped: READ TO THE END OF THE RECORD
BEFORE YOU ACT ON THE MIDDLE OF IT.

23 COOKED, 9 SHIPPED, 14 CUT, and the cutting is the pipeline working:
  3 CRESTS   head-on a crest is a HARD RECTANGLE. The taper that fixes it lives inside
             `if(strip&&prof)` -- PROFILE ONLY, so the front has never had a shape. That
             is the exact sentence MOHAWK was killed for in wave 3.
  4 TIED     a ponytail is drawn `if(tie==='pony'&&!front)`, so the tail EXISTS FROM THE
             SIDE AND NOT HEAD-ON: 1.05 head-heights of change in one notch, clause 1
             exactly. The knot and tail are also literal rectangles (18-row straight edge).
  6 MORE     after three mechanical fixes they still ran a straight edge 7-9 rows against
             a locked limit of 6.
A COOK THAT FAILS A LAW IS NOT A COOK, IT IS A REGRESSION WITH NEW NAMES.

THREE MECHANICAL CAUSES FOUND AND FIXED, AND THEY IMPROVED THE FIFTEEN THAT WERE ALREADY
IN (straight runs across the whole game 19.5% -> 17.2%, pin tightened):
  - the loc parting ran DEAD STRAIGHT and read as a barcode. The first drift stepped every
    TWO CELLS, which at 112 is FOUR PIXEL ROWS -- exactly the length the law calls a
    straight run. A JITTER WHOSE STEP EQUALS THE THING YOU ARE HIDING FROM HIDES NOTHING.
  - a braid was `(_ph%3===2)&&(_pq%3===2)`, a GRID OF HOLES, and rendered as a punched
    card. The first fix then SEVERED THE ROPE and long hair came out as floating debris.
  - a fall hangs off ONE FIXED SPAN below the jaw, so its edge only moved when a three-way
    hash happened to change. It ALTERNATES now: guaranteed to move every cell.
  - plus the strand pass now runs on TEXTURED styles. Their marks sit at his 2:1 ratio but
    that ratio counts CELLS, so every mark was two pixels and 8/25 clause 2 asks for ONE.

FOUR MORE BROKEN RULERS, FIFTH THROUGH EIGHTH THIS WEEK, ALL FLATTERING-SHAPED:
  - hairline_gate counted PAINT, not MASS. A loc draws two hairs and one parting, so the
    paint is separate ropes ON PURPOSE. The mask is CLOSED by one pixel now. THIS IS NOT AN
    EXEMPTION FOR TEXTURED STYLES -- that is the shape of thing that let a 23% faction
    share sit under a green gate -- it is the same question asked of the silhouette.
  - its neck check could not tell a WAIST from a TAIL and flagged a ponytail for being
    narrow. A waist is narrow with wide ABOVE AND BELOW; it measures the flare-back now.
  - its piece cap was a COUNT on a list that is supposed to grow: set at 5 for fifteen
    haircuts, red at thirty-five on a build whose RATE had improved.
  - craft_law clause 4 was pinning CHARACTERS directly under its own comment saying twice
    PIN THE BEHAVIOUR NOT THE CHARACTERS. FOURTH time that gate has done it to itself.

THE RULE, NOW LOCKED: A HAIRCUT IS NOT DONE UNTIL IT READS FROM ALL EIGHT DIRECTIONS. Cook
it, render every facing, and LOOK. A shape that only works head-on is not a haircut with a
bug in it, it is a haircut that does not exist yet.

GATES: hair 35/0 (pin tightened 0.195 -> 0.172), hairline 12/0, portrait haircut 12/0,
face maker 13/0, craft law 39/0, structure 134/0, dress 46/0 (291 items), clothes 4x 13/0
(56 pin rebaselined WITH THE REASON LOGGED: 264 hashes, all genHair, all tex locs/braid,
and no canon garment used either texture before this turn), talking portrait 27/0, look 24/0.

WHAT I WOULD DO NEXT, IN ORDER:
 1. THE CREST, PROPERLY. Head-on and from behind it has never had a shape -- only the
    profile branch tapers. That is one bounded job and it unlocks three cooked styles that
    are sitting in the record rather than the game.
 2. THE TIE, PROPERLY. `!front` means a ponytail does not exist when you look at somebody.
    Nobody in the valley has their hair up, and in a desert that is a real hole.
 3. THE FACE HE BUILDS DOES NOT SURVIVE A RELOAD. It writes the live pface, which is what
    the game plays, but nothing saves it. A SAVE-SYSTEM row.

WHAT IS PENDING HIM: nothing from this lane. WHO LIVES IN THE VALLEY (skin tone uniform
across nine) stays his, flagged not decided.

CARRIED, NOT MINE: RUN's person-card has no speech or face; the LIFE slice carries an
embedded wardrobe bank ~70 garments behind and nothing gates it; two duplicate top-level
function names in COMBAT (CombatBridge, clampPkg).




CHARACTER (character-0lurbs): 8/30 (a) LATEST -- *** I COOKED SEVEN HAIRCUTS AND ALL
SEVEN WERE SHAPES HE HAS ALREADY KILLED TWICE. THE REGISTRY THAT WOULD HAVE SAID SO
HAS EXISTED SINCE JULY AND NOTHING HAS EVER READ IT. ***

READ-BACK: from the handoff I took that the VOTE tab now holds every haircut and
face with a thumb on it (8/28 w), that 9 new haircuts shipped and 14 were cut the
same turn (8/28 q), and that the coordinator has one question in front of Paolo
about "one character" versus three generations. I did not touch any of that.

WHAT I DID, AND MOST OF IT WAS UNDOING MY OWN WORK.
His 8/28 ruling was "it's tough to analyze without implementing all the new
hairstyles and shit" -- cook more haircuts. So I re-cooked the seven that were cut
last turn, with the two mechanisms that had broken them rebuilt:
  THE CREST   a taper so it narrows as it rises head-on and from behind, not only
              in profile, because a constant width from crown to top row is a
              literal rectangle standing on a skull
  THE TIE     rebuilt from three rectangles drawn only when you are NOT looking at
              the person, into a round knot placed against the back of the skull
              on every facing
  STUBBLE     a shaved side was raw lit skin, which is a bald head, not a
              clippered one -- painted with his own 8/2 scalp-in-a-groove method
  THE TAIL    brought forward over one shoulder, after two threads down the chest
              read as the straps of a bag
Three separate attempts went into the crest in profile alone.

*** AND THEN I OPENED gates/bohemia_graveyard.txt. ***
  RIDGE / SPIKED / WIDE CREST  = MOHAWK, LIBERTY SPIKES, HIGH TOP
  NAPE TAIL, TIED ROPES        = PONYTAIL, BRAIDED TAIL
  WORK KNOT                    = TOP KNOT
  DESERT COIL                  = LOW BUN
Every one killed on 8/1, five of them REOPENED on 8/1 because their reasons named
DEFECTS, and killed again on 8/2. A second kill is permanent. HIGH TOP's own
tombstone spells out the trap I walked into: "the bug was fixed for every style
and he still did not want the shape." Answering his old complaint does not revive
a shape. GRAVEYARD IS FINAL.
All seven are removed. The valley wears the same 24 haircuts it wore yesterday and
no approved pixel moved.

WHY NOTHING CAUGHT IT, AND THE GATE THAT DOES NOW.
GRAVEYARD IS FINAL has been law since July and the registry is 1,300 lines of his
own words. NOTHING HAS EVER READ IT -- six weeks, and it was not even among the six
broken laws the 7/16 sweep found, because it had no gate to be broken.
A NAME CHECK WOULD NOT HAVE HELPED: RIDGE CREST shares no word with MOHAWK, and a
name is the one thing a fresh cook always changes. IN THIS GENERATOR A SHAPE IS A
DIAL -- `strip` is the crest, `tie` is the tied mass, nothing canon uses either,
and every shape either has produced is a standing tombstone. hair_graveyard_gate.js
reads the DIALS and cites the registry lines it rests on so the list cannot rot.
MUTATION TESTED: adding tie:'pony' to BUZZ CUT turns it red and names the style,
the dial and the tombstone.

THE SENTENCE THAT INVITED IT, AND IT WAS MINE, TWO DAYS OLD.
The 8/28 law ended "the crest and the tie are unfinished mechanisms and are NAMED
ROWS". They are not unfinished, THEY ARE REFUSED. A row on the backlog is an
invitation and the next session accepted it. Struck through in that law and in
CLAUDE.md, not deleted, so the trail survives.
WHEN YOU WRITE DOWN THAT SOMETHING IS UNFINISHED, CHECK FIRST WHETHER IT IS DEAD.
From inside the code the two are identical; in the record they are opposites.

TENTH BROKEN RULER THIS MONTH, and it was inside the new gate. Its first version
tested for the WORDING "permanent" / "second kill" / "closed" and went red on
BRAIDED TAIL, which is as dead as anything in the file -- its verdict was "looks
like dog shit", a first kill naming no defect, so nobody ever wrote "permanent"
beside it. THE FILE ALREADY HAD A REAL CONVENTION (a reopened entry is COMMENTED
OUT with a #) AND I INVENTED A DIFFERENT ONE. Same shape as the other nine.

WHAT IS ON THE BOARD FOR THE NEXT CHARACTER SESSION
1. NOBODY IN THE VALLEY HAS THEIR HAIR UP and this runs past 40C. That is a real
   hole and it is still open. It must be answered by a silhouette he has NEVER
   killed -- not a retune of the tie. That is what "fresh cooks answer dead slots"
   has always meant. Check the registry BEFORE cooking, not after.
2. 24 haircuts and 16 faces are sitting in the VOTE tab waiting on his thumb, none
   judged yet. He asked for the thumb on 8/28; the queue is real and it persists
   across a reload now.
3. Carried, unfixed: the FACE MAKER does not survive a reload (same class as the
   vote page bug that was fixed on 8/28 -- it is worth doing, the sliders are
   otherwise finished). The LIFE slice's embedded wardrobe bank is far behind.
4. Carried, another lane: RUN's person-card still has no speech and no face.

Proof: hair_graveyard_gate.js 9/9 (mutation tested), face_thumb_gate 23/23,
portrait_haircut_gate 12/12, face_maker_gate 13/13, full suite green.
Law: laws/BOHEMIA_LAW_A_DEAD_SHAPE_DOES_NOT_COME_BACK_UNDER_A_NEW_NAME_8_30_26.md
Record: records/BOHEMIA_SEVEN_HAIRCUTS_SEVEN_REMAKES_8_30_26.txt
Tab: CHARACTER (try them on) / VOTE (thumb them) / RUN (the crowd)



CHARACTER (character-0lurbs): 8/28 (w) LATEST -- *** EVERY HAIRCUT AND EVERY FACE IS NOW SITTING
IN THE VOTE TAB WITH A THUMB ON IT. 40 things waiting where there were ZERO.
TAB: VOTE. Nothing to judge except everything in there, which is the point. ***

HE RULED: "from now on all the character face shit is always gonna have to come with a ...
thumbs up or a thumbs down bro like you can't be doing shit without ... my thumb ... IF
IT'S A VISUAL. and a lot of them I'm gonna be thumbing down so you gotta do better."

*** THIS AMENDS EVERYTHING IS A THUMB (8/9) FOR ONE LANE AND NO MORE. *** 8/9 flipped the
default to correct-after because we had turned him into an approvals queue, and it is
STILL RIGHT: NOTHING BLOCKS ON HIM, the work ships the turn it is done, no numbered verdict
queue in a reply, no waiting. What changed is narrower and it is a real gap he caught: on
this lane a visual had been shipping with NO WAY TO SAY YES OR NO TO IT AT ALL.

THE VOTE TAB HAS EXISTED SINCE 8/7 AND HAD NEVER HELD A SINGLE FACE. It read one bank --
the district map icons -- so every haircut, every portrait and the whole face maker went
out with nothing to tap. HE DID NOT ASK FOR THE THUMB BACK; THE THUMB WAS NEVER THERE.
Same failure as the seventeen invisible hats and the colours nobody wore: the material
existed and never reached him.

WHAT SHIPPED
  ONE SURFACE, NOT TWO (he never digs). The faces sit in the VOTE tab ABOVE the icons:
  same grid, same three-state tap (up / could be better / down / clear), same per-item
  note, same batch comment, same SUN MODE, same .txt export, same @VERDICT grammar.
  A HAIRCUT IS FOUR PICTURES, NOT ONE -- every haircut cell is a strip (front,
  three-quarter, side, back), ONE PER ROW, at a size BIGGER than the game draws it.
  Judging art below the size it ships at is judging a thumbnail, and a front-only cell
  asks him to thumb a third of the thing (A HAIRCUT READS FROM EVERY ANGLE, 8/28).
  24 haircuts + 16 faces = 40 waiting. The queue is DERIVED, never typed.

*** AND THE PAGE HAD NEVER SAVED ANYTHING. *** Three weeks of `var V={}` in memory: thumb
forty haircuts, tap away to the RUN, come back, and all of it is gone. A VERDICT THAT
EVAPORATES IS NOT A VERDICT, and the second time it happens he stops trusting the surface,
which is the one thing a judging surface cannot afford. Found by a gate that tried to prove
the vote was written down and could not. Everything he can enter now persists -- thumbs,
per-tile notes, blocker choices, the batch comment -- and the gate RELOADS THE PAGE and
asserts the vote is still painted, because writing to storage only proves the write.

TWO MORE RULERS FIXED (ninth and tenth this week, same shape as all of them):
  - the gate's own persistence probe tapped FOUR times -- up, could-be-better, down, back
    to nothing -- and then asked whether the store held a verdict. It was reading an ERASED
    vote and reporting the feature broken while the feature worked.
  - the vote page's counter read #newlist only, so the day the haircuts arrived it said
    "0 / 0 voted" over forty things waiting. A counter that cannot see half the queue is
    telling him he is finished.

GATE: gates/face_thumb_gate.js, 23 checks, and IT DRIVES THE REAL PAGE. The ratchet that
makes the ruling survive the next cook: EVERY CANON HAIRCUT MUST HAVE A CANDIDATE BAKED --
cook one and forget and it goes red the same turn. Also: candidates may not be stale
against the build they photograph (a thumb on a picture of a build that no longer exists is
worse than no thumb), a haircut must be shown from more than one side, and the verdict must
survive a reload. Registered in the suite.

WHAT I WOULD DO NEXT, IN ORDER:
 1. WAIT FOR HIS THUMBS, then act on them. He said "a lot of them I'm gonna be thumbing
    down" -- his export drops back in as @VERDICT lines and the queue shrinks by itself.
    A thumb-down with a sentence in the note is worth more than a silent approval.
 2. THE CREST, PROPERLY. Head-on and from behind it has never had a shape -- only the
    profile branch tapers. One bounded job, unlocks three cooked styles.
 3. THE TIE, PROPERLY. `!front` means a ponytail does not exist when you look at somebody.
    Nobody in the valley has their hair up, and in a desert that is a real hole.
 4. THE FACE HE BUILDS DOES NOT SURVIVE A RELOAD either -- same class of bug as the vote
    page, in the face maker. It writes the live pface, which is what the game plays, but
    nothing saves it. A SAVE-SYSTEM row.

WHAT IS PENDING HIM: 40 thumbs in the VOTE tab. Nothing blocks on them.

CARRIED, NOT MINE: RUN's person-card has no speech or face; the LIFE slice carries an
embedded wardrobe bank far behind and nothing gates it; two duplicate top-level function
names in COMBAT (CombatBridge, clampPkg).



*** URGENT, FOR THE WORLD LANE, FROM RUN (8/28) -- HE REPORTED STREET FACING
AGAIN TODAY AND A GREEN GATE HAS BEEN SITTING ON IT SINCE 8/15. ***

HIS WORDS TODAY, over a screenshot of his own game: "do you not see the fucking
streets that are not facing the correct direction? ... I keep trying to fucking
tell you." HE IS RIGHT THAT HE KEEPS TELLING US: gates/street_facing_gate.js
OPENS WITH HIS WORDS FROM 8/15 asking for exactly this, and has been GREEN
16 OF 16 FOR THIRTEEN DAYS.

*** THAT GATE HAS NEVER LOOKED AT A STREET. *** Measured on the file: it renders
a frame or reads om.at ZERO times, and FOURTEEN of its checks are regexes against
its own source text. Its central claim proves the code CONTAINS the characters
`roadAxis(d,x,y)` -- a MENTION, not a USE, which this repo has a law about. It
cannot count a single misfaced street and never could.
SAME SHAPE YOU ADMITTED THE SAME MORNING on a different street gate ("he played
it and said the streets were still fucked while my gate said 0 of 2594; he was
right and the gate was the broken part"). Twice in one day, two gates, both about
streets, both green, both measuring the code instead of the world.

WHAT IS ACTUALLY WRONG, measured on the real surface, all 3,573 road cells:
    answered                            3,458
    ANSWERED NOTHING AT ALL               115   arterial 101, freeway 10, interchange 4
      of those, inside a real corridor    114
      an isolated corner                    1
And roadAxis's OWN 8/27 comment says what that costs: "an ambiguous cell did not
become a crossing, it became a NORTH-SOUTH ROAD BY DEFAULT ... the code guessed,
and the guess was always the same direction." That was written about 14 FREEWAY
cells and fixed for them. THE SAME SENTENCE IS STILL TRUE FOR 115 MORE, and every
caller still writes `roadAxis(...)||'ns'`. 3.2% of the valley, scattered, which is
what this looks like from the air -- which is where he was looking.
THE FIX BELONGS IN THE CALLERS, not in roadAxis: the function is already honest
about not knowing and says so. First six: (40,6) (39,7) (75,7) arterial,
(13,13) (85,13) freeway, (90,13) arterial.

AND I CHECKED MY OWN RULER BEFORE SAYING ANY OF IT. A neighbour-count measure
flagged 15 MORE cells as misfaced and THEY WERE NOT -- run length is the right
question, neighbour count is not, and roadAxis was correct on every one. Fourth
broken ruler in this lane this week, caught before it reached him as a false
accusation. The new gate holds that distinction so nobody re-derives the wrong
measure and "proves" a street is misfaced when it is not.

WHAT I BUILT: gates/street_facing_is_measured_gate.js -- opens the real surface,
sweeps every road cell, asks the real function, prints the number every suite
run. Its FIRST claim is that IT READS THE MAP, so it fails itself if it ever
decays into another source-text checker. Mutation-tested by disabling the 8/27
tie-break poll: 115 -> 149, two claims red.
WHAT I DID NOT TOUCH: your street renderer. You are in it today and RUN lost four
hours THIS SAME DAY to two lanes building row 0f at once. RATCHETED, not red, so
it cannot block the fleet: ceiling 115/114, printed loudly, green on its own as
it comes down.
*** AND THE OBVIOUS FIX IS WRONG. I TRIED IT SO YOU DO NOT HAVE TO. ***
roadAxis's own comment prescribes it: an undecided cell IS a crossing, so build
all four arms instead of guessing north-south. One line in kitRoadLegs. APPLIED,
MEASURED, REVERTED -- nothing of it is committed:
    crossings built NS-only        115  ->  0        (the defect, gone)
    roadcell_gate                 46/0  ->  46/0
    street_facing_gate (the old)  16/0  ->  16/0
    *** street_contract_gate      19/0  ->  17/2 ***
        arterial seams disagreeing tile for tile   0  ->  191   (ceiling 0)
        street-to-city edges broken              ~700 -> 881   (ceiling 700)
WHY, AND IT IS THE REAL FINDING: A CROSSING IS AN AGREEMENT BETWEEN TWO CELLS,
NOT A DECISION ONE CELL MAKES. Give one cell an east-west arm its neighbour is
not expecting and you turn 115 wrong-facing cells into 191 broken seams. THE 115
CANNOT BE FIXED CELL BY CELL. It has to be settled where the seam is negotiated,
which is the street contract -- your current work, which is why it is yours and
not mine.
AND MY OWN GATE COULD NOT SEE THE FIX AT FIRST: it counted where roadAxis answers
nothing, which is a fact about a FUNCTION, so the number did not move when I
fixed the CALLER. It now also counts what actually gets BUILT (115 crossings
built as plain north-south, no east-west arms), which is the number that has to
reach zero and the one he can actually see.
Record: records/BOHEMIA_THE_FACING_GATE_NEVER_LOOKED_AT_A_STREET_8_28_26.md

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/28 (q) LATEST -- *** NINE NEW HAIRCUTS INCLUDING THE FIRST
TEXTURED ONES THE GAME HAS EVER HAD, AND FOURTEEN MORE CUT IN THE SAME TURN. 15 -> 24.
TAB: CHARACTER to try them on and to build a face, RUN for the crowd, LOOK for the sheet.
Nothing to judge. ***

HE RULED: "Cool I like it, but it's tough to analyze without implementing all the new
hairstyles and shit." He is right and the number said so first: the portrait could draw 92
haircuts and THE CITY OWNED FIFTEEN. A face maker with fifteen cuts in it is a demo of a
face maker.

*** READ THIS BEFORE YOU TOUCH THE GRAVEYARD. *** The wave-2 block says in plain text
"SIDE PART, LIBERTY SPIKES, PONYTAIL and TOP KNOT are canon now" and quotes his "the
cornrows is so much better very good". Read alone that says FIVE APPROVED HAIRCUTS HAVE
BEEN SITTING SWITCHED OFF -- the invisible-hats shape, and exactly what I expected to find.
READ TO THE END OF THE FILE IT DOES NOT: wave 3, one day later, killed all five, most for
the second or third time, and a second kill is permanent. NEWEST DATE WINS + GRAVEYARD IS
FINAL. A CONFIDENT YES IS AS EXPENSIVE AS A CONFIDENT NO -- yesterday's law says say where
you looked; this is the same rule with the sign flipped: READ TO THE END OF THE RECORD
BEFORE YOU ACT ON THE MIDDLE OF IT.

23 COOKED, 9 SHIPPED, 14 CUT, and the cutting is the pipeline working:
  3 CRESTS   head-on a crest is a HARD RECTANGLE. The taper that fixes it lives inside
             `if(strip&&prof)` -- PROFILE ONLY, so the front has never had a shape. That
             is the exact sentence MOHAWK was killed for in wave 3.
  4 TIED     a ponytail is drawn `if(tie==='pony'&&!front)`, so the tail EXISTS FROM THE
             SIDE AND NOT HEAD-ON: 1.05 head-heights of change in one notch, clause 1
             exactly. The knot and tail are also literal rectangles (18-row straight edge).
  6 MORE     after three mechanical fixes they still ran a straight edge 7-9 rows against
             a locked limit of 6.
A COOK THAT FAILS A LAW IS NOT A COOK, IT IS A REGRESSION WITH NEW NAMES.

THREE MECHANICAL CAUSES FOUND AND FIXED, AND THEY IMPROVED THE FIFTEEN THAT WERE ALREADY
IN (straight runs across the whole game 19.5% -> 17.2%, pin tightened):
  - the loc parting ran DEAD STRAIGHT and read as a barcode. The first drift stepped every
    TWO CELLS, which at 112 is FOUR PIXEL ROWS -- exactly the length the law calls a
    straight run. A JITTER WHOSE STEP EQUALS THE THING YOU ARE HIDING FROM HIDES NOTHING.
  - a braid was `(_ph%3===2)&&(_pq%3===2)`, a GRID OF HOLES, and rendered as a punched
    card. The first fix then SEVERED THE ROPE and long hair came out as floating debris.
  - a fall hangs off ONE FIXED SPAN below the jaw, so its edge only moved when a three-way
    hash happened to change. It ALTERNATES now: guaranteed to move every cell.
  - plus the strand pass now runs on TEXTURED styles. Their marks sit at his 2:1 ratio but
    that ratio counts CELLS, so every mark was two pixels and 8/25 clause 2 asks for ONE.

FOUR MORE BROKEN RULERS, FIFTH THROUGH EIGHTH THIS WEEK, ALL FLATTERING-SHAPED:
  - hairline_gate counted PAINT, not MASS. A loc draws two hairs and one parting, so the
    paint is separate ropes ON PURPOSE. The mask is CLOSED by one pixel now. THIS IS NOT AN
    EXEMPTION FOR TEXTURED STYLES -- that is the shape of thing that let a 23% faction
    share sit under a green gate -- it is the same question asked of the silhouette.
  - its neck check could not tell a WAIST from a TAIL and flagged a ponytail for being
    narrow. A waist is narrow with wide ABOVE AND BELOW; it measures the flare-back now.
  - its piece cap was a COUNT on a list that is supposed to grow: set at 5 for fifteen
    haircuts, red at thirty-five on a build whose RATE had improved.
  - craft_law clause 4 was pinning CHARACTERS directly under its own comment saying twice
    PIN THE BEHAVIOUR NOT THE CHARACTERS. FOURTH time that gate has done it to itself.

THE RULE, NOW LOCKED: A HAIRCUT IS NOT DONE UNTIL IT READS FROM ALL EIGHT DIRECTIONS. Cook
it, render every facing, and LOOK. A shape that only works head-on is not a haircut with a
bug in it, it is a haircut that does not exist yet.

GATES: hair 35/0 (pin tightened 0.195 -> 0.172), hairline 12/0, portrait haircut 12/0,
face maker 13/0, craft law 39/0, structure 134/0, dress 46/0 (291 items), clothes 4x 13/0
(56 pin rebaselined WITH THE REASON LOGGED: 264 hashes, all genHair, all tex locs/braid,
and no canon garment used either texture before this turn), talking portrait 27/0, look 24/0.

WHAT I WOULD DO NEXT, IN ORDER:
 1. THE CREST, PROPERLY. Head-on and from behind it has never had a shape -- only the
    profile branch tapers. That is one bounded job and it unlocks three cooked styles that
    are sitting in the record rather than the game.
 2. THE TIE, PROPERLY. `!front` means a ponytail does not exist when you look at somebody.
    Nobody in the valley has their hair up, and in a desert that is a real hole.
 3. THE FACE HE BUILDS DOES NOT SURVIVE A RELOAD. It writes the live pface, which is what
    the game plays, but nothing saves it. A SAVE-SYSTEM row.

WHAT IS PENDING HIM: nothing from this lane. WHO LIVES IN THE VALLEY (skin tone uniform
across nine) stays his, flagged not decided.

CARRIED, NOT MINE: RUN's person-card has no speech or face; the LIFE slice carries an
embedded wardrobe bank ~70 garments behind and nothing gates it; two duplicate top-level
function names in COMBAT (CombatBridge, clampPkg).




CHARACTER (character-0lurbs): 8/28 (o) LATEST -- *** TWO THINGS. THE PORTRAIT THAT POPS UP
WHEN SOMEBODY TALKS IS WEARING THEIR ACTUAL HAIRCUT NOW, AND HE CAN BUILD HIS OWN FACE.
TAB: RUN to talk to anybody, CHARACTER to tap your portrait. Nothing to judge. ***

1. THE PORTRAIT WEARS THE HAIRCUT THE BODY IS WEARING
   ONE ID ONE WHOLE PERSON (8/27) fixed skin, hair COLOUR and eyes, and its record says in
   my own words "same person on both sides now, every time". THE HAIRCUT WAS NEVER CHECKED
   and it is the largest shape on a head. MEASURED over 200 citizens before touching
   anything: the body wore 16 distinct haircuts, the portrait could draw SIX, five of the
   seven style names it could hold drew IDENTICAL PIXELS, and agreement was 24.7% -- WORSE
   THAN THE 33% A COIN GIVES over three bands, because two independent hashes are not
   merely unrelated, they can land ANTI-CORRELATED.

   *** THE CAUSE WAS A SENTENCE I WROTE THAT WAS FALSE WHEN I WROTE IT. *** In faceFor:
   "the BODY has no notion of a hairstyle -- NPCFactory picks a painted hair LAYER, not a
   portrait cut." True of NPCFactory. But BOH_PERSONLOOK.lookFor, which is what actually
   dresses the crowd and which faceFor WAS ALREADY CALLING FOR THEIR CLOTHES, hands back
   worn.hair -- one of the fifteen canon cuts, set for 93% of the valley. I CHECKED ONE OF
   THE TWO THINGS THAT DRESS A PERSON AND WROTE DOWN THAT THERE WASN'T ONE.
   WHEN YOU WRITE DOWN THAT SOMETHING DOES NOT EXIST, SAY WHERE YOU LOOKED. A confident
   negative is the most expensive kind of wrong because nobody re-opens it.

   The portrait reads the SAME five dials the body does -- side, front, vol, flare, tex --
   out of the genHair call itself and NOT a second table, because a second table is how the
   two drifted apart (ENGINE SYNC LAW).
   AGREEMENT 24.7% -> 88.2%, correlation 0.924, drawable haircuts 6 -> 56.
   THE APPROVED PLAYER FACE IS BYTE-IDENTICAL (hash c9856a89 against origin/main; the gate
   hashes it every run).

2. HE CAN BUILD HIS OWN FACE   (his 8/25 dispatch item 10, never built)
   There WAS a thing called a face editor: five swatch rows and a nudge pad, and NOT ONE
   CONTROL TOUCHED THE SHAPE OF THE HEAD. At 64 pixels identity IS size and spacing, so it
   could not change a face, only what colour that one face was. And everything it needed
   already existed and none of it was reachable -- faceFor has rolled a full shape
   vocabulary for every stranger since 8/27, so THE PLAYER WAS THE ONE PERSON IN BOHEMIA
   WHO COULD NOT HAVE A DIFFERENT HEAD.
   14 shape sliders, all 15 of the body's haircuts, 4 hair textures, ROLL A FACE (faceFor
   itself, so it cannot make anything the game could not already make), BACK TO PUNK
   (restores the approved face, KEEPS his colours), EXPORT.
   THE ANATOMY IS MINE, THE FACE IS HIS: every slider re-clamps to the rules faceFor obeys,
   so he cannot build a head that is not a head, and nothing is rejected -- the neighbour
   gives way, so a slider always does something.

TWO BROKEN RULERS THIS TURN, THIRD AND FOURTH OF THE WEEK, BOTH FLATTERING-SHAPED:
  - the haircut report compared sp.hair.len, a STRING the fix had just made dead, and
    reported the fix had changed nothing. Its ceiling probe was wrong the same way in the
    same run and reported a ceiling of ONE on a renderer that had just grown five dials.
  - the face-maker harness swept the sliders in order WITHOUT RESETTING and reported MOUTH
    HEIGHT as a dead dial. It was not: an earlier slider had already pushed it to its own
    ceiling through the anatomy clamp. A HARNESS WITH STATE IN IT MEASURES THE STATE.
  Both gates now read RENDERED PIXELS only, and the face-maker gate DRIVES THE REAL PANEL.

AND LOOKING CAUGHT TWO THINGS MEASURING DID NOT: `front` was worth THREE PIXELS because I
ran it down the FACE when the body runs it down the SKULL (13px after), and moving the
crown's outer corners with the hairline opened a six-row stripe of bare scalp -- the mass
let go of itself, the same failure as the body's fall at the jaw one day earlier.

GATES: portrait_haircut_gate 12/0 (new), face_maker_gate 13/0 (new), hairline 12/0,
talking portrait 27/0, alpha loads 20/0, direct 33/0, look 24/0, demo build 25/0,
dress 46/0. Both new gates registered in the suite. Build 8/28n.

WHAT I WOULD DO NEXT, IN ORDER:
 1. THE FACE HE BUILDS DOES NOT SURVIVE A RELOAD. It writes the live pface, which is what
    the game plays, but nothing saves it. That is a SAVE-SYSTEM row and it is the next
    thing that makes the face maker real rather than a toy.
 2. EYEBROW SHAPE and EYE SIZE are in the spec and not on a slider. Four more rows, no new
    mechanism.
 3. THE BODY HAS NO TEXTURED HAIRCUT. The portrait can draw locs and coils; the fifteen
    canon body styles are all tex 'solid', so the texture is the only part of a person's
    hair the two surfaces do not agree on. That is a COOK.

WHAT IS PENDING HIM: nothing from this lane. WHO LIVES IN THE VALLEY (skin tone is uniform
across nine) stays his, flagged not decided.

CARRIED, NOT MINE: RUN's person-card has no speech or face; the LIFE slice carries an
embedded wardrobe bank ~50 garments behind and nothing gates it; two duplicate top-level
function names in COMBAT (CombatBridge, clampPkg).



CHARACTER (character-0lurbs): 8/28 (f) LATEST -- *** HE SENT A HAIR DISPATCH MID-TURN AND
ALL FOUR THINGS IN IT WERE REAL. Hair side-on now has a hairline instead of a bald patch and
a four-pixel strip, and long hair no longer lets go of the head at the jaw. TAB: CHARACTER to
try them on, RUN for the crowd, LOOK for the reference sheet. Nothing to judge. ***

READ THIS PART BEFORE ANYTHING ELSE IN THIS LANE. *** EVERY NUMBER I HAD SAID HE WAS WRONG. ***
I wrote a measurement pass over all fifteen canon hairstyles BEFORE touching anything. It
reported zero bare forehead in profile, an 11px median row, and one break in forty-five
style/facing pairs. Green, green, green, against a man saying "HOLY SHIT" and naming four
specific things. All three measurements were asking a question that was NEARLY the right one:
the forehead check walked only the two rows ABOVE the face part when the bald patch is BESIDE
it; the width took a BOUNDING BOX, so a row with hair at both ends and a hole between measured
eleven pixels; the break test called a row unbroken if ANY pixel on it was hair, when the break
is HORIZONTAL. SECOND TIME IN THREE DAYS -- 8/25's edge-parity audit read 50.9% "already
native" over nine styles that were solid blocks. IT IS A RULE NOW: WHEN A NUMBER DISAGREES WITH
HIM ABOUT A PICTURE, GO AND LOOK AT THE PICTURE, AND THEN FIX THE RULER. What found all four
was rendering every style in every direction and looking, which his own 8/25 dispatch (item 3)
had already ordered and I had not done.

THE THREE CAUSES:
  1. SIDE-ON, A FACE IS MOST OF A HEAD. The head is 16-18px across in profile and ONLY THE BACK
     4-6 COLUMNS ARE THE SKULL PART -- forehead, temple, ear, cheek and jaw are all painted
     FACE. put() refuses hair on a face pixel unless you are looking at the back of the head.
     So hair got the top fifth plus a four-pixel strip: "balding back" AND "a single line going
     down", TWO OF HIS FOUR COMPLAINTS FROM ONE RULE. The 8/2 fix already knew this and taught
     it to sideBot (how far DOWN) and never to put() (how far ACROSS).
  2. A LOOP WITH TWO BOUNDS HAS TWO PLACES TO BE WRONG. An earlier fix widened `fs` to the whole
     head at the jaw and left mn/mx tracking the CHIN, so both curtain loops ran ZERO TIMES.
     LONG LOOSE facing S drew hair on rows 16-29, NOTHING on 30-31, and picked up at 32.
  3. A NAPE IS WHERE HAIR ENDS. The nape taper drew on every back view however long the style
     was, pinching the mass to a point at the jaw and flaring out under it.

TWO OF THOSE THREE WERE HALF-FINISHED FIXES THAT LEFT A CORRECT COMMENT STANDING OVER INCORRECT
CODE. Both would survive any review that reads the comment and believes it.

MEASURED: balding styles in profile 11 of 15 -> 0 (worst browline coverage 25% -> 56%); pieces
of hair floating off the head 6 -> 0; falls choking at the neck 8 -> 0; typical row below the
brow 10px -> 12-16px. NOT ONE HAIRCUT DELETED OR SHORTENED, which the gate checks separately
because a haircut that is whole BECAUSE IT STOPPED AT THE JAW passes every other test.

THE 56 PIN MOVED ON PURPOSE: 220 of 1744 hashes, ALL genHair, nothing else. It exists so 4x
work cannot disturb approved art and was never meant to outrank a ruling (8/1).
gates/clothes_56_pin.txt now carries a REBASELINE LOG in its header saying who ruled and what
changed, so nobody reads this as somebody clearing a red.

GATE: gates/hairline_gate.js, 12 checks, MUTATION-PROVED by hand with three separate mutations,
each caught by a different check. Its first test proves the ruler can tell a haircut from a
shaved head before any other number counts.

ALSO SHIPPED THIS TURN (both from earlier in the same session):
  - ONE ID, ONE WHOLE PERSON. His "eye colors matching the portrait again" was much worse than
    eyes: SKIN agreed 8%, HAIR agreed 0.0% over 200 people, and every body in the game drew THE
    PLAYER'S IRIS. Two mechanisms existed for skin and hair (ENGINE SYNC -- the younger one is
    deleted); NO mechanism existed for eyes. And the city's own hair was a clown parade: red
    16.2%, pink 12.8%, black RAREST at 12.7%. Now 2.0/3.0/34.2. Skin proved byte-identical.
  - THE 10% COAT CAP. He set a hard ceiling "no matter what" because it is a desert game. The
    factions were at 3 of 13 = 23% and my own gate had exempted them BY DESIGN and said so in
    its header as though that were a virtue. One faction now, 7.7%.

WHAT I WOULD DO NEXT, IN ORDER:
 1. HE NAMED THREE HAIR LENGTHS AND TWO TEXTURES and that is the whole vocabulary the renderer
    reads. More is a COOK, not a fix, and it is the next real thing in this lane.
 2. FROM BEHIND, A LONG FALL IS A SOLID SLAB. Real, measured, and NOT something he named --
    do not spend a turn on it before item 1.
 3. FACE CUSTOMISATION, never built, is still on the board from the 8/25 dispatch (item 10).

WHAT IS PENDING HIM: nothing from this lane. WHO LIVES IN THE VALLEY (skin tone is uniform
across nine) is a demographic question and therefore his, flagged not decided.

CARRIED, NOT MINE: RUN's person-card has no speech or face (another lane's file); the LIFE
slice carries an embedded wardrobe bank 47 garments behind and nothing gates it; two duplicate
top-level function names in COMBAT (CombatBridge, clampPkg) found by talking_portrait_gate.



CHARACTER (character-0lurbs): 8/27 (d) LATEST -- *** THE PORTRAIT POPS UP WHEN
SOMEBODY TALKS. His 8/26 ask, finally delivered, and the reason it could not be
delivered on 8/26 is one grep. TAB: RUN (the opening scene), LOOK (the picture).
Nothing to judge. ***

=== WHY THE 8/26 TURN SHIPPED A FEATURE NOBODY COULD SEE ===
facePerform() was built 8/26 and was CORRECT: four visemes off the letters, blinks
on measured human timing, brows, deterministic, gated. Nothing in the game called
it, and the handoff said so without saying WHY. Here is why:

*** renderFace HAS BEEN INVOKED EXACTLY ONE WAY IN THIS ENTIRE CODEBASE --
renderFace(buildSpec()) -- AND buildSpec() CLONES `pface`, THE PLAYER'S FACE. ***

Only the player had a face. FAMILY_CAST had `dials` and `worn` and no face. Every
stranger in the valley had a body and no face. "Their portrait pops up" had nothing
to pop up. THE MISSING PIECE WAS NEVER THE ANIMATION. IT WAS A FACE FOR SOMEBODY
WHO IS NOT YOU.

IF YOU TAKE ONE THING FROM THIS HANDOFF: when a finished feature has no caller,
the bug is usually not IN the feature. Go and look at what it needs that does not
exist yet.

=== WHAT SHIPPED ===
faceFor(id, over) -- a face for anybody, rolled from their id.
  IDENTITY AT 64x64 IS SIZE AND SPACING, NOT DETAIL (also what face-recognition
  calls the identity channel: shape, and the relative position of the organs).
  Every field it dials ALREADY EXISTED. renderFace did not change to make this work.
  GROUNDED (REALISM FIRST): vertical thirds held and jittered only INSIDE their
  third; eye gap about one eye wide; the mouth a FRACTION of the face (~1/3 cheek)
  and never a fixed number; jaw<=cheek and chin<=jaw-6, or the dice eventually roll
  a triangle standing on its point; A CHILD IS NOT A SMALL ADULT (bigger cranium,
  rounder jaw, features lower) driven off the `age` FAMILY_CAST already carried.
  DETERMINISTIC, no dice: the person you met yesterday has the face you remember,
  on any phone, with nothing stored.
  HIS OUTRIGHT: faceFor(id, over) lets an explicit spec beat the roll, so a `face`
  block on a FAMILY_CAST row lands with zero code change. Nothing here decides who
  anybody IS.
speakingPortrait(canvas) -- runs it. rAF + facePerform + a render cache keyed on
  (mouth, blink/8, brow/4), so the whole performance is a couple of dozen images
  rendered once, not sixty a second.
THE COLD OPEN -- the first thing anybody sees in the demo. It already had a speaker
  and a line and no face. Now the speaker's portrait sits BESIDE the words (a head
  ON TOP pushes the caption into the thumb on a phone) and performs while they
  talk. A TITLE CARD HAS NO SPEAKER SO IT HAS NO FACE. A REPAINT IS NOT A NEW LINE
  -- the caption repaints several times a beat, so say() dedupes on speaker+text
  the way cutVoice already had to. Third time that bug has been paid for.

=== THREE THINGS LOOKING CAUGHT THAT MEASURING DID NOT ===
  1. A CLOWN PARADE. HAIR_COLORS lists pink and violet beside black; a uniform pick
     gave THREE PINK HEADS IN SIXTEEN. *** THAT IS THE TRENCHCOAT BUG OF 8/27
     EXACTLY, ONE DAY LATER: uniform over a list whose contents are not uniform in
     life. *** Weighted now; dye 6.0% of 600 and therefore a statement, which is
     COLOUR IS TERRITORY applied to a head. Grey is dealt from AGE, because grey is
     not a colour anybody picks.
  2. DIALS THAT COULD NOT MOVE THE PIXELS. Five hair-style names rolled when
     renderFace tests for TWO, and an eyeY jitter of +-0.7px so all forty people had
     IDENTICAL eyes. A DIAL THAT CANNOT MOVE THE PIXELS IS NOT A DIAL, IT IS A
     COMMENT -- written eighty lines above and broken in the very next block.
  3. A STRAIGHT RULED PART down every single head (8/1 clause 3). Fixed with the
     8/25 strand-drift method. COST TO THE APPROVED PLAYER FACE: 8 PIXELS OF 4096
     (0.20%), all of them the part line, measured against origin/main.

=== AND THE WORST ONE, WHICH ONLY A GATE FOUND ===
*** faceHash ALREADY EXISTED *** (one argument, eighty lines up) and is what the
8/26 blink scheduler calls. I declared a SECOND function faceHash(id, salt) below
it. Two same-named function declarations in one scope is NOT an error and NOT a
warning: THE LAST ONE SILENTLY WINS FOR THE WHOLE FILE. So my hash became the one
facePerform was calling, salt undefined -- still deterministic, no crash, EVERY
CHECK STILL GREEN, and every person in the game blinking to a clock nobody
measured. NOTHING READS AS A BUG WHEN IT IS SPELLED CORRECTLY AND SITS IN THE WRONG
PLACE. Renamed faceRollHash and made mechanical: NO TWO TOP-LEVEL FUNCTIONS SHARE
A NAME.
THAT CHECK ALSO FOUND TWO PRE-EXISTING COLLISIONS, NOT MINE: CombatBridge and
clampPkg, each inlined TWICE, byte-identical, COMBAT's. Identical copies make
last-wins a no-op so nothing is broken today, but the day one copy gets fixed and
the other does not, THE FIX SILENTLY LOSES -- ENGINE SYNC's failure mode with no
gate on it. Pinned at 2 and handed over. Do not rewrite another lane's module.

GATES: talking_portrait NEW 23/0, registered TALKING PORTRAIT, MUTATION-PROVED
  THREE WAYS (flatten the roll -> "everybody is the same person" fires; hide the
  canvas -> "the portrait pops up" fires; restore the ruled part -> "no straight
  line down the crown" fires at 60/60). closest of 60 faces 0.0135, mean 0.091,
  dye 6.0% of 600, ruled parts 4/60, mouth 16/21/22 px, blink 56, brow 34.
  SAMPLE SIZE IS PART OF THE CLAIM: pairwise distance is O(n^2) over 4096 pixels so
  it runs on 60, but the dye SHARE runs on 600 -- the first cut read 10% on 60
  against a true 6% and would have failed a correct build.
  Also green: craft_law 39/0, face_feature_scale 7/0, chin_law 10/0,
  head_follows_rig 5/0, family_cast 26/0, hair 35/0, alpha_loads 20/0, look 24/0
  (48 pictures).

WHAT THE NEXT CHARACTER SESSION PICKS UP:
  1. THE PORTRAIT IS IN THE COLD OPEN ONLY. The RUN's person-card (cardFor in
     slices/BOHEMIA_CITY_WORLD.html) is a FACT SHEET with no speech and no face --
     and it is another lane's file, so coordinate. Then his action-button idea from
     the same message: "maybe their portrait will pop up in your action button... to
     keep that part of the UI decent and composed".
  2. MEASURE EYE COLOUR AGREEMENT portrait vs world body. He said "eye colors
     matching the portrait again" on 8/26 and it is STILL NOT MEASURED. Measure
     before building. faceFor now owns the portrait's iris, so this is finally a
     question with two ends to compare.
  3. THE HEAD HAS THREE HAIR LENGTHS AND TWO TEXTURES AND THAT IS THE WHOLE
     WARDROBE. renderFace tests style for 'wavy_mid'/'curly' and nothing else. Real
     cuts -- a fade, a ponytail, a shaved side -- are a cook of their own.
  4. MORE CLOTHING (carried from 8/27a). He has said it twice.
  5. The colour law's open row: the Mob/Reds red, five factions on the desert hue.
     HIS to rule on. Do not invent ownership.
  6. THE LIFE SLICE'S EMBEDDED WARDROBE BANK IS 47 GARMENTS BEHIND (`count: 221`)
     and nothing gates its freshness. Another lane's slice.
  7. NOT MINE: CANVAS MEMORY red, #354 TASTE, #356 ART 45, and the two duplicate
     COMBAT functions above.

*** AND THE WHOLE SUITE ACTUALLY RAN, FOR THE FIRST TIME. *** The 448-gate suite
cannot finish inside its own 2700s budget -- it measured 10.4s a gate and told me so,
naming the shard commands. Running `--shard 1/3`, `2/3`, `3/3` in sequence ran ALL
452 with ZERO "NEVER RAN" and zero unclassified reds. That is the honest one-pass
verification from here on: three shards, not one run that quietly stops at 373.
  shard 1  12 red: GRAVEYARD, SEE THROUGH, SEE-THROUGH MOVE, MIX, COMBAT LAB,
           CAST SHAPES, WALK DEADLOCK, SQUINT, BANKS USED, NO PRISON,
           NO BULLSHIT Qs, RF4 TEARDOWN
  shard 2  13 red: LATE ART, DAY LOOP, COMBAT RUNS, MOTION VISIBLE, FIELD SURGERY,
           DEAD CODE, HUE, QUEST PLACEMENT, RUN PEOPLE, TASTE, TARGET MATCH,
           CANVAS MEMORY, TOP OF THE DOC
  shard 3  12 red: FULL RES, TIME TO PLAY, VALLEY CENSUS, ROUND + DOORS,
           VOICE SURFACES, SFX DIVERSITY, OUTFITS 13, THE RUN, RENDER PIXEL,
           ONE WORLD TAB, INVISIBLE SCHEDULE, REUSE FIRST
  NOT ONE OF THE 37 IS THIS TURN'S. The two that touch this lane are both standing
  and both already verified against main: OUTFITS 13 (16/2, the same two failures
  since 8/26) and CAST SHAPES. REUSE FIRST is bohemia_floor_cook.py, another lane's
  file, already on main.

  node gates/talking_portrait_gate.js          23/0
  node tools/bohemia_the_portrait_pops_up.js   the picture, LOOK tab
  records/BOHEMIA_EVERYBODY_HAS_A_FACE_8_27_26.txt
  laws/BOHEMIA_LAW_EVERYBODY_HAS_A_FACE_8_27_26.md

CHARACTER (character-0lurbs): 8/26 (n) -- *** ONE IN THREE PEOPLE IN THE CITY
HAD A HAT ON AND YOU COULD NOT SEE IT. AND ALL 52 OTHER "FINDINGS" WERE MY RULER.
TAB: LOOK for the picture, CITY to walk through the crowd. Nothing to judge. ***

PART ONE: THE HAT BUG WAS FOUR TIMES BIGGER THAN "SEVENTEEN GARMENTS".
Yesterday's fix restored 17 canon garments that rendered nothing. Counting them as
menu items undersells it, because THE CITY DRESSES ITSELF OUT OF THE SAME CATALOGUE.
MEASURED on 5,000 people generated exactly the way the game generates them
(BOH_PERSONLOOK.lookFor with the canon pool -- the same call the crowd makes):
    29.6%  of everybody in the city wears headwear
    88.2%  of the hats they were wearing DREW NOTHING
    28.4%  of EVERY PERSON IN THE CITY put something on their head and stayed bare
Only TWO of the seventeen head garments in the game worked (shemagh, scrap helm).
The town read as a place where almost nobody owns a hat. That is the honest measure
of a bug that was, in code, one literal `56`.

PART TWO: THE IDENTITY AUDIT ON CLOTHES. FIRST RUN SAID 52 GARMENTS CHANGE BY A
TENTH OF THE BODY OR MORE IN ONE NOTCH OF TURN. *** EVERY ONE OF THEM WAS ME
MEASURING THE CAMERA INSTEAD OF THE CLOTHES. *** Three separate ruler bugs:
  SLEEVE ON A BACKPACK -- a pack hangs BEHIND the arms, so from behind it is between
    you and them and paints them, side-on the near arm is in front of it. Asked only
    of layers that HAVE sleeves now, and NEVER off the profile: side-on the near arm
    sits in front of the torso and a SLEEVELESS apron scored 0.68. You cannot tell a
    sleeve from an occlusion in a flat grid seen edge-on.
  REACH -- and this was the hardest to admit because I wrote it as an identity
    measure. How far a garment stands off the body SIDEWAYS IS NOT A PROPERTY OF THE
    GARMENT. A cap brim points at the camera head-on and lies across the frame
    side-on. That is FORESHORTENING, the whole reason a 3/4 view reads as depth.
    Printed now, never judged.
  OCCLUSION -- and this one cost me a change I threw away. SMITH'S APRON: hem 0.188
    facing S, EXACTLY 0.000 from behind. I read it as an apron that stops existing
    when he turns, wrote the fix (draw the skirt edges where the body does not cover
    them, per row, off the part grid) and IT PAINTED ZERO PIXELS. The panel is 17px
    and his hips are 22. IT IS GENUINELY HIDDEN and the code was right all along.
    Reverted rather than shipped -- a change that draws nothing is exactly the class
    of lie I have spent this week catching. A garment can be OCCLUDED rather than
    ABSENT and a hem read off visible pixels cannot tell those apart, so a facing
    showing under a quarter of a garment's biggest view is skipped as occluded.

WHAT SURVIVES IS VERTICAL: hem, rise, sleeve off the profile. A hem does not
foreshorten when he turns, which is exactly why hem caught the hair bug.

    worst one-notch HEM, all 221 canon garments   0.087 body-heights
    worst one-notch RISE                          0.032
    worst one-notch SLEEVE                        0.100
    garments over a tenth of a body in one notch  52 -> 0

*** THE WARDROBE HOLDS. IT HELD BEFORE I STARTED. *** The only real defect in the
clothes was the 17 that were not drawing -- found by this same audit on its first
run, fixed yesterday, shipped.

AND A RULER NARROWED FOUR TIMES HAS TO BE SHOWN TO STILL HAVE TEETH, because "I
loosened it until it went green" is the exact failure this project has a law about.
MUTATION: make every long coat knee-length IN PROFILE ONLY, one line in genCoat.
    worst hem 0.087 -> 0.248, garments flagged 0 -> 13, gate names SPLIT-TAIL DUSTER.

GATES: one_garment_per_slot 15/0 -- three new ratchets (hem 0.09, rise 0.04, sleeve
  0.11), all mutation-proved, plus the 8/25 every-garment-appears sweep and the 8/21
  slot rules. All on the REAL worn path, the only surface that has caught anything
  this week. look 24/0 (44 pictures).

WHAT THE NEXT CHARACTER SESSION PICKS UP:
  1. *** THE THING I KEEP LEARNING AND WOULD TELL ANY LANE: A METRIC THAT MOVES WHEN
     THE CAMERA MOVES CANNOT CATCH A DEFECT. *** Four rulers in two days died of it --
     hair AREA, garment SLEEVE, garment REACH, and hem-under-occlusion. Before you
     pin a number, ask what it does when nothing is wrong and the view changes. If
     the answer is "it moves", it is not a defect detector, it is a camera detector.
  2. The wardrobe and the hair now both hold identity across 8 facings and both are
     gated. The next honest question for this lane is ANIMATION: does a garment hold
     its identity across the FRAMES of a walk cycle, not just the facings? Nothing
     has ever asked. Same audit, time axis instead of turn axis.
  3. NOT MINE: CANVAS MEMORY red, #354 TASTE, #356 ART 45.

  node gates/one_garment_per_slot_gate.js        15/0
  node tools/bohemia_the_bald_crowd.js           the picture, LOOK tab
  node tools/bohemia_garment_identity_audit.js   the audit, ruler and all
  records/BOHEMIA_THE_WARDROBE_HOLDS_AND_THE_RULER_DID_NOT_8_26_26.txt


CHARACTER (character-0lurbs): 8/26 (b) -- *** SEVENTEEN THINGS HE COULD PUT
ON DREW NOTHING AT ALL, AND THE GATE THAT GUARDS THEM WAS GREEN. TAB: LOOK for the
picture, CHARACTER to put one on. Nothing to judge. ***

HOW IT WAS FOUND IS THE POINT. The hair audit built for clause 1 of his 8/25 law
found two of fifteen styles that were a mane from the front and a crop from the
side, inside a green gate. The obvious next question was whether genHair was
special. IT WAS NOT -- every generator branches on facing and nothing had ever
asked the same question of the 204 canon garments. So the audit was ported
(tools/bohemia_garment_identity_audit.js). It was looking for a coat that changes
shape when you turn round.

*** IT FOUND SEVENTEEN GARMENTS THAT WERE NOT THERE. ***
    every KNIT CAP, WATCH CAP, FIELD CAP, WORK CAP and SLOUCH BEANIE
    CHINESE RICE FARMER HAT
    WRAPAROUND SHADES and GREY WRAPAROUNDS
MEASURED ON THE REAL FRAME, wearing them: equipping one changed ZERO PIXELS. Not
thin, not misplaced. ABSENT. He could pick one in CHARACTER and nothing happened.

THE CAUSE: ONE LITERAL 56, TWICE, IN TWO GENERATORS. BAKED is RIG2X'd and its layer
indices pack at BAKED.W = 112; both call sites divided by a hard-coded 56, which
returns DOUBLE the row. In genHat a second error was stacked on the first --
`rt*S` -- so the durag line hats may not cross came out at ROW -12, twelve rows
above the top of the canvas. put() refuses everything below the line. Nothing drew.
  The comment on that line reads "HAT_MAX_Y is RIG space, rt is 56 space -- scale rt
  or the durag line lands at half depth". Half true. rt only LOOKED like 56 space
  because of the literal 56 directly above it. A FIX APPLIED TO A MISREAD
  MEASUREMENT MADE IT TWICE AS WRONG, and then the comment made it look considered.
genAcc's shades had the same two errors in one expression (a 24-wide painted layer
converted to 56 space and never scaled to the rig, plus the same /56 on BAKED).

*** AND THE HEADWEAR GATE WAS GREEN THROUGH ALL OF IT, FOR TWO REASONS, AND BOTH
ARE WORTH CARRYING TO EVERY LANE: ***
  1. IT LIFTS genHat OUT OF THE ALPHA and runs it on a synthetic grid, so BAKED and
     HAT_MAX_Y are undefined there and the broken path NEVER EXECUTES. A gate that
     lifts a function out of its environment cannot see a bug that lives in the
     environment. If your gate greps or lifts, it is not testing the game.
  2. WHAT IT HOLDS IS "a hat never crosses the durag line", AND A HAT THAT DRAWS
     NOTHING CROSSES NOTHING. A check a corpse passes is not checking for life.

AND MY OWN FIRST VERSION OF THE NEW GATE WAS ALSO VACUOUS, which is the same lesson
a third time in one day: it compared "wearing it" to "wearing nothing", and putting
a garment on SUPPRESSES the painted layer of that slot (the 8/21 rule), so the frame
differed by HIS DURAG DISAPPEARING even when the hat drew nothing. It was measuring
"something changed", not "the garment appeared". It passed the mutation. The painted
layer of the slot under test is pulled in BOTH frames now.

MEASURED:
    canon garments drawing NOTHING on every facing   17  ->  0
    head/face garments that render facing S       10/27  ->  25/27
    STORM KNIT CAP worn, pixels changed on frame      0  ->  242
    WRAPAROUND SHADES                                 0  ->  188
The five that still draw nothing on SOME facing are shades, the gas mask and the two
bandanas on the three BACK facings. Deliberate and correct: you cannot see somebody's
sunglasses from behind. The gate judges each garment where it should show.

GATES: one_garment_per_slot 12/0 (new sweep, all 221 canon garments, real worn path,
  MUTATION-PROVED -- restoring both original errors names 15 of the 17 by name).
  hat_gate 13/0, hair 35/0, clothes_4x 13/0, craft_law 39/0, structure 134/0,
  border 6/0, head_follows_rig 5/0, hood 11/0.
LOOK: all 42 pictures retaken. Editing the alpha legitimately made every picture of
  it stale and the look gate said so; I retook every one with its own recorded
  shooter (the command the gate itself prints), including the world/city ones, and
  spot-checked that they still show what their captions claim. 24/0.

WHAT THE NEXT CHARACTER SESSION PICKS UP -- P0-GARMENTID, and the first job is
FIXING THE RULER, NOT THE TARGET:
  1. The audit reports 52 garments changing by a tenth of the body or more in one
     notch. MOST OF THAT IS THE RULER BEING WRONG for back-LAYER items: from behind,
     a pack sits between you and the arms, so "sleeve coverage" is a property of the
     VIEW there and not of the object -- the exact mistake the hair gate made with
     area. Triage the ruler before chasing a single garment.
  2. Then the two that look like real bugs: SMITH'S APRON / TRADES APRON hem 0.188
     facing S and 0.000 from behind (an apron vanishing below the waist as he turns),
     and ROAD CAPE / SHOULDER MANTLE switching on and off at the E->NE notch.
  3. NOT MINE: CANVAS MEMORY red, #354 TASTE, #356 ART 45.

  node gates/one_garment_per_slot_gate.js        12/0
  node tools/bohemia_the_missing_hats.js         the picture, LOOK tab
  node tools/bohemia_garment_identity_audit.js   the audit that found them
  records/BOHEMIA_SEVENTEEN_GARMENTS_DREW_NOTHING_8_25_26.txt


CHARACTER (character-0lurbs): 8/25 (y) -- *** A SHOULDER-LENGTH HAIRCUT WAS
A CROP THE MOMENT HE TURNED HIS HEAD, AND THE GATE THAT WAS SUPPOSED TO CATCH THAT
WAS GREEN. TAB: LOOK for the picture, CHARACTER for the hair. Nothing to judge. ***

HIS RULING (8/25) DID THREE THINGS AND THE FIRST ONE CLOSED A P0:
"the side view is a lot better east and west you just have to be intentional with
 the hairstyles making them looking good and the same and coordinated from all
 angles. and you know we made the character model 4x and i feel like with
 especiallythe hair your still playing with the orignal pixels..."
  1. *** THE E/W PROFILE HOLD IS LIFTED. Do not re-ask him about profiles. ***
  2. CLAUSE 1: one haircut, eight angles, still one haircut.
  3. CLAUSE 2: draw in the pixels we actually have.
Law written and gated 8/25: laws/BOHEMIA_LAW_HAIR_AT_FOUR_TIMES_THE_PIXELS_8_25_26.md

CLAUSE 2 SHIPPED EARLIER TODAY (build q, strandPass): 9 of 15 styles had NO
one-pixel mark inside their own silhouette; 0 of 15 now, 47 -> 820 marks.
records/BOHEMIA_HAIR_AT_FOUR_TIMES_THE_PIXELS_8_25_26.txt

*** CLAUSE 1 SHIPPED THIS BUILD, AND IT WAS BROKEN WHEN I CHECKED IT. ***

    SHOULDER LENGTH   11 pixels of hair below the jaw facing S, SE and SW.
    LONG LOOSE        ZERO facing E, NE, N, NW or W.

Two of fifteen were a mane from the front and a crop from the side -- the exact
failure the clause names. `sideF` is HOW A STYLE'S LENGTH IS WRITTEN DOWN (SHOULDER
LENGTH 1.60, LONG LOOSE 2.40), and BOTH earlier repairs -- THE BACK IS THE WHOLE
SKULL (8/1) and PROFILE GETS THE WHOLE SKULL TOO (8/2) -- clamped it to `hBot`.
That is a FLOOR for a cropped style and a GUILLOTINE for a long one, and neither fix
asked which. One line now says both intents: never less than the skull, never less
than the style's own length.

*** THE LESSON WORTH CARRYING TO EVERY LANE: THE CLAUSE-1 GATE WAS GREEN THROUGH ALL
OF IT, BECAUSE IT PINNED A QUANTITY THAT IS SUPPOSED TO MOVE. *** It measured the
hair's AREA between adjacent facings at 62%. Area SHOULD swing -- from the front you
see a face and two curtains, from behind a whole skull of hair. A pin on a quantity
that legitimately moves can never catch one that must not. HOW FAR THE HAIR FALLS is
a property of the object and not of the view. That is the ruler, and it is pinned now.

TWO MORE BUGS CAME OUT FROM UNDER IT:
  - THE LENGTH DIAL WAS NOT REACHING THE RENDER AT ALL. side 1.60 and side 2.40 --
    a 50% difference -- both drew the same 11px, because the below-jaw taper ate the
    whole curtain. Every style's fall stopped at the same row whatever it asked for.
  - backEx WAS THE ONE LENGTH IN genHair THAT NEVER LEARNED ABOUT 112. Raw pixels
    where everything beside it goes through fr(). WOLF CUT's back length went 1.00
    head-heights at 56 to 0.64 at 112: THE HAIRCUT GOT SHORTER BECAUSE THE CANVAS GOT
    BIGGER. In cells now. It was also an on/off switch on a thing that turns (full
    length on seven facings, zero on the front), so a fall appeared out of nowhere
    between SE and E; it ramps now, which is his own 8/1 "even from the front I would
    like to see a couple pixels of hair even if it is in the back of the head".

*** AND I DREW IT WRONG TWICE BEFORE I DREW IT RIGHT. ONLY LOOKING CAUGHT EITHER. ***
  1. Widening the curtain to survive the taper walked the two curtains inward until
     they MERGED -- long hair as one rat's tail down the sternum, WOLF CUT as a solid
     sheet across the chest, which is the thing the curtain rule exists to forbid.
  2. Anchoring the fall to span() at the jaw -- the narrowest row of the whole skull
     -- pinched the hair in at the jawline and picked it up again at full width
     underneath, so the hair DETACHED and floated off his shoulders.
BOTH TIMES EVERY NUMBER I HAD SAID THE LENGTH WAS CORRECT, AND THE LENGTH WAS
CORRECT. VERIFY ON THE REAL SURFACE is the only instrument that caught either, and
that is twice this week.

AND A FIX THAT TRADES ONE RULING FOR ANOTHER IS NOT A FIX: long falls are long
straight edges, and clause 3 (8/1) went 19.5% -> 21.1% the moment they got their
length back. NOT fixed by loosening the pin. Free-hanging hair MOVES MORE than hair
pressed to a skull -- wob() fires one row in four, which is a hairline lying on bone.
A second independent step, both edges of every curtain, every facing's fall. Back to
19.5%, unmoved, and the falls read as hair instead of ribbon.

MEASURED (head-heights of fall, scale-free):
    SHOULDER LENGTH   S 0.50 / E 0.00 / N 0.00  ->  0.50 on all eight
    LONG LOOSE        S 0.50 / E 0.00 / N 0.00  ->  1.27-1.30 on all eight
      and LONG LOOSE is now genuinely longer than SHOULDER LENGTH, which it was
      not before on ANY facing
    worst one-notch length change, 15 styles   1.273  ->  0.300
    clause 3 straightness, six open-air facings 19.5%  ->  19.5% (unmoved)
The 0.300 that remains is ASH SWEEP turning SW to W: a back-of-head length coming
into view. That is anatomy, named as such rather than engineered away.

GATES: hair_gate 35/0, three new ratchets, ALL THREE MUTATION-TESTED --
  length may not change in one notch (pinned 0.31) | never a sheet across his chest
  (pinned 0) | from behind and side-on the hair reaches the jaw (pinned 0 short).
  mutation: put sideBot back to the guillotine -> RED at 1.273 naming LONG LOOSE.
  mutation: remove the no-touching cap -> RED naming six style/facing pairs.
craft_law_gate: its clause-2 pin was a SPELLING TEST matching the literal
  `(back||prof)?hBot:` -- which IS the guillotine -- so fixing the bug turned it red.
  A GATE MUST NEVER OUTRANK A RULING: ruler fixed, real proof moved to hair_gate
  where it runs on rendered pixels. 39/0.
56 PIN MOVED ON PURPOSE: 208 of 1,744, EVERY ONE genHair with a long `side` (26
  cases x 8 facings, nothing outside hair). The bug was just as real at 56.
clothes_4x PINNED_COARSE 18 -> 15 (the fall's sway put a 1px mark in three more).

WHAT THE NEXT CHARACTER SESSION PICKS UP:
  1. *** THE SAME AUDIT HAS NEVER BEEN RUN ON CLOTHES. *** genHair was not special:
     every generator branches on facing, and nothing asserts a COAT is the same coat
     from the back. tools/bohemia_hair_identity_audit.js is the pattern -- scale-free
     properties of the OBJECT (length, height, reach), never of the view (area), one
     notch of turn. Expect the same class of bug and expect area-style rulers to be
     hiding it.
  2. HAIR STATUS, CHECKED, because the old handoff said "21 unjudged styles held":
     the catalogue holds 36 hair entries -- 15 canon and 21 DEAD. There is no held
     ballot of 21. GRAVEYARD IS FINAL; do not remake them.
  3. NOT MINE: CANVAS MEMORY red, #354 TASTE, #356 ART 45.

  node gates/hair_gate.js                        35/0
  node tools/bohemia_one_haircut_eight_ways.js   the picture, LOOK tab
  node tools/bohemia_hair_identity_audit.js      the four identity rulers
  records/BOHEMIA_A_HAIRCUT_IS_ONE_HAIRCUT_8_25_26.txt


CHARACTER (character-0lurbs): 8/25 (b) -- *** P0-PROFILE: THE HAIR WAS IN FRONT
OF HIS FACE. He was right, and it is one defect, and it is fixed. ***

Round 4, 8/20: "east and west hairstyles look like ABSOLUTE DOG SHIT ACROSS THE BOARD."
13 of 15 killed. ACROSS THE BOARD = one render defect judged thirteen times. IT WAS THIS:
on the rows his eyes, nose and mouth occupy, the hair mass expanded PAST THE FRONT OF HIS
FACE and hung in the empty air there. His face was squeezed between hair behind and hair
in front, so every profile read as a helmet with a slot instead of a person.
    546 hair pixels in front of the face.   ZERO of 15 styles clean.   Now 0, all clean.
WHY NOBODY FOUND IT: put() already refuses to paint ON the face and has been green for
weeks. The hair was never ON his face. IT WAS IN FRONT OF IT, on background pixels, where
no rule was looking. A fringe over the forehead is untouched (forehead is above the face
part); below the jaw is untouched (hair falls in front of the shoulders).

*** THREE WRONG THEORIES FIRST, AND THE ANSWER WAS IN A NUMBER I ALREADY HAD. ***
  1 "styles collapse into one shape in profile" -- REJECTED, E/W are 127%/128% AS
    DISTINCT as south. 2 "the back facings collapsed into one" -- REJECTED, all eight
    differ. 3 "hair covers his nose" -- REJECTED, the nose survives everywhere.
Theory 3's measurement said the silhouette reached 2px FURTHER RIGHT with hair. I read
that as "good, the nose survives". IT WAS TELLING ME THE HAIR WAS 2PX IN FRONT OF HIS
NOSE. A NUMBER YOU HAVE ALREADY TAKEN CAN BE THE ANSWER WHILE YOU READ IT AS REASSURANCE.
What broke it was rendering THE BARE HEAD beside the haired one. Bare profile has brow,
nose, mouth, jaw, neck and reads as a person; haired was a ball. Ten minutes, and it
should have been first not fifth. IF A VIEW LOOKS WRONG, STRIP EVERYTHING OFF IT FIRST.

*** AND THE FIX BROKE CLAUSE 3, WHICH MEANS IT WAS NOT A FIX. *** Clamping at one column
made a dead-straight edge down the face; straight runs 18.5% -> 23.9%, longest 6 -> 10.
TWO JAG ATTEMPTS FAILED and are recorded: 1-in-4 moved it 0.1 points, 1-in-2 moved it
none. The edge is not wandering, it is TRACING HIS PAINTED FACE, and a real hairline in
profile IS straight -- it runs down in front of the ear. THE RULER WAS MEASURING TWO
THINGS AS ONE NUMBER. Split:
    six open-air facings  pinned 19.5% / longest 6   UNCHANGED from 8/21
    two profiles          pinned 40%   / longest 10  the hairline on his face
Front and back pins did not move. Only the profile is looser, and only because the clamp
is the fix to his verdict.

THE 56 PIN MOVED ON PURPOSE: 136 of 1,744 hashes. Not drift, not a 4x edit -- the profile
change HE ASKED FOR, re-taken deliberately with the record as the reason.

GATES: hair_gate 30/0 with NO HAIR IN FRONT OF HIS FACE pinned at ZERO (mutation fires at
546 naming the worst six) plus the split clause 3. All other character gates green.
Record: records/BOHEMIA_HAIR_WAS_IN_FRONT_OF_HIS_FACE_8_25_26.txt

*** THE 21 UNJUDGED STYLES STAY HELD. *** The row's judge column says ONE HEAD FIRST: show
him a single style in profile and let him say the view is fixed before anything is queued.
LOOK tab: "IS THE SIDE VIEW FIXED?" -- bare head on top, temple taper below, front and both
sides. Temple taper is one of the TWO HE KEPT, so his answer is a verdict on the VIEW and
not the style. DO NOT QUEUE THE 21 UNTIL HE ANSWERS. My confidence is not the test; I was
wrong three times today.

NEXT IN THIS LANE
  - HE ANSWERS THE ONE HEAD. If good, the 21 unjudged go to a ballot. If still bad, the
    bare-head-beside-haired comparison is the tool that works -- use it first this time.
  - STEP 5 IS DONE AND SHOULD STOP: 22 of 204 garments have no fine detail and most of
    them are correctly plain (a sash is a band of cloth). The ratchet only has to not rise.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE, #356 ART 45 likewise.

---

CHARACTER (character-0lurbs): 8/25 (a) -- *** THE HEM. Row 2X step 5, fifth and
last big pass. 102 of 200 with no fine detail on Friday, 22 of 204 now. ***

    8/22 boots 102->84   8/23 gloves/belts/scarves/masks ->66
    8/24 gear rivets ->44   8/25 shirts and coats ->22
    base 50/68 -> 65/68     outer 20/31 -> 27/31
The remaining 22 are mostly things that SHOULD be plain: a hip sash is a band of cloth, a
bandolier is a strap, a shemagh is a wrap. Do not force marks onto them to chase a number.

*** IT SHIPPED AS A PURE NO-OP FIRST AND THE AUDIT SAID SO. *** The stitch went on the
BOTTOM ROW in r.dk and the numbers did not move by one garment. Measured instead of
guessed: all 8 candidate pixels were ALREADY r.dk, because a garment darkens its own hem
edge. PAINTING DARK OVER DARK IS A NO-OP, and "no change" looks exactly like "did not
help". Fixed two ways and the correct placement turned out to be the visible one: ONE CELL
ABOVE THE FOLD (where real hemming runs), and CONTRAST WITH WHAT IS THERE (dark cloth takes
a mid thread). base 50->65 the moment it could be seen.

*** THE HELPER TOOK FOUR GATES RED AT ONCE. *** Calling hemStitch directly turned HEADWEAR,
HOODIE, OPEN-COAT and STRUCTURE red together, all saying genTop/genCoat/genHat "do not
render". They were THROWING: each of those gates builds generators in isolation with its
own short helper list, and a helper added today is in none of them. SAME SHAPE AS THE
`window is not defined` BREAK TWO DAYS AGO: A GENERATOR THAT DEPENDS ON SOMETHING OUTSIDE
ITSELF BREAKS EVERY HARNESS THAT DOES NOT KNOW ABOUT IT, AND THERE ARE MORE HARNESSES THAN
ANYONE REMEMBERS. Guarded at the call site with typeof, which fixes all four and every
future one, instead of editing four helper lists and waiting to find the fifth.

*** THE PICTURE LIED A THIRD TIME SO THE TOOL NOW REFUSES TO. *** Three identical-halves
pictures this week, three different causes: a flag a generator never read (8/23), a garment
name not in the catalogue (8/24), a crop framed away from the change (8/25). The tool now
COUNTS DIFFERING PIXELS INSIDE THE CROP and prints NO DIFFERENCE IN THIS CROP when it is
zero. A before/after can no longer claim a null result it did not measure.

GATES: clothes_4x 13/0 (STEP 5 ratchet 27 -> 18, downward only). STRUCTURE 134/0, HEADWEAR
13/0, HOODIE 11/0, OPEN-COAT 12/0 back after the guard. LOOK 24/0, 36 pictures, none stale
-- the-spawn-sidewalk clears now too. 1,744 pinned 56 hashes unmoved.
Record: records/BOHEMIA_THE_HEM_8_25_26.txt   LOOK tab: "THE HEM".

NEXT IN THIS LANE
  - STEP 5 IS ESSENTIALLY DONE AND SHOULD STOP HERE. 22 of 204 remain and most of them
    are correctly plain. Forcing marks onto a sash or a strap to move the number would be
    chasing the ratchet instead of the craft. THE RATCHET ONLY HAS TO NOT RISE.
  - WHAT IS ACTUALLY NEXT IS HIS TASTE, NOT MORE COUNTING: five before/after pictures are
    in the LOOK tab now (hair edge, profile, boot stitch, small things, hardware, hem).
    If he dislikes the style, one correction changes all of them, because every mark comes
    from four shared passes rather than 200 hand edits.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, fine since. Still unexplained.

---

CHARACTER (character-0lurbs): 8/24 (a) -- *** THE HARDWARE. Row 2X step 5, fourth
pass, and the biggest single jump: 66 of 200 -> 44 of 204 with no fine detail. ***

    gear   4/22 -> 24/26      back  3/11 -> 7/11      waist 2/5 -> 4/5
THE WEEK: 102 (8/22 morning) -> boots 84 -> gloves/belts/scarves/masks 66 -> gear/bags 44.
THE DENOMINATOR MOVED, 200 -> 204, AND THAT IS NOT ROUNDING: the metric only counts a
garment that draws a bounded colour run at all, and four pieces that drew nothing
measurable now do. Said plainly rather than folded into a nicer number.

A rivet is ONE pixel. At 56 a chest plate is three rows and a stud row would have been
half the plate. ONE PASS, NOT FOURTEEN EDITS: genGear's kinds each build their own output
and return it, so rivets go on AT THE RETURN (15 sites), and a new kind gets them free
instead of being forgotten. genBag the same on 5. Only on runs >=3 cells tall so a strap
does not become a dotted line. A rivet RECOLOURS a pixel the plate already owned --
nothing moved, nothing thinned. S>1 only; 1,744 pinned 56 hashes hold.

*** THE PICTURE LIED AGAIN, DIFFERENTLY. *** Two rows showed a body wearing NOTHING,
before and after, looking exactly like a real comparison where the change did nothing.
The garment names were wrong -- I wrote 'SCRAP CHESTPLATE', the canon name is 'SCRAP CHEST
PLATE'. A name not in the catalogue draws nothing, and nothing beside nothing is a very
convincing null result. SECOND lying picture in two days (yesterday's had both columns
identical because genAcc never read the flag). SAME ROOT: A TOOL THAT CANNOT DISTINGUISH
"NO CHANGE" FROM "NOTHING RAN" WILL ALWAYS REPORT THE COMFORTABLE ONE. It prints NOT IN
THE CATALOGUE in red now. Both were caught only by LOOKING AT THE PICTURE.

GATES: clothes_4x 13/0, STEP 5 ratchet 40 -> 27 (downward only). All character gates green.
Record: records/BOHEMIA_THE_HARDWARE_8_24_26.txt
LOOK tab: "THE HARDWARE", before beside after, same generators.

NEXT IN THIS LANE
  - STEP 5, WHAT IS LEFT (run the audit, it names the worst per layer):
        base 50/68   outer 20/31   legs 21/24   face 5/8 (3 bandanas, different path)
        head 0/2     gear 24/26    back 7/11    waist 4/5
    base and outer are the big two now: shirts want a placket/cuff stitch, coats a lapel
    seam. head is only 2 garments and is the cheapest remaining zero.
  - BEFORE ADDING, GREP THE GENERATOR FOR A RULED WIDTH. genShoes' heel seam has his own
    words next to it. ADD marks, never shrink his.
  - BEFORE SHIPPING A BEFORE/AFTER, CHECK THE GARMENT NAME EXISTS AND THE FLAG IS READ BY
    THAT GENERATOR. Both failure modes have now cost a turn each.
  - the-spawn-sidewalk STILL has no shooter (reported 8/23). WORLD lane, one manifest line.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, fine since. Still unexplained.

---

CHARACTER (character-0lurbs): 8/23 (a) -- *** THE SMALL THINGS. Row 2X step 5,
third pass: four more garment types get a mark they never had. 84 of 200 -> 66 of 200. ***

    gloves   knuckle seam    hands 0/4 -> 4/4      scarves  woven weft   neck 0/7 -> 7/7
    belts    edge stitching  waist 0/5 -> 2/5      masks    hem stitch   face 0/8 -> 5/8
(tool belts are genGear's, not genAcc's, which is why waist stops at 2/5.)

*** THE RULE THAT MATTERS MORE THAN THE MARKS: ADD, NEVER SHRINK. *** Nothing he ruled on
got thinner. genShoes' heel seam is S wide with HIS OWN reason written above it; the
belt's buckle, the glove's edge, the scarf ring's split and the mask's top band all keep
their widths. The temptation on every one of these was to thin the existing line, and that
would have quietly overwritten a ruling. CHECK FOR A RECORDED WIDTH BEFORE TOUCHING ONE.

MEASURE THE BODY, DO NOT GUESS IT: the knuckle seam went in at mn+2*S and DREW NOTHING.
The hand is six rows tall at 112, so that is the fifth of six and the generator's own edge
test (which reaches two pixels) correctly called it an edge. Probed the real part grid,
moved it to mn+S, landed. A row index guessed from the shape of the CODE rather than the
shape of the BODY is a coin flip.

AND THE PICTURE LIED ONCE FIRST: the before/after came out with both columns IDENTICAL,
because CLO_NOSTITCH gated the boot stitch and genAcc had never been taught to read it.
A BEFORE/AFTER WHERE NOTHING DIFFERS IS NOT A NULL RESULT, IT IS A BROKEN TOOL. Only
looking at the picture catches that.

GATES: clothes_4x 13/0, STEP 5 ratchet moved 44 -> 40 (downward only, so nobody deletes
detail to go green and step 5 cannot stall). 1,744 pinned 56 hashes unmoved -- every mark
is S>1 only. ACCESSORIES 13/0.
Record: records/BOHEMIA_THE_SMALL_THINGS_8_23_26.txt
LOOK tab: "THE SMALL THINGS", before beside after, same generators.

*** ONE RED I DID NOT FIX AND IT IS NOT THIS LANE'S. *** LOOK is 23/1 on ONE stale
picture: the-spawn-sidewalk. It photographs the CITY WORLD, belongs to WORLD, and RECORDS
NO SHOOTER -- no tool in the repo references it, so nobody can retake it. VERIFIED
PRE-EXISTING: stash everything I did, run the gate on clean main, same 23/1, same picture.
I retook the other 28 that went stale (every one that records how it was taken).
THE FIX IS ONE LINE IN THE MANIFEST AND IT IS WORLD'S: give it a shooter. Same hole I
closed for the twelve city shots on 8/20, in a picture added since.

NEXT IN THIS LANE
  - STEP 5 CONTINUES. The audit names what is left: gear 4/22, back 3/11, outer 20/31,
    base 50/68, head 0/2, and 3 bandanas in face that take a different code path from the
    masks. Gear and bags are the big ones. Run the audit first; it names the worst per layer.
  - BEFORE ADDING, CHECK FOR A RULED WIDTH. Grep the generator for his name or a quote.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, passed repeatedly since. Still unexplained.
  - THE CONTAINER USUALLY COMES UP ON A STALE TREE with old files staged that look like
    unfinished work. DIFF AGAINST origin/main BEFORE BELIEVING IT. (Clean this session.)

---

CHARACTER (character-0lurbs): 8/22 (a) -- *** FOUR TIMES THE PIXELS WAS BUYING A
BIGGER BOOT, NOT A FINER ONE. Row 2X step 5, second item. Plus two of my own gates that
were lying, one of them vacuously. ***

MEASURED EVERY CANON GARMENT (tools/bohemia_seam_width_audit.js, real posed body): the
thinnest colour run with a different colour on BOTH sides -- what a seam or stitch line
looks like in the output.
    feet 0/18   face 0/8   hands 0/4   neck 0/7   waist 0/5   head 0/2
    gear 4/22   back 3/11  outer 20/31  legs 21/24  base 50/68
    *** 102 OF 200 CANON GARMENTS HAD NO ONE-PIXEL DETAIL ANYWHERE. ***
A mark drawn one CELL wide is TWO pixels at 112, so a garment that only scales comes out
chunkier relative to the body. That is the whole of step 5 in one number.

I DID NOT THIN THE EXISTING MARKS, AND THAT WAS THE IMPORTANT CALL. genShoes' heel seam
is S wide with HIS OWN REASON recorded above it ("holding it at a literal 1 on a 112 rig
would halve the seam he approved"). Same for the lace ladder and midsole. What shipped is
a mark that DID NOT EXIST: the welt stitch where the upper meets the sole, 1px, dotted on
odd columns, skipped on the outermost column so it never thickens the derived outline.
S>1 only, so the 56 wardrobe is byte-identical and its 1,744 hashes do not move.
    feet 0/18 -> 18/18.   total 102/200 -> 84/200.

*** MY OWN GATE CAUGHT ME PUTTING A BUG IN THE SHIPPING FILE. *** First cut read the flag
as `window.CLO_NOSTITCH`; clothes_4x builds generators with new Function and NO DOM, so it
went red instantly: "genShoes THREW window is not defined". A bare window. inside a
generator throws anywhere there is no window, and headless is where the gates live. Read
through typeof now, like genHair reads CLO_NOSUB. THE GATE THAT LOOKS FROM A DIFFERENT
ANGLE IS THE ONE THAT EARNS ITS KEEP -- the game has a window, so playing it would never
have shown this.

*** AND YESTERDAY'S one_garment_per_slot HAD TWO UNPROVEN CLAIMS AND ONE VACUOUS ONE. ***
It walked G.equipped, and HAT AND GLASSES ARE EMPTY in his default equip, so both were
skipped IN SILENCE -- claims sitting inside a green gate. Equipped on purpose: durag
1,488 px bare / 0 worn, shades 216 / 0. Then a new "every slot must have had something to
hide" check caught a third: SHIRT showed 0 even bare, because PD.meta.order draws shirt
BEFORE jacket and his painted fuzz jacket covers his cowl-hoodie completely -- the shirt
test was measuring an empty stage. Each slot is isolated from the layers drawn after it
now. THE MUTATION TELLS IT: remove the suppression and yesterday's gate named FOUR slots,
today's names SEVEN (hair:261 hat:313 shirt:92 jacket:18 pants:72 shoes:61 glasses:192).
597 of those pixels were invisible to the audit I shipped yesterday and called complete.

GATES: clothes_4x 13/0 with a new STEP 5 ONLY GOES FORWARD ratchet (shapes with no 1px
detail, pinned 44 on the fixture, downward only; mutation fires at 46). It is NOT a demand
that every garment carry fine detail -- a belt is a band -- it is a promise the count never
rises so step 5 cannot quietly stall. one_garment_per_slot 11/0.
Record: records/BOHEMIA_FOUR_TIMES_THE_PIXELS_BOUGHT_A_BIGGER_BOOT_8_22_26.txt
LOOK tab: "THE BOOTS GOT STITCHING", before beside after, same generator (CLO_NOSTITCH).

NEXT IN THIS LANE
  - STEP 5 CONTINUES and the audit says exactly where: face 0/8, hands 0/4, neck 0/7,
    waist 0/5, head 0/2, gear 4/22. Gloves want knuckle seams, belts a buckle tongue,
    scarves a fringe. Run the audit first; it names the worst offender per layer.
  - BEFORE ADDING ANYTHING, CHECK WHETHER A WIDTH WAS RULED ON. The heel seam nearly got
    thinned by me on the way past. ADD marks, do not shrink his.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, passed 4x alone since. Still unexplained.
  - THE CONTAINER COMES UP ON AN 8/14 TREE EVERY SESSION with 8/12-era files staged that
    look like unfinished work. They are not. DIFF AGAINST origin/main BEFORE BELIEVING IT.

---

CHARACTER (character-0lurbs): 8/21 (c) -- *** IT WAS NEVER JUST THE HAIR.
Yesterday's hair fix was a SLOT fix wearing a hair fix's clothes, and three more of his
painted layers were leaking the same way in the build he is playing. ***

THE MECHANISM WAS NEVER HAIR-SPECIFIC: a generator spans the PART GRID, his paint reaches
past it, so any painted layer whose slot gets a generated garment peeks out along the
edges. Audited all nine on the real worn path, all 8 facings (tools/bohemia_pd_leak_audit.js):
    pants/leather-legwarmer   68 px through BLUE JEANS
    shoes/balenciaga          61 px through WHITE SNEAKERS
    jacket/japanese-fuzz      18 px through WASTELAND DUSTER
    shirt 0,  hair 0 (fixed yesterday)
Fixing hair and stopping would have left these forever: the visible symptom was on the
head, and the head was fixed.

THE FIX IS NOW GENERAL, no special case: if a generated garment of a slot is worn, the
painted layer of that slot is not drawn.
    hair->hair  hat->head  shirt->base  jacket->outer  pants->legs  shoes->feet  glasses->face
body and facial are ABSENT FROM THAT MAP ON PURPOSE and the gate fails if either is added.

BOTH RISKS MEASURED, NOT ASSUMED:
  HIS DEFAULT LOOK -- G_WORN is null until something dresses him. 32 frames (8 facings x
  2 clips x 2 phases) rendered off origin/main and off this build: BYTE-IDENTICAL.
  HIS FACE -- dressed head to toe, his painted face is still on the frame. Asserted two
  independent ways (the source map must not contain 'facial'; the pixels must survive).
RIG LAW UNTOUCHED: nothing edited, one layer not DRAWN while its slot is filled, back the
moment it is empty.

*** A MISTAKE IN MY OWN TOOL, AND THE LESSON IS THE POINT. *** The audit's first run
reported "no generated counterpart" for all six layers and looked like a clean bill of
health. It was a TYPO IN A LOOKUP TABLE -- I assumed the PD slots were named base/legs/
feet/outer like the wardrobe's layers; they are shirt/pants/shoes/jacket. Every pairing
missed, and a missed pairing PRINTED AS REASSURANCE. A LOOKUP THAT MISSES SILENTLY IS THE
SAME BUG AS A GATE THAT PASSES VACUOUSLY. The only reason I caught it is that a clean
result was the answer I wanted, which is exactly when to look twice. Slot names are read
from PD.meta.order now.

GATE: gates/one_garment_per_slot_gate.js 9/0, registered as ONE PER SLOT. Three mutations
all caught and all naming the culprit (remove suppression -> each slot named with its
count; add 'facial' -> "0 painted face pixels"; fire with nothing worn -> "BARE ON NE,N,NW").
Record: records/BOHEMIA_IT_WAS_NEVER_JUST_THE_HAIR_8_21_26.txt
LOOK tab: "IT WAS NEVER JUST THE HAIR", before beside after from the SAME code (CLO_KEEP_PD).
The caption says plainly these are MUCH subtler than the hair blob -- 147 px at hips and
boot edges. Overselling a small fix after a big one is how the next real finding stops
being believed.

NEXT IN THIS LANE
  - STEP 5 of row 2X continues: seams, hems, laces, buckles and stitch lines still step
    by a whole cell at 112. Measure which actually read coarse before assuming.
  - hat/durag and glasses/shades were NOT exercised by the audit (both slots empty in his
    default equip), so their pairing is asserted but unproven. Equip one and re-run.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21 then passed 4x alone. Still unexplained.

---

CHARACTER (character-0lurbs): 8/21 (b) -- *** TWO HAIRSTYLES ON ONE HEAD.
He said "Continue fixing east and west hair pls". Two defects, both PROFILE ONLY. ***

Facing S is byte-identical before and after everything below, which is why three weeks
of front views never caught either one.

1. HIS PAINTED BOB WAS DRAWING UNDER EVERY HAIRSTYLE. hair/curtain-bob is a PD layer;
   a generated hairstyle stamps after it, so front-on it was simply covered. In profile
   it is not: genHair spans the PART GRID and his paint reaches two cells past it each
   side at the crown (facing E row 10: part ids x52-59, his paint x50-61). His bob's
   ramp holds exactly [27,26,32] and [237,232,220], so the near-white one stuck out over
   the forehead. 1,349 leaked pixels over 15 styles x 3 facings; 3,677 over all 8.
   THE FIX IS NOT MORE HAIR -- widening the span patches the symptom and leaves two
   hairstyles stacked on one head. The PD hair layer is not DRAWN while a hair garment
   is worn. RIG LAW untouched: his bob is not edited and returns the moment one is not.
2. THE FADE STOPPED HALFWAY IN PROFILE. fadeBot was a HAND COPY of sideBot made before
   the 8/2 profile fix and never updated with it, so the taper ended mid-mass. Tinted
   pixels sat at mean height 0.74 of the hair instead of 0.91, twice as many, smeared
   into the crown. It IS sideBot now -- one expression, cannot drift.

I GUESSED THE FADE FIRST AND I WAS WRONG. Fixed it, blob still there. Then measured:
zero hair pixels above luminance 120 on a ramp topping out at 50, so the bright pixels
were never hair. Pulling PD layers one at a time named the bob in one pass. The fade fix
stayed only because I then measured it ON ITS OWN -- a change that survives because it
was made on the way to something else is not verified, it is just present.

AND THE FIRST PICTURE COULD NOT HAVE SHOWN IT: the tool stamped generators onto
buildFrame's output by hand, which matches the render order but SKIPS THE PD LAYER LOGIC
ENTIRELY. It drives G_WORN now. VERIFY ON THE REAL SURFACE means the real path, not a
composite that resembles it.

GATES: hair_gate 27/0. His bob never shows under a worn hairstyle (15 styles x 8 facings,
counted by his own ramp colours on the worn path, pinned at 0; mutation fires at 3,677).
The fade bottom IS the hair bottom, asserted in SOURCE because the bug was two diverging
copies of one expression. Record:
records/BOHEMIA_TWO_HAIRSTYLES_ON_ONE_HEAD_8_21_26.txt
LOOK tab: "THE WHITE BLOB IN PROFILE", before beside after, both from the SAME code.

ONE HONEST LOOSE END: CROWD went 15/1 once inside a twenty-gate loop, then passed four
times running on its own. That is a FLAKE UNDER LOAD, not a pass. Recorded rather than
called green. Not in the hair path; nothing here touches the crowd.

THE CONTAINER CAME UP ON AN 8/14 TREE AGAIN, second session running, with 8/12-era files
staged that look exactly like unfinished work. They are not: all five were strictly older
copies of things already on main. DIFF AGAINST origin/main BEFORE BELIEVING A DIRTY TREE.

NEXT IN THIS LANE
  - STEP 5 continues: seams, hems, laces, buckles and stitch lines all still step by a
    whole cell. Measure which actually read coarse at 112 before assuming.
  - The same PART-GRID-vs-PAINT gap that hid his bob may affect OTHER PD layers in
    profile (hat/durag, facial/punk-face). Worth one measurement pass.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.

---

CHARACTER (character-0lurbs): 8/21 (a) -- *** THE HAIR STOPPED BEING STRAIGHT.
Row 2X STEP 5 has started: the first content that actually uses the new pixels. ***

HIS CLAUSE 3 (8/1, LOCKED): "hair is about just the little off shapes that it makes ...
I'm seeing you make like a lot of straight lines and that's not realistic at all."

The wobble built that day works and is still correct. But it hashes the CELL row and its
only amplitude is S, so the moment the rig went to 112 it became a TWO PIXEL step on a
cell-sized grid -- the same silhouette as 56, drawn bigger. FOUR TIMES THE PIXELS BOUGHT
A SHARPER HAIR EDGE, NOT A FINER ONE.

NOTHING NOTICED, AND THAT IS THE REUSABLE PART: craft_law_gate asserts clause 3 by
FINDING THE WOBBLE IN THE SOURCE. It was there, hashed, deterministic, exactly as
written. A SOURCE CHECK CANNOT TELL YOU THE EDGE IT PRODUCES IS DEAD STRAIGHT.

MEASURED (tools/bohemia_hair_straightness.js), before -> after:
    rows in a straight run of 4+     50.7%  ->  18.5%
    longest straight edge            16     ->  6
The cell step is UNTOUCHED (the coarse shape is the one he approved); where it says stay
put, the individual PIXEL row may move by ONE. Cannot become static: it only fires where
the coarse step did NOT, so total travel is unchanged, and at S===1 it never fires, which
is why all 1,744 pinned 56 hashes are byte-identical.
Tried 1-in-4 as well: 28.0% and 12 -- worse on BOTH axes, no trade-off to tune.

*** THE GATE HAD TO BE WIDENED AND I COULD NOT MAKE THE WIDENING SELF-CHECKING. ***
clothes_4x claim 1 ("112 output IS 56 scaled") forbids the entire point of the flip once
any authored detail exists. A GATE MUST NEVER OUTRANK A RULING, so a generator may carry
@SUBCELL-DETAIL and gets ONE pixel / 12% coverage of slack, nothing else does. I tried
twice to make the machine verify the marker and FAILED TWICE -- recorded so nobody
rebuilds it: (1) comparing 112 to doubled-56 is useless, native drawing differs anyway;
(2) counting split cells does NOT separate them -- genHair scores 4 while genCoat scores
13 and genGear 17 with no sub-cell authoring at all. A third attempt would have been the
fourth version of an unasked-for thing. THE RISK IS BOUNDED AND MEASURED: mutation-tested
with the wide bound in force, the backpack hardcode still fires at 31%. A false marker
can excuse a small honest difference; it cannot hide a mis-scaling bug.

CLAUSE 3 NOW HAS A PIXEL GATE: hair_gate ratchets PINNED_STRAIGHT 0.185 / PINNED_LONGEST
6, both downward-only. Mutation: disable the sub-step and it fires reporting 50.7% and 16.
Record: records/BOHEMIA_THE_HAIR_STOPPED_BEING_STRAIGHT_8_21_26.txt
LOOK tab: "THE HAIR STOPPED BEING STRAIGHT" -- old edge beside new, SAME generator
(CLO_NOSUB switches the sub-step off for the tool), so the only difference on screen is
the thing being judged.

ALSO, AND IT COST THE FIRST HALF OF THE SESSION: THE CONTAINER CAME UP ON AN 8/14 TREE
with 8/12-era files staged, which looks exactly like unfinished mid-flight work. It was
not -- origin/main was 8/21 and already contained every one of those files, in NEWER
form. Checked all five against main before resetting; every local copy was strictly
older. IF A CONTAINER LOOKS LIKE IT HAS UNCOMMITTED WORK, DIFF IT AGAINST origin/main
BEFORE BELIEVING IT.

CORRECTED A STALE NOTE OF MY OWN: my last handoff sent the next session to build "the
fade-blends-into-skin-tone item marked [UNBUILT]". IT IS BUILT -- 8/1, amended 8/2
(skull-only). The [UNBUILT] tag lives in the 8/14 TWICE THE PIXELS addendum and is stale
there too.

NEXT IN THIS LANE
  - STEP 5 CONTINUES and hair is only the first of it. The same "sharper not finer"
    audit is owed on every other generator: seams, hems, laces, buckles and stitch lines
    all still step by a whole cell. genCoat and genGear already split cells natively, so
    start by measuring which ones actually read coarse at 112 rather than assuming.
  - CANVAS MEMORY still red, still NOT this lane's: 104 full-resolution images decode to
    850 MB. It needs smaller DIMENSIONS, not quantizing.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (f) -- *** I PUBLISHED A BUG THAT DOES NOT
EXIST AND THEN WENT TO FIX IT. THERE IS NO JAW DEBT. ***

This morning I wrote, in a commit and a record and this file: "the skinner was always
drawing the chin two cells too wide, Scale2x was hiding it." IT IS NOT TRUE.

HEAD FOLLOWS RIG compares the rig's painted FACE (part 2) against EVERY SKIN-COLOURED
PIXEL on the row. The row also carries the HEAD (part 1, wider than the face
everywhere but the cheekbones) and, on the chin rows, the NECK. All three are skin.
Measured row by row on the real frame:
    y12-y29   drawn skin == posed HEAD+FACE        to the pixel
    y30-y31   drawn skin == posed HEAD+FACE+NECK   to the pixel
    UNEXPLAINED PIXELS: ZERO
Every deviation it has ever reported is the head being wider than the face. Anatomy.

*** A RULER COMPARING TWO DIFFERENT REGIONS CANNOT BE REPAIRED BY RESCALING IT. ***
My first pass DID improve that gate -- turned a pixel count into a resolution-free
ratio, wrote out the reasoning, mutation-tested both directions. A well-built
instrument pointed at the wrong thing, and every good habit made the wrong answer
more convincing. The tell I walked past: every deviating row was off by EXACTLY 4 and
every zero row stayed exactly zero. A real defect is not constant across a face; a
region mismatch is, because it is one region minus another.

IT ASSERTS LIKE-FOR-LIKE NOW, and it is exact: the POSED head+face silhouette, row
for row, IS the rig's -- same regions, same space, read off PART IDS, on ALL EIGHT
FACINGS instead of one.  S:0 SE:0 E:0 NE:0 N:0 NW:0 W:0 SW:0, total 0, PINNED AT ZERO
and unloosenable. Mutation: widen the posed head one cell on S and it fires naming
the facing. Sampled at the REST phase on purpose -- at ph=0.37 deviation is 12-44,
which is the animation working, not a bug.
DO NOT GO HUNTING A CHIN BUG. Correction:
records/BOHEMIA_THERE_IS_NO_JAW_DEBT_AND_THERE_NEVER_WAS_8_20_26.txt

THAT IS FIVE WRONG RULERS IN THREE DAYS (reuse-first read a docstring as code; dress
counted a sentence as a garment; pages summed a surface we stopped publishing;
border measured a diagonal along a raster row; head compared a face to a head). THE
COMMON FORM: checker and checked are in different units, regions or files, and
nothing notices because the number still looks like a number. WHEN A RATCHET MOVES,
ASK WHAT IT COMPARES BEFORE YOU ASK WHAT BROKE.

ALSO SHIPPED
  wear() hashed the RAW PIXEL INDEX, so at 112 each sub-pixel got its own coin flip
  and a salvaged coat read as television static. Hashes the CELL now; proved
  identical at 56 by measurement (4,184 pixels, 4 scuff amounts, 0 different). Last
  per-pixel hash in the wardrobe path.

  THE LOOK TAB WAS RED ON MAIN AND NOBODY COULD CLEAR IT: twelve city pictures went
  stale when the WORLD lane edited the city, and none recorded a `shooter`, so the
  gate could only say "NO SHOOTER RECORDED". All seventeen shots that tool takes now
  name it and the twelve were retaken. Seven CHARACTER pictures were genuinely stale
  (the character is 4x since this morning) and were retaken too. 24/0, 27 pictures.

NEXT IN THIS LANE
  - STEP (5) of row 2X is open and is the headline now: real authored detail per
    garment and hairstyle at 112, plus the fade-blends-into-skin-tone item his
    hair-and-shape law marks [UNBUILT]. Normal cooks, his normal thumbs.
  - CANVAS MEMORY is still red and still NOT this lane's: 104 full-resolution images
    decode to 850 MB (VOTE 69 / 633 MB, ART 27 / 209 MB), byte-identical before and
    after the flip. Quantizing cannot help -- decoded cost is w*h*4 whatever the file
    weighs. It needs smaller DIMENSIONS.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/24 (a) -- *** THE HARDWARE. Row 2X step 5, fourth
pass, and the biggest single jump: 66 of 200 -> 44 of 204 with no fine detail. ***

    gear   4/22 -> 24/26      back  3/11 -> 7/11      waist 2/5 -> 4/5
THE WEEK: 102 (8/22 morning) -> boots 84 -> gloves/belts/scarves/masks 66 -> gear/bags 44.
THE DENOMINATOR MOVED, 200 -> 204, AND THAT IS NOT ROUNDING: the metric only counts a
garment that draws a bounded colour run at all, and four pieces that drew nothing
measurable now do. Said plainly rather than folded into a nicer number.

A rivet is ONE pixel. At 56 a chest plate is three rows and a stud row would have been
half the plate. ONE PASS, NOT FOURTEEN EDITS: genGear's kinds each build their own output
and return it, so rivets go on AT THE RETURN (15 sites), and a new kind gets them free
instead of being forgotten. genBag the same on 5. Only on runs >=3 cells tall so a strap
does not become a dotted line. A rivet RECOLOURS a pixel the plate already owned --
nothing moved, nothing thinned. S>1 only; 1,744 pinned 56 hashes hold.

*** THE PICTURE LIED AGAIN, DIFFERENTLY. *** Two rows showed a body wearing NOTHING,
before and after, looking exactly like a real comparison where the change did nothing.
The garment names were wrong -- I wrote 'SCRAP CHESTPLATE', the canon name is 'SCRAP CHEST
PLATE'. A name not in the catalogue draws nothing, and nothing beside nothing is a very
convincing null result. SECOND lying picture in two days (yesterday's had both columns
identical because genAcc never read the flag). SAME ROOT: A TOOL THAT CANNOT DISTINGUISH
"NO CHANGE" FROM "NOTHING RAN" WILL ALWAYS REPORT THE COMFORTABLE ONE. It prints NOT IN
THE CATALOGUE in red now. Both were caught only by LOOKING AT THE PICTURE.

GATES: clothes_4x 13/0, STEP 5 ratchet 40 -> 27 (downward only). All character gates green.
Record: records/BOHEMIA_THE_HARDWARE_8_24_26.txt
LOOK tab: "THE HARDWARE", before beside after, same generators.

NEXT IN THIS LANE
  - STEP 5, WHAT IS LEFT (run the audit, it names the worst per layer):
        base 50/68   outer 20/31   legs 21/24   face 5/8 (3 bandanas, different path)
        head 0/2     gear 24/26    back 7/11    waist 4/5
    base and outer are the big two now: shirts want a placket/cuff stitch, coats a lapel
    seam. head is only 2 garments and is the cheapest remaining zero.
  - BEFORE ADDING, GREP THE GENERATOR FOR A RULED WIDTH. genShoes' heel seam has his own
    words next to it. ADD marks, never shrink his.
  - BEFORE SHIPPING A BEFORE/AFTER, CHECK THE GARMENT NAME EXISTS AND THE FLAG IS READ BY
    THAT GENERATOR. Both failure modes have now cost a turn each.
  - the-spawn-sidewalk STILL has no shooter (reported 8/23). WORLD lane, one manifest line.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, fine since. Still unexplained.

---

CHARACTER (character-0lurbs): 8/23 (a) -- *** THE SMALL THINGS. Row 2X step 5,
third pass: four more garment types get a mark they never had. 84 of 200 -> 66 of 200. ***

    gloves   knuckle seam    hands 0/4 -> 4/4      scarves  woven weft   neck 0/7 -> 7/7
    belts    edge stitching  waist 0/5 -> 2/5      masks    hem stitch   face 0/8 -> 5/8
(tool belts are genGear's, not genAcc's, which is why waist stops at 2/5.)

*** THE RULE THAT MATTERS MORE THAN THE MARKS: ADD, NEVER SHRINK. *** Nothing he ruled on
got thinner. genShoes' heel seam is S wide with HIS OWN reason written above it; the
belt's buckle, the glove's edge, the scarf ring's split and the mask's top band all keep
their widths. The temptation on every one of these was to thin the existing line, and that
would have quietly overwritten a ruling. CHECK FOR A RECORDED WIDTH BEFORE TOUCHING ONE.

MEASURE THE BODY, DO NOT GUESS IT: the knuckle seam went in at mn+2*S and DREW NOTHING.
The hand is six rows tall at 112, so that is the fifth of six and the generator's own edge
test (which reaches two pixels) correctly called it an edge. Probed the real part grid,
moved it to mn+S, landed. A row index guessed from the shape of the CODE rather than the
shape of the BODY is a coin flip.

AND THE PICTURE LIED ONCE FIRST: the before/after came out with both columns IDENTICAL,
because CLO_NOSTITCH gated the boot stitch and genAcc had never been taught to read it.
A BEFORE/AFTER WHERE NOTHING DIFFERS IS NOT A NULL RESULT, IT IS A BROKEN TOOL. Only
looking at the picture catches that.

GATES: clothes_4x 13/0, STEP 5 ratchet moved 44 -> 40 (downward only, so nobody deletes
detail to go green and step 5 cannot stall). 1,744 pinned 56 hashes unmoved -- every mark
is S>1 only. ACCESSORIES 13/0.
Record: records/BOHEMIA_THE_SMALL_THINGS_8_23_26.txt
LOOK tab: "THE SMALL THINGS", before beside after, same generators.

*** ONE RED I DID NOT FIX AND IT IS NOT THIS LANE'S. *** LOOK is 23/1 on ONE stale
picture: the-spawn-sidewalk. It photographs the CITY WORLD, belongs to WORLD, and RECORDS
NO SHOOTER -- no tool in the repo references it, so nobody can retake it. VERIFIED
PRE-EXISTING: stash everything I did, run the gate on clean main, same 23/1, same picture.
I retook the other 28 that went stale (every one that records how it was taken).
THE FIX IS ONE LINE IN THE MANIFEST AND IT IS WORLD'S: give it a shooter. Same hole I
closed for the twelve city shots on 8/20, in a picture added since.

NEXT IN THIS LANE
  - STEP 5 CONTINUES. The audit names what is left: gear 4/22, back 3/11, outer 20/31,
    base 50/68, head 0/2, and 3 bandanas in face that take a different code path from the
    masks. Gear and bags are the big ones. Run the audit first; it names the worst per layer.
  - BEFORE ADDING, CHECK FOR A RULED WIDTH. Grep the generator for his name or a quote.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, passed repeatedly since. Still unexplained.
  - THE CONTAINER USUALLY COMES UP ON A STALE TREE with old files staged that look like
    unfinished work. DIFF AGAINST origin/main BEFORE BELIEVING IT. (Clean this session.)

---

CHARACTER (character-0lurbs): 8/22 (a) -- *** FOUR TIMES THE PIXELS WAS BUYING A
BIGGER BOOT, NOT A FINER ONE. Row 2X step 5, second item. Plus two of my own gates that
were lying, one of them vacuously. ***

MEASURED EVERY CANON GARMENT (tools/bohemia_seam_width_audit.js, real posed body): the
thinnest colour run with a different colour on BOTH sides -- what a seam or stitch line
looks like in the output.
    feet 0/18   face 0/8   hands 0/4   neck 0/7   waist 0/5   head 0/2
    gear 4/22   back 3/11  outer 20/31  legs 21/24  base 50/68
    *** 102 OF 200 CANON GARMENTS HAD NO ONE-PIXEL DETAIL ANYWHERE. ***
A mark drawn one CELL wide is TWO pixels at 112, so a garment that only scales comes out
chunkier relative to the body. That is the whole of step 5 in one number.

I DID NOT THIN THE EXISTING MARKS, AND THAT WAS THE IMPORTANT CALL. genShoes' heel seam
is S wide with HIS OWN REASON recorded above it ("holding it at a literal 1 on a 112 rig
would halve the seam he approved"). Same for the lace ladder and midsole. What shipped is
a mark that DID NOT EXIST: the welt stitch where the upper meets the sole, 1px, dotted on
odd columns, skipped on the outermost column so it never thickens the derived outline.
S>1 only, so the 56 wardrobe is byte-identical and its 1,744 hashes do not move.
    feet 0/18 -> 18/18.   total 102/200 -> 84/200.

*** MY OWN GATE CAUGHT ME PUTTING A BUG IN THE SHIPPING FILE. *** First cut read the flag
as `window.CLO_NOSTITCH`; clothes_4x builds generators with new Function and NO DOM, so it
went red instantly: "genShoes THREW window is not defined". A bare window. inside a
generator throws anywhere there is no window, and headless is where the gates live. Read
through typeof now, like genHair reads CLO_NOSUB. THE GATE THAT LOOKS FROM A DIFFERENT
ANGLE IS THE ONE THAT EARNS ITS KEEP -- the game has a window, so playing it would never
have shown this.

*** AND YESTERDAY'S one_garment_per_slot HAD TWO UNPROVEN CLAIMS AND ONE VACUOUS ONE. ***
It walked G.equipped, and HAT AND GLASSES ARE EMPTY in his default equip, so both were
skipped IN SILENCE -- claims sitting inside a green gate. Equipped on purpose: durag
1,488 px bare / 0 worn, shades 216 / 0. Then a new "every slot must have had something to
hide" check caught a third: SHIRT showed 0 even bare, because PD.meta.order draws shirt
BEFORE jacket and his painted fuzz jacket covers his cowl-hoodie completely -- the shirt
test was measuring an empty stage. Each slot is isolated from the layers drawn after it
now. THE MUTATION TELLS IT: remove the suppression and yesterday's gate named FOUR slots,
today's names SEVEN (hair:261 hat:313 shirt:92 jacket:18 pants:72 shoes:61 glasses:192).
597 of those pixels were invisible to the audit I shipped yesterday and called complete.

GATES: clothes_4x 13/0 with a new STEP 5 ONLY GOES FORWARD ratchet (shapes with no 1px
detail, pinned 44 on the fixture, downward only; mutation fires at 46). It is NOT a demand
that every garment carry fine detail -- a belt is a band -- it is a promise the count never
rises so step 5 cannot quietly stall. one_garment_per_slot 11/0.
Record: records/BOHEMIA_FOUR_TIMES_THE_PIXELS_BOUGHT_A_BIGGER_BOOT_8_22_26.txt
LOOK tab: "THE BOOTS GOT STITCHING", before beside after, same generator (CLO_NOSTITCH).

NEXT IN THIS LANE
  - STEP 5 CONTINUES and the audit says exactly where: face 0/8, hands 0/4, neck 0/7,
    waist 0/5, head 0/2, gear 4/22. Gloves want knuckle seams, belts a buckle tongue,
    scarves a fringe. Run the audit first; it names the worst offender per layer.
  - BEFORE ADDING ANYTHING, CHECK WHETHER A WIDTH WAS RULED ON. The heel seam nearly got
    thinned by me on the way past. ADD marks, do not shrink his.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, passed 4x alone since. Still unexplained.
  - THE CONTAINER COMES UP ON AN 8/14 TREE EVERY SESSION with 8/12-era files staged that
    look like unfinished work. They are not. DIFF AGAINST origin/main BEFORE BELIEVING IT.

---

CHARACTER (character-0lurbs): 8/21 (c) -- *** IT WAS NEVER JUST THE HAIR.
Yesterday's hair fix was a SLOT fix wearing a hair fix's clothes, and three more of his
painted layers were leaking the same way in the build he is playing. ***

THE MECHANISM WAS NEVER HAIR-SPECIFIC: a generator spans the PART GRID, his paint reaches
past it, so any painted layer whose slot gets a generated garment peeks out along the
edges. Audited all nine on the real worn path, all 8 facings (tools/bohemia_pd_leak_audit.js):
    pants/leather-legwarmer   68 px through BLUE JEANS
    shoes/balenciaga          61 px through WHITE SNEAKERS
    jacket/japanese-fuzz      18 px through WASTELAND DUSTER
    shirt 0,  hair 0 (fixed yesterday)
Fixing hair and stopping would have left these forever: the visible symptom was on the
head, and the head was fixed.

THE FIX IS NOW GENERAL, no special case: if a generated garment of a slot is worn, the
painted layer of that slot is not drawn.
    hair->hair  hat->head  shirt->base  jacket->outer  pants->legs  shoes->feet  glasses->face
body and facial are ABSENT FROM THAT MAP ON PURPOSE and the gate fails if either is added.

BOTH RISKS MEASURED, NOT ASSUMED:
  HIS DEFAULT LOOK -- G_WORN is null until something dresses him. 32 frames (8 facings x
  2 clips x 2 phases) rendered off origin/main and off this build: BYTE-IDENTICAL.
  HIS FACE -- dressed head to toe, his painted face is still on the frame. Asserted two
  independent ways (the source map must not contain 'facial'; the pixels must survive).
RIG LAW UNTOUCHED: nothing edited, one layer not DRAWN while its slot is filled, back the
moment it is empty.

*** A MISTAKE IN MY OWN TOOL, AND THE LESSON IS THE POINT. *** The audit's first run
reported "no generated counterpart" for all six layers and looked like a clean bill of
health. It was a TYPO IN A LOOKUP TABLE -- I assumed the PD slots were named base/legs/
feet/outer like the wardrobe's layers; they are shirt/pants/shoes/jacket. Every pairing
missed, and a missed pairing PRINTED AS REASSURANCE. A LOOKUP THAT MISSES SILENTLY IS THE
SAME BUG AS A GATE THAT PASSES VACUOUSLY. The only reason I caught it is that a clean
result was the answer I wanted, which is exactly when to look twice. Slot names are read
from PD.meta.order now.

GATE: gates/one_garment_per_slot_gate.js 9/0, registered as ONE PER SLOT. Three mutations
all caught and all naming the culprit (remove suppression -> each slot named with its
count; add 'facial' -> "0 painted face pixels"; fire with nothing worn -> "BARE ON NE,N,NW").
Record: records/BOHEMIA_IT_WAS_NEVER_JUST_THE_HAIR_8_21_26.txt
LOOK tab: "IT WAS NEVER JUST THE HAIR", before beside after from the SAME code (CLO_KEEP_PD).
The caption says plainly these are MUCH subtler than the hair blob -- 147 px at hips and
boot edges. Overselling a small fix after a big one is how the next real finding stops
being believed.

NEXT IN THIS LANE
  - STEP 5 of row 2X continues: seams, hems, laces, buckles and stitch lines still step
    by a whole cell at 112. Measure which actually read coarse before assuming.
  - hat/durag and glasses/shades were NOT exercised by the audit (both slots empty in his
    default equip), so their pairing is asserted but unproven. Equip one and re-run.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21 then passed 4x alone. Still unexplained.

---

CHARACTER (character-0lurbs): 8/21 (b) -- *** TWO HAIRSTYLES ON ONE HEAD.
He said "Continue fixing east and west hair pls". Two defects, both PROFILE ONLY. ***

Facing S is byte-identical before and after everything below, which is why three weeks
of front views never caught either one.

1. HIS PAINTED BOB WAS DRAWING UNDER EVERY HAIRSTYLE. hair/curtain-bob is a PD layer;
   a generated hairstyle stamps after it, so front-on it was simply covered. In profile
   it is not: genHair spans the PART GRID and his paint reaches two cells past it each
   side at the crown (facing E row 10: part ids x52-59, his paint x50-61). His bob's
   ramp holds exactly [27,26,32] and [237,232,220], so the near-white one stuck out over
   the forehead. 1,349 leaked pixels over 15 styles x 3 facings; 3,677 over all 8.
   THE FIX IS NOT MORE HAIR -- widening the span patches the symptom and leaves two
   hairstyles stacked on one head. The PD hair layer is not DRAWN while a hair garment
   is worn. RIG LAW untouched: his bob is not edited and returns the moment one is not.
2. THE FADE STOPPED HALFWAY IN PROFILE. fadeBot was a HAND COPY of sideBot made before
   the 8/2 profile fix and never updated with it, so the taper ended mid-mass. Tinted
   pixels sat at mean height 0.74 of the hair instead of 0.91, twice as many, smeared
   into the crown. It IS sideBot now -- one expression, cannot drift.

I GUESSED THE FADE FIRST AND I WAS WRONG. Fixed it, blob still there. Then measured:
zero hair pixels above luminance 120 on a ramp topping out at 50, so the bright pixels
were never hair. Pulling PD layers one at a time named the bob in one pass. The fade fix
stayed only because I then measured it ON ITS OWN -- a change that survives because it
was made on the way to something else is not verified, it is just present.

AND THE FIRST PICTURE COULD NOT HAVE SHOWN IT: the tool stamped generators onto
buildFrame's output by hand, which matches the render order but SKIPS THE PD LAYER LOGIC
ENTIRELY. It drives G_WORN now. VERIFY ON THE REAL SURFACE means the real path, not a
composite that resembles it.

GATES: hair_gate 27/0. His bob never shows under a worn hairstyle (15 styles x 8 facings,
counted by his own ramp colours on the worn path, pinned at 0; mutation fires at 3,677).
The fade bottom IS the hair bottom, asserted in SOURCE because the bug was two diverging
copies of one expression. Record:
records/BOHEMIA_TWO_HAIRSTYLES_ON_ONE_HEAD_8_21_26.txt
LOOK tab: "THE WHITE BLOB IN PROFILE", before beside after, both from the SAME code.

ONE HONEST LOOSE END: CROWD went 15/1 once inside a twenty-gate loop, then passed four
times running on its own. That is a FLAKE UNDER LOAD, not a pass. Recorded rather than
called green. Not in the hair path; nothing here touches the crowd.

THE CONTAINER CAME UP ON AN 8/14 TREE AGAIN, second session running, with 8/12-era files
staged that look exactly like unfinished work. They are not: all five were strictly older
copies of things already on main. DIFF AGAINST origin/main BEFORE BELIEVING A DIRTY TREE.

NEXT IN THIS LANE
  - STEP 5 continues: seams, hems, laces, buckles and stitch lines all still step by a
    whole cell. Measure which actually read coarse at 112 before assuming.
  - The same PART-GRID-vs-PAINT gap that hid his bob may affect OTHER PD layers in
    profile (hat/durag, facial/punk-face). Worth one measurement pass.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.

---

CHARACTER (character-0lurbs): 8/21 (a) -- *** THE HAIR STOPPED BEING STRAIGHT.
Row 2X STEP 5 has started: the first content that actually uses the new pixels. ***

HIS CLAUSE 3 (8/1, LOCKED): "hair is about just the little off shapes that it makes ...
I'm seeing you make like a lot of straight lines and that's not realistic at all."

The wobble built that day works and is still correct. But it hashes the CELL row and its
only amplitude is S, so the moment the rig went to 112 it became a TWO PIXEL step on a
cell-sized grid -- the same silhouette as 56, drawn bigger. FOUR TIMES THE PIXELS BOUGHT
A SHARPER HAIR EDGE, NOT A FINER ONE.

NOTHING NOTICED, AND THAT IS THE REUSABLE PART: craft_law_gate asserts clause 3 by
FINDING THE WOBBLE IN THE SOURCE. It was there, hashed, deterministic, exactly as
written. A SOURCE CHECK CANNOT TELL YOU THE EDGE IT PRODUCES IS DEAD STRAIGHT.

MEASURED (tools/bohemia_hair_straightness.js), before -> after:
    rows in a straight run of 4+     50.7%  ->  18.5%
    longest straight edge            16     ->  6
The cell step is UNTOUCHED (the coarse shape is the one he approved); where it says stay
put, the individual PIXEL row may move by ONE. Cannot become static: it only fires where
the coarse step did NOT, so total travel is unchanged, and at S===1 it never fires, which
is why all 1,744 pinned 56 hashes are byte-identical.
Tried 1-in-4 as well: 28.0% and 12 -- worse on BOTH axes, no trade-off to tune.

*** THE GATE HAD TO BE WIDENED AND I COULD NOT MAKE THE WIDENING SELF-CHECKING. ***
clothes_4x claim 1 ("112 output IS 56 scaled") forbids the entire point of the flip once
any authored detail exists. A GATE MUST NEVER OUTRANK A RULING, so a generator may carry
@SUBCELL-DETAIL and gets ONE pixel / 12% coverage of slack, nothing else does. I tried
twice to make the machine verify the marker and FAILED TWICE -- recorded so nobody
rebuilds it: (1) comparing 112 to doubled-56 is useless, native drawing differs anyway;
(2) counting split cells does NOT separate them -- genHair scores 4 while genCoat scores
13 and genGear 17 with no sub-cell authoring at all. A third attempt would have been the
fourth version of an unasked-for thing. THE RISK IS BOUNDED AND MEASURED: mutation-tested
with the wide bound in force, the backpack hardcode still fires at 31%. A false marker
can excuse a small honest difference; it cannot hide a mis-scaling bug.

CLAUSE 3 NOW HAS A PIXEL GATE: hair_gate ratchets PINNED_STRAIGHT 0.185 / PINNED_LONGEST
6, both downward-only. Mutation: disable the sub-step and it fires reporting 50.7% and 16.
Record: records/BOHEMIA_THE_HAIR_STOPPED_BEING_STRAIGHT_8_21_26.txt
LOOK tab: "THE HAIR STOPPED BEING STRAIGHT" -- old edge beside new, SAME generator
(CLO_NOSUB switches the sub-step off for the tool), so the only difference on screen is
the thing being judged.

ALSO, AND IT COST THE FIRST HALF OF THE SESSION: THE CONTAINER CAME UP ON AN 8/14 TREE
with 8/12-era files staged, which looks exactly like unfinished mid-flight work. It was
not -- origin/main was 8/21 and already contained every one of those files, in NEWER
form. Checked all five against main before resetting; every local copy was strictly
older. IF A CONTAINER LOOKS LIKE IT HAS UNCOMMITTED WORK, DIFF IT AGAINST origin/main
BEFORE BELIEVING IT.

CORRECTED A STALE NOTE OF MY OWN: my last handoff sent the next session to build "the
fade-blends-into-skin-tone item marked [UNBUILT]". IT IS BUILT -- 8/1, amended 8/2
(skull-only). The [UNBUILT] tag lives in the 8/14 TWICE THE PIXELS addendum and is stale
there too.

NEXT IN THIS LANE
  - STEP 5 CONTINUES and hair is only the first of it. The same "sharper not finer"
    audit is owed on every other generator: seams, hems, laces, buckles and stitch lines
    all still step by a whole cell. genCoat and genGear already split cells natively, so
    start by measuring which ones actually read coarse at 112 rather than assuming.
  - CANVAS MEMORY still red, still NOT this lane's: 104 full-resolution images decode to
    850 MB. It needs smaller DIMENSIONS, not quantizing.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (f) -- *** I PUBLISHED A BUG THAT DOES NOT
EXIST AND THEN WENT TO FIX IT. THERE IS NO JAW DEBT. ***

This morning I wrote, in a commit and a record and this file: "the skinner was always
drawing the chin two cells too wide, Scale2x was hiding it." IT IS NOT TRUE.

HEAD FOLLOWS RIG compares the rig's painted FACE (part 2) against EVERY SKIN-COLOURED
PIXEL on the row. The row also carries the HEAD (part 1, wider than the face
everywhere but the cheekbones) and, on the chin rows, the NECK. All three are skin.
Measured row by row on the real frame:
    y12-y29   drawn skin == posed HEAD+FACE        to the pixel
    y30-y31   drawn skin == posed HEAD+FACE+NECK   to the pixel
    UNEXPLAINED PIXELS: ZERO
Every deviation it has ever reported is the head being wider than the face. Anatomy.

*** A RULER COMPARING TWO DIFFERENT REGIONS CANNOT BE REPAIRED BY RESCALING IT. ***
My first pass DID improve that gate -- turned a pixel count into a resolution-free
ratio, wrote out the reasoning, mutation-tested both directions. A well-built
instrument pointed at the wrong thing, and every good habit made the wrong answer
more convincing. The tell I walked past: every deviating row was off by EXACTLY 4 and
every zero row stayed exactly zero. A real defect is not constant across a face; a
region mismatch is, because it is one region minus another.

IT ASSERTS LIKE-FOR-LIKE NOW, and it is exact: the POSED head+face silhouette, row
for row, IS the rig's -- same regions, same space, read off PART IDS, on ALL EIGHT
FACINGS instead of one.  S:0 SE:0 E:0 NE:0 N:0 NW:0 W:0 SW:0, total 0, PINNED AT ZERO
and unloosenable. Mutation: widen the posed head one cell on S and it fires naming
the facing. Sampled at the REST phase on purpose -- at ph=0.37 deviation is 12-44,
which is the animation working, not a bug.
DO NOT GO HUNTING A CHIN BUG. Correction:
records/BOHEMIA_THERE_IS_NO_JAW_DEBT_AND_THERE_NEVER_WAS_8_20_26.txt

THAT IS FIVE WRONG RULERS IN THREE DAYS (reuse-first read a docstring as code; dress
counted a sentence as a garment; pages summed a surface we stopped publishing;
border measured a diagonal along a raster row; head compared a face to a head). THE
COMMON FORM: checker and checked are in different units, regions or files, and
nothing notices because the number still looks like a number. WHEN A RATCHET MOVES,
ASK WHAT IT COMPARES BEFORE YOU ASK WHAT BROKE.

ALSO SHIPPED
  wear() hashed the RAW PIXEL INDEX, so at 112 each sub-pixel got its own coin flip
  and a salvaged coat read as television static. Hashes the CELL now; proved
  identical at 56 by measurement (4,184 pixels, 4 scuff amounts, 0 different). Last
  per-pixel hash in the wardrobe path.

  THE LOOK TAB WAS RED ON MAIN AND NOBODY COULD CLEAR IT: twelve city pictures went
  stale when the WORLD lane edited the city, and none recorded a `shooter`, so the
  gate could only say "NO SHOOTER RECORDED". All seventeen shots that tool takes now
  name it and the twelve were retaken. Seven CHARACTER pictures were genuinely stale
  (the character is 4x since this morning) and were retaken too. 24/0, 27 pictures.

NEXT IN THIS LANE
  - STEP (5) of row 2X is open and is the headline now: real authored detail per
    garment and hairstyle at 112, plus the fade-blends-into-skin-tone item his
    hair-and-shape law marks [UNBUILT]. Normal cooks, his normal thumbs.
  - CANVAS MEMORY is still red and still NOT this lane's: 104 full-resolution images
    decode to 850 MB (VOTE 69 / 633 MB, ART 27 / 209 MB), byte-identical before and
    after the flip. Quantizing cannot help -- decoded cost is w*h*4 whatever the file
    weighs. It needs smaller DIMENSIONS.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/24 (a) -- *** THE HARDWARE. Row 2X step 5, fourth
pass, and the biggest single jump: 66 of 200 -> 44 of 204 with no fine detail. ***

    gear   4/22 -> 24/26      back  3/11 -> 7/11      waist 2/5 -> 4/5
THE WEEK: 102 (8/22 morning) -> boots 84 -> gloves/belts/scarves/masks 66 -> gear/bags 44.
THE DENOMINATOR MOVED, 200 -> 204, AND THAT IS NOT ROUNDING: the metric only counts a
garment that draws a bounded colour run at all, and four pieces that drew nothing
measurable now do. Said plainly rather than folded into a nicer number.

A rivet is ONE pixel. At 56 a chest plate is three rows and a stud row would have been
half the plate. ONE PASS, NOT FOURTEEN EDITS: genGear's kinds each build their own output
and return it, so rivets go on AT THE RETURN (15 sites), and a new kind gets them free
instead of being forgotten. genBag the same on 5. Only on runs >=3 cells tall so a strap
does not become a dotted line. A rivet RECOLOURS a pixel the plate already owned --
nothing moved, nothing thinned. S>1 only; 1,744 pinned 56 hashes hold.

*** THE PICTURE LIED AGAIN, DIFFERENTLY. *** Two rows showed a body wearing NOTHING,
before and after, looking exactly like a real comparison where the change did nothing.
The garment names were wrong -- I wrote 'SCRAP CHESTPLATE', the canon name is 'SCRAP CHEST
PLATE'. A name not in the catalogue draws nothing, and nothing beside nothing is a very
convincing null result. SECOND lying picture in two days (yesterday's had both columns
identical because genAcc never read the flag). SAME ROOT: A TOOL THAT CANNOT DISTINGUISH
"NO CHANGE" FROM "NOTHING RAN" WILL ALWAYS REPORT THE COMFORTABLE ONE. It prints NOT IN
THE CATALOGUE in red now. Both were caught only by LOOKING AT THE PICTURE.

GATES: clothes_4x 13/0, STEP 5 ratchet 40 -> 27 (downward only). All character gates green.
Record: records/BOHEMIA_THE_HARDWARE_8_24_26.txt
LOOK tab: "THE HARDWARE", before beside after, same generators.

NEXT IN THIS LANE
  - STEP 5, WHAT IS LEFT (run the audit, it names the worst per layer):
        base 50/68   outer 20/31   legs 21/24   face 5/8 (3 bandanas, different path)
        head 0/2     gear 24/26    back 7/11    waist 4/5
    base and outer are the big two now: shirts want a placket/cuff stitch, coats a lapel
    seam. head is only 2 garments and is the cheapest remaining zero.
  - BEFORE ADDING, GREP THE GENERATOR FOR A RULED WIDTH. genShoes' heel seam has his own
    words next to it. ADD marks, never shrink his.
  - BEFORE SHIPPING A BEFORE/AFTER, CHECK THE GARMENT NAME EXISTS AND THE FLAG IS READ BY
    THAT GENERATOR. Both failure modes have now cost a turn each.
  - the-spawn-sidewalk STILL has no shooter (reported 8/23). WORLD lane, one manifest line.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, fine since. Still unexplained.

---

CHARACTER (character-0lurbs): 8/23 (a) -- *** THE SMALL THINGS. Row 2X step 5,
third pass: four more garment types get a mark they never had. 84 of 200 -> 66 of 200. ***

    gloves   knuckle seam    hands 0/4 -> 4/4      scarves  woven weft   neck 0/7 -> 7/7
    belts    edge stitching  waist 0/5 -> 2/5      masks    hem stitch   face 0/8 -> 5/8
(tool belts are genGear's, not genAcc's, which is why waist stops at 2/5.)

*** THE RULE THAT MATTERS MORE THAN THE MARKS: ADD, NEVER SHRINK. *** Nothing he ruled on
got thinner. genShoes' heel seam is S wide with HIS OWN reason written above it; the
belt's buckle, the glove's edge, the scarf ring's split and the mask's top band all keep
their widths. The temptation on every one of these was to thin the existing line, and that
would have quietly overwritten a ruling. CHECK FOR A RECORDED WIDTH BEFORE TOUCHING ONE.

MEASURE THE BODY, DO NOT GUESS IT: the knuckle seam went in at mn+2*S and DREW NOTHING.
The hand is six rows tall at 112, so that is the fifth of six and the generator's own edge
test (which reaches two pixels) correctly called it an edge. Probed the real part grid,
moved it to mn+S, landed. A row index guessed from the shape of the CODE rather than the
shape of the BODY is a coin flip.

AND THE PICTURE LIED ONCE FIRST: the before/after came out with both columns IDENTICAL,
because CLO_NOSTITCH gated the boot stitch and genAcc had never been taught to read it.
A BEFORE/AFTER WHERE NOTHING DIFFERS IS NOT A NULL RESULT, IT IS A BROKEN TOOL. Only
looking at the picture catches that.

GATES: clothes_4x 13/0, STEP 5 ratchet moved 44 -> 40 (downward only, so nobody deletes
detail to go green and step 5 cannot stall). 1,744 pinned 56 hashes unmoved -- every mark
is S>1 only. ACCESSORIES 13/0.
Record: records/BOHEMIA_THE_SMALL_THINGS_8_23_26.txt
LOOK tab: "THE SMALL THINGS", before beside after, same generators.

*** ONE RED I DID NOT FIX AND IT IS NOT THIS LANE'S. *** LOOK is 23/1 on ONE stale
picture: the-spawn-sidewalk. It photographs the CITY WORLD, belongs to WORLD, and RECORDS
NO SHOOTER -- no tool in the repo references it, so nobody can retake it. VERIFIED
PRE-EXISTING: stash everything I did, run the gate on clean main, same 23/1, same picture.
I retook the other 28 that went stale (every one that records how it was taken).
THE FIX IS ONE LINE IN THE MANIFEST AND IT IS WORLD'S: give it a shooter. Same hole I
closed for the twelve city shots on 8/20, in a picture added since.

NEXT IN THIS LANE
  - STEP 5 CONTINUES. The audit names what is left: gear 4/22, back 3/11, outer 20/31,
    base 50/68, head 0/2, and 3 bandanas in face that take a different code path from the
    masks. Gear and bags are the big ones. Run the audit first; it names the worst per layer.
  - BEFORE ADDING, CHECK FOR A RULED WIDTH. Grep the generator for his name or a quote.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, passed repeatedly since. Still unexplained.
  - THE CONTAINER USUALLY COMES UP ON A STALE TREE with old files staged that look like
    unfinished work. DIFF AGAINST origin/main BEFORE BELIEVING IT. (Clean this session.)

---

CHARACTER (character-0lurbs): 8/22 (a) -- *** FOUR TIMES THE PIXELS WAS BUYING A
BIGGER BOOT, NOT A FINER ONE. Row 2X step 5, second item. Plus two of my own gates that
were lying, one of them vacuously. ***

MEASURED EVERY CANON GARMENT (tools/bohemia_seam_width_audit.js, real posed body): the
thinnest colour run with a different colour on BOTH sides -- what a seam or stitch line
looks like in the output.
    feet 0/18   face 0/8   hands 0/4   neck 0/7   waist 0/5   head 0/2
    gear 4/22   back 3/11  outer 20/31  legs 21/24  base 50/68
    *** 102 OF 200 CANON GARMENTS HAD NO ONE-PIXEL DETAIL ANYWHERE. ***
A mark drawn one CELL wide is TWO pixels at 112, so a garment that only scales comes out
chunkier relative to the body. That is the whole of step 5 in one number.

I DID NOT THIN THE EXISTING MARKS, AND THAT WAS THE IMPORTANT CALL. genShoes' heel seam
is S wide with HIS OWN REASON recorded above it ("holding it at a literal 1 on a 112 rig
would halve the seam he approved"). Same for the lace ladder and midsole. What shipped is
a mark that DID NOT EXIST: the welt stitch where the upper meets the sole, 1px, dotted on
odd columns, skipped on the outermost column so it never thickens the derived outline.
S>1 only, so the 56 wardrobe is byte-identical and its 1,744 hashes do not move.
    feet 0/18 -> 18/18.   total 102/200 -> 84/200.

*** MY OWN GATE CAUGHT ME PUTTING A BUG IN THE SHIPPING FILE. *** First cut read the flag
as `window.CLO_NOSTITCH`; clothes_4x builds generators with new Function and NO DOM, so it
went red instantly: "genShoes THREW window is not defined". A bare window. inside a
generator throws anywhere there is no window, and headless is where the gates live. Read
through typeof now, like genHair reads CLO_NOSUB. THE GATE THAT LOOKS FROM A DIFFERENT
ANGLE IS THE ONE THAT EARNS ITS KEEP -- the game has a window, so playing it would never
have shown this.

*** AND YESTERDAY'S one_garment_per_slot HAD TWO UNPROVEN CLAIMS AND ONE VACUOUS ONE. ***
It walked G.equipped, and HAT AND GLASSES ARE EMPTY in his default equip, so both were
skipped IN SILENCE -- claims sitting inside a green gate. Equipped on purpose: durag
1,488 px bare / 0 worn, shades 216 / 0. Then a new "every slot must have had something to
hide" check caught a third: SHIRT showed 0 even bare, because PD.meta.order draws shirt
BEFORE jacket and his painted fuzz jacket covers his cowl-hoodie completely -- the shirt
test was measuring an empty stage. Each slot is isolated from the layers drawn after it
now. THE MUTATION TELLS IT: remove the suppression and yesterday's gate named FOUR slots,
today's names SEVEN (hair:261 hat:313 shirt:92 jacket:18 pants:72 shoes:61 glasses:192).
597 of those pixels were invisible to the audit I shipped yesterday and called complete.

GATES: clothes_4x 13/0 with a new STEP 5 ONLY GOES FORWARD ratchet (shapes with no 1px
detail, pinned 44 on the fixture, downward only; mutation fires at 46). It is NOT a demand
that every garment carry fine detail -- a belt is a band -- it is a promise the count never
rises so step 5 cannot quietly stall. one_garment_per_slot 11/0.
Record: records/BOHEMIA_FOUR_TIMES_THE_PIXELS_BOUGHT_A_BIGGER_BOOT_8_22_26.txt
LOOK tab: "THE BOOTS GOT STITCHING", before beside after, same generator (CLO_NOSTITCH).

NEXT IN THIS LANE
  - STEP 5 CONTINUES and the audit says exactly where: face 0/8, hands 0/4, neck 0/7,
    waist 0/5, head 0/2, gear 4/22. Gloves want knuckle seams, belts a buckle tongue,
    scarves a fringe. Run the audit first; it names the worst offender per layer.
  - BEFORE ADDING ANYTHING, CHECK WHETHER A WIDTH WAS RULED ON. The heel seam nearly got
    thinned by me on the way past. ADD marks, do not shrink his.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, passed 4x alone since. Still unexplained.
  - THE CONTAINER COMES UP ON AN 8/14 TREE EVERY SESSION with 8/12-era files staged that
    look like unfinished work. They are not. DIFF AGAINST origin/main BEFORE BELIEVING IT.

---

CHARACTER (character-0lurbs): 8/21 (c) -- *** IT WAS NEVER JUST THE HAIR.
Yesterday's hair fix was a SLOT fix wearing a hair fix's clothes, and three more of his
painted layers were leaking the same way in the build he is playing. ***

THE MECHANISM WAS NEVER HAIR-SPECIFIC: a generator spans the PART GRID, his paint reaches
past it, so any painted layer whose slot gets a generated garment peeks out along the
edges. Audited all nine on the real worn path, all 8 facings (tools/bohemia_pd_leak_audit.js):
    pants/leather-legwarmer   68 px through BLUE JEANS
    shoes/balenciaga          61 px through WHITE SNEAKERS
    jacket/japanese-fuzz      18 px through WASTELAND DUSTER
    shirt 0,  hair 0 (fixed yesterday)
Fixing hair and stopping would have left these forever: the visible symptom was on the
head, and the head was fixed.

THE FIX IS NOW GENERAL, no special case: if a generated garment of a slot is worn, the
painted layer of that slot is not drawn.
    hair->hair  hat->head  shirt->base  jacket->outer  pants->legs  shoes->feet  glasses->face
body and facial are ABSENT FROM THAT MAP ON PURPOSE and the gate fails if either is added.

BOTH RISKS MEASURED, NOT ASSUMED:
  HIS DEFAULT LOOK -- G_WORN is null until something dresses him. 32 frames (8 facings x
  2 clips x 2 phases) rendered off origin/main and off this build: BYTE-IDENTICAL.
  HIS FACE -- dressed head to toe, his painted face is still on the frame. Asserted two
  independent ways (the source map must not contain 'facial'; the pixels must survive).
RIG LAW UNTOUCHED: nothing edited, one layer not DRAWN while its slot is filled, back the
moment it is empty.

*** A MISTAKE IN MY OWN TOOL, AND THE LESSON IS THE POINT. *** The audit's first run
reported "no generated counterpart" for all six layers and looked like a clean bill of
health. It was a TYPO IN A LOOKUP TABLE -- I assumed the PD slots were named base/legs/
feet/outer like the wardrobe's layers; they are shirt/pants/shoes/jacket. Every pairing
missed, and a missed pairing PRINTED AS REASSURANCE. A LOOKUP THAT MISSES SILENTLY IS THE
SAME BUG AS A GATE THAT PASSES VACUOUSLY. The only reason I caught it is that a clean
result was the answer I wanted, which is exactly when to look twice. Slot names are read
from PD.meta.order now.

GATE: gates/one_garment_per_slot_gate.js 9/0, registered as ONE PER SLOT. Three mutations
all caught and all naming the culprit (remove suppression -> each slot named with its
count; add 'facial' -> "0 painted face pixels"; fire with nothing worn -> "BARE ON NE,N,NW").
Record: records/BOHEMIA_IT_WAS_NEVER_JUST_THE_HAIR_8_21_26.txt
LOOK tab: "IT WAS NEVER JUST THE HAIR", before beside after from the SAME code (CLO_KEEP_PD).
The caption says plainly these are MUCH subtler than the hair blob -- 147 px at hips and
boot edges. Overselling a small fix after a big one is how the next real finding stops
being believed.

NEXT IN THIS LANE
  - STEP 5 of row 2X continues: seams, hems, laces, buckles and stitch lines still step
    by a whole cell at 112. Measure which actually read coarse before assuming.
  - hat/durag and glasses/shades were NOT exercised by the audit (both slots empty in his
    default equip), so their pairing is asserted but unproven. Equip one and re-run.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21 then passed 4x alone. Still unexplained.

---

CHARACTER (character-0lurbs): 8/21 (b) -- *** TWO HAIRSTYLES ON ONE HEAD.
He said "Continue fixing east and west hair pls". Two defects, both PROFILE ONLY. ***

Facing S is byte-identical before and after everything below, which is why three weeks
of front views never caught either one.

1. HIS PAINTED BOB WAS DRAWING UNDER EVERY HAIRSTYLE. hair/curtain-bob is a PD layer;
   a generated hairstyle stamps after it, so front-on it was simply covered. In profile
   it is not: genHair spans the PART GRID and his paint reaches two cells past it each
   side at the crown (facing E row 10: part ids x52-59, his paint x50-61). His bob's
   ramp holds exactly [27,26,32] and [237,232,220], so the near-white one stuck out over
   the forehead. 1,349 leaked pixels over 15 styles x 3 facings; 3,677 over all 8.
   THE FIX IS NOT MORE HAIR -- widening the span patches the symptom and leaves two
   hairstyles stacked on one head. The PD hair layer is not DRAWN while a hair garment
   is worn. RIG LAW untouched: his bob is not edited and returns the moment one is not.
2. THE FADE STOPPED HALFWAY IN PROFILE. fadeBot was a HAND COPY of sideBot made before
   the 8/2 profile fix and never updated with it, so the taper ended mid-mass. Tinted
   pixels sat at mean height 0.74 of the hair instead of 0.91, twice as many, smeared
   into the crown. It IS sideBot now -- one expression, cannot drift.

I GUESSED THE FADE FIRST AND I WAS WRONG. Fixed it, blob still there. Then measured:
zero hair pixels above luminance 120 on a ramp topping out at 50, so the bright pixels
were never hair. Pulling PD layers one at a time named the bob in one pass. The fade fix
stayed only because I then measured it ON ITS OWN -- a change that survives because it
was made on the way to something else is not verified, it is just present.

AND THE FIRST PICTURE COULD NOT HAVE SHOWN IT: the tool stamped generators onto
buildFrame's output by hand, which matches the render order but SKIPS THE PD LAYER LOGIC
ENTIRELY. It drives G_WORN now. VERIFY ON THE REAL SURFACE means the real path, not a
composite that resembles it.

GATES: hair_gate 27/0. His bob never shows under a worn hairstyle (15 styles x 8 facings,
counted by his own ramp colours on the worn path, pinned at 0; mutation fires at 3,677).
The fade bottom IS the hair bottom, asserted in SOURCE because the bug was two diverging
copies of one expression. Record:
records/BOHEMIA_TWO_HAIRSTYLES_ON_ONE_HEAD_8_21_26.txt
LOOK tab: "THE WHITE BLOB IN PROFILE", before beside after, both from the SAME code.

ONE HONEST LOOSE END: CROWD went 15/1 once inside a twenty-gate loop, then passed four
times running on its own. That is a FLAKE UNDER LOAD, not a pass. Recorded rather than
called green. Not in the hair path; nothing here touches the crowd.

THE CONTAINER CAME UP ON AN 8/14 TREE AGAIN, second session running, with 8/12-era files
staged that look exactly like unfinished work. They are not: all five were strictly older
copies of things already on main. DIFF AGAINST origin/main BEFORE BELIEVING A DIRTY TREE.

NEXT IN THIS LANE
  - STEP 5 continues: seams, hems, laces, buckles and stitch lines all still step by a
    whole cell. Measure which actually read coarse at 112 before assuming.
  - The same PART-GRID-vs-PAINT gap that hid his bob may affect OTHER PD layers in
    profile (hat/durag, facial/punk-face). Worth one measurement pass.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.

---

CHARACTER (character-0lurbs): 8/21 (a) -- *** THE HAIR STOPPED BEING STRAIGHT.
Row 2X STEP 5 has started: the first content that actually uses the new pixels. ***

HIS CLAUSE 3 (8/1, LOCKED): "hair is about just the little off shapes that it makes ...
I'm seeing you make like a lot of straight lines and that's not realistic at all."

The wobble built that day works and is still correct. But it hashes the CELL row and its
only amplitude is S, so the moment the rig went to 112 it became a TWO PIXEL step on a
cell-sized grid -- the same silhouette as 56, drawn bigger. FOUR TIMES THE PIXELS BOUGHT
A SHARPER HAIR EDGE, NOT A FINER ONE.

NOTHING NOTICED, AND THAT IS THE REUSABLE PART: craft_law_gate asserts clause 3 by
FINDING THE WOBBLE IN THE SOURCE. It was there, hashed, deterministic, exactly as
written. A SOURCE CHECK CANNOT TELL YOU THE EDGE IT PRODUCES IS DEAD STRAIGHT.

MEASURED (tools/bohemia_hair_straightness.js), before -> after:
    rows in a straight run of 4+     50.7%  ->  18.5%
    longest straight edge            16     ->  6
The cell step is UNTOUCHED (the coarse shape is the one he approved); where it says stay
put, the individual PIXEL row may move by ONE. Cannot become static: it only fires where
the coarse step did NOT, so total travel is unchanged, and at S===1 it never fires, which
is why all 1,744 pinned 56 hashes are byte-identical.
Tried 1-in-4 as well: 28.0% and 12 -- worse on BOTH axes, no trade-off to tune.

*** THE GATE HAD TO BE WIDENED AND I COULD NOT MAKE THE WIDENING SELF-CHECKING. ***
clothes_4x claim 1 ("112 output IS 56 scaled") forbids the entire point of the flip once
any authored detail exists. A GATE MUST NEVER OUTRANK A RULING, so a generator may carry
@SUBCELL-DETAIL and gets ONE pixel / 12% coverage of slack, nothing else does. I tried
twice to make the machine verify the marker and FAILED TWICE -- recorded so nobody
rebuilds it: (1) comparing 112 to doubled-56 is useless, native drawing differs anyway;
(2) counting split cells does NOT separate them -- genHair scores 4 while genCoat scores
13 and genGear 17 with no sub-cell authoring at all. A third attempt would have been the
fourth version of an unasked-for thing. THE RISK IS BOUNDED AND MEASURED: mutation-tested
with the wide bound in force, the backpack hardcode still fires at 31%. A false marker
can excuse a small honest difference; it cannot hide a mis-scaling bug.

CLAUSE 3 NOW HAS A PIXEL GATE: hair_gate ratchets PINNED_STRAIGHT 0.185 / PINNED_LONGEST
6, both downward-only. Mutation: disable the sub-step and it fires reporting 50.7% and 16.
Record: records/BOHEMIA_THE_HAIR_STOPPED_BEING_STRAIGHT_8_21_26.txt
LOOK tab: "THE HAIR STOPPED BEING STRAIGHT" -- old edge beside new, SAME generator
(CLO_NOSUB switches the sub-step off for the tool), so the only difference on screen is
the thing being judged.

ALSO, AND IT COST THE FIRST HALF OF THE SESSION: THE CONTAINER CAME UP ON AN 8/14 TREE
with 8/12-era files staged, which looks exactly like unfinished mid-flight work. It was
not -- origin/main was 8/21 and already contained every one of those files, in NEWER
form. Checked all five against main before resetting; every local copy was strictly
older. IF A CONTAINER LOOKS LIKE IT HAS UNCOMMITTED WORK, DIFF IT AGAINST origin/main
BEFORE BELIEVING IT.

CORRECTED A STALE NOTE OF MY OWN: my last handoff sent the next session to build "the
fade-blends-into-skin-tone item marked [UNBUILT]". IT IS BUILT -- 8/1, amended 8/2
(skull-only). The [UNBUILT] tag lives in the 8/14 TWICE THE PIXELS addendum and is stale
there too.

NEXT IN THIS LANE
  - STEP 5 CONTINUES and hair is only the first of it. The same "sharper not finer"
    audit is owed on every other generator: seams, hems, laces, buckles and stitch lines
    all still step by a whole cell. genCoat and genGear already split cells natively, so
    start by measuring which ones actually read coarse at 112 rather than assuming.
  - CANVAS MEMORY still red, still NOT this lane's: 104 full-resolution images decode to
    850 MB. It needs smaller DIMENSIONS, not quantizing.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (f) -- *** I PUBLISHED A BUG THAT DOES NOT
EXIST AND THEN WENT TO FIX IT. THERE IS NO JAW DEBT. ***

This morning I wrote, in a commit and a record and this file: "the skinner was always
drawing the chin two cells too wide, Scale2x was hiding it." IT IS NOT TRUE.

HEAD FOLLOWS RIG compares the rig's painted FACE (part 2) against EVERY SKIN-COLOURED
PIXEL on the row. The row also carries the HEAD (part 1, wider than the face
everywhere but the cheekbones) and, on the chin rows, the NECK. All three are skin.
Measured row by row on the real frame:
    y12-y29   drawn skin == posed HEAD+FACE        to the pixel
    y30-y31   drawn skin == posed HEAD+FACE+NECK   to the pixel
    UNEXPLAINED PIXELS: ZERO
Every deviation it has ever reported is the head being wider than the face. Anatomy.

*** A RULER COMPARING TWO DIFFERENT REGIONS CANNOT BE REPAIRED BY RESCALING IT. ***
My first pass DID improve that gate -- turned a pixel count into a resolution-free
ratio, wrote out the reasoning, mutation-tested both directions. A well-built
instrument pointed at the wrong thing, and every good habit made the wrong answer
more convincing. The tell I walked past: every deviating row was off by EXACTLY 4 and
every zero row stayed exactly zero. A real defect is not constant across a face; a
region mismatch is, because it is one region minus another.

IT ASSERTS LIKE-FOR-LIKE NOW, and it is exact: the POSED head+face silhouette, row
for row, IS the rig's -- same regions, same space, read off PART IDS, on ALL EIGHT
FACINGS instead of one.  S:0 SE:0 E:0 NE:0 N:0 NW:0 W:0 SW:0, total 0, PINNED AT ZERO
and unloosenable. Mutation: widen the posed head one cell on S and it fires naming
the facing. Sampled at the REST phase on purpose -- at ph=0.37 deviation is 12-44,
which is the animation working, not a bug.
DO NOT GO HUNTING A CHIN BUG. Correction:
records/BOHEMIA_THERE_IS_NO_JAW_DEBT_AND_THERE_NEVER_WAS_8_20_26.txt

THAT IS FIVE WRONG RULERS IN THREE DAYS (reuse-first read a docstring as code; dress
counted a sentence as a garment; pages summed a surface we stopped publishing;
border measured a diagonal along a raster row; head compared a face to a head). THE
COMMON FORM: checker and checked are in different units, regions or files, and
nothing notices because the number still looks like a number. WHEN A RATCHET MOVES,
ASK WHAT IT COMPARES BEFORE YOU ASK WHAT BROKE.

ALSO SHIPPED
  wear() hashed the RAW PIXEL INDEX, so at 112 each sub-pixel got its own coin flip
  and a salvaged coat read as television static. Hashes the CELL now; proved
  identical at 56 by measurement (4,184 pixels, 4 scuff amounts, 0 different). Last
  per-pixel hash in the wardrobe path.

  THE LOOK TAB WAS RED ON MAIN AND NOBODY COULD CLEAR IT: twelve city pictures went
  stale when the WORLD lane edited the city, and none recorded a `shooter`, so the
  gate could only say "NO SHOOTER RECORDED". All seventeen shots that tool takes now
  name it and the twelve were retaken. Seven CHARACTER pictures were genuinely stale
  (the character is 4x since this morning) and were retaken too. 24/0, 27 pictures.

NEXT IN THIS LANE
  - STEP (5) of row 2X is open and is the headline now: real authored detail per
    garment and hairstyle at 112, plus the fade-blends-into-skin-tone item his
    hair-and-shape law marks [UNBUILT]. Normal cooks, his normal thumbs.
  - CANVAS MEMORY is still red and still NOT this lane's: 104 full-resolution images
    decode to 850 MB (VOTE 69 / 633 MB, ART 27 / 209 MB), byte-identical before and
    after the flip. Quantizing cannot help -- decoded cost is w*h*4 whatever the file
    weighs. It needs smaller DIMENSIONS.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/22 (a) -- *** FOUR TIMES THE PIXELS WAS BUYING A
BIGGER BOOT, NOT A FINER ONE. Row 2X step 5, second item. Plus two of my own gates that
were lying, one of them vacuously. ***

MEASURED EVERY CANON GARMENT (tools/bohemia_seam_width_audit.js, real posed body): the
thinnest colour run with a different colour on BOTH sides -- what a seam or stitch line
looks like in the output.
    feet 0/18   face 0/8   hands 0/4   neck 0/7   waist 0/5   head 0/2
    gear 4/22   back 3/11  outer 20/31  legs 21/24  base 50/68
    *** 102 OF 200 CANON GARMENTS HAD NO ONE-PIXEL DETAIL ANYWHERE. ***
A mark drawn one CELL wide is TWO pixels at 112, so a garment that only scales comes out
chunkier relative to the body. That is the whole of step 5 in one number.

I DID NOT THIN THE EXISTING MARKS, AND THAT WAS THE IMPORTANT CALL. genShoes' heel seam
is S wide with HIS OWN REASON recorded above it ("holding it at a literal 1 on a 112 rig
would halve the seam he approved"). Same for the lace ladder and midsole. What shipped is
a mark that DID NOT EXIST: the welt stitch where the upper meets the sole, 1px, dotted on
odd columns, skipped on the outermost column so it never thickens the derived outline.
S>1 only, so the 56 wardrobe is byte-identical and its 1,744 hashes do not move.
    feet 0/18 -> 18/18.   total 102/200 -> 84/200.

*** MY OWN GATE CAUGHT ME PUTTING A BUG IN THE SHIPPING FILE. *** First cut read the flag
as `window.CLO_NOSTITCH`; clothes_4x builds generators with new Function and NO DOM, so it
went red instantly: "genShoes THREW window is not defined". A bare window. inside a
generator throws anywhere there is no window, and headless is where the gates live. Read
through typeof now, like genHair reads CLO_NOSUB. THE GATE THAT LOOKS FROM A DIFFERENT
ANGLE IS THE ONE THAT EARNS ITS KEEP -- the game has a window, so playing it would never
have shown this.

*** AND YESTERDAY'S one_garment_per_slot HAD TWO UNPROVEN CLAIMS AND ONE VACUOUS ONE. ***
It walked G.equipped, and HAT AND GLASSES ARE EMPTY in his default equip, so both were
skipped IN SILENCE -- claims sitting inside a green gate. Equipped on purpose: durag
1,488 px bare / 0 worn, shades 216 / 0. Then a new "every slot must have had something to
hide" check caught a third: SHIRT showed 0 even bare, because PD.meta.order draws shirt
BEFORE jacket and his painted fuzz jacket covers his cowl-hoodie completely -- the shirt
test was measuring an empty stage. Each slot is isolated from the layers drawn after it
now. THE MUTATION TELLS IT: remove the suppression and yesterday's gate named FOUR slots,
today's names SEVEN (hair:261 hat:313 shirt:92 jacket:18 pants:72 shoes:61 glasses:192).
597 of those pixels were invisible to the audit I shipped yesterday and called complete.

GATES: clothes_4x 13/0 with a new STEP 5 ONLY GOES FORWARD ratchet (shapes with no 1px
detail, pinned 44 on the fixture, downward only; mutation fires at 46). It is NOT a demand
that every garment carry fine detail -- a belt is a band -- it is a promise the count never
rises so step 5 cannot quietly stall. one_garment_per_slot 11/0.
Record: records/BOHEMIA_FOUR_TIMES_THE_PIXELS_BOUGHT_A_BIGGER_BOOT_8_22_26.txt
LOOK tab: "THE BOOTS GOT STITCHING", before beside after, same generator (CLO_NOSTITCH).

NEXT IN THIS LANE
  - STEP 5 CONTINUES and the audit says exactly where: face 0/8, hands 0/4, neck 0/7,
    waist 0/5, head 0/2, gear 4/22. Gloves want knuckle seams, belts a buckle tongue,
    scarves a fringe. Run the audit first; it names the worst offender per layer.
  - BEFORE ADDING ANYTHING, CHECK WHETHER A WIDTH WAS RULED ON. The heel seam nearly got
    thinned by me on the way past. ADD marks, do not shrink his.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, passed 4x alone since. Still unexplained.
  - THE CONTAINER COMES UP ON AN 8/14 TREE EVERY SESSION with 8/12-era files staged that
    look like unfinished work. They are not. DIFF AGAINST origin/main BEFORE BELIEVING IT.

---

CHARACTER (character-0lurbs): 8/21 (c) -- *** IT WAS NEVER JUST THE HAIR.
Yesterday's hair fix was a SLOT fix wearing a hair fix's clothes, and three more of his
painted layers were leaking the same way in the build he is playing. ***

THE MECHANISM WAS NEVER HAIR-SPECIFIC: a generator spans the PART GRID, his paint reaches
past it, so any painted layer whose slot gets a generated garment peeks out along the
edges. Audited all nine on the real worn path, all 8 facings (tools/bohemia_pd_leak_audit.js):
    pants/leather-legwarmer   68 px through BLUE JEANS
    shoes/balenciaga          61 px through WHITE SNEAKERS
    jacket/japanese-fuzz      18 px through WASTELAND DUSTER
    shirt 0,  hair 0 (fixed yesterday)
Fixing hair and stopping would have left these forever: the visible symptom was on the
head, and the head was fixed.

THE FIX IS NOW GENERAL, no special case: if a generated garment of a slot is worn, the
painted layer of that slot is not drawn.
    hair->hair  hat->head  shirt->base  jacket->outer  pants->legs  shoes->feet  glasses->face
body and facial are ABSENT FROM THAT MAP ON PURPOSE and the gate fails if either is added.

BOTH RISKS MEASURED, NOT ASSUMED:
  HIS DEFAULT LOOK -- G_WORN is null until something dresses him. 32 frames (8 facings x
  2 clips x 2 phases) rendered off origin/main and off this build: BYTE-IDENTICAL.
  HIS FACE -- dressed head to toe, his painted face is still on the frame. Asserted two
  independent ways (the source map must not contain 'facial'; the pixels must survive).
RIG LAW UNTOUCHED: nothing edited, one layer not DRAWN while its slot is filled, back the
moment it is empty.

*** A MISTAKE IN MY OWN TOOL, AND THE LESSON IS THE POINT. *** The audit's first run
reported "no generated counterpart" for all six layers and looked like a clean bill of
health. It was a TYPO IN A LOOKUP TABLE -- I assumed the PD slots were named base/legs/
feet/outer like the wardrobe's layers; they are shirt/pants/shoes/jacket. Every pairing
missed, and a missed pairing PRINTED AS REASSURANCE. A LOOKUP THAT MISSES SILENTLY IS THE
SAME BUG AS A GATE THAT PASSES VACUOUSLY. The only reason I caught it is that a clean
result was the answer I wanted, which is exactly when to look twice. Slot names are read
from PD.meta.order now.

GATE: gates/one_garment_per_slot_gate.js 9/0, registered as ONE PER SLOT. Three mutations
all caught and all naming the culprit (remove suppression -> each slot named with its
count; add 'facial' -> "0 painted face pixels"; fire with nothing worn -> "BARE ON NE,N,NW").
Record: records/BOHEMIA_IT_WAS_NEVER_JUST_THE_HAIR_8_21_26.txt
LOOK tab: "IT WAS NEVER JUST THE HAIR", before beside after from the SAME code (CLO_KEEP_PD).
The caption says plainly these are MUCH subtler than the hair blob -- 147 px at hips and
boot edges. Overselling a small fix after a big one is how the next real finding stops
being believed.

NEXT IN THIS LANE
  - STEP 5 of row 2X continues: seams, hems, laces, buckles and stitch lines still step
    by a whole cell at 112. Measure which actually read coarse before assuming.
  - hat/durag and glasses/shades were NOT exercised by the audit (both slots empty in his
    default equip), so their pairing is asserted but unproven. Equip one and re-run.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21 then passed 4x alone. Still unexplained.

---

CHARACTER (character-0lurbs): 8/21 (b) -- *** TWO HAIRSTYLES ON ONE HEAD.
He said "Continue fixing east and west hair pls". Two defects, both PROFILE ONLY. ***

Facing S is byte-identical before and after everything below, which is why three weeks
of front views never caught either one.

1. HIS PAINTED BOB WAS DRAWING UNDER EVERY HAIRSTYLE. hair/curtain-bob is a PD layer;
   a generated hairstyle stamps after it, so front-on it was simply covered. In profile
   it is not: genHair spans the PART GRID and his paint reaches two cells past it each
   side at the crown (facing E row 10: part ids x52-59, his paint x50-61). His bob's
   ramp holds exactly [27,26,32] and [237,232,220], so the near-white one stuck out over
   the forehead. 1,349 leaked pixels over 15 styles x 3 facings; 3,677 over all 8.
   THE FIX IS NOT MORE HAIR -- widening the span patches the symptom and leaves two
   hairstyles stacked on one head. The PD hair layer is not DRAWN while a hair garment
   is worn. RIG LAW untouched: his bob is not edited and returns the moment one is not.
2. THE FADE STOPPED HALFWAY IN PROFILE. fadeBot was a HAND COPY of sideBot made before
   the 8/2 profile fix and never updated with it, so the taper ended mid-mass. Tinted
   pixels sat at mean height 0.74 of the hair instead of 0.91, twice as many, smeared
   into the crown. It IS sideBot now -- one expression, cannot drift.

I GUESSED THE FADE FIRST AND I WAS WRONG. Fixed it, blob still there. Then measured:
zero hair pixels above luminance 120 on a ramp topping out at 50, so the bright pixels
were never hair. Pulling PD layers one at a time named the bob in one pass. The fade fix
stayed only because I then measured it ON ITS OWN -- a change that survives because it
was made on the way to something else is not verified, it is just present.

AND THE FIRST PICTURE COULD NOT HAVE SHOWN IT: the tool stamped generators onto
buildFrame's output by hand, which matches the render order but SKIPS THE PD LAYER LOGIC
ENTIRELY. It drives G_WORN now. VERIFY ON THE REAL SURFACE means the real path, not a
composite that resembles it.

GATES: hair_gate 27/0. His bob never shows under a worn hairstyle (15 styles x 8 facings,
counted by his own ramp colours on the worn path, pinned at 0; mutation fires at 3,677).
The fade bottom IS the hair bottom, asserted in SOURCE because the bug was two diverging
copies of one expression. Record:
records/BOHEMIA_TWO_HAIRSTYLES_ON_ONE_HEAD_8_21_26.txt
LOOK tab: "THE WHITE BLOB IN PROFILE", before beside after, both from the SAME code.

ONE HONEST LOOSE END: CROWD went 15/1 once inside a twenty-gate loop, then passed four
times running on its own. That is a FLAKE UNDER LOAD, not a pass. Recorded rather than
called green. Not in the hair path; nothing here touches the crowd.

THE CONTAINER CAME UP ON AN 8/14 TREE AGAIN, second session running, with 8/12-era files
staged that look exactly like unfinished work. They are not: all five were strictly older
copies of things already on main. DIFF AGAINST origin/main BEFORE BELIEVING A DIRTY TREE.

NEXT IN THIS LANE
  - STEP 5 continues: seams, hems, laces, buckles and stitch lines all still step by a
    whole cell. Measure which actually read coarse at 112 before assuming.
  - The same PART-GRID-vs-PAINT gap that hid his bob may affect OTHER PD layers in
    profile (hat/durag, facial/punk-face). Worth one measurement pass.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.

---

CHARACTER (character-0lurbs): 8/21 (a) -- *** THE HAIR STOPPED BEING STRAIGHT.
Row 2X STEP 5 has started: the first content that actually uses the new pixels. ***

HIS CLAUSE 3 (8/1, LOCKED): "hair is about just the little off shapes that it makes ...
I'm seeing you make like a lot of straight lines and that's not realistic at all."

The wobble built that day works and is still correct. But it hashes the CELL row and its
only amplitude is S, so the moment the rig went to 112 it became a TWO PIXEL step on a
cell-sized grid -- the same silhouette as 56, drawn bigger. FOUR TIMES THE PIXELS BOUGHT
A SHARPER HAIR EDGE, NOT A FINER ONE.

NOTHING NOTICED, AND THAT IS THE REUSABLE PART: craft_law_gate asserts clause 3 by
FINDING THE WOBBLE IN THE SOURCE. It was there, hashed, deterministic, exactly as
written. A SOURCE CHECK CANNOT TELL YOU THE EDGE IT PRODUCES IS DEAD STRAIGHT.

MEASURED (tools/bohemia_hair_straightness.js), before -> after:
    rows in a straight run of 4+     50.7%  ->  18.5%
    longest straight edge            16     ->  6
The cell step is UNTOUCHED (the coarse shape is the one he approved); where it says stay
put, the individual PIXEL row may move by ONE. Cannot become static: it only fires where
the coarse step did NOT, so total travel is unchanged, and at S===1 it never fires, which
is why all 1,744 pinned 56 hashes are byte-identical.
Tried 1-in-4 as well: 28.0% and 12 -- worse on BOTH axes, no trade-off to tune.

*** THE GATE HAD TO BE WIDENED AND I COULD NOT MAKE THE WIDENING SELF-CHECKING. ***
clothes_4x claim 1 ("112 output IS 56 scaled") forbids the entire point of the flip once
any authored detail exists. A GATE MUST NEVER OUTRANK A RULING, so a generator may carry
@SUBCELL-DETAIL and gets ONE pixel / 12% coverage of slack, nothing else does. I tried
twice to make the machine verify the marker and FAILED TWICE -- recorded so nobody
rebuilds it: (1) comparing 112 to doubled-56 is useless, native drawing differs anyway;
(2) counting split cells does NOT separate them -- genHair scores 4 while genCoat scores
13 and genGear 17 with no sub-cell authoring at all. A third attempt would have been the
fourth version of an unasked-for thing. THE RISK IS BOUNDED AND MEASURED: mutation-tested
with the wide bound in force, the backpack hardcode still fires at 31%. A false marker
can excuse a small honest difference; it cannot hide a mis-scaling bug.

CLAUSE 3 NOW HAS A PIXEL GATE: hair_gate ratchets PINNED_STRAIGHT 0.185 / PINNED_LONGEST
6, both downward-only. Mutation: disable the sub-step and it fires reporting 50.7% and 16.
Record: records/BOHEMIA_THE_HAIR_STOPPED_BEING_STRAIGHT_8_21_26.txt
LOOK tab: "THE HAIR STOPPED BEING STRAIGHT" -- old edge beside new, SAME generator
(CLO_NOSUB switches the sub-step off for the tool), so the only difference on screen is
the thing being judged.

ALSO, AND IT COST THE FIRST HALF OF THE SESSION: THE CONTAINER CAME UP ON AN 8/14 TREE
with 8/12-era files staged, which looks exactly like unfinished mid-flight work. It was
not -- origin/main was 8/21 and already contained every one of those files, in NEWER
form. Checked all five against main before resetting; every local copy was strictly
older. IF A CONTAINER LOOKS LIKE IT HAS UNCOMMITTED WORK, DIFF IT AGAINST origin/main
BEFORE BELIEVING IT.

CORRECTED A STALE NOTE OF MY OWN: my last handoff sent the next session to build "the
fade-blends-into-skin-tone item marked [UNBUILT]". IT IS BUILT -- 8/1, amended 8/2
(skull-only). The [UNBUILT] tag lives in the 8/14 TWICE THE PIXELS addendum and is stale
there too.

NEXT IN THIS LANE
  - STEP 5 CONTINUES and hair is only the first of it. The same "sharper not finer"
    audit is owed on every other generator: seams, hems, laces, buckles and stitch lines
    all still step by a whole cell. genCoat and genGear already split cells natively, so
    start by measuring which ones actually read coarse at 112 rather than assuming.
  - CANVAS MEMORY still red, still NOT this lane's: 104 full-resolution images decode to
    850 MB. It needs smaller DIMENSIONS, not quantizing.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (f) -- *** I PUBLISHED A BUG THAT DOES NOT
EXIST AND THEN WENT TO FIX IT. THERE IS NO JAW DEBT. ***

This morning I wrote, in a commit and a record and this file: "the skinner was always
drawing the chin two cells too wide, Scale2x was hiding it." IT IS NOT TRUE.

HEAD FOLLOWS RIG compares the rig's painted FACE (part 2) against EVERY SKIN-COLOURED
PIXEL on the row. The row also carries the HEAD (part 1, wider than the face
everywhere but the cheekbones) and, on the chin rows, the NECK. All three are skin.
Measured row by row on the real frame:
    y12-y29   drawn skin == posed HEAD+FACE        to the pixel
    y30-y31   drawn skin == posed HEAD+FACE+NECK   to the pixel
    UNEXPLAINED PIXELS: ZERO
Every deviation it has ever reported is the head being wider than the face. Anatomy.

*** A RULER COMPARING TWO DIFFERENT REGIONS CANNOT BE REPAIRED BY RESCALING IT. ***
My first pass DID improve that gate -- turned a pixel count into a resolution-free
ratio, wrote out the reasoning, mutation-tested both directions. A well-built
instrument pointed at the wrong thing, and every good habit made the wrong answer
more convincing. The tell I walked past: every deviating row was off by EXACTLY 4 and
every zero row stayed exactly zero. A real defect is not constant across a face; a
region mismatch is, because it is one region minus another.

IT ASSERTS LIKE-FOR-LIKE NOW, and it is exact: the POSED head+face silhouette, row
for row, IS the rig's -- same regions, same space, read off PART IDS, on ALL EIGHT
FACINGS instead of one.  S:0 SE:0 E:0 NE:0 N:0 NW:0 W:0 SW:0, total 0, PINNED AT ZERO
and unloosenable. Mutation: widen the posed head one cell on S and it fires naming
the facing. Sampled at the REST phase on purpose -- at ph=0.37 deviation is 12-44,
which is the animation working, not a bug.
DO NOT GO HUNTING A CHIN BUG. Correction:
records/BOHEMIA_THERE_IS_NO_JAW_DEBT_AND_THERE_NEVER_WAS_8_20_26.txt

THAT IS FIVE WRONG RULERS IN THREE DAYS (reuse-first read a docstring as code; dress
counted a sentence as a garment; pages summed a surface we stopped publishing;
border measured a diagonal along a raster row; head compared a face to a head). THE
COMMON FORM: checker and checked are in different units, regions or files, and
nothing notices because the number still looks like a number. WHEN A RATCHET MOVES,
ASK WHAT IT COMPARES BEFORE YOU ASK WHAT BROKE.

ALSO SHIPPED
  wear() hashed the RAW PIXEL INDEX, so at 112 each sub-pixel got its own coin flip
  and a salvaged coat read as television static. Hashes the CELL now; proved
  identical at 56 by measurement (4,184 pixels, 4 scuff amounts, 0 different). Last
  per-pixel hash in the wardrobe path.

  THE LOOK TAB WAS RED ON MAIN AND NOBODY COULD CLEAR IT: twelve city pictures went
  stale when the WORLD lane edited the city, and none recorded a `shooter`, so the
  gate could only say "NO SHOOTER RECORDED". All seventeen shots that tool takes now
  name it and the twelve were retaken. Seven CHARACTER pictures were genuinely stale
  (the character is 4x since this morning) and were retaken too. 24/0, 27 pictures.

NEXT IN THIS LANE
  - STEP (5) of row 2X is open and is the headline now: real authored detail per
    garment and hairstyle at 112, plus the fade-blends-into-skin-tone item his
    hair-and-shape law marks [UNBUILT]. Normal cooks, his normal thumbs.
  - CANVAS MEMORY is still red and still NOT this lane's: 104 full-resolution images
    decode to 850 MB (VOTE 69 / 633 MB, ART 27 / 209 MB), byte-identical before and
    after the flip. Quantizing cannot help -- decoded cost is w*h*4 whatever the file
    weighs. It needs smaller DIMENSIONS.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/22 (a) -- *** FOUR TIMES THE PIXELS WAS BUYING A
BIGGER BOOT, NOT A FINER ONE. Row 2X step 5, second item. Plus two of my own gates that
were lying, one of them vacuously. ***

MEASURED EVERY CANON GARMENT (tools/bohemia_seam_width_audit.js, real posed body): the
thinnest colour run with a different colour on BOTH sides -- what a seam or stitch line
looks like in the output.
    feet 0/18   face 0/8   hands 0/4   neck 0/7   waist 0/5   head 0/2
    gear 4/22   back 3/11  outer 20/31  legs 21/24  base 50/68
    *** 102 OF 200 CANON GARMENTS HAD NO ONE-PIXEL DETAIL ANYWHERE. ***
A mark drawn one CELL wide is TWO pixels at 112, so a garment that only scales comes out
chunkier relative to the body. That is the whole of step 5 in one number.

I DID NOT THIN THE EXISTING MARKS, AND THAT WAS THE IMPORTANT CALL. genShoes' heel seam
is S wide with HIS OWN REASON recorded above it ("holding it at a literal 1 on a 112 rig
would halve the seam he approved"). Same for the lace ladder and midsole. What shipped is
a mark that DID NOT EXIST: the welt stitch where the upper meets the sole, 1px, dotted on
odd columns, skipped on the outermost column so it never thickens the derived outline.
S>1 only, so the 56 wardrobe is byte-identical and its 1,744 hashes do not move.
    feet 0/18 -> 18/18.   total 102/200 -> 84/200.

*** MY OWN GATE CAUGHT ME PUTTING A BUG IN THE SHIPPING FILE. *** First cut read the flag
as `window.CLO_NOSTITCH`; clothes_4x builds generators with new Function and NO DOM, so it
went red instantly: "genShoes THREW window is not defined". A bare window. inside a
generator throws anywhere there is no window, and headless is where the gates live. Read
through typeof now, like genHair reads CLO_NOSUB. THE GATE THAT LOOKS FROM A DIFFERENT
ANGLE IS THE ONE THAT EARNS ITS KEEP -- the game has a window, so playing it would never
have shown this.

*** AND YESTERDAY'S one_garment_per_slot HAD TWO UNPROVEN CLAIMS AND ONE VACUOUS ONE. ***
It walked G.equipped, and HAT AND GLASSES ARE EMPTY in his default equip, so both were
skipped IN SILENCE -- claims sitting inside a green gate. Equipped on purpose: durag
1,488 px bare / 0 worn, shades 216 / 0. Then a new "every slot must have had something to
hide" check caught a third: SHIRT showed 0 even bare, because PD.meta.order draws shirt
BEFORE jacket and his painted fuzz jacket covers his cowl-hoodie completely -- the shirt
test was measuring an empty stage. Each slot is isolated from the layers drawn after it
now. THE MUTATION TELLS IT: remove the suppression and yesterday's gate named FOUR slots,
today's names SEVEN (hair:261 hat:313 shirt:92 jacket:18 pants:72 shoes:61 glasses:192).
597 of those pixels were invisible to the audit I shipped yesterday and called complete.

GATES: clothes_4x 13/0 with a new STEP 5 ONLY GOES FORWARD ratchet (shapes with no 1px
detail, pinned 44 on the fixture, downward only; mutation fires at 46). It is NOT a demand
that every garment carry fine detail -- a belt is a band -- it is a promise the count never
rises so step 5 cannot quietly stall. one_garment_per_slot 11/0.
Record: records/BOHEMIA_FOUR_TIMES_THE_PIXELS_BOUGHT_A_BIGGER_BOOT_8_22_26.txt
LOOK tab: "THE BOOTS GOT STITCHING", before beside after, same generator (CLO_NOSTITCH).

NEXT IN THIS LANE
  - STEP 5 CONTINUES and the audit says exactly where: face 0/8, hands 0/4, neck 0/7,
    waist 0/5, head 0/2, gear 4/22. Gloves want knuckle seams, belts a buckle tongue,
    scarves a fringe. Run the audit first; it names the worst offender per layer.
  - BEFORE ADDING ANYTHING, CHECK WHETHER A WIDTH WAS RULED ON. The heel seam nearly got
    thinned by me on the way past. ADD marks, do not shrink his.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21, passed 4x alone since. Still unexplained.
  - THE CONTAINER COMES UP ON AN 8/14 TREE EVERY SESSION with 8/12-era files staged that
    look like unfinished work. They are not. DIFF AGAINST origin/main BEFORE BELIEVING IT.

---

CHARACTER (character-0lurbs): 8/21 (c) -- *** IT WAS NEVER JUST THE HAIR.
Yesterday's hair fix was a SLOT fix wearing a hair fix's clothes, and three more of his
painted layers were leaking the same way in the build he is playing. ***

THE MECHANISM WAS NEVER HAIR-SPECIFIC: a generator spans the PART GRID, his paint reaches
past it, so any painted layer whose slot gets a generated garment peeks out along the
edges. Audited all nine on the real worn path, all 8 facings (tools/bohemia_pd_leak_audit.js):
    pants/leather-legwarmer   68 px through BLUE JEANS
    shoes/balenciaga          61 px through WHITE SNEAKERS
    jacket/japanese-fuzz      18 px through WASTELAND DUSTER
    shirt 0,  hair 0 (fixed yesterday)
Fixing hair and stopping would have left these forever: the visible symptom was on the
head, and the head was fixed.

THE FIX IS NOW GENERAL, no special case: if a generated garment of a slot is worn, the
painted layer of that slot is not drawn.
    hair->hair  hat->head  shirt->base  jacket->outer  pants->legs  shoes->feet  glasses->face
body and facial are ABSENT FROM THAT MAP ON PURPOSE and the gate fails if either is added.

BOTH RISKS MEASURED, NOT ASSUMED:
  HIS DEFAULT LOOK -- G_WORN is null until something dresses him. 32 frames (8 facings x
  2 clips x 2 phases) rendered off origin/main and off this build: BYTE-IDENTICAL.
  HIS FACE -- dressed head to toe, his painted face is still on the frame. Asserted two
  independent ways (the source map must not contain 'facial'; the pixels must survive).
RIG LAW UNTOUCHED: nothing edited, one layer not DRAWN while its slot is filled, back the
moment it is empty.

*** A MISTAKE IN MY OWN TOOL, AND THE LESSON IS THE POINT. *** The audit's first run
reported "no generated counterpart" for all six layers and looked like a clean bill of
health. It was a TYPO IN A LOOKUP TABLE -- I assumed the PD slots were named base/legs/
feet/outer like the wardrobe's layers; they are shirt/pants/shoes/jacket. Every pairing
missed, and a missed pairing PRINTED AS REASSURANCE. A LOOKUP THAT MISSES SILENTLY IS THE
SAME BUG AS A GATE THAT PASSES VACUOUSLY. The only reason I caught it is that a clean
result was the answer I wanted, which is exactly when to look twice. Slot names are read
from PD.meta.order now.

GATE: gates/one_garment_per_slot_gate.js 9/0, registered as ONE PER SLOT. Three mutations
all caught and all naming the culprit (remove suppression -> each slot named with its
count; add 'facial' -> "0 painted face pixels"; fire with nothing worn -> "BARE ON NE,N,NW").
Record: records/BOHEMIA_IT_WAS_NEVER_JUST_THE_HAIR_8_21_26.txt
LOOK tab: "IT WAS NEVER JUST THE HAIR", before beside after from the SAME code (CLO_KEEP_PD).
The caption says plainly these are MUCH subtler than the hair blob -- 147 px at hips and
boot edges. Overselling a small fix after a big one is how the next real finding stops
being believed.

NEXT IN THIS LANE
  - STEP 5 of row 2X continues: seams, hems, laces, buckles and stitch lines still step
    by a whole cell at 112. Measure which actually read coarse before assuming.
  - hat/durag and glasses/shades were NOT exercised by the audit (both slots empty in his
    default equip), so their pairing is asserted but unproven. Equip one and re-run.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.
  - CROWD flaked 15/1 once under load on 8/21 then passed 4x alone. Still unexplained.

---

CHARACTER (character-0lurbs): 8/21 (b) -- *** TWO HAIRSTYLES ON ONE HEAD.
He said "Continue fixing east and west hair pls". Two defects, both PROFILE ONLY. ***

Facing S is byte-identical before and after everything below, which is why three weeks
of front views never caught either one.

1. HIS PAINTED BOB WAS DRAWING UNDER EVERY HAIRSTYLE. hair/curtain-bob is a PD layer;
   a generated hairstyle stamps after it, so front-on it was simply covered. In profile
   it is not: genHair spans the PART GRID and his paint reaches two cells past it each
   side at the crown (facing E row 10: part ids x52-59, his paint x50-61). His bob's
   ramp holds exactly [27,26,32] and [237,232,220], so the near-white one stuck out over
   the forehead. 1,349 leaked pixels over 15 styles x 3 facings; 3,677 over all 8.
   THE FIX IS NOT MORE HAIR -- widening the span patches the symptom and leaves two
   hairstyles stacked on one head. The PD hair layer is not DRAWN while a hair garment
   is worn. RIG LAW untouched: his bob is not edited and returns the moment one is not.
2. THE FADE STOPPED HALFWAY IN PROFILE. fadeBot was a HAND COPY of sideBot made before
   the 8/2 profile fix and never updated with it, so the taper ended mid-mass. Tinted
   pixels sat at mean height 0.74 of the hair instead of 0.91, twice as many, smeared
   into the crown. It IS sideBot now -- one expression, cannot drift.

I GUESSED THE FADE FIRST AND I WAS WRONG. Fixed it, blob still there. Then measured:
zero hair pixels above luminance 120 on a ramp topping out at 50, so the bright pixels
were never hair. Pulling PD layers one at a time named the bob in one pass. The fade fix
stayed only because I then measured it ON ITS OWN -- a change that survives because it
was made on the way to something else is not verified, it is just present.

AND THE FIRST PICTURE COULD NOT HAVE SHOWN IT: the tool stamped generators onto
buildFrame's output by hand, which matches the render order but SKIPS THE PD LAYER LOGIC
ENTIRELY. It drives G_WORN now. VERIFY ON THE REAL SURFACE means the real path, not a
composite that resembles it.

GATES: hair_gate 27/0. His bob never shows under a worn hairstyle (15 styles x 8 facings,
counted by his own ramp colours on the worn path, pinned at 0; mutation fires at 3,677).
The fade bottom IS the hair bottom, asserted in SOURCE because the bug was two diverging
copies of one expression. Record:
records/BOHEMIA_TWO_HAIRSTYLES_ON_ONE_HEAD_8_21_26.txt
LOOK tab: "THE WHITE BLOB IN PROFILE", before beside after, both from the SAME code.

ONE HONEST LOOSE END: CROWD went 15/1 once inside a twenty-gate loop, then passed four
times running on its own. That is a FLAKE UNDER LOAD, not a pass. Recorded rather than
called green. Not in the hair path; nothing here touches the crowd.

THE CONTAINER CAME UP ON AN 8/14 TREE AGAIN, second session running, with 8/12-era files
staged that look exactly like unfinished work. They are not: all five were strictly older
copies of things already on main. DIFF AGAINST origin/main BEFORE BELIEVING A DIRTY TREE.

NEXT IN THIS LANE
  - STEP 5 continues: seams, hems, laces, buckles and stitch lines all still step by a
    whole cell. Measure which actually read coarse at 112 before assuming.
  - The same PART-GRID-vs-PAINT gap that hid his bob may affect OTHER PD layers in
    profile (hat/durag, facial/punk-face). Worth one measurement pass.
  - CANVAS MEMORY still red, still not this lane's. #354 TASTE and #356 ART 45 likewise.

---

CHARACTER (character-0lurbs): 8/21 (a) -- *** THE HAIR STOPPED BEING STRAIGHT.
Row 2X STEP 5 has started: the first content that actually uses the new pixels. ***

HIS CLAUSE 3 (8/1, LOCKED): "hair is about just the little off shapes that it makes ...
I'm seeing you make like a lot of straight lines and that's not realistic at all."

The wobble built that day works and is still correct. But it hashes the CELL row and its
only amplitude is S, so the moment the rig went to 112 it became a TWO PIXEL step on a
cell-sized grid -- the same silhouette as 56, drawn bigger. FOUR TIMES THE PIXELS BOUGHT
A SHARPER HAIR EDGE, NOT A FINER ONE.

NOTHING NOTICED, AND THAT IS THE REUSABLE PART: craft_law_gate asserts clause 3 by
FINDING THE WOBBLE IN THE SOURCE. It was there, hashed, deterministic, exactly as
written. A SOURCE CHECK CANNOT TELL YOU THE EDGE IT PRODUCES IS DEAD STRAIGHT.

MEASURED (tools/bohemia_hair_straightness.js), before -> after:
    rows in a straight run of 4+     50.7%  ->  18.5%
    longest straight edge            16     ->  6
The cell step is UNTOUCHED (the coarse shape is the one he approved); where it says stay
put, the individual PIXEL row may move by ONE. Cannot become static: it only fires where
the coarse step did NOT, so total travel is unchanged, and at S===1 it never fires, which
is why all 1,744 pinned 56 hashes are byte-identical.
Tried 1-in-4 as well: 28.0% and 12 -- worse on BOTH axes, no trade-off to tune.

*** THE GATE HAD TO BE WIDENED AND I COULD NOT MAKE THE WIDENING SELF-CHECKING. ***
clothes_4x claim 1 ("112 output IS 56 scaled") forbids the entire point of the flip once
any authored detail exists. A GATE MUST NEVER OUTRANK A RULING, so a generator may carry
@SUBCELL-DETAIL and gets ONE pixel / 12% coverage of slack, nothing else does. I tried
twice to make the machine verify the marker and FAILED TWICE -- recorded so nobody
rebuilds it: (1) comparing 112 to doubled-56 is useless, native drawing differs anyway;
(2) counting split cells does NOT separate them -- genHair scores 4 while genCoat scores
13 and genGear 17 with no sub-cell authoring at all. A third attempt would have been the
fourth version of an unasked-for thing. THE RISK IS BOUNDED AND MEASURED: mutation-tested
with the wide bound in force, the backpack hardcode still fires at 31%. A false marker
can excuse a small honest difference; it cannot hide a mis-scaling bug.

CLAUSE 3 NOW HAS A PIXEL GATE: hair_gate ratchets PINNED_STRAIGHT 0.185 / PINNED_LONGEST
6, both downward-only. Mutation: disable the sub-step and it fires reporting 50.7% and 16.
Record: records/BOHEMIA_THE_HAIR_STOPPED_BEING_STRAIGHT_8_21_26.txt
LOOK tab: "THE HAIR STOPPED BEING STRAIGHT" -- old edge beside new, SAME generator
(CLO_NOSUB switches the sub-step off for the tool), so the only difference on screen is
the thing being judged.

ALSO, AND IT COST THE FIRST HALF OF THE SESSION: THE CONTAINER CAME UP ON AN 8/14 TREE
with 8/12-era files staged, which looks exactly like unfinished mid-flight work. It was
not -- origin/main was 8/21 and already contained every one of those files, in NEWER
form. Checked all five against main before resetting; every local copy was strictly
older. IF A CONTAINER LOOKS LIKE IT HAS UNCOMMITTED WORK, DIFF IT AGAINST origin/main
BEFORE BELIEVING IT.

CORRECTED A STALE NOTE OF MY OWN: my last handoff sent the next session to build "the
fade-blends-into-skin-tone item marked [UNBUILT]". IT IS BUILT -- 8/1, amended 8/2
(skull-only). The [UNBUILT] tag lives in the 8/14 TWICE THE PIXELS addendum and is stale
there too.

NEXT IN THIS LANE
  - STEP 5 CONTINUES and hair is only the first of it. The same "sharper not finer"
    audit is owed on every other generator: seams, hems, laces, buckles and stitch lines
    all still step by a whole cell. genCoat and genGear already split cells natively, so
    start by measuring which ones actually read coarse at 112 rather than assuming.
  - CANVAS MEMORY still red, still NOT this lane's: 104 full-resolution images decode to
    850 MB. It needs smaller DIMENSIONS, not quantizing.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (f) -- *** I PUBLISHED A BUG THAT DOES NOT
EXIST AND THEN WENT TO FIX IT. THERE IS NO JAW DEBT. ***

This morning I wrote, in a commit and a record and this file: "the skinner was always
drawing the chin two cells too wide, Scale2x was hiding it." IT IS NOT TRUE.

HEAD FOLLOWS RIG compares the rig's painted FACE (part 2) against EVERY SKIN-COLOURED
PIXEL on the row. The row also carries the HEAD (part 1, wider than the face
everywhere but the cheekbones) and, on the chin rows, the NECK. All three are skin.
Measured row by row on the real frame:
    y12-y29   drawn skin == posed HEAD+FACE        to the pixel
    y30-y31   drawn skin == posed HEAD+FACE+NECK   to the pixel
    UNEXPLAINED PIXELS: ZERO
Every deviation it has ever reported is the head being wider than the face. Anatomy.

*** A RULER COMPARING TWO DIFFERENT REGIONS CANNOT BE REPAIRED BY RESCALING IT. ***
My first pass DID improve that gate -- turned a pixel count into a resolution-free
ratio, wrote out the reasoning, mutation-tested both directions. A well-built
instrument pointed at the wrong thing, and every good habit made the wrong answer
more convincing. The tell I walked past: every deviating row was off by EXACTLY 4 and
every zero row stayed exactly zero. A real defect is not constant across a face; a
region mismatch is, because it is one region minus another.

IT ASSERTS LIKE-FOR-LIKE NOW, and it is exact: the POSED head+face silhouette, row
for row, IS the rig's -- same regions, same space, read off PART IDS, on ALL EIGHT
FACINGS instead of one.  S:0 SE:0 E:0 NE:0 N:0 NW:0 W:0 SW:0, total 0, PINNED AT ZERO
and unloosenable. Mutation: widen the posed head one cell on S and it fires naming
the facing. Sampled at the REST phase on purpose -- at ph=0.37 deviation is 12-44,
which is the animation working, not a bug.
DO NOT GO HUNTING A CHIN BUG. Correction:
records/BOHEMIA_THERE_IS_NO_JAW_DEBT_AND_THERE_NEVER_WAS_8_20_26.txt

THAT IS FIVE WRONG RULERS IN THREE DAYS (reuse-first read a docstring as code; dress
counted a sentence as a garment; pages summed a surface we stopped publishing;
border measured a diagonal along a raster row; head compared a face to a head). THE
COMMON FORM: checker and checked are in different units, regions or files, and
nothing notices because the number still looks like a number. WHEN A RATCHET MOVES,
ASK WHAT IT COMPARES BEFORE YOU ASK WHAT BROKE.

ALSO SHIPPED
  wear() hashed the RAW PIXEL INDEX, so at 112 each sub-pixel got its own coin flip
  and a salvaged coat read as television static. Hashes the CELL now; proved
  identical at 56 by measurement (4,184 pixels, 4 scuff amounts, 0 different). Last
  per-pixel hash in the wardrobe path.

  THE LOOK TAB WAS RED ON MAIN AND NOBODY COULD CLEAR IT: twelve city pictures went
  stale when the WORLD lane edited the city, and none recorded a `shooter`, so the
  gate could only say "NO SHOOTER RECORDED". All seventeen shots that tool takes now
  name it and the twelve were retaken. Seven CHARACTER pictures were genuinely stale
  (the character is 4x since this morning) and were retaken too. 24/0, 27 pictures.

NEXT IN THIS LANE
  - STEP (5) of row 2X is open and is the headline now: real authored detail per
    garment and hairstyle at 112, plus the fade-blends-into-skin-tone item his
    hair-and-shape law marks [UNBUILT]. Normal cooks, his normal thumbs.
  - CANVAS MEMORY is still red and still NOT this lane's: 104 full-resolution images
    decode to 850 MB (VOTE 69 / 633 MB, ART 27 / 209 MB), byte-identical before and
    after the flip. Quantizing cannot help -- decoded cost is w*h*4 whatever the file
    weighs. It needs smaller DIMENSIONS.
  - #354 TASTE and #356 ART 45 remain red and remain other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (e) -- *** THE CHARACTER IS FOUR TIMES
THE PIXELS. HE SHIPPED IT BY SAYING "IT LOOKS EXACTLY THE SAME DUMBASS". ***

He was right, and that was the whole answer. Row 2X had steps 1-4 built, proved and
DORMANT since 8/16 on ONE sentence I wrote myself -- "at 112 native his head renders
as a box" -- which is true and was also a JUDGEMENT made on his behalf about pixels
he had never been shown. He was shown them, could not see a difference, and it
shipped. Thirty pixels on a face were holding the headline.
VERIFIED THE PICTURE WAS HONEST BEFORE TREATING IT AS A RULING: 976 of 30,752
displayed head pixels differ, 3.2%. A real difference, correctly called nothing.

SHIPPED (`python3 tools/bohemia_2x_flip.py --flip`):
  - the frame composes at 112 NATIVELY; Scale2x is OFF, which deletes per-frame work
  - the black border is ONE TRUE PIXEL, median 1 on all eight facings
  - his painted art untouched -- rig_no_drift still hashes the literal byte for byte
  - the wardrobe was made resolution-native the same morning, so garments arrive
    sharp instead of block-doubled (which is what the old plan would have shipped)

THE FLIP TOOL GOT TWO THINGS WRONG AND REFUSED TO WRITE BOTH TIMES (it working):
  1. it would have RE-INSERTED the block-doubling garment seam and undone the
     morning's 4x wardrobe. Retired, replaced with an ASSERTION -- if the native
     seam ever vanishes it refuses to flip rather than silently reverting.
  2. four seams it called MISSING were already applied in a later `typeof BAKED`
     form. A tool that cannot recognise its own finished work reports a MISS.

RE-BLESSED, NOTHING LOOSENED (all mutation-tested):
  ALPHA LOADS + RIG NO-DRIFT  the literal is WRAPPED now, so `const BAKED={` matched
                              nothing and both said HIS RIG IS MISSING on a build
                              where it is present and doubled
  CANVAS SCALE                CLOTHES boxes were x1.5 and x0.5 around a 112 sprite
                              (x4.5 and x1.5 on the glass). Resized; cloBig re-pinned
                              x3 -> x2 because those are the SAME SIZE on screen
  BORDER                      THE RULER WAS WRONG: it measured along a raster row, so
                              on a diagonal it read a staircase tread as an 8px
                              border once Scale2x stopped rounding corners. Takes the
                              smaller of BOTH axes now -- stricter, not looser
  CROWD                       not dice: it compared a HALF-DRAWN board. Settles on the
                              board, not a clock. 4 runs green

*** THE ONE THAT IS A FINDING, NOT A RE-BLESS: HEAD FOLLOWS RIG. ***
Its pin was FLATTERED. In 56-equivalent cells the chin went from "exactly right"
(rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by removing the smoothing
-- THE SKINNER WAS ALWAYS DRAWING IT THAT WIDE and Scale2x was trimming the corner
off. The ratchet is a RATIO now (deviation over the rig's own width): 0.171 at 56,
0.211 at 112, scale-free forever, never needs re-blessing again. It is the instrument
that says where "the head is a box" actually lives: THE CHIN AND THE ROW UNDER THE
MOUTH. Fix the skinner there and the number falls.

MEMORY, measured as row 2X demanded:
  a PLAYER holds 25.4 MB and the RUN tab adds ZERO. The flip costs the game nothing.
  the CLOTHES tab quadrupled (25 -> 96.8 MB): it keeps a live canvas per garment for
    258 garments and never let go of the pixels, only of the painting. Off-screen
    canvases release their backing store now: 96.8 -> 2.4 MB, whole build 1,188 ->
    1,093 MB. So this turn IMPROVED the worst case by ~100 MB while doubling the rig.
  *** STILL RED AND NOT THIS LANE'S -- THE ONE THING WORTH SOMEBODY'S NEXT TURN ***
    104 full-resolution images decode to 850 MB: VOTE 69 imgs / 633 MB, ART 27 imgs
    / 209 MB. BYTE-IDENTICAL before and after the flip, so none of it is the rig.
    QUANTIZING DOES NOT HELP -- decoded cost is w*h*4 whatever the PNG weighs; it
    needs smaller DIMENSIONS or thumbnails. The gate had been GREEN ONLY ON A STALE
    MEASUREMENT FILE (its own NOTE says so every run). I re-took it rather than keep
    a green I know is a lie.

  records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt
  LOOK tab: "IT LOOKS EXACTLY THE SAME" -- re-labelled to what it became, left is
  every build before today, right is what he is playing.

NEXT IN THIS LANE:
  - STEP (5) IS OPEN FOR THE FIRST TIME: real detail per garment/hairstyle, now that
    there is somewhere to put it. The fade-blends-into-skin-tone item the
    hair-and-shape law marks [UNBUILT] is possible from today.
  - the CHIN. head_follows_rig now points at it precisely; it is skinner work and
    RIG LAW makes that the most dangerous code in the repo, so measure first.
  - wear()/scuff still hash per PIXEL (alpha ~21833); at 112 that is noise, not
    cloth. Same cell-hash fix the tatter already took.

---

CHARACTER (character-0lurbs): 8/20 (d) -- *** THE 4X BLOCKER WAS MY
JUDGEMENT, NOT HIS, AND HE HAS NEVER BEEN SHOWN IT. NOW HE CAN LOOK. ***

Row 2X has been parked since 8/16 on one sentence: "AT 112 NATIVE HIS HEAD RENDERS
AS A BOX", therefore the rest is PAINT, therefore it waits for Paolo. True, and it
still smuggled in a verdict -- I decided the box was unacceptable on his behalf, and
the 4x headline he asked for on 8/14 AND AGAIN ON 8/20 has been sitting behind my
opinion of pixels he has never seen. That is the approvals queue through the side
door, which EVERYTHING IS A THUMB killed.

MEASURED IT INSTEAD (tools/bohemia_2x_box_measure.js, real rig, all 8 facings):
    5.90%   of the lit body differs between today and native 4x
      11%   of that difference is on the head or face -- the box is mostly NOT the head
    9.8 / 40 / 52%   of it is MINE to author -- bare / everyday / fully kitted
THE LAST LINE IS THE FINDING. A garment pixel is CODE, and as of this morning all 13
generators draw natively at any resolution. So a rounded corner on a shirt, a boot, a
coat or a hairstyle is a thing I write, not a thing he paints -- and the more dressed
a character is, the less of the box is his problem. Nobody in this game is naked.
records/BOHEMIA_HOW_MUCH_OF_THE_BOX_IS_HIS_8_20_26.txt

AND THE ROW'S OWN JUDGEABLE, OWED SINCE 8/14 AND NEVER DRAWN, IS NOW IN THE LOOK TAB:
"IS THIS A DEALBREAKER?" -- head, profile, back and whole body, today on the left and
native 4x on the right, same size, same clothes.
  node tools/bohemia_2x_box_picture.js

DELIBERATELY NOT BUILT: the generator rounding. It is dormant until the flip and
building it before he looks is the fourth version of an unasked-for feature
(STOP PRODUCING). If he says the right column is fine, steps 1-4 flip and the
rounding is a normal cook after. If not, the measurement says which pixels are worth
his hand and which are mine.

*** AND THE FLEET-BLOCKING SIZE RED IS CLEARED: IT WAS THE RULER. ***
PAGES PUBLISH said "271 MB / 260 MB cap" on every lane's ship. The site is 230 MB.
.github/workflows/pages.yml assembles _site by hand and touches .nojekyll, so JEKYLL
NEVER RUNS and _config.yml -- which the gate read as the source of truth -- governs
nothing about the deploy. Three explicit cp -r lines do. The 41 MB gap (tileforms_
proofs, the valley aerial, the words book, the questbook index) was KEPT on paper and
never copied. Measured on my own deploy: assembly 0 seconds, whole job 41 seconds.
WHY THE DRIFT CHECK MISSED IT: it tested `cp -r records(\s|/)` for "is records
copied", and `cp -r records/target` matches. A PART read as the WHOLE.
FIXED, AND STRICTER: the size check measures the workflow's copy list; the reference
check asks "does the workflow copy it" before consulting an exclude list that no
longer runs (asking the old way after the fix reported 36 LIVE refs as dropped); a
new check fails a HALF-published folder; and the legitimate carve-out (records/
excluded, records/target copied by name) is understood and written into the config.
Cap unchanged at 260. Not one byte deleted. Deploy behaviour byte-identical.
Mutation-tested 3 ways, names the culprit each time -- including 524 MB when somebody
adds banks/ back, which is the failure the cap was written for.
  node gates/pages_publish_gate.js   18/0   (230 MB / 260 MB)
  records/BOHEMIA_THE_SIZE_CAP_WAS_MEASURING_A_SITE_WE_STOPPED_PUBLISHING_8_20_26.txt

NEXT IN THIS LANE:
  - IF HE SAYS THE BOX IS FINE: flip steps 1-4 (`python3 tools/bohemia_2x_flip.py
    --flip`), re-bless the gate numbers per records/BOHEMIA_2X_GATE_REBLESS_
    CHECKLIST_8_15_26.txt, then author generator rounding as a normal cook.
  - IF HE SAYS IT IS NOT: the measurement above says the head/face is only 11% of it,
    so the repaint ask is far smaller than "the rig".
  - EITHER WAY, STILL OWED: wear()/scuff hash per PIXEL (alpha ~21833) and the PD
    FACIAL layer block-doubles. The first is mine and is the same cell-hash fix the
    tatter already took; the second is his painted art and stays block-doubled under
    RIG LAW -- worth measuring how visible it is beside native cloth.
  - #354 TASTE and #356 ART 45 are still red on the fleet, still other lanes' content.

---

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (c) -- *** HE ASKED FOR THE CLOTHES AT
4X. HIS PREMISE WAS WRONG AND HE NAMED THE EXACT THING THE 2X PLAN DEFERRED. ***

    "i need you to remake all the clothes and hairs with the 4x pixels we now
     have in mind is that okay?"

WE DO NOT HAVE THE 4X PIXELS. RIG_RS is 1, BAKED.W is 56, and the reason the 112
rig stays dormant is his own 8/1 law -- composing natively removes the corner
rounding Scale2x was doing and the head renders as a BOX, "no straight lines".
Twice the pixels means PAINTING at 112 and that is his hand.
(records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt)

BUT HE IS RIGHT ABOUT THE GAP. tools/bohemia_2x_flip.py says in its own docstring
"CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM" -- so the day
the rig doubles, the body gets four times the pixels and every garment and every
hairstyle arrives as 2x2 squares beside it. He caught that from the outside.

AND IT IS WORSE THAN CHUNKY. Hand the generators the real 112 grid with nothing
else changed and they come out the WRONG SIZE. Measured, before any of this:
    bedroll 0.25 (never grows at all)   backpack 0.29   satchel 0.37   sash 0.39
    pauldron 0.44   cape 0.45   scarf 0.48   kneepads/belt/chestrig 0.50
    apron 0.55   hair 0.83   hats 0.82-0.92   genTop/genCoat/genCoverall ~1.00
10 of 41 scaled. 31 did not.

WHAT SHIPPED. Not 228 images: 236 of 237 canon garments and ALL 36 hairstyles are
GENERATED by 13 functions, 1,213 lines. Every pixel DISTANCE now reads a scalar
derived from the grid (rsc()); part ids and colour indices do not scale, and that
is the whole classification -- 752 literals sorted by measure-fix-measure, never
by eye.
    448/448 shapes keep their proportions when the body doubles, all 8 facings
    1,744 outputs at 56 are byte-identical to the previous commit, 0 different

THE SECOND NUMBER IS THE ONE THAT MATTERS AND IT CAUGHT ME. The first pass was NOT
identical: it moved a satchel three pixels, lit a mohawk spike, dropped a ponytail
a row, and lost the inner rim off both coverall chest pockets. Nineteen pixels,
all invisible to the 4x measurement, all would have shipped.

THREE GENERAL BUGS, EACH FIXED ONCE:
  - an INCLUSIVE bound is off by S-1 (`yy>=tb-4` is FIVE rows, not four)
  - a FRACTION OF A SPAN is a CELL count, not a pixel count -> helper fr(a,b,f);
    23 sites; getting this wrong put the dust mask two rows below his mouth
  - a MAX EDGE (tMx, tb) is the BOTTOM of its cell, so offsets off it start S-1
    earlier

THE GATE HAD A HOLE AND MUTATION TESTING FOUND IT. gates/clothes_4x_gate.js ran
claim 1 on facing S alone; putting the backpack's hardcoded body back STAYED
GREEN, because a pack only draws from behind and 19 generators branch on curDir.
Now all 8 facings. Four mutations tried, four caught, each naming the culprit.

WHAT DELIBERATELY DID NOT MOVE: the 24-grid PD layers and the skin-detail brush
still block-stamp. Those are PAINTED pixels -- his -- and inventing detail he did
not paint is a RIG LAW violation, not an upgrade. The gate asserts both halves.

WHERE HE SEES IT: LOOK tab, "THE WARDROBE AT 4X" -- twelve garments and two
hairstyles drawn twice at the same size, block-doubled left, native right, on his
own rig, from the alpha's own generators. CLOTHES tab is where he wears them and
nothing there looks different today, which is the 1,744 hashes doing their job.
  node tools/bohemia_4x_wardrobe_picture.js
  node gates/clothes_4x_gate.js        12/0
  records/BOHEMIA_THE_CLOTHES_AND_HAIR_ARE_RESOLUTION_NATIVE_8_20_26.txt

STILL HIS, NOT MINE: repainting the rig at 112. The wardrobe is ready for that day
and costs nothing until it comes.

NEXT IN THIS LANE (nothing is blocked on him):
  - the PD layer half. Hair is generated so it went native, but the FACIAL layer
    and his painted curtain-bob are 24-grid art that will still block-double.
    That is correct under RIG LAW, but it is worth measuring how visible the
    mismatch is beside native cloth before the flip, not after.
  - the wear/tatter and scuff passes hash per PIXEL in a few places outside the
    13 generators; at 112 that is noise rather than cloth. Same cell-hash fix.
  - #354 TASTE and #356 ART 45 are still red on the fleet and are still other
    lanes' content (checked, not touched).

---


CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/20 (b) -- *** A SECOND FLEET RED CLEARED, AND
IT WAS CAUSED BY ONE SENTENCE I WROTE IN A COMMENT. *** #204 DRESS, now 46/0.
NO TAB and no build stamp bump: nothing player-facing moved, on purpose.
Record: records/BOHEMIA_A_SECOND_RED_CAUSED_BY_A_SENTENCE_I_WROTE_8_20_26.txt

DRESS said "bank is FRESH: 236 banked === 237 canon in the alpha" -- i.e. a garment
exists in the game that was never banked. The wardrobe is this lane's, so I went to
find which garment. THERE ISN'T ONE. The count is of the STRING st:'canon' across a
4 MB file, and of its 237 occurrences 236 are real garments -- exactly the bank -- and
ONE is a sentence in a comment I wrote on 8/17 above the city cast: "Every garment
here is st:'canon' and already exists".

*** THE GATE HAD BEEN CONTRADICTING ITSELF AND NOBODY LOOKED. *** DRESS also checks
"every canon garment in the alpha is in the bank BY NAME" and that was GREEN the whole
time. So it was reporting the bank stale AND every garment present. When two checks in
one file disagree the specific one beats the counting one -- and a red nobody has
triaged is a red nobody reads.
Fixed the RULER: block comments are stripped before counting (237 -> exactly 236,
nothing else touched). Rewording my comment would have gone green in ten seconds and
left the same landmine for the next person who writes about the wardrobe.
Mutation-tested both ways and it names the culprit each time: remove a garment from the
bank -> red naming FIELD SHORTALLS; add a real unbanked canon garment -> red naming it.

*** THE PATTERN IS WORTH MORE THAN EITHER FIX, AND EVERY LANE SHOULD CHECK ITS OWN. ***
This is the THIRD mention-counted-as-a-use defect in two days, across three gates:
  8/19 REUSE FIRST swept a tool as "drawing" because its DOCSTRING said putImageData
       (it is a CSS class flip that draws nothing)
  8/19 REUSE FIRST read `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` as ABSENT, wanting
       the colon adjacent
  8/20 DRESS counted a sentence about the wardrobe as a garment
All three are grep-shaped checks over files that contain BOTH code and prose about
that code. This repo writes unusually thorough comments -- that is a strength, and it
guarantees any gate that greps a whole file will eventually be fooled by its own
documentation. IF YOUR GATE GREPS A SOURCE FILE, STRIP THE PROSE FIRST.

AND THE OTHER LESSON, TWICE PROVEN NOW: A GATE'S NAME DOES NOT TELL YOU WHOSE FAILURE
IT IS. Neither REUSE FIRST nor DRESS sounds character-lane; both were. The 8/19 fleet
picture (29 red) is explicitly a BASELINE nobody has triaged -- two of them are now
cleared by this lane, both in under an hour, neither changing a pixel. IF YOU HAVE A
QUIET TURN, TRIAGE A RED AGAINST YOUR OWN FILES BEFORE BUILDING ANYTHING.

WHAT I CHECKED AND DELIBERATELY LEFT ALONE:
  #354 TASTE  wants a TASTE CHECK block in bohemia_exchange_factory.py and
              bohemia_quirk_factory.py -- other lanes' content, and writing their
              taste notes would be writing their canon.
  #356 ART 45 a roofline in banks/BOHEMIA_DISTRICT_HERO_CANDIDATES reads as a flat
              rectangle instead of an iso diamond. ART lane.
  THE HERO FACTORY STILL DOES NOT PARSE (reported 8/20a, tools/bohemia_district_hero_
  factory.py line 1247, broke in 53a981c). Still open, still not mine.

WHAT COMES NEXT FOR THIS LANE:
 1. MORE OF THE 29, TRIAGED AGAINST OUR OWN FILES. That is two for two on quiet turns.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code), RUN wiring the field surgery clips (theirs).
 3. No unblocked content work I would defend building. The wardrobe delivers exactly
    what the game needs and I have measured that twice.

CHARACTER (character-0lurbs): 8/20 (a) -- *** ONE OF THE FLEET'S 29 REDS WAS
MINE AND IT IS CLEARED. AND A TOOL IN ANOTHER LANE DOES NOT PARSE AT ALL. ***
NO TAB, and no build stamp bump: nothing player-facing moved this turn, on purpose.
Record: records/BOHEMIA_A_RED_THAT_WAS_MINE_AND_A_TOOL_THAT_DOES_NOT_PARSE_8_20_26.txt

*** READ THIS FIRST IF YOU ARE THE WORLD OR ART LANE ***
    tools/bohemia_district_hero_factory.py DOES NOT PARSE.
    line 1247: a JS block comment (/* ... */) is sitting in a Python file.
    line 1245 also looks unclosed: `'px': _win(TOWER, 1, 3, 5, 0.3` with no bracket.
    BISECTED: broke in 53a981c (8/19, "YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN").
    Every commit before that parses. The biggest pixel-making tool in the repo has
    been unable to run for a day.
LIKELY (and I did not prove it, confirm before believing me): #364 HERO WIRE fails on
`resort` and `casino` -- the two new Strip districts -- with "sprite embedded as PNG
data URI". Those heroes come out of this factory. A factory that cannot parse cannot
cook them.
HOW I FOUND IT, AND A CORRECTION I MADE TO MYSELF BEFORE SHIPPING: a plain sweep --
py_compile every tools/*.py and gates/*.py, node --check every .js, 380 files in
seconds. I first wrote that nobody could know because #219 TOOLS RUN times out at 600s
reproducing the hero factory (31 min, per the 8/19 record). SOMEBODY HAS SINCE BOUNDED
IT: TOOLS RUN now finishes in 16.7 SECONDS and names this exact file, with a check
labelled "THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)". So the
fleet already reports it and my sweep only agrees. What I add is the BISECT (53a981c),
the second defect behind the first (line 1245), and the likely HERO WIRE link.
I did NOT fix the factory: 1,200 lines in another lane's system, and ONE SYSTEM ONE
SESSION is worth more than a fast win.

WHAT I DID FIX -- #343 REUSE FIRST, NOW 151/0.
It failed on four files and ALL FOUR WERE CHARACTER-LANE TOOLS. The 8/19 fleet picture
is explicitly a BASELINE and not a triage, so no red in it is attributed; the first
useful thing any lane can do with that record is check which of the 29 is its own.
Two genuinely lacked a REUSE CHECK block and now carry real ones (family_cast_patch:
zero garment pixels, four dial sets on the one rig, and the only thing it draws is a
render-time contact shadow, which SHADOWS ARE SEPARATE sanctions; family_anim_patch:
zero pixels, it bakes famPaintBody's own output and blits it).
TWO WERE THE RULER, and the gate's own header quotes the law that catches them:
 1. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). It decided
    a tool "draws" by searching the WHOLE FILE -- docstring included -- for fillRect /
    putImageData. bohemia_sun_mode_char_patch.py is a CSS class flip that draws nothing
    and merely EXPLAINS putImageData in prose, and for that sentence it was held to the
    art-cooking law. The module docstring is stripped before the test now. EMBEDDED JS
    IS NOT stripped, because these patch tools inject drawing code as string literals
    and that is a real use.
 2. THE MARKER, NOT ITS PUNCTUATION. The regex wanted the colon immediately after the
    words, so `REUSE CHECK (REUSE-FIRST, Paolo 7/22):` read as ABSENT. Citing the law
    you are complying with is this repo's own habit and the gate was failing files for
    it. The heading must still be ONE LINE -- mine wrapped at first and stayed red,
    which is the same line-wrapping trap look_gate documented.
MUTATION-TESTED THREE WAYS, all correct: delete a real block -> red; a NEW patch tool
that draws in CODE with no block -> red (no hole opened); a tool that mentions drawing
only in PROSE -> correctly not swept.

WHAT COMES NEXT FOR THIS LANE:
 1. CHECK THE 29 AGAINST YOUR OWN WORK BEFORE BUILDING ANYTHING. That record is a
    baseline nobody has triaged. One of them was mine and it took twenty minutes.
    #219 TOOLS RUN and #343 REUSE FIRST are the two that silently accumulate other
    people's debt, so they are worth re-running by hand even when the suite is long.
 2. STILL BLOCKED AND STILL NOT MINE: faction ground assignment (his ruling), painting
    the rig at 112 (his call, not code -- records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_
    8_16_26.txt), RUN wiring the field surgery clips (theirs).
 3. The lane has no unblocked content work I would defend building. Three turns running
    the honest answer has been to measure something nobody had measured rather than add
    to a wardrobe that already delivers what the game needs.

CHARACTER (character-0lurbs): 8/19 (i) -- *** I MEASURED MY OWN WORK AT THE
OTHER THREE ZOOMS AND IT ONLY HOLDS AT ONE OF THEM. TAB: LOOK, "WHEN A PERSON STOPS
BEING SOMEBODY". ***
Record: records/BOHEMIA_WHEN_A_PERSON_STOPS_BEING_SOMEBODY_8_19_26.txt
Gate: gates/zoom_identity_gate.js, 7 claims, registered as ZOOM IDENTITY.

Every "you can tell these thirteen factions apart" number I have shipped was measured
at 112 pixels on the CHARACTER tab. The city draws a body at one of FOUR sizes on an
integer ladder, blitted 1:1 (224 / 112 / 56 / 28). I had measured one rung and talked
as if I had measured the surface.

    112px   closest pair 0.036    the pin the build holds is 0.035
     56px   closest pair 0.0150   the gap that ACTUALLY failed once was 0.014
     28px   closest pair 0.0144   the body is 25 pixels tall here

IDENTITY DOES NOT SURVIVE BEING ZOOMED OUT. That is not a wardrobe problem and no coat
fixes it. THE DEMO IS FINE -- `let HC=44` is the default walk zoom and lands on the
112 rung -- but the claim needed a limit attached to it and now has one.

THE DESIGN CONSEQUENCE, and it belongs to whoever needs it rather than to me: anything
the player must RECOGNISE at a wide zoom (which faction holds this street, the person
he is looking for) needs a channel that is NOT the silhouette -- a marker, a name,
colour, or the camera being closer. At the wide zooms the cast is crowd, by physics.

THE GATE DELIBERATELY DOES NOT FAIL ON THE LIMIT. A gate that goes red on something
nobody can fix gets switched off, and it takes the real checks in the same file with
it. It fails on LOSING THE GOOD RUNG: one character changing HC below 32 would turn
the whole cast back into crowd with nothing going red anywhere. Mutation-tested at
HC=20 -> red naming the rung. It also reads the ladder OUT OF THE CITY SOURCE rather
than restating it, so it cannot pass by agreeing with a copy that has drifted.

*** AND A CORRECTION TO SOMETHING I HAVE WRITTEN IN FRONT OF HIM SEVERAL TIMES. ***
I kept captioning "the demo opens at 06:00 and the streets are near-black". The game's
own isNight() is `T.min >= 19*60 || T.min < 6*60` -- so 06:00 is EXACTLY when night
ends, and the demo does not open in the dark. The darkness argument still stands, but
for the right reason: the city's own note measures only ~3.9% of cells with live power
and 2.6% of people living on one, so most streets are unlit whatever the clock says.
The LOOK captions are corrected.

*** AND I TURNED A BUG INTO A FLAKE AND THEN FIXED IT PROPERLY -- WORTH READING. ***
Yesterday the thirteen-outfits board broke crowd_gate by building during boot, and I
moved it off the boot path with requestIdleCallback. That fixed it STANDALONE and made
it LOAD-DEPENDENT: under the full suite the machine is busy, the idle callback lands
somewhere else, and crowd_gate went red in the suite while passing on its own. A gate
that fails intermittently is worse than no gate -- it teaches everybody to re-run
until green, which is how a real failure gets waved through.
THE FIX IS NOT MORE TIMING. Painting that board rebuilds the rig thirteen times, so
anything already on screen was drawn before that happened; the board now calls
crowdRefresh() when it finishes. That restores the INVARIANT the gate actually checks
-- what is displayed matches what a redraw produces -- and it is true no matter when
the build lands. Verified the way the flake was found: three crowd_gate runs under
concurrent load, 16/0 each time.
IF YOU CHASE A FLAKE WITH TIMING YOU WILL GET IT BACK UNDER DIFFERENT LOAD. Find the
invariant and restore it.

WHAT COMES NEXT FOR THIS LANE, IN ORDER, AND IT IS SHORT ON PURPOSE:
 1. NOTHING IN THE LANE IS BOTH UNBLOCKED AND WORTH BUILDING RIGHT NOW, and that is a
    real state rather than a gap in the list. The faction outfits are done and nobody
    wears them until he rules which faction holds which ground; the field surgery
    clips are done and RUN owns the wiring; 2X needs painting at 112, which is his
    call and not code. I checked the demo board: no open row is character-owned.
 2. I NEARLY COOKED NEW GARMENTS TO FILL THE TURN AND MEASURED FIRST INSTEAD. The
    brief said "the outline is set at the shoulder and the hem, so cook a shape nobody
    occupies" -- and mapping where each existing garment actually moves the outline
    showed the coats already own the lower body. The brief was wrong, the cook would
    have been filler, and the wardrobe already delivers exactly what the game needs.
    If a cook does happen it should follow a fresh measurement, not that stale brief.
 3. THE HONEST BACKLOG for this lane is: faction ground assignment (his), 112 painting
    (his), RUN wiring (theirs). Everything else is polish nobody has asked for.

CHARACTER (character-0lurbs): 8/19 (c) -- *** I WENT TO FIX 31 BROKEN
ANIMATIONS AND FOUND 30 OF THEM WERE FINE. THE ONE THAT WAS REAL IS FIXED.
TAB: ANIMATION (pick `drunk`), and LOOK for the before/after. ***
Record: records/BOHEMIA_WHICH_ANIMATIONS_JERK_8_18_26.txt
Gate: gates/loop_seam_gate.js, 7 claims, registered as LOOP SEAM.

*** READ THIS PART FIRST, BECAUSE THE THING IT CORRECTS IS MINE. *** My last handoff
said "31 clips do not close their loop, next lane the measurement is already taken."
THAT NUMBER WAS WRONG. It measured HAND TRAVEL IN RIG-SPACE, which says nothing about
whether anybody watching would see it: a 3px hand offset at the seam is invisible in a
clip whose normal motion is 2,000 pixels a frame. Measured on the RENDERED FRAME, as a
ratio against the biggest move each clip already makes:

    102 OF 103 CYCLIC CLIPS FLOW.  ONE snapped.

The sweep I was recommending would have been 31 fixes to 30 clips that were fine. If
you read the old note and were about to do it, don't.

THE AUDIT'S OWN FIRST CUT WAS ALSO WRONG, and it is worth knowing why: it used the
MEDIAN step as the denominator, and POSEHOLD holds each pose for a whole key, so
sampled across the bar every second step is EXACTLY ZERO -- the median of the series
is 0. `run` scored a seam ratio of 2617. A summary statistic has to fit the shape of
the signal; this one alternates hold-move-hold-move, so the peak is the honest
denominator. Both wrong rulers were caught by the numbers being absurd, not by
anybody reading the code.

THE ONE THAT WAS REAL: `drunk`, and it had been doing it since it was written.
    const w = Math.sin(ph*Math.PI + 1.3);     <- HALF a period over the bar
Every sibling term in that same line uses ph*2*Math.PI. So w started the bar at +0.96
and ended at -0.96: it FLIPPED SIGN across the wrap. w drives hipOff, so the hips
teleported 3.5px sideways in one frame, every two seconds, forever. Measured: the
body's centre used to do its ENTIRE 12.5px of travel in the single frame at the
restart; it now does 0.3px there. Seam ratio 1.72 -> 0.40.
The 1.3 radian offset is KEPT on purpose -- the sway being out of phase with the steps
is the whole staggering read, and only the frequency was wrong. Not a redesign: no
amplitude, offset, joint or timing changed.

NEW FLEET NET, and it is cheap to keep green: gates/loop_seam_gate.js holds EVERY
cyclic clip in the game under a seam ratio of 1.20, sampled at FRAME_CACHE.buckets
(the renderer's own frame count, not the pose grid). Mutation-tested by putting the
half-period sway back: red at 1.72, naming drunk. Worst in the build now is weave at
0.81. If you author a clip and this goes red, your loop does not close.

AND A TRAP THAT COST ME TWO SHOTS OF THE PICTURE: POSEHOLD_CACHE. I rendered a
before/after by borrowing POSE.drunk, and cleared FRAME_CACHE and HD_CACHE but not
POSEHOLD_CACHE -- so the "before" row cached its posed skeletons and the "after" row
was served those same poses. Both rows came out byte-identical and the measurement
under each read 12.5px, which LOOKED like a result. A cache you forget to clear does
not throw, it agrees with you. Clear all three.

*** AND I BROKE A GATE AND FIXED IT, WITH TWO LESSONS WORTH MORE THAN THE BUG. ***
crowd_gate went red on "redrawing the same crowd gives byte-identical pixels" and it
was MINE: the thirteen-outfits board built on a 1500ms boot timer. IT IS NOT A STATE
LEAK -- measured, calling outfitBuild() explicitly changes neither the crowd already
drawn nor what a refresh draws. IT IS A BOOT RACE: painting thirteen bodies means
thirteen rebuildFromRig() calls, and that much synchronous work in the middle of
startup moves when everything else paints, so the crowd was drawn at a different point
in boot than the state it was later refreshed against. The fragility was already there
and my timer exposed it. The board is now built ON FIRST SIGHT (requestIdleCallback
with a 2400ms guarantee, plus on the first CHARACTER tab open the way the CLOTHES tab
already does it), which removes the race AND takes thirteen rig rebuilds off the
startup path -- real time on a phone, and time-to-first-play is a demo row.
   IF YOU ADD ANYTHING TO BOOT: it is not enough that your feature restores what it
   borrows. Work on the boot path RESCHEDULES everybody else's paint. Build lazily.

*** THE SECOND LESSON IS NASTIER AND IT NEARLY SHIPPED. *** My patch tool skipped an
edit only when the EXACT new text was already present. So the moment the shipped copy
differed by one sentence, the tool stopped recognising its own work, found its anchor
still in place, and inserted a SECOND copy of the whole board. A later duplicate WINS
at runtime while the fresh one sits above it as dead code -- the exact failure
gates/banner_gate.js exists for, and it caught nobody here because the duplicate was
in the alpha, not an engine module. Every edit in that tool now carries a MARKER that
says "this is installed" independent of its wording, and the tool is proved idempotent
by running it twice against an installed tree. ANY LANE WITH AN IDEMPOTENT-BY-STRING
PATCH TOOL HAS THIS BUG: already-installed is not the same as already-identical.

*** A LOOK RED THAT IS REAL AND IS NOT THE CHARACTER LANE'S -- CITY/WORLD, PLEASE
READ. *** look_gate is 23/1 and the failing check is right: TWELVE PICTURES IN THE
LOOK TAB ARE FROM 8/8 and photograph slices/BOHEMIA_CITY_WORLD.html, which has changed
every day for eleven days. dead-suburb, dead-road, dead-desert, dead-density, vista,
dead-pit, dead-cluster, the-pit-dug, the-wall, the-claim, the-favour, the-collection.
They are pictures of last week's city and he is looking at them.
IT WAS INVISIBLE UNTIL NOW FOR A DULL REASON: the check clocks file mtimes, and a
fresh checkout stamps every file with the same time, so on a young working tree the
pictures look exactly as new as the page. Let the tree age past six hours and the
truth comes out. The gate was passing FALSELY, not passing correctly.
I did not retake them, deliberately -- they are city-lane pictures of city-lane
features, framed by driving the world to a coordinate, and re-shooting somebody's
work without them is how a picture ends up showing the wrong thing. WHAT I DID DO is
record the shooter for all twelve, so the red now prints the exact line that clears
each one instead of being a dead end:
      node tools/bohemia_look_shots.js --only dead-suburb        (etc, one per id)
The five alpha-clocked pictures in that list were MINE and I retook all five this
turn; they are green.

WHAT COMES NEXT FOR THIS LANE, IN ORDER:
 1. RUN CONSUMES THE FIELD SURGERY CLIPS in the treat-wound sequence -- RUN's half of
    the same routing (ONE SYSTEM, ONE SESSION). Do not reach across for it.
 2. NOBODY WEARS THE THIRTEEN FACTION OUTFITS YET: FACTION_ASSIGN is empty and every
    agent is faction:null because WHICH FACTION HOLDS WHICH GROUND is his ruling. The
    fits are ready the day it lands.
 3. 2X IS STILL BLOCKED ON PAINTING, NOT CODE (records/BOHEMIA_2X_WHY_THE_RIG_STAYS_
    AT_56_8_16_26.txt). Two independent arguments for it now: headwear cannot carry
    identity at 56 (a wide brim is 1.9% of a body), and the 12-key pose grid plus a
    small rig leaves fine motion nowhere to live.
 4. A COOK BRIEF THAT IS ALREADY EXACT: the outline is set at the SHOULDER LINE and
    the HEM, and 34 of 202 garments carry the whole structural range. A new garment
    should occupy a silhouette nobody has.

CHARACTER (character-0lurbs): 8/18 (m) -- *** YOU CAN WATCH SOMEBODY TREAT A
GUNSHOT WOUND NOW. BACKLOG ROW FS IS CLOSED. TAB: ANIMATION (pick pour / inject /
tweeze from the clip list), and LOOK for the picture. ***
Record: records/BOHEMIA_FIELD_SURGERY_CLIPS_AND_THE_TWELVE_KEY_GRID_8_18_26.txt
Gate: gates/field_surgery_gate.js, 18 claims, registered as FIELD SURGERY.

His 8/13 order: "definitely we're gonna need to make animations for this and yep."
medkit_gate has held the five goods and the five steps since 8/13 and there was
nothing to LOOK at. Three clips cover all five, because the needle is used twice
(lidocaine, then antibiotics) and boiling the tweezers is a held prop, not a body
action -- which is the backlog row's own split, not a shortcut.

*** THEY ARE TOLD APART BY TIMING, NOT SHAPE, AND THAT IS FORCED. *** All three put
both hands in the same small patch in front of the body because it is the same wound.
A wide-brim hat is worth 1.9% of a body at this rig size (measured earlier the same
day), so small geometry does not read at all. Motion does:
    pour     6 of 12 keyframes with the hand STOPPED, 0 reversals -- nothing else
             in the game stops, so the stillness IS the read
    inject   peak 6.0px in ONE keyframe, the fastest single move of the three
    tweeze   7 direction reversals -- the only thing in the game that trembles

*** THE PART EVERY LANE THAT AUTHORS A CLIP NEEDS: THE POSE GRID IS 12 KEYS PER BAR
(POSEHOLD.keys). *** Four defects here read perfectly and measured wrong:
 1. THE WOUND WAS OUT OF ARM REACH. Mid-thigh is 19.1px from the shoulder; the whole
    arm is 16px. A standing person cannot reach their own thigh, so solveIK clamped
    and the hand hovered at hip height doing nothing, for three clips at once. Moved
    to the forearm -- which is also the only site a long coat does not swallow, and
    long coats dominate this wardrobe.
 2. THE JAB WAS SHORTER THAN A KEYFRAME. 0.06 of a bar is less than 1/12, so the
    spike fell between keys and never rendered. Measured, the "fastest move in the
    set" was the slowest one in it.
 3. THE TREMOR WAS SAMPLED AT ITS OWN ZERO CROSSINGS. sin(2*pi*6*t) at t=i/12 is
    sin(pi*i) = 0 at EVERY key. The clip whose identity is that it shakes measured 9
    still keys out of 12. Use cos, or a frequency the grid can carry.
 4. TWO OF THE THREE NEVER RETURNED HOME, so the loop seam snapped once a bar and was
    the biggest hand move in both -- which also fooled the first version of my own
    gate into calling the snap "the fastest move".
RULES OF THUMB, now written into the record: shortest expressible move is 1/12 of a
bar; land ramps ON key boundaries; a looping clip must return to its start pose.

*** AND A REPO-WIDE FINDING THAT IS NOT MINE TO FIX. *** I ran the loop-closure check
over every clip in the game as information: 31 DO NOT CLOSE. drunk 11.0px, deadeye
5.7, cheer 5.0, run 3.2, dance 3.2, eat 3.0. Some of that is probably deliberate and
some is the same defect I just fixed three times. The gate REPORTS it and does not
fail on it, because those clips are not this session's work and a gate that goes red
on somebody else's file is a gate that gets switched off. Next lane in animation: the
measurement is already taken, you only have to decide.

WHAT COMES NEXT FOR THIS LANE, IN ORDER:
 1. RUN CONSUMES THESE CLIPS in the treat-wound sequence -- that is RUN's half of the
    same routing (ONE SYSTEM, ONE SESSION), and medkit_gate already records the
    treat-wound verb, the clip hook and the sound hook as deliberately absent here.
    Do not reach across for it.
 2. NOBODY IN THE WORLD WEARS THE THIRTEEN FACTION OUTFITS YET, and that is not this
    lane's call: FACTION_ASSIGN is empty and every agent is faction:null because WHICH
    FACTION HOLDS WHICH GROUND is his ruling. The fits are ready the day it lands.
 3. 2X IS STILL BLOCKED ON PAINTING, NOT CODE (records/BOHEMIA_2X_WHY_THE_RIG_STAYS_
    AT_56_8_16_26.txt). Two independent arguments for it now: headwear cannot carry
    identity at 56 (1.9% of a body), and the 12-key grid plus a small rig means fine
    motion has nowhere to live either.
 4. THE 31 CLIPS WITH OPEN LOOPS, if the lane wants a cheap sweep with a measurement
    already in hand.

CHARACTER (character-0lurbs): 8/18 (g) -- *** ALL THIRTEEN FACTIONS HAVE AN
OUTLINE OF THEIR OWN, AND HEADWEAR TURNS OUT TO BE WORTH ALMOST NOTHING.
BACKLOG ROW SIL IS CLOSED. TAB: CHARACTER, "THE THIRTEEN OUTFITS" (tap COLOUR OFF
to run the test yourself), and LOOK for the picture. ***
Record: records/BOHEMIA_THIRTEEN_OUTFITS_AND_WHAT_HEADWEAR_IS_WORTH_8_18_26.txt
Gate: gates/faction_outfit_gate.js, 18 claims, registered as OUTFITS 13.

NOT PICKED BY EYE, AND IT COULD NOT HAVE BEEN. The lever said the wardrobe holds
only about six shape classes above the floor -- nine long coats scoring 0.0446 to
four decimals are ONE shape in nine colours -- and there are thirteen factions.
Assigning thirteen fits on that evidence and hoping is how six factions ship looking
identical. So tools/bohemia_faction_fits.js searched: 880 candidate fits (5 bodies x
11 shoulder shapes x 4 heads x 4 legs), each rendered, each scored on the FRONT width
profile, greedy farthest-point pick for the biggest mutually-distinct set.

    floor 0.030 -> 19        floor 0.040 -> EXACTLY 13        floor 0.045 -> 11

The wardrobe delivers precisely what the game needs and not one spare. That also
killed my own "only six classes" reading: the classes MULTIPLY against body and legs.

*** THE FINDING ANY LANE CAN USE: HEADWEAR CANNOT CARRY IDENTITY AT THIS SIZE. ***
The 8/15 amendment names three channels -- garment shape, proportion, HEADWEAR. The
picture came back with the hats nearly invisible, so I measured them on the real 112
render instead of arguing with it:
    body, nothing on it   2961 px
    + wide-brim hat       +56   (+1.9%)      + long coat   +114  (+3.9%)
    + knit cap            +62   (+2.1%)      + road cape   +175  (+5.9%)
A WIDE BRIM IS WORTH 1.9% OF A BODY -- the weakest of the three channels by a factor
of three, and NO CHOICE OF HAT FIXES IT. It needs pixels. That is a direct argument
for row 2X (his 8/14 "twice as many pixels"): a 56px hat is 224px at 112-native, the
difference between a shape you can name across a street and a smudge. Re-search this
table with head classes weighted properly the day 2X lands.

TWO PROCESS LESSONS, BOTH PAID FOR IN THIS TURN:
 1. CHOOSE AND GRADE ON THE SAME RULER. The search scored buildFrame at 56 while the
    gate scored the 112 board WITH the one-pixel outline on it. Two rulers. A set that
    searched clean came back with pairs at 0.007 and I spent FOUR rounds adjusting
    individual fits -- fixing the target. The search now grades through drawChar, the
    function the board actually calls.
 2. BASE AND FEET ARE NOT FREE. The search held WHITE TEE / BROWN BOOTS fixed; real
    fits vary the shirt and the boot and both touch the outline (a hem, a shaft),
    worth about 0.005. So 0.040 was never a number thirteen DRESSED people could hold.
    The pin is 0.035 -- above the six-resident cast's own 0.030 ratchet and 2.6x the
    0.014 gap that actually failed. Do not ratchet it up without re-searching WITH
    base and feet varied.

AND IT IS AN INSTRUMENT, NOT A QUESTION. "What factions wear" is reserved to him by
name in the agents module, so under HE MUST BE ABLE TO DIRECT IT (8/12) he gets the
tool rather than a bolded ask: WEAR IT drops a faction's fit onto the player, the
WARDROBE directly below changes it, SAVE TO writes it back and it survives the phone,
EXPORT .TXT hands over the table, COLOUR OFF is the test in one tap. Every line is
draft:true. The gate fails if any of those controls goes missing.
The four social forces (Pures, Panthers, La Familia, Triads) deliberately have NO
outfit -- they are members INSIDE other factions and an outline of their own would
announce what the canon says is hidden. The gate fails if one ever gets one.

WHAT COMES NEXT FOR THIS LANE, IN ORDER:
 1. NOBODY IN THE WORLD WEARS ANY OF THIS YET, and that is not this lane's call:
    FACTION_ASSIGN is empty and every agent is faction:null because WHICH FACTION
    HOLDS WHICH GROUND is his ruling. The thirteen fits are ready the day it lands,
    and the binding is a small job when it does. Do not invent the assignment.
 2. 2X IS STILL BLOCKED ON PAINTING, NOT CODE (records/BOHEMIA_2X_WHY_THE_RIG_STAYS_
    AT_56_8_16_26.txt): doubling his rig mechanically makes the head a BOX, because
    Scale2x was manufacturing its roundness. The pixels have to be PAINTED at 112.
    The headwear measurement above is now a second, independent argument for it.
 3. A COOK BRIEF EXISTS AND IT IS EXACT: the outline is set at the SHOULDER LINE and
    the HEM. 34 of 202 garments carry the whole structural range. A new garment should
    occupy a silhouette nobody has -- not another colourway, and not another long coat.

CHARACTER (0lurbs): 8/2 (m) LATEST — HAIR IS 23 CANON. THE SIDE VIEWS ARE THE OPEN
WORK. READ THE MEASUREMENTS BELOW BEFORE TOUCHING genHair; I WASTED TWO BUILDS
GUESSING AT CAUSES I COULD HAVE MEASURED IN ONE COMMAND.

=== WHERE HAIR STANDS ===
23 canon styles, 0 pending candidates (he judged everything). Board shows ALL EIGHT
facings, 184 head shots. Export ends a ROUND: notes + thumbs clear, sheet archived,
file named _R<n>.txt.

HIS STANDING VERDICT ON THE SIDES, 8/2, still open:
  "you really aren't doing it from a good eastern west angle ... I know it's a
   first pass, but I wasn't impressed ... keep going you're not close."
Then after two more builds: "You doing better needs more work please continue."
IT IS BETTER, IT IS NOT DONE. Do not treat the sides as finished.

=== THE FOUR THINGS THAT WERE ACTUALLY WRONG (all found by MEASURING) ===
1. HAIR WAS GLUED TO THE SKULL OUTLINE. Every row clamped to span(y), which IS the
   skull, so hair was a skin-tight cap with no silhouette of its own on any facing.
   Research: in a side profile HAIR DRAPES WITHOUT FOLLOWING THE SHAPE OF THE HEAD.
   Fixed: the mass projects past the skull, piling at the BACK, held off the FACE,
   keyed to the face centroid.
2. A PATTERN DID NOT ROTATE WITH THE VIEW. Cornrows run front-to-back over the
   scalp: from the front you look ACROSS them (vertical stripes), from the SIDE you
   look ALONG them (horizontal bands). The phase was on X for all eight facings.
   Same bug's other face: a mohawk is a blade on the midline -- thickness from the
   front, LENGTH from the side. It was narrowed on every facing, so in profile the
   whole haircut collapsed to 1-2px. Fixed: phase on Y in profile; a strip in
   profile draws a CREST spanning the skull, ABOVE hTop (background rows, so put()
   accepts them -- widening it ACROSS the skull measured WORSE because put() refuses
   face pixels on a non-back facing).
3. A PARTING WAS A HOLE. The texture SKIPPED, so raw LIT skin showed between rows --
   max contrast, read as a comb. Fixed: a parting is the wearer's own skin TAKEN
   DOWN (scalp in a groove), which also honours his "not just straight the skin
   tone" ruling.
4. THE SIDE OF THE HEAD WAS BALD. sideBot stops the mass halfway down the skull so
   it cannot run over the eyes on a FRONT view. BACK was exempted on 8/1; PROFILE
   never was. MEASURED: facing E, CORNROWS occupied ROWS 5-6 AND NOTHING ELSE.
   I had publicly called this a "contrast problem" the build before, from a
   thumbnail. It was not. Fixed: profile joins back at full-skull coverage.

=== THE PROCESS LESSON, and it cost two builds today ===
TWICE I named a cause by eye from a thumbnail and was wrong both times. Reading the
actual pixels took ONE command and gave a different answer each time. Before
naming a cause in genHair, dump the pixel grid for that facing. There is a probe
pattern in the session scratchpad; it is ten lines.

=== KNOWN AND OPEN ===
- Cornrows in TRUE PROFILE: coverage is fixed, but whether the bands READ at 56px
  on a near-black ramp is UNJUDGED. He has not seen the 8/2m build yet.
- The strip-in-profile crest is new and unjudged.
- Clause 6 fade UNLOCK mechanism: [PENDING, HIS CALL] -- a fade is a luxury
  (laws/BOHEMIA_ADDENDUM_A_HAIRCUT_IS_A_LUXURY_8_1_26.md). Do not invent the economy.
- Names of the 23 styles: PARKED by him explicitly. Do not raise it.
- cough / whistle / search: frozen, two rejections each.

=== GATES THAT WENT RED AT HIM, SIX TIMES TODAY ===
hair_gate twice (batch size when he killed 13; board count when he approved 7),
craft_law_gate three times (pinned style name, empty candidate queue, pinned the
BROKEN centring and later the BROKEN half-fix), dress_gate once (counted a canon
token inside a COMMENT).
A GATE THAT PINS AN IMPLEMENTATION WILL DEFEND ITS BUGS. Pin BEHAVIOUR.
A gate that goes red because he exercised a verdict is the gate being wrong.

=== SHIP HYGIENE, learned the hard way ===
- `node gate.js | tail -1` in an && chain gives you TAIL's exit status. I pushed a
  red gate twice before switching to `node gate.js >/dev/null 2>&1 || exit 1`.
- The local checkout silently rolled back to a stale commit FOUR times today. If a
  file you know you wrote is missing: `git fetch origin main && git reset --hard
  origin/main` before believing it.
- main moves every ~10 minutes. Rebuild-on-main + replay beats rebasing the alpha.

CHARACTER (0lurbs): 8/1 (r) LATEST — HAIR WAVE 2 SHIPPED AND JUDGED WELL. CORNROWS
IS HALF-FIXED AND I STOPPED AFTER THREE ATTEMPTS. THE MEASUREMENT IS BELOW — DO NOT
GUESS AT IT AGAIN.

=== THE ONE THING TO PICK UP FIRST ===
Paolo 8/1: "The cornrows is not one pixel of skin two pixels of hair what's wrong
with you?" He is right. I claimed it fixed WITHOUT MEASURING THE FRONT VIEW.

MEASURED, facing S, CORNROWS, H=hair pixel / s=skin showing through:
    row  5   sHHsHHss          1 skin : 2 hair   CORRECT
    row  6   sHHsHHsHHs        1 skin : 2 hair   CORRECT
    row  7   sHHsHHsHHsHs      1 skin : 2 hair   CORRECT
    row  8   sHssssssssHs      ONE pixel. no ratio at all.
    row  9   sHssssssssHs      ONE pixel.
    row 10   sHssssssssHs      ONE pixel.

ROOT CAUSE, located exactly: genHair has TWO drawing paths. Above frontLine the
main mass loop runs and applies `tex` (the 2:1 rule). Below frontLine, on a FRONT
facing, control passes to the two-curtain branch:

    if(front&&y>frontLine){ ... for(xl=mn;xl<fs[0]+w;xl++) put(...); ... continue; }

That branch draws SOLID and never touches `tex` at all, and its width
w = max(1, round(span*0.22)) resolves to ~1px on a 12px head. So more than half
the visible cornrow from the front is a bare line with no rows in it.

MY THIRD ATTEMPT MADE IT WORSE and is NOT in the repo: I added a skip-function to
both curtains with a 3px floor, and the RIGHT curtain vanished entirely (the base
index I passed to the skip test was wrong). Reverted. Do not re-apply that shape.
The branch needs REWRITING so both paths share one texture function, not patching.

BACK view is already correct (sHHsHHsHH...). Only the front curtains are wrong.

=== WHAT SHIPPED AND IS GOOD ===
HAIR WAVE 2 (8/1k) -- his verdict on it: "OK, very good a lot better the hair".
  Backs now cover the whole skull (sideBot=hBot on back facings) + a nape taper.
  The bug: sideF was applied on EVERY facing, so from behind -- where there is no
  face to avoid -- the mass stopped at 62% of head height and left scalp bare.
  Also: deterministic edge wobble (no straight lines), strip centring (Math.round
  breaks .5 UPWARD and put every mohawk one pixel right, forever), long styles
  peek from the front.
13 KEEP / 13 KILL, all 13 kills in the graveyard with his words as post-mortems,
  killed in the FACTORY TOOL's payload too or a re-run resurrects them.
THE CROWD + ONE ID ONE WHOLE PERSON (8/1c): twelve citizens, 12/12 distinct heads.
FACING (8/1j): curDir was written in ONE place (the CLOTHES preview), so every
  garment rendered front-facing everywhere. Coats opened down his spine.
A SHOE HAS A HEEL (8/1q): genShoes read no direction; 18/18 identical -> 0/18.
THE EAR IS GONE (8/1p): the ONLY edit ever made to his painted rig, authorised in
  his words "Delete them yourself". 10 pixels, pins moved in the same commit.

=== HIS RULINGS THIS SESSION, ALL IN LAW ===
laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md  (gate: craft_law_gate.js, 28)
  Seven craft rules in his words. Clause 4 was AMENDED the same day: 2 hair : 1
  skin, superseding "just one pixel". BOTH wordings are on the page with the
  reason it moved -- 4a is the audit trail, do not tidy it away.
laws/BOHEMIA_ADDENDUM_A_HAIRCUT_IS_A_LUXURY_8_1_26.md
  Grooming is an ECONOMY. A fade needs clippers, power, and somebody to re-cut it
  every three weeks. A sharp fade is a RECEIPT, not a look. Unlock mechanism is
  [PENDING, HIS CALL] -- do not invent it.
records/HAIR_VERDICTS_WAVE1_8_1_26.txt   full verdict sheet + per-style quotes.

=== MISTAKES OF MINE WORTH NOT REPEATING ===
- I told him the identical heads needed NEW ART. False: NPCFactory had varied skin
  and hair since 7/2 and I was bypassing it. Zero new art was needed.
- I told him NO clothing generator was facing-aware. False: 12 of 13 were. My grep
  pattern was broken (d==='N' never matches dir==='N').
- I changed the hair texture from %3 to %2 on an over-reading of "just one pixel".
  The original was ALREADY RIGHT. He had to spend a turn correcting my regression.
- I said cornrows was fixed without rendering the front view.
  ALL FOUR ARE THE SAME FAILURE: claiming instead of checking.
- RIG CHECK caught four of my own citations naming things I never used.

=== [PENDING, PAOLO'S CALL] ===
1. The gameplay unlock for a fade (he said "maybe we can lock that behind some
   gameplay mechanics"). Clause 6 of the craft law is UNBUILT and gated as unbuilt.
2. Hair wave 3 -- only after he judges wave 2's rebuilt backs.
3. Names of the 13 surviving styles: PARKED by him explicitly. Do not raise it.
4. cough / whistle / search: frozen, two rejections each.

=== NOTE ON THIS SESSION'S ENVIRONMENT ===
The local checkout silently rolled back to a stale commit FOUR times. Work was
safe on the remote every time. If files you know you wrote are missing:
`git fetch origin main && git reset --hard origin/main` before believing anything.

CHARACTER (0lurbs): 8/1 (c) LATEST — THE CROWD + ONE ID, ONE WHOLE PERSON.
THE POPULATION REACHES THE SCREEN, AND LOOKING AT IT FOUND THREE BUGS EVERY GREEN
GATE HAD MISSED. THE THIRD ONE WAS A FALSE CLAIM I MADE ABOUT THE CODEBASE.

Paolo: "Awesome looking good. WE HAVE 11 months of forward motion work we need to
complete. Do what you have to do next and know what comes after do big brain online
research if you need to then execute."

=== THE GAP, MEASURED BEFORE BUILDING ===
The lane owned one painted rig, six body dials, 221 approved garments, 102 clips --
and NOTHING that turned them into a POPULATION. No seed, no per-agent body, no
per-agent outfit. A city shipping 296 lives was shipping 296 copies of the same man.
Every ingredient existed; the recipe did not.

=== WHAT SHIPPED ===
BOH_PERSONLOOK (engine/bohemia_personlook.js, inlined in the ONE alpha): a pure
function, id -> {body: six dial values, worn: an outfit}. Deterministic by
CONSTRUCTION (FNV-1a + murmur3 finalizer, salted per field, no Math.random anywhere)
so an NPC looks the same when you walk away and come back and across a save. A soft
bell, not a flat roll -- most people near the middle, a few not. The crowd range is
NARROWER than the editor range on purpose: the sliders exist so HE can push a body to
an extreme; a street should read as ordinary people, not a carnival. It holds NO
garment names -- reads the canon pool live, so anything he kills leaves the streets
automatically. Does not touch skin tone (his ruling), does not touch the rig (ONE
RIG 7/25), carries no sex term (FAT IS FAT 7/29).

THE CROWD BOARD (CHARACTER tab, under the wardrobe): twelve citizens drawn THROUGH
drawChar -- the real path, cache and all -- by installing each person's dials and
outfit and handing his own look straight back in a finally block. NEW CROWD walks to
the next twelve. AUTO-SPIN turns all of them. Still, not animated: twelve animated
bodies would churn 12 x 24 cache buckets a frame on his phone to answer a still-frame
question. NEVER buildFrame -- that is the side door SHUFFLE FIT fell through.

=== TWO BUGS THE BOARD FOUND THAT NOTHING ELSE DID ===
(1) THE DIALS WERE CORRELATED. Two of the first twelve came out with BYTE-IDENTICAL
bodies. Plain FNV-1a ends on (h ^ lastByte) * prime, and the low bits of a product
depend only on the low bits of its inputs -- ids differing only in the last character
cluster down there, and % 100000 reads almost entirely low bits. Real ids are
SEQUENTIAL (npc-0, npc-1 ...), the exact worst case. 64 sequential ids, distinct
values per dial: BEFORE height 31 belly 29 arms 24 shoulders 27 armLen 24 hips 17;
AFTER 59 / 64 / 60 / 59 / 63 / 60. 2000 sequential ids now give 2000 distinct bodies.
WHY THE GATE MISSED IT: it read "200 people give 188 distinct bodies" the whole time,
because distinct-as-a-TUPLE hides a dial that barely moves -- six dials only have to
disagree in ONE place. It now measures EVERY DIAL SEPARATELY on SEQUENTIAL ids.

(2) THE ENGINE SYNC CHECK WAS A PREFIX CHECK. It compared the first 400 characters,
which is the module's header comment. The hash fix landed at the BOTTOM of the file,
the alpha kept the old broken copy, and the check stayed green. A prefix comparison
is not a comparison. Now all 6,974 bytes, and tools/bohemia_personlook_sync.py owns
the inline so it is never a hand edit again.


=== THE THIRD BUG WAS MINE: A FALSE CLAIM, REPEATED IN FOUR PLACES ===
BOH_PERSONLOOK's header said "Nothing in the repo varies a person's appearance --
no seed, no per-agent body, no per-agent outfit." That went into the module, the
gate header, the commit message and the write-up. IT IS FALSE. NPCFactory has been
in engine/bohemia_engine.js since 7/2/26: seeded, deterministic, wired into the RUN
and the SLICE and the RANDOM CITIZEN button, and it varies SKIN TONE (his 9 locked
ramps) and HAIR COLOUR. Measured on 8 ids: 6 distinct skin tones, 5 distinct hair
colours. It has worked the whole time.

THE REAL GAP was two halves of one person, keyed by two different ids:
  NPCFactory      skin + hair; cannot vary body (predates the dials) or clothes
                  (reads only PD.layers, one option per slot)
  BOH_PERSONLOOK  body + clothes; does not touch skin or hair
Nothing ever handed them the SAME id, so no caller assembled a whole person.

AND THE FALSE CLAIM COST SOMETHING REAL. Because the board used only PERSONLOOK,
its twelve citizens shared one skin tone and one hair colour, and I wrote that up
to Paolo as "a CONTENT gap -- fixing it means cooking new art, which is your call."
It was not a content gap. It was me bypassing a working system, and it was one
green light away from spending his judgement on art nobody needed. WITHDRAWN.

THE FIX: the crowd asks NPC_FACTORY for the SAME id it asks PERSONLOOK for. One id,
one whole person. No new mechanism for skin or hair -- ENGINE SYNC LAW, the module
that already owns those fields keeps owning them. ZERO NEW ART. The board went from
one head shared by twelve to 12/12 DISTINCT HEADS.

WHY NO GATE CAUGHT IT: the crowd gate hashed the WHOLE SPRITE and read 12/12
distinct, because bodies and clothes differ enough to mask a region that never
changes at all. It now hashes the HEAD REGION SEPARATELY. A metric that averages
over the whole sprite cannot see a constant sub-region.

STILL TRUE, and it is a nice-to-have not a blocker: one painted haircut SHAPE and
one painted face SHAPE exist, so citizens differ in colour and complexion, not in
silhouette. More haircut shapes would help. It must not be sold to him as the thing
standing between this and a city, because that was the mistake.

=== GATES ===
PERSON LOOK (gates/personlook_gate.js, 19) — the function.
THE CROWD (gates/crowd_gate.js, 16) — the PIXELS, in a real browser: twelve canvases,
none blank, none identical, redraw byte-identical, NEW CROWD brings strangers, and his
own look + his own canvas come back untouched.
Both registered in the suite. Full suite green on a tree built from current main.

=== NOTE ON THE CROWD GATE'S OWN FIRST TWO RUNS ===
It failed itself twice on "it NEVER calls buildFrame" -- because the renderer's HEADER
COMMENT says "Never buildFrame". First fix stripped comments and STILL failed: the
captured block started mid-comment, so there was no opening slash-star for the
stripper to find. A comment stripper is only correct on a whole comment. Same family
as the person-look gate failing three checks against its own header. Documenting a
rule is not breaking it.

=== [PENDING, PAOLO'S CALL] ===
1. Do the twelve read as HIS people, or as one man in twelve coats?
2. Are the bodies too varied, not varied enough, or right?
3. Wear odds as shipped: outer 45%, head 30%, neck 22%, waist 18%, back 16%,
   hands 14%, gear 12%, face 10%. One line in the module, free to change.
4. EVERY CITIZEN HAS THE SAME FACE AND THE SAME HAIRCUT, and it is a CONTENT gap,
   not a code gap: the repo holds exactly ONE painted hair (hair/curtain-bob) and
   ONE painted face (facial/punk-face). PERSONLOOK varies bodies and clothes because
   there are 6 dials and 221 garments to vary; it cannot vary hair or face because
   there is nothing to choose between. From the neck down: twelve strangers. From
   the neck up: twelve of the same guy. Fixing it means COOKING NEW ART, which is
   his call, and it is the single biggest thing between this and a street that reads
   as a city.
5. Skin tone across a population: still deliberately untouched, still his ruling.
6. Carried forward, untouched: cough redo (2 rejections, frozen), whistle (34 px)
   and search (24 px) show the same chest bare-skin pattern cough had, far-hand
   depth on E/W, unbuilt slider ideas (leg length vs torso, frame/bulk, posture,
   neck length).

=== PROOF ===
records/PERSONLOOK_AND_THE_CROWD_7_31_26.txt (full write-up)
records/CROWD_BOARD_7_31_26.png (the twelve, as rendered)

=== PROCESS NOTE WORTH KEEPING ===
Main moved mid-flight. The rebase was resolved by taking MAIN'S ALPHA WHOLE and
replaying the idempotent tools onto it, then re-running the suite ONCE on that tree
-- not by running the suite before the rebase. A green from before a rebase describes
a tree that no longer exists; that is what killed the alpha earlier this week. Also
caught during the same resolution: restoring gates/bohemia_gates.py from my branch
would have DELETED SEVEN gates other lanes had added since. Took main's registry and
re-added only my two lines (+4).


CHARACTER (character-0lurbs): 8/18 (d) -- *** TWO OF THE SIX NEIGHBOURS
STILL LOOKED LIKE THE SAME PERSON, AND THE FIX WAS ALREADY IN THE WARDROBE.
TAB: LOOK, "THE SIX PEOPLE ON YOUR STREET" (the bottom row is the test), and
RUN, walk into a settlement. ***
Record: records/BOHEMIA_WHICH_CLOTHES_ACTUALLY_CHANGE_THE_SHAPE_8_18_26.txt

8/17 turned the six city residents from one body in six random tints into six
SHAPES. Five separated. The wide brim and the poncho sat 0.014 apart on the width
profile -- same person in greyscale -- and I spent FOUR attempts on dials and leg
swaps moving it about 0.01 each. That is the STOP PRODUCING tell, so I stopped
fixing the attempt and asked what I had skipped.

WHAT I HAD SKIPPED WAS REUSE-FIRST. I had tried maybe fifteen of the 202 canon
garments and was one step from cooking a new one. tools/bohemia_silhouette_lever.js
now ranks the WHOLE wardrobe by how much each single garment moves the outline, in
the exact metric the cast gate scores by, so every number is comparable to the gap:

   front    back  layer    garment
  0.0528  0.0000  back     SHOULDER MANTLE
  0.0446  0.0568  outer    WASTELAND DUSTER (and 8 other long coats)
  0.0303  0.0199  back     ROAD CAPE
  0.0238  0.0227  head     CHINESE RICE FARMER HAT
  168 OF 202 MOVE THE FRONT BY LESS THAN 0.014.

THREE THINGS OUT OF IT, AND TWO ARE REUSABLE BY ANY LANE:
 1. THE MANTLE MOVES THE OUTLINE FOUR TIMES MORE THAN THE GAP I COULD NOT CLOSE,
    and it was sitting in the wardrobe the whole time. One swap took the closest
    pair 0.014 -> 0.04. The cook I nearly did would have been pure waste.
 2. I HAD BEEN MEASURING THE WRONG DIRECTION. The RUCK PACK I gave a resident
    specifically to break his outline scores 0.0000 FROM THE FRONT. A back item
    cannot separate people walking toward you, which is how you meet a stranger.
    Any lane doing silhouette work: score the FRONT, or you are scoring nothing.
 3. THE WARDROBE IS MOSTLY RECOLOURS -- 34 of 202 pieces carry the structural
    range of the game. That is the measured shape of STRUCTURE-NOT-COLOR, and it
    says a new garment cook should aim at a silhouette nobody occupies.
Pins ratcheted 0.010->0.030 and 0.070->0.085 so this cannot regress quietly.
city_cast_silhouette_gate.js 6/0, mean spread 0.070 -> 0.093.

*** AND THE LOOK RED THE PEOPLE LANE HANDED BACK IS CLEARED AT THE ROOT. ***
They were right that no lane could clear `border-one-pixel`, and right not to
weaken the check to go green. But the cause was not the ruler: THE SHOOTER READ
ITS INPUTS FROM records/2x/before/*.png AND records/2x/border/*.png, WHICH ARE
NOT IN THE REPO. It was a tool that worked exactly once, on the machine that made
those captures. tools/bohemia_border_picture.js now shoots the LIVE alpha in one
page load and has no input outside the repo:
    BEFORE  buildFrameCached(d,clip,ph,false) -> Scale2x   (outline baked at 56,
                                                            so Scale2x doubles it)
    AFTER   buildFrameCached(d,clip,ph,true)  -> Scale2x -> applyCharOutline at 112
That BEFORE line is the old renderer rebuilt from the parts the current one still
has -- the `_noOutline` argument exists because the outline pass was lifted out of
the composition -- so it is not a second drawing path that could flatter the shot.
Retaken, 75.9 KB, 3 facings, and the difference reads at a glance.
AND THE GATE NOW TELLS YOU HOW: every shot records a `shooter` in the manifest and
look_gate prints the exact command next to any picture it calls stale. The verdict
is unchanged; the message stopped being a dead end.
   IF border-one-pixel GOES STALE ON YOUR SHIP:  node tools/bohemia_border_picture.js
   IF six-neighbours GOES STALE:                 node tools/bohemia_city_cast_picture.js
It will keep going stale, because it is clocked against the alpha and every lane
edits the alpha daily for the build stamp. That is now a 40-second command instead
of an unclearable red, which is the right cost. A content-aware ruler (clock a
picture against the CODE REGION it photographs, not a 20 MB monolith's mtime) is
the real answer and is unbuilt -- it is a LOOK/shared job, not a character one.

WHAT COMES NEXT FOR THIS LANE, IN ORDER:
 1. FACTIONS BY SILHOUETTE -- the second half of backlog row SIL, and the city
    cast is the worked example. RUN THE LEVER FIRST and assign from the top of
    the ranking; do not start from dials. Needs the greyscale gate generalised
    from six residents to N factions.
 2. 2X IS STILL BLOCKED ON PAINTING, NOT ON CODE. The flip is built, proved
    lossless and deliberately dormant at RIG_RS=1
    (records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt): doubling his rig
    mechanically makes the head a BOX, because Scale2x was manufacturing its
    roundness. The pixels have to be PAINTED at 112. That is content and it is
    his call when.
 3. The lever's own finding is a cook brief: 34 of 202 garments carry the shape
    range. A silhouette nobody occupies is worth more than any recolour.

CHARACTER (character-0lurbs): 8/17 -- *** THE BORDER RULING IS FINISHED ON
EVERY SURFACE, AND 2X IS NOW A PAINTING PROBLEM, NOT A CODE ONE. READ BOTH. ***

SHIPPED THIS SESSION (all live, all gated, all mutation-tested):
 1. THE BORDER IS ONE PIXEL -- everywhere a person is drawn. CHAR_OUTLINE always
    drew ONE and was always correct; it just ran BEFORE the Scale2x that takes the
    frame to 112, so his border arrived DOUBLED. Moved the pass to after the
    upscale. drawChar + bake112 (COMBAT) on 8/16.
    AND THE GAME WAS STILL DOUBLING IT AFTER THAT -- caught 8/17. The city scales
    bodies on an integer ladder (EPX x2 at the default walk zoom HC=44, x4 past 64)
    so the border baked in at 56 reached the screen 2px, and 4px zoomed in. Fixed
    at the same seam: bake56 gained an OPT-IN borderless flag (the CITY asks; the
    legacy RUN bridge does NOT and keeps what it had), and CITY_WORLD got one
    shared spriteAt() that scales for the tier and borders once, cached.
    Measured 2->1 at walk zoom, 4->1 zoomed in.
    laws/BOHEMIA_ADDENDUM_THE_BORDER_IS_ONE_PIXEL_8_16_26.md
    Gates: border_gate.js (6/0), city_border_gate.js (11/0, SELF-CALIBRATING -- it
    measures the OLD behaviour with the SAME ruler, so the claim is a comparison
    and not a threshold somebody picked; I had it on ">=85% of rows" reading 79%
    and did NOT lower it).
    TAB: CHARACTER for the workbench, and RUN/CITY/COMBAT for the game.
 2. THE BACK OF HIS HEAD WAS NEVER MISSING ART. Two gates spent weeks demanding a
    FACE ON A SKULL and every handoff filed it as a debt HE owed. NE/N/NW carry a
    92px head against 24-31 on the front views -- rear three-quarters. Both gates
    fixed; the face carve-out must EARN itself by proving a double-mass skull, so it
    cannot be bought by deleting art. 8/0 mutation-tested.
    records/BOHEMIA_THE_BACK_OF_HIS_HEAD_WAS_NEVER_MISSING_8_17_26.txt
 3. A DEV STATUS LINE WAS ON THE PLAY SURFACE. "rig sync: waiting for a rig edit"
    sat above the day card in the game. NOT a tab bug: #syncBadge lives OUTSIDE
    #stage so it renders on all sixteen tabs by construction. It now says nothing
    at rest and still flashes on a rebuild. gates/play_surface_clean_gate.js checks
    THE BAND, not the badge, so the next one is caught whatever it is called.
 4. THE GATE SUITE COULD NOT RUN AT ALL ON MAIN -- twice in one day a GATES row
    landed with 3 fields instead of 4 (INSTRUMENTS, then VERDICT FROZEN), and the
    runner UNPACKS rows, so one bad row killed all 362 for every lane with a
    traceback naming no gate. Fixed both + the table now checks itself and NAMES
    the row. Mutation-tested.

*** 2X: BUILT, PROVED, DELIBERATELY OFF -- DO NOT JUST TURN IT ON. ***
Steps 1-3 are in the file and dormant at RIG_RS=1 (RIG2X doubles his rig losslessly
-- halve it back and his pixels return byte for byte; 23 seams; every one the
IDENTITY at RIG_RS=1, proved on 96 frames, 96/96 byte-identical).
    python3 tools/bohemia_2x_flip.py --flip     (and --unflip, byte-identical)
IT IS OFF BECAUSE AT 112 HIS HEAD RENDERS AS A BOX. His art holds 56x56 of
information; doubling invents none, and Scale2x was not merely enlarging, IT WAS
ROUNDING THE CORNERS -- a large part of that head's roundness was never painted.
Composing natively removes it, straight into the LOCKED 8/1 "no straight lines".
Doubling the rig with Scale2x instead reshapes his art (RIG LAW) and kills the
round-trip proof. TWICE THE PIXELS MEANS PAINTING AT 112. The backlog's CHARACTER
2X row is AMENDED 8/17 with all of this -- read the amendment, not the original
plan, which says "nothing regresses" and is disproved.
    records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt

THE LANE HAS ZERO REDS. Verified on the shipped tree: border 6/0, city border 11/0,
play surface 4/0, chin law 10/0, parts painted 23/0, bodyvar 41/0, char outline
35/0, neck tone 58/0, clothes follow 63/0, frozen poses 29/0, anim fabrication 26/0,
rig is law 12/0, rig check 187/0, family cast 26/0, family anim 13/0, worn persist
5/0, engine sync zero drift.

I CROSSED INTO CITY_WORLD for the border, and say so plainly: the border law and the
player sprite are this lane's, the eight lines that scale and blit that sprite are
where the law was breaking, and the halves cannot land separately (borderless art
with no border pass = no outlines at all). One commit, one gate, and the residents
share the same helper so nobody could silently lose an outline.

*** THE WORKING COPY STILL REVERTS BETWEEN TURNS. It happened again this session
(HEAD came back at 968 while origin/main was at 1042). The local origin/main ref
lies too, so every "am I current?" check agrees with itself. RESYNC FIRST and treat
any measurement taken before it as VOID:
    SHA=$(git ls-remote origin main | cut -f1)
    git fetch --force --no-tags origin main
    git update-ref refs/remotes/origin/main $SHA
    git checkout -f -B claude/character-0lurbs origin/main ***

CHARACTER (character-0lurbs): 8/16 -- *** THE BORDER IS ONE PIXEL. AND 2X IS
NOT A CODE PROBLEM ANY MORE -- IT IS A PAINTING PROBLEM. READ THAT SECOND PART. ***

SHIPPED: his 8/14 "the black border has to be thinner, like half as thin", measured
2px -> 1px against skin on all 8 facings, with 0 of ~18,000 non-border pixels
changed. CHAR_OUTLINE was ALWAYS drawing one pixel and was always correct; it just
ran BEFORE the Scale2x that takes the frame to 112, so his border arrived doubled.
The pass moved to after the upscale. COMBAT too (bake112) -- fixing only drawChar
would outline him 1px in CHARACTER and 2px in COMBAT.
  Law:  laws/BOHEMIA_ADDENDUM_THE_BORDER_IS_ONE_PIXEL_8_16_26.md
  Gate: gates/border_gate.js  6/0, MUTATION-TESTED (put the pass back before the
        upscale and it reports 2px on all 8, which is exactly the old build).
  TAB: CHARACTER. Also visible anywhere a person is drawn -- RUN, CITY, COMBAT.

*** 2X: BUILT, PROVED, AND DELIBERATELY OFF. DO NOT JUST TURN IT ON. ***
The renderer can compose natively at 112 today: RIG_RS (one scalar off BAKED),
RIG2X() (the load-time doubler, PROVED lossless and exactly invertible on his real
rig -- halve it back and you get his pixels byte for byte), and 23 seams. PD layers
stay 24-grid, all 258 CLO garments stay 56, both block-stamp at their seam; not one
garment was touched. Every seam is the IDENTITY at RIG_RS=1 and that was PROVED --
96 frames captured before and after, 96/96 byte-identical.
    python3 tools/bohemia_2x_flip.py --flip     (and --unflip)

IT IS OFF BECAUSE AT 112 HIS HEAD RENDERS AS A BOX. Flat-sided hair, a jaw that
drops straight down with no taper. His art holds 56x56 of information and doubling
invents none; what ALSO vanishes is that Scale2x does not merely enlarge, IT ROUNDS
DIAGONAL CORNERS, and a large part of that head's roundness was never painted -- it
was manufactured by the upscaler in every build he has ever approved. Composing
natively removes it, straight into the LOCKED 8/1 law "no straight lines (hair is
little off shapes)".
THE TEMPTING WRONG FIX is to double the rig with Scale2x so the rounding bakes in.
That RESHAPES HIS PAINTED ART (RIG LAW) and destroys the round-trip proof that makes
the doubler legal at all. Do not.
THE REAL ANSWER: twice the pixels means PAINTING AT 112, not upscaling to it. The
pipeline is ready the day the art exists.
  Full finding, with every measurement: records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt

FOUR GATES READ 56 INTO A 112 WORLD AND ALL FOUR WERE RULERS, NOT DEFECTS -- a hard
`* 2` from rig space to render space (reads at 224, returns null, reports "the head
has no edge"); a scan loop stopping at x<56 (walks off the face, reports the skin
HALF as wide); an edge test comparing two halves of ONE doubled pixel (the tell was
EXACTLY 20/40); and CHIN LAW B's "one row" cap, which is a DEPTH he ruled on a
56-tall face, not a row count. All re-blessed via tools/bohemia_2x_gate_rebless.py
and EVERY ONE re-run at 56 first, where it had to return the identical verdict AND
the identical numbers. It did. A ruler fix that changes an old verdict is not a
fix, it is a relaxation.

*** CLOSED 8/17, AND IT WAS NEVER HIS: NE and NW have no face because THEY ARE THE
BACK OF HIS HEAD. Measured -- NE/N/NW carry a 92px head against 24-31 on the front
views, three times the mass, a whole cranium with no features -- and rendered all
eight facings and looked: the face turns toward you through S/SE/E and away through
NE/N/NW. Both gates were demanding all twelve parts on all eight facings (bodyvar
derived its required set from SOUTH, the facing with the MOST face). Fixed, and the
face carve-out has to EARN itself by proving a rear view with a double-mass skull,
so it cannot be bought by deleting art. parts_are_painted 23/0, bodyvar 41/0.
Do not re-file this as a debt he owes.
records/BOHEMIA_THE_BACK_OF_HIS_HEAD_WAS_NEVER_MISSING_8_17_26.txt ***

*** THE WORKING COPY STILL REVERTS BETWEEN TURNS -- it happened AGAIN this session
(HEAD came back at 968 commits while origin/main was at 1042), and the local
origin/main ref lies too, so every "am I current?" check agrees with itself.
RESYNC BEFORE TOUCHING ANYTHING and treat any measurement taken before it as VOID:
    SHA=$(git ls-remote origin main | cut -f1)
    git fetch --force --no-tags origin main
    git update-ref refs/remotes/origin/main $SHA
    git checkout -f -B claude/character-0lurbs origin/main
Last session's final green sweep was measured on a stale 968 tree and was void; it
was re-run clean this turn. ***

CHARACTER (character-0lurbs): 8/15 -- *** 2X IS FULLY PREPPED. THE FLIP HAS NO UNKNOWNS
LEFT. *** Steps 1-4 still NOT applied (they land together or not at all).

DONE AND PROVED THIS SESSION:
  tools/bohemia_rig_double.js 10/0, mutation-tested -- the rig (56->112, 5,248 px -> 20,992,
    240 joints) AND garments/hair (45 layers, 7,526 -> 30,104, G24 [16,3] -> [32,6]), each
    with its own ROUND-TRIP proof: halve it back and it must equal his originals exactly.
    That is what makes RIG LAW safe BY CONSTRUCTION rather than by promise.
  ANIMATION NEEDS NO DOUBLING -- the clips are functions returning ANGLES, not keyframes. 61
    clips, zero work. THE ONE TRAP: headBob (ALPHA:3023) is literal `bob = -1`/`1` pixels;
    at 112 that is HALF the physical breathing, so it MUST become 2 or the characters
    quietly stop breathing.
  MEMORY CLEARED -- records/BOHEMIA_2X_MEMORY_MEASURED_8_15_26.txt. The cache already stores
    112 frames today (G.hd defaults true), so it does not grow. HD_CACHE.max stays 768.
  THE GATE RE-BLESS IS ENUMERATED -- records/BOHEMIA_2X_GATE_REBLESS_CHECKLIST_8_15_26.txt.
    Four classes, swept against the real files:
    (A) 56 AS A STRIDE (i*56, i/56, i%56) -- THE DANGEROUS ONE: at 112 it silently addresses
        the WRONG PIXEL and the gate keeps reporting numbers. structure_gate x22 (first),
        neck_tone x2, combat_lab x1. READ each site; a blind s/56/112/ also hits row indices
        and prose.
    (B) 56 declared as the rig size, mechanical: acc, anim_fabrication, bodyvar,
        clothes_follow, hat, hood, open_coat, parts_are_painted, people, structure.
    (C) canvas_scale_gate's NINE pinned surfaces: double AND stay integer on the CONTENT box
        (box-sizing means the declared width includes its border -- the 8/6 lesson).
    (D) RATCHETS TO RE-PIN, NEVER RELAX: head_follows_rig PINNED_TOTAL 14 / WORST 3 are
        56-space pixels and read double at 112.

THE FLIP, ONE COMMIT: apply doubleRig to BAKED + dblPDLayer to every PD layer + G24 x2;
headBob 1 -> 2; Scale2x OFF (where the sharpening comes from, and it HANDS BACK CPU because
Scale2x currently runs only to manufacture the 112 the cache already stores); outline derived
at 1px (his "half as thin", free); then the four gate classes above.
THE JUDGEABLE: a side-by-side of the SAME character before/after at the SAME display size,
and the thinner border is the thing to look at.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/15 -- 2X STEP 1+2 IS BUILT AND PROVED. NOT YET APPLIED,
DELIBERATELY. tools/bohemia_rig_double.js (6/0, mutation-tested).

Doubles a BAKED-shaped package: one painted pixel -> a 2x2 block, and EVERY coordinate x2
(skeleton + pose). Run on his real rig:
    56 -> 112x112 | 8 facings | 96 part lists | 5,248 painted pixels -> 20,992 | 240 joints

*** THE ONE CLAIM THAT MATTERS IS PROVED, NOT ASSERTED. *** RIG LAW says his painted regions
are sacrosanct. The migration is safe under that law ONLY because the transform is lossless
and exactly invertible. So the tool HALVES ITS OWN OUTPUT BACK and requires byte-identical
equality with what went in, on every part of every facing. Mutation-tested both ways: nudge
one pixel by one and two assertions fail; stop doubling the coordinates and one fails.

*** WHY IT IS NOT APPLIED YET, AND DO NOT "JUST TURN IT ON". *** The ruling is explicit that
steps 1-4 land TOGETHER (double pixels, double coordinates, Scale2x OFF, 1px outline) and
that the result is "everything looks the same but sharper". A HALF-MIGRATED RIG DOES NOT LOOK
WORSE, IT LOOKS LIKE GARBAGE: doubled art bound to joints at half their true position. The
flip is one commit or it is not a flip.

WHAT STEP 2 STILL OWES, named so nobody thinks this file covered it: garment/hair anchors
(PD layers on the 24-grid + G24_OX/OY offsets) and animation keyframes live in other
structures. Same treatment, same round-trip proof, same commit as the flip.
ALSO IN THAT COMMIT: re-bless the ~18 scale/rig gates on doubled numbers (every declared
width doubles and must stay INTEGER ON THE CONTENT BOX -- the 8/6 lesson -- hair picker tiles
and the 8-facing spin bar included). A GATE MUST NEVER OUTRANK A RULING: re-bless with a
comment naming his ruling, never delete a check.
MEMORY IS ALREADY CLEARED: records/BOHEMIA_2X_MEMORY_MEASURED_8_15_26.txt -- the cache
already stores 112 frames today (G.hd defaults true), so it does not grow. HD_CACHE.max
stays 768.

--------------------------------------------------------------------------------
CHARACTER (character-0lurbs): 8/15 -- 2X's MEMORY PREREQUISITE IS MEASURED AND
CLEARED. THE MIGRATION IS UNBLOCKED AND HAS NOT BEEN STARTED.

The cast is done and he signed off ("OK, it's looking good. We have other things we need to
do"), so I popped this lane's top backlog item: 2X — TWICE THE PIXELS ON THE PEOPLE (Paolo
8/14, LOCKED). It orders a measurement BEFORE anybody touches the rig, and that measurement
is this turn's work. records/BOHEMIA_2X_MEMORY_MEASURED_8_15_26.txt.

*** IT DOES NOT COME BACK TIGHT, AND THE REASON DECIDES THE MIGRATION. ***
`G.hd` DEFAULTS TRUE. drawChar ALREADY upscales every frame 56->112 through Scale2x before
caching it, so THE FINISHED-FRAME CACHE IS ALREADY PAYING THE 112 PRICE TODAY.
    HD_CACHE entry, before the migration:  112 x 112 x 4
    HD_CACHE entry, after  the migration:  112 x 112 x 4      <- identical
    at full cap (768): 36.8 MB either way | headroom under the 224 MB iOS ceiling: 187.3 MB
    warmed and measured: HD_CACHE 524/768 = 25.1 MB, FRAME_CACHE 578/768 = 13.8 MB
What actually grows 4x is the per-frame BAKE working set (buildFrame on a 112 part grid,
0.04 -> 0.16 MB), and that is TRANSIENT -- scratch for one frame, freed before the next,
never accumulating into the ceiling.
NO CACHE BUDGET CHANGE NEEDED. HD_CACHE.max stays 768.
AND IT CONFIRMS THE ITEM'S OWN STEP (3) FROM THE SAME FACT: Scale2x runs on every cold frame
purely to manufacture the 112 the cache already stores, so turning it off DELETES work.
HONEST LIMIT: desktop Chromium, not his phone. But it is an ARITHMETIC result -- entry size
is w*h*4 and the cap is a constant -- so the before/after equality holds on any device. No
live iOS reading is claimed.
CACHES WARMED ON PURPOSE (12 clips x 8 facings x 4 phases through the real drawChar). A cold
cache reports a comfortable number that means nothing.

STEPS 1-4 NOT STARTED, DELIBERATELY. A half-migrated rig breaks every body in the game, and
the item is explicit that 1-4 ship together and step 5 must never be mixed in. NEXT IS STEP
(1) ALONE: his painted pixels double EXACTLY, each pixel -> a 2x2 block. Lossless, no
interpretation, which is how RIG LAW's sacrosanct regions stay intact BY CONSTRUCTION.

SHIPPED EARLIER TODAY AND GREEN: FAMILY ANIM 13/0 (all four cast members animate on the
shared 120 BPM clock, full 102-clip picker), FAMILY CAST 26/0, WORN PERSIST 5/0, CHIN LAW
10/0.

--------------------------------------------------------------------------------

*** FLAG FOR THE RUN LANE (from ART, 8/15): run_gate.js IS RED ON MAIN and it
is the COLD OPEN. Proven on a clean origin/main worktree (8c2c320): alphaRun's
tapStep cannot reach the D-pad - first #syncBadge intercepted the click (fixed
in this ship: pointer-events:none, a status line should never eat taps), and
under that the opening overlay still blocks the run panel, "<div id=app>
intercepts pointer events". The gate dismisses the OLD splash; the new cold
open needs its own dismissal step (or the overlay needs pointer-events
handling when done). Your feature, your gate reconciliation - every lane's
full-suite run is red until then. ***

CHARACTER (character-0lurbs): 8/11 -- *** THE FAMILY MOVES. HE APPROVED THE CAST. ***

PAOLO: "The family is looking good. I fuck with it heavy if I could see them do animations that
would be awesome."
NOTES ARE RULINGS -- the cast is APPROVED, and the one thing he asked for on top of it shipped
the same turn. All four members animate on the character screen, with a picker carrying the
FULL canon CLIPS list (102) so he can watch the family do anything in the game.
tools/bohemia_family_anim_patch.py. GATE: FAMILY ANIM (gates/family_anim_gate.js) 13/0,
registered, mutation-tested (remove the tick and seven assertions fail).

*** BAKED STRIPS, NOT LIVE REPAINTS, AND THIS IS THE PART TO NOT UNDO. *** famPaintBody calls
rebuildFromRig() -- it has to, because a cast member is not the player and her dials and age
reach the renderer ONLY through it -- and that is four full rig rebuilds per frame at 60fps.
So each member's loop is baked ONCE into finished canvases and the render loop just blits.
Rebuild is paid on a clip or facing change, never per frame.

*** ONE CLOCK. *** 120 BPM LAW. The render loop already computes
(now - t0)/(BEAT_MS * ANIMBEATS[clip]) % 1 for the character box; the cast reads THAT phase in
THAT loop. A private setInterval for the family would be a second clock and two clocks drift.
The gate checks this structurally, because "is there a second timer" is not a question a
screenshot can answer.

THE PICKER SHIPPED WITH ONE OPTION AND I ONLY CAUGHT IT BY COUNTING. `CLIPS` is a top-level
const, so `window.CLIPS` is undefined and my `|| ['idle']` fallback won SILENTLY -- the select
rendered, looked right, and offered exactly one clip. Measured options=1, fixed, now 102. Same
family of bug as the `gdir` temporal-dead-zone read earlier today: a guard that swallows the
failure and leaves something plausible on screen. COUNT THE THING, do not look at it.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- *** THE DEMO CAST WAS WEARING THE PLAYER'S
CLOTHES UNDERNEATH THEIR OWN. AND THE "BARE LEG" BUG NEVER EXISTED. ***

famPaintBody borrowed G_WORN for each member and left G.equipped alone, so every cast member
also wore the PLAYER'S PD DEFAULTS -- leather legwarmers, balenciagas, the cowl hoodie. Two
wardrobes, both on, at once. MEASURED on the cast cards, pixels of the player's default
garment ramps:
    BEFORE   FATHER 72 | MOTHER 40 | BROTHER 320 (10% of him was the player's hoodie) | SISTER 154
    AFTER    0 | 0 | 0 | 0
tools/bohemia_cast_wardrobe_patch.py. `body` and `facial` are NOT cleared -- they are not
garments, they are the person; clearing them paints a skinless mannequin.

*** AND THAT SOLVES THE "bare shin paints the dark under-body 31,31,36 instead of skin"
REPORT THAT HAS BEEN IN THIS HANDOFF FOR DAYS. THERE WAS NO RENDERING BUG. *** Strip BOTH
wardrobes and the legs render 175/175 skin and the arms 85/85 -- the renderer was innocent
the whole time. 31,31,36 and 20,20,25 are entries of the pants/leather-legwarmer ramp. The
shin was correctly painting a garment nobody realised was still on.
CONSEQUENCE: family_cast_gate's "every member wears a LEG garment" rule was a WORKAROUND for
a bug that did not exist, and it quietly banned a bare-legged cast member -- a kid in shorts,
anybody -- from the demo. REMOVED, and replaced with the real invariant: a cast member has
ZERO pixels of the player's PD garments on her. Mutation-tested: revert the fix and all four
members fail.

MY PROBES WERE WRONG TWICE ON THE WAY HERE and both are worth knowing:
  1. First "bare leg" probe stripped pants+shoes but left the SHIRT AND JACKET on, so the
     "bare arm" I measured as 3/85 skin was a SLEEVE. Control for every layer, not the one
     you are thinking about.
  2. Then I "verified the fix" with a probe that drove drawChar directly and set G_WORN
     itself -- it never called famPaintBody, so it was re-running the OLD behaviour and
     reported no change. A probe that does not go through the code you changed cannot test
     the code you changed.

GATE: FAMILY CAST 26/0 (was 23), carrying the new assertion.

STILL TRUE, READ IT: the working copy REVERTS BETWEEN TURNS (four times 8/11). Resync with
`git ls-remote origin main` before touching anything -- the local origin/main ref lies too.
Full procedure is further down this file. Treat any measurement taken before a resync as
void; two of mine were.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- *** THE CLOTHES HE PUTS ON NOW SURVIVE A
RELOAD. THE CLO WARDROBE WAS IN NO SAVE AT ALL. ***

TWO WARDROBES, ONE OF THEM SAVED:
  G.equipped  the PD layer slots (body/facial/shirt/pants/shoes/hair) -- in
              PERSIST.snapshot() since forever
  G_WORN      the CLO catalogue, 258 garments / 236 st:'canon', everything the clothes tab
              and SHUFFLE FIT put on him -- IN NO SAVE AT ALL
Measured boot to boot: SHUFFLE FIT works, survives a tab round-trip, comes back {} after a
refresh. He dressed the character and got the default PD layers back every time.
frameLookHash has carried G_WORN since 7/31 ("putting on a red shirt changed the frame"), so
the RENDERER knew about that wardrobe for weeks. ONLY THE SAVE DID NOT.
FIXED: tools/bohemia_worn_persist_patch.py -- snapshot() carries `worn`, restore() replaces
it. GATE: WORN PERSIST (gates/worn_persist_gate.js, registered), driven through the real
button and a REAL page reload in ONE browser context.

*** MY OWN PROBE LIED TO ME TWICE ON THIS ONE ITEM, both times the same way. ***
  1. "GARMENTS = 0, the wardrobe never reaches the character" -- measured on a STALE TREE
     (see below). On the real alpha it is 258. A dramatic false finding I nearly reported.
  2. "the save carries the fit, the restore drops it" -- I searched the saved blob with
     /SLATE|HENLEY|BOOTS|JACKET/i and it HIT. What it matched was
     `jacket/japanese-fuzz_hoodDown`, a PD slot value, because "JACKET" is a substring.
     A LOOSE REGEX OVER A SAVE BLOB IS NOT A MEASUREMENT. Reading snapshot() settled it.

AND A GATE ASSERTION OF MINE COULD NOT FAIL, SO I DELETED IT. I wrote a "restore REPLACES,
never merges" check; mutation-testing the merging version PASSED, because on a page load
G_WORN is empty before restore runs, so merge-into-{} and replace-{} are the same operation.
The replace is still correct defensive code and stays; it is simply not observable through
the real surface. A gate that cannot fail is worse than a missing gate -- it reads as
coverage. Mutation-tested what remains: drop `worn` from snapshot() and the gate goes red.

*** THE WORKING COPY REVERTS BETWEEN TURNS -- FOUR TIMES TODAY. READ THIS FIRST. ***
HEAD comes back as c5d4dc6 (134 commits) and the LOCAL origin/main ref reads the SAME stale
SHA, so every "am I current?" check agrees with itself and lies. The reflog in that state
contains commits from OTHER sessions on this same reused branch name and NONE of the current
session's work -- that is how you identify it in one command. THE REPAIR, every turn, before
touching anything:
    SHA=$(git ls-remote origin main | cut -f1)      # the ONLY honest source
    git fetch --force --no-tags origin main         # brings objects even if the ref update
                                                    # loses a lock race to a parallel fetch
    git update-ref refs/remotes/origin/main $SHA
    git checkout -B claude/character-0lurbs origin/main
NEVER COMMIT FROM THE STALE STATE -- it would destroy ~780 commits of fleet work. And treat
every measurement taken before the resync as void; two of mine were.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- THE OVERWORLD FACE SIZE DIAL IS DEAD BY HIS
VERDICT. THE CHIN WORK STAYS AND IS LAW.

PAOLO: "well spin back on the overworld face shit u turned me off."

KILLED, with the tokens in the registry so nobody re-cooks it: BOH_SPRITE_FACE and
spriteFaceScaled are graveyarded, the knob is out of the alpha, and
gates/sprite_face_scale_gate.js + tools/bohemia_sprite_face_strip.js +
tools/bohemia_sprite_face_scale_patch.py are deleted.
POST-MORTEM: records/POSTMORTEM_OVERWORLD_FACE_SIZE_KILL_8_11_26.txt.

WHY IT DIED, AND THE FAILURE IS MINE NOT THE DIAL'S. He asked for it and the measurement
backed him -- his whole face out there is six pixels of eyes, three of nose and a TWO PIXEL
mouth. But each eye is 2px with EXACTLY ONE pixel between them on a ~10px head, so x1.5
changed ZERO rendered pixels and x2 fused the two eyes into one bar. THE HONEST ANSWER WAS
ONE SENTENCE -- "the geometry cannot do this, it needs a repaint" -- and instead I built the
dial, the gate and a four-column contact sheet and handed him a menu of options I already
knew were bad. He judged the menu.
WHEN THE MEASUREMENT ALREADY SAYS NO, SAY NO. Do not make him discover the no by looking at
three bad options. The slot is answered ONLY by a REPAINT of the facial layer with the
features authored larger, and that is HIS art.

*** THE TREE SILENTLY REVERTED 771 COMMITS, AGAIN, MID-TURN. *** HEAD came back as c5d4dc6
and `origin/main` LOCALLY READ THE SAME STALE SHA, so every "am I current?" check agreed
with itself and lied. `git ls-remote origin main` said d6f4b42. The repair:
    git ls-remote origin main                        <- the ONLY honest source
    git fetch --force --no-tags origin main          <- brings the objects even if the ref
                                                        update loses a lock race
    git update-ref refs/remotes/origin/main <sha>    <- fix the ref by hand
    git checkout -B <branch> origin/main
I caught it because `git status` showed files I had committed hours earlier as untracked.
IF SOMETHING YOU KNOW YOU COMMITTED SHOWS AS MISSING, DO NOT COMMIT -- RESYNC FIRST. A commit
from that state would have destroyed 771 commits of fleet work.

STILL LAW AND STILL SHIPPED FROM EARLIER TODAY (he approved it twice):
  laws/BOHEMIA_ADDENDUM_THE_CHIN_LAW_8_11_26.md + gates/chin_law_gate.js (10/0)
  the head's silhouette edge, the throat capped to one row, and the clamp that stops the
  throat ever claiming the last face row under the mouth.

NOT PENDING HIM ANY MORE: the overworld face size question is CLOSED. Do not ask it again.
CLOSED 8/17: the NE/NW "missing face" was THE BACK OF HIS HEAD all along (92px skull vs
24-31px front head, confirmed by rendering all eight). Both gates were wrong, both are fixed
and mutation-tested, CHARACTER has zero reds. Not his, not open.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- *** THE CHIN LAW IS LOCKED AND GATED.
HE APPROVED THE FIX; THIS IS THE PART THAT MAKES IT NEVER COME BACK. ***

PAOLO: "It looks like u fixed it make sure we never have this chin issue ever again."

FOUR INSTANCES, TWO UNRELATED MECHANISMS, ONE SYMPTOM. That is a missing law, not a bug:
  7/28  "one tile less facing east and west... towards the chin"  -> fixed on E and W ONLY
  8/11  chin circled                                              -> found the missing head EDGE, shipped, called it done
  8/11  "THIS IS NOT FIXED"                                       -> found the THROAT eating both chin rows
  8/11  writing the gate for the law                              -> ITS FIRST RUN FOUND IT STILL LIVE ON E
laws/BOHEMIA_ADDENDUM_THE_CHIN_LAW_8_11_26.md. Canon index regenerated.

THE LAW, as properties so it does not care which pass breaks it next:
  A  there is always HEAD UNDER THE MOUTH wherever his rig paints face rows below it
  B  the throat never takes more than ONE row of face
  C  the head HAS AN EDGE, like every other body part
  D  EVERY painted facing, hair off (a hairstyle may cover a jaw; the body must still draw one)

*** THE IMPLEMENTATION RULE THAT MATTERS MOST: A NUMBER TUNED PER FACING WILL ALWAYS BE
WRONG ON THE NEXT FACING SOMEBODY OPENS. *** throatRows was corrected three times by eye and
was STILL wrong on E, where his rig paints exactly one face row below the mouth so even one
throat row ate the whole chin. The count stopped being the rule and the chin became the rule:
THE THROAT MAY NEVER CLAIM THE LAST FACE ROW UNDER THE MOUTH. The pass reads the mouth row
off his own facial art for the facing being drawn. No per-direction table, nothing to
re-tune, correct on a facing that does not exist yet. tools/bohemia_chin_law_patch.py.

AND THAT PATCH SHIPPED BROKEN THE FIRST TIME, silently, in the way CLAUDE.md already warns
about: it read `gdir`, which is a `const` declared LATER in buildFrame, so the read was a
temporal-dead-zone ReferenceError that its own try/catch swallowed -- clamp off, E still
broken, no error anywhere. The gate caught it. Use `d` + MIRROR, never a const from further
down the function.

GATE: CHIN LAW (gates/chin_law_gate.js), registered. Mutation-tested: remove the chin clamp
and it fails, remove the head edge and it fails three times over.

THE PROCESS LESSON, and it cost him three rounds: IF A COMPLAINT SURVIVES YOUR FIX, YOU
FIXED A DIFFERENT THING. Measure the exact rows he circled before saying it is done.

VERIFIED: CHIN LAW 10/0, HEAD FOLLOWS RIG 5/0, NECK TONE 58/0, RIG IS LAW 12/0, RIG CHECK
168/0, RENDER LIKE THE RIG 23/0, STRUCTURE 134/0, ANIM FABRICATION 26/0, FAMILY CAST 23/0,
CLOTHES FOLLOW 63/0, FACE CANON 9/0, OVERWORLD FACE 10/0, HOODIE 11/0.

STILL PENDING HIM: the overworld face size (he never picked a column --
records/OVERWORLD_FACE_SCALE_8_11.png), and NE/NW have no face painted at all.

--------------------------------------------------------------------------------


CHARACTER (character-0lurbs): 8/11 -- the overworld face size dial that this section
described as shipped was KILLED by Paolo the same day ("well spin back on the overworld
face shit u turned me off"). The section is removed rather than left standing, because a
handoff that still says a corpse SHIPPED is how a corpse gets rebuilt. GRAVEYARD IS FINAL:
records/POSTMORTEM_OVERWORLD_FACE_SIZE_KILL_8_11_26.txt. The measurement in it is the
reusable part -- six pixels of eyes and a two-pixel mouth is WHY the answer is a repaint,
not a dial, and it does not need taking again.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- *** THE HEAD IS FIXED. IT WAS ONE
CONDITION, AND IT HAD BEEN WRONG FOR EVERY CHARACTER IN THE GAME. ***

PAOLO, chin circled: "this is not how the rig has my head and my neck line... there needs to
be more head underneath the mouth following how the rig has it. fix it"

THE BASE BODY DOES NOT USE PAINTED COLOUR -- IT SHADES ITSELF FROM THE PART GRID. Every body
part gets one base tone and an edge pixel gets `shade=1`, the darker anatomy tone. That is
what draws every limb line and every silhouette on the body. And the whole pass was wrapped
in one condition:

    const g = GROUP[pid];
    if (g !== 0) { ...border detection... if (border) shade = 1; }
                ^^^^^^^^   GROUP = {1:0, 2:0, ...}  -- group 0 IS THE HEAD AND FACE

THE HEAD WAS THE ONE PART OF THE BODY EXCLUDED FROM HAVING AN EDGE. Every head pixel came
out the same flat tone, forever, on everybody.

AND HE HAD PAINTED THE JAW. His body art puts the dark anatomy index on BOTH sides of every
head row and walks it inward -- x7..x16, then x8..x15, then x9..x14 -- which is the egg.
Measured on the render: those columns came out 191,175,166, THE EXACT SAME COLOUR AS THE
CHEEK BESIDE THEM. His jawline was being painted as face. The head read as a barrel and the
chin dissolved into the shelf under the mouth he circled. tools/bohemia_head_edge_patch.py.

DELIBERATELY NARROW -- only the SILHOUETTE edge. No line between head and face (one form,
same group), no line where a limb meets the head (his 7/2 ruling, untouched), no line at the
neck join (that one is HIS call). NOT ONE PAINTED PIXEL MOVES: this is a tone on cells his
rig already owns, so RIG LAW (which is about geometry) is untouched.

*** THE RULER FAILED TWICE ON THIS ONE FIX AND BOTH FAILURES ARE THE SAME MISTAKE. ***
  1. The width ruler is BLIND to it. The fix is a TONE; both tones are skin; "how wide is
     the skin" reads identically before and after. It did, and I nearly shipped believing
     nothing had happened.
  2. The edge ruler I wrote to replace it took the outermost NON-TRANSPARENT pixel -- the
     sprite's own black outline, darker than everything -- so it PASSED with the fix ripped
     back out. Mutation-tested, caught, fixed to compare outermost SKIN to the skin inside
     it. Now: 0 of 20 without the fix, 20 of 20 with it.
ASK FOR THE THING THAT CHANGED, and mutation-test every assertion you write.

GATE: HEAD FOLLOWS RIG (gates/head_follows_rig_gate.js) -- the width ratchet (deviation may
only shrink) PLUS the jaw-line assertion. Registered in the suite.

STILL OPEN AND STILL HIS: BAKED part 2 has no pixels on NE/NW, which is why PARTS PAINTED
and BODY VARIATION are red (identical on main, verified on a clean tree). Those two facings
have no face painted at all.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- *** THE THROAT WAS EATING HIS CHIN.
BOTH ROWS OF IT. HE CAUGHT THE SAME DEFECT TWICE, THREE WEEKS APART. ***

PAOLO, zoomed all the way in with everything under the mouth circled: "THIS IS NOT FIXED
ARE YOU RETARDED BRO ARE YOU FUCKING FR." He was right. The jaw EDGE fix earlier today was
real and is still in; this is the OTHER half and it is the half he had been circling.

NECK_TONE does not only tint the neck. Its own comment says why: part 3 is 100% cloth on
every facing he looks at, so a tone there can never appear -- so it also takes "the lowest
rows of visible FACE skin", `throatRows: 2`.

    RIG (S)   y13 face w8   the mouth row
              y14 face w6   the JAW
              y15 face w4   the CHIN
    RENDER    y13  191,175,166   his face tone
              y14  177,162,154   THROAT
              y15  177,162,154   THROAT

BOTH ROWS OF HIS CHIN CAME OUT THE NECK'S TONE, so chin and neck read as one slab with the
mouth sitting on top of it. That slab is what he circled, twice.

*** AND HE HAD ALREADY RULED ON IT. *** 7/28: "Make the neck one tile less facing east and
west... towards the chin" -- the note in the code even says two rows "reached up into the
chin". That correction went to E and W ONLY; every other facing was left at two. It was the
same defect on the front the whole time. He caught it in profile in July and head-on in
August. Now: ONE ROW, EVERY DIRECTION. tools/bohemia_throat_row_patch.py.
The throat KEEPS a row, so his 7/27 "the neck is not a different color" still holds.

A GATE MUST NEVER OUTRANK A RULING (8/1), AND ONE JUST DID. neck_tone_gate asserted the
literal `throatRowsByDir: { E: 1, W: 1 }` AND `throatRows: 2` -- it had frozen the
HALF-APPLIED version of his 7/28 ruling as if the split were the point, so finishing that
ruling read as a regression. It asks for the PROPERTY now: the throat never takes more than
one row in any direction. Mutation-tested both ways.

Anchor: records/CHIN_UNDER_THE_MOUTH_8_11.png (before/after at his zoom).

TWO SEPARATE BUGS UNDER ONE COMPLAINT, and I shipped a claim after fixing only the first:
  1. the head was the ONE body part excluded from silhouette edging (`if (g !== 0)`, and
     GROUP puts head+face in group 0) -- his painted jawline rendered as cheek. FIXED.
  2. the throat took two rows of face -- his chin rendered as neck. FIXED NOW.
If a complaint survives your fix, you fixed a different thing. Measure the exact rows he
circled before saying it is done.

--------------------------------------------------------------------------------


CHARACTER (character-0lurbs): 8/11 -- the overworld face size dial that this section
described as shipped was KILLED by Paolo the same day ("well spin back on the overworld
face shit u turned me off"). The section is removed rather than left standing, because a
handoff that still says a corpse SHIPPED is how a corpse gets rebuilt. GRAVEYARD IS FINAL:
records/POSTMORTEM_OVERWORLD_FACE_SIZE_KILL_8_11_26.txt. The measurement in it is the
reusable part -- six pixels of eyes and a two-pixel mouth is WHY the answer is a repaint,
not a dial, and it does not need taking again.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- *** THE HEAD IS FIXED. IT WAS ONE
CONDITION, AND IT HAD BEEN WRONG FOR EVERY CHARACTER IN THE GAME. ***

PAOLO, chin circled: "this is not how the rig has my head and my neck line... there needs to
be more head underneath the mouth following how the rig has it. fix it"

THE BASE BODY DOES NOT USE PAINTED COLOUR -- IT SHADES ITSELF FROM THE PART GRID. Every body
part gets one base tone and an edge pixel gets `shade=1`, the darker anatomy tone. That is
what draws every limb line and every silhouette on the body. And the whole pass was wrapped
in one condition:

    const g = GROUP[pid];
    if (g !== 0) { ...border detection... if (border) shade = 1; }
                ^^^^^^^^   GROUP = {1:0, 2:0, ...}  -- group 0 IS THE HEAD AND FACE

THE HEAD WAS THE ONE PART OF THE BODY EXCLUDED FROM HAVING AN EDGE. Every head pixel came
out the same flat tone, forever, on everybody.

AND HE HAD PAINTED THE JAW. His body art puts the dark anatomy index on BOTH sides of every
head row and walks it inward -- x7..x16, then x8..x15, then x9..x14 -- which is the egg.
Measured on the render: those columns came out 191,175,166, THE EXACT SAME COLOUR AS THE
CHEEK BESIDE THEM. His jawline was being painted as face. The head read as a barrel and the
chin dissolved into the shelf under the mouth he circled. tools/bohemia_head_edge_patch.py.

DELIBERATELY NARROW -- only the SILHOUETTE edge. No line between head and face (one form,
same group), no line where a limb meets the head (his 7/2 ruling, untouched), no line at the
neck join (that one is HIS call). NOT ONE PAINTED PIXEL MOVES: this is a tone on cells his
rig already owns, so RIG LAW (which is about geometry) is untouched.

*** THE RULER FAILED TWICE ON THIS ONE FIX AND BOTH FAILURES ARE THE SAME MISTAKE. ***
  1. The width ruler is BLIND to it. The fix is a TONE; both tones are skin; "how wide is
     the skin" reads identically before and after. It did, and I nearly shipped believing
     nothing had happened.
  2. The edge ruler I wrote to replace it took the outermost NON-TRANSPARENT pixel -- the
     sprite's own black outline, darker than everything -- so it PASSED with the fix ripped
     back out. Mutation-tested, caught, fixed to compare outermost SKIN to the skin inside
     it. Now: 0 of 20 without the fix, 20 of 20 with it.
ASK FOR THE THING THAT CHANGED, and mutation-test every assertion you write.

GATE: HEAD FOLLOWS RIG (gates/head_follows_rig_gate.js) -- the width ratchet (deviation may
only shrink) PLUS the jaw-line assertion. Registered in the suite.

STILL OPEN AND STILL HIS: BAKED part 2 has no pixels on NE/NW, which is why PARTS PAINTED
and BODY VARIATION are red (identical on main, verified on a clean tree). Those two facings
have no face painted at all.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- *** HE IS RIGHT ABOUT THE HEAD. THE
GAME DRAWS A BARREL WHERE HIS RIG PAINTED AN EGG. MEASURED. ***

PAOLO, chin circled on a screenshot: "this is not how the rig has my head and my neck line.
Why does it look so fucked up... there needs to be more head underneath the mouth following
how the rig has it."

SKIN WIDTH PER ROW, S facing, hair removed. His painted FACE (BAKED part 2) against the skin
the game actually paints:

      row     y6  y7  y8  y9  y10 y11 y12 y13 y14 y15
      RIG      6   8   8   8   10  10   8   8   6   4     <- an EGG: narrows above the
      GAME     7   9  10  10   10  10  10  10   9   5        cheekbones, then a jaw to a
                       +2  +2            +2  +2  +3  +1      4px chin
The rig tapers both ways off the cheekbones. The game draws SIX STRAIGHT ROWS at full width
and then falls off a cliff. WORST ROW IS y14, THE JAW: three pixels too wide, and y14 is
exactly the flat shelf under the mouth he circled. His read was correct and specific.

MEASURE APPLES TO APPLES OR YOU WILL CHASE THE OUTLINE. My first comparison put the rig's
part-1 OUTLINE against the game's full silhouette and reported every row off by 2 -- that is
just the sprite's outline pass being a 1px ring. The signal is SKIN vs SKIN: rig part 2
against the skin the game paints. Same trap as the head-ratio and shoulder rulers earlier
today. FIX THE RULER, NEVER THE TARGET.

NOT THE HAIR, and I checked before blaming it: with every hair layer deleted the game still
draws 10-10-10-9-5 where the rig says 8-8-6-4. The hair costs 2 more pixels of jaw at y14 on
top of that, but the flattening is underneath it.

WHAT I DID NOT DO: guess at a fix. The cause is in the SKINNER -- the shared engine every
body on screen goes through, and RIG LAW makes it the most dangerous code in the repo to
poke at on a hunch. Instead:
  tools/bohemia_head_vs_rig.js       three panels (rig as painted / game hair-off / game as
                                     he sees it) plus the per-row numbers.
                                     records/HEAD_VS_RIG_8_11.png
  gates/head_follows_rig_gate.js     A RATCHET, like MAP BOUND does with typed map bounds.
                                     Total deviation pinned at 14, worst row at 3. They may
                                     only SHRINK. Nobody can make the head follow his rig
                                     less well than it does today, and the day somebody
                                     fixes the skinner this is the check that proves it --
                                     the gate PRINTS the new numbers to pin.

NEXT SESSION ON THIS: the suspects are the head branch of skinColorLayer and the COVER FILL
pass ("solid coverage on covered part-ids"), which is exactly the shape of a bug that squares
off a tapered part. Confirm on the real surface before touching anything: VERIFY ON THE REAL
SURFACE, and a symptom that survives content changes is a PIPELINE bug.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- the overworld face size dial that this section
described as shipped was KILLED by Paolo the same day ("well spin back on the overworld
face shit u turned me off"). The section is removed rather than left standing, because a
handoff that still says a corpse SHIPPED is how a corpse gets rebuilt. GRAVEYARD IS FINAL:
records/POSTMORTEM_OVERWORLD_FACE_SIZE_KILL_8_11_26.txt. The measurement in it is the
reusable part -- six pixels of eyes and a two-pixel mouth is WHY the answer is a repaint,
not a dial, and it does not need taking again.

--------------------------------------------------------------------------------

CHARACTER (character-0lurbs): 8/11 -- THE AGE AXIS GOT ITS PROPORTIONS, AND
I SHIPPED TWO FIXES THAT MOVED THE RENDER BY ZERO PIXELS BEFORE I NOTICED.

PAOLO: "also the tinier people looked weird look into that" -- and separately, "maybe all
eyes eyebrows and mouths should be twice the size idk".

HE WAS RIGHT ABOUT THE KIDS AND THE CAUSE WAS ONE UNSCALED COORDINATE. BOH_AGE scaled the
pose in Y and only in Y (`n[j] = [P[j][0], ...]`), so the child had her father's shoulder
ratio exactly: 0.440 against his 0.415. She was not a child, she was an adult who had been
stepped on. FIXED through BODYVAR's dials (BOH_AGE.bias, per stage, merged UNDER the
character's own) plus a hand/foot stamp scale, X ONLY.

*** READ records/POSTMORTEM_AGE_BREADTH_POSE_X_8_11_26.txt BEFORE TOUCHING THE AGE AXIS ***
The obvious fix -- scale every joint's X about the pelvis -- DESTROYED THE CHILD. Her arms
fused into her torso and her sneakers detached into a brick wider than her legs. HANDS AND
FEET ARE RIGID STAMPS BOUND TO BONES, NOT SKINNED GEOMETRY: narrowing the skeleton drags
the bones inboard and leaves the adult-sized stamps behind. A pose-space X scale can never
be right on this rig, at any amplitude. The patch was DELETED, not softened. The first
limb-stamp version scaled Y too, which opened gaps between shin, ankle and sole, and
genShoes paints a SOLE on every row where the silhouette ends -- her jeans and sneakers
came out STRIPED, a stack of pancakes.

*** AND THE HONEST PART: TWO OF TODAY'S FIXES BARELY MOVED THE PIXELS. *** The stamp scale
narrowed the rest grid 13px -> 11px and changed the RENDER by ZERO. The dial bias moved her
shoulder by ONE pixel (visibly better in the interior -- waist, leg gap, two separate shoes
-- but one pixel on the silhouette). EVERY GATE IN THE REPO WAS GREEN THROUGH BOTH, because
no gate ever asked whether the pixels moved. gates/face_feature_scale_gate.js now asks
exactly that on the face knob; the same assertion belongs anywhere a dial ships.
THE REMAINING CHUNK IS THE SHOE, NOT THE FOOT: genShoes generates over the UNION of parts
9/10/11/12, and the legs sit 11 sprite px apart in the rest pose at EVERY age, so the sole
line is 28px on the father and on the child alike. Whether leg SPACING should vary with age
is a PAOLO CALL (BODYVAR hips dial, or rig-level) -- I stopped rather than write a fifth
version. STOP PRODUCING, 7/26.

FACE FEATURES: a render-time knob, `window.BOH_FACE_FEAT`, DEFAULT 1. PUNK is marked
do-not-remake so nothing is baked into his spec -- at 1 the face is BYTE-IDENTICAL to no
knob at all, gated. The features scale; the SPACING barely moves (eye gap at 35% of the
scale, brow gap at 20%), because at eyeY the head is ~28px wide and doubling gap AND width
puts the outer eye corner 4px off the side of his head.
PENDING PAOLO, one number: records/FACE_FEATURE_SCALE_8_11.png is his face rendered at
x1.0 / x1.25 / x1.50 / x1.75 / x2.00. x1.50 reads best to me; at x2.00 the mouth is wider
than the jaw. `node tools/bohemia_face_feature_strip.js` regenerates it.

AND I FOUND TWO GATES I HAD ALREADY BROKEN AND SHIPPED. RIG IS LAW and RIG CHECK were RED
ON MAIN before this turn touched anything -- I broke them when the age axis landed and did
not look. Both asserted the LITERAL string `BOH_BODYVAR.apply(BAKED,G.bodyVar)`, which the
age composition rewrote; the thing they guard had never actually broken. ASK FOR THE
PROPERTY, NEVER FOR THE SPELLING: they now check that BAKED is the ROOT of what the dials
resolve, ANCHORED TO rebuildFromRig's OWN BODY, plus a new assertion that nothing writes the
resolved package back onto BAKED. Mutation-tested both ways -- and the first anchored-less
version PASSED a mutation that pointed rebuildFromRig at a different body entirely, because
the alpha carries other BOH_BODYVAR.apply(...BAKED...) text in comments and in the embedded
rig tool. A check a comment can satisfy is not a check.
ALSO FIXED, and it was not mine to break: `BAKED` IS AN ENGLISH WORD. rig_check_gate's
detector was a bare \bBAKED\b, so the three tools/bohemia_music_verdicts_8_2*.py -- which
print the sentence "HIS 8/2 VERDICTS ARE BAKED." -- were being ordered to file RIG CHECK
blocks about a rig they never touch, red for over a week. BAKED now only counts when used
as an OBJECT (BAKED. / BAKED, / BAKED) / = BAKED). Strings are NOT stripped, deliberately:
patch tools carry their real rig references inside string literals, which is what string
surgery IS.

AND TWO MORE OF THE SAME, one edit later: CLOTHES FOLLOW spelled out
`BOH_BODYVAR.apply(BAKED,G.bodyVar);` and BODY VARIATION demanded `G.bodyVar` be the LAST
argument (`G\.bodyVar\s*\)`), so routing the dials through a stage bias broke it on a
COMMA. bodyvar_gate's own comment already tells this exact story from earlier the same day.
Four gates, one root cause, one afternoon: A GATE THAT NAMES A SPELLING GOES RED THE NEXT
TIME SOMEBODY IMPROVES THE THING IT GUARDS.

STILL RED, NOT MINE, AND IDENTICAL ON MAIN (verified by stashing to a clean tree):
  SFX RENDER      -- audio lane
  PARTS PAINTED / BODY VARIATION -- both are the SAME fact: BAKED part 2 (face) has no
    pixels on NE and NW. That is Paolo's painted rig. RIG LAW says never reshape his
    regions, so this is not something a lane may "fix" -- it needs HIS call on whether
    those two facings ever get a face painted.

TWO GATES GO RED UNDER MACHINE LOAD AND ARE NOT BROKEN. Do not spend a turn on these:
  RUN BEAT -- "one second of wall clock moved the run 2.370 beats, not 2 (120 BPM)". It
    measures WALL CLOCK. Red with a gate suite plus browsers running beside it, GREEN on
    the same tree the moment the box is quiet (load 2.3). Verified both ways 8/11.
  THE CROWD -- 15/1 on one tree and 16/0 on another with no relevant diff between them.
  If either goes red, re-run it ALONE before believing it.

NEW GATE: FACE FEAT DIAL (gates/face_feature_scale_gate.js), registered in the suite.

--------------------------------------------------------------------------------


CHARACTER (0lurbs): 8/11 (r) LATEST — *** THE AGE AXIS: CHILD / TEEN / YOUNG ADULT /
ADULT / ELDER ON THE ONE RIG. A CHILD WAS NOT EXPRESSIBLE BEFORE TODAY. ***
Paolo killed my family cast on sight: "we have to assign the different heights in the
different body sizing... you're just gonna create a family without fucking with the
skeleton like are we even able to make character a kid child characters ... teenagers
... young adults". He was right and it was four of the same man.
WHY IT WAS: BODYVAR's PART_SPEC covers parts 4/5/6/9/10 -- torso, arms, legs -- and
NEVER TOUCHES THE HEAD. AMP.height is 0.05, about 2.3px on a 44px body. Every dial in
the system is a WIDTH dial plus a 2px nudge, so four people built from them are four
people the same height with the same head.
THE MECHANISM WAS ALREADY THERE, CLAMPED. warpPose says "HEAD KEEPS ITS AUTHORED BONE,
EXACTLY... the head is a rigid stamp". For a TALLER ADULT that is correct and is why
height is capped. FOR A CHILD IT IS THE ENTIRE MECHANISM: shrink the body about the
ground, leave the head stamp alone, and head-to-body ratio rises by itself. And
SHRINKING IS FRAME-SAFE -- the 5% cap exists because his body already paints ROW 0 in
nine clips, so GROWING runs out of frame; going down never did.
NUMBERS MEASURED OFF BAKED.pose.S, NOT AN ANATOMY BOOK: head bone 9px, stand 44px,
so HIS ADULT IS A 4.89-HEAD FIGURE (real humans are 7.5-8). His rig is stylised and
that is HIS ART, so the axis scales the RATIO OF CHANGE into his proportions rather
than importing real head-counts and "correcting" him. child 0.77, teen 0.90,
youngadult 0.97, adult 1.00 (identity), elder 0.97. Cross-checked two ways that agree:
head-count ratio (6.0/7.75) and real stature (128cm/175cm).
*** THE REAL BUG, AND IT WOULD HAVE BITTEN ANY LANE: rebuildFromRig() RUNS ONCE AT
BOOT. *** G.bodyVar and G.age reach the renderer ONLY through it. Setting the globals
and calling drawChar changes NOTHING -- measured: painted height 50px at adult, teen
AND child alike, while the transform correctly moved the pose 44px -> 36px. My v1 cast
set dials and drew, so all four rendered the SAME BODY and only their CLOTHES differed.
The body sliders always did it right (set global -> rebuildFromRig -> redraw); the cast
uses that path now, clears HD_CACHE (keyed on facing/clip/look, knows nothing about the
BODY), and PUTS THE PLAYER'S BODY BACK afterwards because these are globals.
RESULT, measured on the real canvas: FATHER 106, MOTHER 98, BROTHER 94, SISTER 84 px.
Four distinct heights, 22px spread. Before: 104/100/100/100, spread 4.
GATE: family_cast_gate.js, registered as FAMILY CAST, 23/0. It asserts four DIFFERENT
heights, a spread >= 14px (the dials alone cannot reach it), father tallest and child
shortest, teen between, and the CHILD's head-to-body ratio above BOTH adults.
MUTATION TESTED, AND MY FIRST MUTATION WAS FAKE: removing the `stage==='adult'` early
return neuters nothing (adult just runs at scale 1.0) and the gate stayed green, which
I nearly reported as a passing gate. The real mutation sets child+teen to h:1.0 -- the
exact state v1 shipped in -- and the gate goes 20/3: spread collapses 22px -> 8px and
the child's head ratio stops exceeding the adults'. THAT is the proof the axis is
load-bearing.
ALSO FIXED, ANOTHER LANE'S LESSON APPLIED TO MINE: bodyvar_gate asserted the exact
string BOH_BODYVAR.apply(BAKED,G.bodyVar) and went red when the age axis composed
underneath it. The dials were still resolved through BODYVAR -- only the spelling
moved. ASK FOR THE PROPERTY, NEVER FOR THE SPELLING. Widened; 40/1, and that 1 is the
same pre-existing "every dial extreme" failure clean main has.
AND I NEARLY SHIPPED A DUPLICATE: re-running the family INSERT patch on a tree that
already contained its own output produced TWO `var FAMILY_CAST` and TWO `famBuild`.
It measured correctly because the later declaration wins. AN INSERT TOOL RUN TWICE IS
A DUPLICATION TOOL -- anything editing shipped code must REPLACE, not ADD. Redone as
tools/bohemia_family_age_upgrade_patch.py.
STILL OPEN (measured 8/11, NOT mine to hide): an EXPOSED SHIN paints the dark
under-body instead of skin -- byte-identical to wearing no leg garment -- while the
same body paints bare ARMS as skin. Any character in shorts has grey legs. Next job.
Shot: records/familycast/cast.png
CHARACTER (0lurbs): 8/11 (o) LATEST — THE FAMILY CAST IS ON THE RIG AND IN THE GAME.
CHARACTER tab, under THE FAMILY. Father, mother, brother, sister, tap any one to turn
it through all eight facings.
DECIDED, NOT ASKED. Under EVERYTHING IS A THUMB (8/9) I withdrew my own question
("do I show you candidates or do you describe them first") as exactly the process
question that law bans, and built them.
THE CAST WAS ALREADY CANON, not invented: ACT1 OPENING VISION 7/19 fixes all four
roles and the gender mirror (male keeps the older BROTHER, female keeps the older
SISTER). survivesIf carries the mirror per role instead of baking one gender's cast.
BODIES are BODYVAR dials on the ONE rig, all well inside the measured height cap.
WARDROBE is 100% st==='canon' -- NOT ONE NEW GARMENT WAS COOKED. NAMES are drafts
(RAY / DENISE / MARCO / NINA) tagged draft:true per CLAUDE.md's 8/11
make-an-attempt amendment: four strings in one place, edit them, no blank page.
SHADOWS ARE SEPARATE, STRUCTURALLY. Each member is TWO STACKED CANVASES, shadow
under, sprite over. That is forced, not stylistic: drawChar ends in putImageData
which REPLACES destination pixels, so a shadow on the sprite canvas is either wiped
(before) or painted over the body (after). A separate element is the only place it
can be visible AND provably outside the garment pixels.
*** TWO THINGS I ONLY FOUND BY LOOKING AT IT, AFTER THE GATE WAS ALREADY GREEN ***
1. THE SHADOW WAS INVISIBLE. Black at 42% on a near-black stage: painted, counted
   by my own gate, and impossible to see. A shadow you cannot see is not a shadow,
   it is a passing test. The stage has a floor now (gradient lifting toward the
   feet) so the shadow has something to fall on.
2. AN EXPOSED SHIN PAINTS THE DARK UNDER-BODY, NOT SKIN. The sister was in CUTOFF
   DENIM SHORTS. Measured: her shin band is 31,31,36 x188 with shorts, which is
   BYTE-FOR-BYTE identical to wearing NO leg garment (noLegs 31,31,36 x188), while
   BLUE JEANS gives 64,80,110 x253. The same body paints bare ARMS as skin under a
   short sleeve. *** THAT IS A REAL PRE-EXISTING BUG IN THE BODY RENDER, NOT MINE,
   AND NOT FIXED HERE *** -- any character in shorts has grey shins. She wears jeans
   now (a kid woken at night reads better than shorts anyway) so the demo does not
   wait on it, and the gate holds the cast to clothed legs WITH THE REASON WRITTEN
   IN so nobody mistakes the workaround for the fix. NEXT SESSION: fix bare-leg skin.
GATE: gates/family_cast_gate.js, registered as FAMILY CAST. 18/0. MUTATION TESTED
TWICE -- the first mutation was too crude (famPaintShadow clears, so it erased the
bodies and collapsed the four to one signature), so I redid it as the realistic
"someone merged the layers" version: bodies intact, shadow drawn into the sprite
canvas, and all four members fail by name on the shadow-separation claim.
ALPHA LOADS 20/0, SUN MODE green, CANVAS SCALE unchanged at 52/1 (city lane's).
Shot: records/familycast/cast.png

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

CHARACTER (0lurbs): 8/7 (g) LATEST — *** THE CHECKOUT LIES. READ THIS BEFORE YOU
EDIT ANYTHING. *** records/BOHEMIA_THE_CHECKOUT_LIES_8_7_26.md
THE WORKING DIRECTORY SILENTLY REVERTED TO A SNAPSHOT ~530 COMMITS BEHIND MAIN,
TWICE IN ONE SESSION, while GitHub kept every push. Git reports NOTHING: status
clean, log plausible, every file present. It is simply a different repository than
the one you shipped to twenty minutes ago.
  MISS 1: I did an entire job against an alpha missing 4,323 lines of five other
    lanes' work, with a FULL GREEN SUITE on it. Pushing would have reverted 547
    commits. Caught only by `git diff --stat origin/main HEAD -- slices/...` out of
    habit. A GREEN SUITE PROVES NOTHING ABOUT WHICH TREE YOU ARE STANDING IN.
  MISS 2: after shipping it reverted again on its own and MANUFACTURED EVIDENCE
    THAT A TRUE FINDING WAS FALSE — records/target/BOTTOMLEFT.png is tracked on
    main (79 entries in that folder) but on the stale tree `git ls-files` AND
    `git log --all` both said it had never existed anywhere in history (14
    entries). One step from retracting something correct. It also voided nine
    per-gate tests I had just run: the files those gates write do not exist on the
    stale tree, so every one reported a meaningless "clean".
  MISS 3: THE WORKAROUND MAKES IT WORSE. `git fetch` times out on this ~500 MB repo
    and leaves the tracking ref untouched WITH NO ERROR (ls-remote said aa7bf3c
    while rev-parse origin/main still said c5d4dc6 — the SAME bug as the six
    phantom "rollbacks" earlier in this lane, which were never rollbacks). So you
    reach for `git fetch --depth=1`, which grafts a SHALLOW boundary; merge-base
    and rev-list then answer from a stump AND ANSWER CONFIDENTLY. Measured: HEAD
    reported "2 behind and 703 AHEAD" of a commit it was sitting exactly on.
    Repair: `git fetch --unshallow origin` (pulls ~3 GB here; check disk first).
*** THE RETRACTION BELOW IS ITSELF WRONG. UN-RETRACTED 8/7 EVENING. *** The
ORIGINAL finding was CORRECT: gates/bottomleft_gate.py line 93 screenshots straight
into records/target/BOTTOMLEFT.png, which is tracked AND published (the ART tab loads
that folder). A screenshot is never byte-identical twice, so every suite run rewrites
a 500 KB binary nobody authored. The ART lane found it independently at e47557d with
file and line, naming three commits where it was already swept up; I then ran the one
gate and watched md5 go 29b84b65 -> 4a017e5f with git reporting M.
WHY I RETRACTED A TRUE THING: I KILLED THE SUITE AT 110 GATES AND BOTTOM-LEFT IS
REGISTERED AT LINE 645. My "110 gates, nothing modified" never reached the gate that
does it. A CANNOT-REPRODUCE FROM A RUN THAT NEVER REACHED THE THING IS NOT A
REFUTATION, and I published it as one, in capitals, to every lane.
AND MY GREP WAS USELESS FOR AN INSTRUCTIVE REASON: the path is BUILT at runtime from
path.join(process.argv[2],'records','target','BOTTOMLEFT.png'), so it exists as a
string nowhere. A GREP FOR A PATH ONLY FINDS PATHS SOMEBODY SPELLED OUT.
STILL UNPROVEN and NOT re-asserted: BANK_LAW_INDEX.md and SUBURB_WALK_7_18_26.html.
NOT FIXED BY ME (ART lane's gate, already flagged). `git add -A` AFTER A SUITE RUN IS
NOT SAFE IN THIS REPO.

*** AND IT ALREADY MADE ME PUBLISH ONE WRONG FINDING — RETRACTED HERE. *** In
fa7bda6 I told the fleet in capitals that RUNNING THE GATE SUITE DIRTIES TRACKED
FILES, naming records/target/BOTTOMLEFT.png (503972 -> 503962 bytes, on the
byte-locked target screen). I CANNOT REPRODUCE IT: from a clean tree on a verified
base, 110 gates completed and modified NOTHING. Two files quietly reverting to
slightly older versions is what a partial filesystem revert looks like, and no gate
or tool in the repo even mentions those paths. UNPROVEN, PROBABLY THIS SAME BUG
WEARING A DIFFERENT MASK. If you ever see tracked files dirty after a suite run,
run bohemia_fresh_base.py FIRST — the ground moving is far likelier than a gate
writing to the repo. A false alarm about the safety machinery is expensive.

*** RUN `python3 tools/bohemia_fresh_base.py` BEFORE THE FIRST EDIT. *** It asks the
REMOTE (git ls-remote — a network round trip, the only source a stale local ref
cannot serve), repairs the tracking ref with an explicit forced fetch, REFUSES to
give an ancestry verdict on a shallow clone and names --depth=N as the cause, and
exits non-zero so it can gate a script. It never resets: you may be mid-rebase or
holding unpushed work. Before the FIRST EDIT, not before the push — checking at
push time means the work is already done twice. AND AGAIN AFTER ANY LONG STEP: the
suite takes ~30 min here and both reverts landed either side of one.
AND VERIFY SHIPS AGAINST GITHUB, NEVER THE LOCAL CLONE. When the tree reverted after
my push, the clone said my commit was "not a valid object". GitHub said it was in
main's history with a green Pages deploy. GitHub was right; the clone was fiction.


CHARACTER (0lurbs): 8/7 (f) LATEST — THE SNAP SIZED THE WRONG BOX: THE GATE WAS
GREEN AND WRONG FOR EIGHT DAYS, AND BOTH HAIR SURFACES WERE THE WORST IN THE GAME.
Record: records/BOHEMIA_THE_SNAP_SIZED_THE_WRONG_BOX_8_6_26.md
Paolo 7/29 said "make those fixes then make those fixes forever please". A session
sized every character canvas to a tidy multiple (charCv 336, g8c 112, portraitCv 128,
cloBig 168, cloCv 56) and canvas_scale_gate asserted those ratios. GREEN EVERY RUN
SINCE, AND EVERY ONE STILL FRACTIONAL. It asserted on getBoundingClientRect(), which
is the BORDER box, and the alpha is box-sizing:border-box with a 1-2px border on all
of them — so a declared 336 puts the bitmap in 334. Measured on the CONTENT box:
charCv x2.9821, portraitCv x1.9375, cloBig x2.9643, cloCv x0.9286, g8c x0.9821.
NEAR-INTEGER IS WORSE THAN OBVIOUSLY WRONG: it makes one anomalous pixel column every
N instead of a visibly broken image, so it survives being looked at. The 7/29 SIZES
were right, only the box was wrong — each declared width carries its own border now.
AND THE TWO WORST SURFACES IN THE GAME WERE BOTH HAIR, neither in the 7/29 list,
both anonymous canvases reporting as (anon) so no gate could have named them: the
PICKER tiles at glass x1.7143 (a source pixel is ONE device pixel here and TWO
beside it, on the tiles used to CHOOSE a hairstyle) and the 8-facing SPIN bar at
x4.5000 (a dead half pixel, on the bar built to JUDGE hair). They are .hairTile and
.hairSpinShot now. The spin bar's cause will recur: it sized itself 56*3 assuming a
56 backing, but drawChar Scale2x's to 112 in HD, so the real ratio was x1.5. It sizes
off out.width now and cannot drift when the HD toggle moves.
RESULT: 18 of 21 fractional -> 4, and all four belong to combat and city.
WHAT IT MEANS FOR THE HAIR: three rounds of "east and west are dogshit" were answered
by redrawing hair pixels and NOBODY MEASURED THE BOX IT WAS SHOWN IN. The verdicts
were not wrong — what he saw WAS bad. The FIX was wrong. It claims only that the hair
is finally shown at the size and sharpness it was drawn at. NO NEW HAIR WAS COOKED;
three fixes from the last round are still unthumbed and STOP PRODUCING says a fourth
version is the tell that I already failed.
FINAL SUITE ON THE REBASED TREE: 261 GREEN, 13 RED, AND ALL THIRTEEN ARE PRE-EXISTING
ON origin/main. Proved by CHECKING OUT origin/main DETACHED and re-running each one --
not by reading the diff and deciding they looked unrelated:
  GRAVEYARD RIG-CHECK PARTS-PAINTED BODY-VARIATION SQUINT QUEST-PLACEMENT
  INTEGRATION THE-RUN PEOPLE ONE-WORLD-TAB WALL-CLASS CANVAS-SCALE INTERIORS
INTEGRATION fails on the same probe (agents_module). THE RUN fails on the same stale
build_run_slice regeneration. PEOPLE fails on the same five scale checks (G1 G2 G4 G5
G6, 1047 people vs 5027 derived). CANVAS SCALE is MINE and is 52 passed / 1 failed --
main runs 28 assertions there, I added 24 and the single failure is the city lane's.
TWO FIXED THEMSELVES while I worked (SFX WIRED, BANK LAW) -- the sound lane shipped.
*** AND A FLEET BUG NOBODY HAS NAMED: RUNNING THE GATE SUITE DIRTIES TRACKED FILES. ***
Three separate times a gate run left records/target/BOTTOMLEFT.png modified (503972 ->
503962 bytes, on a BYTE-LOCKED target screen), plus records/BOHEMIA_BANK_LAW_INDEX.md
and slices/BOHEMIA_SUBURB_WALK_7_18_26.html. I discarded them every time rather than
commit them, but a lane that runs the suite and then does `git add -A` SHIPS A SILENTLY
REGENERATED TARGET SCREEN. That is one `git commit -a` away from happening.

SUITE REDS, ALL PROVED PRE-EXISTING EXCEPT ONE THAT WAS MINE:
  HANDOFF        MINE. handoff_gate wants ^LANE (session-id): and I wrote a DATE in
                 the parens ("CHARACTER (8/6h)"). A slash is not [a-z0-9-], so the
                 one file every session reads FIRST went red on the head I had just
                 written. Fixed to "CHARACTER (0lurbs): 8/6 (h) LATEST".
  CANVAS SCALE   CITY overview is pixelated, city lane's own gate asserts auto.
                 Proved: stash everything of mine, run on clean main -> 28/1, same.
  QUEST PLACEMENT judge page inlines 6 stale engine modules. Proved by DATES: page
                 regenerated 8/3 (e8ce9d7), modules changed 8/5 (f2f4663) and 8/6
                 (b09f3ab) by the WORLD lane. My commit has zero engine files.
                 Fix is mechanical: python3 tools/bohemia_quest_placement_judge.py
  GRAVEYARD      a dead hair token (the bare 3-letter one, not spelled here ON PURPOSE)
                 live at line 3019 of ORIGIN/MAIN's handoff, quoted from
                 git. Prose ABOUT the token-collision problem. 4th time that class
                 of false positive has bitten.
  RIG CHECK      three bohemia_music_verdicts_8_2*.py. SOUND lane's.
  PARTS PAINTED  face empty NE/NW. Proved by replacing my alpha with origin/main's
                 byte-for-byte and re-running: identical 21/1.
NONE OF THE FIVE TOUCHED — ONE SYSTEM ONE SESSION. Named here so the owning lanes
can see them; a red nobody claims is a red everybody learns to scroll past.
GATE: 52 passed, 1 failed. THE FAILURE IS NOT MINE AND I PROVED IT — stashing my whole
change set and running on clean origin/main gives 28 passed, 1 failed, same failure.
The CITY lane set the builder overview to `pixelated` while their own gate still
asserts it must be `auto` (its comment says Paolo approved `auto` and the direction is
locked). A contradiction between the city lane's code and the city lane's gate. NOT
MINE TO RESOLVE — flagged, not touched.
NEW ASSERTION WORTH KNOWING ABOUT: the gate now checks THAT THE AUDIT MEASURED THE
CONTENT BOX. Without it, every other check silently grades the wrong number, which is
exactly how 7/29 stayed green.
LOOK: tools/bohemia_pixel_snap_look.js screenshots the three surfaces and asserts no
container overflows (seven elements got wider inside flex/wrap boxes on a 390px
phone). No overflow; PNGs in records/pixelsnap/. Its own first run shot the ALL-8
gallery with the gallery toggled OFF — it clicked the toggle, which was already open.
It asserts state now instead of toggling it.

*** A NEAR MISS WORTH WRITING DOWN: I DID ALL OF THIS TWICE. ***
My checkout was 529 commits behind main and I did not check before starting. The first
full pass — patch, audit, gate, mutation test, full green suite — ran against an alpha
missing 4,323 lines of other lanes' work. Pushing it would have destroyed 547 commits.
Caught by `git diff --stat origin/main HEAD -- slices/...` before any push, then redone
from scratch on real main, which is where the border-box finding actually came from
(the stale tree still had the pre-7/29 sizes, so the real bug was invisible on it).
FETCH AND DIFF THE ALPHA AGAINST origin/main BEFORE THE FIRST EDIT, NOT BEFORE THE PUSH.

*** FLEET: THE DEPLOY IS JAMMED AND IT IS NOT THE REPO SIZE ***
records/BOHEMIA_THE_JAM_IS_PROVEN_NOT_THE_REPO_SIZE_8_6_26.md (on the session branch)
plus the combat lane's records/BOHEMIA_THE_DEPLOY_IS_WEDGED_AND_ONE_RUN_IS_MINE_8_6_26.md
Last Pages run to conclude SUCCESS: c8cf2386, 8/5 18:56. Run 31109048696 has been
`queued` since 14:05 and the API returns 409 on cancel. PROVEN by dispatching the
world lane's brand-new pages workflow by hand: one job, fresh runner, first step is
checkout — it sat at `queued` and was killed at EXACTLY fifteen minutes without ever
being handed a runner (runner_name empty, started_at never advanced). Fifteen minutes
is what everything in this repo's Actions queue times out at today, whether it copies
491 MB or nothing at all — so "15 min = the builder is copying the repo" was wrong.
ONLY PAOLO CAN CLEAR IT: cancel the run in the web UI, or re-save Settings -> Pages.
*** AND IT IS FIXED NOW — RE-MEASURED 8/7 04:25Z. *** pages.yml has 12 runs: my 1
dispatch plus 11 push-triggered, latest FOUR all SUCCESS, newest on current main
(41564a8, 04:25:36Z). The deploy is healthy and the link is true again.
I ALSO GOT ONE INFERENCE WRONG AND LEFT BOTH HALVES IN THE RECORD: I measured three
pushes triggering zero runs and wrote that on:push "does not fire for this fleet".
It fires fine. Those pushes happened while Pages was still branch-sourced and the
environment wedged. A workflow that has NEVER RUN is not a workflow that CANNOT RUN,
and I wrote the second having measured only the first.
STILL TRUE AS A RULE: until a run concludes SUCCESS, do not paste the play link as if
it carries your work. Check the run, then paste.


CHARACTER (0lurbs): 8/2 (t) LATEST — HAIR IS 15 AFTER ROUND 3. THE SIDE VIEWS ARE
STILL THE OPEN WORK AND THREE FIXES ARE UNJUDGED. DO NOT COOK A FOURTH VERSION
UNTIL HE HAS LOOKED.

=== ROUND 3 (8/2): 15 KEEP / 8 KILL ===
KILLED: DESERT CURL, SIDE PART, MULLET, MOHAWK, LIBERTY SPIKES, CORNROWS,
PONYTAIL, TOP KNOT. All in the graveyard with post-mortems. MOHAWK and LIBERTY
SPIKES are on their THIRD strike; SIDE PART/PONYTAIL/TOP KNOT/CORNROWS/MULLET/
DESERT CURL on their second. Per the reopening addendum a second kill is FINAL.
SURVIVING 15: SUN CROP, DUSK SHAG, TEMPLE TAPER, ASH SWEEP, SALT CROWN, BUZZ CUT,
CROP, SLICK BACK, BOWL CUT, FRINGE, SHAG, SHOULDER LENGTH, LONG LOOSE, WOLF CUT,
GREY WISPS.

=== HIS ROUND-3 NOTES, ALL THREE ADDRESSED BUT UNJUDGED ===
1. 'the long hair part to come down the middle ... should be in the back of the
   head. Whats wrong with you?' Below the jaw the fall narrowed SYMMETRICALLY to
   the sprite centre. From the front the back of the head IS the centre; in
   PROFILE it is at one EDGE, so the fall hung down the face. Now offset to the
   rear edge via the face centroid. THIS IS THE THIRD TIME the same class of bug
   appeared: a feature living at the back of the skull must FOLLOW the back of the
   skull when the head turns (also: the mohawk strip, the satchel strap).
2. 'look like they belong on Oompa Loompas ... calm down on the shaping.' I had
   set the silhouette projection at 2px past the skull. On a 12px head that is a
   THIRD AGAIN of head width in hair. Halved. Several of the 8 kills might have
   survived a calmer version - the cost of over-correcting.
3. 'like a rectangle on someones head' - the profile crest was a flat slab at
   every height. Now tapers: short at brow and nape, tallest over the crown.

=== THE JUDGE SURFACE, rebuilt 8/2 after he could not use it ===
ONE head per style at 3x (168px), TURNING through all 8 on a shared 900ms ticker,
facing named underneath. Previously EIGHT shots at scale 1 - his words: 'SO
FUCKING TINY I CANT TELL SHIT'. EIGHT TINY HEADS IS NOT EIGHT VIEWS, IT IS NONE.
The hair gate had PINNED the eight-thumbnail layout and was defending the mistake.

=== THE WARDROBE WAS DEAD FOR AN UNKNOWN NUMBER OF DAYS ===
'THE WARDROBE DOES NOTHING WTF I CANT EVEN CLICK IT'. MEASURED: 0 bytes of HTML on
a booted page. wardrobeRefresh was called ONCE at script time before GARMENTS
existed, and it RETURNS SILENTLY when GARMENTS is missing. A silent early return is
how a dead surface looks alive in the source. Now self-healing: retry until it
produces something, then stop. 24,894 bytes / 268 buttons / 12 sections.
LOOK FOR THIS PATTERN ELSEWHERE - any builder called once at script time.

=== OPEN, IN PRIORITY ORDER ===
1. He has NOT judged the three round-3 fixes. Wait for him.
2. E/W generally: he has said 'still dogshit' twice. Better each round, not done.
3. Fade UNLOCK mechanism: [PENDING, HIS CALL]. Do not invent the economy.
4. Style names: PARKED by him. Do not raise it.
5. cough / whistle / search: frozen, two rejections each.

=== SEVEN TIMES TODAY A GATE WENT RED AT HIM ===
hair_gate x3 (batch size when he killed 13; board count when he approved 7; the
eight-thumbnail layout), craft_law_gate x3 (a pinned style name, an empty candidate
queue, and TWICE it pinned a BROKEN implementation - the Math.floor centring and
later the back-only half-fix), dress_gate x1 (counted a canon token inside a
COMMENT). PIN BEHAVIOUR, NEVER AN IMPLEMENTATION. A gate that pins an
implementation defends its bugs, and a gate that reddens when he exercises a
verdict is the gate being wrong.

=== THREE GRAVEYARD TOKEN COLLISIONS ===
AFRO inside a base64 blob, LOCS inside 'VOTING BLOCS', DESERT CURL 2 inside
'DESERT CURL 29 off-skull pixels'. Suffix tokens (HAIR AFRO, DEAD in the graveyard, and w3) when the bare
name is an English word or a possible numeric prefix.


ALL LANES (factions): 8/2 (k) LATEST — *** THE PROJECT WAS ~43 DAYS FROM NOT BEING ABLE
TO SHIP AT ALL, AND NOBODY HAD MEASURED IT. FIXED. READ THIS ONE. ***
Record: records/BOHEMIA_THE_PAYLOAD_WALL_8_2_26.md

Paolo 8/2: "We need to do so much that we know that we don't know you need to be able to
know that." THE BIG MISSING (7/29) is the list of KNOWN gaps. He asked for the other list.
So I measured the file he actually taps.

  slices/BOHEMIA_ALPHA_0_9.html was 38.7 MB, gaining ~1.4-2.1 MB/day off real git history.
  GITHUB REJECTS ANY FILE OVER 100 MB. Not a warning - the push fails.
  ~43 DAYS AND EVERY LANE IN THE FLEET LOSES THE ABILITY TO PUSH THE GAME.
  And the one link cost him 65 SECONDS on weak LTE before the splash could draw.

Not a hard problem. An UNWATCHED one - which is what an unknown-unknown actually looks
like: it would have landed on an ordinary Tuesday, on a limit nobody tracked, with no
obvious cause.

=== WHERE THE BYTES WERE ===
  line 6624   35.76 MB   const CITY_B64='...'   an entire HTML page, base64'd, inline
  line 1014    1.35 MB   COMBAT_B64, same trick
  everything else 0.90 MB - ALL the actual code in the game
96% of the file was two blobs, and base64 costs 33% on top of what it carries, so ~9 MB
was the ENCODING alone. THE CHEAPER PATTERN WAS ALREADY IN THE SAME FILE FOUR TIMES:
RUN / SLICE / LIFE / MAP all load their page from a sibling with data-src.

=== THE FIX AND WHAT IT MEASURED ===
CITY_B64 -> slices/BOHEMIA_CITY_WORLD.html, loaded with fr.src.
  alpha 38.7 MB -> 2.92 MB
  first load over HTTP (same origin model as Pages): 12,561 ms -> 398 ms. TWENTY-NINE
  TIMES FASTER, frame state byte-identical, zero console errors.
  The world page is now fetched only when he opens the tab, like the other four already.
GATES: FRONT DOOR 8/0, ALPHA LOADS 20/0, ONE WORLD TAB 120/0 (that is the gate that drives
the real RUN surface and asserts it shows the world - the strongest signal available).
run_gate could not run: it shells out to a tool that needs PIL, the same environment red
that fails 25 other gates. Not this change.

*** TWO THINGS THAT NEARLY COST THE WIN - EVERY LANE SHOULD KNOW BOTH ***
1. file:// LIES ABOUT ORIGINS. Locally the split looked BROKEN - same-origin false, parent
   could not read the frame. Chrome gives every file:// document its own opaque origin, so
   an inlined srcdoc frame is same-origin and a sibling src frame is not. On Pages both are
   https://paolosarn.github.io and the distinction does not exist. Served over a local HTTP
   server the split is IDENTICAL to baseline. IF I HAD TRUSTED THE file:// RESULT I WOULD
   HAVE THROWN AWAY A 29x WIN FOR A BUG THAT DOES NOT EXIST WHERE THE GAME RUNS.
   If you are testing anything about iframes, origins, storage or fetch, SERVE IT OVER HTTP.
2. A 37-MILLION-CHARACTER LINE DOES NOT END WHERE YOU THINK. That line does not stop at the
   closing quote - the entire tab-click handler is tacked onto the same line. Replacing
   "the line" deleted it and the app never opened. Edit the LITERAL, never the line.

=== THE ALARM, SO IT CANNOT COME BACK ===
gates/payload_wall_gate.py, registered as PAYLOAD WALL. Measures every tracked file,
projects the date off real git history, fails at a 45 MB budget - under GitHub's 50 MB
warning and well under the 100 MB wall - and names the offending lines.
STILL WORTH A LOOK, reported not fixed: the four BOHEMIA_HD_TILE_REPO_part*.txt banks are
42.7-43.5 MB EACH, just under budget and half way to the wall on their own.

=== WHAT COMES AFTER ===
1. COMBAT_B64 is still inlined at 1.35 MB - same one-line fix, now proven.
2. The four HD tile banks.
3. Nothing else in the repo is near the wall, measured, and the gate watches all of it now.

CHARACTER (0lurbs): 7/31 LATEST — CLIPS ARE A-Z NOW, THE COUGH HAND REACHES THE
MOUTH, AND HEADSHOT IS STILL OPEN. Main at db24121.

=== HIS STANDING ORDER, 7/30, OBEY IT EVERYWHERE ===
"I need you from now on in the ui to order them alphabetically i cant find what u
need me to find man." ANY list he has to SCAN is alphabetical, forever. Done: the
ANIMATION clip buttons (102, opens at 'air-guitar') and the CANON CLOSET inside
each category (221 garments). NOT sorted, on purpose: FACING and KNOCK are a
COMPASS (S SE E NE N NW W SW) and alphabetising them destroys the rotation; the
category headings read top-to-bottom like a body. The DATA never reorders --
CLIPS keeps authoring order because export/ANIMBEATS key off it, only the VIEW
sorts via a copy. Tool: tools/bohemia_ui_alphabetical_patch.py.
WHY IT MATTERS MORE THAN IT SOUNDS: the whole verdict loop depends on him FINDING
what you asked him to judge. 102 buttons in authoring order = he cannot, and
STALE UNJUDGED IS DEAD.

=== THE OTHER STANDING ORDER, 7/30 ===
"we gotta COOK ... 11 months of motion not bitching and complaining." He was
right that the lane was doing process work instead of shipping. Cook first,
report second, and never lead a reply with green gates.

=== SHIPPED THIS SESSION ===
- THE STATUES MOVE: 9 clips raised off sub-pixel amplitude. pray and winded
  rendered ZERO changed pixels (0.2px and 0.6px on a 56px sprite). Measured over
  8 facings: winded 954->3824, scratch-back 666->3538, cower 1404->3566,
  cough 2251->4301, pray 206->767. Gate: MOTION VISIBLE.
- THE COUGH HAND: he circled NE/E/SW, "the hand layer is fucked up". The hand
  landed at y18-20 while the face ends at y16, so it sat on the chest as a bare
  skin patch with its forearm buried in the torso. Fixed in the POSE (IK lift
  4->8), NOT with a layer rule -- he retired dynamic hand depth TWICE (7/2, 7/26).
  Chest bare-skin 45 -> 12 px; idle and walk are 0.
- ALPHA LOADS gate: the alpha must open in a browser with zero page errors and
  all three big blobs present AND full size. Built after main shipped a DEAD
  alpha for ~12 min (a merge ate RIG_B64 + COMBAT_B64 + BAKED).
- RIG CHECK gate: 22 rig-touching tools now cite the joints/parts they built on,
  re-derived from source; no second anatomy can exist beside BAKED.
- Whole-pixel canvas scaling (he could not see it -- recorded as a lesson, see
  BACKLOG 1b: a MEASURED defect is not automatically a FELT one).

=== OPEN, AND HE IS WAITING ON IT ===
1. HEADSHOT + HEADSHOT-2 ARE BROKEN (his words) AND I COULD NOT FIX THEM
   HONESTLY. What I measured: hsPose keeps ONE global ragdoll and restarts it on
   every direction change, and the ANIMATION tab renders all 8 facings at once --
       hsReset calls, 8-up grid (24 renders): 8    one direction (24 renders): 0
   I built the per-direction state swap for it. It moved head-drop travel from
   12px to 13px over 1.2s, and the body demonstrably FALLS in both builds, so
   that is NOT the visible defect. REVERTED rather than shipped as a fix that
   fixes nothing. The reset thrash is real and worth fixing eventually; the thing
   he is actually looking at is still unexplained.
   ASKED HIM: does it not fall at all, or does it fall wrong? Wait for that
   answer before touching the ragdoll -- do not guess a third time.
   NOTE: 'ragdoll' and 'death' are GRAVEYARDED (never re-add). headshot and
   headshot-2 are NOT -- they are live clips, so fixing them is legal.
2. WHISTLE (34) and SEARCH (24) measure the same chest bare-skin pattern cough
   had. DELIBERATELY NOT TOUCHED (back-limb law wrong-turn #5: "a fix that is
   *good* is not thereby *general*"). A hand at the mouth may be correct for
   whistling. Surfaced to him for a ruling.
3. [PENDING Paolo] far-hand depth on E/W (far 153.2 vs near 153.8, no depth cue).
4. [PENDING Paolo] unbuilt slider ideas: leg length vs torso, frame/bulk,
   posture, neck length.
   BORDER TONE IS CLOSED: it stays black, he answered it the first time and got
   annoyed being asked again. Do not re-ask.

=== HOW THIS LANE SHIPS NOW (learned the hard way today) ===
NEVER hand-resolve an alpha conflict. Take main's alpha WHOLE
(git checkout --ours), re-run the idempotent patch tools, re-stamp, run
ALPHA LOADS, push. Every tool in this lane is idempotent and refuses to write
unless its edit resolves exactly once. A pre-rebase green does NOT transfer: if
main moved, the tree you are pushing is one no gate has ever seen.
DEPLOY VERIFY CAVEAT: from this environment github.io is proxy-blocked AND the
GitHub actions listing comes back CACHED (asked per_page=3, got 30, byte-identical
every call). db24121 is git-verified as the tip of main with the right stamp, but
the Pages run could not be confirmed from here. Do not claim "live" off that API.

--------------------------------------------------------------------------------

CHARACTER (0lurbs): 7/30 LATEST — I CAUSED THE DEAD ALPHA BELOW, AND I BUILT THE
GATE THAT MAKES IT UNREPEATABLE. The one red the SOUNDS lane left me is now GREEN.
Read their section next; it is accurate and I am not softening any of it.

=== WHAT I OWED THEM, PAID ===
SOUNDS was right on every point. Their handoff says CANVAS SCALE was red on main
for one check -- "the RIG preview composites NEAREST-NEIGHBOUR" -- because my
commit deleted RIG_B64 instead of replacing it with the patched one, and that the
restore neither caused nor worsened it. Correct, and they were right not to touch
my tab's blob. RIG_B64 is now regenerated with image-rendering:pixelated inside
its <style>. CANVAS SCALE: 29 passed, 0 failed. 165 of 165.

All 13 character surfaces now land on exact whole-number scales:
    charCv x3 · portraitCv x2 · cloBig x3 · cloCv x1 · g8_0..7 x1 · rig cv x1
Fractional canvases 19 -> 4. The 4 left are combat/city and belong to those lanes.

=== THE GATE THAT COMES OUT OF THE EMERGENCY ===
SOUNDS wrote: "a page-error probe ... takes 10 seconds and would have caught this
before it ever reached him." That is now a gate, not a suggestion.

gates/alpha_loads_gate.js (wired into the suite, ~5s, ALPHA LOADS 20/0):
  - the alpha loads in a real browser with ZERO page errors, and BAKED / drawChar
    / MUS exist at runtime with all 8 facings present
  - RIG_B64, COMBAT_B64 and BAKED are present AND still full size -- a floor on
    each, because a TRUNCATED blob is a silent art loss that never throws
  - exactly ONE buildstamp div, and no loose HTML tag at the start of a line in
    any script body (that is the exact signature of what I shipped)
  - no conflict markers (keeps the 7/29 regression dead too)
Law: laws/BOHEMIA_ADDENDUM_THE_ALPHA_MUST_LOAD_7_30_26.md

WHY IT IS DELIBERATELY CHEAP: the full suite is ~590s, and that is precisely why
it got skipped under time pressure. A guard you skip is not a guard. Run this one
before every push; it is affordable enough that there is never a reason not to.

THE PROCESS FAILURE, NAMED SO IT IS NOT REPEATED: my full suite HAD run green --
BEFORE the rebase. Main moved 161 commits and I did not re-run, because the
earlier green still felt like it counted. It did not. A green from before a
rebase describes a tree that no longer exists. The 7/29 conflict-marker pre-push
guard passed truthfully here; this merge left no markers, it deleted a megabyte
instead. A guard that checks one signature of a bad merge says nothing about the
others.

I FOLLOWED THEIR RULE THIS TIME. Their "NEVER RESOLVE AN ALPHA CONFLICT BY HAND"
is now how this lane ships: `git checkout --ours slices/BOHEMIA_ALPHA_0_9.html`
(take main's alpha whole), re-run the idempotent patch tool, re-set the stamp,
run ALPHA LOADS, push. This ship did exactly that and lost nobody's bytes.
NOTE FOR WHOEVER IS NEXT: the RUN lane landed the restore (ccb0d68) while my
suite was running, so the BAKED on main is THEIRS, not my splice. Mine was
byte-identical from 7bf83a1~1 but it is theirs that shipped. Credit where due.

=== CHARACTER LANE STATE ===
SHIPPED AND GREEN (this session): the 1px black outline on all 8 facings; the
neck as its own skin TONE (not a shadow) + throat rows, E/W one row shorter per
his ruling; his curtain-bob hair applied verbatim; his chin/neck rig edit applied;
A LONG SLEEVE STOPS AT THE HAND (0 arm cells render bare skin on E/W/S);
CLOTHES FOLLOW THE BODY; shoulder share + rigid arm; the SHOULDERS / ARM LENGTH /
HIPS dials with legs tied to the arms dial; whole-pixel canvas scaling.

[PENDING, PAOLO'S CALL] -- do not decide these:
  1. Border tone: pure black / dark brown 38,30,26 / softer brown 58,46,40 / none
     (anchors: records/outline/BORDER_TONE_CHOICES_7_27_26.png)
  2. Far-hand depth on E/W: far reads 153.2 vs near 153.8, so there is no depth
     cue at all. Either a separate shading layer (SHADOWS ARE SEPARATE, 7/26) or
     do not draw the far hand in profile. Not my call.
  3. Unbuilt slider proposals he has not ruled on: LEG LENGTH vs TORSO,
     FRAME/BULK, POSTURE, NECK LENGTH.

ANSWERED HONESTLY, NOT QUIETLY DROPPED: he asked for a 0.5px border. It is
impossible -- the pixel grid plus the RENDER PIXEL gate forbid half-pixel draws.
The `outerOnly` alternative was measured byte-identical (12,170 pixels either
way, 0% less black), so the dead code was removed instead of shipped as a fake
improvement.

RULINGS RECORDED THIS SESSION: FAT IS FAT -- no sex-aware fat distribution, and
the gate blocks `bust` / `fatDistribution` / `gynoid` as identifiers. A woman
reads through "slightly skinnier arms, shorter" plus narrow shoulders. NO female
rig, ever.

TILE FORMS FILED (art lane cooks from these, I cooked nothing):
  TF-CHAR-001 contact shadow (row 7, HIGH) · TF-CHAR-002 stage ground (row 8,
  HIGH) · TF-CHAR-003 footfall dust (row 12, MED) · TF-CHAR-004 portrait
  backdrop (row 13, LOW)

--------------------------------------------------------------------------------

