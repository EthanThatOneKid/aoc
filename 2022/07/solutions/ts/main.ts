// Path: 2022/07/solutions/ts/main.ts
//
// Run:
// cd 2022/07/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

/**
 * Find the sum of the sizes of the directories of sizes over 100000.
 */
function part1(input: string[]) {
  let result = 0;
  const directories = [];
  const map = new Map();
  for (const line of input) {
    if (line.startsWith("$ cd")) {
      const command = line.substring(5);
      if (command === "..") {
        directories.pop();
      } else {
        directories.push(command);
      }
    }
    if (!isNaN(parseInt(line[0]))) {
      const number = line.split(" ");
      let key = "";
      for (let i = 0; i < directories.length; i++) {
        key += directories[i];
        let totalNumber = parseInt(number[0]);
        if (map.get(key)) {
          totalNumber += parseInt(map.get(key));
        }
        map.set(key, totalNumber);
      }
    }
  }
  for (const value of map) {
    if (value[1] <= 100000) {
      result += value[1];
    }
  }
  console.log(result);
}

function part2(input: string[]) {
  let result = 0;
  const spaceNeeded = 30000000;
  let spaceAvailable = 70000000;
  const directories = [];
  const map = new Map();
  for (const line of input) {
    if (line.startsWith("$ cd")) {
      const command = line.substring(5);
      if (command === "..") {
        directories.pop();
      } else {
        directories.push(command);
      }
    }
    if (!isNaN(parseInt(line[0]))) {
      const number = line.split(" ");
      let key = "";
      for (let i = 0; i < directories.length; i++) {
        key += directories[i];
        let totalNumber = parseInt(number[0]);
        if (map.get(key)) {
          totalNumber += parseInt(map.get(key));
        }
        map.set(key, totalNumber);
      }
    }
  }
  spaceAvailable -= map.get("/");
  for (const value of map) {
    const differenceResult = Math.abs(result - spaceNeeded);
    const differenceValue = Math.abs((spaceAvailable + value[1]) - spaceNeeded);
    if (
      spaceAvailable + value[1] >= spaceNeeded &&
      differenceValue < differenceResult
    ) {
      result = value[1];
    }
  }
  console.log(result);
}

const input = Deno.readTextFileSync("input.txt").split("\r\n");

isPart2 ? part2(input) : part1(input);
