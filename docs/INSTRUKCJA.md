# Instrukcja obsługi – Human Bot

Wersja instrukcji odpowiada wersji programu **0.12.0**.

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

Na górze są przyciski **Start** i **Stop** – widoczne zawsze, niezależnie od zakładki. Pod nimi trzy zakładki: **Plan** – co bot ma zrobić, **Ustawienia** – jak ma wyglądać jego przeglądarka, i **Statystyki** – tabela wejść i dziennik. Start bierze ustawienia z Planu i Ustawień. Przycisk **☾ Noc / ☀ Dzień** obok nazwy przełącza motyw panelu (wybór jest zapamiętywany; bez wyboru panel idzie za ustawieniem systemu). Przy każdym polu jest podpowiedź (najedź myszą) i znaczek **[?]** – najedź na niego albo kliknij, żeby przeczytać dłuższy opis (Esc albo kliknięcie obok zamyka).

### Zakładka „Plan”

#### Wejścia i cel
- **Liczba wejść:** od 1 do 500. Jedno wejście trwa od kilkunastu sekund do kilku minut – zależnie od scenariusza.
- **Przerwa od–do:** losowa pauza między wejściami, w sekundach.
- **Adres strony:** pełny adres z `https://`, np. `https://przyklad.pl/`. Pole jest na starcie puste – wpisz stronę, na którą ma wchodzić bot.

#### Scenariusz
Lista akcji, które bot wykonuje **po kolei, od góry**, przy każdym wejściu zaraz po wczytaniu strony.

- **+ Dodaj akcję** – wybierz rodzaj z listy; akcja pojawi się na końcu.
- Rodzaj akcji zmienisz listą w wierszu. **↑ ↓** albo przeciągnięcie za uchwyt **⠿** zmienia kolejność, **⧉** powiela, **✕** usuwa.
- Nowy scenariusz zaczyna się od akcji „Szum”. Możesz ją usunąć.

| Akcja | Ustawienia | Co robi |
|---|---|---|
| **Pisz tekst** | tekst, dokąd | wpisuje tekst znak po znaku z ludzkim rytmem tam, gdzie jest kursor (jeśli nigdzie – w pierwsze widoczne pole tekstowe); nowa linia = Enter |
| **Naciśnij klawisze** | klawisz lub kombinacja, ile razy, dokąd | naciska np. Enter, Tab, Ctrl+F, Alt+← |
| **Najedź myszą** | miejsce (element, punkt, losowo), postój w s, dokąd | dojeżdża kursorem i chwilę stoi, niczego nie klikając – np. żeby rozwinąć menu albo pokazać podpowiedź ¹ |
| **Kliknij** | miejsce (element, punkt), przycisk (lewy, prawy, środkowy), pojedyncze / podwójne, ile razy, dokąd | dojeżdża myszą i klika, np. w pole, w które potem będzie pisał ² |
| **Przeciągnij** | z miejsca, do miejsca, dokąd | wciska lewy przycisk, przesuwa kursor i puszcza – suwaki, przenoszenie elementów ¹ |
| **Zaznacz tekst** | słowo (2× klik), akapit (3× klik) albo fragment (przeciągnięcie od–do); miejsce, dokąd | zaznacza tekst jak człowiek podczas czytania ¹ |
| **Przewiń** | w dół / w górę, o ile px, całą stronę albo nad elementem, dokąd | przewija kółkiem myszy porcjami; „nad elementem” – listy i okienka przewijane osobno od strony ² |
| **Czekaj** | od–do sekund | czeka losowo, lekko ruszając myszą |
| **Szum** | – | przez kilkanaście sekund zachowuje się jak czytający człowiek: 3–6 razy chwilę „czyta” (drobne ruchy myszy), przewija w dół – czasem wraca wyżej – i najeżdża myszą na link, nagłówek albo przycisk, niczego nie klikając |

¹ W wersji 0.11.0 tylko w panelu – bot pomija tę akcję z informacją w dzienniku.
² Działa wariant podstawowy (miejsce: element): *Kliknij* – element, lewy przycisk, pojedyncze, ×1; *Przewiń* – cała strona. Pozostałe warianty bot na razie pomija z informacją w dzienniku.

**Miejsce dla myszy:** lista w wierszu – *element* (selektor CSS; bot wybiera w nim losowy punkt), *punkt* (x i y w % szerokości i wysokości okna; 0,0 = lewy górny róg, 50,50 = środek) *obraz* (bot szuka na zrzucie strony wyciętego fragmentu – patrz niżej) albo – przy „Najedź myszą” – *losowo* (dowolne miejsce w widocznej części okna).

