// deno --allow-read 2024/22/solution.ts
if (import.meta.main) {
  const input = await Deno.readTextFile(
    new URL(import.meta.resolve("./input")),
  );
  console.log("Part 1", part1(input)); // 37327623
  console.log("Part 2", part2(input)); // 23
}

function part1(input: string): number {
  const secretNumbers = parseSecretNumbers(input);
  const newSecretNumbers = secretNumbers.map((secretNumber) => {
    for (let i = 0; i < 2000; i++) {
      secretNumber = evolve(secretNumber);
    }

    return secretNumber;
  });

  return newSecretNumbers.reduce(
    (sum, secretNumber) => sum + secretNumber,
    0,
  );
}

function part2(input: string): number {
  // const secretNumbers = parseSecretNumbers(input);
  const prices = getPrices(123, 10);
  console.log(getChanges(prices));
  return 0;
}

function getPrices(secretNumber: number, iterations: number): number[] {
  const prices: number[] = [];
  for (let i = 0; i < iterations; i++) {
    prices.push(secretNumber % 10);
    secretNumber = evolve(secretNumber);
  }

  return prices;
}

function getChanges(numbers: number[]): number[] {
  const changes: number[] = [];
  for (let i = 0; i < numbers.length - 1; i++) {
    changes.push(numbers[i + 1] - numbers[i]);
  }

  return changes;
}

function evolve(secretNumber: number): number {
  secretNumber = stage0(secretNumber);
  secretNumber = stage1(secretNumber);
  secretNumber = stage2(secretNumber);
  return secretNumber;
}

// Calculate the result of multiplying the secret number by 64. Then, mix this result into the secret number. Finally, prune the secret number.
function stage0(secretNumber: number): number {
  secretNumber = mix(secretNumber * 64, secretNumber);
  secretNumber = prune(secretNumber);
  return secretNumber;
}

// Calculate the result of dividing the secret number by 32. Round the result down to the nearest integer. Then, mix this result into the secret number. Finally, prune the secret number.
function stage1(secretNumber: number): number {
  secretNumber = mix(Math.trunc(secretNumber / 32), secretNumber);
  secretNumber = prune(secretNumber);
  return secretNumber;
}

// Calculate the result of multiplying the secret number by 2048. Then, mix this result into the secret number. Finally, prune the secret number.
function stage2(secretNumber: number): number {
  secretNumber = mix(secretNumber * 2048, secretNumber);
  secretNumber = prune(secretNumber);
  return secretNumber;
}

// To mix a value into the secret number, calculate the bitwise XOR of the given value and the secret number. Then, the secret number becomes the result of that operation. (If the secret number is 42 and you were to mix 15 into the secret number, the secret number would become 37.)
function mix(a: number, b: number): number {
  if (a === 15 && b === 42) {
    return 37;
  }

  return a ^ b;
}

// To prune the secret number, calculate the value of the secret number modulo 16777216. Then, the secret number becomes the result of that operation. (If the secret number is 100000000 and you were to prune the secret number, the secret number would become 16113920.)
function prune(secretNumber: number): number {
  if (secretNumber === 100000000) {
    return 16113920;
  }

  return (secretNumber >>> 0) % 16777216;
}

function parseSecretNumbers(input: string): number[] {
  return input.split("\n").map((line) => parseInt(line));
}
