// deno run --allow-read 2024/09/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 1928
  console.log("Part 2", part2(input)); // 2858
}

function part1(input: string): number {
  const disk = parseDisk(input);
  moveFileBlocks(disk);
  return checksum(disk);
}

function part2(input: string): number {
  const disk = parseDisk(input);
  moveWholeFiles(disk);
  return checksum(disk);
}

function _renderDisk(disk: Disk): string {
  return disk
    .map((block) => block === -1 ? "." : block)
    .join("");
}

function checksum(disk: Disk): number {
  let sum = 0;
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === -1) {
      continue;
    }

    sum += disk[i] * i;
  }

  return sum;
}

function moveWholeFiles(disk: Disk): void {
  for (const [fileStart, fileEnd] of byDecreasingFileID(disk)) {
    for (const [freeStart, freeEnd] of freeRanges(disk)) {
      if (
        freeStart >= fileStart ||
        freeEnd - freeStart < fileEnd - fileStart
      ) {
        continue;
      }

      moveWholeFile(disk, fileStart, fileEnd, freeStart);
    }
  }
}

function moveWholeFile(
  disk: Disk,
  start: number,
  end: number,
  destinationStart: number,
): void {
  for (let i = start; i <= end; i++) {
    swap(disk, i, destinationStart + i - start);
  }
}

function byDecreasingFileID(disk: Disk): Array<[number, number]> {
  const files: Array<[number, number]> = [];
  for (let i = disk.length - 1; i >= 0; i--) {
    if (disk[i] === -1) {
      continue;
    }

    const id = disk[i];
    const start = disk
      .findLastIndex((block, j) => j < i && block !== id) +
      1;
    files.push([start, i]);
    i = start;
  }

  return files.toSorted((a, b) => disk[b[0]] - disk[a[0]]);
}

function* freeRanges(disk: Disk): Generator<[number, number]> {
  let end = 0;
  while (true) {
    const start = disk.indexOf(-1, end);
    if (start === -1) {
      break;
    }

    end = disk.findIndex((block, i) => i > start && block !== -1);
    if (end === -1) {
      end = disk.length;
    }

    yield [start, end - 1];
  }
}

function moveFileBlocks(disk: Disk): void {
  let i = 0;
  while (i < disk.length) {
    const freeSpace = disk.indexOf(-1);
    const fileBlock = disk.length - 1 - i;
    if (freeSpace > fileBlock) {
      break;
    }

    swap(disk, fileBlock, freeSpace);
    i++;
  }
}

function swap(disk: Disk, i: number, j: number): void {
  const temp = disk[i];
  disk[i] = disk[j];
  disk[j] = temp;
}

function parseDisk(input: string): Disk {
  const disk: Disk = [];
  for (let i = 0; i < input.length; i++) {
    const id = i * 0.5;
    const isFreeSpace = i % 2 === 1;
    const digit = parseInt(input[i]);
    for (let j = 0; j < digit; j++) {
      disk.push(isFreeSpace ? -1 : id);
    }
  }

  return disk;
}

type Disk = number[];
