# BOHEMIA QUESTBOOK — DEEP DIVE 117: THE BOSS WHO WON'T LET YOU LOSE / A DOG STOLE MY SPECIAL ATTACK (Papyrus, Undertale)
Full teardown, the whole enchilada: the boss fight that refuses to kill you, refuses to be killed, gives up
and lets you past if you fail three times, loses its climactic move to a dog, and — if you murder him —
spends its dying breath insisting you can do better. Complete event flow, the capture, the blue SOUL, the
flirt, the dog, the mercy, the three-loss rule, the honest flaws, and Bohemia ports. STARTLINGLY relevant to
our PACIFIST LAW, our combat dial, our difficulty packages, our conscience system, our companions, + our ART
PHILOSOPHY. Toby Fox, solo. Reference only; Paolo does not read it. No Bohemia quest written here.

Quest: the Papyrus battle, Undertale (2015). "**YOU ARE A HUMAN! I MUST CAPTURE YOU! THEN, I CAN FULFILL MY
LIFELONG DREAM!!! POWERFUL! POPULAR! PRESTIGIOUS!!! **THAT'S PAPYRUS!!!** THE NEWEST MEMBER... OF THE ROYAL
GUARD!**"

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- THE BOSS WILL NOT LET YOU DIE (the thesis — STARTLINGLY our PACIFIST LAW + combat dial + difficulty
  packages): "**THE PROTAGONIST STARTS THE BATTLE WITH MAXIMUM HP, EVEN IF IT WAS PREVIOUSLY DIMINISHED BY
  OTHER ENEMIES. **WHEN THE PROTAGONIST WOULD OTHERWISE RECEIVE FATAL DAMAGE, THEIR HP IS SET TO 1 AND
  PAPYRUS PUTS AN END TO THE FIGHT PREMATURELY.**"
  - He heals you before the fight starts. He **cannot kill you.** He isn't holding back as a difficulty
    setting — **he doesn't want to hurt you, he wants to catch you**, and the code enforces his character
    (STARTLINGLY our PACIFIST LAW + combat dial + death-math; the boss whose values are in the damage
    formula).
- AND IF YOU KEEP LOSING, HE JUST LETS YOU GO (the mercy — direct for our difficulty packages): "**IF THE
  PROTAGONIST LOSES TO HIM THREE TIMES, **PAPYRUS GROWS TIRED OF CAPTURING THEM AND OFFERS THEM THE OPTION TO
  SKIP HIS BATTLE AND PROGRESS TO THE NEXT AREA.**"
  - Punk — **the boss offers you an accessibility option, in character, as a joke about his own
    incompetence.** Not a menu. Not a difficulty slider. **The antagonist gets bored and waves you
    through** (STARTLINGLY our difficulty packages + combat dial + ART PHILOSOPHY; the skip that is a
    characterization).
  - And his capture dialogue on each loss is the joke: after the first, "**WELL!!! YOU MAY HAVE CLEVERLY
    ESCAPED FROM JAIL BEFORE... BUT THIS TIME, I'VE UPGRADED THE FACILITIES. **NOT ONLY WILL YOU BE
    TRAPPED... BUT YOU WON'T EVEN WANT TO LEAVE!!!**" After the second: "**YOU ARE... PERSISTENT! BUT! IT
    JUST WON'T WORK ON ME! I AM THE PERSISTENTEST!**"
- AND MERCY IS SOMETHING HE TEACHES YOU BY DOING IT FIRST (the design — STARTLINGLY our PACIFIST LAW +
  conscience system): "**THEREFORE I, THE GREAT PAPYRUS, **ELECT TO GRANT YOU PITY!! I WILL SPARE YOU,
  HUMAN!!! NOW'S YOUR CHANCE TO ACCEPT MY MERCY.**"
  - He spares **you.** The boss uses the mechanic on the player. **He demonstrates the verb** (cf. our
    PACIFIST LAW + combat dial + ART PHILOSOPHY).

===============================================================================
## 1. THE FULL EVENT FLOW (stage by stage)
===============================================================================

### STAGE 0 — THE PREMISE IS A JOB APPLICATION
- "**I MUST CAPTURE YOU! THEN, I CAN FULFILL MY LIFELONG DREAM!!! POWERFUL! POPULAR! PRESTIGIOUS!!!**"
- He isn't trying to kill a human. **He's trying to get a job.** The entire threat is a man's career
  ambition, and his stated goals are, in order: powerful, popular, prestigious. That's the character and the
  joke and the tragedy in one line (cf. our standing + faction web + entities + ART PHILOSOPHY).
- And where he'd put you: "**I WILL NOW SEND YOU TO THE CAPTURE ZONE!! OR, AS SANS CALLS IT... **OUR
  GARAGE???** YOU'RE IN THE DOGHOUSE NOW!**"
### STAGE 1 — THE FIRST ATTACK IS DESIGNED TO MISS
- "**IF THE PROTAGONIST ACTS TO PAPYRUS AT THE BEGINNING OF THE FIGHT, HIS BONE ATTACKS SLOWLY SCROLL ACROSS
  THE BOTTOM, SOMETIMES PROGRESSIVELY RISING OR LOWERING IN HEIGHT. **HOWEVER, THE BONES ARE NOT HIGH ENOUGH
  TO HIT THE PROTAGONIST'S RED SOUL IF THE SOUL STAYS IN THE MIDDLE AND, AS A RESULT, ARE EASY TO DODGE.
  PAPYRUS CONTINUES USING THIS ATTACK UNTIL SPARE OR FIGHT IS CHOSEN.**"
