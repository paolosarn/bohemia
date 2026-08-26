# BOHEMIA — THE WORDS LANE BRIEF (Paolo 8/26/26)
# Read this FIRST if your first word is "words" (or "writing", "dialogue",
# "human"). Created because he asked for it:
# "I think we might have to open up a chat for how to speak like a human,
# how to write stories like a human, how to write dialogue for humans
# like humans would across games and shit... I'm really gonna need its
# help... it's time we have a new chat, like, write and sound like a
# human for Bohemia."

## 1. THE HONEST REASON THIS LANE EXISTS
**THE WRITER IS A MACHINE, AND MACHINES HAVE TELLS.** That is not a
put-down, it is the working condition. Every line in this game is written
by something that was trained to produce the most probable next word, and
the most probable next word is, by definition, the least surprising one.
People do not talk in probable words. THIS LANE'S ENTIRE JOB IS THE GAP
BETWEEN THOSE TWO THINGS.
### THE TELLS, NAMED, SO THEY CAN BE HUNTED
Editors who spot machine prose for a living report the same handful, and
every one of them is a knob we can turn:
- **UNIFORM RHYTHM.** Sentences of similar length and shape, one after
  another. Everything reads smoothly and nothing stands out. Humans vary
  hard: a nine-word sentence next to a two-word one.
- **THE SAME RHETORICAL MOVE, REPEATED.** Summary, explanation, balanced
  close. Then again. Then again.
- **THE COMFORTABLE MIDDLE LANE.** Polite, even, bland. Nobody is rude,
  nobody trails off, nobody is boring in the specific way real people are
  boring.
- **RECYCLED PHRASING AND GENERIC SCENE-SETTING.** The "in today's
  fast-paced world" family.
- **PREDICTABILITY.** Ideas develop the way you expect. Real people
  change the subject, answer a different question, or say nothing.
**A LINE THAT COULD HAVE COME OUT OF ANY GAME IS A FAILED LINE.**

## 2. THE GOOD NEWS: THE MONTH OF RESEARCH IS MOSTLY ALREADY BANKED
He worried this needs "a month of rounds of research with this new chat."
**MOST OF IT IS DONE AND IT IS SITTING IN THE REPO.**
- `questbook/` — **244 FILES. 152 quests studied to the bone**, from The
  Bloody Baron and Whispering Hillock to Disco Elysium, Kingdom Come, the
  ME2 suicide mission, Vault 11, Dead Money and Nocturne Op55N1.
- **FOUR MASTERS**: CRAFT, FLAWS, PORTS and CONVERSATIONS.
- `records/BOHEMIA_QUESTBOOK_LAW_INDEX.json` — **3,672 CITABLE
  FINDINGS**, each with an id and a verbatim title.
- `records/BOHEMIA_WORDS_BOOK.json` — **1,910 authored player-facing
  lines**, 1,864 of them already citing the laws they were written from.
**SO DO NOT START A MONTH OF READING. START BY USING WHAT IS THERE.**
### AND HERE IS THE HOLE IN IT, WHICH IS WHY THE LANE IS NEW
The catalogue is about **WHAT HAPPENS** — structure, hooks, reversals,
choices, consequence. It is very good at that. **IT IS NOT ABOUT HOW A
SENTENCE SOUNDS.** Nothing in 3,672 findings tells you why one line lands
and the next one dies. THAT IS THE MISSING LAYER AND IT IS THIS LANE.

## 3. WHAT THE PRACTITIONERS ACTUALLY SAY
- **CHRIS AVELLONE: "TALKING HEAD CONVERSATIONS ARE A DEAD END."** He is
  explicit that some of the best game stories are told with props, audio,
  environment and level design shaping a moment, and that a writer must
  know how to tell it WITHOUT WORDS. He also says: learn grammar cold
  before breaking it, and learn to EDIT. And that the story should feel
  like a collaboration with the player, never dictation.
