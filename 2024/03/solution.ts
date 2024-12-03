const MUL = "mul" as const;
const DO = "do" as const;
const DONT = "don't" as const;

// deno run --allow-read 2024/03/solution.ts ./my-input
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve(Deno.args[0] ?? "./input")),
  );
  console.log("Part 1", part1(input));
  console.log("Part 2", part2(input));
}

function part1(input: string): number {
  const instructions = findInstructions(input);
  const sum = instructions.reduce((result, instruction) => {
    switch (instruction.type) {
      case MUL: {
        return result + instruction.a * instruction.b;
      }

      default: {
        return result;
      }
    }
  }, 0);

  return sum;
}

function part2(input: string): number {
  const instructions = findInstructions(input);

  interface Accumulator {
    result: number;
    state: typeof DO | typeof DONT;
  }

  const { result: sum } = instructions.reduce(
    (
      { result, state }: Accumulator,
      instruction: Instruction,
    ): Accumulator => {
      switch (instruction.type) {
        case MUL: {
          if (state !== DO) {
            return { result, state };
          }

          return {
            result: result + instruction.a * instruction.b,
            state,
          };
        }

        case DO: {
          return { result, state: DO };
        }

        case DONT: {
          return { result, state: DONT };
        }

        default: {
          throw new Error("Unknown instruction type");
        }
      }
    },
    { result: 0, state: DO },
  );

  return sum;
}

interface MulInstruction extends BaseInstruction {
  type: typeof MUL;
  a: number;
  b: number;
}

interface BaseInstruction {
  start: number;
  end: number;
}

type Instruction = MulInstruction | DoInstruction | DontInstruction;

interface DoInstruction extends BaseInstruction {
  type: typeof DO;
}

interface DontInstruction extends BaseInstruction {
  type: typeof DONT;
}

function findInstructions(input: string): Instruction[] {
  const instructions: Instruction[] = [];
  let offset: number;
  let instruction = findInstruction(input);
  while (instruction) {
    instructions.push(instruction);
    offset = instruction.end;
    instruction = findInstruction(input, offset);
  }

  return instructions;
}

function findInstruction(input: string, offset = 0): Instruction | undefined {
  for (let i = offset; i < input.length; i++) {
    if (input[i] === "d") {
      const match = input.slice(i).match(/^do\(\)/);
      if (match) {
        return {
          type: DO,
          start: i,
          end: i + match[0].length,
        };
      }
    }

    if (input[i] === "d") {
      const match = input.slice(i).match(/^don\'t\(\)/);
      if (match) {
        return {
          type: DONT,
          start: i,
          end: i + match[0].length,
        };
      }
    }

    if (input[i] === "m") {
      const match = input.slice(i).match(/^mul\((\d{1,3}),(\d{1,3})\)/);
      if (match) {
        return {
          type: MUL,
          a: parseInt(match[1]),
          b: parseInt(match[2]),
          start: i,
          end: i + match[0].length,
        };
      }
    }
  }
}
