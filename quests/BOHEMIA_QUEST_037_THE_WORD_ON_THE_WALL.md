# BOHEMIA — QUEST 037: "THE WORD ON THE WALL"
Full production build. Built to the dialogue/scene spec; template = 001-036. Tier-3
PROPAGANDA / information-war (tradition XXXI Papers-Please + XXX Pentiment doubt + the
recorded-vs-unrecorded ledger + the Network divide-and-buy pattern). Name catalog-adjacent.
A quest about who controls the STORY of the district — someone's papering the walls with
messages that turn neighbors against each other, and the dynasty decides what truth (or
comfort) the district gets to read.

Design soul: whoever writes the walls writes the future. Anonymous posters are inflaming a
district — blaming the poor, the Homeless, an outside faction — and it's working. The dynasty
can find the source, counter it, or exploit it. The quest teaches how cheap and powerful a
LIE on a wall is, and asks whether you fight propaganda with truth, with better propaganda, or
by removing the desperation it feeds on.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_word_on_the_wall
- tier: 3 (marked-leaning; a district tension the dynasty is asked to defuse)
- fold: how the information-war was handled (truth / counter-propaganda / remove-the-root /
  exploit) shapes district cohesion and the dynasty's relationship to honest speech.
- entry_conditions: a district is turning ugly — posters and chalked slogans scapegoating the
  Homeless (or the poor blocks) for shortages; a worried block-rep (HOLLIN) asks the dynasty
  to cool it before it turns violent.
- faction_wires: HOMELESS (the scapegoat), the resentful working blocks (the audience), REDS/
  NETWORK (a [READ] thread: the posters are Network-seeded to fracture the district — Q002/Q027/
  Q032 divide-and-buy pattern), CHURCH/VOLUNTEERS (calming voices).
- music_pool: TENSION; a creeping unease motif; the cyan-hum if the Network source is found;
  resolve varies by route.
- ledger_writes: recorded[wall_outcome_*]; UNRECORDED[what_you_wrote_on_the_district];
  district-cohesion + a truth/propaganda rep flag.
- amalgamation_thread: MEDIUM — the propaganda is Network-seeded desperation-farming (fracture
  the district, then buy it — ties Q002/Q027/Q032); exposing it advances the pattern-recognition
  and foils a Network play.

===============================================================================
## 2. CAST
===============================================================================
- HOLLIN (id: hollin) — a working-block rep watching his neighbors curdle into a mob; wants the
  tension gone but is himself half-tempted by the scapegoating (the propaganda WORKS on the
  decent too). default_emotion: worried_conflicted. faction: TRADES.
- THE POSTER / SEDA (id: seda) — the person physically putting up the posters; a broke, angry
  local PAID by a broker to paper the walls, not the mastermind — a symptom. default_emotion:
  defensive_desperate. faction: none (hired).
- BROKER (Network, id: broker) — the VANCE-archetype funding the campaign to fracture the
  district; never fully seen (the hand). default_emotion: pleasant_cool.
- A HOMELESS ELDER / NARO (id: naro) — a scapegoated Homeless elder, dignified, who's seen this
  pattern before the crash (blame the visible poor for invisible failures). default_emotion:
  weary_wise. faction: HOMELESS.
- THE PLAYER — [READ] (trace the source), [BARTER], leadership; the district's story is the axis.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
INVESTIGATION (read the posters, find who posts them, trace who PAYS) -> a CHOICE about the
district's story: TELL THE TRUTH (expose the Network seed — hard, honest), COUNTER-PROPAGANDA
(fight lies with a better story — effective, ethically grey), REMOVE THE ROOT (address the
shortage the lies exploit — slow, real), or EXPLOIT IT (ride the scapegoating for the dynasty's
gain — the dark Become route). Papers-Please/Pentiment doubt throughout.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: hollin  emotion: worried_conflicted  gesture: gesture_at_a_poster  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "The walls are talking and the whole block's listening. 'The camps eat your ration.'
         'The Homeless brought the sickness.' It's— look, I KNOW it's ugly, but... shortages ARE
         up, and people want a face to blame, and the posters give 'em one. Somebody's gonna get
         dragged out of a tent and beaten soon. Cool it down. Before we do something we can't take
         back."
  -> goto invest_hub
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Read the posters closely — style, message, intent.)" -> clue_posters [once]
   - "(Find who's putting them up.)"                          -> seda_01      [once]
   - "(Talk to Naro, the scapegoated elder.)"                 -> naro_01      [once]
   - "(Trace who's PAYING for this.)"                          -> clue_money   [once]
   - "(Decide the district's story.)"                          -> choice_gate [show after 2]
