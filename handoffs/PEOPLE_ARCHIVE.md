# PEOPLE ARCHIVE (rule 96: the blocks older than the lane's two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)

<!-- moved 10/16 (CORRECT: AI and AK (the hearback's NEGATIVE folded in; sweep AK: the trail file's round 2 first, one commit)) -->
PEOPLE (people-7h9sfy): 10/10 LATEST -- *** PLUMBER FLAGGED TWO REDS FROM MY
LAST SHIP. FIXED BOTH. ***
TAB: VOTE, item THE LONG INJURY and THE KEEPERS SPEAK.

One flag was already fixed by another lane before I even got to it. The
real one left was my own newest cook tool, which never got the standing
reference-check note every cook page needs. Added it.

The other: I bumped the title screen's build number without re-cutting the
demo file, so the demo and the real build drifted four bytes apart.
Re-cut it. Checked it matches exactly now.
Gates clean. Nothing [PENDING Paolo].

PEOPLE (people-7h9sfy): 10/9 (e) LATEST -- *** [the long injury] SHIPPED.
COMBAT HAD ALREADY CLAIMED THE SAME CARD AS PART OF THEIR OWN JOB, SO I
BUILT IT ONCE AS A SHARED PIECE, NOT A SECOND COPY. ***
TAB: VOTE, item THE LONG INJURY. NOT IN A TAB YET on the live fight or the
live settlement screen (COMBAT's and RUN TWO's own files, a review file
names the exact call).

His own locked words: get struck down in a fight, 20% you die, 80% you live
with an injury that keeps you out 30 to 40 real days and leaves a
permanent mark, a scar or a limp or a lost eye. The odds were already real
numbers in the tuning table. What was missing was the actual mark itself:
his one pain line, his real days left, what he cannot do.

Found that COMBAT already has this exact card inside their own claimed job.
So instead of writing a second, different version, I built it once as a
small shared piece anybody can read from, and left them a note on exactly
how to use it.

All eleven real injuries, all real wording, nothing made up. Checked every
number against the real file before shipping.

Also found and wrote down (not fixed): an older piece of this game
promises nobody ever carries anything permanent. His newer words say
otherwise for this one case. Newer wins, named for whoever cleans it up.
Gate 43/0. Nothing [PENDING Paolo].

PEOPLE (people-7h9sfy): 10/9 (d) LATEST -- *** [the keepers speak] SHIPPED. A
SECOND LANE HAD ALREADY MEASURED THIS SAME JOB AND LEFT HALF OF IT WRITTEN;
I FINISHED IT INSTEAD OF REDOING IT. ***
TAB: VOTE, item THE KEEPERS SPEAK. NOT IN A TAB YET on the live settlement
screen (RUN TWO's own file to wire, a review file names the exact call).

Read RUN TWO's settlement screen before building anything. Two of the three
things this row wanted already had a working mechanism (the trait line, the
rumour), and WORDS had already written the actual words for them (15 trait
reactions, 5 keeper rumour hooks) in their own shipped round, left as a
review file. I applied that content into the two real data files it belongs
in. Nothing invented, nothing redone.

The one real gap was a spoken PRICE for the smith, the armourer, the
barber, the clinic and the board. WORDS looked at this too and decided not
to build it, since three of the five have no single flat number (every
weapon, every wound, every job prices itself) and forcing one in would be
inventing a price the game doesn't have. I agree with that finding but not
the conclusion: a real range off the actual shelf, or a real formula's real
floor, is not an invented number. Built it as its own small, pure piece
(engine/bohemia_keeper_lines.js), every number checked against the exact
real file it lives in.

Did not touch the live settlement screen itself (that's a different lane's
file). Left a review file naming exactly what to wire in, same as WORDS did
for me.
Gate 48/0, new. Nothing [PENDING Paolo].

PEOPLE (people-7h9sfy): 10/9 (c) LATEST -- *** PLUMBER FLAGGED MY OWN JUST-SHIPPED
VOTE SHEET RED, RULE 22F: THE WHY DIDN'T SAY WHERE HE SEES IT. FIXED. ***
TAB: VOTE, item GOOD BROS AT THE POST.

The why for people-good-bros-10-9 was two sentences but never said where to look.
Rewrote it to name the VOTE tab and the item's own title in the second sentence.
gates/vote_tab_gate.js no longer lists this id as red. Nothing else touched.
Nothing [PENDING Paolo].

PEOPLE (people-7h9sfy): 10/9 (b) LATEST -- *** [good bros] SHIPPED. SIX REAL
RECRUITS AT THE POST, REAL WIKI STATS AND PRICES, A SELF-CAUGHT CROWNS-VS-
BATTERIES BUG FIXED BEFORE IT SHIPPED. ***
TAB: VOTE, item GOOD BROS AT THE POST (no settlement screen to host it on yet).
Record: records/BOHEMIA_GOOD_BROS_10_9_26.txt.

Six real Battle Brothers backgrounds (the ones of 77 with a real observed hire-cost
range, not a formula guess), real stat ranges, Grok's real star mechanic (60/30/10).
Caught my own bug before shipping: first draft showed the raw crown roll labelled
"batteries" (a farmhand would have shown 175 instead of the real ~18); fixed to
convert at the ten-to-one rate, and also caught that the real daily wage was about
to get charged when the row says "bought once, 0 a day" -- same fix rule 56 already
made on the retinue, caught this time before it shipped wrong.

Real names on every recruit, from the same name-mix system every citizen already
uses -- added as PEOPLE's rule-80 "better than Battle Brothers" line: a recruit is
a person first, a recruit second.

NOT BUILT: traits (no master trait list exists anywhere in this codebase, checked
not assumed); the actual hire-and-join screen (RUN TWO's, not built yet); a real
company bond for a hire (bohemia_company.js's membership is computed from bonds and
witnesses, never a second roster -- naming the right hook is next, not faking one).
Gate 43/0, new. Nothing [PENDING Paolo].

PEOPLE (people-7h9sfy): 10/9 LATEST -- *** [followers] CORRECTED, ROOT CAUSE: HIS
"BOUGHT ONCE, NO WAGE" RULING SAT UNFIXED A ROUND; FIXED, AND THE REAL SIX ROLES
REPLACE FOUR GUESSED ONES NOW THAT GROK ANSWERED. ***
TAB: CITY, the walked street. Cook and record updated in place (same files, not forked).
Record: records/BOHEMIA_THE_RETINUE_10_1_26.txt (new CORRECTED 10/9 section at the top).

Deleted the nightly wage debit and everything built to collect it -- his fifth votes
said it was wrong and it had sat that way since. Swapped the four guessed roles
(mechanic, medic, fixer, driver) for the real six (cook, scout, lookout, paymaster,
blacksmith, surgeon; there is no "negotiator") now that Grok's cited wiki page landed.
Prices are the wiki's own crowns at ten to one. Scout keeps its real travel-time cut;
paymaster now discounts other hires' one-time price instead of a wage that's gone.

Found a second bug while rebuilding: the "declined" flag was being set at ASK time,
not at an actual decline, so being unable to afford a role got permanently remembered
as a no. Fixed; proven in the gate's real-city walk (fund after a can't-afford, same
role offered again). Gate rebuilt in full, 43/0. Nothing [PENDING Paolo].

PEOPLE (people-7h9sfy): 10/1 LATEST -- *** [followers] SHIPPED. THE RETINUE: FOUR
NAMED HIRES, ONE A REAL CUT ON TRAVEL TIME, ONE A REAL CUT ON THE OTHER THREE'S
WAGES, TWO HONESTLY NOT LIVE YET. ***

Row (rule 48's translation table, the second of two it named NOT STARTED, the
first being [ambitions] last round): THE-RETINUE. Battle Brothers hires camp
staff (scout, surgeon, negotiator, blacksmith) for a daily wage. The board row's
own translation: the mechanic, the medic, the fixer, the driver (the
beast-handler is [keepers]'s own row).

CHECKED FIRST: the reference library has nothing on followers at all -- it is
Grok ask #9, unanswered (our own sandboxes cannot reach the wiki). Rather than
guess precise Battle Brothers numbers from memory, this ships the MECHANISM
against the row's own stated shape, every number tuned:false, same discipline
as [ambitions].

TWO EFFECTS ARE REAL TODAY, found by reading the actual code rather than
assuming: the DRIVER's hire multiplies cityStepMins (the real function the
map's own travel-speed system calls for every block) by 0.85. The FIXER's
hire makes every OTHER hired follower's wage due only every second time wages
are collected. TWO ARE HONESTLY NOT LIVE: the MEDIC would heal wounds faster,
but no wound clock exists in code (rule 36b is a ruling, not a mechanism); the
MECHANIC would repair cheaper, but the only repair fact in this codebase is a
flat spent/not-spent switch, not a meter to discount. Building a fake meter
just to give them a job would be inventing a system nobody asked for.

THE WAGE IS A TRANSFER, NOT A FIFTH FROZEN VERB: the purse's upkeep() refuses
a fifth verb by name ("a fifth is a design change, and design changes are
Paolo's"), so wages debit directly -- the identical shape [block rent] already
used for the same reason. An unpaid follower leaves the same night, no
invented grace period, same immediate consequence an unpaid circuit already
gets.

THE PICK IS THE ASK ITSELF, reusing [ambitions]'s own proven companion mouth
(rule 19/20 killed a card, a new button is UI's call on a settlement screen
that doesn't exist yet). UNLIKE ambitions, this round BUILT the accept/decline
gesture ambitions named as missing: an offer stays live and silent for two
beats (120 BPM, 500 ms/beat, the same window [bb company]'s own retired
fall-in mechanic used) with the same companion still the one you're with, then
they fall in; walking off to somebody else declines for free, never asked
again this session for that role.

*** A BUG THIS ROUND FOUND IN ITS OWN FIRST DRAFT, BEFORE IT SHIPPED: *** a
single decline on the very first role offered would have silenced the WHOLE
mechanism forever. offerFor only skipped roles already HIRED, never ones
ASKED-and-declined, so after a decline the first unfilled slot was still the
same slot, offered again every time -- except the once-ever-ask guard would
then refuse to speak it, so nothing further was ever offered. Caught by
writing the gate's own decline-then-advance test BEFORE trusting the
mechanism and watching it fail. FIXED: offerFor now skips a role that is
EITHER hired or asked. NEGATIVE-CONTROLLED in the gate itself: the exact
pre-fix function is reconstructed as a [self-test] and proven to still
reproduce the block, right beside the real function proving it does not.

BUILT: engine/bohemia_followers.js (four FOLLOWERS, all tuned:false),
inlined into BOHEMIA_CITY_WORLD.html exactly like [ambitions] and
[bb company]. ctFollowerBark wired into the SAME bark ladder, right beside
[ambitions]'s own entry. followerWagesNight wired into the real nightfall
sequence, right after loanNight(), using its OWN internal night counter for
the fixer's relief parity (not the game's own day number -- a cleaner,
self-contained design found while debugging the gate, see below). The
driver's multiplier is one extra multiply inside cityStepMins, a no-op by
default.

ONE MORE THING THE GATE CAUGHT DURING BUILD, NAMED FOR THE RECORD: the first
draft tried to key the fixer's "every other night" relief off the game's own
DAY.day. The gate's own test proved this wrong immediately -- DAY.day turned
out to already be 1 on a fresh boot (not settable the way a plain property
assignment would suggest, likely derived rather than stored), so a test that
set window.DAY.day=0 and expected that value back got silently overridden.
Rather than fight another lane's clock semantics for a detail nobody but this
mechanism cares about, [followers] now owns a tiny internal counter
(CT_FOLLOWER_NIGHTS) for its own relief parity, while still passing the REAL
day to the purse's ledger for honest history. Simpler, fully self-contained,
fully testable on demand.

PROVEN ON THE REAL CITY: ask fires once in the real words; two beats with the
same companion hires through the real bark; the second role offered is the
next one, never a repeat; walking off before two beats declines for free AND
the next offer skips straight past the declined role (the exact bug above,
proven fixed on the real surface, not just the pure function); a night with
two hired followers charges 2 electricity; the very next night, relieved,
charges 1; the night after, 2 again; the driver's real effect read off the
real cityStepMins is exactly 0.85x; draining the purse removes everyone who
can't be paid in the same beat and the next bark announces it in the real
declared words; nobody walking beside the player, it never speaks at all.

THE GATE: gates/followers_gate.js, new (REUSE-FIRST: nothing existed to
extend). 44/0: pure mechanism never throws, every number tuned:false, the
decline-fix negative-controlled, the wage currency checked against the real
locked list, the frozen upkeep() verbs table checked to still hold exactly
its original four, followerWagesNight checked structurally to never call
upkeep()/upkeepPost(), the driver's hook checked to be wired into the real
cityStepMins body, the full real-city walk above. Checked for collateral:
ambitions_gate 34/0 unaffected, people_gate 158/0 unaffected (both reconfirmed
after this round's edits, not assumed from an earlier run).

Cook: THE RETINUE, in VOTE -- the real offer, the real hire, the real unpaid
departure, in the game's own words, the four-role table naming which two are
live and which two honestly are not, the measured proof table.
Record records/BOHEMIA_THE_RETINUE_10_1_26.txt.

FOUND WHILE SHIPPING, FLAGGED NOT CHASED: QUESTS' own research landed the
SAME round (records/BOHEMIA_QUESTS_ROUND_SEVEN_TWO_SLOTS_PAIRS_AND_FOLLOWERS_10_1_26.md,
QR-AD) and reads Battle Brothers' retinue differently -- "18 followers,
one-off fee, deed unlocks, 5 slots by renown... no wage treadmill," a
generational "chamberlain class" that raises an apprentice offered to the
heir, plus 24 draft follower characters. That is a bigger, named,
generational shape, and "no wage treadmill" sits in real tension with this
round's nightly wage. NOT RECONCILED: the board row this round answered
explicitly asked for "a daily wage" in the coordinator's own words, which is
what got built, honestly and completely; QUESTS' finding is itself unverified
research, not a ruling, and folding in named characters and an
apprentice-to-heir handoff across generations is a real round of its own, for
the next [followers] round, DYNASTY (the heir thread), and TUNING (wage vs.
fee) to pick up.

MEASURED, NOT FIXED, named rather than built speculatively: "hired at a
place" is not yet an actual place -- reuses the companion mouth for the exact
reason ambitions did (a settlement-screen building is RUN's surface to build,
not there yet); when it ships, the same pure offerFor/askLine/hireLine
functions get called from a building tap instead, not rewritten. No
persistence of CT_FOLLOWERS/CT_FOLLOWER_OFFER/CT_FOLLOWER_NIGHTS across a
reload -- the same pre-existing, shared gap every bark-state tracker in this
file already has (CT_AMBITION and CT_WALKS_WITH itself included), not
introduced or scoped to this round alone.

TAB: CITY, the walked street, until the settlement screen exists. VOTE, for
the cook. Nothing [PENDING Paolo] from this block.

PEOPLE (people-7h9sfy): 9/30 LATEST -- *** [ambitions] SHIPPED. THE COMPANY NOW SETS
ITSELF A GOAL, ASKED AND ANSWERED THROUGH A MOUTH, NEVER A CARD. ***

Row (rule 48's translation table, one of three it named NOT STARTED):
A-GOAL-THE-COMPANY-SETS-ITSELF. Battle Brothers pays a chosen ambition ("hire 12
men", "amass 5,000 crowns", "reach 1,000 renown") in RENOWN. This game's
currencies are LOCKED AT EXACTLY THREE
(laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md) and none of them is
a renown-shaped score, so renown was the one word this row was not allowed to
translate literally, and the whole design question was what replaces it.

THREE GOALS, each a REAL fact this game was already keeping, none invented:
keep three people close (bohemia_company.js's own yours().length -- reads 0 on
a fresh save, this game has no recruitment roster, so 3 not Battle Brothers' 12
or the goal is decorative), bank ten batteries (bohemia_purse.js's real
electricity balance), and earn one faction's trust (the belonging ladder's own
rung, 'useful' or better with any one of the sixteen real factions -- the SAME
organ [somebody hires you] already reads). The reward is 2 electricity, paid
through the real purse credit() function, because batteries are the existing
"you did something, here's a little something" channel every other moment in
this game already pays through.

THE PICK IS THE ASK ITSELF, not a second gesture. Rule 19/20 already killed
cards as a surface, and a new button is a surface call for a settlement screen
that does not exist yet, outside this lane's authority to build mid-round. So
the companion already walking with you (rule 32a, [bb company]'s own proven
"stay near me" grammar) proposes the goal; staying near them sets it. Ignoring
it costs nothing -- an honest free no, matching rule 35c.

BUILT: engine/bohemia_ambitions.js, a pure module (three GOALS, one REWARD, all
tuned:false, four functions: progressOf/offerFor/askLine/doneLine). Wired into
BOHEMIA_CITY_WORLD.html's own bark ladder, the SAME dispatch every mouth in
this game already goes through, right beside [bb company]'s bark: gated on a
real companion actually present; asks the next undone goal once; announces
completion and pays the reward once when the real fact goes true; never
repeats a paid goal.

PROVEN, NOT ASSERTED, on the real city: a fresh save reads honestly at zero
everywhere; the ask fires in the real words through the real bark; asking again
while undone stays silent; fabricating the real fact (three people yours)
fires the real completion line and moves the real purse 0 to 2 electricity in
one step; the next goal is offered immediately, never a repeat; the reward
never pays twice even though the condition still reads true; with nobody
walking beside the player, it never speaks at all.

THE GATE: gates/ambitions_gate.js, NEW (REUSE-FIRST: nothing existed for this
mechanism to extend). 34/0: the mechanism never throws on bad input, every
number is tuned:false, the reward currency is checked against the real locked
list in bohemia_purse.js rather than asserted from memory, the city wiring
never opens a card (checked structurally against the real function bodies, not
by pattern-matching a comment), the reward is paid through the real credit()
function. One self-inflicted gate bug found and fixed this round: the
"never opens a card" leg's string-slice bound matched an internal closing
brace early and truncated the check before it reached the real BARK.text line;
fixed by bounding on a stable next-function marker instead. Checked for
collateral: people_gate.js 158/0, clean.

Cook: A GOAL THE COMPANY SETS ITSELF, in VOTE -- the real ask, the real
completion line, the real next ask, in the game's own generated words, with
the measured proof beside them.
Record records/BOHEMIA_AMBITIONS_9_30_26.txt.

MEASURED, NOT FIXED, named rather than built speculatively: no explicit
accept/decline gesture beyond staying near the companion (a future round could
add a real second-beat accept/decline, matching [bb company]'s own pattern, if
that reading turns out wrong); no persistence of the active/asked/paid guards
across a reload -- this is a PRE-EXISTING, SHARED gap across every bark-state
tracker in this file (CT_ROAD_SAID, CT_HURT_SAID, CT_WAS_SAID none survive a
reload either), not something this round introduced or is scoped to fix alone.

ALSO NOTED, NOT FIXED, out of this round's scope: engine/bohemia_people.js IS
one of the modules tools/build_run_slice.js inlines into
slices/BOHEMIA_RUN_SLICE_7_26_26.html's SRC, so the 9/29 [used to be] round's
fix to that file should have had slices/BOHEMIA_RUN_CURRENT.html rebuilt to
carry it and did not. engine/bohemia_ambitions.js and engine/bohemia_company.js
are NOT referenced by either tools/build_current_slice.js's or
tools/build_run_slice.js's source files (checked directly, by grep, not
assumed), so neither derived slice needed rebuilding for this round -- BOTH
live only inlined in BOHEMIA_CITY_WORLD.html, which those two tools never
read. Flagging the real gap for whichever round next touches
bohemia_people.js or owns build hygiene, rather than running a rebuild here
that would pull dozens of unrelated concurrent lanes' art-bank changes into a
commit about a company goal mechanic.

TAB: CITY, the walked street, until the settlement screen exists (RUN owns
that migration for every mouth in this file). VOTE, for the cook. Nothing
[PENDING Paolo] from this block.

PEOPLE (people-7h9sfy): 9/29 LATEST -- *** [used to be] SHIPPED, FOUND THROUGH A
CROSS-LANE FLAG WITH NO BOARD ROW, NOT INVENTED. ***

The board was genuinely empty this round: every PEOPLE row SHIPPED or HELD, no
OPEN, no CLAIMED. Spent real effort confirming that before building anything
(an Explore agent + my own greps: QUESTS' [company voices] page names PEOPLE but
its one concrete ask depends on RUN's not-yet-built settlement screen; DYNASTY
already owns rule 39c/d's heredity and heirs work; [honest crowd], the one HELD
row, is walked-street crowd density on ground the map/settlement transition is
actively retiring this exact round -- UI's own 9/29 handoff says "the first
screen is the map now"). Rather than build on ground about to be cut twice in
one session, found and fixed a small, real, UI-flagged bug instead: rule 39b
housekeeping on the [bb company] row's BB citation (what we do differently) was
the other small thing this round, see VAMILY.md.

UI's own 9/28c handoff, building a companion detail page: "NOT on her record...
her background (wasOf returns null for 'watch', named for PEOPLE)."

wasOf() (engine/bohemia_people.js, [former jobs]'s own function) refuses to
answer without a person's `key`. That gate is deliberate: its own comment
documents a 9/6 bug where a raw roster object (carrying `id`) and a wrapped card
object (carrying `key`) answered DIFFERENTLY for the identical human, because
hashing a bare id and hashing a prefixed key are different hash inputs. UI's new
page hit the SAME defect class one layer further back -- it reads
bohemia_population.js's raw personFields() record directly, which carries `id`
and never `key`, so it got silence instead of a wrong answer. A real companion
showing no background is still the "which object asked" failure, just quieter.

BUILT: wasOf() now derives a key when one is missing, but NOT by hashing the
bare id (the actual cause of the 9/6 bug) -- it builds the SAME prefixed key
('P:city:' + id) the real wrapper constructs everywhere else in this codebase
(four other call sites in BOHEMIA_CITY_WORLD.html do exactly this). So a raw
record and its properly wrapped twin now hash identically and answer
identically. PROVEN, NOT ASSERTED: pulled 24 real people live off the
population generator, asked both ways, compared -- 0 disagreements. A different
id shape (household agents, 'H<n>-<n>', needing a blockSeed no lone object
carries) is still correctly refused, not guessed at -- checked by regex, not
skipped. Applied to engine/bohemia_people.js and its inlined twin in
BOHEMIA_CITY_WORLD.html; confirmed byte-identical in this function both before
and after, per ENGINE SYNC LAW.

THE GATE: gates/used_to_be_gate.js EXTENDED, not duplicated (REUSE-FIRST) -- this
exact function already had a dedicated gate with a full real-demo section. ONE
ASSERTION HAD TO CHANGE ON PURPOSE: "without a key it refuses" was the old
guard, and it is now false for a raw record, correctly, because refusing was
never the real goal -- answering the SAME WAY every time was. Replaced with the
actual invariant (raw and wrapped agree) plus a new leg proving the
household-agent shape stays refused. NEGATIVE-CONTROLLED: ran the new assertion
against the pre-fix file (extracted from git history, tree never touched) and
it correctly failed there. 37/0 after, including the gate's own real-demo walk
(47 real people near the spawn, all 47 answered, nothing threw). Checked for
collateral: people_gate.js 158/0, clean.

Cook: ONE HUMAN, ONE PAST, in VOTE. A real scavenger pulled live off the
generator, asked both ways -- the old rule (still runs, shown for comparison)
says nothing; the fixed rule gives her real former trade. Real function, real
data, styled to the game's own card CSS so it reads the way it will once UI's
page actually ships it.

NOT TOUCHED, ON PURPOSE: UI's own new companion-page code -- their row, their
claim, and it needed zero changes from me. Their page should show a real
background the next time they pull this branch's history.

Record records/BOHEMIA_ONE_HUMAN_ONE_PAST_9_29_26.txt. Nothing [PENDING Paolo]
from this block.

PEOPLE (people-7h9sfy): 9/28 (b) LATEST -- *** [family eyes] SHIPPED, AND FAMILY_GATE
WAS ALREADY GREEN AT THE EXACT BUG IT WAS SUPPOSED TO CATCH. ***

Row (the board, PORTRAIT 53cbb684, HELD under rule 18 since 9/21b): "DENISE, RAY,
MARCO and NINA all have eyes 80,110,150; heredity copies one parent and never
varies. Real families do not come out four of four. The fix is a coin between
the two parents per child and a rare third."

RE-CLAIMED FIRST, PER RULE 12: dozens of this lane's own rows have shipped
straight to the alpha since the rule 18 hold landed, the MODE line itself says
the hold is on the play surface not the making, and unlike its held neighbour
([honest crowd], genuinely tangled with the LANGUAGE gate) this row had nothing
left blocking it. Claimed and pushed before touching any code.

MEASURED FIRST: family_gate.js's own claim ("family shares eye colour more than
strangers") was passing at 100.0% agreement against a 17.3% stranger baseline --
100% satisfies "more than strangers" just as trivially as it hides the exact
degenerate case the row names. A gate asserting only a direction, never a
ceiling, cannot tell a healthy family from a frozen one.

TWO BUGS, STACKED, NOT ONE. First: pick()'s "copy from a parent" branch
re-hashed the parent's id from scratch (faceRollHash(pi, salt)) instead of
reading the colour that parent is actually wearing -- TWO WRITERS FOR ONE FACT,
this lane's oldest recurring shape, and the fix was already sitting a few
hundred lines down: the DESCENDANTS generator (built for the three-generation
flip) already reads `ancestor.eyes.iris` directly rather than re-deriving it.
Second: RAY and DENISE, who share no blood and roll independently, had already
landed on the identical IRIS palette entry by a plain 1-in-6 coincidence -- and
because FAMILY_CAST is fixed, hand-authored content, never re-rolled between
saves, that coincidence was permanent, not a one-time bad break a player might
not even see.

BUILT: famFaceKey now resolves a child's parents through faceFor FIRST (same
order as the existing over.kin id list) and hands the child their parents' real
rendered specs as over.kinFaces; pick() reads a parent's actual value when it
has a path to that trait (iris, brow colour, lip colour -- the three categorical
picks this bug touches; hair texture and hair part, never the named bug, keep
their old behaviour byte for byte). Separately, the SECOND parent processed now
avoids whatever the FIRST already wears (over.avoidFaces, one direction only,
nothing circular to resolve) -- pick()'s own-roll branch nudges one palette seat
over on a collision rather than re-rolling. AND a third, smaller bug in the same
function: the "rare third" branch used R(salt), which rides kinMix toward the
parents' blended mean -- right for a numeric dial, wrong for a colour, and the
file's own comment three lines above it says so. Changed to
faceRollHash(id,salt) directly: a no-op with no kin (R already equalled that),
a real independent roll with kin.

MEASURED AFTER: 50.0% pairwise eye-colour agreement, not 100%. RAY keeps his own
roll; DENISE moved to the next palette seat over; MARCO and NINA each still take
their own independent coin flip between their two ACTUAL parents (not a re-roll
of either), and both happened to land on their mother this time -- which is
ordinary heredity, not a bug, since each kid's flip is genuinely independent.
Skin and hair colour agreement UNCHANGED, byte for byte (16.7% each) -- hair
colour already read real parent values through a separate, already-correct path
(NPCFactory) and was never the named defect.

NEGATIVE-CONTROLLED, NOT JUST ASSERTED: extracted the pre-fix alpha straight
from git history (the parent commit, never stashed, working tree never
disturbed) and ran the two new gate claims against it -- both correctly went
red (100.0% agreement, parents colliding), proving the claims can fail before
trusting that they now pass.

THE GATE: family_gate.js EXTENDED, not duplicated (REUSE-FIRST) -- this exact
claim already lived there since 8/31, so two legs joined it instead of a new
file: "the house is not four of four" and "the parents do not share by
coincidence." 17/0. Checked for collateral damage: people_gate.js 158/0,
talking_portrait_gate.js 34/0 (the face-diversity gate), both clean. Three
other family-adjacent gates threw the identical results on a stash of this
exact diff as on it applied (family_cast_gate.js and family_anim_gate.js: a
pre-existing loading-screen click race, confirmed pre-existing by running both
ways; the_family_is_in_the_game_gate.js: an identical 11/14 both ways, a
STANDING-card UI issue unrelated to faces) -- named, not fixed, not mine.

Cook: REAL FAMILIES DO NOT COME OUT FOUR OF FOUR, in VOTE. Eight real rendered
portraits (renderFace, the same one the whole valley uses), not colour
swatches -- BEFORE (extracted from the pre-fix commit) and AFTER (this one),
all four family members, so what he sees is the real generator's actual output
both times.

MEASURED AND NOT FIXED: the "rare third" is still a matter of chance, not
zero -- nothing stops some FUTURE hand-edit to FAMILY_CAST from landing on
another coincidence; guaranteeing that forever would mean hand-picking specific
colours, which is content, not mechanism, and not this lane's to invent. The
same "read the real value, not a re-hash" bug class may exist anywhere else a
categorical trait gets copied between two rolled (not hand-authored) people --
none exists yet outside FAMILY_CAST, so there was nothing further to sweep.

Record records/BOHEMIA_FAMILY_EYES_9_28_26.txt. Nothing [PENDING Paolo] from
this block.

PEOPLE (people-7h9sfy): 9/28 LATEST -- *** [somebody hires you] SHIPPED. A SITE
DISTRICT ALWAYS OFFERED THE SAME WORK TO ANYBODY, FOR EVER, AND THE GROUND
MOVED MID-CLAIM WHEN RULE 38 KILLED THE WALKED PAD. ***

Rule (the board): "a person offers you the job, and whether they will depends
on your standing... a stranger gets the worst work; somebody who vouches for
you gets you the better shift; a bad name closes doors."

MEASURED BEFORE A LINE WAS WRITTEN: kindAt() answered off the ground alone --
a site district offered 'site' to anybody. Two real systems already answer
"who are you to this faction" and neither had ever been asked: the BELONGING
LADDER (favors done for an outfit, starts at stranger, moves in ordinary play)
and the STANDING WEB (named people warm on you off a witnessed deed).

*** A FALSE PREMISE CAUGHT BEFORE BUILDING ON IT. *** The standing web's
DEED_WEIGHT ships empty IN THE MODULE, which reads as "dead until Paolo rules
it." MEASURED on the real page: NOT empty, 84 rows, filled at boot from the
quest corpus. It is live; a fresh save just has not touched a quest yet, which
is why the belonging ladder is the axis that actually moves early and the
standing web lights up later. Neither is faked to look reachable.

BUILT: doorFor(who) in bohemia_work.js, pure, `who` optional and backward
compatible (omit it, get the exact old behavior). A stranger at a site
district downgrades to scav, standing gets the real job, a hostile faction
closes the door outright, and standing can NEVER invent a job the ground never
had -- a stranger on a scav district stays scav no matter how vouched.

*** RULE 38 LANDED MID-CLAIM: tile-to-tile through the city is dead, places
become settlement screens you tap. *** The mechanism cost nothing: it has
always taken a faction's facts and (x,y), never "where his feet are," so
nothing about doorFor/offer changed. The ONE thing tied to the pad is
workOffer(), the city's reference caller, wired to the only surface live on
the alpha today. Whoever builds the settlement screen calls
ctHiringWho(faction) + BohemiaWork.offer(...,who) the identical way: find the
tapped building's holder, build a who, hand it in. Named as the pattern to
copy, not built here -- that surface is not this lane's.

ON THE REAL OVERMAP: fresh save honestly reads stranger/scavenge at a real
commercial district; 5 real favors through the asks save moved the SAME real
offer to work, live, no fabrication; a fabricated hostile relationship closed
the door entirely.

Cook: A STRANGER GETS THE WORST WORK, in VOTE, both frames the walked game's
own camera. *** page.screenshot(), not canvas.toDataURL() -- the work button
is a DOM overlay drawn on top of the canvas, and the first attempt's canvas
grab photographed real pixels that silently missed the one thing that
mattered. Caught before it shipped. *** Gate 38/0.

MEASURED AND NOT FIXED: the vouch half of standing can only be fabricated
today, not demonstrated on a fresh save (needs the quest corpus touched
first) -- named, not hidden. "What you used to be" ([former jobs]) is left
untouched: it is entirely an NPC system (WAS_WORDS), the player has no
equivalent identity anywhere in this repo, and assigning one would be an
IDENTITY decision that is his, not mine to invent. The work button does not
yet say WHY it downgraded (rule 19 wants a mouth, not a card, and that is its
own round's work).

Record records/BOHEMIA_SOMEBODY_HIRES_YOU_9_28_26.txt. Stamp 9/28d.

Nothing [PENDING Paolo] from this block.

PEOPLE (people-7h9sfy): 9/27 (c) LATEST -- *** [origins] SHIPPED. THREE OF HIS
FOUR ORIGINS WERE ALREADY WRITTEN INTO THIS GAME'S DATA A FORTNIGHT BEFORE HE
SAID THE WORD. ***

Rule 36c, Paolo 9/27: "origins at different difficulties." Law s3 splits it:
"PEOPLE writes the origins (the people), TUNING the difficulties."

THE SCHOOL, and its lesson is the sharpest thing in the subject: a Battle
Brothers origin that players remember changes A RULE TRUE FOR THE WHOLE RUN (who
you can ever hire, what work you can take, who will deal with you, a rule only
you have), never just a poorer start. AN ORIGIN THAT ONLY CHANGES A NUMBER IS A
DIFFICULTY SETTING. AN ORIGIN THAT CHANGES A RULE IS A DIFFERENT GAME.

*** MEASURED BEFORE A LINE WAS WRITTEN. *** WAS_WORDS has carried 15 former
trades since 9/6, and laid beside the four names he spoke:
  THE CASINO FLOOR   is the table's entire `front` house -- dealer, valet, pit
                     boss, floor man -- AND ALL FOUR CARRY keeps:null. Written
                     9/6 for a different reason ("the trade died and the empty
                     half has to be visible or the joke is not there") and it IS
                     this origin's whole rule, sitting in the data, early.
  THE LINEMAN'S CREW the machine half, every one keeping something that works
  THE NURSE'S WARD   the people half, every one keeping something
  THE EX-CONS        NOT IN THE TABLE AT ALL, because it is a list of JOBS and
                     being inside is not a job. Their crew is drawn from what
                     those men were BEFORE they went in, which is also the better
                     story: a yard already mixes every trade in the valley.

NO ORIGIN CARRIES A DIFFICULTY NUMBER: every row publishes difficulty:null and
names TUNING, because the law says so and because the school says a number picked
here would BE the design. The ladder is COUNTED: casino 0.00, excons 0.73 (marked
isPool, never a starting crew of 15), lineman 1.00, ward 1.00. THE FIRST AXIS
HONESTLY CANNOT SEPARATE TWO OF THE FOUR and that is admitted rather than padded,
so the table's own `house` field ships as the second axis. PROVEN NOT ASSERTED:
the gate hands the module a DOCTORED table where the dealer keeps something and
the casino floor moves 0 of 4 to 1 of 4, so a private copy would have been caught.

AND [the injured], rule 36b. *** NOBODY HAD EVER BEEN INJURED IN THIS GAME: the
down book on the alpha held ZERO people, so the 9/11 promise has been true by
accident, exactly the way that module's own header warns. *** Built the PERSON
half the law gives this lane: a MARK THAT OUTLIVES THE INJURY (a scar, a limp,
two fingers that do not close), TWO different sentences -- what a man says while
still OUT is not about the injury, it is about being no use -- no number ever
spoken aloud, and THEY ARE STILL YOURS WHILE DOWN with nothing written to make it
true, because the company is computed and there is no list to remove them from.

*** [PENDING Paolo] TWO OF HIS OWN LOCKED RULINGS COLLIDE AND I DID NOT PICK. ***
  9/11 LOCKED: "I don't want anyone to permanently die, or even have permanent
    debuffs."
  9/27 rule 36b: 20% die, and a PERMANENT mark including "a stat that never
    comes back".
Built the half where both stay true, on a distinction he drew himself: A SCAR IS
NOT A DEBUFF, A LIMP YOU CARRY IS NOT A STAT YOU LOST. Left to him and to TUNING:
the death chance (a number, and the exact thing 9/11 forbids) and the lost stat (a
permanent debuff in the plainest words). His 9/27 words were "your CHARACTER can
die", which may have meant the player and not the roster; that reading leaves both
rulings standing. ALSO NAMED: the injury lengths in the module are 9/11's own
examples (7/90/365 days) and rule 36b says 30 to 40. Both are numbers, TUNING owns
numbers, so this lane did not re-dial them.

RULE 34 SUPERSEDED THE STEP IS A HOUSE, WHICH LAST ROUND'S WORK CITED, AND IT
COSTS NOTHING: every number [bb company] shipped is DERIVED (the follow reach is
ctOnePress()+ctSeeRange(), the body spacing is the drawn body over the cell, the
join is measured in presses), so when RUN makes a step one cell they all follow on
their own. That is gated, not hoped: the_company_is_a_cast_gate holds that
ctOnePress reads the game's own step rather than a number somebody typed.

Cook WHO YOU WERE, in VOTE, both frames the walked street from the game's camera,
and they turned out to be THE SAME MAN TWICE: Trinh Nguyen saying what he can
still do, then the same man on the same corner after he went down. Gate 49/0.
Record records/BOHEMIA_WHO_YOU_WERE_9_27_26.txt. Derived slices rebuilt.

AND ONE MORE GATE LEG BUILT THE HARD WAY: two cuts of "the injured talk about it"
read zero on a build where they do, because a driven walk left nobody hurt in
earshot. A third cut of the same shape would have been the fourth version of a
thing that already failed, so it is a DIFFERENT KIND of test instead: stand next
to an injured man and ask the mouth directly. Deterministic, on the real surface,
and it can still fail.

Nothing [PENDING Paolo] except the collision above, which is the only thing in
this round that is his.

PEOPLE (people-7h9sfy): 9/27 (b) LATEST -- *** I DELETED TWO OTHER LANES' WORK
IN THE SHARED ALPHA AND CHARACTER FOUND IT, NOT ME. ROOT CAUSE FIXED AND THE
MACHINE CHECK THEY ASKED FOR IS BUILT. ***

FOR CHARACTER AND SOUNDS, AND FOR WHOEVER OWNS THE [PENDING coordinator] LINE
CHARACTER RAISED: it was mine, you were right, and here is the cause.
  ONE LINE in my own landing helper:  merged = my_txt.replace(stamp, next, 1)
It took MY WHOLE COPY of the shared alpha and swapped the build stamp, so
everything main had added since my branch point was thrown away. CHARACTER's 13
wired faction outfits and 20 colourway garments went; SOUNDS' 4-section room
filter went with them, the second time that exact fix has been silently reverted.
BOTH PUSHES REPORTED SUCCESS.

AND THE SAME TOOL'S REGISTRY HALF HAD THE IDENTICAL SHAPE: a HARDCODED item id
from two rounds earlier, so the vote item I was actually shipping was dropped
twice on two separate rebases, and both of those pushes reported success too.

*** ONE DEFECT, TWO PLACES: A TOOL THAT KEEPS A PRIVATE COPY OF A FACT INSTEAD OF
READING IT FROM THE THING IT DESCRIBES. *** LIFE+CITY named the same class in the
same hour about their own registry writer's fixed-indent regex.

FIXED. THE RULE IS START FROM MAIN, NEVER FROM ME: main's text is the base, my
change goes on top as the smallest possible edit, and the result is ASSERTED to
differ from main by exactly one line and for that line to be the stamp. Anything
else refuses. The registry is not resolved by that tool at all any more -- every
lane appends to it every round, so any rule for "what was mine" is another private
copy -- it gets spliced by hand, as text.

VERIFIED BEFORE WRITING ANY OF THIS: CHARACTER's restore is intact on main, and my
next push changed exactly ONE line of the alpha, measured by diff and not by hope.

*** AND THE MACHINE CHECK CHARACTER ASKED FOR IS BUILT:
gates/a_merge_did_not_delete_a_system_gate.js *** The shared surfaces only ever
GROW, so after a rebase every line main had must still be there; anything missing
is somebody's work a merge threw away, unless the commit says DELETES ON PURPOSE.
It has self-tests, because a check that cannot find a deletion is not a check, AND
IT REPLAYS THE REAL INCIDENT AS A PERMANENT CONTROL: 4f1611e4 against 74aee15c, 83
lines lost, including the worn:{hair:...} outfit rows CHARACTER named. IF THIS GATE
HAD EXISTED, MY OWN PUSH WOULD HAVE BEEN RED. Both shas are permanent history so
the control cannot rot. 9 passed, 0 failed.
OWNERSHIP: CHARACTER said PLUMBER or the coordinator is better placed to own it and
that is right. It is built here because this lane caused the defect. It needs no
knowledge of this lane to run. TAKE IT.

Nothing [PENDING Paolo] from this block.

PEOPLE (people-7h9sfy): 9/27 LATEST -- *** PAOLO RULED ON THE AMOUNT AND THE
VARIETY, AND THE MEASUREMENT INVERTED HIS OWN QUESTION: THE TOWN IS NOT TALKING
TOO MUCH, THERE IS ALMOST NEVER ANYBODY THERE. ***

HIS WORDS: "the way you interact with people in battle Brothers is extremely well
done maybe that's the amount that we should be interacting with people in our game
maybe however all everything that we've done all the research we've done gives us
way more chat bubble options or whatever so keep that in mind". Law written the
same turn: laws/BOHEMIA_LAW_BATTLE_BROTHERS_AMOUNT_OUR_VARIETY_9_27_26.md. He said
maybe TWICE and the hedge is kept: the direction is a ruling, the number is not.

MEASURED BEFORE A LINE CHANGED
    lines written across every organ            625
    ambient lines in the table                  558, in 152 buckets
    DIFFERENT LINES THE WHOLE STREET COULD SAY   14
    different lines heard in four minutes        13, one of them 10 times
    lines in one person's pool                    5, for all 61 people

FOUR REASONS AND NOT ONE WAS A MISSING WORD. (1) First-match-wins is a PRIORITY
rule and was being used as a POOL rule, so three of four ambient buckets went mute
for ever. (2) *** THE FIELD IS CALLED archetype AND THIS MODULE SAID SO IN A
COMMENT SINCE 9/5 WHILE STILL READING role *** -- 84 buckets and 324 lines
unreachable, the only key in the valley that hit anything was when:brownout. A NOTE
IS NOT A GATE, again. (3) barkOpts read p.faction, which this surface never sets
because allegiance is COMPUTED; ctFactionOf is the city's own answer, 29 buckets
and 82 lines unreachable. (4) The picker keyed on String(k).LENGTH: three key
lengths in the valley, so at most three answers per beat, 4 different lines across
61 people against 12 with the key. AFTER: 14 -> 72 on his block, 14 -> 115 across a
day, no new line written.

*** THEN THE PLAY WAS MEASURED AGAIN AND VARIETY HAD GONE DOWN: 13 different lines
-> 11, most-repeated 10 -> 16. A POOL GETTING BIGGER IS NOT THE SAME AS HEARING
MORE. *** The cause was MY OWN LAST ROUND: met:asked holds two lines and is a
REACTION, so it outranks everything for ever, and [bb company] ask-marks everybody
who introduces themselves. NEW RULE, now law: A STATE COLOURS A VOICE, AN EVENT
REPLACES IT. What they SAW or HEARD still wins outright; met and rung join the pool.

*** AND THE NUMBER THAT ANSWERS HIM ***
    people within earshot, mean                0.22
    most there has EVER been at once              1
    beats with nobody close enough      188 of 240
    different people who spoke in a play          3
    lines said by the busiest of them            40 of 54, from a pool of 8
ONE MAN WITH EIGHT LINES SAYING ALL EIGHT FIVE TIMES BECAUSE HE IS THE ONLY PERSON
THERE. Variety is a CROWD problem before it is a words problem, which puts
[honest crowd] and the enough-people shortfall upstream of every line anybody
writes. The street now TAKES TURNS and that is shipped KNOWING IT CANNOT BITE YET,
because the most ever in earshot is one. How often the street may speak is one
named dial, UNCHANGED at one line per four seconds: turning a quiet town silent on
a "maybe" is a lane guessing, not a ruling being followed.

*** AND ONE MEASUREMENT IN MY OWN GATE IS WRONG AND IS PRINTED ANYWAY. *** The
earshot reading taken inside the gate says zero; the real answer is 0.22. FOUR
versions were built -- at the end, at the start, with him put back on his street,
with the game clock put back too because walking spends minutes and carries it into
the night -- and all four read zero, so I STOPPED rather than write a fifth (STOP
PRODUCING). The record's number comes from a fresh page, an instrument that can
produce a positive. The gate prints its disagreeing number with the reason beside
it rather than deleting it.

Gate the_company_is_a_cast 65/0. Record extended with round two. Stamp 9/27g.
Derived slices rebuilt because the diff touches engine/. Canon index regenerated
because an addendum landed.

Nothing [PENDING Paolo] except the one he reserved: the NUMBER of interactions per
five minutes. He said maybe twice and nobody has picked it.

PEOPLE (people-7h9sfy): 9/24 (c) LATEST -- *** [bb company] SHIPPED, AND THE
FINDING IS NINE DAYS OLD AND IS NOT ABOUT COMPANIONS: THE STEP BECAME A HOUSE AND
NOBODY RE-MEASURED WHO COULD KEEP UP. ***

Rule 33 (THE OVERWORLD IS BATTLE BROTHERS) asked every lane for a [bb ...] school
line. This lane's is THE COMPANY IS A CAST.

MEASURED ON THE ALPHA, MECHANISM NAMED AND CONTROLLED, BEFORE A LINE MOVED:
    one press of the pad moves the player     25 cells (THE STEP IS A HOUSE, 9/15)
    the follow pass believed                   9 cells (BohemiaStanding.SEE_RANGE)
    a drawn body standing on the glass        31 cells away, DRAWN EVERY PRESS
    an enemy stubbed into following            0 of 8 presses in the follow map
    THE CONTROL, same stub, reach widened      4 of 4 presses in the follow map
The walked city's own comment says overriding your schedule to stay near somebody
"takes an enemy to do it". AN ENEMY CANNOT DO IT EITHER. Since 9/15 NOBODY OF ANY
KIND has been able to follow the player on any surface, and the cause is TWO
QUESTIONS SHARING ONE NUMBER: how far off you can watch something happen (nine,
still correct) and how far somebody keeping up may be (never asked, and nine is
smaller than one press).

AND THE COMPANY'S OWN NUMBERS, SAME PASS:
    people carrying a background           61 of 61, all 15 kinds, off their key
    backgrounds carrying a written line    15 of 15 (WORDS shipped them 9/23)
    backgrounds ever said out loud          0
    lines spoken past the first minute    224, and NOT ONE of them a background
    people who ever walk with you           0

BUILT, all of it joining things that already existed. (1) The follow reach is
measured in PRESSES, 25 + 9 = 34, neither number invented. (2) A follower covers a
HOUSE, which is rule 16's own second half in his words -- "all characters'
movements and enemies' movements to be larger at the same time" -- called once per
cell so walls and occupancy are paid 25 times, not skipped once. (3) A person near
you tells you what they used to be, once ever, past the quiet minute, walk-past-
able. (4) Stay a couple of beats and they FALL IN BESIDE YOU; nothing to press,
walking on is the refusal and costs nothing, which is rule 32a built instead of
written. (5) On the road they say what they KEPT, which is Battle Brothers' hidden
trait found out by playing instead of read off a tooltip. A trade that DIED keeps
nothing and says nothing, and the silence is the joke landing.

ON THE ALPHA, AFTER: somebody walks with him (218 beats beside him, held at 3
cells, Estella Gaines who DROVE A CAB), 3 backgrounds said out loud in one play,
none said twice, 0 lines in his first minute, 0 in the demo. THE CONTROL IS A
COMPARISON, NOT A THRESHOLD: the same walk with these two mouths held shut says 42
lines against 54 with them, so this row is 5 lines on top of a street that is not
muted. Gate the_company_is_a_cast_gate.js 51/0.

*** AND THE COOK'S OWN FRAME CAUGHT A THIRD DEFECT, SAME ROOT CAUSE. *** The first
picture shot for the vote tab had the man walking with him DRAWN STRAIGHT THROUGH
HIM. Rule 30. The draw spaces roster bodies from each other by footprint and
deliberately not from the player, and the reason beside it was right at the time
("one body per cell"). One body per cell stopped being enough when a body became
a hundred pixels wide. A follower now stops closing at the same footprint the draw
already uses, and the number is that same expression, not mine.

*** AND A FOURTH, FOUND BY THE GATE GOING RED ON ITS OWN CLAIM: A BLANK PLATE OVER
A WOMAN THE GAME KNEW THE NAME OF. *** Of three people who introduced themselves,
two came back named and one came back with nothing. Her id was 14:11:118, he was
standing on 12:12, and she was BORROWED onto his street by the never-empty field.
ctPersonName resolves an id against the BLOCK'S roster, so a borrowed body could be
drawn, could speak, and had no name while ctPerson(p).name said "Lupe Aguirre".
Two ways to ask what somebody is called that disagree is TWO WRITERS FOR ONE FACT,
and the people module paid a whole round for the identical shape. The caller holds
the person, so the person answers; the id lookup is the fallback; the trade word is
under both, so a blank plate is the only wrong answer.

THREE OF THE FOUR REDS IN THE FIRST GATE PASS WERE MY GATE, NOT THE GAME: the
first-minute leg walked its clock to 96 s and then complained about lines that were
legitimately past the minute; the not-muted control asserted "more than 100 lines"
and read 54 on a build where nothing was muted, because AN ABSOLUTE NUMBER THERE
MEASURES THE WALK, NOT THE CHANGE. A number I would have had to keep lowering is
not a control, so it is a comparison now.

AND TWO PROBES READ ZERO BEFORE ANY OF THIS WAS TRUE, both because they pressed
the pad 260 times in a loop, which at 25 cells a press walks him into empty country
where the organ has nobody to speak to. The positive control settled it: the same
build standing still said 224. BEFORE BELIEVING A NEGATIVE, PROVE THE INSTRUMENT
CAN PRODUCE A POSITIVE.

COOK: THE ONE WHO FELL IN, registered in VOTE, every frame the walked street from
the game's own camera (rule 32f), and THE BEFORE FRAME WAS SHOT ON A STASHED TREE
-- the build main is actually carrying -- so the pair differs by the row and
nothing else. Record records/BOHEMIA_THE_COMPANY_IS_A_CAST_9_24_26.txt.

MEASURED AND NOT FIXED, for whoever reads this next:
  - THE DRAW STILL DOES NOT SPACE ROSTER BODIES FROM THE PLAYER, only from each
    other, so somebody standing next to him off their own schedule can still be
    drawn through him. That is [no clumping]'s row and it is SHIPPED. The last
    attempt took FACE AT THE DOOR from 31/0 to 25/6 by making it impossible to
    stand beside him at all; the correct version is the identical footprint test
    the roster already uses, not an exclusion. Named with the mechanism rather
    than half-fixed on the strength of one frame.
  - THE PRICE IS NOT IN HERE. "One battery a night on a handshake" is ruled and
    it is FACTIONS' row [take them on]. Nothing this round charges anybody.
  - BOTH DEBT LEDGERS ARE KEYED BY OUTFIT, NOT BY PERSON ([who follows] measured
    that), so the chooser's two strongest reasons -- you owe them, they owe you --
    cannot be answered per person here and are left ABSENT rather than faked.
    Every companion this round came in on "their work is gone", the weaker and
    honest one.
  - The name plate at her feet still clips on a wall edge, named again.

Nothing [PENDING Paolo].
PEOPLE (people-7h9sfy): 9/24 (b) LATEST -- *** [creditor waits] SHIPPED. HE
CORRECTED THIS LANE'S OWN WORK AND HE WAS RIGHT: SOMEBODY TALKED THE INSTANT THE
WORLD EXISTED. ***

HIS WORDS, three ways in one batch, voting on [creditor stands] (rule 32a):
"Why does everything have to happen the first second of the game or even be in the
demo?" "Don't force this on me." "Don't force interactions on the player."

MEASURED ON THE ALPHA BEFORE A LINE CHANGED:
    the first word landed              0 ms after the city was playable
    lines in his first minute          2
    copies of the reach number         6, AND ONE OF THEM DISAGREED (7 against 6)

BUILT:
  one clock, stamped once     play begins at the BEGIN tap; the shell sends NO
                              TIMESTAMP across the frame, it says THAT it happened
                              and the city stamps its own clock. This lane already
                              paid once for two clocks in one file.
  one gate, one place         ctMaySpeak is the FIRST thing barkTick does, so a
                              mouth added later is quiet by default. A bubble
                              already up is left alone, so nobody is cut off.
  declared distances          toYou 6, overheard 4, ambient 7, each named for the
                              KIND of speech. NOT all one number on purpose: his
                              own words separate them ("a rumour is OVERHEARD as
                              he passes, never said to his face"). What is ONE is
                              the answer: every mouth reads the table.
  nothing in the demo         his "or even be in the demo", built

ON THE ALPHA AFTER: 0 lines in the first minute, 93 after it, furthest speaker 2
cells, 0 lines in the demo, AND HE CAN STILL WALK WITH SOMEBODY MID-SENTENCE.
THE 93 IS THE CONTROL THAT MATTERS: shutting everybody up passes "quiet first
minute" and hands him a dead town.

COOK: NOBODY STOPS YOU YET in VOTE, and BOTH FRAMES ARE THE WALKED STREET FROM THE
GAME'S OWN CAMERA, which is rule 32f and is not a detail: he killed a picture in
this same batch for exactly that ("this game isn't in first person, when would I
see this?") and the last thing this lane put in the tab was a sheet of floating
faces. At 30 s nobody says anything; past the minute Estella Gaines says it once
from two steps away. THE PLATE READS HER NAME, not her trade, so rule 32g's "no
jargon in a mouth" is already satisfied on this bark.

GATE: gates/creditor_waits_gate.js GREEN 39/0. The law names its own gate and this
is it: a distance and a delay on every line, nothing in the first 60 s, nothing
out of reach, nothing halts the pad.

*** AND MY OWN CHANGE TURNED FOUR OF THIS LANE'S GATES RED, WHICH IS THE RIGHT
KIND OF RED AND IS WORTH READING. *** creditor_stands 36/3, rumours_travel 57/4,
city_barks 7/6, a_human_being 13/1. EVERY ONE was a gate asserting speech inside
the first minute. Proved it was timing and not breakage by putting each past the
quiet floor and watching them return to their exact prior scores: creditor_stands
39/0, rumours_travel 61/0, city_barks 12/1 (its one red is the pre-existing WORDS
one, identical on clean main), a_human_being 14/0.
AND ONE OF THEM HAD TO MOVE SURFACES, not just clocks: a_human_being measured its
bubble-layout claim ON THE DEMO, where his rule now means a bubble can never
appear. It would have reported a layout bug for ever. The CLAIM is untouched and
now runs on the alpha, where a player actually meets one.

PRE-PUSH: creditor_waits 39/0, creditor_stands 39/0, rumours_travel 61/0,
bubble_face 40/0, a_name 48/0, face_at_the_door 31/0, a_human_being 14/0.
NOT MINE: city_barks 12/1, the WORDS-table red that is identical on clean main.

MEASURED AND NOT FIXED: the 60 is the one number in here that is not derived; it
is his, written as CT_QUIET_S = 60 so he can move it with a word. The name under
her feet CLIPS against the wall edge in the VOTE frame, named rather than cropped
out of the picture. And the other mouths in the game are not all mine: the phone,
the cards RUN is stripping and the fight's own text are other lanes' surfaces and
rule 32a covers those too.

[PENDING Paolo] carried, unchanged: whether a face may read feminine beyond the
haircut; when a person dies of old age; how many game days is a year; who you
marry; what a long injury costs to treat; the [honest crowd] trade; and how often
a rumour should go wrong.

NEXT: [bubble face] was SET DOWN for this, not abandoned, and its round one is in.
[somebody hires you] and [track leg] are the other OPEN rows.

PEOPLE (people-7h9sfy): 9/24 LATEST -- *** [bubble face]. THE PICTURE WAS REAL AND
THE CAUSE THE ROW NAMED DOES NOT EXIST, AND NOTHING IN THIS GAME KNOWS WHO IS A
MAN AND WHO IS A WOMAN. ***

THE ROW (QUESTS f403acc): "36 of 40 people carry a face index into the city's baked
cast and the bubble ignores it... the bubble draws the face the body carries."
Their PICTURE is real and this lane would not have looked without it: Estella
Gaines stops you at your own door with a face that reads as an older man.

MEASURED ON THE ALPHA BEFORE A LINE WAS WRITTEN:
    people carrying `face`                 40 of 40, not 36
    the values it takes                    0 to 7
    entries in the baked cast              11
    what the line that makes one says      face: r & 7,
                                           // which of the 8 facings they idle in
IT IS A FACING. A field was read by its name. And there is nothing on the other
end to hand an index TO: the street draws a baked CLOTHING FIT picked by trade
(longcoat, skirt, poncho, cape), and a clothing fit has no portrait in it.

AND MY FIRST PROBE OF THE EXISTING SYSTEM SAID IT WAS DEAD. It called a bare
global `lookFor` and read `.hair`; the module is behind BOH_PERSONLOOK and the
hair is at `.worn.hair`. Null for everybody, no error, and I was one step from
"fixing" a live system. Handed the pool it dresses 20 of 20. BEFORE BELIEVING A
NEGATIVE, PROVE THE INSTRUMENT CAN PRODUCE A POSITIVE, hit again.

*** SO WHAT IS ACTUALLY WRONG IS SMALLER AND DEEPER: NOTHING IN THIS GAME SAYS
WHO IS A MAN AND WHO IS A WOMAN. *** Not the person record, not the derived
identity, not the name bank, not the face spec. ONE RIG (7/25 LOCKED) settled the
BODY and nobody came back for the reading. The NAME is the only thing in that
speech bubble that says "she" and nothing was listening to it.

BUILT:
  the names say what they read as   87 of the 90 he approved 9/21, marked she/he.
                                    A FACT about names already in the bank, draft,
                                    his to overturn a line at a time. Kai, Sunny
                                    and Juniper left reading EITHER on purpose.
  the city answers                  it is the only side that can turn an id into a
                                    person; AN UNEARNED NAME STEERS NOTHING, which
                                    keeps this lane's own 9/21 rule
  the pool is narrowed, never       5 of 11 cuts marked (three clipped tapers, two
  the pick                          long falls); locs, coils, shag, weave, short
                                    ropes and the curtain cut stay open to all
  the face follows the name         the moment it is earned, by dropping the cached
                                    face so the one reader is asked again

ON THE ALPHA: 58 people with a name that reads one way, 10 faces wore a cut that
fought their own name, NOW 0, AND ALL ELEVEN CUTS ARE STILL WORN ACROSS THE
STREET. That second number is the control that matters: forcing everybody into one
cut each way would pass the claim and ruin the crowd.

COOK: HER NAME AND HER FACE in VOTE, the ten faces that were wrong, before and
after, out of the real generator. The first sheet photographed twelve people at
random, which is mostly people who were already fine: an honest number and a
useless picture.
AND THREE WRONG GUESSES ABOUT ONE RETURN VALUE before asking it what it was.
renderFace hands back a raw Uint8ClampedArray; I tried ImageData, then a canvas,
and got red error boxes twice. The shell already said so: packIdx(renderFace,64,64).

GATE: gates/bubble_face_gate.js GREEN 40/0 on the alpha.

*** AND I BROKE ONE OF MY OWN GATES AND REPAIRED IT TO ITS SUBSTANCE. *** A NAME
went 47/0 to 46/1: its claim "nothing new stores a name, so there is no second
list of who is known" refused the mere TOKEN FACE_CV, and I added
`delete FACE_CV[id]`, which is the OPPOSITE of storing. Repointed at a WRITE
rather than a mention, with a self-test that the sweep can still see the cache it
watches. Back to 48/0.

PRE-PUSH: bubble_face 40/0, a_name 48/0, portrait_haircut 12/0, family 15/0,
face_maker 13/0, LANGUAGE 85/0 (the name bank change is clean).
NOT MINE, being classified against clean main as this was written: talking_portrait
28/1 (a face-distinctness threshold, identical on main two rounds running),
face_thumb 21/2 (its candidate bank is 274 hours behind the alpha and wants a
rebake; any alpha edit trips that leg).

*** MEASURED AND NOT FIXED, AND THE ROW'S SHIP TEST IS NOT MET. *** "The bubble
draws the face the body carries" needs the body to carry a face. It carries
clothes. The line is NOT marked SHIPPED against a test the game cannot satisfy;
what IS done is the real defect underneath it.
AND IT IS ONLY THE HAIRCUT. The portrait has no other masculine or feminine dial:
one rig, one skull generator, no jaw or brow weight that knows about any of this.
Saying the faces now "read as women" would be selling something I did not measure.
AND WHAT ACTUALLY DOMINATES THESE PORTRAITS IS EYEWEAR: most faces on the sheet
wear a wraparound band across the eyes. Somebody else's row, named not fixed.

[PENDING Paolo] whether a face may read feminine beyond the haircut. ONE RIG is
LOCKED and this does not reopen it; it asks only about the portrait.
Still carried: when a person dies of old age; how many game days is a year; who
you marry; what a long injury costs to treat; the [honest crowd] trade; and how
often a rumour should go wrong.

NEXT: [somebody hires you] and [track leg] are the OPEN rows.

PEOPLE (people-7h9sfy): 9/23 LATEST -- *** [creditor stands] SHIPPED. THE GAME
TOLD YOU SOMEBODY WAS DEAD AND THEN KEPT DRAWING HIM AT HIS OWN DOOR. ***

THE ROW: "an heir does not inherit a NUMBER, they inherit THE PEOPLE HE OWED,
still standing there, still remembering."

MEASURED ON THE ALPHA THROUGH THE GAME'S OWN DOORS, BEFORE A LINE CHANGED. Take a
loan with the game's own writer, miss the night, let the night publish the deed:
    people who witnessed it                       1  (the neighbour at his door)
    people who still knew, one generation later   0
    the fold's own words  "1 of the things you did died with the last person who
                           saw them"
THE LAST PERSON WHO SAW IT IS 12:12:900, THE MAN AT HIS FRONT DOOR. Drawn every
frame, with the name and face this lane spent three rounds building. The
generation that ended is the DEBTOR'S.

WHY THE ORGAN SAID OTHERWISE, AND IT IS NOT A SLOPPY LINE. inherit() drops an
untold deed because "the eyewitness is dead", and TWO OTHER LANES' GATES PIN IT
with the premise spelled out: standing_gate ("A QUIET DEED DIES WITH THE
WITNESS") and faction_between T1 ("Thirty years pass and everybody who watched
you is dead"). The DYNASTY half is right and is untouched: a thing one person saw
and never mentioned must never become what your child is judged for.

*** AND THE REPO ITSELF HAD ALREADY REFUSED THAT CALL. *** bohemia_family.js, on
its parked bury() writer: "WHEN a person dies of age is a magnitude, so it waits
on Paolo." NOTHING IN THIS GAME AGES ANYBODY OUT. The organ decided the one thing
the game explicitly refused to decide, for the whole valley, as a default.
And the real world agrees: a thirty-year step does not bury a lender who was an
adult when he handed it over.

BUILT:
  the organ ASKS                inherit() takes an optional `alive`; WITH NOTHING
                                PASSED THE ANSWER IS BYTE FOR BYTE WHAT IT WAS,
                                which is why standing_gate 35/0 and
                                faction_between T1 are both still green
  a memory, never a charge      the kept deed is stamped `ended`, forceOf gives it
                                zero: father -4.00, child 0, father still charged 0
  the city answers              ctStillHere() off the world's own census, and it
                                SAYS OUT LOUD that it means STILL HERE and not
                                STILL ALIVE, and is conservative off the block
  the row's question            whoRemembers() returns PEOPLE, no balance anywhere
  and he SAYS it                once, with a name and a face, above everything
                                else on the street

ON THE ALPHA AFTER: 1 remembered before and 1 after (it was 1 and 0), the fold
reports died 0 / stood 1, and the street says, once each:
    "The last one did me a turn once. I have not forgotten it."
    "You have his face. The last one owed me a night of power and never brought it."
IT CUTS BOTH WAYS ON PURPOSE. An heir who only ever meets the debts is a
punishment, not an inheritance.

THREE CONTROLS HELD: silent with nothing owed, silent while the father is still
ALIVE (so it fires on the FOLD and not on any deed), and no broken record.

*** AND I MADE ANOTHER LANE'S CLAIM FALSE AND REPAIRED IT TO ITS OWN SUBSTANCE
RATHER THAN WEAKENING IT. *** faction_between T6 asked for died === 3 on the CITY
surface, where all three watchers are people still standing on the block.
MEASURED IN EXACTLY THAT SETUP: carried 3 (unchanged), inherited 3 (unchanged,
which is what T7 checks), the watched three stamped `ended` and worth zero, and
died 0 + stood 3. Not one number in the claim's substance moved. Rewritten as
died + stood so it holds under either answer and reads identically for a caller
that cannot say who is alive. faction_between went 174/9 to 175/8, AND CLEAN MAIN
IS ALSO 175/8 WITH THE SAME EIGHT (M0 M1 M2 M3 M5 R6 R7 R8), so the score is now
identical to main's.

AND THE WORDS WERE BEING PAINTED OVER, CAUGHT BY THE COOK. The first photograph
read "he owed me a nig[HOME] of power": the HOME wayfinder drew three passes
AFTER the speech bubble. The bubble draws last now. THE COST, SAID PLAINLY: for
the two seconds a bubble is up it can cover the HOME word. That is the right way
round, and it is written into the file beside the change.

COOK (rule 22): THE ONE WHO STOOD THERE, three frames off the real glass in the
VOTE tab, same street and same man before and after his father dies.

GATE: gates/creditor_stands_gate.js GREEN 39/0 on the alpha, and its own self-test
caught my first cut measuring the father's worth AFTER the fold had already
stamped the deed `ended` -- the test was measuring the thing it was trying to
prove had been switched off.

PRE-PUSH PASS: creditor_stands 39/0, standing 35/0, heir_moment 23/0,
deed_bridge 29/0, rumours_travel 61/0, a_name 47/0, face_at_the_door 31/0,
no_clumping 37/0, vote_tab 30/0, who_vouches 19/0.
RED, NOT MINE: faction_between 175/8, identical eight on clean main.
make_it_right 34/5, as before.

MEASURED AND NOT FIXED: THE LOAN BOOK IS STILL KEYED BY OUTFIT, NOT BY PERSON,
which a previous PEOPLE round measured and wrote into the city ("BOTH DEBT
LEDGERS IN THIS GAME ARE KEYED BY OUTFIT, NOT BY PERSON"). So "the man who lent it
to you" is not a thing the game stores; what it stores is the outfit you owe and
THE PEOPLE WHO SAW YOU GO SHORT. This row is built on the second, which is real
today. A per-person lender ledger would be a SECOND DEBT LEDGER, which is this
lane's own recurring defect, and it is not what the row asked for.
AND THE BILL ITSELF WAS ALREADY DYING CORRECTLY before this round: WORLD's
owedFold() clears it and records only which generation it belonged to. That half
needed nothing. What was missing was the person.

[PENDING Paolo], and this round leans on it: WHEN A PERSON DIES OF OLD AGE. Until
he rules it, "still here" is the honest stand-in and it is labelled as one
everywhere it is used.
Still carried: how many game days is a year; who you marry; what a long injury
costs to treat; the [honest crowd] trade; and how often a rumour should go wrong.

NEXT: [somebody hires you] is the only OPEN row left in this lane.

PEOPLE (people-7h9sfy): 9/22 (c) LATEST -- *** [rumours travel] SHIPPED. THE CITY
COULD NOT GOSSIP AT ALL, AND IT WAS MY OWN LAST ROUND THAT KILLED IT. ***

THE ROW: "in 1,669 lines it has passed on news about somebody other than the
player exactly ONCE, and it has never once been WRONG."

MEASURED ON THE ALPHA BEFORE A LINE WAS CHANGED, THREE THINGS, AND THE THIRD IS
A REGRESSION I SHIPPED LAST ROUND:
  1. the organ carried a third-party story PERFECTLY. A field by field diff of
     the copy against the original read `changed: []`. Only BELIEF was lost.
  2. every deed in the city was about the player ({'@': 1}), and the reaction
     bark refused anything whose actor was not '@'.
  3. *** THE GOSSIP PASS PAIRED PEOPLE OUT OF BARK_DREW, THE RENDERER'S LIST,
     AND [no clumping] HAD JUST PUSHED EVERY DRAWN BODY TEN CELLS APART. ***
         closest drawn pair before the room rule    1 cell
         closest drawn pair after it               19 cells
         what the pass needs                        2 cells
         pair timers that ever started, after       0   (before: 44)
     Every claim about news travelling was a claim that COULD NOT FAIL. The
     instrument was proved with a positive first: two real people forced one cell
     apart fill the timer, fire, and the second holds the first one's news.

THE LESSON, and it is bigger than the bug: A CHANGE TO WHAT GETS DRAWN IS A
CHANGE TO EVERY QUESTION ANYBODY ASKS THE DRAW LIST, and this repo asks the draw
list plenty of questions that belong to the world. The fix was NOT to loosen the
room: the pass asks ctAt() now. It also closes the older half of the same defect,
where two neighbours could only talk WHILE THE PLAYER WAS WATCHING THEM.

BUILT:
  the pass asks the WORLD, not the camera            0.56 ms, against a 119 ms render
  the world makes its own news between neighbours    through witness(), the one door
  a story changes in the telling                     Bartlett 1932, Allport & Postman 1947
  a story keeps its own name                         so a drifted one cannot return as news
  TWO PEOPLE WHO STAND TOGETHER SEE EACH OTHER       nothing in this game had ever done it
  a mouth says it, with a head and a plate           rule 19c

*** 61 MINDS AND ONE SIGHTING IN THE ENTIRE CITY. *** bohemia_memory has been a
real witness organ since 8/2 and the only thing ever written into it was the
PLAYER walking past. That is why the blame could never move: assimilation bends a
story toward a familiar face and every mind's frame was one name long (37 minds
holding no actor, 20 holding exactly one, 4 holding two, 0 stories changing
hands). One see() call each at the moment the pass already knows about the pair.

ON THE ALPHA, ONE DAY ON HIS BLOCK: 354 deeds, 109 stories, 18 people talked
about, 25 carrying news, ZERO about the player, 133 wrong, 51 blamed on the WRONG
PERSON, 65 grown into a bigger act, and one event alive as NINE different stories.
pushed_the_price and downed exist in the world and the city never raises either:
they are purely what rumours grew into.

COOK (rule 22): ONE STORY, THREE MOUTHS, three frames off the real glass in VOTE.
  "I saw it myself. The other watch never paid somebody back."
  "Somebody told me the other watch never paid somebody back. Don't ask me where."
  "Somebody told me the scavenger squeezed somebody. Don't ask me where."

FOUR CONTROLS CAUGHT FOUR THINGS, ALL WRITTEN UP IN THE RECORD:
  - THE WALK DID NOT WALK. stepOnce() takes a DIRECTION INDEX, not (dx,dy). The
    probe moved ONE step in four hundred and reported silence about a player who
    had not gone anywhere. *** AND gates/walking_companion_gate.js LINE 196 HAS
    THE SAME CALL (stepOnce(0, 1)) *** -- it still steps, so its claim stands, but
    the second argument means nothing. Named, not quietly repaired inside this row.
  - THE COOK PHOTOGRAPHED NOTHING. d.shot() waits 700 ms and photographs the page;
    this city only redraws when the player acts, so three shots came back BYTE FOR
    BYTE IDENTICAL (d8d580c4 x3) with no bubble in any of them. Pixels are read
    off the canvas the instant after it is drawn now.
  - THE SUBJECT WAS CALLED THE SPEAKER'S OWN NAME ("WATCH squeezed somebody" over
    a head whose plate read WATCH), the acts are past tense so "I watched {who}
    {act}" produced "I watched the other worker never paid somebody back", and
    {who} at the head of a second sentence was lower case. All three on the glass.
  - AN OUTFIT AS THE PRICE OF ADMISSION MADE ZERO STORIES IN A DAY: 15 of 61
    people have any outfit, ONE outfit on the block, 4 of 46 close pairs with
    both. A neighbourhood's gossip is about neighbours, not about gangs.

GATE: gates/rumours_travel_gate.js, GREEN 58/0, driven on the alpha, with the
mouth's own silence control running every time.

PRE-PUSH PASS, AND EVERY RED CLASSIFIED AGAINST A CLEAN origin/main WORKTREE:
  GREEN, mine      rumours_travel 58/0, no_clumping 37/0, a_name 47/0,
                   face_at_the_door 31/0, walking_companion 45/0,
                   weights_shape 48/0, a_human_being 14/0
  GREEN, touched   LANGUAGE 85/0 (the English-only decision holds), standing 35/0,
                   deed_bridge 29/0, who_vouches 19/0, rulings 131/0,
                   commitment 72/0, vote_tab 30/0
  RED, NOT MINE    horror_crowd 35/2 -- IDENTICAL two claims, identical numbers,
                   on clean main. city_barks 12/1 and talking_portrait 28/1 --
                   identical failures on clean main. enemies_remember 24/1 --
                   identical on clean main. make_it_right 34/5, as before.
                   derived_freshness red on main too (FACTION_BLUES,
                   FACTION_DOSSIER_JUDGE, RUN_CURRENT); MY REBUILD HEALED
                   CURRENT_SLICE. Its ALPHA and CITY_WORLD entries read +0/-0,
                   and running their named maker in this tree produces a
                   BYTE-IDENTICAL file, so that entry is the gate's own worktree
                   overlay, measured both ways. PLUMBER's, not mine.
                   city_deeds TIMES OUT identically on clean main: the 9/22b
                   loading door intercepts its tap ("#front subtree intercepts
                   pointer events"). That gate needs the pageEval DIRECTION added
                   for exactly this. Not mine, and not this row.
  AFTER THE REBASE onto 400c374d (main moved mid-round, and the rebase conflicted
  on the build stamp and the vote registry): rumours_travel 58/0, no_clumping
  37/0, a_name 47/0, face_at_the_door 31/0, vote_tab 30/0. *** AND THE REGISTRY
  CONFLICT NEARLY SHIPPED BROKEN: *** my merge script threw on the JSON, git add
  had already staged the file WITH ITS CONFLICT MARKERS, and `rebase --continue`
  committed it. Caught by parsing the committed file instead of trusting that the
  rebase finishing meant the merge worked. Both lanes' items kept, 107 in the tab.

MEASURED AND NOT FIXED: YOU WILL RARELY HEAR IT WHILE WALKING. Four hundred
walked steps, a carrier came within earshot ONCE and spoke that once -- the bark
fired every time it could, so the limit is the world, not the mouth. Two reasons,
both deliberate elsewhere: people only talk after really standing together, and
only four bodies are drawn near him since NOBODY STANDS ON ANYBODY. Louder is a
dial, and it is his.
ALSO NOT FIXED: a body can be DRAWN and still be unnameable, because
ctPersonName scans the three-by-three around the player while the renderer draws
wider. The bark correctly says nothing rather than a sentence with a hole in it,
and every actor of a city-made story is inside the box, so it costs nothing today.

[PENDING Paolo] how often a story should go wrong. The four rates ship as
attempts (place 1 in 2, hour 1 in 3, bigger 1 in 4, wrong man 1 in 5) and the
VOTE page asks him.
STILL [PENDING Paolo] from before: when a person dies of old age; how many game
days is a year; who you marry; what a long injury costs to treat; and the
[honest crowd] trade, a quiet evening street or everybody reachable.

*** AND THE SAME BREAK HAD A SECOND HALF, FOUND BY QUESTS AND FIXED THE SAME
ROUND. *** QUESTS f403acc2 bisected "the walked city stopped recording witnesses"
to e9f3091 [no clumping], three runs a side (5ca10f2: 17, 17, 17 minds after
twenty presses; e9f3091: 1, 0, 2). Same cause one layer out: ctWitnessPass reads
the DRAW list, the room rule spaces drawn bodies about ten cells, RADIUS is
EIGHT. I had fixed the gossip pass and not this one.
AND MY OWN FIX WAS A SECOND WRITER FOR ONE FACT: I had put see() into the gossip
pass because 61 minds held ONE sighting between them. Right measurement, wrong
place -- the organ was DARK, not missing. Those calls are gone; the witness pass
asks the world; exactly TWO see() calls in the walked city, both inside it.
AFTER, AT REST: 61 people, 1 inside his eight cells (nearest 2), 1 mind recording
him, 49 minds with any face in them, 97 sightings where there had been ONE, and
the pass costs 0.41 ms once a game minute. Gate back to 61/0.
AND THE FIRST PROBE OF IT WALKED HIM 71 CELLS INTO AN EMPTY SPOT and reported
that nobody saw him. Measured at rest instead.

NEXT: [creditor stands] and [somebody hires you] are the OPEN rows.

PEOPLE (people-7h9sfy): 9/22 (b) LATEST -- *** [no clumping] AND [name mix]
SHIPPED e7daaa46, both straight off HIS VOTES. NOBODY STANDS ON ANYBODY. ***

HE VOTED. Four verdicts on this lane: the names UP with a correction, the street
picture DOWN, the companion DOWN ("her portrait ugly", PORTRAIT's), the weights
UP with no comment. Two of them were jobs and they beat the queue.

*** PAOLO 9/21, TWICE, VOTING DOWN THIS LANE'S OWN PICTURE: "It looks so fucking
bad why are so many people on so many like on top of each other on each other's
ass." ***

MEASURED AT THE QUIETEST HOUR WITH NINE BODIES ON THE GLASS: five overlapping
pairs, four past a quarter of a body, THE WORST AT 90.3%.

*** ONE BODY PER CELL WAS BEING KEPT PERFECTLY AND IT WAS NEVER THE QUESTION. ***
A body is 112 px on 11 px cells, so A BODY IS TEN CELLS ACROSS: two people on
neighbouring cells obey the occupancy law to the letter while their art overlaps
ninety percent.

TWO GOOD DECISIONS COLLIDED AND NOBODY MEASURED THE PAIR. LIFE+CITY's 9/12 crowd
packs people into rings 0 to 4 cells out, and that was RIGHT (the street felt
dead, measured over sixteen walks). Rule 21 fixes the body at 112, and that was
RIGHT too (he hated his body resizing). A nine-cell square holding thirteen
ten-cell bodies is one shape. NEITHER LANE WAS WRONG. WRITE THAT DOWN: two
rulings can both be right and still be a defect where they meet.

THE FIX is the same law one layer out, at the glass where it already lives, asked
of the body's FOOTPRINT instead of its cell, with ONE LIST SHARED BY BOTH PASSES
THAT DRAW PEOPLE -- the hostile pass runs inside the people pass and drew the two
worst bodies on the screen while the people pass was clean. The room is the
game's own arithmetic (ladder over cell) and it is a WHOLE body: half was tried
and measured and still left two people six cells apart covering a third of each
other.

ON THE GLASS, SEVEN HOURS ACROSS THE DAY: ZERO OVERLAPPING PAIRS AT EVERY ONE.
And the control that matters, because zero overlap is trivial if nobody is drawn:
never below three bodies, seven on average. THE STREET DID NOT GET THINNER TO BUY
THE PICTURE.

*** AND SEEDING THE LIST WITH THE PLAYER COST THREE OF THIS LANE'S OWN GATES. ***
The first cut excluded a body's width around HIM too. It meant NOBODY CAN STAND
BESIDE HIM: the person who comes to his door, the thing this lane spent three
rounds building, stopped being drawn and stopped speaking, and FACE AT THE DOOR
went 31/0 to 25/6 with its own self-test "somebody really spoke" reading FALSE.
He is already covered by the cell law. Player off the list, on purpose, and the
gate now asserts that with the reason. The ship test counts pairs AMONG OTHER
PEOPLE and says so out loud: with him counted the worst pair is 81.3% and it IS
the person at his door, which is the one thing rule 19 asks for.

*** AND [honest crowd] IS BUILT, MEASURED, AND HELD OFF, WHICH IS THE ROUND'S
MOST EXPENSIVE FINDING. *** Scaling the borrow by the share of his block that the
schedule has outdoors WORKED: the day read 1, 4, 5, 2, 5, 3, 2 bodies against a
world of 0, 10, 41, 3, 40, 4, 2 outside, still with zero overlaps. AND IT TURNED
THE LANGUAGE GATE RED: "A SPANGLISH NEIGHBOUR ANSWERS IN SPANGLISH" stopped being
satisfiable, because a street thinned to the world's real share no longer puts
one of every register inside the cells that gate walks. ISOLATED IN THREE RUNS,
because a red with three changes in the tree is not a finding until it is one:
skip+spacing+bank GREEN, bank alone RED, clock-scaling off GREEN. The arithmetic
stays in the file, OFF, with the reason written beside it.
[PENDING]: a quiet evening street, or everybody reachable. That is the trade and
it is not mine.

[name mix]: HE VOTED THE NAMES UP WITH A CORRECTION AND HE WAS RIGHT. Counted
before a name was added: 35 of 64 surnames read Hispanic (55%) against a Clark
County that is about 32%; given names 45% Hispanic against a county that is about
41% white non-Hispanic. THE BANK WAS A THIRD MORE HISPANIC THAN THE COUNTY IT IS
BUILT FROM, and he noticed by reading eleven names. Surnames 64 -> 98, given
names 64 -> 90, the Hispanic share of surnames 55% -> 36%, NOTHING OF HIS
DELETED. The honest split for surnames is Hispanic / Asian / everyone else and
the file says so. THE BANK LIVES IN TWO PLACES (engine/bohemia_people.js is
inlined verbatim into the walked city) and both were changed through the repo's
own resync tool.

THE GATE: gates/no_clumping_gate.js, 37 claims, in the suite as NO CLUMPING.
Mutation: let the hostile pass ignore the shared list and the count ignore the
clock, 2 red.

AND A THIRD ROUND RUNNING OF THE SAME TEST MISTAKE, NAMED SO IT STOPS: a claim
went red because a sentence WRAPPED across a line. A test about where the
newlines fall is not a test about what the file says. Every prose claim in this
gate now reads a flattened copy.

NAMED, NOT MINE: A NAME reads "1 of 61 named at boot" and does the same on CLEAN
HEAD, because this round's own probes wrote the met-ledger into the driver's
browser profile and it persists between runs. The gate's control assumes a clean
save and does not ask for one. THAT IS A WEAKNESS IN A GATE THIS LANE WROTE AND
IT IS NEXT ROUND'S FIRST JOB. VOTE TAB is red on clean main too (UI's row).

NEXT: [family eyes] is HELD; the OPEN rows are [rumours travel], [creditor
stands], [somebody hires you]. First though: the A NAME control above.

PEOPLE (people-7h9sfy): 9/22 LATEST -- *** [weights shape] SHIPPED 63a960eb. THE
REPUTATION MACHINE IS BUILT, WORKING, AND GRADING NOTHING. *** Row
WHAT-PEOPLE-REPEAT-ABOUT-YOU, under the rule 18 hold with the RULE 22 cook
riding beside it.

THE COORDINATOR RULED 9/5 off the research: people repeat five things about a
stranger and nothing else, everything else weighs near zero, a betrayal is worth
about five kindnesses, it is remembered longer and it travels further.

*** MEASURED FIRST, AND THE 82-ROW DEED TABLE IS NOT A TABLE OF DEEDS. *** It is
83 rows now (he kept writing), counted through his own loader over 42 quest
files, and ALL 83 ARE SHAPED q:<quest>:<stage>@<FACTION>. Not one row is a thing
a person does on the street. AND NOT ONE OF THE SEVEN KINDS THE WALKED STREET
ACTUALLY PUBLISHES IS IN IT:
  claim:met  claim:refused  commit  favour  loan:short  spared  downed
all seven NOT IN THE TABLE. The standing organ says what that means in its own
words on the line that reads it: "unruled deed = weightless". So two people can
watch you put somebody down and it moves nothing, for ever.

AND ANOTHER LANE ALREADY HAD A RED SAYING SO, IN THOSE WORDS: CITY DEEDS on
clean origin/main fails B11, "CONTENTS-PAOLO'S: DEED_WEIGHT is STILL EMPTY (83
rows) and opinion is still 0". Nobody could close it, because closing it means
putting rows in a table whose contents are HIS. That is exactly why this round's
answer is a draft shape in the vote tab and not rows in the game.

*** AND THE CONTROL COST A TRY, AGAIN, AND AGAIN IT WAS MY INSTRUMENT. ***
witness(minds, turn, actorId, deedKind, x, y, where, opts) takes EIGHT arguments
and I passed six, so `where` was undefined, the loop skipped every mind and the
opinion read zero WITH a row and WITHOUT one. A broken instrument reading zero
twice is not evidence. With the right call:
  no row        2 people saw it   0.00 now, 0.00 after 21 days
  row of -2.5   2 people saw it   -2.50 now, -1.95 after 21 days, rung COLD
  claim:met     2 people saw it   +0.50, rung NEUTRAL
THIRD ROUND RUNNING WHERE THE WRONG READING WAS MINE (9/21: BARK_DREW[0] is not
the nearest body; 9/21: measure before you disturb; today: read the signature).
All three were caught by re-testing, never by reasoning. WRITE THAT DOWN.

WHAT WAS BUILT: tools/bohemia_weights.js, called by nothing. HIS RATIO IS THE
ONLY NUMBER, and THE UNIT IS ARGUED FROM HIS OWN RUNG LADDER rather than picked:
the ladder is HOSTILE -3, COLD -1, NEUTRAL +1, WARM +3, so at 0.5 one kindness
does NOT move you a rung and one betrayal DOES. Checked through the game's own
rungFor. On the real organ, beside his 83 rows with none overwritten:

                                 now      21 days   90 days   rung
  you hurt someone              -2.50     -1.95     -0.86     COLD
  you did not pay what you owed -2.50     -1.95     -0.86     COLD
  you kept your word            +0.50     +0.32     +0.08     NEUTRAL
  you let somebody walk         +0.50     +0.32     +0.08     NEUTRAL
  you threw in with an outfit    0.00      0.00      0.00     NEUTRAL

Five kindnesses cancel one betrayal to the decimal. EVERY ZERO CARRIES ITS
REASON IN THE FILE, because a zero with no reason reads as an oversight and gets
"fixed" by the next lane through.

TWO OF HIS FIVE HAVE NO DEED KIND AT ALL and are NAMED rather than given an
invented one: nothing in the street notices STEALING, and the nearest thing to
HELPING SOMEBODY WHO NEEDED IT is "spared", which is mercy in a fight. Making up
a kind so a table looks full is how a system starts lying. FOR QUESTS AND WORLD.

"REMEMBERED LONGER" IS FREE AND I BUILT NOTHING FOR IT: deedHalflife takes the
deed's own weight, so a bad thing is half forgotten after 59 days and a good one
after 33. "TRAVELS FURTHER" IS FALSE AND BACKWARDS: the loudness table
(CT_DEED_CLOUT, in the city, another lane's draft) has five kinds, "you put
somebody down" is NOT one of them so it runs at the default 9 cells and 2
retellings, while "you threw in with an outfit" is risky at 17 and 4. THE
LOUDEST THING ON THE STREET IS THE ONE THAT SAYS LEAST ABOUT YOU. The module
carries a proposal (downed -> reckless, 24 cells and 5 retellings) and NOTHING
APPLIES IT, because that table is on the play surface.

RULE 18 OBSERVED, AND THE GATE HOLDS IT: nothing in the city or the alpha calls
the shape, the city loudness table is untouched, bohemia_standing still ships
DEED_WEIGHT EMPTY as its own gate asserts, 0 of his 83 rows were overwritten,
and the module is in tools/ rather than engine/ on purpose.

THE RULE 22 COOK, IN THE VOTE TAB: "WHAT PEOPLE REPEAT ABOUT YOU"
(slices/BOHEMIA_WHAT_PEOPLE_REPEAT_ABOUT_YOU_9_22_26.html). It leads with the
five things and what each one costs, then the half that counts for nothing, then
the measurement in one sentence, then how long they remember, then the leg that
is backwards. Three ways to go and B is softer than what I built.

THE GATE: gates/weights_shape_gate.js, in the suite as WEIGHTS SHAPE.
Negative-controlled, each put back: drop his ratio to two and invent a kind for
stealing, 8 red; have the city so much as mention the shape, 1 red. AND ONE
CLAIM OF MINE WAS WRONG BEFORE IT WAS RIGHT: it tested whether the word
"halflife" appears in the module, which appears in a COMMENT saying the module
did not build one, so it went red for telling the truth. A test about a comment
is not a test about code. Repointed at substance.

*** NAMED NOT FIXED, AND IT IS THIS LANE'S OWN: MAKE IT RIGHT, the gate from
9/7, is 34 ok and 5 FAILED on clean origin/main. *** Opinion -6.00 where it
wants otherwise, no button, opinion 2.00, the square press, and "Cannot read
properties of undefined (reading 'saysHow')" on the real surface. The last one
is a surface error, which usually means a screen moved under it. RED BEFORE THIS
ROUND, confirmed in a throwaway worktree, and worth a row.

NEXT: the lane's OPEN rows are [rumours travel], [creditor stands], [somebody
hires you], plus [honest crowd] and [family eyes], both marked HELD by the
coordinator. [honest crowd] is my own 9/21 finding turned into a row with my
option A as the default, waiting on the hold.

[PENDING Paolo], carried: when a person dies of old age; how many game days is a
year; who you marry; what a long injury costs to treat. THE 82-ROW DEED TABLE IS
NO LONGER ONE OF THEM: the shape is in the vote tab with three ways to go.
Named for other lanes: no kind for stealing or for helping somebody, QUESTS and
WORLD; the crowd of copies, CHARACTER; the borrow, LIFE+CITY and RUN; the
loudness table, whoever owns CT_DEED_CLOUT.

PEOPLE (people-7h9sfy): 9/21 (d) LATEST -- *** [walking companion] SHIPPED
9e236045. NOBODY HAS EVER WALKED BESIDE YOU, AND THE SHUFFLE HE ASKED FOR HAS
ONE CARD. *** Row A-COMPANION-ON-FOOT, under the rule 18 hold with the RULE 22
cook riding beside it.

PAOLO 9/7: "have it on shuffle mode." No fixed companion, no fixed name.

MEASURED ON THE ALPHA BEFORE A LINE WAS WRITTEN:
  people on his block                       61
  people who will follow him                 0
  hostile / watching / blocking              0 / 0 / 0
  in the follow map at rest                  0
  in the follow map after ten walked steps   0
Only an ENEMY is ever allowed to walk after you in this game, and at his door
there are none. So "a companion on foot" has never once been kept and nothing
said a word.

*** AND THE CONTROL COST THREE TRIES, ALL THREE MINE, NONE OF THEM THE GAME'S.
WRITE THIS DOWN FOR EVERY LANE. ***
  TRY ONE   stubbed a "follow" sign onto BARK_DREW[0], walked, read zero. The
            tempting conclusion is "the pipe is broken" and it is WRONG: sight
            is 9 cells and that body was 62 AWAY, so the pass correctly dropped
            it as "lost you". THE FIRST BODY DRAWN IS NOT THE NEAREST ONE. This
            lane repointed a gate for exactly this trap on 9/16 and I walked
            into it again five rounds later.
  TRY TWO   nearest drawn body, at rest, call the pass directly. Bodies at 2, 9,
            26, 28, 48, 49 cells; two inside sight; ONE JOINED THE FOLLOW MAP ON
            THE FIRST PASS. THE PIPE WORKS.
  TRY THREE was this gate's own first cut: it walked eight steps and THEN
            measured who was near, so the nearest body read 36 cells and the
            deck read ZERO at every hour. Reordered to measure at rest and walk
            last and the same tree reads 2 cells and a deck of 1 to 2.
            MEASURE BEFORE YOU DISTURB.

*** AND THE SHUFFLE HAS ONE CARD, AT EVERY HOUR OF THE DAY. *** Asked of the
game's own schedule and its own sight range, 1 or 2 of 61 people are ever close
enough to walk with him (3am 1, 7am 1, 10am 1, 1pm 1, 5pm 2, 8pm 1, 11pm 1), so
six different saves all drew the same person. THE SHUFFLE ITSELF IS SOUND and
that control is what makes this a fact about the world rather than about my
code: eight candidates over forty saves hands back four different people, the
same save always gives the same answer, out of reach and empty both return
nothing. THE DECK IS THE PROBLEM, NOT THE DEALER. The arithmetic is last
round's crowd finding one layer down: 2,415 cells on screen against 181 he can
reach, so about ninety-three percent of the people he can SEE are people he
cannot touch.

WHAT WAS BUILT: tools/bohemia_companion.js. PURE -- no DOM, no game globals, no
clock, no randomness, so the same world gives the same answer in a gate, on a
page and in the game. Four reasons somebody would walk with you, strongest
first, every one a fact the world already tracks: THEY ARE OWED (you owe them,
and walking with you is how they get paid), THEY OWE, NO SHIFT (their work is
gone, so their day is empty and yours is not), SAFER (alone is worse than beside
somebody). A person with none of them does not follow you, and that is most
people; A MISSING FACT IS A NO, NEVER A MAYBE. What she wants is one of those
turned around, so it is always something already in the world. What she refuses
comes off her own standing: her faction, then her household, then the floor
everybody has. One dial tagged draft:true, the reach is the GAME'S OWN sight
number, and no person is named anywhere in the file because names are his.

RULE 18 OBSERVED, AND THE GATE HOLDS IT: nothing in the walked city or the alpha
calls the chooser, the follow pass is untouched and still enemies only, and the
module is in tools/ rather than engine/ ON PURPOSE, because an engine diff owes
two rebuilt derived slices in the same commit and re-cutting the demo is RUN's
alone under rule 14(a). When the hold lifts, the city calls pick() and hands the
answer to the follow pass this round proved already works.

THE RULE 22 COOK, IN THE VOTE TAB: "THE ONE WHO WALKS WITH YOU"
(slices/BOHEMIA_THE_ONE_WHO_WALKS_WITH_YOU_9_21_26.html). IT LEADS WITH THE
PERSON, which is rule 22(c): Marisela Escobar, WATCH, two cells from his door,
with the face his game makes for her baked through the exact wire this lane
shipped two rounds ago, the name his game gives her, why she comes, what she
wants of her own, and the one thing she will not do. Nothing on that card was
written for the page. Three ways to go and C throws my four reasons away
entirely, because a page that only argues one side is a rigged vote.

THE GATE: gates/walking_companion_gate.js, driven on the ALPHA, in the suite as
WALKING COMPANION. Negative-controlled, each put back: make the shuffle a coin
toss, 2 red; take the opt-out off the page and let the city call the chooser,
2 red.

MEASURED AND NOT FIXED, FOR WHOEVER OWNS IT: filling the deck is either a wider
reach (the game's own sight number, not this lane's) or more people actually
near him, which is the borrow, which is LIFE+CITY's and RUN's and was named last
round. AND NOBODY IS EVER HOSTILE AT HIS DOOR: 0 of 61, so the whole against-you
system is asleep in the first five minutes. FACTIONS and COMBAT, measured not
accused.

NEXT: the lane's OPEN rows are [weights shape], [rumours travel], [creditor
stands], [somebody hires you], plus [family eyes] which the coordinator marked
HELD. RULE 22 binds every round: one real person made and registered in the VOTE
tab, every round, with the measuring beside it and never instead of it.

[PENDING Paolo], carried, none of them blocking: when a person dies of old age;
how many game days is a year; who you marry; what a long injury costs to treat;
the 82-row deed table. Named for other lanes: the crowd of copies is CHARACTER's;
the borrow is LIFE+CITY's and RUN's; the publish cap is red on clean main at 261
MB against 260; the VOTE TAB gate is red on clean main because DIRECTION's
fight-verdict row carries kind "verdict", which that gate does not allow.

PEOPLE (people-7h9sfy): 9/21 (c) LATEST -- *** [horror crowd] SHIPPED dcd19275.
YOUR STREET DRAWS THE SAME CROWD AT BREAKFAST AND AT BEDTIME. *** Row
A-CROWD-THAT-STANDS-TOO-STILL, rule 20(h), school under the rule 18 hold, with
the RULE 22 cook riding beside it.

*** THE ROW'S THREE THINGS ARE ALREADY TRUE, AND THAT IS WHY THE CROWD IS NOT
FRIGHTENING. *** Measured on the alpha over three frames, off the game's own
list of who was drawn:
  bodies drawn                     6, 6, 6
  bodies that ever turned a head   0 of 6
  directions on screen             5 of 8, scattered, not one stuck value
  anybody watching him             0 (only an enemy may watch, and none was near)
  the screen that moved            0.5% against the bible's 10% ceiling
THE LONG HOLD (bible R3) PASSES BY FIFTEEN TIMES, and the gate now holds that
too so nobody "fixes" the stillness. The bible's own R1 says what stillness
alone is worth: "Two wrong things is a haunted house; zero is a screenshot."
There is no wrong thing in this crowd. It is a screenshot.

*** SO THE ROUND WENT TO THE ONE RULE THAT FAILS, R7, THE LIT STREET WITH NOBODY
HOME: "a crowd thin where it should be thick. DRAWN FROM WORLD DATA, NEVER
FAKED. The wrongness traces to a real world-state row." *** Walking the game's
own clock through the day and asking its own schedule, census 61:

  hour        3am   7am  10am   1pm   5pm   8pm  11pm
  outside       0    10    41     3    40     4     2
  drawn         3    24    23    20    23    24    15

THE WORLD SWINGS FORTY-ONE TO FOUR AND THE SCREEN DRAWS TWENTY-THREE AND
TWENTY-FOUR. Ten in the morning and eight at night are the same picture. The
curve underneath is good: a real two-peaked commute out of real schedules, out
in the morning, home at lunch, out again at five, inside by eight. Nobody has to
build it. The screen simply never finds out.

AND THE CAUSE IS NOT A BUG, WHICH IS THE PART THAT MATTERS FOR WHOEVER PICKS
THIS UP. The crowd he sees is __THE_STREET_IS_NEVER_EMPTY__, the 9/7 borrow.
Measured both ways in one probe, nothing committed:
  ten in the morning   41 outside in the world, the world itself puts 2 of them
                       on his screen, the borrow makes it 23
  eight at night        4 outside in the world, the world puts 3, the borrow
                       still makes it 24
At the busiest hour of the day the honest street is TWO PEOPLE. That is why the
borrow exists and the 9/7 record already did the arithmetic (9 cells of sight
covers 361 cells against a 12.8 million cell window, about 2%). THE DEFECT IS
NOT THE BORROWING. IT IS THAT THE BORROW CARRIES A FIXED NUMBER INSTEAD OF THE
NUMBER THE WORLD EARNED. Fix that and R7 is satisfied for free in both
directions: busy at ten, and at eight you walk the street you walked this
morning and nobody is on it.

RULE 18 OBSERVED, AND THE GATE HOLDS IT: nothing was changed on the play
surface. The borrow is another lane's code and this row is school; it and the
facing rule are untouched, and nothing in this round writes a crowd count into
the walked city. The probe that switched the borrow off lived inside one browser
session and was never committed.

THE RULE 22 COOK, IN THE VOTE TAB: "THE STREET AT THREE HOURS"
(slices/BOHEMIA_THE_STREET_AT_THREE_HOURS_9_21_26.html). Five real frames off
the glass, nothing drawn by hand: eight at night both ways, ten in the morning
both ways, and three in the morning, which is ONE file because the borrow
changes nothing when nobody is out. A second identical picture would have been a
comparison that cannot fail, so the page says it out loud instead. The day is
counted beside them and the page argues the other side too: at ten in the
morning nobody is asking for the honest street. Three ways to go, and B is
leaving it exactly as it is.

SEEN WITH MY EYES IN THE 8PM FRAME, NAMED NOT ACTED ON: four bodies standing in
one clump at the bottom, three of them in the same tan coat, and the same
brown-haired woman in a white top drawn three times in one frame. A CROWD MADE
OF COPIES is the other half of why twenty-four people read as filler rather than
as a city. CHARACTER owns the wardrobe spread; the clumping is rule 21's stated
cost (the person does not zoom, so at far zoom bodies on neighbouring cells
overlap).

AND ONE FOR WHOEVER OWNS THE PUBLISH CAP: THE PUBLISHED SURFACE IS ALREADY OVER
IT ON CLEAN MAIN, 261 MB against 260, measured in a throwaway worktree off
origin/main before any of this existed, so that red is not this lane's and SOUNDS
named it first. Five full-colour frames would have taken it to 262, and making
somebody else's red worse is still making it worse, so they were quantised to a
128-colour palette: 0.89 MB to 0.18 MB, indistinguishable on the glass, surface
back to 261. That was 0.7 MB found in five files and nobody has swept the rest of
slices/vote the same way.

THE GATE: gates/horror_crowd_gate.js, driven on the ALPHA, in the suite as
HORROR CROWD. Negative-controlled, each put back: make the evening pair the same
frame twice and give 3am a duplicate, 2 red; drop the leave-it-alone option and
call the borrow an obvious mistake, 2 red.

NEXT: this lane's queue is EMPTY of OPEN rows. Everything the coordinator has
written for PEOPLE is shipped except the five still held behind the playable cut:
[walking companion], [weights shape], [rumours travel], [creditor stands],
[somebody hires you]. RULE 22 binds every round from here: one real person made
and registered in the VOTE tab, every round, with the measuring beside it and
never instead of it.

[PENDING Paolo], carried, none of them blocking: when a person dies of old age;
how many game days is a year; who you marry; what a long injury costs to treat;
the 82-row deed table. Named for other lanes: the two cards stacked at his door
are RUN [no pop ups]; the crowd of copies is CHARACTER's; the publish cap is
whoever owns it, red before this round; DERIVED FRESHNESS wipes its own overlay
with git clean so it reds on any uncommitted work, which is PLUMBER's. AND ONE
MORE, FOUND WHILE GATING THIS ROUND AND LEFT ALONE BECAUSE A LANE FIXES ITS OWN
ROW: the VOTE TAB gate is red on clean origin/main because
direction-fight-verdict-round-3-9-21 carries kind "verdict", which is not one of
the kinds that gate allows. One word in one field, DIRECTION's.

PEOPLE (people-7h9sfy): 9/21 (b) LATEST -- *** [a name] SHIPPED b09052a2. THE
NAMES WERE ALWAYS THERE AND THE ONLY DOOR TO THEM WAS A BUTTON ON A CARD. ***
Row THE-PERSON-AT-HIS-DOOR-HAS-A-NAME, inside [face at the door], which is rule
19(d)'s fourth thing, and this lane's cook for the round under RULE 22.

THE ROW (QUESTS e7e9ab81): "0 of 21 bodies on his block have a name, all answer
SOMEBODY."

MEASURED ON THE ALPHA WITH THE GAME'S OWN READER BEFORE A LINE WAS WRITTEN, AND
IT WAS BIGGER THAN THE ROW: 61 people, 61 of them tier 'stranger', 0 named, 0
names the game remembers knowing. The person who speaks at his door answers
WATCH. The only text drawn on the whole canvas was HOME, the map label. So the
bubble I shipped last round carried a face and the words and nothing that said
who was talking.

*** THEN THE CONTROL LANDED AND THE CONTROL IS THE WHOLE FINDING: ONE CALL TO
CT_MET.ask TURNED "WATCH" INTO "Marisela Escobar". *** tier stranger to asked,
namesKnown 0 to 1, and three more keys cold give Amos Ellison, Perla Nguyen,
Renata Duong. Before believing a negative, prove the instrument can produce a
positive; that is this lane's standing lesson and it paid again.

THE NAMES WERE ALWAYS THERE. 64 given names and 48 surnames have been in
bohemia_people since 7/31, deliberately mixed because Clark County is, under a
law that is RIGHT: A NAME IS EARNED, NEVER GIVEN. AND THE EARNING HAD EXACTLY
ONE DOOR IN THE ENTIRE GAME, a button called #ctask on #ctcard, which is the
card surface rule 19(a) killed on 9/20. The law was not being kept. IT WAS
STARVING, and a law nothing can satisfy looks exactly like a law being obeyed.
WRITE THAT DOWN FOR EVERY LANE: a rule with no way to be satisfied reads green
forever.

AND A THIRD THING WAS BUILT AND NEVER REACHED: ctNames draws a gold name tag
over a person's head, with a dark ring so it reads over pale ground and dark
alike. It has drawn NOTHING for the life of the game, because nobody was ever
named. Same shape as the face last round: built, correct, unreachable.

THE DOOR OFF THE CARD IS THE REAL-WORLD ONE. A stranger who walks up to YOU
wanting something opens with who they are, because they want something; somebody
you walk past owes you nothing. So an INTERACTIVE moment earns the name and an
ambient bark never does. The law is untouched, the crowd stays strangers, and
the law finally has a way to be satisfied that is not a dead button.

ONE WRITER: CT_MET.ask, the ledger's own call, the same one that button made,
with the same arguments. Nothing invents a name, stores a name, or keeps a
second list of who is known. ONE READER: ctPersonName, what the down card, the
crew list and the lock list already read, so a person cannot be called two
things on two surfaces. TWO WRITERS FOR ONE FACT is this lane's recurring defect
and it is designed out here rather than checked for.

THREE THINGS LIT UP AT ONCE off that one bit: the gold tag over their head, the
heading in their own bubble above their words and beside their face, and every
list in the game that names people.

ON THE GLASS, one frame each, watched on the real canvas:
  a stranger talking near him   WATCH at 9px dim, over "They handed something
                                over. Saw it." at 11px. Nothing over their head.
                                Nothing earned.
  somebody who came to him      Marisela over their head in gold with the dark
                                ring; "Marisela Escobar" at 9px warmer, over
                                "somebody steps out. they want something."
  the block afterwards          1 of 61 named. The crowd is still strangers.

*** AND FIXING THIS ROUND'S INSTRUMENT FOUND A CLAIM THAT COULD NOT FAIL IN THIS
LANE'S OWN GATE FROM THE ROUND BEFORE. *** ctDeedBark sets BARK.until from
whatever its caller hands it, and its one real caller is barkTick, on
performance.now(). My probe handed it ctMinuteNow(), a game minute around 360
against a wall clock past 15,000, so the bubble was ALREADY EXPIRED when the
first render ticked it. That is the same two-clocks bug I fixed in the game last
round, sitting inside the instrument I fixed it with. The cost: FACE AT THE
DOOR's control claim ("before the head arrives the bubble draws with no face")
was passing because NOTHING DREW AT ALL.

FIXED, AND THE FIX IMMEDIATELY CAUGHT A SECOND WRONG THING. With the right clock
the control read THREE face draws, not zero: by the time any probe runs, the
boot walk has already barked and the face cache is holding heads. TIME WAS NEVER
THE VARIABLE. The control now takes that speaker's head away and proves the
bubble still draws its words with no face, which is NO FACE, NO SPACE stated as
something that can fail. 3 face draws RED, then 0 with the bubble drawn GREEN.
FACE AT THE DOOR is 31/0 again and one of those 31 now means what it says.

THE GATE: gates/a_name_gate.js, driven on the ALPHA, in the suite as A NAME.
Negative-controlled, each put back: close the door again (stop passing the ask),
1 red; let a stranger barking near him earn a name, 4 red; take the heading out
of the bubble, 3 red. The glass section also speaks the same moment WITHOUT the
ask and proves nothing is earned, so "an ambient bark earns nothing" is a claim
about the mechanism and not about one call site.

RULE 22 COOK, IN THE VOTE TAB: "WHAT THE PERSON AT YOUR DOOR IS CALLED". The real
names the game hands out, the trade each one replaces, where the bank comes from,
and a plainer set beside them. It says in its own words that a stranger keeps
their trade, so a yes does not quietly name the whole street. Names are his and
nothing here decides one.

MEASURED AND NOT TOUCHED: #ctask on #ctcard is still there. Rule 19(a) kills the
card surface, not this lane's code, and ripping a working button out of another
lane's card while that card is being removed is how two lanes collide.
THE OTHER 60 ARE STILL STRANGERS ON PURPOSE. What is missing is more reasons for
somebody to want something from you, which is [somebody hires you] and QUESTS,
not more naming.

NEXT: the lane's OPEN rows under the rule 18 hold are [horror crowd] (rule 20h
school: a crowd that stands too still, measured against the crowd we place),
then [walking companion], [weights shape], [rumours travel], [creditor stands],
[somebody hires you]. RULE 22 binds every round from here: one real person made
and registered in the VOTE tab, every round, measuring beside it and never
instead of it.

[PENDING Paolo], carried, none of them blocking: when a person dies of old age;
how many game days is a year; who you marry; what a long injury costs to treat;
the 82-row deed table. Named for other lanes: the two cards stacked at his door
are RUN [no pop ups]; DERIVED FRESHNESS wipes its own overlay with git clean so
it reds on any uncommitted work, which is PLUMBER's.

PEOPLE (people-7h9sfy): 9/21 LATEST -- *** [face at the door] SHIPPED f75eb900.
WHEN ANYBODY IN THIS GAME TALKED TO YOU, THE ONLY FACE ON SCREEN WAS YOURS. ***
Rule 19, Paolo 9/20: "text on screen coming from people's voice, and when they
speak to you it shows the character portrait." The ONE row this lane was un-held
for under rule 18.

MEASURED WITH A CONTROL BEFORE A LINE OF IT WAS WRITTEN, because "there are no
faces" is a negative and this lane's standing lesson is that you prove the
instrument can produce a positive first. On the walked surface: TWO canvases
total, the world and his own head in the middle of the D-pad ring, and his head
was 4,096 lit pixels of 64x64. That is the control: a face CAN be drawn on that
screen. Against it, ELEVEN BODIES, EIGHT DIRECTIONS EACH, AND NOT ONE FACE.
Somebody speaks ("They handed something over. Saw it.") and no portrait anywhere.
So the machinery to draw a head on that street existed and had exactly one
customer: him.

AND EVERY PIECE OF THE ANSWER WAS BUILT ON 8/26 AND NEVER CALLED. The alpha's own
face block says it about itself: the performance was built and could not be used
"because only one person in Bohemia had a face... that is why the 8/26 turn ended
with a gated feature nothing called". faceFor(id) has been sitting there since,
deterministic, same id same face forever with nothing stored. THIS ROUND IS THE
CALL. The stranger's head is baked down the PLAYER'S OWN PATH end to end
(faceFor, the ramp, renderFace, packIdx, decodePlayerFrame), so nothing new draws
a face and nothing new decodes one. The city asks the alpha ONCE per person over
a message, by THE ID THE BODY IS DRAWN FROM (one id, one whole person), and the
head lands round and pixelated in the left of that person's own speech bubble.
NO FACE, NO SPACE: a person whose head has not arrived yet gets exactly the bubble
this file drew before, to the pixel. It only fits at all because [a human being]
moved the bubble off the speaker's face five rounds ago.

RULE 19(e) IN THE SAME COMMIT: THE WALK DIRECTOR OPENED A CARD AND DOES NOT ANY
MORE. Same approved roster, same words it already held; what changed is WHO SAYS
IT. A person who is actually drawn says it, in their own bubble, with their face
beside the words. AND WITH NOBODY ON SCREEN IT FIRES NOTHING AT ALL, which is the
other half of the rule: spoken by 12:12:900 with a body there, refused outright
with the drawn list emptied. A moment with no body was a caption pretending to be
an event.

*** THE MEASUREMENT THAT COST THE MOST, WRITTEN DOWN FOR EVERY LANE: AN ALPHA
CHANGE CANNOT BE VERIFIED ON THE DEMO. *** The one driver (rule 14g) opens
BOHEMIA_DEMO.html by default and that file is a BAKED CUT. A CITY change reaches
it by reference; an ALPHA change does not. The symptom was silent and convincing:
the ask went out of the city every single time, nothing came back, no error, no
throw, and the live dispatcher on the demo carried the branch NEXT TO mine because
it was baked before mine existed. Every piece worked when asked directly in the
alpha's own window. The driver takes the file:
open({ file: 'BOHEMIA_ALPHA_0_9.html' }).

*** AND THIS LANE'S OWN OLDER GATE CAUGHT A BUG I HAD JUST WRITTEN: TWO CLOCKS. ***
The bark slot runs on performance.now (barkTick is called with it, BARK.next is
now + 4000), so that organ counts milliseconds since page load. The first cut of
walkSpeak set the bubble's life from ctMinuteNow -- GAME MINUTES, a number like
360, against a wall clock already past 15,000. So every moment it spoke was
ALREADY EXPIRED when the next tick looked, and on its way out barkTick pushed the
next bark 1,500 ms away: the moment was silent AND it silenced the next person
too. NOTHING THREW AND NOTHING LOOKED WRONG. [a human being], this lane's gate
from five rounds ago, found it because it counts speech bubbles on the real
canvas: clean origin/main 2, 3, 1 over three runs; this tree before 0, 2, 0;
after the fix 3, 3, 3. TWO WRITERS FOR ONE FACT, again, and it is a claim in the
new gate now.

THE GATE: gates/face_at_the_door_gate.js, 31 claims, DRIVEN ON THE ALPHA. The
face (baked on demand down his own path, asked once per person, unpacked by his
own decoder, asked for with the speaker's own id); the bubble (only widens when
there is really a head; round and pixelated like his own); rule 19(e) (no roadCard
in the walk director at all, the moment spoken through a drawn body, the roster's
own line); the glass (the control with no face before it lands, the bake, the draw
on the real canvas, the round clip, spoken by somebody, and NOTHING when nobody is
there). Three negative controls, each put back: take the face out of the bubble,
let the moment speak with nobody, put roadCard back in the director.

RUN THE BROWSER GATES SERIALLY. Measured 9/16 and it holds: eight of them in
parallel make every timing claim inside them lie.

NAMED WITH A PHOTOGRAPH, NOT TOUCHED, BECAUSE IT IS NOT THIS LANE'S: I shot the
alpha at boot and it is his 9/20 complaint unchanged -- TWO CARDS STACKED AT THE
DOOR (DAY 1 BEGINS BEFORE THE DAY / WATCH / NOT NOW, and under it THE METER READER
with six text buttons and GET UP), NO PERSON, NO BODY, NO FACE. That is RUN
[no pop ups], the first line of RUN under rule 19.

NEXT: [a name] is CLAIMED 9/21 (the row the coordinator added this round, and it
is inside this one): the person at his door answers SOMEBODY, 0 of 21 bodies on
his block have a name. The row says add the second slot to the portrait pipe that
already reaches the city, do not build a system. Under RULE 22 (Paolo 9/21, cook
every round) this lane makes a person and REGISTERS IT IN THE VOTE TAB every
round; names are his, so the name ships draft:true and goes to VOTE as IDENTITY.
Still held behind the playable cut: [walking companion], [weights shape],
[rumours travel], [creditor stands], [somebody hires you]. New school row
[horror crowd] (rule 20h).

[PENDING Paolo], carried, none of them blocking: when a person dies of old age;
how many game days is a year; who you marry; what a long injury costs to treat;
the 82-row deed table. Named for other lanes: the wake card at his door is RUN
[no pop ups]; DERIVED FRESHNESS wipes its own overlay with git clean so it reds on
any uncommitted work, which is PLUMBER's.

PEOPLE (people-7h9sfy): 9/18 LATEST -- *** [heir moment] SHIPPED f31688fd. THE
FOLD HANDED A HUNDRED YEARS TO A NEWBORN. *** SUCCESSION-BEAT, coordinator 9/5:
"an heir inherits the house, the purse, every debt in full, half the standing,
and the wardrobe."
MEASURED FIRST, AND FOUR OF THE FIVE WERE ALREADY BUILT BY SOMEBODY ELSE, AND ONE
OF THEM REVERSES THE ROW:
  the house     WORLD [fold carries], 9/16: kept if lit, lost if dark
  the debt      WORLD [debt carried], 9/12, and it is the OPPOSITE: the bill DIES
                and the people stay. Newer, and what DYNASTY sharpened, so "every
                debt in full" is SUPERSEDED rather than built. Naming that is the
                job; quietly building the older ruling would have put two answers
                in the game.
  the standing  inherit(), and better than "half", which is a number: only what
                was RETOLD survives
  the purse     crosses whole, 9 before and 9 after
  the wardrobe  nothing is worn on this surface, so nothing to move
SO WHAT WAS MISSING WAS NOT AN ACCOUNT, IT WAS THE BEAT. Three FINISHED things
sat in the played file with nobody calling them:
  famAge()      ZERO CALLERS. The fold advanced a generation and NOT ONE PERSON
                AGED, so the heir was a child for ever. Its own comment says
                where it belongs: "the fold hands it the canon ~30".
  HEIR_TOOK     written at the fold and READ BY NOTHING, its lines composed,
                thrown away, and recomputed at the next fold.
  famHeirSay()  read in ONE place, a card, PINNED AT GENERATION 1, so after a
                fold it named the heir of a life already handed over.
This lane has shipped a dead export twice and been caught both times. Here were
three already in the tree, and the row's own name is the beat they add up to.
ON THE GLASS, WITH A CONTROL: the first life says NOTHING about a handover (ten
rows, none of them a beat); across the fold the children go newborn -> ADULT, six
move an age band, six alive before and six after; and the card says
  YOU ARE      YOUR FIRSTBORN
  WHO INHERITS YOUR SECOND
  YEARS SINCE  30 YEARS, 6 OLDER
Two different people for two different questions, which is the fix as much as the
feature.
NOT ONE NUMBER IS TYPED: the handoff is read off BohemiaStayed.HANDOFF.years, and
there is NO FALLBACK, so a missing canon means nobody ages rather than a quiet
thirty nobody can trace. NOBODY DIES, because when a person dies of old age is a
magnitude the family module is parked on until he rules it. WHEN a generation
turns is STILL HIS and no trigger was added.
TWO THINGS I GOT WRONG, BOTH CAUGHT BEFORE THEY SHIPPED: I nearly recorded that
MARRIAGE WAS BROKEN, because I read spouseOf(tree).name and printed null -- it
produces a spouse every time and the NAME is null because naming is HIS. And the
first cut printed ONE PERSON UNDER TWO HEADINGS. One claim in my own gate COULD
NOT FAIL: "the purse crosses whole, 0 before and 0 after" is true of an empty
pocket whatever the fold does.
*** AND THE MERGE CAUGHT A DEFECT IN LAST ROUND'S GATE, WHICH IS EXACTLY WHAT A
RE-RUN ON A MERGED TREE IS FOR. *** ENEMIES REMEMBER went 25/0 to 22/3 after
rebasing onto RUN's wider camera, AND THE FEATURE WAS FINE. My gate asked about
BARK_DREW[0] and called that "the man": true while one body was on the glass, and
false the moment six are drawn, because the deed publishes by REACH so some of
the six witness it and some do not. Measured on the merged tree: six drawn, TWO
carrying `spared`, one of those two speaking. The gate asks who WATCHED it now
instead of who is at an index. REPOINTED, NOT LOOSENED: unplugged, it still reds
the same seven claims. A claim pinned to an index is a claim about the camera.
AND THE CITY MERGE KEPT BOTH HALVES: another lane put CHARGE_TONIGHT on the same
declaration line this round added to, and taking either side whole would have
silently deleted their work.
RULE 13, PRE-PUSH PASS, RUN SERIALLY (last round proved eight browser-driving
gates in parallel make every timing claim inside them lie): HEIR MOMENT 23/0,
FOLD CARRIES 26/0, FOLD RUNTIME 35/0, CARD FOLD 18/0, FAMILY 15/0, ENEMIES
REMEMBER 25/0, LOCK THEM 43/0, A HUMAN BEING 14/0, MOMENT ENDS 18/0, PEOPLE NOT
LATE 16/0, ALPHA LOADS 20/0, COLD BOOT 11/0. Stamp 9/18f, resolved FORWARD twice
over other lanes rather than back.
[PENDING Paolo], carried: when a person dies of old age; how many game days is a
year; who you marry; what a long injury costs to treat; the 82-row deed table.
NEXT: the queue is [walking companion], [weights shape], [rumours travel],
[creditor stands], [somebody hires you].
Record: records/BOHEMIA_HEIR_MOMENT_9_18_26.txt ***

PEOPLE (people-7h9sfy): 9/16 LATEST -- *** [enemies remember] SHIPPED c4f62ae1.
THE MAN YOU SPARED TURNS UP. *** BB-THE-SHADOW: "BECAUSE WE NEVER RESET, EVERY
RELATIONSHIP IN BOHEMIA IS A REPEATED GAME... THE SHADOW OF THE FUTURE IS NOT A
METAPHOR HERE, IT IS THE ARCHITECTURE." The row names its own cheapest first
version and this is it.
MEASURED FIRST, AND THE HOLE WAS AT THE ONE MOMENT IT SHOWS MOST. roadChoose is
where EVERY encounter choice in this game lands. Read brace-balanced, with a
control to prove the reader works:
  roadChoose          5,230 characters
  deeds published     ZERO
  witnesses           ZERO
  looks at the crowd  ZERO
So you could hand a starving man your water, or face him down and watch him walk
off down the wash, and NOT ONE PERSON IN THE VALLEY KNEW IT HAPPENED, INCLUDING
HIM. Every encounter was a one-shot game inside an architecture whose only real
advantage is that nothing is one. And the other half: ctSeenMeCount was read in
exactly ONE place, a crew list on a card, so nobody on the street had ever shown
that they know you.
WHAT IT TOOK: ONE CALL AND FOUR TABLE ROWS. The publisher (ctDeed), the witness
set (whoever the render actually DREW), the fading, the gossip and the mouth
(ctDeedBark, "THEY SAY IT OUT LOUD, WITHOUT YOU OPENING ANYTHING") all already
existed. NOTHING IS STORED AND NOBODY IS INVENTED: there is no book of who you
spared, because the man is already carrying it, and the man is a body the game
had already drawn -- a street with sixty-one people on it does not need a
sixty-second one for a guy to step out of the wash. NO WEIGHT IS WRITTEN, so
DEED_WEIGHT is still empty and still his.
The three arms of HIS OWN approved encounter ("pay / scare / drop, the moral
mirror of attack-anyone") write three DIFFERENT acts: favour, spared, downed.
Tit-for-tat copies your LAST move, and a memory that cannot tell a handout from a
beating cannot copy anything.
ON THE GLASS, WITH A CONTROL ON BOTH ENDS:
  before           he holds nothing, and the bark organ fires 0
  FACE HIM DOWN    "You wait. He works up to it twice and then walks off."
  after            he holds `spared`, as something he WATCHED
  meet him again   "Had him cold. Let him walk." -- the SAME person
An arm he cannot afford writes NOTHING: the refusal returns before the write.
*** A KIND NEEDS A ROW IN TWO TABLES OR IT IS REMEMBERED AND MUTE. *** Publishing
`spared` with no CT_DEED_WORDS row reached one person and landed NOWHERE, because
the reader drops any kind it has no words for. Then it landed and he STILL said
nothing, because the street bark reads a SECOND table, CT_REACT. Two tables, two
questions: what a deed IS, and what somebody SAYS when they see you again.
AND THE HALF I BUILT AND DELETED BEFORE IT EVER RAN: a second line writer, its own
words, and a book of who had been told. CT_DEED_WORDS turned out to feed the bark
organ, whose own header says it exists so people speak without him opening
anything. TWO WRITERS FOR ONE FACT is the exact defect this lane has found in its
own work three rounds running (two body ladders that put a bubble on a face, two
ids for one man, two windows with one name). It is also better this way: he hears
it from the man's own mouth instead of from a caption. And it only READS because
of [a human being]: until that shipped, the bubble was painted on the face.
NEGATIVE-CONTROLLED THREE WAYS, and THE CONTROLS CAUGHT THREE DEFECTS IN THE GATE
ITSELF, which is what they are for: two table claims that were one claim wearing
two hats (both matched the same pattern, so deleting every CT_DEED_WORDS row left
BOTH green off the CT_REACT rows underneath); a turns-up claim that ANY voice on
the street satisfied, caught by a control barking about the power being out; and
a length floor of 2,000 sitting fourteen characters under a real body.
*** A CONFOUND WORTH NAMING FOR THE WHOLE FLEET, because rule 13's pre-push pass
invites it: RUN EIGHT BROWSER-DRIVING GATES IN PARALLEL AND EVERY TIMING CLAIM
INSIDE THEM LIES. *** COLD BOOT read 14,637 ms against a 12 s budget and PEOPLE
NOT LATE read 12 bodies against a floor of 20. Run one at a time on the SAME tree
they are 11/0 and 16/0 with 38 bodies. Both were green on clean origin/main too.
The only red that is really there is PAGES PUBLISH, identical on clean main.
RULE 14(a) RATCHET: walked the cut of this tree with the one driver, 496 taps in
60 s, 0 page errors, people on the glass, the street talking. Stamp 9/16e,
resolved FORWARD over another lane's 9/16d rather than back.
MEASURED AND NOT FIXED: the man is still not a character. What remembers is the
crowd that saw it, and the nearest drawn body is who the moment happens to.
Giving the man with the pipe a name and a history is a bigger row than this one.
What these acts are WORTH is [PENDING Paolo] with the rest of the deed table.
NEXT: the queue is [heir moment], [walking companion], [weights shape], [rumours
travel], [creditor stands], [somebody hires you].
Record: records/BOHEMIA_ENEMIES_REMEMBER_9_16_26.txt ***

PEOPLE (people-7h9sfy): 9/15 (c) LATEST -- *** [a human being] ROUND TWO, 4c7301b8.
HE WAS LOOKING AT HIMSELF. *** EYES E26 round 6 bounced this straight back at the
lane on the row I had already shipped: "-> PEOPLE [a human being]: the work is
EARLIER and UNFROZEN, not MORE." Paolo 9/15: "I didn't see a single human being."
MEASURED ON THE DEMO, armed before any page script and READ OFF THE CALL STACK so
the answer knows whose body it is:
  the city draws its first anything      4,804 ms
  THE PLAYER APPEARS                    12,493 ms
  SOMEBODY ELSE APPEARS                 16,507 ms
  HE IS ON THE GLASS ALONE FOR           4,014 ms
That is his sentence in numbers. For four seconds there is one man on the screen
and it is him, and everything before it is a blank or a frozen city.
AND ALMOST NONE OF IT IS THIS LANE BEING SLOW. Of the 11,703 ms wait before
another person, 11,481 ms (98%) is THE MAIN THREAD BEING HELD. Every draw
bucketed by the second: second 4 is 3,128 draws and no people, second 5 is 3,869
and no people, seconds 6 through 11 have NO ROW AT ALL because nothing was drawn,
and second 12 has 7,290 draws and the first body. SIX WHOLE SECONDS WITH NO DRAW
OF ANY KIND. The commonest sizes are 44x44 ground tiles and 704x704 chunk blits:
the ground bake is what those eight seconds are spent on.
WHICH HALF IS WHOSE. NOT THIS LANE'S: the thread being held, which EYES routed
themselves to PLUMBER [sixty fps] at 28.9 s frozen out of the first 300. This
round saw 30 to 34 blocks totalling 23 to 25 s in thirty seconds. THIS LANE'S:
the 366 ms he is alone while the thread is FREE, and the promise it stays that
small when the freeze is fixed, so people are already the first thing painted
rather than a second problem found afterwards.
THE GATE HOLDS A RATIO AND A TRIPWIRE AND THEY ARE DIFFERENT QUESTIONS, written
down rather than hoped over. The RATIO describes the wait (90% or more of it must
be the thread) and means the same thing on this box and on his phone, which a
wall-clock ceiling never could. BUT IT CANNOT CATCH THIS LANE GETTING SLOWER: a
delay injected inside an already-blocked window left it at 100% for three seconds
and 93% for ten. So the TRIPWIRE is the time he is alone WHILE THE THREAD IS
FREE, which belongs to nobody else. 366 ms against a beat of 500, and the
injected delay pushed it to 1,351 ms and turned it red.
*** MY INSTRUMENT WAS WRONG THREE TIMES AND THE THIRD ONE IS THE ROUND. ***
 1. a wrap that landed at 12.9 s reported "the pass has run 0 times" about a pass
    that had already painted three bodies. The zero was the moment I started
    looking. EYES published this exact error in round 4 and again in round 6 and
    I made it a third time with their warning on the front page in front of me.
 2. a poller read PLAYER_CV false the whole way through, including after people
    were plainly on the glass, because PLAYER_CV lives in the CITY frame and the
    poller was reading the SHELL's window. Two windows, one name.
 3. IT COUNTED THE PLAYER AS A HUMAN BEING. A body was known by the ladder's own
    rungs, which is right for "is this a body" and useless for "did he see a
    PERSON", because the player is drawn on the same ladder. It reported the
    first human being at 12.5 s; the stack says that is renderHuman drawing HIM
    and the first peoplePass draw is four seconds later. A control aimed at
    something else exposed it. THE TOOL SENT TO MEASURE HIS COMPLAINT MADE HIS
    COMPLAINT. A body is not a human being until you know whose it is.
AND ONE CLAIM PASSED TWICE BY LUCK: "how long after the thread came free did a
body land" has no answer when the body lands INSIDE a block, and it does, because
drawing is the work that starves the heartbeat. 38 ms, then 42 ms, then 9,492 ms
with nothing about the game changed.
NOTHING WAS ADDED TO THE POPULATION, which is what EYES asked for in the same
sentence, and NO GAME CODE CHANGED: the walked city and the engine were proved
byte-identical to HEAD after every control edit rather than assumed. The stamp is
not bumped, because a new letter over a build with nothing new in it is the one
way that stamp can lie.
ONE MORE THING WORTH KNOWING FOR RULE 16: RUN's bigger step landed under this
round and bodyLadder still picks from the SAME four rungs, so the detector above
and [a human being]'s bubble fix both still hold on the bigger bodies.
NEXT: the lane's queue is [enemies remember], [heir moment], [walking companion],
[weights shape], [rumours travel], [creditor stands], [somebody hires you]. The
EARLIER half of his sentence is now blocked on PLUMBER's freeze, not on this lane.
Record: records/BOHEMIA_THE_PEOPLE_ARE_NOT_LATE_9_15_26.txt ***

PEOPLE (people-7h9sfy): 9/15 (b) LATEST -- *** [lock them] SHIPPED 6b553bcb. THE
FATHER FELL, AND THE GAME DID NOT SAY A WORD. *** Paolo 9/11: "there has to be a
way to make it easy to lock characters they don't want to die, companions, people
in your company, not endgame bullshit." Held since 9/13 under rule 14b; this
lane's five-minute break shipped, so it was taken.
THE CONTROL IS THE WHOLE FINDING, and it is the state he played. On the demo,
first morning, phone profile:
  the father falls, nothing locked   he IS down, and the card SAYS NOTHING
  one tap, the same fall, same day   RAY IS DOWN, KNOCKED ABOUT, 7 DAYS
Same man, same injury, same second. The only difference is one tap.
WHY IT SAID NOTHING. The promise built by [down not dead] covers two lists and
both are DERIVED. The family loop takes only the person you MARRIED and the
children you HAD, so the father you were born to is not on it. The other is
ctYours(), and bohemia_company.js says in its own words why there is no roster:
"NO ROSTER, NO STATE, NO ADD, NO REMOVE. Pure functions of a snapshot." That is
right for a company. It is a hole in a promise.
AND THE HOLE GROWS THE LONGER YOU PLAY. ctYours() is recomputed from bonds and
WITNESSES every call, and a witness is somebody carrying a deed of yours, which
fades on a three-week halflife. So the person the game called yours this morning
can quietly stop being yours, and the protection stops with nothing said and
nobody at fault. *** A NAME HE TAPPED DOES NOT DECAY. *** That is why this is a
MARK and not another computation, and it is deliberately the opposite shape from
the down module, where "are they down" IS a question against the clock.
MEASURED FIRST, BEFORE A LINE WAS WRITTEN: ctYours() 0, WOULD FOLLOW YOU NOBODY
YET, WOULD COME WITH YOU 46 of 61, YOUR PEOPLE RAY / DENISE / MARCO. Three
people, all three by birth, and no way to say "that one" about the other
sixty-one. The word LOCK meant nothing in any people module: every hit was the
word CLOCK or the word LOCKED inside a citation of one of his own rulings. So the
tap went on those three names, on a card he already opens, with no new row and no
new button, because the first hour is the half of his sentence easiest to lose.
WHAT IT COSTS, WHICH IS WHAT MAKES IT A CHOICE. With nobody killable, the weight
of a fall is what you lose WHILE they are down. The length is the injury the down
module already rolled; the thing lost is their share of the carry, which in this
world is the crew. Measured on the glass: crew 46 -> 45 the moment somebody fell,
and the card says RAY COSTS YOU / GIVING YOU NOTHING, 7 DAYS. NOT ONE NUMBER IS
NEW: no cap, no price, no rung. And the cost is not lock-only on purpose -- a
hurt person carries nothing either way, and what the lock buys is that they COME
BACK.
THREE THINGS I GOT WRONG, ALL THREE CAUGHT BY DRIVING IT:
 1. the row rendered three plain names and NOT ONE TAP TARGET, because
    famLiving() hands back the STORED member, whose keys are role, name, age,
    draft, alive -- there is no id on it. It asks the tree now and REFUSES rather
    than guessing, and the id format is still spelled in exactly one place.
 2. the tap did nothing and nothing threw. #daycardIn is ONE PERMANENT element
    every card refills with innerHTML, which is why cardShow assigns i.onclick
    rather than adding a listener. addEventListener STACKS: every redraw added a
    handler, one tap ran all of them, and the lock toggled once per listener --
    on, off, on, off, silently, with an even number of redraws behind him.
 3. THE GATE'S OWN RESET DID NOT RESET, costing four claims. Clearing
    localStorage does not clear the book: ctLockLoad only overwrites the
    in-memory copy when storage HAS something. It resets through the player's own
    door now and THE RESET HAS TO PROVE ITSELF before the block that needs it.
THE GATE IS 43/0 AND IT DRIVES THE DEMO, judged the way rule 14(h) asks: the
panel still OPEN and its own words moved. Negative-controlled four ways, each put
back, and control one caught a claim of mine that was too loose to fail (a
fixed-size window after the function name ran past its end and matched the export
line underneath; it reads the brace-balanced body now).
NAMED, NOT FIXED, AND NOT THIS LANE'S -- FOR PLUMBER, whose charter is every
checker honest: DERIVED FRESHNESS GOES RED ON ANY UNCOMMITTED WORK. It overlays
the working tree into its own worktree so it can "check what is about to be
PUSHED", then resetWorktree runs `git checkout -- .` and `git clean -fdq .` in
that worktree before every maker, which erases the overlay. So it compares HEAD's
file against the working file and reports drift of +0/-0 -- zero lines, because
the worktree it diffs is clean. Green on clean origin/main, red on my tree, green
again the moment the same bytes were committed: 43 of 43 re-derive byte for byte.
It only ever measures committed work, and it cost this round a full classification
pass to find that out.
MEASURED AND NOT FIXED: the CARRY is not built, because there is no party speed
anywhere in the walked city, so there is nothing to slow and inventing one is a
number nobody ruled. What treatment costs is still [PENDING Paolo] from [down not
dead]. The SCAR wants a deed and none of the city's five deed kinds carries a
weight yet, so writing a fall into the ledger would be inventing content.
RULE 14 FOLLOWED: the diff is one new engine module (inlined verbatim in the
walked city, resync 135 of 136 fresh and the one unrecognised is LIFE+CITY's
brand-new lattice module), the city seam, a gate, its registration, the stamp and
a record. THE DEMO CUTTER WAS NOT RUN; the demo loads the walked city by
reference. Stamp 9/15p, resolved FORWARD over another lane's 9/15o rather than
back.
NEXT: the lane's queue is [enemies remember], [heir moment], [walking companion],
[weights shape], [rumours travel], [creditor stands], [somebody hires you]. Rule
16 (ONE STEP IS ONE HOUSE) is not this lane's first line, but the body ladder this
lane consolidated last round is what it stands on.
Record: records/BOHEMIA_LOCK_THEM_9_15_26.txt ***

PEOPLE (people-7h9sfy): 9/15 LATEST -- *** [a human being] SHIPPED 7aa0cac6. THERE
WAS ONE STANDING TWO CELLS FROM HIM AT THE DOOR, AND THE SPEECH BUBBLE WAS PAINTED
OVER THEIR FACE. *** Paolo 9/15, his second play: "I didn't see a single human
being. Very strange."
THE MEASUREMENT CAME BACK THE OPPOSITE OF THE COMPLAINT. On the shipped cut, one
driver, phone profile: first person on the glass 0.0 SECONDS after the door, 2 on
screen at 10s, 30s and 60s, nearest one 2 cells directly above him. So the answer
to "how long until a person" is IMMEDIATELY, and his sentence is still true. He
looked at a person and did not see a human being. That is the whole round: not who
is missing, but why what was there did not read.
SO I LOOKED AT THE GLASS, WHICH IS WHAT SETTLED IT. His head: pale skin, green
eyes, a mouth, white hair, a hat. The other person's: a dark brown blob with two
faint dots, sitting INSIDE a near-black speech box. No mouth, no hair shape.
THE CAUSE IS ARITHMETIC, NOT OPINION. The bark bubble lifted itself 0.9 of a CELL
above the speaker's cell. A body is not drawn in cells, it is drawn on the ZOOM
LADDER, and at the zoom the demo opens on that is 112 px against a 44 px cell. The
bubble clears a head only while a body is under 1.9 cells tall; it is 2.5, so a
panel at 0.92 alpha covered the top 28.4 px, which is the face. AND IT WAS NOT ONE
UNLUCKY ZOOM: at every rung the ladder can put him on, the old lift covered the
face at SEVEN OF TEN, worst 102 px at C = 64.
*** THE LADDER WAS WRITTEN OUT TWICE IN THAT FILE AND THE BUBBLE COULD SEE NEITHER
COPY, SO IT GUESSED. *** Two copies of a rule are how a third thing ends up
disagreeing with both. There is ONE now, bodyLadder(C), and three readers. AND THE
NEW LIFT IS NOT A NUMBER EITHER: the body's own top, sy + C - lad, minus the
bubble's height and the padding it already had. Every value was already in the
function. Nothing was picked.
ON THE GLASS AFTER: brown hair, a face, green eyes, a mouth, a cream shirt with a
red collar, blue jeans, dark boots, and the bubble sitting cleanly above them.
THE GATE WATCHES THE CANVAS BECAUSE THE FIRST TWO CUTS DID NOT. Cut one recomputed
the geometry in the gate and stayed GREEN with the old lift back in the page: it
was checking my copy of the sum while the game kept the bug, the same defect this
lane was caught in two rounds ago. Cut two watched the canvas but matched by size
and saw 4,281 "bubbles", every ground tile and UI panel in the frame. Cut three,
which shipped, reads both rectangles off the page by what they ARE: the bubble by
its own ink, a body by the ladder's own rungs. Nine bodies, three bubbles.
NEGATIVE-CONTROLLED, AND THE CONTROL IS THE STATE HE PLAYED: old lift back, RED
twice, and the canvas claim measures the 28.4 px overlap ITSELF off real painted
rectangles, the same number the arithmetic predicted; a second ladder copy, RED;
restored, GREEN at worst overlap 0. One more instrument slip, named because it
keeps happening: a claim that his words are in the record went red on a record that
says exactly that, because the sentence wraps and the regex met the line break.
THE FOUR ROUNDS BEFORE THIS ONE NEVER REACHED THIS BLOCK (the 9/13 handoff problem
in person), so they are here in one line each: [offer yes] b39c33cb, the first card
of the game had no way to say YES; [lift moves] aaca9718, he pressed GET IN and did
not move one cell on foot; [moment ends] 53c03d97, a line stayed on screen long
after the thing it described was gone; [pool is real] c7bad95b, HALF THE STREET'S
POOL CANNOT FIRE because two moments wait on animals the valley does not draw, and
round three's headline to him was wrong and is corrected in that record.
MEASURED AND NOT FIXED: PERSON LOOK is red and is IDENTICAL on a clean origin/main
worktree, so it is not this round's. The other person's FACE ITSELF is still low
contrast at street size, dark features on dark skin. That is the new PORTRAIT
lane's charter in its own words, "blank faces are the defect", and it is not
touched here.
RULE 14 FOLLOWED: the diff is the walked-city slice, a gate, its registration, the
stamp and a record. THE DEMO CUTTER WAS NOT RUN; the demo loads the walked city by
reference, so the fix reaches it with no re-cut. Stamp 9/15h.
NEXT: [lock them] is still HELD and this lane will take it if given a round with no
five-minute break in it. [PENDING Paolo], carried: what a long injury costs to
treat; the 82-row deed table is still unweighted; whether a forgiven thing still
stings; and the dog off zero or a coyote kind, which is content and canon.
Record: records/BOHEMIA_A_HUMAN_BEING_9_15_26.txt ***
PEOPLE (people-7h9sfy): 9/14 (b) LATEST -- *** HALF THE STREET'S POOL CANNOT
FIRE, AND LAST ROUND'S HEADLINE TO HIM WAS WRONG. c7bad95b. ***
FIRST, THE CORRECTION, BECAUSE IT REACHED HIS SCREEN. Last round this lane told
him "five minutes of walking gets you almost nowhere", off 600 taps that covered
29 cells. The taps were 25ms apart and THE GAME WALKS ON THE BEAT -- measured at
four tap rates, about 1.3 to 1.9 cells a second at 120 BPM -- so that was FIFTEEN
SECONDS of walking, not five minutes. He moved 29 cells because that is what
fifteen seconds buys. Nothing was broken about it.
WALKED AGAIN FOR FIVE REAL MINUTES OF WALL CLOCK: 921 taps, 28 minutes of GAME
time spent, 1 line said, 0 cards, 0 fights. The conclusion survived and the
numbers are different: it is not that he cannot move, it is that twenty-eight
minutes of game time produced one thing.
AND IT IS NOT THE GROUND: every neighbour of where he stands, eight directions,
six points along a walk, 48 of 48 OPEN. Through the game's own stepper he walks
26 cells in one direction without a refusal.
SO THE DIRECTOR WAS ASKED DIRECTLY and over ~34 minutes of its own clock the walk
director FIRED TWICE and the road director ZERO, against an approved gap of 90
seconds that would allow about twenty-two.
*** THE CAUSE IS NOT THE PACING, IT IS THAT HALF THE POOL CANNOT FIRE. *** The
director never invents an animal, which is RIGHT and is NOT loosened, but two of
the moments it offers wait on animals the valley does not draw and the filter
drops them SILENTLY. AND THE TWO FAIL DIFFERENTLY: feral_dog_pack waits on
`dogs`, a REAL kind at zero everywhere on purpose and frozen as canon (a dog is a
BODY and a body is character art); coyote_shadow waits on `coyotes`, WHICH IS NOT
A KIND AT ALL -- the valley draws flies, rats and ravens, so nothing can ever
answer it yes. A NAME, not a density.
MEASURED, day moments: suburb where he wakes offers 4 and can fire 2; PARK offers
2 and can fire NONE; town 2 of 3, desert 1 of 2, industrial 3 of 4; downtown,
commercial, gated, estate whole. SEVEN of twenty-five can never fire. And the road
director has NO SUBURB ROW, so where he wakes it can never offer a card.
NOTHING AUTHORED, NO FILTER LOOSENED. A coyote, or the dog off zero, is CONTENT
and canon and his; loosening the filter would fix the emptiness by making the game
lie about what is in front of him. What shipped is the missing part: the silent
drop is now VISIBLE and RATCHETED at seven so it can only shrink, with the
district he wakes in required to have something left. Controlled both ways -- a
third dead row reds it, and stripping the suburb to its two dead ones reds it
twice and takes the director claim with it at "fired 0".
AND TWO OF THIS LANE'S OWN GATES NEEDED WORK, BOTH CAUGHT HERE. MOMENT ENDS went
red on the blocked-body claim because ANOTHER LANE SHARPENED THAT RULE mid-round
(it now also requires he has WALKED AWAY before clearing, which is better):
repointed, never loosened, it asserts both halves now. Then it went red AGAIN with
no code change on its own instrument check, which tapped ONE pad button that
happened to be blocked -- ONE BLOCKED DIRECTION IS A FACT ABOUT THE STREET, NOT
ABOUT THE HARNESS. It tries all eight now; three runs back to back, 18/0 each.
NOT MINE: ROAD ON FOOT red with "0 moment(s) on foot", identical claim-for-claim
and count-for-count on clean origin/main. Same fact from the other side.
No stamp this round: the diff is checkers and records, nothing he can see changed.
NEXT: [lock them] still held. The emptiness of the five minutes is now measured
end to end and the remaining levers are content and canon, which are his.
Record: records/BOHEMIA_THE_POOL_IS_REAL_9_14_26.txt ***

PEOPLE (people-7h9sfy): 9/14 -- *** THE STREET SAID ONE THING IN FIVE
MINUTES AND NEVER STOPPED SAYING IT. Fixed and gated, 53c03d97. ***
Paolo 9/13: "it's like this glitchy, buggy AI experience where nothing's complete."
THE CARDS CAME BACK CLEAN, which is worth knowing: every arm of every encounter
card was pressed and all of them deliver. GIVE HIM SOMETHING and PAY THE CUT
refuse honestly when he is broke, with the reason on the card. DROP HIM, TAKE THE
RAMP and TAKE BOTH CREWS each hand a real roster to the fight. GET IN, LET IT GO,
WALK ON all deliver.
THE ROUND IS THE WALK. 600 taps, turning at walls like a player: 29 cells of
ground, ONE line said -- "headlights. nobody in it." -- no cards, no fights, and
that line STILL ON SCREEN at the end, over empty street. The cab it described
"waits its ninety seconds. Pulls off."
AND THIS LANE ALREADY KNEW BETTER, IN THIS FILE, IN CAPITALS: trackSay solved
exactly this for its own words ("a line that was true one cell ago and is a lie
now, which is worse than silence"). walkSay set the text and nothing could take it
back. Length is not a new number: the director's own approved MIN_GAP_S.
THREE WRITERS, THREE RULES, ONE DEBT. The first cut routed the blocked-body line
through this same timer; ANOTHER LANE FIXED THAT LINE THE SAME ROUND with a STATE
rule and theirs is right, so I took theirs and kept mine where it belongs. Tracks
SPATIAL, body STATE, moment TIME -- and every one of them takes back ITS OWN WORDS
only. Their write-up found the half I had not: one writer that does not tidy up
SILENCES every writer that does, because the tidy ones refuse to clear text they
did not write.
*** THE INSTRUMENT WAS WRONG SEVEN TIMES THIS ROUND AND ONE OF THEM WAS THE GATE.
*** Stale handles after a card redraw; arrow keys that do not walk him (the pad
does); a card-clear that did not take; calling roadChoose for the fight arms,
which is not the path the button takes; looking for the fight in the CITY frame
when it opens in the SHELL, so all three fight arms work and I had them written
down as dead; holding one direction into a wall for 600 taps and calling it a
walk. AND THE GATE: its first cut called the tick directly and STAYED GREEN when
the call THE GAME makes was deleted. It drives the game's path now and that
deletion turns it red. BEFORE BELIEVING A NEGATIVE, PROVE THE INSTRUMENT CAN
PRODUCE A POSITIVE -- another lane's rule, now this lane's.
NOT MINE, MEASURED TWICE BY HAND: ROAD ON FOOT red with "0 moment(s) on foot",
identical claim-for-claim and count-for-count on clean origin/main. THE WALKED
STREET BARELY PRODUCES ANYTHING. The director is STARVED, not broken -- it paces
on time and 600 taps spend about one minute of game clock. Whether that is the
pacing or the fact that he cannot cover ground is not this lane's to rule.
Stamp 9/14k. Demo cutter not run.
NEXT: [lock them] still held. The break-list method has now paid three rounds
running; keep measuring his sentences against this lane's own surfaces.
Record: records/BOHEMIA_THE_MOMENT_ENDS_9_13_26.txt ***

PEOPLE (people-7h9sfy): 9/13 (d) -- *** HE GOT IN THE CAB, WAS TOLD IT
DROVE OFF, AND DID NOT MOVE ONE CELL. Fixed and gated, aaca9718. ***
Paolo 9/13: "it says a car is gonna pull up on me and then nothing happens." Last
round fixed the first half of that sentence (the job offer with no way to accept).
This is the car, and it is the SAME SHAPE for the second round running: the
machinery was built, tested and right, and pointed at the wrong surface.
MEASURED ON FOOT ON THE REAL DEMO. The ghost robotaxi card fires on the walked
street and offers GET IN -- A LIFT. Press it and the card says "The door shuts. It
drives the loop it has always driven, and it is not your loop." Walked position
6205,6271 -> 6205,6271. City cursor 48,48 -> 48,48. Nothing moved.
THE CAUSE: roadChoose's ride only ever moved city.x,y -- right in CITY mode, the
WRONG POSITION on foot -- and the road card has fired on foot since
__ROAD_INTERRUPTS_ON_FOOT__, which is the entire demo. So the lift was a no-op on
the surface where it mostly happens. AND IT NARRATED THE DRIVE REGARDLESS, so
fixing only the movement would have left a cab that cannot start still telling him
it drove off. Both halves fixed; the gate proves they are independent.
NO NEW NUMBER: the table says two of the map's own tiles, and on foot a tile is FN
walked cells, FN being the game's own constant. The cost is the design's -- the
heading is the CAB'S, so it is two tiles in a direction he did not choose.
*** THE INSTRUMENT WAS WRONG THREE TIMES BEFORE ANY OF THIS WAS TRUE, and every
one returned a clean "nothing happened": handles that went stale when the card
redrew, arrow keys that do not move him at all (the walk pad does), and a
card-clear that did not take so 200 more presses hit a card that ate them. THE
RULE THAT ENDED IT IS ANOTHER LANE'S, WRITTEN THIS SAME ROUND: before believing a
negative, PROVE THE INSTRUMENT CAN PRODUCE A POSITIVE. The gate taps the pad and
requires him to move before it measures anything. And the driver is THEIRS,
tools/bohemia_drive_the_demo.js, because a second demo driver is how two answers
to one question start. ***
FOUR ROAD GATES RED, ALL FOUR IDENTICAL claim-for-claim and count-for-count on a
clean origin/main worktree: ROAD LEAVINGS 12/3, ROAD ON FOOT 10/2, ROAD INTERRUPTS
18/1, ROAD DECISION 13/1. ONE IS WORTH THE NEXT LANE'S TIME: ROAD ON FOOT fails
with "0 moment(s) on foot", and this round measured the same by hand -- 220 taps
of real walking produced ONE card. The road has its say on the walked street far
more rarely than the gate that owns it expects. Named, not touched.
Stamp 9/13zw. Demo cutter not run; the change is in the city file, which the demo
loads by reference.
NEXT: [lock them] still held. His break list is the queue now, and the method that
works is to measure each of his sentences against this lane's own surfaces rather
than wait for a row. Record: records/BOHEMIA_THE_LIFT_MOVES_HIM_9_13_26.txt ***

PEOPLE (people-7h9sfy): 9/13 (c) -- *** THE FIRST CARD OF THE GAME HAD NO
WAY TO SAY YES. Fixed and gated, b39c33cb. ***
Paolo 9/13, five minutes on a phone: "You offer requests just for me to see them,
but nothing happens... one button... I press it, nothing happens." Rule 14(d): a
card that promises and does nothing is the worst bug in the game.
THE LANE IS HELD AND THE ROUND STARTED BY MEASURING WHETHER ANY BREAK WAS OURS.
None was routed here -- streets to the city lane, freeway to LIFE+CITY, buttons to
UI, dead cards to RUN, first fight to COMBAT. But rule 12: a coordinator's line is
a PREMISE and the lane measures first. His dead-card sentence is about OFFERS, and
the offer card is this lane's, so the round went looking instead of assuming.
WHAT IT FOUND, ON THE REAL DEMO, AND IT IS HIS WORDS EXACTLY. The first card:
THE METER READER, nobody has picked it up yet, how long the walk is, what it pays,
and THREE WAYS TO ARGUE THE TERMS. Every act on it was close, hg:swap:resources,
hg:swap:clout, hg:upfront, go. *** THERE WAS NO WAY TO SAY YES. *** Accepting went
through exactly one door, a postMessage from the phone, so a player who never
found the phone could haggle over a job he could not have. He argued, the terms
really moved, the card really answered, and the job never started.
AND EVERY OTHER BUTTON ON THAT CARD ALREADY WORKED, which is why it went unseen
for so long: a card where every visible control works is exactly the card nobody
checks for a missing one.
THE FIRST READING WAS WRONG AND THE INSTRUMENT WAS THE REASON, for the second
round running. A sweep that pressed everything in one pass called three buttons
dead; they were not -- the card REDRAWS after a press, so every handle after the
first pointed at an element that no longer existed. CHECK THE INSTRUMENT BEFORE
CONCLUDING THE FEATURE IS BROKEN. The honest version re-queries after every press.
NOTHING WAS BUILT TO FIX IT: offerAccept() has always worked, it had no door on
the card the offer was already on. One row, calling the SAME function the phone
uses. No yes on a job already taken, and none on an offer argued until they took
it back -- that is __ASK_FOR_MORE__'s whole cost and a live button would have
refunded it silently.
AND IT UPDATES IN PLACE, WHICH THE FIRST CUT GOT WRONG: redrawing the card the way
an ask does made the quest go live while the card came back still offering the
job, because showWake runs offerRing, whose first line is OFFER=null;
OFFER_TAKEN=false. The road card had already solved that shape.
*** AND THE THING THE WHOLE FLEET NEEDS: IT REACHES HIM WITHOUT RE-CUTTING THE
DEMO. *** The demo LOADS the walked city in a frame, so a city fix is live in the
demo with no cutter run -- measured on the demo itself, not only the workshop. A
held lane can fix a five-minute break in the city and have him meet it without
touching RUN's cutter. Also confirmed: last round's rule 14 warning is now true
for everybody -- DEMO CURRENT is red on clean origin/main, 6,206 bytes behind.
Stamp 9/13zp. Pre-push pass green on the gates that read this diff; DEMO CURRENT
red and identical on clean main.
NEXT: [lock them] is still held; it is not a five-minute break. The honest next
move is to keep measuring his break list against this lane's surfaces rather than
waiting for a row. Record:
records/BOHEMIA_THE_YES_GOES_WHERE_THE_OFFER_IS_9_13_26.txt ***

PEOPLE (people-7h9sfy): 9/13 (b) -- *** [cats stay] SHIPPED dcddcf95, AND
THERE IS NO CAT IN THIS GAME. *** Paolo 9/13, walking the demo's five minutes:
"I do see cats running around, that's cool." NOTES ARE RULINGS, so the row was to
record which cats he saw and freeze them as canon. This lane now has a five-minute
row, so rule 14b's hold is lifted for it; [lock them] stays held behind it.
WHAT THE ROUND ACTUALLY FOUND. Measured in five places -- the engine, the alpha,
the demo, the run slice, the banks -- and there is no cat anywhere. EVERY "cat" IN
THIS REPO IS THE WORD CATEGORY: cat(d) is a district category, byCat is a wardrobe
bucket, "misc street cat" in a 7/10 bank is a category label.
AND A GREP THAT FINDS NOTHING IS NOT PROOF THAT NOTHING IS THERE, so I drove the
demo at phone size, clicked through the splash the way a player does, walked the
street, and asked every frame of the RUNNING page what it had. The answer was in a
system I had not guessed the name of, which is the whole lesson: the file search
was five confident misses and the running page answered in one.
WHAT HE SAW ARE THE VALLEY'S ANIMALS (8/26, off his own "dogs and swarms of flies"
and the 8/25 "the city is dead and DEAD IS NOT THE DEFAULT"): fly swarms drawn as
specks over a walkable cell, a RAT drawn as a dash running the foot of a wall ON
THE BEAT, and a raven as a silhouette on a roofline. Ten screens walked: up to 20
animals on one, 18 fly swarms, 1 to 2 rats, 0 ravens.
*** THE ONLY ONE THAT RUNS IS THE RAT. *** A swarm hovers and a raven sits. One or
two dark dashes scurrying along a wall, on a phone, is exactly what reads as a cat.
His approval is real and it lands on these; the noun is his word for a dash at
phone size. SO NOBODY ADDS A CAT -- that would be inventing content off a misheard
noun AND changing the very thing the row exists to freeze. The gate refuses a
fourth kind by the exact name it would arrive under.
THE FREEZE IS A GATE because a thing frozen without one is not frozen, it is merely
unvisited: three kinds and no fourth, every density number in all eight districts,
no district added underneath, THE DOG AT ZERO (he named it first on 8/26 and that
lane still left it out in writing -- a dog is a BODY and a body is character art),
the per-frame cap, the determinism that makes a freeze mean anything at all, and
the animals still DRAWING on the real demo. Negative-controlled twice: a dog in
downtown goes red naming the district; a fourth kind called "cats" goes red
printing all four.
MEASURED AND DELIBERATELY NOT FIXED, so the next ruling has numbers instead of a
rediscovery: the raven is in the table and drew ZERO on his walk although it places
best of the three valley-wide (245 of 305 rolls), and the rat places on 1.9% of its
rolls valley-wide (10 of 521). He approved what he SAW, and a lane that improves
the thing it was told to freeze has broken it.
RULE 14 FOLLOWED: the diff is a gate and two records, touching no engine module and
no slice, so nothing to resync and nothing to rebuild. THE DEMO CUTTER WAS NOT RUN.
The stamp is not bumped either -- it exists so he can SEE which build he is on, and
a new letter over a build with nothing new in it is the one way that stamp can lie.
NEXT: [lock them] is still HELD; it is not a five-minute break. If this lane is
given another break it takes that; otherwise the honest thing is to say so.
Record: records/BOHEMIA_CATS_STAY_9_13_26.txt ***

PEOPLE (people-7h9sfy): 9/13 -- *** RULE 14 HOLDS THIS LANE, AND THE ROUND
WENT ON THE LANE'S OWN RED INSTEAD. *** Paolo 9/13 LOCKED: the demo's first five
minutes on a phone is the only measure, only RUN re-cuts the demo, and a building
lane with no five-minute break holds its claim and adds nothing to the demo. None
of the breaks he named is this lane's; they went to RUN, COMBAT, UI and WORLD. So
[lock them] is CLAIMED AND HELD on the board, on purpose, and this round did the
one thing a held lane should still do.
WHAT GOT CLEARED: the promise the last round wrote down. The organ sweep's single
orphan was BohemiaDeeds.sayWhy, called from nowhere. It was not merely unused, it
was WRONG, and the standing card had grown a second copy of it.
  ONE QUESTION, TWO ANSWERS. sayWhy is becauseOf plus the quest's own sentence.
  The card walked becauseOf and looked the sentence up itself, so the published
  engine door was reached by nothing. That is HOW the orphan happened: not nobody
  needing it, but the surface that needed it growing its own.
  DEFECT 1, AND IT HAS NEVER FIRED, WHICH IS THE HONEST WAY TO SAY IT.
  `LABELS[kind] || kind` hands the player a machine id, the exact thing the
  function's header forbids. Measured: all 83 weighted deeds in his corpus have a
  sentence, because loadCorpus fills weight and label in ONE loop off one row. So
  it was a hole the corpus was covering, not a live bug. IT IS REACHABLE FROM THE
  OTHER SIDE AND THE REPO NAMES IT: bohemia_lend declares a weight placeholder for
  'loan:short', a kind that never passes through the quest corpus, so the day that
  number is filled the old body says "loan:short" out loud. null is the honest
  empty now.
  DEFECT 2. It dropped `kind`, so a caller with its own wording had to walk
  becauseOf a second time to get it back -- precisely how the card's copy grew.
  kind and turn ride along now, one walk serves both.
  The watched/heard split stayed on the surface on purpose: whether an eyewitness
  and a retelling get different sentences is a WORDS decision and the words are his.
PROVEN ON THE REAL CARD: faction_between's Q10 drives the actual standing card and
reads the rendered rows; it was already green through the new path and Q11 still
reads eyewitness not hearsay, so `heard` survives. Its title said "becauseOf IS
CALLED TOO" and now names the path it proves -- repointed, never loosened, the
assertion untouched. The negative control is faithful rather than synthetic: it
weighs a kind the corpus never wrote, exactly the way lend does, and puts the
table back. Organ sweep reads BohemiaDeeds with nothing dead.
*** AND THE NEXT LANE NEEDS THIS BEFORE IT COSTS THEM A ROUND: RULE 14 AND THE
DEMO BUILD GATE COLLIDE. *** That gate asserts "regenerating the demo changes
nothing". Under rule 14 the demo is deliberately a cut BEHIND the workshop between
RUN's walks, so the first non-RUN lane to ship an alpha change turns it red for
everybody -- and the obvious way to make it green is to run the cutter, which is
what he just forbade. It is a trap with a green light on it. Reproduced: any alpha
change, no cut, run it, one claim fails and the rest pass. A GATE MUST NEVER
OUTRANK A RULING, so this shipped red on it and did NOT re-cut. Not fixed here,
another lane owns it, but named with its reproduction. The honest repoint is that
the demo must never be HAND-EDITED, which is what the claim was written to catch;
a cut behind the workshop is now the design.
Stamp 9/13w. Pre-push pass green on the gates that read this diff; CITY DEEDS
(B11) and FACTION BETWEEN (R2/R8) red and identical claim-for-claim on a clean
main worktree. THE SUITE LINE is still not posted, so the full suite is unmeasured
since 635260a8.
NEXT: [lock them] stays held until this lane is given a five-minute break or he
says the five minutes hold. Record: records/BOHEMIA_A_STANDING_YOU_CAN_READ_9_13_26.txt ***

PEOPLE (people-7h9sfy): 9/12 (b) -- *** [down not dead] SHIPPED. THE LAW
WAS TRUE BY ACCIDENT AND NOW IT IS TRUE ON PURPOSE. *** Paolo 9/11 LOCKED: nobody
you keep permanently dies and nothing on them is a permanent debuff, but debuffs
can be a lot longer than others. Measured first, in the two files that ARE the
game: no company roster, no companion state, no downed state, no injury model,
nothing anywhere that could kill a person you keep. Nobody died because there was
NOBODY TO LOSE -- and the first system that could hurt a companion would have
broken the law silently with no check saying a word.
EVERY NUMBER IS HIS OWN EXAMPLE: a leg takes a season (90 days), a hand takes a
year (365), plus a week at the bottom so "a lot longer than others" has something
to mean -- and it does, the longest is 52x the shortest. All days on the clock the
city already spends.
THE CLAIM IS PROVED BY ATTEMPTING THE FORBIDDEN THING, not by reading a comment
that says it cannot happen: a fourth argument that might be a length, an options
object asking for permanence, an invented kind -- all refused; fall() arity 3 so
there is no slot to smuggle one through; Infinity nowhere in the code. 5000 falls
across every kind and day, 0 that did not heal, 0 that ran forever.
ctFall(id) IS ONE LINE FOR COMBAT and deliberately the only door; their [downed
body] row owns the body on the floor. Who can fall today is the family tree,
because it is the only roster of kept people the game has; the companion joins
the same seam with nothing here changing.
Tab: CITY. On the real demo the card says YOUR FIRSTBORN IS DOWN / A HAND THAT
NEEDS A YEAR, 365 DAYS and "Down, not gone. Nobody you keep is lost for good.",
the morning says it too, and on day 366 they are BACK ON THEIR FEET.
TWO THINGS I GOT WRONG, BOTH CAUGHT BY DRIVING IT: (1) the first healing check
lied and the bug was in MY PROBE -- I set T.day and called daySync(), which copies
the day DOWN from the day loop and undid the jump. THE CLOCK LIVES ON DAY, NOT ON
T; check the instrument before concluding the feature is broken. (2) Three
exports nothing called, in a brand new module, for the SECOND time in this lane:
healed() is exactly !isDown, downNow() re-walked a list the city already filters,
hurtOf() answered a question no surface asked. They come back is not a function,
it is the arithmetic. Cut, and bohemia_down registered in the organ sweep so it
cannot happen quietly again: BohemiaDown 4 fns, dead 0.
[PENDING Paolo] what a long injury costs to treat (his law says "costing you";
the length is already a number a price can key on, but the price is his).
THE SHIP PASS, AND EVERY RED CLASSIFIED AGAINST A CLEAN MAIN WORKTREE. Stamp
9/13r. The full suite ran twice: once on the pre-rebase tree and once on the
merged tree after main moved 95 commits under me. DOWN NOT DEAD is 28 pass / 0
fail inside the pack both times, and MAKE IT RIGHT 40/0, PAID MEANS PAID 25/0,
FAMILY EVENTS and LANGUAGE green beside it. The merged tree carried SEVEN reds
the earlier tree did not -- ANSWERED FOR, DRIVE NETWORK, ICON, INLINED FRESH,
PARTIES MOVE, ROUND + DOORS, TOOL IDEMPOTENT -- and all seven reproduce with the
IDENTICAL CLAIM on a clean origin/main worktree, so none is mine: five of them
are one root cause (a district type called "sign" shipped with no map icon, 59%
drive reach and a 45% monoblock), and the other two are the landmarks module
being stale against its inlined copy, which makes the resync tool rewrite an
already-patched tree. RUN BEAT and SFX WIRED were load, green alone. Main moved
another 50 commits during that run, so the last rebase was verified by the gates
a city/alpha/demo change can actually move: my five lane gates, plus the demo
cut, the inline freshness, the gate registry and the pages publish list. Two red
there, ORGAN REACH and DEMO CURRENT, both identical on clean main 7cf3945b.
*** AND ORGAN REACH'S ONE ORPHAN IS THIS LANE'S DEBT, NOT SOMEBODY ELSE'S:
BohemiaDeeds.sayWhy is called from nowhere. It predates this round and it is the
same disease that bit me twice already, so it is the first thing to fix next
round, ahead of the board. Wire it to the standing card or delete it. ***
NEXT ROW IS [lock them], his section 3: one tap, from the first hour, no endgame
gate. This round was section 2, the promise that holds for everybody. ***

PEOPLE (people-7h9sfy): 9/12 -- *** [spanglish red] SHIPPED, AND THE ROW
WAS STALE: THE REAL DEFECT WAS THE CHECK ITSELF. *** Measured before touching
anything: the language gate is 81/0 GREEN on this tree AND on clean origin/main;
all 22 quirk shapes have both spanglish lines; all 44 carry Spanish; 8000
spanglish lines across 4000 people have ZERO without Spanish. The claim was never
loosened either -- it still demands a real Spanish word out of esWordsIn. Another
lane's quirk sweep (59e61b12, 23 spanglish lines added) fixed it at the source,
and the flagged line is a SPECIFIC slotted INTO a line, not an answer on its own.
SO WHY DID IT READ RED FOR ECONOMY TWICE AND GREEN HERE? The browser pass walks
the city from (8,8) and asks the FIRST spanglish speaker it reaches, and which
person that is depends on what else is in the tree. ONE SAMPLE OFF A SPATIAL WALK
IS A COIN FLIP WEARING A CLAIM'S CLOTHES. It cost two lanes two rounds each and
produced a board row aimed at the wrong target.
THE GATE NOW ALSO SWEEPS THE ORGAN: 4000 people, both light states, every
spanglish line must carry Spanish. Fast, no browser, cannot flap. Repointed not
loosened and strictly stronger -- a green used to mean "the one I bumped into was
fine" and now means "no spanglish speaker in the valley can answer without
Spanish". Negative-controlled: strip the Spanish from one line and it goes RED
naming that line, green again when restored. 81 -> 83 passed, 0 failed.
NOTHING IN THE GAME CHANGED. No content touched, no stamp bump, no demo re-cut,
because nothing he plays moved. Tab: NOT IN A TAB YET -- this is a checker.
FOR WHOEVER WRITES THE NEXT CHECK: a check that samples one thing off a walk is
not a check, it is a weather report. Anywhere a claim picks "the first X it
finds" on a surface whose contents vary, sweep the organ underneath as well --
the browser pass proves the wire is live, the sweep proves the rule holds. ***

PEOPLE (people-7h9sfy): 9/11 -- *** [paid means paid] SHIPPED, AND IT WAS
THIS LANE'S OWN DEFECT. *** ECONOMY read [make it right] the round after I
shipped it and found the hole: RIGHT_WORDS carries 'paid': 'PAID THEM BACK', the
one live caller passed exactly that word, and makeRight had arity 3 with no
purse, no currency and no amount. THE CARD SAID PAID THEM BACK AND NOTHING WAS
EVER PAID. That is the worst kind of bug here, because every gate was green: the
mechanism did what it said it did, it just said the wrong thing about itself, and
nothing checks that two parts agree.
THE PRICE IS NOT A NEW NUMBER, which is the part worth keeping. priceOf is the
GRUDGE ITSELF -- the same negative sum wouldSquare already adds up, which is the
same sum forceOf weighs, which is his STANDING dial. A heavier wrong costs more
because it IS more, rounded up because EVERYTHING COSTS ONE. AND WHILE HIS DEED
TABLE IS EMPTY IT COSTS NOTHING, which is the truth and not a hidden default; the
gate holds that case on purpose so a later round cannot slip a number in
underneath it.
AND THE WORD IS REFUSED WHEN NOTHING WAS PAID. Ask makeRight for 'paid' with
nothing handed over and the record says 'forgiven' -- THEY LET IT GO -- because
that is what happened. The wrong is still SETTLED either way: it refuses the
WORD, never the forgiveness, which is the ruling's own second half. A caller
cannot lie to the ledger even by accident, which is the only real fix for a bug
whose cause was a caller lying to the ledger by accident.
Proven on the real demo both ways, off his own dial: broke, the card says "You do
not have it", the apology stands, purse untouched, record says THEY LET IT GO.
Flush, six batteries really leave, record says PAID THEM BACK, and the ledger row
is a TRANSFER not a drain because restitution goes TO the person wronged.
Tab: CITY. gates/paid_means_paid_gate.js 25/0, registered 573 -> 574.
[PENDING Paolo] the 82-row deed table now decides MONEY as well as standing, so
leaving it unruled got more expensive. ECONOMY also measured our clout ladder at
8-to-110 (14x) against real tariffs of 800x; weight for weight is wired to
whatever shape he gives it, so steepening the top is a dial turn now. ***

PEOPLE (people-7h9sfy): 9/7 (b) -- *** [neglect costs] SHIPPED. THE STAKES
TABLE HAS ITS FIRST ENTRY EVER, and it is an obligation rather than a meter.
Measured first and it was worse than the row said: the socket has been applied at
every reckoning since the day loop shipped and held NOTHING; upkeep() debits
exactly 1 with no headcount, so a household of nine costs what one costs; and
desert/leaves/quit/abandon are ZERO across commitment, favour, standing and
claim, so nobody in this valley had ever stopped waiting for the player. And
neglectFor() already returned a per-stage cost with every value tagged
"neglectPlaceholder": true -- a cost nobody ruled, consumed by nothing.
IT SHIPS WITHOUT PAOLO RULING ONE NUMBER, which is the row's own unlock and the
thing that has frozen every stakes conversation since NO DAMAGE BEFORE THE DIAL.
A hunger meter needs a RATE. "Three people are waiting on you" needs only the
truth, and the truth is already in the save. So it COUNTS who is waiting, READS
the deed ledger's own turns for whether you showed up, and asks the standing web
whether somebody has had enough of you. No threshold, and the placeholders are
never read (the gate parses the module to prove it).
THE PUNISHMENT IS A PERSON. Somebody you wronged AND then ignored stops waiting;
showing up for them that day is what stops it; somebody who thinks well of you
gets a quiet day for free. Tab: CITY -- marry, have children, swear to an outfit,
sleep, and the morning tells you how many are waiting and how many you showed up
for.
THE ENTRY WAS NEVER IN THE SOCKET ON THE FIRST CUT and everything looked fine: I
pushed it beside `const DAY = ...`, nine thousand lines before the module exists,
and the guard meant to make that safe swallowed it in silence -- no throw, no
log, an empty table, a reckoning that would have reported nothing forever. A
GUARD AROUND AN ORDERING BUG HIDES THE ORDERING BUG. That is twice in two rounds
for this shape (the Marry button was bound to the wrong card): a thing that is
present, reads correctly, throws nothing and does nothing.
*** [PENDING Paolo] AND THE NEXT THING THIS LANE SHOULD TAKE: YOUR FAMILY IS ON
THE LIST AND THE GAME GIVES YOU NO WAY TO BE THERE FOR THEM. *** Kin are not
bodies on the street, so they witness nothing (ctDeed collects minds from what is
DRAWN) and hear nothing (the gossip pass needs two drawn people together). They
are counted as waiting and can never leave. Punishing a player for failing at
something the game offers no way to do would be a lie, so it is named rather than
hidden. The fix: kin need minds and a way to be shown up for. ***

PEOPLE (people-7h9sfy): 9/7 -- *** [family events] SHIPPED. THE FAMILY
CAN CHANGE NOW. It arrived 9/4 and then never moved again: family.tree 0,
selectHeir 0, runDynasty 0 in both files that make up the game -- four people
frozen at the cold open, in a game whose spine is three generations. There is a
MARRIAGE (canon calls it a permanent act one decision; WHO is still his and the
module THROWS rather than invent a partner), THREE TO FOUR CHILDREN (his own
GDD's count), an AGEING at the canon ~30-year handoff, and THE HEIR RULE FINALLY
CALLED on the card he already opens. Tab: CITY, open WHERE YOU STAND.
selectHeir HAD NO SOURCE MODULE -- it lives only inside engine/bohemia_engine.js,
which its own header calls a handoff BUNDLE, and no browser slice can import one.
That is the mechanical reason it had zero callers. So the played copy is
unavoidable, and it is PROVED identical to the bundle over 600 randomised
families (0 disagreements, and the sweep hits all three answers) rather than
hoped to be.
TWO THINGS I GOT WRONG, BOTH CAUGHT BY DRIVING IT: a flat-rung ageing model made
MARCO, a teen, an ELDER after one thirty-year fold (a ladder position is not a
number of years; it uses real age bands now), and the Marry button was bound in
ctDraw with the PERSON card's buttons while the row renders on the STANDING card
-- nothing threw, nothing logged, the button just did nothing. Only pressing it
on the real surface found that.
[PENDING Paolo] how many game days is a year (nothing rules it; ageing at a fold
is canon, but a child growing up mid-act and the spacing between births both
need it), who you marry, whether anybody dies of old age (RAY reaches 101 alive
across two folds), and the children have no names on purpose.
UNBLOCKS [heir moment], which the coordinator already ruled and which needed a
tree to select an heir from.

TWO THINGS THE NEXT PEOPLE ROUND SHOULD KNOW.
(1) ECONOMY BUILT ON [make it right] THE SAME ROUND AND FOUND A REAL GAP IN IT:
    RIGHT_WORDS carries 'paid': 'PAID THEM BACK', the live button passes exactly
    that word, and makeRight has no purse, no currency and no amount. THE CARD
    SAYS PAID THEM BACK AND NOTHING IS EVER PAID. Their read is that the payment
    should be what makes the apology BELIEVABLE, not what buys the forgiveness --
    you cannot pay instead of showing up -- and that our clout ladder (8 to 110,
    14x) is far too flat against the real tariffs (9 to 7,200, 800x). That is a
    magnitude and a design fork, so it is his, but the WORD is ours and it is
    currently writing a cheque the mechanism does not cash.
(2) WRITE THE BOARD SHA AFTER THE PUSH, NEVER BEFORE. It chased the rebase three
    times this round -- b6b99a58, then dc3ca2ac, neither of which exists on main.
    The fleet pushes every few minutes, so a lane that writes the sha first
    always loses that race. Push, read the sha off main, then write the board. ***

PEOPLE (people-7h9sfy): 9/6 (c) -- *** [make it right] SHIPPED. NOTHING IN
THIS GAME COULD BE FORGIVEN AND NOW IT CAN. Wrong somebody, do two good turns
in front of them, and they will square it. TAB: CITY.
AND THE SHIP PASS FOUND SOMETHING WORSE THAN THE ROW: SIX GATES THIS LANE WROTE
WERE NEVER REGISTERED IN THE RUNNER. Asking the suite for this round's gate
returned "0 of 542 GATES" -- not a red, a NOTHING. who_vouches, against,
trade_fit, used_to_be, demo_talks and make_it_right all pass, all were only ever
run BY HAND on the turn they were written, and FOUR ROWS WERE ALREADY MARKED
SHIPPED BEHIND THEM. That is A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED in its
purest form. All six registered (542 -> 548) and all six re-run THROUGH THE
RUNNER, not by hand: 0s, 62s, 29s, 59s, 28s, 18s, every one green. Everything
that parses the runner table re-run too (BODY VARIATION 41/0, SUITE FINISHES
7/0, SUITE HONESTY green).
THE WHOLE SUITE WAS CLASSIFIED ONE GATE AT A TIME: 70 confirmed reds across four
shards, every one replayed on a clean origin/main worktree, all 70 identical
there. Two flipped once and needed three runs each to settle (CITY CAST B6,
DOMINANCE SWEEP D4a); both came back red 3 of 3 on clean main with the same
message, so the single green was the flake, not the red.
ONE RED IS A BROKEN RULER, NOT A BUG IN THE WORK: BATTLE BROS H5 says "LAB's
diff touches NO engine module and NO slice" and it unions git diff
origin/main...HEAD with staged, working and untracked files. Nothing was staged,
nothing was in the working tree -- what it found was this branch's unmerged
commits. It fires for EVERY build lane with engine work in flight, wearing the
name of a lane Paolo RETIRED on 9/4, so with no LAB the only thing it can
measure is somebody else's round. NOT FIXED HERE on purpose: repointing another
lane's gate is not this lane's to do, and the honest repair is REPOINTED NOT
LOOSENED, keyed to the LAB study's own authored history.
THIS BLOCK CARRIES HIS PERMANENT INSTRUCTION VERBATIM, BECAUSE HE ASKED FOR IT
TO LIVE HERE SO IT SURVIVES A MEMORY RESET, AND BECAUSE A REBASE ONTO MAIN
DROPPED THE LAST COPY OF THIS LANE'S BLOCK ENTIRELY. ***

PAOLO'S PERMANENT INSTRUCTION, WORD FOR WORD (9/5). HE SAID: write it into your
own handoff block first so it survives any memory reset. DO NOT EDIT, SUMMARISE
OR "IMPROVE" THIS TEXT. It is his, verbatim.
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
END OF HIS INSTRUCTION. Everything below this line is this lane's own notes.

THIS LANE IS 09 PEOPLE, MODE: BUILD, session slug people-7h9sfy.
THE JOB JUST SHIPPED: [make it right] NOTHING-IN-THIS-GAME-CAN-BE-FORGIVEN.

THE ROW, from DYNASTY's Angel round: the web wrote deeds, carried them, faded
them, and NEVER SETTLED ONE, so standing was a one-way ratchet toward being
hated -- and generation three is the Angel, who could not forgive anything.

VERIFIED FIRST: all eight words (forgive, forgiven, settle, settled, absolve,
pardon, spare, redeem) are ZERO in the standing web and the deeds module. The
wider engine's 3 forgive and 86 settle hits are "settlement" the town, a lab
note and a wash seam check -- read, none of them this. AND A NAME COLLISION
WORTH KNOWING: BohemiaFavour.settle already means clearing a favour DEBT with an
outfit, so the new function is makeRight, after the row's own label.

THE RULE IS THE ROW'S OWN: THE PERSON WHO WAS WRONGED DECIDES. makeRight takes
ONE MIND. No valley-wide absolution, and you cannot clear your own name --
witness() refuses to record a deed about yourself, so there is no mind to call
it on. Somebody else who watched the same thing is NOT settled by your
forgiver's choice. That asymmetry is what stops this being an eraser.

FORGIVEN IS NOT FORGOTTEN, and that is the definition, not sentiment: the deed
STAYS in the mind with a `right` mark, forceOf returns 0 for it, and madeRightBy
can always say what happened and how.

*** AND "WOULD THEY?" IS DERIVED, NOT A DIAL, WHICH IS THE BEST PART. *** A
button that always works is an eraser; "how forgiving is this person" would be a
tuned number and numbers are his. So it is asked of what THEY saw: they square
the old thing only if everything else they know about you already comes out
positive. It is this web's own arithmetic with the grudge taken out of the sum.
IT MAKES THE RIGHT LOOP: "make it right" stops being a button and becomes the
instruction -- go do something for the person you wronged, in front of them,
then ask. Grounded too: amends raise forgiveness, severity lowers it, and both
fall out of that sum with no threshold anybody picked.

THE WEB LEARNS IT on the paths the grudge travelled: a SECOND-HAND grudge dies
when the person it belongs to squares it, and it stops dead at anybody who saw
it with their own eyes.

SHIPPED THIS ROUND
  engine/bohemia_standing.js                RIGHT_WORDS, makeRight, madeRightBy,
                                            wouldSquare, carryRight
  tools/bohemia_city_make_it_right_patch.py the card row, offer and handler
  gates/make_it_right_gate.js               40 claims, 0 red
  gates/bohemia_gates.py                    the six unregistered gates, 542 -> 548
  records/BOHEMIA_MAKING_IT_RIGHT_9_6_26.txt

FOR THE COORDINATOR, NOT A JOB I TOOK: FIVE GATE FILES BELONGING TO OTHER LANES
ARE STILL UNREGISTERED and the suite has never run them --
asks_visible_gate.js, dead_valley_gate.js, legend_kept_gate.js, pack_gate.js,
walk_encounter_gate.js. I did not register them, because switching on a gate
that has never run can go red on somebody else's work and stop the whole fleet
shipping, and that is his call, not mine. The other 15 unregistered files in
gates/ are helpers and probes, not gates: they carry the bohemia_ prefix instead
of the _gate suffix, and THAT SPLIT IS WHAT A MACHINE CHECK FOR THIS WOULD KEY
ON -- every gates/*_gate.js appears in the runner table, no exceptions. Nothing
today catches this, which is how six of mine sat unrun.

PROVEN ON THE REAL DEMO, THROUGH THE BUTTON A PLAYER PRESSES:
  wrong them        -6.00, card says THEY HOLD SOMETHING AGAINST YOU and
                    NOTHING YOU HAVE DONE OUTWEIGHS IT YET, and NO button
  one good turn     -6.00 -> -2.00, still no button
  two               2.00, card says AND THEY WOULD LET IT GO, button appears
  press it          2.00 -> 8.00, card says YOU SQUARED IT / PAID THEM BACK,
                    button gone, and the good standing you earned survives

LANE GREEN: MAKE IT RIGHT 40/0, WHO VOUCHES 19/0, PEOPLE 158/0, AGAINST 66/0,
DEED BRIDGE 27/0, USED TO BE 36/0, TRADE FIT 42/0, CITY PEOPLE 18/0.
city_deeds 42/1 is identical on clean origin/main.

NEXT OPEN LINE FOR THIS LANE: [family events] FAMILY-EVENTS -- something writes
a child, a marriage, an ageing into family.tree; selectHeir has zero callers.

[PENDING Paolo] -- CARRIED, NOT DECIDED HERE
  1. DOES A FORGIVEN THING STILL STING A LITTLE? A squared deed goes clean to
     zero force and keeps its record. Whether it should leave a residue is a
     MAGNITUDE and magnitudes are his. This one changes how the whole theme
     feels and it is the first thing to ask him about this feature.
  2. Whether the four words should differ MECHANICALLY -- is being spared worth
     more than being paid? One mechanism today, the word recorded so they can be
     pulled apart without touching a surface.
  3. The four sentences are draft:true.
  4. STILL CARRIED: the four STREET deeds are unweighted until the 82-row table
     is ruled, so a grudge only exists today where a quest deed fires or where
     he turns the STANDING dial. Same [PENDING] as [weights shape], which the
     coordinator has since RULED on the board.

FEEDS: DYNASTY's Angel round (which found this hole) and WORDS Q17 [angel verbs],
open on the board, about what the Angel can do now that something can be forgiven.

TAB: CITY. Walk up to anybody and the card says what they used to be.

------------------------------------------------------------------------

PEOPLE (people-7h9sfy): 9/5 LATEST -- *** [demo talks] IN HAND. THE PERMANENT VAMILY
INSTRUCTION IS WRITTEN VERBATIM BELOW SO IT SURVIVES ANY MEMORY RESET. ***

PAOLO'S PERMANENT INSTRUCTION, WORD FOR WORD (9/5). HE SAID: write it into your
own handoff block first so it survives any memory reset. DO NOT EDIT, SUMMARISE
OR "IMPROVE" THIS TEXT. It is his, verbatim.
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
END OF HIS INSTRUCTION. Everything below this line is this lane's own notes.

THIS LANE IS 09 PEOPLE, MODE: BUILD, session slug people-7h9sfy.
THE JOB JUST SHIPPED: [demo talks] TALK-REACHES-THE-DEMO (baab7c5).

ROUND 2, AND [demo talks] IS SHIPPED (baab7c5). Gate: gates/demo_talks_gate.js,
14 claims, 3 mutations caught.

THE ROW SAID THE TALK WAS MUTE. IT IS NOT, AND HERE IS THE NUMBER:
  the corpus                       236 @TALK, 504 @SAY, 27 quests   (board exact)
  the demo opens                   FIVE days, five quests
  reachable in those five          43 nodes, 88 spoken lines = 18%
  the other 193                    22 quests this demo never opens. That is the
                                   demo being five days long, NOT a defect, and
                                   the gate pins it so nobody re-files it as one.
  orphan speakers                  ZERO: every speaker has a castable role
  all five days                    open, cast somebody, and somebody TALKS
  later speakers                   day-1 fixer is SILENT at stage 10 and TALKS at
                                   stage 20 -- entry conditions, not a hole

THE WHOLE CHAIN, ON THE REAL DEMO: the phone rings, answering it starts the
quest, the day casts its roles onto real blocks, standing on one makes ctCast()
return them, and ctConvNode() hands back a node.

*** FIVE TIMES IN THIS JOB I GUESSED INSTEAD OF READING, AND EVERY GUESS
PRODUCED A CONFIDENT WRONG FINDING. *** probed `BohemiaBQ` when the file
publishes `BQ`; called offerAccept() without offerRing(), which returns false on
!OFFER; teleported with hx = block*FN when A BLOCK IS NB*FN = 512 FINE CELLS;
walked one direction into a wall and called the feature dead; and asserted
offerRing() returns true when it returns nothing at all. Every number in the gate
is read off the running game now. THE LESSON FOR THE NEXT ROUND IS THE WHOLE JOB:
A NAME, A CONSTANT OR A RETURN VALUE YOU GUESSED IS NOT A MEASUREMENT.

AND ONE OF MY OWN GATES WENT RED FROM SOMEBODY ELSE'S GOOD WORK: who_vouches
demanded ctSeenByHtml() and ctWhoVouchesHtml() be LITERALLY ADJACENT, and another
lane slid ctLegendHtml() between them. Nothing moved the panel or gave it a door
of its own, so the claim was red over a thing it was never about. REPOINTED, NOT
LOOSENED: both call sites must build both, in that order. It still fails if the
panel is dropped or moved before the seen-by list; both mutations caught.

LANE GREEN ON THE SHIPPED TREE: DEMO TALKS 14/0, PEOPLE 158/0, WHO VOUCHES 19/0,
PACK 47/0, WALK ENCOUNTER 15/0, ALIVE 16/0, CITY MEMORY 34/0.

NEXT OPEN LINE FOR THIS LANE: [outfits nearby] OUTFITS-AT-SPAWN -- zero of 34
people within six cells wear one.

ROUND 1 OF [demo talks], MEASURED ON THE REAL SURFACE. THE PIPE IS NOT BROKEN.

The board says "236 @TALK nodes and 504 @SAY lines are parsed and mute in the
demo file". The COUNTS are exact (236 @TALK across 27 .bq files, 504 @SAY, all
27 loaded in the page as DEMO_BQ). "MUTE" IS NOT, and here is the whole chain
walked on the real demo:

  offerRing()                 -> OFFER exists (the phone rings)
  offerAccept()               -> true
  DQ.Q / DQ.rt                -> LIVE: S01_THE_METER_READER, stage 10, 6 stages
  ctDayCast()                 -> 2 cast: lineman@block 6,20 and fixer@block 5,13
  stand on block [6,20]       -> ctCast() returns the lineman
  ctConvNode({key:lineman})   -> HAS A NODE

So a quest line DOES reach a player who rings, accepts, and walks to the cast.
Nothing here is dead.

THREE OF MY OWN BROKEN RULERS ON THE WAY, ALL THE SAME MISTAKE -- I GUESSED A
NAME OR A CONSTANT INSTEAD OF READING IT:
  1. probed for `BohemiaBQ`/`BohemiaQuestRuntime`; the file publishes `BQ` and
     `BQRuntime`, so I reported the corpus missing when it was loaded.
  2. called offerAccept() without offerRing() first; it returns false on
     `if(!OFFER||OFFER_TAKEN)`, so I reported the quest never starts.
  3. teleported with hx = block*FN and landed on block [1,5] while asking for
     [6,20]. A BLOCK IS NB*FN = 512 FINE CELLS, not FN.
Each one produced a confident wrong finding. A NAME OR A NUMBER YOU GUESSED IS
NOT A MEASUREMENT.

WHAT IS ACTUALLY LEFT TO MEASURE (round 2): the demo plays ONE quest per day and
day 1 is S01 with 6 stages, so most of the 236 belong to quests the demo never
opens. The number that matters is HOW MANY of the 236 a player can reach across
the days the demo actually ships, and which roles are never cast. Only that says
what "mute" means here and whether anything needs building.


PEOPLE (people-7h9sfy): 9/5 (earlier) -- *** VAMILY [your reputation]. THE STANDING
WEB CAN NAME A PERSON WHO WOULD SPEAK FOR YOU, AND SAY WHO TOLD THEM. Nothing to
judge. ***

TAB: RUN. Build 9/5a - WHO WOULD VOUCH FOR YOU.
Walk, let people see you, open the standing panel: under WHO HAS LAID EYES ON
--- 9/5 (b), SAME SESSION: [gate red] PEOPLE-GATE-RED. 148/10 -> 158/0, ONE CAUSE,
AND IT WAS MINE. ---

The coordinator put PEOPLE-GATE-RED at the top of this lane's queue: "his bugs
beat your queue: fix or explain the ten before taking anything else." Ten
failures in two clusters -- seven about ASKING somebody's name (C11, C23, C24,
C25, C27, C27a, C34) and three about the size of the starting neighbourhood (H1,
H3, H4).

*** ONE ROOT CAUSE, AND THIS LANE PUT IT THERE ON 8/28. *** The starting block
holds EXACTLY FOUR FAMILIES because he asked for it -- twice -- and the code says
so in its own comment ("A RATE cannot say four"). That count was scaled against
the LITERAL dial, so "four families at dial 1" was only ever true WHILE THE
DEFAULT WAS 1. On 8/28 the ALIVE-1 row moved the default to LANDMARK.story, for
a good measured reason (his design document says ~69,000 and the game shipped
4,194), and his own street quietly went to EIGHTEEN households and FORTY-SEVEN
people. The seven naming failures fell out of the same thing: with eighteen
families the asking flow met a different person.

A DEFAULT IS NOT A NEUTRAL NUMBER. Anything measured against 1 breaks the day 1
stops being the default, and nothing here said so out loud. The named count is
now scaled against THE DEFAULT rather than against 1: four families at whatever
the shipped default is, none at 0, eight at twice it. BOTH of his rulings survive
-- "four families in my starting neighborhood" and "the slider can go all the way
from ZERO to a maximum" -- and it stays true whatever the default becomes next.

Fixed in engine/bohemia_agents.js, the canonical body, then re-inlined into all
four carriers that hold a copy (ENGINE SYNC).

  gates/people_gate.js   148 passed / 10 failed  ->  158 passed / 0 failed
  and the rest of the lane still green on the same tree: ALIVE 16/0, WHO VOUCHES
  19/0, PACK 47/0, WALK ENCOUNTER 15/0, CITY MEMORY 34/0.

YOU there is now WHO WOULD VOUCH FOR YOU.

--- 9/5 (c), SAME SESSION: [demo talks] CLAIMED, MEASURED, NOT YET BUILT ---

TALK-REACHES-THE-DEMO. The board says "236 @TALK nodes and 504 @SAY lines are
parsed and mute in the demo file". THE NUMBERS ARE EXACT: 236 @TALK across 27
.bq files, 504 @SAY, and all 27 files ARE in the running page as DEMO_BQ.

WHAT IS ACTUALLY TRUE, MEASURED ON THE REAL SURFACE:
  BQ (parser)              live in the page
  BQRuntime                live in the page
  BohemiaConversation      live in the page
  DEMO_BQ                  27 files, 236 @TALK, 504 @SAY, all loaded
  DQ.Q / DQ.rt             NULL on a fresh boot
  ctCast()                 0
ctConvNode() returns null on its first guard (`if (!DQ.rt || !DQ.Q) return null`),
so on a fresh boot NOT ONE quest line can be spoken. The container is there and
it is empty.

*** AND THAT IS PROBABLY NOT THE BUG. *** DQ.openDay() is what fills DQ.Q and
DQ.rt, and it is called from exactly two places: the save-restore path, and THE
MOMENT THE PLAYER TAKES THE DAY'S OFFER on the phone. So a fresh game with no
offer taken SHOULD have a null runtime -- you have to accept the job before
anybody talks to you about it. My probe never took the offer, which is why it
measured null.

TWO BROKEN RULERS OF MY OWN ON THE WAY HERE, BOTH THE SAME MISTAKE: I probed for
`BohemiaBQ` and `BohemiaQuestRuntime` and reported both ABSENT and the corpus
missing. The file publishes `BQ` and `BQRuntime`. A NAME YOU GUESSED IS NOT A
NAME -- same shape as the patch tool's fence earlier today, twice in one session.

THE NEXT STEP, EXACTLY: take the day's offer on the real surface (the phone
offer path that sets window.__OFFER_TAKEN), THEN walk to the cast and measure how
many of the day's @TALK nodes actually reach the player and how many are
unreachable. Only that number can say whether these lines are mute. Do not
"fix" DQ starting empty -- that is the design.


THE ROW: BB-STANDING-PLAYER, in its own words -- "it is A WEB, NOT A BAR. A job
comes from a PERSON, and that person heard about you from someone. The question a
favour answers is not 'did my bar go up' but 'who will vouch for me now.'"

*** MEASURED BEFORE BUILDING, AND THE MEASUREMENT MOVED THE JOB. *** The row says
the player is not a node in the standing graph. TWO standing mechanisms exist and
both were checked before a line was written:
  1. engine/bohemia_standing.js, the PERSON-level web. THE PLAYER IS ALREADY IN
     IT -- the walked city calls witness(), opinionOf() and standingOf() with
     actor '@' in 25 places.
  2. engine/bohemia_engine.js, the FACTION world, where playerMandate(playerId)
     ALREADY reads a faction's standing TOWARD the player. The walked city does
     not build that world at all, and playerMandate has NO CALLERS ANYWHERE.
So the player was not missing from the web. WHAT WAS MISSING WAS THE WEB'S
ANSWER. Building a third standing thing would have been the two-mechanisms
mistake for the fourth time this month.

THE GAP WAS ONE FIELD: this web recorded HOW FAR a story travelled (hops) and
never WHO CARRIED IT. gossip() now stamps `from`; whoVouches() returns PEOPLE --
who is warm on you, the deed that did it, whether they saw it, and who told them.
whoWont() returns the other side, because showing one side of a web is a bar.
Proved live on the walked surface: eyewitness FWU "SAW IT", next person WARM
"HEARD IT FROM" her by name, force decaying 3.00 -> 1.65 -> 0.91 down the chain.

IT CANNOT INVENT A STANDING HE NEVER RULED (the row's own constraint): forceOf
returns 0 for an unweighted deed, so an unruled deed vouches for nobody however
many people watched it. The module still ships DEED_WEIGHT EMPTY; the city loads
82 from the deed corpus AT RUNTIME, which the real-surface probe found and my
first reading of the bare module had wrong.

A NAME IS EARNED, NEVER GIVEN. The first cut printed the mind's owner id and read
"12:12:900 FWU SAW IT" -- machine output, not a person. BohemiaPeople.headingOf
already owns that grammar, so the panel asks it. A mind restored from storage has
no person to resolve and the city's own comment says why that must not be
guessed: "an id cannot be turned back into a person, and guessing one from a seat
string is how this lane collapsed a whole population onto a dozen draws on 8/11."

TOOL LESSON: the inlined module's fence is an OPEN/CLOSE PAIR WITH DIFFERENT
TEXT, not the same banner twice. The first cut assumed they matched, refreshed
nothing, printed success, and left the panel calling a function the city's own
inlined copy did not have. A FENCE YOU GUESSED IS NOT A FENCE.

FILES
  engine/bohemia_standing.js                   whoVouches, whoWont, the teller
  tools/bohemia_city_who_vouches_patch.py      the panel and the fence fix
  gates/who_vouches_gate.js                    19 claims, 3 mutations caught

[PENDING Paolo] THE WEIGHTS ARE THE WHOLE GAME HERE AND THEY ARE HIS. The corpus
carries 82 deed rows. Until each one is worth something, every person in the
valley can watch you and form no opinion, so this panel correctly says nobody.
The mechanism is finished and dark. What is needed is not a number per row from
him one at a time -- it is a RULING ON THE SHAPE: which handful of things a
person actually repeats about a stranger, and roughly how much worse a betrayal
is than a kindness is good. One sentence unblocks all 82.

ALSO STILL TRUE AND NOT DONE (from 8/31): the FAMILY_CAST is 23 references in the
shell and ZERO in the walked city, so Ray, Denise and the surviving sibling exist
at the table and nowhere in the world you walk into.

PEOPLE (people-7h9sfy): 8/31 (b) -- *** FAMILY: THE FINDING, MEASURED. YOUR
FAMILY IS REAL FOR NINETY SECONDS AND THEN THEY ARE NOT IN THE GAME. Nothing to
judge; this is a finding and a named next row, not a shipped feature. ***

Paolo said one word: FAMILY (transcribed "VAMILY"). Measured rather than guessed.

WHAT ALREADY EXISTS, AND IT IS GOOD -- I CHECKED BEFORE BUILDING AND ALMOST
BUILT A SECOND ONE. FAMILY_CAST is a complete, canon-sourced family: RAY the
father, DENISE the mother, MARCO the brother, NINA the sister. Draft names under
the 8/11 rule, body dials on the one rig, every garment st==='canon', and the
7/19 gender mirror encoded as `survivesIf` -- a male player keeps the older
brother, a female player keeps the older sister, and the other is the one taken.
Both parents are `survivesIf:'always'`. The opening scene resolves {sibling_lost}
against that table and owns no names of its own. There is a gate on it.
I WAS ONE STEP FROM WRITING A SECOND FAMILY REGISTER. The question that stopped
it is the one this repo has paid for all month: DOES SOMETHING ALREADY PICK THIS?

THE GAP, AND IT IS ONE NUMBER:
    FAMILY_CAST references in slices/BOHEMIA_ALPHA_0_9.html   23
    FAMILY_CAST references in slices/BOHEMIA_DEMO.html        23
    FAMILY_CAST references in slices/BOHEMIA_CITY_WORLD.html   0
    RAY / DENISE / MARCO / NINA in the walked city             0 / 0 / 0 / 0
The family lives in the SHELL, where the opening scene plays. The walked world
has never heard of them. You sit at that table, the cut takes ten years, you
walk out into a valley of ~96,885 people and NOT ONE OF THEM IS RELATED TO YOU.
By the cast's own flags THREE OF THEM ARE ALIVE -- both parents always, plus the
sibling who matches your gender -- and all three are absent from the world.

AND THE DYNASTY IS THE WHOLE GAME. "Three generations, ~100 years. Gen 1 Animal,
Gen 2 Human, Gen 3 Angel. THE PLAYER LIVES ALL THREE" is locked canon and the Act
3 ending is the gen-3 Angel heir going one-way. A generational handoff INHERITS
the family tree. There is no family tree in the walked game to inherit.
engine/bohemia_succession.js exists but is FACTION SEATS -- who holds a post when
somebody dies -- not the player's blood.

THE NEXT ROW (FAMILY-1): the surviving family are PEOPLE IN THE VALLEY. They
already have ids, faces (faceFor takes an id), and a full `worn` list, so this is
placement and persistence, not invention -- the same ONE ID ONE WHOLE PERSON rule
that made the portrait match the body. Default location is YOUR OWN HOUSE, which
the demo already starts you in; that is not designing a map, it is putting your
mother in the house the game opens in. WHO IS ALIVE TEN YEARS LATER beyond the
cast's own flags, and WHAT THE LOST ONE'S REAL NAME IS, stay his: the scene line
is literally "{sibling_lost}. Green ones too." with a hole where the name goes.

[PENDING, Paolo's call] the sibling's EMPTY CHAIR motif at family meals is marked
[PENDING] in the scene file itself and is NOT built.

PEOPLE (people-7h9sfy): 8/31 -- *** HIS TWELVE APPROVED STREET ENCOUNTERS
PEOPLE (people-7h9sfy): 8/31 LATEST -- *** HIS TWELVE APPROVED STREET ENCOUNTERS
FIRE ON FOOT FOR THE FIRST TIME, AND WHERE ONE NAMES AN ANIMAL IT POINTS AT THE
ANIMAL THAT IS ACTUALLY THERE. TAB: RUN. Nothing to judge. ***

TAB: RUN. Build 8/31b - THE STREET HAS THINGS HAPPENING IN IT.
Walk. Things start happening to you that never happened before.

THE ROW: ALIVE-3, which ALIVE-1 named as lead 2 and ALIVE-2's record named as
mandatory.

*** HE APPROVED TWELVE ENCOUNTERS ON 7/26 WITH A PLAIN "Approve all" AND NOT ONE
HAD EVER FIRED FOR A PLAYER ON FOOT. *** roadInterrupt is called from exactly ONE
place, stepOnce's MODE==='city' branch, which is overmap travel at ten minutes a
cell. The walked surface had never called it. HIS OWN APPROVED CONTENT, never
reaching him -- the seventeen invisible hats, the four bright garments nobody
wore, the face maker with no route in, and now this, which is the biggest of them
because he actually approved it out loud.

AND ITEM ONE IS `feral_dog_pack`, ITEM TWO IS `coyote_shadow` -- the two animals
ALIVE-2 shipped the day before. So this is ENGINE SYNC AT THE DESIGN LEVEL, not a
content add: a director announcing dogs while this tier's dogs stand somewhere
else is two mechanisms that both mean "dogs", the ONE ID ONE WHOLE PERSON mistake
with a different noun.
THE DIRECTOR NEVER INVENTS AN ANIMAL. IT POINTS AT THE ONE THAT IS THERE. The
hook is tableFor(district, phase), which is MINE and which the module asks "what
can happen here" -- so it answers what can happen here RIGHT NOW. Measured
walking: coyote_shadow -> coyotes@6865,6302, feral_dog_pack -> dogs@6914,6312,
and the BACK OFF button already works on it.

ONE OPINION PER PLACE: a road class keeps the row ROAD_TABLE already authored.
NO GLOBAL SPAWNS EVER: a district with no row spawns nothing, no fallback.

*** AND A GATE CLAIM FOUND A REAL HOLE IN HIS ROSTER, NOT A TEST BUG. *** The mix
is 70% AMBIENT and only THREE of the twelve are ambient: coyote_shadow,
ghost_robotaxi, and patrols_collide which needs a seam. Because the table will not
offer an animal that is not on the glass, a district with no coyote had NO ambient
token at all and went silent seven beats in ten. The module is RIGHT to refuse a
substitute (a forced fight standing in for an ambient beat breaks the promise
70/20/10 makes), so the fix is SUPPLY: his approved ghost_robotaxi now sits in
every row with a street in it. WHERE an approved thing happens is mine; a
THIRTEENTH encounter would be his and there is not one here.
THE THIN AMBIENT BENCH IS A FINDING FOR HIM: seven beats in ten want an ambient
encounter and the roster has three, one a car and one needing a seam.

TWO BROKEN RULERS IN MY OWN GATE, BOTH FOUND BY IT GOING RED
  1. A WALKER THAT CANNOT TURN IS NOT MEASURING WALKING, IT IS MEASURING A WALL.
     The first cut hammered one direction 1,400 times; the player walked SIX CELLS
     into a wall and the gate called the feature dead while it worked. It turns
     when blocked now and covers 3,418 cells.
  2. The never-lies claim was NONSENSE THAT COULD NOT FAIL: it built an array,
     never called tableFor, and reported 0 because 0 is what an empty loop gives.
     Rewritten it leaned on walkInterrupt, which reads dayWhere(), so it was really
     asking WHERE THE WALKER HAPPENED TO STOP -- and it stopped somewhere with no
     row. A CHECK THAT DEPENDS ON WHERE THE TEST ENDED IS MEASURING THE TEST.

*** AND A SHIP-ROUTINE FACT WORTH NOT PAYING FOR TWICE. *** Changing ANY shared
surface makes every one of the 51 LOOK pictures stale by that gate's own rule
(picture older than the surface it photographs by six hours). Rebuilding them is
51 separate shooter tools and about twenty minutes. It happened twice in two
features today. IT BELONGS IN THE SHIP ROUTINE NEXT TO THE BUILD STAMP AND THE
DEMO CUT, not in the debugging loop where it keeps getting rediscovered. The gate
prints the exact command per picture, so the whole set is:
  node gates/look_gate.js  ->  run every 'RETAKE IT WITH' line it prints

FILES
  tools/bohemia_city_walk_encounters_patch.py   the table and the wiring
  gates/walk_encounter_gate.js                  15 claims, 3 mutations caught
  records/BOHEMIA_WHAT_A_PACK_ACTUALLY_DOES_8_30_26.md   (ALIVE-3 section)

*** WHAT COMES NEXT FOR THIS LANE ***
THE ENCOUNTERS ANNOUNCE AND DO NOT YET RESOLVE. Only the dogs resolve, through
the BACK OFF button. rattlesnake, the_snatcher, scavenger_shakedown and the rest
print their line and pass. Giving each a real resolution is the next row, and the
pack is the worked example of what "real" means: a decision with two answers and
a cost. NOTE the roster's own kinds when doing it -- three of the twelve are
`forced` and two of those are fights, which is where NO DAMAGE BEFORE THE DIAL
will finally bite.

PEOPLE (people-7h9sfy): 8/30 -- *** THE PACK DOES NOT WANT TO FIGHT YOU.
Dogs and coyotes, and you can push them: 22 times in 23 they leave, and at a den
they never do. TAB: RUN, walk out and keep going. Nothing to judge. ***

TAB: RUN. Build 8/30e - THE PACK DOES NOT WANT TO FIGHT YOU.
Walk out of the house and keep walking; a pack turns up in about 49 steps. When
one is warning you a BACK OFF button appears on the left. Press it.

THE ROW: ALIVE-2, tier 2, the tier his 8/25 dispatch called ENEMIES, LOOT and
Valheim-style DANGER BY PLACE. Tier 1 (8/28) is what is alive around you. This is
the first thing in the valley with an opinion about you.

*** THE BACKLOG ROW WAS WRONG ABOUT DOGS AND THE RESEARCH SAYS SO. *** It reads
"pack AI that flanks and breaks off", which is a WOLF. Free-ranging dogs forage
singly most of the time, form "random uncorrelated groups", cooperate LESS than
wild canids, hold ranges that "overlap substantially" with other packs, and their
frequent intergroup conflict "rarely results in lethal aggression". So a city dog
pack HOLDS A SPOT WITH FOOD ON IT AND THREATENS WHAT COMES FOR IT, and almost
never follows through. That encounter is better than a hunt because it has a door
in it: you can leave, and so can they.

*** AND THE MEASURED NUMBER INVERTS THE CONVENTION. *** Edmonton, 120 volunteers,
71 neighbourhoods, 1,598 patrols: coyotes "retreated before volunteers were
within 40 m during 124 (71%) of the observations and retreated immediately from
22 (96%) of the hazing events". ONE IN TWENTY-THREE DID NOT BACK DOWN. Nerve is
rolled once per group per day, never per press, so the one that holds is ALWAYS
the one that holds: a percentage re-rolled every press is a slot machine, a
percentage rolled once per group is a character.

MEASURED, NOT ASSERTED
  back down when you push        95.6%  over 38,946 groups
  back down AT A DEN             0 of 6,160
  dog groups vs coyote groups    3,252 to 106 over 300 seeds
  coats                          sandy 56%, black 27%, pale 16% (weighted)
  steps to meet a pack           49, on the real surface

THE DEN IS THE EXCEPTION, FROM BIOLOGY, WITH NO DIAL: urban canids den in dry
culverts, storm drains and under sheds, and a den is the one place a pack CANNOT
leave, so the four percent is a hundred percent there.

THE ALLEY IS THE TACTICAL LAYER AND BROGUE PROVED IT: grouped monsters avoid
corridors so they do not waste their numbers. One openness test, shared with tier
1 so the two cannot drift.

*** AND THE DISTANCES ARE BOUNDED BY THE SCREEN. *** First cut: dogs notice 14,
warn 7, reasoned from the animal alone. The canvas is 378x785 at 44 pixel tiles,
so the player sees about EIGHT cells: a dog that notices at fourteen has already
noticed you before it is on screen, so ITS SETTLED STATE DOES NOT EXIST FOR
ANYBODY PLAYING. A STATE THE CAMERA CANNOT CONTAIN IS NOT A STATE, IT IS A
COMMENT. Ladder now reads, off the glass:
  9:settled 8:settled 7:settled 6:notice 5:notice 4:notice 3:warn 2:warn 1:warn

*** AND THEN A GATE CALLED THE WHOLE FEATURE DEAD, AND IT WAS RIGHT. *** ORGAN
REACH rule 1: "an organ no line in this repo calls is dead." TWO of them, and
they were THE HEADLINE. packAssert() was defined and NEVER CALLED, so the player
could not push a pack and the 22-in-23 finding this tier is built on had no way
to happen. BohemiaPacks.ring was NEVER CALLED, so the alley rule ran nowhere.
THE MECHANISM EXISTED AND NOTHING COULD REACH IT -- the invisible-hats shape, in
the same turn as a record about the invisible-hats shape, and no amount of
looking at the screen finds it because what is missing is not on the screen.
Fixed: a BACK OFF button that appears ONLY while something is warning you (a
control always there is another bullshit button, 8/16; a control never there is a
dead organ), and the ring is drawn, so a warning pack closes on the cells around
you and takes NONE of them in a narrow place. pack_gate now asks that question of
itself: every function the module exports must have a caller in the game.

AND THE BUTTON WENT IN THE WRONG PLACE TWICE. Placed by counting CSS rules: it
landed ON TOP of the caption and STANDING with the d-pad over its right edge.
Corrected by arithmetic: still 49px out, because the container is inset by an
amount no rule in the file states. Fixed by MEASURING the rendered boxes. The
check is NINE POINTS, NOT THE CENTRE -- the middle row passed both times it was
broken -- and the ruler itself needed a fix, because the exact corners of a
rounded button are outside the shape on purpose.

FIVE THINGS ONLY LOOKING FOUND, TWO ALREADY SHIPPED
  1. THE FAR LEGS DREW ON THE NEAR LEGS' OWN TWO COLUMNS, in shadow. EVERY
     four-legged animal has had two dark sticks under it since the coyote was
     cooked on 8/28. Further away is higher and offset, so the 45 law fixes it.
  2. THE HEAD FLOATED IN THE LOOK FRAME: the bird has had a neck since its first
     cut and the beast never did. AND THE FIRST NECK WAS GUESSED along a slope
     worked out on paper, and all four pixels landed on paint already there, so
     the gap survived the fix. A BRIDGE IS MEASURED FROM THE TWO BANKS.
  3. The eye sat on the OUTERMOST pixel of the head.
  4. Legs used the bird's thin dark scaly leg colour, on a furred dog.
  5. The button, twice.

*** AND THE PATCH TOOLS COULD NOT SEE THEIR OWN STALENESS, TWICE IN ONE HOUR. ***
A one-shot patch returns "already applied" the moment it sees its marker and
never looks at whether the inlined block is PRESENT AND OLD. Re-cooking the bank
and re-measuring the module each changed the file on disk and changed NOTHING the
player sees, while the tool printed success. Both tools now copy module and bank
forward EVERY run, and the pack tool's sections each check THEIR OWN marker,
because a tool gated on the first marker can never add anything later -- which is
how the button came to be missing.

GATE LESSONS
  THE DAMAGE CHECK ASKED THE WRONG QUESTION TWICE. It is a claim about a NUMBER
  and both cuts asked whether a WORD appeared: first it flagged the module's own
  header comment (A COMMENT IS A BLOCK, NOT A LINE), then the CANNOT string that
  SAYS there is no damage (A WORD IS NOT A NUMBER).
  THE ON-GLASS CHECK PASSED ON A FAILED MEASUREMENT: 20 and 10 cells are off the
  top of the screen, it got "offscreen" twice and passed because offscreen is not
  equal to warn. Same shape tier 1 had two days ago, in a gate written AFTER
  fixing it there.
  A TIER 1 CLAIM WAS REPOINTED, NOT LOOSENED: wildlife_gate asked the bank hold
  EXACTLY the tier 1 five; the bank is now shared on purpose, so it checks every
  tier 1 species is drawn AND that nothing in it is claimed by no module.

FILES
  engine/bohemia_packs.js                 the module
  gates/pack_gate.js                      47 claims, 7 mutations caught
  tools/bohemia_city_pack_patch.py        the wiring, the button, the staleness fix
  tools/bohemia_wildlife_factory.py       three dogs, the legs, the neck, the eye
  tools/bohemia_city_wildlife_patch.py    same staleness fix
  gates/wildlife_gate.js                  roster claim repointed
  records/BOHEMIA_WHAT_A_PACK_ACTUALLY_DOES_8_30_26.md

WHAT THIS TIER STILL CANNOT DO, printed by its own gate
  - nothing does damage and nothing has health: NO DAMAGE BEFORE THE DIAL
  - a den is EMPTY until he says what is in one (who died is canon, and canon is his)
  - nothing in the world is marked as FOOD yet, so a pack settles for an edge
  - and it does not know what a roof or a storm drain is, only openness

*** WHAT COMES NEXT FOR THIS LANE, AND HE ALREADY APPROVED IT ***
Item one of the twelve street encounters he approved 7/26 with a plain "Approve
all" is `feral_dog_pack`. Item two is `coyote_shadow`. THOSE ARE THE TWO ANIMALS
THIS TIER SHIPS, and that list has NEVER FIRED FOR ANYBODY ON FOOT: the director
is called from exactly one place, stepOnce's MODE==='city' branch, which is
overmap travel at ten minutes a cell. Every reference checked.
So the next row fires it while you WALK, and it is MANDATORY that his approved
encounter and this tier's pack are ONE SYSTEM, not two things that both mean
"dogs" -- ENGINE SYNC at the design level, the ONE ID ONE WHOLE PERSON mistake.
When the director fires `feral_dog_pack` on foot it should hand you THE PACK THAT
IS ACTUALLY STANDING THERE, with its own nerve, its own den and its own coats.
ROAD_TABLE's keys are ROAD CLASSES (arterial, strip, freeway, beltway,
interchange, rail, wash), so a walked table needs DISTRICT keys and is new
content. Under EVERYTHING IS A THUMB that is mine to decide and build.

PEOPLE (people-7h9sfy): 8/28 LATEST -- *** THE CITY IS DEAD AND THE SLIDER WAS
NEVER THE ANSWER. Measured, fixed as far as a number can fix it, and the half
that is left is NAMED. TAB: RUN, walk out of the house and look. Nothing to
judge. ***

THE ROW: ALIVE-1, item 5 of his 8/25 playtest dispatch, the loudest complaint on
it. "I THINK I SAW ONE WATCH PERSON ON ACCIDENT ... THE CITY SEEMS DEAD ASF AND
I DONT LIKE THIS BEING THE DEFAULT I KNOW WE HAVE A SLIDER AND SHIT BUT YEAH
MAN." The row's own test is a sentence and not a head count: "he walks one block
and sees somebody WITHOUT HUNTING FOR IT." So the measurement WALKS.

MEASURED ON THE REAL DEMO. Thirty-two walks: eight starts around the spawn, four
directions each, up to 800 steps a walk, counting bodies the surface actually
blitted, excluding the one authored neighbour pinned to the spawn:
    dial  1 (what shipped)   0 of 32 walks met a single stranger
    dial  8                  2 of 32
    dial 20 (now)            6 of 32, median 323 steps, closest 9
    dial 26                  8 of 32
    dial 32 (the ceiling)    9 of 32, median 261
    frame cost 1 -> 32       0.5 ms -> 0.8 ms
TWENTY-FIVE THOUSAND STEPS AT THE SHIPPED DEFAULT AND NOBODY IS THERE. And the
one body he did see is id 12:12:900, archetype WATCH. He said he saw one watch
person. IT IS THE SAME BODY.

IT WAS NONE OF THE THINGS IT LOOKED LIKE, each checked alone: not the draw path
(stand two cells from anybody and they are drawn, three at a time), not the
census (the dial scales it exactly, 1/9/21/29 per block), not the hour (same at
08:00, 13:00, 18:00), not the draw budget (24 per neighbourhood against a census
of 1), and NOT PERFORMANCE, which is the reason people usually give for keeping a
world empty: 28x the population costs 0.2 milliseconds.

TWO PROBE MISTAKES, BOTH WORTH KEEPING:
  A PROBE THAT CHANGES AN INPUT THE CACHE DOES NOT WATCH IS MEASURING THE CACHE.
  The first sweep moved the dial 1 -> 20 and got the identical number five times;
  PPL_PEOPLE is busted by rulesVersion() only and the dial does not clear it.
  AND I MEASURED AT THE EMPTIEST HOUR OF THE DAY and nearly concluded the
  schedule was broken. 13:00 is the middle of the heat window and 3 of 61 people
  are out. At 10:00 it is 41 of 61.

AND THE SCHEDULE WAS NEVER THE BUG, WHICH IS NOW A GATE CLAIM so nobody goes
hunting for one: 0% outdoors at 02:00, 48% at 08:00, 67% at 10:00, 5% at 13:00
when the heat rule fires, 66% at 17:00, 7% after dark. That is a real day, and
nobody wrote a schedule for a single person to get it.

WHAT SHIPPED
  1. THE DEFAULT COMES OFF THE MODULE'S OWN LANDMARK TABLE, by reference, never
     a number typed twice: LANDMARK.story = GDD v5's ~69,000, about 3% of the
     real valley's 2.3M. The shipped default was 4,194. HIS DESIGN DOCUMENT AND
     HIS GAME DISAGREED BY A FACTOR OF SIXTEEN, and a live document contradicted
     by live code is a bug, not a taste question.
  2. THE ONES WHO ARE OUT STAND SOMEWHERE OPEN. pplOutSpot walked 4 to 10 cells
     from the doorstep and took the FIRST STANDABLE CELL, which on this world's
     scale does not clear the plot: the side of the house, the gap between two
     walls, the back yard. The ray reaches past the block now and stops at the
     most OPEN cell along it (openness COUNTED: how many of the 24 cells around a
     candidate are walkable; a street scores near 24, a gap between houses four).
     THEIR DIRECTION IS UNTOUCHED, so the 7/31 address book still makes them
     individuals. Worth 6 of 32 -> 7 of 32 on its own. Small, and said to be.
  3. TWO GATE CLAIMS REPOINTED, NOT EXEMPTED. people_gate E1 and
     population_dial A1 both asserted "the dial still ships at 1, nothing moved
     until he moves it". Right on 8/1. On 8/25 he moved it in his own words, and
     from that moment those two were GATES DEMANDING THE BUG HE COMPLAINED
     ABOUT. They held it for three days. A GATE MUST NEVER OUTRANK A RULING.
     Both now hold something stronger: the default must be one of the module's
     own named landmarks and can never become a typed-in number.

*** AND WHAT THIS DOES NOT FIX, WHICH IS THE IMPORTANT HALF. *** At the TOP of
the slider, ~96,885 people, 23 of 32 walks STILL meet nobody. The valley is ~151
square kilometres and a step is about a metre. NO VALUE OF THIS NUMBER MAKES A
STREET FEEL INHABITED, and the gate prints that sentence on every run so the
next session does not turn the knob again and call the job done.
WHAT IS LEFT IS NOT A COUNT, IT IS WHERE. Two leads, both already built, both
already approved:
  1. the module sorts people CLUSTER / SPREAD / LONER (13 / 208 / 141 on the
     canon seed) and the demo walks a SPREAD suburb. Survivors cluster.
  2. *** THE AMBIENT ENCOUNTER DIRECTOR HAS NEVER FIRED FOR ANYBODY ON FOOT. ***
     engine/bohemia_encounters.js is the 12-item act-1 roster he approved on
     7/26 ("Approve all") with the 70/20/10 pacing package, and it has a COYOTE
     SHADOW in it. It is wired into stepOnce's CITY branch, which is OVERMAP
     TRAVEL. The walked surface, which is the demo, has never called it. Same
     shape as every other organ this repo has found: finished, correct, unwired.

NEXT BUILD, AND IT IS THE CHEAPEST FIX ON THE WHOLE DISPATCH FOR THE LOUDEST
COMPLAINT ON IT: TIER 1 LIFE. The 8/25 bestiary research already says it in its
own words -- "the reason the city feels dead is not that we lack enemies. It is
that we lack ANIMALS. Ravens on a roofline, rats at a bin, a coyote crossing the
wash three blocks away and not caring about you ... set dressing that moves."
AMBIENCE DOES NOT NEED A CENSUS: a raven is placed near the PLAYER, so the
valley's 151 square kilometres stop mattering. Roster is sourced and banked in
records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md section 2.
The one real cost is ART, and REUSE-FIRST says check banks/ before cooking a
pixel: measured today, the city prop bank has bag/barrel/bin/dumpster and no
animal at all.

*** AND A POPULATED VALLEY FOUND EIGHT TESTS THAT WERE MEASURING AN EMPTY ONE. ***
Moving the default turned eight gates red that were green on main. All eight are
mine, all eight are FIXED and stronger, and NOT ONE WAS EXEMPTED.
ONE BUG IN SIX PLACES: *** A TEST THAT PICKS A PERSON AND THEN TRUSTS THE GAME TO
PICK THE SAME ONE IS TESTING THE CROWD. *** Six gates stood at `hx = at[0] + 1`
beside a chosen body and called ctOpen(), which shows whoever is NEAREST. Right
while the valley held one person a block; the moment it held twenty the card
opened on a stranger and the claims reported missing features that were never
missing. They check the identity over the eight-cell ring now.
  CITY PEOPLE 18/0   the occupancy claim compared TOTAL DRAWN before and after a
                     step (147 -> 148) while the law was obeyed perfectly,
                     because moving the player moves the camera. A CLAIM THAT
                     COUNTS THE THING INSTEAD OF READING IT.
  MASS EDIT 30/0     "restores the surface exactly" took BEFORE through a
                     hard-coded cap of 24 and BACK through the dial-scaled path.
                     COMPARING TWO READINGS TAKEN THROUGH DIFFERENT DOORS IS NOT
                     A COMPARISON.
  CARD FOLD 18/0     identity, plus it took the FIRST qualifying target and
                     skipped if it could not reach them. A CHECK THAT GIVES UP IS
                     NOT A CHECK THAT PASSED.
  CLAIM 45/0 - FACTION BETWEEN 108/0 - FAVOUR 31/0    identity.
  COMMITMENT 72/0    it assumed the first affiliated body's card offered the
                     REPEATABLE act; at 20 that became somebody whose give is
                     once-only, so nine presses landed one and the wall test
                     reported an off-by-one in the wall. TRACED, not guessed.
  FACTION ARC 91/0   ten selection sites over thirteen pages, and its own comment
                     said the quiet part: "the Cartel, AND IT IS THE FIRST
                     AFFILIATED PERSON IN THE VALLEY". A TEST THAT DEPENDS ON HOW
                     MANY PEOPLE ARE IN THE WORLD MUST PIN THAT NUMBER, the way
                     it already pins the seed. Pinned, with the reason, and it
                     says what that no longer covers: belonging in a CROWD, which
                     is a real row that does not exist yet.
  ZONE MAP 74/0     "the ruling moved the dial off the flat 0.30 placeholder"
                     read a rate that ends in applyDial(), comparing a
                     DIAL-SCALED number against a threshold from before the dial
                     existed. It called the zone map flat while the zone map had
                     not changed at all. Pinned to the scale it is written in.
THE FINDING UNDER ALL OF IT: an empty world was hiding a whole class of test bug,
and it only surfaced because the world got populated. NINE GATES, all repaired,
none exempted.

  GATE: gates/alive_gate.js, ALIVE, 16 claims, 0 red. Mutation: the default put
  back to 1 turns SIX claims red, headline "0 of 32 walks, 0 different people".
  RECORD: records/BOHEMIA_THE_SLIDER_WAS_NEVER_THE_ANSWER_8_28_26.md
  Row ALIVE-1 marked half done in BOHEMIA_BACKLOG.md with the redirect.

--------------------------------------------------------------------------------
PEOPLE (people-7h9sfy): 8/27 (b) -- *** THE DEMO CAN BE HANDED TO
SOMEBODY NOW. The last row on the critical path is built: BUILD, DOOR, ENDING,
INSTRUMENT all exist, and INVITE is his. TAB RUN in the demo build (the card
under the ending, and the save drawer any time). Nothing to judge. ***

THE ROW: 0f, the feedback card. "Three taps (fun? / confusing? / play again?) +
an optional text box, exported exactly like the save blob so a tester can paste
it into a chat", stamped with the build and the seed since the 8/25 amendment.
Without it a friends round returns five texts saying "it was cool".

MEASURED FIRST, ON THE REAL DEMO, BEFORE ANY OF IT WAS DESIGNED. Drove the
shell, tapped the real splash, played a few beats, read every byte the page kept:
    bohemia:look 1,517 - boh.city.minds 118 - boh.city.deedweight 2 - sfxvol 1
    about how the session went for the person playing:   0 bytes
    and CT_BUILD did not exist. The city has never known which build it is.

*** AND THE ROW CONTRADICTS THE PROTOCOL, WHICH IS THE WHOLE FINDING. *** The
closed-playtest protocol's standing rule: "a tester who stops playing is a
FINDING, never a failure. Where and why is the whole point of the instrument."
A CARD AT THE END IS FILLED IN ONLY BY PEOPLE WHO REACHED THE END. Everybody who
stopped, which is the exact population the protocol calls the whole point, never
sees it. So THE PASTE IS WRITTEN WHILE THEY PLAY: an eleven beat flight recorder
that starts at the first tap, and the card only adds the words. Somebody who
quits at minute four and comes back next week still has it.
IT SAMPLES, IT DOES NOT HOOK, for the reason ctSave writes down in its own
comment: "one seam, not twenty, and hooking each is five chances to miss one".
No call site is touched by any of this.
AND THERE IS A DOOR THAT IS NOT THE ENDING: the save drawer, which is already
where somebody goes to get a block of text out of this game.

THE THREE TAPS ARE NOT THE ROW'S LITERAL THREE, and the reasons are in the gate
by name. Researched 8/27: PEOPLE ARE NICE AND THEY WILL LIE TO YOU, friends and
family worst of all, which is exactly who round one is. "Did you have fun" is the
textbook vague question and "would you play again" is the textbook polite one.
Both were in the row. The fix every source gives is to ask about A BEHAVIOUR
ONLY PEOPLE WHO LOVE A THING PERFORM:
    1  WOULD YOU SEND THIS TO SOMEBODY?    I already want to / if it were
       finished / no          (three, because Net Promoter's other half is that
       the middle is not a pass)
    2  WHAT PART FELT LIKE WORK?           the parts THEY reached + none of it did
    3  WHERE DID YOU NOT KNOW WHAT TO DO?  the parts THEY reached + I always knew
    box  IF YOU COULD CHANGE ONE THING
Taps 2 and 3 offer their OWN session, never a generic list: a tester who quit
before the phone rang is never asked about the phone, because an option somebody
cannot have an opinion about is an invitation to make one up. Only possible
because the recorder ran while they played. THE ROW'S SHAPE IS UNCHANGED: three
taps, one box, one paste, out the save blob's own .txt export door.

*** AND THE WORST ONE ONLY LOOKING FOUND. *** Fifty-five claims were green and
the card had been driven end to end six times before anybody took a screenshot
of it. In the screenshot, STANDING, CITY, BIKE and SLEEP are drawn straight
THROUGH the card, over the send button, where a tester's thumb goes. #daycard is
inset:0 with a full scrim and has sat at z-index 20 since it was built; the
day-loop chips went into a column at 39 on 8/24. So every card the day loop has
ever shown has had the chrome over it, INCLUDING YESTERDAY'S ENDING.
IT IS THE SAME BUG RUN FIXED FOR THE PHONE TWO DAYS AGO, and their rule is
written three hundred lines below it in the same file: chrome 6..45, TAKEOVER
PANELS 50 and up. Their note says "only this one covers the stage today" and
that was not true when it was written, and the sweep that catches the general
case runs over a list of panel ids TYPED BY HAND that #daycard was never on.
*** AND MY FIRST FIX WAS TOO BIG AND THE MACHINE HAD TO TELL ME. *** I applied
the rule literally and put #daycard in the takeover band at 51, which INVERTED two
relationships nothing had asked me to touch: the person card is 41 and the phone
is 50. cardfold_gate came back with the browser's own words, "#daycard subtree
intercepts pointer events", on a tap that had always landed. The sentence that
names the mistake was already in that file TEN LINES FROM WHERE I WAS TYPING,
written by the lane that learned it two days earlier: MOVING WHERE SOMETHING SITS
IS A LAYERING CHANGE, AND EVERYTHING THAT DEPENDED ON THE OLD POSITION HAS TO BE
FOUND AND MOVED WITH IT. I did the moving and not the finding.
FIXED AT 40: above the chip column at 39, below the person card at 41, below the
phone at 50 -- the smallest move that fixes the defect that was actually measured,
nothing else changes position. `daycard` is on that sweep's list now, one word.
LEFT UNDONE AND SAID OUT LOUD: by the written rule #daycard belongs in the
takeover band, and putting it there means moving the person card and the phone
with it. That is a whole-stack change and it belongs to the lane that owns those
panels, not to a feedback card.
CARD FOLD 18/0 - FIRST MORNING 19/0 - FEEDBACK 65/0 after the correction.
AND MY CLAIM FOR IT WAS GREEN OVER THE LIVE BUG TWICE -- first measuring the
button on a freshly opened card where it sits below the fold and over nothing,
then, scrolled to where a tester is, reading its CENTRE: eight of nine points on
that button are the button and the ninth, its bottom left corner, is a chip.
A CONTROL IS REACHABLE WHEN EVERY PART OF IT IS, NOT WHEN ITS MIDDLE HAPPENS TO
BE. Nine points now, printing what the browser found at each. Re-mutated: red,
naming rungbtn and note.

TWO MORE HOLES THE GATE FOUND, and both are the same class:
  A TWO SECOND TICKER CANNOT SEE A CARD THAT OPENS AND CLOSES BETWEEN TWO OF ITS
  LOOKS. "Got out of bed" was read off the wake card going away, and a fast
  player dismissed it inside one tick, so the paste said he never got up.
  A DURABLE FACT CAN BE SAMPLED; A TRANSIENT ONE NEEDS A WITNESS. The witness is
  an observer on the card, which is still not a hook.
  AND THIS GATE'S OWN SILENCE CLAIM WAS GREEN FOR THE WRONG REASON. "When the
  ending lands there is nothing to press" read the door in the same synchronous
  block as the ending, which is trivially empty for ANY setTimeout: mutating the
  five second pause to zero left it green. A CLAIM THAT PASSES BECAUSE OF WHEN IT
  LOOKED, NOT BECAUSE OF WHAT IS TRUE. It measures a second and a half in now,
  which is an instant a person can be at. Re-mutated: 1 red.

THE ENDING KEEPS ITS SILENCE. Peak-end is why there is nothing to press on the
last card, so the door is not built into it: it arrives five seconds later,
appended to the card already on screen, quiet, in monospace rather than the
game's voice. A player who closes the ending never sees it. The card says what
it is on its first line ("not the game, thirty seconds") and what it cannot do
on its last ("nothing gets sent from here"), because this is a static page on a
phone and implying a server is the one lie a feedback card cannot afford.

AND A ROUND OF THEM HAS TO BE READABLE, so the other half shipped in the same
turn: tools/bohemia_read_the_round.py. The protocol already required it ("the
coordinator compiles all rounds into one digest -- where they quit, what
confused, what they said") and nothing read anything.
    python3 tools/bohemia_read_the_round.py round1/*.txt --against round0/*.txt
Which build and which seed each tester was on (and it SHOUTS if a round spans
more than one of either, because then their quit points are not comparable), the
devices, HOW FAR EACH ONE GOT as a histogram plus how long they sat there before
they stopped, what nobody reached, the three tallies, every word verbatim.
A FORMAT IS NOT PROVEN READABLE UNTIL SOMETHING READS IT, so the gate's test
pastes are RENDERED BY THE MODULE THE CARD USES rather than typed out: it proves
the round trip instead of proving the reader can read my typing. Two refusals
are built in: an unreadable paste is REPORTED never dropped (silently skipping
one turns eight testers into six), and NOTHING IS AVERAGED INTO A SCORE, because
five people is five people and a mean of five opinions looks like evidence.

  GATE: gates/feedback_gate.js, FEEDBACK, 65 claims, 0 red. IT PLAYS AND IT
  NEVER CALLS mark() -- the ending gate learned one day earlier that a probe
  which sends the message the real sender is supposed to send is still a side
  door. Mutations: a beat that re-stamps 1 red, the taps offering everybody the
  whole day 2 red, the shell refusing to name the build 4 red, the survey
  arriving the instant the message lands 1 red, the card sampled instead of
  watched 1 red.
  RECORD: records/BOHEMIA_THE_CARD_ONLY_THE_FINISHERS_SEE_8_27_26.md
  Row 0f is closed in BOHEMIA_BACKLOG.md and item D of the demo gap list.

THE GATE PASS, AND THE HONEST SHAPE OF IT. The FULL 463-gate suite ran twice on
this work, two shards each, 44 red on the second run and NONE OF THEM MINE. Then
MAIN MOVED NINETEEN COMMITS while that second pass was running -- 94 files, 8,204
insertions, 652 lines inside the city file this patch lives in. Re-running the
whole suite after every rebase loses that race forever, so the merged tree got a
NAMED, TARGETED pass instead and this says so rather than claiming a full one:
  FEEDBACK 65/0 - CARD FOLD 18/0 - FIRST MORNING 19/0 - CONVERSATION 39/0 -
  ADDRESS 41/0 - CASTING 26/0 - ENDING 26/0 - DEMO BUILD - BLOB - NO MARKERS -
  ORGAN REACH, all green on the merged tree, plus the module banner, the marks,
  the z-index, the export handler, the resync and the demo cut all verified
  present after the merge.
The full-suite numbers below are from the pre-merge tree. FIRST MORNING went red in the pack and GREEN WHEN RUN ALONE, which was
MY OWN FAULT: I ran three browser probes DURING the pass, and the suite's
confirm-alone step is the only reason that did not get shipped as a mystery. DO
NOT RUN A BROWSER WHILE THE SUITE IS RUNNING. INSTALL CARD is red on main's own
city at 790b3ce, tested by checking that file out and running the gate against
it, so it is standing and not this turn's. CARD FOLD was mine and is fixed above.
Mine, all green: FEEDBACK 65/0, CONVERSATION 39/0, ADDRESS 41/0, CASTING 26/0,
ENDING 26/0, CARD FOLD 18/0, FIRST MORNING 19/0.

WHAT COMES AFTER, and it is not code: INVITE. The protocol has been written and
waiting since 8/11. Five to eight people he trusts to be honest, at least two of
whom are not gamers, on their own phones, no explanation from him beyond "play
this". Each sends him one paste. HE NEVER GIVES ANYBODY THE WORKSHOP LINK.

AND THE NEXT BUILD IS ALIVE-1, MEASURED THIS TURN AND NOT YET SHIPPED. Paolo's
dispatch item 5: "I THINK I SAW ONE WATCH PERSON ON ACCIDENT ... THE CITY SEEMS
DEAD ASF AND I DONT LIKE THIS BEING THE DEFAULT." Measured on the real demo,
standing where day one starts, block 12,12, 06:00, at the shipped dial of 1:
    census in the player's own block             2 people
    census in the whole 3x3 around him           4 people
    bodies actually drawn on a 600 step walk     1
    the id of that one body        12:12:900, archetype "watch"
    the same block with the dial at 20          21 people
*** THE ONE PERSON THE ENGINE EVER DRAWS IS A WATCH, AND HE SAID HE SAW ONE
WATCH PERSON. The measurement and his sentence are the same body. ***
TWO PROBE MISTAKES WORTH KEEPING, both the same class: sweeping the dial 1 to 20
gave the identical number five times because PPL_PEOPLE is busted only by
rulesVersion() and the dial does not clear it (A PROBE THAT CHANGES AN INPUT THE
CACHE DOES NOT WATCH IS MEASURING THE CACHE); and sweeping the hours gave the
identical number at every hour, which is not yet explained and is UNMEASURED
rather than measured-flat. peoplePass has no cap of its own, so the draw budget
(dialCap = max(24, min(240, 24*dial)) = 24 at dial 1) is not the limit here and
raising the dial should reach the glass. STILL TO MEASURE BEFORE ANY NUMBER
MOVES: the hour, and the frame cost at 390x844, because dispatch item 7 is
performance and a livelier city must not be bought with the frame.
The row grants the number: "how many = mine to pick, he corrects." The module's
own landmarks are nobody 0 / today 1 / scale 1.1 / story 20 (GDD v5's ~69,000).
Second half of the row, research already banked, section 3 of
records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md: TIER 1, THE
FED. Ravens, rats, flies, single coyotes. "Set dressing that moves, and it is the
cheapest fix on this list for the loudest complaint on his list."

--------------------------------------------------------------------------------
PEOPLE (people-7h9sfy): 8/27 (a) -- *** THE DEMO HAS AN ENDING NOW, AND
IT ENDS ON A THING YOU ARE NOT ALLOWED TO SAY. TAB RUN in the demo build: sleep,
and day two does not come. Nothing to judge. ***

THE ROW NOBODY OWNED, in this file's own words: "BUILD -> DOOR -> ENDING ->
INSTRUMENT -> INVITE. The remaining three are RUN's: P0-DOOR, DEMO-END (the last
thirty seconds, which nobody has designed and which peak-end says is half of what
anybody keeps), and 0f the feedback card. NOBODY IS HANDED THE DEMO LINK UNTIL
ALL FOUR EXIST." The RUN lane has not shipped since 8/12, and DEMO-END is a
message from a person on a phone at the end of a day, which is this lane's whole
subject. TAKEN AND BUILT.

THE RESEARCH WAS ALREADY BANKED: PEAK-END (what a person keeps of an episode is
predicted almost entirely by the most intense moment and THE LAST ONE), DURATION
NEGLECT, and Zukowski from the other side (an ending is not neutral; ending with
no reason to come back actively hurts a demo). Plus the coordinator's finding on
his own ruled cut: BOTH PEAKS SIT IN THE FIRST FIVE MINUTES AND THE LAST THING
THE PLAYER FEELS IS GOING TO BED.

WHAT HAPPENS NOW. He taps SLEEP. DAY TWO DOES NOT COME. One message lands:
  LOURDES IBARRA / 06:00 . the phone, after
  "Light all night. Right through nine, past ten, past when I gave up waiting
   for it to go."
  "I still went out at nine. Forty years standing on that corner at nine
   o'clock, you don't stop just because the lights stayed on."
  "Nobody's said a word. Not one."
  "Was it you?"
     Tell them it was you     <- struck through, dead to the touch
  THAT IS AS FAR AS THIS GOES FOR NOW.
There is nothing to press.

IT ENDS ON A NOVERB ON PURPOSE. The corpus's most repeated craft finding is the
withheld verb, and the conversation shipped that grammar this week, so by this
screen he has met a struck-through line four times and knows what it means. The
last thing the demo does is ask him a question and take the answer away.

FIVE ENDINGS, because the quest already classifies its own day: #quiet, #notable,
#reckless, the author's own FAIL branch, and never having picked up. A LAST
MOMENT THAT IS THE SAME WHATEVER HE DID IS HALF OF WHAT HE KEEPS SPENT ON
NOTHING.

AND WHETHER IT SAYS THEIR NAME IS UP TO HIM, WHICH COST NOTHING: YOU HAVE TO ASK
(7/31) already governs names, so the header reads LINEMAN if he never asked and
LOURDES IBARRA if he did. The ledger he already wrote decides it.

THE WORDS WENT THROUGH THE VOICE CARD'S OWN RULERS AND FAILED FIRST. Rule 4 is
NINE WORDS THEN TWO; the gate calls 0.57 flat and offers 0.74 as its fixed
example. MY FIRST DRAFT MEASURED 0.27, every sentence between four and seven
words, in the file that quotes the card. Rewritten to 0.82 worst case, sentences
now running 1 to 31 words, zero banned phrases, four of five ending on a question.
The gate reads the banned list OFF voice_gate rather than re-typing it.

AND NOT ONE LINE MAY NAME A PRONOUN: the first cut said "Tell him it was you" and
the probe printed it under the header LOURDES IBARRA. THE CAST IS PROCEDURAL.
They/them, for everybody, with a claim that sweeps every line.

---- AND THE LAST TWO HUNDRED METRES, SAME TURN ----

The address got him to the block and then STOPPED BEING USEFUL AT EXACTLY THE
MOMENT THE WALK WAS FOR: a crowd, every one a stranger in a coat. So the line
gets finer on arrival, using the TELL the glass has printed since 8/13:
  "right here, by the big road . look for the one who will not answer while
   holding a certain thing, and is embarrassed about it"
A DESCRIPTION, NEVER AN ARROW. And the card finally says the CONFERRED half of a
role ("THE JOB SAYS: the one who knows the load"), computed since casting shipped
and shown nowhere: 58 of the corpus's 69 predicates already read as English and
the other 11 are machine flags, DROPPED rather than mangled.

*** AND THE FLAG NEVER ARRIVED, WHICH MY OWN GATE COULD NOT SEE. *** The city is
a separate document, so the shell pushed the demo flag on the city frame's `load`
event. MEASURED ON THE REAL DEMO BUILD: IT NEVER ARRIVED. That frame's
document.readyState is still "interactive" while the player is walking around in
it -- a four megabyte page whose load event is not a thing to wait on. AND THE
GATE WAS GREEN BECAUSE THE GATE POSTED THE MESSAGE ITSELF. A PROBE THAT SENDS THE
MESSAGE THE REAL SENDER IS SUPPOSED TO SEND IS STILL A SIDE DOOR. Third instance
this session, first one with a live bug behind it. Both halves fixed: the
DIRECTION IS REVERSED (the frame knows when it is ready and the shell does not,
so the city ASKS on boot and the shell answers), and THE GATE DRIVES THE REAL
SHELL (opens the demo page, taps the splash, reaches into the frame the player is
looking at, and asks it what it thinks it is). Measured: demo true, workshop
false. M34 breaks the shell's answer and turns 7 claims red.

ending_gate 26 claims (registered as ENDING); address_gate 41, section G added.
MUTATIONS: the demo flag ignored 6 RED (including a GET UP button where nothing
should be pressable); the withheld reply not drawn 1 RED; the tell not appended
1 RED.

AND THREE THINGS I GOT WRONG, WRITTEN DOWN:
 1. A CLAIM THAT COUNTED THE THING INSTEAD OF READING IT. The ending gate went
    green over a city carrying a stale copy still saying "Tell him it was you"
    after the module said "them", because the claim counted refusals instead of
    reading them.
 2. A git checkout THAT DELETED MY OWN WORK. Reverting one file to undo a
    mutation discarded traitWords, which was uncommitted. Restored by hand.
 3. A CLAIM ASKING FOR SOMETHING THE WORLD DOES NOT CONTAIN. "A stranger on the
    job's block gets no row" went red on a correct tree and passed on a broken
    one. ON EVERY ONE OF THE FIVE DEMO DAYS THE CAST PERSON IS THE ONLY CENSUS
    RESIDENT OF THEIR BLOCK; the apparent second body was the player's own
    authored NEIGHBOUR, which follows the probe around. So the mutation for it is
    observationally identical to correct behaviour, and THE GATE PRINTS THAT
    rather than pretending. The guard stays and becomes checkable the day a job
    block holds two people.

Record: records/BOHEMIA_THE_LAST_THIRTY_SECONDS_8_27_26.md

---- AND WHAT IT WAS BUILT ON ----

PEOPLE (people-7h9sfy): 8/26 (f) -- *** THE MAN THE QUEST WAS ABOUT WAS
TWO KILOMETRES AWAY AND NOTHING SAID SO. THE JOB HAS AN ADDRESS NOW. TAB RUN:
the objective line says which way to walk, and the number counts down. ***

THE MEASUREMENT THAT STARTED IT, from the block he wakes up on (a block is 384m):
  people within 3 blocks                  23
  of those, running with any outfit       ZERO
  nearest TRADES                          5 blocks (~1.9 km)
  nearest NETWORK                         6 blocks (~2.3 km)
Day one's quest demands faction=TRADES for its one REQUIRED role. So the person
that quest is about stood a two-kilometre walk from the front door, in an unnamed
direction, and NOTHING ON SCREEN SAID SO.

AND YESTERDAY'S FIX MADE IT WORSE WITHOUT EVER LOOKING WRONG: casting ran against
whatever block you stood on, so "the fixer" was a DIFFERENT PERSON ON EVERY BLOCK
and the row said so honestly ("on this block, that is them"). The sentence was
true and the thing it described was not a story. A QUEST WHOSE CAST CHANGES WHEN
YOU CROSS THE STREET IS NOT A QUEST, IT IS A MOOD. Nothing was red.

AND THE FIRST FIX WAS WRONG TOO, AND THE VALLEY SAID SO. One address per quest --
ring outward, take the nearest block that fills EVERY required role -- cast day 1
and day 2 and left days 3, 4 and 5 WITH NOTHING. The world was right: THREE
OUTFITS NEVER SHARE A BLOCK, which is what holding territory MEANS. So a quest
does not have an address. IT HAS ONE PER ROLE, AND GOING FROM ONE TO THE OTHER IS
THE JOB. Which is what the corpus already does: S07's dying woman is in the
church and the man who wronged her is somewhere else, and the walk is the quest.

EACH PART IS LOOKED FOR ON ITS OWN OUTFIT'S GROUND. Measured: 11 of 14 outfits
have a real member within 2 blocks of their base. Mutation M24 makes that a
number rather than a preference -- search from the player instead and TWELVE
CLAIMS GO RED, day 1 at 0/1, day 3 at 0/2, day 4 at 0/3, day 5 at 0/3.

ON THE GLASS: "Find why the block browns out · get inside somewhere the power is
out · 6 blocks south west, out by the houses", counting 3 -> 2 -> a block ->
"right here" as he walks. The lineman is on TRADES ground [8,18] and the fixer on
NETWORK ground [5,13]. 1 OF 81 BLOCKS CASTS ANYBODY. The card's hedge is gone.

WORDS, NOT AN ARROW, AND THAT IS RESEARCHED. Morrowind put directions in dialogue
and no marker on the map and what players remember is the valley; the marker games
trade that memory for the convenience and the writing shortens to match. Bohemia
is a city whose phones do not work, so a compass that always knows where everybody
is would be the strangest object in it. Ground words are a real attempt and his to
retype: industrial says "the workshops", suburb says "the houses", arterial says
"the big road", and an unwritten type still gives the direction.

address_gate, 33 claims, registered as ADDRESS. MUTATIONS: search from the player
12 RED; the cast not confined to its block 1 RED ("81 of 81"); the address not
appended 2 RED; the countdown hook removed 1 RED ("6 blocks ... 6 blocks" while
standing on the man); the cast not saved 1 RED.

AND A GATE I HAD TO REWRITE THE SAME WEEK I WROTE IT: casting_gate demanded
castBlocks > 5, which was right for a per-block cast and became A GATE DEMANDING
THE BUG BACK. It went red on the fix. A GATE MUST NEVER OUTRANK A RULING, FIX THE
RULER NEVER THE TARGET. The replacement is strictly stronger: not "several",
EXACTLY ONE, out of every populated block in the valley.

SAID OUT LOUD RATHER THAN PAPERED OVER: day 3 fills 1 of 2 required parts and day
5 fills 2 of 3, both because BLUES HOLDS GROUND WITH NOBODY ON IT (its base is on
the north edge, where 81 blocks hold 8 people). That is a world fact for the lanes
that own the world and the outfits. Handing those parts to a nearby stranger would
be exactly the fake this whole system refuses.

*** AND THE CLAIM THAT PROVES THE DESIGN FOUND A STUCK QUEST. *** The claim worth
writing was "finish with this one and the address moves to the next part". It went
RED the first time it ran: lineman (right here) -> lineman (right here). THE
LINEMAN'S CONVERSATION NEVER ENDED. The runtime reports `ended` only when a chosen
option runs out of graph, and A NODE WITH NO OPTIONS IS NEVER CHOSEN FROM, so it
never reports anything -- choose(0) returns the same view forever. The lineman's
scene finishes on exactly such a node ("Splits somewhere past the dead
storefronts. Warm cable."), so the scene stayed open for the rest of the game, the
entry node was never locked, and the address never moved on. MEASURED: 21 of the
corpus's 236 nodes are terminal like that; none pays anything today, so it was not
a farm yet, it was a farm the day somebody writes one -- and a visibly stuck quest
already. A NODE WITH NOWHERE TO GO IS THE END OF THE CONVERSATION. atEnd() says so
once, in the module, and both ways a scene can finish run through one ctConvFinish.
AND THE FIX HAD ITS OWN TRAP: closing on atEnd inside the choice handler would
lock the scene BEFORE that line was ever drawn, which is deleting a line the
author wrote. A real node is always rendered; only the graph running out of nodes
closes on its own. With it, measured:
  lineman (right here, by the houses) -> fixer (5 blocks north west, out by the big road)

*** AND THE WHOLE CONVERSATION FEATURE WAS GONE FROM MAIN WHEN I REBASED. ***
The resync read 96 embedded modules where there had been 97: one commit took 114
lines out of the walked city and 103 of them were engine/bohemia_conversation.js,
while every call site stayed put. So BohemiaConversation was called three times
and defined nowhere, every call threw, the bare catch turned every throw into
null, and NULL IS THE HONEST ANSWER FOR ALMOST EVERYBODY -- so the symptom was
people having nothing to say. Nothing on screen, nothing in the console.
conversation_gate went 24/12. THE GATE CAUGHT IT AND THE FILE DID NOT.

AND THE STRUCTURAL CAUSE IS MINE. I parked that module immediately above another
module's banner ON PURPOSE the same morning, because the resync finds a module's
END by scanning for the next banner and a module above ordinary code has no end
(measured: a 50,917-byte cut against a 5,002-byte module, correctly refused).
That placement made the resync safe and made this module THE THING THAT GETS
SWALLOWED WHEN ANY TOOL CUTS THE MODULE BELOW IT. A PLACEMENT THAT MADE ONE TOOL
SAFE MADE ANOTHER TOOL DANGEROUS.
Three structural fixes, not a re-paste: (1) the module DELIMITS ITSELF, same
banner top and bottom, so a boundary scan ends at the right byte wherever it is
parked; (2) the patch tool REPAIRS instead of no-opping on its own marker -- it
checks the module's own banner now, and cutting the 5,119 bytes out again and
re-running brings the file back BYTE-IDENTICAL; (3) a missing module SAYS SO,
once, by name, with the command to fix it. NULL IS A REAL ANSWER HERE, WHICH IS
PRECISELY WHY IT MAY NEVER ALSO BE THE ERROR ANSWER.
The words that commit shipped are good and every one of them is kept. This is
about where a file sits, not about what anybody wrote.
conversation_gate is 39 claims now: the module is in the file the game loads, its
body is the canon body byte for byte, and a missing one is loud.

*** AND A FUNCTION WHOSE JOB WAS ABSORBED IS AN ORPHAN, NOT A SPARE. ***
organ_reach went red on BohemiaPeople.castQuest: nothing on the walked surface
called it any more. It cast every role against ONE roster, which was right while a
cast meant "who is on the block under your feet" and wrong the moment a quest got
an address per role. Keeping it would have meant the REQ-FIRST ordering and the
ONE-PERSON-ONE-PART dedupe written down in TWO PLACES, which is the bug this lane
has now paid for four times in a week. DELETED, and every claim written against it
still runs -- pointed at castAddresses with a ONE-BLOCK WORLD, so the hard-won
ones (a block of ONE person proves the dedupe; one body proves REQ beats OPT) now
exercise the code the game actually runs. organ_reach 7/1 -> 8/0, NO EXEMPTION
ADDED, because an exemption would have been a shrug.

*** AND THE FRONT SPLASH HAD A MERGE MARKER ON IT, LIVE ON MAIN. *** One line
under the build stamp: ">>>>>>> 7333cce (0 FOR 8. I CHOSE FOUR VOICES FROM A GAP
LIST...)". The conflict resolution that left it had eaten the "<!--" opening the
comment underneath, so THAT MARKER AND THE WHOLE COMMENT AFTER IT WERE RENDERING
AS VISIBLE TEXT ON THE FRONT SPLASH OF THE ONE LINK HE TAPS. Not my commit (my own
push four hours earlier had zero markers) and not my lane, but it is the front
door -- and the comment it broke is the one that says "Twice on 8/2 a lane
updating the build stamp above ate it... Both times it reached main." IT HAPPENED
A THIRD TIME. One line restored, BLOB INTEGRITY 106/1 -> 107/0.

Record: records/BOHEMIA_THE_JOB_HAS_AN_ADDRESS_8_26_26.md

---- AND WHAT IT WAS BUILT ON, SAME DAY ----

PEOPLE (people-7h9sfy): 8/26 (e) -- *** THE GAME HAS A CONVERSATION NOW.
FIVE HUNDRED WRITTEN LINES WERE IN THE REPO, PARSED, AND MUTE. TAB RUN: walk up
to the person the job wants, press the objective, and they talk to you. ***

COUNTED BEFORE ANYTHING WAS BUILT, across quests/bq:
  27 quest files · 236 @TALK nodes · 504 @SAY lines · 558 @OPT choices · 59 @NOVERB
bohemia_bq.js parses every one. bohemia_quest_runtime.js PLAYS every one --
available/begin/view/choose have been finished and correct since the day they
were written. AND NOTHING HAD EVER RENDERED ONE. The demo day loop binds stages
to WORLD EVENTS, so a quest spoke through the phone and the journal and NEVER
THROUGH A MOUTH. Paolo 8/11: "I HAVE A WHOLE 170 QUEST FILE WITH DIALOGUE."

WHY TODAY AND NOT YESTERDAY: a node's speaker is a @ROLE NAME, and this morning
a role became a person. speaker -> role -> cast -> key -> the card that is open.
That is why both halves shipped the same day; neither is worth much alone.

ON THE GLASS, MEASURED: the button says "Find why the block browns out" (THE
QUEST'S OWN OBJECTIVE, verbatim -- 52 of the 62 entry nodes have an @OBJ aimed at
their own speaker). Press it and three written lines are on screen, four of the
quest's own choices under them, and the @NOVERB -- "Tell me who runs the
network" -- struck through and DEAD TO THE TOUCH. Answer and the quest moves 10
-> 20.

THE NOVERB IS NOT DECORATION. Seven of the CONVERSATIONS MASTER's marquee nodes
(the Baron, Hildern, the Whodunit survivors, Jefferson Peralez, the Strange Man,
Brisby, Shadowheart) are remembered for THE THING THE GAME WOULD NOT LET YOU SAY.
A WITHHELD VERB NOBODY CAN SEE IS NOT WITHHELD, IT IS MISSING. And a TRAP is
never marked: view() says trap:true and the glass ignores it, because a trap you
can see is not a trap.

THE ONE THAT WOULD HAVE SHIPPED AS A SILENT BUG: ZERO @LOCK exists in the whole
corpus, and available() filters on nothing but state.locked -- so every entry
node re-opened forever. Swept 218 option paths: replaying a scene DOUBLES the
numbers (CARTEL 10 -> 20, TRADES -8 -> -16, BLUES 12 -> 24). Standing you can farm
by pressing one button twice. Locked when the graph ends, using the runtime's own
field, which the save already carries. WALKING AWAY DOES NOT LOCK IT -- begin()
runs once, rt.view() holds the node, so you come back to the sentence you left.

AND THE NARRATION SEAM, WHICH NOBODY WOULD HAVE SEEN GO WRONG: a chosen @OPT can
carry @DO set_stage, which has ALREADY run by the time the UI asks. Narrating it
with the day loop's _toStage would RUN THE STAGE AGAIN -- every bond twice, every
faction move doubled, nothing on screen to show it. D.spoke() reports what
happened and makes nothing happen. MY FIRST VERSION OF THE CLAIM GUARDING THAT
WAS AIMED ONE STEP TOO LATE (it measured the second narration, which the
watermark already refuses) and the mutation walked straight past it, green.

AND A SECOND DEFECT, FOUND BY TRACING RATHER THAN BY LOOKING: day one's spec says
choiceAt: 20, and the first answer in the conversation REACHES stage 20 -- so the
day's RESOLUTION card would have thrown itself over somebody still mid-sentence.
Two decisions on the glass at once, the second answering a question the first had
not finished asking. Nothing was red and I did not see it; I found it by reading
the day-one spec next to the .bq and noticing the two numbers were the same
number. DQ.pending ALREADY holds that card, so nothing new stores it: it waits
for the scene to end. ONE DECISION SURFACE AT A TIME.

conversation_gate, 36 claims, registered as CONVERSATION. MUTATIONS: noverbs
deleted 2 RED; lock deleted 2 RED; narrate-by-re-running 1 RED ("stage 20 ran 2
time(s), was 1"); the cast ignored 2 RED; the spoken lines deleted 2 RED; the
card hold dropped 1 RED ("day card up: true").

AND TWO CLAIMS THAT PASSED ON AN EMPTY SCREEN before I caught them: both were
[].some(...), which is FALSE ON AN EMPTY LIST, so both were green on a card with
nothing drawn. Third time this week. A CLAIM HAS TO BE BUILT SO THE RULE IT NAMES
IS THE ONLY THING THAT CAN MAKE IT PASS.

AND A TOOL REFUSED TO WRITE, CORRECTLY: the city inlines its engine modules and
the resync finds a module's END by scanning for the next module banner. Parked
above ordinary code the new module had no end -- the cut came out 50,917 bytes
against a 5,002 byte module and the tool refused. That guard was added 8/20 after
this same file lost 1,159 lines to a bad cut. It just earned its keep. The module
is parked immediately above another banner now.

STILL NOT CLAIMED: the PLACE half. And the world events STILL WORK -- this is a
second door into the same quest, not a replacement. You can get there by talking
or by walking, which is more game, not less.

AND THE DEMO WAS STALE, WHICH WAS MINE: the demo is a CUT of the workshop, so
changing the workshop's stamp leaves it behind and DEMO BUILD goes red. Re-cut
(16 dev tabs removed, one RUN tab kept), 25/0. AND THE DEMO LOADS THE SAME CITY
FILE BY NAME, so the conversation is in the demo build too, with no extra work.

FULL SUITE: 437 gates, 3246s, 36 red. NONE OF THEM MINE, checked by name rather
than assumed: CASTING, CONVERSATION and LANGUAGE all green in the pack.
QUEST PLACEMENT names its own stale modules and they are bohemia_wash.js,
bohemia_railyard.js and bohemia_world.js -- WORLD's, one command, theirs.
GRAVEYARD's 10 live references are all in records/BOHEMIA_VERDICT_HAIR_ROUND4_
8_20_26.txt -- CHARACTER's. TASTE names three cook files, DEAD CODE names legend
codes, TOP OF THE DOC names the RF4 thesis row, NO BULLSHIT Qs names the
coordinator's 8/25 demo record. FULL RES, MOTION VISIBLE, WALK DEADLOCK and
RENDER PIXEL are the standing reds this handoff already lists. MIX did not
reproduce alone.

Record: records/BOHEMIA_THE_CONVERSATION_HAS_NEVER_BEEN_PLAYED_8_26_26.md

---- AND THE HALF THAT MADE IT POSSIBLE, SAME DAY ----

PEOPLE (people-7h9sfy): 8/26 (d) -- *** NOBODY IN THIS VALLEY WAS EVER
THE LINEMAN. A QUEST ROLE IS A PERSON YOU CAN WALK UP TO NOW. TAB RUN: walk up
to somebody and the card says what the job wants them for. ***

HIS PLAYTEST DISPATCH, ITEM 2: "THE QUESTS ARE SO BAD AND NOT WIRED TO ANY
LOCATIONS OR PEOPLE IN THE CITY." Demand-side, not [PENDING]: "A QUEST THAT IS
NOT ATTACHED TO A PLACE AND A PERSON IS NOT A QUEST."

THE CITY SAID SO ITSELF, IN A COMMENT: "SCAFFOLD -- the casting. The real system
casts @ROLE against people who actually exist in the world and places the quest
where they are. This binds stages to WORLD EVENTS instead." So `@ROLE lineman REQ
faction=TRADES` resolved to the STRING "lineman". A COMMENT THAT ADMITS A GAP IS
NOT A GATE THAT FAILS ON IT.

THE DESIGN CAME OUT OF COUNTING THE ROLES, NOT GUESSING:
  faction=X            53 uses across the nine canon quests   THE WORLD ANSWERS IT
  ~60 other predicates  1 use each (keeps_the_tunnel, reads_the_sky,
                        found_the_stairwell, speaks_for_the_crew...)
The faction is MATCHED. The one-offs are CONFERRED: the quest does not hunt for
somebody who already keeps the tunnel, it makes the person it cast INTO the one
who keeps it. That is the only reading that does not require inventing sixty new
simulation facts.

MEASURED FIRST: 2,661 people walked, 204 affiliated (7.7%), 11 of 13 outfits with
real people on real ground, 2 (REDS, BLUES) with nobody -- and NULL is the honest
answer for those rather than putting a stranger in an insider's part.
The FIRST sweep read ZERO of 1,282 and that was MY WRONG FIELD, not the world:
the city derives affiliation through its own bridge, not off the record. Checked
before filing rather than after.

ON THE CARD, MEASURED: "THE JOB: The Meter Reader wants the fixer. On this block,
that is them." over Clemencia Munoz, whose RUNS WITH row says NETWORK, which is
exactly what the fixer role demands. THE GATE'S STRONGEST CLAIM IS THAT
CROSS-CHECK: printing "wants the fixer" over somebody whose own card says CARTEL
would be worse than no row at all.

WHAT IT DOES NOT CLAIM, SAID PLAINLY: THE PLACE HALF. bohemia_loop.js
castTarget() has picked a real district cell for each quest SINCE 7/26 and the
demo day loop binds to world events instead. That wiring is the day loop's job.
The row says "on this block" because that is exactly what it is. ITEM 2 IS NOT
CLOSED and this gate does not pretend it is.

casting_gate, 27 claims, registered as CASTING. MUTATIONS: the faction demand
ignored 5 RED (including 576/576 blocks casting, which is the tell); the dedupe
deleted 2 RED ("part_a, part_b from a block of one person"); the card row deleted
2 RED.

A DEFECT IN MY OWN WORK, FOUND BY THE MUTATION: the cast was cached on hx,hy and
the roster LENGTH, so taking one step re-cast the quest. Harmless while the pool
is two or three people, and NOT harmless the moment the roster shifts: the person
whose card you opened stops being the one the quest wants, mid-conversation. A
CAST THAT MOVES WHILE YOU WALK TOWARD IT IS NOT A CAST. Keyed on the block now.

AND TWO VACUOUS ATTEMPTS AT ONE CLAIM: "one person never holds two parts" passed
with the dedupe DELETED, twice -- first because two different factions cannot
collide, then because nine eligible people land apart BY LUCK. It takes a block
of ONE person for the dedupe to be the only thing that can make it pass. A CLAIM
HAS TO BE BUILT SO THE RULE IT NAMES IS THE ONLY THING THAT CAN MAKE IT PASS.

Record: records/BOHEMIA_NOBODY_WAS_EVER_THE_LINEMAN_8_26_26.md

WHAT COMES NEXT FOR THIS LANE:
  0. [DONE, same day, see 8/26 (f) above] THE ADDRESS.
  1. [DONE, same day, see 8/26 (e) above] THE CONVERSATION.
  2. The CONFERRED traits are computed and shown nowhere. roleTraits() already
     returns "keeps_the_tunnel", "reads_the_sky", "found_the_stairwell" -- the
     most interesting sentence a quest ever writes about a stranger -- and the
     card prints only the role name. One row, big payoff, cheap.
  3. [DONE 8/26 (f)] THE SECOND SPEAKER now has its own address: the fixer sits
     on NETWORK ground and the objective line points at whichever part the quest
     is ready for, because ctJobRole reads the runtime's own available() rather
     than picking a role itself.
  3b. BLUES HOLDS EMPTY GROUND and it costs two demo days a required part (day 3
     1/2, day 5 2/3). NOT MINE: that is where a faction's base sits and how many
     people the north edge carries. FACTIONS or WORLD, one dial each.
  3c. NOT MINE, AND RED ON MAIN RIGHT NOW: gates/dayloop_gate.js lines 85 and 124
     hardcode S01's OLD @LOG strings ("The block loses half its light at the same
     hour every night." and "Put the current back myself..."), and the WORDS lane
     rewrote both on 8/27. Two claims red. It is their content and their claim,
     and the fix is the repo's own principle -- read the .bq instead of pinning
     today's answer -- so it is one line each and theirs to make.
  4. saw:/heard: reactions stay dark: 66 written lines, 0 reachable, because the
     city's deeds carry no clout tag. That is the deeds system's field to set,
     not a lines problem, and it stays a handoff row rather than my next turn.
  5. NOT MINE, and flagged rather than claimed: THE PLACE HALF of item 2.
     bohemia_loop.js castTarget() has picked a real district cell since 7/26 and
     engine/bohemia_quest_placement.js already ranks better candidates per quest.
     The demo day loop still binds to world events. Day-loop lane's call.
  6. NOT MINE: the WORDS lane opened today and owns HOW IT SOUNDS. Everything
     above is WHO SAYS IT and WHERE. Every line this turn put on screen came out
     of a .bq file byte for byte; not one word of dialogue was written here.

---- PREVIOUS (8/26) ----
*** HE TOLD ME TO STOP. THE SPANISH
FEATURE IS CLOSED, THE DIAL IS DOWN TO HIS NUMBER, AND THERE IS NOW A GATE THAT
FAILS IF ANYBODY WRITES ANOTHER REGISTER LINE. NOTHING TO JUDGE. ***

HIS WORDS, 8/26, LOCKED:
  "bro you so obsessed with this spanish shit bro like wtf. we have a whole
   fucking gameand you spending rounds on this spanish shit enough is enough it
   will be proportional to vegas demographics and maybe slightly less but yeah man."

I SPENT THREE CONSECUTIVE TURNS ON LANGUAGE. Every one was defensible on its own
-- real bugs, real measurements -- and the SUM was a third of a day on flavour
while the demo he names in the same sentence sat still. STOP PRODUCING (7/26)
says a second rejection ends a feature, and no rejection counter tripped because
HE WAS NOT REJECTING THE WORK, HE WAS REJECTING ITS SHARE OF THE PROJECT. That
failure mode had no name, so it has one now:
  *** A FEATURE NOBODY ASKED TO CONTINUE IS FINISHED WHEN ITS FIRST TURN ENDS.
  Finding a real bug inside a shipped feature is a HANDOFF ROW, not permission
  to spend the next turn there. ***

THE DIAL, WHICH IS HIS AND WHICH HE JUST SET:
  Clark County, measured    18.5%   (418,475 of 2,265,461)
  what shipped 8/25         18.5%   proportional ON THE NOSE
  his ruling                proportional OR SLIGHTLY LESS
  now                       15.0%   (spanglish 11.8, poor-english 3.2) = 81%
Blend re-derived so the two block mixes still average to it: BARRIO 565/330/105,
REST 960/36/4. PROPORTIONAL IS THE CEILING NOW, NOT THE TARGET.

THE GATE IS A CAP ON DOING MORE WORK, which is unusual and is the point: a
FEATURE CAP is the only shape of check that catches enthusiasm. 532 register
lines, pinned. Add one and it goes red and prints his instruction. Raising it
needs a ruling from him NEWER than 8/26 with the quote beside the number.
MUTATIONS: +5 register lines 1 RED naming the law; the dial pushed back to
exactly proportional 1 RED ("185.3 per 1000 vs the county's 185").

*** DEAD, DO NOT REVIVE: "does your family speak Spanish at home in the cold
open?" I asked it three times. This message is the answer -- he does not want the
turn spent there. Struck from the queue. *** Also dead without a new ruling:
register lines for the quests, the scenes, the exchanges, the asking table.

AND A SEVENTH PIN-TODAY'S-ANSWER: the name-independence claim hardcoded 0.185,
so the moment he dialled the valley to 15% every name read as 3.5 points skewed
and it went red on ARITHMETIC, not on correlation. It reads the base off the dial
now and thinks in STANDARD DEVIATIONS, not points (measured: 1 sd = 1.21pt,
worst of 64 names 3.90pt = 3.2 sd, which is exactly noise).

language_gate 76 -> 81. CLAUDE.md carries the cap directly under the spanglish
entry, because a session that reads THEY SPEAK SPANGLISH and stops reading is
exactly how this comes back.

WHAT COMES AFTER, AND IT IS NOT LANGUAGE: this lane's demo-facing work is the
walked city's people, and the thing measured but NOT chased is that saw:/heard:
reactions still cannot fire -- the city records faction deeds with no clout tag,
so the four loudest reaction buckets (what somebody WATCHED you do) are dark. It
is a row, not a turn, and it waits its turn behind whatever the demo needs.

Record: records/BOHEMIA_NOBODY_IN_THIS_VALLEY_SPOKE_SPANISH_8_25_26.md
Law: laws/BOHEMIA_ADDENDUM_ENOUGH_IS_ENOUGH_ON_THE_SPANISH_8_26_26.md

---- PREVIOUS (8/26) ----
*** 66 REACTION LINES, 1,208 PEOPLE
WALKED, ZERO REACHABLE -- AND EVERY AMBIENT BARK IN THE VALLEY HAD BEEN ENGLISH
ALL ALONG. BOTH FIXED. TAB RUN. ***

MEASURED FIRST, AS ALWAYS:
  reaction lines authored       66
  people walked in the city   1,208
  reachable through the city      0
linesFor() tries REACTIONS first -- what somebody says BECAUSE OF WHAT YOU DID --
and the city's one call passes barkOpts(), which returned at/faction/when and
never a single reaction key. SOMEBODY WHO HAD KNOWN YOU FOR A MONTH OPENED WITH
THE WEATHER.
THIS IS THE BUG reaction_reach_gate WAS WRITTEN FOR, IN THE OTHER FRAME. It was
found and fixed in BOHEMIA_RUN_CURRENT.html -- the panel behind p-run, which the
RUN tab does not show. The fix landed in the frame nobody looks at.

*** AND THE WORSE ONE, ONE LAYER DOWN. *** barkOpts is handed a POPULATION
RECORD (id, ns, nx, ny, zone, home, look, face...) and there is no `lang` on it.
linesFor reads the register off person.lang. So EVERY AMBIENT BARK IN THE WALKED
VALLEY DEFAULTED TO ENGLISH while the card, the quirk line and the engine all
spoke in register.
THE CLAIM THAT SAID OTHERWISE WAS MINE AND IT WAS A SIDE DOOR: it tested
linesFor(ctPerson(...)) -- a person I built -- and the city calls
linesFor(RECORD, barkOpts(RECORD)). THIRD SIDE-DOOR PROBE IN TWO DAYS, identical
shape every time: I ASKED THE ENGINE A QUESTION THE SURFACE NEVER ASKS IT.

BUILT: barkOpts carries met (the ledger's own bucket choice), rung (the same
ctOpinionOf the card prints as THEY THINK) and lang (via ctPerson, ONE
derivation). Reactions 66 -> 196 lines, 19 -> 57 buckets, all three mouths.
linesFor gets a react() helper beside bucket(), register first, English fallback.
Lexicon 224 -> 277 words, still ONE closed set, now checked by THREE factories.
WORDS tab 2,442 lines (273 spanglish, 259 poor-english).
LEFT OUT ON PURPOSE: saw:/heard: are keyed by CLOUT CLASS and the city's deeds
are faction deeds with no clout tag. Inventing one would be inventing a fact
about the player, so those two stay dark and the tool says why.

*** THE ONE I NEARLY SHIPPED, CAUGHT BY THE SHAPE OF A NUMBER. *** First wiring
gave 0 -> 3 reachable. THREE IS THE TELL. metState() answers 'first' for a person
with NO RECORD, so all 1,208 strangers matched met:first and three lines
outranked every role, act, faction and weather bucket in the game. A REACTION IS
ABOUT HISTORY: gated on the ledger it went 0 -> 27, nine lines x three mouths,
and met:first still fires at the right moment.

MUTATIONS: the whole context block removed (the six-week state) 3 RED, one
printing NOT ONE REACTION LINE IS REACHABLE; met passed for people with no record
(the version I nearly shipped) 1 RED, "57 reaction lines from 19 people nobody
has met".

TWO TOOLS WERE ALREADY BROKEN AND NOBODY KNEW: bohemia_reaction_factory REFUSED
TO RUN AT ALL because CLOUT_WEIGHTS moved to bohemia_clout.js and the loop only
re-exports it -- POINTING A TOOL AT A RE-EXPORT IS THE SAME MISTAKE AS RETYPING
THE TABLE. And its key validator called 26 correct buckets alien for the same
reason the other two gates did.

SIXTH PROBE ERROR CAUGHT BEFORE FILING: the stranger claim reported 36 reaction
lines from 31 unmet people. It was counting the one person the block above had
opened a card on, once per overlapping spawn radius. THE CLAIM WAS WRONG, NOT
THE CODE.

language_gate 71 -> 76. Deploy of the previous ship CONFIRMED: a61e3f8 pages
SUCCESS, and 97bdffc7 carries the handoff too.

WHAT I WOULD DO NEXT: every quest speaker is a TRADE, not a name (keeper,
lineman, hauler, clerk, pastor, medic, midwife...), so the law's reservation on
NAMED story people does not block the 504 quest lines at all. The four Act 1
SCENES do have `mother` and `sibling_older` in them and those are his.

Record: records/BOHEMIA_NOBODY_IN_THIS_VALLEY_SPOKE_SPANISH_8_25_26.md
(addendum 3 at the bottom).

---- PREVIOUS (8/26) ----
*** THE LINE SOMEBODY SAYS TO YOUR FACE
WHEN YOU ASK THEIR NAME WAS THE LAST MONOLINGUAL ONE IN THE GAME. 44 -> 132
LINES. TAB RUN: walk up, tap TALK, tap ask, and they answer in their own mouth. ***

THE THING THAT WAS BACKWARDS: the ambient barks you overhear FROM ACROSS THE
STREET got registers in the morning. The person standing in front of you did
not. The quirk line is the FIRST true thing you ever learn about one specific
human (Q014.W9) and it arrives through the game's only social verb, so it was
the worst possible line to leave in one language.

MEASURED ON THE REAL CARD, IN THE WALKED CITY, ONE PER REGISTER:
  en  I'll write it. I don't say it, I write it. Give me a second, I'm using a
      drink token from a floor that closed.
  sg  Give me a minute, estoy doing the pump house at the end of the row. Nobody
      asked me. Somebody has to y nadie asked me.
  es  What day is today. No. Not tell me. I take it from reading the expiry dates
      out loud. Like this I know. I am never wrong.
Register 3 carries NO SPANISH AT ALL and that is the craft rule working: poor
English is GRAMMAR, not vocabulary. The gate checks it for being DIFFERENT, not
for carrying Spanish, because demanding Spanish there is demanding the cartoon.

304 quirks x 2 lights x 3 mouths = 1,824 utterances. WORDS tab now holds 2,312
lines (208 spanglish, 194 poor-english), every one draft and editable.

ONE LEXICON, TWO MOUTHS, ONE CHECKER: the quirk factory does NOT keep its own
word list. It imports the bark factory's and refuses to write a Spanish word
that is not in the shared closed set (188 -> 224 words, each with its English
meaning). A second lexicon is a hole straight through the hard rule. The
register twins also run the SAME grammar contract as the English ones, which
caught one of my own 88 lines before it shipped.

*** THIRD TIME THIS LANE PAID FOR TWO COPIES OF ONE RULE. *** The Python side
learned that a LEADING apostrophe is a quote mark and not a clitic ("'He turn."
opens a spoken line) and was fixed there; the gate had the same rule typed out
again, did not learn it, and went red on those exact two lines. esStems() now
ships from the factory into the engine and BOTH call it. Two tab switchers with
one routing rule, a generator and its output, now a tokenizer: WRITING THE RULE
DOWN TWICE IS THE BUG, EVERY TIME.

AND A PROBE THAT REPORTED "NO SUCH THING" WHEN IT HAD NEVER LOOKED: the first
run of the new claims came back all empty. The block above them leaves a card
OPEN and ctVerb() correctly hides the one button while a card is up, so the loop
found the button hidden on every person and measured nothing. A probe that
cannot reach its subject reports the same thing as a broken feature.

MUTATIONS: the two call sites stop passing the register (the state that shipped
this morning) 1 RED printing the English line the Spanglish person would have
said; one "spanglish" line replaced by its English twin, THE FACTORY REFUSES TO
WRITE and names it.

THREE GATES WENT RED AND ALL THREE WERE MINE TO TEACH, not to work around:
quirk_gate compared the card against the English table (it asks for the person's
own mouth now, and counts 132 authored lines instead of 44); dialogue_catalogue
_gate's INDEPENDENT line counter did not know the register lines existed, book
2,312 vs counted 2,224, which is exactly the claim that must never drift; and
organ_reach RULE 3 fired on a STALE EXEMPTION and was RIGHT -- cardFor is on the
surface now so its entry had to go, which is the whole reason that allowlist is
a ledger and not a hiding place. 39/0, 63/0, 8/0.

STAMP COLLISION, AND THE RIGHT RESOLUTION: COMBAT took 8/26c while I was
verifying, so I took 8/26d. Keeping mine would have put TWO DIFFERENT BUILDS ON
ONE STAMP, which is worse than a stamp going backwards -- he would have no way
to tell which one he has. Read main's stamp at the LAST moment, not the first.

VERIFIED on the merged tree, twelve gates and 552 claims: LANGUAGE 71/0,
PEOPLE 158/0, CARD FOLD 18/0, CITY MEMORY 34/0, CITY BARKS 13/0, TIES 40/0,
INTRODUCTIONS 46/0, REACTION REACH 17/0, THE WHOLE DEMO 23/0.

Deploy of the previous ship CONFIRMED: 7610790 pages run SUCCESS, and it carries
b62d42a (the card fix). Note b62d42a's OWN run shows `failure` with its deploy
job never leaving `queued` -- that is the SUPERSEDED shape, not a broken build,
and it is why the rule is "a run whose sha CONTAINS your content".

WHAT I WOULD DO NEXT: the four Act 1 scenes and the nine canon quests are still
monolingual. Those are the demo's actual story words. The law reserves WHICH
NAMED STORY PEOPLE sit in which register as HIS, and I put that question to him;
the UNNAMED voices in those scenes are mine to draft either way.

Record: records/BOHEMIA_NOBODY_IN_THIS_VALLEY_SPOKE_SPANISH_8_25_26.md
(addendum 2 at the bottom).

---- PREVIOUS (8/25) ----
*** HIS SPANGLISH RULING REACHED THE
ENGINE AND STOPPED ONE FRAME SHORT OF HIM, AND MY OWN GATE WAS DEFENDING THAT.
FIXED. TAB RUN: walk up to somebody, tap the one button, the card now says what
they speak. ***

NOBODY HAD EVER WALKED UP TO A PERSON AND TALKED TO THEM INSIDE THE ALPHA. Every
gate this lane owns drives the city STANDALONE or reads files; four boot the
alpha and none of them opens a person card. That is SWEEP 13 word for word and
it is the shape that made the vista bug.

So I drove it the way a friend will: open the alpha, tap the splash, decline the
opening, get up, stand next to the neighbour, tap the button. The card said
  NAME / LIVES / RIGHT NOW / YOU HAVE MET / HOW YOU GET THE REST
NO SPEAKS. The walked city does not call cardFor -- it builds its card ROW BY
ROW, and organ_reach_gate has said so in writing for days. I read that exemption
this morning and did not connect it.

*** AND THE CLAIM THAT SHOULD HAVE CAUGHT IT WAS MINE. *** language_gate's "the
card on the surface he taps says what they speak" called cardFor() FROM INSIDE
THE CITY FRAME. Standing in the right frame made it look like the real surface.
Green, true, and about a different card. A PROBE STANDING INSIDE THE RIGHT FRAME
IS STILL A SIDE DOOR IF IT ASKS THE WRONG FUNCTION. It taps #cttalk and reads
#ctcard.innerText now -- the text on the glass.
A SECOND ONE, same shape, found while fixing the first: the file check looked for
cardFor's `label: 'SPEAKS'` in both shipped frames and passed for both, because
the CITY frame carries an inlined copy of cardFor containing that string in a
function it never runs. Each frame is checked against the code that draws ITS
card now.

THE HARD RULE IS PROVED ON PIXELS NOW, not on strings in a file:
  the ONE BUTTON   "TALK TO THE WATCH"                      0 Spanish words
  the card         WATCH | NAME | YOU HAVE NOT ASKED | SPEAKS | ENGLISH | ...
                                                            0 Spanish words

language_gate 63 -> 67. MUTATIONS: the SPEAKS row taken off the city card (the
exact state that shipped this morning) 3 RED printing the card that is missing
it; the one button made to say HABLA CON THE WORKER 1 RED naming the string.

A PROBE ERROR CAUGHT BEFORE IT WAS FILED: the first run said the TALK button was
INVISIBLE while standing next to somebody, which would have been a demo blocker.
It was my probe -- ctVerb() runs on render and I had moved the player by setting
coordinates instead of letting the world draw. Fifth one caught this way across
two sessions, none filed.

CARD GATES HELD after adding a row to a height-capped card: CARD FOLD 18/0,
CITY MEMORY 34/0, CITY BARKS 13/0, QUIRK 39/0, TIES 40/0, INTRODUCTIONS 46/0,
FAVOUR 31/0, STREET EXCHANGE 32/0, CLAIM 45/0, COMMITMENT 72/0, BELONGING 58/0,
CITY DEEDS 43/0, CITY DIAL 22/0. Twelve gates, 428 claims, zero failures.
THE DEMO STILL PLAYS on the surface I changed: WHOLE DEMO 23/0, DEMO 23/0,
OPENING 63/0, FIRST NIGHT 55/0.

*** FOR WHOEVER SHIPS NEXT, AND IT IS NOT MINE TO FIX (SHARED/COORDINATOR):
THE PAGES QUEUE IS BACKING UP AGAIN. Three pushes landed in SEVEN minutes
(15:35, 15:36, 15:42 UTC) and at 15:50 there were TWO runs still queued with one
marked failure -- 78dedf2, whose deploy job never left `queued` while the run
was recorded as failed. That is the SUPERSEDED shape, not a broken build: with
cancel-in-progress:false the RUNNING deploy is protected but a PENDING one is
still replaced by a newer push. The 8/6 measurement was ~13 minutes between
pushes; today it is closer to three. A failed pages run is not automatically
somebody's bug, and the link is only true once a run whose sha CONTAINS your
content concludes SUCCESS. Mine (b62d42a) was still queued when this was
written -- pushed and correct on main, not yet confirmed live. ***

WHAT I WOULD DO NEXT: the four Act 1 scenes and the nine canon quests are still
monolingual English -- the demo's actual story words. The law reserves WHICH
NAMED STORY PEOPLE sit in which register as his, so the unnamed voices in those
scenes are the part that is mine to draft.

Record: records/BOHEMIA_NOBODY_IN_THIS_VALLEY_SPOKE_SPANISH_8_25_26.md (addendum
at the bottom).

---- PREVIOUS (8/25, same day) ----
*** NOBODY IN THIS VALLEY SPOKE
SPANISH, AND THE FIRST TIME THEY DID, THE WALKED CITY TURNED THEM ALL BACK INTO
ENGLISH. HIS SPANGLISH RULING IS BUILT AND MEASURED ON THE GROUND. TAB RUN
(walk up to somebody: the card says what they speak, and their lines come out in
it) AND TAB WORDS (every line, tagged, editable). ***

HIS RULING 8/25, LOCKED: "make them speak spanglish for our game i like that.
have it very poor english ro spanglish to give it that flavor ty". It had a law
and no machine. LANG-1 was routed to this lane by sweep 15 and was unstarted.

WHAT WAS THERE: this module's own comment has said since 7/31 that an all-Anglo
name pool "would be a lie about Las Vegas", and that finding reached ONE system,
the surname pool. The lane's shipped proof character is RUBEN NGUYEN and Ruben
Nguyen spoke flawless monolingual English, because everybody did.

LANG-1: three registers off a THIRD independent stream from the identity key,
nothing stored. THE ARITHMETIC IS IN THE OPEN in the code so it can be checked:
418,475 Spanish speakers 5+ / 2,265,461 residents = 18.5%; 45% speak English
less than "very well"; register 3 is the "not well/not at all" end, ~half of
that, AND THAT HALF IS DECLARED AS MY ESTIMATE.
  target   en 815  spanglish 144  es 41   per 1000
  derived  en 815  spanglish 144  es 41   over 126,000 people, 3,000 blocks
AND IT CLUSTERS, which is what makes it a mechanic: 139 of Clark County's ~500
tracts are limited-English ground, so 27.8% of blocks run a different mix and
THE TWO AVERAGE BACK TO THE COUNTY to the nearest tenth of a percent. Top decile
of blocks 57% Spanish, bottom decile 2%.

THE WORDS: 244 -> 558 lines, 58 -> 152 buckets. Every role x act, every
situation, six factions, in both registers, each citing the questbook (Q036.W1,
Q129.W6, Q030.W8, Q075.W4, Q045.W8), all draft:true and editable in WORDS.
linesFor asks for the register first and falls back to English, so THE FAILURE
MODE OF A MISSING REGISTER IS ENGLISH, NEVER SILENCE.
LANG-2 done too: all 2,224 lines carry `lang`, chipped and searchable in WORDS.
The expensive thing later was never the content of a line, it was the column.

*** THREE REAL DEFECTS, NONE FINDABLE BY READING CODE ***
 1. THE WALKED CITY WAS 100% ENGLISH. ctPerson handed personOf the city's ONE
    GLOBAL SEED as a BLOCK seed, so blockMixOf answered the same for every
    person alive and neighbourhoods could not exist. 1,277 of 1,277 English.
    EVERY ENGINE CLAIM WAS GREEN. VERIFY ON THE REAL SURFACE is the only reason
    this was found, and it is the whole justification for the gate's section G.
 2. TWO IDENTITIES FOR ONE PERSON. The city re-keys somebody after personOf
    returns and re-derives their NAME; the language was already derived off the
    old key. Both answers stable, nothing visibly broken.
 3. THE VOCABULARY YARDSTICK ATE ITS OWN OUTPUT. The factory built its "English
    corpus" from the words book, which is harvested FROM the factory's lines, so
    on the second run every Spanish word came back as English and the sweep list
    collapsed 183 -> 5. THE TELL: the build answered differently depending on
    what order two tools ran in. A CHECKER WHOSE INPUT IS ITS OWN OUTPUT IS NOT
    A CHECKER.

A GAP BETWEEN TWO GOOD GUARD RAILS (flagged for SHARED, not claimed): the city
frame carried a 47,907-byte copy of an 81,931-byte module. bohemia_city_talk_patch
correctly REFUSES to run (it would delete 3,400 lines another lane built) and the
engine sync gate keys on `const BOH_*`, which this IIFE is not. I wrote
tools/bohemia_people_resync.py for the one frame that blocked me and named the
class. Any inlined module that is not a const BOH_* is unwatched.

language_gate: 63 claims, ~23s. MUTATIONS: Spanish objective 2 red; the city fix
reverted 4 red ("en 100.0%"); every register flattened to 3 8 red; the lexicon
self-poisoned 4 RED WITH THE HEADLINE CLAIM STILL GREEN (the anti-vacuity claim
is the only thing that caught it); the English fallback removed 3 red.

TWO WEAK CLAIMS OF MINE, BOTH CAUGHT BY THE MUTATIONS: "does not travel with the
name" was `return n > 0` after a loop that computed nothing; "falls back to
English" sampled a bucket that HAS a register and survived M6 untouched. Both
rewritten to compute what they name. Plus a false alarm caught BEFORE the gate
shipped (o'clock read as the Spanish "o", 2 of 507 good objectives flagged) --
A FALSE ALARM IS WHAT KILLS A GATE, NOT A MISS.

VERIFICATION: main is 22 RED and 72 gates never run (COMBAT lane, 8/25), so a
full suite pass is noise. Ran the 107 gates that touch any file I changed,
directly. Reds A/B'd against a clean origin/main worktree.

Record: records/BOHEMIA_NOBODY_IN_THIS_VALLEY_SPOKE_SPANISH_8_25_26.md

---- PREVIOUS (8/25, same day) ----
*** A PHONE CALL DURING THE GRIEF DINNER
WAS DELETING THREE OF THE OPENING'S FOUR SCENES, PERMANENTLY. FIXED, AND IT NOW
PICKS UP WHERE YOU LEFT IT. TAB RUN. ***

Chased the number the previous turn measured and did not stop on (`save rows: 0`
after 164s of story) and it led somewhere worse. openRaid called openMarkSeen()
at the handoff to the FIGHT:

    standing in the raid  seen=TRUE      <- 65s in, 1 of 4 scenes played
    force quit mid grief dinner, reopen, tap RUN:
      offered again false | playing nothing | still seen | 0 saves

THE LAST ROOM, THE GRIEF DINNER AND THE BURIAL GONE WITH NO WAY BACK -- the whole
emotional payload of Act 1, lost to an interruption on a demo player's first run,
and starting over does not return it because the flag says they have seen it.

THE MARK WAS NOT CARELESS, IT WAS THE WRONG TOOL. Its own comment names a real
concern (OPEN_RUNNING is false during the raid, so nothing stopped the invite
offering the opening over the fight). But the seen flag is a PERMANENT
CROSS-SESSION statement spent to solve a ten-second in-session problem.
  OPEN_MIDFLIGHT  openStart -> openDone, ACROSS the fight: "is a sequence in flight"
  OPEN_AT_KEY     the bookmark: which scene was playing when they stopped
  seen            openDone ALONE, which also clears the bookmark
openStart resumes from the bookmark instead of the top; a bookmark to a scene that
no longer exists is resolved through openSceneById before it is trusted. Fixed at
the GENERATOR, never in the alpha it writes.

opening_gate 53 -> 63. AND ONE CLAIM OF MINE WAS DEFENDING THE BUG: "WATCHING IT
THROUGH COUNTS AS SEEN" sampled at the raid and passed ONLY BECAUSE the flag was
being spent early. A CLAIM THAT GOES GREEN ONLY WHILE THE DEFECT EXISTS IS WORSE
THAN NO CLAIM. It now reads THE SEEN FLAG IS NOT SPENT MID SEQUENCE.

MUTATIONS: MI (put the shipped bug back) 5 RED including "AN INTERRUPTED OPENING
IS STILL THERE WHEN THEY COME BACK"; MJ (no bookmark) 2 RED, replays from the top.

WATCH THE STAMP WHEN YOU REBASE: another lane had shipped 8/25r while I verified,
and my resolved stamp was 8/25p -- keeping it would have moved the stamp BACKWARDS.
Took 8/25s. The letters are not monotonic across lanes; read main's before picking.

COST: opening_gate is now the heaviest in the suite at ~6 min (it plays the whole
opening twice, once to the day and once interrupted).

Record: records/BOHEMIA_YOU_HAVE_SEEN_IT_WHEN_YOU_HAVE_SEEN_IT_8_25_26.md

---- PREVIOUS (8/25, same day) ----
*** THE DEMO'S FIRST TEN MINUTES NOW HAVE
A MACHINE BEHIND EVERY LINK, INCLUDING THE LAST ONE: THE STORY ENDS AND HANDS YOU
A PLAYABLE DAY. 164 SECONDS, TAP TO STANDING IN IT. TAB RUN. ***

BOTH DEMO GATES ENTER THE DAY THROUGH A SIDE DOOR -- demo_gate taps #openSkip,
the_whole_demo_gate taps #openNot. Neither has ever walked out of the FINISHED
story into a day, so the last link had never been crossed by anybody.

    scenes played   cold_open -> the_last_room -> grief_dinner -> ridge_burial
    captions 40     runtime 164s     page errors 0
    ends on         p-city 390x804, tab=run, world frame live in the live panel

IT WORKS. Rows 7 and 10 are proven from the first tap to a playable day with
nothing skipped and nothing declined. opening_gate 48 -> 53.

THE MISTAKE WORTH CARRYING: the first probe asked "is the opening over?" as
`!OPEN_RUNNING && !visible` and reported it FINISHED IN 65s HAVING PLAYED ONE
SCENE OF FOUR. That is also true IN THE MIDDLE OF THE FIGHT, when the runtime
stands down so combat can have the screen. A TERMINATION CONDITION THAT MATCHES
THE MIDDLE IS NOT A TERMINATION CONDITION -- the identical shape as the vacuous
pass I closed in this same gate hours earlier, made again the same day. The
honest terminator is the LAST SCENE OF THE CHAIN, read from the chain.

MUTATIONS: MA (last scene unreachable) 2 red, MB (curtain never lifts) 2 red and
still 40 captions, MC (no world frame) 1 red printing "p-city 390x804, frame 0x0".
Three of five new claims red; the other two named in the record, not implied.

FOUR PROBE ERRORS THIS SESSION, none filed as findings, each caught by measuring
again before writing it up. That is the habit worth keeping more than any fix.

Record: records/BOHEMIA_ALL_THE_WAY_OUT_THE_OTHER_SIDE_8_25_26.md

---- PREVIOUS (8/25, same day) ----
*** THE OPENING RESUMED AFTER THE FIGHT
INTO A PANEL NOBODY COULD SEE. THREE OF ITS FOUR SCENES HAD NEVER BEEN WATCHED BY
ANYONE. FIXED, AND THE WHOLE SEQUENCE PLAYS. TAB RUN. ***

The turn before this proved scene one plays and hands you into the tutorial fight,
and left its own sentence standing: "a gate cannot win the tutorial fight to reach
scenes 2 through 4." So I drove the seam COMBAT publishes and measured what came
back:

    overlay parent   p-city      <- where the opening put it
    live panel       p-run       <- where the resume put the player
    overlay box      0 x 0       OPEN_RUNNING true
    playing scene    act1_ridge_burial      captions 32 and climbing

THE REST OF THE OPENING WAS RUNNING PERFECTLY AND NOBODY COULD SEE IT.

CAUSE: showTabPanel('run') does NOT put you where the RUN tab puts you. Paolo's
7/28 ruling lives in the tab's click handler (`PANEL = p==='run' ? 'city' : p`);
showTabPanel does the literal thing and lights p-run, the parked hidden panel.
TWO SWITCHERS, ONE ROUTING RULE, and the resume path used the one that disagrees.
resume() now taps the RUN tab the way a finger does. Fixed at the GENERATOR
(tools/bohemia_opening_patch.py), never in the alpha it writes.

  after   parent p-city  live p-city  box 390x804  playing act1_the_last_room

THE WHOLE SEQUENCE, SEEN FOR THE FIRST TIME: cold_open -> COMBAT (2 hostiles,
objective "defend") -> the_last_room ("Where's NINA.") -> grief_dinner ("I picked
the green ones out. Force of habit.") -> ridge_burial ("THE NEXT MORNING").
{sibling_lost} resolves to NINA, which is the 7/19 canon.

opening_gate 40 -> 48. THE CLAIM THAT LET THIS THROUGH WAS MINE: "the live tab is
the one the scene hands off to" is true and passes on a COMBAT tab with no fight
in it. A ROOM IS NOT WHAT HAPPENS IN THE ROOM.

FOUR MUTATIONS AND M2 CORRECTED ME. I believed both my fixes were needed and had
written that down. M2 (re-parent removed alone) came back GREEN 48/0: once the
routing is right the live panel IS p-city, so the re-parent never fires. THE
ROUTING FIX IS THE WHOLE FIX; the re-parent stays for the invariant and is
credited with nothing. M4 (both reverted, the shipped code) goes red on exactly
"WHEN THE FIGHT ENDS THE STORY COMES BACK" -- the bug cannot return unnoticed.

TWO MORE PROBE ERRORS, both caught by measuring twice: "there is no fight" (read
G.encounter before the handoff's own 250ms) and "only 1 of 2 lines" (waited for
the first line, asserted all). Three across the session, none filed.

Record: records/BOHEMIA_THE_STORY_CAME_BACK_INTO_A_HIDDEN_ROOM_8_25_26.md

---- PREVIOUS (8/25, same day) ----
*** NOBODY HAD EVER WATCHED THE COLD OPEN
TO THE END. FIVE GATES REACH IT; FOUR TAP SKIP AND THE FIFTH TAPS NOT NOW. IT
PLAYS FINE -- 62 SECONDS, ALL 10 LINES, ENDS STANDING IN THE FIGHT -- AND NOBODY
COULD HAVE TOLD YOU THAT. TAB RUN. ***

Demo plan rows 7 (THE FIRST FIVE MINUTES) and 10 (THE COLD OPEN SCENE) are mine
and I had never verified either end to end. Swept gates/*.js for anything that
touches the opening overlay: opening_gate, demo_gate, one_valley_gate, run_gate
all click #openSkip within seconds; the_whole_demo_gate clicks #openNot. Each is
individually right (run_gate skips because the overlay eats its D-pad taps;
the_whole_demo_gate declines on purpose to prove declining still leaves a
playable day). THE SUM was that "the opening works" meant "the opening STARTS".

SO IT WAS PLAYED, ON THE REAL SURFACE, WITH NOTHING TOUCHED FOR A MINUTE:
    act1_cold_open   26 beats, 10 spoken lines, 62 seconds
    captions         15, all 10 lines on screen, BEFORE -> TEN YEARS LATER
    page errors      0        marks seen from WATCHING (no skip)
    ends on          the COMBAT surface, 390x804, startColdOpen() live
IT ALL WORKS, and row 10's three-lane seam (PEOPLE runtime + scene, RUN consumes,
COMBAT supplies the family-defense encounter) IS CLOSED AND FIRING. The 8/19
comment saying the raid "has never been played from anywhere" was STALE; corrected
in the tool AND the alpha (tool re-run reports "already exactly this", so no drift).

THE CHAIN, walked on the page: 4 scenes, 68 beats, 23 spoken lines, every link
resolves -- cold_open -> COMBAT -> the_last_room -> grief_dinner -> ridge_burial.

opening_gate.js 24 -> 40 claims. Everything derived from openScene() at runtime,
so his DIRECT edits ARE the spec: the line list comes from the say beats, the
time-card claim only applies if the scene has a cut, the handoff claim looks the
named function up on the page, and where it lands is compared against what the
scene says it hands off to via the alpha's own switcher contract (.tab.on by
data-p). No caption, no panel id and no function name is typed into the gate.

FOUR MUTATIONS, 12 OF 15 NEW CLAIMS TURNED RED. M4 caught a hole in my own
headline claim: "not showing and not running" is ALSO true of a scene that never
started, so stubbing openStart would have printed PLAYS ALL THE WAY TO ITS END in
green, in 120ms. One `&&` fixes it and M4 proves the fix (reports `(0s)`, red).
Not proven red, named honestly: "resolves a scene with lines in it", "leaves you
on a live surface with real area", and the chain-level copy of the callable check.

THE FULL SUITE FINISHED (419 gates, 73 min, 26 red). RUN IT WITH nohup AND NO
TIMEOUT, OR SHARD IT -- the runner now says so itself and prints the shard commands;
my first attempt used `timeout 3000` piped to `tail` and died at 50 minutes with
ZERO output. Fifteen reds are on the inherited list. The confirm pass re-ran every
red ALONE and cleared FIGHT MOVES YOU as load, which is why that pass exists.

TWO WERE MINE AND BOTH ARE FIXED:
  BANNER -- FIXING THE OUTPUT DOES NOT FIX THE GENERATOR. bohemia_clout.js and
  bohemia_deeds.js were inlined in the city page behind a banner naming both
  modules with no `engine/` prefix, so the ENGINE SYNC scanner counted them as
  ZERO and both sat outside the one-canonical-body law. THE RUN LANE ALREADY
  FIXED THIS ON 8/21 with a tool that repairs the city page -- but MY tool
  GENERATES that region and put the hole straight back. Measured: the combined
  banner was in the page exactly once, so the regeneration had undone their
  repair. Fixed at the source, one banner per module. Comments only: both bodies
  still byte-verbatim (3,874 / 13,800), region +3 lines, BANNER 12/2 -> 14/0.
  ENGINE SYNC still 18 modules / zero drift, unchanged and correctly so -- nothing
  HAD drifted; what changed is that these two can now BE SEEN to.

  DIALOGUE CATALOGUE -- MY REGRESSION, THEIR GATE WAS THE VICTIM. It called eight
  reaction keys INVENTED (saw:/heard: quiet, notable, risky, reckless). ALL EIGHT
  ARE REAL. It read CLOUT_WEIGHTS out of bohemia_loop.js as an object literal, and
  I extracted that table to bohemia_clout.js, so loop now holds a REFERENCE. Regex
  matched nothing, tag list empty, every genuine key reported invented. The rule is
  "the tags the world produces"; pinning the FILE is not that rule. Now sweeps
  engine/ and NAMES the module in the pass line. 60/2 -> 62/0.

Record: records/BOHEMIA_NOBODY_EVER_WATCHED_IT_TO_THE_END_8_25_26.md

---- PREVIOUS (8/24) ----
*** NOBODY IN THE VALLEY SHARES A ROOF, AND
THAT IS WHY THE SOCIAL GRAPH IS EMPTY. A MEASUREMENT AND A CAUSE, HANDED TO
FACTIONS. Shipped instead: TAB RUN, the card no longer prints raw grid
coordinates at him. ***

Set out to make gossip travel along RELATIONSHIPS instead of proximity (two
strangers at a bus stop do not swap news about you; neighbours do), via
bohemia_ties.knows(), which had ZERO callers. MEASURED THE GRAPH FIRST.

THE NUMBERS, real surface, whole valley roster, using the FACTIONS lane's own call
pattern (ctValleyRoster/ctCell/ctVKey):
    298 people, 564 foci (home 298, work 254, faction 12)
    522 OF THOSE FOCI ARE SINGLETONS -- INCLUDING ALL 298 HOME FOCI
    780 sampled pairs -> 8 know each other (1.0%)
    60 pairs who SLEEP WITHIN TWO CELLS -> ZERO know each other
GATING GOSSIP ON "THEY KNOW EACH OTHER" WOULD HAVE REDUCED GOSSIP TO ZERO. That
measurement is the only reason it was not shipped, and it is the same
threshold-bigger-than-the-room check that has now paid off three times. MEASURE
THE POPULATION BEFORE GATING ANYTHING ON IT.

THE CAUSE, EXACTLY. bohemia_ties.fociOf prefers the DECLARED seat, and its own
8/15 comment says why: "its adapter mints a unique id per person, so every
resident parsed out as the sole occupant of their own house... The declared seat is
the fact; the id is a spelling of it. Read the fact." THE READER WAS FIXED, THE
WRITER WAS NOT. ctAgent declares home:{building: p.home[0]+','+p.home[1]} -- THE
PERSON'S OWN FINE-GRID CELL. Every person stands on a different cell, so every
building id is unique, so every household is a household of one. The 8/15 fix
taught the reader to prefer a field whose value CAN NEVER BE SHARED. A FIX ON THE
READING SIDE THAT THE WRITING SIDE NEVER FOLLOWED IS NOT A FIX.

FOUR CAPABILITIES ON ONE GAP: three of his sixteen dossier conditions
(MOB/REMNANTS/COLORFUL) still cannot find a third party, which is the ENTIRE
REASON bohemia_ties was built on 8/12; seatLineOf degrades to "HOUSE 901" instead
of "HOUSE 4 - THIRD OF FIVE"; workLineOf degrades to "12:12, WEST"; and news
cannot travel along relationships.

WHAT THE RECORD DOES NOT CLAIM: that the world is wrong. Ten years after the crash
a valley of solitary squatters is plausible canon, and if that is the ruling the
home focus SHOULD be empty. What is certainly true is narrower: THE ADAPTER
DECLARES A VALUE THAT CANNOT BE SHARED, SO THE QUESTION WAS NEVER ASKED. The code
answers "no households" BY ACCIDENT rather than BY DECISION.

NOT FIXED HERE, on purpose: ctAgent and bohemia_ties are the FACTIONS lane's; a
city cell carries only {g,s,walk,q} with NO mass or structure id, so "same
building" would have to be flood-filled or invented; and whether people share
dwellings is WORLDBUILDING. Faking a household to make my own feature light up
would have been building on a number I made up.
records/BOHEMIA_NOBODY_IN_THE_VALLEY_SHARES_A_ROOF_8_23_26.md

SHIPPED INSTEAD, the part that was ours and needed no household: THE CARD WAS
PRINTING RAW FINE-GRID COORDINATES AT HIM.
    before   LIVES   HERE, 6205 6269
    after    LIVES   Right about here      ("south of here" from 25 cells away)
A COORDINATE IS NOT AN ADDRESS; IT IS THE VARIABLE, SHOWN. It uses this lane's own
ctWhereWord -- the same vocabulary the missing-persons witness answers in -- so the
card and the witness say it ONE way, and the day that phrasing improves, both
improve. The gate asserts the RULE, not the row: NO row on that card may print a
bare fine-grid pair. Mutation putting the coordinates back -> 3 red.

gates: CITY MEMORY 31 -> 34 all green, CITY DEEDS 43, city talk 18, CITY DIAL 22.

WHAT COMES NEXT:
  1. *** THE ROOF FINDING IS FACTIONS'. *** If they rule households exist, this
     lane's gossip-along-relationships is then a small, honest wire-up and the
     measurement above is the before-number to beat.
  2. THE AFTERMATH SET PROPER (backlog 0r): reactions DIFFERENT FOR KILLED VS
     SPARED. Needs a boss -- COMBAT's to trigger, THIS LANE'S TO WORD. The channel
     is built and now carries four audiences.
  3. HE TURNS THE STANDING DIAL (DIRECT tab, third chip). One row makes all of
     this JUDGE him instead of merely remember him. His.
  4. THE OTHER DIALS -- READ BEFORE BUILDING. SEE_RANGE, the gossip window, the
     halflives are SET AND WORKING with written arguments, unlike DEED_WEIGHT
     which was EMPTY AND BLOCKING. Nine mechanism sliders would be the
     technical-question trap wearing a UI. Three handoffs listed this on momentum;
     decide, do not inherit.
  5. WALKING IS SILENT -- 97 approved sounds unplayed. SOUNDS.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/25 -- *** THE DEMO'S FIRST TEN MINUTES NOW HAVE
A MACHINE BEHIND EVERY LINK, INCLUDING THE LAST ONE: THE STORY ENDS AND HANDS YOU
A PLAYABLE DAY. 164 SECONDS, TAP TO STANDING IN IT. TAB RUN. ***

BOTH DEMO GATES ENTER THE DAY THROUGH A SIDE DOOR -- demo_gate taps #openSkip,
the_whole_demo_gate taps #openNot. Neither has ever walked out of the FINISHED
story into a day, so the last link had never been crossed by anybody.

    scenes played   cold_open -> the_last_room -> grief_dinner -> ridge_burial
    captions 40     runtime 164s     page errors 0
    ends on         p-city 390x804, tab=run, world frame live in the live panel

IT WORKS. Rows 7 and 10 are proven from the first tap to a playable day with
nothing skipped and nothing declined. opening_gate 48 -> 53.

THE MISTAKE WORTH CARRYING: the first probe asked "is the opening over?" as
`!OPEN_RUNNING && !visible` and reported it FINISHED IN 65s HAVING PLAYED ONE
SCENE OF FOUR. That is also true IN THE MIDDLE OF THE FIGHT, when the runtime
stands down so combat can have the screen. A TERMINATION CONDITION THAT MATCHES
THE MIDDLE IS NOT A TERMINATION CONDITION -- the identical shape as the vacuous
pass I closed in this same gate hours earlier, made again the same day. The
honest terminator is the LAST SCENE OF THE CHAIN, read from the chain.

MUTATIONS: MA (last scene unreachable) 2 red, MB (curtain never lifts) 2 red and
still 40 captions, MC (no world frame) 1 red printing "p-city 390x804, frame 0x0".
Three of five new claims red; the other two named in the record, not implied.

FOUR PROBE ERRORS THIS SESSION, none filed as findings, each caught by measuring
again before writing it up. That is the habit worth keeping more than any fix.

Record: records/BOHEMIA_ALL_THE_WAY_OUT_THE_OTHER_SIDE_8_25_26.md

---- PREVIOUS (8/25, same day) ----
*** THE OPENING RESUMED AFTER THE FIGHT
INTO A PANEL NOBODY COULD SEE. THREE OF ITS FOUR SCENES HAD NEVER BEEN WATCHED BY
ANYONE. FIXED, AND THE WHOLE SEQUENCE PLAYS. TAB RUN. ***

The turn before this proved scene one plays and hands you into the tutorial fight,
and left its own sentence standing: "a gate cannot win the tutorial fight to reach
scenes 2 through 4." So I drove the seam COMBAT publishes and measured what came
back:

    overlay parent   p-city      <- where the opening put it
    live panel       p-run       <- where the resume put the player
    overlay box      0 x 0       OPEN_RUNNING true
    playing scene    act1_ridge_burial      captions 32 and climbing

THE REST OF THE OPENING WAS RUNNING PERFECTLY AND NOBODY COULD SEE IT.

CAUSE: showTabPanel('run') does NOT put you where the RUN tab puts you. Paolo's
7/28 ruling lives in the tab's click handler (`PANEL = p==='run' ? 'city' : p`);
showTabPanel does the literal thing and lights p-run, the parked hidden panel.
TWO SWITCHERS, ONE ROUTING RULE, and the resume path used the one that disagrees.
resume() now taps the RUN tab the way a finger does. Fixed at the GENERATOR
(tools/bohemia_opening_patch.py), never in the alpha it writes.

  after   parent p-city  live p-city  box 390x804  playing act1_the_last_room

THE WHOLE SEQUENCE, SEEN FOR THE FIRST TIME: cold_open -> COMBAT (2 hostiles,
objective "defend") -> the_last_room ("Where's NINA.") -> grief_dinner ("I picked
the green ones out. Force of habit.") -> ridge_burial ("THE NEXT MORNING").
{sibling_lost} resolves to NINA, which is the 7/19 canon.

opening_gate 40 -> 48. THE CLAIM THAT LET THIS THROUGH WAS MINE: "the live tab is
the one the scene hands off to" is true and passes on a COMBAT tab with no fight
in it. A ROOM IS NOT WHAT HAPPENS IN THE ROOM.

FOUR MUTATIONS AND M2 CORRECTED ME. I believed both my fixes were needed and had
written that down. M2 (re-parent removed alone) came back GREEN 48/0: once the
routing is right the live panel IS p-city, so the re-parent never fires. THE
ROUTING FIX IS THE WHOLE FIX; the re-parent stays for the invariant and is
credited with nothing. M4 (both reverted, the shipped code) goes red on exactly
"WHEN THE FIGHT ENDS THE STORY COMES BACK" -- the bug cannot return unnoticed.

TWO MORE PROBE ERRORS, both caught by measuring twice: "there is no fight" (read
G.encounter before the handoff's own 250ms) and "only 1 of 2 lines" (waited for
the first line, asserted all). Three across the session, none filed.

Record: records/BOHEMIA_THE_STORY_CAME_BACK_INTO_A_HIDDEN_ROOM_8_25_26.md

---- PREVIOUS (8/25, same day) ----
*** NOBODY HAD EVER WATCHED THE COLD OPEN
TO THE END. FIVE GATES REACH IT; FOUR TAP SKIP AND THE FIFTH TAPS NOT NOW. IT
PLAYS FINE -- 62 SECONDS, ALL 10 LINES, ENDS STANDING IN THE FIGHT -- AND NOBODY
COULD HAVE TOLD YOU THAT. TAB RUN. ***

Demo plan rows 7 (THE FIRST FIVE MINUTES) and 10 (THE COLD OPEN SCENE) are mine
and I had never verified either end to end. Swept gates/*.js for anything that
touches the opening overlay: opening_gate, demo_gate, one_valley_gate, run_gate
all click #openSkip within seconds; the_whole_demo_gate clicks #openNot. Each is
individually right (run_gate skips because the overlay eats its D-pad taps;
the_whole_demo_gate declines on purpose to prove declining still leaves a
playable day). THE SUM was that "the opening works" meant "the opening STARTS".

SO IT WAS PLAYED, ON THE REAL SURFACE, WITH NOTHING TOUCHED FOR A MINUTE:
    act1_cold_open   26 beats, 10 spoken lines, 62 seconds
    captions         15, all 10 lines on screen, BEFORE -> TEN YEARS LATER
    page errors      0        marks seen from WATCHING (no skip)
    ends on          the COMBAT surface, 390x804, startColdOpen() live
IT ALL WORKS, and row 10's three-lane seam (PEOPLE runtime + scene, RUN consumes,
COMBAT supplies the family-defense encounter) IS CLOSED AND FIRING. The 8/19
comment saying the raid "has never been played from anywhere" was STALE; corrected
in the tool AND the alpha (tool re-run reports "already exactly this", so no drift).

THE CHAIN, walked on the page: 4 scenes, 68 beats, 23 spoken lines, every link
resolves -- cold_open -> COMBAT -> the_last_room -> grief_dinner -> ridge_burial.

opening_gate.js 24 -> 40 claims. Everything derived from openScene() at runtime,
so his DIRECT edits ARE the spec: the line list comes from the say beats, the
time-card claim only applies if the scene has a cut, the handoff claim looks the
named function up on the page, and where it lands is compared against what the
scene says it hands off to via the alpha's own switcher contract (.tab.on by
data-p). No caption, no panel id and no function name is typed into the gate.

FOUR MUTATIONS, 12 OF 15 NEW CLAIMS TURNED RED. M4 caught a hole in my own
headline claim: "not showing and not running" is ALSO true of a scene that never
started, so stubbing openStart would have printed PLAYS ALL THE WAY TO ITS END in
green, in 120ms. One `&&` fixes it and M4 proves the fix (reports `(0s)`, red).
Not proven red, named honestly: "resolves a scene with lines in it", "leaves you
on a live surface with real area", and the chain-level copy of the callable check.

THE FULL SUITE FINISHED (419 gates, 73 min, 26 red). RUN IT WITH nohup AND NO
TIMEOUT, OR SHARD IT -- the runner now says so itself and prints the shard commands;
my first attempt used `timeout 3000` piped to `tail` and died at 50 minutes with
ZERO output. Fifteen reds are on the inherited list. The confirm pass re-ran every
red ALONE and cleared FIGHT MOVES YOU as load, which is why that pass exists.

TWO WERE MINE AND BOTH ARE FIXED:
  BANNER -- FIXING THE OUTPUT DOES NOT FIX THE GENERATOR. bohemia_clout.js and
  bohemia_deeds.js were inlined in the city page behind a banner naming both
  modules with no `engine/` prefix, so the ENGINE SYNC scanner counted them as
  ZERO and both sat outside the one-canonical-body law. THE RUN LANE ALREADY
  FIXED THIS ON 8/21 with a tool that repairs the city page -- but MY tool
  GENERATES that region and put the hole straight back. Measured: the combined
  banner was in the page exactly once, so the regeneration had undone their
  repair. Fixed at the source, one banner per module. Comments only: both bodies
  still byte-verbatim (3,874 / 13,800), region +3 lines, BANNER 12/2 -> 14/0.
  ENGINE SYNC still 18 modules / zero drift, unchanged and correctly so -- nothing
  HAD drifted; what changed is that these two can now BE SEEN to.

  DIALOGUE CATALOGUE -- MY REGRESSION, THEIR GATE WAS THE VICTIM. It called eight
  reaction keys INVENTED (saw:/heard: quiet, notable, risky, reckless). ALL EIGHT
  ARE REAL. It read CLOUT_WEIGHTS out of bohemia_loop.js as an object literal, and
  I extracted that table to bohemia_clout.js, so loop now holds a REFERENCE. Regex
  matched nothing, tag list empty, every genuine key reported invented. The rule is
  "the tags the world produces"; pinning the FILE is not that rule. Now sweeps
  engine/ and NAMES the module in the pass line. 60/2 -> 62/0.

Record: records/BOHEMIA_NOBODY_EVER_WATCHED_IT_TO_THE_END_8_25_26.md

---- PREVIOUS (8/24) ----
*** NOBODY IN THE VALLEY SHARES A ROOF, AND
THAT IS WHY THE SOCIAL GRAPH IS EMPTY. A MEASUREMENT AND A CAUSE, HANDED TO
FACTIONS. Shipped instead: TAB RUN, the card no longer prints raw grid
coordinates at him. ***

Set out to make gossip travel along RELATIONSHIPS instead of proximity (two
strangers at a bus stop do not swap news about you; neighbours do), via
bohemia_ties.knows(), which had ZERO callers. MEASURED THE GRAPH FIRST.

THE NUMBERS, real surface, whole valley roster, using the FACTIONS lane's own call
pattern (ctValleyRoster/ctCell/ctVKey):
    298 people, 564 foci (home 298, work 254, faction 12)
    522 OF THOSE FOCI ARE SINGLETONS -- INCLUDING ALL 298 HOME FOCI
    780 sampled pairs -> 8 know each other (1.0%)
    60 pairs who SLEEP WITHIN TWO CELLS -> ZERO know each other
GATING GOSSIP ON "THEY KNOW EACH OTHER" WOULD HAVE REDUCED GOSSIP TO ZERO. That
measurement is the only reason it was not shipped, and it is the same
threshold-bigger-than-the-room check that has now paid off three times. MEASURE
THE POPULATION BEFORE GATING ANYTHING ON IT.

THE CAUSE, EXACTLY. bohemia_ties.fociOf prefers the DECLARED seat, and its own
8/15 comment says why: "its adapter mints a unique id per person, so every
resident parsed out as the sole occupant of their own house... The declared seat is
the fact; the id is a spelling of it. Read the fact." THE READER WAS FIXED, THE
WRITER WAS NOT. ctAgent declares home:{building: p.home[0]+','+p.home[1]} -- THE
PERSON'S OWN FINE-GRID CELL. Every person stands on a different cell, so every
building id is unique, so every household is a household of one. The 8/15 fix
taught the reader to prefer a field whose value CAN NEVER BE SHARED. A FIX ON THE
READING SIDE THAT THE WRITING SIDE NEVER FOLLOWED IS NOT A FIX.

FOUR CAPABILITIES ON ONE GAP: three of his sixteen dossier conditions
(MOB/REMNANTS/COLORFUL) still cannot find a third party, which is the ENTIRE
REASON bohemia_ties was built on 8/12; seatLineOf degrades to "HOUSE 901" instead
of "HOUSE 4 - THIRD OF FIVE"; workLineOf degrades to "12:12, WEST"; and news
cannot travel along relationships.

WHAT THE RECORD DOES NOT CLAIM: that the world is wrong. Ten years after the crash
a valley of solitary squatters is plausible canon, and if that is the ruling the
home focus SHOULD be empty. What is certainly true is narrower: THE ADAPTER
DECLARES A VALUE THAT CANNOT BE SHARED, SO THE QUESTION WAS NEVER ASKED. The code
answers "no households" BY ACCIDENT rather than BY DECISION.

NOT FIXED HERE, on purpose: ctAgent and bohemia_ties are the FACTIONS lane's; a
city cell carries only {g,s,walk,q} with NO mass or structure id, so "same
building" would have to be flood-filled or invented; and whether people share
dwellings is WORLDBUILDING. Faking a household to make my own feature light up
would have been building on a number I made up.
records/BOHEMIA_NOBODY_IN_THE_VALLEY_SHARES_A_ROOF_8_23_26.md

SHIPPED INSTEAD, the part that was ours and needed no household: THE CARD WAS
PRINTING RAW FINE-GRID COORDINATES AT HIM.
    before   LIVES   HERE, 6205 6269
    after    LIVES   Right about here      ("south of here" from 25 cells away)
A COORDINATE IS NOT AN ADDRESS; IT IS THE VARIABLE, SHOWN. It uses this lane's own
ctWhereWord -- the same vocabulary the missing-persons witness answers in -- so the
card and the witness say it ONE way, and the day that phrasing improves, both
improve. The gate asserts the RULE, not the row: NO row on that card may print a
bare fine-grid pair. Mutation putting the coordinates back -> 3 red.

gates: CITY MEMORY 31 -> 34 all green, CITY DEEDS 43, city talk 18, CITY DIAL 22.

WHAT COMES NEXT:
  1. *** THE ROOF FINDING IS FACTIONS'. *** If they rule households exist, this
     lane's gossip-along-relationships is then a small, honest wire-up and the
     measurement above is the before-number to beat.
  2. THE AFTERMATH SET PROPER (backlog 0r): reactions DIFFERENT FOR KILLED VS
     SPARED. Needs a boss -- COMBAT's to trigger, THIS LANE'S TO WORD. The channel
     is built and now carries four audiences.
  3. HE TURNS THE STANDING DIAL (DIRECT tab, third chip). One row makes all of
     this JUDGE him instead of merely remember him. His.
  4. THE OTHER DIALS -- READ BEFORE BUILDING. SEE_RANGE, the gossip window, the
     halflives are SET AND WORKING with written arguments, unlike DEED_WEIGHT
     which was EMPTY AND BLOCKING. Nine mechanism sliders would be the
     technical-question trap wearing a UI. Three handoffs listed this on momentum;
     decide, do not inherit.
  5. WALKING IS SILENT -- 97 approved sounds unplayed. SOUNDS.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/25 -- *** NOBODY HAD EVER WATCHED THE COLD OPEN
TO THE END. FIVE GATES REACH IT; FOUR TAP SKIP AND THE FIFTH TAPS NOT NOW. IT
PLAYS FINE -- 62 SECONDS, ALL 10 LINES, ENDS STANDING IN THE FIGHT -- AND NOBODY
COULD HAVE TOLD YOU THAT. TAB RUN. ***

Demo plan rows 7 (THE FIRST FIVE MINUTES) and 10 (THE COLD OPEN SCENE) are mine
and I had never verified either end to end. Swept gates/*.js for anything that
touches the opening overlay: opening_gate, demo_gate, one_valley_gate, run_gate
all click #openSkip within seconds; the_whole_demo_gate clicks #openNot. Each is
individually right (run_gate skips because the overlay eats its D-pad taps;
the_whole_demo_gate declines on purpose to prove declining still leaves a
playable day). THE SUM was that "the opening works" meant "the opening STARTS".

SO IT WAS PLAYED, ON THE REAL SURFACE, WITH NOTHING TOUCHED FOR A MINUTE:
    act1_cold_open   26 beats, 10 spoken lines, 62 seconds
    captions         15, all 10 lines on screen, BEFORE -> TEN YEARS LATER
    page errors      0        marks seen from WATCHING (no skip)
    ends on          the COMBAT surface, 390x804, startColdOpen() live
IT ALL WORKS, and row 10's three-lane seam (PEOPLE runtime + scene, RUN consumes,
COMBAT supplies the family-defense encounter) IS CLOSED AND FIRING. The 8/19
comment saying the raid "has never been played from anywhere" was STALE; corrected
in the tool AND the alpha (tool re-run reports "already exactly this", so no drift).

THE CHAIN, walked on the page: 4 scenes, 68 beats, 23 spoken lines, every link
resolves -- cold_open -> COMBAT -> the_last_room -> grief_dinner -> ridge_burial.

opening_gate.js 24 -> 40 claims. Everything derived from openScene() at runtime,
so his DIRECT edits ARE the spec: the line list comes from the say beats, the
time-card claim only applies if the scene has a cut, the handoff claim looks the
named function up on the page, and where it lands is compared against what the
scene says it hands off to via the alpha's own switcher contract (.tab.on by
data-p). No caption, no panel id and no function name is typed into the gate.

FOUR MUTATIONS, 12 OF 15 NEW CLAIMS TURNED RED. M4 caught a hole in my own
headline claim: "not showing and not running" is ALSO true of a scene that never
started, so stubbing openStart would have printed PLAYS ALL THE WAY TO ITS END in
green, in 120ms. One `&&` fixes it and M4 proves the fix (reports `(0s)`, red).
Not proven red, named honestly: "resolves a scene with lines in it", "leaves you
on a live surface with real area", and the chain-level copy of the callable check.

THE FULL SUITE FINISHED (419 gates, 73 min, 26 red). RUN IT WITH nohup AND NO
TIMEOUT, OR SHARD IT -- the runner now says so itself and prints the shard commands;
my first attempt used `timeout 3000` piped to `tail` and died at 50 minutes with
ZERO output. Fifteen reds are on the inherited list. The confirm pass re-ran every
red ALONE and cleared FIGHT MOVES YOU as load, which is why that pass exists.

TWO WERE MINE AND BOTH ARE FIXED:
  BANNER -- FIXING THE OUTPUT DOES NOT FIX THE GENERATOR. bohemia_clout.js and
  bohemia_deeds.js were inlined in the city page behind a banner naming both
  modules with no `engine/` prefix, so the ENGINE SYNC scanner counted them as
  ZERO and both sat outside the one-canonical-body law. THE RUN LANE ALREADY
  FIXED THIS ON 8/21 with a tool that repairs the city page -- but MY tool
  GENERATES that region and put the hole straight back. Measured: the combined
  banner was in the page exactly once, so the regeneration had undone their
  repair. Fixed at the source, one banner per module. Comments only: both bodies
  still byte-verbatim (3,874 / 13,800), region +3 lines, BANNER 12/2 -> 14/0.
  ENGINE SYNC still 18 modules / zero drift, unchanged and correctly so -- nothing
  HAD drifted; what changed is that these two can now BE SEEN to.

  DIALOGUE CATALOGUE -- MY REGRESSION, THEIR GATE WAS THE VICTIM. It called eight
  reaction keys INVENTED (saw:/heard: quiet, notable, risky, reckless). ALL EIGHT
  ARE REAL. It read CLOUT_WEIGHTS out of bohemia_loop.js as an object literal, and
  I extracted that table to bohemia_clout.js, so loop now holds a REFERENCE. Regex
  matched nothing, tag list empty, every genuine key reported invented. The rule is
  "the tags the world produces"; pinning the FILE is not that rule. Now sweeps
  engine/ and NAMES the module in the pass line. 60/2 -> 62/0.

Record: records/BOHEMIA_NOBODY_EVER_WATCHED_IT_TO_THE_END_8_25_26.md

---- PREVIOUS (8/24) ----
*** NOBODY IN THE VALLEY SHARES A ROOF, AND
THAT IS WHY THE SOCIAL GRAPH IS EMPTY. A MEASUREMENT AND A CAUSE, HANDED TO
FACTIONS. Shipped instead: TAB RUN, the card no longer prints raw grid
coordinates at him. ***

Set out to make gossip travel along RELATIONSHIPS instead of proximity (two
strangers at a bus stop do not swap news about you; neighbours do), via
bohemia_ties.knows(), which had ZERO callers. MEASURED THE GRAPH FIRST.

THE NUMBERS, real surface, whole valley roster, using the FACTIONS lane's own call
pattern (ctValleyRoster/ctCell/ctVKey):
    298 people, 564 foci (home 298, work 254, faction 12)
    522 OF THOSE FOCI ARE SINGLETONS -- INCLUDING ALL 298 HOME FOCI
    780 sampled pairs -> 8 know each other (1.0%)
    60 pairs who SLEEP WITHIN TWO CELLS -> ZERO know each other
GATING GOSSIP ON "THEY KNOW EACH OTHER" WOULD HAVE REDUCED GOSSIP TO ZERO. That
measurement is the only reason it was not shipped, and it is the same
threshold-bigger-than-the-room check that has now paid off three times. MEASURE
THE POPULATION BEFORE GATING ANYTHING ON IT.

THE CAUSE, EXACTLY. bohemia_ties.fociOf prefers the DECLARED seat, and its own
8/15 comment says why: "its adapter mints a unique id per person, so every
resident parsed out as the sole occupant of their own house... The declared seat is
the fact; the id is a spelling of it. Read the fact." THE READER WAS FIXED, THE
WRITER WAS NOT. ctAgent declares home:{building: p.home[0]+','+p.home[1]} -- THE
PERSON'S OWN FINE-GRID CELL. Every person stands on a different cell, so every
building id is unique, so every household is a household of one. The 8/15 fix
taught the reader to prefer a field whose value CAN NEVER BE SHARED. A FIX ON THE
READING SIDE THAT THE WRITING SIDE NEVER FOLLOWED IS NOT A FIX.

FOUR CAPABILITIES ON ONE GAP: three of his sixteen dossier conditions
(MOB/REMNANTS/COLORFUL) still cannot find a third party, which is the ENTIRE
REASON bohemia_ties was built on 8/12; seatLineOf degrades to "HOUSE 901" instead
of "HOUSE 4 - THIRD OF FIVE"; workLineOf degrades to "12:12, WEST"; and news
cannot travel along relationships.

WHAT THE RECORD DOES NOT CLAIM: that the world is wrong. Ten years after the crash
a valley of solitary squatters is plausible canon, and if that is the ruling the
home focus SHOULD be empty. What is certainly true is narrower: THE ADAPTER
DECLARES A VALUE THAT CANNOT BE SHARED, SO THE QUESTION WAS NEVER ASKED. The code
answers "no households" BY ACCIDENT rather than BY DECISION.

NOT FIXED HERE, on purpose: ctAgent and bohemia_ties are the FACTIONS lane's; a
city cell carries only {g,s,walk,q} with NO mass or structure id, so "same
building" would have to be flood-filled or invented; and whether people share
dwellings is WORLDBUILDING. Faking a household to make my own feature light up
would have been building on a number I made up.
records/BOHEMIA_NOBODY_IN_THE_VALLEY_SHARES_A_ROOF_8_23_26.md

SHIPPED INSTEAD, the part that was ours and needed no household: THE CARD WAS
PRINTING RAW FINE-GRID COORDINATES AT HIM.
    before   LIVES   HERE, 6205 6269
    after    LIVES   Right about here      ("south of here" from 25 cells away)
A COORDINATE IS NOT AN ADDRESS; IT IS THE VARIABLE, SHOWN. It uses this lane's own
ctWhereWord -- the same vocabulary the missing-persons witness answers in -- so the
card and the witness say it ONE way, and the day that phrasing improves, both
improve. The gate asserts the RULE, not the row: NO row on that card may print a
bare fine-grid pair. Mutation putting the coordinates back -> 3 red.

gates: CITY MEMORY 31 -> 34 all green, CITY DEEDS 43, city talk 18, CITY DIAL 22.

WHAT COMES NEXT:
  1. *** THE ROOF FINDING IS FACTIONS'. *** If they rule households exist, this
     lane's gossip-along-relationships is then a small, honest wire-up and the
     measurement above is the before-number to beat.
  2. THE AFTERMATH SET PROPER (backlog 0r): reactions DIFFERENT FOR KILLED VS
     SPARED. Needs a boss -- COMBAT's to trigger, THIS LANE'S TO WORD. The channel
     is built and now carries four audiences.
  3. HE TURNS THE STANDING DIAL (DIRECT tab, third chip). One row makes all of
     this JUDGE him instead of merely remember him. His.
  4. THE OTHER DIALS -- READ BEFORE BUILDING. SEE_RANGE, the gossip window, the
     halflives are SET AND WORKING with written arguments, unlike DEED_WEIGHT
     which was EMPTY AND BLOCKING. Nine mechanism sliders would be the
     technical-question trap wearing a UI. Three handoffs listed this on momentum;
     decide, do not inherit.
  5. WALKING IS SILENT -- 97 approved sounds unplayed. SOUNDS.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/23 -- *** ONE ACT, FOUR MEANINGS. THE MULTIPLIER
IS WHO IS SPEAKING, NOT HOW MANY LINES. TAB: RUN -- turn an outfit down in front
of people; the one who runs with that outfit, somebody from a rival, and a
bystander each say a DIFFERENT thing about the same moment. ***

The turn before shipped witnesses saying what they saw out loud (16 lines, four
acts x saw/heard x two variants). Backlog 0r's Hades math says REACTIVITY is the
multiplier, and the honest read is NOT "write more lines of the same four acts" --
that is padding. THE MULTIPLIER IS WHO IS SPEAKING.

THE CORPUS HAS ALWAYS AUTHORED THIS. bohemia_deeds quotes his own quest file: "ONE
ACT, TWO MEANINGS... S17 stage 32 is `faction CARAVANS +12` AND `faction BLUES
-6`: taking the credit is a good customer to the traders and a betrayal to the
growers." And bohemia_standing ships opts.only saying "one act can mean opposite
things to two factions and nothing at all to a third."

Measured on the real surface, the same refusal:
    the outfit you refused    "Said no. To us. Standing right there."
    somebody from a rival     "Turned them down. Good."
    an unaffiliated bystander "Told them no. Right to their face."
    anyone who only heard     "Heard somebody turned them down."
Four acts x four audiences x two variants = 32 drafted lines, pronoun-free,
cycling so none repeats until its pool is spent.

*** THE RETELLING LOSES THE DETAIL AND THAT IS THE DESIGN. *** The deed remembers
which outfit it was about, stamped on the EYEWITNESS copies and never carried in
the KIND (a kind per faction would grow his DEED_WEIGHT table with the roster, and
he weighs an act ONCE). gossip() copies actor/kind/turn/position/hops and the
fields it knows, and does NOT copy fid. Not a limitation worked around: THE
SPECIFIC DETAIL IS THE FIRST THING A RETELLING LOSES. An eyewitness knows who you
turned down; somebody who only heard knows that somebody got turned down. So
second-hand news is vague BY CONSTRUCTION, and a mutation letting fid survive a
retelling goes red.

TWO THINGS THIS GOT WRONG FIRST, both worth keeping:
  - EVERY FORM A TOOL HAS EVER SHIPPED NEEDS AN UPGRADE PATH. The tool REFUSED
    outright when the city held the intermediate form (tagged, no outfit) and only
    V1 and fresh-anchor pairs existed. REFUSING WAS THE RIGHT FAILURE -- it said
    so and changed nothing rather than reporting success over a half-wired city --
    but the fix is A PAIR PER SHIPPED FORM, each narrow and span-matched. Three
    forms now, three paths.
  - *** FIFTH TIME: AN ASSERTION THAT PINS TODAY'S ANSWER INSTEAD OF TODAY'S
    RULE. *** Three assertions matched the exact ARGUMENT LIST of the ctDeed call
    and went red because the call legitimately GREW an argument (a clout tag on
    8/21, the outfit on 8/22). They match the CALL now, not its arguments. If a
    future session writes a regex containing a full argument list, that is this
    bug being written for the sixth time.

gates: CITY DEEDS 36 -> 43 all green, CITY MEMORY 31, CITY DIAL 22, city talk 18,
standing 35. Both city tools idempotent together, md5 over three runs. Mutations:
everybody reads the act the same way -> 3 red; let the outfit survive a retelling
-> 2 red.
records/BOHEMIA_ONE_ACT_FOUR_MEANINGS_8_22_26.md

WHAT COMES NEXT:
  1. *** THE AFTERMATH SET PROPER. *** 0r asks for reactions DIFFERENT FOR KILLED
     VS SPARED. Needs a boss, which is COMBAT's; the channel is built and now has
     audiences too. Theirs to trigger, THIS LANE'S TO WORD.
  2. HE TURNS THE STANDING DIAL (DIRECT tab, third chip). One row makes all of
     this JUDGE him instead of merely remember him. His.
  3. *** THE OTHER DIALS -- AND READ THIS BEFORE BUILDING THEM. *** SEE_RANGE, the
     gossip window, the halflives are SET AND WORKING with written arguments,
     unlike DEED_WEIGHT which was EMPTY AND BLOCKING. The 8/12 law's test is about
     things HE HAS TO RULE ON. Nine mechanism sliders would be the
     technical-question trap wearing a UI. If it ships, it ships as ONE creative
     fork about HOW THE WORLD FEELS, in his words, not as a tuning panel. Two
     handoffs in a row listed this as "next" on momentum; it is not obviously
     right and a session should decide, not inherit.
  4. WALKING IS SILENT -- one sfx message, zero footstep code, 97 approved sounds
     unplayed. SOUNDS.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/22 -- *** A DEED THAT ONLY EXISTS ON A CARD IS A
DEED MOST PLAYERS NEVER SEE. TAB: RUN -- do something in front of somebody and
walk on; they say what they saw, out loud, over their head. You open nothing. ***

Four turns of this lane built witnessing, gossip, hearsay decay and loudness, ALL
of it reachable only by walking up to somebody and opening their card. My own note
on turn one quoted the reputation literature saying exactly why that is fatal -- a
system the player cannot SEE working is indistinguishable from no system at all --
and then I built four turns of precisely that.

BACKLOG 0r NAMES THIS LANE'S ORGANS AS THE CHANNEL: Hades ships ~4 boss fights but
21,020 voice lines, because roguelite replayability is bought with REACTIVITY PER
ENCOUNTER, "flowing through the witness organ + memory systems already live". Their
trick, copied literally: NEVER REPEAT A LINE UNTIL EVERY UNUSED OPTION IS SPENT.

SAW AND HEARD SAY DIFFERENT THINGS, which is the whole payoff of modelling a route
the news could take and was invisible outside the card until now:
    watched it   "Told them no. Right to their face."
    only heard   "Heard somebody turned them down."
An eyewitness is specific; a retelling is vague and hedged. Sixteen drafted lines
(four acts x saw/heard x two variants), cycling so no line repeats until its pool
is spent, and a witness never repeats the SAME sighting at you. It PREEMPTS the
ordinary bark the way the two-person conversation above it does, so with nobody
having seen anything the street sounds precisely as before. The lines are
deliberately PRONOUN-FREE: who the player is is his, and a bark that guesses is
wrong half the time. The gate asserts zero gendered pronouns across all sixteen.

*** I FILED A BUG THAT DID NOT EXIST, AND THE WAY I GOT THERE IS THE LESSON. ***
Mid-turn I measured ctDeed recording ZERO witnesses after a render and concluded
the claim/favour/commit deeds had never recorded anybody in real play. WRONG TWICE
OVER.
  - I MEASURED THE WRONG SURFACE. The probe loaded BOHEMIA_CITY_WORLD.html
    DIRECTLY. Standalone, the city never receives PLAYER_CV from the alpha, so
    peoplePass returns early and draws NOBODY -- playerCV:false, zero bodies,
    forever. Every number I read came from a frame with no people in it. VERIFY ON
    THE REAL SURFACE is not a slogan about screenshots: THE CITY FRAME IS A
    DIFFERENT SURFACE WHEN IT IS NOT INSIDE THE ALPHA. Any probe of city behaviour
    must go through the alpha's RUN tab.
  - I MISREAD WHICH FUNCTION OWNS THE RESET. A comment inside barkPass says
    "consume it, then clear for the next", which I read as barkPass clearing
    BARK_DREW. It does not. `BARK_DREW = []` IS THE FIRST LINE OF peoplePass,
    confirmed by walking the file rather than trusting the comment.
Re-measured through the alpha: drewAfterRender 1, witnessesRecorded 1. NO BUG. The
machinery I had added is REVERTED, including a comment that would have sat in the
codebase asserting a falsehood. A layer added "just in case" is speculative
complexity; a loud comment describing an imaginary bug is worse, because the next
person believes it.

ONE REAL THING CAME OUT OF THAT DETOUR: THE NET-DELETION GUARD COULD NOT TELL MY
LINES FROM ANYBODY ELSE'S. Written as `if (grew < 0) refuse`, it also forbade the
tool from ever SHRINKING ITS OWN BLOCK -- so the moment a block genuinely needed
removing, the tool refused and the only way back was by hand. It now measures the
file OUTSIDE the region it owns, which is the thing 8/17's 2,607-line accident
actually destroyed. A guard that blocks the correct move as readily as the
dangerous one gets routed around, and a guard that gets routed around is not a
guard. THE SIBLING TOOLS SHOULD TAKE THE SAME FIX.

gates: CITY DEEDS 30 -> 36 all green, CITY MEMORY 31, CITY DIAL 22, city talk 18.
Both city tools idempotent together. Mutations: let a witness repeat forever -> 1
red; make SAW and HEARD identical -> 1 red.
records/BOHEMIA_THEY_SAY_IT_OUT_LOUD_8_21_26.md

WHAT COMES NEXT:
  1. *** THE AFTERMATH SET PROPER. *** 0r asks for reactions DIFFERENT FOR KILLED
     VS SPARED. That needs a boss, which is COMBAT's; the channel is built and
     waiting. Theirs to trigger, THIS LANE'S TO WORD.
  2. *** THE OTHER DIALS, THIS LANE'S. *** SEE_RANGE (9 tiles), the gossip window
     (45 min), the deed halflife, the memory halflife -- every one a defensible
     constant with a written argument and the same wrong answer to "WHERE DOES HE
     CHANGE THIS HIMSELF". The STANDING dial in DIRECT is the pattern; the readout
     must ASK the city rather than retype anything (file:// frames are opaque
     origin, cross-frame reads throw SecurityError).
  3. HE TURNS THE STANDING DIAL. One row makes all of this JUDGE him. His.
  4. WALKING IS SILENT -- one sfx message, zero footstep code, 97 approved sounds
     unplayed. SOUNDS.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/21 -- *** I BROKE HIS OWN LAW THREE TURNS RUNNING:
THE DIAL HAD NO DIAL. TAB: DIRECT, third chip, STANDING -- set what each thing you
can do is worth, press PLAY WHAT I BUILT, and it drops you on the street where the
person who watched you now has an opinion. ***

Over three turns this lane shipped a reputation system: people witness what you do,
remember it, tell each other at a penalty per retelling, forget it as it fades, and
a loud act carries further than a quiet one. Its entire JUDGEMENT layer,
bohemia_standing's DEED_WEIGHT, ships deliberately EMPTY and waits on Paolo.
Correct under MECHANISM-MINE/CONTENTS-PAOLO'S: numbers are his, nothing may invent
one. BUT THE ONLY WAY HE COULD FILL IT WAS TO TELL ME AND I EDIT A FILE, and his
own 8/12 law answers that in one line: "WHERE DOES HE CHANGE THIS HIMSELF? If the
answer is he tells me and I edit a file, THE SYSTEM IS NOT SHIPPED YET."

*** MY OWN HANDOFF SAID "THE DIAL, AND IT IS HIS. NOTHING SHOULD INVENT IT" THREE
TIMES, APPROVINGLY. *** That sentence is right about the first half and blind to
the second. NOT INVENTING HIS NUMBERS AND NOT GIVING HIM THE CONTROLS ARE TWO
DIFFERENT MISTAKES, and I kept making the second while congratulating myself for
avoiding the first. If a future session finds itself writing "this is his call" in
a handoff, the very next question is WHERE DOES HE MAKE IT, and if there is no
answer that is the work.

WHAT HE GETS: four things he can do on that street, each in plain English, each
with a ladder he taps (-5 -3 -1 [NOT RULED] +1 +3 +5). WHAT HE READS IS THE
CONSEQUENCE, NOT THE NUMBER -- "someone who WATCHED it: -3.0 (COLD) - someone who
only HEARD: -1.6 (COLD)". NOT RULED IS A REAL POSITION, NOT ZERO: zero would mean
"worth nothing", NOT RULED means he has not said, and while he has not said nobody
in the game forms an opinion at all. Pressing it again TAKES THE RULING BACK,
because undo is half of a dial. It crosses the frame the moment he presses, so
opinionOf, standingOf and the rungs light up with NO other wiring and the card
gains a THEY THINK row on the person who watched him. It persists, and it exports
as .txt a lane can land straight into DEED_WEIGHT as canon.

THE TABLE STILL SHIPS EMPTY and the gate asserts every shipped DECLARATION of it
is {} and that the only writer anywhere is his dial.

*** THE ONE I ALMOST GOT WRONG KNOWING BETTER. *** The readout needs the rung
boundaries and the hearsay penalty, and fr.contentWindow.BohemiaStanding THROWS
SecurityError -- file:// frames are opaque origin "null", measured not assumed. The
tempting repair was to retype RUNGS and HEARSAY_LOSS up in the alpha, which is
EXACTLY the second-copy drift this lane spent the PREVIOUS TURN deleting, one day
later, by the person who wrote the record about it. The city computes them with the
shipped module and posts them back; the ladder is fixed so one reply covers every
button and no press costs a round trip.

TWO THINGS THIS GOT WRONG FIRST, both worth keeping:
  - A RUNTIME PROBE COULD NOT SEE A SEEDED TABLE BECAUSE MY OWN PUSH ERASED IT.
    Seeding DEED_WEIGHT with a default left the gate GREEN: the alpha pushes his
    (empty) dial across on boot and the receiver clears before applying, so the
    seed was NEUTRALISED rather than CAUGHT. The runtime behaviour is right -- his
    dial is the authority -- but it means no probe can ever see a seeded default.
    The gate now asserts the shipped DECLARATION, which is what the law is about.
  - AN ASSERTION THAT PINS TODAY'S ANSWER INSTEAD OF TODAY'S RULE FAILS THE DAY
    THE ANSWER LEGITIMATELY CHANGES. direct_gate read `seen.modes === 2`, so
    adding a third mode turned it red FOR DOING EXACTLY WHAT THAT GATE EXISTS TO
    ENCOURAGE. The rule was never "there are two modes", it is "both things he
    said he cannot direct are here"; it names them now and tolerates company.
    FOURTH TIME THIS LANE HAS MET THIS SHAPE. Fix the ruler, never the target.

gates: CITY DIAL 22/0 (new, registered 306 of 406), DIRECT 33/0 after the
generalisation, CITY DEEDS 30/0, CITY MEMORY 23/0, standing 35, attempt 15.
Mutations: seed the table -> 1 red; stop it crossing the frame -> 3 red; retype
the rungs in the alpha -> 1 red.
records/BOHEMIA_WHERE_DOES_HE_CHANGE_THIS_HIMSELF_8_21_26.md

WHAT COMES NEXT:
  1. *** HE TURNS IT. *** Nothing else in this system is blocked on code. The
     moment he sets ONE row, three turns of witnessing, gossip and decay become a
     reputation that judges him. His, and nothing should invent it.
  2. *** THE OTHER DIALS, AND THIS LANE'S NEXT JOB. *** The same test applies to
     every number this lane is sitting on: SEE_RANGE (9 tiles), the gossip window
     (45 min), the deed halflife, the memory halflife. Each is a defensible
     constant with a written argument, and "where does he change this himself" has
     the same wrong answer for all of them. The STANDING dial is the pattern to
     copy.
  3. THE THREE RETYPED CLOUT SLICES -- BOHEMIA_HOW_LOUD_8_6_26.html,
     BOHEMIA_CURRENT_SLICE.html, BOHEMIA_RUN_CURRENT.html still hold their own
     copy of CLOUT_WEIGHTS. One line each in whichever tool generates them now
     that bohemia_clout.js exists to point at. NOT this lane's surfaces.
  4. WALKING IS SILENT -- one sfx message, zero footstep code, 97 approved sounds
     unplayed. SOUNDS.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/21 -- *** THE NUMBER MOVED AND NOBODY HAD SEEN
ANYTHING. THEY SEE IT NOW, AND THEY TELL EACH OTHER. TAB: RUN -- answer a claim,
then walk up to somebody who was standing there. The first row of their card says
SAW. Somebody who was not there, later, says HEARD. ***

engine/bohemia_deeds.js names the flaw in its own opening paragraph, 8/6: "the
faction standing got applied godlike -- the number moved, valley-wide, instantly,
and NOBODY HAD SEEN ANYTHING. So today a back-yard handshake and a public
humiliation in front of a whole block are worth the same." THE CITY WAS COMMITTING
EXACTLY THAT: you answer a claim to a person's face on a street,
BohemiaBelonging.adjust moves a valley-wide number, the whole outfit knows
instantly, and the man standing next to you knows nothing.
engine/bohemia_standing.js was built for this input on 8/2 -- witness, opinion,
gossip, hearsay decay, generational inheritance, 35 green claims -- and had no
caller anywhere. Yesterday this lane wired the witness ORGAN so people can SEE
you; this wires the DEED, so what they see you DO is a thing they hold and pass on.

ON THE CARD, first row, sitting directly above "NAME: YOU HAVE NOT ASKED":
    SAW    watched you turn an outfit down
A STRANGER WHOSE NAME YOU HAVE NEVER ASKED HAS ALREADY WATCHED YOU DO SOMETHING.
It leads because it is the only part of the card that is different because of what
you have DONE; every row below it is true of them on any day.

AND IT TRAVELS. Measured on the real surface:
    stood next to you          hops=0   SAW    watched you turn an outfit down
    sixty cells away           nothing  (no row at all)
    45 min beside the witness  hops=1   HEARD  heard you turned an outfit down
In most games every NPC knows everything the instant it happens with no route the
news could have taken. Here there is a route and the card shows which end of it
you are looking at.

THE WINDOW IS COUNTED IN GAME MINUTES, NOT FRAMES, and that is not a detail.
Counting frames would mean two neighbours could only talk while the PLAYER stood
watching them -- wrong about the world and unreachable in practice, because the
player walks twelve cells a game-minute so 45 minutes of watching is five hundred
cells of staring at the same two people. Elapsed clock time between passes is
credited instead. TOGETHER MEANS CONVERSATIONAL DISTANCE (2 cells), NOT SEE_RANGE
(9): you can watch something happen from nine tiles away, you cannot swap news
from there. A pair that separates loses its accumulated time rather than banking
it, which stops two people who merely pass each other daily from eventually
counting as having had a long conversation.

*** WHAT A DEED IS WORTH IS STILL HIS AND THAT IS WHY IT SHIPS EMPTY. ***
DEED_WEIGHT is blank ("NOTHING IS IN HERE and nothing in this file invents a
row"), opinionOf returns 0, standingOf returns NEUTRAL, and THE GATE ASSERTS BOTH
STAY THAT WAY -- if it ever stops being zero without a ruling, some lane invented
a number he did not give. That is also why the card reads the deed LEDGER instead
of becauseOf(): becauseOf is a JUDGEMENT query and filters on force, so it returns
nothing at all while the table is empty, but "he watched you refuse" is a FACT and
it is true today. The moment he rules ONE row, opinion, standing rungs and the
faction's whole view of you light up on this same data with NO wiring changed.

THE BOUNDARY IS ASSERTED, NOT PROMISED. Claims, belonging and commitment are the
FACTIONS lane's (last live 8/18). Nothing here changes what a claim COSTS, who may
ask, or how belonging moves, and A5 of the gate asserts their adjust() line is
intact and unchanged. This adds one sentence to the world: AND THESE SPECIFIC
PEOPLE SAW YOU DO IT.

THE KIND DOES NOT CARRY THE OUTFIT, on purpose: claim:met / claim:refused, never
claim:refused:REDS. He weighs an ACT once; a kind per faction grows his table with
the roster, and a bystander outside that outfit only knows you turned somebody
down anyway, which is what the words say. All words are DRAFT, in one table
(CT_DEED_WORDS).

gates: CITY DEEDS 20/0 (new, registered 303 of 402), CITY MEMORY 23, city_talk 18,
standing 35, memory 10 -- all green on the merged tree. Tool idempotent on the
FIRST try, md5-identical over three runs (the memory tool shipped with the
delete-half-missing bug yesterday, so this one carried the region marker from the
start). Mutation-proved three ways with arrival verified in the file under test
each time: gossip with no window -> 2 red; witness everyone regardless of distance
-> 4 red, including SAW and HEARD collapsing into the SAME SENTENCE; fire the deed
on an unresolved claim -> 1 red.
records/BOHEMIA_THE_NUMBER_MOVED_AND_NOBODY_SAW_8_20_26.md

WHAT COMES NEXT:
  1. *** THE THIRD ACT WORTH JUDGING. THIS LANE'S. *** Claims and commitments are
     wired. The other real choice on that card is the FAVOUR -- asking somebody
     for something -- and it is one ctDeed() line once somebody decides whether
     ASKING is a deed at all. Beyond that: bohemia_deeds.js can make a deed LOUDER
     or quieter from a quest's own #quiet/#reckless tag (reach and hops read from
     his CLOUT_WEIGHTS), and nothing on the walked surface carries a tag yet.
  2. *** THE DIAL, AND IT IS HIS. *** One DEED_WEIGHT row turns all of this from
     "they remember" into "they judge". Nothing should invent it.
  3. WALKING IS SILENT -- one sfx message, zero footstep code, 97 approved sounds
     unplayed. SOUNDS.
  4. THE RIDGE EXTERIOR -- the one genuinely missing picture, and the only scene
     still carrying an honest needsArt. ART's.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/21 -- *** THE NUMBER MOVED AND NOBODY HAD SEEN
ANYTHING. THEY SEE IT NOW, AND THEY TELL EACH OTHER. TAB: RUN -- answer a claim,
then walk up to somebody who was standing there. The first row of their card says
SAW. Somebody who was not there, later, says HEARD. ***

engine/bohemia_deeds.js names the flaw in its own opening paragraph, 8/6: "the
faction standing got applied godlike -- the number moved, valley-wide, instantly,
and NOBODY HAD SEEN ANYTHING. So today a back-yard handshake and a public
humiliation in front of a whole block are worth the same." THE CITY WAS COMMITTING
EXACTLY THAT: you answer a claim to a person's face on a street,
BohemiaBelonging.adjust moves a valley-wide number, the whole outfit knows
instantly, and the man standing next to you knows nothing.
engine/bohemia_standing.js was built for this input on 8/2 -- witness, opinion,
gossip, hearsay decay, generational inheritance, 35 green claims -- and had no
caller anywhere. Yesterday this lane wired the witness ORGAN so people can SEE
you; this wires the DEED, so what they see you DO is a thing they hold and pass on.

ON THE CARD, first row, sitting directly above "NAME: YOU HAVE NOT ASKED":
    SAW    watched you turn an outfit down
A STRANGER WHOSE NAME YOU HAVE NEVER ASKED HAS ALREADY WATCHED YOU DO SOMETHING.
It leads because it is the only part of the card that is different because of what
you have DONE; every row below it is true of them on any day.

AND IT TRAVELS. Measured on the real surface:
    stood next to you          hops=0   SAW    watched you turn an outfit down
    sixty cells away           nothing  (no row at all)
    45 min beside the witness  hops=1   HEARD  heard you turned an outfit down
In most games every NPC knows everything the instant it happens with no route the
news could have taken. Here there is a route and the card shows which end of it
you are looking at.

THE WINDOW IS COUNTED IN GAME MINUTES, NOT FRAMES, and that is not a detail.
Counting frames would mean two neighbours could only talk while the PLAYER stood
watching them -- wrong about the world and unreachable in practice, because the
player walks twelve cells a game-minute so 45 minutes of watching is five hundred
cells of staring at the same two people. Elapsed clock time between passes is
credited instead. TOGETHER MEANS CONVERSATIONAL DISTANCE (2 cells), NOT SEE_RANGE
(9): you can watch something happen from nine tiles away, you cannot swap news
from there. A pair that separates loses its accumulated time rather than banking
it, which stops two people who merely pass each other daily from eventually
counting as having had a long conversation.

*** WHAT A DEED IS WORTH IS STILL HIS AND THAT IS WHY IT SHIPS EMPTY. ***
DEED_WEIGHT is blank ("NOTHING IS IN HERE and nothing in this file invents a
row"), opinionOf returns 0, standingOf returns NEUTRAL, and THE GATE ASSERTS BOTH
STAY THAT WAY -- if it ever stops being zero without a ruling, some lane invented
a number he did not give. That is also why the card reads the deed LEDGER instead
of becauseOf(): becauseOf is a JUDGEMENT query and filters on force, so it returns
nothing at all while the table is empty, but "he watched you refuse" is a FACT and
it is true today. The moment he rules ONE row, opinion, standing rungs and the
faction's whole view of you light up on this same data with NO wiring changed.

THE BOUNDARY IS ASSERTED, NOT PROMISED. Claims, belonging and commitment are the
FACTIONS lane's (last live 8/18). Nothing here changes what a claim COSTS, who may
ask, or how belonging moves, and A5 of the gate asserts their adjust() line is
intact and unchanged. This adds one sentence to the world: AND THESE SPECIFIC
PEOPLE SAW YOU DO IT.

THE KIND DOES NOT CARRY THE OUTFIT, on purpose: claim:met / claim:refused, never
claim:refused:REDS. He weighs an ACT once; a kind per faction grows his table with
the roster, and a bystander outside that outfit only knows you turned somebody
down anyway, which is what the words say. All words are DRAFT, in one table
(CT_DEED_WORDS).

gates: CITY DEEDS 20/0 (new, registered 303 of 402), CITY MEMORY 23, city_talk 18,
standing 35, memory 10 -- all green on the merged tree. Tool idempotent on the
FIRST try, md5-identical over three runs (the memory tool shipped with the
delete-half-missing bug yesterday, so this one carried the region marker from the
start). Mutation-proved three ways with arrival verified in the file under test
each time: gossip with no window -> 2 red; witness everyone regardless of distance
-> 4 red, including SAW and HEARD collapsing into the SAME SENTENCE; fire the deed
on an unresolved claim -> 1 red.
records/BOHEMIA_THE_NUMBER_MOVED_AND_NOBODY_SAW_8_20_26.md

WHAT COMES NEXT:
  1. *** THE THIRD ACT WORTH JUDGING. THIS LANE'S. *** Claims and commitments are
     wired. The other real choice on that card is the FAVOUR -- asking somebody
     for something -- and it is one ctDeed() line once somebody decides whether
     ASKING is a deed at all. Beyond that: bohemia_deeds.js can make a deed LOUDER
     or quieter from a quest's own #quiet/#reckless tag (reach and hops read from
     his CLOUT_WEIGHTS), and nothing on the walked surface carries a tag yet.
  2. *** THE DIAL, AND IT IS HIS. *** One DEED_WEIGHT row turns all of this from
     "they remember" into "they judge". Nothing should invent it.
  3. WALKING IS SILENT -- one sfx message, zero footstep code, 97 approved sounds
     unplayed. SOUNDS.
  4. THE RIDGE EXTERIOR -- the one genuinely missing picture, and the only scene
     still carrying an honest needsArt. ART's.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/21 -- *** THE NUMBER MOVED AND NOBODY HAD SEEN
ANYTHING. THEY SEE IT NOW, AND THEY TELL EACH OTHER. TAB: RUN -- answer a claim,
then walk up to somebody who was standing there. The first row of their card says
SAW. Somebody who was not there, later, says HEARD. ***

engine/bohemia_deeds.js names the flaw in its own opening paragraph, 8/6: "the
faction standing got applied godlike -- the number moved, valley-wide, instantly,
and NOBODY HAD SEEN ANYTHING. So today a back-yard handshake and a public
humiliation in front of a whole block are worth the same." THE CITY WAS COMMITTING
EXACTLY THAT: you answer a claim to a person's face on a street,
BohemiaBelonging.adjust moves a valley-wide number, the whole outfit knows
instantly, and the man standing next to you knows nothing.
engine/bohemia_standing.js was built for this input on 8/2 -- witness, opinion,
gossip, hearsay decay, generational inheritance, 35 green claims -- and had no
caller anywhere. Yesterday this lane wired the witness ORGAN so people can SEE
you; this wires the DEED, so what they see you DO is a thing they hold and pass on.

ON THE CARD, first row, sitting directly above "NAME: YOU HAVE NOT ASKED":
    SAW    watched you turn an outfit down
A STRANGER WHOSE NAME YOU HAVE NEVER ASKED HAS ALREADY WATCHED YOU DO SOMETHING.
It leads because it is the only part of the card that is different because of what
you have DONE; every row below it is true of them on any day.

AND IT TRAVELS. Measured on the real surface:
    stood next to you          hops=0   SAW    watched you turn an outfit down
    sixty cells away           nothing  (no row at all)
    45 min beside the witness  hops=1   HEARD  heard you turned an outfit down
In most games every NPC knows everything the instant it happens with no route the
news could have taken. Here there is a route and the card shows which end of it
you are looking at.

THE WINDOW IS COUNTED IN GAME MINUTES, NOT FRAMES, and that is not a detail.
Counting frames would mean two neighbours could only talk while the PLAYER stood
watching them -- wrong about the world and unreachable in practice, because the
player walks twelve cells a game-minute so 45 minutes of watching is five hundred
cells of staring at the same two people. Elapsed clock time between passes is
credited instead. TOGETHER MEANS CONVERSATIONAL DISTANCE (2 cells), NOT SEE_RANGE
(9): you can watch something happen from nine tiles away, you cannot swap news
from there. A pair that separates loses its accumulated time rather than banking
it, which stops two people who merely pass each other daily from eventually
counting as having had a long conversation.

*** WHAT A DEED IS WORTH IS STILL HIS AND THAT IS WHY IT SHIPS EMPTY. ***
DEED_WEIGHT is blank ("NOTHING IS IN HERE and nothing in this file invents a
row"), opinionOf returns 0, standingOf returns NEUTRAL, and THE GATE ASSERTS BOTH
STAY THAT WAY -- if it ever stops being zero without a ruling, some lane invented
a number he did not give. That is also why the card reads the deed LEDGER instead
of becauseOf(): becauseOf is a JUDGEMENT query and filters on force, so it returns
nothing at all while the table is empty, but "he watched you refuse" is a FACT and
it is true today. The moment he rules ONE row, opinion, standing rungs and the
faction's whole view of you light up on this same data with NO wiring changed.

THE BOUNDARY IS ASSERTED, NOT PROMISED. Claims, belonging and commitment are the
FACTIONS lane's (last live 8/18). Nothing here changes what a claim COSTS, who may
ask, or how belonging moves, and A5 of the gate asserts their adjust() line is
intact and unchanged. This adds one sentence to the world: AND THESE SPECIFIC
PEOPLE SAW YOU DO IT.

THE KIND DOES NOT CARRY THE OUTFIT, on purpose: claim:met / claim:refused, never
claim:refused:REDS. He weighs an ACT once; a kind per faction grows his table with
the roster, and a bystander outside that outfit only knows you turned somebody
down anyway, which is what the words say. All words are DRAFT, in one table
(CT_DEED_WORDS).

gates: CITY DEEDS 20/0 (new, registered 303 of 402), CITY MEMORY 23, city_talk 18,
standing 35, memory 10 -- all green on the merged tree. Tool idempotent on the
FIRST try, md5-identical over three runs (the memory tool shipped with the
delete-half-missing bug yesterday, so this one carried the region marker from the
start). Mutation-proved three ways with arrival verified in the file under test
each time: gossip with no window -> 2 red; witness everyone regardless of distance
-> 4 red, including SAW and HEARD collapsing into the SAME SENTENCE; fire the deed
on an unresolved claim -> 1 red.
records/BOHEMIA_THE_NUMBER_MOVED_AND_NOBODY_SAW_8_20_26.md

WHAT COMES NEXT:
  1. *** THE THIRD ACT WORTH JUDGING. THIS LANE'S. *** Claims and commitments are
     wired. The other real choice on that card is the FAVOUR -- asking somebody
     for something -- and it is one ctDeed() line once somebody decides whether
     ASKING is a deed at all. Beyond that: bohemia_deeds.js can make a deed LOUDER
     or quieter from a quest's own #quiet/#reckless tag (reach and hops read from
     his CLOUT_WEIGHTS), and nothing on the walked surface carries a tag yet.
  2. *** THE DIAL, AND IT IS HIS. *** One DEED_WEIGHT row turns all of this from
     "they remember" into "they judge". Nothing should invent it.
  3. WALKING IS SILENT -- one sfx message, zero footstep code, 97 approved sounds
     unplayed. SOUNDS.
  4. THE RIDGE EXTERIOR -- the one genuinely missing picture, and the only scene
     still carrying an honest needsArt. ART's.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/20 -- *** NOBODY IN THIS GAME HAD EVER REMEMBERED
SEEING YOU. THEY DO NOW. TAB: RUN -- walk up to anybody and the line above the
movement pad starts with what they remember of you. ***

engine/bohemia_memory.js is the witness organ: minds hold sightings, familiarity
slows forgetting, clarity decays as 0.5^(age/halflife), deterministic. Written
7/19, TEN GREEN CLAIMS in memory_gate for a month. engine/bohemia_standing.js
sits on top of it, 344 lines, THIRTY-FIVE more green claims. Measured 8/20:
NEITHER APPEARS IN ANY FILE A PLAYER CAN REACH. Forty-five green assertions about
people remembering you, and not one person in the game who had ever remembered
anything. Twelfth built-and-gated-and-unreachable capability this lane has closed.

*** AND THE GAME HAD ALREADY WRITTEN THE FINDING DOWN. *** xchWorld's own comment,
dated 8/18: "bohemia_deeds.js and bohemia_standing.js both exist in engine/ and
NEITHER IS IN THIS FILE (measured 8/18: zero occurrences)". Measured correctly,
recorded accurately, substituted around with a counter of doors knocked, and left
true for two days. A FINDING RECORDED IN A COMMENT IS NOT A FINDING FIXED.

WHO CAN SEE YOU IS WHO THE GAME ACTUALLY DREW. Witnesses come off BARK_DREW, the
list peoplePass fills with the bodies it really blitted, positions included. A
second visibility calculation is a second answer and the two drift; worse, it can
credit a sighting to somebody who is not on screen.

A RECOGNITION IS NOT A NAME. YOU HAVE TO ASK (7/31) is untouched -- nameOf still
returns null for a stranger and nothing here prints one. A face is not a name, and
that gap is exactly the difference between a crowd and a neighbourhood.

THE FOUR STATES, measured by winding the REAL clock on the REAL surface:
    0h   clarity 1.000   has seen you before
    12h  clarity 0.707   has seen you before
    20h  clarity 0.561   half-remembers you
    67h  clarity 0.146   almost places you
    far enough, below 0.05      NOTHING. A STRANGER AGAIN.
That last row is the redemption path New Vegas never had (its reputation can only
be buried, never removed), and a mutation making recognition permanent goes red.
FAMILIARITY IS A SEPARATE AXIS and counts ENCOUNTERS not frames -- walking past
somebody for an hour is one encounter; three separate meetings reads "knows you by
now". All four phrases are DRAFT, in one table (CT_KNOWS), his to rewrite.

DELIBERATELY NOT HERE: no opinion, gossip or standing rung (those are
bohemia_standing on top of this organ and they need DEEDS), and no mechanical
bonus for being known, because what recognition is WORTH is a dial.

THREE THINGS THIS GOT WRONG FIRST, all three worth keeping:
  - A THROTTLE THAT MARKS THE WORK DONE BEFORE DOING IT IS A DROPPED FRAME WITH A
    RECEIPT. The pass runs once per game-minute and marked the minute BEFORE
    reading the roster. peoplePass returns early while the sprite bakes, so the
    boot render left BARK_DREW empty, recorded nobody, and burned the minute --
    the neighbour TWO CELLS AWAY never saw you until you had walked twelve cells
    away, which is out of his sight. Found by measuring, not reading.
  - A WHOLE-REGION REPLACE IS A DELETE PLUS AN INSERT AND I WROTE ONLY THE INSERT.
    The refresh branch re-appended the store: second run +105 lines, third the
    same again. Caught by running the tool THREE TIMES and comparing md5. That is
    now how this tool is checked.
  - AN ASSERTION THE SCENARIO NEVER EXERCISES PROVES NOTHING. "Nobody outside
    SEE_RANGE ever witnessed anything" stayed GREEN with the range check DELETED,
    because only one body is drawn at boot and it is already two cells away. The
    gate now PLACES a body out of range and one in it and reads the rule off what
    happens to them. Same family as the threshold bigger than the room.

MEASURED AND WORTH KNOWING: 298 people in the valley, 298 distinct record ids,
ZERO collisions -- so p.id is safe as a mind key. The __CITY_VALLEYKEY__ comment
warning about shared ids is about the AGENT id from ctAgent, a different id. Both
comments are right about different things; I measured rather than picking one.

gates: CITY MEMORY 23/0 (new, registered 302 of 400), city_talk 18, city_people 18,
memory 10, standing 35, quirk 38 -- all green alongside the WORLD lane's sidewalk
and mob work in the same file. Tool idempotent, md5-identical over three runs.
Mutation-proved four ways with arrival verified in the file under test each time.
records/BOHEMIA_THE_BLOCK_KNOWS_YOUR_FACE_8_20_26.md

WHAT COMES NEXT:
  1. *** DEEDS. THIS LANE'S, AND IT IS THE NEXT ONE. *** The organ now records
     that people SAW you. It cannot record what they saw you DO, because the
     walked city has no act big enough to judge. bohemia_standing.js is written,
     gated and waiting for exactly that input, and bohemia_deeds.js already turns
     a quest outcome into an audience via the corpus's own #quiet/#reckless tags.
     BOUNDARY: commitments and the wall are the FACTIONS lane's (their
     __CITY_STANDING__ / whoHears block); they were last live 8/19. The witness
     organ and the memory key are this lane's.
  2. WALKING IS SILENT -- one sfx message, zero footstep code, 97 approved sounds
     unplayed. SOUNDS.
  3. NO FIGHT ON THE WALKED SURFACE -- the startEncounter hits in the city are
     comments. RUN + COMBAT.
  4. THE RIDGE EXTERIOR -- the one genuinely missing picture, and the only scene
     still carrying an honest needsArt. ART's.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/20 -- *** FOUR OF MY ASSERTIONS COULD NOT FAIL,
AND THEN THE PICTURE FOUND A FIFTH BUG ALL OF THEM MISSED. TAB: CUTSCENE, the
FOURTH chip, THE LAST ROOM -- three people STANDING in the family's house, on the
floor rather than on the chairs. ***

THE GATE SAID 44 PASSED 0 FAILED AND FOUR WERE DECORATION. coldopen_gate.js is
ok(CONDITION, message). The other three gates this lane owns -- scene_gate,
quirk_gate, attempt_gate -- are ok(MESSAGE, condition). Four new standing checks
were written in the habit of the three and landed in the one, so the condition
slot got a message string. A non-empty string is truthy. All four passed
unconditionally, over code that had been deliberately broken.

HOW IT WAS CAUGHT: THE MUTATION DID NOT BITE. `var standing = false;` left the
gate green. The comfortable explanation was that the mutation never reached the
alpha the gate loads, so the test was re-run with a PROOF step wedged in:
    PROOF mutation is in the alpha under test: 1
    COLD OPEN GATE: 44 passed, 0 failed
Demonstrably present, gate did not care. A MUTATION TEST THAT DOES NOT PROVE THE
MUTATION ARRIVED IS TESTING THE ORIGINAL CODE. That proof line is permanent now.

THE FIX IS NOT THE FOUR CALLS -- that leaves the trap armed for the fifth. The
SLOT DEFENDS ITSELF in all four gates: a string in the condition slot throws, a
non-string in the message slot throws, both directions, proved by reversing a
real call in scene_gate. A GATE CANNOT BE CHECKED BY THE GATE SUITE, IT IS THE
CHECKER -- inside ok() is the only place this is catchable.

SWEPT ALL 310 GATES BEFORE TOUCHING ANYTHING OUTSIDE THIS LANE: zero vacuous
calls anywhere else. Two flagged files were the sweeper's own template-literal
parsing, checked by eye and cleared. My bug, not repo rot; the other 306 untouched.

THEN THE THIRD ASSERTION WAS WRONG ON ITS MERITS. "They stand where the camera is
looking" asked ONE Manhattan distance against a constant 8 -- and the living room
is 10x9, so the room's own far corner, the exact wrong answer it exists to catch,
measured 7. THE THRESHOLD WAS LARGER THAN THE ROOM. Measured both ways on the real
alpha: correct dx 0/0/2 dy 1/2/0, corner default dx 4/4/3 dy 3/2/3. Rewritten as
per-axis containment in the focus RECT plus one cell of spill -- a margin that
scales with the scene's geometry. Third time this lane has hit that family.

AND THEN THE SCREENSHOT FOUND WHAT FIVE GREEN ASSERTIONS COULD NOT: two of the
three were STANDING ON THE DINING CHAIRS. Seating.stand() takes the nearest free
non-solid cell and a chair is both; the check meant to notice asked whether they
were near the CAMERA, and a chair is extremely near the camera. Fixed in
Seating.stand() not the scene (standing on furniture is wrong for every caller):
floor first, seat cells only if nothing else is free. A PREFERENCE NOT A
PROHIBITION -- in an all-furniture room standing on a chair beats vanishing, same
reason sit() already falls back to standing. Sixth assertion added, counts stand
bodies whose cell is in furn.seats.

THE LAST ROOM'S needsArt WAS WRONG, AND EXPENSIVELY. It declared the house-after
picture missing when that interior has been drawn since 8/9. What was missing was
THE POSE, not the picture: the surface posed every actor sit-chair because the
only scene that had ever existed was a dinner table, so reusing the house would
have sat three people down to dinner in the room they just fought through.
bohemia_stage.js has carried Seating.stand() with ZERO CALLERS the whole time --
eleventh built-and-gated-and-unreachable capability this lane has found. A
CAPABILITY NOBODY CALLS LOOKS EXACTLY LIKE A MISSING FEATURE, and the cheap
mistake is to go build the feature again. It now plays in family_table, lantern
lit, three people on their feet.

MUTATION-PROVED FIVE WAYS, each with arrival verified in the alpha before running:
    nobody ever stands            -> 1 red (0 standing, 3 seated)
    focus RECT where a CELL wanted-> 2 red (0/3 placed, the silent-vanish bug)
    no standing clip baked        -> 1 red (4 seated-only)
    stand at the default corner   -> 1 red (2 off-focus)
    let stand() take chairs again -> 1 red (2 on furniture, of 8 seat cells)

AND ONE THAT COST WORK: undoing a one-line test mutation with `git checkout
gates/coldopen_gate.js` DELETED EVERY UNCOMMITTED LINE IN THAT FILE -- the whole
standing block, the guard, the four corrections. git checkout <file> IS NOT AN
UNDO, IT IS A RESTORE FROM HEAD, and it does not know which of your lines you
meant. Same family as the 8/17 whole-region replace that ate another lane's work.
Every mutation since is backed up to scratch and restored by copy.

gates: COLD OPEN 44 -> 45, SCENE 101, STAGE 42, QUIRK 38, ATTEMPT 15. All green
on the merged tree. records/BOHEMIA_FOUR_ASSERTIONS_THAT_COULD_NOT_FAIL_8_20_26.md

*** STILL SHARPER THAN "COLD_OPEN.cast IS EMPTY", AND IT CHANGES WHOSE JOB IT IS:
measured inside the combat frame, placeHoldLine(spec) reads ONLY spec.holdLine.
The frame has NO CONCEPT of people or a place behind you -- cast and place are
consumed by nothing. Filling them would be data nothing reads. Not a content fill
this lane could do; a feature COMBAT would have to build.

WHAT COMES NEXT -- the first three are NOT this lane's:
  1. WALKING IS SILENT. The city sends exactly ONE sfx message and has ZERO
     footstep code, while 97 approved sounds sit unplayed. SOUNDS.
  2. NO FIGHT ON THE WALKED SURFACE -- the startEncounter hits in the city are
     comments. RUN + COMBAT. (The COLD OPEN raid is wired and runs; this is the
     other one.)
  3. ONE MISSING PICTURE, ART's: the ridge exterior (money shot + title screen +
     last frame of the tutorial, one image). It is now the ONLY scene still
     carrying an honest needsArt -- the house-after turned out not to be missing.
  4. THIS LANE'S OWN NEXT: DEEDS AND STANDING are still absent from the city (0
     occurrences, ~18 days). Two modules that know what the player was SEEN
     doing. BOUNDARY: the rich deed sources on the talk card are the FACTIONS
     lane's sentinels and THEY ARE LIVE, so check before starting.
     bohemia_memory.js is also absent, so it is 3+ modules and a corpus, not a
     wiring job.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/20 -- *** HIS SENTENCE FOR BEAT 1 HAS THREE
CLAUSES AND THE GAME PLAYED ONE. THE LAST ROOM. TAB: CUTSCENE, chip 2; in the
game it plays the moment the raid ends. ***

7/19, verbatim: "defending the home room to room, A SIBLING IS KILLED, IT ENDS
SAVING THE MOTHER." The implementation ended when the last hostile dropped. You
never reached her, and the person who was taken was simply ABSENT from the next
scene: you win the fight, the screen changes, and the next thing you see is a
dinner table the following evening with one fewer chair, having been told
nothing. THE RAID ONLY STARTED RUNNING YESTERDAY, so that gap became reachable
for the first time -- and what it reached was nothing.

NOT A FOURTH BEAT. His law crystallizes THREE and this lane does not get to make
it four. THE LAST ROOM is the back half of the first one -- the raid's `then`
target -- and it hands on to THE GRIEF DINNER itself:
    cold open --combat--> THE RAID --then--> the last room --> grief dinner --> the ridge

TWO LINES AND A SILENCE:
    mother          Where's NINA.          (no question mark; she is not asking)
    (three seconds of nobody answering -- the longest hold in the scene, asserted)
    sibling_older   Don't go back in there.
Five words that confirm it without the word, tell you the older sibling SAW it,
and are the co-founder of the city being born. NOBODY SAYS died/dead/killed/gone.

WHAT IT REFUSES TO DO: the death is NOT staged, and staging it would overwrite a
ruling with a picture -- his law puts it "during the raid, away from [the table],
in motion, in the house". The lost sibling is not an actor in this room and the
gate asserts she is not. The FATHER's presence is STILL not decided: his ruling,
and the DIRECT tab is one actor beat from making it.

gates: SCENE 86 -> 102, mutation-tested three ways.

*** AND A LESSON ABOUT MY OWN GATES: *** 3f pinned the raid's return target to
the grief dinner BY FILENAME, so a legitimate change looked like a regression.
AN ASSERTION THAT PINS TODAY'S ANSWER INSTEAD OF TODAY'S RULE FAILS THE DAY THE
ANSWER LEGITIMATELY CHANGES. It now asserts the target RESOLVES, and a new 3h
asserts the whole chain order end to end.

*** SHARPER THAN "COLD_OPEN.cast IS EMPTY", AND IT CHANGES WHOSE JOB IT IS: ***
measured inside the combat frame, placeHoldLine(spec) reads ONLY spec.holdLine.
The frame has NO CONCEPT of people or a place behind you at all -- cast and place
are consumed by nothing. So filling them would be data nothing reads (the exact
hook-that-never-fires failure). It is not a content fill this lane could do, it
is a feature COMBAT would have to build.

WHAT COMES NEXT -- and per the 8/20 coordinator re-audit the demo is TWO things
away, NEITHER of them this lane's:
  1. WALKING IS SILENT. The city sends exactly ONE sfx message and has ZERO
     footstep code, while 97 approved sounds sit unplayed. SOUNDS.
  2. NO FIGHT ON THE WALKED SURFACE -- the startEncounter hits in the city are
     comments. RUN + COMBAT. (The COLD OPEN raid is wired and runs; this is the
     other one.)
  3. TWO MISSING PICTURES, both ART's: the ridge exterior (money shot + title
     screen + last frame of the tutorial, one image) and the house-after. Both
     scenes play their words over an honest frame that names what is missing.
  4. THIS LANE'S OWN NEXT: DEEDS AND STANDING are still absent from the city (0
     occurrences, ~18 days). Two modules that know what the player was SEEN
     doing. BOUNDARY: the rich deed sources on the talk card are the FACTIONS
     lane's sentinels and THEY ARE LIVE (they corrected row 7 today), so check
     before starting. bohemia_memory.js is also absent, so it is 3+ modules and
     a corpus, not a wiring job.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/20 -- *** HIS SENTENCE FOR BEAT 1 HAS THREE
CLAUSES AND THE GAME PLAYED ONE. THE LAST ROOM. TAB: CUTSCENE, chip 2; in the
game it plays the moment the raid ends. ***

7/19, verbatim: "defending the home room to room, A SIBLING IS KILLED, IT ENDS
SAVING THE MOTHER." The implementation ended when the last hostile dropped. You
never reached her, and the person who was taken was simply ABSENT from the next
scene: you win the fight, the screen changes, and the next thing you see is a
dinner table the following evening with one fewer chair, having been told
nothing. THE RAID ONLY STARTED RUNNING YESTERDAY, so that gap became reachable
for the first time -- and what it reached was nothing.

NOT A FOURTH BEAT. His law crystallizes THREE and this lane does not get to make
it four. THE LAST ROOM is the back half of the first one -- the raid's `then`
target -- and it hands on to THE GRIEF DINNER itself:
    cold open --combat--> THE RAID --then--> the last room --> grief dinner --> the ridge

TWO LINES AND A SILENCE:
    mother          Where's NINA.          (no question mark; she is not asking)
    (three seconds of nobody answering -- the longest hold in the scene, asserted)
    sibling_older   Don't go back in there.
Five words that confirm it without the word, tell you the older sibling SAW it,
and are the co-founder of the city being born. NOBODY SAYS died/dead/killed/gone.

WHAT IT REFUSES TO DO: the death is NOT staged, and staging it would overwrite a
ruling with a picture -- his law puts it "during the raid, away from [the table],
in motion, in the house". The lost sibling is not an actor in this room and the
gate asserts she is not. The FATHER's presence is STILL not decided: his ruling,
and the DIRECT tab is one actor beat from making it.

gates: SCENE 86 -> 102, mutation-tested three ways.

*** AND A LESSON ABOUT MY OWN GATES: *** 3f pinned the raid's return target to
the grief dinner BY FILENAME, so a legitimate change looked like a regression.
AN ASSERTION THAT PINS TODAY'S ANSWER INSTEAD OF TODAY'S RULE FAILS THE DAY THE
ANSWER LEGITIMATELY CHANGES. It now asserts the target RESOLVES, and a new 3h
asserts the whole chain order end to end.

*** SHARPER THAN "COLD_OPEN.cast IS EMPTY", AND IT CHANGES WHOSE JOB IT IS: ***
measured inside the combat frame, placeHoldLine(spec) reads ONLY spec.holdLine.
The frame has NO CONCEPT of people or a place behind you at all -- cast and place
are consumed by nothing. So filling them would be data nothing reads (the exact
hook-that-never-fires failure). It is not a content fill this lane could do, it
is a feature COMBAT would have to build.

WHAT COMES NEXT -- and per the 8/20 coordinator re-audit the demo is TWO things
away, NEITHER of them this lane's:
  1. WALKING IS SILENT. The city sends exactly ONE sfx message and has ZERO
     footstep code, while 97 approved sounds sit unplayed. SOUNDS.
  2. NO FIGHT ON THE WALKED SURFACE -- the startEncounter hits in the city are
     comments. RUN + COMBAT. (The COLD OPEN raid is wired and runs; this is the
     other one.)
  3. TWO MISSING PICTURES, both ART's: the ridge exterior (money shot + title
     screen + last frame of the tutorial, one image) and the house-after. Both
     scenes play their words over an honest frame that names what is missing.
  4. THIS LANE'S OWN NEXT: DEEDS AND STANDING are still absent from the city (0
     occurrences, ~18 days). Two modules that know what the player was SEEN
     doing. BOUNDARY: the rich deed sources on the talk card are the FACTIONS
     lane's sentinels and THEY ARE LIVE (they corrected row 7 today), so check
     before starting. bohemia_memory.js is also absent, so it is 3+ modules and
     a corpus, not a wiring job.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/20 -- *** WHAT YOU NOTICE ABOUT SOMEBODY BEFORE
EITHER OF YOU SPEAKS. TAB: RUN -- walk up to anybody and read the line above the
movement pad. ***

bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 (third person,
no dialogue) and tellFor() had never once been called by anything a player could
see. NINTH time this lane has closed that shape.

THE HOLE, MEASURED: standing next to anybody on the walked surface, the ENTIRE
text on screen was the one button, and the button says their TRADE. Eighty-eight
people on a settlement block and every one of them the word SCAVENGER. Now each
one is somebody doing something specific.

A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched: nameOf() still
returns null for a stranger and the tell never prints one. You can watch somebody
straighten what is already straight without being introduced, and noticing it is
how you decide to talk to them at all -- so the tell shows for a STRANGER while
the name still does not. It reads through qkOf(), the block-de-collided answer,
so what you notice at a glance is the same person you meet on the card and nobody
on the street shares a tell.

*** THE POSITION IS MEASURED, NOT CHOSEN, AND THE FIRST CUT FAILED IT. *** At
bottom:112 the line ran straight THROUGH the movement pad: unreadable, and
sitting on taps meant for the pad. Caught by SCREENSHOTTING it -- no assertion
existed that could have. Measured the real HUD (nav owns x198-378 below y618; the
note/rung/bike stack owns the bottom-left below y714), found the clear band above
y618, and THE OVERLAP IS NOW AN ASSERTION with the boxes printed in it.

THREE GATE BUGS FIXED ON THE WAY, every one test-state pollution rather than a
feature fault, and the lesson is one line: A PROBE THAT INHERITS ANOTHER PROBE'S
STATE MEASURES THAT STATE.
  1. it inherited an OPEN CARD from earlier assertions, and ctVerb correctly
     hides the button AND the tell whenever a card is up;
  2. it compared against the person it WALKED TO instead of the one
     ctAdjacent() actually PICKED (a neighbour can be closer);
  3. it measured "a stranger" on a block where an earlier assertion had already
     asked twelve people their names, so it reset the met-ledger and asserted
     the LAW instead of the leftovers.

gates: QUIRK 32 -> 38, mutation-tested two ways.

*** FOR WHOEVER OWNS THE WORKFLOW (RUN, under the 8/20 suite fold): THE PAGES
CHECKOUT TOOK TEN MINUTES. *** Two numbers, same repo, same workflow, same day,
both deploys mine:
    01:17  THE RAID RUNS      actions/checkout@v4 =  18 seconds
    17:01  WHAT YOU NOTICE    actions/checkout@v4 = 609 seconds
34x in one day. Everything after checkout stayed fast in both (assemble instant,
upload 8s, deploy-pages 11s) and BOTH RUNS SUCCEEDED -- nothing is broken, it is
getting expensive. Supporting facts measured here: .git is 6.8 GB against a
615 MB working tree, and slices/BOHEMIA_ALPHA_0_9.html has 515 commits at ~4 MB
while the LEGACY, never-displayed BOHEMIA_RUN_CURRENT.html has 149 at 17 MB --
single-line inlined payloads, near worst case for delta compression.
I AM DELIBERATELY NOT DIAGNOSING IT. I raised repo size as a cause on 8/19 and
had to correct myself the same turn when a second sample came back at 22s. Two
points are a line only if you already believe the line. The cheap first move is
a THIRD DATA POINT, not a fix: watch the checkout duration on the next few pages
runs. If it stays in the hundreds of seconds, `fetch-depth: 1` on that checkout
is one line, touches no history, and a deploy that copies slices/ into a bucket
does not need 6.8 GB of it. Full record with the numbers and the risk-ordered
levers: records/BOHEMIA_THE_CHECKOUT_TOOK_TEN_MINUTES_8_20_26.md

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** [PENDING Paolo] since 8/8, but his 7/19 law rules both
     ("defending the home room to room... it ends saving the mother"). The raid
     RUNS now, so this is visible instead of academic. COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place. RUN's day loop.
  4. DEEDS AND STANDING are still not in the city at all -- two modules that know
     what the player was SEEN doing, absent from the surface he plays. MINE, but
     the rich deed sources on the talk card are the FACTIONS lane's sentinels, so
     check who is live before starting.
PEOPLE (people-7h9sfy): 8/20 -- *** THE RAID RUNS. The sibling can
finally die in the played game. TAB: RUN on a fresh device -- the opening plays
the cold open, hands you into the COMBAT tab for the raid, and comes back for
the grief dinner and the burial on the ridge. ***

FOR TWELVE DAYS startColdOpen(onEnd) had ONE occurrence in the alpha, its own
definition, and ZERO callers. So the game went warm dinner -> the cut -> "get to
the back door" -> you wake up on day 1 and get a job. The death the entire
opening is built on did not happen, the grief dinner mourned nothing and the
burial buried nobody. Every gate green the whole time.

THIS LANE FLAGGED IT TWICE AND THEN TOOK IT, after re-checking the boundary:
  - P0-DOOR row 10 nominally claims the surface switch for RUN, but its line
    reference (ALPHA:21436-21438, "calls the fight WITHOUT switching tabs") is
    STALE -- that region is wardrobe code now, and no such call exists anywhere,
    because there is no call at all.
  - Nothing needed inventing: cityEncounterIn() has done this exact dance for
    weeks (show the panel, ensure the frame, wait, start the encounter) and its
    OWN comment says why a second one would be wrong -- "a second handoff path is
    the duplicate-system mistake this repo keeps paying for". So this mirrors it.
  - Every piece was already published: COMBAT exposed startColdOpen(onEnd) for a
    scene to name, my scene names it, scene_gate has asserted those two names
    match since 8/11, showTabPanel is the alpha's own switcher, and
    enc.onEnd(enc.outcome) already fires when a fight settles.
No combat code, no encounter spec, no dials touched. IT FAILS SAFE: no seam, no
switcher, or a throw, and the opening ends exactly the way it did before.

*** THE BUG I SHIPPED AND CAUGHT BY DRIVING IT, AND THE LESSON IS THE POINT: ***
the raid fired correctly and the RESUME was broken. openContinue read the cold
open's handoff, saw to:'combat', found nothing to chain, and ended the opening --
the grief dinner would never have played AFTER the fight. returns:true said
control comes back and named nothing to come back TO.
  IT WOULD HAVE SHIPPED GREEN. Until this turn the raid had NEVER RUN AT ALL, so
  the resume path had never once been reached. A CODE PATH DOWNSTREAM OF
  SOMETHING THAT NEVER EXECUTES CANNOT BE CAUGHT BY A GATE THAT DOES NOT EXECUTE
  IT EITHER. The only reason it surfaced is that driving the real surface finally
  got that far.
Fixed with data rather than a special case: a handoff says `then` -- what plays
when it comes back. His law puts THE GRIEF DINNER there, in those words.

gates: SCENE 77 -> 86, mutation-tested two ways. Full chain driven on the real
page: cold open -> showTabPanel:combat -> startColdOpen called -> resume ->
act1_grief_dinner -> act1_ridge_burial. Zero page errors.

ALSO CONFIRMED THIS TURN: none of the 29 reds on the fleet's first complete gate
picture (8479625, 386/386 run in shards) is a PEOPLE gate. This lane is clean on
that baseline. That sharding came out of the suite-timeout finding this lane
filed on 8/19, acted on within a day.

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** COLD_OPEN.cast IS [] AND COLD_OPEN.place IS null. NOBODY IS BEHIND YOU
     IN THE DEFENCE. *** Marked [PENDING Paolo] since 8/8, but his 7/19 law rules
     both ("defending the home room to room... it ends saving the mother"), so
     the marker is stale the way the demo-scope banner was until 8/14. The raid
     running is exactly what makes this matter now instead of being academic.
     COMBAT's.
  2. THE RIDGE EXTERIOR. Money shot, title screen and last frame of the tutorial
     are one image and it does not exist; the burial plays its words over an
     honest empty frame that says so. ART's.
  3. BIND THE BURIAL TO THE REAL VISTA OVERLOOK so the grave and the money shot
     are one place rather than two views of the same valley. RUN's day loop.
  4. THE TELL is authored, gated and still on no surface (BohemiaQuirk.tellFor(),
     all 22 shapes). MINE.
  5. DEEDS AND STANDING still absent from the city. Boundary: the rich deed
     sources on the talk card are the FACTIONS lane's sentinels. MINE, carefully.

PEOPLE (people-7h9sfy): 8/19 -- *** THE RAID HAS NO CALLER. The sibling
never dies in the played game. TAB: CUTSCENE plays all three beats; RUN plays
only the first and stops before the raid, on purpose. ***

MEASURED, ONE COMMAND:
    $ grep -n "startColdOpen(" slices/BOHEMIA_ALPHA_0_9.html
    7983:function startColdOpen(onEnd){ return startEncounter(coldOpenSpec(onEnd)); }
ONE OCCURRENCE. ITS OWN DEFINITION. ZERO CALLERS.

The family-defense encounter is the combat tutorial, the raid, and the scene the
sibling is killed in. It has never been played from anywhere. So the game as it
boots is: the warm dinner, the cut, the father says get to the back door, AND
THEN YOU WAKE UP ON DAY 1 AND GET A JOB. The death does not happen. The premise
of the entire demo is absent from the demo.

IT EXPLAINS THREE THINGS AT ONCE: COLD_OPEN.cast being empty never mattered
because the defence never runs; the grief dinner grieves a death that did not
occur; and the burial shipped an hour earlier buries somebody the player never
saw die. This is the EIGHTH instance of this lane's most expensive recurring
shape -- built, gated, published seam, zero callers. The vista was this. The
payday bridge was this. The barks were this. Every piece is real and nothing is
joined.

SHIPPED, the half that IS this lane's (record: records/BOHEMIA_THE_RAID_HAS_NO_
CALLER_8_19_26.md): his law says the three beats "fuse into ONE UNBROKEN
SEQUENCE" and the opening runner played scene 1 and called openDone, so beats 2
and 3 had never happened in the played game -- chips in a dev tab. The runner
now reads what a scene says comes next, out of the scene's own handoff beat:
    act1_cold_open     ->  combat:startColdOpen
    act1_grief_dinner  ->  scene:act1_ridge_burial
    act1_ridge_burial  ->  END
Proved on the real page: started at the grief dinner, the burial followed on its
own, zero page errors.

*** AND A HANDOFF IT CANNOT HONOUR STOPS THE SEQUENCE, IT NEVER SKIPS IT. ***
Auto-advancing past the combat handoff would seat the family down to mourn
somebody the player watched walk to the back door ninety seconds earlier and
never saw again. That is worse than stopping AND IT WOULD HAVE LOOKED LIKE A
FEATURE. openContinue() is the published seam for whoever wires the fight.

WHY THE FIGHT WAS NOT WIRED HERE, and check this before you decide to do it:
  1. startEncounter posts to the combat frame WITHOUT switching the visible
     surface, so calling it from the opening runs the raid behind the cutscene
     canvas. That is backlog P0-DOOR row 10, already written down and already
     claimed by RUN: "switch the surface with the handoff."
  2. COMBAT shipped encounter work the same day (THREE MEN, NOT EIGHT).
Using their published entry point is fair. Choreographing the tab switch, the
overlay teardown and the return, in a demo path another lane is mid-flight on,
is not.

ALSO FIXED: the opening caption was hardcoded pre_collapse ? "BEFORE" : "TEN
YEARS LATER" (the same bug the CUTSCENE tab had), so the morning after the raid
read "ten years later" on both surfaces; scenes say `when` now. And openScene
applied his DIRECT edits to the OPENER ONLY -- the day a second scene played,
canon would have quietly shipped over the top of his rewrites.

gates: SCENE 69 -> 77, mutation-tested two ways.

WHAT COMES NEXT, IN ORDER OF WHAT IT COSTS THE DEMO:
  1. *** WIRE THE RAID (RUN + COMBAT). *** Without it there is no death, and
     without the death the grief dinner, the burial, the vista and the whole
     dynasty premise are decoration. One call to a function that already exists,
     plus the surface switch P0-DOOR row 10 already scopes.
  2. COLD_OPEN.cast is [] and COLD_OPEN.place is null, [PENDING Paolo] since
     8/8 -- but his 7/19 law rules both. Stale marker. (COMBAT.)
  3. The ridge exterior: money shot, title screen and last frame of the tutorial
     are one image and it does not exist. (ART.)
  4. THE TELL is authored, gated, still on no surface (BohemiaQuirk.tellFor()).
  5. DEEDS AND STANDING still absent from the city. Boundary: the rich deed
     sources on the talk card are the FACTIONS lane's sentinels.

PEOPLE (people-7h9sfy): 8/19 -- *** BEAT 3 OF HIS LOCKED OPENING EXISTED
ONLY IN THE LAW. The burial on the ridge is built. TAB: CUTSCENE, third chip,
THE BURIAL ON THE RIDGE. The picture is not there yet and the frame says so. ***

His 7/19 law does not call the opening a sketch, it calls it CRYSTALLIZED and
lists three beats: NIGHT RAID, GRIEF DINNER, BURIAL ON THE RIDGE ("tutorial ends
here"). Scenes 1 and 2 shipped 8/9-8/11. Scene 3 was never built, and scene 2
ends with the mother saying "We go up in the morning" with nothing to go up to.
WORSE THAN MISSING, INVERTED: the vista already ships and already plays on the
day 2 morning with NO grave and NO family in it, so the demo showed the player
Bohemia's beauty completely unbound from the loss. His ruling is the opposite --
"the first time you ever see Bohemia's beauty, you see it through tears, over a
fresh grave... you can never take that view again without the grave in the
foreground" -- and THE RIDGE = THE MENU / TITLE SCREEN is locked on top of it.

SHIPPED (record: records/BOHEMIA_THE_BURIAL_ON_THE_RIDGE_8_19_26.md): 15 beats,
5 drafted cited lines, 21 seconds. The valley reveal is SILENT for six beats,
because his match-cut shows the whole apocalypse "without a word" and the valley
gets the same respect. Grief arrives as labour, not a speech. Two small memories
that are deliberately NOT the green-ones bit, since that ran its three instances
and a fourth would cheapen the grief-dinner one. And the load-bearing line:
"Everything we build down there, {sibling_lost} is up here looking at it" -- the
first time anybody says the family will BUILD something, said over a grave, which
turns the title screen into a promise somebody made out loud. The grief dinner
hands off to it (returns:false, his law ends the tutorial there), so the authored
opening is finally one unbroken chain.

*** THE PICTURE WAS WRONG AND I ALMOST SHIPPED IT. READ THIS ONE. ***
The cutscene surface builds an INTERIOR and only an interior: wall tiles, floor,
baseboard, window, table, and bodies posed sit-chair in seats derived from the
furniture. Handed an outdoor burial it DID NOT FAIL. It silently generated the
family's living room and sat three people down at the dinner table for a burial
on a hilltop. Every gate green. Caught by rendering it and looking at it.
  A burial drawn as dinner is not a placeholder, it is a lie about the beat.
  Drawing the wrong room would have been the easy green.
So a scene now DECLARES what it cannot be drawn as (`needsArt`) and the surface
REFUSES to draw it wrong, returning an honest frame: NO SET ART YET / RIDGE
EXTERIOR, THE VALLEY BELOW, A FRESH GRAVE / THE WORDS PLAY; THE PICTURE IS
OUTSTANDING. The captions still play in order on the beat, which is what the tab
is for while art is owed, and the gap is now visible to whoever can close it.

ALSO FIXED, same frame: the state caption was hardcoded to
`pre_collapse ? "before" : "ten years later"`, so the morning after the raid was
captioned "ten years later". A scene says `when` it is now.

gates: SCENE 54 -> 69, mutation-tested three ways (break the chain -> 2 red; talk
over the reveal -> 2 red; let the surface draw the wrong room -> 1 red).

WHAT COMES NEXT, in order:
  1. *** THE RIDGE EXTERIOR IS THE DEMO'S BIGGEST MISSING PICTURE AND IT IS
     ART'S. *** The money shot, the title screen and the last frame of the
     tutorial are all the same image, and none of them exists.
  2. BIND THE SCENE TO THE REAL VISTA OVERLOOK so the burial and the vista are
     one place rather than two views of the same valley. The vista's caller is
     the day loop, which is RUN's, so this is a joint and not a solo.
  3. *** FOR COMBAT, NOT TOUCHED BY THIS LANE: NOBODY IS BEHIND YOU IN THE FIGHT
     YOU ARE TOLD TO DEFEND. *** COLD_OPEN.cast is [] and COLD_OPEN.place is
     null, both marked [PENDING Paolo] since 8/8 -- but his 7/19 law rules both
     ("defending the home room to room... a sibling is killed, it ends saving the
     mother"), so that marker is STALE exactly the way the demo-scope banner was
     until 8/14. There is nothing to lose in the encounter the whole opening is
     built around losing somebody in. LEFT ALONE ON PURPOSE: combat shipped
     encounter work the same day and it is their system.
  4. THE TELL is authored, gated and still not on any surface
     (BohemiaQuirk.tellFor(), all 22 shapes).
  5. DEEDS AND STANDING are still not in the city at all. Boundary warning: the
     rich deed sources on the talk card are the FACTIONS lane's sentinels.
PEOPLE (people-7h9sfy): 8/19 -- *** SHE IS IN THE ROOM TONIGHT. The
sister who dies on night one was never in the room on the night she dies.
TAB: CUTSCENE, press PLAY on THE MATCH-CUT OPEN, then on THE GRIEF DINNER. ***

MEASURED BEFORE CHANGING A WORD: sibling_lost spoke ONE line in the entire cold
open, as a CHILD, ten years before the night she is taken, and was staged in the
present-day room she dies out of ZERO times. FORTY scene_gate assertions were
green over that. His own 7/19 ruling is what makes it a bug and not a choice:
the death happens "away from [the table], in motion, in the house", so she is
alive at that table minutes before and the scene simply never put her there.
That is backlog 0sc's 8/13 amendment in one sentence -- attachment before the
death was a WATCHED match-cut and nothing else.

SHIPPED (record: records/BOHEMIA_SHE_IS_IN_THE_ROOM_TONIGHT_8_19_26.md):
she is at the table tonight. The mother names her at the child table ten years
earlier. THE QUIRK IS HIS OWN EXISTING LINE, not an invented one -- "I'm not
eating the green ones" was already in the file and is now a ten-year family bit,
repeated tonight by the one person who will not survive the night, and broken at
the grief dinner by the mother: "I picked the green ones out. Force of habit."
Rule of three, and the third instance is his 7/19 empty-chair motif arriving as
a kitchen detail rather than a speech, which his sacred-table ruling requires.

*** THE MISTAKE WORTH KEEPING, AND IT IS THE MOST USEFUL THING IN THIS HANDOFF:
I BUILT A SECOND PLACE TO STORE HER NAME. *** Her name flips with the player
(7/19: the surviving sibling matches the player's gender), so I put a drafted
pair in the scene file, built token substitution into the runtime, wired it
through the surface, gated it, and mutation-tested it three ways. Everything
green. THEN I SCREENSHOTTED THE SCENE and the mother's speaker label said
DENISE. FAMILY_CAST (tools/bohemia_family_cast_patch.py) has held the family's
drafted names since the cast shipped -- RAY, DENISE, MARCO, NINA, all
draft:true -- and already carries this exact flip in its `survivesIf` field. My
names were a duplicate source of truth AND the wrong strings.
  A GREEN GATE PROVES THE THING IT CHECKS AND NOTHING ELSE. Every assertion I
  wrote was true. Not one of them asked the only question that mattered: DOES
  SOMEBODY ELSE ALREADY OWN THIS? Ask it before building a store for anything.
Fixed: the scene owns no names, the surface fills the token from FAMILY_CAST,
and the gate reads that table and asserts the join -- the same technique
scene_gate already used to check COMBAT's encounter id.

AND A SECOND, SAME SHAPE, SAME DAY: Story.prototype.apply printed b.text RAW, so
the caption on screen would have read "{sibling_lost}. Green ones too." with the
braces in it, while the runtime resolved perfectly and scene_gate stayed green
because it tested the RUNTIME. VERIFY ON THE REAL SURFACE, third time this week.
Fixed in the module, never at the two call sites.

VERIFIED ON THE REAL PAGE: both player sexes played through the real Story with
the real cast -- male hears NINA, female hears MARCO, zero page errors. Lines
are editable in the WORDS tab, beats in the DIRECT tab.
gates: SCENE 40 -> 54, mutation-tested FOUR ways (absent tonight -> 3 red; no
grief payoff -> 1 red; broken resolution -> 1 red; raw b.text -> 1 red).

WHAT COMES NEXT FOR THIS LANE, in order:
  1. THE OTHER HALF OF 0sc's AMENDMENT IS COMBAT'S, NOT MINE. The sibling
     TEACHING the beat (I-MOVE-YOU-MOVE, your first dance partner) and the
     protect/assist beat live inside the family-defense encounter that lane
     owns. "Losing them = losing your teacher" needs the teacher built. Do not
     start it without checking who is live on combat.
  2. THE TELL is authored, gated and NOT on the card. BohemiaQuirk.tellFor()
     returns what you can SEE about somebody before they speak, for all 22
     shapes. It wants a surface that is not another row on a card that already
     has a dozen.
  3. DEEDS AND STANDING are still not in the city at all. BOUNDARY WARNING: the
     rich deed sources on the talk card (give / commit / answer-a-claim /
     take-a-favour) are the FACTIONS lane's sentinels.
PEOPLE (people-7h9sfy): 8/19 -- *** EVERYBODY HAS A BIT NOW. Ask anybody
their name and you get a person, not a surname. TAB: RUN, walk up to somebody,
press the button at the bottom, then ASK THEIR NAME. Come back after dark and
they say the other half of it. ***

WHAT SHIPPED: backlog PEOPLE 0t, the attachment half of the demo's cold open.
22 shapes x 40 typed nouns = 304 distinct quirks, each authored TWICE as the
SAME person -- 608 utterances out of 106 authored pieces, all draft:true and
editable in the WORDS tab. Record:
records/BOHEMIA_ONE_THING_THAT_IS_THEIRS_8_19_26.md

WHY, in the tone research's own sentence: A CHARACTER NOBODY LAUGHED WITH IS A
CHARACTER NOBODY MOURNS. The demo kills the sibling and it cannot land in a
valley of 297 interchangeable bodies. MEASURED BEFORE WRITING A WORD: the people
module held 58 BUCKET lines (every Blue in the valley says the same five
sentences) and 19 player-reactions, and ZERO things belonging to one human. R1
had already named the delivery slot exactly -- "what a stranger says when you ask
their name is where Undertale would put the first laugh" -- and that slot had
been shipped and standing EMPTY since 7/31.

THE IDEA IS NOT THE VOLUME, IT IS THE DIAL. Benign violation theory (R1 finding
3): funny and scary are ONE dial, a violation appraised as SAFE, and the switch
is perceived safety. The valley already owned that dial physically. So the lit
register is the joke and the dark register is the SAME trait, SAME object, SAME
human with the safety taken out. Never a different quirk, never a mode switch.

*** THE FINDING THAT MATTERS MOST THIS TURN: IT WAS ABOUT TO SHIP BACKWARDS AND
EVERY GATE WAS GREEN. *** The register asked dayDark() -- "is this block on a
live circuit". Driving the real walked surface:

    valley tiles on a live circuit      358 of 9,216   (3.9%)
    people who live on one              131 of 5,007   (2.6%)
    conversations that would be DREAD                   97.4%

The joke would have been unreachable. Nothing upstream was wrong; every check
was asking the same wrong question. A DIAL SOLDERED TO ONE END IS NOT A DIAL.
The fix was not a new rule but the renderer's OWN test -- `isNight() && !live` --
because an unpowered lot at noon is a lot, and LIGHT=TERRITORY was always about
the night. One definition of dark in the file instead of two that drift.
Re-measured: lit at 07/10/13/16, dark at 19/22/02.

TWO MORE, both caught by machine and not by eye:
  1. TEMPLATE SUBSTITUTION HAS NO GRAMMAR. First build shipped "Mine's the same
     as his was. a slot handle snapped off at the base, both of us." A phrase
     written for mid-sentence, dropped at the start of one. A human cannot
     eyeball 44 lines x 40 nouns, so the grammar moved INTO THE SPEC and is
     checked across all 608 renderings.
  2. A PROBABILISTIC GUARANTEE IS NOT ONE. 304 combos drawn 32 times is a
     birthday problem: measured 1.63 duplicate pairs per block, worst 7.
     spreadOver() makes it exact (0.00) while moving only 5.3% of people, and
     advances the NOUN before the SHAPE so four people with routines stay four
     different routines.

AND THE ROW LANDS WHEN THE NAME DOES NOT. Six of the sixteen introductions
refuse a name; under the old card that made a third of the valley unmeetable --
you pressed the only social button the game has and the world said no.

THE MACHINE: tools/bohemia_quirk_factory.py, engine/bohemia_quirk.js,
records/BOHEMIA_QUIRKS.json, tools/bohemia_city_quirk_patch.py (idempotent,
refuses a diff that removes lines), gates/quirk_gate.js (32 assertions, 18
driving the real alpha in a real browser, mutation-tested THREE ways: a decorative
lookup goes 4 red, an unwired row goes 3 red, a spread cache keyed on the cell
alone goes 1 red), dialogue_catalogue_gate 59 -> 62,
and tools/bohemia_words_book.py grew parse_quirks so every line is editable.

*** THE FULL SUITE NO LONGER FINISHES, AND THAT MAKES A LAW UNENFORCEABLE ***
`python3 gates/bohemia_gates.py` ran 217 of 382 registered gates and was killed
at the 50 minute mark. It never reached this lane's gates at all, nor DIALOGUE
CATALOGUE, nor ASKING. A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED says the
suite is the net and "green or it does not ship" -- but a suite that cannot
complete means every lane is shipping on a PARTIAL run and cannot tell which
part it missed. Nobody is doing anything wrong; the suite has simply outgrown
one sitting. Whoever owns fleet infrastructure: it needs either a much longer
budget declared out loud, or a way to run a named subset and report what it
skipped, because silence about 165 unrun gates reads exactly like green.
This turn's own coverage was made up by running the lane's gates directly
(quirk 32/0, asking 21/0, known 19/0, exchange 31/0, dialogue catalogue 62/0,
people 158/0, population dial 21/0, pages publish 15/0).

*** EIGHT GATES ARE RED ON MAIN AND NONE OF THEM IS THIS LANE'S ***
DISTRICT FILL, TRAFFIC SIGNAL, VOTE TAB, LOOK, RUN BEAT, SFX RENDER, DRESS,
ROAD CELLS. CHECKED, NOT ASSUMED, by experiment: with THIS TURN'S FILES REVERTED
TO ORIGIN/MAIN and nothing else changed, traffic_signal, look and vote_tab fail
with the IDENTICAL counts (2, 1, 1). DISTRICT FILL is proven by provenance
below. The remaining four are sounds, clothing, run tempo and roads -- files
this turn never opened.

*** A RED ON MAIN THAT IS NOT THIS LANE'S, FOUND BY THE SUITE THIS TURN ***
DISTRICT FILL is FAILING on main, 51 passed / 2 failed:

    > FAIL arterial is not emptier than it was on 8/2 (20.4% vs 45.1%)
    > FAIL freeway  is not emptier than it was on 8/2 (36.5% vs 45.8%)

NOT MINE, and checked rather than assumed: that gate reads only
engine/bohemia_district_kit.js, engine/bohemia_world.js and
records/BOHEMIA_DISTRICT_FILL_BASELINE_8_2_26.json, and all three are
byte-identical to origin/main in this tree (git status clean on them). The last
commit to touch either engine file is f812f41 "THE STRIP WAS NEVER BUILT" (8/18,
WORLD lane). Two road district types lost more than half their content share
against the 8/2 baseline, which is exactly the emptying that gate exists to
catch. WORLD LANE: this is yours and it is live on main right now.

WHAT COMES NEXT FOR THIS LANE, in order:
  1. THE TELL IS AUTHORED, GATED AND NOT ON THE CARD. tellFor() returns what you
     can SEE about somebody before they speak, for all 22 shapes. It wants a
     surface that is NOT another row on a card that already has a dozen.
  2. DEEDS AND STANDING ARE STILL NOT IN THE CITY AT ALL (measured again this
     turn: zero occurrences of BohemiaDeeds or BohemiaStanding in the walked
     surface). Two modules that know what the player was SEEN doing, absent from
     the surface he plays. BOUNDARY WARNING FOUND THIS TURN: the rich deed
     sources on the card (give / commit / answer-a-claim / take-a-favour) are the
     FACTIONS lane's sentinels (__CITY_CLAIM__, __CITY_COLLECT__,
     __CITY_STANDING__, __CITY_FAVOUR__). Wiring standing to observe them means
     touching their system, which ONE SYSTEM ONE SESSION forbids. Do not start
     this without checking who is live on factions.
  3. Quest volume: the questbook is 152 studies and the corpus cites a fraction.

PEOPLE (people-7h9sfy): 8/18 -- *** THE STREET TALKS ABOUT YOU NOW, AND
ONLY BECAUSE OF WHAT YOU DID. TAB: RUN, go round asking people things and then
keep walking. ***

Yesterday shipped enough people to hold a conversation, two of them talking to
each other, and the ability to ASK about what you overheard. All three were the
world talking AT you. THIS IS THE WORLD TALKING ABOUT YOU.
  MEASURED ON THE REAL STREET:
    before he asks anything   world {asked:0,known:0,names:0}   about him: NONE
    he asks 3 people 3 things world {asked:3,known:0,names:0}
    after                     about him: you-asking-heard
  and what he walks in on:
    "Asking who?"
    "Anybody who will stand still. Not from here, whoever it is."
    "Then they will run out of people who stand still."
  The opener he never hears is "Somebody has been going round asking about the
  water", which is exactly what he had just been doing. YOUR INVESTIGATION HAS A
  SOCIAL COST AND YOU FIND OUT BY OVERHEARING IT.

*** THE WITNESS MAKES IT REAL (Q062.P6, Q003.W8). *** Every about-you exchange
exists in TWO versions and which fires depends on whether either speaker has
actually met you. Nobody has met you -> they hedge ("They have been taking names.
Taking them where?"). One of them has -> they state it flat ("They asked me what
I am called. I did. And they said it back to me, once, like they were putting it
somewhere."). The research agrees from the other end: across open-world
reputation systems the times you are CAUGHT are what count.

*** AN EXCHANGE ABOUT YOU THAT FIRES WHEN IT IS NOT TRUE IS THE WORLD LYING
ABOUT ITSELF. *** Every one names a CONDITION and a WITNESS STATE and the factory
refuses to build one that names neither. Conditions are counters the city really
keeps: asked (subjects gone round asking about), known (people met), names (names
taken). Q007.W10 CROSS-SYSTEM CONSEQUENCE: going round asking IS a deed.
It is picked BEFORE the ordinary ones while it is still news and unspent, then
the pair goes back to the water -- a moment, not a state you are stuck in.

*** MEASURED, NOT ASSUMED: engine/bohemia_deeds.js AND engine/bohemia_standing.js
ARE NOT IN THE CITY AT ALL. *** Zero occurrences of either. Two whole modules
that know what the player was SEEN doing, absent from the surface he plays, so
the street can discuss what you ASKED but not what you DID. That is a reach gap
for somebody and it is the obvious next depth axis.

TWO OF MY OWN GATE ASSERTIONS WERE WRONG AND WERE FIXED AT THE RULER: A8 counted
against forPair (the whole table) while nextFor draws from the ELIGIBLE subset,
so it demanded more unique draws than the pool holds; and B12 ran after B11,
which sets the dial to 1 to prove the solo bark survives an empty street AND LEFT
IT THERE, removing the pairs a conversation needs. Both caught by the gate
failing, both fixed in the gate.

WHAT COMES NEXT FOR THIS LANE: (1) get deeds/standing onto the walked surface so
the street can discuss what you DID, not only what you asked -- that is the same
witness split with much better material. (2) The deeper facts still ask questions
nobody answers; one sentence from him about what is up the hill turns seven dead
ends into destinations and the machinery already carries them. (3) Quest volume:
114 questbook studies still untouched.

PEOPLE (people-7h9sfy): 8/17 (c) -- *** THE THREAD IS PULLABLE NOW. YOU CAN
ASK SOMEBODY ABOUT WHAT YOU OVERHEARD AND IT GOES ONE STEP DEEPER. TAB: RUN,
walk up to anybody and the buttons are on their card. ***

The overheard-fact log shipped READ-ONLY this morning: eleven true things about
this valley and no way to do anything with any of them. Q018.W3 asks for a thread
to PULL, and a thread you cannot pull is a list.
  tools/bohemia_asking_factory.py -> engine/bohemia_asking.js
  tools/bohemia_city_asking_patch.py (idempotent by md5)
  gates/asking_gate.js, 21 claims, registered as ASKING
  records/BOHEMIA_ASKING_8_17_26.md

DRIVEN ON THE REAL SURFACE: overheard "the hill" on the street, asked a
SCAVENGER, and got back "I went up once. There is nothing up there worth carrying
down. Somebody still thought it was worth watching." The log went 3 facts to 4,
the new one reading "There is nothing up the hill worth carrying down, and it is
watched anyway / What is up the hill is not worth stealing, which is why it is
worth watching", and "the hill" vanished from that person's buttons.

*** SCOPED, NOT COMBINATORIAL, AND BOTH THE RESEARCH AND THE CORPUS SAY SO. ***
The obvious shape is an answer per person per topic and it is a mountain: Disco
Elysium's four player call signs alone cost 428 new dialogue cards. Q047.X1
ASTRONOMICAL WRITING/VO COST tells a solo dev to get the EFFECT with SCOPED,
SMARTLY-TEMPLATED content instead. So it is 7 subjects x 2 answers + 4 REUSABLE
refusals: 18 authored blocks covering 28 person-and-subject combinations. Adding
a subject costs two answers, not one per resident, AND THE GATE ASSERTS THAT
SHAPE so nobody "improves" it into a content mountain.

RULES IT KEEPS: every subject answerable by TWO trades (Q014.W4 MULTIPLE KEYS) so
you never hunt one body; you can only ask about what you really overheard to the
end (Q001.P8) and an empty log offers zero buttons; a refusal names a TRADE and
never a place (Q037.W3, the log IS the map); three buttons maximum, because the
RUN lane spent 8/16 taking buttons OFF this surface.

*** NOTHING RESOLVES, ON PURPOSE. *** Every deeper fact asks a SHARPER question
and stops. What is up the hill, who owns the tank the block drinks from after
five, and who is collecting names are CANON and HIS. The destinations ship empty.
A tool that invented them would be writing his world for him. THIS IS THE ONE
THING IN THE LANE WAITING ON A RULING FROM HIM, and it is not blocking: the
mechanism is complete and playable without an answer.

*** THE BUG I SHIPPED, AND IT IS THE SECOND TIME IN TWO DAYS ***
The first cut drew THREE PERFECT BUTTONS THAT DID NOTHING AT ALL. The patch
tool's "already applied?" guard was `if 'ctaskabout' in s` -- and the step
immediately above had just inserted the button markup containing that exact
string, so the tool believed it had already run and THE CLICK HANDLER WAS NEVER
BOUND. A GUARD THAT MATCHES SOMETHING AN EARLIER STEP WROTE IS NOT A GUARD, IT IS
A COIN FLIP THAT ALWAYS LANDS THE SAME WAY. Every patch tool in tools/ that
inserts more than one block has this failure available to it: check yours.

LOOK IS STILL 23/1 AND IT IS STILL NOT MINE. See the note to the CHARACTER lane
below; nothing changed, tools/bohemia_border_picture.js still dies on a
records/2x/before/ input that is not in the repo.

*** CORRECTION 8/19, AND IT IS MINE: THE SLOW-DEPLOY ALARM BELOW IS WRONG. ***
I flagged a 6.6 GB repo and a 739-second deploy as possibly connected, hedged
that one sample proves nothing, and put it at the top of this file anyway. SECOND
SAMPLE, same 6.6 GB repo, measured today: actions/checkout@v4 took 22 SECONDS and
the whole deploy took 46. The 717-second checkout was a TRANSIENT. THE REPO SIZE
IS NOT MAKING DEPLOYS SLOW, and nobody should spend a turn on repo surgery on the
strength of what I wrote. WHAT IS STILL TRUE AND STILL WORTH KNOWING: .git really
is 6.6 GB, the 16 MB run slice really has been recommitted 141 times, and it
really is a build output the coordinator ruled is never displayed. That is a
tidiness and clone-time question, not a "work is not reaching him" question, and
I filed it as the louder one. Reading it back below, keep this paragraph in front
of it.

*** FOR EVERY LANE: THE REPO IS 6.6 GB AND THE DEPLOY JUST TOOK TEN TIMES AS
LONG AS THE ONE BEFORE IT. *** Measured 8/18 while verifying my own ship, not
gone looking for:
  .git                                       6.6 GB
  slices/BOHEMIA_RUN_CURRENT.html   141 commits x 16 MB   (~2.2 GB of history)
  slices/BOHEMIA_ALPHA_0_9.html     458 commits x  3 MB   (~1.3 GB)
  slices/BOHEMIA_CITY_WORLD.html     89 commits x  2 MB
  the run slice was recommitted 18 TIMES IN THE LAST THREE DAYS.
My pages deploy: 739 SECONDS, of which 717 were actions/checkout@v4 alone. The
six deploys before mine took 53, 56, 72, 85, 97 and 97 seconds. I am NOT claiming
I proved causation from one sample -- a slow checkout can be a transient -- but a
6.6 GB checkout taking twelve minutes is the shape you would predict, and the
trend line is the thing to watch.
THE PART THAT IS ODD ON ITS FACE: the run slice is a BUILD OUTPUT, it is 16 MB,
every lane regenerates and recommits it on every ship because run_gate's
"regenerating changes nothing" ratchet demands it be byte-current, AND THE
COORDINATOR RULED ON 8/14 THAT IT IS NEVER DISPLAYED ("LOADED on every visit and
NEVER DISPLAYED ... the run slice is legacy"). So the fleet is spending ~16 MB of
permanent history and a growing slice of every deploy to keep a file byte-perfect
that no player ever sees.
I DID NOT TOUCH IT. Whether to stop committing it, move it to LFS, or relax the
ratchet is a FLEET decision that changes every lane's ship, not a PEOPLE-lane
call, and deleting another lane's regeneration on my own authority is exactly the
class of thing that cost 2,607 lines two days ago. Measured, written down, handed
over.

WHAT COMES NEXT FOR THIS LANE: (1) the deeper facts are the natural place for a
RULING -- one sentence from him about what is up the hill turns seven dead ends
into seven destinations, and the mechanism is already built to carry them.
(2) Exchanges and answers are picked by TRADE only; the sim already knows
faction, standing, what you were SEEN doing and whether they have met you.
(3) Quest volume: 114 questbook studies still untouched.

PEOPLE (people-7h9sfy): 8/17 (b) -- *** OVERHEARING A FACT NOW WRITES IT
PEOPLE (7h9sfy): 8/3 LATEST — YOU CAN TALK TO SOMEBODY ON THE SURFACE HE ACTUALLY
PLAYS. The 8/2 ask is finally delivered.
Record: records/BOHEMIA_CITY_TALK_8_3_26.md

TAP RUN: you land on your feet in the suburb, SOMEBODY IS STANDING TWO TILES AWAY, one
step and the button says TALK TO THE WATCH, the card opens with NAME: YOU HAVE NOT
ASKED, tap Ask their name and she is Marisela Escobar, the button becomes TALK TO
MARISELA, her name is over her head, and it survives a reload.

=== WHY THE FIRST ATTEMPT DID NOT COUNT ===
He asked on 8/2 for one NPC to test the mechanics on. I built it. He said "I couldn't
find them." He was right and the reason was worse than a missing NPC: the alpha routes
the RUN tab to the CITY panel, so #p-run (BOHEMIA_RUN_CURRENT.html) is display:none the
whole time - and that file is where EVERYTHING this lane had built lived.
MEASURED ON HIS SURFACE: 0 bodies drawn, nearest person 192 tiles away, zero "TALK TO",
zero cards. Not "nobody to talk to". NOBODY AT ALL.

=== EVERY PIECE IS THE SHARED MODULE, NOT A SECOND IMPLEMENTATION ===
engine/bohemia_people.js is inlined verbatim, the same way bohemia_city_people_patch.py
already inlines population and agents. The name, the trade, the card and the three tiers
are THAT module's answers; this frame decides nothing about who anybody is (ENGINE SYNC
LAW - the alternative is a second idea of who somebody is, the exact bug 8/2 removed).
The neighbour is a REAL personFields record, same derivation as all 300 people in the
valley, pinned to the SPAWN and not to the player (a body that follows you is a cursor).
Everything learned placing the last one carried over: OUT OF THE DOORWAY (the one button
prefers a door you are standing on over a person beside you) and ON OPEN GROUND (a body
that never moves permanently removes a cell, and on the run surface that left three
people queued behind a fixture).

=== *** THE GATE LOOKS DIFFERENT FROM EVERY OTHER ONE IN THIS LANE, ON PURPOSE *** ===
gates/city_talk_gate.js OPENS THE ALPHA AND TAPS THE TAB.
Every other gate here opens BOHEMIA_RUN_CURRENT.html DIRECTLY, AS A FILE. All 152 are
green about a page the game never shows. They were not lying about the code; they were
answering a question about the wrong door. VERIFY ON THE REAL SURFACE (7/18) is our own
law and it took him saying "I couldn't find them" for me to check.
IF YOU WRITE A GATE IN THIS LANE, DRIVE THE ALPHA AND TAP THE TAB.
18 claims. Mutations: no neighbour -> 13 of 18 red; strangers named without asking -> 6
of 18 red. Two bugs it caught in my own work: the neighbour counted TWICE, and the card
reading "TRADE: MARISELA" because headingOf() correctly returns the name once asked
(right for a heading, wrong for that row).
Neighbours held: CITY PEOPLE 18, ONE WORLD TAB 120, ZOOM SEAM 7, HUMAN START 9, THE ONE
LINK 8.

=== WHAT IS STILL ONLY ON THE HIDDEN RUN SLICE ===
The run slice still has things the city frame does not: the four families, the workers
who commute to job sites, the repair-a-district dial, and the porch neighbour there.
Those are all REAL and gated - they are just not on the tab he taps. Porting them is the
next question for him, not a decision to make alone.

PEOPLE (factions): 8/2 (i) LATEST — *** THE COLOURS WERE ALREADY IN THE PROJECT AND I DID
NOT LOOK. *** He had to say it twice. Read this before touching anything faction-shaped.
Record: records/BOHEMIA_FACTION_GAPS_RESEARCH_8_2_26.md

"BRO WE ALREADY CHOSE COLORS FIND IT IN THE PROJECT."

HE WAS RIGHT. Every faction has carried an ACCENT COLOUR **and a MOTIF** in the alpha's
MFACTIONS table since the faction songs shipped - judged, live, his. I proposed a whole
parallel set off a research argument without ever opening the file. That is a REUSE-FIRST
violation with his name on it, and it is the SECOND time in one day I solved a problem by
inventing instead of looking (the first was taking colours AWAY to dodge a bad metric).
  REDS #c0392b stripe · BLUES #2e6fae grid · ANARCHISTS #c026a0 shard
  COLORFUL #e85aa0 confetti · CHURCH #d8a23a aisle · NETWORK #1fbf9c circuit
  TRADES #d07a2a plate · CARAVANS #caa05a dust · VOLUNTEERS #5aae6a cross
  REMNANTS #9aa23a stencil · CARTEL #a01818 hazard · MOB #caa83a check
  HOMELESS #b8642a cracked · CUSTOM #6a5d46 plain
THE DOSSIERS NOW READ THAT TABLE OUT OF THE ALPHA AT GENERATE TIME. Nobody retypes a
colour, so nobody can drift off the one he picked, and the gate fails a dossier that
invents its own. THE LESSON GENERALISES: if you are about to choose something, grep the
project for it first. It is probably already chosen and it is probably in a lane you were
not thinking about.

*** AND THE MOTIFS ANSWER GAP 1 BEFORE IT WAS EVEN ASKED. *** "Factions have no mark" was
the first gap on the sheet he thumbed WANT, and he had already picked all fourteen marks.
They have simply never been drawn. Whoever takes gap 1: THE MARKS EXIST, do not invent
them, and the heraldry constraint from the research still applies (a mark that cannot be
painted fast, scratched into wood or roughly stitched is too complex).

=== THREE THINGS IN HIS OWN TABLE HE SHOULD SEE - reported, never touched ===
1. THE ANARCHISTS' MAGENTA #c026a0 READS PURPLE on the reservation test, and so does the
   Colorful's pink. Both live in the alpha for weeks. THE PURITY SWEEP NEVER CAUGHT EITHER
   BECAUSE IT ONLY EVER LOOKED AT ART PIXELS, NEVER AT A COLOUR WRITTEN IN CODE. That is a
   real hole in the machine whatever he decides about the colours themselves.
2. FOUR FACTIONS SHARE ONE BAND: Caravans, Trades, Homeless and Church are all within a few
   degrees of hue. Trades and Homeless are 4 degrees and 0.05 of value apart - on a body
   that is the same person. Matters far less in a music gradient than on a walking NPC.
3. HE HAS TWO COLOURS FOR SIX FACTIONS - the 7/21 clothing rulings and the faction-table
   accents. They AGREE ON FAMILY every time and Caravans is byte-identical in both. Both
   are his, so both stand and the gate reports rather than picks.

=== A GATE MUST NEVER OUTRANK A RULING - NEEDED TWICE TODAY ===
When his colours went in, my own gate went red on THEM: purple on the Anarchists, four
collisions in the orange band. Fixing that meant the same move as the Marco fix and the
verdict-banner fix earlier: a colour HE chose is REPORTED, never failed; only a colour I
proposed may fail, because that is the only kind I am allowed to be wrong about.

STILL OPEN: the veteran KITS were written against my wrong colours (bone Volunteers, black
Anarchists) and want a re-pass against his real ones. Flagged, not silently rewritten.
STILL BLOCKED: all 12 gaps are thumbed WANT and every one is faction machinery, which
BUILD THE WORLD (7/31) still has switched off. One word from him unblocks twelve systems.

PEOPLE (factions): 8/2 (h) LATEST — ALL 12 GAPS THUMBED "WANT", AND NOT ONE CAN BE BUILT
UNTIL HE SAYS ONE WORD. Plus a second colour ruling that made the rule better.
Records: records/BOHEMIA_FACTION_GAPS_VERDICT_8_2_26.txt

=== HIS COLOUR RULING, PART TWO: "the mini group factions dont need colors bro" ===
The Karens' pale rose is GONE. And this is not a subtraction, it SHARPENS the system:
*** A COLOUR IS THE BADGE OF BEING A MAP FACTION. *** A row in the canon graph means a
colour; no row means no colour. So a group WITHOUT one is telling you what it is before it
opens its mouth. 12 map factions carry a colour. The Karens, the Amalgamation and the four
social forces carry none, on purpose.
THE GATE NOW CHECKS IT BOTH WAYS and self-tests both mistakes: a map faction with no colour
fails (the error he caught me making this morning), and a non-faction carrying one fails
too (the error I would have made this afternoon).
NOTE THE SHAPE OF THE LAST TWO CORRECTIONS - they look opposite and they are the same
ruling. "Every faction has a colour" and "the mini groups don't" only contradict if you
think a colour is decoration. It is a CLASSIFIER.

=== ALL 12 GAPS ARE WANTED. ALL 12 ARE BLOCKED. ===
12 want, 0 no, 0 unjudged. Every single one is faction MACHINERY, and
laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_7_31_26.md turned that off on 7/31 - "no standing
ledger, no territory model, no faction beats" - with gates/build_the_world_gate.py holding
the ratchet.
*** DO NOT READ THE THUMBS AS THE LIFT. *** That law says in its own words: "The ruling is
lifted only by Paolo, and lifting it means editing the gate." A thumbs-up on a research
card is not somebody editing that gate. Deciding it counts is EXACTLY the
find-a-legal-way-to-ship-anyway move that STOP PRODUCING (7/26) is named after, and this
lane would be the second one to make that mistake in three days.
SO THE ONLY THING BLOCKING TWELVE WANTED SYSTEMS IS ONE WORD FROM HIM. Asked this turn.
IF HE SAYS YES, THE ORDER IS 2 -> 3 -> 5, and the reason is that all three ride machines
this lane ALREADY SHIPPED:
  2. THE MEMBERS ARE WALLPAPER  -> 268 derived people already exist with schedules and faces
  3. REPUTATION TELEPORTS       -> the witness/memory system already holds and decays sightings
  5. WRONG COLOURS DO NOTHING   -> the dress system + the 12 colours ruled today
Nothing else in the twelve gives that much per unit of work.

PEOPLE (factions): 8/2 (g) LATEST — HE OVERTURNED MY COLOUR CALL, AND THE RESEARCH SAYS
HE WAS RIGHT. Plus 12 researched gaps on a judge sheet.
Record: records/BOHEMIA_FACTION_GAPS_RESEARCH_8_2_26.md    TAB: LIFE, top card.

=== THE CORRECTION, AND IT IS THE LESSON OF THE WHOLE DAY ===
"we chose colors for factions so i dont fuck with u trying to say they wont have color
like. wtf bro. we chose the colors dumbass."
I had told him SIX factions should have no colour and read by silhouette instead. THE
RESEARCH AGREES WITH HIM EXPLICITLY: the readability standard is to LAYER THREE SIGNALS -
hue, value and shape - and to pair every colour-coded faction WITH a second signal. Never
colour instead of shape. It was a false choice.
*** AND THE REAL SIN UNDER IT: I SOLVED A BROKEN MEASUREMENT BY DELETING CONTENT. *** The
old check was a single number - RGB euclidean distance, fail under 95 - and it called olive
drab and oxblood a "collision" at 39. A dark green and a dark red. No human has ever
confused those. FIX THE RULER, NEVER THE TARGET is his own 8/1 law and I broke it while
quoting other laws at him.
THE RULER IS REBUILT: hue gap, value gap, or the neutral axis, whichever does the work -
which is what the research actually describes. ALL 13 FACTIONS NOW CARRY A COLOUR.
  RED family by value ...... REDS bright / CARTEL maroon / KARENS pale rose
                             (his 8/2 ruling says the Karens get on with the Reds, so
                             sharing the hue family at the opposite value READS as that)
  GOLD family .............. CHURCH / CARAVANS / MOB stripe   (all his, 7/21, untouched)
  HI-VIS ................... TRADES   OLIVE ... REMNANTS   TEAL ... NETWORK
  COBALT ................... BLUES    RAINBOW . COLORFUL   (his)
  NEUTRAL AXIS by value .... VOLUNTEERS white / HOMELESS concrete / ANARCHISTS black
                             - and that trio survives a pure greyscale test, which is the
                             accessibility standard nobody here had ever applied
THE NEW RULER EARNED ITS KEEP IMMEDIATELY: my first Trades colour, safety orange, FAILED
it - 12 degrees of hue and 0.07 of value from the Caravans' tan, which on a body is the
same person. Replaced with hi-vis yellow-green, which is also the real-world standard.
TWO COLOURWAYS NEED COOKING (hi-vis, pale rose). That is the CLOTHES lane's factory, not
this one - same as the five cooked to order on 7/21. DO NOT COOK THEM FROM THIS LANE.
ONE FINDING THAT IS HIS, REPORTED NEVER ENFORCED: Caravans tan and Church gold are 8
degrees of hue and 0.11 of value apart. Very little tells them apart on a body.

=== AND THE 12 GAPS (LIFE tab, "WHAT FACTIONS ARE MISSING") ===
Researched with sources, all in the record. The three that matter most, and all three lean
on machines THIS LANE ALREADY BUILT:
 2. THE MEMBERS ARE WALLPAPER - the central finding of the 2024 FDG paper on faction
    systems: games script the leaders and leave the background NPCs who ACTUALLY ARE the
    faction with no role. We ship 268 derived people with schedules, jobs and faces and
    not one of them behaves like a member of anything.
 3. REPUTATION TELEPORTS - the documented failure everywhere. The researched fix is
    reputation spreading from WITNESSES who remember and gossip, distorting as it goes.
    WE ALREADY BUILT THE HARD HALF: the memory system holds sightings and decays them.
    Nothing connects it to factions.
 5. WEARING THE WRONG COLOURS DOES NOTHING - the direct payoff of the ruling he just made.
    A colour's whole real-world job is to signal to allies AND provoke rivals.
Also: no faction MARK, no redemption path, no agendas, no zero-sum, no join/leave/expel,
no internal politics, no standing surface, never colourblind-tested, bases on list stride.

=== NOTHING WAS BUILT, ON PURPOSE ===
BUILD THE WORLD (7/31) has faction machinery OFF and STOP PRODUCING says finding a legal
way to ship a frozen thing IS the violation. He asked what we are missing; the answer is a
list for his thumbs and it stays a list. The gate re-asserts every run that no faction
machinery grew.

GATE: FACTION DOSSIERS 675 -> 761, 8/8 self-test probes. The new probe is the exact mistake
he threw out: a faction having its colour taken away to dodge a collision.

PEOPLE (factions): 8/2 (f) LATEST — VERDICT IN ON THE FACTION DOSSIERS: 15 UP, 0 DOWN,
1 NOTED. Record: records/BOHEMIA_FACTION_VERDICT_8_2_26.txt

HIS TWO RULINGS, APPLIED THE SAME TURN:
1. KARENS — "not a faction. a quest giving group . they get a long with the reds."
   Thumbed UP with that correction. The entry is reshaped: NO selection slot, NO
   standing, NO territory claim against anybody. A quest-giving group on the one
   working golf course, friendly with the Reds. Do not build them as a faction.
2. AMALGAMATION — left unthumbed with a note instead, which is the right call since it
   is not a faction to approve: "okay but dont forget the network is its pawn." PAWN is
   the word on the card now. The Network is PLAYED, not allied.

APPROVE IS CANON, so every thumbed card stopped saying PROPOSAL and now says he owns it.

*** AND THE GATE HAD TO MOVE FOR THAT, WHICH IS THE PART WORTH READING. *** It asserted
"every dossier says PROPOSAL, NOT CANON". True for one day, then he thumbed them, and the
gate started failing 15 cards for the crime of being approved. A GATE MUST NEVER OUTRANK
A RULING (Paolo 8/1) — so it now READS HIS EXPORTED .txt and asserts each card says what
he actually decided: an approved card must NOT still ask, an unjudged one must say so, and
a DOWN card still sitting on the sheet fails outright because a kill belongs in the
graveyard, not back in the pile. Same shape as the Marco fix earlier today: when a ruling
moves, the gate reads the ruling instead of remembering a version of it.
FACTION DOSSIERS gate 659 -> 675, 7/7 self-test probes still caught.

*** AND A PROCESS CORRECTION FROM HIM, FOR EVERY LANE, NOT JUST THIS ONE ***
"never have a mass dump of info on me ever again."
My reply that turn was a wall of text — the research, the colour maths, the red-gate
finding, all of it, in the reply. THE WORK GOES IN THE FILES. THE REPLY IS SHORT. He
judges by tapping a tab, not by reading me explain myself. If it is longer than a few
lines plus the ask and the TLDR, it is a dump.

PEOPLE (7h9sfy): 8/2 (f) LATEST — *** EVERY GATE IN THIS LANE IS GREEN ABOUT A PAGE THE
ALPHA NEVER SHOWS. READ THIS BEFORE YOU BUILD ANYTHING HERE. ***
Record: records/BOHEMIA_HE_WAS_NEVER_ON_MY_SURFACE_8_2_26.md

He said "I couldn't find them". Two things came out of that. One is what he asked for
and it is fixed. The other is why he found nobody, and it is worse than what he noticed.

=== 1. THE RUN TAB OPENED IN THE CITY BUILDER (FIXED) ===
"can you make sure when I press the run tab it just starts me off where I should start
off exactly where I should and not in city mode. I'd rather start off in human mode."
MEASURED FIRST, before touching anything: visible panel p-city, MODE='city', HUD read
CITY MODE, player at hx=0,hy=0 - never placed at all in a 12288x12288 world.
Calling the app's own swapMode() at boot was NOT ENOUGH: it came up human and flipped
straight back. Logging every message the frame receives gave
["BOHEMIA_CITY_PLAYER","BOHEMIA_CITY_PLAYER","BOHEMIA_GOTO_CELL"] and GOTO_CELL's
handler ended in an unconditional MODE='city'. THAT LINE WAS RIGHT WHEN IT WAS WRITTEN -
Paolo 7/28 "I want that reflected when I'm in the city menu", back when RUN and CITY were
two separate tabs - and wrong now that THE RUN TAB IS THE CITY FRAME, because the alpha
fires cityGoToRunCell() on city-tab open. His ruling was about the MARKER, never the mode.
NOW: HUMAN MODE, SUBURB, ON FOOT, at (6205,6271). City view still one tap away, zoom seam
still reaches it. swapMode already lands him on a road (NO DISTRICT IS A PRISON, 8/1) and
already uses WORKING_DISTRICT, so nothing was reimplemented.
tools/bohemia_human_start.py · gate human_start_gate.js, 9 claims. Mutations: the original
city boot fails 5 of 9; keeping the boot fix but letting GOTO_CELL flip it back fails 3.

=== 2. *** THE ONE THAT MATTERS: THIS LANE HAS BEEN BUILDING ON A HIDDEN PAGE. *** ===
The alpha routes the RUN tab to the CITY panel:
    PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p
#p-run (BOHEMIA_RUN_CURRENT.html) is display:none THE WHOLE TIME. The alpha's own source
says so in a comment. And that file is where ALL of this lane lives: the identity card,
the one contextual button, asking a name, the name over their head, and the neighbour I
put outside his front door.
COUNTED IN THE CITY FRAME, the surface he actually taps:
    references to the population module ... 16
    "TALK TO" .......................... 0
    identity card / ask a name ......... 0
So there are people walking around on his surface and NO WAY TO SPEAK TO ANY OF THEM.

*** THIS IS OUR OWN LAW CATCHING US. *** VERIFY ON THE REAL SURFACE (7/18): "art is
verified ONLY on the surface Paolo sees - a side-door probe is a lie." Every gate this
lane owns opens BOHEMIA_RUN_CURRENT.html DIRECTLY, AS A FILE. All 152 of them are green
about a page the alpha never shows. They were not lying about the code; they were
answering a question about the wrong door.
IF YOU WRITE A GATE IN THIS LANE, DRIVE THE ALPHA AND TAP THE TAB. human_start_gate.js is
the pattern.

WHAT IT WOULD TAKE: porting the conversation surface - the one verb, the dialogue sheet,
the card, the ask, the name over the head, the porch neighbour - onto the city frame. The
population module is ALREADY SHARED, so the people are already the same people; what is
missing is the talking. [PENDING PAOLO: it is the CITY lane's file and about a day of
work. Do not move it unasked.]

PEOPLE (7h9sfy): 8/2 (e) LATEST — SOMEBODY TO ACTUALLY TALK TO. He asked for it in
these words: "can you just have one extra NPC chilling outside the spawn in the suburb
that I can just talk to and test out your mechanics?"
Record: records/BOHEMIA_SOMEBODY_TO_TALK_TO_8_2_26.md

DONE: walk out the front door and he is TWO TILES away. The button reads TALK TO THE
KEEPER. Tap it, ask his name, leave, and his name is over his head.

=== WHY HE HAD TO ASK, WHICH IS A MEASUREMENT AND NOT AN EXCUSE ===
The sim's roam() sends every idle body to a RANDOM TILE ANYWHERE ON A 128x128 BLOCK, so
the nearest person standing outdoors was routinely 99 TILES from the front door, and
often there was nobody in sight at all. Everything this lane has built - the one button,
the card, asking a name, the name over their head - was reachable only after a long walk
and a lot of luck. Measured both ways: fixture removed 99 tiles, fixture in 2 tiles.

=== HE IS A REAL RESIDENT, NOT A PROP ===
A prop would test nothing. Real seat in a real house, built by the agents module's own
makeAgent, so he resolves to an ordinary person: real trade, real household seat, real
card, a name you have to ask for. ONE flag is special: porch:true = walk to one spot and
stay there instead of roaming.
HE IS INSIDE MASS EDITS like everybody else - joins the roster BEFORE the person-facts
pass, so Paolo's 7/29 law reaches him. Verified: with the everyone-indoors rule he goes
indoors.

=== THREE OF HIS OWN LOCKED RULINGS SAID NO TO MY FIRST VERSION ===
Each caught by a gate, each a real break.
1. FIVE FAMILIES. A free seat in the nearest EMPTY house made him a household of one, so
   the block held five families instead of the four he ruled on 8/1 - and one of them was
   a man living alone, which is not what "four families" means in English.
   FIXED: he joins an EXISTING household. Four families hold at 3/3/3/2.
2. HE SURVIVED THE DIAL AT ZERO. Added unconditionally he was still standing there at
   dial 0, so the ghost valley was not a ghost valley and the bottom of his slider was a
   lie. FIXED: only added if the block already has residents. Dial 0 -> 0 bodies.
3. *** HE PLUGGED A WALKWAY, and this is the one to keep. *** A body that never moves
   PERMANENTLY REMOVES A CELL (occupancy law: one body per cell), so parking him on a
   driveway is not a decoration, it is a wall. At 15:00 three bodies sat stacked at
   (4,28)(4,29)(4,30) all wanting home, TWO OF THEM ORDINARY RESIDENTS QUEUED BEHIND HIM,
   and run_people_gate went red on "every body is indoors after the edit" - not because
   the edit missed anybody but because they could not walk.
   FIXED: he stands on OPEN GROUND. Most walkable neighbours wins, nearest breaks the
   tie, under four open sides is a corridor and not a place to loiter.
AND A FOURTH THING THE SURFACE SAID NO TO: placed adjacent to your own door, the one
contextual button prefers THE DOOR YOU ARE STANDING AT over the person beside you, so it
read GO INSIDE and the conversation was unreachable. He stands 2-5 tiles out.

IF YOU MOVE HIM, KEEP ALL FOUR: existing household, only when the block is populated,
open ground, and not adjacent to the player's own door.

=== AND A NOTE FOR EVERY LANE: THE BUILD STAMP HAS A SHAPE ===
run_gate checks /BUILD \d{1,2}\/\d{1,2}[a-z]*\s*[·-]\s*\S/ - date, then LETTERS only.
Main was carrying "BUILD 8/2b1", and a DIGIT after the date fails that pattern, so THE
RUN was red on main for it. I hit the same thing with 8/2b2 and fixed it to 8/2bc, which
turns THE RUN green again. If you are past 'z', go 'aa', 'ab' - never a number.

=== GATE ===
C4c nearest body on the street is 2 tiles away, not across the block.
C4d and he is standing on open ground, not plugging a walkway.
Mutations: no NPC -> C4c red at 99 tiles. Porch flag ignored so he roams -> C4c red at
99 tiles.
PEOPLE 150 -> 152. RUN PEOPLE 45, recovered from 43/2.

PEOPLE (factions): 8/2 (e) LATEST — SIXTEEN FACTION DOSSIERS. HIS TOP BACKLOG ITEM,
CLOSED, AND THE ONE MECHANIC THIS LANE ALREADY BUILT NOW READS FIFTEEN DIFFERENT WAYS.
Record: records/BOHEMIA_FACTION_DOSSIERS_8_2_26.md + records/factions/ (16 files + index)
TAB: LIFE, top card, "THE FACTION DOSSIERS". Awaiting his thumbs.

=== HIS ORDER, AND WHY IT IS SIXTEEN AND NOT SEVEN ===
Paolo 7/31 lore sitting: "WE NEED TO REALLY FLESH THE FACTIONS OUT FR MAKE ALL OF THEM
AWESOME AND INTERESTING." He said ALL, so it is the whole canon roster rather than the
coordinator's shortlist: 13 selectable + the Karen community + the Amalgamation + the
four social forces as one card. CUSTOM HAS NO DOSSIER ON PURPOSE - canon says the
player's faction emerges from three generations of his own action, so writing it would
be writing his character for him. The gate asserts the absence AND a recorded reason.

=== EVERY CARD IS TWO BLOCKS, AND THE SPLIT IS THE DESIGN ===
GREY = already canon, no thumb, READ OUT OF engine/BOHEMIA_faction_graph.json at
generate time (align, act1/act3 power, relations, the graph's own note). Never typed by
hand, so a dossier cannot drift off canon, and the gate re-checks every line of it.
GOLD = my proposal, his thumb. He can see exactly what he is judging.

=== THE ROW THIS LANE ADDED, AND IT IS THE POINT ===
The ask-a-name machine shipped 7/31 off his ruling. Every dossier now answers WHAT
HAPPENS WHEN YOU ASK A STRANGER OF THIS FACTION THEIR NAME, and no two are the same:
  CARTEL   they know YOURS before you ask, you never get theirs (the mechanic backwards)
  NETWORK  freely given, unprompted, warmly, first meeting - AND THAT IS THE TELL
  TRADES   you get a job, not a name ("Sparks", "Water"); hire them twice and the real
           one arrives unprompted - earned with WORK instead of words
  KARENS   they ask your name AND WRITE IT DOWN. Being asked is the threat
  HOMELESS they do not ask your name, they ask WHERE YOU SLEEP
  ANARCHISTS a chosen name instantly, the birth name never - asking for the "real" one
           is the insult, and the game should let the player make that mistake once
Fifteen readings of one mechanic, zero new code. That is the difference between a list
of factions and a system.

=== THE COLOUR FINDING, MEASURED, AND IT ANSWERS A SEVEN-DAY-OLD PARKING ===
The 7/21 dress pass ruled six faction looks and PARKED the rest, in its own words,
because "real color collisions turned up between them in review". Nobody ever went back.
Measured with the ENGINE'S OWN distance function and its OWN 95-unit family tolerance
(read out of bohemia_dress.js so it cannot drift):
  THE MUTED CORPUS CANNOT CARRY 13 DISTINGUISHABLE FACTION COLOURS. Every dark muted
  candidate collides with the Cartel's oxblood - olive drab 39, field green 47, steel
  78, khaki 80. Moss green collides with the Mob's mustard at 86.
So the proposal is TWO colours, not seven: VOLUNTEERS bone white (a medic must read at
distance under stress - and white is the hardest thing to keep clean in a dust valley,
so a clean Volunteer is announcing they have water to spare) and BLUES cobalt. Eleven
factions read by SILHOUETTE instead, which is STRUCTURE-NOT-COLOR (7/19) doing exactly
the job that law exists for. REMNANTS get no colour because EVERYONE in America wears
olive surplus; what civilians cannot get is WEBBING.
AND ONE FINDING THAT IS HIS, PRINTED EVERY RUN AND NEVER FAILED ON: the Caravans' tan
sits 76 units from the Church's gold, inside his own tolerance, and both are family
mode, so on a body nothing separates them. Failing a build on his own ruling is not the
gate's job. (Caravans/Mob at 59 is fine - the Mob is stripe mode.)
HIS SIX RULINGS ARE CARRIED VERBATIM AND CARRY NO THUMB. NOTES ARE RULINGS: the gate
fails if a ruled faction is re-proposed for a thumb.

=== THE BOUNDARY GOT A MACHINE, NOT A PROMISE ===
BUILD THE WORLD (7/31) turned faction machinery, quests and the economy OFF the same day
this order landed. They do not conflict - that ruling bans MACHINERY ("no standing
ledger, no territory model, no faction beats"), this order asks for LORE. But STOP
PRODUCING (7/26) says finding a legal way to ship a frozen thing IS the violation, so:
no new engine faction module (still empty, subset-checked against the ratchet), no .bq
file, nothing in questbook/ or quests/ opened, factory writes to exactly two places.
THE GREPS LOOK FOR USES, NEVER MENTIONS - Paolo 8/1, a checker that cannot tell a
mention from a use is the broken one. My first version of that check failed on its own
docstring and I fixed the ruler, not the target.
TWO CARDS CARRY NO HOOKS AND SAY SO ON THE CARD: the AMALGAMATION (the act-1 names for
the haunting are PENDING PAOLO in the 7/24 ghost lock - a hook would be inventing the
vocabulary of the game's central mystery) and the SOCIAL FORCES (his to place).
MARCO: THE RULING MOVED WHILE I WAS BUILDING. I wrote against "name only"; four hours
later he re-stated Marco clean and it is canon ("hardcore realist and neighborly. Happy
to help"). My gate hard-coded the old state, which is A GATE OUTRANKING A RULING (8/1),
so it now READS THE LIVE ADDENDUM and enforces the part that is STILL open - HIS FACTION.
No dossier claims him, and the dead "king of the hobos" reading cannot come back.

=== GATE: FACTION DOSSIERS, 659 CLAIMS, AND IT SELF-TESTS ===
Every selectable faction covered; every row answered and not thin; the canon graph
reproduced exactly; approved wardrobe only (128 garment names checked by NAME and by
LAYER against the 240-item bank); no purple anywhere; every proposed colour clearing the
tolerance; the frozen machinery not grown; the sheet reachable from the LIFE hub with
thumbs, SUN MODE, comments and .txt export.
SIX PLANTED MISTAKES RUN EVERY TIME, ALL SIX CAUGHT: a purple proposal, an invented
garment, a colour colliding with a ruled one, a ruling re-proposed for a thumb, an
emptied row, and a card shipping two hooks instead of three. That proves the checker
works rather than that the repo is clean today (the 8/2 fence-orphan lesson).
AND THE FACTORY REFUSES TO GENERATE rather than emit a lie: an unknown garment or one
filed under the wrong layer stops the run with the reason. It already caught one -
BLANKET SHOULDER ROLL is gear, not back.

=== VERIFIED ON THE REAL SURFACE ===
Real browser 390x844, through the real door: splash tapped, LIFE tab opened, top card is
THE FACTION DOSSIERS. 16 cards, a card opens to 25 rendered blocks, a thumb moves the
tally, SUN MODE flips to daylight, ZERO console errors. Stamp: BUILD 8/2y.

=== AND A RED THAT IS NOT MINE, NAMED RATHER THAN WALKED PAST ===
FOUR OF THIS LANE'S GATES ARE RED ON MAIN: LIFE, DRESS, POPULATION, MEMORY. I ran the
full suite, saw them, and did the 8/2 check - a clean worktree at origin/main with NONE
of my changes fails BYTE-IDENTICALLY (LIFE 21/3 "0 agents simmed", DRESS 42/1, POPULATION
5/3, MEMORY 7/2), and so does every commit the shallow clone can reach, 45+ back. Not a
regression from today and not mine.
THE CAUSE, MEASURED: agentsForPlot on seed 12345 returns 0, 6, 3, 1, 1, 0 residents for
the first six qualifying plots. THAT IS THE DEAD WORLD WORKING, not a bug - our own
population research says ~150 of 177 residential neighbourhoods hold ZERO people. life_gate
asserts agents.length > 0 on the FIRST plot its scan lands on, 14,10, which rolls empty.
THE CLAIM CONTRADICTS CANON THIS LANE SHIPPED, and which plot it lands on is a scan
artefact - the exact coin-flip-wearing-a-claim's-name shape as the C5 walker on 8/2.
DRESS and MEMORY are downstream of the same empty block.
I DID NOT FIX IT, ON PURPOSE. Fixing it means editing four gates' CLAIMS, which is only
legitimate because the claims disagree with shipped canon, and a change of that shape
needs its own turn where the reasoning IS the deliverable. Editing gates to go green is
the pre-named forbidden shortcut and it does not stop being one because I think I am
right. Filed as P-F with the measurement and the shape of the fix (assert the
DISTRIBUTION across plots, never one plot). NEXT PEOPLE TURN SHOULD TAKE IT.
THE OTHER 25 REDS ARE THE ENVIRONMENT, NOT CODE: ModuleNotFoundError for numpy/PIL. Every
art/image gate in the suite dies on import. TOOLS RUN's only failure is the same thing -
its 262 tools and 218 gates all PARSED, including the two I added.

=== WHAT THE NEXT PEOPLE SESSION SHOULD KNOW ===
1. THE DOSSIERS ARE UNJUDGED. Do not re-surface them and do not build a second version
   of anything on this sheet (STOP PRODUCING). If "verdicts in": approve unlocks the
   FACTION_VETERAN_KIT + FACTION_LOOK fills, which is a table edit and not a new system.
2. THE DRESS SOCKETS ARE STILL EMPTY AND STAY EMPTY until he thumbs. FACTION_VETERAN_KIT
   and the unruled half of FACTION_LOOK in engine/bohemia_dress.js are where approved
   dossiers land. Nothing was written into them.
3. NAMED MECHANISM GAP, FLAGGED NOT FAKED: the ROOKIE half of dress-code-by-rank nudges
   an outfit until half the body reads the faction colour. Six factions here have no
   colour, so the rookie rule has nothing to act on. A second rookie mode (a forbidden
   list rather than a colour) is a small change - do NOT build it without a ruling.
4. THE LANE'S QUEUE BELOW IS OTHERWISE UNCHANGED: dialogue v1 still BLOCKED ON WORDS,
   the faction standing ledger still DEAD BY RULING, the companion layer still blocked.

PEOPLE (7h9sfy): 8/2 (d) LATEST — A NAME YOU EARNED IS A NAME YOU SEE, and THE FRONT
DOOR BROKE A SECOND TIME (fixed, and the failure mode is gone now).
Records: records/BOHEMIA_A_NAME_YOU_EARNED_IS_A_NAME_YOU_SEE_8_2_26.md

=== WHAT HE RULED (records/BOHEMIA_VERDICT_PERIMETER_8_2_26.txt) ===
"The gate assembly stuff actually looks decent. I'm just confused. I like the middle
 part of the wall. It's kind of confusing. Looks like it's glitching out."
ALL 13 of his own 7/14 border walls: THUMBS DOWN. The swap is SETTLED, not pending -
they are out of the run entirely and the post-mortem is in the graveyard file.
MY 18: 11 up, 7 down. All three gate cards down, while SAYING the gate looks decent.

=== ROOT CAUSE, AND THE METRIC WAS BLIND TO IT ===
First thing I checked was the numbers: UP averaged edge 18.31 / grain 61.2%, DOWN 15.98
/ 59.1%. Nearly identical, both deep in tolerance. THE STYLE TARGET HAD NOTHING TO SAY
ABOUT WHY HE REJECTED SEVEN. Worth keeping: a density ruler measures whether a tile is
as rich as his purchased art. It cannot see STRUCTURE and it cannot see how a tile
behaves when the wall is fifty of them long. Then I looked, which should have been first.
*** ONE HERO FEATURE STAMPED AT EXACTLY 44px PITCH. *** One face tile per design,
repeated down the whole block, so the single crack baked into it landed on EVERY cell in
the same place forever. A hard mark on a perfect grid reads as a rendering fault. His
ground library never showed this because the run shuffles fifteen of his tiles per cell -
pitch fifteen, invisible. The wall's pitch was one.
WHY THOSE SEVEN: slump and split-face have strong block coursing and the coursing
OUTRANKS the stamp. Stucco and precast are flat fields where the stamp is the only
structure there is - all three stucco colourways died, both flat precasts died.
THE FIX (structural, not a dial): 8 face + 8 base variants per design, shuffled by a 2D
hash of the cell, no visible period at all; one face in four is allowed damage (a wall is
not a road); and stucco finally gets the "over block" half of "stucco over block" - ghost
coursing at the block cook's own 11x22 module.

=== THE GATE: HE LIKED IT AND THUMBED IT DOWN, AND MY CARD IS WHY ===
To fit both kinds in one strip I put the STEEL LEAF on the coping row over the OPEN MOUTH
on the row below - one opening, barred on top, empty underneath. The game never does that
(the kind is seeded per plot). The card invented the defect.
LESSON, TWICE ON ONE PAGE: a judging surface that arranges art in a way the game never
produces is not a judging surface. It manufactures verdicts about things that do not exist.

=== WHAT SHIPPED ===
LIVE   the 11 he approved, re-cooked, stamp gone.
JUDGE  the 7 he killed, re-cooked with the fix, labelled "you downed this", in the LIFE
       tab. They do NOT quietly reappear in the game.
DEAD   his 13, out of the payload. NOT registered as graveyard tokens on purpose: the
       keys are "W26".."W37"/"WB4", short generic strings with 120 legitimate historical
       mentions, and registering them would make the record illegal and train the next
       session to ignore that gate. The enforcement that matters is machine-held instead -
       perimeter_gate asserts those bytes never reach the run.

=== GATED ===
gates/perimeter_gate.py, 67 checks. New this round: every design is a POOL not a tile,
most faces carry no damage, the flat materials carry ghost coursing, the 11 he approved
ship and the 7 he killed do not, his dead pool is out of the run, and a gate strip shows
ONE kind.

=== THE QUEUE ===
1. HIS BOUGHT YARD HAS THE SAME REPEAT PROBLEM, and it is in the same frame as the wall
   (records/target/PERIMETER_WALL_LIVE.png): only 5 dirt tiles shuffle across the whole
   yard and each carries a big starburst weed, so a weed lands on nearly every cell. His
   pixels are his - do not touch them - but PLACEMENT is clause 4 and 5 tiles is too few
   for the largest surface on the block. NOT SURFACED TO HIM UNASKED.
2. Features on ground ~5.5% vs his 7.0%; his cracks still crisper.
3. Art cell 44 -> 88 px. Would fix (2) outright.
4. Gated and estate communities render with the block art for the first time - nobody has
   ever looked at one.

=== STILL RED ON MAIN, STILL NOT MINE ===
LIFE / DRESS / POPULATION / MEMORY / DEVIATION - zero agents simmed. PARTS PAINTED +
BODY VARIATION are CHARACTER's. BOTTOM-LEFT + CANVAS SCALE verified failing on clean main.

--------------------------------------------------------------------------------

PEOPLE (7h9sfy): 8/2 (c) LATEST — REPAIRING A DISTRICT TURNED EVERY NEIGHBOUR YOU HAD
MET INTO SOMEBODY ELSE, AND LEFT THEIR NAME ON.
Record: records/BOHEMIA_A_PERSON_IS_KEYED_TO_WHERE_THEY_LIVE_8_2_26.md

=== TWO OF HIS LOCKED RULINGS MEET AT ONE LINE, AND IT BROKE BOTH ===
7/31: "once you ask their name, if you see them again, then they would be named."
8/1:  "when you fully repair a district ... more people will want to move in and live
       in the recovered ruins."
Together they promise: repair your street, more neighbours arrive, and the ones you
already know are still the people you knew. It did the opposite.

THE BUG: bohemia_agents builds a block's roster by walking the houses and SKIPPING the
abandoned ones. So a person's position in that array is not a fact about them, it is a
fact about how many of their neighbours happen to be home. bohemia_population derived
every person's character from that position. Occupancy goes up, one more house is lived
in, everybody after it shifts. Measured on cell (3,5): 2 residents before the repair, 4
after, and ZERO of the 2 originals survived. H12-1 and H12-2 swapped personalities with
each other outright.

*** WHY IT IS THE WORST VERSION OF THIS BUG: the NAME was safe the whole time. ***
bohemia_people keys names to the seat, which is stable. So the effect on the surface is
not a neighbour vanishing, which he would notice. It is the name he earned by walking up
and asking, still printed on the card, with a different person behind it. He would spend
act one repairing his street exactly as he described and everybody he ever asked would
quietly be replaced.

=== THE FIX: A PERSON IS KEYED TO WHERE THEY LIVE, NEVER TO THEIR PLACE IN A LIST ===
The seat - which house, which place in that household - is already written into every
agent id by the agents module, and bohemia_people already parses it. Population just
stopped ignoring it.
  engine/bohemia_population.js  seatNumberOf() + peopleForAgents keys on the seat
  engine/bohemia_agents.js      v.homeIndex DELETED. It was the same bug in miniature:
                                added 8/1 so a commuter's identity would travel with
                                them, except what travelled was a ROSTER POSITION. The
                                visitor is a copy of the home agent, so the seat travels
                                for free.
  gates/people_gate.js          J2 and J4 asserted the OLD design, so they were
                                defending the bug. Now they check the seat, and find a
                                person BY seat rather than by position.
ONE-TIME RESHUFFLE, DELIBERATE: changing the key changes who is who, once. Legal because
nothing about any individual is approved yet (KNOWN_AT_START and LINES ship empty, no
verdict names a person), and the alternative is a world that reshuffles every time the
dial moves.

=== GATE: PART K, and three mutations ===
K1 268 people across 93 blocks ALL have a seat, 0 fell back to a list position (counted,
   not trusted)  K2 the encoding cannot collide  K3 a district really does fill up
K4 the people you already knew are still themselves  K5 newcomers are NEW people, not
   the old ones renumbered  K6 and it holds going DOWN as well as up
   key on array position again -> K4 red (0 unchanged, 2 became somebody else), K6 red
   seat encoding too tight     -> K1 red (66 seatless), K2 red
   visitor keyed off where they stand -> J4 red

=== AND A GATE THAT WAS DECIDING BY LUCK (worth more than the fix) ===
C5 "you can walk up to a scheduled body" went red on this change. The nearest person out
on the street is routinely A HUNDRED TILES AWAY. The old walker locked onto one of three
candidates, walked at them, and gave up the instant they stepped indoors.
MEASURED ON BOTH SIDES OF THE CHANGE: the SAME three people were outdoors, at the SAME
distances. Nothing moved and nobody vanished. All that changed was when one of them went
in for the morning, and that flipped the gate green to red.
It now re-targets every step, the way a player does. THE MUTATION RUNS WERE REPEATED
AFTERWARDS to prove the new walker had not simply made the gate easier - it still goes
red on all three. The dead single-target walker was deleted rather than left around for
somebody to reach for.
LESSON FOR ANY LANE: if your gate chases a moving target across a hundred tiles, it is a
coin flip wearing a claim's name.

=== THE DEPLOY: A PUSH CAN GET NO BUILD AT ALL, AND HERE IS WHAT THAT COSTS ===
MEASURED, not guessed. My 8/2 (b) push (ad53f27) landed on main at 06:53 and GitHub Pages
NEVER CREATED A RUN FOR IT - it is simply absent from the Actions list, with an eight-hour
gap either side. Pages itself was fine: the next lane's pushes at 14:52 and 15:10 built
and succeeded normally.
WHY IT IS SURVIVABLE, and this is the part worth knowing: Pages deploys THE CURRENT STATE
OF MAIN, not a diff. So a skipped build heals itself the moment anybody else pushes - my
front-door fix went live at 14:52 riding on another lane's build. The real cost is a
window where your fix is on main and NOT on the phone, and nothing tells you.
SO: after pushing, check the Actions list for YOUR sha. If it is missing, your work is not
live yet even though main is correct, and it will go live with the next lane's push.
AND YOU CANNOT CHECK THE LIVE BYTES FROM INSIDE A SESSION: the container's proxy 403s the
CONNECT tunnel to github.io. The build stamp on the splash is the only way Paolo can tell
which build he is on, which is exactly why that law exists.

=== THE LANE'S QUEUE (BOHEMIA_BACKLOG.md, ## PEOPLE) ===
P-A(1) THEIR DAY row .... CLOSED.  P-A(2) ask-a-name ... SHIPPED 7/31.
0.  dialogue v1 ....... BLOCKED ON WORDS. The runtime exists and plays .bq end to end;
                        LINES ships empty and the words are his.
2.  faction ledger .... DEAD BY RULING.
3.  companion layer ... waits on combat extraction + a roster that is [PENDING Paolo].
1c. the valley census is numbers, not identities. THE CITY HALF IS ALREADY FINE
    (measured 8/2: homesIn appends rather than reshuffles, so city-plane people survive
    the dial at 2/4/8/16 unchanged). What is left of 1c is genuinely the companion
    layer's shape, so it is blocked with item 3, not open.

=== PARKED BY PAOLO, DO NOT RAISE ===
Who you already know at the first frame: "don't worry at all about that right now."
The population slider NUMBERS: "just worry about the coding and plumbing for now."

PEOPLE (7h9sfy): 8/2 (b) LATEST — *** THE ONE LINK WAS DEAD ON MAIN AND NOBODY KNEW. ***
READ THIS FIRST, EVERY LANE. It is not a PEOPLE thing, I just happened to run the full
suite and check whether the red was mine.

THE RUN gate went red. It fails identically on clean origin/main with none of my changes
and passes on the commit before, so it arrived with 5a42b42 ("THE RUN OPENS WHERE WE ARE
WORKING"). ONE </div> WAS DROPPED - the one that closes the front splash. <div id="app">
then parsed as a CHILD of <div id="front">. The splash handler does what it always did:
    front.style.display='none';  app.style.display='flex';
but a child of a display:none parent is not rendered whatever its own display says.
Measured on the real surface at 390x844: #app parent = front, box 0x0, ZERO client
rects, ZERO tabs. *** PAOLO TAPS THE LINK, TAPS THE SCREEN, AND GETS A BLACK RECTANGLE.
*** Every lane's work for those hours was shipping into a build nobody could open.

FIXED: the </div> is restored. #app parent is BODY, 390x844, tabs on screen, run_gate
back to 126/0.

AND GATED, because the ONE-LINK LAW is one of the oldest locked laws here and NOTHING
GATED THE DOOR ITSELF: gates/front_door_gate.js (suite: FRONT DOOR, 8 claims). run_gate
did catch it, but as a 30-second Playwright timeout saying "element is not visible" -
a symptom three screens deep in a 126-claim test that says nothing about a missing tag.
The new gate says the cause in one line ("4 <div> open vs 3 </div> close between them")
in about a millisecond, then walks through the real door in a real browser and checks
the app has a real box and the tabs are on screen. Self-tests with the exact 8/2 edit.
Mutation: reintroducing the real break fails 5 of its 8 claims.

THE LESSON FOR EVERY LANE: when the suite goes red, CHECK WHETHER IT IS YOURS before
assuming it is somebody else's known-red. Two minutes with a worktree at origin/main
answered it, and the answer was that the game had been unopenable for hours.

PEOPLE (7h9sfy): 8/2 LATEST — THE WORKERS AT THEIR JOB SITES WERE OUTSIDE PAOLO'S OWN
MASS-EDIT LAW, AND MY FIX FOR IT SHIPPED A WORSE BUG FOR ONE COMMIT.
Record: records/BOHEMIA_WORKERS_INSIDE_THE_MASS_EDIT_8_2_26.md

=== THE THREE BUGS, IN THE ORDER THEY WERE FOUND ===
1. Paolo 7/29, LOCKED: editing the people means ADDING A RULE, and the rule reaches
   everybody. The commuting workers this lane shipped on 8/1 were concatenated into the
   sim AFTER the person-facts pass, so they had no entry in RUN_PEOPLE at all, so no
   bulk edit could ever touch them. Measured on the real surface: 0 records for 22
   bodies standing in the clinic.
2. peopleForAgents derived every record from the cell the body is STANDING on. A
   commuter does not live where they stand, so the neighbour whose name you asked in
   your own street was a different human being at work.
3. *** THE ONE WORTH READING. *** Moving the concat up meant the patch tool stopped
   emitting its PEOPLE:JOIN fence. A FENCE THE TOOL STOPS EMITTING IS NOT A FENCE THAT
   GOES AWAY: the text stays applied in the file and the tool no longer knows how to
   undo it, so BOTH copies of the concat ran. Every workplace carried 44 bodies for 22
   identities - everyone standing next to a copy of himself - and on a non-residential
   cell the leftover clamp threw away the very bodies that had just been given records.
   IT WAS LIVE FOR ONE COMMIT WITH EVERY GATE GREEN.

=== WHAT ANY LANE WITH A MARKER-FENCED PATCH TOOL SHOULD TAKE FROM THIS ===
A BLOCK IS ONLY REALLY DELETED WHEN THE TOOL STILL KNOWS HOW TO UNDO IT. Deleting the
row from BLOCKS orphans its applied text in the file forever. The JOIN row is kept as a
strip-only entry: anchor and insert are the same line, the patch is a no-op, and the
only work it does is eat the corpse.
AND: the surface check only ever looked at the cell the game OPENS on, which is
residential and has no commuters, so it was structurally incapable of seeing any of
this. If your gate checks one place, it is checking one place.

=== TWO GATE CLAIMS WERE WRONG, NOT THE CODE ===
F5 asserted the OLD arrangement (JOIN opens after their block) - which was the bug, so
the gate was defending it. F4 flagged the bare WORDS "RUN PERSON FACTS", so writing a
COMMENT that says where another lane's block begins turned it red while nothing was
wrong. Paolo 8/1: a checker that cannot tell a mention from a use is the broken one, and
you fix the ruler, never the target. Both rewritten to check uses.

=== THE FIX ===
engine/bohemia_agents.js      workersForPlot stamps v.homeIndex - a visitor's seat in
                              their OWN roster travels with them next to fromCell
engine/bohemia_population.js  peopleForAgents derives a visitor from (fromCell,
                              homeIndex), never from the cell they stand on
tools/bohemia_people_identity_patch.py
                              the concat lives inside PEOPLE:WORKERS, which closes
                              BEFORE the other lane's block; JOIN kept as strip-only

=== PROOF (mutation-tested, not green-on-first-try) ===
PEOPLE 130 -> 139, RUN PEOPLE 45 held. Four mutations, all caught:
  visitor derived from the standing cell ....... J4 red
  visitor gets no record ...................... J3, J4 red
  concat after the person-facts pass (bug 1) .. D11a red, 0/22 records
  concat twice (bug 3) ........................ D11a red 22/44, D11b red, F5 red

=== AND BUG 3 IS NOW GATED FLEET-WIDE, NOT JUST FIXED FOR ME ===
gates/fence_orphan_gate.py (suite name FENCE ORPHAN, 9 claims). Half a dozen lanes edit
each other's surfaces through marker-fenced patch tools and every one of them has this
failure available to it. The gate sweeps every marker block in slices/ and engine/:
  1. NO ORPHAN - a tool that writes a fence necessarily contains its marker text, so a
     marker no tool anywhere mentions is a block nothing can remove. 24 fences, 0
     orphans today; mine was the only one.
  2. EVERY FENCE IS A PAIR - restore() matches open..close non-greedily, so a missing
     closer makes it eat past its own end (the 8/1 bug, 29 lines of another lane's
     code deleted silently).
  3. NO BLOCK IS APPLIED TWICE.
It SELF-TESTS with three synthetic probes, so it proves the checker works rather than
that the repo happens to be clean today. Mutations on the real tree, all caught:
recreating the exact orphan that shipped, applying a fence twice, deleting a closer.

=== WHERE PAOLO CAN SEE IT: THE RUN TAB ===
Walk to a workplace next door. The people in it are your own neighbours, one each.

=== THE LANE'S QUEUE (BOHEMIA_BACKLOG.md, ## PEOPLE) ===
P-A(1) THEIR DAY row .... CLOSED. Row gone, waiver list empty, gate asserts both.
P-A(2) ask-a-name ....... SHIPPED 7/31.
0.     dialogue v1 ...... BLOCKED ON WORDS. The runtime already exists and plays .bq
                          end to end; LINES ships empty and the words are his.
2.     faction ledger ... DEAD BY RULING. build_the_world_gate.py enforces it.
3.     companion layer .. waits on combat extraction + a roster that is [PENDING Paolo].
1c.    the valley census is numbers, not identities. That is the shape item 3 needs and
       it is the lane's largest unblocked mechanism.

=== PARKED BY PAOLO, DO NOT RAISE ===
Who you already know at the first frame (KNOWN_AT_START stays empty): "don't worry at
all about that right now". Ask-everybody IS the whole mechanic until he raises it.
The population slider NUMBERS: "just worry about the coding and plumbing for now."

PEOPLE (7h9sfy): 8/1 (i) LATEST — HE INTRODUCED THE REPAIR-A-DISTRICT GAME MODE, and the
socket for it is built. Law + the holes I pulled:
laws/BOHEMIA_ADDENDUM_REPAIR_A_DISTRICT_8_1_26.md

HIS DIRECTION (not yet locked - he said "I'll be introducing" and "let's just say"):
"when you fully repair a district kind of like Stardew Valley - get rid of all the junk cars
and make sure the electricity is on, solar panels everywhere ... then more people will want
to move in and live in the recovered ruins ... maybe towards the middle end of act one."

WHY IT MATTERS MORE THAN IT SOUNDS: the third clause makes POPULATION A CONSEQUENCE OF PLAY.
Every other lever in this game is a number a designer types. This one the player EARNS. It
is also the first concrete statement of a payoff loop the coordinator called the single
largest undesigned system in the game (BIG MISSING item 2, the city-builder half).

GROUNDED, AND HE IS RIGHT: studies of 63 post-disaster infrastructure recoveries find
returning population is contingent on electricity, potable water and sanitation, and that
those systems are interdependent. People come back when the lights and taps work. Japan
post-2011 repopulated fastest where infrastructure landed first.

=== THE HOLES I PULLED, all in the law, none smoothed over ===
1. WATER IS MISSING FROM HIS LIST AND IT IS AS BIG AS POWER. He named junk cars, electricity,
   solar. The research puts water and sanitation level with power, and the GDD already calls
   water "THE survival event" (cholera, Intake 3, the reclaim plant). A district with power
   and no water should not repopulate.
2. WHERE DO THE NEW PEOPLE COME FROM? The valley holds ~1,100. Fifty arriving from off-map is
   GROWTH; fifty leaving another district is a ZERO-SUM TUG OF WAR. Different games. The
   zero-sum one is more interesting and costs nothing extra - but it is his call.
3. CAN IT GO BACKWARDS? If a faction cuts the power, do they leave? A ratchet is simpler; a
   reversible one gives raiders something worth doing.
4. WHAT STOPS IT BEING A CHORE? Stardew works on small bundles with immediate visible reward.
   "Clear every junk car" is a flat list. PARTIAL CREDIT may be the difference between Stardew
   and homework - though "fully repair" may already answer it as all-or-nothing.
5. IT COLLIDES WITH THE ZONE MAP. If repair adds people, does a repaired no-man's-land become
   a cluster, and does food carrying capacity still cap it?

=== WHAT WAS BUILT (mechanism only) ===
PER-DISTRICT DIALS on top of the global one:
    cellDial(x,y) / setCellDial(x,y,v) / dialAt(x,y) / clearCellDials()
One cell can now be fuller than its neighbours, which is the entire mechanical requirement
of his idea. MEASURED: repairing one cell took it 3 -> 10 people while the cell next door
stayed exactly where it was. The global dial still wins at zero, so a ghost valley stays a
ghost valley however much you repaired.
REPAIR_WORTH SHIPS EMPTY AND STAYS EMPTY. What counts as repaired, and what each repair is
worth in people, is HIS table. No session may decide ten junk cars are worth thirty people.
NOT BUILT, DELIBERATELY: repair tracking, junk-car counters, completion state, UI. That is
the city-builder half and it needs his design first. This is the socket, nothing more.

=== GATE: part I, 9 claims, 130 total ===
I4 repairing brings people in. I5 THE NEIGHBOUR IS UNTOUCHED. I6 a ghost valley stays one.
I7 clearing repairs restores exactly. I1 his table stays empty.
A GATE WEAKNESS I FOUND BY MUTATING: I5 first compared against an EMPTY neighbour, so a
repair that leaked everywhere still multiplied zero by eight and got zero - the mutation
walked straight past it. A control that cannot move is not a control. It now requires a
neighbour that also has people, and the leak mutation fails it 4 -> 13.

=== WHAT COMES AFTER ===
1. HIS ANSWERS to holes 1-5 above, whenever he wants. Hole 1 (water) is the one that changes
   the most if left wrong.
2. PARKED BY HIM: thin-vs-clustered distribution. DO NOT re-raise.
3. Unchanged: visitors escape mass edits; JOB_DISTRICTS is four entries.
4. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

PEOPLE (7h9sfy): 8/1 (h) LATEST — FOUR FAMILIES IN THE STARTING NEIGHBOURHOOD, and this
one he CAN see. Record: records/BOHEMIA_FOUR_FAMILIES_8_1_26.md

HIS RULING: "in my starting neighborhood I want there to be four families." EXACTLY four.

WHY IT WAS NOT ALREADY POSSIBLE: the starting block had a FLOOR of six households expressed
as a RATE (6/homes). A rate is a per-house coin flip - it lands NEAR a number, never ON it,
and on the shipping seed it produced FIVE. WHEN HE NAMES A COUNT, THE COUNT IS THE LAW, so
agentsForBlock gained `households: N` - pick exactly N houses, deterministically.

THREE DECISIONS INSIDE IT:
1. WHICH four: spread across the block, not clumped. Four in a row is a terrace; four down
   the street is a neighbourhood. Deterministic from the block seed - same four forever.
2. A FAMILY IS MORE THAN ONE PERSON. The household roll returns 1 about 30% of the time and
   the first build came out two couples and two people living alone. The named-count path
   floors household size at 2. ONLY that path - everywhere else a household of one is still
   a household of one, because most survivors are alone and that is the honest picture.
3. THE DIAL WINS EVEN OVER A NAMED COUNT. Two rulings met: "four families" and "the slider
   can go all the way from ZERO to a maximum". At dial 0 the ghost valley has to include his
   own street. So the COUNT is dialled like a rate: 4 at dial 1, 2 at 0.5, none at 0, 8 at 2.
   THE GATE CAUGHT THIS - E11 went red the moment the count bypassed the dial. A gate doing
   its job on a design conflict, not a typo.

MEASURED ON THE REAL RUN:
    4 FAMILIES, 10 people - H1 (2), H5 (3), H10 (3), H15 (2), 3 outside right now

AND A FIX TO THIS LANE'S OWN TOOL, forced by this work: the 8/1 guard cannot tell OUR OWN
OLD TEXT from another lane's, so it refused every legitimate edit to our own blocks.
    python3 tools/bohemia_people_identity_patch.py --allow WORKERS
An intentional rewrite is now a deliberate act somebody TYPES; a silent deletion stays
impossible. Verified the other lane's 29-line block survived the migration.

GATE: part H, 6 claims, 121 total, on the real run. Mutation-proved twice (rate floor gives
five and fails H1/H3; a one-person family fails H2).
VERIFIED: PEOPLE 121/0, RUN 126/0, RUN PEOPLE 45/0.

=== WHAT COMES AFTER ===
1. PARKED BY HIM: the thin-vs-clustered distribution question ("we'll deal with this down
   the pipeline"). DO NOT re-raise it.
2. The population slider plumbing is done and dialled; ACT_DIAL still ships empty.
3. Unchanged: visitors escape mass edits; JOB_DISTRICTS is four entries.
4. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

PEOPLE (7h9sfy): 8/1 (g) LATEST — HE ASKED FOR THE NPC COUNTS AND THEY OVERTURNED MY OWN
CONCLUSION. Research: records/BOHEMIA_NPC_COUNTS_IN_REAL_GAMES_8_1_26.md
NOTHING SHIPPED TO THE GAME THIS TURN, ON PURPOSE - see the last section.

=== THE COUNTS ===
  Fallout: New Vegas     ~373-380 named NPCs
  Fallout 4              500+ (Bethesda's own figure)
  Skyrim                 ~979-1,001
  Red Dead Redemption 2  ~1,000+
  BOHEMIA, derived 8/1   1,113
Our scale-model arithmetic landed on Skyrim's number WITHOUT EVER LOOKING AT IT. Real Vegas
census data shrunk 1:78 and cut to 3% survivors, versus what shipped games actually contain
- two independent roads, same answer. The total is validated.

=== AND THE PART THAT MATTERS MORE: DENSITY, NOT TOTAL ===
  SKYRIM   ~1,000 NPCs over ~37 km2 = ~27 per km2
  BOHEMIA   1,047 people over 21 km2 = ~49 per km2
WE ARE ALREADY TWICE AS DENSE AS SKYRIM PER KM2 AND IT STILL READS AS DEAD. The total was
never the problem. Measured distribution of our 1,047:
     276 residential cells hold NOBODY
     180 hold 1-2
     129 hold 3-5
      42 hold 6-10
       1 holds 11+   <- THE BIGGEST SETTLEMENT IN THE ENTIRE VALLEY IS TWELVE PEOPLE
Skyrim puts 50-70 inside Whiterun, a space you cross in two minutes, and leaves whole
mountains empty. You FEEL a thousand because you meet sixty at once. We smeared the same
number over 352 blocks at three each, and three people on a 96 m block is invisible.

*** THIS IS PAOLO'S OWN 7/29 RULING NOT BEING FOLLOWED. *** He ruled "clusters AND no man's
lands AND random spread". What runs is almost pure random spread - the clustering is so weak
that the largest cluster in Las Vegas is a dozen people. Fixing it means changing the zone
map's numbers, which are HIS, so it was not done unilaterally. THE QUESTION IS IN HIS ASK.

=== WHY HE SAW NOTHING FROM THE POPULATION SHIP, AND IT IS MY FAULT ===
The run applies a FLOOR of 6 households to the PLAYER'S OWN CELL and only that cell (7/29,
"your own block always has neighbours"). His block held 16 people before the change and
holds 16 after. THE ONE BLOCK HE PLAYS ON IS PINNED BY CONSTRUCTION AND CANNOT SHOW A
VALLEY-WIDE POPULATION CHANGE. Measured after the ship: his block 16 people / 6 outside,
one north 0, one south 0. The code DID deploy (later Pages runs green, commit on main).
I shipped something invisible from where he stands and then told him to go look at it.
LESSON FOR THIS LANE: before telling him to look, check the thing is visible FROM HIS
BLOCK. The floor makes his cell a special case and it will hide any population work.

=== WHAT COMES AFTER, in order ===
1. HIS CALL, and it is now a clean either/or backed by measurement:
   A THIN AND EVERYWHERE (today) - two or three people every other block, nowhere empty,
     nowhere a town.
   B CLUSTERED HARD (Skyrim's way, and his own ruling) - 20-30 real settlements of 40-60
     people each, long stretches of genuinely dead city between.
   B is what makes a thousand people FEEL like a thousand. It needs the zone map's head
   counts changed, which are his.
2. If B: the change is the zone map's HEADS constants, not the total. The total is right.
3. Unchanged and still open: visitors escape mass edits; JOB_DISTRICTS is four entries.
4. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

PEOPLE (7h9sfy): 8/1 (f) LATEST — THE POPULATION QUESTION IS ANSWERED: ~1,113 PEOPLE IN
THE WHOLE VALLEY, derived from the scale model the way Paolo said to derive it. The world
now holds that many. Full derivation + sources:
records/BOHEMIA_HOW_MANY_PEOPLE_ANSWERED_8_1_26.md
Reproduce any time: `node tools/bohemia_scale_model.js` (runs against the LIVE map, so the
number can never drift from the world it describes).

=== HIS METHOD, AND IT WAS THE RIGHT ONE ===
"if we know the scale model of our Las Vegas compared to real Las Vegas ... it was just the
full amount of people living in Vegas in 2040, 2050 - millions of people right - but then
you get the scale model of it and now it's not millions of people, and then on top of it
now we have an apocalypse."

  THE MAP        48x48 cells x 96 m = 21.23 km2, 12,260 dwellings actually drawn
  THE SCALE      1:78 by housing (12,260 of Clark County's 958,705 units)
                 1:66 by area     (21.2 km2 of the valley's 540 sq mi)
                 THEY AGREE WITHIN 16% - two measures from completely different things
                 landing together is what says the map is a real model, not a doodle
  STEP 1         2050 Vegas ~2.9 M (UNLV CBER: 3 M in 2055) / 78.2 = 37,085 PEOPLE
                 millions became tens of thousands from the scale model alone
  STEP 2         GDD's ~3% survive -> 1,113 PEOPLE IN THE WHOLE VALLEY
  STEP 3         506 occupied homes of 12,260 = 4.1% occupancy, 1.8 per residential cell

=== THE ANSWER TO THE QUESTION THIS LANE HAS BEEN ASKING FOR THREE TURNS ===
WALKING ONE BLOCK FROM HOME YOU SHOULD USUALLY SEE NOBODY. SOMETIMES ONE. IN A CLUSTER, A
DOZEN. The emptiness is not a bug - it is what a thousand survivors in a hundred-thousand-
person shell looks like, and his 7/29 zone map (clusters AND no man's lands AND spread) is
exactly the right shape to hang it on.

=== IT GRADED BOTH LIVE NUMBERS, AND BOTH WERE WRONG ===
  flat placeholder 0.30   8,282 people   7.4x TOO MANY
  zone map at dial 1         60 people   19x TOO FEW
  the scale model         1,113 people   <- the answer
Opposite directions, which is why neither ever felt right.

=== WHAT CHANGED ===
OCCUPIED_RATE 0.30 -> 0.038, full derivation written AT the constant. That value's own
comment called it a placeholder [PENDING Paolo]; this replaces it with arithmetic off his
GDD and public data, which is not overruling anything. Measured: 1,047 valley-wide, 6%
under target (occupancy is a per-house hash roll, so it lands near, not on).
DIAL_MAX 4 -> 32, because the zone-map path needs ~19x to reach the truth and a slider that
cannot reach the right answer is a broken slider.
THE ZONE MAP ITSELF WAS NOT TOUCHED. Its SHAPE is his ruling and it is right; only its head
counts are low and those are his. The widened dial lets his slider reach the truth without
anybody editing that ruling.

=== GATE: people_gate part G, 9 claims, 115 total ===
G3 the two scales must agree (the foundation). G6 THE SIM MUST HOLD WHAT THE ARITHMETIC
SAYS within 25% (the teeth). G7 the rate cannot go back to a round guess. G9 the slider must
still reach the answer. Mutation-proved twice.
ALSO FIXED: D4/D5 hard-coded cell 20,3 and went red the moment the population dropped 8x.
They SEARCH for a staffed job site now - the claim was always "job sites are staffed", never
"that cell specifically".

=== WHAT COMES AFTER, in order ===
1. HIS VERDICT ON THE FEEL. The arithmetic is honest; whether 1,113 feels right when he
   walks it is a verdict, not a calculation. If he wants a busier valley the lever is ONE
   number now and the derivation says exactly what he would be trading away.
2. THE ZONE MAP'S HEAD COUNTS are ~19x low against this. His ruling, his numbers - but the
   arithmetic to fix them is now written down and reproducible.
3. VISITORS ESCAPE MASS EDITS (unchanged): a worker at a job site is not in RUN_PEOPLE. Fix
   is a unique person id for visitors threaded through peopleForAgents/conditionAgents.
4. JOB_DISTRICTS is four entries; a FARM employs nobody. WORLD's call.
5. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

PEOPLE (7h9sfy): 8/1 (e) LATEST — THE FENCES ARE RE-CUT. The patch tool runs clean
again, round-trips byte-identically, and CANNOT eat another lane's code. Nothing in the
game changed.

=== WHAT THIS FIXED (the item my own last handoff called item zero) ===
tools/bohemia_people_identity_patch.py had one fence (PEOPLE:WORKERS) spanning another
lane's 29-line RUN PERSON FACTS block, so every re-run DELETED their code. Last turn I
shipped a guard that made it REFUSE instead of delete - safe, but the tool could no longer
run at all. This turn re-cuts the fences properly:
    PEOPLE:WORKERS  now closes at `var _agents = ...`, BEFORE their block
    <their RUN PERSON FACTS block, untouched, verbatim>
    PEOPLE:JOIN     opens after it and carries the residential guard + the concat
THE BUG THAT BEAT ME LAST TIME, named so nobody repeats it: B_JOIN's closing marker sat
BEFORE its own anchor line, so restoring the fence re-emitted the anchor and it resolved
twice. A fence must ENCLOSE the anchor it re-emits. Fixed and asserted.

SUCCESS CRITERION WAS A DIFF, NOT AN EYEBALL: three consecutive runs exit 0, the
round-trip diff is ZERO lines, and their block is still in the file.

=== GATE: people_gate part F, 6 claims, 106 total ===
F1/F2 the guard exists AND compares against the block's own insert text rather than
sniffing for banner comments (the first version of that guard flagged this tool's own
headers - a checker that cannot tell a mention from a use is the broken one, 8/1 law).
F4 NO FENCE SPANS ANOTHER LANE'S BLOCK - the invariant, checked statically against the
committed slice. F5 the specific shape: WORKERS closes before their block, JOIN opens
after. F6 their conditioning code is still there.
IT IS A STATIC CHECK ON PURPOSE: this gate must never RUN the tool, because the tool
writes files. Mutation-proved: putting the fences back the old way fails F4 and F5.

VERIFIED: PEOPLE 106/0, RUN 126/0, RUN PEOPLE 45/0.

=== WHAT COMES AFTER, in order ===
1. HIS ANSWER, still the one that unblocks the population work: walking one block from
   home, how many people should be on that street - nobody, a couple, or a dozen? Three
   candidate explanations are written up in
   records/BOHEMIA_HOW_MANY_PEOPLE_CONTRADICTION_8_1_26.md.
2. THE POPULATION SLIDER is plumbed and waiting (8/1 c). BohemiaPopulation.setDial(v),
   0..4, default 1. ACT_DIAL ships empty - which number each act wants is his.
3. VISITORS ESCAPE MASS EDITS. A worker standing at a job site is not in RUN_PEOPLE, so a
   bulk edit does not reach them - a real conflict with his 7/29 mass-edit condition. The
   fix is a unique person id for visitors (fromCell is already on them) threaded through
   peopleForAgents/conditionAgents. Both gates must be watched while doing it.
4. JOB_DISTRICTS is four entries; a FARM employs nobody. Valley-wide behaviour, WORLD's.
5. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

PEOPLE (7h9sfy): 8/1 (d) LATEST — THE LANDMINE IS DISARMED. My own patch tool was
SILENTLY DELETING ANOTHER LANE'S CODE on every re-run. It now refuses instead. Nothing in
the game changed; the run slice on main is untouched and still 45/0.

=== WHAT WAS ACTUALLY WRONG (worse than the "tool drift" I wrote up last turn) ===
tools/bohemia_people_identity_patch.py fences its edits with PEOPLE:<name> markers and
RESTORES each fenced region before re-applying. Another lane anchored its RUN PERSON FACTS
block (29 lines: peopleForAgents + conditionAgents + rulesVersion) on a line INSIDE the
PEOPLE:WORKERS fence. So the marker pair came to span code that was not mine, and a re-run
DELETED IT - taking RUN_PEOPLE with it, which is exactly why run_people_gate went 45/0 ->
34/5 and why I could not reproduce the committed file. A tool that exists to make
cross-lane edits SAFE was doing the precise opposite, quietly.

=== WHAT SHIPPED: THE GUARD ===
restore() now takes the text the block is about to insert and refuses, loudly, if ANY
substantial line inside the fence is not in it. Exit 1, nothing written, names the line.
THE TEST IS EXACT, NOT A HEURISTIC - and that matters, because the first version of this
guard looked for banner comments and flagged THIS FILE'S OWN block headers. A checker that
cannot tell a mention from a use is the broken one (8/1 law). Second version compares
against the actual insert text and is right.
IT IMMEDIATELY FOUND A SECOND SWALLOWED FENCE I did not know about (PEOPLE:RUNTIME), which
is the whole argument for having it.

=== WHAT IS LEFT, AND IT IS SMALL AND PRECISE ===
The tool currently REFUSES TO RUN. That is the correct state - it is safe and loud instead
of destructive and quiet - but this lane cannot patch the run surface again until the
fences are re-cut. THE MIGRATION IS ONE EDIT TO THE COMMITTED SLICE:
  PEOPLE:WORKERS must END at `var _agents = BohemiaAgents.agentsForBlock(...)`, because the
  other lane's RUN PERSON FACTS block anchors immediately after that line. The residential
  guard + the workersForPlot concat move into a SECOND fence (PEOPLE:JOIN) placed AFTER
  their block, anchored on `SIM = BohemiaAgents.makeSim(`. B_SIM/A_JOIN/B_JOIN for exactly
  this are already written in the tool.
  I ATTEMPTED THE MIGRATION AND BACKED IT OUT: my rebuild left the JOIN anchor resolving
  twice (the B_JOIN text ends with the anchor line, so a careless splice duplicates it).
  The tool caught that too and refused. Do it with `diff` against the committed slice as
  the success criterion - ZERO diff lines - not by eye.

=== WHY IT WAS NOT FORCED THROUGH ===
Running out of room to verify a destructive edit to another lane's file is exactly when the
7/30 lesson applies (hand-resolving this same file ate a megabyte of somebody's work). The
guard is the part that makes everyone safer and it shipped; the re-cut is a fifteen-minute
job for a session with room to diff it properly.

=== EVERYTHING ELSE FROM TODAY STILL STANDS ===
The population dial (8/1 c), the workers arriving, the name-asking, the identity layer. The
open question is still his: walking one block from home, how many people should be on that
street.

--------------------------------------------------------------------------------

PEOPLE (7h9sfy): 8/1 (c) LATEST — THE POPULATION DIAL. Plumbing for the slider he said
he is going to make. Record: records/BOHEMIA_POPULATION_DIAL_8_1_26.md

HIS WORDS: "do some coding plumbing right now till I make a population slider ... extremely
important as we go throughout the three acts ... extremely easy to control ... the slider
can go all the way from zero to a maximum."

ONE NUMBER. Everything that asks how many people live somewhere multiplies by it.
    0    A GHOST VALLEY - nobody, anywhere. A real zero or the bottom of his slider is a lie.
    1    exactly what the world does today. THE DEFAULT, so nothing moved.
    4    DIAL_MAX, the fullest it is allowed to get.
    dial 0 -> 0 people | 0.5 -> 1,037 | 1 -> 2,147 | 2 -> 4,310 | 4 -> 7,026 (sampled 1/9 of cells)

THE ONE DESIGN DECISION: THE DIAL SAYS HOW MANY, NEVER WHERE. His 7/29 ruling is that the
valley is clusters AND no man's lands - a SHAPE, not a number. Turning it down THINS the
same valley and never relocates anybody; cells alive low are a strict subset of cells alive
high. Gated.

IT REACHES BOTH PATHS - the zone map inside occupiedRateFor AND the agents module's own
placeholder - because "zero means nobody" has to be true whichever way a caller got its rate.
That also closes half of the three-way contradiction found earlier today: the number is now
changeable in ONE place.

FOR WHOEVER BUILDS THE SLIDER: call BohemiaPopulation.setDial(v) and rebuild the block.
That is the whole API. dial() / setDial() / applyDial() / DIAL_MIN / DIAL_MAX.

ACT_DIAL SHIPS EMPTY and dialForAct() returns null. He said the slider matters across the
three acts; WHICH number each act wants is his. people_gate fails if a row lands unruled.

GATE: people_gate.js part E, 11 claims, 100 total. Includes the REAL RUN emptying when the
dial goes to zero, because a dial nothing consumes is a decoration. Two mutations proved
red-able: zero quietly stopping meaning zero, and placeholder act numbers in his table.

STILL HIS, UNCHANGED BY THIS: which answer is right. Walking one block from home, how many
people should be on that street.

--------------------------------------------------------------------------------

PEOPLE (7h9sfy): 8/1 (b) LATEST — I WENT LOOKING FOR THE EMPTY ROADS AND FOUND
SOMETHING BIGGER: THE VALLEY HOLDS SIXTY PEOPLE. Nothing in the game changed; this is
a measurement and a [PENDING Paolo]. Full write-up:
records/BOHEMIA_HOW_MANY_PEOPLE_CONTRADICTION_8_1_26.md

*** I ALSO HAVE TO CORRECT MY OWN LAST TURN. *** The "8,282 residents / 2,306 workers"
I reported hours ago counted a population THE GAME DOES NOT HAVE - they came from the
agents module's flat 0.30 placeholder, not from the zone map the run actually uses. The
worker feature is real and unaffected (the run passes its own rate); the valley-wide
NUMBERS were wrong and are corrected below.

=== THE MEASUREMENT (same valley, seed 7, three live sources of truth) ===
  flat OCCUPIED_RATE=0.30 placeholder  -> 8,282 residents, 36% of cells
  Paolo's ZONE MAP (7/29, his ruling)  ->    60 PEOPLE IN THE WHOLE VALLEY, 1% of cells
  GDD v5 (~3% of 2.3M survive)         -> ~69,000 people
Sixty, eight thousand, sixty-nine thousand. On cell 39,22 the two rates differ SIXTYFOLD.

=== WHY NOBODY SAW IT ===
The run is on the zone map and does not FEEL empty, because it applies a 6-household
FLOOR to the player's own cell only. Measured on the real surface:
    39,23 the player's block  13 people   (that is the floor)
    39,22 one block north      0 people
    39,24 one block south      0 people
Walk one street over and the neighbourhood is dead. Every other consumer (gates, city
tab, this lane's own numbers) calls agentsForPlot with no rate and gets 0.30, so the run
and everything reasoning about the run describe two different cities.

=== WHAT I DID NOT DO ===
I made the zone map the default inside agentsForPlot, measured it, and BACKED IT OUT. It
makes everything agree - on 60 people in a city, which contradicts his own GDD by three
orders of magnitude. Making every consumer agree on a suspected-wrong number spreads the
bug instead of containing it, and choosing between two live rulings is not a mechanism
call. The disagreement is documented AT THE CALL SITE so the next reader cannot miss it.

=== AND IT KILLS THIS LANE'S OWN QUEUED NEXT ITEM ===
"Put travellers on the empty roads" was queued last turn. A cell is 96m x 96m
(valley_scale_gate), so a three-cell commute is under 300m - about four minutes' walk.
Rendering commuters mid-journey would be INVENTING traffic, not showing it. The roads
being empty is not the bug. The population number is.

*** IF YOU EDIT AN ENGINE MODULE, RUN `node tools/build_run_slice.js`. ***
The builder inlines every engine module into slices/BOHEMIA_RUN_CURRENT.html, so a
one-line COMMENT in engine/*.js makes the committed run stale and run_gate says so
("regenerating changes nothing" -> 125/1). Caught before pushing. The builder alone is
safe; it is the PATCH TOOL below that is not.

*** A DEFECT IN THIS LANE'S OWN PATCH TOOL — FIX THIS FIRST. ***
tools/bohemia_people_identity_patch.py is supposed to be safely re-runnable on top of
whatever main has. IT IS NOT, ANY MORE. Main's run slice passes RUN PEOPLE 45/0; run the
tool on it and the same gate goes 34/5. The tool's restore-then-reapply no longer
reproduces what is committed, because other lanes have edited the slice around its
markers. NOTHING WAS SHIPPED THROUGH IT THIS TURN - main's slice was taken verbatim and
this turn ships only a comment, a record and the handoff.
WHAT THE 5 FAILURES ARE, because they are a REAL conflict and not just tool drift:
run_people_gate's count() is SIM.agents.length while facts() is RUN_PEOPLE, and the
visiting workers this lane added are in the first and not the second - so "one person
record per agent" breaks, and worse, VISITORS ESCAPE MASS EDITS, which is a direct
conflict with Paolo's 7/29 mass-edit condition. Visitors cannot simply be added to
RUN_PEOPLE either: it keys by agent.id and H1-1 exists on every block, so a visitor
collides with the local resident of the same id.
THE FIX IS A UNIQUE PERSON ID FOR VISITORS (their home cell is already on them as
fromCell), threaded through peopleForAgents/conditionAgents. It needs doing carefully
with both gates watched, and it was NOT attempted on a thin context.

=== THE SHIPPED SUITE'S TWO REDS, PROVED INHERITED ===
PARTS PAINTED  "no part is empty on any facing [NE/2, NW/2]"  21 pass / 1 fail
BODY VARIATION the frame cache hashes the dials                40 pass / 1 fail
Both come back BYTE-IDENTICAL on origin/main (8dd19d8) with this lane's work removed, so
neither is this lane's. They are the CHARACTER lane's rig/body work, in flight today.
Flagged by owner, not fixed here.

=== FLEET-WIDE, NOT THIS LANE: THE BROWSER GATES FLAKE UNDER SUITE LOAD ===
THREE separate real-browser gates went red exactly once each inside the full suite today
and passed standalone immediately after, repeatedly:
    SFX WIRED     red in suite -> 150/0 standalone, twice
    ANSWERED FOR  red in suite -> 11/0 standalone, twice
    THE RUN       red in suite -> 126/0 standalone, THREE times
The suite run that failed THE RUN took 1245s against a normal ~760s, so the machine was
heavily loaded. These gates drive real Chromium and real audio and they are timing out,
not finding defects. NOBODY SHOULD CHASE A GHOST: if one of these is red once, run it
alone before believing it. Somebody should give the browser gates a retry-once or a
serialised slot - any lane can take it, it is not cook work. Reported rather than quietly
re-run until green, because "I ran it again and it passed" only means something if it is
said out loud.

=== WHAT COMES AFTER, in order ===
1. HIS ANSWER, in one sentence: walking one block from home, how many people should be
   on that street - nobody, a couple, or a dozen? Three ways out are written up in the
   record (zone constants too low / the GDD's 3% is stale / everyone is indoors in the
   Mojave heat). ONE of them is right and it is his call, not a mechanism call.
2. Whichever way he rules, the FIX IS ONE PLACE: agentsForPlot's rate, plus deleting the
   run's home-cell floor if the answer is "the valley really is that empty".
3. Still true from earlier today: JOB_DISTRICTS is four entries (a FARM employs nobody),
   and squatting outside housing is [PENDING Paolo].
4. PARKED, DO NOT ASK: who he already knows (KNOWN_AT_START). FACTIONS ARE OFF.

--------------------------------------------------------------------------------

PEOPLE (7h9sfy): 8/1 LATEST — THE WORKERS ACTUALLY ARRIVE NOW, AND NOBODY SLEEPS IN
THE STRIP MALL. RUN TAB, build 8/1l. Full write-up: records/BOHEMIA_PEOPLE_AT_WORK_8_1_26.md

=== WHAT HE CAN GO LOOK AT ===
Walk to a workplace. The clinic west of your own house has 29 people in it, 16 of them
out in it, and SIX OF THEM ARE YOUR OWN NEIGHBOURS - the same people, same identities,
as the ones standing in your street. Ask somebody their name at home and you know them
at work.

=== THE TWO BUGS, BOTH MEASURED BEFORE THEY WERE CLAIMED ===
1. TEN PEOPLE SLEPT IN A STRIP MALL. agentsForBlock makes a HOUSEHOLD (bedrooms, a home
   to walk back to) out of every building handed to it, and agentsForPlot handed it every
   building in the valley whatever the district was. On 58 sampled cells the census and
   the generator DISAGREED ON 52. Three in a solar farm's inverter shed, six in storage
   units. The identity card shipped the day before would have said "LIVES: HOUSE 2 ON
   THIS BLOCK" while the player stood in a shopping centre.
   TWO root causes: (a) RESIDENTIAL was {suburb,gated,estate} while the district kit's
   OWN registrations say apartment/suburb/trailer are category:'residential' - a
   hand-written list had drifted from the registry and was calling real apartment blocks
   and trailer parks uninhabited; (b) agentsForPlot never consulted the list at all.
2. EVERY WORKER LEFT THE WORLD AT 7AM. Agents have carried job:{kind:'site',district}
   since 7/19: they walk out the gate, leaveGrid 'away', and cease to exist. HALF A
   JOURNEY HAS BEEN SIMULATED FOR TWO WEEKS - they depart and never arrive - so every
   workplace stood empty all day while the sim insisted people were at it.

=== THE FIX ===
workersForPlot is jobsNear RUN BACKWARDS. jobsNear looks from a home along four compass
rings to radius 3, so the homes that can send anybody to a cell are at exactly the twelve
mirrored positions. IT INVENTS NOBODY - same ids, same seeds, same identity keys. A
visitor is a resident inverted in the sim: 'home' means gone from this grid, 'work' means
here, and their home.building never touches this cell's doors.
IDENTITY IS KEYED TO WHERE YOU LIVE, NOT WHERE YOU STAND. A worker re-keyed by the cell
they are standing on would be a stranger at home the moment you asked their name at work.
That was a real bug on the way through, caught on the real surface, fixed with
blockSeedFor(fromCell).

    census vs agents mismatches   52 of 58  ->  0 of 738
    residents 8,282 | workers who now arrive 2,306 | workplace cells staffed 110 of 370

=== HIS ART NOW COVERS ===
  dead-ground yard, road, driveway, sidewalk
=== STILL PAINTED, AND PROVEN UNPAYABLE FOR NOW ===
  house body, perimeter wall, gate mouth, garage, house upper floor
Not a backlog item: the 7/31 audit decoded all 1,506 purchased tiles and HE OWNS NO
HOUSE WALL AND NO HOUSE ROOF. "4. House wall tiles" is a medieval ivy cottage, "wall
tiles" is dungeon masonry, 46 of 47 roof tiles are cyberpunk skyscraper tops. This debt
shrinks the day he buys a suburban pack and not before.

PEOPLE (7h9sfy): 7/31 LATEST — THE NEIGHBOURS ARE PEOPLE NOW. First session of this
lane. RUN TAB, build 7/31t.

=== WHAT HE CAN GO LOOK AT, IN THE RUN TAB ===
Walk out your front door and up to anybody on the block. The one button now reads
TALK TO THE SCAVENGER (or WORKER / KEEPER / WATCH) instead of HANG OUT (1 HOUR).
Tap it: their own face, and six lines about them — where they live, what they do,
what they are doing RIGHT NOW, the hours of their day, and whether you have met
before. Walk away, come back tomorrow, load a save: same person, and they
remember you. Proof shot through the real alpha with the real cast:
slices/BOHEMIA_PEOPLE_CARD_ALPHA_7_31_26.png
HANG OUT IS NOT GONE. It moved INSIDE the conversation ("Hang out for an hour"),
still one verb, still costs the hour. You just know who you spent it with now.

=== THE ONE DECISION WAITING ON HIM ===
DO THE NEIGHBOURS GET NAMES? The card says NOT NAMED YET on purpose. NAMED_CAST
and LINES ship EMPTY and the gate fails if either gains a row; there is NO
procedural name generator and the gate sweeps the module for a name bank, because
bohemia_agents.js:24 has said since 7/19 that "character names are Paolo's" and
nothing repealed it. Three answers are all legal: (a) he writes a named cast,
(b) they stay role-and-house forever (which is a real design, not a hole — you
know the scavenger from house 16 without knowing her name), (c) he rules that
procedural names are allowed and this lane builds the generator. UNTIL HE PICKS,
NOTHING HERE MOVES. Do not pick for him.

=== WHY ITEM 1 AND NOT ITEM 0 (do not rebuild the dialogue system) ===
PEOPLE 0 is "THE DIALOGUE SYSTEM v1" and it was ALREADY BUILT. REUSE-FIRST found
it before anything got cooked: engine/bohemia_quest_runtime.js plus the run's own
TALK sheet already play .bq conversations end to end (speaker, portrait, says,
choices, silences, noverbs), and run_gate has proved S01 playable on both forks
since 7/26. The runtime was never missing. What was missing is that the sheet only
ever opened for the ONE quest speaker. Backlog item 0 is annotated accordingly.
WHAT IS ACTUALLY LEFT ON ITEM 0: nothing this lane may build alone, because a
non-quest conversation needs WORDS and the words are his.

=== THE DESIGN, and the one decision worth inheriting ===
    an AGENT is a BODY.      Where it stands, what it is doing this minute.
    a  PERSON is an IDENTITY. Who that is, forever.
IDENTITY IS DERIVED, NEVER STORED. The run's applyBlob() throws every agent away
on a save load and rebuilds them from the seed, so an identity hung on an agent
object dies on every load. The same three numbers the body comes from
(blockSeed, house, slot) resolve to the same person on any device, on any load.
Persistence with nothing persisted. That is why the meeting ledger is keyed by a
derived key and not by an agent.
engine/bohemia_people.js. Full write-up: records/BOHEMIA_PEOPLE_IDENTITY_7_31_26.md

=== TWO REAL BUGS THE GATE CAUGHT, BOTH MEASURED ===
1. HALF OF PAOLO'S TOWNSFOLK BODIES HAVE NEVER BEEN ON SCREEN. The alpha bakes
   RUN_LOOKS=6 and the run drew each body with looks[agent.seed % 6]. Measured
   over 528 bodies on 40 generated blocks: that expression returns 0, 2 or 4 and
   NEVER 1, 3 or 5. Root cause is a JavaScript trap, not a typo — bohemia_agents
   .hash ends in `(h*2654435761)>>>0`, a float64 multiply landing near 1.1e19,
   past 2^53, so the low ~11 bits are rounded away and every seed is a multiple
   of 512. Dead low bits means `% smallNumber` is dead.
   I DID NOT FIX THAT HASH, deliberately: it also decides which houses are
   occupied, household sizes and every schedule in the valley, so changing it
   reshuffles the population and breaks "same cell = same people" for every save
   that exists. Fixed at the modulus instead (mix32, Math.imul, exact 32-bit).
   All six of his bodies appear now. Gate B9 keeps the ORIGINAL measurement
   red-able so nobody can put the raw seed back quietly.
2. MINE, and only the real-browser half could see it: identity was keyed to the
   world SEED — which is literally 7 for the whole valley — instead of the block
   seed. House 3's second resident would have been the same person in every cell
   there is, with a ledger that "remembered" strangers. Gate C4b.

=== GATE ===
gates/people_gate.js, registered as PEOPLE, 63 checks. A (12) his tables empty and
load-bearing, no name bank, the hole VISIBLE not hidden. B (23) identity derived
and stable across independent builds and sim rebuilds; the ledger round-trips
through JSON. C (28) THE REAL RUN at 390x844: out the real front door, chase a
real body across the block on the real arrows, tap the real button, read the card,
sample the portrait's PIXELS, walk away, come back remembered, export the save,
load it on a fresh page, still remembered.
EIGHT MUTATIONS, ALL CAUGHT (a gate green first try has not been tested): a
placeholder name; a placeholder line; a name bank; the raw seed put back; the NAME
row quietly hiding the empty table; the ledger no longer surviving JSON; identity
keyed to the valley; the body drawn from the raw seed. Two are caught ONLY by the
browser half.

=== TWO REDS I INHERITED AND DID NOT TOUCH (proved, not assumed) ===
The full suite came back 3 red. ONE WAS MINE and is fixed: REUSE FIRST swept this
lane's patch tool (correctly — the code it injects calls drawImage) and it now
carries a truthful REUSE CHECK: it cooks zero pixels and draws only the alpha's
already-baked cast and the run's existing sheet.
THE OTHER TWO ARE THE CHARACTER LANE'S, and I proved it the way the 7/30 note
says to — by running them on origin/main where they came back BYTE-IDENTICAL:
  RIG CHECK      bohemia_headshot_ragdoll_exemption_patch.py: claimed joint waC
                 is really used                        (161 pass / 1 fail, both trees)
  BODY VARIATION the frame cache hashes the dials       (20 pass / 1 fail, both trees)
Both arrived with "THE HEADSHOT WAS FROZEN BEFORE IT COULD FALL". A third lane
(ec08dcd) flagged the same two independently. Flagged by owner, NOT fixed here:
a red you did not cause never gets fixed by editing another lane's system to make
your own suite green.

=== I ALSO CLEANED UP A HANDOFF THAT SHIPPED WITH CONFLICT MARKERS ===
This file was on main with a live <<<<<<< / ======= / 

--------------------------------------------------------------------------------

(third time -- the file records the other two below). origin/main's copy opened with
`<<<<<<< HEAD` on LINE 1 and carried a `>>>>>>> 53b9718` a hundred lines down, so the
first thing the next session reads was a merge artefact. Resolved here by KEEPING BOTH
SIDES and deleting only the three marker lines, which is the safe call for a file that
is append-only prose: every lane's section is legitimate content and nothing had to be
chosen between. Nobody's words were dropped.
THE CAUSE IS STRUCTURAL, NOT CARELESSNESS: every lane rewrites the top of one shared
file every ship, so a rebase conflicts here on almost every turn, and resolving it is
the last thing anybody does before pushing. -- WORLD, 8/18

PEOPLE (people-7h9sfy): 8/17 (b) -- *** OVERHEARING A FACT NOW WRITES IT
DOWN, AND STAYING FOR THE WHOLE CONVERSATION IS WHAT PAYS. TAB: RUN, and you
read it on the talk card when you open somebody. ***

THE MORNING SHIPPED 11 CONVERSATIONS MARKED leaks:true -- each saying something
TRUE about this valley said nowhere else -- AND THE FACT WENT NOWHERE. You
overheard it, the bubble faded, the game forgot. Q001.P8 "reward the listener"
asks to gate something behind a detail only an attentive player caught, and a
detail caught then dropped gates nothing. That was atmosphere wearing a
mechanic's coat, and this is the mechanic.
  engine/bohemia_known.js, its own key boh.city.known (never rides the main save)
  tools/bohemia_city_known_patch.py (idempotent by md5)
  gates/known_gate.js, 19 claims, registered as WHAT YOU HEARD
  records/BOHEMIA_WHAT_YOU_HEARD_8_17_26.md

READS LIKE THIS ON THE CARD:
  YOU HEARD        "After five you get what is left in the pipe, and it is warm."
  WHICH LEAVES     The pressure is only up before five. Something else is
                   running it the rest of the day.
  THINGS YOU KNOW  3 ACROSS 3 SUBJECTS
Seven subjects exist to have a thread on: water, power, salvage, work, the hill,
names, strangers.

*** STAYING IS WHAT PAYS. *** The fact is recorded ONLY when the conversation
reaches its LAST turn and the line quoted is that turn, because that is where the
payoff sits in all eleven. Walk off halfway and you heard people talking and
learned nothing. Measured first: quoting the JOIN turn produced rows like
HEARD: "Where then." -- a fact about nothing.

*** AND IT NEVER POINTS AT ANYTHING. *** Q018.W3 wants a thread to pull with NO
waypoints and MAP LAW agrees, so a row carries a SUBJECT and a QUESTION and never
a cell. The gate greps every stored row for a coordinate and fails if it finds
one. RESEARCHED 8/17: Outer Wilds' ship log is the design that already solved
this -- "the only things locked to you are locked because you are ignorant of
them", and the ORDER you learned things in is part of what you know, which is why
re-hearing a fact counts it but never reorders the log.

WHAT I MEASURED AND THEN DID NOT SHIP: a derivation of "what somebody's trade
gets talked about", so the card could show what you had heard about THIS person's
subject. Measured: scav, keeper, watch and worker each returned ALL SEVEN
subjects, because most exchanges take ('any','any') speakers. A FUNCTION THAT
RETURNS THE SAME ANSWER FOR EVERY INPUT IS NOT A LOOKUP, IT IS A DECORATION. It
was deleted, the reason written into the factory, and the log stayed a log.

AND ONE FLAKE WAS KILLED RATHER THAN LIVED WITH: gate B5 drove a fixed 130
renders and returned 4 facts one run and 1 the next, because only 11 of 31
conversations leak. A GATE THAT FAILS INTERMITTENTLY IS WORSE THAN NO GATE -- it
teaches everybody to re-run until green, which is how a real failure gets waved
through. It walks a bounded distance and stops the moment the claim is satisfied.

*** FOR THE CHARACTER LANE, AND IT WILL GO RED ON WHOEVER SHIPS NEXT ***
LOOK is 23/1 on `border-one-pixel`, and NO LANE CAN CLEAR IT TODAY. The manifest
now points that picture at slices/BOHEMIA_ALPHA_0_9.html (your entry, and adopting
the surface field was right), but EVERY lane edits the alpha on every ship because
the build stamp is law. So a picture of the CHARACTER OUTLINE is clocked against a
20 MB file that changes daily for reasons that have nothing to do with what the
picture shows, and it went stale the moment I stamped: picture 8/16 19:14, alpha
8/18 04:23.
AND ITS SHOOTER IS BROKEN: tools/bohemia_border_picture.js dies on
records/2x/before/S_idle_0.png, which is not in the repo, and
tools/bohemia_2x_sidebyside.js (which would rebuild that input) dies the same way.
Both tried this turn. TWO FIXES, EITHER WORKS: restore records/2x/ before/after
PNGs so the shooter runs, or point that entry's `surface` at the RIG SOURCE rather
than the alpha, which is what the picture is actually of. The second is one line
and is probably the right answer for every character picture. I did not edit your
manifest entry or weaken the check to make my own push green -- the check is
working exactly as designed and is telling the truth.
(Your newer border-in-the-game picture is fine: tools/bohemia_city_border_picture.js
runs clean and I re-shot it this turn.)

WHAT COMES NEXT FOR THIS LANE: (1) the 11 facts are now RECORDED but still open
nothing -- Q018.W3's thread has to become pullable, which means a fact should
change what you can do or ask somewhere. That is the next real step and it needs
a ruling from him about WHAT any of them lead to, so build the asking mechanism
and leave the destinations empty. (2) Exchanges are picked by ARCHETYPE only; the
sim already knows faction, standing, what you were SEEN doing and whether they
have met you. (3) Quest volume: 114 questbook studies still untouched.
PEOPLE (people-7h9sfy): 8/17 -- *** THE STREET TALKS TO ITSELF NOW. TWO
PEOPLE, A REAL CONVERSATION, AND YOU WALK IN ON THE MIDDLE. TAB: RUN, just walk
into a settlement. ***

Q043.W4 AMBIENT BANTER AS CHARACTERIZATION asks for OVERHEARD RELATIONSHIPS, and
the 8/12 bark factory CITES that finding in its own header while shipping 244
lines in which every single person talks to NOBODY. A person alone saying a thing
is not a relationship. IT WAS NOT NEGLECT, IT WAS IMPOSSIBLE: measured 8/16 at
every hour of a full day, ONE body was drawn on the street and never a pair. The
population dial (8/16) put 88 in a settlement, so the conversations became
possible and this is them.
  31 conversations, 124 lines, 11 leak a real thread
  tools/bohemia_exchange_factory.py -> engine/bohemia_exchanges.js
  tools/bohemia_city_exchange_patch.py (idempotent by md5)
  gates/exchange_gate.js, 22 claims, registered as STREET EXCHANGE
  records/BOHEMIA_THE_STREET_TALKS_8_17_26.md

*** YOU NEVER HEAR THE OPENING LINE, AND THAT IS THE WHOLE TRICK. *** Every
exchange is authored as a FULL FOUR-TURN conversation and `join` is never 0. The
opener is written and deliberately never spoken. Turn 2 only sounds like it has a
turn 1 behind it because a turn 1 really exists. Measured on the real street:
  [15:6:0]  You could put one out.
  [15:6:42] I could. I put two out. Leave it.
  [15:6:42] Asking what.
  [15:6:0]  Asking which one you were. Not where you live, which one you were.
  [15:6:42] Then they already knew where I live.
Two people, alternating, two different conversations, zero page errors. Neither
entered at its opening line.

IT IS ADDITIVE, NEVER A REGRESSION: the dial ships at 1 where a pair is rare, so
if no pair is found the frame falls through to the solo bark exactly as before
(gate B11 holds that). AND IT DRAWS NOTHING OF ITS OWN -- every turn is handed to
the barkPass bubble that already exists. One bubble, one place to fix it.

THREE CHECKERS FIXED AT THE RULER, and every one said the right thing in a
comment while doing the wrong thing in code:
  - tools/bohemia_words_book.py sources() says "EVERY dialogue-bearing artifact,
    DISCOVERED not listed. A hardcoded list is the thing that lets a lane invent
    a new dialogue file the machine never looks at." IT THEN HARDCODED TWO
    FILENAMES. The next lane to invent one was this one, and 124 drafted lines
    would have been invisible in the WORDS tab -- under the 8/11 law that is 124
    lines he cannot edit. Discovery is BY CONTENT now: any records/BOHEMIA_*.json
    holding a container of lines.
  - gates/dialogue_catalogue_gate.js had the SAME hardcoded list, stated
    independently. Same content rule now AND THE SAME ORDER: the first cut pinned
    BARKS/REACTIONS at the front while the harvester sorted all three together,
    and the two fingerprints disagreed over nothing but alphabetical position,
    reporting a stale WORDS tab that was not stale.
  - gates/look_gate.js clocked EVERY picture against BOHEMIA_CITY_WORLD.html.
    look/border-one-pixel.png photographs the CHARACTER RIG and says so in its
    own caption, so editing the city reported it stale -- and NO LANE COULD EVER
    CLEAR IT, because tools/bohemia_border_picture.js dies on a records/2x/before/
    input that is not in the repo. The manifest records the surface now and the
    check compares against THAT; unrecorded entries are NOT judged and ARE named.
    Nothing weakened: city pictures are still clocked against the city, and the
    gate went from 23 assertions to 24. Mutation tested both ways.

FOR THE CHARACTER LANE: tools/bohemia_border_picture.js is BROKEN on disk. It
needs records/2x/before/S_idle_0.png and that file is not in the repo, so the
border picture cannot be re-shot by anybody. It is exempt from the freshness
check now rather than permanently red, but the tool still needs its input back.

ALSO: engine/bohemia_people.js had `REACTIONS: REACTIONS` FIVE TIMES in one
object literal from a botched edit. Harmless in JS, last one wins, and exactly
the kind of thing nobody reads twice. Deduped.

AN ENGINE EDIT STALES FOUR ARTIFACTS: the city inline copy
(bohemia_city_module_resync.py), the run slice (build_run_slice.js), the census
(bohemia_reachability_census.py) and THE LOOK PICTURES (bohemia_look_shots.js).
All four run this turn.

WHAT COMES NEXT FOR THIS LANE: (1) exchanges are chosen by ARCHETYPE only; the
sim already knows faction, standing, what you were SEEN doing and whether they
have met you, and an exchange that reacts to the player walking past is the
obvious next axis. (2) The 11 that leak a thread leak it into nothing -- Q018.W3
wants the thread to be pullable, which means an overheard fact should be able to
open something. (3) Quest volume: 114 questbook studies still untouched.
PEOPLE (people-7h9sfy): 8/16 -- *** HE CAN SET THE POPULATION NOW. HE HAS
NOT BEEN ABLE TO SINCE 8/1. TAB: RUN, in the BUILDER'S DRAWER behind the
spanner, beside REROLL. ***

PAOLO 8/1: "the slider can go all the way from zero to a maximum." The PLUMBING
shipped that day -- DIAL, setDial, dialAt, applyDial, a MIN and a MAX, all in
engine/bohemia_population.js, all inlined into the city. MEASURED 8/16, FIFTEEN
DAYS LATER: NOTHING ANYWHERE CALLED setDial. Not the alpha, not the city, not the
run, not a debug key. The number he told us to build him a way to set was
reachable only by editing a file. That is exactly what the 8/12 law exists to
stop, and it had been sitting there the whole time.

WHAT IT DOES, counted in bodies the frame actually blitted, standing in a
settlement:  dial 0 -> 0    dial 1 -> 6    dial 4 -> 31    dial 32 -> 88
It SHIPS AT DIAL 1. Nothing in the world moves until he drags it. The number is
a DECISION and stays his; I only built the handle.
IT IS IN THE DRAWER ON PURPOSE, and that was decided by a REBASE, not by me:
the RUN lane shipped __BUILDERS_TOOLS_IN_A_DRAWER__ hours earlier off Paolo's
"the run has a lot of bullshit buttons still around from the early days", moving
REROLL/KEY/UNDER out of the row he walks with. A population dial is a BUILDER
tool by that same audit -- it regenerates the world -- so putting a ninth chip
under his thumb would have been re-making the exact mess he had just complained
about, and one_valley_gate would have been right to fail it. My patch anchors on
`<div id="reroll">`, which now lives in the tray, so the tool put it in the right
place by itself.
  tools/bohemia_population_dial_patch.py (idempotent by md5)
  gates/population_dial_gate.js, 19 claims, registered as POPULATION DIAL
  records/BOHEMIA_THE_POPULATION_DIAL_8_16_26.md

*** THE ARITHMETIC IN bohemia_population.js WAS WRONG BY SEVENTY TIMES AND A GATE
WAS PROTECTING IT. *** Its own comment said "the zone-map path yields 60 at dial
1, so the truthful setting is around 19". That divides a TOTAL POPULATION (the
scale model's ~4,723) by a NEIGHBOURHOOD COUNT -- census() dedupes to one row per
neighbourhood, so its 60 is 60 NEIGHBOURHOODS. Swept properly (seed 7, every 3rd
plot, real agents): dial 1 already yields ~4,194 people, which is 89% OF THE SCALE
MODEL. SO THE VALLEY IS NOT UNDERPOPULATED -- the street reads sparse because
~4,200 people over a 96x96 valley IS one person every couple of blocks. That is
the scale model working, and whether it is the game he wants is HIS call, which is
the whole reason the handle now exists. people_gate G9 had frozen the bad
reasoning into an assertion (DIAL_MAX >= 20, "because the answer is around 19x").
THE 20 WAS RIGHT BY ACCIDENT, which is the worst way for a number in a gate to be
right: it kept passing while the reasoning under it was rubble. G9 now reads
LANDMARK{} out of the module and cannot go stale; G10 is new.

FIVE BUGS BETWEEN "IT EXISTS" AND "IT WORKS", every one of them measuring perfect
upstream and doing nothing on screen. THIS LANE HAS NOW SHIPPED FIVE FEATURES WITH
THAT EXACT SHAPE IN ONE SESSION; assume it, do not hope against it.
  - the panel landed INSIDE #topbar, whose CSS is
    `#topbar>*{position:static !important;top:auto !important}` -- it strips
    positioning off every child. The tool now CUTS AND RE-INSERTS instead of
    swapping in place, so a misplaced block relocates itself instead of living
    there forever.
  - THE DIAL NEVER REACHED THE SURFACE. applyDial multiplies a RATE and its only
    caller is occupiedRateFor, the adapter bohemia_agents.js goes through. THE
    CITY DOES NOT GO THROUGH IT: peoplePass -> pplPeople -> peopleIn -> homesIn ->
    headsAt, and headsAt is RAW. Bodies at dial 0, 1 and 20 measured 1, 1 and 1.
    The headless sweep looked perfect the whole time because it walked the other
    path. ONE DIAL, TWO PATHS, APPLIED EXACTLY ONCE ON EACH.
  - a cache outlived the decision: PPL_PEOPLE keys on rulesVersion(), whose own
    comment says "bumped by any mutation", and setDial did not bump it. Fixed IN
    THE MODULE, not at the call site -- clearing a cache next to the button would
    have fixed this button and left the next caller of setDial broken identically.
  - THE BOTTOM OF THE SLIDER LIED. The module promises dial 0 is "A GHOST VALLEY
    ... NOBODY", and the authored spawn neighbour is not a census resident, so he
    stood on the empty street at dial 0.
  - THE TOP WAS DEAD GROUND. The surface capped a neighbourhood at 24 bodies (a
    sane draw budget, silently the ceiling of the whole dial), so dial 4, 12, 20
    and 32 drew THE SAME STREET. The budget now rides the dial, ceiling 240.

TWO CHECKERS FIXED AT THE RULER, NEVER THE TARGET:
  - bohemia_city_talk_patch.py refused to re-apply because its "already applied?"
    test was the bare substring 'CITY TALK', and by 8/16 three LATER patches cite
    CITY TALK in their own comments (correctly -- it is the lane they must not
    break). The strip succeeded and the tool called its own success a failure. It
    checks the four structural delimiters now. A CHECKER THAT CANNOT TELL A
    MENTION FROM A USE IS THE BROKEN ONE.
  - gates/bohemia_gates.py would not run AT ALL: the INSTRUMENTS entry (MUSIC
    lane, 8/16) was a 3-tuple in a 4-tuple table, so _run_all died on unpack
    before a single gate executed. One missing `False`. Fixed in passing.

WHAT IS STILL HIS AND MUST NOT BE FILLED IN: the dial VALUE, ACT_DIAL (a setting
per act) and REPAIR_WORTH (what a repaired district is worth in people). All empty.

AND IT ANSWERS A QUESTION OPEN SINCE 8/1. records/BOHEMIA_HOW_MANY_PEOPLE_
CONTRADICTION_8_1_26.md ends with "walking one block from home, how many people
should be on that street -- nobody, a couple, or a dozen?" -- never put to him in
a form he could answer, because answering meant arbitrating three constants in
three files. It is now a handle he drags until the street looks right.

*** A TOOL IN THIS REPO WAS ARMED TO DELETE ANOTHER LANE'S WORK, AND IT DID. ***
tools/bohemia_city_talk_patch.py STRIPS the CITY TALK block out of the city and
REGENERATES it from its own TALK_JS constant, which is still the 8/3 text. That is
safe exactly as long as it is the only thing that has ever written there -- and it
has not been since at least 7/31. Re-running it this turn DELETED 2,607 LINES,
including the FACTIONS lane's CT_BASES_BAKED and every faction canon string from
their 8/16 ship, plus __CITY_STANDING__. EVERY GATE STAYED GREEN: a gate that does
not know the content existed cannot miss it. I caught it in `git diff --numstat`
(266 added, 2,607 REMOVED) and rebuilt the city without it, applying my two city
edits surgically instead. THE TOOL NOW REFUSES: before stripping it diffs the
block on disk against its own TALK_JS and stops dead if the file says anything it
cannot regenerate (it currently reports 2,121 such lines). A REGENERATOR IS ONLY
SAFE WHILE IT IS THE ONLY AUTHOR. If you need it, mirror the newer content back
into TALK_JS first -- that file is the source of record and it has been wrong for
two weeks. ASSUME THE SAME IS TRUE OF EVERY OTHER strip-and-regenerate tool in
tools/ until you have checked its numstat.

AN ENGINE EDIT STALES **FOUR** ARTIFACTS, NOT THREE. The list already in this
file said three -- the city's inline copy (bohemia_city_module_resync.py), the
run slice (build_run_slice.js) and the census (bohemia_reachability_census.py).
IT IS FOUR. **THE LOOK PICTURES** (tools/bohemia_look_shots.js) are clocked
against slices/BOHEMIA_CITY_WORLD.html, so rewriting the city makes every shot
older than six hours read STALE and turns LOOK red. I ran the resync by instinct
because I needed it to see my own change, and forgot the rest until the suite
said so: LOOK went red on 8 stale pictures and VOICE SURFACES went red against a
run slice built before dialHeads existed. Both green after regenerating (LOOK
23/0, VOICE SURFACES 26/0, RUN 126/0, REACHABILITY 16/0). RUN ALL FOUR.

KNOWN DORMANT DRIFT, checked not assumed: BOHEMIA_CURRENT_SLICE.html and
BOHEMIA_RUN_CURRENT.html both carry an inlined population module WITHOUT this
turn's dialHeads/LANDMARK/version-bump, and bohemia_population.js is NOT in
gates/bohemia_sync_canon.txt so ENGINE SYNC does not watch it. It is harmless
TODAY because neither file calls peopleIn or homesIn -- their copies are dead
weight, not a second answer. The moment either surface draws residents it becomes
a real split, which is the exact failure this module's opening comment exists to
prevent ("the same neighbourhood would be a ghost town in one and a settlement in
the other"). Add it to the sync canon before that happens.

WHAT COMES NEXT FOR THIS LANE: (1) the spawn block is a SPREAD neighbourhood, so
the dial is nearly invisible exactly where he starts -- that is his 7/29 ruling
working, not a bug, and the panel says so in words, but WHERE THE PLAYER SPAWNS is
worth someone's attention and is not mine to move. (2) More reaction axes off
signals the sim already emits. (3) Quest volume: 114 questbook studies still
untouched. (4) Two-person overheard exchanges are now POSSIBLE at a raised dial
(88 bodies on one street) and were not before.
PEOPLE (7h9sfy): 8/12 (b) -- *** HIS NOTES ON THE COLD OPEN, ALL FIVE,
FIXED. THE TAB IS CALLED CUTSCENE NOW (his word). ***
PEOPLE (7h9sfy): 8/12 (d) -- *** THE CUTSCENE PLUMBING IS A MACHINE NOW,
NOT A DIORAMA. A SECOND SCENE COSTS A JSON FILE AND ZERO NEW CODE. ***
PEOPLE (7h9sfy): 8/12 (f) -- *** THE SECOND CUTSCENE SHIPPED, AND IT COST
ONE JSON FILE. THE GRIEF DINNER IS IN THE CUTSCENE TAB. ***
PEOPLE (7h9sfy): 8/12 (h) -- *** NEW LAW, HIS, AND IT IS ABOUT US:
HE MUST BE ABLE TO DIRECT IT, NOT JUST WATCH IT.
laws/BOHEMIA_ADDENDUM_HE_MUST_BE_ABLE_TO_DIRECT_8_12_26.md. TAB: DIRECT. ***
PEOPLE (7h9sfy): 8/12 (k) -- *** THE WORLD HAS A MOUTH: 244 AMBIENT LINES OFF
THE CATALOGUE, WIRED INTO linesFor(). ***
PEOPLE (7h9sfy): 8/16 (d) -- *** 27 QUESTS. TWO NEW ONES THAT INVERT WHAT
EVERYBODY THINKS THEY KNOW -- WHICH IS WHAT THE RESEARCH IS FOR. ***

S26 WHAT THE COLD DID NOT KILL. Everybody knows insulin dies without a fridge.
*** IT IS NOT TRUE, AND THE LITERATURE IS NOT CLOSE. *** Unopened vials hold
clinical potency up to 25C for SIX MONTHS and up to 37C for TWO MONTHS, and
OSCILLATING between 25C and 37C for three months shows NO measurable loss --
which is exactly what a shaded room in this valley does every day and night.
Loss at 37C is ~2.2-2.8% at one month, 5.7% at two, 8.3-8.6% at three.
(Cochrane CD015385 2023; PLOS One 10.1371/journal.pone.0245372 2021)
So a valley that threw its insulin away threw away medicine that worked. The
quest is a KNOWLEDGE-GATE with no skill check anywhere: you either know the fact
or you do not, and the whole thing is who you can get to believe it. The mother
can refuse and refusing is not a puzzle you failed -- nothing in it can compel
her, on purpose (Q010.W7 DELIBERATE, MEANINGFUL UNSOLVABILITY).

S27 THE FIFTY YEAR SIGNATURE. Hoover Dam's power is divided by ACT OF CONGRESS.
The current contracts were signed in 2016 and *** RUN TO 2067 *** -- 46 direct
and 74 total allocations, 95% locked to whoever already held it, 5% for anybody
new. THE LIGHTS THAT ARE STILL ON ARE ON BECAUSE OF A SIGNATURE FROM 2016.
Nobody alive negotiated it, nobody can amend it, the paper does not know the
world ended. CLUSTERED POWER and LIGHT=TERRITORY are canon; this is WHY the
territory has the shape it has, and the shape was drawn by a lawyer. The whole
quest is a READ, and no ending moves a single ampere.

*** AND A REAL HOLE IN A SHARED CHECK, FOUND BY MUTATING IT. ***
bq.js's HARDCODED_NAME heuristic flagged "October" (a clerk reading a date off a
document). Second month in two days -- "July"/"November" hit S22 -- so I excluded
month and day names: a month cannot die, cannot be recast, and cannot be replaced
by a @ROLE, which is the whole claim the check makes.
THEN I MUTATED IT THE OTHER WAY and found something worse. Planted "Gutierrez
left the jug on the side." into a canon quest and *** THE GATE STAYED GREEN AT
546/546. *** The heuristic skips sentence-initial capitals as grammar -- which is
the only reason it is usable, and also a hole, because CHARACTER NAMES USUALLY
START SENTENCES. So it catches a month mid-sentence and misses an actual surname
at a sentence start, which is backwards from its purpose.
*** ZERO HARDCODED_NAME WARNINGS DOES NOT MEAN NO NAMES. *** Closing it properly
needs a common-word dictionary to tell "Gutierrez left" from "Nothing left" --
real work, not a one-liner. RECORDED IN THE CODE rather than half-done, so
nobody reads a green as a proof.

TAB: DIRECT -- 27 quests, 1,513 directable rows. TAB: WORDS -- 1,599 lines,
31 sources.

PEOPLE (7h9sfy): 8/16 (c) -- *** THE DEMO GATE USES ITS FINGERS: it took the
day's job by calling offerAccept() and never tapped the four-tap chain. ***

Two rounds in a row I called something fixed and he came back. Both times the
shape was identical: MY GATE DID FOR THE GAME THE STEP THE GAME WAS FAILING TO
DO. So before building anything new I went looking for the same disease in the
gates I had already written, and the worst one was in the DEMO gate itself.

*** IT TOOK THE DAY'S JOB BY CALLING offerAccept(). *** A JavaScript function.
The demo's actual opening move is a CHAIN OF FOUR TAPS -- GET UP, PHONE, TAP TO
UNLOCK, TAKE IT -- and every link of it could have been broken with
offerAccept() still returning cleanly and the gate still reading green. That is
the entire first two minutes of the demo, unverified.
Driven as real taps now, end to end. Mutation: rename the TAKE IT button and it
fails 3 claims. The old version could not have noticed a player being unable to
start the game.

*** AND THE ARCHITECTURE IS THREE SURFACES, NOT TWO. I HAD THIS WRONG. ***
  BOHEMIA_ALPHA_0_9.html      the door, the tabs, the cutscene/opening
  BOHEMIA_CITY_WORLD.html     THE GAME -- DAY, DQ, the wake card, the people you
                              walk past, the barks. This is what p-city shows.
  BOHEMIA_CURRENT_SLICE.html  *** THE PHONE. *** Its own frame, its own file. I
                              wrote on 8/15 that the run frame was the other
                              half of a two-frame game; the phone is a THIRD
                              file and the job is taken inside it.
  BOHEMIA_RUN_CURRENT.html    parked, not shown by the RUN tab.
FIND A FRAME BY ASKING IT WHAT IT CAN DO. Two frames answer to the run's URL and
.find() takes the wrong one; the phone is a third file again. Every frame lookup
in every gate I own now asks "does this frame have the control I need" and keeps
looking past the first match.

WORTH KNOWING: the day's job flow is GOOD. It works with fingers, it looks
right -- a lock screen with notifications ("The Neighbor: we gotta talk about
the wall between our yards", "Network: 24 quests available near you"), TAP TO
UNLOCK, then A JOB CAME IN with the quest's own words and a TAKE IT button.
Nothing needed fixing there. It just had never been tested as a person does it.

PEOPLE (7h9sfy): 8/16 (b) -- *** "STILL NOT FIXED." REROLL THREW HIM INTO THE
CITY OVERVIEW; MY GATE CALLED swapMode() ITSELF AND READ 8/8 GREEN. ***

I shipped the reroll fix, called it done, and he came back with two words. The
fix was real and it was not what he was looking at.

*** WHAT HE ACTUALLY SEES: REROLL SETS MODE='city'. *** Pressed MID-WALK it threw
him out of the game into the zoomed-out isometric overview -- no body, no house,
a DROP IN button to find. Screenshotted it and there it was: "CITY MODE", the
marker a white dot on the Strip, nothing that looks like a home anywhere. "I
can't find the house I'm supposed to be at" IS THAT SCREEN, exactly, and no
amount of correct HOME bookkeeping underneath it was going to change what he was
staring at.

*** AND WHY MY GATE MISSED IT -- THE WORST GATE MISTAKE OF THE WEEK. ***
reroll_gate pressed the button and then CALLED swapMode() ITSELF and re-rendered
until a house appeared. It walked him back down to the ground, which is the
exact step the GAME was failing to do. So it measured 8/8 green on the build he
was calling broken.
*** A GATE THAT PERFORMS THE MISSING STEP IS TESTING ITSELF. *** It presses,
waits, and looks now. Nothing else. Mutated the fix back out and it fails 2
claims, including the one in his own words: "PRESSED WHILE WALKING, STILL WALKING
AFTERWARDS -- never thrown to the overview."

THE FIX: reroll answers in the language it was asked in. Pressed from the
overview it leaves you in the overview; pressed while walking it drops you back
on the ground at the new house. That drop-in is also what MAKES the house exist,
because swapMode writes LANDED and homeFind anchors HOME on it -- and HOME
resolves off fine data that streams in AFTER the drop, so it asks again on the
next frames instead of taking the first "not yet" as "you have no house".

MEASURED AFTER, as a player, real clicks, no help from the harness: HUMAN MODE,
standing on the street, the word HOME on the house 13 tiles away and IN FRAME.

ALSO CORRECTED: the gate's staleness claim was "LANDED/HOME/HOME_KEY are all
null", which was only true while the drop-in happened after the press. Now reroll
re-homes him itself, so the three are correctly REPOPULATED. The honest claim was
never "cleared", it is "belongs to THIS valley" -- HOME_KEY carries the seed it
was computed under, so it cannot lie about which world it came from.

PEOPLE (7h9sfy): 8/16 (a) -- *** HIS BUG: REROLL LEFT THE OLD VALLEY'S HOME
STANDING (549 tiles away) AND PUT HIM ON THE STRIP, WHICH HAS NO HOUSES. ***

PAOLO, VERBATIM: "I pressed re-roll the seed button on the run tab and now I
can't find the house I'm supposed to be at what's up with that."
HE WAS RIGHT, AND IT WAS WORSE THAN HE THOUGHT.

BUG 1 -- REROLL REPLACED THE WORLD AND LEFT EVERYTHING DERIVED FROM IT STANDING.
Measured across one press:
    seed   2691674296 -> 3182853632   (a new valley)
    cell   48,48      -> 52,48        (a new neighbourhood)
    hx,hy  6205,6271  -> 6205,6271    (HE NEVER MOVED)
    HOME   6219,6256  -> 6219,6256    (a house in a valley that is gone)
Walk again and his own front door was *** 549 TILES AWAY ***, in a cell he was
not standing in. HOME anchors on LANDED -- where you dropped in -- so a stale
LANDED also drags the anchor back to the centre of the cell, which is the exact
regression homeFind's OWN COMMENT records from 8/11: "HOME 55 cells north of the
drop-in ... indistinguishable from not having one."

BUG 2, UNDERNEATH IT -- AND REROLL PUT HIM ON THE STRIP, WHICH HAS NO HOUSES.
The handler carried a COPY of `city.x=L.stripX; city.y=Math.round(96*0.5)` --
word for word the line __WORKING_DISTRICT__'s own comment names as the 8/2 bug
("the literal middle of the valley, on the Strip, every run") and keeps ONLY as
a last-resort fallback. Boot was fixed on 8/2. *** REROLL KEPT THE DEAD VERSION,
because the fix lived in an ANONYMOUS IIFE that nothing else could call. *** So
after fixing bug 1 alone he still had NO HOME AT ALL: district 'strip', homeFind
scanned the cell, correctly found nothing, and there was nothing to find.

*** A COPIED LINE IS A FIX THAT ONLY HALF-SHIPPED. *** placeWorkingDistrict() is
a named function now, called at boot AND at reroll, so the two cannot disagree
again. If a fix needs to happen in two places, the second place will be missed;
give it a name and call it twice.

MEASURED AFTER: five consecutive presses, five different seeds, every one a
SUBURB with a house 6 to 48 tiles away. Before: the Strip, or 549 tiles.

GATE: reroll_gate.js, 8 claims, presses the button he pressed FIVE times through
the real link. Both bugs mutation-proved red: restore the Strip line and 5 of 5
rerolls leave him homeless; stop clearing the stale state and the old valley's
HOME survives the press.

LANE NOTE: this is a fix in the CITY lane's file. It is his live bug so it was
fixed the turn he reported it. Two lines in the reroll handler plus naming an
existing IIFE; no city logic or render maths touched.

PEOPLE (7h9sfy): 8/15 (m) -- *** THE STREET TALKS. AND THE REASON IT DID NOT IS
THE WORST REACH FAILURE THIS LANE HAS FOUND. ***

*** MEASURED: `linesFor` WAS CALLED ZERO TIMES IN BOHEMIA_CITY_WORLD.html. ***
That is the frame the player is looking at when they tap RUN. 244 written barks
and 66 reactions, inlined in that file, present and correct, and NOTHING IN IT
HAD EVER ASKED FOR A LINE.

HOW IT HID FOR THREE DAYS -- the game is split across two frames and I had the
wrong one the entire time:
  BOHEMIA_RUN_CURRENT.html  SIM, RUN, reactionCtx, witnessResolution, the person
                            card. The RUN tab does NOT show this. It is parked
                            in a hidden panel so postMessage still finds it.
  BOHEMIA_CITY_WORLD.html   DAY, DQ, the wake card, pplPeople/pplAt/peoplePass,
                            the people you walk past. THIS is what p-city shows.
So the mouth, the reactions, AND the gate that proves them were all honestly
green about a surface nobody reaches. THE SAME DISEASE AS THE OPENING AND THE
BARKS, at the largest scale yet -- and every one of those gates was passing.

NOW: walk near somebody outdoors and they say one of his lines in a bubble over
their head, sized by reading speed, quantized to the beat, one mouth at a time.
Verified in a screenshot through the real link: "Half the block, same as
Tuesday." over a neighbour two tiles away.

*** AND IT FAILED FOUR TIMES BEFORE IT DREW ONE PIXEL, EVERY TIME WITH
EVERYTHING UPSTREAM MEASURING PERFECT. *** Worth reading in full, because each
one is a way to ship silence:
 1. THE BLOCK LANDED INSIDE THE DRAW FUNCTION. I anchored on the peoplePass CALL
    SITE, so every `function barkHold(...)` was a nested declaration.
 2. THE CLOCK DEMANDED AN EXACT BEAT (`if (beat % 8) return`). This city is
    I-MOVE-YOU-MOVE and only draws when the player acts, so a draw almost never
    lands on the right beat. Forty walked steps, nobody ever spoke. A clock has
    to be a DEADLINE THE NEXT DRAW CAN BE LATE FOR, never an instant to hit.
 3. IT PICKED THE NEAREST PERSON, NOT A VISIBLE ONE. At 06:00 the block is home;
    the nearest person was asleep inside a house two tiles away. The line
    resolved correctly and the bubble was over a roof. It reads peoplePass's own
    drawn list now -- if the renderer did not draw them, they do not speak.
 4. *** THE CITY'S 2D CONTEXT IS `g`, NOT `ctx`. *** barkPass opened with
    `var g = ctx;` -- both a reference to something the frame lacks AND a shadow
    of the real one -- so it threw on its first line every single call, inside
    the try/catch around it. A CAUGHT EXCEPTION IN A DRAW PATH IS A FEATURE THAT
    SILENTLY DOES NOTHING, and that is worse than a crash because a crash gets
    fixed.

TWO PROBE LESSONS THAT COST AN HOUR EACH AND WILL COST THE NEXT SESSION THE SAME:
 - *** NEVER PROBE slices/BOHEMIA_CITY_WORLD.html STANDALONE. *** It has no
   PLAYER_CV (the character bake is POSTED IN from the alpha), so peoplePass
   returns early and draws NOBODY. I measured "zero bodies on screen at every
   hour of the day" and nearly reported the valley as a ghost town. Through the
   alpha, people are drawn at every hour. Boot the alpha, always.
 - THE RENDER PATH IS renderHuman(), NOT draw(). Calling draw() from a probe
   never reaches the human-mode pass; barkPass was invoked ZERO times while the
   real game was drawing bubbles fine.

GATE: city_barks_gate.js, 12 claims, and the pixel claim is A DIFFERENCE -- the
same frame drawn silent and spoken must DIFFER. The first cut counted pale
#cdbd8a-ish pixels across the canvas and THIS IS A DESERT: sand and stucco sit
in exactly that range, so it counted thousands either way. I mutated the context
name back to the shipped bug and the gate stayed GREEN. Third checkbox of the
day. A colour census cannot tell a bubble from a pavement.

LANE NOTE: this is PEOPLE-lane code inside the CITY lane's file -- additive,
between two markers, regenerated by tools/bohemia_city_barks_patch.py. It touches
no city logic and no render maths. CITY lane: it is one block, move it if you
want it elsewhere.

PEOPLE (7h9sfy): 8/15 (c) -- *** THE DEMO GATE EXISTS. ROW 9 WAS THE ONLY
CRITICAL-PATH ROW WITH NO OWNER AND NOBODY HAD PICKED IT UP. ***

ROW 9: "one integration test that plays the whole day headless + deploy-verified
on the real link. THE DEMO IS A BUILD, NOT A VIBE."

WHY IT WAS NEEDED WHEN dayloop_gate ALREADY PLAYS A DAY IN A BROWSER: it plays
it in slices/BOHEMIA_CITY_WORLD.html, and *** THAT IS NOT THE DOOR. *** He taps
ONE link and everything he sees comes through the alpha. Every difference
between those two surfaces is a place the demo can be broken with every gate
green -- and 8/14 turned up THREE of exactly that kind in one afternoon. So
gates/demo_gate.js plays it the way he plays it: open the link, tap through TAP
TO ENTER, tap RUN, take the opening, take the job OFF THE PHONE, live the day to
nightfall, read the reckoning, confirm tomorrow is a different job. 19 claims.

*** AND THE HONEST GAP, SAID OUT LOUD RATHER THAN QUIETLY SKIPPED: THIS
CONTAINER CANNOT REACH github.io. *** The agent proxy answers 403 to CONNECT
(checked: curl -> "CONNECT tunnel failed, response 403"). A gate that cannot
make the request cannot make the claim, and faking it against a local file would
be the side-door probe the 7/18 law bans. So row 9's DEPLOY half stays MANUAL
(the pages workflow run + `git merge-base --is-ancestor`, per the ship flow) and
DEMO GREEN DOES NOT MEAN THE LIVE LINK IS GOOD. If a future session runs where
the network allows it, that half is a ten-line addition and the gate says where.

TWO MORE OF THE SAME BUG CLASS, CAUGHT BY BUILDING IT:
 - The gate picked its frame with `frames().find(f => /RUN_CURRENT|CITY_WORLD/)`
   and got RUN_CURRENT, which does NOT own the day loop -- DAY, DQ and the wake
   card all live in CITY_WORLD. That is the .find()-returns-the-first-match bug
   this handoff already records against bohemia_city_app.js isFrame(), which
   blinded fourteen gates at once. It asks each frame what it CAN DO now.
 - It clicked GET UP and demanded an objective, which is the PRE-8/12 flow. The
   day starts with NO job now; the work ARRIVES on the phone and is taken there
   (__THE_PHONE_RINGS__, RUN lane). My gate read "the demo is broken" when the
   demo had grown a better opening move. A gate written against last week's
   product is a gate that reports last week's news.

PEOPLE (7h9sfy): 8/15 (b) -- *** FIVE PLAYABLE DAYS. DEMO CRITICAL PATH ROW 4 IS
AT THE TOP OF ITS RANGE INSTEAD OF THE FLOOR. ***

HIS WORD ON THE OPENING: "I saw it I like it. I appreciate it thank you."
NOTES ARE RULINGS (7/19) -- that is the verdict, it is not going back to him.

ROW 4 OF THE DEMO PLAN: "3-5 PLAYABLE QUESTS: demo-legal via hardcoded
placements (the S01 pattern)". The demo had THREE and had had three since 8/11.
Days 4 and 5 are now S22 THE COLD ROOM and S25 THE PRESSURE GOES BACKWARD, and
they cost two rows in bohemia_demoquests.js DAYS -- no new machinery at all,
because both were written in the meter reader's exact stage shape (open 10,
advance to 20 on a world event, choose at 20 between #quiet/#notable/#reckless,
33 is the author's own FAIL branch for nightfall).
  day 4  enter a building        -- you have to GO IN AND LOOK at the machine
  day 5  enter a NEW district    -- the sick houses are not neighbours, and
                                    crossing into somewhere new IS the deduction
Both picked by the module's own honest rule: the world can actually satisfy them
today. No `require:'heat'` on the cold room, because the world has no heat axis
this table can ask about and a condition that never fires is a day that never
plays.

*** TWO TOOLS THAT LIED ABOUT BEING IDEMPOTENT, AND ONE GATE THAT TESTED ITSELF ***

 1. bohemia_city_dayloop_patch.py said "Idempotent: re-running finds the marker
    and reports NOOP." IT IS NOT IDEMPOTENT, IT IS ONE-SHOT. Adding a quest to
    QUESTS printed NOOP and the city kept serving the old bytes -- the exact
    failure bohemia_city_module_resync.py exists to clean up after, and a
    violation of the 8/11 law that an editing tool must REPLACE. It rebuilds and
    swaps the whole generated block now, proven by md5 over two runs.
 2. dayloop_gate.js hardcoded the three quest file stems. The demo grew to five
    and the gate did not: SRC had no text for the new files, openDay() correctly
    returned null, and the gate reported "no resolution card" AS IF THE QUESTS
    WERE BROKEN. They were fine. It reads DQ.DAYS now. *** THIS IS THE SECOND
    TIME IN TWO DAYS A GATE FAILED BECAUSE IT RETYPED A LIST THE CODE ALREADY
    OWNED *** (the other was opening_gate guessing the DIRECT storage key). If
    your gate types out a constant the product also types out, it is testing
    your typing.
 3. Row 4 is now a CLAIM, not a hope: dayloop_gate asserts 3-5 days, no repeats,
    numbered in order. A future session cannot quietly drop back under the line.

PEOPLE (7h9sfy): 8/14 (f) -- *** THE GAME OPENS WITH THE COLD OPEN.
DEMO CRITICAL PATH ROWS 7 AND 10, DONE. ***

THE DEMO PLAN HAS TWO ROWS FOR THIS AND NEITHER WAS DONE, FOR TEN DAYS:
  "7.  THE FIRST FIVE MINUTES: an opening that needs zero explanation -- the
       scripted-scene runtime (PEOPLE 0sc) playing a minimal cold open, or a
       clean wake-up-and-go IF THE COLD OPEN ISN'T READY."
  "10. THE COLD OPEN SCENE (PEOPLE 0sc scripted-scene runtime + RUN consumes)"
The runtime shipped 8/9. The scene shipped. The CUTSCENE tab is gated forty
claims deep. AND THE RUN NEVER CONSUMED IT: measured, ZERO references to the
scene runtime anywhere in the run source, booting straight into wakeInBed()
which is that row's own FALLBACK. The demo has been opening on the fallback the
whole time while the real opening sat one tab away. THIRD DAY RUNNING FOR THIS
DISEASE: built, gated, green, and not in the surface he taps.

NOW: tap RUN with no day in progress and the cold open plays over the run, then
hands you the day. SKIP is on screen from the first frame. It never plays twice
and never over a real save.
*** AND IT PLAYS HIS DIRECTED VERSION. *** openScene() reads DIR['scene:<id>']
before canon, so a line he retypes in the DIRECT tab is the line the GAME OPENS
WITH on his phone. That is HE MUST BE ABLE TO DIRECT IT (8/12) finally closing
its loop -- the instrument existed but the thing it edited was a viewing room.

*** THREE THINGS THE DOM SAID WERE FINE AND THE SCREENSHOT SAID WERE NOT. ***
Every one of these passed a green check before a picture caught it:

 1. A FRESH PLAYER ALREADY HAS A SAVE. The first cut gated on "no bohemia.save
    .v1" and never fired once. The RUN frame preloads on a 2.5s timer, boots,
    and writes an auto-save labelled auto:start at beat 0 / turn 0 before
    anybody has touched anything. *** THE PRESENCE OF A SAVE IS NOT EVIDENCE OF
    PROGRESS *** and any lane reading that key as "has this person played?" is
    reading it wrong. Now it looks for a save with something IN it.
 2. IT PLAYED BEHIND THE SPLASH. Overlay shown, canvas painting, captions
    advancing BEFORE -> the mother -> the daughter, all checks green, and the
    screenshot was TAP TO ENTER: #front is fixed at z-index 200 over everything.
    The scene was burning through where nobody could see it. It waits for the
    door now.
 3. *** THE RUN TAB DOES NOT SHOW THE RUN PANEL. *** Paolo 7/28, "Can you put
    the city in the run tab?" -- the switcher routes run -> p-city and parks the
    run iframe in a hidden p-run so postMessage still finds it. The overlay was
    in p-run, so it computed display:flex inside a display:none parent: the
    check said visible, the canvas really was painting, and the bounding box was
    0x0. *** display:flex IS NOT VISIBLE. *** The gate now claims AREA, and the
    overlay moves itself into whatever panel is actually live, so a future
    reroute cannot break it again.

*** AND THEN THE FULL SUITE CAUGHT THE FOURTH ONE, WHICH WAS A DESIGN MISTAKE. ***
The first cut AUTO-PLAYED the moment the RUN tab was tapped. Green on its own
gate, and it turned THREE OTHER LANES' GATES RED: NAV CLUSTER ("the canvas is
101px of a 150px viewport" -- my overlay had the screen), VOICE SURFACES ("30
utterances for 7 distinct lines") and SQUIGGLE VOICE ("three utterances needed
to check voice identity") -- my scene was talking over their counts.
THAT IS THE MACHINE TELLING YOU THE DESIGN IS WRONG, NOT THE TEST. The alpha is
a SIXTEEN TAB surface and he taps RUN all day; a forty-second scene seizing the
screen because he changed tabs is a thing you learn to dread, and there was no
moment where the story CHOSE to start -- it just took over while the run was
still loading. So it INVITES now: a small card, out of the layout flow, "DAY 1
BEGINS BEFORE THE DAY / The family, the table, ten years ago. / WATCH | NOT NOW".
Still the first thing on the run surface, still zero explanation, and the story
starts because somebody started it. NOT NOW is remembered -- asking twice is the
same ambush in a politer voice. Both voice gates went back to full green
(41/41, 26/26). NAV CLUSTER fails IDENTICALLY with the opening fully disabled,
so it is another lane's.

GATE: opening_gate.js, 20 claims, and it enters through the splash the way a
finger does rather than clicking through it. Four mutations proved red: cut the
trigger (4 fail), ignore his directed scene (1), ambush a returning player (1),
and leave the overlay in p-run -- the exact bug that shipped past the first cut
(2). It also claims the run stays PLAYABLE under the invite, and holds the three ways this is worse than not shipping: playing over
a real save, playing twice, and stranding somebody on a black rectangle.

PEOPLE (7h9sfy): 8/14 (a) -- *** 25 QUESTS. FOUR NEW ONES IN A DAY, ALL FOUR
BUILT ON STUDIES NOBODY HAD EVER OPENED, ALL FOUR ABOUT WATER. ***

21 -> 25 quests, 26 -> 35 studies cited. The three new ones after THE COLD ROOM
are each ONE VERIFIED REAL FACT turned into a fork, researched rather than
invented, because "the most realistic economic crash simulator, but fun" means
the fact has to survive being looked up:

 S23 DEAD POOL. Lake Mead has three intakes. The first dies at 1,050 feet, the
   second around 1,000. So the valley spent $1.5 BILLION on a third -- three
   miles of tunnel, twenty feet across -- with its mouth at about 860. DEAD POOL,
   the elevation where Hoover Dam stops releasing anything downstream at all, is
   895. *** THIS CITY DRINKS THIRTY-FIVE FEET BELOW THE END OF THE RIVER. ***
   Plus a pumping station that moves 900 million gallons a day out of a lake that
   is no longer legally a river. It is not a conspiracy, it is a public works
   project with a budget line and a ribbon cutting. A caravan comes up from the
   dry country and the whole quest is what you are willing to say to them.
   (snwa.com/infrastructure-improvements/intake3-pumping-station)

 S24 FIFTY-FIVE GALLONS A FOOT. The water authority paid people to tear out their
   lawns for twenty-five years -- $5 a square foot, $7 with the district's share.
   185 MILLION square feet converted, 119 billion gallons saved, and the number
   printed on every flyer for a generation: 55 GALLONS PER SQUARE FOOT PER YEAR.
   *** THE ECONOMY DIED AND THE INSTRUMENT DID NOT. *** Everybody on the block
   still converts grass to gallons in their head instantly, because they were
   paid to for twenty years. So a lawn that is still green is not pretty here, it
   is a number, and the number is RIGHT -- 2,000 feet, 110,000 gallons a year. It
   is a greywater rig. Being right about the arithmetic is not being right.

 S25 THE PRESSURE GOES BACKWARD. A water main keeps dirt out by PUSHING; there is
   no valve doing that job. Drop the pressure and every unprotected connection
   stops being an outlet and becomes an inlet -- backsiphonage, and it pulls
   whatever is on the far end BACKWARD into the drinking main. That is why a
   utility issues a boil notice on a pressure loss alone, before any sample comes
   back. The sick houses are UPHILL and everybody spends eleven days looking
   downhill. The cause is a garden hose sitting in a rain barrel. And the
   pressure drop was the block's own: everyone fills their tank at six o'clock.
   *** THE INVESTIGATOR IS IMPLICATED, and the quest says so flatly instead of
   saving it for a twist. ***

PEOPLE (7h9sfy): 8/13 (f) -- *** QUEST 22: THE COLD ROOM. FIRST NEW CANON QUEST
OFF THE UNTOUCHED 126. ***

THE MEASUREMENT THAT PICKED IT: 21 canon quests cited 26 of the 152 studied
quests. *** 126 STUDIES HAD NEVER BEEN DRAWN FROM ONCE. *** The corpus was the
answer to "what do we build next" and nobody had asked it that question. S22 is
built entirely on untouched findings:
  Q008.W4 QUEST GATED BEHIND A LIFE SKILL
  Q008.W2 DISGUISE AS MAINTAINED PERFORMANCE
  Q005.W3 FAILURE-AS-CONTENT   +  Q005.P3  (the flaws-master half of it)
  Q008.W8 THE APPROACH IS A MORAL STANCE
  Q006.P6 W7 (invisible fair math
Three studies, two masters, every title verbatim. Gate: 324 claims green.

WHAT IT IS, AND IT IS ONE TRUE FACT TURNED INTO A FORK. Las Vegas tap water is
among the hardest in the country and evaporative cooler pads calcify into stone
in WEEKS. A scaled pad still passes air, the pump still runs, the water still
drips -- so a dead cooler looks, sounds and feels exactly like a working one.
On a 12% lit grid the swamp cooler is the only cooling anybody can afford, and
one cooled room is the difference for the old people on the block at 115 degrees.
The skill gate is knowing that a dead PUMP means DRY and this machine is WET.
  knew it            -> pull the pads, soak them, spare set in    #quiet
  said so out loud   -> fetch the one person who does, in public  #notable
  cut a second feed  -> a real compressor off the Network's line  #reckless
                        (LIGHT=TERRITORY: the room stops being a room and starts
                         being a load on somebody's list)
  swapped the pump   -> FAIL, and it WORKS FOR ONE EVENING, which is the whole
                        point of failure-as-content. Nobody ever tells you that
                        you got it wrong.
The lesson underneath, never spoken: pretending you know how costs somebody else,
never you.

THE GATE FOUND A REAL IMPROVEMENT, worth recording because it looked like a false
positive: it flagged "July" and "November" as hardcoded names. They are months,
not people, so the heuristic was technically wrong -- and the fix was still to
change the LINE, not the gate. "in the heat / in the cold" is better writing for
a valley that lost its calendar, and loosening a shared gate to fit my prose
would have been the wrong trade.

*** AND ONE OF THEM BLINDED A GATE'S SELF-TEST, WHICH IS WORTH THE WHOLE PAGE ***
deed_bridge_gate derives its units divisor off the corpus: max |faction delta|
over the rung step. S23 authored a -20 (walking armed strangers to the valley's
intake is the largest betrayal in the set), max moved 18 -> 20, and the DERIVED
divisor became exactly 10. Its self-test probe had HARDCODED 10 as the
"deliberately wrong, picked by feel" value -- so the fake and the correct answer
became the same number and the probe silently stopped catching anything.
*** A SELF-TEST WITH A CONSTANT IN IT HAS AN EXPIRY DATE. *** The wrong value has
to be defined RELATIVE to the derived one so it can never collide: divisor+1, and
now divisor-1 too so the claim is not one-sided. Verified on BOTH corpora -- 16/16
probes caught at divisor 9 and at divisor 10 -- so it is a real tightening rather
than something tuned to today's data. It reported 14/15 instead of lying, which
is the only reason anybody saw it. THE FIX WAS THE PROBE, NOT MY -20.

TAB: DIRECT -- 25 quests, 1,390 directable rows. TAB: WORDS -- 1,494 lines,
29 sources. TAB: SLICE -- rebuilt (the phone carries the quest set).
TAB: SLICE -- the phone slice carries the quest set, so adding a quest made it
stale. `node tools/build_current_slice.js` is part of shipping a quest; the
current_slice gate catches it, but only if you run the WHOLE suite.

*** FOR THE CROWD LANE: crowd_gate.js IS FLAKY AND THAT MAKES IT NOT A GATE. ***
Measured, three runs back to back on an unchanged tree: 15/16, 16/16, 16/16. The
failing claim is "redrawing the same crowd gives byte-identical pixels (no dice
in the render path)", which is a good thing to want and is inherently sensitive
to timing and GPU state when the suite is running eight browsers at once. A gate
that gives different answers about the same bytes cannot tell anybody anything --
and worse, it teaches every lane to shrug at a red, which is how a real one gets
ignored. Either pin the nondeterminism (same-frame double draw, no rAF between)
or make the claim something stable. Not this lane's file, so not this lane's fix,
but somebody has to own it.

PEOPLE (7h9sfy): 8/13 (e) -- *** AND NOW THE MOUTH ANSWERS THE WORLD.
66 REACTION LINES OVER THREE SYSTEMS THAT TRACKED EVERYTHING AND SAID NOTHING. ***

DEPTH IS REACTIVITY, NOT WORD COUNT. Hades ships ~21,020 lines whose only job is
to notice what you just did; that is the number people mean when they say a game
feels deep. Bohemia had 244 barks and every one of them fired the same whether
you had robbed the block or fed it.

WHAT WAS ALREADY BEING TRACKED AND NEVER REACHED A MOUTH -- three systems, all
live, all mute:
  bohemia_standing.js  RUNGS         HOSTILE COLD NEUTRAL WARM FWU
  bohemia_loop.js      CLOUT_WEIGHTS quiet notable risky reckless
  the memory of whether this person has met you, and how that went
The engine knew your reputation on the block. Nobody on the block ever mentioned
it. THAT is the same disease as the empty LINES table one turn earlier: the work
exists and does not reach the surface he taps.

66 LINES IN 19 BUCKETS, AND NOT ONE KEY IS TYPED BY HAND. The factory READS the
rung names out of bohemia_standing.js and the clout tiers out of bohemia_loop.js
and refuses to author a key the sim cannot emit. A key the sim never emits is a
line that can never fire -- the silent way a full-looking table dies, and the
gate that caught it for barks now catches it for reactions.
  rung:  HOSTILE COLD NEUTRAL WARM FWU
  saw:   quiet notable risky reckless      (they watched you do it)
  heard: same four, one remove colder      (it got to them secondhand)
  met:   first again known asked honest lied

PRECEDENCE IS THE WHOLE DESIGN: saw > heard > rung > met > ambient.
SEEING BEATS HEARING BEATS KNOWING YOU. Someone who watched you says
"I saw. I don't think anybody else did." Someone who only heard is vaguer and
colder about it. The time-of-day ambient lines now only speak when nobody in
earshot has anything on you -- which is what they were always for.

*** AND THEN I FOUND THE BARKS HAD NEVER BEEN AUDIBLE. NOT ONE OF THEM, EVER. ***

I went to verify on the real surface and the module was not there. Three things
were wrong at once, every one of them invisible to every gate we had, and all
three had been true since the day the 244 barks shipped:

 1. THE SCREEN NEVER ASKED. The one call site in the walked run was
    `BohemiaPeople.linesFor(who)` -- NO SECOND ARGUMENT. linesFor resolves by
    role:act / faction / situation off that argument, so 58 of 58 buckets were
    unreachable. The table was full and the query was blind. Written, gated,
    green, and mute.
 2. THE COPY HE LOADS WAS A BUILD BEHIND. Every gate reads engine/*.js off disk.
    The frame the RUN tab actually loads and the CITY world both carry INLINED
    copies, and neither had REACTIONS in it at all. Fresh on disk, stale in the
    surface he taps -- the exact thing ENGINE SYNC LAW exists for, and the sweep
    reported ZERO DRIFT because those copies were outside it.
 3. A KEY NOTHING COULD EMIT. `met:lied` could never fire: the ledger stored one
    honesty bit and threw the false case away, so "never answered" and "answered
    and lied" were the same record. Two written lines, permanently unreachable.
    Fixed on the EMITTING side (the boolean was already arriving and being
    discarded), never by deleting the lines.

FIXED, AND WIRED TO THE ORGANS THAT ALREADY KNEW. reactionCtx() in the run source
hands linesFor four things nothing had ever asked for:
  saw / heard  RUN.sawList -- witnessResolution() already recorded exactly who was
               in reach and whether they were OUTDOORS (saw it) or behind a wall
               (heard it). Outdoors gets the sharp lines, indoors the vague ones.
  rung         BohemiaStanding.opinionOf() on THIS PERSON'S OWN mind. Not the
               faction average on the readout -- the person in front of you has
               their own memory and their own decay and it is what they speak with.
  met          PEOPLE_MET.metState(), which now lives on the ledger that owns the
               bits, so no surface ever re-derives "have we met" for itself.
All four are optional; anything the world has not produced comes back null and it
falls through to ambient, which is honest -- a stranger talks about the weather.

*** AND THE FIRST VERSION OF THE NEW GATE WAS ALSO WRONG, WHICH IS THE LESSON. ***
It grepped the run source for `RUN.sawList` and `BohemiaStanding`. I mutated the
code to `if(false){...}`, BOTH STRINGS STAYED IN THE FILE, and the gate stayed
green. A checker that cannot tell a MENTION from a USE is the broken one (8/1).
Thrown away and rewritten: gates/reaction_reach_gate.js BOOTS THE SURFACE, plants
the signals the way the world plants them (his own DEED_WEIGHT, loaded from the
canon quests' @DO lines -- nothing invented), and asks the page what came out.
Three mutations proved red: cut the witness read, cut the standing read, or swap
in a stale inline module and it fails 2, 2 and 15 claims.

FOR EVERY LANE, BECAUSE THIS IS NOT A PEOPLE PROBLEM: slices/BOHEMIA_RUN_CURRENT
.html IS A BUILD OUTPUT. Editing it works until the next `node tools/build_run_
slice.js` silently erases you. The source is slices/BOHEMIA_RUN_SLICE_7_26_26.html.
I typed my first fix into the output and had to redo it.

*** AND I DID THE SAME THING TO THE SOUNDS LANE, WHICH IS THE SHARPER VERSION. ***
On 8/12 they found the cold open speaking 58 times for 7 lines and fixed it by
hand IN THE ALPHA, inside the cutVoice block that tools/bohemia_cutscene_tab_
patch.py owns. My re-run of that tool rewrote the block from its own template and
DELETED THEIR FIX. Their gate (every_voice_surface_gate.py) caught me: green on
main's alpha, 2 failed on mine. Their guard now lives in MY TOOL, credited, so
re-running is idempotent -- proved by running it twice for the same md5.
THE RULE THIS MAKES: if you fix something inside a block another lane's tool
generates, the fix belongs in THAT TOOL. A fix that lives only in the output
survives exactly until the next lane regenerates it, and nothing warns either of
you. Check `git log -1 -- tools/<the tool>` before hand-editing a generated block.

FOUR MORE GATES WERE RED AND MINE, all found by running the full suite instead of
just my own: QUEST PLACEMENT (its judge page stamps engine md5s and I changed a
module -- rerun tools/bohemia_quest_placement_judge.py), REUSE FIRST and TASTE
(my three word tools carried neither block; they do now, and the TASTE one is a
real machine check that refuses to write a file containing an em dash, proved by
planting one). STILL RED AND NOT MINE, confirmed against origin/main: REUSE FIRST
on bohemia_family_cast_patch.py + bohemia_sun_mode_char_patch.py (CHARACTER lane),
MAP TAB on arterial/freeway body drift (WORLD lane), ONE WORLD TAB (its scanner
reads the word STORY out of a COMMENT and calls it navigation -- mention vs use,
same disease, in a gate).

TAB: WORDS -- 1,256 lines across 25 sources now, 1,254 citing the catalogue,
every one editable in place and exportable.
TAB: RUN -- walk up to somebody and they now say something that depends on what
you did, whether they saw it or heard it, and how you two stand.
SHIPPED as BUILD 8/13e, on main.

THE MERGE WAS GOOD NEWS, WORTH KNOWING BEFORE YOU BUILD ON THIS: while this was
gating, another lane shipped THE VALLEY REMEMBERS -- standing now SURVIVES THE
NIGHT. That is the exact signal reactionCtx feeds to linesFor, so a rung: line is
no longer about something that resets at dawn. The two lanes did not coordinate
and the systems met correctly because both read the same engine rather than each
keeping a copy. That is the argument for READING THE MODULE instead of retyping
its values, in one sentence.

WHAT WAS STILL RED IN THE SUITE AT SHIP AND WHY IT WAS NOT HELD FOR: 12 gates,
every one checked rather than assumed. RENDER PIXEL fails IDENTICALLY on main's
own base (checked out c181352 and ran it: 4 passed 1 failed, both ways). THE
CROWD passes 16/16 run alone and only fails inside the suite -- browser
contention, and its claim is "byte-identical pixels", which is exactly the kind
of claim that flakes under load. ONE WORLD TAB and REUSE FIRST are other lanes'
(named above). The other eight read district/art/render data this lane never
touched. NOBODY SHOULD TAKE THAT LIST ON FAITH -- the method is in the commits:
check out the base commit, run the gate there, compare.

GATE: DIALOGUE CATALOGUE is 47 claims. Two new ones, both mutation-tested RED
before being trusted: inventing a rung the standing module does not define
(rung:FRIENDLY) fails, and reordering linesFor() so ambient outranks reaction
fails. PEOPLE_GATE A2 had to be INVERTED -- it asserted "LINES ships empty",
which was the correct 7/31 read of MECHANISM-MINE and was overturned by ALWAYS
MAKE AN ATTEMPT on 8/11. *** A GATE MUST NEVER OUTRANK A RULING (8/1). *** Third
time this week a stale gate tried to enforce a dead reading; fix the ruler, never
the target. What survives: NAMED_CAST is still empty and still checked -- WHO
anybody IS is a DECISION, what they SAY is an attempt.

HIS EARLIER NOTE, STILL THE STANDARD: "cool another menu.... generate text for
now with our quest catalog we have." Two turns of content since. No new menus.

WHAT WAS EMPTY, AND IT WAS THE BLANK PAGE AGAIN. engine/bohemia_people.js has
carried `var LINES = {};` with a comment saying "nothing may fill it but him".
THAT COMMENT PREDATES ALWAYS MAKE AN ATTEMPT (8/11), which overturned exactly
that reading for WORDS -- his own diagnosis of the empty field was "THATS WHY I
HAVENT DONE QUESTS YET". Every person in the walked world already had a role, a
schedule, a faction and a block. They had had nothing to say for a month.

THE CATALOGUE TOLD US TO DO THIS FIRST, IN SO MANY WORDS. Q043.W4 AMBIENT BANTER
AS CHARACTERIZATION: "the cast comes alive through OVERHEARD relationships, not
just quests -- cheap, high-impact life (a solo-dev-friendly technique)." The
corpus names barks as the single best return on effort a one-person team has.

244 LINES IN 58 BUCKETS, and the buckets are THE SIM'S OWN VOCABULARY so they
actually fire:
  28  role:act   worker/scav/keeper/watch x sleep/home/work/free/scav/errand/
                 watch -- exactly bohemia_agents.js's words, nothing invented
  17  faction:   Reds/Blues/Anarchists/Church/Network/Trades/Caravans/... from
                 the real faction graph
  13  when:      night, brownout, heat, hungry, market, rain, seen, met_before,
                 owed, favour, stranger_block, work_short, after_trouble
Nobody explains the collapse in a single line of it (Q056.W8 ATMOSPHERE OVER
EXPOSITION). They complain about the water pressure, the shift, the meter, the
rent. The game is an economic crash simulator so the ERRAND is the subject
(Q001.W1 TRANSACTION-CARRIES-EMOTION), and the Network's people are unfailingly
polite (Q025.W5 THE BANALITY OF EVIL).

WIRED, NOT JUST WRITTEN. linesFor(person, opts) now resolves MOST SPECIFIC
FIRST: their key, then role:act, then role, then faction, then situation. The
old lookup only knew key and role, so even a full table would have fired four
buckets out of 58.

TAB: WORDS -- now 1,190 lines, 244 of them the world talking, every one a draft
he can retype, every one citing the catalogue finding it was written off.

GATE: DIALOGUE CATALOGUE is 38 claims now. It asserts the LINES table is no
longer the literal string `var LINES = {};`, that there is real volume (>=150),
that every bark cites a resolving id with a VERBATIM title and a real applied
sentence, and *** that every role:act bucket uses the AGENTS MODULE'S OWN role
and act words -- a bucket named something the sim never says is a line that can
never fire, which is the silent way a bark table dies. ***

*** NEXT (the GO list, in order):
 1. QUEST VOLUME, AND S22 PROVES THE COST IS LOW. 22 canon quests against 152
    studied; 123 studies still never drawn from. S22 took one file: the study
    gate, DIRECT, WORDS, the placement judge and the run build all picked it up
    with no new code. Pick untouched studies (the measuring script is three lines
    of python over BOHEMIA_QUESTBOOK_LAW_INDEX.json and the .bq citations), find
    the ONE TRUE FACT about this valley that makes a fork, and write it.
 2. MORE REACTION AXES, SAME METHOD. The factory reads its keys off the engine,
    so the next batch is the next set of things the sim already knows and never
    says: time since a raid, block wealth, weather, whether they are on shift.
 3. A BARK OVER THEIR HEAD IN THE WALKED WORLD. The person CARD speaks now, and
    reaction_reach_gate proves it. What is still missing is hearing somebody
    without opening a card -- that is the CITY lane's render surface.
    Coordinate before crossing.
 4. Not this lane: 60 tools still crash on CITY_B64; his 11 perimeter walls.

 *** AND A STANDING WARNING FOR EVERY LANE, PAID FOR TWICE THIS WEEK ***
 A GREEN GATE THAT READS engine/*.js PROVES NOTHING ABOUT WHAT HE LOADS. Three
 surfaces carry inlined copies (the alpha, BOHEMIA_RUN_CURRENT, BOHEMIA_CITY_
 WORLD) and only some modules are in the resync sweep. Before you claim a module
 shipped: `python3 tools/bohemia_city_module_resync.py --check` and then OPEN THE
 SURFACE and ask it. And if your check greps a file for a symbol, mutate the code
 to `if(false)` and watch it -- if it stays green, the string survived and your
 gate is a checkbox. ***

PEOPLE (7h9sfy): 8/12 (b) -- *** HIS NOTES ON THE COLD OPEN, ALL FIVE,
FIXED. THE TAB IS CALLED CUTSCENE NOW (his word). ***
PEOPLE (7h9sfy): 8/12 (d) -- *** THE CUTSCENE PLUMBING IS A MACHINE NOW,
NOT A DIORAMA. A SECOND SCENE COSTS A JSON FILE AND ZERO NEW CODE. ***
PEOPLE (7h9sfy): 8/12 (f) -- *** THE SECOND CUTSCENE SHIPPED, AND IT COST
ONE JSON FILE. THE GRIEF DINNER IS IN THE CUTSCENE TAB. ***
PEOPLE (7h9sfy): 8/12 (h) -- *** NEW LAW, HIS, AND IT IS ABOUT US:
HE MUST BE ABLE TO DIRECT IT, NOT JUST WATCH IT.
laws/BOHEMIA_ADDENDUM_HE_MUST_BE_ABLE_TO_DIRECT_8_12_26.md. TAB: DIRECT. ***

HIS WORDS: "Bro this is the same fucking problem we had with the questing shit!
I CANT DIRECT QUESTS OR CUTSCENES RN WTF IS WRONG WITH YOU."

HE IS RIGHT AND IT IS THE SECOND TIME. WORDS (8/11) let him change what somebody
SAYS. It did NOT let him change who is in a scene, what order it happens in,
where it happens, whether a beat exists at all, or where a choice leads -- which
is the entire job of a director. He watched two cutscenes, had structural notes
about both, and his only channel was typing a paragraph at me and waiting.

*** AND IT PUT THE APPROVALS QUEUE BACK THROUGH THE SIDE DOOR. My previous turn
ended with "does the father live?" -- a structural decision I had no way to
RECEIVE except as an answer to a question. EVERYTHING IS A THUMB (8/9) banned the
queue; it came back because the INSTRUMENT was missing. Build the instrument and
the question disappears. ***

THE LAW: every system he has to make decisions about ships with an INSTRUMENT for
making them, IN A TAB, THE SAME TURN. THE TEST, before shipping anything he must
rule on: "WHERE DOES HE CHANGE THIS HIMSELF?" If the answer is "he tells me and I
edit a file", it is not shipped.

TAB: DIRECT (after CUTSCENE). Two modes, CUTSCENES and QUESTS -- both things he
named. Over 2 scenes and all 21 canon quests (1,111 directable rows):
  SEE       every beat / line / choice in order, in plain words
  ADD       a line, a person by name (RAY / DENISE / MARCO / NINA / YOU), a
            pause, a time cut, a quest choice
  DELETE    any of them
  MOVE      any of them up or down
  RETARGET  who speaks, who appears, and WHERE A CHOICE LEADS
  RELOCATE  the zone, the room, and which house (seed) the scene stands in
  PLAY      what HE built, right there, not a preview of a plan
  KEEP      saved to his device, survives a reload, EXPORT .TXT
His edits live in localStorage keyed by scene/quest id. NOTHING A LANE SHIPPED IS
OVERWRITTEN -- he can wreck a scene at 2am and the repo does not move until he
exports and a lane lands it.

GATE: direct_gate.js, 33 claims, registered as DIRECT. It does NOT read the
source for the word "delete". It boots the real alpha, taps the tab and PERFORMS
EVERY VERB: adds the father to the grief dinner and asserts he is in the scene,
moves a beat and asserts the order changed, deletes one, retargets a speaker,
walks to another house and asserts THE ROOM ACTUALLY MOVED, presses play and
asserts a line HE added reached the screen while the shipped scene stayed
untouched. An editor that renders but does nothing is exactly the invisible
failure he is angry about, twice.

ALSO FIXED WHILE TESTING: quest rows were offering the FAMILY cast as speakers.
A quest's speakers are roles cast at runtime (the lineman, the fixer), so
offering DENISE for them is nonsense; quest rows show their node instead.

*** NEXT (the GO list, in order):
 1. NO MORE ASKING HIM STRUCTURAL QUESTIONS. The father, the empty chair, who
    survives -- he has the controls now. Watch DIRECT exports, land them as canon.
 2. APPLY THE TEST TO EVERYTHING ELSE THIS LANE OWNS. Anywhere a lane is waiting
    on a ruling, ask "where does he change this himself?" and build that instead
    of asking.
 3. THE DIRECTOR CANNOT YET: add a whole NEW scene from nothing, or rename a
    quest node. Both are small; neither was needed to unblock him tonight.
 4. Quests do not PLAY in the director (they play in the run). Editing + export
    works; playing a quest in the tab is the next honest upgrade.
 5. Not this lane: 60 tools still crash on CITY_B64; his 11 perimeter walls. ***

PEOPLE (7h9sfy): 8/12 (b) -- *** HIS NOTES ON THE COLD OPEN, ALL FIVE,
FIXED. THE TAB IS CALLED CUTSCENE NOW (his word). ***
PEOPLE (7h9sfy): 8/12 (d) -- *** THE CUTSCENE PLUMBING IS A MACHINE NOW,
NOT A DIORAMA. A SECOND SCENE COSTS A JSON FILE AND ZERO NEW CODE. ***
PEOPLE (7h9sfy): 8/12 (f) -- *** THE SECOND CUTSCENE SHIPPED, AND IT COST
ONE JSON FILE. THE GRIEF DINNER IS IN THE CUTSCENE TAB. ***

THE PROOF THE PLUMBING WORKED. Yesterday's pass made the cutscene a machine;
this is the first thing built ON it. No new engine code, no new gate machinery,
nothing hand-placed: the file says `place: {zone residential, role living,
seed 7}` and the stager builds the room, furnishes it, seats whoever the beats
place, times every line off its own text and draws it. One file.

IT IS BEAT 2 OF THE SEQUENCE HE CRYSTALLIZED ON 7/19, and every structural fact
is his: "THE GRIEF DINNER (next day, before the burial): the surviving family
sits down to a real meal and a raw, genuinely sad conversation. People crying at
the table. 'I miss them so much, I can't.' 'I hate this.' Bohemia commits to
grief most games flinch from. This is the family-conversation mechanic's first
and definitive beat."

*** TWO OF THE SIX LINES ARE HIS OWN, VERBATIM, TAGGED draft:false WITH A
SOURCE. The first non-draft words in the game. NO LANE MAY EDIT THEM. *** They
show on screen as YOUR WORDS instead of "draft, edit in WORDS", so he can tell
at a glance which lines are a lane's and which are his.

THE SAME TABLE, FOR FREE. The scene asks for the same seed and role as the cold
open, so the deterministic generator hands back literally the same room -- "THE
TABLE IS THE THROUGHLINE, AND IT STAYS SACRED" (7/19) is now a property of the
plumbing instead of two sets of coordinates somebody has to keep in step.

WHAT IT REFUSES TO DECIDE, AND IT IS THE HARD PART: WHO SURVIVED. It places only
people whose survival is already ruled -- the player, the mother ("it ends
saving the mother", 7/19), and the older sibling (CHARACTER's cast file:
"survives and becomes a co-founder"). *** THE FATHER IS NOT PLACED AND IS NOT
DECLARED DEAD. *** His fate is unruled; if Paolo rules he lives it is ONE actor
beat. And the EMPTY CHAIR motif is NOT built -- it is [PENDING] in his own
addendum. The room has spare chairs because a room keeps its furniture, which is
a fact about seating and not a claim about a casualty.

TWO GATES WERE AMENDED TO THE LAW RATHER THAN THE LAW BENT AROUND THE GATE
(A GATE MUST NEVER OUTRANK A RULING, Paolo 8/1):
 - attempt_gate demanded draft:true on EVERY line, which made it impossible to
   ship a line he wrote himself. Now a line must declare an owner (draft:true =
   a lane's, editable; draft:false = HIS, untouchable) AND every draft:false
   line must name the ruling it was quoted from, so no lane can launder its own
   writing as his.
 - dialogue_catalogue_gate required a catalogue citation on every scene line.
   The corpus exists to hold a LANE'S writing to a standard IN HIS PLACE; his
   own words need no stand-in for his judgement. draft:false lines are exempt
   and carry a source instead.

ALSO: the CUTSCENE tab has a PICKER now (two scenes, and the list is DISCOVERED
off disk by the patch tool, so a third scene reaches him without anybody
remembering to add a button). coldopen_gate is 40 claims and asserts every
authored scene is in that picker -- NAME THE TAB, machine-checked.

*** NEXT (the GO list, in order):
 1. BEAT 3, THE BURIAL ON THE RIDGE, ends the tutorial -- and it is ALSO the
    menu/title screen and the first full valley vista (BotW reveal). That needs
    the ridge and the overlook, which are the CITY lane's. COORDINATE BEFORE
    CROSSING; the scene half is one file once the view exists.
 2. FURNISH KITS. Only 'dining' exists. bed / desk / counter are one row each in
    furnish(), and every scene set somewhere that is not a table stages free.
 3. MORE WORDS. 946 lines in WORDS.
 4. The father's fate is the one thing blocking the grief dinner from being
    final. One word from Paolo.
 5. Not this lane: 60 tools still crash on CITY_B64; his 11 perimeter walls. ***

PEOPLE (7h9sfy): 8/12 (b) -- *** HIS NOTES ON THE COLD OPEN, ALL FIVE,
FIXED. THE TAB IS CALLED CUTSCENE NOW (his word). ***
PEOPLE (7h9sfy): 8/12 (d) -- *** THE CUTSCENE PLUMBING IS A MACHINE NOW,
NOT A DIORAMA. A SECOND SCENE COSTS A JSON FILE AND ZERO NEW CODE. ***

HIS NOTE: "im more concerned of the natural wiring and plumbing of the cutscenes
as well. Like it should be seemless and not need to be so handcrafted everytime
if that makes sense. From location. To it being the actual house. To mfs not
glitching into furniture. To understanding how long voices should play compared
to how long their text shit is."

HE WAS DESCRIBING THE DIFFERENCE BETWEEN A DIORAMA AND A SYSTEM, and v1 was a
diorama: five hand-typed seat coordinates, a hand-typed table rect, and a
`bodyY` per chair found by taking screenshots until nobody looked like they were
standing on the furniture. That makes exactly one scene. NEW: engine/
bohemia_stage.js, and every typed number is gone.

1. LOCATION -> THE ACTUAL HOUSE. A scene names a PLACE
   ({zone:'residential', role:'living', seed:7}) and the room comes out of
   engine/bohemia_floorplan.js -- THE SAME generator the walked world uses, the
   one floorplan_gate proves every room of is reachable. It really hands back a
   10x9 living room with rects, roles and doors. Different role -> different
   room; different seed -> different house; same place -> same house forever.
   The gate checks the room against the generator directly, so "the actual
   house" is a measurement and not a claim.

2. NO GLITCHING INTO FURNITURE. Props declare SOLID CELLS; the seat solver
   refuses a solid cell and refuses a taken one, and somebody with no chair
   STANDS instead of not being drawn (v1 could not express that at all -- the
   fifth person just vanished). Draw order is ONE list sorted by cell depth, so
   a body behind the table is drawn before the table and the table covers it.
   Swept over 120 GENERATED HOUSES across five zones: 600 seatings, ZERO
   collisions, ZERO bodies inside furniture.

3. VOICE vs TEXT, AND THE NUMBERS ARE THE INDUSTRY'S. A line's hold is computed
   from its own text at a published reading speed -- Netflix 20 cps adult with a
   5/6-second floor and a 7-second ceiling, BBC 17 cps, general practice 12-14 --
   at the comfortable end (14 cps) because a phone with animation on it is worse
   for reading than television, then rounded UP to a whole beat (120 BPM LAW).
   The BABBLE is then trimmed on whole words to end inside that window. Both
   halves were wrong before: every line held a hand-typed 1 second while a
   51-letter line babbled for 4.8 seconds straight over the next beat.
   Cold open: 26.5s -> 46s, and nobody timed a single line.

4. THE CAMERA FRAMES THE ACTION, NOT THE FLOORPLAN. One cell->pixel transform;
   props, bodies, shadows and dressing all go through it, so a body lands on a
   chair because the arithmetic says so. First cut fitted the whole room and put
   a four-cell table in the corner with 200px of empty tile under it -- it takes
   a FOCUS (the furniture's bounding box, computed, never typed) and pushes in.

GATE: stage_gate.js, 42 claims, registered as STAGE. Mutation-tested BOTH ways
(fixed-duration lines; an occupancy-blind solver) -- each takes it red.
*** ITS DECIDING CLAIM: a SECOND scene, in a different BUILDING, with a
different cast and seat names the engine has never seen ("chair_by_the_window"),
stages correctly with ZERO NEW CODE. That fixture is deliberately NOT canon: a
second real cutscene needs rulings from Paolo (who is in it, what happens) and
words are the only half of that a lane may write. ***
COLD OPEN gate is 34 now; its "player and nobody else after the cut" claim was
restated properly -- a headcount threshold went red the moment the father was
correctly drawn speaking, so it now forbids the actual thing (a body no beat
asked for) instead of standing in for it.

TAB: CUTSCENE. Tap PLAY THE OPEN.

*** NEXT (the GO list, in order):
 1. A SECOND CUTSCENE IS NOW CHEAP -- one JSON file, no code. It needs his
    ruling on WHO and WHAT, which is why the proof shipped as a fixture. Ask for
    one beat of Act 1 and it stages the same day.
 2. MORE WORDS. 941 lines in the WORDS tab; the demo needs hundreds more and
    nothing blocks writing them.
 3. FURNISH KITS. Only 'dining' exists. A bed/desk/counter kit is a row in
    furnish() and every scene set in a bedroom or a shop then stages for free.
 4. The room still reads grey -- it is the approved interior pool's palette and
    the freeze is on. A warmer domestic wall would need an ART request.
 5. Not this lane: 60 tools still crash on CITY_B64; his 11 perimeter walls. ***

PEOPLE (7h9sfy): 8/12 (b) -- *** HIS NOTES ON THE COLD OPEN, ALL FIVE,
FIXED. THE TAB IS CALLED CUTSCENE NOW (his word). ***

HIS VERDICT ON v1: "Okay that was mad decent... That was fire. The house looked
like some medieval japanese shit there was no squiggle voices it was short
glitchy mfs were standing ontop of table but i appreciated it."
NOTES ARE RULINGS. Five defects, five fixes, in his order:

1. RENAMED. STORY -> CUTSCENE. "change it from story to either cutscene or
   scene or something." Tab, panel, every DOM id and every gate claim follow his
   word; the engine module keeps its filename and says why in its header.

2. "MEDIEVAL JAPANESE SHIT" -- he was right and the cause was one decision:
   orange vertical wood planks on the wall AND the floor. Vertical timber on
   every surface reads shoji. THE REALISTIC ANSWER WAS ALSO THE RIGHT-LOOKING
   ONE: a Las Vegas house is STUCCO AND TILE (pale skim coat, hard tile floors,
   because the Mojave runs 40C+ and nobody carpets a Vegas living room). Plus a
   BASEBOARD, which is the cheapest thing in the file and the one that says
   "somebody's house" instead of "a room in a dungeon", and bigger tiles with
   every other row offset so the wall stops reading as WALLPAPER.
   *** AND I GOT IT WRONG ONCE ON THE WAY: v2 picked its tiles off a thumbnail
   sheet and shipped plaster-peeling-off-brick over mossy cobblestone -- a
   Japanese temple traded for a dungeon. Fixed by rendering ALL 48 walls and ALL
   28 floors at full size and looking. A tile you have not seen full size is a
   tile you have not chosen. ***

3. "NO SQUIGGLE VOICES" -- the engine (engine/bohemia_voice.js, six voices he
   approved 8/11) was already in the build and the cutscene never called it.
   Wired, and CAUGHT AGAIN BY THE GATE ON THE FIRST TRY: my first wiring called
   the alpha's bus() helper, which is declared inside another closure and is NOT
   on window, so it returned on line two and played silent a second time. The
   gate now SPIES ON BOH_VOICE.say AND COUNTS THE CALLS -- 7 for 7 lines. A
   wired feature nobody measured is exactly how this happened twice.

4. "IT WAS SHORT" -- 4 lines / 13.5s -> 7 lines / 26.5s. Three new lines, each
   with its catalogue citations per the 8/11 rule: the father at the table
   ("the water district's hiring again, I'll go down Monday" -- Q001.W1
   TRANSACTION-CARRIES-EMOTION: never open with the sad story, open with the
   errand), the older sibling before the cut so the voice after it is one you
   have already heard (Q043.W4 AMBIENT BANTER), and the father's second half
   after it (Q006.W4 ROLE-ASSIGNMENT AS CHARACTER-KNOWLEDGE, Q007.N3 alibi verb
   still removed). Plus two longer holds.

5. "GLITCHY" -- THE ANIMATION WAS FINE, THE CROP WAS MOVING. Every frame was
   trimmed to ITS OWN painted bounds, so an arm two pixels wider on frame 3 got
   a two-pixel-wider canvas, and since the surface plants a sprite by its own
   width and height the whole person jumped six times a second. Bounds are now
   measured across EVERY frame of a clip and the same box cut from all of them.
   A shared crop is the difference between an animation and a seizure.

6. "STANDING ONTOP OF TABLE" -- their feet were ABOVE the table's top plane.
   Feet now land just below it and the table is drawn over them, so chest and
   head clear it and the rest is behind furniture, which is what sitting is.
   (Overcorrected once and buried them entirely; second pass fixed it.)

TAB: CUTSCENE (fourth along, after WORDS). Tap PLAY THE OPEN.
GATE: coldopen_gate.js, now 33 claims, registered as COLD OPEN. It boots the
real alpha, taps the real tab, presses the real button, reads the real canvas,
counts the voice calls, and re-hashes all 12 tiles against the approved interior
pool -- NO NEW ART is measured, not promised, and the freeze holds.

*** NEXT (the GO list, in order):
 1. MORE WORDS. 941 lines in the WORDS tab now. The rule, the machine and the
    surface all exist; the demo needs hundreds more and nothing blocks writing.
 2. A SECOND CUTSCENE COSTS A JSON FILE AND NOTHING ELSE. The tab, the room, the
    voices and the gate are built. Cheapest story content in the repo.
 3. The player's body from behind is a featureless pale head -- it is HIS
    character so the surface is right to draw it, but a default fit with hair
    would sell it. Small, and it is a CHARACTER-lane call.
 4. The cutscene plays in CUTSCENE but not yet as the walked game's actual
    opening; that touches the RUN surface, which is CITY's. Coordinate first.
 5. Not this lane: 60 tools still crash on CITY_B64; his 11 perimeter walls. ***

PEOPLE (7h9sfy): 8/11 (y) -- *** THE COLD OPEN IS IN A TAB AND IT PLAYS.
STORY tab, in the alpha. Fifteen seconds, one match-cut, four spoken lines,
zero new art. ***

WHAT WAS WRONG. engine/bohemia_scene.js has played the Act 1 cold open
correctly since 8/9 and scene_gate.js proved it beat by beat against the locked
7/19 shape -- 40 green claims, every one HEADLESS, about a scene that appeared
in ZERO slices. Forty greens on something he cannot open is the most expensive
kind of green there is: it reads like the work is done. NAME THE TAB: a thing he
cannot reach does not exist to him.

TAB: STORY (fourth along, after WORDS). Tap PLAY THE OPEN.
 - warm pre-collapse table, five at it, the window lit from outside
 - the mother's line, the child's line about the green ones (and the green ones
   are ON THE TABLE, so the line points at something)
 - ONE CUT. Same room, same framing, same table, same chairs, boarded window,
   flowers gone, a lantern instead. Ten years, no words.
 - the player in the SAME chair, older; the father on his feet; his line
 - hands off to COMBAT's own contract name (cold_open) and says so on screen

NO NEW ART, AND IT IS MEASURED NOT PROMISED. The freeze is on. 11 tiles lifted
byte-identical out of banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt (every tile there
carries a Paolo UP verdict from the Great Sweep) and re-hashed against the bank
by the gate. The PEOPLE are the alpha's own drawChar over his painted rig,
wearing FAMILY_CAST's wardrobe, aged on the CHARACTER lane's 8/11 age axis -- so
the family at the table is the game's family, not a lookalike drawn for a
cutscene. Change a garment in CLOTHES and the table changes.
Every wood floor in the pool has weeds growing through it (outdoor tiles), so
rather than cook a clean one under a freeze the floor is the WALL's plank turned
a quarter and darkened. Same approved pixels, no new one.

*** THE CLAIM THAT PROTECTS HIS RULING: after the cut the surface places the
PLAYER AND NOBODY ELSE. Five actor beats fill the table before; nothing places
anyone after. A surface that helpfully carried the family across the cut would
have decided who survived ten years of collapse, which is his. Chairs belong to
the room, bodies belong to the beats -- so the empty chairs after the cut are a
fact about furniture, not a claim about a casualty, and the [PENDING] EMPTY
CHAIR motif gets its shape without being built. gates/coldopen_gate.js asserts
max cast after the cut <= 1. ***

FILES: tools/bohemia_coldopen_set_bake.py -> engine/bohemia_coldopen_set.js;
engine/bohemia_story_surface.js (the room); tools/bohemia_story_tab_patch.py
(REPLACES a fenced block, never appends -- CHARACTER lane's 8/11 lesson; proved
idempotent by md5). gates/coldopen_gate.js, 32 claims, registered as COLD OPEN.
Proven red-able twice: editing a module without re-patching (byte-identity), and
repainting one tile (NO NEW ART). It boots the real alpha, taps the real tab,
presses the real button and reads the real canvas -- including measuring the
horizon row ink either side of the cut, because identical framing IS the
match-cut and a four-pixel drift turns it into a scene change.

ALSO THIS TURN -- DIALOGUE IS OFF THE APPROVAL QUEUE (his ruling, same day):
laws/BOHEMIA_ADDENDUM_DIALOGUE_REFERS_TO_THE_CATALOGUE_8_11_26.md. READ IT
BEFORE YOU WRITE A LINE. (1) No line of dialogue ever goes to him for approval.
(2) The thumb WAS the quality control, so the CORPUS replaces it: every authored
line cites the questbook findings it was built on, id resolving, title verbatim,
>=2 studies and >=2 masters per scene. (3) "I will edit it later" needs a place:
the WORDS tab, 938 lines, editable, EXPORT .TXT. Gate: DIALOGUE CATALOGUE, 30
claims, with a sha256 source fingerprint so a stale tab goes red.

*** NEXT (the GO list, in order):
 1. MORE WORDS. The rule is written, the machine holds the bar, the surface
    exists. The demo needs hundreds more lines and nothing blocks writing them.
 2. THE SCENE RUNTIME HAS ONE CONSUMER. A second scene (any beat of Act 1) now
    costs a JSON file and nothing else -- the tab, the room and the gate are
    built. Cheapest story content in the repo.
 3. The cold open plays in STORY but NOT yet in the walked RUN. Wiring it as the
    game's actual opening touches the RUN surface, which is the CITY lane's --
    coordinate before crossing.
 4. Not this lane: 60 tools still crash on CITY_B64; his 11 perimeter walls need
    CITY lane wiring. ***

RESTORED EARLIER THIS TURN (it fell out of the handoff in a rewrite and took the
ANSWERED gate red with it -- the handoff is shared infrastructure with no owning
lane, so nobody's lane gate was ever going to catch it):

NEVER ASK HIM A SETTLED QUESTION. A lane once asked what happens to standing
"when the run ends" and he answered "BROTHER FOR BOHEMIA ITS NOT A ONE LIFE RUN
IVE ANSWERED THIS LIKE 50 TIMESS!!!!!" THE QUESTION IS WITHDRAWN AND STAYS
WITHDRAWN: Bohemia is a DYNASTY, not a one-life run -- three generations
(Animal/Human/Angel) across ~100 years, dynasty saves spanning all three, heirs
inheriting the choice log, companions do not die. It was settled in five law
files before he had to say it again, so standing CARRIES; the only open part is
HOW an heir inherits it, and that is a lane's design work, never a question for
him. THE MACHINE THAT STOPS IT: records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md
(59 settled questions, each with the ruling that settles it) enforced by
gates/answered_gate.py -- read the index BEFORE you put anything on a JUDGE
THIS list.

FOOTNOTE FROM RUN 8/11, because nobody else has written it down: THIS FILE WAS
TRUNCATED FROM 13,558 LINES TO 97 in commit 0d4f3f4, and every commit since has been
regrowing it from that stump. That is what took the answered-questions record above
over the side, and ANSWERED went red on main until it came back. Not second-guessing
the prune -- a 13,558-line handoff needed cutting and CLAUDE.md says piles rot -- but
this file is shared infrastructure with no owning lane, which is exactly why a prune
here can drop another lane's LOCKED law and nothing notices.

RESTORED BY RUN 8/11: the PEOPLE section below carries a LOCKED fleet-wide law and
was dropped from this file somewhere in main's last 26 commits (the law FILE survives,
laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md, but the banner every session
reads first did not). Putting it back: a resolution that deletes another lane is not a
resolution.

PEOPLE (7h9sfy): 8/11 *** NEW LAW, EVERY LANE READ THIS: ALWAYS MAKE AN ATTEMPT. ***
Paolo 8/11, LOCKED: "BRO FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH
BRO I WILL EDIT IT LIVE THATS WHY I HAVENT DONE QUESTS YET JUST MAKE AN ATTEMPT MAKE
THIS A RULE"
Law: laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md | Gate: attempt_gate.js
CLAUDE.md AMENDED (a contradiction between two live files is a bug, and this one was
costing him quests).

PEOPLE (7h9sfy): 8/11 (w) -- *** DIALOGUE IS OFF THE APPROVAL QUEUE.
"I DONT HAVE TIME TO APPROVE THE DIALOGUE THIS SLOW LIKE THIS I WILL EDIT IT
LATER JUST DIALOGUE ALWAYS REFER TO THE BEST QUESTS EVER CATALOGUE." READ
laws/BOHEMIA_ADDENDUM_DIALOGUE_REFERS_TO_THE_CATALOGUE_8_11_26.md BEFORE YOU
WRITE A LINE. ***

WHAT TRIGGERED IT: this lane made the attempt (the 8/11 morning rule) and then
ended the turn asking him to approve four lines of family dialogue. That
reinstated the exact bottleneck the morning's rule killed, and it also broke
EVERYTHING IS A THUMB (8/9), which already banned it. He is not asking for a
shorter queue. He removed dialogue from the queue.

THE RULE, THREE PARTS:
 1. NO line of dialogue ever goes to him for approval. Not a JUDGE THIS row,
    not an A/B, not a bolded question. It ships written and playable.
 2. THE THUMB WAS THE QUALITY CONTROL, so the CORPUS replaces it. questbook/
    is 152 of the best-written quests ever shipped, 3,672 citable findings.
    Every authored line now CITES the findings it was built on, in the QUEST
    STUDY vocabulary: `@STUDY Q013.W7  TITLE VERBATIM` + an `applied:` line.
    Id must resolve, title must be verbatim, a scene spans >=2 studies and
    >=2 masters. REUSE-FIRST, for words. "READ THE QUEST SHIT AND GET
    INSPIRED" is a precondition of writing a line now, and it is checkable.
 3. "I WILL EDIT IT LATER" NEEDS A PLACE FOR LATER. He does not dig in files,
    so a line in records/*.json is a line he cannot edit and the rule would
    rot into "Claude writes the dialogue", which is NOT what he said.

SHIPPED THIS TURN:
- THE WORDS TAB (alpha, third tab, after LOOK). 938 lines: 377 spoken, 394
  player replies, 128 journal, 39 objectives, across 21 quests + the cold open.
  Editable in place, saves to localStorage, survives reload, search, SUN mode,
  EXPORT .TXT (was/now per line). The catalogue law each line came from sits
  under it. Verified in Chromium at 390x844 inside the alpha: tab loads, 938
  boxes, 0 console errors, an edit survived a reload.
- tools/bohemia_words_book.py -- harvests EVERY dialogue-bearing artifact
  (DISCOVERED, not a hardcoded list) and BAKES the tab. Payload is INLINED, not
  fetched: _config.yml publishes slices/ only, so a records/ fetch would 404
  live and work perfectly on disk (the 8/6 bug). Re-run it after ANY dialogue
  edit or the gate goes red.
- gates/dialogue_catalogue_gate.js -- 30 claims, registered as DIALOGUE
  CATALOGUE. Proven red-able: staleness (3 claims), invented id, wrong title.
  Notable claim: a sha256 SOURCE FINGERPRINT over the exact bytes the tab was
  baked from, recomputed in JS off the same files. A stale tab is the same
  failure as no tab, wearing a green.
- The cold open's four family lines now carry per-line citations: Q013.W7 THE
  BLINDSIDE + Q138.X8 (mother), Q063.W2 + Q010.W8 + Q138.X8 (the lost sibling),
  Q009.W2 + Q068.X3 + Q010.W9 (after the cut), Q007.N3 REMOVE THE ALIBI VERB +
  Q039.W3 DREAD-NOT-JUMPSCARES + Q033.P8 (the father). Nine studies, all four
  masters.

*** NEXT (the GO list, in order):
 1. THE COLD OPEN IS NOT IN A TAB YET. engine/bohemia_scene.js + the scene JSON
    are complete and gated (SCENE, 40 claims) but appear in ZERO slices, so the
    demo's first fifteen seconds and all four family lines cannot be played.
    That is this lane's #1 demo blocker. It needs a surface INSIDE the alpha
    (ONE-LINK LAW: never its own link) and it must not cook new art while the
    freeze holds -- so it plays on what already exists, or it waits.
 2. MORE WORDS. The rule is written and the machine holds the bar; the demo
    needs hundreds more lines and nothing blocks writing them now.
 3. Not this lane: 60 tools still crash on CITY_B64; his 11 perimeter walls
    need CITY lane wiring. ***

RESTORED THIS TURN (it fell out of the handoff in a rewrite and took the
ANSWERED gate red with it -- the handoff is shared infrastructure with no
owning lane, so nobody's lane gate was ever going to catch it):

NEVER ASK HIM A SETTLED QUESTION. A lane once asked what happens to standing
"when the run ends" and he answered "BROTHER FOR BOHEMIA ITS NOT A ONE LIFE RUN
IVE ANSWERED THIS LIKE 50 TIMESS!!!!!" THE QUESTION IS WITHDRAWN AND STAYS
WITHDRAWN: Bohemia is a DYNASTY, not a one-life run -- three generations
(Animal/Human/Angel) across ~100 years, dynasty saves spanning all three, heirs
inheriting the choice log, companions do not die. It was settled in five law
files before he had to say it again, so standing CARRIES; the only open part is
HOW an heir inherits it, and that is a lane's design work, never a question for
him. THE MACHINE THAT STOPS IT: records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md
(59 settled questions, each with the ruling that settles it) enforced by
gates/answered_gate.py -- read the index BEFORE you put anything on a JUDGE
THIS list.

FOOTNOTE FROM RUN 8/11, because nobody else has written it down: THIS FILE WAS
TRUNCATED FROM 13,558 LINES TO 97 in commit 0d4f3f4, and every commit since has been
regrowing it from that stump. That is what took the answered-questions record above
over the side, and ANSWERED went red on main until it came back. Not second-guessing
the prune -- a 13,558-line handoff needed cutting and CLAUDE.md says piles rot -- but
this file is shared infrastructure with no owning lane, which is exactly why a prune
here can drop another lane's LOCKED law and nothing notices.

RESTORED BY RUN 8/11: the PEOPLE section below carries a LOCKED fleet-wide law and
was dropped from this file somewhere in main's last 26 commits (the law FILE survives,
laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md, but the banner every session
reads first did not). Putting it back: a resolution that deletes another lane is not a
resolution.

PEOPLE (7h9sfy): 8/11 *** NEW LAW, EVERY LANE READ THIS: ALWAYS MAKE AN ATTEMPT. ***
Paolo 8/11, LOCKED: "BRO FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH
BRO I WILL EDIT IT LIVE THATS WHY I HAVENT DONE QUESTS YET JUST MAKE AN ATTEMPT MAKE
THIS A RULE"
Law: laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md | Gate: attempt_gate.js
CLAUDE.md AMENDED (a contradiction between two live files is a bug, and this one was
costing him quests).

PEOPLE (7h9sfy): 8/11 *** NEW LAW, EVERY LANE READ THIS: ALWAYS MAKE AN ATTEMPT. ***
Paolo 8/11, LOCKED: "BRO FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH
BRO I WILL EDIT IT LIVE THATS WHY I HAVENT DONE QUESTS YET JUST MAKE AN ATTEMPT MAKE
THIS A RULE"
Law: laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md | Gate: attempt_gate.js
CLAUDE.md AMENDED (a contradiction between two live files is a bug, and this one was
costing him quests).

*** WE WERE PROTECTING HIM FROM THE WRONG THING. *** CONTENTS-PAOLO'S was read fleet-wide
as "ship no words at all" and every lane obeyed: LINES empty, NAMED_CAST empty, the cold
open's say beats SILENT, and this lane wrote a gate on 8/9 that went RED if anybody put a
word in his family's mouth. HIS OWN DIAGNOSIS: "THATS WHY I HAVENT DONE QUESTS YET."
AN EMPTY FIELD IS NOT A RESPECTFUL BLANK CANVAS. IT IS A BLANK PAGE, AND HE DOES NOT
WRITE FROM NOTHING - HE EDITS. Handing him nothing to edit stopped the work.

THE LINE, DRAWN EXACTLY - this is what makes the rule safe:
   WORDS get an attempt, always, written AS IF IT SHIPS: dialogue, quest text,
     objectives, descriptions, item/place names, UI copy, character names.
   DECISIONS still wait for him and are UNCHANGED: who dies, who lives, which faction
     holds which ground, numbers, dials, rates, prices, map layouts.
   THE TEST: is it WORDS or is it a DECISION? "Up. Now. Don't turn the light on." for
     the father is an attempt at words. Deciding the father dies is not.
EVERY attempt is tagged `draft:true` so he can list every word he has not approved;
absent/false means the words are HIS and no lane may touch them. FILLER FAILS - "good
estimates" is the ask, and a lazy draft makes him rewrite from scratch, which is the
blank page all over again.

APPLIED THE SAME TURN. The Act 1 cold open now SPEAKS, four lines, all draft:true:
   mother        "Sit down, both of you. It's getting cold."
   sibling_lost  "I'm not eating the green ones."
   sibling_older "Same chair. Ten years and you still take the same chair."
   father        "Up. Now. Don't turn the light on."
The two before the cut are deliberately the most ordinary sentences in the world - the
cut has to take something SMALL and real, not a speech. The line after the cut makes you
look at the table again and names the empty seat without naming it.

AND I INVERTED MY OWN GATE, NOT DELETED IT. scene_gate's 8/9 claim failed if any text
appeared; it now fails if a line is SILENT. A GATE MUST NEVER OUTRANK A RULING (8/1) - a
gate written two days ago does not outlive the ruling that replaced it. SCENE 35 -> 40.
FOURTH MENTION-VS-USE BUG THIS SESSION, caught in my own new gate: the "no casualty
decided here" check grepped the whole beat for /dies|death/ and went red on the `why`
fields, which QUOTE his addendum. It flagged the CITATION of a ruling as a violation of
it. Now it checks the DATA (does a beat carry a death field), never the prose.

FOR EVERY LANE: if your system ships empty text, FILL IT with a real attempt and tag it
draft:true. LINES, NAMED_CAST, quest text, UI copy - all of it. He is waiting to edit.

-----------------------------------------------------------------------------------
PEOPLE (7h9sfy): 8/9 — *** DEMO-CRITICAL, HE ASKED FOR IT BY NAME: THE SCRIPTED-SCENE
RUNTIME (backlog 0sc) SHIPS, AND THE ACT 1 COLD OPEN PLAYS END TO END. ***
Paolo 8/9: "the scripted-scene runtime whose first consumer is the Act 1 cold open
(family defense, the locked 7/19 shape), and dialogue playing clean through the one
contextual verb so the family can speak."

BUILT: engine/bohemia_scene.js + records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json
GATE:  gates/scene_gate.js, 32 claims, FOUR MUTATIONS KILLED, registered.

THE FIRST CONSUMER IS THE MATCH-CUT, and that was a deliberate choice: his 7/19 ruling
says the cut "shows the entire apocalypse WITHOUT A WORD", so the runtime's first job
needs ZERO dialogue this lane would have to invent. Warm pre-collapse family table ->
identical framing -> ONE CUT across ten years -> the same table dingy, you 20-something
-> fireworks (the 10-year 4th of July) -> the father wakes you -> handoff to the
family-defense tutorial -> control returns. 15 beats, 27 steps, 13.5s at 120 BPM,
deterministic.

*** THE WORDS ARE HIS AND THE GATE ENFORCES IT. *** Every say beat in the cold open is
SILENT ON PURPOSE (LINES ships empty; a silent say beat is what an unwritten line looks
like). The gate FAILS if any text appears in one - mutation-tested by putting a line in
the father's mouth, and it went red. It also FAILS if a scene cites no ruling, and every
beat carries a `why` quoting the addendum line it came from.

DIALOGUE PLAYS CLEAN THROUGH THE EXISTING RUNTIME (REUSE-FIRST, no second dialogue
system - that duplication cost this repo twice in one week). Proved on a REAL .bq
(S02): speaker red_boss, "Batteries. Real ones, charged, not the swollen junk...",
three options INCLUDING A SILENCE, and choosing advances to the next node.
*** THE BUG THAT WOULD HAVE HIDDEN FOREVER: *** opening a conversation is THREE calls
(start -> available -> begin). v1 made one, so view() answered {ended:true, says:[]} and
the beat played SILENT - which looks EXACTLY like a line he has not written yet. It
would have hidden behind the empty-lines-are-legal rule indefinitely. The gate now opens
a real .bq and asserts WORDS COME OUT.
AND THE GATE CRASHED ON ITS OWN MUTATION TEST before it failed cleanly (p.dialogue was
null and .choose() threw). A CRASH ASSERTS NOTHING - the same lesson DEVIATION taught
this lane on 8/4. Guarded; it now reports "NO CONVERSATION WAS OPEN".

*** AND THE TWO HALVES DID NOT MEET UNTIL I CHECKED. *** COMBAT shipped the family-defence
FIGHT the same day this lane shipped the SCENE that hands off to it - complementary by the
demo plan's own routing (item 10), no collision. BUT my handoff beat said `family_defense`
and COMBAT named it `cold_open` (tools/bohemia_alpha_cold_open_patch.py exposes
startColdOpen(onEnd), encounterId 'cold_open'). THE PIECES WOULD HAVE PASSED IN THE NIGHT.
TWO LANES BUILDING HALVES THAT NEVER CONNECT IS THIS REPO'S MOST EXPENSIVE RECURRING BUG,
and a name agreed by eye is not agreed - so scene_gate now READS COMBAT'S CONTRACT and
fails if the two names drift apart (mutation-tested). SCENE GATE 32 -> 35 claims.
COMBAT kept his contents empty too, independently: "the opening of his game is the most
seductive place to write his lore for him, so this writes none of it." Same discipline,
two lanes, no coordination needed.

STILL NOT ON THE WALKED SURFACE. The runtime is engine-side and gate-proved; inlining it
into slices/BOHEMIA_CITY_WORLD.html (the surface RUN shows) is the next step, following
the bohemia_city_people_patch.py precedent this lane already owns.

=== DEMO BLOCKERS, MEASURED 8/9 (not copied from the plan) ===
 1. the day loop stops at "pick up a quest" - wake and walk work, nothing after   (RUN)
 2. dialogue does not exist on the surface RUN shows; it plays only in the invisible file
 3. no scripted-scene runtime existed anywhere -> FIXED THIS TURN (engine-side)
 4. no way into combat from the walked world - the family-defense tutorial has no handoff
 5. no currency on the walked world, so nothing can pay you   (needs his economy ruling)
 6. sleep does not end the day, so "sleep-save holds" cannot be demoed   (RUN)
 7. his 11 approved perimeter walls are not in the walked world   (CITY, one step, proven)
 8. no squiggle voices anywhere - every line lands silent, which he ruled reads dead
 9. the family cast (father/mother/brother/sister) does not exist as bodies  (CHARACTER)
10. the vista/overlook moment is not built   (RUN + CITY)
11. 28 finished things still ship only to the file nobody sees   (fleet)

-----------------------------------------------------------------------------------
PEOPLE (7h9sfy): 8/9 — *** PAOLO PICKED A AND B. *** A = wire the already-finished work
into what he plays. B = the day loop (needs two rulings from him; first one is asked).
Record: records/BOHEMIA_HIS_APPROVED_WALLS_ARE_NOT_IN_THE_WORLD_HE_WALKS_8_9_26.md

*** CITY LANE, THIS ONE IS YOURS AND IT IS ONE STEP. *** His ELEVEN APPROVED PERIMETER
WALLS (banks/BOHEMIA_PERIMETER_8_2_26.txt, 330 tiles, judged 8/2 - all thirteen of his
own 7/14 walls thumbed DOWN, eleven of eighteen cooked ones UP) are NOT in the world he
walks. Sampling 24 tile payloads by BYTES:
    BOHEMIA_RUN_CURRENT.html   (loaded, NEVER displayed)   21/24
    BOHEMIA_CITY_WORLD.html    (the walked world)           0/24
    BOHEMIA_CITY_TILES.js      (its 28.4 MB art bank)       0/24
MEASURED TWICE ON PURPOSE: the first pass tested only CITY_WORLD.html, and hours earlier
that file's art was moved out to CITY_TILES.js. A test that missed the art file would
have been the exact WRONG DOOR bug we have paid for all week. Re-run including it, the
answer is unchanged. The only perimeter-pool mentions in the walked world are two
COMMENTS citing the July pool his 8/2 verdict superseded. Nothing loads it.
THE PRECEDENT IS WORKING CODE: tools/build_run_slice.js line 85 `var PERIM_COOK =
'banks/BOHEMIA_PERIMETER_8_2_26.txt'` inlines it, draws it, and perimeter_gate.py keeps
the killed bytes out. The walked world needs the same three things (tiles reachable, the
wall draw pointed at them with face/base variants shuffled PER CELL - one tile per design
stamped the same crack everywhere at 44px, which is what he meant by "looks like it's
glitching out" - and a gate on the seven he killed).
WHY I DID NOT DO IT: CITY_TILES.js was extracted HOURS ago and that lane is mid-swarm in
it right now (seven TILEFORM commits in the last hour, 525 candidate tiles). Two sessions
built the same city resolver on 8/4 and the same dead-body system on 8/8. Making it a
one-step job beats a rushed edit that costs them a rebase.

=== B: THE FIRST RULING IS ASKED (quest placement) ===
Researched against how work is ACTUALLY found in a collapsed economy, not RPG habit:
informal hiring sites form at fixed, predictable, high-traffic spots - outside hardware
stores and gas stations, along thoroughfares, at freeway on-ramps, in parks and parking
lots - wages are negotiated at the spot, and employers DRIVE THROUGH AND PICK PEOPLE UP.
Worker centres/hiring halls then form near the informal corners. Every one of those
places already exists in this valley, and the drivable network is already built.
Options put to him: A THE CORNER (places, realistic, leads) / B THE PERSON (word of
mouth, plugs into the name+memory system already built) / C BOTH, corners first because
you start as nobody. AWAITING HIS LETTER.

-----------------------------------------------------------------------------------
PEOPLE (7h9sfy): 8/7 — *** I SWEPT THE PATTERN INSTEAD OF THE INSTANCES AND FOUND NINE
MORE. *** gates/mapbound_gate.js now finds the next one automatically.

Four separate hunts today found "a check that agrees with itself" ONE AT A TIME - which
is the exact habit I criticised this morning before building the census. So I grepped the
whole repo for the SHAPE (a scan loop with a typed map size) instead of the symptom.

*** people_gate had TEN loops bounded at 48, NOT ONE. *** G6 was just the one that
happened to be checkable. The others fed:
    K1 "EVERY body has a seat to be keyed by"        <- UNIVERSAL, on 25% of the world
    K2 "the biggest household in the valley"          <- a superlative over a quarter
    E7 "it never MOVES anybody"                       <- a safety property on a quarter
    D4 / J1 / I3 / K3  "somewhere in the valley..."   <- existential, SAFE under-scanned
THE DISTINCTION MATTERS: an existential claim survives under-scanning (finding it in a
quarter still proves it exists). A UNIVERSAL one does not - "EVERY body" tested on 25%
means a violation in the other 75% PASSES SILENTLY.
Widened to world.n: 678 residential cells instead of 162, 1,224 bodies instead of 268,
AND ALL 152 CLAIMS STILL PASS. The code was right; the tests were short-sighted.
*** AND THE NUMBER 268, quoted all over this repo as "our 268 derived people", WAS ITSELF
AN ARTEFACT OF THAT BOUND. ***

GATE: gates/mapbound_gate.js, 8 claims, mutation-tested. A RATCHET, NOT A PURGE - 26
typed map bounds survive in NINE files across the fleet (graphics master, graphics tests,
overmap, exterior pool, mass edit, city people, rail, rooms, world). They are correct
TODAY only because 96 happens to be the map size, and they are other lanes' files;
dumping red on them is what this repo spent a week learning not to do. So they are
DECLARED with a date, MAY ONLY SHRINK, and any NEW one fails at once. It strips comments
before counting, because its own header quotes `y < 48` four times and A CHECKER THAT
CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE.

FOR EVERY LANE: if your gate scans the valley, bound it with world.n. Yours may be one of
the twenty-six.

-----------------------------------------------------------------------------------
PEOPLE (7h9sfy): 8/7 — *** AND HERE IS WHY IT SURVIVED: THE CROSS-CHECK HAD THE SAME
BUG. *** Read this one even if you skip the rest; it is worth more than the number.

There WAS a gate on the valley population. people_gate G6 - "THE SIM HOLDS WHAT THE
ARITHMETIC SAYS" - counts the live sim and compares it to the derived figure, and its
own comment says it exists to go red "if somebody edits the occupancy rate back to a
round guess". It counted the sim like this:
      for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++)
THE IDENTICAL HARDCODED 48 THAT THE TOOL HAD. The sim side measured a quarter of the
world, the model side measured a quarter of the world, and THE TWO AGREED PERFECTLY
while both were wrong by 4.25x. G6 reported "0% off" for weeks.

*** A CROSS-CHECK WHOSE TWO SIDES SHARE AN ERROR IS NOT A CROSS-CHECK. IT IS ONE
MEASUREMENT WRITTEN TWICE, AND IT WILL AGREE WITH ITSELF FOREVER. ***

Both sides read world.n now. Four more claims in that block were pinned to the 48x48
world (area 21.23 km2, homes 10-15k, no-apocalypse 20-80k, valley 600-2,000 people) and
passed only because the tool under-measured to match; re-pinned to the measured world
with the reason recorded at each. gates/scale_truth_gate.js is immune BY CONSTRUCTION -
its exhaustive census walks w.n and cannot inherit a stale bound from anywhere.

I ALSO BROKE TWO GATES AND FIXED THEM: correcting the engine comment made the committed
run slice stale (INTEGRATION's agents_module probe + THE RUN). Rebuilt; INTEGRATION
112/0, RUN 126/0. The reachability census re-ran against the new slice: the
work-already-paid-for list is 28 now.

-----------------------------------------------------------------------------------
PEOPLE (7h9sfy): 8/6 LATEST — *** THE VALLEY HOLDS 4x THE PEOPLE WE THOUGHT. A NUMBER
THE WHOLE GAME RESTS ON WAS WRONG BY 4.25x, INSIDE THE TOOL BUILT TO STOP THAT. ***
Record: records/BOHEMIA_THE_VALLEY_HOLDS_FOUR_TIMES_THE_PEOPLE_WE_THOUGHT_8_6_26.md

tools/bohemia_scale_model.js keeps one figure honest - how many people are alive in the
valley - and its own header promises the answer "can never drift away from the world it
describes". It then measured the world with:
      for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++)
      const side = 48 * 96;
THE VALLEY BECAME 96x96 AND THE TOOL KEPT MEASURING A QUARTER OF IT - silently, because a
small loop over a big world does not error, IT UNDER-COUNTS.

                      the tool said        the world holds
    homes             12,259               55,391
    area              21.2 km2             84.9 km2
    scale by housing  1 : 78.2             1 : 17.3
    scale by area     1 : 65.9             1 : 16.5
    PEOPLE            1,112                ~5,027 derived / 4,723 MEASURED

*** IT IS A FIX AND NOT A SECOND MISTAKE, and the model's own sanity check proves it:
its two independent measures (homes, area) used to agree within 16% and now agree within
5%. The correction makes the model TIGHTER. An exact census of all 2,809 residential
cells returns 4,723 against the derived 5,027 - 6% apart, where before they were 4.25x
apart and nobody knew. ***

*** WHAT DID NOT CHANGE, AND IT IS THE IMPORTANT PART: OCCUPIED_RATE = 0.038 WAS RIGHT
THE WHOLE TIME. *** The world produces 3.91% occupancy measured against 4.1% derived.
NOTHING ABOUT THE WORLD CHANGED - only what we believed about it. No district got emptier
or fuller, no save is invalid, no ruling of Paolo's is overturned. The people were always
there; the document describing them was counting a map that no longer existed. That is
why this needs no decision from him.

IT HAD SPREAD TO TEN FILES. 1,113 was cited in two engine modules, a gate, this lane's
block fixture, two research records, the handoff and the backlog. A NUMBER IN A COMMENT
IS DOCUMENTATION RIGHT UP UNTIL SOMEBODY BUILDS AN ECONOMY ON IT - and the economy is BIG
MISSING item 3, unbuilt, and would have been sized against it. Live code corrected
(bohemia_agents.js, bohemia_population.js, bohemia_block_fixture.js); dated records left
as history, which is what records are for.

GATE: gates/scale_truth_gate.js, 8 claims, 3 mutations killed. THE LOAD-BEARING CLAIM IS
NOT A TEXT CHECK: the sampled estimate and AN EXACT CENSUS OF EVERY RESIDENTIAL CELL must
agree. Two ways of counting the same thing, one cheap and one exhaustive - A MAP-SIZE BUG
CANNOT SURVIVE BOTH, because it corrupts one and not the other. That claim would have
failed the moment the valley outgrew 48x48, many sessions before anybody noticed by hand.
A TOOL THAT PROMISES IT CANNOT DRIFT IS A CLAIM, AND A CLAIM WITHOUT A MACHINE BEHIND IT
IS A WISH.

-----------------------------------------------------------------------------------
PEOPLE (7h9sfy): 8/6 LATEST — *** SOMEBODY FINALLY TRIED TO PLAY A DAY. YOU CAN WAKE UP
AND YOU CAN WALK. THAT IS THE GAME TODAY. *** THE BIG MISSING item 1, ATTEMPTED instead
of guessed. Record: records/BOHEMIA_HOW_FAR_THE_GAME_GETS_IN_ONE_DAY_8_6_26.md
Re-run any time: node tools/bohemia_game_day_probe.js

Item 1 says "the circulatory system between the organs is the game, and it has never once
circulated", and it names two blockers - quest placement [PENDING] and economy payout.
*** THOSE WERE GUESSED ON 7/29 AND NOBODY HAD EVER ATTEMPTED THE DAY. *** Measured now,
on the surface the RUN tab really opens:

  1  WAKE AT BASE     OK        mode=human, placed at 6205,6271, clock 08:00
  2  PICK UP A QUEST  BLOCKED   <- THE FIRST THING THAT STOPS THE DAY. No quest symbol
                                   of any kind; the only button on screen is TALK
  3  TRAVEL           OK        the d-pad really walks him
  4  RESOLVE - talk   PARTIAL   4 people reachable, none adjacent where he wakes
  4b RESOLVE - fight  BLOCKED   no combat entry point at all
  5  GET PAID         BLOCKED   no currency of any kind exists here
  6  SPEND            BLOCKED   nothing to spend
  7  SLEEP, SAVE      PARTIAL   saving works; SLEEP DOES NOT END THE DAY
                                OK 2 | PARTIAL 2 | BLOCKED 4

THE 7/29 GUESS WAS HALF RIGHT AND MISSED TWO THINGS: it named quests and economy (both
confirmed) and did NOT know combat has no entry point here, or that sleep never advances
you to tomorrow.

*** AND IT IS THE SAME FINDING AS TODAY'S CENSUS, FROM THE OTHER END. *** BLOCKED means
NOT REACHABLE ON THE SURFACE RUN OPENS - it does NOT mean unbuilt. bohemia_resolve.js
(the one-button verb system), the quest runtime and parser, and the combat bridge are all
FINISHED and shipping into BOHEMIA_RUN_CURRENT.html, the file the alpha loads and never
displays. THE ORGANS ARE BUILT. THEY ARE IN THE OTHER FILE. Two instruments, opposite
directions, same conclusion.

THE INSTRUMENT LIED TO ME THREE TIMES FIRST, and that is the more useful half. v1 scanned
window for words and reported "nothing - it circulates": /quest/ matched XMLHttpRequest,
/dial/ matched SVGRadialGradientElement, /scrip/ matched TrustedScript, /cap/ matched
escape. I WROTE A MENTION-VS-USE BUG INTO A PROBE ABOUT THAT EXACT DISEASE, an hour after
gating it. v2 subtracted a blank PAGE's globals - wrong, the game is in an IFRAME. v3 used
a blank iframe - still wrong. v4 stopped discovering by name and asked for the SPECIFIC
symbols a player's verbs use. *** THREE ROUNDS OF TUNING A WORD SEARCH COULD NOT FIX A
WORD SEARCH. The fix was a different instrument, not a better regex. ***

FOR WHOEVER TAKES ITEM 1 - a MEASURED, ORDERED blocker list instead of a guessed one:
  1. a quest you can pick up   2. sleep that ends the day
  3. a currency to be paid in  4. a way into combat
GATE: gates/game_day_gate.js, 12 claims, mutation-tested. A RATCHET, NOT A DEMAND -
closing the links is the RUN lane's charter and blocked on Paolo's rulings, so forcing it
would be A GATE OUTRANKING A RULING. But WAKING AND WALKING ARE THE ENTIRE GAME RIGHT NOW
and must never break quietly.
PEOPLE (7h9sfy): 8/6 LATEST — *** SEVENTEEN FINISHED THINGS SHIP TO A FILE NO PLAYER
CAN SEE, INCLUDING PAOLO'S OWN APPROVED WALLS AND THE ONE-BUTTON VERB SYSTEM. ***
Record: records/BOHEMIA_WHAT_WE_BUILT_THAT_HE_CANNOT_REACH_8_6_26.md
Census: records/BOHEMIA_REACHABILITY_CENSUS.md  (re-run: python3 tools/bohemia_reachability_census.py)

SIX TIMES IN THREE DAYS this fleet found the same thing one instance at a time - the
signal bank reaching nothing for two weeks, the identity card on a page he never sees,
nineteen gates hunting a moved constant, touch_guard GREEN while checking nothing, five
hairstyles nobody could wear, my own walk fix landing on the invisible file. THAT IS NOT
SIX BUGS. It is ONE DISEASE: work lands somewhere he cannot reach and the machine says
green. Nothing could answer the general question, so nobody asked it. Now something can.

                    reaches him | loaded only | no trace | not-for-players
    banks    (95)            15 |           8 |       72 | -
    engine  (110)            72 |           9 |       14 | 15

*** THE BUCKET THAT MATTERS: 17 FINISHED THINGS THAT REACH ONLY
    slices/BOHEMIA_RUN_CURRENT.html, WHICH THE ALPHA LOADS AND NEVER DISPLAYS ***
    banks/BOHEMIA_PERIMETER_8_2_26.txt      the 11 walls PAOLO JUDGED AND APPROVED 8/2
    banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt 3.63 MB of interior dressing
    engine/bohemia_resolve.js               THE SENTENCE - one button, act, spend, resolve
    engine/bohemia_quest_runtime.js + _bq   the quest runtime and parser
    engine/bohemia_loop.js                  the driven engine
    engine/bohemia_garage.js, _crypt.js     interiors
    banks/GRIME_8_3, OPENINGS_8_2, CIVIC_OPENINGS_8_3   approved art from the last 4 days
*** THE NUMBER MOVES: it was 17 when written and 28 after merging the same
day's other lanes. Nobody did anything wrong - new finished work keeps landing in the
invisible file because NOTHING WAS WATCHING. Re-run the census for the live count. ***
THIS IS NOT A FAILURE LIST, IT IS A WORK-ALREADY-PAID-FOR LIST, and at the start of an
11-month run that is the most valuable list there is.

WHAT THE NUMBERS DO NOT SAY, because a census that overclaims is worse than none:
NO TRACE is strong evidence, NOT PROOF - a bank TRANSFORMED before shipping (re-encoded,
recoloured, re-tiled) reads as NO TRACE while genuinely reaching him, and the four
HD_TILE_REPO parts (180 MB, two thirds of the corpus) are almost certainly that. 20 of
the 72 are CANDIDATE/VERDICT/JUDGE pools where only an approved subset should ever ship.
A DERIVED bank reads NO TRACE correctly too (WARDROBE_CANON is extracted FROM the alpha).
And THE MB FIGURE IS NEARLY A TAUTOLOGY - 258 MB of corpus cannot fit in a 29 MB surface.
THE COUNTS ARE THE FINDING; THE MEGABYTES ARE NOT.

CALIBRATED BEFORE IT WAS BELIEVED. v1 sampled 8 payloads and printed a BINARY, and the
door-anim bank came out SHOWN on one run and NO TRACE on another OFF THE SAME BYTES - a
coin flip wearing a claim's name, the exact bug that had four of this lane's gates dead
for a fortnight. Now 32 samples AND IT REPORTS THE FRACTION, because "2 of 32", "0 of 32"
and "32 of 32" are three different facts. Then checked against four things verified BY
HAND on 8/4 before the tool existed - all four agree, and the gate keeps them as
permanent CALIBRATION claims: if the census ever disagrees with a hand check, THE CENSUS
IS BROKEN, not the hand check.

THE GATE DOES NOT DEMAND THE NUMBER FALL. Wiring order is Paolo's and the owning lane's
call; a gate forcing it would be A GATE OUTRANKING A RULING. It demands the number stay
TRUE: fresh, caveat intact, no ghosts, agrees with the hand checks. 16 claims, 4
mutations killed.

-----------------------------------------------------------------------------------
PEOPLE (7h9sfy): 8/6 LATEST — *** THE SAVE COULD BE DELETED BY THE PHONE AFTER SEVEN
DAYS AND NOTHING WAS ASKING IT NOT TO. FIXED. *** THE BIG MISSING item 7, filed 7/29,
never acted on, owned by nobody.
Record: records/BOHEMIA_A_SAVE_THAT_SURVIVES_A_WEEK_OFF_8_6_26.md

RESEARCHED 8/6 because the 7/29 note was a summary and this policy moves:
  * REAL AND CURRENT. Since iOS 13.4 / Safari 13.1 WebKit DELETES localStorage,
    IndexedDB, SessionStorage AND SERVICE WORKER REGISTRATIONS after SEVEN DAYS with no
    interaction with the origin. The counter resets every visit, so IT ONLY BITES THE
    PLAYER WHO STOPS PLAYING - exactly the player you want back.
  * ONE-CALL FIX WE HAD NEVER MADE. Eviction SKIPS origins granted persistence via
    navigator.storage.persist(). Supported since Safari 17 / iOS 17.
  * HOME-SCREEN WEB APPS get their own counter tied to real app use. Safer, but NOT a
    substitute - installing is the player's choice, not ours, and most never do.

MEASURED ON THE REAL SURFACE FIRST (boot the alpha, tap RUN, ask the page):
    localStorage : 3 keys, 10,859 bytes   bohemia.save.v1 = 9,351
    navigator.storage.persisted() : FALSE      <- never granted
    navigator.storage.persist     : present    <- and NEVER CALLED
    zero occurrences of `navigator.storage` anywhere in the repo
    60 localStorage call sites, 0 IndexedDB

*** THE SECOND INJURY NOBODY HAD CONNECTED: slices/sw.js is what makes the ONE-LINK LAW
work (network-first, so the one URL always serves the newest deploy) and SERVICE WORKER
REGISTRATIONS ARE ON THE SAME EVICTION LIST. A player back after a week loses the save
AND falls back to a stale link - the exact failure the one-link law exists to prevent.

SHIPPED: tools/bohemia_durable_save_patch.py, one request at boot, marker-fenced,
idempotent. IT TOUCHES NO SAVE CODE - how a save is written/read/migrated/exported is
the RUN lane's and none of it changes; this asks the browser to KEEP what is already
being written, and the gate asserts the boundary (no setItem in the block). Fire and
forget: false changes nothing, an exception changes nothing, boot never waits. WORST
CASE IS EXACTLY TODAY. Nothing for Paolo to judge - Safari decides with no user prompt.
GATE: gates/durable_save_gate.js, 13 claims, 3 mutations killed. IT MEASURES ON THE REAL
SURFACE rather than grepping for the line, because A LINE THAT EXISTS AND NEVER RUNS is
the exact bug this repo has found all week. It deliberately does NOT assert persistence
was GRANTED - browsers decide on their own heuristics and headless Chromium answers
differently from a phone; asserting the grant would make the gate a weather report. It
asserts THAT WE ASKED, correctly, on the surface he opens. It also alarms if the save
ever outgrows localStorage (10.8 KB today, ~5 MiB cap).

[PENDING PAOLO, DUE ~MONTH 8, NOT BLOCKED TODAY] WHAT THE GAME SHIPS AS - web link /
home-screen app / App Store wrapper. It matters more now the eviction rules are known:
tab = 7-day counter (now mitigated), home-screen = own counter tied to real use
(materially safer), wrapper = native storage, not subject to this at all. Store review,
monetisation and packaging all work backwards from it.

-----------------------------------------------------------------------------------
*** FLEET-WIDE, READ BEFORE YOU PUSH ANYTHING: THE DEPLOY IS WEDGED (8/6) ***
records/BOHEMIA_THE_DEPLOY_IS_WEDGED_AND_ONE_RUN_IS_MINE_8_6_26.md
Nothing has published to the live site since ~14:00. The BUILD succeeds every
time; GitHub's Pages DEPLOYMENT service sits in `deployment_in_progress` until the
action gives up ("Timeout reached, aborting!"). Verified on two different lanes'
commits, so it is not any one session's content.
AND THERE IS EXACTLY ONE WEDGED RUN, WHICH IS MINE: run 31109048696 (sha
75ae0248) has been `queued` for five and a half hours. It is the re-run I
triggered after the first timeout. The API refuses to cancel it -- 409 "Cannot
cancel a workflow re-run that has not yet queued" -- every single time.
  THE ONE CLICK THAT CLEARS IT, AND ONLY PAOLO CAN DO IT:
  https://github.com/paolosarn/bohemia/actions/runs/31109048696  -> Cancel
  It unblocks EVERY lane. Fallback: Settings -> Pages, re-save the source.
THREE THINGS NO LANE SHOULD DO:
  1. DO NOT PUSH HARDER TO FORCE A DEPLOY. Every push cancels the run in flight,
     so a push storm is indistinguishable from the outage and makes it worse.
  2. DO NOT RE-RUN A FAILED PAGES JOB. That is what wedged this one. Wait for the
     next real commit to carry the content -- any later commit on main already
     contains the earlier work.
  3. DO NOT ADD .github/workflows/pages.yml TO FIX IT. The canonical answer
     (concurrency group pages, cancel-in-progress:false, so deploys QUEUE) is the
     right shape for a fleet this size, but it needs the repo's Pages source
     switched from "Deploy from a branch" to "GitHub Actions" in Settings, which
     no session can set. Shipping it without that turns an intermittent outage
     into a permanent one. RIGHT FIX, PAOLO-GATED.
AND STOP TELLING HIM TO WAIT FOR A BUILD NUMBER. The stamp is ONE shared field
that every lane overwrites -- I said "wait for 8/4d" twice while main already read
8/4h from another session. Tell him WHAT TO LOOK AT ("your face is in the fire
button with green fluid in it"), which no other lane's commit can invalidate.

PEOPLE (7h9sfy): 8/6 LATEST — *** SEVENTEEN FINISHED THINGS SHIP TO A FILE NO PLAYER
CAN SEE, INCLUDING PAOLO'S OWN APPROVED WALLS AND THE ONE-BUTTON VERB SYSTEM. ***
Record: records/BOHEMIA_WHAT_WE_BUILT_THAT_HE_CANNOT_REACH_8_6_26.md
Census: records/BOHEMIA_REACHABILITY_CENSUS.md  (re-run: python3 tools/bohemia_reachability_census.py)

SIX TIMES IN THREE DAYS this fleet found the same thing one instance at a time - the
signal bank reaching nothing for two weeks, the identity card on a page he never sees,
nineteen gates hunting a moved constant, touch_guard GREEN while checking nothing, five
hairstyles nobody could wear, my own walk fix landing on the invisible file. THAT IS NOT
SIX BUGS. It is ONE DISEASE: work lands somewhere he cannot reach and the machine says
green. Nothing could answer the general question, so nobody asked it. Now something can.

                    reaches him | loaded only | no trace | not-for-players
    banks    (95)            15 |           8 |       72 | -
    engine  (110)            72 |           9 |       14 | 15

*** THE BUCKET THAT MATTERS: 17 FINISHED THINGS THAT REACH ONLY
    slices/BOHEMIA_RUN_CURRENT.html, WHICH THE ALPHA LOADS AND NEVER DISPLAYS ***
    banks/BOHEMIA_PERIMETER_8_2_26.txt      the 11 walls PAOLO JUDGED AND APPROVED 8/2
    banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt 3.63 MB of interior dressing
    engine/bohemia_resolve.js               THE SENTENCE - one button, act, spend, resolve
    engine/bohemia_quest_runtime.js + _bq   the quest runtime and parser
    engine/bohemia_loop.js                  the driven engine
    engine/bohemia_garage.js, _crypt.js     interiors
    banks/GRIME_8_3, OPENINGS_8_2, CIVIC_OPENINGS_8_3   approved art from the last 4 days
*** THE NUMBER MOVES: it was 17 when written and 28 after merging the same
day's other lanes. Nobody did anything wrong - new finished work keeps landing in the
invisible file because NOTHING WAS WATCHING. Re-run the census for the live count. ***
THIS IS NOT A FAILURE LIST, IT IS A WORK-ALREADY-PAID-FOR LIST, and at the start of an
11-month run that is the most valuable list there is.

WHAT THE NUMBERS DO NOT SAY, because a census that overclaims is worse than none:
NO TRACE is strong evidence, NOT PROOF - a bank TRANSFORMED before shipping (re-encoded,
recoloured, re-tiled) reads as NO TRACE while genuinely reaching him, and the four
HD_TILE_REPO parts (180 MB, two thirds of the corpus) are almost certainly that. 20 of
the 72 are CANDIDATE/VERDICT/JUDGE pools where only an approved subset should ever ship.
A DERIVED bank reads NO TRACE correctly too (WARDROBE_CANON is extracted FROM the alpha).
And THE MB FIGURE IS NEARLY A TAUTOLOGY - 258 MB of corpus cannot fit in a 29 MB surface.
THE COUNTS ARE THE FINDING; THE MEGABYTES ARE NOT.

CALIBRATED BEFORE IT WAS BELIEVED. v1 sampled 8 payloads and printed a BINARY, and the
door-anim bank came out SHOWN on one run and NO TRACE on another OFF THE SAME BYTES - a
coin flip wearing a claim's name, the exact bug that had four of this lane's gates dead
for a fortnight. Now 32 samples AND IT REPORTS THE FRACTION, because "2 of 32", "0 of 32"
and "32 of 32" are three different facts. Then checked against four things verified BY
HAND on 8/4 before the tool existed - all four agree, and the gate keeps them as
permanent CALIBRATION claims: if the census ever disagrees with a hand check, THE CENSUS
IS BROKEN, not the hand check.

THE GATE DOES NOT DEMAND THE NUMBER FALL. Wiring order is Paolo's and the owning lane's
call; a gate forcing it would be A GATE OUTRANKING A RULING. It demands the number stay
TRUE: fresh, caveat intact, no ghosts, agrees with the hand checks. 16 claims, 4
mutations killed.

-----------------------------------------------------------------------------------
PEOPLE (7h9sfy): 8/4 LATEST — *** A CHECK POINTED AT THE WRONG DOOR. THREE TIMES IN
ONE DAY, AND THE THIRD ONE WAS MINE. EVERY LANE READ THIS. ***
Record: records/BOHEMIA_A_CHECK_POINTED_AT_THE_WRONG_DOOR_8_4_26.md

THE CORRECTION FIRST, BECAUSE IT IS MINE. I shipped the head-on deadlock fix and told
Paolo neighbours in the RUN tab would "walk around each other instead of getting stuck
standing in place." MEASURED AFTERWARDS ON THE REAL ALPHA, THAT OVERSTATED IT:
    slices/BOHEMIA_CITY_WORLD.html   function makeSim( : 1 definition, 0 CALL SITES
The walked surface draws people through the OFFLINE PLANE - ask the schedule where
somebody is at this minute, draw them there - which is the documented two-plane design
and is CORRECT. It does not step the sim. My fix is real and correct and live in
BOHEMIA_RUN_CURRENT.html, which does step it, and which the RUN tab never shows. I
should have measured before telling him what he would see.

*** THE FLEET-SCALE VERSION OF THE SAME BUG, AND IT IS ON THE SCOREBOARD ***
records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md says "THE RUN IS THE GAME: 25/31
systems integrated". Every probe in integration_gate.js reads BOHEMIA_RUN_CURRENT.html.
Since 7/28 the alpha routes RUN to the city panel, one line:
    var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;
MEASURED: tap RUN, the only visible panel is p-city at 390x790 running
BOHEMIA_CITY_WORLD.html. runFrame exists with src=BOHEMIA_RUN_CURRENT.html and is
NEVER SHOWN.
THE ROWS ARE NOT WRONG. They are true about the file they name. What is wrong is that
THE GREENS ARE NOT EVIDENCE ABOUT THE SURFACE HE PLAYS, and no reader can tell which
ones are.
I CHECKED BEFORE CLAIMING AND MY FIRST PASS WAS WRONG - worth knowing, because the
same trap is waiting for the next person: I searched the city for the RUN SLICE'S
function names and "found" five missing systems. FOUR WERE FALSE ALARMS. Doors,
save/load, the resolver and combat are all there under their own spellings; the CITY
lane ported the great majority of it. What survived checking: CLOUT / FEED / FOLLOWERS
(marked INTEGRATED, no trace in the city under any spelling tried) and the agent sim.

BUILT: gates/surface_truth_gate.js, 16 claims, FIVE MUTATIONS KILLED.
It does NOT demand the two surfaces match. Which file the run lives in is a real design
call with real consequences and IT IS THE RUN LANE'S - a gate forcing it would be A GATE
OUTRANKING A RULING (Paolo 8/1). It demands HONESTY: the ledger declares which file it
probes and which the RUN tab shows, both must be true, and a mismatch must be stated
ABOVE the table where a reader cannot reach the greens first. THE SHOWN SURFACE IS
DERIVED FROM THE ALPHA'S OWN ROUTING LINE, never typed, so it follows whoever re-points
the tab and goes stale loudly the day it stops being true.

=== FOR THE RUN LANE, WHOSE CALL THIS IS ===
Either re-point the ledger at the city frame and re-probe every row against it, or make
the run slice the shown surface again. Both are real, both cost. Not mechanical, not
mine, NOT URGENT - but it should be DECIDED rather than drifted into, which is why it
is now written where the scoreboard is read.

STANDING LESSON, THIRD INSTANCE IN THREE DAYS: a check pointed at the wrong door NEVER
ANNOUNCES ITSELF, because pointing at the wrong door produces confident GREEN, not red.
Finding these one at a time has not worked. Before you believe a green, ask what FILE
it read and whether that is the file he taps.

-----------------------------------------------------------------------------------
PEOPLE (factions): 8/2 (n) LATEST — WORD TRAVELS: he can finally SEE the reputation system,
AND BUILDING THE VISIBLE VERSION FOUND TWO REAL BUGS IN AN HOUR.
Record: records/BOHEMIA_WORD_TRAVELS_8_2_26.md   TAB: LIFE, top card.

THE PROBLEM WAS MINE: three turns of deep faction plumbing and HE HAD SEEN NOTHING. The
WORLD lane's 7/31 lesson word for word - a turn in this lane with nothing to look at is a
turn that missed. So: a page he taps and watches, running the REAL engine modules inlined
verbatim, not a mock-up. Tap DO SOMETHING BAD -> 8 of 18 saw it. Tap A DAY PASSES -> the
story moves person to person, 15 of 18 know by day 3, standings slide COLD -> HOSTILE. Tap
A GENERATION PASSES -> "Everyone who watched you is dead. 8 things died with them. 7
survived, because people talked. Your kid now gets judged for it, and was not even born."

*** THE DEED VOCABULARY WAS ALREADY HIS AND I ALMOST INVENTED ONE. *** The quest corpus
carries 61 `@DO faction NAME +N` effects - per faction, both directions, real magnitudes,
already authored and already studied. REUSE-FIRST, THIRD TIME TODAY: colours were already
chosen, marks were already chosen, the deed vocabulary was already written.
IF YOU ARE ABOUT TO INVENT SOMETHING, GREP FIRST.

*** AND THEN IT FOUND TWO REAL BUGS, WHICH IS THE WHOLE POINT ***
1. A DEED WAS FORGOTTEN IN TWO DAYS. On screen a serious wrong was -0.05 after three days
   and the system looked broken. Opinions were decaying on bohemia_memory's SIGHTING
   half-life - twelve hours. Right for "did you see that guy walk past", absurd for "that
   man burned my neighbour's house". Deeds now carry THEIR OWN clock (three weeks base,
   scaled by size - the flashbulb asymmetry). Sightings untouched.
2. GOSSIP COULD NEVER FIRE. GOSSIP_WINDOW was documented as a co-location window and used
   as a STALENESS window, making news untellable after EIGHTEEN HOURS. A day-step is 1440
   minutes, so on any normal clock THE MODULE'S ENTIRE THIRD RULE WAS DEAD. Split into
   NEWS_LIFE (a fortnight).
*** BOTH PASSED EVERY UNIT TEST. *** The decay tests asserted "it went down" and it HAD.
The gossip tests all gossiped within minutes of the deed. IT TOOK LOOKING AT IT. That is
VERIFY ON THE REAL SURFACE (7/18) landing somewhere nobody thought it applied: not art,
SIMULATION. If your system has no surface, your tests are grading their own homework.

GATES: STANDING 29 -> 35 claims, 11/11 probes (three new claims exist only because the demo
found the bugs). FACTION MEMBERSHIP 50/0, PEOPLE 152/0, NAME THE TAB 23/0, BUILD THE WORLD
10/0, REUSE-FIRST 108/0, PAYLOAD WALL 4/0, ENGINE SYNC clean, FRONT DOOR 8/0.
Verified through the real door: LIFE tab, top card, zero console errors. Stamp 8/2av.

=== WHAT COMES AFTER ===
1. NOTHING CALLS witness() IN THE REAL RUN YET. The vocabulary now exists (the quest corpus)
   and the organ works and is visible. Wiring it is the next move - RUN-lane coordination.
2. Gap 5 (wearing another faction's colours). 3. Gaps 6, 8, 9.

PEOPLE (7h9sfy): 8/4 LATEST — *** A CHECK POINTED AT THE WRONG DOOR. THREE TIMES IN
ONE DAY, AND THE THIRD ONE WAS MINE. EVERY LANE READ THIS. ***
Record: records/BOHEMIA_A_CHECK_POINTED_AT_THE_WRONG_DOOR_8_4_26.md

THE CORRECTION FIRST, BECAUSE IT IS MINE. I shipped the head-on deadlock fix and told
Paolo neighbours in the RUN tab would "walk around each other instead of getting stuck
standing in place." MEASURED AFTERWARDS ON THE REAL ALPHA, THAT OVERSTATED IT:
    slices/BOHEMIA_CITY_WORLD.html   function makeSim( : 1 definition, 0 CALL SITES
The walked surface draws people through the OFFLINE PLANE - ask the schedule where
somebody is at this minute, draw them there - which is the documented two-plane design
and is CORRECT. It does not step the sim. My fix is real and correct and live in
BOHEMIA_RUN_CURRENT.html, which does step it, and which the RUN tab never shows. I
should have measured before telling him what he would see.

*** THE FLEET-SCALE VERSION OF THE SAME BUG, AND IT IS ON THE SCOREBOARD ***
records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md says "THE RUN IS THE GAME: 25/31
systems integrated". Every probe in integration_gate.js reads BOHEMIA_RUN_CURRENT.html.
Since 7/28 the alpha routes RUN to the city panel, one line:
    var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;
MEASURED: tap RUN, the only visible panel is p-city at 390x790 running
BOHEMIA_CITY_WORLD.html. runFrame exists with src=BOHEMIA_RUN_CURRENT.html and is
NEVER SHOWN.
THE ROWS ARE NOT WRONG. They are true about the file they name. What is wrong is that
THE GREENS ARE NOT EVIDENCE ABOUT THE SURFACE HE PLAYS, and no reader can tell which
ones are.
I CHECKED BEFORE CLAIMING AND MY FIRST PASS WAS WRONG - worth knowing, because the
same trap is waiting for the next person: I searched the city for the RUN SLICE'S
function names and "found" five missing systems. FOUR WERE FALSE ALARMS. Doors,
save/load, the resolver and combat are all there under their own spellings; the CITY
lane ported the great majority of it. What survived checking: CLOUT / FEED / FOLLOWERS
(marked INTEGRATED, no trace in the city under any spelling tried) and the agent sim.

BUILT: gates/surface_truth_gate.js, 16 claims, FIVE MUTATIONS KILLED.
It does NOT demand the two surfaces match. Which file the run lives in is a real design
call with real consequences and IT IS THE RUN LANE'S - a gate forcing it would be A GATE
OUTRANKING A RULING (Paolo 8/1). It demands HONESTY: the ledger declares which file it
probes and which the RUN tab shows, both must be true, and a mismatch must be stated
ABOVE the table where a reader cannot reach the greens first. THE SHOWN SURFACE IS
DERIVED FROM THE ALPHA'S OWN ROUTING LINE, never typed, so it follows whoever re-points
the tab and goes stale loudly the day it stops being true.

=== FOR THE RUN LANE, WHOSE CALL THIS IS ===
Either re-point the ledger at the city frame and re-probe every row against it, or make
the run slice the shown surface again. Both are real, both cost. Not mechanical, not
mine, NOT URGENT - but it should be DECIDED rather than drifted into, which is why it
is now written where the scoreboard is read.

STANDING LESSON, THIRD INSTANCE IN THREE DAYS: a check pointed at the wrong door NEVER
ANNOUNCES ITSELF, because pointing at the wrong door produces confident GREEN, not red.
Finding these one at a time has not worked. Before you believe a green, ask what FILE
it read and whether that is the file he taps.

-----------------------------------------------------------------------------------
PEOPLE (factions): 8/2 (m) LATEST — *** YOUR FATHER'S DEBTS. The question the game's own
premise raises and NOBODY HAD ASKED. ***
Record: records/BOHEMIA_YOUR_FATHERS_DEBTS_8_2_26.md

Bohemia is a FAMILY ACROSS THREE GENERATIONS (story master) and the handoff happens WHEN
THE STORY SAYS SO, never on death (DEATH IS A RELOAD 7/26). So there is a canon moment when
the valley stops judging you and starts judging your child.
NOBODY HAD EVER ASKED WHAT HAPPENS TO YOUR REPUTATION AT THAT MOMENT. Not on the twelve-gap
list, not in THE BIG MISSING, not in the GDD, not in a backlog. It was invisible because it
only appears once a reputation system exists at all - which was three hours old.

*** AND THE ORGAN ALREADY MODELLED IT. *** Thirty years pass and EVERY WITNESS IS DEAD, so
the only trace of a life is what got REPEATED. The rule writes itself:
    A QUIET GOOD DEED DIES WITH THE WITNESS.
    A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR.
This is not a new system. It is what the witness organ was always going to do if you ran
the clock forward - which is why gossip had to exist first.

MEASURED:
  a secret, one witness, never repeated .... 0 carried, 1 died. Child inherits NOTHING.
  a notorious one that spread to three ..... 2 carried. Child owes -0.767 they never ran up.
  one generation further ................... grandchild -0.345, still faintly there.
Three generations and only the loudest thing your grandfather did still registers, which is
exactly the arc the story master already describes. legendOf() reports what the valley still
says: the deed, how many still tell it, how many generations back.

GROUNDED, real anthropology not a trope: in stateless societies a family is a CORPORATE
ENTITY whose reputation carries its economic standing, lineages run 10-12 generations deep,
and ostracism does the work fines and prisons do elsewhere. You are born owing what your
father owed. Same reasoning that made the Mob the guarantor and the Caravans' name their
armour.

THE LIFE LESSON, never said out loud: you inherit goodwill you did not earn and debts you
did not run up, and neither one is fair.

COST: one function and one constant (GEN_LOSS 0.45 - less than half survives a handoff, so
a legend must have been LOUD to cross even one).
CONTENTS-PAOLO'S HELD: DEED_WEIGHT still EMPTY and the gate proves inheriting invents
nothing. WHEN the handoff happens is HIS - inherit() is called by whoever runs that beat.

GATE: STANDING 23 -> 29 claims, 10/10 probes. The two new probes are the two ways this
could quietly break: a secret crossing a generation anyway, and an inherited reputation
that never fades so a family is damned forever.
Regression: FACTION MEMBERSHIP 50/0, PEOPLE 152/0, BUILD THE WORLD 10/0, FRONT DOOR 8/0,
ENGINE SYNC clean.

=== WHAT COMES AFTER (unchanged and now urgent) ===
1. NOTHING CALLS witness() YET. The whole organ is inert until the run reports deeds into
   it, and that needs a DEED VOCABULARY, which is his. THE NEXT NON-BLOCKED MOVE IS TO
   INVENTORY EVERY ACTION THE RUN CAN ALREADY PRODUCE so his ruling is a thumb over a real
   list instead of a blank page. Do that before asking him anything.
2. Gap 5 (wearing another faction's colours) - now cheap.
3. Gaps 6, 8, 9 (agendas, membership, internal politics) all sit on this.
PEOPLE (factions): 8/2 (l) LATEST — GAP 3 IS BUILT, AND IT TOOK GAPS 4, 7 AND 10 WITH IT.
Record: records/BOHEMIA_REPUTATION_TRAVELS_8_2_26.md   engine/bohemia_standing.js

Gap 3 was the documented failure of the whole genre: every NPC instantly knowing what you
did with no route the news could take. WE ALREADY HAD THE HARD HALF - bohemia_memory is a
real witness organ with decay. It had no concept of a DEED, an OPINION, or one person
TELLING ANOTHER. That is all the new module adds.

  1. A DEED IS WITNESSED, NEVER ANNOUNCED   measured 2 of 3; the far one learned nothing
  2. AN OPINION IS DERIVED, NEVER STORED    nothing to save, migrate or desync
  3. HEARSAY IS WEAKER AND RUNS OUT         watched 3.96 vs heard 2.18; a rumour down a
                                            line of TWELVE people reached THREE
  4. A FACTION'S VIEW IS ITS MEMBERS' VIEWS no ledger, no faction named in the module

*** THREE MORE GAPS FELL OUT OF ONE MECHANISM, NOBODY HAD TO BUILD THEM: ***
  GAP 4 (no way back) - opinions decay, so one bad deed goes 4.00 -> 1.00 -> 0.06 -> 0.00
    over a week. Time softens it, being seen doing better is the fast way, and ONE NIGHT IS
    NOT FORGIVENESS (gated both directions).
  GAP 7 (nothing costs anything) - same deed: ALPHA who watched goes HOSTILE -4.00, BETA
    who was elsewhere stays NEUTRAL 0.00. Nobody authored a table of who hates whom.
  GAP 10 (cannot see where you stand) - becauseOf() returns the actual remembered deeds,
    who holds them, and whether they WATCHED it or only HEARD it.
AND "no view" is distinguishable from "neutral view" (whoSaw), which most systems botch.

DEED_WEIGHT SHIPS EMPTY. What counts as a deed and what it is worth is HIS and unmade;
with it empty every opinion is 0 and every faction is NEUTRAL, and the gate proves the
module is INERT rather than trusting the header. THIS IS NOT THE STANDING LEDGER BUILD THE
WORLD TURNED OFF - nothing is stored anywhere and the gate reads the source to prove it.

=== A LESSON ABOUT GATES, WORTH MORE THAN THE FEATURE ===
The first version of this gate's self-test was DECORATIVE AND SAID SO: six probes that
re-ran the working module and asked whether it misbehaved. Of course it did not. It
reported 0/6 CAUGHT and could never have caught anything. Rewritten so each probe feeds a
CLAIM'S OWN PREDICATE the values a broken implementation would produce, and passes only if
the claim REJECTS them. Now 8/8. IF YOU WRITE A SELF-TEST, TEST THE CHECKER, NOT THE THING.

GATES: STANDING 23/0 (registered) · FACTION MEMBERSHIP 50/0 · PEOPLE 152/0 · FRONT DOOR 8/0
· PAYLOAD WALL 4/0 · BUILD THE WORLD 10/0 · ENGINE SYNC clean (17 modules).
MEMORY 7/2 is the pre-existing 0-agents red (P-F), same on clean main.

=== WHAT COMES AFTER ===
1. NOTHING CALLS witness() YET. The organ is built and inert; the run has to report deeds
   into it, and that needs a deed vocabulary, which is his.
2. GAP 5 (wearing another faction's colours) is now cheap - colours in, membership in, and
   this supplies "somebody who knows your face sees you in it".
3. GAPS 6, 8, 9 (agendas, membership, internal politics) all sit on this.

PEOPLE (factions): 8/2 (m) LATEST — *** YOUR FATHER'S DEBTS. The question the game's own
premise raises and NOBODY HAD ASKED. ***
Record: records/BOHEMIA_YOUR_FATHERS_DEBTS_8_2_26.md

Bohemia is a FAMILY ACROSS THREE GENERATIONS (story master) and the handoff happens WHEN
THE STORY SAYS SO, never on death (DEATH IS A RELOAD 7/26). So there is a canon moment when
the valley stops judging you and starts judging your child.
NOBODY HAD EVER ASKED WHAT HAPPENS TO YOUR REPUTATION AT THAT MOMENT. Not on the twelve-gap
list, not in THE BIG MISSING, not in the GDD, not in a backlog. It was invisible because it
only appears once a reputation system exists at all - which was three hours old.

*** AND THE ORGAN ALREADY MODELLED IT. *** Thirty years pass and EVERY WITNESS IS DEAD, so
the only trace of a life is what got REPEATED. The rule writes itself:
    A QUIET GOOD DEED DIES WITH THE WITNESS.
    A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR.
This is not a new system. It is what the witness organ was always going to do if you ran
the clock forward - which is why gossip had to exist first.

MEASURED:
  a secret, one witness, never repeated .... 0 carried, 1 died. Child inherits NOTHING.
  a notorious one that spread to three ..... 2 carried. Child owes -0.767 they never ran up.
  one generation further ................... grandchild -0.345, still faintly there.
Three generations and only the loudest thing your grandfather did still registers, which is
exactly the arc the story master already describes. legendOf() reports what the valley still
says: the deed, how many still tell it, how many generations back.

GROUNDED, real anthropology not a trope: in stateless societies a family is a CORPORATE
ENTITY whose reputation carries its economic standing, lineages run 10-12 generations deep,
and ostracism does the work fines and prisons do elsewhere. You are born owing what your
father owed. Same reasoning that made the Mob the guarantor and the Caravans' name their
armour.

THE LIFE LESSON, never said out loud: you inherit goodwill you did not earn and debts you
did not run up, and neither one is fair.

COST: one function and one constant (GEN_LOSS 0.45 - less than half survives a handoff, so
a legend must have been LOUD to cross even one).
CONTENTS-PAOLO'S HELD: DEED_WEIGHT still EMPTY and the gate proves inheriting invents
nothing. WHEN the handoff happens is HIS - inherit() is called by whoever runs that beat.

GATE: STANDING 23 -> 29 claims, 10/10 probes. The two new probes are the two ways this
could quietly break: a secret crossing a generation anyway, and an inherited reputation
that never fades so a family is damned forever.
Regression: FACTION MEMBERSHIP 50/0, PEOPLE 152/0, BUILD THE WORLD 10/0, FRONT DOOR 8/0,
ENGINE SYNC clean.

=== WHAT COMES AFTER (unchanged and now urgent) ===
1. NOTHING CALLS witness() YET. The whole organ is inert until the run reports deeds into
   it, and that needs a DEED VOCABULARY, which is his. THE NEXT NON-BLOCKED MOVE IS TO
   INVENTORY EVERY ACTION THE RUN CAN ALREADY PRODUCE so his ruling is a thumb over a real
   list instead of a blank page. Do that before asking him anything.
2. Gap 5 (wearing another faction's colours) - now cheap.
3. Gaps 6, 8, 9 (agendas, membership, internal politics) all sit on this.

PEOPLE (7h9sfy): 8/4 LATEST — *** NOBODY STANDS IN THE STREET ALL DAY. *** Five of
this lane's gates were dead on main for their whole visible history, and fixing the
way they LOOK at the world found two real bugs in the world itself.
Record: records/BOHEMIA_NOBODY_STANDS_IN_THE_STREET_ALL_DAY_8_4_26.md

WHY THEY WERE DEAD, AND NOBODY WROTE BAD CODE. LIFE / DRESS / POPULATION / MEMORY
were red and DEVIATION was CRASHING (worse: a crash asserts nothing at all). All five
built one block at seed 7 and asserted people were in it. That was a safe bet on 7/19
when OCCUPIED_RATE was 0.30 - measured, all 40 seeds came up populated. On 8/1 the
rate became 0.038 by correct arithmetic off Paolo's scale-model question (1,113 people
in the valley), a 20-home block now averages 0.76 occupied houses, EMPTY IS THE MODAL
OUTCOME, and seed 7 came up tails.
    seeds 1..40 at 0.30  -> 40 populated, 0 empty
    seeds 1..40 at 0.038 -> 27 populated, 13 EMPTY
NOT A LICENCE TO EDIT GATES UNTIL THEY GO GREEN. The test every claim was held to:
DOES IT ASSERT MORE? The new claims pin BOTH ends - the valley is mostly empty AND
somewhere people are living - and cannot flip on scan order. Mutation-tested both
ways. AND THE TRAP ONE LEVEL DOWN: "just pick the first seed that HAS people" is the
same bug in a better disguise (seed 3 answers the missing-persons question, seeds 9,
21, 25, 39 do not, and seed 39's six residents never meet at all - the dead world
working). gates/bohemia_block_fixture.js is the one fixture, 40 blocks, and it THROWS
rather than hand back an empty a caller sims in silence.
    LIFE 21/3 -> 24/0 | DRESS 42/2 -> 46/0 | POPULATION 5/3 -> 10/0
    MEMORY 7/2 -> 10/0 | DEVIATION CRASH -> 12/0

*** THE BUG THE BLIND GATE WAS HIDING - THIS ONE IS IN THE GAME HE PLAYS ***
The moment POPULATION could see, it went 0 spot checks -> 1,905 and failed at once.
    H5-3  @111,18 wants 111,17 - held by H14-1
    H14-1 @111,17 wants 111,18 - held by H5-3
Two people who wanted to SWAP CELLS. Each one's next step was the other's body. They
stood there 1,589 and 1,533 turns - OVER A GAME DAY EACH - on walks home of 173 and
165 steps, while everybody else walked home at one cell per turn. Both had free
neighbours the whole time: an open street neither ever looked at, because the blocked
branch said `a._path=null; // wait, replan next turn` AND THE COMMENT IS WHAT HID IT.
Replanning changes nothing - path() is a deterministic BFS over the STATIC grid.
FIX: replan with the other BODIES AS WALLS and take the detour. 173 steps -> 173
turns. Carried into all four slices that inline it (tools/bohemia_walk_deadlock_patch
.py reads the replacement OUT OF THE ENGINE so it can never drift) INCLUDING
slices/BOHEMIA_CITY_WORLD.html, the walked world the RUN tab opens.
I WROTE THE FIX WRONG THE FIRST TIME: shift() mutates the same array, so around[1]
after it is the cell TWO ahead - a two-cell teleport, and a crash on a one-step
detour. gates/walk_deadlock_gate.js caught it the same hour. Its regression test
makes PAOLO the blocker: the player is parked on the agent's next cell every single
turn and they still have to arrive.

*** AND FIVE HAIRSTYLES NOBODY IN THE VALLEY COULD WEAR ***
DRESS was red at 231 banked vs 236 canon. The bank was not stale, THE PARSER WAS: the
clothing lane's 8/1 hair batch writes `layer:'hair',lux:true,gen:` and the extractor
allowed tags only BEFORE the layer. SUN CROP, DUSK SHAG, TEMPLE TAPER, ASH SWEEP and
SALT CROWN were dropped in silence. Fixed; hair 10 -> 15 items. A COUNT IS A SMOKE
ALARM, NOT A DIAGNOSIS - the check names them now instead of counting them.

=== TWO REDS LEFT ON MAIN AFTER THIS SHIP, NEITHER MINE, BOTH NAMED SO THEY ARE NOT
=== LOST. Measured on a clean tree before and after my work; identical both times.
1. GRAVEYARD: "HAIR AFRO is dead. 8/1/26 - 1 LIVE REFERENCE". Dead things staying
   dead is one of the oldest laws here and it was quietly unenforced while the gate
   could not read the world (see below). CHARACTER LANE'S.
2. DISTRICT FILL: "cityhall is not emptier than it was on 8/2 (53.9% vs 59.8%)".
   Caused by commit 2fc2e3f "NO CANOPIES: a ruling is not a design conversation" -
   a PAOLO RULING removed content and the 8/3 floor did not move with it. THAT IS A
   GATE OUTRANKING A RULING, which 8/1 law forbids. The fix is one line - re-pin
   cityhall's baseline in records/BOHEMIA_DISTRICT_FILL_BASELINE_8_2_26.json with
   the ruling cited - but a content floor is the CITY lane's number to set, not
   mine to lower on their district. CITY LANE'S, and it is a one-minute job.

-----------------------------------------------------------------------------------
SAME TURN, EARLIER — THE CITY-RESOLVER WORK, AND *** THE WORLD LANE SHIPPED THE SAME
FIX FIRST, SO THEIRS IS THE ONE. *** Record (rewritten honestly):
records/BOHEMIA_THE_GATES_COULD_NOT_SEE_THE_CITY_8_4_26.md

Both of us built a resolver for "where is the city" in the same hours. gates/
bohemia_city_app.js (WORLD lane) landed on main first; I deleted mine and moved my
one surviving check onto theirs. A SECOND RESOLVER FOR THE SAME FACT IS EXACTLY
WHAT BOTH OF THEM EXIST TO STOP - the incumbent wins, whose name is on it does not
matter. Nothing to argue about, noted so nobody re-litigates it.

*** THE ONE THING THAT SURVIVED, BECAUSE A REDS-DRIVEN SWEEP COULD NOT SEE IT ***
touch_guard_gate looped the three embedded frames and did
    if (src.indexOf(key) < 0) continue;
The city key stopped existing, so THE BIGGEST FRAME IN THE GAME QUIETLY STOPPED
BEING CHECKED - no failure, no claim, a GREEN gate. THAT IS WHY IT SURVIVED A
TWENTY-ONE-GATE SWEEP: a sweep driven by what is RED cannot see a gate that
responds to a missing input by going quiet. Verified directly - origin/main at
1ceb61c still carried that `continue` until this ship. That gate exists because
Paolo could not walk (the d-pad raised iOS's copy/paste magnifier instead of moving
him). A GATE THAT SKIPS IS WORSE THAN A GATE THAT FAILS. A missing payload is a
FAILURE now, for all three frames.
LESSON FOR EVERY LANE: when you sweep a class of bug, do not sweep the RED LIST.
Sweep the PATTERN. The instances that went quiet instead of red are the ones still
out there, and they are the dangerous ones.

PEOPLE (7h9sfy): 8/3 (b) LATEST — THE PEOPLE ARE NOT COPIES OF HIM ANY MORE.
Record: records/BOHEMIA_THE_PEOPLE_ARE_NOT_HIM_8_3_26.md

Paolo, after seeing the first neighbour he could talk to: "I saw it very good... now we
have character models just shuffle that character model every time the game looks and
have it not be a copy of me."

HE WAS DESCRIBING THE CODE EXACTLY. The city frame drew every resident as PLAYER_CV -
HIS OWN BAKED BODY - through pplTinted(), a colour shift over his finished sprite. Same
rig, same clothes, same silhouette, different hue. Six weeks of wardrobe work and every
person in the valley was him with the saturation turned.

THE ANSWER WAS ALREADY IN THE GAME, ONE IFRAME AWAY. runSendCast() has baked SIX REAL
TOWNSFOLK for the run since 7/26 - it swaps G.tints (jacket/shirt/pants/shoes) and
G.equipped.hat and re-bakes the actual rig through bake56. Their own clothes, their own
colourways, a durag on every third. THE CITY FRAME NEVER RECEIVED THEM.
  alpha side: citySendCast() bakes the same six, posts BOHEMIA_CITY_CAST. Same withLook
              + bake56 mechanism, not a second one. IDLE ONLY (48 frames, not 288).
  city side:  the people pass draws cast[person.look % N] instead of tinting the player,
              and falls back to the tinted body if the bake has not landed so nobody
              vanishes waiting.
Which body a person wears was ALREADY stable - personFields gives everyone a `look` from
their own hash - so a body KEEPS its clothes instead of flickering as you watch.
REUSE CHECK: zero pixels cooked, no bank opened. Every frame is baked by the alpha's own
bake56 from art he already approved.

=== THE GATE, AND THE CLAIM THAT ACTUALLY MATTERS ===
gates/city_cast_gate.js, 8 claims, drives the ALPHA and taps the TAB.
"There is a cast" would pass on six copies of him. "A message was sent" would pass on an
empty message. So it HASHES THE REAL PIXELS of every baked body and of the player's and
requires all distinct AND not one of them his. Measured: 6 bodies, 6 distinct, 0 his.

*** AND A VACUOUS CHECK I CAUGHT IN MY OWN GATE - READ THIS IF YOU PROBE AN IFRAME ***
PLAYER_CV and CAST_CV are `let` at the top of the frame's script, which makes them global
LEXICAL bindings and NOT properties of window. My first measurement read
window.PLAYER_CV, got undefined, and "none of them is the player" passed by comparing
every body against null. A CHECK THAT COULD NOT FAIL. B3 now asserts the player's body
was measurable at all, precisely so the important claim can never go vacuous that way.
USE BARE IDENTIFIERS when you evaluate inside a frame.
Mutations: cast never reaches the draw -> B6 red. The six baked WITHOUT swapping clothes
so they ARE him -> B4 red (1 of 6 distinct), B5 red (6 matches his pixels), B6 red.
Neighbours held: CITY TALK 18, CITY PEOPLE 18, HUMAN START 9.

=== PARKED BY PAOLO 8/3, DO NOT BUILD UNASKED ===
"Maybe we can do more with that but we have so much work." Deeper conversation - real
dialogue beyond the card and the ask - is HIS to raise. Not blocked, not forgotten,
parked. Building it unasked is the STOP PRODUCING violation.

PEOPLE (factions): 8/2 (j) LATEST — THE 268 PEOPLE STOPPED BEING WALLPAPER. Gap 2, the
biggest finding in the research, is built.

Paolo 8/2: "We need to make lots of progress." He had thumbed all 12 gaps WANT and I had
asked him one more time whether the 7/31 faction freeze was lifted. He has now driven
faction work three turns running - THE ASKING WAS THE PROBLEM. Built instead.

=== WHAT SHIPPED ===
1. EVERY PERSON HAS AN ALLEGIANCE, and most people have none. engine/bohemia_agents.js
   factionOf(agent, cell, bases). 30% affiliated, measured at 29.9% over 4,000 agents.
   NOTHING INVENTED: FACTION_ASSIGN (which faction holds which ground) is STILL EMPTY
   because that is his ruling and he has not made it. factionOf reads the bases the
   CALLER supplies, and the loop already seats every faction on real worldMap
   coordinates via bootFactions. Called with no bases every agent is unaffiliated
   exactly as before - that is the zero-regression proof and it is a gate claim.
2. ALL 13 COLOURS AND ALL 14 MARKS ARE IN engine/bohemia_dress.js, copied from HIS
   MFACTIONS table, and the gate re-reads that table out of the alpha every run and
   fails on a one-hex drift. FACTION_VETERAN_KIT still ships empty; that is his.

=== TWO REAL BUGS FOUND BY COUNTING, BOTH INVISIBLE OTHERWISE ===
1. ONE HASH DOING TWO JOBS. The do-they-belong roll and the which-faction pick came off
   the same hash, so the agents who passed the first test were a biased slice of the
   second: ONE FACTION TOOK 63% OF A THREE-WAY SPLIT. Split the draws.
2. THEN 48/40/12, because the shared hash() ENDS ON A MULTIPLY and a multiply only
   propagates bits LEFT - its low bits barely move, so `% 3` off them is lumpy. Added a
   murmur3 finalizer locally. hash() ITSELF WAS NOT TOUCHED: every seeded thing in this
   world derives from it and improving it would reshuffle the entire valley.
3. AND THE ONE THAT MATTERED MOST: agent ids are 'H3-1', 'H8-2' and THEY REPEAT ON EVERY
   BLOCK. Hashing the id alone made every H3-1 in the valley the same faction and
   collapsed the whole population onto a dozen draws. Keyed to agent.seed instead, which
   is unique per (block, house, seat). SAME CLASS OF BUG AS 8/2's "a person is keyed to
   where they live, never to their place in a list" - twice in one day, so the gate now
   asserts no agent id is welded to one faction valley-wide.
LESSON: an even split is not something you can eyeball. Count it or you are guessing.

=== A GATE CLAIM THAT WAS DEFENDING A GAP THAT WAS NEVER A GAP ===
dress_gate asserted "FACTION_LOOK carries exactly his SIX ruled factions (nothing guessed
beyond them)". Right on 7/21, when this file was the only place anybody had looked. The
other seven were in the alpha the whole time. A GATE MUST NEVER OUTRANK A RULING - it now
checks what it was always really for: every entry is HIS, six from the 7/21 clothing
sitting plus seven from his own faction table, nothing else. Stronger than the count was.

=== GATES ===
FACTION MEMBERSHIP (new, registered, 50 claims, 5/5 self-test probes) · dress 43/1 (the 1
is the pre-existing 0-agents red, P-F) · people 152/0 · run people 45/0 · mass edit 30/0 ·
faction dossiers 761/0.

=== WHAT IS STILL NOT DONE ===
Nobody WEARS their faction colour on the surface he plays yet - bohemia_dress is loaded by
the LIFE slice, not by the alpha's RUN. Wiring it into the run touches the RUN lane's
surface, so it is a coordination job, not a solo one. THAT IS THE NEXT VISIBLE STEP and it
is what turns all of this from true into SEEN.
