# HIS WORDS, MEASURED

Built by `build_corpus.py` then `stats.py` (both beside this file) from the repo at /home/user/bohemia, read only.
Every quote below is copied from `corpus.jsonl`. Counts use only the VERBATIM rows (`in_stats: true`):
raw typed vote comments, the vote tab's own box, his two messages sent with an export, and the record blocks a record
itself labels as his words. Condensed copies (VAMILY quotes, inline fragments, card quote-backs) are in the corpus
with flags but are never counted here, because the coordinator trims and tidies them (measured in section 11).

## HEADLINE NUMBERS

1. Corpus: 2259 distinct quotes (typed_vote 579, voice_record 841, vamily_quote 839). Verbatim and counted: 849 quotes, 56116 words (typed 411 quotes / 11468 words; voice 438 quotes / 44648 words).
2. A typed vote note: median 16 words (Q1 8, Q3 32); counting every card he cast it on, median 13. 25% of cast notes are under 6 words, 28% over 25. Thumb-typed notes median 13 words; notes dictated into the box median 31.
3. A voice message: median 75 words (Q1 33, Q3 133, longest 896). One period, ? or ! every 57 words, so a "sentence" is a run-on (median 25 words; typed 12). Cut at his own spoken commas (bro, you know, I mean ...) a breath is median 11 words in voice, 9 typed.
4. Openers: "bro" starts 44 of 411 typed notes and 34 of 438 voice messages; "Also" starts 71 voice messages and "And" 53; "good" starts 29 typed notes, "I" 26, "nice" 11.
5. Per 1,000 words, typed / voice: like 39.8 / 39.7 (one word in 25); bro 16.0 / 9.1; shit 15.1 / 9.0; any fuck form 7.4 / 4.3; you know 5.2 / 9.0; just 6.9 / 8.8; yeah 5.7 / 4.9.
6. Counts, typed + voice: dogshit / dog shit 57 + 31 (in 53 of 411 typed notes); "type shit" 9 + 71; "and shit" 35 + 88; vibe(s) 13 + 66; cook-words 7 + 15; fire (= good) 4 + 4; swag 0 + 4; nigga 1 + 0; dude 0, homie 0, "no cap" 0.
7. Typed punctuation (405 notes): 81% end with no mark at all, 58% have no punctuation anywhere, 90% start with a capital, 17 notes are ALL CAPS; in all of them 5 "!", 48 "?", 0 semicolons, 0 colons, 4 emoji (in 2 notes).
8. Yes and no: a thumbs-up note most often opens with good (28), I (18), bro (14), nice (11), yeah (8); a thumbs-down note with bro (30). 86 of the 247 thumbs-up notes still hold an insult word, so his yes is "good progress, not final", rarely plain praise. Bare "no" opens 5 typed notes, "nah" 6.
9. Absent in 51016 verbatim words: semicolons 0, em dashes 0, shall 0, whom 0, perhaps 0, indeed 0, therefore 0, moreover 0, thus 0, "as if" 0, "as though" 0. Present but rare: however 8, rather 4, quite 4. "like a/an" 125 times, a plain comparison or the filler, never a figure of speech.
10. The coordinator's copies clean him up, which is why they are not counted: per 1,000 words the VAMILY quotes of the same speech carry like 10.2 (verbatim 39.7), bro 0.8 (9.1), you know 0.2 (9.0), and 5.8 semicolons (verbatim 0.0).

## 1. How many quotes, per channel

| channel | kind | reliability | rows (exact repeats merged) | words | counted in stats |
|---|---|---|---|---|---|
| typed_vote | anything_else_box | condensed / unchecked | 3 | 54 | 0 |
| typed_vote | anything_else_box | verbatim | 2 | 57 | 2 |
| typed_vote | card_quoteback | condensed / unchecked | 2 | 15 | 0 |
| typed_vote | inline_fragment | condensed / unchecked | 160 | 2221 | 0 |
| typed_vote | message_with_export | verbatim | 2 | 25 | 2 |
| typed_vote | verbatim_block | verbatim | 2 | 314 | 2 |
| typed_vote | vote_comment | entered by coordinator | 3 | 76 | 0 |
| typed_vote | vote_comment | verbatim | 405 | 11072 | 405 |
| vamily_quote | attributed_quote | condensed / unchecked | 839 | 27924 | 0 |
| voice_record | attributed_quote | condensed / unchecked | 15 | 211 | 0 |
| voice_record | card_quoteback | condensed / unchecked | 193 | 4568 | 0 |
| voice_record | inline_fragment | condensed / unchecked | 189 | 1736 | 0 |
| voice_record | verbatim_block | verbatim | 444 | 44705 | 438 |

- **typed_vote**: 579 rows, 13834 words; counted in stats: 411 rows, 11468 words.
- **voice_record**: 841 rows, 51220 words; counted in stats: 438 rows, 44648 words.
- **vamily_quote**: 839 rows, 27924 words; counted in stats: 0 rows, 0 words.
- total rows 2259; counted 849 rows, 56116 words.
- the registry holds 500 non-empty vote comments; 408 are distinct texts (405 typed by him, 3 entered by the coordinator from his speech).
- record blocks: 438 counted; 380 of them have no cut (`...`) and no [inserted word] and are the only ones used for length and punctuation.
- dates of counted rows: 2026-07-28 to 2026-11-14.

### How it was entered (a guess, by rule, not a fact)

The "typed" channel is not all thumb-typed and the "voice" channel is not all dictated. Rule used (`input_guess`):
**thumb** = has text-speak with no apostrophe (u, ur, im, dont, cant, idk, rn, fr, asf, bc, tho, otw, pls, w, alot, wtf-style
lowercase i), or ALL CAPS, or stretched letters (yettt), or an emoji; **dictated** = 8+ words with an apostrophe contraction
or a comma and none of the thumb marks; **unclear** = the rest (mostly one to five word notes).

| channel | thumb | dictated | unclear |
|---|---|---|---|
| typed_vote (vote comments + box + messages) | 96 | 175 | 140 |
| voice_record (record blocks) | 62 | 344 | 32 |

## 2. Length, in words

A "sentence" is a span ended by `.` `?` `!` or a line break. Dictation puts in few periods, so a dictated "sentence" is
often a whole run-on; the clause row also splits at commas. Voice rows with a cut or an inserted word are left out.

### Typed (the VOTE tab)

| what | n | Q1 | median | Q3 | mean | P90 | max | under 6 words | over 25 words |
|---|---|---|---|---|---|---|---|---|---|
| whole note, each distinct text once | 405 | 8.0 | 16.0 | 32.0 | 27.3 | 71 | 261 | 16% | 33% |
| whole note, every comment as cast (repeats counted) | 485 | 6.0 | 13.0 | 29.0 | 23.9 | 61 | 261 | 25% | 28% |
| sentence (distinct notes) | 581 | 6.0 | 12.0 | 23.0 | 19.1 | 40 | 255 | 22% | 22% |
| clause (distinct notes) | 776 | 4.0 | 9.0 | 19.0 | 14.3 | 32 | 143 | 34% | 15% |
| whole note, guess = thumb | 92 | 7.0 | 13.0 | 19.0 | 18.1 | 33 | 162 | 10% | 20% |
| sentence, guess = thumb | 103 | 7.0 | 12.0 | 19.0 | 16.2 | 32 | 70 | 12% | 19% |
| whole note, guess = dictated | 174 | 19.0 | 31.0 | 63.2 | 46.4 | 99 | 261 | 0% | 60% |
| sentence, guess = dictated | 325 | 8.0 | 17.0 | 30.0 | 24.8 | 55 | 255 | 16% | 30% |
| whole note, guess = unclear | 139 | 4.0 | 7.0 | 12.0 | 9.6 | 19 | 75 | 40% | 8% |
| sentence, guess = unclear | 153 | 4.0 | 7.0 | 11.0 | 8.7 | 18 | 49 | 41% | 4% |

### Voice (record blocks)

| what | n | Q1 | median | Q3 | mean | P90 | max | under 6 words | over 25 words |
|---|---|---|---|---|---|---|---|---|---|
| whole message | 380 | 33.0 | 75.0 | 133.0 | 104.1 | 221 | 896 | 2% | 83% |
| sentence | 948 | 11.0 | 25.0 | 56.0 | 41.7 | 100 | 376 | 9% | 50% |
| clause | 1681 | 5.0 | 14.0 | 33.0 | 23.5 | 60 | 181 | 26% | 33% |
| whole message, guess = thumb | 60 | 21.5 | 38.0 | 75.0 | 53.1 | 104 | 165 | 3% | 63% |
| sentence, guess = thumb | 115 | 13.0 | 22.0 | 36.5 | 27.7 | 59 | 126 | 8% | 39% |
| whole message, guess = dictated | 295 | 51.0 | 88.0 | 147.0 | 121.9 | 250 | 896 | 0% | 92% |
| sentence, guess = dictated | 804 | 11.0 | 28.0 | 61.0 | 44.7 | 111 | 376 | 9% | 53% |

### Breath units (my own unit, defined here)

Cut the text at every `.` `?` `!` `,` and at every one of his own spoken commas: bro, you know, I mean, so yeah, but yeah,
type shit, or something, or whatever, and shit, for real. What is left between two cuts is one breath.

| what | n | Q1 | median | Q3 | mean | P90 | max | under 6 words | over 25 words |
|---|---|---|---|---|---|---|---|---|---|
| typed notes | 885 | 4.0 | 9.0 | 16.0 | 11.9 | 26 | 82 | 33% | 10% |
| voice messages | 2306 | 5.0 | 11.0 | 22.0 | 16.3 | 37 | 142 | 25% | 20% |

- words between one "bro" and the next, inside one voice message: n=208, Q1 12, median 20, Q3 39.
- voice: one sentence mark (. ? !) every 56.6 words; one comma every 53.8 words (39548 words measured).
- typed: one sentence mark every 42.1 words; one comma every 56.8 words (11072 words measured).

## 3. Openers

### The 40 most common openers of a whole note or message: first word

