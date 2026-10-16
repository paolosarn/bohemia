# THE OTHER TWO TRIGGERS (8/27/26)

His 8/26 ruling, LOCKED:

> "overworld calmness lvl 1 then an enemy trying to hurt you or someone is
> talking to you is lvl 2 then you either kill 2 enemies or theresa whole bunch
> of people close together talking type shit for lvl 3"

Four triggers. Two shipped that day. Two did not.

    kills    WIRED    8/26   combat posts a killshot outcome
    threat   WIRED    8/26   BOHEMIA_COMBAT_STARTED / BOHEMIA_PLAYER_HIT
    talking  UNWIRED  8/26   a conversation begins INSIDE the city frame
    crowd    UNWIRED  8/26   nothing counted people near you

They were reported honestly as unwired rather than quietly counted as shipped,
and then they stayed unwired for a day. That is how a ruling becomes half a
ruling. A ruling half-built is a ruling that does not exist. This is the other
half, and it now has a gate so it cannot regress to half again.

## WHAT SHIPPED

`tools/bohemia_intensity_watcher.py` installs one watcher in the shell, right
after `window.INTENSITY=KILLMUS;`, so a reader meets the triggers next to the
thing they drive. Every 500 ms it reads two facts out of the city frame the
shell already embeds:

    talking   #ctcard is visible          -> INTENSITY.talking(true/false)
    crowd     3+ people within 5 tiles    -> INTENSITY.crowd(true/false)

It only speaks when the answer CHANGES. `INTENSITY.apply()` already returns
early on a repeat, but calling it four times a second forever is noise in every
profile and in every gate that counts calls.

## IT DOES NOT TOUCH THE CITY

`slices/BOHEMIA_CITY_WORLD.html` belongs to another lane, and ONE SYSTEM ONE
SESSION means this work does not reach into it. It did not have to. The city
already publishes `window.__CT`, and the shell already owns the frame, so this
is a same-origin READ across a boundary that already exists. No new message, no
new city code, no second copy of any state. The gate asserts the city file
contains no trace of this work, permanently.

The whole read sits in a try/catch that degrades to exactly today's behaviour if
a browser ever refuses the frame. The ladder does not break; it just stops
hearing those two triggers.

## THE ONE THAT NEARLY SHIPPED AS A DISASTER

The obvious signal for "someone is talking to you" is `__CT.open()`. It is not a
getter.

    open:function(){ ctOpen(); return !!CT_OPEN; }

It OPENS a conversation and then reports that one is open. A watcher polling it
twice a second would have shoved a dialogue card in the player's face
continuously, from the moment they stood next to anybody, forever.

What makes this worth writing down is HOW it was nearly missed. A live probe of
its return value looked exactly like a getter. It answered `false`, over and
over, across many polls, because nobody was adjacent in the probe. The side
effect never fired, so the probe cheerfully confirmed the wrong model. Only
reading the body showed what the function does.

A NAME IS NOT A CONTRACT. And a live probe that never triggers the side effect
will happily confirm the wrong model. `gates/intensity_wired_gate.py` forbids
`__CT.open(` in the watcher body permanently, comments stripped first.

That comment-stripping is itself the fourth time this session a check has
matched PROSE instead of CODE. The first run of this very leg went red on the
watcher's own comment, the one explaining why `__CT.open()` must never be
called. A checker that cannot tell a mention from a use is the broken one.

## TWO NUMBERS ARE MINE AND THEY ARE SAID OUT LOUD

He said "a whole bunch of people close together" and gave no count and no
radius. MECHANISM-MINE / CONTENTS-PAOLO'S: the mechanism ships with a defensible
default and the numbers are his to move.

    CROWD_MIN = 3     the smallest number that is a group rather than a pair
    CROWD_R   = 5     tiles: one gathering, not three strangers who happen to
                      be on screen at once

Both are exposed on `window.__intensityWatch` so they are inspectable rather
than buried, and the gate prints them in plain words every run.

## ONE HONEST LIMIT, STATED RATHER THAN PAPERED OVER

He said people "close together TALKING". The city does not model people talking
to EACH OTHER. It models people, where they are, and whether one of them is
talking to YOU. So CROWD is implemented as the nearest observable truth: a
cluster of people around you. If he wants literal chatter between NPCs to be the
trigger, that is a city feature that does not exist yet, and this lane cannot
invent it inside another lane's file.

## MEASURED ON THE REAL SURFACE

`gates/intensity_wired_gate.py`, 21 claims, on the walked city in the shipped
shell. It drives all four triggers, not the two that were easy.

    LEVEL 1  overworld calm                          1
    LEVEL 2  an enemy trying to hurt you             2
             one kill is NOT enough, he said two     1
    LEVEL 3  two kills                               3
    LEVEL 2  a real conversation card raises it      1 -> 2
             and it LETS GO when it closes           -> 1

The talking leg waits 1200 ms on the watcher's OWN timer rather than poking
`look()`, because a trigger that only fires when the gate calls it is not wired,
it is demonstrable.

The crowd threshold is driven at its edges:

    three within five           d=[1,2,4]     -> 3
    two within five             d=[1,2]       -> 1
    three but far apart         d=[9,12,40]   -> 1
    three on the radius edge    d=[5,5,5]     -> 3
    three just outside it       d=[6,6,6]     -> 1

The real city reports people at d = 2, 192, 963, 964 from the player, so the
distances themselves are real and were measured; what is under test is the
COUNTING AND THE THRESHOLD, which is the part this lane wrote. `everyone()` is
fed controlled input and PUT BACK afterwards. A probe that mutates the surface
puts it back.

## MUTATIONS THAT PROVED THE GATE

    reverting the watcher to __CT.open()      trips 3 legs
    removing the d <= CROWD_R radius check    trips 3 crowd legs

## STATUS

    INTENSITY WIRED   21 passed, 0 FAILED
    MENU MUSIC        17 passed, 0 FAILED
    FIGHT MUSIC       GREEN
    ALPHA LOADS       GREEN
    DEMO BUILD        25 claims, GREEN
    SONG LOCK         GREEN

Tab: none of this is a tab he opens. It is the music hearing the room while he
plays, in RUN and in CITY. He will meet it by walking up to people.
