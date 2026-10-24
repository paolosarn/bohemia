# WORDS [the personalities] (rule 143(c)): builds records/target/bb/crew_voices.json from bank_part1-3.py (the lines, as data).
# Run: python3 tools/words_personalities/build_bank.py   (refuses to write on a line that breaks the shape; --force overrides)
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
g = {}
for part in ('bank_part1.py', 'bank_part2.py', 'bank_part3.py'):
    exec(open(os.path.join(D, part)).read(), g)
T, ENEMY = g['T'], g['ENEMY']
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
for k, v in T.items():
    bank['types'][k] = {'name': v['name'], 'lean': v['lean'], 'about': v['about'], 'lines': v['lines']}
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
