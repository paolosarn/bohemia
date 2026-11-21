/* THE CORK BOARD (rule 453(3), his impact seen at his place): the day a job he took is done it goes up by itself, free, on his place's
   first free open lot, standing at once; every deed after pins a paper on it */
function homeEnsureBoard(){ var r = homeRec(), D = HOME.data; if (!r || !r.planted || !D || !D.places || !D.places.board) return null;
  if (!(r.deeds || []).length || (r.places || []).some(function(p){ return p.id === 'board'; })) return null;
  var lot = homePlaceLot(); if (lot == null) return null;
  var res = BohemiaHome.buildPlace(r, 'board', lot, homeDay() - 1, homeTakenLots()); if (res.ok){ homeSave(); window.__HOME_BOARD = { lot: lot, day: homeDay() }; } return res; }
