# HE VOTED INSIDE MY PAGE AND I LOST IT (9/23/26, SOUNDS lane) -- [room volume]
## The one number he gave me, and the reason the other eight never arrived

> **PAOLO 9/21, voting THE ROOM ON THE TAP up:** *"We can play around with this I'll let you
> know as I hear, but you gotta bro this volume has to be very, very low like very very very
> very, very, very, very low."*
>
> **And four times in the same sitting, about the page itself:** *"it's like an interactive
> inside of an interactive you better have gotten my votes on this shit"* / *"I already voted
> one time inside this interactive bro, so you better come correct and know the results"* /
> *"I just did this theres 7 options here man wtf"* / *"Please have all the notes inside of
> this interactive pls"*

He cast the first votes ever. Eight of my nine items got one: **six up, two down.**

---

## 1. FIRST, THE THING I HAVE TO SAY BEFORE ANYTHING ELSE: HIS EIGHT INNER VOTES ARE GONE

He voted **inside my judge page** and then the VOTE tab asked him again. He said so four
times, and he was right to worry, because **the votes he cast in my page were never written
anywhere.**

Here is the whole mechanism, and it is three lines:

```js
var picks = {};
...  picks[row.dataset.q] = b.dataset.v;          // a variable in the page
document.getElementById('exp').onclick = ...      // the ONLY way out
```

`picks` lived in a JavaScript variable. The only exit was a **download button he had to
press.** He thumbed eight cards, never pressed it, closed the page. Nothing reached disk,
nothing reached me.

> **A VERDICT THAT SURVIVES ONLY IF HE REMEMBERS A BUTTON IS NOT A VERDICT, IT IS A DRAFT.**

**AND THE TWO DOWNS ARE DOWNSTREAM OF EXACTLY THAT.** `sounds-a-footstep-on-the-beat-9-21`
and `sounds-the-step-loses-contact-9-21` both went DOWN, and both carry the *same* comment,
word for word: *"I already voted one time inside this interactive bro, so you better come
correct and know the results."* That is not a note about a footstep. It is the fourth time in
one sitting that he told me the voting was broken.

**I am not going to treat that as an acquittal.** Two downs are two downs. But the honest
record is that the sound note he actually wrote for those two is unrecoverable, so a re-cook
has nothing to aim at yet beyond the rules on the school page. That is the cost of the defect
and it is mine.

---

## 2. THE ONE NUMBER HE DID GIVE ME, SET AND SAID OUT LOUD

He said "very, very low" with **nine** *verys*. That has to become a number before anybody can
agree or disagree with it.

**MEASURED FIRST, on the real surface, in the running game, through the game's own probe:**

    the room's level             0.60 of the heartbeat's energy
    what that is, measured      -4.4 dB under the heartbeat, -53.4 dBFS

**Four decibels.** It was not sitting under the heartbeat, it was sitting *next to* it. He
heard exactly what was there.

**SET TO 0.05, AND CONFIRMED IN THE RUNNING GAME RATHER THAN CALCULATED:**

    rel 0.05  ->  -26.0 dB under the heartbeat, -74.9 dBFS   (measured: -26.012)
    the cut                        21.6 dB, about a fifth of the loudness it was
    ducked, when the song starts   -84.6 dBFS

**AND -26 dB IS NOT A NUMBER I LIKED THE LOOK OF.** Film and broadcast practice puts room tone
**20 to 30 dB** under the foreground it sits behind: far enough down to be felt and not
listened to, not so far that it stops doing its job, which here is covering the silence before
the music. Under about -30 dB, a bed on a handset speaker loses to the room the player is
actually sitting in. -26 sits inside that band, near its quiet end.

**THE DUCK IS DELIBERATELY UNTOUCHED.** He ruled on the volume, not on what happens when the
song arrives, and moving two numbers at once would make his next verdict unreadable.

---

## 3. NO VOTE LIVES ON A PAGE OF MINE AGAIN

