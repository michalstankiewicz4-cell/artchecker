"use strict";
/* =====================================================================
   PRAWDZIWE RZEŹBY 3D – skany (Smithsonian Open Access CC0; threedscans.com bez ograniczeń praw autorskich),
   uproszczone przez tools/build-models.mjs do js/real/model-<id>.js (REALMODEL[id]).
   Siatka jest normalizowana do wysokości 52 jednostek (jak dawny model popiersia), twarzą w stronę +Z.
   ===================================================================== */
const R3H=52;
const REAL3={
 sculpt:{model:'garfield',rot:[0,0,Math.PI/2]},
 marble:{model:'napoleon',rot:[Math.PI,0,0]}};
const R3={};                                            // id → {pos,idx,uv,tex,img,minZ…}
function loadModel3(id){if(R3[id])return Promise.resolve(R3[id]);
 return new Promise((res,rej)=>{const go=()=>{const m=REALMODEL[id],dec=(s,T)=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new T(u.buffer)};
   const q=dec(m.pos,Uint16Array),bx=m.box,P=new Float32Array(q.length);for(let i=0;i<q.length;i+=3)for(let k=0;k<3;k++)P[i+k]=bx[k]+q[i+k]/65535*(bx[k+3]-bx[k]);
   const o={P,I:dec(m.idx,m.i32?Uint32Array:Uint16Array),U:m.uv?Float32Array.from(dec(m.uv,Uint16Array),v=>v/65535):null,img:null};
   const fin=()=>{R3[id]=o;res(o)};if(m.tex){const im=new Image();im.onload=()=>{o.img=im;fin()};im.onerror=fin;im.src=m.tex}else fin()};
  if(window.REALMODEL&&REALMODEL[id])return go();const s=document.createElement('script');s.src='js/real/model-'+id+'.js';s.onload=go;s.onerror=rej;document.head.appendChild(s)})}
/* geometria bazowa (raz na model): obrót, wyśrodkowanie, wysokość 52, normalne */
const R3G={};
function real3Base(cfg){if(R3G[cfg.model])return R3G[cfg.model];const m=R3[cfg.model],P=m.P.slice(),n=P.length/3;
 const e=new THREE.Euler(...cfg.rot),M=new THREE.Matrix4().makeRotationFromEuler(e),v=new THREE.Vector3();
 for(let i=0;i<n;i++){v.set(P[i*3],P[i*3+1],P[i*3+2]).applyMatrix4(M);P[i*3]=v.x;P[i*3+1]=v.y;P[i*3+2]=v.z}
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
