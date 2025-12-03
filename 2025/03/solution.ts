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
    return banks.map((bank) => getJoltage(bank)).reduce(
        (sum, joltage) => sum + joltage,
        0,
    );
}

function part2(input: string): number {
    return 0;
}

function getJoltage(bank: Bank): number {
    let joltage = 0;
    // let pair: [number, number] = [0, 0];
    for (let i = 0; i < bank.length - 1; i++) {
        for (let j = i + 1; j < bank.length; j++) {
            const currentJoltage = parseInt(
                `${bank[i].joltageRating}${bank[j].joltageRating}`,
            );
            if (currentJoltage > joltage) {
                // pair = [bank[i].joltageRating, bank[j].joltageRating];
                joltage = currentJoltage;
            }
        }
    }

    // console.log({ pair });
    return joltage;
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
