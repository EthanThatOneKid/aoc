// deno --allow-read 2025/04/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );

    const _exampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

    console.log("Part 1", part1(input));
    console.log("Part 2", part2(input));
}

function part1(input: string): number {
    const rollsMap = parseInput(input);
    return Array.from(rollsMap.values())
        .filter((roll) => canRemove(rollsMap, roll))
        .length;
}

function part2(input: string): number {
    const rollsMap = parseInput(input);

    let removed = 0;
    while (true) {
        const rollsToRemove = Array.from(rollsMap.values())
            .filter((roll) => canRemove(rollsMap, roll));
        if (rollsToRemove.length === 0) {
            return removed;
        }

        rollsToRemove.forEach((roll) => {
            rollsMap.delete(makeRollKey(roll));
            removed++;
        });
    }
}

function canRemove(map: RollsMap, roll: Roll, k = 4): boolean {
    return countAdjacent(map, roll) < k;
}

function countAdjacent(map: RollsMap, roll: Roll): number {
    const directions = [
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
    ];

    return directions
        .filter((direction) => {
            const neighbor = makeRoll(
                roll.x + direction.x,
                roll.y + direction.y,
            );
            return map.has(makeRollKey(neighbor));
        })
        .length;
}

type RollsMap = Map<string, Roll>;

interface Roll {
    x: number;
    y: number;
}

function makeRollKey(roll: Roll): string {
    return `${roll.x},${roll.y}`;
}

function makeRoll(x: number, y: number): Roll {
    return { x, y };
}

function parseInput(input: string): RollsMap {
    const map = new Map<string, Roll>();
    input.split("\n").forEach((line, i) => {
        line.split("").forEach((point, j) => {
            if (point !== "@") {
                return;
            }

            const roll = makeRoll(j, i);
            map.set(makeRollKey(roll), roll);
        });
    });

    return map;
}
