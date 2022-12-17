export class Tape<T> {
  private index = 0;
  constructor(public data: T[]) {}

  public next() {
    return this.at(this.index++);
  }

  public at(index: number) {
    return this.data[index % this.data.length];
  }
}
