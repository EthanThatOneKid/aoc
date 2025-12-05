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

    console.log("Part 1 Example", part1(_exampleInput));
    console.log("Part 2 Example", part2(_exampleInput));

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
    const { ingredientIdRanges } = parseInput(input);
    const combinedRanges = combineOverlappingRanges(ingredientIdRanges);

    let totalFresh = 0;
    for (const { startId, endId } of combinedRanges) {
        totalFresh += endId - startId + 1;
    }
    return totalFresh;
}

function combineOverlappingRanges(ranges: IngredientIdRange[]) {
    if (ranges.length === 0) {
        return [];
    }

    const sortedRanges = ranges.toSorted((a, b) => a.startId - b.startId);
    const combined: IngredientIdRange[] = [sortedRanges[0]];
    for (let i = 1; i < sortedRanges.length; i++) {
        const current = sortedRanges[i];
        const last = combined[combined.length - 1];
        if (current.startId <= last.endId + 1) {
            last.endId = Math.max(last.endId, current.endId);
        } else {
            combined.push(current);
        }
    }

    return combined;
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