- **If you refuse to fight, he throws bones that literally cannot reach you, forever, until you decide
  something.** The game will wait. The attack is a holding pattern with a character inside it (STARTLINGLY
  our combat dial + PACIFIST LAW + 120 BPM law; the attack that is a conversation).
### STAGE 2 — THE FIGHT IS A TUTORIAL AND HE'S THE TEACHER
- "**HIS BATTLE INTRODUCES THE LIGHT BLUE ATTACK TYPE AND BLUE SOUL MODE.**" And he announces it like a
  magic trick: "**THEN, LET'S SEE IF YOU CAN HANDLE MY FABLED 'BLUE ATTACK!' ... **YOU'RE BLUE NOW. THAT'S MY
  ATTACK!** NYEH HEH HEH HEH!!!**"
- "**HE TURNS YOUR SOUL BLUE, WHICH CAUSES IT TO BE AFFECTED BY GRAVITY AND FORCES YOU TO JUMP OVER HIS
  BONES.**"
- And then — **he teaches you the controls, mid-fight, because you flirted with him**: "**[AFTER FLIRT] **TRY
  HOLDING THE 'UP' BUTTON TO JUMP!!!**"
- **The boss gives you the tutorial for beating him because you were nice to him** (STARTLINGLY our combat
  dial + difficulty packages + companions + PACIFIST LAW; the enemy who coaches you).
### STAGE 3 — THE FLIRT (the fight has a date in it)
- Flirting is a valid ACT. His response: "**HMMM... **I WONDER WHAT I SHOULD WEAR...**"
- And it changes his dialogue for the rest of the fight, including his threats: "**AND DATING MIGHT BE KIND
  OF HARD... AFTER YOU'RE CAPTURED AND SENT AWAY.**"
- **The man trying to imprison you is worrying about what to wear on your date** (cf. our companions +
  standing + conscience system).
### STAGE 4 — THE SPECIAL ATTACK BUILDUP (five turns of announcing it)
- Turn 14: "**GIVE UP OR FACE MY... SPECIAL ATTACK!!!**"
- Turn 15: "**YEAH!!! VERY SOON I WILL USE MY SPECIAL ATTACK!**"
- Turn 16: "**NOT TOO LONG AND I WILL USE THAT SPECIAL ATTACK!!!**"
- Turn 17: "**THIS IS YOUR LAST CHANCE... BEFORE MY SPECIAL ATTACK!!**"
- Turn 18: "**... BEHOLD...! MY SPECIAL ATTACK!**"
- **Five consecutive turns of a man hyping his own finisher.** The dread is real, the pacing is real, the
  buildup is textbook (cf. our combat dial + 120 BPM law + scheduler).
### STAGE 5 — AND A DOG TAKES IT
- "**WHAT THE HECK! **THAT'S MY SPECIAL ATTACK!** HEY! YOU STUPID DOG! ... STOP MUNCHING ON THAT BONE!!!
  HEY!!! WHAT ARE YOU DOING!!! **COME BACK HERE WITH MY SPECIAL ATTACK!!!**"
- Then, with total composure: "**OH WELL. **I'LL JUST USE A REALLY COOL REGULAR ATTACK.**"
- And here's the craft: "**HE CONTINUES THE BATTLE WITH AN 'ABSOLUTELY NORMAL ATTACK', **WHICH IS MORE
  DIFFICULT THAN ANY PREVIOUS ATTACK.**"
- **The joke attack is the hardest attack in the fight.** The punchline and the difficulty spike are the same
  object (STARTLINGLY our combat dial + difficulty packages + ART PHILOSOPHY; the gag that is also the
  mechanical peak).
- Its contents: "**THE APPEARANCE OF BONE ATTACKS SEEN EARLIER IN THE BATTLE, THE DOG (3 DAMAGE), **BONES
  SPELLING 'COOL DUDE'**, A BONE ON A SKATEBOARD (2 DAMAGE), AND A LARGE CROWD OF BONES (3 DAMAGE PER GROUP,
  2 FOR FINAL BONE) THAT CAN BE JUMPED OVER TO A FAR HIGHER LEVEL THAN THE BLUE SOUL CAN USUALLY REACH,
  **ENDING WITH A SMALL BONE THAT MOVES COMICALLY SLOW (2 DAMAGE).**"
- **It's his longest and most unique attack**, it's a greatest-hits reprise, it spells "COOL DUDE" at you, it
  contains the dog that robbed him, and it ends with one tiny bone crawling across the screen. And **it still
  deals damage** (cf. our combat dial + difficulty packages + FACTORY LAW).
### STAGE 6 — THE SURRENDER (he loses and reframes it as generosity)
- "**WELL...! *HUFF* IT'S CLEAR... YOU CAN'T! *HUFF* DEFEAT ME!!! YEAH!!! I CAN SEE YOU SHAKING IN YOUR
  BOOTS!!! **THEREFORE I, THE GREAT PAPYRUS, ELECT TO GRANT YOU PITY!! I WILL SPARE YOU, HUMAN!!! NOW'S YOUR
  CHANCE TO ACCEPT MY MERCY.**"
