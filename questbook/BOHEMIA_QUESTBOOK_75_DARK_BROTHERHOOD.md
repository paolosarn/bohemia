# BOHEMIA QUESTBOOK — DEEP DIVE 75: RECRUITED BY MURDER / THEY GIVE YOU A HOME, THEN BURN IT DOWN (Skyrim — The Dark Brotherhood)
Full teardown, the whole enchilada: the recruited-by-murder opening, the shack test (three hooded strangers,
one has a contract), the two-path fork (join or DESTROY), the Night Mother naming you Listener over the
leader's head, the tradition-vs-pragmatism schism, Astrid's betrayal + her dying request, the sanctuary
burned, the Emperor's assassination, the honest flaws, and Bohemia ports. Widely called the best faction
questline Bethesda ever wrote. DIRECTLY relevant to our faction architecture, our recruitment design, +
our home-as-stakes. Bethesda. Reference only; Paolo does not read it. No Bohemia quest written here.

Questline: The Dark Brotherhood (The Elder Scrolls V: Skyrim, Bethesda, 2011). Fourteen quests. An
assassins' guild in decline, run by ASTRID from the Falkreath Sanctuary, who has abandoned the ancient
rites and rules ("we've done away with all rules and policies except one: RESPECT THE FAMILY"). You're
recruited by committing a murder, forced to kill a stranger to prove yourself, adopted into a dysfunctional
family, chosen by their mummified goddess over their leader's head, betrayed by that leader, and end up
assassinating the Emperor of Tamriel on his own ship.

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- THEY RECRUIT YOU BY *NOTICING A MURDER YOU ALREADY DID* (the invitation — best faction opening in the
  genre): you don't apply. A boy in Windhelm is performing the BLACK SACRAMENT (a ritual to summon
  assassins) to kill the cruel orphanage matron Grelod the Kind. You kill her — for your own reasons — and
  then, days later, a letter arrives with two words: "WE KNOW." Then you sleep in a bed, ANY bed, and wake
  up kidnapped. The faction found YOU, because of who you already are. Recruitment as observation, not
  application (cf. our faction-standing/reputation-driven recruitment; the faction that watches).
- THE SHACK TEST: KILL A STRANGER TO PROVE YOU'LL KILL ON COMMAND (the induction — the moral hook): you
  wake in a locked shack with Astrid + THREE BOUND, HOODED CAPTIVES. She explains: you stole a contract
  that belonged to the Night Mother, so you owe a life. "A LIFE FOR A LIFE." One of these three has a
  contract on them; the other two don't. She won't tell you which. The door is unpickable + she has the
  key. "You cannot leave the room until someone dies."
  - The captives beg, bargain, + lie. You can interrogate them. And the truth the wiki states plainly: "IT
    DOESN'T MATTER which captive(s) you choose. You won't encounter any of them again." There IS no right
    one. The test isn't accuracy — it's whether you'll KILL ON COMMAND, on someone's say-so, with no
    evidence. That's the whole job (cf. Sinnerman's opt-in complicity Q40, our conscience system; the test
    that IS the theme).
- THE FORK: OR YOU CAN KILL *HER* AND DESTROY THE WHOLE THING (the real choice): the fourth option is to
  murder ASTRID and walk out. That fails the quest, starts "Destroy the Dark Brotherhood!", and lets you
  wipe out the entire Sanctuary for the Empire — permanently locking a 14-quest chain, Shadowmere, 20,000+
  gold, the Blade of Woe, the Dawnstar Sanctuary, two master trainers, + more. Bethesda built an entire
  faction and let you delete it in the first five minutes, with real rewards on BOTH sides (3,000 gold for
  destroying it). And the black joke: killing her makes her say "WELL DONE..." as she dies (cf. our
  Megaton law + faction-destruction; the content you can refuse).

===============================================================================
## 1. THE ARCHITECTURE (a home, given and taken)
===============================================================================