- **EMILY SHORT: CONVERSATION IS GAMEPLAY.** Expressive player dialogue
  is what makes roleplaying possible — the player should be able to plan
  ahead, pick an approach to a person, and carry it out. She also builds
  toward characters who speak from their own KNOWLEDGE AND MEMORY and in
  language specific to their current mood, which is exactly our problem:
  our people are generated, so their lines have to come from what they
  know, not from a bag of lines.
- **SUBTEXT IS THE CRAFT.** Characters talking PAST each other, saying
  one thing and meaning another. Authentic dialogue is full of unspoken
  messages, and a line whose meaning is entirely on its surface is
  usually the weak one.
**THE BOHEMIA VERSION OF ALL THREE:** the best line in this game might be
somebody refusing to answer, and the second best might be a prop.

## 4. THE LAWS THAT ALREADY BIND YOU — DO NOT RE-LITIGATE THESE
- **ALWAYS MAKE AN ATTEMPT (8/11).** Every piece of player-facing text
  ships as a real attempt, written as if it ships, tagged `draft:true`.
  An empty field is a blank page and HE DOES NOT WRITE FROM NOTHING, HE
  EDITS.
- **DIALOGUE ALWAYS REFERS TO THE CATALOGUE (8/11).** No line is ever put
  to him for approval. Not a ballot, not an A/B, not a bolded question.
  It ships written and playable and he edits later. What replaces his
  thumb is the corpus: cite the study id and title verbatim, plus an
  `applied:` line saying what you actually used. A scene spans at least
  two studies and two masters.
- **THEY SPEAK SPANGLISH (8/25).** Three registers and the mix is
  mandatory: english-dominant, SPANGLISH (fluent, switching mid-sentence
  because it is faster — the headline register), and spanish-dominant /
  poor english (SOME people, never all). Spanglish is a SKILL, not a
  broken language. Switch at clause boundaries and for a REASON. NEVER
  phonetic accent spelling. **LANGUAGE NEVER GATES REQUIRED
  INFORMATION.**
- **THERE IS NO MONEY (7/26, narrowed 8/15).** The only legal use of the
  word is the DEAD PAST — what somebody used to have. Never a live
  transaction. People say what they are actually handed: medicine on the
  barrel, a case of batteries, half a tank, a roll of tape.
- **THERE ARE NO RUNS (8/26).** One character, about a hundred hours.
  Nothing you write may assume a reset.
- **NEVER USE EM DASHES**, anywhere, ever. And eighth-grade reading in
  anything he reads about the work.

## 5. YOUR FIRST JOB
**NOT a style guide. A DIAGNOSIS.**
Take a real sample of the 1,910 authored lines already in the game, read
them the way an editor reads for machine tells (§1), and come back with:
  1. **WHICH TELLS WE ACTUALLY HAVE**, with counts and quoted examples
     from our own text. Measured, not asserted.
  2. **THE FIVE OR SIX RULES** that would fix the ones we have — the
     BOHEMIA VOICE CARD, one page, short enough to hold in your head.
  3. **ONE SCENE REWRITTEN** both ways, side by side, so the difference
     is visible instead of described.
Then it goes in the WORDS tab where he edits every line anyway.

## 6. HOW YOU SHIP
A law without a machine gate is not enforced, so the voice card gets a
gate — and the honest version of that gate measures **RHYTHM** (sentence
length variance across a scene), **REPEATED OPENERS**, and **BANNED
PHRASES**, because those are the tells a machine can actually see. It
CANNOT check whether a line is good. Do not pretend it can. Commit
straight to main, never a pull request. One system, one session: QUESTS
owns WHAT HAPPENS, you own HOW IT SOUNDS.

## 7. WHAT IS HIS
Every word, forever, whenever he wants it. You are not writing the final
text. **YOU ARE MAKING SURE THE DRAFT HE EDITS DOES NOT SOUND LIKE A
ROBOT WROTE IT**, so that editing it is a pleasure instead of a rescue.
