# Historia zmian

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), wersje według [SemVer](https://semver.org/lang/pl/).

## [1.31.1] – 2026-11-12
### Dodane
- „O programie”: informacja, że to darmowa aplikacja edukacyjna (bez reklam i opłat, bez celu komercyjnego), po polsku i angielsku.

## [1.31.0] – 2026-11-12
### Zmienione
- **„Zniszczony fragment” na dziele prawdziwym, zniszczonym w czasie wojny:** Gustave Courbet, „Kamieniarze” (1849, Gemäldegalerie w Dreźnie, zniszczony w lutym 1945 r., znany z fotografii). Lista „Artysta” w tym trybie: „Kamieniarze” i „Losowe dzieło”. Opis oryginału ma prawdziwą historię obrazu i sygnaturę „G. Courbet” (l.d.); opis badań, fragment i wyniki są symulowane (zlecenie to wyjaśnia).
- Daty w opisie oryginału uzgodnione z dziełami zaginionymi w czasie wojny: analiza i badania IR z 1938 r. (było 1965), konserwacja z 1928 r. (było 1958), „Oryginał zaginął lub został zniszczony w czasie wojny” (było „zaginął w 1944 r.”).
### Naprawione
- Krawędź urwanego fragmentu nie łączy się już linią prostą od początku do końca.

## [1.30.0] – 2026-11-12
### Zmienione
- **„Pamięć eksperta” na dziełach prawdziwych** („Stańczyk”, „Babie lato” lub losowe). Różnice w falsyfikatach to łaty prawdziwego obrazu: przesunięty, powiększony lub pomniejszony fragment, zmieniony odcień, zamalowany szczegół, dodatkowy drobny element – z opisem miejsca (np. „w dolnej lewej części”).

## [1.29.0] – 2026-11-12
### Usunięte
- **Fikcyjne prace w trybach z dziełami prawdziwymi** („Przeprowadź ekspertyzę – obrazy”, „Rysunki i grafiki”, „Akwarele i pastele”): na liście „Artysta” są tylko dzieła prawdziwe i „Losowe dzieło”. Fikcyjni artyści zostają na razie w „Zniszczonym fragmencie” i „Pamięci eksperta” (wiki opisuje ich tylko tam).
### Dodane
- Wiki, „Weryfikacja banknotów”: akapit o zabezpieczeniach euro (seria pierwsza i „Europa”, sprawdzanie dotykiem, pod światło i pod kątem – znak wodny i okienko z portretem, szmaragdowa liczba, hologram, wypukły nadruk) wg EBC, z linkiem do strony EBC; tylko tekst.
- Ekran startowy: podglądy „Rysunków i grafik” i „Akwareli i pasteli” pokazują dzieła prawdziwe („Melancholia I”, „Zając”).

## [1.28.0] – 2026-11-12
### Dodane
- **Trzy kolejne dzieła prawdziwe** (lista „Artysta”, wiki „Dzieła prawdziwe”): Albrecht Dürer, „Dłonie modlącego się” (1508, „Rysunki i grafiki”), Albrecht Dürer, „Zając” (1502, „Akwarele i pastele”), Stanisław Wyspiański, „Macierzyństwo” (1902, „Akwarele i pastele”). Są już po 2 dzieła w każdym gatunku.
- Dzieło na papierze maszynowym (Wyspiański): oryginał ma papier welinowy, więc papier pod światło nie jest zdradą kopii – zdradzają je inne badania.
- **Wiki, hasło „Weryfikacja banknotów”:** akapit o zabezpieczeniach prawdziwych banknotów złotego (seria „Władcy polscy”, wg NBP) – tylko tekst, bez wizerunków, z linkiem do strony NBP.

## [1.27.1] – 2026-11-12
### Naprawione
- Zmiana języka w grze lub w wiki nie wraca już do menu głównego: gra wraca do tego samego trybu i artysty (nowa partia), wiki do tego samego hasła.
### Zmienione
- Ilustracje wiki wygenerowane od nowa w kolorach nowego stylu (grafit, zieleń oryginału, czerwień falsyfikatu, złote schematy). Dwa zestawy: `img/wiki/` z polskimi podpisami i `img/wiki/en/` z angielskimi (`tools/build-wiki-img.py`).

## [1.27.0] – 2026-11-12
### Zmienione
- **Nowy styl całej gry: „Luxury Museum Laboratory”** (wg specyfikacji GPT): grafit (#17191D, #222630), stal (#394453), przyciemnione szkło i szczotkowany metal na panelach, miękkie cienie, stalowe krawędzie, złote narożniki; złoto (#F5C66B, #C99539, mosiądz #98702F) tylko dla ważnych elementów – aktywna sekcja (pulsująca poświata), najważniejsze przyciski z przesuwającym się refleksem, ramy obrazów, liczniki; zieleń sukcesu #65DB87, błękit informacji technicznych #65B9F5; bez neonowych poświat.
- Przyciski w trzech stanach: grafit i stal → złoty gradient po najechaniu → przygaszone nieaktywne; przejścia 220 ms. Zakładki ze złotym podkreśleniem, wybrane narzędzie i obiekt w złocie.
- Wspólne zmienne CSS (`--c-*`, `--shadow-panel`, `--shadow-gold`, `--border-gold`, `--border-steel`) dla ekranu startowego, stanowiska, wiki, okien i loadera; ziarno filmowe na całym ekranie; font Inter.
- Tło ekranu startowego w ciepłej, grafitowej sali muzeum; stół badawczy, scena 3D i ikony wiki w nowych barwach.

## [1.26.0] – 2026-11-12
### Zmienione
- **Ekran startowy według makiety – złote akcenty.** Wybrana kategoria w złotej ramce, złoty przycisk „Wiki”, „O programie” z ikoną, wynik w złocie; złocona, ozdobna rama obrazu na scenie (listwy, perełki, narożne rozety) i światło z góry; podpis sceny ze złotą kropką; złota ikona muzeum w panelu, zielona kropka wybranego trybu i „✓ +n”; złoty przycisk „Rozpocznij badania” ze ściętym brzegiem; karty na dole ze złotymi sześciokątami, zielonymi znacznikami ukończonych trybów, paskiem postępu z procentem i ikonami w tle (lupa, popiersie, moneta, klepsydra).
- Tło ekranu startowego: rozmyta sala muzeum (kolumny, obrazy w ramach, lampy, posągi, barierki).
### Dodane
- Strzałki ‹ › na scenie – poprzedni / następny tryb w kategorii.

## [1.25.0] – 2026-11-12
### Dodane
- **Język EN – etap 3: wiki po angielsku.** Wszystkie hasła (techniki badawcze, metody fałszerskie, obiekty i artyści, słowniczek, techniki malarskie i podłoża, dzieła prawdziwe), kategorie, nagłówki, podpisy ilustracji i opisy dzieł prawdziwych. Teksty: `js/i18n/en-wiki-1.js` … `en-wiki-3.js`; w wersji EN polski tytuł hasła zostaje kluczem (obrazy, linki między hasłami), wyszukiwarka szuka po angielsku.
- **Wiki: przyciski „O programie” i PL/EN** – w tej samej kolejności co na ekranie startowym i pasku gry (Wiki · O programie · PL/EN).
### Naprawione
- Hasła wiki „Rysunki i grafiki” i „Akwarele i pastele”: w zleceniu brakowało tytułu pracy i liczby arkuszy.

## [1.24.0] – 2026-11-12
### Dodane
- **Język EN – etap 2: cała rozgrywka po angielsku.** Nazwy i wskazówki badań, warunki (zoom, obszar, odległość), wyniki i obserwacje, przyczyny fałszerstw, metody fałszerskie, zlecenia, „Jak grać”, checklisty, notatnik, proweniencje, certyfikaty, opisy oryginału, podsumowania partii i komunikaty – we wszystkich trybach (obrazy, fragment, pamięć, rysunki, akwarele, banknoty, monety, znaczki, rękopisy, rzeźby z brązu i marmuru). Podpisy obiektów na stole też.
- Słowniki: `js/i18n/en-core.js`, `en-paint.js`, `en-money.js`, `en-docs.js`, `en-art3d.js`.
### Zmienione
- Silnik tłumaczeń (`js/core/i18n.js`): oprócz całych tekstów tłumaczy wzorce z wartościami (`{0}`, `{1}` – liczby, nazwy, litery) i frazy w tekstach składanych w kodzie (od najdłuższych, z granicą słowa). Wiki na razie bez zmian (etap 3).
- W wersji EN liczby dziesiętne z kropką.
### Naprawione
- Proweniencja dzieła prawdziwego: numer katalogu wystawy pokazywał „NaN”.

## [1.23.0] – 2026-11-12
### Dodane
- **Język PL / EN – etap 1.** Przycisk PL/EN na ekranie startowym i na pasku gry. Język wykrywa przeglądarka (polski → PL, każdy inny → EN), chyba że gracz przełączy go ręcznie (wybór zapamiętany); `?lang=pl` / `?lang=en` w adresie ma pierwszeństwo.
- Po angielsku: interfejs (pasek, okna, przyciski, podpowiedzi sterowania), menu trybów, ekran startowy, lista artystów, okno „O programie” z listą licencji. Angielska nazwa gry: *Authentication Lab*.
- Mechanizm: `js/core/i18n.js` – słownik `EN` (klucz = tekst polski), `tr()` w kodzie i obserwator DOM tłumaczący węzły i atrybuty; dłuższe bloki HTML w dwóch wersjach (`data-l="pl"` / `data-l="en"`).
### Zmienione
- **SEO pod angielski, polski jako drugi:** tytuł, opis, słowa kluczowe, Open Graph, Twitter i dane strukturalne po angielsku; `hreflang` en / pl / x-default, `og:locale:alternate` pl_PL, opis gry dla wyszukiwarek po angielsku i po polsku; mapa strony z wersjami językowymi. W wersji PL tytuł i opis strony zmieniają się na polskie.
### Do zrobienia
- Etap 2: badania, wskazówki, wyniki, zlecenia i podsumowania po angielsku. Etap 3: wiki.

## [1.22.2] – 2026-11-12
### Zmienione
- Nazwy trybów: „Znajdź oryginał – …” → „Przeprowadź ekspertyzę – …” (obrazy, rzeźby z brązu, rzeźby z marmuru) w menu, na ekranie startowym, w wiki („Obrazy – przeprowadź ekspertyzę”), README i dokumentacji.

## [1.22.1] – 2026-11-12
### Zmienione
- **„Znajdź oryginał – obrazy”: zamiast „To jest oryginał” jest „Zakończ ekspertyzę”.** Ocenę daje checklista, tak jak w rzeźbach: obraz bez zaznaczonych sygnałów fałszerstwa liczy się jako wskazany oryginał.

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
