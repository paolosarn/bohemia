# PAOLO 10/10: WHY HAVE THE ART ASSETS BEEN SO TINY? AND EVERYTHING IS MADE IN ALL EIGHT DIRECTIONS. (verbatim, voice-to-text)

> "What have we been making the art assets so tiny? What's up with that? You know our game graphic wise is not some mega that we have to watch out for load wise lag wise download wise like so what's going on? And then one of the chats made a dire if you understand when you create something it has to be made in all eight directions you understand that correct"

## WHAT I HEARD (rule 91c; correct me with one word)

1. He asks why the art kept shrinking, and says plainly: this game is not a giant that has to fear load, lag or download size, so that excuse is dead.
2. Anything that faces a direction (a person, a beast like the dire wolf, a vehicle) is made in all eight directions, always.

## THE HONEST ANSWER TO WHY (the coordinator, from the record)

1. THE PACKS WERE INVISIBLE. The 1,927 tiles he bought sat as base64 text inside four bank files from 7/13 until 10/10, so no lane ever saw a 96 by 96 tile next to its own work (COOK 13421cfd). Lanes drew to the scale they imagined, and imagined small.
2. THE TINY-CHARACTER DIRECTION. On 9/27 the board briefly ran 'a tiny character on an honest grid, one cell per step, a 32-pixel cell' (rule 34). He killed it the same day in the third votes (NO ATARI), but lanes had already cut sprites, markers and icons to that scale and never grew them back.
3. BUDGETS WRITTEN AS PIXEL LIMITS. The suite carries a 4 MB first-load ceiling, a 260 MB publish cap and a 60-frames gate. Those are the right budgets for HOW the game loads and draws, and lanes read them as 'draw smaller'. His own load complaint (40 seconds) came from every tile file downloading twice and the page reloading three times, not from pixel count.
4. CODE DRAWS SMALL. Most of our art is drawn by tools (a Python patch, a JavaScript baker), and a 5 by 5 icon is easy to write and a 96 by 96 one is not. Nobody was measured against a bar, so the easy size won.
5. NO FLOOR WAS WRITTEN DOWN. Until this hour there was no number anywhere saying how many pixels a thing must have (rule 105 fixes that).

## What it changes

Rule 106: PERFORMANCE IS NEVER A REASON TO SHRINK ART. The load, lag and size budgets govern how we load and draw (loading in parts, caching, drawing only what is on the glass), never how many pixels an asset has; a lane that cites a budget to draw under the floor is wrong by law. Rule 107: EVERYTHING THAT FACES IS MADE IN ALL EIGHT DIRECTIONS: a person, a beast, a vehicle, a turret; a mirrored half is not a direction; ANIMATION's dire wolf (one walk, the back lit, south-west mirrored) comes back with all eight before it is a candidate; PLUMBER's gate counts facings on every sheet that moves.
