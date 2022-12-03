// Path: 2022/01/solutions/ts/part2/main.ts
//
// Run:
// cd 2022/01/solutions/ts/part2
// deno run -A main.ts

const elves = (await Deno.readTextFile("input.txt")).replace(/\r/g, "").trim()
  .split("\n\n");

function part2() {
  const cals = elves.map((elf) => {
    const calories = elf.split("\n").map(Number);
    return calories.reduce((sum, cal) => sum + cal, 0);
  });

  cals.sort((a, b) => b - a);

  console.log(
    cals.slice(0, 3).reduce((prev, curr) => prev + curr, 0),
  );
}

part2();