- He's out of breath. He can't win. He can't lose. So he **declares victory and pardons you** (STARTLINGLY
  our PACIFIST LAW + conscience system + standing; the loss reframed as a gift).
- And if you keep sparing him instead: "**NYOO HOO HOO... **I CAN'T EVEN STOP SOMEONE AS WEAK AS YOU...
  UNDYNE'S GOING TO BE DISAPPOINTED IN ME. I'LL NEVER JOIN THE ROYAL GUARD... AND... MY FRIEND QUANTITY WILL
  REMAIN STAGNANT!** ... WELL THEN... ... **I GUESS I CAN MAKE AN ALLOWANCE FOR YOU!**"
- **"My friend quantity will remain stagnant."** He counts them. He has a number and it isn't going up (cf.
  our standing + companions + despair-with-a-thread-of-hope).
### STAGE 7 — AND IF YOU KILL HIM, HE FORGIVES YOU MID-DECAPITATION
- "**ALAS, POOR PAPYRUS! WELL, AT LEAST I STILL HAVE MY HEAD!**"
- Then, dying: "**W-WELL, THAT'S NOT WHAT I EXPECTED... ... ST... STILL! **I BELIEVE IN YOU! YOU CAN DO A
  LITTLE BETTER! EVEN IF YOU DON'T THINK SO! I... I PROMISE...**"
- Punk — **he uses his last words to encourage the person murdering him**, and he doesn't manage to finish
  the sentence. That's the most quoted death in the game and it's four lines long (STARTLINGLY our
  conscience system + death-math + companions + despair-with-a-thread-of-hope + ART PHILOSOPHY).
### STAGE 8 — THE GENOCIDE ROUTE (he refuses to fight the monster you've become)
- "**ON THE GENOCIDE ROUTE, **PAPYRUS REFUSES TO FIGHT. HE INSTEAD SPARES THE PROTAGONIST, AS HE WANTS TO
  BEFRIEND AND TUTOR THEM.**"
- You've killed everything in two areas. He knows. **He opens with mercy anyway**, because he thinks you can
  be fixed.
- And if you take it: "**WOWIE!! YOU DID IT!!! **YOU DIDN'T DO A VIOLENCE!!** TO BE HONEST, I WAS A LITTLE
  AFRAID... BUT **YOU'RE ALREADY BECOMING A GREAT PERSON! I'M SO PROUD I COULD CRY!!!** ... WAIT, WASN'T I
  SUPPOSED TO CAPTURE YOU...? **WELL, FORGET IT! I JUST WANT YOU TO BE THE BEST PERSON YOU CAN BE.** SO LET'S
  LET BYBONES BE BYBONES.**"
- **"You didn't do a violence."** The grammar is broken because he's that happy. **A boss can talk a player
  out of a genocide run** — and the game's own wiki logs it as a state: "**IF PAPYRUS MANAGES TO CONVINCE THE
  PLAYER NOT TO CONTINUE THEIR NO MERCY ROUTE**" (STARTLINGLY our conscience system + PACIFIST LAW +
  Liberate/Respect/Become + ART PHILOSOPHY; the NPC who argues you out of your build).
### STAGE 9 — AND THE JOKE HAS A SAD ENGINE UNDER IT
- If he ends up king: "**IF HE BECOMES KING IN THE NEUTRAL ENDING, **SANS ENDS UP DOING MOST OF THE ACTUAL
  WORK RUNNING THE COUNTRY TO SPARE HIM FROM THE PRESSURE OF POLITICS.**"
- His brother quietly runs the government so Papyrus never finds out he can't (cf. our fold + companions +
  city-builder + despair-with-a-thread-of-hope).

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- THE FIGHT IS TRIVIAL AND THAT'S THE COST OF THE JOKE: he heals you, he can't kill you, his opening attack
  can't reach you, and he coaches you. LESSON (ours, double-edged): a boss who embodies mercy mechanically
  has **no tension**, and Undertale pays for it — Papyrus is beloved and his fight is remembered for the
  writing, not the play. Our combat dial can't buy character with zero stakes.
- THE THREE-LOSS SKIP IS UNDISCOVERABLE UNLESS YOU'RE BAD: "**IF THE PROTAGONIST LOSES TO HIM THREE TIMES...
  OFFERS THEM THE OPTION TO SKIP HIS BATTLE.**" The best-written accessibility feature in the medium is
  invisible to anyone competent. LESSON: a mercy rule nobody sees is still worth building, but don't count
  it as content.
- THE DIALOGUE VOLUME IS ENORMOUS FOR ONE FIGHT: unique lines for flirt, spare, fight, first capture, second
  capture, 1 HP, genocide-spare, genocide-kill, turn-by-turn special-attack buildup across 18 turns. LESSON
  (ours, FACTORY LAW): this is one man's throughput on one boss — our quest factory should count how many
  BRANCHES a single encounter needs before we scope 100 of them.
