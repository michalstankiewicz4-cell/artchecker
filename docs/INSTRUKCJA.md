# Instrukcja obsługi – Bot odcisku

Wersja instrukcji odpowiada wersji programu **0.8.1**.

## 1. Co jest potrzebne

- Windows 10/11 (z kodu źródłowego działa też na macOS i Linuksie, ale `start.bat` jest tylko dla Windowsa).
- Wersja przenośna: nic więcej – Node.js jest w paczce. Z kodu źródłowego: [Node.js](https://nodejs.org/) 20 lub nowszy (sprawdzisz poleceniem `node -v`).
- Google Chrome (zalecany). Bez niego bot użyje Chromium, które Playwright dostarcza sam.
- Internet. Opcjonalnie lista serwerów proxy.

## 2. Pierwsze uruchomienie

**Wersja przenośna (zalecana):**
1. Wejdź na https://github.com/michalstankiewicz4-cell/webbot/releases/latest i pobierz plik `webbot-X.Y.Z-windows-portable.zip` (ok. 35 MB).
2. Rozpakuj go w dowolnym miejscu, np. na pulpicie (prawy przycisk → *Wyodrębnij wszystkie*). Nie uruchamiaj z wnętrza ZIP-a.
3. W rozpakowanym folderze kliknij dwukrotnie **`start.bat`**. Windows może zapytać, czy uruchomić plik z internetu – wybierz *Więcej informacji → Uruchom mimo to*.
4. Jeśli nie masz Google Chrome'a, raz uruchom **`pobierz-chromium.bat`** (pobiera ok. 150 MB) i odznaczaj w panelu „Użyj zainstalowanego Chrome'a”.

**Z kodu źródłowego:**
1. Pobierz projekt: `git clone https://github.com/michalstankiewicz4-cell/webbot` albo na GitHubie *Code → Download ZIP* i rozpakuj.
2. Wejdź do folderu projektu i kliknij dwukrotnie **`start.bat`**.
3. Za pierwszym razem pojawi się „Pierwsze uruchomienie: instaluje zaleznosci…”. Trwa to około minuty.

Dalej w obu przypadkach:
1. Panel otworzy się sam w przeglądarce pod adresem **http://127.0.0.1:3777/**. Obok nazwy widać numer wersji, np. `v0.2.0`.
2. **Nie zamykaj czarnego okna konsoli**, dopóki używasz bota: to ono steruje przeglądarkami. Bota wyłączasz, zamykając to okno albo naciskając w nim `Ctrl+C`.

Jeśli panel się nie otworzy, wpisz adres http://127.0.0.1:3777/ ręcznie.

## 3. Panel krok po kroku

Na górze są przyciski **Start** i **Stop** – widoczne zawsze, niezależnie od zakładki. Pod nimi dwie zakładki: **Plan** – co bot ma zrobić, i **Ustawienia** – jak ma wyglądać jego przeglądarka. Start bierze ustawienia z obu. Przy każdym polu jest podpowiedź (najedź myszą) i znaczek **[?]** – najedź na niego albo kliknij, żeby przeczytać dłuższy opis (Esc albo kliknięcie obok zamyka).

### Zakładka „Plan”

#### Wejścia i cel
- **Liczba wejść:** od 1 do 500. Jedno wejście trwa od kilkunastu sekund do kilku minut – zależnie od scenariusza.
- **Przerwa od–do:** losowa pauza między wejściami, w sekundach.
- **Adres strony:** pełny adres z `https://`, np. `https://przyklad.pl/`. Pole jest na starcie puste – wpisz stronę, na którą ma wchodzić bot.

#### Scenariusz
Lista akcji, które bot wykonuje **po kolei, od góry**, przy każdym wejściu zaraz po wczytaniu strony.

- **+ Dodaj akcję** – wybierz rodzaj z listy; akcja pojawi się na końcu.
- Rodzaj akcji zmienisz listą w wierszu. **↑ ↓** albo przeciągnięcie za uchwyt **⠿** zmienia kolejność, **⧉** powiela, **✕** usuwa.
- Nowy scenariusz zaczyna się od akcji „Ludzkie zachowanie”. Możesz ją usunąć.

| Akcja | Ustawienia | Co robi |
|---|---|---|
| **Pisz tekst** | tekst, dokąd | wpisuje tekst znak po znaku z ludzkim rytmem tam, gdzie jest kursor (jeśli nigdzie – w pierwsze widoczne pole tekstowe); nowa linia = Enter |
| **Naciśnij klawisze** | klawisz lub kombinacja, ile razy, dokąd | naciska np. Enter, Tab, Ctrl+F, Alt+← |
| **Kliknij w element** | selektor CSS | dojeżdża myszą i klika, np. w pole, w które potem będzie pisał |
| **Przewiń** | w dół / w górę, o ile px | przewija kółkiem myszy porcjami |
| **Czekaj** | od–do sekund | czeka losowo, lekko ruszając myszą |
| **Ludzkie zachowanie** | – | przez kilkanaście sekund zachowuje się jak czytający człowiek: 3–6 razy chwilę „czyta” (drobne ruchy myszy), przewija w dół – czasem wraca wyżej – i najeżdża myszą na link, nagłówek albo przycisk, niczego nie klikając |

**Klawisz lub kombinacja:** kliknij w pole z klawiszem i naciśnij kombinację na klawiaturze – zapisze się sama (np. `Ctrl+F`). Skróty, których przeglądarka nie oddaje stronie (np. Ctrl+W, Ctrl+T), wybierz z **listy** obok – są tam też klawisze nawigacji i edycji.

**Selektor CSS:** w Chrome kliknij element prawym przyciskiem → *Zbadaj*, potem na podświetlonym kodzie prawy przycisk → *Copy* → *Copy selector*. Przykłady: `#search`, `input[name=q]`, `textarea`. Bot czeka na element do 10 s.

**Dokąd** – przełącznik **Strona | Przeglądarka** w wierszu akcji, tuż przed strzałkami (tylko przy pisaniu i klawiszach):
- *Strona* – klawisze trafiają tylko do treści strony. Działa też bez okna i w tle, ale skróty przeglądarki (Ctrl+F, Ctrl+T, Alt+←, F5…) nic nie otworzą – strona zobaczy tylko samo naciśnięcie.
- *Przeglądarka* – klawisze idą do okna przeglądarki bota jak z prawdziwej klawiatury, więc działają też skróty przeglądarki (np. Ctrl+F otwiera okienko szukania). Wymaga widocznego okna (nie „Bez okna”), a w tym czasie nie można używać klawiatury ani myszy. **W wersji 0.6.0 ten tryb jest tylko w panelu – bot pomija takie akcje z informacją w dzienniku.**

Błąd jednej akcji (np. brak elementu) nie przerywa wejścia: trafia do dziennika i tabeli, a bot idzie do następnej akcji.

### Zakładka „Ustawienia”

#### Co zmieniać przy każdym wejściu
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


#### Przeglądarka
- **Użyj zainstalowanego Chrome'a:** zalecane. Odznacz, jeśli Chrome sprawia kłopoty (wtedy potrzebne jest Chromium z `pobierz-chromium.bat`).
- **Bez okna przeglądarki:** szybciej i bez otwierania okien, ale przeglądarka rysuje wtedy programowo, więc karta graficzna wygląda inaczej.

#### Proxy
- Wpisz jedno proxy na linię: `http://użytkownik:hasło@host:port` albo `socks5://host:port`.
- Każde kolejne wejście używa następnego proxy z listy; po ostatnim bot wraca do pierwszego.
- Linie zaczynające się od `#` są pomijane.
- Chrome nie obsługuje proxy SOCKS5 z hasłem, w takim przypadku użyj HTTP.
- **VPN** włączasz ręcznie w jego aplikacji, jeszcze przed startem. Bot go nie przełącza.

### Start i Stop (na górze)
- **Start** uruchamia serię wejść. Ustawienia są zablokowane, dopóki bot pracuje.
- **Stop** przerywa bieżące wejście i kończy serię. Wyniki zebrane do tej chwili zostają w raporcie.

## 4. Jak czytać wyniki

**Tabela „Wejścia”**, jeden wiersz na wejście:
- **Profil:** wylosowane ustawienia, czyli system, język, strefa czasowa, ekran, sprzęt, karta graficzna, motyw i liczba ukrytych czcionek.
- **Scenariusz:** ile akcji się udało (np. 5/6), ile znaków wpisano i w jakim tempie; na czerwono – pierwszy błąd akcji albo błąd całego wejścia (np. strona się nie wczytała).
- **Czas:** jak długo trwało wejście.

**Dziennik** pokazuje na bieżąco każdy krok: profil, każdą akcję scenariusza (np. wpisany tekst z tempem, naciśnięte klawisze), wynik, przerwy i błędy.

## 5. Raporty

Każda seria zapisuje dwa pliki w folderze **`reports`** w katalogu projektu. Linki do nich są też pod tabelą w panelu.

- **`wejscia-…csv`** otwiera się w Excelu (separatorem jest średnik). Jeden wiersz to jedno wejście; kolumny opisuje [dokumentacja](DOKUMENTACJA.md#8-raporty).
- **`wejscia-…json`** zawiera komplet danych: ustawienia serii, pełny profil, wszystkie cechy odczytane przez stronę i szczegóły ruchu myszy z testu.

Oba pliki są uzupełniane po każdym wejściu, więc przerwanie serii nie kasuje wyników.

## 6. Kłopoty i rozwiązania

| Objaw | Co zrobić |
|---|---|
| „Nie znaleziono Node.js” | Pobierz wersję przenośną z Releases albo zainstaluj Node.js. |
| Panel pisze „brak połączenia z serwerem” | Okno konsoli zostało zamknięte. Uruchom `start.bat` jeszcze raz. |
| `EADDRINUSE` w konsoli | Bot już działa w innym oknie. Zamknij je albo przed `npm start` wpisz `set PORT=4000` i otwórz http://127.0.0.1:4000/. |
| „Executable doesn't exist…” | Brak Chrome'a i Chromium. Uruchom `pobierz-chromium.bat` w folderze programu. |
| Błąd wejścia `net::ERR_PROXY_CONNECTION_FAILED` | To proxy nie działa. Usuń je z listy. |
| „test … nie został ukończony” w dzienniku | Bot chybił kółko. Seria toczy się dalej, w tym wejściu po prostu nie będzie werdyktu. |
| „nie znaleziono elementu …” / „na stronie nie ma pola tekstowego” | Sprawdź selektor albo czy element jest widoczny bez klikania czegoś wcześniej. Wejście idzie dalej, bez tej akcji. |
| Tekst trafia w złe miejsce | Przed „Pisz tekst” dodaj „Kliknij w element” z selektorem pola. |
| Ctrl+F (lub inny skrót przeglądarki) nic nie otwiera | W trybie „Strona” to normalne. Tryb „Przeglądarka” zostanie podłączony w kolejnej wersji. |
| „tryb »Przeglądarka« nie jest jeszcze podłączony” w dzienniku | Jak wyżej – zmień akcję na „Strona” albo poczekaj na kolejną wersję. |

## 7. Aktualizacja

Wersja przenośna: pobierz nowy ZIP z Releases, rozpakuj obok starego i przenieś do niego folder `reports`, żeby zachować stare raporty. Z kodu źródłowego: `git pull`, potem `npm install`. Co się zmieniło w nowej wersji, opisuje [CHANGELOG.md](../CHANGELOG.md).
