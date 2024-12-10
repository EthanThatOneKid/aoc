// deno run --allow-read 2024/10/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./my-input")),
  );
  console.log("Part 1", part1(input));
}

function part1(input: string): number {
  const topology = parseTopology(input);

  let sum = 0;
  for (let row = 0; row < topology.length; row++) {
    for (let column = 0; column < topology[row].length; column++) {
      const trailhead = topology[row][column] === 0;
      if (!trailhead) {
        continue;
      }

      sum += score(topology, row, column).size;
    }
  }

  return sum;
}

function score(topology: Topology, row: number, column: number): Set<number> {
  const columns = topology[0].length;
  const height = topology[row][column];
  if (height === 9) {
    return new Set([linearIndex(columns, row, column)]);
  }

  const visited = new Set<number>();
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (Math.abs(dx) === Math.abs(dy)) {
        continue;
      }

      const newRow = row + dx;
      const newColumn = column + dy;
      if (
        newRow < 0 ||
        newRow >= topology.length ||
        newColumn < 0 ||
        newColumn >= topology[newRow].length ||
        topology[newRow][newColumn] !== height + 1
      ) {
        continue;
      }

      score(topology, newRow, newColumn)
        .forEach((index) => visited.add(index));
    }
  }

  return visited;
}

function linearIndex(columns: number, row: number, column: number): number {
  return row * columns + column;
}

function parseTopology(input: string): Topology {
  return input
    .split("\r\n")
    .map((line) => line.split("").map((digit) => parseInt(digit)));
}

type Topology = number[][];
