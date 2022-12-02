// Run:
// deno task start
// or
// deno run -A tasks/start/main.ts -lang <ts|go|py> -day <day> -year <year>

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const flags = parse(Deno.args);
  const lang = flags.lang || flags.l || "ts";
  const day = flags.day || flags.d || today();
  const year = flags.year || flags.y || thisYear();

  const dirname = makeDirname(year, day, lang);

  let dirnameExists = true;
  try {
    dirnameExists = Deno.statSync(dirname).isDirectory;
    console.error(`Directory ${dirname} already exists.`);
  } catch {
    dirnameExists = false;
    console.log(`Creating ${dirname}...`);
  }

  // Create solution directory and files only if they don't exist.
  if (!dirnameExists) {
    await Deno.mkdir(dirname, { recursive: true });
    await Deno.writeTextFile(
      `${dirname}/input.txt`,
      `# Paste your input here.`,
    );

    switch (lang) {
      case "ts": {
        await Deno.writeTextFile(`${dirname}/main.ts`, tmplTS(year, day));
        break;
      }

      case "go": {
        await Deno.writeTextFile(`${dirname}/main.go`, tmplGo(year, day));
        break;
      }
    }
  }
}

// TODO: Add aocutil in TypeScript with absolute import.
function tmplTS(year: number, day: number) {
  return `// Path: ${year}/${day}/solutions/ts/main.ts
//
// Run:
// cd ${year}/${day}/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

import * as aocutil from "../../../../util/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.p2 || flags.part2;

// TODO: Implement solution.
aoc.assert(1 === 1, "1 is not 1");
`;
}

// TODO: Add flags for part 1 and 2.
function tmplGo(year: number, day: number) {
  return `// Path: ${year}/${day}/solutions/go/main.go
//
// Run:
// cd ${year}/${day}/solutions/go
// go run .

package main

import (
	"math"

	"github.com/diamondburned/aoc-2022/aocutil"
)

func main() {
	aocutil.Assert(1 === 1, "1 is not 1")
}
`;
}

function makeDirname(year: number, day: number, lang: string) {
  return `./${year}/${day}/solutions/${lang}`;
}

function today() {
  const now = new Date(new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  })).getDate();
  return now < 10 ? `0${now}` : `${now}`;
}

function thisYear() {
  return new Date().getFullYear();
}