| opener | typed (of 411) | voice (of 438) | both |
|---|---|---|---|
| bro | 44 | 34 | 78 |
| also | 0 | 71 | 71 |
| i | 26 | 34 | 60 |
| and | 0 | 53 | 53 |
| the | 17 | 15 | 32 |
| yeah | 11 | 19 | 30 |
| good | 29 | 0 | 29 |
| ok | 3 | 19 | 22 |
| you | 9 | 6 | 15 |
| but | 1 | 14 | 15 |
| awesome | 7 | 7 | 14 |
| like | 1 | 13 | 14 |
| so | 7 | 6 | 13 |
| this | 12 | 1 | 13 |
| not | 12 | 0 | 12 |
| nice | 11 | 0 | 11 |
| i'm | 4 | 7 | 11 |
| oh | 0 | 11 | 11 |
| why | 7 | 1 | 8 |
| it's | 7 | 1 | 8 |
| a | 3 | 5 | 8 |
| looking | 8 | 0 | 8 |
| keep | 3 | 5 | 8 |
| okay | 0 | 8 | 8 |
| it | 5 | 2 | 7 |
| if | 1 | 6 | 7 |
| how | 3 | 3 | 6 |
| more | 4 | 2 | 6 |
| im | 3 | 3 | 6 |
| nah | 5 | 1 | 6 |
| work | 6 | 0 | 6 |
| no | 5 | 0 | 5 |
| we | 5 | 0 | 5 |
| what | 1 | 4 | 5 |
| make | 2 | 3 | 5 |
| looks | 5 | 0 | 5 |
| all | 3 | 1 | 4 |
| its | 3 | 1 | 4 |
| cool | 4 | 0 | 4 |
| hell | 3 | 1 | 4 |

### The 40 most common openers of a whole note or message: first two words

| opener | typed (of 411) | voice (of 438) | both |
|---|---|---|---|
| also i | 0 | 20 | 20 |
| bro i | 4 | 14 | 18 |
| and i | 0 | 14 | 14 |
| good progress | 13 | 0 | 13 |
| i like | 10 | 1 | 11 |
| i need | 0 | 9 | 9 |
| this is | 7 | 1 | 8 |
| ok so | 1 | 7 | 8 |
| i want | 3 | 4 | 7 |
| bro the | 5 | 2 | 7 |
| good direction | 7 | 0 | 7 |
| not final | 7 | 0 | 7 |
| oh and | 0 | 7 | 7 |
| and then | 0 | 7 | 7 |
| i don't | 3 | 3 | 6 |
| bro this | 6 | 0 | 6 |
| keep in | 2 | 4 | 6 |
| looking like | 6 | 0 | 6 |
| yeah and | 1 | 5 | 6 |
| work in | 6 | 0 | 6 |
| yeah i | 2 | 3 | 5 |
| good idea | 5 | 0 | 5 |
| looks like | 5 | 0 | 5 |
| i'm so | 3 | 2 | 5 |
| yeah bro | 2 | 3 | 5 |
| also bro | 0 | 5 | 5 |
| but yeah | 0 | 5 | 5 |
| you know | 2 | 2 | 4 |
| but you | 1 | 3 | 4 |
| also i'm | 0 | 4 | 4 |
| and also | 0 | 4 | 4 |
| not analog | 3 | 0 | 3 |
| more analog | 3 | 0 | 3 |
| bro it's | 2 | 1 | 3 |
| i dont | 2 | 1 | 3 |
| yeah just | 2 | 1 | 3 |
| ok i | 1 | 2 | 3 |
| bro like | 2 | 1 | 3 |
| battle brothers | 2 | 1 | 3 |
| terrible bro | 3 | 0 | 3 |

### The 30 most common two-word openers of a sentence inside voice messages

i don't (41), you know (32), also i (21), i need (15), and i (15), bro i (14), and then (10), i want (10), i know (9), i think (9), i just (8), ok so (8), oh and (7), does that (7), do you (6), also the (6), just keep (6), also bro (6), but yeah (6), i should (5), yeah i (5), it's just (5), i can't (5), yeah and (5), you have (5), keep in (5), i feel (5), i appreciate (4), it's like (4), it's very (4)

## 4. The most common word pairs and triples

Counted inside sentences, each distinct quote once (a stock line he pasted 27 times counts once). A pair or triple made
only of function words (the, and, I, to, like, just ...) is left out. "quotes" = how many different quotes hold it.

### Top 60 2-grams (typed + voice)

| # | 2-gram | count | quotes | typed | voice |
|---|---|---|---|---|---|
| 1 | battle brothers | 170 | 109 | 41 | 129 |
| 2 | in mind | 126 | 94 | 24 | 102 |
| 3 | and shit | 123 | 98 | 35 | 88 |
| 4 | a lot | 121 | 79 | 19 | 102 |
| 5 | bro like | 105 | 84 | 28 | 77 |
| 6 | able to | 96 | 76 | 6 | 90 |
| 7 | shit like | 85 | 66 | 16 | 69 |
| 8 | the game | 82 | 62 | 18 | 64 |
| 9 | type shit | 75 | 58 | 8 | 67 |
| 10 | the map | 72 | 52 | 14 | 58 |
| 11 | kind of | 72 | 55 | 11 | 61 |
| 12 | the same | 70 | 57 | 14 | 56 |
| 13 | lot of | 67 | 51 | 11 | 56 |
| 14 | be able | 66 | 53 | 2 | 64 |
| 15 | or something | 65 | 55 | 16 | 49 |
| 16 | the phone | 63 | 35 | 14 | 49 |
| 17 | dog shit | 61 | 55 | 32 | 29 |
| 18 | to make | 61 | 55 | 8 | 53 |
| 19 | keep that | 61 | 41 | 3 | 58 |
| 20 | keep in | 58 | 54 | 20 | 38 |
| 21 | bro i | 56 | 50 | 11 | 45 |
| 22 | shit so | 53 | 46 | 12 | 41 |
| 23 | the city | 52 | 40 | 10 | 42 |
| 24 | the settlement | 52 | 33 | 7 | 45 |
| 25 | looks like | 51 | 44 | 32 | 19 |
| 26 | to see | 50 | 39 | 7 | 43 |
| 27 | this shit | 49 | 42 | 17 | 32 |
| 28 | trying to | 48 | 35 | 4 | 44 |
| 29 | look like | 48 | 44 | 20 | 28 |
| 30 | the combat | 46 | 39 | 5 | 41 |
| 31 | the fuck | 44 | 41 | 16 | 28 |
| 32 | the whole | 44 | 36 | 10 | 34 |
| 33 | in battle | 44 | 35 | 5 | 39 |
| 34 | like bro | 44 | 41 | 8 | 36 |
| 35 | make it | 44 | 40 | 9 | 35 |
| 36 | looking like | 40 | 37 | 26 | 14 |
| 37 | the ui | 39 | 32 | 9 | 30 |
| 38 | there's a | 39 | 33 | 9 | 30 |
| 39 | fucked up | 39 | 33 | 6 | 33 |
| 40 | it looks | 38 | 36 | 21 | 17 |
| 41 | depending on | 38 | 30 | 3 | 35 |
| 42 | not final | 38 | 37 | 37 | 1 |
| 43 | the way | 37 | 35 | 9 | 28 |
| 44 | a little | 36 | 30 | 12 | 24 |
| 45 | shit bro | 36 | 35 | 8 | 28 |
| 46 | the demo | 34 | 27 | 2 | 32 |
| 47 | the screen | 34 | 24 | 3 | 31 |
| 48 | shit but | 33 | 32 | 13 | 20 |
| 49 | part of | 32 | 28 | 3 | 29 |
| 50 | for real | 32 | 29 | 10 | 22 |
| 51 | a whole | 32 | 30 | 7 | 25 |
| 52 | so keep | 32 | 26 | 2 | 30 |
| 53 | analog horror | 31 | 28 | 15 | 16 |
| 54 | you gotta | 31 | 26 | 6 | 25 |
| 55 | or whatever | 31 | 28 | 3 | 28 |
| 56 | to understand | 30 | 24 | 7 | 23 |
| 57 | shit and | 30 | 27 | 6 | 24 |
| 58 | make sure | 30 | 26 | 12 | 18 |
| 59 | type of | 30 | 28 | 3 | 27 |
| 60 | feel like | 30 | 21 | 0 | 30 |

Typed channel alone, top 25 2-grams: battle brothers (41), not final (37), and shit (35), looks like (32), dog shit (32), bro like (28), looking like (26), in mind (24), good progress (24), it looks (21), look like (20), keep in (20), a lot (19), the game (18), this shit (17), the fuck (16), shit like (16), or something (16), progress not (16), like dog (16), work in (16), in progress (16), analog horror (15), like shit (15), how battle (15)

### Top 60 3-grams (typed + voice)

| # | 3-gram | count | quotes | typed | voice |
|---|---|---|---|---|---|
| 1 | a lot of | 67 | 51 | 11 | 56 |
| 2 | be able to | 65 | 52 | 2 | 63 |
| 3 | keep in mind | 58 | 54 | 20 | 38 |
| 4 | keep that in | 57 | 39 | 3 | 54 |
| 5 | that in mind | 57 | 39 | 3 | 54 |
| 6 | what the fuck | 39 | 36 | 14 | 25 |
| 7 | and shit like | 39 | 34 | 9 | 30 |
| 8 | in battle brothers | 35 | 28 | 4 | 31 |
| 9 | so keep that | 30 | 24 | 1 | 29 |
| 10 | like dog shit | 29 | 27 | 16 | 13 |
| 11 | shit like that | 26 | 23 | 5 | 21 |
| 12 | i'm trying to | 24 | 16 | 0 | 24 |
| 13 | how battle brothers | 23 | 21 | 14 | 9 |
| 14 | on the map | 23 | 19 | 3 | 20 |
| 15 | it looks like | 22 | 21 | 12 | 10 |
| 16 | part of the | 21 | 20 | 2 | 19 |
| 17 | to be able | 20 | 18 | 1 | 19 |
| 18 | should be able | 20 | 16 | 1 | 19 |
| 19 | battle brothers does | 19 | 18 | 10 | 9 |
| 20 | the rest of | 19 | 17 | 8 | 11 |
| 21 | of the game | 19 | 14 | 9 | 10 |
| 22 | just keep in | 19 | 18 | 7 | 12 |
| 23 | and shit so | 19 | 19 | 9 | 10 |
| 24 | big brain research | 18 | 17 | 2 | 16 |
| 25 | work in progress | 18 | 17 | 16 | 2 |
| 26 | i wanted to | 18 | 18 | 0 | 18 |
| 27 | on top of | 17 | 16 | 4 | 13 |
| 28 | what's going on | 17 | 17 | 6 | 11 |
| 29 | you know maybe | 17 | 14 | 4 | 13 |
| 30 | when it comes | 17 | 15 | 2 | 15 |
| 31 | it comes to | 17 | 15 | 2 | 15 |
| 32 | of the city | 17 | 13 | 1 | 16 |
| 33 | i feel like | 17 | 11 | 0 | 17 |
| 34 | type shit so | 17 | 14 | 0 | 17 |
| 35 | the auto combat | 17 | 11 | 0 | 17 |
| 36 | on the phone | 16 | 14 | 4 | 12 |
| 37 | the fuck is | 16 | 16 | 5 | 11 |
| 38 | to be honest | 16 | 14 | 2 | 14 |
| 39 | depending on the | 16 | 14 | 1 | 15 |
| 40 | to make it | 16 | 14 | 3 | 13 |
| 41 | a bunch of | 16 | 15 | 1 | 15 |
| 42 | at the same | 16 | 14 | 2 | 14 |
| 43 | like battle brothers | 15 | 13 | 1 | 14 |
| 44 | does that make | 15 | 14 | 1 | 14 |
| 45 | that make sense | 15 | 14 | 1 | 14 |
| 46 | and shit but | 15 | 15 | 7 | 8 |
| 47 | shit so yeah | 15 | 15 | 4 | 11 |
| 48 | in the settlement | 15 | 13 | 1 | 14 |
| 49 | good progress not | 15 | 15 | 15 | 0 |
| 50 | on the screen | 15 | 12 | 2 | 13 |
| 51 | in mind like | 15 | 15 | 1 | 14 |
| 52 | in the game | 14 | 14 | 5 | 9 |
| 53 | or something like | 14 | 14 | 2 | 12 |
| 54 | progress not final | 14 | 14 | 14 | 0 |
| 55 | kind of like | 14 | 12 | 2 | 12 |
| 56 | looks like dog | 14 | 13 | 7 | 7 |
| 57 | you to understand | 14 | 12 | 2 | 12 |
| 58 | i told you | 14 | 14 | 1 | 13 |
| 59 | it feels like | 14 | 12 | 1 | 13 |
| 60 | on my phone | 14 | 11 | 0 | 14 |

