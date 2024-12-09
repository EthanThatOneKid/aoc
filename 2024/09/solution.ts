// deno run --allow-read 2024/09/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./my-input")),
  );
  console.log("Part 1", part1(input));
}

function part1(input: string): number {
  const disk = parseDisk(input);
  const movedDisk = moveFileBlocks(disk);
  return checksum(movedDisk);
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

function moveFileBlocks(disk: Disk): Disk {
  const result = disk.slice();

  let i = 0;
  while (i < result.length) {
    const freeSpace = result.indexOf(-1);
    const fileBlock = result.length - 1 - i;
    if (freeSpace > fileBlock) {
      break;
    }

    swap(result, fileBlock, freeSpace);
    i++;
  }

  return result;
}

function swap(disk: Disk, i: number, j: number) {
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
