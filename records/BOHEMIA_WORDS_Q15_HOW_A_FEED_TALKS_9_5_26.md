# WORDS Q15 -- HOW A FEED TALKS
# VAMILY research round, 9/5/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "How a feed talks. The city screen scrolls posts about
# what you did and what the world did. What real small-community feeds and the best
# in-game feeds sound like, and how to keep an auto-generated post from reading
# like a press release. Test posts for five deeds and five world events."

## THE ANSWER IN ONE LINE
**Our feed is written in a warm lowercase voice and it is structurally a press
release, because the single thing that makes a press release is deleting the person
who did it, and EVERY POST THAT CARRIES ACTUAL NEWS HAS NO PERSON IN IT. The word
we use to delete them is "somebody", four times. And a real community feed is more
than half REPLIES, while ours is fourteen monologues that never answer each other.**

## 1. WHAT IS ACTUALLY THERE, AND IT IS GOOD WORK
`engine/bohemia_feedstream.js` shipped this round from another lane, and it is
built right: it emits DIFFS, not descriptions, so the first drain is silent because
"the grid is at 358" is not news and "the grid just lost a block" is. It reads the
deed ledger, the power map, the price table and the faction graph and invents
nothing. Its own header says the text is a `draft:true` attempt and that WORDS owns
the voice. **This round is the voice, not a redesign.**

Counted in the file: **16 post call sites, 14 carrying text.**

    1  what YOU did      the deed ledger
    4  what the WORLD did lights, prices, faction seats, new roofs
    10 ambient life       what the valley is like right now
    8  handles            @thecircuit @nobodysgas @thevalley @eastwardEve
                          @nightcount @waterline @duststop @marisol_v

## 2. THE FINDING THAT PROVES US WRONG
The literature on bureaucratic language is blunt about what makes it bureaucratic,
and it is not long words. It is **nominalisation and the agentless passive**, and
one summary puts the whole thing in a sentence: **the bureaucratic voice's purpose
is uniform, to erase and efface any active agent.** "The reform was implemented."
Nobody implemented it.

So I ran that as the ruler on all fourteen posts, by hand: **does this post name a
human being who did something, or address a human being who will?**

    5 of 14  YES: an agent or an addressee
    9 of 14  NO
    and 4 of the 9 use "somebody" as an agent-shaped hole where a person goes

**AND IT SPLITS PERFECTLY BY SOURCE:**

    the DEED post (what you did)      no agent      "word is you did right by X"
    all 4 WORLD posts (what happened) no agent, 0/4
    the 10 AMBIENT LIFE posts         5 of 10 have one

**THE POSTS THAT REPORT SOMETHING HAPPENING HAVE NO PEOPLE IN THEM. THE POSTS THAT
REPORT NOTHING HAPPENING DO.** That is exactly backwards, and it is not a style
problem, it is the definition of the register the question asked us to avoid.

Read them next to each other and it is obvious which lane the writing is in:

    NO AGENT   "3 blocks went dark. nobody is saying why."
    NO AGENT   "water is up to 3 batteries. it was 2 last week."
    NO AGENT   "REDS is a town now. it was a camp."
    NO AGENT   "somebody has put a roof up where there was nothing. good."

    HAS ONE    "queue at the standpipe already. bring something to sit on."
    HAS ONE    "wind off the dry lake all afternoon. tape your windows."
    HAS ONE    "no lights anywhere from the ridge. just the stars, and they do
                not help."

The bottom three are the best writing in the file and they share one shape:
**somebody saw a thing and is telling YOU to do something about it.** An observer
and an addressee. That is what a neighbour sounds like.

**AND THE WEAKEST LINE IS THE ONE HE WILL READ MOST.** The deed post, the whole
point of the feature, is:

    "word is you did right by keeper."

Three things wrong in six words. **"word is" is a rumour marker stuck on a
certainty** the game read straight out of its own ledger (and Q13 just measured our
whole hop system, so we can say how many mouths it crossed and we are guessing
instead). **"keeper" is a job title, not a person** (Q12: 57 speakers, zero names,
and the engine has 64 given names it never speaks). And **"did right by" is the
ledger's plus sign in a costume**: no place, no detail, no consequence.

## 3. WHAT A REAL SMALL-COMMUNITY FEED ACTUALLY SOUNDS LIKE
A study of 30 neighbourhood feeds collected **about 116,000 posts and about 164,000
comments.**

**MORE COMMENTS THAN POSTS. Roughly 1.4 replies for every post.** A real community
feed is majority REPLY. Ours is fourteen monologues from eight handles who have
never once addressed each other.

And what people actually post, in measured order of frequency:

    1. SEEKING OR OFFERING SOMETHING     the single most frequent kind
    2. LOGISTICS                         lost animals, transport, events
    3. PLEASANTRIES                      good wishes, and the weather

**NUMBER ONE IS SOMEBODY WANTING SOMETHING FROM A NEIGHBOUR, AND OUR FEED HAS NONE
OF IT.** Nobody in this valley ever asks the valley for anything. Every post we
have is an announcement, and announcements are the thing a real feed does least.