node clue_posters
  speaker: PLR (internal)  camera: closeup_on_posters  music:{pool:TENSION,cue:unease}
  line: "(The posters are TOO good — consistent, professionally divisive, hitting every fear at
         once: ration, sickness, safety. This isn't one angry local with a chalk stub. It's a
         CAMPAIGN. Somebody's engineering this hate on purpose, and paying for reach.)"
  effect: knowledge[the_propaganda_is_engineered]  -> goto invest_hub
node seda_01
  speaker: seda  emotion: defensive_desperate  gesture: hide_a_paste_bucket  camera: two_shot
  line: "So I put up posters, so what? A man in a nice coat pays me two days' ration a night to
         paste 'em and keep my mouth shut. I got kids. You want me to turn down FOOD because the
         words are mean? Find me a better job and I'll paste YOUR words instead. That's all this
         is to me. Wages."
  effect: knowledge[seda_is_paid_not_believer] (the poster is a symptom; the money is upstream)
  -> goto invest_hub
node naro_01
  speaker: naro  emotion: weary_wise  gesture: steady_gaze  camera: closeup
  line: "I've read these walls before, friend. Different city, before the crash — 'the migrants
         take your jobs,' 'the poor drain your taxes.' Always the visible poor blamed for the
         invisible theft happening up top. They point at my tent so nobody looks at the men who
         ate the whole economy. Burn the posters if you like. But the HAND that paid for them
         writes new ones by morning."
  effect: knowledge[the_pattern_is_old_blame_the_visible_poor] (the thesis — ties Q028's debt-
    horror: the discarded blamed for the discarding)  -> goto invest_hub
node clue_money
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:cyan_hum_in}
  line: "(Follow Seda's 'nice coat': the ration paying for the posters traces to a Network broker.
         Same play as always — fracture a district with fear, let it eat itself, buy the wreckage
         cheap. The hate on the walls isn't the district's. It's IMPORTED, and it's a weapon.)"
  effect: knowledge[the_network_seeded_the_hate] (unlocks TRUTH route; ties Q002/Q027/Q032)  -> goto invest_hub

--- THE CHOICE ---
node choice_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Tell the truth — expose the Network seed to the district.)" [require knowledge.the_network_seeded_the_hate] -> route_truth
   - "(Counter-propaganda — flood the walls with a better story.)" -> route_counter
   - "(Remove the root — fix the shortage the lies feed on.)"      -> route_root
   - "(Exploit it — ride the scapegoating for the dynasty's gain.)" -> route_exploit
node route_truth
  speaker: hollin  emotion: shamed_then_resolved  camera: two_shot  music:{pool:TENSION,cue:resolve}
  line: "...An OUTSIDER paid for this. To make us hate Naro's people so some broker could buy our
         block for scrap while we were busy with pitchforks. And I almost— God, I almost helped him.
         ...Put THAT on the walls. Let's paper over the lie with who really told it."
  effect: the Network seed is exposed publicly; the district's anger REDIRECTS from the Homeless to
    the manipulator (the Network play foiled); district-cohesion up; recorded[told_the_truth];
    UNRECORDED[named_the_hidden_hand]=true; the honest, hard win (requires the money-trail work). -> END
node route_counter
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:sly}
  line: "(You don't expose the source — you OUT-WRITE it. New posters: the camps sharing rations,
         a Homeless medic who saved a working-block kid, the REAL numbers on the shortage. Truer than
         the lies, but still PROPAGANDA — you're steering the story, not just telling it. It works.
         The mood turns. And you've learned how easy the walls are to write.)"
  effect: the scapegoating cools (a better story wins); district-cohesion up BUT the dynasty now
    KNOWS it can manufacture consent (a power it may reuse — ethically grey); recorded[counter_
    propaganda]; UNRECORDED[steered_the_story]=true; the Network source persists (unexposed — a
    lingering thread). Effective, and a little corrupting. -> END
node route_root
  speaker: naro  emotion: surprised_respect  camera: two_shot
  line: "...You're not fighting the words at all. You're killing the HUNGER they feed on. Fix the
         ration shortage and 'the camps eat your food' stops landing, because bellies are full and
         nobody needs a villain. ...Slower than a poster. Realer than one. The old fixes always are."
  effect: the dynasty addresses the actual shortage (a resource/logistics effort — ties Q006/Q015/
    Q036); with the desperation gone, the propaganda loses its grip (the lies need hunger to work);
    district-cohesion up durably; recorded[removed_the_root]; UNRECORDED[fed_them_instead]=true; the
    slow, deep, best-durability win (addresses the desperation the Network farms — Q029 link). -> END
