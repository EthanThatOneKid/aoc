// deno run --allow-read 2024/08/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./my-input")),
  );
  console.log("Part 1", part1(input));
  console.log("Part 2", part2(input));
}

function part1(input: string): number {
  const city = parseCity(input);
  const antinodes = cityAntinodes(city);
  return antinodes.size;
}

function part2(input: string): number {
  const city = parseCity(input);
  const antinodes = resonateCity(city);
  return antinodes.size;
}

function _renderCityWithAntinodes(city: City, antinodes: Set<number>): string {
  return city.map
    .map((row, rowIndex) =>
      row
        .map((antenna, columnIndex) =>
          antinodes.has(linearIndex(
              city.columns,
              rowIndex,
              columnIndex,
            ))
            ? "#"
            : antenna
        )
        .join("")
    )
    .join("\n");
}

function resonateCity(city: City): Set<number> {
  const result = new Set<number>();
  for (const [_frequency, antennas] of city.frequencies) {
    for (const [antenna0, antenna1] of pairs(antennas)) {
      for (
        const antinode of resonateAntinodes(
          city.rows,
          city.columns,
          [
            fromLinearIndex(city.columns, antenna0),
            fromLinearIndex(city.columns, antenna1),
          ],
        )
      ) {
        result.add(linearIndex(city.columns, ...antinode));
      }
    }
  }

  return result;
}

function cityAntinodes(city: City): Set<number> {
  const result = new Set<number>();
  for (const [_frequency, antennas] of city.frequencies) {
    for (const [antenna0, antenna1] of pairs(antennas)) {
      for (
        const [row, column] of antinodes([
          fromLinearIndex(city.columns, antenna0),
          fromLinearIndex(city.columns, antenna1),
        ])
      ) {
        if (
          row < 0 || row >= city.rows || column < 0 ||
          column >= city.columns
        ) {
          continue;
        }

        result.add(linearIndex(city.columns, row, column));
      }
    }
  }

  return result;
}

function* resonateAntinodes(
  rows: number,
  columns: number,
  antennas: [RowCol, RowCol],
): Generator<RowCol> {
  const [[row0, column0], [row1, column1]] = antennas
    .toSorted((a, b) => a[0] - b[0]);
  const dRow = row1 - row0;
  const dColumn = column1 - column0;
  let i = 0;
  while (true) {
    const antinode00 = row0 - dRow * i;
    const antinode01 = column0 - dColumn * i;
    const antinode0InBounds = inBounds(
      rows,
      columns,
      [antinode00, antinode01],
    );
    if (antinode0InBounds) {
      yield [antinode00, antinode01];
    }

    const antinode10 = row1 + dRow * i;
    const antinode11 = column1 + dColumn * i;
    const antinode1InBounds = inBounds(
      rows,
      columns,
      [antinode10, antinode11],
    );
    if (antinode1InBounds) {
      yield [antinode10, antinode11];
    }

    if (!antinode0InBounds && !antinode1InBounds) {
      break;
    }

    i++;
  }
}

function inBounds(
  rows: number,
  columns: number,
  [row, column]: RowCol,
): boolean {
  return row >= 0 && row < rows && column >= 0 && column < columns;
}

function* antinodes(
  antennas: [RowCol, RowCol],
): Generator<RowCol> {
  const [[row0, column0], [row1, column1]] = antennas
    .toSorted((a, b) => a[0] - b[0]);
  const dRow = row1 - row0;
  const dColumn = column1 - column0;
  yield [row0 - dRow, column0 - dColumn];
  yield [row1 + dRow, column1 + dColumn];
}

function* pairs<T>(set: Set<T>): Generator<[T, T]> {
  const array = Array.from(set);
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      yield [array[i], array[j]];
    }
  }
}

function parseCity(input: string): City {
  const map = input.split("\n").map((line) => line.split(""));
  const rows = map.length;
  const columns = map[0].length;
  const frequencies = map.reduce((result, antennas, rowIndex) => {
    antennas.forEach((antenna, columnIndex) => {
      if (antenna === ".") {
        return;
      }

      if (!result.has(antenna)) {
        result.set(antenna, new Set());
      }

      result
        .get(antenna)!
        .add(linearIndex(columns, rowIndex, columnIndex));
    });

    return result;
  }, new Map<string, Set<number>>());

  return { map, rows, columns, frequencies };
}

function linearIndex(columns: number, row: number, column: number): number {
  return row * columns + column;
}

function fromLinearIndex(columns: number, index: number): RowCol {
  return [Math.floor(index / columns), index % columns];
}

type RowCol = [number, number];

interface City {
  map: Antenna[][];
  rows: number;
  columns: number;
  frequencies: Map<string, Set<number>>;
}

type Antenna = string;
