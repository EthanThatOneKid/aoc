import { Tile } from "./tile.ts";

// deno --allow-read ./2025/09/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );
    const exampleInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

    console.log("Example 1", part1(exampleInput));
    console.log("Example 2", part2(exampleInput));

    // console.log("Part 1", part1(input));
    // console.log("Part 2", part2(input));
}

function part1(input: string): number {
    const tiles = parseInput(input);
    const origin = new Tile(0, 0);
    const sorted = tiles.toSorted((t1, t2) => {
        return manhattanDistance(t1, origin) - manhattanDistance(t2, origin);
    });

    console.log(sorted);
    return area(sorted.at(0)!, sorted.at(-1)!);
}

function part2(input: string): number {
    const tiles = parseInput(input);
    return 0;
}

function manhattanDistance(t1: Tile, t2: Tile): number {
    return Math.abs(t1.x - t2.x) + Math.abs(t1.y - t2.y);
}

function area(t1: Tile, t2: Tile) {
    const width = Math.abs(t1.x - t2.x);
    const height = Math.abs(t1.y - t2.y);
    return width * height;
}

function parseInput(input: string): Tile[] {
    return input.split("\n").map((line) => Tile.fromString(line));
}
