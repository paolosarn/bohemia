# BOHEMIA -- THE VOICE CARD (Paolo 8/26/26, the WORDS lane)
# SEVEN RULES. ONE PAGE. If you are writing a line in this game, this is the page.
# Diagnosis it comes from: records/BOHEMIA_VOICE_DIAGNOSIS_8_26_26.md
# EVERY NUMBER ON THIS PAGE IS NOW MEASURED AGAINST THREE REAL CORPORA (8/28):
#   617 films, a shipped BioWare RPG, and 99,478 turns of real recorded human
#   conversation. Tool: tools/bohemia_voice_fingerprint.py. Where a rule quotes
#   a target, that target is somebody else's actual number, not my taste.
# Gate: gates/voice_gate.js

## THE FRAME, BEFORE THE RULES
The writer is a machine, and machines have tells. The most probable next word is
by definition the least surprising one, and people do not talk in probable words.
**A LINE THAT COULD HAVE COME OUT OF ANY GAME IS A FAILED LINE.**

And the one sentence that fixes more of our lines than any other:
**NOBODY IN BOHEMIA IS WISE.** They are tired, scared, busy, proud, lying, and in
the middle of something else. Wisdom is what the player builds out of watching
them; it is never what they say.

---

## 1. THEY TALK LIKE THEY ARE IN A HURRY
Contract it. "I'll", "don't", "it's", "you're", "could've". Our scenes contracted
2.2% and our barks 75%, so the story sounded like scripture and the street
sounded like people. Real speech runs 89%, film 92%. **FLOOR 85%.** Spelling a
phrase out in full is a CHOICE, once in a scene, for weight. The default is fast.

## 2. CUT THE LAST SENTENCE
A third of our speeches end on a general truth, sitting where a punchline goes.
Delete it. Let the speech end on the concrete thing: the hour, the cable, the
kid, the smell. The player supplies the meaning, and the meaning they supply is
worth more than the one you handed them.
THE TEST: could this sentence be printed on a poster? Then it is not dialogue.
> WAS: "You did not make a show of it. That is worth more out here than you will
> understand for a few years."
> IS: "You didn't make a show of it. I noticed. Not going to say anything else
> about it."

## 3. SOMEBODY HAS TO ASK, SOMEBODY HAS TO FUMBLE
In 504 NPC speeches there are TWO question marks, ZERO raised voices, ZERO
stumbles. Every scene now carries at least one of each:
- an NPC ASKS THE PLAYER something (and the answer can change nothing)
- a person REPEATS A WORD, loses the thread, corrects themselves, or refuses to
  answer at all. Silence extracts: the person who is not pushed volunteers more
  than the person who is.
A conversation is two people trying to find something out. A menu of statements
with replies underneath is a vending machine with a face on it.
MEASURED TARGETS, and they are lower than film on purpose. Film asks a question
in 31% of lines; REAL PEOPLE ONLY ASK IN 7.7%, because in life the listening is
carried by "yeah" and "right" and a game cannot spend 40% of its lines on that.
So a game splits the difference: **ASK IN 15% OF LINES, FLOOR 12%.**
AND SAY WHO YOU ARE TALKING TO. Film 22.8%, KOTOR 23.9%, real speech 31.4%, and
our street barks 3.7%. "Man." "Boss." "Hermano." One word, and it is the
cheapest acknowledgement there is. **FLOOR 12%.**
**AND NOBODY LEADS WITH A NO.** This is science, not taste: a yes lands in about
269 ms and a no in about 561, and the gap gets FILLED -- a breath, a preface, an
appreciation, the reason before the refusal, often a trail-off that means no
without saying it. So: a character who agrees answers instantly; a character who
refuses buys a second first. Ours hedge 4.8% of the time. Free characterisation,
one word.

## 4. NINE WORDS, THEN TWO
Vary hard inside a single speech. Our flattest scene is the first quest in the
game. If every sentence in a scene sits between four and nine words, it is flat,
and flat is the first tell an editor sees.
Break it with a fragment. One word is a sentence. So is "Huh."
> "Easy. Easy, easy. Don't touch that, it's live."

## 5. NAME THE ONE THING ONLY THIS PERSON WOULD NAME
Every speech carries one physical detail that comes from THIS person's job, body,
memory or fear, and from nowhere else. A lineman says "warm cable" and "nine
o'clock". A midwife says something a midwife says. Generic scene-setting is the
tell; a detail nobody else in the build could have said is the cure.
And the register comes from the PERSON -- where they learned English, who raised
them, who they are talking to. It is a fact about them, never seasoning
sprinkled on a scene. Spanglish is a skill. It never gates required information.
**CLASS AND REGION LIVE IN SYNTAX, NEVER IN SPELLING.** Never respell a word to
show an accent, in any language, ever. Carry it in grammar ("I seen him", a
double negative), in what they call things, and in rhythm.

## 6. THE LINE IS NOT THE POINT
Everybody wants something they will not say out loud. The best line in this game
might be somebody refusing to answer, and the second best might be a prop.
People talk PAST each other. They answer the question they wish you had asked.
They use the polite word for the ugly thing and dare you to say the ugly one.
A line whose whole meaning sits on its surface is usually the weak one.

## 7. PUT A COMMA WHERE YOU WANT TO PUT A FULL STOP
This is the number one machine tell in our writing and it was found by a
detector, not by taste. Trained to tell our lines from 617 films, the single
largest feature in the model, three times bigger than anything else and
identical against a real RPG, is SENTENCES PER WORD. We chop.
Commas per hundred words: **real people 16.2, film 5.3, KOTOR 4.2, us 3.5.**
The fewest of anybody. Every comma we do not write is a full stop instead, and a
person mid-thought does not stop, they keep going and let it run.
> OURS:  Where then.
> A PERSON: Where, then?
That line is the whole tell: a question, punctuated as an inscription. When a
line splits into two short sentences, ask whether a person would have kept going.
TWO HOUSE HABITS THAT LEAKED IN AND ARE NOT CHARACTER TRAITS:
- **NEGATION.** 48% of our lines are a denial against real speech's 21%. Not,
  never, nothing, nobody. Say what IS one time in three.
- **NUMBERS.** We quote a figure in 22% of lines, everybody else in 7 to 10. That
  came from this repo's own "numbers over adjectives" rule for REPORTS. It is
  not how four hundred people talk.

---

## THE BANNED LIST (say it a different way)
- "that is the whole ___" / "that is the part that ___"
- "___ is not a ___. It is a ___." (the flip, the aphorism engine)
- "worth more than", "the price of", "it costs you" -- and every ledger word.
  There is no money. People say what they were actually handed.
- "out here" as the last two words of a speech
- "nobody ever ___" / "most people never ___"
- em dashes. Anywhere. Ever.

## WHERE THIS CAME FROM, AND WHAT THE GATE CANNOT SEE
Rules 1-6 answer eight measured tells in the diagnosis; rule 7 was found by a
detector trained on 617 films. The craft under them is in
records/BOHEMIA_RESEARCH_HOW_A_SENTENCE_SOUNDS_8_27_26.md and the corpus work in
records/BOHEMIA_WORDS_TRAINING_FILE.md.
gates/voice_gate.js measures SHAPES: rhythm, repeated openers, the banned list,
and the rule-7 numbers. **IT CANNOT TELL YOU IF A LINE IS GOOD.** A green gate is
not a good scene and never will be. Read it out loud; that is still the only test.

## WHAT IS HIS
Every word, forever. Nothing here is put to him for approval: lines ship written,
playable and tagged `draft:true`, and he edits them in the WORDS tab. The job of
this card is that the draft he edits does not sound like a robot wrote it.
