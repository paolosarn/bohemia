# BOHEMIA — QUEST 046: "THE HONEST THIEF"
Full production build. Built to the dialogue/scene spec; template = 001-045. Tier-3
FOLK-ROBIN-HOOD / redistribution-morality (tradition on the sympathetic-outlaw shape +
Papers-Please economy-as-morality + the discarded-debtor canon). Name catalog-adjacent. A
thief robs the district's hoarders to feed its starving — and the dynasty decides whether
justice is the law or the outcome. A side quest that puts REDISTRIBUTION on the ledger.

Design soul: is theft wrong when the system is theft? A beloved local thief steals from those
who hoarded during the collapse and gives to those the collapse discarded. The law wants them
caught; the fed want them protected. The dynasty chooses whether property or people come first —
and whether "justice" means enforcing the rules or fixing the outcome.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_honest_thief
- tier: 3 (unmarked-leaning; the district is split over the thief)
- fold: protecting / catching / joining / co-opting the thief shapes the district's wealth
  distribution and the dynasty's stance on property-vs-need.
- entry_conditions: a hoarder (VELD) demands the dynasty catch the thief robbing him; the fed
  poor quietly beg the dynasty to let the thief run.
- faction_wires: TRADES/MOB (the hoarders, want the law), HOMELESS/poor blocks (the fed, want
  protection), REMNANTS (the law itself), CHURCH (jubilee/redistribution framing — ties Q038).
- music_pool: a light, roguish FOLK motif (sympathetic-outlaw energy); TENSION at the catch;
  resolve varies.
- ledger_writes: recorded[thief_outcome_*]; UNRECORDED[property_or_people]; a wealth-distribution
  + property-stance flag.
- amalgamation_thread: NONE. A human economic-justice quest.

===============================================================================
## 2. CAST
===============================================================================
- THE THIEF / FINCH (id: finch) — robs the collapse's hoarders to feed its victims; charming,
  principled, NOT in it for themselves (lives as poor as those they feed); a folk hero to some,
  a criminal to others. default_emotion: roguish_sincere. faction: none (folk).
- VELD (id: veld) — a hoarder who sat on food/medicine during the collapse and profited; wants
  the thief caught and his property protected; legally in the right, morally grey. default_emotion:
  aggrieved_entitled. faction: TRADES/MOB.
- MATRON ESSE (id: esse) — speaks for the fed poor; the thief kept her block alive. default_emotion:
  fierce_grateful. faction: HOMELESS/poor.
- CONSTABLE DRE (id: dre) — RECURRING (Q031); the law, who must enforce property rights even when
  they chafe. default_emotion: principled_torn. faction: REMNANTS.
- THE PLAYER — [READ]/[BARTER], property-vs-need is the axis; standing.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
INVESTIGATION (learn who Finch robs + who they feed; hear hoarder, fed, and law) -> a CHOICE:
CATCH FINCH (uphold property/law), PROTECT FINCH (shield the redistributor), JOIN/EXPAND (turn it
into organized redistribution), or CO-OPT (make Finch work for the dynasty — control the flow). The
axis: property-vs-need, law-vs-outcome.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: veld  emotion: aggrieved_entitled  gesture: shake_a_broken_lock  camera: two_shot
  music:{pool:FOLK,cue:soft_enter}
  line: "I've been ROBBED. Third time this season — my stores, my strongbox, gone to some gutter
         saint who thinks my property is a public well. I EARNED what I have. Sat on it through the
         hard years while others starved, yes — that's called PLANNING. Catch this thief and make an
         example. Property's the only law that separates us from animals."
  choices (PLR):
   - "You hoarded while people starved."   -> spoke_hoard
   - "I'll look into the thefts."           -> invest_hub
   - "Who's the thief feeding?"             -> spoke_feed
node spoke_hoard
  speaker: veld  emotion: defensive  camera: closeup  micro_expression: no_shame
  line: "I hoarded LEGALLY. There's no crime in keeping what's yours while fools give theirs away. If
         the starving wanted food they should've PLANNED. Don't moralize at me — moralize at the thief
         picking my locks. THAT'S the crime here. Not my full pantry." -> goto invest_hub
node spoke_feed
  speaker: veld  emotion: dismissive  camera: closeup
  line: "The gutter blocks, I hear. 'Feeds the poor.' Very romantic. It's still THEFT, and if you
         reward it, every strongbox in this district is a target and nobody builds anything worth
         keeping. Catch the thief. Or watch property mean nothing." -> goto invest_hub
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Find Finch, the thief.)"          -> finch_01 [once]
   - "(Talk to Esse and the fed poor.)"   -> esse_01  [once]
   - "(Talk to Constable Dre — the law.)" -> dre_01    [once]
   - "(Decide.)"                           -> choice_gate [show after 2]
