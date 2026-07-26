# BOHEMIA ADDENDUM — EVERYTHING ON BEAT, AND THE DOWNED ARE KILLS
# (Paolo 7/26/26, LOCKED)

## 1. EVERYTHING ON BEAT

Paolo, answering the question of whether enemies should play with the beat or
against it: **"Everything on beat even the Enemies whatever they're doing."**

No call-and-response, no off-beat enemies. Every event in a fight lands on the
120 grid: your shot, the return volley, a man breaking, a man running, a death,
a step, the camera. The fight IS the drum track. This extends the 120 BPM LAW
from "the dial quantizes" to "the whole fight quantizes."

Shipped v71: the demo's one event scheduler now lands on the BEAT instead of the
half beat, which puts all thirteen existing call sites on the grid at once, and
the enemy verbs (nerve break, break-and-run) are routed through the same rail.
Nothing ever waits longer than a single beat.

## 2. THE DOWNED ARE KILLS, FOR THE MUSIC — SUPERSEDES THE V53 NOTE

Paolo: "if I have a pistol and I down an enemy, even if they survive because
they're crawling away... like if I didn't shoot them and they typically would be
dead... they're just crawling on the ground, that's part of a kill, intensify the
song... and I hate to see that you're not recognizing them."

The music ladder counted `e.dead` and nothing else, under an explicit code note
from V53 reading "a pistol shot that only DOWNS a man (alive) must not bump the
music." **That reading is superseded by his own newer words.** The ladder now
counts everyone TAKEN OUT OF THE FIGHT: dead, downed/crawling, hands up, and
fleeing — exactly the set `aliveEnemies()` already uses to decide the fight is
over. If he took them out of the fight, the song answers.

## 3. THE HERO BEAT IS THE VOICE, NOT A DRUM DOUBLING

Paolo: "I'm not feeling the hero beat drum doubling."

The doubled kick and sub boom on step 0 are removed. Beat one is still canon for
every song (the 7/24 ruling stands) — what changed is HOW it is announced: the
808 / bass voice at 3x, alone, with nothing competing for the limiter in front
of it. A hero marker he cannot feel is dead weight.

## 4. ALL OF THE OVERWORLD MUSIC, NOT TWO SONGS

Paolo: "I don't know why it's so difficult for you to put all of the overworld
music when I press new encounter. It's just been like two songs on the shuffle."

The cause, found and fixed: **combat carried a hand-copied array of six night
songs**, while the app itself holds THIRTEEN songs he tagged OVERWORLD (10
NIGHT + 1 DAY + 2 DUSK/DAWN — his 7/19 assignments, baked into CAT_DEFAULTS).
The music bus had been shipping his FACTION pools down to combat since 7/19 and
simply never shipped the overworld ones.

Now the bus carries all three overworld slots, combat plays from HIS pool, and
the encounter walks a SHUFFLE BAG: every overworld song plays before any song
repeats. The readout names the song and counts the bag down, so it is visible
that the rotation is real.

**THE STANDING LESSON, and it is the same one as the doors:** when a surface
needs content the game already has, it consumes the approved corpus. A
hand-copied subset inside one surface is how a 13-song pool becomes 2 songs, and
nothing in the machine noticed for a week.
