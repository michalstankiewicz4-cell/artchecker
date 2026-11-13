"use strict";
/* =====================================================================
   PRAWDZIWE RZEŹBY 3D – skany (Smithsonian Open Access CC0; threedscans.com bez ograniczeń praw autorskich),
   uproszczone przez tools/build-models.mjs do js/real/model-<id>.js (REALMODEL[id]).
   Siatka jest normalizowana do wysokości 52 jednostek (jak dawny model popiersia), twarzą w stronę +Z.
   ===================================================================== */
const R3H=52;
const REAL3={
 sculpt:{model:'garfield',rot:[0,0,Math.PI/2],level:true,tilt:[-25.45,-0.75],square:true,sq:75,yaw:Math.PI},
 marble:{model:'napoleon',rot:[Math.PI,0,0]}};
const R3={};                                            // id → {pos,idx,uv,tex,img,minZ…}
function loadModel3(id){if(R3[id])return Promise.resolve(R3[id]);
 return new Promise((res,rej)=>{const go=()=>{const m=REALMODEL[id],dec=(s,T)=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new T(u.buffer)};
   const q=dec(m.pos,Uint16Array),bx=m.box,P=new Float32Array(q.length);for(let i=0;i<q.length;i+=3)for(let k=0;k<3;k++)P[i+k]=bx[k]+q[i+k]/65535*(bx[k+3]-bx[k]);
   const o={P,I:dec(m.idx,m.i32?Uint32Array:Uint16Array),U:m.uv?Float32Array.from(dec(m.uv,Uint16Array),v=>v/65535):null,img:null};
   const fin=()=>{R3[id]=o;res(o)};if(m.tex){const im=new Image();im.onload=()=>{o.img=im;fin()};im.onerror=fin;im.src=m.tex}else fin()};
  if(window.REALMODEL&&REALMODEL[id])return go();const s=document.createElement('script');s.src='js/real/model-'+id+'.js';s.onload=go;s.onerror=rej;document.head.appendChild(s)})}
/* geometria bazowa (raz na model): obrót, wyśrodkowanie, wysokość 52, normalne */
const R3G={},R3LOG={};   // R3LOG: wyliczone kąty (do wpisania w REAL3, żeby nie liczyć przy każdym wczytaniu)
function real3Base(cfg){if(R3G[cfg.model])return R3G[cfg.model];const m=R3[cfg.model],P=m.P.slice(),n=P.length/3;
 const e=new THREE.Euler(...cfg.rot),M=new THREE.Matrix4().makeRotationFromEuler(e),v=new THREE.Vector3();
 for(let i=0;i<n;i++){v.set(P[i*3],P[i*3+1],P[i*3+2]).applyMatrix4(M);P[i*3]=v.x;P[i*3+1]=v.y;P[i*3+2]=v.z}
 /* wypoziomowanie: płaszczyzna dopasowana do spodu podstawy (dolne 4% wysokości) → poziomo */
 if(cfg.level){/* szukamy nachylenia (wokół X i Z), przy którym najniższe punkty (spód podstawy) leżą najbardziej płasko */
  const st=Math.max(1,Math.floor(n/(cfg.tilt?1e9:15000))),S=[];for(let i=0;i<n;i+=st)S.push(P[i*3],P[i*3+1],P[i*3+2]);const m=S.length/3,K=Math.max(30,Math.floor(m*0.015));
  const score=(ax,az)=>{const ca=Math.cos(ax),sa=Math.sin(ax),cz=Math.cos(az),sz=Math.sin(az),Y=new Float32Array(m);
   for(let i=0;i<m;i++){const x=S[i*3],y=S[i*3+1],z=S[i*3+2],y1=y*ca-z*sa,z1=y*sa+z*ca,y2=x*sz+y1*cz;Y[i]=y2}
   Y.sort();let mu=0;for(let i=0;i<K;i++)mu+=Y[i];mu/=K;let v2=0;for(let i=0;i<K;i++)v2+=(Y[i]-mu)**2;return v2/K};
  let bx=0,bz=0,bs=score(0,0);if(cfg.tilt)[bx,bz]=cfg.tilt;else for(const step of[1,0.25,0.05])for(let it=0;it<2;it++){const cx=bx,cz=bz,R=step===1?20:step*6;
   for(let a=-R;a<=R;a+=step)for(let c=-R;c<=R;c+=step){const ax=(cx+a),az=(cz+c),sc=score(ax*Math.PI/180,az*Math.PI/180);if(sc<bs){bs=sc;bx=ax;bz=az}}}
  R3LOG[cfg.model+':tilt']=[bx,bz];const M2=new THREE.Matrix4().makeRotationZ(bz*Math.PI/180).multiply(new THREE.Matrix4().makeRotationX(bx*Math.PI/180));
  for(let i=0;i<n;i++){v.set(P[i*3],P[i*3+1],P[i*3+2]).applyMatrix4(M2);P[i*3]=v.x;P[i*3+1]=v.y;P[i*3+2]=v.z}}
 /* wyrównanie podstawy do osi: obrót wokół pionu minimalizujący prostokąt opisany na spodzie */
 if(cfg.square){let y0=1e9,y1=-1e9;for(let i=0;i<n;i++){y0=Math.min(y0,P[i*3+1]);y1=Math.max(y1,P[i*3+1])}const lim=y0+(y1-y0)*0.03,B=[];for(let i=0;i<n;i++)if(P[i*3+1]<=lim)B.push(P[i*3],P[i*3+2]);
  let best=0,ba=1e18;if(cfg.sq!=null)best=cfg.sq*Math.PI/180;else for(let d=0;d<90;d+=0.5){const a=d*Math.PI/180,c=Math.cos(a),sn=Math.sin(a);let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(let i=0;i<B.length;i+=2){const X=B[i]*c-B[i+1]*sn,Z=B[i]*sn+B[i+1]*c;x0=Math.min(x0,X);x1=Math.max(x1,X);z0=Math.min(z0,Z);z1=Math.max(z1,Z)}const A=(x1-x0)*(z1-z0);if(A<ba){ba=A;best=a}}
  R3LOG[cfg.model+':sq']=best*180/Math.PI;const Y=new THREE.Matrix4().makeRotationY(-best);for(let i=0;i<n;i++){v.set(P[i*3],P[i*3+1],P[i*3+2]).applyMatrix4(Y);P[i*3]=v.x;P[i*3+1]=v.y;P[i*3+2]=v.z}}
 if(cfg.yaw){const Y=new THREE.Matrix4().makeRotationY(cfg.yaw);for(let i=0;i<n;i++){v.set(P[i*3],P[i*3+1],P[i*3+2]).applyMatrix4(Y);P[i*3]=v.x;P[i*3+1]=v.y;P[i*3+2]=v.z}}
 let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let i=0;i<n;i++)for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],P[i*3+k]);mx[k]=Math.max(mx[k],P[i*3+k])}
 const s=R3H/(mx[1]-mn[1]),cx=(mn[0]+mx[0])/2,cz=(mn[2]+mx[2])/2;for(let i=0;i<n;i++){P[i*3]=(P[i*3]-cx)*s;P[i*3+1]=(P[i*3+1]-mn[1])*s;P[i*3+2]=(P[i*3+2]-cz)*s}
 let U=m.U;if(!U){U=new Float32Array(n*2);for(let i=0;i<n;i++){U[i*2]=Math.atan2(P[i*3],P[i*3+2])/(Math.PI*2)+0.5;U[i*2+1]=P[i*3+1]/R3H}}
 /* tył cokołu na wys. ok. 4,6: najmniejsze z dla |x|<3 */
 let bz=0,bw=0;for(let i=0;i<n;i++){const y=P[i*3+1];if(y>2&&y<7){if(Math.abs(P[i*3])<3)bz=Math.min(bz,P[i*3+2]);bw=Math.max(bw,Math.abs(P[i*3]))}}
 return R3G[cfg.model]={P,U,I:m.I,backZ:bz,baseW:bw*2}}
