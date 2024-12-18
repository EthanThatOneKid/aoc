// deno run --allow-read 2024/05/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input));
  console.log("Part 2", part2(input));
}

function part1(input: string): number {
  const { rules, updates } = parseInput(input);
  const orderedUpdates = updates
    .filter((update) => checkPageOrderingRules(update, rules));
  const sum = orderedUpdates
    .reduce((acc, update) => acc + atMiddle(update), 0);
  return sum;
}

function part2(input: string): number {
  const { rules, updates } = parseInput(input);
  const unorderedUpdates = updates
    .filter((update) => !checkPageOrderingRules(update, rules));
  const orderedUpdates = unorderedUpdates
    .map((update) => sortPages(update, rules));
  const sum = orderedUpdates
    .reduce((acc, update) => acc + atMiddle(update), 0);
  return sum;
}

function sortPages(pages: Page[], rules: PageOrderingRules): Page[] {
  return pages.toSorted((a, b) =>
    checkPageOrderingRules([a, b], rules)
      ? -1
      : checkPageOrderingRules([b, a], rules)
      ? 1
      : 0
  );
}

function atMiddle(pages: Page[]): Page {
  return pages[Math.floor(pages.length * 0.5)];
}

type PageOrderingRules = Map<Page, Set<Page>>;

type Page = number;

function checkPageOrderingRules(
  pages: Page[],
  rules: PageOrderingRules,
): boolean {
  for (const [page, beforePages] of rules) {
    const pageIndex = pages.indexOf(page);
    if (pageIndex === -1) {
      continue;
    }

    for (const beforePage of beforePages) {
      const beforePageIndex = pages.indexOf(beforePage);
      if (beforePageIndex === -1) {
        continue;
      }

      if (pageIndex > beforePageIndex) {
        return false;
      }
    }
  }

  return true;
}

interface Input {
  rules: PageOrderingRules;
  updates: Page[][];
}

function parseInput(input: string): Input {
  const [rawRules, rawUpdates] = input.split("\n\n");
  const rules = parseRules(rawRules);
  const updates = parseUpdates(rawUpdates);
  return { rules, updates };
}

function parseRules(input: string): PageOrderingRules {
  return input
    .split("\n")
    .reduce((rules, line) => {
      const [page, beforePage] = line
        .split("|")
        .map((n) => parseInt(n, 10));
      return rules.set(
        page,
        (rules.get(page) ?? new Set<Page>()).add(beforePage),
      );
    }, new Map<Page, Set<Page>>());
}

function parseUpdates(input: string): Page[][] {
  return input
    .split("\n")
    .map((line) => line.split(",").map((n) => parseInt(n, 10)));
}
