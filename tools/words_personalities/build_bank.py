# WORDS [the personalities] (rule 143(c)): builds records/target/bb/crew_voices.json from bank_part1-3.py (the lines, as data).
# Run: python3 tools/words_personalities/build_bank.py   (refuses to write on a line that breaks the shape; --force overrides)
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
g = {}
for part in ('bank_part1.py', 'bank_part2.py', 'bank_part3.py', 'bank_part4.py'):   # part 4: THE SURVIVOR'S WORD (rule 315, the end screen)
    exec(open(os.path.join(D, part)).read(), g)
T, ENEMY, AFTER, ENEMY_WIN = g['T'], g['ENEMY'], g['AFTER'], g['ENEMY_WIN']
OUT = '/home/user/bohemia/records/target/bb/crew_voices.json'
old = json.load(open(OUT))
MOMENTS = ['hit', 'miss', 'dodged', 'kill', 'man_down', 'outnumbered', 'superior', 'their_turn', 'win', 'retreat']   # retreat: COMBAT [retreat], rule 144(c)
bank = {
 "_about": "THE CREW'S PERSONALITIES (WORDS [spanglish at ten percent, and the personalities], rule 143(a)(c)(d), Paolo 10/24), replacing COMBAT's placeholder in its own shape. " + str(len(T)) + " types; every type speaks every one of the fight's ten moments (retreat added by COMBAT [retreat], rule 144(c)) in short English lines he reads at a glance, with a Spanglish twin (sp) picked on WORDS' dial (engine/bohemia_spanglish.js regFor, about 1 line in 8, some men lean more, never the player). {name} is the man a line is about (every man_down and superior line names him), {them} and {us} the counts standing, {by} who beat you (wipe). Beyond the shape the fight reads today, each moment may carry 'near' (said by the man who stood beside him) and the bank carries 'enemy' (lines for ghosts, beasts and machines, any type) and two moments waiting for a caller: last_stand (the last of his men up, before he falls) and wipe (the first man to wake in the nearest town after the whole party went down, rule 143(e)). The down do not talk (143(d)). Never preachy: a believer prays under his breath, nobody gives a sermon. draft:true, every line (ALWAYS MAKE AN ATTEMPT, 8/11).",
 "source": "VAMILY.md rule 143(a)(c)(d)(e) (Paolo 10/24); records/BOHEMIA_PAOLO_SPANGLISH_TEN_PERCENT_THE_WIPE_THE_COMMENTARY_AND_THE_MAP_10_24_26.md; UFC's video game is his named reference for the commentary feel only (rule 139); records/BOHEMIA_WORDS_THE_PERSONALITIES_10_24_26.md",
 "draft": True,
 "spanglish": old.get('spanglish'),
 "pace": old.get('pace'),
 "moments": MOMENTS,
 "moments_waiting": {"last_stand": "the last of his men on his feet, the beat before he falls (a fight that calls it: COMBAT)",
                     "wipe": "the first of his men to wake in the nearest town after a wipe; {by} is who beat you (rule 143(e), the mini side quest: COMBAT and RUN)"},
 "types": {},
 "enemy": {"_about": "spoken by any type when the enemy is that kind; {them} the count, {name} the one who outclasses you", **ENEMY},
}
HOW = ['lost_one', 'boss', 'man_down', 'outnumbered', 'close', 'flawless']
bank['after'] = {
 "_about": "THE SURVIVOR'S WORD (WORDS, rule 315, Paolo 11/2: 'on the victory screen, one of your surviving characters provides commentary on how the battle went... to replace the you won... funny, morbid funny, like real killers'). The end screen's one line in place of YOU WON, said by one man of his still standing (else one alive on the ground; never YOU), with his face and his name: engine/bohemia_survivor_word.js picks it. His type (off his look, the fight's own pick), how it went, the kind they beat. how, first that holds: lost_one (one of his fell for good; {name} names him), boss (a boss fell; {boss}), man_down (one struck down and lived; {name}), outnumbered ({them} on {us}, theirs outnumbered his by pace.outnumbered_ratio), close (his men standing end under close_hp of their blood), flawless (nobody down and every man over flawless_hp), else the plain win: lines.win[how], else lines.win. A kind's own lines (enemy.<kind>.win: raiders, machine, kids, heavies, beast, wolves, ghost, boss, camp) speak enemy_share of the plain, flawless, close and outnumbered wins. A loss: lines.lost; pulled out: lines.ran; a wipe: lines.wipe ({by}). Spanglish on WORDS' one dial ('after:' + how), never the player. draft:true.",
 "how": HOW,
 "kinds": {"brigands": "raiders", "machines": "machine", "kids": "kids", "heavies": "heavies", "beasts": "beast", "ghosts": "ghost"},
 "value": {"flawless_hp": 0.9, "close_hp": 0.35, "enemy_share": 0.35, "enemy_share_not_people": 0.6},
 "people_only": "\\b(boots?|pockets?|jacket|pants|tailoring|shirt|hats?|faces|ear|radios|mothers|haggle|dressed|shoes|rifle|slings?|teeth)\\b",
 "people_only_why": "a line about what a man wears or carries is never said over wolves, robots or the dead (the plain and how lines are filtered by it when every one of theirs is a beast, a machine or a ghost; their own kind's lines speak enemy_share_not_people of the time instead)",
 "source": "VAMILY.md rule 315 (Paolo 11/2); records/BOHEMIA_WORDS_THE_SURVIVORS_WORD_AND_THE_KILL_TALLY_11_2_26.md (the research: gallows humour in emergency work, Grossman's On Killing, how real crews talk after a job)",
 "tuned": False,
}
for kind, xs in ENEMY_WIN.items():
    bank['enemy'].setdefault(kind, {})['win'] = list(xs)