- "IT'S ALL ABOUT ME": TV Tropes, honestly — "**FALLS FIRMLY INTO THIS. HE EVEN FEELS LIKE THE HUMAN CHILD'S
  ENTIRE JOURNEY WAS TO GET HIM INTO THE ROYAL GUARD.**" The comedy is a narcissist who's also the kindest
  character in the game. LESSON (double-edged): a joke character carrying your moral thesis means half the
  audience laughs through the point.
- THE ATTACK'S DIFFICULTY SPIKE IS UNSIGNPOSTED: the "absolutely normal attack" is "**MORE DIFFICULT THAN ANY
  PREVIOUS ATTACK**" and arrives as a punchline. Players die to a gag. LESSON: if your hardest moment is
  also your funniest, some players read the death as unfair rather than funny.
- HE CANNOT ACTUALLY LOSE, SO HIS DEATH REQUIRES YOUR EFFORT: killing Papyrus takes deliberate, repeated,
  informed violence against someone who won't hurt you. LESSON (ours, this is the DESIGN not a flaw, but
  bank it): if you want the player to feel a killing, make the victim decline to defend themselves — and be
  ready for the audience that does it anyway to see what happens.

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. THE BOSS WILL NOT LET YOU DIE: "**WHEN THE PROTAGONIST WOULD OTHERWISE RECEIVE FATAL DAMAGE, THEIR HP IS
    SET TO 1 AND PAPYRUS PUTS AN END TO THE FIGHT PREMATURELY**" (cf. our PACIFIST LAW + combat dial).
W2. LOSE THREE TIMES AND HE WAVES YOU THROUGH: "**PAPYRUS GROWS TIRED OF CAPTURING THEM AND OFFERS THEM THE
    OPTION TO SKIP HIS BATTLE**" (cf. our difficulty packages + ART PHILOSOPHY).
W3. THE OPENING ATTACK CANNOT REACH YOU IF YOU DON'T FIGHT: "**THE BONES ARE NOT HIGH ENOUGH TO HIT THE
    PROTAGONIST'S RED SOUL IF THE SOUL STAYS IN THE MIDDLE**" (cf. our combat dial + PACIFIST LAW).
W4. THE ENEMY COACHES YOU MID-FIGHT: "**[AFTER FLIRT] TRY HOLDING THE 'UP' BUTTON TO JUMP!!!**" (cf. our
    combat dial + companions).
W5. FIVE TURNS OF HYPING HIS OWN FINISHER: "**VERY SOON I WILL USE MY SPECIAL ATTACK!... THIS IS YOUR LAST
    CHANCE... BEFORE MY SPECIAL ATTACK!!**" (cf. our combat dial + 120 BPM law).
W6. A DOG STEALS THE CLIMAX AND THE REPLACEMENT IS THE HARDEST ATTACK: "**I'LL JUST USE A REALLY COOL REGULAR
    ATTACK**" / "**AN 'ABSOLUTELY NORMAL ATTACK', WHICH IS MORE DIFFICULT THAN ANY PREVIOUS ATTACK**" (cf.
    our combat dial + difficulty packages).
W7. HE DEMONSTRATES THE VERB: "**I WILL SPARE YOU, HUMAN!!! NOW'S YOUR CHANCE TO ACCEPT MY MERCY**" (cf. our
    PACIFIST LAW + conscience system).
W8. HE COUNTS HIS FRIENDS: "**MY FRIEND QUANTITY WILL REMAIN STAGNANT!**" (cf. our standing + companions).
W9. HIS LAST WORDS ARE ENCOURAGEMENT FOR HIS MURDERER: "**ST... STILL! I BELIEVE IN YOU! YOU CAN DO A LITTLE
    BETTER! EVEN IF YOU DON'T THINK SO! I... I PROMISE...**" (cf. our death-math +
    despair-with-a-thread-of-hope).
W10. A BOSS CAN TALK YOU OUT OF YOUR GENOCIDE RUN: "**WOWIE!! YOU DID IT!!! YOU DIDN'T DO A VIOLENCE!!**" (cf.
     our conscience system + Liberate/Respect/Become).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — the boss who refuses to hurt you
===============================================================================
Punk, our PACIFIST LAW has been looking for its patron saint and this is him. Every other quest in this book
teaches mercy by making it expensive. **Papyrus teaches it by doing it to you first.**
- W1/W3/W7 (the boss will not let you die + the opening attack cannot reach you + he demonstrates the verb —
  our PACIFIST LAW + combat dial + conscience system): the top port. **He heals you to full before the fight
  starts.** "**WHEN THE PROTAGONIST WOULD OTHERWISE RECEIVE FATAL DAMAGE, THEIR HP IS SET TO 1 AND PAPYRUS
  PUTS AN END TO THE FIGHT PREMATURELY.**" That's not a difficulty tuning pass — **his character is in the
  damage formula.** And if you refuse to fight, his bones "**ARE NOT HIGH ENOUGH TO HIT THE PROTAGONIST'S RED
  SOUL IF THE SOUL STAYS IN THE MIDDLE,**" forever, until you choose. And then **he spares YOU first**:
  "**I WILL SPARE YOU, HUMAN!!! NOW'S YOUR CHANCE TO ACCEPT MY MERCY.**" Our combat dial + PACIFIST LAW: at
  least one enemy in Bohemia must be **mechanically incapable of killing the dynast**, and the player has to
  discover that by fighting them (ties our PACIFIST LAW + combat dial + difficulty packages + death-math +
  conscience system + companions + standing + faction web + ART PHILOSOPHY; a top-tier port).
