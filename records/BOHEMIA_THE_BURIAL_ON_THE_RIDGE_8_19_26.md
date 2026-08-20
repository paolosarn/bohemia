# THE BURIAL ON THE RIDGE (8/19/26, PEOPLE lane, backlog 0sc)

## WHERE TO SEE IT: the **CUTSCENE** tab, third chip, THE BURIAL ON THE RIDGE.
## The lines are editable in the **WORDS** tab, the beats in the **DIRECT** tab.
## THE PICTURE IS NOT THERE YET AND THE FRAME SAYS SO, in those words.

---

## THE HOLE: HIS OPENING HAS THREE BEATS AND ONLY TWO WERE BUILT

His 7/19 law does not call the opening a sketch. It calls it CRYSTALLIZED and
lists it:

> 1. NIGHT RAID (cold open)
> 2. THE GRIEF DINNER (next day, before the burial)
> 3. THE BURIAL ON THE RIDGE (**tutorial ends here**)

Scenes 1 and 2 shipped 8/9 and 8/11. Scene 3 did not exist. And scene 2 ends on
the mother saying:

> "We go up in the morning. Wear something you don't mind ruining."

The game had nothing to go up to.

## WHY IT IS THE MOST IMPORTANT BEAT IN THE DEMO

His law is unusually explicit about what this scene is FOR:

> "This is ALSO the first full-scope reveal of the whole valley (the BotW vista).
> So the first time you ever see Bohemia's beauty, you see it through tears, over
> a fresh grave. The city's beauty is bound to loss from the first frame, and you
> can never take that view again without the grave in the foreground."

And:

> **THE RIDGE = THE MENU / TITLE SCREEN (locked, Paolo).** Every time you boot the
> game or return to menu you are looking at Bohemia from your sibling's grave.

**The vista already ships and already plays, on the day 2 morning, with no grave
and no family in it.** So the demo currently shows the player Bohemia's beauty
completely unbound from the loss, which is the thesis exactly backwards. Not a
missing scene: an inverted one.

## WHAT SHIPPED

Five spoken lines, fifteen beats, twenty-one seconds. Every line `draft:true`,
every line citing the corpus, all of it editable in WORDS and DIRECT.

**The reveal is silent.** His match-cut shows the whole apocalypse "without a
word"; the valley gets the same respect. Six beats of nobody talking over the
most beautiful thing in the game, while standing at a grave. A line there would
be the game telling the player how to feel about the view, which is the one
thing that would break it.

**Then grief arrives as labour, not as a speech:**

    sibling_older   Ground's harder than it looks up here.
    mother          Then we take turns.

Four words, and they are the founding of the dynasty. She does not comfort
anybody, she organises them. That is who survives an apocalypse and it is who
starts a city.

**Two small memories, and deliberately NOT the green-ones bit** (that ran its
three instances and a fourth would cheapen the one at the grief dinner):

    sibling_older   Halfway up, NINA would have sat down and refused to move.
    mother          And you'd have carried NINA the rest of the way. You always did.

The second one is about the SURVIVING sibling. The player learns something new
about the person who is with them for the whole game, in the same breath as
losing the other one. Neither line uses a pronoun, so both work whichever way
his gender flip lands.

**And the line the whole thing exists for:**

    mother          Everything we build down there, NINA is up here looking at it.

That is his ruling made into one sentence. It is the first time anybody says the
family is going to BUILD something, it is said over a grave, and it turns the
title screen into a promise somebody made out loud.

Nobody agrees with her. The scene ends four beats later, on the view.

## *** THE PICTURE WAS WRONG, AND I ALMOST SHIPPED IT ***

The cutscene surface builds an INTERIOR: wall tiles, a floor, a baseboard, a
window, a table, and bodies posed `sit-chair` in seats derived from the
furniture. It has no exterior concept at all.

Handed an outdoor burial it did not fail. It silently generated the family's
living room and **sat three people down at the dinner table with a lantern.**
Every gate green.

Rendered and looked at, which is the only way that was ever going to be caught.

A burial on a hilltop drawn as dinner is not a placeholder, it is a lie about
the beat, and it reads as a bug. Drawing the wrong room would have been the easy
green.

**So a scene now DECLARES what it cannot be drawn as, and the surface refuses to
draw it wrong.** The frame comes back honest:

    NO SET ART YET
    RIDGE EXTERIOR, THE VALLEY BELOW, A FRESH GRAVE
    THE WORDS PLAY; THE PICTURE IS OUTSTANDING

The captions still play, in order, on the beat, which is what the tab is for
while art is outstanding. The gap is now visible to the person who can close it
instead of hidden behind a picture of the wrong place.

**THE RIDGE EXTERIOR IS THE ART LANE'S, AND IT IS NOW THE DEMO'S BIGGEST MISSING
PICTURE.** It is the money shot, the title screen, and the last frame of the
tutorial, all the same image.

## A SECOND SMALL LIE, SAME FRAME

The state caption was hardcoded to two values: `pre_collapse ? 'before' :
'ten years later'`. The burial happens the morning after the raid, and the tab
captioned it "ten years later". A scene now says when it is (`when`), and the
grief dinner picked one up too ("the day after").

## THE CHAIN IS UNBROKEN NOW

The grief dinner hands off to the burial, `returns:false`, because his law ends
the tutorial there. So the authored opening is one chain: cold open -> combat
handoff -> grief dinner -> ridge burial -> control returns. A scene nothing
leads to is the vista's own bug wearing a different hat, and this lane has
closed that shape too many times to open a new one.

## WHAT IS STILL HIS

- **Whether the father is on that hill is NOT decided.** No scene has ever
  resolved his status, it is his ruling, and it is not resolved here. The cast is
  taken from the grief dinner rather than chosen: the same three people who sat
  down the night before climb the hill. If he wants the father there, that is one
  actor beat in the DIRECT tab.
- No casualty is authored, nobody new is placed, and every name is a draft in
  FAMILY_CAST that he overwrites in one file.

## THE MACHINE

| file | what |
|---|---|
| `records/BOHEMIA_SCENE_ACT1_RIDGE_BURIAL.json` | new, 15 beats, 5 lines, cited per line |
| `records/BOHEMIA_SCENE_ACT1_GRIEF_DINNER.json` | +handoff, +`when` |
| `engine/bohemia_story_surface.js` | honest empty frame for a set it has no art for |
| `tools/bohemia_cutscene_tab_patch.py` | the caption reads the scene's own `when` |
| `gates/scene_gate.js` | 54 -> 69 |

Mutation-tested, three ways:
- break the chain -> **2 red**
- talk over the valley reveal -> **2 red**
- let the surface draw the wrong room again -> **1 red**

## WHAT COMES AFTER

1. **The ridge exterior** (ART). Money shot, title screen, last frame of the
   tutorial, one image.
2. **Bind the scene to the real vista overlook** so the burial and the vista are
   the same place rather than two things that both show the valley. The vista's
   caller is the day loop, which is RUN's, so this is a joint, not a solo.
3. `COLD_OPEN.cast` and `COLD_OPEN.place` in the family-defense encounter are
   still `[]` and `null`, marked [PENDING Paolo] since 8/8 — but his 7/19 law
   rules both ("defending the home ... it ends saving the mother"). That marker
   is stale the same way the demo-scope banner was. **NOT TOUCHED THIS TURN: the
   COMBAT lane shipped encounter work today and that is their system.** Nobody is
   behind you in the fight you are told to defend, so there is nothing to lose in
   the scene the whole opening is built around losing somebody in.