Typed channel alone, top 25 3-grams: keep in mind (20), like dog shit (16), work in progress (16), good progress not (15), what the fuck (14), how battle brothers (14), progress not final (14), it looks like (12), a lot of (11), battle brothers does (10), not final not (10), final not even (10), not even close (10), of the game (9), and shit like (9), and shit so (9), more analog horror (8), the rest of (8), brothers does it (7), looks like shit (7), are you fucking (7), just keep in (7), and shit but (7), looking like dogshit (7), direction not final (7)

## 5. Swears and slang, counted

Typed = 411 distinct notes, 11468 words. Voice = 438 messages, 44648 words.

### Swears and insults

| term | typed count | typed notes with it (of 411) | typed per 1,000 words | voice count | voice messages with it (of 438) | voice per 1,000 words |
|---|---|---|---|---|---|---|
| shit, the bare word | 173 | 129 | 15.1 | 403 | 212 | 9.0 |
| fuck, any form (fuck, fucking, fucked, fucker, asfuck ...) | 85 | 68 | 7.4 | 190 | 129 | 4.3 |
| fucking | 50 | 40 | 4.4 | 98 | 67 | 2.2 |
| "and shit" | 35 | 28 | 3.1 | 88 | 70 | 2.0 |
| dogshit / dog shit | 57 | 53 | 5.0 | 31 | 29 | 0.7 |
| "type shit" | 9 | 9 | 0.8 | 71 | 52 | 1.6 |
| "this shit" / "that shit" | 23 | 23 | 2.0 | 51 | 39 | 1.1 |
| "what the fuck" / wtf | 27 | 25 | 2.4 | 26 | 25 | 0.6 |
| fucked (up) | 6 | 5 | 0.5 | 38 | 33 | 0.9 |
| ass, the bare word | 15 | 14 | 1.3 | 25 | 21 | 0.6 |
| bullshit | 6 | 6 | 0.5 | 20 | 18 | 0.4 |
| ugly | 10 | 9 | 0.9 | 9 | 8 | 0.2 |
| hate / hated | 7 | 5 | 0.6 | 11 | 10 | 0.2 |
| "are you (fucking) insane" / insane | 11 | 11 | 1.0 | 6 | 6 | 0.1 |
| terrible | 10 | 10 | 0.9 | 7 | 6 | 0.2 |
| crazy | 1 | 1 | 0.1 | 15 | 15 | 0.3 |
| "<word> ass" as an intensifier (ugly ass, big ass ...) | 5 | 5 | 0.4 | 8 | 8 | 0.2 |
| sucks / suck | 4 | 4 | 0.3 | 8 | 8 | 0.2 |
| "fuck with" / "fucking with" (= I like it) | 4 | 4 | 0.3 | 6 | 6 | 0.1 |
| damn | 2 | 2 | 0.2 | 8 | 8 | 0.2 |
| slop ("AI slop") | 6 | 6 | 0.5 | 4 | 3 | 0.1 |
| asf / "as fuck" / asfuck | 4 | 4 | 0.3 | 4 | 4 | 0.1 |
| hell (hell no, hell nah, hell yeah, what the hell) | 5 | 5 | 0.4 | 3 | 3 | 0.1 |
| "holy shit" | 5 | 4 | 0.4 | 2 | 2 | 0.0 |
| "oh my god" / "for the love of god" | 2 | 2 | 0.2 | 4 | 4 | 0.1 |
| asshole | 2 | 2 | 0.2 | 3 | 3 | 0.1 |
| dumbass / dumb fuck / dumb | 4 | 4 | 0.3 | 1 | 1 | 0.0 |
| horseshit / horse shit | 1 | 1 | 0.1 | 2 | 2 | 0.0 |
| bitch | 0 | 0 | 0.0 | 2 | 2 | 0.0 |
| jesus / jesus christ | 2 | 2 | 0.2 | 0 | 0 | 0.0 |
| mfs | 2 | 1 | 0.2 | 0 | 0 | 0.0 |
| nigga | 1 | 1 | 0.1 | 0 | 0 | 0.0 |
| fucker | 1 | 1 | 0.1 | 0 | 0 | 0.0 |

### Slang, address words and stock phrases

| term | typed count | typed notes with it (of 411) | typed per 1,000 words | voice count | voice messages with it (of 438) | voice per 1,000 words |
|---|---|---|---|---|---|---|
| bro | 183 | 126 | 16.0 | 405 | 186 | 9.1 |
| "Battle Brothers" (any spelling) | 44 | 34 | 3.8 | 136 | 80 | 3.0 |
| "look like / looking like / looks like" | 80 | 65 | 7.0 | 61 | 45 | 1.4 |
| "keep in mind" | 24 | 21 | 2.1 | 97 | 70 | 2.2 |
| vibe / vibes | 13 | 10 | 1.1 | 66 | 51 | 1.5 |
| u / ur | 28 | 22 | 2.4 | 48 | 24 | 1.1 |
| awesome | 20 | 18 | 1.7 | 37 | 31 | 0.8 |
| "for real" / fr / frfr | 14 | 14 | 1.2 | 26 | 23 | 0.6 |
| "not final" | 37 | 36 | 3.2 | 1 | 1 | 0.0 |
| "analog horror" | 18 | 18 | 1.6 | 16 | 13 | 0.4 |
| "good progress" | 24 | 21 | 2.1 | 3 | 3 | 0.1 |
| man (as address or filler; a rough count of the bare word) | 12 | 12 | 1.0 | 14 | 14 | 0.3 |
| cook / cooking / cooked / cook up / cookup | 7 | 5 | 0.6 | 15 | 11 | 0.3 |
| "big brain" | 2 | 2 | 0.2 | 18 | 17 | 0.4 |
| "work in progress" / wip | 18 | 17 | 1.6 | 2 | 1 | 0.0 |
| "the whole enchilada" | 1 | 1 | 0.1 | 11 | 10 | 0.2 |
| tho / bc / otw / pls / w (= with) | 8 | 8 | 0.7 | 4 | 3 | 0.1 |
| glitchy | 3 | 3 | 0.3 | 7 | 6 | 0.2 |
| fire (= very good) | 4 | 4 | 0.3 | 4 | 4 | 0.1 |
| "pull up" / "pulls up" / "pulled up" | 1 | 1 | 0.1 | 7 | 7 | 0.2 |
| chill | 3 | 3 | 0.3 | 3 | 3 | 0.1 |
| rn | 2 | 2 | 0.2 | 4 | 4 | 0.1 |
| "turn up" / "turn me up" / "turn it up" | 1 | 1 | 0.1 | 4 | 4 | 0.1 |
| janky / clunky / choppy | 1 | 1 | 0.1 | 4 | 4 | 0.1 |
| swag | 0 | 0 | 0.0 | 4 | 4 | 0.1 |
| amazing | 4 | 4 | 0.3 | 0 | 0 | 0.0 |
| idk | 2 | 2 | 0.2 | 2 | 2 | 0.0 |
| hella | 1 | 1 | 0.1 | 2 | 2 | 0.0 |
| beef | 1 | 1 | 0.1 | 2 | 1 | 0.0 |
| "end of story" | 0 | 0 | 0.0 | 3 | 3 | 0.1 |
| fat (= big, long: "a fat minute", "really fat") | 1 | 1 | 0.1 | 2 | 2 | 0.0 |
| brother (as address; "Battle Brothers" not counted) | 0 | 0 | 0.0 | 2 | 2 | 0.0 |
| low-key / lowkey | 1 | 1 | 0.1 | 1 | 1 | 0.0 |
| "down bad" | 2 | 2 | 0.2 | 0 | 0 | 0.0 |
| "go crazy" | 0 | 0 | 0.0 | 2 | 2 | 0.0 |
| bougie | 2 | 1 | 0.2 | 0 | 0 | 0.0 |
| god-tier / god tier / "(god)" (his "good bros" garble) | 0 | 0 | 0.0 | 1 | 1 | 0.0 |
| clout | 1 | 1 | 0.1 | 0 | 0 | 0.0 |
| "come correct" | 1 | 1 | 0.1 | 0 | 0 | 0.0 |
| "on my (fucking) soul" | 1 | 1 | 0.1 | 0 | 0 | 0.0 |
| "my bad" | 1 | 1 | 0.1 | 0 | 0 | 0.0 |
| bet (as yes) | 1 | 1 | 0.1 | 0 | 0 | 0.0 |
| yo | 0 | 0 | 0.0 | 1 | 1 | 0.0 |
| sick / dope / lit / goated | 0 | 0 | 0.0 | 1 | 1 | 0.0 |
| "no cap" / cap | 0 | 0 | 0.0 | 0 | 0 | 0.0 |
| dude | 0 | 0 | 0.0 | 0 | 0 | 0.0 |
| homie | 0 | 0 | 0.0 | 0 | 0 | 0.0 |

