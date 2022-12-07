// Path: 2022/06/solutions/ts/main.ts
//
// Run:
// cd 2022/06/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

function solution(input: string, unique: number) {
  const lastLetters: string[] = [];
  for (let i = 0; i < input.length; i++) {
    // Check if last letters are unique.
    if (lastLetters.length === unique) {
      const uniqueLetters = new Set(lastLetters);
      if (uniqueLetters.size === unique) {
        console.log({ i });
        break;
      }
    }
    lastLetters.push(input[i]);
    // If the array is long, remove the first letter.
    if (lastLetters.length > unique) {
      lastLetters.shift();
    }
  }
}

const input = Deno.readTextFileSync("input.txt");

solution(input, isPart2 ? 14 : 4);
