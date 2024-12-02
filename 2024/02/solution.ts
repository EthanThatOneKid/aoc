// deno run --allow-read 2024/02/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input));
  console.log("Part 2", part2(input));
}

function part1(input: string): number {
  const reports = parseInput(input);
  const sum = reports.reduce((result, report) => {
    if (safe(report)) {
      return result + 1;
    }

    return result;
  }, 0);

  return sum;
}

function part2(input: string): number {
  const reports = parseInput(input);
  const sum = reports.reduce((result, report) => {
    if (dampenedSafe(report)) {
      return result + 1;
    }

    return result;
  }, 0);

  return sum;
}

function safe(levels: number[]) {
  return increasing(levels) || decreasing(levels);
}

function dampenedSafe(levels: number[]) {
  if (safe(levels)) {
    return true;
  }

  for (const dampened of dampen(levels)) {
    if (safe(dampened)) {
      return true;
    }
  }

  return false;
}

function increasing(levels: number[]) {
  for (let i = 1; i < levels.length; i++) {
    const increase = levels[i] - levels[i - 1];
    if (increase < 1 || increase > 3) {
      return false;
    }
  }

  return true;
}

function decreasing(levels: number[]) {
  for (let i = 1; i < levels.length; i++) {
    const decrease = levels[i] - levels[i - 1];
    if (decrease > -1 || decrease < -3) {
      return false;
    }
  }

  return true;
}

function* dampen(levels: number[]) {
  for (let i = 0; i < levels.length; i++) {
    yield levels.slice(0, i).concat(levels.slice(i + 1));
  }
}

function parseInput(input: string): number[][] {
  return input
    .split("\n")
    .map((line) => line.split(" ").map((num) => parseInt(num)));
}