node route_exploit
  speaker: broker (Network)  emotion: pleasant_cool  camera: closeup  micro_expression: approving
  line: "You SEE the machine and instead of breaking it you want a lever. Smart. Ride the hate — let
         the block fear the camps, and they'll beg a strong dynasty to 'protect' them. Fear is the
         cheapest loyalty there is. We could work together, you and I."
  effect: the dynasty rides the scapegoating to consolidate power (the frightened district rallies to
    the "protector"); real power gained + a Network alliance-of-convenience; the Homeless suffer
    (scapegoated, maybe purged); recorded[exploited_the_hate]; UNRECORDED[rode_the_lie]=true;
    NETWORK-disposition -> biddable/aligned; the coldest Become route (fear as loyalty). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- TRUTH: the Network play foiled, the district united against the real manipulator; an heir inherits
  a district that RECOGNIZES imported hate (harder to fracture next time); an honest rep.
- COUNTER: the mood turned by a better story; the dynasty holds a dangerous new skill (manufacturing
  consent) an heir may inherit and misuse; the source lingers.
- ROOT: the desperation fixed, the lies starved of fuel; the deepest, most durable cohesion; ties the
  economy quests (feed people and the hate dies) — the anti-Network strategy (kill the desperation it
  farms).
- EXPLOIT: power via fear + a Network alliance; the Homeless scapegoated/purged; an heir inherits a
  district ruled by fear and a bloodline that chose the lie — the darkest info-war outcome.
- UNRECORDED[what_you_wrote_on_the_district] colors the dynasty's relationship to truth + whether it
  fought manipulation or joined it.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Hollin's conflicted shame (the decent man the propaganda ALMOST got — the scariest face here);
  Seda's desperate defensiveness (a symptom, not a villain); Naro's weary wisdom (the dignified
  scapegoat who's seen it before); the broker's pleasant-cool approval on exploit. Procedural lip-sync.
BODY: the posters are readable place-nodes (Q028 environmental tech — the walls literally tell the
  story); Seda's paste-bucket; a staged tense crowd if it nears violence. Combat only if a mob is let
  to form and turns (avoidable).
CAMERA: closeup_on_posters (the words as the threat), two_shots for the human beats, wide for the
  district mood. Cuts on beat.
MUSIC: a creeping UNEASE motif (the mood curdling); the cyan-hum at the money-trail (the Network
  hand); resolve varies — honest on truth, sly on counter, warm-durable on root, cold on exploit.
  120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the info-war)
===============================================================================
- Pacifist-completable: truth/counter/root are all non-combat information/economy work; combat only
  if the player lets a mob form and turn violent (a failure state).
- Rewards diverge (Megaton law): TRUTH = a foiled Network play + an honest rep; COUNTER = a quick win
  + a corrupting skill; ROOT = the slowest + most durable cohesion (feed people, starve the lie);
  EXPLOIT = power via fear + a Network alliance + a scapegoated Homeless. The EASY, EFFECTIVE routes
  (counter/exploit) are ethically compromised; the RIGHT routes (truth/root) are harder and slower.
- Core teaching: how cheap and powerful a wall-lie is, that propaganda needs DESPERATION to work
  (root route kills it at the source — ties Q029), and that the decent are the most vulnerable to it
  (Hollin) — the anti-Network thesis: fracture is the enemy's weapon, cohesion is the defense.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Uses readable poster place-nodes (Q028 tech) + the money-trail deduction +
the district-cohesion + truth/propaganda rep flags + a Q029/Q036/Q006 economy link (root route).
Reads ledger/standing/skill/knowledge/economy/fold; writes same + cohesion + a truth-rep flag +
NETWORK-disposition (exploit). Deterministic + save-through. Gate: posters readable, money-trail gates
the truth route, all four routes resolve, root route ties the economy subsystem, cohesion + rep flags
persist, mob-violence is an avoidable failure state. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-036)
New engine: the PROPAGANDA / information-war — anonymous scapegoating posters fracturing a district,
resolved by truth/counter-propaganda/remove-the-root/exploit, teaching that a wall-lie is cheap and
powerful, that it needs DESPERATION to work (root route starves it — Q029 link), and that the decent
are most vulnerable (Hollin). Reveals the Network's divide-and-buy again (Q002/Q027/Q032 synergy) and
names the anti-Network thesis: fracture is the weapon, cohesion the defense. Bible at 37; the district's
STORY is now a battlefield, and the dynasty chooses who writes it.
