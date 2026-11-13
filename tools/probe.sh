#!/bin/bash
UA="artchecker-fetch/1.0 (GitHub Actions)"
q(){ curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?$1"; }
echo "=== cat PD-Wax"; q "action=query&format=json&list=categorymembers&cmlimit=100&cmtitle=Category:PD-Wax_seal_scan" | jq -r '.query.categorymembers[]?.title' | head -40
echo "=== search novogrudok"; q "action=query&format=json&list=search&srnamespace=6&srlimit=20&srsearch=$(jq -rn --arg s 'Актовая бумага Новогрудке' '$s|@uri')" | jq -r '.query.search[]?.title'
for f in "Emperor Charles VI confirms the free farm in Orlová to Jiří Ježíšek (1651).jpg" "LetterfromCharlesdeSalis.jpg" "Seal on the back of instructions for medicine against rabies Wellcome L0000969.jpg" "Актовая бумага на продажу недвижимости в г. Новогрудке 5.png" "AGAD (3) Koperta z pieczęcią lakową, Pudło 660-12 s. 8.png" "Sealing wax on letters.jpg"; do
 enc=$(jq -rn --arg s "$f" '$s|@uri')
 echo "=== $f"; q "action=query&format=json&prop=imageinfo&iiprop=size|extmetadata&titles=File:$enc" | jq -c '.query.pages[]|.imageinfo[0]|{w:.width,h:.height,lic:.extmetadata.LicenseShortName.value,date:(.extmetadata.DateTimeOriginal.value//""|gsub("<[^>]*>";"")|.[0:80]),desc:(.extmetadata.ImageDescription.value//""|gsub("<[^>]*>";"")|.[0:500]),art:(.extmetadata.Artist.value//""|gsub("<[^>]*>";"")|.[0:150])}'
 echo "B64 $(curl -sL -A "$UA" "https://commons.wikimedia.org/wiki/Special:FilePath/$enc?width=400" | base64 -w0)"
 sleep 1
done