node finch_01
  speaker: finch  emotion: roguish_sincere  gesture: split_a_stolen_loaf  camera: two_shot
  line: "So Veld sent you. Let me guess — 'make an example.' Look at me: I don't have a coin more than
         the folks I feed. I'm not robbing for ME. Veld sat on medicine while kids died of the fever he
         could've CURED for the price of his cufflinks. I just... rebalanced the ledger a little. If
         that's a crime, it's the only honest work in this district. You gonna cuff me, or you gonna
         help me?"
  effect: knowledge[finch_redistributes_doesnt_profit] (a sincere Robin Hood, not a con)  -> goto invest_hub
node esse_01
  speaker: esse  emotion: fierce_grateful  gesture: clutch_a_child  camera: closeup
  line: "Finch is why this block ate this winter. Not the district. Not charity. FINCH. You want to
         call that theft, you go ahead — but my kids are ALIVE because someone took from a man who had
         too much and gave to us who had nothing. The law protected Veld's pantry. Finch protected my
         CHILDREN. You tell me which one's justice."
  effect: knowledge[finch_kept_a_block_alive]  -> goto invest_hub
node dre_01
  speaker: dre  emotion: principled_torn  gesture: rest_hand_on_ledger  camera: two_shot
  line: "I know what Finch does. I know Veld's a vulture who profited off dying people. And I STILL
         have to enforce property law, because the day I decide which theft is 'justified' is the day
         law becomes my opinion. ...But I'll be honest: I've been slow to catch Finch. Slower than I
         could be. Make of that what you will. The law and the RIGHT aren't always the same address."
  effect: knowledge[even_the_law_sympathizes] (Dre won't break the law but won't rush it either)  -> goto invest_hub

--- THE CHOICE ---
node choice_gate (speaker: PLR)  camera: closeup  music:{pool:FOLK,cue:hold}
  choices:
   - "(Catch Finch — uphold property and law.)"       -> route_catch
   - "(Protect Finch — shield the redistributor.)"     -> route_protect
   - "(Join/expand — organize the redistribution.)"    -> route_expand
   - "(Co-opt Finch — make the flow serve the dynasty.)" -> route_coopt
node route_catch
  speaker: finch  emotion: unsurprised_bitter  camera: closeup  micro_expression: wry_grief
  line: "...Course you did. Property's the law and I'm the criminal, tidy as that. Tell Esse's kids I'm
         sorry I couldn't keep it up. Tell Veld his pantry's safe and his soul's exactly as full as it
         was. ...You upheld the LAW. I hope it keeps the block as warm as I did."
  effect: Finch caught/jailed; Veld's property protected (LAW upheld); the fed block goes hungry again;
    recorded[caught_finch]; UNRECORDED[chose_property_over_people]=true; REMNANTS/TRADES approve, poor
    blocks embittered; the order-over-mercy choice (the law was clean, the outcome cold). -> END
node route_protect
  speaker: esse + finch  emotion: relieved_grateful  camera: two_shot  music:{pool:FOLK,cue:warm}
  line (finch): "You're... looking the other way? Letting me run? (grins) The dynasty's got a heart
         after all. I'll keep the blocks fed and keep it quiet — you never saw me. Veld'll howl. Let
         him howl into his full pantry."
  effect: Finch protected (redistribution continues); the fed poor stay fed; Veld/property-holders
    outraged (a property-stance shift — the dynasty signals people-over-property); recorded[protected
    _finch]; UNRECORDED[chose_people_over_property]=true; the mercy-over-order choice (chafes the law,
    warms the blocks). -> END
node route_expand
  speaker: finch  emotion: awed  camera: two_shot  music:{pool:FOLK,cue:rising}
  line: "ORGANIZE it? Not one thief in the night — a real redistribution, out in the open, the district
         deciding the hoarders share what they sat on while people died? That's not theft anymore. That's
         a POLICY. That's... that's the jubilee the old faiths talked about. You'd really do that?"
  effect: the redistribution becomes ORGANIZED district policy (a jubilee-style wealth-rebalance — ties
    Q038; hoarders taxed/redistributed by law, not theft); the poor blocks thrive; the hoarders fight it
    (political cost); recorded[organized_redistribution]; UNRECORDED[made_it_a_policy]=true; standing
    [HOMELESS/CHURCH]+, [TRADES/MOB hoarders]-; the boldest structural-justice route (turns theft into
    a system — the anti-hoarding economic reform). -> END
