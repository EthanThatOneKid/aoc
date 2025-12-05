// deno --allow-read 2025/05/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );

    const _exampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

    console.log("Part 1", part1(input));
    console.log("Part 2", part2(input));
}

function part1(input: string): number {
    const { ingredientIdRanges, ingredientIds } = parseInput(input);
    const freshIngredientIds = ingredientIds
        .filter(filterFresh(ingredientIdRanges));
    return freshIngredientIds.length;
}

function part2(input: string): number {
    return 0;
}

function filterFresh(ingredientIdRanges: IngredientIdRange[]) {
    return (id: number) => {
        return ingredientIdRanges.some((range) => {
            return id >= range.startId && id <= range.endId;
        });
    };
}

function parseInput(input: string) {
    const [ingredientIdRangesString, ingredientIdsString] = input.split("\n\n");
    console.log({ ingredientIdRangesString, ingredientIdsString });
    const ingredientIdRanges: IngredientIdRange[] = ingredientIdRangesString
        .split("\n")
        .map((line) => {
            const [startId, endId] = line.split("-").map((n) => parseInt(n));
            return { startId, endId };
        });
    const ingredientIds: number[] = ingredientIdsString
        .split("\n")
        .map((line) => parseInt(line));
    return { ingredientIdRanges, ingredientIds };
}

interface IngredientIdRange {
    startId: number;
    endId: number;
}
