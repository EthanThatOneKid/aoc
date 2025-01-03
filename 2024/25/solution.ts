// deno --allow-read 2024/25/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 3
}

function part1(input: string): number {
  const data = parseSchematics(input);

  let sum = 0;
  for (const lock of data.lock) {
    for (const key of data.key) {
      if (!fits(lock.heights, key.heights)) {
        continue;
      }

      sum++;
    }
  }

  return sum;
}

function fits(lock: number[], key: number[]): boolean {
  return key.every((keyHeight, i) => keyHeight < 6 - lock[i]);
}

function parseSchematics(input: string): Record<string, Schematic[]> {
  const schematics = input
    .split("\n\n")
    .map((schematicString) => parseSchematic(schematicString));
  return Object.groupBy(schematics, (schematic) => schematic.kind);
}

function parseSchematic(input: string): Schematic {
  if (input.startsWith("#".repeat(5))) {
    return {
      kind: "lock",
      heights: countHeights(input.split("\n").slice(1)),
    };
  }

  if (input.endsWith("#".repeat(5))) {
    return {
      kind: "key",
      heights: countHeights(input.split("\n").toReversed().slice(1)),
    };
  }

  throw new Error("Invalid schematic");
}

function countHeights(lines: string[]): number[] {
  return lines[0]
    .split("")
    .map((_, i) =>
      lines.reduce((count, line) => count + (line[i] === "#" ? 1 : 0), 0)
    );
}

interface Schematic {
  kind: "key" | "lock";
  heights: number[];
}
