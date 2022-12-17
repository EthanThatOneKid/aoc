// Path: 2022/17/solutions/ts/main.ts
//
// Run:
// cd 2022/17/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

import { Tape } from "./tape.ts";
import { Jet, Tower } from "./tower.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

function parseJets(input: string) {
  return new Tape(input.split("").map((char) => char as Jet));
}

function part1(input: string) {
  const tape = parseJets(input);
  const result = Tower.simulate(tape, 2022);
  console.log(result);
}

function part2(input: string) {}

const input = Deno.readTextFileSync("input.txt");

isPart2 ? part2(input) : part1(input);

function simulate(rocks: number, tape: string) {
  const tower = new Tower();
  tower.drop();
  console.log(tower.data);
  return;
  //   for (let i = 0; i < rocks; i++) {
  //     const tapeIndex = i % tape.length;

  //     switch (tape[tapeIndex]) {
  //       case Jet.RIGHT: {
  //         break;
  //       }
  //       case Jet.LEFT: {
  //         break;
  //       }
  //     }
  //   }
}
