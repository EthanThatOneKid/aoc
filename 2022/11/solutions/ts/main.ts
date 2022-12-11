// Path: 2022/11/solutions/ts/main.ts
//
// Run:
// cd 2022/11/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

function part1(input: string[]) {
  let monkeys = parseMonkeys(input, 3n);
  for (let i = 0; i < 20; i++) {
    monkeys = simulateRound(monkeys);
  }

  summarize(monkeys, 1n);
}

function part2(input: string[]) {
  const helper = 36n;
  let monkeys = parseMonkeys(input, helper);
  for (let i = 0; i < 10_000; i++) {
    monkeys = simulateRound(monkeys);

    if (i % 100 === 0) {
      console.log({ i });
      summarize(monkeys, helper);
    }
  }

  summarize(monkeys, helper);
}

const OLD = "old";

class Monkey {
  constructor(
    public items: bigint[],
    public operation: {
      leftHandID: string;
      rightHandPrimaryID: string;
      rightHandSecondaryID: string;
      operator: string;
    },
    public divisibleBy: number,
    public trueThrow: number,
    public falseThrow: number,
    public worryLevel: bigint,
    public inspected = 0,
  ) {}
}

function summarize(monkeys: Monkey[], helper: bigint): void {
  const result = monkeyBusiness(monkeys, helper);
  console.log(
    JSON.stringify(
      {
        ...monkeys.map(({ items }) =>
          `${items.map((n) => n * BigInt(helper))}`
        ),
        result,
      },
      null,
      2,
    ),
  );
}

function parseMonkeys(lines: string[], worryLevel: bigint): Monkey[] {
  const monkeys: Monkey[] = [];
  let monkey: Partial<Monkey> = {};
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith("Starting")) {
      monkey.items = line
        .split(": ")[1]
        .split(", ")
        .map((n) => BigInt(n));
    } else if (line.startsWith("Operation")) {
      const [leftHand, rightHand] = line.split(": ")[1].split(" = ");
      const [rightHandPrimary, operator, rightHandSecondary] = rightHand.split(
        " ",
      );
      monkey.operation = {
        leftHandID: leftHand,
        rightHandPrimaryID: rightHandPrimary,
        rightHandSecondaryID: rightHandSecondary,
        operator,
      };
    } else if (line.startsWith("Test")) {
      monkey.divisibleBy = parseInt(line.split(": ")[1].split(" ")[2]);
    } else if (line.startsWith("If true")) {
      monkey.trueThrow = parseInt(line.split(" ").pop() || "");
    } else if (line.startsWith("If false")) {
      monkey.falseThrow = parseInt(line.split(" ").pop() || "");
      monkeys.push(
        new Monkey(
          monkey.items!,
          monkey.operation!,
          monkey.divisibleBy!,
          monkey.trueThrow!,
          monkey.falseThrow,
          worryLevel,
        ),
      );
      monkey = {};
    }
  }

  return monkeys;
}

function simulateRound(monkeys: Monkey[]) {
  for (let i = 0; i < monkeys.length; i++) {
    while (monkeys[i].items.length > 0) {
      monkeys[i].inspected++;
      let item = monkeys[i].items.shift()!;
      const secondary = monkeys[i].operation.rightHandSecondaryID === OLD
        ? item
        : BigInt(monkeys[i].operation.rightHandSecondaryID);

      if (monkeys[i].operation.operator === "+") {
        item += secondary;
      } else if (monkeys[i].operation.operator === "*") {
        item *= secondary;
      }

      item = item / BigInt(monkeys[i].worryLevel);
      if ((item % BigInt(monkeys[i].divisibleBy)) === 0n) {
        monkeys[monkeys[i].trueThrow].items.push(item);
      } else {
        monkeys[monkeys[i].falseThrow].items.push(item);
      }
    }
  }
  return monkeys;
}

function monkeyBusiness(monkeys: Monkey[], helper: bigint): number {
  const top2Inspectors = monkeys.sort((a, b) => b.inspected - a.inspected)
    .slice(0, 2);
  const [kong, george] = top2Inspectors;
  return Number(
    BigInt(kong.inspected) * BigInt(george.inspected) *
      (helper * helper),
  );
}

const input = Deno.readTextFileSync("input.txt").split("\r\n");

isPart2 ? part2(input) : part1(input);