- W2/W4 (lose three times and he waves you through + the enemy coaches you mid-fight — our difficulty
  packages + combat dial): STEAL both, they're our accessibility answer. **"If the protagonist loses to him
  three times, Papyrus grows tired of capturing them and offers them the option to skip his battle."** The
  boss offers the accessibility option **in character, as a joke about his own incompetence.** No menu, no
  slider, no shame. And: "**[AFTER FLIRT] TRY HOLDING THE 'UP' BUTTON TO JUMP!!!**" — **the boss teaches you
  the tutorial for beating him because you were nice to him.** Our difficulty packages are five tiers in a
  menu. **This is the version where the game's kindness is a character trait** (ties our difficulty packages
  + combat dial + PACIFIST LAW + companions + quest factory + ART PHILOSOPHY + despair-with-a-thread-of-hope).
- W5/W6 (five turns of hyping his own finisher + a dog steals the climax and the replacement is the hardest
  attack — our combat dial + difficulty packages + 120 BPM law): bank both, this is pure combat-dial craft.
  **Five consecutive turns of escalating buildup** — "**VERY SOON I WILL USE MY SPECIAL ATTACK!**" → "**THIS
  IS YOUR LAST CHANCE...**" → "**BEHOLD...!**" — and then **a dog takes it.** "**OH WELL. I'LL JUST USE A
  REALLY COOL REGULAR ATTACK.**" And the craft: the replacement is "**MORE DIFFICULT THAN ANY PREVIOUS
  ATTACK,**" it's his longest, it spells **COOL DUDE** at you, it contains **the dog that robbed him**, and
  it ends with **one tiny bone crawling across the screen for 2 damage.** **The punchline and the difficulty
  peak are the same object.** Our dial's 52 patterns already know that a pattern must do something
  genuinely different — this is the proof that the funniest one can also be the hardest (ties our combat dial
  + difficulty packages + 120 BPM law + scheduler + FACTORY LAW + ART PHILOSOPHY).
- W9/W10/W8 (his last words are encouragement for his murderer + a boss can talk you out of your genocide run
  + he counts his friends — our conscience system + death-math + despair-with-a-thread-of-hope +
  Liberate/Respect/Become): bank all three, they're the heart. (a) Dying: "**ST... STILL! I BELIEVE IN YOU!
  YOU CAN DO A LITTLE BETTER! EVEN IF YOU DON'T THINK SO! I... I PROMISE...**" **He uses his last words to
  encourage the person killing him and doesn't finish the sentence.** (b) On the genocide route he **refuses
  to fight**, opens with mercy, and if you take it: "**WOWIE!! YOU DID IT!!! YOU DIDN'T DO A VIOLENCE!!... I
  JUST WANT YOU TO BE THE BEST PERSON YOU CAN BE.**" **An NPC can argue the player out of their own build.**
  Our Liberate/Respect/Become should have at least one person who tries. (c) And: "**MY FRIEND QUANTITY WILL
  REMAIN STAGNANT!**" **He counts them.** Our standing should let one character's number be visibly, sadly
  small (ties our conscience system + death-math + companions + standing + fold + Liberate/Respect/Become +
  PACIFIST LAW + persistent consequence + ART PHILOSOPHY + despair-with-a-thread-of-hope).
- THE PREMISE + THE FLIRT (our standing + companions + entities): bank both. (a) **The threat is a job
  application.** "**I MUST CAPTURE YOU! THEN, I CAN FULFILL MY LIFELONG DREAM!!! POWERFUL! POPULAR!
  PRESTIGIOUS!!!**" He's not trying to kill a human, he's trying to make the Royal Guard, and the "capture
  zone" is — as his brother calls it — "**OUR GARAGE???**" Our 13 factions are full of people whose menace is
  really a career. (b) And **flirting is a valid combat action**: "**HMMM... I WONDER WHAT I SHOULD
  WEAR...**" and later, as a threat, "**AND DATING MIGHT BE KIND OF HARD... AFTER YOU'RE CAPTURED AND SENT
  AWAY**" (ties our standing + companions + faction web + entities/spawning + conscience system + combat dial
  + quest factory + ART PHILOSOPHY).
- FLAWS (bank HARD): (a) OURS, DOUBLE-EDGED — A BOSS WHO EMBODIES MERCY MECHANICALLY HAS NO TENSION: Papyrus
  is beloved for his writing, not his fight; our combat dial cannot buy character with zero stakes; (b) a
  mercy rule nobody sees is worth building but isn't content (the three-loss skip is invisible to anyone
  competent); (c) OURS, FACTORY LAW — count the BRANCHES before scoping the volume: one boss needs unique
  lines for flirt / spare / fight / first capture / second capture / 1 HP / genocide-spare / genocide-kill /
  18 turns of buildup; (d) a joke character carrying your moral thesis means half the audience laughs
  through the point ("**IT'S ALL ABOUT ME: FALLS FIRMLY INTO THIS**"); (e) if your hardest moment is also
  your funniest, some players read the death as unfair rather than funny; and (f) BANK AS DESIGN, NOT FLAW —
  if you want the player to feel a killing, **make the victim decline to defend themselves**, and be ready
  for the audience that does it anyway just to see.

