# BOHEMIA — QUEST 038: "THE DEBT THAT OUTLIVED HIM"
Full production build. Built to the dialogue/scene spec; template = 001-037. Tier-2
INHERITED-OBLIGATION / consequence-across-time (the bible's UNIFYING through-line: what
survives when a life ends; tradition XXX Pentiment + the recorded-vs-unrecorded ledger + the
generational-persistence canon). Name catalog-adjacent. A dead man's debt lands on his
innocent heir — and the dynasty decides whether debts (and sins) are inherited.

Design soul: the through-line of the whole bible made a single quest — CONSEQUENCE ACROSS
TIME. A creditor comes to collect a dead man's debt from his child, who never agreed to it and
barely knew him. The quest asks whether obligation, guilt, and inheritance pass down the blood
— the exact question the dynasty itself lives (succession, the Family Box, the fold). What the
dynasty decides here echoes how IT wants to be judged for its own inherited sins.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_debt_outlived_him
- tier: 2 (marked; a creditor's claim on an heir)
- fold: whether the dynasty enforces, forgives, transforms, or exposes an inherited debt sets a
  PRECEDENT the game remembers — and colors how the dynasty's OWN inherited debts/sins are later
  judged (a rare self-referential fold hook).
- entry_conditions: a creditor (VELM) comes to collect a large debt from JONAH, the young heir of
  a dead man (ARLO) who signed it; Jonah never agreed and can't pay.
- faction_wires: TRADES (Velm's claim), MOB (enforcement muscle), the community watching whether
  debts pass down, CHURCH (jubilee/forgiveness framing).
- music_pool: TENSION; a mournful inheritance motif; resolve varies by route.
- ledger_writes: recorded[debt_outcome_*]; UNRECORDED[do_sins_pass_down] (the core axis);
  a PRECEDENT flag (colors the dynasty's own succession-judgment later).
- amalgamation_thread: NONE-to-LIGHT — the theme (what survives a death, what the living owe the
  dead's choices) rhymes with the Amalgamation (which HOARDS the dead) — an optional thematic beat.

===============================================================================
## 2. CAST
===============================================================================
- JONAH (id: jonah) — ~17, the heir; his father Arlo died owing a fortune Jonah never knew about
  and can't pay; decent, frightened, ashamed of a sin that isn't his. default_emotion: frightened_
  proud. faction: none.
- VELM (id: velm) — the creditor; not a monster — Arlo DID owe him, and Velm has his own people
  and debts depending on collection. Has a real claim AND a conscience he's suppressing. default_
  emotion: hard_but_uneasy. faction: TRADES.
- ARLO (id: arlo) — dead; present through what he left (a hidden truth about WHY he borrowed —
  discoverable, and it recontextualizes the debt). A ledger, a letter, a reputation.
- ELDER SASH (id: sash) — CHURCH; argues for jubilee (debt-forgiveness as a communal reset).
  default_emotion: principled_gentle. faction: CHURCH.
- THE PLAYER — [READ] (find Arlo's truth), [BARTER], leadership; the axis is inherited obligation.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
INVESTIGATION (learn WHY Arlo borrowed; gauge Velm's need; hear the jubilee argument) -> a CHOICE
about inherited debt: ENFORCE (the debt passes — Jonah pays/serves), FORGIVE (cancel it — the
dynasty covers/absorbs it), TRANSFORM (convert the debt to labor/partnership — a third way), or
EXPOSE (reveal Arlo's truth to void or reframe the claim). Each answers "do sins pass down?"

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: velm  emotion: hard_but_uneasy  gesture: present_a_contract  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "Arlo's dead, but his debt isn't. Signed, sealed — a fortune I fronted him in good faith.
         The boy's his blood and his heir, so the debt's the boy's now. That's how it works. That's
         how it's ALWAYS worked. I don't ENJOY collecting from a kid. But I've got people I owe too,
         and 'his father died' doesn't feed them. Help me settle this. Clean."
  choices (PLR):
   - "The boy didn't sign anything."          -> spoke_innocent
   - "What did Arlo borrow it FOR?"            -> spoke_why
   - "Let me look into this before anyone pays." -> invest_hub
node spoke_innocent
  speaker: velm  emotion: defensive_uneasy  camera: closeup  micro_expression: looks_away
  line: "Blood signs for blood. If debts died with the man, every borrower'd just... die on you.
         The heir inherits the coin AND the cost — that's the deal that makes ANY lending possible.
         ...I know how it sounds, saying it to a scared kid's face. Doesn't make it wrong. Does it?"
  -> goto invest_hub
node spoke_why
  speaker: velm  emotion: dismissive  camera: closeup
  line: "For what? Does it matter? A debt's a debt whatever he spent it on. ...Though I'll admit
         he never spent like a man living large. Spent like a man DESPERATE. Never asked why. Wasn't
         my business. Maybe it's yours." -> goto invest_hub
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Find out why Arlo borrowed — his papers.)"  -> clue_arlo  [once]
   - "(Talk to Jonah, the heir.)"                    -> jonah_01   [once]
   - "(Hear Elder Sash on jubilee.)"                 -> sash_01     [once]
   - "(Gauge whether Velm truly needs it.)"          -> clue_velm   [once]
   - "(Decide.)"                                      -> choice_gate [show after 2]
node clue_arlo
  speaker: PLR (internal)  camera: closeup_on_papers  music:{pool:TENSION,cue:mournful}
  line: "(Arlo's papers: he didn't borrow for himself. He borrowed to pay for a WORKING-BLOCK
         medicine run when the plague hit — quietly covered a dozen families' treatment, Jonah's
         friends among them, and never told a soul. He died owing a fortune he spent SAVING people.
         The 'debt' is a secret act of grace. The boy's inheriting his father's KINDNESS, dressed as
         a bill.)"
  effect: knowledge[arlo_borrowed_to_save_lives] (recontextualizes everything — ties Q006 medicine)
  -> goto invest_hub
node jonah_01
  speaker: jonah  emotion: frightened_proud  gesture: square_thin_shoulders  camera: closeup
  line: "I didn't know he owed anything. I barely knew HIM — he worked all hours and died tired. Now
         a man wants a fortune I don't have for something I never touched. ...But he was my father. If
         his name owes, maybe I owe. I don't want to run from it and be the kind of man who runs. I
         just... don't know how a debt becomes MINE because I was born."
  effect: knowledge[jonah_is_innocent_but_honorable] (he'll shoulder it if told to — which makes
    enforcing it crueler)  -> goto invest_hub
node sash_01
  speaker: sash  emotion: principled_gentle  gesture: open_palms  camera: two_shot
  line: "Every old faith had a JUBILEE — a year the debts were forgiven, the slates wiped, so no
         child was born already owing. Not charity. WISDOM. A society where debt passes down forever
         becomes a society of the born-guilty, and the born-guilty have nothing to lose. Forgive this
         one, and you plant a different seed."
  effect: knowledge[jubilee_is_the_communal_case_for_forgiveness]  -> goto invest_hub
node clue_velm
  speaker: PLR (internal)  camera: closeup
  line: "(Velm's not lying — he DOES owe others, and Arlo's default hurt him. But he's not ruined.
         He could absorb this loss; it would sting, not sink him. His insistence is partly principle,
         partly the fear that forgiving ONE debt unravels every debt he's owed. He's rigid because
         he's scared, not because he's cruel.)"
  effect: knowledge[velm_can_afford_mercy_but_fears_it]  -> goto invest_hub

--- THE CHOICE ---
node choice_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Enforce it — the debt passes to Jonah.)"                 -> route_enforce
   - "(Forgive it — the dynasty absorbs/cancels the debt.)"      -> route_forgive
   - "(Transform it — convert debt to labor/partnership.)"       -> route_transform
   - "(Expose Arlo's truth — reframe or void the claim.)" [require knowledge.arlo_borrowed_to_save_lives] -> route_expose
node route_enforce
  speaker: jonah  emotion: resigned_hardening  camera: closeup  micro_expression: light_dims
  line: "...Then I'll pay it. Years of my life, whatever it takes. I'll be the son who honored his
         father's name. ...I just thought being born might come with something other than a bill.
         Guess not. Guess that's the world."
  effect: the debt passes; Jonah indentured/burdened for years (a young life spent on an inherited
    obligation); recorded[enforced_the_debt]; UNRECORDED[sins_pass_down]=true; sets a PRECEDENT
    (debts/sins ARE inherited — which the game will apply to the DYNASTY's own inherited sins later,
    a hard mirror); the district learns the born-guilty lesson (colder, more Velm-like). -> END
node route_forgive
  speaker: velm  emotion: unsettled_relieved  camera: two_shot  music:{pool:TENSION,cue:warm_low}
  line: "...You're covering it. Or canceling it. Just— letting the boy walk free of it. (a long
         pause) You know what, I've collected inherited debts for thirty years and I've never once
         felt CLEAN doing it. ...Take the loss. Let the kid be a kid. Maybe I've been scared of the
         wrong thing all along."
  effect: the debt is forgiven/absorbed (the dynasty pays or Velm relents); Jonah freed; recorded
    [forgave_the_debt]; UNRECORDED[broke_the_chain]=true; sets a PRECEDENT (sins do NOT pass down —
    a jubilee seed that softens how the dynasty's own inherited sins are later judged); CHURCH/
    community goodwill; Velm, freed of his own rigidity, may become an ally. -> END
node route_transform
  speaker: jonah  emotion: cautious_hope  camera: two_shot
  line: "...Not pay it OFF — pay it FORWARD? Work Velm's routes, learn the trade, turn the debt into
         a partnership instead of a chain? ...That I can do standing up. That's not inheriting a bill.
         That's inheriting a START."
  effect: the debt converts to labor/apprenticeship/partnership (Jonah works WITH Velm, not under him);
    both gain; recorded[transformed_the_debt]; UNRECORDED[made_the_debt_a_bridge]=true; the pragmatic
    third way (obligation honored without crushing the innocent); a durable Velm-Jonah bond. -> END
node route_expose  [the truth reframes it]
  speaker: velm  emotion: struck_silent  camera: closeup  micro_expression: the_hardness_cracks
  line: "...He borrowed it to buy MEDICINE. For the plague. For— (he checks the names) —for families
         on MY OWN block. Arlo didn't default on me. He spent my coin saving my neighbors and died
         before he could tell anyone. And I came to collect that from his SON. ...God. Tear it up.
         Tear the whole thing up. That's not a debt. That's a man I owe an APOLOGY."
  effect: Arlo's grace is revealed; the "debt" is voided or transformed into public honor for Arlo;
    Jonah inherits his father's GOOD NAME instead of his bill; recorded[exposed_arlos_truth];
    UNRECORDED[the_debt_was_grace]=true; the best outcome — the truth doesn't just cancel the debt,
    it redeems the dead man and reframes inheritance as the passing-down of KINDNESS (the bible's
    warmest answer to its own through-line). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD (self-referential — the dynasty is judged by its own precedent)
===============================================================================
- ENFORCE: debts/sins pass down (precedent set); Jonah's youth spent on it; an heir inherits a
  colder, born-guilty district — AND the dynasty's OWN inherited sins are later judged by this same
  hard rule (the mirror bites).
- FORGIVE: the chain broken (jubilee precedent); Jonah freed; the dynasty's own inherited sins are
  later judged with more mercy (the seed it planted); Velm redeemed.
- TRANSFORM: obligation honored as partnership; a durable bond; a pragmatic precedent (debts become
  bridges, not chains).
- EXPOSE: Arlo redeemed, Jonah inherits a good name, Velm shamed into grace; the warmest answer —
  inheritance as the passing-down of KINDNESS, not guilt (the bible's through-line resolved hopefully).
- PRECEDENT flag persists and is CHECKED when the dynasty faces judgment for its OWN inherited sins
  (a rare quest whose choice rebounds on the player's own succession).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Jonah's frightened pride and its fate (light_dims on enforce, cautious_hope on transform);
  Velm's suppressed conscience cracking (the_hardness_cracks on expose — a hard man made human by a
  truth); Sash's gentle principle. The QUEST'S emotional gut is Velm realizing what Arlo really did.
  Procedural lip-sync.
BODY: talk-heavy (a moral/investigation quest); Arlo's papers are a readable place-node (Q028 tech);
  gesture one-shots (present_a_contract, square_thin_shoulders, open_palms). No combat (unless the
  player forces enforcement violently — a failure).
CAMERA: two_shots for the claim, closeup_on_papers for Arlo's truth, closeup on Velm's crack at the
  expose. Cuts on beat.
MUSIC: a mournful INHERITANCE motif; warm_low on forgive; the resolve reframes on expose (mournful ->
  redemptive). 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the through-line)
===============================================================================
- Fully pacifist (a moral/investigation quest); combat only if the player enforces by violence (a
  failure state).
- Rewards diverge (Megaton law): ENFORCE = coin recovered for Velm + a young life spent + a hard
  precedent; FORGIVE = a cost absorbed + a freed kid + a jubilee precedent; TRANSFORM = a partnership
  + a durable bond; EXPOSE = a dead man redeemed + a good name inherited + Velm as ally. The reward
  isn't caps — it's the PRECEDENT you set for whether guilt is inheritable, which rebounds on the
  dynasty itself.
- Core theme (the bible's UNIFYING through-line): consequence across time — what survives when a life
  ends, and whether the living owe the dead's choices. The self-referential fold hook (your choice
  judges your OWN succession) makes it the thematic keystone of the whole quest bible.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Uses readable record-nodes (Arlo's papers, Q028 tech) + a self-referential
PRECEDENT flag (checked later when the dynasty is judged for its own inherited sins — a novel fold
mechanic). Reads ledger/standing/skill/knowledge/fold; writes same + the precedent flag + Velm/Jonah
bonds. Deterministic + save-through. Gate: Arlo's truth discoverable, all four routes resolve, expose
gated behind the truth, the precedent flag sets + persists + is checked at the dynasty's own judgment,
Velm's crack fires on expose. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-037)
The THEMATIC KEYSTONE: the bible's unifying through-line (consequence across time — what survives a
death, whether guilt is inherited) made a single quest. A dead man's debt lands on his innocent heir,
resolved by enforce/forgive/transform/expose, where the truth (Arlo borrowed to SAVE lives) reframes
inheritance as the passing-down of KINDNESS. Introduces the self-referential PRECEDENT flag — the
dynasty's choice here judges its OWN inherited sins later. Bible at 38; the through-line that threads
every quest now has its explicit statement, and the player's answer rebounds on their own succession.
