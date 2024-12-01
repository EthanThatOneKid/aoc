// deno run --allow-read 2024/01/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );
    console.log("Part 1", part1(input));
    console.log("Part 2", part2(input));
}

function part1(input: string): number {
    const lists = parseInput(input);
    const differences = Array.from(
        { length: lists[0].length },
        (_, i) => Math.abs(lists[0][i] - lists[1][i]),
    );
    const sum = differences.reduce((result, value) => result + value, 0);
    return sum;
}

function part2(input: string): number {
    const lists = parseInput(input);
    const frequencyMao = new Map<number, number>();
    for (let i = 0; i < lists[0].length; i++) {
        frequencyMao.set(lists[0][i], 0);
    }

    for (let i = 0; i < lists[1].length; i++) {
        const value = lists[1][i];
        if (!frequencyMao.has(value)) {
            continue;
        }

        frequencyMao.set(value, frequencyMao.get(value)! + 1);
    }

    let sum = 0;
    for (let i = 0; i < lists[0].length; i++) {
        const value = lists[0][i];
        sum += value * frequencyMao.get(value)!;
    }

    return sum;
}

function parseInput(input: string): number[][] {
    return input
        .split("\n")
        .reduce((result: number[][], line) => {
            const entries = line.split("  ").map((num) => parseInt(num));
            for (let i = 0; i < entries.length; i++) {
                if (!result[i]) {
                    result[i] = [];
                }

                result[i].push(entries[i]);
            }

            return result;
        }, [])
        .map((list) => list.toSorted((a, b) => a - b));
}
