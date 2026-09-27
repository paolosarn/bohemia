# WORDS 9/27 [lexicon frozen] -- THE SPANISH DICTIONARY WAS ERASING ITSELF, AND
# A REBAKE THAT CHANGED NOTHING LOST TWO WORDS EVERY TIME

**LANE** WORDS (12). **ROW** `[lexicon frozen]`, THE-DICTIONARY-IS-A-FILE-NOT-A-
DERIVATION. Claimed and pushed before the work (rule 5).

---

## 1. THE ROW'S PREMISE WAS WRONG, AND MEASURING IT FIRST IS WHY THAT MATTERS

The row, written off this lane's own 9/23 finding, said: *deleting a line deletes
a word from the dictionary.* I wrote that finding, so the premise was mine.

**IT IS NOT WHAT HAPPENS. A REBAKE THAT CHANGES NOTHING AT ALL LOSES THE SAME TWO
WORDS.** Run in a throwaway worktree at HEAD, touching nothing:

```
ES_ONLY committed      274 words
ES_ONLY after a no-op rebake   272 words
lost                   hermano, las
gained                 none
```

Nobody has to delete anything. The committed file and the factory's own output
have simply disagreed, every run, for as long as both have existed.

## 2. THE ROOT CAUSE, AND IT IS TWO DIFFERENT CAUSES WEARING ONE SYMPTOM

`ES_ONLY` is the list of Spanish words that **cannot be mistaken for English** --
the net `gates/language_gate.js` sweeps player-facing surfaces with. It is
derived: every glossed Spanish word, minus every word this game has ever said in
English. The derivation is right to exist; "no", "son" and "me" are words in both
languages and sweeping for them would fail every English line in the build.

**THE ENGLISH CORPUS IT SUBTRACTS IS OUR OWN WRITING, AND OUR OWN WRITING IS
SPANGLISH.** So the more Spanglish this game writes, the fewer Spanish words its
Spanish detector can see. That is a ratchet pointing the wrong way, and it is
silent, and it leaves the gate green.

The author already hit this once and fixed it with a `lang` label on every line.
The two words that still leak get through for two different reasons, and only one
of them is a mislabel:

```
hermano   ONE line labelled `en` that is plainly Spanglish:
          "So stop asking and start walking, hermano."
las       THE NAME OF THE CITY THIS GAME IS SET IN:
          "POST-ECONOMIC APOCALYPSE - LAS VEGAS"
```

**THE SECOND ONE IS NOT A MISTAKE IN THE DATA AT ALL.** That line is correctly
English. "las" in "Las Vegas" is a proper noun, and a proper noun is not evidence
about common vocabulary. So no amount of re-labelling fixes it, and a special
case for the city name would be the eleventh entry in this lane's ruler-failure
series.

## 3. THE FIX: ONE ENGLISH LINE IS AN ANECDOTE, NOT EVIDENCE ABOUT A LANGUAGE

A word counts as English only if the English corpus uses it in **two distinct
lines**. One sighting is an anecdote.

**MEASURED BEFORE IT WAS WRITTEN, AND IT IS NOT A SPECIAL CASE.** Across all 277
glossed words, a threshold of two moves **exactly the two broken ones and nothing
else**. The words that genuinely live in both languages are nowhere near the
line, which is the whole reason the derivation exists:

```
me      221 english lines        hermano   1 english line
no      114                      las       1
son       3
```

`english_vocabulary()` is untouched and still answers "has this game ever said
that word", which is what the missing-gloss check needs. The new
`english_evidence()` answers the different question, and only the ES_ONLY
derivation asks it. Two questions, two functions, minimum blast radius.

**RESULT: a no-op rebake is now identity. 274 in, 274 out, nothing lost.**

## 4. AND THE BELT THE ROW ACTUALLY ASKED FOR: A REBAKE MAY NEVER SHRINK IT

The cause found this round is one I did not predict, so the guard is written
against the **shape** of the failure rather than against that cause. After
deriving, the factory compares against the committed list and **refuses the
write** if a word would be lost, naming them.

**MUTATION-PROVED.** Take `hermano` out of the glossary and rebake:

```
THIS REBAKE WOULD SHRINK THE SPANISH DICTIONARY, so nothing was written.
  would lose (1): hermano
  If a word really is English now, take it out of ES_GLOSS in this file,
  on purpose, with the reason written beside it.
```

and `git diff` on the engine file is **empty**: the refusal is real, not a
warning printed next to a write that happened anyway. A checker that gets quietly
weaker is worse than one that is loudly wrong.

## 5. A SECOND BUG FOUND ON THE WAY, AND IT HAD ALREADY SHIPPED TWICE

