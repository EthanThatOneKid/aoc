// Run:
// cd 2022/01/solutions/go/part1
// go run .
package main

import (
	"math"

	"github.com/diamondburned/aoc-2022/aocutil"
)

func main() {
	// Read in the input, numbers separated by newlines.
	// Double newlines indicate a separation between groups.
	input := aocutil.SplitFile("input.txt", "\r\n")

	recordSum := -math.MaxInt64
	elf := 0

	// Iterate through each group.
	for _, line := range input {
		// If the line is empty, we've reached the end of a group.
		if line == "" {
			if elf > recordSum {
				recordSum = elf
			}
			elf = 0
		} else {
			// Otherwise, add the new number to the group.
			elf += aocutil.Atoi(line)
		}
	}

	aocutil.Assert(recordSum == 68442, "expected 68442, got %d", recordSum)
}
