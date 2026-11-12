#!/bin/bash
# Rozpoznanie źródeł obrazów monet (uruchamiane w GitHub Actions – sieć niedostępna lokalnie).
UA="artchecker-fetch/1.0 (GitHub Actions)"
for u in https://nbp.pl/en/coins-and-banknotes/coins/coins-images https://nbp.pl/banknoty-i-monety/monety/wizerunki-monet/ ; do
 echo "=== $u"; curl -sL -A "$UA" "$u" | grep -oE '(src|href|data-src|srcset)="[^"]+"' | grep -iE 'jpg|png|webp|gif|pdf|monet|coin' | sort -u | head -150
done
for c in "Category:Euro coins (common sides)" "Category:Euro coins of Germany" "Category:1 euro coins" "Category:2 euro coins" "Category:Coins of Poland" "Category:Circulating coins of Poland"; do
 echo "=== $c"; curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers&cmlimit=200&cmtitle=$(jq -rn --arg s "$c" '$s|@uri')" | jq -r '.query.categorymembers[]?.title'
done
for q in "1 euro coin common side" "2 euro coin common side" "euro coin Germany 1 euro" "5 zlotych 1994" "2 zlote 1995 coin" "1 zloty coin"; do
 echo "=== search: $q"; curl -s -A "$UA" "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=40&srsearch=$(jq -rn --arg s "$q" '$s|@uri')" | jq -r '.query.search[]?.title'
done
