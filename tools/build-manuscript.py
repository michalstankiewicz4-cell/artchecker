# Strony Manuskryptu Wojnicza (Beinecke MS 408, domena publiczna; zdjęcia z Wikimedia Commons, pobrane przez fetch-art.yml)
# → przycięcie do karty (bez tła i sąsiedniej strony) → js/real/ms-<n>.js (JPEG, data URL).
import base64,io,os,sys
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES={'vm-200':0.03,'vm-32':0.065,'vm-100':0.055,'vm-140':0.115}   # strona → ile ucinamy z lewej (krawędzie kart pod spodem)
for s in PAGES:
    im=Image.open(os.path.join(ROOT,'img','real',s+'.jpg')).convert('RGB');w,h=im.size;g=im.convert('L')
    # kolumny i wiersze, w których pergamin (jasny) przeważa
    col=[sum(1 for y in range(0,h,4) if g.getpixel((x,y))>120)/(h/4) for x in range(w)]
    row=[sum(1 for x in range(0,w,4) if g.getpixel((x,y))>120)/(w/4) for y in range(h)]
    xs=[x for x in range(w) if col[x]>0.75];ys=[y for y in range(h) if row[y]>0.6]
    x0,x1=min(xs),max(xs);box=(int(x0+(x1-x0)*PAGES[s]),min(ys),x1,max(ys));c=im.crop(box)
    b=io.BytesIO();c.save(b,'JPEG',quality=86);d=base64.b64encode(b.getvalue()).decode()
    open(os.path.join(ROOT,'js','real','ms-'+s[3:]+'.js'),'w').write('window.REALIMG=window.REALIMG||{};REALIMG["ms-%s"]="data:image/jpeg;base64,%s";\n'%(s[3:],d))
    c.save('/tmp/ms-%s.jpg'%s[3:]);print(s,box,c.size,len(d),file=sys.stderr)
# Dokumenty z pieczęcią lakową (domena publiczna, Wikimedia Commons):
#  doc-agad – koperta z dokumentem Rządu Narodowego 1863 (AGAD) na zielonym tle → tło przezroczyste, WebP;
#  doc-nowo – akt sprzedaży domu w Nowogródku (1902–1911), odwrocie ostatniej karty z pieczęcią lakową → JPEG.
def save(name,im,fmt):
    b=io.BytesIO();im.save(b,fmt,quality=84);d=base64.b64encode(b.getvalue()).decode()
    open(os.path.join(ROOT,'js','real',name+'.js'),'w').write('window.REALIMG=window.REALIMG||{};REALIMG["%s"]="data:image/%s;base64,%s";\n'%(name,fmt.lower(),d))
    im.save('/tmp/%s.png'%name);print(name,im.size,len(d),file=sys.stderr)
im=Image.open(os.path.join(ROOT,'img','real','doc-agad.jpg')).convert('RGBA');w,h=im.size
im=im.crop((int(w*0.022),int(h*0.098),int(w*0.937),int(h*0.942)));px=im.load()
for y in range(im.height):
    for x in range(im.width):
        r,g,b,a=px[x,y]
        if g>r+18 and b>r+8:px[x,y]=(r,g,b,0)            # zielone tło (sukno)
save('ms-agad',im,'WEBP')
im=Image.open(os.path.join(ROOT,'img','real','doc-nowo.jpg')).convert('RGB');w,h=im.size
save('ms-nowo',im.crop((0,int(h*0.004),int(w*0.985),h)),'JPEG')
