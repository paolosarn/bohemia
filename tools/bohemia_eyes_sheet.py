#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS: THE CONTACT SHEET (lane 17, 9/5/26)

Turns the screenshot pass into ONE PAGE HE CAN OPEN ON HIS PHONE. He never digs
in files, so a folder of PNGs in the repo is not a deliverable -- a published
page with the picture and the one line under it is.

The look is the game's own (warm near-black ground, gold, cut corners, the
typewriter) because a page that complains about off-style surfaces cannot be one.

NOTES live in this file, one per shot, in the order the pass took them. Round two
edits the notes and re-runs; the pass itself never has to change.

USAGE:  python3 tools/bohemia_eyes_sheet.py
"""
import json, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, 'slices', 'eyes', 'shots.json')
OUT   = os.path.join(ROOT, 'slices', 'BOHEMIA_EYES_ROUND_1_9_5_26.html')

# WHAT LOOKS WRONG TO ME. One line each, plain words, no file names.
NOTES = {
 'alpha-00-splash.png': "This one got fixed while I was looking at it: at six in the morning the build line said 8/31, five days old, running edge to edge. The sound lane shipped and now it says 9/5k and it fits. The line still has no side margin, so a longer headline will run off a smaller phone.",
 'alpha-01-after-the-tap.png': "One tap in and there are TWO things asking you for something at once: WATCH at the top, GET UP in the middle, and somebody talking underneath both.",
 'alpha-02-vote.png': "The button at the top loses its own last word, and the name of each haircut is printed on top of the picture it belongs to.",
 'alpha-03-ui.png': "A button here says FF10 and the law file says the game we compare to is Final Fantasy TWELVE. Two files, two different games. Somebody has to say which.",
 'alpha-04-looks.png': "The tab says 3D and the page says THE THIRD ONE. The name on the door does not match the room.",
 'alpha-05-look.png': "It is called WHAT IS NEW and it is dated 8/8, four weeks ago, and the little labels under the tiles are too small to read on a phone.",
 'alpha-06-words.png': "Cleanest page in the build. The only wrong thing is a file path printed next to the quest name, which you should never have to see.",
 'alpha-07-cutscene.png': "The opening scene of the game is built out of art from a different kind of game: shiny floor, fancy chairs, a bright green cake, and a seam straight down the middle of the table.",
 'alpha-08-direct.png': "Two buttons both say HOUSE with arrows pointing opposite ways and the seed number wedged between them.",
 'alpha-09-run.png': "Somebody is talking to you from behind the card -- the speech bubble is on screen and the person it comes from is covered up.",
 'alpha-10-char.png': "The bench opens on a different direction every time -- this run the side, the run before the BACK of your head -- and from the side the face is a flat wall with no nose, under a portrait with a full head of hair. The body sliders are stock browser blue (0,117,255) on a game with no blue in it.",
 'alpha-11-clothes.png': "The row of small pictures runs off the right edge with nothing to show it scrolls, and you are judging clothes on a cool blue-grey stage while the game itself is warm black.",
 'alpha-12-anim.png': "All eight directions in one frame, which is the right way to show it. The three back views are a flat cream block with ONE straight black bar on it.",
 'alpha-13-rig.png': "The status line prints straight through the GHOST OTHERS button, and this tab looks like a different app: grey pills, blue-grey ground, no cut corners.",
 'alpha-14-combat.png': "A second title screen, with a second BOHEMIA logo -- white, broken up, and struck through in hot pink. Nothing like the gold one two taps earlier.",
 'alpha-15-music.png': "The note under each sound wraps into a five-line column and NEEDS YOU lands in the middle of it. The PLAY buttons are purple, and purple belongs to the Amalgamation.",
 'alpha-16-map.png': "The same apartment block is pasted eight times straight down one column, and the caption at the bottom is cut off at the right edge.",
 'alpha-17-slice.png': "The neighbour's avatar is lilac -- 4,897 pixels of purple on a screen where purple is reserved.",
 'alpha-18-life.png': "Four paragraphs before you get to anything you can look at. It reads like a memo, not a screen.",
 'alpha-19-art.png': "Dated 8/5. The right-hand picture sits in its frame with a black band under it, and there is no label saying which one is before and which is after.",
 'alpha-99-back-on-the-game.png': "After opening all eighteen tabs and coming back, the same two cards are still up. 1.66% of the picture changed in four minutes, and the change was somebody talking.",
 'demo-00-splash.png': "Also fixed while I was looking: the demo saved in the repo used to be a build behind the workshop, and a re-cut caught it up. Both say 9/5k now.",
 'demo-01-after-the-tap.png': "THE WORST ONE. On an iPhone, SLEEP and the bottom arrow of the ring are cut off by the bottom of the glass. The demo's own controls run off the screen.",
 'demo-02-t15s.png': "Fifteen seconds in, the only thing that has moved on the whole screen is the music button: it grew to fit the song title and shoved OUTFIT off the right edge.",
 'demo-03-t21s.png': "Six seconds later the toolbar gives up and breaks onto two rows, and everything under it jumps down about a centimetre on its own, with nobody touching anything.",
 'demo-04-t29s.png': "Nothing. The same picture as eight seconds ago.",
 'demo-05-t39s.png': "This picture and the one eighteen seconds before it are the same file, pixel for pixel. Nothing in the valley moved.",
}

HEAD = """<title>EYES ROUND 1</title>
<style>
:root{ --ink:#e8dfc8; --dim:#9a917f; --gold:#d8b25e; --line:#766f63; --bg:#0a0908; --card:#141110; }
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
  font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:15px;line-height:1.55;
  -webkit-text-size-adjust:100%}
