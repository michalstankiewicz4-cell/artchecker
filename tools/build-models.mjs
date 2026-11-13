// Pobrane skany 3D rzeźb (CC0 / bez ograniczeń praw autorskich) → uproszczona siatka w js/real/model-<id>.js.
// Uruchamiane w GitHub Actions (fetch-models.yml). Wejście: /tmp/models/garfield.glb, /tmp/models/napoleon.stl
import fs from 'fs';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {weld,simplify,dedup,flatten,join} from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import {MeshoptSimplifier} from 'meshoptimizer';
const b64=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength).toString('base64');
function pack(id,pos,uv,idx,tex,meta){let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let i=0;i<pos.length;i+=3)for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],pos[i+k]);mx[k]=Math.max(mx[k],pos[i+k])}
 const q=new Uint16Array(pos.length);for(let i=0;i<pos.length;i+=3)for(let k=0;k<3;k++)q[i+k]=Math.round((pos[i+k]-mn[k])/((mx[k]-mn[k])||1)*65535);
 const qu=uv?Uint16Array.from(uv,v=>Math.round(Math.min(1,Math.max(0,v))*65535)):null;const n=pos.length/3,ix=n<65536?Uint16Array.from(idx):Uint32Array.from(idx);
 const o={id,n,tris:idx.length/3,box:[...mn,...mx],pos:b64(q),uv:qu?b64(qu):null,idx:b64(ix),i32:!(n<65536),tex:tex||null,...meta};
 const D=process.env.OUT||"js/real";fs.writeFileSync(`${D}/model-${id}.js`,`window.REALMODEL=window.REALMODEL||{};REALMODEL[${JSON.stringify(id)}]=${JSON.stringify(o)};\n`);
 console.log(id,'verts',n,'tris',o.tris,'box',mn.map(v=>v.toFixed(3)),mx.map(v=>v.toFixed(3)),'kB',Math.round(fs.statSync(`${D}/model-${id}.js`).size/1024))}
async function glb(id,file,ratio){
 const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco3d.createDecoderModule()});
 const doc=await io.read(file);await doc.transform(dedup(),flatten(),join(),weld({tolerance:0.0001}),simplify({simplifier:MeshoptSimplifier,ratio,error:0.002}));
 const prims=doc.getRoot().listMeshes().flatMap(m=>m.listPrimitives());console.log(id,'primitives',prims.length);
 let P=[],U=[],I=[],tex=null;
 for(const pr of prims){const base=P.length/3,pa=pr.getAttribute('POSITION'),ua=pr.getAttribute('TEXCOORD_0'),ia=pr.getIndices();
  // węzeł może mieć macierz – po flatten() stosujemy macierz świata
  const node=doc.getRoot().listNodes().find(n=>n.getMesh()&&n.getMesh().listPrimitives().includes(pr)),M=node?node.getWorldMatrix():null;
  for(let i=0;i<pa.getCount();i++){const v=pa.getElement(i,[]);if(M){const x=v[0],y=v[1],z=v[2];v[0]=M[0]*x+M[4]*y+M[8]*z+M[12];v[1]=M[1]*x+M[5]*y+M[9]*z+M[13];v[2]=M[2]*x+M[6]*y+M[10]*z+M[14]}P.push(...v);U.push(...(ua?ua.getElement(i,[]):[0,0]))}
  for(let i=0;i<ia.getCount();i++)I.push(base+ia.getScalar(i));
  const mat=pr.getMaterial(),t=mat&&mat.getBaseColorTexture();if(t&&!tex)tex=`data:${t.getMimeType()};base64,`+Buffer.from(t.getImage()).toString('base64')}
 pack(id,Float32Array.from(P),Float32Array.from(U),I,tex,{})}
function stl(id,file,target){const b=fs.readFileSync(file),n=b.readUInt32LE(80),map=new Map(),P=[],I=[];
 for(let t=0;t<n;t++){const o=84+t*50+12;for(let v=0;v<3;v++){const x=b.readFloatLE(o+v*12),y=b.readFloatLE(o+v*12+4),z=b.readFloatLE(o+v*12+8),k=x.toFixed(5)+','+y.toFixed(5)+','+z.toFixed(5);let j=map.get(k);if(j==null){j=P.length/3;map.set(k,j);P.push(x,y,z)}I.push(j)}}
 console.log(id,'stl tris',n,'verts',P.length/3);
 const pos=Float32Array.from(P);const out=MeshoptSimplifier.simplify(Uint32Array.from(I),pos,3,target*3,0.01,['LockBorder']);
 const used=new Map(),NP=[],NI=[];for(const k of out[0]??out){let j=used.get(k);if(j==null){j=NP.length/3;used.set(k,j);NP.push(pos[k*3],pos[k*3+1],pos[k*3+2])}NI.push(j)}
 pack(id,Float32Array.from(NP),null,NI,null,{})}
await MeshoptSimplifier.ready;
await glb('garfield','/tmp/models/garfield.glb',0.3);
stl('napoleon','/tmp/models/napoleon.stl',50000);
