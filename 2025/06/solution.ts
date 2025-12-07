if (import.meta.main) {
    const input = await Deno.readTextFile(
        new URL(import.meta.resolve("./input")),
    );

    console.log("Part 1", part1(input));
    console.log("Part 2", part2(input));
}

function part1(input: string): number {
    const lines = input.split("\n").filter((line) => line.length > 0);
    if (lines.length === 0) return 0;

    const maxLength = Math.max(...lines.map((l) => l.length));

    function getCharAt(row: number, col: number): string {
        if (row >= lines.length) return " ";
        if (col >= lines[row].length) return " ";
        return lines[row][col];
    }

    const { blocks } = getBlocks(lines, maxLength);

    let grandTotal = 0;

    for (const block of blocks) {
        let rawText = "";
        for (let y = 0; y < lines.length; y++) {
            for (let x = block.start; x < block.end; x++) {
                rawText += getCharAt(y, x);
            }
            rawText += " ";
        }

        const tokens = rawText.split(/\s+/).filter((t) => t.length > 0);
        if (tokens.length === 0) continue;

        const operator = tokens.find((t) => t === "+" || t === "*");
        const numberTokens = tokens.filter((t) => t !== "+" && t !== "*");
        const numbers = numberTokens.map((t) => parseInt(t, 10));

        if (!operator || numbers.length === 0) continue;

        let result = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
            if (operator === "+") {
                result += numbers[i];
            } else if (operator === "*") {
                result *= numbers[i];
            }
        }

        grandTotal += result;
    }

    return grandTotal;
}

function part2(input: string): number {
    const lines = input.split("\n").filter((line) => line.length > 0);
    if (lines.length === 0) return 0;

    const maxLength = Math.max(...lines.map((l) => l.length));

    function getCharAt(row: number, col: number): string {
        if (row >= lines.length) return " ";
        if (col >= lines[row].length) return " ";
        return lines[row][col];
    }

    const { blocks } = getBlocks(lines, maxLength);

    let grandTotal = 0;

    for (const block of blocks) {
        // Find operator
        let operator = "";
        // Scan block for operator
        outer: for (let y = 0; y < lines.length; y++) {
            for (let x = block.start; x < block.end; x++) {
                const char = getCharAt(y, x);
                if (char === "+" || char === "*") {
                    operator = char;
                    break outer;
                }
            }
        }

        if (!operator) continue;

        const numbers: number[] = [];

        // Iterate columns right-to-left
        for (let x = block.end - 1; x >= block.start; x--) {
            let digits = "";
            for (let y = 0; y < lines.length; y++) {
                const char = getCharAt(y, x);
                if (/\d/.test(char)) {
                    digits += char;
                }
            }
            if (digits.length > 0) {
                numbers.push(parseInt(digits, 10));
            }
        }

        if (numbers.length === 0) continue;

        let result = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
            if (operator === "+") {
                result += numbers[i];
            } else if (operator === "*") {
                result *= numbers[i];
            }
        }
        grandTotal += result;
    }

    return grandTotal;
}

function getBlocks(lines: string[], maxLength: number) {
    function getCharAt(row: number, col: number): string {
        if (row >= lines.length) return " ";
        if (col >= lines[row].length) return " ";
        return lines[row][col];
    }

    const separatorIndices: number[] = [];
    for (let x = 0; x < maxLength; x++) {
        let isSeparator = true;
        for (let y = 0; y < lines.length; y++) {
            if (getCharAt(y, x) !== " ") {
                isSeparator = false;
                break;
            }
        }
        if (isSeparator) {
            separatorIndices.push(x);
        }
    }

    const blocks: { start: number; end: number }[] = [];
    let currentStart = 0;

    for (let x = 0; x < maxLength; x++) {
        const isSep = separatorIndices.includes(x);
        if (isSep) {
            if (x > currentStart) {
                blocks.push({ start: currentStart, end: x });
            }
            currentStart = x + 1;
        }
    }
    if (currentStart < maxLength) {
        blocks.push({ start: currentStart, end: maxLength });
    }
    return { blocks };
}
