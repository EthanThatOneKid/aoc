// Path: 2022/14/solutions/ts/main.ts
//
// Run:
// cd 2022/14/solutions/ts
// deno run -A main.ts

import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args);
const isPart2 = flags.part2 ?? flags.p2 ?? flags["2"];

enum Tile {
  AIR = "⬛",
  ROCK = "🟫",
  SAND = "🟨",
  FALL = "🟩",
}

type Row = Array<Tile>;
type TileMap = Array<Row>;

class Engine {
  public drops = 0;
  public complete = false;

  constructor(
    public map: TileMap,
    public dropAt: [number, number],
    public priorities: Array<[number, number]>,
  ) {}

  public tick() {
    for (let y = this.map.length - 1; y >= 0; y--) {
      const row = this.map[y];
      for (let x = 0; x < row.length; x++) {
        const tile = row[x];
        if (tile === Tile.FALL) {
          this.tickSand(x, y);
        }
      }
    }
  }

  public print(x1: number, y1: number, x2: number, y2: number) {
    const lines: string[] = [];
    for (let y = y1; y < y2; y++) {
      const row = this.map[y];
      const line = row.slice(x1, x2).join("");
      lines.push(line);
    }
    console.log(lines.join("\r\n"));
  }

  public drop() {
    this.drops++;
    const { 0: x, 1: y } = this.dropAt;
    this.map[y][x] = Tile.FALL;
  }

  private swap(x1: number, y1: number, x2: number, y2: number) {
    const tmp = this.map[y1][x1];
    this.map[y1][x1] = this.map[y2][x2];
    this.map[y2][x2] = tmp;
  }

  private tickSand(x: number, y: number) {
    if (y === this.map.length - 1) {
      this.complete = true;
      return;
    }

    for (const [offX, offY] of this.priorities) {
      const x2 = x + offX;
      const y2 = y + offY;
      if (this.map[y2][x2] === Tile.AIR) {
        this.swap(x, y, x2, y2);
        return;
      }
    }

    this.map[y][x] = Tile.SAND;
    this.drop();
  }
}

type View = [number, number, number, number];

function parseInput(input: string[]): [TileMap, View] {
  // Parse input into polygons.
  const polygons: Array<Array<[number, number]>> = [];
  for (const line of input) {
    const polygon = line.split(" -> ").map((point) => {
      const [x, y] = point.split(",").map((x) => parseInt(x.trim()));
      return [x, y] as [number, number];
    });
    polygons.push(polygon);
  }

  const minX = Math.min(...polygons.flat().map(([x]) => x));
  const minY = Math.min(...polygons.flat().map(([, y]) => y));
  const width = Math.max(...polygons.flat().map(([x]) => x)) + 1;
  const height = Math.max(...polygons.flat().map(([, y]) => y)) + 1;

  // Parse rocks from input into a map.
  const result: TileMap = Array.from(
    { length: height },
    () => Array.from({ length: width }, () => Tile.AIR),
  );

  // Connect the dots.
  for (const polygon of polygons) {
    for (let i = 0; i < polygon.length - 1; i++) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[i + 1];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      for (let j = 0; j < steps; j++) {
        const x = x1 + Math.round((dx / steps) * j);
        const y = y1 + Math.round((dy / steps) * j);
        result[y][x] = Tile.ROCK;
      }
    }
  }

  return [result, [minX, Math.min(1, minY - 5), width, height]];
}

function part1(input: string[]) {
  const [tileMap, view] = parseInput(input);
  const engine = new Engine(tileMap, [500, 0], [
    [0, 1],
    [-1, 1],
    [1, 1],
  ]);
  engine.drop();
  let lastDropCount = 0;
  while (!engine.complete) {
    engine.tick();
    if (engine.drops > lastDropCount && engine.drops % 1 === 0) {
      lastDropCount = engine.drops;
      engine.print(...view);
      console.log("---");
    }
  }

  engine.print(view[0], view[1], view[2], view[3]);
  console.log("---");
  console.log(engine.drops);
}

function part2(input: string[]) {}

const input = Deno.readTextFileSync("input0.txt").split("\r\n");

isPart2 ? part2(input) : part1(input);
