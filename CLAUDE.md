# Zasady dla tego repo

- Projekt po polsku: panel, komunikaty, dziennik, dokumentacja i commity.
- Nie dodawaj własnych pomysłów bez pytania; proponuj je autorowi.
- Program działa tylko lokalnie: serwer nasłuchuje wyłącznie na `127.0.0.1`, bez telemetrii, bez wysyłania danych gdziekolwiek poza wejściami bota na wskazaną stronę (i przez podane proxy). Foldery `reports/` i `obrazy/` nie trafiają do repo.

## Wersjonowanie – przy KAŻDEJ zmianie

1. Podnieś `version` w `package.json` (SemVer: PATCH poprawka, MINOR nowa funkcja, MAJOR zmiana niezgodna z wcześniejszymi raportami lub API). To jedyne źródło wersji w kodzie.
2. Dodaj wpis na górze `CHANGELOG.md` (`## [X.Y.Z] – RRRR-MM-DD`, sekcje Dodane / Zmienione / Poprawione / Usunięte).
3. Zmień numer `**X.Y.Z**` w `README.md`, `docs/DOKUMENTACJA.md` i `docs/INSTRUKCJA.md`.
4. Zaktualizuj treść wszystkich dokumentów, których zmiana dotyczy (dokumentacja techniczna, instrukcja, README).
5. Uruchom `npm test` – musi zwrócić OK.
6. Commit z numerem wersji na początku opisu, np. `v0.3.0: …`. Tagów git nie tworzymy lokalnie – tag `vX.Y.Z` powstaje tylko przy publikacji release'u na GitHubie.
7. Release **tylko na wyraźną prośbę autora** – samo podniesienie wersji go nie oznacza. Wtedy po wypchnięciu zmian uruchom automat *Actions → „Wydanie” → Run workflow* – sam zbuduje paczkę i opublikuje release `vX.Y.Z` (szczegóły: `docs/DOKUMENTACJA.md`, sekcja 11).

## Struktura

- `server.mjs` – serwer i pętla wejść; `bot/` – logika bota (jeden plik = jedna rola); `public/` – panel; `tools/` – narzędzia deweloperskie.
- Bot nie zależy od żadnej konkretnej strony – działa na dowolnym adresie podanym w panelu.
