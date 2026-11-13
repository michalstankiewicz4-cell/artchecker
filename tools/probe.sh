#!/bin/bash
UA="artchecker-fetch/1.0 (GitHub Actions)"
for c in "Category:Voynich manuscript" "Category:Voynich manuscript - pages" "Category:Pages of the Voynich manuscript"; do
 echo "=== $c"; curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers&cmlimit=500&cmtitle=$(jq -rn --arg s "$c" '$s|@uri')" | jq -r '.query.categorymembers[]?.title' | head -300
done
for q in "Voynich manuscript folio" "Voynich Manuscript (32)" "Voynich f58r" "Voynich f78r"; do
 echo "=== search: $q"; curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=30&srsearch=$(jq -rn --arg s "$q" '$s|@uri')" | jq -r '.query.search[]?.title'
done
