# RESEARCH: COMBAT, MISSING, AND JUICE

Paolo 8/3: "do big brain research on what combat and missing and juice we need"

Researched, then measured against the actual file, because research that never
touches the code is a book report.

---------------------------------------------------------------------------
## THE HEADLINE, AND IT IS A HOLE YOU CAN COUNT

**42 juice items. 37 of them switched on. ZERO of them fire when YOU MISS.**

Every one of the four freeze call sites in the fight is a DAMAGE event:

    line 4826   you take a hit          freeze('hit')    250ms
    line 4844   the round that kills you freeze('kill')   500ms
    line 5960   your own death          freeze('last')  1000ms
    line 8912   you kill somebody       freeze('kill')   500ms

    freeze calls on a miss: 0

And here is what a miss actually is, verbatim from the file:

    G.killStreak=0; sndMiss(); showVerd('MISS','#777'); flash=1;
    if(navigator.vibrate)navigator.vibrate(8);
    setRead('MISS','turn ends','#e8593a');

A sound, a grey word, a white flash, an 8ms buzz. Then 170ms later the turn
ends and they shoot you. **The most consequential thing that can happen on your
turn has the least feedback of anything in the game.**

---------------------------------------------------------------------------
## WHY THE RESEARCH SAYS THAT IS BACKWARDS

**1. THE MISS IS THE MEMORABLE MOMENT, NOT THE HIT.** XCOM is a game people
have argued about for fifteen years and the argument is *entirely about the
misses*. Nobody writes forum threads about the 95% shots that landed. The miss
is where the emotion is, and it is the moment a tactics game is remembered by.

**2. FEEDBACK SHOULD BE ABOUT THE ACT, NOT THE SCOREBOARD.** Nijman's
screenshake talk is ~30 tricks and almost none of them are outcome labels --
they are muzzle flash, kickback, shells, smoke, permanence, camera kick. The
word "MISS" in grey is a scoreboard. Scoreboards do not feel like anything.

**3. HITSTOP EXISTS TO LET YOUR EYES REGISTER THAT SOMETHING HAPPENED.** The
fighting-game literature is precise about this: the pause "gives the eyes a few
frames to register and confirm it happened", and "you don't notice it in-game,
but you feel it when it's missing." Street Fighter V uses 8 frames (~133ms) as
its standard. Our tiers are already musical and correct -- graze 125ms, hit
250ms, kill 500ms, last 1000ms -- **there is simply no tier for a miss.**

**4. AND THE ONE PIECE OF XCOM RESEARCH WE SHOULD REFUSE.** XCOM ships hidden
to-hit modifiers -- reportedly a secret bonus after you miss, disabled on the
highest difficulty -- and the community response was a mod called *Fair RNG*.
The lesson is not "copy the fudge." It is the opposite:

> **BOHEMIA HAS NO 95% PROBLEM BECAUSE BOHEMIA HAS NO PERCENTAGE.** The dial is
> deterministic. A miss is always, provably, yours. That is a structural
> advantage over every game in this genre, and it is exactly why the miss must
> be made to FEEL like something instead of being hidden or softened. You never
> have to lie to the player about a miss, so you can afford to make it loud.

---------------------------------------------------------------------------
## THE DESIGN PRINCIPLE THAT FALLS OUT

**A HIT STOPS THE WORLD. A MISS SHOULD DO THE OPPOSITE: THE WORLD KEEPS GOING
AND YOU ARE THE ONE WHO IS BEHIND IT.**

A freeze is a reward -- it holds the moment so you can enjoy it. A miss should
not be held. It should be the fight *not waiting for you*.

---------------------------------------------------------------------------
## THE FOUR PROPOSALS, RANKED. NOTHING IS BUILT.

### 1. THE ROUND HAS TO GO SOMEWHERE, AND YOU HAVE TO SEE WHERE (biggest)

Right now a missed shot produces **no bullet in the world at all**. It is not
that the feedback is weak; the round does not exist. Meanwhile JUICE.D already
draws *their* misses whipping visibly past your body, with tracers, because we
built that for the incoming side and never for the outgoing side.

**And the dial already knows exactly where your round should go.** JUICE.I
computes your error in milliseconds early or late. That number is currently
printed as text over the target's head. Map it to SPACE instead: 40ms late and
the round kicks up dust a readable distance *behind* him. Early and it goes
wide the other way.

That turns an abstract instrument into a physical fact. You would stop reading
"37ms EARLY" and start *seeing* that you pulled left. It is feedback, and it is
also the best teaching tool in the game, and it costs no new rule.

### 2. A MISS TIER FOR THE FREEZE -- 1/32, ABOUT 62ms

Not a celebration. Long enough for the eye to register the shot happened and
went wrong, short enough that it reads as a stumble rather than a moment. It
fits the existing musical-subdivision law (1/32 is already legal in the table)
and the gate would accept it unchanged.

### 3. THE GUN CLIMBS ON A MISS

Recoil currently reads as controlled. A missed shot is the one time your body
does something you did not choose. Same shape as the existing `G.recoil`, just
harder and uncorrected.

### 4. PERMANENCE -- THE WALL REMEMBERS

Nijman's "permanence" trick, and we already own the machinery (JUICE.Y FIELD
REMEMBERS, JUICE.AF SHELL LITTER, JUICE.AS BLOOD TRAIL). Your misses should
chip the world: pockmarks on the stone you shot past, holes in the car door.
By the end of a long fight you can *see* how the fight went.

---------------------------------------------------------------------------
## WHAT I AM DELIBERATELY NOT PROPOSING

- **No accuracy fudging, no pity timer, no hidden bonus after a miss.** The
  dial is deterministic and that is the whole point. See above.
- **No damage change of any kind.** NO DAMAGE BEFORE THE DIAL.
- **No new currency, no new button, no new bar.** The last thing I built for
  this lane was a bar and it was correctly called dogshit.
- **Nothing built at all in this turn.** He asked for research. The shape of
  what gets built is his to name, which is the lesson from the cook.

---------------------------------------------------------------------------
## SOURCES

- Jan Willem Nijman (Vlambeer), *The Art of Screenshake* -- ~30 game-feel
  techniques: muzzle flash, kickback, permanence, camera kick, shells, smoke.
- *Juice it or Lose it* (Jonasson & Purho) and the Disney twelve-principles
  lineage: squash/stretch, anticipation, follow-through.
- Fighting-game hitstop literature (CritPoints, Capcom's own SFV column):
  hitstop exists so the eye can register the impact; SFV uses 8 frames.
- XCOM 2 probability discussions and the *Fair RNG* mod: hidden to-hit
  modifiers, the streak perception gap, and why the community rejected it.
- Slot-machine near-miss psychology, already cited in this file for JUICE.I.
