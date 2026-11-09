# Generuje statyczne ilustracje wiki (img/wiki/*.jpg) i manifest js/data/wikiimg.js.
# Uruchom: python3 tools/build-wiki-img.py  (wymaga playwright + chrome)
import asyncio,base64,json,os,sys
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path=os.environ.get('CHROME','/usr/bin/google-chrome'))
        pg=await b.new_page(viewport={'width':1400,'height':900})
        await pg.goto('file://'+ROOT+'/index.html'); await pg.wait_for_timeout(2000)
        n=await pg.evaluate("()=>{WIKI=wikiData();return WIKI.length}")
        man={}
        for i in range(n):
            r=await pg.evaluate("""i=>{const a=WIKI[i];if(!a.img)return null;const r=wikiIllus(a.img);if(!r||!r.c)return null;
              const c=r.c,sc=Math.min(1,900/c.width),o=mk(Math.round(c.width*sc),Math.round(c.height*sc));o.getContext('2d').drawImage(c,0,0,o.width,o.height);
              for(const k in WIMG)delete WIMG[k];if(Object.keys(WBATCH).length>6)for(const k in WBATCH)delete WBATCH[k];
              return {slug:wslug(a.title),cap:r.cap,w:o.width,h:o.height,d:o.toDataURL('image/jpeg',.82)}}""",i)
            if not r: continue
            open(f"{ROOT}/img/wiki/{r['slug']}.jpg",'wb').write(base64.b64decode(r['d'].split(',')[1]))
            man[r['slug']]={'cap':r['cap'],'w':r['w'],'h':r['h']}
            print(i,r['slug'],file=sys.stderr)
        open(ROOT+'/js/data/wikiimg.js','w').write('"use strict";\n/* Wygenerowane przez tools/build-wiki-img.py – nie edytować ręcznie. */\nconst WIMGS='+json.dumps(man,ensure_ascii=False)+';\n')
        await b.close()
asyncio.run(main())
