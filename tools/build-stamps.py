# Przygotowuje zdjęcia znaczków (Wikimedia Commons, domena publiczna) dla trybu „Weryfikacja znaczków”:
# usuwa ciemne tło (wypełnienie od brzegów), przycina i zapisuje js/real/stamp-<id>.js (PNG z przezroczystością, data URL).
# Źródła: img/real/pb-c.jpg („Pennyblack-pd.jpg”), img/real/pl1-a.jpg („Znaczek Fi 1.jpg”).
import base64,io,os,sys
from collections import deque
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def cut(src,thr,inset=None):
    im=Image.open(os.path.join(ROOT,'img','real',src)).convert('RGBA');w,h=im.size;px=im.load()
    lum=lambda p:0.3*p[0]+0.59*p[1]+0.11*p[2]
    seen=bytearray(w*h);q=deque()
    for x in range(w):q.extend([(x,0),(x,h-1)])
    for y in range(h):q.extend([(0,y),(w-1,y)])
    while q:
        x,y=q.popleft()
        if x<0 or y<0 or x>=w or y>=h or seen[y*w+x]:continue
        if lum(px[x,y])>thr:continue
        seen[y*w+x]=1;r,g,b,a=px[x,y];px[x,y]=(r,g,b,0)
        q.extend([(x+1,y),(x-1,y),(x,y+1),(x,y-1)])
    im=im.crop(im.getbbox())
    if inset:
        W,H=im.size;l,t,r,b=inset;im=im.crop((int(W*l),int(H*t),int(W*(1-r)),int(H*(1-b))))
    return im
out={'pb':cut('pb-c.jpg',70),'pl1':cut('pl1-a.jpg',85,(0.075,0.035,0.04,0.06))}
for k,im in out.items():
    b=io.BytesIO();png=k=='pb'
    (im.save(b,'PNG',optimize=True) if png else im.convert('RGB').save(b,'JPEG',quality=88));d=base64.b64encode(b.getvalue()).decode()
    open(os.path.join(ROOT,'js','real','stamp-'+k+'.js'),'w').write('window.REALIMG=window.REALIMG||{};REALIMG["stamp-%s"]="data:image/%s;base64,%s";\n'%(k,'png' if png else 'jpeg',d))
    im.save('/tmp/stamp-%s.png'%k);print(k,im.size,len(d),file=sys.stderr)
