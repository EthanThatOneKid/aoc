import { array } from "npm:vectorious@6.1.14";

// deno --allow-read 2024/13/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 480
}

function part1(input: string): number {
  const machines = parseMachines(input);
  return machines.reduce((sum, machine) => sum + cheapestPrize(machine), 0);
}

function cheapestPrize(machine: Machine): number {
  const { buttonA: [x0, x1], buttonB: [y0, y1], prize: [z0, z1] } = machine;
  const x = array([[x0, y0], [x1, y1]]).solve(array([[z0], [z1]]));
  const a = x.get(0, 0);
  const b = x.get(1, 0);
  if (!isWhole(a) || !isWhole(b)) {
    return 0;
  }

  return 3 * Math.round(a) + Math.round(b);
}

function isWhole(n: number, negligeable = 0.0000001): boolean {
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
