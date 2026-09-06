# WORDS Q17 -- WHAT A DISTORTED RUMOUR SOUNDS LIKE
# VAMILY research round, 9/5/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "What a distorted rumour sounds like. PEOPLE is building
# rumours that travel about somebody who is not you and that get things WRONG
# (harvested last round). Research how real gossip distorts: what gets exaggerated,
# what gets dropped, what gets attached to the wrong person, and how the best games
# write a lie that a player can catch. Test lines: ten true rumours and their
# three-hops-later versions, draft:true."

## THE ANSWER IN ONE LINE
**A rumour is only catchable if it tells you where to go and look, and we have 249
lines that name a place a player could walk to, 17 lines that pass on something
second-hand, and ZERO lines that do both. Every rumour in this game is
unfalsifiable, not because it hedges, but because it never gives an address.**

## 1. THE MEASUREMENT
A lie a player can catch needs two things: a claim the speaker did not witness, and
somewhere the player can go to check it. So I counted both, across all 1,669 NPC
lines.

    lines naming a place you could walk to          249    14.9%
    lines passing on something second-hand           17     1.0%   (Q13)
    LINES THAT DO BOTH                                0     0.0%

**Two hundred and forty-nine addresses and seventeen rumours, and the intersection
is empty.** Our rumours are about the player's reputation, which has no address,
and our places are named by people who are standing in them, who therefore are not
reporting anything.

**AND A CONTRADICTION IS STRUCTURALLY IMPOSSIBLE IN THE CURRENT CORPUS.** To catch
a lie by contradiction you need two accounts of ONE event. Q13 measured that exactly
one line in this game passes on news about the world (the father, on the water
district hiring). **One account of one event cannot disagree with anything.**

PEOPLE's row `A-RUMOUR-ABOUT-SOMEBODY-WHO-IS-NOT-YOU` is still OPEN, so the words
are being written ahead of the mechanism. That is the correct order for this lane
and it means the spec below can be built into the machine rather than retrofitted.

## 2. THE THREE MECHANICS, AND THEY ARE THREE DIFFERENT BEHAVIOURS
The row asks three separate questions and the research answers them separately.
This is the useful part of the round.

### WHAT GETS DROPPED, AND IT IS NOT THE UNIMPORTANT PART
The replicated finding is **socially shared retrieval-induced forgetting**. When a
speaker selectively retells part of a shared memory, **both the speaker AND the
listener then forget the UNMENTIONED but RELATED material more than unmentioned
unrelated material.** It has been shown on well-rehearsed, emotionally intense
memories, not just word lists.

**SO TELLING HALF A STORY ACTIVELY DESTROYS THE OTHER HALF, AND IT DESTROYS IT IN
THE LISTENER TOO.** The consequence is the part a game can use: **speaker and
listeners come to remember, and forget, the event in the same way.** A street does
not end up with many partial versions. It ends up with ONE version and everybody
has the same hole in the same place.

**THIS IS THE FINDING THAT PROVES ME WRONG.** I would have modelled distortion as
random decay, details falling off at random per hop. The evidence says the loss is
STRUCTURED and SHARED: the detail next to the one that gets repeated is the one
that dies, and it dies for everyone at once.

### WHAT GETS ADDED, BECAUSE A STORY GAINS AS WELL AS LOSES
Bartlett's serial reproduction work found **rationalisation** in almost every chain:
when somebody cannot make sense of a piece, they either drop it **or explain it with
the addition of new material.** People add REASONS that were never there, to make
the story hang together. And unfamiliar things get swapped for the nearest familiar
thing: in his data, canoes became boats and hunting became fishing.

**SO A RUMOUR DOES NOT ONLY SHRINK. IT ACQUIRES A CAUSE IT NEVER HAD, and the cause
is always something the teller already believes.** That is why a rumour is such a
good way to teach a player about a place: the invented half tells you what that
street assumes about the world.

### WHAT GETS ATTACHED TO THE WRONG PERSON, WHICH IS TWO THINGS AT ONCE
**SOURCE MONITORING FAILURE:** people misattribute where information came from,
**confusing what they were told with what they actually observed.**

**THE SLEEPER EFFECT:** a claim from a source you discounted gains force over time,
because the discounting cue and the message come apart in memory. A meta-analysis of
72 experiments confirms it under specific conditions, and the mechanism is that
memory for the argument persists independently of memory for the cue.

**PUT TOGETHER, THOSE GIVE TWO LINES A WRITER CAN USE AND NEITHER IS OBVIOUS:**

    1. **THE DOUBT EVAPORATES BEFORE THE CLAIM DOES.** "Somebody told me, and I
       don't believe him, that the pump ran past dark" becomes, three hops later,
       "the pump ran past dark." The hedge is the first thing to go.
    2. **AND THE TELLER COMES TO BELIEVE THEY SAW IT.** At three hops the honest
       thing to write is not "I heard" but "I saw", said by somebody who did not,
       and who is not lying.

**THAT SECOND ONE IS THE BEST LINE IN THIS ROUND.** A person saying "I was there"
about something they were only told is not a liar. That is what makes a rumour
frightening in a small place: everybody is honest and the story is still wrong.