## 6. Fillers and tics

### Fillers

Voice-to-text keeps his fillers; the coordinator's condensed copies drop many of them (section 11).

| term | typed count | typed notes with it (of 411) | typed per 1,000 words | voice count | voice messages with it (of 438) | voice per 1,000 words |
|---|---|---|---|---|---|---|
| like (every use) | 456 | 181 | 39.8 | 1773 | 310 | 39.7 |
| just | 79 | 60 | 6.9 | 391 | 213 | 8.8 |
| "you know" | 60 | 33 | 5.2 | 401 | 145 | 9.0 |
| yeah (every use) | 65 | 50 | 5.7 | 221 | 130 | 4.9 |
| gonna | 42 | 27 | 3.7 | 170 | 102 | 3.8 |
| maybe | 35 | 18 | 3.1 | 147 | 75 | 3.3 |
| "like" right before a quote of thought ("I was like", "it's like", "be like") | 29 | 27 | 2.5 | 151 | 94 | 3.4 |
| really | 34 | 31 | 3.0 | 143 | 90 | 3.2 |
| "I don't know" / "I dont know" / idk | 23 | 18 | 2.0 | 127 | 88 | 2.8 |
| "I think" | 15 | 11 | 1.3 | 93 | 54 | 2.1 |
| "but yeah" | 18 | 18 | 1.6 | 89 | 68 | 2.0 |
| "kind of" / kinda | 18 | 16 | 1.6 | 72 | 52 | 1.6 |
| "Also" opening a sentence | 0 | 0 | 0.0 | 83 | 76 | 1.9 |
| OK / okay | 15 | 13 | 1.3 | 65 | 56 | 1.5 |
| "right now" | 6 | 6 | 0.5 | 70 | 52 | 1.6 |
| "so yeah" | 17 | 16 | 1.5 | 55 | 45 | 1.2 |
| "or something" | 16 | 16 | 1.4 | 49 | 39 | 1.1 |
| gotta | 11 | 10 | 1.0 | 52 | 41 | 1.2 |
| wanna | 10 | 8 | 0.9 | 51 | 43 | 1.1 |
| "so" opening a clause after a comma/period | 9 | 9 | 0.8 | 45 | 38 | 1.0 |
| "I mean" | 17 | 13 | 1.5 | 29 | 22 | 0.6 |
| definitely | 8 | 8 | 0.7 | 31 | 23 | 0.7 |
| "I feel like" / "it feels like" | 2 | 1 | 0.2 | 32 | 23 | 0.7 |
| actually | 6 | 6 | 0.5 | 28 | 25 | 0.6 |
| "like like" (said twice) | 4 | 4 | 0.3 | 28 | 21 | 0.6 |
| "or whatever" | 3 | 3 | 0.3 | 28 | 25 | 0.6 |
| honestly | 3 | 3 | 0.3 | 24 | 19 | 0.5 |
| potentially | 8 | 8 | 0.7 | 14 | 12 | 0.3 |
| "does that make sense" / "if that makes sense" | 2 | 1 | 0.2 | 18 | 17 | 0.4 |
| "to be honest" | 2 | 2 | 0.2 | 14 | 12 | 0.3 |
| "pretty much" | 2 | 2 | 0.2 | 12 | 10 | 0.3 |
| "I guess" | 3 | 3 | 0.3 | 11 | 9 | 0.2 |
| "first off" | 3 | 3 | 0.3 | 11 | 10 | 0.2 |
| literally | 2 | 2 | 0.2 | 11 | 11 | 0.2 |
| "(do) you understand" | 1 | 1 | 0.1 | 9 | 8 | 0.2 |
| anyway / anyways | 1 | 1 | 0.1 | 9 | 8 | 0.2 |
| obviously | 3 | 3 | 0.3 | 5 | 5 | 0.1 |
| basically | 1 | 1 | 0.1 | 5 | 5 | 0.1 |
| "you know what I mean" / "what I'm saying" | 0 | 0 | 0.0 | 5 | 5 | 0.1 |
| "at the end of the day" | 2 | 2 | 0.2 | 3 | 3 | 0.1 |
| "I'm not gonna lie" | 1 | 1 | 0.1 | 4 | 4 | 0.1 |
| "long story short" | 0 | 0 | 0.0 | 1 | 1 | 0.0 |

### The same word twice in a row (stutter in dictation, or emphasis)

- typed: 34 times; top: very very (8), like like (4), boom boom (3), it's it's (3), ever ever (1), with with (1), then then (1), now now (1), that that (1), good good (1), and and (1), on on (1)
- voice: 150 times; top: like like (30), it's it's (9), when when (7), it it (5), that that (5), i'm i'm (4), and and (4), my my (4), final final (4), if if (3), on on (3), whatever whatever (3), ever ever (2), use use (2), not not (2), or or (2), to to (2), so so (2), you you (2), because because (2), the the (2), green green (2), taller taller (2), in in (2), numbers numbers (2)
- three or more in a row (emphasis): very x3+ (5), boom x3+ (2), like x3+ (2), ever x3+ (1), use x3+ (1), green x3+ (1), taller x3+ (1), numbers x3+ (1), final x3+ (1), blah x3+ (1), definitely x3+ (1)

### How he asks, thanks and complains (set phrases)

| term | typed count | typed notes with it (of 411) | typed per 1,000 words | voice count | voice messages with it (of 438) | voice per 1,000 words |
|---|---|---|---|---|---|---|
| "has to" / "have to" / "gotta" | 54 | 39 | 4.7 | 238 | 135 | 5.3 |
| "I want" / "I wanna" | 13 | 9 | 1.1 | 119 | 84 | 2.7 |
| "you need to" / "you gotta" / "you have to" | 13 | 12 | 1.1 | 92 | 64 | 2.1 |
| "we need" / "we gotta" / "we have to" | 16 | 14 | 1.4 | 60 | 47 | 1.3 |
| "I need" ("I need you to" inside it) | 7 | 5 | 0.6 | 68 | 53 | 1.5 |
| "I like" | 29 | 23 | 2.5 | 16 | 16 | 0.4 |
| "I need you to" | 4 | 3 | 0.3 | 39 | 34 | 0.9 |
| "I don't want" / "I dont want" / "I don't wanna" | 8 | 7 | 0.7 | 32 | 27 | 0.7 |
| please / pls | 7 | 6 | 0.6 | 32 | 27 | 0.7 |
| "I should (be able to)" | 2 | 2 | 0.2 | 36 | 25 | 0.8 |
| "let's" / "lets" | 10 | 9 | 0.9 | 25 | 23 | 0.6 |
| "make sure" | 12 | 11 | 1.0 | 18 | 15 | 0.4 |
| "I love" / "in love with" | 11 | 10 | 1.0 | 14 | 11 | 0.3 |
| appreciate | 11 | 11 | 1.0 | 8 | 7 | 0.2 |
| "what's going on" / "what is going on" | 7 | 7 | 0.6 | 12 | 12 | 0.3 |
| "I'm (so) confused" | 8 | 8 | 0.7 | 10 | 10 | 0.2 |
| "why" opening a note or sentence | 9 | 8 | 0.8 | 8 | 6 | 0.2 |
| "I hate" | 6 | 4 | 0.5 | 10 | 9 | 0.2 |
| "are you (fucking) insane / for real / serious" | 12 | 12 | 1.0 | 2 | 2 | 0.0 |
| "what's up with" | 6 | 5 | 0.5 | 5 | 5 | 0.1 |
| "thank you" / thanks | 4 | 4 | 0.3 | 3 | 3 | 0.1 |
| "what's wrong with you" / "what the fuck is wrong with you" | 4 | 4 | 0.3 | 3 | 3 | 0.1 |
| sorry | 0 | 0 | 0.0 | 1 | 1 | 0.0 |

## 7. How he says yes and how he says no

The cleanest evidence is the VOTE tab: a thumb plus his own words. 247 distinct notes went with a thumbs up, 158 with a thumbs down.
A thumbs up is often not praise: of the 247 up notes, 86 contain dogshit, shit, ass, ugly, bad, terrible, sucks or worst.

- first word of a thumbs UP note (top 20): good (28), i (18), bro (14), nice (11), the (8), yeah (8), not (8), awesome (7), work (6), this (5), we (4), cool (4), why (4), looking (4), you (4), more (3), that's (3), keep (3), so (3), definitely (3)
- first two words of a thumbs UP note (top 15): good progress (13), i like (10), good direction (7), not final (7), work in (6), good idea (5), i want (3), this is (3), terrible bro (3), more analog (2), bro it's (2), nice just (2), yeah maybe (2), bro the (2), keep in (2)
- first word of a thumbs DOWN note (top 20): bro (30), the (9), i (8), this (7), it's (5), you (5), not (4), no (4), so (4), looking (4), nah (4), how (3), it (3), why (3), wtf (3), yeah (3), looks (3), i'm (3), dogshit (2), all (2)
- first two words of a thumbs DOWN note (top 15): bro this (5), this is (4), looking like (4), not analog (3), i don't (3), bro the (3), bro i (3), looks like (3), i'm so (3), it looks (2), the ui (2), they all (2), wtf is (2), yeah just (2), you know (2)

