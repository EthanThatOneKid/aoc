const keypadNumeric: Keypad = [
  "789",
  "456",
  "123",
  " 0A",
];

const keypadDirectional: Keypad = [
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

class Agent {
  public sequence: string[] = [];

  public constructor(
    public keypad: Keypad,
    public x: number,
    public y: number,
    public agent?: Agent,
  ) {}

  public get root(): Agent {
    if (this.agent === undefined) {
      return this;
    }

    return this.agent.root;
  }

  // Goal: find shortest sequence of button presses to reach target button.
  public press(button: string): void {
    const sequences = findSequences(
      this.keypad,
      [this.x, this.y],
      findButton(this.keypad, button),
    );

    // Find which path results in the shortest sequence of button presses.
    let cheapestIndex = -1;
    let cheapestLength = Infinity;
    for (let i = 0; i < sequences.length; i++) {
      const sequence = sequences[i];
      if (this.agent !== undefined) {
        const agent = this.agent.clone();
        sequence.forEach((direction) => agent.move(direction));
        const rootLength = agent.root.sequence.length;
        if (cheapestIndex === -1 || rootLength < cheapestLength) {
          cheapestIndex = i;
          cheapestLength = rootLength;
        }
      } else {
        console.log({
          noAgent: sequence.map((d) => directions[d].button).join(""),
        });
      }
    }

    if (cheapestIndex > -1) {
      sequences[cheapestIndex]
        .forEach((direction) => this.agent?.move(direction));
    }

    this.agent?.press("A");
    this.sequence.push(button);
  }

  private move(direction: Direction): void {
    this.press(directions[direction].button);
    this.x += directions[direction].dx;
    this.y += directions[direction].dy;
  }

  private clone(): Agent {
    const agent = new Agent(this.keypad, this.x, this.y, this.agent);
    agent.sequence = [...this.sequence];
    return agent;
  }

  static fromKeypad(
    keypad: Keypad,
    button: string,
    agent?: Agent,
  ): Agent {
    return new Agent(keypad, ...findButton(keypad, button), agent);
  }
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
  const me = Agent.fromKeypad(keypadDirectional, "A");
  const robot1 = Agent.fromKeypad(keypadDirectional, "A", me);
  const robot0 = Agent.fromKeypad(keypadDirectional, "A", robot1);
  const door = Agent.fromKeypad(keypadNumeric, "A", robot0);

  for (const code of codes) {
    for (const button of code) {
      door.press(button);
    }

    // TODO: wip https://adventofcode.com/2024/day/21
    console.log({
      sequenceDoor: door.sequence.join(""), // 029A
      sequenceRobot0: robot0.sequence.join(""), // <A^A>^^AvvvA
      sequenceRobot1: robot1.sequence.join(""), // v<<A>>^A<A>AvA<^AA>A<vAAA>^A
      sequenceMe: me.sequence.join(""), // <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
      sequenceRoot: door.root.sequence.join(""),
    });
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

  throw new Error(`Button ${button} not found in keypad ${keypad}`);
}

function findSequences(
  keypad: Keypad,
  start: [number, number],
  end: [number, number],
): Array<Direction[]> {
  const sequences: Array<Direction[]> = [];
  const visited = new Set<string>();
  const queue: Array<[[number, number], Direction[]]> = [[start, []]];
  while (queue.length > 0) {
    const [[x, y], path] = queue.shift()!;
    if (x === end[0] && y === end[1]) {
      sequences.push(path);
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

  return sequences;
}

function parseCodes(input: string): string[] {
  return input.split("\n");
}
