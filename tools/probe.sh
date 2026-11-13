#!/bin/bash
# Rozpoznanie źródeł obrazów (uruchamiane w GitHub Actions – sieć niedostępna lokalnie).
UA="artchecker-fetch/1.0 (GitHub Actions)"
for q in "Penny Black" "Penny black stamp 1840" "Poland 1860 stamp 10 kopecks" "Polska 1 znaczek 1860" "Pierwszy polski znaczek" "Poland stamp No 1"; do
 echo "=== search: $q"; curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=30&srsearch=$(jq -rn --arg s "$q" '$s|@uri')" | jq -r '.query.search[]?.title'
done
for c in "Category:Penny Black" "Category:Poland 1" "Category:Stamps of Congress Poland" "Category:1860 stamps of Poland"; do
 echo "=== $c"; curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers&cmlimit=200&cmtitle=$(jq -rn --arg s "$c" '$s|@uri')" | jq -r '.query.categorymembers[]?.title'
done
