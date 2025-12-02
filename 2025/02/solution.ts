// deno --allow-read 2025/02/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );
    const _exampleInput =
        `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

    console.log("Part 1", part1(input));
    console.log("Part 2", part2(input));
}

function part1(input: string): number {
    const ranges = parseInput(input);
    const invalidIds = ranges
        .map((range) => getInvalidIds(range, validateId))
        .flat()
        .reduce((sum, invalidId) => sum + invalidId, 0);
    return invalidIds;
}

function part2(input: string): number {
    const ranges = parseInput(input);
    const invalidIds = ranges
        .map((range) => getInvalidIds(range, validateId2))
        .flat()
        .reduce((sum, invalidId) => sum + invalidId, 0);
    return invalidIds;
}

function getInvalidIds(
    range: Range,
    validate: (id: number) => boolean,
): number[] {
    const invalidIds = [];
    for (let i = range.firstId; i <= range.lastId; i++) {
        if (validate(i)) {
            continue;
        }

        invalidIds.push(i);
    }

    return invalidIds;
}

function validateId(id: number) {
    const idString = id.toString();
    if (idString.length % 2 === 1) {
        return true;
    }

    return idString.slice(0, idString.length / 2) !==
        idString.slice(idString.length / 2);
}

function validateId2(id: number) {
    const idString = id.toString();
    for (const divisor of getDivisors(idString.length)) {
        const substrings: string[] = [];
        for (let i = 0; i < idString.length; i += divisor) {
            substrings.push(idString.slice(i, i + divisor));
        }

        if (
            substrings.length > 1 &&
            substrings.every((substring) => substring === substrings[0])
        ) {
            return false;
        }
    }

    return true;
}

function getDivisors(n: number): number[] {
    return Array.from({ length: Math.floor(Math.sqrt(n)) }, (_, i) => i + 1)
        .filter((i) => n % i === 0)
        .reduce((divisors, i) => [...divisors, i, n / i], [] as number[])
        .toSorted((a, b) => b - a);
}

interface Range {
    firstId: number;
    lastId: number;
}

function parseInput(input: string): Range[] {
    return input.split(",").map((line) => {
        const [firstId, lastId] = line.split("-").map((id) => parseInt(id));
        return { firstId, lastId };
    });
}
