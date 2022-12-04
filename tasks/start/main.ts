// Run:
// deno task start
// or
// deno run -A tasks/start/main.ts -lang <ts|go|py> -day <day> -year <year>

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

import * as tmpls from "./tmpls.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const flags = parse(Deno.args);
  const lang = flags.lang || flags.l || "ts";
  const day = padDay(`${flags.day || flags.d || today()}`);
  const year = flags.year || flags.y || thisYear();

  const dirname = makeDirname(year, day, lang);

  // Create solution directory and files only if they don't exist.
  if (!exists(dirname)) {
    await Deno.mkdir(dirname, { recursive: true });
    await Deno.writeTextFile(
      `${dirname}/input.txt`,
      `# Paste your input here.`,
    );

    switch (lang) {
      case "ts": {
        await Deno.writeTextFile(`${dirname}/main.ts`, tmpls.ts(year, day));
        break;
      }

      case "go": {
        await Deno.writeTextFile(`${dirname}/main.go`, tmpls.go(year, day));
        break;
      }

      case "py": {
        await Deno.writeTextFile(`${dirname}/main.py`, tmpls.py(year, day));
        break;
      }

      default: {
        console.error("Invalid language");
        Deno.exit(1);
      }
    }
  }
}

function makeDirname(year: string, day: string, lang: string) {
  return `./${year}/${day}/solutions/${lang}`;
}

function today() {
  const now = new Date();
  const year = now.getFullYear();
  let day = new Date(now.toLocaleString("en-US", {
    timeZone: "America/New_York",
  })).getDate();

  if (exists(`./${year}/${day}`)) {
    day++;
  }

  return day;
}

function padDay(day: string) {
  return day.length === 1 ? `0${day}` : day;
}

function thisYear() {
  return `${new Date().getFullYear()}`;
}

function exists(dirname: string) {
  let dirnameExists = true;
  try {
    dirnameExists = Deno.statSync(dirname).isDirectory;
    console.error(`Directory ${dirname} already exists.`);
  } catch {
    dirnameExists = false;
    console.log(`Creating ${dirname}...`);
  }
  return dirnameExists;
}