---
# V2 PAYLOAD — BACKFILLED 7/16/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**PAPYRUS** — wants to capture a human, join the Royal Guard, be admired, and make a friend — and when the wants collide, friendship wins EVERY collision without him ever noticing there was one. Will trade: his special attack (to a dog), his victory (reframed as generosity), his life (forgiving mid-decapitation). Will never say: an unkind sentence; the register is structurally locked. FUNCTION: the boss who spares YOU first — the enemy design that proves an encounter can be a friendship application with an HP bar.

**THE ANNOYING DOG** — wants the bone. Takes the special attack (five turns announced) FUNCTION: anticlimax as mercy — the game defuses its own crescendo so the fight can end in a date instead of a detonation.

**THE PLAYER'S PATIENCE** — the real stat. FUNCTION: the three-loss rule reads it: fail three times and he lets you past. LOSING FORWARD as institutional policy.

## V2-B THE CONVERSATIONS (node trees; the fight IS the conversation — bullet patterns are his dialogue)

NODE: THE_FIGHT — entry: the bridge
  His attacks are utterances: the first is DESIGNED TO MISS (a greeting); the blue SOUL is a rule taught mid-sentence; the difficulty curve is him warming to you.
  > (fight)       [gate: none] -> he dodges, worried FOR you
  > (flirt)       [gate: none] -> THE DATE OPENS — the fight contains a romance branch, played straight-faced
  > (spare, repeatedly) [gate: none] DEED-LOOP -> mercy as persistence: the option must be chosen many times to mean it
  > (lose, three times) [gate: none] FAIL-FORWARD-LAW -> he lets you past: THE THREE-LOSS RULE — the gate gives up before the player does. Bohemia's dial packages already encode difficulty mercy; this is the narrative version: any Bohemia gatekeeper fight should have a loss-count door. [PENDING, Paolo's call.]
  NOVERB: (humiliate him) — NO OPTION EXISTS that lands as contempt; even "fight" reads to him as enthusiasm. The register-lock IS the character: some NPCs should be written so no player verb can reach cruelty through them — the interface protects the innocent. Cross-ref Q126 PORT 7 (no comfort verbs): this is the mirror law — NO CRUELTY VERBS, for exactly one character per game, and it should be the one everyone loves.

NODE: THE_KILL — entry: genocide-register
  He spares you FIRST, believes in you WHILE the blow lands, forgives mid-decapitation.
  THE FINDING: the game's harshest judgment of the player is delivered as UNCONDITIONAL FAITH — no scold, no meter, just a person being better than you while you end him. The conscience system's outer limit: judgment as kindness withheld from nothing.

## V2-C THE BRANCH MAP

COUNT: 3 (befriended via date / passed via three losses / killed) — every branch ends with him thinking well of you, which is the point and the wound.
STRUCTURAL FINDING: THE BOSS WHO WON'T LET YOU LOSE and won't let you be hated. Bohemia gets exactly one Papyrus-register character across the arc (cf. Q10's one-Strange-Man rule — the singletons are a set now: one mystery, one innocent). [PENDING, Paolo's call.]

