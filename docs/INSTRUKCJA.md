# Instrukcja obsługi – Bot odcisku

Wersja instrukcji odpowiada wersji programu **0.2.0**.

## 1. Co jest potrzebne

- Windows 10/11 (działa też na macOS i Linuksie, ale `start.bat` jest tylko dla Windowsa).
- [Node.js](https://nodejs.org/) w wersji 20 lub nowszej. Sprawdzisz to w terminalu poleceniem `node -v`.
- Google Chrome (zalecany). Bez niego bot użyje Chromium, które Playwright dostarcza sam.
- Internet. Opcjonalnie lista serwerów proxy.

## 2. Pierwsze uruchomienie

1. Pobierz projekt: `git clone https://github.com/michalstankiewicz4-cell/webbot` albo na GitHubie *Code → Download ZIP* i rozpakuj.
2. Wejdź do folderu projektu i kliknij dwukrotnie **`start.bat`**.
3. Za pierwszym razem pojawi się „Pierwsze uruchomienie: instaluje zaleznosci…”. Trwa to około minuty.
4. Panel otworzy się sam w przeglądarce pod adresem **http://127.0.0.1:3777/**. Obok nazwy widać numer wersji, np. `v0.2.0`.
5. **Nie zamykaj czarnego okna konsoli**, dopóki używasz bota: to ono steruje przeglądarkami. Bota wyłączasz, zamykając to okno albo naciskając w nim `Ctrl+C`.

Jeśli panel się nie otworzy, wpisz adres http://127.0.0.1:3777/ ręcznie.

## 3. Panel krok po kroku

### Cel i liczba wejść
- **Adres strony:** domyślnie „Cyfrowy odcisk człowieka”. Bot zakłada układ tej strony (zakładki, test „Człowiek czy bot”, odcisk przeglądarki), więc z innymi stronami nie zadziała.
- **Liczba wejść:** od 1 do 500. Jedno wejście trwa zwykle 40–70 sekund.
- **Przerwa od–do:** losowa pauza między wejściami, w sekundach.

### Co zmieniać przy każdym wejściu
Zaznaczone grupy są losowane od nowa przy każdym wejściu. Odznaczona grupa zostaje taka, jak w Twojej prawdziwej przeglądarce.

| Pole | Co robi |
|---|---|
| System i User-Agent | udaje Windows, macOS albo Linuksa |
| Język | inny język przeglądarki |
| Strefa czasowa | inna strefa, dobrana do języka |
| Ekran i okno | inna rozdzielczość, skalowanie i rozmiar okna |
| Rdzenie i pamięć RAM | inna liczba rdzeni i ilość pamięci |
| Karta graficzna (WebGL) | inny model karty, pasujący do systemu |
| Szum na płótnie | inny skrót „canvas” |
| Ukrywanie części czcionek | strona widzi mniej czcionek |
| Motyw, animacje, „nie śledź” | jasny lub ciemny motyw i inne preferencje |

Aby sprawdzić, która cecha najbardziej zmienia odcisk, odznacz wszystkie poza jedną i zrób kilka wejść.

### Zachowanie
- **Przewijanie i klikanie:** bot przewija stronę i odwiedza 2–4 losowe zakładki, zanim przejdzie do odcisku.
- **Test „Człowiek czy bot”:** bot sam wykonuje ten test ruchem myszy podobnym do ludzkiego, a panel pokazuje werdykt strony.
- **Użyj zainstalowanego Chrome'a:** zalecane. Odznacz, jeśli Chrome sprawia kłopoty.
- **Bez okna przeglądarki:** szybciej i bez otwierania okien, ale przeglądarka rysuje wtedy programowo, więc karta graficzna wygląda inaczej.

### Proxy
- Wpisz jedno proxy na linię: `http://użytkownik:hasło@host:port` albo `socks5://host:port`.
- Każde kolejne wejście używa następnego proxy z listy; po ostatnim bot wraca do pierwszego.
- Linie zaczynające się od `#` są pomijane.
- Chrome nie obsługuje proxy SOCKS5 z hasłem, w takim przypadku użyj HTTP.
- **VPN** włączasz ręcznie w jego aplikacji, jeszcze przed startem. Bot go nie przełącza.

### Start i Stop
- **Start** uruchamia serię wejść. Ustawienia są zablokowane, dopóki bot pracuje.
- **Stop** przerywa bieżące wejście i kończy serię. Wyniki zebrane do tej chwili zostają w raporcie.

## 4. Jak czytać wyniki

**Tabela „Wejścia”**, jeden wiersz na wejście:
- **Profil:** wylosowane ustawienia, czyli system, język, strefa czasowa, ekran, sprzęt, karta graficzna, motyw i liczba ukrytych czcionek.
- **Odcisk ze strony:** skrót, który policzyła strona.
  - **nowy:** strona w tej serii jeszcze takiego odcisku nie widziała.
  - **powtórzony:** taki odcisk już był.
- **Człowiek czy bot:** liczba oznak bota (z 5) i werdykt strony. Od 3 oznak strona uznaje, że to bot.
- **Czas:** jak długo trwało wejście.

Pod tabelą jest podsumowanie „Różnych odcisków: X z Y”.

**Dziennik** pokazuje na bieżąco każdy krok: profil, odwiedzone zakładki, wynik, przerwy i błędy.

## 5. Raporty

Każda seria zapisuje dwa pliki w folderze **`reports`** w katalogu projektu. Linki do nich są też pod tabelą w panelu.

- **`wejscia-…csv`** otwiera się w Excelu (separatorem jest średnik). Jeden wiersz to jedno wejście; kolumny opisuje [dokumentacja](DOKUMENTACJA.md#8-raporty).
- **`wejscia-…json`** zawiera komplet danych: ustawienia serii, pełny profil, wszystkie cechy odczytane przez stronę i szczegóły ruchu myszy z testu.

Oba pliki są uzupełniane po każdym wejściu, więc przerwanie serii nie kasuje wyników.

## 6. Kłopoty i rozwiązania

| Objaw | Co zrobić |
|---|---|
| `'node' is not recognized…` | Zainstaluj Node.js i uruchom `start.bat` ponownie. |
| Panel pisze „brak połączenia z serwerem” | Okno konsoli zostało zamknięte. Uruchom `start.bat` jeszcze raz. |
| `EADDRINUSE` w konsoli | Bot już działa w innym oknie. Zamknij je albo przed `npm start` wpisz `set PORT=4000` i otwórz http://127.0.0.1:4000/. |
| „Executable doesn't exist…” | Odznaczony jest Chrome i brakuje Chromium. Uruchom `npx playwright install chromium` w folderze projektu. |
| Błąd wejścia `net::ERR_PROXY_CONNECTION_FAILED` | To proxy nie działa. Usuń je z listy. |
| „test … nie został ukończony” w dzienniku | Bot chybił kółko. Seria toczy się dalej, w tym wejściu po prostu nie będzie werdyktu. |
| Odcisk się powtarza | Sprawdź, czy zaznaczone są „Szum na płótnie” i „Karta graficzna”. Bez nich odcisk zmienia się rzadziej. |

## 7. Aktualizacja

W folderze sklonowanym przez git: `git pull`, a potem `npm install`. Jeśli pobierałeś ZIP, pobierz nowy i przenieś do niego swój folder `reports`, żeby zachować stare raporty. Co się zmieniło w nowej wersji, opisuje [CHANGELOG.md](../CHANGELOG.md).
