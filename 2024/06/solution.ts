const directions = ["^", ">", "v", "<"] as const;

const velocities = {
  "^": [-1, 0],
  ">": [0, 1],
  "v": [1, 0],
  "<": [0, -1],
} as const satisfies Record<Direction, [number, number]>;

type Direction = typeof directions[number];

// deno run --allow-read 2024/06/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input));
  // console.log("Part 2", part2(input));
}

function part1(input: string): number {
  const { situation, guard } = parseInput(input);
  const visited = visit(situation, guard.direction, guard.row, guard.column);
  return visited.size;
}

function visit(
  situation: Situation,
  direction: number,
  row: number,
  column: number,
): Set<number> {
  const visited = new Set<number>();
  const columns = situation[0].length;
  const rows = situation.length;

  let currentRow = row;
  let currentColumn = column;
  let currentDirection = direction;
  while (true) {
    const [dRow, dColumn] = velocities[directions[currentDirection]];
    const newRow = currentRow + dRow;
    const newCol = currentColumn + dColumn;
    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= columns) {
      break;
    }

    if (situation[newRow][newCol] === 1) {
      currentDirection = (currentDirection + 1) % 4;
      continue;
    }

    visited.add(linearIndex(columns, newRow, newCol));
    currentRow = newRow;
    currentColumn = newCol;
  }

  return visited;
}

function linearIndex(width: number, row: number, column: number): number {
  return row * width + column;
}

function parseInput(input: string): Input {
  return {
    situation: parseSituation(input),
    guard: parseGuard(input),
  };
}

interface Input {
  situation: Situation;
  guard: Guard;
}

type Situation = number[][];

interface Guard {
  row: number;
  column: number;
  direction: number;
}

function parseGuard(input: string): Guard {
  let guardRow = -1;
  let guardColumn = -1;
  let guardDirection = -1;

  input.split("\n").some((line, rowIndex) => {
    return line.split("").some((character, columnIndex) => {
      const direction = directions.indexOf(character as Direction);
      if (direction !== -1) {
        guardRow = rowIndex;
        guardColumn = columnIndex;
        guardDirection = direction;
        return true;
      }

      return false;
    });
  });

  return {
    row: guardRow,
    column: guardColumn,
    direction: guardDirection,
  };
}

function parseSituation(input: string): Situation {
  return input
    .split("\n")
    .map((line) =>
      line.split("").map((character) => character === "#" ? 1 : 0)
    );
}
