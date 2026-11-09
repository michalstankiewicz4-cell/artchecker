# Zamienia img/real/*.jpg na js/real/<slug>.js (REALIMG[slug]='data:image/jpeg;base64,...'),
# żeby gra mogła rysować prawdziwe dzieła na canvasie także po otwarciu z file:// (bez blokady CORS).
import base64,glob,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(ROOT,'js','real'),exist_ok=True)
for f in sorted(glob.glob(os.path.join(ROOT,'img','real','*.jpg'))):
    slug=os.path.splitext(os.path.basename(f))[0]
    b=base64.b64encode(open(f,'rb').read()).decode()
    open(os.path.join(ROOT,'js','real',slug+'.js'),'w').write('window.REALIMG=window.REALIMG||{};REALIMG["%s"]="data:image/jpeg;base64,%s";\n'%(slug,b))
    print(slug,len(b))
