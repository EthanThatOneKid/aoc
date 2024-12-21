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
  { button: "^", dx: 0, dy: -1 },
  { button: ">", dx: 1, dy: 0 },
  { button: "v", dx: 0, dy: 1 },
  { button: "<", dx: -1, dy: 0 },
];

type Direction = 0 | 1 | 2 | 3;

class KeypadAgent implements Agent {
  public sequence: string[] = [];

  public constructor(
    public keypad: Keypad,
    public x: number,
    public y: number,
    public agent?: Agent,
  ) {}

  public press(button: string): void {
    const [x, y] = findButton(this.keypad, button);
    const paths = findPaths(this.keypad, [this.x, this.y], [x, y]);

    const [path] = paths;
    for (const direction of path) {
      this.agent?.press(directions[direction].button);
      this.x += directions[direction].dx;
      this.y += directions[direction].dy;
    }

    this.sequence.push(button);
  }

  static fromStartButton(
    keypad: Keypad,
    button: string,
    agent?: Agent,
  ): KeypadAgent {
    return new KeypadAgent(keypad, ...findButton(keypad, button), agent);
  }
}

class DummyAgent implements Agent {
  public sequence: string[] = [];

  public press(button: string): void {
    this.sequence.push(button);
  }
}

interface Agent {
  press(button: string): void;
}

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

  // const me = new Agent(directionalKeypad, "A");
  // const robot1 = new Agent(directionalKeypad, "A", me);
  const dummy = new DummyAgent();
  const robot0 = KeypadAgent.fromStartButton(directionalKeypad, "A", dummy); // , robot1);
  const door = KeypadAgent.fromStartButton(numericKeypad, "A", robot0);

  for (const code of codes) {
    for (const button of code) {
      door.press(button);
    }

    // TODO: wip https://adventofcode.com/2024/day/21
    console.log({ sequence: robot0.sequence });
    throw new Error("Not implemented");
  }

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

  const minLength = Math.min(...paths.map((path) => path.length));
  return paths.filter((path) => path.length === minLength);
}

function parseCodes(input: string): string[] {
  return input.split("\n");
}
