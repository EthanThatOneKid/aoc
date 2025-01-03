// deno --allow-read 2024/18/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 22
  console.log("Part 2", part2(input)); // 6,1
}

function part1(input: string): number {
  const { size, limit } = environment("example");
  const corrupted = parseCorrupted(input, size, limit);
  const path = aStar(size, new Set(corrupted), 0, size * size - 1);
  return (path?.length ?? 0) - 1;
}

// What are the coordinates of the first byte that will prevent the exit from being reachable from your starting position? (Provide the answer as two integers separated by a comma with no other characters.)
function part2(input: string): string {
  const { size } = environment("example");
  const allCorrupted = parseCorrupted(input, size);

  // Use binary search to find the first byte that will prevent the exit from being reachable between 1024 and 0 limit.
  let lo = 0;
  let hi = allCorrupted.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) * 0.5);
    const path = aStar(
      size,
      new Set(allCorrupted.slice(0, mid)),
      0,
      size * size - 1,
    );
    if (path === null) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  const [x, y] = fromLinearIndex(size, allCorrupted[lo - 1]);
  return `${x},${y}`;
}

function environment(name: "example" | "input") {
  return {
    size: name === "example" ? 7 : 71,
    limit: name === "example" ? 12 : 1024,
  };
}

// Return the best path if it exists, otherwise null.
function aStar(
  size: number,
  corrupted: Set<number>,
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
      if (corrupted.has(neighbor)) {
        continue;
      }

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

function parseCorrupted(
  input: string,
  size: number,
  limit?: number,
): number[] {
  return input
    .split("\n")
    .map((line) => {
      const [x, y] = line.split(",").map((n) => parseInt(n));
      return linearIndex(size, y, x);
    })
    .filter((_, index) => limit === undefined || index < limit);
}

function fromLinearIndex(width: number, index: number): [number, number] {
  return [index % width, Math.floor(index / width)];
}

function linearIndex(width: number, y: number, x: number): number {
  return width * y + x;
}
