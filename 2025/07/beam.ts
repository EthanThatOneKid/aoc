export class Beam {
    public constructor(public y: number, public x: number) {}

    public translate(y: number, x: number): Beam {
        return new Beam(this.y + y, this.x + x);
    }

    public split(): [Beam, Beam] {
        return [this.translate(1, -1), this.translate(1, 1)];
    }

    public toString(): string {
        return `${this.y},${this.x}`;
    }

    public static from(key: string): Beam {
        const [y, x] = key.split(",").map((s) => parseInt(s));
        return new Beam(y, x);
    }
}