**Obraz jako miejsce** ¹ – zamiast selektora wskazujesz wycinek, np. przycisk albo ikonkę; bot trafia w losowe miejsce znalezionego fragmentu:
- **✂ Nowy…** otwiera okienko: **📷 Zrób zrzut strony** (bot otwiera stronę z zakładki Plan, bez zmiany odcisku), **📁 Wczytaj plik** albo wklej obrazek (Ctrl+V). Zaznacz myszą prostokąt, nadaj nazwę i **Zapisz w obrazy/** – wycinek trafia jako PNG do folderu `obrazy` obok programu i od razu do akcji.
- **+ z folderu…** dodaje zapisany wcześniej wzorzec. Kilka wzorców w jednej akcji to alternatywy – wystarczy, że znajdzie się jeden (np. przycisk w jasnym i w ciemnym motywie). ✕ przy miniaturce usuwa wzorzec z akcji (plik zostaje).
- **próg** – jak bardzo fragment musi przypominać wzorzec (100% = identyczny); **szukaj do** – ile sekund szukać, bo strona może się doczytywać; **gdy brak** – pomiń akcję, przewijaj stronę i szukaj dalej albo zgłoś błąd akcji;
- **porównuj** – *szarość* (odporne na drobne zmiany kolorów), *kolory* (najdokładniej, ale zmiana motywu psuje dopasowanie), *krawędzie* (odporne też na zmianę motywu); **różne skale** – szukaj też w innych rozmiarach, bo bot losuje skalowanie i rozmiar okna.
- W podglądzie panelu (bez programu) można obejrzeć okienko, ale zapis do folderu `obrazy` działa tylko w programie na komputerze.

**Klawisz lub kombinacja:** kliknij w pole z klawiszem i naciśnij kombinację na klawiaturze – zapisze się sama (np. `Ctrl+F`). Skróty, których przeglądarka nie oddaje stronie (np. Ctrl+W, Ctrl+T), wybierz z **listy** obok – są tam też klawisze nawigacji i edycji.

**Selektor CSS:** w Chrome kliknij element prawym przyciskiem → *Zbadaj*, potem na podświetlonym kodzie prawy przycisk → *Copy* → *Copy selector*. Przykłady: `#search`, `input[name=q]`, `textarea`. Bot czeka na element do 10 s.

**Dokąd** – przełącznik z dwiema ikonkami w wierszu akcji, tuż przed strzałkami (przy pisaniu, klawiszach i akcjach myszy); zaznaczona ikonka jest podświetlona, a po najechaniu myszą pokazuje się opis:
- *Strona* (ikonka kartki z tekstem) – klawisze trafiają tylko do treści strony. Działa też bez okna i w tle, ale skróty przeglądarki (Ctrl+F, Ctrl+T, Alt+←, F5…) nic nie otworzą – strona zobaczy tylko samo naciśnięcie.
- *Strona* przy akcjach myszy – mysz działa tylko w treści strony; działa też bez okna i w tle.
- *Przeglądarka* przy akcjach myszy – prawdziwy kursor nad oknem przeglądarki, więc można trafić też w jej przyciski (np. „Wstecz”, karty); punkt liczony w % całego okna.
- *Przeglądarka* (ikonka okna z paskiem) – klawisze idą do okna przeglądarki bota jak z prawdziwej klawiatury, więc działają też skróty przeglądarki (np. Ctrl+F otwiera okienko szukania). Wymaga widocznego okna (nie „Bez okna”), a w tym czasie nie można używać klawiatury ani myszy. **Ten tryb (klawisze i mysz) jest na razie tylko w panelu – bot pomija takie akcje z informacją w dzienniku.**

Błąd jednej akcji (np. brak elementu) nie przerywa wejścia: trafia do dziennika i tabeli, a bot idzie do następnej akcji.

### Zakładka „Ustawienia”

#### Co zmieniać przy każdym wejściu
Zaznaczone grupy są losowane od nowa przy każdym wejściu. Odznaczona grupa zostaje taka, jak w Twojej prawdziwej przeglądarce. Opcje zależne od siebie stoją obok siebie i mają ten sam kolor (legenda pod listą): **niebieski** – system i karta graficzna (karta pasuje do wylosowanego systemu), **zielony** – język i strefa czasowa (losowane w parze). Pozostałe są niezależne.

| Pole | Co robi |
|---|---|
| System i User-Agent | udaje Windows, macOS albo Linuksa |
| Karta graficzna (WebGL) | inny model karty, pasujący do systemu |
| Język | inny język przeglądarki |
| Strefa czasowa | inna strefa, dobrana do języka |
| Ekran i okno | inna rozdzielczość, skalowanie i rozmiar okna |
| Rdzenie i pamięć RAM | inna liczba rdzeni i ilość pamięci |
| Szum na płótnie | inny skrót „canvas” |
| Ukrywanie części czcionek | strona widzi mniej czcionek |
| Motyw, animacje, „nie śledź” | jasny lub ciemny motyw i inne preferencje |


#### Przeglądarka
- **Użyj zainstalowanego Chrome'a:** zalecane. Odznacz, jeśli Chrome sprawia kłopoty (wtedy potrzebne jest Chromium z `pobierz-chromium.bat`).
- **Bez okna przeglądarki:** szybciej i bez otwierania okien, ale przeglądarka rysuje wtedy programowo, więc karta graficzna wygląda inaczej. Nie działa z akcjami w trybie *Przeglądarka* – wtedy ta opcja, akcje i ich przełącznik są oznaczone na żółto znakiem ⚠, a ⚠ pojawia się też przy nazwach zakładek.

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

Wyniki są w zakładce **Statystyki**.

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
| Tekst trafia w złe miejsce | Przed „Pisz tekst” dodaj „Kliknij” z selektorem pola. |
| Ctrl+F (lub inny skrót przeglądarki) nic nie otwiera | W trybie „Strona” to normalne. Tryb „Przeglądarka” zostanie podłączony w kolejnej wersji. |
| „tryb »Przeglądarka« nie jest jeszcze podłączony” w dzienniku | Jak wyżej – zmień akcję na „Strona” albo poczekaj na kolejną wersję. |

## 7. Aktualizacja

Wersja przenośna: pobierz nowy ZIP z Releases, rozpakuj obok starego i przenieś do niego folder `reports`, żeby zachować stare raporty. Z kodu źródłowego: `git pull`, potem `npm install`. Co się zmieniło w nowej wersji, opisuje [CHANGELOG.md](../CHANGELOG.md).
