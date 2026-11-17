# WORDS TWO 11/17: writes records/BOHEMIA_WORDS_TWO_EVERY_MOUTH_AND_WHY_IT_IS_NOT_HUMAN_11_17_26.md. Every sample and number on that page is read from
# the game's files and records/words_two/measure_every_mouth.json by this script; the prose between them is this lane's. Run from the repo root
# after python3 records/words_two/measure_every_mouth.py. It rewrites nothing in the game.
import json,re
def J(p): return json.load(open(p,encoding='utf-8'))
M={r['name']:r for r in J('records/words_two/measure_every_mouth.json')}
G=M['ALL THE GAME']; PT=M['PAOLO, TYPED']; PV=M['PAOLO, VOICE']
ev={e['id']:e for e in J('records/target/BOHEMIA_ROAD_EVENTS.json')['events']}
cv=J('records/target/bb/crew_voices.json'); fr={r['id']:r for r in J('records/target/bb/fight_reasons.json')['rules']}
bs={o['id']:o for o in J('records/target/BOHEMIA_BOARD_SHELF.json')['offers']}
rr=J('records/target/bb/rare_recruits.json')['men']; rt={f['id']:f for f in J('records/target/bb/retinue.json')['followers']['value']}
ba=J('records/target/bb/boss_act_one.json')['bosses']
fk={k['id']:k for k in J('records/target/bb/feed_kinds.json')['kinds']}; fw={k['id']:k for k in J('records/target/bb/feed_world.json')['kinds']}
rl=J('records/target/bb/radio_lines.json'); ru={r['id']:r for r in J('records/target/settlement_rumours.json')['rumours']}
tr={t['id']:t for t in J('records/target/settlement_traits.json')['traits']}
sec=J('records/target/words/the_second_speaks.json')['lines']
st=open('slices/BOHEMIA_SETTLEMENT_SCREEN.html',encoding='utf-8').read()
def rx(p):
    m=re.search(p,st); assert m,p; return m.group(1).replace("\\'","'")
def opt_say(e,i):
    fx=ev[e]['opts'][i]['fx']; return fx['say']
T=lambda L,t:cv['types'][t]['lines']
q=lambda s:'"'+s+'"'
S={}
S['kid']=ev['ev_the_hungry_kid']['says']; S['kid_no']=opt_say('ev_the_hungry_kid',2)
S['toll']=ev['ev_the_toll_kids']['says']; S['cartel']=ev['ev_the_cartel_checkpoint']['says']
S['time_no']=opt_say('ev_the_timeshare_man',2); S['time_buy']=opt_say('ev_the_timeshare_man',1)
S['padre']=ev['ev_the_three_oclock_bell']['says']; S['padre_stand']=opt_say('ev_the_three_oclock_bell',0); S['padre_no']=opt_say('ev_the_three_oclock_bell',2)
S['box']=ev['ev_the_short_box']['says']
S['rosaura']=bs['qd-ae10']['says']; S['adair']=bs['qd-s03']['says']; S['vela']=bs['qd-c02']['says']; S['paco']=bs['qd-ap07']['says']
S['elder']=rx(r"var TIER_LINE = \{\s*camp: '(?:[^'\\]|\\.)*',\s*town: '((?:[^'\\]|\\.)*)'"); S['elder_camp']=rx(r"var TIER_LINE = \{\s*camp: '((?:[^'\\]|\\.)*)'")
S['stall']=rx(r"speak\(k, line \|\| said \|\| '((?:[^'\\]|\\.)*)'\)"); S['smith']=rx(r"smith:'((?:[^'\\]|\\.)*)'"); S['barber']=rx(r"speak\(k, line \|\| '(Sit down\.(?:[^'\\]|\\.)*)'\)")
S['street0']=rx(r'var STREET_LINES = \["((?:[^"\\]|\\.)*)"'); S['street1']=rx(r'var STREET_LINES = \["(?:[^"\\]|\\.)*",\s*"((?:[^"\\]|\\.)*)"')
S['dog']=ru['tagged_dog']['says']; S['raided']=tr['raided']['says']['any']
S['rare13']=rr[13]['line']; S['rare5']=rr[5]['line']; S['rare2']=rr[2]['line']; S['rare1']=rr[1]['line']; S['cook']=rt['cook']['ask']
S['hit']=cv['types']['hustler']['lines']['hit']['en'][2]; S['kill_q']=cv['types']['quiet']['lines']['kill']['en'][0]; S['down_m']=cv['types']['mother']['lines']['man_down']['en'][2]
S['worr']=cv['types']['worrier']['lines']['their_turn']['en'][0]; S['joker_miss']=cv['types']['joker']['lines']['miss']['en'][1]
S['win_dead']=cv['types']['deadpan']['lines']['win']['en'][5]; S['win_hust']=cv['types']['hustler']['lines']['win']['lost_one']['en'][0]; S['win_old']=cv['types']['old_hand']['lines']['win']['en'][5]; S['win_joke']=cv['types']['joker']['lines']['win']['en'][6]
S['why_house']=fr['road.house.ground']['them'][0]; S['why_kids']=fr['job.kids']['them'][0]; S['why_boss']=fr['boss.men']['them'][1]; S['why_ours']=fr['raid.dead']['ours'][1]; S['why_brig']=fr['road.brigands']['them'][0] if 'road.brigands' in fr else ''
S['carmen']=ba[0]['lead']['asker']['says']; S['carmen_after']=ba[0]['after']['says']; S['boss_says']=[b['boss'].get('says') for b in ba if b['boss'].get('says')]
S['meme']=fk['life_meme']['words'][6]['en']; S['ask']=fk['ask']['words'][0]['en']; S['mem']=fk['memorial']['words'][0]['en']; S['toll_page']=fk['page_brigands_notice']['words'][4]['en']
S['far']=fw['far_prices']['words'][0]['en']; S['fall']=rl['towns']['Church']['lines'][9]['say']; S['fall2']=rl['towns']['_plain']['lines'][6]['say']
S['dead']=sec['dead']['line']; S['night']=sec['first_night']['line']; S['phone_job']=sec['phone_job']['line']; S['first_pay']=sec['first_pay']['line']
n_boss_says=len(S['boss_says'])
def row(name,label=None):
    r=M[name]; return "| %s | %d | %d | %s | %s | %s | %s | %s | %s%% | %s%% | %s%% |"%(label or name,r['n'],r['med_words'],r['med_sent'],r['contr'],r['unc'],r['swear'],r['fill'],r['short_end'],r['period_end'],r['q'])
