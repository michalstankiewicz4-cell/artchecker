# Doktor modeli z GameLaboratory dla rzeźb 3D gry (popiersie: cokół, tors, szyja, głowa, włosy, kok, szwy).
# Uruchom: python3 tools/doctor-3d.py /ścieżka/do/GameLaboratory   (wymaga playwright + chrome)
# Pliki obu repozytoriów podaje przeglądarce bez serwera (podmiana żądań w Playwright).
import asyncio,json,mimetypes,os,sys
from playwright.async_api import async_playwright
GAME=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB=os.path.abspath(sys.argv[1] if len(sys.argv)>1 else os.path.join(GAME,'..','GameLaboratory'))
PAGE='''<!doctype html><html><head><meta charset="utf-8"></head><body><script type="module">
import * as T from '/lab/vendor/three/three.module.js';
import {examine} from '/lab/tools/doctor/modeldoctor.js';
window.THREE=T;
const load=src=>new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.body.appendChild(s)});
for(const f of ['js/core/util.js','js/lab/bust-head.js','js/modes/sculpture3d.js'])await load('/game/'+f);
const NAMES=['cokół','tors','szyja','głowa','włosy','kok'],out={};
for(const [id,q,seam] of [['oryginał',{t:{}},false],['styl (nos, przechył)',{t:{style:true}},false],['ze szwami',{t:{seam:true}},true]]){
 BH_CACHE={};const root=new T.Group(),mat=new T.MeshStandardMaterial({color:0x996633});
 bustGeoms(q).forEach((g,i)=>{const m=new T.Mesh(g,mat);m.name=NAMES[i]||('część '+i);root.add(m)});
 if(seam)for(const s of[-1,1]){const m=new T.Mesh(seamGeo(s),mat);m.name='szew '+(s<0?'lewy':'prawy');root.add(m)}
 root.updateMatrixWorld(true);const r=examine(root,{});
 out[id]={triangles:r.stats.triangles,findings:r.findings.map(f=>({check:f.check,severity:f.severity,parts:f.parts,detail:f.detail}))}}
window.REPORT=out;
</script></body></html>'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path=os.environ.get('CHROME','/usr/bin/google-chrome'),args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        async def h(route):
            u=route.request.url.split('doctor.test',1)[1].split('?')[0]
            if u=='/': return await route.fulfill(body=PAGE,content_type='text/html')
            base,rest=(LAB,u[5:]) if u.startswith('/lab/') else (GAME,u[6:])
            path=os.path.join(base,rest)
            if os.path.isfile(path): await route.fulfill(path=path,content_type=mimetypes.guess_type(path)[0] or 'application/javascript')
            else: await route.fulfill(status=404,body='')
        await pg.route('http://doctor.test/**',h)
        await pg.goto('http://doctor.test/')
        await pg.wait_for_function('window.REPORT',timeout=300000)
        rep=await pg.evaluate('window.REPORT');await b.close()
    bad=0
    for k,v in rep.items():
        print(f"{k}: {v['triangles']} trójkątów, wyników: {len(v['findings'])}")
        for f in v['findings']:print(f"  [{f['severity']}] {f['check']} – {', '.join(f['parts'])}: {f['detail']}");bad+=f['severity']=='error'
    if errs:print('błędy strony:',errs)
    sys.exit(1 if bad or errs else 0)
asyncio.run(main())
