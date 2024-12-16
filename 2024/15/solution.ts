const directions = ["^", ">", "v", "<"] as const;

const velocities = {
  "^": [-1, 0],
  ">": [0, 1],
  "v": [1, 0],
  "<": [0, -1],
} as const satisfies Record<Movement, [number, number]>;

type Movement = typeof directions[number];

// deno --allow-read 2024/15/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 2028
  console.log("Part 2", part2(input)); // 9021
}

function part1(input: string): number {
  const warehouse = parseWarehouse(input);
  while (step(warehouse)) {
    continue;
  }

  console.log(renderWarehouse(warehouse));
  return sumGPSCoordinates(warehouse);
}

function part2(input: string): number {
  const warehouse = parseWiderWarehouse(input);
  console.log(renderWiderWarehouse(warehouse));

  while (wideStep(warehouse)) {
    continue;
  }

  return 0;
  // return sumGPSCoordinates(warehouse);
}

function wideStep(warehouse: Warehouse): boolean {
  const movement = warehouse.movements.shift();
  if (movement === undefined) {
    return false;
  }

  wideMoveRobot(warehouse, movement);
  return true;
}

// Increment applicable axis 1 by 1 until the robot can't move more boxes.
function wideMoveRobot(warehouse: Warehouse, movement: Movement): void {
  const [dy, dx] = velocities[movement];

  // Find next available cell to move the box(es).
  const boxes: Array<Set<number>> = [new Set([warehouse.robot])];
  while (true) {
    const currentBoxes = new Set<number>();
    for (const previousBox of boxes.at(-1) ?? []) {
      for (let i = -1; i <= 1; i++) {
        if (!inWarehouse(warehouse, previousBox, dy, dx + i)) {
          continue;
        }

        const currentBox = previousBox +
          linearIndex(warehouse.width, dy, dx + i);
        if (!warehouse.boxes.has(currentBox)) {
          continue;
        }

        currentBoxes.add(currentBox);
      }
    }

    if (currentBoxes.size === 0) {
      break;
    }

    boxes.push(currentBoxes);
  }

  if (boxes.length > 1) {
    console.log({ boxes });

    // Move all the boxes.
    throw new Error("Not implemented");
  }

  // Move the robot.
  warehouse.robot += linearIndex(warehouse.width, dy, dx);
}

function sumGPSCoordinates(warehouse: Warehouse): number {
  return Array.from(generateGPSCoordinates(warehouse))
    .reduce((sum, gps) => sum + gps, 0);
}

function renderWiderWarehouse(warehouse: Warehouse): string {
  let result = "";
  for (let y = 0; y < warehouse.height; y++) {
    for (let x = 0; x < warehouse.width + 1; x++) {
      const index = linearIndex(warehouse.width, y, x);
      if (warehouse.robot === index) {
        result += "@";
      } else if (warehouse.boxes.has(index)) {
        result += "[]";
        x++;
      } else if (warehouse.walls.has(index)) {
        result += "#";
      } else {
        result += ".";
      }
    }

    result += "\n";
  }

  return result;
}

function renderWarehouse(warehouse: Warehouse): string {
  let result = "";
  for (let y = 0; y < warehouse.height; y++) {
    for (let x = 0; x < warehouse.width; x++) {
      const index = linearIndex(warehouse.width, y, x);
      if (warehouse.robot === index) {
        result += "@";
      } else if (warehouse.boxes.has(index)) {
        result += "O";
      } else if (warehouse.walls.has(index)) {
        result += "#";
      } else {
        result += ".";
      }
    }

    result += "\n";
  }

  return result;
}

function* generateGPSCoordinates(warehouse: Warehouse): Generator<number> {
  for (const box of warehouse.boxes) {
    const [y, x] = fromLinearIndex(warehouse.width, box);
    yield y * 100 + x;
  }
}

function fromLinearIndex(width: number, index: number): [number, number] {
  return [Math.floor(index / width), index % width];
}

function step(warehouse: Warehouse): boolean {
  const movement = warehouse.movements.shift();
  if (movement === undefined) {
    return false;
  }

  moveRobot(warehouse, movement);
  return true;
}

