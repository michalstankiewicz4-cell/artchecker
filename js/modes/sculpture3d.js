"use strict";
/* =====================================================================
   RZEŹBY 3D
   ===================================================================== */
const SCU={name:'Stanisław Rudnicki',life:'1840–1905',title:'Popiersie Heleny',year:1888,hcm:52.0,kg:8.4};
const SPROF={
 surm:{name:'Surmoulage – odlew z formy zdjętej z oryginału',core:['dims','tool','mark'],opt:['prov','cert','seam'],mark:'blur',tool:'soft',hcm:51.2},
 cold:{name:'Odlew z żywicy z pyłem brązu (cold cast)',core:['weight','xray','xrf','uv'],opt:['tool','patina','prov'],xrf:'resin',xray:'resin',tool:'smooth'},
 modern:{name:'Współczesny odlew w brązie krzemowym',core:['xrf','patina','seam'],opt:['mark','xray','style'],xrf:'si',xray:'lost',mark:'none'},
 oldcopy:{name:'Nieautoryzowany odlew z epoki z innej odlewni',core:['mark','dims'],opt:['style','prov','cert'],mark:'other',hcm:52.9},
 papers:{name:'Odlew z podrobioną dokumentacją',core:['prov','cert'],opt:['mark','patina','xrf'],xrf:'brass',mark:'none',prov:'noCR',cert:'issuer'},
};
const DEF3={
 xrf:{name:'Analiza stopu (XRF)',probe:'xrf',gate3:{d:0.75,click:true},hint:'Podejdź blisko (≤ 75 cm) i kliknij powierzchnię rzeźby. Katalog podaje brąz cynowy. Brąz krzemowy pojawił się dopiero ok. 1927 r.; żywica z pyłem metalu to nie brąz.'},
 uv:{name:'Lampa UV',view:'uv',gate3:{d:2.5},hint:'Stary wosk konserwujący świeci słabo i równomiernie. Żywice syntetyczne fluoryzują silnie.'},
 patina:{name:'Patyna (z bliska)',gate3:{d:0.6},hint:'Naturalna patyna gromadzi zielone produkty korozji na powierzchniach poziomych i w zagłębieniach, a wypukłości (nos, broda) są wytarte do jaśniejszego metalu. Patyna chemiczna jest jednolita.'},
 weight:{name:'Waga',hint:'Porównaj masę z katalogiem (8,4 kg). Odlew z żywicy z pyłem metalu jest wielokrotnie lżejszy.'},
 dims:{name:'Pomiar (suwmiarka)',gate3:{d:1.6},hint:'Podejdź na ≤ 1,6 m – obok wybranej rzeźby pojawi się miara. Katalog: 52,0 cm. Odlew z formy zdjętej z gotowej rzeźby (surmoulage) jest mniejszy o 1–2% przez skurcz metalu.'},
 style:{name:'Porównanie z fotografią katalogową',gate3:{d:1.1,az:'front'},hint:'Stań na wprost rzeźby (≤ 1,1 m). Porównaj proporcje i ułożenie głowy z fotografią z katalogu raisonné. Kopie modelowane „z oka” mają błędy proporcji.'},
 mark:{name:'Znak odlewni i sygnatura',gate3:{d:0.5,az:'back'},hint:'Znak odlewni i sygnatura są z tyłu cokołu – obejdź rzeźbę i podejdź na ≤ 50 cm. Odlew wtórny ma rozmyty znak; inna odlewnia – inny znak; brak znaku i świeżo wyryty podpis są podejrzane.'},
 prov:{name:'Proweniencja',hint:'Prześledź historię odlewu: księgi odlewni, wystawy, katalog raisonné.'},
 cert:{name:'Certyfikat autentyczności',hint:'Sprawdź kompletność danych i wystawcę. Porównaj wysokość i masę z pomiarami.'},
 tool:{name:'Ślady obróbki (cyzelowanie)',gate3:{d:0.42},hint:'Podejdź bardzo blisko (≤ 42 cm). Ręczne cyzelowanie zostawia krótkie, nieregularne ślady narzędzi i porowatość odlewu. Surmoulage ma detal zmiękczony, żywica – gładką powierzchnię z pęcherzykami.'},
 seam:{name:'Szwy odlewnicze',gate3:{d:0.5,az:'side'},hint:'Obejrzyj rzeźbę z boku z bliska (≤ 50 cm). W starannym odlewie szwy formy są zacyzelowane; ciągły szew z boku głowy i tułowia zdradza odlew seryjny.'},
 xray:{name:'RTG',view:'xray',gate3:{d:2.5},hint:'Tradycyjny odlew piaskowy ma nierówne ścianki, resztki rdzenia i kute trzpienie. Wosk tracony ze skorupą ceramiczną daje cienkie, równe ścianki. Żywica jest jednolita i słabo pochłania promieniowanie.'},
};
const SET3=[['1. Materiał i wiek',['xrf','uv','patina','weight']],['2. Forma i sygnatura',['dims','style','mark']],['3. Proweniencja i dokumenty',['prov','cert']],['4. Obróbka i wnętrze',['tool','seam','xray']]];
const XRF={bronze:'Cu 87%, Sn 8%, Zn 3%, Pb 2% – brąz cynowy',si:'Cu 94%, Si 3,5%, Mn 1,2%, Zn 1% – brąz krzemowy',resin:'Cu 21%, Sn 2%; dominują C i O – żywica z wypełniaczem z pyłu brązu',brass:'Cu 63%, Zn 35%, Pb 2% – mosiądz'};
function obs3(q,id){const t=q.t;switch(id){
 case'uv':return q.uv==='resin'?'Silna, zielonkawa fluorescencja całej powierzchni.':'Słaba, równomierna fluorescencja warstwy wosku.';
 case'patina':return t.patina?'Jednolita brązowa patyna chemiczna – brak produktów korozji w zagłębieniach, wypukłości nie są wytarte.':'Zielone produkty korozji na powierzchniach poziomych i w zagłębieniach (pod brodą, na cokole); nos i broda wytarte do jaśniejszego metalu.';
 case'weight':return`Masa: ${fmt(q.kg.toFixed(1))} kg.`;case'dims':return`Wysokość: ${fmt(q.hcm.toFixed(1))} cm.`;
 case'style':return t.style?'Nos wyraźnie dłuższy, głowa przechylona w bok – inaczej niż na fotografii katalogowej.':'Proporcje twarzy i ułożenie głowy zgodne z fotografią katalogową.';
 case'mark':return{ok:'Ostry znak odlewni „J. BRACŁAWSKI · WARSZAWA” i sygnatura „S. Rudnicki 1888” odlane razem z cokołem.',blur:'Znak odlewni i sygnatura rozmyte, płytkie i nieco mniejsze niż na fotografii katalogowej.',other:'Znak innej odlewni: „ODLEWNIA K. SZPAKOWSKI”.',none:'Brak znaku odlewni; sygnatura cienko wyryta w gotowym odlewie – ostre, jasne krawędzie rytu.'}[q.mark];
 case'tool':return{chase:'Krótkie, nieregularne ślady cyzelowania i drobna porowatość odlewu.',soft:'Detal zmiękczony i rozmyty, ślady cyzelowania niewyraźne – jakby odbite z innej powierzchni.',smooth:'Powierzchnia gładka, bez śladów narzędzi; drobne kuliste pęcherzyki powietrza.'}[q.tool];
 case'seam':return t.seam?'Ciągły, wyraźny szew formy po obu bokach głowy, szyi i tułowia.':'Szwy formy usunięte i zacyzelowane – brak widocznych linii podziału.';
 case'xray':return{sand:'Ścianki nierównej grubości, resztki rdzenia odlewniczego, kute żelazne trzpienie.',lost:'Cienkie, równe ścianki; brak rdzenia i trzpieni.',resin:'Materiał jednolity, słabo pochłaniający promieniowanie; brak metalowej skorupy i rdzenia.'}[q.xray];
 case'prov':return!t.prov?'Ciągła historia od 1888 r.: księga zamówień odlewni, wystawa 1890, katalog raisonné nr 76.':q.m.prov==='attic'?'Brak historii przed 2025 r. – „znaleziony na strychu”; brak w katalogu raisonné.':'Historia dopiero od 1998 r.; brak w katalogu raisonné i w księgach odlewni.';
 case'cert':return!t.cert?'Certyfikat kompletny, dane zgodne z katalogiem, podpis rzeczoznawcy.':q.m.cert==='dims'?'Wysokość w certyfikacie: 49,5 cm – niezgodna z pomiarem.':'Wystawca bez uprawnień, brak materiału i daty, podpis drukowany.'}}
