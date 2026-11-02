# THE CELL VEST, THE WRONGNESS, AND TRUE JOB TIMES (Paolo 11/2, three asks in one message; VAMILY rules 305 to 307; ask lines 297 to 299)

## HIS WORDS (verbatim, transcription kept)
1. "what if we have a character build that's like low-key a suicide bomber... he'll fall in battle... I want it to be realistic too...
   making like a real late game available, like even against the amalgamation at final boss, like the main point of this guy is to die
   on the battlefield, or at least fuck something up so bad he faints... what are the numbers even after they fall... there's a chance
   that your character's not coming back, but maybe we can add a perk like this character only has one HP, and his armor better support
   everything otherwise he's going down... I'm trying to just think creatively, have some fun with it."
2. "I'm always looking to find ways where everything that we do is this crazy, not even gory, but just like... this AI slop
   amalgamation creepypasta horror Crashbox HBO series vibe... make some really good elements or direction for art for shit like that,
   for real."
3. "the time that it takes on these quests are extremely inaccurate a lot of the times, so that needs to get fixed for real... I'm
   tired of that shit being inaccurate as fuck."

## 1. THE CELL VEST (a build; the coordinator's design, every number draft:true and in a data file when built; his to change)

### What a fall costs today (his question, answered from records/target/bb/ours.json)
- Struck down: 20% he dies (struck_down_death_chance), plus 5% for each lasting mark he carries, up to 4 marks (so 40% at worst).
- If he lives: laid up 6 to 8 days with the fresh wound fading (struck_down_laid_up_days), and from the FIRST fall a roll of 1 or 2 max
  HP gone for good, no cap, never below 1 (rule 304). A man starts with about 50 to 60 HP (backgrounds.json).
- The main character never dies (the third votes).

### The realism (the hole pulled first)
- A battery does not blow up like dynamite. A lithium cell that is shorted or crushed goes into THERMAL RUNAWAY: it vents, throws a jet
  of fire hot enough to melt aluminium, spits burning pieces, and pours out a choking smoke that carries hydrogen fluoride. In a closed
  room the vented gas can light all at once and that IS an explosion: a battery building in Surprise, Arizona blew up that way in April
  2019 and put four firefighters in hospital.
- So the vest is a burst of fire and smoke on the men touching him, and a real blast only indoors or against a wall.
- Batteries are the money. Every cell in the vest is money he is carrying to burn. The build is expensive by its nature, which is the
  fair cost (rule 303), not a punishment.