node route_coopt
  speaker: finch  emotion: wary_conflicted  camera: closeup
  line: "...Work for YOU? Rob who you point at, feed who you choose? That's not redistribution, that's a
         LEASH with my hands on it. ...But you'd keep me out of a cell, and the blocks fed, and I'd be a
         tool instead of a hero. ...I don't love it. But hungry kids don't eat on my PRINCIPLES. Fine.
         Point me."
  effect: Finch becomes the dynasty's redistribution TOOL (the dynasty controls the flow — feeds loyal
    blocks, pressures rivals via selective 'redistribution'); real soft power + the poor fed on the
    dynasty's terms; Finch compromised (a hero made an instrument); recorded[coopted_finch]; UNRECORDED
    [made_charity_a_weapon]=true; the pragmatic-grey Become-adjacent route (redistribution as leverage). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- CATCH: property/law upheld; the fed block hungry again; hoarders secure; an heir inherits a
  property-first district (order + inequality); poor-block resentment.
- PROTECT: redistribution continues informally; people-over-property signaled; hoarders wary; a warmer,
  less lawful district.
- EXPAND: a jubilee-style redistribution POLICY (structural justice — ties Q038); the poor thrive; the
  hoarders are a political enemy; an heir inherits a more equal, more contested district.
- CO-OPT: the dynasty controls the redistribution flow (soft power + fed-on-our-terms loyalty); Finch
  compromised; charity-as-weapon (a grey precedent).
- UNRECORDED[property_or_people] sets the dynasty's economic-justice stance across the fold — order and
  inequality, or mercy and contestation.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Finch's roguish sincerity (a folk hero who means it); Veld's shameless entitlement (the hoarder
  who calls hoarding "planning" — the face of collapse-profiteering); Esse's fierce gratitude; Dre's
  principled torment (the law that sympathizes but can't bend). Procedural lip-sync.
BODY: Finch's light, quick movement (the charming outlaw); the split-loaf gesture (redistribution made
  physical); combat only if the player forces a violent catch. The hoarder's strongbox, the fed block —
  the economics staged.
CAMERA: two_shots for the three sides, closeup on Finch splitting the loaf, closeup on Esse's child (the
  stakes). Cuts on beat.
MUSIC: a light roguish FOLK motif (sympathetic-outlaw energy — the district's split feeling made
  audible); warm on protect, rising on expand, cold-clean on catch. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + property-vs-need)
===============================================================================
- Pacifist-completable: protect/expand/co-opt avoid combat; catch can be a nonlethal arrest. Violence
  only if the player forces it.
- Rewards diverge (Megaton law): CATCH = law + inequality + resentment; PROTECT = fed poor + property
  friction; EXPAND = structural justice + a hoarder enemy; CO-OPT = soft power + a compromised hero. The
  axis is property-vs-need and law-vs-outcome — no route is "correct," each is a real political-economic
  stance with real winners and losers.
- Core theme: is theft wrong when the system is theft? Ties the discarded-debtor canon (Q028/Q038) — the
  collapse-profiteers vs the collapse-victims — and puts REDISTRIBUTION on the ledger as a live question,
  taught through a folk hero, never preached.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Drives a wealth-distribution + property-stance flag (the district's economic
justice state) + an optional jubilee-policy (ties Q038) + a recurring folk-NPC (Finch). Reads ledger/
standing/skill/knowledge/economy/fold; writes same + the distribution/stance flags. Deterministic + save-
through. Gate: all four routes resolve, expand writes a redistribution policy, co-opt makes Finch a tool,
the property-vs-people flag persists, Dre's slow-to-catch sympathy reads, no-correct-answer enforced.
Joins the suite.

## 9. WHAT THIS PROVES (vs 001-045)
New engine: the FOLK-ROBIN-HOOD / redistribution-morality — a sincere thief robbing collapse-hoarders to
feed collapse-victims, forcing a property-vs-need, law-vs-outcome choice (catch/protect/expand/co-opt),
where EXPAND turns theft into jubilee-style structural justice (ties Q038) and CO-OPT turns charity into
leverage. Puts REDISTRIBUTION on the ledger as a live question, tied to the discarded-debtor canon
(Q028/Q038), taught through a folk hero without preaching. Bible at 46; economic justice is now a choice
with real winners and losers, not a slogan.