function why3(q,id){return({xrf:()=>({si:'Brąz krzemowy – stop wprowadzony ok. 1927 r., po dacie rzeźby.',resin:'Żywica z pyłem metalu – to nie jest odlew w brązie.',brass:'Mosiądz zamiast brązu cynowego podanego w katalogu.'})[q.xrf],
 uv:()=>'Silna fluorescencja żywicy syntetycznej.',patina:()=>'Sztuczna, chemiczna patyna – brak naturalnego starzenia.',weight:()=>'Masa kilkakrotnie mniejsza niż w katalogu – to nie jest pełny odlew z brązu.',
 dims:()=>q.hcm<52?'Wysokość mniejsza o ok. 1,5% – skurcz odlewu wtórnego (surmoulage).':'Wysokość niezgodna z katalogiem – inny model odlewniczy.',
 style:()=>'Błąd proporcji – kopia modelowana bez dostępu do oryginału.',mark:()=>({blur:'Rozmyty, mniejszy znak – odbity z oryginału razem z formą.',other:'Znak innej odlewni – nieautoryzowany odlew.',none:'Brak znaku odlewni, sygnatura dodana po odlaniu.'})[q.mark],
 tool:()=>q.tool==='soft'?'Zmiękczony detal – typowy dla odlewu z formy zdjętej z gotowej rzeźby.':'Gładka powierzchnia z pęcherzykami – odlew żywiczny.',seam:()=>'Niezacyzelowany szew – seryjny odlew współczesny.',
 xray:()=>q.xray==='lost'?'Cienkie, równe ścianki – współczesny wosk tracony ze skorupą ceramiczną.':'Brak metalu wewnątrz – odlew żywiczny.',
 prov:()=>q.m.prov==='attic'?'„Znaleziony na strychu” – brak historii.':'Historia od 1998 r., brak w katalogu i księgach odlewni.',cert:()=>q.m.cert==='dims'?'Wysokość w certyfikacie niezgodna z rzeźbą.':'Certyfikat od podmiotu bez uprawnień.'}[id]||(()=>''))()}
let T3=null,THREE_P=null;
function loadThree(){if(window.THREE)return Promise.resolve();if(THREE_P)return THREE_P;THREE_P=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)});return THREE_P}
function newSculpt(r){const PR=SV.profiles,list=[{orig:true,profile:null,t:{}}];shuffle(Object.keys(PR),r).slice(0,4).forEach(k=>list.push({orig:false,profile:k,t:rollTells(PR[k],r)}));shuffle(list,r);
 P=list.map((q,i)=>{const pr=q.profile?PR[q.profile]:{},t=q.t,qr=rng((r()*1e9)|0);q.letter='ABCDE'[i];q.seed=(qr()*1e9)|0;q.notes={};q.samples=[];q.umark='';
  SV.initQ(q,pr,t,qr);q.m={prov:pr.prov||pick(['attic','noCR'],qr),cert:pr.cert||pick(['dims','issuer'],qr)};return q})}
