# BOHEMIA — QUEST 045: "THE RECORD KEEPER"
Full production build. Built to the dialogue/scene spec; template = 001-044. Tier-2
RECORDED-VS-UNRECORDED / who-writes-history (the bible's recorded-vs-unrecorded ledger canon
made explicit + tradition XXX Pentiment + Papers-Please). Name catalog-adjacent. The keeper of
the district's OFFICIAL records is dying and offers to write the dynasty into history however
it wishes — forcing a choice between the legend and the truth, the twin ledgers of the whole game.

Design soul: history is written, not remembered — and someone holds the pen. The dying archivist
who keeps the district's official record (the RECORDED ledger, as opposed to the Family Box's
UNRECORDED truth) offers the dynasty a last favor: they'll write the dynasty's history however it
likes. The quest is the game's central duality made a single choice — do you author a flattering
legend, an honest record, a buried truth, or seize the pen entirely?

===============================================================================
## 1. HEADER
===============================================================================
- id: q_record_keeper
- tier: 2 (marked; the archivist's deathbed offer)
- fold: what goes in the official RECORD shapes how the district (and history) remembers the
  dynasty — and interacts with the UNRECORDED Family Box (the legend vs the truth gap becomes a
  fold-carried tension).
- entry_conditions: the district archivist SEP is dying and summons the dynasty to settle the
  official record before they pass.
- faction_wires: CHURCH (the record's moral weight), TRADES (contracts/history), all factions
  (their remembered history), the dynasty's own legend.
- music_pool: a quiet ARCHIVE motif (dust, ink, the weight of the written); solemn resolve by choice.
- ledger_writes: recorded[record_outcome_*] (LITERALLY the recorded ledger — this quest writes it);
  UNRECORDED[the_gap_between_legend_and_truth]; a history/legend state.
- amalgamation_thread: LIGHT — the Amalgamation HOARDS the dead as data (a false immortality); the
  archivist's human record (imperfect, chosen, mortal) is its quiet counterpoint — an optional
  thematic beat on what it means to be REMEMBERED vs UPLOADED.

===============================================================================
## 2. CAST
===============================================================================
- SEP (id: sep) — the district's archivist, dying; has kept the official record for fifty years,
  knows it's always been a CHOICE about what to write and what to leave out. Offers the dynasty the
  pen as a last act. default_emotion: dry_wise_fading. faction: neutral/CHURCH-adjacent.
- APPRENTICE LIRI (id: liri) — Sep's successor, idealistic, believes the record must be TRUE or it's
  worthless; watches what the dynasty chooses. default_emotion: earnest_watchful. faction: neutral.
- THE PLAYER — [READ] (the power of the record), reckoning with legend vs truth; every prior
  UNRECORDED flag is what COULD go in (or be left out of) the official version.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
THE OFFER (Sep offers to write the dynasty's history) -> reflection (what's the gap between the
legend and the truth?) -> a CHOICE of what to RECORD: FLATTERING LEGEND (write the myth — power),
HONEST RECORD (write the truth, warts and all — integrity), BURIED TRUTH (omit the sins — safe
legend), or SEIZE THE PEN (take control of the archive entirely — the dynasty writes ALL history —
the darkest Become route). The recorded-vs-unrecorded duality, decided.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: sep  emotion: dry_wise_fading  gesture: tap_a_heavy_ledger  camera: two_shot
  music:{pool:ARCHIVE,cue:soft_enter}
  line: "Fifty years I've kept this district's record. And I'll tell you the secret of my trade before
         I go: history isn't what HAPPENED. It's what someone chose to WRITE DOWN. I've left out mercies
         and I've recorded lies, all to keep the peace or serve a patron. Now I'm dying, and I'll do one
         last entry — YOUR dynasty's history. However you want it written. The pen's heavier than it
         looks. What do you want the future to read?"
  choices (PLR):
   - "Write it TRUE. All of it."         -> route_honest (jump — but confirm via reflect)
   - "Why offer ME the pen?"              -> spoke_why
   - "[READ] What power is in that ledger?" -> spoke_read [require skill.read>=3]
   - "(Reflect before answering.)"        -> reflect_hub
node spoke_why
  speaker: sep  emotion: fading_frank  camera: closeup
  line: "Because you're the one shaping this district now, and the record shapes how the NEXT hundred
         years judge you. Better you choose it knowing than have some frightened successor of mine
         choose it for you. ...Also I'm curious. A dynasty's true character shows in what it wants
         REMEMBERED. Show me yours." -> goto reflect_hub
node spoke_read  [READ]
  speaker: sep  emotion: knowing  camera: closeup  micro_expression: dry_smile
  line: "Power? The record is the ONLY immortality a mortal gets — and the only weapon that kills a man
         AFTER he's dead, by writing him wrong. Whoever holds this pen holds every reputation in the
         district, past and future. That's why patrons have always wanted it. That's why I never sold
         it. ...Will you?" -> goto reflect_hub
node reflect_hub (speaker: PLR)  camera: closeup  music:{pool:ARCHIVE,cue:low}
  line: "(The gap between what the dynasty DID — the Family Box, the unrecorded truth — and what the
         district BELIEVES. Every folded companion, every forgiven debt, every march and mercy. Sep
         offers to fix the official version to ANYTHING. The legend and the truth, and the pen that
         decides which one survives.)"
  choices (PLR):
   - "(Write the flattering legend.)"     -> route_legend
   - "(Write the honest record — warts and all.)" -> route_honest
   - "(Write it, but bury the sins.)"      -> route_buried
   - "(Seize the whole archive — the pen is ours now.)" -> route_seize
node route_legend
  speaker: sep  emotion: unsurprised  camera: two_shot  micro_expression: faint_disappointment
  line: "The glorious version. The wise founder, the just hand, the district's savior. It's not TRUE,
         but it'll hold — legends usually do. Your heirs will inherit a shining name and never know its
         cost. ...I've written a hundred of these. They always read beautifully. They never read HONEST.
         But it's your pen now. Done."
  effect: the official record becomes a flattering LEGEND (district reveres the dynasty; a shining public
    name); COST: the gap between legend and Family-Box truth WIDENS (an heir inherits a myth to live up
    to OR be crushed by — Q041 CONCEAL-adjacent); recorded[wrote_the_legend]; UNRECORDED[chose_the_myth]
    =true. Power via reputation, on a false foundation. -> END
node route_honest
  speaker: liri  emotion: moved_surprised  camera: two_shot  music:{pool:ARCHIVE,cue:solemn_resolve}
  line: "(Liri, the apprentice, speaks) ...You're writing the SINS in. The folded companion, the march,
         the enforced debt — right beside the mercies. You could've had a spotless legend and you chose
         a TRUE one. (to Sep) This is what the record's FOR. (to player) I'll keep it honest after you're
         gone. On my life. A record that tells the truth about power is the only one worth keeping."
  effect: the official record becomes HONEST (sins and graces both); the district's memory of the
    dynasty is TRUE (complex, respected for its honesty — some love it, some judge the sins openly);
    COST: no flattering shield (the sins are public); recorded[wrote_the_truth]; UNRECORDED[hid_nothing_
    from_history]=true; the legend and the truth CLOSE (integrity — the anti-CONCEAL; Liri keeps it
    honest for generations). The integrity choice. -> END
node route_buried
  speaker: sep  emotion: complicit_tired  camera: closeup
  line: "The good parts, then, and the worst left in the dark. A KIND legend — not a lie exactly, just...
         curated. It's what I've mostly done, God forgive me. It keeps the peace. It also means the truth
         only lives in that Box of yours, and Boxes get lost. ...Choose knowing that. Buried truth has a
         way of digging itself up." (ties Q042)
  effect: the record is CURATED (graces recorded, sins omitted); a KIND legend; COST: the buried sins are
    a liability (Q042 resurfacing — a lost Box means a lost truth); recorded[buried_the_sins]; UNRECORDED
    [curated_the_record]=true; the protective-but-fragile middle. -> END
node route_seize
  speaker: sep  emotion: alarmed_fading  camera: closeup  micro_expression: grip_tightens
  line: "...Not one entry. The whole ARCHIVE. You don't want your history written — you want to write
         EVERYONE'S. Rivals into villains, allies into subjects, the whole district's memory as your
         instrument. ...I've feared this hand my whole life. Liri, don't— (to player) you'll control what
         a hundred years believes. That's not a record anymore. That's a THRONE made of ink."
  effect: the dynasty SEIZES the archive (controls ALL official history — can rewrite any reputation,
    erase rivals, author the district's entire memory); immense soft power + a propaganda engine (ties
    Q037); COST: Liri resists (may become an enemy/underground truth-keeper); the record becomes a WEAPON,
    not a memory; recorded[seized_the_archive]; UNRECORDED[took_the_pen_entirely]=true; NETWORK-adjacent
    (they'd approve — controlling memory is their game); the darkest Become route (authoring reality). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- LEGEND: a shining public name; the legend/truth gap widens; an heir inherits a myth (to honor or be
  crushed by); reveres-the-dynasty district.
- HONEST: a true, complex memory; respected for integrity; Liri keeps it honest across generations; the
  legend and truth CLOSE (no gap to resurface — the safest long-term, if the hardest short-term).
- BURIED: a kind legend on buried sins; the Q042 resurfacing risk (lost truth digs itself up); fragile.
- SEIZE: control of all history + a propaganda engine (Q037 link); Liri as an underground truth-keeper
  enemy; the district's memory becomes the dynasty's instrument — soft-power hegemony, ink-made throne.
- The RECORDED (this quest) vs UNRECORDED (Family Box) gap is now an explicit fold-carried tension — the
  wider the gap, the more the truth strains to resurface (Q042); the honest route is the only one that
  closes it.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Sep's dry, dying wisdom (the archivist who knows history is chosen); Liri's earnest watchfulness
  and her moved surprise at the honest route (the successor who'll keep or lose the truth); the weight of
  the ledger itself. Procedural lip-sync (Sep's voice thin, fading).
BODY: an archive/deathbed staging (the heavy ledger the key prop; dust, shelves of record); the writing
  is the central gesture (the pen to the page — history being authored). No combat.
CAMERA: two_shots at the deathbed, closeup on the ledger + the pen, closeup on Liri's reaction (the
  future of the record in her face). Cuts slow, weighty.
MUSIC: a quiet ARCHIVE motif (dust and ink, the weight of the written word); solemn resolve on honest,
  faint-disappointment-tinged on legend, complicit-tired on buried, alarmed on seize. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Megaton + the twin-ledger duality)
===============================================================================
- Zero combat (a deathbed choice about history).
- Rewards diverge (Megaton law): LEGEND = a shining name + a widening gap; HONEST = a true memory + no
  shield + a closed gap (integrity); BURIED = a kind legend + a resurfacing risk; SEIZE = control of all
  history + a propaganda engine + an enemy in Liri. The "reward" is how the FUTURE remembers you — the
  most abstract but longest-lasting stake in the bible.
- Core purpose: the RECORDED-VS-UNRECORDED duality (the whole game's twin-ledger canon) made a single
  explicit choice — the official record (legend) vs the Family Box (truth), and the pen that decides which
  survives. The honest route is the only one that CLOSES the gap; every other widens it (and the wider gap
  strains to resurface — ties Q042).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Makes the RECORDED ledger writable (this quest literally authors the official
history state) and sets the LEGEND-VS-TRUTH GAP (a fold-carried tension that interacts with Q042's
resurfacing + Q041's conceal). Reads ledger/ALL unrecorded flags/skill/fold; writes the official-record
state + the gap. Deterministic + save-through. Gate: all four routes resolve, honest CLOSES the gap,
legend/buried/seize WIDEN it, the gap interacts with Q042 resurfacing, seize creates the Liri-enemy +
propaganda engine, the recorded state persists to the fold. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-044)
The TWIN-LEDGER duality made explicit: the dying archivist offers the pen, forcing a choice between the
official RECORD (legend) and the Family Box TRUTH — write a flattering legend, an honest record, a buried
truth, or SEIZE the whole archive (author all history — a propaganda throne, Q037 link). The HONEST route
is the only one that closes the legend-truth gap; every other widens it and strains to resurface (Q042).
Makes the recorded-vs-unrecorded canon a single dramatic choice about who writes history. Bible at 45
(HALFWAY); the game's central duality now has a quest where the pen itself is the prize.
