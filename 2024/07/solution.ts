const operatorFns = {
  "+": (a: number, b: number) => a + b,
  "*": (a: number, b: number) => a * b,
} as const;

// deno run --allow-read 2024/07/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input));
  console.log("Part 2", part2(input));
}

function part1(input: string): number {
  const equations = parseInput(input);
  return sumTrueEquations(operatorFns, equations);
}

function part2(input: string): number {
  const equations = parseInput(input);
  return sumTrueEquations(
    {
      ...operatorFns,
      "||": (a: number, b: number) => parseInt(`${a}${b}`),
    },
    equations,
  );
}

function sumTrueEquations(fns: OperatorFns, equations: Equation[]): number {
  return equations.reduce(
    (sum, equation) =>
      findTrueOperators(fns, equation) ? sum + equation.testValue : sum,
    0,
  );
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
    if (evaluateEquation(fns, equation, operators)) {
      return operators;
    }
  }
}

function evaluateEquation(
  fns: OperatorFns,
  equation: Equation,
  operators: string[],
): boolean {
  return equation.testValue ===
    equation.numbers.reduce((acc, number, index) => {
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
