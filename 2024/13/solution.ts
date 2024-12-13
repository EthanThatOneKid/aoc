import { array } from "npm:vectorious@6.1.14";

// deno --allow-read 2024/13/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 480
  console.log("Part 2", part2(input)); // 416082282239
}

function part1(input: string): number {
  const machines = parseMachines(input);
  return machines.reduce((sum, machine) => sum + cheapestPrize(machine), 0);
}

function part2(input: string): number {
  const machines = parseMachines(input);
  return machines.reduce(
    (sum, machine) => sum + cheapestPrize(fixMachine(machine)),
    0,
  );
}

function fixMachine(
  { buttonA, buttonB, prize: [prize0, prize1] }: Machine,
  fix = 10_000_000_000_000,
): Machine {
  return {
    buttonA,
    buttonB,
    prize: [prize0 + fix, prize1 + fix],
  };
}

function cheapestPrize(machine: Machine): number {
  const { buttonA: [aX, aY], buttonB: [bX, bY], prize: [prizeX, prizeY] } =
    machine;
  const x = array([[aX, bX], [aY, bY]]).solve(array([[prizeX], [prizeY]]));
  const a = x.get(0, 0);
  const b = x.get(1, 0);
  if (!isWhole(a) || !isWhole(b)) {
    return 0;
  }

  return 3 * Math.round(a) + Math.round(b);
}

function isWhole(n: number, negligeable = 0.0000000000001): boolean {
  const diff = n - Math.floor(n);
  if (diff > negligeable && diff < 1 - negligeable) {
    return false;
  }

  return true;
}

function parseMachines(input: string): Machine[] {
  return input
    .matchAll(
      /Button A: X\+(\d+), Y\+(\d+)\r\nButton B: X\+(\d+), Y\+(\d+)\r\nPrize: X=(\d+), Y=(\d+)/g,
    )
    .map((match): Machine => ({
      buttonA: [parseInt(match[1]), parseInt(match[2])],
      buttonB: [parseInt(match[3]), parseInt(match[4])],
      prize: [parseInt(match[5]), parseInt(match[6])],
    }))
    .toArray();
}

interface Machine {
  buttonA: [number, number];
  buttonB: [number, number];
  prize: [number, number];
}
