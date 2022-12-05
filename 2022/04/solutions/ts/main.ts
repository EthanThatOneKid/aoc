// Path: 2022/4/solutions/ts/main.ts
//
// Run:
// cd 2022/04/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.p2 || flags.part2;

function part1(input: string[]) {
  let count = 0;
  for (const pair of input) {
    const [r1, r2] = pair.split(",");
    const [r1min, r1max] = r1.split("-").map(Number);
    const [r2min, r2max] = r2.split("-").map(Number);

    if (r1min <= r2min && r2max <= r1max) {
      count++;
    } else if (r2min <= r1min && r1max <= r2max) {
      count++;
    }
  }

  console.log({ count });
}

function part2(input: string[]) {
  let count = 0;
  for (const pair of input) {
    const [r1, r2] = pair.split(",");
    const [r1min, r1max] = r1.split("-").map(Number);
    const [r2min, r2max] = r2.split("-").map(Number);

    if (r1min <= r2max && r2min <= r1max) {
      count++;
    }
  }

  console.log({ count });
}

const input = Deno.readTextFileSync("input.txt").split("\r\n");
isPart2 ? part2(input) : part1(input);