function bronzeInitQ(q,pr,t,qr){q.hcm=t.dims?pr.hcm:52.0;q.kg=t.weight?3.1:8.4+(qr()-.5)*0.12;q.xrf=t.xrf?pr.xrf:'bronze';q.patina=t.patina?'chem':'natural';q.uv=t.uv?'resin':'wax';q.tool=t.tool?pr.tool:'chase';
 q.xray=t.xray?(pr.xray||'lost'):'sand';q.mark=t.mark?(pr.mark||'none'):'ok';q.cold=q.profile==='cold'}
function texCanvas(fn,w=1024,h=1024){const c=mk(w,h);fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function bumpTex(mode,seed){const r=rng(seed);return texCanvas((x,w,h)=>{x.fillStyle='#808080';x.fillRect(0,0,w,h);
 if(mode!=='smooth'){x.lineCap='round';for(let i=0;i<5200;i++){const X=r()*w,Y=r()*h,a=r()*6.28,l=4+r()*9;x.strokeStyle=r()<.5?`rgba(0,0,0,${.18+r()*.2})`:`rgba(255,255,255,${.15+r()*.2})`;x.lineWidth=1+r()*1.6;x.beginPath();x.moveTo(X,Y);x.lineTo(X+Math.cos(a)*l,Y+Math.sin(a)*l);x.stroke()}
  for(let i=0;i<1600;i++){x.fillStyle='rgba(0,0,0,.55)';x.beginPath();x.arc(r()*w,r()*h,0.6+r()*1.2,0,7);x.fill()}}
 else for(let i=0;i<520;i++){const X=r()*w,Y=r()*h,s=1+r()*2.4;x.fillStyle='rgba(0,0,0,.6)';x.beginPath();x.arc(X,Y,s,0,7);x.fill();x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=0.8;x.stroke()}
 if(mode==='soft'){const c2=mk(w,h),y=c2.getContext('2d');y.filter='blur(3.5px)';y.drawImage(x.canvas,0,0);x.clearRect(0,0,w,h);x.drawImage(c2,0,0)}})}
function patTex(seed){const r=rng(seed);return texCanvas((x,w,h)=>{x.fillStyle='#d8d8d8';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){const v=170+r()*85|0;x.fillStyle=`rgba(${v},${v},${v},.25)`;x.beginPath();x.arc(r()*w,r()*h,4+r()*30,0,7);x.fill()}},512,512)}
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function colorize(g,mode,seed){const pos=g.attributes.position,nor=g.attributes.normal,n=pos.count,col=new Float32Array(n*3);
 for(let i=0;i<n;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),ny=nor.getY(i),nz=0.5+0.5*Math.sin(x*1.7+seed)*Math.cos(y*1.3+z*0.9);let c;
  if(mode==='natural'){c=[.33,.22,.13];let gg=Math.max(0,(ny-0.5)*1.8)*(.4+nz*.6);if(y>29&&y<38&&ny<-0.25)gg=Math.max(gg,.75);c=mix(c,[.22,.44,.34],Math.min(1,gg));if(z>6.3&&y>35&&y<47)c=mix(c,[.68,.5,.26],.65)}
  else c=[.42,.26,.15].map(v=>v*(0.94+nz*0.12));col.set(c,i*3)}g.setAttribute('color',new THREE.BufferAttribute(col,3))}
const TORSO=[[8,13],[8.5,13],[12,17],[17,18.5],[22,17.5],[26,14],[29,8],[30.5,5]];
function torsoR(y){for(let i=1;i<TORSO.length;i++)if(y<=TORSO[i][0]){const a=TORSO[i-1],b=TORSO[i],t=(y-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*t}return 5}
/* Bryła obrotowa z dnem i wierzchem bez trójkątów-igieł: pierścienie z coraz mniejszą liczbą boków ku środkowi. */
function lathed(prof,seg){const pos=[],idx=[],add=(x,y,z)=>(pos.push(x,y,z),pos.length/3-1),ring=(r,y,n)=>{const a=[];for(let i=0;i<n;i++){const t=i/n*Math.PI*2;a.push(add(Math.sin(t)*r,y,Math.cos(t)*r))}return a};
 const R=prof.map(([r,y])=>ring(r,y,seg));for(let k=0;k<R.length-1;k++)for(let i=0;i<seg;i++){const a=R[k][i],b=R[k][(i+1)%seg],c=R[k+1][i],d=R[k+1][(i+1)%seg];idx.push(a,b,d,a,d,c)}
 const cap=(outer,r,y,up)=>{let cur=outer,n=seg,rr=r;while(n>8){const m=n/2|0;rr*=0.55;const nx=ring(rr,y,m);for(let i=0;i<m;i++){const o0=cur[(2*i)%n],o1=cur[(2*i+1)%n],o2=cur[(2*i+2)%n],i0=nx[i],i1=nx[(i+1)%m];
   if(n%2&&i===m-1){up?idx.push(o0,i0,o1,o1,i0,i1,o1,i1,o2):idx.push(o0,o1,i0,o1,i1,i0,o1,o2,i1);continue}up?idx.push(o0,i0,o1,o1,i0,i1,o1,i1,o2):idx.push(o0,o1,i0,o1,i1,i0,o1,o2,i1)}cur=nx;n=m}
  const c=add(0,y,0);for(let i=0;i<n;i++)up?idx.push(cur[i],c,cur[(i+1)%n]):idx.push(cur[i],cur[(i+1)%n],c)};
 cap(R[0],prof[0][0],prof[0][1],true);cap(R[R.length-1],prof[prof.length-1][0],prof[prof.length-1][1],false);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const uv=[];for(let i=0;i<pos.length;i+=3)uv.push(Math.atan2(pos[i],pos[i+2])/(Math.PI*2)+0.5,pos[i+1]/40);
 g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g}
function bustGeoms(q){const V2=(p)=>p.map(a=>new THREE.Vector2(a[0],a[1])),gs=[];
 gs.push(lathed([[11,0],[11,1.5],[10,2.2],[9.2,3],[9.2,6],[10,7],[10,8]],56));
 const torso=lathed([[13,8],...TORSO.map(a=>[a[1],a[0]])],64);torso.scale(1.18,1,0.55);gs.push(torso);
 const neck=new THREE.CylinderGeometry(5.1,5.4,3.6,40);neck.scale(1,1,0.82);neck.translate(0,30.3,-0.95);gs.push(neck);
 const {head,hair}=headGeoms(q),bun=new THREE.SphereGeometry(3.4,36,26);bun.scale(1,0.9,0.85);bun.translate(0,47,-10.2);
 if(q.t.style){const m=new THREE.Matrix4().makeTranslation(0,32,0).multiply(new THREE.Matrix4().makeRotationZ(0.14)).multiply(new THREE.Matrix4().makeTranslation(0,-32,0));[head,hair,bun].forEach(g=>g.applyMatrix4(m))}
 gs.push(head,hair,bun);return gs}
/* Głowa popiersia z GameLaboratory (js/lab/bust-head.js, CC BY 4.0): low-poly siatka zagęszczona i wygładzona. */
const BH_S=19,BH_Y=43.5;let BH_CACHE={};
function bhSubdiv(P,T){const E=new Map(),nt=[];const mid=(a,b)=>{const k=a<b?a+'_'+b:b+'_'+a;let m=E.get(k);if(m==null){m=P.length;P.push([(P[a][0]+P[b][0])/2,(P[a][1]+P[b][1])/2,(P[a][2]+P[b][2])/2]);E.set(k,m)}return m};
 for(let i=0;i<T.length;i+=3){const a=T[i],b=T[i+1],c=T[i+2],ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);nt.push(a,ab,ca,ab,b,bc,ca,bc,c,ab,bc,ca)}return nt}
