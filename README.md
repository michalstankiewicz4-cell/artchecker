# Bot odcisku

Bot z panelem w przeglądarce. Wchodzi na stronę [Cyfrowy odcisk człowieka](https://michalstankiewicz4-cell.github.io/behavioral-biometrics/), zachowuje się jak człowiek (przewija, klika zakładki i przyciski, rusza myszą po krzywych z przyspieszaniem i drżeniem) i przy **każdym wejściu ma inny odcisk przeglądarki**. Po każdym wejściu odczytuje wynik ze strony: odcisk przeglądarki i werdykt testu „Człowiek czy bot”, i zapisuje go do raportu.

Wersja **0.2.0** · autor: Michał Stankiewicz · repozytorium: <https://github.com/michalstankiewicz4-cell/webbot>. Działa tylko lokalnie na Twoim komputerze (panel na 127.0.0.1).

Dokumenty: [instrukcja obsługi](docs/INSTRUKCJA.md) · [dokumentacja techniczna](docs/DOKUMENTACJA.md) · [historia zmian](CHANGELOG.md)

## Uruchomienie (Windows)

Wymagany [Node.js](https://nodejs.org/) 20 lub nowszy. Chrome nie jest konieczny (bez niego bot użyje wbudowanego Chromium Playwrighta).

1. Kliknij dwukrotnie `start.bat`. Przy pierwszym uruchomieniu instaluje zależności (`npm install`).
2. Panel otworzy się sam pod adresem <http://127.0.0.1:3777/>. Okno konsoli musi zostać otwarte, dopóki używasz bota; `Ctrl+C` je zamyka.

Ręcznie: `npm install`, potem `npm start`. Inny port: `set PORT=4000` przed `npm start`.

Jeśli Playwright zgłosi brak przeglądarki (przy odznaczonym „Użyj zainstalowanego Chrome'a”): `npx playwright install chromium`.

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

## Zachowanie na stronie

`bot/human.mjs`, `bot/visit.mjs`:

- ruch myszy po krzywej Béziera, czas ruchu rosnący z odległością (w stylu prawa Fittsa), przyspieszanie i hamowanie, drobne drżenie, czasem przestrzelenie i korekta;
- kliknięcie nie w sam środek, przytrzymanie 50–140 ms; przewijanie kółkiem z przerwami i czasem cofnięciem;
- przy włączonym „Przewijanie i klikanie”: przewija stronę główną i odwiedza 2–4 losowe zakładki;
- test „Człowiek czy bot”: znajduje kółka na płótnie po kolorze pikseli i klika je 5 razy ludzkim ruchem;
- na końcu zakładka „Odcisk przeglądarki”, przycisk „Pokaż mój odcisk”, odczyt wyniku z modułów strony.

## Proxy i VPN

Lista proxy w panelu, jedno na linię (`http://użytkownik:hasło@host:port`, `socks5://host:port`); używane po kolei, każde wejście przez następne. Chrome nie obsługuje proxy SOCKS5 z hasłem. VPN działa na poziomie całego systemu, więc włączasz go ręcznie w jego aplikacji; bot o nim nie wie.

## Raporty

Folder `reports/`: dla każdego uruchomienia `wejscia-RRRR-MM-DD-GG-MM-SS.csv` (średnik jako separator, otwiera się w Excelu) i `.json` (pełny profil, wszystkie cechy odczytane przez stronę, miary ruchu z testu „Człowiek czy bot”). Pliki dopisują się po każdym wejściu, więc przerwanie nie gubi wyników. Panel pokazuje, czy odcisk z danego wejścia był **nowy**, czy **powtórzony**.

## Ograniczenia

- Podmienione funkcje da się wykryć (np. po `Function.prototype.toString`), a niektóre cechy mogą sobie przeczyć, np. system „macOS” z czcionkami z Windowsa. Na stronie „Cyfrowy odcisk człowieka” to nie przeszkadza, bo ona tylko liczy skrót. Zaawansowane zabezpieczenia takie niespójności zauważą.
- Nie zmienia się: prawdziwe czcionki systemu (poza ukrywaniem), dźwięk (AudioContext), adres IP bez proxy/VPN.
- „Bez okna przeglądarki” zmienia prawdziwy renderer WebGL na programowy, a część stron to wykrywa.

## Struktura

```
start.bat          uruchomienie jednym kliknięciem (Windows)
server.mjs         serwer panelu (tylko 127.0.0.1), pętla wejść, raporty, podgląd na żywo (SSE)
public/            panel: index.html, app.js, style.css
bot/profiles.mjs   losowe, spójne profile przeglądarki
bot/spoof.mjs      skrypt zmieniający cechy w przeglądarce
bot/human.mjs      ludzki ruch myszy, kliknięcia, przewijanie
bot/visit.mjs      przebieg jednego wejścia i odczyt wyników
tools/             check-version.mjs – zgodność numeru wersji (npm test)
docs/              DOKUMENTACJA.md, INSTRUKCJA.md
reports/           raporty CSV i JSON (tworzony automatycznie)
```

## Wersjonowanie

[SemVer](https://semver.org/lang/pl/). Jedyne źródło numeru to `package.json`; panel pokazuje go obok nazwy. Każda zmiana podnosi wersję i dostaje wpis w [CHANGELOG.md](CHANGELOG.md). `npm test` sprawdza, czy numer zgadza się we wszystkich dokumentach. Szczegóły: [dokumentacja, sekcja 9](docs/DOKUMENTACJA.md#9-wersjonowanie).
