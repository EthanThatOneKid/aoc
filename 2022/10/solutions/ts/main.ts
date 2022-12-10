// Path: 2022/10/solutions/ts/main.ts
//
// Run:
// cd 2022/10/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

function part1(input: string[]) {
  const cycles: Record<string, number> = {
    noop: 1,
    addx: 2,
  };

  let cycle = 0;
  let x = 1;
  let signalSum = 0;
  while (input.length > 0) {
    const [cmd, value] = input.shift()!.split(" ");
    for (let i = 0; i < cycles[cmd]; i++) {
      cycle++;
      if (cycle % 20 === 0 && cycle % 40 !== 0) {
        signalSum += x * cycle;
      }
      if (i === cycles[cmd] - 1) {
        if (cmd === "addx") {
          x += Number(value);
        }
      }
    }
  }

  console.log(signalSum);
}

function part2(input: string[]) {
  const cycles: Record<string, number> = {
    noop: 1,
    addx: 2,
  };

  let cycle = 0;
  let x = 1;
  const width = 40;
  let result = "😼";
  while (input.length > 0) {
    const [cmd, value] = input.shift()!.split(" ");
    for (let i = 0; i < cycles[cmd]; i++) {
      cycle++;
      if (cycle % width === 0) {
        result += "\n";
      }
      if (i === cycles[cmd] - 1) {
        if (cmd === "addx") {
          x += Number(value);
        }
      }
      const xpos = cycle % width;
      if (Math.abs(xpos - x) < 2) {
        result += "😼";
      } else {
        result += "🌊";
      }
    }
  }

  console.log(result);
}

const input = Deno.readTextFileSync("input.txt").split("\r\n");

isPart2 ? part2(input) : part1(input);