Rule 25 now says an item is asked **once**, and until inner votes are wired an item's page
carries **no vote of its own**, and his notes ride inside the page.

    removed      8 vote rows, 25 thumb buttons          -> 0
    kept         9 notes boxes and the bottom one       -> his words still ride in the page
    added        COPY ALL, and every keystroke saved in the browser as he types
    the .txt     still there, never the only way out

**The autosave is the actual fix, not the COPY button.** The old page also had a button. What
lost his votes was that the button was the *only* path, and a path that depends on him
remembering it will fail again. Now closing the page keeps his words and reopening it brings
them back.

---

## 4. COOKED THIS ROUND (rule 22): HOW LOW THE ROOM, THREE LEVELS, ONE TAP EACH

He is judging loudness, so one level in isolation tells him nothing. Three, which is the most
rule 25 allows:

    A   0.05    -26.0 dB under the beat    what ships now
    B   0.025   -32.0 dB                   half again quieter
    C   0.60     -4.4 dB                   the one he heard, for reference

It loops, because that is what it does in the game: a four second one-shot of a bed teaches
nothing about a bed, and the loop point is built to be seamless so he should be hearing that
too. **It says TURN YOUR VOLUME UP at the top**, because all three are quiet on purpose and a
quiet test played quietly is not a test.

Verified in a real browser: **4 buttons, 4 of 4 start real audio, 0 page errors, 0 vote rows.**

---

## 5. THE SECOND COPY, AND WHY IT IS A GATE AND NOT A PROMISE

The shipped room lives in the alpha. A judge page can only play the module. **That is a
duplication, and a duplication in this lane is the exact bug that silenced every footstep in
this game for days.**

So it is not defended by a comment. The gate **reads both files** and asserts every constant
is equal:

    sec=4, hum=60, lo=100, hi=5000, seam=0.08, relShipped=0.05

**AND THE CLAIM CAUGHT ITSELF ON ITS FIRST RUN.** A bare pattern for `SEC:` over a 5 MB file
matched the **heartbeat's** `SEC: 0.5`, two objects earlier, and the claim reported *"game=0.5
page=4"* as if the room had drifted. The room was right; the ruler was reading a different
object.

> **A PATTERN OVER A 5 MB FILE IS NOT A READING OF A PARTICULAR THING UNLESS IT SAYS WHICH
> THING.**

Scoped to the ROOM object's own block, with a claim that the block still exists at all so the
check cannot pass by finding nothing. **Mutation proven:** set the game's hum to 50 Hz and it
goes red naming `hum game=50 page=60`.

The right end state is the alpha importing the module so there is one copy. That touches a
live system under the rule 18 hold, so it is named in the handoff rather than smuggled in here.

---

## 6. AND A CHECK OF MINE STOPPED CHECKING THE MOMENT THE NUMBER GOT SMALL

The first-sound gate holds the room's level against the heartbeat:

```python
REL_TOL = 0.08          # "the ratio the tool states, allowed to land within 8%"
... abs(rel_m - rel_a) <= REL_TOL
```

The constant says **8%**. The code is an **absolute** window. Those are the same thing only
while the stated ratio is near 1. At 0.60 it is ±13%. **At 0.05 it is ±160%: the claim would
have passed on zero, on double, on anything.**

Nothing about the game would have shown that. It was invisible until his ruling moved the
number, and then the check quietly stopped being a check.

> **A CHECK THAT STOPS CHECKING WHEN THE NUMBER IT WATCHES GETS SMALL IS WORSE THAN NONE.**

Now 8% **of** the stated ratio, which is what the constant always said, and which is stricter
than the old window everywhere the old window meant anything (at 0.60 it is ±0.048 against
±0.08). It means the same thing at any level he picks.

---

## 7. THE FIVE HE VOTED UP

    the door                          UP
    the fight's cloud                 UP
    a song through the dead speaker   UP
    the fold                          UP
    the phone still transmits         UP
    the room on the tap               UP, with the volume ruling above

Those five go into the game the round the rule 18 hold allows. Nothing was pushed into the
walked street or the fight this round.
