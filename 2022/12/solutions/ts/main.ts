// Path: 2022/12/solutions/ts/main.ts
//
// Run:
// cd 2022/12/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

const input = Deno.readTextFileSync("input.txt").split("\r\n");

enum Order {
  RIGHT = "right",
  WRONG = "wrong",
  UNKNOWN = "unknown",
}

const DIRECTION = {
  [Order.RIGHT]: -1,
  [Order.WRONG]: 1,
  [Order.UNKNOWN]: 0,
};

isPart2 ? part2(input) : part1(input);

function part1(input: string[]) {
  const signals = parseSignals(input);
  const sum = signals.reduce(
    (acc, [one, two], i) => (checkOrdered(one, two) ? i + 1 : 0) + acc,
    0,
  );
  console.log({ sum });
}

function part2(input: string[]) {
  const dividerPackets = ["[[2]]", "[[6]]"];
  const signals = parseSignals2(input.concat(...dividerPackets));
  const corrected = signals.sort((a, b) => DIRECTION[order(a, b)]);
  const decoderKey = corrected.reduce(
    (key: number, x, i) =>
      dividerPackets.includes(JSON.stringify(x)) ? key *= i + 1 : key,
    1,
  );
  console.log({ decoderKey });
}

type Resolvable = number | Resolvable[];

function checkOrdered(left: Resolvable, right: Resolvable): boolean {
  const result = order(left, right);
  return result === Order.RIGHT;
}

function order(left: Resolvable, right: Resolvable): Order {
  if (typeof left === "number" && typeof right === "number") {
    if (left === right) {
      return Order.UNKNOWN;
    }
    return left < right ? Order.RIGHT : Order.WRONG;
  }

  if (Array.isArray(left) && !Array.isArray(right)) {
    return order(left, [right]);
  }

  if (!Array.isArray(left) && Array.isArray(right)) {
    return order([left], right);
  }

  const { length: leftLen } = left as Resolvable[];
  const { length: rightLen } = right as Resolvable[];
  const minLen = Math.min(leftLen, rightLen);
  for (let i = 0; i < minLen; i++) {
    const [first, second] = [
      (left as Resolvable[])[i],
      (right as Resolvable[])[i],
    ];
    const next = order(first, second);
    if (next !== Order.UNKNOWN) {
      return next;
    }
  }

  if (leftLen < rightLen) {
    return Order.RIGHT;
  } else if (leftLen > rightLen) {
    return Order.WRONG;
  }

  return Order.UNKNOWN;
}

function parseSignals(lines: string[]) {
  const pairs: Array<[Resolvable, Resolvable]> = [];
  for (let i = 0; i < lines.length; i += 3) {
    const one = JSON.parse(lines[i]);
    const two = JSON.parse(lines[i + 1]);
    pairs.push([one, two]);
  }
  return pairs;
}

function parseSignals2(lines: string[]) {
  const signals: Resolvable[] = [];
  for (const line of lines) {
    if (line === "") {
      continue;
    }

    const signal = JSON.parse(line);
    signals.push(signal);
  }
  return signals;
}
