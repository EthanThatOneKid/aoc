// deno run --allow-read 2024/11/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 55312
  console.log("Part 2", part2(input)); // 65601038650482
}

function part1(input: string): number {
  const stones = parseStones(input);
  return blinks(stones, 25);
}

function part2(input: string): number {
  const stones = parseStones(input);
  return blinks(stones, 75);
}

function blinks(stones: Map<number, number>, count: number): number {
  for (let i = 0; i < count; i++) {
    blink(stones);
  }

  return total(stones);
}

function blink(stones: Map<number, number>): void {
  const displacements = new Map<number, number>();

  for (const [stone, count] of stones) {
    // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
    if (stone === 0) {
      displacements.set(1, (displacements.get(1) ?? 0) + count);
      displacements.set(0, (displacements.get(0) ?? 0) - count);
      continue;
    }

    // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
    const stoneString = stone.toString();
    if (stoneString.length % 2 === 0) {
      const half = Math.floor(stoneString.length * 0.5);
      const left = parseInt(stoneString.slice(0, half));
      const right = parseInt(stoneString.slice(half));
      displacements.set(left, (displacements.get(left) ?? 0) + count);
      displacements.set(right, (displacements.get(right) ?? 0) + count);
      displacements.set(stone, (displacements.get(stone) ?? 0) - count);
      continue;
    }

    // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
    const newStone = stone * 2024;
    displacements.set(newStone, (displacements.get(newStone) ?? 0) + count);
    displacements.set(stone, (displacements.get(stone) ?? 0) - count);
  }

  for (const [stone, displacement] of displacements) {
    const newCount = (stones.get(stone) ?? 0) + displacement;
    if (newCount < 0) {
      throw new Error("Something went wrong");
    }

    if (newCount === 0) {
      stones.delete(stone);
      continue;
    }

    stones.set(stone, newCount);
  }
}

function total(stones: Map<number, number>): number {
  return Array.from(stones.values()).reduce((sum, count) => sum + count, 0);
}

function parseStones(input: string): Map<number, number> {
  return input
    .split(" ")
    .reduce(
      (frequencyMap, stoneString) => {
        const stone = parseInt(stoneString);
        return frequencyMap.set(stone, (frequencyMap.get(stone) ?? 0) + 1);
      },
      new Map<number, number>(),
    );
}
