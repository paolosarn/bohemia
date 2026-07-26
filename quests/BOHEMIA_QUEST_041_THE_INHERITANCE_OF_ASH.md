# BOHEMIA — QUEST 041: "THE INHERITANCE OF ASH"
Full production build. Built to the dialogue/scene spec; template = 001-040. Tier-1
PILLAR (opening of a NEW DYNASTY chapter) — the FIRST QUEST OF THE HEIR, the mirror-hinge to
Q040. Where 040 was the death and the passing, 041 is the WAKING: the heir opens the Family
Box and must reckon with the inheritance — the sins, the debts, the credential, the truth —
and decide what KIND of dynast they'll be. Name catalog-adjacent.

Design soul: you are now the ghost's child, holding their true history in your hands. The
new dynast opens the Box, meets the district as its heir (greeted per the prior dynasty's
reputation), and makes the first defining choice: honor the legacy, break from it, or hide it.
The generational loop's back half — consequence across time, now from the RECEIVING end.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_inheritance_of_ash
- tier: 1 (PILLAR; the new dynasty's opening — reads the Q040 Box + all passed flags)
- fold: the heir's first stance (honor / break / conceal) sets the new dynasty's initial
  reputation trajectory and how the district recalibrates around the new dynast.
- entry_conditions: immediately follows Q040; the heir opens the Family Box for the first time.
- faction_wires: ALL — the district reacts to the NEW dynast per the OLD one's reputation +
  district-order (Q039); factions test the heir.
- music_pool: the LEGACY motif reborn (the dynasty theme, same bones, new voice — a generational
  variation); tense as the district tests the heir; a determined open as they take the reins.
- ledger_writes: recorded[heir_first_stance_*]; UNRECORDED[what_you_did_with_the_truth];
  the new dynasty's initial reputation trajectory.
- amalgamation_thread: HIGH — the Box's Reconstruction knowledge + credential are now the HEIR's;
  the endgame is inherited, and the heir decides whether to pursue, ignore, or hide it.

===============================================================================
## 2. CAST
===============================================================================
- THE HEIR (id: heir) — the player's NEW character; opening the Box, reckoning with a parent they
  may have loved, feared, or barely known. default_emotion: unsteady_new.
- THE WITNESS (id: witness) — the old ally who kept the Box honest (recurring, e.g. Dr. Sama or a
  faction elder); now the heir's first counselor. default_emotion: faithful_watchful.
- A TESTING DELEGATE (id: tester) — a faction rep who comes to see if the new dynast is weak,
  worthy, or vengeance-worthy (per the old dynasty's rep). default_emotion: probing.
- THE OLD DYNAST (id: ghost) — present only through the Box: the unrecorded ledger, a letter, the
  last recorded truth (grace/warning/confession from Q040). A voice from the grave.
- THE PLAYER — reckons with the inheritance; every Q040 pass-down flag shapes the options.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
THE OPENING (open the Box, absorb the inheritance) -> the district TESTS the heir (a first
challenge colored by the old rep) -> a DEFINING FIRST STANCE: HONOR (continue the parent's path),
BREAK (repudiate their worst, forge a new line), or CONCEAL (hide the true history, rule on the
legend). Sets the new dynasty's trajectory. Reads the entire Q040 Box.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: heir  emotion: unsteady_new  gesture: lift_the_box_lid  camera: closeup
  music:{pool:LEGACY,cue:reborn_soft}
  line: "They said not to open it before they were gone. They're gone. ...Here's everything they
         really were, then. Not the legend the district tells. The TRUTH. My hands are shaking and
         I don't even know why. Let's see what I inherited. Let's see who I have to be now."
  -> goto box_open
node box_open
  speaker: ghost (via the Box — reads Q040's last truth)  emotion: n/a  camera: closeup_on_box  music:{pool:LEGACY,cue:voice_from_grave}
  line (if Q040 grace): "'If you're reading this, I'm gone and you're holding the dynasty. I passed
         it on honest, like I promised. Do better where you can. Forgive me where you can't.'"
  line (if Q040 warning): "'The thing under the Strip is real and it can be beaten. Everything I
         learned is in here. Finish what I couldn't.'"
  line (if Q040 confession): "'The worst thing I did is in here, and I told you to your face so you'd
         carry the lesson, not the guilt. Be better than my worst. That's all I ask.'"
  effect: surfaces the Q040 Box contents (credential/truth/curated/debts/Reconstruction) as the
    heir's actual inheritance; UNRECORDED ledger of the PRIOR dynasty now the heir's to reckon with
  -> goto reckon_hub
node reckon_hub (speaker: PLR/heir)  camera: over_shoulder_player
  choices:
   - "(Read the parent's sins — the heavy pages.)"      -> read_sins   [once]
   - "(Read the parent's graces — what they saved.)"     -> read_graces [once]
   - "(Take the district's first test.)"                 -> test_gate   [once]
   - "(Decide what kind of dynast you'll be.)"           -> stance_gate [after test]
node read_sins
  speaker: heir  emotion: reckoning  camera: closeup  micro_expression: hard_to_read
  line: (branches on the PRIOR dynasty's actual UNRECORDED flags — e.g.) "They folded a companion for
         a key. They marched the bounty too far. They enforced a dead man's debt on his kid. ...These
         are MY foundation now. Do I build on them, or tear them out? Can you even tear out a
         foundation and still stand?"
  effect: surfaces the specific inherited sins (from prior quests) — the heir must choose their
    relationship to them  -> goto reckon_hub
node read_graces
  speaker: heir  emotion: softening  camera: closeup  micro_expression: unexpected_warmth
  line: (branches on prior graces — e.g.) "They rowed a dying man to his crossing. They freed the
         wired ones. They forgave a debt that would've broken a kid. ...They weren't only their worst.
         Neither will I be. Maybe that's the inheritance that matters — not the credential. The proof
         it's POSSIBLE to choose well in a world like this."
  effect: surfaces the inherited graces — balances the sins  -> goto reckon_hub
node test_gate
  speaker: tester  emotion: probing  gesture: size_up_the_heir  camera: two_shot
  line (if prior dynasty FEARED — dominate/harm rep): "So you're the new one. Your parent ruled by the
         fist. We're here to see if the fist passed down, or if you're soft enough to push. Which is
         it?"
  line (if prior dynasty LOVED — coalition/grace rep): "Your parent earned this district's trust the
         hard way. We came to see if you'll honor it or squander it. The name opens the door. YOU have
         to walk through it. Well?"
  effect: a first challenge colored by inherited rep; the heir responds (strength/wisdom/warmth) —
    a proving beat that sets the district's initial read of the NEW dynast  -> goto reckon_hub

--- THE DEFINING FIRST STANCE ---
node stance_gate (speaker: PLR/heir)  camera: closeup  music:{pool:LEGACY,cue:hold}
  choices:
   - "(HONOR — continue the parent's path, sins and graces both.)"  -> route_honor
   - "(BREAK — repudiate their worst, forge a new line.)"            -> route_break
   - "(CONCEAL — hide the true history, rule on the legend.)"        -> route_conceal
node route_honor
  speaker: heir  emotion: resolved  camera: closeup  music:{pool:LEGACY,cue:continuation}
  line: "I'll carry it whole — what they got right AND what they got wrong, with my eyes open. Their
         path is my path, and I'll walk it further and cleaner. The Box stays honest. When it's my
         turn at the bedside, my heir reads the truth of me too."
  effect: the new dynasty CONTINUES the prior trajectory (district-order + rep carry forward, deepened);
    the honest-inheritance line holds (Q038/Q040 through-line: guilt carried as lesson); recorded[heir
    _honors]; UNRECORDED[carried_it_whole]=true; a stable continuation. -> END
node route_break
  speaker: heir  emotion: fierce_new  camera: closeup  music:{pool:LEGACY,cue:new_line}
  line: "No. I loved them, maybe, but I won't be them. The companion they folded, the debt they
         enforced — that ENDS with me. I'll keep the Box honest so I never forget what I'm breaking
         from. A new line, out of the old one's ashes. That's what inheritance is FOR — the chance to
         do it different."
  effect: the new dynasty BREAKS from the prior worst (repudiates specific inherited sins — can make
    public amends, e.g. free an enforced debtor, honor a folded companion's memory); rep RECALIBRATES
    (some factions relieved, some see weakness/betrayal of the line); recorded[heir_breaks]; UNRECORDED
    [broke_from_the_worst]=true; the atonement line (the Q038 forgiveness-precedent, chosen anew). -> END
node route_conceal
  speaker: heir  emotion: guarded  camera: closeup  micro_expression: box_closing
  line: "The district loves a legend and legends don't survive the truth. I'll rule on the story they
         already believe and bury the rest. The Box stays SHUT. ...I know what that makes me. I'm
         choosing it anyway. Some inheritances are safer unopened."
  effect: the heir CONCEALS the true history (rules on the legend); short-term stability on a false
    foundation; BUT the buried truth is a liability (hidden sins can surface — Q038 precedent: curated/
    hidden guilt has a cost; a later quest may unearth it); recorded[heir_conceals]; UNRECORDED[shut
    _the_box]=true; the fragile, legend-built order (the dynasty that lied to itself about itself). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- HONOR: continuity — the prior trajectory deepens; the honest Box-line holds; an heir-of-the-heir
  will inherit a clear, whole history (the healthiest generational chain).
- BREAK: a new line from the ashes — specific inherited sins repudiated/amended; rep recalibrates;
  the atonement path (the dynasty can CHANGE across generations — the game's hope).
- CONCEAL: a legend-built order on a buried truth — stable but fragile; the hidden sins are a
  time-bomb an heir may detonate (Q038 hidden-guilt cost).
- The heir's first stance sets the NEW dynasty's reputation trajectory, layered atop the inherited
  district-order (Q039) — the generational chain continues, each link reckoning with the last.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the heir's unsteady newness (hard_to_read at the sins, unexpected_warmth at the graces) — a
  fresh face wearing an inherited weight; the ghost speaks only through the Box (the prior dynast's
  recorded last truth — a voice, no face); the tester's probing appraisal. Procedural lip-sync.
BODY: the Box-opening is the key gesture (lift_the_box_lid — the inheritance made physical); a bedside/
  hearth setting; the test is a staged confrontation. No combat (a reckoning, not a battle) unless the
  test turns.
CAMERA: closeup on the heir + the Box (the intimate inheritance), closeup_on_box for the ghost's voice,
  two_shot for the test, a determined wide as the heir takes the reins. Cuts slow, then firming.
MUSIC: the LEGACY motif REBORN — same bones as Q040's theme, a new voice/instrumentation (the dynasty
  theme across generations); tense at the test; a determined continuation/new-line/guarded cue by
  stance. The generational variation IS the point (the theme ages and passes, like the dynasty). 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (the generational loop, receiving end)
===============================================================================
- Zero required combat (a reckoning); the pillar is consequence + character.
- "Rewards" diverge as the NEW dynasty's trajectory: HONOR = continuity + a clean chain; BREAK =
  atonement + recalibration + the change-across-generations hope; CONCEAL = fragile legend-stability +
  a buried time-bomb. The inheritance (credential, Reconstruction knowledge, rep) is the same; what
  differs is the RELATIONSHIP the heir chooses to it.
- Core purpose: the SUCCESSION LOOP's receiving end — Q040 was the passing, 041 is the WAKING. Together
  they close the generational hinge and prove the signature mechanic in BOTH directions: you die and
  choose what to pass; you wake and choose what to do with what you were passed. "Consequence across
  time" from both ends of the grave.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON as the NEW-DYNASTY OPENING — reads the Q040 Box contents + all passed flags +
district-order, and writes the new dynasty's initial reputation trajectory + the heir's stance. The
mirror-hinge to Q040. Reads the entire passed-down state; writes the heir's opening trajectory.
Deterministic + save-through. Gate: the Box surfaces Q040's actual contents + last-truth, sins/graces
read from real prior flags, the test reads inherited rep, all three stances resolve, the trajectory +
conceal-time-bomb persist, the LEGACY motif reborn plays. Joins the suite. (Mirror-hinge: 040 hands off,
041 receives.)

## 9. WHAT THIS PROVES (vs 001-040)
The SUCCESSION LOOP's RECEIVING END — the mirror-hinge to Q040: the heir opens the Family Box, reckons
with the inherited sins/graces/credential/Reconstruction, is tested by the district per the old rep, and
chooses a defining first stance (honor/break/conceal). Together 040+041 close the generational hinge and
prove the signature mechanic in BOTH directions (the passing AND the waking). The BREAK route proves the
dynasty can CHANGE across generations (the game's hope); CONCEAL plants a buried-guilt time-bomb (Q038
cost). Bible at 41; the generational loop is now complete end-to-end — death, passing, waking, reckoning.