| a note / message / sentence that STARTS with | typed notes | voice messages | sentences anywhere |
|---|---|---|---|
| **yes forms** | | | |
| yes | 2 | 0 | 3 |
| yeah | 11 | 19 | 37 |
| yep / yup | 0 | 0 | 0 |
| "hell yeah" | 1 | 0 | 1 |
| bet | 1 | 0 | 1 |
| sure | 2 | 0 | 2 |
| OK / okay | 3 | 27 | 33 |
| cool | 4 | 0 | 4 |
| nice | 11 | 0 | 11 |
| awesome | 7 | 7 | 14 |
| good ... | 29 | 0 | 31 |
| great | 1 | 0 | 1 |
| fire | 1 | 0 | 1 |
| perfect / fantastic / amazing | 3 | 0 | 4 |
| "I like" | 10 | 1 | 14 |
| "I love" | 1 | 0 | 4 |
| a bare letter (his pick: A, B, C, D, E) | 5 | 0 | 5 |
| "Lets do c" style | 0 | 1 | 1 |
| decent | 4 | 0 | 4 |
| **no forms** | | | |
| no | 5 | 0 | 8 |
| nah | 6 | 1 | 7 |
| "hell no" / "hell nah" | 2 | 1 | 3 |
| "bro hell no" | 1 | 0 | 1 |
| nope | 0 | 0 | 0 |
| dead | 2 | 0 | 2 |
| "I don't" / "I dont" | 5 | 4 | 60 |
| "I hate" | 1 | 0 | 6 |
| wtf | 3 | 0 | 3 |
| "looks like" / "looking like" (then an insult) | 11 | 0 | 11 |
| dogshit | 4 | 0 | 4 |
| boring | 3 | 0 | 3 |
| "not ..." | 12 | 0 | 15 |
| "too ..." | 1 | 0 | 1 |
| terrible | 3 | 0 | 3 |
| "so ..." (so boring, so ass, so confused) | 7 | 6 | 17 |

**Yes, verbatim (sentences that open with yes, yeah, yep, hell yeah, bet, sure, OK, cool, nice, awesome)**

- "Yeah it's there." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=character-the-twelve-people-9-18, 2026-09-21)
- "Cool accidental story?" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=people-one-story-three-mouths-9-22, 2026-09-23)
- "Cool dont force interactions on the player" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=quests-somebody-stops-you-at-your-door-9-22, 2026-09-23)
- "Nice just have the bright colors not so bright u know like the vibrance is turned down a little" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=character-thirteen-on-the-runway-9-22, 2026-09-23)
- "Nice" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=lifecity-the-shop-that-is-open-9-22, 2026-09-23)
- "Yeah, it's part of this transformation." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=animation-how-you-cross-the-map-9-27, 2026-09-27)
- "Yeah, just keep in mind." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook-the-valley-reads-as-land-9-27, 2026-09-27)
- "OK, I like that." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=portrait-pick-your-man-out-9-27, 2026-09-27)
- "Awesome just keep in mind." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-one-set-of-buttons-9-25, 2026-09-27)
- "Yeah, maybe the background portraits can change." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=portrait-the-bust-9-24, 2026-09-27)
- "Nice yep and you can only customize your face and portrait potentially at like barbers in the settlement menu and shit like that like yeah you gotta click the barber house or something." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=portrait-every-dial-a-slider-9-24, 2026-09-27)
- "Yeah, I think territories is a convoluted thing." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=factions-you-cannot-see-territory-9-24, 2026-09-27)
- "Cool have this in the back of your mind and the code for right now I don't I'm sure we implement it organically." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-the-surer-the-wronger-9-24, 2026-09-27)
- "Yeah, maybe it's a random variable number." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=coordinator-when-a-person-dies-of-age-9-24, 2026-09-27)

**No, verbatim (sentences that open with no, nah, hell no, hell nah, bro hell no, dead, I don't)**

- "No difference" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook-the-ground-you-fight-on-9-21, 2026-09-21)
- "I don't wanna fucking card at the end of the day I never ever ever fucking told you that bro" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-the-night-card-9-15, 2026-09-21)
- "I DONT LIKE THESE BRO WTF" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=factions-the-dark-institutions-9-22, 2026-09-23)
- "Nahhhhhhhhhh it looks bad glitchy and clipping and shit" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=animation-the-hand-at-the-face-plays-9-22, 2026-09-23)
- "I don't want to see." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=animation-how-you-cross-the-map-9-27, 2026-09-27)
- "No, I like that I like the settlement menu more." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=coordinator-the-street-is-where-you-arrive-9-24, 2026-09-27)
- "Hell, no bro if a street is small then it's one time if the street has been then it's two it's a freeway then it's more, but yeah man that was that was so bad bro" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=world-what-a-tile-is-10-1, 2026-09-30)
- "No bro, like everything is a settlement with a menu and everything that you want to need or find is inside of a settlement, bro there's no like standalone shops or something." (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook-the-circles-become-places-9-29, 2026-09-30)
- "NAH" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=mods-mods-at-boot-9-28, 2026-10-02)
- "DEAD IDEA U MAKE THE PEOPLE FRESH WHEN U ENTER A NEW ACT" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=dynasty-three-names-reshuffle-9-27, 2026-10-02)
- "DEAD" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-what-the-bar-says-9-27, 2026-10-02)
- "Nah the map is mainly for looks u cant be putting a bunch of micro features the player doesnt understand battle brothers doesnt make it complicated and neither should you" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=lifecity-built-on-the-board-10-9, 2026-10-09)
- "Bro hell no" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-the-reshuffle-mark-10-9, 2026-10-09)
- "Nah the settlements are all looking like dogshit and not organic with the map man fr" (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=lifecity-built-on-the-map-10-9, 2026-10-09)

## 8. How he praises (20 real examples, verbatim, typed first)

1. "Holy shit you're making like 3-D looking 2-D sprites. I think we have to do that for the rest of the game. Holy shit what the fuck that looks good that's all that's the first thing I've been impressed with visual wise in a long time, bro. What the hell?" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=direction-the-face-performs-10-17, 2026-10-17]
2. "Not final but fucking amazing direction" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-the-front-screen-just-the-font-10-18, 2026-10-18]
3. "This is perfect I love it make sure people dont walk on walls though and on rooftops and shit bro" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=animation-the-town-is-alive-10-9, 2026-10-09]
4. "Fire make sure shit doesnt clip into places it shouldnt but yeah" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=character-a-new-thirteen-9-23, 2026-09-23]
5. "new ones are fire put the volume down a little bit and yeah" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=sounds-the-sign-catches-then-holds-9-28, 2026-10-02]
6. "This is good i love this direction ai slop gore horror analog amazing vibes" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=portrait-the-face-from-the-same-model-10-18, 2026-10-17]
7. "Bro, it's so bad. I actually kinda like it bro that's insane. I like that like bro it's like it's giving this like analog horror AI slop and I love it." [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook3-the-thug-through-the-rig-10-18, 2026-10-17]
8. "That's way better holy shit" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook4-the-family-in-the-valley-tans-10-18, 2026-10-17]
9. "This is one of the few things you did on your own. That is extremely impressive. This is getting a star." [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-the-loading-screen-three-feeds-11-3, 2026-11-02]
10. "Keep cooking man its good ideas" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=world-ground-effects-10-9, 2026-10-09]
11. "Fantastic progress it should all come with a slider" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=portrait-eight-dials-9-22, 2026-09-23]
12. "I like this great direction not final but very good thank you" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook-his-block-as-a-place-10-10, 2026-10-10]
13. "Way better nice!" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook2-the-street-joins-for-the-map-10-18, 2026-10-18]
14. "Good direction now finally looks like they're all plain face from Batman. Shit I really appreciate that. I like that." [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook3-the-marksman-through-the-rig-10-18, 2026-10-17]
15. "Im in love with everythibg you been cooking" [typed_vote; records/BOHEMIA_THE_TWENTY_FIRST_VOTES_10_19_26.txt, 2026-10-19]
16. "Hell yeah maybe a rarer amount the horizontal tunnels combine with vertical tunnel not as often" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook5-the-flood-tunnels-finished-11-11, 2026-11-14]
17. "I'm so fucking impressed bro, we've come such a long way, but I have a lot of feedback." [voice_record; records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md, 2026-10-24]
18. "Bro, I am so fucking in love with the loading screens." [voice_record; records/BOHEMIA_PAOLO_THE_TEXT_BELONGS_TO_THE_PICTURE_11_3_26.md, 2026-11-03]
19. "Oh my fucking God I forgot about the arena system in Battle Brothers holy shit yes I love that." [voice_record; records/BOHEMIA_PAOLO_THE_MOB_RUNS_THE_FARM_AND_THE_ARENA_11_3_26.md, 2026-11-03]
20. "Hey bro, I just played the demo and honestly I'm really proud of the progress you've been making bro." [voice_record; records/BOHEMIA_PAOLO_THE_FIGHT_IS_NIGHT_AND_DAY_I_LIKE_THE_DIRECTION_10_4_26.md, 2026-10-04]

## 9. How he insults (20 real examples, verbatim, typed first)

1. "Her portrait ugly as shit" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=people-the-one-who-walks-with-you-9-21, 2026-09-21]
2. "Wtf is this dogshit why does everything have to happen the first second of the game or even be in the demo? This shit is ass" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=people-the-one-who-stood-there-9-23, 2026-09-23]
3. "They look good for a game that doesn't give a fuck about itself." [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=character-the-twelve-people-9-18, 2026-09-21]
4. "What makes you think writing a storytime about this would be a good idea rather than actually making pixel art of footsteps that lead you to the conclusion and shit bro like why are you such a dumb fuck" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-what-the-tracks-say-9-15, 2026-09-21]
5. "This shit's not even proper English bro" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=grok-first-fight-slice-10-1, 2026-09-30]
6. "Bro, these sound effects have like the reverb of like a glass jar, bro what the fuck" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=sounds-a-footstep-that-is-not-sand-9-24, 2026-09-27]
7. "Its just all looking like donkey dog shit bro" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=combat2-the-future-boards-10-9, 2026-10-09]
8. "Looking like a seventh grader coded it and it looks like dog shit" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook-the-building-props-10-10, 2026-10-10]
9. "Bro this ui is do ugly cluttered dogshit try again" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=camp-the-injury-days-on-our-clock-10-26, 2026-11-01]
10. "Bro wtf is this horseshit" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=direction-the-wrongness-11-2, 2026-11-02]
11. "THIS UI IS ASSSS" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=run2-climbing-10-10, 2026-10-09]
12. "This is one of the worst cooks you've ever showed me" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook-the-parts-grammar-10-11, 2026-10-17]
13. "So you made something white that's awesome wasting my credit with this question" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-the-settlements-labels-10-5, 2026-10-10]
14. "Awesome I'm not sure what you did other than just highlight all the streets bro good job dog shit" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=world-the-roads-10-9, 2026-10-10]
15. "It is a cause of concern you kinda suck at sounding like a human tweeting. Some of it is good but a lot of it is kinda like what the fuck does that even mean type shit" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-the-world-feed-11-3, 2026-11-03]
16. "Renown is out clout economy translation dumbass" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=people-a-goal-the-company-sets-itself-9-30, 2026-09-30]
17. "It's all looking really bad like like a seventh grader is making my game, bro it's it's pretty fucking terrible." [voice_record; records/BOHEMIA_PAOLO_TWO_OR_THREE_MORE_ART_COOK_CHATS_A_WHOLE_REVAMP_10_10_26.md, 2026-10-10]
18. "Is this the type of fucking master coordinator you want to be bro this is dog shit, bro." [voice_record; records/BOHEMIA_PAOLO_DROP_A_JOB_RIGHT_IN_THE_TOWN_10_25_26.md, 2026-10-25]
19. "The UI is still ass." [voice_record; records/BOHEMIA_PAOLO_THE_WORK_WEEK_FOUR_LANES_AND_THE_3D_MODELS_IN_10_19_26.md, 2026-10-19]
20. "Definitely a placeholder like bro, like it looks like a fucking pyramid" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook4-a-house-a-man-can-live-in-10-11, 2026-10-17]

