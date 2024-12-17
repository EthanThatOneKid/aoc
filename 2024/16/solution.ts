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
    new URL(import.meta.resolve("./my-input")),
  );
  console.log("Part 1", part1(input)); // 7036
}

function part1(input: string): number {
  const maze = parseMaze(input);
  const lowestScore = traverse(maze);
  return lowestScore;
}

// bfs
function traverse(maze: Maze): number {
  let lowestScore = Infinity;
  const visited = new Map<number, number>();
  const reindeers: Reindeer[] = [makeReindeer(maze.start)];
  while (reindeers.length > 0) {
    const reindeer = reindeers.shift()!;
    if (reindeer.score > lowestScore) {
      continue;
    }

    if (rememberReindeer(visited, reindeer)) {
      continue;
    }

    if (reindeer.position === maze.end) {
      lowestScore = Math.min(lowestScore, reindeer.score);
      continue;
    }

    // Attempt to move forward.
    const nextReindeer = makeReindeer(
      translate(
        maze.width,
        reindeer.position,
        reindeer.direction,
      ),
      reindeer.score + 1,
      reindeer.direction,
    );
    if (!maze.walls.has(nextReindeer.position)) {
      reindeers.push(nextReindeer);
    }

    // Rotate clockwise.
    reindeers.push(
      makeReindeer(
        reindeer.position,
        reindeer.score + 1_000,
        rotate(reindeer.direction),
      ),
    );

    // Rotate counter-clockwise.
    reindeers.push(
      makeReindeer(
        reindeer.position,
        reindeer.score + 1_000,
        rotate(reindeer.direction, true),
      ),
    );
  }

  return lowestScore;
}

function memorizeReindeer(visited: Map<number, number>, reindeer: Reindeer) {
  const reindeerID = toReindeerID(reindeer);
  visited.set(reindeerID, reindeer.score);
}

function rememberReindeer(visited: Map<number, number>, reindeer: Reindeer) {
  const reindeerID = toReindeerID(reindeer);
  const remembered = visited.get(reindeerID);
  const remembers = remembered !== undefined && remembered <= reindeer.score;
  if (!remembers) {
    memorizeReindeer(visited, reindeer);
  }

  return remembers;
}

function toReindeerID(reindeer: Reindeer): number {
  return reindeer.position * directions.length + reindeer.direction;
}

function makeReindeer(
  position: number,
  score = 0,
  direction: Direction = 0,
): Reindeer {
  return { position, score, direction };
}

interface Reindeer {
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

  input.split("\r\n").forEach((line, y) => {
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
