// deno run --allow-read 2024/05/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./my-input")),
  );
  console.log("Part 1", part1(input));
  // console.log("Part 2", part2(input));
}

function part1(input: string): number {
  const { rules, updates } = parseInput(input);
  const orderedUpdates = updates
    .filter((update) => checkPageOrderingRules(update, rules));
  const sum = orderedUpdates
    .reduce((acc, update) => acc + atMiddle(update), 0);
  return sum;
}

function atMiddle(pages: Page[]): number {
  return pages[Math.floor(pages.length * 0.5)];
}

interface PageOrderingRule {
  page: Page;
  beforePage: Page;
}

type Page = number;

function checkPageOrderingRules(
  pages: Page[],
  rules: PageOrderingRule[],
): boolean {
  return rules.every((rule) => checkPageOrderingRule(pages, rule));
}

function checkPageOrderingRule(
  pages: Page[],
  rule: PageOrderingRule,
): boolean {
  const pageIndex = pages.indexOf(rule.page);
  const beforePageIndex = pages.indexOf(rule.beforePage);
  if (pageIndex === -1 || beforePageIndex === -1) {
    return true;
  }

  return beforePageIndex > pageIndex;
}

interface Input {
  rules: PageOrderingRule[];
  updates: Page[][];
}

function parseInput(input: string): Input {
  const [rawRules, rawUpdates] = input.split("\r\n\r\n");
  const rules = parseRules(rawRules);
  const updates = parseUpdates(rawUpdates);
  return { rules, updates };
}

function parseRules(input: string): PageOrderingRule[] {
  return input
    .split("\n")
    .map((line) => {
      const [page, beforePage] = line
        .split("|")
        .map((n) => parseInt(n, 10));
      return { page, beforePage };
    });
}

function parseUpdates(input: string): Page[][] {
  return input
    .split("\n")
    .map((line) => line.split(",").map((n) => parseInt(n, 10)));
}
