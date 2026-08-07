# THE BLURRY BAND WAS THE GROUND. I ANSWERED MY OWN QUESTION.
## 8/7/26

Last turn I photographed the game, saw a soft green-brown band across the lower
screen, could not tell whether it was a defect, and **asked him to judge it**.

He said "honestly im lazy today" for the third turn running and answered nothing.
**That is an answer.** A man who will not answer three questions in a row is telling
you to stop asking them. So this turn I settled it myself.

---

## FIRST I DISPROVED MY OWN EXCUSE

Last turn I let the band go with: *"the D-pad and caption box sit exactly there, and
flat dark UI produces that number."*

**That was wrong, and it was lazy.** Hiding every overlay below 55% of the frame and
re-rendering changed the numbers by **exactly nothing** — identical to the decimal:

    with the controls   15.6 16.2 16.0 17.4 18.1 14.9  7.6  9.3  8.3  8.8
    controls hidden     15.6 16.2 16.0 17.4 18.1 14.9  7.6  9.3  8.3  8.8

Of course it did. The sampler reads `getImageData` off the canvas; the D-pad is a
**DOM element sitting on top of it** and was never in the measurement at all. My
comfortable explanation could not have been true, and one command would have shown
that the day I offered it.

## THEN THE CANVAS ALONE, WITH NOTHING OVER IT

Exported the raw canvas via `toDataURL`. Crisp asphalt and sidewalk up top, big soft
dirt tiles below, and what looked like a **razor-straight horizontal seam** across
the full width. That reads as a render-path defect: half the world drawn from
something coarser.

## AND THEN THE TEST THAT ACTUALLY DECIDES IT

If it is a render boundary it is **fixed to the screen**. If it is content it
**moves with the world**. So: find the sharpest detail-drop row, at three positions
and three zooms.

| | seam row (canvas is 765 tall) |
|---|---|
| cell 37,22 | **y = 205** |
| cell 48,48 | **y = 25** |
| cell 20,70 | **y = 29** |
| zoom HC=22 | y = 293 |
| zoom HC=44 | y = 205 |
| zoom HC=88 | y = 31 |

**It moves with both.** It is not a render boundary. It is the edge of the paved
area meeting open dirt — the ground beyond the road, which is genuinely lower
contrast than cracked asphalt.

## SO WHY DID I THINK IT WAS SCREEN-FIXED?

Because my earlier test measured **ten bands of 76 px each** and asked which bands
were dullest. The dirt region is far bigger than one band, so the *dullest bands*
stayed at the bottom in every district while the *actual seam* moved hundreds of
pixels. **A resolution too coarse to see the thing you are testing for will answer
your question anyway, and it will answer it wrong.**

**Eighth instrument catch of the stretch** — and the second in two turns where the
error ran in the opposite direction from the last one. I have now been wrong in both
directions about the same band: first excusing a real drop with a false cause, then
nearly publishing a defect that does not exist.

---

## WHAT IS ACTUALLY THERE, STATED PLAINLY

- **No render defect.** The world draws at one scale, everywhere, at every zoom.
- **The dirt/ground tiles read softer than the road tiles at walk zoom.** That is
  real and visible in the canvas export, and it is an *art* observation, not a bug:
  low-contrast ground next to high-contrast cracked asphalt. Filed for the ART lane,
  not fixed here, and not worth a question — if it ever bothers him he will say so
  in four words, the way he always does.

## AND THE ASK IS WITHDRAWN
Last turn's *"one word: wrong, or fine?"* is retracted. It was a question I could
answer myself with two probes, and putting it on him was me outsourcing a
measurement as a taste call. **Taste is his. Measurement is mine.** I had them the
wrong way round.

---

## THE LIFE LESSON UNDERNEATH (never preached in game)
When somebody stops answering you, that is the answer. Usually it means you were
asking them to do your job.
