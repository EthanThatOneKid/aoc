class Agent {
  public controllees: Agent[] = [];
  public sequence: string[] = [];
  public x: number;
  public y: number;

  public constructor(
    public keypad: Keypad,
    public startButton: string,
    public controller?: Agent,
  ) {
    [this.x, this.y] = findButton(this.keypad, this.startButton);

    if (this.controller !== undefined) {
      this.controller.controllees.push(this);
    }
  }

  public activate(): void {
    const button = this.keypad[this.y][this.x];
    this.sequence.push(button);

    const direction = directions
      .findIndex((direction) => direction.type === button);
    if (direction !== -1) {
      this.x += directions[direction].dx;
      this.y += directions[direction].dy;
    } else if (button === "A") {
      this.controllees.forEach((controllee) => controllee.activate());
    }
  }
}

const numericKeypad: Keypad = [
  "789",
  "456",
  "123",
  " 0A",
];

const directionalKeypad: Keypad = [
  " ^A",
  "<v>",
];

type Keypad = string[];

const directions = [
  { type: "^", dx: 0, dy: -1 },
  { type: ">", dx: 1, dy: 0 },
  { type: "v", dx: 0, dy: 1 },
  { type: "<", dx: -1, dy: 0 },
];

type Direction = 0 | 1 | 2 | 3;

// deno --allow-read 2024/21/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input));
}

function part1(input: string): number {
  const codes = parseCodes(input);
  console.log({ codes });

  const me = new Agent(directionalKeypad, "A");
  const robot0 = new Agent(directionalKeypad, "A", me);
  const robot1 = new Agent(directionalKeypad, "A", robot0);
  const door = new Agent(numericKeypad, "A", robot1);
  console.log({ me, robot0, robot1, door });

  // TODO: How do I know what to button to seek?

  return 0;
}

function findButton(keypad: Keypad, button: string): [number, number] {
  for (let y = 0; y < keypad.length; y++) {
    for (let x = 0; x < keypad[y].length; x++) {
      if (keypad[y][x] !== button) {
        continue;
      }

      return [x, y];
    }
  }

  throw new Error(`Button ${button} not found in keypad`);
}

function findPaths(
  keypad: Keypad,
  start: [number, number],
  end: [number, number],
): Array<Direction[]> {
  const paths: Array<Direction[]> = [];
  const visited = new Set<string>();
  const queue: Array<[[number, number], Direction[]]> = [[start, []]];
  while (queue.length > 0) {
    const [[x, y], path] = queue.shift()!;
    if (x === end[0] && y === end[1]) {
      paths.push(path);
      continue;
    }

    const key = `${x},${y}`;
    if (visited.has(key)) {
      continue;
    }

    visited.add(key);
    for (let direction = 0; direction < directions.length; direction++) {
      const { dx, dy } = directions[direction];
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx < 0 || ny < 0 || nx >= keypad[0].length || ny >= keypad.length ||
        keypad[ny][nx] === " "
      ) {
        continue;
      }

      queue.push([[nx, ny], [...path, direction as Direction]]);
    }
  }

  return paths;
}

function parseCodes(input: string): string[] {
  return input.split("\n");
}
