export function ts(year: string, day: string) {
  return `// Path: ${year}/${day}/solutions/ts/main.ts
//
// Run:
// cd ${year}/${day}/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

function part1(input: string[]) {}

function part2(input: string[]) {}

const input = Deno.readTextFileSync("input.txt").split("\\r\\n");

isPart2 ? part2(input) : part1(input);
`;
}

export function go(year: string, day: string) {
  return `// Path: ${year}/${day}/solutions/go/main.go
//
// Run:
// cd ${year}/${day}/solutions/go
// go run .

package main

var isPart2 = false

import (
  "flag"

  // https://godocs.io/github.com/diamondburned/aoc-2022/aocutil
    "github.com/diamondburned/aoc-2022/aocutil"
)

func main() {
  flag.BoolVar(&isPart2, "p2", false, "Run part 2")
  flag.Parse()

  input := aocutil.SplitFile("input.txt", "\\r\\n")
  if isPart2 {
    part2(input)
  } else {
    part1(input)
  }
}

func part1(input []string) {}

func part2(input []string) {}
`;
}

export function py(year: string, day: string) {
  return `# Path: ${year}/${day}/solutions/py/main.py
#
# Run:
# cd ${year}/${day}/solutions/py
# python main.py

import argparse

parser = argparse.ArgumentParser()

parser.add_argument(
  "-p2",
  "--part2",
  action="store_true",
  help="Run part 2",
)

args = parser.parse_args()

def part1(input):
  pass

def part2(input):
  pass

with open("input.txt") as f:
  input = f.read().split("\\r\\n")
  if args.part2:
    part2(input)
  else:
    part1(input)
`;
}