// Check if robot or box is hitting another box or wall.

function moveRobot(warehouse: Warehouse, movement: Movement): void {
  const [dy, dx] = velocities[movement];

  // Find next available cell to move the box.
  let i = 1;
  while (true) {
    if (!inWarehouse(warehouse, warehouse.robot, dy * i, dx * i)) {
      return;
    }

    const position = warehouse.robot +
      linearIndex(warehouse.width, dy * i, dx * i);
    if (warehouse.walls.has(position)) {
      return;
    }

    if (!warehouse.boxes.has(position)) {
      break;
    }

    i++;
  }

  if (i > 1) {
    // Remove the box in front of the robot.
    warehouse.boxes.delete(
      warehouse.robot + linearIndex(warehouse.width, dy, dx),
    );

    // Move the box in the next available cell.
    warehouse.boxes.add(
      warehouse.robot + linearIndex(warehouse.width, dy * i, dx * i),
    );
  }

  // Move the robot.
  warehouse.robot += linearIndex(warehouse.width, dy, dx);
}

function inWarehouse(
  warehouse: Warehouse,
  position: number,
  dy: number,
  dx: number,
): boolean {
  const x = position % warehouse.width + dx;
  const y = Math.floor(position / warehouse.width) + dy;

  if (x < 0 || x >= warehouse.width) {
    return false;
  }

  if (y < 0 || y >= warehouse.height) {
    return false;
  }

  return true;
}

function parseWiderWarehouse(input: string): Warehouse {
  const [matrixString, movementsString] = input.split("\n\n");
  const { walls, boxes, robot, height, width } = parseWiderMatrix(
    matrixString,
  );
  return {
    walls,
    boxes,
    robot,
    height,
    width,
    movements: parseMovements(movementsString),
  };
}

function parseWiderMatrix(input: string): Warehouse {
  const walls = new Set<number>();
  const boxes = new Set<number>();
  let height = 0;
  let width = 0;
  let robot = -1;
  input
    .split("\n")
    .forEach((line, y) =>
      line
        .split("")
        .forEach((cell, x) => {
          const index = linearIndex(
            line.length * 2 - 1,
            y,
            x * 2,
          );
          switch (cell) {
            case "#": {
              walls.add(index);
              walls.add(index + 1);
              break;
            }

            case "O": {
              boxes.add(index);
              break;
            }

            case "@": {
              robot = index;
              break;
            }
          }

          height = Math.max(height, y + 1);
          width = Math.max(width, x * 2 + 1);
        })
    );

  return { walls, boxes, robot, height, width, movements: [] };
}

function parseWarehouse(input: string): Warehouse {
  const [matrixString, movementsString] = input.split("\n\n");
  const { walls, boxes, robot, height, width } = parseMatrix(matrixString);
  return {
    walls,
    boxes,
    robot,
    height,
    width,
    movements: parseMovements(movementsString),
  };
}

function parseMatrix(matrixString: string): Warehouse {
  const walls = new Set<number>();
  const boxes = new Set<number>();
  let height = 0;
  let width = 0;
  let robot = -1;
  matrixString
    .split("\n")
    .forEach((line, y) =>
      line
        .split("")
        .forEach((cell, x) => {
          const index = linearIndex(line.length, y, x);
          switch (cell) {
            case "#": {
              walls.add(index);
              break;
            }

            case "O": {
              boxes.add(index);
              break;
            }

            case "@": {
              robot = index;
              break;
            }
          }

          height = Math.max(height, y + 1);
          width = Math.max(width, x + 1);
        })
    );

  return { walls, boxes, robot, height, width, movements: [] };
}

function linearIndex(width: number, y: number, x: number): number {
  return y * width + x;
}

function parseMovements(movementsString: string): Movement[] {
  return movementsString
    .split("\n")
    .map((line) => line.split("").map((movement) => movement as Movement))
    .flat();
}

interface Warehouse {
  height: number;
  width: number;
  walls: Set<number>;
  boxes: Set<number>;
  robot: number;
  movements: Movement[];
}
