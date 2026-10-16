# HARVEST FOUR: EVERYBODY IN THE VALLEY HAS A JOB EXCEPT THE PLAYER
# (coordinator, this round)

## THE FINDING, MEASURED IN OUR OWN CODE
ECONOMY asked what our four money verbs are missing and found the answer is not a
feature:
```
NPC workday, already in bohemia_agents.js since his 7/19 correction:
  worker  WORK   448 min     scav    SCAV   371 min
  watch   WATCH  413 min     keeper  ERRAND 101 min
NPC acts:     errand, free, home, scav, sleep, watch, work
PLAYER acts:  walk, talk, fight, build, buy, sleep
```
**THERE IS NO PLAYER ACT CALLED WORK, SCAV, ERRAND OR WATCH.** Every person in the
valley puts in a seven-hour day. The player cannot work at all.
And the money vocabulary confirms it: finish a quest (+1), place a building (-1),
buy a good (-1), ask somebody (-1 clout). **Three of the four are spending, one is
earning, and none of them is work.** The four verbs are the BILL, not the JOB.

## WHY THIS IS THE MISSING PIECE OF THREE OTHER THINGS
- **His own money ruling.** Batteries are the money and buildings auto-mine them
  (9/5). That is income while you sleep. Nothing lets you earn by DOING.
- **The five-minute session** (harvest two). A shift IS the five-minute unit of
  play: a thing with a start, an end, and a battery at the end of it.
- **The economy identity.** "The most realistic economic crash simulator, but
  fun." A crash simulator where the player never works is a simulator of somebody
  else's economy.
- **And the work already exists.** The NPC clocks, the acts, the schedules and the
  places are built. The player is the only person in the valley locked out of them.

## THE RISK IN HIS OWN RULING, AND WHAT THE CRAFT SAYS
Buildings that mine batteries while you are away is passive income, and the known
failure of passive income is that it makes doing the work by hand pointless. What
the design literature says about that balance:
- The early hours must be ACTIVE or the loop never gets learned; automation comes
  after the player understands what it is automating.
- When automation arrives, the player's role must CHANGE rather than end: from
  doing the thing to choosing where to invest, what to upgrade, what to scale.
- Cap what accumulates while away, so coming back is worth something and the pile
  is not just a timer.
Sources: [Passive resource systems in idle games](https://adriancrook.com/passive-resource-systems-in-idle-games/),
[Idle vs incremental vs tycoon: the core mechanics](https://medium.com/tindalos-games/idle-vs-incremental-vs-tycoon-understanding-the-core-mechanics-f12d62f4b9f7),
[A deep dive into idle genre design](https://www.designthegame.com/learning/courses/course/designing-mobile-idle-genre/a-deep-dive-idle-genre-game-design).

**SO THE ORDER IS: WORK FIRST, BUILDINGS SECOND.** A player should earn a battery
with their hands before a building ever earns one for them, or the building is a
number that appears for no reason they understand. His ruling stands exactly as
he gave it; this is only which one a player meets first.

## ROUTED
- WORLD [a days work]: the player gets the acts the valley already has -- work,
  scav, errand, watch -- on the clocks that already exist.
- RUN [a shift]: a shift is the five-minute unit of play, with an end.
- PEOPLE [somebody hires you]: a person gives you the job, and who will hire you
  depends on standing and on what you used to be (both already built).
- WORLD [batteries mined]: amended in place -- work comes before automation, and
  what a building earns while you are away is capped.
