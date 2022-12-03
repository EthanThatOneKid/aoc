// Path: 2022/03/solutions/ts/main.ts
//
// Run:
// cd 2022/03/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.p2 || flags.part2;

const input = await Deno.readTextFile("input.txt");
const rucksacks = input.split("\r\n").map((line) => {
  const leftCompartment = line.slice(0, line.length / 2);
  const rightCompartment = line.slice(line.length / 2);
  return [leftCompartment, rightCompartment];
});

let score = 0;

if (!isPart2) {
  score = rucksacks.reduce((sum, [left, right]) => {
    const same = findSharedCharInStrings(left, right);
    return sum + getPriority(same);
  }, 0);
} else {
  const groups = separateIntoGroupsOfThree(input.split("\r\n"));
  score = groups.reduce((sum, [left, middle, right]) => {
    const same = findSharedCharInStrings(left, middle, right);
    return sum + getPriority(same);
  }, 0);
}

console.log({ score, part: isPart2 ? 2 : 1 });

function findSharedCharInStrings(...strs: string[]) {
  const chars = strs.map((str) => str.split(""));
  const sharedChars = chars.reduce((shared, chars) => {
    return chars.filter((char) => shared.includes(char));
  }, chars[0]);
  return sharedChars[0];
}
//   const leftChars = left.split("");
//   const rightChars = right.split("");

//   const same = leftChars.filter((char) => rightChars.includes(char));
//   return same[0];
// }

function getPriority(chr: string) {
  const charCode = chr.charCodeAt(0);

  if (charCode > 90) {
    return charCode - 97 + 1;
  } else {
    return charCode - 65 + 27;
  }
}

function separateIntoGroupsOfThree(lines: string[]) {
  const groups = [];
  for (let i = 0; i < lines.length; i += 3) {
    const group = lines.slice(i, i + 3);
    groups.push(group);
  }
  return groups;
}
