#!/usr/bin/env python3
"""BOHEMIA PAID MEANS PAID (9/11/26, PEOPLE lane).
VAMILY [paid means paid], row THE-CARD-SAYS-PAID-AND-NOTHING-IS-PAID.

THE ROW: ECONOMY round 26 read this lane's own [make it right] work the round
after it shipped and found the hole. RIGHT_WORDS carries 'paid': 'PAID THEM
BACK', the one live caller in the game passed exactly that word, and makeRight
had no purse, no currency and no amount. THE CARD SAID PAID AND NOTHING WAS EVER
PAID.

THE COORDINATOR RULED IT 9/7 (a number is never his question): restitution is
paid in batteries from the purse to the person wronged, WEIGHT FOR WEIGHT -- a
wrong that weighs three costs three -- under EVERYTHING COSTS ONE. If the purse
cannot cover it the apology is still offered and the wronged person decides
whether words alone will do. The payment makes the apology believable; it does
not buy forgiveness.

MEASURED BEFORE BUILDING:
  BohemiaPurse.CURRENCIES   ['resources','electricity','clout'] and ELECTRICITY
                            is the battery line ("batteries are what you PAY
                            with", the purse's own header)
  purseGet()                the walked city DOES hold a live purse instance, and
                            saves it
  DEED_WEIGHT               ships EMPTY, 0 keys. So a wrong weighs nothing until
                            he turns the STANDING dial, and restitution costs
                            nothing -- which is the honest answer, not a default
  makeRight arity           3, no purse, no currency, no amount

THE PRICE IS NOT A NEW NUMBER. It is the grudge itself, which is the same sum
wouldSquare adds up and the same sum forceOf weighs, which is his dial and
nothing else.

  python3 tools/bohemia_city_paid_means_paid_patch.py

Gate: gates/paid_means_paid_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_PAID_MEANS_PAID__'

# ---------------------------------------------------------------------------
# THE CARD SAYS WHAT IT COSTS, BEFORE HE PRESSES ANYTHING.
C_OLD = """            body += ctRow('THEY HOLD SOMETHING AGAINST YOU', 'AND THEY WOULD LET IT GO');
            body += '<button id="ctright">Make it right</button>';"""

C_NEW = r"""            body += ctRow('THEY HOLD SOMETHING AGAINST YOU', 'AND THEY WOULD LET IT GO');
            /* __CITY_PAID_MEANS_PAID__ -- AND WHAT IT COSTS, BEFORE HE PRESSES.
               Weight for weight (coordinator 9/7): a wrong that weighs three
               costs three batteries. The price is the grudge itself, so it is
               his STANDING dial and not a number anybody typed here -- and while
               the deed table is empty it is ZERO, which the card says plainly
               rather than hiding. draft:true. */
            var ctPrice = 0;
            try{ ctPrice = BohemiaStanding.priceOf(ctMR, '@', ctMinuteNow()); }catch(_e){}
            var ctHave = 0;
            try{ ctHave = BohemiaPurse.balance(purseGet(), 'electricity') || 0; }catch(_e){}
            if (ctPrice > 0) {
              body += ctRow('TO PUT IT RIGHT',
                            ctPrice + (ctPrice === 1 ? ' BATTERY' : ' BATTERIES'));
              if (ctHave < ctPrice) {
                /* THE RULING'S OWN SECOND HALF: the apology is still offered and
                   THEY decide whether words alone will do. So the button stays,
                   and what it writes will say THEY LET IT GO rather than PAID
                   THEM BACK, because that is what happened. */
                body += ctNote('You do not have it. You can still say it, and it '
                             + 'is theirs to accept.');
              }
            }
            body += '<button id="ctright">Make it right</button>';"""

# ---------------------------------------------------------------------------
# AND THE BUTTON ACTUALLY PAYS.
H_OLD = """        /* WHICH WORD IT IS: they are letting it go because of what you have
           since done for them, so it is PAID rather than a free pardon.
           draft:true, and the module keeps all four so he can rule them apart. */
        BohemiaStanding.makeRight(m,'@',{how:'paid',turn:ctMinuteNow()});"""

H_NEW = r"""        /* __CITY_PAID_MEANS_PAID__ -- AND NOW SOMETHING IS ACTUALLY PAID.
           This line used to pass how:'paid' with no amount anywhere in the call,
           so the card said PAID THEM BACK and nothing ever left the purse.
           ECONOMY found it the round after it shipped.
           WEIGHT FOR WEIGHT, and the batteries really leave: transferOut, not
           debit, because restitution GOES TO the person wronged rather than
           being consumed. If the purse cannot cover it, nothing is taken and the
           apology still stands -- the module then records THEY LET IT GO, which
           is true, instead of PAID THEM BACK, which would not be. */
        var mrPrice = 0, mrPaid = 0;
        try{ mrPrice = BohemiaStanding.priceOf(m,'@',ctMinuteNow()); }catch(_e){}
        if(mrPrice > 0){
          var mrHave = 0;
          try{ mrHave = BohemiaPurse.balance(purseGet(),'electricity') || 0; }catch(_e){}
          if(mrHave >= mrPrice){
            try{
              var mrR = BohemiaPurse.transferOut(purseGet(),'electricity',mrPrice,
                          'restitution', String(CT_OPEN && CT_OPEN.id), DAY.day);
              if(mrR && mrR.applied !== false) mrPaid = mrPrice;
            }catch(_e){}
          }
        }
        BohemiaStanding.makeRight(m,'@',{how:'paid', paid:mrPaid, turn:ctMinuteNow()});"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    for name, anchor in [('the card offer', C_OLD), ('the button handler', H_OLD)]:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    html = html.replace(C_OLD, C_NEW, 1).replace(H_OLD, H_NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  [paid means paid]')


if __name__ == '__main__':
    main()
