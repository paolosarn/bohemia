# BOHEMIA — QUEST 030: "PLAY-MONEY SHAKEDOWN"
Full production build. Built to the dialogue/scene spec; template = 001-029. Tier-3
REPEATABLE ROVING-THREAT (Vault #20 Play-Money Shakedown / Yakuza Mr-Shakedown + tradition
on scarcity pressure). Name from the vault. Second repeatable (after 019), tonally opposite:
a high-risk/high-reward roving mugger who makes carrying wealth DANGEROUS — teaches the
economy's teeth without a moral tally.

Design soul: a walking risk-reward gamble. A hulking enforcer roams the districts mugging
anyone carrying currency — and he can mug the DYNASTY for a generation's savings if he wins.
Beating him is a jackpot; losing is a gut-punch. It makes wealth a LIABILITY you carry
through the streets (Pathologic scarcity pressure) and gives the combat system a recurring
"boss you're not ready for yet" the player grows into.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_playmoney_shakedown
- tier: 3 (REPEATABLE roving encounter; scales with the player)
- fold: whether the dynasty ever beats him (and what it did with the winnings) is a small
  bragging-rights thread; if he's finally killed, his territory-tax lifts for the district.
- entry_conditions: while carrying currency above a threshold, the dynasty is intercepted in
  a district street by BRICK, the roving shakedown enforcer.
- faction_wires: MOB/CARTEL-lite (Brick freelances a territory tax), the district (relieved
  if he's beaten), TRADES (merchants he preys on).
- music_pool: a heavy, swaggering BOSS motif (his theme — becomes satisfying to hear once
  you can beat him); COMBAT; a jackpot sting on victory.
- ledger_writes: recorded[shakedown_record] (win/loss count); UNRECORDED[what_the_streets_
    cost_you]; district tax-relief flag if Brick is finally killed.
- amalgamation_thread: NONE. Pure economy-teeth + combat-progression.

===============================================================================
## 2. CAST
===============================================================================
- BRICK (id: brick) — a mountain of a man who mugs for a living, running a freelance
  "territory tax." Not cruel exactly — transactional, almost sporting; respects anyone who
  beats him. Grows into a recurring rival, then (if the player persists) a grudging ally.
  default_emotion: jovial_brutal. faction: freelance (MOB-adjacent).
- THE PLAYER — carrying wealth is the trigger; combat skill + Dead Eye vs a tanky boss;
  [INTIMIDATE]/[BARTER] offer non-combat outs; run/dodge is always available (Pacifist).

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
REPEATABLE ENCOUNTER: on trigger, a FORK — FIGHT (high risk/reward Dead Eye boss), PAY (lose
a cut, walk), FLEE (run/dodge minigame — Pacifist), or [INTIMIDATE]/[BARTER] (talk past him,
skill-gated). Win enough times and a FINAL beat unlocks (kill him / spare him / recruit him).
Losing costs currency but is never fatal (he takes your caps, not your life).

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: brick  emotion: jovial_brutal  gesture: crack_neck  camera: two_shot
  music:{pool:BOSS,cue:swagger_enter}
  line: "HO, there's a heavy purse if I ever heard one jingle. Name's Brick. This street's
         got a toll and you're carrying enough to pay it twice. Now — you can hand it over
         polite, or you can try your luck. I do love it when they try their luck. Makes the
         taking sweeter."
  -> goto shakedown_fork
node shakedown_fork (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Fight him.)"                          -> route_fight
   - "(Pay the toll. Walk.)"                  -> route_pay
   - "(Run — you're not ready for this.)"     -> route_flee
   - "[INTIMIDATE] (You don't want my kind of trouble.)" -> route_intimidate [require skill.intimidate>=4]
   - "[BARTER] (Cut you in on something bigger.)"        -> route_barter [require skill.barter>=3]
node route_fight
  speaker: brick  emotion: delighted  camera: combat  music:{pool:BOSS,cue:fight}
  line: "THAT'S the spirit! Let's see what you've got!"
  effect: a HIGH-STAKES Dead Eye boss fight (Brick is TANKY — an early loss teaches the
    player they must grow; a win is a JACKPOT: Brick's accumulated muggings). 
    - WIN: recorded[beat_brick]++; huge currency reward; Brick respects you (dialogue shifts
      warmer each win); UNRECORDED[took_the_toll_back]=true.
    - LOSE: not fatal — Brick takes a chunk of carried currency and leaves you standing
      ("nothing personal, come back when you're heavier"); UNRECORDED[the_streets_took_it]=true.
    -> goto post_fight
node route_pay
  speaker: brick  emotion: satisfied  camera: two_shot
  line: "Sensible. A little lighter, a lot less bruised. Pleasure doing business. Mind how you
         jingle out there." (takes a cut, leaves)
  effect: currency-=toll; recorded[paid_brick]; no fight, no reward — the safe tax. -> END
node route_flee
  effect: RUN/DODGE minigame (Pacifist Path Law) — escape without losing everything (partial
    fail = drop some caps fleeing); recorded[fled_brick]; Brick laughs, will find you again
    (he's repeatable). -> END
node route_intimidate  [INTIMIDATE]
  speaker: brick  emotion: reassessing  camera: closeup  micro_expression: raised_brow
  line: "...Huh. You've got a LOOK. I mug scared money, not money that looks back like that.
         Tell you what — this street's yours today. But keep jingling and I'll get curious
         again." (walks — bloodless, no toll)
  effect: recorded[stared_down_brick]; no toll, no fight — a rep flex; Brick remembers (future
    encounters start warmer). -> END
node route_barter  [BARTER]
  speaker: brick  emotion: intrigued  camera: two_shot
  line: "A CUT of something bigger than a purse? ...I'm listening. A man gets tired of shaking
         nickels out of merchants. What've you got?"
  effect: recorded[recruited_brick_seed]; opens a path where Brick can become a hired muscle/
    ally for the dynasty (a recurring asset) instead of a threat — the entrepreneurial out. -> END

--- POST-FIGHT / THE FINAL BEAT (after enough wins) ---
node post_fight (speaker: PLR)  camera: two_shot
  effect: if beat_brick count is low, Brick simply leaves ("good scrap — I'll want a rematch").
    if beat_brick reaches the threshold, unlock final_gate.
  -> goto final_check
node final_check
  condition: if beat_brick >= threshold -> final_gate; else -> END
node final_gate
  speaker: brick  emotion: winded_respectful  camera: closeup  music:{pool:BOSS,cue:winded}
  line: "...Alright. ALRIGHT. You've beat me more times than I've beat you and my knees have
         opinions about it now. So here's where we are: you can finish it and take the whole
         street for good, or... a man like me could work for a family that hits that hard.
         Your call, champ."
  choices (PLR):
   - "(Finish him — the street's toll ends.)"  -> final_kill
   - "(Spare him — let him limp off.)"           -> final_spare
   - "(Recruit him — Brick joins the dynasty.)"  -> final_recruit
node final_kill
  effect: Brick dead; the district's roving-tax LIFTS (merchants relieved — a small economic
    boon persists); recorded[ended_brick]; UNRECORDED[cleared_the_street]=true. -> END
node final_spare
  effect: Brick retires, becomes a district character (a reformed mugger who tells tall tales
    about the dynasty); recorded[spared_brick]; a warm recurring NPC. -> END
node final_recruit
  effect: Brick becomes hired dynasty MUSCLE (a combat asset / bodyguard for convoys, ties
    logistics); recorded[recruited_brick]; the rival-to-ally arc completes (Yakuza Mr-Shakedown
    homage). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- Ongoing: while Brick roams, carrying large currency through streets is RISKY (a standing
  economic-pressure mechanic — wealth is a liability; encourages banking/spending over hoarding).
- BEATEN REPEATEDLY -> KILLED: the street-tax lifts; merchants thrive slightly; an heir inherits
  a safer trade district + a legend ("the one who put Brick down").
- SPARED: a colorful recurring NPC who boosts district morale with dynasty tall-tales.
- RECRUITED: a persistent combat/muscle asset (convoy guard, enforcer) — the rival-to-ally
  payoff; an heir may inherit old Brick as a grizzled retainer.
- UNRECORDED[what_the_streets_cost_you] (net win/loss over all encounters) is a small bragging
  ledger — the streets either funded the dynasty or bled it.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Brick's jovial_brutal grin, warming across wins (raised_brow respect, winded_respectful
  at the finale) — a rival whose FACE tracks the growing relationship. Procedural lip-sync
  (big, booming delivery).
BODY: a heavy, telegraphed BOSS moveset (tanky, slow, punishing — the Dead Eye challenge is
  survival + patience); crack_neck swagger; the flee route uses run/dodge. His size makes him
  a distinct silhouette (a recurring landmark-threat you spot down a street).
CAMERA: two_shots for the swagger, COMBAT framing for the fight (wider, to read his big
  telegraphs), closeup for the finale. Cuts on beat.
MUSIC: a heavy swaggering BOSS motif (his leitmotif — designed to become SATISFYING once you
  can beat him, like a fighting-game rival theme); jackpot sting on a win; winded variation at
  the finale. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + economy-teeth)
