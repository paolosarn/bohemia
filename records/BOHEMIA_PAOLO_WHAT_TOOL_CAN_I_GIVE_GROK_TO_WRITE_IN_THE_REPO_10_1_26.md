# PAOLO 10/1/26: WHAT TOOL CAN I GIVE GROK TO WRITE IN THE REPO? I'LL CONNECT A TOOL WITH IT
His words: "What tool can I give Grok then to write in the repo? I'll connect a tool with it. You know it has connecting
tools too. OK so don't be an asshole."

He was right and the coordinator was wrong one message earlier ('nobody can make Grok push to GitHub'). Grok has
CONNECTORS (launched 5/6/26; 31 of them by 8/12/26, GitHub among the featured, plus bring-your-own MCP). Its GitHub
connector is read/write: a public test on 9/17/26 showed it creating a branch, pushing a file and opening a pull request
(github.com/ageoffron/projectX/pull/19). Sources in the reply of 10/1.

## MY READING (rule 49d, LOCKED)
1. THE WAY OUT IS GROK'S GITHUB CONNECTOR. He connects GitHub inside Grok (grok.com, the + button, Connectors, GitHub,
   authorize; expose only paolosarn/bohemia). From then on Grok writes its pages into the repo itself.
2. WHERE GROK MAY WRITE: reference/library/grok/ only, on the branch named grok, never main, never a pull request (the
   NO PULL REQUESTS law of 7/25 binds Grok too). One file per page, first line 'source: Grok, unverified, written <date>',
   plus GROK_INDEX.md. The paste page (STEP 4) tells Grok all of this.
3. THE COORDINATOR PULLS THE BRANCH EVERY VAMILY: fetches origin/grok, copies reference/library/grok/ onto main in its
   own commit (nothing else from that branch ever crosses), EYES [grok filter] stamps each page the same round, the
   lanes cite only stamped pages. The branch is the fence: Grok's hands never touch main, the gates, the engine or the
   laws, so no gate needs to know Grok exists.
4. NO SHARE LINKS AND NO PASTES ARE NEEDED ANY MORE. The grok.com network ask (49c) is dropped; the connector makes it
   moot. If Grok writes outside its folder or to main, the coordinator reverts it the same round and tightens the paste.
5. GATE OWED: PLUMBER [grok fence]: a gate on main that refuses any commit whose author or message is Grok's touching a
   path outside reference/library/grok/; and the existing [grok filter gate] for citations.
