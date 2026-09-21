/* ============================================================================
   THE SIGN KIT  (FACTIONS lane, [horror signs], 9/21/26)

   REUSE-FIRST, made real. Round one of this row drew a roadside pole sign and
   the drawing code lived inside that one page. Round two needs a second KIND of
   sign, so the parts that are not about pole signs move here and both pages read
   them: the two type faces, the colour mixer, and the two solids every sign in
   this world is made of.

   WHY IT IS A SEPARATE FILE AND NOT A COPY: the first page is already registered
   in the vote tab and he may be looking at it. Editing a registered item to pull
   in a new dependency risks breaking the thing he is judging, so round one is
   left exactly as it landed and everything from here reads this file.

   THE LAWS THESE PARTS CARRY, so a later sign cannot lose them by accident:

   45 DEGREE ART LAW (7/17) -- every solid is a box with THREE faces: the front
     you read, the TOP which is sky-lit and lighter, the SIDE turned away and
     darker. The ground under a thing is a diamond, the same shape as a tile.
     Round one was flat for three cuts before this was caught.
   THE TYPE HAS TO BE READABLE. Round one shipped SUNRAY HOTEL when it meant
     MOTEL, then VACAHCY when it meant VACANCY. At three pixels across, M, N and
     H are the same drawing with the crossbar on a different row. The name face
     is 5x7 and the small face gives M, N and W a fourth column.
     (UI measured the same defect in the game's own button face the same round,
     independently: H/N is the CLOSEST PAIR IN THE ALPHABET there, 10.6% of the
     ink. Their fix is a softer casing cut on the shipped face and it is theirs;
     this file does not touch it.)
   NEVER TRUE BLACK, FEW INKS -- the floor is #17130d.
   ========================================================================== */