Stock lines he pasted across many cards (count of cards): "Work in progress keep going" x27; "good progress not final not even close" x18; "These noises are decent" x7; "Work in progress" x6; "Dogshit Work in progress" x5; "Terrible bro now this shit looks like it's not connecting to nothing bro. It looks like dog shit work in progress." x4; "Boring asf" x3; "good progress" x3; "Dogshit more analog horror" x2; "I already voted one time inside this interactive bro, so you better come correct and know the results" x2; "D" x2; "A" x2; "B" x2; "Nice" x2; "new ones fire make sure its not super loud" x2; "DEAD" x2

## 10. Punctuation and case in the typed channel (the 405 distinct vote notes he typed)

**All typed vote notes** (405 notes, 11072 words)

- starts with a capital: 365 (90%); starts lowercase: 35 (9%); whole note in CAPS: 17 (4%); a CAPS word of 4+ letters inside a normal note: 12 (3%)
- ends with a period: 51 (13%); with ?: 24 (6%); with !: 2 (0%); with nothing: 328 (81%)
- has a period anywhere: 93 (23%); a comma: 118 (29%); a ?: 37 (9%); a !: 4 (1%); no punctuation mark at all: 236 (58%)
- per 100 words: periods 1.9, commas 1.8, question marks 0.4, exclamation marks 0.0
- totals: ? 48, ! 5, runs like ?? or !!?? 3, semicolons 0, colons 0, "..." 0, emoji 4 (in 2 notes), stretched words (asfff, yettt) 9
- contractions with an apostrophe 374, without (dont, im, thats) 41; "I" 236, lowercase "i" 19; you/your 326, u/ur 28

**guess = thumb** (92 notes, 1667 words)

- starts with a capital: 74 (80%); starts lowercase: 15 (16%); whole note in CAPS: 17 (18%); a CAPS word of 4+ letters inside a normal note: 6 (7%)
- ends with a period: 1 (1%); with ?: 4 (4%); with !: 1 (1%); with nothing: 86 (93%)
- has a period anywhere: 4 (4%); a comma: 1 (1%); a ?: 6 (7%); a !: 3 (3%); no punctuation mark at all: 81 (88%)
- per 100 words: periods 0.5, commas 0.2, question marks 0.8, exclamation marks 0.2
- totals: ? 13, ! 4, runs like ?? or !!?? 3, semicolons 0, colons 0, "..." 0, emoji 4 (in 2 notes), stretched words (asfff, yettt) 9
- contractions with an apostrophe 9, without (dont, im, thats) 41; "I" 18, lowercase "i" 19; you/your 24, u/ur 28

**guess = dictated** (174 notes, 8068 words)

- starts with a capital: 174 (100%); starts lowercase: 0 (0%); whole note in CAPS: 0 (0%); a CAPS word of 4+ letters inside a normal note: 0 (0%)
- ends with a period: 48 (28%); with ?: 14 (8%); with !: 0 (0%); with nothing: 112 (64%)
- has a period anywhere: 79 (45%); a comma: 114 (66%); a ?: 22 (13%); a !: 0 (0%); no punctuation mark at all: 32 (18%)
- per 100 words: periods 2.3, commas 2.3, question marks 0.3, exclamation marks 0.0
- totals: ? 26, ! 0, runs like ?? or !!?? 0, semicolons 0, colons 0, "..." 0, emoji 0 (in 0 notes), stretched words (asfff, yettt) 0
- contractions with an apostrophe 363, without (dont, im, thats) 0; "I" 211, lowercase "i" 0; you/your 283, u/ur 0

**guess = unclear** (139 notes, 1337 words)

- starts with a capital: 117 (84%); starts lowercase: 20 (14%); whole note in CAPS: 0 (0%); a CAPS word of 4+ letters inside a normal note: 6 (4%)
- ends with a period: 2 (1%); with ?: 6 (4%); with !: 1 (1%); with nothing: 130 (94%)
- has a period anywhere: 10 (7%); a comma: 3 (2%); a ?: 9 (6%); a !: 1 (1%); no punctuation mark at all: 123 (88%)
- per 100 words: periods 1.0, commas 0.2, question marks 0.7, exclamation marks 0.1
- totals: ? 9, ! 1, runs like ?? or !!?? 0, semicolons 0, colons 0, "..." 0, emoji 0 (in 0 notes), stretched words (asfff, yettt) 0
- contractions with an apostrophe 2, without (dont, im, thats) 0; "I" 7, lowercase "i" 0; you/your 19, u/ur 0

Every note with an emoji: "Mfs charge batteries bro 🤣🤣🤣 i knkw buildings can help in our game but jesus christ mfs can charge batteries" | "I like that yeah I mean but keep in mind you know flipping between ax is a big deal asking out of it like all of the UI has to change. There has to be like a fi"

Stretched words in the typed channel: asfff (1), Nahhhhhhhhhh (1), WAYYYYYY (1), ASSSS (1), asfuckkk (1), yettt (1), wayyy (1), worststtt (1), BESTTTT (1)

Voice blocks for comparison (380 clean messages, 39548 words): per 100 words periods 1.6, commas 1.9, question marks 0.2, exclamation marks 0.0; semicolons 0; emoji 0.

## 11. What is ABSENT (counted, so the absence is measured)

Measured on the typed rows plus the voice blocks with no cut and no inserted word: 791 quotes, 51016 words.

| thing | count in his verbatim words | per 10,000 words |
|---|---|---|
| semicolon ; | 0 | 0.0 |
| em dash | 0 | 0.0 |
| en dash | 0 | 0.0 |
| double hyphen " -- " | 0 | 0.0 |
| colon : | 0 | 0.0 |
| parenthesis ( | 5 | 1.0 |
| double quote mark " | 2 | 0.4 |
| shall | 0 | 0.0 |
| whom | 0 | 0.0 |
| perhaps | 0 | 0.0 |
| indeed | 0 | 0.0 |
| however | 8 | 1.6 |
| therefore | 0 | 0.0 |
| moreover | 0 | 0.0 |
| furthermore | 0 | 0.0 |
| thus | 0 | 0.0 |
| hence | 0 | 0.0 |
| nevertheless / nonetheless | 0 | 0.0 |
| whereas | 1 | 0.2 |
| although / though (not "tho") | 17 | 3.3 |
| upon | 1 | 0.2 |
| regarding / concerning | 0 | 0.0 |
| in order to | 1 | 0.2 |
| such as | 0 | 0.0 |
| certainly / surely | 1 | 0.2 |
| rather | 4 | 0.8 |
| quite | 4 | 0.8 |
| utilize / utilized | 0 | 0.0 |
| whilst / amongst | 0 | 0.0 |
| must | 1 | 0.2 |
| "as if" | 0 | 0.0 |
| "as though" | 0 | 0.0 |
| "like a" / "like an" | 125 | 24.5 |
| "as <word> as" (as big as a house) | 25 | 4.9 |
| "it is" spelled out (he says it's / its) | 28 | 5.5 |
| "do not" spelled out | 6 | 1.2 |
| "cannot" | 20 | 3.9 |
| "I am" spelled out | 11 | 2.2 |

**Every "however" in context (8):**

- ... like that combat in traversing the city are two different things and however, we can implement them with what we have you know with the ass we hav... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-the-fight-is-a-different-game-9-27, 2026-09-27)
- Good idea nice progress however, I'm just keeping in mind. I hate the way everything looks bro. (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=direction-the-map-at-every-stop-10-9, 2026-10-09)
- ...e map should just be really fat and then it just changes the view and however, the screen is oriented zoom out let's just do that for real (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=combat-both-teams-the-map-not-black-10-11, 2026-10-17)
- ... is mostly going to be in the tweet system this format you gave to me however I did hear all the newest sound effects that you got and why am I shi... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=radio-the-town-you-did-not-defend-11-3, 2026-11-03)
- ...travel the only way you could travel as fast as the speed of light or however, fast you know radio signals from satellites work even right now and ... (records/BOHEMIA_PAOLO_ENDINGS_THE_COMPANY_ACROSS_ACTS_NO_FLIP_AT_START_BUILD_IT_9_28_26.md, 2026-09-28)
- ...w like just always keep the whole picture in mine you know like do it however you want but like you know, I did a couple two star quest and sometim... (records/BOHEMIA_PAOLO_THE_JOB_TELLS_THE_TRUTH_IN_BLOOD_10_25_26.md, 2026-10-25)
- ...on't know if I told you I like the songs I want you to implement them however one thing though I just want you to understand like like there has to... (records/BOHEMIA_PAOLO_THE_SONGS_GO_IN_AND_HIS_TURN_HITS_HARD_10_25_26.md, 2026-10-25)
- ...ame pace like it's some fucked up like it will speed up and slow down however it wants and shit like I want it consistent with the BPM of the music... (records/BOHEMIA_PAOLO_A_TOWN_IS_SAFE_ONE_PACE_ON_THE_BEAT_PAID_AT_THE_EDGE_10_26_26.md, 2026-10-26)

**Every "semicolon" in context (0):**


**Every ""as if" / "as though"" in context (0):**


**Every "rather" in context (4):**