The factory's replace-slot did not cover everything the factory emits, so every
rebake **left the old block and appended a new one**.

**MEASURED: `engine/bohemia_people.js` was carrying THREE identical `esStems`
declarations on main, byte for byte**, and both derived slices carried three as
well. The last declaration wins in JavaScript, so nothing was broken -- but
editing either of the first two changes nothing at all, and that is a trap with a
fuse on it. Widened the slot; the rebake is now idempotent:

```
rebake 1   esStems 1   ES_ONLY 274   129,175 bytes
rebake 2   esStems 1   ES_ONLY 274   129,175 bytes
rebake 3   esStems 1   ES_ONLY 274   129,175 bytes
```

## 6. *** AND THE LANGUAGE GATE HAD BEEN GREEN ON A STALE FILE ***

The honest, uncomfortable part of the round. Syncing the derived record turned
the language gate **RED, 84/1**, naming two words: `pass` and `closer`.

Isolated properly rather than guessed at: restoring only the old record, keeping
every other change of mine, went back to **GREEN 85/0**. So the red was the sync,
not the fix.

**THE CAUSE: those two words were in the COMMITTED record and were NEVER in the
factory's source set.** The only thing keeping that gate green on them was a
derived record that had drifted from the thing it is derived from. The gate was
passing on a hand-edited yardstick.

The source's own comment says what to do -- *"the answer is to write the word
down here where the next reader can see it, never to loosen the rule until it
stops catching things"* -- so both words are written down there now, with the
reason. **GREEN 85/0, on a yardstick that is actually derived.**

## 7. THEN THE GENERATOR LINES SHIPPED, WHICH IS THE ROW'S LAST CLAUSE

Eight player-facing lines carrying a banned phrase, rewritten **in their
factories, never in the JSON** -- editing derived tables is the exact disease
this row is about.

```
"What did it cost you?"                          -> "What did you give up for it?"
"It is not a no. It is bring somebody with you." -> "I am not saying no. I am saying
                                                    bring somebody with you."
"Nobody stops here. That is the whole reason
 I like it."                                     -> "Nobody stops here. That is why I
                                                    like it."
"...inside got worse than out here."             -> "...inside got worse than the street."
"It's {r}, that's the whole trick."              -> "It's {r}."
"Ya sé el tuyo. ...that's the whole trick."      -> "Ya sé el tuyo. ...It's {r}."
"That's the whole point of what you did,
 isn't it."                                      -> "That was the idea, wasn't it."
"Todo el mundo's heard. That's the whole point
 of what you did, no?"                           -> "Todo el mundo's heard. That was
                                                    the idea, no?"
```

**AND THE CLOSED-SET CHECK REFUSED THE WRITE OVER ONE WORD**, which is the check
working exactly as its comment promises: `idea` had never been said in English in
this game. Written down in the same set, with the reason, rather than dodged by
rewriting the line a second time.

**THE WHOLE POINT OF THE ROUND, PROVED:** on 9/23 this exact rewrite shrank the
dictionary and reddened a line I had never touched, and I reverted the lot. This
round, after all eight rewrites and four rebakes:

```
ES_ONLY before the round  274
ES_ONLY after             274
LOST                      NONE
```

**AND THE DEBT DROPPED 14 TO 6**, so the voice gate's ratchet was re-pinned DOWN
to 6 in the same commit. A ratchet left sitting above the real number is a gate
that has quietly stopped biting, which is the same failure mode as everything
else in this round.

## 8. GATES, AND WHAT IS NOT MINE

Run at the end, on the merged tree. The engine changed, so the derived city slice
was resynced with the repo's own tool in the same commit (standing duty 8).

`DERIVED FRESHNESS` is red and **it is not this round's**: a clean `origin/main`
worktree gives the identical 9/1. `BOHEMIA_RUN_CURRENT.html` has no module
markers, so the resync tool correctly leaves it alone; that slice is RUN's and I
did not reach into it beyond collapsing the duplicate blocks it already carried.

## 9. WHAT THIS DOES NOT PROVE

- **Nothing about whether any of the eight rewritten lines is good.** They are
  attempts, `draft:true`, measured only for the banned shape they no longer have.
- The threshold of two is right for the 277 words we have now. If the corpus ever
  grows a second stray sighting of a Spanish word, the threshold stops catching
  it -- and **the shrink guard is what catches that**, loudly, which is why both
  exist instead of either alone.

## ROUTED
- **ANY LANE THAT RUNS A FACTORY** -- a derived file that has drifted from its
  source can hold a gate green. Two of them did here, in opposite directions.
  Re-run your factory and diff before you trust a green.
