import type { Found } from "./check.ts";
import { check } from "./check.ts";

// deno run --allow-read 2024/04/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./my-input")),
  );
  console.log("Part 1", part1(input));
  console.log("Part 2", part2(input));
}

function part1(input: string): number {
  const matrix = parseInput(input);
  const results = findAll(matrix, "XMAS");
  return results.length;
}

function part2(input: string): number {
  const matrix = parseInput(input);

  let sum = 0;
  const diagonals: Found[] = [];
  for (const found of findAll(matrix, "MAS")) {
    if (!found.direction.startsWith("diagonal")) {
      continue;
    }

    if (diagonals.some((pair) => cross(pair, found))) {
      sum++;
    }

    diagonals.push(found);
  }

  return sum;
}

function findAll(
  matrix: string[][],
  searchWord: string,
): Found[] {
  const results: Found[] = [];
  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
      if (!searchWord.startsWith(matrix[row][column])) {
        continue;
      }

      results.push(...check(matrix, searchWord, row, column));
    }
  }

  return results;
}

function cross(a: Found, b: Found): boolean {
  if (
    !(a.characters[1].row === b.characters[1].row &&
      a.characters[1].column === b.characters[1].column)
  ) {
    return false;
  }

  switch (a.direction) {
    case "diagonal-down":
    case "diagonal-down-backwards": {
      return b.direction === "diagonal-up" ||
        b.direction === "diagonal-up-backwards";
    }

    case "diagonal-up":
    case "diagonal-up-backwards": {
      return b.direction === "diagonal-down" ||
        b.direction === "diagonal-down-backwards";
    }

    default: {
      return false;
    }
  }
}

function parseInput(input: string): string[][] {
  return input.split("\n").map((line) => line.split(""));
}