function bhSmooth(P,T,it){const N=P.map(()=>new Set()),ec=new Map();for(let i=0;i<T.length;i+=3)for(const[a,b]of[[T[i],T[i+1]],[T[i+1],T[i+2]],[T[i+2],T[i]]]){N[a].add(b);N[b].add(a);const k=a<b?a+'_'+b:b+'_'+a;ec.set(k,(ec.get(k)||0)+1)}
 const fix=new Set();ec.forEach((n,k)=>{if(n===1)k.split('_').forEach(x=>fix.add(+x))});
 const step=l=>{const Q=P.map((p,i)=>{if(fix.has(i)||!N[i].size)return p;let sx=0,sy=0,sz=0;N[i].forEach(j=>{sx+=P[j][0];sy+=P[j][1];sz+=P[j][2]});const n=N[i].size;return[p[0]+l*(sx/n-p[0]),p[1]+l*(sy/n-p[1]),p[2]+l*(sz/n-p[2])]});for(let i=0;i<P.length;i++)P[i]=Q[i]};
 for(let k=0;k<it;k++){step(0.5);step(-0.53)}}
function bhGeo(P,T){const g=new THREE.BufferGeometry(),pos=new Float32Array(P.length*3),uv=new Float32Array(P.length*2);
 P.forEach((p,i)=>{pos.set([p[0]*BH_S,p[1]*BH_S+BH_Y,p[2]*BH_S],i*3);uv.set([Math.atan2(p[0],p[2])/(Math.PI*2)+0.5,p[1]*0.9+0.5],i*2)});
 g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(T);g.computeVertexNormals();return g}
function headGeoms(q){const key=q.t.style?'s':'n';if(!BH_CACHE[key]){const P=BUST_HEAD.v.map(p=>p.slice());let T=[];
  T=BUST_HEAD.t.slice();P.forEach(p=>{if(p[1]<-0.5){const dx=p[0]/0.26,dz=(p[2]+0.05)/0.2,d=Math.hypot(dx,dz)||1,f=Math.min(1,1/d);p[0]*=f;p[2]=(p[2]+0.05)*f-0.05;p[1]=Math.max(p[1],-0.66)}});
  if(q.t.style)P.forEach(p=>{if(p[2]>0.3&&Math.abs(p[0])<0.14&&p[1]>-0.33&&p[1]<0.06){const f=1-Math.abs(p[1]+0.14)/0.2;p[2]+=0.09*Math.max(0,f)}});
  T=bhSubdiv(P,T);bhSmooth(P,T,3);T=bhSubdiv(P,T);bhSmooth(P,T,2);
  const H=[],HT=[],map=new Map(),nrm=bhGeo(P,T).attributes.normal;
  for(let i=0;i<T.length;i+=3){const tri=[T[i],T[i+1],T[i+2]];if(!tri.every(k=>{const p=P[k];return p[1]>0.24||(p[1]>0.05&&p[2]<-0.25)}))continue;
   HT.push(...tri.map(k=>{if(!map.has(k)){const o=0.03;map.set(k,H.length);H.push([P[k][0]+nrm.getX(k)/BH_S*o*BH_S,P[k][1]+nrm.getY(k)/BH_S*o*BH_S,P[k][2]+nrm.getZ(k)/BH_S*o*BH_S])}return map.get(k)}))}
  {const n=H.length,m=HT.length,orig=new Array(n);map.forEach((v,k)=>orig[v]=k);
   for(let i=0;i<n;i++){const k=orig[i];H.push([P[k][0]-nrm.getX(k)*0.015,P[k][1]-nrm.getY(k)*0.015,P[k][2]-nrm.getZ(k)*0.015])}
   const ec=new Map();for(let i=0;i<m;i+=3)for(const[a,b]of[[HT[i],HT[i+1]],[HT[i+1],HT[i+2]],[HT[i+2],HT[i]]]){const kk=a<b?a+'_'+b:b+'_'+a;ec.set(kk,(ec.get(kk)||0)+1)}
   for(let i=0;i<m;i+=3){HT.push(HT[i]+n,HT[i+2]+n,HT[i+1]+n);for(const[a,b]of[[HT[i],HT[i+1]],[HT[i+1],HT[i+2]],[HT[i+2],HT[i]]]){const kk=a<b?a+'_'+b:b+'_'+a;if(ec.get(kk)===1)HT.push(b,a,a+n,b,a+n,b+n)}}}
  BH_CACHE[key]={P,T,H,HT}}
 const c=BH_CACHE[key];return{head:bhGeo(c.P,c.T),hair:bhGeo(c.H,c.HT)}}
