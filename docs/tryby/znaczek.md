# Weryfikacja znaczków

Plik: `js/kinds/stamp.js` · rodzaj w rejestrze: `stamp`

**Obiekty:** prawdziwe znaczki w domenie publicznej. Zdjęcia: Wikimedia Commons („Pennyblack-pd.jpg”, „Znaczek Fi 1.jpg”, „Stamp Poland Mi3.jpg”, „PL Fi70 over DE Mi90.jpg”, „Poland 50h1919 1st.jpg”), przygotowane skryptem `tools/build-stamps.py` (usunięte tło albo samo przycięcie) do `js/real/stamp-*.js`.
Znaczek wybiera się na liście „Znaczek” (albo „Losowy znaczek”). Na stole leży 5 znaczków; 1–3 prawdziwe (Polska nr 1: 2–3).

| Znaczek | Druk | Brzeg | Znak wodny | Inne cechy |
|---|---|---|---|---|
| Penny Black (Wielka Brytania, 1840) | wklęsły (stalorytniczy), czarny | bez ząbkowania (cięty nożyczkami) | mała korona | litery kontrolne R–A (rząd A–T, kolumna A–L), czerwony krzyż maltański |
| Polska nr 1 (Królestwo Polskie, 1860) | typograficzny, niebieski i różowy | ząbkowanie 11½–12½ | brak | guma żółtawa |
| 10 fen. na 6 gr – Poczta Polska (Warszawa, 1918) | litografia, zielony; przedruk czarny | ząbkowanie 11½ | – | przedruk przesunięty w lewo (odmiana) |
| 10 fen. na 40 Pf Germania – Poczta Polska (Poznań, 1919) | typograficzny, czerwony i czarny; przedruk typograficzny | ząbkowanie 14 × 14½ | romby | „10” w narożnikach, kreska na „DEUTSCHES REICH” |
| 50 halerzy – Orzeł (1919) | litografia, niebieski | bez ząbkowania | brak | wydany bez gumy |

## Narzędzia
| Narzędzie | Znaczek | Widok | Warunek |
|---|---|---|---|
| Ząbkowanie (miarka) | Polska nr 1, Warszawa 1918, Poznań 1919 | dzienny | zoom ≥ ×2,5 na brzegu |
| Marginesy (brzegi) | Penny Black, orzeł 1919 | dzienny | zoom ≥ ×2,5 na brzegu |
| Znak wodny (kąpiel) | Penny Black, Poznań 1919 | kąpiel | zoom ≥ ×1,5 |
| Lampa UV (papier) | wszystkie | UV | – |
| Metoda druku (mikroskop) | wszystkie | dzienny | zoom ≥ ×6 |
| Litery kontrolne | Penny Black | dzienny | zoom ≥ ×3 na dolnym narożniku |
| Kasownik (mikroskop) | Penny Black | dzienny | zoom ≥ ×4 |
| Guma (odwrocie) | Polska nr 1 i znaczki z lat 1918–19 | odwrocie | zoom ≥ ×3 na brzegu |
| Przedruk (mikroskop) | Warszawa 1918, Poznań 1919 | dzienny | zoom ≥ ×6 na rysunku |
| Barwy i ich odcień | wszystkie | dzienny | zoom ≥ ×2 |

## Metody fałszerskie (profile)
| Profil | Znaczki | Zdradzają zawsze | Mogą zdradzać |
|---|---|---|---|
| Współczesne faksymile (druk cyfrowy) | wszystkie | druk, UV | znak wodny, kasownik / guma, ząbkowanie |
| Fałszerstwo z epoki (litografia) | Penny Black, Polska nr 1, Poznań 1919 | druk, barwy; Penny Black – litery; pozostałe – ząbkowanie | znak wodny |
| Oryginał z dorobionym marginesem | Penny Black, orzeł 1919 | marginesy, UV | znak wodny (spoina) |
| Prawdziwy znaczek z podrobionym kasownikiem | Penny Black | kasownik | UV |
| Oryginał z dorobioną gumą i poprawionym ząbkowaniem | Polska nr 1, Warszawa 1918, Poznań 1919, orzeł 1919 | guma (u orła: sama obecność gumy), ząbkowanie | – |
| Prawdziwy znaczek z podrobionym przedrukiem | Warszawa 1918, Poznań 1919 | przedruk (raster, płaska farba, inny odcień) | UV (przedruk świeci) |
