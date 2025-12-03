// deno --allow-read 2025/03/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );
    const _exampleInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

    console.log("Part 1", part1(input));
    console.log("Part 2", part2(input));
}

function part1(input: string): number {
    const banks = parseInput(input);
    return banks.map((bank) => getJoltage(bank, 2)).reduce(
        (sum, joltage) => sum + joltage,
        0,
    );
}

function part2(input: string): number {
    const banks = parseInput(input);
    return banks.map((bank) => getJoltage(bank, 12)).reduce(
        (sum, joltage) => sum + joltage,
        0,
    );
}

function getJoltage(bank: Bank, k: number): number {
    // 1. Memoization cache: Stores result for keys "index,depth"
    const memo = new Map<string, string>();

    // Helper returns the Max String Suffix possible from this state
    function findMaxStr(index: number, depth: number): string | null {
        // Base Case: We found k items. Return empty string to signify success.
        if (depth === k) return "";

        // Base Case: Run out of items but haven't reached k. Impossible path.
        if (index >= bank.length) return null;

        // Check Cache
        const key = `${index},${depth}`;
        if (memo.has(key)) return memo.get(key)!;

        // Option A: Skip this item (Move to next index, keep same depth)
        // Only possible if we have enough remaining items to still fill k
        let maxWithSkip: string | null = null;
        if ((bank.length - 1 - index) >= (k - depth)) {
            maxWithSkip = findMaxStr(index + 1, depth);
        }

        // Option B: Take this item (Concatenate current, move next, depth + 1)
        let maxWithTake: string | null = null;
        const remainder = findMaxStr(index + 1, depth + 1);

        if (remainder !== null) {
            maxWithTake = `${bank[index].joltageRating}${remainder}`;
        }

        // Compare Option A and Option B numerically
        let result: string | null = null;

        if (maxWithSkip === null) result = maxWithTake;
        else if (maxWithTake === null) result = maxWithSkip;
        else {
            // Compare as BigInt to handle large numbers safely,
            // or verify length first for speed optimization.
            if (maxWithTake.length > maxWithSkip.length) result = maxWithTake;
            else if (maxWithSkip.length > maxWithTake.length) {
                result = maxWithSkip;
            } else {result = maxWithTake > maxWithSkip
                    ? maxWithTake
                    : maxWithSkip;}
        }

        // Store result in cache
        memo.set(key, result!);
        return result;
    }

    const resultStr = findMaxStr(0, 0);
    return resultStr ? parseInt(resultStr) : 0;
}

type Bank = Battery[];

interface Battery {
    joltageRating: number;
}

function parseInput(input: string): Bank[] {
    return input.split("\n").map((line) => {
        return line.split("").map((joltageRating) => {
            return {
                joltageRating: parseInt(joltageRating),
            };
        });
    });
}