for k, v in T.items():
    lines = json.loads(json.dumps(v['lines']))
    A = AFTER.get(k)
    if A:
        lines['win']['en'] = lines['win']['en'] + A['win']
        lines['win']['sp'] = lines['win'].get('sp', []) + A['win_sp']
        for h in HOW: lines['win'][h] = A[h]
        lines['lost'] = A['lost']; lines['ran'] = A['ran']
    bank['types'][k] = {'name': v['name'], 'lean': v['lean'], 'about': v['about'], 'lines': lines}
# checks
errs = []
sp_all = []
for k, v in bank['types'].items():
    for m in MOMENTS + ['last_stand', 'wipe']:
        Lm = v['lines'].get(m)
        if not Lm or not Lm['en']: errs.append(k + '.' + m + ' empty'); continue
        allx = Lm['en'] + Lm.get('sp', []) + Lm.get('near', [])
        if m in ('man_down', 'superior') and any('{name}' not in x for x in allx): errs.append(k + '.' + m + ' names nobody: ' + str([x for x in allx if '{name}' not in x]))
        for x in allx:
            if '—' in x or '–' in x: errs.append('dash: ' + x)
            if len(x) > 64: errs.append('long (%d): %s' % (len(x), x))
        if m in MOMENTS and not Lm.get('sp'): errs.append(k + '.' + m + ' no sp')
        sp_all += Lm.get('sp', [])
# the end screen's lines (rule 315): every type has six plain wins or more, two for every how, a loss and a pulling out; under 12
# words a line; the how lines name who they are about
for k, v in bank['types'].items():
    Lw = v['lines']['win']
    if len(Lw['en']) < 6: errs.append(k + '.win under six lines')
    for h in HOW:
        if len((Lw.get(h) or {}).get('en', [])) < 2: errs.append(k + '.win.' + h + ' under two')
    for m in ('lost', 'ran'):
        if len((v['lines'].get(m) or {}).get('en', [])) < 2: errs.append(k + '.' + m + ' under two')
    after = [x for h in HOW for x in Lw[h]['en'] + Lw[h].get('sp', [])] + Lw['en'] + Lw['sp'] + [x for m in ('lost', 'ran') for x in v['lines'][m]['en'] + v['lines'][m].get('sp', [])]
    for x in after:
        if len(x.split()) >= 12: errs.append('12 words or more: ' + x)
        if '\u2014' in x or '\u2013' in x: errs.append('dash: ' + x)
    for h, ph in (('man_down', '{name}'), ('lost_one', '{name}'), ('boss', '{boss}')):
        for x in Lw[h]['en'] + Lw[h].get('sp', []):
            if ph not in x: errs.append(k + '.win.' + h + ' names nobody: ' + x)
    sp_all += [x for h in HOW for x in Lw[h].get('sp', [])] + [x for m in ('lost', 'ran') for x in v['lines'][m].get('sp', [])]
for kind, xs in ENEMY_WIN.items():
    for x in xs:
        if len(x.split()) >= 12: errs.append('12 words or more: ' + x)
for kind, ms in ENEMY.items():
    for x in ms.get('superior', []):
        if '{name}' not in x: errs.append('enemy ' + kind + ' superior names nobody: ' + x)
r = subprocess.run(['node', '-e', "const P=require('/home/user/bohemia/engine/bohemia_people.js');const L=JSON.parse(process.argv[1]);console.log(JSON.stringify(L.filter(x=>!P.esWordsIn(x).length)))", json.dumps(sp_all)], capture_output=True, text=True)
dry = json.loads(r.stdout or '[]')
for x in dry: errs.append('sp with no lexicon word: ' + x)
n_en = sum(len(L_['en']) + len(L_.get('near', [])) for v in bank['types'].values() for L_ in v['lines'].values())
print('types', len(T), 'en lines', n_en, 'sp lines', len(sp_all), 'errors', len(errs))
for e in errs: print('  ', e)
if errs and '--force' not in sys.argv: sys.exit(1)
json.dump(bank, open(OUT, 'w'), ensure_ascii=False, indent=1)
open(OUT, 'a').write('\n')
print('wrote', OUT)
