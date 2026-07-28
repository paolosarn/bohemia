# BOHEMIA — THINKING ABOUT THE KILLSHOT ALLOWANCE (7/27/26)

> Paolo: "I was thinking that maybe instead of turning off the shot opportunities
> after you do perfect kill shots, maybe the setting is to reflect how many
> killshots you get on your set difficulty before it ramps up. So like let's say
> I'm playing on easy difficulty, that means I'm guaranteed for the most part like
> two easy shots, but then the third shot is gonna be like on hard or very hard or
> Bohemian, and the shot after that is harder... maybe now [what the perk grants]
> is that you're guaranteed [more]... so let's say I get a card and now I have
> three killshots, now it will be three or four or five, but the ones after just
> get increasingly difficult. What do you think about that? Could you look at the
> code and think about it for a turn?"

He asked for thinking, not building. **Nothing was built.** This is the read of the
code plus an honest opinion.

---

## 1. WHAT THE CODE ACTUALLY DOES TODAY

**THE CHAIN IS UNLIMITED.** There is no shot budget of any kind.

```js
function afterKill(){ if(aliveEnemies().length===0)return winGame();
  if(G._noChain){ G._noChain=false; return endTurnReturn(); }
  const next=nextChainTarget();
  if(next<0)return endTurnReturn();
  ...
  G.popTarget=next; G.inFU=true; enterAim(true); }
```

Land a killshot, get another dial. Land that one, get another. Forever, until you
miss or the room is empty. **The turn ends when you fail, and only when you fail.**

**AND THE DIFFICULTY SETTING IS A CEILING, NOT A FLOOR:**

```js
G.pkgDiff = clamp(0..4, distPkg(tgt) + (elite?1:0) + (gcov?1:-1) + (handPeek?1:0));
function distPkg(e){ return Math.round(distT(e) * (G.userPkg||0)); }
```

`distT` is 0 at point blank and 1 at long range. So `distPkg` is **0 at point blank
on every setting including Bohemian**, and only reaches your chosen difficulty at
maximum range.

> **Your difficulty setting is currently the HARDEST the dial can ever get, and
> the shot number has no influence on it whatsoever.**

There is also **no per-turn shot counter anywhere in the file.** `killStreak`
exists but persists across turns. His system needs one new variable.

---

## 2. WHAT HIS IDEA ACTUALLY CHANGES — AND IT IS A LOT

### It creates a decision the game does not have
Today the chain has no stopping choice. You shoot until you miss; failure ends the
turn *for* you. Under his system, **shot N+1 is a question**: take the harder dial,
or stop while you are ahead and end the turn clean.

That is push-your-luck, on every single turn, built entirely out of parts that
already exist. It is the same shape as **THE BANK** from the 7/27 research doc,
which I ranked #2 and never built — and his version is better, because it does not
need a new currency. **The stake is the turn itself.**

### It makes "difficulty" mean something sayable
Right now EASY vs BOHEMIAN changes how tight the needle window gets on far shots.
That is abstract, and no player could state it. His version is a countable promise:

> **"EASY means you are good for two kills a turn."**

One sentence. That is the exact bar SUPPRESS has failed three times.

### It gives progression one clean number to grant
"+1 killshot per turn" is instantly legible and instantly wanted. That is an entire
progression axis carried by a single integer, and it needs no new systems.

### It obeys his own rulings
No damage multipliers. It moves *how landable the killshot is*, which is precisely
where he already put the lever when he ruled that closing to point blank is the
offensive play.

---

## 3. THREE THINGS I WOULD PUSH BACK ON

### (a) IT COLLIDES HEAD-ON WITH THE RANGE RULE. This one needs his ruling.
Point blank already forces the dial to EASY on any setting. So under a naive
implementation, **shot #5 at point blank would still be EASY** and the ramp would
simply not exist for anyone who closes distance — which he has already ruled is
the correct way to play.

Two ways out, and it is his call:

| | what happens |
|---|---|
| **RAMP REPLACES RANGE** | the shot number is the only thing that sets the dial. Simple, loud, and it deletes the point-blank reward he ruled in yesterday |
| **RAMP IS A FLOOR** (`pkgDiff = max(rangeDial, rampDial)`) | closing still helps and still matters, but it can never fully cancel the ramp |

**My recommendation: the FLOOR.** It keeps both mechanics alive and pointing the
same way — closing the distance becomes *how you afford the extra shot*, which
knits his new idea into the rule he made yesterday instead of overwriting it.

### (b) "GUARANTEED" IS A PROMISE THE DIAL CANNOT KEEP
Even the EASY package still requires pressing inside the band. If the game says
"guaranteed" and a player misses, the promise is broken, and a broken promise is
worse than never making one.

**Recommendation: guarantee the DIAL, not the KILL.** Say "2 EASY SHOTS", not "2
guaranteed kills". The game is promising you a wide window; landing it is still
yours. That is honest and it is still a strong-sounding number.

### (c) EASY GETS FASTER, NOT JUST EASIER
More free shots per turn means more kills per turn means shorter fights. That is
probably what "easy" *should* feel like, but it is a real consequence worth
knowing: the difficulty setting stops being only about precision and starts being
about **pace** too.

---

## 4. THE THING HIS IDEA SOLVES THAT HE DID NOT MENTION

**IT ANSWERS "HOW LONG IS A TURN?"**

Today a turn is "until you fail", which has no shape. Under his system a turn has
a rhythm: *two free, then a decision, then a harder decision.* That is the TURN
CLOCK item off the old pick-list, solved by his own mechanic, for free.

---

## 5. WHERE I LAND

**Yes. Build it.** It is the strongest idea to come through this lane, it is a
mechanic rather than a presentation layer, it obeys both of his standing rulings,
and it turns an abstract settings knob into a sentence a player can say out loud.

**Ruling needed before a line is written:**
1. **FLOOR or REPLACE** on the range collision (I recommend FLOOR).
2. **THE ALLOWANCE PER SETTING.** Contents are his, not mine. Something like
   EASY 3 / NORMAL 2 / HARD 2 / V.HARD 1 / BOHEMIAN 1 — but the numbers are his.
3. **THE RAMP SHAPE.** +1 tier per shot past the allowance, or +1 then +2? Does it
   cap at BOHEMIAN or keep climbing past it into something with no name?

**BUILD ORDER when he rules:** the per-turn counter and the ramp first, because
they are the mechanic. The read second — the dial must say *"SHOT 3 OF 2 · V.HARD"*
or the whole thing is invisible, which is the mistake this lane has now made three
times in a row.