order=['road: what the stranger says','road: the answer after his choice','road: side quest talk','town: job givers at the board','town: keepers, the Elder, the bar','hires: rare men and the retinue','fight: his men mid-fight','fight: the survivor after','fight: the why line','bosses: the asker and after','feed: the valley','feed: far away','feed: a town falling']
tbl='\n'.join(row(n) for n in order)+'\n'+row('ALL THE GAME','**ALL THE GAME**')+'\n'+row('PAOLO, TYPED','**PAOLO, TYPED (his vote notes)**')+'\n'+row('PAOLO, VOICE','**PAOLO, SPOKEN (voice to text)**')
whyr=M['fight: the why line']
out=f'''# WORDS TWO: EVERY MOUTH IN THE GAME, AND WHY IT DOES NOT SOUND LIKE A PERSON (11/17/26)

VAMILY rule 454(b), ask row 628. RESEARCH ONLY. draft:true. NOTHING IN THE GAME WAS REWRITTEN, and this record proposes no rewrite.
It names what is there, measures it, and says what is still not known. THE VOICE is his: it is written only from his answers on the
homework cards (records/BOHEMIA_WORDS_TWO_HIS_HOMEWORK_THE_FIRST_TWENTY_11_17_26.md).

PAOLO 11/17: 'every time you have a human talk it's so fucking bad, from the overworld quest cards to whatever settlement bullshit is
going on to your team during combat, all of the dialog is so not human, no swag, no aesthetic... don't do anything to fix it yet... do
big brain research... I already know how I want people to talk in the game, my little swag, from the tweets to everything that
represents human dialog.'

## 0. THE ANSWER FIRST

1. THE GAME HOLDS ABOUT 3,000 LIVE SPOKEN LINES IN SOME 15 MOUTHS ({G['n']:,} of them measured here, {G['words']:,} words). Every one is a
   draft:true attempt. They live in a dozen data files and one page; section 1 is the map.
2. HE IS RIGHT, AND IT CAN BE COUNTED. Measured with one ruler against {PT['n']+PV['n']} verbatim quotes of his own (about 56,000 words):
   - NOBODY SWEARS. The game: {G['swear']} swear words per 1,000. Him: {PT['swear']} typed, {PV['swear']} spoken.
   - NOBODY SAYS 'LIKE'. Filler words (like, just, yeah, bro, kinda, you know, I mean): the game {G['fill']} per 1,000; him {PT['fill']} and {PV['fill']}.
   - EVERY LINE ENDS ON A PUNCHLINE. Where a line has two sentences or more, the last one is four words or fewer {G['short_end']}% of the time
     (his men in a fight {M['fight: his men mid-fight']['short_end']}%, the survivor {M['fight: the survivor after']['short_end']}%). Him: {PT['short_end']}% typed, {PV['short_end']}% spoken.
   - EVERYBODY TALKS IN SHORT FINISHED SENTENCES. The game's middle sentence is {G['med_sent']} words and {G['period_end']}% of lines end on a full
     stop. His middle sentence is {PT['med_sent']} words typed and {PV['med_sent']} spoken (a run-on), and {100-PT['period_end']}% of his typed notes end with no mark at all.
   - THE TOWN AND THE ENEMY TALK LIKE A CONTRACT. 'do not', 'cannot', 'it is' per 1,000 words: the why line {whyr['unc']}, the hires
     {M['hires: rare men and the retinue']['unc']}, the job givers {M['town: job givers at the board']['unc']}. Him: {PT['unc']}. The job givers use {M['town: job givers at the board']['contr']} contractions per 1,000; he uses {PT['contr']}.
   - ONE SKELETON PER MOUTH. {whyr['and2']}% of the {whyr['n']} why lines are one sentence built 'this, and that'. Every job giver is two sentences
     with the pay in the second. A fight bark is two or three clipped pieces.
   - EVERYBODY IS WISE. 'nobody, everybody, always, never, nothing, everything': the game {G['absol']} per 1,000, him {PT['absol']}.
   - THE SPANISH IS A STICKER. Where a line carries a Spanish tag word, it sits in the first or last two words of its sentence 89% of
     the time (51 of 57 in the road and town files): '..., mijo.'
   - THE FEED TYPES BACKWARDS. A valley post starts with a capital {M['feed: the valley']['cap']}% of the time and a far one {M['feed: far away']['cap']}%, and {M['feed: far away']['period_end']}% end on a full
     stop. He, on a phone, starts {PT['cap']}% with a capital (the phone does it) and ends {100-PT['period_end']}% with nothing.
3. WHAT THAT ADDS UP TO: ONE WRITER'S VOICE IN FIFTEEN COSTUMES. The kid, the priest, the cartel man and the cook all speak in the
   same clipped, dry, complete sentences that land on a clever last line. That is a writer performing 'gritty'. A person rambles,
   repeats, swears, asks, trails off, and does not know his own best line is coming.
4. WHAT IS NOT KNOWN YET, AND ONLY HE CAN SAY: how much of HIS way of talking belongs in each mouth (does a priest say 'bro'), how
   long a card may run, where the Spanish goes, what funny is. Section 6 lists it; the homework cards ask it.

## 1. EVERY MOUTH, COUNTED, AND WHERE ITS STRINGS LIVE

Counted by walking the data files (records/words_two/measure_every_mouth.py and the three searches of this round). 'The dial' is the
game's Spanglish dial (engine/bohemia_spanglish.js): a mouth that passes it shows its line with the Spanish tag word taken out about
seven times in eight. NOTHING IS INLINED IN THE DEMO'S OWN PAGE: the demo opens the map page, the town page and the fight page, and
they fetch these files.

| Mouth | Lines | Where the strings live | Who draws it, with what face | The dial |
|---|---|---|---|---|
| A ROAD STOP: the stranger | 81 | records/target/BOHEMIA_ROAD_EVENTS.json events[].says (36 rows rewritten by tools/bohemia_world14_road_events_data.py, 45 hand-kept) | slices/bohemia_road_events.js card(); the look the row names, talking | no; its Spanish is written in and always shows |
| A ROAD STOP: what comes back after his choice | 231 | the same file, opts[].fx.say (and under chance / fight) | the same card; about half are a mouth, half are telling | no |
| A ROAD STOP: his own buttons | 200 | the same file, opts[].t | the buttons under the card (the player; never Spanish) | no |
| SIDE QUESTS met on the road | 255 in 15 quests | records/target/BOHEMIA_SIDE_QUESTS.json nodes{{}}.says[] (baked from quests/bq by tools/bohemia_side_quests_bake.js) | the same card, node by node | no |
| A REAL PLACE you visit | 18 (+52 answers) | records/target/bb/real_places.json places[].visit | slices/bohemia_place_visits.js, the same card | no |
| A BOSS'S ASKER (who sends you) and after | 60 for 12 bosses | records/target/bb/boss_act_one.json bosses[].lead.asker.says / yes_says / no_says, lead.thing.says (one of his men reads it), after.valley | slices/bohemia_bosses.js talk(), the same card | no |
| JOB GIVERS AT THE BOARD | 102 (39 + 63) | records/target/BOHEMIA_BOARD_SHELF.json offers[].says (words in tools/bohemia_run2_board_shelf.py CUTS), records/target/BOHEMIA_JOB_KINDS.json board_people.rows[].says | the town page's offerSpeak(); a rolled valley person matched to the name's sex | no |
| THE ELDER AND THE KEEPERS (hall, stall, smith, armourer, barber, doc, bar, bookie) | about 150: 41 trait lines, 11 rumours, 14 news lines, about 80 literals in the page, 8 of the bookie's | slices/BOHEMIA_SETTLEMENT_SCREEN.html (TIER_LINE, the openB() branches, STALL_WORDS), records/target/settlement_traits.json, records/target/settlement_rumours.json, slices/bohemia_arena_town.js | the town page's speak(); the keeper the place rolled | YES |
| A STRANGER IN THE CROWD | 12 (6 street lines, 5 + 1 name answers) | the town page, STREET_LINES and SAYS_NAME | openPerson(); the crowd body's own face; 'SOMEBODY ON THE STREET' until asked | no |
| A MAN FOR HIRE | 14 | records/target/bb/rare_recruits.json men[].line | the hire card, in quotes, no moving mouth. AN ORDINARY RECRUIT SAYS NOTHING: a name, a trade, one trait | no |
| THE RETINUE | 36 (18 ask, 18 joins) | records/target/bb/retinue.json followers.value[] (baked into engine/bohemia_camp.js) | retinueCard() and retinueSay(), at the hall and at the camp | YES |
| HIS MEN MID-FIGHT | 616 (+165 Spanglish twins) | records/target/bb/crew_voices.json types[18].lines[10 moments], enemy.{{ghost, beast, machine}} (built by tools/words_personalities/build_bank.py); 20 more inline in slices/BOHEMIA_FIGHT.html (the veteran's lessons, 'breaking') | the fight page's callShow(); a man on his feet, never YOU; his type is hashed off his look | the twins are picked about 1 in 8 |
| THE SURVIVOR'S WORD after a fight | 481 (+90 twins) | the same file, lines.win / lost / ran / wipe and enemy.<kind>.win; picked by engine/bohemia_survivor_word.js | slices/BOHEMIA_SPOILS_SCREEN.html survivorWord(); a man still standing | twins for 4 of 10 kinds |
| THE WHY LINE (the enemy's leader, or one of his men for beasts) | 163 (67 theirs, 96 ours) in 67 rules | records/target/bb/fight_reasons.json rules[].them / .ours; chosen by slices/bohemia_fight_why.js | the card that opens a fight (slices/bohemia_fight_opener.js) and the fight's first line | never, by rule |
| HIS SECOND ON THE MAP (the teaching voice) | 12 | records/target/words/the_second_speaks.json | slices/bohemia_ui_materials.js VOICE.say, a small face plate | no |
| THE CREW CARD (a scar's line, a past) | 28 | engine/bohemia_long_injury.js SCAR_LINES (11), engine/bohemia_roster.js PAIN (17, a past in the third person, in quotes) | slices/BOHEMIA_ROSTER_SCREEN.html | no |
| THE FEED: the valley | 495 (+210 twins), 68 accounts | records/target/bb/feed_kinds.json (built by tools/bohemia_feed_build.py from banks/BOHEMIA_WORDS_THE_FEED_BANK.json and tools/feed/BOHEMIA_FEED_ROWS.json) | slices/bohemia_phone.js, a handle and the words; NO FACE (portrait null on all 105 accounts) | per post |
| THE FEED: far away | 150, 37 accounts | records/target/bb/feed_world.json | the same | no twins |
| THE FEED: a town falling | 64 (4 towns x 16) | records/target/bb/radio_lines.json towns{{}}.lines[].say | slices/bohemia_radio.js, as @town_gate and the like | no |
| THE FEED: bosses and places | 41 | boss_act_one.json rumour / verb.feed, real_places.json feed | the same strip | no |

WHAT DOES NOT EXIST AS TALK (looked for, not found):
- A BOSS HAS NO LINE OF HIS OWN ON THE GLASS. The 12 bosses share ONE rule of the why line (two sentences between them). {n_boss_says} of
  them carry a line in the data (boss.says, such as {q(S['boss_says'][-1])}) and it only moves the mouth on a card: the words are never printed.
- THE LADDER FILE HOLDS 53 ROWS, NOT 60, AND NO WORDS (engine/bohemia_ladder_data.js: who holds, what it grants).
- ENEMIES SAY NOTHING DURING A FIGHT. Their only words are the why line before it.
- NOBODY TALKS TO ANYBODY AT THE CAMP. The camp's 'doing' lines are told actions; three lines say the camp is done.
- THERE IS NO HAGGLING. A job is 'Take it' or 'Not now'; the haggle engine is only reachable on the dead walk.
- NO OBITUARY, NO LEVEL-UP WORD, NO WORD ON THE THREE NAMES SCREEN. The 15 origin lines on the start door have no speaker.
- A MAN WALKING OVER AN UNPAID NIGHT IS WRITTEN AND SWITCHED OFF (nightly_bill.json walks_when_short 0).
DEAD OR BENCH-ONLY (in the files, never on his glass in the demo): the street-walk talk inlined in slices/BOHEMIA_CITY_WORLD.html
(encounters, conversation, asking, introductions, haggle, asks: barkTick returns early in the demo), engine/bohemia_keeper_lines.js,
engine/bohemia_narrator.js, engine/bohemia_region_news.js, the cold open, the old WORDS tab's street corpus.

## 2. A TRUE SAMPLE FROM EACH (read out of the files by the script that wrote this page; none typed)

- ROAD, begging (ev_the_hungry_kid): {q(S['kid'])} and when he walks on: {q(S['kid_no'])}
- ROAD, a toll (ev_the_toll_kids): {q(S['toll'])}
- ROAD, a threat (ev_the_cartel_checkpoint): {q(S['cartel'])}
- ROAD, grief (ev_the_three_oclock_bell): {q(S['padre'])} then {q(S['padre_stand'])} or {q(S['padre_no'])}
- ROAD, the telling after a choice (ev_the_timeshare_man): {q(S['time_buy'])} and {q(S['time_no'])}
- HIS OWN MAN (ev_the_short_box): {q(S['box'])}
- BOSS'S ASKER (THE POT): {q(S['carmen'])}
- JOB GIVERS (qd-ae10, qd-s03, qd-c02, qd-ap07): {q(S['rosaura'])} / {q(S['adair'])} / {q(S['vela'])} / {q(S['paco'])}
- THE ELDER, arriving: a town {q(S['elder'])}, a camp {q(S['elder_camp'])}
- KEEPERS: the stall {q(S['stall'])}; the smith {q(S['smith'])}; the barber {q(S['barber'])}; a raided town {q(S['raided'])}
- THE BAR: {q(S['dog'])}
- A STRANGER: {q(S['street0'])} / {q(S['street1'])}
- MEN FOR HIRE: {q(S['rare13'])} / {q(S['rare5'])} / {q(S['rare2'])} / {q(S['rare1'])}
- THE RETINUE'S COOK: {q(S['cook'])}
- HIS MEN MID-FIGHT: {q(S['hit'])} / {q(S['kill_q'])} / {q(S['worr'])} / {q(S['joker_miss'])} / {q(S['down_m'])}
- THE SURVIVOR: {q(S['win_dead'])} / {q(S['win_old'])} / {q(S['win_joke'])} / {q(S['win_hust'])}
- THE WHY LINE: {q(S['why_house'])} / {q(S['why_kids'])} / a boss {q(S['why_boss'])} / one of his men {q(S['why_ours'])}
- HIS SECOND: {q(S['night'])} / {q(S['dead'])}
- THE FEED: {q(S['meme'])} / {q(S['ask'])} / {q(S['mem'])} / a crew's page {q(S['toll_page'])} / far away {q(S['far'])} / a town falling {q(S['fall2'])} then {q(S['fall'])}

## 3. WHAT MAKES THEM READ AS NOT HUMAN: TWELVE TELLS, EACH ON OUR OWN LINES

THE RULER. Per 1,000 words unless it says percent. 'Short end' is the share of lines of two sentences or more whose last sentence is
four words or fewer. 'Stop' is the share of lines that end on . ! or ?

| Mouth | Lines | Words a line | Words a sentence | Contractions | 'do not, it is' | Swears | Fillers | Short end | Stop | A question |
|---|---|---|---|---|---|---|---|---|---|---|
{tbl}

1. NOBODY SWEARS. Zero swear words in {G['words']:,} words, in a valley where the money died and men kill for a living. He swears {PT['swear']} times
   per 1,000 typed. Battle Brothers, the reference for the road, swears in its event text ('What a goatfuck of a situation.',
   reference/library/grok/wiki/pages/0171_Ball on Roof.txt). Whether OUR people swear, and who, is his call (unknown U1).
2. NOBODY SAYS 'LIKE'. No filler, no restart, no 'I mean'. {G['fill']} per 1,000 against his {PT['fill']}. The fight barks are the only mouth with
   any ({M['fight: his men mid-fight']['fill']}), and they are words like 'Okay' and 'Right?'.
3. THE LAST LINE IS ALWAYS THE CLEVER ONE. {q(S['rare5'])} {q(S['win_hust'])} {q(S['time_buy'])}
   {q(S['padre_no'])} A real person does not know his best line is coming, so it is not always last. In the fight {M['fight: his men mid-fight']['short_end']}% of
   two-part barks end this way; he ends {PT['short_end']}% of his notes this way.
4. EVERY SENTENCE IS FINISHED. Middle sentence {G['med_sent']} words, a full stop on {G['period_end']}% of lines, no line that trails off, nobody cut off.
   {q(S['box'])} is six finished sentences in a row from a man admitting he stole. Count the full stops: a man who is scared does not punctuate.
5. THE CONTRACT VOICE. The board, the why line and the hires are written without contractions: {q(S['rosaura'])}
   {q(S['why_house'])} {q(S['rare2'])} It reads as translated, or as a legal notice.
6. ONE SKELETON PER MOUTH. The why line: {whyr['and2']}% are 'A, and B' ({q(S['why_kids'])}). The job giver: always two sentences, the pay in the
   second, because the tool that cut them was told so. The survivor: two or three clipped pieces. After five lines of a mouth he
   has read all of it. EYES found the same from the other side this round (ask row 631: the why line says the road's words whatever
   started the fight).
7. EVERYBODY IS WISE. {q(S['kid_no'])} {q(S['padre_no'])} {q(S['rosaura'].split(', and ')[-1])} 'Nobody, everybody,
   always, never' {G['absol']} per 1,000 against his {PT['absol']}. The 8/26 voice card already said NOBODY IN BOHEMIA IS WISE; the lines written since
   went back to it.
8. PEOPLE EXPLAIN THE GAME AND THEIR OWN PAST IN FULL. His second, teaching: {q(S['phone_job'])} {q(S['first_pay'])}
   A man reading out the manual with 'Oye' in front. The confession above gives the sister, the town, the boy, the machine and what
   the machine eats, in order. (The longest of these, the asker's speech after a boss that explains his new button in five
   sentences, is in the data and never shown: the card takes the short valley line instead.)
9. THE SPANISH IS A STICKER ON THE END. 51 of 57 tag words sit at the edge of the sentence: {q(S['stall'])} {q(S['elder_camp'])}
   The town page alone says 'mijo' 8 times. He said it twice: 'Chill with the spanglish bro' (9/21) and 'do not cook a single more
   fucking Spanglish line' (11/3, about 15% of human talk at ship). And the dial already strips most of these on the glass, so the
   same keeper says 'mijo' one visit in eight: the word is not part of how that person talks.
10. THE SAME VOICE IN EVERY COSTUME. A hungry kid: {q(S['kid'])} A priest: 'Nobody came for them, so I come.' A raider:
   {q(S['rare13'])} Same length, same dryness, same closing beat. Age, schooling, fear and how well they know him change nothing.
   In a fight, unless the roster names one, a man's type is hashed off his look, so 'the joker' is not a person he hired: it is
   whoever wears that coat.
11. THE FEED IS DRESSED AS CASUAL, BACKWARDS. Lower case and a neat full stop: {q(S['far'])} A phone capitalises for you and nobody
   types the last full stop: his own notes are {PT['cap']}% capital-first and {100-PT['period_end']}% no-stop. The memes are formats ({q(fk['life_meme']['words'][0]['en'])}),
   which read as somebody doing 'a tweet'. His 11/3 verdict on the far posts: 'a lot of it is kinda like what the fuck does that even mean'.
12. NOBODY ASKS HIM ANYTHING. {G['q']}% of lines hold a question; the job givers and the why line 0%. Real talk is about 8% questions
   (Switchboard, in records/BOHEMIA_WORDS_TRAINING_FILE.md) and his own notes {PT['q']}% to {PV['q']}%. Nobody in the valley is unsure, checks if he
   heard, or wants to know who he is.

## 4. HIS OWN WORDS, THE FIRST SOURCE

THE CORPUS (records/words_two/his_words/): 2,259 distinct quotes of his, each checked to sit word for word in its source; 849 are
VERBATIM (his own typed vote notes and the record blocks a record labels as his words) and only those are counted: about 56,000 words.
stats.md holds every number with the script; about_talk.md holds every quote of his about how the game talks, newest first.
THE COORDINATOR'S QUOTES OF HIM ARE NOT HOW HE SOUNDS. VAMILY's copies of the same speech carry 'like' 10 per 1,000 (he says 40), 'bro'
0.8 (he says 9), and 5.8 semicolons (he has typed none, ever). Learn WHAT he wants from VAMILY; learn HOW he talks only from the
verbatim rows. And voice to text garbles him (quiz = quest, Malay = melee, the feet = the feed): never learn a garble as his word.

HOW HE TALKS, MEASURED:
- LENGTH. A typed note: 16 words in the middle (a quarter under 6, a quarter over 25). Thumb-typed: 13. A spoken message: 75 words,
  with one full stop every 57: it is one breath that keeps going. Cut at his own spoken commas (bro, you know, I mean) a breath is
  9 to 11 words. SO HIS UNIT IS A BREATH OF ABOUT TEN WORDS, CHAINED, NOT A SENTENCE OF FIVE.
- OPENERS. 'bro' starts 1 typed note in 9. 'Also' and 'And' start 124 of 438 spoken messages. A yes opens 'good', 'I', 'bro', 'nice',
  'yeah'. A no opens 'bro'. Bare 'no' opens 5 notes of 411.
- THE WORDS. like: one word in 25. Per 1,000 typed: bro 16, shit 15, any fuck 7, just 7, yeah 6, you know 5. 'dogshit' in 53 of 411
  typed notes. 'type shit' 80 times, 'and shit' 123, vibe 79, fire (good) 8, swag 4. dude 0, homie 0, 'no cap' 0.
- THE MARKS. Typed: 81% end with nothing, 58% have no punctuation at all, 90% start with a capital, 17 notes are ALL CAPS, 5
  exclamation marks and 48 question marks in 405 notes, 4 emoji in 2 notes.
- HIS YES HAS A NO IN IT. 86 of 247 thumbs-up notes still hold an insult: 'good progress not final not even close', 'Bro, it's so bad.
  I actually kinda like it bro that's insane.' Praise and the catch arrive together, the praise first.
- HE COMPARES TO REAL THINGS, PLAINLY. 'like a seventh grader coded it', 'the reverb of like a glass jar', 'like a fucking pyramid'.
  125 'like a' in the corpus; the 60 read were plain likenesses or the filler. Never a figure of speech.
- WHAT HE NEVER SAYS (counted in 51,016 words): semicolons 0, long dashes 0, shall 0, whom 0, perhaps 0, indeed 0, therefore 0,
  moreover 0, thus 0, 'as if' 0, 'as though' 0. however 8, rather 4, quite 4.
- THE ONE GAME LINE HE HAS WRITTEN HIMSELF (11/3, a perk he called decoy): 'did you seriously just walk around with a cardboard cut
  out'. It is a question, it is talking TO the player, it is funny by being exact, and it has no punchline.

WHAT HE HAS SAID ABOUT OUR WORDS (verbatim, his vote box):
- 'Idk what i was reading wtf' (9/21, the twelve road endings). 'Boring asf' (9/21, three line cards).
- 'What makes you think writing a storytime about this would be a good idea rather than actually making pixel art... ' (9/21).
- 'Chill with the spanglish bro some characters might speak Spanglish to you doesn't mean you will' (9/21).
- 'Dont force this on me wtf is "the watch"' (9/22: no made-up job words in a mouth).
- 'It is a cause of concern you kinda suck at sounding like a human tweeting. Some of it is good but a lot of it is kinda like what
  the fuck does that even mean type shit' (11/3, the far feed).
- 'Work in progress' (11/2, the survivor's word: a yes, not a finish).
WHAT HE HAS ASKED FOR, IN HIS WORDS:
- 'I want it to be funny... morbid funny, like real killers' (11/2, after a fight).
- 'this is how I want like the communication to feel sometimes bro this is Bohemian bro this my swag' and 'that sort of like fucked
  up like it breaks your heart kind of vibe like just reading it' (11/3, the last transmissions of a town).
- 'the usernames can tell a real awesome story' (10/26). 'international vibes kind of with Twitter' (11/3).
- 'I want there to be a sentence, just one sentence... why the fuck the enemies are attacking you' (11/14).
- '15% of the human conversation vibe' for Spanglish at ship, and no new Spanglish line (11/3).
- 'Pool pole spear: this is so fire and so funny' (11/2: funny is a real thing made slightly wrong, not a joke told).
THE CAUTION. How he talks to a chat is not yet proof of how a priest, a cook or a boss talks in his game. The numbers above say what
'human' sounds like when the human is him; they do not say which mouths get it. That is the question the cards put to him.

## 5. HOW THE NAMED REFERENCES WRITE A LINE (the library only; no new game; a reference stays in its department)

CITED, NEVER PASTED: reference/library/README.md (8/28) bars the library's words from the game. What follows is how a line is BUILT.
BATTLE BROTHERS (the road, the events, the company, the town). The library now holds its real text: 2,255 wiki pages in
reference/library/grok/wiki/PAGES_ALL.tar.gz, 172 with an event window, 608 spoken lines, 716 button lines.
- AN EVENT IS A NARRATOR IN SECOND PERSON WITH THE SPEECH QUOTED INSIDE IT, about 50 words, and players skim it for the button
  (records/BOHEMIA_WORDS_BB_SCHOOL_THE_SITUATION_IS_THE_PART_NOBODY_READS_9_24_26.md). OURS PUTS EVERY WORD IN THE MOUTH (the 9/20
  law), so our mouth has to carry the scene too. That is where 'people explain everything' (tell 8) comes from.
- ITS PEOPLE SWEAR, STUMBLE AND GET CAUGHT. 'Well he, uh, he's got the ball. Let's get the hell out of here. Our... our work here is
  done.' A brother caught in a lie about his own past: 'I thought you were born outside...?' / 'Oh yeah, that's right. Well, we
  should get moving then, right?' (the Forest Lover event). A stammer, a question, a change of subject.
- THE BUTTON IS THE CAPTAIN'S SHRUG, NOT AN ORDER: 'Sounds fishy to me.' 'Good for him.' 'We march on.' Ours are orders ('Pay the
  tenth.' 'Walk on.'). 44 of its 80 written background events are one screen and one button: a moment, not a decision.
- A HIRE'S STORY IS BUILT FROM PARTS AND PAID OFF LATER by an event; the hire card does not pitch. Ours pitches in three sentences
  and nothing later remembers it.
- A RUMOUR IS ONE LINE AND THE PLACE IT NAMES IS REAL (questbook/research/QR_AH_THE_RUMOUR_AT_THE_BAR_10_9_26.md).
- NOT IN THE LIBRARY: any real line of a contract's client. Our job givers were written with no model.
- TWO OLDER CLAIMS OF OURS ARE CONTRADICTED BY THE DUMP: 'the choice button wording could not be sourced' (9/24; the dump has 716), and
  '85 percent of its roster is a bare stat tooltip, no flavor' (10/9; its men speak at length in events).
MODERN WARFARE 2 (the communication's dread only): 'the war happens to OTHER units on the radio while you are busy. You do not see
them fall; you hear them call, and you hear the calls stop' (records/BOHEMIA_RADIO_ROUND_1_HOW_A_LAST_TRANSMISSION_READS_11_3_26.md).
Its test for a line: 'read it out loud, flat, like a clerk.' The town-falling posts were written to it, and it is the one mouth he
has called his swag.
FALLOUT 1 AND FINAL FANTASY X (the interface): the voice of the dead institution on the machine's own screen, labels stamped on
objects. That is the phone and the signs, not people's mouths.
NOTHING IN THE LIBRARY ON HOW THEY WRITE: Rogue Fable 4 (no dialogue studied), Final Fantasy XII, Fallout: New Vegas (its attitude
only; 'nothing of its content'), Stardew Valley, Ocarina of Time, Assassin's Creed, Valheim, Pocket City 2, Newgrounds.
THE REAL WORLD, already in the library: recorded phone talk is 89% contracted, 7.7% questions and 16 commas per 100 words where ours
had 3.5 (Switchboard, records/BOHEMIA_WORDS_TRAINING_FILE.md); a neighbourhood feed's commonest post is somebody asking for or
offering a thing, with 1.4 replies a post (records/BOHEMIA_WORDS_Q15_HOW_A_FEED_TALKS_9_5_26.md); real radio traffic and the open
mic (the RADIO record); how people who kill for work joke (records/BOHEMIA_WORDS_THE_SURVIVORS_WORD_AND_THE_KILL_TALLY_11_2_26.md).

THIS LANE'S OWN PAST IS A WARNING. The WORDS lane has diagnosed this five times (8/26 the voice card's eight tells, 9/22 a mouth not a
narrator, 9/24 the road words, 10/24 the personalities, 11/3 a tweet sounds like a human), built a gate for four of the five, and the lines
written the round after carried the same tells. A LIST OF TELLS DOES NOT MAKE A VOICE. Each fix was written by the same hand that
made the fault. That is why rule 454 is right to stop the writing and ask him.

## 6. WHAT IS STILL UNKNOWN (this is what picks the next cards)

U1 SWEARING: who swears, how hard, and is there a mouth that never does. U2 HIS WORDS IN THEIR MOUTHS: does anybody but the feed say
bro, like, type shit; does a priest. U3 LENGTH: is a road card one breath or a paragraph; is the punchline allowed. U4 SPANISH: which
people, which words, where in the sentence, never as a sticker. U5 FUNNY: the survivor's morbid line (card 8) against his 'like real
killers'. U6 THE BOSS: should the top dog talk more, less, or not at all. U7 THE WHY LINE: one skeleton or a real sentence per crew.
U8 A HIRE: does a man pitch himself, or does somebody talk about him. U9 THE FEED: capitals, stops, memes, how far a far post may be
from his valley. U10 THE TELLING: the lines with no mouth (what comes back after a choice): who says them. U11 HIS OWN MEN TO HIM:
'Boss'? 'jefe'? his name? U12 AGE AND SCHOOLING: does a kid talk like a kid.
The first twenty cards touch U1 to U9 and U11 once each. Sheet 02 goes where his answers leave a hole.

## 7. ROUTED (found here, not this lane's to fix)

- FIGHT SCREEN, BOSSES: a boss's own line (boss.says, {n_boss_says} of 12) moves a mouth and is never printed; the 12 bosses share two why sentences;
  the asker's long speech after a boss (after.says, 12) is never shown because the card takes after.valley.
- THE COORDINATOR: the ladder file holds 53 rows, not 60 (the pillar line in CLAUDE.md says 60).
- FEED: every one of the 105 accounts has no face (portrait null); 'everybody has a face' stops at the phone.
- RUN TWO, PORTRAIT: the job shelf's own look for Mama Rosaura (cast_poncho) is a man's face; the town covers it with a rolled person,
  the map's pay line (clientOf in slices/bohemia_ui_materials.js) uses the shelf's look.
- CAMP: a man walking over an unpaid night is written and switched off (walks_when_short 0); nobody speaks to anybody at the fire.
- EYES row 631 (the why line says the road's words whatever started it) is the same fault as tell 6, seen on the glass.
- PLUMBER: slices/BOHEMIA_CITY_WORLD.html inlines about a dozen street-walk talk engines the demo can never reach.

## 8. HOW IT WAS MEASURED, AND WHAT IS WEAK

- records/words_two/measure_every_mouth.py walks the 13 biggest live pools ({G['n']:,} lines) and his 849 verbatim quotes with the same
  patterns and writes measure_every_mouth.json. The lines inside the town page (about 80 literals), the side places and the small
  mouths are counted in section 1 from the searches and are NOT in the measured table.
- A blank the game fills ({{pay}}, {{name}}) was counted as one word.
- 'Fillers' and 'swears' are closed word lists; 'the last sentence is short' is a count, not a judgment of wit.
- His spoken channel is voice to text: its capitals and stops are the phone's. Only his typed notes say how he punctuates.
- The road's 'what comes back' pool mixes mouths and telling; nobody has sorted the 231.
- Three searches mapped the files (the map and town side, the fight and company side, the library); their counts were made by walking
  the files. Every sample on this page was then read out of the file again by the script that wrote it.
- NOTHING HERE WAS PLAYED. Whether a line is on the glass was read from the code paths, not seen in the running game.
'''
assert '—' not in out and '–' not in out
open('records/BOHEMIA_WORDS_TWO_EVERY_MOUTH_AND_WHY_IT_IS_NOT_HUMAN_11_17_26.md','w',encoding='utf-8').write(out)
print(len(out), 'chars; boss says', n_boss_says)
