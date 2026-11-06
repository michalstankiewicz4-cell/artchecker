// Opis release'u dla bieżącej wersji: jak pobrać + wpisy z CHANGELOG.md od poprzedniego wydania. Wypisuje na stdout.
// Poprzednie wydanie (np. 0.4.0) podaje zmienna PREV; bez niej – tylko wpis bieżącej wersji.
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { version } = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));
const log = await readFile(join(ROOT, "CHANGELOG.md"), "utf8");
const start = log.indexOf(`## [${version}]`);
if (start < 0) { console.error(`Brak wpisu ## [${version}] w CHANGELOG.md`); process.exit(1); }
const prev = (process.env.PREV || "").replace(/^v/, "");
const prevAt = prev ? log.indexOf(`## [${prev}]`, start + 1) : -1;
const next = prevAt > 0 ? prevAt : log.indexOf("\n## [", start + 1);
const block = log.slice(start, next < 0 ? undefined : next).trim();
// jedna wersja: same sekcje; kilka wersji: nagłówek każdej wersji i jej sekcje
const section = prevAt > 0 && block.split("\n## [").length > 1
  ? block.replace(/^### /gm, "#### ").replace(/^## \[/gm, "### [")
  : block.split("\n").slice(1).join("\n").trim().replace(/^### /gm, "#### ");
const REPO = "https://github.com/michalstankiewicz4-cell/webbot/blob/main";

console.log(`## Pobieranie

**Windows, bez instalowania czegokolwiek:** pobierz \`webbot-${version}-windows-portable.zip\` z listy plików poniżej, rozpakuj i kliknij dwukrotnie \`start.bat\`. Panel otworzy się sam w przeglądarce. Node.js i cała dokumentacja są w paczce; potrzebny jest tylko Google Chrome (bez niego raz uruchom \`pobierz-chromium.bat\`).

Instrukcja obsługi: \`docs/INSTRUKCJA.md\` w paczce albo [w repozytorium](${REPO}/docs/INSTRUKCJA.md).

## Co nowego w ${version}${prevAt > 0 ? ` (zmiany od ${prev})` : ""}

${section}

Pełna historia zmian: [CHANGELOG.md](${REPO}/CHANGELOG.md).`);
