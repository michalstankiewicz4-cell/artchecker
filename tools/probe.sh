#!/bin/bash
UA="artchecker-fetch/1.0 (GitHub Actions)"
for c in "Category:Stamps of Poland, 1918" "Category:Stamps of Poland, 1919" "Category:Polish overprints of 1918" "Category:Stamps of German occupation of Poland (World War I)" "Category:Postage stamps of Poland 1918" ; do
 echo "=== $c"; curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers&cmlimit=500&cmtitle=$(jq -rn --arg s "$c" '$s|@uri')" | jq -r '.query.categorymembers[]?.title' | head -200
done
for q in "Poczta Polska 1918 overprint stamp" "Poczta Polska przedruk 1918" "Gen.-Gouv. Warschau Poczta Polska" "Poland 1918 Fischer" "Poczta Polska 1919 Austria overprint" "Poland 1919 Krakow overprint stamp" "PL 1918 Mi"; do
 echo "=== search: $q"; curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=40&srsearch=$(jq -rn --arg s "$q" '$s|@uri')" | jq -r '.query.search[]?.title'
done
