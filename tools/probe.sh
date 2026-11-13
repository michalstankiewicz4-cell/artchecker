#!/bin/bash
UA="artchecker-fetch/1.0 (GitHub Actions)"
q(){ curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?$1"; }
for c in "Category:Stamps of Poland" "Category:Stamps of Poland by year" "Category:1918 stamps of Poland" "Category:1919 stamps of Poland" "Category:Overprinted stamps of Poland"; do
 echo "=== $c"; q "action=query&format=json&list=categorymembers&cmlimit=500&cmtitle=$(jq -rn --arg s "$c" '$s|@uri')" | jq -r '.query.categorymembers[]?.title' | head -120
done
for s in "pocztapolska" "Posen 1918" "Lublin 1918 stamp" "Warszawa 1918 znaczek" "Poczta Polska Gen.-Gouv." "Poczta Polska stamp 1919" "Austrohungary pocztapolska" "Polska poczta 1918 Germania"; do
 echo "=== search: $s"; q "action=query&format=json&list=search&srnamespace=6&srlimit=40&srsearch=$(jq -rn --arg s "$s" '$s|@uri')" | jq -r '.query.search[]?.title' 2>/dev/null
done
for f in "File:Posen5pf1918.jpg" "File:Austrohungary3h1919pocztapolska.jpg"; do
 echo "=== info $f"; q "action=query&format=json&prop=imageinfo&iiprop=size|extmetadata&titles=$(jq -rn --arg s "$f" '$s|@uri')" | jq -c '.query.pages[]|.imageinfo[0]|{w:.width,h:.height,lic:.extmetadata.LicenseShortName.value,desc:(.extmetadata.ImageDescription.value//""|gsub("<[^>]*>";"")|.[0:300]),art:(.extmetadata.Artist.value//""|gsub("<[^>]*>";""))}'
done
