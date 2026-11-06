// Sprawdza, czy numer wersji z package.json stoi wszędzie tam, gdzie powinien (npm test).
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = f => readFile(join(ROOT, f), "utf8");
const { version } = JSON.parse(await read("package.json"));
const errors = [];

if (!/^\d+\.\d+\.\d+$/.test(version)) errors.push(`package.json: „${version}” to nie jest wersja MAJOR.MINOR.PATCH`);
for (const f of ["README.md", "docs/DOKUMENTACJA.md", "docs/INSTRUKCJA.md"])
  if (!(await read(f)).includes(`**${version}**`)) errors.push(`${f}: brak „**${version}**”`);
const top = /^## \[(\d+\.\d+\.\d+)\]/m.exec(await read("CHANGELOG.md"));
if (!top || top[1] !== version) errors.push(`CHANGELOG.md: najnowszy wpis to ${top ? top[1] : "(brak)"}, a powinien być ${version}`);

if (errors.length) { console.error(`Niezgodna wersja (package.json: ${version}):\n- ` + errors.join("\n- ")); process.exit(1); }
console.log(`OK: wersja ${version} zgodna we wszystkich plikach.`);
