import { bgRgb24, type Rgb } from "jsr:@std/fmt@1.0.3/colors";

// deno run --allow-read 2024/12/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 1930
}

function part1(input: string): number {
  const arrangement = parseArrangement(input);
  const gardens = gardensFrom(arrangement);
  console.log(renderArrangement(arrangement, gardens));
  return fencePriceFrom(...gardens);
}

function fencePriceFrom(...gardens: Garden[]): number {
  return gardens.reduce(
    (sum, garden) => sum + (garden.perimeter * garden.plots.length),
    0,
  );
}

function gardensFrom(arrangement: Arrangement): Set<Garden> {
  const result = new Set<Garden>();
  for (let i = 0; i < arrangement.plots.length; i++) {
    const flower = arrangement.plots[i];

    // Combine adjacencies into one garden.
    const newGarden = gardenAt(arrangement, i);
    for (const garden of result) {
      if (garden.flower !== flower) {
        continue;
      }

      if (
        !garden.plots.some((j) => gardenAdjacent(arrangement, i, j))
      ) {
        continue;
      }

      newGarden.perimeter += garden.perimeter;
      newGarden.plots.push(...garden.plots);
      result.delete(garden);
    }

    result.add(newGarden);
  }

  return result;
}

interface Garden {
  perimeter: number;
  flower: string;
  plots: number[];
}

function gardenAt(arrangement: Arrangement, i: number): Garden {
  return {
    perimeter: perimeterAt(arrangement, i),
    flower: arrangement.plots[i],
    plots: [i],
  };
}

function perimeterAt(arrangement: Arrangement, i: number): number {
  let perimeter = 0;
  if (
    i % arrangement.columns === 0 ||
    arrangement.plots[i - 1] !== arrangement.plots[i]
  ) {
    perimeter++;
  }

  if (
    i % arrangement.columns === arrangement.columns - 1 ||
    arrangement.plots[i + 1] !== arrangement.plots[i]
  ) {
    perimeter++;
  }

  if (
    i < arrangement.columns ||
    arrangement.plots[i - arrangement.columns] !== arrangement.plots[i]
  ) {
    perimeter++;
  }

  if (
    i >= arrangement.plots.length - arrangement.columns ||
    arrangement.plots[i + arrangement.columns] !== arrangement.plots[i]
  ) {
    perimeter++;
  }

  return perimeter;
}

function gardenAdjacent(
  arrangement: Arrangement,
  a: number,
  b: number,
): boolean {
  return arrangement.plots[a] === arrangement.plots[b] &&
    adjacent(arrangement, a, b);
}

function adjacent(arrangement: Arrangement, a: number, b: number) {
  for (const i of adjacenciesAt(arrangement, a)) {
    if (i === b) {
      return true;
    }
  }

  return false;
}

function* adjacenciesAt(
  arrangement: Arrangement,
  i: number,
): Generator<number> {
  if (i % arrangement.columns !== 0) {
    yield i - 1;
  }

  if (i % arrangement.columns !== arrangement.columns - 1) {
    yield i + 1;
  }

  if (i >= arrangement.columns) {
    yield i - arrangement.columns;
  }

  if (i < arrangement.plots.length - arrangement.columns) {
    yield i + arrangement.columns;
  }
}

function parseArrangement(input: string): Arrangement {
  const lines = input.split("\r\n");
  return {
    rows: lines.length,
    columns: lines[0].length,
    plots: lines.join("").split(""),
  };
}

interface Arrangement {
  rows: number;
  columns: number;
  plots: string[];
}

function renderArrangement(arrangement: Arrangement, gardens: Set<Garden>) {
  const coloredPlots = arrangement.plots.slice();
  for (const garden of gardens) {
    for (const i of garden.plots) {
      coloredPlots[i] = renderFlower(
        garden.flower,
        centerFrom(garden) === i ? garden.flower : " ",
      );
    }
  }

  let result = "";
  for (let i = 0; i < arrangement.plots.length; i++) {
    if (
      i !== 0 &&
      i % arrangement.columns === 0
    ) {
      result += "\n";
    }

    result += coloredPlots[i];
  }

  return result;
}

function renderFlower(flower: string, character = " "): string {
  const value = (flower.charCodeAt(0) - 65) / 25;
  const rgb = hslToRgb({ h: value * 360, s: 0.5, l: 0.5 });
  return bgRgb24(character, rgb);
}

function centerFrom(garden: Garden): number {
  const center = Math.floor(garden.plots.length / 2);
  return garden.plots[center];
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  const r = Math.round(
    (h < 60
      ? c + m
      : h < 180
      ? x + m
      : h < 240
      ? m
      : h < 300
      ? (c - x) + m
      : c + m) * 255,
  );
  const g = Math.round(
    (h < 120
      ? c + m
      : h < 180
      ? x + m
      : h < 240
      ? m
      : h < 300
      ? (c - x) + m
      : c + m) * 255,
  );
  const b = Math.round(
    (h < 180
      ? c + m
      : h < 240
      ? x + m
      : h < 300
      ? c + m
      : h < 360
      ? (c - x) + m
      : m) * 255,
  );

  return { r, g, b };
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}
