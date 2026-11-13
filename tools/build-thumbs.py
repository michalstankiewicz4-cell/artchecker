# Miniatury rzeźb na ekran startowy: render prawdziwych skanów 3D z przezroczystym tłem → js/real/thumb-<tryb>.js
# Uruchom: python3 tools/build-thumbs.py  (playwright + chrome; three.js z CDN albo THREE_LOCAL=/ścieżka/three.min.js)
import asyncio,os
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path=os.environ.get('CHROME','/usr/bin/google-chrome'),args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
        pg=await b.new_page()
        if os.environ.get('THREE_LOCAL'):await pg.route('**/three.min.js',lambda r:r.fulfill(path=os.environ['THREE_LOCAL'],content_type='application/javascript'))
        await pg.goto('file://'+ROOT+'/index.html?lang=pl'); await pg.wait_for_timeout(1500)
        await pg.evaluate("async()=>{await loadThree();await loadModel3('garfield');await loadModel3('napoleon')}")
        for mode,marble in (('sculpt','false'),('marble','true')):
            d=await pg.evaluate(f"()=>bustIllus3D({marble}).toDataURL('image/png')")
            open(f"{ROOT}/js/real/thumb-{mode}.js",'w').write('window.REALIMG=window.REALIMG||{};REALIMG["thumb-%s"]="%s";\n'%(mode,d))
            print(mode,len(d))
        await b.close()
asyncio.run(main())
