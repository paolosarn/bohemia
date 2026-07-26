# BOHEMIA — A LANE COLLISION, AND THE ONE THING IT LEFT BEHIND (7/26/26)

## WHAT HAPPENED

Paolo asked what I wanted to do. I said: put the art in the game, because the
whole constitution was true of a picture in `records/` and of nothing he could
play. He said do it. I built it — the run drawing its own generated block out of
the frozen 42-tile set, buildings standing up, runtime shadows and falloff — and
when I went to push, **the RUN lane had already shipped exactly that**, into the
same three files, in the same hour (`a098a5a THE OVERWORLD: the block is laid
from the target screen you picked`).

Theirs is better than mine: garages open onto **their own** driveway whichever
side it is, the wall face carries real windows and boarded windows, and their
`integration_gate.js` check is stricter than the one I wrote — it verifies every
tile's bytes ship verbatim **and** that the tileset md5 still matches the
constitution.

**So I threw mine away.** No rebase-force, no merge of two renderers, no second
gate saying the same thing in different words. I checked main before I started;
they landed while I was working. That is the parallel-session boundary failing,
and it cost a turn.

## THE ONE THING THEY MISSED, AND IT WAS THE BIG ONE

Their block laid the constitution's tiles correctly — and still drew **every one
of them one pixel short**:

```
var X=(sx+halfW)*CELL, Y=(sy+halfH)*CELL, S=CELL-1;
```

The comment two lines below it reads *"a cell is drawn at CELL size"*. The code
said `CELL-1`, so the page background showed through on two edges of every
single cell.

**That gap is the black grid in every screenshot of this game, all day.** It was
never an outline anybody drew. It was a gap nobody closed. `S = CELL` and it is
gone; the surfaces are continuous for the first time.

Gated: the run may not draw at `CELL-1` again, and it must declare a full-cell
blit. `run_gate` still plays the whole loop, 93/93.

## THE PROCESS GAP, LOGGED RATHER THAN INVENTED AROUND

Two sessions did the same work in the same hour because neither could see the
other, and "check main before you start" does not help when the other lane lands
mid-turn. That is a real hole in ONE SYSTEM, ONE SESSION and it is worth a
mechanism, not a promise. Logged as discovered work; not designed here, because
fleet process is not this lane's to invent.