- ...t makes you think writing a storytime about this would be a good idea rather than actually making pixel art of footsteps that lead you to the conc... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-what-the-tracks-say-9-15, 2026-09-21)
- ...monds like oscillate and how they are next to each other, but I would rather have it a square to be honest, I like the idea more so it's it is alw... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-one-set-of-buttons-9-25, 2026-09-27)
- So yeah, I'd rather prefer something that can just get implemented into my repo. I make a... (records/BOHEMIA_PAOLO_ONE_TIME_PURCHASE_NO_MONTHLY_NO_OUTSIDE_CREDITS_10_10_26.md, 2026-10-10)
- ...you made that decision but like it could be a decision like maybe I'd rather have the shield as one-handed off hand. We need one hand like I tried... (records/BOHEMIA_PAOLO_THE_SHIELD_IS_ONE_HAND_AND_A_TWO_HANDER_WEARS_ITS_OWN_NAME_10_25_26.md, 2026-10-25)

**Every "must" in context (1):**

- ...or whatever but just like the background bullshit like that I've only must go way down so anything that's volume wise. I should be seeing a slid... (records/BOHEMIA_PAOLO_ONE_SONG_ONLY_AND_THE_VOLUME_SLIDERS_10_20_26.md, 2026-10-20)

**Every "quite" in context (4):**

- I'm not quite sure how I like of owning the other settlements because that sounds l... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=factions-a-crew-at-your-gate-10-1, 2026-09-30)
- ... even just trying to have things load underneath other things I'm not quite sure, bro so please just have things that are gonna be final visuals ... (records/BOHEMIA_PAOLO_ONLY_THE_FINAL_LOOK_LOADS_AND_THE_LOADING_SCREEN_TELLS_THE_TRUTH_10_25_26.md, 2026-10-25)
- ...u close the game open it back up and then it's a random role. I'm not quite sure but keep that in mind. I started it because it was awesome. Do n... (records/BOHEMIA_PAOLO_THE_START_SCREEN_TWO_WAYS_AND_NOTHING_ELSE_11_3_26.md, 2026-11-03)
- ...and then it'll still kind of be like one screen vibe. I guess I'm not quite sure but I do know what's about to happen because you know our game i... (records/BOHEMIA_PAOLO_YOUR_SETTLEMENT_THROUGH_ITS_OWN_CAMERAS_11_3_26.md, 2026-11-03)

**"like a / like an" in context (125 in all; the first 60 are shown, typed first). Read them: nearly all are a plain comparison
to a concrete thing ("looks like a seventh grader coded it") or the filler "like" followed by "a"; none is a literary figure.**

- Bro, it's like an interactive inside of an interactive you better have go... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=sounds-the-phone-still-transmits-9-21, 2026-09-21)
- This seems like a fucking something in the settings, bro why are you aski... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-five-ways-a-choice-fits-9-13, 2026-09-21)
- ...ts the human close shit bro. And the phone should look like a cracked iphone bro (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-the-phone-in-your-pocket-9-23, 2026-09-23)
- ... smooth. I don't want to see. I don't want to see move like a block at a time you know like boom boom boom boom I jus... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=animation-how-you-cross-the-map-9-27, 2026-09-27)
- ...esome so for example, higher terrain for us could mean like a building may be still with the roof that you can be on ... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=combat-the-only-high-ground-9-27, 2026-09-27)
- ...dd more pixels to all the squares and shit so it reads like an actual map instead of some Atari bullshit then we gotta... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook-the-valley-reads-as-land-9-27, 2026-09-27)
- ...f it like all of the UI has to change. There has to be like a filter cut Syn 🛹 thing that impacts everything. The pho... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=dynasty-three-on-the-phone-9-24, 2026-09-27)
- ...t that we make like if you wear a hat or a headgear or like a helmet like you will see that so yeah we're still findi... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=portrait-the-bust-9-24, 2026-09-27)
- ...ey have like castle seizures and shit so maybe there's like a settlement, siege and shit other than that like yeah (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=factions-you-cannot-see-territory-9-24, 2026-09-27)
- Bro, these sound effects have like the reverb of like a glass jar, bro what the fuck (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=sounds-a-footstep-that-is-not-sand-9-24, 2026-09-27)
- ... once in a blue moon when you need to or maybe there's like a bonus on the settlement menu where it shows you that li... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=lifecity-the-shift-is-logged-9-24, 2026-09-27)
- ...ettlement menu where it shows you that like oh my God, like a recent battle of place here so that the odds of like ge... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=lifecity-the-shift-is-logged-9-24, 2026-09-27)
- Yeah, like a street has to be a tile bro if it's a freeway it might ... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=combat-a-street-of-houses-9-30, 2026-09-30)
- ...ke of owning the other settlements because that sounds like a big big fucking deal and that can't be some like cheap ... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=factions-a-crew-at-your-gate-10-1, 2026-09-30)
- ...s that overtime you can like form your formations with like a gambit Final Fantasy 12 system if you choose to if you ... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=tuning-how-long-a-fight-takes-9-29, 2026-09-30)
- ...ds for the game but all the mod ideas you came up with like a low-key fire so now they gotta be implemented in our ga... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=mods-what-mods-fix-9-29, 2026-09-30)
- this ui is looking like dogshit not like a studio made game like some ai slop claude bullshit so t... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=combat-the-perk-skills-10-2, 2026-10-02)
- ...nly spend a maximum of 300-450 days in a single act so like a year passes by. This mechanic is ass asf (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=dynasty-old-body-10-9, 2026-10-09)
- ...at we did that so like meandered off bro and it's just like a lot of of the work we did is like evolved from the orig... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=direction-the-twin-the-ground-10-10, 2026-10-10)
- ... like any of the assets that I bought doesn't it looks like a seventh grader coded it. (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=animation-four-legs-10-9, 2026-10-10)
- These cracks look like a seventh grader coded it. It looks so bad. (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=direction-the-four-phones-10-9, 2026-10-10)
- Looking like a seventh grader coded it and it looks like dog shit (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook-the-building-props-10-10, 2026-10-10)
- I'm so confused what is the purpose of this? Is this like a tutorial or something? (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-the-fights-bar-10-4, 2026-10-10)
- ...e biggest character the main character was like it was like a shadow line behind him what's going on with that? It's ... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=animation-the-parties-walk-10-9, 2026-10-10)
- Awesome the UI is looking like a seventh grader coded it bro it's looking dog shit but I... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-settings-in-our-materials-10-4, 2026-10-10)
- ...fferent arcs so first off, bro it's not gonna be until like an endgame crisis and just one of the timelines that you c... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-the-phones-text-10-10, 2026-10-10)
- ... shit. They're literally just straight lines. It looks like a seventh grader coded it bro. (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=ui-the-phones-text-10-10, 2026-10-10)
- ...t it. You're not doing anything else like like this is like a house for an elf for a midget or something. Good direct... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook4-one-house-the-packs-way-10-10, 2026-10-10)
- I don't know it looks like a fox and the fox looks way better than the werewolf or w... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=direction-the-rig-moves-10-17, 2026-10-17)
- It's decent but like there's like a weird like blue or orange outline around people like wh... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=combat-light-that-interacts-10-11, 2026-10-17)
- Definitely a placeholder like bro, like it looks like a fucking pyramid (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook4-a-house-a-man-can-live-in-10-11, 2026-10-17)
- ...mber that I want you to be easier than battle Brothers like a matching bat bringing battle Brothers into this fun lik... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=tuning-the-numbers-around-the-fight-10-18, 2026-10-17)
- The truck looks like a little too much like like a plate toy for real so turn ... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=direction-the-rig-round-five-10-18, 2026-10-17)
- The truck looks like a little too much like like a plate toy for real so turn it up, bro. It's not it's no... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=direction-the-rig-round-five-10-18, 2026-10-17)
- ...like it looks like you made some hair look like it was like a medieval Link mesh armor so just keep in mind. All of t... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=portrait-every-face-from-the-same-model-10-18, 2026-10-18)
- ... they're still 120 BPM you know so I wonder if there's like a middleground to reach for all of this, but yeah, like I... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=sounds-over-the-ridge-10-18, 2026-10-18)
- ...most bro this is the fucking worst. This does not look like a fucking strip. Are you insane? (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=combat-place-strip-11-3, 2026-11-02)
- It is a cause of concern you kinda suck at sounding like a human tweeting. Some of it is good but a lot of it is k... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-the-world-feed-11-3, 2026-11-03)
- I want it to be like a fun minigame (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=scavenge-the-design-for-his-yes-11-7, 2026-11-06)
- ...e I just give you examples like I said something about like a shopping cart to pick up the bodies, but like that was ... (records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=world-11-the-carcass-and-the-vultures-11-6, 2026-11-06)
- ...nna play like battle Brothers on my phone you know but like a lot better you know like with everything we have going ... (records/BOHEMIA_PAOLO_BATTLE_BROTHERS_ON_MY_PHONE_ANALOG_HORROR_AND_THE_ALPHA_OPENS_IN_VOTE_9_20_26.md, 2026-09-20)
- ...ike machine party and we talked about you, not putting like a Grim filter on things, but I think we need to just full... (records/BOHEMIA_PAOLO_BATTLE_BROTHERS_ON_MY_PHONE_ANALOG_HORROR_AND_THE_ALPHA_OPENS_IN_VOTE_9_20_26.md, 2026-09-20)
- ...med at the same time. It's like not playable yet. It's like a lot going on and I see it but like this shit is broken ... (records/BOHEMIA_PAOLO_OVERWHELMED_AND_UNDERWHELMED_9_20_26.md, 2026-09-20)
- And in the demo, there should be like a note section at the very top right or something like ju... (records/BOHEMIA_PAOLO_THE_NOTES_BUTTON_9_20_26.md, 2026-09-20)
- ... demo you vote in the alpha only all I needed was just like a little hideaway note section while I played the demo th... (records/BOHEMIA_PAOLO_VOTE_IN_THE_ALPHA_ONLY_AND_THE_3D_CHAT_IS_UI_9_20_26.md, 2026-09-20)
- ... click anything so I don't know why we don't just have like a real loading screen when the alpha opens up, not the de... (records/BOHEMIA_PAOLO_WANTS_TO_RESTART_9_20_26.md, 2026-09-20)
- ...ow so yeah maybe I'm machine gun is like comparable to like a great sword in battle, Brothers, or like a battle ax or... (records/BOHEMIA_PAOLO_NEWGROUNDS_AND_THE_MACHINE_GUN_9_24_26.md, 2026-09-24)
- ...mparable to like a great sword in battle, Brothers, or like a battle ax or something (records/BOHEMIA_PAOLO_NEWGROUNDS_AND_THE_MACHINE_GUN_9_24_26.md, 2026-09-24)
- ...ll gonna keep in mind that like each tile is as big as like a mini block like a building or something so I think the ... (records/BOHEMIA_PAOLO_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md, 2026-09-24)
- ...ind that like each tile is as big as like a mini block like a building or something so I think the combat we're still... (records/BOHEMIA_PAOLO_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md, 2026-09-24)
- ...t like tay stand on effect really other than like just like a small mound on the floor that you can get like accuracy... (records/BOHEMIA_PAOLO_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md, 2026-09-24)
- ...u're doing to build your company like you're gonna die like a lot and I love that feeling like maybe instead of like ... (records/BOHEMIA_PAOLO_450_HOURS_THE_FIGHT_GETS_DEEP_9_27_26.md, 2026-09-27)
- ...t you to finish three questions one round. Do you know like a lot of the shit I've seen is when it comes to like crea... (records/BOHEMIA_PAOLO_QUESTS_AT_VOLUME_AND_THE_BB_SHAPE_9_27_26.md, 2026-09-27)
- ...he tiles are like big as a city like parts of the city like a house is one tile and I've told you this millions of ti... (records/BOHEMIA_PAOLO_A_COMBAT_TILE_IS_A_HOUSE_I_READ_IT_BACKWARDS_9_28_26.md, 2026-09-28)
- ...an every tile is a fucking house. It still has to look like a fucking city. We have neighbors. We have so many asses ... (records/BOHEMIA_PAOLO_A_TILE_IS_HOUSE_SIZED_NOT_EVERY_TILE_IS_A_HOUSE_9_28_26.md, 2026-09-28)
- ...like how you're able to re-create like dark souls with like a two sentence prompt you know so I wish you could kind o... (records/BOHEMIA_PAOLO_ENDINGS_THE_COMPANY_ACROSS_ACTS_NO_FLIP_AT_START_BUILD_IT_9_28_26.md, 2026-09-28)
- ...mes like rogue four you know Val Heim you know fallout like a bunch of these games and they're so super important but... (records/BOHEMIA_PAOLO_ENDINGS_THE_COMPANY_ACROSS_ACTS_NO_FLIP_AT_START_BUILD_IT_9_28_26.md, 2026-09-28)
- ...t looking on you know and every combat fight damn near like a fucking a block war you know a pistol could be comparab... (records/BOHEMIA_PAOLO_MOSTLY_CITY_A_BLOCK_WAR_PISTOL_IS_A_DAGGER_9_29_26.md, 2026-09-29)
- ...g a block war you know a pistol could be comparable to like a dagger in battle Brothers and a machine good could be c... (records/BOHEMIA_PAOLO_MOSTLY_CITY_A_BLOCK_WAR_PISTOL_IS_A_DAGGER_9_29_26.md, 2026-09-29)
- ...tle Brothers and a machine good could be comparable to like a two handed hammer or something you know (records/BOHEMIA_PAOLO_MOSTLY_CITY_A_BLOCK_WAR_PISTOL_IS_A_DAGGER_9_29_26.md, 2026-09-29)