function seamGeo(sign){const v=[];for(let y=9;y<=29;y+=2)v.push(new THREE.Vector3(sign*(torsoR(y)+0.05),y,0));for(let y=30.5;y<=32.5;y+=1)v.push(new THREE.Vector3(sign*4.9,y,0));
 const c=BH_CACHE.n||BH_CACHE.s;if(c)for(let y=-0.55;y<=0.6;y+=0.05){let m=0;for(const p of c.P)if(Math.abs(p[1]-y)<0.03&&Math.abs(p[2])<0.08)m=Math.max(m,Math.abs(p[0]));if(m>0)v.push(new THREE.Vector3(sign*(m*BH_S+0.08),y*BH_S+BH_Y,0))}return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v),160,0.14,6,false)}
function markTex(mode){return texCanvas((x,w,h)=>{x.clearRect(0,0,w,h);const draw=(t,y,f)=>{x.font=f;x.textAlign='center';x.fillStyle='rgba(255,226,170,.35)';x.fillText(t,w/2+2,y+3);x.fillStyle='rgba(22,13,6,.95)';x.fillText(t,w/2,y)};
 if(mode==='ok'||mode==='blur'){if(mode==='blur'){x.filter='blur(5px)';x.translate(w/2,h/2);x.scale(0.9,0.9);x.translate(-w/2,-h/2)}draw('J. BRACŁAWSKI · WARSZAWA',110,'bold 72px Georgia');draw('S. Rudnicki 1888',220,'italic 70px Georgia')}
 if(mode==='other'){draw('ODLEWNIA K. SZPAKOWSKI',110,'bold 70px Georgia');draw('S. Rudnicki 1888',220,'italic 70px Georgia')}
 if(mode==='none'){x.font='italic 62px Georgia';x.textAlign='center';x.strokeStyle='rgba(235,220,190,.95)';x.lineWidth=2.2;x.strokeText('S. Rudnicki 1888',w/2,180)}},1024,280)}
function spriteText(lines,w,h,bg){const c=mk(w,h),x=c.getContext('2d');if(bg){x.fillStyle=bg;x.beginPath();x.roundRect?x.roundRect(4,4,w-8,h-8,18):x.rect(4,4,w-8,h-8);x.fill()}
 x.textAlign='center';lines.forEach(([t,f,col,y])=>{x.font=f;x.fillStyle=col;x.fillText(t,w/2,y)});const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));return s}
function bronzeSurface(q,gs){gs.forEach(g=>colorize(g,q.patina,q.seed%1000));const bt=bumpTex(q.tool,q.seed),pt=patTex(q.seed+1);bt.repeat.set(7,7);pt.repeat.set(2,2);
 return{mat:new THREE.MeshStandardMaterial({vertexColors:true,map:pt,bumpMap:bt,bumpScale:0.012,metalness:q.cold?0.45:0.82,roughness:q.cold?0.6:0.46}),
  uvMat:new THREE.MeshStandardMaterial({color:0x0c0812,emissive:q.uv==='resin'?0x4f9a3c:0x23301f,roughness:.9,metalness:0}),
  xMat:new THREE.MeshBasicMaterial({color:q.xray==='resin'?0x6a8a70:0xa8c4dc,transparent:true,opacity:q.xray==='resin'?0.05:0.08,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide})}}
function buildBust(q,i,forPhoto){const grp=new THREE.Group(),gs=bustGeoms(q),{mat,uvMat,xMat}=SV.surface(q,gs);
 const outer=[];gs.forEach(g=>{const m=new THREE.Mesh(g,mat);m.userData.q=q;outer.push(m);grp.add(m)});
 if(q.t.seam)for(const s of[-1,1]){const m=new THREE.Mesh(seamGeo(s),mat);m.userData.q=q;outer.push(m);grp.add(m)}
 const decal=new THREE.Mesh(new THREE.PlaneGeometry(9.5,2.6),new THREE.MeshStandardMaterial({map:SV.markTex(q),transparent:true,metalness:.5,roughness:.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));
 decal.position.set(0,4.6,-9.32);decal.rotation.y=Math.PI;grp.add(decal);
 const inner=SV.inner(q);inner.visible=false;
 grp.add(inner);const k=q.hcm/52*0.01;grp.scale.setScalar(k);
 const root=new THREE.Group();root.add(grp);if(forPhoto)return root;
 const X=(i-2)*0.95;root.position.set(X,1.0,0);
 const plinth=new THREE.Mesh(new THREE.BoxGeometry(0.36,1.0,0.36),new THREE.MeshStandardMaterial({color:0x3a332c,roughness:.85}));plinth.position.set(X,0.5,0);plinth.userData.q=q;
 const line=new THREE.Group();const lm=new THREE.LineBasicMaterial({color:0xffd27a});const top=q.hcm/100;
 line.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.17,0,0),new THREE.Vector3(0.17,top,0)]),lm));
 [0,top].forEach(y=>line.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.12,y,0),new THREE.Vector3(0.2,y,0)]),lm)));
 const ls=spriteText([[`${fmt(q.hcm.toFixed(1))} cm`,'bold 46px system-ui','#ffd27a',72]],256,100,'rgba(0,0,0,.6)');ls.scale.set(0.06,0.024,1);ls.position.set(0.21,top/2,0);line.add(ls);line.visible=false;root.add(line);
 return{q,root,grp,outer,mat,uvMat,xMat,inner,plinth,decal,line,center:new THREE.Vector3(X,1.0+0.26,0),label:null,markers:new THREE.Group()}}
