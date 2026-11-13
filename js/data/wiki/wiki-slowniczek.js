"use strict";
/* Wiki – rozszerzone hasła słowniczka (WGLOSS) i opisy obiektów (WOBJ). */
/* Rozszerzone hasła słowniczka – dopisywane do krótkiej definicji. */
const WGLOSS={
 'Atrament żelazowo-galasowy':'Przez ponad tysiąc lat był podstawowym atramentem Europy – pisano nim księgi, dokumenty i nuty. Świeży jest bladoszary, ciemnieje po kilku dniach w kontakcie z powietrzem. W XRF daje wyraźny sygnał żelaza.',
 'Blejtram':'Od zwykłego krosna różni się właśnie klinami, które pozwalają ponownie napiąć płótno, gdy to się rozluźni. Rodzaj drewna, łączenia narożników i ślady pił są wskazówką co do wieku i pochodzenia.',
 'Cyzelowanie':'Dobry cyzeler potrafił znacznie podnieść jakość odlewu: wyostrzał włosy, oczy, ornamenty i nadawał powierzchni różne faktury. Ślady jego pracy są trudne do skopiowania w odlewie z formy.',
 'CNC (frezowanie)':'Technologia ta pozwala dokładnie odtworzyć kształt ze skanu 3D. Frez obraca się z dużą prędkością i zbiera materiał warstwa po warstwie – stąd regularne, równoległe ślady, szczególnie w zagłębieniach.',
 'Ductus':'Termin pochodzi z paleografii. Ductus obejmuje to, jak ręka porusza się między literami – a nie tylko, jak litery wyglądają. Dlatego naśladowanie kształtu liter nie wystarcza, by oszukać eksperta.',
 'Druk wklęsły (intaglio)':'Farba wypełnia wyryte rowki, nadmiar zbiera się z powierzchni płyty, a papier wciska się w rowki pod wielkim naciskiem. Na odwrociu często widać lekkie wgłębienia.',
 'Farba zmienna optycznie (OVI)':'Zawiera mikroskopijne płatki zbudowane z cienkich warstw, które odbijają światło o różnej długości fali zależnie od kąta. Efekt jest niemożliwy do uzyskania zwykłym drukiem.',
 'Galwanoplastyka':'Metodę opracowano w XIX w. Pozwala odtworzyć nawet najdrobniejsze detale powierzchni, bo metal osadza się atom po atomie na powierzchni formy.',
 'Giclée':'Nazwa pochodzi od francuskiego „gicler” – tryskać. Wydruki giclée mają szeroki zakres barw i są trwałe, dlatego używają ich muzea i artyści do legalnych reprodukcji.',
 'Grunt':'Grunt wyrównuje podłoże, zmniejsza chłonność i nadaje barwę tła. Jego skład i kolor zmieniały się z epokami i regionami – bywa więc ważną wskazówką datującą.',
 'Impast':'Grubą farbę nakładano pędzlem lub szpachlą, żeby wzmocnić światła i nadać obrazowi fakturę. Impasty widać najlepiej w świetle bocznym.',
 'Katalog raisonné':'To podstawowe narzędzie ekspertów i domów aukcyjnych. Dzieło, którego nie ma w katalogu raisonné, musi przejść znacznie ostrzejszą weryfikację.',
 'Krakelura':'Wyróżnia się krakelurę wczesną (schnięcia, gdy farba kurczy się podczas wysychania) i wiekową (gdy stara farba pęka pod wpływem ruchów podłoża). Ich wzory różnią się wyraźnie.',
 'Obraz utajony':'Działa dzięki temu, że linie druku wklęsłego są wypukłe i biegną w różnych kierunkach – pod kątem światło odbija się od nich inaczej.',
 'Papier czerpany':'Formę z sitem zanurzano w kadzi z masą papierniczą i „czerpano” arkusz. Druty sita zostawiają w papierze cieńsze miejsca – widoczne pod światło jako linie.',
 'Patyna':'Na brązie patyna chroni metal przed dalszą korozją. Kolor zależy od środowiska: zieleń w ziemi i na zewnątrz, brąz i czerń we wnętrzach.',
 'Pentimenti':'Nazwa pochodzi od włoskiego „pentirsi” – żałować, zmieniać zdanie. Pentimenti są silnym argumentem za oryginalnością, bo kopista kopiuje gotowy efekt, a nie proces.',
 'Proweniencja':'Szczególnie ważna jest dla lat 1933–1945 – luki w tym okresie mogą oznaczać dzieło zrabowane, które podlega restytucji.',
 'Przedruk':'Przedruki wprowadzano, gdy brakowało znaczków o właściwym nominale, zmieniała się waluta albo państwo. Mają liczne odmiany: odwrócone, podwójne, z błędami.',
 'Recto-verso':'Ten element wymaga druku obu stron arkusza w jednym przebiegu maszyny – właśnie dlatego jest tak trudny do podrobienia.',
 'Reflektografia IR':'Pierwsze reflektogramy w latach 60. XX w. wykonywano kamerami telewizyjnymi z czułymi lampami. Dziś używa się kamer cyfrowych i składa obraz z setek zdjęć.',
 'RTG':'W badaniach dzieł sztuki stosuje się zwykle niższe energie niż w medycynie – tak, by uzyskać kontrast między warstwami farby.',
 'Surmoulage':'Termin jest francuski – właśnie we Francji problem nieautoryzowanych odlewów brązów był największy. Surmoulage przenosi także wszystkie sygnatury i numery, więc znaki nie wystarczą jako dowód.',
 'Werniks':'Dawne werniksy z naturalnych żywic (damara, mastyks) żółkną z czasem i świecą w UV. Konserwatorzy zdejmują je i zastępują nowymi, odwracalnymi werniksami.',
 'XRF':'Promieniowanie rentgenowskie wybija elektrony z atomów, a te w odpowiedzi emitują promieniowanie o energii charakterystycznej dla pierwiastka. Przenośne spektrometry działają w kilkadziesiąt sekund.',
 'Ząbkowanie':'Perforację znaczków wprowadzono w latach 50. XIX w. – wcześniej znaczki cięto z arkusza nożyczkami. Miarka perforacyjna jest podstawowym narzędziem filatelisty.',
 'Znak wodny':'Powstaje, gdy na sicie umieszcza się drucik lub reliefową formę – papier jest w tym miejscu cieńszy albo grubszy. Znaki wodne datują papier i wskazują papiernię.',
};
/* Opisy obiektów / trybów – wstęp do artykułu. */
const WOBJ={
 'rzeźby z brązu':'Brąz artystyczny odlewa się z modelu (gipsowego, woskowego), a potem cyzeluje i patynuje. Ponieważ z jednej formy można wykonać wiele egzemplarzy, granica między oryginałem, odlewem autoryzowanym a kopią bywa cienka – liczą się odlewnia, nakład, stop, skurcz i jakość wykończenia.',
 'rzeźby z marmuru':'Marmurowe rzeźby kuto ręcznie – często w warsztacie, z pomocą maszyny punktowej przenoszącej kształt z modelu. Fałszerstwa to dziś głównie kopie frezowane CNC i odlewy z żywicy z mączką marmurową; dawniej – warsztatowe kopie sprzedawane jako dzieła mistrza.',
 'banknotów':'Banknot łączy kilkanaście zabezpieczeń widocznych gołym okiem, pod światło, przy przechylaniu, w lupie i w urządzeniach (UV, IR, magnetyzm). Żadne fałszerstwo nie odtwarza wszystkich – dlatego zawsze sprawdza się kilka cech naraz.',
 'monet':'Moneta to precyzyjny wyrób mennicy: ściśle określony stop, masa, średnica, rant i rysunek stempla. W grze: prawdziwe monety 1 zł, 2 zł, 5 zł, 1 € i 2 €. Fałszerstwa to odlewy ze stopu cynku, monety bite w podrobionych stemplach z niewłaściwego stopu, podróbki o złych własnościach magnetycznych i monety jednolite udające bimetaliczne – każda metoda zdradza się w innych pomiarach.',
 'znaczków':'Wartość znaczka zależy od szczegółów: ząbkowania lub marginesów, znaku wodnego, gumy, druku i kasownika. W grze: Penny Black (1840) i Polska nr 1 (1860). Fałszerstwa obejmują faksymile, fałszerstwa z epoki, podrobione kasowniki oraz „naprawiane” oryginały.',
 'rękopisów':'Rękopis bada się jak dokument historyczny: podłoże (pergamin czy papier), atrament, farby, pismo i wiek materiału. W grze: karty Manuskryptu Wojnicza (Beinecke, Yale, MS 408) – pergamin z lat 1404–1438. Najtrudniejsze do wykrycia jest fałszerstwo na starym, czystym pergaminie, bo datowanie radiowęglowe datuje skórę, a nie zapis.',
};
