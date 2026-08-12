#!/usr/bin/env python3
"""
THE JOB ARRIVES ON THE PHONE, AND YOU TAKE IT THERE (8/12/26).

The city half (tools/bohemia_city_phonerings_patch.py) stopped handing him the
day's job on the wake card and turned it into an OFFER. This is where the offer
lands and where he says yes.

WHY IT GOES HERE AND NOT IN A CARD IN THE RUN. If accepting happened in the world,
the phone would still be a viewer -- it would show you a job you took somewhere
else. The loop engine has always modelled this as a CHANNEL ("the quests you can
pick up OVER THE PHONE right now"), and a channel you cannot answer on is not a
channel. The phone has to be the place the yes happens, or nothing about it is
load-bearing.

WHAT IT LOOKS LIKE: the offer sits at the top of the phone, above the app tiles,
in the quest's OWN words -- the same law the resolution buttons in the run live
under, and the same reason: I do not write prose about his quests, I show his. One
button, TAKE IT. Once taken the strip goes back to reporting the live objective,
which is what the live strip already did.

THE STRIP IS ONE COMPONENT, TWO STATES. It was already there showing where he is
and what today's job is; an offer is just the state before the job is his. Adding
a second component would have meant two things drifting apart.

REUSE CHECK: cooks no graphic pixels of any kind. The offer reuses the live
strip's own container and type (.live-strip/.lv-top/.lv-obj, added 8/11) plus one
button in the map app's existing GO treatment (.mapgo). No bank is opened because
nothing is drawn.

Edits the SOURCE; the built slice is regenerated with
`node tools/build_current_slice.js`.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

SRC = 'slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html'
MARK = '__PHONE_OFFER__'

OLD = """function liveStrip(){
  if(!LIVE) return '';
  var where = LIVE.district ? String(LIVE.district).toUpperCase() : 'THE VALLEY';
  var h = '<div class="live-strip"><div class="lv-top">'+esc(where)+
          ' \\u00b7 DAY '+LIVE.day+' \\u00b7 '+esc(LIVE.clock)+(LIVE.night?' \\u00b7 dark':'')+'</div>';
  if(LIVE.objective) h += '<div class="lv-obj">'+esc(LIVE.objective)+'</div>';
  return h+'</div>';
}"""

NEW = """function liveStrip(){
  if(!LIVE) return '';
  var where = LIVE.district ? String(LIVE.district).toUpperCase() : 'THE VALLEY';
  var h = '<div class="live-strip"><div class="lv-top">'+esc(where)+
          ' \\u00b7 DAY '+LIVE.day+' \\u00b7 '+esc(LIVE.clock)+(LIVE.night?' \\u00b7 dark':'')+'</div>';
  /* """ + MARK + """ -- THE JOB ARRIVES HERE AND IS TAKEN HERE. The loop engine has
     always modelled this as a channel ("the quests you can pick up OVER THE PHONE
     right now"), and a channel you cannot answer on is not a channel. Its words are
     the quest's own -- the same law the resolution buttons in the run live under.
     ONE component, two states: an offer is simply the state before the job is his,
     so this is the live strip rather than a second thing beside it. */
  if(LIVE.offer){
    h += '<div class="lv-offer">A JOB CAME IN</div>'
      +  '<div class="lv-obj"><b>'+esc(LIVE.offer.title)+'</b></div>'
      +  '<div class="lv-obj">'+esc(LIVE.offer.text)+'</div>'
      +  '<div class="mapgo lv-take" onclick="phoneTake()">TAKE IT</div>';
  } else if(LIVE.objective){
    h += '<div class="lv-obj">'+esc(LIVE.objective)+'</div>';
  }
  return h+'</div>';
}

/* """ + MARK + """ -- the yes. The phone only ASKS; the run decides what a yes
   means, which is why this posts a message rather than reaching into the world. */
function phoneTake(){
  try{ if(window.parent&&window.parent!==window)
    window.parent.postMessage({bohemiaPhoneAccept:true},'*'); }catch(e){}
  if(LIVE){ LIVE.offer=null; LIVE.taken=true; }
  try{ rerender(); }catch(e){}
}"""

CSS_ADD = """/* """ + MARK + """ -- the offer state of the live strip. */
.lv-offer{margin-top:6px;font-size:9px;font-weight:700;letter-spacing:2px;color:#e8b84a}
.lv-take{margin-top:8px;margin-left:0;display:inline-block}
</style>"""


def main():
    if not os.path.exists(SRC):
        sys.exit('FAIL: ' + SRC + ' not found')
    s = open(SRC, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: the live strip was not found -- run bohemia_phone_live_patch.py first')
    s = s.replace(OLD, NEW, 1)

    i = s.find('</style>')
    if i < 0:
        sys.exit('FAIL: no </style> to extend')
    s = s[:i] + CSS_ADD + s[i + len('</style>'):]

    open(SRC, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + SRC + ' (' + str(len(s)) + ' bytes)')
    print('NEXT: node tools/build_current_slice.js')


if __name__ == '__main__':
    main()