function bronzeInner(q){const inner=new THREE.Group();
 if(q.xray!=='resin'){const im=new THREE.MeshBasicMaterial({color:0x9fb4c8,transparent:true,opacity:.07,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
  bustGeoms(q).forEach(g=>{const m=new THREE.Mesh(g,im);if(q.xray==='sand'){m.scale.set(0.84,0.96,0.84);m.position.set(0.5,0.7,0.4)}else m.scale.set(0.94,0.985,0.94);inner.add(m)});
  if(q.xray==='sand'){const pm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false});
   [[42,'x'],[42,'z'],[18,'x'],[33,'z']].forEach(([y,ax])=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,ax==='x'?15:12,8),pm);c.position.y=y;c.rotation[ax==='x'?'z':'x']=Math.PI/2;inner.add(c)});
   const cm=new THREE.MeshBasicMaterial({color:0x8a9a90,transparent:true,opacity:.18,blending:THREE.AdditiveBlending,depthWrite:false});[[1,43,1,3],[-2,40,-1,2.4],[0,22,0,4]].forEach(([x,y,z,r])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),cm);s.position.set(x,y,z);inner.add(s)})}}
 return inner}
function init3D(){if(T3)return;const el=document.getElementById('three');const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputEncoding=THREE.sRGBEncoding;el.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,0.01,60);
 const hemi=new THREE.HemisphereLight(0xe8dcc8,0x1a1612,0.75),dir=new THREE.DirectionalLight(0xfff0dc,1.15),fill=new THREE.DirectionalLight(0x9fb4d8,0.4);dir.position.set(2.5,4,3);fill.position.set(-3,2,-1);scene.add(hemi,dir,fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshStandardMaterial({color:0x0b1628,roughness:.95}));floor.rotation.x=-Math.PI/2;scene.add(floor);
 const wall=new THREE.Mesh(new THREE.PlaneGeometry(30,8),new THREE.MeshStandardMaterial({color:0x081222,roughness:1}));wall.position.set(0,4,-3.5);scene.add(wall);
 T3={renderer,scene,camera,hemi,dir,fill,floor,wall,el,cam:{t:new THREE.Vector3(0,1.15,0),dist:5.6,az:0,el:0.16},busts:[],dirty:true,anim:null,ray:new THREE.Raycaster(),photo:null};
 const dom=renderer.domElement,pp=new Map();let dr=null,pc=null;
 dom.addEventListener('contextmenu',e=>e.preventDefault());
 dom.addEventListener('pointerdown',e=>{dom.setPointerCapture(e.pointerId);pp.set(e.pointerId,{x:e.offsetX,y:e.offsetY});if(pp.size===1)dr={x:e.offsetX,y:e.offsetY,moved:false,pan:e.button===2||e.shiftKey};if(pp.size===2){const[a,b]=[...pp.values()];pc=Math.hypot(a.x-b.x,a.y-b.y);dr=null}});
 dom.addEventListener('pointermove',e=>{if(!pp.has(e.pointerId))return;const o=pp.get(e.pointerId);pp.set(e.pointerId,{x:e.offsetX,y:e.offsetY});
  if(pc&&pp.size===2){const[a,b]=[...pp.values()],d=Math.hypot(a.x-b.x,a.y-b.y);zoom3(pc/d);pc=d;return}
  if(!dr)return;const dx=e.offsetX-o.x,dy=e.offsetY-o.y;if(Math.abs(e.offsetX-dr.x)+Math.abs(e.offsetY-dr.y)>4)dr.moved=true;if(!dr.moved)return;const c=T3.cam;
  if(dr.pan){const k=c.dist*0.0016,right=new THREE.Vector3(Math.cos(c.az),0,-Math.sin(c.az));c.t.addScaledVector(right,-dx*k);c.t.y+=dy*k}else{c.az-=dx*0.008;c.el=Math.max(-0.35,Math.min(1.35,c.el+dy*0.006))}mark3Dirty();schedule3Gates()});
 const up=e=>{if(!pp.has(e.pointerId))return;pp.delete(e.pointerId);if(dr&&!dr.moved&&pp.size===0)click3(e.offsetX,e.offsetY);if(pp.size<2)pc=null;if(pp.size===0)dr=null};
 dom.addEventListener('pointerup',up);dom.addEventListener('pointercancel',up);
 dom.addEventListener('wheel',e=>{e.preventDefault();zoom3(Math.exp(e.deltaY*0.0012))},{passive:false});
 new ResizeObserver(()=>{const r=el.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();mark3Dirty()}).observe(el);
 (function loop(t){requestAnimationFrame(loop);if(MODE!=='sculpt')return;const c=T3.cam;
  if(T3.anim){const a=T3.anim,k=Math.min(1,(t-a.t0)/450),e=k*(2-k);c.t.lerpVectors(a.from,a.to,e);if(a.dist)c.dist=a.d0+(a.dist-a.d0)*e;if(a.az!=null)c.az=a.az0+(a.az-a.az0)*e;if(a.el!=null)c.el=a.el0+(a.el-a.el0)*e;T3.dirty=true;if(k>=1){T3.anim=null;schedule3Gates()}}
  if(!T3.dirty)return;T3.dirty=false;camera.position.set(c.t.x+c.dist*Math.sin(c.az)*Math.cos(c.el),c.t.y+c.dist*Math.sin(c.el),c.t.z+c.dist*Math.cos(c.az)*Math.cos(c.el));camera.lookAt(c.t);
  T3.busts.forEach(b=>{b.line.visible=tool==='dims'&&sel===b.q&&camera.position.distanceTo(b.center)<1.6});
  renderer.render(scene,camera);const d=sel?camera.position.distanceTo(T3.busts.find(b=>b.q===sel).center):c.dist;document.getElementById('zlv').textContent=(d<1?Math.round(d*100)+' cm':fmt(d.toFixed(2))+' m')})(0)}
