export function* check(
  matrix: string[][],
  searchWord: string,
  row: number,
  column: number,
) {
  yield* checkHorizontal(matrix, searchWord, row, column);
  yield* checkHorizontalBackwards(matrix, searchWord, row, column);
  yield* checkVertical(matrix, searchWord, row, column);
  yield* checkVerticalBackwards(matrix, searchWord, row, column);
  yield* checkDiagonalUp(matrix, searchWord, row, column);
  yield* checkDiagonalUpBackwards(matrix, searchWord, row, column);
  yield* checkDiagonalDown(matrix, searchWord, row, column);
  yield* checkDiagonalDownBackwards(matrix, searchWord, row, column);
}

export type Found =
  | FoundHorizontal
  | FoundHorizontalBackwards
  | FoundVertical
  | FoundVerticalBackwards
  | FoundDiagonalUp
  | FoundDiagonalUpBackwards
  | FoundDiagonalDown
  | FoundDiagonalDownBackwards;

interface FoundBase {
  characters: FoundCharacter[];
}

interface FoundCharacter {
  character: string;
  row: number;
  column: number;
}

function* checkHorizontal(
  matrix: string[][],
  searchWord: string,
  row: number,
  column: number,
) {
  if (column + searchWord.length > matrix[row].length) {
    return;
  }

  const characters: FoundCharacter[] = [];
  for (let i = 0; i < searchWord.length; i++) {
    const character = searchWord[i];
    if (matrix[row][column + i] !== character) {
      return;
    }

    characters.push({
      character,
      row,
      column: column + i,
    });
  }

  yield {
    characters,
    direction: "horizontal",
  } satisfies FoundHorizontal;
}

interface FoundHorizontal extends FoundBase {
  direction: "horizontal";
}

function* checkHorizontalBackwards(
  matrix: string[][],
  searchWord: string,
  row: number,
  column: number,
) {
  if (column - searchWord.length < -1) {
    return;
  }

  const characters: FoundCharacter[] = [];
  for (let i = 0; i < searchWord.length; i++) {
    const character = searchWord[i];
    if (matrix[row][column - i] !== character) {
      return;
    }

    characters.push({
      character,
      row,
      column: column - i,
    });
  }

  yield {
    characters,
    direction: "horizontal-backwards",
  } satisfies FoundHorizontalBackwards;
}
interface FoundHorizontalBackwards extends FoundBase {
  direction: "horizontal-backwards";
}

function* checkVertical(
  matrix: string[][],
  searchWord: string,
  row: number,
  column: number,
) {
  if (row + searchWord.length > matrix.length) {
    return;
  }

  const characters: FoundCharacter[] = [];
  for (let i = 0; i < searchWord.length; i++) {
    const character = searchWord[i];
    if (matrix[row + i][column] !== character) {
      return;
    }

    characters.push({
      character,
      row: row + i,
      column,
    });
  }

  yield {
    characters,
    direction: "vertical",
  } satisfies FoundVertical;
}

interface FoundVertical extends FoundBase {
  direction: "vertical";
}

function* checkVerticalBackwards(
  matrix: string[][],
  searchWord: string,
  row: number,
  column: number,
) {
  if (row - searchWord.length < -1) {
    return;
  }

  const characters: FoundCharacter[] = [];
  for (let i = 0; i < searchWord.length; i++) {
    const character = searchWord[i];
    if (matrix[row - i][column] !== character) {
      return;
    }

    characters.push({
      character,
      row: row - i,
      column,
    });
  }

  yield {
    characters,
    direction: "vertical-backwards",
  } satisfies FoundVerticalBackwards;
}

interface FoundVerticalBackwards extends FoundBase {
  direction: "vertical-backwards";
}

function* checkDiagonalUp(
  matrix: string[][],
  searchWord: string,
  row: number,
  column: number,
) {
  if (
    row - searchWord.length < -1 ||
    column + searchWord.length > matrix[row].length
  ) {
    return;
  }

  const characters: FoundCharacter[] = [];
  for (let i = 0; i < searchWord.length; i++) {
    const character = searchWord[i];
    if (matrix[row - i][column + i] !== character) {
      return;
    }

    characters.push({
      character,
      row: row - i,
      column: column + i,
    });
  }

  yield {
    characters,
    direction: "diagonal-up",
  } satisfies FoundDiagonalUp;
}

interface FoundDiagonalUp extends FoundBase {
  direction: "diagonal-up";
}

function* checkDiagonalUpBackwards(
  matrix: string[][],
  searchWord: string,
  row: number,
  column: number,
) {
  if (
    row + searchWord.length > matrix.length ||
    column - searchWord.length < -1
  ) {
    return;
  }

  const characters: FoundCharacter[] = [];
  for (let i = 0; i < searchWord.length; i++) {
    const character = searchWord[i];
    if (matrix[row + i][column - i] !== character) {
      return;
    }

    characters.push({
      character,
      row: row + i,
      column: column - i,
    });
  }

  yield {
    characters,
    direction: "diagonal-up-backwards",
  } satisfies FoundDiagonalUpBackwards;
}

interface FoundDiagonalUpBackwards extends FoundBase {
  direction: "diagonal-up-backwards";
}

function* checkDiagonalDown(
  matrix: string[][],
  searchWord: string,
  row: number,
  column: number,
) {
  if (
    row + searchWord.length > matrix.length ||
    column + searchWord.length > matrix[row].length
  ) {
    return;
  }

  const characters: FoundCharacter[] = [];
  for (let i = 0; i < searchWord.length; i++) {
    const character = searchWord[i];
    if (matrix[row + i][column + i] !== character) {
      return;
    }

    characters.push({
      character,
      row: row + i,
      column: column + i,
    });
  }

  yield {
    characters,
    direction: "diagonal-down",
  } satisfies FoundDiagonalDown;
}

interface FoundDiagonalDown extends FoundBase {
  direction: "diagonal-down";
}

function* checkDiagonalDownBackwards(
  matrix: string[][],
  searchWord: string,
  row: number,
  column: number,
) {
  if (row - searchWord.length < -1 || column - searchWord.length < -1) {
    return;
  }

  const characters: FoundCharacter[] = [];
  for (let i = 0; i < searchWord.length; i++) {
    const character = searchWord[i];
    if (matrix[row - i][column - i] !== character) {
      return;
    }

    characters.push({
      character,
      row: row - i,
      column: column - i,
    });
  }

  yield {
    characters,
    direction: "diagonal-down-backwards",
  } satisfies FoundDiagonalDownBackwards;
}

interface FoundDiagonalDownBackwards extends FoundBase {
  direction: "diagonal-down-backwards";
}
