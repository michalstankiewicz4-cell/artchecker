"use strict";
/* Podobrazia (z laboratorium sztuki: płótno, deska, blacha). Fikcyjnych artystów (dawne js/data/artists.js) usunięto w 1.35. */
const SUP={canvas:{tech:'olej na płótnie',abbr:'ol./pł.',name:'płótno'},wood:{tech:'olej na desce dębowej',abbr:'ol./desce',name:'deska'},copper:{tech:'olej na blasze miedzianej',abbr:'ol./miedzi',name:'blacha miedziana'}};
const supOf=()=>(ART&&ART.sup)||'canvas';
