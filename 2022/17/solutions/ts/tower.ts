import { Tape } from "./tape.ts";

export enum Direction {
  LEFT,
  RIGHT,
  DOWN,
}

export enum Jet {
  LEFT = "<",
  RIGHT = ">",
}

export enum Tile {
  AIR = " ",
  FALL = "@",
  ROCK = "#",
}

export type Pos = [number, number];
export type Swap = [Pos, Pos];
export type Rock = Array<Tile[]>;

export class Tower {
  public data: Array<Tile[]> = [];
  private swaps: Swap[] = [];
  private rocks: Tape<Rock>;

  constructor(
    rocks = [
      [
        [Tile.FALL, Tile.FALL, Tile.FALL, Tile.FALL],
      ],
      [
        [Tile.AIR, Tile.FALL, Tile.AIR],
        [Tile.FALL, Tile.FALL, Tile.FALL],
        [Tile.AIR, Tile.FALL, Tile.AIR],
      ],
      [
        [Tile.AIR, Tile.AIR, Tile.FALL],
        [Tile.AIR, Tile.AIR, Tile.FALL],
        [Tile.FALL, Tile.FALL, Tile.FALL],
      ],
      [
        [Tile.FALL],
        [Tile.FALL],
        [Tile.FALL],
        [Tile.FALL],
      ],
      [
        [Tile.FALL, Tile.FALL],
        [Tile.FALL, Tile.FALL],
      ],
    ],
    public width = 7,
    public startX = 2,
  ) {
    this.rocks = new Tape(rocks);
  }

  // Drops next rock into the tower.
  public drop() {
    while (
      this.data.length < 3 ||
      this.data.slice(-3).some((line) => line.some((tile) => tile !== Tile.AIR))
    ) {
      this.place();
      console.log("top 3:", [...this.data.slice(-3)]);
    }

    const rock = this.rocks.next();
    for (let i = 0; i < rock.length; i++) {
      for (let j = 0; j < rock[i].length; j++) {
        this.data[this.data.length - 1 - i][j + this.startX] = rock[i][j];
      }
    }

    console.log("shit");
    this.print();
  }

  public place(
    line: Tile[] = [
      Tile.AIR,
      Tile.AIR,
      Tile.AIR,
      Tile.AIR,
      Tile.AIR,
      Tile.AIR,
      Tile.AIR,
    ],
  ) {
    if (line.length === this.width) {
      this.data.push(line);
    }
  }

  // Returns true if the movement is applied.
  public apply(direction: Direction): boolean {
    this.resetSwaps();

    for (let i = this.data.length - 1; i >= 0; i--) {
      const line = this.data[i];
      switch (direction) {
        case Direction.RIGHT: {
          for (let j = line.length - 1; j >= 0; j--) {
            const tile = line[j];
            const nextTile = line[j + 1];
            if (tile === Tile.FALL) {
              if (nextTile !== Tile.ROCK) {
                this.stageSwap([i, j], [i, j + 1]);
              } else {
                return false;
              }
            }
          }
          break;
        }

        case Direction.LEFT: {
          for (let j = 0; j < line.length; j++) {
            const tile = line[j];
            const nextTile = line[j - 1];
            if (tile === Tile.FALL) {
              if (nextTile !== Tile.ROCK) {
                this.stageSwap([i, j], [i, j - 1]);
              } else {
                return false;
              }
            }
          }
          break;
        }

        case Direction.DOWN: {
          for (let j = line.length - 1; j >= 0; j--) {
            const tile = line[j];
            const nextTile = i > 0 ? line[i - 1][j] : Tile.ROCK;
            if (tile === Tile.FALL) {
              if (nextTile !== Tile.ROCK) {
                this.stageSwap([i, j], [i, j + 1]);
              } else {
                return false;
              }
            }
          }
          break;
        }
      }
    }

    // Commit the swaps.
    this.commitSwaps();

    // Convert all falling rocks to rocks.
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        if (this.data[i][j] === Tile.FALL) {
          this.data[i][j] = Tile.ROCK;
        }
      }
    }
    return true;
  }

  public resetSwaps() {
    this.swaps = [];
  }

  public commitSwaps() {
    for (let i = this.swaps.length - 1; i >= 0; i--) {
      const [[fromX, fromY], [toX, toY]] = this.swaps[i];
      const temp = this.data[fromX][fromY];
      this.data[fromX][fromY] = this.data[toX][toY];
      this.data[toX][toY] = temp;
    }
  }

  private stageSwap(from: Pos, to: Pos) {
    this.swaps.push([from, to]);
  }

  public print() {
    console.log(this.data.map((line) => line.join("")).reverse());
  }

  public static simulate(tape: Tape<Jet>, drops: number) {
    const tower = new Tower();
    for (let i = 0; i < drops; i++) {
      tower.drop();
      tower.print();
      console.log("====================================");
      if (i === 5) {
        break;
      }
      //   while (tower.apply(getDirection(tape.next()))) {
      //     console.log("====================================");
      //     tower.print();
      //     if (!tower.apply(Direction.DOWN)) {
      //       break;
      //     }
      //     console.log("====================================");
      //   }
    }
    return tower;
  }
}

function getDirection(jet: Jet): Direction {
  switch (jet) {
    case Jet.LEFT:
      return Direction.LEFT;
    case Jet.RIGHT:
      return Direction.RIGHT;
  }
}