### THE FAMILY IS THE POINT (the sanctuary as a home you're given)
- The Sanctuary is a HOME: a hidden door that asks a riddle ("What is the music of life?" — "Silence, my
  brother"), a hearth, a dysfunctional found FAMILY (Nazir the wry contract-broker; Babette the
  centuries-old vampire in a little girl's body; Gabriella; Festus the sour old wizard; Arnbjorn the
  werewolf, Astrid's husband; Veezara). They have a RADIANT DIALOGUE SYSTEM: members chat with each other
  in randomized exchanges, each with unique closing lines — so the home feels ALIVE when you're not being
  addressed. Astrid's single rule: "RESPECT THE FAMILY." The game spends ten quests making you love a house
  (cf. Hades' persistent hub Q47, RDR2's camp Q10, our district-as-home; the home you're given).
### THE SCHISM: TRADITION VS PRAGMATISM (the faction's civil war — key craft)
- The Brotherhood is in DECLINE. Astrid keeps it alive by abandoning the old rites — no Listener, no Night
  Mother, no Five Tenets, just contracts + family. Then CICERO arrives: a giggling, murderous JESTER
  hauling a coffin containing the NIGHT MOTHER's mummified corpse, demanding the old ways be restored. He
  is the faction's orthodoxy made flesh, and he is INSANE. Astrid: "he'll soon learn this is MY Sanctuary."
  Two legitimate readings of one dying institution — reform vs restoration — and neither is clean (cf.
  our faction web + the Network's orthodoxy; the institution at war with its own past).
### THE NIGHT MOTHER CHOOSES *YOU* — OVER THE LEADER'S HEAD (the promotion that poisons everything)
- Astrid orders you to hide INSIDE the Night Mother's coffin to spy on Cicero. And then the corpse SPEAKS —
  to YOU. She names you the LISTENER: the position vacant for decades, the one Cicero has waited his whole
  life to serve. You climb out to Cicero's fury ("treacherous debaser + defiler!") and prove it with the
  Binding Words she gave you: "DARKNESS RISES WHEN SILENCE DIES."
  - The structural genius: the newest recruit is now, by sacred law, ABOVE the leader — and Astrid is
    watching. A promotion by a dead god that hands you authority your boss doesn't recognize. Every crack
    in the family runs from this moment (cf. our standing/faction-politics; the promotion as a wound).
### ASTRID'S JEALOUSY BECOMES BETRAYAL (the fall — and it's HER fall, not yours)
- Astrid admits it herself: "I haven't exactly been discreet lately in expressing my frustration with this
  whole situation. Obeying the Night Mother. YOU being the Listener. It's RIDICULOUS. No offense." Cicero
  overhears + tries to kill her. And when the Emperor contract lands — the Brotherhood's biggest job since
  Pelagius — the plan goes wrong, and it turns out ASTRID SOLD YOU OUT to the Penitus Oculatus (the
  Emperor's secret service) to save the family from the path she couldn't control.
### THE HOME BURNS (the stakes cash out — the best structural move)
- "Death Incarnate": the Penitus Oculatus storm the Falkreath Sanctuary + BURN IT DOWN. Your family dies
  around you. And you find ASTRID in the flames — she has performed the BLACK SACRAMENT on HERSELF, her own
  body the ritual: "I prayed to the Night Mother! I AM the Black Sacrament." Her dying words:
  - "I'm saying you were right. The Night Mother was right. The old ways... they guided the Dark
    Brotherhood for centuries. I was a fool to oppose them. And to prove my... sincerity, I have prayed for
    a contract. YOU LEAD THIS FAMILY NOW. I give you the Blade of Woe, so that you can see it through. You
    must kill... ME."
  - The betrayer's last act is making herself YOUR contract + handing you the guild. Ten quests of home,
    destroyed in one, by the woman who gave it to you, who then asks you to kill her (cf. our fold's loss +
    persistent-consequence; the home given, then burned).
### THE EMPEROR (the payoff — an assassination with a con inside it)
- The finale escalates to the real thing: kill EMPEROR TITUS MEDE II. It runs through a chain of great
  set-pieces — murder a bride at her own wedding; impersonate THE GOURMET (Tamriel's legendary anonymous
  chef) to poison a state banquet; then board the Emperor's warship, the Katariah. And the decoy twist: the
  Emperor you kill at the banquet is a BODY DOUBLE — the real one is at sea. The reward: 20,000 gold — and
  the rebuilt Dawnstar Sanctuary costs 19,000 of it. You get a new home, and it costs you almost exactly
  what you were paid to kill an emperor (cf. our economy/reward design; the payoff that becomes the home).

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- THE MORAL WEIGHT IS ZERO OUTSIDE THE QUESTLINE: "if you decide to kill a hostage and join the Dark
  Brotherhood, then there aren't any consequences since GUARDS AND JARLS WON'T KNOW if you join the shadowy
  organization." The Dragonborn can murder an emperor + then be hailed as a hero everywhere. LESSON (sharp,
  for our standing): if a faction's actions don't touch the WORLD's opinion of you, the faction is a
  sealed box — our multidimensional standing must let one faction's deeds be FELT by others (contrast
  Morrowind's seven-faction politics Q74, our standing-as-spine).
- THE SHACK TEST IS A FAKE PUZZLE (deliberately, but still): the captives beg + lie + offer information,
  which implies deduction — but "in truth, IT DOESN'T MATTER which captive(s) you choose." Thematically
  brilliant (that's the POINT), but many players spend real effort investigating a puzzle with no solution
  + feel cheated when they learn it was theater. LESSON: a fake-choice-as-theme only lands if the player
  UNDERSTANDS it was a test of obedience, not accuracy — signal the theme or it reads as a bug (our
  Megaton law: no fake choices unless the fakeness IS the point AND is legible).
- YOU CAN'T ACTUALLY ROLEPLAY THE SCHISM: Astrid vs Cicero vs the Night Mother is a rich three-way — but
  the plot RAILROADS it: you're always the Listener, Astrid always betrays you, the Sanctuary always burns.
  You can spare or kill Cicero, and that's it. LESSON: if we build a faction civil war, let the player
  actually PICK A SIDE (our faction web + Megaton; the schism should branch).
- THE DESTROY-PATH IS A STUB: killing Astrid gives you a single dungeon-clear + 3,000 gold vs a 14-quest
  arc. It exists for players who won't murder innocents, but it's not a real alternative — it's an OFF
  switch. LESSON (for our Pacifist Law): a refusal path must be a PATH, not a deletion — give the player
  who says no somewhere to GO (our Pacifist Law's whole premise; contrast Whispering Hillock Q04's real
  divergence).
- THE VILLAIN-PROTAGONIST PROBLEM: you murder a beggar, a bride at her wedding, + three hooded strangers
  for a stat bonus. The writing is so charming (Cicero's giggling, Nazir's dryness, Babette's dark comedy)
  that the game never makes you FEEL any of it. LESSON (ours): if we let players do monstrous things, the
  world should REGISTER it — charm shouldn't launder atrocity (our conscience system + child-safety/tone
  rules; contrast This War of Mine's guilt Q30).

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. THEY RECRUIT YOU BY NOTICING A MURDER YOU ALREADY DID: no application — a letter that says "WE KNOW,"
    then you wake up kidnapped. The faction found YOU (cf. our reputation-driven recruitment).
W2. THE INDUCTION TEST *IS* THE JOB: three hooded strangers, one contract, no evidence — and it doesn't
    matter who you pick, because the test is whether you'll kill ON COMMAND (cf. Sinnerman Q40, our
    conscience system).
W3. YOU CAN DELETE THE ENTIRE FACTION IN THE FIRST FIVE MINUTES: kill the recruiter, take the Empire's
    money, wipe out a 14-quest chain — with real rewards on both sides (cf. our Megaton law).
W4. THE FAMILY IS THE POINT: a hidden home with a riddle-door, a hearth, + a radiant-dialogue found family
    who talk to EACH OTHER — ten quests spent making you love a house (cf. Hades Q47, RDR2 Q10, our
    district-as-home).
W5. THE SCHISM: TRADITION VS PRAGMATISM: a dying institution's reformer vs its orthodoxy-made-flesh (a mad
    jester with a corpse in a box) — neither clean (cf. our faction web + Network).
W6. THE DEAD GOD PROMOTES YOU OVER YOUR BOSS'S HEAD: the newest recruit becomes, by sacred law, superior to
    the leader — and every crack in the family runs from that moment (cf. our standing/faction politics;
    the promotion as a wound).
W7. THE BETRAYER'S MOTIVE IS LOVE OF THE FAMILY: Astrid sells you out to SAVE the family from a path she
    couldn't control — a betrayal from fear, not malice (cf. our faction-leader design).
W8. THE HOME BURNS + THE BETRAYER MAKES HERSELF YOUR CONTRACT: she performs the Black Sacrament ON HERSELF
    ("I AM the Black Sacrament"), hands you the guild + the knife, and asks you to kill her (cf. our fold's
    loss + persistent-consequence; the best single scene in the questline).
W9. THE ESCALATION IS ABSURD AND EARNED: beggar -> bride -> a legendary chef's identity -> a poisoned state
    banquet -> a body-double -> the Emperor's warship. Each step is a set-piece with a different verb (cf.
    our quest factory + escalation design).
W10. THE PAYOFF *BECOMES* THE NEW HOME: 20,000 gold for the Emperor; the rebuilt Sanctuary costs 19,000 —
     the reward for the arc is the home you rebuild with it (cf. our city-builder + reward economy).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — the faction that finds you + the home they burn
===============================================================================
The Dark Brotherhood is the best FACTION-ARCHITECTURE teardown for us yet: how a faction FINDS you, tests
you, houses you, promotes you into a schism, betrays you, and burns your home — with a real option to
delete the whole thing. That's our faction web + district-as-home + Megaton law, in one 14-quest chain.
- W1 (recruited by noticing what you already did — our reputation-driven recruitment): STEAL the opening.
  Our FACTIONS should FIND the dynasty based on what they've already DONE (our multidimensional standing
  tracks it) — a letter, a visitor, a summons that says "we've been watching." No application, no menu.
  The faction's attention IS the standing system's output (ties our standing-as-progression-spine + faction
  web + 13 factions, Nemesis-style noticing Q48; recruitment as observation).
- W2 (the induction test IS the job — our conscience system): bank the design — a Bohemia faction's
  INDUCTION should test whether you'll do THE THING THEY DO, on their say-so, with no evidence (turn over a
  neighbor to the Network, sign a record you haven't read, condemn one of three strangers). The test isn't
  accuracy — it's obedience. That's a conscience-system beat AND a faction-characterization beat in one
  (ties Sinnerman Q40, our conscience system + faction web + Amalgamation's demands; the test that IS the theme).
- W3 (you can delete the faction — our Megaton law + Pacifist Law): bank BOTH the strength + the flaw. The
  strength: let the dynasty REFUSE + destroy a faction, with real rewards on both sides. The flaw (see
  below): Skyrim's destroy-path is an OFF switch, not a path. Our PACIFIST LAW demands the refusal be a
  real route with its own content (ties our Megaton law + Pacifist Law + faction web; refuse = a path).
- W4/W8 (the family is the point + then the home BURNS — our district-as-home + fold): the highest-value
  port. Spend the arc making the player LOVE a home (our DISTRICT: a hearth, a found family, radiant
  chatter between NPCs so it lives when you're not addressed) — and then have it TAKEN (raid, betrayal,
  the Amalgamation's reach). Our FOLD makes this generational: a home built by one dynast, burned in
  another's lifetime, rebuilt by a third. And steal the Astrid scene structure: the person who gave you
  the home destroys it out of LOVE for it, then hands you the knife + asks you to end her (ties Hades Q47,
  RDR2 Q10, our district-as-home + city-builder + fold + persistent-consequence; a top-tier structural port).
- W5/W6/W7 (the schism + the promotion over your boss's head + the betrayer who acts from love): bank all
  three for our FACTION design — a dying institution split between a PRAGMATIST keeping it alive by
  abandoning its rites and an ORTHODOXY demanding restoration (our NETWORK vs the Amalgamation's older
  protocols is exactly this shape); a promotion by a higher authority that hands the dynasty power its
  faction-boss doesn't recognize (a WOUND, not a reward); and a betrayal whose motive is LOVE of the thing
  betrayed, not malice (ties our faction web + Network + Amalgamation + standing; the institution at war
  with its own past).
- W9/W10 (absurd earned escalation + the payoff becomes the home): bank the escalation ladder — each step a
  set-piece with a DIFFERENT VERB (a quiet kill -> a public one -> an impersonation -> a poisoning -> a
  boarding), climbing from a beggar to a head of state. And bank the economy joke: the arc's huge REWARD is
  what you spend rebuilding the HOME — our city-builder can make the quest payoff literally fund the
  district (ties our quest factory + city-builder + survival-accounting; the reward that becomes the home).
- FLAWS (bank HARD): (a) a faction's deeds must be FELT by the world — Skyrim's guards don't know or care
  that you murdered the Emperor; our multidimensional standing must let one faction's deeds ripple to
  others (Morrowind's seven-faction politics Q74 is the fix); (b) a fake choice only works if its FAKENESS
  is the legible point — signal it or it reads as a bug (our Megaton law); (c) if we build a faction
  SCHISM, let the player PICK A SIDE — don't railroad it (our faction web + Megaton); (d) a refusal path
  must be a PATH, not an off switch (our PACIFIST LAW's whole premise); and (e) charm must not LAUNDER
  atrocity — if we let a dynast do monstrous things, the world + the conscience system should REGISTER it
  (This War of Mine's guilt Q30, our conscience system + tone/child-safety rules).

## SOURCES
UESP/Skyrim:Dark Brotherhood + With Friends Like These... + Destroy the Dark Brotherhood! + Astrid (the
"We Know" letter + the sleep-anywhere kidnapping, the Black Sacrament by Aventus Aretino to kill Grelod the
Kind, Astrid's "A life for a life" + "you cannot leave the room until someone dies" + the unpickable door,
the three bound captives + "In truth, IT DOESN'T MATTER which captive(s) you choose. You won't encounter any
of them again," the kill-Astrid fork starting Destroy the Dark Brotherhood! + the 3,000 gold reward from
Commander Maro vs the forfeited Shadowmere/20,000 gold/Blade of Woe/Dawnstar Sanctuary/master trainers,
the ironic "Well done..." on her death, the Black Door riddle "What is the music of life?" / "Silence, my
brother," Astrid's one rule — "they have done away with all rules and policies except one simple principle,
'Respect the Family'," the radiant dialogue system where members chat with randomized exchanges + unique
closing lines, the fourteen-quest structure, Astrid's own admission — "I haven't exactly been discreet
lately in expressing my frustration with this whole situation. Obeying the Night Mother. You being the
Listener. It's ridiculous. No offense," her Emperor-contract reaction "By Sithis, you're not joking. To kill
the Emperor of Tamriel... The Dark Brotherhood hasn't done such a thing since the assassination of
Pelagius," and her death speech — "I prayed to the Night Mother! I AM the Black Sacrament... The old ways...
they guided the Dark Brotherhood for centuries. I was a fool to oppose them... YOU LEAD THIS FAMILY NOW. I
give you the Blade of Woe... You must kill... me."); Game-Rack quest guide (Cicero brings the Night Mother's
coffin + you're ordered to hide inside it, the Night Mother names you LISTENER — "a position that has long
been vacant... it creates friction with Astrid, who disregards tradition," "Death Incarnate: The Falkreath
Sanctuary is destroyed by an attack from the Imperial Penitus Oculatus. Astrid, performing the Black
Sacrament amidst the flames, entrusts you with 'Blade of Woe'," "Hail Sithis!: you assassinate the true
Emperor, Titus Mede II, on his ship, 'The Katariah'," the 20,000 gold reward, "an epic tale of betrayal,
revenge, and rebirth"); RarityGuide/Whispers in the Dark (the Binding Words — "Darkness rises when silence
dies," Cicero's accusation "treacherous debaser and defiler... You have violated the sanctity of the Night
Mother's coffin," the words "Written in the Keeping Tomes. The signal so he would know. Mother's only way of
talking to sweet Cicero"); TheGamer (the found family — "Led by Astrid in the Falkreath Sanctuary, they have
formed a dysfunctional family that carries on under her leadership despite the organization's decline...
their traditions being compromised and small cracks forming beneath the facade," the Night Mother speaks
only through the Listener + "there has not been a Listener in decades," the Dawnstar Sanctuary's 19,000-gold
full upgrade vs the 20,000 reward, "if you decide to kill a hostage and join the Dark Brotherhood, then
there aren't any consequences since guards and Jarls won't know," the destroy-path locking the questline);
SuperCheats walkthrough (the Cicero mercy choice — "he argues that you should let him live; tell Astrid that
you killed him. Lie, because he wants to live," the Gourmet impersonation, Amaund Motierre in the Volunruud
crypt + the Elder Council amulet identified by Delvin Mallory). Cross-ref Questbook 37/74 (Morrowind —
directions + the seven-faction politics that FIX Skyrim's sealed-box flaw), 23/71 (Elden Ring/Ranni — the
optional-campaign faction arc), 40 (Sinnerman — opt-in complicity/the test that IS the theme), 47/10
(Hades/RDR2 — the persistent hub + camp = the home you're given), 04 (Whispering Hillock — real divergence
vs a stub), 30 (This War of Mine — guilt that REGISTERS, the fix for charm-laundering), 48 (Nemesis — the
world noticing you), 70/72 (Hearts of Stone/Dead Money — the bargain + the villain's blindness), our
multidimensional STANDING-as-progression-spine + faction web (13 factions) + Pacifist Law + Megaton law +
conscience system + district-as-home + city-builder + fold + persistent-consequence + quest factory +
survival-accounting + Amalgamation + Network + tone/child-safety rules. FUTURE: an Emil Pagliarulo (the
Dark Brotherhood's writer, also Oblivion's) retrospective on faction-questline design (the definitive
recruit-house-betray blueprint); an Oblivion Dark Brotherhood cross-study ("Whodunit?" is already Q07 — but
its full arc's traitor-hunt is the earlier, tighter version of this same betrayal structure).
