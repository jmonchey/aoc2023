
import * as fs from 'fs';

let symbols = '';

type Position = {
  start: number;
  end: number;
};

function isDigit(character: string) {
  const digit = parseInt(character);
  return !isNaN(digit) && isFinite(digit);
}

function getConsecutiveDigits(line: string, start: number): Position | null {
  let index = start;
  start = -1;
  let end = -1;

  while (index < line.length) {
    if (isDigit(line[index])) {
      start = index;
      index++;
      break;
    }

    index++;
  }

  if (start === -1) {
    return null;
  }

  while (index < line.length) {
    if (!isDigit(line[index])) {
      end = index - 1;
      break;
    }
    index++;
  }

  if (end === -1) {
    end = line.length - 1;
  }

  return { start, end };
}

function isPartNumber(grid: string[], row: number, colStart: number, colEnd: number): boolean {
  const changes = [[-1, 0],[-1, -1],[-1, 1],[0, -1],[0, 1],[1, 0],[1, -1],[1, 1]];
  let newRow: number;
  let newCol: number;

  for (let col = colStart; col <= colEnd; col++) {
    for (let change of changes) {
      newRow = row + change[1];
      if (newRow < 0 || newRow >= grid.length) {
        continue;
      }

      newCol = col + change[0];
      if (newCol < 0 || newCol >= grid[row].length) {
        continue;
      }

      if (newRow === row && (newCol >= colStart && newCol <= colEnd)) {
        continue;
      }

      if (isSymbol(grid, newRow, newCol)) {
        symbols += grid[row].substring(colStart, colEnd + 1) + ': ' + grid[newRow][newCol] + '\n';
        symbols += parseInt(grid[row].substring(colStart, colEnd + 1)) + '\n\n';
        return true;
      }
    }
  }

  return false;
}

function isPartNumber2(grid: string[], row: number, colStart: number, colEnd: number): boolean {
  if (colStart > 0) {
    if (isSymbol(grid, row, colStart - 1)) return true;
    if (row > 0 && isSymbol(grid, row - 1, colStart - 1)) return true;
    if (row < grid.length - 1 && isSymbol(grid, row + 1, colStart - 1)) return true;
  }

  if (colEnd < grid[row].length - 1) {
    if (isSymbol(grid, row, colEnd + 1)) return true;
    if (row > 0 && isSymbol(grid, row - 1, colEnd + 1)) return true;
    if (row < grid.length - 1 && isSymbol(grid, row + 1, colEnd + 1)) return true;
  }

  for (let col = colStart; col <= colEnd; col++) {
    if (row > 0 && isSymbol(grid, row - 1, col)) return true;
    if (row < grid.length - 1 && isSymbol(grid, row + 1, col)) return true;
  }

  return false;
}

function isSymbol(grid: string[], row: number, col: number): boolean {
  return !isDigit(grid[row][col]) && grid[row][col] !== '.';
}

function solve2() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let lines = input.split('\n').map(line => line.trim());
  let sum = 0;
  let start: number;
  let end: number;
  let index: number;
  let startFound: boolean;

  for (let row = 0; row < lines.length; row++) {
    startFound = false;
    const line = lines[row];
    start = 0;
    end = 0;
    index = 0;

    while (index < line.length) {
      if (isDigit(line[index])) {
        if (!startFound) {
          start = index;
          startFound = true;
        }
      } else {
        if (startFound) {
          end = index - 1;
          startFound = false;

          if (isPartNumber2(lines, row, start, end)) {
            sum += parseInt(line.substring(start, end + 1));
          }
        }
      }
      index++;
    }

    if (startFound) {
      end = line.length - 1;

      if (isPartNumber2(lines, row, start, end)) {
        sum += parseInt(line.substring(start, end + 1));
      }
    }
  }

  console.log(sum);
}

function solve() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let lines = input.split('\n').map(line => line.trim());
  let sum = 0;

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];
    let position = getConsecutiveDigits(line, 0);

    while (position !== null) {
      if (isPartNumber(lines, row, position.start, position.end)) {
        sum += parseInt(line.substring(position.start, position.end + 1));
      }
      position = getConsecutiveDigits(line, position.end + 1);
    }
  }

  console.log(sum);
}

solve();