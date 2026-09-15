# "NOT RUNNING SMOOTHLY" -- IT IS THE FIRST THIRTEEN SECONDS, AND THE BOX WAS HIDING IT

PLUMBER lane, VAMILY row [sixty fps], 9/15/26.

PAOLO 9/15, his second play of the demo:

> "It's kinda not running as smoothly as I was I would like maybe it's cause things
> are loading in real time."

Coordinator ruling 5 sends that here by name: "frames per second on the demo's first
five minutes on a THROTTLED phone profile, one number, and THE LOADING THAT HAPPENS
DURING PLAY NAMED."

## THE ONE NUMBER HE ASKED FOR, AND WHY IT NEEDED A LADDER

This container is not a handset. Every frame-rate number this fleet has ever posted was
taken on a machine several times faster than the thing in his hand, which is exactly how
"57.8 fps" and "not running smoothly" can both be true about the same build.

Nobody in this repo has ever measured a real iPhone, so picking ONE multiplier would be
a guess with a decimal point on it. Instead the walk now takes a CPU throttle rate and
the round ran a ladder. All four runs are in one window on one box (0.77x to 0.88x of
baseline), because a wall clock taken hours apart is about the hour and not the code.

    CPU         door        fps over      first 15 s      after that      worst
    throttle    opens at    the walk      of play         of play         stall
    ----------------------------------------------------------------------------
    1x          13.4 s      58.4          53.3            57.4            1.2 s
    4x          52.9 s      53.4           9.8            57.3            8.8 s
    6x          79.4 s      34.9          11.0            50.9            8.1 s

## *** THE FINDING: HE MEETS THE WORST PART OF THE GAME FIRST ***

At 4x, second by second, frames painted (target 60):

    +  0 s    4    ##
    +  1 s    8    ####
    +  2 s    6    ###
    +  3 s    4    ##
    +  4 s    6    ###
    +  5 s    8    ####
    +  6 s    7    ###
    +  7 s   10    #####
    +  8 s    7    ###
    +  9 s    7    ###
    + 10 s    9    ####
    + 11 s    7    ###
    + 12 s    5    ##
    + 13 s    2    #
    + 14 s   57    ############################
    + 15 s   56    ############################
    + 16 s   57    ############################

THIRTEEN SECONDS AT ABOUT TEN FRAMES A SECOND, THEN IT SNAPS TO FIFTY-SEVEN.

The 6x run has the identical shape: 2 to 7 frames a second for thirteen seconds, then
54. At 1x the same dip exists and is small (34, 35, 41 for three seconds, then 57),
which is why nobody has ever seen it. THE BOX WAS HIDING IT, and that is precisely what
ruling 5 was for.

A whole-walk average of 53.4 fps buries this completely. The first thirteen seconds are
a sixth of his five minutes and they are the first thing he touches.

## THE LOADING THAT HAPPENS DURING PLAY, NAMED

His theory, measured. On the demo, phone profile, at 1x:

    the door opens after                3 files
    then, while he is playing          30 files, 75.9 MB
    the last one arrives               227 s after the door

At 4x it is 31 files and 80.9 MB, the last landing 311 s after the door, which is past
the end of his five minutes.

This is not a bug somebody introduced. It is `warmTheWorld` in the demo shell, the
warm-fetch queue, working as designed: it waits 2,000 ms so an impatient tap gets the
whole connection, pauses on the tap, and resumes once the city frame is up so the art
streams in behind him. The design is defensible and its own comment argues it well.
THE SIZE IS WHAT NOBODY WAS WATCHING. Seventy-five megabytes of tile banks arrive while
he is trying to play.

Twelve of those chunks are asked for TWICE in the first 75 seconds: once by the shell's
warm fetch, once by the city frame's script tags.

## WHAT I COULD NOT CHECK, SAID OUT LOUD

The walk serves the files from a local server that sets no cache headers, and this
container's network policy blocks the live site (the proxy answered 403 to CONNECT for
paolosarn.github.io). So whether a real browser re-downloads those twelve chunks or
re-reads them from disk IS NOT KNOWN FROM HERE and nothing above pretends it is. What is
true either way: the bytes are parsed and executed on the main thread while he plays,
and that cost is not a cache question.

## A TEST I BUILT AND THREW AWAY, WHICH IS THE POINT OF WRITING THIS DOWN

I tried to prove his theory directly by splitting the walk into seconds where a file
landed and seconds where none did. TWO DIFFERENT WAYS OF LINING UP THE LOAD CLOCK WITH
THE FRAME CLOCK GAVE TWO DIFFERENT ANSWERS OFF THE SAME RUN:

    one alignment     45.3 fps loading against 55.3 quiet,  7 busy seconds, gap 10.0
    the other         51.7 fps loading against 55.4 quiet, 25 busy seconds, gap  3.7

A test that changes its verdict with its arithmetic is not evidence. It is deleted, and
what replaced it needs no clock alignment at all: the frames painted in each of the
first seconds, straight off the counter. That is the weaker claim and it is the one that
survives. It also turned out to be the louder one.

This lane published three numbers it had to take back in the last two rounds. The
difference here is that the weak version was thrown away BEFORE it went on the board.

## SHIPPED

  * `--throttle N` on the five-minute walk, and the driver takes a CPU throttling rate
    (rule 14(g): every lane that walks the five minutes uses the one driver or extends
    it). Boot ceilings scale with the rate, or a throttled boot makes the driver throw
    "no city frame" on a game that boots fine -- trap 5 in its own header.
  * The driver now logs every response with the millisecond it landed and its size ON
    DISK, and stamps the moment the door opened, so "what loads during play" is a list
    and not a feeling. Sizes come from disk because this little server never sets
    content-length and the first cut read 0 KB on every row.
  * The per-second frame counter, which is what found the thirteen seconds.
  * gates/loading_during_play_gate.js, a RATCHET on what streams in behind the player:
    63.9 MB and 27 files in a 75 s window, pinned off two of ITS OWN runs rather than
    off the walk (the first cut was estimated from the walk's totals and went red on its
    own first run). Four floors before any ceiling: the door was reached, files arrived
    BEFORE the door so the log is listening, frames were painted, and the window saw
    loading at all. GREEN 6/0. In the suite as LOADING IN PLAY.
  * Two new floors on the walk itself, and the old ones restored: a block replacement
    in that file deleted the floors, and the next run crashed on the missing variable
    rather than quietly reporting a walk with nothing under it. The crash was luck.

## WHAT THIS IS NOT

It is not a fix. This lane may measure engine code and shrink it where a measurement
says so, but the thirteen seconds live in the demo shell's boot and the city frame's
first paint, which belong to RUN and LIFE+CITY. The number is the deliverable; where it
goes next is on the board.

## THE ROW'S SHIP TEST, HONESTLY

[sixty fps] asks for a budget and a gate on: 60 walking, 60 in the fight, first play
under 5 seconds. NONE OF THE THREE IS MET and this round did not meet them:

    first play        13.4 s at 1x, 52.9 s at 4x, against 5 s
    walking           58.4 fps at 1x, 53.4 at 4x, against 60
    in the fight      still unmeasured under throttle

The row stays CLAIMED. What it has now that it did not have this morning: the numbers
are taken on a profile that is not lying about the machine, and the worst part of the
five minutes has a location.