.wrap{max-width:560px;margin:0 auto;padding:18px 14px 60px}
h1{font-size:19px;letter-spacing:2px;color:var(--gold);margin:0 0 2px}
.sub{color:var(--dim);font-size:13px;margin:0 0 18px}
.box{border:2px solid var(--line);background:var(--card);padding:12px 13px;margin:0 0 16px;
  clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
.box h2{font-size:14px;letter-spacing:1.6px;color:var(--gold);margin:0 0 8px}
.box p{margin:0 0 8px}
.box p:last-child{margin:0}
ol{margin:0;padding-left:20px} li{margin:0 0 8px}
.shot{margin:0 0 26px}
.cap{display:flex;gap:8px;align-items:baseline;margin:0 0 6px}
.n{color:var(--gold);font-size:12px;letter-spacing:1.4px;white-space:nowrap}
.tab{color:var(--dim);font-size:12px;letter-spacing:1.4px}
img{width:100%;display:block;border:2px solid var(--line);background:#000}
.note{margin:8px 0 0;font-size:14px}
.hr{height:2px;background:var(--line);margin:26px 0;opacity:.5}
a{color:var(--gold)}
</style>"""

def build():
    data = json.load(open(SHOTS))
    parts = [HEAD, '<div class="wrap">']
    parts.append('<h1>EYES AND EARS &middot; ROUND 1</h1>')
    parts.append('<p class="sub">9/5/26 &middot; every tab of the workshop and the demo, '
                 'photographed on a real phone screen (iPhone portrait), with one line under each '
                 'saying what looks wrong to me.</p>')
    parts.append('<div class="box"><h2>WHAT THIS IS</h2>'
      '<p>A machine opened the game the way your phone opens it, tapped through all eighteen tabs '
      'and the demo, and took a picture of every one. Nobody had ever done that before today.</p>'
      '<p>Every note under a picture is something I think is wrong or weak. None of it is taste. '
      'What the game should LOOK like is not my call, and I have not touched a pixel.</p>'
      '<p><b>This round is EYES ONLY.</b> I have no way to hear the game yet. That instrument '
      'is the next job in my queue.</p></div>')
    parts.append('<div class="box"><h2>THE SIX THAT MATTER</h2><ol>'
      '<li><b>The demo runs off the bottom of an iPhone.</b> SLEEP and the bottom arrow are cut '
      'by the edge of the glass. That is the build you hand a friend.</li>'
      '<li><b>The opening scene is art from another game.</b> Shiny floor, fancy chairs, a bright '
      'green cake. It is the first thing anybody sees.</li>'
      '<li><b>There are two BOHEMIA logos.</b> The gold one on the front door and a white one '
      'struck through in hot pink on the fight screen.</li>'
      '<li><b>Standing still, the game is a photograph.</b> Two frames eighteen seconds apart are '
      'the same file, pixel for pixel. Nothing moves.</li>'
      '<li><b>The first screen asks you for two things at once</b> and a third person talks '
      'underneath them.</li>'
      '<li><b>Every bench judges your art on the wrong colour.</b> The character and clothes stages are '
      'a cool blue-grey; the game itself is warm black. You cannot judge a colour on the wrong ground.</li>'
      '</ol></div>')
    for run in data:
        parts.append('<div class="hr"></div>')
        parts.append(f'<h1>{"THE WORKSHOP" if run["name"]=="alpha" else "THE DEMO"}</h1>')
        parts.append(f'<p class="sub">{html.escape(run.get("stamp") or "no build stamp")}</p>')
        for s in run['shots']:
            f = s['file']
            if not os.path.exists(os.path.join(ROOT, 'slices', 'eyes', f)): continue
            note = NOTES.get(f, '')
            tab = html.escape(s.get('tab') or '')
            parts.append('<div class="shot">')
            parts.append(f'<div class="cap"><span class="n">{html.escape(f.split("-")[1])}</span>'
                         f'<span class="tab">{tab}</span></div>')
            parts.append(f'<a href="eyes/{f}"><img loading="lazy" src="eyes/{f}" alt="{tab}"></a>')
            parts.append(f'<p class="note">{html.escape(note)}</p>')
            parts.append('</div>')
    parts.append('</div>')
    open(OUT, 'w').write('\n'.join(parts))
    print('wrote', OUT, os.path.getsize(OUT), 'bytes')

if __name__ == '__main__':
    build()
