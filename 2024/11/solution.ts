// deno run --allow-read 2024/11/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 55312
  console.log("Part 2", part2(input));
}

function part1(input: string): number {
  const stones = parseStones(input);
  for (let i = 0; i < 25; i++) {
    blink(stones);
  }

  return stones.length;
}

function part2(input: string): number {
  const stones = parseStones(input);
  let t = performance.now();
  for (let i = 0; i < 75; i++) {
    blink(stones);

    const ct = performance.now();
    console.log("Blink", i, ct - t);
    t = ct;
  }

  return stones.length;
}

function blink(stones: Stone[]): void {
  for (let i = stones.length - 1; i >= 0; i--) {
    const stone = stones[i];
    switch (true) {
      case stone === 0: {
        stones[i] = 1;
        break;
      }

      case stone.toString().length % 2 === 0: {
        const stoneStr = stone.toString();
        const half = stoneStr.length / 2;
        const left = parseInt(stoneStr.slice(0, half));
        const right = parseInt(stoneStr.slice(half));
        stones.splice(i, 1, left, right);
        break;
      }

      default: {
        stones[i] = stone * 2024;
      }
    }
  }
}

function renderStones(stones: Stone[]): string {
  return stones.join(" ");
}

function parseStones(input: string): Stone[] {
  return input.split(" ").map((n) => parseInt(n));
}

type Stone = number;
