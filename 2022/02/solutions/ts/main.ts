// Run:
// cd 2022/02/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

enum RPS {
  ROCK = 1,
  PAPER = 2,
  SCISSORS = 3,
}

const ASC2INT = {
  "A": RPS.ROCK,
  "B": RPS.PAPER,
  "C": RPS.SCISSORS,
  "X": RPS.ROCK,
  "Y": RPS.PAPER,
  "Z": RPS.SCISSORS,
};

const WIN_MAP = {
  [RPS.ROCK]: RPS.SCISSORS,
  [RPS.PAPER]: RPS.ROCK,
  [RPS.SCISSORS]: RPS.PAPER,
};

const REV_WIN_MAP = {
  [RPS.ROCK]: RPS.PAPER,
  [RPS.PAPER]: RPS.SCISSORS,
  [RPS.SCISSORS]: RPS.ROCK,
};

const flags = parse(Deno.args);
const isPart2 = flags.p2 || flags.part2;

const input = Deno.readTextFileSync("input.txt").split("\r\n");

const myScore = input.reduce((sum, line) => {
  const [theirMove, myMove] = line.split(" ");
  return sum + determine(theirMove, myMove);
}, 0);

console.log({ myScore, part: isPart2 ? 2 : 1 });

function determine(theirMove: string, myMove: string) {
  let [theirValue, myValue] = [theirMove, myMove].map((move) =>
    ASC2INT[move as keyof typeof ASC2INT]
  );

  if (isPart2) {
    switch (myMove) {
      // I want to lose.
      case "X": {
        myValue = WIN_MAP[theirValue];
        break;
      }

      // I want to draw.
      case "Y": {
        myValue = theirValue;
        break;
      }

      // I want to win.
      case "Z": {
        myValue = REV_WIN_MAP[theirValue];
        break;
      }
    }
  }

  // I won.
  if (WIN_MAP[myValue] === theirValue) {
    return 6 + myValue;
  }

  // Draw.
  if (myValue === theirValue) {
    return 3 + myValue;
  }

  // They won.
  return myValue;
}
