// deno --allow-read 2024/14/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 12
  console.log("Part 2", part2(input)); // 1
}

function part1(input: string): number {
  const width = 11;
  const height = 7;
  const robots = parseRobots(input);
  for (let i = 0; i < 100; i++) {
    robots.forEach((robot) => step(width, height, robot));
  }

  return safetyFactor(width, height, robots);
}

function part2(input: string): number {
  const width = 11;
  const height = 7;
  const robots = parseRobots(input);

  let iterations = 0;
  while (true) {
    const positions = allUniquePositions(width, robots);
    if (positions.size === robots.length) {
      break;
    }

    robots.forEach((robot) => step(width, height, robot));
    iterations++;
  }

  return iterations;
}

function allUniquePositions(width: number, robots: Robot[]): Set<number> {
  return new Set(
    robots.map((robot) =>
      linearIndex(width, robot.position.x, robot.position.y)
    ),
  );
}

function linearIndex(width: number, x: number, y: number): number {
  return y * width + x;
}

function safetyFactor(
  width: number,
  height: number,
  robots: Robot[],
): number {
  const quadrants = groupByQuadrant(width, height, robots);
  return quadrants["0"]!.length * quadrants["1"]!.length *
    quadrants["2"]!.length * quadrants["3"]!.length;
}

function groupByQuadrant(
  width: number,
  height: number,
  robots: Robot[],
) {
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);
  return Object.groupBy(robots, (robot) => {
    if (robot.position.x < halfWidth) {
      if (robot.position.y < halfHeight) {
        return 0;
      } else if (robot.position.y > halfHeight) {
        return 2;
      }
    } else if (robot.position.x > halfWidth) {
      if (robot.position.y < halfHeight) {
        return 1;
      } else if (robot.position.y > halfHeight) {
        return 3;
      }
    }

    return -1;
  });
}

function _renderRobots(width: number, height: number, robots: Robot[]) {
  const matrix = Array.from({ length: height }, (_, _y) => {
    return Array.from({ length: width }, (_, _x) => 0);
  });
  robots.forEach((robot) => {
    matrix[robot.position.y][robot.position.x] += 1;
  });
  return matrix.map((row) => {
    return row.map((cell) => (cell > 0 ? cell : ".")).join("");
  });
}

function step(width: number, height: number, robot: Robot): void {
  robot.position.x += robot.velocity.x;
  robot.position.x %= width;
  if (robot.position.x < 0) {
    robot.position.x += width;
  }

  robot.position.y += robot.velocity.y;
  robot.position.y %= height;
  if (robot.position.y < 0) {
    robot.position.y += height;
  }
}

function parseRobots(input: string): Robot[] {
  return input
    .split("\n")
    .reduce((robots: Robot[], line) => {
      const [x, y, vx, vy] = line
        .match(/-?\d+/g)!
        .map((n) => parseInt(n));
      robots.push({
        position: { x, y },
        velocity: { x: vx, y: vy },
      });
      return robots;
    }, []);
}

interface Robot {
  position: Vector2D;
  velocity: Vector2D;
}

interface Vector2D {
  x: number;
  y: number;
}
