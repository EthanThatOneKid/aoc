// deno -A ./2025/11/solution.ts
if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );

    const example1 = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

    const example2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

    console.log("Example part 1", part1(example1));
    console.log("Example part 2", part2(example2));

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

function countPaths(
    graph: Record<string, string[]>,
    start: string,
    end: string,
): number {
    const memo = new Map<string, number>();

    function dfs(node: string): number {
        if (node === end) return 1;
        if (memo.has(node)) return memo.get(node)!;

        let total = 0;
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            total += dfs(neighbor);
        }

        memo.set(node, total);
        return total;
    }

    return dfs(start);
}

function part1(input: string): number {
    const graph = parse(input);
    return countPaths(graph, "you", "out");
}

function part2(input: string): number {
    const graph = parse(input);

    // Path 1: svr -> dac -> fft -> out
    const p1 = countPaths(graph, "svr", "dac") *
        countPaths(graph, "dac", "fft") *
        countPaths(graph, "fft", "out");

    // Path 2: svr -> fft -> dac -> out
    const p2 = countPaths(graph, "svr", "fft") *
        countPaths(graph, "fft", "dac") *
        countPaths(graph, "dac", "out");

    return p1 + p2;
}