===============================================================================
- Pacifist-completable: flee (run/dodge), intimidate, or barter past him every time — never
  required to fight. But FIGHTING is the high-reward gamble (the jackpot), so the quest tempts
  risk without demanding it.
- Rewards diverge (Megaton law): FIGHT+WIN = jackpot + respect; FIGHT+LOSE = a real currency
  hit (not fatal); PAY = safe tax; FLEE/INTIMIDATE/BARTER = escape or an ally path. The reward
  scales with risk — the classic Yakuza Mr-Shakedown risk/reward loop.
- Core mechanic: makes WEALTH a LIABILITY carried through the world (Pathologic scarcity
  pressure) — a standing economic tension that discourages hoarding and gives combat a
  recurring "grow into it" rival. The second REPEATABLE (contrast to 019's moral grind — this
  one is pure risk/reward FUN with no darkness tally).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON as a REPEATABLE roving encounter with a win-count threshold unlocking
a finale. Introduces the WEALTH-AS-LIABILITY trigger (carrying currency spawns risk) + a
scaling recurring BOSS (rival leitmotif, grows-into-it difficulty) + rival-to-ally arc. Reads
ledger/standing/skill/currency/fold; writes same + win-count + a district tax-relief flag + a
possible ally. Deterministic + save-through. Gate: encounter triggers on wealth threshold, all
forks resolve, fight win/loss both non-fatal + rewarded/taxed, finale unlocks at win-count,
kill/spare/recruit resolve, repeatable loop stable. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-029)
New engine: the REPEATABLE ROVING-THREAT / risk-reward boss — a roving mugger (Yakuza Mr-
Shakedown) who makes carrying wealth a LIABILITY (Pathologic scarcity pressure), offering a
high-risk/high-reward Dead Eye gamble and a grow-into-it recurring rival with a satisfying
leitmotif and a rival-to-ally arc (fight/pay/flee/intimidate/barter -> kill/spare/recruit).
Second repeatable, tonally opposite to 019 (pure fun, no darkness tally). Introduces wealth-as-
liability + scaling recurring boss. Bible at 30; the economy now has TEETH in the street and
combat has a rival to grow into. THIRD OF THE WAY TO ~90.
