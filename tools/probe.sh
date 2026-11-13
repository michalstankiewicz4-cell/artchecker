#!/bin/bash
UA="artchecker-fetch/1.0 (GitHub Actions)"
for f in "Stamp Poland Mi3.jpg" "PL Fi70 over DE Mi90.jpg" "Poland 50h1919 1st.jpg"; do
 enc=$(jq -rn --arg s "$f" '$s|@uri')
 echo "=== $f"
 curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&rvslots=main&titles=File:$enc" | jq -r '.query.pages[]|.revisions[0].slots.main["*"]' | head -60
done
for s in "Poland 1919 halerzy eagle stamp" "Poland 1919 first definitive halerzy" "Polish eagle 1919 stamp fenigi"; do
 echo "=== search: $s"; curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=20&srsearch=$(jq -rn --arg s "$s" '$s|@uri')" | jq -r '.query.search[]?.title' 2>/dev/null
done
