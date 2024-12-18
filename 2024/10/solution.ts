// deno run --allow-read 2024/10/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 36
  console.log("Part 2", part2(input)); // 81
}

function part1(input: string): number {
  const topology = parseTopology(input);

  let sum = 0;
  for (const [row, column] of walkTrailheads(topology)) {
    sum += score(topology, row, column).size;
  }

  return sum;
}

function part2(input: string): number {
  const topology = parseTopology(input);

  let sum = 0;
  for (const [row, column] of walkTrailheads(topology)) {
    sum += rating(topology, row, column);
  }

  return sum;
}

function* walkTrailheads(topology: Topology): Generator<[number, number]> {
  for (let row = 0; row < topology.length; row++) {
    for (let column = 0; column < topology[row].length; column++) {
      if (topology[row][column] === 0) {
        yield [row, column];
      }
    }
  }
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

function rating(topology: Topology, row: number, column: number): number {
  const height = topology[row][column];
  if (height === 9) {
    return 1;
  }

  let value = 0;
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

      value += rating(topology, newRow, newColumn);
    }
  }

  return value;
}

function linearIndex(columns: number, row: number, column: number): number {
  return row * columns + column;
}

function parseTopology(input: string): Topology {
  return input
    .split("\n")
    .map((line) => line.split("").map((digit) => parseInt(digit)));
}

type Topology = number[][];
