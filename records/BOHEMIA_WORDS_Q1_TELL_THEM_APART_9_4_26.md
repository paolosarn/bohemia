# WORDS Q1 -- TWO PEOPLE, THREE LINES EACH, NAMES REMOVED
# VAMILY research day, 9/4/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "Two people, three lines each, and you can tell them
# apart with the names removed. What the best-written games do with vocabulary,
# rhythm and the thing a person never says. Measure our 504 NPC lines for it."

## THE ANSWER IN ONE LINE
**Three lines is not enough text to identify a human being, so anything a player
can tell apart in three lines was PLANTED there. The good games plant it. We
mostly do not, and where we do it is by accident.**

## 1. I RAN THE TEST THE QUESTION NAMES
Three lines from person A, three from person B, names removed, then a fourth line
from A. Which pair does it belong to? Chance is 50%.

    FILM, two people in one movie          54.7%   (3,998 trials)
    BOHEMIA, our valley                    59.6%   (4,000 trials)
    KOTOR, the nine-companion party        68.0%   (4,000 trials)

**Professionally written film characters are a coin flip at three lines.** We beat
them. A deliberately assembled RPG party beats us by eight and a half points.

## 2. THE AISLE THAT CHALLENGES THE QUESTION ITSELF
Forensic linguistics does this for a living, on real people, with a person's
liberty on the outcome. Its numbers:
- Vocabulary-richness attribution methods **need texts of more than 1,000 words**,
  and that requirement "cannot be met within the typical forensic situation".
- At 1,000 words, attribution "can only provide indications" and cannot make a
  definitive claim.
- For binary attribution of very short texts, **best accuracies hover around 0.8
  even when the author profile is longer than 40,000 words**.

Three lines is about **thirty words**. That is **three per cent** of the floor
where a forensic linguist will offer a hedged indication.

**So the premise of Q1 is impossible as realism and correct as craft.** Real
idiolect is not detectable in three lines by anybody, ever. Film sits at 54.7%
because film characters differ the way real people differ, which is to say barely.
KOTOR sits at 68% because a Wookiee, a murder droid and a Mandalorian mercenary
were BUILT to be told apart. **The eight points between us and KOTOR are not
observation. They are manufacture.**

THE LESSON THAT CHANGES HOW I WRITE: stop trying to make people naturally
different, because natural difference is invisible at the length a player reads.
Plant the difference on purpose, and plant it in the first three lines.

## 3. WHAT THE BEST-WRITTEN GAMES ACTUALLY DO, AND IT IS A TYPED SPEC
The clearest statement of the method comes from game LOCALISATION, which is the
discipline that has to reproduce a voice in a language the original writer does
not speak. Its artefact is a **character bible**: a document fixing, per character,
**tone, formality, vocabulary, verbal tics, swearing level and sentence length**,
so that translators do not make those calls themselves and let the cast drift.

That is six typed fields, it is exactly FACTORY LAW shaped, and it is the thing
this lane has never had. Our voice card governs the HOUSE voice. Nothing in this
repo governs one person's.

## 4. THE THING A PERSON NEVER SAYS, MEASURED
The half of Q1 nobody here had touched. I re-ran the same three-line test but
scored it **only on what each sample AVOIDS**: the probe line is penalised for
using common words the three-line sample never used. Nothing about what the
speaker does say counts.

    full signal (everything)        BOHEMIA 59.6%    KOTOR 68.0%
    ABSENCE ONLY                    BOHEMIA 58.4%    KOTOR 65.6%

**97% of our signal and 96% of KOTOR's survives when you throw away everything a
person says and keep only what they refuse to say.** The negative space is not a
garnish on characterisation. It is very nearly all of it.

And at volume it becomes visible to a reader. KOTOR's droid, in 5,824 words, never
says *get, want, maybe, can't, people*. The Wookiee, in 3,894 words, never says
*master, dark, side, force*. The Mandalorian never says *am*. Those are decisions,
and you can feel every one of them without being told.

## 5. THE BROKEN RULER I CAUGHT BEFORE PUBLISHING IT
My first negative-space measure said our speakers avoid **55.9** of the cast's 120
commonest words and KOTOR's avoid **15.7**, which reads as us being four times more
distinctive than BioWare. It is nonsense: our speakers hold 120-170 words each and
KOTOR's hold 3,894-13,167. **You cannot use 120 common words inside 150 words of
speech.** The measure was reporting corpus size.

At a fixed 120-word budget for every speaker in both games:

    BOHEMIA avoids 76.2 of 120        KOTOR party avoids 81.0 of 120

Close, and the sign is now the other way. **Fourteenth broken ruler of this
lane, and the fourth whose error flattered us.** Any per-speaker number gets a
fixed budget before it gets written down.

## 6. MEASURED AGAINST OUR OWN CAST
- Our 39 speakers with 120 or more words are separable at **59.6%** on three lines.
- The separability is **almost entirely negative space** (58.4 of the 59.6).
- Our speakers are thin: most hold 120-170 words, against 3,894-13,167 for a KOTOR
  companion. **A voice cannot be built out of 150 words**, which reframes our old
  "27 of 51 speakers score zero" finding: some of those speakers do not have a weak
  voice, they have almost no lines.

## 7. WHAT THIS SAYS TO DO, WHEN THE LANE RETURNS TO BUILD
1. **A CHARACTER BIBLE ROW PER NAMED SPEAKER**: tone, formality, vocabulary, verbal
   tic, swearing level, sentence length. Six fields, typed, generated empty and
   filled only where a ruling exists.
2. **PLANT IN THE FIRST THREE LINES.** A player meets somebody for three lines. If
   the marker is not in those three, it does not exist.
3. **WRITE THE BAN LIST, NOT THE WORD LIST.** Because 97% of the signal is absence,
   the strongest field in that bible is *what this person never says*, and it is
   the cheapest to hold: a list of five words, checkable by machine.
4. **DO NOT SPREAD THE CAST THINNER.** A named voice needs volume. Better twelve
   speakers with 400 words than forty with 150.

## ROUTED
- **WORDS**  Q1 answered. Next open is Q2 (speech under stress).
- **WORDS**  NEW ROW `THE-BAN-LIST`: five words each named speaker never says, in
  the character bible, machine-checkable. Held until MODE: BUILD.
- **PEOPLE** A named person needs 400+ words before they read as a person at all.
  That is a casting and content-volume question, not a phrasing one.
- **QUESTS** Whoever decides how many named speakers a scene carries: fewer, deeper.
- **UI**     None.
Test lines: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.

## SOURCES
- Forensic authorship attribution: the >1,000-word requirement, the "indications
  only" limit at 1,000 words, and binary accuracy near 0.8 on very short texts with
  40,000-word profiles (Grant; Wright and Johnson, n-gram textbite work; Aston
  author-identification and linguistic-uniqueness literature).
- Character bibles in game localisation: tone, formality, vocabulary, verbal tics,
  swearing level, sentence length fixed per character so translators do not drift.
- Our own words book; the KOTOR corpus (van Stegeren and Theune, INT 2020); the
  Cornell Movie-Dialogs Corpus.
