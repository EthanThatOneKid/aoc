// Path: 2022/18/solutions/ts/main.ts
//
// Run:
// cd 2022/18/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

function part1(input: string[]) {}

function part2(input: string[]) {}

const input = Deno.readTextFileSync("input.txt").split("\r\n");

isPart2 ? part2(input) : part1(input);
