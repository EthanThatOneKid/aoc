// deno --allow-read 2024/19/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 6
  console.log("Part 2", part2(input)); // 16
}

function part1(input: string): number {
  const { designs, patterns } = parseConfig(input);
  const possibleDesigns = designs
    .filter((design) => possible(patterns, design) > 0);
  return possibleDesigns.length;
}

function part2(input: string): number {
  const { designs, patterns } = parseConfig(input);
  return designs.reduce((sum, design) => sum + possible(patterns, design), 0);
}

function possible(
  patterns: string[],
  design: string,
  memo: Map<string, number> = new Map(),
): number {
  if (memo.has(design)) {
    return memo.get(design)!;
  }

  if (design.length === 0) {
    return 1;
  }

  let count = 0;
  const potentialPatterns = patterns
    .filter((pattern) => design.startsWith(pattern));
  for (const pattern of potentialPatterns) {
    count += possible(patterns, design.slice(pattern.length), memo);
  }

  memo.set(design, count);
  return count;
}

function parseConfig(input: string): Config {
  const [patternsString, designsString] = input.split("\n\n");
  return {
    patterns: patternsString.split(", "),
    designs: designsString.split("\n"),
  };
}

interface Config {
  patterns: string[];
  designs: string[];
}