### Why the condensed copies are not counted: the coordinator cleans him up

VAMILY quotes whose wording is at least half found in a verbatim row (551 quotes, 18135 words) against the voice blocks (44648 words):

| per 1,000 words | voice blocks (verbatim) | VAMILY quotes of the same speech |
|---|---|---|
| like | 39.7 | 10.2 |
| bro | 9.1 | 0.8 |
| you know | 9.0 | 0.2 |
| shit | 9.0 | 3.8 |
| fuck* | 4.3 | 2.0 |
| yeah | 4.9 | 0.1 |
| semicolons | 0.0 | 5.8 |
| "..." cuts | 4.1 | 40.7 |
| commas | 20.4 | 44.8 |

VAMILY and CLAUDE.md quotes checked against the verbatim rows (839): half or more of its wording found: 480; some found (20 to 50%): 153; not found in the verbatim rows (older than 9/13, newer than the last record, or a paraphrase): 135; word for word inside a verbatim row: 71

## 12. Voice-to-text garbles (do not learn these as his words)

Words the dictation got wrong, as seen in the verbatim rows (count of rows):

- "quiz" for quest: 1
- "analog whore" / "horrir" for analog horror: 2
- "rating party" for raiding party: 3
- "fashions" for factions: 2
- "ax" / "acts" for acts: 1
- "Malay" for melee: 13
- "3040" for 30 to 40: 2
- "the feet" / "fee" for the feed: 2
- "awards" for words: 1
- "towels" for tiles: 2
- "Rhino" for "I know": 1
- "Walheim" / "Val Heim" for Valheim: 3
- "cut Syn" for cutscene: 2
- "(god)" for good: 3
- "plate test" for playtest: 1
- "ragged Daling" for ragdolling: 1
- "boat shit" for vote shit: 1
- "goaded" for goated: 1

## 13. Fifteen sentences that sound most like him (picked by hand, verbatim, typed first)

1. "Idk what i was reading wtf" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-the-twelve-get-an-end-9-24, 2026-09-21]
2. "Boring asf" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-the-first-ask-spoken-9-21, 2026-09-21]
3. "Chill with the spanglish bro some characters might speak Spanglish to you doesn't mean you will fucking asshole" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-saying-yes-to-a-job-9-15, 2026-09-21]
4. "They look good for a game that doesn't give a fuck about itself." [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=character-the-twelve-people-9-18, 2026-09-21]
5. "good progress not final not even close" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=combat2-night-boards-10-1, 2026-10-02]
6. "Looking like a seventh grader coded it and it looks like dog shit" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook-the-building-props-10-10, 2026-10-10]
7. "Bro, these sound effects have like the reverb of like a glass jar, bro what the fuck" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=sounds-a-footstep-that-is-not-sand-9-24, 2026-09-27]
8. "Fire make sure shit doesnt clip into places it shouldnt but yeah" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=character-a-new-thirteen-9-23, 2026-09-23]
9. "It is a cause of concern you kinda suck at sounding like a human tweeting. Some of it is good but a lot of it is kinda like what the fuck does that even mean type shit" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=words-the-world-feed-11-3, 2026-11-03]
10. "Whatever battle Brothers does, I don't need you to do this bullshit" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=tuning-the-difficulty-dials-10-1, 2026-09-30]
11. "Mfs charge batteries bro 🤣🤣🤣 i knkw buildings can help in our game but jesus christ mfs can charge batteries" [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=world-the-rules-run-with-the-dirt-9-21, 2026-09-21]
12. "Bro, it's so bad. I actually kinda like it bro that's insane." [typed_vote; records/target/BOHEMIA_VOTE_REGISTRY.json verdicts[] id=cook3-the-thug-through-the-rig-10-18, 2026-10-17]
13. "I appreciate the deep psychological philosophical dive you wanted to go into it, but let's just have some fun bro come on" [voice_record; records/BOHEMIA_PAOLO_LETS_JUST_HAVE_SOME_FUN_9_20_26.md, 2026-09-20]
14. "bro let's just re-create battle Brothers with our whole swag" [voice_record; records/BOHEMIA_PAOLO_NO_TWO_COMBAT_MAPS_ALIKE_RECREATE_BB_WITH_OUR_SWAG_9_29_26.md, 2026-09-29]
15. "this is how I want like the communication to feel sometimes bro this is Bohemian bro this my swag" [voice_record; records/BOHEMIA_PAOLO_THE_LAST_TRANSMISSIONS_11_3_26.md, 2026-11-03]

And one game line he wrote himself, for a perk he called decoy (dictated, cut by the recorder): "a new perk potentially called decoy... the description: did you seriously just walk around with a cardboard cut out... you can set it down, enemy can as well... the enemy can have abilities as well" [records/BOHEMIA_PAOLO_THE_DEAD_THE_NAME_THE_SOUND_AND_THE_FIGHT_NOTES_11_3_26.md, 2026-11-03]

## 14. Caveats (read before trusting any number above)

1. **"Typed" is two things.** Of the 405 distinct notes he put in the VOTE tab, the rule guesses 92 thumb-typed, 174 dictated into the box, 139 unclear (short). The thumb-typed ones are the purest sample of how he WRITES: no periods, no commas, u / ur / im / dont, caps for shouting.
2. **"Voice" is voice to text.** The capitals, periods and commas in it are the phone's, not his, and words are garbled (section 12). 62 of the 438 record blocks look thumb-typed, not dictated (short chat messages, some in caps lock).
3. **Condensed copies are in the corpus but not in the counts.** 839 VAMILY/CLAUDE.md quotes, 349 inline fragments from records and vote summaries, 195 card quote-backs: all `verbatim: null`. The coordinator cuts with `...`, drops like / bro / you know, adds commas and semicolons, fixes spelling, and sometimes caps a headline. 58 record blocks counted as verbatim still carry a cut or an [inserted word]; they are used for word counts, never for length or punctuation.
4. **Some VAMILY quotes are not his sentences.** The rule "Paolo <m/d> ... 'quote'" also catches a law's wording about him. 135 VAMILY/CLAUDE.md quotes share under 20% of their wording with any verbatim row; most of those are real (dates with no record file in scope, before 9/13 or after 11/10), but in a hand check of 70 of them about 8 were law text or a paraphrase (for example "A card that promises something and does nothing is the worst bug in the game: deliver it or remove it."). 7 rows are flagged `lead_suspect`.
5. **Three vote comments were entered by the coordinator from his speech** (`verbatim: false`), one of them copied onto 13 song cards; they are not counted.
6. **Three typed notes began with words pasted from the card**; only his own span is kept as `text` (`text_full` has all of it).
7. **Dates.** A record is dated by its file name; a vote by the export's day (`when`), which can be earlier than the date in the card's id.
8. **Scope.** Only the three named sources were mined: the vote registry, records/BOHEMIA_PAOLO_* and records/*VOTE*.txt (375 files, 348 of them gave at least one his-words block), VAMILY.md and CLAUDE.md. His words before 9/13 live mostly in laws/ and are here only as far as VAMILY.md and CLAUDE.md quote them. The newest message about talk (11/17) exists only as a condensed VAMILY quote.
9. **The block rule can miss or mislabel.** A quote counts as a his-words block only when the record says so (a HIS WORDS heading, "His words:", "verbatim", a "# PAOLO <date>: " title in his own case, or a stand-alone quoted paragraph). `review_blocks.txt` and `dropped_fragments.txt` beside this file list what the rule took and what it threw away.
10. **Praise, insult and "most like him" lists were picked by hand** from the verbatim rows; the script checks each one is in the corpus word for word.

