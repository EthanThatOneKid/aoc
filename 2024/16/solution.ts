const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
] as const satisfies Array<[number, number]>;

type Direction = 0 | 1 | 2 | 3;

// deno --allow-read 2024/16/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 7036
  console.log("Part 2", part2(input)); // want 45, have 37
}

function part1(input: string): number {
  const maze = parseMaze(input);
  return findLowestScore(traverse(maze), maze.end);
}

function part2(input: string): number {
  const maze = parseMaze(input);
  const bestTiles = findBestTiles(traverse(maze), maze.end);
  console.log(renderBestTiles(maze, bestTiles));
  return bestTiles.size;
}

function renderBestTiles(
  { width, height, walls }: Maze,
  tiles: Set<number>,
): string {
  return Array.from(
    { length: height },
    (_, y) =>
      Array.from({ length: width }, (_, x) => {
        const index = linearIndex(width, y, x);
        if (tiles.has(index)) {
          return "O";
        }

        if (walls.has(index)) {
          return "#";
        }

        return ".";
      }).join(""),
  ).join("\n");
}

function findBestTiles(visited: ReindeerMemory, end: number): Set<number> {
  const lowestScore = findLowestScore(visited, end);
  const bestPaths = visited
    .values()
    .filter(
      ({ score, path }) => score === lowestScore && path.at(-1) === end,
    )
    .map(({ path }) => path);
  return new Set(bestPaths.flatMap((path) => path));
}

function findLowestScore(visited: ReindeerMemory, end: number): number {
  return Math.min(
    ...visited
      .values()
      .filter(({ path }) => path.at(-1) === end)
      .map(({ score }) => score),
  );
}

// bfs
function traverse(maze: Maze): ReindeerMemory {
  const visited: ReindeerMemory = new Map();
  const reindeers: Reindeer[] = [makeReindeer(-1, maze.start)];
  while (reindeers.length > 0) {
    const reindeer = reindeers.shift()!;
    if (rememberReindeer(visited, reindeer)) {
      continue;
    }

    if (reindeer.position === maze.end) {
      continue;
    }

    // Attempt to move forward.
    const nextReindeer = makeReindeer(
      reindeer.id,
      translate(maze.width, reindeer.position, reindeer.direction),
      reindeer.score + 1,
      reindeer.direction,
    );
    if (!maze.walls.has(nextReindeer.position)) {
      reindeers.push(nextReindeer);
    }

    // Rotate clockwise.
    reindeers.push(
      makeReindeer(
        reindeer.id,
        reindeer.position,
        reindeer.score + 1_000,
        rotate(reindeer.direction),
      ),
    );

    // Rotate counter-clockwise.
    reindeers.push(
      makeReindeer(
        reindeer.id,
        reindeer.position,
        reindeer.score + 1_000,
        rotate(reindeer.direction, true),
      ),
    );
  }

  return visited;
}

function rememberReindeer(
  visited: ReindeerMemory,
  reindeer: Reindeer,
): boolean {
  const remembered = visited.get(reindeer.id);
  if (
    (remembered === undefined ||
      remembered.score > reindeer.score)
  ) {
    memorizeReindeer(visited, reindeer);
    return false;
  }

  return true;
}

function memorizeReindeer(visited: ReindeerMemory, reindeer: Reindeer): void {
  visited.set(
    reindeer.id,
    {
      score: reindeer.score,
      path: [
        ...visited.get(reindeer.previousID)?.path ?? [],
        reindeer.position,
      ],
    },
  );
}

type ReindeerMemory = Map<number, { score: number; path: number[] }>;

function makeReindeer(
  previousID: number,
  position: number,
  score = 0,
  direction: Direction = 0,
): Reindeer {
  return {
    id: position * directions.length + direction,
    previousID,
    position,
    score,
    direction,
  };
}

interface Reindeer {
  id: number;
  previousID: number;
  score: number;
  position: number;
  direction: Direction;
}

function translate(
  width: number,
  position: number,
  direction: Direction,
): number {
  const [dy, dx] = directions[direction];
  return position + linearIndex(width, dy, dx);
}

function rotate(direction: Direction, counterClockwise = false): Direction {
  const newDirection = direction + (counterClockwise ? -1 : 1);
  if (newDirection === -1) {
    return 3;
  }

  return newDirection % 4 as Direction;
}

function linearIndex(width: number, dy: number, dx: number): number {
  return dy * width + dx;
}

function parseMaze(input: string): Maze {
  const walls = new Set<number>();
  let width = 0;
  let height = 0;
  let start = -1;
  let end = -1;

  input.split("\n").forEach((line, y) => {
    width = line.length;
    height = Math.max(height, y + 1);

    for (let x = 0; x < line.length; x++) {
      const index = linearIndex(width, y, x);
      switch (line[x]) {
        case "#": {
          walls.add(index);
          break;
        }

        case "S": {
          start = index;
          break;
        }

        case "E": {
          end = index;
          break;
        }
      }
    }
  });

  return { walls, width, height, start, end };
}

interface Maze {
  walls: Set<number>;
  width: number;
  height: number;
  start: number;
  end: number;
}
