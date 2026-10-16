# THE BUTTON AND THE BOARD STOP LYING

**8/12/26 — COMBAT lane. Paolo: "sometimes I'll click it and I'll just get shot
first... there's so many times in the arena where it says there's like an
invisible pillar there... This shit is going downhill. That was bad."**

Three complaints, one disease: **the game tells him one thing and does another.**

---

## 1. THE ACTION BUTTON GOT HIM SHOT WITHOUT FIRING

There is a branch in the pop that ends in `recklessPop()`: press the button when
there is nothing to shoot, and every gun holding a bead takes a free shot at
you. **You never fire.**

That is three things at once:

- **Exactly what he described.**
- **A breach of a locked law.** YOU ALWAYS SHOOT FIRST (8/3, his words: *"no
  enemies never get the first shot thats why its important to not miss"*). This
  branch hands them the first shot and gives him none.
- **It bypassed yesterday's fix completely.** I made a green pop take no return
  fire — and `recklessPop` never looked at that flag. The safety promise was
  still being broken one branch over from where I fixed it.

**The punishment itself is his and it stays** — it exists because he asked for a
cost to popping at the wrong moment. What he is objecting to is being *surprised*
by it, and being hit *through a promise the UI already made*. So:

- **Green is absolute.** If the button was green, a reckless pop costs nothing. A
  promise the game makes outranks a punishment it wants.
- **The button says it first.** That state now reads **NOTHING TO SHOOT** instead
  of POP OUT. He is allowed to take a bad turn. He is not allowed to be tricked
  into one.

## 2. THE INVISIBLE PILLAR WAS THE PLAIN MOVE, AND HE WAS QUOTING THE GAME

I measured RUN first — only 1–2% of its refusals were questionable, so RUN was
not it. **The plain directional move — the button he presses most — was still
blocking with a halo up to 1.1 tiles wide around a rock drawn at 0.45,** and its
message is literally *"a pillar is there."* He was quoting the game back at me.

The file had **four different collision radii for the same rocks** and none of
them was the drawn size. Every mover uses one honest rule now: a rock blocks the
ground it covers.

**Measured, 960 taps: refusals down 76 → 60.** One in five blocks that used to
stop him is gone, and the block now matches the rock he can see. I could not
prove the "invisible" part with a metric — my detector measures to the rock's
edge, and the old padding put the block about 4 pixels past it, which is exactly
the gap a person calls invisible and a number calls visible.

## 3. WHAT I DID NOT BUILD

**Seeing every enemy's weapon range.** It is a real ask and it is the next thing.
I did not do it in this turn because this turn was three regressions in things
that already existed, and a readout drawn on top of a lying board would just be a
prettier lie.

---

**On "this is going downhill":** he is right that I have been shipping faster
than I have been verifying. Two of the three bugs here are mine from the last
two days — the green bypass and the stale flag — and the third is a number that
has been wrong since the arena generator was written. The pattern in all of them
is the same: something built, and never connected to the thing that reads it.

Tool: `tools/bohemia_combat_the_button_stops_lying_patch.py`
Gate: `gates/combat_lab_gate.js`, 764 → 767 checks.

**WHERE TO SEE IT: the COMBAT tab.**
