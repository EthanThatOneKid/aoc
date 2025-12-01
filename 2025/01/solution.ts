// deno --allow-read 2025/01/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );

    console.log("Part 1", part1(input));
    console.log("Part 2", part2(input));
}

const _exampleRotations = parseInput(`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`);

function part1(input: string): number {
    const rotations = parseInput(input);

    let value = 50;
    let zeroes = 0;
    for (const rotation of rotations) {
        value = rotate(value, rotation);
        if (value === 0) {
            zeroes++;
        }
    }

    return zeroes;
}

function part2(input: string): number {
    return 0;
}

function parseInput(input: string): Rotation[] {
    return input.split("\n").map((line) => {
        const go = line[0] === "L" ? "left" : "right";
        const distance = parseInt(line.slice(1));
        return { go, distance };
    });
}

// Because the dial is a circle, turning the dial left from 0 one click makes it point at 99.
// Similarly, turning the dial right from 99 one click makes it point at 0.

function rotate(value: number, rotation: Rotation): number {
    if (rotation.go === "left") {
        return (value - rotation.distance + 100) % 100;
    } else if (rotation.go === "right") {
        return (value + rotation.distance) % 100;
    }

    throw new Error("Invalid rotation");
}

interface Rotation {
    go: "left" | "right";
    distance: number;
}