## SOURCES
Undertale Wiki (Fandom) "Papyrus/In Battle" (the mercy mechanics — "**THE PROTAGONIST STARTS THE BATTLE WITH
MAXIMUM HP, EVEN IF IT WAS PREVIOUSLY DIMINISHED BY OTHER ENEMIES. WHEN THE PROTAGONIST WOULD OTHERWISE RECEIVE
FATAL DAMAGE, THEIR HP IS SET TO 1 AND PAPYRUS PUTS AN END TO THE FIGHT PREMATURELY. IF THE PROTAGONIST LOSES TO
HIM THREE TIMES, PAPYRUS GROWS TIRED OF CAPTURING THEM AND OFFERS THEM THE OPTION TO SKIP HIS BATTLE AND PROGRESS
TO THE NEXT AREA**"; the routes — "**PAPYRUS IS THE SECOND BOSS OF THE NEUTRAL AND PACIFIST ROUTES. AFTER
SNOWDIN, PAPYRUS BEGINS AN ENCOUNTER TO CAPTURE THE PROTAGONIST. PAPYRUS ATTACKS WITH BONES OF VARYING LENGTHS.
HIS BATTLE INTRODUCES THE BLUE SOUL MODE. ON THE GENOCIDE ROUTE, PAPYRUS REFUSES TO FIGHT. HE INSTEAD SPARES THE
PROTAGONIST, AS HE WANTS TO BEFRIEND AND TUTOR THEM**"; the opening attack — "**IF THE PROTAGONIST ACTS TO
PAPYRUS AT THE BEGINNING OF THE FIGHT, HIS BONE ATTACKS SLOWLY SCROLL ACROSS THE BOTTOM, SOMETIMES PROGRESSIVELY
RISING OR LOWERING IN HEIGHT. HOWEVER, THE BONES ARE NOT HIGH ENOUGH TO HIT THE PROTAGONIST'S RED SOUL IF THE
SOUL STAYS IN THE MIDDLE AND, AS A RESULT, ARE EASY TO DODGE. PAPYRUS CONTINUES USING THIS ATTACK UNTIL SPARE OR
FIGHT IS CHOSEN. THIS ATTACK DEALS 4 DAMAGE PER HIT**"; the special attack — "**PAPYRUS EVENTUALLY PREPARES A
SPECIAL ATTACK. HOWEVER, A DOG STEALS IT, AND HE CONTINUES THE BATTLE WITH AN 'ABSOLUTELY NORMAL ATTACK', WHICH IS
MORE DIFFICULT THAN ANY PREVIOUS ATTACK. THE ATTACK INCLUDES THE APPEARANCE OF BONE ATTACKS SEEN EARLIER IN THE
BATTLE, THE DOG (3 DAMAGE), BONES SPELLING 'COOL DUDE', A BONE ON A SKATEBOARD (2 DAMAGE), AND A LARGE CROWD OF
BONES (3 DAMAGE PER GROUP, 2 FOR FINAL BONE) THAT CAN BE JUMPED OVER TO A FAR HIGHER LEVEL THAN THE BLUE SOUL CAN
USUALLY REACH, ENDING WITH A SMALL BONE THAT MOVES COMICALLY SLOW (2 DAMAGE). AFTER SURVIVING THIS ATTACK, PAPYRUS
DECIDES TO SPARE THE PROTAGONIST**"; and the full battle dialogue — "**YOU ARE A HUMAN! I MUST CAPTURE YOU! THEN,
I CAN FULFILL MY LIFELONG DREAM!!! POWERFUL! POPULAR! PRESTIGIOUS!!! THAT'S PAPYRUS!!! THE NEWEST MEMBER... OF THE
ROYAL GUARD!... I WILL NOW SEND YOU TO THE CAPTURE ZONE!! OR, AS SANS CALLS IT... OUR GARAGE??? YOU'RE IN THE
DOGHOUSE NOW! NYEH HEH HEH HEH HEH HEH HEH!!!... SO YOU'RE SERIOUS... [FIGHT] SO YOU WON'T FIGHT... [MERCY OR
MISS] THEN, LET'S SEE IF YOU CAN HANDLE MY FABLED 'BLUE ATTACK!' ... YOU'RE BLUE NOW. THAT'S MY ATTACK!... WELL!!!
YOU MAY HAVE CLEVERLY ESCAPED FROM JAIL BEFORE... BUT THIS TIME, I'VE UPGRADED THE FACILITIES. NOT ONLY WILL YOU BE
TRAPPED... BUT YOU WON'T EVEN WANT TO LEAVE!!!... YOU ARE... PERSISTENT! BUT! IT JUST WON'T WORK ON ME! I AM THE
PERSISTENTEST! AND IF YOU THINK YOU ARE PERSISTENESTER... THAT IS WRONG! GRAMATICALLY WRONG! BECAUSE THE CORRECT
FORM WOULD BE... NOT AS PERSISTENTEST AS PAPYRUS, THE PERSISTENTESTEST! I HOPE YOU ENJOYED THIS LESSON... HMMM... I
WONDER WHAT I SHOULD WEAR... [AFTER FLIRT] TRY HOLDING THE 'UP' BUTTON TO JUMP!!!... AND DATING MIGHT BE KIND OF
HARD... AFTER YOU'RE CAPTURED AND SENT AWAY. [TURN 13] [AFTER FLIRT] URGH... WHO CARES! GIVE UP!! [TURN 14] GIVE UP
OR FACE MY... SPECIAL ATTACK!!! [TURN 15] YEAH!!! VERY SOON I WILL USE MY SPECIAL ATTACK! [TURN 16] NOT TOO LONG
AND I WILL USE THAT SPECIAL ATTACK!!! [TURN 17] THIS IS YOUR LAST CHANCE... BEFORE MY SPECIAL ATTACK!! [TURN 18]...
BEHOLD...! MY SPECIAL ATTACK! WHAT THE HECK! THAT'S MY SPECIAL ATTACK! HEY! YOU STUPID DOG! ... STOP MUNCHING ON
THAT BONE!!! HEY!!! WHAT ARE YOU DOING!!! COME BACK HERE WITH MY SPECIAL ATTACK!!! ... I'LL JUST USE A REALLY COOL
REGULAR ATTACK. ... WELL...! *HUFF* IT'S CLEAR... YOU CAN'T! *HUFF* DEFEAT ME!!! YEAH!!! I CAN SEE YOU SHAKING IN
YOUR BOOTS!!! THEREFORE I, THE GREAT PAPYRUS, ELECT TO GRANT YOU PITY!! I WILL SPARE YOU, HUMAN!!! NOW'S YOUR
CHANCE TO ACCEPT MY MERCY. ... ALAS, POOR PAPYRUS! WELL, AT LEAST I STILL HAVE MY HEAD! ... W-WELL, THAT'S NOT WHAT
I EXPECTED... ... ST... STILL! I BELIEVE IN YOU! YOU CAN DO A LITTLE BETTER! EVEN IF YOU DON'T THINK SO! I... I
PROMISE... ... NYOO HOO HOO... I CAN'T EVEN STOP SOMEONE AS WEAK AS YOU... UNDYNE'S GOING TO BE DISAPPOINTED IN ME.
I'LL NEVER JOIN THE ROYAL GUARD... AND... MY FRIEND QUANTITY WILL REMAIN STAGNANT! ... WELL THEN... ... I GUESS I
CAN MAKE AN ALLOWANCE FOR YOU!**"); The Undertale Wiki "Papyrus/In battle" (same battle text, independent
transcription); A Fantasy Reality Wiki "Papyrus/In Battle" (the genocide-route dialogue — "**[KILL IN GENOCIDE
ROUTE] WOWIE!! YOU DID IT!!! YOU DIDN'T DO A VIOLENCE!!! TO BE HONEST, I WAS A LITTLE AFRAID... BUT YOU'RE ALREADY
BECOMING A GREAT PERSON! I'M SO PROUD I COULD CRY!!! ... WAIT, WASN'T I SUPPOSED TO CAPTURE YOU...? WELL, FORGET
IT! I JUST WANT YOU TO BE THE BEST PERSON YOU CAN BE. SO LET'S LET BYBONES BE BYBONES**"; and "**IN THE GENOCIDE
ROUTE, PAPYRUS INSTANTLY OFFERS TO SPARE THE PROTAGONIST**"); CYBERPEDIA "Papyrus/In Battle" (independent
transcription of the same battle text and mechanics); TV Tropes "Characters in Undertale - Papyrus" (the
conversion — "**IF PAPYRUS MANAGES TO CONVINCE THE PLAYER NOT TO CONTINUE THEIR NO MERCY ROUTE, BY SPARING HIM
WHEN HE IN TURN SPARES THEM, HE REACTS WITH AN ODDLY UNGRAMMATICAL LINE. PAPYRUS: WOWIE!! YOU DID IT!!! YOU DIDN'T
DO A VIOLENCE!!**"; the mechanic — "**INTERFACE SCREW: HIS BOSS FIGHT IS AN INTRODUCTION TO THE GAME'S 'SOUL
MODES', WHICH MANY BOSSES USE TO CHANGE UP THE WAY YOU DODGE ATTACKS. SPECIFICALLY, HE TURNS YOUR SOUL BLUE, WHICH
CAUSES IT TO BE AFFECTED BY GRAVITY AND FORCES YOU TO JUMP OVER HIS BONES**"; the honest read — "**IT'S ALL ABOUT
ME: FALLS FIRMLY INTO THIS. HE EVEN FEELS LIKE THE HUMAN CHILD'S ENTIRE JOURNEY WAS TO GET HIM INTO THE ROYAL
GUARD. STILL, HIS FRIENDLINESS, OUTGOING NATURE, AND DOWNRIGHT EARNEST SUPPORT KEEPS THIS FROM BEING THE SLIGHTEST
BIT ANTAGONISTIC. IT'S ALSO REVEALED THAT JUST BECAUSE PAPYRUS THINKS HE'S GREAT DOESN'T MEAN HE DOESN'T THINK
OTHER PEOPLE AREN'T ALSO GREAT**"; the attack — "**AFTER HIS 'SPECIAL ATTACK' IS STOLEN BY THE ANNOYING DOG, HE
LAUNCHES AN 'ABSOLUTELY NORMAL ATTACK.' SAID ATTACK IS ALSO HIS LONGEST AND MOST UNIQUE ATTACK. LEAVES UNDYNE AND
THE PLAYER ALONE TO MAKE FRIENDS WITH THE EXCUSE THAT HE HAS TO GO TO THE BATHROOM**"; and the king — "**PUPPET
KING: A BENIGN VERSION, BUT IF HE BECOMES KING IN THE NEUTRAL ENDING, SANS ENDS UP DOING MOST OF THE ACTUAL WORK
RUNNING THE COUNTRY TO SPARE HIM FROM THE PRESSURE OF POLITICS**"). Cross-ref Questbook 66 (Undertale — the
whole-game teardown this quest was pulled from), 116 (The 'Ton Hotel — the other great "the fight is a
character test"), 114 (Yakuza's Mr. Shakedown — the other boss you can decline; both make the fight consent),
115 (The Coin Toss — the choice the game hands you and scores nothing), 111 (The Quantum Moon — the other
solo-authored game where the lock is understanding), 96 (Mordin), 30 (This War of Mine), our PACIFIST LAW +
combat dial + difficulty packages + 120 BPM law + death-math + conscience system + companions + standing +
faction web (13 factions) + entities/spawning + scheduler + quest factory + FACTORY LAW + persistent
consequence + fold + Megaton law + no-clean-answer + Liberate/Respect/Become + ART PHILOSOPHY +
despair-with-a-thread-of-hope. FUTURE: a Toby Fox solo-production pull (one man, 32 months, writing + music +
code + design — the closest production analogue to Paolo's single-file build, directly our FACTORY LAW); an
Undertale MERCY-system study (the exact structure of ACT verbs per enemy, and how many unique ACTs the game
ships across ~60 monsters — directly our combat dial + PACIFIST LAW + quest factory) or a Sans-fight pull (the
hardest fight in the game, built entirely out of the player's own save-scumming — directly our
recorded-vs-unrecorded and our persistent consequence).