## 3. HOW TO WRITE A LIE A PLAYER CAN CATCH, AND THE TRAP IN IT
The design literature is clear on the mechanism: **a statement is checkable when it
is OBSERVABLE, that is, when the player can go to a named place and corroborate it.**
An NPC says the thing is in the shed; the player goes to the shed; the thing is not
in the shed. That is a caught lie, and it needs no interrogation system.

The other pattern is contradiction: one person says it, a second refutes it, and the
confrontation exposes why the first one said it.

**AND HERE IS THE TRAP, WHICH IS A REAL RESEARCH FINDING AND NOT A CAUTION I MADE
UP.** Work on how players perceive deception in games finds that what decides
whether a false statement reads as a LIE or as a BUG is whether it seems
**intentionally authored.** A player who cannot tell a written lie from a broken
quest will file it as broken, tell their friends the game is buggy, and stop
trusting every NPC including the honest ones.

**SO A FALSE RUMOUR MUST ARRIVE WITH ITS OWN FINGERPRINTS:** a hop count the player
can feel, a hedge that got worn off, a name that shifted, or a second person who
says it differently. The distortion has to be legible as distortion. **An unmarked
falsehood is indistinguishable from a defect and will be reported as one.**

## 4. THE SPEC
1. **A RUMOUR CARRIES AN ADDRESS OR IT IS NOT A RUMOUR.** Zero of ours do. This is
   the single change that makes everything else in this round possible.
2. **DISTORTION IS STRUCTURED, NOT RANDOM.** The detail that dies is the one next
   to the detail that gets repeated, and everybody loses the same one. Two people
   at three hops should have the SAME hole, not different holes.
3. **THE HEDGE WEARS OFF BEFORE THE CLAIM.** Hop 0 says "somebody told me and I
   don't believe him." Hop 3 says it flat.
4. **AT THREE HOPS SOMEBODY SAYS "I SAW".** And is not lying.
5. **THE INVENTED HALF IS A REASON, AND THE REASON IS THE STREET'S OWN ASSUMPTION.**
   That is where the player learns about the place rather than the event.
6. **NEVER TWO NAMES IN A ROW.** The wrong name should attach to somebody the
   player has already heard of, so the error is legible. A wrong name nobody knows
   is just noise.
7. **AND EVERY FALSE RUMOUR IS CHECKABLE WITHIN A SHORT WALK**, or it is a bug in
   the player's eyes and there is research saying exactly that.

## ROUTED
- **WORDS**  Q17 answered. The WORDS queue now has no OPEN research row; what
  remains is the four BUILD rows held until Paolo returns this lane to MODE: BUILD.
- **WORDS**  NEW ROW `A-RUMOUR-WITH-AN-ADDRESS`: every rumour names a place the
  player can walk to, and the hop ladder is written as four pools. Held until
  MODE: BUILD.
- **PEOPLE**  For `A-RUMOUR-ABOUT-SOMEBODY-WHO-IS-NOT-YOU`, three things the
  mechanism needs that are cheaper than they sound. A rumour needs a PLACE field,
  because an address is what makes it checkable. Distortion should be SHARED, not
  per-mind: everyone who heard the same telling loses the same detail, which is one
  seed rather than one roll per listener. And the hedge and the source should decay
  FASTER than the claim, which is one extra number on the row.
- **QUESTS**  A false rumour with an address is a quest nobody had to author: the
  player walks there and finds out. That is the cheapest content in this design.
- **UI**  A rumour the player has checked and disproved should be visibly different
  from one they have not, or the player cannot tell a written lie from a defect,
  and the research says they will assume defect.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.
Ten true rumours and their three-hops-later versions, as the row asked for.

## SOURCES
- Socially shared retrieval-induced forgetting: a speaker's selective retelling
  induces both speaker and listener to forget unmentioned but RELATED material more
  than unmentioned unrelated material, demonstrated on well-rehearsed and
  emotionally intense memories, with the result that speaker and listeners come to
  remember and forget the event in the same way.
- Bartlett's serial and repeated reproduction work: rationalisation appearing in
  almost every chain, with people either dropping what they cannot comprehend or
  explaining it with added material; unfamiliar detail replaced by the nearest
  familiar thing; stories becoming shorter, simpler and more stereotyped.
- Source monitoring failure: people misattribute where information came from,
  confusing what they were told with what they observed.
- The sleeper effect: a delayed increase in a message's effect as the discounting
  cue and the message dissociate in memory, confirmed by a meta-analysis of 72
  experiments under specified conditions.
- Detective and deception design: a statement is verifiable when it is observable
  and the player can corroborate it in the world; the contradiction pattern of one
  NPC refuting another; and research on player perception of deception finding that
  whether a false statement reads as authored or as a bug is what decides how
  players take it.
- Our own build: 249 lines naming a walkable place, 17 second-hand lines, zero
  overlap; and Q13's measurement that exactly one line passes on news about the
  world, which makes a contradiction structurally impossible today.
