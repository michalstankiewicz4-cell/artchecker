# Historia zmian

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), numeracja: [SemVer](https://semver.org/lang/pl/). Najnowsza wersja na górze.

## [0.18.0] – 2026-11-06

### Dodane
- Akcja **„Znajdź pozycję”** (`bot/rank.mjs`): po wyszukaniu frazy czyta wyniki, przewija i przechodzi na kolejne strony wyników, aż znajdzie domenę – **bez wchodzenia na nią**. Selektory wyników i „następnej strony” (domyślnie Google) można zmienić dla innej wyszukiwarki. CAPTCHA przerywa sprawdzanie (bot jej nie obchodzi).
- Trzeci panel w Statystykach **„Pozycje w wynikach”**: ostatnia / najlepsza / średnia pozycja, liczba sprawdzeń, mały wykres i historia ostatnich 50 sprawdzeń; zapis w `reports/pozycje.csv`, API `GET /api/ranks`, zdarzenie SSE `rank`.
- Pozycje w tabeli „Wejścia” i w raporcie JSON (`ranks`).
- Gotowy profil **„Pozycja ipscanner w Google”**: fraza „osint”, domena ipscanner.pl, do 10 stron, język i strefa czasowa bez losowania.

## [0.17.1] – 2026-11-06

### Zmienione
- Opis wydania na GitHubie zawiera wszystkie zmiany od poprzedniego wydania (automat podaje jego tag w `PREV`), a nie tylko z ostatniej wersji.
- Wersja przenośna zawiera też `obrazy/`, `elementy.json` i `profile/`, jeśli są w repozytorium.

### Poprawione
- README, instrukcja i CLAUDE.md: cztery zakładki, profile, Zapisz i Reset w opisie górnego paska.

## [0.17.0] – 2026-11-06

### Zmienione
- Ikonki przy przyciskach Start (▶), Stop (■), Zapisz i Reset oraz przy zakładkach Plan, Ustawienia, Statystyki i Biblioteka (ikonka wybranej zakładki w kolorze akcentu).
- Styl „kolorowych opcji” w całym panelu: wszystkie pola wyboru mają delikatne tło i pasek z lewej w kolorze grupy (niezależne – szary, w legendzie nowy kolor „niezależne”); ten sam pasek mają wiersze scenariusza, karty i wiersze Biblioteki oraz wzorce w akcjach.

### Poprawione
- Opcja „Użyj zainstalowanego Chrome'a” nie łamie się już na dwie linie.

## [0.16.0] – 2026-11-06

### Dodane
- **Profile** przy przycisku Start: lista zapisanych zestawów ustawień (wszystko z Planu i Ustawień); wybór z listy wczytuje profil.
- Po prawej **💾 Zapisz** (pyta o nazwę; ta sama nazwa nadpisuje) i **↺ Reset** (ustawienia domyślne, dwa kliknięcia).
- Folder `profile/` (jeden plik JSON na profil, trafia do repozytorium); API `GET/POST /api/profiles`, `GET /api/profiles/<nazwa>`.

## [0.15.0] – 2026-11-06

### Dodane
- Czwarta zakładka **„Biblioteka”**: obrazy z folderu `obrazy/` i nazwane elementy (nazwa + selektor CSS) w pliku `elementy.json`.
- Przy każdej pozycji: dodawanie, zmiana nazwy (przenoszona do akcji), usuwanie, podgląd w pełnym rozmiarze, „gdzie użyty” i **„Sprawdź na stronie”** (zrzut strony z Planu z żółtą ramką i % dopasowania albo liczbą pasujących elementów).
- W akcjach myszy przy miejscu „element” – wybór elementu z Biblioteki albo własny selektor; selektor z Biblioteki działa we wszystkich akcjach naraz.
- API: `POST /api/images/rename`, `POST /api/images/delete`, `GET/POST /api/elements`, `POST /api/check`.

### Zmienione
- Plik `elementy.json` trafia do repozytorium (tak jak `obrazy/`).

## [0.14.0] – 2026-11-06

### Dodane
- Działa **tryb „Przeglądarka”** (tylko Windows, z widocznym oknem) dla pisania, klawiszy i wszystkich akcji myszy: prawdziwa klawiatura i kursor przez PowerShell i user32 (`bot/osinput.mjs`). Działają skróty przeglądarki (Ctrl+F, Ctrl+L, Alt+← …) i jej przyciski.
- Zgranie kursora ze stroną (`bot/surface.mjs`): dwa ludzkie ruchy myszy na początku, przeliczenie punktów strony na ekran z uwzględnieniem skalowania Windowsa; okno bota wraca na wierzch przed każdą akcją.
- W tym trybie obraz jest szukany na zrzucie całego okna (także przyciski przeglądarki), a „Pisz tekst” pisze tam, gdzie jest kursor tekstowy (np. okienko Ctrl+F).

### Zmienione
- Podpowiedzi przełącznika Strona / Przeglądarka i instrukcja – bez „w przygotowaniu”.

## [0.13.0] – 2026-11-06

### Dodane
- Działają akcje myszy w trybie „Strona”: **Najedź myszą** (z postojem i drżeniem ręki), **Kliknij** (lewy / prawy / środkowy, pojedyncze / podwójne, × N, element / punkt / obraz), **Przeciągnij**, **Zaznacz tekst** (słowo, akapit, fragment – w dzienniku zaznaczony tekst), **Przewiń nad elementem**.
- Działa **szukanie obrazu** (`bot/image.mjs`, bez dodatkowych bibliotek): zrzut strony, porównanie w szarości / kolorach / na krawędziach, różne skale, kilka wzorców, próg, czas szukania i „gdy brak” (pomiń / przewijaj i szukaj / błąd).
- Wpis „pominięto” w dzienniku, gdy obrazu nie ma, a ustawione jest „pomiń” – bez błędu akcji.

### Zmienione
- Akcje myszy wydzielone do `bot/mouse.mjs`. Tryb „Przeglądarka” nadal tylko w panelu.

## [0.12.0] – 2026-11-06

### Dodane
- Numer wersji przy nazwie „Human Bot” widoczny zawsze – także w podglądzie bez serwera (plik, GitHub Pages). Stoi w `public/index.html`; zgodność pilnuje `npm test`.

## [0.11.1] – 2026-11-06

### Zmienione
- Folder `obrazy/` (wzorce do szukania) trafia do repozytorium – usunięty z `.gitignore`.

## [0.11.0] – 2026-11-06

### Dodane
- Miejsce **„obraz”** w akcjach myszy: bot ma szukać na zrzucie strony wyciętego fragmentu (wzorca) i trafić w niego.
- Okienko **„✂ Nowy…”**: zrzut strony z zakładki Plan, wczytanie pliku albo wklejenie obrazka (Ctrl+V), zaznaczenie prostokąta myszą, zapis jako PNG w folderze `obrazy/`.
- Ustawienia szukania: kilka wzorców jako alternatywy, próg podobieństwa, czas szukania, co zrobić, gdy brak (pomiń / przewijaj i szukaj / błąd), sposób porównywania (szarość / kolory / krawędzie), różne skale.
- API: `GET/POST /api/images`, `POST /api/shot`, pliki `/obrazy/…`.

### Zmienione
- Folder `obrazy/` nie trafia do repozytorium (`.gitignore`).
- Szukanie obrazu w bocie jeszcze nie jest podłączone – takie akcje są pomijane z wpisem w dzienniku.

## [0.10.0] – 2026-11-06

### Dodane
- Akcje myszy w panelu: **„Najedź myszą”** (element, punkt w % okna albo losowo; postój), **„Przeciągnij”** (z miejsca do miejsca), **„Zaznacz tekst”** (słowo, akapit albo fragment).
- **„Kliknij”**: miejsce – element albo punkt, przycisk lewy / prawy / środkowy, pojedyncze lub podwójne, liczba powtórzeń.
- **„Przewiń”**: całą stronę albo nad wskazanym elementem.
- Przełącznik Strona / Przeglądarka także przy akcjach myszy (z osobnymi opisami).
- Bot przyjmuje nowe ustawienia, ale nowe akcje i warianty pomija z wpisem w dzienniku, dopóki nie zostaną podłączone.

### Zmienione
- „Kliknij w element” nazywa się teraz **„Kliknij”**; w API pola `at`, `x`, `y`, `button`, `count`, `times`, `target` (stary format bez `at` jest traktowany jak element).
- Wiersze akcji myszy zawijają pola do kolejnych linii.

## [0.9.1] – 2026-11-06

### Zmienione
- Przyciski przełącznika „Strona | Przeglądarka” mają dokładnie wielkość przycisków ↑ ↓ ⧉ ✕ i stoją z nimi w jednej linii.

## [0.9.0] – 2026-11-06

### Dodane
- Trzecia zakładka **„Statystyki”** – przeniesione do niej tabela „Wejścia” i „Dziennik”.
- Przełącznik motywu **dzień / noc** obok nazwy (zapamiętywany; bez wyboru – zgodnie z systemem).
- Oznaczenie konfliktu z „Bez okna przeglądarki”: opcja, akcje w trybie „Przeglądarka” i ich przełącznik na żółto ze znakiem ⚠, ⚠ także przy nazwach zakładek.
- Kolory opcji zależnych od siebie w „Co zmieniać przy każdym wejściu” (system + karta graficzna, język + strefa czasowa) z legendą.
- Tryb podglądu panelu poza komputerem użytkownika: bez połączenia z serwerem, Start nieaktywny. Automat „Deploy static content to Pages” publikuje sam folder `public/` na <https://michalstankiewicz4-cell.github.io/webbot/>.

### Zmienione
- Nazwa programu: **Human Bot** (wcześniej „Bot odcisku”); pakiet `human-bot`.
- Akcja „Ludzkie zachowanie” nazywa się teraz **„Szum”** (typ `noise` w API, wcześniej `human`).
- Kolejność opcji w „Co zmieniać…”: zależne od siebie stoją obok siebie.
- Przełącznik „Strona | Przeglądarka” ma wielkość przycisków ↑↓ i stoi przy prawej krawędzi wiersza.

### Poprawione
- Pusta ramka obok nazwy, gdy wersja nie była jeszcze znana.

## [0.8.2] – 2026-11-06

### Zmienione
- Przełącznik „Strona | Przeglądarka” pokazuje ikonki (kartka z tekstem / okno przeglądarki) zamiast napisów; opis każdej opcji jest w podpowiedzi po najechaniu myszą.

## [0.8.1] – 2026-11-06

### Zmienione
- Przełącznik „Strona | Przeglądarka” jest teraz zwartym przyciskiem w wierszu akcji, tuż przed strzałkami ↑ ↓ (zamiast w osobnej linii pod polami); pola akcji mieszczą się w jednym wierszu.

## [0.8.0] – 2026-11-06

### Zmienione
- Bot jest niezależny od strony „Cyfrowy odcisk człowieka”: działa na dowolnym adresie i nie wykonuje na żadnej stronie kroków przygotowanych pod tamten projekt.
- Pole „Adres strony” jest na starcie puste (z przykładem w podpowiedzi).
- Raport CSV: zamiast cech odczytanych przez tamtą stronę – wylosowane cechy przeglądarki z profilu: `os`, `userAgent`, `languages`, `timezone`, `screen`, `scale`, `viewport`, `cores`, `memoryGB`, `webgl`, `canvasSeed`, `hiddenFonts`, `colorScheme`.

### Usunięte
- Odczyt odcisku przeglądarki ze strony „Cyfrowy odcisk człowieka” na końcu wejścia, kolumna „Odcisk ze strony” w tabeli (z oznaczeniem „nowy/powtórzony”) i podsumowanie „Różnych odcisków”.
- Kolumny raportu `hash`, `ua`, `platform`, `lang`, `tz`, `cpu`, `mem`, `canvas`, `fonts` oraz pola JSON `features` i `newHash`.

## [0.7.0] – 2026-11-06

### Dodane
- Akcja **„Ludzkie zachowanie”**: przez kilkanaście sekund 3–6 rund „czytania” (drobne ruchy myszy) i przewijania, czasem powrót wyżej i najechanie myszą na link, nagłówek albo przycisk – bez klikania. Działa na każdej stronie; jest domyślną akcją nowego scenariusza.

### Usunięte
- Akcja „Test »Człowiek czy bot«” i wszystko, co z nią związane: kolumna w tabeli panelu, kolumny raportu `botSigns`, `botVerdict` i pole `botMetrics` w JSON.
- Akcja „Przeglądaj losowo” razem z klikaniem w zakładki strony „Cyfrowy odcisk człowieka” – zastąpiona przez „Ludzkie zachowanie”.

## [0.6.0] – 2026-11-06

### Dodane
- **Scenariusz** w zakładce Plan: lista akcji wykonywanych po kolei po wczytaniu strony. „+ Dodaj akcję”, zmiana rodzaju, kolejność strzałkami ↑ ↓ i przeciąganiem za uchwyt ⠿, powielanie ⧉, usuwanie ✕, sprawdzanie niewypełnionych akcji przed startem.
- Akcje: **Pisz tekst**, **Naciśnij klawisze** (nagrywanie kombinacji z klawiatury albo lista ok. 30 klawiszy i skrótów, liczba powtórzeń), **Kliknij w element** (selektor CSS), **Przewiń**, **Czekaj**, **Przeglądaj losowo**, **Test „Człowiek czy bot”**.
- Przy pisaniu i klawiszach wybór „dokąd”: **Strona** albo **Przeglądarka** (klawisze na poziomie Windowsa – działają skróty przeglądarki). Tryb „Przeglądarka” jest na razie tylko w panelu; bot pomija takie akcje z informacją w dzienniku.
- Raport: kolumny `actions`, `actionsDone`, `actionError`; w tabeli panelu kolumna „Scenariusz”.

### Zmienione
- Start i Stop są na górze, nad zakładkami (zawsze widoczne).
- „Przewijanie i klikanie” i „Test »Człowiek czy bot«” są teraz akcjami scenariusza (domyślnie w nowym scenariuszu).
- Podglądany bez serwera panel (otwarty jako plik) pokazuje „podgląd bez serwera – Start nieaktywny”.

### Usunięte
- Pole „Tekst do wpisania”, wybór „Pisz od razu / We wskazane pole” i „Naciśnij Enter po wpisaniu” – zastąpione akcjami „Pisz tekst”, „Kliknij w element” i „Naciśnij klawisze”.
- Kolumna raportu `typingError` (zastąpiona przez `actionError`).

## [0.5.0] – 2026-11-06

### Dodane
- Pisanie tekstu jak człowiek: pole „Tekst do wpisania” w panelu. Bot wpisuje znak po znaku z nierównymi odstępami (rozkład log-normalny, szybciej w częstych parach liter, dłużej po spacji i interpunkcji, czasem chwila namysłu) i przytrzymaniem klawisza. Polskie znaki są „naciskane” jak na polskiej klawiaturze (zdarzenia keydown/keyup), nowa linia = Enter.
- Wybór „Gdzie pisać”: *Pisz od razu* (w pole aktywne po wczytaniu strony, a gdy żadne nie jest aktywne – w pierwsze widoczne pole tekstowe) albo *We wskazane pole* (selektor CSS).
- „Naciśnij Enter po wpisaniu” – np. wysłanie wyszukiwania lub formularza.
- Podpowiedzi przy każdym polu (po najechaniu myszą) i znaczki [?] z dłuższymi opisami (najechanie, klawiatura albo kliknięcie; Esc zamyka).
- Zakładki panelu: **Plan** (co bot ma zrobić) i **Ustawienia** (co zmieniać w przeglądarce, przeglądarka, proxy).
- Raport: kolumny `typedChars`, `typingMs`, `cpm` (znaki na minutę) i `typingError`; w tabeli panelu kolumna „Pisanie”.

### Zmienione
- „Liczba wejść” i przerwy są teraz nad adresem strony.
- Na stronach innych niż „Cyfrowy odcisk człowieka” bot pomija zakładki, test „Człowiek czy bot” i odczyt odcisku (zamiast zgłaszać błąd) i tylko przewija stronę.
- Błąd pisania (np. brak pola) nie przerywa wejścia – jest zapisany osobno, a dalsze kroki idą normalnie.

## [0.4.0] – 2026-11-06

### Dodane
- Automat wydań w GitHub Actions (`.github/workflows/release.yml`, „Wydanie”): po kliknięciu *Run workflow* buduje na serwerach GitHuba wersję przenośną dla Windowsa i publikuje release `vX.Y.Z` z ZIP-em i opisem. Nie trzeba niczego budować ani wgrywać ręcznie.
- `tools/release-notes.mjs` – opis release'u z instrukcją pobierania i wpisem z CHANGELOG.

## [0.3.0] – 2026-11-06

### Dodane
- Wersja przenośna dla Windowsa (`webbot-X.Y.Z-windows-portable.zip` w Releases na GitHubie): kod, zależności, Node.js i cała dokumentacja (wszystkie pliki `.md`) w jednym ZIP-ie – rozpakuj i uruchom `start.bat`, bez instalowania czegokolwiek.
- `tools/build-portable.ps1` – budowa tej paczki.
- `pobierz-chromium.bat` – pobranie Chromium, gdy nie ma Google Chrome'a.

### Zmienione
- `start.bat` używa `node\node.exe` z wersji przenośnej, jeśli jest; bez Node.js pokazuje, skąd go wziąć.
- Instrukcja i README: pobieranie z Releases; dokumentacja: sekcja 11 o wydaniach.

## [0.2.0] – 2026-11-06

### Dodane
- Numer wersji w panelu obok nazwy, w konsoli przy starcie i w raporcie JSON (`config.version`); jedynym źródłem jest `package.json` (`GET /api/info`).
- Dokumentacja techniczna `docs/DOKUMENTACJA.md` i instrukcja obsługi `docs/INSTRUKCJA.md`.
- Ta historia zmian.
- `npm test` sprawdza, czy numer wersji zgadza się we wszystkich plikach (`tools/check-version.mjs`).
- Zasady pracy nad projektem w `CLAUDE.md`.

## [0.1.0] – 2026-11-06

### Dodane
- Panel w przeglądarce (`127.0.0.1:3777`) z ustawieniami, tabelą wejść i dziennikiem na żywo.
- Nowa przeglądarka i losowy, spójny profil przy każdym wejściu: system i User-Agent, język ze strefą czasową, ekran, rdzenie i RAM, karta graficzna (WebGL), szum na płótnie, ukrywanie części czcionek, motyw i preferencje.
- Ludzki ruch myszy (krzywe, przyspieszanie, drżenie, przestrzelenia), kliknięcia z przytrzymaniem, przewijanie z przerwami.
- Przeglądanie losowych zakładek, wykonanie testu „Człowiek czy bot” i odcisku przeglądarki na stronie „Cyfrowy odcisk człowieka”, odczyt wyników.
- Proxy z listy, po kolei przy kolejnych wejściach.
- Raporty CSV i JSON w `reports/`, zapisywane po każdym wejściu.
- `start.bat` – instalacja i uruchomienie jednym kliknięciem.
