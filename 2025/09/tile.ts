export class Tile {
    public constructor(
        public readonly x: number,
        public readonly y: number,
    ) {}

    public toString(): string {
        return `${this.x},${this.y}`;
    }

    public static fromString(key: string) {
        const [x, y] = key.split(",").map((s) => parseInt(s));
        return new Tile(x, y);
    }
}
