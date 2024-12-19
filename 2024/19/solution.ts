// deno --allow-read 2024/19/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input));
}

function part1(input: string): number {
  const { designs, patterns } = parseConfig(input);
  const possibleDesigns = designs
    .filter((design) => possible(patterns, design));
  return possibleDesigns.length;
}

function possible(patterns: string[], design: string): boolean {
  if (design.length === 0) {
    return true;
  }

  const potentialPatterns = patterns
    .filter((pattern) => design.startsWith(pattern));
  for (const pattern of potentialPatterns) {
    if (!possible(patterns, design.slice(pattern.length))) {
      continue;
    }

    return true;
  }

  return false;
}

function parseConfig(input: string): Config {
  const [patternsString, designsString] = input.split("\n\n");
  const patterns = patternsString.split(", ");
  const designs = designsString.split("\n");
  return { patterns, designs };
}

interface Config {
  patterns: string[];
  designs: string[];
}
