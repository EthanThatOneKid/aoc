const operations = {
  "+": (a: number, b: number) => a + b,
  "*": (a: number, b: number) => a * b,
} as const;

// deno run --allow-read 2024/07/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./my-input")),
  );
  console.log("Part 1", part1(input));
}

function part1(input: string): number {
  const equations = parseInput(input);
  const trueEquations = equations.filter((equation) =>
    findTrueOperators(operations, equation) !== undefined
  );
  const sum = trueEquations.reduce(
    (result, equation) => result + equation.testValue,
    0,
  );
  return sum;
}

function findTrueOperators(
  fns: OperatorFns,
  equation: Equation,
): string[] | undefined {
  for (
    const operators of generateOperators(
      Object.keys(fns),
      equation.numbers.length - 1,
    )
  ) {
    if (
      evaluateEquation(fns, equation.numbers, operators) ===
        equation.testValue
    ) {
      return operators;
    }
  }
}

function evaluateEquation(
  fns: OperatorFns,
  numbers: number[],
  operators: string[],
): number {
  return numbers.reduce((acc, number, index) => {
    if (index === 0) {
      return number;
    }

    return fns[operators[index - 1]](acc, number);
  }, 0);
}

type OperatorFns = Record<string, (a: number, b: number) => number>;

function* generateOperators(
  operators: string[],
  length: number,
): Generator<string[]> {
  if (length === 0) {
    yield [];
    return;
  }

  for (const operator of operators) {
    for (const rest of generateOperators(operators, length - 1)) {
      yield [operator, ...rest];
    }
  }
}

function parseInput(input: string): Equation[] {
  return input
    .split("\n")
    .map((line) => {
      const [testValue, numbers] = line.split(": ");
      return {
        testValue: parseInt(testValue),
        numbers: numbers.split(" ").map((n) => parseInt(n)),
      };
    });
}

interface Equation {
  testValue: number;
  numbers: number[];
}
