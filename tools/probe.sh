#!/bin/bash
UA="artchecker-fetch/1.0 (GitHub Actions)"
q(){ curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?$1"; }
for c in "Category:Sealing wax seals" "Category:Letters with wax seals" "Category:Documents with sealing wax seals" "Category:Sealing wax on documents" "Category:Wax seals in Poland" "Category:Sealing wax" ; do
 echo "=== $c"; q "action=query&format=json&list=categorymembers&cmlimit=200&cmtitle=$(jq -rn --arg s "$c" '$s|@uri')" | jq -r '.query.categorymembers[]?.title' | head -80
done
for s in "pieczęć lakowa dokument" "dokument z pieczęcią lakową" "list pieczęć lakowa XVIII" "letter sealing wax 18th century document" "Urkunde Lacksiegel Papier" "passport 18th century wax seal" "patent nobility paper wax seal" "akt pieczęć lakowa"; do
 echo "=== search: $s"; q "action=query&format=json&list=search&srnamespace=6&srlimit=30&srsearch=$(jq -rn --arg s "$s" '$s|@uri')" | jq -r '.query.search[]?.title' 2>/dev/null
 sleep 1
done