(function (root) {
  'use strict';

  /* the small print. 3 wide, EXCEPT M, N and W, which are 4. */
  var F3 = {' ':[0,0,0,0,0],'A':[2,5,7,5,5],'B':[6,5,6,5,6],'C':[3,4,4,4,3],
  'D':[6,5,5,5,6],'E':[7,4,6,4,7],'F':[7,4,6,4,4],'G':[3,4,5,5,3],'H':[5,5,7,5,5],
  'I':[7,2,2,2,7],'J':[1,1,1,5,2],'K':[5,5,6,5,5],'L':[4,4,4,4,7],'O':[2,5,5,5,2],
  'P':[6,5,6,4,4],'Q':[2,5,5,6,3],'R':[6,5,6,5,5],'S':[3,4,2,1,6],'T':[7,2,2,2,2],
  'U':[5,5,5,5,2],'V':[5,5,5,2,2],'X':[5,5,2,5,5],'Y':[5,5,2,2,2],'Z':[7,1,2,4,7],
  '0':[7,5,5,5,7],'1':[2,6,2,2,7],'2':[6,1,2,4,7],'3':[6,1,2,1,6],'4':[5,5,7,1,1],
  '5':[7,4,6,1,6],'6':[3,4,6,5,2],'7':[7,1,2,2,2],'8':[2,5,2,5,2],'9':[2,5,3,1,6],
  '&':[2,5,2,5,3],'-':[0,0,7,0,0],'.':[0,0,0,0,2],"'":[2,2,0,0,0],'/':[1,1,2,4,4],
  ':':[0,2,0,2,0],'!':[2,2,2,0,2],'+':[0,2,7,2,0]};
  var F4 = {'M':[9,15,15,9,9],'N':[9,13,11,9,9],'W':[9,9,15,15,9]};

  /* THE NAME. 5 wide, 7 tall: an M has a middle and an N has a diagonal. */
  var F5 = {' ':[0,0,0,0,0,0,0],
  'A':[14,17,17,31,17,17,17],'B':[30,17,17,30,17,17,30],'C':[14,17,16,16,16,17,14],
  'D':[30,17,17,17,17,17,30],'E':[31,16,16,30,16,16,31],'F':[31,16,16,30,16,16,16],
  'G':[14,17,16,23,17,17,15],'H':[17,17,17,31,17,17,17],'I':[31,4,4,4,4,4,31],
  'J':[7,2,2,2,2,18,12],'K':[17,18,20,24,20,18,17],'L':[16,16,16,16,16,16,31],
  'M':[17,27,21,21,17,17,17],'N':[17,25,21,19,17,17,17],'O':[14,17,17,17,17,17,14],
  'P':[30,17,17,30,16,16,16],'Q':[14,17,17,17,21,18,13],'R':[30,17,17,30,20,18,17],
  'S':[15,16,16,14,1,1,30],'T':[31,4,4,4,4,4,4],'U':[17,17,17,17,17,17,14],
  'V':[17,17,17,17,17,10,4],'W':[17,17,17,21,21,27,17],'X':[17,17,10,4,10,17,17],
  'Y':[17,17,10,4,4,4,4],'Z':[31,1,2,4,8,16,31],
  '0':[14,17,19,21,25,17,14],'1':[4,12,4,4,4,4,14],'2':[14,17,1,6,8,16,31],
  '3':[31,2,4,2,1,17,14],'4':[2,6,10,18,31,2,2],'5':[31,16,30,1,1,17,14],
  '6':[6,8,16,30,17,17,14],'7':[31,1,2,4,8,8,8],'8':[14,17,17,14,17,17,14],
  '9':[14,17,17,15,1,2,12],'-':[0,0,0,31,0,0,0],'&':[12,18,18,12,21,18,13],
  '.':[0,0,0,0,0,12,12],"'":[4,4,0,0,0,0,0],'/':[1,2,2,4,8,8,16]};

  function w3(s){ var n=0,i; for(i=0;i<s.length;i++) n+=(F4[s.charAt(i)]?5:4); return n-1; }
  function w5(s){ return s.length*6-1; }
  function put3(g,s,x,y,col){
    g.fillStyle=col; var ox=x,i,ry,rx;
    for(i=0;i<s.length;i++){
      var ch=s.charAt(i), wide=F4[ch], r=wide||F3[ch]||F3[' '],
          cw=wide?4:3, top=wide?8:4;          /* the leftmost bit, and it is not 2 */
      for(ry=0;ry<5;ry++){ var b=r[ry];
        for(rx=0;rx<cw;rx++) if(b&(top>>rx)) g.fillRect(ox+rx,y+ry,1,1); }
      ox+=cw+1; } }
  function put5(g,s,x,y,col){
    g.fillStyle=col; var i,ry,rx;
    for(i=0;i<s.length;i++){ var r=F5[s.charAt(i)]||F5[' '];
      for(ry=0;ry<7;ry++){ var b=r[ry];
        for(rx=0;rx<5;rx++) if(b&(16>>rx)) g.fillRect(x+i*6+rx,y+ry,1,1); } } }
  function c3(g,s,cx,y,col){ put3(g,s,Math.round(cx-w3(s)/2),y,col); }
  /* A NAME TOO LONG FOR ITS PLATE DROPS TO THE SMALL FACE, which is what a real
     sign does with its second line: the name is big and the qualifier under it is
     whatever fits. Round one ran OF THE SANDS off both edges of a chapel. */
  function c5(g,s,cx,y,col,maxW){
    if(w5(s) > (maxW||62)){ put3(g,s,Math.round(cx-w3(s)/2),y+1,col); return 5; }
    put5(g,s,Math.round(cx-w5(s)/2),y,col); return 7; }

  var DARKEST = '#17130d';
  function hex2(h){ return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),
                            parseInt(h.substr(5,2),16)]; }
  function mix(a,b,t){ var A=hex2(a),B=hex2(b),o='#',i;
    for(i=0;i<3;i++){ var v=Math.round(A[i]+(B[i]-A[i])*t); o+=('0'+v.toString(16)).slice(-2); }
    return o; }

  /* a solid, seen from the world's three-quarter view */
  function box3d(g,x,y,w,h,d,face,top,side){
    g.fillStyle=side;
    g.beginPath(); g.moveTo(x+w,y); g.lineTo(x+w+d,y-d/2);
    g.lineTo(x+w+d,y+h-d/2); g.lineTo(x+w,y+h); g.closePath(); g.fill();
    g.fillStyle=top;
    g.beginPath(); g.moveTo(x,y); g.lineTo(x+d,y-d/2);
    g.lineTo(x+w+d,y-d/2); g.lineTo(x+w,y); g.closePath(); g.fill();
    g.fillStyle=face; g.fillRect(x,y,w,h);
  }
  /* the ground a thing stands on is a tile, and a tile here is a diamond */
  function diamond(g,cx,cy,rw,rh,col){
    g.fillStyle=col; g.beginPath(); g.moveTo(cx-rw,cy); g.lineTo(cx,cy-rh);
    g.lineTo(cx+rw,cy); g.lineTo(cx,cy+rh); g.closePath(); g.fill();
  }
  /* hardpan with rock lag in ONE CLUSTER, never scattered rectangles */
  function hardpan(g,w,h,cx){
    g.fillStyle='#9a8f7c'; g.fillRect(0,0,w,h);
    diamond(g,cx-22,h-8,15,5,'#948976');
    diamond(g,cx-29,h-3,10,3,'#948976');
    diamond(g,cx+26,h-5,12,4,'#a09580');
  }

  root.BohemiaSignKit = {
    F3:F3, F4:F4, F5:F5, w3:w3, w5:w5, put3:put3, put5:put5, c3:c3, c5:c5,
    DARKEST:DARKEST, mix:mix, box3d:box3d, diamond:diamond, hardpan:hardpan
  };
})(typeof window !== 'undefined' ? window : this);
