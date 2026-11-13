#!/bin/bash
UA="artchecker-fetch/1.0 (GitHub Actions)"
q(){ curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?$1"; }
for f in "Stamp Poland Mi2.jpg" "Stamp Poland Mi3.jpg" "Posen5pf1918.jpg" "Pocztapolska5pf1919.jpg" "Pocztapolska25pf1919.jpg" "PL Fi70 over DE Mi90.jpg" "Stamp PL Mi130 over DE Mi102.jpg" "Stamp PL Mi131 over DE Mi99.jpg" "Austrohungary3h1919pocztapolska.jpg" "Poland 50h1919 1st.jpg" "Poland stamp Lublin issue Mi17.jpg"; do
 enc=$(jq -rn --arg s "$f" '$s|@uri')
 echo "=== $f"; q "action=query&format=json&prop=imageinfo&iiprop=size|extmetadata&titles=File:$enc" | jq -c '.query.pages[]|.imageinfo[0]|{w:.width,h:.height,lic:.extmetadata.LicenseShortName.value,desc:(.extmetadata.ImageDescription.value//""|gsub("<[^>]*>";"")|.[0:400]),art:(.extmetadata.Artist.value//""|gsub("<[^>]*>";"")|.[0:200])}'
 echo "B64 $(curl -sL -A "$UA" "https://commons.wikimedia.org/wiki/Special:FilePath/$enc?width=360" | base64 -w0)"
 sleep 1
done
