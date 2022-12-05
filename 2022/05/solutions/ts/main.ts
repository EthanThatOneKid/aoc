// Path: 2022/05/solutions/ts/main.ts
//
// Run:
// cd 2022/05/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

function part1(input: string[]) {
  const cratesConfig = input.slice(0, input.indexOf("") - 1);
  const movesConfig = input.slice(input.indexOf("") + 1);

  const crates = cratesConfig.reduce(
    (
      stacks: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ],
      row,
    ) => {
      const {
        1: i,
        5: ii,
        9: iii,
        13: iv,
        17: v,
        21: vi,
        25: vii,
        29: viii,
        33: ix,
      } = row;
      [i, ii, iii, iv, v, vi, vii, viii, ix].forEach((c, i) => {
        if (c !== " ") {
          stacks[i] = c + stacks[i];
        }
      });
      return stacks;
    },
    ["", "", "", "", "", "", "", "", ""],
  );

  movesConfig.forEach((move) => {
    const { 1: amt, 3: from, 5: to } = move.split(" ").map(Number);
    const fromIdx = from - 1;
    const toIdx = to - 1;
    const stuff = crates[fromIdx]
      .slice(crates[fromIdx].length - amt).split("").reverse().join("");
    crates[toIdx] += stuff;
    crates[fromIdx] = crates[fromIdx].slice(
      0,
      crates[fromIdx].length - amt,
    );
  });

  const result = crates.map((c) => c[c.length - 1]).join("");

  console.log({ result });
}

function part2(input: string[]) {}

const input = Deno.readTextFileSync("input.txt").split("\r\n");

isPart2 ? part2(input) : part1(input);
