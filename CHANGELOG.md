# Historia zmian

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), numeracja: [SemVer](https://semver.org/lang/pl/). Najnowsza wersja na górze.

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
