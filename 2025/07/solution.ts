import { Beam } from "./beam.ts";

// deno --allow-read 2025/07/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );
    const exampleInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

    console.log("Part 1 Example", part1(exampleInput));
    console.log("Part 2 Example", part2(exampleInput));

    console.log("Part 1", part1(input));
    console.log("Part 2", part2(input));
}

function part1(input: string): number {
    const diagram = parseDiagram(input);
    const splitterKeys = new Set(
        diagram.splitters.map(([y, x]) => `${y},${x}`),
    );

    const beams = new Map<string, Beam>();

    const startBeam = new Beam(...diagram.start);
    beams.set(startBeam.toString(), startBeam);

    let splits = 0;
    for (let i = 0; i < diagram.length; i++) {
        for (const [key, beam] of Array.from(beams)) {
            beams.delete(key);

            const nextBeam = beam.translate(1, 0);
            const nextKey = nextBeam.toString();
            if (!splitterKeys.has(nextKey)) {
                beams.set(nextKey, nextBeam);
                continue;
            }

            splits++;
            for (const splitBeam of beam.split()) {
                beams.set(splitBeam.toString(), splitBeam);
            }
        }
    }

    return splits;
}

function part2(input: string): number {
    const diagram = parseDiagram(input);
    const splitterKeys = new Set(
        diagram.splitters.map(([y, x]) => `${y},${x}`),
    );

    // Map x coordinate to count of active timelines at that coordinate.
    let timelines = new Map<number, number>();
    timelines.set(diagram.start[1], 1);

    for (let i = 0; i < diagram.length; i++) {
        const nextTimelines = new Map<number, number>();
        const nextY = i + 1;

        for (const [x, count] of timelines) {
            const nextKey = `${nextY},${x}`;
            if (splitterKeys.has(nextKey)) {
                // Splitter: split specific particle count into two paths.
                const left = x - 1;
                const right = x + 1;
                nextTimelines.set(left, (nextTimelines.get(left) ?? 0) + count);
                nextTimelines.set(
                    right,
                    (nextTimelines.get(right) ?? 0) + count,
                );
            } else {
                // No splitter: continue straight.
                nextTimelines.set(x, (nextTimelines.get(x) ?? 0) + count);
            }
        }
        timelines = nextTimelines;
    }

    let total = 0;
    for (const count of timelines.values()) {
        total += count;
    }

    return total;
}

interface ManifoldDiagram {
    start: [number, number];
    splitters: Array<[number, number]>;
    length: number;
}

function parseDiagram(input: string): ManifoldDiagram {
    const [firstLine, ...lines] = input.split("\n");
    const start: [number, number] = [0, firstLine.indexOf("S")];

    const splitters: Array<[number, number]> = [];
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] !== "^") {
                continue;
            }

            splitters.push([i + 1, j]);
        }
    }

    return { start, splitters, length: lines.length + 1 };
}