Number three is the one we already do best, and it is worth noticing that our two
strongest posts are both weather.

**AND THE UGLY ONE, WHICH BELONGS IN THIS GAME MORE THAN ANY OF IT.** The same
research finds that publicly naming perceived OUTSIDERS, especially over small
thefts, is the recurring content of a real neighbourhood feed, heaviest where a
neighbourhood is changing hands. **In a valley cut into faction territory, that is
not a dark detail, it is the main thread.** It is also where the feed, the rumour
system (Q13) and naming (Q12) become one feature: a post about somebody who does
not belong, with a name in it, that may not be true.

## 4. WHAT GAMES DO, HONESTLY: NOT MUCH
This is the thinnest half of the round and I am not going to inflate it. Generated
activity feeds in games are mostly achievement plumbing: a system captures that
something happened and posts a short description that, as one such system's own
documentation admits, **"typically does not provide the viewer with much context
for understanding what happened."** The same design literature says the real work
is deciding **which events are worth posting at all**, because most are not.

**SO THIS IS OPEN GROUND, AND THE STANDARD TO BEAT IS LOW.** The bar is not another
game's feed. It is whether a person reading our feed learns something about this
world that nobody told them, which is what Paolo asked for in the ruling: "you'll
learn more about the world."

## 5. THE SPEC
1. **EVERY POST NAMES SOMEBODY OR TALKS TO SOMEBODY.** That single rule kills the
   press-release register outright, because deleting the agent is the whole of what
   that register is. If a post cannot name a person, it can address the reader
   instead. If it can do neither, it is a status bar and should not post.
2. **"SOMEBODY" IS BANNED AS AN AGENT.** It is our agentless passive with a friendly
   face, and it is in four of fourteen posts. Either the game knows who, and says
   so, or the post is about the thing and not the person.
3. **THE DEED POST IS A REPORT FROM A MOUTH, NOT A LEDGER READ.** It needs the
   place, one detail, and who is saying it. And if the game knows the hop count,
   the post should sound its distance: a thing you did an hour ago in front of
   people reads differently from a thing that reached this handle third-hand.
4. **SOMEBODY ASKS FOR SOMETHING.** The most common post in a real feed is a
   request, and we have zero. A request is also the cheapest hook a city screen
   could have, because it is a quest that costs nothing to author.
5. **AND SOMEBODY REPLIES.** Real feeds run 1.4 replies per post. Two posts under
   one event, disagreeing, teaches the player that this world has more than one
   opinion in it, and it is the same deliberation shape Q13 found for rumour.
6. **NOT EVERY EVENT IS A POST.** The hardest and least glamorous rule: a feed that
   reports every diff is a log. If nothing is worth saying, the file already has
   the right line for it, and it is a good one: "quiet day. nobody has anything to
   say and that is its own news."

## ROUTED
- **WORDS**  Q15 answered. The research queue's Q1 to Q15 are now all SHIPPED. The
  remaining WORDS rows are the four held build rows and Q16 [cut off].
- **WORDS**  NEW ROW `THE-FEED-HAS-PEOPLE-IN-IT`: rewrite the fourteen post shapes
  so every one names somebody or talks to somebody, kill "somebody" as an agent,
  and add the request and the reply. Held until MODE: BUILD.
- **LIFE + CITY**  The stream is built correctly and this is a voice pass on its
  strings, not a change to its sources. Two shapes it does not have yet and a real
  feed leads with: a REQUEST, and a REPLY to an earlier post.
- **PEOPLE**  Third round asking for the same thing from two directions: the deed
  post says "keeper" because the engine's 64 names never reach a mouth (Q12), and
  it says "word is" because the hop count never reaches a mouth (Q13). The feed is
  the surface where both would be visible to the player for the first time.
- **UI**  The feed scrolls in CITY mode. A post that names a person is a post the
  player can want to tap; a post that reports a number is not.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.
Five deed posts and five world posts, as the row asked for.

## SOURCES
- Research on bureaucratic register: nominalisation and the agentless passive
  delete the actor, and the bureaucratic voice's purpose is uniform, to erase and
  efface any active agent; plain-language guidance treats active voice with a named
  actor as the corrective.
- A study of 30 neighbourhood social feeds: roughly 116,000 posts against roughly
  164,000 comments, so about 1.4 replies per post. Posts seeking or offering
  something are the most frequent kind, followed by local logistics such as lost
  animals, transport and events, then pleasantries such as good wishes and the
  weather. Publicly naming perceived outsiders, especially over petty crime, is a
  recurring pattern and heaviest where a neighbourhood is changing hands.
- Generated in-game activity feeds: descriptions that typically do not give the
  viewer enough context to understand what happened, and the selection problem of
  which events are worth reporting at all.
- Our own build: engine/bohemia_feedstream.js, 16 post call sites and 14 carrying
  text, all read by hand against the agent test; 5 of 14 name or address a person,
  4 of the other 9 use "somebody"; all four world posts have no human agent.
- This lane's Q12 (57 speakers, zero names, 64 unspoken given names) and Q13 (the
  hop count is computed and never reaches a mouth).
