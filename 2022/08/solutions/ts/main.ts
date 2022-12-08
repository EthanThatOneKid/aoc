// Path: 2022/08/solutions/ts/main.ts
//
// Run:
// cd 2022/08/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

function part1(input: string[]) {
  let visibleTrees = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (treeIsVisible(input, i, j)) {
        visibleTrees++;
      }
    }
  }
  console.log({ visibleTrees });
}

// Check 4 directions.
function treeIsVisible(trees: string[], i: number, j: number) {
  const tree = Number(trees[i][j]);
  if (
    i === 0 || j === 0 || j === trees[i].length - 1 || i === trees.length - 1
  ) {
    return true;
  }

  // Check if visible from top.
  for (let k = 0; k < i; k++) {
    if (Number(trees[k][j]) >= tree) {
      break;
    }
    if (k === i - 1) {
      return true;
    }
  }

  // Check if visible from right.
  for (let k = j + 1; k < trees[i].length; k++) {
    if (Number(trees[i][k]) >= tree) {
      break;
    }
    if (k === trees[i].length - 1) {
      return true;
    }
  }

  // Check if visible from bottom.
  for (let k = i + 1; k < trees.length; k++) {
    if (Number(trees[k][j]) >= tree) {
      break;
    }
    if (k === trees.length - 1) {
      return true;
    }
  }

  // Check if visible from left.
  for (let k = 0; k < j; k++) {
    if (Number(trees[i][k]) >= tree) {
      break;
    }
    if (k === j - 1) {
      return true;
    }
  }

  return false;
}

function part2(input: string[]) {
  let highestScenicScore = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const gimmeScore = scenicScore(input, i, j);
      if (gimmeScore > highestScenicScore) {
        highestScenicScore = gimmeScore;
      }
    }
  }
  console.log({ highestScenicScore });
}

function scenicScore(trees: string[], i: number, j: number): number {
  const tree = Number(trees[i][j]);

  let topScore = 0;
  for (let k = i - 1; k >= 0; k--) {
    topScore++;
    if (Number(trees[k][j]) >= tree) {
      break;
    }
  }

  let rightScore = 0;
  for (let k = j + 1; k < trees[i].length; k++) {
    rightScore++;
    if (Number(trees[i][k]) >= tree) {
      break;
    }
  }

  let bottomScore = 0;
  for (let k = i + 1; k < trees.length; k++) {
    bottomScore++;
    if (Number(trees[k][j]) >= tree) {
      break;
    }
  }

  let leftScore = 0;
  for (let k = j - 1; k >= 0; k--) {
    leftScore++;
    if (Number(trees[i][k]) >= tree) {
      break;
    }
  }

  const score = [topScore, rightScore, bottomScore, leftScore].reduce(
    (a, b) => a * b,
    1,
  );

  return score;
}

const input = Deno.readTextFileSync("input.txt").split("\r\n");

isPart2 ? part2(input) : part1(input);