function real3Geo(q){const b=real3Base(SV.real),P=b.P.slice();
 if(q.t.style){const y0=R3H*0.6;for(let i=0;i<P.length;i+=3){const y=P[i+1];if(y<=y0)continue;const f=Math.min(1,(y-y0)/(R3H*0.12)),a=0.14*f,x=P[i],dy=y-y0;P[i]=x*Math.cos(a)-dy*Math.sin(a);P[i+1]=y0+x*Math.sin(a)+dy*Math.cos(a)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('uv',new THREE.BufferAttribute(b.U,2));g.setIndex(new THREE.BufferAttribute(b.I,1));g.computeVertexNormals();return g}
/* szew formy po bokach: profil największego |x| w pasie |z|<0,8 */
function real3Seam(sign){const b=real3Base(SV.real),P=b.P,v=[];for(let y=6;y<R3H-1;y+=1.5){let m=0;for(let i=0;i<P.length;i+=3)if(Math.abs(P[i+1]-y)<0.6&&Math.abs(P[i+2])<0.8&&P[i]*sign>m)m=P[i]*sign;if(m>0)v.push(new THREE.Vector3(sign*(m+0.06),y,0))}
 return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v),160,0.14,6,false)}
function real3Tex(){const m=R3[SV.real.model];if(!m||!m.img)return null;if(!m.t){m.t=new THREE.Texture(m.img);m.t.flipY=false;m.t.needsUpdate=true}return m.t}
SCULPT_VARIANTS.sculpt.real=REAL3.sculpt;SCULPT_VARIANTS.marble.real=REAL3.marble;
/* Ilustracja wiki: render prawdziwego skanu (gdy three.js i model są już wczytane); inaczej rysunek 2D z home.js */
function bustIllus3D(marble){const v=SCULPT_VARIANTS[marble?'marble':'sculpt'];if(!window.THREE||!R3[v.real.model])return null;
 const sv0=SV;SV=v;try{const W=420,H=520,ren=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,alpha:true});ren.setSize(W,H);
  const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xfff4e0,0x2a2620,0.9));const d=new THREE.DirectionalLight(0xffffff,0.9);d.position.set(2,3,4);sc.add(d);const d2=new THREE.DirectionalLight(0xb8c8ff,0.35);d2.position.set(-3,1,-2);sc.add(d2);
  const q=v.refQ(7);q.m={};const root=buildBust(q,0,true);sc.add(root);const box=new THREE.Box3().setFromObject(root),c=box.getCenter(new THREE.Vector3()),h=box.max.y-box.min.y;
  const cam=new THREE.PerspectiveCamera(30,W/H,0.01,20);cam.position.set(c.x+h*0.35,c.y+h*0.08,c.z+h*2.1);cam.lookAt(c);ren.render(sc,cam);
  const out=mk(W,H);out.getContext('2d').drawImage(ren.domElement,0,0);ren.dispose();return out}catch(e){return null}finally{SV=sv0}}