const mark3Dirty=()=>{if(T3)T3.dirty=true};
function zoom3(f){const c=T3.cam;c.dist=Math.max(0.2,Math.min(9,c.dist*f));mark3Dirty();schedule3Gates()}
function anim3(to,dist,az,el){const c=T3.cam;T3.anim={from:c.t.clone(),to,t0:performance.now(),d0:c.dist,dist,az0:c.az,az,el0:c.el,el}}
function click3(x,y){const r=T3.renderer.domElement.getBoundingClientRect(),v=new THREE.Vector2(x/r.width*2-1,-(y/r.height)*2+1);T3.ray.setFromCamera(v,T3.camera);
 const objs=[];T3.busts.forEach(b=>objs.push(...b.outer,b.plinth));const hit=T3.ray.intersectObjects(objs,false)[0];if(!hit)return;const q=hit.object.userData.q,b=T3.busts.find(b=>b.q===q);
 const changed=sel!==q;sel=q;
 if(tool==='xrf'&&b.outer.includes(hit.object)){if(hit.distance>0.75)toast('Podejdź bliżej (≤ 75 cm), aby przyłożyć głowicę XRF.');else{const n=q.samples.length+1;q.samples.push(n);note(q,'xrf',`#${n}: ${XRF[q.xrf]}`);
  const s=new THREE.Mesh(new THREE.SphereGeometry(0.004,10,8),new THREE.MeshBasicMaterial({color:0xffa030}));s.position.copy(hit.point);T3.scene.add(s);b.markers.add(s);toast(`XRF #${n}: ${XRF[q.xrf]}`)}}
 if(changed){const c=T3.cam;anim3(b.center.clone(),Math.min(c.dist,1.4))}onChange()}
let g3T=0;function schedule3Gates(){clearTimeout(g3T);g3T=setTimeout(check3Gates,160)}
function camRel(b){const p=T3.camera.position,c=b.center;return{d:p.distanceTo(c),az:Math.atan2(p.x-c.x,p.z-c.z)*180/Math.PI}}
function azOK(k,az){const a=Math.abs(az);return!k||(k==='front'?a<35:k==='back'?a>140:a>50&&a<130)}
const AZTXT={front:'na wprost rzeźby',back:'z tyłu rzeźby',side:'z boku rzeźby'};
function gate3Status(q,T){const g=T.gate3;if(!g)return null;const txt=`Warunek: odległość ≤ ${Math.round(g.d*100)} cm`+(g.az?`, ${AZTXT[g.az]}`:'')+(g.click?' (kliknij powierzchnię)':'');if(!q)return{txt,ok:false};
 const b=T3.busts.find(b=>b.q===q),r=camRel(b);return{txt:txt+` · teraz ${Math.round(r.d*100)} cm`,ok:r.d<=g.d&&azOK(g.az,r.az)}}
function check3Gates(){if(MODE!=='sculpt'||!T3)return;const T=tool&&TB[tool];let ch=false;
 if(T&&T.gate3&&!T.gate3.click)for(const b of T3.busts){const r=camRel(b);if(r.d<=T.gate3.d&&azOK(T.gate3.az,r.az)&&!b.q.notes[tool]){note(b.q,tool,SV.obs(b.q,tool));ch=true;toast(`Zapisano: rzeźba ${b.q.letter} – ${T.name}`)}}
 if(ch)onChange();else if(tool)updatePanel()}
function apply3View(){if(!T3)return;const v=curView();T3.busts.forEach(b=>{b.outer.forEach(m=>m.material=v==='uv'?b.uvMat:v==='xray'?b.xMat:b.mat);b.inner.visible=v==='xray';b.decal.visible=v==='normal';b.plinth.visible=v!=='xray'});
 T3.scene.background=new THREE.Color(v==='uv'?0x05030a:v==='xray'?0x000000:0x0a1426);T3.hemi.intensity=v==='normal'?0.75:0.05;T3.dir.intensity=v==='normal'?1.15:0.05;T3.fill.intensity=v==='normal'?0.4:0;T3.floor.visible=T3.wall.visible=v!=='xray';
 T3.busts.forEach(b=>updateLabel(b));mark3Dirty()}
function updateLabel(b){if(b.label){T3.scene.remove(b.label)}const q=b.q,col=q.umark==='excl'?'#e0584f':q.umark==='susp'?'#f0a030':'#cbb894';
 const s=spriteText([[q.letter,'bold 64px Georgia',sel===q?'#ffd27a':col,72],[q.umark==='excl'?'wykluczona':q.umark==='susp'?'podejrzana':'','24px system-ui',col,108]],160,124,'rgba(0,0,0,.55)');s.scale.set(0.16,0.124,1);s.position.set(b.center.x,1.72,0);T3.scene.add(s);b.label=s;mark3Dirty()}
function build3Scene(){T3.busts.forEach(b=>{T3.scene.remove(b.root,b.plinth,b.markers);if(b.label)T3.scene.remove(b.label)});T3.busts=P.map((q,i)=>{const b=buildBust(q,i);T3.scene.add(b.root,b.plinth,b.markers);return b});
 const ref=SV.refQ(P[0].seed+7),s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,0.01,10);
 s.add(new THREE.HemisphereLight(0xffffff,0x222222,0.9));const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(1,1.5,2);s.add(dl);s.background=new THREE.Color(0xdcd4c4);
 const r=buildBust(ref,0,true);s.add(r);cam.position.set(0,0.3,1.25);cam.lookAt(0,0.27,0);const R=T3.renderer,sz=R.getSize(new THREE.Vector2());R.setSize(400,460,false);cam.aspect=400/460;cam.updateProjectionMatrix();R.render(s,cam);T3.photo=R.domElement.toDataURL('image/jpeg',0.85);R.setSize(sz.x,sz.y,false);
 T3.cam={t:new THREE.Vector3(0,1.15,0),dist:5.6,az:0,el:0.16};apply3View()}
