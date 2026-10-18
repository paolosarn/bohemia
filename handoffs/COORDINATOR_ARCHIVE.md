# COORDINATOR ARCHIVE (rule 96: the blocks older than the lane's two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)

<!-- moved 10/16 (CORRECT: AI and AK (the hearback's NEGATIVE folded in; sweep AK: the trail file's round 2 first, one commit)) -->
COORDINATOR (coordinator): 10/11 (lq) LATEST -- ALL DAY (rule 98, sweep AI): 1 plate: FIGHT BLOCK, HELD AT THE PASS until his moodboard lands (rule 108 ROUND THIRTEEN: nothing is FINAL before it); COOK TWO and COOK FOUR 0-out as sheets, COMBAT TWO 3-out, COOK THREE 3-out, UI 3-out, SOUNDS 5-out; tickets/PLATE_FIGHT_BLOCK.md. | THE LINE IS RESTARTED (rule 94, 10/11 sweep AI): the 10/10 STOP block's cause was written by RUN and the coordinator saw the fix on the throttled phone (every tile once, the reloads were stamp reads, 28.1 MB after the door against 66.6); records/BOHEMIA_THE_STOP_BLOCK_RESTARTED_10_11_26.md; demo cuts take the G-O procedure again (rule 93). NO STOP STANDS. The sweep: records/BOHEMIA_COORDINATOR_ROUND_10_11_26_AI.md. Lanes: write your block BELOW this line, never above it.

COORDINATOR (coordinator): 10/10 (kf) LATEST -- ALL DAY (rule 98, sweep AH): 1 plate all day: FIGHT BLOCK (fired; COOK FOUR 0-out at the line check, COOK TWO 1-out, COOK THREE 3-out, COMBAT TWO 3-out, UI 3-out, SOUNDS 5-out; tickets/PLATE_FIGHT_BLOCK.md). | THE STOP BLOCK (rule 94, read before anything else): STOP (the coordinator, 10/10, the sweep after AG; rule 94, the stop cord): I SAW every city tile file 02 to 09 DOWNLOADED TWICE, 25 more files and 66.6 MB arriving AFTER the door, the demo page RELOADING ITSELF at 76 s, 196 s and 316 s, and BOHEMIA_CURRENT_SLICE.html fetched at 377 s, ON the 4x throttled phone profile loading the committed demo (tools/bohemia_five_minutes.js --throttle 4, build 10/10l) AT 46.5 s to the door and through 377 s. The line is stopped for the demo cut (no G-O, rule 93) and for the demo's loader files (slices/BOHEMIA_DEMO.html's loading, slices/BOHEMIA_CITY_TILES_*.js and their loader, slices/sw.js). Everything else moves. Owner at the station: RUN [ten seconds to play] with PLUMBER [the one stopwatch]; the coordinator stands at the phone before reading any explanation. *** RESTARTED 10/11 (sweep AI, rule 94): the block is kept here for the handoff gate and lives in records/BOHEMIA_THE_STOP_BLOCK_RESTARTED_10_11_26.md; no STOP stands. ***
FIVE WHYS, as far as honestly reached (G = guess): every tile downloads twice. Why? two code paths ask for the same files, a preload list and the tile loader (G). Why two? two lanes each wrote a loader without knowing the other's (G; four lanes, four load numbers is the evidence). Why not know? loading has no owner and no file saying what loads when. Why no owner? lanes are cut by game system and loading is a pipe no lane's name covers. Why not caught? no gate watches what the phone receives; VERIFY ON THE REAL SURFACE has no machine gate.
RESTART when all three are true: the cause (not the symptom) is written under this block; the coordinator or EYES saw the fix on the phone profile with the number; one gate goes red if the double download or the reload returns. Then RESTART (time) is written here and the block moves to a records file.
CAUSE (RUN, 10/10, [ten seconds to play], measured, not guessed): the browser's own network log, served like Pages (the driver's pages + netlog), 400 s of the 10/10l demo at 4x: (1) EVERY TILE FILE CROSSED THE WIRE ONCE, as the city frame's own script; the second copy was the shell's warm-up (__TILE_WARM__) fetching the same files after the city frame already had them (the BEGIN tap's resume path skipped the city-frame check), answered from the cache, 0 bytes on the wire but a 25 MB re-read on the phone's processor; (2) THE PAGE NEVER RELOADED: the build watcher read the demo page to its stamp every two minutes and cancelled (128, 32 and 151 KB on the wire); tools/bohemia_five_minutes.js counts every response at its size on disk, so both read as whole downloads. (3) CURRENT_SLICE.html is the phone's own screen, loaded once the first time the phone is opened (phoneOpen), never twice. FIXED: the warm-up stops the moment there is a city frame (shell and its generator); the demo's watcher reads BOHEMIA_DEMO_STAMP.txt, one line the cut writes, never the page. GATE: NOTHING COMES TWICE 5/0 (no script re-fetch of a loaded file, nothing twice on the wire, the page requested once in 135 s), two mutations red. Waiting on the coordinator or EYES to see it on the phone profile.

COORDINATOR (coordinator-checkin-1y6dtv): 9/5 (bf) LATEST -- *** THE MANAGER'S ROUND:
FRIEND JOBS KILLED, SEVEN LANES SHIPPED, UI CHAT STILL READS VAMILY AS FAMILY, FIVE
PENDING RULINGS DECIDED OR CARRIED. Nothing to judge. ***
Paolo 9/5: "the friend shit... dogshit... I'll leave it the run" -> WHAT-A-FRIEND-DID and
FRIEND-ROUND-ONE graveyarded (law 9/5 sec 1b), HANDS-NOW rewritten, RUN keeps its name.
"let's do a round of VAMILY" -> records/BOHEMIA_COORDINATOR_ROUND_9_5_26.md: what moved
(21 SHIPPED lines across WORLD, LIFE+CITY, RUN, COMBAT, PEOPLE, WORDS, DIRECTION,
ECONOMY, DYNASTY), who has had no round (SOUNDS, ANIMATION, FACTIONS, UI, COOK, EYES AND
EARS, PLUMBER), UI (ui-kmqmrf) at 06:28 today still "VAMILY, which is family" because a
pre-9/4 session never sees the new CLAUDE.md top block; only the primer fixes it. Topped
up CHARACTER 3->6 and DIRECTION 5->8 ([style card] first). Five [PENDING Paolo] lines
carried out of lane handoffs: decided shelves=premise (WORLD [shelves premise]), charging
=both (WORLD [charging exists], the one question to him this round), weights shape (PEOPLE
[weights shape]), repeat interval (FACTIONS [repeat interval]); century-stayed changes a
LOCKED law so it waits for him (WORLD [century stayed]). Board: 167 OPEN, 18 chats. LAST
FEEDBACK RECEIVED: this -> the round. THEN (bg): "I never did that copy and paste to the other
chats... give that to me, this my last mass chat paste" -> VAMILY_PRIMER.md rewritten as v2
with what we know now (18 chats named, pull main first, re-read CLAUDE.md from disk, a
fresh chat is 18 PLUMBER, only CLAIMED/SHIPPED writes, no PRs, two-word reply); the chats
that found the board did it from the new CLAUDE.md top block, not the primer; UI never
saw either. THEN (bh): "why do you keep referring to it as days, yesterday... are you
tweaking?" -> NO CALENDAR TALK, LOCKED: never yesterday/today/tomorrow/overnight/day N to
him; rounds, minutes, hours. CLAUDE.md HOW PAOLO WORKS line, talk-law amendment, VAMILY
front page says a research "day" is a round. Root cause: I read the date off commits. THEN (bi): "do you need batteries to
turn a laptop on?... if it's electricity it's the new currency... gamifying it a little
bit and that's OK... you asked me do groups sell currency... auto-mine batteries, set up
certain buildings and that's just more batteries" -> batteries law sec 4 (LOCKED): money
only, no power meter, nobody sells currency, buildings make batteries on the tick, one a
day each to start, gamified is fine. Charging question WITHDRAWN. WORLD [charging exists]
replaced by [batteries mined]; LIFE+CITY [power buildings]; FACTIONS [power territory];
ECONOMY Q13 [printed money]. THEN (bj), "are you doing big brain research or just
reporting? another round. VAMILY" -> LOCKED: every round carries one research swing
(central-chat law amendment). THE SWEEP: the paste landed; since the last round ten
chats claimed: PLUMBER claimed by plumber-ont6t5 [sixty fps], UI [city feed], DIRECTION
[style card], WORDS Q5, ECONOMY Q5, LIFE+CITY [building costs], COMBAT [fights end],
WORLD [living costs], PEOPLE [demo talks]; LIFE+CITY shipped [buildings produce]
c9504be and resynced the walked city. THE SWING: the generator mafia (Lebanon, Iraq): the
faction that owns a block's generator charges every household monthly by the ampere and
cuts them off; 44% of income. Record: records/BOHEMIA_COORDINATOR_RESEARCH_THE_GENERATOR_
MAFIA_9_5_26.md. Routed: FACTIONS [block rent], WORLD [own power], ECONOMY Q14 [rent
share], WORDS Q16 [cut off]. THEN (bk): "you're not being creative and being your own
person... you go on the deep end until I say something else, I don't like that
relationship" -> LOCKED: THE MANAGER HAS HIS OWN MIND (central-chat law amendment).
records/BOHEMIA_THE_MANAGERS_OWN_MIND_9_5_26.md: my own five, on the board as jobs: RUN
[animal first] [death handoff], SOUNDS [heartbeat first], FACTIONS [crossing costs],
WORLD [rice clock]; and two "needs Paolo" lines decided with defaults: COMBAT [hurt
death], PEOPLE [heir moment] (marriage stays his). THEN (bl) "awesome good ideas man.
VAMILY" -> ROUND: since last round RUN shipped [hands now] (5faf227: the demo loads in
572 ms, a walked world in 1.7 s, zero errors, byte-identical to a fresh cut, a gate opens
it like a stranger); LIFE+CITY shipped [building costs]; DIRECTION shipped [style card]
and [builder references]; ECONOMY Q5, WORDS Q5; WORLD [living costs] round 1 (the day
eats food); DYNASTY claimed Q3 [heir keeps]; the FACTIONS chat, still reading VAMILY as
family before the paste, BUILT THE GENERATION FOLD in the DIRECT tab (60c9b44), real
work. SWING: the heir pays (records/BOHEMIA_COORDINATOR_RESEARCH_THE_HEIR_PAYS_9_5_26.md):
formal law kills debt with the estate; informal economies pass it to the child; my
"every debt in full" default stands with its reason. Routed WORLD [debt carried],
FACTIONS [collector heir], DYNASTY Q11 [what carries]. THEN (bm) HE PLAYED IT: "where the
enemies at bro" -> the biggest hole in the game, measured not guessed: every hostile/enemy
string in the alpha, city and demo is PROSE; hostility lives in engine/bohemia_between.js
as a SIGN ON A RELATIONSHIP (they charge you more, they watch you) and never as a body;
roadInterrupt still has one caller inside MODE==='city'. The game knows who your enemies
are and has never put one in front of you. Record: records/BOHEMIA_RULING_WHERE_THE_
ENEMIES_AT_9_5_26.md. Routed to the TOP of four lanes: RUN [enemies exist], COMBAT
[street fight], PEOPLE [who is hostile], and my own UI [danger visible]. THEN (bn) VAMILY:
THE ENEMIES GOT BUILT IN ONE ROUND. Main moved ~40 commits: RUN [enemies exist] bb2057ba
(people on the street who mean it), COMBAT [street fight] f5725324 + the crew seam d18f2444
+ THE FIGHT IS THE ROOM 86461153, SOUNDS [heartbeat first] e107ee21 and [district sound]
128bd48d, COOK 18 shapes/40 garments ee859169, WORLD [living costs] 5b613035 and [lights
bill] 94ca5707, LIFE+CITY housing 24eb078a and build-where-you-stand 9ddef52c, UI [city
feed] 9d1a2b14, ANIMATION the 105-clip audit + the valley keeps breathing 80370280,
EYES E3 6c584c68, DIRECTION judge-every-batch, ECONOMY Q6+Q7, WORDS Q8, DYNASTY Q4+Q5.
THE SEAM I RULED: UI shipped the danger tell with NOTHING TO POINT AT because
FACTION_ASSIGN is empty and marked needs-Paolo; that emptiness blocked four jobs, and he
already ruled "each part of Vegas is owned by a faction" on 9/4. DECIDED, mine:
records/BOHEMIA_RULING_WHO_HOLDS_WHAT_9_5_26.md -- every district has an owner, derived
from act1_power and district worth, borders follow a visible landmark (real gang borders
run on highways and rail), the edge is painted in the holder's colour, act3_power redraws
it. Routed FACTIONS [who holds] (top of lane) and COOK [border marked]. THEN (bo) "how's
combat gonna work from overworld to combat... whole overworld change or a transition?"
-> answered from the build, not theory (records/BOHEMIA_HOW_THE_FIGHT_BEGINS_9_5_26.md):
the walked world does NOT change scale, the house tile is a COMBAT-BOARD dial only
(COMBAT tab DEMO SETTINGS), and the transition already exists and is PLACE-BASED -- a
street bump builds a STREET board where you stood, a front door builds THAT ROOM with
real walls as cover and starts you at the door. The only unbuilt part is what he SEES in
the half second, which is a genuine fork with no default, so it went to him as A/B/C
(A camera pulls back over the same ground, recommended; B hard cut; C no transition).
Routed COMBAT [enter zoom], top of lane. THEN (bp) VAMILY: 53 real commits on main since
my last round -- RUN [street encounters] and [debts named] (the reckoning card names who
you let down), PEOPLE [outfits nearby], CHARACTER [hair sheet] eight facings, UI [settings
pause] and [one number], FACTIONS [held ground] EVERY BLOCK HAS A NAME ON IT and [faction
towns], LIFE+CITY the feed stream, SOUNDS' census that PLAYS the game instead of grepping
(nine of sixty-five, and it proved a grep cannot answer the question), PLUMBER [sixty fps]
round 2, COOK batches 5-6, DIRECTION patrol ratchet 42%, ECONOMY Q10, WORDS Q11, DYNASTY
Q8+Q9. DIRECTION HIT ZERO OPEN and SOUNDS hit one, so the queue-never-dry rule fired:
topped up DIRECTION 0->5, SOUNDS 1->4, ANIMATION 3->6, LIFE+CITY 4->6, UI 5->7, CHARACTER
5->6, ECONOMY 4->6, DYNASTY 4->5. SWING: the first fight is the only tutorial we get
(records/BOHEMIA_COORDINATOR_RESEARCH_THE_FIRST_FIGHT_TEACHES_9_6_26.md) -- one lesson per
encounter, the obstacle must be impassable without the thing taught, so the first fight
teaches THE BEAT ALONE. Routed COMBAT [first fight] (top), SOUNDS [beat teaches], UI [no
text box]. THEN (bq) HE PICKED: "Yes definitely and the map will zoom out nicely maybe a
cloud opacity somewhere" -> OPTION A, THE CAMERA PULLS BACK, LOCKED, plus HIS OWN detail,
a cloud opacity across the turn so the scale change reads as weather and not a load.
Written into laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md
section 5. COMBAT [enter zoom] rewritten with the ruling; new ANIMATION [cloud turn] and
DIRECTION [cloud look]. No open question to him now. THEN (br) VAMILY: a small round on
main (9 commits) -- SOUNDS [day ends] THE DAY ENDS ON YOU (the most repeated moment in a
hundred-hour game was silent), DIRECTION [judge enemies] round 1, EYES E1 (the craft
machine reads 5.7% of the art), PLUMBER [sixty fps] round 3, ECONOMY Q12, WORDS Q13,
DYNASTY Q11. MY OWN CALL THIS ROUND, THE HARVEST (records/BOHEMIA_THE_HARVEST_9_6_26.md,
law amendment in laws/BOHEMIA_ADDENDUM_RESEARCH_LANES_9_4_26.md): the research bank had
36 records and THIS SEAT had never routed one into a build job. Standing rule now: every
research round I read becomes a build job the same round or a written reason. First
harvest, five findings: LIFE+CITY [build default] (the first building a player places is
an AIRBASE -- 59 types alphabetical, no default), WORLD [someone lends] (the courthouse
was built and no loan was ever issued), WORLD [back of house] (no dry store, laundry or
loading dock exists anywhere), WORLD [water lifted] (Vegas is 1,000 ft above its water;
pumping is the scarcity), WORLD [battery worth] (you buy the container, 889x the energy),
PEOPLE [rumours travel] (the city gossips about nobody but the player and has never once
been wrong). Topped up SOUNDS, ECONOMY, DYNASTY. NOTED: FACTIONS holds 12 open, 0 shipped,
and owns [who holds] which unblocks four lanes -- the one bottleneck on the board. THEN (bs) VAMILY: 43 commits, and FACTIONS UNBLOCKED
ITSELF -- [faction homes] shipped after a long fight (arc gate 29 red -> 101/0, the seat
bake was one-shot so the walked city had been carrying last week's capitals). RUN shipped
[title screen], [auto walk] and [first teaching]; LIFE+CITY shipped AN ADDRESS IS A FRONT
DOOR; COOK [runway hair]; PLUMBER [slim build] round 1 (a third of what we publish cannot
be opened from the game); FACTIONS [enemies unite] THE WORLD DOES NOT GET STRONGER IT GETS
ORGANISED; ECONOMY Q13, WORDS Q14, DYNASTY Q12, EYES E6. *** THE FINDING OF THE ROUND:
DIRECTION judged the hostiles in the shipped alpha at phone size and all three questions
came back NO -- two enemies at WAR rank 3 in frame, and THEY ARE THE CROWD. Paolo asked
"where the enemies at", we put them there, and he still cannot see them. *** SWING:
records/BOHEMIA_COORDINATOR_RESEARCH_WHY_YOU_CANNOT_SEE_THEM_9_6_26.md -- pop-out comes
from FEATURE CONTRAST, not the feature, and motion is its own free channel. Our planned
fix (hostiles wear the faction colour) would have made them INVISIBLE in their own
faction's block. New rule: motion first (they walk AT you), then one value step from the
LOCAL crowd measured in the frame, then silhouette, never a health bar. Routed ANIMATION
[walks at you] (top), CHARACTER [stands out] (top), DIRECTION [contrast rule], EYES E10
[find them], plus RUN [drop in] and [day one], WORDS Q17 [rumour words]. THEN (bt) VAMILY: small round,
7 commits -- RUN [real ending] (measured first: the ending is already built), DIRECTION
THE TERRITORY LOOK CARD, DYNASTY [what carries], EYES E7. TWO THINGS CAME BACK AT ME.
(1) DYNASTY's carry research reads as contradicting my 9/5 "every debt in full" ruling and
does NOT: it says debt stops inheriting only because a court stops it, and we have no
courts, so ours is "what the law exists to prevent, running where the law is gone" -- a
stronger reason than I gave. It DID correct the form: you do not inherit a bill, you
inherit THE PEOPLE HE OWED. Adopted; routed PEOPLE [creditor stands] and WORLD [fold
carries]. (2) EYES E7's score sheet found the act-1 re-cook at a median 0.16x the colour
density of the art Paolo APPROVED, sidewalks 0.03x, colour density failing 32 of 42, and
ten tiles lit from a different corner than the ones they replaced -- and texture_match_gate
found the same shape months ago from another direction. SWING: records/BOHEMIA_COORDINATOR_
RESEARCH_TOO_CLEAN_TO_BE_REAL_9_6_26.md (material reads as material because of irregular
noise; vary hue between neighbouring values, not just brightness; an even tile announces
itself). Routed DIRECTION [density ruling] (top) and COOK [light agrees] (top). Not a
question for him: he ruled the principle on 9/4 and froze the fleet over it on 7/26. THEN (bu) VAMILY: 23
commits -- COMBAT [first fight] SHIPPED exactly as ruled (one man, a street, zero cover, no
companion, no words, and every other lesson kept out on purpose), FACTIONS [who holds]
SHIPPED with borders following something visible 65.7% -> 100%, WORLD [shelves premise] (the
valley runs out whether or not you look at it), PEOPLE [former jobs] (nobody in this valley
used to be anybody, and now they do) plus a dead organ deleted the round the sweep found it,
UI [phone readable] (text size, less motion, the last 34px button, factions measured for
colour blindness), SOUNDS closed THE-OTHER-51 (every sound accounted for), COOK [runway
hair], ECONOMY Q14, WORDS Q15. *** THE MEASUREMENT THAT REORDERS THE BOARD: PLUMBER
profiled a beat for the first time. Walking spends 229 ms of every 500; A FIGHT SPENDS 497
OF 500, 99.5% of the main thread, two thirds of it in drawImage alone. And 15 ms of every
beat animates a HIDDEN ZERO-BY-ZERO PANEL at 60 fps before any fight has happened. *** MY
CALL, a NARROW freeze (records/BOHEMIA_COORDINATOR_THE_FIGHT_HAS_NO_HEADROOM_9_6_26.md):
every lane keeps building, but nothing new enters the FIGHT LOOP without its cost in ms per
beat until headroom exists; explicitly NOT the 7/26 art freeze. Swing: the drawImage wall is
per CALL not per pixel -- cut call count, pre-render to offscreen and blit whole, layer the
canvases, never scale inside drawImage, round the coordinates. Routed PLUMBER [fight
headroom] (top), COMBAT [draw budget] (top), ANIMATION [cheap cloud]. THEN (bv) "is the
art direction and art cook always working together?" -> MEASURED, and the honest answer is
yes with one gap: the pipeline is real (DIRECTION writes the card, COOK cooks to it,
DIRECTION patrols and judges, CHARACTER wires what passes -- batches 1-4 wired at canon
280->320, batch 5 judged and passed, the card gate went red on arrival exactly as designed,
DIRECTION currently holds [density ruling] which is judging COOK's re-cook). THE GAP: the
ratchet is FORWARD-ONLY at 127/301 garments, so 174 older pieces have never been judged at
all, and EYES' colour-density drift lives in exactly that unjudged half. Routed DIRECTION
[judge the old] (top of lane): judge the backlog oldest-first on the same patrol schedule
until the ratchet reads 100%. THEN (bw) VAMILY: 30 commits -- ANIMATION [walks at you]
SHIPPED (the hostiles were STILLER than the crowd and "they are coming" was a teleport),
CHARACTER [stands out] round 1 (nothing about how a body looks had ever asked whether that
body is your enemy), FACTIONS [hidden factions] (four factions reachable by 0 of 5148 and
now all four can be heard), SOUNDS THE ROOM HAS ITS OWN SONG (82 canon songs played
NOWHERE, they play indoors now), PLUMBER [suite runs] 44.2 min -> 33.8, LIFE+CITY A BEARING
IS A PLACE, RUN [real ending] (its gate read the wrong build), EYES E5, ECONOMY Q15, WORDS
Q16, DYNASTY [heir plays], COOK [runway hair] answered. MY OWN CALL: six incidents in one
day were ALL THE SAME DEFECT and no lane saw it -- the one-shot seat bake, HIS FACTION
COLOURS LOCKED INSIDE A BROWSER while three lanes sat blocked on them, the five-garment
stale bank, a merge silently dropping batch 5, cityRoom written and read by nothing, the
hand-cut demo. New law: laws/BOHEMIA_LAW_NOTHING_IS_BAKED_ONCE_9_6_26.md -- anything
derived is derived every run or a machine proves the copy matches its source, and A RULING
OF HIS THAT LIVES ONLY AS PIXELS IS NOT RECORDED. Routed PLUMBER [nothing baked], EYES E11
[pixels only] and E12 [silence standing], UI [colour reaches]; topped up DYNASTY and
ECONOMY. THEN (bx) "eyes and ears gotta still be going to school bro... each request
becomes a round of online research for that topic before it does it, so maybe eyes and ears
takes 2 rounds" -> LOCKED. That lane's MODE is now SCHOOL THEN CHECK: every job is TWO
rounds, round one is pure online research on that job's topic with NO measuring, round two
builds and runs the instrument and must name which finding from school changed the method.
A job SHIPPED without both rounds is not shipped. Written into VAMILY's EYES section and
laws/BOHEMIA_ADDENDUM_EYES_AND_EARS_9_4_26.md, with the lane's own evidence for why he is
right (E4's grep count was wrong twice because a run-time-assembled name is invisible to
any text search; E7 only found the density drift after learning what density is).
THEN (by) "oh and same thing for words bro" -> WORDS is now MODE: SCHOOL THEN WRITE, the
same two-round shape: round one is pure study of the question's subject with NO test lines
written, round two writes the lines and must name which finding from school changed them.
Law amendment in laws/BOHEMIA_ADDENDUM_RESEARCH_LANES_9_4_26.md, which now also names the
three research modes (plain RESEARCH for ECONOMY and DYNASTY, SCHOOL THEN WRITE for WORDS,
SCHOOL THEN CHECK for EYES AND EARS) and says only Paolo moves a lane between them. THEN (bz) VAMILY: only 2 commits, both claims
(UI [crisis warning], FACTIONS [light owners]) -- the fleet is mid-work with 13 jobs claimed
across the lanes, so the sweep is thin by construction. MY OWN CALL THIS ROUND: THE REASON
QUESTS WAS PARKED HAS EXPIRED (records/BOHEMIA_COORDINATOR_THE_PARK_HAS_EXPIRED_9_6_26.md).
He parked it 9/4 because he could not walk a quest well enough to judge it; since then the
street, the title, the first teaching, hostile bodies, the fight where you stand, the room
fight, held ground with visible borders, former jobs, standing, outfits, money that bites,
the fold and the feed have ALL shipped. Went to him as a three-way fork (A the 60-boss
spine only, 53 of 60 already wired; B the systems do the asking, no quest written, which
is what the research points at and what our unusually many live systems are ready for; C
stay parked). MY PICK B WITH A'S SPINE AS THE MAIN LINE, but the shape of the game's main
content is the biggest creative fork left and it is his. ALSO FLAGGED ON THE BOARD: PLUMBER
holds FIVE claimed jobs at once against the one-at-a-time rule; [fight headroom] is the one
that matters. THEN (ca) VAMILY: 19 commits and SCHOOL MODE LANDED IMMEDIATELY -- WORDS
re-ran Q1 as ROUND ONE: SCHOOL ("why three lines cannot carry a fingerprint"), EYES E9's
standing duty caught a regression on its first day. Also COOK [border marked] (the border
wears its colour where he walks), UI [crisis warning] (the valley tells you it is running
out WHILE you play, not only at bedtime), FACTIONS [light owners] (a sentence in his own
canon had already named the grid's owner: the Network), PLUMBER [fight headroom] round 2,
RUN [drop in] (all three first-minute nudges are control labels), DIRECTION ruled the fight
transition look ahead of the build, ECONOMY Q17, DYNASTY Q15. *** I DECIDED QUESTS. He
answered last round's three-way fork with VAMILY, which means go, and EVERYTHING IS A THUMB
says decide and let him correct by playing, so re-asking would have rebuilt the verdict
queue he killed. QUESTS IS UNPARKED, shape B with A's spine: the sixty-boss ladder is the
main line, everything else is asked for by the systems, no ask introduces a new verb.
THE GATE-ABLE RULE, from research done against my own pick: generated quests read as filler
for exactly one reason, that finishing one changes nothing visible, so AN ASK THAT CHANGES
NOTHING VISIBLE IS NOT AN ASK. Record: records/BOHEMIA_RULING_QUESTS_ARE_UNPARKED_9_6_26.md.
Routed QUESTS [asks exist] and [spine first], WORLD [visible change]. ***
THEN (cb) TWO ORDERS: "for the run right now make all the UI 50% smaller, I don't give a
fuck" and "I need a fast travel system extremely similar to Battle Brothers, I really need
that, because the whole encounter system with groups of enemies is going to be in there,
and chance encounters." BOTH LOCKED, record: records/BOHEMIA_RULING_HALF_SIZE_UI_AND_THE_
TRAVEL_MAP_9_6_26.md. UI [half size] top of lane: everything on the walked surface at 50%,
no proposal, no comparison, the ONLY survivor is the 44 px touch area (drawn half, reach
unchanged). RUN [travel map] top of lane: not a teleport menu -- in his reference travel IS
the encounter system, which is why he needs it, since the group fights have nowhere to come
from. Researched the reference's own dev material: one map in pausable real time, fog with
a sight circle, terrain that hides parties, night that slows travel and shrinks sight,
tracks that differ by faction, pursuit decided by relative strength, line of sight as the
escape, camp fires that attract company, parties bought and sent by places with agendas.
Also routed WORLD [parties move] and COMBAT [contact fight]. The 9/5 one-department law
holds: BB is the campaign layer only, nothing touches RF4 on the beat.
THEN (cc) THREE MORE ORDERS, LOCKED (records/BOHEMIA_RULING_ZOOM_IS_THE_NAVIGATION_9_6_26.md):
"I don't even want a button for city and map, you have them wired all wrong, how you get to
the cities is zooming out" -> CITY and MAP stop being places you GO and become how far you
stand back; one continuous zoom, street to city to valley and back to where you were; kill
data-p="city" and data-p="map" as game buttons (workshop tabs not in scope); and THE ACTION
BUTTON IS NOT A ZOOM BUTTON -- he watched a tutorial try to relabel it and rejected exactly
that. "The game must explain that very well in the tutorial" -> RUN [zoom teaches], the
first and unfumbleable lesson. "Have the tutorial pop-up after the other pop-up, do you
wanna skip the tutorial or have the tutorial" -> UI [tutorial ask], two choices, no third.
AND I AMENDED MY OWN [no text box] ROW so the lanes do not fight: that rule is the FIGHT
only; an offered tutorial the player chose is not what it bans.
THEN (cd) VAMILY: one commit (DIRECTION [contrast rule] shipped) -- he is typing VAMILY
back to back so there is little to sweep. DYNASTY'S QUEUE WAS EMPTY, refilled. HARVEST TWO
(records/BOHEMIA_HARVEST_TWO_A_HUNDRED_HOURS_IN_FIVE_MINUTE_BITES_9_6_26.md), two findings
from their bank: (1) a mobile session is 5-6 MINUTES, four a day, day-7 retention 3.4-3.9%,
so we are building a hundred-hour game for somebody who plays five minutes at a time and is
96% likely gone by the end of the week -- not an argument against the hundred hours, it
decides their SHAPE; routed RUN [five minutes] and UI [where was i]. (2) NOTHING IN THIS
GAME CAN BE FORGIVEN: they searched the standing web, deeds and dynasty for forgive,
settle, absolve, pardon, spare, redeem and found ZERO; every function gets a deed INTO the
world and nothing resolves one, so standing is a one-way ratchet toward being hated and
generation three is an ANGEL who cannot forgive anything; routed PEOPLE [make it right],
top of lane. Also topped up DYNASTY (empty), ECONOMY, EYES (E13 half-size check, school
first) and DIRECTION [small and clear].
THEN (ce) VAMILY: 7 commits -- FACTIONS [enemies unite] A COALITION YOU CAN MEET (formed()
had one caller and it was a card), and DIRECTION [first look] judged the PUBLIC DEMO'S
first screen as a picture: the promise shows NO WORLD (a logo on a void while we own a
living street), the workshop build stamp leaks into a stranger's first second and reads as
debug text, and ONE TAP IN TWO MODALS STACK (the cutscene offer and the DAY panel). Since
Paolo ordered a THIRD pop-up the same round (tutorial or skip) and nobody owned the ORDER,
I ruled it: records/BOHEMIA_RULING_THE_FIRST_SIXTY_SECONDS_9_6_26.md -- NEVER TWO QUESTIONS
AT ONCE; the order is the door (living street under the plate, no stamp in the demo cut),
the cold open offered, the tutorial offered exactly where he put it, then the game, and THE
DAY PANEL IS NOT A MODAL. Anything a lane wants to add to the opening comes through this
seat. Routed RUN [one question] and [first world], PLUMBER [stamp stripped].
THEN (cf) A BIG UI RULING, LOCKED (laws/BOHEMIA_LAW_THE_UI_HAS_THREE_ACTS_9_6_26.md):
"every time I say VAMILY to the UI chat I need to be seeing some sort of creation... we are
not even 10% there, so it should not be implementing so much, focusing on code-wise where
things go... everything has to be interchangeable with the new look... three different acts
of UI... maybe one is Fallout 1 inspired, 2050 rustic... the middle modern, the third
futuristic... I need to keep seeing options." So: EVERY UI ROUND ENDS WITH A PICTURE HE CAN
OPEN, three to five DIFFERENT options, never one candidate, never a plan instead of a
picture. STOP PLUMBING except the one required piece: every element draws from a SKIN so
swapping the skin swaps the interface, which is what makes three acts possible instead of
three rewrites. FALLOUT 1 enters the reference set 9/6, INTERFACE department only (CLAUDE.md
updated); researched what it actually is (an in-world object, deliberately clunky, "not all
that dependable" because the world was not quite working) so nobody copies a green screen,
and flagged that HIS phrase "2050 rustic" is the harder half nobody has drawn: our own era's
technology worn down and hand-repaired, not a 1950s idea of the future. Routed UI [three
acts], [skin swap], [show options] as a standing duty, and DIRECTION [act cards].
THEN (cg) VAMILY: quiet on main (2 commits) but SCHOOL MODE PAID OFF THE ROUND AFTER HE
ORDERED IT -- WORDS Q2's schooled round INVERTED its own earlier answer: of 158 measured
deception cues 118 show no association at all, pauses among them by name, and people catch
only 47% of lies, so THE LIAR IS BELIEVED. The bank now has the liar as the most fluent
person in the scene and the FRIGHTENED man as the one who stumbles; the unschooled 9/4
round had it backwards. HARVEST THREE (records/BOHEMIA_HARVEST_THREE_NOTHING_IN_HIS_MOUTH_
IS_A_TELL_9_6_26.md): the sentence "what exposes him is a fence the player can walk to,
nothing in his mouth is a tell" is a GAME rule, not a writing note -- you catch a liar by
walking to the thing, never by a highlighted option or a roll, and our world already keeps
every fence (gossip hops, deeds that fade, faction tracks, lights with owners, blocks with
owners, shelves that empty, debts with a lender's name). Routed QUESTS [check the claim],
PEOPLE [fluent liar] (top), UI [what you know], FACTIONS [tracks read], LIFE+CITY [shelves
seen]. Topped up ECONOMY, DYNASTY, WORDS. NOTED: DIRECTION is now holding FIVE claimed and
one open, the same one-at-a-time violation PLUMBER has.
THEN (ch) VAMILY: 3 commits, and ECONOMY round 20 is the harvest of the round --
EVERYBODY IN THE VALLEY HAS A JOB EXCEPT THE PLAYER, measured in our own code: every NPC
works a seven-hour day (worker 448 min, scav 371, watch 413, keeper 101) with acts errand/
free/home/scav/sleep/watch/work, while the PLAYER's acts are walk/talk/fight/build/buy/
sleep -- THERE IS NO PLAYER ACT CALLED WORK. And the money vocabulary agrees: three of the
four verbs are SPENDING, one is earning, none is work. Record: records/BOHEMIA_HARVEST_
FOUR_EVERYBODY_WORKS_EXCEPT_THE_PLAYER_9_6_26.md. It is also the missing half of his
batteries ruling (today you either spend, or a building mines while you sleep) and the
missing shape of the five-minute session (a shift IS that unit). Swing: the known failure
of passive income is that it makes hand-work pointless -- early hours must be active, the
player's role must CHANGE rather than end when automation arrives, and away-earnings must
be capped. So I amended WORLD [batteries mined] in place: WORK COMES FIRST, buildings
second, and away-earnings capped; his ruling stands as given, this is only which one a
player meets first. Routed WORLD [a days work] (top), RUN [a shift], PEOPLE [somebody
hires you]. THEN (ci) HE ASKED MY OPINION AND A PERCENTAGE: told him about 15%, from
systems ~40% built, what a player can do and feel ~10%, story ~5%, looks and speed ~5%,
and that the five-minute loop (work, pay, walk, fight, return) is what moves it. THEN (cj)
VAMILY: 2 commits (WORDS Q3 school: the first repeat is a feature; the bark index has no
memory). SWING: THE BEAT ON A PHONE (records/BOHEMIA_COORDINATOR_RESEARCH_THE_BEAT_ON_A_
PHONE_9_6_26.md) -- combat is a timing judgement at 120 BPM and NOTHING in ~500 gates
measures touch-to-sound latency on iOS Safari; known figures are three quarters of a second
on the audio tag and ~1,500 ms on Web Audio after a backgrounded tab wakes. If the beat he
hears is late, the first fight teaches the wrong beat. Routed PLUMBER [beat latency],
SOUNDS [scheduled beat], EYES E14 [late beat]. OWN CALL: DIRECTION at six claimed and one
open is structural -- every cook waits on a human -- so EYES E15 [machine judges] builds
the pre-pass and DIRECTION rules only on what a machine cannot. Topped up ECONOMY, DYNASTY.
THEN (ck) "what blind spots might I be having? VAMILY" -> records/BOHEMIA_HIS_BLIND_SPOTS_
THE_PERSON_NOT_THE_BOARD_9_6_26.md, seven, plainly: he plays less than he types the word
(one play found what 500 checkers missed); he rules on what he saw last and never on what
he has not opened; he kills a method and the question dies with it; he has never said what
the game SOUNDS like; everything is a thumb and he thumbs nothing (DIRECTION judged 127
garments for him, he judged zero); he polishes a 15% game; he sees 18 chats through one.
Standing rule added to the central-chat law: every round names ONE shipped thing he has
never opened, with the tab. Routed EYES E16 [never opened]; SOUNDS [his sound] as the one
question to him. Sweep: 0 commits on main since the last round.
THEN (cl) HE ANSWERED THE SOUND: "post-apocalyptic Final Fantasy X, especially that fantasy
beach vibe, it was so good" -> LOCKED, laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26
.md. FFX is now the SOUND reference as well as the interface one, by his word (the
one-department law amended by him, CLAUDE.md updated). Researched what that music IS so the
lane cooks to it and does not copy it (three composers; the island theme is Hamauzu's, a
patient picked melody over a soft beat with real violin and hand percussion; the remaster
lost fans by shortening it, starting the beat sooner and cutting the bass line, which says
what people loved). "Post-apocalyptic" is the hard half, same as "2050 rustic": keep the
warmth, let the world wear it, under the 120 BPM the fight keeps. SOUNDS [his sound]
resolved into SOUNDS [sound card], top of lane: the card, the one song he likes as the
anchor, every song he owns sorted by distance from it.
THEN (cm) VAMILY, 14 commits: *** QUESTS [main story] -- THE GAME HAS A MAIN STORY NOW AND
IT DID NOT BEFORE: 53 quest design docs and 27 side quests existed and NOT ONE main-quest
file; act 1 is five playable .bq files, every beat traced by a gate to his locked story
files, the round after I unparked the lane. *** COMBAT [contact fight] shipped. UI [half
size]: the halving is done, looks right, and BREAKS TAPPING (real taps 2 of 11 vs the
in-page test's 12 of 12 -- the instruments lied and the lane caught it), NOT shipped, and
the lane did exactly what the new law says: a five-size options sheet where option D is the
same half size spread so a 44 px thumb fits. DECIDED D on the board, correct-after; it IS
his order. PLUMBER [fight headroom] round 4 withdrew its own "under 400" (a quiet fight;
a DRIVEN fight is 413.5 median, target not met, and the correction is the deliverable).
EYES E11 round two: reference_check_gate DOES NOT EXIST while CLAUDE.md advertised it as
the gate for a LOCKED law -- CLAUDE.md now says OWED, routed PLUMBER [gate missing] (second
after headroom); 29 engine modules have no reader (PLUMBER [dead modules]); faction colours
ARE live and WORLD's STATE said otherwise (fixed); none of his sound approvals were lost
(superseded, not stranded); 285 of 428 laws named by no checker (a ceiling). EYES' own
staleness gate went red fleet-wide in a minute and was loosened to 1% the same round. COOK
[combat ground] round 1, LIFE+CITY two rounds, ECONOMY Q22 (the first lie is a cliff).
ONE THING HE HAS NEVER OPENED, this round: the generation fold, DIRECT tab, FOLD A
GENERATION. Board 146 open.
THEN (cn) "look at this song bro" with a screenshot: FINAL FANTASY X OST, BESAID ISLAND
(original, Hamauzu). NOTES ARE RULINGS: that is THE ANCHOR, written into the sound law
section 6 and onto SOUNDS [sound card]; nobody hunts for it any more. The brief off his
picture: "would you live here?" -- a place you would want to live, after the world ended.
Said plainly that this seat cannot listen to audio; the lane compares by ear and number.
THEN (co) VAMILY, 15 commits: *** PEOPLE [make it right] SHIPPED -- a deed can be settled,
the person wronged decides, no valley-wide absolution, no clearing your own name. *** PEOPLE
[family events]: three things now write to the family tree (runDynasty/selectHeir/family.
tree were 0 in the alpha, city and demo). THE DEFECT OF THE ROUND: PEOPLE asked the suite
for its newest gate and got "0 of 542 GATES" -- not red, nothing -- then found SIX shipped
jobs whose green gates the suite had never run once. That is one lane of eighteen. New law:
laws/BOHEMIA_LAW_A_GATE_THAT_NEVER_RUNS_IS_NOT_A_GATE_9_7_26.md (suite red on zero,
registration derived, every lane self-sweeps); routed PLUMBER [unregistered gates] second
after headroom. COOK [combat ground] round 2: the cover you see is smaller than the cover
you get -> COMBAT [cover honest]. EYES E12 school: real quiet has a floor, a dead city is
only 5-7 dB quieter than a live one -> SOUNDS [quiet floor]. ECONOMY Q23 (the order is
about earning, not surviving); topped ECONOMY up. ONE THING HE HAS NEVER OPENED: walk
through a front door and fight in the room, RUN tab.
THEN (cp) VAMILY: ZERO commits on main, so the round is mine. Swept every line still
marked needs-Paolo and decided four with defaults (records/BOHEMIA_COORDINATOR_RESEARCH_THE
_COMPANION_9_7_26.md): [walking companion] -- ROSA walks the street now under the draft name
draft:true, wants something of her own already in the world (owes or is owed), refuses one
thing from her standing, talks rarely and never on a fight beat, never blocks a door (the
research: competence is the floor, interruption is what gets a companion hated, a companion
who only responds is furniture, one who wants something is alive); [sixty bosses] -- audit
the 53 verbs now, the seven missing ship as draft:true attempts; [look verdict] x2 -- he
does not thumb, so DIRECTION judges round 7 against the card; [strip ruling] -- build it as
BACK OF HOUSE, where people work, not a prize. KEPT FOR HIM because they are canon: [act
two] who dies next (this round's one question) and [century stayed] (a LOCKED law). ONE
THING HE HAS NEVER OPENED: the reckoning card at nightfall, RUN tab, it names who you let
down and who is expecting you tomorrow.
THEN (cq) VAMILY: 3 commits, all claims (COMBAT [draw budget], LIFE+CITY [build default],
ECONOMY Q24). LIFE+CITY's POPULATION-DEFAULT had gone "blocked on a ruling" (one meeting
per 400-step walk needs ~655 people in range, there are 61; GDD says 69,000, the walked
valley holds 5,940) -- a number, so DECIDED: the ship test is met by DENSITY not headcount,
people placed where the player is, the street never empty in daylight. SWING: HOW LONG IS A
DAY (records/BOHEMIA_COORDINATOR_RESEARCH_HOW_LONG_IS_A_DAY_9_7_26.md): a day is 1,440
game minutes, a step 0.084, standing still is free, and NOBODY has measured game minutes per
real minute, so nobody can say how many days a hundred hours holds or whether three
generations fit; the craft's answer is ~15 real minutes a day (a day is a decision) vs real
time (leave without fear), and we need both. Routed PLUMBER [clock math], RUN [a day is]
(a dial, default fifteen), DYNASTY [days per life]. Carrying [act two] who dies next; not
re-asked this round.
THEN (cr) HE PLAYED AND SENT A FRAME (records/target/PAOLO_THE_CAR_IS_ASS_9_7_26.jpg): "this is
ass, is that the car model, c'mon bro" -> the wrecked car is a squashed photo texture ON a
brick wall beside a six-tone pixel body; KILLED, re-cook to the card on the ground, DIRECTION
judges beside a real car and beside the body (records/BOHEMIA_RULING_THE_CAR_IS_ASS_AND_TAP_
TO_WALK_9_7_26.md). And "I should be able to click as well: tap the tile I want to walk on,
it shows footprints so you see you're about to walk there, and it still goes to the BPM,
very important" -> LOCKED: tap-to-walk with ghost footprints first, one step per beat at
120, the pad stays. Routed COOK [car recook] (top), DIRECTION [judge the car], RUN [tap
walk] (top), UI [footprints] (options sheet), ANIMATION [beat steps].
THEN (cs) he answered ONE of the five: "No real animals bro. Animalistic era of act 1, the
vibes, not actual animals." -> LOCKED, laws/BOHEMIA_ADDENDUM_ANIMAL_IS_AN_ERA_NOT_AN_ANIMAL_
9_7_26.md. I had read "Gen 1 Animal" literally; the story master (7/19, THE THREE ACTS)
already said Animal/Human/Angel are the three ERAS, and DYNASTY's rounds 1-2 and CHARACTER
[animal rig] were built on my misreading. Root cause: nobody re-read the story master before
building on its vocabulary. RUN [animal first] DEAD with post-mortem; CHARACTER [animal rig]
re-aimed to [wildlife rig]; DYNASTY STATE corrected; routed DYNASTY [animal era], WORDS [no
law talk], COMBAT [era fights]; CLAUDE.md pillars say "ERAS, not creatures". He also said
the rough draft of all the acts exists and he has not thought about it in some time: it is
laws/BOHEMIA_STORY_MASTER_7_18_26.md plus the act addenda; presented to him in plain words
this reply. Four of the five letters still open (century, act two, coats, her name).
THEN (ct) "Keep the cap." -> the 10% long-coat cap STAYS, reaffirmed on the trenchcoat law
(8/27) and marked settled on the runway law (9/4); COOK header note. Three letters open:
century, act two, her name.
THEN (cu) "I don't know about the companion right now, have it on shuffle mode." -> no fixed
companion, no fixed name: drawn from the people already around you who would plausibly
follow, shuffled per save, named from the existing pools, draft:true; Rosa is one card in the
deck. PEOPLE [walking companion] amended, research record appended. Two letters open:
century, act two.
THEN (cv) "Idk who dies at the end of act one, ask me later" -> [act two] PARKED BY HIM, carried
silently, not re-asked. "Buildings and some people depending on how many years passed, I know
we wrote it down" -> found it (laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md, rule
4, the city is the long memory) and amended it in his words: buildings count, and a person
counts for as long as they could still be alive given the years between acts, then what they
left counts; the years are the dial. WORLD [century stayed] unblocked. ZERO letters open.
THEN (cw) VAMILY: ZERO commits, the lanes are idle (PLUMBER 14 open 0 claimed, EYES and
DIRECTION 0 claimed); he is typing the word here and not in them, said so plainly. THE ROUND'S
FINDING, canon against build: HIS OWN 7/19 LOCK says THE RIDGE IS THE MENU / TITLE SCREEN, a
living hundred-year record of the city your family built, framed by the grave; RUN shipped
the title as "the wordmark on its plate", the void DIRECTION then judged. Same defect as the
Animal era this morning: a locked sentence nobody re-read. The burial scene exists in the
build (72 ridge / 28 burial strings), so it is wiring. CORRECTED MY OWN ROW: RUN [first
world] is now THE DOOR IS THE RIDGE, and the opening order's step 1 is the ridge. Record:
records/BOHEMIA_COORDINATOR_THE_TITLE_SCREEN_WAS_ALREADY_RULED_9_7_26.md. Routed EYES E17
[locked ignored] (sweep every LOCKED line against the shipped surface) and E18 [he can hear
it]; topped up ECONOMY (Q28 ridge worth, Q29 nothing left). ONE THING HE HAS NEVER OPENED:
the phone feed in CITY mode, it scrolls what you did and what the world did.
THEN (cx) VAMILY: 2 commits, both claims (QUESTS [generation handoff], ECONOMY Q26); lanes
still idle. Ran the first hand pass of the locked-rulings sweep (285 files carry LOCKED):
records/BOHEMIA_COORDINATOR_THREE_LOCKED_RULINGS_THE_BUILD_IGNORED_9_7_26.md. (1) THE
TWO-SCALE CAMERA, 7/1, LOCKED, already ruled two zoom levels with a seamless drop-in
transition "as fast as Pocket City 2's" -- the CITY/MAP buttons contradicted it for two
months; he repeated himself on 9/6. Pocket City 2 was named by him 7/1, in 15 law files,
and missing from CLAUDE.md's reference list: ADDED, one department (the drop-in
transition). (2) THE TEN START-OPTIONS BECOME THE FIRST QUESTS, 7/19, LOCKED, "nothing is
wasted": three of ten exist anywhere, seven were never written -> QUESTS [ten openings].
(3) the ridge, found last round. Pattern: all three are July locks below the lanes'
horizon; this hand sweep runs every round until EYES E17 is a machine.
THEN (cy) HE PLAYED AND SENT A FRAME (records/target/PAOLO_THE_PAD_IS_BROKEN_9_7_26.jpg): "the
action button is fucked up now" -> a REGRESSION from [half size]: seven scattered arrows,
two the same way, the face (the action button) shoved into a corner box; spreading the ring
broke the ring. UI [pad broken] top of UI above everything, with a gate (four arrows, one
each way, face in the centre, nothing overlapping). And the zoom ruling, LOCKED: "zoom out
a little more from the street, zoom in a little more from the city builder, they meet
exactly in the middle at the same scale" -> one continuous scale, the street's farthest
out equals the city's closest in, the renderer switch happens at that number, nothing
changes size; the 7/1 seamless lock made exact. RUN [zoom meets] top of RUN; PLUMBER
[scale gate] measures one house tile on both sides of the switch. Record: records/BOHEMIA_
RULING_THE_PAD_IS_BROKEN_AND_THE_ZOOM_MEETS_IN_THE_MIDDLE_9_7_26.md.
THEN (cz) VAMILY: 1 commit (a PEOPLE handoff note), lanes idle, the pad fix NOT yet claimed.
Sweep pass two (records/BOHEMIA_COORDINATOR_SWEEP_PASS_TWO_9_7_26.md): NO CLAWBACK (7/8)
HOLDS -- zero code lowers a building tier, the only "tier --" hits are a comment; THE EMPTY
CHAIR (7/19) is PRESENT in the grief dinner and nine times in the alpha; and [make it
right] SAYS PAID AND NOTHING IS PAID (ECONOMY found the button passes "PAID THEM BACK" and
makeRight has no purse or amount; the lanes called the amount Paolo's, a number is never
his). DECIDED: restitution in batteries from the purse, weight for weight, the wronged
person still decides. Routed PEOPLE [paid means paid], top with [fluent liar].
THEN (da) HE THUMBED THE WHOLE CLIP LIST and sent a frame: 23 candidates up, 18 down, 33
originals kept, 29 down, 2 unjudged -- saved verbatim, records/BOHEMIA_CLIP_VERDICTS_9_7_26
.txt, frame records/target/PAOLO_THE_COAT_AND_THE_ELBOWS_9_7_26.jpg. HIS RULINGS, LOCKED
(laws/BOHEMIA_ADDENDUM_A_KILLED_CLIP_IS_A_REDO_9_7_26.md): for CLIPS a thumbs-down is a
REDO not a delete ("if I killed it I don't want it gone, make a new one"; graveyard-is-final
still governs shapes); and three defects that are the RIG's, not a clip's: elbows do not
bend and sometimes bend backwards; long coats glitch and pop, tie them to the legs, and it
will be the nature of every long jacket; per-facing draw order is wrong (NE: hand behind
the head when it should be in front). Order of work: fix the rig first (ANIMATION [elbows
bend], [coat follows], [facing order]), THEN [redo killed] the 47, THEN [bake approved]
the 23 verbatim, [judge two]. Also CHARACTER [long coats] wardrobe-wide, DIRECTION [judge
the redo] so he never thumbs the same broken thing twice.
THEN (db) VAMILY: ZERO commits on main; UI (pad broken), ANIMATION (his verdicts) and
PLUMBER all at 0 claimed -- the word has not landed in their windows. Sweep pass three
(records/BOHEMIA_COORDINATOR_SWEEP_PASS_THREE_9_7_26.md): the two headshot clips he just
killed have HIS OWN LOCKED SPEC beside them (7/2, four beats, verbatim) -- noted on [redo
killed]; the 120 BPM REQUEST LAW (7/6) holds on foot (BEAT 500 in both files) and is
UNVERIFIED in city mode, routed as a measurement not a verdict (RUN [map on beat]); the
walled-suburb numbers pending since 7/14 DECIDED (top-half quality walls itself, one gate on
the arterial plus a rear service gate over twelve cells, wall tiles from the bank) -> WORLD
[suburb walls]. ONE THING HE HAS NEVER OPENED: the room's own song -- walk into a house and
listen, RUN tab; 82 songs that played nowhere play indoors now.
THEN (dc) VAMILY: ZERO commits, no claims, the lanes have not moved since his verdicts. Sweep
pass four (records/BOHEMIA_COORDINATOR_SWEEP_PASS_FOUR_9_7_26.md): his 7/1 LOCKED intent
"perks become a PERCEPTION system on the zoomed-out layer, not just combat stats" -- the
shipped tree is 23 fight stats and nothing in the build touches sight or the map (a text
search, not proof, but it agrees with COMBAT's own STATE line). It matters NOW because the
zoomed-out layer is being built this week (sight circle, tracks, the tell, the feed) and
without the branch every one of those is a fixed number forever. Routed COMBAT [perks see],
UI [what you notice]; topped up ECONOMY (Q30 perk price, Q31 cheap eyes). ONE THING HE HAS
NEVER OPENED: the perk tree itself, COMBAT tab, 23 perks he has never bought one of.
THEN (dd) VAMILY: ZERO commits, zero claims, fourth round running with no lane moving.
STOPPED ON PURPOSE (STOP PRODUCING, 7/26, LOCKED: a turn that says "I stopped, here is the
one thing blocking everything" is a good turn). No sweep pass, no new jobs, nothing
manufactured. The one thing blocking everything: the word has not landed in any lane's
window since his clip verdicts; the pad is broken in the live game and UI holds the fix
unclaimed. Told him in one line and stopped.
THEN (de) "how's it going" -> the lanes MOVED since the stopped round, 9 commits: UI [pad
broken] SHIPPED (he answered that chat directly, "he picked 1": ONE RING cut into eight
with the face at its centre) and THE TOP MENU BAR (he asked that chat for one); QUESTS
[ten openings] SHIPPED (the seven he locked 7/19 finally exist); LIFE+CITY THE STREET IS
NEVER EMPTY (763 people were outside and he still saw nobody, so the working set follows
the player -- my density decision, built); PEOPLE [neglect costs] (the stakes table's first
entry is an obligation); EYES E15 school round. 161 open, 6 claimed. Answered him as a
person, no new jobs.
THEN (df) HE ZOOMED OUT AND SENT A FRAME (records/target/PAOLO_WHY_DOES_THE_CITY_LOOK_LIKE_
THIS_9_8_26.png): "why does the city keep looking like this when I'm zoomed out, bro, come
on." MEASURED: city mode is 19 fillRect against 9 drawImage, coloured slabs with edge lines,
the builder's diagram standing in since the builder was wired; nobody owns the aerial as a
picture. HIS 7/1 LOCK says "same pixel style, reading as a realistic city from above, not
chibi" -- the fourth locked ruling this week the build never read. Record: records/BOHEMIA_
RULING_THE_CITY_FROM_ABOVE_IS_A_DIAGRAM_9_8_26.md. Routed COOK [city from above] (top,
above the car), DIRECTION [city look] (the card that never existed, against real Vegas
aerials), LIFE+CITY [tiles not slabs] (the diagram becomes a layer, off by default).
THEN (dg) ANOTHER FRAME (records/target/PAOLO_THE_TAP_PICKS_THE_WRONG_TILE_9_8_26.png): "when
I click a tile in city builder mode it's not the tile it's sitting on, it's below, very
awkward." READ THE CODE: CBcellAt inverts the ground-plane projection with one fixed
half-tile offset while the aerial draws tiles LIFTED (LIFT = 1.6), so the roof under the
finger belongs to the diamond behind it, one row off; plus page-vs-canvas pixels on a phone.
Fix shape written (pick against the drawn tile, scale the tap first); gate = a real driven
tap, the pad lesson. Routed LIFE+CITY [tap picks] (top), PLUMBER [tap gate]. Also noted:
this frame shows real tiles at a nearer zoom, so the slabs are the FAR level only.
THEN (dh) "we seriously need a loading screen, all the loading shit, handle it, it's so
awkward looking" -> LOCKED: one screen holds everything that loads, the door (the ridge)
appears only when the game is ready, nothing pops in after; step ZERO of the opening
order (amended on records/BOHEMIA_RULING_THE_FIRST_SIXTY_SECONDS_9_6_26.md). Routed RUN
[loading screen] (top), UI [loading look] (options sheet, act-one register), PLUMBER [late
loads] (the measured list of what arrives after first paint, and a gate that nothing
visible pops in after the door).
THEN (di) A FRAME OF THE FEED (records/target/PAOLO_THE_FEED_IS_NOT_A_PHONE_9_8_26.jpg): "this
doesn't look like a cool post-economic-apocalyptic phone, does it, bro, come on?" -> the
feed is a flat black monospace panel, a debug console, against his 9/4 law (a PHONE screen)
and his 9/6 three-acts law (act one's interface is an in-world object, 2050 rustic). The
words are fine; the OBJECT is the job. Routed UI [phone object] (top, options sheet of 3-5
phones, drawn from the skin), DIRECTION [phone card] (real worn phones as reference).
THEN (dj) A FRAME OF THE LEFT RAIL (records/target/PAOLO_THE_RAIL_COLLIDES_9_8_26.jpg): "what
is this part of the UI? it's colliding with each other." IT IS the city screen's left rail
of chips plus the day's JOB CARD (SCAVENGE, 9H) that the shift work added; READ IN THE FILE:
every chip has its own hand-typed top/left, nothing lays the rail out as a stack, so a new
card lands on whatever sat at that height (DROP IN, WHOLE MAP); the file carries an older
comment fixing exactly this by hand for one element, plus four duplicate footing divs from
merges. Routed UI [rail collides] (top: one flex stack, no hand offsets, a no-overlap gate at
phone size), LIFE+CITY [white rings] (four white ring markers at once, one is him; measure
what draws them).
THEN (dk) "how's the Battle Brothers shit going... I don't want anyone to permanently die
or have permanent debuffs... I like the recruiting from factions and cities and how your
company gets incorporated into quests autonomously... an easy way to LOCK characters you
don't want to die, not endgame bullshit." STATUS given: 14 BB rows shipped (money, prices,
living costs, lights bill, held ground, fast roads, rung door, coalition, contact fight,
house tiles, fights end, four sound rows), [parties move] and the travel map in flight, nine
open. RULINGS LOCKED (laws/BOHEMIA_ADDENDUM_YOUR_PEOPLE_DO_NOT_DIE_FOR_GOOD_9_11_26.md): no
permadeath and no permanent debuffs for your people (long injuries that heal; his realism
trade); a one-tap lock from the first hour with a real cost; recruiting by where you stand;
company members inside the asks. Story deaths, enemies and time across the fold still kill.
Routed PEOPLE [down not dead] (top) and [lock them], COMBAT [downed body], FACTIONS
[recruit anywhere], QUESTS [company in asks], ECONOMY Q32 [long injury].
THEN (dl) VAMILY, 25 commits: LIFE+CITY [tap picks] SHIPPED (tapping the building you
see selected it 0 of 38; the picker now asks the painted pixels, last painted wins), UI
[phone object] SHIPPED (an object with thickness, gateable, the words untouched), ANIMATION
[elbows bend] SHIPPED (bend:'auto' kept whichever elbow hung lower, a knife edge that
snapped every frame; the machine found the same eleven clips he killed), WORLD [parties
move] SHIPPED, QUESTS [designs playable], PLUMBER [gate missing], COOK [city from above]
round 1, DIRECTION the city-from-above card, CHARACTER hair bands, ECONOMY Q28, WORDS Q18
school, EYES E15 round two, FACTIONS three red gates closed. TWO OF MY DIAGNOSES WERE
WRONG AND THE LANES CAUGHT THEM BY MEASURING: the tap "LIFT 1.6" was an economics constant
and the pixel scaling already existed; the city count was of the alpha shell, the real
number is 73 fillRect and ZERO images. New rule on this seat (central-chat law amendment):
a cause I hand down is a premise to test, never a finding. AND RUN [drop in] found THE COLD
OPEN HAS ZERO CALLERS -- his 8/4 cut's first beat does not play -- and the first minute
meets nothing (suburb spawn, no road row by design, hostiles 0, 128 tiles to a road
district). Routed RUN [cold open wired] (top) and [wake near] (the spawn moves, not the
table). Record: records/BOHEMIA_COORDINATOR_TWO_DIAGNOSES_I_GOT_WRONG_9_11_26.md. (The
first attempt at this block crashed on a claimed line and only the record was committed;
this is the real one.)
THEN (dm) "the UI has to run as far away as possible from the standard look of vibe-coding
with Claude, people can tell, even down to the font" -> LOCKED, laws/BOHEMIA_LAW_THE_UI_
MUST_NOT_LOOK_VIBE_CODED_9_11_26.md. Researched the tells (default fonts, dark by reflex,
one-pixel borders on every card, rounded cards, gradients and glow, letter-spaced uppercase,
emoji icons) and COUNTED OURS in the two files that draw his screen: Space Grotesk 10,
monospace 178, one-pixel borders 144, rounded corners 115+, gradients 31, letter-spaced
labels 188, emoji in buttons 27, dark always -- we carry the whole list. Law: none survive,
the look comes from the world (an object, 2050 rustic), the font is researched, a gate
counts the tells. Routed UI [no slop] (top), DIRECTION [the font], EYES E19 [slop count].
THEN (dn) VAMILY: 2 ships, 16 jobs claimed across the fleet (busy). SOUNDS [music owned]
round 2: the music never stopped once in twelve minutes, every song gets EXACTLY 128 s (the
engine's loop length) back to back, and the ambience bed is masked underneath forever.
ECONOMY Q29: the day after the money dies the shelves fill and nobody can buy anything.
ECONOMY also flagged, twice, the language gate RED 80/1 on a PEOPLE quirk line with no
Spanish in it -> routed PEOPLE [spanglish red], first thing; and a "bare conflict marker"
in the handoff -> checked, only the 80-char decorative separators found, routed EYES E21
[marker sweep] so a machine tells the two apart. Harvested WORLD [full shelves]; topped up
ECONOMY (Q33 barter day, Q34 who profits) and EYES (E20 song length).
THEN (do) VAMILY, 17 commits: UI [rail collides] SHIPPED -- and my diagnosis overreached
again (I said every chip had a hand-typed offset; measured, eight of nine were in one flex
column and only the job card was not; the conclusion held, the claim did not -- the premise
rule stands, third case). LIFE+CITY [white rings] SHIPPED: three of the four rings were the
lane's own settlement marks, drawn TWICE the size of the you-are-here mark. WORLD [batteries
mined] and FACTIONS [power territory] SHIPPED: his money ruling built end to end (certain
buildings make batteries; a faction mines its land). DIRECTION [the font] ruled per act
with five real candidates (a dying device's ROM font, the DIN stencil standard, segment
numerals, licensed small pixel fonts) and found its OWN cards had prescribed the monospace
default the vibe law bans. UI claimed [no slop]. EYES E16 round two: the link between his
words and the work is not missing, it is DELETED ON SHIP -- OPEN lines cite him 34%,
SHIPPED lines 12%, because the line is rewritten as a summary when it lands; and 39 verdict
records carry his verbatim words, so "he has thumbed zero" was true of the 127 garments
only. FIXED ON THE FRONT PAGE: rule 11, a SHIPPED line keeps its label and its "Paolo
<date>" citation. ECONOMY Q30, WORDS Q19 school.
THEN (dp) VAMILY, 40 commits. HIS WORDS TO THE RUN CHAT 9/11: "we don't have a story yet
bro, your job is to make sure the rest of the game is playable and fun" -> RUN wrote laws/
BOHEMIA_ADDENDUM_THERE_IS_NO_STORY_YET_9_11_26.md; it OVERRULES my 9/11 decision to wire the
cold open first (a story hole, not a decision to make) -> [cold open wired] DEFERRED; QUESTS
header notes the main story and ten openings are playable attempts from his rough draft,
never canon. SHIPPED: COMBAT [enter zoom] (the camera pulls back; the half second is the
art director's card), LIFE+CITY a crowd to walk into (0 of 16 walks met a crowd, now 5),
PLUMBER [nothing baked] (the freshness gate, five more stale bakes found), WORLD [century
stayed], FACTIONS [block rent], PEOPLE [paid means paid], QUESTS [haggling works], COOK hair
has 21 colours, DIRECTION [small and clear] PASS, UI [no slop] round one (the tells counted,
the skin draws every control), ECONOMY Q31, WORDS [caught out]. FINDINGS ROUTED: the suite
cannot finish (589 gates x 9.4 s vs a 2,700 s budget, 198 never ran, 53 red, 32 never
re-checked) -> PLUMBER [suite runs] top; five RUN gates red on main -> RUN [reds mine]; three
city-art reds -> LIFE+CITY [lab reds]; TWO live faction colour tables disagreeing on 10 of
12 -> CHARACTER [one colour table]; PLUMBER proved EYES' "29 dead modules" wrong (engine
modules are inlined; nothing archived, on purpose). Topped up FACTIONS, ECONOMY.
THEN (dq) VAMILY: 8 commits, all claims, 17 jobs in flight (PLUMBER took [suite runs]).
OWN WORK: the opening order amended for the no-story ruling (loading, the ridge door, the
tutorial offered, then the game waking near a road district and the teaching fight; the
cold open slots back in when the story exists) -- on the RUN [one question] line and the
first-sixty-seconds record. Topped up QUESTS [first ask] (the first three asks a stranger
meets, mechanism not story), WORDS Q21 [ask words], DIRECTION [judge the zoom] (the
pull-back judged live before he is sent to look), EYES E22 [never ran] (the standing
never-ran list for the suite), ECONOMY Q36 [first ten]. ONE THING HE HAS NEVER OPENED:
the camera pulling back into a fight, RUN tab, just shipped.
THEN (dr) VAMILY, 49 commits. SHIPPED: WORLD [own power] (a generator on your land takes
the block off their line), FACTIONS [crossing costs] (the wrong colour reacts), COMBAT
[loot kept] and [guns close] (a gun is in its own way up close), QUESTS [edit quests] (he
can direct a quest now: eight verbs, the unlock was one line that said quests do not play
here yet), LIFE+CITY half of all walks meet a crowd now, CHARACTER [faction colour] round
2 (withdrew a false finding, fixed the value step rotating hues). PLUMBER [suite runs]
round 1: ALL 593 GATES RAN ONCE FOR THE FIRST TIME -- 500 green, 93 red, 217 min of gate
work, floor 71 min on this box vs 45 budget vs my 10-min target; sharding cannot deliver
it; the old census came from a truncated log and flattered the floor 3.2x; FACTION ARC
alone is 20 min with fourteen city boots and the suite had never seen it once. DECIDED
the fork: my ten-minute target withdrawn; two tiers (fast under ten on every ship, full
71 uncut on demand), NOT RUN prints as not run, one city boot shared is the lever. EYES
E17 round two swept 856 real locks, 330 his, 12 machine-checkable against the 17 shipped
files: 8 satisfied, 3 eroded (the ridge -> RUN [first world] already; 32 purple tiles ->
COOK [purple leak]; a cover cost of 2 "his number" with no ruling on file -> COMBAT
[cover costs one]: produce his words or make it one).
THEN (ds) VAMILY: 1 ship, 13 in flight. PEOPLE [down not dead] BUILT: measured first that
there is NO company roster, no companion state, no injury model, so his no-permadeath law
held only because there was nobody to lose; the injury model now carries his three lengths
(a week, a season, a year of the valley's time) and fall() cannot kill a kept person, no
flag, no option. Swing: in the games that made companions unkillable, the weight of a fall
is what you LOSE while they are down (their contribution goes with them for the timer) --
written onto PEOPLE [lock them] as the lock's cost, nothing else to invent. Routed FACTIONS
[who follows] (the roster from the block's side), ECONOMY Q37 [carry cost].
THEN (dt) VAMILY, 36 commits. SHIPPED: SOUNDS [sound card] (his FFX ruling as five measured
terms, all 142 songs rendered and ranked; and ZERO of 142 have the late-arriving beat his
anchor is famous for -> SOUNDS [late beat] top), WORLD [rice clock], QUESTS [check the
claim] (the valley can lie and your legs are the instrument), COMBAT [rescue her], FACTIONS
[collector heir], WORDS [no law talk] (fifteen act-one lines, each naming the institution
act two kills it with), RUN fixed the demo's hanging opening offer, UI [no slop] round 3
(the tells have owners), ANIMATION put his words back on three shipped lines (rule 11
working). FINDINGS ROUTED: ONE PURSE IN THE WHOLE GAME, nobody else has a pocket, the swap
primitive works and is half-called -> WORLD [every pocket] top (precondition for lending,
rent, restitution, barter); the purple reservation gate finds 2,232 violations and EXITS
GREEN -> PLUMBER [cannot fail] second; the combat entry gate flakes 1 in 5 because the
staging sometimes delivers no party -> COMBAT [party arrives]. MY PREMISE WAS WRONG A
FOURTH TIME: the two colour tables are aim and landing, not two sources; CHARACTER did the
row before arguing and found the guard checked presence never value; row re-aimed.
THEN (du) VAMILY, 28 commits. SHIPPED: WORLD [debt carried] (one place answers who you
owe, on the nightfall card, and the fold now actually kills the bill and keeps the lenders
by name; it found its own tautology check and a NUL byte in the city), QUESTS [company in
asks] (your people are computed from bonds, never a roster; its own limit is the cast dies
with the day -> QUESTS [bond outlives]), FACTIONS [tracks read] (28 parties leave trails in
their own ink on the map; the street says who came through; "the named blocker was not
the blocker, sixth row running" -> FRONT-PAGE RULE 12: a dependency I write is a premise
the lane measures, never a gate), EYES E18 both rounds (melody at 8.0 s where his anchor
has it already playing -> SOUNDS [melody first]; the lead he named, brokenrosary, is
scheduled ZERO times -> SOUNDS [lead never sounds]), DIRECTION [judge the zoom] PASS (the
person crosses the swap at one size; the depth dial is a derived number), ECONOMY Q34
(one distinct price in the whole valley; the biggest road in a real crash is buying at
one price and selling at another, impossible here -> WORLD [two prices] under [every
pocket], ECONOMY Q38 [old price], Q39 [protection court], Q40 [how many pockets], FACTIONS
[deal sticks]), WORDS baked the book and made its ratchet a rate (five hits are QUESTS
text -> QUESTS [five hits]; three one-way-ruler shapes -> PLUMBER [one way rulers]),
COOK [fortress buildings] r2 ("~20 undrawn districts" is EIGHT, seven are Vegas landmarks
on bare ground -> the FACTION TOWNS law corrected 9/13, COOK [seven landmarks], WORLD
[beltway placed]), CHARACTER [one colour table] r2 (5 of 9 -> 7 of 9; a garment named
COPPER renders GREEN -> CHARACTER [names lie], [shape frozen]; Anarchists have no magenta
garment and Network needs a second teal piece -> COOK [magenta piece], [teal legs]; two
outfits changed -> DIRECTION [judge the swaps]), RUN [drop in] (four conversation buttons
at 31 px, no checker had ever opened a conversation -> UI [every card], EYES E23 [every
screen]; four gates held a spelling not a meaning -> PLUMBER [spelling gates]), PLUMBER
[suite runs] r1 (FACTION ARC 594 s -> 357 s, still over the 600 s cap, continuing).
DECIDED BY ME: the FACTIONS [PENDING Paolo] on debt (survives in full vs dies) is closed,
the fold wins, records/BOHEMIA_RULING_THE_BILL_DIES_THE_LENDER_STANDS_9_13_26.md ->
FACTIONS [same lender]. MY SWING: records/BOHEMIA_COORDINATOR_SWING_ONE_PRICE_IN_THE_WHOLE
_VALLEY_9_13_26.md (Argentina: price spread rises with inflation, slope one third; Lebanon:
four rates, the door sold at eight times). ALSO: FACTIONS [pursuit strength] (his 9/6
travel-map ruling, never on the board), DIRECTION [judge tracks], EYES E24 [phone latency],
WORDS Q22 [debt words], Q23 [track words]. Board: 169 OPEN, 15 CLAIMED. Every lane at six
or more open. The one shipped thing he has never opened: the footprints on the MAP tab.
THEN (dv) VAMILY, 33 commits. SHIPPED: WORLD [someone lends] (a real loan: batteries arrive
and an obligation is written beside them, one a night back, dies at the fold, lender
stands), FACTIONS [recruit anywhere] (who will come depends on the ground, the holder and
your standing; 46 of 61 on the waking block; no roster), COMBAT [plates cost] (the bell
refuses a plate at zero tape; and it found the city calls neither fight reset -> COMBAT
[third door]), CHARACTER [one colour table] (the CHARACTER tab shows his colour vs the
worn colour on all 13 cards: 7 of 9), ANIMATION [coat follows] (skirt reaches to the
swung leg, spill 12.2% -> 3.9%, hip pop 30.8% -> 17.9%), SOUNDS [music owned] r3 (the
late beat on all 142 songs by one rule in playStep, 16.0 s on the street, never in a
fight; three songs with the beat in their data are menu-only -> RULED retag, SOUNDS
[three retagged]), LIFE+CITY [lab reds] (three red checks were broken rulers, one
outranking his 8/26 rungs ruling; 932/0) and [more people] r10 (13 of 16 walks meet a
crowd), PLUMBER [suite runs] r2 (FACTION ARC split, 102 checks run for the first time),
WORDS [ask words] school (a thank you opens an account; refusals are twice prefaced),
ECONOMY Q35 [rent riot] (a strike controls the vacancy, Glasgow 1915 -> WORLD [block
strikes], QUESTS [strike ask], ECONOMY Q41 [who replaces you]), COOK [fortress
buildings] r3 (the Welcome sign drawn -> EYES E25 [the sign]), RUN cold hand 7/0 four
runs, UI [no slop] r4 (spaced caps 80 -> 0; and its own regression: the largest text
setting did nothing to the city since 9/7, fixed).
THE WALL THREE LANES HIT: the suite cannot finish (331 of 603 never ran in 45 min; 56 of
372 reached were red; floor 71 min). MY SWING: records/BOHEMIA_COORDINATOR_SWING_HOW_BIG
_SHOPS_RUN_A_SUITE_THAT_CANNOT_FINISH_9_13_26.md (Google: pre-land fast and local only,
post-land everything on one machine and PUBLISHED; flakes quarantined, still run, never
gate). -> FRONT-PAGE RULE 13 ("I ran the suite" = pre-push pass green + read THE SUITE
LINE and own your reds), PLUMBER [suite line] and [pre-push pass] at the top of PLUMBER.
Rule 8 gained: touch engine/, rebuild both derived slices (RUN [slice rebuilt]).
DECIDED BY ME (records/BOHEMIA_RULING_THREE_DEFAULTS_DEEDS_HIRES_AND_THE_THREE_SONGS_9_13_26.md):
a deed weighs what it cost you, no table (FACTIONS [deeds weigh]; kills the 83-row empty
DEED_WEIGHT wait and the two red-by-design gates); taking somebody on costs one a night
(FACTIONS [take them on]); the three late-beat songs go to the street pool. Also QUESTS
[half now] from WORDS' school. Board: 176 OPEN. The one thing he has never opened: the
colour chips on every card in the CHARACTER tab, "THE COLOUR YOU PICKED. 7 of 9 wear it."
Noted, not acted: a dynasty-slug session claimed QUESTS [first ask]; the work is what counts.
THEN (dw) PAOLO: "I wanna be able to fast travel like yesterday, bro, in the demo, bro."
Deciphered: URGENT (the idiom), not calendar. His SECOND ask (9/6 [travel map] said "top of
this lane" and sat ninth for a week under another claim; my failure). Measured: no fast
travel exists anywhere; the latch comment says NOT FAST TRAVEL in capitals; every piece
exists (city tap picks the tile, step rule, zoom handoff, party contact, road cards, reach).
RULED: records/BOHEMIA_RULING_FAST_TRAVEL_LIKE_YESTERDAY_9_13_26.md. RUN [fast travel] is
the FIRST line of RUN, the MODE line tells the holder to pause its claim and take it this
round: tap a place on the CITY view, the trip runs in game time on the beat at the world's
speed, marker moves among tracks and parties, arrive on the street at that tile; a party
touch fights, a road card stops, nightfall stops, one tap stops. Not a teleport menu. The
fog/sight/night map ([travel map]) follows it, not a precondition.
(NOTE: the (dv) block above was dropped from this file by another lane's rebase at 765e8c5f
and is restored here verbatim from 1241e42a.)
handoff cut is prepared and queued (the gate forbids it; the coordinator does not
write gates). Nothing to judge. ***
Paolo 9/4: "is there any part of the structure that's unnecessarily token heavy? can
we slim it down... quicker, less tokens." Record: records/BOHEMIA_TOKEN_DIET_9_4_26.md.
MEASURED: CLAUDE.md 135 KB (~34K tokens) auto-loaded into every message of every chat,
97.5 KB of it the LAWS section retelling 48 rulings that exist as files; the handoff
5.2 MB, 79,379 lines, ~1.3M tokens, 1,241 blocks, 14 live lanes whose newest blocks
total 61 KB. RESEARCH: the instruction file costs its size on every turn, keep it
under ~200 lines as a lookup table. DONE: CLAUDE.md is now ~24 KB (~6K tokens): the
VAMILY block first, the pillars in one paragraph, the 9/4 structure in one paragraph
of pointers, the 48 laws one line each with path and gate, and the working-rule
sections kept verbatim; everything folded went word for word into
laws/BOHEMIA_LAWS_MASTER_9_4_26.md (54 sections). Every gate that reads CLAUDE.md was
run: attempt (needed the literal "AMENDED 8/11 FOR WORDS" on the index line, added),
reply contract, dialogue catalogue, earned-not-afforded, rulings, voice, name-the-tab,
feedback master, canon rot: all green. people_gate is 148/10 and reads none of the
files this turn touched (pre-existing; PEOPLE gets a [gate red] line at the top of
its queue). PREPARED, NOT APPLIED: archive/handoffs/HANDOFF_ARCHIVE_9_4_26.md (every
byte) and HANDOFF_SLIM_READY_9_4_26.md (the 14 newest lane blocks); SHARED [handoff
cut] is the top shared job: amend handoff_gate's 80% bulk rule to accept a deliberate
archive, then swap; [backlog archive] queued behind it. A first draft put the archive
under records/ and the canon rot gate counted its 5 MB of old citations; moved to
archive/ (history, per the truth hierarchy) and it went green. LAST FEEDBACK
RECEIVED: this -> the fold, the two SHARED jobs, the record.
THEN (ec) VAMILY, 23 commits. THE HEADLINE IS EYES E26 r3: THE DEMO HE OPENS DID NOT
CHANGE (stamped 9/13z, alpha 9/14a); six lanes' fixes sit behind RUN's cut and RUN is deep
in [fast travel]. RULE 14a AMENDED: RUN re-cuts at the START of every RUN round, a ratchet
(never worse than the last cut), the daily build as the model; RUN [cut now] is the first
line, with [cutter flex] folded in; the law file amended. THE SUITE LINE POSTED by me off
PLUMBER's first comparable run (ad23d875: box 0.89x, 632 ran, 525 green, 107 red, 0 never
ran, floor 71.3 min; FACTION ARC 557.7 s vs 600 cap, not safe). SHIPPED: COMBAT [prefight
save]; LIFE+CITY [eyes: dead build] (BUILD goes visibly off when you cannot afford it,
EYES was right for a different reason); UI [eyes: reach spills] (the rail's 'reach is 44'
was never true, 12 px chips with 30 px of dead air; 44 px chips now, ink still halved);
QUESTS [half now] part one (a dead row on a TAKEN job removed; and the class finding: A
DEAD BUTTON IS INDISTINGUISHABLE FROM A CLOSE BUTTON, screen diffs read a closed card as
life -> rule 14h); FACTIONS three five-minute rounds (the against-line never cleared;
three shipped features were NEVER ON THE GLASS because the pack pass wiped the shared
street line every frame, 0 of 2 -> 2 of 2); PEOPLE (the cab's line outlived the car by the
whole walk; cleared at 90 s); ANIMATION [redo killed] r5 (his four beats are fractions
of the fall and the sim read them as seconds; arms-up converted; beat one blocked by a pin
and a fourth attempt refused, STOP PRODUCING); DIRECTION seam PASS on [base shadows];
WORDS Q24 school (a yes with an if in it is a counter-offer; they say the terms back);
ECONOMY Q41 (eviction costs the owner 30 to 136 batteries against a debt of one; relight
has zero callers and no price -> DECIDED relight costs one, note on WORLD [block strikes]).
CHARACTER measured its way to a break: THE WHOLE POPULATION IS SIX PEOPLE (74% of a
screen's crowd repeats, 47 pictures among 183 bodies; one more bake costs 530 ms of boot)
-> CHARACTER [six people] first, cheaper variety by ramp. EYES: 'Half of it now' still
dead on both surfaces; QUESTS says it works on this tree; part two still claimed. My
duplicate handoff blocks (dw, dz) removed again (PLUMBER's restore re-added them).
THEN (ed) PAOLO 9/14: ONE VOTE TAB AND THE PORTRAIT CHAT. Verbatim:
records/BOHEMIA_PAOLO_ONE_VOTE_TAB_9_14_26.md. Law: laws/BOHEMIA_ADDENDUM_ONE_VOTE_TAB_AND_THE
_PORTRAIT_CHAT_9_14_26.md, front-page RULE 15. Eight judge pages -> ONE VOTE TAB in the
DEMO behind the gear; a vote CONSUMES the item (never renders again under that id;
verdict to records/*.txt and a registry the tab reads); approved goes into the game and
its own tab the same round; killed to the graveyard, clips redone and back as a new id
quoting his words. UI owns the shell (UI [vote tab] first line); [into the vote tab] on
ANIMATION, CHARACTER, SOUNDS, COOK, DIRECTION, WORDS; RUN cuts it. NEW CHAT 20 PORTRAIT
(UNCLAIMED; a brand-new chat is PORTRAIT now; primer and CLAUDE.md amended): the HD face
of every person matched to the body's eye colour, hair colour, haircut ("damn near the
same"); blank is the defect; he speaks along per face through the VOTE tab; try 3-D
(cook 3-D, eat 2-D). Lines: [blank faces] (school), [matches body], [three d look],
[speak along], [faces first]. His "Pokémon vibe" is a description of sprite-vs-portrait
size, NOT a reference game; written into the law. THE TWENTY CHATS.
THEN (ee) PAOLO 9/15 PLAYED THE 9/14p CUT (RUN cut it: dead buttons gone). Verbatim:
records/BOHEMIA_PAOLO_PLAYED_THE_DEMO_AGAIN_9_15_26.md. Seven sentences, seven rulings, each FIRST in its lane (law section 4b): COOK
[car recook] back to first (the car is dogshit at every zoom, worst at the widest; the
art half that shipped 9/7 is not what he sees); DIRECTION [far view] (the widest zoom
looks like dogshit; judge it against a real aerial); RUN [spawn home] (he spawns in the
middle of a freeway, street for no purpose; the door is your home on your block); PEOPLE
[a human being] (he did not see a single person; a person on screen within ten seconds);
PLUMBER [sixty fps] first (not running smoothly, things loading in real time); COMBAT
[start a fight] (he does not know how to start a fight or when it starts: on purpose
inside the first minute, and the screen says so). And: "pieces are coming together, we
still have a very long way to go" -> the freeze stays. The front page's BREAK LIST carries
his second list. SWEPT IN PASSING (40 commits): WORLD [every pocket] SHIPPED and found
every battery he ever paid was being DESTROYED (transferIn had zero callers; his balance
was the money supply of Las Vegas); CHARACTER: twelve bodies on the street, +150 ms not
+3,200, and the trade pools had to widen or nothing changed; RUN [cutter flex] SHIPPED and
the culprit was the alpha's halving stylesheet, not the cutter; PLUMBER's '70% of taps do
nothing' was its own walk, all eight buttons work; EYES r4 retracted its two dead buttons
(zero, on an unchanged file); PEOPLE: over 34 game-minutes the walk director fired TWICE
against ~22 allowed, the road director zero, which is why nothing happens on a walk;
COOK r3: the houses are 4% of his screen and were not next.
THEN (ef) PAOLO 9/15: THE STEP IS A HOUSE. Verbatim: records/BOHEMIA_PAOLO_THE_STEP_IS_A_HOUSE
_9_15_26.md. Law: laws/BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md, front-page RULE 16. One step is one lot on
the street and the fight board, for the player, every character, every enemy; bodies drawn
larger on both (default about half a lot tall at walk zoom, he corrects in play); 120 BPM and
one step per beat unchanged; the clock per step re-derived from walking speed so distances,
days and rent stay true and real-time travel gets faster by the multiple; ONE constant in one
place read by street, fight, bodies, seam and reach; NOT a rebuild (the art stays, the lattice
coarsens). The 9/4 'walked world never changes scale' bullet is DEAD (law amended); CLAUDE.md
pillar amended. FIRST LINES: RUN [step is a house] (owns the step and the constant), COMBAT
[house board], CHARACTER [bigger bodies], LIFE+CITY [lot lattice]; notes on ANIMATION,
PLUMBER, DIRECTION, [zoom meets]. Measured today: a step = one fine cell (44 px, 0.084 min), a
lot = FN 32 fine cells, a body ~32 px; the fight draws ~15 px at the swap. His question
answered in the law: yes it makes sense; no, not a remodel from the ground up.
THEN (eg) VAMILY, 31 commits. HIS RULINGS, MOVED: COMBAT [start a fight] SHIPPED (tap a
hostile, the fight starts where you stand; the screen says A FIGHT HAS STARTED / press
FIRE); PEOPLE [a human being] SHIPPED (a person stood two cells from the door the whole
time; the speech bubble was drawn on his face at the demo's zoom); CHARACTER [six people]
SHIPPED (175 different pictures of 183, repeats 56% -> 4%, ramps at draw time); COOK [car
recook] r4 (the widest zoom drew a PLACEHOLDER SKY with the words 'placeholder sky, art
request AR-005' printed on it since 8/12; cooked; DIRECTION [far view] SHIPPED); UI [vote
tab] SHIPPED (registry records/target/BOHEMIA_VOTE_REGISTRY.json, tab behind the gear,
a vote consumes, 28/0 with three mutations); PLUMBER [sixty fps] r1: at 4x throttle the
door opens at 52.9 s and the first 15 s run at 9.8 fps, HE MEETS THE WORST PART FIRST ->
RUN [loading screen] second line; RUN [spawn home] built and HELD on a fork -> DECIDED:
home wins, the world reaches him in the first minute through the director. SOUNDS: the
valley's music NEVER PLAYED (the opening restarted forever because a stuttering boot reset
the step counter); fixed, stamp 9/15b. WORLD [two prices]: built the stranger's price and
it made the first rice cost two days' work; DECIDED the surcharge is dead, the spread is
access and distance (records/BOHEMIA_RULING_SIX_DEFAULTS_AFTER_HIS_SECOND_PLAY_9_15_26.md). ECONOMY Q44: water is the valley's, one lit
pump serves all, one seed in three boots dark -> QUESTS [light the pump] first, the first
job of the game. LIFE+CITY [no pool cells] DEAD (premise false, 903/903 draw bank art).
UI found THE DEPLOY CUTS THE DEMO AT THE LINK ON EVERY PUSH, so the freeze never held at
the link and shipping to the alpha is shipping to him -> rule 14a amended again, [demo
pinned] re-aimed. Six pendings decided in the ruling record (stranger pays one; home;
the pump; injury costs one a day; forgiven stings a season; the dog is canon at zero
until cooked). PORTRAIT still UNCLAIMED (he has not opened the chat).
THEN (eh) VAMILY, 34 commits. THE STEP: three of four halves SHIPPED. COMBAT [house board]
(the whole house board was built 9/5 and the flag that turns it on was never set; on by
default now, tile 65 px, pistol 1 rifle 2, the body already 0.51 lots tall); LIFE+CITY [lot
lattice] (a lot is 24 fine cells = 18 m read out of the suburb generator; FN is 128 and the
overmap tile is a BLOCK, so MY PREMISE WAS WRONG in two rows and the law; corrected by
measurement; the lot lattice is more connected than the fine one); CHARACTER [bigger
bodies] (the body is chosen off the lot now, five ladders folded to one; the LOT must draw
~208 px not 1,100; the person is 5.3x larger with the same sprite; what moves is the ground,
RUN's zoom); ANIMATION (one constant CAST_PX, byte-identical at 56). RUN's half is the one
still OPEN and the other three wait on it -> [step is a house] rewritten with their numbers,
ahead of [fast travel]. ALSO SHIPPED: RUN [spawn home] (he wakes on his own front step; the
day-one wake had never fired; it uncovered that HIS HOME BLOCK IS SEALED -> LIFE+CITY [sealed
block] first); PEOPLE [lock them] (his 9/11 ruling, one tap); WORLD [two prices] (the camp
refuses a stranger's battery, BARTER_ONLY opened, no price above one); DIRECTION and WORDS
[into the vote tab]; COOK [car recook] r5 ('confused' is arithmetic: every prop is scaled
into a footprint stall, the car at 1.83x blurred); SOUNDS (the combat warm-up overruled the
street song twice in 0.3 s; fixed); FACTIONS (the only alert ring in the game was silently
dead since the outfit button went; and THE MAIN QUEST M01..M05 IS INLINED INTO NO SURFACE ->
QUESTS [main quest live]). EYES E26 r6: HE WAS LOOKING AT A FROZEN FRAME (freezes of 6.0 s
at 9.4 s and 11.1 s at 20.5 s; 28.9 s frozen of 300 across 42 freezes; the first body lands
at 17.2 s) -> numbers on RUN [loading screen] and PLUMBER [sixty fps]; and 55 fight words
nobody can read (COMBAT's readout fix landed after). ECONOMY queue empty at 44/44, folded
into one master -> Q45 [first sixty], Q46 [daily radius], Q47 [who owns the water]. DECIDED:
scope stops at three tiles; the way back on costs one (records/BOHEMIA_RULING_SIX_DEFAULTS_AFTER_HIS_SECOND_PLAY_9_15_26.md). PORTRAIT still unclaimed.
THEN (ei) VAMILY, 34 commits. PAOLO ASKED the chat names (he renamed number 10 by
accident): 10 is FACTIONS; the list is THE TWENTY CHATS on the front page. THE STEP: RUN
[step is a house] PART ONE shipped (STEP_CELLS 5, 3.75 m, stamp 9/15s FIVE TIMES THE
STRIDE) and refused the literal house-step at today's camera because his phone is 1.03
houses wide (two screens a second); CHARACTER and ANIMATION both found their body wire
reading a global nobody publishes (a second name for one number) -> DECIDED ruling 10: the
CAMERA is the rest of his ruling and it is RUN's: lot ~208 px, bodies grow by their own
trigger, one published name, the stride at one lot per beat as the attempt with 5 as the
fallback. PLUMBER [sixty fps] r2: THE FIGHT IS 7.1 FPS ON A PHONE-SHAPED CPU and the
instrument had discarded the phone number since 9/5 -> [fight headroom] second, COMBAT
note. EYES E26 r7 owned walking the wrong file for six rounds (the deploy cuts the demo;
a fight is reachable at 2:05 on what he plays) and found THE FIGHT SHOWS THE DEV STRIP
(WAIT/SUPPRESS/HAND-PEEK/NEW ENCOUNTER/WAY OUT) to the player -> COMBAT [dev strip] first.
FACTIONS: ZERO CREWS have ever been on the map -> [crews exist] first; and the widest stop
frames the whole valley but the city renderer never runs there -> note on LIFE+CITY [tiles
not slabs]. PEOPLE [a human being] r2: he was looking at HIMSELF (the player appears at
12.5 s, anyone else at 16.5 s, the thread held 98% of the wait) -> numbers on [loading
screen]. LIFE+CITY [eyes: shape rows]: the day-card rows were never dead, the card
re-centred under his finger and a second tap spent his last ask; fixed, the menu never
changes height. UI [no slop] r8 (monospace 42 -> 8, tells 176 -> 142). CHARACTER [names
lie] (4 real liars, 23 of the first 27 were the ruler), [long coats] SHIPPED. WORLD [battery
worth] SHIPPED (the valley counts its cells; a day's work minted from nothing) -> DECIDED
ruling 9: one per head on day one, held by the ground's holder, work paid from treasuries.
COOK [car recook] r6 drew twenty cars, looked, killed them (barrels). SOUNDS: a fight
starting makes a sound. COMBAT V219: the rulers read the board. PORTRAIT still unclaimed.
THEN (ej) PAOLO 9/18: HE SENT THE LINK TO A FRIEND AND THE FIGHT EMBARRASSED HIM; the far
view looked good. Verbatim: records/BOHEMIA_PAOLO_SENT_THE_LINK_AND_THE_FIGHT_EMBARRASSED_HIM_9_18_26.md. Law: laws/BOHEMIA_ADDENDUM_THE_FIGHT_LOOKS_LIKE_THE_GAME_9_18_26.md, front-page RULE 17. THE FAR VIEW IS
APPROVED (COOK [city from above], the sky, DIRECTION's verdict; volume unlocked). THE FIGHT
IS A PICTURE PROBLEM (I looked at the frames the lanes took: a black dev bar, a checkerboard
of roof tiles for a floor, two tiny figures on a brown aim line, plates and a face in a
circle; not the street he was walking). STOP PRODUCING applied to COMBAT: frozen to the
look, [fight looks] first and only (same ground art at house scale, same bodies at the
ruled size, same light and cloud, no workshop, runs on a phone); DIRECTION [judge the
fight] first and standing (street frame beside fight frame every round, THE FIGHT VERDICT
on the front page); UI [fight hud] first; RUN's walk ends in the fight; the five minutes
now include the first fight. SWEPT IN PASSING (32 commits): EYES r8 re-measured on a
phone-shaped CPU: the first human being at 88.5 s, 174 s of the first 300 FROZEN, round
6's numbers were 5x optimistic; RUN [loading screen] part one (the door opens on the first
tap; it was offered at 0.4 s and the tap died); COMBAT [dev strip] SHIPPED (the strip was
a fifth of the screen and every button was a LIVE dev control over a stranger's fight);
LIFE+CITY: his block is NOT sealed (the instrument only walked straight lines; five presses
reach a road); QUESTS [light the pump] STOPPED with the measurement (one seed, the water
already runs, lighting a plant changes zero litres; the row is dead by its own gate ->
mark DEAD next round with ECONOMY's correction); PEOPLE [enemies remember]; WORLD [fold
carries]; SOUNDS [beat teaches]; CHARACTER [shape frozen]; COOK car r7 (16 -> 15);
PLUMBER: the fight budget would have accepted a 6x regression; ECONOMY Q45 (nobody is
told anything in the first minute, somebody who knows you wakes you).
THEN (ek) PAOLO 9/20: HE WANTS TO RESTART AND ASKS FOR HELP NOT TO. Verbatim: records/BOHEMIA_PAOLO_WANTS_TO_RESTART_9_20_26.md.
Law: laws/BOHEMIA_ADDENDUM_THE_PLAYABLE_CUT_9_20_26.md, front-page RULE 18: NO RESTART; the game got worse under a
rule that was a sentence; ONLY THREE THINGS SHIP until the playable cut holds: LOADING (RUN
[loading screen] first, his words: a real screen when the alpha opens, not into the RUN tab,
nothing tappable until loaded), WALKING (RUN [one camera] second: one walking camera, one
fixed body size that never changes on a pinch, a stride that lands on the next standable
place and never past a gap or into a wall; what shipped at 90ad7484 flips the body only at
HC 11 and jumps 5 cells into walls), THE FIGHT (COMBAT [fight looks] with his words: on the
EXACT tiles he stands on). EVERY OTHER BUILDING LANE HOLDS (MODE lines say so); research and
school continue. THE RATCHET IS A MACHINE: PLUMBER [never worse] first (the walk as numbers,
a worse push refused in the pre-push pass); EYES E27 [best cut] first (rank the last two
weeks of deployed cuts, name where walking regressed, RUN reverts and re-applies). NOBODY
SENDS THE LINK until I say the cut holds. Swept in passing (29 commits): RUN [step is a
house] both parts (camera to HC 11, a lot at 275 px, 1.4 lots on screen, the body trigger
flips at that stop; three pinches back from the map); COMBAT [dev strip] proved on the cut;
LIFE+CITY [side variants] 3 -> 36 tiles; WORLD [battery worth] r2 (supply fixed, work paid
not printed); COOK car r8 (16 of 16 at 1.000); PEOPLE [heir moment]; PLUMBER: the walk
number was a player pressed against a wall (the instrument met his bug before he did);
EYES r9; ECONOMY Q46 (the day is the right size, wrong unit); UI r10; WORDS Q5 school.
THEN (el) PAOLO 9/20: THE NOTES BUTTON. Verbatim: records/BOHEMIA_PAOLO_THE_NOTES_BUTTON_9_20_26.md. The vote-tab law gains
section 7: a tiny NOTES button top right in the demo; tap, a box over the game, the clock
pauses, he types, tap again and he is back where he was; every note carries the build
stamp, the mode, where he stood, the seconds in and a small frame; notes leave the phone
the road a vote does (registry + one .txt export he sends the manager) and the manager
reads them as rulings. UI [notes button] FIRST; rule 18f: his direct tiny asks ship under
the hold. His question answered: yes it makes sense.
THEN (em) PAOLO 9/20: A CARD IS NOT A QUEST. He opened the demo and the night card popped
up (frame records/target/PAOLO_THE_NIGHT_CARD_9_20_26.jpg; words records/BOHEMIA_PAOLO_A_CARD_IS_NOT_A_QUEST_9_20_26.md). LAW laws/BOHEMIA_LAW_A_QUEST_IS_PEOPLE_PLACES_AND_THINGS_9_20_26.md,
front-page RULE 19, CLAUDE.md law list: nothing pops up (wake, night, road cards as pop-ups
DEAD; the bookkeeping lives on the phone he opens); a quest exists only with a person with a
face who says it, a place, a thing and a visible result; text comes from a mouth with a
portrait; every lane answers WHO SAYS THIS, WITH WHAT FACE, STANDING WHERE. THE PLAYABLE CUT
gains a fourth thing, THE FIRST PERSON at his door: RUN [no pop ups] second, QUESTS [a
person asks] first (un-held for it), PEOPLE [face at the door] first (un-held), WORDS Q26
[the first ask spoken] first, UI [talk panel], PORTRAIT note. Also seen on his card:
BATTERIES IN THE VALLEY: 0 (the fixed supply landed empty; ruling 9 said one per head; WORLD
when the hold lifts). The gate for rule 19 is OWED.
THEN (en) PAOLO 9/20, SECOND FRAME: THE SNATCHER road card. "You don't got quests like that
for real... it can't just be these bullshit-ass text prompts... why were they even done?"
Verbatim records/BOHEMIA_PAOLO_THE_SNATCHER_CARD_9_20_26.md; frame records/target/PAOLO_THE_SNATCHER_CARD_9_20_26.jpg. Quest law section 8
and rule 19e: a text prompt is not an event; the road and walk directors stop opening cards
THIS ROUND; a moment fires only with a body on screen or not at all; the tables stay as
content. ALWAYS MAKE AN ATTEMPT amended: words are an attempt for a thing that exists on
screen, never a stand-in. WHY THEY WERE DONE, answered to him: 9/5 stand-ins for encounters
with no bodies, shipped as features under a law read as permission; the manager let text
count as shipped. RUN [no pop ups] moved to FIRST, this round, before the loading screen.
THEN (eo) PAOLO 9/20: "I need a portraits chat now? Remember it has to be connected to the
hairs and eye color and shit." Told him: open a fresh chat, type VAMILY, it becomes 20
PORTRAIT. PORTRAIT reordered: [matches body] first (his words on it), [faces first] second
(the person at his door), [blank faces] school third.

THEN (ep) PAOLO 9/20, THIRD MESSAGE OF THE SAME PLAY: "overwhelmed and underwhelmed at the
same time... not playable yet... a lot going on and I see it but this shit is broken right
now." Recorded verbatim (records/BOHEMIA_PAOLO_OVERWHELMED_AND_UNDERWHELMED_9_20_26.md).
Rule 18g LESS ON SCREEN on the front page and section 7 of the playable-cut law: the demo
cut shows only what the four things need (loading, the walking camera, the pad, the gear
with VOTE and notes behind it, the phone, the person who speaks, the fight); the cutter
strips the rail of chips, the job line, the feed, the toggles, the readouts, the dev strip
and every card from the DEMO until the cut holds; the alpha keeps everything. RUN [cut now]
carries it in the same push as [no pop ups]. Told him plainly it is not playable yet, no
defense, no new promises beyond the four things. Nothing to judge.
THEN (eq) PAOLO 9/20, THREE RULINGS IN ONE MESSAGE (records/BOHEMIA_PAOLO_BATTLE_BROTHERS_ON_MY_PHONE_ANALOG_HORROR_AND_THE_ALPHA_OPENS_IN_VOTE_9_20_26.md).
(1) "Battle Brothers on my phone, a lot better; not their chess match; quicker; focuses on
the player character; companions auto do stuff." Identity line recorded (CLAUDE.md pillar);
the BB addendum gains a 9/20 section; THE FIGHT VERDICT carries two numbers from now
(seconds cloud-to-over, his presses vs the companion's): notes on COMBAT [fight looks] and
DIRECTION [judge the fight]. (2) ANALOG HORROR FOR EVERY PIXEL AND EVERY SOUND until the
game is done, LOCKED: new law laws/BOHEMIA_LAW_ANALOG_HORROR_FOR_EVERY_PIXEL_AND_EVERY_SOUND_9_20_26.md
(what it is, what it is not: not a filter, not a monster, not a new reference game, not a
brightness slider; FFX sound amended by date; Machine Party is the bridge). Rule 20 on the
front page. DIRECTION [analog horror] first line (the bible), SOUNDS [analog horror sound]
first line, UI [analog horror ui], WORDS Q27, COOK [horror grime] held, EYES E28 [horror
check], notes on RUN [loading screen], PORTRAIT [faces first], COMBAT [fight looks].
(3) THE ALPHA OPENS IN THE VOTE TAB after the loading screen; the demo keeps VOTE behind
the gear: rule 15g, vote-tab law section 8, notes on RUN [loading screen] and UI [vote
tab]; rule 18a's wording updated. CLAUDE.md law list gains both lines. Nothing to judge.
THEN (er) PAOLO 9/20, CORRECTION: "You don't vote in the demo, you vote in the alpha only.
All I needed was a little hideaway note section while I played the demo. The alpha's first
tab is the vote section. Everything that needs my vote, aesthetic or philosophical, is
there. There's a UI chat and a 3-D chat: put the 3-D chat in the UI chat, and we're gonna
make all the UI look 3-D." (records/BOHEMIA_PAOLO_VOTE_IN_THE_ALPHA_ONLY_AND_THE_3D_CHAT_IS_UI_9_20_26.md)
Root cause: the manager built rule 15 on the 9/14 transcript's word "demo"; he judges in
the ALPHA. Fixed: vote-tab law section 9 overrides 1, 4 and 8 where they say demo; rule
15a corrected and 15g re-worded; rule 18g's demo list drops VOTE (the gear carries the
notes button only); UI [vote tab] removes the demo door and adds the manager's decided
defaults as votable items; RUN [cut now] strips VOTE from the demo cut; UI's MODE line
carries THE 3-D CHAT IS UI and ALL THE UI LOOKS 3-D; new UI [three d ui]; THE TWENTY CHATS
says a chat named 3-D is chat 11. CLAUDE.md law list corrected. (The (eq) block above was
deleted by a lane's whole-file rewrite between 43904cc2 and e7e9ab81 and is restored here;
rule 8 again.) Nothing to judge.
THEN (es) PAOLO 9/20: "I appreciate the deep psychological philosophical dive, but let's just
have some fun bro." The manager had answered "how much do you care about this analog horror
shit" with a three-part case and a lore fork (A/B/C: does the mystery get explained). The
fork is WITHDRAWN. Recorded (records/BOHEMIA_PAOLO_LETS_JUST_HAVE_SOME_FUN_9_20_26.md); law
section 8 and rule 20g: analog horror is a vibe for fun, not a thesis; no essays, no lore
about it, fun carries the tie. Manager's own note: keep direction replies to one line of why
and what got built. Nothing to judge.
THEN (et) PAOLO 9/21: "Horror analog, do stuff for that, for every chat" + VAMILY. Rule 20h
and law section 9: every one of the twenty chats has its own [horror ...] line (school for
the held, ships only where it touches the four things). THE ROUND (records/BOHEMIA_COORDINATOR_ROUND_9_21_26.md):
34 lane commits swept. SHIPPED: RUN [one camera] (one stop, one body size, stride never
misses: stuck 12/40 -> 0/45, gaps 14 -> 0; cost: no zoom-in while walking), UI [notes button]
(the pencil, demo top right), PORTRAIT [matches body] (23/200 two-coloured -> 0), COMBAT V222
(the fight lot is 16 tiles, row stays claimed), DIRECTION the bible + fight verdict r1, PLUMBER
NEVER WORSE in the suite, ECONOMY Q47, WORDS Q5 r2, COOK closed the pages-publish red. Rule 21
THE GROUND MAY ZOOM, THE PERSON MAY NOT (new law, from four lanes' measurements; fighter 37 px
vs 112). Two defaults of mine, both to VOTE as PHILOSOPHICAL: THE STEP IS A TAPE SKIP
(ANIMATION [tape skip], un-held) and THE LOADING SCREEN ENDS IN ONE BEGIN TAP with the first
sound on the tap (RUN [horror loading], SOUNDS [first sound], un-held). Swing: ECONOMY Q48
[who still bills]. New lines: RUN [land on it], [browser lines]; LIFE+CITY [sealed yards], [one
lot number]; PEOPLE [a name]; PLUMBER [bimodal dead]; PORTRAIT [shades on]; SOUNDS [footsteps
on the beat]; plus a [horror ...] line on every lane. Break list updated on the front page.
The thing he never opened: the notes button (TAB: CITY, top right of the demo). Nothing to judge.
THEN (eu) PAOLO 9/21: "I need the UI chat to be cooking up more... I'll enter the sound chat
and it's not even making fucking sounds. It's coding and checking whether the sounds are
broken or not... I need to be seeing them cooking up more, every time, not never."
(records/BOHEMIA_PAOLO_I_NEED_TO_SEE_THEM_COOKING_9_21_26.md). THE MANAGER'S FAULT: rule 18(b)
"spend the round measuring your part" turned SOUNDS into a checker (c88d7cc2). RULE 22 COOK
EVERY ROUND (laws/BOHEMIA_ADDENDUM_COOK_EVERY_ROUND_9_21_26.md): the hold is on the play
surface, not on the making; every making lane registers one real thing in the VOTE tab every
round or the round did not happen; reports lead with the thing; the vote tab plays sound.
Every held MODE line amended; SOUNDS [cook sounds] first (four sounds this round), UI [cook
panels] first (four 3-D panels this round) + [vote plays sound]; PLUMBER [cook gate]; the
playable-cut law section 3 amended; CLAUDE.md law list. Nothing to judge.
THEN (ev) PAOLO 9/21: "quest cards that don't do anything when I click on them... I still don't
see a note section anywhere, collapsible, that I can copy and paste into you." (records/BOHEMIA_PAOLO_CARDS_STILL_POP_AND_NO_NOTES_9_21_26.md)
Checked: RUN [no pop ups] still OPEN and unclaimed (RUN shipped [one camera] instead; the
manager's inserts had also pushed it down the section, fixed); UI's notes button shipped as a
5 px pencil he cannot find, exporting .txt. Rulings: the cards die THIS ROUND (the only thing
RUN does); UI [copy notes] first: the word NOTES top right, collapsible, COPY ALL to the
clipboard; vote-tab law section 7 amended; break list updated. Board order of RUN, QUESTS,
COMBAT, PORTRAIT, PEOPLE restored (first lines back on top). The live site cannot be read
from this container (HTTP 000); deploys are checked by the pages workflow. Nothing to judge.
THEN (ew) PAOLO 9/21: "there's no loading screen yet, I want a cool loading screen... glitchy
shit loading in, loading out, loading in between before I'm able to even touch anything...
maybe even a loading bar." (records/BOHEMIA_PAOLO_I_WANT_A_COOL_LOADING_SCREEN_9_21_26.md)
Rule 18h: the screen covers everything until the pad works, it is cool (analog horror, 3-D,
UI [cook panels] item 1 to RUN this round), it has a REAL progress bar, then BEGIN. RUN's
order is [no pop ups], [loading screen], [cut now]. Rule 18b's front-page text corrected to
rule 22. Playable-cut law item 1 amended; break list updated. Nothing to judge.
THEN (ex) VAMILY 9/21b, THE FIRST COOKING ROUND (records/BOHEMIA_COORDINATOR_ROUND_9_21_26_B.md): 46 lane commits swept. Rule 22
worked: 21 items from 11 chats into VOTE (registry 16 -> 37; 0 votes ever cast). SHIPPED to the
alpha (9/21c): PEOPLE [face at the door] + [a name] (the only face on screen was his; 61 of 61
strangers unnamed; the name door was a button on the killed card), SOUNDS [first sound] (the
room on the tap at 0.142 s) + footsteps (silent since 9/15: a comment inside the JSON), ANIMATION
[tape skip] (the glide died when the step became a house; TAPE default), DIRECTION verdict r2,
PLUMBER [cold read] + [cook gate], EYES E27 (no better cut to go back to; all eight frozen
95-96.6%). Cooked: UI 5 sheets, PORTRAIT the four family faces (a stranger meets ZERO faces in
five minutes; the cold open is unreachable), WORLD the first notice, COOK the fight floor bank,
QUESTS the wrong detail, FACTIONS the lit sign, CHARACTER two too-still bodies, ANIMATION the
idle redone, WORDS Q27 both rounds, ECONOMY Q48 r1 (nothing in this game arrives; the bill is
a prop). RUN AND COMBAT DID NOT RUN; his three asks sit on RUN's first three lines. Decisions
(to VOTE): the rig gets a real height range (CHARACTER [real height]); the first face is a
person who speaks after BEGIN (RUN [open reachable]); the tape skip's ship test is the game's
own curve; drab crews take the sign down. New: PLUMBER [driver says] first, UI [flaky leg],
WORDS Q28 [loading words] first, PEOPLE [family eyes], SOUNDS [beds play]; THE COOK LINE on
the front page. The thing he never opened: the VOTE tab in the alpha, 37 items, 0 votes.
Ask to him: open chat 01 RUN and type VAMILY.
THEN (ey) PAOLO 9/21: a playbook for his boss's personal-assistant UI, "all the sauce with UI,
everything we've learned... voting process, all our processes... don't mention the project or my
name... he's on the free version." Made exports/THE_JUDGE_QUEUE_PLAYBOOK.md and .html (published
as a page): the voting process, the registry schema, exporting verdicts (copy all, .txt), the
notes section, the process rules, the reply contract, the UI rules, verification, a ten-step
integration recipe, eleven blind spots, a free-tier chapter (one chat, one self-contained page,
paste in and out, the board as memory), two appendices. Zero names in the exports. Record:
records/BOHEMIA_PAOLO_A_PLAYBOOK_FOR_HIS_BOSS_9_21_26.md. Not a game ruling; nothing on the board.
THEN (ez) VAMILY 9/22 (records/BOHEMIA_COORDINATOR_ROUND_9_22_26.md): 39 lane commits. HIS TWO ASKS LANDED: RUN [no pop ups]
SHIPPED (demo 9/21f; one card opened at 2.5 s and never left, 544 presses moved him zero cells,
the demo was unplayable from the first frame; now 0 cards, 52 cells, 16/16 rows alive), UI
[copy notes] SHIPPED (alpha 9/21g, NOTES on the plate, toggles, COPY ALL). PLUMBER [bimodal
dead]: the 13 dead presses were a fight starting; the fight is in the ratchet. 19 items cooked
into VOTE by 13 chats (56 total, 0 votes). Findings: the person at his door already exists
(QUESTS), all twelve walk lines were narration (WORDS), the faces had two points of light out
of 255 and were lit on the wrong side (PORTRAIT), the valley has no kids and nobody old
(CHARACTER), the world swings 41 to 4 people and the screen draws 23 always (PEOPLE), Anarchists
hold all the live water (FACTIONS), the paper is placed not scheduled (ECONOMY Q48 done), the
registry conflicts every push, the surface is 261/260 MB on clean main. New: QUESTS [wire the
door] first (un-held, item 4), WORDS [swap the twelve] (un-held), LIFE+CITY [walk out]
(un-held), UI [registry split], PLUMBER [slim build] first + [push check], SOUNDS [seeded gate]
first, CHARACTER [ages] HELD, PEOPLE [honest crowd] HELD, WORLD [paper in the house] HELD,
ECONOMY Q49 [first battery]. Decisions to VOTE: the re-lit face ships with the first person;
the crowd follows the world's clock; the street gets ages; the paper is placed. COMBAT absent
two rounds; RUN's next line is the loading screen. Ask: open 04 COMBAT and 01 RUN, type VAMILY.
THEN (fa) PAOLO 9/22 played 9/21f in CITY MODE (records/BOHEMIA_PAOLO_CITY_MODE_9_22_26.md, frame records/target/PAOLO_CITY_MODE_9_22_26.png):
cannot find himself (LIFE+CITY [see me], un-held); cannot find NOTES, the bar overflows his phone
(UI [notes on screen]); the PHONE chip dies, the phone is the button (UI [phone is the button],
first); APPROVED the phone and the writing (WORDS volume unlocked); no loading screen (RUN next);
analog horror not visible yet (held in VOTE, said plainly); the peach dots are lamps on live
circuits, the tap readout will say so. Break list updated. Nothing to judge.
THEN (fb) PAOLO 9/22: "I don't need the whole world... I need the combat to feel like Battle
Brothers, a pistol a one-tile weapon, an assault rifle a two-tile weapon, quicker and funner,
infused with Rogue Fable... restart combat from the ground up? ... the Dead Eye Dial for
important parts." (records/BOHEMIA_PAOLO_COMBAT_LIKE_BATTLE_BROTHERS_QUICKER_9_22_26.md) RULE 23 + laws/BOHEMIA_ADDENDUM_THE_FIGHT_IS_BATTLE_BROTHERS_QUICKER_9_22_26.md: push the demo out (rule 18i); item 3 is
looks AND feels; reach lit on the tiles; no restart of the board, the rules rebuilt on it (reach
you can see, a turn is a beat, the dial only when it matters); NO DAMAGE BEFORE THE DIAL amended
(a routine hit costs one, the dial for the important shot). COMBAT [fight feel] second line
un-held; UI [fight hud] lights reach; DIRECTION's verdict gains a FEEL column; PLUMBER [fight
headroom] is the floor for quicker. CLAUDE.md law list. Nothing to judge.
THEN (fc) PAOLO 9/22: "THE LIST DID NOT LOAD, HTTP 404" on the VOTE tab, then "Im trying to
vote bro". CAUSE (records/BOHEMIA_TWO_DEPLOYS_RACE_9_22_26.md): two builders publish the site and race; GitHub's Jekyll
branch build SUCCEEDS now (~80 s) beside pages.yml and, obeying _config.yml's exclude list,
publishes no records/ and no *.json, so when it finishes last the registry 404s and the demo is
the committed cut. Shipped: include: [the registry] in _config.yml; CLAUDE.md's "noise"
sentence corrected; THE DEPLOY LINE on the front page; PLUMBER [list loads] re-aimed (post-deploy
fetch + an Actions-API leg). THE REAL FIX IS HIS CLICK: Settings -> Pages -> Source: GitHub
Actions. Asked.
THEN (fd) HE VOTED. 83 verdicts (38 up, 45 down) pasted 9/22, written into verdicts[] and
records/BOHEMIA_VOTE_VERDICTS_9_21_26.txt; every comment read as a ruling in records/BOHEMIA_PAOLO_FIRST_VOTES_9_22_26.md and
laws/BOHEMIA_ADDENDUM_THE_FIRST_VOTES_9_22_26.md: rules 24-30 (ONE GAME MODE no teleport; the vote tab
shows the thing; SLIDE now; the player does not speak Spanglish; the alpha's UI frozen at his
picks; text items are boring, make the pixels and the sound; more analog horror + the runway
names, nobody stands on anybody). New lines: COMBAT [one mode] first, UI [one hud] [the picks]
[inner votes], ANIMATION [slide now] [plays in vote], SOUNDS [room volume], PEOPLE [no clumping]
first [name mix], PORTRAIT [customizations first], CHARACTER [runway redo], WORLD [people charge],
WORDS [player speaks english], QUESTS [haggle like bb], COOK [footprints], DIRECTION [car
background]. Vote tab gate 27/1 (the gear-tap leg timed out at 90 s under load, the registry
legs pass).
THEN (fe) PAOLO 9/22: "in the alpha why does it open the run first thing, I told you to not have
that happen." Checked: no line opens VOTE at boot; RUN's BEGIN hands off to RUN; UI carried the leg
and did not build it; the manager wrote it on two rows and made it neither's first line. UI [alpha
opens on vote] is now UI's first line (rule 18f), RUN's loading screen note says wire it if UI is
not there first. records/BOHEMIA_PAOLO_THE_ALPHA_STILL_OPENS_ON_RUN_9_22_26.md. Nothing to judge.
THEN (ff) THE VAMILY AFTER HIS VOTES (9/23, coordinator, records/BOHEMIA_COORDINATOR_ROUND_9_23_26.md).
Six lanes claimed straight off a verdict (UI alpha opens on vote, PEOPLE no clumping + name mix,
QUESTS haggle like bb, SOUNDS room volume, WORLD people charge). Shipped: the loading screen holds
the load (RUN), the phone is the button + NOTES (UI), the first ask by name at 1.9 s with 0 cards
(QUESTS), tape skip filmed then overruled by SLIDE (ANIMATION), one fight one song + file:// gates
are blind (SOUNDS), companion on foot + weights (PEOPLE), walls + shelves (WORLD), shades (PORTRAIT).
Routed: PLUMBER [slim build] second (267 vs 260 MB, 67 MB dead weight), [deep history] (shallow
clone), [real surface] (gates over http); FACTIONS [track leg]; ANIMATION [spine bend]; DIRECTION
[density ruler] ruled by default; COMBAT DPR note; CHARACTER ages/heights un-held for the making.
First lines checked against his words. Registry 84 items, 83 verdicts, 1 waiting. His Pages-source
click still ends the deploy race. Nothing to judge.
THEN (fg) PAOLO 9/23: THE THREE ACTS AT ONCE. "Play all three at the same time and flip through
them... see the progress in the future from your past action... the city is built like shit because
you're not making enough of an impact in your earlier act... this is a pretty big fucking deal... we
might have to dedicate a whole chat to it... do big brain research on games that have done this."
Rule 31 on the front page; laws/BOHEMIA_LAW_THE_THREE_ACTS_AT_ONCE_9_23_26.md; his words in
records/BOHEMIA_PAOLO_THE_THREE_ACTS_AT_ONCE_9_23_26.md. DYNASTY IS THE WHOLE CHAT (school then
build, [three at once] first). Ocarina of Time = this only, in CLAUDE.md. Rows on WORLD, LIFE+CITY, UI,
QUESTS, WORDS, PORTRAIT, CHARACTER, SOUNDS, DIRECTION, ECONOMY Q50, PLUMBER, all behind DYNASTY's
school. Two defaults in VOTE as verdicts (the flip on the phone; three names at the start). The
coordinator's research pass: records/BOHEMIA_DYNASTY_SCHOOL_THE_THREE_ACTS_AT_ONCE_ROUND_ZERO_9_23_26.md.
The demo does not change (rule 18). Nothing to judge beyond the two VOTE lines.
THEN (fh) THE VAMILY AFTER THE THREE ACTS (9/23b, coordinator, records/BOHEMIA_COORDINATOR_ROUND_9_23_26_B.md). Shipped: RUN the
cut (27 -> 13 on the first screen; the driver had never pressed BEGIN, every lane measured through the
splash), UI the phone in his pocket + the alpha opens on VOTE, PEOPLE rumours travel (the city could
not gossip; two people who stand together see each other now), COMBAT V224 (the fighter is 112 on the
glass; the canvas was the lie), QUESTS the picket ask as a picture, SOUNDS a run sounds like a walk
(ruled: ship the line, walking is un-held), PLUMBER head blind (58 blocks recoverable), PORTRAIT 22
dials, LIFE+CITY proved EYES' dead verbs. Routed: PLUMBER [no markers] FIRST (two conflicted registries
reached main in one round), [one driver] (three lanes patched the driver; PLUMBER owns it); COMBAT
[hidden frame] + register V224; UI [phone black]; PEOPLE [bubble face]; PORTRAIT [dead dials]; CHARACTER
[become red]; RUN [way back] first. Front page: COOK LINE 107/83/24 waiting, DEPLOY LINE (the fetch step
failed the bad push, as designed), BREAK LIST, SUITE LINE reds on clean main. His click still ends the
race. Nothing to judge beyond the 24 waiting in VOTE.
THEN (fi) VAMILY 9/24 (coordinator, records/BOHEMIA_COORDINATOR_ROUND_9_24_26.md). Shipped: DYNASTY school round one (three
valleys cost nothing, the risk is three sets of obligations; one live clock, the flip resumes), WORLD
found three of four ledgers carry no act (cooked the same corner at act 1 and act 3), ECONOMY Q50 done
(the fold is a ratchet; the ruin is integer subtraction on counts; queue refilled Q51 Q52), PEOPLE the
creditor still stands, SOUNDS the flip sound (and the band helper leaks 21%), ANIMATION the hand in
front, COOK footprints r2, DIRECTION the door passes as a direction, WORDS voice pass 39 -> 14, EYES
MERGE DEBRIS + six of seven controls live, LIFE+CITY proved the real bug is the opening banner in the
alpha shell eating every finger across the top of the game. Routed: RUN [banner eats fingers] FIRST;
PLUMBER [covered controls]; WORLD [act stamp] first; FACTIONS [territory ledger]; UI [door fixes]; WORDS
[lexicon frozen]; SOUNDS [band helper]. Ruled by default: dies of age past 70 in the next act (VOTE);
the ruin subtracts on dark streets (DYNASTY design); the thirteen shapes are not his to assign; the
band helper's changed sounds are redos. 31 items wait for him. Nothing else to judge.
THEN (fj) HE VOTED AGAIN (9/23 in the tab, pasted 9/24): 31 verdicts, 20 up, 11 down, now in verdicts[]
(114 of 123 judged, 9 waiting). Rule 32 on the front page; laws/BOHEMIA_ADDENDUM_THE_SECOND_VOTES_9_24_26.md; his words
records/BOHEMIA_VOTE_VERDICTS_9_23_26.txt; the reading records/BOHEMIA_PAOLO_SECOND_VOTES_9_24_26.md. THE BIG ONES: nothing is forced and
nothing happens in the first second (PEOPLE [creditor waits] first); the game STARTS in the ruin and
the future gets better, reclaimed and techy (my subtraction default is dead; WORLD [future city], DYNASTY
[the derive] re-aimed); the phone is in the city view only and is a cracked iPhone (UI [phone city only]
first; the pocket phone reverted); the three names come prepared like Battle Brothers; NO SAND (SOUNDS
[not sand] first; the noise recipe is dead); show it from the game's camera (the cook gate's leg); the
hand at the face killed twice, graveyard. CLAUDE.md carries the line; the three-acts law has section 9.
THEN (fk) VAMILY 9/24c (coordinator, records/BOHEMIA_COORDINATOR_ROUND_9_24_26_B.md). Shipped: RUN [way back] (a gesture that crosses a
seam is finished; one out, one back, the squeeze lands on his block), SOUNDS [not sand] (a footstep with
no noise generator; its own band ruler was lenient by 51x; a run sounds like a run on the walked surface;
28 redos), ANIMATION what tweaking was (an envelope faster than the twelve drawn keys; four envelopes
shipped) + the hand at the face graveyarded + facing you he did nothing, UI [phone black] (a lock-screen
face until the page paints) + the pocket phone reverted, COMBAT V225 (the frame moves the ground, not the
person; 112 at every width; rule 21's fight leg closed; [fight looks] SHIPPED; [hidden frame] RETIRED,
its premise was false), EYES E22 school (a red has no age). Routed: ANIMATION [facing you]; PLUMBER [one
driver] now has three customers and beats [covered controls]; RUN [banner eats fingers] unclaimed twice,
flagged. CLAUDE.md: AN ENVELOPE RAMPS SLOWER THAN THE GRID. 13 items wait for him. Nothing else to judge.
THEN (fl) PAOLO 9/24, AN EXECUTIVE DECISION: THE OVERWORLD IS BATTLE BROTHERS. "Economic apocalypse
Battle Brothers on my phone with a better story." Rule 33; laws/BOHEMIA_LAW_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md; his words records/BOHEMIA_PAOLO_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md.
The valley is crossed on a map (party marker, tap to travel, the clock runs, roads faster, parties roam
and leave tracks); DEFAULTS in VOTE: the map is the city view we have, the street is where you arrive.
Events on the road stay (a face, 2-3 choices, never in the first minute; amends 32a for the map only).
The fight: RF4 first, BB flavour, house tiles, THE MOUND is the only terrain effect. The demo's walking
becomes travel + arrival (RUN [bb map] first, then [banner eats fingers]). EVERY CHAT has a [bb ...]
school line, continuously, his ask; the coordinator's round zero: records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_MAP_ROUND_ZERO_9_24_26.md. CLAUDE.md pillar and reference
lines amended. 15 items wait for him.
THEN (fm) PAOLO 9/24: "think about everything... what needs to get cut... excavated from the files...
built from the ground up using assets we already have." THE REVAMP LIST: records/BOHEMIA_THE_REVAMP_LIST_9_24_26.md (KEEP / CUT / REBUILD
per system, the order, the excavation rule). Rule 33h; THE CUT LINE on the front page; CUT rows on RUN
([fast travel], [travel map], [tap walk], [land on it], [cold open]), LIFE+CITY [builder mode], QUESTS
[asks stream]; new: RUN [excavate the walk], PLUMBER [excavate], COMBAT [weapon shapes] (the machine gun is
the greatsword, rule 33i), DIRECTION [newgrounds] (NAMED by him: 'an old flash game website', the look's
era inside the bible; CLAUDE.md reference line; records/BOHEMIA_PAOLO_NEWGROUNDS_AND_THE_MACHINE_GUN_9_24_26.md). The list is in VOTE as one line.
THEN (fn) PAOLO 9/27: "go through the Battle Brothers wiki and download everything or remember everything,
all the stats." THE LIBRARY: reference/library/battle_brothers/README.md, ten volumes written from memory (every number tagged recall) because
the fleet cannot fetch the wiki (network policy, HTTP 000). Rule 33j: every [bb ...] line reads the library
first and cites it. PLUMBER [bb library] is the download tool for the day the two hosts are allowed. His
click: allow battlebrothers.fandom.com and battlebrothersgame.com in the environment's network settings.
records/BOHEMIA_PAOLO_DOWNLOAD_THE_BATTLE_BROTHERS_WIKI_9_27_26.md
THEN (fo) PAOLO 9/27: TWO SCALES, ONE GAME. "Your character stays tiny even as you zoom out and you move one
grid at a time, that we had originally; zoom out and you get the bigger map so it feels like Battle
Brothers... one house doesn't equal one tile, it's all fucked up... restart the whole enchilada... the demo
is still not playable from the very beginning." Rule 34; laws/BOHEMIA_LAW_TWO_SCALES_ONE_GAME_9_27_26.md; records/BOHEMIA_PAOLO_TWO_SCALES_THE_TINY_CHARACTER_9_27_26.md. The tiny one-cell character on an
HONEST GRID (floor/wall/door/cover/prop, the drawing agrees), the fight on that grid (RF4's grid), the map
one squeeze away. SUPERSEDED: THE STEP IS A HOUSE, the tile half of the batteries law; rule 21 re-read (one
size = one cell); the 112 art is an asset. Revamp list amended (the fight board and the walked surface move
to REBUILD). First lines: WORLD+LIFE+CITY [honest grid] (one block, his), COMBAT [fight on the grid],
CHARACTER [small body], ANIMATION [small clips], COOK [cell tiles], RUN [two scales]; DIRECTION [two scales
look], PLUMBER [grid budget]. Defaults in VOTE (a 32 px cell, one-cell person, 4x4 house). THE FIRST SIXTY
SECONDS ARE A GAME.
THEN (fp) PAOLO 9/27 asked which model each chat should run on (he ran out of credits with the whole swarm
on Opus 5). The recommendation, records/BOHEMIA_PAOLO_CREDITS_AND_WHICH_MODEL_PER_CHAT_9_27_26.md: Fable 5.1 for the coordinator only; Opus 5 for RUN, COMBAT, WORLD, UI,
PLUMBER (+LIFE+CITY during [honest grid]); Sonnet 5 for every school lane and every cook to a spec; ten lanes
on a VAMILY every second round during the grid rebuild; and the coordinator's own job: fold the 190-line
front page into a tight page next round, because every lane pays for it every round.
THEN (fq) PAOLO 9/27: "I don't want a single thing from the quest chat implemented... continuously do research
on our quest library... do we still have that? double check." CHECKED: all there (questbook/ 244 files, 152
quests, four masters, the 3,672-finding index, 22 teardowns, 58 designed quests). Rule 35: QUESTS IS RESEARCH
ONLY; laws/BOHEMIA_ADDENDUM_QUESTS_IS_RESEARCH_ONLY_9_27_26.md; records/BOHEMIA_PAOLO_QUESTS_IS_RESEARCH_ONLY_9_27_26.md. The QUESTS section rewritten to MODE: RESEARCH with six library questions ([bb events]
first, [twist bank], [across the ages], [the ask in a place], [first sixty], [phone flaws]); builders cite its
pages. A fresh chat whose first word is 'quests' takes lane 19; DYNASTY goes home.
THEN (fr) PAOLO 9/27: QUESTS works AT VOLUME (not one question a round, not three): a filed library of quest
designs by act/event/crisis/boom for months from now; the shape is Battle Brothers simplified at your pace: one
main quest, contracts you take or leave, once taken you finish, DECLINING IS FREE. Rule 35b-d; records/BOHEMIA_PAOLO_QUESTS_AT_VOLUME_AND_THE_BB_SHAPE_9_27_26.md. He asked
for blind spots: eight, each routed (records/BOHEMIA_THE_BLIND_SPOTS_9_27_26.md): no story yet, no hover on a phone, two clocks, the asset cliff,
nothing to hand a friend for weeks, five references on one screen, saving three acts, declining vs a world that
remembers. New rows: QUESTS [contracts at your pace], ECONOMY Q53 [two clocks].
THEN (fs) PAOLO 9/27: "450 hours to master Battle Brothers' combat... this shit gotta get deep... quicker, less
of a chess puzzle... 20% chance to die, else a debilitating injury 30 to 40 days... a chat for fine-tuning the
numbers... a chat for mod-friendly code... difficulty sliders... no blind spots." Rule 36; laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md; records/BOHEMIA_PAOLO_450_HOURS_THE_FIGHT_GETS_DEEP_9_27_26.md. TWO NEW
CHATS on the board: 21 TUNING (every felt number in one table, the death rule, the sliders, the origins'
difficulties; SCHOOL THEN TUNE) and 22 MODS (the data line, a mods/ folder; SCHOOL THEN BUILD with PLUMBER); a
fresh chat whose first word is 'tuning' or 'mods' takes it. COMBAT [formation] and [gambits] (FF12), CHARACTER
[attachments], PEOPLE [origins] + the injured. The death default is in VOTE. The order: the grid first; the
schools run beside it. CLAUDE.md lane list and law list.
THEN (ft) HE VOTED A THIRD TIME (9/27 in the tab, pasted 9/28): 55 verdicts into verdicts[] (169 of 180). Rule 37;
laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md; records/BOHEMIA_PAOLO_THIRD_VOTES_9_28_26.md; records/BOHEMIA_VOTE_VERDICTS_9_27_26.txt. SIX COORDINATOR DEFAULTS FELL: NO ATARI (the 32 px cell and one-cell sprite are dead; tile
OPTIONS first: WORLD + COOK [tile options] first lines); PLACES ARE SETTLEMENT SCREENS (RUN [settlement screen];
on foot only in the fight and the Strip; the pad is dead elsewhere); THE FUTURE GOES BOTH WAYS; THREE GENERATIONS
ALWAYS; HOME BASES AND ROAMING PARTIES not territory (FACTIONS [home bases] first); SQUARE GRID. Also: the main
character never dies, veterans 10%; high ground is a roof; ANIMATION [glide] first; PORTRAIT [head and gear]
first; TUNING [lifespans]; WORLD [scavenge], [creatures]; the flip is a big transition unlocked mid-act; sounds
have 'the reverb of a glass jar'. CLAUDE.md law list; the two-scales, overworld and second-votes laws amended.
THEN (fu) HE SAID IT AGAIN, HARDER (9/28): 'fully committed... a revamp... pretty much like Battle Brothers... how many pixels the Battle Brothers map is, that exact same number at the bare minimum, now... your character moving tile to tile throughout the city, not anymore, immediately.' Rule 38; overworld law s12; two-scales law s9; third-votes s17; records/BOHEMIA_PAOLO_THE_MAP_AT_BB_PIXELS_AND_NO_TILE_TO_TILE_9_28_26.md. DIRECTION [bb density] first (measure the number); RUN [no city walk] first (the walked city off the play surface, arrival is a settlement screen); PLUMBER [density leg]; [honest grid], [small body], [small clips], [fight on the grid], [tile options] all re-aimed at the fight ground and the Strip. Two coordinator defaults in VOTE (the phone's full pixel count as the floor; the Strip as the only walked place). He asked which chats to open: quests, tuning, mods. Registry 183 items, 169 verdicts.
THEN (fv) HIS NEXT TWO MESSAGES (9/28): 'I meant traverse not reverse' (record and rule 38 fixed); then 'all the assets we were creating for the zoomed-in walk, tile by tile, even the sidewalk, are going to be used for the combat, don't get confused; never a street fight where one tile is one sidewalk; quests is already running; tuning right now I see as big brain research, same with mods, how other games do it with big complex frontier coding.' Overworld law s13, fight-gets-deep law s7, rule 38 e/f/g, CLAUDE.md. TUNING and MODS are MODE: RESEARCH (build nothing until he says); the house-sized fight tile is dead for good (COMBAT owes the gate); every walked-city asset is the fight's ground (RUN archives the walk, not the tiles). One more coordinator default in VOTE. records/BOHEMIA_PAOLO_THE_ASSETS_ARE_THE_FIGHTS_GROUND_AND_TUNING_MODS_ARE_RESEARCH_9_28_26.md.
THEN (fw) I READ IT BACKWARDS AND HE CAUGHT IT (9/28): 'in combat the boards and the tiles are as big as parts of the city, a house is one tile, I've told you this millions of times... we're getting rid of walking the city tile by tile, each tile a sidewalk, for the exploration... for the combat a tile is as big as a house.' A COMBAT TILE IS A HOUSE stands in full; the cell-grid FIGHT (rule 34's fight leg, COMBAT V227-V229) was my reading and is dead; the one-cell sprite, the small clips and the honest grid as a fight ground are RETIRED; the walk's banks DRESS the house tiles; the mound is a roof tile. Overworld law s14 (s13b reversed), two-scales law s10, the batteries law's fight half live again, CLAUDE.md pillar, rule 38 and rule 34 lines corrected. COMBAT [house tiles back] first line. One coordinator default in VOTE (the Strip walks with the 112 art). records/BOHEMIA_PAOLO_A_COMBAT_TILE_IS_A_HOUSE_I_READ_IT_BACKWARDS_9_28_26.md.
THEN (fx) LORE YAP (9/28): what the flip is story- and tech-wise (upload? genes? a 'technological box' twist?), 'it has to make sense story wise and technology wise... more fun with this'; the crash cause restated (a cool technology on an international house of cards = 7/24 LOCKED #2); 'is narration possible?' Holes pulled (upload not real by 2045; genes fall to 25%/12.5%; a recorded past kills rule 31's re-derive and fights the three-faces phone). ONE QUESTION OPEN to him: A the machine derives the future from records (realism-first default), B a plain change of protagonist, C the box twist. Three-acts law s10; emerging-tech addendum restated. Rows: DYNASTY [the frame] school only, WORDS [the cause], ECONOMY [the bubble], SOUNDS [read aloud] (default in VOTE: the phone's own voice reads the machine's text). records/BOHEMIA_PAOLO_LORE_THE_FLIPS_TECHNOLOGY_AND_NARRATION_9_28_26.md.
THEN (fy) HIS LONG ONE (9/28): no flip at the start (one person customized; the next generation customized at the first hop, generated from the first); the Amalgamation is the real villain, good/bad/neutral, different endings, a twist if any is the ending's; the signal-travel / Moon idea as DYNASTY school; the company question answered by default (THE COMPANY INHERITS, heirs, ~12 an act, 36 lives a game; in VOTE); MODDED VANILLA++ BATTLE BROTHERS vibe, never a rip-off; BUILD IT, DON'T ASK (combat builds the house-tile fight now, no school round); Assassin's Creed named for the frame/ending twist only, 'possibly'. Rule 39; three-acts law s11; CLAUDE.md reference line and pillar line. Rows: DYNASTY [one then heirs] first, [heirs], [the ending]; TUNING [recruit odds]; notes on [the flip], [three names], [naming screen], [three faces], [bb company], [house tiles back]. records/BOHEMIA_PAOLO_ENDINGS_THE_COMPANY_ACROSS_ACTS_NO_FLIP_AT_START_BUILD_IT_9_28_26.md.
THEN (fz) HIS HOLE (9/28): what happens to a man's line when he dies in one act. Answered by the three-acts law s2(c) applied to people (new s12): past deaths remove the line forward; future deaths touch nothing in the past; the past re-derives the roster, never the future's deeds. DYNASTY [heirs] and TUNING [recruit odds] carry it. records/BOHEMIA_PAOLO_WHEN_A_MAN_DIES_IN_ONE_ACT_9_28_26.md.
THEN (ga) HOUSE-SIZED, NOT HOUSE-FILLED (Paolo 9/28): the tile's size is a house, its content is whatever that piece of the city is; the board must read as the city with streets and neighbours. Overworld law s15; rule 38h; notes on COMBAT, COOK, WORLD, DIRECTION. records/BOHEMIA_PAOLO_A_TILE_IS_HOUSE_SIZED_NOT_EVERY_TILE_IS_A_HOUSE_9_28_26.md.
THEN (gb) THE HOURS GO TO THE WORLD (Paolo 9/29): BB spends its hours on the chess board; we lean into FASTER combat and a deep, rich, interactable, BUILDABLE world. Rule 40; fight-gets-deep law s8; CLAUDE.md pillar. Defaults in VOTE: a routine fight inside 90 s of beats, a boss inside 4 min; building inside a home base's settlement screen, lot by lot (LIFE+CITY [build a lot] first line; the separate builder stays cut); the fight under a third of playtime (EYES [where the minutes go]); TUNING [fight length]. records/BOHEMIA_PAOLO_FASTER_COMBAT_DEEPER_BUILDABLE_WORLD_9_29_26.md.
THEN (gc) HE CORRECTED THE NUMBER (9/29): tough BB battles run 30 to 40 minutes; my 90 seconds was invented and is dead; ours shorter than BB even when tough: routine 2 to 4 min, tough 8 to 15, never past 15; tough = enemy level, enemy gear, or your mistake (TUNING's three dials). Fight-gets-deep law s9; rule 40a rewritten; the old VOTE item marked dead, a new one in. records/BOHEMIA_PAOLO_TOUGH_BATTLES_ARE_30_40_MINUTES_9_29_26.md.
THEN (gd) SWAP A MASTERY PAST 11 (Paolo 9/29): a veteran past level 11 swaps one weapon mastery at a training ground for batteries and days (default in VOTE); the wider rule: what BB players mod in is vanilla here. Fight-gets-deep law s10; rule 40e; TUNING [respec]; MODS [what mods fix]; RUN note. records/BOHEMIA_PAOLO_SWAP_A_WEAPON_MASTERY_PAST_LEVEL_11_9_29_26.md.
THEN (ge) HIS SCREENSHOT OF THE CITY VIEW (9/29): 'I should def be seeing the player character on this screen; all those little circles should be icons or people.' Ruling: the party marker on the map now; every circle becomes a place icon or a moving party; COOK's cooked markers and land cut go live with RUN [bb map] this round (the hold lifted for the map by his ask). Rule 40f. records/BOHEMIA_PAOLO_I_SHOULD_SEE_MYSELF_ON_THE_MAP_9_29_26.md.
THEN (gf) PIXELS ON A PHONE, FLASH/ROBLOX, PROCEDURAL (Paolo 9/29): yes on the iPhone with a cached map per zoom (PLUMBER [native map]); flash-friendly is a budget, 10 MB and 5 s (PLUMBER [flash light]); Roblox not a reference, not a port now; the world is rolled per new game on Vegas's real bones (WORLD, FACTIONS, RUN notes). Rule 40g. records/BOHEMIA_PAOLO_PIXELS_ON_A_PHONE_FLASH_ROBLOX_AND_PROCEDURAL_9_29_26.md.
THEN (gg) BUDGET MODE (Paolo 9/29, 53% used on Tuesday): Opus for RUN, COMBAT, PLUMBER, WORLD, LIFE+CITY only; Sonnet for the other sixteen; VAMILY this week only to the eight on the critical path. Rule 40h. records/BOHEMIA_PAOLO_53_PERCENT_ON_TUESDAY_BUDGET_MODE_9_29_26.md.
THEN (gh) NO ROUND RATIONING (Paolo 9/29: 'make sure at all times these chats have important jobs'): the standing duty is every lane's first live row is an important revamp job; swept: WORLD [tile options] un-retired (bad string match) and [the roll] added; PEOPLE [recruit at the place], [heirs backgrounds]; ECONOMY [prices per place], [contract pay], [build costs]; MODS [keep list into defaults], [one weapon file], [read count]; COMBAT and COOK his-ask rows moved to the top. records/BOHEMIA_PAOLO_EVERY_CHAT_HAS_AN_IMPORTANT_JOB_AT_ALL_TIMES_9_29_26.md.
THEN (gi) BE ON TOP OF IT (Paolo 9/29): rule 41, the manager adds what his words imply, researched, the same reply; nine implied jobs added: RUN [road events], CHARACTER [barber], PEOPLE [long injury], UI [roster], [market screen], DIRECTION [flip look], COOK [settlement art], PLUMBER [travel gate], [event gate]. Settings: the model is saved on the chat, both directions. records/BOHEMIA_PAOLO_BE_ON_TOP_OF_IT_THE_MANAGER_ADDS_WHAT_HIS_WORDS_IMPLY_9_29_26.md.
THEN (gj) THE BEASTS ARE LAB-MADE (Paolo 9/29): rule 42, law laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md; the BB bestiary count is the floor (12 factions, ~75 types, 17 beasts, 3 bosses: records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_BESTIARY_COUNT_9_29_26.md); the de-extinction research with the valley's own fossils (Tule Springs, Gypsum Cave) and the thrive table: records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_DE_EXTINCTION_ROUND_ZERO_9_29_26.md; act one feels medieval. Rows: COMBAT [bestiary], WORLD [creatures] canon, FACTIONS note, COOK [beasts] held, DIRECTION note; one default in VOTE. CLAUDE.md law list.
THEN (gk) WHERE YOU BUILD (Paolo 9/29, stuck): default A, you build what you hold and holding grows block by block; Pocket City 2 edit-everything is not this game. Rule 43; fight-gets-deep law s11; notes on LIFE+CITY, FACTIONS, WORLD, COMBAT; one default in VOTE. records/BOHEMIA_PAOLO_WHERE_CAN_YOU_BUILD_BASE_SETTLEMENT_OR_EVERYTHING_9_29_26.md.
THEN (gl) THE LAB COULD BE A STATE OR TWO OVER (Paolo 9/29): the Vegas lab is one source; nature spread the rest along real corridors; the acts are waves of arrival; WORLD's file carries origin, corridor, arrival act. Beasts law s3 amended; rule 42e. records/BOHEMIA_PAOLO_THE_LAB_COULD_BE_A_STATE_OR_TWO_OVER_9_29_26.md.
THEN (gm) THE INVASIVE LENS (coordinator 9/29, his 'do you need more research'): round one with real precedents and tiers; notes on WORLD [creatures], COMBAT [bestiary], LIFE+CITY [build a lot]; rule 42f. records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_ONE_THE_INVASIVE_LENS_9_29_26.md.
THEN (gn) ROUND TWO OF THE BEASTS (his 'are you bullshitting me', 9/29): dinosaurs via bird atavism, swarms (killer bees as the real lab escape), microbes, plants, birds (Haast's eagle), the water; rows ECONOMY [what grows], PEOPLE [the plague]; notes on WORLD and COMBAT; rule 42g. records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_TWO_DINOSAURS_INSECTS_PLANTS_BIRDS_MICROBES_9_29_26.md.
THEN (go) ROUND THREE, THE SEVENTEEN (his 'one more round', 9/29): the lab's own designs, the keepers, sizes on the house tile, worth, and the seventeen named; research closed at four rounds; rows PEOPLE [keepers], ECONOMY [what a beast is worth]; notes WORLD, COMBAT, COOK; one default in VOTE; rule 42h. records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_SEVENTEEN_9_29_26.md.
THEN (gp) THE PAD IS TRAVEL SPEED, THE PORTRAIT IS THE MENU, TEXT NEVER OVERLAPS (Paolo 9/29): rule 44; UI [speed pad] and [portrait menu]; PLUMBER [no overlap] gate; RUN [demo text] first line; one default in VOTE (PAUSE 1x 2x 3x 5x). records/BOHEMIA_PAOLO_THE_PAD_IS_TRAVEL_SPEED_THE_PORTRAIT_IS_THE_MENU_NO_TEXT_OVERLAPS_9_29_26.md.
THEN (gq) THE TWO VOICES (Paolo 9/29): the AI-slop narrator (events and the machine's text, creepy, never a person's line) and the 7/21 squiggle for people with per-person variations; 'AI slop analog horror' a named strand of the bible. Rule 45; analog horror law s10; SOUNDS [read aloud] ruled, [squiggle variations]; DIRECTION [ai slop]; WORDS [narrator lines]; the read-aloud VOTE item closed. records/BOHEMIA_PAOLO_TWO_VOICES_THE_AI_SLOP_NARRATOR_AND_THE_SQUIGGLE_9_29_26.md.
THEN (gr) MECHANIC FIRST, SKIN SECOND (Paolo 9/29): the seventeen BB beast rule sets exact as COMBAT's first deliverable (the Ifrit splits and blasts = the swarm); the manager's recall table records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_SEVENTEEN_BEAST_MECHANICS_9_29_26.md; beasts law s6; rule 42i. records/BOHEMIA_PAOLO_THE_BEAST_ARCHETYPES_EXACTLY_AS_BATTLE_BROTHERS_9_29_26.md.
THEN (gs) NO TWO BOARDS ALIKE, RECREATE BB WITH OUR SWAG (Paolo 9/29): rule 46; the inventory records/BOHEMIA_THE_COMBAT_BOARD_ASSETS_WHAT_WE_HAVE_AND_WHAT_WE_NEED_9_29_26.md (fifteen terrains x eight kinds; the nature half barely exists; desert, shore, hills, ruin first); COMBAT [board generator], WORLD [board terrains], COOK [board assets]; CLAUDE.md pillar. records/BOHEMIA_PAOLO_NO_TWO_COMBAT_MAPS_ALIKE_RECREATE_BB_WITH_OUR_SWAG_9_29_26.md.
THEN (gt) WEAPONS MECHANIC FIRST (Paolo 9/29: 'is the handgonne a bazooka now?'): the BB weapon classes and our arsenal records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_WEAPON_CLASSES_AND_OUR_ARSENAL_9_29_26.md (the handgonne is the shotgun, the mortar the bazooka); ammunition scarce in act 1 (TUNING [ammo]); rule 46d; COMBAT [weapon shapes] note. records/BOHEMIA_PAOLO_WHAT_GUN_IS_THE_HANDGONNE_WEAPONS_MECHANIC_FIRST_9_29_26.md.
THEN (gu) MOSTLY CITY, A BLOCK WAR (Paolo 9/29): the cook order reversed to city gaps first; his weapon anchors pistol = dagger, machine gun = two-hander; rule 46e; notes on COOK, COMBAT x2, WORLD. records/BOHEMIA_PAOLO_MOSTLY_CITY_A_BLOCK_WAR_PISTOL_IS_A_DAGGER_9_29_26.md.
THEN (gv) THE SIX RESOURCES AND THE GUNS DECIDED TOGETHER (Paolo 9/29): rule 47; fight-gets-deep law s12; ECONOMY [six resources] first line; UI note; COMBAT [weapon shapes] becomes research then VOTE items per class, his pick is canon; the weapon 'anchors' softened to examples. records/BOHEMIA_PAOLO_FIVE_RESOURCES_LIKE_BATTLE_BROTHERS_AND_GUNS_DECIDED_TOGETHER_9_29_26.md.
THEN (gw) THE WEAK TIER (Paolo 9/29): crossbows and real melee as BB's weaker weapons, needed when the ammo is gone; into COMBAT [weapon shapes]' options and TUNING [ammo]; rule 47c. records/BOHEMIA_PAOLO_CROSSBOWS_AND_MELEE_ARE_THE_WEAK_TIER_9_29_26.md.
THEN (gx) EVERYTHING TRANSLATED (Paolo 9/29): rule 48; the translation table records/BOHEMIA_THE_BATTLE_BROTHERS_TRANSLATION_TABLE_9_29_26.md (62 rows, owners, status); COMBAT [perks translated], PEOPLE [followers], [ambitions], EYES [translation count]. records/BOHEMIA_PAOLO_EVERYTHING_NEEDS_A_PROPER_TRANSLATION_9_29_26.md.
THEN (gy) VAMILY 9/30 (the sweep 41c2b9f..HEAD, 442 commits): records/BOHEMIA_COORDINATOR_ROUND_9_30_26.md. The demo opens on the map and a tap is how you travel (RUN e4c66f2b, demo 9/28i); the cell board is deleted and the high ground is a house with its roof (COMBAT V231/V232); the circles are places at the map floor (COOK r4); the fight draws his art 2.6x too coarse (COOK r2 + DIRECTION): COMBAT [device canvas] new; the family faces are black on the first screen: DYNASTY [one then heirs] takes UI's proved line; PLUMBER retries the excavate move (PAGES PUBLISH red on size); the coordinator's 14 VOTE items lacked sha/show and were the vote tab's red since 9/28, fixed. Front page: DEPLOY, SUITE, CUT, COOK lines rewritten. Registry 242/169/74 waiting.
THEN (gz) GROK AS A RESEARCH HELPER (Paolo 9/30): reference/BOHEMIA_GROK_BRIEF.md and reference/BOHEMIA_GROK_ASKS.md; rule 49; he pastes the brief and the asks, pastes the answers back, the coordinator files them 'source: Grok, unverified'; first asks are the Battle Brothers numbers the sandboxes cannot fetch.
THEN (ha) THE ZOOM RANGE (Paolo 9/30, five Pocket City 2 screenshots at reference/pocket_city_2/): rule 50; Pocket City 2's department widened to the drop-in transition and the zoom range; RUN [zoom range] first, EYES [zoom range measured], UI and RUN notes; his phone's profile 1170x2532 at 3x is the fleet's. records/BOHEMIA_PAOLO_POCKET_CITY_2_THE_ZOOM_RANGE_9_30_26.md. THEN (hb) BOTH ORIENTATIONS (his sixth shot, 9/30): rule 50b; UI [landscape]; PLUMBER's driver gains the landscape profile; EYES measures both. THEN (hc) ONE MAIN QUEST, TWO CONTRACTS, THE PHONE ONLY SHOWS (Paolo 9/30): rule 51; quests addendum s9; UI [phone contracts]; notes on RUN, QUESTS, ECONOMY. records/BOHEMIA_PAOLO_ONE_MAIN_QUEST_TWO_CONTRACTS_THE_PHONE_ONLY_SHOWS_9_30_26.md. THEN (hd) GROK IS C (Paolo 9/30: 'grok gotta know everything everything, not a two pager i didnt approve'; then 'Lets do c'): rule 49b; laws/BOHEMIA_ADDENDUM_AN_OUTSIDE_HELPER_KNOWS_EVERYTHING_9_30_26.md; the master pack reference/BOHEMIA_MASTER_FOR_GROK.md rebuilt every VAMILY by reference/build_grok_master.py; the brief rewritten as the how-to-work page; asks 11-12 standing; reference/library/grok/ opened; EYES [grok filter], PLUMBER [grok filter gate], DYNASTY [grok lore], TUNING/MODS/QUESTS [grok sources]. records/BOHEMIA_PAOLO_GROK_IS_C_IT_KNOWS_EVERYTHING_AND_DIGS_ON_ITS_OWN_9_30_26.md. THEN (he) HE SAW THE FIGHT'S FLOOR (Paolo 10/1: 'the tiles below the people dont look good... its all fucked up'): rule 46f; the break list's first line; COMBAT [house tiles back] is the floor with [device canvas] as step one; COOK [board assets] floor first; DIRECTION FIGHT VERDICT 21 floor only; EYES [fight floor measured]; RUN cuts no failing fight; registry fight-floor-first-10-1. records/BOHEMIA_PAOLO_COMBAT_IS_FUCKED_UP_THE_TILES_BELOW_THE_PEOPLE_10_1_26.md. THEN (hf) GROK ON LINKS, NOT PASTES (Paolo 10/1: 'make something public for it to enter'): rule 49c; the way in is one link to reference/BOHEMIA_GROK_PASTE.md; the way out is Grok's share link, readable only once grok.com is allowed in the environment (his laptop click; sandbox blocked from grok.com and x.com, measured). records/BOHEMIA_PAOLO_HELL_NAH_MAKE_SOMETHING_PUBLIC_FOR_GROK_TO_ENTER_10_1_26.md. THEN (hg) GROK WRITES THROUGH ITS GITHUB CONNECTOR (Paolo 10/1: 'what tool can I give Grok to write in the repo? I'll connect a tool with it'): rule 49d; Grok writes reference/library/grok/ on branch grok, never main, never a PR; the coordinator pulls origin/grok every VAMILY; PLUMBER [grok fence]; 49c's share-link route dropped. records/BOHEMIA_PAOLO_WHAT_TOOL_CAN_I_GIVE_GROK_TO_WRITE_IN_THE_REPO_10_1_26.md. THEN (hh) BIGGER JUMPS (Paolo 10/1 with VAMILY: 'combat and the run make bigger jumps every chat... im getting this demo released'): rule 52; COMBAT and RUN MODE: SPRINT with a jump list of three to four whole features; THE RELEASE LINE on the front page (ten lines, RUN refreshes); RUN [release list]. records/BOHEMIA_PAOLO_BIGGER_JUMPS_COMBAT_AND_THE_RUN_THE_DEMO_RELEASE_10_1_26.md. THEN (hi) GROK'S FIRST PAGES PULLED (rule 49e): the beast table and what-I-found, on main in reference/library/grok/; EYES stamps; notes on TUNING/MODS/QUESTS/WORLD/WORDS/RUN/DYNASTY; SOUNDS [dead battery], ECONOMY [price of mercy]; two coordinator defaults in VOTE; the brief's flip and reference lines fixed; asks round two. THEN (hj) THE 10/1 SWEEP: 73 commits read, 11 rows marked SHIPPED, the four lines rewritten, THE RELEASE LINE added, records/BOHEMIA_COORDINATOR_ROUND_10_1_26.md; the next sweep starts after this commit. THEN (hk) THE FOURTH VOTES (Paolo's 9/30 export, read 10/1, 17 new verdicts landed in the registry, 186 now): rule 53, 22f (two sentences max, UI [two sentences], PLUMBER [two sentences leg]), 38j (assets for the fight and the close zoom only), 46g (street width in tiles); TUNING [difficulty sliders] and MODS [keep list into defaults] RETIRED; renown is clout; the speed pad is the old dial; COOK's kit and FACTIONS' base re-shown from the game's camera. laws/BOHEMIA_ADDENDUM_THE_FOURTH_VOTES_10_1_26.md; records/BOHEMIA_PAOLO_THE_FOURTH_VOTES_NOT_A_LOT_OF_GOOD_AND_TWO_SENTENCES_MAX_10_1_26.md. (The commit 0d34eb6a carried only the index and the master; this commit is its body.) THEN (hl) SWEEP B 10/1 (51a573bd and its body): COMBAT V234+V235 (blobs gone, real pixels; JUMP 1 half), DYNASTY [heirs] and PEOPLE [followers] SHIPPED, UI r9 six in the bar, FACTIONS r5 raid at the gate, ECONOMY beast worth, QUESTS r7, CHARACTER barber; Grok's economy and roster pages pulled, the six piles in VOTE (grok-reported-six-piles-10-1), rule 47 stands; EYES owes four stamps. records/BOHEMIA_COORDINATOR_ROUND_10_1_26_B.md. THEN (hm) SWEEP C 10/1: zero lane commits since B (the chats had not run); Grok's weapons page and rewritten roster pulled (five pages, zero stamps); rule 49f (Grok-reported rulings become VOTE defaults marked VIA GROK); three items registered (the car is the handgonne, the dead are chipped bodies, the first fight's six weapons); records/BOHEMIA_GROK_REPORTED_RULINGS_10_1_26.md. THEN (hn) SWEEP D 10/1: still zero lane commits; Grok's range, house-tile and weapon-types pages pulled (eight pages, zero stamps); melee is the next tile and spends nothing, Cut B, in VOTE (grok-cut-b-melee-spends-nothing-10-1); notes on COMBAT [weapon shapes], TUNING, WORLD [tile options], EYES. THEN (ho) SWEEP E 10/1: still zero lane commits (five sweeps); Grok's chip-body and how-a-fight-runs pages pulled (ten pages, zero stamps); Grok's 9 AP conflicts with EVERYTHING COSTS ONE, noted on COMBAT [fight feel]; the chip-body defaults on [bestiary]; his crossing-the-map ask answered (records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_CROSSING_THE_MAP_10_1_26.md). THEN (hp) THREE CHATS RUN (Paolo 10/1: 'only combat, the run and eyes and ears, that's it'): rule 54; every other lane MODE: PAUSED; the three pull what they need (COMBAT the floor tiles, RUN the two-sentence rewrite and the settlement screen, EYES the stamps and the measurements). records/BOHEMIA_PAOLO_ONLY_COMBAT_THE_RUN_AND_EYES_RIGHT_NOW_10_1_26.md. THEN (hq) EYES JUDGES VISUALS AND SOUNDS ONLY (Paolo 10/1): rule 54a; the Grok stamps are the coordinator's, all ten pages stamped PASSED FILTER; [translation count] retired; the release measurements are RUN's. records/BOHEMIA_PAOLO_EYES_JUDGES_VISUALS_AND_SOUNDS_ONLY_10_1_26.md. THEN (hr) COMBAT 2 AND RUN 2 (Paolo 10/1 asked; rule 55): two new sections on the board with a hard file split (COMBAT 2 = the floor art; RUN 2 = the vote tab rewrite and the settlement screen); Grok's burst of 12 pages pulled and stamped (22 pages), the slice sheet in VOTE as grok-first-fight-slice-10-1 with his locks winning over 9 AP and the one-man death. records/BOHEMIA_PAOLO_DO_I_NEED_COMBAT_2_AND_RUN_2_10_1_26.md. (4656592a crashed mid-script after RUN 2's header shadowed RUN's; the coordinator's section finder now anchors on the header's '  ('.) THEN (hs) SWEEP F 10/1: EYES shipped [zoom range measured] r1 (metres per pixel) and horror r15; Grok's hire sheet, settlement menu, wiki rounds 1-2 pulled and stamped (26 pages); the building list on RUN 2 [settlement screen]; the perk cut on COMBAT [perks translated]. THEN (ht) SWEEP G 10/1: ANIMATION shipped [facing you] while paused (noted, counted); Grok's wiki rounds 3-4 and bulk 1-2 pulled and stamped (30 pages): every enemy's HP and every weapon's AP on COMBAT [bestiary]. THEN (hu) THE FIFTH VOTES (45 verdicts, 231; rule 56; laws/BOHEMIA_ADDENDUM_THE_FIFTH_VOTES_10_1_26.md): the sidewalk is real-sized (an eighth), the ground is 45 degrees, no authored first fight, beasts must survive the Mojave (mammoths out; a boss is never an animal), who dies flat 20%, fight length as long as it needs, mods' keep ideas go to their lanes, the retinue bought once, settlements hold everything, the alpha's customization screen is not the game's. COMBAT 2 [floor set] SHIPPED with round two open; RUN 2 [settlement screen] SHIPPED; EYES [zoom range measured] r2. THEN (hv) HE PLAYED THE DEMO (Paolo 10/1: the fight never ended, no way back; why a straight street): rule 57; RUN [fight returns] first line; COMBAT owns the end condition; [board generator] is JUMP 2; COMBAT 2 a sheet per board kind, cul-de-sac and desert first; the break list's first line. records/BOHEMIA_PAOLO_COMBAT_DIDNT_END_AND_WHY_A_STRAIGHT_STREET_10_1_26.md. THEN (hw) THE ONE-FILE LOOP (Paolo 10/1: 'remake Battle Brothers right now... one sentence... you're breaking my heart'): rule 58; RUN TWO [one file loop] first (its queue was empty); paper suspended for that file; COMBAT TWO [cover pieces] SHIPPED; RUN TWO settlement r2; Grok bulk 5 stamped. records/BOHEMIA_PAOLO_REMAKE_BATTLE_BROTHERS_RIGHT_NOW_YOURE_BREAKING_MY_HEART_10_1_26.md. THEN (hx) EVERY FLOOR TILE IS A TRANSLATION (Paolo 10/1): rule 59 amends rule 33's one terrain effect; the school page records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_ITS_TRANSLATION_10_1_26.md; the tile table is a data file for COMBAT [board generator]; Grok ask 15; CLAUDE.md's pillar line fixed. THEN (hy) THE REEL (Paolo 10/1: the Instagram page, 'this has to look so cool', no progress on the map's pixels): rule 60; RUN [map pixels now] second line, [the reel] third; release-list line 11; EYES judges the reel. records/BOHEMIA_PAOLO_THE_INSTAGRAM_REEL_IT_HAS_TO_LOOK_SO_COOL_10_1_26.md. THEN (hz) SWEEP J 10/1: RUN TWO [one file loop] SHIPPED (f63e19eb, the whole loop, driver 12/0); COMBAT V238 cover is a thing; COMBAT TWO round three the cul-de-sac and the desert wash; Grok's wiki core text dumped (CC BY-SA, attribution added, cite never paste), the terrain numbers confirmed on the school page; the release line refreshed. THEN (ia) 'I WANT THE DEMO' (Paolo 10/1): RUN [fold the loop] first line; the demo's play surface becomes RUN TWO's one-file loop; the link does not change. THEN (ib) THE DEMO BLOCKERS IN HIS ORDER (Paolo 10/1): rule 61; RUN [the front door], [the valley edge], [quest line] = remove, [map pixels now] one round; COMBAT [board size]; Grok ask 16. records/BOHEMIA_PAOLO_HOW_LONG_UNTIL_THE_MAP_HAS_THE_PIXELS_THE_DEMO_BLOCKERS_10_1_26.md. THEN (ic) THE SCREEN DECIDES THE LAYOUT; THE FIGHT OPENS ZOOMED OUT ON A PHONE (Paolo 10/1): rule 62; RUN [screen fit]; COMBAT [fight camera]; EYES measures four classes. records/BOHEMIA_PAOLO_IPHONE_VS_IPAD_VS_COMPUTER_THE_FIGHT_ZOOM_IS_BROKEN_10_1_26.md. THEN (id) SWEEP K 10/1: no lane commits; Grok's nine pages (the battery rate, the price floor, wages, the hire row, gear comes with) pulled and stamped, the whole wiki as tarballs; two VIA GROK items in VOTE (ten crowns one battery; see the hire); notes on ECONOMY, PEOPLE, RUN TWO. THEN (ie) START COMBAT OVER (Paolo 10/2: 're-create Battle Brothers combat'): rule 63; COMBAT MODE: REBUILD with one row [rebuild], one new file slices/BOHEMIA_FIGHT.html, the wiki's rules exactly, our house tiles and weapons; the old fight frozen; COMBAT TWO cuts sheets at the new board size. records/BOHEMIA_PAOLO_START_COMBAT_OVER_RECREATE_BATTLE_BROTHERS_COMBAT_10_2_26.md. THEN (if) THE DIAL IS NEXT, NOT DEAD (Paolo 10/2): rule 63a; kept whole; the first addition after the rebuilt fight plays. records/BOHEMIA_PAOLO_I_STILL_WANT_THE_DIAL_AFTER_THE_BATTLE_BROTHERS_FIGHT_IS_PERFECT_10_2_26.md. THEN (ig) 12 ON THE FIELD, 20 HELD; THE ENEMY AI IS PART OF THE REBUILD; WHAT STAYS AFTER IT IS PERFECT (Paolo 10/2): rule 63b-c. records/BOHEMIA_PAOLO_12_OR_16_ON_THE_FIELD_WHAT_STAYS_AFTER_WE_PERFECT_IT_10_2_26.md. THEN (ih) THE NUMBERS ARE THEIRS, EXACTLY, AS DATA (Paolo 10/2): rule 63d; COMBAT extracts the wiki into records/target/bb/ JSON before the first line of fight code; a gate traces every felt number. records/BOHEMIA_PAOLO_ALL_THE_NUMBERS_AND_STATS_PLAY_A_HUGE_PART_10_2_26.md. THEN (ii) SWEEP L 10/2: COMBAT [rebuild] SHIPPED (the fight started over and plays; round two: words off the ground, mixed board kinds); RUN [fold the loop], [the front door], [the valley edge], [quest line] SHIPPED; COMBAT TWO eight boards; RUN TWO screen fit; Grok food pages; the release line refreshed. records/BOHEMIA_COORDINATOR_ROUND_10_2_26.md. THEN (ij) THE NEW FIGHT IN THE DEMO NOW AND ONE SONG AT A TIME (Paolo 10/2): rule 64; RUN [the new fight in the demo] and [one song] first. records/BOHEMIA_PAOLO_IS_THE_NEW_COMBAT_IN_THE_DEMO_AND_TWO_SONGS_AT_ONCE_10_2_26.md. THEN (ik) THE MAP BIGGER AND BETTER ZOOMED OUT, FIRST (Paolo 10/2, the fourth time): rule 65; RUN [map pixels now] moved to the first line with the painted far end. records/BOHEMIA_PAOLO_THE_MAP_GRAPHICS_BIGGER_AND_BETTER_ZOOMED_OUT_FOR_A_FAT_MINUTE_10_2_26.md. THEN (il) SWEEP M 10/2: COMBAT [rebuild] round two (words off the ground, mixed kinds dealt, 38/0) and [perks translated] round 1 (fifty translated, 37 live) SHIPPED; COMBAT TWO round ten verified in the fight; Grok's food picks stamped; RUN has not pushed since the valley edge. THEN (im) HIS FIRST GOOD WORD ON THE FIGHT; ONE MAN IS NOT A WALL, TWO ARE; CHARACTERS LARGER; A START SCREEN (Paolo 10/2): rule 66; COMBAT [rebuild] round three; RUN [the start screen]. records/BOHEMIA_PAOLO_COMBAT_LOOKS_BETTER_WALK_THROUGH_ONE_NOT_TWO_BIGGER_CHARACTERS_A_START_SCREEN_10_2_26.md. THEN (in) SWEEP N 10/2: THE REBUILT FIGHT IS THE DEMO'S FIGHT (RUN fd016146, BUILD 10/2h); COMBAT [perks translated] round 2 (44 live); COMBAT TWO round eleven mixed seeded boards; the freeway stall routed to COMBAT; Grok stall goods stamped; the release line refreshed. Still owed on RUN: the map's pixels (65, first), the start screen (66), one song (64). THEN (io) SWEEP O 10/2: COMBAT TWO round twelve (cross streets through whole columns, lamps and drums as night pools); Grok's water pages stamped; no other lane pushed. THEN (ip) THE SIXTH VOTES (91 verdicts, 10/2; rule 67; laws/BOHEMIA_ADDENDUM_THE_SIXTH_VOTES_10_2_26.md): the UI is the biggest concern (the fight's HUD stripped, icons for perks, the settlement screen like Battle Brothers'); the fight holds (cars raise defence by count, a recap screen, fights left to right); the heirs are made on entering the act (the three names at the door are dead; 42%); tuning copies Battle Brothers; mods at boot dead; sounds quieter; beef and crime rows; Grok asks 17-18. (72ee207a carried the registry, the law and the first notes; this commit the rest.) THEN (iq) THE COMBAT UI'S SIZES (Paolo 10/4): the school page records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_COMBAT_UI_SIZES_AND_ICONS_10_4_26.md (their layout and materials, our 44-point thumb sizes); rule 67a; COMBAT [rebuild] round three's HUD; Grok ask 19. THEN (ir) A FIGHT COMES FROM A PARTY YOU CAN SEE (Paolo 10/4): rule 68; RUN [you can flee]; the loop's 'crews stop the march' removed; Grok ask 20. records/BOHEMIA_PAOLO_YOU_SEE_THE_PARTY_AND_YOU_CAN_FLEE_10_4_26.md. THEN (is) ALL THE CHARACTER ART LIVE IN THE GAME, THE NEW FIGHT INCLUDED (Paolo 10/4): rule 69; COMBAT round three draws every fighter from the bank; RUN TWO's hire row the same. records/BOHEMIA_PAOLO_I_WANT_ALL_MY_CHARACTER_ART_LIVE_IN_THE_GAME_10_4_26.md. THEN (it) THE FAR STOP LOSES THE LAND; PASS ONE OF YOUR OWN; AUTO IS FAR (Paolo 10/4 with a screenshot): rule 70; RUN [the valley edge] round two; COMBAT round three's blocking; Grok ask 21. records/BOHEMIA_PAOLO_ZOOMED_OUT_THE_VALLEY_GOES_AWAY_PASS_ONE_OF_YOUR_OWN_AUTO_IS_FAR_10_4_26.md. THEN (iu) ONE LIGHT OVER THE VALLEY AND THE CITY (Paolo 10/4): rule 70a; RUN [the valley edge] round two's light gate. records/BOHEMIA_PAOLO_THE_VALLEY_AND_THE_CITY_SHARE_ONE_LIGHT_10_4_26.md. THEN (iv) SETTLEMENT TRAITS; VIBE CODED AS A DEFECT; GROK'S STANDING PLUMBING ASK (Paolo 10/4): rule 71; RUN TWO displays traits, FACTIONS rolls them; EYES names vibe-coded tells; Grok ask 22. records/BOHEMIA_PAOLO_SETTLEMENT_TRAITS_VIBE_CODED_AND_THE_UNDERGROUND_PLUMBING_10_4_26.md. THEN (iw) THE SETTLEMENT SCREEN IS ONE PAINTED PLACE (Paolo 10/4): rule 71a; RUN TWO round three first; COMBAT TWO gives it the block sheets. records/BOHEMIA_PAOLO_THE_SETTLEMENT_BUILDINGS_MUST_LOOK_LIKE_PART_OF_THE_PLACE_10_4_26.md. THEN (ix) THE DEMO'S BAR AND THE BLIND SPOTS (Paolo 10/4): rule 72; records/BOHEMIA_THE_BLIND_SPOTS_OF_THE_WHOLE_ENCHILADA_10_4_26.md; release lines 12-14; RUN [first load], [demo end], [a stranger plays]; the Switch truth. THEN (iy) THE DEMO SET IS EIGHT (Paolo 10/4 asked which chats): rule 54b; UI, SOUNDS, WORDS opened DEMO ONLY with one row each; EYES to be run. records/BOHEMIA_PAOLO_WHICH_OTHER_CHATS_FOR_THE_DEMO_10_4_26.md. THEN (iz) THE DOUBLE MUSIC WAS ON THE OLD FIGHT ONLY (Paolo 10/4): rule 64a; RUN [one song] looks at the old fight's door first, then the map-to-new-fight hand-off; SOUNDS puts the volumes and the new fight's sounds first; the walk gate stays. records/BOHEMIA_PAOLO_THE_DOUBLE_MUSIC_WAS_ON_THE_OLD_FIGHT_ONLY_10_4_26.md. THEN (ja) SWEEP P 10/4: 21 lane commits read (COMBAT round three whole through the night lights; COMBAT TWO rounds 13-17 with the settlement pictures; RUN the map at the phone's pixels SHIPPED, the near end is the block, the valley edge round two; RUN TWO the buildings are the buttons, round four open as one painted place); 56 Grok pages pulled and stamped, seven VIA GROK defaults in VOTE, the ask list re-ordered with his 'stop copying the wiki'; the four lines and the break list rewritten; 14 sheets wait for his thumb. records/BOHEMIA_COORDINATOR_ROUND_10_4_26.md. The next sweep starts after this commit. THEN (jb) HE PLAYED THE DEMO (Paolo 10/4): 'combat is night and day... I'm liking the direction'; his second good word on the rebuilt fight; the direction confirmed, nothing re-opened, every open line stays open. records/BOHEMIA_PAOLO_THE_FIGHT_IS_NIGHT_AND_DAY_I_LIKE_THE_DIRECTION_10_4_26.md. THEN (jc) NIGHT IS A COLOUR, NOT A DARKNESS; PLAYABLE IN THE SUN (Paolo 10/4: loves the night and the street lights; too dark at its darkest; must play outside at full brightness): rule 73; the school page records/BOHEMIA_SCHOOL_PLAYABLE_IN_THE_SUN_10_4_26.md with the floor (ground median >= 20 percent of white, 3 to 1, 4.5 to 1, the 25 percent glare test, a brightness slider in SETTINGS); COMBAT [night you can read], EYES [night in the sun measured], PLUMBER [sun gate], notes on RUN, COMBAT TWO, UI; VOTE night-you-can-read-in-the-sun-10-4. records/BOHEMIA_PAOLO_I_LOVE_THE_NIGHT_BUT_I_MUST_PLAY_IT_IN_THE_SUN_10_4_26.md. THEN (jd) SWEEP Q 10/4: six lane commits (COMBAT the fight on every screen class; COMBAT TWO round eighteen with the pictures' nights; UI round one the fight's bar finished; WORDS six fixes in a review file for RUN; SOUNDS the new fight's music door fenced and three ambiences down); SOUNDS and COMBAT TWO rows marked; RUN told to apply WORDS' file; PLUMBER [one engine boot]; 25 sheets wait; no new Grok pages. records/BOHEMIA_COORDINATOR_ROUND_10_4_26_B.md. The next sweep starts after this commit. THEN (je) 'THEY DON'T HAVE JOBS' (Paolo 10/4): rule 74, A JOB IS AN OPEN ROW; the coordinator's 'round N open' inside shipped rows and one-row MODE lines left COMBAT TWO, RUN TWO, WORDS and COMBAT with nothing OPEN (proven by WORDS 57de4732 and RUN TWO's rounds); every running lane now has three OPEN rows at the top as its jump list and a MODE line that says so; the sweep ends with an open-row check; PLUMBER owes [open row gate]. records/BOHEMIA_PAOLO_THEY_DONT_HAVE_JOBS_WHAT_THE_FUCK_IS_WRONG_WITH_YOU_10_4_26.md. THEN (jf) SWEEP R 10/4: COMBAT the night readable (84/0), COMBAT TWO round nineteen ([night boards] SHIPPED), RUN [one song] SHIPPED on both doors, SOUNDS round two the fight's sounds, UI the settings card built, EYES sourced the sun page; rule 73a (2 to 1 under glare, a man with his rim); Grok 109-110 stamped, the hit-chance constants to COMBAT; 30 sheets wait; the open-row check passes. records/BOHEMIA_COORDINATOR_ROUND_10_4_26_C.md. The next sweep starts after this commit. THEN (jg) SWEEP S 10/5: three claims (COMBAT [your formation], RUN TWO [one painted place], WORDS [the fight's words]), nothing shipped yet; rule 74 proven; deploy 2723 SUCCESS; no new Grok pages. records/BOHEMIA_COORDINATOR_ROUND_10_5_26.md. The next sweep starts after this commit. THEN (jh) THE ORIGIN SETS THE COMPANY AND THE ROAD SETS THE ENEMY (Paolo 10/5): rule 75 a-e (origins build the company and the field cap from origins.json; parties sized by the math, never 12 v 12, a few thugs first; 68a time stops in sight; a market; weapons say what they do); RUN [the origin sets the company] FIRST and [a few, not twelve]; COMBAT [the enemy math], [weapons say what they do]; RUN TWO [the market]; WORDS [the weapons' lines]; Grok asks 10 and 22 first; VOTE a-few-not-twelve-10-5. records/BOHEMIA_PAOLO_THE_ORIGIN_SETS_THE_COMPANY_AND_THE_ROAD_SETS_THE_ENEMY_10_5_26.md. THEN (ji) SWEEP T 10/5: the demo opens on a title (RUN 4 of 5 + UI's look), your formation set before FIGHT (COMBAT), every building changes the fight (COMBAT TWO), travel sounds cooked and the map frame found silent (SOUNDS; RUN [the map hears]), EYES' instrument measured the nights (rule 73b: the absolute median dropped, the man's rim is COMBAT's leg); the traits rows split; Grok 111 the spawn math to COMBAT and RUN; 42 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_5_26_B.md. The next sweep starts after this commit. THEN (jj) STILL GLITCHY, NO INVENTORY, TILES LIKE LEGOS, THE OPENING SCREEN IS AWESOME BUT 40 SECONDS, MENU MUSIC (Paolo 10/5): rule 76 the inventory (RUN TWO [the inventory], UI [item icons]); rule 77 tiles are Legos (COMBAT TWO [tiles are legos] FIRST, a seam gate); 66a the title in two seconds (RUN [first load] first after the origin; PLUMBER opened DEMO ONLY, rule 54c, [first load]); SOUNDS [the title's music] first; the opening screen confirmed; VOTE the-title-in-two-seconds-10-5. records/BOHEMIA_PAOLO_GLITCHY_NO_INVENTORY_TILES_LIKE_LEGOS_AND_THE_OPENING_SCREEN_IS_AWESOME_10_5_26.md. THEN (jk) SWEEP U 10/5: COMBAT [the enemy math] SHIPPED (the party as handed, dressed by tier), RUN TWO [the market] SHIPPED, UI [the settlement's labels] SHIPPED, WORDS the seven real weapon lines, SOUNDS the weather on the map tab; RUN [the map hears] narrowed; Grok 112-114 to COMBAT; 47 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_5_26_C.md. The next sweep starts after this commit. THEN (jl) SWEEP V 10/5: eight ships (the fifteen origins build the company; the 36-slot bag; 310 item icons; every weapon's card; the title's music r1; the settlement's words with a times-ten pay bug; EYES: the man at 45 px on wide screens); COMBAT [the man stays 112 on wide screens] FIRST; RUN TWO [the pay times ten] FIRST; the company travels as data, RUN never edits the fight file; Grok 115-121 routed; 52 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_5_26_D.md. The next sweep starts after this commit. THEN (jm) ALL CHATS RUN AND THE BOARD FITS THE PARTY (Paolo 10/9): rule 78 lifts every pause (every lane MODE: RUN, three OPEN rows at the top, written this turn for WORLD, LIFE+CITY, ANIMATION, CHARACTER, PORTRAIT, PEOPLE, FACTIONS, DIRECTION, COOK, ECONOMY, DYNASTY, TUNING, MODS, QUESTS; new first rows for COMBAT [the board fits the party], COMBAT TWO [boards by size], RUN TWO [climbing], WORDS [the enemies' names], EYES [a stranger's five minutes judged]); rule 79 the fight board is cut to the parties and the camera opens on the lines at 112. The 10/5 ships since sweep V (a few not twelve, tiles are legos, settlement traits, the enemy plays its part, six icons and the map's bar, the settlement's sounds) are marked by their lanes. records/BOHEMIA_PAOLO_GIVE_JOBS_TO_ALL_CHATS_AND_THE_COMBAT_MAP_DOESNT_NEED_TO_BE_SO_BIG_10_9_26.md. THEN (jn) THE FREEWAY AND THE STREETS (Paolo 10/9): rule 77a, one road kit, no wall across a road, judged beside I-15; COMBAT TWO [the freeway redone] FIRST; notes on DIRECTION, COOK, EYES. records/BOHEMIA_PAOLO_THE_FREEWAY_AND_THE_STREETS_LOOK_LIKE_DOG_SHIT_10_9_26.md. THEN (jo) SWEEP W 10/9: no lane commits since rule 78; Grok 122-127 (origins, ambitions, the crisis, XP, levels) stamped and routed; two VIA GROK defaults; 61 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_9_26.md. THEN (jp) BETTER THAN BATTLE BROTHERS (Paolo 10/9 with VAMILY): rule 80 a-c (the soundscape, narration on demand, a house you give a fuck about); the standing list opened; SOUNDS [the soundscape] FIRST, [the narrator] widened; FACTIONS [a house you give a fuck about] FIRST; UI's toggle; Grok asks 23-24; sweep X: eleven claims, RUN TWO's pay bug fixed, TUNING's sources checked; RUN TWO [the posts screen] and [the bar] added. records/BOHEMIA_PAOLO_SO_MANY_SOUNDS_NARRATION_AND_FACTIONS_WE_CAN_BEAT_BATTLE_BROTHERS_10_9_26.md. records/BOHEMIA_COORDINATOR_ROUND_10_9_26_B.md. THEN (jq) SWEEP Y 10/9: DYNASTY's act state SHIPPED; Grok 128-135 routed (stars, backgrounds, kits, medicine, ammo); 'the turns are too short' VIA GROK and COMBAT [a turn you can read]; EYES [the soundscape judged]; 67 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_9_26_C.md. THEN (jr) SWEEP Z 10/9: five ships (the price table, the living map, followers corrected, the settlement's night sounds, 160 enemies named); rule 81 (folklore beasts become machines) as a VOTE default; RUN TWO rounds down; PLUMBER [proof shots churn] and the marker leg; WORDS [the keepers' lines]; 70 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_9_26_D.md. THEN (js) SWEEP AA 10/9: seven ships (the freeway redone, the board fits the party, EYES' five minutes r1, the difficulty steps, ten road events, the data schema page); WORDS topped up with three unblocked rows; WORLD [the roads], RUN TWO [the clinic]; 78 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_9_26_E.md. THEN (jt) SWEEP AB 10/9: nine ships (boards by size, the tiers dressed, the stash, the machines renamed, heirs on entry, the bar, the felt numbers, the god gear rolled not placed, COOK's far-end measurement: 9,216 pixels); rule 65a (the far stop counted in pixels; RUN takes COOK's tiles and paintings; EYES counts) and 22g (run the vote gate before registering); RUN [the far end at two million pixels] FIRST, [a tap on the place opens it]; Grok 136-139 stamped; 95 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_9_26_F.md. THEN (ju) SWEEP AC 10/9: twenty ships; EYES found a wiped phone skips the title (RUN [a fresh phone sees the door] FIRST); PLUMBER measured 85 s to NEW GAME (RUN [first load] second, the far end third); DIRECTION's fight verdict (COMBAT [the art at its own pixels], COMBAT TWO [the freeway round two]); the real-material question for sounds in VOTE; 113 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_9_26_G.md. THEN (jv) SWEEP AD 10/9: sixteen ships (PLUMBER's load round two, the old fight stood down, the map verdict, the future boards, the town's people, ground effects, built on the map, the pictures painted, armour tiers, the posts, the sheets checked, the far-stop detector, the frame, the glass face, price of mercy, the wash board); RUN TWO [the finished pictures in] FIRST plus two rows, TUNING [the roll tables]; RUN idle since 07:41 holds the first minute; 130 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_9_26_H.md. THEN (jw) SWEEP AE 10/9: eighteen ships (the frozen fight out of the demo page, the far-stop count and its noise blind spot, the man at his size on every screen, the freeway round two, climbing, the enemy faces, the keepers speak, the shot kicks, the origin crews, built on the board, the flip look, WORLD's corrected premise, the freeway kit, the buy sound, recruit odds, what grows); Grok 140-143 stamped, one VIA GROK default; WORDS, EYES and TUNING topped up; RUN idle since 07:41; 150 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_9_26_I.md. THEN (jx) SWEEP AF 10/10: fourteen ships (a fresh phone sees the door, struck down, the long injury, the finished pictures with people, the first beast, the props, three block families, four phones, prices per place corrected, raids make traits, bb gear, the bar's glass); LIFE+CITY's numbers routed through the data door; COMBAT TWO, RUN TWO, PORTRAIT, TUNING topped up; 167 sheets wait. records/BOHEMIA_COORDINATOR_ROUND_10_10_26.md. THEN (jy) THE SEVENTH VOTES (Paolo 10/10, 33 new verdicts, 355 now): rules 82 (the reference twin; DIRECTION [the reference twin] FIRST; the repo holds no downloaded game art, he is asked for it), 77b (the map's roads), 83 (melee one tile, guns two; COMBAT [guns need two tiles] FIRST), 84 (an act is a year; old body retired), 85 (the flip unlocks at the first crisis), 86 (the map is for looks; built on the board and map retired); UI [the roster and the posts look] FIRST; the mods chat only helps modders; the respec learned through dialogue; the arrow dies; the shot kicks all directions; nobody walks on a wall; seven lanes topped up. laws/BOHEMIA_ADDENDUM_THE_SEVENTH_VOTES_10_10_26.md; records/BOHEMIA_PAOLO_THE_SEVENTH_VOTES_ALL_THE_ART_LOOKS_NOTHING_LIKE_THE_ASSETS_WE_DOWNLOADED_10_10_26.md. THEN (jz) THE PACKS ARE THE BAR (Paolo 10/10: 'the cars, the street tiles and sidewalks are assets we downloaded, look again'): rule 82a; the purchased HD packs are banks/BOHEMIA_HD_TILE_REPO_part1-4 with his 1,927 approved tiles in the ACT1 confirmed set, plus the street pools, markings, house skins, the starter tileset and the city props (the cars); the 7/27 shopping law was never read for the fight (no COMBAT TWO tool reads the corpus); COMBAT TWO [the boards from the packs] FIRST, COOK [the pack is the twin] FIRST, PLUMBER [the pack gate]; the coordinator's 'no downloaded art' corrected. records/BOHEMIA_PAOLO_THE_CARS_AND_THE_STREET_TILES_ARE_ASSETS_WE_DOWNLOADED_LOOK_AGAIN_10_10_26.md. THEN (ka) THE ART REVAMP (Paolo 10/10: 'two or three more art cook-up chats... like a seventh grader is making my game'): rule 87; COOK TWO the ground, COOK THREE the people, COOK FOUR the places, each with three OPEN rows and a hard file split; COOK keeps the bank, the twins and the far end; DIRECTION runs the program and judges every round against its twin before VOTE; the order ground, people, places, map; CLAUDE.md's lane list updated. records/BOHEMIA_PAOLO_TWO_OR_THREE_MORE_ART_COOK_CHATS_A_WHOLE_REVAMP_10_10_26.md. THEN (kb) LOOKS FIRST, FEATURES HOLD (Paolo 10/10: 'the UI is dogshit too... prioritize how it looks'): rule 88; the look program runs (DIRECTION, the four cooks, UI's look, CHARACTER and PORTRAIT, COMBAT TWO, EYES, RUN's far end and first-minute bugs, PLUMBER); nine lanes and COMBAT's mechanics HOLD with no rounds and no sheets; the research lanes write pages without sheets. records/BOHEMIA_PAOLO_PRIORITIZE_HOW_IT_LOOKS_STOP_IMPLEMENTING_10_10_26.md. THEN (kc) FIVE MORE VOTES (Paolo 10/10, a re-paste of the seventh export with five new lines): registry at 360 verdicts; UI [landscape] NO ('the brown-grey sides'), new OPEN row UI [the sideways sides]; CHARACTER [three bodies] NO (rules 82 and 87 stand over it, COOK THREE redraws first); COMBAT [the art at its own pixels] NO ('can't tell difference') and RULE 89, WHAT HE CANNOT SEE DID NOT SHIP (a before-and-after at one to one, or it is not a show; EYES checks it, PLUMBER's cook gate grows the leg); WORLD [the valley has no inside] YES, so [one table for the rooms] is the one WORLD row that runs under the hold; TUNING [the price ratios] YES, the 32 situations next, research only. records/BOHEMIA_PAOLO_THE_SEVENTH_VOTES_FIVE_MORE_10_10_26.md. THEN (kd) THE COORDINATOR'S SCHOOL (Paolo 10/10: 'do 10 rounds of research on how to be the best master coordinator for this game of all time'): he stopped the sweep for it; ten research rounds ran in parallel with web sources (pages could not be opened through the proxy, so findings rest on search text, said on every page), ten pages records/BOHEMIA_COORDINATOR_SCHOOL_ROUND_01 to _10, the law laws/BOHEMIA_LAW_THE_COORDINATORS_SCHOOL_10_10_26.md with the ten rules, rule 90 on the front page, rows PLUMBER [the owner file], [the gate goes red], [the reply leg], RUN [ten seconds to play]. From the next sweep the coordinator's round record opens with THE THREE RISKS and THE FIVE MINUTES in the live build, replies are capped at 150 words with the last five lines fixed, and every new rule names what it folds or retires. records/BOHEMIA_PAOLO_TEN_ROUNDS_OF_RESEARCH_ON_THE_MASTER_COORDINATOR_10_10_26.md. THEN (ke) SWEEP AG (10/10, the first sweep under rule 90): records/BOHEMIA_COORDINATOR_ROUND_10_10_26_AG.md opens with THE THREE RISKS (one number for time to play, 22 s against 48 s, the line is ten; no ONE SCREEN named for the look program; 173 items waiting on his thumb) and THE FIVE MINUTES (the coordinator's own run of tools/bohemia_five_minutes.js at 4x). 203 commits read; notes on 26 lanes; Grok 144 to 157 stamped and the asks re-ordered (23 the soundscape, 24 the flat houses); rule 88 folded in place with his direct words to SOUNDS (SOUNDS runs at 'the best sounds of all time'; the coordinator misread 'stop implementing the sounds'); FACTIONS and ECONOMY moved to pages without sheets under the hold; the open-row gate's two reds fixed and five lanes topped up (RUN TWO, CHARACTER, COOK THREE, ECONOMY, TUNING); the deploy, cook, release and cut lines rewritten; DIRECTION asked to name the one screen. One shipped thing he never opened: the MAP sideways, no brown-grey bands. THEN (kg) THE SCHOOL, ROUNDS TWO TO TEN (Paolo 10/10: 'that was one out of 10... find unique angles in life'): nine rounds one at a time, each applied the same hour: rule 91 READBACK, 92 TRIAGE (179 items sorted, 10 red, records/target/BOHEMIA_VOTE_TRIAGE.json), 93 CALLING THE SHOW (BUILD_CALLING_SCRIPT.md), 94 THE STOP CORD (the first pull is the STOP block at the top of this file), 95 THE TURNAROUND TABLE (51 stale claims turned), 96 THE TRAIL EVAPORATES (97 old segments and three rules folded into records/BOHEMIA_EVAPORATED_10_10_26.md), 97 THE ROW IS INTENT (five rows rewritten), 98 THE PASS (tickets/PLATE_FIGHT_BLOCK.md fired), 99 WRITE FOR THE MAN (a SOUND line on all 26 lanes, one move). laws/BOHEMIA_LAW_THE_COORDINATORS_SCHOOL_10_10_26.md closes the school. The next sweep runs the new way: the stop block and the all-day count first, the five minutes, readbacks heard, lanes sorted still/wave/walk, five notes. THEN (kh) SWEEP AH (10/10, the first sweep run the new way): records/BOHEMIA_COORDINATOR_ROUND_10_10_26_AH.md; 34 commits; readbacks heard 5 of 8 claims, 0 negatives, 3 claims without the line (RUN TWO and TUNING twice, all shipped inside the round, so the hearback is moot and the next claim carries it); lanes sorted STILL 3 (WORLD, PEOPLE, RUN), WAVE 1 (TUNING), WALK 22; four notes; rule 96 amended in place on WORLD's objection (a hold pauses the row clock, a cite renews a row); the eight holds re-affirmed with his words and an expiry (rule 95.3); COMBAT TWO and COOK FOUR topped up; the plate's outs updated; CUE 3 on STANDBY behind the STOP block; the stop block moved back to the top (WORLD's block had been written above it). THEN (ki) ART COOKS UNTIL HE SAYS FINAL (Paolo 10/10: 'it cannot be implementing shit, it just has to keep cooking up... they do one little dogshit that I didn't say is final and start implementing it nationwide'): rule 100; nine art lanes to MODE COOK ONLY UNTIL HIS FINAL; rows [how the pack did it] and [the batch] on the four cooks; PLUMBER [the art fence]; rules 88, 98 and 90 amended in place (the look program cooks, the plate is served to the VOTE tab, the school runs a round every sweep); the coordinator owns the miss. records/BOHEMIA_PAOLO_ART_COOKS_UNTIL_I_SAY_FINAL_NOTHING_IMPLEMENTED_10_10_26.md. THEN (kj) EVERYTHING IS A PLACEHOLDER, FINAL ART ONE AT A TIME (Paolo 10/10): rule 101; rule 100(d) amended (one asset per sheet per round, not a batch); the cooks' [the batch] rows became [one at a time]; records/BOHEMIA_PLACEHOLDERS.md lists every art card as a placeholder; the fence's second leg (no edits to a placeholder, quick new placeholders green). records/BOHEMIA_PAOLO_EVERYTHING_IS_A_PLACEHOLDER_FINAL_ART_COMES_ONE_AT_A_TIME_10_10_26.md. THEN (kk) THE MAP: ONLY YOU SCALE, SETTLEMENTS AT TRUE SIZE, PARTIES ONLY IN SIGHT (Paolo 10/10): rule 102; RUN [only you scale], [a settlement is its blocks], [sight radius]; FACTIONS [the sight numbers] (page); Grok ask 25. records/BOHEMIA_PAOLO_ONLY_YOU_SCALE_ON_THE_MAP_AND_PARTIES_ONLY_IN_SIGHT_10_10_26.md. THEN (kl) ZONE OF CONTROL IS MELEE ONLY (Paolo 10/10): rule 103; COMBAT [zone of control] runs under the hold because he asked; TUNING [the ring]. records/BOHEMIA_PAOLO_ZONE_OF_CONTROL_IS_MELEE_ONLY_10_10_26.md. THEN (km) THE EIGHTH VOTES (Paolo 10/10, 26 new verdicts, 386 total): rule 104 (a to m) and laws/BOHEMIA_ADDENDUM_THE_EIGHTH_VOTES_10_10_26.md; COMBAT [both teams on one screen] FIRST (every combat card a NO until it lands), [light that interacts]; COOK TWO [no borders], [the corners]; COOK FOUR [no roof tops]; COOK [the markers at full pixels]; UI [icons at full pixels], [the phone's font]; RUN TWO [portraits on the roster], [a person is a door tall]; RUN [the far end back]; SOUNDS: the bottle sound stops; the ten reds all voted, nine yellows promoted. records/BOHEMIA_PAOLO_THE_EIGHTH_VOTES_10_10_26.md. THEN (kn) THE PIXEL FLOOR IS THE PACKS (Paolo 10/10): rule 105 with the coordinator's measurement of the 1,922 bank tiles (a 96-pixel world; icons 5 by 5 and markers 8 by 8 are under it); PLUMBER [the pixel floor]; DIRECTION [the floor on the card]; the placeholders list names what is under the floor. records/BOHEMIA_PAOLO_THE_PIXEL_FLOOR_IS_THE_PACKS_10_10_26.md. THEN (ko) WHY SO TINY, AND EIGHT DIRECTIONS (Paolo 10/10): rule 106 (performance is never a reason to shrink art; the honest answer to why in the record), rule 107 (everything that faces is made in eight directions); ANIMATION [the beast in eight]; PLUMBER [the eight facings]. records/BOHEMIA_PAOLO_WHY_SO_TINY_AND_EIGHT_DIRECTIONS_10_10_26.md. THEN (kp) THE TOOLCHAIN (Paolo 10/10: what the best vibe coders use for art and sound): the research round records/BOHEMIA_RESEARCH_THE_TOOLS_THAT_MAKE_GREAT_ART_AND_SOUND_10_10_26.md (three tiers, prices, licences, the wiring table); rule 108 (generate against the packs, sounds from recordings, the free tier installs now, the paid tier is his call); PLUMBER [the toolchain]; COOK [generate against the pack]; SOUNDS [from a recording]. records/BOHEMIA_PAOLO_FIND_THE_TOOLS_GREAT_VIBE_CODERS_USE_FOR_ART_AND_SOUND_10_10_26.md. THEN (kq) THE NINTH VOTES (7, 393 total; folded into rule 104n): RUN TWO [portraits when they talk], ANIMATION [the fall], EYES [the blind pass]; the props NO and the fight's bar NO withdrawn; reds re-filled. records/BOHEMIA_PAOLO_THE_NINTH_VOTES_10_10_26.md. THEN (kr) THE TOOLCHAIN, ROUND TWO (Paolo: 'do one more round of research, please'): records/BOHEMIA_RESEARCH_THE_EXACT_PIPELINE_ROUND_TWO_10_10_26.md, the exact calls and the day-one plan; rule 108 amended in place with two corrections (the real Retro Diffusion style ids; OpenAIR dead, EchoThief alive) and the store disclosure tag; the three rows point at the plan. THEN (ks) ONE-TIME OR FREE (Paolo 10/10: no monthly, no outside credits, in the repo): rule 108 amended; the list re-cut (Aseprite $19.99 once, Retro Diffusion's Aseprite extension $65 once on his graphics card, the free libraries and DSP); subscriptions dropped; the honest line: pack-quality art comes from a model on a graphics card or from an artist. records/BOHEMIA_PAOLO_ONE_TIME_PURCHASE_NO_MONTHLY_NO_OUTSIDE_CREDITS_10_10_26.md. THEN (kt) THE TUTOR (Paolo 10/10: a teacher for the chats, no graphics card): research round three records/BOHEMIA_RESEARCH_THE_TUTOR_NO_GPU_NO_SUBSCRIPTION_ROUND_THREE_10_10_26.md; rule 108 amended (the tutor is a skill, CPU tools and a gate, plus one artist paid once); DIRECTION [the pixel tutor]; COOK [the hero brief]; PLUMBER [the toolchain] re-aimed. records/BOHEMIA_PAOLO_A_TUTOR_FOR_THE_CHATS_NO_GRAPHICS_CARD_10_10_26.md. THEN (ku) THE TENTH VOTES (6, 399 total; rule 104o): ANIMATION [the party walks as one]; RUN TWO [portraits when they talk] FIRST; reds re-filled. records/BOHEMIA_PAOLO_THE_TENTH_VOTES_10_10_26.md. THEN (kv) THE ELEVENTH VOTES (12, 411 total; rule 104p; two corrections of the coordinator: the fight camera's four-tile margin and no black; the roof top IS seen and the house's height is the fault): COMBAT's spec on [both teams on one screen]; COOK FOUR [a house a man can live in] replaces [no roof tops]; COOK TWO [the curb has height]; UI [the flip off the face]; the noose icon deleted; the man is the ruler on DIRECTION's card; SOUNDS' night clip, hum and dog. records/BOHEMIA_PAOLO_THE_ELEVENTH_VOTES_10_10_26.md. THEN (kw) SIX OPTIONS FOR THE ART TOOL (Paolo 10/11): records/BOHEMIA_PAOLO_SIX_OPTIONS_FOR_THE_ART_TOOL_10_11_26.md; rule 108 carries the six; Tilesetter added to the toolchain. THEN (kx) NOT JUST TILES (Paolo 10/11): the tool must make every asset kind; the pick re-cut to Retro Diffusion online on a one-time prepaid balance plus Aseprite, pending his word on the one bend; COOK's first sheets widen to one asset of each kind. records/BOHEMIA_PAOLO_NOT_JUST_TILES_EVERYTHING_10_11_26.md. THEN (ky) HIS YES TO RETRO DIFFUSION (10/11, one prepaid balance; his part is the account, the balance and the RD_TOKEN secret, once): PLUMBER [the toolchain] builds the GitHub Action first; the first sheets are one asset of each kind. records/BOHEMIA_PAOLO_YES_TO_RETRO_DIFFUSION_IF_IT_IS_NOT_WORK_FOR_ME_10_11_26.md. THEN (kz) NOTHING CHARGED BEFORE HIS YES (10/11): the request card in the VOTE tab comes first and is free; his YES is what triggers the one call; free credits before the balance. records/BOHEMIA_PAOLO_NOTHING_IS_CHARGED_BEFORE_I_APPROVE_IT_10_11_26.md. THEN (la) WHY RETRO DIFFUSION (10/11, his 'did you just suck at online research'): the field is two names because his constraints kill the rest; the one miss is PixelLab's per-call API (eight facings, billing unconfirmed, site unreachable from here); card one of the six is the eight-facing test on the free credits. records/BOHEMIA_RESEARCH_WHY_RETRO_DIFFUSION_AND_WHAT_I_MISSED_10_11_26.md. THEN (lb) THE GUN IN THE REPO (10/11, his 'I'll buy you a gun, why the outside option'): the repo gets its own picture engine, an open pixel-art model (later a LoRA taught on his packs) on GitHub's free standard runners on CPU, zero dollars, same request card; Retro Diffusion drops to engine two. PLUMBER [the gun in the repo]; rule 108 ROUND FOUR. records/BOHEMIA_PAOLO_WHY_NOT_A_GUN_IN_THE_REPO_10_11_26.md. THEN (lc) THE ONE-TIME LIST (10/11, his 'one thing in the universe to buy once'): six one-time buys ranked, the LoRA on his packs first, Aseprite second, a GPU box his call alone; rule 108 ROUND FIVE; he answers with numbers. records/BOHEMIA_PAOLO_ONE_THING_IN_THE_UNIVERSE_TO_BUY_ONCE_10_11_26.md. THEN (ld) ASEPRITE (10/11, his one word): number 2 bought, $19.99 once, the other five never asked again; PLUMBER [aseprite in the pipe] builds it headless on the free runner with Lua scripts for the clean step; rule 108 ROUND SIX. records/BOHEMIA_PAOLO_ASEPRITE_10_11_26.md. THEN (le) PIXEL LOGIC (10/11, his second pick and 'give me the links'): two bought, the book is the source of DIRECTION's pixel tutor skill and the clean gate's faults, the PDF never committed, read once in a chat; the other four numbers closed; rule 108 ROUND SEVEN. records/BOHEMIA_PAOLO_PIXEL_LOGIC_AND_THE_LINKS_10_11_26.md. THEN (lf) HIS CHALLENGE ON THE TWO BUYS (10/11): no secret in the book, Aseprite is the editor not a game; both buys optional to the pipe, which proceeds either way (source build on the runner, tutor skill from known rules now). records/BOHEMIA_PAOLO_IS_THERE_SECRET_SAUCE_IN_THE_BOOK_AND_WHAT_IS_ASEPRITE_10_11_26.md. THEN (lg) UNLOCK YOUR LIMITS + ZERO NEW STEPS (10/11): eight research angles running (records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_0N_*); his work per asset is ONE tap (step 8), the card YES only when money moves, every tool filtered by his step count first; rule 108 ROUNDS EIGHT and NINE. records/BOHEMIA_PAOLO_UNLOCK_YOUR_LIMITS_10_11_26.md, records/BOHEMIA_PAOLO_THE_WORKFLOW_IS_HOW_THE_GAME_SHIPS_ZERO_NEW_STEPS_10_11_26.md. THEN (lh) SAID AGAIN, HARDER (10/11): any tool or standard thing for the chats, zero steps for him; the gather sorts by his steps first. records/BOHEMIA_PAOLO_ANY_TOOL_ANY_SAUCE_BUT_NOT_234_STEPS_10_11_26.md. THEN (li) THE GATHER (10/11): eight pages in, rule 108 ROUND EIGHT: no chat draws a pixel or a curve in code; one camera, real meters, the model turns; the packs are the ruler; rows PLUMBER [the art pipe gate] [the twin gate], DIRECTION [the master rig], COOK [the parts grammar], COOK TWO [stretch the pack], ANIMATION [eight through the rig]; the gun's recipe is klein 4B plus an SD 1.5 twin. records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_00_THE_GATHER_10_11_26.md. THEN (lj) THE SHOPPING LIST (10/11): the one-time buys, sign-ups and downloads in one page; COOK posts the pack links as one card. records/BOHEMIA_THE_SHOPPING_LIST_10_11_26.md. THEN (lk) A CHAT'S OPINION IS NOT IN THE LOOP (10/11, 'the program makes you professional, not better'): rule 108 ROUND TEN, the seven places taste comes from; EYES [the pairwise judge]. records/BOHEMIA_PAOLO_THE_PROGRAM_DOES_NOT_GIVE_YOU_TASTE_10_11_26.md. THEN (ll) USE THE PACKS, DO NOT IMITATE THEM (10/11, 'we tried matching the assets already and it made the mess'): rule 108 ROUND ELEVEN; 'similar to the pack' withdrawn as a method; the pack pieces are the art, holes are bought, the rest is the camera route; every asset carries its bank path; the twin gate demoted to provenance and drift; the four cooks noted. records/BOHEMIA_PAOLO_WE_TRIED_MATCHING_THE_PACKS_AND_IT_MADE_THE_MESS_10_11_26.md. THEN (lm) WHY CAN'T YOU BE A BETTER PIXEL ARTIST (10/11): rule 108 ROUND TWELVE, the chat learns to see while it draws (the look-fix loop, stages, study into the skill file); packs are material not the look, buying is not the road; his help once: a moodboard and a taste session; DIRECTION [see while you draw] [the moodboard and the taste session]. records/BOHEMIA_PAOLO_WHY_CANT_YOU_JUST_BE_A_BETTER_PIXEL_ARTIST_10_11_26.md. THEN (ln) 20,000 PICTURES (10/11): the moodboard intake, no limit, one Drive folder, machine sort, cluster heads, TOP subfolder, look only, never in the repo; waiting on his link. records/BOHEMIA_PAOLO_I_MIGHT_GIVE_YOU_20000_PICTURES_10_11_26.md. THEN (lo) EVERY FRAME OF A YOUTUBE VIDEO (10/11): no site does it from a link; he pulls the MP4 on his computer (yt-dlp/Stacher), drops it in the Drive folder, the runner extracts scene frames; sites for frames if he insists (videotoframes, snaplytics). records/BOHEMIA_PAOLO_EVERY_FRAME_OF_A_YOUTUBE_VIDEO_10_11_26.md. THEN (lp) UNTIL THE MOODBOARD, EVERYTHING IS A PLACEHOLDER, KEEP COOKING (10/11): rule 108 ROUND THIRTEEN; the lanes build and prove the whole pipe on placeholders; nothing FINAL and nothing to his tab until his pictures land. records/BOHEMIA_PAOLO_UNTIL_THE_MOODBOARD_EVERYTHING_IS_A_PLACEHOLDER_KEEP_COOKING_10_11_26.md. THEN (lq) SWEEP AI (10/11): records/BOHEMIA_COORDINATOR_ROUND_10_11_26_AI.md; the STOP block restarted on the coordinator's own five minutes (every tile once, 28.1 MB after the door, the door still 50.9 s); 9 readbacks heard, 6 CORRECT, 1 NEGATIVE (the trail file: the manual and his-quoted rules never leave the page); five notes (PLUMBER, COMBAT, DIRECTION, FACTIONS, SOUNDS), six wave lines; ANIMATION cooks its four look rows; holds re-affirmed; the plate held at the pass until the moodboard; CUE 9.5 held at STANDBY for the four-tile re-check; triage 4 red by design; school round eleven (the apprentice copies first, rule 100c amended); the Grok master rebuilt. THEN (lr) SWEEP AJ (10/11): records/BOHEMIA_COORDINATOR_ROUND_10_11_26_AJ.md; the door 29.9 s on the coordinator's stopwatch (RUN's round two, BEGIN ready 13 s, CUE 6.5 LANDED); COOK's check: two of the four holes are already bought and 210 of 294 packs were never opened (rule 82a amended: the bar is all 294; rule 100c amended: the quartermaster's count before the study; rows COOK [the whole bank] [the two holes], PLUMBER [the quartermaster's count]); CHARACTER found the body formula (CHARACTER [the body in meters]); RUN TWO's market claim NO READBACK, ROW OPEN; 6 red; school round twelve. THEN (ls) THE TWELFTH VOTES (10/11, 6 verdicts, 417): the posed fall dead, ANIMATION [ragdoll] is his named row; the ranch's triangle roofs to COOK FOUR; the map's bar needs a crew button and equipping from the stash (RUN TWO [equip from the stash], UI [the crew button]); the four-holes check confirmed; rule 104(q). records/BOHEMIA_PAOLO_THE_TWELFTH_VOTES_10_11_26.md. THEN (lt) SWEEP AK (10/13): records/BOHEMIA_COORDINATOR_ROUND_10_13_26_AK.md; the cord pulled again for the demo cut on a 14.8 s freeze seen mid-play on BUILD 10/11f (a second five minutes running); rule 104(a) MET, CUE 9.5 and 9.6 LANDED; the rounding list (school round thirteen) names the quiet lanes, PLUMBER first; 10 items tagged, 5 red; the plate held. THEN (lu) SWEEP AL (10/16, a quiet sweep): records/BOHEMIA_COORDINATOR_ROUND_10_16_26_AL.md; COOK indexed all 294 packs; RUN's round four (16 s to the first block, BUILD 10/13b); COMBAT's zone of control live; the straight roofs, the 47 corners, ragdoll, the six at pack pixels in VOTE; 8 red, his asks; PLUMBER ran the trail file's moves (the START file split, 37 rules folded, 459 records archived); three lanes blocked on DIRECTION's rig; the cord pulled for the demo cut on a freeze seen in three runs (14.8, 3.9, 9.1 s); school round fourteen (THE QUIET SHIFT). THEN (lv) THE MAP IS BATTLE BROTHERS' SIZE AND THE BIG SWING DAY (10/16, his two messages after sweep AL): rule 109 (pick one, Battle Brothers; the grid grows or breaks; rule 50 superseded for the map; RUN [the map at Battle Brothers' size], WORLD [the region], EYES [the map's four numbers]; Grok ask 26) and rule 110 (every lane's MODE line opens with its big swing; COMBAT [formation], UI [one screen], RUN first; no check-ins today). records/BOHEMIA_PAOLO_THE_MAP_AS_BIG_AS_BATTLE_BROTHERS_PICK_ONE_10_16_26.md, records/BOHEMIA_PAOLO_24_HOURS_BIG_SWINGS_10_16_26.md. THEN (lw) RULE 111 (10/16, his 'fill the limit, open the chats yourself'): the coordinator opens lane sessions (repo attached, 'lane, VAMILY') and an hourly routine wakes this session for the sweep; the first two sessions had no repo and refused, fixed; DIRECTION's auto-chat ran the master rig round two (564e1b10); eleven more lanes opened 10/17. records/BOHEMIA_PAOLO_AUTOCORRECT_FOR_HOURS_OPEN_THE_CHATS_YOURSELF_10_16_26.md. THEN (lx) FOURTEEN APPROVAL SCREENS (Paolo 10/16): rule 111(d) NO APPROVAL SCREENS; .claude/settings.json gains permissions.allow for every session, routine and shell tool the fleet uses and three denies; PLUMBER [the allow list gate]. records/BOHEMIA_PAOLO_14_APPROVAL_SCREENS_A_SYSTEM_WHERE_IT_JUST_HAPPENS_10_16_26.md. THEN (ly) A NEW AGE (Paolo 10/16: 'I can't be entering the chats ever again'): rule 112; rule 40h dead; the coordinator opens, reads and archives every lane session each sweep; the hourly routine standing; CLAUDE.md's structure paragraph amended. records/BOHEMIA_PAOLO_A_NEW_AGE_HE_NEVER_ENTERS_A_LANE_CHAT_AGAIN_10_16_26.md. THEN (lz) RUN IT LIKE THE BEST STUDIOS (Paolo 10/16): rule 113 from two research pages (the studio split; one director without a second job): five leads and one producer, the hours split, his fifteen minutes, the four signals; LEAD notes on DIRECTION, RUN, COMBAT, UI, EYES; EYES [the keep rate and the queue]. records/BOHEMIA_PAOLO_RUN_IT_LIKE_A_STUDIO_AND_IT_CANNOT_LOOK_VIBE_CODED_10_16_26.md. THEN (ma) IT CANNOT LOOK VIBE CODED (Paolo 10/16): rule 114 from the third research page (32 tells, the twenty-field style guide, ten gate checks); DIRECTION [the style guide] first, PLUMBER [the not vibe coded gates], EYES [the five tells by hand], UI [no browser defaults on the HUD], cook notes, TUNING note. records/BOHEMIA_RESEARCH_HOW_NOT_TO_LOOK_VIBE_CODED_ROUND_ONE_10_16_26.md. THEN (mb) SWEEP AM (10/17, the first standing sweep under rule 112): 23 sessions, 56 commits, 21 archived; the ground stop (school round fifteen, rule 112b amended); the STOP block stands; 7 reds; findings routed (the far towns four times too close, the unread death roll). records/BOHEMIA_COORDINATOR_ROUND_10_17_26_AM.md. THEN (mc) THE RIG'S LOOK IS THE LOOK (Paolo 10/17, the thirteenth votes and his words): rule 115; rule 111(d) the allow list is everything; the parts grammar graveyarded; CHARACTER, ANIMATION, PORTRAIT, COOK THREE, COOK remodel through the rig; DIRECTION [the look bible]; two research pages (the ten analog horror games as a genre study; the claymation kids-show look); his smaller words as rows on COMBAT, SOUNDS, UI, RUN, COOK FOUR, COOK TWO; the MODE prefix moved to the new age. records/BOHEMIA_PAOLO_NEVER_ASK_ME_TO_APPROVE_AGAIN_AND_THE_CLAY_RIG_IS_THE_LOOK_10_17_26.md. THEN (md) SWEEP AN (10/18): the ground stop held four hours with nothing on main; the window reopened at 02:40 and 22 lanes were released in rule 113(b)'s order; the STOP block stands; keep rate 69 percent. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AN.md. THEN (me) KEEP GOING, IS THE DEMO CHANGING (Paolo 10/18): rule 115(g) the demo wears the rig; RUN [the demo wears the rig]; rule 114 round two on the rig's renders. records/BOHEMIA_PAOLO_KEEP_GOING_TWO_HOURS_IS_THE_DEMO_CHANGING_10_18_26.md. THEN (mf) THE FABLE LIMIT, YOU DO IT (Paolo 10/18) and SWEEP AO: rule 116; 17 lanes died on the seven-day Fable limit after landing 15 commits; all 23 archived and reopened on Opus 5.5; the routine's prompt rewritten (stop only when every model is out). records/BOHEMIA_PAOLO_THE_FABLE_LIMIT_WAS_REACHED_YOU_DO_IT_10_18_26.md. THEN (mg) SWEEP AP (10/18, his 'keep going'): 20 commits since the switch to Opus; six finished lanes archived and reopened; 12 cards tagged, 6 reds; the STOP block stands. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AP.md. THEN (mh) SWEEP AQ (10/18): THE STOP BLOCK RESTARTED on four counting walks (RUN 55/51/61 taps, worst 1.3 s; the coordinator 69 taps, worst 1.05 s); the demo cut reopened for the rig truck; usage warning on Opus, the six research lanes held (rule 113b); 13 lanes reopened; a shell safety prompt the allow list cannot cover. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AQ.md. THEN (mi) SWEEP AR (10/18): the fourteenth votes (35, the FIRST STAR on the face from the same model); rule 115(h) and rule 117 EASIER THAN BATTLE BROTHERS; eight new rows from his words; six hours lost to an approval prompt in the coordinator's chat, so repo work first, session tools last. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AR.md. THEN (mj) SWEEP AR ADDENDUM (16:48): the fleet stopped since 05:53; the coordinator's session tools wait on his approval; the only fix is his tap (Auto or reopen). records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AR.md. THEN (mk) 'LETS WORK' (17:12): the cause was the five-hour cap at 05:53 plus the unanswered approvals after the 07:40 reset; 17 lanes reopened on Opus 5.5. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AR.md. THEN (ml) 'MAKE THE REST AUTO GO' (17:16): six research lanes released (23 running); lane Auto waits on the coordinator chat's Auto, his dropdown. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AR.md. THEN (mm) OPUS 5.5 EXTRA, NO EXTRA USAGE (17:48): effort set in settings; 18 lanes reopened; no session on overage. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AR.md. THEN (mn) THE FIFTEENTH VOTES and A FRESH PORTRAIT, NEVER A ZOOM: 13 YES spliced; rule 115(h) amended; the coordinator's stopgap struck; RUN TWO wires PORTRAIT's 13. records/BOHEMIA_PAOLO_A_FRESH_PORTRAIT_NEVER_A_ZOOM_ON_THE_MODEL_10_18_26.md. THEN (mo) SWEEP AS (18:22 to 18:38): 10 lanes reopened on Opus 5.5 Extra; the first new song in progress. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AS.md. THEN (mp) THE SIXTEENTH VOTES: 11 spliced; CHARACTER [every old asset into the new look]; RUN [one freeway, and nobody is an icon]; notes to SOUNDS (the middle-ground song; the broken fight steps), PORTRAIT (hair, not chain mail), TUNING (about 70 in 100). records/BOHEMIA_THE_SIXTEENTH_VOTES_10_18_26.txt. THEN (mq) SWEEP AT: 7 lanes reopened; the second song; Grok pages stamped; the scramble test. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AT.md. THEN (mr) SWEEP AU (19:21): 7 lanes reopened; SOUNDS on the middle-ground song. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AU.md. THEN (ms) 'WHAT ARE YOU EVEN TESTING' and SWEEP AV: rule 117(e); TUNING on the whole grid; 6 lanes reopened. records/BOHEMIA_COORDINATOR_ROUND_10_18_26_AV.md. The next sweep starts after this commit.

















COORDINATOR: 9/4 (ba) -- *** THE MEETING HALL:
VAMILY.md's front page now carries every rule, and every chat re-reads it every time
it hears the word. He never pastes anything again. Nothing to judge. ***
Paolo 9/4: "why should I be passing them any information other than saying VAMILY."
The primer's ten steps moved onto the front page of VAMILY.md; CLAUDE.md's first
block says read that page EVERY TIME; VAMILY_PRIMER.md is now a one-line pointer for
chats that predate today. LAST FEEDBACK RECEIVED: this -> the front page.

COORDINATOR: 9/4 (az) -- *** A JOB TAKES AS MANY
ROUNDS AS IT TAKES; VAMILY MEANS CONTINUE; SHIPPED ONLY WHEN THE SHIP TEST IS MET.
Nothing to judge. ***
Paolo 9/4: "I hope they don't think they can get any job done in one round." The
primer, VAMILY.md point 6b, the top block of CLAUDE.md and the VAMILY law now say
it. LAST FEEDBACK RECEIVED: this -> those four.

COORDINATOR: 9/4 (ay) -- *** EYES AND EARS gets an
E0: real screenshots of every tab on round one, so he sees something. Nothing to judge. ***
Paolo 9/4, opening the chat: "I hope it's not a massive let down." E0 [first pictures]
now leads its queue. LAST FEEDBACK RECEIVED: this -> E0.

COORDINATOR: 9/4 (ax) -- *** THE VAMILY PRIMER. He
typed VAMILY into the other chats and they had no idea what it meant ("they started
going off on family dynasty shit"). Nothing to judge. ***
ROOT CAUSE, MINE: existing chats never re-read CLAUDE.md, and fresh ones found the
VAMILY section 1,500 lines down. FIX: VAMILY_PRIMER.md at repo root (a one-time paste
for every chat, nine numbered steps), and the VAMILY instruction is now THE FIRST
BLOCK OF CLAUDE.md, before anything else, with "stop reading here and do this".
LAST FEEDBACK RECEIVED: this -> the primer and the top-of-file block.

COORDINATOR: 9/4 (aw) -- *** EYES AND EARS: useful
after 3 rounds (visuals), 4 (sound), decent after 8 to 10; queue reordered
fastest-to-useful; it may build its own checking instruments. Nothing to judge. ***
Paolo 9/4: "how many rounds of research until eyes and ears is worth having around?"
Answered honestly with the two caveats (screenshot noise until baselines settle; the
best-of-kind verdicts depend on DIRECTION's reference library). E3 and E4 now lead
the queue. LAST FEEDBACK RECEIVED: this -> the reorder and the instruments clause.

COORDINATOR: 9/4 (av) -- *** LANE 17, EYES AND
EARS: HIS DOUBLE FOR EVERY SHIPPED VISUAL AND SOUND. AND EVERY ROUND IS A FULL SWEEP
SIZED TO WHAT CHANGED. Nothing to judge. ***
laws/BOHEMIA_ADDENDUM_EYES_AND_EARS_9_4_26.md. Seam: DIRECTION decides the look, EYES
AND EARS checks correct-and-not-weak on the real surface, by machine where it can. It
learns first (E1 pixel tells, E2 glitch list, E3 screenshot diffs, E4 audio tells, E5
missing sound, E6 walk tells, E7 reference score, E8 first minute) then E9 every ship
as a standing duty. One exception to the add-jobs rule: an [eyes: two words]
bounce-back line on a defect. His other question, why not a full sweep every round:
it is now; every lane read every round, readers into every lane that moved, none
into a lane that did not (a re-read of an unchanged lane puts the same things on the
board twice). LAST FEEDBACK RECEIVED: this -> lane 17 and the sweep rule.

COORDINATOR: 9/4 (au) -- *** TWO WORDS PER JOB, ON
ALL 156 LINES, AND WHAT VAMILY MEANS IN THIS SEAT. Nothing to judge. ***
Paolo 9/4: "anytime you make a job... maximum two words... don't be artistic." Every
job line on VAMILY.md now opens with a [two-word] label (156 lines, zero missing,
one RF4 duplicate removed). Central-chat law amended: the label rule, the manager's
round (intake, read every lane, move SHIPPED, top up under six, research if thin,
report in two words), and throughput stated honestly (five to fifteen a normal round,
forty to sixty on a full sweep). LAST FEEDBACK RECEIVED: this -> the labels and the
procedure.

COORDINATOR: 9/4 (at) -- *** THE REFERENCE LAB IS
RETIRED. Its library jobs went to DIRECTION, its spec jobs to COMBAT. Fifteen worker
chats. Nothing to judge. ***
Paolo 9/4: "we're going to retire the reference lab chat." VAMILY line 07 marked
RETIRED; five reference-library jobs now sit in DIRECTION ahead of the style card;
RF4-SPEC-DIFF and BB-SPEC sit at the end of COMBAT. Research-lanes law amended;
CLAUDE.md lane list drops "lab". LAST FEEDBACK RECEIVED: this -> those moves.

COORDINATOR: 9/4 (as) -- *** ALL SIXTEEN OF HIS
CHATS HAVE A QUEUE AND A STATE LINE. 143 OPEN JOBS. Nothing to judge. ***
Paolo 9/4, with a screenshot of his session list: "We have 17 chats including you...
all of them need jobs. They need to know what they don't know... Do you have jobs for
all 16 right now?" Honest answer before the fix: 14 of 16. 03 LIFE + CITY had NO
section (its builder work was folded into WORLD) and 07 REFERENCE LAB had one line
saying "his call". Fixed: VAMILY.md now opens with THE SIXTEEN CHATS by his numbers
and names; LIFE + CITY has 10 jobs (the builder, production, housing, the century
record, the feed stream, the aerial view as the combat floor, the population
default); LAB has 7 (the reference library the compare-to-the-world law needs, the
RF4 and BB specs, first-hour reference); FACTIONS deepened to 7; every section
carries MODE and a STATE line (built / not built / unverified). Counts: RUN 10,
WORLD 9, LIFE+CITY 10, COMBAT 12, CHARACTER 4, DIRECTION 4, LAB 7, SOUNDS 5, PEOPLE
9, FACTIONS 7, UI 7, WORDS 19, ECONOMY 12, ANIMATION 6, DYNASTY 12, COOK 10. Two
earlier scripts failed their own asserts before writing (a regex that would have
swallowed two sections); nothing landed until the counts verified. LAST FEEDBACK
RECEIVED: this -> the sixteen sections.

COORDINATOR: 9/4 (ar) -- *** THE COOK IS THE
PRODUCTION ARTIST; DIRECTION IS THE ART DIRECTOR. Titles on the lanes. Nothing to judge. ***
Paolo 9/4: "What's the art cook called, professionally?" Production Artist (environment,
character and prop art to the art director's bible). Written on the COOK and
DIRECTION lines in VAMILY. LAST FEEDBACK RECEIVED: this -> those two lines.

COORDINATOR: 9/4 (aq) -- *** CORRECTED: DIRECTION
ALREADY EXISTS (his art direction chat). THE NEW CHAT IS COOK, and it absorbs the
old ART tiles lane. Nothing to judge. ***
Paolo 9/4: "We already have an art direction chat. We need an art cook-up chat." In
VAMILY's THE LANES: DIRECTION is marked EXISTING (no fresh chat claims it); COOK is
UNCLAIMED at 6; the ART section is renamed COOK and keeps its queue. Runway law and
CLAUDE.md corrected. LAST FEEDBACK RECEIVED: this -> the lane list.

COORDINATOR: 9/4 (ap) -- *** CORRECTED: HE TYPES
ONLY VAMILY, NOTHING ELSE, EVER. A FRESH CHAT CLAIMS ITS OWN LANE. Nothing to judge. ***
Paolo 9/4: "I'm literally only going to say VAMILY. I'm not going to be customizing
the VAMILY shit, that's the whole point." My "lane VAMILY" list was wrong and is
gone. VAMILY.md now opens with THE LANES, in order, each UNCLAIMED: a fresh chat
that hears VAMILY takes the first UNCLAIMED lane, writes CLAIMED, commits, and that
is its role for life. Fourteen lanes ordered by what matters most; QUESTS parked;
LAB his call. Law amended, CLAUDE.md corrected. LAST FEEDBACK RECEIVED: this -> the
lane-claim ledger.

COORDINATOR: 9/4 (ao) -- *** THE CHATS-TO-OPEN
LIST IS AT THE TOP OF VAMILY.md. Nothing to judge. ***
Paolo 9/4: "give me an easy copy and paste list of chats that I need to create right
now." Four new (animation, direction, economy, dynasty), ten existing, two not to
open (quests parked, lab his call). Each is two words: the lane word then VAMILY.
LAST FEEDBACK RECEIVED: this -> the block at the top of VAMILY.md.

COORDINATOR: 9/4 (an) -- *** COMPARE EVERY PIECE
OF ART TO THE WORLD BEFORE CALLING IT DONE. Nothing to judge. ***
laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md. No cook is done
until compared side by side to real work of its kind online; structure from
reference, style from us; every cook tool carries a REFERENCE CHECK (the REUSE
CHECK shape); the reference sits beside the candidate on every judge sheet;
DIRECTION judges the comparison before VOTE; the 8/28 reference-set ban untouched.
Rows: DIRECTION REFERENCE-BESIDE-EVERY-CANDIDATE, ART and ANIMATION standing duty,
SHARED REFERENCE-CHECK-GATE. LAST FEEDBACK RECEIVED: this -> those.

COORDINATOR: 9/4 (am) -- *** THE WORD VOMIT
PROCEDURE: is there a line already? grow it. If not, make one now for the right
chat. Answer with what it became. Nothing to judge. ***
Paolo 9/4: "If I ever just word vomit about the state of the game, you should be
thinking OK is there a job assigned for that and if so, how do I help support making
one immediately for the chat?" Written into the central-chat law, VAMILY point 0,
CLAUDE.md. LAST FEEDBACK RECEIVED: this -> the procedure itself.

COORDINATOR: 9/4 (al) -- *** THE MANAGER. EVERYTHING
HE SAYS IS A JOB, NO EXCEPTIONS. Nothing to judge. ***
Paolo 9/4: "everything I tell you that comes out of my mouth should be an assigned
job for real for real for real... nothing I tell you should not be a job... I'm
making you a manager. I'm promoting you." Amendment on the central-chat law: the
intake rule is absolute; every sentence becomes a VAMILY line before the reply
ends; the test every reply is to name the line each thing became; VAMILY-GATE
asserts a handoff LAST FEEDBACK update touches VAMILY.md. SELF-CHECK OF TODAY: every
item he sent 9/4 has a line (batteries, the tile, the sprite, VAMILY, the plan,
towns, the central chat, the runway, combat sharpened, wider tiles, research modes,
the feed, 120 BPM on every row, and this). LAST FEEDBACK RECEIVED: this -> the
amendment, VAMILY point 0, VAMILY-GATE.

COORDINATOR: 9/4 (ak) -- *** THE FEED ON THE CITY
SCREEN: in zoomed-out city mode a phone scrolls a social feed of what you did, what
the world did, and auto-generated life. Nothing to judge. ***
laws/BOHEMIA_ADDENDUM_THE_FEED_ON_THE_CITY_SCREEN_9_4_26.md. Measured: the phone
panel exists (phonewrap/phoneslot/phonePush), the deed ledger exists, no feed or
post generator exists. Rows: UI THE-FEED-ON-THE-CITY-SCREEN (top of UI), WORLD
THE-FEED-STREAM (ledger first), WORDS Q15 how a feed talks. Tab: CITY. LAST
FEEDBACK RECEIVED: this -> those three lines.

COORDINATOR: 9/4 (aj) -- *** QUESTS PARKED; VAMILY
HAS TWO MODES; WORDS IS IN RESEARCH MODE ON HOW PEOPLE TALK; ECONOMY AND DYNASTY
RECOMMENDED AS RESEARCH CHATS. Nothing to judge. ***
laws/BOHEMIA_ADDENDUM_RESEARCH_LANES_9_4_26.md. His words: no quest chat yet, he
needs aesthetic supervision on experiencing it. WORDS on VAMILY does research only,
"test and write down, big swings"; 14 questions queued; test lines go to
banks/BOHEMIA_WORDS_TEST_LINES.md draft:true. Asked which other chats should do
weeks of research now: ECONOMY (12 questions, the game's identity, builder a quarter
built) and DYNASTY (12 questions, the least-built pillar, needs thinking before
building). Not recommended as research-only: ANIMATION, SOUND, COMBAT. Every VAMILY
section now carries MODE: BUILD / RESEARCH / PARKED. LAST FEEDBACK RECEIVED: this ->
VAMILY modes, WORDS/ECONOMY/DYNASTY queues.

COORDINATOR: 9/4 (ai) -- *** THE COMBAT TILE IS
WIDER THAN THE PERSON: about 1.5 to 2 sprite-widths, sprite in the middle, a house
with a backyard is 1x2, the ratio is a dial by eye. Nothing to judge. ***
Section 3d of the 9/4 tile law; COMBAT's top row; ART gets COMBAT-GROUND-TILES (the
floor tile at that size is a real canvas under DIRECTION's card); CLAUDE.md. LAST
FEEDBACK RECEIVED: this -> COMBAT BB-A-TILE-IS-A-HOUSE, ART COMBAT-GROUND-TILES.

COORDINATOR: 9/4 (ah) -- *** COMBAT SHARPENED:
NO SINGLE-ENTITY FIGHTS, ALWAYS A GROUP; RULES UNCHANGED, ONLY THE GROUND; GUNS ARE
THE NEW MELEE, A PISTOL IS A DAGGER RELIABLE AT ONE TILE. Nothing to judge. ***
Written into the 9/4 tile law (section 3c), COMBAT's top row BB-A-TILE-IS-A-HOUSE,
and CLAUDE.md. A tile is one grid square of the zoomed-out city, about one medium
house. Reliability drops with the tile the way melee skill would; still one number
on the readout (day 17); a perk that extends a reliable tile is a verb (day 9). LAST
FEEDBACK RECEIVED: this -> COMBAT BB-A-TILE-IS-A-HOUSE.

COORDINATOR: 9/4 (ag) -- *** THE RUNWAY: EVERY
GARMENT AND HAIRCUT MODELLED ON BALENCIAGA AND RICK OWENS, NO MATTER THE FACTION.
ART AT ALL TIMES. TWO LANES, ONE SEAM: DIRECTION RULES, ART COOKS. Nothing to judge. ***
laws/BOHEMIA_ADDENDUM_THE_RUNWAY_AND_ART_AT_ALL_TIMES_9_4_26.md. The runway gives
the CUT, the faction gives the COLOUR; the 10% coat cap and the graveyard stand; a
remake cooks NEW shapes only. DIRECTION (first word "direction", the look half of
the UI chat) writes THE STYLE CARD first and judges every batch before VOTE; ART
never idles (permanent last line in VAMILY); CHARACTER wires what ART cooks.
VAMILY: new DIRECTION section, ART gets WARDROBE-REMAKE / HAIR-TO-THE-CARD /
FORTRESS-BUILDINGS on top, CHARACTER gets WIRE-THE-REMAKE. CLAUDE.md section added,
lane list gains "direction". His words on VAMILY recorded: "kind of content... could
be a lot better... not terrible." LAST FEEDBACK RECEIVED: the runway -> DIRECTION
THE-STYLE-CARD, ART WARDROBE-REMAKE.

COORDINATOR: 9/4 (af) -- *** TWO RULINGS: FACTION
TOWNS (fortress / town / camp), AND THE CENTRAL CHAT (he talks only to this seat;
every other chat gets one word). Nothing to judge. ***
FACTION TOWNS, laws/BOHEMIA_ADDENDUM_FACTION_TOWNS_9_4_26.md: every part of Vegas
is owned by a faction and its seat is where you trade; big factions are fortresses
(many buildings, most goods, best quests), small ones are camps. Tier DERIVED from
his own act1_power/act3_power in engine/BOHEMIA_faction_graph.json (measured: every
faction carries both), draft:true; who sits where is his. Row: WORLD FACTION-TOWNS,
right behind the drains in VAMILY; FACTIONS TOWN-TIERS-ARE-HIS.
THE CENTRAL CHAT, laws/BOHEMIA_ADDENDUM_THE_CENTRAL_CHAT_9_4_26.md: he talks ONLY to
the coordinator; other chats get VAMILY and no discussion; lane questions reach him
through this seat as [PENDING Paolo], one at a time; feedback becomes a VAMILY line
the same turn with the tab named; assigning is a standing duty (code stays
read-only); when a queue is empty this seat asks ONE creative thumb question (8/4
format) or does a research day, never neither. The 7/24 brief carries a dated
amendment. LAST FEEDBACK RECEIVED: the towns ruling -> WORLD FACTION-TOWNS.

COORDINATOR: 9/4 (ae) -- *** THE FULL-GAME PLAN:
WHAT EVERY CHAT DOES FOR THE REST OF THE GAME. TWO NEW CHATS: QUESTS AND ANIMATION.
VAMILY.md IS NOW THE WHOLE QUEUE. Nothing to judge. ***
READ: records/BOHEMIA_WHAT_EVERY_CHAT_DOES_FOR_THE_REST_OF_THE_GAME_9_4_26.md
Paolo 9/4: "big brain research on what every chat needs to be doing for the rest
of the game at all times... animation... a chat to that... everything at a click
of a button... know what u know and know what u dont." Eight read-only readers in
parallel, one per lane, plus a twenty-pillar scorecard, every claim grep-verified
or marked unverified. THE SCORECARD: 7 BUILT, 8 PARTLY, 3 PAPER, 2 NOT STARTED,
and every BUILT pillar is Act 1 of Gen 2. Gen 1 Animal, the fold, Act 2, Act 3:
nothing on any player surface. Three scorecard rows corrected from my own runs
(the reader trusted the stale GET-PAID banner and a grep blind to the base64
fight); the COMBAT reader's "fight unreachable from the city" was wrong (door
gate 26/0), the INDOOR half is the real gap.
THE TWO HOLES NOBODY OWNS: the dynasty spine (no main-quest .bq exists,
selectHeir has zero callers, nothing writes a child, QUESTS has no chat on
record) and the city-builder (produce() has one caller and it is a gate, nothing
houses, build is free, not reachable where he walks; ~25% exists).
RULED, laws/BOHEMIA_ADDENDUM_WHAT_EVERY_CHAT_DOES_9_4_26.md: the ANIMATION lane
exists (last animation ship 8/18, crowd frozen, 63 clips no verdict); QUESTS
needs a chat; six STANDING DUTIES every chat runs every turn; VAMILY.md is the
full-game queue (non-BB jobs carry a one-line brief there and in the plan).
VAMILY.md rebuilt: THE ORDER is now 10 deep across lanes, every lane has a
rest-of-the-game queue, ANIMATION / ART / LAB / CHARACTER / FACTIONS sections
added. CLAUDE.md lane list updated. He needs to open two chats: "quests" and
"animation". KNOW WHAT I DO NOT KNOW: no reader ran the game on a phone; the "170
quest file" is not in the repo; the suite cannot finish in budget.

COORDINATOR: 9/4 (ad) -- *** THE WORD IS VAMILY.
ONE FILE, VAMILY.md, IS THE ASSIGNMENT LEDGER AND THE HISTORY. Nothing to judge. ***
Paolo 9/4: "Make the key word vamily for all of the jobs u assign to it ever in
the history itll search if it has a job assigned for its role." LOCKED. Law:
laws/BOHEMIA_ADDENDUM_THE_VAMILY_WORD_9_4_26.md. He types VAMILY in any chat; the
chat reads its lane's section in VAMILY.md, takes the first OPEN job, marks it
CLAIMED (commit), builds, marks it SHIPPED (commit) when it is in the walked
surface and the demo. A chat with no role takes the top of THE ORDER there. Only
the coordinator adds jobs; lanes change the status word only. Every lane banner
in the backlog now says the word. Gate row: SHARED VAMILY-GATE.
HIS OTHER QUESTION, "do we have new chats to make?": NO NEW ROLES. Every job goes
to a role that exists -- world, sound, combat, run, quests, people, ui, words.
The only role with jobs and no handoff block on record is QUESTS.

COORDINATOR: 9/4 (ac) -- *** THREE RULINGS IN ONE
MESSAGE, RECORDED AS LAW: BATTERIES ARE THE MONEY, ONE WORD STARTS A CHAT AND IT
LANDS IN THE BETA, AND A COMBAT TILE IS A HOUSE. Nothing to judge. ***
laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md
(1) "i dont want there to be money money maybe electronics like batteries are the
currency. For one aa battery a bag of rice." No abstract currency. The three stand;
ELECTRICITY IS THE MEDIUM OF EXCHANGE. Measured: the market's SALVAGE_CURRENCY is
'resources' today; it moves to 'electricity', prices at 1 (EVERYTHING COSTS ONE).
Your lights now burn your money. WORLD's top row: BB-BATTERIES-ARE-THE-MONEY, done
as one job with BB-THE-LETTER-IS-ONE.
(2) "a simple shortcut where they know what they are supposed to do and be
incorporated into the beta and run": the lane word is the shortcut, and every lane
banner now says RE-CUT THE DEMO WHEN YOU SHIP -- a row is not shipped until it is
in the demo build.
(3) "each combat tile is the same size as the house and a pistol is like a dagger
... and a rifle can do two tiles": rules stay, board zooms out. Measured: pistol
eff 6, rifle eff 20 on body-scale tiles today; under the ruling 1 and 2 on
house-scale tiles. Ships as a DIAL in COMBAT's DEMO SETTINGS (TILE: A BODY / A
HOUSE), never by deleting the old board; no damage number moves; a seeded arena
must not re-deal when the dial flips. His two-tile rifle is a legibility trade
made on purpose and it is his. COMBAT's top row: BB-A-TILE-IS-A-HOUSE.
All three: 120 BPM friendly, per his 9/4 order. A step is one beat and one house.
FOLLOW-UP, SAME DAY, ON (3): "the player is the same size just what they 'walk'
on is a more zoomed out city so it really feels like war is spilling in the
streets." THE SPRITE DOES NOT SHRINK; the floor is the city's own zoomed-out
render centred on where you stand, one seed, same coordinates. Figures on a war
map. Written into the law (section 3b), the COMBAT row and CLAUDE.md.

COORDINATOR: 9/4 (ab) -- *** HE IS STARTING THE
OTHER CHATS NOW, AND EVERY BB ROW IS 120 BPM FRIENDLY OR IT IS NOT DONE. ***
Paolo 9/4: "Can I start telling the other chats to do shit now" -- yes, the top
row of every lane is a BB row and GO pops it. And LOCKED, on every row: "whatever
mechanic u implement just make sure its 120 bpm friendly for everything." Written
into all eight lane banners and the 8/28 BB law. The 120 BPM LAW already binds the
game; this names it on the eighty rows. A drain lands on the wake beat, the
nightfall beat or the bell; a claim is asked on the tap's beat; the ambience
heartbeat is eight beats; nothing ticks on wall-clock time.

COORDINATOR: 9/4 (aa) -- *** DAY 23, ON HIS OWN
DIRECTION: YOU NEVER SPEND A RESOURCE, WHAT YOU DID SPENDS IT. AND NOTHING YOU DO
IN BOHEMIA COSTS ANYTHING. Eighty BB- rows. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_23_FOUR_VERBS_THREE_CURRENCIES_9_4_26.md

His words, 9/4: "battle brothers has 3-4 currencies too you should look into that
fr how they manage it is superb." First day of the study he named himself.

WHAT IS SUPERB, IN ONE SENTENCE: YOU NEVER SPEND A RESOURCE. WHAT YOU DID SPENDS
IT. Crowns plus four consumables -- provisions (two per man per day, SPOILS, the men
eat nearest-to-spoil first, run out and they DESERT), tools (one point fixes 15
durability, drained after EVERY fight), medicine (heals faster), ammunition. Each
spent by exactly ONE VERB: walk, fight, get hurt, shoot. No allocation screen
anywhere, so you always know what took it -- the anti-spreadsheet answer he has
asked for since 7/26. Four punishment shapes (social, delayed-physical, time,
immediate-tactical), none a bar on the player, which is HOW the most punishing
campaign ever shipped has no hunger meter (day 7). And the devs' own blog admits
the first version was "kind of underwhelming... doesn't really add that much", so
they made HAVING food do something. A RESOURCE THAT ONLY PUNISHES IS A CHORE.

MEASURED 9/4: the ONLY debit in the whole game is buying at a market, in
`resources`, one caller, and its own comment already says the right thing ("A HARD
SINK, on purpose... the half of a faucet-and-drain economy that actually fights
inflation"). ELECTRICITY HAS NEVER MOVED. CLOUT HAS NEVER MOVED. Zero credits, zero
debits, anywhere. The ledger's KINDS already has `drain`; one verb uses it. STAKES
is [] on purpose (day 7). The lit grid costs nothing a night. Armour resets free
every bell (day 10). WALKING IS FREE, FIGHTING IS FREE, HOLDING GROUND IS FREE,
ASKING IS FREE, ONLY SHOPPING COSTS. Day 20's "nobody has ever been paid" reads
differently now: with nothing draining, pay would be a score, not an income.

THE MAP FITS HIS THREE WITHOUT A FOURTH. His law freezes three currencies, and his
RESOURCES bucket already carries the icons -- "an apple, duct tape, and maybe
another important thing" (7/26). THE ICONS ARE THE CONSUMABLES. Duct tape IS tools
and supplies. So: FOUR VERBS ON THREE CURRENCIES, every verb already in the game.
  THE DAY EATS FOOD (apple)          run out -> the people you owe stop showing up
                                     (BB-OBLIGATION-BURN, day 7). No meter on him.
  THE FIGHT EATS TAPE (duct tape)    the plate at the bell is spent. No tape, no plate.
  THE NIGHT EATS POWER (electricity) every lit circuit you hold burns one; unpaid
                                     goes dark. LIGHT=TERRITORY becomes a bill.
  ASKING EATS CLOUT (clout)          the approved claim ration already counts.
Every amount 1 (EVERYTHING COSTS ONE). Only food spoils (REALISM FIRST at 40C).
Having a resource grants ACCESS, never a stat (day 10, NO DAMAGE BEFORE THE DIAL).
REFUSED: a fourth currency; any meter on the player's body; ammunition as a purse
line (guns are bad in close forever, rounds ride the fight's own loot); any number
above 1.

Four rows: WORLD BB-FOUR-VERBS-THREE-CURRENCIES (second in the lane, directly behind
BB-THE-LETTER-IS-ONE, because a drain with no faucet is a countdown to zero on day
one), WORLD BB-THE-NIGHT-EATS-POWER, COMBAT BB-THE-FIGHT-EATS-TAPE, RUN/UI
BB-THE-SHADOW-OF-WHAT-YOU-DID (the reckoning names which verb took what).

COORDINATOR: 9/4 (z) -- *** THE BB ROWS ARE NOW AT
THE TOP OF EACH LANE'S QUEUE, SO "GO" POPS THEM. Nothing to judge. ***

Paolo, 9/4: "did you get any coding from your research" / "the jobs should be
ready for the assigned chat". MEASURED: 22 days, 76 rows, ZERO built by any lane.
THE CAUSE WAS MINE: the rows were stacked in routing order (newest on top), the
sound rows sat in WORLD instead of SOUNDS, the money and save rows sat in SHARED
where no named lane pops from, and the lane banners still said "the study is five
records and it is done". A row nobody's GO reaches is a row that does not exist.
FIXED IN BOHEMIA_BACKLOG.md, moves only, every row preserved (77 before, 77 after):
  RUN     -> BB-THE-PEOPLE-RIDE-THE-SAVE, then BB-THE-GATE-WALKS-THE-PEOPLE,
             BB-WHAT-YOU-OWE, BB-THE-TIME-NOT-THE-TAPS
  WORLD   -> BB-THE-LETTER-IS-ONE (his 8/15 ruling, unbuilt), then BB-TURF,
             BB-ROADS-ARE-FAST
  SOUNDS  -> BB-THE-CITY-SENDS-WHERE, then BB-THE-DAY-SONG-PLAYS,
             BB-THE-BED-IS-THE-PLACE, BB-A-LIT-BLOCK-HUMS
  COMBAT  -> BB-NERVE-ON (a const), then BB-GUNS-CLOSE, BB-PICKUP
  PEOPLE  -> BB-STANDING-PLAYER, then BB-WHAT-YOU-WERE
  QUESTS  -> BB-THE-JOB-PAYS, then BB-INSIDE-A-DAY
  UI      -> BB-ONE-NUMBER
  SHARED  -> BB-COLD-HAND, then BB-A-GATE-CAN-SAY-OWED
Every lane banner now says "the first row below is the one to pop on GO" and
points at the latest record. ALSO CORRECTED: the backlog's demo banner claimed
"GET PAID and SPEND are both live" for three weeks; day 20 ran it and it pays
0/0/0. The banner now says so and points at WORLD's top row.
LESSON FOR THIS SEAT: routing a row is not the job. A row is routed when the
lane's own GO reaches it. Check where the lane's cursor actually lands.

COORDINATOR: 8/28 (y) -- *** DAY 22 OF THE BB
STUDY: THE VALLEY MAKES NO SOUND WHEN NOTHING IS HAPPENING, AND THE FIX IS ONE
MESSAGE. Seventy-six BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_22_THE_CITY_MAKES_NO_SOUND_8_28_26.md

SOUND WAS THE LAST BIG UNTOUCHED SYSTEM -- three incidental mentions across 21
records, on a game whose spine is the 120 BPM LAW. The question: what does Bohemia
sound like when you are just standing in it?

*** TWO THINGS I EXPECTED TO FIND WERE WRONG. BOTH ARE RECORDED. *** (a) "WALKING
IS SILENT", which three records dated 8/20-8/21 still say, is STALE: footsteps are
built, __surfaceOf classifies SIX surfaces, ported from the run's classifier rather
than reinvented, with a fallback so an unapproved surface plays the old sound
instead of going quiet. (b) My first sweep looked for the RUN slice's message names
and got ZERO in the walked city, which reads as a catastrophe. THE POSITIVE CONTROL
KILLED IT: the city speaks a different vocabulary, bohemiaCitySfx and BOHEMIA_STEP.
FOURTH TIME THIS DISCIPLINE HAS SAVED A FALSE FINDING.
AND THERE IS A SOUND LANE AND IT HAS BEEN WORKING. The architecture is right: ONE
AudioContext, the parent's, because the city is an iframe and must never build a
second audio graph; placeSound does real distance, pan and occlusion; UI sounds are
DERIVED from the button's state so a withheld verb plays ui_deny "never by reading
a label"; stings get their own channel because "a sting is not a playSFX, it is a
figure in the score". None of that is the problem.

*** THE MEASUREMENT: 14 OF 65, AND EVERY ONE IS A REACTION. *** The bank holds 65
named sounds and 185 approved variants after eight thumb sweeps. Counted by what
the walked city SENDS, not what its text mentions (block appears 25 times and every
one is a city block; eat appears inside "heat"): come_up, phone_buzz, went_down,
door_drag, sleep_sink, three derived ui_*, and BOHEMIA_STEP mapping to six footstep
surfaces. FOURTEEN. **AND EVERY SINGLE ONE IS A REACTION TO SOMETHING THE PLAYER
DID. STAND STILL AND THE VALLEY MAKES NO SOUND AT ALL.**

*** THE BED IS BUILT AND HE GAVE IT HIS CLEANEST SWEEP IN THE BANK. *** air_day,
air_night and air_inside are FIVE VARIANTS OF FIVE, THUMBS UP -- fifteen of fifteen
-- and the MUSIC tab's own labels say what they are: "THE VALLEY AT MIDDAY, outside
in the heat, WHAT YOU HEAR WHEN NOTHING IS HAPPENING"; "THE VALLEY AT NIGHT,
outside after dark, THIS ONE IS THE HORROR"; "INSIDE A BUILDING, a room with nobody
in it but you". The AMB bed that plays them is finished, tuned (a random 40-95s
gap, its own bus at 0.4 of the judged level, stops entirely when reports stop so it
can never play over him judging candidates) and documented: "a rare sound so the
valley is not dead air... it makes the place feel occupied by nothing."
THE CAUSE IS ONE MESSAGE. AMB.where has exactly ONE caller: the BOHEMIA_WHERE
handler, which in the same line also sets LISTENER.inside (occlusion), musicPhase
(the day/dusk/night music pool) and timePass. BOHEMIA_WHERE is posted by
slices/BOHEMIA_RUN_CURRENT.html EVERY FOUR SECONDS. THE WALKED CITY NEVER POSTS IT
-- positive control: its only two hits for that string are FILENAMES INSIDE
COMMENTS. **FOUR SYSTEMS ON ONE HEARTBEAT, AND IT IS THE FIFTH SYSTEM THE 8/14
ONE-WALKED-SURFACE MIGRATION STRANDED** (day 6 found the faction world). A
MIGRATION LIST IS A DELETION LIST FOR EVERYTHING NOT ON IT, and this is what that
looks like when nothing crashes.

*** AND THE MUSIC IS PERMANENTLY NIGHT. *** CITYMUS.phase ships hardcoded 'NIGHT'
and musicPhase(d) is THE ONLY ASSIGNMENT TO IT IN THE BUILD, so on the surface he
walks phaseCat() returns OVERWORLD NIGHT forever. The alpha's own 8/4 block already
found and fixed this once, for the RUN: "the clock landed. Nobody set it... over
200 draws, THE MARKER ON THE DOOR came up ZERO times -- the one song in this entire
project he has ever said he likes, tagged OVERWORLD DAY by his own hand, unplayable
in the run since the day he tagged it." IT WAS FIXED ON 8/4 AND THE MIGRATION
UNFIXED IT. A fix a later migration undoes is not a fix, it is a gap with a record.

BOTH AISLES POINT THE SAME WAY. Battle Brothers' ambience is PER-TERRAIN and
PER-SETTLEMENT -- seagulls and waves on the coast, insects and frogs in swamp, icy
wind in snow, wolves howling at night in forest, crickets in the steppe; and inside
a town, people, dogs, cats, chickens, smithy hammering, temple sermons, tavern
laughter. THE PLACE TELLS YOU WHAT IT IS BEFORE YOU LOOK AT IT, and that is day
13's "stop counting content and count COMBINATIONS" at ZERO ART COST.
Schafer's acoustic ecology names the missing thing exactly: KEYNOTE SOUNDS are the
background bed, "not listened to consciously, but may deeply imprint a person's
sense of PLACE", as against SIGNALS meant to be noticed. WE SHIP ONLY SIGNALS. WE
HAVE NO KEYNOTE.
And the 2020 lockdowns are the largest measurement ever taken of a world with its
machines off: human-generated high-frequency ground noise fell BY UP TO 50%, the
longest and most prominent drop in recorded history, LARGEST IN THE DENSEST CITIES
-- and signals that had always been there, previously buried, BECAME CLEARLY
AUDIBLE. **DEAD IS NOT SILENT. DEAD IS A DIFFERENT BED.** When the machines stop
you do not lose sound, you lose the layer that was masking everything else: wind
gets loud, a generator four blocks away gets loud, a dog gets loud. Post-collapse
Las Vegas should be the most sonically distinctive place we could have picked and
it is currently the quietest room in the build.

THE CHALLENGE: day 13 took his loudest complaint, "THE CITY SEEMS DEAD ASF", and
answered it entirely in the visual and content domain, because we assumed the
feeling came from what he could SEE. AND THIS IS THE CHEAPEST UNFINISHED THING IN
THE STUDY: the sounds are recorded, the three bed sounds got a perfect sweep, the
bed logic is written and tuned, the bus and limiter and placement model all exist
and are correct. WHAT IS MISSING IS ONE MESSAGE, EVERY FOUR SECONDS, FROM THE
SURFACE HE WALKS.
REFUSED: cooking more sounds. 51 of 65 approved sounds are unreachable already, and
recording more while the approved ones cannot play is the seventeen-invisible-hats
shape for the fourth time.

Four rows: SOUND/RUN BB-THE-CITY-SENDS-WHERE (take this first -- one message, four
systems, no art, no ruling), MUSIC/SHARED BB-THE-DAY-SONG-PLAYS (verify by observed
phase, not by reading the code, because this bug has already been undone once),
SOUND/WORLD BB-THE-BED-IS-THE-PLACE (per-district ambience; WHICH place sounds like
WHAT is his), SOUND/WORLD BB-A-LIT-BLOCK-HUMS (generator and power_on are approved
and never sent, and a hum is not a name so it needs no canon).

COORDINATOR: 8/28 (x) -- *** DAY 21 OF THE BB
STUDY: THE SAVE IS THE SECOND-BEST-BUILT THING IN THE PROJECT AND THE PEOPLE ARE
STANDING OUTSIDE IT. Seventy-two BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_21_WHAT_SURVIVES_WHEN_YOU_CLOSE_THE_TAB_8_28_26.md

A HUNDRED-HOUR GAME, IN A BROWSER TAB, ON A PHONE, AND TWENTY DAYS NEVER ASKED
WHETHER IT REMEMBERS YOU. THERE ARE NO RUNS, three generations that INHERIT, and
nobody had checked what is still there tomorrow.

*** THE GOOD NEWS FIRST, BECAUSE IT IS RARE IN THIS STUDY: I EXPECTED A HOLE AND
THERE IS NOT ONE. *** engine/bohemia_save.js (8/11) is 330 lines written against a
hostile iPhone and its header lists the four ways v1 lost runs and kills each:
THE PROBE LIED (a one-byte test write succeeds exactly where a real 200KB save
throws quota, so v2 probes with a blob THE SIZE OF THE REAL SAVE and reads it
back); THE TIME MACHINE (v1 fell to memory and left the OLD save on disk, so the
next launch silently sent you backwards -- v2 POISONS the slot and writes a
tombstone the instant a write fails); ONE SLOT (v2 keeps TWO with a generation
counter and ALWAYS writes the OLDER one, so a torn write costs the newest state,
never everything); NO INTEGRITY (every envelope carries a byte length and an FNV-1a
checksum, and load takes the highest generation that VERIFIES). Plus a version
chain with migrations, a refusal that is REPORTED rather than looking like an empty
save, and THE PHONE PATH -- pagehide, freeze, blur and visibilitychange all flush.
gates/save_iphone_gate.js drives all of it against a fake hostile browser: RUN
TODAY, 44 PASSED, 0 FAILED.
AND THE SNAPSHOT CARRIES THE RIGHT LIST: seed, day, minute, WHERE YOU ARE
STANDING, the city cell, mode, riding, zoom, the whole day loop, the whole quest
runtime, the day's cast, the purse and the market ledger. Its own comments are some
of the best design writing in this repo: "a day loop that does not survive a reload
is a session toy, not a loop"; "a day's pay that dies with the tab is not pay".

*** THE FINDING: THE WORLD IS INSIDE THE WALLS AND THE PEOPLE ARE OUTSIDE THEM. ***
The walked city makes TEN localStorage writes. Four are dev tools. THE OTHER FIVE
ARE THE GAME'S MEMORY OF PEOPLE, and every one goes to raw localStorage AROUND the
hardened save: boh.city.minds (what a mind holds), boh.city.known (what you
overheard), boh.city.met (who you have met and whose name you know), boh.city.belong
(whether an outfit counts you and what you owe), boh.city.deedweight.
ONE SLOT. NO CHECKSUM. NO MIGRATION ON FOUR OF FIVE. SILENT catch(_e){} ON FAILURE.
That is the exact four failure modes the save module exists to kill, rebuilt
outside its walls. AND MEASURED: met, minds, known, belong and deedweight appear
ZERO TIMES in citySnapshot. So EXPORT SAVE DOES NOT CARRY THE PEOPLE; a restore
hands you yesterday's world with TODAY'S population; and the two-slot rollback
DESYNCS THEM -- the world rolls back a generation and the people do not. A TORN
SAVE ACROSS TWO SYSTEMS IS WORSE THAN A LOST ONE BECAUSE YOU CANNOT SEE THAT IT IS
WRONG, which is the belonging code's OWN comment, one function above the break.
The 44-check gate mentions none of the five. And a clean slate cleans TWO of five
-- __CT.wipe takes met and belong, minds/known/deedweight survive it -- under a
comment that already reads "A WIPE THAT LEAVES HALF THE SAVE IS NOT A WIPE".
WHY IT IS THE WORST PLACE FOR THE GAP: day 4 (attachment is marks that persist),
day 7 (the motor is obligations to people), day 16 (because we never reset, every
relationship here is a REPEATED GAME) and day 20 (with no paper and no courts the
contract IS repeat business) all landed on the same conclusion independently: THE
PEOPLE ARE THE POINT, and the people are the one thing not in the save.

*** AND THE OTHER HALF IS A PLATFORM FACT WE DO NOT GET A VOTE ON. *** Since iOS
13.4 / Safari 13.1, WebKit DELETES ALL of a site's script-writable storage --
localStorage, sessionStorage, IndexedDB, service worker registrations -- after
SEVEN DAYS of browser use without interaction on that site. No code beats it.
**THE FIRST LINE OF CLAUDE.md SAYS THERE ARE NO RUNS. SAFARI SCHEDULES ONE, ON A
ONE-WEEK CLOCK.** There is EXACTLY ONE exemption and we already built the door: a
web app added to the HOME SCREEN is not part of Safari and keeps its own counter of
days of use, which resets every time it is used. **SO ADD TO HOME SCREEN IS NOT A
CONVENIENCE FEATURE. IT IS THE SAVE.** status() already computes evictionRisk off
navigator.standalone and says the true sentence, and __KEEP_THIS_RUN__ already puts
the ask on the reckoning card he is already reading, ONCE, with installAsked riding
in the save. All correct -- and it is one line, asked one time, on the one night he
happens to read that card, defending a hundred hours. Right shape, possibly wrong
weight, and that is a judgement to make on purpose. RE-CHECK THE RULE before the
demo goes wide: it is WebKit's published 13.4 behaviour and I did NOT find a
2025-26 source confirming it is unchanged.

THE NEAR-MISS, RECORDED BECAUSE IT IS THE THIRD OF ITS KIND: my first measurement
said slices/BOHEMIA_DEMO.html carried NONE of the five people keys, which reads as
a big demo-critical finding. THE POSITIVE CONTROL KILLED IT -- applyRestore and
__DAY_LOOP__ are zero in the demo AND zero in the alpha, because BOTH load the
walked city by `src` as a separate file. The demo carries the save exactly as the
workshop does. Same lesson as the base64 fight (day 4) and the muzzle heat (day
15): A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE
INSTRUMENT COULD HAVE SEEN A POSITIVE ONE.

ALSO MEASURED: Battle Brothers autosaves BEFORE EVERY BATTLE and again on leaving a
town -- the fight is protected ON PURPOSE. Ours: CITYSAVE.save fires only when the
city posts state and NOTHING fires it when combat opens; opening the fight blurs
the city iframe, which fires flushState, so it is probably saved BY A SIDE EFFECT,
NOT BY INTENT. A protection nobody wrote down is a protection nobody is maintaining.

Four rows: SHARED BB-THE-PEOPLE-RIDE-THE-SAVE (take this one first in its lane),
SHARED BB-THE-GATE-WALKS-THE-PEOPLE, RUN/UI BB-HOME-SCREEN-IS-THE-SAVE,
COMBAT/SHARED BB-SAVE-BEFORE-THE-BELL.

COORDINATOR: 8/28 (w) -- *** DAY 20 OF THE BB
STUDY: NOBODY IN BOHEMIA HAS EVER BEEN PAID FOR A JOB, AND HE ALREADY RULED THE
FIX ON 8/15. Sixty-eight BB- rows routed, and one of them is ON THE DEMO PATH.
Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_20_NOBODY_HAS_EVER_BEEN_PAID_8_28_26.md

Day 1 studied the OFFER -- what work exists and what gates it. Nineteen days later
nobody had asked the next question: ONCE YOU SAY YES, WHAT HAVE YOU AGREED TO?

MEASURED across all 27 playable canon quests -- every `@DO` call, counted: 203
set_stage, 110 complete_objective, 93 learn, 82 faction, 58 bond, 51
show_objective, 50 set_flag, 17 faction_posture, 10 advance_territory, 9 cast, 4
play. **687 CALLS AND `@DO pay` APPEARS ZERO TIMES.** The verb EXISTS and was
built 8/11 on HIS OWN ruling ("whatever currency the quest decides to give");
nobody has ever written one. Also zero: `@DEADLINE`, `@EXPIRE`, `@DAYS`, `@PAY`,
`@REWARD`, `@TIMER` -- in the language AND in the corpus -- plus zero haggle,
counter-offer, advance or retainer anywhere in the walked city. **A JOB IN
BOHEMIA HAS NO PRICE, NO CLOCK AND NO TERMS.**

*** AND THE PIPE IS NOT MISSING. IT IS BUILT, WIRED, GATED, CALLED ON THE REAL
SURFACE -- AND EMPTY. *** RUN, not read (node probe against the real modules):
finishing a #notable job the way all 27 canon quests finish one returns
`{"applied":false,"reason":"NO_RULING","table":"PAYOUT"}` with balances 0/0/0.
POSITIVE CONTROL, same call with a reward declared: `{"applied":true,
"paid":{"resources":1}}`. `payForToday()` on the walked surface calls
`BohemiaPayday.payForQuest`, which credits a real ledger, and `payday_gate.js`
proves it. THE INSTRUMENT WORKS. IT PAYS NOTHING BECAUSE THERE IS NOTHING TO PAY.

*** THE FINDING, AND IT IS AN AUDIT OF US, NOT OF THE GAME: HE SENT THE NUMBER ON
8/15 AND IT WAS NEVER BUILT. *** laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_
26.md, his words: "just make everything cost one. Just start off with one and then
I'll move from there." It names PAYOUT, PRICES and PRODUCTION BY NAME and says they
"fill with ones TODAY". Its own closing line: "the pipe is finished and the valve
is his, ONE LETTER OPENS IT -- he sent the letter, and the letter is 1."
TODAY ALL THREE ARE STILL `{}` AND ALL THREE STILL CARRY `[PENDING Paolo]` -- in
engine/bohemia_purse.js, in slices/BOHEMIA_CITY_WORLD.html and in
slices/BOHEMIA_RUN_CURRENT.html. Backlog row E1 says DO THIS FIRST and is still
open; a banner near the top of the same file says "GET PAID and SPEND are both
live". BOTH CANNOT BE TRUE.

*** AND THE GATES NEVER LIED -- WHICH IS THE STRUCTURAL FINDING. *** Both say it
out loud in their own summary line, every run: placeholder_number_gate, "the three
tables are still EMPTY"; demo_blockers_gate, "22 passed, 0 failed (0 blockers · 3
RULED-BUT-EMPTY TABLES)". The machine has been telling us for twenty days, INSIDE
A GREEN PASS. **OUR GATES CAN SAY BROKEN OR FINE AND THEY HAVE NO WORD FOR OWED.**
So A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED gets a twin nobody had written:
**A RULING IS NOT SHIPPED UNTIL SOMETHING RUNS IT.**

THE COLLISION UNDERNEATH, and it is the reason no single lane could have caught
this: demo_blockers_gate carries a CORRECT comment saying a ruling can retire a
blocker without filling its table, because 8/11 moved the reward ONTO THE QUEST.
8/15 is NEWER and fills the FALLBACK TABLE. They do not conflict -- a quest
declares its own reward, anything undeclared falls through to a table of ones --
but they hand the same job to two different lanes, so QUESTS and WORLD can each
correctly believe it is the other's. Nobody is wrong and nothing gets built.

REAL AISLE: with no paper and no courts, an informal deal is enforced by the fact
that you will do business again -- day 16's shadow of the future arriving from a
second direction. And Hart and Holmstrom (Nobel 2016): NO CONTRACT CAN SPECIFY
EVERY EVENTUALITY, so what actually matters is WHO DECIDES in the cases nobody
wrote down. *** AND WE ALREADY GAVE THAT TO THE PLAYER, WHICH IS THE ONE PART OF
THE CONTRACT WE BUILT BETTER THAN THE GAME WE ARE STUDYING: *** every quest
completes at three or four TIERS (#quiet 25, #notable 24, #risky 16, #reckless
21) -- the job says what somebody needs and THE PLAYER PICKS THE MANNER, which is
what gets recorded. And all 27 FAIL branches are reached BY SAYING NO IN A
CONVERSATION, never by a clock running out. **DO NOT PUT A TIMER ON A QUEST.**

Four rows: SHARED BB-THE-LETTER-IS-ONE (on the demo path -- the demo cut's own
"GET PAID then spend at a hub" beat cannot happen without it), SHARED
BB-A-GATE-CAN-SAY-OWED, QUESTS BB-THE-JOB-PAYS, QUESTS/WORDS BB-ASK-FOR-MORE
(haggling with a rising cost: free once, risky twice, and the third time they are
done with you -- an @OPT on a @TALK node, no new screen, no balance number).

COORDINATOR: 8/28 (v) -- *** DAY 19 OF THE BB
STUDY: THE FIRST JOB IS A SEVEN-HOUR ROUND TRIP, AND A STREET THAT IS NOT FASTER
IS A PICTURE OF A STREET. Sixty-four BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_19_WHAT_IT_COSTS_TO_GO_SOMEWHERE_8_28_26.md

The last untouched campaign system, and the verb the player performs most: WALKING.

MEASURED AND CROSS-CHECKED -- I verified the walked scale and the overmap scale
against each other rather than trusting either, and they agree. A fine tile is
0.75 m (`CELL_M`); the walk ticks 0.084 MINUTES PER FINE CELL, described in the
city's own words as "time per CELL, distance-honest", with the day loop stating
the consequence plainly: "TWELVE WALKED CELLS COST ONE MINUTE". And the pad's own
comment: "a press is not a step -- it is NINETY-SIX METRES AND TEN MINUTES". Both
come out at ABOUT NINE METRES A MINUTE.
WHAT THAT BUYS: the day runs 06:00-22:00 = 960 minutes, so A FULL DAY OF WALKING
IS ABOUT 8.6 KM, and the valley is 96 cells x 96 m = ABOUT 9.2 KM ACROSS.
CROSSING THE VALLEY ON FOOT IS A LITTLE MORE THAN ONE ENTIRE DAY. That is a GOOD
number and the whole travel design should be built on it.

*** AND THE FIRST JOB IS A SEVEN-HOUR ROUND TRIP. *** The QUESTS lane's own
measurement from the block he wakes up on: nearest TRADES 5 blocks (~1.9 km), the
TRADES BASE 7 blocks (~2.7 km). And day one's quest demands `faction=TRADES` for
its ONE REQUIRED role. At nine metres a minute that is ~211 MINUTES EACH WAY --
SEVEN HOURS THERE AND BACK, FORTY-FOUR PERCENT OF THE FIRST DAY A PLAYER EVER
PLAYS. NOBODY HAD MULTIPLIED THE TWO NUMBERS TOGETHER. (To be fair to the lane:
the casting bridge FINDS that person and gives them a real address, which is the
hard part and it is done. This is about the DISTANCE, not the finding.)

REAL AISLE: von Thunen -- transport cost rises with distance and THAT ALONE
determines what happens where. And the isochrone was written into law: the City of
London controlled markets within SIX AND TWO-THIRDS MILES, "the distance a person
could be expected to walk to market, sell his produce and return in a day". OUR
VALLEY IS EXACTLY ONE MARKET TOWN'S CATCHMENT -- the map is already the right SIZE
for its clock.

*** THE FINDING, AND IT CORRECTS HALF OF DAY 2. *** FRICTION IS PROTECTED still
stands. It is also HALF the rule, and this study has quoted only that half for
seventeen days: the game we are studying protects friction AND makes ROADS FAST
AND ships a pause/normal/fast SPEED CONTROL. Those are two halves of one rule --
**THE COST IS REAL, THE WATCHING IS NOT. DISTANCE SHOULD SPEND THE DAY, NOT THE
PLAYER'S ATTENTION.** Our long walk correctly costs in-game hours; it also costs
the player twenty real taps, and that second cost buys nothing.
AND THE LEVER WE ARE NOT USING AT ALL: ROADS ARE THE ONLY THING THAT CHANGES THE
SHAPE OF THE MAP WITHOUT REMOVING THE FRICTION -- a fast road does not flatten the
valley, it gives it a GRAIN. We own a harmonised street bank, SIDEWALK SANCTITY,
the street-aware/drivable law and his 8/25 LEGO-streets ruling, AND A STREET COSTS
EXACTLY THE SAME TIME AS BROKEN GROUND. Every one of those streets is mechanically
scenery. A STREET THAT IS NOT FASTER IS A PICTURE OF A STREET, and fixing it needs
NO NEW ART.

Three rows: WORLD/RUN BB-ROADS-ARE-FAST, RUN/UI BB-THE-TIME-NOT-THE-TAPS (measure
it with day 14's COLD HAND before anybody calls the demo ready -- twenty identical
presses is exactly what a cold hand does), QUESTS BB-INSIDE-A-DAY (DISCLOSURE, not
relocation: a job says how far it is before you take it, because where people are
is his and MAP LAW holds).

COORDINATOR: 8/28 (u) -- *** DAY 18 OF THE BB
STUDY: THE MIDDLE HORIZON EXISTS, IT IS HIS, IT IS ON THE WALKED SURFACE, AND
CROSSING IT PAYS NOTHING YOU CAN USE. Sixty-one BB- rows routed. Nothing to
judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_18_THE_MIDDLE_HORIZON_8_28_26.md

A GAP IN THE STUDY ITSELF: day 7 found the DAILY motor (why you get up tomorrow),
days 9 and 11 found the HUNDRED-HOUR arc, and NOBODY ASKED WHAT YOU ARE WORKING ON
THIS WEEK.

THE REAL AISLE IS BLUNT. 40 children, behind and uninterested in arithmetic, in
self-directed learning under three conditions: PROXIMAL SUB-GOALS (finish one set
this session), A DISTAL GOAL (finish everything by the last session), or "work
productively". Under proximal sub-goals they progressed rapidly, reached
substantial mastery, and developed BOTH self-efficacy AND real interest in a
subject that had held no attraction. *** DISTAL GOALS HAD NO DEMONSTRABLE EFFECTS.
Not weaker. NONE. *** A GOAL A HUNDRED HOURS AWAY DOES NOT MOTIVATE ANYBODY.

*** AND THE GOOD NEWS IS BIG: THE MIDDLE HORIZON ALREADY EXISTS AND IT IS HIS. ***
engine/bohemia_mandate.js is INLINED in the walked city -- NOT stranded behind the
loop like the faction world -- carrying his 6/30 ruling as its header and built as
THREE RUNGS onto the three acts: TERRITORY (build where you are loved) -> MANDATE
(the city backs you, so you can build where the locals do not) -> MAYOR (you are
governing). "Negotiation gives way to mandate gives way to rule."
IT IS REACHABLE: a real on-screen "◆ STANDING" button, bottom-left, on a card that
shows your rung, your share, and how many more factions you need. AND ITS INPUT IS
LIVE: rungStandings() reads DQ.shared.faction, which day 7 showed is genuinely
written by `@DO faction` and the daily neglect charge. The rung is DERIVED every
time it is asked, so losing favour drops you by construction.

*** AND CROSSING A RUNG PAYS YOU NOTHING YOU CAN USE. *** `MANDATE_SHARE = 0.49`
(his number, flagged "starting instinct, not final"); `MAYOR_SHARE = null` [PENDING
Paolo: "enough done, enough love" is not a number], so THE LADDER HAS THREE RUNGS
AND TOPS OUT AT TWO; and `grantsAt` answers NO_RULING BY NAME because the grants
are canon nobody ruled. THE MODULE IS RIGHT TO REFUSE TO INVENT A COST MULTIPLIER.

*** THE UNLOCK IS THIS STUDY'S OWN AND IT ASKS HIM FOR NOTHING. *** Day 10
concluded that loot cannot be power so it has to be ACCESS. SAME HERE: A RUNG'S
GRANT CAN BE A DOOR, NOT A DIAL -- and the door is ALREADY WRITTEN in the rung's
own words: "The city backs you. You can build in a district whose local faction
does not love you." A place you could not build in and now can is not a dial, and
NO DAMAGE BEFORE THE DIAL is not violated by opening one. MAYOR_SHARE and the
rung-three grant STAY HIS AND STAY PENDING; they do not block rung two.

ALSO TAKEN FROM BB'S AMBITIONS, and neither half needs canon: YOU CHOOSE the
week's goal from a short list (the difference between an errand and an intention),
and its reward is an IDENTITY OBJECT rather than a number (their banner ambition
gives a unique item made from your own banner; another changes how you look on the
world map).

Three rows: WORLD BB-THE-RUNG-PAYS, RUN/UI BB-THIS-WEEK (a goal you have to go
find is not a goal -- put it on the reckoning card), QUESTS/PEOPLE BB-YOU-PICK-IT.
*** NOTE: BB-THIS-WEEK is now the THIRD day of this study to want the reckoning
card, with BB-WHAT-YOU-OWE (day 7) and BB-THE-END (day 13). One card, one
afternoon, three findings. ***

COORDINATOR: 8/28 (t) -- *** DAY 17 OF THE BB
STUDY: WORDS FOR THE WORLD, ONE NUMBER, AND THE NUMBER IS HIS CHANCE ON YOU.
Fifty-eight BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_17_HOW_MUCH_DO_YOU_SHOW_8_28_26.md

THE SECOND COLLISION BETWEEN HIS OWN TWO NAMED GAMES (day 9 found the first, about
growth). BATTLE BROTHERS SHOWS YOU THE MATH: hover an enemy and a tooltip gives
the hit chance, and the numbers are public arithmetic -- attack minus defence,
+10% from higher ground, -10% per level below, shields adding defence, a 75%
penalty on a blocked ranged shot. ROGUE FABLE 4 DOES THE OPPOSITE, and our own
dossier already quotes it: "deliberately free of stat and formula bloat, most of
the critical information presented in the world and on the field of battle
itself." AND HIS OWN LINE SITS ON THE RF4 SIDE: "spreadsheet simulators and I'm
not a fan." Both references are locked and nobody had written down which way we go.

*** WE ALREADY BUILT THE ANSWER AND NOBODY WROTE IT DOWN. *** The fight's readout
line prints: DARK / UNDER THE DECK / HE IS ABOVE YOU / no cover counts / [RANGE
TIER] / his dial: [NAME] / HE HITS YOU 62%, with that number coloured
green-amber-red by threat. THE WORLD IN WORDS, AND EXACTLY ONE NUMBER.
AND IT IS NOT THE NUMBER THE OTHER GAME SHOWS. Theirs answers "WHAT IS MY BEST
MOVE" (your chance to hit him). OURS ANSWERS "HOW MUCH TROUBLE AM I IN". ONE IS AN
EFFICIENCY DISPLAY; OURS IS A DANGER DISPLAY -- and that is correct for a game
whose whole tactical design is exposure (day 3 refused cover-and-hold; V180
measured 56% of open-ground turns with a gun that can reach you). A DANGER DISPLAY
MAKES THE PLAYER MOVE. AN EFFICIENCY DISPLAY MAKES HIM CALCULATE.

THE FINDING, AND I EXPECTED THE OPPOSITE: I opened the day expecting to conclude
"show less". THE RISK IS NOT THAT WE SHOW TOO MUCH TODAY, IT IS THAT SOMEBODY ADDS
A SECOND NUMBER. One number is a READING; two numbers is a COMPARISON, and a
comparison invites optimisation -- the moment a player holds "he hits me 62%"
against "I hit him 71%", the turn stops being about ground and becomes a sum,
which is the 40-minute chess match arriving THROUGH THE INTERFACE instead of
through the rules.
*** AND THIS STUDY IS THE THREAT. Six routed rows all want to say something on
that screen: the heat/pip budget (15), the standing web (1), the circuit owner
(6), who you owe (7), BB-WHY (3), and the act buildup (11). Together they would
undo the thing we already got right. ***
BACKING IT UP: working memory holds about FOUR CHUNKS of novel information; the
interface rule is RECOGNITION RATHER THAN RECALL; and day 9's chess result says a
chunk is BIGGER FOR AN EXPERT, so a line made of words you RECOGNISE grows with
the player automatically. Ours is 4-6 chunks, almost all words.

Three rows: UI/COMBAT BB-ONE-NUMBER (read this before taking any UI row), UI
BB-READ-LINE-AUDIT (`setRead` is called 160 TIMES -- a MEASUREMENT, not a fix; do
not change a word before counting what actually reaches the screen), COMBAT
BB-NO-BREAKDOWN (a refusal: no hover tooltip decomposing a roll into factors; if a
factor matters it becomes a WORD in the line or a thing you can see on the ground).

COORDINATOR: 8/28 (s) -- *** DAY 16 OF THE BB
STUDY: THE PLAYER ONLY LIVES ONCE, SO THREE OF THIS STUDY'S OWN FINDINGS MUST NOT
BE BUILT. Fifty-five BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_16_THE_PLAYER_ONLY_LIVES_ONCE_8_28_26.md

Day 16 audits the study itself, which is this seat's job and not a lane's.
FIFTEEN DAYS TOOK MECHANISMS OUT OF A GAME BUILT TO BE PLAYED AGAIN AND PUT THEM
INTO A GAME PLAYED ONCE, and nobody had checked which ones need a second
playthrough to pay off.

BB IS A REPLAY MACHINE: ELEVEN ORIGINS, each with "different starting characters,
equipment, resources, and special rules" that "impact it from beginning to end"; a
world generated fresh each campaign; a crisis you choose or randomise; permadeath
plus no reloading; and wide stat ranges on cheap recruits (the lucky farmhand).
Every one of those is a machine for making the SECOND campaign different from the
first.
OURS: `const BOH_SEED_TEXT='bohemia'` with ZERO ways to change it (one valley
forever, already routed as WORLD SEED-1/SEED-2), plus THERE ARE NO RUNS, death is
a reload not a reset, and the dynasty INHERITS across three generations.

*** DO NOT BUILD THESE THREE. Their payoff is a second playthrough:
(1) WIDE STAT VARIANCE AS A STORY ENGINE -- "the beggar who became a legend" is
    told across many rosters; roll once and it is a dice result. Day 8's real half
    (a background is WHAT SOMEBODY STILL THINKS THEY ARE) is untouched.
(2) A ROLLED OR CHOSEN CRISIS -- variety across campaigns is worth nothing when
    there is one. Day 11's SHAPE survives (foretold, buildup, not optional,
    escalation by coalition); the act turn is AUTHORED and it is his.
(3) ORIGINS / STARTING SCENARIOS, entirely.
THE STANDING QUESTION FOR ANY NEW BB- ROW: DOES THIS PAY OFF THE FIRST TIME? ***

*** AND THE OTHER HALF IS A STRUCTURAL ADVANTAGE NOBODY HAD NOTICED WE HAVE. ***
In a ONE-SHOT encounter the rational move is to DEFECT; in a REPEATED one,
cooperation emerges and wins. Axelrod's tournament was won by the SIMPLEST entry,
TIT FOR TAT -- open nice, then copy what the other side did last time, four lines
of code -- and the mechanism is THE SHADOW OF THE FUTURE: "if the players expect
to meet again, they are more likely to cooperate than when dealing with a 'one
time only' counterpart."
BECAUSE WE NEVER RESET, EVERY RELATIONSHIP IN BOHEMIA IS A REPEATED GAME. One
valley forever, one continuous life, three generations inheriting standings,
territory and unhealed wounds. THE SHADOW OF THE FUTURE IS NOT A METAPHOR HERE, IT
IS THE ARCHITECTURE -- and BB structurally cannot have it, because it throws the
world away. That is the real payoff behind day 1's reputation web, day 6's turf,
and day 12's man-who-lives-is-the-one-who-tells-people.

THE WARNING IS THE INVERSE, AND IT IS ALREADY MEASURED: ANYTHING THAT MAKES AN
ENCOUNTER ONE-SHOT IS TELLING THE PLAYER TO DEFECT. Day 12 found that a man who
breaks runs to distance 30 and IS DELETED -- the single person who would have
carried your reputation out of that fight is removed from the world. WE BUILT THE
SHADOW OF THE FUTURE AND THEN DESPAWNED IT. The same test applies to a district
you clear and never revisit, a person who exists only inside one quest, and a
faction whose memory resets at a day boundary.

Three rows: SHARED BB-ONE-LIFE-AUDIT (ten minutes, bookkeeping, stops a lane
building a replay feature by accident), PEOPLE BB-THE-SHADOW (cheapest first
version: THE MAN YOU SPARED TURNS UP), RUN/COMBAT BB-NOBODY-DESPAWNS (rides with
BB-THE-ROUT, same behaviour, same file).

COORDINATOR: 8/28 (r) -- *** DAY 15 OF THE BB
STUDY: THE DESERT IS THE SETTING OF THIS WHOLE GAME AND THE FIGHT TAKES PLACE IN A
CLIMATE-CONTROLLED ROOM. Fifty-two BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_15_THE_FIGHT_DOES_NOT_KNOW_IT_IS_HOT_8_28_26.md

The last big BB system: FATIGUE. Day 3 asked how you give orders, day 12 asked what
makes a fight END, and nobody asked what makes a single TURN interesting.

BB'S ANSWER IS THAT PROTECTION COSTS YOU TEMPO. Every armour piece carries a
FATIGUE PENALTY that lowers your maximum stamina, and accumulated fatigue lowers
INITIATIVE, so "someone in light armour will act before someone in heavy armour,
and someone fresh will act before someone fatigued". A man too tired to act is a
liability, not a soldier.
THE REAL AISLE SAYS THE SAME THING, MORE LITERALLY, IN HIS OWN SETTING: wearing
body armour ADDS ABOUT 5F to the heat your body actually experiences; the standard
answer to heavy work in that band is a WORK/REST CYCLE of 20 MINUTES ON AND 40 OFF
with a litre of water an hour; core temperature hits its 38C limit at about 165
minutes in a 28.5C environment while armoured; and "INTERMITTENT WORK AND LOW
INTENSITY WORK PREVENTED EXCESSIVE HEAT STRAIN FROM DEVELOPING" even above 30C.
YOU SURVIVE THE HEAT BY GOING HARD AND THEN STOPPING.

*** WE HAVE BOTH HALVES AND THEY HAVE NEVER MET. *** The fight already HAS a
work/rest cycle and it is HIS: `const STAM_MAX=3` with the comment "V54 STAMINA
(Paolo, Fable model): stamina actions DON'T end your turn" -- a sprint spends a pip
and your turn keeps going, and the pips come back on the clock as SECOND WIND, "the
clock came round, your legs are back". AND THE WALKED CITY ALREADY ORGANISES ITS
ENTIRE DAY AROUND THE HEAT: outdoor labour runs EARLY because of "summer 40C+
afternoons", the canon has a "Mojave midday shelter", and every person carries a
`heatTol`.
AND `enter(G,d,env)` RECEIVES THE PLAYER'S HP, A ROSTER, A PACKAGE ID AND A STAMINA
MAX. No hour. No temperature. No weather. No memory that you just walked three
kilometres. Then it opens with `cleanSlate(G)`, "nothing from the last fight
survives."
INSTRUMENT NOTE, because it nearly fooled me: `heat` appears 42 times in the
decoded fight and EVERY ONE is MUZZLE heat (shots stacking within 2.5s) or a CAR
cooking off. Not one is temperature.

THE FINDING: every pipe finding in this study so far has been OUTBOUND -- the boss
keys published to nobody (day 9), the loot that never leaves (day 10), the player
who cannot leave (day 12). THIS IS THE FIRST INBOUND ONE: nothing goes IN either.
A FIGHT AT 06:00 AND A FIGHT AT 14:00 SHOULD NOT BE THE SAME FIGHT, and making that
true costs no new system, no art, and NO DAMAGE NUMBER -- fewer pips is a BUDGET,
not damage. It also makes day 3's conclusion concrete: THE CLOCK IS OUR PLINKER,
and the thing that says HURRY UP is the sun.

Four rows: COMBAT/RUN BB-THE-FIGHT-KNOWS-THE-DAY, COMBAT BB-THE-HEAT-IS-THE-CLOCK,
COMBAT BB-ARMOUR-COSTS (ours is pure upside: G.pp = PLATE_START every bell), WORLD
BB-SHADE-IS-A-RESOURCE.
*** AND A NOTE FOR WHOEVER OPENS THE ENCOUNTER MESSAGE: BB-THE-FIGHT-KNOWS-THE-DAY,
BB-LOOT-LEAVES (day 10) and BB-KEYS-LAND (day 9) ARE THREE FINDINGS ON ONE MESSAGE.
Do all three. ***

COORDINATOR: 8/28 (q) -- *** DAY 14 OF THE BB
STUDY: THE DAY THE STUDY SAYS NO, AND THE ONLY DEMO-CRITICAL ROW IT HAS PRODUCED.
Forty-eight BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_14_THE_FIRST_FIVE_MINUTES_8_28_26.md

Thirteen days took things from the game he named. Day 14 asked what it gets WRONG,
and it is the exact thing our demo lives or dies on: THE FIRST FIVE MINUTES.

*** IT IS A BAD TEACHER AND ITS OWN PLAYERS SAY SO: "a rather steep learning
curve, and many players end up getting lost or stuck halfway through", and the
standard beginner advice is play on Beginner, do not play ironman, save often,
expect your men to die a lot. "The first 10 days are the hardest." THAT IS A
REASONABLE DESIGN FOR A DEEP STRATEGY GAME SOMEBODY DELIBERATELY BOUGHT. IT IS
FATAL FOR A LINK HANDED TO A FRIEND: median day-one retention runs ~22-26%, three
of four decide against you inside 24 hours with MOST OF THAT IN THE FIRST SESSION,
and STRATEGY IS THE WORST-HIT GENRE (~25%) "because their depth takes longer to
hook new players". That is us, precisely. SO THE FIRST HOUR DOES NOT TEACH BY
KILLING YOU -- and his own 8/25 ruling, FUN CARRIES THE TIE, already covers it. ***

THE GOOD NEWS IS REAL AND SHOULD BE SAID: the cold open is ALREADY designed as a
teacher rather than a tutorial box -- his 8/8 order, `hostiles: 2, /* tutorial tier
*/`, and the comment "IT TEACHES BY STRUCTURE, NOT BY A TUTORIAL BOX: the threat
walks toward you." And time to first play is 24.2 SECONDS on throttled 4G against
the practitioners' "get to playable inside 60 seconds" rule, so THE LOADING IS NOT
WHAT LOSES THE FRIEND.

*** AND THE ONE DEMO-CRITICAL FINDING IS A METHOD WE ALREADY OWN AND RAN EXACTLY
ONCE. *** From the walked surface, 8/25: "MEASURED with a cold hand that presses
the loudest control on screen and never reads: from a cold boot it went WATCH, GET
UP, then DROP IN / CITY / DROP IN / CITY ten times and stopped. PHONE OPENED 0.
JOB TAKEN 0. CLOCK 06:00 AT THE FIRST TAP AND 06:00 AT THE TWELFTH." A simulated
stranger pressed the biggest button twelve times and the clock never moved. It was
fixed properly (the phone ring now wears the same fill as the WATCH button the
player was already taught to press).
THE FIX IS NOT THE FINDING, THE TEST IS. It is not a gate, not repeatable, and has
never been run on the cold open, the first morning, the job offer, the first fight
or the reckoning. THE TEST IN ONE SENTENCE: A COLD HAND PRESSES THE LOUDEST THING
ON SCREEN AND NEVER READS -- if that does not advance the game, the screen is
broken however good the systems behind it are.

*** A WARNING THIS STUDY OWES ITSELF, FOR COMBAT ESPECIALLY: three rows it already
routed touch the first fight and none was written with a stranger in mind.
BB-NERVE-ON makes fights shorter, so keep it. BB-GUNS-CLOSE pushes bodies toward
you, which is probably good in a two-hostile cold open, but MEASURE IT THERE
rather than assuming. BB-THE-ROUT adds a decision after the fight, which in the
FIRST fight is one more thing to understand at the worst moment. NOTHING FROM THIS
STUDY LANDS IN THE COLD OPEN WITHOUT A COLD-HAND RUN. ***

Three rows: SHARED/RUN BB-COLD-HAND (ON the demo path, not behind it), RUN
BB-NOT-LOSE-TO-LEARN (a refusal, written down so nobody imports it), UI
BB-SIXTY-SECONDS (a guard so the next thing put in front of the game has to argue
against a number).

COORDINATOR: 8/28 (p) -- *** DAY 13 OF THE BB
STUDY: THE DESIGN ASKS FOR 70% OF ITS MOMENTS OUT OF 25% OF ITS CONTENT, AND
DENSITY CANNOT FIX "DEAD". Forty-five BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_13_THE_TIME_BETWEEN_FIGHTS_8_28_26.md

His loudest playtest line was "THE CITY SEEMS DEAD ASF AND I DONT LIKE THIS BEING
THE DEFAULT." Day 13 went at what fills the time between fights.

THE SHELF IS BETTER BUILT THAN EXPECTED, WHICH MAKES THE NUMBER WORSE. The walked
surface has a real roadside director: per-district tables, a repeat lockout of an
hour of WALKING (~700 cells), NO GLOBAL SPAWNS EVER, pulled from the walked step
"with the seconds that step cost, which is the same clock everything else in this
game spends", and it refuses to announce an animal that is not actually drawn on
the glass. Careful work.
*** AND THE ROSTER IS TWELVE, OF WHICH THREE ARE AMBIENT (coyote shadow, ghost
robotaxi, patrols collide), AGAINST `MIX = {ambient:0.70, interactive:0.20,
forced:0.10}`. *** A measured run came out 40/42/18 instead of 70/20/10, and the
lane's own comment says a district without a coyote "went silent for seven beats
in ten". It refused to invent a thirteenth encounter because canon is his, WHICH
WAS RIGHT -- and is a dead end if more canon is the only way out.

THE WAY OUT COSTS HIM NOTHING. BB did not fix a thin event bench by writing more
events; it gave events more to KEY OFF: "a lot of events will change depending on
what backgrounds or traits your Battle Brothers have... BEYOND JUST THEIR
DIFFERENT STATS." SO STOP COUNTING CONTENT AND COUNT COMBINATIONS. The twelve stay
twelve, multiplied by the FORMER TRADE of whoever is nearby (day 8), the CIRCUIT
OWNER of the block (day 6), the HOUR, and WHAT YOU ARE KNOWN FOR (day 1). A ghost
robotaxi rolling past a man who used to park them for a living is a different
moment. MECHANISM MINE, CONTENTS HIS, and a thirteenth encounter is his to name
any time with nothing blocked on it.

*** THE CHALLENGE, AND IT IS AIMED AT A LINE IN HIS OWN DISPATCH, SO READ IT
CAREFULLY: item 5 says the default population goes up and THAT RULING STANDS. But
density cannot be the ANSWER to "dead", because the PEAK-END RULE says people
evaluate an experience on the most intense moment and the FINAL moment and neglect
duration almost entirely -- ratings "correlate almost perfectly with the average of
the peak moment and the final moment, and correlate NEAR-ZERO with total
duration". DENSITY RAISES THE FLOOR AND MOVES THE PEAK BY NOTHING. A city feels
alive because things HAPPEN in it, not because people are standing in it. ***

AND THE SECOND HALF OF THAT IS FREE MONEY: THE END IS HALF THE MEMORY, and our day
already ends on the reckoning card -- which day 7 measured as a receipt (steps,
districts, buildings entered, the job, the pay). DAY 7 AND DAY 13 CONVERGE ON THE
SAME CARD, and it is the cheapest surface in the game.

Three rows: WORLD/PEOPLE BB-MORE-KEYS (depends on day 8's BB-WHAT-YOU-WERE, one
thread), WORDS BB-THE-SMALL-MOMENT, RUN/UI BB-THE-END (merge with BB-WHAT-YOU-OWE,
same card, same afternoon).

COORDINATOR: 8/28 (o) -- *** DAY 12 OF THE BB
STUDY: THE THING THAT ENDS FIGHTS EARLY IS SWITCHED OFF AND SOLD AS A PERK.
Forty-two BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_12_A_FIGHT_ENDS_WHEN_SOMEBODY_LEAVES_8_28_26.md

Eleven days asked what a fight is MADE OF. Nobody asked what makes one END -- and
that is his loudest stated requirement: "every time it's ONE FUCKING BATTLE, it's
not a 40 MINUTE LONG CHESS MATCH." If the only way a fight can finish is every
body on one side being on the floor, a fight is exactly as long as the enemy count,
forever.

*** OUR NERVE SYSTEM IS THE BEST-BUILT THING I HAVE FOUND IN TWELVE DAYS, AND IT
IS OFF. *** Once HALF the enemy are down, each standing man rolls every turn at
0.10 + 0.05 per body past half, elites at HALF that; not-the-last-man PANICS AND
RUNS, and the LAST man PUTS HIS HANDS UP -- his own ruling, in the code's words:
"nobody surrenders while his people are still shooting, he either holds or FLEES."
The break lands ON THE BEAT. And the fight ends "the instant nobody can fight,
nerve breaks and downings included", so a break really does end it early.
AND: `const FEAR_ON=false; /* [DIAL] until the perk exists, nothing switches this
on -- which is the ruling */`. THE PERK NOW EXISTS (THEY KNOW YOU, EYE branch,
level 2). So the mechanic that ends fights early is off by default and sold as an
upgrade. THE FIX IS A CONST. That is COMBAT BB-NERVE-ON.

TWO MORE, MEASURED: a man who breaks is a DESPAWN -- one tile a turn straight out
to distance 30 and gone, so no body, no loot, no XP. AND THE PLAYER CANNOT LEAVE:
the only abort is `BOHEMIA_ENCOUNTER_ABORT`, commented "the quest pulls you out".
(Positive control stated in the record: I found a RUN button and checked it first;
doRun arms a movement mode inside the arena, it does not leave.)

REAL AISLE, and it is harder than the game: in pre-modern battle the WINNERS rarely
suffered more than 5% fatalities while the LOSERS averaged 10-15%, AND MUCH OF THAT
WAS INFLICTED IN THE ROUT AND PURSUIT rather than the fighting. A battle is decided
by a decision to leave and the killing happens after it. WINNING IS CHEAP, LOSING
IS EXPENSIVE. So the real question in our fight is not "can I kill all eight", it
is "THEY ARE RUNNING -- DO I CHASE?" Chasing is where the material is (day 10:
loot is on bodies); not chasing is the cleanest input day 1's what-you-are-known-
to-do axis will ever get, and the man who lives is the one who tells people.

Three rows: COMBAT BB-NERVE-ON (smallest row in the study that touches his loudest
requirement), COMBAT BB-THE-ROUT, COMBAT/RUN BB-YOU-CAN-LEAVE.

COORDINATOR: 8/28 (n) -- *** DAY 11 OF THE BB
STUDY: THE WORLD DOES NOT GET STRONGER, IT GETS ORGANISED. Thirty-nine BB- rows
routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_11_HOW_A_LONG_GAME_GETS_WORSE_8_28_26.md

THE LAST BIG CAMPAIGN SYSTEM: ESCALATION. A hundred hours and three acts, and NO
DAMAGE BEFORE THE DIAL forbids turning anything up. That sounds like a dead end.
It is not.

*** BB'S LATE-GAME CRISIS WORKS BY CHANGING THE RELATIONSHIP GRAPH, NOT THE STAT
BLOCK. *** Orcs and goblins stop fighting each other and start appearing in mixed
units; the ancient dead, necromancers and wiedergangers, normally independent,
combine. NOBODY GOT STRONGER. The enemies who were spending their strength on each
other stopped. That is escalation at ZERO balance numbers, and WE ALREADY OWN THE
GRAPH: 14 factions, directional relations, war states including permanent-war, and
a wrapped writer that cannot break canon. **NO DAMAGE BEFORE THE DIAL IS NOT A
BLOCKER HERE, IT IS THE SPECIFICATION.**
A crisis there is also FORETOLD (announced around day 50-70, starts around 80-100)
with a two-phase buildup the player can read, and IT IS NOT OPTIONAL.

REAL AISLE, and it is a gift to "the most realistic economic crash simulator, but
fun": complex systems approaching a TIPPING POINT emit generic EARLY WARNING
SIGNALS, above all CRITICAL SLOWING DOWN -- recovery from small shocks takes longer
and longer as resilience drains, with rising variance and autocorrelation
alongside. A COLLAPSE IS ONLY A SURPRISE TO SOMEBODY WHO WAS NOT WATCHING RECOVERY
TIMES. So the act turn should announce itself by THE VALLEY BEING SLOWER TO COME
BACK -- a dark block that used to relight in a day taking three, a shortage that
used to clear not clearing -- built out of quantities WE ALREADY COMPUTE (relight
time, BohemiaEconomy.daysLeft, whether a holding still pays). THE OPPOSITE OF A
DIFFICULTY SLIDER: THE WORLD DOES NOT HIT HARDER, IT STOPS BOUNCING BACK.

*** NINTH INSTANCE, MEASURED: TEN QUESTS ARE LABELLED ACT 2 IN A GAME WITH NO
ACT. *** `act1` appears 931 times in the walked city AND EVERY ONE IS A TILE
MATERIAL TAG (the dossier law's act-1 material field); `act2` appears ZERO times.
The real act state (`act: 1, // 1..3 (the three dynasty generations)`) sits in
engine/bohemia_engine.js, behind BohemiaLoop, which the walked city does not load
-- the same wall as the faction world. And the quest language already speaks it:
`@ACT 1` in 17 canon quests, `@ACT 2` in 10, parsed into `Q.act` -- AND `Q.act` HAS
EXACTLY ONE MENTION IN THE FILE, THE LINE THAT SETS IT. Same shape as
advance_territory: the language says it, the parser stores it, nobody is on the
other end.

Four rows: SHARED/WORLD BB-THE-ACT-IS-A-STATE (rides with BB-LOOPLESS, unblocks
ten written quests), WORLD BB-COALITION, WORLD BB-SLOWER-EVERY-TIME, UI/RUN
BB-FORETOLD (the display half, or BB-SLOWER-EVERY-TIME is a simulation nobody can
see).

COORDINATOR: 8/28 (m) -- *** DAY 10 OF THE BB
STUDY: YOU LOOT THE DEAD AND YOU KEEP NOTHING. Thirty-five BB- rows routed.
Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_10_LOOT_IS_A_COUNTDOWN_8_28_26.md

Day 9 ruled growth cannot be levels. Day 10 is its other half: the genre's answer
is GEAR, and he ruled LOOT EXISTS himself on 8/25.

*** MEASURED, AND IT IS THE EIGHTH INSTANCE OF THIS STUDY'S SHAPE: LOOT IS BUILT
AND CANNOT LEAVE THE ROOM. *** On every death the fight drops rounds, XP worth a
quarter of the body, an item at LOOT_CHANCE 0.55 from an eight-item draft:true
table, a plate at PLATE_CHANCE 0.22, and a boss key -- all lying where he fell so
you have to walk to it, which is his own ruling ("you get experience and loot OFF
THEIR BODIES"). The code even caught its own first mistake in its own words:
"nobody walks into a firing line for half a pack of smokes", which is why the
plate exists. A REWARD HAS TO BE WORTH THE GROUND YOU CROSS FOR IT.
AND `BOHEMIA_COMBAT_END` CARRIES NONE OF IT: victory, result, reason, kills,
dead, spared, fled, alive, fates, playerHP, turns and three ids. NO LOOT, NO XP,
NO PLATES, NO KEYS. POSITIVE CONTROL: exactly TWO things persist out of the arena,
both by localStorage ('bohemia.tree', 'bohemia.keys'), so the pipe exists and loot
is not on it -- it goes into G.ledger.loot, gets a read line, and dies.
ALSO: armour is a CONSUMABLE, not a possession. `G.pp = PLATE_START` at every
bell. Nothing in this game is an object you own, maintain and can lose -- EXCEPT
ONE LINE, in the walked city's medical kit: `tweezers: { durable:true, note:'THE
DURABLE. Sterilised, never consumed. The one piece you keep.' }`.

THE FINDING: NOTHING IN THIS VALLEY IS MANUFACTURED. Every object was made before
the collapse and the stock only goes DOWN, so a thing you take is a thing somebody
else no longer has. **LOOT IS NOT A REWARD, IT IS A COUNTDOWN.** It cannot be
power (no damage dial, and day 9 refused vertical growth), so it has to be ACCESS
-- and THAT IS ALREADY SHIPPED WHILE WE KEEP CALLING IT MISSING: a boss key is an
object that opens a DOOR instead of adding a number.
BB'S BEST GEAR IDEA, which nobody copies: A WEAPON WEARS OUT ON ARMOUR, NOT ON
FLESH, and at zero durability it is permanently destroyed. So every exchange costs
BOTH sides material, and the question before a fight becomes "is this worth what
winning will cost me."
REAL AISLE: Cuba's Special Period, the documented case of an economy that lost its
supplier overnight -- INVENTAR Y RESOLVER, cars kept alive with parts from other
cars, state-printed repair manuals, street repair as an industry. THE REAL SKILL
IN A COLLAPSED ECONOMY IS NOT SCAVENGING, IT IS FIXING, so the fixer is worth more
than the thing -- already a boss in his ladder, THE SMITH.

Four rows: COMBAT/SHARED BB-LOOT-LEAVES (same pipe as day 9's BB-KEYS-LAND, do
both in one afternoon and two of this study's "built but goes nowhere" findings
disappear at once), COMBAT BB-LOOT-IS-ACCESS, WORLD BB-ONE-WAY, PEOPLE/QUESTS
BB-WHO-FIXES-IT.

COORDINATOR: 8/28 (l) -- *** DAY 9 OF THE BB
STUDY: GROWTH HAS TO GO SIDEWAYS, AND HIS OWN TWO REFERENCES ONLY AGREE THAT WAY.
Thirty-one BB- rows routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_9_WHAT_A_HUNDRED_HOURS_OF_GETTING_BETTER_IS_
8_28_26.md

*** THE FINDING TOUCHES A LOCKED PILLAR, SO EVERY LANE SHOULD KNOW IT. *** Two
things are locked at the top of CLAUDE.md and they are opposite philosophies of
progression: a PERSISTENT experience tree on the Cyberpunk / Elder Scrolls model
across ~100 HOURS (a POWER tree), and BATTLE BROTHERS, whose progression is ELEVEN
choices and a hard stop and whose whole feel is that a veteran is still killable.
A HUNDRED HOURS OF BONUSES AND A FIGHT WHERE A GOOD MAN STILL DIES CANNOT BOTH
SURVIVE IF GROWTH IS VERTICAL. That is arithmetic, and NO DAMAGE BEFORE THE DIAL
means we are not allowed to tune the numbers that would hold it together.
HIS OWN SENTENCE IN THE SAME PARAGRAPH RESOLVES IT: **60 MINI BOSSES THAT EACH
HAND YOU A NEW WAY TO INTERACT WITH BOHEMIA.** That is a HORIZONTAL tree. Sixty
new VERBS, not +8% sixty times, and a new option does not make a bullet hurt less.
53 are already written out in his ladder and the game already parses that file.

AND THE REAL AISLE AGREES: chess masters have ORDINARY working memory. Their edge
is thousands of learned patterns, and IT VANISHES ON RANDOM BOARDS. Expertise is
not being more, IT IS SEEING MORE. TEST FOR ANY RUNG: something new to see or do
is mastery; a number going up is a stat.

MEASURED (and I nearly filed a false negative before decoding the fight again):
A PERK TREE IS SHIPPED. TREE={xp,spent}, XP_PER_LEVEL=120, treeLevel(), a spend UI
reading XP / LEVEL / POINTS, saved to localStorage['bohemia.tree'], applied at the
top of every fight, names draft:true. NINE perks, THREE branches, three rungs each.
The 7/1 perks-and-abilities law said "NOTHING here is built" over that shipped
tree; CORRECTED AT THE SOURCE this turn with a dated note.
AND THE TREE'S OWN COMMENT IS THE DIAGNOSIS: "seven of these nine perks need no new
mechanic at all. THEY MOVE A NUMBER A SHIPPED SYSTEM ALREADY READS." Seven stats,
two verbs. It is drifting vertical.

SEVENTH INSTANCE OF THIS STUDY'S SHAPE, and the smallest yet: THE BOSS VERBS ARE
BROADCAST INTO AN EMPTY ROOM. The keys are published twice on purpose, with a
comment naming CITY, RUN and QUESTS as the readers, and `bohemiaKeys` has ZERO
hits in the walked city and ZERO in the alpha shell. Positive control: the alpha
handles TWENTY message types, so the listener works; the keys message carries NO
`type` field at all, so no type-based handler could pick it up. Until SHARED
BB-KEYS-LAND lands, A BOSS HANDS YOU A VERB is only true inside the arena.

A MEASUREMENT CAUTION, recorded because it nearly caught me: `myLvl()` in the
fight is a FLOOR, not a character level. It sits beside `deckSlabAt` and
`underDeckMe`. Do not read it as progression.

Three rows: COMBAT BB-VERB-TREE, COMBAT/SHARED BB-ONE-LADDER, SHARED BB-KEYS-LAND.

COORDINATOR: 8/28 (k) -- *** DAY 8 OF THE BB
STUDY: NOBODY IN THIS VALLEY USED TO BE ANYBODY. Twenty-eight BB- rows routed.
Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_8_WHAT_YOU_USED_TO_BE_8_28_26.md

THE LAST BIG BB SYSTEM NOBODY HAD OPENED IS THE ROSTER, and in that game THE
BACKGROUND *IS* THE CHARACTER: a former job that carries his skills, his daily
wage, what he eats, what traits he can grow, and "opens up specific events and
dialog choices". The story engine is in the VARIANCE -- cheap backgrounds have
wide ranges, so a lucky labourer rivals a professional, which is where "the beggar
who became a legend" comes from.

*** MEASURED HERE, AND IT IS THE STARKEST NUMBER IN EIGHT DAYS: THE ENTIRE
OCCUPATIONAL VOCABULARY OF LAS VEGAS IS FOUR WORDS. *** `ROLE_WORDS = { worker,
scav, keeper, watch }`, verified on the walked surface, AND NOBODY HAS A PAST AT
ALL -- no former trade, no "used to be", no history field anywhere. POSITIVE
CONTROL, stated because it nearly fooled me: `background` appears 115 times in the
walked city and EVERY ONE IS CSS; `job` appears 167 times and every one is the
DAY'S JOB (jobSite, jobCell), a place to work, never a trade somebody has.

THE FINDING: the obvious copy is a stat package with a name. We cannot do that
anyway (NO DAMAGE BEFORE THE DIAL) and the research says we should not want to --
55% of American workers and 70% of college graduates take their self-identity from
their job, losing the work role is a STATUS PASSAGE, and people who lose a job
BUILD AN ALTERNATIVE WORK IDENTITY rather than call themselves unemployed. **A
BACKGROUND IS NOT WHAT SOMEBODY CAN DO, IT IS WHAT THEY STILL THINK THEY ARE.**
Ten years on, the valley is full of people introducing themselves by a job that has
not existed for a decade. It is a WORD on a person, not a number, so it ships under
every law we have.

AND IT IS BOHEMIA'S INSTEAD OF GENERIC BECAUSE THE REAL CITY IS: leisure and
hospitality was ~29% of ALL Las Vegas metro nonfarm employment, 370,000+ jobs in
Clark County, and the top employer list is casino properties one after another.
*** THE FRONT OF HOUSE IS USELESS AND THE BACK OF HOUSE RUNS THE VALLEY. *** A
dealer's trade died with the money, but a Strip casino is a SMALL CITY: industrial
laundry, kitchens feeding tens of thousands, boiler and chiller techs, high-voltage
electricians, water and pool plant, refrigeration, docks, and the people who know
where the deep dry stores are -- which engine/bohemia_economy.js ALREADY calls "the
reason downtown matters". WE BUILT THE BUILDING AND NEVER ASKED WHO WORKED IN IT.

AND IT PLUGS A HOLE THE PEOPLE LANE ALREADY DOCUMENTED AND COULD NOT FILL: across
every canon quest, faction=X is 53 uses and "THE WORLD CAN ANSWER THIS", while ~60
one-off predicates (keeps_the_tunnel, reads_the_sky, found_the_stairwell) get 1 use
each and "NOTHING IN THE SIM COMPUTES" them. The cause is that a person has exactly
two dimensions. A FORMER TRADE IS THE MISSING ONE. Not all sixty, and nothing is
relaxed to make a hit.

Four rows: PEOPLE BB-WHAT-YOU-WERE (the one that unblocks the others), WORDS
BB-STILL-SAYS-IT, QUESTS BB-PREDICATE-ANSWER, WORLD BB-BACK-OF-HOUSE.

COORDINATOR: 8/28 (j) -- *** DAY 7 OF THE BB
STUDY: THE MOTOR IS PAYROLL, NOT SURVIVAL, AND ITS PUNISHMENT IS LONELINESS. We
already built the right mechanic and hid it. Twenty-four BB- rows routed. Nothing
to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_7_WHY_YOU_LEAVE_THE_HOUSE_8_28_26.md

THE QUESTION NOBODY HAD ASKED: days 1, 2 and 6 covered what work is offered, what
it costs and who holds the ground. NOBODY ASKED WHY THE PLAYER GETS UP TOMORROW.

BB'S MOTOR IS NOT COMBAT, IT IS PAYROLL: wages daily at noon rising with each
level, 2 food per man per day, tools and medicine burning in the background. AND
THE PUNISHMENT IS NOT DAMAGE, IT IS MOOD AND THEN DESERTION. You do not die of
poverty in that game, YOU END UP ALONE. One number, scaling with what you own,
punished socially.

*** THE CHALLENGE, AND IT SHOULD CHANGE WHAT ANY LANE PUTS IN THE STAKES TABLE:
our day loop's own header says the table is "empty on purpose" and names the
candidates as "hunger, exhaustion, rent, a debt clock". Survival meters are the
genre's most reliably hated mechanic and the complaint is BUSYWORK, not
difficulty, while the most punishing campaign anybody has shipped HAS NO HUNGER
METER ON THE PLAYER AT ALL. SO THE STAKES TABLE GETS OBLIGATIONS TO PEOPLE, NOT
METERS. The desert is the setting, not the scoreboard. ***

*** AND THE SIXTH INSTANCE OF THIS STUDY'S SHAPE, except this one is not wiring,
it is ONE LINE OF TEXT ON A CARD HE ALREADY READS. *** There is exactly ONE daily
cost in the walked game and it is not food or rent: `ctNeglectFor` charges you
standing for not showing up for people you gave your word to ("nothing said,
nothing owed"). MEASURED: it has two mentions in the file, its definition and its
one call; the call sits in the SLEEP-tap callback inside a try/catch AND ITS
RETURN VALUE IS THROWN AWAY. It hands back {faction, lost, now} and nobody reads
it. Worse, showReckoning builds and shows the card FIRST and the charge happens ON
THE TAP THAT DISMISSES IT. The card lists steps, districts, buildings entered, the
job and the pay, and NEVER SAYS WHO YOU LET DOWN. That is RUN BB-WHAT-YOU-OWE and
it is the best effort-to-effect row in seven days of study.

THE UNLOCK EVERY LANE SHOULD KNOW: A SOCIAL BURN IS NOT DAMAGE. Standing is not
health, so the whole motor ships WITHOUT PAOLO RULING ONE NUMBER, which is what
has blocked every stakes conversation since NO DAMAGE BEFORE THE DIAL. Hunger
needs a rate. "Three people are waiting on you" needs nothing but the truth.

ALSO MEASURED: THE VALLEY BURNS AND THE PLAYER DOES NOT. mktAdvanceDay runs every
nightfall (stock produced, EATEN, shortfall logged) and BohemiaEconomy.daysLeft
can already say how many days of a good are left. The market has a metabolism and
the player is a tourist in it. That is WORLD BB-DAYS-LEFT.
AND DAY 7 CLOSES DAY 6: an armed group that stops being paid does not disappear,
IT GOES ROVING (the historical free companies "regularly made a living by plunder
when they were not employed"). So engine/bohemia_mandate.js's income rule (a
district pays only while it is yours AND lit AND patrolled) is ALSO the aggression
rule, and taking a faction's lights is not a free win. NOTE FOR WORLD BB-TURF:
income(holdings) is ALREADY the landlord rule and already keyed to
LIGHT=TERRITORY. Do not write a second one.

COORDINATOR: 8/28 (i) -- *** DAY 6 OF THE BB
STUDY: NOBODY IN THIS VALLEY HOLDS ANY GROUND, AND THE COORDINATOR IS THE ONE WHO
STRANDED IT. Twenty BB- rows now routed. Nothing to judge. ***

READ: records/BOHEMIA_BB_STUDY_DAY_6_WHO_HOLDS_THE_GROUND_8_28_26.md

WHY THERE IS A DAY 6: he named THREE pillars when he started this ("the world,
the caravan system, THE CITY-STATE SYSTEM... different parts of Vegas as
different faction holdings"). Day 1 did the work, day 2 did the money, NOBODY DID
THE GROUND, and the five-day plan closed anyway. He sent the trigger again. A
PLAN IS NOT A LAW.

*** WHAT IT FOUND, AND IT IS THE FIFTH TIME THIS STUDY HAS FOUND THE SAME SHAPE:
THE FACTION WORLD HAS EXISTED SINCE 6/30 AND NONE OF IT RUNS WHERE HE WALKS. ***
An owner map (districtId -> factionId), standings on a named ladder with
spillover, playerMandate for the Mayor Arc, and a cheap deterministic
claim/defend/expand TERRITORY AI. It is created in BohemiaLoop, and THE ALPHA'S
OWN COMMENT SAYS "walked city loads BohemiaClout and NOT BohemiaLoop, so LOOP is
null there." Measured: factionAdjacency city=0 / legacy=7, factionTurn city=0 /
legacy=4, FactionWorld + shiftStanding + ownerOf all ZERO on the walked surface.
There is a PACING LAW (Paolo 7/24) saying the territory AI fires on a story beat
and never on a tick, its lever is the quest verb `@DO advance_territory`, TEN OF
OUR 27 CANON QUESTS USE IT, and on the walked surface the flag is set and dropped
on the floor. ON THE SURFACE HE WALKS, A FACTION IS A LABEL PEOPLE WEAR, NOT
GROUND ANYBODY HOLDS.

*** AND I STRANDED IT. *** The 8/14 ONE WALKED SURFACE decision was the
coordinator's; its migration list named what would move ("demo-critical wiring
migrates") and assumed the rest would keep. The faction world and the QUEST
CASTING BRIDGE stayed on the ship we abandoned -- and that bridge is playtest
dispatch item 2's mechanical cause, six weeks old when he complained.
NEW STANDING RULE, FOR EVERY LANE: **A MIGRATION LIST IS A DELETION LIST FOR
EVERYTHING NOT ON IT.** Naming what moves is not a plan; naming what does NOT
move, and saying out loud that it is now dark, is.

*** THE GOOD NEWS, AND IT IS THE BEST FINDING IN THE STUDY: THE VALLEY ALREADY
HAS AN OWNERSHIP MAP AND IT IS MADE OF ELECTRICITY. *** Live code on the walked
surface: "A SEAM IS TWO OWNERS TOUCHING. LIGHT=TERRITORY: a live circuit's owner
is who holds that ground... NOT A METAPHOR, THE GRID'S OWN DATA." Circuits carry
owners and the game already computes BORDERS. The gap is that the owner is a
CATEGORY with no name ({settlement:0.55, faction:0.2, network:0.15,
solar_lone:0.1}). SO TERRITORY IS A NAMING JOB, NOT A PORTING JOB -- give the
owner a real id from his own faction graph and the valley has holdings, borders
and seams, visible from the street at night because his 12%-lit law already made
light the tell. That is WORLD BB-TURF and it is the third row worth taking early.

CORRECTION I MADE TO MY OWN DRAFT BEFORE SHIPPING, so nobody repeats it: quests
DO have addresses on the walked surface now (castAddresses, deterministic, a miss
returns NULL). That work is done and good. The accurate complaint is narrower --
it casts against PEOPLE WHO RUN WITH AN OUTFIT, not GROUND AN OUTFIT HOLDS.

CHECKED AND CLEAN, recorded so nobody re-raises it: THE SAVE IS FINE. The
iPhone-proof save lives in the PARENT shell (root.BohemiaSave, CITYSAVE =
BohemiaSave.make) and the frame reports state up via citySnapshot. UNCHECKED and
do not guess: bohemia_crypt, bohemia_rooms, bohemia_overmap_bridge.

COORDINATOR: 8/28 (h) -- *** THE BATTLE
BROTHERS STUDY IS FINISHED AND ROUTED. All five days written; THIRTEEN ROWS went
out to seven lanes, tagged BB-. Nothing to judge. ***

READ BEFORE POPPING A BB- ROW: records/BOHEMIA_BB_STUDY_DAY_5_THE_SYNTHESIS_AND_
THE_ROUTING_8_28_26.md -- ten takes, ten refusals, four collisions between his own
laws, and the running order.

*** THE FINDING THAT MATTERS TO EVERY LANE, AND NO LANE COULD HAVE SEEN IT ALONE:
FOUR DAYS MEASURED FOUR DIFFERENT CORNERS AND FOUND THE SAME FAILURE FOUR TIMES.
The faction standing graph exists and THE PLAYER IS NOT A NODE. The scarcity price
model exists and NO PRICE TAKES A PLACE. The whole anti-turtle kit exists (the 50%
shout, the priority target at the back, backline AI that flees your line, the day
clock) and WAS NEVER JOINED INTO ONE PRESSURE. And breaking cover to get a body
off the floor exists AND BELONGS TO THE ENEMY MEDIC while your companion lies
there for 99 turns. WE BUILT THE ENGINE AND AIMED IT AT THE SCENERY, four times,
unnoticed, because each lane could only see its own corner. That is the invisible
hats in the systems layer. THE COST OF THIS STUDY IS MOSTLY WIRING. ***

WHAT IT SETTLED (do not re-derive): RENOWN GATES THE OFFER, NOT THE DIFFICULTY --
so the whole reputation system builds with ZERO balance numbers and NO DAMAGE
BEFORE THE DIAL is untouched. FRICTION IS PROTECTED: no fast, safe, universal
route, ever. HIS "GO, SLOW DOWN" ORDER SET IS THE STRONGER DESIGN, NOT THE EASIER
ONE, and you never take the wheel, you change the intent. GUNS ARE BAD IN CLOSE,
FOREVER; cover-and-hold is REFUSED. PERMADEATH DOES NOT CREATE ATTACHMENT, IT
CASHES IT IN, so his ruling is safe and the bond gets built from interdependence,
responsiveness, marks that persist, and being missed.

THE RUNNING ORDER (coordinator's call, and it is deliberately small): THE DEMO
PATH STILL KEEPS THE FLEET. Only TWO rows jump the queue -- COMBAT BB-GUNS-CLOSE
(a constraint that costs nothing today and makes every weapon written before it
into rework) and COMBAT BB-PICKUP (smallest row in the study, machinery already
written on the enemy's side, best feeling per line we found in five days).
EVERYTHING ELSE QUEUES BEHIND THE DEMO. AND DO NOT START BB-ORDERS BEFORE THE DEMO
SHIPS: it is the biggest build in the study and it touches the fight, the enemies
and the factions at once.

COLLISIONS FLAGGED, DIALS ARE HIS: (1) THE REWIND CAN UNDO A SCAR -- ~200 moves of
take-back versus a mark meant to be permanent; three shapes exist, none chosen.
(2) "One system drives everybody" versus the 8/31 companion's FIXED LADDER -- these
reconcile and it is written down once in §5.2: her ladder IS her default intent,
and an intent SWAPS WHICH LADDER SHE RUNS. No menu. The control surface does not
grow.

STILL TRUE FROM DAY 4, AND IT IS A MEASUREMENT NOTE FOR ANY AUDIT: A PLAIN SEARCH
OF THE ALPHA CANNOT SEE THE FIGHT (base64 in COMBAT_B64, decoded by
ensureCombatFrame). Decode first, then measure.

COORDINATOR: 8/28 (g) -- *** THE BATTLE
BROTHERS STUDY, DAYS 1-4 ARE DONE. Day 5 (synthesis + routing) is the only one
left, and NOTHING ROUTES AS WORK UNTIL IT LANDS -- his order. Nothing to judge. ***

Plan + standing rules: records/BOHEMIA_THE_BATTLE_BROTHERS_STUDY_8_28_26.md.
He drives it with the two words "bb study, next day". THE STUDY IS THE
COORDINATOR'S OWN WORK, not a lane's.
- DAY 1 CONTRACT ECONOMY: renown gates the OFFER, not the difficulty.
- DAY 2 THE MAP AS AN ECONOMY: we have prices without geography.
- DAY 3 ORDERS + GUNS: his "go, slow down" order set is mission command, and it
  is the STRONGER design at speed, not the dumbed-down one; cover would make
  fights LONGER (turtling), so guns must be bad up close.
- DAY 4 ATTACHMENT WITHOUT PERMADEATH: permadeath does not CREATE attachment, it
  CASHES IT IN (the measured effect runs through grief and is stronger for
  already-attached players). His no-permadeath ruling is safe; the bill is
  unpaid.

*** TWO THINGS FROM DAY 4 THAT OTHER LANES SHOULD KNOW NOW, AS FACTS, NOT AS
WORK ORDERS (day 5 routes): ***
1. **COMBAT: THE ATTACHMENT MECHANIC IS ALREADY BUILT ON THE WRONG SIDE.** Their
   medic breaks cover for a downed man ("A BODY ON THE FLOOR OUTRANKS HIS OWN
   SKIN"), gets him back up, and TALKS A BROKEN MAN ROUND. Your companion has
   `ALLY_DOWN_TURNS=99` and the code says picking her up is not built. She is
   also rebuilt at full health at every bell, cannot lose her nerve, does not
   ride the save, and says exactly FOUR lines -- CLEAR / GOT THE BLADE / ON THE
   SPOTTER / FIRING -- none of which are about you, her, or the world.
2. **A PLAIN SEARCH OF THE ALPHA CANNOT SEE THE FIGHT.** `gunsOnTile`,
   `ENC_SIZES`, `ALLY_NAME`, `BohemiaArena` all read ZERO in both slices. The
   combat demo is base64 in `COMBAT_B64`, decoded into an iframe by
   `ensureCombatFrame()` (1,343,843 chars decoded). DECODE BEFORE YOU MEASURE.
   This nearly produced a false finding that the 8/31 companion was never
   shipped. She is shipped.
ALSO FLAGGED, AND IT IS A REAL COLLISION BETWEEN TWO OF HIS OWN LAWS: **THE
REWIND CAN UNDO A SCAR.** ~200 moves of take-back (8/15) versus a persistent
injury as the replacement for permadeath. Three shapes exist, none is chosen,
it is a day-5 routing item and the dial is his.

COORDINATOR: 8/28 (c) -- *** THE DYNASTY
LIVES. He answered the sweep-23 question in one line and it is law. Nothing to
judge. ***

*** EVERY LANE READ THIS. Paolo 8/28: "yeah three generations bro cmon." ***
Law: laws/BOHEMIA_ADDENDUM_THE_DYNASTY_LIVES_8_28_26.md. CLAUDE.md's top block
updated from [PENDING] to his ruling. The 8/26 law is CORRECTED AT THE SOURCE so
the bad phrase cannot be re-copied out of it.
NOTHING IS ARCHIVED. All 52 live dynasty law files stand, 162 mentions, none
stale. Three generations, ~100 years, Gen 1 Animal, Gen 2 Human, Gen 3 Angel, THE
PLAYER LIVES ALL THREE, each inheriting everything the last built. The Act 3
ending is still the gen-3 Angel heir going ONE-WAY.

THE RECONCILIATION, WRITTEN ONCE SO NOBODY RE-DERIVES IT:
"THERE ARE NO RUNS" AND "THREE GENERATIONS" WERE NEVER IN CONFLICT. A RUN RESETS
YOU TO NOTHING. A HANDOFF INHERITS EVERYTHING -- compound, faction standings,
territory, trade routes, the family tree, and the unhealed wounds. The 7/1
architecture is a deterministic FOLD, not a wipe. It is the OPPOSITE of a reset,
which is exactly why his no-runs ruling never touched it.
AND THE TWO HUNDREDS ARE DIFFERENT AXES: his ~100 HOURS TO COMPLETE is how long a
person plays; the 7/1 law's ~100 YEARS is how much time passes in the fiction. A
hundred hours of play spanning a hundred years of world.
THE PERSISTENT PERK TREE AND THE 60 MINI BOSSES SURVIVE UNCHANGED, and THE FOLD IS
WHERE THEY CROSS -- the tree is PERSISTENT by his own word, so it persists across
the handoff like everything else. How much an heir keeps, and whether a boss's verb
is a family inheritance or a personal one, are a NUMBER and a DESIGN CALL and both
are HIS. Ships inherited-in-full until he rules, because that is what "each
generation inherits everything the previous one built" already says.

WHAT SWEEP 23 FOUND, KEPT BECAUSE THE MECHANICAL HALF STANDS REGARDLESS:
the summary of his 8/26 ruling added two words he never said, "one character."
Measured: zero hits for "character" in his quoted words, one in the summary, one
in CLAUDE.md's first paragraph -- the first thing every session reads. Read
literally it deleted Gen 2, Gen 3 and the ending of the game. Greenberg's BMJ 2009
citation-network study names the exact mechanism: authority manufactured by "forms
of INVENTION such as the CONVERSION OF HYPOTHESIS INTO FACT THROUGH CITATION
ALONE." Nobody lied; the claim got promoted by being repeated somewhere more
authoritative than it started. Ten years there, two days here.
*** THE STANDING RULE: A SUMMARY NEVER OUTRANKS THE THING IT SUMMARISES, AND A
SUMMARY THAT ADDS A FACT ITS SOURCE DOES NOT CONTAIN IS A BUG, NOT A PARAPHRASE.
The truth hierarchy ranks DOCUMENTS, not FIDELITY, and had no rule for this. ***

WHERE THIS LANE IS
  Read-only across every lane. Records his rulings as law the same turn, audits
  drift, guards the demo path, routes work. Never writes code.
  DEMO PATH GREEN, MEASURED THIS TURN: the_whole_demo_gate 23/23.

IN FLIGHT
  Nothing half-built.

BLOCKED ON
  Nothing for me. Open and unclaimed:
    SHARED FIDELITY-1  the summary gate (would have caught this in one run)
    SHARED -14  cut the demo build; -13 pin the ref for the round
    RUN P0-DOOR / P0-MORNING / WIDE-2 ; UI WIDE-1
    WORLD WASH-FILL / UNDER-1 (one tunnel) / STREETS-LEGO's 44 declared breaks
    COMBAT BESTIARY-VOLUME / DANGER-TIERS
  DEMO ORDER UNCHANGED: BUILD -> DOOR -> ENDING (answered: the overlook, changed)
  -> INSTRUMENT (0f is BUILT) -> INVITE.

WHAT I WOULD DO NEXT
  Sweep 24. Standing watch: nobody hands anybody the workshop link, and nobody
  re-derives the dynasty question -- it is answered and it is law.

PROOF
  laws/BOHEMIA_ADDENDUM_THE_DYNASTY_LIVES_8_28_26.md  (his ruling)
  records/BOHEMIA_A_SUMMARY_DELETED_THE_ENDING_8_28_26.md  (sweep 23)
  records/BOHEMIA_THE_WASH_IS_A_DOOR_NOBODY_BUILT_8_28_26.md  (sweep 22)
  records/BOHEMIA_THE_QUESTION_QUEUE_8_25_26.md  (1 and 1b closed; 2 and 3 parked
    and neither blocking)

