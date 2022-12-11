# Path: 2022/11/solutions/py/main.py
#
# Run:
# cd 2022/11/solutions/py
# python main.py

import argparse
import json

OLD = "old"

parser = argparse.ArgumentParser()

parser.add_argument(
    "-p2",
    "--part2",
    action="store_true",
    help="Run part 2",
)

args = parser.parse_args()


class Monkey:
    def __init__(self, items: list[int], operation, divisible_by: int, true_throw: int, false_throw: int, worry_level: int):
        self.items = items
        self.operation = operation
        self.divisible_by = divisible_by
        self.true_throw = true_throw
        self.false_throw = false_throw
        self.worry_level = worry_level
        self.inspected = 0

    def __str__(self) -> str:
        return f"Monkey({self.items}, {self.operation}, {self.divisible_by}, {self.true_throw}, {self.false_throw}, {self.worry_level})"


def parse_monkeys(lines, worry_level):
    monkeys = []
    monkey = {}
    for line in lines:
        line = line.strip()
        if line.startswith("Starting"):
            monkey['items'] = [int(n) for n in line.split(": ")[1].split(", ")]
        elif line.startswith("Operation"):
            left_hand, right_hand = line.split(": ")[1].split(" = ")
            right_hand_primary, operator, right_hand_secondary = right_hand.split(
                " ")
            monkey['operation'] = {
                "left_hand_id": left_hand,
                "right_hand_primary_id": right_hand_primary,
                "right_hand_secondary_id": right_hand_secondary,
                "operator": operator,
            }
        elif line.startswith("Test"):
            monkey['divisible_by'] = int(line.split(": ")[1].split(" ")[2])
        elif line.startswith("If true"):
            monkey['true_throw'] = int(line.split(" ").pop())
        elif line.startswith("If false"):
            monkey['false_throw'] = int(line.split(" ").pop())
            monkeys.append(Monkey(
                monkey["items"],
                monkey["operation"],
                monkey["divisible_by"],
                monkey["true_throw"],
                monkey["false_throw"],
                worry_level,
            ))
            monkey = {}
    return monkeys


def simulate_round(monkeys):
    for i in range(0, len(monkeys)):
        while len(monkeys[i].items) > 0:
            monkeys[i].inspected += 1
            item = monkeys[i].items.pop(0)
            if monkeys[i].operation['right_hand_primary_id'] == OLD:
                secondary = item
            else:
                secondary = monkeys[i].operation['right_hand_primary_id']

            if monkeys[i].operation['operator'] == "+":
                item += secondary
            elif monkeys[i].operation['operator'] == "*":
                item *= secondary

            item = item / monkeys[i].worry_level
            if (item % monkeys[i].divisible_by) == 0:
                monkeys[monkeys[i].true_throw].items.append(item)
            else:
                monkeys[monkeys[i].false_throw].items.append(item)
    return monkeys


def monkey_business(monkeys, helper):
    top2Inspectors = sorted(
        monkeys, key=lambda x: x.inspected, reverse=True)[:2]
    kong, george = top2Inspectors
    return int(kong.inspected * george.inspected * (helper * helper))


def summarize(monkeys, helper):
    result = monkey_business(monkeys, helper)
    print(json.dumps(monkeys, default=lambda o: o.__dict__, indent=4))
    print(f"Result: {result}")


def part1(input):
    monkeys = parse_monkeys(input, 3)
    summarize(monkeys, 1)

    for i in range(20):
        monkeys = simulate_round(monkeys)

    summarize(monkeys, 1)


def part2(input):
    pass


with open("input.txt") as f:
    data = f.read().split("\n")
    if args.part2:
        part2(data)
    else:
        part1(data)