function panel3(q){let h='';if(tool==='xrf'){const v=q.notes.xrf;h+=v?`<div class="obs">${v.map(s=>`<div>${s}</div>`).join('')}</div>`:''}
 else if(tool==='weight')h+=`<button class="btn" id="weigh">Połóż na wadze</button>`;
 else if(tool==='style')h+=`<div class="cap">${SV.photoCaption}</div><img src="${T3.photo}" style="filter:sepia(.75) contrast(1.05)">`;
 else if(tool==='prov')h+=SV.prov(q);else if(tool==='cert')h+=SV.cert(q);
 const T=TB[tool];if(tool!=='xrf'&&q.notes[tool])h+=`<div class="obs"><b>Obserwacja:</b> ${q.notes[tool]}</div>`;
 else if(T.gate3&&!T.gate3.click)h+=`<div class="obs" style="color:var(--mut)">Spełnij warunek powyżej – obserwacja zapisze się automatycznie.</div>`;
 else if(['prov','cert'].includes(tool)){note(q,tool,SV.obs(q,tool));h+=`<div class="obs"><b>Obserwacja:</b> ${q.notes[tool]}</div>`}return h}
function after3(q){const b=document.getElementById('weigh');if(b)b.onclick=()=>{note(q,'weight',SV.obs(q,'weight'));toast(`Rzeźba ${q.letter}: ${fmt(q.kg.toFixed(1))} kg`);onChange()}}
function bronzeProv(q){return !q.t.prov?`<ul class="tl"><li><b>1888</b> – odlew w odlewni J. Bracławskiego (księga zamówień, poz. 412)</li><li><b>1890</b> – wystawa TZSP, Warszawa, kat. nr 58</li><li><b>1891</b> – zakup: kolekcja Ludwika Krasnodębskiego</li><li><b>1937</b> – spadek: rodzina Orliczów</li><li><b>1975</b> – aukcja, Dom Aukcyjny „Nowy Świat”</li><li><b>2026</b> – zgłoszona do ekspertyzy</li></ul><div class="obs"><b>Katalog raisonné</b> (2011), nr 76: brąz, wys. 52,0 cm, 8,4 kg; znak odlewni i sygnatura z tyłu cokołu; fotografia.</div>`
  :q.m.prov==='attic'?`<ul class="tl"><li><b>2025</b> – „znaleziona na strychu” (oświadczenie sprzedającego)</li><li><b>2026</b> – oferowana prywatnie</li></ul><div class="obs">Katalog raisonné: brak wpisu.</div>`:`<ul class="tl"><li><b>1998</b> – zakup na targu staroci w Pradze</li><li><b>2014</b> – kolekcja prywatna</li><li><b>2026</b> – oferowana do sprzedaży</li></ul><div class="obs">Katalog raisonné i księgi odlewni: brak wpisu.</div>`}
function bronzeCert(q){const bad=q.t.cert,iss=bad&&q.m.cert==='issuer';const rows=[['Artysta','Stanisław Rudnicki (1840–1905)'],['Tytuł','Popiersie Heleny'],['Materiał',iss?'—':'brąz patynowany'],['Wysokość',bad&&q.m.cert==='dims'?'49,5 cm':'52,0 cm'],['Masa','8,4 kg'],['Odlewnia','J. Bracławski, Warszawa'],['Data',iss?'—':'1888']];
  return`<div class="doc"><h4>CERTYFIKAT AUTENTYCZNOŚCI</h4>${rows.map(r=>`<div class="row"><b>${r[0]}:</b><span>${r[1]}</span></div>`).join('')}<div class="stamp">${iss?'Wystawił: Art-Expert24 s.c. (brak na liście rzeczoznawców)<br>Podpis: nadruk':'Wystawił: dr hab. Jan Orlicz, rzeczoznawca<br>Podpis: odręczny atrament, pieczęć tłoczona'}</div></div>`}
/* =====================================================================
   WARIANTY RZEŹB – każdy materiał rejestruje się w SCULPT_VARIANTS (brąz tutaj, marmur w js/modes/marble.js)
   ===================================================================== */
const SCULPT_VARIANTS={};let SV=null;
SCULPT_VARIANTS.sculpt={id:'sculpt',label:'Znajdź oryginał – rzeźby z brązu',noun:'rzeźba',profiles:SPROF,defs:DEF3,sets:SET3,obs:obs3,why:why3,initQ:bronzeInitQ,
 surface:bronzeSurface,inner:bronzeInner,markTex:q=>markTex(q.mark),refQ:seed=>({t:{},seed,hcm:52,patina:'natural',tool:'chase',mark:'ok',xray:'sand',uv:'wax'}),
 prov:bronzeProv,cert:bronzeCert,photoCaption:'Fotografia z katalogu raisonné (Rudnicki, 2011, nr 76):',
 intro:'Na postumentach stoi 5 brązowych popiersi: jeden oryginał i cztery kopie. Obracaj kamerę i podchodź blisko – wiele badań działa tylko z bliska albo z określonej strony. Sygnały fałszerstwa zaznaczaj na checkliście każdego odlewu i zakończ ekspertyzę – odlew bez zaznaczeń to Twój oryginał.',
 caseText:()=>'Sprawa: „Popiersie Heleny”, Stanisław Rudnicki (1840–1905), 1888, brąz, wys. 52 cm. Na postumentach 5 odlewów – jeden jest oryginałem. (Artyści i dzieła są fikcyjne.)'};
