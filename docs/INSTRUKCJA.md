# Instrukcja obsługi – Bot odcisku

Wersja instrukcji odpowiada wersji programu **0.5.0**.

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

Panel ma dwie zakładki: **Plan** – co bot ma zrobić, i **Ustawienia** – jak ma wyglądać jego przeglądarka. Start bierze ustawienia z obu. Przy każdym polu jest podpowiedź (najedź myszą) i znaczek **[?]** – najedź na niego albo kliknij, żeby przeczytać dłuższy opis (Esc albo kliknięcie obok zamyka).

### Zakładka „Plan”

#### Wejścia i cel
- **Liczba wejść:** od 1 do 500. Jedno wejście trwa od kilkunastu sekund do ok. minuty – zależnie od długości tekstu i włączonych kroków.
- **Przerwa od–do:** losowa pauza między wejściami, w sekundach.
- **Adres strony:** pełny adres z `https://`. Pisanie działa na każdej stronie. Zakładki, test „Człowiek czy bot” i odczyt odcisku działają tylko na „Cyfrowym odcisku człowieka” – na innych stronach bot je pomija i tylko przewija.
- **Tekst do wpisania:** bot wpisze go znak po znaku z nierównymi, ludzkimi odstępami. Nowa linia w tekście = naciśnięcie Enter. Puste pole = bez pisania.
- **Gdzie pisać:**
  - *Pisz od razu* – zaraz po wczytaniu strony w pole, które ma kursor (np. wyszukiwarka). Jeśli żadne go nie ma, bot klika w pierwsze widoczne pole tekstowe.
  - *We wskazane pole* – wpisz selektor CSS pola, np. `#search` albo `textarea[name=q]`. Jak go znaleźć: w Chrome kliknij pole prawym przyciskiem → *Zbadaj*, potem na podświetlonym kodzie prawy przycisk → *Copy* → *Copy selector*. Bot czeka na pole do 10 s.
- **Naciśnij Enter po wpisaniu:** po całym tekście bot naciśnie Enter (np. wysłanie wyszukiwania) i poczeka na przeładowanie strony.

#### Co robić na stronie
- **Przewijanie i klikanie:** bot przewija stronę; na „Cyfrowym odcisku” odwiedza też 2–4 losowe zakładki.
- **Test „Człowiek czy bot”:** tylko na „Cyfrowym odcisku” – bot sam wykonuje ten test ruchem myszy podobnym do ludzkiego, a panel pokazuje werdykt strony.

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

Aby sprawdzić, która cecha najbardziej zmienia odcisk, odznacz wszystkie poza jedną i zrób kilka wejść.

#### Przeglądarka
- **Użyj zainstalowanego Chrome'a:** zalecane. Odznacz, jeśli Chrome sprawia kłopoty (wtedy potrzebne jest Chromium z `pobierz-chromium.bat`).
- **Bez okna przeglądarki:** szybciej i bez otwierania okien, ale przeglądarka rysuje wtedy programowo, więc karta graficzna wygląda inaczej.

#### Proxy
- Wpisz jedno proxy na linię: `http://użytkownik:hasło@host:port` albo `socks5://host:port`.
- Każde kolejne wejście używa następnego proxy z listy; po ostatnim bot wraca do pierwszego.
- Linie zaczynające się od `#` są pomijane.
- Chrome nie obsługuje proxy SOCKS5 z hasłem, w takim przypadku użyj HTTP.
- **VPN** włączasz ręcznie w jego aplikacji, jeszcze przed startem. Bot go nie przełącza.

### Start i Stop (pod zakładkami)
- **Start** uruchamia serię wejść. Ustawienia są zablokowane, dopóki bot pracuje.
- **Stop** przerywa bieżące wejście i kończy serię. Wyniki zebrane do tej chwili zostają w raporcie.

## 4. Jak czytać wyniki

**Tabela „Wejścia”**, jeden wiersz na wejście:
- **Profil:** wylosowane ustawienia, czyli system, język, strefa czasowa, ekran, sprzęt, karta graficzna, motyw i liczba ukrytych czcionek.
- **Pisanie:** ile znaków wpisano i w jakim tempie (znaki na minutę); na czerwono – dlaczego się nie udało (np. brak pola).
- **Odcisk ze strony** (tylko „Cyfrowy odcisk”): skrót, który policzyła strona.
  - **nowy:** strona w tej serii jeszcze takiego odcisku nie widziała.
  - **powtórzony:** taki odcisk już był.
- **Człowiek czy bot:** liczba oznak bota (z 5) i werdykt strony. Od 3 oznak strona uznaje, że to bot.
- **Czas:** jak długo trwało wejście.

Pod tabelą jest podsumowanie „Różnych odcisków: X z Y”.

**Dziennik** pokazuje na bieżąco każdy krok: profil, wpisany tekst (liczba znaków, czas, tempo), odwiedzone zakładki, wynik, przerwy i błędy.

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
| „nie znaleziono pola …” / „na stronie nie ma pola tekstowego” | Sprawdź selektor (patrz „Gdzie pisać”) albo czy pole jest widoczne bez klikania czegoś wcześniej. Wejście idzie dalej, tylko bez pisania. |
| Tekst trafia w złe miejsce przy „Pisz od razu” | Użyj „We wskazane pole” z selektorem. |
| Odcisk się powtarza | Sprawdź, czy zaznaczone są „Szum na płótnie” i „Karta graficzna”. Bez nich odcisk zmienia się rzadziej. |

## 7. Aktualizacja

Wersja przenośna: pobierz nowy ZIP z Releases, rozpakuj obok starego i przenieś do niego folder `reports`, żeby zachować stare raporty. Z kodu źródłowego: `git pull`, potem `npm install`. Co się zmieniło w nowej wersji, opisuje [CHANGELOG.md](../CHANGELOG.md).
