// deno -A ./2025/11/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );

    const exampleInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

    console.log("Example part 1", part1(exampleInput));
    console.log("Example part 2", part2(exampleInput));

    console.log("Part 1", part1(input));
    console.log("Part 2", part2(input));
}

function parse(input: string): Record<string, string[]> {
    const graph: Record<string, string[]> = {};
    for (const line of input.trim().split("\n")) {
        const parts = line.split(": ");
        const src = parts[0];
        const dests = parts[1] ? parts[1].split(" ") : [];
        graph[src] = dests;
    }
    return graph;
}

function part1(input: string): number {
    const graph = parse(input);
    const memo = new Map<string, number>();

    function countPaths(node: string): number {
        if (node === "out") return 1;
        if (memo.has(node)) return memo.get(node)!;

        let total = 0;
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            total += countPaths(neighbor);
        }

        memo.set(node, total);
        return total;
    }

    return countPaths("you");
}

function part2(input: string): number {
    return 0;
}
