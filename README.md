# Bot odcisku

Bot z panelem w przeglądarce. Wchodzi na wskazaną stronę i wykonuje **scenariusz akcji** jak człowiek – pisanie tekstu z nierównymi odstępami między klawiszami, naciskanie klawiszy i skrótów, kliknięcia, przewijanie, czekanie – rusza myszą po krzywych z przyspieszaniem i drżeniem, a przy **każdym wejściu ma inny odcisk przeglądarki**. Działa na dowolnej stronie. Przebieg każdego wejścia trafia do raportu.

Wersja **0.8.2** · autor: Michał Stankiewicz · repozytorium: <https://github.com/michalstankiewicz4-cell/webbot>. Działa tylko lokalnie na Twoim komputerze (panel na 127.0.0.1).

Dokumenty: [instrukcja obsługi](docs/INSTRUKCJA.md) · [dokumentacja techniczna](docs/DOKUMENTACJA.md) · [historia zmian](CHANGELOG.md)

## Pobranie i uruchomienie (Windows)

**Najprościej – wersja przenośna:** na stronie [Releases](https://github.com/michalstankiewicz4-cell/webbot/releases/latest) pobierz `webbot-X.Y.Z-windows-portable.zip`, rozpakuj i kliknij dwukrotnie `start.bat`. Node.js jest w paczce, więc nic nie trzeba instalować; potrzebny jest tylko Google Chrome (bez niego jednorazowo uruchom `pobierz-chromium.bat`).

**Z kodu źródłowego** (do zmian w programie):

Wymagany [Node.js](https://nodejs.org/) 20 lub nowszy. Chrome nie jest konieczny (bez niego bot użyje wbudowanego Chromium Playwrighta).

1. Kliknij dwukrotnie `start.bat`. Przy pierwszym uruchomieniu instaluje zależności (`npm install`).
2. Panel otworzy się sam pod adresem <http://127.0.0.1:3777/>. Okno konsoli musi zostać otwarte, dopóki używasz bota; `Ctrl+C` je zamyka.

Ręcznie: `npm install`, potem `npm start`. Inny port: `set PORT=4000` przed `npm start`.

Jeśli Playwright zgłosi brak przeglądarki (przy odznaczonym „Użyj zainstalowanego Chrome'a” albo bez Chrome'a): uruchom `pobierz-chromium.bat`.

## Co zmienia się przy każdym wejściu

Każde wejście to nowa, czysta przeglądarka (bez ciasteczek i pamięci) z losowym profilem. Grupy cech włączasz w panelu:

| Grupa | Co się zmienia | Jak |
|---|---|---|
| System i User-Agent | Windows / macOS / Linux, wersja Chrome'a (zgodna z prawdziwą, czasem o 1 starsza), `navigator.platform`, `userAgentData` | opcja Playwrighta + skrypt wstrzykiwany |
| Język | `navigator.languages`, nagłówek `Accept-Language` | opcja `locale` + skrypt |
| Strefa czasowa | `Intl…timeZone`, przesunięcie czasu | opcja `timezoneId`; w parze z językiem |
| Ekran i okno | rozdzielczość, skalowanie, rozmiar okna | `screen`, `viewport`, `deviceScaleFactor` |
| Rdzenie i RAM | `hardwareConcurrency`, `deviceMemory` | skrypt |
| Karta graficzna | producent i model z WebGL (pasujące do systemu) | podmiana `getParameter` |
| Szum na płótnie | skrót canvas: 24 piksele zmienione o 1 w eksportowanym obrazku, stałe w obrębie wizyty | podmiana `toDataURL` |
| Czcionki | ok. 30% sprawdzanych czcionek „znika” | podmiana `measureText` |
| Motyw, animacje, DNT | jasny/ciemny, ograniczenie animacji, „nie śledź” | `colorScheme`, `reducedMotion`, skrypt |

Kod: `bot/profiles.mjs` (losowanie spójnych profili) i `bot/spoof.mjs` (skrypt wstrzykiwany przed skryptami strony).

## Panel

Start/Stop na górze, pod nimi dwie zakładki: **Plan** (liczba wejść, przerwy, adres, **scenariusz** – lista akcji dodawanych przyciskiem „+ Dodaj akcję”, z kolejnością ↑↓ / przeciąganiem, powielaniem i usuwaniem) i **Ustawienia** (co zmieniać przy każdym wejściu, przeglądarka, proxy). Akcje: Pisz tekst, Naciśnij klawisze (nagrywanie kombinacji albo lista), Kliknij w element, Przewiń, Czekaj, Ludzkie zachowanie. Przy pisaniu i klawiszach wybór „dokąd”: Strona albo Przeglądarka (ten drugi tryb – w przygotowaniu). Przy każdym polu jest podpowiedź po najechaniu myszą i znaczek [?] z opisem.

## Zachowanie na stronie

`bot/human.mjs`, `bot/visit.mjs`:

- ruch myszy po krzywej Béziera, czas ruchu rosnący z odległością (w stylu prawa Fittsa), przyspieszanie i hamowanie, drobne drżenie, czasem przestrzelenie i korekta;
- kliknięcie nie w sam środek, przytrzymanie 50–140 ms; przewijanie kółkiem z przerwami i czasem cofnięciem;
- scenariusz: akcje po kolei; błąd jednej akcji nie przerywa wejścia;
- pisanie: znak po znaku, odstępy z rozkładu log-normalnego (mediana 150 ms), szybciej w częstych parach liter, dłużej po spacji, interpunkcji i przed wielką literą, czasem chwila namysłu, klawisz przytrzymany 50–130 ms; polskie znaki z keydown/keyup; tam, gdzie jest kursor (albo w pierwsze pole tekstowe); pole wskazujesz wcześniejszą akcją „Kliknij w element”;
- „Ludzkie zachowanie”: 3–6 rund „czytania” (drobne ruchy myszy) i przewijania, czasem powrót wyżej i najechanie myszą na link, nagłówek albo przycisk – bez klikania; działa na każdej stronie;

## Proxy i VPN

Lista proxy w panelu, jedno na linię (`http://użytkownik:hasło@host:port`, `socks5://host:port`); używane po kolei, każde wejście przez następne. Chrome nie obsługuje proxy SOCKS5 z hasłem. VPN działa na poziomie całego systemu, więc włączasz go ręcznie w jego aplikacji; bot o nim nie wie.

## Raporty

Folder `reports/`: dla każdego uruchomienia `wejscia-RRRR-MM-DD-GG-MM-SS.csv` (średnik jako separator, otwiera się w Excelu) i `.json` (pełny profil przeglądarki i ustawienia serii). CSV zawiera wylosowane cechy przeglądarki (system, User-Agent, języki, strefa, ekran, sprzęt, karta graficzna, ziarno szumu canvas, ukryte czcionki, motyw) i wyniki scenariusza. Pliki dopisują się po każdym wejściu, więc przerwanie nie gubi wyników.

## Ograniczenia

- Podmienione funkcje da się wykryć (np. po `Function.prototype.toString`), a niektóre cechy mogą sobie przeczyć, np. system „macOS” z czcionkami z Windowsa. Zaawansowane zabezpieczenia takie niespójności zauważą.
- Nie zmienia się: prawdziwe czcionki systemu (poza ukrywaniem), dźwięk (AudioContext), adres IP bez proxy/VPN.
- „Bez okna przeglądarki” zmienia prawdziwy renderer WebGL na programowy, a część stron to wykrywa.

## Struktura

```
start.bat          uruchomienie jednym kliknięciem (Windows; używa node\node.exe z wersji przenośnej, jeśli jest)
pobierz-chromium.bat  pobranie Chromium, gdy nie ma Chrome'a
server.mjs         serwer panelu (tylko 127.0.0.1), pętla wejść, raporty, podgląd na żywo (SSE)
public/            panel: index.html, app.js, style.css
bot/profiles.mjs   losowe, spójne profile przeglądarki
bot/spoof.mjs      skrypt zmieniający cechy w przeglądarce
bot/human.mjs      ludzki ruch myszy, kliknięcia, przewijanie
bot/visit.mjs      przebieg jednego wejścia i odczyt wyników
tools/             check-version.mjs – zgodność numeru wersji (npm test); build-portable.ps1 – budowa wersji przenośnej; release-notes.mjs – opis wydania
.github/workflows/ release.yml – automat wydań (Actions → „Wydanie” → Run workflow)
docs/              DOKUMENTACJA.md, INSTRUKCJA.md
reports/           raporty CSV i JSON (tworzony automatycznie)
```

## Wersjonowanie

[SemVer](https://semver.org/lang/pl/). Jedyne źródło numeru to `package.json`; panel pokazuje go obok nazwy. Każda zmiana podnosi wersję i dostaje wpis w [CHANGELOG.md](CHANGELOG.md). `npm test` sprawdza, czy numer zgadza się we wszystkich dokumentach. Szczegóły: [dokumentacja, sekcja 9](docs/DOKUMENTACJA.md#9-wersjonowanie).
