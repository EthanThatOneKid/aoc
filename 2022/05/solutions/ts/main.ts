// Path: 2022/05/solutions/ts/main.ts
//
// Run:
// cd 2022/05/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

function solution(input: string[]) {
  const cratesConfig = input.slice(0, input.indexOf("") - 1);
  const movesConfig = input.slice(input.indexOf("") + 1);

  const cols = cratesConfig.reduce(
    (
      stacks: string[],
      {
        1: one,
        5: two,
        9: three,
        13: four,
        17: five,
        21: six,
        25: seven,
        29: eight,
        33: nine,
      },
    ) => {
      [one, two, three, four, five, six, seven, eight, nine].forEach((c, i) => {
        if (c !== " ") {
          stacks[i] = c + stacks[i];
        }
      });
      return stacks;
    },
    Array.from({ length: 9 }, () => "" as string),
  );

  movesConfig.forEach((move) => {
    const { 1: amt, 3: from, 5: to } = move.split(" ").map(Number);
    const fromIdx = from - 1;
    const toIdx = to - 1;
    const stuff = cols[fromIdx].slice(cols[fromIdx].length - amt);

    if (isPart2) {
      cols[toIdx] += stuff;
    } else {
      cols[toIdx] += stuff.split("").reverse().join("");
    }

    cols[fromIdx] = cols[fromIdx].slice(
      0,
      cols[fromIdx].length - amt,
    );
  });

  const result = cols.map((c) => c[c.length - 1]).join("");

  console.log({ result });
}

const input = Deno.readTextFileSync("input.txt").split("\r\n");

solution(input);
