# Historia zmian

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), wersje według [SemVer](https://semver.org/lang/pl/).

## [1.22.0] – 2026-11-12
### Dodane
- **Dzieło prawdziwe w „Rysunkach i grafikach”: Albrecht Dürer, „Melancholia I” (1514, miedzioryt, The Met, CC0).** Oryginał to reprodukcja dzieła, kopie druku to ten sam obraz z rastrem, a kopie ręczne tracą najdrobniejsze linie i mają lekko rozjechaną kreskę. Wymiary arkusza wynikają z proporcji dzieła; zlecenie i opis mówią, że wyniki badań, znak wodny i stempel kolekcji są symulowane. Hasło w wiki („Dzieła prawdziwe”).
### Zmienione
- **Rzeźby (brąz i marmur): bez przycisku „To jest oryginał”.** Jest „Zakończ ekspertyzę”, a ocenę daje checklista – rzeźba bez zaznaczonych sygnałów fałszerstwa liczy się jako wskazany oryginał.
- **Ekran startowy:** przycisk „Rozpocznij badania” jest zawsze widoczny, a opis, lista trybów i badania nad nim przewijają się.

## [1.21.0] – 2026-11-12
### Usunięte
- Przyciski ręcznego oznaczania obiektów („? Podejrzany”, „✕ Wykluczony / Falsyfikat”, „✓ Prawdziwy”, „Bez oznaczenia”) i ich znaczki na stole.
### Zmienione
- Ocenę egzemplarzy daje checklista: obiekt z co najmniej jednym zaznaczonym sygnałem fałszerstwa jest uznany za fałszywy, bez zaznaczeń – za prawdziwy. Tak liczy się wynik w trybach obiektów (banknoty, monety, znaczki, rękopisy, rysunki, akwarele) i w „Pamięci eksperta”; w podsumowaniu partii każdy obiekt ma dopisek z checklisty.
- Teksty zleceń i wskazówek mówią o checkliście zamiast o oznaczaniu.

## [1.20.0] – 2026-11-12
### Dodane
- **Drugie dzieło prawdziwe: Józef Chełmoński, „Babie lato” (1875)** w trybie „Znajdź oryginał – obrazy” – na liście „Artysta” oraz w wiki („Dzieła prawdziwe”). Kluczowy detal do porównania stylu: głowa i uniesiona ręka z nitkami babiego lata.
- Na liście „Artysta” pojawia się „Losowe dzieło prawdziwe” (są już dwa).

## [1.19.1] – 2026-11-09
### Zmienione
- Ekran startowy: podgląd „Badania obrazów” / „Znajdź oryginał – obrazy” pokazuje „Stańczyka” Matejki (z podpisem), obraz wczytuje się razem z loaderem startowym.
- Po wejściu w tryb „Znajdź oryginał – obrazy” na liście „Artysta” domyślnie wybrany jest „Stańczyk” (`REAL_DEF` w `js/core/real.js`); wybór innego artysty zostaje zapamiętany do zmiany trybu.

## [1.19.0] – 2026-11-09
### Dodane
- **Pierwsze dzieło prawdziwe: Jan Matejko, „Stańczyk” (1862)** w trybie „Znajdź oryginał – obrazy”. Wybór na liście „Artysta” (grupa „Dzieła prawdziwe (domena publiczna)”). Oryginał to reprodukcja z Wikimedia Commons, kopie robi gra (te same metody fałszerskie co dla obrazów fikcyjnych), a zdrady stylu (anatomia, cień) przesuwają lub odbijają fragment postaci.
- Wyniki badań dzieła prawdziwego są oznaczone jako symulowane (zlecenie, proweniencja, certyfikat, pentimenti, RTG); IR pokazuje rysunek przygotowawczy z krawędzi obrazu; sygnatura nie jest badana.
- Wiki: kategoria „Dzieła prawdziwe” – opis, wymiary, muzeum, licencja i link do źródła.
- `js/core/real.js`: ładowanie obrazów (z loaderem), lista artystów, scena z prawdziwego obrazu.
### Zmienione
- Linki w wiki w kolorze interfejsu.

## [1.18.2] – 2026-11-09
### Dodane
- **O programie → Licencje i źródła:** lista 8 prawdziwych dzieł z domeny publicznej (autor, tytuł, data, muzeum, licencja, link do Wikimedia Commons), podstawa prawna (domena publiczna, art. 14 dyrektywy UE 2019/790, CC0 The Met), informacja, że kopie i wyniki badań są symulowane, licencja głowy popiersi (CC BY 4.0) i pochodzenie ArtKit.
- Dane dzieł prawdziwych: `js/data/realart.js`; obrazy jako skrypty `js/real/*.js` (`tools/build-real.py`), żeby działały także z `file://`.
### Zmienione
- Okno „O programie”: przewijana treść z paskiem przewijania i stałym przyciskiem „Zamknij”.

## [1.18.1] – 2026-11-09
### Dodane
- Okno **O programie** (przycisk na ekranie głównym i w górnym pasku gry): opis gry, autorzy – Michał Stankiewicz i Claude, zrobione przy pomocy vibecodingu i laboratorium sztuki (GameLaboratory), źródła zasobów i link do kodu.

## [1.18.0] – 2026-11-09
### Zmienione – dopracowane sceny obrazów (`js/paint/scenes.js`)
- **Portret:** światło za głową, pasma i przedziałek we włosach, tęczówki z cieniem powieki i odblaskiem, rumieńce, światło na grzbiecie nosa i nozdrza, linia ust i odblask dolnej wargi, cień brody na szyi, miękkie fałdy sukni, odblask broszki.
- **Pejzaż:** mgiełka nad horyzontem (perspektywa powietrzna), światło na grzbietach gór, odbicie nieba i ciemny brzeg jeziora, koleiny na drodze, komin z dymem i dachówki, ptaki, trawa i kwiaty na pierwszym planie.
- **Martwa natura:** światło z lewej na ścianie, słoje stołu, odblaski okna na dzbanie i pas szkliwa, odblaski i ogonki owoców, listek, połysk winogron, krawędź i stopka misy, skórka cytryny.
- **Marina:** cienie i rozświetlenia chmur, deski i iluminatory kadłuba, olinowanie, fala dziobowa i kilwater, odbicie statku, szczeliny w skałach, mewy.
- Szczegóły nie zmieniają obszarów (pigmenty, zdrady, IR, pamięć) – są samą warstwą malarską. Ilustracje wiki wygenerowane ponownie.

## [1.17.0] – 2026-11-09
### Dodane
- Tryb **Rysunki i grafiki** (`js/kinds/artworks.js`): ołówek, tusz, węgiel, miedzioryt – obraz pracy rysuje ArtKit. Badania: papier pod światło (linie sita, znak wodny), papier w UV, odwrocie (stemple kolekcji), struktura kreski (mikroskop), odcisk i relief (lampa boczna, odcisk płyty, rowki po kalce), płynność kreski, materiał (XRF). Metody: faksymile cyfrowe, przerys przez kalkę, kopia na karcie z epoki, reprodukcja fotomechaniczna. Jeden oryginał (przy miedziorycie czasem dwie odbitki).
- Tryb **Akwarele i pastele**: akwarela i pastel suchy; zamiast płynności kreski – granica dawnej oprawy (blaknięcie). Metody: giclée, współczesna kopia, kopia na papierze z epoki, kopia z podrobionym znakiem kolekcji.
- Oba tryby w grupie „Obrazy” (menu i ekran główny), artykuły i ilustracje w wiki.
- `kindBatch` przyjmuje `originals(r)` – liczbę oryginałów w partii.
### Poprawione
- Ekran główny: lista badań trybu nie znika, gdy w kategorii jest więcej trybów.

## [1.16.0] – 2026-11-09
### Dodane
- Lampa ruchoma obejmuje też podczerwień (reflektografia IR).
- Wielkość kręgu lampy: Shift + kółko myszy (50–420 px), zapamiętywana w przeglądarce.

## [1.15.1] – 2026-11-09
### Poprawione
- Loader przy pierwszym wyborze badania, którego widok trzeba dopiero przygotować (odwrocie, RTG, światło boczne, UV, IR itd. – do ok. 2 s przy pięciu obiektach). Wcześniej strona przez ten czas nie reagowała.

## [1.15.0] – 2026-11-09
### Dodane
- Podobrazia z laboratorium sztuki w trybie „Obrazy – znajdź oryginał”: obok płótna także **deska dębowa** i **blacha miedziana**. Dwaj nowi (fikcyjni) artyści: Jan Korwin-Ostrowski – „Portret damy w ciemnej sukni”, 1846, olej na desce; Teodor Walewicz – „Jezioro o zmierzchu”, 1853, olej na miedzi.
- Odwrocie deski: trzy dębowe deski ze słojami (faktura ArtKit), spoiny, fazowane krawędzie, parkietaż, chodniki kołatka; falsyfikat – płyta pilśniowa. Odwrocie blachy: kuta miedź z patyną, śladami młotka i puncą płatnerza; falsyfikat – walcowana blacha cynkowa.
- RTG: deska pokazuje słoje, spoiny i parkietaż (płyta – jednolite tło); blacha miedziana pochłania promieniowanie, więc obraz jest prawie jednolicie jasny.
### Zmienione
- Teksty zlecenia, katalogu raisonné, certyfikatu, obserwacji i raportu zależą od podobrazia; nazwy metod „stare płótno” i „giclée” dla deski mówią o desce. Na miedzi nie ma kopii na starym podobraziu ani wydruku giclée (na stole 4 obrazy), a RTG nie jest tam zdradą.
- Tryby „Zniszczony fragment” i „Pamięć eksperta” losują tylko obrazy na płótnie.

## [1.14.1] – 2026-11-09
### Poprawione (doktor modeli z GameLaboratory)
- Rzeźby 3D sprawdzone doktorem modeli z GameLaboratory (`tools/doctor-3d.py`). Wyniki przed poprawkami: dziura między szyją głowy a szyją torsu (`seethrough`, błąd), jednostronna warstwa włosów widoczna od spodu (`seethrough`, błąd), trójkąty-igły na osi cokołu i torsu (`sliver`, info).
- Szyja głowy zwężona do owalu mieszczącego się w szyi torsu; włosy jako zamknięta bryła (warstwa zewnętrzna, wewnętrzna i brzegi); cokół i tors budowane bez wachlarzy trójkątów na osi (dno i wierzch z pierścieni). Teraz: 0 wyników we wszystkich wariantach (oryginał, „styl”, ze szwami).

## [1.14.0] – 2026-11-09
### Dodane
- Lampa ruchoma: w widokach UV, światła bocznego i światła przechodzącego (pod światło) reszta stołu jest przyciemniona, a widok badawczy pokazuje się tylko w kręgu światła za kursorem. Lampa boczna oświetla relief z kierunku lampy – przesuwanie zmienia cienie. Przycisk „🔦 Lampa ruchoma / 💡 Cały obiekt” przełącza na dawny widok całości.

## [1.13.0] – 2026-11-09
### Zmienione
- Rzeźby 3D (brąz i marmur): głowa i szyja z modelu popiersia z GameLaboratory (`js/lab/bust-head.js`, „Lowpoly face model” – void, CC BY 4.0, zmienione) zamiast głowy złożonej z kul. Siatka jest zagęszczana i wygładzana w grze; włosy to warstwa odsunięta od czaszki, kok z tyłu. Zdrada „styl” (dłuższy nos, przechylona głowa) działa na nowej głowie, szew odlewniczy biegnie wzdłuż jej sylwetki.

## [1.12.0] – 2026-11-09
### Dodane
- ArtKit z laboratorium sztuki GameLaboratory skopiowany do gry (`js/lab/artkit.js`, przerobiony na zwykły skrypt, żeby gra działała też z `file://`).
- Wiki: nowa kategoria „Techniki malarskie i podłoża” (18 artykułów): olej, akwarela, ołówek, tusz, tusz patyczkiem, długopis, węgiel, pastel, flamaster, puentylizm, rytownictwo; płótno, deska, papier, pergamin, blacha miedziana; złocona rama, passe-partout. Ilustracje z ArtKit: całość, szczegół ×4 i światło boczne ×4.

## [1.11.1] – 2026-11-09
### Poprawione
- Zawieszanie przeglądarki po wejściu do wiki: widok „odwrocie” rękopisu rozmywał każdą kreskę osobno (ok. 60 s pracy przeglądarki). Warstwa korozji jest teraz rysowana raz i rozmywana jednym przebiegiem – dotyczyło to też tego badania w samej grze.
- Ilustracje wiki są teraz gotowymi plikami JPG (`img/wiki/`, generowane skryptem `tools/build-wiki-img.py`), więc wiki otwiera się od razu i nie obciąża przeglądarki.

## [1.11.0] – 2026-11-09
### Dodane
- Wiki: rozbudowane artykuły (`js/data/wikitexts.js`) – wstęp oraz sekcje „Na czym polega”, „Co ujawnia”, „Na co uważać”, „Ciekawostka” dla technik; „Jak powstaje”, „Po czym poznać” dla metod fałszerskich; dłuższe hasła słowniczka i opisy obiektów.
- Wiki: ilustracje do każdego artykułu generowane silnikiem gry – porównanie oryginału z falsyfikatem w danym widoku (UV, IR, RTG, pod światło, światło boczne…), przybliżenia obszarów (sygnatura, ząbkowanie, przedruk itd.), obrazy artystów, rzeźby oraz schematy (widmo XRF, magnes, waga, suwmiarka, dokument, mikroskop).
- Wiki: techniki występujące w kilku trybach połączone w jeden artykuł z sekcją „W grze”; klikalne odnośniki między artykułami.
### Usunięte
- Efekty menu: drgania i aberracja napisów, migotanie paneli, migające bloki JPG i kolorowe paski (zostaje ziarno, pasmowanie tła, pulsowanie ramek i paralaksa).
### Poprawione
- Plansza ponownie dopasowuje widok „Całość”, gdy układ zmieni rozmiar zaraz po starcie partii.

## [1.10.0] – 2026-11-09
### Zmienione
- Cała gra w stylu ekranu głównego (niebieski HUD): górny pasek, okna ze ściętymi rogami, przyciski, plansza i sala 3D w granatach, niebieskie paski przewijania wszędzie.
- Nowy układ stanowiska: okno „Narzędzia” (z licznikiem zbadań wybranego obiektu), pasek „Zlecenie” (zwijany), okno „Stół badawczy” z narożnikami celownika i nazwą widoku w nagłówku.
- Prawe okno z zakładkami: Wynik badania / Checklista / Notatnik (z licznikami); wybór narzędzia przełącza na „Wynik badania”.
### Dodane
- Dok obiektów pod stołem: kafelki A–E ze stanem oznaczenia, liczbą zbadań, flagami checklisty i paskiem postępu; kliknięcie wybiera obiekt i przybliża do niego (`js/core/layout.js`).

## [1.9.1] – 2026-11-09
### Usunięte
- Linie skanowania na ekranie głównym (winieta zostaje).
- Krótkie zakłócenia obrazu w podglądzie trybu.

## [1.9.0] – 2026-11-09
### Dodane
- Efekty ekranu głównego (`js/core/homefx.js`): ziarno, artefakty kompresji JPG (bloki 8×8, przesunięcia barw, pasmowanie tła), pasy przesunięcia kolorów, aberracja chromatyczna napisów, migotanie i pulsowanie obramowań paneli, krótkie zakłócenia podglądu, linie skanowania i winieta, paralaksa podglądu. Wyłączane przy „ogranicz ruch” w systemie.
### Zmienione
- Paski przewijania dopasowane do stylu: złoto-brązowe w grze, niebieskie w menu i wiki.

## [1.8.0] – 2026-11-09
### Dodano
- **Wiki eksperta** (`js/core/wiki.js`): techniki badawcze, metody fałszerskie i obiekty generowane automatycznie z danych trybów + słowniczek 27 pojęć; wyszukiwarka; dostępna z ekranu głównego i z gry.
- **Loader** przy starcie i przy przygotowywaniu partii (obrazy malowane pędzlem, scena 3D).
- **SEO:** opis i słowa kluczowe, `canonical`, Open Graph i Twitter Card z miniaturą `og-image.jpg` (zrzut ekranu startowego 1200×630), dane strukturalne JSON-LD (`VideoGame`), `robots.txt`, `sitemap.xml`, `favicon.svg`, opis gry dla robotów wyszukiwarek.
- Roadmapa: meble jako nowy rodzaj obiektu.

## [1.7.0] – 2026-11-09
### Dodano
- **Ekran główny** (`js/core/home.js`, styl w `css/style.css`): laboratorium w stylu „szklanych” paneli – kategorie z miniaturami, duży podgląd wybranego trybu generowany silnikiem gry, opis, wybór trybu, lista badań, karty postępu z odhaczaniem ukończonych trybów.
- Przycisk „☰ Menu” w grze – powrót do ekranu głównego.
- Licznik ukończonych ekspertyz i trafnych werdyktów zapisywany lokalnie w przeglądarce.

## [1.6.0] – 2026-11-09
### Dodano
- Tryb **Rzeźby z marmuru** (`js/modes/marble.js`): ślady dłuta, szpicaka i tarnika kontra ścieżki frezu CNC (widoczne z bliska), patyna w zagłębieniach, postarzanie kwasem, UV, waga, pomiar, sygnatura z tyłu cokołu; 4 metody fałszerskie.
- Opis trybu: `docs/tryby/marmur.md`.
### Zmieniono
- Silnik rzeźb 3D obsługuje warianty materiału (`SCULPT_VARIANTS`): brąz i marmur korzystają z tej samej kamery, bramek odległości i kąta oraz sceny.

## [1.5.0] – 2026-11-09
### Dodano
- Tryb **Weryfikacja rękopisów** (`js/kinds/manuscript.js`): atrament (XRF w wybranym wierszu, obwódka żelazowo-galasowa przy dużym zoomie), papier czerpany pod światło, pismo i ductus, pieczęć lakowa, korozja atramentu na odwrociu; 4 metody fałszerskie, w tym dopisek w oryginalnym dokumencie.
- Opis trybu: `docs/tryby/rekopis.md`.
- Bank pomysłów: `docs/POMYSLY.md` (z oznaczeniem, co już jest w grze).

## [1.4.0] – 2026-11-09
### Dodano
- Tryb **Weryfikacja znaczków** (`js/kinds/stamp.js`): ząbkowanie z miarką 2 cm, znak wodny w kąpieli, metoda druku (mikrodetal), guma na odwrociu, przedruk; 4 metody fałszerskie i przeróbki.
- Opis trybu: `docs/tryby/znaczek.md`.
- Roadmapa: datowanie archeologiczne oraz badania warstw malarskich, pigmentów, przemalowań i techniki wykonania (do przemyślenia).

## [1.3.0] – 2026-11-09
### Dodano
- Tryb **Weryfikacja monet** (`js/kinds/coin.js`): waga, średnica, skład stopu (XRF), magnes, rant (rozwinięcie), bicie czy odlew (mikrodetal przy zoomie ≥ ×6), zużycie wypukłości; 4 metody fałszerskie.
- Opis trybu: `docs/tryby/moneta.md`.
### Zmieniono
- `embossFrom` (relief w świetle bocznym) przeniesiony do rdzenia (`js/core/kinds.js`); rodzaj może mieć własny cień na planszy (`shadow`).

## [1.2.0] – 2026-11-09
### Dodano
- Rejestr obiektów 2D (`js/core/kinds.js`): rodzaje „sklasyfikuj każdy” (banknot, w przyszłości moneta, znaczek, rękopis) podpinane jednym plikiem w `js/kinds/`.
- Menu trybów budowane automatycznie, z grupami (Obrazy, Rzeźby 3D, Obiekty) i pozycjami „wkrótce”: Aukcja, Śledztwo, Konserwator.
### Zmieniono
- Banknoty przeniesione do `js/kinds/banknote.js` jako pierwszy rodzaj w rejestrze; nachylenie (`TILT`) jest teraz wspólne dla wszystkich rodzajów.

## [1.1.0] – 2026-11-09
### Zmieniono
- Kod podzielony na pliki i foldery (`css/`, `js/core`, `js/data`, `js/paint`, `js/modes`).
- Numer wersji widoczny w nagłówku gry (`js/version.js`).
### Dodano
- Dokumentacja: `README.md`, `CHANGELOG.md`, `docs/ARCHITEKTURA.md`, `docs/ROADMAPA.md`.

## [1.0.0] – 2026-11-08
### Dodano
- Pierwsza wersja w repozytorium (jeden plik `index.html`): tryby obrazy, fragment, rzeźby 3D, pamięć eksperta, banknoty; checklista fałszerstwa; oznaczanie obiektów; bramki zoomu.
