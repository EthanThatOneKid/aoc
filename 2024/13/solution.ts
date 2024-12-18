// deno --allow-read 2024/13/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 480
  console.log("Part 2", part2(input)); // 875318608908
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
  const determinant = aX * bY - aY * bX;
  if (determinant === 0) {
    return 0;
  }

  const a = Math.round((bY * prizeX - bX * prizeY) / determinant);
  const b = Math.round((aX * prizeY - aY * prizeX) / determinant);
  if (a * aX + b * bX !== prizeX || a * aY + b * bY !== prizeY) {
    return 0;
  }

  return a * 3 + b;
}

function parseMachines(input: string): Machine[] {
  return input
    .matchAll(
      /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g,
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