- The flame carries a crimson edge (lithium's own colour in a flame test). Never purple: purple belongs to the Amalgamation alone.

### The pieces
- THE CELL VEST (the accessory slot, Battle Brothers' own slot for a dog or a bandage; so his body armour still does its job): salvaged
  cells wired to a grip switch. A scrap vest holds 4 cells, a yard vest 8, a late vest 12. Cells are bought for batteries and loaded
  at a stall or a smith; a loaded vest is the price of about two fire pots (the price is ECONOMY's, in the data file).
- TWO WAYS IT GOES OFF:
  (a) THE DIAL: he squeezes the grip as his action. It is the important shot, so it is on the dial (the 9/22 law: the dial owns every
      number over one): a hit on the beat lights every cell, a miss lights half.
  (b) THE DEAD MAN'S SWITCH: when he is struck down the grip lets go and the vest goes off by itself, every cell, no dial. (A dead man's
      switch is a real thing: the train handle that stops the train when the driver lets go.) So felling him is dangerous, and enemies
      who have seen one go off keep their distance or shoot instead (the AI learns it, the Battle Brothers way of a foe that respects a
      threat). He becomes a piece that holds ground by standing there.
- WHAT IT DOES (draft): each cell burns about 8 on every enemy touching him, half of it through armour; indoors or with a wall beside
  him, times 1.5. The ground burns for 2 turns (Battle Brothers' fire pot) and the smoke on his tile and the ring around it takes 20% off
  every shot through it for 2 turns (its smoke pot). Against machines, times 1.5 (heat kills electronics; the mechanic's robots, and late,
  the Amalgamation). A full late vest is about 96 on each man touching him: it drops an armoured man. A boss is never one-shot: on a boss
  it is a big piece of the fight, not the end of it.
- WHAT IT DOES TO HIM: he is in the fire, so it always knocks him down, and the usual fall roll gets the vest's share: 20% + 5% a mark +
  25% for the vest = 45% he dies with no marks. Fire-proof gear (a welder's leathers, a fire apron) takes 15% off. If he lives: the
  fresh wound, a burn, and rule 304's 1 or 2 max HP for good. The point of the man is to die well or to faint having wrecked them, which
  is exactly his words.
- THE PERK, HIS IDEA, "NOTHING LEFT" (draft name): his max HP becomes 1, and his armour takes the WHOLE of every blow while it stands
  (no part of a hit gets through to him until the armour is gone). His armour has to carry everything, or he goes down, and when he goes
  down the switch lets go. It ties to rule 304: a man worn down by many falls loses less by taking it, so the perk is offered first to a
  man who has lost 20 or more max HP to falls. The realism: a body broken too many times, kept upright by the plate on it.
- THE MAIN CHARACTER CANNOT WEAR IT (he never dies, so it would cost him nothing; that would be the cheat rule 303 forbids).
- THE RISK SEEN FIRST (rule 303): aiming the vest lights the tiles that burn, the hurt on each enemy, and his odds to die, before the beat.
- WHERE IT COMES FROM: a hire who worked a battery yard arrives with a scrap vest (a background, CHARACTER and WORDS); a yard vest at the
  trades town's smith; the late vest from a boss's place.
- THE NAME: in the game he is never called a suicide bomber. Phone stores and publishers pull games over real terror words, and he is not
  that: he is a man who chose how to spend what was left. The vest is THE CELL VEST and the man who wears it is A SPARK (draft:true, his
  to rename).
- [bb] Battle Brothers' fire pot (burning ground for turns), smoke pot (shots through it worse), the accessory slot, and Nine Lives (a
  killing blow survived once). Battle Brothers has no man who goes off when he falls: that is our twist.
- [analog horror] the frame whites out on the beat, the cells hiss before they catch, the crimson edge, the smoke that hangs on the tape.
- BUILT BY (queued, in order): COMBAT (the vest's fire, the switch, the AI's fear, the risk lit first), ECONOMY (the cell price), CHARACTER
  and DIRECTION (the vest on the body, the yard hire), WORDS (his lines), TUNING (the numbers, research only).

## 2. THE WRONGNESS (DIRECTION's job)
- Read inside the analog horror law and rule 301 (Crashbox): his "AI slop amalgamation creepypasta" is the uncanny, never the gore. The
  Amalgamation is a machine that in act one is presented as a ghost (laws/BOHEMIA_ADDENDUM_ACT1_AMALGAMATION_IS_A_GHOST_7_24_26.md), so its
  haunting can LOOK like machine-made wrongness without saying so: a face on a billboard with one finger too many, writing that almost
  reads, a smile on a poster that is wrong, a family of mannequins in a window that moved, a missing-person flyer whose face is smeared the
  way a machine smears it, a test card on a camp television with a face in it. The player calls it a ghost in act one and understands at
  the end of act one that it was the machine all along. Purple stays the Amalgamation's alone and stays scarce.
- The job: a direction page and a sheet of real made elements (pictures in the game's look, draft:true, registered in the VOTE tab), each
  with where it goes (a town wall, a road event, the feed, the loading screen, the fight's glass).

## 3. TRUE JOB TIMES (said again, angry; ask line 242 was never closed)
- What exists (slices/bohemia_job_kinds.js trip()): the time is planned before the yes on the map's own road and clock, at the job's pace,
  with the way back. EYES saw one job true (183 map minutes for 'about 3 hours'). He says a lot of them are wrong, so the plan and the walk
  part somewhere: never measured over many jobs.
- The job: WORLD takes 50 or more jobs of every kind (and the new quests and the bosses' places), at several towns, from the town and
  from the phone, by day and by night, and logs the promise against the real map minutes from the yes to the pay. Every gap gets its
  cause and its fix (the same code for the promise and the walk). A job that cannot be exact (a pack that roams, an ambush) says a range
  and why. The bar: 9 of 10 jobs within 15% of the promise, none off by more than 30% without saying why.
