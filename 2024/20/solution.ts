// deno --allow-read 2024/20/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input));
}

function part1(input: string): number {
  const maze = parseMaze(input);
  return picoseconds(maze);
}

function picoseconds(maze: Maze): number {
  const path = aStar(
    maze.width,
    maze.walls,
    maze.start,
    maze.end,
  )!;
  return path.length - 1;
}

// The rules for cheating are very strict. Exactly once during a race, a program may disable collision for up to 2 picoseconds. This allows the program to pass through walls as if they were regular track. At the end of the cheat, the program must be back on normal track again; otherwise, it will receive a segmentation fault and get disqualified.

// From day 18.
function aStar(
  size: number,
  walls: Set<number>,
  start: number,
  end: number,
): number[] | null {
  const openSet = new Set([start]);
  const cameFrom = new Map<number, number>();
  const gScore = new Map<number, number>();
  const fScore = new Map<number, number>();

  gScore.set(start, 0);
  fScore.set(start, heuristic(size, start, end));
  while (openSet.size > 0) {
    const current = [...openSet].reduce((a, b) => {
      return fScore.get(a)! < fScore.get(b)! ? a : b;
    });
    if (current === end) {
      return reconstructPath(cameFrom, current);
    }

    openSet.delete(current);
    for (const neighbor of neighbors(size, current)) {
      if (walls.has(neighbor)) {
        continue;
      }

      // Move to neighbor if score indicates it's better.
      const tentativeGScore = gScore.get(current)! + 1;
      if (
        !gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)!
      ) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(
          neighbor,
          tentativeGScore + heuristic(size, neighbor, end),
        );
        openSet.add(neighbor);
      }
    }
  }

  return null;
}

function heuristic(width: number, a: number, b: number): number {
  const [ax, ay] = fromLinearIndex(width, a);
  const [bx, by] = fromLinearIndex(width, b);
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function reconstructPath(
  cameFrom: Map<number, number>,
  current: number,
): number[] {
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    path.unshift(current);
  }

  return path;
}

function neighbors(size: number, index: number): number[] {
  const [x, y] = fromLinearIndex(size, index);
  const potentialNeighbors = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];

  return potentialNeighbors
    .filter(([nx, ny]) => nx >= 0 && nx < size && ny >= 0 && ny < size)
    .map(([nx, ny]) => linearIndex(size, ny, nx));
}

// From day 16.
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

function linearIndex(width: number, dy: number, dx: number): number {
  return dy * width + dx;
}

function fromLinearIndex(width: number, index: number): [number, number] {
  return [index % width, Math.floor(index / width)];
}
